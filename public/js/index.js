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

    // Toggle menu (sadece navbarToggle varsa)
    if (navbarToggle) {
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
    }

    // Login Modal (sadece elementler varsa)
    if (loginBtn && loginModal && closeModal) {
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
    }

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
            const discordLoginBtn = document.querySelector('.discord-btn');
            const userProfile = document.getElementById('userProfile');
            const userAvatar = document.getElementById('userAvatar');
            const userName = document.getElementById('userName');

            // Discord butonunu göster, kullanıcı profilini gizle
            if (discordLoginBtn) discordLoginBtn.style.display = 'flex';
            if (userProfile) userProfile.style.display = 'none';
            if (userAvatar) userAvatar.src = 'https://cdn.discordapp.com/embed/avatars/0.png';
            if (userName) userName.textContent = 'Guest';

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

                const discordLoginBtn = document.querySelector('.discord-btn');
                const userProfile = document.getElementById('userProfile');
                const userAvatar = document.getElementById('userAvatar');
                const userName = document.getElementById('userName');

                // Discord butonunu gizle, kullanıcı profilini göster
                if (discordLoginBtn) discordLoginBtn.style.display = 'none';
                if (userProfile) userProfile.style.display = 'flex';
                if (userName) userName.textContent = userData.username;
                if (userAvatar) userAvatar.src = userData.avatar;

                // Admin butonunu kontrol et
                manageAdminButton();
            } else {
                console.log('Username bulunamadı veya boş');
                console.log('userData:', userData);
                // Default duruma dön
                const discordLoginBtn = document.querySelector('.discord-btn');
                const userProfile = document.getElementById('userProfile');
                const userAvatar = document.getElementById('userAvatar');
                const userName = document.getElementById('userName');

                if (discordLoginBtn) discordLoginBtn.style.display = 'flex';
                if (userProfile) userProfile.style.display = 'none';
                if (userAvatar) userAvatar.src = 'https://cdn.discordapp.com/embed/avatars/0.png';
                if (userName) userName.textContent = 'Guest';
            }
        } catch (e) {
            console.error('Cookie parse error:', e);
            console.error('Problematic cookie data:', encodedUserData);
            // Hata durumunda cookie'yi temizle ve default duruma dön
            deleteCookie('auth_token');
            const discordLoginBtn = document.querySelector('.discord-btn');
            const userProfile = document.getElementById('userProfile');
            const userAvatar = document.getElementById('userAvatar');
            const userName = document.getElementById('userName');

            if (discordLoginBtn) discordLoginBtn.style.display = 'flex';
            if (userProfile) userProfile.style.display = 'none';
            if (userAvatar) userAvatar.src = 'https://cdn.discordapp.com/embed/avatars/0.png';
            if (userName) userName.textContent = 'Guest';
        }
    }

    // Çıkış yapma fonksiyonu
    function logout() {
        deleteCookie('auth_token');

        // Default duruma dön
        const discordLoginBtn = document.querySelector('.discord-btn');
        const userProfile = document.getElementById('userProfile');
        const userAvatar = document.getElementById('userAvatar');
        const userName = document.getElementById('userName');

        if (discordLoginBtn) discordLoginBtn.style.display = 'flex';
        if (userProfile) userProfile.style.display = 'none';
        if (userAvatar) userAvatar.src = 'https://cdn.discordapp.com/embed/avatars/0.png';
        if (userName) userName.textContent = 'Guest';

        console.log('Çıkış yapıldı - default duruma dönüldü');
    }

    // Cookie temizleme fonksiyonu
    function clearBrokenCookie() {
        // Cookie'yi tamamen temizle
        document.cookie = "auth_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        document.cookie = "auth_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/auth/discord;";
        console.log('Broken cookie cleared');

        // Default duruma dön
        const userProfile = document.getElementById('user-profile');
        const userAvatar = document.getElementById('user-avatar');
        const userName = document.getElementById('user-name');
        const loginBtnElement = document.getElementById('loginBtn');

        if (userProfile) userProfile.style.display = 'flex';
        if (userAvatar) userAvatar.src = 'https://cdn.discordapp.com/embed/avatars/0.png';
        if (userName) userName.textContent = 'Guest';
        if (loginBtnElement) loginBtnElement.style.display = 'block';

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

    // Şifre göster/gizle fonksiyonu (sadece elementler varsa)
    const togglePassword = document.getElementById('togglePassword');
    const passwordInput = document.getElementById('password');

    if (togglePassword && passwordInput) {
        togglePassword.addEventListener('click', function () {
            // Şifre tipini değiştir
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);

            // İkonu değiştir
            this.querySelector('i').classList.toggle('fa-eye');
            this.querySelector('i').classList.toggle('fa-eye-slash');
        });
    }

    // Discord ile giriş butonu
    const discordLoginBtn = document.querySelector('.discord-btn');
    const userProfile = document.getElementById('userProfile');
    const userAvatar = document.getElementById('userAvatar');
    const userName = document.getElementById('userName');
    const logoutBtn = document.getElementById('logoutBtn');

    if (discordLoginBtn) {
        console.log('Discord butonu bulundu:', discordLoginBtn);
        discordLoginBtn.addEventListener('click', async function (e) {
            e.preventDefault(); // Varsayılan link davranışını engelle
            console.log('Discord butonuna tıklandı!');

            try {
                // Sunucudan Discord OAuth ayarlarını çek
                console.log('OAuth config endpoint\'i çağrılıyor...');
                const res = await fetch('/api/discord/oauth-config');
                console.log('Response status:', res.status);

                if (!res.ok) {
                    throw new Error(`HTTP error! status: ${res.status}`);
                }

                const config = await res.json();
                console.log('OAuth config alındı:', config);

                const { clientId, redirectUri } = config;
                const scope = 'identify email guilds guilds.members.read';
                const discordAuthUrl = `https://discord.com/api/oauth2/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=${scope}`;

                console.log('Discord auth URL oluşturuldu:', discordAuthUrl);
                window.location.href = discordAuthUrl;
            } catch (error) {
                console.error('Discord login hatası:', error);
                alert('Discord girişi sırasında bir hata oluştu: ' + error.message);
            }
        });
    } else {
        console.error('Discord butonu bulunamadı!');
    }

    // Çıkış butonu event listener
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function () {
            if (confirm('Çıkmak istediğinize emin misiniz?')) {
                logout();
            }
        });
    }
});

