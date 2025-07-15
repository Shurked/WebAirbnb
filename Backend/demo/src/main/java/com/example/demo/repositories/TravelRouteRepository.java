package com.example.demo.repositories;

import com.example.demo.models.TravelRoute;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TravelRouteRepository extends JpaRepository<TravelRoute, Long> {
    List<TravelRoute> findByUserId(Long userId);
}
