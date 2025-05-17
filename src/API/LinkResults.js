import { useState } from 'react';
import { createLink, getVerificationStatus } from '../api';
import './CommonStyles.css';

export default function LinkResult({ verificationId }) {
    const isDisabled = verificationId === null;
    const [link, setLink] = useState(null);
    const [status, setStatus] = useState(null);

    const handleCreateLink = async () => {
        const res = await createLink(verificationId);
        setLink(res.data.link);
        setStatus(res.data.status);
    };

    const handleCheckStatus = async () => {
        const res = await getVerificationStatus(verificationId);
        alert(`현재 상태: ${res.data.status}`);
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
