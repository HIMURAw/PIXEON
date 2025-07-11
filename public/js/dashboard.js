document.addEventListener('DOMContentLoaded', function () {
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
    function showContent(section) {
        console.log('Switching to section:', section);
        
        // Tüm content section'ları gizle
        const allContentSections = document.querySelectorAll('.dashboard-content, .purchase-dashboard-content, .activity-dashboard-content, .discord-login-history-content, .purchase-history-content, .activity-history-content, .settings-content, .comments-content, .ticket-content, .add-product-content');
        allContentSections.forEach(content => {
            content.style.display = 'none';
        });
        
        // Seçili olanı göster
        const targetSection = document.getElementById(section);
        if (targetSection) {
            targetSection.style.display = 'block';
            console.log('Successfully showed:', section);
        } else {
            console.error('Section not found:', section);
        }
    }

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
    const originalShowContent = showContent;
    showContent = function(section) {
        originalShowContent(section);
        if (section === 'purchase-dashboard-content') {
            loadPurchaseDashboard();
        } else if (section === 'activity-dashboard-content') {
            loadActivityDashboard();
        }
    };

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

function updateActivityChart() {
    const period = document.getElementById('activityChartPeriod').value;
    const activityChartCanvas = document.getElementById('activityChart');
    
    if (activityChartCanvas && typeof Chart !== 'undefined') {
        const ctx = activityChartCanvas.getContext('2d');
        
        // Destroy existing chart if it exists
        if (window.activityChart) {
            window.activityChart.destroy();
        }
        
        let labels, data;
        
        if (period === '24') {
            labels = ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00', '24:00'];
            data = [20, 15, 30, 80, 95, 70, 25];
        } else if (period === '7') {
            labels = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'];
            data = [65, 70, 85, 90, 95, 100, 80];
        } else {
            labels = ['1. Hafta', '2. Hafta', '3. Hafta', '4. Hafta'];
            data = [75, 82, 88, 92];
        }
        
        window.activityChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Aktivite',
                    data: data,
                    borderColor: '#007bff',
                    backgroundColor: 'rgba(0, 123, 255, 0.1)',
                    tension: 0.4,
                    fill: true
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

// Initialize Activity Dashboard when the page loads
document.addEventListener('DOMContentLoaded', function() {
    // Load activity dashboard data when the page loads
    loadActivityDashboard();
    
    // Initialize activity chart
    updateActivityChart();
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
const originalShowContent = showContent;
showContent = function(section) {
    originalShowContent(section);
    if (section === 'purchase-dashboard-content') {
        loadPurchaseDashboard();
    } else if (section === 'activity-dashboard-content') {
        loadActivityDashboard();
    } else if (section === 'comments-content') {
        loadComments();
    } else if (section === 'ticket-content') {
        loadTickets();
    } else if (section === 'add-product-content') {
        initializeProductForm();
    }
};