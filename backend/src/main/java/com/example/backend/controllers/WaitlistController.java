package com.example.backend.controllers;

import com.example.backend.model.WaitlistEntry;
import com.example.backend.services.WaitlistService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/waitlist")
@RequiredArgsConstructor
public class WaitlistController {
    private final WaitlistService waitlistService;

    @PostMapping("/add")
    public ResponseEntity<WaitlistEntry> addToWaitlist(@RequestBody WaitlistRequest request) {
        try {
            WaitlistEntry entry = waitlistService.addToWaitlist(request.bookId(), request.userId());
            return ResponseEntity.ok(entry);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/book/{bookId}")
    public ResponseEntity<List<WaitlistEntry>> getWaitlistForBook(@PathVariable Long bookId) {
        List<WaitlistEntry> waitlist = waitlistService.getWaitlistForBook(bookId);
        return ResponseEntity.ok(waitlist);
    }

    @DeleteMapping("/remove")
    public ResponseEntity<Void> removeFromWaitlist(@RequestBody WaitlistRequest request) {
        try {
            waitlistService.removeFromWaitlist(request.bookId(), request.userId());
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    public record WaitlistRequest(Long bookId, Long userId) {}
} 