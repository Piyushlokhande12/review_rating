import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import AddCompanyModal from '../components/AddCompanyModal';
import { StarDisplay } from '../components/StarRating';
import { getCompanies } from '../utils/api';

export default function CompanyListPage() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [city, setCity] = useState('');
  const [sort, setSort] = useState('name');
  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  const fetchCompanies = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (city) params.city = city;
      if (sort) params.sort = sort;
      if (search) params.search = search;
      const res = await getCompanies(params);
      setCompanies(res.data?.data || []);
    } catch (err) {
      console.error('Fetch companies error:', err);
      setCompanies([]);
    } finally {
      setLoading(false);
    }
  }, [city, sort, search]);

  useEffect(() => { fetchCompanies(); }, [fetchCompanies]);

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    if (isNaN(d)) return dateStr;
    return d.toLocaleDateString('en-GB').replace(/\//g, '-');
  };

  return (
    <>
      <Navbar onSearch={(q) => setSearch(q)} />
      <div className="page-container">

        {/* Filter Bar */}
        <div className="filter-bar">
          <div className="filter-group" style={{ flex: 1 }}>
            <label>Select City</label>
            <div className="city-input-wrap">
              <span className="pin-icon">📍</span>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Indore, Madhya Pradesh, India"
              />
            </div>
          </div>

          <button className="btn-primary" onClick={fetchCompanies}>
            Find Company
          </button>

          <button
            className="btn-primary"
            onClick={() => setShowAddModal(true)}
          >
            + Add Company
          </button>

          <div className="sort-wrap">
            <label>Sort:</label>
            <select
              className="sort-select"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
            >
              <option value="name">Name</option>
              <option value="rating">Rating</option>
              <option value="reviews">Reviews</option>
            </select>
          </div>
        </div>

        <div className="result-count">Result Found: {companies.length}</div>

        {loading ? (
          <div className="spinner">Loading companies...</div>
        ) : companies.length === 0 ? (
          <div className="empty-state">
            <h3>No companies found</h3>
            <p>Try adjusting your search or add a new company.</p>
          </div>
        ) : (
          companies.map((company) => (
            <div className="company-card" key={company._id}>

              {/* Logo */}
              {company.logo
                ? <img
                    src={company.logo}
                    alt={company.name}
                    className="company-logo"
                    style={{ objectFit: 'cover' }}
                  />
                : <div
                    className="company-logo"
                    style={{ background: company.logoColor || '#1a1a2e' }}
                  >
                    {company.logoInitials || company.name.substring(0, 2).toUpperCase()}
                  </div>
              }

              <div className="company-info">
                <div className="company-name">{company.name}</div>
                <div className="company-address">
                  <span>📍</span> {company.address}, {company.city}
                </div>
                <div className="stars-row">
                  <span className="rating-num">
                    {company.averageRating ? Number(company.averageRating).toFixed(1) : '0.0'}
                  </span>
                  <StarDisplay rating={company.averageRating || 0} />
                  <span className="review-count">{company.totalReviews || 0} Reviews</span>
                </div>
              </div>

              <div className="company-card-right">
                <span className="founded-text">
                  {company.foundedOn
                    ? `Founded on ${formatDate(company.foundedOn)}`
                    : `Reg. Date ${formatDate(company.createdAt)}`}
                </span>
                <Link to={`/company/${company._id}`}>
                  <button className='btnt'>Detail Review</button>
                </Link>
              </div>
            </div>
          ))
        )}
      </div>

      {showAddModal && (
        <AddCompanyModal
          onClose={() => setShowAddModal(false)}
          onAdded={(newCompany) => setCompanies((prev) => [newCompany, ...prev])}
        />
      )}
    </>
  );
}