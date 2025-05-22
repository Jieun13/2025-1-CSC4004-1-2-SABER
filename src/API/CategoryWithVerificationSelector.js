import { useEffect, useState } from 'react';
import axios from 'axios';
import { fetchCategories, fetchDefaultVerifications, setCategory } from '../api';
import './CommonStyles.css';

export default function CategoryWithVerificationSelector({ onCategorySelected }) {
    const [categories, setCategories] = useState([]);
    const [selectedId, setSelectedId] = useState(null);
    const [verifications, setVerifications] = useState([]);
    const [loadingToken, setLoadingToken] = useState(true);

    // 1. 페이지 접속 시 buyerToken 발급
    useEffect(() => {
        async function issueBuyerToken() {
            try {
                await axios.post('http://localhost:8080/api/token', null, { withCredentials: true });
                setLoadingToken(false);
            } catch (error) {
                console.error('토큰 발급 실패', error);
                setLoadingToken(false);
            }
        }
        issueBuyerToken();
    }, []);

    useEffect(() => {
        if (!loadingToken) {
            fetchCategories().then(res => setCategories(res.data));
        }
    }, [loadingToken]);

    useEffect(() => {
        if (selectedId) {
            fetchDefaultVerifications(selectedId).then(res => setVerifications(res.data));
        } else {
            setVerifications([]);
        }
    }, [selectedId]);

    const handleSelect = async () => {
        if (!selectedId) return;

        try {
            const res = await setCategory(selectedId);
            const verificationId = res.data; // 인증 링크 ID 반환
            onCategorySelected(verificationId);
        } catch (error) {
            console.error('카테고리 설정 실패', error);
        }
    };

    if (loadingToken) {
        return <div>로딩 중...</div>;
    }

    return (
        <div className="container">
            <h2>카테고리 선택</h2>
            <select onChange={e => setSelectedId(e.target.value)} value={selectedId || ''}>
                <option value="" disabled>카테고리 선택</option>
                {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
            </select>
            <button onClick={handleSelect} disabled={!selectedId}>선택</button>

            {verifications.length > 0 && (
                <>
                    <h3>기본 인증 방식</h3>
                    <ul>
                        {verifications.map((v, idx) => (
                            <li key={idx}>{v.verificationContent}</li>
                        ))}
                    </ul>
                </>
            )}
        </div>
    );
}
