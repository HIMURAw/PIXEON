"use client";

import React, { createContext, useContext, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart } from "lucide-react";

interface CartAnimationContextType {
  animateAddToCart: (e: React.MouseEvent<HTMLButtonElement> | React.MouseEvent<HTMLDivElement> | any, callback: () => void) => void;
  isJiggling: boolean;
}

const CartAnimationContext = createContext<CartAnimationContextType | undefined>(undefined);

export const useCartAnimation = () => {
  const context = useContext(CartAnimationContext);
  if (!context) {
    throw new Error("useCartAnimation must be used within a CartAnimationProvider");
  }
  return context;
};

interface FlyingItem {
  id: number;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  callback: () => void;
}

export const CartAnimationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [flyingItems, setFlyingItems] = useState<FlyingItem[]>([]);
  const [isJiggling, setIsJiggling] = useState(false);

  const animateAddToCart = (e: React.MouseEvent<HTMLButtonElement> | any, callback: () => void) => {
    // 1. Get starting coordinates of the click event
    const startX = e.clientX || window.innerWidth / 2;
    const startY = e.clientY || window.innerHeight / 2;

    // 2. Find target cart icon coordinates
    const cartIconElement = document.getElementById("header-cart-icon") || document.getElementById("header-cart-icon-mobile");
    let endX = window.innerWidth - 60; // Fallback positioning
    let endY = 40;

    if (cartIconElement) {
      const rect = cartIconElement.getBoundingClientRect();
      endX = rect.left + rect.width / 2;
      endY = rect.top + rect.height / 2;
    }

    const newItem: FlyingItem = {
      id: Date.now() + Math.random(),
      startX,
      startY,
      endX,
      endY,
      callback,
    };

    setFlyingItems((prev) => [...prev, newItem]);
  };

  const handleAnimationComplete = (item: FlyingItem) => {
    // Run the actual state modification or action
    item.callback();

    // Trigger cart shake
    setIsJiggling(true);
    setTimeout(() => setIsJiggling(false), 600);

    // Remove particle
    setFlyingItems((prev) => prev.filter((i) => i.id !== item.id));
  };

  return (
    <CartAnimationContext.Provider value={{ animateAddToCart, isJiggling }}>
      {children}
      <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden">
        <AnimatePresence>
          {flyingItems.map((item) => {
            const peakY = Math.max(10, Math.min(item.startY, item.endY) - 100);

            return (
              <motion.div
                key={item.id}
                initial={{
                  x: item.startX - 16,
                  y: item.startY - 16,
                  scale: 0.6,
                  opacity: 0,
                }}
                animate={{
                  x: item.endX - 16,
                  y: [item.startY - 16, peakY, item.endY - 16],
                  scale: [0.6, 1.2, 1.2, 0.3],
                  opacity: [0, 1, 1, 0.4],
                }}
                exit={{ opacity: 0 }}
                transition={{
                  duration: 0.85,
                  ease: "easeInOut",
                  y: {
                    duration: 0.85,
                    times: [0, 0.4, 1],
                    ease: ["easeOut", "easeIn"],
                  },
                }}
                onAnimationComplete={() => handleAnimationComplete(item)}
                className="absolute w-8 h-8 rounded-full bg-blue-600 border border-blue-400 text-white flex items-center justify-center shadow-[0_0_15px_rgba(37,99,235,0.6)]"
              >
                <ShoppingCart size={14} className="fill-white/10" />
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </CartAnimationContext.Provider>
  );
};
