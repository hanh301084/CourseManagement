package com.fpt.scms.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {


        @Override
        public void addCorsMappings(CorsRegistry registry) {
            registry.addMapping("/**") // Apply CORS to all endpoints
                    .allowedOrigins("http://localhost:3000") // Allowed origin(s)
//                    .allowedOrigins("http://scms.mom") // Allowed origin(s)
                    .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS") // Allowed methods
                    .allowedHeaders("*") // Allowed headers
                    .allowCredentials(true) // If you need cookies or authorization headers
                    .maxAge(3600); // Cache duration for CORS preflight requests}
    }
}