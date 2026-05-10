import React, { useState } from 'react';
import { createCompany } from '../utils/api';

export default function AddCompanyModal({ onClose, onAdded }) {
  const [form, setForm] = useState({ name: '', address: '', city: '', foundedOn: '' });
  const [logo, setLogo] = useState({ file: null, preview: '' });
  const [error, setError] = useState('');

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) setLogo({ file, preview: URL.createObjectURL(file) });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.address || !form.city || !form.foundedOn)
      return setError('All fields are required.');

    try {
      const formData = new FormData();
      Object.entries(form).forEach(([k, v]) => formData.append(k, v));
      formData.append('logoColor', '#1a1a2e');
      if (logo.file) formData.append('logo', logo.file);

      const res = await createCompany(formData);
      onAdded(res.data?.data || res.data);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add company.');
    }
  };

  const initials = form.name.charAt(0);

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div style={{
        background: '#fff', borderRadius: 16, width: '100%', maxWidth: 480,
        position: 'relative', overflow: 'hidden', boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
      }}>
        <div style={{ position: 'relative', height: 56 }}>
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
          <button onClick={onClose} style={{
            position: 'absolute', top: 12, right: 16, background: 'none', border: 'none',
            fontSize: 20, cursor: 'pointer', color: '#666', lineHeight: 1, zIndex: 1,
          }}>✕</button>
        </div>

        {/* Form */}
        <div style={{ padding: '0 28px 24px' }}>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: '#1a1a2e', marginBottom: 18, textAlign: 'center' }}>
            Add Company
          </h2>

          {error && <div className="alert alert-error">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Company name</label>
              <input className="form-control" name="name" value={form.name} onChange={handleChange} placeholder="Enter..." />
            </div>

            <div className="form-group">
              <label>Location</label>
              <div style={{ position: 'relative' }}>
                <input className="form-control" name="address" value={form.address} onChange={handleChange}
                  placeholder="Select Location" style={{ paddingRight: 36 }} />
              </div>
            </div>

            <div className="form-group">
              <label>Founded on</label>
              <input className="form-control" type="date" name="foundedOn" value={form.foundedOn} onChange={handleChange} />
            </div>

            <div className="form-group">
              <label>City</label>
              <input className="form-control" name="city" value={form.city} onChange={handleChange} placeholder="Enter city" />
            </div>

            <div className="form-group">
              <label>Company Logo</label>
              <input type="file" onChange={handleLogoChange} style={{ fontSize: 12, flex: 1 }} />
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