package com.smartfood.controller;

import com.smartfood.dto.*;
import com.smartfood.service.OrganizationService;
import com.smartfood.util.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/v1/organizations")
@RequiredArgsConstructor
@CrossOrigin(origins = "*", maxAge = 3600)
public class OrganizationController {
    private final OrganizationService organizationService;

    @PostMapping
    public ResponseEntity<ApiResponse<OrganizationDTO>> createOrganization(@RequestBody OrganizationCreateDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(ApiResponse.success("Organization created successfully",
                organizationService.createOrganization(dto)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<OrganizationDTO>> updateOrganization(
        @PathVariable Long id,
        @RequestBody OrganizationUpdateDTO dto) {
        return ResponseEntity.ok(ApiResponse.success("Organization updated successfully",
            organizationService.updateOrganization(id, dto)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<OrganizationDTO>> getOrganization(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(
            organizationService.getOrganizationDTOById(id)));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<OrganizationDTO>>> getAllOrganizations() {
        return ResponseEntity.ok(ApiResponse.success(
            organizationService.getAllOrganizations()));
    }
}
