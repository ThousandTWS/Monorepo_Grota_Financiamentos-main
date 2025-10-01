package org.example.server.dto;

public record Api_Response(
        boolean success,
        String message
) {}
