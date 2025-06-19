let fivemConfig = null;

async function getFivemConfig() {
    if (fivemConfig) return fivemConfig;
    const res = await fetch('/api/config/server-config');
    if (!res.ok) throw new Error('Config fetch failed');
    fivemConfig = await res.json();
    return fivemConfig;
}

getFivemConfig().then(cfg => {
    console.log(cfg.serverIP, cfg.serverPort);
});

// Kullanım
// const cfg = await getFivemConfig();
// console.log('Response: ', cfg.serverIP)