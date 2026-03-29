"use client";
import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";

interface Slide {
    id: number;
    badge: string;
    badgeColor: string;
    title: string;
    subtitle: string;
    price: string;
    buttonText: string;
    buttonLink: string;
    image: string;
}

const slides: Slide[] = [
    {
        id: 1,
        badge: "-20% OFF",
        badgeColor: "bg-green-500",
        title: "Specialist in the grocery store",
        subtitle: "Only this week. Don't miss...",
        price: "$7.99",
        buttonText: "Shop Now",
        buttonLink: "/shop",
        image: "/slider/hero-1.png"
    },
    {
        id: 2,
        badge: "-30% OFF",
        badgeColor: "bg-red-500",
        title: "Fresh Organic Products",
        subtitle: "Best deals of the season...",
        price: "$5.99",
        buttonText: "Shop Now",
        buttonLink: "/shop",
        image: "/slider/hero-2.png"
    },
    {
        id: 3,
        badge: "-15% OFF",
        badgeColor: "bg-sky-400",
        title: "Quality Guaranteed",
        subtitle: "Premium products for you...",
        price: "$9.99",
        buttonText: "Shop Now",
        buttonLink: "/shop",
        image: "/slider/hero-3.png"
    }
];

export default function HeroCarousel() {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);

    useEffect(() => {
        if (!isAutoPlaying) return;
        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 5000);
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
            <div className="relative w-full h-full">
                {slides.map((slide, index) => (
                    <div
                        key={slide.id}
                        className={`absolute inset-0 transition-all duration-700 ease-in-out ${index === currentSlide
                            ? "opacity-100 translate-x-0"
                            : index < currentSlide
                                ? "opacity-0 -translate-x-full"
                                : "opacity-0 translate-x-full"
                            }`}
                    >
                        <div className="flex items-center h-full px-8 lg:px-16">
                            <div className="w-1/2 space-y-6 pr-4">
                                <div className="inline-block">
                                    <span className="text-[9px] font-bold text-gray-300 bg-gray-700 px-2 py-0.5 rounded-full mr-1">
                                        EXCLUSIVE OFFER
                                    </span>
                                    <span className={`text-[9px] font-bold text-white ${slide.badgeColor} px-2 py-0.5 rounded-full`}>
                                        {slide.badge}
                                    </span>
                                </div>

                                <h1 className="text-2xl lg:text-3xl font-bold text-white leading-tight">
                                    {slide.title}
                                </h1>

                                <p className="text-xs text-gray-300">
                                    {slide.subtitle}
                                </p>

                                <div className="flex items-center gap-1.5">
                                    <span className="text-[10px] text-gray-300">from</span>
                                    <span className="text-2xl font-bold text-red-400">
                                        {slide.price}
                                    </span>
                                </div>

                                <button className="bg-sky-400 hover:bg-sky-500 text-white font-bold px-5 py-2 rounded-full transition-all duration-300 flex items-center gap-1.5 text-xs">
                                    {slide.buttonText}
                                    <span className="group-hover/btn:translate-x-1 transition-transform">→</span>
                                </button>
                            </div>

                            <div className="w-1/2 h-full relative -translate-y-6">
                                <Image
                                    src={slide.image}
                                    alt={slide.title}
                                    fill
                                    className="object-contain"
                                    priority={index === 0}
                                />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <button
                onClick={prevSlide}
                className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/20 hover:bg-white/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
            >
                <ChevronLeft className="w-4 h-4 text-white" />
            </button>

            <button
                onClick={nextSlide}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/20 hover:bg-white/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
            >
                <ChevronRight className="w-4 h-4 text-white" />
            </button>

            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                {slides.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => goToSlide(index)}
                        className={`transition-all duration-300 rounded-full ${index === currentSlide
                            ? "w-5 h-2 bg-sky-400"
                            : "w-2 h-2 bg-gray-600 hover:bg-sky-400"
                            }`}
                    />
                ))}
            </div>
        </div>
    );
}
