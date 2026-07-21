package com.smartfood.dto;

import com.smartfood.entity.DeliveryStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DeliveryOrderDTO {
    private Long id;
    private Long donationId;
    private Long recipientId;
    private String recipientName;
    private Long volunteerId;
    private String volunteerName;
    private DeliveryStatus status;
    private Double pickupLatitude;
    private Double pickupLongitude;
    private Double deliveryLatitude;
    private Double deliveryLongitude;
    private Double estimatedDistance;
    private Integer estimatedTime;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime pickedAt;
    private LocalDateTime deliveredAt;
    private String proofOfDeliveryUrl;
    private String notes;
}

@Data
@NoArgsConstructor
@AllArgsConstructor
class DeliveryOrderCreateDTO {
    private Long donationId;
    private Long recipientId;
}

@Data
@NoArgsConstructor
@AllArgsConstructor
class DeliveryOrderAssignDTO {
    private Long volunteerId;
}

@Data
@NoArgsConstructor
@AllArgsConstructor
class DeliveryStatusUpdateDTO {
    private DeliveryStatus status;
    private String proofOfDeliveryUrl;
    private String notes;
}

@Data
@NoArgsConstructor
@AllArgsConstructor
class DeliveryTrackingDTO {
    private Long deliveryId;
    private DeliveryStatus status;
    private Double currentLatitude;
    private Double currentLongitude;
    private LocalDateTime lastUpdated;
    private Double distanceRemaining;
    private Integer timeRemaining;
}
