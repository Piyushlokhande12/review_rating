import React, { useState } from 'react';
import { createReview } from '../utils/api';

const RATING_LABELS = { 1: 'Poor', 2: 'Fair', 3: 'Good', 4: 'Satisfied', 5: 'Excellent' };

export default function AddReviewModal({ companyId, onClose, onAdded }) {
  const [form, setForm] = useState({ fullName: '', subject: '', reviewText: '', rating: 0 });
  const [hovered, setHovered] = useState(0);
  const [error, setError] = useState('');

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.fullName || !form.subject || !form.reviewText || !form.rating)
      return setError('All fields including rating are required.');

    try {
      const res = await createReview({ ...form, company: companyId });
      onAdded(res.data?.data || res.data);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit review.');
    }
  };

  const activeRating = hovered || form.rating;

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div style={{
        background: '#fff', borderRadius: 16, width: '100%', maxWidth: 480,
        position: 'relative', overflow: 'hidden', boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
      }}>

       
        <div style={{
          position: 'absolute', top: -50, left: -50, width: 150, height: 150,
          borderRadius: '50%', background: 'linear-gradient(135deg, #D100F3, #002BC5)',
          opacity: 0.9, pointerEvents: 'none', zIndex: 0,
        }} />
        <div style={{
          position: 'absolute', top: -34, left: 40, width: 80, height: 80,
          borderRadius: '50%', background: 'linear-gradient(135deg, #002BC5, #D100F3)',
          opacity: 0.5, pointerEvents: 'none', zIndex: 0,
        }} />

        {/* Close button */}
        <button onClick={onClose} style={{
          position: 'absolute', top: 14, right: 16, background: 'none', border: 'none',
          fontSize: 20, cursor: 'pointer', color: '#666', lineHeight: 1, zIndex: 1,
        }}>✕</button>

        {/* Form */}
        <div style={{ padding: '56px 28px 24px', position: 'relative', zIndex: 1 }}>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: '#1a1a2e', marginBottom: 18, textAlign: 'center' }}>
            Add Review
          </h2>

          {error && <div className="alert alert-error">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Full Name</label>
              <input className="form-control" name="fullName" value={form.fullName} onChange={handleChange} placeholder="Enter" />
            </div>

            <div className="form-group">
              <label>Subject</label>
              <input className="form-control" name="subject" value={form.subject} onChange={handleChange} placeholder="Enter" />
            </div>

            <div className="form-group">
              <label>Enter your Review</label>
              <textarea className="form-control" name="reviewText" value={form.reviewText}
                onChange={handleChange} placeholder="Description" rows={4} />
            </div>

            <div className="form-group">
              <label>Rating</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4 }}>
                {[1, 2, 3, 4, 5].map((i) => (
                  <span key={i}
                    onClick={() => setForm({ ...form, rating: i })}
                    onMouseEnter={() => setHovered(i)}
                    onMouseLeave={() => setHovered(0)}
                    style={{ fontSize: 32, cursor: 'pointer', color: i <= activeRating ? '#f59e0b' : '#ddd', transition: 'color 0.15s' }}
                  >★</span>
                ))}
                {activeRating > 0 && (
                  <span style={{ marginLeft: 8, fontSize: 14, color: '#555' }}>
                    {RATING_LABELS[activeRating]}
                  </span>
                )}
              </div>
            </div>

            <button className="btn-primary" type="submit"
              style={{ width: '100%', padding: '12px', marginTop: 8, borderRadius: 8 }}>
              Save
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}