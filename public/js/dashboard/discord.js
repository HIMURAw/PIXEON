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

        // Üyeleri listele
        const membersList = document.querySelector('.members-list');
        if (membersList && membersData && membersData.members) {
            membersList.innerHTML = ''; // Mevcut içeriği temizle

            // Üyeleri rollerine göre sırala
            const sortedMembers = membersData.members.sort((a, b) => {
                // En yüksek rolü bul
                const aHighestRole = a.roles.length > 0 ? a.roles[0].position : 0;
                const bHighestRole = b.roles.length > 0 ? b.roles[0].position : 0;
                return bHighestRole - aHighestRole;
            });

            // Üyeleri göster
            sortedMembers.forEach(member => {
                const memberDiv = document.createElement('div');
                memberDiv.className = 'member-item';
                memberDiv.style.cursor = 'pointer';
                
                // En yüksek rolü bul
                const highestRole = member.roles.length > 0 ? member.roles[0] : null;
                const roleColor = highestRole ? highestRole.color : '#99aab5';

                memberDiv.innerHTML = `
                    <div class="member-avatar">
                        <img src="${member.avatar}" alt="${member.username}" onerror="this.src='assets/default-avatar.png'">
                        <span class="status-indicator ${member.status}"></span>
                    </div>
                    <div class="member-info">
                        <span class="member-name">${member.nickname || member.username}</span>
                        <span class="member-username">${member.username}</span>
                    </div>
                    <div class="member-role" style="color: ${roleColor}">
                        ${highestRole ? highestRole.name : 'No Role'}
                    </div>
                `;

                // Üye detayları modalını aç
                memberDiv.addEventListener('click', () => {
                    const modal = document.getElementById('memberModal');
                    modal.style.display = 'block';
                    
                    // Modal içeriğini doldur
                    document.getElementById('modalAvatar').src = member.avatar || 'assets/default-avatar.png';
                    document.getElementById('modalStatus').className = `status-indicator ${member.status}`;
                    document.getElementById('modalName').textContent = member.nickname || member.username;
                    document.getElementById('modalUsername').textContent = `@${member.username}`;
                    
                    // Tarihleri formatla
                    const joinedDate = new Date(member.joinedAt);
                    const createdDate = new Date(member.user?.createdAt || member.joinedAt);
                    
                    document.getElementById('modalJoinedAt').textContent = joinedDate.toLocaleDateString('tr-TR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                    });
                    
                    document.getElementById('modalCreatedAt').textContent = createdDate.toLocaleDateString('tr-TR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                    });

                    // Aktiviteleri göster
                    const activities = member.activities || [];
                    const activityText = activities.length > 0 
                        ? activities.map(activity => activity.name).join(', ')
                        : 'Aktif değil';
                    document.getElementById('modalActivity').textContent = activityText;

                    // Rolleri göster
                    const rolesList = document.getElementById('modalRoles');
                    rolesList.innerHTML = '';
                    member.roles.forEach(role => {
                        const roleTag = document.createElement('span');
                        roleTag.className = 'role-tag';
                        roleTag.style.backgroundColor = `#${role.color.toString(16).padStart(6, '0')}`;
                        roleTag.textContent = role.name;
                        rolesList.appendChild(roleTag);
                    });
                });

                membersList.appendChild(memberDiv);
            });
        } else {
            console.error('Members data is not available');
            if (membersList) {
                membersList.innerHTML = '<div class="loading-spinner">Loading members...</div>';
            }
        }

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
        const membersList = document.querySelector('.members-list');
        if (membersList) {
            membersList.innerHTML = '<div class="loading-spinner">Error loading members. Please try again.</div>';
        }
    }
}

// Sayfa yüklendiğinde ve her 30 saniyede bir güncelle
document.addEventListener('DOMContentLoaded', () => {
    updateServerStats();
    setInterval(updateServerStats, 30000); // Her 30 saniyede bir güncelle
});

// Modal functionality
const modal = document.getElementById('memberModal');
const closeModal = document.querySelector('.close-modal');

function updateMembersList(members) {
    const membersList = document.querySelector('.members-list');
    membersList.innerHTML = '';
    
    members.forEach(member => {
        const memberElement = document.createElement('div');
        memberElement.className = 'member-item';
        memberElement.style.cursor = 'pointer';
        
        memberElement.innerHTML = `
            <div class="member-avatar">
                <img src="${member.avatarURL || 'https://cdn.discordapp.com/embed/avatars/0.png'}" alt="${member.username}">
                <span class="status-indicator ${member.presence?.status || 'offline'}"></span>
            </div>
            <div class="member-info">
                <div class="member-name">${member.nickname || member.username}</div>
                <div class="member-username">@${member.username}</div>
            </div>
            <div class="member-role">${member.roles.highest?.name || 'Üye'}</div>
        `;
        
        // En basit tıklama olayı
        memberElement.addEventListener('click', function() {
            const modal = document.getElementById('memberModal');
            modal.style.display = 'block';
            
            // Modal içeriğini doldur
            document.getElementById('modalAvatar').src = member.avatarURL || 'https://cdn.discordapp.com/embed/avatars/0.png';
            document.getElementById('modalName').textContent = member.nickname || member.username;
            document.getElementById('modalUsername').textContent = `@${member.username}`;
            document.getElementById('modalJoinedAt').textContent = new Date(member.joinedAt).toLocaleDateString('tr-TR');
            document.getElementById('modalCreatedAt').textContent = new Date(member.user.createdAt).toLocaleDateString('tr-TR');
            document.getElementById('modalActivity').textContent = member.presence?.activities?.[0]?.name || 'Aktif değil';
        });
        
        membersList.appendChild(memberElement);
    });
}

// Modal kapatma butonu
document.querySelector('.close-modal').addEventListener('click', function() {
    document.getElementById('memberModal').style.display = 'none';
});

// Modal dışına tıklayınca kapatma
window.addEventListener('click', function(e) {
    const modal = document.getElementById('memberModal');
    if (e.target === modal) {
        modal.style.display = 'none';
    }
});

