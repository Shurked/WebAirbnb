package com.example.demo.dtos.response;

import lombok.Data;
import java.time.LocalDate; // Importación para LocalDate
import java.util.Set;      // Importación para Set

@Data
public class AuthResponse {
    private String token;
    private String email;
    private String name;
    private String phone;
    private String location;
    private LocalDate birthDate;
    private Set<String> roles;
}
