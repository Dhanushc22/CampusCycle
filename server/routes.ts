import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { 
  insertProductSchema, 
  insertServiceSchema, 
  insertMessageSchema,
  insertTransactionSchema,
  insertReviewSchema 
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Product routes (no auth required)
  app.get('/api/products', async (req, res) => {
    try {
      const { category, condition, type, search } = req.query;
      
      // Mock products data
      const mockProducts = [
        {
          id: "1",
          title: "Calculus II Textbook Bundle",
          description: "Complete set of Calculus II textbooks with solution manual. Used for one semester only, all pages intact.",
          category: "Textbooks",
          condition: "Like New",
          price: 85,
          type: "Sell",
          ecoPoints: 50,
          images: ["https://picsum.photos/seed/calc2/300/200"],
          sellerId: "user1",
          seller: {
            id: "user1",
            name: "Alex Johnson",
            image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
            rating: 4.8,
            verifiedStudent: true
          },
          createdAt: new Date().toISOString()
        },
        {
          id: "2",
          title: "MacBook Pro 2023",
          description: "13-inch, M2 chip, 512GB SSD. Perfect for programming and design work. Including original charger.",
          category: "Electronics",
          condition: "Excellent",
          price: 999,
          type: "Sell/Exchange",
          ecoPoints: 100,
          images: ["https://picsum.photos/seed/laptop/300/200"],
          sellerId: "user2",
          seller: {
            id: "user2",
            name: "Emily Chen",
            image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emily",
            rating: 4.9,
            verifiedStudent: true
          },
          createdAt: new Date().toISOString()
        },
        {
          id: "3",
          title: "Chemistry Lab Equipment Set",
          description: "Complete laboratory kit including beakers, test tubes, and safety gear. Perfect for chemistry students.",
          category: "Lab Equipment",
          condition: "Good",
          price: 120,
          type: "Sell",
          ecoPoints: 75,
          images: ["https://picsum.photos/seed/lab/300/200"],
          sellerId: "user3",
          seller: {
            id: "user3",
            name: "David Kim",
            image: "https://api.dicebear.com/7.x/avataaars/svg?seed=David",
            rating: 4.7,
            verifiedStudent: true
          },
          createdAt: new Date().toISOString()
        },
        {
          id: "4",
          title: "Dorm Room Furniture Set",
          description: "Includes desk, chair, and small bookshelf. Perfect for new students. Must pick up.",
          category: "Furniture",
          condition: "Good",
          price: 150,
          type: "Sell",
          ecoPoints: 80,
          images: ["https://picsum.photos/seed/furniture/300/200"],
          sellerId: "user4",
          seller: {
            id: "user4",
            name: "Sarah Wilson",
            image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
            rating: 4.6,
            verifiedStudent: true
          },
          createdAt: new Date().toISOString()
        },
        {
          id: "2",
          title: "TI-84 Plus CE Calculator",
          description: "Graphing calculator in perfect working condition. Includes charging cable and case. Great for engineering courses.",
          category: "Electronics",
          condition: "Good",
          price: 75,
          type: "Sell/Exchange",
          ecoPoints: 30,
          images: ["https://picsum.photos/seed/calc1/300/200"],
          sellerId: "user2",
          seller: {
            id: "user2",
            name: "Emily Chen",
            image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emily",
            rating: 4.9,
            verifiedStudent: true
          },
          createdAt: new Date().toISOString()
        },
        {
          id: "3",
          title: "Study Desk",
          description: "Compact study desk, perfect for dorm rooms",
          category: "Furniture",
          condition: "Good",
          price: 35,
          images: ["https://picsum.photos/seed/desk1/300/200"],
          sellerId: "user3",
          seller: {
            id: "user3",
            name: "Sam Wilson",
            image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sam",
            rating: 4.7
          },
          createdAt: new Date().toISOString()
        },
        {
          id: "4",
          title: "Lab Coat",
          description: "White lab coat, size M, worn only twice",
          category: "Clothing",
          condition: "Like New",
          price: 15,
          images: ["https://picsum.photos/seed/lab1/300/200"],
          sellerId: "user4",
          seller: {
            id: "user4",
            name: "Maria Garcia",
            image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Maria",
            rating: 4.6
          },
          createdAt: new Date().toISOString()
        },
        {
          id: "5",
          title: "Art Supplies Set",
          description: "Complete art supplies set including brushes, paints, and canvas",
          category: "Art Supplies",
          condition: "New",
          price: 75,
          images: ["https://picsum.photos/seed/art1/300/200"],
          sellerId: "user5",
          seller: {
            id: "user5",
            name: "David Kim",
            image: "https://api.dicebear.com/7.x/avataaars/svg?seed=David",
            rating: 5.0
          },
          createdAt: new Date().toISOString()
        }
      ];

      // Filter products based on query parameters
      let filteredProducts = [...mockProducts];
      if (category) {
        filteredProducts = filteredProducts.filter(p => p.category.toLowerCase() === (category as string).toLowerCase());
      }
      if (condition) {
        filteredProducts = filteredProducts.filter(p => p.condition.toLowerCase() === (condition as string).toLowerCase());
      }
      if (search) {
        const searchTerm = (search as string).toLowerCase();
        filteredProducts = filteredProducts.filter(p => 
          p.title.toLowerCase().includes(searchTerm) || 
          p.description.toLowerCase().includes(searchTerm)
        );
      }

      res.json(filteredProducts);
    } catch (error) {
      console.error("Error fetching products:", error);
      res.status(500).json({ message: "Failed to fetch products" });
    }
  });

  // Service routes
  app.get('/api/services', async (req, res) => {
    try {
      const { category, search } = req.query;
      // Mock services data
      const mockServices = [
        {
          id: "1",
          title: "STEM Tutoring & Homework Help",
          description: "Expert tutoring in Calculus, Physics, and Computer Science. 4th-year Engineering student with teaching experience. Group sessions available.",
          category: "Academic",
          price: 25,
          type: "Hourly",
          ecoPoints: 20,
          providerId: "user1",
          provider: {
            id: "user1",
            name: "John Doe",
            image: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
            rating: 4.8,
            verifiedStudent: true,
            major: "Computer Engineering",
            reviews: [
              { id: "r1", rating: 5, comment: "Excellent tutor! Really helped me understand Calculus.", authorName: "Sarah M." },
              { id: "r2", rating: 5, comment: "Great at explaining complex concepts", authorName: "Mike R." }
            ]
          },
          createdAt: new Date().toISOString(),
          availability: "Mon-Fri, 2PM-8PM",
          location: "Library or Online"
        },
        {
          id: "2",
          title: "Programming & Web Development",
          description: "Professional web development help. Expertise in React, Node.js, and Python. Can help with projects and assignments.",
          category: "Technology",
          price: 30,
          type: "Hourly",
          ecoPoints: 25,
          providerId: "user2",
          provider: {
            id: "user2",
            name: "Maria Garcia",
            image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Maria",
            rating: 4.9,
            verifiedStudent: true,
            major: "Computer Science",
            reviews: [
              { id: "r3", rating: 5, comment: "Helped me complete my web project ahead of deadline!", authorName: "Alex K." }
            ]
          },
          createdAt: new Date().toISOString(),
          availability: "Weekends, Evenings",
          location: "Online"
        },
        {
          id: "3",
          title: "Research & Writing Assistance",
          description: "Help with research papers, essays, and academic writing. Experienced in APA and MLA formats.",
          category: "Academic",
          price: 20,
          type: "Hourly",
          ecoPoints: 15,
          providerId: "user3",
          provider: {
            id: "user3",
            name: "Emma Wilson",
            image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emma",
            rating: 4.7,
            verifiedStudent: true,
            major: "English Literature",
            reviews: [
              { id: "r4", rating: 5, comment: "Emma helped me improve my essay structure significantly", authorName: "James L." }
            ]
          },
          createdAt: new Date().toISOString(),
          availability: "Flexible Hours",
          location: "Library or Online"
        },
        {
          id: "4",
          title: "Graphic Design Services",
          description: "Professional graphic design help for projects, presentations, and student organizations. Expert in Adobe Creative Suite.",
          category: "Creative",
          price: 35,
          type: "Project",
          ecoPoints: 30,
          providerId: "user4",
          provider: {
            id: "user4",
            name: "Ryan Chen",
            image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ryan",
            rating: 5.0,
            verifiedStudent: true,
            major: "Graphic Design",
            reviews: [
              { id: "r5", rating: 5, comment: "Amazing design work for our club posters!", authorName: "Student Council" }
            ]
          },
          createdAt: new Date().toISOString(),
          availability: "24/7 Online",
          location: "Remote"
        },
        {
          id: "2",
          title: "Web Development",
          description: "Custom website development and programming help. Expert in React, Node.js, and Python.",
          category: "Technology",
          price: 35,
          providerId: "user2",
          provider: {
            id: "user2",
            name: "Jane Smith",
            image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jane",
            rating: 4.9,
            reviews: [
              { id: "r2", rating: 5, comment: "Great developer!", authorName: "Client B" }
            ]
          },
          createdAt: new Date().toISOString(),
          availability: "Weekends"
        },
        {
          id: "3",
          title: "Research Assistant",
          description: "Help with academic research, literature review, and data analysis. Experienced in various disciplines.",
          category: "Academic",
          price: 30,
          providerId: "user3",
          provider: {
            id: "user3",
            name: "Mike Wilson",
            image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mike",
            rating: 4.7,
            reviews: [
              { id: "r3", rating: 4, comment: "Very thorough work", authorName: "Professor C" }
            ]
          },
          createdAt: new Date().toISOString(),
          availability: "Flexible hours"
        },
        {
          id: "4",
          title: "Language Exchange",
          description: "Spanish-English language exchange and tutoring. All levels welcome.",
          category: "Language",
          price: 20,
          providerId: "user4",
          provider: {
            id: "user4",
            name: "Sofia Rodriguez",
            image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sofia",
            rating: 5.0,
            reviews: [
              { id: "r4", rating: 5, comment: "Amazing teacher!", authorName: "Language Learner" }
            ]
          },
          createdAt: new Date().toISOString(),
          availability: "Tue-Thu evenings"
        },
        {
          id: "5",
          title: "Fitness Training",
          description: "Personal fitness training and workout planning. Certified trainer with 3 years of experience.",
          category: "Health",
          price: 40,
          providerId: "user5",
          provider: {
            id: "user5",
            name: "Chris Thompson",
            image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Chris",
            rating: 4.9,
            reviews: [
              { id: "r5", rating: 5, comment: "Excellent trainer!", authorName: "Fitness Student" }
            ]
          },
          createdAt: new Date().toISOString(),
          availability: "Morning and evening slots"
        }
      ];

      // Filter by category and search term if provided
      let filteredServices = [...mockServices];
      if (category) {
        filteredServices = filteredServices.filter(s => s.category.toLowerCase() === (category as string).toLowerCase());
      }
      if (search) {
        const searchTerm = (search as string).toLowerCase();
        filteredServices = filteredServices.filter(s => 
          s.title.toLowerCase().includes(searchTerm) || 
          s.description.toLowerCase().includes(searchTerm)
        );
      }

      res.json(filteredServices);
    } catch (error) {
      console.error("Error fetching services:", error);
      res.status(500).json({ message: "Failed to fetch services" });
    }
  });

  app.get('/api/services/:id', async (req, res) => {
    try {
      // Mock service data
      const mockService = {
        id: req.params.id,
        title: "Math Tutoring",
        description: "Expert tutoring in Calculus, Linear Algebra, and Statistics. Available for one-on-one or group sessions. Flexible scheduling and competitive rates.",
        category: "Academic",
        price: 25,
        providerId: "user1",
        provider: {
          id: "user1",
          name: "John Doe",
          image: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
          rating: 4.8,
          reviews: [
            { id: "r1", rating: 5, comment: "Excellent tutor!", authorName: "Student A" },
            { id: "r2", rating: 4, comment: "Very helpful", authorName: "Student B" }
          ]
        },
        createdAt: new Date().toISOString(),
        availability: "Mon-Fri, 2PM-8PM",
        location: "Online or In-person"
      };
      res.json(mockService);
    } catch (error) {
      console.error("Error fetching service:", error);
      res.status(500).json({ message: "Failed to fetch service" });
    }
  });

  // Stats endpoint for home page
  // Offers route
  app.get('/api/offers', async (req, res) => {
    try {
      // Mock offers data
      const mockOffers = [
        {
          id: "1",
          title: "20% Off First Purchase",
          description: "Get 20% off your first purchase of any sustainable product",
          type: "Discount",
          code: "FIRST20",
          validUntil: "2024-12-31",
          terms: "Valid for first-time buyers only. Maximum discount $50.",
          ecoPoints: 0,
          provider: {
            id: "admin",
            name: "EcoFind Admin",
            image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Admin"
          }
        },
        {
          id: "2",
          title: "Extra EcoPoints Bundle",
          description: "Earn 2x EcoPoints on all sustainable product purchases this week",
          type: "Bonus",
          code: "2XPOINTS",
          validUntil: "2024-03-31",
          terms: "Valid on all sustainable product purchases. Points credited within 24 hours.",
          ecoPoints: 100,
          provider: {
            id: "admin",
            name: "EcoFind Admin",
            image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Admin"
          }
        },
        {
          id: "3",
          title: "Free Delivery Week",
          description: "Free delivery on all orders over $20",
          type: "Free Shipping",
          code: "FREESHIP",
          validUntil: "2024-04-15",
          terms: "Minimum order value $20. Valid for on-campus delivery only.",
          ecoPoints: 0,
          provider: {
            id: "admin",
            name: "EcoFind Admin",
            image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Admin"
          }
        },
        {
          id: "4",
          title: "Sustainable Bundle Deal",
          description: "Save 25% when you buy any 3 eco-friendly products",
          type: "Bundle",
          code: "BUNDLE25",
          validUntil: "2024-05-31",
          terms: "Must purchase 3 or more items marked as eco-friendly. Maximum discount $75.",
          ecoPoints: 50,
          provider: {
            id: "admin",
            name: "EcoFind Admin",
            image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Admin"
          }
        }
      ];
      res.json(mockOffers);
    } catch (error) {
      console.error("Error fetching offers:", error);
      res.status(500).json({ message: "Failed to fetch offers" });
    }
  });

  app.get('/api/promotions', async (req, res) => {
    try {
      const mockPromotions = {
        featured: [
          {
            id: "promo1",
            title: "Semester Kickoff Sale! 🎓",
            description: "Get up to 50% off on textbooks and study materials",
            image: "https://picsum.photos/seed/promo1/800/400",
            category: "Sale",
            endDate: "2025-09-15",
            highlight: "Limited Time"
          },
          {
            id: "promo2",
            title: "Double EcoPoints Week! 🌱",
            description: "Earn 2x EcoPoints on all exchanges and donations",
            image: "https://picsum.photos/seed/promo2/800/400",
            category: "EcoPoints",
            endDate: "2025-09-10",
            highlight: "Special Event"
          },
          {
            id: "promo3",
            title: "Tech Exchange Fair 💻",
            description: "Trade in your old devices for upgrade credits",
            image: "https://picsum.photos/seed/promo3/800/400",
            category: "Event",
            date: "2025-09-20",
            highlight: "Coming Soon"
          }
        ],
        trending: [
          {
            id: "trend1",
            title: "Most Wanted Items",
            items: ["Scientific Calculators", "Engineering Textbooks", "Lab Equipment"]
          },
          {
            id: "trend2",
            title: "Top Services",
            items: ["Programming Help", "Math Tutoring", "Research Assistance"]
          }
        ]
      };
      res.json(mockPromotions);
    } catch (error) {
      console.error("Error fetching promotions:", error);
      res.status(500).json({ message: "Failed to fetch promotions" });
    }
  });

  app.get('/api/stats', async (req, res) => {
    try {
      const mockStats = {
        activeUsers: 2847,
        itemsTraded: 15293,
        wasteReduced: "4.2 tons",
        co2Saved: "892 kg",
        totalTransactions: 8456,
        averageRating: 4.8,
        totalEcoPoints: 156789,
        itemsDonated: 3421,
        moneyStudentsSaved: "$45,293",
        sustainabilityScore: "A+",
        activeServices: 234,
        serviceHoursProvided: 1893
      };
      res.json(mockStats);
    } catch (error) {
      console.error("Error fetching stats:", error);
      res.status(500).json({ message: "Failed to fetch stats" });
    }
  });

  app.get('/api/products/:id', async (req, res) => {
    try {
      const product = await storage.getProduct(req.params.id);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json(product);
    } catch (error) {
      console.error("Error fetching product:", error);
      res.status(500).json({ message: "Failed to fetch product" });
    }
  });

  app.post('/api/products', async (req: any, res) => {
    try {
      const userId = "demo-user-123"; // Mock user ID
      const productData = insertProductSchema.parse({
        ...req.body,
        sellerId: userId,
      });
      const product = await storage.createProduct(productData);
      res.json(product);
    } catch (error) {
      console.error("Error creating product:", error);
      res.status(500).json({ message: "Failed to create product" });
    }
  });

  app.put('/api/products/:id', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const product = await storage.getProduct(req.params.id);
      
      if (!product || product.sellerId !== userId) {
        return res.status(403).json({ message: "Unauthorized" });
      }

      const updates = insertProductSchema.partial().parse(req.body);
      const updatedProduct = await storage.updateProduct(req.params.id, updates);
      res.json(updatedProduct);
    } catch (error) {
      console.error("Error updating product:", error);
      res.status(500).json({ message: "Failed to update product" });
    }
  });

  app.delete('/api/products/:id', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const product = await storage.getProduct(req.params.id);
      
      if (!product || product.sellerId !== userId) {
        return res.status(403).json({ message: "Unauthorized" });
      }

      await storage.deleteProduct(req.params.id);
      res.json({ message: "Product deleted successfully" });
    } catch (error) {
      console.error("Error deleting product:", error);
      res.status(500).json({ message: "Failed to delete product" });
    }
  });

  // Service routes (no auth required)
  app.get('/api/services', async (req, res) => {
    try {
      const { category, search } = req.query;
      const services = await storage.getServices({
        category: category as string,
        search: search as string,
      });
      res.json(services);
    } catch (error) {
      console.error("Error fetching services:", error);
      res.status(500).json({ message: "Failed to fetch services" });
    }
  });

  app.post('/api/services', async (req: any, res) => {
    try {
      const userId = "demo-user-123"; // Mock user ID
      const serviceData = insertServiceSchema.parse({
        ...req.body,
        providerId: userId,
      });
      const service = await storage.createService(serviceData);
      res.json(service);
    } catch (error) {
      console.error("Error creating service:", error);
      res.status(500).json({ message: "Failed to create service" });
    }
  });

  // Conversation routes
  app.get('/api/conversations', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const conversations = await storage.getUserConversations(userId);
      res.json(conversations);
    } catch (error) {
      console.error("Error fetching conversations:", error);
      res.status(500).json({ message: "Failed to fetch conversations" });
    }
  });

  app.post('/api/conversations', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { participant2Id, productId, serviceId } = req.body;
      
      const conversation = await storage.createConversation({
        participant1Id: userId,
        participant2Id,
        productId,
        serviceId,
      });
      
      res.json(conversation);
    } catch (error) {
      console.error("Error creating conversation:", error);
      res.status(500).json({ message: "Failed to create conversation" });
    }
  });

  // Message routes
  app.get('/api/conversations/:id/messages', isAuthenticated, async (req, res) => {
    try {
      const messages = await storage.getConversationMessages(req.params.id);
      res.json(messages);
    } catch (error) {
      console.error("Error fetching messages:", error);
      res.status(500).json({ message: "Failed to fetch messages" });
    }
  });

  app.post('/api/messages', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const messageData = insertMessageSchema.parse({
        ...req.body,
        senderId: userId,
      });
      const message = await storage.createMessage(messageData);
      
      // Broadcast to WebSocket clients
      broadcastMessage(message);
      
      res.json(message);
    } catch (error) {
      console.error("Error creating message:", error);
      res.status(500).json({ message: "Failed to create message" });
    }
  });

  // Transaction routes
  app.get('/api/transactions', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const transactions = await storage.getUserTransactions(userId);
      res.json(transactions);
    } catch (error) {
      console.error("Error fetching transactions:", error);
      res.status(500).json({ message: "Failed to fetch transactions" });
    }
  });

  app.post('/api/transactions', isAuthenticated, async (req: any, res) => {
    try {
      const transactionData = insertTransactionSchema.parse(req.body);
      const transaction = await storage.createTransaction(transactionData);
      res.json(transaction);
    } catch (error) {
      console.error("Error creating transaction:", error);
      res.status(500).json({ message: "Failed to create transaction" });
    }
  });

  // Review routes
  app.post('/api/reviews', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const reviewData = insertReviewSchema.parse({
        ...req.body,
        reviewerId: userId,
      });
      const review = await storage.createReview(reviewData);
      res.json(review);
    } catch (error) {
      console.error("Error creating review:", error);
      res.status(500).json({ message: "Failed to create review" });
    }
  });

  // Analytics routes
  app.get('/api/stats', async (req, res) => {
    try {
      const stats = await storage.getPlatformStats();
      res.json(stats);
    } catch (error) {
      console.error("Error fetching stats:", error);
      res.status(500).json({ message: "Failed to fetch stats" });
    }
  });

  // User routes
  app.get('/api/users/:id/products', async (req, res) => {
    try {
      const products = await storage.getUserProducts(req.params.id);
      res.json(products);
    } catch (error) {
      console.error("Error fetching user products:", error);
      res.status(500).json({ message: "Failed to fetch user products" });
    }
  });

  app.get('/api/users/:id/services', async (req, res) => {
    try {
      const services = await storage.getUserServices(req.params.id);
      res.json(services);
    } catch (error) {
      console.error("Error fetching user services:", error);
      res.status(500).json({ message: "Failed to fetch user services" });
    }
  });

  const httpServer = createServer(app);

  // WebSocket setup for real-time messaging
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });
  const clients = new Map<string, WebSocket>();

  wss.on('connection', (ws, request) => {
    const url = new URL(request.url!, `http://${request.headers.host}`);
    const userId = url.searchParams.get('userId');
    
    if (userId) {
      clients.set(userId, ws);
    }

    ws.on('close', () => {
      if (userId) {
        clients.delete(userId);
      }
    });
  });

  function broadcastMessage(message: any) {
    // Get conversation to find participants
    storage.getConversation(message.conversationId).then(conversation => {
      if (conversation) {
        [conversation.participant1Id, conversation.participant2Id].forEach(participantId => {
          const client = clients.get(participantId);
          if (client && client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({
              type: 'new_message',
              data: message
            }));
          }
        });
      }
    });
  }

  return httpServer;
}
