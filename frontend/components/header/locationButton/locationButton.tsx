"use client";

import { useState } from "react";
import { ChevronDown, MapPin } from "lucide-react";

const CITIES = [
    "Adana","Adıyaman","Afyonkarahisar","Ağrı","Amasya","Ankara","Antalya","Artvin",
    "Aydın","Balıkesir","Bilecik","Bingöl","Bitlis","Bolu","Burdur","Bursa","Çanakkale",
    "Çankırı","Çorum","Denizli","Diyarbakır","Edirne","Elazığ","Erzincan","Erzurum",
    "Eskişehir","Gaziantep","Giresun","Gümüşhane","Hakkari","Hatay","Isparta","Mersin",
    "İstanbul","İzmir","Kars","Kastamonu","Kayseri","Kırklareli","Kırşehir","Kocaeli",
    "Konya","Kütahya","Malatya","Manisa","Kahramanmaraş","Mardin","Muğla","Muş",
    "Nevşehir","Niğde","Ordu","Rize","Sakarya","Samsun","Siirt","Sinop","Sivas",
    "Tekirdağ","Tokat","Trabzon","Tunceli","Şanlıurfa","Uşak","Van","Yozgat","Zonguldak"
];

export default function LocationButton() {
    const [open, setOpen] = useState(false);
    const [city, setCity] = useState<string | null>(() => {
        if (typeof window === "undefined") return null;
        return localStorage.getItem("city");
    });

    async function detectLocation() {
        if (!navigator.geolocation) return;

        navigator.geolocation.getCurrentPosition(async (pos) => {
            const { latitude, longitude } = pos.coords;

            const res = await fetch(
                `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
            );
            const data = await res.json();

            const detectedCity =
                data.address.city ||
                data.address.town ||
                data.address.state;

            if (detectedCity) {
                setCity(detectedCity);
                localStorage.setItem("city", detectedCity);
            }
        });
    }

    function selectCity(name: string) {
        setCity(name);
        localStorage.setItem("city", name);
        setOpen(false);
    }

    return (
        <>
            {/* BUTTON */}
            <button
                onClick={() => setOpen(true)}
                className="hidden md:flex items-center gap-4 ml-5 px-6 py-2.5
                bg-slate-900 border border-slate-700 rounded-xl
                hover:border-sky-500 hover:bg-slate-800 transition"
            >
                <div className="flex flex-col items-start leading-tight">
                    <span className="text-xs text-slate-400">Your Location</span>
                    <span className="font-semibold text-sky-400">
                        {city ?? "Select a Location"}
                    </span>
                </div>
                <ChevronDown size={16} className="text-slate-300" />
            </button>

            {/* MODAL */}
            {open && (
                <div className="fixed inset-0 z-1000 flex items-center justify-center scroll-smooth">
                    {/* Overlay */}
                    <div
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        onClick={() => setOpen(false)}
                    />

                    {/* Card */}
                    <div className="relative bg-slate-900 w-full max-w-md rounded-2xl
                        border border-slate-700 shadow-xl overflow-hidden">

                        {/* Header */}
                        <div className="flex items-center gap-2 px-5 py-4
                            border-b border-slate-700 text-slate-200 font-semibold">
                            <MapPin size={16} className="text-sky-400" />
                            Select Location
                        </div>

                        {/* List */}
                        <div className="overflow-y-auto max-h-[60vh] scrollbar-thin scrollbar-thumb-slate-700">
                            <div
                                onClick={detectLocation}
                                className="px-5 py-3 text-slate-300
                                        hover:bg-sky-500 hover:text-slate-900
                                        font-medium cursor-pointer transition"
                            >
                                📍 Detect Automatically
                            </div>

                            {CITIES.map((c) => (
                                <div
                                    key={c}
                                    onClick={() => selectCity(c)}
                                    className="px-5 py-3 text-slate-300
                                    hover:bg-slate-800 hover:text-sky-400
                                    cursor-pointer transition"
                                >
                                    {c}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
