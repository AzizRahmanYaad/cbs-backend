package com.cbs;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
public class WelcomeController {

	@GetMapping("/api/welcome")
	public Map<String, String> welcome() {
		return Map.of("message", "Welcome to the CBS backend!");
	}
}
