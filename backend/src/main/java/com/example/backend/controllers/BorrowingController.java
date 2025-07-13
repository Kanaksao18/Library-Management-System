package com.example.backend.controllers;

import com.example.backend.model.*;
import com.example.backend.repository.*;
import lombok.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/borrowing")
public class BorrowingController {
    private final BorrowingRepository borrowingRepository;
    private final BookRepository bookRepository;
    private final UserRepository userRepository;

    @Autowired
    public BorrowingController(BorrowingRepository borrowingRepository, 
                             BookRepository bookRepository, 
                             UserRepository userRepository) {
        this.borrowingRepository = borrowingRepository;
        this.bookRepository = bookRepository;
        this.userRepository = userRepository;
    }

    @GetMapping("/borrowed")
    public List<BorrowingDTO> getBorrowedBooks() {
        return borrowingRepository.findByReturnedDateIsNull().stream().map(BorrowingDTO::from).toList();
    }

    @GetMapping("/returns")
    public List<BorrowingDTO> getRecentReturns() {
        return borrowingRepository.findByReturnedDateIsNotNullOrderByReturnedDateDesc().stream().limit(10).map(BorrowingDTO::from).toList();
    }

    @PostMapping("/issue")
    public ResponseEntity<?> issueBook(@RequestBody IssueRequest req) {
        Book book = bookRepository.findById(req.bookId()).orElseThrow();
        User member = userRepository.findById(req.memberId()).orElseThrow();
        
        // Check if book is available
        if (book.getStatus() != Book.Status.AVAILABLE) {
            return ResponseEntity.badRequest().body("Book is not available for borrowing");
        }
        
        LocalDate today = LocalDate.now();
        Borrowing borrowing = Borrowing.builder()
                .book(book)
                .member(member)
                .issuedDate(today)
                .dueDate(today.plusDays(30))
                .build();
        borrowingRepository.save(borrowing);
        
        // Update book status to BORROWED
        book.setStatus(Book.Status.BORROWED);
        bookRepository.save(book);
        
        // Notify next person in waitlist if any
        // waitlistService.notifyNextInWaitlist(req.bookId());
        
        return ResponseEntity.ok(BorrowingDTO.from(borrowing));
    }

    @PostMapping("/return/{borrowId}")
    public ResponseEntity<?> returnBook(@PathVariable Long borrowId) {
        Borrowing borrowing = borrowingRepository.findById(borrowId).orElseThrow();
        borrowing.setReturnedDate(LocalDate.now());
        borrowingRepository.save(borrowing);
        
        // Update book status to AVAILABLE
        Book book = borrowing.getBook();
        book.setStatus(Book.Status.AVAILABLE);
        bookRepository.save(book);
        
        return ResponseEntity.ok("Book returned");
    }

    public record IssueRequest(Long bookId, Long memberId) {}

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class BorrowingDTO {
        private Long id;
        private String title;
        private String memberName;
        private String memberId;
        private String issuedDate;
        private String dueDate;
        private String returnedDate;
        private String status; // "due_today", "overdue", "returned"

        public static BorrowingDTO from(Borrowing b) {
            String status = "normal";
            if (b.getReturnedDate() == null) {
                if (b.getDueDate().isEqual(LocalDate.now())) status = "due_today";
                else if (b.getDueDate().isBefore(LocalDate.now())) status = "overdue";
            } else {
                status = "returned";
            }
            return new BorrowingDTO(
                b.getId(),
                b.getBook().getTitle(),
                b.getMember().getUsername(),
                String.format("%04d", b.getMember().getId()),
                b.getIssuedDate().toString(),
                b.getDueDate().toString(),
                b.getReturnedDate() != null ? b.getReturnedDate().toString() : null,
                status
            );
        }
    }
}
