package com.example.demo.dtos.request;

import lombok.Data;
import java.time.LocalDate;

@Data
public class UpdateUserRequest {
    private String name;
    private String email;
    private String password;
    private String phone;
    private String location;
    private LocalDate birthDate;
    private boolean isHost; // opcional
}
