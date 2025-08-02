import express from "express";
import axios from "axios";
import jwt from "jsonwebtoken";
import { db } from "../../../packages/db/index";
import { users } from "../../../packages/db/schema/schema";
import { eq } from "drizzle-orm";
import qs from "querystring";

const router = express.Router();

const {
    DISCORD_CLIENT_ID,
    DISCORD_CLIENT_SECRET,
    DISCORD_REDIRECT_URI,
    JWT_SECRET,
} = process.env;

router.get("/discord", (req, res) => {
    const params = qs.stringify({
        client_id: DISCORD_CLIENT_ID,
        redirect_uri: DISCORD_REDIRECT_URI,
        response_type: "code",
        scope: "identify email",
    });

    res.redirect(`https://discord.com/api/oauth2/authorize?${params}`);
});

router.get("/discord/callback", async (req, res) => {
    const code = req.query.code as string;

    const tokenRes = await axios.post(
        "https://discord.com/api/oauth2/token",
        qs.stringify({
            client_id: DISCORD_CLIENT_ID,
            client_secret: DISCORD_CLIENT_SECRET,
            grant_type: "authorization_code",
            code,
            redirect_uri: DISCORD_REDIRECT_URI,
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
        JWT_SECRET!,
        { expiresIn: "7d" }
    );

    res.cookie("auth", token, {
        httpOnly: true,
        secure: false, // HTTPS için true
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.redirect("http://localhost:5173/dashboard");
});

export default router;
