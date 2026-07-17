"use server";

import { db } from "@/lib/db";
import { navMenus, navMenuItems } from "@/lib/db/schema";
import { eq, asc } from "drizzle-orm";
import { getSession } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { randomUUID } from "crypto";
import { createLog } from "./admin-actions";


export async function getMenus() {
  const session = await getSession();
  if (session?.user?.role !== "ADMIN") {
    return { success: false, error: "Unauthorized" };
  }

  const rows = await db
    .select({
      menu: navMenus,
      item: navMenuItems,
    })
    .from(navMenus)
    .leftJoin(navMenuItems, eq(navMenus.id, navMenuItems.menuId))
    .orderBy(asc(navMenuItems.order));

  const menusMap = new Map<string, any>();
  for (const row of rows) {
    const menuId = row.menu.id;
    if (!menusMap.has(menuId)) {
      menusMap.set(menuId, {
        ...row.menu,
        items: [],
      });
    }
    if (row.item) {
      menusMap.get(menuId).items.push(row.item);
    }
  }

  const menus = Array.from(menusMap.values());
  return { success: true, menus };
}

export async function getPublicMenu(name: string) {
  const rows = await db
    .select({
      menu: navMenus,
      item: navMenuItems,
    })
    .from(navMenus)
    .leftJoin(navMenuItems, eq(navMenus.id, navMenuItems.menuId))
    .where(eq(navMenus.name, name))
    .orderBy(asc(navMenuItems.order));

  if (rows.length === 0) return null;

  const menu = {
    ...rows[0].menu,
    items: [] as any[],
  };

  rows.forEach((row) => {
    if (row.item) {
      menu.items.push(row.item);
    }
  });

  // Organize into tree
  const itemMap = new Map();
  menu.items.forEach((item) => {
    itemMap.set(item.id, { ...item, subitems: [] });
  });

  const rootItems: any[] = [];
  menu.items.forEach((item) => {
    const mappedItem = itemMap.get(item.id);
    if (item.parentId && itemMap.has(item.parentId)) {
      itemMap.get(item.parentId).subitems.push(mappedItem);
    } else {
      rootItems.push(mappedItem);
    }
  });

  return { ...menu, items: rootItems };
}

export async function saveMenu(data: any) {
  const session = await getSession();
  if (session?.user?.role !== "ADMIN") {
    return { success: false, error: "Unauthorized" };
  }

  const { id, name, description, items } = data;
  const menuId = id || randomUUID();

  try {
    // Check if name exists for other menus
    const existing = await db.query.navMenus.findFirst({
      where: eq(navMenus.name, name)
    });

    if (existing && existing.id !== menuId) {
      return { success: false, error: "Bu isimde bir menü zaten var." };
    }

    if (id) {
      await db.update(navMenus)
        .set({ name, description, updatedAt: new Date() })
        .where(eq(navMenus.id, menuId));
    } else {
      await db.insert(navMenus).values({
        id: menuId,
        name,
        description,
      });
    }

    // Update items: delete and re-insert for simplicity
    await db.delete(navMenuItems).where(eq(navMenuItems.menuId, menuId));

    if (items && items.length > 0) {
      const itemsToInsert = items.map((item: any) => ({
        id: item.id || randomUUID(),
        menuId,
        parentId: item.parentId || null,
        title: item.title,
        url: item.url,
        order: parseInt(item.order) || 0,
        target: item.target || "_self",
      }));

      await db.insert(navMenuItems).values(itemsToInsert);
    }

    await createLog(id ? "Menü Güncellendi" : "Menü Eklendi", `Menü ${id ? "güncellendi" : "eklendi"}: ${name}`);

    revalidatePath("/");
    return { success: true, menuId };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteMenu(id: string) {
  const session = await getSession();
  if (session?.user?.role !== "ADMIN") {
    return { success: false, error: "Unauthorized" };
  }

  try {
    await db.delete(navMenuItems).where(eq(navMenuItems.menuId, id));
    await db.delete(navMenus).where(eq(navMenus.id, id));
    await createLog("Menü Silindi", `Menü silindi (ID: ${id})`);
    revalidatePath("/");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
