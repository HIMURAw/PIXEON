import express from 'express';
import axios from 'axios';
import { query, queryOne, insert, update } from '../config/database.js';
import { discordConfig } from '../config/config.js';

const router = express.Router();

// Discord OAuth callback
router.post('/callback', async (req, res, next) => {
  try {
    console.log('🔍 Discord OAuth callback received:', req.body);
    const { code } = req.body;

    if (!code) {
      console.log('❌ No authorization code provided');
      return res.status(400).json({
        success: false,
        message: 'Authorization code is required'
      });
    }

    console.log('🔄 Exchanging code for access token...');
    console.log('📝 Config:', {
      client_id: discordConfig.clientId,
      redirect_uri: 'http://localhost:8080/api/auth/discord/callback'
    });

    // Exchange code for access token
    const tokenResponse = await axios.post('https://discord.com/api/oauth2/token', 
      new URLSearchParams({
        client_id: discordConfig.clientId,
        client_secret: discordConfig.clientSecret,
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: 'http://localhost:8080/api/auth/discord/callback'
      }), 
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    console.log('✅ Access token received successfully');

    const { access_token } = tokenResponse.data;

    // Get user information from Discord
    console.log('🔄 Getting user information from Discord...');
    const userResponse = await axios.get('https://discord.com/api/users/@me', {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    const discordUser = userResponse.data;
    console.log('✅ User data received:', {
      id: discordUser.id,
      username: discordUser.username,
      email: discordUser.email
    });

    // Check if user exists in database
    let user = await queryOne( 
      'SELECT * FROM users WHERE discord_id = ?',
      [discordUser.id]
    );

    if (user) {
      // Update existing user
      await update('users', {
        username: discordUser.username,
        display_name: discordUser.global_name || discordUser.username,
        avatar_url: discordUser.avatar ? 
          `https://cdn.discordapp.com/avatars/${discordUser.id}/${discordUser.avatar}.png?size=256` :
          `https://cdn.discordapp.com/embed/avatars/${discordUser.discriminator % 5}.png`,
        email: discordUser.email,
        updated_at: new Date()
      }, `discord_id = '${discordUser.id}'`);

      user = await queryOne(
        'SELECT * FROM users WHERE discord_id = ?',
        [discordUser.id]
      );
    } else {
      // Create new user
      const userId = await insert('users', {
        discord_id: discordUser.id,
        username: discordUser.username,
        display_name: discordUser.global_name || discordUser.username,
        avatar_url: discordUser.avatar ? 
          `https://cdn.discordapp.com/avatars/${discordUser.id}/${discordUser.avatar}.png?size=256` :
          `https://cdn.discordapp.com/embed/avatars/${discordUser.discriminator % 5}.png`,
        email: discordUser.email
      });

      user = await queryOne(
        'SELECT * FROM users WHERE id = ?',
        [userId]
      );
    }

    // Return user data (without sensitive information)
    const userData = {
      id: user.id,
      discord_id: user.discord_id,
      username: user.username,
      display_name: user.display_name,
      avatar: user.avatar_url,
      email: user.email,
      discriminator: discordUser.discriminator,
      created_at: user.created_at
    };

    res.json({
      success: true,
      message: 'Authentication successful',
      user: userData
    });

  } catch (error) {
    console.error('❌ Discord OAuth error:', error);
    
    if (error.response) {
      console.error('❌ Discord API response:', error.response.data);
      console.error('❌ Discord API status:', error.response.status);
      return res.status(400).json({
        success: false,
        message: 'Discord authentication failed',
        error: error.response.data.message || 'Unknown error',
        details: error.response.data
      });
    }

    console.error('❌ Network or other error:', error.message);
    next(error);
  }
});

// Get Discord OAuth URL
router.get('/url', (req, res) => {
  try {
    const clientId = discordConfig.clientId;
    const redirectUri = encodeURIComponent('http://localhost:8080/api/auth/discord/callback');
    const scope = encodeURIComponent('identify email');
    const responseType = 'code';
    
    const authUrl = `https://discord.com/api/oauth2/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=${responseType}&scope=${scope}`;
    
    res.json({
      success: true,
      authUrl
    });
  } catch (error) {
    next(error);
  }
});

// Discord OAuth redirect handler
router.get('/callback', async (req, res, next) => {
  try {
    const { code, error } = req.query;

    if (error) {
      return res.redirect(`http://localhost:5173/auth/callback?error=${encodeURIComponent(error)}`);
    }

    if (!code) {
      return res.redirect('http://localhost:5173/auth/callback?error=no_code');
    }

    // Process the OAuth callback
    const result = await processDiscordCallback(code);
    
    if (result.success) {
      // Redirect to frontend with success
      res.redirect(`http://localhost:5173/auth/callback?code=${code}`);
    } else {
      res.redirect(`http://localhost:5173/auth/callback?error=${encodeURIComponent(result.error)}`);
    }
  } catch (error) {
    console.error('Discord OAuth redirect error:', error);
    res.redirect(`http://localhost:5173/auth/callback?error=server_error`);
  }
});

// Helper function to process Discord callback
async function processDiscordCallback(code) {
  try {
    // Exchange code for access token
    const tokenResponse = await axios.post('https://discord.com/api/oauth2/token', 
      new URLSearchParams({
        client_id: discordConfig.clientId,
        client_secret: discordConfig.clientSecret,
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: 'http://localhost:8080/api/auth/discord/callback'
      }), 
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    const { access_token } = tokenResponse.data;

    // Get user information from Discord
    const userResponse = await axios.get('https://discord.com/api/users/@me', {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    const discordUser = userResponse.data;

    // Check if user exists in database
    let user = await queryOne(
      'SELECT * FROM users WHERE discord_id = ?',
      [discordUser.id]
    );

    if (user) {
      // Update existing user
      await update('users', {
        username: discordUser.username,
        display_name: discordUser.global_name || discordUser.username,
        avatar_url: discordUser.avatar ? 
          `https://cdn.discordapp.com/avatars/${discordUser.id}/${discordUser.avatar}.png?size=256` :
          `https://cdn.discordapp.com/embed/avatars/${discordUser.discriminator % 5}.png`,
        email: discordUser.email,
        updated_at: new Date()
      }, `discord_id = '${discordUser.id}'`);

      user = await queryOne(
        'SELECT * FROM users WHERE discord_id = ?',
        [discordUser.id]
      );
    } else {
      // Create new user
      const userId = await insert('users', {
        discord_id: discordUser.id,
        username: discordUser.username,
        display_name: discordUser.global_name || discordUser.username,
        avatar_url: discordUser.avatar ? 
          `https://cdn.discordapp.com/avatars/${discordUser.id}/${discordUser.avatar}.png?size=256` :
          `https://cdn.discordapp.com/embed/avatars/${discordUser.discriminator % 5}.png`,
        email: discordUser.email
      });

      user = await queryOne(
        'SELECT * FROM users WHERE id = ?',
        [userId]
      );
    }

    return { success: true, user };
  } catch (error) {
    console.error('Discord callback processing error:', error);
    return { success: false, error: error.message };
  }
}

export default router;