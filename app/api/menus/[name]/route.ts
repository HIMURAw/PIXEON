import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { navMenus, navMenuItems } from "@/lib/db/schema";
import { eq, asc } from "drizzle-orm";

export async function GET(
  request: NextRequest,
  { params }: { params: { name: string } }
) {
  try {
    const { name } = await params;

    const menu = await db.query.navMenus.findFirst({
      where: eq(navMenus.name, name),
      with: {
        items: {
          orderBy: [asc(navMenuItems.order)],
        },
      },
    });

    if (!menu) {
      return NextResponse.json({ success: false, message: "Menu not found" }, { status: 404 });
    }

    // Organize items into a tree structure
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

    return NextResponse.json({ success: true, menu: { ...menu, items: rootItems } });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
