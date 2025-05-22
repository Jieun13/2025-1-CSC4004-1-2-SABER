// App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import VerificationSettings from './API/VerificationSettings';
import LinkResult from './API/LinkResults';
import './API/CommonStyles.css';
import CategoryWithVerificationSelector from "./API/CategoryWithVerificationSelector";
import VerificationPage from './API/VerificationPage';
import StatusViewPage from "./API/StatusViewPage"; // 추가

function HomePage() {
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

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/saber" element={<VerificationPage />} />
                <Route path="/link/status" element={<StatusViewPage />} />
            </Routes>
        </Router>
    );
}

export default App;
