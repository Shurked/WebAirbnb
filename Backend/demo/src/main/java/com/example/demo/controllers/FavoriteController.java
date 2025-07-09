package com.example.demo.controllers;

import com.example.demo.dtos.response.AccommodationCardDto;
import com.example.demo.services.FavoriteService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/favorites")
@RequiredArgsConstructor
public class FavoriteController {

    private final FavoriteService favoriteService;

    @PostMapping("/{accommodationId}")
    public ResponseEntity<Void> toggleFavorite(@PathVariable Long accommodationId, Authentication authentication) {
        String email = authentication.getName();
        favoriteService.toggleFavorite(email, accommodationId);
        return ResponseEntity.ok().build();
    }

    @GetMapping
    public ResponseEntity<List<AccommodationCardDto>> getFavorites(Authentication authentication) {
        String email = authentication.getName();
        return ResponseEntity.ok(favoriteService.getFavorites(email));
    }
}
