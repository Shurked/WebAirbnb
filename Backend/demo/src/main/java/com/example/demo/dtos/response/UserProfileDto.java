package com.example.demo.dtos.response;

import lombok.Data;

@Data
public class UserProfileDto {
    private Long id;
    private String name;
    private String email;
    private String avatar;
    private boolean isHost;
}