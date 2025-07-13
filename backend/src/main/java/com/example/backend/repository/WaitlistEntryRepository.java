package com.example.backend.repository;

import com.example.backend.model.WaitlistEntry;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface WaitlistEntryRepository extends JpaRepository<WaitlistEntry, Long> {
    
    @Query("SELECT w FROM WaitlistEntry w WHERE w.book.id = :bookId ORDER BY w.priority DESC, w.createdAt ASC")
    List<WaitlistEntry> findByBookIdOrderByPriorityDescCreatedAtAsc(@Param("bookId") Long bookId);
    
    void deleteByBookIdAndUserId(Long bookId, Long userId);
}
