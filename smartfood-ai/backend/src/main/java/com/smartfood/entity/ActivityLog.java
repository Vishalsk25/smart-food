package com.smartfood.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import java.time.LocalDateTime;

@Entity
@Table(name = "activity_logs")
public class ActivityLog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private String activityType;

    @Column(length = 1000)
    private String description;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime timestamp;

    public ActivityLog() {}
    public Long getId() { return id; } public void setId(Long v) { this.id = v; }
    public User getUser() { return user; } public void setUser(User v) { this.user = v; }
    public String getActivityType() { return activityType; } public void setActivityType(String v) { this.activityType = v; }
    public String getDescription() { return description; } public void setDescription(String v) { this.description = v; }
    public LocalDateTime getTimestamp() { return timestamp; } public void setTimestamp(LocalDateTime v) { this.timestamp = v; }

    public static Builder builder() { return new Builder(); }
    public static class Builder {
        private final ActivityLog a = new ActivityLog();
        public Builder id(Long v) { a.id = v; return this; }
        public Builder user(User v) { a.user = v; return this; }
        public Builder activityType(String v) { a.activityType = v; return this; }
        public Builder description(String v) { a.description = v; return this; }
        public ActivityLog build() { return a; }
    }
}
