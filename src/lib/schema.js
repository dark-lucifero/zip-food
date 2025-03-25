import { pgTable, serial, text, varchar, integer, numeric, timestamp, boolean, foreignKey, primaryKey } from "drizzle-orm/pg-core";

// User Table (Customers, Restaurant Owners, Delivery Agents)
export const userTable = pgTable("users", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  address: text("address").notNull(),
  email: varchar("email", 255).notNull().unique(),
  role: text("role").notNull(), // "customer", "restaurant_owner", "delivery_agent"
  createdAt: timestamp({withTimezone: true, mode: "string"}).defaultNow(),
});

// Restaurant Table
export const restaurantTable = pgTable("restaurants", {
  id: serial("id").primaryKey(),
  ownerId: integer("owner_id").notNull().references(() => userTable.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  email: varchar("email", 255).notNull().unique(),
  address: text("address").notNull(),
});

// Menu Item Table
export const itemTable = pgTable("items", {
  id: serial("id").primaryKey(),
  restaurantId: integer("restaurant_id").notNull().references(() => restaurantTable.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  description: text("description"),
  price: numeric("price", { precision: 10, scale: 2 }).notNull(),
  available: boolean("available").default(true),
});

// Order Table
export const orderTable = pgTable("orders", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => userTable.id, { onDelete: "cascade" }),
  restaurantId: integer("restaurant_id").notNull().references(() => restaurantTable.id, { onDelete: "cascade" }),
  totalAmount: numeric("total_amount", { precision: 10, scale: 2 }).notNull(),
  status: text("status").notNull().default("pending"), // "pending", "confirmed", "preparing", "out_for_delivery", "delivered", "cancelled"
  createdAt: timestamp({withTimezone: true, mode: "string"}).defaultNow(),
});

// OrderItem Table (Many-to-Many relationship between Orders and Items)
export const orderItemTable = pgTable("order_items", {
  orderId: integer("order_id").notNull().references(() => orderTable.id, { onDelete: "cascade" }),
  itemId: integer("item_id").notNull().references(() => itemTable.id, { onDelete: "cascade" }),
  quantity: integer("quantity").notNull(),
  price: numeric("price", { precision: 10, scale: 2 }).notNull(),
}, (table) => ({
  pk: primaryKey({ columns: [table.orderId, table.itemId] }), // Composite Primary Key
}));

// Delivery Table
export const deliveryTable = pgTable("deliveries", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id").notNull().references(() => orderTable.id, { onDelete: "cascade" }),
  deliveryAgentId: integer("delivery_agent_id").notNull().references(() => userTable.id, { onDelete: "cascade" }),
  status: text("status").notNull().default("pending"), // "pending", "assigned", "out_for_delivery", "delivered"
  deliveredAt: timestamp("delivered_at"),
  createdAt: timestamp({withTimezone: true, mode: "string"}).defaultNow(),
});