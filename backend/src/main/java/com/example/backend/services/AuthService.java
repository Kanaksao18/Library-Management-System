package com.example.backend.services;

import com.example.backend.dto.RegisterRequest;
import com.example.backend.model.User;
import com.example.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.HashSet;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public void register(RegisterRequest req) {
        if (userRepository.findByUsername(req.getUsername()).isPresent()) {
            throw new RuntimeException("Username already exists");
        }
        
        if (req.getEmail() != null && userRepository.findByEmail(req.getEmail()).isPresent()) {
            throw new RuntimeException("Email already exists");
        }
        
        User user = User.builder()
                .username(req.getUsername())
                .password(passwordEncoder.encode(req.getPassword()))
                .email(req.getEmail())
                .phone(req.getPhone())
                .role(req.getRole() != null ? User.Role.valueOf(req.getRole().toUpperCase()) : User.Role.USER)
                .memberType(req.getMemberType() != null ? User.MemberType.valueOf(req.getMemberType().toUpperCase()) : User.MemberType.STANDARD)
                .joinDate(req.getJoinDate() != null ? req.getJoinDate() : LocalDate.now().toString())
                .status(User.Status.ACTIVE)
                .borrowedBookIds(new HashSet<>())
                .build();
        userRepository.save(user);
    }
}
