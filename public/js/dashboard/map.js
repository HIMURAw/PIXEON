// FiveM Map JavaScript
class FiveMMap {
    constructor() {
        this.canvas = document.getElementById('fivemMap');
        if (!this.canvas) {
            console.error('Canvas elementi bulunamadı!');
            return;
        }
        
        this.ctx = this.canvas.getContext('2d');
        if (!this.ctx) {
            console.error('Canvas context alınamadı!');
            return;
        }
        
        this.players = [];
        this.markers = [];
        this.isFullscreen = false;
        
        // Sadece Pan özellikleri
        this.panX = 0;
        this.panY = 0;
        this.isDragging = false;
        this.lastMouseX = 0;
        this.lastMouseY = 0;
        
        // Harita görseli
        this.mapImage = null;
        this.mapImageLoaded = false;
        
        this.init();
    }

    init() {
        this.setupCanvas();
        this.setupEventListeners();
        this.loadMapImage();
        this.loadPlayers();
        this.startAutoRefresh();
    }

    setupCanvas() {
        // Canvas boyutunu container'a göre ayarla
        const container = this.canvas.parentElement;
        
        // Container görünür değilse sabit boyutlar kullan
        if (container.style.display === 'none' || container.offsetWidth === 0) {
            this.canvas.width = 800;
            this.canvas.height = 600;
        } else {
            const rect = container.getBoundingClientRect();
            
            // Canvas boyutunu ayarla
            this.canvas.width = rect.width || 800;
            this.canvas.height = rect.height || 600;
        }
        
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

        // Reset view butonu
        const resetViewBtn = document.getElementById('resetViewBtn');
        if (resetViewBtn) {
            resetViewBtn.addEventListener('click', () => {
                this.resetView();
            });
        }

        // Mouse drag ile pan
        this.canvas.addEventListener('mousedown', (e) => {
            this.isDragging = true;
            this.lastMouseX = e.clientX;
            this.lastMouseY = e.clientY;
            this.canvas.style.cursor = 'grabbing';
        });

        this.canvas.addEventListener('mousemove', (e) => {
            if (this.isDragging) {
                const deltaX = e.clientX - this.lastMouseX;
                const deltaY = e.clientY - this.lastMouseY;
                
                this.panX += deltaX;
                this.panY += deltaY;
                
                this.lastMouseX = e.clientX;
                this.lastMouseY = e.clientY;
                
                this.drawMap();
            }
        });

        this.canvas.addEventListener('mouseup', () => {
            this.isDragging = false;
            this.canvas.style.cursor = 'grab';
        });

        this.canvas.addEventListener('mouseleave', () => {
            this.isDragging = false;
            this.canvas.style.cursor = 'grab';
        });

        // Canvas yeniden boyutlandırma
        window.addEventListener('resize', () => {
            this.setupCanvas();
            this.drawMap();
        });
    }

    resetView() {
        this.panX = 0;
        this.panY = 0;
        this.drawMap();
    }

