package com.travelmate.controller;

import com.travelmate.dto.LoginRequest;
import com.travelmate.dto.LoginResponse;
import com.travelmate.dto.RegistrationRequest;
import com.travelmate.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody RegistrationRequest request) {
        try {
            authService.register(request.getName(), request.getEmail(), request.getPassword());
            return ResponseEntity.ok("User registered successfully!");
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest loginRequest) {
        try {
            authService.login(loginRequest);
            return ResponseEntity.ok(new LoginResponse("Login successful!"));
        } catch (Exception e) {
            // This catches bad credentials exceptions from Spring Security
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new LoginResponse("Invalid email or password."));
        }
    }
}