package com.example.demo.services;

import com.example.demo.dtos.response.AccommodationCardDto;
import com.example.demo.exceptions.ResourceNotFoundException;
import com.example.demo.models.Accommodation;
import com.example.demo.models.Favorite;
import com.example.demo.models.User;
import com.example.demo.repositories.AccommodationRepository;
import com.example.demo.repositories.FavoriteRepository;
import com.example.demo.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import java.util.Base64;


import java.util.List;

@Service
@RequiredArgsConstructor
public class FavoriteService {

    private final FavoriteRepository favoriteRepository;
    private final UserRepository userRepository;
    private final AccommodationRepository accommodationRepository;
    private final ModelMapper modelMapper;

    public void toggleFavorite(String email, Long accommodationId) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        Accommodation accommodation = accommodationRepository.findById(accommodationId)
                .orElseThrow(() -> new ResourceNotFoundException("Accommodation not found"));

        favoriteRepository.findByUserAndAccommodation(user, accommodation)
                .ifPresentOrElse(
                        favoriteRepository::delete,
                        () -> favoriteRepository.save(new Favorite(null, user, accommodation))
                );
    }

        public List<AccommodationCardDto> getFavorites(String email) {
                User user = userRepository.findByEmail(email)
                        .orElseThrow(() -> new ResourceNotFoundException("User not found"));

                return favoriteRepository.findByUser(user).stream()
                        .map(Favorite::getAccommodation)
                        .map(accommodation -> {
                        AccommodationCardDto dto = modelMapper.map(accommodation, AccommodationCardDto.class);
                        // Convertir AccommodationImage a Base64
                        dto.setMainImage(
                                accommodation.getImages().isEmpty() ? 
                                "" : 
                                Base64.getEncoder().encodeToString(accommodation.getImages().get(0).getData())
                        );
                        return dto;
                        })
                        .toList();
        }
}
