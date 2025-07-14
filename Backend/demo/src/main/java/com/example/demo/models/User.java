package com.example.demo.models;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate; // Importación para LocalDate
import java.util.Set;      // Importación para Set
import java.util.HashSet;  // Importación para HashSet


@Entity
@Data
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    private String password;

    private String name;
    private String avatarUrl;

    private String phone;
    private String location;

    private LocalDate birthDate;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "user_roles", joinColumns = @JoinColumn(name = "user_id"))
    @Column(name = "role")
    private Set<String> roles = new HashSet<>(); // ej. ["ROLE_USER", "ROLE_HOST"]
}
