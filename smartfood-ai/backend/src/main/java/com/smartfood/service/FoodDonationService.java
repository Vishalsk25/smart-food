package com.smartfood.service;

import com.smartfood.dto.FoodDonationDTO;
import com.smartfood.dto.FoodDonationCreateDTO;
import com.smartfood.dto.FoodDonationUpdateDTO;
import com.smartfood.entity.FoodDonation;
import com.smartfood.entity.DonationStatus;
import com.smartfood.exception.ResourceNotFoundException;
import com.smartfood.repository.FoodDonationRepository;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class FoodDonationService {
    private final FoodDonationRepository donationRepository;
    private final OrganizationService organizationService;

    public FoodDonationService(FoodDonationRepository donationRepository, OrganizationService organizationService) {
        this.donationRepository = donationRepository;
        this.organizationService = organizationService;
    }

    public FoodDonationDTO createDonation(Long donorId, FoodDonationCreateDTO dto) {
        var donor = organizationService.getOrganizationById(donorId);
        FoodDonation donation = FoodDonation.builder()
            .donor(donor).foodName(dto.getFoodName()).description(dto.getDescription())
            .quantity(dto.getQuantity()).unit(dto.getUnit()).category(dto.getCategory())
            .expiryTime(dto.getExpiryTime()).latitude(dto.getLatitude()).longitude(dto.getLongitude())
            .pickupInstructions(dto.getPickupInstructions()).status(DonationStatus.AVAILABLE)
            .imageUrl(dto.getImageUrl()).estimatedBeneficiaries(dto.getEstimatedBeneficiaries())
            .deleted(false).build();
        return mapToDTO(donationRepository.save(donation));
    }

    public FoodDonationDTO updateDonation(Long donationId, FoodDonationUpdateDTO dto) {
        FoodDonation donation = donationRepository.findByIdAndDeletedFalse(donationId)
            .orElseThrow(() -> new ResourceNotFoundException("Donation not found"));
        donation.setFoodName(dto.getFoodName());
        donation.setDescription(dto.getDescription());
        donation.setQuantity(dto.getQuantity());
        donation.setExpiryTime(dto.getExpiryTime());
        donation.setPickupInstructions(dto.getPickupInstructions());
        if (dto.getImageUrl() != null) donation.setImageUrl(dto.getImageUrl());
        donation.setEstimatedBeneficiaries(dto.getEstimatedBeneficiaries());
        return mapToDTO(donationRepository.save(donation));
    }

    public FoodDonationDTO getDonationById(Long donationId) {
        return mapToDTO(donationRepository.findByIdAndDeletedFalse(donationId)
            .orElseThrow(() -> new ResourceNotFoundException("Donation not found")));
    }

    public List<FoodDonationDTO> getAvailableDonations() {
        return donationRepository.findByStatusAndDeletedFalse(DonationStatus.AVAILABLE)
            .stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<FoodDonationDTO> getNearbyDonations(Double latitude, Double longitude, Double radiusKm) {
        double latOffset = radiusKm / 111.0;
        double lngOffset = radiusKm / (111.0 * Math.cos(Math.toRadians(latitude)));
        return donationRepository.findAvailableNearby(
            DonationStatus.AVAILABLE,
            latitude - latOffset, latitude + latOffset,
            longitude - lngOffset, longitude + lngOffset,
            LocalDateTime.now()
        ).stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    public void deleteDonation(Long donationId) {
        FoodDonation donation = donationRepository.findByIdAndDeletedFalse(donationId)
            .orElseThrow(() -> new ResourceNotFoundException("Donation not found"));
        donation.setDeleted(true);
        donationRepository.save(donation);
    }

    private FoodDonationDTO mapToDTO(FoodDonation donation) {
        return FoodDonationDTO.builder()
            .id(donation.getId()).donorId(donation.getDonor().getId())
            .donorName(donation.getDonor().getName()).foodName(donation.getFoodName())
            .description(donation.getDescription()).quantity(donation.getQuantity())
            .unit(donation.getUnit()).category(donation.getCategory())
            .expiryTime(donation.getExpiryTime()).latitude(donation.getLatitude())
            .longitude(donation.getLongitude()).pickupInstructions(donation.getPickupInstructions())
            .status(donation.getStatus()).imageUrl(donation.getImageUrl())
            .estimatedBeneficiaries(donation.getEstimatedBeneficiaries())
            .createdAt(donation.getCreatedAt()).updatedAt(donation.getUpdatedAt()).build();
    }
}
