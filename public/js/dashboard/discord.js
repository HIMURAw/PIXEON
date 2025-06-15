// Discord sunucu bilgilerini güncelle
async function updateServerStats() {
    try {
        // Üye bilgilerini al
        const membersResponse = await fetch('/api/discordUsers/serverMembers');
        const membersData = await membersResponse.json();

        // Sunucu bilgilerini al
        const serverResponse = await fetch('/api/discordServer/serverInfo');
        const serverData = await serverResponse.json();

        // Sunucu ikonunu güncelle
        const logoElement = document.querySelector('.logo');
        if (logoElement && serverData.icon) {
            logoElement.src = serverData.icon;
            logoElement.alt = `${serverData.name} Logo`;
        }

        // Sunucu adını güncelle
        const serverNameElement = document.querySelector('.logo + h2');
        if (serverNameElement) {
            serverNameElement.textContent = serverData.name;
        }

        // Toplam üye sayısını güncelle
        const totalPlayersElement = document.querySelector('.stat-card:first-child .stat-info p');
        if (totalPlayersElement) {
            totalPlayersElement.textContent = serverData.memberCount.toLocaleString();
        }

        // Çevrimiçi üye sayısını güncelle
        const onlinePlayersElement = document.querySelector('.stat-card:nth-child(2) .stat-info p');
        if (onlinePlayersElement) {
            onlinePlayersElement.textContent = membersData.onlineMembers.toLocaleString();
        }

        // Bot sayısını güncelle
        const botCountElement = document.querySelector('.stat-card:nth-child(3) .stat-info p');
        if (botCountElement) {
            const botCount = membersData.members.filter(member => member.isBot).length;
            botCountElement.textContent = botCount.toLocaleString();
        }

        // Sunucu yükünü güncelle
        const serverLoadElement = document.querySelector('.stat-card:nth-child(4) .stat-info p');
        if (serverLoadElement) {
            const loadPercentage = Math.round((membersData.onlineMembers / serverData.memberCount) * 100);
            serverLoadElement.textContent = `${loadPercentage}%`;
        }

        // Ses kanalları sayısını güncelle
        const voiceChannelsElement = document.querySelector('.stats-grid:nth-child(2) .stat-card:nth-child(1) .stat-info p');
        if (voiceChannelsElement) {
            voiceChannelsElement.textContent = serverData.channelStats.voice.toLocaleString();
        }

        // Aktif kanallar sayısını güncelle
        const activeChannelsElement = document.querySelector('.stats-grid:nth-child(2) .stat-card:nth-child(2) .stat-info p');
        if (activeChannelsElement) {
            activeChannelsElement.textContent = serverData.channelStats.total.toLocaleString();
        }

        // Boost sayısını güncelle
        const boostCountElement = document.querySelector('.stats-grid:nth-child(2) .stat-card:nth-child(3) .stat-info p');
        if (boostCountElement) {
            boostCountElement.textContent = serverData.boostCount.toLocaleString();
        }

        // Sunucu yaşını güncelle
        const serverAgeElement = document.querySelector('.stats-grid:nth-child(2) .stat-card:nth-child(4) .stat-info p');
        if (serverAgeElement) {
            const serverCreationDate = new Date(serverData.createdAt);
            const now = new Date();
            const diffTime = Math.abs(now - serverCreationDate);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            serverAgeElement.textContent = `${diffDays} gün`;
        }

        // Sunucu bilgilerini güncelle
        const serverInfoElement = document.querySelector('.server-info h2');
        if (serverInfoElement) {
            serverInfoElement.textContent = serverData.name;
        }

        // Son güncelleme zamanını güncelle
        const lastUpdatedElement = document.querySelector('.last-updated');
        if (lastUpdatedElement) {
            const lastUpdated = new Date();
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
