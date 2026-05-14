"use client";

import React, { useState, useTransition } from "react";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { toggleWishlist } from "@/lib/actions/wishlist-actions";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

interface WishlistButtonProps {
    productId: string;
    userId: string | null;
    initialIsFavorited: boolean;
    className?: string;
}

export default function WishlistButton({ 
    productId, 
    userId, 
    initialIsFavorited,
    className 
}: WishlistButtonProps) {
    const [isFavorited, setIsFavorited] = useState(initialIsFavorited);
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    const handleToggle = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (!userId) {
            toast.error("Favorilere eklemek için giriş yapmalısınız.");
            router.push("/login");
            return;
        }

        // Optimistic update
        setIsFavorited(!isFavorited);

        startTransition(async () => {
            const res = await toggleWishlist(userId, productId);
            if (res.success) {
                if (res.action === "added") {
                    toast.success("Favorilere eklendi!");
                } else {
                    toast.success("Favorilerden çıkarıldı.");
                }
            } else {
                // Revert on error
                setIsFavorited(isFavorited);
                toast.error(res.error || "Bir hata oluştu.");
            }
        });
    };

    return (
        <button
            onClick={handleToggle}
            disabled={isPending}
            className={cn(
                "w-full flex items-center justify-center gap-3 py-4 rounded-2xl transition-all border font-black text-sm uppercase italic tracking-tighter",
                isFavorited 
                    ? "bg-red-500/10 border-red-500/50 text-red-500 hover:bg-red-500/20" 
                    : "bg-white/5 border-white/10 text-white hover:bg-white/10",
                isPending && "opacity-50 cursor-wait",
                className
            )}
        >
            <Heart 
                size={20} 
                className={cn(
                    "transition-transform",
                    isFavorited ? "fill-red-500 scale-110" : "scale-100",
                    isPending && "animate-pulse"
                )} 
            />
            {isFavorited ? "FAVORİLERDE" : "FAVORİYE EKLE"}
        </button>
    );
}
