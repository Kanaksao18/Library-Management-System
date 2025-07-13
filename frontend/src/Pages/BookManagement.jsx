import React, { useEffect, useState } from "react";
import axios from "axios";
import { AddBookModal } from "../components/AddBookModal";
import { EditBookModal } from "../components/EditBookModal";
import WaitlistModal from "../components/WaitlistModal";
import JoinWaitlistModal from "../components/JoinWaitlistModal";

const API_BASE = "/api/books";

export default function BookManagement() {
  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All Categories");
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [waitlistModalOpen, setWaitlistModalOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [joinWaitlistModalOpen, setJoinWaitlistModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [bookToEdit, setBookToEdit] = useState(null);

  // Fetch books
  useEffect(() => {
    fetchBooks();
  }, [search, category]);

  async function fetchBooks() {
    setLoading(true);
    try {
      const params = {};
      if (search) params.search = search;
      if (category && category !== "All Categories") params.category = category;
      const res = await axios.get(API_BASE, { params });
      setBooks(Array.isArray(res.data) ? res.data : []);
      
      // Extract unique categories from books
      const uniqueCategories = Array.from(new Set(
        res.data
          .map(b => b.category)
          .filter(Boolean)
          .sort()
      ));
      setCategories(["All Categories", ...uniqueCategories]);
    } catch (error) {
      console.error("Failed to fetch books:", error);
      setBooks([]);
    } finally {
      setLoading(false);
    }
  }

  // Add/Edit/Delete handlers
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this book?")) return;
    
    try {
      await axios.delete(`${API_BASE}/${id}`);
      setBooks(books.filter(b => b.id !== id));
    } catch (error) {
      console.error("Failed to delete book:", error);
      alert("Failed to delete book. Please try again.");
    }
  };

  const handleBookAdded = (newBook) => {
    setBooks(prev => [...prev, newBook]);
  };

  const handleBookEdited = (editedBook) => {
    setBooks(prev => prev.map(b => b.id === editedBook.id ? editedBook : b));
  };

  const handleEdit = (book) => {
    setBookToEdit(book);
    setEditModalOpen(true);
  };

  const clearFilters = () => {
    setSearch("");
    setCategory("All Categories");
  };

  return (
    <div style={{ background: "#fdf6e3", minHeight: "100vh", padding: "24px 32px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
        <h1 style={{ fontWeight: 700, fontSize: 36, color: "#1a223f", margin: 0 }}>Book Management</h1>
        <button 
          onClick={() => setModalOpen(true)}
          style={{
            background: "#059669",
            color: "#fff",
            border: "none",
            borderRadius: 8,
            padding: "10px 24px",
            fontWeight: 600,
            fontSize: 16,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 8
          }}
        >
          <span style={{ fontSize: 18 }}>➕</span> Add New Book
        </button>
      </div>

      {/* Search and Filter Section */}
      <div style={{ 
        background: "#fff", 
        borderRadius: 16, 
        padding: "24px", 
        marginBottom: "32px",
        boxShadow: "0 2px 8px #0001"
      }}>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <input
            type="text"
            placeholder="Search books by title, author, or ISBN..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ 
              flex: 1, 
              minWidth: 250,
              padding: 12, 
              borderRadius: 8, 
              border: "1px solid #ddd", 
              fontSize: 16 
            }}
          />
          <select
            value={category}
            onChange={e => setCategory(e.target.value)}
            style={{ 
              padding: 12, 
              borderRadius: 8, 
              border: "1px solid #ddd", 
              fontSize: 16,
              minWidth: 150
            }}
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          <button 
            onClick={clearFilters}
            style={{
              background: "#fff",
              border: "1px solid #666",
              color: "#666",
              borderRadius: 8,
              padding: "10px 18px",
              fontWeight: 600,
              fontSize: 16,
              cursor: "pointer"
            }}>
            Clear Filters
          </button>
        </div>
        
        {/* Active Filters Display */}
        {(search || (category && category !== "All Categories")) && (
          <div style={{ marginTop: 16, display: "flex", gap: 8, flexWrap: "wrap" }}>
            {search && (
              <span style={{
                background: "#e5f3ff",
                color: "#0066cc",
                padding: "4px 12px",
                borderRadius: 16,
                fontSize: 14,
                fontWeight: 500
              }}>
                Search: "{search}"
              </span>
            )}
            {category && category !== "All Categories" && (
              <span style={{
                background: "#e5f3ff",
                color: "#0066cc",
                padding: "4px 12px",
                borderRadius: 16,
                fontSize: 14,
                fontWeight: 500
              }}>
                Category: {category}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Loading State */}
      {loading ? (
        <div style={{ 
          display: "flex", 
          justifyContent: "center", 
          alignItems: "center", 
          padding: "60px 0",
          background: "#fff",
          borderRadius: 16,
          boxShadow: "0 2px 8px #0001"
        }}>
          <div style={{ fontSize: 18, color: "#666" }}>Loading books...</div>
        </div>
      ) : (
        <>
          {/* Results Count */}
          <div style={{ marginBottom: "24px", color: "#666", fontSize: 16 }}>
            {books.length} book{books.length !== 1 ? 's' : ''} found
          </div>

          {/* Books Grid */}
          {books.length > 0 ? (
            <div style={{ 
              display: "grid", 
              gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))", 
              gap: "24px" 
            }}>
              {books.map(book => (
                <div key={book.id} style={{
                  background: "#fff",
                  borderRadius: 16,
                  padding: "24px",
                  boxShadow: "0 2px 8px #0001",
                  position: "relative",
                  transition: "transform 0.2s, box-shadow 0.2s",
                  cursor: "pointer"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow = "0 4px 16px #0002";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 2px 8px #0001";
                }}>
                  
                  {/* Status Badge */}
                  <span style={{
                    position: "absolute",
                    top: 18,
                    right: 18,
                    background: book.status === "AVAILABLE" ? "#d1fae5" : "#fee2e2",
                    color: book.status === "AVAILABLE" ? "#16a34a" : "#dc2626",
                    borderRadius: 12,
                    padding: "4px 12px",
                    fontWeight: 600,
                    fontSize: 12
                  }}>
                    {book.status === "AVAILABLE" ? "Available" : "Borrowed"}
                  </span>

                  {/* Book Icon */}
                  <div style={{ fontSize: 32, color: "#ea580c", marginBottom: 12 }}>📖</div>
                  
                  {/* Book Title */}
                  <div style={{ 
                    fontWeight: 700, 
                    fontSize: 20, 
                    marginBottom: 8,
                    color: "#1a223f",
                    lineHeight: 1.3
                  }}>
                    {book.title}
                  </div>
                  
                  {/* Author */}
                  <div style={{ 
                    color: "#666", 
                    marginBottom: 12,
                    fontSize: 16
                  }}>
                    by {book.author}
                  </div>

                  {/* Book Details */}
                  <div style={{ marginBottom: 16 }}>
                    {book.isbn && (
                      <div style={{ marginBottom: 4, fontSize: 14, color: "#888" }}>
                        <strong>ISBN:</strong> {book.isbn}
                      </div>
                    )}
                    {book.category && (
                      <div style={{ marginBottom: 4, fontSize: 14, color: "#888" }}>
                        <strong>Category:</strong> {book.category}
                      </div>
                    )}
                    {book.slot && (
                      <div style={{ marginBottom: 4, fontSize: 14, color: "#888" }}>
                        <strong>Location:</strong> {book.slot}
                      </div>
                    )}
                    {book.ebookUrl && (
                      <div style={{ marginBottom: 4, fontSize: 14 }}>
                        <strong>E-book:</strong>{" "}
                        <a 
                          href={book.ebookUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          style={{ color: "#059669", textDecoration: "none" }}
                        >
                          View Online
                        </a>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div style={{ 
                    display: "flex", 
                    gap: 8, 
                    flexWrap: "wrap",
                    marginTop: 16
                  }}>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedBook(book);
                        setWaitlistModalOpen(true);
                      }}
                      style={{
                        background: "#fff",
                        border: "1px solid #f59e0b",
                        color: "#f59e0b",
                        borderRadius: 6,
                        padding: "6px 12px",
                        fontWeight: 600,
                        fontSize: 13,
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: 4
                      }}>
                      <span>👥</span> Waitlist
                    </button>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedBook(book);
                        setJoinWaitlistModalOpen(true);
                      }}
                      style={{
                        background: "#fff",
                        border: "1px solid #059669",
                        color: "#059669",
                        borderRadius: 6,
                        padding: "6px 12px",
                        fontWeight: 600,
                        fontSize: 13,
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: 4
                      }}>
                      <span>➕</span> Join
                    </button>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEdit(book);
                      }}
                      style={{
                        background: "#fff",
                        border: "1px solid #3b82f6",
                        color: "#3b82f6",
                        borderRadius: 6,
                        padding: "6px 12px",
                        fontWeight: 600,
                        fontSize: 13,
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: 4
                      }}>
                      <span>✏️</span> Edit
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(book.id);
                      }}
                      style={{
                        background: "#fff",
                        border: "1px solid #dc2626",
                        color: "#dc2626",
                        borderRadius: 6,
                        padding: "6px 12px",
                        fontWeight: 600,
                        fontSize: 13,
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: 4
                      }}>
                      <span>🗑️</span> Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Empty State */
            <div style={{ 
              background: "#fff", 
              borderRadius: 16, 
              padding: "60px 24px",
              textAlign: "center",
              boxShadow: "0 2px 8px #0001"
            }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>📚</div>
              <div style={{ fontSize: 20, fontWeight: 600, color: "#1a223f", marginBottom: 8 }}>
                No books found
              </div>
              <div style={{ color: "#666", marginBottom: 24 }}>
                {search || (category && category !== "All Categories") 
                  ? "Try adjusting your search or filter criteria."
                  : "Get started by adding your first book to the library."
                }
              </div>
              {!search && category === "All Categories" && (
                <button 
                  onClick={() => setModalOpen(true)}
                  style={{
                    background: "#059669",
                    color: "#fff",
                    border: "none",
                    borderRadius: 8,
                    padding: "12px 24px",
                    fontWeight: 600,
                    fontSize: 16,
                    cursor: "pointer"
                  }}
                >
                  Add Your First Book
                </button>
              )}
            </div>
          )}
        </>
      )}

      {/* Modals */}
      <AddBookModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onBookAdded={handleBookAdded}
      />
      
      <EditBookModal
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        book={bookToEdit}
        onBookEdited={handleBookEdited}
      />
      
      <WaitlistModal
        open={waitlistModalOpen}
        onClose={() => setWaitlistModalOpen(false)}
        bookId={selectedBook?.id}
        bookTitle={selectedBook?.title}
      />
      
      <JoinWaitlistModal
        open={joinWaitlistModalOpen}
        onClose={() => setJoinWaitlistModalOpen(false)}
        bookId={selectedBook?.id}
        bookTitle={selectedBook?.title}
        onSuccess={() => {
          console.log('Successfully joined waitlist');
        }}
      />
    </div>
  );
}
