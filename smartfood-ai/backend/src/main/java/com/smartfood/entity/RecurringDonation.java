package com.smartfood.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "recurring_donations")
public class RecurringDonation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "donation_id", nullable = false)
    private Donation donation;

    @Column(nullable = false)
    private String frequency;

    @Column(nullable = false)
    private String nextDate;

    @Column(nullable = false)
    private String status;

    public RecurringDonation() {}
    public Long getId() { return id; } public void setId(Long v) { this.id = v; }
    public User getUser() { return user; } public void setUser(User v) { this.user = v; }
    public Donation getDonation() { return donation; } public void setDonation(Donation v) { this.donation = v; }
    public String getFrequency() { return frequency; } public void setFrequency(String v) { this.frequency = v; }
    public String getNextDate() { return nextDate; } public void setNextDate(String v) { this.nextDate = v; }
    public String getStatus() { return status; } public void setStatus(String v) { this.status = v; }

    public static Builder builder() { return new Builder(); }
    public static class Builder {
        private final RecurringDonation r = new RecurringDonation();
        public Builder id(Long v) { r.id = v; return this; }
        public Builder user(User v) { r.user = v; return this; }
        public Builder donation(Donation v) { r.donation = v; return this; }
        public Builder frequency(String v) { r.frequency = v; return this; }
        public Builder nextDate(String v) { r.nextDate = v; return this; }
        public Builder status(String v) { r.status = v; return this; }
        public RecurringDonation build() { return r; }
    }
}
