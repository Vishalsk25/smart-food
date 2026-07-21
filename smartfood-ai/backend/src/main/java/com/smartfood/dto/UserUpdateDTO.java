package com.smartfood.dto;

public class UserUpdateDTO {
    private String firstName; private String lastName; private String phone;
    private Double latitude; private Double longitude; private String address;
    public UserUpdateDTO() {}
    public String getFirstName() { return firstName; } public void setFirstName(String v) { this.firstName = v; }
    public String getLastName() { return lastName; } public void setLastName(String v) { this.lastName = v; }
    public String getPhone() { return phone; } public void setPhone(String v) { this.phone = v; }
    public Double getLatitude() { return latitude; } public void setLatitude(Double v) { this.latitude = v; }
    public Double getLongitude() { return longitude; } public void setLongitude(Double v) { this.longitude = v; }
    public String getAddress() { return address; } public void setAddress(String v) { this.address = v; }
}
