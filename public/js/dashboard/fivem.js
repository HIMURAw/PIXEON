let fivemConfig = null;

async function getFivemConfig() {
    if (fivemConfig) return fivemConfig;
    const res = await fetch('/api/config/server-config');
    if (!res.ok) throw new Error('Config fetch failed');
    fivemConfig = await res.json();
    return fivemConfig;
}


// Kullanım
// const cfg = await getFivemConfig();
// console.log('Response: ', cfg.serverIP)


Fivem_playersDB_API = {
    async getPlayers() {
        const cfg = await getFivemConfig();
        const res = await fetch(`http://${cfg.serverIP}:${cfg.serverPort}/characters`);
        return await res.json();
    }
}

console.log('Fivem_playersDB_API: ', Fivem_playersDB_API);