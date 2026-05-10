import axios from 'axios';

const API = axios.create({ 
  baseURL: import.meta.env.VITE_API_URL 
});

export const getCompanies = (params) => API.get('/companies', { params });
export const getCompany = (id) => API.get(`/companies/${id}`);
export const createCompany = (formData) => API.post('/companies', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
});

export const getReviews = (companyId, params) =>
  API.get(`/reviews/company/${companyId}`, { params });
export const createReview = (data) => API.post('/reviews', data);

export default API;