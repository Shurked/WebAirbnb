package com.example.demo.controllers;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import com.example.demo.dtos.request.LoginRequest;
import com.example.demo.dtos.request.RegisterRequest;
import com.example.demo.dtos.response.AuthResponse;
import com.example.demo.services.UserService;  // ✔️ Usa UserService

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import com.example.demo.dtos.request.UpdateUserRequest; // ✔️ Importa UpdateUserRequest
import java.util.List;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "http://localhost:5173") // Agregar esta línea
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
    
    @DeleteMapping("/delete")
    public ResponseEntity<String> deleteAccount(Authentication authentication) {
        String email = authentication.getName(); // Usuario logueado
        userService.deleteUserByEmail(email);
        return ResponseEntity.ok("Cuenta eliminada correctamente.");
    }

    @PutMapping("/update")
    public ResponseEntity<String> updateUser(
            @RequestBody UpdateUserRequest request,
            Authentication authentication) {
        
        String currentEmail = authentication.getName();
        userService.updateUser(currentEmail, request);
        return ResponseEntity.ok("Usuario actualizado correctamente");
    }
    @PutMapping("/host/toggle")
    public ResponseEntity<String> toggleHost(Authentication auth) {
        String email = auth.getName();
        userService.toggleHost(email);  // Cambia de true a false o viceversa
        return ResponseEntity.ok("Estado de host actualizado");
    }

    @GetMapping("/me")
    public AuthResponse getCurrentUser(Authentication authentication) {
        String email = authentication.getName(); // El email viene del token JWT
        return userService.getUserInfo(email);   // Devuelve nombre, email, isHost, etc.
    }
    @PutMapping("/roles/update")
    public ResponseEntity<String> updateRoles(
        @RequestParam String email,
        @RequestParam List<String> newRoles,
        Authentication authentication
    ) {
        // Obtener el email del usuario autenticado
        String currentUserEmail = authentication.getName();
        
        // Opcional: Validar que el usuario solo pueda actualizar sus propios roles
        // (si no quieres esto, elimina esta parte)
        if (!currentUserEmail.equals(email)) {
            throw new ResponseStatusException(
                HttpStatus.FORBIDDEN, 
                "Solo puedes actualizar tus propios roles"
            );
        }

        userService.updateUserRoles(email, newRoles);
        return ResponseEntity.ok("Roles actualizados correctamente");
    }
}