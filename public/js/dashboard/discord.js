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
        const channelsResponse = await fetch('/api/discordChannel/channels');
        const channelsData = await channelsResponse.json();

        // Duyuru mesajlarını al
        const announcementsResponse = await fetch('/api/discordChannel/announcements');
        const announcementsData = await announcementsResponse.json();

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

        // Mesajları listele
        const messagesList = document.querySelector('.messages-list');
        if (messagesList && announcementsData && announcementsData.messages) {
            messagesList.innerHTML = ''; // Mevcut içeriği temizle

            announcementsData.messages.forEach(message => {
                const messageDiv = document.createElement('div');
                messageDiv.className = 'message-item';

                // Mesaj içeriğini formatla
                let messageContent = message.content;
                if (message.embeds && message.embeds.length > 0) {
                    message.embeds.forEach(embed => {
                        if (embed.title) messageContent += `\n**${embed.title}**`;
                        if (embed.description) messageContent += `\n${embed.description}`;
                    });
                }

                messageDiv.innerHTML = `
                    <div class="message-header">
                        <img src="${message.author.avatar}" alt="${message.author.username}" class="message-avatar">
                        <div class="message-info">
                            <span class="message-author">${message.author.username}</span>
                            <span class="message-timestamp">${new Date(message.timestamp).toLocaleString('tr-TR')}</span>
                        </div>
                    </div>
                    <div class="message-content">${messageContent}</div>
                    ${message.attachments.length > 0 ? `
                        <div class="message-attachments">
                            ${message.attachments.map(attachment => `
                                <a href="${attachment.url}" target="_blank" class="attachment-link">
                                    <i class="fas fa-paperclip"></i> ${attachment.name}
                                </a>
                            `).join('')}
                        </div>
                    ` : ''}
                `;

                messagesList.appendChild(messageDiv);
            });
        } else {
            console.error('Announcements data is not available');
            if (messagesList) {
                messagesList.innerHTML = '<div class="loading-spinner">Loading messages...</div>';
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
        memberElement.addEventListener('click', function () {
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
document.querySelector('.close-modal').addEventListener('click', function () {
    document.getElementById('memberModal').style.display = 'none';
});

// Modal dışına tıklayınca kapatma
window.addEventListener('click', function (e) {
    const modal = document.getElementById('memberModal');
    if (e.target === modal) {
        modal.style.display = 'none';
    }
});

// Moderation Panel Functions
async function searchUser() {
    const searchInput = document.getElementById('userSearch').value;
    if (!searchInput) return;

    try {
        const response = await fetch(`/api/discordUsers/search?query=${encodeURIComponent(searchInput)}`);
        const data = await response.json();

        if (data.error) {
            showNotification(data.error, 'error');
            return;
        }

        // Kullanıcı bilgilerini göster
        showUserDetails(data);
    } catch (error) {
        console.error('Error searching user:', error);
        showNotification('Kullanıcı aranırken bir hata oluştu', 'error');
    }
}

async function warnUser() {
    const userId = document.getElementById('userSearch').value;
    if (!userId) {
        showNotification('Lütfen bir kullanıcı seçin', 'error');
        return;
    }

    try {
        const response = await fetch('/api/discordUsers/warn', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ userId })
        });
        const data = await response.json();

        if (data.error) {
            showNotification(data.error, 'error');
            return;
        }

        showNotification('Kullanıcı uyarıldı', 'success');
        refreshUserHistory();
    } catch (error) {
        console.error('Error warning user:', error);
        showNotification('İşlem sırasında bir hata oluştu', 'error');
    }
}

async function kickUser() {
    const userId = document.getElementById('userSearch').value;
    if (!userId) {
        showNotification('Lütfen bir kullanıcı seçin', 'error');
        return;
    }

    try {
        const response = await fetch('/api/discordUsers/kick', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ userId })
        });
        const data = await response.json();

        if (data.error) {
            showNotification(data.error, 'error');
            return;
        }

        showNotification('Kullanıcı sunucudan atıldı', 'success');
        refreshUserHistory();
    } catch (error) {
        console.error('Error kicking user:', error);
        showNotification('İşlem sırasında bir hata oluştu', 'error');
    }
}