    async loadPlayers() {
        try {
            console.log('Oyuncu pozisyonları yükleniyor...');
            const response = await fetch('/api/fivem/positions');
            console.log('API Response:', response);
            
            if (!response.ok) throw new Error('Oyuncu pozisyonları alınamadı');
            
            this.players = await response.json();
            console.log('Yüklenen oyuncular:', this.players);
            
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

    loadMapImage() {
        this.mapImage = new Image();
        this.mapImage.crossOrigin = 'anonymous';
        
        this.mapImage.onload = () => {
            this.mapImageLoaded = true;
            this.drawMap();
        };
        
        this.mapImage.onerror = () => {
            this.mapImageLoaded = false;
            this.drawMap();
        };
        
        // Harita görselini yükle
        this.mapImage.src = '/assets/gta5-map.jpeg';
    }

    drawMapBackground() {
        // Canvas boyutları 0 ise çizim yapma
        if (this.canvas.width === 0 || this.canvas.height === 0) {
            return;
        }
        
        // Canvas'ı temizle
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Transform'u kaydet
        this.ctx.save();
        
        // Pan uygula
        this.ctx.translate(this.panX, this.panY);
        
        if (this.mapImageLoaded && this.mapImage) {
            // Harita görselini canvas'a çiz (aspect ratio koruyarak)
            const aspectRatio = this.mapImage.width / this.mapImage.height;
            const canvasAspectRatio = this.canvas.width / this.canvas.height;
            
            let drawWidth, drawHeight, offsetX, offsetY;
            
            if (aspectRatio > canvasAspectRatio) {
                // Görsel daha geniş, yüksekliğe göre ölçekle
                drawHeight = this.canvas.height * 0.6; // %60 boyut
                drawWidth = drawHeight * aspectRatio;
                offsetX = (this.canvas.width - drawWidth) / 2;
                offsetY = (this.canvas.height - drawHeight) / 2;
            } else {
                // Görsel daha yüksek, genişliğe göre ölçekle
                drawWidth = this.canvas.width * 0.6; // %60 boyut
                drawHeight = drawWidth / aspectRatio;
                offsetX = (this.canvas.width - drawWidth) / 2;
                offsetY = (this.canvas.height - drawHeight) / 2;
            }
            
            this.ctx.drawImage(this.mapImage, offsetX, offsetY, drawWidth, drawHeight);
        } else {
            // Görsel yüklenemezse gradient kullan
            this.drawGradientBackground();
        }
        
        // Transform'u geri yükle
        this.ctx.restore();
        
        this.drawGrid();
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
        // Transform'u kaydet
        this.ctx.save();
        
        // Pan uygula
        this.ctx.translate(this.panX, this.panY);
        
        // Grid çizgileri - daha geniş alana çiz
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        this.ctx.lineWidth = 1;
        
        // Grid alanını genişlet (canvas boyutunun 3 katı)
        const gridWidth = this.canvas.width * 3;
        const gridHeight = this.canvas.height * 3;
        const startX = -gridWidth / 2;
        const startY = -gridHeight / 2;
        
        for (let x = startX; x < startX + gridWidth; x += 50) {
            this.ctx.beginPath();
            this.ctx.moveTo(x, startY);
            this.ctx.lineTo(x, startY + gridHeight);
            this.ctx.stroke();
        }
        
        for (let y = startY; y < startY + gridHeight; y += 50) {
            this.ctx.beginPath();
            this.ctx.moveTo(startX, y);
            this.ctx.lineTo(startX + gridWidth, y);
            this.ctx.stroke();
        }
        
        // Transform'u geri yükle
        this.ctx.restore();
    }

    drawMap() {
        this.drawMapBackground();
        this.drawPlayers();
    }

    drawPlayers() {
        console.log('Oyuncular çiziliyor, toplam:', this.players.length);
        
        // Transform'u kaydet
        this.ctx.save();
        
        // Pan uygula
        this.ctx.translate(this.panX, this.panY);
        
        this.players.forEach((player, index) => {
            // GTA 5 koordinatlarını canvas koordinatlarına çevir
            const canvasX = this.mapCoordinateToCanvas(player.x, 'x');
            const canvasY = this.mapCoordinateToCanvas(player.y, 'y');
            
            console.log(`Oyuncu ${index + 1}:`, {
                name: player.name,
                x: player.x,
                y: player.y,
                canvasX: canvasX,
                canvasY: canvasY
            });
            
            // Oyuncu marker'ını çiz
            this.drawPlayerMarker(canvasX, canvasY, player);
        });
        
        // Transform'u geri yükle
        this.ctx.restore();
    }

    mapCoordinateToCanvas(coord, axis) {
        // GTA 5 koordinat aralığı: -4000 ile 4000 arası (daha geniş)
        const gtaRange = 8000; // -4000 to 4000
        const canvasSize = axis === 'x' ? this.canvas.width : this.canvas.height;
        
        // Harita görselinin boyutlarına göre offset hesapla
        const mapScale = 0.6; // Harita %60 boyutunda
        const mapSize = axis === 'x' ? this.canvas.width * mapScale : this.canvas.height * mapScale;
        const offset = (canvasSize - mapSize) / 2;
        
        // Koordinatı 0-1 aralığına normalize et
        const normalized = (coord + 4000) / gtaRange;
        
        // Y koordinatını ters çevir ve aşağı kaydır
        let adjustedNormalized = normalized;
        if (axis === 'y') {
            adjustedNormalized = 1 - normalized;
            // Y koordinatını biraz aşağı kaydır
            adjustedNormalized += 0.4; // %10 aşağı kaydır
        } else if (axis === 'x') {
            // X koordinatını sol tarafa kaydır
            adjustedNormalized -= 0.05; // %20 sol tarafa kaydır
        }
        
        // Canvas koordinatına çevir (harita alanı içinde)
        const result = offset + (adjustedNormalized * mapSize);
        
        console.log(`Koordinat çevirisi (${axis}):`, {
            original: coord,
            normalized: normalized,
            adjustedNormalized: adjustedNormalized,
            canvasSize: canvasSize,
            mapSize: mapSize,
            offset: offset,
            result: result
        });
        
        return result;
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
    // Haritayı hemen başlat (test için)
    try {
        window.fivemMap = new FiveMMap();
    } catch (error) {
        console.error('FiveMMap başlatılırken hata:', error);
    }
    
    // Map content görünür olduğunda haritayı başlat
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
                const mapContent = document.querySelector('.map-content');
                if (mapContent && mapContent.style.display !== 'none') {
                    // Canvas'ı yeniden boyutlandır
                    setTimeout(() => {
                        if (window.fivemMap) {
                            window.fivemMap.setupCanvas();
                            window.fivemMap.drawMap();
                        } else {
                            try {
                                window.fivemMap = new FiveMMap();
                            } catch (error) {
                                console.error('FiveMMap başlatılırken hata:', error);
                            }
                        }
                    }, 100);
                }
            }
        });
    });

    const mapContent = document.querySelector('.map-content');
    if (mapContent) {
        observer.observe(mapContent, { attributes: true });
    } else {
        console.error('Map content bulunamadı!');
    }
}); 

