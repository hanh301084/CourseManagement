package com.fpt.scms;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration;

@SpringBootApplication
public class ScmsApplication {

    public static void main(String[] args) {
        SpringApplication.run(ScmsApplication.class, args);
    }

}
