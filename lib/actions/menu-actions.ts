"use client"; // Wait, server actions shouldn't have "use client".

"use server";

import { db } from "@/lib/db";
import { navMenus, navMenuItems } from "@/lib/db/schema";
import { eq, asc } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";
import { getSession } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function getMenus() {
  const session = await getSession();
  if (session?.user?.role !== "ADMIN") {
    return { success: false, error: "Unauthorized" };
  }

  const menus = await db.query.navMenus.findMany({
    with: {
      items: {
        orderBy: [asc(navMenuItems.order)],
      },
    },
  });
  return { success: true, menus };
}

export async function getPublicMenu(name: string) {
  const menu = await db.query.navMenus.findFirst({
    where: eq(navMenus.name, name),
    with: {
      items: {
        orderBy: [asc(navMenuItems.order)],
      },
    },
  });

  if (!menu) return null;

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
  const menuId = id || uuidv4();

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
        id: item.id || uuidv4(),
        menuId,
        parentId: item.parentId || null,
        title: item.title,
        url: item.url,
        order: parseInt(item.order) || 0,
        target: item.target || "_self",
      }));
      
      await db.insert(navMenuItems).values(itemsToInsert);
    }

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
        revalidatePath("/");
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}
