let fivemConfig = null;

async function getFivemConfig() {
    if (fivemConfig) return fivemConfig;
    try {
        const res = await fetch('/api/config/server-config');
        if (!res.ok) throw new Error('Config fetch failed');
        fivemConfig = await res.json();
        return fivemConfig;
    } catch (err) {
        console.error('Config alınırken hata:', err);
        return null;
    }
}

// Sayfa yüklendiğinde oyuncu sayısını çek ve ekrana yaz

document.addEventListener('DOMContentLoaded', async () => {
    try {
        const res = await getFivemConfig();
        if (!res || !res.serverIP || !res.serverPort) return;
        const url = `http://${res.serverIP}:${res.serverPort}/px-web/characters`;
        const response = await fetch(url);
        if (!response.ok) throw new Error('Karakterler alınamadı');
        const data = await response.json();
        const totalPlayers = Array.isArray(data) ? data.length : (data?.length || 0);

        // Tüm stat-card'ları gez, başlığı Total Players olanı bul
        const statCards = document.querySelectorAll('#fivem-dashboard-content .stat-card');
        statCards.forEach(card => {
            const h3 = card.querySelector('.stat-info h3');
            if (h3 && h3.textContent.trim() === 'Total Players') {
                const p = card.querySelector('.stat-info p');
                if (p) p.textContent = totalPlayers;
            }
        });

        // Online oyuncu sayısını backend proxy API'sinden çek ve ekrana yaz
        const onlineUrl = '/api/fivem/players-online';
        const onlineResponse = await fetch(onlineUrl);
        if (!onlineResponse.ok) throw new Error('Online oyuncular alınamadı');
        const onlineData = await onlineResponse.json();
        const onlinePlayers = Array.isArray(onlineData) ? onlineData.length : (onlineData?.length || 0);
        // Tüm stat-card'ları gez, başlığı Online Players olanı bul
        statCards.forEach(card => {
            const h3 = card.querySelector('.stat-info h3');
            if (h3 && h3.textContent.trim() === 'Online Players') {
                const p = card.querySelector('.stat-info p');
                if (p) p.textContent = onlinePlayers;
            }
        });
    } catch (err) {
        console.error('Oyuncu sayısı alınamadı:', err);
    }
});
