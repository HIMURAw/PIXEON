"use client";

import React, { useState, useEffect } from "react";
import { 
    History, 
    Search, 
    User, 
    Activity, 
    Clock, 
    ArrowLeft,
    Loader2
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { getAdminLogs } from "@/lib/actions/admin-actions";

interface AdminLog {
    id: string;
    adminId: string;
    adminName: string;
    action: string;
    details: string;
    ipAddress?: string | null;
    createdAt: string | Date;
}

export default function SecurityLogs() {
    const [logs, setLogs] = useState<AdminLog[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    const fetchLogs = async () => {
        setIsLoading(true);
        const data = await getAdminLogs();
        setLogs(data);
        setIsLoading(false);
    };

    useEffect(() => {
        let active = true;
        async function init() {
            const data = await getAdminLogs();
            if (active) {
                setLogs(data);
                setIsLoading(false);
            }
        }
        init();
        return () => {
            active = false;
        };
    }, []);

    const filteredLogs = logs.filter(log => 
        log.adminName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (log.ipAddress && log.ipAddress.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <Link 
                            href="/admin/settings/admins" 
                            className="p-2 hover:bg-white/5 rounded-lg text-slate-500 hover:text-white transition-all flex items-center gap-2 text-xs font-bold uppercase tracking-widest"
                        >
                            <ArrowLeft size={16} />
                            Yönetİcİlere Dön
                        </Link>
                    </div>
                    <h1 className="text-3xl font-extrabold text-white tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
                        Güvenlik Günlüğü
                    </h1>
                    <p className="text-slate-500 mt-1 flex items-center gap-2">
                        <History className="text-blue-400" size={14} />
                        Sistemdeki tüm yönetici eylemlerini kronolojik olarak takip edin.
                    </p>
                </div>

                <div className="flex items-center gap-4">
                    <div className="relative w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                        <input
                            type="text"
                            placeholder="Eylem veya isim ara..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-slate-900/50 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white outline-none focus:border-blue-500/50 transition-all"
                        />
                    </div>
                    <button 
                        onClick={fetchLogs}
                        className="p-2.5 bg-slate-900 border border-white/10 rounded-xl text-slate-400 hover:text-white transition-all"
                    >
                        <Activity size={20} />
                    </button>
                </div>
            </div>

            {/* Logs Table Card */}
            <div className="bg-[#020617] border border-white/10 rounded-[40px] overflow-hidden shadow-2xl relative">
                <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/5 blur-[120px] rounded-full -mr-48 -mt-48 pointer-events-none"></div>
                
                <div className="overflow-x-auto relative z-10">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-white/5">
                                <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">ZAMAN</th>
                                <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">YÖNETİCİ</th>
                                <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">IP ADRESİ</th>
                                <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">EYLEM</th>
                                <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">DETAYLAR</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={5} className="px-8 py-20 text-center">
                                        <div className="flex flex-col items-center gap-4 text-slate-500">
                                            <Loader2 className="animate-spin text-blue-500" size={32} />
                                            <p className="text-xs font-bold uppercase tracking-widest">Günlükler Yükleniyor...</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : filteredLogs.length > 0 ? (
                                filteredLogs.map((log) => (
                                    <tr key={log.id} className="group hover:bg-white/[0.02] transition-colors">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-3">
                                                <Clock size={14} className="text-slate-600" />
                                                <span className="text-xs font-medium text-slate-400">
                                                    {new Date(log.createdAt).toLocaleString('tr-TR')}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-blue-600/10 flex items-center justify-center text-blue-400">
                                                    <User size={16} />
                                                </div>
                                                <span className="text-sm font-black text-white">{log.adminName}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 text-xs text-slate-400 font-mono">
                                            {log.ipAddress || "-"}
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className={cn(
                                                "text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full",
                                                log.action.includes("Eklendi") ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" :
                                                log.action.includes("Güncellendi") ? "bg-blue-500/10 text-blue-400 border border-blue-500/20" :
                                                "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                                            )}>
                                                {log.action}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6">
                                            <p className="text-sm text-slate-400 max-w-md truncate group-hover:whitespace-normal group-hover:overflow-visible transition-all">
                                                {log.details}
                                            </p>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="px-8 py-20 text-center text-slate-600 italic text-sm">
                                        Eşleşen kayıt bulunamadı.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Footer Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-[#020617] border border-white/5 rounded-3xl p-6 flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-600/10 rounded-2xl flex items-center justify-center text-blue-400">
                        <Activity size={24} />
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">TOPLAM KAYIT</p>
                        <p className="text-xl font-black text-white">{logs.length}</p>
                    </div>
                </div>
                {/* Add more stats if needed */}
            </div>
        </div>
    );
}
