package com.unfazed.controller;

import com.unfazed.dto.DTOs.EntitlementCheckResponse;
import com.unfazed.service.EntitlementService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/entitlements")
@CrossOrigin(origins = "*")
public class EntitlementController {

    @Autowired
    private EntitlementService entitlementService;

    @GetMapping("/check")
    public ResponseEntity<?> checkEntitlement(@RequestParam Long therapistId, @RequestParam String featureKey) {
        EntitlementCheckResponse response = entitlementService.canAccess(therapistId, featureKey);
        return ResponseEntity.ok(response);
    }
}
