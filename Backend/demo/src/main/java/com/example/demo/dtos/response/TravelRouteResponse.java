package com.example.demo.dtos.response;

import lombok.Data;
import java.util.List;

@Data
public class TravelRouteResponse {
    private Long id;
    private Long accommodationId;
    private List<Long> tourIds;
    private String notes;
}
