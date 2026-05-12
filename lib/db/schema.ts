import { mysqlTable, varchar, text, double, int, timestamp, mysqlEnum, boolean, primaryKey } from "drizzle-orm/mysql-core";
import { sql } from "drizzle-orm";

// 1. Users & Authentication
export const users = mysqlTable("users", {
  id: varchar("id", { length: 255 }).primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
  role: mysqlEnum("role", ["USER", "ADMIN"]).default("USER").notNull(),
  adminRole: varchar("admin_role", { length: 255 }),
  phone: varchar("phone", { length: 20 }),
  address: text("address"),
  image: varchar("image", { length: 255 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export const userAddresses = mysqlTable("user_addresses", {
  id: varchar("id", { length: 255 }).primaryKey(),
  userId: varchar("user_id", { length: 255 }).notNull().references(() => users.id),
  title: varchar("title", { length: 100 }).notNull(), // Home, Work, etc.
  name: varchar("name", { length: 255 }),
  phone: varchar("phone", { length: 20 }),
  city: varchar("city", { length: 100 }).notNull(),
  district: varchar("district", { length: 100 }).notNull(),
  addressDetail: text("address_detail").notNull(),
  isDefault: boolean("is_default").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// 2. Catalog Management
export const categories = mysqlTable("categories", {
  id: varchar("id", { length: 255 }).primaryKey(),
  name: varchar("name", { length: 255 }).notNull().unique(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  description: text("description"),
  image: varchar("image", { length: 255 }),
  parentId: varchar("parent_id", { length: 255 }), // Self-reference for subcategories
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export const products = mysqlTable("products", {
  id: varchar("id", { length: 255 }).primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  sku: varchar("sku", { length: 100 }).notNull().unique(),
  description: text("description"),
  price: double("price").notNull(),
  oldPrice: double("old_price"),
  stock: int("stock").default(0).notNull(),
  salesCount: int("sales_count").default(0).notNull(),
  categoryId: varchar("category_id", { length: 255 }).references(() => categories.id),
  image: varchar("image", { length: 255 }),
  status: mysqlEnum("status", ["ACTIVE", "OUT_OF_STOCK", "DRAFT"]).default("ACTIVE").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

// 3. Sales & Orders
export const orders = mysqlTable("orders", {
  id: varchar("id", { length: 255 }).primaryKey(),
  userId: varchar("user_id", { length: 255 }).references(() => users.id).notNull(),
  orderNumber: varchar("order_number", { length: 50 }).notNull().unique(),
  totalAmount: double("total_amount").notNull(),
  status: mysqlEnum("status", ["PENDING", "PREPARING", "COMPLETED", "CANCELLED"]).default("PENDING").notNull(),
  paymentStatus: mysqlEnum("payment_status", ["PENDING", "PAID", "FAILED"]).default("PENDING").notNull(),
  paymentMethod: varchar("payment_method", { length: 50 }),
  shippingAddress: text("shipping_address").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export const orderItems = mysqlTable("order_items", {
  id: varchar("id", { length: 255 }).primaryKey(),
  orderId: varchar("order_id", { length: 255 }).references(() => orders.id).notNull(),
  productId: varchar("product_id", { length: 255 }).references(() => products.id).notNull(),
  quantity: int("quantity").notNull(),
  price: double("price").notNull(),
});

// 4. Marketing & Content
export const reviews = mysqlTable("reviews", {
  id: varchar("id", { length: 255 }).primaryKey(),
  productId: varchar("product_id", { length: 255 }).references(() => products.id),
  userId: varchar("user_id", { length: 255 }).references(() => users.id).notNull(),
  rating: int("rating").notNull(),
  comment: text("comment"),
  status: mysqlEnum("status", ["PENDING", "APPROVED", "REJECTED"]).default("PENDING").notNull(),
  likes: int("likes").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const reviewLikes = mysqlTable("review_likes", {
  id: varchar("id", { length: 255 }).primaryKey(),
  reviewId: varchar("review_id", { length: 255 }).notNull().references(() => reviews.id),
  userId: varchar("user_id", { length: 255 }).notNull().references(() => users.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const coupons = mysqlTable("coupons", {
  id: varchar("id", { length: 255 }).primaryKey(),
  code: varchar("code", { length: 50 }).notNull().unique(),
  discountType: mysqlEnum("discount_type", ["PERCENTAGE", "FIXED"]).notNull(),
  discountValue: double("discount_value").notNull(),
  minPurchase: double("min_purchase").default(0),
  expiryDate: timestamp("expiry_date"),
  usageLimit: int("usage_limit"),
  usageCount: int("usage_count").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const blogPosts = mysqlTable("blog_posts", {
  id: varchar("id", { length: 255 }).primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  excerpt: text("excerpt"),
  content: text("content"),
  image: varchar("image", { length: 255 }),
  authorId: varchar("author_id", { length: 255 }).references(() => users.id).notNull(),
  status: mysqlEnum("status", ["DRAFT", "PUBLISHED"]).default("DRAFT").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

// 5. Support System
export const supportTickets = mysqlTable("support_tickets", {
  id: varchar("id", { length: 255 }).primaryKey(),
  userId: varchar("user_id", { length: 255 }).references(() => users.id).notNull(),
  subject: varchar("subject", { length: 255 }).notNull(),
  priority: mysqlEnum("priority", ["LOW", "MEDIUM", "HIGH", "EMERGENCY"]).default("LOW").notNull(),
  status: mysqlEnum("status", ["OPEN", "IN_PROGRESS", "CLOSED"]).default("OPEN").notNull(),
  category: varchar("category", { length: 100 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export const supportMessages = mysqlTable("support_messages", {
  id: varchar("id", { length: 255 }).primaryKey(),
  ticketId: varchar("ticket_id", { length: 255 }).references(() => supportTickets.id).notNull(),
  senderId: varchar("sender_id", { length: 255 }).references(() => users.id).notNull(),
  message: text("message").notNull(),
  imageUrl: varchar("image_url", { length: 255 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// 6. Shipping & Delivery
export const shippingMethods = mysqlTable("shipping_methods", {
  id: varchar("id", { length: 255 }).primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  type: varchar("type", { length: 100 }), // e.g., 'Courier', 'Pickup'
  rate: double("rate").notNull(),
  minOrderLimit: double("min_order_limit").default(0),
  status: mysqlEnum("status", ["ACTIVE", "INACTIVE"]).default("ACTIVE").notNull(),
  estimatedDelivery: varchar("estimated_delivery", { length: 100 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

// 7. Payments & Transactions
export const transactions = mysqlTable("transactions", {
  id: varchar("id", { length: 255 }).primaryKey(),
  userId: varchar("user_id", { length: 255 }).references(() => users.id).notNull(),
  orderId: varchar("order_id", { length: 255 }).references(() => orders.id),
  amount: double("amount").notNull(),
  method: varchar("method", { length: 50 }), // e.g., 'Credit Card', 'Bank Transfer'
  status: mysqlEnum("status", ["COMPLETED", "PENDING", "FAILED", "REFUNDED"]).default("PENDING").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// 8. Customer Features
export const wishlist = mysqlTable("wishlist", {
  id: varchar("id", { length: 255 }).primaryKey(),
  userId: varchar("user_id", { length: 255 }).references(() => users.id).notNull(),
  productId: varchar("product_id", { length: 255 }).references(() => products.id).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const cartItems = mysqlTable("cart_items", {
  id: varchar("id", { length: 255 }).primaryKey(),
  userId: varchar("user_id", { length: 255 }).references(() => users.id).notNull(),
  productId: varchar("product_id", { length: 255 }).references(() => products.id).notNull(),
  quantity: int("quantity").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

// 9. Dynamic Content Management
export const heroSlides = mysqlTable("hero_slides", {
  id: varchar("id", { length: 255 }).primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  subtitle: text("subtitle"),
  price: varchar("price", { length: 100 }),
  image: varchar("image", { length: 255 }), // can be fallback for 3D
  modelPath: varchar("model_path", { length: 255 }), // For 3D models
  badge: varchar("badge", { length: 100 }),
  badgeColor: varchar("badge_color", { length: 100 }),
  buttonText: varchar("button_text", { length: 50 }),
  buttonLink: varchar("button_link", { length: 255 }),
  order: int("order").default(0).notNull(),
  status: mysqlEnum("status", ["ACTIVE", "INACTIVE"]).default("ACTIVE").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});


export const banners = mysqlTable("banners", {
  id: varchar("id", { length: 255 }).primaryKey(),
  title: varchar("title", { length: 255 }),
  subtitle: text("subtitle"),
  image: varchar("image", { length: 255 }).notNull(),
  link: varchar("link", { length: 255 }),
  position: varchar("position", { length: 100 }).notNull(), // e.g., 'home-top', 'home-middle'
  status: mysqlEnum("status", ["ACTIVE", "INACTIVE"]).default("ACTIVE").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export const navMenus = mysqlTable("nav_menus", {
  id: varchar("id", { length: 255 }).primaryKey(),
  name: varchar("name", { length: 255 }).notNull().unique(), // e.g., 'header-main', 'footer-links'
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export const navMenuItems = mysqlTable("nav_menu_items", {
  id: varchar("id", { length: 255 }).primaryKey(),
  menuId: varchar("menu_id", { length: 255 }).notNull().references(() => navMenus.id),
  parentId: varchar("parent_id", { length: 255 }),
  title: varchar("title", { length: 255 }).notNull(),
  url: varchar("url", { length: 255 }).notNull(),
  order: int("order").default(0).notNull(),
  target: mysqlEnum("target", ["_self", "_blank"]).default("_self").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});


// 10. Configuration
export const cmsPages = mysqlTable("cms_pages", {
  id: varchar("id", { length: 255 }).primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  content: text("content"),
  status: mysqlEnum("status", ["DRAFT", "PUBLISHED"]).default("DRAFT").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export const settings = mysqlTable("settings", {
  key: varchar("key", { length: 100 }).primaryKey(),
  value: text("value"),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// 11. Live Chat System
export const liveChatMessages = mysqlTable("live_chat_messages", {
  id: varchar("id", { length: 255 }).primaryKey(),
  sessionId: varchar("session_id", { length: 255 }).notNull(), // To group messages from same session/user
  senderName: varchar("sender_name", { length: 255 }),
  senderImage: varchar("sender_image", { length: 255 }), // Admin profile image
  senderRole: mysqlEnum("sender_role", ["USER", "ADMIN"]).default("USER").notNull(),
  message: text("message").notNull(),
  imageUrl: varchar("image_url", { length: 255 }), // Chat images
  isRead: boolean("is_read").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const notifications = mysqlTable("notifications", {
  id: varchar("id", { length: 255 }).primaryKey(),
  userId: varchar("user_id", { length: 255 }), // null means ALL users
  title: varchar("title", { length: 255 }).notNull(),
  message: text("message").notNull(),
  link: varchar("link", { length: 255 }),
  type: mysqlEnum("type", ["INFO", "SUCCESS", "WARNING", "DANGER"]).default("INFO").notNull(),
  isRead: boolean("is_read").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const pushSubscriptions = mysqlTable("push_subscriptions", {
  id: varchar("id", { length: 255 }).primaryKey(),
  userId: varchar("user_id", { length: 255 }), // can be null for guests
  subscription: text("subscription").notNull(), // JSON string of PushSubscription object
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// 12. Relations
import { relations } from "drizzle-orm";

export const usersRelations = relations(users, ({ many }) => ({
  orders: many(orders),
  reviews: many(reviews),
  supportTickets: many(supportTickets),
  supportMessages: many(supportMessages),
  wishlist: many(wishlist),
  cartItems: many(cartItems),
  blogPosts: many(blogPosts),
}));

export const categoriesRelations = relations(categories, ({ many, one }) => ({
  products: many(products),
  parent: one(categories, {
    fields: [categories.parentId],
    references: [categories.id],
    relationName: "subcategory",
  }),
  subcategories: many(categories, {
    relationName: "subcategory",
  }),
}));

export const productsRelations = relations(products, ({ one, many }) => ({
  category: one(categories, {
    fields: [products.categoryId],
    references: [categories.id],
  }),
  orderItems: many(orderItems),
  reviews: many(reviews),
  wishlist: many(wishlist),
  cartItems: many(cartItems),
}));

export const ordersRelations = relations(orders, ({ one, many }) => ({
  user: one(users, {
    fields: [orders.userId],
    references: [users.id],
  }),
  items: many(orderItems),
  transactions: many(transactions),
}));

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id],
  }),
  product: one(products, {
    fields: [orderItems.productId],
    references: [products.id],
  }),
}));

export const supportTicketsRelations = relations(supportTickets, ({ one, many }) => ({
  user: one(users, {
    fields: [supportTickets.userId],
    references: [users.id],
  }),
  messages: many(supportMessages),
}));

export const supportMessagesRelations = relations(supportMessages, ({ one }) => ({
  ticket: one(supportTickets, {
    fields: [supportMessages.ticketId],
    references: [supportTickets.id],
  }),
  sender: one(users, {
    fields: [supportMessages.senderId],
    references: [users.id],
  }),
}));

export const transactionsRelations = relations(transactions, ({ one }) => ({
  user: one(users, {
    fields: [transactions.userId],
    references: [users.id],
  }),
  order: one(orders, {
    fields: [transactions.orderId],
    references: [orders.id],
  }),
}));

export const wishlistRelations = relations(wishlist, ({ one }) => ({
  user: one(users, {
    fields: [wishlist.userId],
    references: [users.id],
  }),
  product: one(products, {
    fields: [wishlist.productId],
    references: [products.id],
  }),
}));

export const cartItemsRelations = relations(cartItems, ({ one }) => ({
  user: one(users, {
    fields: [cartItems.userId],
    references: [users.id],
  }),
  product: one(products, {
    fields: [cartItems.productId],
    references: [products.id],
  }),
}));

export const navMenusRelations = relations(navMenus, ({ many }) => ({
  items: many(navMenuItems),
}));

export const navMenuItemsRelations = relations(navMenuItems, ({ one, many }) => ({
  menu: one(navMenus, {
    fields: [navMenuItems.menuId],
    references: [navMenus.id],
  }),
  parent: one(navMenuItems, {
    fields: [navMenuItems.parentId],
    references: [navMenuItems.id],
    relationName: "submenu",
  }),
  subitems: many(navMenuItems, {
    relationName: "submenu",
  }),
}));

