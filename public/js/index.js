document.addEventListener('DOMContentLoaded', () => {
    const navbar = document.querySelector('.navbar');
    const navbarToggle = document.getElementById('navbarToggle');
    const navbarMenu = document.querySelector('.navbar-menu');
    const menuItems = document.querySelectorAll('.navbar-menu a');
    const loginBtn = document.getElementById('loginBtn');
    const loginModal = document.getElementById('loginModal');
    const closeModal = document.getElementById('closeModal');
    const loginForm = document.getElementById('loginForm');

    // Scroll effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Toggle menu
    navbarToggle.addEventListener('click', () => {
        navbarToggle.classList.toggle('active');
        navbarMenu.classList.toggle('active');
        document.body.style.overflow = navbarMenu.classList.contains('active') ? 'hidden' : '';
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!navbarToggle.contains(e.target) && !navbarMenu.contains(e.target)) {
            navbarMenu.classList.remove('active');
            navbarToggle.classList.remove('active');
            document.body.style.overflow = '';
        }
    });

    // Close menu when clicking on a menu item
    menuItems.forEach(item => {
        item.addEventListener('click', () => {
            navbarMenu.classList.remove('active');
            navbarToggle.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // Login Modal
    loginBtn.addEventListener('click', async () => {
        const token = getCookie('auth_token');
        if (token) {
            // SQL'den rollerini çek
            const res = await fetch('/api/auth/discord-roles', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            // adminRoleId'yi configten çek
            const cfgRes = await fetch('/api/discord/oauth-config');
            const { adminRoleId } = await cfgRes.json();

            if (data.roles && data.roles.includes(adminRoleId)) {
                window.location.href = '/dashboard';
            } else {
                loginModal.style.display = 'flex';
            }
        } else {
            loginModal.style.display = 'flex';
        }
    });

    closeModal.addEventListener('click', () => {
        loginModal.style.display = 'none';
    });

    window.addEventListener('click', (e) => {
        if (e.target === loginModal) {
            loginModal.style.display = 'none';
        }
    });

    // Cookie işlemleri için yardımcı fonksiyonlar
    function setCookie(name, value, days) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        const expires = "expires=" + date.toUTCString();
        document.cookie = name + "=" + value + ";" + expires + ";path=/;SameSite=Lax;Secure";
    }

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

    function deleteCookie(name) {
        document.cookie = name + '=; Max-Age=-99999999; path=/';
    }

    // Admin rol kontrolü
    async function checkAdminRole() {
        try {
            console.log('=== Admin Role Check Başladı ===');
            
            const encodedUserData = getCookie('auth_token');
            if (!encodedUserData) {
                console.log('No auth token found');
                return false;
            }
            
            // Çift URL-decode yap
            let decodedUserData = decodeURIComponent(encodedUserData);
            if (decodedUserData.includes('%')) {
                decodedUserData = decodeURIComponent(decodedUserData);
            }
            
            const userData = JSON.parse(decodedUserData);
            console.log('User data from cookie:', userData);
            
            if (!userData || !userData.username) {
                console.log('No username in user data');
                return false;
            }
            
            // Admin role ID'yi config'den çek
            console.log('Fetching admin role ID from config...');
            const configResponse = await fetch('/auth/discord/admin-role-id');
            console.log('Config response status:', configResponse.status);
            
            if (!configResponse.ok) {
                console.log('Config response not ok');
                return false;
            }
            
            const configData = await configResponse.json();
            const adminRoleId = configData.adminRoleId;
            console.log('Admin role ID from config:', adminRoleId);
            
            // Rolleri cookie'den kontrol et
            if (!userData.roles) {
                console.log('No roles in user data');
                return false;
            }
            
            console.log('User roles from cookie:', userData.roles);
            console.log('Admin role ID to check:', adminRoleId);
            console.log('Roles includes admin role:', userData.roles.includes(adminRoleId));
            
            const isAdmin = userData.roles.includes(adminRoleId);
            console.log('Is admin:', isAdmin);
            
            return isAdmin;
        } catch (error) {
            console.error('Admin role check error:', error);
            return false;
        }
    }

    // Admin login butonunu yönet
    async function manageAdminButton() {
        console.log('=== Manage Admin Button Başladı ===');
        
        const adminBtn = document.getElementById('adminLoginBtn');
        console.log('Admin button element:', adminBtn);
        
        const isAdmin = await checkAdminRole();
        console.log('Is admin result:', isAdmin);
        
        if (isAdmin) {
            console.log('Showing admin button');
            adminBtn.style.display = 'inline-block';
            adminBtn.addEventListener('click', () => {
                console.log('Admin button clicked, redirecting to dashboard');
                window.location.href = '/dashboard';
            });
        } else {
            console.log('Hiding admin button');
            adminBtn.style.display = 'none';
        }
    }

    // Kullanıcı profilini göster - ANA FONKSİYON
    async function showUserProfile() {
        const encodedUserData = getCookie('auth_token');
        console.log('Encoded user data from cookie:', encodedUserData); // Debug için
        
        if (!encodedUserData) {
            console.log('User data bulunamadı - default durum gösteriliyor');
            // Default durum - giriş yapmamış kullanıcı
            document.getElementById('user-profile').style.display = 'flex';
            document.getElementById('user-avatar').src = 'https://cdn.discordapp.com/embed/avatars/0.png';
            document.getElementById('user-name').textContent = 'Guest';
            
            // Login butonunu göster
            document.getElementById('loginBtn').style.display = 'block';
            
            // Çıkış butonunu kaldır (eğer varsa)
            const logoutBtn = document.getElementById('logout-btn');
            if (logoutBtn) logoutBtn.remove();
            
            return;
        }
        
        try {
            // Çift URL-decode yap (çift encode sorunu için)
            let decodedUserData = decodeURIComponent(encodedUserData);
            console.log('First decode:', decodedUserData);
            
            // Eğer hala encode varsa, tekrar decode et
            if (decodedUserData.includes('%')) {
                decodedUserData = decodeURIComponent(decodedUserData);
                console.log('Second decode:', decodedUserData);
            }
            
            const userData = JSON.parse(decodedUserData);
            console.log('Decoded user data:', userData);
            
            if (userData && userData.username) {
                console.log('Kullanıcı profili gösteriliyor:', userData.username);
                console.log('Setting username to:', userData.username);
                console.log('Setting avatar to:', userData.avatar);
                
                document.getElementById('user-profile').style.display = 'flex';
                document.getElementById('user-name').textContent = userData.username;
                document.getElementById('user-avatar').src = userData.avatar;
                
                // Login butonunu gizle
                document.getElementById('loginBtn').style.display = 'none';
                
                // Çıkış butonu ekle (eğer yoksa)
                if (!document.getElementById('logout-btn')) {
                    const logoutBtn = document.createElement('button');
                    logoutBtn.id = 'logout-btn';
                    logoutBtn.innerHTML = '<i class="fas fa-sign-out-alt"></i>';
                    logoutBtn.style.cssText = 'background:none; border:none; color:var(--accent-color); cursor:pointer; font-size:16px; margin-left:8px;';
                    logoutBtn.title = 'Çıkış Yap';
                    logoutBtn.addEventListener('click', () => {
                        // Onay sorusu göster
                        if (confirm('Çıkmak istediğinize emin misiniz?')) {
                            logout();
                        }
                    });
                    document.getElementById('user-profile').appendChild(logoutBtn);
                }
                
                // Admin butonunu kontrol et
                manageAdminButton();
            } else {
                console.log('Username bulunamadı veya boş');
                console.log('userData:', userData);
                // Default duruma dön
                document.getElementById('user-profile').style.display = 'flex';
                document.getElementById('user-avatar').src = 'https://cdn.discordapp.com/embed/avatars/0.png';
                document.getElementById('user-name').textContent = 'Guest';
                document.getElementById('loginBtn').style.display = 'block';
            }
        } catch (e) {
            console.error('Cookie parse error:', e);
            console.error('Problematic cookie data:', encodedUserData);
            // Hata durumunda cookie'yi temizle ve default duruma dön
            deleteCookie('auth_token');
            document.getElementById('user-profile').style.display = 'flex';
            document.getElementById('user-avatar').src = 'https://cdn.discordapp.com/embed/avatars/0.png';
            document.getElementById('user-name').textContent = 'Guest';
            document.getElementById('loginBtn').style.display = 'block';
        }
    }

    // Çıkış yapma fonksiyonu
    function logout() {
        deleteCookie('auth_token');

        // Default duruma dön
        document.getElementById('user-profile').style.display = 'flex';
        document.getElementById('user-avatar').src = 'https://cdn.discordapp.com/embed/avatars/0.png';
        document.getElementById('user-name').textContent = 'Guest';
        document.getElementById('loginBtn').style.display = 'block';

        // Çıkış butonunu kaldır
        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) logoutBtn.remove();

        console.log('Çıkış yapıldı - default duruma dönüldü');
    }

    // Cookie temizleme fonksiyonu
    function clearBrokenCookie() {
        // Cookie'yi tamamen temizle
        document.cookie = "auth_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        document.cookie = "auth_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/auth/discord;";
        console.log('Broken cookie cleared');
        
        // Default duruma dön
        document.getElementById('user-profile').style.display = 'flex';
        document.getElementById('user-avatar').src = 'https://cdn.discordapp.com/embed/avatars/0.png';
        document.getElementById('user-name').textContent = 'Guest';
        document.getElementById('loginBtn').style.display = 'block';
        
        // Çıkış butonunu kaldır
        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) logoutBtn.remove();
    }

    // Sayfa yüklendiğinde kullanıcı profilini göster
    showUserProfile();
    
   
    // Add active class to current page link
    const currentPath = window.location.pathname;
    menuItems.forEach(item => {
        if (item.getAttribute('href') === currentPath) {
            item.classList.add('active');
        }
    });

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Şifre göster/gizle fonksiyonu
    const togglePassword = document.getElementById('togglePassword');
    const passwordInput = document.getElementById('password');

    togglePassword.addEventListener('click', function () {
        // Şifre tipini değiştir
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);

        // İkonu değiştir
        this.querySelector('i').classList.toggle('fa-eye');
        this.querySelector('i').classList.toggle('fa-eye-slash');
    });

    // Discord ile giriş butonu
    const discordLoginBtn = document.querySelector('.btn-discord');
    if (discordLoginBtn) {
        discordLoginBtn.addEventListener('click', async function () {
            // Sunucudan Discord OAuth ayarlarını çek
            const res = await fetch('/api/discord/oauth-config');
            const { clientId, redirectUri } = await res.json();
            const scope = 'identify email guilds guilds.members.read';
            const discordAuthUrl = `https://discord.com/api/oauth2/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=${scope}`;
            window.location.href = discordAuthUrl;
        });
    }
});
