package com.example.demo.services;

import com.example.demo.dtos.request.LoginRequest;
import com.example.demo.dtos.request.RegisterRequest;
import com.example.demo.dtos.response.AuthResponse;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service  // ✔️ Anotación aquí si es clase concreta
public class UserService {  // Sin "Impl"
    private final PasswordEncoder passwordEncoder;

    public UserService(PasswordEncoder passwordEncoder) {
        this.passwordEncoder = passwordEncoder;
    }

    // UserService.java
    public AuthResponse login(LoginRequest request) {
        // Ejemplo básico (implementa tu lógica real aquí)
        AuthResponse response = new AuthResponse();
        response.setToken("token_jwt_ejemplo");
        response.setEmail(request.getEmail());
        response.setName("Nombre de usuario");
        return response; // ✔️ Siempre retorna un AuthResponse
    }

    public AuthResponse register(RegisterRequest request) {
        // Ejemplo básico
        AuthResponse response = new AuthResponse();
        response.setToken("token_jwt_registro");
        response.setEmail(request.getEmail());
        response.setName(request.getName());
        return response; // ✔️ Siempre retorna un AuthResponse
    }
}