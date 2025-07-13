package com.example.backend.dto;

import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ReportSummaryDTO {
    private int booksIssuedThisMonth;
    private double booksIssuedChange;
    private int newMembers;
    private double newMembersChange;
    private double returnRate;
    private double returnRateChange;
    private int avgDaysBorrowed;
    private double avgDaysBorrowedChange;

    public void setBooksIssuedThisMonth(int booksIssuedThisMonth) { this.booksIssuedThisMonth = booksIssuedThisMonth; }
    public void setBooksIssuedChange(double booksIssuedChange) { this.booksIssuedChange = booksIssuedChange; }
    public void setNewMembers(int newMembers) { this.newMembers = newMembers; }
    public void setNewMembersChange(double newMembersChange) { this.newMembersChange = newMembersChange; }
    public void setReturnRate(double returnRate) { this.returnRate = returnRate; }
    public void setReturnRateChange(double returnRateChange) { this.returnRateChange = returnRateChange; }
    public void setAvgDaysBorrowed(int avgDaysBorrowed) { this.avgDaysBorrowed = avgDaysBorrowed; }
    public void setAvgDaysBorrowedChange(double avgDaysBorrowedChange) { this.avgDaysBorrowedChange = avgDaysBorrowedChange; }
} 