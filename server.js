const express = require('express');
const path = require('path');
const { Client, GatewayIntentBits, Events, EmbedBuilder } = require('discord.js');
const Config = require('./config.js');
const { createAdminsTable } = require('./private/DB/models/userModel');
const { pool } = require('./private/DB/connect');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const util = require('util');
const { loadCommands } = require('./private/handlers/commands');
const { loadEvents } = require('./private/handlers/events');

require('./private/TicketSystem/index.js')
require('./private/GuardSystem/index.js')

// Node.js 18+ için fetch kullan, değilse node-fetch yükle
let fetch;
if (typeof globalThis.fetch === 'undefined') {
    fetch = require('node-fetch');
} else {
    fetch = globalThis.fetch;
}

// Discord Webhook fonksiyonu
function sendToDiscord(message, ip, userAgent, host, status) {
    try {
        const webhookUrl = Config.discord.log.LicenseLog;
        if (!webhookUrl) {
            console.warn('Discord license webhook URL bulunamadı!');
            return;
        }

        const embed = new EmbedBuilder()
            .setColor(status === 'VALID' ? '#00ff00' : status === 'ERROR' ? '#ff0000' : '#ffa500')
            .setTitle('🔐 Lisans Doğrulama Sistemi')
            .setDescription(message)
            .setTimestamp()
            .setFooter({ 
                text: 'PXDevelopment License System', 
                iconURL: Config.discord.serverLogo 
            });

        if (ip) {
            embed.addFields({ name: '🌐 IP Adresi', value: `\`${ip}\``, inline: true });
        }
        
        if (userAgent) {
            embed.addFields({ name: '🖥️ User Agent', value: `\`${userAgent.substring(0, 100)}${userAgent.length > 100 ? '...' : ''}\``, inline: false });
        }
        
        if (host) {
            embed.addFields({ name: '🏠 Host', value: `\`${host}\``, inline: true });
        }

        embed.addFields({ name: '📊 Durum', value: status, inline: true });

        fetch(webhookUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: Config.discord.log.WebhookName,
                avatar_url: Config.discord.log.WebhookLogoURL,
                embeds: [embed.toJSON()]
            })
        }).catch(error => {
            console.error('Discord webhook gönderme hatası:', error);
        });
    } catch (error) {
        console.error('Discord webhook işleme hatası:', error);
    }
}

