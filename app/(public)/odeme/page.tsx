"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  CreditCard as CardIcon, 
  MapPin, 
  Plus, 
  Loader2, 
  ShieldCheck, 
  ChevronLeft, 
  ArrowRight, 
  ShoppingBag,
  Info
} from "lucide-react";
import TopBar from "@/components/header/TopBar";
import MainBar from "@/components/header/MainBar";
import Head from "@/components/header/Head";
import Footer from "@/components/footer/Footer";
import { useCart } from "@/context/CartContext";
import { getUserAddresses, addAddress, setDefaultAddress } from "@/lib/actions/user-actions";
import { createOrder } from "@/lib/actions/order-actions";
import toast from "react-hot-toast";

interface Address {
  id: string;
  title: string;
  name: string | null;
  phone: string | null;
  city: string;
  district: string;
  addressDetail: string;
  isDefault: boolean;
}

export default function CheckoutPage() {
  const router = useRouter();
  const { cartItems, loading: cartLoading, subtotal, shipping, total, totalItems, clearCart, coupon, discountAmount } = useCart();

  // Authentication & Address States
  const [user, setUser] = useState<any>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string>("");
  const [showAddressForm, setShowAddressForm] = useState(false);

  // Address Form State
  const [addressForm, setAddressForm] = useState({
    title: "",
    name: "",
    phone: "",
    city: "",
    district: "",
    addressDetail: "",
    isDefault: false
  });
  const [addingAddress, setAddingAddress] = useState(false);

  // Checkout & Payment States
  const paymentMethod = "Credit Card";
  const [submittingOrder, setSubmittingOrder] = useState(false);

  // Credit Card Interactive Form States
  const [cardDetails, setCardDetails] = useState({
    number: "",
    name: "",
    expiry: "",
    cvv: ""
  });
  const [isCardFlipped, setIsCardFlipped] = useState(false);

  // Fetch Session on Mount
  useEffect(() => {
    async function checkSession() {
      try {
        const res = await fetch("/api/auth/me");
        const data = await res.json();
        if (data.success && data.user) {
          setUser(data.user);
          // Load user addresses
          const userAddrs = await getUserAddresses(data.user.id);
          setAddresses(userAddrs);
          const defaultAddr = userAddrs.find((a: Address) => a.isDefault);
          if (defaultAddr) {
            setSelectedAddressId(defaultAddr.id);
          } else if (userAddrs.length > 0) {
            setSelectedAddressId(userAddrs[0].id);
          }
        }
      } catch (err) {
        console.error("Session fetch failed:", err);
      } finally {
        setAuthLoading(false);
      }
    }
    checkSession();
  }, []);

  // Format Card Number with Spaces (XXXX XXXX XXXX XXXX)
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, ""); // Only digits
    if (value.length > 16) value = value.slice(0, 16);
    const formatted = value.replace(/(\d{4})(?=\d)/g, "$1 ");
    setCardDetails(prev => ({ ...prev, number: formatted }));
  };

  // Format Expiry Date (MM/YY)
  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, ""); // Only digits
    if (value.length > 4) value = value.slice(0, 4);
    if (value.length > 2) {
      value = `${value.slice(0, 2)}/${value.slice(2)}`;
    }
    setCardDetails(prev => ({ ...prev, expiry: value }));
  };

  // Handle CVV Input
  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 3) value = value.slice(0, 3);
    setCardDetails(prev => ({ ...prev, cvv: value }));
  };



  // Handle Add Address Submit
  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    if (!addressForm.title || !addressForm.name || !addressForm.phone || !addressForm.city || !addressForm.district || !addressForm.addressDetail) {
      toast.error("Lütfen tüm alanları doldurun.");
      return;
    }

    setAddingAddress(true);
    try {
      const res = await addAddress(user.id, addressForm);
      if (res.success) {
        toast.success("Adres başarıyla eklendi.");
        // Reload addresses
        const freshAddrs = await getUserAddresses(user.id);
        setAddresses(freshAddrs);
        // Select newly added address
        const latestAddr = freshAddrs.find((a: Address) => a.title === addressForm.title);
        if (latestAddr) {
          setSelectedAddressId(latestAddr.id);
        } else if (freshAddrs.length > 0) {
          setSelectedAddressId(freshAddrs[freshAddrs.length - 1].id);
        }
        setShowAddressForm(false);
        // Reset form
        setAddressForm({
          title: "",
          name: "",
          phone: "",
          city: "",
          district: "",
          addressDetail: "",
          isDefault: false
        });
      } else {
        toast.error(res.error || "Adres eklenemedi.");
      }
    } catch (err) {
      toast.error("Adres eklenirken bir hata oluştu.");
    } finally {
      setAddingAddress(false);
    }
  };

  // Handle Final Order Placement
  const handleCompleteOrder = async () => {
    if (!user) return;

    if (!selectedAddressId) {
      toast.error("Lütfen bir teslimat adresi seçin.");
      return;
    }

    if (paymentMethod === "Credit Card") {
      const cleanCardNum = cardDetails.number.replace(/\s/g, "");
      if (cleanCardNum.length !== 16) {
        toast.error("Lütfen 16 haneli geçerli bir kart numarası girin.");
        return;
      }
      if (!cardDetails.name.trim()) {
        toast.error("Lütfen kart sahibinin adını girin.");
        return;
      }
      if (cardDetails.expiry.length !== 5) {
        toast.error("Lütfen son kullanma tarihini MM/YY formatında girin.");
        return;
      }
      if (cardDetails.cvv.length !== 3) {
        toast.error("Lütfen 3 haneli CVV kodunu girin.");
        return;
      }
    }

    setSubmittingOrder(true);
    try {
      const res = await createOrder({
        userId: user.id,
        addressId: selectedAddressId,
        paymentMethod,
        couponCode: coupon?.code
      });

      if (res.success && res.orderNumber) {
        // Clear cart local state helper
        await clearCart();
        toast.success("Siparişiniz başarıyla alındı!");
        router.push(`/odeme/basarili?orderNumber=${res.orderNumber}`);
      } else {
        toast.error(res.error || "Sipariş oluşturulurken bir hata oluştu.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Bir sorun oluştu. Sipariş verilemedi.");
    } finally {
      setSubmittingOrder(false);
    }
  };

  if (authLoading || cartLoading) {
    return (
      <div className="min-h-screen bg-[#020617] text-slate-200">
        <TopBar />
        <MainBar />
        <Head />
        <main className="w-full px-4 sm:px-6 lg:px-8 py-20 flex flex-col items-center justify-center min-h-[400px]">
          <Loader2 size={40} className="animate-spin text-blue-500 mb-4" />
          <p className="text-slate-400 font-bold uppercase tracking-wider text-xs">Sayfa Yükleniyor...</p>
        </main>
        <Footer />
      </div>
    );
  }

  // Not Logged In State
  if (!user) {
    return (
      <div className="min-h-screen bg-[#020617] text-slate-200">
        <TopBar />
        <MainBar />
        <Head />
        <main className="max-w-md mx-auto px-4 py-24 text-center space-y-8">
          <div className="w-20 h-20 bg-blue-600/10 border border-blue-500/20 rounded-full flex items-center justify-center mx-auto shadow-inner">
            <ShieldCheck size={36} className="text-blue-400" />
          </div>
          <div className="space-y-3">
            <h2 className="text-2xl font-bold text-white tracking-tight">Üye Girişi Gerekli</h2>
            <p className="text-slate-400 text-sm leading-relaxed">
              Ödeme işlemine devam edebilmek için lütfen TUGER hesabınıza giriş yapın.
            </p>
          </div>
          <div className="pt-2">
            <Link 
              href={`/login?callbackUrl=/odeme`} 
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3.5 px-6 rounded-2xl flex items-center justify-center gap-2 transition active:scale-98 text-sm uppercase tracking-wider"
            >
              Giriş Yap / Üye Ol
              <ArrowRight size={18} />
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Cart Empty State
  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-[#020617] text-slate-200">
        <TopBar />
        <MainBar />
        <Head />
        <main className="max-w-md mx-auto px-4 py-24 text-center space-y-8">
          <div className="w-20 h-20 bg-slate-900 border border-white/10 rounded-full flex items-center justify-center mx-auto">
            <ShoppingBag size={36} className="text-slate-500" />
          </div>
          <div className="space-y-3">
            <h2 className="text-2xl font-bold text-white tracking-tight">Sepetiniz Boş</h2>
            <p className="text-slate-400 text-sm leading-relaxed">
              Satın alacak bir ürün bulunamadı. Hemen alışverişe başlayın!
            </p>
          </div>
          <div className="pt-2">
            <Link 
              href="/" 
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold px-6 py-3 rounded-full transition text-sm group"
            >
              Alışverişe Başla
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200">
      <TopBar />
      <MainBar />
      <Head />

      <main className="w-full px-4 sm:px-6 lg:px-8 py-10 space-y-12">
        {/* Header */}
        <div className="flex items-center gap-4 border-b border-white/5 pb-6">
          <Link href="/sepet" className="group p-2 bg-[#0b1220] border border-white/10 rounded-full text-slate-400 hover:text-white transition-all hover:bg-blue-400/10">
            <ChevronLeft size={20} className="group-hover:-translate-x-0.5 transition-transform" />
          </Link>
          <div>
            <h1 className="text-xl font-semibold text-white">Ödeme Sayfası</h1>
            <p className="text-sm text-gray-400 mt-0.5">Sipariş bilgilerinizi girerek alışverişinizi tamamlayın.</p>
          </div>
        </div>

        {/* Form Content */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8 items-start">
          
          {/* LEFT COLUMN */}
          <div className="space-y-8">
            
            {/* 1. ADDRESS SECTION */}
            <div className="bg-[#0b1220] border border-white/10 rounded-2xl p-6 space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <MapPin size={18} className="text-blue-400" />
                  Teslimat & Fatura Adresi
                </h3>
                {!showAddressForm && (
                  <button 
                    onClick={() => setShowAddressForm(true)}
                    className="flex items-center gap-1 text-xs font-semibold text-blue-400 hover:text-blue-300 transition-colors border border-blue-500/20 hover:bg-blue-500/10 px-3 py-1.5 rounded-full"
                  >
                    <Plus size={14} /> Yeni Adres
                  </button>
                )}
              </div>

              {/* Saved Addresses List */}
              {!showAddressForm ? (
                addresses.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {addresses.map(addr => (
                      <div 
                        key={addr.id}
                        onClick={() => setSelectedAddressId(addr.id)}
                        className={`p-4 rounded-xl border transition-all cursor-pointer relative group flex flex-col justify-between min-h-[140px] ${
                          selectedAddressId === addr.id 
                            ? "bg-blue-600/10 border-blue-500 shadow-[0_0_15px_rgba(37,99,235,0.1)]" 
                            : "bg-[#020617] border-white/5 hover:border-white/15"
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between gap-2 mb-2">
                            <span className="text-xs font-bold text-white uppercase tracking-wider bg-white/5 px-2 py-0.5 rounded">
                              {addr.title}
                            </span>
                            {addr.isDefault && (
                              <span className="text-[9px] text-emerald-400 font-bold uppercase tracking-wider bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                                Varsayılan
                              </span>
                            )}
                          </div>
                          <p className="text-xs font-semibold text-slate-300 mb-1">{addr.name}</p>
                          <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">{addr.addressDetail}</p>
                        </div>
                        <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-4">
                          {addr.district} / {addr.city}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-8 text-center bg-[#020617] border border-white/5 rounded-xl space-y-4">
                    <p className="text-slate-400 text-sm">Kayıtlı teslimat adresiniz bulunmuyor.</p>
                    <button 
                      onClick={() => setShowAddressForm(true)}
                      className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs py-2.5 px-4 rounded-full transition"
                    >
                      Adres Ekle
                    </button>
                  </div>
                )
              ) : (
                /* Add Address Form */
                <form onSubmit={handleAddAddress} className="space-y-4 bg-[#020617] p-5 rounded-xl border border-white/5">
                  <div className="flex justify-between items-center border-b border-white/5 pb-3">
                    <h4 className="text-xs font-bold text-white uppercase tracking-widest">Yeni Adres Ekle</h4>
                    <button 
                      type="button" 
                      onClick={() => setShowAddressForm(false)}
                      className="text-xs text-slate-500 hover:text-white transition-colors"
                    >
                      İptal Et
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Adres Başlığı (Örn: Ev, İş)</label>
                      <input 
                        type="text" 
                        required
                        placeholder="Örn: Ev"
                        value={addressForm.title}
                        onChange={e => setAddressForm(prev => ({ ...prev, title: e.target.value }))}
                        className="w-full bg-[#0b1220] border border-white/10 rounded-xl py-3 px-4 text-xs font-medium text-white outline-none focus:border-blue-500 transition-all"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Alıcı Adı Soyadı</label>
                      <input 
                        type="text" 
                        required
                        placeholder="Örn: Ahmet Yılmaz"
                        value={addressForm.name}
                        onChange={e => setAddressForm(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full bg-[#0b1220] border border-white/10 rounded-xl py-3 px-4 text-xs font-medium text-white outline-none focus:border-blue-500 transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Telefon Numarası</label>
                      <input 
                        type="tel" 
                        required
                        placeholder="Örn: 0555 555 5555"
                        value={addressForm.phone}
                        onChange={e => setAddressForm(prev => ({ ...prev, phone: e.target.value }))}
                        className="w-full bg-[#0b1220] border border-white/10 rounded-xl py-3 px-4 text-xs font-medium text-white outline-none focus:border-blue-500 transition-all"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">İl</label>
                      <input 
                        type="text" 
                        required
                        placeholder="Örn: İstanbul"
                        value={addressForm.city}
                        onChange={e => setAddressForm(prev => ({ ...prev, city: e.target.value }))}
                        className="w-full bg-[#0b1220] border border-white/10 rounded-xl py-3 px-4 text-xs font-medium text-white outline-none focus:border-blue-500 transition-all"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">İlçe</label>
                      <input 
                        type="text" 
                        required
                        placeholder="Örn: Kadıköy"
                        value={addressForm.district}
                        onChange={e => setAddressForm(prev => ({ ...prev, district: e.target.value }))}
                        className="w-full bg-[#0b1220] border border-white/10 rounded-xl py-3 px-4 text-xs font-medium text-white outline-none focus:border-blue-500 transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Adres Detayı</label>
                    <textarea 
                      required
                      rows={3}
                      placeholder="Mahalle, Sokak, Daire No, Kat..."
                      value={addressForm.addressDetail}
                      onChange={e => setAddressForm(prev => ({ ...prev, addressDetail: e.target.value }))}
                      className="w-full bg-[#0b1220] border border-white/10 rounded-xl py-3 px-4 text-xs font-medium text-white outline-none focus:border-blue-500 transition-all resize-none"
                    />
                  </div>

                  <label className="flex items-center gap-2 cursor-pointer pt-1">
                    <input 
                      type="checkbox" 
                      checked={addressForm.isDefault}
                      onChange={e => setAddressForm(prev => ({ ...prev, isDefault: e.target.checked }))}
                      className="rounded border-white/10 bg-[#0b1220] text-blue-600 focus:ring-0 focus:ring-offset-0"
                    />
                    <span className="text-[11px] text-slate-400 font-medium">Bu adresi varsayılan olarak kaydet</span>
                  </label>

                  <button 
                    type="submit"
                    disabled={addingAddress}
                    className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold py-3 rounded-xl transition text-xs flex items-center justify-center gap-2"
                  >
                    {addingAddress && <Loader2 size={14} className="animate-spin" />}
                    ADRESİ KAYDET
                  </button>
                </form>
              )}
            </div>

            {/* 2. PAYMENT METHODS SECTION */}
            <div className="bg-[#0b1220] border border-white/10 rounded-2xl p-6 space-y-6">
              <h3 className="text-base font-bold text-white flex items-center gap-2 border-b border-white/5 pb-4">
                <CardIcon size={18} className="text-blue-400" />
                Ödeme Bilgileri (Kredi / Banka Kartı)
              </h3>

              <div className="space-y-8">
                {/* Dynamic Credit Card Visualizer */}
                <div className="flex justify-center perspective-1000">
                  <div 
                    className={`relative w-80 h-48 rounded-2xl text-white transition-transform duration-500 transform-style-3d shadow-2xl cursor-pointer ${
                      isCardFlipped ? "rotate-y-180" : ""
                    }`}
                    style={{
                      backgroundImage: "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)",
                      border: "1px solid rgba(255, 255, 255, 0.1)"
                    }}
                    onClick={() => setIsCardFlipped(!isCardFlipped)}
                  >
                    {/* CARD FRONT FACE */}
                    <div className="absolute inset-0 w-full h-full p-6 flex flex-col justify-between backface-hidden">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-[8px] text-slate-400 font-bold uppercase tracking-widest">TUGER SECURE</p>
                          <div className="w-10 h-7 bg-amber-500/80 rounded-md border border-amber-600 mt-2 shadow flex items-center justify-center overflow-hidden">
                            {/* Chip Lines */}
                            <div className="w-full h-full opacity-30 grid grid-cols-3 divide-x divide-y divide-black/30" />
                          </div>
                        </div>
                        <span className="text-xs font-black tracking-widest bg-gradient-to-r from-blue-400 to-sky-400 bg-clip-text text-transparent">PayTR MOCK</span>
                      </div>
                      <div>
                        <p className="text-base font-bold font-mono tracking-widest text-slate-200">
                          {cardDetails.number || "•••• •••• •••• ••••"}
                        </p>
                      </div>
                      <div className="flex justify-between items-end">
                        <div>
                          <p className="text-[7px] text-slate-400 font-bold uppercase tracking-widest">KART SAHİBİ</p>
                          <p className="text-xs font-bold uppercase tracking-wider truncate w-44">
                            {cardDetails.name || "KART SAHİBİ ADI"}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-[7px] text-slate-400 font-bold uppercase tracking-widest">S.K.T</p>
                          <p className="text-xs font-bold font-mono">
                            {cardDetails.expiry || "AA/YY"}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* CARD BACK FACE */}
                    <div className="absolute inset-0 w-full h-full rounded-2xl flex flex-col justify-between backface-hidden rotate-y-180"
                      style={{
                        backgroundImage: "linear-gradient(135deg, #0f172a 0%, #020617 100%)",
                        border: "1px solid rgba(255, 255, 255, 0.1)"
                      }}
                    >
                      <div className="w-full h-10 bg-slate-950 mt-6" />
                      <div className="px-6 flex flex-col gap-2">
                        <p className="text-[7px] text-slate-400 font-bold uppercase tracking-widest text-right">GÜVENLİK KODU</p>
                        <div className="flex items-center justify-between">
                          <div className="w-44 h-8 bg-slate-800 rounded flex items-center justify-end px-3 font-mono text-sm line-through decoration-slate-400 text-slate-500">
                            xxxx xxxx xxxx
                          </div>
                          <div className="w-12 h-8 bg-white text-slate-900 font-bold rounded flex items-center justify-center font-mono text-xs shadow-inner">
                            {cardDetails.cvv || "•••"}
                          </div>
                        </div>
                      </div>
                      <div className="p-4 flex items-center justify-between text-[7px] text-slate-500">
                        <span>PayTR Sandbox Mode</span>
                        <span>🔒 256-Bit SSL Secured</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Form Inputs */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Kart Numarası</label>
                    <div className="relative">
                      <input 
                        type="text" 
                        required
                        placeholder="0000 0000 0000 0000"
                        value={cardDetails.number}
                        onChange={handleCardNumberChange}
                        onFocus={() => setIsCardFlipped(false)}
                        className="w-full bg-[#020617] border border-white/10 rounded-xl py-3.5 px-4 text-xs font-medium text-white outline-none focus:border-blue-500 transition-all font-mono tracking-wider"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Kart Sahibi</label>
                    <input 
                      type="text" 
                      required
                      placeholder="Ad Soyad"
                      value={cardDetails.name}
                      onChange={e => setCardDetails(prev => ({ ...prev, name: e.target.value }))}
                      onFocus={() => setIsCardFlipped(false)}
                      className="w-full bg-[#020617] border border-white/10 rounded-xl py-3.5 px-4 text-xs font-medium text-white outline-none focus:border-blue-500 transition-all"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Son Kullanma (AA/YY)</label>
                    <input 
                      type="text" 
                      required
                      placeholder="AA/YY"
                      value={cardDetails.expiry}
                      onChange={handleExpiryChange}
                      onFocus={() => setIsCardFlipped(false)}
                      className="w-full bg-[#020617] border border-white/10 rounded-xl py-3.5 px-4 text-xs font-medium text-white outline-none focus:border-blue-500 transition-all font-mono"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">CVC / CVV</label>
                    <input 
                      type="password" 
                      required
                      placeholder="•••"
                      value={cardDetails.cvv}
                      onChange={handleCvvChange}
                      onFocus={() => setIsCardFlipped(true)}
                      onBlur={() => setIsCardFlipped(false)}
                      className="w-full bg-[#020617] border border-white/10 rounded-xl py-3.5 px-4 text-xs font-medium text-white outline-none focus:border-blue-500 transition-all font-mono"
                    />
                  </div>
                </div>

                <div className="p-4 bg-blue-600/5 border border-blue-500/10 rounded-xl flex gap-3 text-xs text-blue-300">
                  <Info size={16} className="shrink-0 mt-0.5" />
                  <div>
                    <h5 className="font-bold">PayTR Test Ortamı Simülasyonu</h5>
                    <p className="text-[11px] text-slate-400 mt-1">
                      Sistem PayTR entegrasyonu hazırlığı kapsamında mock moddadır. Kart bilgileriniz kaydedilmez, test etmek için rastgele değerler girebilirsiniz.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* 3. ORDER ITEMS REVIEW */}
            <div className="bg-[#0b1220] border border-white/10 rounded-2xl p-6 space-y-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <ShoppingBag size={18} className="text-blue-400" />
                Siparişinizi Kontrol Edin
              </h3>

              <div className="divide-y divide-white/5 max-h-72 overflow-y-auto pr-2">
                {cartItems.map(item => (
                  <div key={item.id} className="py-3.5 flex items-center gap-4">
                    <div className="w-12 h-12 bg-[#020617] border border-white/5 rounded-lg p-1.5 flex items-center justify-center shrink-0">
                      <img src={item.product.image || "/placeholder.png"} alt={item.product.name} className="max-h-full max-w-full object-contain" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-white truncate">{item.product.name}</h4>
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-0.5">{item.product.category}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-xs font-black text-white">₺{item.product.price.toLocaleString("tr-TR")}</p>
                      <p className="text-[10px] text-slate-500 mt-0.5">Adet: {item.quantity}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN - SUMMARY */}
          <div className="space-y-6 lg:sticky lg:top-8">
            <div className="bg-[#0b1220] border border-white/10 rounded-xl p-6 space-y-6">
              <h4 className="text-base font-bold text-white border-b border-white/5 pb-3">Sipariş Özeti</h4>
              
              <div className="space-y-4 text-xs font-medium">
                <div className="flex justify-between items-center text-slate-400">
                  <span>Toplam Ürün ({totalItems})</span>
                  <span className="text-white font-bold">₺{subtotal.toLocaleString("tr-TR")}</span>
                </div>
                {coupon && (
                  <div className="flex justify-between items-center text-green-400">
                    <span>Kupon İndirimi ({coupon.code})</span>
                    <span className="font-bold">-₺{discountAmount.toLocaleString("tr-TR")}</span>
                  </div>
                )}
                <div className="flex justify-between items-center text-slate-400">
                  <span>Kargo Ücreti</span>
                  <span className={`font-bold ${shipping === 0 ? "text-green-400" : "text-white"}`}>
                    {shipping === 0 ? "Ücretsiz" : `₺${shipping}`}
                  </span>
                </div>

                <div className="pt-4 border-t border-white/5 flex justify-between items-end">
                  <div>
                    <span className="text-xs text-slate-400">Ödenecek Tutar</span>
                    <div className="text-2xl font-bold text-red-500 mt-0.5">₺{total.toLocaleString("tr-TR")}</div>
                  </div>
                  <p className="text-[9px] text-slate-500 font-bold tracking-widest pb-1 uppercase">KDV DAHİL</p>
                </div>
              </div>

              {/* Complete Payment Button */}
              <button 
                onClick={handleCompleteOrder}
                disabled={submittingOrder}
                className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold py-4 rounded-full flex items-center justify-center gap-2 transition active:scale-98 group cursor-pointer text-sm uppercase tracking-wider shadow-lg shadow-blue-500/20"
              >
                {submittingOrder ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    SİPARİŞ İŞLENİYOR...
                  </>
                ) : (
                  <>
                    <CardIcon size={18} />
                    SİPARİŞİ TAMAMLA
                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-2 text-slate-500 text-xs">
                <ShieldCheck size={16} className="text-slate-400" />
                <span>256-Bit SSL Güvenli Altyapı</span>
              </div>
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
