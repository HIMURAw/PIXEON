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
            console.log('Server info loaded:', this.serverInfo);
            this.updateServerStats();
        } catch (error) {
            console.error('Server info yüklenirken hata:', error);
            // Server info yüklenemezse varsayılan değerler kullan
            this.serverInfo = {
                sv_maxclients: 100,
                uptime: 0
            };
            this.updateServerStats();
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

        // Max players (server info'dan al)
        const maxPlayers = document.getElementById('fivem-max-players');
        if (maxPlayers) {
            if (this.serverInfo && this.serverInfo.sv_maxclients) {
                maxPlayers.textContent = this.serverInfo.sv_maxclients;
            } else {
                maxPlayers.textContent = '100'; // Varsayılan değer
            }
        }

        // PD count (sadece polis job'ı olanlar)
        const serverLoad = document.getElementById('fivem-server-load');
        if (serverLoad) {
            const pdCount = this.players.filter(player => 
                player.job && player.job.name && 
                (player.job.name.toLowerCase() === 'police' || 
                 player.job.name.toLowerCase() === 'lspd' ||
                 player.job.name.toLowerCase() === 'bcso' ||
                 player.job.name.toLowerCase() === 'sasp')
            ).length;
            serverLoad.textContent = pdCount;
        }

        // Uptime (server info'dan al)
        const uptime = document.getElementById('fivem-uptime');
        if (uptime) {
            if (this.serverInfo && this.serverInfo.uptime) {
                uptime.textContent = this.formatUptime(this.serverInfo.uptime);
            } else {
                uptime.textContent = 'Bilinmiyor';
            }
        }
    }

    formatUptime(uptime) {
        if (!uptime) return 'Bilinmiyor';
        
        const hours = Math.floor(uptime / 3600);
        const days = Math.floor(hours / 24);
        
        if (days > 0) {
            return `${days}g ${hours % 24}s`;
        }
        return `${hours}s`;
    }

    formatLastUpdate(timestamp) {
        if (!timestamp) return 'Bilinmiyor';
        
        const now = Date.now();
        const diff = now - timestamp;
        
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const days = Math.floor(hours / 24);
        
        if (days > 0) {
            return `${days}g ${hours % 24}s önce`;
        }
        return `${hours}s önce`;
    }

    updatePlayersTable() {
        const tbody = document.getElementById('fivem-players-tbody');
        if (!tbody) return;

        if (this.players.length === 0) {
            tbody.innerHTML = '<tr><td colspan="8" class="no-data">Kayıtlı karakter bulunamadı</td></tr>';
            return;
        }

        tbody.innerHTML = this.players.map(player => `
            <tr>
                <td>${player.id}</td>
                <td>
                    <div class="player-info">
                        <span class="player-name">${player.name}</span>
                        <small class="player-citizenid">${player.citizenid}</small>
                        <small class="player-license">${player.license}</small>
                    </div>
                </td>
                <td>
                    <div class="character-info">
                        <span class="character-name">${player.charinfo.firstname || ''} ${player.charinfo.lastname || ''}</span>
                        <small class="character-phone">📞 ${player.charinfo.phone || 'N/A'}</small>
                        <small class="character-nationality">🌍 ${player.charinfo.nationality || 'N/A'}</small>
                    </div>
                </td>
                <td>
                    <div class="job-info">
                        <span class="job-name">${player.job.label || 'İşsiz'}</span>
                        <small class="job-grade">${player.job.grade?.name || ''}</small>
                        <small class="job-payment">💰 $${player.job.payment || 0}/saat</small>
                    </div>
                </td>
                <td>
                    <div class="gang-info">
                        <span class="gang-name">${player.gang.label || 'Gang Yok'}</span>
                        <small class="gang-grade">${player.gang.grade?.name || ''}</small>
                    </div>
                </td>
                <td>
                    <div class="money-info">
                        <span class="money-cash">💵 $${player.money.cash || 0}</span>
                        <small class="money-bank">🏦 $${player.money.bank || 0}</small>
                        <small class="money-crypto">₿ ${player.money.crypto || 0}</small>
                    </div>
                </td>
                <td>
                    <div class="status-info">
                        <span class="status-hunger">🍽️ ${Math.round(player.metadata.hunger || 0)}%</span>
                        <small class="status-thirst">💧 ${Math.round(player.metadata.thirst || 0)}%</small>
                        <small class="status-armor">🛡️ ${player.metadata.armor || 0}</small>
                    </div>
                </td>
                <td>
                    <div class="player-actions">
                        <button class="btn-action" title="Karakter Detayları" onclick="openCharacterModal(${JSON.stringify(player).replace(/"/g, '&quot;')})">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="btn-action" title="Envanter" onclick="openInventoryModal(${JSON.stringify(player).replace(/"/g, '&quot;')})">
                            <i class="fas fa-box"></i>
                        </button>
                        <button class="btn-action" title="Konum" onclick="openLocationModal(${JSON.stringify(player).replace(/"/g, '&quot;')})">
                            <i class="fas fa-map-marker-alt"></i>
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

    showInventory(characterId) {
        const character = this.players.find(p => p.id === characterId);
        if (!character) return;

        openInventoryModal(character);
    }

    showPosition(characterId) {
        const character = this.players.find(p => p.id === characterId);
        if (!character) return;

        const position = character.position;
        const details = `
=== KONUM BİLGİLERİ ===
👤 Karakter: ${character.name}
📍 X: ${position.x || 0}
📍 Y: ${position.y || 0}
📍 Z: ${position.z || 0}

🌍 Koordinatlar: ${position.x}, ${position.y}, ${position.z}
        `;

        alert(details);
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
            tbody.innerHTML = `<tr><td colspan="8" class="error-message">${message}</td></tr>`;
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

// Modal functions
function openCharacterModal(character) {
    const modal = document.getElementById('characterModal');
    
    // Fill modal with character data
    document.getElementById('modalCharacterName').textContent = character.charinfo?.firstname + ' ' + character.charinfo?.lastname || 'Bilinmiyor';
    document.getElementById('modalCitizenId').textContent = 'Citizen ID: ' + character.citizenid;
    
    // Personal Info
    document.getElementById('modalFullName').textContent = character.charinfo?.firstname + ' ' + character.charinfo?.lastname || 'Bilinmiyor';
    document.getElementById('modalPhone').textContent = character.charinfo?.phone || 'Bilinmiyor';
    document.getElementById('modalNationality').textContent = character.charinfo?.nationality || 'Bilinmiyor';
    document.getElementById('modalBirthdate').textContent = character.charinfo?.birthdate || 'Bilinmiyor';
    document.getElementById('modalGender').textContent = character.charinfo?.gender === 0 ? 'Erkek' : 'Kadın';
    
    // Job Info
    document.getElementById('modalJob').textContent = character.job?.label || 'İşsiz';
    document.getElementById('modalJobGrade').textContent = character.job?.grade?.name || 'Bilinmiyor';
    document.getElementById('modalJobPayment').textContent = character.job?.grade?.payment ? '$' + character.job.grade.payment.toLocaleString() : 'Bilinmiyor';
    document.getElementById('modalJobOnduty').textContent = character.job?.onduty ? 'Evet' : 'Hayır';
    
    // Gang Info
    document.getElementById('modalGang').textContent = character.gang?.label || 'Gangsiz';
    document.getElementById('modalGangGrade').textContent = character.gang?.grade?.name || 'Bilinmiyor';
    document.getElementById('modalGangBoss').textContent = character.gang?.isboss ? 'Evet' : 'Hayır';
    
    // Money Info
    document.getElementById('modalCash').textContent = '$' + (character.money?.cash || 0).toLocaleString();
    document.getElementById('modalBank').textContent = '$' + (character.money?.bank || 0).toLocaleString();
    document.getElementById('modalCrypto').textContent = (character.money?.crypto || 0).toLocaleString();
    
    // Status Info
    document.getElementById('modalHunger').textContent = (character.metadata?.hunger || 0) + '%';
    document.getElementById('modalThirst').textContent = (character.metadata?.thirst || 0) + '%';
    document.getElementById('modalArmor').textContent = (character.metadata?.armor || 0) + '%';
    document.getElementById('modalBloodtype').textContent = character.metadata?.bloodtype || 'Bilinmiyor';
    document.getElementById('modalStress').textContent = (character.metadata?.stress || 0) + '%';
    
    // Licenses
    const licenses = character.metadata?.licences || {};
    document.getElementById('modalDriverLicense').textContent = licenses.driver ? 'Var' : 'Yok';
    document.getElementById('modalWeaponLicense').textContent = licenses.weapon ? 'Var' : 'Yok';
    document.getElementById('modalBusinessLicense').textContent = licenses.business ? 'Var' : 'Yok';
    
    // Other Info
    document.getElementById('modalJail').textContent = character.metadata?.injail ? 'Evet' : 'Hayır';
    document.getElementById('modalHandcuffed').textContent = character.metadata?.ishandcuffed ? 'Evet' : 'Hayır';
    document.getElementById('modalDead').textContent = character.metadata?.isdead ? 'Evet' : 'Hayır';
    document.getElementById('modalWalletId').textContent = character.metadata?.walletid || 'Bilinmiyor';
    document.getElementById('modalFingerprint').textContent = character.metadata?.fingerprint || 'Bilinmiyor';
    
    // Last Updated
    const lastUpdated = new Date(character.lastupdated || Date.now());
    document.getElementById('modalLastUpdated').textContent = lastUpdated.toLocaleString('tr-TR');
    
    modal.style.display = 'block';
}

function closeCharacterModal() {
    const modal = document.getElementById('characterModal');
    modal.style.display = 'none';
}

function openInventoryModal(character) {
    const modal = document.getElementById('inventoryModal');
    
    // Fill modal header with character info
    document.getElementById('inventoryCharacterName').textContent = character.charinfo?.firstname + ' ' + character.charinfo?.lastname || 'Bilinmiyor';
    document.getElementById('inventoryCitizenId').textContent = 'Citizen ID: ' + character.citizenid;
    
    // Load inventory items
    loadInventoryItems(character.inventory || []);
    
    modal.style.display = 'block';
}

function closeInventoryModal() {
    const modal = document.getElementById('inventoryModal');
    modal.style.display = 'none';
}

function loadInventoryItems(inventory) {
    const grid = document.getElementById('inventoryGrid');
    const empty = document.getElementById('inventoryEmpty');
    const itemCount = document.getElementById('inventoryItemCount');
    const weightInfo = document.getElementById('inventoryWeight');
    
    if (!inventory || inventory.length === 0) {
        grid.style.display = 'none';
        empty.style.display = 'block';
        itemCount.textContent = '0';
        weightInfo.textContent = '0';
        return;
    }
    
    grid.style.display = 'grid';
    empty.style.display = 'none';
    
    // Calculate total weight
    let totalWeight = 0;
    inventory.forEach(item => {
        if (item.weight) {
            totalWeight += item.weight * (item.count || 1);
        }
    });
    
    itemCount.textContent = inventory.length;
    weightInfo.textContent = totalWeight.toFixed(2);
    
    // Generate item cards
    grid.innerHTML = inventory.map((item, index) => {
        const itemImage = getItemImage(item.name);
        const itemIcon = getItemIcon(item.name);
        const metadata = item.metadata || {};
        
        let metadataHtml = '';
        if (Object.keys(metadata).length > 0) {
            metadataHtml = '<div class="item-metadata">';
            Object.entries(metadata).forEach(([key, value]) => {
                if (value && value !== '' && value !== null && value !== undefined) {
                    metadataHtml += `<div class="metadata-item"><span class="metadata-label">${key}:</span> ${value}</div>`;
                }
            });
            metadataHtml += '</div>';
        }
        
        return `
            <div class="inventory-item" title="${item.name}">
                <div class="item-slot">${index + 1}</div>
                ${item.weight ? `<div class="item-weight">${item.weight}kg</div>` : ''}
                <div class="item-image">
                    ${itemImage ? `<img src="${itemImage}" alt="${item.name}" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';" />` : ''}
                    <i class="${itemIcon}" style="${itemImage ? 'display: none;' : ''}"></i>
                </div>
                <div class="item-name">${item.name}</div>
                <div class="item-count">x${item.count || 1}</div>
                ${metadataHtml}
            </div>
        `;
    }).join('');
}

function getItemImage(itemName) {
    // Küçük harfe çevir, boşlukları ve özel karakterleri kaldır
    const cleanName = itemName.toLowerCase().replace(/[^a-z0-9_]/g, '');
    // PNG olarak varsayalım
    return `/assets/images/${cleanName}.png`;
}

function getItemIcon(itemName) {
    // Item icon mapping for fallback
    const itemIcons = {
        // Weapons
        'weapon_': 'fas fa-gun',
        
        // Food & Drinks
        'sandwich': 'fas fa-hamburger',
        'water': 'fas fa-tint',
        'coffee': 'fas fa-coffee',
        'burger': 'fas fa-hamburger',
        'hotdog': 'fas fa-hotdog',
        'taco': 'fas fa-taco',
        'pizza': 'fas fa-pizza-slice',
        
        // Medical
        'bandage': 'fas fa-band-aid',
        'painkillers': 'fas fa-pills',
        'medkit': 'fas fa-first-aid',
        
        // Tools
        'lockpick': 'fas fa-key',
        'screwdriverset': 'fas fa-screwdriver',
        'toolbox': 'fas fa-tools',
        
        // Materials
        'metalscrap': 'fas fa-cube',
        'copper': 'fas fa-circle',
        'aluminum': 'fas fa-circle',
        'iron': 'fas fa-circle',
        'rubber': 'fas fa-circle',
        'glass': 'fas fa-circle',
        
        // Electronics
        'phone': 'fas fa-mobile-alt',
        'laptop': 'fas fa-laptop',
        'tablet': 'fas fa-tablet-alt',
        
        // Clothing
        'clothing': 'fas fa-tshirt',
        'shoes': 'fas fa-shoe-prints',
        'hat': 'fas fa-hat-cowboy',
        
        // Drugs
        'weed': 'fas fa-leaf',
        'cokebaggy': 'fas fa-pills',
        'meth': 'fas fa-pills',
        
        // Money
        'money': 'fas fa-dollar-sign',
        'cryptostick': 'fas fa-bitcoin',
        
        // Default
        'default': 'fas fa-box'
    };
    
    // Check for weapon prefix
    if (itemName.startsWith('weapon_')) {
        return itemIcons['weapon_'];
    }
    
    // Check for clothing prefix
    if (itemName.includes('clothing')) {
        return itemIcons['clothing'];
    }
    
    // Return specific icon or default
    return itemIcons[itemName] || itemIcons['default'];
}

function openLocationModal(character) {
    const modal = document.getElementById('locationModal');
    document.getElementById('locationCharacterName').textContent = character.charinfo?.firstname + ' ' + character.charinfo?.lastname || 'Bilinmiyor';
    document.getElementById('locationCitizenId').textContent = 'Citizen ID: ' + character.citizenid;
    const pos = character.position || {};
    document.getElementById('locationX').textContent = pos.x !== undefined ? pos.x : '0';
    document.getElementById('locationY').textContent = pos.y !== undefined ? pos.y : '0';
    document.getElementById('locationZ').textContent = pos.z !== undefined ? pos.z : '0';

    // Harita önizlemesi için marker'ı yerleştir (örnek, merkezde göster)
    const mapPreview = document.getElementById('locationMapPreview');
    mapPreview.innerHTML = '<span class="location-map-marker"><i class="fas fa-map-marker-alt"></i></span>';
    // İleride koordinata göre marker konumu ayarlanabilir

    modal.style.display = 'block';
}

function closeLocationModal() {
    document.getElementById('locationModal').style.display = 'none';
}

// Close modal when clicking outside
window.onclick = function(event) {
    const characterModal = document.getElementById('characterModal');
    const inventoryModal = document.getElementById('inventoryModal');
    
    if (event.target === characterModal) {
        characterModal.style.display = 'none';
    }
    
    if (event.target === inventoryModal) {
        inventoryModal.style.display = 'none';
    }
} 