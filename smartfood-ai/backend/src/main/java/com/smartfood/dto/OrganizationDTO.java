package com.smartfood.dto;

import com.smartfood.entity.OrganizationStatus;
import com.smartfood.entity.OrganizationType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrganizationDTO {
    private Long id;
    private String registrationNumber;
    private String name;
    private OrganizationType type;
    private String description;
    private String contactEmail;
    private String contactPhone;
    private String address;
    private Double latitude;
    private Double longitude;
    private OrganizationStatus status;
    private Integer totalDonations;
    private Integer totalBeneficiaries;
    private Double totalFoodWeight;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}

@Data
@NoArgsConstructor
@AllArgsConstructor
class OrganizationCreateDTO {
    private String registrationNumber;
    private String name;
    private OrganizationType type;
    private String description;
    private String contactEmail;
    private String contactPhone;
    private String address;
    private Double latitude;
    private Double longitude;
}

@Data
@NoArgsConstructor
@AllArgsConstructor
class OrganizationUpdateDTO {
    private String name;
    private String description;
    private String contactEmail;
    private String contactPhone;
    private String address;
    private Double latitude;
    private Double longitude;
}
