package com.example.demo.services;

import com.example.demo.dtos.request.LoginRequest;
import com.example.demo.dtos.request.RegisterRequest;
import com.example.demo.dtos.response.AuthResponse;
import com.example.demo.exceptions.ResourceNotFoundException;
import com.example.demo.models.User;
import com.example.demo.repositories.UserRepository; // 1. Importa el Repository

import java.util.HashSet;

import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import com.example.demo.security.JwtUtils; // 👈 Agrega esta importación
import org.springframework.transaction.annotation.Transactional; // 👈 Importa Transactional
import com.example.demo.dtos.request.UpdateUserRequest; // Importa UpdateUserRequest
import java.util.Set;
import java.util.List; // Importa List


@Service
public class UserService {
    private final PasswordEncoder passwordEncoder;
    private final UserRepository userRepository;
    private final JwtUtils jwtUtils; // 👈 Nuevo campo inyectado

    public UserService(PasswordEncoder passwordEncoder, UserRepository userRepository, JwtUtils jwtUtils) {
        this.passwordEncoder = passwordEncoder;
        this.userRepository = userRepository;
        this.jwtUtils = jwtUtils; // 👈 Inicializa
    }

    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
            .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Contraseña incorrecta");
        }

        String token = jwtUtils.generateToken(user.getEmail());

        AuthResponse response = new AuthResponse();
        response.setToken(token);
        response.setEmail(user.getEmail());
        response.setName(user.getName());
        response.setPhone(user.getPhone());
        response.setLocation(user.getLocation());
        response.setBirthDate(user.getBirthDate());
        response.setRoles(user.getRoles());  // Muy importante

        return response;
    }


    public AuthResponse register(RegisterRequest request) {
        String encodedPassword = passwordEncoder.encode(request.getPassword());

        User user = new User();
        user.setEmail(request.getEmail());
        user.setPassword(encodedPassword);
        user.setName(request.getName());
        user.setPhone(request.getPhone());
        user.setLocation(request.getLocation());
        user.setBirthDate(request.getBirthDate());

        Set<String> roles = new HashSet<>();
        roles.add("ROLE_USER");
        if (request.isHost()) {
            roles.add("ROLE_HOST");
        }
        user.setRoles(roles);

        userRepository.save(user);

        String token = jwtUtils.generateToken(user.getEmail());

        AuthResponse response = new AuthResponse();
        response.setToken(token);
        response.setEmail(user.getEmail());
        response.setName(user.getName());
        response.setName(user.getName());
        response.setRoles(user.getRoles()); // Incluir roles en la respuesta
        return response;
    }


    @Transactional 
    public void deleteUserByEmail(String email) {
        userRepository.deleteByEmail(email);
    }

    @Transactional
    public void updateUser(String currentEmail, UpdateUserRequest request) {
        User user = userRepository.findByEmail(currentEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPhone(request.getPhone());
        user.setLocation(request.getLocation());
        user.setBirthDate(request.getBirthDate());

        if (request.getPassword() != null && !request.getPassword().isBlank()) {
            user.setPassword(passwordEncoder.encode(request.getPassword()));
        }

        // Actualizar rol HOST según el booleano
        if (request.isHost()) {
            user.getRoles().add("ROLE_HOST");
        } else {
            user.getRoles().remove("ROLE_HOST");
        }

        userRepository.save(user);
    }


    public void toggleHost(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Set<String> roles = user.getRoles();
        if (roles.contains("ROLE_HOST")) {
            roles.remove("ROLE_HOST");
        } else {
            roles.add("ROLE_HOST");
        }

        user.setRoles(roles);
        userRepository.save(user);
    }


    public AuthResponse getUserInfo(String email) {
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado"));

        AuthResponse response = new AuthResponse();
        response.setToken(null); // solo para mostrar info
        response.setEmail(user.getEmail());
        response.setName(user.getName());
        response.setPhone(user.getPhone());
        response.setLocation(user.getLocation());
        response.setBirthDate(user.getBirthDate());
        response.setRoles(user.getRoles());

        return response;
    }

    @Transactional
    public void updateUserRoles(String email, List<String> newRoles) {
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));
        
        user.setRoles(new HashSet<>(newRoles)); // Actualiza los roles
        userRepository.save(user);
    }


}
