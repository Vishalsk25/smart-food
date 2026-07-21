package com.smartfood.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "organizations")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Organization {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String registrationNumber;

    @Column(nullable = false)
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private OrganizationType type; // RESTAURANT, HOTEL, SUPERMARKET, EVENT, NGO, SHELTER

    @Column(length = 500)
    private String description;

    @Column(nullable = false)
    private String contactEmail;

    @Column(nullable = false)
    private String contactPhone;

    @Column(length = 1000)
    private String address;

    private Double latitude;

    private Double longitude;

    @Column(length = 2000)
    private String documents; // JSON array of document URLs

    @Enumerated(EnumType.STRING)
    private OrganizationStatus status; // VERIFIED, PENDING, REJECTED, SUSPENDED

    private Integer totalDonations;
    private Integer totalBeneficiaries;
    private Double totalFoodWeight; // kg

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(nullable = false)
    private LocalDateTime updatedAt;

    @Column(nullable = false)
    private Boolean deleted = false;
}

enum OrganizationType {
    RESTAURANT, HOTEL, SUPERMARKET, EVENT, NGO, SHELTER
}

enum OrganizationStatus {
    VERIFIED, PENDING, REJECTED, SUSPENDED
}
