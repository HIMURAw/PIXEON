import React, { useEffect, useState } from 'react';

const AuthCallback = () => {
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState(null);

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
        
        console.log('🔄 Sending code to backend:', code);
        
        // Backend'den kullanıcı bilgilerini al
        const response = await fetch('http://localhost:8080/api/auth/discord/callback', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ code })
        });

        console.log('📡 Backend response status:', response.status);
        const data = await response.json();
        console.log('📡 Backend response data:', data);
        
        if (data.success) {
          // Kullanıcı bilgilerini cookie'ye kaydet
          const userData = {
            id: data.user.id,
            discord_id: data.user.discord_id,
            username: data.user.username,
            display_name: data.user.display_name,
            avatar: data.user.avatar,
            email: data.user.email,
            discriminator: data.user.discriminator
          };
          
          // Cookie'ye kaydet
          const expiresAt = new Date();
          expiresAt.setTime(expiresAt.getTime() + (7 * 24 * 60 * 60 * 1000)); // 7 days
          
          const tokenData = {
            ...userData,
            expiresAt: expiresAt.toISOString()
          };
          
          const encryptedToken = btoa(JSON.stringify(tokenData));
          document.cookie = `auth_token=${encryptedToken};expires=${expiresAt.toUTCString()};path=/;samesite=strict`;
          
          setStatus('success');
          // Redirect to home page after successful authentication
          setTimeout(() => {
            window.location.href = '/';
          }, 2000);
        } else {
          setError(data.message || 'Authentication failed');
          setStatus('error');
        }
      } catch (error) {
        console.error('Callback error:', error);
        setError('An unexpected error occurred');
        setStatus('error');
      }
    };

    handleCallback();
  }, []);

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