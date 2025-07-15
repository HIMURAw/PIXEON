function showContent(section) {
    // Tüm dashboard içeriklerini gizle
    document.querySelectorAll('.dashboard-content, .purchase-dashboard-content, .activity-dashboard-content, .discord-login-history-content, .purchase-history-content, .activity-history-content, .settings-content, .comments-content, .ticket-content, .add-product-content, .comprehensive-logs-content, .license-dashboard-content')
        .forEach(content => {
            content.style.display = 'none';
        });
    // Sadece seçili olanı göster
    const targetSection = document.getElementById(section);
    if (targetSection) {
        if (targetSection.classList.contains('license-dashboard-content')) {
            targetSection.style.display = 'flex';
        } else if (targetSection.classList.contains('comprehensive-logs-content')) {
            targetSection.style.display = 'block';
            if (typeof initializeComprehensiveLogs === 'function') {
                initializeComprehensiveLogs();
            }
        } else {
            targetSection.style.display = 'block';
        }
    }
}

document.addEventListener('DOMContentLoaded', function () {
    
    
    loadDiscordLoginHistory()
    loadLoginHistory()
    
    
    
    // Token kontrolü
    function getCookie(name) {
        const nameEQ = name + "=";
        const ca = document.cookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
        }
        return null;
    }




    const token = getCookie('auth_token');
    if (!token) {
        // Token yoksa anasayfaya yönlendir
        window.location.href = '/';
        return;
    }

    // Sidebar toggle
    const sidebarToggle = document.getElementById('sidebarToggle');
    const sidebar = document.querySelector('.sidebar');
    const mainContent = document.querySelector('.main-content');

    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', () => {
            sidebar.classList.toggle('collapsed');
        });
    }

    // Sidebar menü işlemleri
    const menuItems = document.querySelectorAll('.sidebar-nav li');
    const contentSections = {
        'discord-dashboard': document.getElementById('discord-dashboard'),
        'purchase-dashboard-content': document.getElementById('purchase-dashboard-content'),
        'activity-dashboard-content': document.getElementById('activity-dashboard-content'),
        'discord-login-history': document.getElementById('discord-login-history'),
        'purchase-history': document.getElementById('purchase-history'),
        'activity-history': document.getElementById('activity-history'),
        'settings': document.getElementById('settings'),
    };

    // İlk yüklemede Discord dashboard içeriğini göster
    showContent('discord-dashboard');

    menuItems.forEach(item => {
        item.addEventListener('click', (e) => {
            // Eğer sidebar-parent ise, bu event çalışmasın
            if (item.classList.contains('sidebar-parent')) return;
            e.preventDefault();
            // Aktif menü öğesini güncelle
            menuItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');
            // İlgili içeriği göster
            const section = item.querySelector('a').getAttribute('href').substring(1);
            showContent(section);
        });
    });

    // Collapsible sidebar menu for Dashboard
    const dashboardMenu = document.getElementById('dashboardMenu');
    const dashboardToggle = dashboardMenu.querySelector('.sidebar-parent-toggle');
    const dashboardSubmenu = dashboardMenu.querySelector('.sidebar-submenu');

    dashboardToggle.addEventListener('click', function (e) {
        e.preventDefault();
        const isOpen = dashboardMenu.classList.contains('open');
        
        if (isOpen) {
            // Kapanırken animasyon
            dashboardMenu.classList.add('closing');
            setTimeout(() => {
                dashboardMenu.classList.remove('open', 'closing');
                dashboardSubmenu.style.display = 'none';
            }, 300);
        } else {
            // Açılırken
            dashboardMenu.classList.add('open');
            dashboardSubmenu.style.display = 'block';
        }
    });

    // Collapsible sidebar menu for Log
    const logMenu = document.getElementById('logMenu');
    const logToggle = logMenu.querySelector('.sidebar-parent-toggle');
    const logSubmenu = logMenu.querySelector('.sidebar-submenu');

    logToggle.addEventListener('click', function (e) {
        e.preventDefault();
        const isOpen = logMenu.classList.contains('open');
        
        if (isOpen) {
            // Kapanırken animasyon
            logMenu.classList.add('closing');
            setTimeout(() => {
                logMenu.classList.remove('open', 'closing');
                logSubmenu.style.display = 'none';
            }, 300);
        } else {
            // Açılırken
            logMenu.classList.add('open');
            logSubmenu.style.display = 'block';
        }
    });

    // Collapsible sidebar menu for Audit Panel
    const auditMenu = document.getElementById('auditMenu');
    const auditToggle = auditMenu.querySelector('.sidebar-parent-toggle');
    const auditSubmenu = auditMenu.querySelector('.sidebar-submenu');

    auditToggle.addEventListener('click', function (e) {
        e.preventDefault();
        const isOpen = auditMenu.classList.contains('open');
        
        if (isOpen) {
            // Kapanırken animasyon
            auditMenu.classList.add('closing');
            setTimeout(() => {
                auditMenu.classList.remove('open', 'closing');
                auditSubmenu.style.display = 'none';
            }, 300);
        } else {
            // Açılırken
            auditMenu.classList.add('open');
            auditSubmenu.style.display = 'block';
        }
    });

    // Collapsible sidebar menu for Web Manager
    const webManagerMenu = document.getElementById('webManagerMenu');
    const webManagerToggle = webManagerMenu.querySelector('.sidebar-parent-toggle');
    const webManagerSubmenu = webManagerMenu.querySelector('.sidebar-submenu');

    webManagerToggle.addEventListener('click', function (e) {
        e.preventDefault();
        const isOpen = webManagerMenu.classList.contains('open');
        
        if (isOpen) {
            // Kapanırken animasyon
            webManagerMenu.classList.add('closing');
            setTimeout(() => {
                webManagerMenu.classList.remove('open', 'closing');
                webManagerSubmenu.style.display = 'none';
            }, 300);
        } else {
            // Açılırken
            webManagerMenu.classList.add('open');
            webManagerSubmenu.style.display = 'block';
        }
    });

    // License menu açılır/kapanır
    const licenseMenu = document.getElementById('licenseMenu');
    const licenseToggle = licenseMenu.querySelector('.sidebar-parent-toggle');
    const licenseSubmenu = licenseMenu.querySelector('.sidebar-submenu');

    licenseToggle.addEventListener('click', function (e) {
        e.preventDefault();
        const isOpen = licenseMenu.classList.contains('open');
        if (isOpen) {
            licenseMenu.classList.add('closing');
            setTimeout(() => {
                licenseMenu.classList.remove('open', 'closing');
                licenseSubmenu.style.display = 'none';
            }, 300);
        } else {
            licenseMenu.classList.add('open');
            licenseSubmenu.style.display = 'block';
        }
    });

    // Lisans menü item'ları için click event'leri (audit menu ile aynı mantık)
    const licenseMenuItems = licenseMenu.querySelectorAll('.webmanager-subitem');
    licenseMenuItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const section = item.getAttribute('href').substring(1);
            showContent(section);
            // Aktif menü öğesini güncelle
            licenseMenuItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');
        });
    });

    // Alt menü itemleri için içerik gösterme
    const dashboardSubitems = document.querySelectorAll('.dashboard-subitem');
    dashboardSubitems.forEach(item => {
        item.addEventListener('click', function (e) {
            e.preventDefault();
            const targetSection = this.getAttribute('href').replace('#', '');
            showContent(targetSection);
            // Aktiflik vurgusu
            dashboardSubitems.forEach(i => i.parentElement.classList.remove('active'));
            this.parentElement.classList.add('active');
        });
    });

    // Log alt menü itemleri için içerik gösterme
    const logSubitems = document.querySelectorAll('.log-subitem');
    logSubitems.forEach(item => {
        item.addEventListener('click', function (e) {
            e.preventDefault();
            const targetSection = this.getAttribute('href').replace('#', '');
            showContent(targetSection);
            // Aktiflik vurgusu
            logSubitems.forEach(i => i.parentElement.classList.remove('active'));
            this.parentElement.classList.add('active');
        });
    });

    // Audit alt menü itemleri için içerik gösterme
    const auditSubitems = document.querySelectorAll('.audit-subitem');
    auditSubitems.forEach(item => {
        item.addEventListener('click', function (e) {
            e.preventDefault();
            const targetSection = this.getAttribute('href').replace('#', '');
            showContent(targetSection);
            // Aktiflik vurgusu
            auditSubitems.forEach(i => i.parentElement.classList.remove('active'));
            this.parentElement.classList.add('active');
        });
    });

    // Web Manager alt menü itemleri için içerik gösterme
    const webManagerSubitems = document.querySelectorAll('.webmanager-subitem');
    webManagerSubitems.forEach(item => {
        item.addEventListener('click', function (e) {
            e.preventDefault();
            const targetSection = this.getAttribute('href').replace('#', '');
            showContent(targetSection);
            // Aktiflik vurgusu
            webManagerSubitems.forEach(i => i.parentElement.classList.remove('active'));
            this.parentElement.classList.add('active');
        });
    });

    // İçerik gösterme fonksiyonu
    // function showContent(section) {
    //     // Tüm content section'ları gizle
    //     const allContentSections = document.querySelectorAll('.dashboard-content, .purchase-dashboard-content, .activity-dashboard-content, .discord-login-history-content, .purchase-history-content, .activity-history-content, .settings-content, .comments-content, .ticket-content, .add-product-content');
    //     allContentSections.forEach(content => {
    //         content.style.display = 'none';
    //     });
    //     // Seçili olanı göster
    //     const targetSection = document.getElementById(section);
    //     if (targetSection) {
    //         targetSection.style.display = 'block';
    //         console.log('Successfully showed:', section);
    //     } else {
    //         console.error('Section not found:', section);
    //     }
    // }

    // Logout işlemi
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            // Cookie'yi sil
            document.cookie = 'auth_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
            // Anasayfaya yönlendir
            window.location.href = '/';
        });
    }

    // Refresh buttons
    const refreshButtons = document.querySelectorAll('.btn-refresh');
    refreshButtons.forEach(button => {
        button.addEventListener('click', function () {
            const icon = this.querySelector('i');
            icon.style.animation = 'spin 1s linear';
            setTimeout(() => {
                icon.style.animation = '';
            }, 1000);
        });
    });

    // Search functionality
    const searchInput = document.querySelector('.search-bar input');
    if (searchInput) {
        searchInput.addEventListener('input', function (e) {
            const searchTerm = e.target.value.toLowerCase();
            // Arama işlemi
        });
    }

    // Notifications
    const notifications = document.querySelector('.notifications');
    if (notifications) {
        notifications.addEventListener('click', function () {
            // Bildirimler modalı
        });
    }

    // Admin profile
    const adminProfile = document.querySelector('.admin-profile');
    if (adminProfile) {
        adminProfile.addEventListener('click', function () {
            // Admin profile modal
        });
    }

    // Purchase Dashboard Functions
    function loadPurchaseDashboard() {
        console.log('Loading purchase dashboard...');
        
        // Simulate loading data
        setTimeout(() => {
            updateSalesStats();
            loadRecentSales();
            loadTopProducts();
            loadCustomerAnalysis();
            loadCategorySales();
            loadPerformanceMetrics();
            updateLastUpdated();
        }, 1000);
    }

    function updateSalesStats() {
        // Simulate sales data
        const stats = {
            totalEarnings: 15420.50,
            totalSales: 342,
            customerCount: 156,
            averageOrder: 45.09,
            todaySales: 1250.75,
            weeklySales: 8750.25,
            monthlySales: 15420.50,
            popularProduct: 'Premium VIP Paket'
        };

        document.getElementById('totalEarnings').textContent = `₺${stats.totalEarnings.toLocaleString()}`;
        document.getElementById('totalSales').textContent = stats.totalSales.toLocaleString();
        document.getElementById('customerCount').textContent = stats.customerCount.toLocaleString();
        document.getElementById('averageOrder').textContent = `₺${stats.averageOrder.toLocaleString()}`;
        document.getElementById('todaySales').textContent = `₺${stats.todaySales.toLocaleString()}`;
        document.getElementById('weeklySales').textContent = `₺${stats.weeklySales.toLocaleString()}`;
        document.getElementById('monthlySales').textContent = `₺${stats.monthlySales.toLocaleString()}`;
        document.getElementById('popularProduct').textContent = stats.popularProduct;
    }

    function loadRecentSales() {
        const recentSalesList = document.getElementById('recentSalesList');
        const sales = [
            { customer: 'Ahmet Yılmaz', product: 'Premium VIP Paket', amount: 150.00, date: '2 saat önce' },
            { customer: 'Mehmet Demir', product: 'Gold Paket', amount: 75.00, date: '3 saat önce' },
            { customer: 'Ayşe Kaya', product: 'Silver Paket', amount: 50.00, date: '4 saat önce' },
            { customer: 'Ali Özkan', product: 'Premium VIP Paket', amount: 150.00, date: '5 saat önce' },
            { customer: 'Fatma Şahin', product: 'Bronze Paket', amount: 25.00, date: '6 saat önce' }
        ];

        recentSalesList.innerHTML = sales.map(sale => `
            <div class="sale-item">
                <div class="sale-avatar">${sale.customer.charAt(0)}</div>
                <div class="sale-info">
                    <div class="sale-customer">${sale.customer}</div>
                    <div class="sale-product">${sale.product}</div>
                    <div class="sale-date">${sale.date}</div>
                </div>
                <div class="sale-amount">₺${sale.amount.toLocaleString()}</div>
            </div>
        `).join('');
    }

    function loadTopProducts() {
        const topProductsList = document.getElementById('topProductsList');
        const products = [
            { name: 'Premium VIP Paket', category: 'VIP', sales: 89, revenue: 13350.00 },
            { name: 'Gold Paket', category: 'Premium', sales: 67, revenue: 5025.00 },
            { name: 'Silver Paket', category: 'Premium', sales: 45, revenue: 2250.00 },
            { name: 'Bronze Paket', category: 'Basic', sales: 34, revenue: 850.00 },
            { name: 'Starter Paket', category: 'Basic', sales: 28, revenue: 560.00 }
        ];

        topProductsList.innerHTML = products.map((product, index) => `
            <div class="product-item">
                <div class="product-rank rank-${index + 1}">${index + 1}</div>
                <div class="product-info">
                    <div class="product-name">${product.name}</div>
                    <div class="product-category">${product.category}</div>
                    <div class="product-sales">${product.sales} satış</div>
                </div>
                <div class="product-revenue">₺${product.revenue.toLocaleString()}</div>
            </div>
        `).join('');
    }

    function loadCustomerAnalysis() {
        document.getElementById('newCustomers').textContent = '23';
        document.getElementById('returningCustomers').textContent = '133';
        document.getElementById('customerLifetimeValue').textContent = '₺98.85';
    }

    function loadCategorySales() {
        const categoryList = document.getElementById('categoryList');
        const categories = [
            { name: 'VIP Paketler', percentage: 45 },
            { name: 'Premium Paketler', percentage: 30 },
            { name: 'Basic Paketler', percentage: 15 },
            { name: 'Özel Ürünler', percentage: 10 }
        ];

        categoryList.innerHTML = categories.map(category => `
            <div class="category-item">
                <span class="category-name">${category.name}</span>
                <span class="category-percentage">%${category.percentage}</span>
            </div>
        `).join('');
    }

    function loadPerformanceMetrics() {
        const metrics = {
            conversionRate: 3.2,
            cartAverage: 45.09,
            customerSatisfaction: 4.8
        };

        document.getElementById('conversionRate').textContent = `%${metrics.conversionRate}`;
        document.getElementById('cartAverage').textContent = `₺${metrics.cartAverage}`;
        document.getElementById('customerSatisfaction').textContent = `${metrics.customerSatisfaction}/5`;

        // Update progress bars
        document.getElementById('conversionBar').style.width = `${metrics.conversionRate * 10}%`;
        document.getElementById('cartBar').style.width = `${(metrics.cartAverage / 100) * 100}%`;
        document.getElementById('satisfactionBar').style.width = `${(metrics.customerSatisfaction / 5) * 100}%`;
    }

    function updateLastUpdated() {
        const now = new Date();
        const timeString = now.toLocaleString('tr-TR');
        document.getElementById('lastUpdated').textContent = timeString;
    }

    // Refresh functions
    function refreshRecentSales() {
        const button = event.target.closest('.btn-refresh');
        const icon = button.querySelector('i');
        icon.style.animation = 'spin 1s linear';
        
        setTimeout(() => {
            loadRecentSales();
            icon.style.animation = '';
        }, 1000);
    }

    function refreshTopProducts() {
        const button = event.target.closest('.btn-refresh');
        const icon = button.querySelector('i');
        icon.style.animation = 'spin 1s linear';
        
        setTimeout(() => {
            loadTopProducts();
            icon.style.animation = '';
        }, 1000);
    }

    function refreshCustomerAnalysis() {
        const button = event.target.closest('.btn-refresh');
        const icon = button.querySelector('i');
        icon.style.animation = 'spin 1s linear';
        
        setTimeout(() => {
            loadCustomerAnalysis();
            icon.style.animation = '';
        }, 1000);
    }

    function refreshCategorySales() {
        const button = event.target.closest('.btn-refresh');
        const icon = button.querySelector('i');
        icon.style.animation = 'spin 1s linear';
        
        setTimeout(() => {
            loadCategorySales();
            icon.style.animation = '';
        }, 1000);
    }

    function refreshPerformanceMetrics() {
        const button = event.target.closest('.btn-refresh');
        const icon = button.querySelector('i');
        icon.style.animation = 'spin 1s linear';
        
        setTimeout(() => {
            loadPerformanceMetrics();
            icon.style.animation = '';
        }, 1000);
    }

    function refreshSalesChart() {
        const button = event.target.closest('.btn-refresh');
        const icon = button.querySelector('i');
        icon.style.animation = 'spin 1s linear';
        
        setTimeout(() => {
            // Update chart logic here
            icon.style.animation = '';
        }, 1000);
    }

    function updateSalesChart() {
        // Chart update logic here
        console.log('Updating sales chart...');
    }

    // Load purchase dashboard when switching to it
    // const originalShowContent = showContent; // This line is removed as showContent is now global
    // showContent = function(section) { // This block is removed as showContent is now global
    //     originalShowContent(section);
    //     if (section === 'purchase-dashboard-content') {
    //         loadPurchaseDashboard();
    //     } else if (section === 'activity-dashboard-content') {
    //         loadActivityDashboard();
    //     }
    // };

    // Responsive sidebar
    function checkScreenSize() {
        if (window.innerWidth <= 1024) {
            sidebar.classList.remove('active');
        } else {
            sidebar.classList.add('active');
        }
    }

    window.addEventListener('resize', checkScreenSize);
    checkScreenSize();

    // Utility Functions
    function showNotification(message, type = 'info') {
        // Bildirim container'ını oluştur veya bul
        let container = document.querySelector('.notification-container');
        if (!container) {
            container = document.createElement('div');
            container.className = 'notification-container';
            document.body.appendChild(container);
        }

        const notification = document.createElement('div');
        notification.className = `notification ${type}`;

        // Bildirim tipine göre ikon seç
        let icon;
        switch (type) {
            case 'success':
                icon = 'fa-check-circle';
                break;
            case 'error':
                icon = 'fa-exclamation-circle';
                break;
            case 'warning':
                icon = 'fa-exclamation-triangle';
                break;
            case 'info':
            default:
                icon = 'fa-info-circle';
                break;
        }

        notification.innerHTML = `
            <i class="fas ${icon}"></i>
            <span>${message}</span>
            <div class="progress-bar"></div>
        `;

        // Bildirimi container'a ekle
        container.appendChild(notification);

        // Animasyon için setTimeout kullan
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);

        // 3 saniye sonra bildirimi kaldır
        setTimeout(() => {
            notification.classList.add('hide');
            setTimeout(() => {
                notification.remove();
                // Eğer container boşsa, onu da kaldır
                if (container.children.length === 0) {
                    container.remove();
                }
            }, 300);
        }, 3000);
    }

    // Global olarak erişilebilir yap
    window.showNotification = showNotification;

    // Add spin animation for refresh icon
    const style = document.createElement('style');
    style.textContent = `
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    `;
    document.head.appendChild(style);

    // Admin profil bilgilerini yükle
    function loadAdminProfile() {
        try {
            const encodedUserData = getCookie('auth_token');
            if (!encodedUserData) {
                console.log('No auth token found for admin profile');
                return;
            }

            // Çift URL-decode yap
            let decodedUserData = decodeURIComponent(encodedUserData);
            if (decodedUserData.includes('%')) {
                decodedUserData = decodeURIComponent(decodedUserData);
            }

            const userData = JSON.parse(decodedUserData);
            console.log('Admin profile data:', userData);

            if (userData && userData.username) {
                // Admin avatar'ını güncelle
                const adminAvatar = document.getElementById('admin-avatar');
                if (adminAvatar && userData.avatar) {
                    adminAvatar.src = userData.avatar;
                }

                // Admin username'ini güncelle
                const adminUsername = document.getElementById('admin-username');
                if (adminUsername) {
                    adminUsername.textContent = userData.username;
                }

                console.log('Admin profile updated:', userData.username);
            }
        } catch (error) {
            console.error('Error loading admin profile:', error);
        }
    }

    // Sayfa yüklendiğinde admin profilini yükle
    loadAdminProfile();

    // Banlı oyuncu sayısını güncelle
    updateActiveBansCount();

    // Lisans ekleme ve listeleme
    const licenseAddForm = document.getElementById('licenseAddForm');
    const licenseList = document.getElementById('licenseList');
    if (licenseAddForm) {
        licenseAddForm.addEventListener('submit', async function (e) {
            e.preventDefault();
            const serverName = document.getElementById('serverName').value.trim();
            const serverIP = document.getElementById('serverIP').value.trim();

            // Kullanıcı adını cookie'den al
            function getCookie(name) {
                const nameEQ = name + "=";
                const ca = document.cookie.split(';');
                for (let i = 0; i < ca.length; i++) {
                    let c = ca[i];
                    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
                    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
                }
                return null;
            }
            let addedBy = '';
            try {
                const token = getCookie('auth_token');
                if (token) {
                    let decoded = decodeURIComponent(token);
                    if (decoded.includes('%')) decoded = decodeURIComponent(decoded);
                    const userData = JSON.parse(decoded);
                    addedBy = userData.username || '';
                }
            } catch (err) {}

            // API'ya gönder
            const res = await fetch('/api/licenses/add', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ serverName, serverIP, addedBy })
            });
            const data = await res.json();
            if (data.success) {
                showNotification('Lisans başarıyla eklendi!', 'success');
                licenseAddForm.reset();
                loadLicenses();
            } else {
                showNotification('Hata: ' + (data.message || 'Lisans eklenemedi.'), 'error');
            }
        });
    }

    async function loadLicenses() {
        if (!licenseList) return;
        licenseList.innerHTML = '<li>Yükleniyor...</li>';
        try {
            const res = await fetch('/api/licenses/list');
            const data = await res.json();
            if (data.success && data.licenses.length > 0) {
                licenseList.innerHTML = data.licenses.map(l => `
                    <li>
                        <span><b>${l.server_name}</b> <span style="color:#00d4ff">[${l.server_ip}]</span></span>
                        <span style="font-size:0.95em;color:#b3e5fc;">Ekleyen: ${l.added_by || '-'} | ${new Date(l.created_at).toLocaleString('tr-TR')}</span>
                    </li>
                `).join('');
            } else {
                licenseList.innerHTML = '<li>Henüz lisans eklenmemiş.</li>';
            }
        } catch (err) {
            licenseList.innerHTML = '<li>Liste alınamadı.</li>';
        }
    }

    // Sayfa yüklenince lisansları getir
    loadLicenses();
});