function toggleConfirmModal() {
    const modal = document.getElementById('confirm-modal');
    if (modal.style.display === 'block') {
        modal.style.display = 'none';
    } else {
        modal.style.display = 'block';
    }
}

function showConfirmModal({ title = "Emin misiniz?", message = "", onOk, onCancel }) {
    const modal = document.getElementById('confirm-modal');
    document.getElementById('confirm-modal-title').textContent = title;
    document.getElementById('confirm-modal-message').textContent = message;
    modal.classList.add('show');

    function closeModal() {
        modal.classList.remove('show');
    }

    document.getElementById('confirm-modal-ok').onclick = () => {
        closeModal();
        if (typeof onOk === 'function') onOk();
    };
    document.getElementById('confirm-modal-cancel').onclick = () => {
        closeModal();
        if (typeof onCancel === 'function') onCancel();
    };
    document.getElementById('confirm-modal-close').onclick = closeModal;
    modal.onclick = (e) => {
        if (e.target === modal) closeModal();
    };
}

document.addEventListener('DOMContentLoaded', function () {
    // Accordion SSS
    document.querySelectorAll('.accordion-header').forEach(function (header) {
        header.addEventListener('click', function () {
            const item = header.parentElement;
            const isActive = item.classList.contains('active');
            // Tümünü kapat
            document.querySelectorAll('.accordion-item').forEach(function (i) {
                i.classList.remove('active');
            });
            // Eğer tıklanan zaten açıksa kapalı kalsın, değilse aç
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });
    // Animasyonlar için Intersection Observer
    function animateOnScroll(selector) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15 });
        document.querySelectorAll(selector).forEach(el => observer.observe(el));
    }
    animateOnScroll('.animate-fade');
    animateOnScroll('.animate-slide-up');
    // Scroll to top butonu
    const scrollBtn = document.getElementById('scrollToTopBtn');
    if (scrollBtn) {
        window.addEventListener('scroll', function () {
            if (window.scrollY > 300) {
                scrollBtn.style.opacity = '1';
                scrollBtn.style.pointerEvents = 'auto';
            } else {
                scrollBtn.style.opacity = '0';
                scrollBtn.style.pointerEvents = 'none';
            }
        });
        scrollBtn.addEventListener('click', function () {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
    // Burger menu
    const burgerMenu = document.getElementById('burgerMenu');
    const mainNav = document.getElementById('mainNav');
    if (burgerMenu && mainNav) {
        burgerMenu.addEventListener('click', function () {
            const isOpen = mainNav.classList.toggle('open');
            burgerMenu.classList.toggle('active', isOpen);
            burgerMenu.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        });
        // Menüden bir linke tıklanınca menüyü kapat (mobilde)
        mainNav.querySelectorAll('a').forEach(function (link) {
            link.addEventListener('click', function () {
                if (window.innerWidth <= 900) {
                    mainNav.classList.remove('open');
                    burgerMenu.classList.remove('active');
                    burgerMenu.setAttribute('aria-expanded', 'false');
                }
            });
        });
        // Menü dışında bir yere tıklanınca menüyü kapat
        document.addEventListener('click', function (e) {
            const isBurger = burgerMenu.contains(e.target);
            const isNav = mainNav.contains(e.target);
            if (mainNav.classList.contains('open') && !isBurger && !isNav) {
                mainNav.classList.remove('open');
                burgerMenu.classList.remove('active');
                burgerMenu.setAttribute('aria-expanded', 'false');
            }
        });
    }
    // Chat bubble/modal
    const chatBubbleBtn = document.getElementById('chatBubbleBtn');
    const chatModal = document.getElementById('chatModal');
    const chatModalClose = document.getElementById('chatModalClose');
    if (chatBubbleBtn && chatModal && chatModalClose) {
        chatBubbleBtn.addEventListener('click', function (e) {
            chatModal.classList.add('open');
        });
        chatModalClose.addEventListener('click', function () {
            chatModal.classList.remove('open');
        });
        // Modal dışına tıklayınca kapat
        document.addEventListener('click', function (e) {
            const isChatBubble = chatBubbleBtn.contains(e.target);
            const isModal = chatModal.contains(e.target);
            if (chatModal.classList.contains('open') && !isChatBubble && !isModal) {
                chatModal.classList.remove('open');
            }
        });
        // Modal içine tıklayınca kapatma (sadece dışına tıklayınca kapat)
        chatModal.addEventListener('click', function (e) {
            if (e.target === chatModal) {
                chatModal.classList.remove('open');
            }
        });
    }
});


document.addEventListener('DOMContentLoaded', function () {
    // Accordion SSS
    document.querySelectorAll('.accordion-header').forEach(function (header) {
        header.addEventListener('click', function () {
            const item = header.parentElement;
            const isActive = item.classList.contains('active');
            // Tümünü kapat
            document.querySelectorAll('.accordion-item').forEach(function (i) {
                i.classList.remove('active');
            });
            // Eğer tıklanan zaten açıksa kapalı kalsın, değilse aç
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });
    // Animasyonlar için Intersection Observer
    function animateOnScroll(selector) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15 });
        document.querySelectorAll(selector).forEach(el => observer.observe(el));
    }
    animateOnScroll('.animate-fade');
    animateOnScroll('.animate-slide-up');
    // Scroll to top butonu
    const scrollBtn = document.getElementById('scrollToTopBtn');
    if (scrollBtn) {
        window.addEventListener('scroll', function () {
            if (window.scrollY > 300) {
                scrollBtn.style.opacity = '1';
                scrollBtn.style.pointerEvents = 'auto';
            } else {
                scrollBtn.style.opacity = '0';
                scrollBtn.style.pointerEvents = 'none';
            }
        });
        scrollBtn.addEventListener('click', function () {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
    // Burger menu
    const burgerMenu = document.getElementById('burgerMenu');
    const mainNav = document.getElementById('mainNav');
    if (burgerMenu && mainNav) {
        burgerMenu.addEventListener('click', function () {
            const isOpen = mainNav.classList.toggle('open');
            burgerMenu.classList.toggle('active', isOpen);
            burgerMenu.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        });
        // Menüden bir linke tıklanınca menüyü kapat (mobilde)
        mainNav.querySelectorAll('a').forEach(function (link) {
            link.addEventListener('click', function () {
                if (window.innerWidth <= 900) {
                    mainNav.classList.remove('open');
                    burgerMenu.classList.remove('active');
                    burgerMenu.setAttribute('aria-expanded', 'false');
                }
            });
        });
        // Menü dışında bir yere tıklanınca menüyü kapat
        document.addEventListener('click', function (e) {
            const isBurger = burgerMenu.contains(e.target);
            const isNav = mainNav.contains(e.target);
            if (mainNav.classList.contains('open') && !isBurger && !isNav) {
                mainNav.classList.remove('open');
                burgerMenu.classList.remove('active');
                burgerMenu.setAttribute('aria-expanded', 'false');
            }
        });
    }
    // Chat bubble/modal
    const chatBubbleBtn = document.getElementById('chatBubbleBtn');
    const chatModal = document.getElementById('chatModal');
    const chatModalClose = document.getElementById('chatModalClose');
    if (chatBubbleBtn && chatModal && chatModalClose) {
        chatBubbleBtn.addEventListener('click', function (e) {
            chatModal.classList.add('open');
        });
        chatModalClose.addEventListener('click', function () {
            chatModal.classList.remove('open');
        });
        // Modal dışına tıklayınca kapat
        document.addEventListener('click', function (e) {
            const isChatBubble = chatBubbleBtn.contains(e.target);
            const isModal = chatModal.contains(e.target);
            if (chatModal.classList.contains('open') && !isChatBubble && !isModal) {
                chatModal.classList.remove('open');
            }
        });
        // Modal içine tıklayınca kapatma (sadece dışına tıklayınca kapat)
        chatModal.addEventListener('click', function (e) {
            if (e.target === chatModal) {
                chatModal.classList.remove('open');
            }
        });
    }
    // Sepete ekle fonksiyonu
    function updateCartCount() {
        const cart = JSON.parse(localStorage.getItem('cart') || '[]');
        document.getElementById('cartCount').textContent = cart.length;
    }
    document.querySelectorAll('.add-to-cart-btn').forEach(function (btn) {
        btn.addEventListener('click', function (e) {
            e.preventDefault();
            const product = btn.getAttribute('data-product');
            const price = btn.getAttribute('data-price');
            let cart = JSON.parse(localStorage.getItem('cart') || '[]');
            cart.push({ product, price });
            localStorage.setItem('cart', JSON.stringify(cart));
            updateCartCount();
            // Bildirim
            let notif = document.createElement('div');
            notif.textContent = 'Ürün sepete eklendi!';
            notif.style.position = 'fixed';
            notif.style.top = '24px';
            notif.style.right = '24px';
            notif.style.background = '#1482ff';
            notif.style.color = '#fff';
            notif.style.padding = '12px 24px';
            notif.style.borderRadius = '18px';
            notif.style.fontWeight = '700';
            notif.style.zIndex = '9999';
            notif.style.boxShadow = '0 2px 16px #1482ff55';
            document.body.appendChild(notif);
            setTimeout(function () { notif.remove(); }, 1400);
        });
    });
    document.getElementById('cartIconBtn').addEventListener('click', function () {
        window.location.href = 'sepet.html';
    });
    updateCartCount();
});