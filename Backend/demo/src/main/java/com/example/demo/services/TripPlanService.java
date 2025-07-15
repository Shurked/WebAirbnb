package com.example.demo.services;

import com.example.demo.dtos.request.TripPlanRequest;
import com.example.demo.dtos.response.TripPlanResponse;
import com.example.demo.exceptions.ResourceNotFoundException;
import com.example.demo.models.Accommodation;
import com.example.demo.models.TripPlan;
import com.example.demo.models.User;
import com.example.demo.repositories.AccommodationRepository;
import com.example.demo.repositories.TripPlanRepository;
import com.example.demo.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TripPlanService {

    private final TripPlanRepository tripPlanRepository;
    private final UserRepository userRepository;
    private final AccommodationRepository accommodationRepository;

    public TripPlan createTripPlan(TripPlanRequest request, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        List<Accommodation> accommodations = accommodationRepository.findAllById(request.getAccommodationIds());

        if(accommodations.isEmpty()){
            throw new ResourceNotFoundException("No accommodations found with provided IDs");
        }

        TripPlan tripPlan = new TripPlan();
        tripPlan.setUser(user);
        tripPlan.setAccommodations(accommodations);

        return tripPlanRepository.save(tripPlan);
    }

    public List<TripPlan> getByUserId(Long userId) {
        return tripPlanRepository.findByUserId(userId);
    }

    public void deleteById(Long id) {
        tripPlanRepository.deleteById(id);
    }

    public TripPlanResponse mapToResponse(TripPlan tripPlan) {
        TripPlanResponse response = new TripPlanResponse();
        response.setId(tripPlan.getId());
        response.setUserId(tripPlan.getUser().getId());
        response.setAccommodationIds(tripPlan.getAccommodations().stream()
                .map(Accommodation::getId)
                .collect(Collectors.toList()));
        return response;
    }
}
