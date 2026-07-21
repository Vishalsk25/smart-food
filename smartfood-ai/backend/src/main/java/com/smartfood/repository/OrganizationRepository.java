package com.smartfood.repository;

import com.smartfood.entity.Organization;
import com.smartfood.entity.OrganizationType;
import com.smartfood.entity.OrganizationStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.List;

@Repository
public interface OrganizationRepository extends JpaRepository<Organization, Long> {
    Optional<Organization> findByRegistrationNumberAndDeletedFalse(String registrationNumber);
    Optional<Organization> findByIdAndDeletedFalse(Long id);
    List<Organization> findByTypeAndStatusAndDeletedFalse(OrganizationType type, OrganizationStatus status);
    List<Organization> findByStatusAndDeletedFalse(OrganizationStatus status);
}
