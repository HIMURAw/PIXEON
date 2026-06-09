"use client";

import React from "react";
import TopBar from "@/components/header/TopBar";
import MainBar from "@/components/header/MainBar";
import Head from "@/components/header/Head";
import Footer from "@/components/footer/Footer";
import { 
    Trash2, 
    Plus, 
    Minus, 
    ChevronLeft, 
    CreditCard, 
    ShieldCheck, 
    Truck,
    ShoppingBag,
    ArrowRight,
    Zap,
    Ticket,
    Loader2
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useCart } from "@/context/CartContext";
import { getDatabaseProductCount } from "@/lib/actions/product-actions";
import toast from "react-hot-toast";
import CartShareButton from "@/components/cart/CartShareButton";
import CartImportModal from "@/components/cart/CartImportModal";
import { Suspense } from "react";

export default function CartPage() {
    const { 
        cartItems, 
        loading, 
        updateQuantity, 
        removeFromCart, 
        subtotal, 
        shipping, 
        total,
        totalItems,
        coupon,
        discountAmount,
        applyCoupon,
        removeCoupon
    } = useCart();

    const [dbProductCount, setDbProductCount] = React.useState<number>(0);
    const [couponInput, setCouponInput] = React.useState("");
    const [applyingCoupon, setApplyingCoupon] = React.useState(false);

    const handleApplyCoupon = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!couponInput.trim()) return;
        setApplyingCoupon(true);
        try {
            const res = await applyCoupon(couponInput);
            if (res.success) {
                toast.success("Kupon başarıyla uygulandı!");
                setCouponInput("");
            } else {
                toast.error(res.error || "Kupon uygulanamadı.");
            }
        } catch (error) {
            toast.error("Kupon doğrulanırken bir hata oluştu.");
        } finally {
            setApplyingCoupon(false);
        }
    };

    React.useEffect(() => {
        async function fetchCount() {
            try {
                const count = await getDatabaseProductCount();
                setDbProductCount(count);
            } catch (error) {
                console.error("Error loading product count:", error);
            }
        }
        fetchCount();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#020617] text-slate-200">
                <TopBar />
                <MainBar />
                <Head />
                <main className="w-full px-4 sm:px-6 lg:px-8 py-20 flex flex-col items-center justify-center min-h-[400px]">
                    <Loader2 size={40} className="animate-spin text-blue-500 mb-4" />
                    <p className="text-slate-400 font-bold uppercase tracking-wider text-xs">Sepetiniz Yükleniyor...</p>
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
                {/* Cart Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-b border-white/5 pb-6">
                    <div className="flex items-center gap-4">
                        <Link href="/" className="group p-2 bg-[#0b1220] border border-white/10 rounded-full text-slate-400 hover:text-white transition-all hover:bg-blue-400/10">
                            <ChevronLeft size={20} className="group-hover:-translate-x-0.5 transition-transform" />
                        </Link>
                        <div>
                            <h1 className="text-xl font-semibold text-white">Alışveriş Sepeti</h1>
                            <p className="text-sm text-gray-400 mt-0.5 flex flex-wrap items-center gap-2">
                                <span>Sepetinizde <span className="text-white font-bold">{totalItems}</span> ürün bulunuyor.</span>
                                <span className="text-slate-600">|</span>
                                <span className="text-slate-400 font-medium">TOPLAM <span className="text-sky-400 font-bold">{dbProductCount}</span> ÜRÜN</span>
                            </p>
                        </div>
                    </div>
                    <CartShareButton cartItems={cartItems} />
                </div>

                {cartItems.length > 0 ? (
                    <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8 items-start">
                        
                        {/* LEFT: Items List */}
                        <div className="space-y-4">
                            {cartItems.map((item) => (
                                <div key={item.id} className="bg-[#0b1220] border border-white/10 rounded-xl p-5 hover:shadow-lg transition flex flex-col sm:flex-row items-center gap-6 relative group">
                                    {/* Image */}
                                    <div className="w-24 h-24 bg-[#020617] rounded-lg border border-white/5 flex items-center justify-center p-3 shrink-0">
                                        <img src={item.product.image || "/placeholder.png"} alt={item.product.name} className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300" />
                                    </div>

                                    {/* Details */}
                                    <div className="flex-1 text-center sm:text-left space-y-1">
                                        <span className="text-[10px] text-blue-400 font-semibold uppercase tracking-wider block">
                                            {item.product.category || "Ürün"}
                                        </span>
                                        <Link href={`/product/${item.product.slug}`} className="block">
                                            <h3 className="text-sm font-bold text-white leading-snug hover:text-blue-400 transition-colors">
                                                {item.product.name}
                                            </h3>
                                        </Link>
                                        <span className="text-xs text-green-400 font-medium block">Stokta Var</span>
                                        <div className="text-lg font-bold text-red-500 pt-1">
                                            ₺{item.product.price.toLocaleString("tr-TR")}
                                        </div>
                                    </div>

                                    {/* Controls */}
                                    <div className="flex flex-col sm:items-end gap-4 shrink-0 w-full sm:w-auto">
                                        <div className="flex items-center justify-center bg-[#020617] border border-white/10 rounded-full p-1 w-fit mx-auto sm:mx-0">
                                            <button 
                                                onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                                                className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-white rounded-full hover:bg-white/5 transition disabled:opacity-20 cursor-pointer"
                                                disabled={item.quantity <= 1}
                                            >
                                                <Minus size={16} />
                                            </button>
                                            <span className="w-8 text-center font-bold text-sm text-white">{item.quantity}</span>
                                            <button 
                                                onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                                                className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-white rounded-full hover:bg-white/5 transition cursor-pointer"
                                            >
                                                <Plus size={16} />
                                            </button>
                                        </div>

                                        <button 
                                            onClick={() => removeFromCart(item.productId)}
                                            className="flex items-center justify-center gap-1.5 px-3 py-1.5 text-red-400 hover:text-white hover:bg-red-500/20 border border-red-500/20 rounded-full transition-all text-xs font-semibold cursor-pointer w-fit mx-auto sm:mx-0"
                                        >
                                            <Trash2 size={14} />
                                            Kaldır
                                        </button>
                                    </div>
                                </div>
                            ))}

                            {/* Cart Features */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6">
                                {[
                                    { icon: Zap, title: "Anında Onay", desc: "Siparişin saniyeler içinde işleme alınır." },
                                    { icon: ShieldCheck, title: "Resmi Garanti", desc: "Tüm ürünler 2 yıl Sony Türkiye garantilidir." },
                                    { icon: Truck, title: "Hızlı Kargo", desc: "Bugün saat 16:00'ya kadar aynı gün kargo." },
                                ].map((feat, i) => (
                                    <div key={i} className="p-4 bg-[#0b1220] border border-white/10 rounded-xl flex items-center gap-4">
                                        <div className="p-2.5 bg-blue-600/10 text-blue-400 rounded-lg"><feat.icon size={18} /></div>
                                        <div>
                                            <h4 className="text-xs font-bold text-white">{feat.title}</h4>
                                            <p className="text-[10px] text-slate-400 mt-0.5">{feat.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* RIGHT: Order Summary */}
                        <div className="space-y-6">
                            <div className="bg-[#0b1220] border border-white/10 rounded-xl p-6 hover:shadow-lg transition sticky top-8">
                                <h2 className="text-base font-bold text-white mb-6">Sipariş Özeti</h2>
                                
                                <div className="space-y-4 mb-6 text-sm">
                                    <div className="flex justify-between items-center text-slate-400">
                                        <span>Ara Toplam</span>
                                        <span className="text-white font-bold">₺{subtotal.toLocaleString("tr-TR")}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-slate-400">
                                        <span>Kargo Bedeli</span>
                                        <span className={cn("font-bold", shipping === 0 ? "text-green-400" : "text-white")}>
                                            {shipping === 0 ? "Ücretsiz" : `₺${shipping}`}
                                        </span>
                                    </div>
                                    
                                    {/* Coupon Input */}
                                    <div className="pt-2">
                                        {coupon ? (
                                            <div className="flex items-center justify-between bg-green-500/10 border border-green-500/20 rounded-xl p-3.5 text-xs">
                                                <div className="flex items-center gap-2 text-green-400 font-bold">
                                                    <Ticket size={14} />
                                                    <span>{coupon.code} Uygulandı</span>
                                                </div>
                                                <button 
                                                    onClick={removeCoupon}
                                                    className="text-red-400 hover:text-red-300 font-bold cursor-pointer text-[10px] uppercase bg-red-500/10 hover:bg-red-500/20 px-2.5 py-1 rounded-full border border-red-500/10 transition-all"
                                                >
                                                    Kaldır
                                                </button>
                                            </div>
                                        ) : (
                                            <form onSubmit={handleApplyCoupon} className="relative group">
                                                <Ticket size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
                                                <input 
                                                    type="text" 
                                                    placeholder="İndirim Kuponu" 
                                                    value={couponInput}
                                                    onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                                                    className="w-full bg-[#020617] border border-white/10 rounded-full py-2.5 pl-10 pr-20 text-xs font-medium outline-none focus:border-blue-400 transition-all placeholder:text-slate-600 text-white"
                                                />
                                                <button 
                                                    type="submit"
                                                    disabled={applyingCoupon || !couponInput.trim()}
                                                    className="absolute right-1.5 top-1/2 -translate-y-1/2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-[10px] font-bold px-3 py-1.5 rounded-full transition cursor-pointer"
                                                >
                                                    {applyingCoupon ? "..." : "Uygula"}
                                                </button>
                                            </form>
                                        )}
                                    </div>

                                    {/* Coupon Discount Row */}
                                    {coupon && (
                                        <div className="flex justify-between items-center text-green-400">
                                            <span>Kupon İndirimi ({coupon.code})</span>
                                            <span className="font-bold">-₺{discountAmount.toLocaleString("tr-TR")}</span>
                                        </div>
                                    )}

                                    <div className="pt-4 border-t border-white/5 flex justify-between items-end">
                                        <div>
                                            <span className="text-xs text-slate-400">Ödenecek Tutar</span>
                                            <div className="text-2xl font-bold text-red-500 mt-0.5">₺{total.toLocaleString("tr-TR")}</div>
                                        </div>
                                        <p className="text-[10px] text-slate-500 font-semibold tracking-wider pb-1 uppercase">KDV DAHİL</p>
                                    </div>
                                </div>

                                <Link 
                                    href="/odeme"
                                    className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3.5 rounded-full flex items-center justify-center gap-2 transition active:scale-98 group cursor-pointer text-sm uppercase"
                                >
                                    <CreditCard size={18} />
                                    Güvenle Öde
                                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                                </Link>

                                <div className="mt-6 flex items-center justify-center gap-2 text-slate-500 text-xs">
                                    <ShieldCheck size={16} className="text-slate-400" />
                                    <span>256-Bit SSL Güvenlik</span>
                                </div>
                            </div>
                        </div>

                    </div>
                ) : (
                    /* EMPTY STATE */
                    <div className="bg-[#0b1220] border border-white/10 rounded-xl p-16 text-center space-y-8 shadow-lg">
                        <div className="w-20 h-20 bg-[#020617] border border-white/10 rounded-full flex items-center justify-center mx-auto shadow-inner">
                            <ShoppingBag size={36} className="text-slate-500" />
                        </div>
                        <div className="space-y-2">
                            <h2 className="text-xl font-bold text-white">Sepetiniz Boş</h2>
                            <p className="text-slate-400 text-sm max-w-sm mx-auto">
                                En yeni maceralar ve güçlü donanımlar sizi bekliyor. Hemen keşfetmeye başlayın!
                            </p>
                        </div>
                        <div className="pt-2">
                            <Link href="/" className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold px-6 py-2.5 rounded-full transition text-sm group">
                                Alışverişe Başla
                                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </div>
                    </div>
                )}
            </main>

            <Suspense fallback={null}>
                <CartImportModal />
            </Suspense>
            <Footer />
        </div>
    );
}
