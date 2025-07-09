package com.example.demo.controllers;

import com.example.demo.dtos.request.AccommodationRequest;
import com.example.demo.dtos.response.AccommodationCardDto;
import com.example.demo.dtos.response.AccommodationDetailDto;
import com.example.demo.services.AccommodationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/accommodations")
@RequiredArgsConstructor
public class AccommodationController {
    private final AccommodationService accommodationService;

    @GetMapping("/featured")
    public ResponseEntity<List<AccommodationCardDto>> getFeaturedAccommodations() {
        return ResponseEntity.ok(accommodationService.getFeaturedAccommodations());
    }

    @GetMapping("/search")
    public ResponseEntity<List<AccommodationCardDto>> searchAccommodations(
            @RequestParam(required = false) String location,
            @RequestParam(required = false) String type,
            @RequestParam(required = false) Double minPrice,
            @RequestParam(required = false) Double maxPrice,
            @RequestParam(required = false) Integer guests) {
        return ResponseEntity.ok(accommodationService.searchAccommodations(
                location, type, minPrice, maxPrice, guests));
    }

    @GetMapping("/{id}")
    public ResponseEntity<AccommodationDetailDto> getAccommodationDetails(@PathVariable Long id) {
        return ResponseEntity.ok(accommodationService.getAccommodationDetails(id));
    }

    @PostMapping
    public ResponseEntity<AccommodationDetailDto> createAccommodation(
            @Valid @RequestBody AccommodationRequest request,
            Authentication authentication) {   // Aquí recibes el usuario autenticado
        String hostEmail = authentication.getName();  // Obtienes el email del usuario logueado
        return ResponseEntity.ok(accommodationService.createAccommodation(request, hostEmail));
    }

}