// Discord sunucu istatistiklerini güncelle
async function updateServerStats() {
    try {
        const response = await fetch('/api/discordUsers/serverMembers');
        const data = await response.json();

        // Toplam üye sayısını güncelle
        const totalPlayersElement = document.querySelector('.stat-card:first-child .stat-info p');
        if (totalPlayersElement) {
            totalPlayersElement.textContent = data.memberCount.toLocaleString();
        }

        // Sunucu adını güncelle
        const serverNameElement = document.querySelector('.server-info h2');
        if (serverNameElement) {
            serverNameElement.textContent = data.serverName;
        }

        // Son güncelleme zamanını güncelle
        const lastUpdatedElement = document.querySelector('.last-updated');
        if (lastUpdatedElement) {
            const lastUpdated = new Date(data.lastUpdated);
            lastUpdatedElement.textContent = `Last updated: ${lastUpdated.toLocaleString()}`;
        }

    } catch (error) {
        console.error('Error fetching server stats:', error);
    }
}

// Sayfa yüklendiğinde ve her 30 saniyede bir güncelle
document.addEventListener('DOMContentLoaded', () => {
    updateServerStats();
    setInterval(updateServerStats, 30000); // Her 30 saniyede bir güncelle
});
