import React, { useState } from 'react';
import { createReview } from '../utils/api';

export default function AddReviewModal({ companyId, onClose, onAdded }) {
  const [form, setForm] = useState({
    fullName: '', subject: '', reviewText: '', rating: 0
  });
  const [hovered, setHovered] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.fullName || !form.subject || !form.reviewText || !form.rating) {
      setError('All fields including rating are required.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await createReview({ ...form, company: companyId });
      onAdded(res.data?.data || res.data);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit review.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <button className="modal-close" onClick={onClose}>✕</button>
        <h2>Add Review</h2>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>Full Name *</label>
              <input
                className="form-control"
                name="fullName"
                value={form.fullName}
                onChange={handleChange}
                placeholder="John Doe"
              />
            </div>
            <div className="form-group">
              <label>Subject *</label>
              <input
                className="form-control"
                name="subject"
                value={form.subject}
                onChange={handleChange}
                placeholder="Great experience!"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Review *</label>
            <textarea
              className="form-control"
              name="reviewText"
              value={form.reviewText}
              onChange={handleChange}
              placeholder="Share your detailed experience..."
              rows={4}
            />
          </div>

          <div className="form-group">
            <label>Rating *</label>
            <div style={{ display: 'flex', gap: 6, marginTop: 4 }}>
              {[1, 2, 3, 4, 5].map((i) => (
                <span
                  key={i}
                  onClick={() => setForm({ ...form, rating: i })}
                  onMouseEnter={() => setHovered(i)}
                  onMouseLeave={() => setHovered(0)}
                  style={{
                    fontSize: 32,
                    cursor: 'pointer',
                    color: i <= (hovered || form.rating) ? '#f59e0b' : '#ddd',
                    transition: 'color 0.15s'
                  }}
                >
                  ★
                </span>
              ))}
            </div>
          </div>

          <button
            className="btn-primary"
            type="submit"
            disabled={loading}
            style={{ width: '100%', padding: '12px', marginTop: 8 }}
          >
            {loading ? 'Submitting...' : 'Submit Review'}
          </button>
        </form>
      </div>
    </div>
  );
}