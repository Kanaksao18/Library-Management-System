package com.example.backend.repository;

import com.example.backend.model.Borrowing;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface BorrowingRepository extends JpaRepository<Borrowing, Long> {
    
    List<Borrowing> findByReturnedDateIsNull();
    
    List<Borrowing> findByReturnedDateIsNotNullOrderByReturnedDateDesc();
    
    @Query("SELECT b FROM Borrowing b WHERE b.issuedDate >= :startDate AND b.issuedDate <= :endDate")
    List<Borrowing> findByIssuedDateBetween(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);
    
    @Query("SELECT b FROM Borrowing b WHERE b.returnedDate >= :startDate AND b.returnedDate <= :endDate")
    List<Borrowing> findByReturnedDateBetween(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);
    
    @Query("SELECT COUNT(b) FROM Borrowing b WHERE b.returnedDate IS NOT NULL")
    long countReturnedBorrowings();
    
    @Query("SELECT COUNT(b) FROM Borrowing b")
    long countTotalBorrowings();
} 