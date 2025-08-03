import dotenv from 'dotenv';

// Environment variables'ları yükle
dotenv.config();

const config = {
    // Server Configuration
    port: process.env.PORT || 3001,
    nodeEnv: process.env.NODE_ENV || 'development',

    // Database Configuration
    db: {
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || 'pxdevwebsitev3',
    },

    // Discord OAuth Configuration
    discord: {
        clientId: process.env.DISCORD_CLIENT_ID || '1310954355884691488',
        clientSecret: process.env.DISCORD_CLIENT_SECRET || 'jJVJw74-NfIh7BOHcRBEFO-NCB5hcqXA',
        guildId: process.env.DISCORD_GUILD_ID || '1269430268402335867',
        redirectUri: process.env.DISCORD_REDIRECT_URI || 'http://localhost:3001/auth/discord/callback',
    },

    // Frontend URL
    frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',

    // JWT Configuration
    jwtSecret: process.env.JWT_SECRET || 'keremin31çekeneliyleyakalnanbaliğinsoltaşşağinayapişmismidyeyiyiyenperro',
};

export default config;