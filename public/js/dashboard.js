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
        'fivem-players': document.querySelector('.fivem-players-content'),
        'discord-members': document.querySelector('.discord-members-content'),
        'players': document.querySelector('.players-content'),
        'servers': document.querySelector('.servers-content'),
        'bans': document.querySelector('.bans-content'),
        'settings': document.querySelector('.settings-content'),
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
            showContent(this.getAttribute('href').replace('#', ''));
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
            showContent(this.getAttribute('href').replace('#', ''));
            // Aktiflik vurgusu
            logSubitems.forEach(i => i.parentElement.classList.remove('active'));
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
                updateActiveBansCount();
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