package com.example.demo.services;

import com.example.demo.dtos.request.TravelRouteRequest;
import com.example.demo.dtos.response.TravelRouteResponse;
import com.example.demo.exceptions.ResourceNotFoundException;
import com.example.demo.models.*;
import com.example.demo.repositories.*;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class TravelRouteService {
    
    private final TravelRouteRepository travelRouteRepository;
    private final UserRepository userRepository;
    private final AccommodationRepository accommodationRepository;
    private final TourServiceRepository tourServiceRepository;

    public TravelRoute save(TravelRouteRequest request, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Accommodation accommodation = accommodationRepository.findById(request.getAccommodationId())
                .orElseThrow(() -> new ResourceNotFoundException("Accommodation not found"));

        List<TourService> tours = tourServiceRepository.findAllById(request.getTourIds());

        TravelRoute route = new TravelRoute();
        route.setUser(user);
        route.setAccommodation(accommodation);
        route.setTours(tours);
        route.setNotes(request.getNotes());

        return travelRouteRepository.save(route);
    }

    public List<TravelRoute> getByUserId(Long userId) {
        return travelRouteRepository.findByUserId(userId);
    }

    public Optional<TravelRoute> getById(Long id) {
        return travelRouteRepository.findById(id);
    }

    public void deleteById(Long id) {
        travelRouteRepository.deleteById(id);
    }

    public TravelRouteResponse mapToResponse(TravelRoute route) {
        TravelRouteResponse response = new TravelRouteResponse();
        response.setId(route.getId());
        response.setAccommodationId(route.getAccommodation().getId());
        response.setTourIds(route.getTours().stream().map(TourService::getId).toList());
        response.setNotes(route.getNotes());
        return response;
    }
}
