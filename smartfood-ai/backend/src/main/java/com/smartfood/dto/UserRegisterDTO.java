package com.smartfood.dto;

import com.smartfood.entity.UserRole;

public class UserRegisterDTO {
    private String email; private String password; private String firstName;
    private String lastName; private String phone; private UserRole role;
    private Long organizationId; private Double latitude; private Double longitude; private String address;
    public UserRegisterDTO() {}
    public String getEmail() { return email; } public void setEmail(String v) { this.email = v; }
    public String getPassword() { return password; } public void setPassword(String v) { this.password = v; }
    public String getFirstName() { return firstName; } public void setFirstName(String v) { this.firstName = v; }
    public String getLastName() { return lastName; } public void setLastName(String v) { this.lastName = v; }
    public String getPhone() { return phone; } public void setPhone(String v) { this.phone = v; }
    public UserRole getRole() { return role; } public void setRole(UserRole v) { this.role = v; }
    public Long getOrganizationId() { return organizationId; } public void setOrganizationId(Long v) { this.organizationId = v; }
    public Double getLatitude() { return latitude; } public void setLatitude(Double v) { this.latitude = v; }
    public Double getLongitude() { return longitude; } public void setLongitude(Double v) { this.longitude = v; }
    public String getAddress() { return address; } public void setAddress(String v) { this.address = v; }
}
