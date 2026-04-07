package com.odoo.Quickcourt;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableJpaAuditing
@EnableAsync
public class QuickcourtApplication {

	public static void main(String[] args) {



		Dotenv dotenv = Dotenv.configure()
				.ignoreIfMissing() // important for prod (Render, Railway)
				.load();

		// ✅ Make variables available to Spring
		dotenv.entries().forEach(entry ->
				System.setProperty(entry.getKey(), entry.getValue())
		);

		SpringApplication.run(QuickcourtApplication.class, args);
	}

}
