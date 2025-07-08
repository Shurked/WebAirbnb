package com.example.demo.services;

import com.example.demo.dtos.request.AccommodationRequest;
import com.example.demo.dtos.response.UserProfileDto;
import com.example.demo.dtos.response.AccommodationCardDto;
import com.example.demo.dtos.response.AccommodationDetailDto;
import com.example.demo.exceptions.ResourceNotFoundException;
import com.example.demo.models.Accommodation;
import com.example.demo.models.User;
import com.example.demo.repositories.AccommodationRepository;
import com.example.demo.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AccommodationService {
    private final AccommodationRepository accommodationRepository;
    private final UserRepository userRepository;
    private final ModelMapper modelMapper;

    public List<AccommodationCardDto> getFeaturedAccommodations() {
        return accommodationRepository.findByIsFeaturedTrue()
                .stream()
                .map(this::convertToCardDto)
                .collect(Collectors.toList());
    }

    public List<AccommodationCardDto> searchAccommodations(String location, String type, 
                                                          Double minPrice, Double maxPrice, 
                                                          Integer guests) {
        return accommodationRepository.searchWithFilters(location, type, minPrice, maxPrice, guests)
                .stream()
                .map(this::convertToCardDto)
                .collect(Collectors.toList());
    }

    public AccommodationDetailDto getAccommodationDetails(Long id) {
        Accommodation accommodation = accommodationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Accommodation not found"));
        return convertToDetailDto(accommodation);
    }

    @Transactional
    public AccommodationDetailDto createAccommodation(AccommodationRequest request, String hostEmail) {
        User host = userRepository.findByEmail(hostEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Accommodation accommodation = modelMapper.map(request, Accommodation.class);
        accommodation.setHost(host); // asignas el host encontrado
        accommodation.setRating(5.0); // rating por defecto
        accommodation.setReviews(0); // sin reseñas al inicio

        Accommodation savedAccommodation = accommodationRepository.save(accommodation);
        return convertToDetailDto(savedAccommodation);
    }


    private AccommodationCardDto convertToCardDto(Accommodation accommodation) {
        AccommodationCardDto dto = modelMapper.map(accommodation, AccommodationCardDto.class);
        dto.setMainImage(accommodation.getImages().isEmpty() ? "" : accommodation.getImages().get(0));
        return dto;
    }

    private AccommodationDetailDto convertToDetailDto(Accommodation accommodation) {
        AccommodationDetailDto dto = modelMapper.map(accommodation, AccommodationDetailDto.class);
        dto.setHost(modelMapper.map(accommodation.getHost(), UserProfileDto.class));
        return dto;
    }
}