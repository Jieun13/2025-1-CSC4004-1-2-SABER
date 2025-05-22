import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8080/api',
    withCredentials: true, // 쿠키 자동 전송 설정 (토큰 인증 위해 필수)
});

// 카테고리 목록 조회 (GET /api/categories)
export const fetchCategories = () => api.get('/categories');

// 기본 인증 옵션 조회 (GET /api/categories/{categoryId})
export const fetchDefaultVerifications = (categoryId) => api.get(`/categories/${categoryId}`);

// 카테고리 선택 (POST /api/settings/category)
export const setCategory = (categoryId) =>
    api.post('/settings/category', { categoryId });

// 상세 인증 옵션 설정 (POST /api/link/{verificationId}/settings)
export const setVerificationOptions = (verificationId, data) =>
    api.post(`/link/${verificationId}/settings`, data);

// 인증 링크 생성 (POST /api/link/{verificationId}/link)
export const createLink = (verificationId) =>
    api.post(`/link/${verificationId}/link`);

// 인증 상태 조회 (GET /api/link/{verificationId})
export const getVerificationStatus = (verificationId) =>
    api.get(`/link/${verificationId}`);
