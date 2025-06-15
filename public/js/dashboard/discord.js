// Discord sunucu bilgilerini güncelle
async function updateServerStats() {
    try {
        // Üye bilgilerini al
        const membersResponse = await fetch('/api/discordUsers/serverMembers');
        const membersData = await membersResponse.json();

        // Sunucu bilgilerini al
        const serverResponse = await fetch('/api/discordServer/serverInfo');
        const serverData = await serverResponse.json();

        // Kanalları al
        const channelsResponse = await fetch('/api/discordServer/channels');
        const channelsData = await channelsResponse.json();

        // Kanalları listele
        const channelsList = document.querySelector('.channels-list');
        if (channelsList && channelsData && channelsData.channels) {
            channelsList.innerHTML = ''; // Mevcut içeriği temizle
            
            // Kategorileri grupla
            const categories = {};
            channelsData.channels.forEach(channel => {
                if (channel.type === 4) { // Kategori
                    categories[channel.id] = {
                        name: channel.name,
                        channels: []
                    };
                }
            });

            // Kanalları kategorilere ekle
            channelsData.channels.forEach(channel => {
                if (channel.type !== 4) { // Kategori değilse
                    if (channel.parent) {
                        if (!categories[channel.parent.id]) {
                            categories[channel.parent.id] = {
                                name: channel.parent.name,
                                channels: []
                            };
                        }
                        categories[channel.parent.id].channels.push(channel);
                    } else {
                        if (!categories['uncategorized']) {
                            categories['uncategorized'] = {
                                name: 'Diğer',
                                channels: []
                            };
                        }
                        categories['uncategorized'].channels.push(channel);
                    }
                }
            });

            // Kategorileri ve kanalları göster
            Object.values(categories).forEach(category => {
                if (category.channels.length > 0) {
                    const categoryDiv = document.createElement('div');
                    categoryDiv.className = 'channel-category';
                    categoryDiv.innerHTML = `
                        <div class="category-header">
                            <i class="fas fa-folder"></i>
                            <span>${category.name}</span>
                        </div>
                        <div class="category-channels">
                            ${category.channels.map(channel => `
                                <div class="channel-item">
                                    <i class="fas ${channel.type === 2 ? 'fa-volume-up' : 'fa-hashtag'}"></i>
                                    <span>${channel.name}</span>
                                    ${channel.type === 2 ? `<span class="voice-users">0</span>` : ''}
                                </div>
                            `).join('')}
                        </div>
                    `;
                    channelsList.appendChild(categoryDiv);
                }
            });
        } else {
            console.error('Channels data is not available');
            if (channelsList) {
                channelsList.innerHTML = '<div class="loading-spinner">Loading channels...</div>';
            }
        }

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
        // Hata durumunda loading mesajını göster
        const channelsList = document.querySelector('.channels-list');
        if (channelsList) {
            channelsList.innerHTML = '<div class="loading-spinner">Error loading channels. Please try again.</div>';
        }
    }
}

// Sayfa yüklendiğinde ve her 30 saniyede bir güncelle
document.addEventListener('DOMContentLoaded', () => {
    updateServerStats();
    setInterval(updateServerStats, 30000); // Her 30 saniyede bir güncelle
});
