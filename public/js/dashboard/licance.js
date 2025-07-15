// Lisans Yönetim Sistemi
class LicenseManager {
    constructor() {
        this.init();
    }

    init() {
        this.bindEvents();
        this.loadLicenses();
    }

    bindEvents() {
        // Lisans ekleme formu
        const licenseAddForm = document.getElementById('licenseAddForm');
        if (licenseAddForm) {
            licenseAddForm.addEventListener('submit', (e) => this.handleAddLicense(e));
        }

        // IP adresi format kontrolü
        const serverIPInput = document.getElementById('serverIP');
        if (serverIPInput) {
            serverIPInput.addEventListener('input', (e) => this.validateIP(e.target.value));
        }
    }

    // IP adresi format kontrolü
    validateIP(ip) {
        const ipRegex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
        const isValid = ipRegex.test(ip);
        
        const serverIPInput = document.getElementById('serverIP');
        if (serverIPInput) {
            if (ip && !isValid) {
                serverIPInput.style.borderColor = '#ff4444';
                serverIPInput.title = 'Geçersiz IP adresi formatı (örn: 192.168.1.1)';
            } else {
                serverIPInput.style.borderColor = '#4CAF50';
                serverIPInput.title = '';
            }
        }
        
        return isValid;
    }

    // Lisans ekleme
    async handleAddLicense(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const serverName = formData.get('serverName').trim();
        const serverIP = formData.get('serverIP').trim();
        
        // Validation
        if (!serverName || !serverIP) {
            this.showNotification('Lütfen tüm alanları doldurun!', 'error');
            return;
        }
        
        if (!this.validateIP(serverIP)) {
            this.showNotification('Geçersiz IP adresi formatı!', 'error');
            return;
        }
        
        try {
            const response = await fetch('/api/licenses/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    serverName: serverName,
                    serverIP: serverIP,
                    addedBy: this.getCurrentUser() || 'Admin'
                })
            });
            
            const result = await response.json();
            
            if (result.success) {
                this.showNotification('Lisans başarıyla eklendi!', 'success');
                e.target.reset();
                this.loadLicenses(); // Listeyi yenile
            } else {
                // Duplicate IP hatası için özel mesaj
                if (response.status === 409) {
                    this.showNotification(result.message, 'warning');
                    // IP input'unu vurgula
                    const serverIPInput = document.getElementById('serverIP');
                    if (serverIPInput) {
                        serverIPInput.style.borderColor = '#ffc107';
                        serverIPInput.style.boxShadow = '0 0 0 0.2rem rgba(255, 193, 7, 0.25)';
                        setTimeout(() => {
                            serverIPInput.style.borderColor = '';
                            serverIPInput.style.boxShadow = '';
                        }, 3000);
                    }
                    
                    // Lisansları yenile ki kullanıcı mevcut kayıtları görebilsin
                    this.loadLicenses();
                    
                    // IP input'unu temizle
                    serverIPInput.value = '';
                    serverIPInput.focus();
                } else {
                    this.showNotification(result.message || 'Lisans eklenirken hata oluştu!', 'error');
                }
            }
        } catch (error) {
            console.error('Lisans ekleme hatası:', error);
            this.showNotification('Sunucu hatası oluştu!', 'error');
        }
    }

    // Lisansları listele
    async loadLicenses() {
        const licenseList = document.getElementById('licenseList');
        if (!licenseList) return;
        
        try {
            // Loading göster
            licenseList.innerHTML = `
                <div class="loading-spinner">
                    <i class="fas fa-spinner fa-spin"></i>
                    <span>Lisanslar yükleniyor...</span>
                </div>
            `;
            
            const response = await fetch('/api/licenses/list');
            const result = await response.json();
            
            if (result.success) {
                this.renderLicenses(result.licenses);
            } else {
                licenseList.innerHTML = `
                    <div class="error-message">
                        <i class="fas fa-exclamation-triangle"></i>
                        <p>Lisanslar yüklenirken hata oluştu!</p>
                        <button class="retry-btn" onclick="licenseManager.loadLicenses()">
                            <i class="fas fa-redo"></i> Tekrar Dene
                        </button>
                    </div>
                `;
            }
        } catch (error) {
            console.error('Lisans listeleme hatası:', error);
            licenseList.innerHTML = `
                <div class="error-message">
                    <i class="fas fa-exclamation-triangle"></i>
                    <p>Sunucu hatası oluştu!</p>
                    <button class="retry-btn" onclick="licenseManager.loadLicenses()">
                        <i class="fas fa-redo"></i> Tekrar Dene
                    </button>
                </div>
            `;
        }
    }

    // Lisansları render et
    renderLicenses(licenses) {
        const licenseList = document.getElementById('licenseList');
        if (!licenseList) return;
        
        // İstatistikleri güncelle
        this.updateStats(licenses);
        
        if (licenses.length === 0) {
            licenseList.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-key"></i>
                    <h4>Henüz lisans eklenmemiş</h4>
                    <p>İlk lisansınızı eklemek için yukarıdaki formu kullanın.</p>
                </div>
            `;
            return;
        }
        
        const licensesHTML = licenses.map(license => `
            <li class="license-item" data-id="${license.id}">
                <div class="license-info">
                    <div class="license-header">
                        <h4><i class="fas fa-server"></i> ${this.escapeHtml(license.server_name)}</h4>
                        <span class="license-ip" title="Bu IP adresi zaten kayıtlı - Kopyalamak için tıklayın" onclick="navigator.clipboard.writeText('${license.server_ip}').then(() => licenseManager.showNotification('IP adresi kopyalandı!', 'success'))">
                            <i class="fas fa-network-wired"></i> 
                            <code>${license.server_ip}</code>
                            <i class="fas fa-copy" style="margin-left: 5px; font-size: 12px; opacity: 0.7;"></i>
                        </span>
                    </div>
                    <div class="license-details">
                        <span class="license-date"><i class="fas fa-calendar"></i> Eklenme: ${this.formatDate(license.created_at)}</span>
                        ${license.added_by ? `<span class="license-added-by"><i class="fas fa-user"></i> Ekleyen: ${this.escapeHtml(license.added_by)}</span>` : ''}
                    </div>
                </div>
                <div class="license-actions">
                    <button class="btn-delete" onclick="licenseManager.deleteLicense(${license.id})" title="Lisansı Sil">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </li>
        `).join('');
        
        licenseList.innerHTML = licensesHTML;
    }

    // İstatistikleri güncelle
    updateStats(licenses) {
        const totalLicenses = document.getElementById('totalLicenses');
        const activeLicenses = document.getElementById('activeLicenses');
        const totalLicensesLogs = document.getElementById('totalLicensesLogs');
        const activeLicensesLogs = document.getElementById('activeLicensesLogs');
        
        if (totalLicenses) {
            totalLicenses.textContent = licenses.length;
        }
        
        if (activeLicenses) {
            // Aktif lisans sayısı (şimdilik toplam sayıya eşit)
            activeLicenses.textContent = licenses.length;
        }
        
        if (totalLicensesLogs) {
            totalLicensesLogs.textContent = licenses.length;
        }
        
        if (activeLicensesLogs) {
            // Aktif lisans sayısı (şimdilik toplam sayıya eşit)
            activeLicensesLogs.textContent = licenses.length;
        }
    }

    // Lisansları dışa aktar
    exportLicenses() {
        try {
            const licenseList = document.getElementById('licenseList');
            if (!licenseList || licenseList.children.length === 0) {
                this.showNotification('Dışa aktarılacak lisans bulunamadı!', 'warning');
                return;
            }

            const licenses = [];
            const licenseItems = licenseList.querySelectorAll('.license-item');
            
            licenseItems.forEach(item => {
                const serverName = item.querySelector('h4').textContent.replace(/.*?server.*?/, '').trim();
                const serverIP = item.querySelector('code').textContent;
                const addedDate = item.querySelector('.license-date').textContent.replace('Eklenme: ', '');
                const addedBy = item.querySelector('.license-added-by') ? 
                    item.querySelector('.license-added-by').textContent.replace('Ekleyen: ', '') : 'Bilinmiyor';
                
                licenses.push({
                    'Sunucu İsmi': serverName,
                    'IP Adresi': serverIP,
                    'Eklenme Tarihi': addedDate,
                    'Ekleyen': addedBy
                });
            });

            // CSV formatına çevir
            const csvContent = this.convertToCSV(licenses);
            
            // Dosyayı indir
            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement('a');
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', `lisanslar_${new Date().toISOString().split('T')[0]}.csv`);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            this.showNotification('Lisanslar başarıyla dışa aktarıldı!', 'success');
        } catch (error) {
            console.error('Dışa aktarma hatası:', error);
            this.showNotification('Dışa aktarma sırasında hata oluştu!', 'error');
        }
    }

    // CSV'ye çevir
    convertToCSV(arr) {
        const array = [Object.keys(arr[0])].concat(arr);
        return array.map(row => {
            return Object.values(row).map(value => {
                return typeof value === 'string' ? JSON.stringify(value) : value;
            }).join(',');
        }).join('\n');
    }

    // Lisans sil
    async deleteLicense(id) {
        if (!confirm('Bu lisansı silmek istediğinizden emin misiniz?')) {
            return;
        }
        
        try {
            const response = await fetch(`/api/licenses/delete/${id}`, {
                method: 'DELETE'
            });
            
            const result = await response.json();
            
            if (result.success) {
                this.showNotification('Lisans başarıyla silindi!', 'success');
                this.loadLicenses(); // Listeyi yenile
            } else {
                this.showNotification(result.message || 'Lisans silinirken hata oluştu!', 'error');
            }
        } catch (error) {
            console.error('Lisans silme hatası:', error);
            this.showNotification('Sunucu hatası oluştu!', 'error');
        }
    }

    // Yardımcı fonksiyonlar
    showNotification(message, type = 'info') {
        // Mevcut notification varsa kaldır
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }
        
        // Yeni notification oluştur
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-message">${message}</span>
                <button class="notification-close">&times;</button>
            </div>
        `;
        
        // Stil ekle
        const bgColor = type === 'success' ? '#4CAF50' : 
                       type === 'error' ? '#f44336' : 
                       type === 'warning' ? '#ffc107' : '#2196F3';
        
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${bgColor};
            color: ${type === 'warning' ? '#000' : 'white'};
            padding: 15px 20px;
            border-radius: 5px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 10000;
            max-width: 400px;
            animation: slideIn 0.3s ease-out;
        `;
        
        document.body.appendChild(notification);
        
        // Kapatma butonu
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', () => notification.remove());
        
        // 5 saniye sonra otomatik kapat
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 5000);
    }

    getCurrentUser() {
        // Kullanıcı bilgisini localStorage'dan al veya session'dan
        return localStorage.getItem('currentUser') || 'Admin';
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleString('tr-TR', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    // IP yardım fonksiyonu
    showIPHelp() {
        const helpText = `
IP Adresi Formatı:
• Geçerli format: 192.168.1.1
• Her IP adresi sadece bir kez kullanılabilir
• Mevcut IP'leri görmek için aşağıdaki listeye bakın
• IP adresini kopyalamak için listedeki IP'ye tıklayın

Örnek IP Adresleri:
• 192.168.1.1
• 10.0.0.1
• 172.16.0.1
• 8.8.8.8
        `;
        
        alert(helpText);
    }
}

// Tam ekran lisans yönetim sistemi stilleri
const additionalStyles = `
<style>
/* Tam ekran lisans yönetim sistemi */
.license-dashboard-content {
    min-height: calc(100vh - 60px) !important;
    background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%) !important;
    padding: 0 !important;
    margin: 0 !important;
    display: flex;
    flex-direction: column !important;
}

/* Header Section */
.license-header-section {
    background: linear-gradient(135deg, #007bff 0%, #0056b3 100%) !important;
    padding: 40px 30px !important;
    color: white !important;
    box-shadow: 0 4px 20px rgba(0,0,0,0.3) !important;
}

.license-header-content {
    max-width: 1400px !important;
    margin: 0 auto !important;
    display: flex !important;
    justify-content: space-between !important;
    align-items: center !important;
}

.license-title h1 {
    font-size: 2.5rem !important;
    font-weight: 700 !important;
    margin: 0 0 10px 0 !important;
    text-shadow: 0 2px 4px rgba(0,0,0,0.3) !important;
}

.license-title p {
    font-size: 1.1rem !important;
    opacity: 0.9 !important;
    margin: 0 !important;
}

.license-stats {
    display: flex !important;
    gap: 30px !important;
}

.stat-item {
    text-align: center !important;
    background: rgba(255,255,255,0.1) !important;
    padding: 20px !important;
    border-radius: 15px !important;
    backdrop-filter: blur(10px) !important;
    border: 1px solid rgba(255,255,255,0.2) !important;
    min-width: 120px !important;
}

.stat-item i {
    font-size: 2rem !important;
    margin-bottom: 10px !important;
}

.stat-item span {
    font-size: 2rem !important;
    font-weight: 700 !important;
    margin-bottom: 5px !important;
}

.stat-item label {
    font-size: 0.9rem !important;
    opacity: 0.8 !important;
    text-transform: uppercase !important;
    letter-spacing: 1px !important;
}

/* Main Content */
.license-main-content {
    flex: 1 !important;
    display: flex !important;
    gap: 30px !important;
    padding: 30px !important;
    max-width: 1400px !important;
    margin: 0 auto !important;
    width: 100% !important;
}

.license-left-panel {
    flex: 0 0 400px !important;
}

.license-right-panel {
    flex: 1 !important;
}

/* Form Card */
.license-form-card {
    background: var(--card-bg) !important;
    border-radius: 20px !important;
    box-shadow: 0 8px 32px rgba(0,0,0,0.3) !important;
    border: 1px solid var(--border-color) !important;
    overflow: hidden !important;
    height: fit-content !important;
}

.license-form-card .card-header {
    background: linear-gradient(135deg, #2d2d2d 0%, #1a1a1a 100%) !important;
    padding: 25px 30px !important;
    border-bottom: 1px solid var(--border-color) !important;
}

.license-form-card .card-header h3 {
    font-size: 1.4rem !important;
    margin: 0 0 5px 0 !important;
    color: var(--text-color) !important;
}

.license-form-card .card-header p {
    margin: 0 !important;
    color: var(--text-secondary) !important;
    font-size: 0.9rem !important;
}

.license-form-card .card-content {
    padding: 30px !important;
}

/* Form Styles */
.license-form .form-group {
    margin-bottom: 25px !important;
}

.license-form label {
    display: flex !important;
    align-items: center !important;
    gap: 8px !important;
    margin-bottom: 8px !important;
    font-weight: 600 !important;
    color: var(--text-color) !important;
    font-size: 0.95rem !important;
}

.license-form label i {
    color: var(--accent-color) !important;
    width: 16px !important;
}

.license-form input {
    width: 100% !important;
    padding: 15px !important;
    border: 2px solid var(--border-color) !important;
    border-radius: 12px !important;
    background: var(--secondary-color) !important;
    color: var(--text-color) !important;
    font-size: 1rem !important;
    transition: all 0.3s ease !important;
}

.license-form input:focus {
    outline: none !important;
    border-color: var(--accent-color) !important;
    box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1) !important;
    transform: translateY(-2px) !important;
}

.input-with-help {
    position: relative !important;
}

.btn-help {
    position: absolute !important;
    right: 15px !important;
    top: 50% !important;
    transform: translateY(-50%) !important;
    background: none !important;
    border: none !important;
    color: var(--accent-color) !important;
    cursor: pointer !important;
    font-size: 1.1rem !important;
    transition: all 0.3s ease !important;
}

.btn-help:hover {
    color: #0056b3 !important;
    transform: translateY(-50%) scale(1.1) !important;
}

.form-help {
    display: flex !important;
    align-items: center !important;
    gap: 5px !important;
    margin-top: 8px !important;
    font-size: 0.85rem !important;
    color: var(--text-secondary) !important;
}

.form-help i {
    color: var(--accent-color) !important;
}

.form-actions {
    display: flex !important;
    gap: 15px !important;
    margin-top: 30px !important;
}

.btn-submit, .btn-reset {
    flex: 1 !important;
    padding: 15px 20px !important;
    border: none !important;
    border-radius: 12px !important;
    font-size: 1rem !important;
    font-weight: 600 !important;
    cursor: pointer !important;
    transition: all 0.3s ease !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    gap: 8px !important;
}

.btn-submit {
    background: linear-gradient(135deg, var(--accent-color) 0%, #0056b3 100%) !important;
    color: white !important;
}

.btn-submit:hover {
    transform: translateY(-2px) !important;
    box-shadow: 0 8px 25px rgba(0, 123, 255, 0.3) !important;
}

.btn-reset {
    background: var(--secondary-color) !important;
    color: var(--text-color) !important;
    border: 2px solid var(--border-color) !important;
}

.btn-reset:hover {
    background: var(--border-color) !important;
    transform: translateY(-2px) !important;
}

/* List Card */
.license-list-card {
    background: var(--card-bg) !important;
    border-radius: 20px !important;
    box-shadow: 0 8px 32px rgba(0,0,0,0.3) !important;
    border: 1px solid var(--border-color) !important;
    overflow: hidden !important;
    height: 100% !important;
    display: flex !important;
    flex-direction: column !important;
}

.license-list-card .card-header {
    background: linear-gradient(135deg, #2d2d2d 0%, #1a1a1a 100%) !important;
    padding: 25px 30px !important;
    border-bottom: 1px solid var(--border-color) !important;
    display: flex !important;
    justify-content: space-between !important;
    align-items: center !important;
}

.header-left h3 {
    font-size: 1.4rem !important;
    margin: 0 0 5px 0 !important;
    color: var(--text-color) !important;
}

.header-left p {
    margin: 0 !important;
    color: var(--text-secondary) !important;
    font-size: 0.9rem !important;
}

.card-actions {
    display: flex !important;
    gap: 10px !important;
}

.btn-refresh, .btn-export {
    background: var(--secondary-color) !important;
    border: 1px solid var(--border-color) !important;
    color: var(--text-color) !important;
    padding: 10px 15px !important;
    border-radius: 10px !important;
    cursor: pointer !important;
    transition: all 0.3s ease !important;
    font-size: 1rem !important;
}

.btn-refresh:hover, .btn-export:hover {
    background: var(--accent-color) !important;
    color: white !important;
    transform: translateY(-2px) !important;
}

.license-list-card .card-content {
    flex: 1 !important;
    padding: 0 !important;
    overflow: hidden !important;
}

.license-list-container {
    height: 100% !important;
    overflow-y: auto !important;
    padding: 20px !important;
}

/* License Items */
#licenseList {
    list-style: none !important;
    padding: 0 !important;
    margin: 0 !important;
}

.license-item {
    background: var(--secondary-color) !important;
    border: 1px solid var(--border-color) !important;
    border-radius: 15px !important;
    padding: 20px !important;
    margin-bottom: 15px !important;
    color: var(--text-color) !important;
    transition: all 0.3s ease !important;
    display: flex !important;
    justify-content: space-between !important;
    align-items: center !important;
}

.license-item:hover {
    background: var(--card-bg) !important;
    box-shadow: 0 8px 25px rgba(0,0,0,0.2) !important;
    transform: translateY(-2px) !important;
    border-color: var(--accent-color) !important;
}

.license-info {
    flex: 1 !important;
}

.license-header {
    display: flex !important;
    align-items: center !important;
    gap: 15px !important;
    margin-bottom: 10px !important;
}

.license-header h4 {
    color: var(--text-color) !important;
    font-size: 1.2rem !important;
    margin: 0 !important;
    display: flex !important;
    align-items: center !important;
    gap: 8px !important;
}

.license-header h4 i {
    color: var(--accent-color) !important;
}

.license-ip {
    background: linear-gradient(135deg, var(--accent-color) 0%, #0056b3 100%) !important;
    color: white !important;
    padding: 8px 12px !important;
    border-radius: 8px !important;
    font-size: 0.9rem !important;
    cursor: pointer !important;
    transition: all 0.3s ease !important;
    display: flex !important;
    align-items: center !important;
    gap: 5px !important;
}

.license-ip:hover {
    transform: scale(1.05) !important;
    box-shadow: 0 4px 15px rgba(0, 123, 255, 0.3) !important;
}

.license-ip code {
    font-family: 'Courier New', monospace !important;
    font-weight: 600 !important;
}

.license-details {
    display: flex !important;
    gap: 20px !important;
    font-size: 0.9rem !important;
    color: var(--text-secondary) !important;
}

.license-details span {
    display: flex !important;
    align-items: center !important;
    gap: 5px !important;
}

.license-details i {
    color: var(--accent-color) !important;
    width: 14px !important;
}

.license-actions {
    display: flex !important;
    gap: 10px !important;
}

.btn-delete {
    background: linear-gradient(135deg, var(--danger-color) 0%, #c82333 100%) !important;
    color: white !important;
    border: none !important;
    padding: 12px 16px !important;
    border-radius: 10px !important;
    cursor: pointer !important;
    transition: all 0.3s ease !important;
    font-size: 1rem !important;
}

.btn-delete:hover {
    transform: translateY(-2px) !important;
    box-shadow: 0 8px 25px rgba(220, 53, 69, 0.3) !important;
}

/* Loading, Error, Empty States */
.loading-spinner, .error-message, .empty-state {
    text-align: center !important;
    padding: 60px 20px !important;
    color: var(--text-secondary) !important;
}

.loading-spinner i {
    font-size: 3rem !important;
    margin-bottom: 20px !important;
    color: var(--accent-color) !important;
}

.loading-spinner span {
    font-size: 1.1rem !important;
    font-weight: 500 !important;
}

.error-message i {
    font-size: 3rem !important;
    margin-bottom: 20px !important;
    color: var(--danger-color) !important;
}

.error-message p {
    font-size: 1.1rem !important;
    margin-bottom: 20px !important;
}

.retry-btn {
    background: var(--accent-color) !important;
    color: white !important;
    border: none !important;
    padding: 12px 24px !important;
    border-radius: 10px !important;
    cursor: pointer !important;
    font-size: 1rem !important;
    font-weight: 600 !important;
    transition: all 0.3s ease !important;
    display: inline-flex !important;
    align-items: center !important;
    gap: 8px !important;
}

.retry-btn:hover {
    background: #0056b3 !important;
    transform: translateY(-2px) !important;
}

.empty-state i {
    font-size: 4rem !important;
    margin-bottom: 20px !important;
    color: var(--accent-color) !important;
    opacity: 0.5 !important;
}

.empty-state h4 {
    font-size: 1.3rem !important;
    margin-bottom: 10px !important;
    color: var(--text-color) !important;
}

.empty-state p {
    font-size: 1rem !important;
    opacity: 0.7 !important;
}

/* Notification stilleri */
.notification {
    position: fixed !important;
    top: 20px !important;
    right: 20px !important;
    z-index: 10000 !important;
    max-width: 400px !important;
    animation: slideIn 0.3s ease-out !important;
    border-radius: 12px !important;
    backdrop-filter: blur(10px) !important;
}

@keyframes slideIn {
    from {
        transform: translateX(100%);
        opacity: 0;
    }
    to {
        transform: translateX(0);
        opacity: 1;
    }
}

.notification-content {
    display: flex !important;
    align-items: center !important;
    justify-content: space-between !important;
}

.notification-close {
    background: none !important;
    border: none !important;
    color: white !important;
    font-size: 18px !important;
    cursor: pointer !important;
    margin-left: 10px !important;
}

.notification-close:hover {
    opacity: 0.8 !important;
}

/* Responsive Design */
@media (max-width: 1200px) {
    .license-main-content {
        flex-direction: column !important;
        gap: 20px !important;
    }
    
    .license-left-panel {
        flex: none !important;
    }
    
    .license-header-content {
        flex-direction: column !important;
        gap: 30px !important;
        text-align: center !important;
    }
    
    .license-stats {
        justify-content: center !important;
    }
}

@media (max-width: 768px) {
    .license-header-section {
        padding: 30px 20px !important;
    }
    
    .license-title h1 {
        font-size: 2rem !important;
    }
    
    .license-main-content {
        padding: 20px !important;
    }
    
    .license-stats {
        flex-direction: column !important;
        gap: 15px !important;
    }
    
    .stat-item {
        min-width: auto !important;
    }
    
    .form-actions {
        flex-direction: column !important;
    }
    
    .license-details {
        flex-direction: column !important;
        gap: 10px !important;
    }
}

@media (max-width: 480px) {
    .license-header-section {
        padding: 20px 15px !important;
    }
    
    .license-title h1 {
        font-size: 1.5rem !important;
    }
    
    .license-main-content {
        padding: 15px !important;
    }
    
    .license-form-card .card-content,
    .license-list-card .card-header {
        padding: 20px !important;
    }
}
</style>
`;

// Stilleri sayfaya ekle
document.head.insertAdjacentHTML('beforeend', additionalStyles);

// Lisans yöneticisini başlat
const licenseManager = new LicenseManager();

// Global fonksiyon olarak export et
window.licenseManager = licenseManager;
