package com.example.demo.dtos.request;

import lombok.Data;

@Data
public class TourServiceRequest {
    private String title;
    private String description;
    private double price;
    private String location;
}