async function banUser() {
    const userId = document.getElementById('userSearch').value;
    if (!userId) {
        showNotification('Lütfen bir kullanıcı seçin', 'error');
        return;
    }

    try {
        const response = await fetch('/api/discordUsers/ban', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ userId })
        });
        const data = await response.json();

        if (data.error) {
            showNotification(data.error, 'error');
            return;
        }

        showNotification('Kullanıcı yasaklandı', 'success');
        refreshUserHistory();
    } catch (error) {
        console.error('Error banning user:', error);
        showNotification('İşlem sırasında bir hata oluştu', 'error');
    }
}

async function unbanUser() {
    const userId = document.getElementById('userSearch').value;
    if (!userId) {
        showNotification('Lütfen bir kullanıcı seçin', 'error');
        return;
    }

    try {
        const response = await fetch('/api/discordUsers/unban', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ userId })
        });
        const data = await response.json();

        if (data.error) {
            showNotification(data.error, 'error');
            return;
        }

        showNotification('Kullanıcının yasağı kaldırıldı', 'success');
        refreshUserHistory();
    } catch (error) {
        console.error('Error unbanning user:', error);
        showNotification('İşlem sırasında bir hata oluştu', 'error');
    }
}

// User History Functions
async function refreshUserHistory() {
    const historyType = document.getElementById('historyType').value;
    const historyDate = document.getElementById('historyDate').value;

    try {
        const response = await fetch(`/api/discordUsers/history?type=${historyType}&date=${historyDate}`);
        const data = await response.json();

        if (data.error) {
            showNotification(data.error, 'error');
            return;
        }

        const historyList = document.querySelector('.history-list');
        historyList.innerHTML = '';

        data.history.forEach(item => {
            const historyItem = document.createElement('div');
            historyItem.className = 'history-item';
            historyItem.innerHTML = `
                <div class="history-info">
                    <span class="history-user">${item.user.username}</span>
                    <span class="history-action">${item.action}</span>
                </div>
                <span class="history-timestamp">${new Date(item.timestamp).toLocaleString('tr-TR')}</span>
            `;
            historyList.appendChild(historyItem);
        });
    } catch (error) {
        console.error('Error fetching history:', error);
        showNotification('Geçmiş yüklenirken bir hata oluştu', 'error');
    }
}

// Server Activity Functions
let activityChart;

async function refreshServerActivity() {
    try {
        const response = await fetch('/api/discordServer/activity');
        const data = await response.json();

        if (data.error) {
            showNotification(data.error, 'error');
            return;
        }

        // Metrikleri güncelle
        document.getElementById('activeUsers').textContent = data.activeUsers;
        document.getElementById('voiceChannelUsage').textContent = `${data.voiceChannelUsage}%`;
        document.getElementById('messageActivity').textContent = data.messageActivity;

        // Grafiği güncelle
        updateActivityChart(data.activityData);
    } catch (error) {
        console.error('Error fetching server activity:', error);
        showNotification('Sunucu aktivitesi yüklenirken bir hata oluştu', 'success');
    }
}

function updateActivityChart(data) {
    const ctx = document.getElementById('activityChart').getContext('2d');

    if (activityChart) {
        activityChart.destroy();
    }

    activityChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: data.labels,
            datasets: [{
                label: 'Aktif Kullanıcılar',
                data: data.activeUsers,
                borderColor: '#7289da',
                tension: 0.4
            }, {
                label: 'Ses Kanalı Kullanımı',
                data: data.voiceChannelUsage,
                borderColor: '#43b581',
                tension: 0.4
            }, {
                label: 'Mesaj Aktivitesi',
                data: data.messageActivity,
                borderColor: '#faa61a',
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        color: '#fff'
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    },
                    ticks: {
                        color: '#fff'
                    }
                },
                x: {
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    },
                    ticks: {
                        color: '#fff'
                    }
                }
            }
        }
    });
}