function updateActiveBansCount() {
    const el = document.getElementById('active-bans-count');
    if (!el) return; // Eleman yoksa fonksiyonu durdur
    fetch('/api/fivem/fivem-bans')
        .then(res => res.json())
        .then(data => {
            // API'den dönen veri dizi ise uzunluğunu, obje ise .bans dizisinin uzunluğunu al
            const count = Array.isArray(data) ? data.length : (data.banCount !== undefined ? data.banCount : (data.bans ? data.bans.length : 0));
            el.textContent = count;
        })
        .catch(err => {
            el.textContent = '!';
            console.error('Banlı oyuncu sayısı alınamadı:', err);
        });
}

document.addEventListener('DOMContentLoaded', function () {
    updateActiveBansCount();
});

// Activity Dashboard Functions
function loadActivityDashboard() {
    updateActivityStats();
    loadRealTimeActivity();
    loadTopUsers();
    loadChannelActivity();
    loadTimeAnalysis();
    loadActivityPerformance();
    updateActivityLastUpdated();
}

function updateActivityStats() {
    // Simulate loading activity statistics
    const stats = {
        dailyActivity: Math.floor(Math.random() * 1000) + 500,
        peakHours: '14:00-16:00',
        weeklyTrend: '+15%',
        topPerformer: 'Kullanıcı123',
        activeUsers: Math.floor(Math.random() * 200) + 100,
        dailyMessages: Math.floor(Math.random() * 5000) + 2000,
        voiceUsage: Math.floor(Math.random() * 60) + 20 + '%',
        monthlyActivity: Math.floor(Math.random() * 50000) + 25000
    };

    // Update stats in the DOM
    Object.keys(stats).forEach(key => {
        const element = document.getElementById(key);
        if (element) {
            element.textContent = stats[key];
        }
    });
}

