import express from 'express';
import axios from 'axios';
import { query, queryOne, insert, update } from '../config/database.js';
import { discordConfig } from '../config/config.js';

const router = express.Router();

// Discord OAuth callback
router.post('/callback', async (req, res, next) => {
  try {
    const { code } = req.body;

    if (!code) {
      return res.status(400).json({
        success: false,
        message: 'Authorization code is required'
      });
    }

    // Exchange code for access token
    const tokenResponse = await axios.post('https://discord.com/api/oauth2/token', 
      new URLSearchParams({
        client_id: discordConfig.clientId,
        client_secret: discordConfig.clientSecret,
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/auth/callback`
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
    console.error('Discord OAuth error:', error);
    
    if (error.response) {
      console.error('Discord API response:', error.response.data);
      return res.status(400).json({
        success: false,
        message: 'Discord authentication failed',
        error: error.response.data.message || 'Unknown error'
      });
    }

    next(error);
  }
});

// Get Discord OAuth URL
router.get('/url', (req, res) => {
  try {
    const clientId = discordConfig.clientId;
    const redirectUri = encodeURIComponent(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/auth/callback`);
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

export default router;