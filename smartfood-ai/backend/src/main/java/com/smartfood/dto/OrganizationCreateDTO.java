package com.smartfood.dto;

import com.smartfood.entity.OrganizationType;

public class OrganizationCreateDTO {
    private String registrationNumber; private String name; private OrganizationType type;
    private String description; private String contactEmail; private String contactPhone;
    private String address; private Double latitude; private Double longitude;
    public OrganizationCreateDTO() {}
    public String getRegistrationNumber() { return registrationNumber; } public void setRegistrationNumber(String v) { this.registrationNumber = v; }
    public String getName() { return name; } public void setName(String v) { this.name = v; }
    public OrganizationType getType() { return type; } public void setType(OrganizationType v) { this.type = v; }
    public String getDescription() { return description; } public void setDescription(String v) { this.description = v; }
    public String getContactEmail() { return contactEmail; } public void setContactEmail(String v) { this.contactEmail = v; }
    public String getContactPhone() { return contactPhone; } public void setContactPhone(String v) { this.contactPhone = v; }
    public String getAddress() { return address; } public void setAddress(String v) { this.address = v; }
    public Double getLatitude() { return latitude; } public void setLatitude(Double v) { this.latitude = v; }
    public Double getLongitude() { return longitude; } public void setLongitude(Double v) { this.longitude = v; }
}
