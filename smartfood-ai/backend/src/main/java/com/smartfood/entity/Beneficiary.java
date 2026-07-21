package com.smartfood.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import java.time.LocalDateTime;

@Entity
@Table(name = "beneficiaries")
public class Beneficiary {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "organization_id", nullable = false)
    private Organization organization;

    @Column(nullable = false)
    private String name;

    private Integer age;

    @Enumerated(EnumType.STRING)
    private BeneficiaryType type;

    @Column(length = 500)
    private String notes;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private Boolean deleted = false;

    public Beneficiary() {}
    public Long getId() { return id; } public void setId(Long v) { this.id = v; }
    public Organization getOrganization() { return organization; } public void setOrganization(Organization v) { this.organization = v; }
    public String getName() { return name; } public void setName(String v) { this.name = v; }
    public Integer getAge() { return age; } public void setAge(Integer v) { this.age = v; }
    public BeneficiaryType getType() { return type; } public void setType(BeneficiaryType v) { this.type = v; }
    public String getNotes() { return notes; } public void setNotes(String v) { this.notes = v; }
    public LocalDateTime getCreatedAt() { return createdAt; } public void setCreatedAt(LocalDateTime v) { this.createdAt = v; }
    public Boolean getDeleted() { return deleted; } public void setDeleted(Boolean v) { this.deleted = v; }

    public static Builder builder() { return new Builder(); }
    public static class Builder {
        private final Beneficiary b = new Beneficiary();
        public Builder id(Long v) { b.id = v; return this; }
        public Builder organization(Organization v) { b.organization = v; return this; }
        public Builder name(String v) { b.name = v; return this; }
        public Builder age(Integer v) { b.age = v; return this; }
        public Builder type(BeneficiaryType v) { b.type = v; return this; }
        public Builder notes(String v) { b.notes = v; return this; }
        public Builder deleted(Boolean v) { b.deleted = v; return this; }
        public Beneficiary build() { return b; }
    }
}
