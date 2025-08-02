import React, { useEffect, useState } from "react";
import "./hero.scss";

const Hero: React.FC = () => {
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoaded(true);
            console.log('[PX-Main] Hero bölümü yüklendi');
        }, 200);

        return () => clearTimeout(timer);
    }, []);

    return (
        <section className={`hero ${isLoaded ? 'hero-loaded' : ''}`}>
            {/* Oval Çizgi Animasyonu */}
            <div className="oval-line">
                <svg 
                    viewBox="0 0 100 100" 
                    preserveAspectRatio="none"
                    className="oval-svg"
                >
                    <path 
                        d="M0,0 Q50,50 100,0 L100,100 Q50,50 0,100 Z" 
                        className="oval-path"
                        fill="none"
                        stroke="url(#gradient)"
                        strokeWidth="2"
                    />
                    <defs>
                        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#00bcd4" stopOpacity="0.8" />
                            <stop offset="50%" stopColor="#00bcd4" stopOpacity="1" />
                            <stop offset="100%" stopColor="#00bcd4" stopOpacity="0.6" />
                        </linearGradient>
                    </defs>
                </svg>
            </div>

            {/* Ana İçerik */}
            <div className="hero-content">
                <div className="hero-text">
                    <h1 className="hero-title">
                        <span className="title-line">PXDev</span>
                        <span className="title-subtitle">Teknoloji Çözümleri</span>
                    </h1>
                    <p className="hero-description">
                        Modern web teknolojileri ile geleceği şekillendiriyoruz. 
                        Yenilikçi çözümler, güvenilir hizmet.
                    </p>
                    <div className="hero-buttons">
                        <button className="hero-btn primary">
                            <span>Projelerimizi Keşfet</span>
                        </button>
                        <button className="hero-btn secondary">
                            <span>İletişime Geç</span>
                        </button>
                    </div>
                </div>
                
                <div className="hero-visual">
                    <div className="floating-elements">
                        <div className="floating-circle circle-1"></div>
                        <div className="floating-circle circle-2"></div>
                        <div className="floating-circle circle-3"></div>
                        <div className="floating-square square-1"></div>
                        <div className="floating-square square-2"></div>
                    </div>
                </div>
            </div>

            {/* Scroll Indicator */}
            <div className="scroll-indicator">
                <div className="scroll-arrow">
                    <span></span>
                </div>
                <p>Daha fazlası için kaydır</p>
            </div>
        </section>
    );
};

export default Hero;
