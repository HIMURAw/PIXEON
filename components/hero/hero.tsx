"use client";
import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ModelViewer, { preloadModels } from "./ModelViewer";

interface Slide {
    id: number;
    badge: string;
    badgeColor: string;
    title: string;
    subtitle: string;
    price: string;
    buttonText: string;
    buttonLink: string;
    modelPath: string;
}

const slides: Slide[] = [
    {
        id: 1,
        badge: "YENİ NESİL",
        badgeColor: "bg-blue-600",
        title: "PlayStation 5",
        subtitle: "4K 120FPS ve Işın İzleme Teknolojisi ile Oyunun Sınırlarını Zorlayın.",
        price: "18.999 ₺",
        buttonText: "Hemen İncele",
        buttonLink: "/shop",
        modelPath: "/3D/ps5.glb"
    },
    {
        id: 2,
        badge: "YENİ NESİL",
        badgeColor: "bg-sky-500",
        title: "DualSense™ Wireless",
        subtitle: "Dokunsal Geri Bildirim ve Uyarlanabilir Tetiklerle Daha Derin Bir Deneyim.",
        price: "2.899 ₺",
        buttonText: "Satın Al",
        buttonLink: "/shop",
        modelPath: "/3D/playstation_5_controller.glb"
    },
    {
        id: 3,
        badge: "GÜÇLÜ",
        badgeColor: "bg-zinc-700",
        title: "PlayStation 4 Pro",
        subtitle: "Dinamik 4K Oyun ve 4K Eğlence ile En Sevdiğiniz Oyunları Geliştirin.",
        price: "9.490 ₺",
        buttonText: "Keşfet",
        buttonLink: "/shop",
        modelPath: "/3D/playstation_4_pro.glb"
    },
    {
        id: 4,
        badge: "EFSANE",
        badgeColor: "bg-indigo-600",
        title: "PlayStation 4",
        subtitle: "İnanılmaz Oyun Gücü ve Eğlence ile Tanışın.",
        price: "7.999 ₺",
        buttonText: "İncele",
        buttonLink: "/shop",
        modelPath: "/3D/playstation_4_original.glb"
    },
    {
        id: 5,
        badge: "İNCE",
        badgeColor: "bg-slate-600",
        title: "PlayStation 4 Slim",
        subtitle: "Daha Hafif, Daha İnce ve İnanılmaz Oyun Gücü.",
        price: "8.499 ₺",
        buttonText: "Satın Al",
        buttonLink: "/shop",
        modelPath: "/3D/sony_playstation4_slim_ps4_slim.glb"
    },
    {
        id: 6,
        badge: "RETRO",
        badgeColor: "bg-gray-700",
        title: "PlayStation 3 Slim",
        subtitle: "Efsanevi Oyun Kütüphanesi ve Blu-ray Oynatıcı.",
        price: "4.499 ₺",
        buttonText: "Keşfet",
        buttonLink: "/shop",
        modelPath: "/3D/ps3_slim.glb"
    },
    {
        id: 7,
        badge: "KONTROL",
        badgeColor: "bg-red-600",
        title: "DualShock 3",
        subtitle: "PS3 İçin Klasik Kablosuz Kontrolcü.",
        price: "1.299 ₺",
        buttonText: "Satın Al",
        buttonLink: "/shop",
        modelPath: "/3D/gamepad_sony_dualshock_3.glb"
    },
    {
        id: 8,
        badge: "KONTROL",
        badgeColor: "bg-blue-800",
        title: "DualShock 4",
        subtitle: "Hassas Kontrol ve Yenilikçi Özellikler.",
        price: "1.899 ₺",
        buttonText: "Satın Al",
        buttonLink: "/shop",
        modelPath: "/3D/dualshock_4_playstation_controller.glb"
    },
    {
        id: 9,
        badge: "XBOX",
        badgeColor: "bg-green-600",
        title: "Xbox Series X",
        subtitle: "Şimdiye Kadarki En Hızlı ve En Güçlü Xbox.",
        price: "21.999 ₺",
        buttonText: "Hemen İncele",
        buttonLink: "/shop",
        modelPath: "/3D/xbox_series_x_free_3d_model.glb"
    },
    {
        id: 10,
        badge: "XBOX",
        badgeColor: "bg-white text-black",
        title: "Xbox Series S",
        subtitle: "Tamamen Dijital, Yeni Nesil Performans.",
        price: "13.499 ₺",
        buttonText: "Keşfet",
        buttonLink: "/shop",
        modelPath: "/3D/xbox_series_s.glb"
    },
    {
        id: 11,
        badge: "XBOX",
        badgeColor: "bg-green-700",
        title: "Xbox One S",
        subtitle: "Eğlence ve Oyunun Buluştuğu Nokta.",
        price: "6.999 ₺",
        buttonText: "Satın Al",
        buttonLink: "/shop",
        modelPath: "/3D/xbox_one_s.glb"
    },
    {
        id: 12,
        badge: "8-BIT",
        badgeColor: "bg-purple-600",
        title: "8-Bit Controller",
        subtitle: "Klasik Oyun Deneyimi İçin Retro Tasarım.",
        price: "899 ₺",
        buttonText: "Satın Al",
        buttonLink: "/shop",
        modelPath: "/3D/xbox_8bit_controller.glb"
    }
];


