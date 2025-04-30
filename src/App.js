import React, { useState, useEffect } from 'react';

function App() {
    const [message, setMessage] = useState('');

    useEffect(() => {
        // 스프링 부트 API 호출
        fetch('http://localhost:8080/api/test')
            .then(response => response.text())
            .then(data => setMessage(data))
            .catch(error => console.error("Error fetching data: ", error));
    }, []);

    return (
        <div>
            <h2>react - springboot 연동</h2>
            <h2>{message}</h2>
        </div>
    );
}

export default App;
