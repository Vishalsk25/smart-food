package com.smartfood.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import java.time.LocalDateTime;

@Entity
@Table(name = "food_donations")
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
    private Double quantity;

    @Column(nullable = false)
    private String unit;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private FoodCategory category;

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
    private DonationStatus status;

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

    public FoodDonation() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Organization getDonor() { return donor; }
    public void setDonor(Organization donor) { this.donor = donor; }
    public String getFoodName() { return foodName; }
    public void setFoodName(String foodName) { this.foodName = foodName; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public Double getQuantity() { return quantity; }
    public void setQuantity(Double quantity) { this.quantity = quantity; }
    public String getUnit() { return unit; }
    public void setUnit(String unit) { this.unit = unit; }
    public FoodCategory getCategory() { return category; }
    public void setCategory(FoodCategory category) { this.category = category; }
    public LocalDateTime getExpiryTime() { return expiryTime; }
    public void setExpiryTime(LocalDateTime expiryTime) { this.expiryTime = expiryTime; }
    public Double getLatitude() { return latitude; }
    public void setLatitude(Double latitude) { this.latitude = latitude; }
    public Double getLongitude() { return longitude; }
    public void setLongitude(Double longitude) { this.longitude = longitude; }
    public String getPickupInstructions() { return pickupInstructions; }
    public void setPickupInstructions(String pickupInstructions) { this.pickupInstructions = pickupInstructions; }
    public DonationStatus getStatus() { return status; }
    public void setStatus(DonationStatus status) { this.status = status; }
    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
    public Integer getEstimatedBeneficiaries() { return estimatedBeneficiaries; }
    public void setEstimatedBeneficiaries(Integer estimatedBeneficiaries) { this.estimatedBeneficiaries = estimatedBeneficiaries; }
    public String getQrToken() { return qrToken; }
    public void setQrToken(String qrToken) { this.qrToken = qrToken; }
    public LocalDateTime getQrExpiresAt() { return qrExpiresAt; }
    public void setQrExpiresAt(LocalDateTime qrExpiresAt) { this.qrExpiresAt = qrExpiresAt; }
    public LocalDateTime getVerifiedAt() { return verifiedAt; }
    public void setVerifiedAt(LocalDateTime verifiedAt) { this.verifiedAt = verifiedAt; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
    public Boolean getDeleted() { return deleted; }
    public void setDeleted(Boolean deleted) { this.deleted = deleted; }

    public static Builder builder() { return new Builder(); }
    public static class Builder {
        private Long id; private Organization donor; private String foodName;
        private String description; private Double quantity; private String unit;
        private FoodCategory category; private LocalDateTime expiryTime;
        private Double latitude; private Double longitude; private String pickupInstructions;
        private DonationStatus status; private String imageUrl; private Integer estimatedBeneficiaries;
        private String qrToken; private LocalDateTime qrExpiresAt; private LocalDateTime verifiedAt;
        private LocalDateTime createdAt; private LocalDateTime updatedAt; private Boolean deleted = false;

        public Builder id(Long v) { this.id = v; return this; }
        public Builder donor(Organization v) { this.donor = v; return this; }
        public Builder foodName(String v) { this.foodName = v; return this; }
        public Builder description(String v) { this.description = v; return this; }
        public Builder quantity(Double v) { this.quantity = v; return this; }
        public Builder unit(String v) { this.unit = v; return this; }
        public Builder category(FoodCategory v) { this.category = v; return this; }
        public Builder expiryTime(LocalDateTime v) { this.expiryTime = v; return this; }
        public Builder latitude(Double v) { this.latitude = v; return this; }
        public Builder longitude(Double v) { this.longitude = v; return this; }
        public Builder pickupInstructions(String v) { this.pickupInstructions = v; return this; }
        public Builder status(DonationStatus v) { this.status = v; return this; }
        public Builder imageUrl(String v) { this.imageUrl = v; return this; }
        public Builder estimatedBeneficiaries(Integer v) { this.estimatedBeneficiaries = v; return this; }
        public Builder qrToken(String v) { this.qrToken = v; return this; }
        public Builder qrExpiresAt(LocalDateTime v) { this.qrExpiresAt = v; return this; }
        public Builder verifiedAt(LocalDateTime v) { this.verifiedAt = v; return this; }
        public Builder createdAt(LocalDateTime v) { this.createdAt = v; return this; }
        public Builder updatedAt(LocalDateTime v) { this.updatedAt = v; return this; }
        public Builder deleted(Boolean v) { this.deleted = v; return this; }
        public FoodDonation build() {
            FoodDonation f = new FoodDonation();
            f.id = id; f.donor = donor; f.foodName = foodName; f.description = description;
            f.quantity = quantity; f.unit = unit; f.category = category; f.expiryTime = expiryTime;
            f.latitude = latitude; f.longitude = longitude; f.pickupInstructions = pickupInstructions;
            f.status = status; f.imageUrl = imageUrl; f.estimatedBeneficiaries = estimatedBeneficiaries;
            f.qrToken = qrToken; f.qrExpiresAt = qrExpiresAt; f.verifiedAt = verifiedAt;
            f.createdAt = createdAt; f.updatedAt = updatedAt; f.deleted = deleted;
            return f;
        }
    }
}
