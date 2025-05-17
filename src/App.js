import React, { useState, useEffect } from 'react';
import VerificationSettings from './API/VerificationSettings';
import LinkResult from './API/LinkResults';
import './API/CommonStyles.css';
import CategoryWithVerificationSelector from "./API/CategoryWithVerificationSelector";

function App() {
    const [message, setMessage] = useState('');
    const [verificationId, setVerificationId] = useState(null);

    useEffect(() => {
        fetch('http://localhost:8080/api/test')
            .then(response => response.text())
            .then(data => setMessage(data))
            .catch(error => console.error("Error fetching data: ", error));
    }, []);

    return (
        <div className="container">
            <h1>인증 링크 생성 시스템</h1>
            {message && <p className="api-message">API 상태 : {message}</p>}

            <section>
                <CategoryWithVerificationSelector onCategorySelected={setVerificationId} />
            </section>

            <section>
                <VerificationSettings verificationId={verificationId} />
            </section>

            <section>
                <LinkResult verificationId={verificationId} />
            </section>
        </div>
    );
}

export default App;
