document.addEventListener('DOMContentLoaded', function () {
    // Sidebar toggle
    const sidebarToggle = document.getElementById('sidebarToggle');
    const sidebar = document.querySelector('.sidebar');
    const mainContent = document.querySelector('.main-content');

    sidebarToggle.addEventListener('click', () => {
        sidebar.classList.toggle('active');
    });

    // Logout functionality
    const logoutBtn = document.getElementById('logoutBtn');
    logoutBtn.addEventListener('click', (e) => {
        e.preventDefault();
        // Token'ı sil
        document.cookie = 'auth_token=; Max-Age=-99999999; path=/';
        // Ana sayfaya yönlendir
        window.location.href = '/';
    });

    // Refresh buttons
    const refreshButtons = document.querySelectorAll('.btn-refresh');
    refreshButtons.forEach(button => {
        button.addEventListener('click', function () {
            const icon = this.querySelector('i');
            icon.style.animation = 'spin 1s linear';
            setTimeout(() => {
                icon.style.animation = '';
            }, 1000);
            // Burada verileri yenileme işlemi yapılabilir
        });
    });

    // Search functionality
    const searchInput = document.querySelector('.search-bar input');
    searchInput.addEventListener('input', function (e) {
        const searchTerm = e.target.value.toLowerCase();
        // Burada arama işlemi yapılabilir
    });

    // Notifications
    const notifications = document.querySelector('.notifications');
    notifications.addEventListener('click', function () {
        // Burada bildirimler modalı açılabilir
        alert('Notifications feature coming soon!');
    });

    // Admin profile
    const adminProfile = document.querySelector('.admin-profile');
    adminProfile.addEventListener('click', function () {
        // Burada profil menüsü açılabilir
        alert('Profile menu coming soon!');
    });

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
