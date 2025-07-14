package com.example.demo.repositories;

import com.example.demo.models.TourService;
import org.springframework.data.jpa.repository.JpaRepository;


import java.util.List;

public interface TourServiceRepository extends JpaRepository<TourService, Long> {
    List<TourService> findByLocationIgnoreCase(String location);
    List<TourService> findByHostEmail(String email);
}
