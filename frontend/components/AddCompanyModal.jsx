import React, { useState } from 'react';
import { createCompany } from '../utils/api';

const COLORS = [
  '#1a1a2e', '#3b82f6', '#10b981', '#f59e0b',
  '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6'
];

export default function AddCompanyModal({ onClose, onAdded }) {
  const [form, setForm] = useState({
    name: '', address: '', city: '', foundedOn: '', logoColor: '#1a1a2e'
  });
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      setError('Logo image must be under 2MB.');
      return;
    }
    setLogoFile(file);
    setLogoPreview(URL.createObjectURL(file));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.address || !form.city || !form.foundedOn) {
      setError('All fields are required.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const formData = new FormData();
      formData.append('name', form.name);
      formData.append('address', form.address);
      formData.append('city', form.city);
      formData.append('foundedOn', form.foundedOn);
      formData.append('logoColor', form.logoColor);
      if (logoFile) formData.append('logo', logoFile);

      const res = await createCompany(formData);
      onAdded(res.data?.data || res.data);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add company.');
    } finally {
      setLoading(false);
    }
  };

  const previewInitials = form.name
    ? form.name.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase()
    : '?';

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <button className="modal-close" onClick={onClose}>✕</button>
        <h2>Add Company</h2>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Company Name *</label>
            <input
              className="form-control"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="e.g. Graffersid Web and App Development"
            />
          </div>

          <div className="form-group">
            <label>Address *</label>
            <input
              className="form-control"
              name="address"
              value={form.address}
              onChange={handleChange}
              placeholder="816, Shekhar Central, Manorama Ganj..."
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>City *</label>
              <input
                className="form-control"
                name="city"
                value={form.city}
                onChange={handleChange}
                placeholder="Indore"
              />
            </div>
            <div className="form-group">
              <label>Founded On *</label>
              <input
                className="form-control"
                type="date"
                name="foundedOn"
                value={form.foundedOn}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Logo Upload */}
          <div className="form-group">
            <label>Company Logo (optional, max 2MB)</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 6 }}>
              <div
                style={{
                  width: 60, height: 60, borderRadius: 10, flexShrink: 0,
                  background: logoPreview ? 'transparent' : form.logoColor,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 700, fontSize: 18, color: '#fff',
                  overflow: 'hidden', border: '2px dashed #ddd'
                }}
              >
                {logoPreview
                  ? <img src={logoPreview} alt="preview"
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  : previewInitials
                }
              </div>

              <div style={{ flex: 1 }}>
                <input
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
                  onChange={handleLogoChange}
                  style={{ fontSize: 13 }}
                />
                <p style={{ fontSize: 11, color: '#aaa', marginTop: 4 }}>
                  JPG, PNG, WEBP or GIF — if no image, initials will be used
                </p>
              </div>
            </div>
          </div>

          {/* Color picker — only when no image */}
          {!logoPreview && (
            <div className="form-group">
              <label>Logo Background Color</label>
              <div className="color-options">
                {COLORS.map((c) => (
                  <div
                    key={c}
                    className={`color-dot ${form.logoColor === c ? 'selected' : ''}`}
                    style={{ background: c }}
                    onClick={() => setForm({ ...form, logoColor: c })}
                  />
                ))}
              </div>
            </div>
          )}

          <button
            className="btn-primary"
            type="submit"
            disabled={loading}
            style={{ width: '100%', padding: '12px', marginTop: 8 }}
          >
            {loading ? 'Adding...' : '+ Add Company'}
          </button>
        </form>
      </div>
    </div>
  );
}