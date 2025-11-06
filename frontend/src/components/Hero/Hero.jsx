import React from 'react';
import './Hero.scss';
import { FaInstagram, FaArrowRight } from 'react-icons/fa';

const Hero = () => {
    return (
        <section className="hero">
            <div className="hero-container">
                <div className="hero-content">
                    <h1 className="hero-title">
                        <span className="gradient-text">PXDevelopment</span>
                    </h1>
                    <p className="hero-subtitle">
                        PXDevelopment, modern tasarım anlayışı ve güçlü yazılım altyapısıyla markanızı dijital dünyada öne çıkarır. Her satır kodu özenle yazar, her detayı kullanıcı deneyimine göre şekillendiririz. İster kurumsal bir site ister yaratıcı bir proje hayal et, biz hayalini gerçeğe dönüştürürüz.
                    </p>
                    <div className="hero-buttons">
                        <a
                            href="https://www.instagram.com/px.development/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-primary"
                        >
                            <FaInstagram className="btn-icon" /> İnstagram'a Katıl
                        </a>
                        <a href="#hakkimizda" className="btn btn-secondary">
                            Daha Fazla Bilgi <FaArrowRight className="btn-icon" />
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;