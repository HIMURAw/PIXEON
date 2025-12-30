"use client";

import { useState } from "react";
import { ChevronDown, MapPin } from "lucide-react";

const CITIES = [
    "Adana", "Adıyaman", "Afyonkarahisar", "Ağrı", "Amasya", "Ankara", "Antalya", "Artvin",
    "Aydın", "Balıkesir", "Bilecik", "Bingöl", "Bitlis", "Bolu", "Burdur", "Bursa", "Çanakkale",
    "Çankırı", "Çorum", "Denizli", "Diyarbakır", "Edirne", "Elazığ", "Erzincan", "Erzurum",
    "Eskişehir", "Gaziantep", "Giresun", "Gümüşhane", "Hakkari", "Hatay", "Isparta", "Mersin",
    "İstanbul", "İzmir", "Kars", "Kastamonu", "Kayseri", "Kırklareli", "Kırşehir", "Kocaeli",
    "Konya", "Kütahya", "Malatya", "Manisa", "Kahramanmaraş", "Mardin", "Muğla", "Muş",
    "Nevşehir", "Niğde", "Ordu", "Rize", "Sakarya", "Samsun", "Siirt", "Sinop", "Sivas",
    "Tekirdağ", "Tokat", "Trabzon", "Tunceli", "Şanlıurfa", "Uşak", "Van", "Yozgat", "Zonguldak"
];

export default function LocationButton() {
    const [open, setOpen] = useState(false);
    const [city, setCity] = useState<string | null>(() => {
        if (typeof window === "undefined") return null;
        return localStorage.getItem("city");
    });


    function selectCity(name: string) {
        setCity(name);
        localStorage.setItem("city", name);
        setOpen(false);
    }

    return (
        <>
            <button
                onClick={() => setOpen(true)}
                className="hidden md:flex items-center border border-gray-600 rounded-lg pl-6 pr-4 py-2 gap-4"
            >
                <div className="flex flex-col items-start">
                    <span className="text-xs text-gray-400">Your Location</span>
                    <span className="font-medium text-[#7dd7fb]">
                        {city ?? "Select a Location"}
                    </span>
                </div>
                <ChevronDown size={16} />
            </button>

            {open && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <div
                        className="absolute inset-0 bg-black/50"
                        onClick={() => setOpen(false)}
                    />

                    <div className="relative bg-black w-full max-w-md max-h-[70vh] rounded-xl overflow-hidden">
                        <div className="flex items-center gap-2 p-4 border-b border-gray-700 text-white font-bold">
                            <MapPin size={16} />
                            Konum Seç
                        </div>

                        <div className="overflow-y-auto max-h-[60vh]">
                            {CITIES.map((c) => (
                                <div
                                    key={c}
                                    onClick={() => selectCity(c)}
                                    className="px-4 py-3 text-gray-300 hover:bg-[#7dd7fb] hover:text-black cursor-pointer"
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
