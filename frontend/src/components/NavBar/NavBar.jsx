import React, { useState, useEffect } from "react";
import './NavBar.scss';
import { FaDiscord, FaBars, FaTimes } from 'react-icons/fa';

function NavBar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

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
    };

    return (
        <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
            <div className="navbar-container">
                <a href="/" className="nav-logo">
                    <span>AgeV</span>
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
                        <a
                            href="https://discord.gg/agev"
                            className="nav-link discord-link"
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            <FaDiscord className="discord-icon" />
                            Discord
                        </a>
                    </li>
                </ul>
            </div>
        </nav>
    );
}

export default NavBar;