package com.example.demo.controllers;

import com.example.demo.dtos.request.TripPlanRequest;
import com.example.demo.dtos.response.TripPlanResponse;
import com.example.demo.models.TripPlan;
import com.example.demo.services.TripPlanService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/trip-plans")
@RequiredArgsConstructor
public class TripPlanController {

    private final TripPlanService tripPlanService;

    @PostMapping
    public ResponseEntity<TripPlanResponse> create(
            @RequestBody TripPlanRequest request,
            Authentication auth) {
        TripPlan saved = tripPlanService.createTripPlan(request, auth.getName());
        TripPlanResponse response = tripPlanService.mapToResponse(saved);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<TripPlanResponse>> getByUser(@PathVariable Long userId) {
        List<TripPlan> plans = tripPlanService.getByUserId(userId);
        List<TripPlanResponse> responseList = plans.stream()
                .map(tripPlanService::mapToResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(responseList);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        tripPlanService.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
