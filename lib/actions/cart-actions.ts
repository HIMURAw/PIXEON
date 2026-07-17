"use server";

import { db } from "@/lib/db";
import { cartItems, products, categories } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function getCartItems(userId: string) {
  try {
    const items = await db.select({
      id: cartItems.id,
      productId: cartItems.productId,
      quantity: cartItems.quantity,
      product: {
        id: products.id,
        name: products.name,
        slug: products.slug,
        price: products.price,
        oldPrice: products.oldPrice,
        image: products.image,
        category: categories.name,
        stock: products.stock
      }
    })
    .from(cartItems)
    .innerJoin(products, eq(cartItems.productId, products.id))
    .leftJoin(categories, eq(products.categoryId, categories.id))
    .where(eq(cartItems.userId, userId));

    return JSON.parse(JSON.stringify(items));
  } catch (error) {
    console.error("Error getting cart items:", error);
    return [];
  }
}

export async function addToCartDb(userId: string, productId: string, quantity: number) {
  try {
    // Check if product exists and check its stock
    const product = await db.query.products.findFirst({
      where: eq(products.id, productId)
    });

    if (!product) {
      return { success: false, error: "Ürün bulunamadı." };
    }

    if (product.status !== "ACTIVE") {
      return { success: false, error: "Bu ürün şu anda satışa kapalı." };
    }

    // Check if item already exists in the cart
    const existing = await db.select()
      .from(cartItems)
      .where(and(eq(cartItems.userId, userId), eq(cartItems.productId, productId)))
      .limit(1);

    const requestedQuantity = existing.length > 0 ? existing[0].quantity + quantity : quantity;
    if (requestedQuantity > product.stock) {
      return {
        success: false,
        error: product.stock > 0
          ? `Stokta sadece ${product.stock} adet var.`
          : "Bu ürün stokta yok.",
      };
    }

    if (existing.length > 0) {
      const newQuantity = existing[0].quantity + quantity;
      await db.update(cartItems)
        .set({ quantity: newQuantity, updatedAt: new Date() })
        .where(eq(cartItems.id, existing[0].id));
    } else {
      const id = `cart_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      await db.insert(cartItems).values({
        id,
        userId,
        productId,
        quantity,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }

    revalidatePath("/sepet");
    return { success: true };
  } catch (error) {
    console.error("Error adding to cart database:", error);
    return { success: false, error: "Veritabanına eklenirken hata oluştu." };
  }
}

export async function updateCartQuantityDb(userId: string, productId: string, quantity: number) {
  try {
    if (quantity <= 0) {
      return await removeFromCartDb(userId, productId);
    }

    const product = await db.query.products.findFirst({ where: eq(products.id, productId) });
    if (!product) {
      return { success: false, error: "Ürün bulunamadı." };
    }
    if (quantity > product.stock) {
      return { success: false, error: `Stokta sadece ${product.stock} adet var.` };
    }

    await db.update(cartItems)
      .set({ quantity, updatedAt: new Date() })
      .where(and(eq(cartItems.userId, userId), eq(cartItems.productId, productId)));

    revalidatePath("/sepet");
    return { success: true };
  } catch (error) {
    console.error("Error updating cart quantity in database:", error);
    return { success: false, error: "Miktar güncellenemedi." };
  }
}

export async function removeFromCartDb(userId: string, productId: string) {
  try {
    await db.delete(cartItems)
      .where(and(eq(cartItems.userId, userId), eq(cartItems.productId, productId)));

    revalidatePath("/sepet");
    return { success: true };
  } catch (error) {
    console.error("Error removing from cart in database:", error);
    return { success: false, error: "Ürün silinemedi." };
  }
}

export async function clearCartDb(userId: string) {
  try {
    await db.delete(cartItems).where(eq(cartItems.userId, userId));
    revalidatePath("/sepet");
    return { success: true };
  } catch (error) {
    console.error("Error clearing cart in database:", error);
    return { success: false, error: "Sepet temizlenemedi." };
  }
}

export async function syncCartDb(userId: string, guestItems: { productId: string; quantity: number }[]) {
  try {
    for (const item of guestItems) {
      // Find if item exists in db cart
      const existing = await db.select()
        .from(cartItems)
        .where(and(eq(cartItems.userId, userId), eq(cartItems.productId, item.productId)))
        .limit(1);

      if (existing.length > 0) {
        // Increment quantity
        await db.update(cartItems)
          .set({ quantity: existing[0].quantity + item.quantity, updatedAt: new Date() })
          .where(eq(cartItems.id, existing[0].id));
      } else {
        // Insert new cart item
        const id = `cart_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
        await db.insert(cartItems).values({
          id,
          userId,
          productId: item.productId,
          quantity: item.quantity,
          createdAt: new Date(),
          updatedAt: new Date()
        });
      }
    }

    revalidatePath("/sepet");
    return { success: true };
  } catch (error) {
    console.error("Error syncing guest cart to database:", error);
    return { success: false, error: "Sepet senkronizasyonu başarısız oldu." };
  }
}
