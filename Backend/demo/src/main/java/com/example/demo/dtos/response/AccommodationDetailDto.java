package com.example.demo.dtos.response;

import com.example.demo.dtos.response.UserProfileDto;
import lombok.Data;
import java.util.List;

@Data
public class AccommodationDetailDto {
    private Long id;
    private String title;
    private String description;
    private double price;
    private String location;
    private List<String> images;
    private List<String> amenities;
    private double rating;
    private int reviews;
    private UserProfileDto host;
    private int maxGuests;
    private int bedrooms;
    private int bathrooms;
    private String type;
}