import { db } from "../lib/db";
import { heroSlides } from "../lib/db/schema";
import { randomUUID } from "crypto";

const initialSlides = [
    {
        badge: "YENİ NESİL",
        badgeColor: "bg-blue-600",
        title: "PlayStation 5",
        subtitle: "4K 120FPS ve Işın İzleme Teknolojisi ile Oyunun Sınırlarını Zorlayın.",
        price: "18.999 ₺",
        buttonText: "Hemen İncele",
        buttonLink: "/shop",
        modelPath: "/3D/ps5.glb",
        order: 0
    },
    {
        badge: "YENİ NESİL",
        badgeColor: "bg-sky-500",
        title: "DualSense™ Wireless",
        subtitle: "Dokunsal Geri Bildirim ve Uyarlanabilir Tetiklerle Daha Derin Bir Deneyim.",
        price: "2.899 ₺",
        buttonText: "Satın Al",
        buttonLink: "/shop",
        modelPath: "/3D/playstation_5_controller.glb",
        order: 1
    },
    {
        badge: "GÜÇLÜ",
        badgeColor: "bg-zinc-700",
        title: "PlayStation 4 Pro",
        subtitle: "Dinamik 4K Oyun ve 4K Eğlence ile En Sevdiğiniz Oyunları Geliştirin.",
        price: "9.490 ₺",
        buttonText: "Keşfet",
        buttonLink: "/shop",
        modelPath: "/3D/playstation_4_pro.glb",
        order: 2
    },
    {
        badge: "EFSANE",
        badgeColor: "bg-indigo-600",
        title: "PlayStation 4",
        subtitle: "İnanılmaz Oyun Gücü ve Eğlence ile Tanışın.",
        price: "7.999 ₺",
        buttonText: "İncele",
        buttonLink: "/shop",
        modelPath: "/3D/playstation_4_original.glb",
        order: 3
    },
    {
        badge: "İNCE",
        badgeColor: "bg-slate-600",
        title: "PlayStation 4 Slim",
        subtitle: "Daha Hafif, Daha İnce ve İnanılmaz Oyun Gücü.",
        price: "8.499 ₺",
        buttonText: "Satın Al",
        buttonLink: "/shop",
        modelPath: "/3D/sony_playstation4_slim_ps4_slim.glb",
        order: 4
    },
    {
        badge: "RETRO",
        badgeColor: "bg-gray-700",
        title: "PlayStation 3 Slim",
        subtitle: "Efsanevi Oyun Kütüphanesi ve Blu-ray Oynatıcı.",
        price: "4.499 ₺",
        buttonText: "Keşfet",
        buttonLink: "/shop",
        modelPath: "/3D/ps3_slim.glb",
        order: 5
    },
    {
        badge: "KONTROL",
        badgeColor: "bg-red-600",
        title: "DualShock 3",
        subtitle: "PS3 İçin Klasik Kablosuz Kontrolcü.",
        price: "1.299 ₺",
        buttonText: "Satın Al",
        buttonLink: "/shop",
        modelPath: "/3D/gamepad_sony_dualshock_3.glb",
        order: 6
    },
    {
        badge: "KONTROL",
        badgeColor: "bg-blue-800",
        title: "DualShock 4",
        subtitle: "Hassas Kontrol ve Yenilikçi Özellikler.",
        price: "1.899 ₺",
        buttonText: "Satın Al",
        buttonLink: "/shop",
        modelPath: "/3D/dualshock_4_playstation_controller.glb",
        order: 7
    },
    {
        badge: "XBOX",
        badgeColor: "bg-green-600",
        title: "Xbox Series X",
        subtitle: "Şimdiye Kadarki En Hızlı ve En Güçlü Xbox.",
        price: "21.999 ₺",
        buttonText: "Hemen İncele",
        buttonLink: "/shop",
        modelPath: "/3D/xbox_series_x_free_3d_model.glb",
        order: 8
    },
    {
        badge: "XBOX",
        badgeColor: "bg-white text-black",
        title: "Xbox Series S",
        subtitle: "Tamamen Dijital, Yeni Nesil Performans.",
        price: "13.499 ₺",
        buttonText: "Keşfet",
        buttonLink: "/shop",
        modelPath: "/3D/xbox_series_s.glb",
        order: 9
    },
    {
        badge: "XBOX",
        badgeColor: "bg-green-700",
        title: "Xbox One S",
        subtitle: "Eğlence ve Oyunun Buluştuğu Nokta.",
        price: "6.999 ₺",
        buttonText: "Satın Al",
        buttonLink: "/shop",
        modelPath: "/3D/xbox_one_s.glb",
        order: 10
    },
    {
        badge: "8-BIT",
        badgeColor: "bg-purple-600",
        title: "8-Bit Controller",
        subtitle: "Klasik Oyun Deneyimi İçin Retro Tasarım.",
        price: "899 ₺",
        buttonText: "Satın Al",
        buttonLink: "/shop",
        modelPath: "/3D/xbox_8bit_controller.glb",
        order: 11
    }
];

async function seed() {
    console.log("Seeding hero slides...");
    try {
        for (const slide of initialSlides) {
            await db.insert(heroSlides).values({
                id: randomUUID(),
                ...slide,
                status: "ACTIVE"
            });
        }
        console.log("Seeding completed successfully!");
    } catch (error) {
        console.error("Error seeding hero slides:", error);
    }
    process.exit();
}

seed();
