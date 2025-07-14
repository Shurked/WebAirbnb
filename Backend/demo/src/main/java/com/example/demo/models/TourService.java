package com.example.demo.models;

import java.util.ArrayList;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "tour_services")
public class TourService {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String description;
    private double price;
    private String location;

    @OneToMany(mappedBy = "tourService", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<TourImage> images = new ArrayList<>();

    @ManyToOne
    @JoinColumn(name = "host_id", nullable = false)
    private User host;
}
