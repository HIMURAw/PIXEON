import express from "express";
import axios from "axios";
import { db, schema, eq } from "../../../packages/db/index";
import qs from "querystring";
import Config from '../config';

const { users } = schema;
const router = express.Router();

// Discord OAuth başlatma endpoint'i
router.get("/discord", (req: express.Request, res: express.Response) => {
    const state = Math.random().toString(36).substring(7);

    const params = qs.stringify({
        client_id: Config.discord.clientId,
        redirect_uri: Config.discord.redirectUri,
        response_type: "code",
        scope: "identify email guilds guilds.members.read",
        state: state
    });

    const oauthUrl = `https://discord.com/api/oauth2/authorize?${params}`;
    console.log('[PX-API] OAuth URL:', oauthUrl);
    console.log('[PX-API] State:', state);

    res.redirect(oauthUrl);
});

// Discord OAuth callback endpoint'i
router.get("/discord/callback", async (req: express.Request, res: express.Response) => {
    const code = req.query.code as string;

    if (!code) {
        console.error('[PX-API] Code parametresi boş!');
        return res.status(400).json({ error: 'Authorization code is missing' });2
    }

    try {
        console.log('[PX-API] Discord OAuth callback başlatıldı');
        console.log('[PX-API] Code:', code);

        const tokenRes = await axios.post('https://discord.com/api/oauth2/token',
            qs.stringify({
                client_id: Config.discord.clientId,
                client_secret: Config.discord.clientSecret,
                grant_type: 'authorization_code',
                code,
                redirect_uri: Config.discord.redirectUri,
                scope: 'identify email guilds guilds.members.read'
            }), {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }
        );

        const accessToken = tokenRes.data.access_token;

        const userRes = await axios.get('https://discord.com/api/users/@me', {
            headers: { Authorization: `Bearer ${accessToken}` }
        });
        const user = userRes.data;

        let roles: string[] = [];
        try {
            const memberRes = await axios.get(
                `https://discord.com/api/users/@me/guilds/${Config.discord.guildId}/member`,
                { headers: { Authorization: `Bearer ${accessToken}` } }
            );
            if (memberRes.data && Array.isArray(memberRes.data.roles)) {
                roles = memberRes.data.roles;
            } else if (memberRes.data && memberRes.data.roles) {
                roles = Array.isArray(memberRes.data.roles) ? memberRes.data.roles : [memberRes.data.roles];
            }
        } catch (err) {
            console.warn('[PX-API] Kullanıcı sunucuda değil veya rolleri alınamadı:', err);
            roles = [];
        }

        const username = user.username + '#' + user.discriminator;
        const avatarUrl = user.avatar
            ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`
            : 'https://cdn.discordapp.com/embed/avatars/0.png';

        const existing = await db
            .select()
            .from(users)
            .where(eq(users.discordId, user.id));

        if (existing.length === 0) {
            // Yeni kullanıcı ekle
            await db.insert(users).values({
                discordId: user.id,
                username: username,
                email: user.email || null,
                avatar: avatarUrl,
                roles: JSON.stringify(roles),
            });
        } else {
            // Mevcut kullanıcıyı güncelle
            await db
                .update(users)
                .set({
                    username: username,
                    email: user.email || null,
                    avatar: avatarUrl,
                    roles: JSON.stringify(roles),
                })
                .where(eq(users.discordId, user.id));
        }

        // 5. Cookie set et - kullanıcı bilgilerini JSON olarak sakla
        const userData = {
            discordId: user.id,
            username: username,
            avatar: avatarUrl,
            email: user.email,
            roles: roles
        };

        const encodedUserData = encodeURIComponent(JSON.stringify(userData));
        console.log('Token', encodedUserData)
        res.cookie('auth_token', encodedUserData, {
            maxAge: 30 * 24 * 60 * 60 * 1000, // 30 gün
            httpOnly: false, // JavaScript'ten erişilebilir olsun
            secure: false, // HTTPS kullanıyorsan true yap
            sameSite: 'lax'
        });

        // Başarılı girişten sonra UI'a yönlendir
        res.redirect(Config.frontendUrl);

    } catch (error) {
        console.error('[PX-API] Discord login error:', error);
        if (axios.isAxiosError(error)) {
            console.error('[PX-API] Response data:', error.response?.data);
            console.error('[PX-API] Response status:', error.response?.status);
        }
        res.status(500).json({ error: 'Discord authentication failed' });
    }
});

// Username ile kullanıcı bilgilerini döndüren endpoint
router.get('/api/user/:username', async (req: express.Request, res: express.Response) => {
    try {
        const username = req.params.username;
        console.log('[PX-API] Username from params:', username);

        // Drizzle ile kullanıcıyı çek
        const user = await db
            .select()
            .from(users)
            .where(eq(users.username, username));

        console.log('[PX-API] Drizzle query result:', user);

        if (user.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json(user[0]);
    } catch (error) {
        console.error('[PX-API] User fetch error:', error);
        res.status(500).json({ error: 'Database error' });
    }
});

// Test kullanıcısını veritabanına ekle
router.get('/add-user', async (req: express.Request, res: express.Response) => {
    try {
        await db.insert(users).values({
            discordId: '123456789',
            username: 'himura_1#0',
            email: 'test@test.com',
            avatar: null,
        });
        res.json({ message: 'User added' });
    } catch (error) {
        console.error('[PX-API] Add user error:', error);
        res.status(500).json({ error: 'Failed to add user' });
    }
});

// Kullanıcı kontrol endpoint'i
router.get('/api/user/check', async (req: express.Request, res: express.Response) => {
    console.log('[PX-API] Request cookies:', req.cookies);

    const authToken = req.cookies.auth_token;
    console.log('[PX-API] Auth token from cookie:', authToken);

    if (!authToken) {
        console.log('[PX-API] No auth token found - returning 401');
        return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
        // URL-decode yap ve JSON parse et
        const userData = JSON.parse(decodeURIComponent(authToken));
        console.log('[PX-API] User data from cookie:', userData);

        // Drizzle ile kullanıcıyı çek
        const user = await db
            .select()
            .from(users)
            .where(eq(users.discordId, userData.discordId));

        console.log('[PX-API] Drizzle query results:', user);

        if (user.length === 0) {
            console.log('[PX-API] User not found in database for discordId:', userData.discordId);
            return res.status(404).json({ error: 'User not found' });
        }

        console.log('[PX-API] User found in database:', user[0]);
        res.json(user[0]);
    } catch (error) {
        console.error('[PX-API] User check error:', error);
        res.status(500).json({ error: 'Database error' });
    }
});

// Admin role ID'yi config'den çek (eğer varsa)
router.get('/admin-role-id', (req: express.Request, res: express.Response) => {
    try {
        // Config'de adminRoleId yoksa null döndür
        const adminRoleId = (Config.discord as any).adminRoleId || null;
        res.json({ adminRoleId: adminRoleId });
    } catch (error) {
        console.error('[PX-API] Error getting admin role ID:', error);
        res.status(500).json({ error: 'Failed to get admin role ID' });
    }
});

export default router;