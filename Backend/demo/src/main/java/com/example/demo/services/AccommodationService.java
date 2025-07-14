package com.example.demo.services;

import com.example.demo.dtos.request.AccommodationRequest;
import com.example.demo.dtos.response.UserProfileDto;
import com.example.demo.dtos.response.AccommodationCardDto;
import com.example.demo.dtos.response.AccommodationDetailDto;
import com.example.demo.dtos.response.AccommodationImageDto;
import com.example.demo.exceptions.ResourceNotFoundException;
import com.example.demo.models.Accommodation;
import com.example.demo.models.AccommodationImage;
import com.example.demo.models.User;
import com.example.demo.repositories.AccommodationRepository;
import com.example.demo.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Base64;
import java.util.List;
import java.util.stream.Collectors;
import java.util.Collections;


@Service
@RequiredArgsConstructor
public class AccommodationService {
    private final AccommodationRepository accommodationRepository;
    private final UserRepository userRepository;
    private final ModelMapper modelMapper;

    public List<AccommodationCardDto> getFeaturedAccommodations() {
        return accommodationRepository.findByIsFeaturedTrueAndActiveTrue()
                .stream()
                .map(this::convertToCardDto)
                .collect(Collectors.toList());
    }

    public List<AccommodationCardDto> searchAccommodations(String location, String type,
                                                          Double minPrice, Double maxPrice,
                                                          Integer guests) {
        return accommodationRepository.searchWithFilters(location, type, minPrice, maxPrice, guests)
                .stream()
                .filter(Accommodation::isActive)
                .map(this::convertToCardDto)
                .collect(Collectors.toList());
    }

    public AccommodationDetailDto getAccommodationDetails(Long id) {
        Accommodation accommodation = accommodationRepository.findById(id)
                .filter(Accommodation::isActive)
                .orElseThrow(() -> new ResourceNotFoundException("Accommodation not found or inactive"));
        return convertToDetailDto(accommodation);
    }

    @Transactional
    public AccommodationDetailDto createAccommodation(AccommodationRequest request, String hostEmail) {
        return createAccommodationWithImages(request, List.of(), hostEmail);
    }

