import React, { useEffect, useState } from 'react';
import './navbar.scss';

const Navbar: React.FC = () => {
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {

        const timer = setTimeout(() => {
            setIsLoaded(true);
        }, 100);

        return () => clearTimeout(timer);
    }, []);

    return (
        <nav className={`navbar ${isLoaded ? 'navbar-loaded' : ''}`}>
            <div className="navbar-container">
                <div className="logo">
                    <span className="logo-text">PXDev.com.tr</span>
                </div>
                <ul className="navLinks">
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
                {/* <div className="profile">
                    <img src="https://cdn.discordapp.com/attachments/1392486533696720918/1393597767409995806/pxdev-photoaidcom-cropped.png?ex=688ec74f&is=688d75cf&hm=9a6faffcdb12e8f103a5eb7a808015dd609e30e969beeece80839c771b355baa&" alt="Profile-image" />
                    <p>HIMURA</p>
                </div> */}
            </div>
        </nav>
    );
};

export default Navbar;