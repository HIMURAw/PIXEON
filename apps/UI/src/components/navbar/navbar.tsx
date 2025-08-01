import React from 'react';
import './navbar.scss';

const Navbar: React.FC = () => {
    return (
        <div className="navbar">
            <div className="logo">PXDev.Com.tr</div>
            <ul className="navLinks">
                <li><a href="#Home">Anasayfa</a></li>
                <li><a href="#about">Hakkımızda</a></li>
                <li><a href="#products">Ürünler</a></li>
                <li><a href="#services">Hizmetlerimiz</a></li>
                <li><a href="#contact">İletişim</a></li>
            </ul>
        </div>
    );
};

export default Navbar;
