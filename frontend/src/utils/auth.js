// Authentication utility functions
export const authUtils = {
  // Cookie management
  setCookie: (name, value, days = 7) => {
    const expires = new Date();
    expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
    document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;secure;samesite=strict`;
  },

  getCookie: (name) => {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === ' ') c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
  },

  deleteCookie: (name) => {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  },

  // Token encryption/decryption (simple base64 encoding)
  encryptToken: (token) => {
    return btoa(JSON.stringify(token));
  },

  decryptToken: (encryptedToken) => {
    try {
      return JSON.parse(atob(encryptedToken));
    } catch (error) {
      console.error('Token decryption failed:', error);
      return null;
    }
  },

  // Discord OAuth URL generation
  getDiscordAuthUrl: async () => {
    try {
      const response = await fetch('http://localhost:8080/api/auth/discord/url');
      const data = await response.json();
      
      if (data.success) {
        return data.authUrl;
      } else {
        throw new Error('Failed to get Discord auth URL');
      }
    } catch (error) {
      console.error('Error getting Discord auth URL:', error);
      // Fallback URL
      const clientId = '1238268562171236384';
      const redirectUri = encodeURIComponent('http://localhost:8080/api/auth/discord/callback');
      const scope = encodeURIComponent('identify email');
      const responseType = 'code';
      
      return `https://discord.com/api/oauth2/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=${responseType}&scope=${scope}`;
    }
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    const token = authUtils.getCookie('auth_token');
    if (!token) return false;
    
    const userData = authUtils.decryptToken(token);
    if (!userData) return false;
    
    // Check if token is expired
    if (userData.expiresAt && new Date() > new Date(userData.expiresAt)) {
      authUtils.logout();
      return false;
    }
    
    return true;
  },

  // Get current user data
  getCurrentUser: () => {
    const token = authUtils.getCookie('auth_token');
    if (!token) return null;
    
    return authUtils.decryptToken(token);
  },

  // Login function
  login: (userData) => {
    const expiresAt = new Date();
    expiresAt.setTime(expiresAt.getTime() + (7 * 24 * 60 * 60 * 1000)); // 7 days
    
    const tokenData = {
      ...userData,
      expiresAt: expiresAt.toISOString()
    };
    
    const encryptedToken = authUtils.encryptToken(tokenData);
    authUtils.setCookie('auth_token', encryptedToken, 7);
  },

  // Logout function
  logout: () => {
    authUtils.deleteCookie('auth_token');
    // Redirect to home page
    window.location.href = '/';
  },

  // Handle Discord OAuth callback
  handleDiscordCallback: async (code) => {
    try {
      const response = await fetch('http://localhost:8080/api/auth/discord/callback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code })
      });

      const data = await response.json();
      
      if (data.success) {
        authUtils.login(data.user);
        return { success: true, user: data.user };
      } else {
        throw new Error(data.message || 'Authentication failed');
      }
    } catch (error) {
      console.error('Discord authentication error:', error);
      return { success: false, error: error.message };
    }
  }
};