package com.example.demo.dtos.response;

import lombok.Data;
import java.util.List;

@Data
public class TripPlanResponse {
    private Long id;
    private List<Long> accommodationIds;
    private Long userId;
}
