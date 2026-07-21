package com.smartfood.dto;

import com.smartfood.entity.DonationStatus;
import com.smartfood.entity.FoodCategory;
import java.time.LocalDateTime;

public class FoodDonationDTO {
    private Long id; private Long donorId; private String donorName; private String foodName;
    private String description; private Double quantity; private String unit; private FoodCategory category;
    private LocalDateTime expiryTime; private Double latitude; private Double longitude;
    private String pickupInstructions; private DonationStatus status; private String imageUrl;
    private Integer estimatedBeneficiaries; private LocalDateTime createdAt; private LocalDateTime updatedAt;

    public FoodDonationDTO() {}
    public Long getId() { return id; } public void setId(Long v) { this.id = v; }
    public Long getDonorId() { return donorId; } public void setDonorId(Long v) { this.donorId = v; }
    public String getDonorName() { return donorName; } public void setDonorName(String v) { this.donorName = v; }
    public String getFoodName() { return foodName; } public void setFoodName(String v) { this.foodName = v; }
    public String getDescription() { return description; } public void setDescription(String v) { this.description = v; }
    public Double getQuantity() { return quantity; } public void setQuantity(Double v) { this.quantity = v; }
    public String getUnit() { return unit; } public void setUnit(String v) { this.unit = v; }
    public FoodCategory getCategory() { return category; } public void setCategory(FoodCategory v) { this.category = v; }
    public LocalDateTime getExpiryTime() { return expiryTime; } public void setExpiryTime(LocalDateTime v) { this.expiryTime = v; }
    public Double getLatitude() { return latitude; } public void setLatitude(Double v) { this.latitude = v; }
    public Double getLongitude() { return longitude; } public void setLongitude(Double v) { this.longitude = v; }
    public String getPickupInstructions() { return pickupInstructions; } public void setPickupInstructions(String v) { this.pickupInstructions = v; }
    public DonationStatus getStatus() { return status; } public void setStatus(DonationStatus v) { this.status = v; }
    public String getImageUrl() { return imageUrl; } public void setImageUrl(String v) { this.imageUrl = v; }
    public Integer getEstimatedBeneficiaries() { return estimatedBeneficiaries; } public void setEstimatedBeneficiaries(Integer v) { this.estimatedBeneficiaries = v; }
    public LocalDateTime getCreatedAt() { return createdAt; } public void setCreatedAt(LocalDateTime v) { this.createdAt = v; }
    public LocalDateTime getUpdatedAt() { return updatedAt; } public void setUpdatedAt(LocalDateTime v) { this.updatedAt = v; }

    public static Builder builder() { return new Builder(); }
    public static class Builder {
        private final FoodDonationDTO d = new FoodDonationDTO();
        public Builder id(Long v) { d.id = v; return this; }
        public Builder donorId(Long v) { d.donorId = v; return this; }
        public Builder donorName(String v) { d.donorName = v; return this; }
        public Builder foodName(String v) { d.foodName = v; return this; }
        public Builder description(String v) { d.description = v; return this; }
        public Builder quantity(Double v) { d.quantity = v; return this; }
        public Builder unit(String v) { d.unit = v; return this; }
        public Builder category(FoodCategory v) { d.category = v; return this; }
        public Builder expiryTime(LocalDateTime v) { d.expiryTime = v; return this; }
        public Builder latitude(Double v) { d.latitude = v; return this; }
        public Builder longitude(Double v) { d.longitude = v; return this; }
        public Builder pickupInstructions(String v) { d.pickupInstructions = v; return this; }
        public Builder status(DonationStatus v) { d.status = v; return this; }
        public Builder imageUrl(String v) { d.imageUrl = v; return this; }
        public Builder estimatedBeneficiaries(Integer v) { d.estimatedBeneficiaries = v; return this; }
        public Builder createdAt(LocalDateTime v) { d.createdAt = v; return this; }
        public Builder updatedAt(LocalDateTime v) { d.updatedAt = v; return this; }
        public FoodDonationDTO build() { return d; }
    }
}