function loadRealTimeActivity() {
    const realTimeActivity = document.getElementById('realTimeActivity');
    if (!realTimeActivity) return;

    const activities = [
        { icon: 'fas fa-user-plus', text: 'Yeni kullanıcı katıldı', time: '2 dakika önce' },
        { icon: 'fas fa-comment', text: 'Mesaj gönderildi', time: '5 dakika önce' },
        { icon: 'fas fa-headset', text: 'Ses kanalına katıldı', time: '8 dakika önce' },
        { icon: 'fas fa-user-minus', text: 'Kullanıcı ayrıldı', time: '12 dakika önce' },
        { icon: 'fas fa-image', text: 'Resim paylaşıldı', time: '15 dakika önce' }
    ];

    const activityStream = realTimeActivity.querySelector('.activity-stream');
    if (activityStream) {
        activityStream.innerHTML = activities.map(activity => `
            <div class="activity-item">
                <div class="activity-icon">
                    <i class="${activity.icon}"></i>
                </div>
                <div class="activity-content">
                    <span class="activity-user">${activity.text}</span>
                    <span class="activity-time">${activity.time}</span>
                </div>
            </div>
        `).join('');
    }
}

function loadTopUsers() {
    const topUsersList = document.getElementById('topUsersList');
    if (!topUsersList) return;

    const users = [
        { name: 'Kullanıcı 1', activity: 95, avatar: 'https://cdn.discordapp.com/embed/avatars/0.png' },
        { name: 'Kullanıcı 2', activity: 87, avatar: 'https://cdn.discordapp.com/embed/avatars/1.png' },
        { name: 'Kullanıcı 3', activity: 82, avatar: 'https://cdn.discordapp.com/embed/avatars/2.png' },
        { name: 'Kullanıcı 4', activity: 78, avatar: 'https://cdn.discordapp.com/embed/avatars/3.png' },
        { name: 'Kullanıcı 5', activity: 75, avatar: 'https://cdn.discordapp.com/embed/avatars/4.png' }
    ];

    topUsersList.innerHTML = users.map((user, index) => `
        <div class="user-item">
            <div class="user-rank">${index + 1}</div>
            <div class="user-avatar">
                <img src="${user.avatar}" alt="User">
            </div>
            <div class="user-info">
                <div class="user-name">${user.name}</div>
                <div class="user-activity">Aktivite: ${user.activity}%</div>
            </div>
            <div class="user-score">${user.activity}</div>
        </div>
    `).join('');
}

function loadChannelActivity() {
    const channelActivity = document.querySelector('.channel-activity');
    if (!channelActivity) return;

    const channels = [
        { name: 'genel', messages: 1234, users: 45, activity: 85, icon: 'fas fa-hashtag' },
        { name: 'sohbet', messages: 856, users: 32, activity: 65, icon: 'fas fa-hashtag' },
        { name: 'Ses Kanalı', users: 12, duration: '2h 30m', activity: 45, icon: 'fas fa-headset' },
        { name: 'duyurular', messages: 234, users: 15, activity: 35, icon: 'fas fa-bullhorn' },
        { name: 'oyun', messages: 567, users: 28, activity: 55, icon: 'fas fa-gamepad' }
    ];

    channelActivity.innerHTML = channels.map(channel => `
        <div class="channel-item">
            <div class="channel-icon">
                <i class="${channel.icon}"></i>
            </div>
            <div class="channel-info">
                <div class="channel-name">${channel.name}</div>
                <div class="channel-stats">
                    ${channel.messages ? `<span>Mesaj: ${channel.messages}</span>` : ''}
                    <span>Kullanıcı: ${channel.users}</span>
                    ${channel.duration ? `<span>Süre: ${channel.duration}</span>` : ''}
                </div>
            </div>
            <div class="channel-activity-bar">
                <div class="activity-fill" style="width: ${channel.activity}%"></div>
            </div>
        </div>
    `).join('');
}

