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

// FOOD Item Table
export const FoodTable = pgTable("food", {
  id: serial("id").primaryKey(),
  restaurantId: integer("restaurant_id").notNull().references(() => restaurantTable.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  description: text("description"),
  price: numeric("price", { precision: 10, scale: 2 }).notNull(),
  available: boolean("available").default(true),
  imageUrl: text("imageUrl").notNull(),
});

// Order Table
export const orderTable = pgTable("orders", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => userTable.id, { onDelete: "cascade" }),
  foodId: integer("food_id").notNull().references(() => FoodTable.id, { onDelete: "cascade" }),
  quantity: numeric("quantity", { precision: 10, scale: 2 }).notNull(),
  status: text("status").notNull().default("pending"), // "pending", "confirmed", "preparing", "out_for_delivery", "delivered", "cancelled"
  createdAt: timestamp({withTimezone: true, mode: "string"}).defaultNow(),
});
