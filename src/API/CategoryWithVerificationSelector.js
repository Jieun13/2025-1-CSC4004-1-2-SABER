import { useEffect, useState } from 'react';
import { fetchCategories, fetchDefaultVerifications, setCategory } from '../api';
import './CommonStyles.css';

export default function CategoryWithVerificationSelector({ onCategorySelected }) {
    const [categories, setCategories] = useState([]);
    const [selectedId, setSelectedId] = useState(null);
    const [verifications, setVerifications] = useState([]);

    useEffect(() => {
        fetchCategories().then(res => setCategories(res.data));
    }, []);

    useEffect(() => {
        if (selectedId) {
            fetchDefaultVerifications(selectedId).then(res => setVerifications(res.data));
        } else {
            setVerifications([]);
        }
    }, [selectedId]);

    const handleSelect = async () => {
        if (!selectedId) return;
        const res = await setCategory(selectedId);
        const verificationId = res.data; // 백엔드에서 인증 링크 ID를 반환한다고 가정
        onCategorySelected(verificationId);
    };

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