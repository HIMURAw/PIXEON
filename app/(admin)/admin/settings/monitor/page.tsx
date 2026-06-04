"use client";

import React, { useState, useEffect } from "react";
import { 
    Activity, 
    Search, 
    RefreshCw, 
    Trash2, 
    Terminal, 
    ShieldAlert, 
    ArrowLeft,
    Clock,
    Globe,
    ToggleLeft,
    ToggleRight
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface RequestLog {
    id: string;
    timestamp: string;
    method: string;
    url: string;
    ip: string;
    userAgent: string;
}

export default function RequestMonitor() {
    const [logs, setLogs] = useState<RequestLog[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [isLive, setIsLive] = useState(true);

    const fetchLogs = async () => {
        try {
            const res = await fetch("/api/admin/monitor");
            const data = await res.json();
            if (data.success) {
                setLogs(data.logs);
            }
        } catch (error) {
            console.error("Error fetching request logs:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const clearLogs = async () => {
        if (!confirm("Tüm istek geçmişini temizlemek istediğinize emin misiniz?")) return;
        try {
            const res = await fetch("/api/admin/monitor", { method: "DELETE" });
            const data = await res.json();
            if (data.success) {
                setLogs([]);
            }
        } catch (error) {
            console.error("Error clearing request logs:", error);
        }
    };

    // Initial fetch
    useEffect(() => {
        fetchLogs();
    }, []);

    // Polling effect
    useEffect(() => {
        if (!isLive) return;
        const interval = setInterval(fetchLogs, 2000);
        return () => clearInterval(interval);
    }, [isLive]);

    const filteredLogs = logs.filter(log => 
        log.url.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.method.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.ip.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.userAgent.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Compute simple stats
    const totalRequests = logs.length;
    const uniqueIps = new Set(logs.map(l => l.ip)).size;
    const postRequests = logs.filter(l => l.method === "POST").length;
    const getRequests = logs.filter(l => l.method === "GET").length;

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <Link 
                            href="/admin/dashboard" 
                            className="p-2 hover:bg-white/5 rounded-lg text-slate-500 hover:text-white transition-all flex items-center gap-2 text-xs font-bold uppercase tracking-widest"
                        >
                            <ArrowLeft size={16} />
                            Dashboard'a Dön
                        </Link>
                    </div>
                    <h1 className="text-3xl font-extrabold text-white tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400 flex items-center gap-3">
                        <Activity className="text-blue-500 animate-pulse" size={32} />
                        Canlı İstek Monitörü
                    </h1>
                    <p className="text-slate-500 mt-1 flex items-center gap-2">
                        <Terminal className="text-blue-400" size={14} />
                        Sisteme gelen HTTP isteklerini gerçek zamanlı izleyin.
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-4">
                    {/* Live Toggle */}
                    <button 
                        onClick={() => setIsLive(!isLive)}
                        className={cn(
                            "flex items-center gap-2 px-4 py-2.5 rounded-xl border text-xs font-bold transition-all duration-300",
                            isLive 
                                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-lg shadow-emerald-500/5"
                                : "bg-slate-900 text-slate-400 border-white/10"
                        )}
                    >
                        {isLive ? <ToggleRight size={18} /> : <ToggleLeft size={18} />}
                        {isLive ? "CANLI AKIŞ: AÇIK" : "CANLI AKIŞ: KAPALI"}
                    </button>

                    <div className="relative w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                        <input
                            type="text"
                            placeholder="URL veya IP adresi ara..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-slate-900/50 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white outline-none focus:border-blue-500/50 transition-all"
                        />
                    </div>

                    <button 
                        onClick={fetchLogs}
                        className="p-2.5 bg-slate-900 border border-white/10 rounded-xl text-slate-400 hover:text-white transition-all"
                        title="Yenile"
                    >
                        <RefreshCw size={20} />
                    </button>

                    <button 
                        onClick={clearLogs}
                        className="p-2.5 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 hover:bg-red-500 hover:text-white transition-all"
                        title="Tümünü Temizle"
                    >
                        <Trash2 size={20} />
                    </button>
                </div>
            </div>

            {/* Quick Analytics Card */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-[#020617] border border-white/10 rounded-3xl p-6 flex items-center gap-4 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 blur-[50px] rounded-full pointer-events-none"></div>
                    <div className="w-12 h-12 bg-blue-600/10 rounded-2xl flex items-center justify-center text-blue-400">
                        <Activity size={24} />
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">TOPLAM İSTEK</p>
                        <p className="text-xl font-black text-white">{totalRequests}</p>
                    </div>
                </div>

                <div className="bg-[#020617] border border-white/10 rounded-3xl p-6 flex items-center gap-4 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 blur-[50px] rounded-full pointer-events-none"></div>
                    <div className="w-12 h-12 bg-emerald-600/10 rounded-2xl flex items-center justify-center text-emerald-400">
                        <Globe size={24} />
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">BENZERSİZ IP</p>
                        <p className="text-xl font-black text-white">{uniqueIps}</p>
                    </div>
                </div>

                <div className="bg-[#020617] border border-white/10 rounded-3xl p-6 flex items-center gap-4 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 blur-[50px] rounded-full pointer-events-none"></div>
                    <div className="w-12 h-12 bg-cyan-600/10 rounded-2xl flex items-center justify-center text-cyan-400">
                        <Terminal size={24} />
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">GET İSTEKLERİ</p>
                        <p className="text-xl font-black text-white">{getRequests}</p>
                    </div>
                </div>

                <div className="bg-[#020617] border border-white/10 rounded-3xl p-6 flex items-center gap-4 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 blur-[50px] rounded-full pointer-events-none"></div>
                    <div className="w-12 h-12 bg-amber-600/10 rounded-2xl flex items-center justify-center text-amber-400">
                        <ShieldAlert size={24} />
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">POST İSTEKLERİ</p>
                        <p className="text-xl font-black text-white">{postRequests}</p>
                    </div>
                </div>
            </div>

            {/* Logs Table Card */}
            <div className="bg-[#020617] border border-white/10 rounded-[40px] overflow-hidden shadow-2xl relative">
                <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/5 blur-[120px] rounded-full -mr-48 -mt-48 pointer-events-none"></div>
                
                <div className="overflow-x-auto relative z-10">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-white/5">
                                <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] w-32">METOD</th>
                                <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] w-48">ZAMAN</th>
                                <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] w-44">IP ADRESİ</th>
                                <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">URL ADRESİ</th>
                                <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] w-72">TARAYICI / USER AGENT</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={5} className="px-8 py-20 text-center">
                                        <div className="flex flex-col items-center gap-4 text-slate-500">
                                            <RefreshCw className="animate-spin text-blue-500" size={32} />
                                            <p className="text-xs font-bold uppercase tracking-widest">İstek Monitörü Yükleniyor...</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : filteredLogs.length > 0 ? (
                                filteredLogs.map((log) => (
                                    <tr key={log.id} className="group hover:bg-white/[0.02] transition-colors">
                                        <td className="px-8 py-6">
                                            <span className={cn(
                                                "text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md border",
                                                log.method === "GET" ? "bg-blue-500/10 text-blue-400 border-blue-500/20" :
                                                log.method === "POST" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" :
                                                log.method === "DELETE" ? "bg-red-500/10 text-red-400 border-red-500/20" :
                                                "bg-amber-500/10 text-amber-400 border-amber-500/20"
                                            )}>
                                                {log.method}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-3">
                                                <Clock size={14} className="text-slate-600" />
                                                <span className="text-xs font-medium text-slate-400">
                                                    {new Date(log.timestamp).toLocaleTimeString('tr-TR')}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 text-xs text-slate-400 font-mono">
                                            {log.ip}
                                        </td>
                                        <td className="px-8 py-6">
                                            <p className="text-sm font-semibold text-white max-w-lg truncate" title={log.url}>
                                                {log.url}
                                            </p>
                                        </td>
                                        <td className="px-8 py-6">
                                            <p className="text-xs text-slate-500 truncate max-w-[280px]" title={log.userAgent}>
                                                {log.userAgent}
                                            </p>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="px-8 py-20 text-center text-slate-600 italic text-sm">
                                        Eşleşen aktif istek bulunamadı.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
