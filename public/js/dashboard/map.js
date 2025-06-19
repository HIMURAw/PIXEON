// FiveM Map JavaScript
class FiveMMap {
    constructor() {
        this.canvas = document.getElementById('fivemMap');
        this.ctx = this.canvas.getContext('2d');
        this.players = [];
        this.markers = [];
        this.isFullscreen = false;
        
        this.init();
    }

    init() {
        this.setupCanvas();
        this.setupEventListeners();
        this.loadPlayers();
        this.startAutoRefresh();
    }

    setupCanvas() {
        // Canvas boyutunu container'a göre ayarla
        const container = this.canvas.parentElement;
        const rect = container.getBoundingClientRect();
        
        // Canvas boyutunu ayarla
        this.canvas.width = rect.width;
        this.canvas.height = rect.height;
        
        console.log('Canvas boyutları:', this.canvas.width, 'x', this.canvas.height);
        
        // Harita arka planını çiz
        this.drawMapBackground();
    }

    setupEventListeners() {
        // Yenile butonu
        const refreshBtn = document.getElementById('refreshMapBtn');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => {
                this.loadPlayers();
            });
        }

        // Tam ekran butonu
        const fullscreenBtn = document.getElementById('fullscreenMapBtn');
        if (fullscreenBtn) {
            fullscreenBtn.addEventListener('click', () => {
                this.toggleFullscreen();
            });
        }

        // Canvas yeniden boyutlandırma
        window.addEventListener('resize', () => {
            this.setupCanvas();
            this.drawMap();
        });
    }

    async loadPlayers() {
        try {
            const response = await fetch('/api/fivem/positions');
            if (!response.ok) throw new Error('Oyuncu pozisyonları alınamadı');
            
            this.players = await response.json();
            this.updatePlayerList();
            this.drawMap();
            
            // Online oyuncu sayısını güncelle
            const playerCount = document.getElementById('onlinePlayerCount');
            if (playerCount) {
                playerCount.textContent = this.players.length;
            }
        } catch (error) {
            console.error('Oyuncu pozisyonları yüklenirken hata:', error);
            this.showError('Oyuncu pozisyonları yüklenemedi');
        }
    }

    updatePlayerList() {
        const container = document.getElementById('playerListContainer');
        if (!container) return;

        if (this.players.length === 0) {
            container.innerHTML = '<div class="no-players">Online oyuncu bulunamadı</div>';
            return;
        }

        container.innerHTML = this.players.map(player => `
            <div class="player-item-map" data-player-id="${player.id}">
                <div class="player-avatar-map">
                    ${player.name.charAt(0).toUpperCase()}
                </div>
                <div class="player-info-map">
                    <div class="player-name-map">${player.name}</div>
                    <div class="player-id-map">ID: ${player.id}</div>
                    <div class="player-location-map">
                        X: ${Math.round(player.x)}, Y: ${Math.round(player.y)}
                    </div>
                </div>
            </div>
        `).join('');

        // Oyuncu item'larına tıklama olayı ekle
        container.querySelectorAll('.player-item-map').forEach(item => {
            item.addEventListener('click', () => {
                const playerId = item.dataset.playerId;
                this.highlightPlayer(playerId);
            });
        });
    }

    drawMapBackground() {
        // Test çizimi - canvas'ın çalıştığını doğrula
        this.ctx.fillStyle = 'red';
        this.ctx.fillRect(0, 0, 100, 100);
        console.log('Test çizimi yapıldı - kırmızı kare');
        
        // GTA 5 harita görselini yükle
        const mapImage = new Image();
        
        console.log('Harita görseli yükleniyor...');
        console.log('Canvas boyutları:', this.canvas.width, 'x', this.canvas.height);
        
        // Cross-origin ayarı
        mapImage.crossOrigin = 'anonymous';
        
        mapImage.onload = () => {
            console.log('Harita görseli başarıyla yüklendi!');
            console.log('Görsel boyutları:', mapImage.width, 'x', mapImage.height);
            
            // Canvas'ı temizle
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            
            // Harita görselini canvas'a çiz (aspect ratio koruyarak)
            const aspectRatio = mapImage.width / mapImage.height;
            const canvasAspectRatio = this.canvas.width / this.canvas.height;
            
            let drawWidth, drawHeight, offsetX, offsetY;
            
            if (aspectRatio > canvasAspectRatio) {
                // Görsel daha geniş, yüksekliğe göre ölçekle
                drawHeight = this.canvas.height;
                drawWidth = drawHeight * aspectRatio;
                offsetX = (this.canvas.width - drawWidth) / 2;
                offsetY = 0;
            } else {
                // Görsel daha yüksek, genişliğe göre ölçekle
                drawWidth = this.canvas.width;
                drawHeight = drawWidth / aspectRatio;
                offsetX = 0;
                offsetY = (this.canvas.height - drawHeight) / 2;
            }
            
            console.log('Çizim boyutları:', drawWidth, 'x', drawHeight);
            console.log('Offset:', offsetX, offsetY);
            
            this.ctx.drawImage(mapImage, offsetX, offsetY, drawWidth, drawHeight);
            this.drawGrid();
        };
        
        mapImage.onerror = (error) => {
            console.error('Harita görseli yüklenemedi:', error);
            console.log('Gradient arka plan kullanılıyor...');
            // Görsel yüklenemezse gradient kullan
            this.drawGradientBackground();
            this.drawGrid();
        };
        
        // Harita görselini yükle (public/assets klasöründen)
        const imagePath = '/assets/gta-5-map.jpg';
        console.log('Görsel yolu:', imagePath);
        
        // Farklı yükleme yöntemi
        setTimeout(() => {
            mapImage.src = imagePath;
        }, 100);
    }

    drawGradientBackground() {
        // GTA 5 haritası benzeri gradient arka plan (fallback)
        const gradient = this.ctx.createLinearGradient(0, 0, this.canvas.width, this.canvas.height);
        gradient.addColorStop(0, '#2d5016'); // Yeşil (orman)
        gradient.addColorStop(0.3, '#8b4513'); // Kahverengi (dağ)
        gradient.addColorStop(0.7, '#87ceeb'); // Mavi (deniz)
        gradient.addColorStop(1, '#f4a460'); // Kum rengi (sahil)

        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    drawGrid() {
        // Grid çizgileri
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        this.ctx.lineWidth = 1;
        
        for (let x = 0; x < this.canvas.width; x += 50) {
            this.ctx.beginPath();
            this.ctx.moveTo(x, 0);
            this.ctx.lineTo(x, this.canvas.height);
            this.ctx.stroke();
        }
        
        for (let y = 0; y < this.canvas.height; y += 50) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, y);
            this.ctx.lineTo(this.canvas.width, y);
            this.ctx.stroke();
        }
    }

    drawMap() {
        this.drawMapBackground();
        this.drawPlayers();
    }

    drawPlayers() {
        this.players.forEach(player => {
            // GTA 5 koordinatlarını canvas koordinatlarına çevir
            const canvasX = this.mapCoordinateToCanvas(player.x, 'x');
            const canvasY = this.mapCoordinateToCanvas(player.y, 'y');
            
            // Oyuncu marker'ını çiz
            this.drawPlayerMarker(canvasX, canvasY, player);
        });
    }

    mapCoordinateToCanvas(coord, axis) {
        // GTA 5 koordinat aralığı: -4000 ile 4000 arası
        const gtaRange = 8000; // -4000 to 4000
        const canvasSize = axis === 'x' ? this.canvas.width : this.canvas.height;
        
        // Koordinatı 0-1 aralığına normalize et
        const normalized = (coord + 4000) / gtaRange;
        
        // Canvas koordinatına çevir
        return normalized * canvasSize;
    }

    drawPlayerMarker(x, y, player) {
        // Marker arka planı
        this.ctx.beginPath();
        this.ctx.arc(x, y, 8, 0, 2 * Math.PI);
        this.ctx.fillStyle = '#007bff';
        this.ctx.fill();
        
        // Marker kenarlığı
        this.ctx.strokeStyle = 'white';
        this.ctx.lineWidth = 2;
        this.ctx.stroke();
        
        // Oyuncu adı
        this.ctx.fillStyle = 'white';
        this.ctx.font = '12px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(player.name, x, y - 15);
    }

    highlightPlayer(playerId) {
        // Tüm marker'ları normal haline getir
        this.players.forEach(player => {
            player.highlighted = false;
        });
        
        // Seçili oyuncuyu vurgula
        const selectedPlayer = this.players.find(p => p.id == playerId);
        if (selectedPlayer) {
            selectedPlayer.highlighted = true;
        }
        
        this.drawMap();
    }

    toggleFullscreen() {
        const mapContainer = document.querySelector('.map-container');
        
        if (!this.isFullscreen) {
            mapContainer.style.position = 'fixed';
            mapContainer.style.top = '0';
            mapContainer.style.left = '0';
            mapContainer.style.width = '100vw';
            mapContainer.style.height = '100vh';
            mapContainer.style.zIndex = '9999';
            mapContainer.style.background = '#1e1e1e';
            mapContainer.style.padding = '20px';
            
            document.getElementById('fullscreenMapBtn').innerHTML = '<i class="fas fa-compress"></i>';
        } else {
            mapContainer.style.position = '';
            mapContainer.style.top = '';
            mapContainer.style.left = '';
            mapContainer.style.width = '';
            mapContainer.style.height = '';
            mapContainer.style.zIndex = '';
            mapContainer.style.background = '';
            mapContainer.style.padding = '';
            
            document.getElementById('fullscreenMapBtn').innerHTML = '<i class="fas fa-expand"></i>';
        }
        
        this.isFullscreen = !this.isFullscreen;
        this.setupCanvas();
        this.drawMap();
    }

    startAutoRefresh() {
        // Her 30 saniyede bir oyuncu pozisyonlarını güncelle
        setInterval(() => {
            this.loadPlayers();
        }, 30000);
    }

    showError(message) {
        const container = document.getElementById('playerListContainer');
        if (container) {
            container.innerHTML = `<div class="error-message">${message}</div>`;
        }
    }
}

// Sayfa yüklendiğinde haritayı başlat
document.addEventListener('DOMContentLoaded', () => {
    // Map content görünür olduğunda haritayı başlat
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
                const mapContent = document.querySelector('.map-content');
                if (mapContent && mapContent.style.display !== 'none') {
                    if (!window.fivemMap) {
                        window.fivemMap = new FiveMMap();
                    }
                }
            }
        });
    });

    const mapContent = document.querySelector('.map-content');
    if (mapContent) {
        observer.observe(mapContent, { attributes: true });
    }
}); 

