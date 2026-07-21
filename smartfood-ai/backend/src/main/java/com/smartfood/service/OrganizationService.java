package com.smartfood.service;

import com.smartfood.dto.OrganizationDTO;
import com.smartfood.dto.OrganizationCreateDTO;
import com.smartfood.dto.OrganizationUpdateDTO;
import com.smartfood.entity.Organization;
import com.smartfood.exception.DuplicateResourceException;
import com.smartfood.exception.ResourceNotFoundException;
import com.smartfood.repository.OrganizationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class OrganizationService {
    private final OrganizationRepository organizationRepository;

    public OrganizationDTO createOrganization(OrganizationCreateDTO dto) {
        if (organizationRepository.findByRegistrationNumberAndDeletedFalse(dto.getRegistrationNumber()).isPresent()) {
            throw new DuplicateResourceException("Organization with this registration number already exists");
        }

        Organization organization = Organization.builder()
            .registrationNumber(dto.getRegistrationNumber())
            .name(dto.getName())
            .type(dto.getType())
            .description(dto.getDescription())
            .contactEmail(dto.getContactEmail())
            .contactPhone(dto.getContactPhone())
            .address(dto.getAddress())
            .latitude(dto.getLatitude())
            .longitude(dto.getLongitude())
            .status(com.smartfood.entity.OrganizationStatus.PENDING)
            .totalDonations(0)
            .totalBeneficiaries(0)
            .totalFoodWeight(0.0)
            .deleted(false)
            .build();

        Organization saved = organizationRepository.save(organization);
        return mapToDTO(saved);
    }

    public OrganizationDTO updateOrganization(Long organizationId, OrganizationUpdateDTO dto) {
        Organization organization = organizationRepository.findByIdAndDeletedFalse(organizationId)
            .orElseThrow(() -> new ResourceNotFoundException("Organization not found"));

        organization.setName(dto.getName());
        organization.setDescription(dto.getDescription());
        organization.setContactEmail(dto.getContactEmail());
        organization.setContactPhone(dto.getContactPhone());
        organization.setAddress(dto.getAddress());
        organization.setLatitude(dto.getLatitude());
        organization.setLongitude(dto.getLongitude());

        Organization updated = organizationRepository.save(organization);
        return mapToDTO(updated);
    }

    public OrganizationDTO getOrganizationDTOById(Long organizationId) {
        Organization organization = organizationRepository.findByIdAndDeletedFalse(organizationId)
            .orElseThrow(() -> new ResourceNotFoundException("Organization not found"));
        return mapToDTO(organization);
    }

    public Organization getOrganizationById(Long organizationId) {
        return organizationRepository.findByIdAndDeletedFalse(organizationId)
            .orElseThrow(() -> new ResourceNotFoundException("Organization not found"));
    }

    public List<OrganizationDTO> getAllOrganizations() {
        return organizationRepository.findAll()
            .stream()
            .filter(org -> !org.getDeleted())
            .map(this::mapToDTO)
            .collect(Collectors.toList());
    }

    private OrganizationDTO mapToDTO(Organization organization) {
        return OrganizationDTO.builder()
            .id(organization.getId())
            .registrationNumber(organization.getRegistrationNumber())
            .name(organization.getName())
            .type(organization.getType())
            .description(organization.getDescription())
            .contactEmail(organization.getContactEmail())
            .contactPhone(organization.getContactPhone())
            .address(organization.getAddress())
            .latitude(organization.getLatitude())
            .longitude(organization.getLongitude())
            .status(organization.getStatus())
            .totalDonations(organization.getTotalDonations())
            .totalBeneficiaries(organization.getTotalBeneficiaries())
            .totalFoodWeight(organization.getTotalFoodWeight())
            .createdAt(organization.getCreatedAt())
            .updatedAt(organization.getUpdatedAt())
            .build();
    }
}
