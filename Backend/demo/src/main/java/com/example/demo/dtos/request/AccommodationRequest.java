package com.example.demo.dtos.request;

import lombok.Data;
import java.util.List;

@Data
public class AccommodationRequest {
    private String title;
    private String description;
    private double price;
    private String location;
    private List<String> images;
    private List<String> amenities;
    private int maxGuests;
    private int bedrooms;
    private int bathrooms;
    private String type;
}