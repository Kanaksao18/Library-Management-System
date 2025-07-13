import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE = '/api/books';

export function AddBookModal({ open, onClose, onBookAdded }) {
    const [book, setBook] = useState({
        title: '',
        author: '',
        status: 'AVAILABLE',
        ebookUrl: '',
        slot: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (open) {
            setBook({
                title: '',
                author: '',
                status: 'AVAILABLE',
                ebookUrl: '',
                slot: ''
            });
            setError('');
        }
    }, [open]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setBook(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await axios.post(API_BASE, book);
            onBookAdded(response.data);
            onClose();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to add book');
        } finally {
            setLoading(false);
        }
    };

    if (!open) return null;

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
        }}>
            <div style={{
                background: '#fff',
                borderRadius: 12,
                padding: 32,
                minWidth: 400,
                maxWidth: 500,
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)'
            }}>
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: 24
                }}>
                    <h2 style={{ margin: 0, fontSize: 24, fontWeight: 600 }}>Add New Book</h2>
                    <button
                        onClick={onClose}
                        style={{
                            background: 'none',
                            border: 'none',
                            fontSize: 24,
                            cursor: 'pointer',
                            color: '#666'
                        }}
                    >
                        ×
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>
                                Title *
                            </label>
                            <input
                                type="text"
                                name="title"
                                value={book.title}
                                onChange={handleChange}
                                required
                                style={{
                                    width: '100%',
                                    padding: 12,
                                    borderRadius: 8,
                                    border: '1px solid #ddd',
                                    fontSize: 16
                                }}
                                placeholder="Enter book title"
                            />
                        </div>

                        <div>
                            <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>
                                Author *
                            </label>
                            <input
                                type="text"
                                name="author"
                                value={book.author}
                                onChange={handleChange}
                                required
                                style={{
                                    width: '100%',
                                    padding: 12,
                                    borderRadius: 8,
                                    border: '1px solid #ddd',
                                    fontSize: 16
                                }}
                                placeholder="Enter author name"
                            />
                        </div>

                        <div>
                            <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>
                                Status
                            </label>
                            <select
                                name="status"
                                value={book.status}
                                onChange={handleChange}
                                style={{
                                    width: '100%',
                                    padding: 12,
                                    borderRadius: 8,
                                    border: '1px solid #ddd',
                                    fontSize: 16
                                }}
                            >
                                <option value="AVAILABLE">Available</option>
                                <option value="BORROWED">Borrowed</option>
                            </select>
                        </div>

                        <div>
                            <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>
                                E-book URL (Optional)
                            </label>
                            <input
                                type="url"
                                name="ebookUrl"
                                value={book.ebookUrl}
                                onChange={handleChange}
                                style={{
                                    width: '100%',
                                    padding: 12,
                                    borderRadius: 8,
                                    border: '1px solid #ddd',
                                    fontSize: 16
                                }}
                                placeholder="https://example.com/ebook"
                            />
                        </div>

                        <div>
                            <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>
                                Slot (Optional)
                            </label>
                            <input
                                type="text"
                                name="slot"
                                value={book.slot}
                                onChange={handleChange}
                                style={{
                                    width: '100%',
                                    padding: 12,
                                    borderRadius: 8,
                                    border: '1px solid #ddd',
                                    fontSize: 16
                                }}
                                placeholder="Physical location or slot info"
                            />
                        </div>

                        {error && (
                            <div style={{
                                padding: 12,
                                borderRadius: 8,
                                background: '#fee2e2',
                                color: '#dc2626',
                                fontSize: 14
                            }}>
                                {error}
                            </div>
                        )}

                        <div style={{
                            display: 'flex',
                            gap: 12,
                            marginTop: 8
                        }}>
                            <button
                                type="submit"
                                disabled={loading}
                                style={{
                                    flex: 1,
                                    background: '#059669',
                                    color: '#fff',
                                    border: 'none',
                                    borderRadius: 8,
                                    padding: '12px 24px',
                                    fontWeight: 600,
                                    fontSize: 16,
                                    cursor: loading ? 'not-allowed' : 'pointer',
                                    opacity: loading ? 0.7 : 1
                                }}
                            >
                                {loading ? 'Adding...' : 'Add Book'}
                            </button>
                            <button
                                type="button"
                                onClick={onClose}
                                style={{
                                    flex: 1,
                                    background: '#fff',
                                    border: '1px solid #ddd',
                                    borderRadius: 8,
                                    padding: '12px 24px',
                                    fontWeight: 600,
                                    fontSize: 16,
                                    cursor: 'pointer'
                                }}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
} 