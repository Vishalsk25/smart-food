package com.smartfood.dto;

import com.smartfood.entity.DonationStatus;
import com.smartfood.entity.FoodCategory;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FoodDonationDTO {
    private Long id;
    private Long donorId;
    private String donorName;
    private String foodName;
    private String description;
    private Double quantity;
    private String unit;
    private FoodCategory category;
    private LocalDateTime expiryTime;
    private Double latitude;
    private Double longitude;
    private String pickupInstructions;
    private DonationStatus status;
    private String imageUrl;
    private Integer estimatedBeneficiaries;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}

@Data
@NoArgsConstructor
@AllArgsConstructor
class FoodDonationCreateDTO {
    private String foodName;
    private String description;
    private Double quantity;
    private String unit;
    private FoodCategory category;
    private LocalDateTime expiryTime;
    private Double latitude;
    private Double longitude;
    private String pickupInstructions;
    private Integer estimatedBeneficiaries;
    private String imageUrl;
}

@Data
@NoArgsConstructor
@AllArgsConstructor
class FoodDonationUpdateDTO {
    private String foodName;
    private String description;
    private Double quantity;
    private LocalDateTime expiryTime;
    private String pickupInstructions;
    private String imageUrl;
    private Integer estimatedBeneficiaries;
}

@Data
@NoArgsConstructor
@AllArgsConstructor
class DonationFilterDTO {
    private FoodCategory category;
    private Double latitude;
    private Double longitude;
    private Double radiusKm;
    private DonationStatus status;
    private Integer page;
    private Integer pageSize;
}
