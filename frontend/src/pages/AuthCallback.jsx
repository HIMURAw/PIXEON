import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';

const AuthCallback = () => {
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState(null);
  const { handleDiscordCallback } = useAuth();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        const error = urlParams.get('error');

        if (error) {
          setError('Discord authentication was cancelled or failed');
          setStatus('error');
          return;
        }

        if (!code) {
          setError('No authorization code received');
          setStatus('error');
          return;
        }

        setStatus('processing');
        
        const result = await handleDiscordCallback(code);
        
        if (result.success) {
          setStatus('success');
          // Redirect to home page after successful authentication
          setTimeout(() => {
            window.location.href = '/';
          }, 2000);
        } else {
          setError(result.error || 'Authentication failed');
          setStatus('error');
        }
      } catch (error) {
        console.error('Callback error:', error);
        setError('An unexpected error occurred');
        setStatus('error');
      }
    };

    handleCallback();
  }, [handleDiscordCallback]);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      backgroundColor: '#1a1a1a',
      color: 'white',
      fontFamily: 'Arial, sans-serif'
    }}>
      {status === 'loading' && (
        <>
          <div style={{
            width: '50px',
            height: '50px',
            border: '4px solid rgba(255, 255, 255, 0.3)',
            borderTop: '4px solid #3498db',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            marginBottom: '20px'
          }}></div>
          <h2>Discord ile giriş yapılıyor...</h2>
          <p>Lütfen bekleyin.</p>
        </>
      )}

      {status === 'processing' && (
        <>
          <div style={{
            width: '50px',
            height: '50px',
            border: '4px solid rgba(255, 255, 255, 0.3)',
            borderTop: '4px solid #3498db',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            marginBottom: '20px'
          }}></div>
          <h2>Kimlik doğrulanıyor...</h2>
          <p>Discord bilgileriniz işleniyor.</p>
        </>
      )}

      {status === 'success' && (
        <>
          <div style={{
            width: '50px',
            height: '50px',
            backgroundColor: '#2ecc71',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '20px',
            fontSize: '24px'
          }}>
            ✓
          </div>
          <h2>Giriş başarılı!</h2>
          <p>Ana sayfaya yönlendiriliyorsunuz...</p>
        </>
      )}

      {status === 'error' && (
        <>
          <div style={{
            width: '50px',
            height: '50px',
            backgroundColor: '#e74c3c',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '20px',
            fontSize: '24px'
          }}>
            ✗
          </div>
          <h2>Giriş başarısız!</h2>
          <p>{error}</p>
          <button 
            onClick={() => window.location.href = '/'}
            style={{
              marginTop: '20px',
              padding: '10px 20px',
              backgroundColor: '#3498db',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '16px'
            }}
          >
            Ana Sayfaya Dön
          </button>
        </>
      )}

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default AuthCallback;