package com.smartfood.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "delivery_verifications")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DeliveryVerification {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "delivery_order_id", nullable = false)
    private DeliveryOrder deliveryOrder;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private VerificationType verificationType; // PICKUP or DELIVERY

    @Column(nullable = false)
    private String verificationMethod; // QR_ONLY, OTP_ONLY, QR_AND_OTP

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
}

enum VerificationType {
    PICKUP, DELIVERY
}
