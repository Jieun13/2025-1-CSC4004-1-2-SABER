import { useState, useEffect } from 'react';
import axios from 'axios';
import { useSearchParams } from 'react-router-dom';

export default function VerificationPage() {
    const [searchParams] = useSearchParams();
    const [token, setToken] = useState('');
    const [session, setSession] = useState(null);
    const [verificationInfo, setVerificationInfo] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [agreed, setAgreed] = useState(false);

    function getVisitorKey() {
        let key = localStorage.getItem('visitorKey');
        if (!key) {
            key = crypto.randomUUID();
            localStorage.setItem('visitorKey', key);
        }
        return key;
    }

    const startVerification = async (tokenToUse) => {
        if (!tokenToUse) {
            setError('토큰이 없습니다');
            return;
        }
        setError('');
        setLoading(true);
        try {
            const visitorKey = getVisitorKey();
            const res = await axios.get(`http://localhost:8080/api/saber`, {
                params: {
                    token: tokenToUse,
                    visitorKey: visitorKey,
                },
                withCredentials: true,
            });
            setSession(res.data);
            setVerificationInfo(null);
            setAgreed(false);  // 새 세션 시작 시 동의 초기화
        } catch (e) {
            setError('인증 시작 실패');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const tokenFromUrl = searchParams.get('token');
        if (tokenFromUrl) {
            setToken(tokenFromUrl);
        }
    }, [searchParams]);

    const fetchVerificationInfo = async () => {
        if (!session) return;
        setError('');
        setLoading(true);
        try {
            const res = await axios.get(`http://localhost:8080/api/saber/link/${session.id}/info`, {
                withCredentials: true,
            });
            setVerificationInfo(res.data);
        } catch (e) {
            setError('인증 내용 조회 실패');
        } finally {
            setLoading(false);
        }
    };

    const submitAgreement = async () => {
        if (!session) return;
        setError('');
        setLoading(true);
        try {
            await axios.post(`http://localhost:8080/api/saber/link/${session.id}/agree`, null, {
                withCredentials: true,
            });
            alert('동의가 제출되었습니다.');
            setAgreed(true);  // 동의 제출 완료 상태 변경
        } catch (e) {
            setError('동의 제출 실패');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: 600, margin: 'auto', padding: 20 }}>
            <h2>판매자 인증 시작</h2>
            <button onClick={() => startVerification(token)} disabled={loading || !token}>
                인증 시작
            </button>
            {error && <p style={{ color: 'red' }}>{error}</p>}

            {session && (
                <>
                    <hr/>
                    <h3>인증 세션 정보</h3>
                    <p><b>ID:</b> {session.id}</p>
                    <p><b>제품명:</b> {session.productName}</p>
                    <p><b>상태:</b> {session.status}</p>
                    <p><b>만료 시간:</b> {new Date(session.expiresAt).toLocaleString()}</p>

                    <button onClick={submitAgreement} disabled={loading} style={{ marginLeft: 10 }}>
                        동의 제출
                    </button>
                    <div/>
                    <button
                        onClick={fetchVerificationInfo}
                        disabled={loading || !agreed}
                    >
                        인증 내용 보기
                    </button>

                    {verificationInfo && (
                        <div style={{ marginTop: 10 }}>
                            <h4>제품 설명</h4>
                            <p><b>추가 안내:</b> {verificationInfo.additionalText || '없음'}</p>
                            <p><b>요구사항:</b> {verificationInfo.requirementText || '없음'}</p>
                            <ul>
                                {verificationInfo.verifications.map((v, i) => (
                                    <li key={i}>
                                        <p><b>{i + 1}번째 인증</b></p>
                                        <p>방식 : {v.label}</p>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}