package com.example.demo.services;

import com.example.demo.dtos.request.TourServiceRequest;
import com.example.demo.dtos.response.TourServiceResponse;
import com.example.demo.exceptions.ResourceNotFoundException;
import com.example.demo.models.TourService;
import com.example.demo.models.User;
import com.example.demo.repositories.TourServiceRepository;
import com.example.demo.repositories.UserRepository;

import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TourServiceService {

    private final TourServiceRepository tourRepo;
    private final UserRepository userRepo;
    private final ModelMapper modelMapper;

    public TourServiceResponse create(TourServiceRequest request, String hostEmail) {
        User host = userRepo.findByEmail(hostEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Host not found with email: " + hostEmail));

        TourService tour = modelMapper.map(request, TourService.class);
        tour.setHost(host);

        return modelMapper.map(tourRepo.save(tour), TourServiceResponse.class);
    }

    public List<TourServiceResponse> getByLocation(String location) {
        return tourRepo.findByLocationIgnoreCase(location).stream()
                .map(t -> {
                    TourServiceResponse dto = modelMapper.map(t, TourServiceResponse.class);
                    dto.setHostName(t.getHost().getName());
                    return dto;
                })
                .toList();
    }

    public List<TourServiceResponse> getByHost(String email) {
        return tourRepo.findByHostEmail(email).stream()
                .map(t -> modelMapper.map(t, TourServiceResponse.class))
                .toList();
    }

    public void delete(Long id, String email) {
        TourService tour = tourRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Tour not found with id: " + id));

        if (!tour.getHost().getEmail().equals(email)) {
            throw new AccessDeniedException("No autorizado");
        }

        tourRepo.delete(tour);
    }
}
