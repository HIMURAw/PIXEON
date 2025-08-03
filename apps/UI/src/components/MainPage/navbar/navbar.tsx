import React, { useEffect, useState } from 'react';
import './navbar.scss';

interface UserData {
    discordId: string;
    username: string;
    avatar: string;
    email: string;
    roles: string[];
}

const Navbar: React.FC = () => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [userData, setUserData] = useState<UserData | null>(null);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoaded(true);
        }, 100);

        // Önce eski cookie'yi temizle (test için)
        document.cookie = 'auth_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        document.cookie = 'auth_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/auth;';

        // Sayfa yüklendiğinde kullanıcı durumunu kontrol et
        checkUserStatus();

        return () => clearTimeout(timer);
    }, []);

    // Cookie'den kullanıcı bilgilerini çeken fonksiyon
    const getUserFromCookie = () => {
        try {
            const cookies = document.cookie.split(';');
            const authCookie = cookies.find(cookie => cookie.trim().startsWith('auth_token='));

            if (authCookie) {
                const tokenValue = authCookie.split('=')[1];
                console.log('[PX-Main] Raw cookie value:', tokenValue);

                // JSON parse et (artık encode edilmemiş)
                const userData = JSON.parse(tokenValue);
                console.log('[PX-Main] Cookie\'den kullanıcı bilgileri alındı:', userData);
                return userData;
            } else {
                console.log('[PX-Main] auth_token cookie bulunamadı');
            }
        } catch (error) {
            console.error('[PX-Main] Cookie parse hatası:', error);
            console.log('[PX-Main] Mevcut cookie\'ler:', document.cookie);
        }
        return null;
    };

    // Kullanıcı durumunu kontrol eden fonksiyon
    const checkUserStatus = async () => {
        try {
            // Önce cookie'den kontrol et
            const cookieUser = getUserFromCookie();

            if (cookieUser) {
                setUserData(cookieUser);
                setIsLoggedIn(true);
                console.log('[PX-Main] Cookie\'den kullanıcı oturumu bulundu:', cookieUser);
                return;
            }

            // Cookie'de yoksa API'den kontrol et
            const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:3001';
            const response = await fetch(`${apiUrl}/auth/api/user/check`, {
                credentials: 'include' // Cookie'leri gönder
            });

            if (response.ok) {
                const user = await response.json();
                setUserData(user);
                setIsLoggedIn(true);
                console.log('[PX-Main] API\'den kullanıcı oturumu bulundu:', user);
            } else {
                setIsLoggedIn(false);
                setUserData(null);
                console.log('[PX-Main] Kullanıcı oturumu bulunamadı');
            }
        } catch (error) {
            console.error('[PX-Main] Kullanıcı durumu kontrol hatası:', error);
            setIsLoggedIn(false);
            setUserData(null);
        }
    };

    // Discord OAuth ile giriş yapma fonksiyonu
    const handleLogin = () => {
        console.log('[PX-Main] Discord OAuth başlatılıyor...');
        // Environment'dan API URL'ini al (production'da domain olacak)
        const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:3001';
        window.location.href = `${apiUrl}/auth/discord`;
    };

    // Logout işlemi için fonksiyon
    const handleLogout = () => {
        // Cookie'yi temizle (tüm path'ler için)
        document.cookie = 'auth_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        document.cookie = 'auth_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/auth;';

        setIsLoggedIn(false);
        setUserData(null);
        console.log('[PX-Main] Kullanıcı çıkış yaptı ve cookie temizlendi');
    };

    // Mobile menü toggle fonksiyonu
    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
        console.log('[PX-Main] Mobile menü durumu:', !isMobileMenuOpen ? 'açık' : 'kapalı');
    };

    // Mobile menüyü kapatma fonksiyonu
    const closeMobileMenu = () => {
        setIsMobileMenuOpen(false);
    };

    return (
        <nav className={`navbar ${isLoaded ? 'navbar-loaded' : ''}`}>
            <div className="navbar-container">
                <div className="logo">
                    <span className="logo-text" data-text="PXDev.com.tr">PXDev.com.tr</span>
                </div>

                {/* Desktop Navigation */}
                <ul className="navLinks desktop-nav">
                    <li className="nav-item">
                        <a href="#Home" className="nav-link">
                            <span className="link-text">Anasayfa</span>
                        </a>
                    </li>
                    <li className="nav-item">
                        <a href="#about" className="nav-link">
                            <span className="link-text">Hakkımızda</span>
                        </a>
                    </li>
                    <li className="nav-item">
                        <a href="#products" className="nav-link">
                            <span className="link-text">Ürünler</span>
                        </a>
                    </li>
                    <li className="nav-item">
                        <a href="#services" className="nav-link">
                            <span className="link-text">Partnerlerimiz</span>
                        </a>
                    </li>
                    <li className="nav-item">
                        <a href="#contact" className="nav-link">
                            <span className="link-text">İletişim</span>
                        </a>
                    </li>
                </ul>

                {/* Desktop Login/Profile */}
                <div className="desktop-auth">
                    {!isLoggedIn ? (
                        <div className="loginBtn" onClick={handleLogin}>
                            <span>Giriş Yap</span>
                        </div>
                    ) : (
                        <div className="profile">
                            <img
                                src={userData?.avatar || "https://cdn.discordapp.com/embed/avatars/0.png"}
                                alt="Profile-image"
                            />
                            <div className="profile-info">
                                <p>{userData?.username || 'Kullanıcı'}</p>
                                <button className="logout-btn" onClick={handleLogout}>
                                    Çıkış Yap
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Mobile Hamburger Menu */}
                <div className="mobile-menu-toggle" onClick={toggleMobileMenu}>
                    <div className={`hamburger ${isMobileMenuOpen ? 'active' : ''}`}>
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                </div>
            </div>

            {/* Mobile Navigation Menu */}
            <div className={`mobile-menu ${isMobileMenuOpen ? 'active' : ''}`}>
                <ul className="mobile-nav-links">
                    <li className="mobile-nav-item">
                        <a href="#Home" className="mobile-nav-link" onClick={closeMobileMenu}>
                            <span className="link-text">Anasayfa</span>
                        </a>
                    </li>
                    <li className="mobile-nav-item">
                        <a href="#about" className="mobile-nav-link" onClick={closeMobileMenu}>
                            <span className="link-text">Hakkımızda</span>
                        </a>
                    </li>
                    <li className="mobile-nav-item">
                        <a href="#products" className="mobile-nav-link" onClick={closeMobileMenu}>
                            <span className="link-text">Ürünler</span>
                        </a>
                    </li>
                    <li className="mobile-nav-item">
                        <a href="#services" className="mobile-nav-link" onClick={closeMobileMenu}>
                            <span className="link-text">Partnerlerimiz</span>
                        </a>
                    </li>
                    <li className="mobile-nav-item">
                        <a href="#contact" className="mobile-nav-link" onClick={closeMobileMenu}>
                            <span className="link-text">İletişim</span>
                        </a>
                    </li>
                </ul>

                {/* Mobile Login/Profile */}
                <div className="mobile-auth">
                    {!isLoggedIn ? (
                        <div className="mobile-login-btn" onClick={() => { handleLogin(); closeMobileMenu(); }}>
                            <span>Discord ile Giriş</span>
                        </div>
                    ) : (
                        <div className="mobile-profile">
                            <img
                                src={userData?.avatar || "https://cdn.discordapp.com/embed/avatars/0.png"}
                                alt="Profile-image"
                            />
                            <div className="mobile-profile-info">
                                <p>{userData?.username || 'Kullanıcı'}</p>
                                <button className="mobile-logout-btn" onClick={() => { handleLogout(); closeMobileMenu(); }}>
                                    Çıkış Yap
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;