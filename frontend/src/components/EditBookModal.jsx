import React, { useState, useEffect } from "react";
import axios from "axios";

const API_BASE = "/api/books";

export function EditBookModal({ open, onClose, book, onBookEdited }) {
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    isbn: "",
    category: "",
    slot: "",
    ebookUrl: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (book) {
      setFormData({
        title: book.title || "",
        author: book.author || "",
        isbn: book.isbn || "",
        category: book.category || "",
        slot: book.slot || "",
        ebookUrl: book.ebookUrl || ""
      });
    }
  }, [book]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await axios.put(`${API_BASE}/${book.id}`, formData);
      onBookEdited(response.data);
      onClose();
    } catch (error) {
      console.error("Failed to update book:", error);
      setError(error.response?.data?.message || "Failed to update book. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (!open) return null;

  return (
    <div style={{
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: "rgba(0, 0, 0, 0.5)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 1000
    }}>
      <div style={{
        background: "#fff",
        borderRadius: 16,
        padding: "32px",
        width: "90%",
        maxWidth: 500,
        maxHeight: "90vh",
        overflow: "auto"
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
          <h2 style={{ fontWeight: 700, fontSize: 24, color: "#1a223f", margin: 0 }}>Edit Book</h2>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              fontSize: 24,
              cursor: "pointer",
              color: "#666"
            }}
          >
            ×
          </button>
        </div>

        {error && (
          <div style={{
            background: "#fee2e2",
            color: "#dc2626",
            padding: "12px",
            borderRadius: 8,
            marginBottom: "16px",
            fontSize: 14
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "16px" }}>
            <label style={{ display: "block", marginBottom: "6px", fontWeight: 600, color: "#1a223f" }}>
              Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: 8,
                border: "1px solid #ddd",
                fontSize: 16
              }}
            />
          </div>

          <div style={{ marginBottom: "16px" }}>
            <label style={{ display: "block", marginBottom: "6px", fontWeight: 600, color: "#1a223f" }}>
              Author *
            </label>
            <input
              type="text"
              name="author"
              value={formData.author}
              onChange={handleChange}
              required
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: 8,
                border: "1px solid #ddd",
                fontSize: 16
              }}
            />
          </div>

          <div style={{ marginBottom: "16px" }}>
            <label style={{ display: "block", marginBottom: "6px", fontWeight: 600, color: "#1a223f" }}>
              ISBN
            </label>
            <input
              type="text"
              name="isbn"
              value={formData.isbn}
              onChange={handleChange}
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: 8,
                border: "1px solid #ddd",
                fontSize: 16
              }}
            />
          </div>

          <div style={{ marginBottom: "16px" }}>
            <label style={{ display: "block", marginBottom: "6px", fontWeight: 600, color: "#1a223f" }}>
              Category
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: 8,
                border: "1px solid #ddd",
                fontSize: 16
              }}
            >
              <option value="">Select Category</option>
              <option value="Fiction">Fiction</option>
              <option value="Non-Fiction">Non-Fiction</option>
              <option value="Technology">Technology</option>
              <option value="Science">Science</option>
              <option value="History">History</option>
              <option value="Biography">Biography</option>
              <option value="Self-Help">Self-Help</option>
              <option value="Business">Business</option>
              <option value="Education">Education</option>
              <option value="Children">Children</option>
              <option value="Reference">Reference</option>
            </select>
          </div>

          <div style={{ marginBottom: "16px" }}>
            <label style={{ display: "block", marginBottom: "6px", fontWeight: 600, color: "#1a223f" }}>
              Location/Slot
            </label>
            <input
              type="text"
              name="slot"
              value={formData.slot}
              onChange={handleChange}
              placeholder="e.g., A1-B2, Shelf 3"
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: 8,
                border: "1px solid #ddd",
                fontSize: 16
              }}
            />
          </div>

          <div style={{ marginBottom: "24px" }}>
            <label style={{ display: "block", marginBottom: "6px", fontWeight: 600, color: "#1a223f" }}>
              E-book URL
            </label>
            <input
              type="url"
              name="ebookUrl"
              value={formData.ebookUrl}
              onChange={handleChange}
              placeholder="https://example.com/ebook"
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: 8,
                border: "1px solid #ddd",
                fontSize: 16
              }}
            />
          </div>

          <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end" }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                background: "#fff",
                border: "1px solid #ddd",
                color: "#666",
                borderRadius: 8,
                padding: "12px 24px",
                fontWeight: 600,
                fontSize: 16,
                cursor: "pointer"
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              style={{
                background: "#059669",
                color: "#fff",
                border: "none",
                borderRadius: 8,
                padding: "12px 24px",
                fontWeight: 600,
                fontSize: 16,
                cursor: loading ? "not-allowed" : "pointer",
                opacity: loading ? 0.7 : 1
              }}
            >
              {loading ? "Updating..." : "Update Book"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 