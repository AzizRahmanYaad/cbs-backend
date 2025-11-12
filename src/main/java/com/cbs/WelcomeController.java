package com.cbs;

import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
class WelcomeController {

	private static final String WELCOME_MESSAGE = "Welcome to the CBS backend!";

	@GetMapping(value = "/welcome", produces = MediaType.TEXT_PLAIN_VALUE)
	String getWelcomeMessage() {
		return WELCOME_MESSAGE;
	}

}
