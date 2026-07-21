package com.smartfood.dto;

import com.smartfood.entity.UserRole;
import com.smartfood.entity.UserStatus;
import java.time.LocalDateTime;

public class UserDTO {
    private Long id; private String email; private String firstName; private String lastName;
    private String phone; private UserRole role; private UserStatus status;
    private Long organizationId; private Double latitude; private Double longitude;
    private String address; private Integer rewardPoints; private LocalDateTime createdAt; private LocalDateTime updatedAt;

    public UserDTO() {}
    public Long getId() { return id; } public void setId(Long v) { this.id = v; }
    public String getEmail() { return email; } public void setEmail(String v) { this.email = v; }
    public String getFirstName() { return firstName; } public void setFirstName(String v) { this.firstName = v; }
    public String getLastName() { return lastName; } public void setLastName(String v) { this.lastName = v; }
    public String getPhone() { return phone; } public void setPhone(String v) { this.phone = v; }
    public UserRole getRole() { return role; } public void setRole(UserRole v) { this.role = v; }
    public UserStatus getStatus() { return status; } public void setStatus(UserStatus v) { this.status = v; }
    public Long getOrganizationId() { return organizationId; } public void setOrganizationId(Long v) { this.organizationId = v; }
    public Double getLatitude() { return latitude; } public void setLatitude(Double v) { this.latitude = v; }
    public Double getLongitude() { return longitude; } public void setLongitude(Double v) { this.longitude = v; }
    public String getAddress() { return address; } public void setAddress(String v) { this.address = v; }
    public Integer getRewardPoints() { return rewardPoints; } public void setRewardPoints(Integer v) { this.rewardPoints = v; }
    public LocalDateTime getCreatedAt() { return createdAt; } public void setCreatedAt(LocalDateTime v) { this.createdAt = v; }
    public LocalDateTime getUpdatedAt() { return updatedAt; } public void setUpdatedAt(LocalDateTime v) { this.updatedAt = v; }

    public static Builder builder() { return new Builder(); }
    public static class Builder {
        private final UserDTO u = new UserDTO();
        public Builder id(Long v) { u.id = v; return this; }
        public Builder email(String v) { u.email = v; return this; }
        public Builder firstName(String v) { u.firstName = v; return this; }
        public Builder lastName(String v) { u.lastName = v; return this; }
        public Builder phone(String v) { u.phone = v; return this; }
        public Builder role(UserRole v) { u.role = v; return this; }
        public Builder status(UserStatus v) { u.status = v; return this; }
        public Builder organizationId(Long v) { u.organizationId = v; return this; }
        public Builder latitude(Double v) { u.latitude = v; return this; }
        public Builder longitude(Double v) { u.longitude = v; return this; }
        public Builder address(String v) { u.address = v; return this; }
        public Builder rewardPoints(Integer v) { u.rewardPoints = v; return this; }
        public Builder createdAt(LocalDateTime v) { u.createdAt = v; return this; }
        public Builder updatedAt(LocalDateTime v) { u.updatedAt = v; return this; }
        public UserDTO build() { return u; }
    }
}
