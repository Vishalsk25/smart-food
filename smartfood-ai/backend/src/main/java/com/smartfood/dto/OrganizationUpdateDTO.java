package com.smartfood.dto;

public class OrganizationUpdateDTO {
    private String name; private String description; private String contactEmail;
    private String contactPhone; private String address; private Double latitude; private Double longitude;
    public OrganizationUpdateDTO() {}
    public String getName() { return name; } public void setName(String v) { this.name = v; }
    public String getDescription() { return description; } public void setDescription(String v) { this.description = v; }
    public String getContactEmail() { return contactEmail; } public void setContactEmail(String v) { this.contactEmail = v; }
    public String getContactPhone() { return contactPhone; } public void setContactPhone(String v) { this.contactPhone = v; }
    public String getAddress() { return address; } public void setAddress(String v) { this.address = v; }
    public Double getLatitude() { return latitude; } public void setLatitude(Double v) { this.latitude = v; }
    public Double getLongitude() { return longitude; } public void setLongitude(Double v) { this.longitude = v; }
}
