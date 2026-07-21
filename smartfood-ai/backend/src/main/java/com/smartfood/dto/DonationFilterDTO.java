package com.smartfood.dto;

import com.smartfood.entity.DonationStatus;
import com.smartfood.entity.FoodCategory;

public class DonationFilterDTO {
    private FoodCategory category; private Double latitude; private Double longitude;
    private Double radiusKm; private DonationStatus status; private Integer page; private Integer pageSize;
    public DonationFilterDTO() {}
    public FoodCategory getCategory() { return category; } public void setCategory(FoodCategory v) { this.category = v; }
    public Double getLatitude() { return latitude; } public void setLatitude(Double v) { this.latitude = v; }
    public Double getLongitude() { return longitude; } public void setLongitude(Double v) { this.longitude = v; }
    public Double getRadiusKm() { return radiusKm; } public void setRadiusKm(Double v) { this.radiusKm = v; }
    public DonationStatus getStatus() { return status; } public void setStatus(DonationStatus v) { this.status = v; }
    public Integer getPage() { return page; } public void setPage(Integer v) { this.page = v; }
    public Integer getPageSize() { return pageSize; } public void setPageSize(Integer v) { this.pageSize = v; }
}
