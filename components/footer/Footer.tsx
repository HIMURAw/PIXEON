import Link from "next/link";
import Image from "next/image";
import {
    Mail,
    Truck,
    ShieldCheck,
    Clock,
    Facebook,
    Instagram,
    Twitter,
    Phone,
    MapPin,
    ArrowRight
} from "lucide-react";

export default function Footer() {
    return (
        <footer className="w-full bg-[#0c1022] text-slate-300 mt-20">
            {/* 1. Newsletter Strip */}
            <div className="bg-[#020617] border-y border-white/5 py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
                        <div className="text-center lg:text-left">
                            <h3 className="text-2xl font-bold text-white mb-2">Haftalık Bültenimize Abone Olun</h3>
                            <p className="text-slate-400 text-sm">En yeni ürünler ve özel indirimlerden ilk siz haberdar olun.</p>
                        </div>
                        <div className="w-full lg:w-auto flex flex-col sm:flex-row gap-4">
                            <div className="relative flex-1 sm:w-80">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                                <input
                                    type="email"
                                    placeholder="E-posta adresiniz"
                                    className="w-full bg-[#0c1022] border border-slate-700 rounded-xl py-3 pl-12 pr-4 text-white focus:border-sky-500 outline-none transition"
                                />
                            </div>
                            <button className="bg-sky-500 hover:bg-sky-600 text-white font-bold py-3 px-8 rounded-xl transition flex items-center justify-center gap-2 group cursor-pointer">
                                Abone Ol
                                <ArrowRight size={18} className="group-hover:translate-x-1 transition" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* 2. Service Features */}
            <div className="border-b border-white/5 py-8 bg-[#0c1022]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="flex items-center gap-4 group">
                        <div className="w-12 h-12 rounded-full bg-sky-500/10 flex items-center justify-center text-sky-400 group-hover:bg-sky-500 group-hover:text-white transition-all duration-300">
                            <Truck size={24} />
                        </div>
                        <div>
                            <h4 className="font-bold text-white">Hızlı Teslimat</h4>
                            <p className="text-xs text-slate-500">Aynı gün kapınızda.</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 group">
                        <div className="w-12 h-12 rounded-full bg-sky-500/10 flex items-center justify-center text-sky-400 group-hover:bg-sky-500 group-hover:text-white transition-all duration-300">
                            <ShieldCheck size={24} />
                        </div>
                        <div>
                            <h4 className="font-bold text-white">%100 Güvenli</h4>
                            <p className="text-xs text-slate-500">Güvenli ödeme altyapısı.</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 group">
                        <div className="w-12 h-12 rounded-full bg-sky-500/10 flex items-center justify-center text-sky-400 group-hover:bg-sky-500 group-hover:text-white transition-all duration-300">
                            <Clock size={24} />
                        </div>
                        <div>
                            <h4 className="font-bold text-white">7/24 Destek</h4>
                            <p className="text-xs text-slate-500">Dilediğiniz zaman arayın.</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* 3. Main Footer Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                    {/* Brand Column */}
                    <div className="space-y-6">
                        <Image src="/logo-nobg.png" alt="Pixeon Logo" width={120} height={120} />
                        <p className="text-sm leading-relaxed text-slate-400">
                            Pixeon, en yeni PlayStation konsollarını, en popüler oyunları ve profesyonel ekipmanları en uygun fiyatlarla sunan yetkili satış merkezinizdir.
                        </p>
                        <div className="flex gap-4">
                            {[Facebook, Instagram, Twitter].map((Icon, i) => (
                                <a key={i} href="#" className="w-10 h-10 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center hover:bg-sky-500 hover:text-white transition">
                                    <Icon size={18} />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Kategoriler */}
                    <div>
                        <h4 className="text-white font-bold mb-6 flex items-center gap-2">
                            <span className="w-1.5 h-6 bg-sky-500 rounded-full"></span>
                            Popüler Kategoriler
                        </h4>
                        <ul className="space-y-4 text-sm">
                            {["PlayStation Konsollar", "PS5 Oyunları", "PS4 Oyunları", "DualSense Kontrolcüler", "Aksesuarlar"].map((link) => (
                                <li key={link}>
                                    <Link href="#" className="hover:text-sky-400 transition-colors flex items-center gap-2">
                                        {link}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Kurumsal */}
                    <div>
                        <h4 className="text-white font-bold mb-6 flex items-center gap-2">
                            <span className="w-1.5 h-6 bg-sky-500 rounded-full"></span>
                            Hızlı Linkler
                        </h4>
                        <ul className="space-y-4 text-sm">
                            {["Hakkımızda", "Mağazalarımız", "Kariyer", "İletişim", "Blog"].map((link) => (
                                <li key={link}>
                                    <Link href="#" className="hover:text-sky-400 transition-colors">
                                        {link}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact & Support */}
                    <div>
                        <h4 className="text-white font-bold mb-6 flex items-center gap-2">
                            <span className="w-1.5 h-6 bg-sky-500 rounded-full"></span>
                            Bize Ulaşın
                        </h4>
                        <ul className="space-y-4 text-sm">
                            <li className="flex gap-3">
                                <Phone size={18} className="text-sky-400" />
                                <div>
                                    <p className="text-white font-semibold">+90 552 833 08 83</p>
                                    <p className="text-xs text-slate-500">Müşteri Hizmetleri</p>
                                </div>
                            </li>
                            <li className="flex gap-3">
                                <Mail size={18} className="text-sky-400" />
                                <div>
                                    <p className="text-white font-semibold">destek@pixeon.com</p>
                                    <p className="text-xs text-slate-500">7/24 Teknik Destek</p>
                                </div>
                            </li>
                            <li className="flex gap-3">
                                <MapPin size={18} className="text-sky-400" />
                                <div>
                                    <p className="text-white font-semibold">İstanbul, Türkiye</p>
                                    <p className="text-xs text-slate-500">Merkez Ofis</p>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* 4. Bottom Strip */}
            <div className="bg-[#020617] border-t border-white/5 py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
                    <p className="text-sm text-slate-500 text-center md:text-left">
                        © 2024 <span className="text-white font-bold">PIXEON</span> PlayStation Store. Tüm hakları saklıdır.
                    </p>

                    <div className="flex items-center gap-4 opacity-70 grayscale hover:grayscale-0 transition duration-500 px-4 py-2 bg-slate-900/50 rounded-lg border border-white/5">
                        <span className="text-[10px] text-slate-500 mr-2 uppercase tracking-widest font-bold">Ödeme Yöntemleri</span>
                        <div className="flex gap-3 text-white">
                            {/* Dummy Payment Icons/Text */}
                            <span className="font-bold">VISA</span>
                            <span className="font-bold">MASTERCARD</span>
                            <span className="font-bold">AMEX</span>
                            <span className="font-bold"> Troy</span>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
