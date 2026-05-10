import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaSearch } from "react-icons/fa";

export default function Navbar({ onSearch }) {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(query);
    } else {
      navigate(`/?search=${query}`);
    }
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-logo">
        <div><img src="/images/Frame 1.png" alt="logo" /></div>
        <div className="logo-text">
          Review<span>&RATE</span>
        </div>
      </Link>

      <div className="navbar-right">
        <form className="navbar-search" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search . . ."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button type="submit"><FaSearch /></button>
        </form>
        <button className="btn-nav">SignUp</button>
        <button className="btn-nav">Login</button>
      </div>
    </nav>
  );
}