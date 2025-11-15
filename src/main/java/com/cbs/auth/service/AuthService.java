package com.cbs.auth.service;

import com.cbs.auth.dto.AuthResponse;
import com.cbs.auth.dto.LoginRequest;
import com.cbs.auth.dto.RefreshTokenRequest;
import com.cbs.auth.entity.RefreshToken;
import com.cbs.auth.entity.User;
import com.cbs.auth.repository.UserRepository;
import com.cbs.security.service.JwtTokenService;
import com.cbs.security.service.RefreshTokenService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final JwtTokenService jwtTokenService;
    private final RefreshTokenService refreshTokenService;
    private final UserRepository userRepository;

    @Transactional
    public AuthResponse login(LoginRequest loginRequest) {
        log.info("Attempting login for user: {}", loginRequest.getUsername());

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getUsername(),
                        loginRequest.getPassword()
                )
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);

        String jwt = jwtTokenService.generateToken(authentication);

        User user = userRepository.findByUsername(loginRequest.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setLastLoginAt(LocalDateTime.now());
        userRepository.save(user);

        RefreshToken refreshToken = refreshTokenService.createRefreshToken(user);

        List<String> roles = user.getRoles().stream()
                .map(role -> role.getName())
                .collect(Collectors.toList());

        log.info("Login successful for user: {}", loginRequest.getUsername());

        return AuthResponse.builder()
                .accessToken(jwt)
                .refreshToken(refreshToken.getToken())
                .tokenType("Bearer")
                .userId(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .roles(roles)
                .build();
    }

    @Transactional
    public AuthResponse refreshToken(RefreshTokenRequest request) {
        log.info("Attempting to refresh token");

        RefreshToken oldRefreshToken = refreshTokenService.findByToken(request.getRefreshToken())
                .orElseThrow(() -> new com.cbs.exception.TokenRefreshException("Refresh token not found"));

        oldRefreshToken = refreshTokenService.verifyExpiration(oldRefreshToken);
        
        RefreshToken refreshToken = refreshTokenService.createRefreshToken(oldRefreshToken.getUser());

        User user = oldRefreshToken.getUser();

        List<String> authorities = user.getRoles().stream()
                .flatMap(role -> {
                    var roleAuthority = role.getName();
                    var permissionAuthorities = role.getPermissions().stream()
                            .map(permission -> permission.getName())
                            .collect(Collectors.toList());
                    permissionAuthorities.add(roleAuthority);
                    return permissionAuthorities.stream();
                })
                .collect(Collectors.toList());

        String jwt = jwtTokenService.generateToken(user.getUsername(), authorities);

        List<String> roles = user.getRoles().stream()
                .map(role -> role.getName())
                .collect(Collectors.toList());

        log.info("Token refresh successful for user: {}", user.getUsername());

        return AuthResponse.builder()
                .accessToken(jwt)
                .refreshToken(refreshToken.getToken())
                .tokenType("Bearer")
                .userId(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .roles(roles)
                .build();
    }

    @Transactional
    public void logout() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getName() != null) {
            String username = authentication.getName();
            log.info("Logging out user: {}", username);
            
            userRepository.findByUsername(username).ifPresent(user -> {
                refreshTokenService.deleteByUser(user);
                log.info("Logout successful for user: {}", username);
            });
        }
        SecurityContextHolder.clearContext();
    }
}
