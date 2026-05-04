"use client";

import { useState } from "react";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { toggleReviewLike } from "@/lib/actions/review-actions";

interface ReviewLikeButtonProps {
    reviewId: string;
    initialLikes: number;
    initialLiked: boolean;
    userId: string | null;
}

export default function ReviewLikeButton({
    reviewId,
    initialLikes,
    initialLiked,
    userId,
}: ReviewLikeButtonProps) {
    const [likes, setLikes] = useState(initialLikes);
    const [liked, setLiked] = useState(initialLiked);
    const [loading, setLoading] = useState(false);

    const handleToggle = async () => {
        if (!userId) return; // Not logged in, do nothing
        if (loading) return;

        // Optimistic update
        setLiked(prev => !prev);
        setLikes(prev => liked ? prev - 1 : prev + 1);

        setLoading(true);
        const result = await toggleReviewLike(reviewId, userId);
        setLoading(false);

        if (!result.success) {
            // Revert on error
            setLiked(prev => !prev);
            setLikes(prev => liked ? prev + 1 : prev - 1);
        }
    };

    return (
        <button
            onClick={handleToggle}
            disabled={!userId}
            title={!userId ? "Beğenmek için giriş yapın" : liked ? "Beğeniyi kaldır" : "Beğen"}
            className={cn(
                "flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all duration-200",
                userId ? "cursor-pointer" : "cursor-default opacity-50",
                liked
                    ? "bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20"
                    : "bg-white/5 border border-white/5 text-slate-500 hover:text-red-400 hover:bg-red-500/10 hover:border-red-500/20"
            )}
        >
            <Heart
                size={14}
                className={cn(
                    "transition-all duration-200",
                    liked ? "fill-red-400 scale-110" : ""
                )}
            />
            <span>{likes}</span>
        </button>
    );
}
