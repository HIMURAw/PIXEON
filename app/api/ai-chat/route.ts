import { NextRequest, NextResponse } from "next/server";

// ─── Bilgi Tabanı ───────────────────────────────────────────────────────────
const KNOWLEDGE_BASE: { patterns: RegExp[]; answer: string }[] = [
    {
        patterns: [/kargo|teslimat|gönder|ne zaman gelir|kaç günde/i],
        answer:
            "🚚 **Kargo & Teslimat**\n\nSiparişleriniz genellikle **1–3 iş günü** içinde kargoya verilir. Kargo takip numaranız, sipariş onayı e-postanıza iletilir. Hafta sonu verilen siparişler Pazartesi günü işleme alınır.",
    },
    {
        patterns: [/iade|ürünü geri|para iade|red|iptal/i],
        answer:
            "🔄 **İade & İptal Politikası**\n\nÜrün tesliminden itibaren **14 gün** içinde iade talebinde bulunabilirsiniz. İade edilecek ürün orijinal ambalajında ve kullanılmamış olmalıdır. Dijital kodlar açıldıktan sonra iade kabul edilmez.",
    },
    {
        patterns: [/ödeme|kredi kartı|havale|kapıda|taksit|banka/i],
        answer:
            "💳 **Ödeme Yöntemleri**\n\nKredi/banka kartı, havale/EFT ve kapıda ödeme seçenekleri mevcuttur. Tüm kart türlerinde **3, 6, 9, 12 taksit** imkânı sunulmaktadır. Ödemeler 256-bit SSL ile güvence altındadır.",
    },
    {
        patterns: [/garanti|arıza|bozuk|hasar/i],
        answer:
            "🛡️ **Garanti Bilgisi**\n\nSattığımız tüm ürünler **yetkili distribütör garantisi** kapsamındadır. Konsollar için 2 yıl, aksesuarlar için 1 yıl garanti geçerlidir. Garanti kapsamındaki arızalar için ürünü bize gönderebilirsiniz.",
    },
    {
        patterns: [/hesabım|giriş|şifre|kayıt|üye/i],
        answer:
            "👤 **Hesap & Üyelik**\n\nSiteye üye olmak için Kayıt Ol butonuna tıklayabilirsiniz. Şifrenizi unuttuysanız giriş sayfasındaki **'Şifremi Unuttum'** bağlantısını kullanın. Hesabınızla ilgili teknik sorunlarda destek talebi oluşturabilirsiniz.",
    },
    {
        patterns: [/sipariş|takip|nerede|sipariş durumu/i],
        answer:
            "📦 **Sipariş Takibi**\n\nSipariş durumunuzu **Hesabım → Siparişlerim** menüsünden takip edebilirsiniz. Ayrıca size gönderilen e-postadaki kargo takip numarasıyla kargo firmasının sitesinden de anlık takip yapabilirsiniz.",
    },
    {
        patterns: [/fiyat|indirim|kampanya|kupon|promosyon/i],
        answer:
            "🏷️ **Fiyat & Kampanyalar**\n\nGüncel kampanyaları ana sayfamızdan takip edebilirsiniz. Kupon kodunuz varsa ödeme adımında ilgili alana girebilirsiniz. Fiyat farkı talepleri sipariş tarihinden itibaren 24 saat içinde değerlendirilir.",
    },
    {
        patterns: [/dijital kod|steam|psn|xbox|uplay|cd key/i],
        answer:
            "🎮 **Dijital Kodlar**\n\nDijital kod siparişleri ödeme onayından sonra **15 dakika** içinde e-posta adresinize iletilir. Spam klasörünüzü de kontrol etmeyi unutmayın. Kodlar bölge kısıtlamasına tabidir, lütfen satın alırken bölgenizi doğrulayın.",
    },
    {
        patterns: [/iletişim|telefon|e-posta|mail|adres|mağaza/i],
        answer:
            "📞 **İletişim Bilgileri**\n\n• E-posta: destek@pixeon.com.tr\n• Telefon: 0850 XXX XX XX (Hafta içi 09:00–18:00)\n• Canlı destek için widget'taki **Canlı Destek** sekmesini kullanabilirsiniz.",
    },
    {
        patterns: [/merhaba|selam|hey|hi|hello/i],
        answer:
            "👋 **Merhaba!**\n\nPixeon AI Asistanı'na hoş geldiniz! Size nasıl yardımcı olabilirim?\n\nSorabilecekleriniz:\n• Kargo & teslimat süreleri\n• İade & iptal politikası\n• Ödeme yöntemleri\n• Garanti bilgisi\n• Sipariş takibi\n• Dijital kodlar",
    },
];

const FALLBACK =
    "❓ Bu konuda size yardımcı olacak bilgim bulunmuyor. Daha detaylı destek için lütfen ekibimize ulaşın:\n\n👉 **[Destek Talebi Oluşturun →](/iletisim)**\n\nDestek ekibimiz hafta içi 09:00–18:00 saatleri arasında hizmetinizdedir.";

// ─── Route Handler ───────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
    try {
        const { message } = await req.json();

        if (!message || typeof message !== "string") {
            return NextResponse.json({ error: "Geçersiz mesaj" }, { status: 400 });
        }

        const trimmed = message.trim();

        // Simulate a slight delay for natural feel
        await new Promise((resolve) => setTimeout(resolve, 600 + Math.random() * 400));

        // Match against knowledge base
        for (const entry of KNOWLEDGE_BASE) {
            if (entry.patterns.some((pattern) => pattern.test(trimmed))) {
                return NextResponse.json({ answer: entry.answer });
            }
        }

        return NextResponse.json({ answer: FALLBACK });
    } catch {
        return NextResponse.json({ error: "Bir hata oluştu" }, { status: 500 });
    }
}
