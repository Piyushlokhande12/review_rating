import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './app.css';
import CompanyListPage from '../pages/CompanyListPage';
import CompanyDetailPage from '../pages/CompanyDetailPage';

const App = () => {
 return (
    <Router>
      <Routes>
        <Route path="/" element={<CompanyListPage />} />
        <Route path="/company/:id" element={<CompanyDetailPage />} />
      </Routes>
    </Router>
  )
}

export default App
