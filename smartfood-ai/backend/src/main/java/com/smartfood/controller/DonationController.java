package com.smartfood.controller;

import com.smartfood.dto.*;
import com.smartfood.service.FoodDonationService;
import com.smartfood.util.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/v1/donations")
@RequiredArgsConstructor
@CrossOrigin(origins = "*", maxAge = 3600)
public class DonationController {
    private final FoodDonationService donationService;

    @PostMapping
    public ResponseEntity<ApiResponse<FoodDonationDTO>> createDonation(
        @RequestParam Long donorId,
        @RequestBody FoodDonationCreateDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(ApiResponse.success("Donation created successfully", 
                donationService.createDonation(donorId, dto)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<FoodDonationDTO>> updateDonation(
        @PathVariable Long id,
        @RequestBody FoodDonationUpdateDTO dto) {
        return ResponseEntity.ok(ApiResponse.success("Donation updated successfully",
            donationService.updateDonation(id, dto)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<FoodDonationDTO>> getDonation(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(donationService.getDonationById(id)));
    }

    @GetMapping("/available/all")
    public ResponseEntity<ApiResponse<List<FoodDonationDTO>>> getAvailableDonations() {
        return ResponseEntity.ok(ApiResponse.success(donationService.getAvailableDonations()));
    }

    @GetMapping("/nearby")
    public ResponseEntity<ApiResponse<List<FoodDonationDTO>>> getNearbyDonations(
        @RequestParam Double latitude,
        @RequestParam Double longitude,
        @RequestParam(defaultValue = "10") Double radiusKm) {
        return ResponseEntity.ok(ApiResponse.success(
            donationService.getNearbyDonations(latitude, longitude, radiusKm)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteDonation(@PathVariable Long id) {
        donationService.deleteDonation(id);
        return ResponseEntity.ok(ApiResponse.success("Donation deleted successfully", null));
    }
}
