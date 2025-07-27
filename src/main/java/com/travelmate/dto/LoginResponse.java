package com.travelmate.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor // Lombok constructor for all fields
public class LoginResponse {
    private String message;
    // Later we will add a token: private String token;
}