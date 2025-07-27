package com.travelmate.dto;

import lombok.Data;

@Data // Lombok's annotation for getters and setters
public class RegistrationRequest {
    private String name;
    private String email;
    private String password;
}