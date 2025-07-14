package com.example.demo.repositories;

import com.example.demo.models.TourImage;
import org.springframework.data.jpa.repository.JpaRepository;


public interface TourImageRepository extends JpaRepository<TourImage, Long> {
}
