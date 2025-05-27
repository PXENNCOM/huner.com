import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Test = () => {
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    console.log('Token:', token ? 'Mevcut' : 'Yok');
    
    // Doğrudan tam URL ile test et
    const url = 'http://localhost:3001/api/employer/profile';
    console.log('Testing URL:', url);
    
    axios.get(url, {
      headers: {
        Authorization: token ? `Bearer ${token}` : ''
      }
    })
      .then(response => {
        console.log('Response:', response.data);
        setResult(response.data);
      })
      .catch(err => {
        console.error('Error:', err.response?.data || err.message);
        setError(err.response?.data?.message || err.message);
      });
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h2>API Test</h2>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      {result && <pre>{JSON.stringify(result, null, 2)}</pre>}
    </div>
  );
};

export default Test;