package com.cbs;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class CbsBackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(CbsBackendApplication.class, args);
		System.out.println("\n==============================================");
		System.out.println("🎉 Welcome to CBS Backend Application! 🎉");
		System.out.println("==============================================");
		System.out.println("Unified Dashboard for CBS Team");
		System.out.println("Server running at: http://localhost:8085");
		System.out.println("Welcome endpoint: http://localhost:8085/api/welcome");
		System.out.println("==============================================\n");
	}

}
