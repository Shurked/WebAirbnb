package com.example.demo.controllers;


import com.example.demo.dtos.request.TourServiceRequest;
import com.example.demo.dtos.response.TourServiceResponse;
import com.example.demo.exceptions.ResourceNotFoundException;
import com.example.demo.models.TourImage;
import com.example.demo.models.TourService;
import com.example.demo.repositories.TourImageRepository;
import com.example.demo.repositories.TourServiceRepository;
import com.example.demo.services.TourServiceService;
import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;



import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/tours")
@RequiredArgsConstructor
public class TourServiceController {

    private final TourServiceService service;
    private final TourServiceRepository tourServiceRepository;
    private final TourImageRepository tourImageRepository;

    @PostMapping
    public ResponseEntity<TourServiceResponse> create(
            @RequestBody @Valid TourServiceRequest request,
            Authentication authentication) {
        String email = authentication.getName();
        return ResponseEntity.ok(service.create(request, email));
    }

    @GetMapping("/location")
    public ResponseEntity<List<TourServiceResponse>> getByLocation(@RequestParam String location) {
        return ResponseEntity.ok(service.getByLocation(location));
    }

    @GetMapping("/my")
    public ResponseEntity<List<TourServiceResponse>> getByHost(Authentication auth) {
        return ResponseEntity.ok(service.getByHost(auth.getName()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id, Authentication auth) {
        service.delete(id, auth.getName());
        return ResponseEntity.noContent().build();
    }

    
    @PostMapping("/{tourId}/images")
    public ResponseEntity<?> uploadTourImage(@PathVariable Long tourId, 
                                            @RequestParam("image") MultipartFile file) {
        try {
            TourImage img = new TourImage();
            img.setContentType(file.getContentType());
            img.setData(file.getBytes());

            TourService tour = tourServiceRepository.findById(tourId)
                            .orElseThrow(() -> new ResourceNotFoundException("Tour not found"));
            img.setTourService(tour);

            tourImageRepository.save(img);

            return ResponseEntity.ok("Image uploaded successfully");
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error uploading image");
        }
    }

}
