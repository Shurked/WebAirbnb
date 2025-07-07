package com.example.demo.services;

import com.example.demo.dtos.request.LoginRequest;
import com.example.demo.dtos.request.RegisterRequest;
import com.example.demo.dtos.response.AuthResponse;
import com.example.demo.models.User;
import com.example.demo.repositories.UserRepository; // 1. Importa el Repository
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {
    private final PasswordEncoder passwordEncoder;
    private final UserRepository userRepository; // 2. Declara el Repository

    // 3. Inyecta ambos dependencias en el constructor
    public UserService(PasswordEncoder passwordEncoder, UserRepository userRepository) {
        this.passwordEncoder = passwordEncoder;
        this.userRepository = userRepository;
    }

    public AuthResponse login(LoginRequest request) {
        // Lógica mejorada con validación
        User user = userRepository.findByEmail(request.getEmail())
            .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Contraseña incorrecta");
        }

        AuthResponse response = new AuthResponse();
        response.setToken("token_jwt_ejemplo");
        response.setEmail(user.getEmail());
        response.setName(user.getName());
        return response;
    }

    public AuthResponse register(RegisterRequest request) {
        // 1. Encriptar la contraseña
        String encodedPassword = passwordEncoder.encode(request.getPassword());
        
        // 2. Crear y guardar el usuario
        User user = new User();
        user.setEmail(request.getEmail());
        user.setPassword(encodedPassword);
        user.setName(request.getName());
        user.setHost(false);
        userRepository.save(user);

        // 3. Generar respuesta
        AuthResponse response = new AuthResponse();
        response.setToken("token_jwt_registro");
        response.setEmail(user.getEmail());
        response.setName(user.getName());
        return response;
    }
}