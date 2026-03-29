"use client";
import { useState } from "react";
import Link from "next/link";
import { X, ChevronDown } from "lucide-react";
import Image from "next/image";

export default function BurgerMenu() {
    const [isOpen, setIsOpen] = useState(false);
    const [shopExpanded, setShopExpanded] = useState(false);
    const [homeExpanded, setHomeExpanded] = useState(false);

    return (
        <>
            <button
                className="text-2xl text-white hover:cursor-pointer md:hidden"
                onClick={() => setIsOpen(true)}
                aria-label="Open menu"
            >
                ☰
            </button>

            {/* Menu Overlay */}
            <div
                className={`fixed inset-0 bg-black/60 z-40 transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
                    }`}
                onClick={() => setIsOpen(false)}
            />

            {/* Menu Panel */}
            <div
                className={`fixed top-0 left-0 h-full w-80 bg-white z-50 transform transition-transform duration-300 ease-in-out overflow-y-auto shadow-2xl ${isOpen ? "translate-x-0" : "-translate-x-full"
                    }`}
            >
                {/* Header with Logo */}
                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-900 to-blue-800">
                    <div className="flex items-center gap-2">
                        <Image
                            src="/logo.png"
                            alt="Logo"
                            width={48}
                            height={48}
                        />
                    </div>
                    <button
                        onClick={() => setIsOpen(false)}
                        className="w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
                        aria-label="Close menu"
                    >
                        <X className="w-5 h-5 text-white" />
                    </button>
                </div>

                {/* Location Selector */}
                <div className="p-4 border-b border-gray-100">
                    <label className="block text-xs text-gray-500 mb-2 font-medium">
                        Your Location
                    </label>
                    <button className="w-full flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:border-blue-500 transition-colors bg-white">
                        <span className="text-blue-900 font-medium text-sm">Select a Location</span>
                        <ChevronDown className="w-4 h-4 text-gray-400" />
                    </button>
                </div>

                {/* All Categories Button */}
                <div className="p-4">
                    <button className="w-full bg-gradient-to-r from-cyan-400 to-cyan-500 text-white py-3.5 px-4 rounded-lg flex items-center justify-between hover:from-cyan-500 hover:to-cyan-600 transition-all shadow-md hover:shadow-lg">
                        <div className="flex items-center gap-3">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                            <span className="font-semibold">ALL CATEGORIES</span>
                        </div>
                        <ChevronDown className="w-5 h-5" />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="px-4 pb-4">
                    <h3 className="text-xs text-gray-400 mb-3 font-semibold uppercase tracking-wider">
                        Site Navigation
                    </h3>

                    {/* Home */}
                    <div className="border-b border-gray-100">
                        <button
                            onClick={() => setHomeExpanded(!homeExpanded)}
                            className="w-full flex items-center justify-between py-3.5 hover:text-cyan-500 transition-colors group"
                        >
                            <span className="font-medium text-gray-800 group-hover:text-cyan-500">Home</span>
                            <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${homeExpanded ? 'rotate-180' : ''
                                }`} />
                        </button>
                    </div>

                    {/* Shop */}
                    <div className="border-b border-gray-100">
                        <button
                            onClick={() => setShopExpanded(!shopExpanded)}
                            className="w-full flex items-center justify-between py-3.5 hover:text-cyan-500 transition-colors group"
                        >
                            <span className="font-medium text-gray-800 group-hover:text-cyan-500">Shop</span>
                            <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${shopExpanded ? 'rotate-180' : ''
                                }`} />
                        </button>
                        <div className={`overflow-hidden transition-all duration-300 ${shopExpanded ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'
                            }`}>
                            <div className="pl-4 pb-2 space-y-1">
                                <Link
                                    href="#"
                                    className="flex items-center gap-3 py-2.5 text-gray-600 hover:text-cyan-500 hover:bg-gray-50 rounded-md px-2 transition-colors"
                                    onClick={() => setIsOpen(false)}
                                >
                                    <span className="text-xl">🥩</span>
                                    <span className="text-sm">Meats & Seafood</span>
                                </Link>
                                <Link
                                    href="#"
                                    className="flex items-center gap-3 py-2.5 text-gray-600 hover:text-cyan-500 hover:bg-gray-50 rounded-md px-2 transition-colors"
                                    onClick={() => setIsOpen(false)}
                                >
                                    <span className="text-xl">🍞</span>
                                    <span className="text-sm">Bakery</span>
                                </Link>
                                <Link
                                    href="#"
                                    className="flex items-center gap-3 py-2.5 text-gray-600 hover:text-cyan-500 hover:bg-gray-50 rounded-md px-2 transition-colors"
                                    onClick={() => setIsOpen(false)}
                                >
                                    <span className="text-xl">☕</span>
                                    <span className="text-sm">Beverages</span>
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Blog */}
                    <Link
                        href="#"
                        className="block py-3.5 border-b border-gray-100 font-medium text-gray-800 hover:text-cyan-500 transition-colors"
                        onClick={() => setIsOpen(false)}
                    >
                        Blog
                    </Link>

                    {/* Contact */}
                    <Link
                        href="#"
                        className="block py-3.5 border-b border-gray-100 font-medium text-gray-800 hover:text-cyan-500 transition-colors"
                        onClick={() => setIsOpen(false)}
                    >
                        Contact
                    </Link>
                </nav>

                {/* Footer */}
                <div className="p-4 border-t border-gray-100 mt-auto bg-gray-50">
                    <p className="text-xs text-gray-400 mb-4 leading-relaxed">
                        Copyright 2025 © Bacola WordPress Theme. All rights reserved. Powered by KibTheme.
                    </p>

                    {/* Language Selector */}
                    <button className="w-full flex items-center justify-between p-3 border border-gray-200 rounded-lg mb-2 hover:border-blue-500 transition-colors bg-white">
                        <span className="text-gray-800 font-medium text-sm">English</span>
                        <ChevronDown className="w-4 h-4 text-gray-400" />
                    </button>

                    {/* Currency Selector */}
                    <button className="w-full flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:border-blue-500 transition-colors bg-white">
                        <span className="text-gray-800 font-medium text-sm">USD</span>
                        <ChevronDown className="w-4 h-4 text-gray-400" />
                    </button>
                </div>
            </div>
        </>
    );
}