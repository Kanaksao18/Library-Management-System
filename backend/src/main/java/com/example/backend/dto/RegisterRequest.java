package com.example.backend.dto;

import com.example.backend.model.User;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RegisterRequest {
    private String username;
    private String password;
    private String email;
    private String phone;
    private String memberType; // "STANDARD", "PREMIUM", "STUDENT"
    private String role; // "USER" or "ADMIN"
    private String joinDate; // Optional, will be set to current date if not provided
    
    public String getUsername() { return this.username; }
    public String getPassword() { return this.password; }
    public String getEmail() { return this.email; }
    public String getPhone() { return this.phone; }
    public String getMemberType() { return this.memberType; }
    public String getRole() { return this.role; }
    public String getJoinDate() { return this.joinDate; }
}