    @Transactional
    public AccommodationDetailDto createAccommodationWithImages(
            AccommodationRequest request,
            List<MultipartFile> imageFiles,
            String hostEmail) {

        User host = userRepository.findByEmail(hostEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Accommodation accommodation = modelMapper.map(request, Accommodation.class);
        accommodation.setHost(host);
        accommodation.setRating(5.0);
        accommodation.setReviews(0);
        accommodation.setActive(true);

        // Guardar imágenes
        List<AccommodationImage> imageEntities = imageFiles.stream()
                .map(file -> {
                    try {
                        AccommodationImage image = new AccommodationImage();
                        image.setData(file.getBytes());
                        image.setContentType(file.getContentType());
                        image.setAccommodation(accommodation);
                        return image;
                    } catch (IOException e) {
                        throw new RuntimeException("Error al procesar imagen: " + e.getMessage());
                    }
                })
                .collect(Collectors.toList());

        accommodation.setImages(imageEntities);
        Accommodation savedAccommodation = accommodationRepository.save(accommodation);

        return convertToDetailDto(savedAccommodation);
    }

    public AccommodationDetailDto updateAccommodation(Long id, AccommodationRequest request, String hostEmail) {
        Accommodation accommodation = accommodationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Alojamiento no encontrado"));

        if (!accommodation.getHost().getEmail().equals(hostEmail)) {
            throw new RuntimeException("No autorizado para modificar este alojamiento");
        }

        accommodation.setTitle(request.getTitle());
        accommodation.setDescription(request.getDescription());
        accommodation.setPrice(request.getPrice());
        accommodation.setLocation(request.getLocation());
        accommodation.setMaxGuests(request.getMaxGuests());
        accommodation.setBedrooms(request.getBedrooms());
        accommodation.setBathrooms(request.getBathrooms());
        accommodation.setType(request.getType());

        accommodationRepository.save(accommodation);
        return convertToDetailDto(accommodation);
    }

    @Transactional
    public void deleteAccommodation(Long id, String hostEmail) {
        Accommodation accommodation = accommodationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Alojamiento no encontrado"));

        if (!accommodation.getHost().getEmail().equals(hostEmail)) {
            throw new RuntimeException("No autorizado para eliminar este alojamiento");
        }

        accommodation.setActive(false);
        accommodationRepository.save(accommodation);
    }

    @Transactional
    public void activateAccommodation(Long id, String hostEmail) {
        Accommodation accommodation = accommodationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Alojamiento no encontrado"));

        if (!accommodation.getHost().getEmail().equals(hostEmail)) {
            throw new RuntimeException("No autorizado para activar este alojamiento");
        }

        accommodation.setActive(!accommodation.isActive());
        accommodationRepository.save(accommodation);
    }

    private AccommodationCardDto convertToCardDto(Accommodation accommodation) {
        AccommodationCardDto dto = modelMapper.map(accommodation, AccommodationCardDto.class);
        
        if (!accommodation.getImages().isEmpty()) {
            AccommodationImage firstImage = accommodation.getImages().get(0);
            dto.setMainImage(Base64.getEncoder().encodeToString(firstImage.getData()));
        } else {
            dto.setMainImage("");
        }
        
        return dto;
    }

    private AccommodationDetailDto convertToDetailDto(Accommodation accommodation) {
        // 1. Mapeo principal sin el host
        AccommodationDetailDto dto = modelMapper.map(accommodation, AccommodationDetailDto.class);
        
        // 2. Mapeo seguro del host (con validación de null)
        if (accommodation.getHost() != null) {
            dto.setHost(modelMapper.map(accommodation.getHost(), UserProfileDto.class));
        }

        // 3. Mapeo de imágenes (tu implementación original)
        if (accommodation.getImages() != null) {
            List<AccommodationImageDto> imageDtos = accommodation.getImages().stream()
                .map(image -> modelMapper.map(image, AccommodationImageDto.class))
                .collect(Collectors.toList());
            dto.setImages(imageDtos);
        } else {
            dto.setImages(Collections.emptyList());
        }
        
        return dto;
    }
    


    public List<AccommodationCardDto> getFeaturedByRating(double minRating, int minReviews) {
        List<Accommodation> featured = accommodationRepository.findFeaturedByRating(minRating, minReviews);
        return featured.stream()
                .map(this::convertToCardDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public void addReview(Long accommodationId, double newRating) {
        Accommodation accommodation = accommodationRepository.findById(accommodationId)
                .orElseThrow(() -> new ResourceNotFoundException("Accommodation not found"));

        double currentRating = accommodation.getRating();
        int currentReviews = accommodation.getReviews();

        double updatedRating = ((currentRating * currentReviews) + newRating) / (currentReviews + 1);
        accommodation.setRating(updatedRating);
        accommodation.setReviews(currentReviews + 1);

        accommodationRepository.save(accommodation);
        updateFeaturedStatus(accommodationId);
    }

    @Transactional
    public void setFeatured(Long accommodationId, boolean featured) {
        Accommodation accommodation = accommodationRepository.findById(accommodationId)
                .orElseThrow(() -> new ResourceNotFoundException("Accommodation not found"));
        accommodation.setFeatured(featured);
        accommodationRepository.save(accommodation);
    }

    public void updateFeaturedStatus(Long accommodationId) {
        Accommodation acc = accommodationRepository.findById(accommodationId)
                .orElseThrow(() -> new ResourceNotFoundException("Accommodation not found"));
        if(acc.getRating() >= 4.0 && acc.getReviews() >= 10) {
            acc.setFeatured(true);
        } else {
            acc.setFeatured(false);
        }
        accommodationRepository.save(acc);
    }

    public List<AccommodationCardDto> getAccommodationsByHost(String hostEmail) {
        List<Accommodation> accommodations = accommodationRepository.findByHostEmail(hostEmail);
        return accommodations.stream()
                .map(this::convertToCardDto)
                .collect(Collectors.toList());
    }

    public List<AccommodationCardDto> getAllActiveAccommodations() {
        return accommodationRepository.findByActiveTrue().stream()
                .sorted((a1, a2) -> Double.compare(a2.getRating(), a1.getRating()))
                .map(this::convertToCardDto)
                .collect(Collectors.toList());
    }
}