function loadTimeAnalysis() {
    const timeMetrics = {
        peakHour: '14:00',
        peakDay: 'Cumartesi',
        avgSession: '2h 15m'
    };

    Object.keys(timeMetrics).forEach(key => {
        const element = document.getElementById(key);
        if (element) {
            element.textContent = timeMetrics[key];
        }
    });

    // Initialize time chart
    const timeChartCanvas = document.getElementById('timeChart');
    if (timeChartCanvas && typeof Chart !== 'undefined') {
        const ctx = timeChartCanvas.getContext('2d');
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00', '24:00'],
                datasets: [{
                    label: 'Aktivite',
                    data: [20, 15, 30, 80, 95, 70, 25],
                    borderColor: '#007bff',
                    backgroundColor: 'rgba(0, 123, 255, 0.1)',
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        },
                        ticks: {
                            color: '#ffffff'
                        }
                    },
                    x: {
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        },
                        ticks: {
                            color: '#ffffff'
                        }
                    }
                },
                plugins: {
                    legend: {
                        labels: {
                            color: '#ffffff'
                        }
                    }
                }
            }
        });
    }
}

function loadActivityPerformance() {
    const performanceMetrics = {
        userEngagement: 78,
        messageActivity: 65,
        voiceActivity: 45
    };

    Object.keys(performanceMetrics).forEach(key => {
        const valueElement = document.getElementById(key);
        const barElement = document.getElementById(key.replace('Activity', 'Bar').replace('Engagement', 'Bar'));
        
        if (valueElement) {
            valueElement.textContent = performanceMetrics[key] + '%';
        }
        if (barElement) {
            barElement.style.width = performanceMetrics[key] + '%';
        }
    });
}

function updateActivityLastUpdated() {
    const now = new Date();
    const timeString = now.toLocaleString('tr-TR');
    const lastUpdatedElement = document.getElementById('activityLastUpdated');
    if (lastUpdatedElement) {
        lastUpdatedElement.textContent = timeString;
    }
}

// Activity Dashboard Refresh Functions
function refreshRealTimeActivity() {
    const icon = event.target.closest('.btn-refresh').querySelector('i');
    icon.style.animation = 'spin 1s linear';
    
    setTimeout(() => {
        loadRealTimeActivity();
        icon.style.animation = '';
        showNotification('Gerçek zamanlı aktivite yenilendi', 'success');
    }, 1000);
}

function refreshTopUsers() {
    const icon = event.target.closest('.btn-refresh').querySelector('i');
    icon.style.animation = 'spin 1s linear';
    
    setTimeout(() => {
        loadTopUsers();
        icon.style.animation = '';
        showNotification('En aktif kullanıcılar yenilendi', 'success');
    }, 1000);
}

function refreshChannelActivity() {
    const icon = event.target.closest('.btn-refresh').querySelector('i');
    icon.style.animation = 'spin 1s linear';
    
    setTimeout(() => {
        loadChannelActivity();
        icon.style.animation = '';
        showNotification('Kanal aktivitesi yenilendi', 'success');
    }, 1000);
}

function refreshTimeAnalysis() {
    const icon = event.target.closest('.btn-refresh').querySelector('i');
    icon.style.animation = 'spin 1s linear';
    
    setTimeout(() => {
        loadTimeAnalysis();
        icon.style.animation = '';
        showNotification('Zaman analizi yenilendi', 'success');
    }, 1000);
}

function refreshActivityPerformance() {
    const icon = event.target.closest('.btn-refresh').querySelector('i');
    icon.style.animation = 'spin 1s linear';
    
    setTimeout(() => {
        loadActivityPerformance();
        icon.style.animation = '';
        showNotification('Aktivite performansı yenilendi', 'success');
    }, 1000);
}

function refreshActivityChart() {
    const icon = event.target.closest('.btn-refresh').querySelector('i');
    icon.style.animation = 'spin 1s linear';
    
    setTimeout(() => {
        updateActivityChart();
        icon.style.animation = '';
        showNotification('Aktivite grafiği yenilendi', 'success');
    }, 1000);
}

