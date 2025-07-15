package com.example.demo.models;

import jakarta.persistence.*;
import lombok.Data;

import java.util.List;

@Entity
@Data
@Table(name = "travel_routes")
public class TravelRoute {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String notes;

    // Usuario que crea esta ruta
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    // Alojamiento desde el cual se planifica esta ruta
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "accommodation_id")
    private Accommodation accommodation;

    // Servicios turísticos seleccionados
    @ManyToMany
    @JoinTable(
        name = "travel_route_tour_services",
        joinColumns = @JoinColumn(name = "travel_route_id"),
        inverseJoinColumns = @JoinColumn(name = "tour_service_id")
    )
    private List<TourService> tours;
}
