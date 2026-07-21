package com.smartfood.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "verification_audit_logs")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VerificationAuditLog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user; // The delivery partner or admin

    @Column(nullable = false)
    private String action; // SCAN_QR, REQUEST_OTP, VERIFY_OTP, FAILED_VERIFICATION

    @Column(length = 1000)
    private String details;

    @Column(length = 255)
    private String deviceInformation;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;
}
