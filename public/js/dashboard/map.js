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

        // Pan özellikleri
        this.panX = 0;
        this.panY = 0;
        this.isDragging = false;
        this.lastMouseX = 0;
        this.lastMouseY = 0;

        // Zoom özellikleri
        this.zoom = 1;
        this.minZoom = 0.5;
        this.maxZoom = 2.5;
        this.zoomStep = 0.1;

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

        // Mouse wheel ile zoom
        this.canvas.addEventListener('wheel', (e) => {
            e.preventDefault();
            const { offsetX, offsetY, deltaY } = e;
            let zoomDirection = deltaY < 0 ? 1 : -1;
            let newZoom = this.zoom + zoomDirection * this.zoomStep;
            newZoom = Math.max(this.minZoom, Math.min(this.maxZoom, newZoom));
            if (newZoom === this.zoom) return;

            // Zoom merkezini mouse konumuna göre ayarla
            const wx = (offsetX - this.panX) / this.zoom;
            const wy = (offsetY - this.panY) / this.zoom;
            this.panX -= wx * (newZoom - this.zoom);
            this.panY -= wy * (newZoom - this.zoom);

            this.zoom = newZoom;
            this.drawMap();
        }, { passive: false });

        // Canvas yeniden boyutlandırma
        window.addEventListener('resize', () => {
            this.setupCanvas();
            this.drawMap();
        });

        // Marker tıklama (canvas click)
        this.canvas.addEventListener('click', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            const mouseX = (e.clientX - rect.left - this.panX) / this.zoom;
            const mouseY = (e.clientY - rect.top - this.panY) / this.zoom;
            if (Array.isArray(this._markerHitboxes)) {
                for (const marker of this._markerHitboxes) {
                    const dx = mouseX - marker.x;
                    const dy = mouseY - marker.y;
                    if (Math.sqrt(dx * dx + dy * dy) <= marker.radius) {
                        this.showMapPlayerModal(marker.player);
                        break;
                    }
                }
            }
        });
        // Modal kapatma
        document.addEventListener('click', (e) => {
            if (e.target && e.target.id === 'closeMapPlayerModal') {
                this.closeMapPlayerModal();
            }
            if (e.target && e.target.id === 'mapPlayerModal') {
                this.closeMapPlayerModal();
            }
        });
    }

    resetView() {
        this.panX = 0;
        this.panY = 0;
        this.zoom = 1;
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

        // Arama kutusu ekle
        let searchBox = document.getElementById('playerSearchBox');
        if (!searchBox) {
            const searchDiv = document.createElement('div');
            searchDiv.className = 'player-search-box';
            searchDiv.innerHTML = `
                <input type="text" id="playerSearchBox" placeholder="Oyuncu ara..." autocomplete="off" style="width: 100%; padding: 8px; border-radius: 4px; border: 1px solid #333; margin-bottom: 10px; background: #23272a; color: #fff;" />
            `;
            container.parentElement.insertBefore(searchDiv, container);
            searchBox = document.getElementById('playerSearchBox');
            searchBox.addEventListener('input', () => this.updatePlayerList());
        }
        const searchValue = searchBox.value?.toLowerCase() || '';

        // Filtrelenmiş oyuncular
        const filteredPlayers = this.players.filter(player =>
            player.name.toLowerCase().includes(searchValue) ||
            String(player.id).includes(searchValue)
        );

        if (filteredPlayers.length === 0) {
            container.innerHTML = '<div class="no-players">Online oyuncu bulunamadı</div>';
            return;
        }

        container.innerHTML = filteredPlayers.map(player => `
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
        this.mapImage.src = '/assets/gta-5-map.png';
    }

    drawMapBackground() {
        if (this.canvas.width === 0 || this.canvas.height === 0) {
            return;
        }
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.save();
        // Pan ve zoom uygula
        this.ctx.translate(this.panX, this.panY);
        this.ctx.scale(this.zoom, this.zoom);
        if (this.mapImageLoaded && this.mapImage) {
            const aspectRatio = this.mapImage.width / this.mapImage.height;
            const canvasAspectRatio = this.canvas.width / this.canvas.height;
            let drawWidth, drawHeight, offsetX, offsetY;
            if (aspectRatio > canvasAspectRatio) {
                drawHeight = this.canvas.height * 0.6;
                drawWidth = drawHeight * aspectRatio;
                offsetX = (this.canvas.width - drawWidth) / 2;
                offsetY = (this.canvas.height - drawHeight) / 2;
            } else {
                drawWidth = this.canvas.width * 0.6;
                drawHeight = drawWidth / aspectRatio;
                offsetX = (this.canvas.width - drawWidth) / 2;
                offsetY = (this.canvas.height - drawHeight) / 2;
            }
            this.ctx.drawImage(this.mapImage, offsetX, offsetY, drawWidth, drawHeight);
        } else {
            this.drawGradientBackground();
        }
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
        this.ctx.save();
        this.ctx.translate(this.panX, this.panY);
        this.ctx.scale(this.zoom, this.zoom);
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        this.ctx.lineWidth = 1 / this.zoom;
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
        this.ctx.restore();
    }

    drawMap() {
        this.drawMapBackground();
        this.drawPlayers();
    }

    drawPlayers() {
        console.log('Oyuncular çiziliyor, toplam:', this.players.length);
        this.ctx.save();
        this.ctx.translate(this.panX, this.panY);
        this.ctx.scale(this.zoom, this.zoom);
        this._markerHitboxes = [];
        this.players.forEach((player, index) => {
            const canvasX = this.mapCoordinateToCanvas(player.x, 'x');
            const canvasY = this.mapCoordinateToCanvas(player.y, 'y');
            console.log(`Oyuncu ${index + 1}:`, {
                name: player.name,
                x: player.x,
                y: player.y,
                canvasX: canvasX,
                canvasY: canvasY
            });
            // Marker'ı çiz
            this.drawPlayerMarker(canvasX, canvasY, player);
            // Marker hitbox'unu kaydet
            const radius = player.highlighted ? 16 : 8;
            this._markerHitboxes.push({
                x: canvasX,
                y: canvasY,
                radius,
                player
            });
        });
        this.ctx.restore();
    }

    mapCoordinateToCanvas(coord, axis) {
        const gtaRange = 8000;
        const canvasSize = axis === 'x' ? this.canvas.width : this.canvas.height;
        const mapScale = 0.6;
        const mapSize = axis === 'x' ? this.canvas.width * mapScale : this.canvas.height * mapScale;
        const offset = (canvasSize - mapSize) / 2;
        const normalized = (coord + 4000) / gtaRange;
        let adjustedNormalized = normalized;
        if (axis === 'y') {
            adjustedNormalized = 1 - normalized;
            adjustedNormalized += 0.4;
        } else if (axis === 'x') {
            adjustedNormalized -= 0.05;
        }
        // Zoom'u hesaba kat (çünkü pan/zoom canvas'a uygulanıyor, burada gerek yok)
        const result = offset + (adjustedNormalized * mapSize);
        return result;
    }

    drawPlayerMarker(x, y, player) {
        // Marker boyutu ve renk seçimi
        const isHighlighted = player.highlighted;
        const radius = isHighlighted ? 16 : 8;
        const color = isHighlighted ? '#ffb300' : '#007bff';
        const borderColor = isHighlighted ? '#fff700' : 'white';
        const borderWidth = isHighlighted ? 4 : 2;

        // Marker arka planı
        this.ctx.beginPath();
        this.ctx.arc(x, y, radius, 0, 2 * Math.PI);
        this.ctx.fillStyle = color;
        this.ctx.fill();

        // Marker kenarlığı
        this.ctx.strokeStyle = borderColor;
        this.ctx.lineWidth = borderWidth;
        this.ctx.stroke();

        // Oyuncu adı
        this.ctx.fillStyle = isHighlighted ? '#fff700' : 'white';
        this.ctx.font = isHighlighted ? 'bold 15px Arial' : '12px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(player.name, x, y - radius - 5);
    }

    highlightPlayer(playerId) {
        // Seçili oyuncu zaten highlighted ise kaldır
        const selectedPlayer = this.players.find(p => p.id == playerId);
        const wasHighlighted = selectedPlayer && selectedPlayer.highlighted;

        // Tüm marker'ları normal haline getir
        this.players.forEach(player => {
            player.highlighted = false;
        });

        // Eğer zaten highlighted değilse, seçili oyuncuyu vurgula
        if (selectedPlayer && !wasHighlighted) {
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

    showMapPlayerModal(player) {
        const modal = document.getElementById('mapPlayerModal');
        if (!modal) return;
        document.getElementById('mapPlayerModalName').textContent = player.name;
        document.getElementById('mapPlayerModalId').textContent = player.id;
        document.getElementById('mapPlayerModalCoords').textContent = `X: ${Math.round(player.x)}, Y: ${Math.round(player.y)}`;
        modal.style.display = 'flex';
    }
    closeMapPlayerModal() {
        const modal = document.getElementById('mapPlayerModal');
        if (modal) modal.style.display = 'none';
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

