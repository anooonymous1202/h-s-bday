import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(app: Express): Promise<Server> {
  // GET all messages
  app.get("/api/messages", async (req, res, next) => {
    try {
      console.log('🔍 GET /api/messages - Fetching all messages');
      const messages = await storage.getMessages();
      console.log('📨 Retrieved messages:', messages);
      res.json(messages);
    } catch (err) {
      console.error('❌ Error fetching messages:', err);
      next(err);
    }
  });

  // POST a new message
  app.post("/api/messages", async (req, res, next) => {
    try {
      console.log('📝 POST /api/messages - Request body:', req.body);
      const { content, author } = req.body;
      
      if (!content || !author) {
        console.warn('⚠️ Invalid message data:', { content, author });
        return res.status(400).json({ message: "Content and author are required." });
      }
      
      console.log('📤 Creating message in database:', { content, author });
      const message = await storage.createMessage({ content, author });
      console.log('✅ Message created successfully:', message);
      
      // Verify the message was created by fetching it
      const allMessages = await storage.getMessages();
      console.log('📨 Current messages in database:', allMessages);
      
      res.status(201).json(message);
    } catch (err) {
      console.error('❌ Error creating message:', err);
      next(err);
    }
  });

  // use storage to perform CRUD operations on the storage interface
  // e.g. storage.insertUser(user) or storage.getUserByUsername(username)

  const httpServer = createServer(app);

  return httpServer;
}
