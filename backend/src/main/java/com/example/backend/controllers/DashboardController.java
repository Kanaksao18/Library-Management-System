package com.example.backend.controllers;

import com.example.backend.model.Book;
import com.example.backend.model.User;
import com.example.backend.repository.BookRepository;
import com.example.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {
    private final UserRepository userRepository;
    private final BookRepository bookRepository;

    // --- Dashboard Stats ---
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getStats() {
        long totalBooks = bookRepository.count();
        long activeMembers = userRepository.count();
        long booksBorrowed = bookRepository.findAll().stream().filter(b -> b.getStatus() == Book.Status.BORROWED).count();
        // For demo: overdue = books borrowed for more than 7 days (mock, since slot is string)
        long overdueBooks = bookRepository.findAll().stream().filter(b -> {
            if (b.getStatus() != Book.Status.BORROWED || b.getSlot() == null) return false;
            try {
                LocalDateTime borrowedAt = LocalDateTime.parse(b.getSlot());
                return borrowedAt.isBefore(LocalDateTime.now().minusDays(7));
            } catch (Exception e) {
                return false;
            }
        }).count();
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalBooks", totalBooks);
        stats.put("activeMembers", activeMembers);
        stats.put("booksBorrowed", booksBorrowed);
        stats.put("overdueBooks", overdueBooks);
        return ResponseEntity.ok(stats);
    }

    // --- Recent Activity (real data) ---
    @GetMapping("/activity")
    public ResponseEntity<List<ActivityDTO>> getRecentActivity() {
        List<ActivityDTO> activity = new ArrayList<>();
        
        // Get recent borrowings
        List<Book> borrowedBooks = bookRepository.findAll().stream()
            .filter(b -> b.getStatus() == Book.Status.BORROWED)
            .limit(3)
            .collect(Collectors.toList());
            
        for (Book book : borrowedBooks) {
            activity.add(new ActivityDTO(
                "Book borrowed", 
                "\"" + book.getTitle() + "\" by " + book.getAuthor(), 
                "Recently", 
                "borrowed"
            ));
        }
        
        // Get recent members
        List<User> recentMembers = userRepository.findAll().stream()
            .limit(2)
            .collect(Collectors.toList());
            
        for (User member : recentMembers) {
            activity.add(new ActivityDTO(
                "New member registered", 
                member.getUsername() + " joined the library", 
                "Recently", 
                "member"
            ));
        }
        
        // Add some system activities
        if (activity.size() < 4) {
            activity.add(new ActivityDTO(
                "System maintenance", 
                "Library database updated successfully", 
                "1 hour ago", 
                "system"
            ));
        }
        
        return ResponseEntity.ok(activity);
    }

    public record ActivityDTO(String title, String description, String time, String type) {}

    // --- Existing borrowed-books endpoint (unchanged, for user dashboard) ---
    @GetMapping("/users/{userId}/borrowed-books")
    public ResponseEntity<List<BookDTO>> getBorrowedBooks(@PathVariable Long userId) {
        User user = userRepository.findById(userId).orElseThrow();
        Set<Long> borrowedIds = user.getBorrowedBookIds();
        List<BookDTO> books = bookRepository.findAllById(borrowedIds).stream().map(book -> new BookDTO(
                book.getId(),
                book.getTitle(),
                book.getStatus().name(),
                book.getSlot(),
                book.getEbookUrl()
        )).collect(Collectors.toList());
        return ResponseEntity.ok(books);
    }
    public record BookDTO(Long id, String title, String status, String slot, String ebookUrl) {}

    // --- Member Management ---
    @GetMapping("/members")
    public ResponseEntity<List<MemberDTO>> getAllMembers() {
        List<User> users = userRepository.findAll();
        List<MemberDTO> members = new ArrayList<>();
        int i = 1;
        for (User user : users) {
            members.add(new MemberDTO(
                user.getId(),
                user.getUsername(),
                String.format("%04d", i++),
                user.getEmail(),
                user.getPhone(),
                user.getJoinDate(),
                user.getMemberType().name(),
                user.getStatus().name(),
                (int)(Math.random()*4), // booksIssued (mock)
                (int)(Math.random()*2), // overdue (mock)
                user.getRole().name()
            ));
        }
        return ResponseEntity.ok(members);
    }
    public record MemberDTO(Long id, String name, String memberId, String email, String phone, String joinDate, String memberType, String status, int booksIssued, int overdue, String role) {}
} 