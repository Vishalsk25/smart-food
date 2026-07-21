package com.smartfood.dto;

import com.smartfood.entity.FoodCategory;
import java.time.LocalDateTime;

public class FoodDonationCreateDTO {
    private String foodName; private String description; private Double quantity; private String unit;
    private FoodCategory category; private LocalDateTime expiryTime; private Double latitude;
    private Double longitude; private String pickupInstructions; private Integer estimatedBeneficiaries; private String imageUrl;
    public FoodDonationCreateDTO() {}
    public String getFoodName() { return foodName; } public void setFoodName(String v) { this.foodName = v; }
    public String getDescription() { return description; } public void setDescription(String v) { this.description = v; }
    public Double getQuantity() { return quantity; } public void setQuantity(Double v) { this.quantity = v; }
    public String getUnit() { return unit; } public void setUnit(String v) { this.unit = v; }
    public FoodCategory getCategory() { return category; } public void setCategory(FoodCategory v) { this.category = v; }
    public LocalDateTime getExpiryTime() { return expiryTime; } public void setExpiryTime(LocalDateTime v) { this.expiryTime = v; }
    public Double getLatitude() { return latitude; } public void setLatitude(Double v) { this.latitude = v; }
    public Double getLongitude() { return longitude; } public void setLongitude(Double v) { this.longitude = v; }
    public String getPickupInstructions() { return pickupInstructions; } public void setPickupInstructions(String v) { this.pickupInstructions = v; }
    public Integer getEstimatedBeneficiaries() { return estimatedBeneficiaries; } public void setEstimatedBeneficiaries(Integer v) { this.estimatedBeneficiaries = v; }
    public String getImageUrl() { return imageUrl; } public void setImageUrl(String v) { this.imageUrl = v; }
}
