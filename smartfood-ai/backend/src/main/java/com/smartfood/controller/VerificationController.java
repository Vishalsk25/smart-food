package com.smartfood.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.smartfood.service.VerificationService;

import java.util.Map;

@RestController
@RequestMapping("/api/v1")
public class VerificationController {
    private final VerificationService verificationService;

    public VerificationController(VerificationService verificationService) {
        this.verificationService = verificationService;
    }

    @PostMapping("/pickup/scan")
    public ResponseEntity<?> scanPickupQr(@RequestBody Map<String, Object> payload) {
        return ResponseEntity.ok(verificationService.scanQr(payload, "PICKUP"));
    }

    @PostMapping("/pickup/verify-otp")
    public ResponseEntity<?> verifyPickupOtp(@RequestBody Map<String, Object> payload) {
        return ResponseEntity.ok(verificationService.verifyOtp(payload, "PICKUP"));
    }

    @PostMapping("/delivery/scan")
    public ResponseEntity<?> scanDeliveryQr(@RequestBody Map<String, Object> payload) {
        return ResponseEntity.ok(verificationService.scanQr(payload, "DELIVERY"));
    }

    @PostMapping("/delivery/verify-otp")
    public ResponseEntity<?> verifyDeliveryOtp(@RequestBody Map<String, Object> payload) {
        return ResponseEntity.ok(verificationService.verifyOtp(payload, "DELIVERY"));
    }

    @PostMapping("/otp/send")
    public ResponseEntity<?> sendOtp(@RequestBody Map<String, Object> payload) {
        return ResponseEntity.ok(verificationService.sendOtp(payload));
    }

    @PostMapping("/otp/resend")
    public ResponseEntity<?> resendOtp(@RequestBody Map<String, Object> payload) {
        return ResponseEntity.ok(verificationService.resendOtp(payload));
    }

    @GetMapping("/verification/history")
    public ResponseEntity<?> getVerificationHistory(@RequestParam Long orderId) {
        return ResponseEntity.ok(verificationService.getVerificationHistory(orderId));
    }
}
