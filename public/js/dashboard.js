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

    // İçerik gösterme fonksiyonu
    function showContent(section) {
        console.log('Switching to section:', section);
        
        // Tüm content section'ları gizle
        const allContentSections = document.querySelectorAll('.dashboard-content, .purchase-dashboard-content, .activity-dashboard-content, .discord-login-history-content, .purchase-history-content, .activity-history-content, .settings-content');
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