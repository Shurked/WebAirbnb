package com.example.demo.controllers;

import com.example.demo.dtos.request.LoginRequest;
import com.example.demo.dtos.request.RegisterRequest;
import com.example.demo.dtos.response.AuthResponse;
import com.example.demo.services.UserService;  // ✔️ Usa UserService
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final UserService userService;  // ✔️ Inyecta UserService

    public AuthController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/login")
    public AuthResponse login(@RequestBody LoginRequest request) {
        return userService.login(request);  // ✔️ Delega a UserService
    }

    @PostMapping("/register")
    public AuthResponse register(@RequestBody RegisterRequest request) {
        return userService.register(request);
    }
}