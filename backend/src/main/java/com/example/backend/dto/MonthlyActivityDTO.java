package com.example.backend.dto;

import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class MonthlyActivityDTO {
    private String month;
    private int issued;
    private int returned;

    public void setMonth(String month) { this.month = month; }
    public void setIssued(int issued) { this.issued = issued; }
    public void setReturned(int returned) { this.returned = returned; }
} 