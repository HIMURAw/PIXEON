"use client";
import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ModelViewer, { preloadModels } from "./ModelViewer";

// Database driven hero slides
import { getActiveHeroSlides } from "@/lib/actions/hero-actions";


export default function HeroCarousel() {
    const [dynamicSlides, setDynamicSlides] = useState<any[]>([]);
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);
    const [loading, setLoading] = useState(true);

    const activeSlides = dynamicSlides;

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            const res = await getActiveHeroSlides();
            if (res.success && res.slides && res.slides.length > 0) {
                setDynamicSlides(res.slides);
            }
            setLoading(false);
        };
        load();
    }, []);


    // Tüm modelleri önden yüklüyoruz
    useEffect(() => {
        const modelPaths = activeSlides.map(s => s.modelPath);
        preloadModels(modelPaths);
    }, [activeSlides]);

    useEffect(() => {
        if (!isAutoPlaying || activeSlides.length <= 1) return;
        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % activeSlides.length);
        }, 8000);
        return () => clearInterval(interval);
    }, [isAutoPlaying, activeSlides.length]);

    const goToSlide = (index: number) => {
        setCurrentSlide(index);
        setIsAutoPlaying(false);
    };

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % activeSlides.length);
        setIsAutoPlaying(false);
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + activeSlides.length) % activeSlides.length);
        setIsAutoPlaying(false);
    };

    if (loading) {
        return (
            <div className="relative w-full h-[380px] sm:h-[480px] lg:h-[680px] bg-slate-900 rounded-2xl overflow-hidden animate-pulse flex">
                <div className="w-full lg:w-1/2 h-full p-8 lg:p-16 space-y-6 lg:space-y-8 flex flex-col justify-center">
                    <div className="h-6 bg-white/5 w-24 rounded-full" />
                    <div className="h-12 bg-white/5 w-3/4 rounded-2xl" />
                    <div className="h-20 bg-white/5 w-full rounded-2xl" />
                    <div className="h-10 bg-white/5 w-40 rounded-xl" />
                </div>
                <div className="hidden lg:block lg:w-1/2 h-full bg-white/5" />
            </div>
        );
    }

    if (activeSlides.length === 0) return null;

    return (
        <div className="user-select-none relative w-full h-[380px] sm:h-[480px] lg:h-[680px] bg-linear-to-br from-slate-900 to-slate-800 rounded-2xl overflow-hidden group">
            <div className="relative w-full h-full flex flex-col lg:flex-row">

                
                {/* Sol Taraf: Metin İçerikleri (Slaytlar) */}
                <div className="w-full lg:w-1/2 h-full relative overflow-hidden">
                    {activeSlides.map((slide, index) => (
                        <div
                            key={slide.id}
                            className={`absolute inset-0 transition-all duration-700 ease-in-out flex items-center px-6 sm:px-8 lg:px-16 ${index === currentSlide
                                ? "opacity-100 translate-x-0 z-10"
                                : "opacity-0 -translate-x-10 z-0"
                                }`}
                        >
                            <div className="space-y-4 lg:space-y-6 pr-4">
                                <div className="inline-block">
                                    <span className="text-[9px] font-bold text-gray-300 bg-gray-700 px-2 py-0.5 rounded-full mr-1">
                                        ÖZEL TEKLİF
                                    </span>
                                    <span className={`text-[9px] font-bold text-white ${slide.badgeColor} px-2 py-0.5 rounded-full`}>
                                        {slide.badge}
                                    </span>
                                </div>

                                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white leading-tight">
                                    {slide.title}
                               </h1>

                                <p className="text-xs sm:text-sm text-gray-300 max-w-md">
                                    {slide.subtitle}
                                </p>

                                <div className="flex items-center gap-1.5">
                                    <span className="text-[10px] text-gray-300">'dan itibaren</span>
                                    <span className="text-2xl sm:text-3xl font-bold text-red-400">
                                        {slide.price}
                                    </span>
                                </div>

                                <button className="cursor-pointer bg-sky-400 hover:bg-sky-500 text-white font-bold px-5 lg:px-6 py-2 sm:py-2.5 rounded-full transition-all duration-300 flex items-center gap-1.5 text-xs sm:text-sm active:scale-95 shadow-lg shadow-sky-400/20">
                                    {slide.buttonText}
                                    <span className="group-hover/btn:translate-x-1 transition-transform">→</span>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Sağ Taraf: Sabit Tek 3D Görüntüleyici */}
                <div className="hidden lg:block lg:w-1/2 h-full relative z-10 bg-gradient-to-l from-slate-900/20 to-transparent">
                    <ModelViewer path={activeSlides[currentSlide]?.modelPath} />
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
                {activeSlides.map((_, index) => (
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
