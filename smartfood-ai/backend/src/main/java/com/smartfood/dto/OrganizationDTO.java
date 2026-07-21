package com.smartfood.dto;

import com.smartfood.entity.OrganizationStatus;
import com.smartfood.entity.OrganizationType;
import java.time.LocalDateTime;

public class OrganizationDTO {
    private Long id; private String registrationNumber; private String name;
    private OrganizationType type; private String description; private String contactEmail;
    private String contactPhone; private String address; private Double latitude;
    private Double longitude; private OrganizationStatus status; private Integer totalDonations;
    private Integer totalBeneficiaries; private Double totalFoodWeight;
    private LocalDateTime createdAt; private LocalDateTime updatedAt;

    public OrganizationDTO() {}
    public Long getId() { return id; } public void setId(Long id) { this.id = id; }
    public String getRegistrationNumber() { return registrationNumber; } public void setRegistrationNumber(String v) { this.registrationNumber = v; }
    public String getName() { return name; } public void setName(String v) { this.name = v; }
    public OrganizationType getType() { return type; } public void setType(OrganizationType v) { this.type = v; }
    public String getDescription() { return description; } public void setDescription(String v) { this.description = v; }
    public String getContactEmail() { return contactEmail; } public void setContactEmail(String v) { this.contactEmail = v; }
    public String getContactPhone() { return contactPhone; } public void setContactPhone(String v) { this.contactPhone = v; }
    public String getAddress() { return address; } public void setAddress(String v) { this.address = v; }
    public Double getLatitude() { return latitude; } public void setLatitude(Double v) { this.latitude = v; }
    public Double getLongitude() { return longitude; } public void setLongitude(Double v) { this.longitude = v; }
    public OrganizationStatus getStatus() { return status; } public void setStatus(OrganizationStatus v) { this.status = v; }
    public Integer getTotalDonations() { return totalDonations; } public void setTotalDonations(Integer v) { this.totalDonations = v; }
    public Integer getTotalBeneficiaries() { return totalBeneficiaries; } public void setTotalBeneficiaries(Integer v) { this.totalBeneficiaries = v; }
    public Double getTotalFoodWeight() { return totalFoodWeight; } public void setTotalFoodWeight(Double v) { this.totalFoodWeight = v; }
    public LocalDateTime getCreatedAt() { return createdAt; } public void setCreatedAt(LocalDateTime v) { this.createdAt = v; }
    public LocalDateTime getUpdatedAt() { return updatedAt; } public void setUpdatedAt(LocalDateTime v) { this.updatedAt = v; }

    public static Builder builder() { return new Builder(); }
    public static class Builder {
        private final OrganizationDTO o = new OrganizationDTO();
        public Builder id(Long v) { o.id = v; return this; }
        public Builder registrationNumber(String v) { o.registrationNumber = v; return this; }
        public Builder name(String v) { o.name = v; return this; }
        public Builder type(OrganizationType v) { o.type = v; return this; }
        public Builder description(String v) { o.description = v; return this; }
        public Builder contactEmail(String v) { o.contactEmail = v; return this; }
        public Builder contactPhone(String v) { o.contactPhone = v; return this; }
        public Builder address(String v) { o.address = v; return this; }
        public Builder latitude(Double v) { o.latitude = v; return this; }
        public Builder longitude(Double v) { o.longitude = v; return this; }
        public Builder status(OrganizationStatus v) { o.status = v; return this; }
        public Builder totalDonations(Integer v) { o.totalDonations = v; return this; }
        public Builder totalBeneficiaries(Integer v) { o.totalBeneficiaries = v; return this; }
        public Builder totalFoodWeight(Double v) { o.totalFoodWeight = v; return this; }
        public Builder createdAt(LocalDateTime v) { o.createdAt = v; return this; }
        public Builder updatedAt(LocalDateTime v) { o.updatedAt = v; return this; }
        public OrganizationDTO build() { return o; }
    }
}
