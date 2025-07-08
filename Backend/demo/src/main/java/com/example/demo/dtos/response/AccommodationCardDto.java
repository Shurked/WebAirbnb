package com.example.demo.dtos.response;

import lombok.Data;

@Data
public class AccommodationCardDto {
    private Long id;
    private String title;
    private String description;
    private double price;
    private String location;
    private String mainImage;
    private double rating;
    private int reviews;
    private int maxGuests;
    private int bedrooms;
    private int bathrooms;
    private String type;
}