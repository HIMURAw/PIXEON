import React, { useState, useEffect } from "react";
import './NavBar.scss';
import { FaBars, FaTimes, FaUser, FaSignOutAlt, FaGoogle } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext.jsx';

function NavBar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [showUserMenu, setShowUserMenu] = useState(false);
    const { user, isAuthenticated, loading, googleLogin, logout } = useAuth();

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 10);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
        setShowUserMenu(false);
    };

    const toggleUserMenu = () => {
        setShowUserMenu(!showUserMenu);
        setIsMenuOpen(false);
    };

    const handleLogout = () => {
        logout();
        setShowUserMenu(false);
        setIsMenuOpen(false);
    };

    return (
        <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
            <div className="navbar-container">
                <a href="/" className="nav-logo">
                    <span>PXDevelopment</span>
                </a>

                <div className="menu-icon" onClick={toggleMenu}>
                    {isMenuOpen ? <FaTimes /> : <FaBars />}
                </div>

                <ul className={`nav-menu ${isMenuOpen ? 'active' : ''}`}>
                    <li className="nav-item"><a href="#" className="nav-link">Ana Sayfa</a></li>
                    <li className="nav-item"><a href="#yetkililer" className="nav-link">Yetkililer</a></li>
                    <li className="nav-item"><a href="#hakkimizda" className="nav-link">Hakkımızda</a></li>
                    <li className="nav-item">
                        {loading ? (
                            <div className="nav-link loading-link">Yükleniyor...</div>
                        ) : isAuthenticated && user ? (
                            <div className="user-menu-container">
                                <button className="nav-link user-link" onClick={toggleUserMenu}>
                                    <img src={user.picture} alt={user.name} className="user-avatar" />
                                    <span className="user-name">{user.name}</span>
                                    <FaUser className="user-icon" />
                                </button>

                                {showUserMenu && (
                                    <div className="user-dropdown">
                                        <div className="user-info">
                                            <img src={user.picture} alt={user.name} className="dropdown-avatar" />
                                            <div className="user-text">
                                                <div className="user-display-name">{user.name}</div>
                                                <div className="user-id">{user.email}</div>
                                            </div>
                                        </div>
                                        <div className="dropdown-divider"></div>
                                        <button className="dropdown-item logout-item" onClick={handleLogout}>
                                            <FaSignOutAlt className="logout-icon" /> Çıkış Yap
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <button className="nav-link google-link" onClick={googleLogin}>
                                <FaGoogle className="google-icon" /> Google ile Giriş Yap
                            </button>
                        )}
                    </li>
                </ul>
            </div>
        </nav>
    );
}

export default NavBar;
