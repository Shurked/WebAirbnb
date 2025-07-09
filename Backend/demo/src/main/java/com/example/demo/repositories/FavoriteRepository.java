package com.example.demo.repositories;

import com.example.demo.models.Accommodation;
import com.example.demo.models.Favorite;
import com.example.demo.models.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface FavoriteRepository extends JpaRepository<Favorite, Long> {
    Optional<Favorite> findByUserAndAccommodation(User user, Accommodation accommodation);
    List<Favorite> findByUser(User user);
    void deleteByUserAndAccommodation(User user, Accommodation accommodation);
}
