const express = require("express");
const cors = require("cors");
const { ExpressAuth, getSession } = require("@auth/express");
const GoogleProvider = require("@auth/express/providers/google").default;
const DB = require("./src/DB/connect.js");
const Config = require("./config.js");

const app = express();
const port = 3000;

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}));

const authOptions = {
    providers: [
        GoogleProvider({
            clientId: Config.auth.AUTH_GOOGLE_ID,
            clientSecret: Config.auth.AUTH_GOOGLE_SECRET,
        }),
    ],
    secret: Config.auth.AUTH_SECRET,
};

app.use(express.json());

app.get("/", (req, res) => {
    res.send("Hello World from PXDevelopment Backend!");
});

app.use("/auth", ExpressAuth(authOptions));

app.get("/api/profile", async (req, res) => {
    const session = await getSession(req, authOptions);
    if (!session) return res.status(401).json({ error: "Unauthenticated" });
    res.json({ user: session.user });
});

app.listen(port, () => {
    console.log(`[BACKEND] Running at http://localhost:${port}`);
});
