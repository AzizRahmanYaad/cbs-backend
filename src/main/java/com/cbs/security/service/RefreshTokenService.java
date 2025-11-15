package com.cbs.security.service;

import com.cbs.auth.entity.RefreshToken;
import com.cbs.auth.entity.User;
import com.cbs.auth.repository.RefreshTokenRepository;
import com.cbs.exception.TokenRefreshException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class RefreshTokenService {

    private final RefreshTokenRepository refreshTokenRepository;
    private final JwtTokenService jwtTokenService;

    @Transactional
    public RefreshToken createRefreshToken(User user) {
        if (!user.getIsActive()) {
            throw new TokenRefreshException("Cannot create refresh token: User account is disabled");
        }
        
        if (user.getIsLocked()) {
            throw new TokenRefreshException("Cannot create refresh token: User account is locked");
        }
        
        refreshTokenRepository.deleteByUser(user);
        refreshTokenRepository.flush();
        
        RefreshToken refreshToken = RefreshToken.builder()
                .user(user)
                .token(UUID.randomUUID().toString())
                .expiryDate(LocalDateTime.now().plusSeconds(jwtTokenService.getRefreshExpirationMs() / 1000))
                .build();

        return refreshTokenRepository.save(refreshToken);
    }

    public Optional<RefreshToken> findByToken(String token) {
        return refreshTokenRepository.findByToken(token);
    }

    public RefreshToken verifyExpiration(RefreshToken token) {
        if (token.isExpired()) {
            refreshTokenRepository.delete(token);
            throw new TokenRefreshException("Refresh token was expired. Please make a new signin request");
        }
        
        User user = token.getUser();
        if (!user.getIsActive()) {
            refreshTokenRepository.delete(token);
            throw new TokenRefreshException("User account is disabled");
        }
        
        if (user.getIsLocked()) {
            refreshTokenRepository.delete(token);
            throw new TokenRefreshException("User account is locked");
        }
        
        return token;
    }

    @Transactional
    public void deleteByUser(User user) {
        refreshTokenRepository.deleteByUser(user);
    }

    @Transactional
    public void deleteExpiredTokens() {
        refreshTokenRepository.deleteAllExpiredTokens(LocalDateTime.now());
    }
}
