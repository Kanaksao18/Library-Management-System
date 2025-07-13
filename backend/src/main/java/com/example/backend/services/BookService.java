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
import java.util.Comparator;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class BookService {
    private final BookRepository bookRepository;
    private final UserRepository userRepository;
    private final WaitlistEntryRepository waitlistEntryRepository;

    public List<Book> getAllBooks() {
        return bookRepository.findAll();
    }

    public Book addBook(Book book) {
        book.setStatus(Book.Status.AVAILABLE);
        // ebookUrl and slot are set via request if present
        return bookRepository.save(book);
    }

    public Optional<Book> getBook(Long id) {
        return bookRepository.findById(id);
    }

    public Book borrowBook(Long bookId, Long userId, int priority) {
        Book book = bookRepository.findById(bookId).orElseThrow();
        User user = userRepository.findById(userId).orElseThrow();
        if (book.getStatus() == Book.Status.AVAILABLE) {
            book.setStatus(Book.Status.BORROWED);
            user.getBorrowedBookIds().add(book.getId());
            book.setSlot(java.time.LocalDateTime.now().toString());
            bookRepository.save(book);
            userRepository.save(user);
            return book;
        } else {
            // Add to waitlist (DSA: priority queue logic)
            WaitlistEntry entry = WaitlistEntry.builder()
                    .book(book)
                    .user(user)
                    .priority(priority)
                    .createdAt(java.time.LocalDateTime.now())
                    .build();
            waitlistEntryRepository.save(entry);
            book.getWaitlist().add(entry);
            book.getWaitlist().sort(Comparator.comparingInt(WaitlistEntry::getPriority).reversed()
                    .thenComparing(WaitlistEntry::getCreatedAt));
            bookRepository.save(book);
            return book;
        }
    }

    public Book returnBook(Long bookId, Long userId) {
        Book book = bookRepository.findById(bookId).orElseThrow();
        User user = userRepository.findById(userId).orElseThrow();
        user.getBorrowedBookIds().remove(book.getId());
        book.setSlot(null);
        // Serve next in waitlist
        if (!book.getWaitlist().isEmpty()) {
            WaitlistEntry next = book.getWaitlist().remove(0);
            User nextUser = next.getUser();
            nextUser.getBorrowedBookIds().add(book.getId());
            book.setSlot(java.time.LocalDateTime.now().toString());
            userRepository.save(nextUser);
            waitlistEntryRepository.delete(next);
        } else {
            book.setStatus(Book.Status.AVAILABLE);
        }
        bookRepository.save(book);
        userRepository.save(user);
        return book;
    }
}
