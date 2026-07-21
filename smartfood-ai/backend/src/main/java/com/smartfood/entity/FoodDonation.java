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
@Table(name = "food_donations")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FoodDonation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "donor_id", nullable = false)
    private Organization donor;

    @Column(nullable = false)
    private String foodName;

    @Column(length = 500)
    private String description;

    @Column(nullable = false)
    private Double quantity; // kg

    @Column(nullable = false)
    private String unit; // KG, PLATES, BOXES

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private FoodCategory category; // COOKED, RAW, PACKAGED, BAKERY, DAIRY

    @Column(nullable = false)
    private LocalDateTime expiryTime;

    @Column(nullable = false)
    private Double latitude;

    @Column(nullable = false)
    private Double longitude;

    @Column(length = 1000)
    private String pickupInstructions;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private DonationStatus status; // AVAILABLE, ASSIGNED, PICKED, DELIVERED, EXPIRED, CANCELLED

    @Column(length = 500)
    private String imageUrl;

    private Integer estimatedBeneficiaries;

    @Column(length = 2000)
    private String qrToken;

    private LocalDateTime qrExpiresAt;
    
    private LocalDateTime verifiedAt;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(nullable = false)
    private LocalDateTime updatedAt;

    @Column(nullable = false)
    private Boolean deleted = false;
}

enum FoodCategory {
    COOKED, RAW, PACKAGED, BAKERY, DAIRY, FRUITS_VEGETABLES
}

enum DonationStatus {
    AVAILABLE, ASSIGNED, PICKED, DELIVERED, EXPIRED, CANCELLED
}
