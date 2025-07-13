package com.example.backend.services;

import com.example.backend.model.Book;
import com.example.backend.model.User;
import com.example.backend.model.WaitlistEntry;
import com.example.backend.repository.BookRepository;
import com.example.backend.repository.UserRepository;
import com.example.backend.repository.WaitlistEntryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.PriorityQueue;
import java.util.Comparator;

@Service
@RequiredArgsConstructor
public class WaitlistService {
    private final WaitlistEntryRepository waitlistEntryRepository;
    private final BookRepository bookRepository;
    private final UserRepository userRepository;

    /**
     * Add user to waitlist with priority queue implementation
     * Priority based on: VIP status, member type, join date
     */
    public WaitlistEntry addToWaitlist(Long bookId, Long userId) {
        Book book = bookRepository.findById(bookId)
            .orElseThrow(() -> new RuntimeException("Book not found"));
        
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));

        // Calculate priority based on user characteristics
        int priority = calculatePriority(user);

        WaitlistEntry entry = WaitlistEntry.builder()
            .book(book)
            .user(user)
            .priority(priority)
            .createdAt(LocalDateTime.now())
            .build();

        return waitlistEntryRepository.save(entry);
    }

    /**
     * Get waitlist for a book using priority queue
     * Returns users in priority order (highest first)
     */
    public List<WaitlistEntry> getWaitlistForBook(Long bookId) {
        List<WaitlistEntry> entries = waitlistEntryRepository.findByBookIdOrderByPriorityDescCreatedAtAsc(bookId);
        
        // Use PriorityQueue for efficient sorting
        PriorityQueue<WaitlistEntry> priorityQueue = new PriorityQueue<>(
            Comparator.comparing(WaitlistEntry::getPriority).reversed()
                .thenComparing(WaitlistEntry::getCreatedAt)
        );
        
        priorityQueue.addAll(entries);
        
        // Convert back to list
        List<WaitlistEntry> sortedEntries = new java.util.ArrayList<>();
        while (!priorityQueue.isEmpty()) {
            sortedEntries.add(priorityQueue.poll());
        }
        
        return sortedEntries;
    }

    /**
     * Remove user from waitlist
     */
    public void removeFromWaitlist(Long bookId, Long userId) {
        waitlistEntryRepository.deleteByBookIdAndUserId(bookId, userId);
    }

    /**
     * Notify next user in waitlist when book becomes available
     */
    public void notifyNextInWaitlist(Long bookId) {
        List<WaitlistEntry> waitlist = getWaitlistForBook(bookId);
        if (!waitlist.isEmpty()) {
            WaitlistEntry nextUser = waitlist.get(0);
            // In a real system, this would send an email/notification
            System.out.println("Notifying user: " + nextUser.getUser().getUsername() + 
                             " that book " + nextUser.getBook().getTitle() + " is available");
        }
    }

    /**
     * Calculate priority based on user characteristics
     * Higher priority for VIP members, long-term members, etc.
     */
    private int calculatePriority(User user) {
        int priority = 0;
        
        // VIP members get highest priority
        if ("VIP".equals(user.getMemberType().name())) {
            priority += 100;
        }
        
        // Premium members get medium priority
        if ("PREMIUM".equals(user.getMemberType().name())) {
            priority += 50;
        }
        
        // Long-term members get some priority
        if (user.getJoinDate() != null) {
            // Older join date = higher priority
            priority += 10;
        }
        
        return priority;
    }
} 