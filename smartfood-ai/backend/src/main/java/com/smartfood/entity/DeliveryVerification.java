package com.smartfood.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import java.time.LocalDateTime;

@Entity
@Table(name = "delivery_verifications")
public class DeliveryVerification {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "delivery_order_id", nullable = false)
    private DeliveryOrder deliveryOrder;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private VerificationType verificationType;

    @Column(nullable = false)
    private String verificationMethod;

    private LocalDateTime qrScannedAt;
    private LocalDateTime otpVerifiedAt;
    private Boolean isSuccessful;

    @Column(length = 255)
    private String failureReason;

    private Double latitude;
    private Double longitude;

    @Column(length = 500)
    private String deviceInfo;

    private LocalDateTime scanTime;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    public DeliveryVerification() {}
    public Long getId() { return id; } public void setId(Long v) { this.id = v; }
    public DeliveryOrder getDeliveryOrder() { return deliveryOrder; } public void setDeliveryOrder(DeliveryOrder v) { this.deliveryOrder = v; }
    public VerificationType getVerificationType() { return verificationType; } public void setVerificationType(VerificationType v) { this.verificationType = v; }
    public String getVerificationMethod() { return verificationMethod; } public void setVerificationMethod(String v) { this.verificationMethod = v; }
    public LocalDateTime getQrScannedAt() { return qrScannedAt; } public void setQrScannedAt(LocalDateTime v) { this.qrScannedAt = v; }
    public LocalDateTime getOtpVerifiedAt() { return otpVerifiedAt; } public void setOtpVerifiedAt(LocalDateTime v) { this.otpVerifiedAt = v; }
    public Boolean getIsSuccessful() { return isSuccessful; } public void setIsSuccessful(Boolean v) { this.isSuccessful = v; }
    public String getFailureReason() { return failureReason; } public void setFailureReason(String v) { this.failureReason = v; }
    public Double getLatitude() { return latitude; } public void setLatitude(Double v) { this.latitude = v; }
    public Double getLongitude() { return longitude; } public void setLongitude(Double v) { this.longitude = v; }
    public String getDeviceInfo() { return deviceInfo; } public void setDeviceInfo(String v) { this.deviceInfo = v; }
    public LocalDateTime getScanTime() { return scanTime; } public void setScanTime(LocalDateTime v) { this.scanTime = v; }
    public LocalDateTime getCreatedAt() { return createdAt; } public void setCreatedAt(LocalDateTime v) { this.createdAt = v; }

    public static Builder builder() { return new Builder(); }
    public static class Builder {
        private final DeliveryVerification dv = new DeliveryVerification();
        public Builder id(Long v) { dv.id = v; return this; }
        public Builder deliveryOrder(DeliveryOrder v) { dv.deliveryOrder = v; return this; }
        public Builder verificationType(VerificationType v) { dv.verificationType = v; return this; }
        public Builder verificationMethod(String v) { dv.verificationMethod = v; return this; }
        public Builder isSuccessful(Boolean v) { dv.isSuccessful = v; return this; }
        public Builder failureReason(String v) { dv.failureReason = v; return this; }
        public Builder latitude(Double v) { dv.latitude = v; return this; }
        public Builder longitude(Double v) { dv.longitude = v; return this; }
        public DeliveryVerification build() { return dv; }
    }
}
