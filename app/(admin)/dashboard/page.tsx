"use client";

import React from "react";
import { 
    TrendingUp, 
    ShoppingCart, 
    Users, 
    CreditCard,
    ArrowUpRight,
    ArrowDownRight,
    MoreHorizontal
} from "lucide-react";

export default function AdminDashboard() {
    return (
        <div className="space-y-8 animate-in">
            {/* Page Title */}
            <div>
                <h1 className="text-3xl font-bold text-white tracking-tight">Dashboard</h1>
                <p className="text-slate-500 mt-1">Sitenizin genel performansına genel bakış.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: "Toplam Gelir", value: "₺242.000", change: "+12.5%", icon: CreditCard, color: "text-blue-400" },
                    { label: "Siparişler", value: "1,240", change: "+8.2%", icon: ShoppingCart, color: "text-emerald-400" },
                    { label: "Yeni Müşteriler", value: "48", change: "-2.4%", icon: Users, color: "text-sky-400" },
                    { label: "Ort. Sipariş Değeri", value: "₺1.850", change: "+4.1%", icon: TrendingUp, color: "text-purple-400" },
                ].map((stat) => (
                    <div key={stat.label} className="bg-[#020617] border border-white/10 p-6 rounded-2xl hover:border-blue-500/30 transition-all group">
                        <div className="flex items-start justify-between">
                            <div className={stat.color}>
                                <stat.icon size={24} />
                            </div>
                            <div className={stat.change.startsWith("+") ? "text-emerald-400" : "text-red-400"}>
                                <span className="text-xs font-bold flex items-center gap-1">
                                    {stat.change} 
                                    {stat.change.startsWith("+") ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                                </span>
                            </div>
                        </div>
                        <div className="mt-4">
                            <h3 className="text-sm font-medium text-slate-500">{stat.label}</h3>
                            <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Bottom Section: Table & Chart Area */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Sales Table */}
                <div className="lg:col-span-2 bg-[#020617] border border-white/10 rounded-2xl overflow-hidden flex flex-col">
                    <div className="p-6 border-b border-white/5 flex items-center justify-between">
                        <h2 className="font-bold text-lg text-white">Son Siparişler</h2>
                        <button className="text-xs text-blue-400 font-bold hover:underline">Tümünü Gör</button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead>
                                <tr className="bg-white/[0.02] text-slate-500 font-bold uppercase tracking-wider">
                                    <th className="px-6 py-4">Müşteri</th>
                                    <th className="px-6 py-4">Ürün</th>
                                    <th className="px-6 py-4">Tutar</th>
                                    <th className="px-6 py-4">Durum</th>
                                    <th className="px-6 py-4 text-right"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {[
                                    { name: "John Doe", product: "PS5 Slim", amount: "₺18.999", status: "Tamamlandı" },
                                    { name: "Sarah Connor", product: "DualSense White", amount: "₺2.899", status: "Beklemede" },
                                    { name: "Mike Tyson", product: "Spiderman 2", amount: "₺1.499", status: "Tamamlandı" },
                                    { name: "Ellen Ripley", product: "Pulse 3D", amount: "₺3.499", status: "İptal Edildi" },
                                ].map((order, i) => (
                                    <tr key={i} className="hover:bg-white/[0.01] transition-colors">
                                        <td className="px-6 py-4 font-medium text-white">{order.name}</td>
                                        <td className="px-6 py-4 text-slate-400">{order.product}</td>
                                        <td className="px-6 py-4 font-bold text-white">{order.amount}</td>
                                        <td className="px-6 py-4">
                                            <span className={cn(
                                                "px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                                                order.status === "Tamamlandı" ? "bg-emerald-500/10 text-emerald-400" :
                                                order.status === "Beklemede" ? "bg-amber-500/10 text-amber-400" : "bg-red-500/10 text-red-400"
                                            )}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button className="p-2 hover:bg-white/5 rounded-lg text-slate-500">
                                                <MoreHorizontal size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Side Card: Best Selling Category */}
                <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-8 text-white relative overflow-hidden group">
                    <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-40 h-40 bg-white/20 blur-3xl rounded-full group-hover:bg-white/30 transition-all"></div>
                    <div className="relative z-10 space-y-6">
                        <h2 className="text-xl font-bold">Popüler Kategori</h2>
                        <div className="pt-4">
                            <div className="text-4xl font-black mb-1">Konsollar</div>
                            <p className="text-white/70 text-sm">Bu ay en çok ilgiyi PlayStation 5 Slim gördü.</p>
                        </div>
                        <div className="pt-6">
                            <div className="h-2 w-full bg-black/20 rounded-full overflow-hidden">
                                <div className="h-full w-[85%] bg-white rounded-full"></div>
                            </div>
                            <div className="flex justify-between mt-2 text-xs font-bold uppercase">
                                <span>Satış Oranı</span>
                                <span>85%</span>
                            </div>
                        </div>
                        <button className="w-full bg-white text-blue-600 font-bold py-3 rounded-xl hover:bg-slate-100 transition-all">
                            Detaylı Analiz
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
