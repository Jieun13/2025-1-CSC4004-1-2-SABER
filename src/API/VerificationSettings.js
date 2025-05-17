import { useState } from 'react';
import { setVerificationOptions } from '../api';
import './CommonStyles.css';


export default function VerificationSettings({ verificationId }) {
    const isDisabled = verificationId === null;
    const [selectedTime, setSelectedTime] = useState('');
    const [selectedMethod, setSelectedMethod] = useState('');
    const [additionalRequirement, setAdditionalRequirement] = useState('');
    const [requirements, setRequirements] = useState([]);

    const handleTimeSelect = (time) => {
        setSelectedTime(time);
    };

    const handleMethodSelect = (method) => {
        setSelectedMethod(method);
    };

    const handleAdditionalRequirementChange = (e) => {
        setAdditionalRequirement(e.target.value);
    };

    const handleAddRequirement = () => {
        if (additionalRequirement.trim()) {
            setRequirements([...requirements, additionalRequirement.trim()]);
            setAdditionalRequirement('');
        }
    };

    const handleSubmit = async () => {
        const timeLimit = selectedTime === '기타' ? null : selectedTime.replace('분', '');
        await setVerificationOptions(verificationId, {
            timeLimit,
            method: selectedMethod,
            extraRequirements: requirements,
        });
        alert('상세 설정 완료');
    };

    return (
        <div className="container">
            <h3>인증 제한 시간 설정</h3>
            <div>
                {['3분', '5분', '7분', '10분', '기타'].map((time) => (
                    <button disabled={isDisabled}
                        key={time}
                        onClick={() => handleTimeSelect(time)}
                    >
                        {time} {selectedTime === time && '(선택됨)'}
                    </button>
                ))}
            </div>

            <h3>개별 인증 요구사항 추가</h3>
            <p>카테고리별 기본 인증사항을 제외한 추가 인증 요구사항을 입력하세요.</p>
            <input disabled={isDisabled}
                type="text"
                placeholder="예: 물품 전체 사진, 하자 부분 촬영"
                value={additionalRequirement}
                onChange={handleAdditionalRequirementChange}
            />
            <button onClick={handleAddRequirement} disabled={isDisabled}>+ 추가</button>

            <ul>
                {requirements.map((req, index) => (
                    <li key={index}>{req}</li>
                ))}
            </ul>

            <h3>인증 방식</h3>
            <div>
                {['사진 촬영', '동영상 촬영'].map((method) => (
                    <button disabled={isDisabled}
                        key={method}
                        onClick={() => handleMethodSelect(method)}
                    >
                        {method} {selectedMethod === method && '(선택됨)'}
                    </button>
                ))}
            </div>

            <ul>
                {selectedMethod === '사진 촬영' && (
                    <li>사진 촬영</li>
                )}
                {selectedMethod === '동영상 촬영' && (
                    <li>동영상 촬영</li>
                )}
            </ul>
        </div>
    );
}
