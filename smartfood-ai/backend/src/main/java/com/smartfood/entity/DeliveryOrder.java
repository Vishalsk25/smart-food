package com.smartfood.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import java.time.LocalDateTime;

@Entity
@Table(name = "delivery_orders")
public class DeliveryOrder {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "donation_id", nullable = false)
    private FoodDonation donation;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "recipient_id", nullable = false)
    private Organization recipient;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "volunteer_id")
    private User volunteer;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private DeliveryStatus status;

    @Column(nullable = false)
    private Double pickupLatitude;

    @Column(nullable = false)
    private Double pickupLongitude;

    @Column(nullable = false)
    private Double deliveryLatitude;

    @Column(nullable = false)
    private Double deliveryLongitude;

    private Double estimatedDistance;
    private Integer estimatedTime;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(nullable = false)
    private LocalDateTime updatedAt;

    private LocalDateTime pickedAt;
    private LocalDateTime deliveredAt;

    @Column(length = 500)
    private String proofOfDeliveryUrl;

    @Column(length = 1000)
    private String notes;

    @Column(nullable = false)
    private Boolean deleted = false;

    public DeliveryOrder() {}
    public Long getId() { return id; } public void setId(Long v) { this.id = v; }
    public FoodDonation getDonation() { return donation; } public void setDonation(FoodDonation v) { this.donation = v; }
    public Organization getRecipient() { return recipient; } public void setRecipient(Organization v) { this.recipient = v; }
    public User getVolunteer() { return volunteer; } public void setVolunteer(User v) { this.volunteer = v; }
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
    public Boolean getDeleted() { return deleted; } public void setDeleted(Boolean v) { this.deleted = v; }

    public static Builder builder() { return new Builder(); }
    public static class Builder {
        private final DeliveryOrder d = new DeliveryOrder();
        public Builder id(Long v) { d.id = v; return this; }
        public Builder donation(FoodDonation v) { d.donation = v; return this; }
        public Builder recipient(Organization v) { d.recipient = v; return this; }
        public Builder volunteer(User v) { d.volunteer = v; return this; }
        public Builder status(DeliveryStatus v) { d.status = v; return this; }
        public Builder pickupLatitude(Double v) { d.pickupLatitude = v; return this; }
        public Builder pickupLongitude(Double v) { d.pickupLongitude = v; return this; }
        public Builder deliveryLatitude(Double v) { d.deliveryLatitude = v; return this; }
        public Builder deliveryLongitude(Double v) { d.deliveryLongitude = v; return this; }
        public Builder estimatedDistance(Double v) { d.estimatedDistance = v; return this; }
        public Builder estimatedTime(Integer v) { d.estimatedTime = v; return this; }
        public Builder notes(String v) { d.notes = v; return this; }
        public Builder deleted(Boolean v) { d.deleted = v; return this; }
        public DeliveryOrder build() { return d; }
    }
}