// Utility Functions
function showUserDetails(user) {
    // Kullanıcı detaylarını göster
    const modal = document.getElementById('memberModal');
    modal.style.display = 'block';

    // Test bildirimi
    window.showNotification('Kullanıcı detayları açıldı', 'success');

    document.getElementById('modalAvatar').src = user.avatar || 'assets/default-avatar.png';
    document.getElementById('modalName').textContent = user.nickname || user.username;
    document.getElementById('modalUsername').textContent = `@${user.username}`;
    document.getElementById('modalJoinedAt').textContent = new Date(user.joinedAt).toLocaleString('tr-TR');
    document.getElementById('modalCreatedAt').textContent = new Date(user.user?.createdAt || user.joinedAt).toLocaleString('tr-TR');
    document.getElementById('modalActivity').textContent = user.activities?.length > 0 ? user.activities[0].name : 'Aktif değil';

    const rolesList = document.getElementById('modalRoles');
    rolesList.innerHTML = '';
    user.roles.forEach(role => {
        const roleTag = document.createElement('span');
        roleTag.className = 'role-tag';
        roleTag.style.backgroundColor = `#${role.color.toString(16).padStart(6, '0')}`;
        roleTag.textContent = role.name;
        rolesList.appendChild(roleTag);
    });
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    updateServerStats();
    refreshUserHistory();
    refreshServerActivity();

    setInterval(updateServerStats, 30000);
    setInterval(refreshUserHistory, 60000);
    setInterval(refreshServerActivity, 60000);
});

// Banlı kullanıcıları yükle
async function loadBannedUsers() {
    const bannedUsersList = document.getElementById('bannedUsersList');
    bannedUsersList.innerHTML = `
        <div class="loading-spinner">
            <i class="fas fa-spinner fa-spin"></i>
            <span>Banlı kullanıcılar yükleniyor...</span>
        </div>
    `;

    try {
        const response = await fetch('/api/discordUsers/bannedUsers');
        let data;

        // Response'un text olarak alıp JSON'a çevirelim
        const text = await response.text();
        try {
            data = JSON.parse(text);
        } catch (e) {
            console.error('API yanıtı JSON formatında değil:', text);
            throw new Error('API yanıtı geçersiz format');
        }

        if (!response.ok) {
            throw new Error(data.error || 'Bilinmeyen bir hata oluştu');
        }

        if (!data.bannedUsers || data.bannedUsers.length === 0) {
            bannedUsersList.innerHTML = `
                <div class="no-banned-users">
                    <i class="fas fa-check-circle"></i>
                    <p>Banlı kullanıcı bulunmuyor</p>
                </div>
            `;
            return;
        }

        bannedUsersList.innerHTML = data.bannedUsers.map(ban => `
            <div class="banned-user-item">
                <img src="${ban.user.avatar}" alt="${ban.user.username}" class="banned-user-avatar">
                <div class="banned-user-info">
                    <div class="banned-user-name">${ban.user.username}</div>
                    <div class="banned-user-reason">${ban.reason}</div>
                    <div class="banned-user-date">
                        Ban Tarihi: ${new Date(ban.bannedAt).toLocaleString('tr-TR')}
                        ${ban.bannedBy ? ` • Banlayan: ${ban.bannedBy.username}` : ''}
                    </div>
                </div>
                <div class="banned-user-actions">
                    <button class="unban-btn" onclick="unbanUser('${ban.user.id}')" title="Banı Kaldır">
                        <i class="fas fa-unlock"></i>
                    </button>
                </div>
            </div>
        `).join('');

    } catch (error) {
        console.error('Banlı kullanıcılar yüklenirken hata:', error);
        bannedUsersList.innerHTML = `
            <div class="error-message">
                <i class="fas fa-exclamation-circle"></i>
                <p>${error.message}</p>
                <button onclick="refreshBannedUsers()" class="retry-btn">
                    <i class="fas fa-sync-alt"></i> Tekrar Dene
                </button>
            </div>
        `;
    }
}

// Banlı kullanıcıları yenile
function refreshBannedUsers() {
    loadBannedUsers();
}

// Sayfa yüklendiğinde banlı kullanıcıları yükle
document.addEventListener('DOMContentLoaded', () => {
    loadBannedUsers();
    // ... existing code ...
});

