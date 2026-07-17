"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { User } from "lucide-react";

export default function UserMenu({ mobile }: { mobile?: boolean }) {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/api/auth/me")
            .then((res) => res.json())
            .then((data) => {
                if (data.success) {
                    setUser(data.user);
                }
            })
            .catch(() => {})
            .finally(() => setLoading(false));
    }, []);

    if (mobile) {
        return (
            <Link href="/hesabim" aria-label="Hesabım" className="hover:text-sky-400 transition-colors">
                {user?.image ? (
                    <div className="w-8 h-8 rounded-full overflow-hidden border border-slate-700 relative">
                        <Image src={user.image} alt={user.name || "User"} fill className="object-cover" />
                    </div>
                ) : (
                    <User size={20} />
                )}
            </Link>
        );
    }

    return (
        <Link href="/hesabim" className="flex items-center gap-2 group">
            <div className="bg-slate-900 w-10 h-10 flex items-center justify-center border border-slate-700 rounded-full group-hover:border-sky-500/50 group-hover:bg-slate-800 transition-all overflow-hidden relative">
                {user?.image ? (
                    <Image src={user.image} alt={user.name || "User"} fill className="object-cover" />
                ) : (
                    <User color="#E5E7EB" size={16} />
                )}
            </div>
            <span className="font-medium text-slate-200 group-hover:text-sky-400 transition-colors">
                Hesabım
            </span>
        </Link>
    );
}
