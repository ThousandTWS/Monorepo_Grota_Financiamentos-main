package org.example.server.dto.address;

public record AddressDTO(
        String street,
        String number,
        String complement,
        String neighborhood,
        String state,
        String zipCode
) {
}