// Lisans log kaydetme fonksiyonu
async function saveLicenseLog(logData) {
    try {
        const {
            ip_address,
            host,
            user_agent,
            request_ip,
            status,
            server_name,
            license_id,
            added_by,
            response_time,
            error_message
        } = logData;

        const query = `
            INSERT INTO license_logs 
            (ip_address, host, user_agent, request_ip, status, server_name, license_id, added_by, response_time, error_message)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        await pool.query(query, [
            ip_address,
            host,
            user_agent,
            request_ip,
            status,
            server_name,
            license_id,
            added_by,
            response_time,
            error_message
        ]);

        console.log('\x1b[32m✅ [PX-API]\x1b[0m License log saved successfully');
    } catch (error) {
        console.error('❌ License log save error:', error);
    }
}

const app = express();

const port = Config.port || 3000;

// Cookie parser middleware - cookie'leri okumak için gerekli
app.use(cookieParser());

app.use(session({
    secret: Config.dev.secretKey, // Güçlü bir secret kullan!
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } // Eğer HTTPS kullanıyorsan true yapabilirsin
}));

// Discord Client oluştur
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildPresences,
        GatewayIntentBits.GuildBans,
        GatewayIntentBits.GuildInvites,
    ]
});

// Client'ı hemen export et
module.exports = client;

// Komutları yükle
console.log('\x1b[36m[PX-API]\x1b[0m Komut Yükleme Başladı ===');
const commands = loadCommands(client);
console.log('\x1b[38;5;208m[PX-API]\x1b[0m Komut yükleme başlatıldı...');
console.log('\x1b[38;5;208m[PX-API]\x1b[0m\n=== Komut Yükleme Tamamlandı ===');

loadEvents(client);


const token = Config.discord.token;


client.on(Events.Error, error => {
    console.error('Discord bot error:', error);
});

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS ve Cookie ayarları
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.header('Access-Control-Allow-Credentials', 'true');

    // SameSite cookie policy
    res.header('Set-Cookie', 'SameSite=None; Secure');

    if (req.method === 'OPTIONS') {
        res.sendStatus(200);
    } else {
        next();
    }
});

// Statik dosyalar
app.use(express.static(path.join(__dirname, 'public')));

// Ana sayfa route'u
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
});

/*

ROUTERS

*/

const loginRouter = require('./private/DB/loginRouter');
const discordUsersRouter = require('./private/routers/discordUsers.js');
const discordServerRouter = require('./private/routers/discordServer.js');
const discordChannelRouter = require('./private/routers/discordChannel.js');
const ConfigRouter = require('./private/routers/configAPI.js');
const discordLoginRouter = require('./private/routers/discordLogin');
const discordLog = require('./private/routers/discordLog.js')
const discordMessageLog = require('./private/routers/discordMessage.js')
const discordVoiceLog = require('./private/routers/discordVoice.js')
const discordChannelLog = require('./private/routers/discordChannelLog.js')
const discordEmojiLog = require('./private/routers/discordEmojiLog.js')
const discordInviteLog = require('./private/routers/discordInviteLog.js')
const looginLog = require('./private/routers/loginLog.js')
const CommentRouter = require('./private/routers/Comment.js');
const indexAPIRouter = require('./private/routers/indexAPI.js');
const activityHistoryRouter = require('./private/routers/activityHistory.js');
const licensesRouter = require('./private/routers/licenses');

app.use('/api/auth', loginRouter);
app.use('/api/discordUsers', discordUsersRouter);
app.use('/api/discordServer', discordServerRouter);
app.use('/api/comment', CommentRouter);
app.use('/api/discord/log', discordLog)
app.use('/api/discord/log/message', discordMessageLog)
app.use('/api/discord/log/voice', discordVoiceLog)
app.use('/api/discord/log/channel', discordChannelLog)
app.use('/api/loginLog', looginLog)
app.use('/api/discord/log/emoji', discordEmojiLog)
app.use('/api/discord/log/invite', discordInviteLog)
app.use('/api/activity-history', activityHistoryRouter);
app.use('/api/discordChannel', discordChannelRouter);
app.use('/api/config', ConfigRouter);
app.use('/api', indexAPIRouter);
app.use('/auth/discord', discordLoginRouter);
app.use('/api/licenses', licensesRouter);

app.get('/api/discord/oauth-config', (req, res) => {
    res.json({
        clientId: Config.discord.clientId,
        redirectUri: Config.discord.redirectUri,
        adminRoleId: Config.discord.adminRoleId
    });
});


// IP Doğrulama API'si
app.get("/check_ip", async (req, res) => {
    const startTime = Date.now();
    const { ip, server_name, license_key } = req.query;
    const userAgent = req.headers['user-agent'];
    const host = req.headers.host;
    const requestIP = req.ip || req.connection.remoteAddress;

    console.log('\x1b[36m[PX-API]\x1b[0m IP verification request received:', util.inspect({
        requestedIP: ip,
        serverName: server_name,
        licenseKey: license_key,
        userAgent: userAgent,
        host: host,
        requestIP: requestIP
    }, { colors: true, depth: 2 }));

    // IP adresi kontrolü
    if (!ip) {
        const responseTime = Date.now() - startTime;
        console.warn('❌ IP verification failed - missing IP parameter');
        
        // Log kaydet
        await saveLicenseLog({
            ip_address: null,
            host: host,
            user_agent: userAgent,
            request_ip: requestIP,
            status: 'ERROR',
            server_name: null,
            license_id: null,
            added_by: null,
            response_time: responseTime,
            error_message: 'Missing IP parameter'
        });
        
        sendToDiscord("❌ IP could not be obtained or was sent incomplete.", null, null, null, "ERROR");
        return res.status(400).send("INVALID");
    }

    // IP adresi format kontrolü
    const ipRegex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    if (!ipRegex.test(ip)) {
        const responseTime = Date.now() - startTime;
        console.warn('❌ IP verification failed - invalid IP format:', ip);
        
        // Log kaydet
        await saveLicenseLog({
            ip_address: ip,
            host: host,
            user_agent: userAgent,
            request_ip: requestIP,
            status: 'INVALID',
            server_name: null,
            license_id: null,
            added_by: null,
            response_time: responseTime,
            error_message: 'Invalid IP format'
        });
        
        sendToDiscord(`❌ Invalid IP format: \`${ip}\``, ip, userAgent, host, "INVALID");
        return res.status(400).send("INVALID");
    }

    try {
        // Pool kullanarak veritabanı sorgusu
        const [result] = await pool.query("SELECT * FROM licenses WHERE server_ip = ?", [ip]);
        const responseTime = Date.now() - startTime;
        
        if (result.length > 0) {
            const license = result[0];
            console.log('\x1b[32m✅ [PX-API]\x1b[0m IP verification successful:', util.inspect({
                requestedIP: ip,
                serverName: license.server_name,
                licenseId: license.id,
                requestIP: requestIP,
                responseTime: responseTime
            }, { colors: true, depth: 2 }));
            
            // Log kaydet
            await saveLicenseLog({
                ip_address: ip,
                host: host,
                user_agent: userAgent,
                request_ip: requestIP,
                status: 'VALID',
                server_name: license.server_name,
                license_id: license.id,
                added_by: license.added_by,
                response_time: responseTime,
                error_message: null
            });
            
            // Başarılı doğrulama webhook'u
            sendToDiscord(
                `✅ Licensed IP verified: \`${ip}\`\n📋 Server: ${license.server_name}\n👤 Added by: ${license.added_by || 'Unknown'}\n🕒 Created: ${new Date(license.created_at).toLocaleString('tr-TR')}\n⚡ Response Time: ${responseTime}ms`,
                ip, 
                userAgent, 
                host, 
                "VALID"
            );
            
            return res.send("VALID");
        } else {
            console.warn('❌ IP verification failed - invalid license:', {
                requestedIP: ip,
                requestIP: requestIP,
                responseTime: responseTime
            });
            
            // Log kaydet
            await saveLicenseLog({
                ip_address: ip,
                host: host,
                user_agent: userAgent,
                request_ip: requestIP,
                status: 'INVALID',
                server_name: null,
                license_id: null,
                added_by: null,
                response_time: responseTime,
                error_message: 'IP not found in license system'
            });
            
            // Geçersiz IP webhook'u
            sendToDiscord(
                `❌ Invalid licensed IP attempt: \`${ip}\`\n🚫 This IP is not registered in our license system.\n🖥️ User Agent: ${userAgent || 'Unknown'}\n⚡ Response Time: ${responseTime}ms`,
                ip, 
                userAgent, 
                host, 
                "INVALID"
            );
            
            return res.send("INVALID");
        }
    } catch (err) {
        const responseTime = Date.now() - startTime;
        console.error('⚠️ Database query error during IP verification:', err);
        
        // Log kaydet
        await saveLicenseLog({
            ip_address: ip,
            host: host,
            user_agent: userAgent,
            request_ip: requestIP,
            status: 'ERROR',
            server_name: null,
            license_id: null,
            added_by: null,
            response_time: responseTime,
            error_message: err.message
        });
        
        sendToDiscord(
            `⚠️ Database error during IP verification: ${err.message}\n🔍 IP: ${ip}\n🖥️ User Agent: ${userAgent || 'Unknown'}\n⚡ Response Time: ${responseTime}ms`,
            ip, 
            userAgent, 
            host, 
            "ERROR"
        );
        return res.status(500).send("ERROR");
    }
});

