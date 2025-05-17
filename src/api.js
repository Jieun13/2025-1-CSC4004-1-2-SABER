import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8080/api', // 백엔드 주소에 맞게 수정
});

export const fetchCategories = () => api.get('/categories');
export const fetchDefaultVerifications = (categoryId) => api.get(`/categories/${categoryId}`);
export const setCategory = (categoryId) => api.post('/verification/settings/category', { categoryId });
export const setVerificationOptions = (verificationId, data) => api.post(`/verification/${verificationId}/settings`, data);
export const createLink = (verificationId) => api.post(`/verification/${verificationId}/link`);
export const getVerificationStatus = (verificationId) => api.get(`/verification/${verificationId}`);
