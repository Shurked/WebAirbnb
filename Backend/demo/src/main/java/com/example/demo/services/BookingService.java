package com.example.demo.services;

import com.example.demo.dtos.request.BookingRequest;
import com.example.demo.dtos.response.BookingResponse;
import com.example.demo.exceptions.ResourceNotFoundException;
import com.example.demo.models.*;
import com.example.demo.repositories.*;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BookingService {

    private final BookingRepository bookingRepository;
    private final AccommodationRepository accommodationRepository;
    private final UserRepository userRepository;
    private final ModelMapper modelMapper;

    public BookingResponse createBooking(BookingRequest request, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Accommodation accommodation = accommodationRepository.findById(request.getAccommodationId())
                .orElseThrow(() -> new ResourceNotFoundException("Accommodation not found"));

        Booking booking = new Booking();
        booking.setUser(user);
        booking.setAccommodation(accommodation);
        booking.setCheckIn(request.getCheckIn());
        booking.setCheckOut(request.getCheckOut());

        // Lógica para determinar el estado
        booking.setStatus(determineStatus(request.getCheckIn(), request.getCheckOut()));

        Booking saved = bookingRepository.save(booking);
        return convertToResponse(saved);
    }

    public List<BookingResponse> getBookingsByUser(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        List<Booking> bookings = bookingRepository.findByUser(user);

        return bookings.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    private BookingResponse convertToResponse(Booking booking) {
        BookingResponse dto = new BookingResponse();
        dto.setId(booking.getId());
        dto.setAccommodationTitle(booking.getAccommodation().getTitle());
        dto.setLocation(booking.getAccommodation().getLocation());
        dto.setCheckIn(booking.getCheckIn());
        dto.setCheckOut(booking.getCheckOut());
        dto.setStatus(booking.getStatus().name());
        return dto;
    }

    private BookingStatus determineStatus(LocalDate checkIn, LocalDate checkOut) {
        LocalDate today = LocalDate.now();
        if (checkOut.isBefore(today)) return BookingStatus.PASADA;
        if (checkIn.isAfter(today)) return BookingStatus.PROXIMA;
        return BookingStatus.PROXIMA;
    }
}
