// Seeds standard Turkish e-commerce legal pages (KVKK, privacy, cookies,
// distance sales, refund) as published CMS pages. This is placeholder/template
// content — it must be reviewed by a lawyer and filled in with real company
// details (unvan, vergi no, MERSİS no, adres, banka bilgileri) before real use.
import "dotenv/config";
import { db } from "../lib/db/index";
import { cmsPages } from "../lib/db/schema";
import { eq } from "drizzle-orm";

const DISCLAIMER = `
  <div style="border:1px solid rgba(251,191,36,0.3);background:rgba(251,191,36,0.08);border-radius:12px;padding:16px 20px;margin-bottom:32px;">
    <strong>Not:</strong> Bu metin bir şablondur ve gerçek şirket bilgileriyle
    (unvan, adres, vergi dairesi/no, MERSİS no, iletişim bilgileri) doldurulmadan
    ve bir hukuk danışmanı tarafından incelenmeden yayına alınmamalıdır.
  </div>
`;

const pages: { slug: string; title: string; content: string }[] = [
  {
    slug: "kvkk-aydinlatma-metni",
    title: "KVKK Aydınlatma Metni",
    content: `${DISCLAIMER}
      <p>PIXEON ("Şirket") olarak, 6698 sayılı Kişisel Verilerin Korunması Kanunu ("KVKK") kapsamında veri sorumlusu sıfatıyla, kişisel verilerinizin işlenmesine ilişkin sizleri bilgilendirmek isteriz.</p>
      <h2>1. İşlenen Kişisel Veriler</h2>
      <p>Sitemiz üzerinden hesap oluşturmanız, sipariş vermeniz ve destek talebinde bulunmanız sırasında; ad-soyad, e-posta adresi, telefon numarası, teslimat/fatura adresi, sipariş ve ödeme bilgileri, IP adresi ve site kullanım verileriniz işlenebilmektedir.</p>
      <h2>2. Kişisel Verilerin İşlenme Amaçları</h2>
      <ul>
        <li>Üyelik ve sipariş süreçlerinin yürütülmesi</li>
        <li>Ürün teslimatının sağlanması</li>
        <li>Müşteri destek taleplerinin yanıtlanması</li>
        <li>Yasal yükümlülüklerin yerine getirilmesi</li>
        <li>Site güvenliğinin sağlanması (dolandırıcılık/kötüye kullanım önleme)</li>
      </ul>
      <h2>3. Kişisel Verilerin Aktarılması</h2>
      <p>Kişisel verileriniz; kargo firmaları, ödeme kuruluşları ve yasal olarak yetkili kamu kurumları ile, yalnızca hizmetin ifası için gerekli olduğu ölçüde paylaşılabilir.</p>
      <h2>4. Haklarınız</h2>
      <p>KVKK'nın 11. maddesi uyarınca; kişisel verilerinizin işlenip işlenmediğini öğrenme, işlenmişse buna ilişkin bilgi talep etme, işlenme amacını öğrenme, yurt içinde/yurt dışında aktarıldığı üçüncü kişileri bilme, eksik/yanlış işlenmişse düzeltilmesini isteme, silinmesini/yok edilmesini isteme haklarına sahipsiniz.</p>
      <p>Taleplerinizi <a href="/iletisim">iletişim</a> sayfamızdan bize iletebilirsiniz.</p>`,
  },
  {
    slug: "gizlilik-politikasi",
    title: "Gizlilik Politikası",
    content: `${DISCLAIMER}
      <p>Bu Gizlilik Politikası, PIXEON internet sitesini ("Site") kullanırken elde edilen kişisel verilerin nasıl toplandığını, kullanıldığını ve korunduğunu açıklamaktadır.</p>
      <h2>1. Toplanan Bilgiler</h2>
      <p>Site üzerinden üyelik, sipariş ve destek süreçlerinde ad, e-posta, telefon, adres ve ödeme bilgileri gibi veriler toplanabilir. Ayrıca çerezler aracılığıyla site kullanım verileri işlenebilir (bkz. <a href="/p/cerez-politikasi">Çerez Politikası</a>).</p>
      <h2>2. Bilgilerin Kullanımı</h2>
      <p>Toplanan bilgiler; siparişlerinizin işleme alınması, hesabınızın yönetilmesi, müşteri desteği sağlanması ve yasal yükümlülüklerin yerine getirilmesi amacıyla kullanılır. Bilgileriniz izniniz olmadan üçüncü taraflarla pazarlama amacıyla paylaşılmaz.</p>
      <h2>3. Veri Güvenliği</h2>
      <p>Kişisel verileriniz, yetkisiz erişime karşı makul teknik ve idari tedbirlerle (şifreleme, erişim kısıtlaması, güvenlik izleme) korunmaktadır. Ödeme bilgileriniz doğrudan sitemizde saklanmaz; ödeme kuruluşlarının güvenli altyapısı üzerinden işlenir.</p>
      <h2>4. Üçüncü Taraf Bağlantılar</h2>
      <p>Sitemiz, üçüncü taraf sitelere bağlantılar içerebilir. Bu sitelerin gizlilik uygulamalarından PIXEON sorumlu değildir.</p>
      <h2>5. İletişim</h2>
      <p>Gizlilik politikamızla ilgili sorularınız için <a href="/iletisim">iletişim</a> sayfamızı kullanabilirsiniz.</p>`,
  },
  {
    slug: "cerez-politikasi",
    title: "Çerez Politikası",
    content: `${DISCLAIMER}
      <p>PIXEON olarak, sitemizi ziyaret ettiğinizde deneyiminizi iyileştirmek amacıyla çerezler (cookies) kullanıyoruz.</p>
      <h2>1. Çerez Nedir?</h2>
      <p>Çerezler, ziyaret ettiğiniz internet siteleri tarafından tarayıcınıza kaydedilen küçük metin dosyalarıdır.</p>
      <h2>2. Kullandığımız Çerez Türleri</h2>
      <ul>
        <li><strong>Zorunlu Çerezler:</strong> Oturum yönetimi ve site güvenliği için gereklidir (ör. giriş oturumu çerezi).</li>
        <li><strong>Performans Çerezleri:</strong> Site kullanımını analiz ederek deneyimi iyileştirmemize yardımcı olur.</li>
        <li><strong>Fonksiyonel Çerezler:</strong> Sepet içeriği ve tercihlerinizin hatırlanmasını sağlar.</li>
      </ul>
      <h2>3. Çerez Tercihlerinizin Yönetimi</h2>
      <p>Tarayıcı ayarlarınızdan çerezleri silebilir veya engelleyebilirsiniz. Ancak zorunlu çerezlerin engellenmesi, sitenin bazı bölümlerinin düzgün çalışmamasına neden olabilir.</p>
      <h2>4. İletişim</h2>
      <p>Çerez politikamızla ilgili sorularınız için <a href="/iletisim">iletişim</a> sayfamızı kullanabilirsiniz.</p>`,
  },
  {
    slug: "mesafeli-satis-sozlesmesi",
    title: "Mesafeli Satış Sözleşmesi",
    content: `${DISCLAIMER}
      <p>İşbu Mesafeli Satış Sözleşmesi, 6502 sayılı Tüketicinin Korunması Hakkında Kanun ve Mesafeli Sözleşmeler Yönetmeliği hükümleri gereğince düzenlenmiştir.</p>
      <h2>1. Taraflar</h2>
      <p><strong>Satıcı:</strong> [ŞİRKET UNVANI], [ADRES], Vergi Dairesi/No: [·], MERSİS No: [·]</p>
      <p><strong>Alıcı:</strong> Sitemiz üzerinden sipariş veren gerçek/tüzel kişi ("Tüketici")</p>
      <h2>2. Sözleşmenin Konusu</h2>
      <p>İşbu sözleşmenin konusu, Alıcı'nın Satıcı'ya ait internet sitesinden elektronik ortamda siparişini verdiği ürün/hizmetin satışı ve teslimi ile ilgili tarafların hak ve yükümlülüklerinin belirlenmesidir.</p>
      <h2>3. Sipariş ve Ödeme</h2>
      <p>Siparişler site üzerinden elektronik ortamda verilir. Ödeme; kredi/banka kartı veya havale/EFT yöntemleriyle yapılabilir. Sipariş onayı, ödeme onaylandıktan sonra e-posta ile gönderilir.</p>
      <h2>4. Teslimat</h2>
      <p>Siparişler, stok durumuna bağlı olarak belirtilen sürede kargoya verilir. Dijital kodlar, ödeme onayından sonra elektronik ortamda (e-posta) teslim edilir.</p>
      <h2>5. Cayma Hakkı</h2>
      <p>Alıcı, fiziksel ürünlerde malı teslim aldığı tarihten itibaren 14 gün içinde herhangi bir gerekçe göstermeksizin sözleşmeden cayma hakkına sahiptir. Elektronik ortamda anında ifa edilen dijital içerikler (dijital kodlar) için, Alıcı'nın onayı ile cayma hakkı kullanılamaz hale gelir (bkz. <a href="/p/iade-politikasi">İade Politikası</a>).</p>
      <h2>6. Uyuşmazlıkların Çözümü</h2>
      <p>İşbu sözleşmeden doğan uyuşmazlıklarda, Ticaret Bakanlığınca ilan edilen değere kadar Tüketici Hakem Heyetleri, üzerindeki uyuşmazlıklarda ise Tüketici Mahkemeleri yetkilidir.</p>`,
  },
  {
    slug: "iade-politikasi",
    title: "İade ve Cayma Hakkı Politikası",
    content: `${DISCLAIMER}
      <p>PIXEON olarak müşteri memnuniyeti önceliğimizdir. İade süreçlerimiz aşağıdaki şekilde işler.</p>
      <h2>1. İade Süresi</h2>
      <p>Fiziksel ürünlerde, ürünü teslim aldığınız tarihten itibaren <strong>14 gün</strong> içinde, kullanılmamış ve orijinal ambalajında olmak kaydıyla iade talebinde bulunabilirsiniz.</p>
      <h2>2. Dijital Kodlar</h2>
      <p>Dijital kodlar (oyun kodu, üyelik kodu vb.), doğası gereği teslim/aktivasyon sonrası iade edilemez; kodun açılmamış/kullanılmamış olması durumu değiştirmez, zira kodun görüntülenmesi dahi geri alınamaz bir teslimdir. Yalnızca ürün hatası (geçersiz/kullanılmış kod) durumunda değişim veya iade yapılır.</p>
      <h2>3. İade Süreci</h2>
      <ol>
        <li>Hesabım → Siparişlerim üzerinden iade talebinizi oluşturun veya <a href="/iletisim">destek talebi</a> açın.</li>
        <li>Ürünü orijinal ambalajıyla, faturasıyla birlikte belirtilen adrese gönderin.</li>
        <li>Ürün kontrolü sonrası, iade tutarı ödemenin yapıldığı yönteme 5-10 iş günü içinde iade edilir.</li>
      </ol>
      <h2>4. İade Edilemeyecek Ürünler</h2>
      <ul>
        <li>Kullanılmış, hasar görmüş veya ambalajı açılmış donanım ürünleri (hijyen/güvenlik gerekçesiyle istisnalar hariç)</li>
        <li>Aktivasyonu/teslimi yapılmış dijital kodlar</li>
        <li>Kişiye özel üretilen/kişiselleştirilen ürünler</li>
      </ul>
      <h2>5. Garanti Kapsamındaki Arızalar</h2>
      <p>Üretim hatası kaynaklı arızalarda, ürün yetkili distribütör garantisi kapsamında değerlendirilir; iade süresi bu durumdan etkilenmez.</p>
      <p>Sorularınız için <a href="/iletisim">iletişim</a> sayfamızdan bize ulaşabilirsiniz.</p>`,
  },
];

async function main() {
  for (const page of pages) {
    const existing = await db.query.cmsPages.findFirst({ where: eq(cmsPages.slug, page.slug) });
    if (existing) {
      await db.update(cmsPages).set({ title: page.title, content: page.content, status: "PUBLISHED" }).where(eq(cmsPages.id, existing.id));
      console.log(`Updated: ${page.slug}`);
    } else {
      await db.insert(cmsPages).values({
        id: crypto.randomUUID(),
        title: page.title,
        slug: page.slug,
        content: page.content,
        status: "PUBLISHED",
      });
      console.log(`Created: ${page.slug}`);
    }
  }
  console.log("Done.");
  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
