// FiveM Players Management
class FiveMPlayersManager {
    constructor() {
        this.players = [];
        this.serverInfo = {};
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadServerInfo();
        this.loadPlayers();
        this.startAutoRefresh();
    }

    setupEventListeners() {
        // Refresh buttons
        const refreshFivemPlayers = document.getElementById('refreshFivemPlayers');
        if (refreshFivemPlayers) {
            refreshFivemPlayers.addEventListener('click', () => {
                this.loadServerInfo();
                this.loadPlayers();
            });
        }

        const refreshPlayersList = document.getElementById('refreshPlayersList');
        if (refreshPlayersList) {
            refreshPlayersList.addEventListener('click', () => {
                this.loadPlayers();
            });
        }
    }

    async loadServerInfo() {
        try {
            const response = await fetch('/api/fivem/info');
            if (!response.ok) throw new Error('Server info alınamadı');
            
            this.serverInfo = await response.json();
            this.updateServerStats();
        } catch (error) {
            console.error('Server info yüklenirken hata:', error);
            this.showError('Server bilgileri yüklenemedi');
        }
    }

    async loadPlayers() {
        try {
            const response = await fetch('/api/fivem/characters');
            if (!response.ok) throw new Error('Karakter listesi alınamadı');
            
            const charactersData = await response.json();
            this.players = this.parseCharactersData(charactersData);
            this.updatePlayersTable();
            this.updatePlayerCount();
        } catch (error) {
            console.error('Karakter listesi yüklenirken hata:', error);
            this.showError('Karakter listesi yüklenemedi');
        }
    }

    parseCharactersData(charactersData) {
        return charactersData.map(character => {
            try {
                // JSON string'leri parse et
                const money = JSON.parse(character.money || '{}');
                const charinfo = JSON.parse(character.charinfo || '{}');
                const job = JSON.parse(character.job || '{}');
                const gang = JSON.parse(character.gang || '{}');
                const position = JSON.parse(character.position || '{}');
                const metadata = JSON.parse(character.metadata || '{}');
                const inventory = character.inventory ? JSON.parse(character.inventory) : [];

                return {
                    id: character.id,
                    name: character.name,
                    citizenid: character.citizenid,
                    license: character.license,
                    money: money,
                    charinfo: charinfo,
                    job: job,
                    gang: gang,
                    position: position,
                    metadata: metadata,
                    inventory: inventory,
                    last_updated: character.last_updated
                };
            } catch (parseError) {
                console.error('Karakter verisi parse edilirken hata:', parseError, character);
                return null;
            }
        }).filter(character => character !== null);
    }

    updateServerStats() {
        // Total characters count
        const onlineCount = document.getElementById('fivem-online-count');
        if (onlineCount) {
            onlineCount.textContent = this.players.length;
        }

        // Max players (sabit değer)
        const maxPlayers = document.getElementById('fivem-max-players');
        if (maxPlayers) {
            maxPlayers.textContent = '100'; // Varsayılan değer
        }

        // Server load (karakter sayısına göre)
        const serverLoad = document.getElementById('fivem-server-load');
        if (serverLoad) {
            const load = Math.round((this.players.length / 100) * 100);
            serverLoad.textContent = `${load}%`;
        }

        // Uptime (son güncelleme zamanından hesapla)
        const uptime = document.getElementById('fivem-uptime');
        if (uptime && this.players.length > 0) {
            const lastUpdate = Math.max(...this.players.map(p => p.last_updated));
            uptime.textContent = this.formatLastUpdate(lastUpdate);
        }
    }

