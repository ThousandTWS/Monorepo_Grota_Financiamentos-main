package org.example.server.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig implements WebMvcConfigurer {

    private static final String[] ALLOWED_ORIGINS = {
        "http://localhost:3001",
        "http://localhost:3000",
        "http://localhost:3002"
    };

    private static final String[] ALLOWED_METHODS = {
        "GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"
    };

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOriginPatterns(ALLOWED_ORIGINS)
                .allowedMethods(ALLOWED_METHODS)
                .allowedOriginPatterns(
                        "http://localhost:3001",
                        "http://localhost:3000",
                        "http://localhost:3002",
                        "https://servidor-grotafinanciamentos.up.railway.app"
                )
                .allowedMethods("GET", "POST", "PUT", "DELETE","PATCH", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true)
                .maxAge(3600); 
    }
}
