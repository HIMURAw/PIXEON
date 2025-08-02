import React, { useEffect, useState } from 'react';
import './navbar.scss';

const Navbar: React.FC = () => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoaded(true);
        }, 100);

        return () => clearTimeout(timer);
    }, []);

    // Login işlemi için fonksiyon
    const handleLogin = () => {
        setIsLoggedIn(true);
        console.log('[PX-Main] Kullanıcı giriş yaptı');
    };

    // Logout işlemi için fonksiyon
    const handleLogout = () => {
        setIsLoggedIn(false);
        console.log('[PX-Main] Kullanıcı çıkış yaptı');
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
                    <span className="logo-text">PXDev.com.tr</span>
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
                            <a href="#Login">Login</a>
                        </div>
                    ) : (
                        <div className="profile">
                            <img src="https://cdn.discordapp.com/attachments/1392486533696720918/1393597767409995806/pxdev-photoaidcom-cropped.png?ex=688ec74f&is=688d75cf&hm=9a6faffcdb12e8f103a5eb7a808015dd609e30e969beeece80839c771b355baa&" alt="Profile-image" />
                            <div className="profile-info">
                                <p>HIMURA</p>
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
                            <span>Login</span>
                        </div>
                    ) : (
                        <div className="mobile-profile">
                            <img src="https://cdn.discordapp.com/attachments/1392486533696720918/1393597767409995806/pxdev-photoaidcom-cropped.png?ex=688ec74f&is=688d75cf&hm=9a6faffcdb12e8f103a5eb7a808015dd609e30e969beeece80839c771b355baa&" alt="Profile-image" />
                            <div className="mobile-profile-info">
                                <p>HIMURA</p>
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