// Lisans durumu kontrolü API'si
app.get("/license_status", async (req, res) => {
    const { ip } = req.query;
    
    if (!ip) {
        return res.status(400).json({
            status: "ERROR",
            message: "IP address is required"
        });
    }

    try {
        const [result] = await pool.query("SELECT * FROM licenses WHERE server_ip = ?", [ip]);
        
        if (result.length > 0) {
            const license = result[0];
            return res.json({
                status: "SUCCESS",
                licensed: true,
                license: {
                    id: license.id,
                    server_name: license.server_name,
                    server_ip: license.server_ip,
                    added_by: license.added_by,
                    created_at: license.created_at
                }
            });
        } else {
            return res.json({
                status: "SUCCESS",
                licensed: false,
                message: "IP address is not licensed"
            });
        }
    } catch (err) {
        console.error('License status check error:', err);
        return res.status(500).json({
            status: "ERROR",
            message: "Database error occurred"
        });
    }
});

// Lisans logları API'si
app.get("/license_logs", async (req, res) => {
    const { limit = 100, offset = 0, status, ip_address } = req.query;
    
    try {
        let query = "SELECT * FROM license_logs";
        let params = [];
        let conditions = [];
        
        // Filtreler
        if (status) {
            conditions.push("status = ?");
            params.push(status);
        }
        
        if (ip_address) {
            conditions.push("ip_address = ?");
            params.push(ip_address);
        }
        
        if (conditions.length > 0) {
            query += " WHERE " + conditions.join(" AND ");
        }
        
        query += " ORDER BY created_at DESC LIMIT ? OFFSET ?";
        params.push(parseInt(limit), parseInt(offset));
        
        const [logs] = await pool.query(query, params);
        
        // Toplam sayıyı al
        let countQuery = "SELECT COUNT(*) as total FROM license_logs";
        if (conditions.length > 0) {
            countQuery += " WHERE " + conditions.join(" AND ");
        }
        const [countResult] = await pool.query(countQuery, params.slice(0, -2));
        
        return res.json({
            status: "SUCCESS",
            logs: logs,
            total: countResult[0].total,
            limit: parseInt(limit),
            offset: parseInt(offset)
        });
    } catch (err) {
        console.error('License logs fetch error:', err);
        return res.status(500).json({
            status: "ERROR",
            message: "Database error occurred"
        });
    }
});

// Lisans istatistikleri API'si
app.get("/license_statistics", async (req, res) => {
    try {
        const [stats] = await pool.query("SELECT * FROM license_statistics");
        const [recentLogs] = await pool.query("SELECT * FROM recent_license_logs LIMIT 10");
        
        return res.json({
            status: "SUCCESS",
            statistics: stats[0],
            recent_logs: recentLogs
        });
    } catch (err) {
        console.error('License statistics fetch error:', err);
        return res.status(500).json({
            status: "ERROR",
            message: "Database error occurred"
        });
    }
});


createAdminsTable().catch(console.error);

/*

ROUTERS END

*/


// (joinVoice fonksiyonu ve client.on('ready'), client.on('voiceStateUpdate') eventleri kaldırıldı)

app.listen(port, () => {
    console.log(`\x1b[38;5;208m[PX-API]\x1b[0m http://${Config.dev.domain}:${port}`);

    client.login(Config.discord.token).then(() => {
        console.log('\x1b[38;5;208m[PX-API]\x1b[0m Discord bot API başarıyla bağlandı');
    }).catch(error => {
        console.error('\x1b[41m[PX-API] HATA\x1b[0m', error);
    });
});

