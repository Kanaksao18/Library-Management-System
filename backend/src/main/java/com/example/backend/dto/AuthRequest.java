package com.example.backend.dto;

import lombok.Data;

@Data
public class AuthRequest {
    private String username; // Can be username or email
    private String password;
    
    public String getUsername() {
        return this.username;
    }
    
    public String getPassword() {
        return this.password;
    }
}
