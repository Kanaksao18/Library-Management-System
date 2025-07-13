package com.example.backend.model;

import jakarta.persistence.*;
import lombok.*;
import java.util.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "books")
public class Book {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private String author;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Status status;

    @Column(nullable = true)
    private String ebookUrl;

    @Column(nullable = true)
    private String slot; // Borrow slot info

    @Column(nullable = true)
    private String category; // Book category for tree structure

    @Column(nullable = true)
    private String isbn; // ISBN for hash table lookups

    // DSA: Waitlist as a list, managed as a priority queue in service
    @OneToMany(mappedBy = "book", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<WaitlistEntry> waitlist = new ArrayList<>();

    public boolean isAvailable() {
        return this.status == Status.AVAILABLE;
    }

    public String getEbookUrl() {
        return this.ebookUrl;
    }
    public String getSlot() {
        return this.slot;
    }
    public String getTitle() {
        return this.title;
    }
    public Long getId() {
        return this.id;
    }
    public Status getStatus() {
        return this.status;
    }
    public String getAuthor() {
        return this.author;
    }
    public void setId(Long id) {
        this.id = id;
    }

    public void setEbookUrl(String ebookUrl) {
        this.ebookUrl = ebookUrl;
    }
    public void setSlot(String slot) {
        this.slot = slot;
    }

    public List<WaitlistEntry> getWaitlist() {
        return this.waitlist;
    }
    public void setStatus(Status status) {
        this.status = status;
    }
    
    public void setTitle(String title) {
        this.title = title;
    }
    
    public void setAuthor(String author) {
        this.author = author;
    }

    public String getCategory() {
        return this.category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getIsbn() {
        return this.isbn;
    }

    public void setIsbn(String isbn) {
        this.isbn = isbn;
    }

    public enum Status {
        AVAILABLE, BORROWED
    }
}
