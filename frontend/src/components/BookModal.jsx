import React, { useState, useEffect } from "react";
import axios from "axios";

export default function BookModal({ open, onClose, onSave, initialBook }) {
  const [book, setBook] = useState(
    initialBook || {
      title: "",
      author: "",
      isbn: "",
      category: "",
      publishedYear: "",
      copiesAvailable: 1,
      status: "AVAILABLE",
    }
  );

  useEffect(() => {
    setBook(
      initialBook || {
        title: "",
        author: "",
        isbn: "",
        category: "",
        publishedYear: "",
        copiesAvailable: 1,
        status: "AVAILABLE",
      }
    );
  }, [initialBook, open]);

  if (!open) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBook((b) => ({ ...b, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onSave(book);
    onClose();
  };

  return (
    <div style={{
      position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh",
      background: "#0008", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000
    }}>
      <form onSubmit={handleSubmit} style={{
        background: "#fff", borderRadius: 12, padding: 32, minWidth: 340, boxShadow: "0 2px 16px #0003"
      }}>
        <h2>{initialBook ? "Edit Book" : "Add New Book"}</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <input name="title" value={book.title} onChange={handleChange} placeholder="Title" required />
          <input name="author" value={book.author} onChange={handleChange} placeholder="Author" required />
          <input name="isbn" value={book.isbn || ""} onChange={handleChange} placeholder="ISBN" />
          <input name="category" value={book.category || ""} onChange={handleChange} placeholder="Category" />
          <input name="publishedYear" value={book.publishedYear || ""} onChange={handleChange} placeholder="Published Year" />
          <input name="copiesAvailable" type="number" min={1} value={book.copiesAvailable} onChange={handleChange} placeholder="Copies Available" />
          <select name="status" value={book.status} onChange={handleChange}>
            <option value="AVAILABLE">Available</option>
            <option value="BORROWED">Borrowed</option>
          </select>
        </div>
        <div style={{ marginTop: 18, display: "flex", gap: 12 }}>
          <button type="submit" style={{ background: "#059669", color: "#fff", border: "none", borderRadius: 8, padding: "10px 24px", fontWeight: 600 }}>Save</button>
          <button type="button" onClick={onClose} style={{ background: "#fff", border: "1px solid #ddd", borderRadius: 8, padding: "10px 24px", fontWeight: 600 }}>Cancel</button>
        </div>
      </form>
    </div>
  );
}