package com.smartfood.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import java.time.LocalDateTime;

@Entity
@Table(name = "messages")
public class Message {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sender_id", nullable = false)
    private User sender;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "receiver_id", nullable = false)
    private User receiver;

    @Column(columnDefinition = "TEXT")
    private String message;

    @Column(nullable = false)
    private Boolean readStatus = false;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    public Message() {}
    public Long getId() { return id; } public void setId(Long v) { this.id = v; }
    public User getSender() { return sender; } public void setSender(User v) { this.sender = v; }
    public User getReceiver() { return receiver; } public void setReceiver(User v) { this.receiver = v; }
    public String getMessage() { return message; } public void setMessage(String v) { this.message = v; }
    public Boolean getReadStatus() { return readStatus; } public void setReadStatus(Boolean v) { this.readStatus = v; }
    public LocalDateTime getCreatedAt() { return createdAt; } public void setCreatedAt(LocalDateTime v) { this.createdAt = v; }

    public static Builder builder() { return new Builder(); }
    public static class Builder {
        private final Message m = new Message();
        public Builder id(Long v) { m.id = v; return this; }
        public Builder sender(User v) { m.sender = v; return this; }
        public Builder receiver(User v) { m.receiver = v; return this; }
        public Builder message(String v) { m.message = v; return this; }
        public Builder readStatus(Boolean v) { m.readStatus = v; return this; }
        public Message build() { return m; }
    }
}
