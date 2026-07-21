package com.smartfood.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import java.time.LocalDateTime;

@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    private String firstName;

    @Column(nullable = false)
    private String lastName;

    @Column(nullable = false)
    private String phone;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private UserRole role;

    @Enumerated(EnumType.STRING)
    private UserStatus status;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "organization_id")
    private Organization organization;

    @Column(nullable = false)
    private Double latitude;

    @Column(nullable = false)
    private Double longitude;

    @Column(length = 500)
    private String address;

    private Integer rewardPoints;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(nullable = false)
    private LocalDateTime updatedAt;

    @Column(nullable = false)
    private Boolean deleted = false;

    @Column(columnDefinition = "TEXT")
    private String profileImage;

    public User() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
    public String getFirstName() { return firstName; }
    public void setFirstName(String firstName) { this.firstName = firstName; }
    public String getLastName() { return lastName; }
    public void setLastName(String lastName) { this.lastName = lastName; }
    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }
    public UserRole getRole() { return role; }
    public void setRole(UserRole role) { this.role = role; }
    public UserStatus getStatus() { return status; }
    public void setStatus(UserStatus status) { this.status = status; }
    public Organization getOrganization() { return organization; }
    public void setOrganization(Organization organization) { this.organization = organization; }
    public Double getLatitude() { return latitude; }
    public void setLatitude(Double latitude) { this.latitude = latitude; }
    public Double getLongitude() { return longitude; }
    public void setLongitude(Double longitude) { this.longitude = longitude; }
    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }
    public Integer getRewardPoints() { return rewardPoints; }
    public void setRewardPoints(Integer rewardPoints) { this.rewardPoints = rewardPoints; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
    public Boolean getDeleted() { return deleted; }
    public boolean isDeleted() { return deleted != null && deleted; }
    public void setDeleted(Boolean deleted) { this.deleted = deleted; }
    public String getProfileImage() { return profileImage; }
    public void setProfileImage(String profileImage) { this.profileImage = profileImage; }

    public static Builder builder() { return new Builder(); }
    public static class Builder {
        private Long id; private String email; private String password;
        private String firstName; private String lastName; private String phone;
        private UserRole role; private UserStatus status; private Organization organization;
        private Double latitude; private Double longitude; private String address;
        private Integer rewardPoints; private LocalDateTime createdAt; private LocalDateTime updatedAt;
        private Boolean deleted = false; private String profileImage;

        public Builder id(Long v) { this.id = v; return this; }
        public Builder email(String v) { this.email = v; return this; }
        public Builder password(String v) { this.password = v; return this; }
        public Builder firstName(String v) { this.firstName = v; return this; }
        public Builder lastName(String v) { this.lastName = v; return this; }
        public Builder phone(String v) { this.phone = v; return this; }
        public Builder role(UserRole v) { this.role = v; return this; }
        public Builder status(UserStatus v) { this.status = v; return this; }
        public Builder organization(Organization v) { this.organization = v; return this; }
        public Builder latitude(Double v) { this.latitude = v; return this; }
        public Builder longitude(Double v) { this.longitude = v; return this; }
        public Builder address(String v) { this.address = v; return this; }
        public Builder rewardPoints(Integer v) { this.rewardPoints = v; return this; }
        public Builder createdAt(LocalDateTime v) { this.createdAt = v; return this; }
        public Builder updatedAt(LocalDateTime v) { this.updatedAt = v; return this; }
        public Builder deleted(Boolean v) { this.deleted = v; return this; }
        public Builder profileImage(String v) { this.profileImage = v; return this; }
        public User build() {
            User u = new User();
            u.id = id; u.email = email; u.password = password; u.firstName = firstName;
            u.lastName = lastName; u.phone = phone; u.role = role; u.status = status;
            u.organization = organization; u.latitude = latitude; u.longitude = longitude;
            u.address = address; u.rewardPoints = rewardPoints; u.createdAt = createdAt;
            u.updatedAt = updatedAt; u.deleted = deleted; u.profileImage = profileImage;
            return u;
        }
    }
}
