"use server";

import { db } from "@/lib/db";
import { users, walletTransactions } from "@/lib/db/schema";
import { eq, desc, and, gte } from "drizzle-orm";
import { sql } from "drizzle-orm";
import { randomUUID } from "crypto";
import { revalidatePath } from "next/cache";
import { createLog } from "./admin-actions";

export async function getWalletBalance(userId: string): Promise<number> {
  const [user] = await db.select({ walletBalance: users.walletBalance }).from(users).where(eq(users.id, userId)).limit(1);
  return user?.walletBalance ?? 0;
}

export async function getWalletTransactions(userId: string) {
  const rows = await db
    .select()
    .from(walletTransactions)
    .where(eq(walletTransactions.userId, userId))
    .orderBy(desc(walletTransactions.createdAt))
    .limit(100);
  return JSON.parse(JSON.stringify(rows));
}

// Debits the wallet atomically — used at checkout. Fails cleanly (no partial
// state) if the balance is insufficient, same pattern as the product stock
// decrement in order-actions.ts.
export async function debitWallet(userId: string, amount: number, description: string, orderId?: string) {
  if (amount <= 0) return { success: false, error: "Geçersiz tutar." };

  try {
    const result = await db.transaction(async (tx) => {
      const [update] = await tx
        .update(users)
        .set({ walletBalance: sql`${users.walletBalance} - ${amount}` })
        .where(and(eq(users.id, userId), gte(users.walletBalance, amount)));

      if ((update as any).affectedRows === 0) {
        throw new Error("INSUFFICIENT_BALANCE");
      }

      await tx.insert(walletTransactions).values({
        id: randomUUID(),
        userId,
        amount: -amount,
        type: "ORDER_PAYMENT",
        description,
        orderId,
        createdAt: new Date(),
      });
    });
    return { success: true, result };
  } catch (error: any) {
    if (error?.message === "INSUFFICIENT_BALANCE") {
      return { success: false, error: "Cüzdan bakiyeniz yetersiz." };
    }
    console.error("Error debiting wallet:", error);
    return { success: false, error: "Cüzdan işlemi başarısız oldu." };
  }
}

// Admin-only: manually credit or debit a user's wallet (promotions, refunds,
// manually-confirmed bank transfer top-ups). Not exposed to end users.
export async function adminAdjustWallet(userId: string, amount: number, reason: string) {
  if (!amount || amount === 0) return { success: false, error: "Geçersiz tutar." };

  try {
    await db.transaction(async (tx) => {
      if (amount < 0) {
        const [update] = await tx
          .update(users)
          .set({ walletBalance: sql`${users.walletBalance} + ${amount}` })
          .where(and(eq(users.id, userId), gte(users.walletBalance, -amount)));
        if ((update as any).affectedRows === 0) {
          throw new Error("INSUFFICIENT_BALANCE");
        }
      } else {
        await tx.update(users).set({ walletBalance: sql`${users.walletBalance} + ${amount}` }).where(eq(users.id, userId));
      }

      await tx.insert(walletTransactions).values({
        id: randomUUID(),
        userId,
        amount,
        type: "ADMIN_ADJUSTMENT",
        description: reason,
        createdAt: new Date(),
      });
    });

    await createLog(
      "Cüzdan Bakiyesi Güncellendi",
      `Kullanıcı (${userId}) cüzdanına ${amount > 0 ? "+" : ""}${amount}₺ işlendi. Sebep: ${reason}`
    );

    revalidatePath("/admin/customers");
    return { success: true };
  } catch (error: any) {
    if (error?.message === "INSUFFICIENT_BALANCE") {
      return { success: false, error: "Kullanıcının bakiyesi bu düşüş için yetersiz." };
    }
    console.error("Error adjusting wallet:", error);
    return { success: false, error: "Bakiye güncellenemedi." };
  }
}

export async function findUserForWallet(email: string) {
  const [user] = await db
    .select({ id: users.id, name: users.name, email: users.email, walletBalance: users.walletBalance })
    .from(users)
    .where(eq(users.email, email.trim()))
    .limit(1);
  return user ?? null;
}
