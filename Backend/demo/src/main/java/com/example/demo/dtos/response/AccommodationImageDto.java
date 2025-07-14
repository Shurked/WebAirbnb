package com.example.demo.dtos.response;

import lombok.Data;

@Data
public class AccommodationImageDto {
    private String imagesBase64;
    private String contentType;
}