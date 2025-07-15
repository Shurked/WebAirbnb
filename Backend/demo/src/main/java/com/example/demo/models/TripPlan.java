package com.example.demo.models;

import jakarta.persistence.*;
import lombok.Data;

import java.util.List;

@Entity
@Data
@Table(name = "trip_plans")
public class TripPlan {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Si permites múltiples alojamientos en el carrito
    @ManyToMany
    @JoinTable(
        name = "trip_plan_accommodations",
        joinColumns = @JoinColumn(name = "trip_plan_id"),
        inverseJoinColumns = @JoinColumn(name = "accommodation_id")
    )
    private List<Accommodation> accommodations;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;
}
