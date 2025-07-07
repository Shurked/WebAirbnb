package com.example.demo.dtos.request;

import lombok.Data;

@Data
public class RegisterRequest {
    private String email;
    private String password;
    private String name;
    // Agrega otros campos si necesitas (ej: isHost)
}