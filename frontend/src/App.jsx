import React from 'react';
import { AuthProvider } from './context/AuthContext.jsx';

// Components
import NavBar from './components/NavBar/NavBar.jsx';
import Hero from './components/Hero/Hero.jsx';
import AuthCallback from './pages/AuthCallback.jsx';

function App() {
  // Check if we're on the auth callback page
  const currentPath = window.location.pathname;

  if (currentPath === '/auth/callback') {
    return (
      <AuthProvider>
        <AuthCallback />
      </AuthProvider>
    );
  }

  return (
    <AuthProvider>
      <div style={{ userSelect: 'none' }}>
        <NavBar />
        <Hero />
      </div>
    </AuthProvider>
  );
}

export default App;