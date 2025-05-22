import { useState } from 'react';
import axios from 'axios';

export default function StatusViewPage() {
    const [verificationLinkId, setVerificationLinkId] = useState('');
    const [statusInfo, setStatusInfo] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const fetchStatus = async () => {
        if (!verificationLinkId) {
            setError('인증 링크 ID를 입력하세요.');
            return;
        }

        setLoading(true);
        setError('');
        setStatusInfo(null);

        try {
            const res = await axios.get(`http://localhost:8080/api/link/${verificationLinkId}`, {
                withCredentials: true,  // 쿠키 전달
            });
            setStatusInfo(res.data);
        } catch (e) {
            if (e.response) {
                if (e.response.status === 401) {
                    setError('인증되지 않은 사용자입니다. 로그인 후 이용하세요.');
                } else if (e.response.status === 403) {
                    setError('해당 인증 링크에 접근 권한이 없습니다.');
                } else {
                    setError('알 수 없는 오류가 발생했습니다.');
                }
            } else {
                setError('서버와 연결할 수 없습니다.');
            }
        } finally {
            setLoading(false);
        }
    };

    const formatDateTime = (str) => {
        if (!str) return '';
        return new Date(str.replace(' ', 'T')).toLocaleString();
    };

    return (
        <div style={{ maxWidth: 600, margin: 'auto', padding: 20 }}>
            <h2>인증 진행 상태 조회</h2>

            <input
                type="text"
                placeholder="인증 링크 ID 입력"
                value={verificationLinkId}
                onChange={e => setVerificationLinkId(e.target.value)}
                style={{ padding: 8, width: '100%', marginBottom: 10 }}
            />

            <button onClick={fetchStatus} disabled={loading}>
                조회
            </button>

            {loading && <p>로딩 중...</p>}

            {error && <p style={{ color: 'red' }}>{error}</p>}

            {statusInfo && (
                <div className="container">
                    <h2>인증 상태 정보</h2>
                    <div>
                        <p><b>진행 상태:</b> {statusInfo.status}</p>
                        <p><b>상대방의 링크 최초 입장 시간:</b> {formatDateTime(statusInfo.startedAt) || "아직 상대방이 입장하지 않았습니다."} </p>
                    </div>
                </div>
            )}
        </div>
    );
}