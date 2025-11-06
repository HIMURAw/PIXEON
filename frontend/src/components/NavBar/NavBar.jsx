import React, { useState, useEffect } from "react";
import './NavBar.scss';
import { FaSitemap, FaBars, FaTimes, FaUser, FaSignOutAlt } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext.jsx';

function NavBar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [showUserMenu, setShowUserMenu] = useState(false);
    const { user, isAuthenticated, loading, discordLogin, logout } = useAuth();

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 10) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };

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

    const handleDiscordLogin = () => {
        discordLogin();
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
                    <li className="nav-item">
                        <a href="#" className="nav-link" onClick={() => setIsMenuOpen(false)}>Ana Sayfa</a>
                    </li>
                    <li className="nav-item">
                        <a href="#yetkililer" className="nav-link" onClick={() => setIsMenuOpen(false)}>Yetkililer</a>
                    </li>
                    <li className="nav-item">
                        <a href="#hakkimizda" className="nav-link" onClick={() => setIsMenuOpen(false)}>Hakkımızda</a>
                    </li>
                    <li className="nav-item">
                        {loading ? (
                            <div className="nav-link loading-link">
                                <div className="loading-spinner"></div>
                                Yükleniyor...
                            </div>
                        ) : isAuthenticated && user ? (
                            <div className="user-menu-container">
                                <button
                                    className="nav-link user-link"
                                    onClick={toggleUserMenu}
                                >
                                    <img
                                        src={user.avatar || `https://cdn.discordapp.com/embed/avatars/${user.discriminator % 5}.png`}
                                        alt={user.username}
                                        className="user-avatar"
                                    />
                                    <span className="user-name">{user.username}</span>
                                    <FaUser className="user-icon" />
                                </button>

                                {showUserMenu && (
                                    <div className="user-dropdown">
                                        <div className="user-info">
                                            <div className="user-details">
                                                <img
                                                    src={user.avatar || `https://cdn.discordapp.com/embed/avatars/${user.discriminator % 5}.png`}
                                                    alt={user.username}
                                                    className="dropdown-avatar"
                                                />
                                                <div className="user-text">
                                                    <div className="user-display-name">{user.username}</div>
                                                    <div className="user-id">#{user.discriminator}</div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="dropdown-divider"></div>
                                        <button
                                            className="dropdown-item logout-item"
                                            onClick={handleLogout}
                                        >
                                            <FaSignOutAlt className="logout-icon" />
                                            Çıkış Yap
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <button
                                className="nav-link discord-link"
                                onClick={handleDiscordLogin}
                            >
                                <FaSitemap className="discord-icon" />
                                Giriş Yap
                            </button>
                        )}
                    </li>
                </ul>
            </div>
        </nav>
    );
}

export default NavBar;