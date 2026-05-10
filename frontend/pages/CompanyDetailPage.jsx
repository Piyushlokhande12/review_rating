import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import AddReviewModal from '../components/AddReviewModal';
import { StarDisplay } from '../components/StarRating';
import { getCompany, getReviews } from '../utils/api';

export default function CompanyDetailPage() {
  const { id } = useParams();
  const [company, setCompany] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [showAddReview, setShowAddReview] = useState(false);

  const fetchData = async () => {
    try {
      const companyRes = await getCompany(id);
      const reviewsRes = await getReviews(id);
      setCompany(companyRes.data?.data);
      setReviews(reviewsRes.data?.data ?? []);
    } catch (err) {
      console.error('Fetch error:', err);
      setReviews([]);
    }
  };

  useEffect(() => { fetchData(); }, [id]);

  const getInitials = (name = '') =>
    name.split(' ').map((w) => w[0]).join('').substring(0, 2).toUpperCase();

  const getAvatarColor = (name = '') => {
    const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];
    let h = 0;
    for (let i = 0; i < name.length; i++) h = name.charCodeAt(i) + ((h << 5) - h);
    return colors[Math.abs(h) % colors.length];
  };

  const formatDate = (str) => {
    if (!str) return '';
    const d = new Date(str);
    if (isNaN(d)) return str;
    const day   = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year  = d.getFullYear();
    const hh    = String(d.getHours()).padStart(2, '0');
    const mm    = String(d.getMinutes()).padStart(2, '0');
    return `${day}-${month}-${year}, ${hh}:${mm}`;
  };

  if (!company) return null;

  return (
    <>
      <Navbar />
      <div className="page-container">

        {/* Company Header */}
        <div className="detail-header">
          {company.logo ? (
            <img
              src={company.logo}
              alt={company.name}
              className="company-logo"
              style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 10 }}
            />
          ) : (
            <div
              className="company-logo"
              style={{ background: company.logoColor }}
            >
              {company.logoInitials}
            </div>
          )}

          <div className="detail-header-info">
            <h1>{company.name}</h1>
            <div className="company-address" style={{ marginBottom: 10 }}>
              <span>📍</span> {company.address}, {company.city}
            </div>
            <div className="stars-row">
              <span className="rating-num" style={{ fontSize: 18 }}>
                {company.averageRating ? Number(company.averageRating).toFixed(1) : '0.0'}
              </span>
              <StarDisplay rating={company.averageRating || 0} size={20} />
              <span className="review-count">{company.totalReviews || 0} Reviews</span>
            </div>
          </div>

          <div className="detail-header-right">
            {company.foundedOn && (
              <span className="founded-text">Founded on {company.foundedOn}</span>
            )}
            <button className="btn-primary" onClick={() => setShowAddReview(true)}>
              + Add Review
            </button>
          </div>
        </div>

        {/* Reviews */}
        <div className="reviews-header">
          <h3>Result Found: {reviews.length}</h3>
        </div>

        {reviews.length === 0 ? (
          <div className="empty-state">
            <h3>No reviews yet</h3>
          </div>
        ) : (
          reviews.map((review) => (
            <div className="review-card" key={review._id}>
              <div className="review-card-header">

                {/* Avatar + name + date */}
                <div className="reviewer-info">
                  <div
                    className="reviewer-avatar"
                    style={{ background: getAvatarColor(review.fullName), color: '#fff' }}
                  >
                    {getInitials(review.fullName)}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    <div className="reviewer-name">{review.fullName}</div>
                    <div className="review-date">{formatDate(review.createdAt)}</div>
                  </div>
                </div>

                {/* Stars */}
                <StarDisplay rating={review.rating} size={18} />
              </div>

              <div className="review-text">{review.reviewText}</div>
            </div>
          ))
        )}
      </div>

      {showAddReview && (
        <AddReviewModal
          companyId={id}
          onClose={() => setShowAddReview(false)}
          onAdded={fetchData}
        />
      )}
    </>
  );
}