    updatePlayersTable() {
        const tbody = document.getElementById('fivem-players-tbody');
        if (!tbody) return;

        if (this.players.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" class="no-data">Kayıtlı karakter bulunamadı</td></tr>';
            return;
        }

        tbody.innerHTML = this.players.map(player => `
            <tr>
                <td>${player.id}</td>
                <td>
                    <div class="player-info">
                        <span class="player-name">${player.name}</span>
                        <small class="player-citizenid">${player.citizenid}</small>
                    </div>
                </td>
                <td>
                    <div class="character-info">
                        <span class="character-name">${player.charinfo.firstname || ''} ${player.charinfo.lastname || ''}</span>
                        <small class="character-phone">${player.charinfo.phone || 'N/A'}</small>
                    </div>
                </td>
                <td>
                    <div class="job-info">
                        <span class="job-name">${player.job.label || 'İşsiz'}</span>
                        <small class="job-grade">${player.job.grade?.name || ''}</small>
                    </div>
                </td>
                <td>
                    <div class="money-info">
                        <span class="money-cash">$${player.money.cash || 0}</span>
                        <small class="money-bank">Bank: $${player.money.bank || 0}</small>
                    </div>
                </td>
                <td>
                    <div class="player-actions">
                        <button class="btn-action" title="Karakter Detayları" onclick="fivemPlayersManager.showCharacterDetails(${player.id})">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="btn-action" title="Envanter" onclick="fivemPlayersManager.showInventory(${player.id})">
                            <i class="fas fa-box"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
    }

    updatePlayerCount() {
        const onlineCount = document.getElementById('fivem-online-count');
        if (onlineCount) {
            onlineCount.textContent = this.players.length;
        }
    }

    formatLastUpdate(timestamp) {
        if (!timestamp) return 'Unknown';
        
        const now = Date.now();
        const diff = now - timestamp;
        
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const days = Math.floor(hours / 24);
        
        if (days > 0) {
            return `${days}g ${hours % 24}s önce`;
        }
        return `${hours}s önce`;
    }

    showCharacterDetails(characterId) {
        const character = this.players.find(p => p.id === characterId);
        if (!character) return;

        const details = `
            <h3>${character.name}</h3>
            <p><strong>Citizen ID:</strong> ${character.citizenid}</p>
            <p><strong>İsim:</strong> ${character.charinfo.firstname || ''} ${character.charinfo.lastname || ''}</p>
            <p><strong>Telefon:</strong> ${character.charinfo.phone || 'N/A'}</p>
            <p><strong>İş:</strong> ${character.job.label || 'İşsiz'}</p>
            <p><strong>Gang:</strong> ${character.gang.label || 'Gang Yok'}</p>
            <p><strong>Para:</strong> $${character.money.cash || 0} (Nakit) / $${character.money.bank || 0} (Banka)</p>
            <p><strong>Son Güncelleme:</strong> ${this.formatLastUpdate(character.last_updated)}</p>
        `;

        alert(details); // Geçici olarak alert kullanıyoruz, daha sonra modal yapabiliriz
    }

    showInventory(characterId) {
        const character = this.players.find(p => p.id === characterId);
        if (!character) return;

        const inventory = character.inventory || [];
        const items = inventory.map(item => `${item.name} (${item.count})`).join(', ');
        
        alert(`Envanter: ${items || 'Boş'}`);
    }

    async kickPlayer(playerId) {
        if (!confirm('Bu oyuncuyu kicklemek istediğinizden emin misiniz?')) return;
        
        try {
            const response = await fetch('/api/fivem/kick', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ playerId })
            });
            
            if (response.ok) {
                this.showNotification('Oyuncu başarıyla kicklendi', 'success');
                this.loadPlayers();
            } else {
                throw new Error('Kick işlemi başarısız');
            }
        } catch (error) {
            console.error('Kick işlemi hatası:', error);
            this.showNotification('Kick işlemi başarısız', 'error');
        }
    }

    async banPlayer(playerId) {
        const reason = prompt('Ban sebebini girin:');
        if (!reason) return;
        
        try {
            const response = await fetch('/api/fivem/ban', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ playerId, reason })
            });
            
            if (response.ok) {
                this.showNotification('Oyuncu başarıyla banlandı', 'success');
                this.loadPlayers();
            } else {
                throw new Error('Ban işlemi başarısız');
            }
        } catch (error) {
            console.error('Ban işlemi hatası:', error);
            this.showNotification('Ban işlemi başarısız', 'error');
        }
    }

    startAutoRefresh() {
        // Her 30 saniyede bir oyuncu listesini güncelle
        setInterval(() => {
            this.loadPlayers();
        }, 30000);
    }

    showError(message) {
        const tbody = document.getElementById('fivem-players-tbody');
        if (tbody) {
            tbody.innerHTML = `<tr><td colspan="6" class="error-message">${message}</td></tr>`;
        }
    }

    showNotification(message, type = 'info') {
        // Bildirim gösterme fonksiyonu
        if (typeof showNotification === 'function') {
            showNotification(message, type);
        } else {
            console.log(`${type.toUpperCase()}: ${message}`);
        }
    }
}

// Global instance
let fivemPlayersManager;

// Sayfa yüklendiğinde başlat
document.addEventListener('DOMContentLoaded', () => {
    fivemPlayersManager = new FiveMPlayersManager();
}); 