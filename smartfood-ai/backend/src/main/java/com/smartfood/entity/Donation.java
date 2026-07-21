package com.smartfood.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import java.time.LocalDateTime;

@Entity
@Table(name = "donations")
public class Donation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private String type;

    @Column(nullable = false)
    private String title;

    @Column(length = 1000)
    private String description;

    @Column(nullable = false)
    private String quantity;

    @Column(length = 500)
    private String category;

    @Column(columnDefinition = "TEXT")
    private String image;

    @Column(nullable = false)
    private String status;

    @Column(length = 500)
    private String pickupAddress;

    @Column(nullable = false)
    private String donationDate;

    @Column(nullable = false)
    private String donationTime;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    public Donation() {}
    public Long getId() { return id; } public void setId(Long v) { this.id = v; }
    public User getUser() { return user; } public void setUser(User v) { this.user = v; }
    public String getType() { return type; } public void setType(String v) { this.type = v; }
    public String getTitle() { return title; } public void setTitle(String v) { this.title = v; }
    public String getDescription() { return description; } public void setDescription(String v) { this.description = v; }
    public String getQuantity() { return quantity; } public void setQuantity(String v) { this.quantity = v; }
    public String getCategory() { return category; } public void setCategory(String v) { this.category = v; }
    public String getImage() { return image; } public void setImage(String v) { this.image = v; }
    public String getStatus() { return status; } public void setStatus(String v) { this.status = v; }
    public String getPickupAddress() { return pickupAddress; } public void setPickupAddress(String v) { this.pickupAddress = v; }
    public String getDonationDate() { return donationDate; } public void setDonationDate(String v) { this.donationDate = v; }
    public String getDonationTime() { return donationTime; } public void setDonationTime(String v) { this.donationTime = v; }
    public LocalDateTime getCreatedAt() { return createdAt; } public void setCreatedAt(LocalDateTime v) { this.createdAt = v; }

    public static Builder builder() { return new Builder(); }
    public static class Builder {
        private final Donation d = new Donation();
        public Builder id(Long v) { d.id = v; return this; }
        public Builder user(User v) { d.user = v; return this; }
        public Builder type(String v) { d.type = v; return this; }
        public Builder title(String v) { d.title = v; return this; }
        public Builder description(String v) { d.description = v; return this; }
        public Builder quantity(String v) { d.quantity = v; return this; }
        public Builder category(String v) { d.category = v; return this; }
        public Builder image(String v) { d.image = v; return this; }
        public Builder status(String v) { d.status = v; return this; }
        public Builder pickupAddress(String v) { d.pickupAddress = v; return this; }
        public Builder donationDate(String v) { d.donationDate = v; return this; }
        public Builder donationTime(String v) { d.donationTime = v; return this; }
        public Donation build() { return d; }
    }
}
