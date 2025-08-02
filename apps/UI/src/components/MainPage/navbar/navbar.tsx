import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import './navbar.scss';

const navLinks = [
    { id: 'home', label: 'Anasayfa' },
    { id: 'about', label: 'Hakkımızda' },
    { id: 'products', label: 'Ürünler' },
    { id: 'services', label: 'Partnerlerimiz' },
    { id: 'contact', label: 'İletişim' },
];

const containerVariants = {
    hidden: {
        opacity: 0,
        y: -20,
    },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            type: "spring" as const, // tip hatasını önlemek için `as const` kullanıyoruz
            stiffness: 300,
            damping: 24,
            when: "beforeChildren",
            staggerChildren: 0.3,
        },
    },
};


const itemVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0 }
};

const Navbar: React.FC = () => {
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoaded(true);
        }, 100);
        return () => clearTimeout(timer);
    }, []);

    return (
        <motion.nav
            className={`navbar ${isLoaded ? 'navbar-loaded' : ''}`}
            variants={containerVariants}
            initial="hidden"
            animate={isLoaded ? "visible" : "hidden"}
        >
            <div className="navbar-container">
                <motion.div
                    className="logo"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                >
                    <span className="logo-text">PXDev.com.tr</span>
                </motion.div>

                <motion.ul className="navLinks">
                    {navLinks.map((link, index) => (
                        <motion.li
                            className="nav-item"
                            key={link.id}
                            variants={itemVariants}
                        >
                            <a href={`#${link.id}`} className="nav-link">
                                <span className="link-text">{link.label}</span>
                                <span className="link-glow"></span>
                            </a>
                        </motion.li>
                    ))}
                </motion.ul>
            </div>
        </motion.nav>
    );
};

export default Navbar;
