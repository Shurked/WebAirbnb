package com.example.demo.dtos.response;


import lombok.Data;

@Data
public class TourImageDto {
    private String imagesBase64;
    private String contentType;
}