import 'dotenv/config';
import { storage } from "./storage";
import { insertUserSchema, insertPhotoSchema, insertMessageSchema } from "@shared/schema";

async function testDatabase() {
  try {
    console.log("Testing database connection...");

    // Test user operations
    console.log("\nTesting user operations...");
    const testUser = {
      username: "testuser",
      password: "testpass123"
    };
    
    const user = await storage.createUser(testUser);
    console.log("✅ Created user:", user);

    const foundUser = await storage.getUserByUsername("testuser");
    console.log("✅ Found user:", foundUser);

    // Test photo operations
    console.log("\nTesting photo operations...");
    const testPhoto = {
      url: "https://example.com/test.jpg",
      caption: "Test photo",
      order: 1
    };

    const photo = await storage.createPhoto(testPhoto);
    console.log("✅ Created photo:", photo);

    const photos = await storage.getPhotos();
    console.log("✅ Retrieved photos:", photos);

    // Test message operations
    console.log("\nTesting message operations...");
    const testMessage = {
      content: "Happy Birthday!",
      author: "Test Author"
    };

    const message = await storage.createMessage(testMessage);
    console.log("✅ Created message:", message);

    const messages = await storage.getMessages();
    console.log("✅ Retrieved messages:", messages);

    console.log("\n✅ All database tests passed successfully!");
  } catch (error) {
    console.error("❌ Database test failed:", error);
    process.exit(1);
  }
}

testDatabase(); 