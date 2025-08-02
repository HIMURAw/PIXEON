import express from "express";
import axios from "axios";
import jwt from "jsonwebtoken";
import { db, schema, eq } from "../../../packages/db/index";
import qs from "querystring";

const { users } = schema;

const router = express.Router();

import discordConfig from '../../../apps/bot/config';
import Config from '../config';

router.get("/discord", (req, res) => {
    const params = qs.stringify({
        client_id: discordConfig.discord.clientId,
        redirect_uri: discordConfig.discord.redirectUri,
        response_type: "code",
        scope: "identify email",
    });

    res.redirect(`https://discord.com/api/oauth2/authorize?${params}`);
});

router.get("/discord/callback", async (req, res) => {
    const code = req.query.code as string;

    try {
        console.log('[PX-API] Discord OAuth callback başlatıldı');
        console.log('[PX-API] Code:', code);
        console.log('[PX-API] Client ID:', discordConfig.discord.clientId);
        console.log('[PX-API] Redirect URI:', discordConfig.discord.redirectUri);

        const tokenRes = await axios.post(
            "https://discord.com/api/oauth2/token",
            qs.stringify({
                client_id: discordConfig.discord.clientId,
                client_secret: discordConfig.discord.clientSecret,
                grant_type: "authorization_code",
                code,
                redirect_uri: discordConfig.discord.redirectUri,
            }),
            {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
            }
        );

    const accessToken = tokenRes.data.access_token;

    const userRes = await axios.get("https://discord.com/api/users/@me", {
        headers: { Authorization: `Bearer ${accessToken}` },
    });

    const discordUser = userRes.data;

    const existing = await db
        .select()
        .from(users)
        .where(eq(users.discordId, discordUser.id));

    if (existing.length === 0) {
        await db.insert(users).values({
            discordId: discordUser.id,
            username: discordUser.username,
            email: discordUser.email,
            avatar: discordUser.avatar,
        });
    }

    const token = jwt.sign(
        {
            discordId: discordUser.id,
            username: discordUser.username,
            email: discordUser.email,
        },
        Config.JWT_SECRET!,
        { expiresIn: "7d" }
    );

    res.cookie("auth", token, {
        httpOnly: true,
        secure: false, // HTTPS için true
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });

        res.redirect("http://localhost:5173/dashboard");
    } catch (error) {
        console.error('[PX-API] Discord OAuth hatası:', error);
        if (axios.isAxiosError(error)) {
            console.error('[PX-API] Response data:', error.response?.data);
            console.error('[PX-API] Response status:', error.response?.status);
        }
        res.status(500).json({ error: 'Discord authentication failed' });
    }
});

export default router;
