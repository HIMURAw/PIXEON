# TODO: Spread out the website layout       ✔️✖️

- [✔️] Mobil uyumluluk eklenicek
- [✔️] Spread out the website layout
- [✔️] Anasayfaya ürün filtreleme özelliği eklenicek
- [✔️] En Çok Satanlar kısmı alt tarafa kayıcak bunun yerinde önerilen ürünler kısmı olucak burada kullanıcı hangi ürünlere gidiyse o kategörideki ürünler çıkıcak

- [✖️] kategoriler kısmına bir kez daha bakılıcak
- [✖️] abonelik sistemine birdaha bakılıcak
- [✔️] Cüzdan sistemi eklenicek (bakiye, işlem geçmişi, checkout'ta ödeme yöntemi, admin manuel bakiye ekleme — lib/actions/wallet-actions.ts)
- [◐] paytr entegrasyonu yapılıcak (lib/paytr.ts hazır ama gerçek merchant hesabıyla test edilmedi, checkout'a bağlanmadı — bkz. dosyanın sonundaki yönerge)
- [✖️] kargo firması entegrasyonu yapılıcak (hangi firma seçilecek belli değil, gerçek API'ye erişim olmadan entegrasyon yazmak riskli bulundu — mevcut manuel takip no girme akışı duruyor)
- [◐] netgsm entegrasyonu yapılıcak (lib/netgsm.ts hazır, sipariş kargoya verildiğinde SMS gönderiyor, ama gerçek NetGSM hesabıyla test edilmedi)
- [✔️] gmail ile bildirim gönderme sistemine bakılıcak (SMTP tabanlı e-posta servisi: sipariş onayı + destek talebi yanıtı — lib/email.ts, gerçek gönderim Ethereal test hesabıyla doğrulandı)
- [◐] google auth eklenicek (lib/google-oauth.ts + /api/auth/google hazır, giriş sayfasındaki buton bağlandı, ama gerçek Google Client ID/Secret olmadan uçtan uca test edilemedi)
- [✔️] İade sistemine bakılıcak (sipariş iptalinde stok VE cüzdan bakiyesi otomatik iade ediliyor)

- [✔️] captcha eklenicek
- [✔️] Rate limit eklenicek
- [✔️] Admin login rate limit eklenicek
- [✔️] Zod ile API güvenliği sağlanıcak
- [✔️] XSS (Cross Site Scripting) kontrol edilicek
- [✔️] ticket kısmında upload sistemine dosya boyutu kontrolü eklenicek
- [✔️] Upload klasörünü execute edilemez yapılıcak
- [✔️] admin panele giriş için 2FA eklenicek
- [✖️] sitenin tamamının güvenliğine bakılıcak

- [✖️] KVK gizliliği araştırılıcak ona göre düzenlemeler yapılıcak (şablon sayfalar eklendi, gerçek içerik hukuki incelemeden geçmeli — bkz. scripts/seed-legal-pages.ts)
- [✔️] iade politikası eklenicek
- [✔️] KVKK, mesafeli satış sözleşmesi, gizlilik politikası, çerez politikası bunlar eklenicek

- [✔️] Admin panele ayrıntılı log sistemi eklenicek
- [✔️] Admin panele canlı request monitor eklenicek
- [✔️] Logging / Monitoring sistemi eklenicek Sentry, Grafana bunlardan birisi kullanılacak
- [✖️] Cloudflare kullanılacak
- [✔️] WAFBot, protection, CDN cache bu teknolojilere bakılıcak

- [✔️] SEO optimizasyonuna bakılıcak (sitemap.xml, robots.txt, ürün/blog/site metadata + OG etiketleri, ürün sayfalarında JSON-LD)
- [◐] image optimization yapılıcak (bazı yerlerde hâlâ ham `<img>` var, next/image'e taşınmadı — bkz. Lighthouse notu)
- [✔️] lazy loading araştırılıcak ve eklenicek
- [✔️] 3D objelerin performansı arttırılacak
- [✔️] Search sistemi Algolia, Elasticsearch, Meilisearch bunlardan birisi ile değiştirilicek,
- [✔️] sepete ve ürünlere paylaşma özelliği eklenicek

- [✖️] destek kısmındaki yapay zeka geliştirilicek

- [✔️] Admin panel activity audit sistemi yapılacak (about/banner/blog/CMS/hero/menü aksiyonlarına admin_logs kaydı eklendi)
- [◐] Backup sistemi kurulacak (scripts/backup-db.ts hazır ve test edildi — `npm run db:backup` — ama gerçek sunucuda cron/Task Scheduler'a bağlanmadı)
- [◐] DB otomatik backup sistemi yapılacak (yukarıdakiyle aynı — script hazır, otomatik tetikleme kurulmadı)
- [✖️] Queue sistemi araştırılacak (BullMQ vs) (Redis bu ortamda yoktu, güvenilir şekilde kurup test edilemedi)
- [✖️] Email queue sistemi yapılacak (e-posta gönderimi senkron/best-effort — ayrı bir kuyruk sistemi yok)
- [✔️] Stok yönetim sistemi test edilecek (eşzamanlı sipariş race condition ve sepet stok kontrolü düzeltildi)
- [✖️] Ödeme başarısız senaryoları test edilecek (gerçek ödeme gateway'i (PayTR vb.) entegre değil; sipariş iptalinde stok iadesi eklendi ama gateway hata senaryoları test edilemedi)
- [✔️] Lighthouse performans testi yapılacak (production build'e karşı çalıştırıldı: accessibility 75→85, SEO 92→100; performans 39 — ana sebep ModelViewer.tsx'teki 1.5MB HDR dosyası, görsel doğrulama gerektirdiği için dokunulmadı)
- [✖️] Mobile gesture UX iyileştirilecek
- [✔️] Error boundary sistemi eklenecek
- [✔️] Global error handling yapılacak
- [✔️] Maintenance mode sistemi yapılacak
- [✔️] Feature flag sistemi araştırılacak



- [✖️] Kullanıcı deneyimi test edilicek
- [✖️] Sentry ayarlanıcak