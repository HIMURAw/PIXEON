import React from 'react';
import './Hero.scss';
import { FaDiscord, FaArrowRight } from 'react-icons/fa';

const Hero = () => {
    return (
        <section className="hero">
            <div className="hero-container">
                <div className="hero-content">
                    <h1 className="hero-title">
                        <span className="gradient-text">AgeV</span> ile Geleceğin Oyun Dünyasına Adım Atın
                    </h1>
                    <p className="hero-subtitle">
                        En iyi FiveM sunucu deneyimini yaşamak için hemen aramıza katılın.
                        Benzersiz oyun içi etkinlikler ve toplulukla birlikte unutulmaz anılar biriktirin.
                    </p>
                    <div className="hero-buttons">
                        <a
                            href="https://discord.gg/agev"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-primary"
                        >
                            <FaDiscord className="btn-icon" /> Discord'a Katıl
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