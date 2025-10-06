import React, { useState } from 'react';
import api from '../api/api';

const ApiTest = () => {
  const [testResult, setTestResult] = useState('');
  const [loading, setLoading] = useState(false);

  const testApiConnection = async () => {
    setLoading(true);
    setTestResult('Test en cours...');
    
    try {
      // Test 1: Connexion de base
      const response = await api.get('/');
      setTestResult(`✅ Connexion réussie: ${JSON.stringify(response.data)}`);
    } catch (error) {
      console.error('Erreur API:', error);
      setTestResult(`❌ Erreur: ${error.message}\nDétails: ${JSON.stringify(error.response?.data)}`);
    } finally {
      setLoading(false);
    }
  };

  const testLogin = async () => {
    setLoading(true);
    setTestResult('Test login en cours...');
    
    try {
      const response = await api.post('/login', {
        email: 'test@example.com',
        password: 'password'
      });
      setTestResult(`✅ Login test: ${JSON.stringify(response.data)}`);
    } catch (error) {
      console.error('Erreur Login:', error);
      setTestResult(`❌ Erreur Login: ${error.message}\nStatus: ${error.response?.status}\nData: ${JSON.stringify(error.response?.data)}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', margin: '20px' }}>
      <h3>Test API</h3>
      <button onClick={testApiConnection} disabled={loading}>
        Test Connexion API
      </button>
      <button onClick={testLogin} disabled={loading} style={{ marginLeft: '10px' }}>
        Test Login
      </button>
      <pre style={{ marginTop: '10px', background: '#f5f5f5', padding: '10px' }}>
        {testResult}
      </pre>
    </div>
  );
};

export default ApiTest;