function updateActivityChart(data) {
    if (!data || !data.labels) {
        // Optionally, clear the chart or show a message
        return;
    }
    const ctx = document.getElementById('activityChart').getContext('2d');
    if (window.activityChart) {
        window.activityChart.destroy();
    }
    window.activityChart = new Chart(ctx, {
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

// Initialize Activity Dashboard when the page loads
document.addEventListener('DOMContentLoaded', function() {
    // Load activity dashboard data when the page loads
    loadActivityDashboard();
    
    // Initialize activity chart
    // updateActivityChart(); // <-- Remove or comment out this line to prevent error
});

// Comments Management Functions
function loadComments() {
    const comments = [
        {
            id: 1,
            author: 'John Doe',
            avatar: 'https://cdn.discordapp.com/embed/avatars/0.png',
            text: 'Great product! Very satisfied with the purchase.',
            date: '2 hours ago',
            status: 'pending'
        },
        {
            id: 2,
            author: 'Jane Smith',
            avatar: 'https://cdn.discordapp.com/embed/avatars/1.png',
            text: 'Fast delivery and excellent customer service.',
            date: '5 hours ago',
            status: 'approved'
        },
        {
            id: 3,
            author: 'Mike Johnson',
            avatar: 'https://cdn.discordapp.com/embed/avatars/2.png',
            text: 'Product quality is amazing, highly recommended!',
            date: '1 day ago',
            status: 'rejected'
        }
    ];

    const commentsList = document.getElementById('commentsList');
    if (commentsList) {
        commentsList.innerHTML = comments.map(comment => `
            <div class="comment-item">
                <div class="comment-avatar">
                    <img src="${comment.avatar}" alt="${comment.author}">
                </div>
                <div class="comment-content">
                    <div class="comment-header">
                        <span class="comment-author">${comment.author}</span>
                        <span class="comment-date">${comment.date}</span>
                    </div>
                    <div class="comment-text">${comment.text}</div>
                    <div class="comment-actions">
                        <button class="approve-btn" onclick="approveComment(${comment.id})">
                            <i class="fas fa-check"></i> Approve
                        </button>
                        <button class="reject-btn" onclick="rejectComment(${comment.id})">
                            <i class="fas fa-ban"></i> Reject
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
    }

    // Update stats
    updateCommentStats();
}

function updateCommentStats() {
    const stats = {
        totalComments: 156,
        pendingComments: 23,
        approvedComments: 128,
        rejectedComments: 5
    };

    Object.keys(stats).forEach(key => {
        const element = document.getElementById(key);
        if (element) {
            element.textContent = stats[key];
        }
    });
}

function approveComment(commentId) {
    showNotification('Comment approved successfully!', 'success');
    // Here you would typically make an API call to update the comment status
    setTimeout(() => {
        loadComments(); // Reload comments
    }, 1000);
}

function rejectComment(commentId) {
    showNotification('Comment rejected successfully!', 'success');
    // Here you would typically make an API call to update the comment status
    setTimeout(() => {
        loadComments(); // Reload comments
    }, 1000);
}

function refreshComments() {
    const icon = event.target.closest('.btn-refresh').querySelector('i');
    icon.style.animation = 'spin 1s linear';
    
    setTimeout(() => {
        loadComments();
        icon.style.animation = '';
        showNotification('Comments refreshed successfully!', 'success');
    }, 1000);
}

// Ticket Management Functions
function loadTickets() {
    const tickets = [
        {
            id: 1,
            author: 'Alice Brown',
            avatar: 'https://cdn.discordapp.com/embed/avatars/3.png',
            subject: 'Payment Issue',
            message: 'I cannot complete my payment. The system shows an error.',
            date: '1 hour ago',
            status: 'open'
        },
        {
            id: 2,
            author: 'Bob Wilson',
            avatar: 'https://cdn.discordapp.com/embed/avatars/4.png',
            subject: 'Order Tracking',
            message: 'My order has been shipped but I cannot track it.',
            date: '3 hours ago',
            status: 'resolved'
        },
        {
            id: 3,
            author: 'Carol Davis',
            avatar: 'https://cdn.discordapp.com/embed/avatars/5.png',
            subject: 'Product Defect',
            message: 'The product arrived damaged. Need replacement.',
            date: '5 hours ago',
            status: 'open'
        }
    ];

    const ticketsList = document.getElementById('ticketsList');
    if (ticketsList) {
        ticketsList.innerHTML = tickets.map(ticket => `
            <div class="ticket-item ${ticket.status}">
                <div class="ticket-avatar">
                    <img src="${ticket.avatar}" alt="${ticket.author}">
                </div>
                <div class="ticket-content">
                    <div class="ticket-header">
                        <span class="ticket-author">${ticket.author}</span>
                        <span class="ticket-status ${ticket.status}">${ticket.status}</span>
                    </div>
                    <div class="ticket-subject">${ticket.subject}</div>
                    <div class="ticket-message">${ticket.message}</div>
                    <div class="ticket-actions">
                        ${ticket.status === 'open' ? `
                            <button class="resolve-btn" onclick="resolveTicket(${ticket.id})">
                                <i class="fas fa-check"></i> Resolve
                            </button>
                        ` : ''}
                        <button class="btn-reset" onclick="viewTicket(${ticket.id})">
                            <i class="fas fa-eye"></i> View Details
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
    }

    // Update stats
    updateTicketStats();
}

function updateTicketStats() {
    const stats = {
        totalTickets: 89,
        openTickets: 12,
        resolvedTickets: 77,
        avgResponse: '2h 15m'
    };

    Object.keys(stats).forEach(key => {
        const element = document.getElementById(key);
        if (element) {
            element.textContent = stats[key];
        }
    });
}

function resolveTicket(ticketId) {
    showNotification('Ticket resolved successfully!', 'success');
    // Here you would typically make an API call to update the ticket status
    setTimeout(() => {
        loadTickets(); // Reload tickets
    }, 1000);
}

function viewTicket(ticketId) {
    showNotification('Opening ticket details...', 'info');
    // Here you would typically open a modal or navigate to ticket details
}

function refreshTickets() {
    const icon = event.target.closest('.btn-refresh').querySelector('i');
    icon.style.animation = 'spin 1s linear';
    
    setTimeout(() => {
        loadTickets();
        icon.style.animation = '';
        showNotification('Tickets refreshed successfully!', 'success');
    }, 1000);
}

// Product Form Functions
function initializeProductForm() {
    const addProductForm = document.getElementById('addProductForm');
    if (addProductForm) {
        addProductForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            const productData = {
                name: formData.get('productName'),
                description: formData.get('productDescription'),
                price: formData.get('productPrice'),
                category: formData.get('productCategory'),
                image: formData.get('productImage')
            };
            
            // Here you would typically make an API call to save the product
            console.log('Product data:', productData);
            
            showNotification('Product added successfully!', 'success');
            this.reset();
        });
    }
}

// Load data when switching to new sections


// Discord Login/Logout History Loader
async function loadDiscordLoginHistory() {
    const joinList = document.getElementById('discord-join-list');
    const leaveList = document.getElementById('discord-leave-list');
    if (joinList) joinList.innerHTML = '<div class="loading-spinner">Katılanlar yükleniyor...</div>';
    if (leaveList) leaveList.innerHTML = '<div class="loading-spinner">Çıkanlar yükleniyor...</div>';
    try {
        // Fetch joiners
        const joinRes = await fetch('/api/discordUsers/memberLog?action=join');
        const joinData = await joinRes.json();
        // Fetch leavers
        const leaveRes = await fetch('/api/discordUsers/memberLog?action=leave');
        const leaveData = await leaveRes.json();
        // Render joiners as cards
        if (joinList) {
            if (joinData.success && joinData.logs.length > 0) {
                joinList.innerHTML = joinData.logs.map(log => `
                    <div class="user-card" onclick="window.open('https://discord.com/users/${log.user_id}', '_blank')" title="Discord profilini aç">
                        <div class="user-avatar"><img src="${log.avatar_url}" alt="${log.username}"></div>
                        <div class="user-info">
                            <span class="user-name">${log.username}</span>
                            <span class="user-id">${log.user_id}</span>
                            <span class="user-time">${new Date(log.event_time).toLocaleString('tr-TR')}</span>
                        </div>
                    </div>
                `).join('');
            } else {
                joinList.innerHTML = '<div class="loading-spinner">Hiç giriş kaydı yok.</div>';
            }
        }
        // Render leavers as cards
        if (leaveList) {
            if (leaveData.success && leaveData.logs.length > 0) {
                leaveList.innerHTML = leaveData.logs.map(log => `
                    <div class="user-card" onclick="window.open('https://discord.com/users/${log.user_id}', '_blank')" title="Discord profilini aç">
                        <div class="user-avatar"><img src="${log.avatar_url}" alt="${log.username}"></div>
                        <div class="user-info">
                            <span class="user-name">${log.username}</span>
                            <span class="user-id">${log.user_id}</span>
                            <span class="user-time">${new Date(log.event_time).toLocaleString('tr-TR')}</span>
                        </div>
                    </div>
                `).join('');
            } else {
                leaveList.innerHTML = '<div class="loading-spinner">Hiç çıkış kaydı yok.</div>';
            }
        }
    } catch (err) {
        if (joinList) joinList.innerHTML = '<div class="loading-spinner">Giriş logu alınamadı.</div>';
        if (leaveList) leaveList.innerHTML = '<div class="loading-spinner">Çıkış logu alınamadı.</div>';
    }
}

    // Comprehensive Logs Tab Functionality
    function initializeComprehensiveLogs() {
        const tabButtons = document.querySelectorAll('.comprehensive-logs-content .tab-button');
        const tabPanes = document.querySelectorAll('.comprehensive-logs-content .tab-pane');
        // Zaten event eklenmişse tekrar ekleme
        if (tabButtons[0] && tabButtons[0].dataset.listener === 'true') {
            // Her gösterimde ilk tabı aktif yap
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabPanes.forEach(pane => pane.classList.remove('active'));
            tabButtons[0].classList.add('active');
            tabPanes[0].classList.add('active');
            loadTabData(tabButtons[0].getAttribute('data-tab'));
            return;
        }
        tabButtons.forEach((button, idx) => {
            button.addEventListener('click', function() {
                if (button.classList.contains('active')) return;
                tabButtons.forEach(btn => btn.classList.remove('active'));
                tabPanes.forEach(pane => pane.classList.remove('active'));
                button.classList.add('active');
                document.getElementById(button.getAttribute('data-tab')).classList.add('active');
                loadTabData(button.getAttribute('data-tab'));
            });
            button.dataset.listener = 'true';
        });
        // İlk tabı aktif yap ve verisini yükle
        tabButtons.forEach(btn => btn.classList.remove('active'));
        tabPanes.forEach(pane => pane.classList.remove('active'));
        if (tabButtons[0] && tabPanes[0]) {
            tabButtons[0].classList.add('active');
            tabPanes[0].classList.add('active');
            loadTabData(tabButtons[0].getAttribute('data-tab'));
        }
    }
    
    async function loadTabData(tabId) {
        const container = document.querySelector(`#${tabId} .loading-spinner`).parentElement;
        
        try {
            let data = [];
            let endpoint = '';
            
            switch(tabId) {
                case 'messages-tab':
                    endpoint = '/api/discord/log/message';
                    break;
                case 'voice-tab':
                    endpoint = '/api/discord/log/voice';
                    break;
                case 'roles-tab':
                    endpoint = '/api/discord/log/role';
                    break;
                case 'channels-tab':
                    endpoint = '/api/discord/log/channel';
                    break;
                case 'emojis-tab':
                    endpoint = '/api/discord/log/emoji';
                    break;
                case 'invites-tab':
                    endpoint = '/api/discord/log/invite';
                    break;
                case 'server-settings-tab':
                    endpoint = '/api/discordUsers/serverLog';
                    break;
            }
            
            if (endpoint) {
                const response = await fetch(endpoint);
                const result = await response.json();
                if (result.success) {
                    data = result.logs || [];
                }
            }
            
            // For now, show sample data if no real data
            if (data.length === 0) {
                data = generateSampleData(tabId);
            }
            
            renderTabData(container, data, tabId);
            
        } catch (error) {
            console.error('Error loading tab data:', error);
            container.innerHTML = '<div class="loading-spinner">Error loading data</div>';
        }
    }
    
    function generateSampleData(tabId) {
        const sampleData = {
            'messages-tab': [
                { action: 'create', username: 'User1', content: 'Hello everyone!', channel_name: 'general', event_time: new Date() },
                { action: 'edit', username: 'User2', content: 'Updated message', channel_name: 'chat', event_time: new Date(Date.now() - 3600000) },
                { action: 'delete', username: 'User3', content: 'Deleted message', channel_name: 'general', event_time: new Date(Date.now() - 7200000) }
            ],
            'voice-tab': [
                { action: 'join', username: 'User1', channel_name: 'General Voice', event_time: new Date() },
                { action: 'leave', username: 'User2', channel_name: 'Music', event_time: new Date(Date.now() - 1800000) },
                { action: 'mute', username: 'User3', channel_name: 'Gaming', event_time: new Date(Date.now() - 3600000) }
            ],
            'roles-tab': [
                { action: 'add', username: 'User1', role_name: 'Moderator', moderator_username: 'Admin', event_time: new Date() },
                { action: 'remove', username: 'User2', role_name: 'VIP', moderator_username: 'Admin', event_time: new Date(Date.now() - 3600000) }
            ],
            'channels-tab': [
                { action: 'create', channel_name: 'New Channel', channel_type: 'text', moderator_username: 'Admin', event_time: new Date() },
                { action: 'delete', channel_name: 'Old Channel', channel_type: 'voice', moderator_username: 'Admin', event_time: new Date(Date.now() - 7200000) }
            ],
            'emojis-tab': [
                { action: 'create', emoji_name: 'cool', moderator_username: 'Admin', event_time: new Date() },
                { action: 'delete', emoji_name: 'old', moderator_username: 'Admin', event_time: new Date(Date.now() - 3600000) }
            ],
            'invites-tab': [
                { action: 'create', invite_code: 'abc123', channel_name: 'general', creator_username: 'Admin', event_time: new Date() },
                { action: 'delete', invite_code: 'xyz789', channel_name: 'chat', creator_username: 'Admin', event_time: new Date(Date.now() - 3600000) }
            ],
            'server-settings-tab': [
                { action: 'update', setting_name: 'Server Name', old_value: 'Old Name', new_value: 'New Name', moderator_username: 'Admin', event_time: new Date() },
                { action: 'update', setting_name: 'Verification Level', old_value: 'Low', new_value: 'Medium', moderator_username: 'Admin', event_time: new Date(Date.now() - 3600000) }
            ]
        };
        
        return sampleData[tabId] || [];
    }
    
    function renderTabData(container, data, tabId) {
        const icons = {
            'messages-tab': 'fas fa-comment',
            'voice-tab': 'fas fa-headset',
            'roles-tab': 'fas fa-user-tag',
            'channels-tab': 'fas fa-hashtag',
            'emojis-tab': 'fas fa-smile',
            'invites-tab': 'fas fa-link',
            'server-settings-tab': 'fas fa-cog'
        };
        
        if (data.length === 0) {
            container.innerHTML = '<div class="loading-spinner">No data available</div>';
            return;
        }
        
        if (tabId === 'roles-tab') {
            container.innerHTML = data.map(item => {
                const userAvatar = item.user?.avatar_url || `https://cdn.discordapp.com/embed/avatars/${parseInt(item.user?.id || '0') % 5}.png`;
                const moderatorAvatar = item.moderator?.avatar_url || `https://cdn.discordapp.com/embed/avatars/${parseInt(item.moderator?.id || '0') % 5}.png`;
                
                return `
                <div class="log-item role-log-item">
                    <div class="log-user-avatar">
                        <img src="${userAvatar}" alt="${item.user?.username || 'Unknown'}" onerror="this.src='https://cdn.discordapp.com/embed/avatars/0.png'">
                    </div>
                    <div class="log-content">
                        <div class="log-title">${getLogTitle(item, tabId)}</div>
                        <div class="log-details">
                            ${getLogDetails(item, tabId)}
                        </div>
                    </div>
                    <div class="log-time">${new Date(item.event_time).toLocaleString('tr-TR')}</div>
                    <div class="log-moderator-avatar">
                        <img src="${moderatorAvatar}" alt="${item.moderator?.username || 'Unknown'}" onerror="this.src='https://cdn.discordapp.com/embed/avatars/0.png'">
                    </div>
                    <span class="log-action ${item.action}">
                        ${item.action === 'add' ? '🟢 Verildi' : item.action === 'remove' ? '🔴 Alındı' : '🟡 Güncellendi'}
                    </span>
                </div>
            `;
            }).join('');
        } else if (tabId === 'messages-tab') {
            container.innerHTML = data.map(item => {
                const userAvatar = item.user?.avatar_url || `https://cdn.discordapp.com/embed/avatars/${parseInt(item.user?.id || '0') % 5}.png`;
                
                return `
                <div class="log-item message-log-item">
                    <div class="log-user-avatar">
                        <img src="${userAvatar}" alt="${item.user?.username || 'Unknown'}" onerror="this.src='https://cdn.discordapp.com/embed/avatars/0.png'">
                    </div>
                    <div class="log-content">
                        <div class="log-title">${getLogTitle(item, tabId)}</div>
                        <div class="log-details">
                            ${getLogDetails(item, tabId)}
                        </div>
                    </div>
                    <div class="log-time">${new Date(item.event_time).toLocaleString('tr-TR')}</div>
                    <span class="log-action ${item.action}">
                        ${item.action === 'edit' ? '✏️ Düzenlendi' : item.action === 'delete' ? '🗑️ Silindi' : item.action === 'bulk_delete' ? '🗑️🗑️ Toplu Silindi' : '📝 Oluşturuldu'}
                    </span>
                </div>
            `;
            }).join('');
        } else if (tabId === 'voice-tab') {
            container.innerHTML = data.map(item => {
                const userAvatar = item.user?.avatar_url || `https://cdn.discordapp.com/embed/avatars/${parseInt(item.user?.id || '0') % 5}.png`;
                
                return `
                <div class="log-item voice-log-item">
                    <div class="log-user-avatar">
                        <img src="${userAvatar}" alt="${item.user?.username || 'Unknown'}" onerror="this.src='https://cdn.discordapp.com/embed/avatars/0.png'">
                    </div>
                    <div class="log-content">
                        <div class="log-title">${getLogTitle(item, tabId)}</div>
                        <div class="log-details">
                            ${getLogDetails(item, tabId)}
                        </div>
                    </div>
                    <div class="log-time">${new Date(item.event_time).toLocaleString('tr-TR')}</div>
                    <span class="log-action ${item.action}">
                        ${item.action === 'join' ? '🎧 Katıldı' : 
                          item.action === 'leave' ? '🔇 Ayrıldı' : 
                          item.action === 'move' ? '🔄 Değiştirdi' : 
                          item.action === 'mute' ? '🔇 Sesi Kapalı' : 
                          item.action === 'unmute' ? '🔊 Sesi Açık' : 
                          item.action === 'deafen' ? '🔇 Kulaklık Kapalı' : 
                          item.action === 'undeafen' ? '🔊 Kulaklık Açık' : 
                          item.action}
                    </span>
                </div>
            `;
            }).join('');
        } else if (tabId === 'channels-tab') {
            container.innerHTML = data.map(item => {
                const moderatorAvatar = item.moderator?.avatar_url || `https://cdn.discordapp.com/embed/avatars/${parseInt(item.moderator?.id || '0') % 5}.png`;
                
                return `
                <div class="log-item channel-log-item">
                    <div class="log-user-avatar">
                        <img src="${moderatorAvatar}" alt="${item.moderator?.username || 'Unknown'}" onerror="this.src='https://cdn.discordapp.com/embed/avatars/0.png'">
                    </div>
                    <div class="log-content">
                        <div class="log-title">${getLogTitle(item, tabId)}</div>
                        <div class="log-details">
                            ${getLogDetails(item, tabId)}
                        </div>
                    </div>
                    <div class="log-time">${new Date(item.event_time).toLocaleString('tr-TR')}</div>
                    <span class="log-action ${item.action}">
                        ${item.action === 'create' ? '📝 Oluşturuldu' : 
                          item.action === 'delete' ? '🗑️ Silindi' : 
                          item.action === 'update' ? '✏️ Güncellendi' : 
                          item.action === 'permission_update' ? '🔐 İzinler' : 
                          item.action === 'overwrite_update' ? '🔒 Rol İzinleri' : 
                          item.action}
                    </span>
                </div>
            `;
            }).join('');
        } else if (tabId === 'emojis-tab') {
            container.innerHTML = data.map(item => {
                const moderatorAvatar = item.moderator?.avatar_url || item.user?.avatar_url || `https://cdn.discordapp.com/embed/avatars/${parseInt(item.moderator?.id || item.user?.id || '0') % 5}.png`;
                const emojiUrl = item.emoji?.url || item.emoji_url || 'https://cdn.discordapp.com/embed/avatars/0.png';
                
                return `
                <div class="log-item emoji-log-item">
                    <div class="log-user-avatar">
                        <img src="${moderatorAvatar}" alt="${item.moderator?.username || item.user?.username || 'Unknown'}" onerror="this.src='https://cdn.discordapp.com/embed/avatars/0.png'">
                    </div>
                    <div class="log-content">
                        <div class="log-title">${getLogTitle(item, tabId)}</div>
                        <div class="log-details">
                            ${getLogDetails(item, tabId)}
                        </div>
                    </div>
                    <div class="log-time">${new Date(item.event_time).toLocaleString('tr-TR')}</div>
                    <div class="log-emoji-preview">
                        <img src="${emojiUrl}" alt="${item.emoji?.name || item.emoji_name || 'emoji'}" style="width: 32px; height: 32px; border-radius: 4px;" onerror="this.style.display='none'">
                    </div>
                    <span class="log-action ${item.action}">
                        ${item.action === 'create' ? '🟢 Oluşturuldu' : 
                          item.action === 'delete' ? '🔴 Silindi' : 
                          item.action === 'update' ? '🟡 Güncellendi' : 
                          item.action}
                    </span>
                </div>
            `;
            }).join('');
        } else if (tabId === 'invites-tab') {
            container.innerHTML = data.map(item => {
                const userAvatar = item.user?.avatar_url || `https://cdn.discordapp.com/embed/avatars/${parseInt(item.user?.id || '0') % 5}.png`;
                
                return `
                <div class="log-item invite-log-item">
                    <div class="log-user-avatar">
                        <img src="${userAvatar}" alt="${item.user?.username || 'Unknown'}" onerror="this.src='https://cdn.discordapp.com/embed/avatars/0.png'">
                    </div>
                    <div class="log-content">
                        <div class="log-title">${getLogTitle(item, tabId)}</div>
                        <div class="log-details">
                            ${getLogDetails(item, tabId)}
                        </div>
                    </div>
                    <div class="log-time">${new Date(item.event_time).toLocaleString('tr-TR')}</div>
                    <div class="log-invite-code">
                        <span class="invite-code-badge">${item.invite?.code || 'Unknown'}</span>
                    </div>
                    <span class="log-action ${item.action}">
                        ${item.action === 'create' ? '🟢 Oluşturuldu' : 
                          item.action === 'delete' ? '🔴 Silindi' : 
                          item.action === 'use' ? '🟡 Kullanıldı' : 
                          item.action}
                    </span>
                </div>
            `;
            }).join('');
        } else {
            container.innerHTML = data.map(item => `
                <div class="log-item">
                    <div class="log-icon">
                        <i class="${icons[tabId]}"></i>
                    </div>
                    <div class="log-content">
                        <div class="log-title">${getLogTitle(item, tabId)}</div>
                        <div class="log-details">
                            ${getLogDetails(item, tabId)}
                        </div>
                    </div>
                    <div class="log-time">${new Date(item.event_time).toLocaleString('tr-TR')}</div>
                    <span class="log-action ${item.action}">${item.action}</span>
                </div>
            `).join('');
        }
    }
    
    function getLogTitle(item, tabId) {
        switch(tabId) {
            case 'messages-tab':
                const username = item.user?.username || item.username || 'Bilinmeyen Kullanıcı';
                const actionText = item.action === 'edit' ? 'mesajını düzenledi' : 
                                  item.action === 'delete' ? 'mesajını sildi' : 
                                  item.action === 'bulk_delete' ? 'mesajı toplu silindi' : 
                                  'mesaj gönderdi';
                return `${username} ${actionText}`;
            case 'voice-tab':
                const voiceUsername = item.user?.username || item.username || 'Bilinmeyen Kullanıcı';
                const voiceActionText = item.action === 'join' ? 'ses kanalına katıldı' : 
                                       item.action === 'leave' ? 'ses kanalından ayrıldı' : 
                                       item.action === 'move' ? 'ses kanalı değiştirdi' : 
                                       item.action === 'mute' ? 'sesini kapattı' : 
                                       item.action === 'unmute' ? 'sesini açtı' : 
                                       item.action === 'deafen' ? 'kulaklığını kapattı' : 
                                       item.action === 'undeafen' ? 'kulaklığını açtı' : 
                                       'ses durumu değiştirdi';
                return `${voiceUsername} ${voiceActionText}`;
            case 'roles-tab':
                if (item.user && item.role) {
                    const actionText = item.action === 'add' ? 'verildi' : item.action === 'remove' ? 'alındı' : 'güncellendi';
                    return `${item.user.username} kullanıcısına ${item.role.name} rolü ${actionText}`;
                }
                return `${item.username} ${item.action} ${item.role_name} role`;
            case 'channels-tab':
                const channelModerator = item.moderator?.username || item.moderator_username || 'Sistem';
                const channelActionText = item.action === 'create' ? 'kanal oluşturdu' : 
                                         item.action === 'delete' ? 'kanal sildi' : 
                                         item.action === 'update' ? 'kanal güncelledi' : 
                                         item.action === 'permission_update' ? 'kanal izinlerini güncelledi' : 
                                         item.action === 'overwrite_update' ? 'rol izinlerini güncelledi' : 
                                         'kanal işlemi yaptı';
                return `${channelModerator} ${channelActionText}`;
            case 'emojis-tab':
                const emojiModerator = item.moderator?.username || item.user?.username || 'Sistem';
                const emojiActionText = item.action === 'create' ? 'emoji oluşturdu' : 
                                       item.action === 'delete' ? 'emoji sildi' : 
                                       item.action === 'update' ? 'emoji güncelledi' : 
                                       'emoji işlemi yaptı';
                const emojiName = item.emoji?.name || item.emoji_name || 'Bilinmeyen Emoji';
                return `${emojiModerator} ${emojiActionText}: ${emojiName}`;
            case 'invites-tab':
                const inviteUser = item.user?.username || item.moderator?.username || 'Sistem';
                const inviteActionText = item.action === 'create' ? 'davet oluşturdu' : 
                                        item.action === 'delete' ? 'davet sildi' : 
                                        item.action === 'use' ? 'davet kullandı' : 
                                        'davet işlemi yaptı';
                const inviteCode = item.invite?.code || 'Bilinmeyen Davet';
                return `${inviteUser} ${inviteActionText}: ${inviteCode}`;
            case 'server-settings-tab':
                return `${item.moderator_username} ${item.action} ${item.setting_name}`;
            default:
                return 'Unknown action';
        }
    }
    
    function getLogDetails(item, tabId) {
        const details = [];
        
        switch(tabId) {
            case 'messages-tab':
                if (item.content) details.push(`İçerik: ${item.content.substring(0, 100)}${item.content.length > 100 ? '...' : ''}`);
                if (item.channel?.name || item.channel_name) details.push(`Kanal: ${item.channel?.name || item.channel_name}`);
                if (item.attachments_count > 0) details.push(`Ekler: ${item.attachments_count} dosya`);
                if (item.mentions_count > 0) details.push(`Etiketler: ${item.mentions_count} kullanıcı`);
                if (item.message_id) details.push(`Mesaj ID: ${item.message_id}`);
                break;
            case 'voice-tab':
                if (item.channel?.name || item.channel_name) details.push(`Kanal: ${item.channel?.name || item.channel_name}`);
                if (item.duration && item.action === 'leave') {
                    const hours = Math.floor(item.duration / 3600);
                    const minutes = Math.floor((item.duration % 3600) / 60);
                    const seconds = item.duration % 60;
                    
                    let durationText = '';
                    if (hours > 0) durationText += `${hours} saat `;
                    if (minutes > 0) durationText += `${minutes} dakika `;
                    if (seconds > 0) durationText += `${seconds} saniye`;
                    
                    details.push(`Süre: ${durationText.trim()}`);
                }
                break;
            case 'roles-tab':
                if (item.user) details.push(`Kullanıcı: ${item.user.username} (${item.user.id})`);
                if (item.role) details.push(`Rol: ${item.role.name} (${item.role.id})`);
                if (item.moderator) details.push(`Moderatör: ${item.moderator.username}`);
                if (item.reason) details.push(`Sebep: ${item.reason}`);
                break;
            case 'channels-tab':
                if (item.channel?.name || item.channel_name) details.push(`Kanal: ${item.channel?.name || item.channel_name}`);
                if (item.channel?.type || item.channel_type) {
                    const channelTypes = {
                        0: 'Metin Kanalı',
                        2: 'Ses Kanalı',
                        4: 'Kategori',
                        5: 'Duyuru Kanalı',
                        13: 'Sahne Kanalı',
                        15: 'Forum Kanalı',
                        16: 'Medya Kanalı'
                    };
                    const typeText = channelTypes[item.channel?.type || item.channel_type] || 'Bilinmeyen';
                    details.push(`Tür: ${typeText}`);
                }
                if (item.changes?.oldName && item.changes?.newName) {
                    details.push(`İsim: ${item.changes.oldName} → ${item.changes.newName}`);
                }
                if (item.reason) {
                    details.push(`Sebep: ${item.reason}`);
                }
                break;
            case 'emojis-tab':
                if (item.emoji?.name || item.emoji_name) details.push(`Emoji: ${item.emoji?.name || item.emoji_name}`);
                if (item.emoji?.id || item.emoji_id) details.push(`ID: ${item.emoji?.id || item.emoji_id}`);
                if (item.moderator?.username || item.user?.username) details.push(`Kullanıcı: ${item.moderator?.username || item.user?.username}`);
                if (item.reason) details.push(`Sebep: ${item.reason}`);
                break;
            case 'invites-tab':
                if (item.invite?.code || item.invite_code) details.push(`Davet: ${item.invite?.code || item.invite_code}`);
                if (item.invite?.channel_name || item.channel_name) details.push(`Kanal: ${item.invite?.channel_name || item.channel_name}`);
                if (item.invite?.uses !== undefined) {
                    const usesText = item.invite.max_uses ? `${item.invite.uses}/${item.invite.max_uses}` : `${item.invite.uses}`;
                    details.push(`Kullanım: ${usesText}`);
                }
                if (item.invite?.expires_at) {
                    const expiresDate = new Date(item.invite.expires_at).toLocaleString('tr-TR');
                    details.push(`Bitiş: ${expiresDate}`);
                }
                if (item.moderator?.username || item.user?.username) details.push(`Kullanıcı: ${item.moderator?.username || item.user?.username}`);
                if (item.reason) details.push(`Sebep: ${item.reason}`);
                break;
            case 'server-settings-tab':
                if (item.old_value && item.new_value) {
                    details.push(`From: ${item.old_value}`);
                    details.push(`To: ${item.new_value}`);
                }
                break;
        }
        
        return details.map(detail => `<span>${detail}</span>`).join('');
    }
    


    // Add search on Enter key
    document.addEventListener('DOMContentLoaded', function() {
        const searchInput = document.getElementById('userSearch');
        if (searchInput) {
            searchInput.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    searchUsers();
                }
            });
        }
    });

    // Load login history when purchase-history section is shown
    const originalShowContent = showContent;
    showContent = function(section) {
        originalShowContent(section);
        if (section === 'purchase-history') {
            loadLoginHistory();
        }
    };

