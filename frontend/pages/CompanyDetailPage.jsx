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
      setReviews(reviewsRes.data?.data);
    } catch (err) {
      console.error("Fetch error:", err);
      setReviews([]);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);


  const getInitials = (name) => {
    return name.charAt(0).toUpperCase();
  };

  const getAvatarColor = () => {
    return '#3b82f6';
  };

  if (!company) return null;

  return (
    <>
      <Navbar />
    <div className='con'>
      <div className="page-container">
        <div className="detail-header">
          {company.logo ? (
            <img
              src={company.logo}
              alt={company.name}
              className="company-logo"
              style={{
                width: 80,
                height: 80,
                objectFit: 'cover',
                borderRadius: 10
              }}
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
                {company.averageRating
                  ? Number(company.averageRating).toFixed(1)
                  : '0.0'}
              </span>

              <StarDisplay
                rating={company.averageRating || 0}
                size={20}
              />

              <span className="review-count">
                {company.totalReviews || 0} Reviews
              </span>
            </div>
          </div>

          <div className="detail-header-right">
            {company.foundedOn && (
              <span className="founded-text">
                Founded on {company.foundedOn}
              </span>
            )}

            <button
              className="btn-primary"
              onClick={() => setShowAddReview(true)}
            >
              + Add Review
            </button>
          </div>
        </div>

        {/* Reviews Section */}
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
                <div className="reviewer-info">
                  <div
                    className="reviewer-avatar"
                    style={{
                      background: getAvatarColor(),
                      color: '#fff'
                    }}
                  >
                    {getInitials(review.fullName)}
                  </div>

                  <div>
                    <div className="reviewer-name">
                      {review.fullName}
                    </div>

                    <div className="review-date">
                      {review.createdAt}
                    </div>
                  </div>
                </div>

                <StarDisplay
                  rating={review.rating}
                  size={18}
                />
              </div>

              <div className="review-text">
                {review.reviewText}
              </div>
            </div>
          ))
        )}
      </div>

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