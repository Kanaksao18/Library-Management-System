package com.example.backend.model;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "users")
public class User implements UserDetails {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String username;

    @Column(nullable = false)
    private String password;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;

    @Column(nullable = false)
    private String email;

    @Column(nullable = true)
    private String phone;

    @Column(nullable = false)
    private String joinDate; // Store as string for simplicity (e.g., "2023-01-15")

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private MemberType memberType;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Status status;

    // DSA: HashSet for borrowed books
    @ElementCollection
    private Set<Long> borrowedBookIds = new HashSet<>();

    public enum Role {
        USER, ADMIN
    }

    public enum MemberType {
        STANDARD, PREMIUM, VIP, STUDENT
    }

    public enum Status {
        ACTIVE, SUSPENDED
    }

    public Role getRole() {
        return this.role;
    }

    public Long getId() {
        return this.id;
    }

    public Set<Long> getBorrowedBookIds() {
        return this.borrowedBookIds;
    }

    public String getEmail() { return this.email; }
    public String getPhone() { return this.phone; }
    public String getJoinDate() { return this.joinDate; }
    public MemberType getMemberType() { return this.memberType; }
    public Status getStatus() { return this.status; }

    // Setters
    public void setUsername(String username) { this.username = username; }
    public void setEmail(String email) { this.email = email; }
    public void setPhone(String phone) { this.phone = phone; }
    public void setMemberType(MemberType memberType) { this.memberType = memberType; }
    public void setStatus(Status status) { this.status = status; }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority("ROLE_" + role.name()));
    }

    @Override public boolean isAccountNonExpired() { return true; }
    @Override public boolean isAccountNonLocked() { return true; }
    @Override public boolean isCredentialsNonExpired() { return true; }
    @Override public boolean isEnabled() { return true; }
    @Override public String getUsername() { return this.username; }
    @Override public String getPassword() { return this.password; }
}
