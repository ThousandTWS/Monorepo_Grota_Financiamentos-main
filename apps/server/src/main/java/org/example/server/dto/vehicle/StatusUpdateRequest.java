package org.example.server.dto.vehicle;

import org.example.server.enums.VehicleStatus;

public record StatusUpdateRequest(VehicleStatus status) {}
