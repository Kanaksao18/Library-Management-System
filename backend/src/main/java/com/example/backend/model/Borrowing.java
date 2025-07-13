package com.example.backend.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "borrowings")
public class Borrowing {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "book_id", nullable = false)
    private Book book;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id", nullable = false)
    private User member;

    @Column(nullable = false)
    private LocalDate issuedDate;

    @Column(nullable = false)
    private LocalDate dueDate;

    @Column(nullable = true)
    private LocalDate returnedDate;

    // Getters and setters
    public Long getId() {
        return this.id;
    }

    public Book getBook() {
        return this.book;
    }

    public User getMember() {
        return this.member;
    }

    public LocalDate getIssuedDate() {
        return this.issuedDate;
    }

    public LocalDate getDueDate() {
        return this.dueDate;
    }

    public LocalDate getReturnedDate() {
        return this.returnedDate;
    }

    public void setReturnedDate(LocalDate returnedDate) {
        this.returnedDate = returnedDate;
    }
}