// Global Login History Functions
let currentPage = 1;
let totalPages = 1;
let currentSearchQuery = '';

async function loadLoginHistory() {
    const usersGrid = document.getElementById('usersGrid');
    const limit = document.getElementById('userLimit').value;
    
    if (usersGrid) {
        usersGrid.innerHTML = '<div class="loading-spinner">Loading users...</div>';
    }

    try {
        // Load stats first
        await loadLoginStats();
        
        // Build API URL
        let url = `/api/loginLog/logindb?limit=${limit}&page=${currentPage}`;
        if (currentSearchQuery) {
            url += `&search=${encodeURIComponent(currentSearchQuery)}`;
        }

        const response = await fetch(url);
        const data = await response.json();

        if (data.success) {
            renderUsers(data.users);
            updatePagination(data.page, data.totalPages, data.total);
        } else {
            showError('Failed to load users');
        }
    } catch (error) {
        console.error('Error loading login history:', error);
        showError('Error loading users');
    }
}

async function loadLoginStats() {
    try {
        const response = await fetch('/api/loginLog/stats/overview');
        const data = await response.json();

        if (data.success) {
            document.getElementById('totalUsers').textContent = data.stats.total;
            document.getElementById('todayUsers').textContent = data.stats.today;
            document.getElementById('weekUsers').textContent = data.stats.thisWeek;
            document.getElementById('monthUsers').textContent = data.stats.thisMonth;
        }
    } catch (error) {
        console.error('Error loading stats:', error);
    }
}

