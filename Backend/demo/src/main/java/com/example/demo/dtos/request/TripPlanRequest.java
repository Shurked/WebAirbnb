package com.example.demo.dtos.request;

import lombok.Data;

import java.util.List;

@Data
public class TripPlanRequest {
    private List<Long> accommodationIds; // IDs alojamientos que se agregan
}
