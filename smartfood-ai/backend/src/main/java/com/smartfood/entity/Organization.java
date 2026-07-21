package com.smartfood.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import java.time.LocalDateTime;

@Entity
@Table(name = "organizations")
public class Organization {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String registrationNumber;

    @Column(nullable = false)
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private OrganizationType type;

    @Column(length = 500)
    private String description;

    @Column(nullable = false)
    private String contactEmail;

    @Column(nullable = false)
    private String contactPhone;

    @Column(length = 1000)
    private String address;

    private Double latitude;
    private Double longitude;

    @Column(length = 2000)
    private String documents;

    @Enumerated(EnumType.STRING)
    private OrganizationStatus status;

    private Integer totalDonations;
    private Integer totalBeneficiaries;
    private Double totalFoodWeight;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(nullable = false)
    private LocalDateTime updatedAt;

    @Column(nullable = false)
    private Boolean deleted = false;

    public Organization() {}

    public Organization(Long id, String registrationNumber, String name, OrganizationType type,
                        String description, String contactEmail, String contactPhone, String address,
                        Double latitude, Double longitude, String documents, OrganizationStatus status,
                        Integer totalDonations, Integer totalBeneficiaries, Double totalFoodWeight,
                        LocalDateTime createdAt, LocalDateTime updatedAt, Boolean deleted) {
        this.id = id; this.registrationNumber = registrationNumber; this.name = name;
        this.type = type; this.description = description; this.contactEmail = contactEmail;
        this.contactPhone = contactPhone; this.address = address; this.latitude = latitude;
        this.longitude = longitude; this.documents = documents; this.status = status;
        this.totalDonations = totalDonations; this.totalBeneficiaries = totalBeneficiaries;
        this.totalFoodWeight = totalFoodWeight; this.createdAt = createdAt;
        this.updatedAt = updatedAt; this.deleted = deleted;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getRegistrationNumber() { return registrationNumber; }
    public void setRegistrationNumber(String registrationNumber) { this.registrationNumber = registrationNumber; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public OrganizationType getType() { return type; }
    public void setType(OrganizationType type) { this.type = type; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getContactEmail() { return contactEmail; }
    public void setContactEmail(String contactEmail) { this.contactEmail = contactEmail; }
    public String getContactPhone() { return contactPhone; }
    public void setContactPhone(String contactPhone) { this.contactPhone = contactPhone; }
    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }
    public Double getLatitude() { return latitude; }
    public void setLatitude(Double latitude) { this.latitude = latitude; }
    public Double getLongitude() { return longitude; }
    public void setLongitude(Double longitude) { this.longitude = longitude; }
    public String getDocuments() { return documents; }
    public void setDocuments(String documents) { this.documents = documents; }
    public OrganizationStatus getStatus() { return status; }
    public void setStatus(OrganizationStatus status) { this.status = status; }
    public Integer getTotalDonations() { return totalDonations; }
    public void setTotalDonations(Integer totalDonations) { this.totalDonations = totalDonations; }
    public Integer getTotalBeneficiaries() { return totalBeneficiaries; }
    public void setTotalBeneficiaries(Integer totalBeneficiaries) { this.totalBeneficiaries = totalBeneficiaries; }
    public Double getTotalFoodWeight() { return totalFoodWeight; }
    public void setTotalFoodWeight(Double totalFoodWeight) { this.totalFoodWeight = totalFoodWeight; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
    public Boolean getDeleted() { return deleted; }
    public void setDeleted(Boolean deleted) { this.deleted = deleted; }

    public static Builder builder() { return new Builder(); }
    public static class Builder {
        private Long id; private String registrationNumber; private String name;
        private OrganizationType type; private String description; private String contactEmail;
        private String contactPhone; private String address; private Double latitude;
        private Double longitude; private String documents; private OrganizationStatus status;
        private Integer totalDonations; private Integer totalBeneficiaries; private Double totalFoodWeight;
        private LocalDateTime createdAt; private LocalDateTime updatedAt; private Boolean deleted = false;

        public Builder id(Long id) { this.id = id; return this; }
        public Builder registrationNumber(String v) { this.registrationNumber = v; return this; }
        public Builder name(String v) { this.name = v; return this; }
        public Builder type(OrganizationType v) { this.type = v; return this; }
        public Builder description(String v) { this.description = v; return this; }
        public Builder contactEmail(String v) { this.contactEmail = v; return this; }
        public Builder contactPhone(String v) { this.contactPhone = v; return this; }
        public Builder address(String v) { this.address = v; return this; }
        public Builder latitude(Double v) { this.latitude = v; return this; }
        public Builder longitude(Double v) { this.longitude = v; return this; }
        public Builder documents(String v) { this.documents = v; return this; }
        public Builder status(OrganizationStatus v) { this.status = v; return this; }
        public Builder totalDonations(Integer v) { this.totalDonations = v; return this; }
        public Builder totalBeneficiaries(Integer v) { this.totalBeneficiaries = v; return this; }
        public Builder totalFoodWeight(Double v) { this.totalFoodWeight = v; return this; }
        public Builder createdAt(LocalDateTime v) { this.createdAt = v; return this; }
        public Builder updatedAt(LocalDateTime v) { this.updatedAt = v; return this; }
        public Builder deleted(Boolean v) { this.deleted = v; return this; }
        public Organization build() {
            return new Organization(id, registrationNumber, name, type, description, contactEmail,
                contactPhone, address, latitude, longitude, documents, status, totalDonations,
                totalBeneficiaries, totalFoodWeight, createdAt, updatedAt, deleted);
        }
    }
}
