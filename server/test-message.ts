import 'dotenv/config';
import { storage } from "./storage";

async function testMessage() {
  try {
    console.log('🧪 Testing message storage in Neon...');

    // Test message data
    const testMessage = {
      content: "This is a test message from the developer console",
      author: "Developer Test"
    };

    console.log('📝 Sending test message:', testMessage);

    // Create the message
    const message = await storage.createMessage(testMessage);
    console.log('✅ Message created successfully:', message);

    // Retrieve all messages to verify
    const allMessages = await storage.getMessages();
    console.log('📨 All messages in database:', allMessages);

    // Verify our test message is there
    const foundMessage = allMessages.find(m => m.id === message.id);
    if (foundMessage) {
      console.log('✅ Test message found in database:', foundMessage);
    } else {
      console.log('❌ Test message not found in database!');
    }

  } catch (error) {
    console.error('❌ Error during test:', error);
  }
}

testMessage(); 