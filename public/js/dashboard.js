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
        'dashboard': document.querySelector('.dashboard-content'),
        'players': document.querySelector('.players-content'),
        'servers': document.querySelector('.servers-content'),
        'bans': document.querySelector('.bans-content'),
        'settings': document.querySelector('.settings-content'),
        'maps': document.querySelector('.map-content')
    };

    // İlk yüklemede dashboard içeriğini göster
    showContent('dashboard');

    menuItems.forEach(item => {
        item.addEventListener('click', (e) => {
            // Eğer sidebar-parent (dashboard) ise, bu event çalışmasın
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

    dashboardToggle.addEventListener('click', function(e) {
        e.preventDefault();
        dashboardMenu.classList.toggle('open');
        // Alt menüyü göster/gizle
        if (dashboardMenu.classList.contains('open')) {
            dashboardSubmenu.style.display = 'block';
        } else {
            dashboardSubmenu.style.display = 'none';
        }
    });

    // Collapsible sidebar menu for Players
    const playersMenu = document.getElementById('playersMenu');
    const playersToggle = playersMenu.querySelector('.sidebar-parent-toggle');
    const playersSubmenu = playersMenu.querySelector('.sidebar-submenu');

    playersToggle.addEventListener('click', function(e) {
        e.preventDefault();
        playersMenu.classList.toggle('open');
        // Alt menüyü göster/gizle
        if (playersMenu.classList.contains('open')) {
            playersSubmenu.style.display = 'block';
        } else {
            playersSubmenu.style.display = 'none';
        }
    });

    // Alt menü itemleri için içerik gösterme
    const dashboardSubitems = document.querySelectorAll('.dashboard-subitem');
    dashboardSubitems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            showContent(this.getAttribute('href').replace('#', ''));
            // Aktiflik vurgusu
            dashboardSubitems.forEach(i => i.parentElement.classList.remove('active'));
            this.parentElement.classList.add('active');
        });
    });

    // Players alt menü itemleri için içerik gösterme
    const playersSubitems = document.querySelectorAll('.players-subitem');
    playersSubitems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            showContent(this.getAttribute('href').replace('#', ''));
            // Aktiflik vurgusu
            playersSubitems.forEach(i => i.parentElement.classList.remove('active'));
            this.parentElement.classList.add('active');
        });
    });

    // İçerik gösterme fonksiyonunu güncelle
    function showContent(section) {
        // Tüm ana içerikleri gizle
        Object.values(contentSections).forEach(content => {
            if (content) content.style.display = 'none';
        });
        // Hem discord hem fivem dashboard içeriklerini gizle
        var discordDashboard = document.getElementById('discord-dashboard-content');
        var fivemDashboard = document.getElementById('fivem-dashboard-content');
        if (discordDashboard) discordDashboard.style.display = 'none';
        if (fivemDashboard) fivemDashboard.style.display = 'none';
        // Seçili olanı göster
        if (section === 'fivem-dashboard') {
            if (fivemDashboard) fivemDashboard.style.display = 'block';
        } else if (section === 'discord-dashboard') {
            if (discordDashboard) discordDashboard.style.display = 'block';
        } else if (contentSections[section]) {
            contentSections[section].style.display = 'block';
            // Dashboard içeriği gösterildiğinde verileri yükle
            if (section === 'dashboard') {
                console.log('Loading dashboard data...');
                if (typeof updateServerStats === 'function') updateServerStats();
                if (typeof refreshUserHistory === 'function') refreshUserHistory();
                if (typeof refreshServerActivity === 'function') refreshServerActivity();
            }
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
            // Profil menüsü
        });
    }

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
        switch(type) {
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
});
