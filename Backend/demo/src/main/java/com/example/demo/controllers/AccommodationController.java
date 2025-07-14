package com.example.demo.controllers;

import com.example.demo.dtos.request.AccommodationRequest;
import com.example.demo.dtos.response.AccommodationCardDto;
import com.example.demo.dtos.response.AccommodationDetailDto;
import com.example.demo.services.AccommodationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;
import com.example.demo.models.User;
import com.example.demo.security.UserDetailsImpl;

import org.springframework.http.MediaType;


import java.util.List;

@RestController
@RequestMapping("/accommodations")
@RequiredArgsConstructor
public class AccommodationController {
    private final AccommodationService accommodationService;

    // Endpoints GET (sin cambios)
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

    @GetMapping("/featured/rating")
    public ResponseEntity<List<AccommodationCardDto>> getFeaturedByRating(
            @RequestParam double minRating,
            @RequestParam int minReviews) {
        return ResponseEntity.ok(accommodationService.getFeaturedByRating(minRating, minReviews));
    }

    @GetMapping("/my")
    public ResponseEntity<List<AccommodationCardDto>> getMyAccommodations(Authentication authentication) {
        String hostEmail = authentication.getName();
        return ResponseEntity.ok(accommodationService.getAccommodationsByHost(hostEmail));
    }

    @GetMapping
    public ResponseEntity<List<AccommodationCardDto>> getAllActiveAccommodations() {
        return ResponseEntity.ok(accommodationService.getAllActiveAccommodations());
    }

    // Endpoints POST/PUT/DELETE (mejorados)
    @PostMapping
    public ResponseEntity<AccommodationDetailDto> createAccommodation(
            @Valid @RequestBody AccommodationRequest request,
            Authentication authentication) {
        return handleAccommodationCreation(request, null, authentication);
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<AccommodationDetailDto> createAccommodationWithImages(
            @RequestPart("accommodation") @Valid AccommodationRequest request,
            @RequestPart("images") List<MultipartFile> imageFiles,
            Authentication authentication) {
        return handleAccommodationCreation(request, imageFiles, authentication);
    }

    @PutMapping("/{id}")
    public ResponseEntity<AccommodationDetailDto> updateAccommodation(
            @PathVariable Long id,
            @Valid @RequestBody AccommodationRequest request,
            Authentication authentication) {
        String hostEmail = authentication.getName();
        return ResponseEntity.ok(accommodationService.updateAccommodation(id, request, hostEmail));
    }

    @PutMapping("/{id}/featured")
    public ResponseEntity<Void> setFeatured(
            @PathVariable Long id,
            @RequestParam boolean featured,
            Authentication authentication) {
        accommodationService.setFeatured(id, featured);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}/activate")
    public ResponseEntity<Void> activateAccommodation(
            @PathVariable Long id,
            Authentication authentication) {
        String hostEmail = authentication.getName();
        accommodationService.activateAccommodation(id, hostEmail);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAccommodation(
            @PathVariable Long id,
            Authentication authentication) {
        String hostEmail = authentication.getName();
        accommodationService.deleteAccommodation(id, hostEmail);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/review")
    public ResponseEntity<Void> addReview(@PathVariable Long id, @RequestParam double rating) {
        accommodationService.addReview(id, rating);
        return ResponseEntity.ok().build();
    }

    // Método privado para manejo centralizado de creación
    private ResponseEntity<AccommodationDetailDto> handleAccommodationCreation(
            AccommodationRequest request,
            List<MultipartFile> imageFiles,
            Authentication authentication) {
        
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        User user = userDetails.getUser();

        if (!user.getRoles().contains("ROLE_HOST")) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Solo los hosts pueden crear alojamientos.");
        }

        if (imageFiles != null && !imageFiles.isEmpty()) {
            return ResponseEntity.ok(
                accommodationService.createAccommodationWithImages(request, imageFiles, user.getEmail())
            );
        } else {
            return ResponseEntity.ok(
                accommodationService.createAccommodation(request, user.getEmail())
            );
        }
    }
}