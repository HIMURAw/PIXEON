"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { 
  getCartItems, 
  addToCartDb, 
  updateCartQuantityDb, 
  removeFromCartDb, 
  clearCartDb, 
  syncCartDb 
} from "@/lib/actions/cart-actions";

export interface CartItem {
  id: string;
  productId: string;
  quantity: number;
  product: {
    id: string;
    name: string;
    slug: string;
    price: number;
    oldPrice?: number | null;
    image?: string | null;
    category?: string | null;
    stock: number;
  };
}

interface CartContextType {
  cartItems: CartItem[];
  loading: boolean;
  addToCart: (product: any, quantity?: number) => Promise<boolean>;
  removeFromCart: (productId: string) => Promise<boolean>;
  updateQuantity: (productId: string, quantity: number) => Promise<boolean>;
  clearCart: () => Promise<boolean>;
  totalItems: number;
  subtotal: number;
  shipping: number;
  total: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // 1. Fetch user session and load/sync cart
  useEffect(() => {
    async function initCart() {
      try {
        const res = await fetch("/api/auth/me");
        const data = await res.json();
        
        if (data.success && data.user) {
          const loggedUser = data.user;
          setUser(loggedUser);

          // Get guest items from localStorage
          const localData = localStorage.getItem("tuger_guest_cart");
          const guestItems = localData ? JSON.parse(localData) : [];

          if (guestItems.length > 0) {
            // Sync guest cart items with DB
            const itemsToSync = guestItems.map((item: any) => ({
              productId: item.productId,
              quantity: item.quantity
            }));
            await syncCartDb(loggedUser.id, itemsToSync);
            
            // Clean guest cart
            localStorage.removeItem("tuger_guest_cart");
          }

          // Fetch fresh DB cart
          const dbCart = await getCartItems(loggedUser.id);
          setCartItems(dbCart);
        } else {
          // Guest mode: load from localStorage
          const localData = localStorage.getItem("tuger_guest_cart");
          if (localData) {
            setCartItems(JSON.parse(localData));
          }
        }
      } catch (err) {
        console.error("Cart initialization error:", err);
      } finally {
        setLoading(false);
      }
    }

    initCart();
  }, []);

  // Save guest cart to localStorage when state changes (only if guest)
  useEffect(() => {
    if (!loading && !user) {
      localStorage.setItem("tuger_guest_cart", JSON.stringify(cartItems));
    }
  }, [cartItems, user, loading]);

  // Helper to fetch DB items and update local state
  const refreshDbCart = async (userId: string) => {
    const dbCart = await getCartItems(userId);
    setCartItems(dbCart);
  };

  // Add to cart
  const addToCart = async (product: any, quantity: number = 1) => {
    if (quantity <= 0) return false;

    // Check stock if available in product object
    if (product.stock !== undefined && product.stock <= 0) {
      toast.error("Bu ürün tükenmiştir.");
      return false;
    }

    try {
      if (user) {
        setLoading(true);
        const res = await addToCartDb(user.id, product.id, quantity);
        if (res.success) {
          await refreshDbCart(user.id);
          toast.success("Ürün sepete eklendi!");
          return true;
        } else {
          toast.error(res.error || "Ürün sepete eklenemedi.");
          return false;
        }
      } else {
        // Guest implementation
        setCartItems(prev => {
          const existingIndex = prev.findIndex(item => item.productId === product.id);
          if (existingIndex > -1) {
            const updated = [...prev];
            updated[existingIndex].quantity += quantity;
            return updated;
          } else {
            return [
              ...prev,
              {
                id: `guest_${product.id}`,
                productId: product.id,
                quantity: quantity,
                product: {
                  id: product.id,
                  name: product.name,
                  slug: product.slug,
                  price: product.price,
                  oldPrice: product.oldPrice,
                  image: product.image,
                  category: product.category?.name || product.category || "Ürün",
                  stock: product.stock ?? 999
                }
              }
            ];
          }
        });
        toast.success("Ürün sepete eklendi!");
        return true;
      }
    } catch (error) {
      console.error("addToCart error:", error);
      toast.error("Bir sorun oluştu.");
      return false;
    } finally {
      if (user) setLoading(false);
    }
  };

  // Remove from cart
  const removeFromCart = async (productId: string) => {
    try {
      if (user) {
        setLoading(true);
        const res = await removeFromCartDb(user.id, productId);
        if (res.success) {
          await refreshDbCart(user.id);
          toast.success("Ürün sepetten kaldırıldı.");
          return true;
        } else {
          toast.error(res.error || "Ürün sepetten silinemedi.");
          return false;
        }
      } else {
        setCartItems(prev => prev.filter(item => item.productId !== productId));
        toast.success("Ürün sepetten kaldırıldı.");
        return true;
      }
    } catch (error) {
      console.error("removeFromCart error:", error);
      toast.error("Bir sorun oluştu.");
      return false;
    } finally {
      if (user) setLoading(false);
    }
  };

  // Update quantity
  const updateQuantity = async (productId: string, quantity: number) => {
    if (quantity <= 0) {
      return await removeFromCart(productId);
    }

    try {
      if (user) {
        setLoading(true);
        const res = await updateCartQuantityDb(user.id, productId, quantity);
        if (res.success) {
          await refreshDbCart(user.id);
          return true;
        } else {
          toast.error(res.error || "Miktar güncellenemedi.");
          return false;
        }
      } else {
        setCartItems(prev => prev.map(item => 
          item.productId === productId ? { ...item, quantity } : item
        ));
        return true;
      }
    } catch (error) {
      console.error("updateQuantity error:", error);
      return false;
    } finally {
      if (user) setLoading(false);
    }
  };

  // Clear cart
  const clearCart = async () => {
    try {
      if (user) {
        setLoading(true);
        const res = await clearCartDb(user.id);
        if (res.success) {
          await refreshDbCart(user.id);
          return true;
        } else {
          toast.error(res.error || "Sepet temizlenemedi.");
          return false;
        }
      } else {
        setCartItems([]);
        return true;
      }
    } catch (error) {
      console.error("clearCart error:", error);
      return false;
    } finally {
      if (user) setLoading(false);
    }
  };

  // Derived states
  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = cartItems.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
  const shipping = subtotal === 0 ? 0 : subtotal > 5000 ? 0 : 99;
  const total = subtotal + shipping;

  return (
    <CartContext.Provider value={{
      cartItems,
      loading,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      totalItems,
      subtotal,
      shipping,
      total
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
