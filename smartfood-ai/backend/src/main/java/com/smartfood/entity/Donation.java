package com.smartfood.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "donations")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Donation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private String type; // "FOOD" or "DOCUMENT"

    @Column(nullable = false)
    private String title;

    @Column(length = 1000)
    private String description;

    @Column(nullable = false)
    private String quantity;

    @Column(length = 500)
    private String category;

    @Column(columnDefinition = "LONGTEXT")
    private String image; // Base64 or URL

    @Column(nullable = false)
    private String status; // Pending, Under Review, Approved, Rejected, Scheduled, Picked Up, Completed, Cancelled

    @Column(length = 500)
    private String pickupAddress;

    @Column(nullable = false)
    private String donationDate;

    @Column(nullable = false)
    private String donationTime;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;
}
