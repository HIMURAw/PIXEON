const express = require('express');
const path = require('path');
const { Client, GatewayIntentBits, Events } = require('discord.js');
const Config = require('./config.json');
const { createAdminsTable } = require('./private/DB/models/userModel');

const app = express();

// Discord Client oluştur
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers
    ]
});

// Discord bot event handlers
client.once(Events.ClientReady, () => {
    console.log(`Discord bot logged in as ${client.user.tag}`);
});

client.on(Events.Error, error => {
    console.error('Discord bot error:', error);
});

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Statik dosyalar
app.use(express.static(path.join(__dirname, 'public')));

// Ana sayfa route'u
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
})

/*

ROUTERS

*/

const loginRouter = require('./private/DB/loginRouter');

// Login routes
app.use('/api/auth', loginRouter);

// Admins tablosunu oluştur
createAdminsTable().catch(console.error);

/*

ROUTERS END

*/

const port = Config.port || 3000;
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
    // Discord bot'u başlat
    client.login(Config.discord.token).catch(error => {
        console.error('Discord bot login error:', error);
    });
});