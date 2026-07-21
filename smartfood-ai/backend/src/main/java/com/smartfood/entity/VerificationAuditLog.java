package com.smartfood.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import java.time.LocalDateTime;

@Entity
@Table(name = "verification_audit_logs")
public class VerificationAuditLog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @Column(nullable = false)
    private String action;

    @Column(length = 1000)
    private String details;

    @Column(length = 255)
    private String deviceInformation;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    public VerificationAuditLog() {}
    public Long getId() { return id; } public void setId(Long v) { this.id = v; }
    public User getUser() { return user; } public void setUser(User v) { this.user = v; }
    public String getAction() { return action; } public void setAction(String v) { this.action = v; }
    public String getDetails() { return details; } public void setDetails(String v) { this.details = v; }
    public String getDeviceInformation() { return deviceInformation; } public void setDeviceInformation(String v) { this.deviceInformation = v; }
    public LocalDateTime getCreatedAt() { return createdAt; } public void setCreatedAt(LocalDateTime v) { this.createdAt = v; }

    public static Builder builder() { return new Builder(); }
    public static class Builder {
        private final VerificationAuditLog v = new VerificationAuditLog();
        public Builder id(Long id) { v.id = id; return this; }
        public Builder user(User u) { v.user = u; return this; }
        public Builder action(String a) { v.action = a; return this; }
        public Builder details(String d) { v.details = d; return this; }
        public Builder deviceInformation(String di) { v.deviceInformation = di; return this; }
        public VerificationAuditLog build() { return v; }
    }
}
