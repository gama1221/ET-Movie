package com.etmovieserver;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import com.etmovieserver.services.StorageService;

@SpringBootApplication
public class EtMovieServerApplication {

    public static void main(String[] args) {
        SpringApplication.run(EtMovieServerApplication.class, args);
//        System.out.println("Welcome to me hua");
    }
    @Bean
    CommandLineRunner init(StorageService storageService) {
        return args -> {
            storageService.deleteAll();
            storageService.init();
        };
    }

}
