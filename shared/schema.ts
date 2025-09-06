import { sql } from 'drizzle-orm';
import {
  index,
  jsonb,
  pgTable,
  timestamp,
  varchar,
  text,
  integer,
  decimal,
  boolean,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table.
// (IMPORTANT) This table is mandatory for Replit Auth, don't drop it.
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table.
// (IMPORTANT) This table is mandatory for Replit Auth, don't drop it.
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  university: varchar("university"),
  major: varchar("major"),
  ecoPoints: integer("eco_points").default(0),
  rating: decimal("rating", { precision: 3, scale: 2 }).default("0.00"),
  reviewCount: integer("review_count").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const products = pgTable("products", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description").notNull(),
  category: varchar("category").notNull(), // books, electronics, furniture, clothing, stationery
  condition: varchar("condition").notNull(), // new, good, fair
  type: varchar("type").notNull(), // sell, exchange, donate
  price: decimal("price", { precision: 10, scale: 2 }),
  imageUrls: text("image_urls").array(),
  sellerId: varchar("seller_id").notNull().references(() => users.id),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const services = pgTable("services", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description").notNull(),
  category: varchar("category").notNull(), // academic, technical, creative, other
  priceType: varchar("price_type").notNull(), // hourly, project, session
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  providerId: varchar("provider_id").notNull().references(() => users.id),
  isActive: boolean("is_active").default(true),
  completedSessions: integer("completed_sessions").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const conversations = pgTable("conversations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  participant1Id: varchar("participant1_id").notNull().references(() => users.id),
  participant2Id: varchar("participant2_id").notNull().references(() => users.id),
  productId: varchar("product_id").references(() => products.id),
  serviceId: varchar("service_id").references(() => services.id),
  lastMessageAt: timestamp("last_message_at").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const messages = pgTable("messages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  conversationId: varchar("conversation_id").notNull().references(() => conversations.id),
  senderId: varchar("sender_id").notNull().references(() => users.id),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const transactions = pgTable("transactions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  buyerId: varchar("buyer_id").notNull().references(() => users.id),
  sellerId: varchar("seller_id").notNull().references(() => users.id),
  productId: varchar("product_id").references(() => products.id),
  serviceId: varchar("service_id").references(() => services.id),
  type: varchar("type").notNull(), // sale, exchange, donation, service
  amount: decimal("amount", { precision: 10, scale: 2 }),
  status: varchar("status").notNull().default("pending"), // pending, completed, cancelled
  ecoPointsAwarded: integer("eco_points_awarded").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const reviews = pgTable("reviews", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  reviewerId: varchar("reviewer_id").notNull().references(() => users.id),
  reviewedId: varchar("reviewed_id").notNull().references(() => users.id),
  transactionId: varchar("transaction_id").notNull().references(() => transactions.id),
  rating: integer("rating").notNull(), // 1-5
  comment: text("comment"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  products: many(products),
  services: many(services),
  sentMessages: many(messages),
  reviewsGiven: many(reviews, { relationName: "reviewer" }),
  reviewsReceived: many(reviews, { relationName: "reviewed" }),
}));

export const productsRelations = relations(products, ({ one, many }) => ({
  seller: one(users, { fields: [products.sellerId], references: [users.id] }),
  conversations: many(conversations),
  transactions: many(transactions),
}));

export const servicesRelations = relations(services, ({ one, many }) => ({
  provider: one(users, { fields: [services.providerId], references: [users.id] }),
  conversations: many(conversations),
  transactions: many(transactions),
}));

export const conversationsRelations = relations(conversations, ({ one, many }) => ({
  participant1: one(users, { fields: [conversations.participant1Id], references: [users.id], relationName: "participant1" }),
  participant2: one(users, { fields: [conversations.participant2Id], references: [users.id], relationName: "participant2" }),
  product: one(products, { fields: [conversations.productId], references: [products.id] }),
  service: one(services, { fields: [conversations.serviceId], references: [services.id] }),
  messages: many(messages),
}));

export const messagesRelations = relations(messages, ({ one }) => ({
  conversation: one(conversations, { fields: [messages.conversationId], references: [conversations.id] }),
  sender: one(users, { fields: [messages.senderId], references: [users.id] }),
}));

export const transactionsRelations = relations(transactions, ({ one }) => ({
  buyer: one(users, { fields: [transactions.buyerId], references: [users.id], relationName: "buyer" }),
  seller: one(users, { fields: [transactions.sellerId], references: [users.id], relationName: "seller" }),
  product: one(products, { fields: [transactions.productId], references: [products.id] }),
  service: one(services, { fields: [transactions.serviceId], references: [services.id] }),
}));

export const reviewsRelations = relations(reviews, ({ one }) => ({
  reviewer: one(users, { fields: [reviews.reviewerId], references: [users.id], relationName: "reviewer" }),
  reviewed: one(users, { fields: [reviews.reviewedId], references: [users.id], relationName: "reviewed" }),
  transaction: one(transactions, { fields: [reviews.transactionId], references: [transactions.id] }),
}));

// Insert schemas
export const insertProductSchema = createInsertSchema(products).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertServiceSchema = createInsertSchema(services).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  completedSessions: true,
});

export const insertMessageSchema = createInsertSchema(messages).omit({
  id: true,
  createdAt: true,
});

export const insertTransactionSchema = createInsertSchema(transactions).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertReviewSchema = createInsertSchema(reviews).omit({
  id: true,
  createdAt: true,
});

// Types
export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;
export type Product = typeof products.$inferSelect;
export type Service = typeof services.$inferSelect;
export type Conversation = typeof conversations.$inferSelect;
export type Message = typeof messages.$inferSelect;
export type Transaction = typeof transactions.$inferSelect;
export type Review = typeof reviews.$inferSelect;

export type InsertProduct = z.infer<typeof insertProductSchema>;
export type InsertService = z.infer<typeof insertServiceSchema>;
export type InsertMessage = z.infer<typeof insertMessageSchema>;
export type InsertTransaction = z.infer<typeof insertTransactionSchema>;
export type InsertReview = z.infer<typeof insertReviewSchema>;
