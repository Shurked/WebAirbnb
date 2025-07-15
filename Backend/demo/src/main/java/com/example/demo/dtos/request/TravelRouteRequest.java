package com.example.demo.dtos.request;

import lombok.Data;

import java.util.List;

@Data
public class TravelRouteRequest {
    private Long accommodationId;
    private List<Long> tourIds;
    private String notes;
}
