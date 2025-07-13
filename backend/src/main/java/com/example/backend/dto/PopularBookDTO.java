package com.example.backend.dto;

import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class PopularBookDTO {
    private int rank;
    private String title;
    private String category;
    private int timesBorrowed;

    public void setRank(int rank) { this.rank = rank; }
    public void setTitle(String title) { this.title = title; }
    public void setCategory(String category) { this.category = category; }
    public void setTimesBorrowed(int timesBorrowed) { this.timesBorrowed = timesBorrowed; }
} 