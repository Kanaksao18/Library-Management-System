package com.example.backend.controllers;

import com.example.backend.dto.*;
import com.example.backend.repository.*;
import com.example.backend.model.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.*;
import java.time.LocalDate;
import java.time.format.TextStyle;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/reports")
public class ReportController {
    
    @Autowired
    private BorrowingRepository borrowingRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private BookRepository bookRepository;

    @GetMapping("/summary")
    public ReportSummaryDTO getSummary() {
        LocalDate now = LocalDate.now();
        LocalDate startOfMonth = now.withDayOfMonth(1);
        LocalDate startOfLastMonth = startOfMonth.minusMonths(1);
        LocalDate endOfLastMonth = startOfMonth.minusDays(1);
        
        // Books issued this month
        long booksIssuedThisMonth = borrowingRepository.findByIssuedDateBetween(startOfMonth, now).size();
        
        // Books issued last month
        long booksIssuedLastMonth = borrowingRepository.findByIssuedDateBetween(startOfLastMonth, startOfMonth.minusDays(1)).size();
        
        double booksIssuedChange = booksIssuedLastMonth > 0 ? 
            (double)(booksIssuedThisMonth - booksIssuedLastMonth) / booksIssuedLastMonth : 0.0;
        
        // New members this month
        long newMembersThisMonth = userRepository.findAll().stream()
            .filter(u -> {
                try {
                    LocalDate joinDate = LocalDate.parse(u.getJoinDate());
                    return joinDate.isAfter(startOfMonth.minusDays(1));
                } catch (Exception e) {
                    return false;
                }
            })
            .count();
        
        // New members last month
        long newMembersLastMonth = userRepository.findAll().stream()
            .filter(u -> {
                try {
                    LocalDate joinDate = LocalDate.parse(u.getJoinDate());
                    return joinDate.isAfter(startOfLastMonth.minusDays(1)) && 
                           joinDate.isBefore(startOfMonth);
                } catch (Exception e) {
                    return false;
                }
            })
            .count();
        
        double newMembersChange = newMembersLastMonth > 0 ? 
            (double)(newMembersThisMonth - newMembersLastMonth) / newMembersLastMonth : 0.0;
        
        // Return rate calculation
        long totalBorrowings = borrowingRepository.countTotalBorrowings();
        long returnedBorrowings = borrowingRepository.countReturnedBorrowings();
        
        double returnRate = totalBorrowings > 0 ? (double) returnedBorrowings / totalBorrowings : 0.0;
        
        // Average days borrowed
        List<Borrowing> returnedBorrowingsList = borrowingRepository.findByReturnedDateIsNotNullOrderByReturnedDateDesc();
        double avgDaysBorrowed = returnedBorrowingsList.stream()
            .mapToLong(b -> java.time.temporal.ChronoUnit.DAYS.between(b.getIssuedDate(), b.getReturnedDate()))
            .average()
            .orElse(0.0);
        
        ReportSummaryDTO dto = new ReportSummaryDTO();
        dto.setBooksIssuedThisMonth((int) booksIssuedThisMonth);
        dto.setBooksIssuedChange(booksIssuedChange);
        dto.setNewMembers((int) newMembersThisMonth);
        dto.setNewMembersChange(newMembersChange);
        dto.setReturnRate(returnRate);
        dto.setReturnRateChange(0.02); // Placeholder for now
        dto.setAvgDaysBorrowed((int) avgDaysBorrowed);
        dto.setAvgDaysBorrowedChange(-1); // Placeholder for now
        return dto;
    }

    @GetMapping("/monthly-activity")
    public List<MonthlyActivityDTO> getMonthlyActivity() {
        List<MonthlyActivityDTO> list = new ArrayList<>();
        LocalDate now = LocalDate.now();
        
        for (int i = 5; i >= 0; i--) {
            LocalDate monthStart = now.minusMonths(i).withDayOfMonth(1);
            LocalDate monthEnd = monthStart.plusMonths(1).minusDays(1);
            
            String monthName = monthStart.getMonth().getDisplayName(TextStyle.SHORT, Locale.ENGLISH);
            
            List<Borrowing> monthBorrowings = borrowingRepository.findByIssuedDateBetween(monthStart, monthEnd);
            List<Borrowing> monthReturns = borrowingRepository.findByReturnedDateBetween(monthStart, monthEnd);
            
            int issued = monthBorrowings.size();
            int returned = monthReturns.size();
            
            MonthlyActivityDTO dto = new MonthlyActivityDTO();
            dto.setMonth(monthName);
            dto.setIssued(issued);
            dto.setReturned(returned);
            list.add(dto);
        }
        return list;
    }

    @GetMapping("/popular-books")
    public List<PopularBookDTO> getPopularBooks() {
        List<PopularBookDTO> list = new ArrayList<>();
        
        // Group borrowings by book and count occurrences
        Map<Book, Long> bookBorrowingCounts = borrowingRepository.findAll().stream()
            .collect(Collectors.groupingBy(Borrowing::getBook, Collectors.counting()));
        
        // Sort by borrowing count and take top 5
        List<Map.Entry<Book, Long>> sortedBooks = bookBorrowingCounts.entrySet().stream()
            .sorted(Map.Entry.<Book, Long>comparingByValue().reversed())
            .limit(5)
            .collect(Collectors.toList());
        
        for (int i = 0; i < sortedBooks.size(); i++) {
            Map.Entry<Book, Long> entry = sortedBooks.get(i);
            Book book = entry.getKey();
            Long timesBorrowed = entry.getValue();
            
            PopularBookDTO dto = new PopularBookDTO();
            dto.setRank(i + 1);
            dto.setTitle(book.getTitle());
            dto.setCategory(book.getCategory() != null ? book.getCategory() : "General");
            dto.setTimesBorrowed(timesBorrowed.intValue());
            list.add(dto);
        }
        
        return list;
    }
    
    @GetMapping("/category-stats")
    public Map<String, Object> getCategoryStats() {
        Map<String, Object> stats = new HashMap<>();
        
        // Get all categories
        List<String> categories = bookRepository.findAllCategories();
        
        // Count books by category
        Map<String, Long> booksByCategory = new HashMap<>();
        for (String category : categories) {
            booksByCategory.put(category, bookRepository.countByCategory(category));
        }
        
        // Count borrowings by category
        Map<String, Long> borrowingsByCategory = new HashMap<>();
        for (String category : categories) {
            List<Book> booksInCategory = bookRepository.findByCategory(category);
            long borrowings = borrowingRepository.findAll().stream()
                .filter(b -> booksInCategory.contains(b.getBook()))
                .count();
            borrowingsByCategory.put(category, borrowings);
        }
        
        stats.put("categories", categories);
        stats.put("booksByCategory", booksByCategory);
        stats.put("borrowingsByCategory", borrowingsByCategory);
        
        return stats;
    }
} 