import { useState } from 'react';
import { createLink, getVerificationStatus } from '../api';
import './CommonStyles.css';

export default function LinkResult({ verificationId }) {
    const isDisabled = verificationId === null;
    const [link, setLink] = useState(null);
    const [status, setStatus] = useState(null);

    const handleCreateLink = async () => {
        if (isDisabled) return;
        try {
            const res = await createLink(verificationId);
            // API 응답에서 link와 status가 각각 res.data.link, res.data.status에 있다고 가정
            setLink(res.data.link);
            setStatus(res.data.status);
        } catch (error) {
            console.error('링크 생성 실패', error);
            alert('인증 링크 생성에 실패했습니다.');
        }
    };

    const handleCheckStatus = async () => {
        if (isDisabled) return;
        try {
            const res = await getVerificationStatus(verificationId);
            // 상태가 res.data.status에 있다고 가정
            setStatus(res.data.status);
            alert(`현재 상태: ${res.data.status}`);
        } catch (error) {
            console.error('상태 조회 실패', error);
            alert('인증 상태 조회에 실패했습니다.');
        }
    };

    return (
        <div className="container">
            <h3>인증 링크 생성</h3>
            <button onClick={handleCreateLink} disabled={isDisabled}>링크 생성</button>
            {link && (
                <div>
                    <p><a href={link} target="_blank" rel="noreferrer">{link}</a></p>
                    <p>상태: {status}</p>
                </div>
            )}
            {link && <button onClick={handleCheckStatus}>인증 상태 확인</button>}
        </div>
    );
}
