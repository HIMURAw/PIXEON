function showContent(section) {
    // Tüm content section'ları gizle
    const allContentSections = document.querySelectorAll('.dashboard-content, .purchase-dashboard-content, .activity-dashboard-content, .discord-login-history-content, .purchase-history-content, .activity-history-content, .settings-content, .comments-content, .ticket-content, .add-product-content, .comprehensive-logs-content');
    allContentSections.forEach(content => {
        content.style.display = 'none';
    });
    // Seçili olanı göster
    const targetSection = document.getElementById(section);
    if (targetSection) {
        targetSection.style.display = 'block';
        // Eğer comprehensive-logs ise tab fonksiyonunu çağır
        if (section === 'comprehensive-logs') {
            initializeComprehensiveLogs();
        }
    } else {
        // console.error('Section not found:', section);
    }
}

document.addEventListener('DOMContentLoaded', function () {
    
    
    loadDiscordLoginHistory()
    
    
    
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
                    endpoint = '/api/discordUsers/messageLog';
                    break;
                case 'voice-tab':
                    endpoint = '/api/discordUsers/voiceLog';
                    break;
                case 'roles-tab':
                    endpoint = '/api/discordUsers/roleLog';
                    break;
                case 'channels-tab':
                    endpoint = '/api/discordUsers/channelLog';
                    break;
                case 'emojis-tab':
                    endpoint = '/api/discordUsers/emojiLog';
                    break;
                case 'invites-tab':
                    endpoint = '/api/discordUsers/inviteLog';
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
    
    function getLogTitle(item, tabId) {
        switch(tabId) {
            case 'messages-tab':
                return `${item.username} ${item.action === 'create' ? 'sent' : item.action === 'edit' ? 'edited' : 'deleted'} a message`;
            case 'voice-tab':
                return `${item.username} ${item.action} voice channel`;
            case 'roles-tab':
                return `${item.moderator_username} ${item.action} ${item.role_name} role for ${item.username}`;
            case 'channels-tab':
                return `${item.moderator_username} ${item.action} channel ${item.channel_name}`;
            case 'emojis-tab':
                return `${item.moderator_username} ${item.action} emoji ${item.emoji_name}`;
            case 'invites-tab':
                return `${item.creator_username} ${item.action} invite ${item.invite_code}`;
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
                if (item.content) details.push(`Content: ${item.content.substring(0, 50)}${item.content.length > 50 ? '...' : ''}`);
                if (item.channel_name) details.push(`Channel: ${item.channel_name}`);
                break;
            case 'voice-tab':
                if (item.channel_name) details.push(`Channel: ${item.channel_name}`);
                break;
            case 'roles-tab':
                if (item.username) details.push(`User: ${item.username}`);
                if (item.role_name) details.push(`Role: ${item.role_name}`);
                break;
            case 'channels-tab':
                if (item.channel_type) details.push(`Type: ${item.channel_type}`);
                break;
            case 'invites-tab':
                if (item.channel_name) details.push(`Channel: ${item.channel_name}`);
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
    
    // Update showContent to include comprehensive logs
    // const originalShowContent = showContent; // This line is removed as showContent is now global
    // showContent = function(section) { // This block is removed as showContent is now global
    //     originalShowContent(section);
    //     if (section === 'purchase-dashboard-content') {
    //         loadPurchaseDashboard();
    //     } else if (section === 'activity-dashboard-content') {
    //         loadActivityDashboard();
    //     } else if (section === 'comments-content') {
    //         loadComments();
    //     } else if (section === 'ticket-content') {
    //         loadTickets();
    //     } else if (section === 'add-product-content') {
    //         initializeProductForm();
    //     } else if (section === 'discord-login-history') {
    //         loadDiscordLoginHistory();
    //     } else if (section === 'comprehensive-logs') {
    //         initializeComprehensiveLogs();
    //     }
    // };