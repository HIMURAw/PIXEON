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

    // Sayfa yüklendiğinde token kontrolü
    document.addEventListener('DOMContentLoaded', function () {
        const token = getCookie('auth_token');
        if (token) {
            // Token varsa ve dashboard'da değilsek yönlendir
            if (!window.location.pathname.includes('dashboard')) {
                window.location.href = '/dashboard';
            }
        }
    });

    // Token doğrulama fonksiyonu
    async function verifyToken(token) {
        try {
            const response = await fetch('/api/auth/verify', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const data = await response.json();

            if (data.status === 'success') {
                // Token geçerli, otomatik giriş yap
                loginModal.style.display = 'none';
                // Burada kullanıcıyı yönlendirebilir veya UI'ı güncelleyebilirsiniz
                console.log('Auto login successful');
            }
        } catch (error) {
            console.error('Token verification error:', error);
        }
    }

    // Login form submit
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const rememberMe = document.querySelector('input[name="remember"]').checked;

        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            });

            const data = await response.json();

            if (data.status === 'success') {
                // Token'ı cookie'ye kaydet
                setCookie('auth_token', data.token, rememberMe ? 30 : 1);

                // Başarılı giriş
                window.location.href = '/dashboard';
            } else {
                // Başarısız giriş
                alert(data.message || 'Login failed. Please check your credentials.');
            }
        } catch (error) {
            console.error('Login error:', error);
            alert('An error occurred during login. Please try again.');
        }
    });

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
            // Sunucudan clientId ve redirectUri'yı çek
            const res = await fetch('/api/discord/oauth-config');
            const { clientId, redirectUri } = await res.json();
            const scope = 'identify email guilds guilds.members.read';
            const discordAuthUrl = `https://discord.com/api/oauth2/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=${scope}`;
            window.location.href = discordAuthUrl;
        });
    }

    // Kullanıcı profilini göster
    async function showUserProfile() {
        const token = getCookie('auth_token');
        if (!token) return;
        try {
            const res = await fetch('/api/auth/me', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!res.ok) return;
            const data = await res.json();
            if (data.username) {
                document.getElementById('user-profile').style.display = 'flex';
                document.getElementById('user-name').textContent = data.username;
                let avatarUrl = '';
                if (data.avatar) {
                    // Discord CDN avatar url'si
                    avatarUrl = `https://cdn.discordapp.com/avatars/${data.discord_id}/${data.avatar}.png`;
                } else {
                    // Discord default avatar
                    avatarUrl = 'https://cdn.discordapp.com/embed/avatars/0.png';
                }
                document.getElementById('user-avatar').src = avatarUrl;
            }
        } catch (e) {}
    }
    showUserProfile();
});
