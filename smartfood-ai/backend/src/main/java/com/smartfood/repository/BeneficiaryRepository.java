package com.smartfood.repository;

import com.smartfood.entity.Beneficiary;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BeneficiaryRepository extends JpaRepository<Beneficiary, Long> {
    Optional<Beneficiary> findByIdAndDeletedFalse(Long id);
    
    List<Beneficiary> findByOrganizationIdAndDeletedFalse(Long organizationId);
}
