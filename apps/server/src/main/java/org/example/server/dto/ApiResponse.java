package org.example.server.dto;

public record ApiResponse(
        boolean success,
        String message
) {}
