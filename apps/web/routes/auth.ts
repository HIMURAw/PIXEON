import { betterAuth } from "better-auth";
import Config from "../config"

export const auth = betterAuth({
    socialProviders: {
        discord: {
            clientId: Config.discord.clientId as string,
            clientSecret: Config.discord.clientSecret as string,
            redirectUri: "http://localhost:3000/auth/callback",
        },
    },
});
