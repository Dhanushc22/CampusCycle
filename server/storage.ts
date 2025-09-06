import {
  users,
  products,
  services,
  conversations,
  messages,
  transactions,
  reviews,
  type User,
  type UpsertUser,
  type Product,
  type Service,
  type Conversation,
  type Message,
  type Transaction,
  type Review,
  type InsertProduct,
  type InsertService,
  type InsertMessage,
  type InsertTransaction,
  type InsertReview,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, or, like, sql } from "drizzle-orm";

export interface IStorage {
  // User operations (mandatory for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  updateUserEcoPoints(userId: string, points: number): Promise<void>;
  
  // Product operations
  getProducts(filters?: {
    category?: string;
    condition?: string;
    type?: string;
    search?: string;
  }): Promise<Product[]>;
  getProduct(id: string): Promise<Product | undefined>;
  getUserProducts(userId: string): Promise<Product[]>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: string, updates: Partial<InsertProduct>): Promise<Product>;
  deleteProduct(id: string): Promise<void>;
  
  // Service operations
  getServices(filters?: {
    category?: string;
    search?: string;
  }): Promise<Service[]>;
  getService(id: string): Promise<Service | undefined>;
  getUserServices(userId: string): Promise<Service[]>;
  createService(service: InsertService): Promise<Service>;
  updateService(id: string, updates: Partial<InsertService>): Promise<Service>;
  deleteService(id: string): Promise<void>;
  
  // Conversation operations
  getUserConversations(userId: string): Promise<Conversation[]>;
  getConversation(id: string): Promise<Conversation | undefined>;
  createConversation(conversation: {
    participant1Id: string;
    participant2Id: string;
    productId?: string;
    serviceId?: string;
  }): Promise<Conversation>;
  
  // Message operations
  getConversationMessages(conversationId: string): Promise<Message[]>;
  createMessage(message: InsertMessage): Promise<Message>;
  updateLastMessageTime(conversationId: string): Promise<void>;
  
  // Transaction operations
  getUserTransactions(userId: string): Promise<Transaction[]>;
  createTransaction(transaction: InsertTransaction): Promise<Transaction>;
  updateTransactionStatus(id: string, status: string): Promise<Transaction>;
  
  // Review operations
  getUserReviews(userId: string): Promise<Review[]>;
  createReview(review: InsertReview): Promise<Review>;
  updateUserRating(userId: string): Promise<void>;
  
  // Analytics
  getPlatformStats(): Promise<{
    activeUsers: number;
    itemsTraded: number;
    wasteReduced: string;
    co2Saved: string;
  }>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  async updateUserEcoPoints(userId: string, points: number): Promise<void> {
    await db
      .update(users)
      .set({
        ecoPoints: sql`${users.ecoPoints} + ${points}`,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId));
  }

  // Product operations
  async getProducts(filters?: {
    category?: string;
    condition?: string;
    type?: string;
    search?: string;
  }): Promise<Product[]> {
    if (filters && Object.values(filters).some(v => v)) {
      const conditions = [eq(products.isActive, true)];
      
      if (filters.category) {
        conditions.push(eq(products.category, filters.category));
      }
      
      if (filters.condition) {
        conditions.push(eq(products.condition, filters.condition));
      }
      
      if (filters.type) {
        conditions.push(eq(products.type, filters.type));
      }
      
      if (filters.search) {
        conditions.push(
          or(
            like(products.title, `%${filters.search}%`),
            like(products.description, `%${filters.search}%`)
          )!
        );
      }

      return await db
        .select()
        .from(products)
        .where(and(...conditions))
        .orderBy(desc(products.createdAt));
    }

    return await db
      .select()
      .from(products)
      .where(eq(products.isActive, true))
      .orderBy(desc(products.createdAt));
  }

  async getProduct(id: string): Promise<Product | undefined> {
    const [product] = await db
      .select()
      .from(products)
      .where(eq(products.id, id));
    return product;
  }

  async getUserProducts(userId: string): Promise<Product[]> {
    return await db
      .select()
      .from(products)
      .where(eq(products.sellerId, userId))
      .orderBy(desc(products.createdAt));
  }

  async createProduct(product: InsertProduct): Promise<Product> {
    const [newProduct] = await db
      .insert(products)
      .values(product)
      .returning();
    return newProduct;
  }

  async updateProduct(id: string, updates: Partial<InsertProduct>): Promise<Product> {
    const [updatedProduct] = await db
      .update(products)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(products.id, id))
      .returning();
    return updatedProduct;
  }

  async deleteProduct(id: string): Promise<void> {
    await db
      .update(products)
      .set({ isActive: false, updatedAt: new Date() })
      .where(eq(products.id, id));
  }

  // Service operations
  async getServices(filters?: {
    category?: string;
    search?: string;
  }): Promise<Service[]> {
    if (filters && Object.values(filters).some(v => v)) {
      const conditions = [eq(services.isActive, true)];
      
      if (filters.category) {
        conditions.push(eq(services.category, filters.category));
      }
      
      if (filters.search) {
        conditions.push(
          or(
            like(services.title, `%${filters.search}%`),
            like(services.description, `%${filters.search}%`)
          )!
        );
      }

      return await db
        .select()
        .from(services)
        .where(and(...conditions))
        .orderBy(desc(services.createdAt));
    }

    return await db
      .select()
      .from(services)
      .where(eq(services.isActive, true))
      .orderBy(desc(services.createdAt));
  }

  async getService(id: string): Promise<Service | undefined> {
    const [service] = await db
      .select()
      .from(services)
      .where(eq(services.id, id));
    return service;
  }

  async getUserServices(userId: string): Promise<Service[]> {
    return await db
      .select()
      .from(services)
      .where(eq(services.providerId, userId))
      .orderBy(desc(services.createdAt));
  }

  async createService(service: InsertService): Promise<Service> {
    const [newService] = await db
      .insert(services)
      .values(service)
      .returning();
    return newService;
  }

  async updateService(id: string, updates: Partial<InsertService>): Promise<Service> {
    const [updatedService] = await db
      .update(services)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(services.id, id))
      .returning();
    return updatedService;
  }

  async deleteService(id: string): Promise<void> {
    await db
      .update(services)
      .set({ isActive: false, updatedAt: new Date() })
      .where(eq(services.id, id));
  }

  // Conversation operations
  async getUserConversations(userId: string): Promise<Conversation[]> {
    return await db
      .select()
      .from(conversations)
      .where(
        or(
          eq(conversations.participant1Id, userId),
          eq(conversations.participant2Id, userId)
        )!
      )
      .orderBy(desc(conversations.lastMessageAt));
  }

  async getConversation(id: string): Promise<Conversation | undefined> {
    const [conversation] = await db
      .select()
      .from(conversations)
      .where(eq(conversations.id, id));
    return conversation;
  }

  async createConversation(conversation: {
    participant1Id: string;
    participant2Id: string;
    productId?: string;
    serviceId?: string;
  }): Promise<Conversation> {
    // Check if conversation already exists
    const existing = await db
      .select()
      .from(conversations)
      .where(
        and(
          or(
            and(
              eq(conversations.participant1Id, conversation.participant1Id),
              eq(conversations.participant2Id, conversation.participant2Id)
            ),
            and(
              eq(conversations.participant1Id, conversation.participant2Id),
              eq(conversations.participant2Id, conversation.participant1Id)
            )
          ),
          conversation.productId ? eq(conversations.productId, conversation.productId) : sql`1=1`,
          conversation.serviceId ? eq(conversations.serviceId, conversation.serviceId) : sql`1=1`
        )
      );

    if (existing.length > 0) {
      return existing[0];
    }

    const [newConversation] = await db
      .insert(conversations)
      .values(conversation)
      .returning();
    return newConversation;
  }

  // Message operations
  async getConversationMessages(conversationId: string): Promise<Message[]> {
    return await db
      .select()
      .from(messages)
      .where(eq(messages.conversationId, conversationId))
      .orderBy(messages.createdAt);
  }

  async createMessage(message: InsertMessage): Promise<Message> {
    const [newMessage] = await db
      .insert(messages)
      .values(message)
      .returning();

    // Update conversation last message time
    await this.updateLastMessageTime(message.conversationId);

    return newMessage;
  }

  async updateLastMessageTime(conversationId: string): Promise<void> {
    await db
      .update(conversations)
      .set({ lastMessageAt: new Date() })
      .where(eq(conversations.id, conversationId));
  }

  // Transaction operations
  async getUserTransactions(userId: string): Promise<Transaction[]> {
    return await db
      .select()
      .from(transactions)
      .where(
        or(
          eq(transactions.buyerId, userId),
          eq(transactions.sellerId, userId)
        )!
      )
      .orderBy(desc(transactions.createdAt));
  }

  async createTransaction(transaction: InsertTransaction): Promise<Transaction> {
    const [newTransaction] = await db
      .insert(transactions)
      .values(transaction)
      .returning();

    // Award EcoPoints for sustainable actions
    let ecoPoints = 0;
    if (transaction.type === 'donation') {
      ecoPoints = 50;
    } else if (transaction.type === 'exchange') {
      ecoPoints = 25;
    } else if (transaction.type === 'sale') {
      ecoPoints = 10;
    }

    if (ecoPoints > 0) {
      await this.updateUserEcoPoints(transaction.sellerId, ecoPoints);
      await db
        .update(transactions)
        .set({ ecoPointsAwarded: ecoPoints })
        .where(eq(transactions.id, newTransaction.id));
    }

    return newTransaction;
  }

  async updateTransactionStatus(id: string, status: string): Promise<Transaction> {
    const [updatedTransaction] = await db
      .update(transactions)
      .set({ status, updatedAt: new Date() })
      .where(eq(transactions.id, id))
      .returning();
    return updatedTransaction;
  }

  // Review operations
  async getUserReviews(userId: string): Promise<Review[]> {
    return await db
      .select()
      .from(reviews)
      .where(eq(reviews.reviewedId, userId))
      .orderBy(desc(reviews.createdAt));
  }

  async createReview(review: InsertReview): Promise<Review> {
    const [newReview] = await db
      .insert(reviews)
      .values(review)
      .returning();

    // Update user rating
    await this.updateUserRating(review.reviewedId);

    return newReview;
  }

  async updateUserRating(userId: string): Promise<void> {
    const userReviews = await this.getUserReviews(userId);
    
    if (userReviews.length > 0) {
      const avgRating = userReviews.reduce((sum, review) => sum + review.rating, 0) / userReviews.length;
      
      await db
        .update(users)
        .set({
          rating: avgRating.toFixed(2),
          reviewCount: userReviews.length,
          updatedAt: new Date(),
        })
        .where(eq(users.id, userId));
    }
  }

  // Analytics
  async getPlatformStats(): Promise<{
    activeUsers: number;
    itemsTraded: number;
    wasteReduced: string;
    co2Saved: string;
  }> {
    const [userCount] = await db
      .select({ count: sql<number>`count(*)` })
      .from(users);

    const [transactionCount] = await db
      .select({ count: sql<number>`count(*)` })
      .from(transactions)
      .where(eq(transactions.status, 'completed'));

    // Simplified calculations for demo
    const wasteReduced = Math.round((transactionCount?.count || 0) * 0.3 * 100) / 100;
    const co2Saved = Math.round((transactionCount?.count || 0) * 0.06 * 100) / 100;

    return {
      activeUsers: userCount?.count || 0,
      itemsTraded: transactionCount?.count || 0,
      wasteReduced: `${wasteReduced} tons`,
      co2Saved: `${co2Saved} kg`,
    };
  }
}

export const storage = new DatabaseStorage();