export default function HeroCarousel() {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);

    // Tüm modelleri önden yüklüyoruz
    useEffect(() => {
        const modelPaths = slides.map(s => s.modelPath);
        preloadModels(modelPaths);
    }, []);

    useEffect(() => {
        if (!isAutoPlaying) return;
        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 8000);
        return () => clearInterval(interval);
    }, [isAutoPlaying]);

    const goToSlide = (index: number) => {
        setCurrentSlide(index);
        setIsAutoPlaying(false);
    };

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
        setIsAutoPlaying(false);
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
        setIsAutoPlaying(false);
    };

    return (
        <div className="user-select-none relative w-full h-[680px] bg-linear-to-br from-slate-900 to-slate-800 rounded-2xl overflow-hidden group">
            <div className="relative w-full h-full flex">
                
                {/* Sol Taraf: Metin İçerikleri (Slaytlar) */}
                <div className="w-1/2 h-full relative overflow-hidden">
                    {slides.map((slide, index) => (
                        <div
                            key={slide.id}
                            className={`absolute inset-0 transition-all duration-700 ease-in-out flex items-center px-8 lg:px-16 ${index === currentSlide
                                ? "opacity-100 translate-x-0 z-10"
                                : "opacity-0 -translate-x-10 z-0"
                                }`}
                        >
                            <div className="space-y-6 pr-4">
                                <div className="inline-block">
                                    <span className="text-[9px] font-bold text-gray-300 bg-gray-700 px-2 py-0.5 rounded-full mr-1">
                                        ÖZEL TEKLİF
                                    </span>
                                    <span className={`text-[9px] font-bold text-white ${slide.badgeColor} px-2 py-0.5 rounded-full`}>
                                        {slide.badge}
                                    </span>
                                </div>

                                <h1 className="text-3xl lg:text-4xl font-bold text-white leading-tight">
                                    {slide.title}
                                </h1>

                                <p className="text-sm text-gray-300 max-w-md">
                                    {slide.subtitle}
                                </p>

                                <div className="flex items-center gap-1.5">
                                    <span className="text-[10px] text-gray-300">'dan itibaren</span>
                                    <span className="text-3xl font-bold text-red-400">
                                        {slide.price}
                                    </span>
                                </div>

                                <button className="cursor-pointer bg-sky-400 hover:bg-sky-500 text-white font-bold px-6 py-2.5 rounded-full transition-all duration-300 flex items-center gap-1.5 text-sm active:scale-95 shadow-lg shadow-sky-400/20">
                                    {slide.buttonText}
                                    <span className="group-hover/btn:translate-x-1 transition-transform">→</span>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Sağ Taraf: Sabit Tek 3D Görüntüleyici */}
                <div className="w-1/2 h-full relative z-10 bg-gradient-to-l from-slate-900/20 to-transparent">
                    <ModelViewer path={slides[currentSlide].modelPath} />
                </div>
            </div>

            <button
                onClick={prevSlide}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/10 hover:bg-white/30 backdrop-blur-md rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg z-20"
            >
                <ChevronLeft className="w-6 h-6 text-white" />
            </button>

            <button
                onClick={nextSlide}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/10 hover:bg-white/30 backdrop-blur-md rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg z-20"
            >
                <ChevronRight className="w-6 h-6 text-white" />
            </button>

            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20">
                {slides.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => goToSlide(index)}
                        className={`transition-all duration-300 rounded-full h-1.5 ${index === currentSlide
                            ? "w-8 bg-sky-400"
                            : "w-2 bg-gray-600 hover:bg-sky-400"
                            }`}
                    />
                ))}
            </div>
        </div>
    );
}
