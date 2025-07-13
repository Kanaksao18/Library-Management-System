package com.example.backend.controllers;

import com.example.backend.model.Book;
import com.example.backend.repository.BookRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/books")
public class BookController {
    @Autowired
    private BookRepository bookRepository;

    @GetMapping
    public List<Book> getBooks(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String category
    ) {
        return bookRepository.findAll().stream()
                .filter(b -> search == null || search.trim().isEmpty() ||
                        b.getTitle().toLowerCase().contains(search.toLowerCase()) ||
                        b.getAuthor().toLowerCase().contains(search.toLowerCase()) ||
                        (b.getIsbn() != null && b.getIsbn().toLowerCase().contains(search.toLowerCase())) ||
                        (b.getEbookUrl() != null && b.getEbookUrl().toLowerCase().contains(search.toLowerCase())))
                .filter(b -> category == null || category.equals("All Categories") || 
                        (b.getCategory() != null && b.getCategory().equalsIgnoreCase(category)))
                .collect(Collectors.toList());
    }

    @PostMapping
    public ResponseEntity<?> addBook(@RequestBody Book book) {
        try {
            book.setId(null);
            if (book.getStatus() == null) book.setStatus(Book.Status.AVAILABLE);
            Book savedBook = bookRepository.save(book);
            return ResponseEntity.ok(savedBook);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(Map.of("message", "Failed to add book: " + e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Book> updateBook(@PathVariable Long id, @RequestBody Book book) {
        if (!bookRepository.existsById(id)) return ResponseEntity.notFound().build();
        book.setId(id);
        return ResponseEntity.ok(bookRepository.save(book));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBook(@PathVariable Long id) {
        if (!bookRepository.existsById(id)) return ResponseEntity.notFound().build();
        bookRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Book> getBook(@PathVariable Long id) {
        Optional<Book> book = bookRepository.findById(id);
        return book.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }
}
