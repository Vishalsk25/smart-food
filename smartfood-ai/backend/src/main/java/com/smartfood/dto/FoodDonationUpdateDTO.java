package com.smartfood.dto;

import java.time.LocalDateTime;

public class FoodDonationUpdateDTO {
    private String foodName; private String description; private Double quantity;
    private LocalDateTime expiryTime; private String pickupInstructions; private String imageUrl; private Integer estimatedBeneficiaries;
    public FoodDonationUpdateDTO() {}
    public String getFoodName() { return foodName; } public void setFoodName(String v) { this.foodName = v; }
    public String getDescription() { return description; } public void setDescription(String v) { this.description = v; }
    public Double getQuantity() { return quantity; } public void setQuantity(Double v) { this.quantity = v; }
    public LocalDateTime getExpiryTime() { return expiryTime; } public void setExpiryTime(LocalDateTime v) { this.expiryTime = v; }
    public String getPickupInstructions() { return pickupInstructions; } public void setPickupInstructions(String v) { this.pickupInstructions = v; }
    public String getImageUrl() { return imageUrl; } public void setImageUrl(String v) { this.imageUrl = v; }
    public Integer getEstimatedBeneficiaries() { return estimatedBeneficiaries; } public void setEstimatedBeneficiaries(Integer v) { this.estimatedBeneficiaries = v; }
}
