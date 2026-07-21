package com.smartfood.dto;

import com.smartfood.entity.DeliveryStatus;
import java.time.LocalDateTime;

public class DeliveryOrderDTO {
    private Long id; private Long donationId; private Long recipientId; private String recipientName;
    private Long volunteerId; private String volunteerName; private DeliveryStatus status;
    private Double pickupLatitude; private Double pickupLongitude; private Double deliveryLatitude;
    private Double deliveryLongitude; private Double estimatedDistance; private Integer estimatedTime;
    private LocalDateTime createdAt; private LocalDateTime updatedAt; private LocalDateTime pickedAt;
    private LocalDateTime deliveredAt; private String proofOfDeliveryUrl; private String notes;

    public DeliveryOrderDTO() {}
    public Long getId() { return id; } public void setId(Long v) { this.id = v; }
    public Long getDonationId() { return donationId; } public void setDonationId(Long v) { this.donationId = v; }
    public Long getRecipientId() { return recipientId; } public void setRecipientId(Long v) { this.recipientId = v; }
    public String getRecipientName() { return recipientName; } public void setRecipientName(String v) { this.recipientName = v; }
    public Long getVolunteerId() { return volunteerId; } public void setVolunteerId(Long v) { this.volunteerId = v; }
    public String getVolunteerName() { return volunteerName; } public void setVolunteerName(String v) { this.volunteerName = v; }
    public DeliveryStatus getStatus() { return status; } public void setStatus(DeliveryStatus v) { this.status = v; }
    public Double getPickupLatitude() { return pickupLatitude; } public void setPickupLatitude(Double v) { this.pickupLatitude = v; }
    public Double getPickupLongitude() { return pickupLongitude; } public void setPickupLongitude(Double v) { this.pickupLongitude = v; }
    public Double getDeliveryLatitude() { return deliveryLatitude; } public void setDeliveryLatitude(Double v) { this.deliveryLatitude = v; }
    public Double getDeliveryLongitude() { return deliveryLongitude; } public void setDeliveryLongitude(Double v) { this.deliveryLongitude = v; }
    public Double getEstimatedDistance() { return estimatedDistance; } public void setEstimatedDistance(Double v) { this.estimatedDistance = v; }
    public Integer getEstimatedTime() { return estimatedTime; } public void setEstimatedTime(Integer v) { this.estimatedTime = v; }
    public LocalDateTime getCreatedAt() { return createdAt; } public void setCreatedAt(LocalDateTime v) { this.createdAt = v; }
    public LocalDateTime getUpdatedAt() { return updatedAt; } public void setUpdatedAt(LocalDateTime v) { this.updatedAt = v; }
    public LocalDateTime getPickedAt() { return pickedAt; } public void setPickedAt(LocalDateTime v) { this.pickedAt = v; }
    public LocalDateTime getDeliveredAt() { return deliveredAt; } public void setDeliveredAt(LocalDateTime v) { this.deliveredAt = v; }
    public String getProofOfDeliveryUrl() { return proofOfDeliveryUrl; } public void setProofOfDeliveryUrl(String v) { this.proofOfDeliveryUrl = v; }
    public String getNotes() { return notes; } public void setNotes(String v) { this.notes = v; }

    public static Builder builder() { return new Builder(); }
    public static class Builder {
        private final DeliveryOrderDTO d = new DeliveryOrderDTO();
        public Builder id(Long v) { d.id = v; return this; }
        public Builder donationId(Long v) { d.donationId = v; return this; }
        public Builder recipientId(Long v) { d.recipientId = v; return this; }
        public Builder recipientName(String v) { d.recipientName = v; return this; }
        public Builder volunteerId(Long v) { d.volunteerId = v; return this; }
        public Builder volunteerName(String v) { d.volunteerName = v; return this; }
        public Builder status(DeliveryStatus v) { d.status = v; return this; }
        public Builder pickupLatitude(Double v) { d.pickupLatitude = v; return this; }
        public Builder pickupLongitude(Double v) { d.pickupLongitude = v; return this; }
        public Builder deliveryLatitude(Double v) { d.deliveryLatitude = v; return this; }
        public Builder deliveryLongitude(Double v) { d.deliveryLongitude = v; return this; }
        public Builder estimatedDistance(Double v) { d.estimatedDistance = v; return this; }
        public Builder estimatedTime(Integer v) { d.estimatedTime = v; return this; }
        public Builder createdAt(LocalDateTime v) { d.createdAt = v; return this; }
        public Builder updatedAt(LocalDateTime v) { d.updatedAt = v; return this; }
        public Builder pickedAt(LocalDateTime v) { d.pickedAt = v; return this; }
        public Builder deliveredAt(LocalDateTime v) { d.deliveredAt = v; return this; }
        public Builder proofOfDeliveryUrl(String v) { d.proofOfDeliveryUrl = v; return this; }
        public Builder notes(String v) { d.notes = v; return this; }
        public DeliveryOrderDTO build() { return d; }
    }
}

class DeliveryOrderCreateDTO {
    private Long donationId; private Long recipientId;
    public DeliveryOrderCreateDTO() {}
    public Long getDonationId() { return donationId; } public void setDonationId(Long v) { this.donationId = v; }
    public Long getRecipientId() { return recipientId; } public void setRecipientId(Long v) { this.recipientId = v; }
}

class DeliveryOrderAssignDTO {
    private Long volunteerId;
    public DeliveryOrderAssignDTO() {}
    public Long getVolunteerId() { return volunteerId; } public void setVolunteerId(Long v) { this.volunteerId = v; }
}

class DeliveryStatusUpdateDTO {
    private DeliveryStatus status; private String proofOfDeliveryUrl; private String notes;
    public DeliveryStatusUpdateDTO() {}
    public DeliveryStatus getStatus() { return status; } public void setStatus(DeliveryStatus v) { this.status = v; }
    public String getProofOfDeliveryUrl() { return proofOfDeliveryUrl; } public void setProofOfDeliveryUrl(String v) { this.proofOfDeliveryUrl = v; }
    public String getNotes() { return notes; } public void setNotes(String v) { this.notes = v; }
}

class DeliveryTrackingDTO {
    private Long deliveryId; private DeliveryStatus status; private Double currentLatitude;
    private Double currentLongitude; private LocalDateTime lastUpdated; private Double distanceRemaining; private Integer timeRemaining;
    public DeliveryTrackingDTO() {}
    public Long getDeliveryId() { return deliveryId; } public void setDeliveryId(Long v) { this.deliveryId = v; }
    public DeliveryStatus getStatus() { return status; } public void setStatus(DeliveryStatus v) { this.status = v; }
    public Double getCurrentLatitude() { return currentLatitude; } public void setCurrentLatitude(Double v) { this.currentLatitude = v; }
    public Double getCurrentLongitude() { return currentLongitude; } public void setCurrentLongitude(Double v) { this.currentLongitude = v; }
    public LocalDateTime getLastUpdated() { return lastUpdated; } public void setLastUpdated(LocalDateTime v) { this.lastUpdated = v; }
    public Double getDistanceRemaining() { return distanceRemaining; } public void setDistanceRemaining(Double v) { this.distanceRemaining = v; }
    public Integer getTimeRemaining() { return timeRemaining; } public void setTimeRemaining(Integer v) { this.timeRemaining = v; }
}
