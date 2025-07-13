package com.example.demo.dtos.request;

import lombok.Data;
import java.time.LocalDate; // Esta es la importación que falta

@Data
public class RegisterRequest {
    private String email;
    private String password;
    private String name;
    private String phone;
    private String location;
    private LocalDate birthDate;
    private boolean isHost; // este campo solo define si agregar el rol "ROLE_HOST"
}