function renderUsers(users) {
    const usersGrid = document.getElementById('usersGrid');
    
    if (!users || users.length === 0) {
        usersGrid.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-users"></i>
                <h4>No users found</h4>
                <p>No users match your current search criteria.</p>
            </div>
        `;
        return;
    }

    usersGrid.innerHTML = users.map(user => `
        <div class="user-card" onclick="viewUserDetails('${user.discord_id}')" title="Click to view details" style="background: linear-gradient(135deg, rgba(0,123,255,0.08), rgba(0,212,255,0.05)); box-shadow: 0 6px 32px rgba(0,0,0,0.10); position: relative;">
            <div class="user-card-header" style="display: flex; align-items: center; gap: 1.2rem; margin-bottom: 1.5rem;">
                <div class="user-avatar" style="box-shadow: 0 2px 12px rgba(0,123,255,0.10); flex-shrink: 0;">
                    <img src="${user.avatar_url}" alt="${user.username}" onerror="this.src='https://cdn.discordapp.com/embed/avatars/${parseInt(user.discord_id) % 5}.png'">
                </div>
                <div class="user-info-main" style="flex: 1; min-width: 0;">
                    <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.3rem;">
                        <span class="user-name" style="font-size: 1.4rem; font-weight: 700;">${user.username}</span>
                        <span class="badge" style="background: #7289da; color: #fff; font-size: 0.75rem; border-radius: 6px; padding: 2px 8px;"><i class="fab fa-discord"></i></span>
                    </div>
                    <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.3rem;">
                        <span class="user-discord-id" style="color: #888; font-size: 0.95rem;"><i class="fas fa-id-badge"></i> ${user.discord_id}</span>
                    </div>
                    <div style="display: flex; align-items: center; gap: 0.5rem;">
                        <span class="user-email" style="color: #00d4ff; font-size: 0.9rem;"><i class="fas fa-envelope"></i> ${user.email || 'Not provided'}</span>
                    </div>
                </div>
            </div>
            
            <div class="user-card-footer" style="border-top: 1.5px solid var(--border-color); padding-top: 1.2rem; display: flex; justify-content: space-between; align-items: center;">
                <div class="user-timestamps" style="display: flex; flex-direction: column; gap: 0.3rem;">
                    <div class="timestamp" style="font-size: 0.85rem; color: #888;">
                        <span class="timestamp-label" style="color: #fff; font-weight: 500;"><i class="fas fa-calendar-plus"></i> Created:</span> ${user.formatted_created}
                    </div>
                    <div class="timestamp" style="font-size: 0.85rem; color: #888;">
                        <span class="timestamp-label" style="color: #fff; font-weight: 500;"><i class="fas fa-calendar-check"></i> Updated:</span> ${user.formatted_updated}
                    </div>
                </div>
                <div class="user-actions" style="display: flex; gap: 0.5rem;">
                    <button class="user-action-btn" onclick="event.stopPropagation(); openDiscordProfile('${user.discord_id}')" title="Open Discord Profile" style="background: #7289da; border-color: #7289da;"><i class="fab fa-discord"></i></button>
                    <button class="user-action-btn" onclick="event.stopPropagation(); editUser('${user.discord_id}')" title="Edit User" style="background: #28a745; border-color: #28a745;"><i class="fas fa-edit"></i></button>
                    <button class="user-action-btn danger" onclick="event.stopPropagation(); deleteUser('${user.discord_id}')" title="Delete User" style="background: #dc3545; border-color: #dc3545;"><i class="fas fa-trash"></i></button>
                </div>
            </div>
            <div style="position: absolute; left: 0; right: 0; bottom: 0; height: 6px; background: linear-gradient(90deg, #007bff, #00d4ff); border-radius: 0 0 12px 12px;"></div>
        </div>
    `).join('');
}

function updatePagination(currentPageNum, totalPagesNum, totalUsers) {
    const pagination = document.getElementById('pagination');
    const pageInfo = document.getElementById('pageInfo');
    const prevBtn = document.getElementById('prevPage');
    const nextBtn = document.getElementById('nextPage');

    currentPage = currentPageNum;
    totalPages = totalPagesNum;

    if (totalPages <= 1) {
        pagination.style.display = 'none';
        return;
    }

    pagination.style.display = 'flex';
    pageInfo.textContent = `Page ${currentPage} of ${totalPages} (${totalUsers} total users)`;
    
    prevBtn.disabled = currentPage <= 1;
    nextBtn.disabled = currentPage >= totalPages;
}

function changePage(direction) {
    const newPage = currentPage + direction;
    if (newPage >= 1 && newPage <= totalPages) {
        currentPage = newPage;
        loadLoginHistory();
    }
}

function searchUsers() {
    const searchInput = document.getElementById('userSearch');
    currentSearchQuery = searchInput.value.trim();
    currentPage = 1; // Reset to first page
    loadLoginHistory();
}

function viewUserDetails(discordId) {
    // Open user details in a new window or modal
    window.open(`https://discord.com/users/${discordId}`, '_blank');
}

function openDiscordProfile(discordId) {
    window.open(`https://discord.com/users/${discordId}`, '_blank');
}

function editUser(discordId) {
    // Implement edit user functionality
    alert(`Edit user ${discordId} - This feature will be implemented soon.`);
}

function deleteUser(discordId) {
    if (confirm(`Are you sure you want to delete user ${discordId}?`)) {
        // Implement delete user functionality
        alert(`Delete user ${discordId} - This feature will be implemented soon.`);
    }
}

function showError(message) {
    const usersGrid = document.getElementById('usersGrid');
    if (usersGrid) {
        usersGrid.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-exclamation-triangle"></i>
                <h4>Error</h4>
                <p>${message}</p>
                <button onclick="loadLoginHistory()" class="user-action-btn" style="margin-top: 1rem;">
                    <i class="fas fa-redo"></i> Retry
                </button>
            </div>
        `;
    }
}

// Add search on Enter key
document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('userSearch');
    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                searchUsers();
            }
        });
    }
});

// Activity History Functions
let activityCharts = {};

function initializeActivityHistory() {
    loadActivityStats();
    initializeActivityCharts();
    loadRecentActivityFeed();
}

async function loadActivityStats() {
    try {
        const response = await fetch('/api/activity-history/stats');
        const data = await response.json();
        
        if (data.success) {
            const stats = data.stats;
            document.getElementById('totalMessages').textContent = stats.totalMessages.toLocaleString();
            document.getElementById('voiceActivity').textContent = stats.voiceActivity + '%';
            document.getElementById('activeUsers').textContent = stats.activeUsers.toLocaleString();
            document.getElementById('avgSession').textContent = stats.avgSession + ' min';
        } else {
            console.error('Activity stats yüklenirken hata:', data.error);
        }
    } catch (error) {
        console.error('Activity stats API hatası:', error);
    }
}

async function initializeActivityCharts() {
    // Main Activity Chart
    const activityCtx = document.getElementById('activityChart');
    if (activityCtx) {
        try {
            const response = await fetch('/api/activity-history/chart/overview?period=7d');
            const data = await response.json();
            
            if (data.success) {
                activityCharts.activity = new Chart(activityCtx, {
                    type: 'line',
                    data: data.data,
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            legend: {
                                labels: {
                                    color: '#fff',
                                    font: {
                                        size: 12
                                    }
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
        } catch (error) {
            console.error('Activity chart yüklenirken hata:', error);
        }
    }

    // Channel Activity Chart
    const channelCtx = document.getElementById('channelChart');
    if (channelCtx) {
        try {
            const response = await fetch('/api/activity-history/chart/channels?type=messages');
            const data = await response.json();
            
            if (data.success) {
                activityCharts.channel = new Chart(channelCtx, {
                    type: 'bar',
                    data: data.data,
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            legend: {
                                display: false
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
        } catch (error) {
            console.error('Channel chart yüklenirken hata:', error);
        }
    }

    // Hourly Activity Chart
    const hourlyCtx = document.getElementById('hourlyChart');
    if (hourlyCtx) {
        try {
            const response = await fetch('/api/activity-history/chart/hourly');
            const data = await response.json();
            
            if (data.success) {
                activityCharts.hourly = new Chart(hourlyCtx, {
                    type: 'line',
                    data: data.data,
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            legend: {
                                display: false
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
        } catch (error) {
            console.error('Hourly chart yüklenirken hata:', error);
        }
    }

    // User Distribution Chart
    const userDistCtx = document.getElementById('userDistributionChart');
    if (userDistCtx) {
        try {
            const response = await fetch('/api/activity-history/chart/user-distribution');
            const data = await response.json();
            
            if (data.success) {
                activityCharts.userDistribution = new Chart(userDistCtx, {
                    type: 'doughnut',
                    data: data.data,
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            legend: {
                                position: 'bottom',
                                labels: {
                                    color: '#fff',
                                    font: {
                                        size: 12
                                    }
                                }
                            }
                        }
                    }
                });
            }
        } catch (error) {
            console.error('User distribution chart yüklenirken hata:', error);
        }
    }

    // Add chart control event listeners
    addChartControls();
}

function addChartControls() {
    // Period controls for main activity chart
    document.querySelectorAll('[data-period]').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('[data-period]').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            updateActivityChart(this.dataset.period);
        });
    });

    // Type controls for channel chart
    document.querySelectorAll('[data-type]').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('[data-type]').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            updateChannelChart(this.dataset.type);
        });
    });
}

async function updateActivityChart(period) {
    try {
        const response = await fetch(`/api/activity-history/chart/overview?period=${period}`);
        const data = await response.json();
        
        if (data.success && activityCharts.activity) {
            activityCharts.activity.data = data.data;
            activityCharts.activity.update();
        }
    } catch (error) {
        console.error('Activity chart güncellenirken hata:', error);
    }
}

async function updateChannelChart(type) {
    try {
        const response = await fetch(`/api/activity-history/chart/channels?type=${type}`);
        const data = await response.json();
        
        if (data.success && activityCharts.channel) {
            activityCharts.channel.data = data.data;
            activityCharts.channel.update();
        }
    } catch (error) {
        console.error('Channel chart güncellenirken hata:', error);
    }
}

async function loadRecentActivityFeed() {
    const activityFeed = document.getElementById('activityFeed');
    if (!activityFeed) return;

    try {
        const response = await fetch('/api/activity-history/recent-activities?limit=10');
        const data = await response.json();
        
        if (data.success) {
            activityFeed.innerHTML = data.activities.map(activity => `
                <div class="activity-feed-item" style="display: flex; align-items: center; gap: 1rem; padding: 1rem; background: rgba(255,255,255,0.05); border-radius: 8px; margin-bottom: 0.5rem; transition: all 0.3s ease;">
                    <div class="activity-icon" style="width: 40px; height: 40px; border-radius: 50%; background: linear-gradient(135deg, #007bff, #00d4ff); display: flex; align-items: center; justify-content: center; color: white; font-size: 1rem;">
                        <i class="${activity.icon}"></i>
                    </div>
                    <div class="activity-content" style="flex: 1;">
                        <div class="activity-text" style="color: #fff; font-weight: 500; margin-bottom: 0.25rem;">
                            <span style="color: #00d4ff; font-weight: 600;">${activity.user}</span> ${activity.content}
                        </div>
                        <div class="activity-time" style="color: #888; font-size: 0.85rem;">
                            ${activity.time}
                        </div>
                    </div>
                </div>
            `).join('');
        } else {
            activityFeed.innerHTML = '<div class="no-activities" style="text-align: center; color: #888; padding: 2rem;">No recent activities found</div>';
        }
    } catch (error) {
        console.error('Recent activities yüklenirken hata:', error);
        activityFeed.innerHTML = '<div class="no-activities" style="text-align: center; color: #888; padding: 2rem;">Error loading activities</div>';
    }
}

function refreshActivityFeed() {
    const btn = event.target.closest('.refresh-btn');
    const icon = btn.querySelector('i');
    icon.style.animation = 'spin 1s linear';
    
    setTimeout(() => {
        loadRecentActivityFeed();
        icon.style.animation = '';
        showNotification('Activity feed refreshed', 'success');
    }, 1000);
}

// Initialize activity history when the section is shown
const originalShowContentActivity = showContent;
showContent = function(section) {
    originalShowContentActivity(section);
    if (section === 'activity-history') {
        setTimeout(() => {
            initializeActivityHistory();
        }, 100);
    }
};
