package com.example.demo.controllers;

import com.example.demo.dtos.request.TravelRouteRequest;
import com.example.demo.dtos.response.TravelRouteResponse;
import com.example.demo.models.TravelRoute;
import com.example.demo.services.TravelRouteService;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/travel-routes")
@RequiredArgsConstructor
public class TravelRouteController {

    private final TravelRouteService travelRouteService;

    @PostMapping
    public ResponseEntity<TravelRouteResponse> create(
            @RequestBody TravelRouteRequest request,
            Authentication auth) {

        TravelRoute saved = travelRouteService.save(request, auth.getName());
        TravelRouteResponse response = travelRouteService.mapToResponse(saved);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<TravelRouteResponse>> getByUser(@PathVariable Long userId) {
        List<TravelRoute> routes = travelRouteService.getByUserId(userId);
        List<TravelRouteResponse> responseList = routes.stream()
                .map(travelRouteService::mapToResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(responseList);
    }

    @GetMapping("/{id}")
    public ResponseEntity<TravelRouteResponse> getById(@PathVariable Long id) {
        return travelRouteService.getById(id)
                .map(travelRouteService::mapToResponse)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        travelRouteService.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
