import mongoose from 'mongoose';
import config from "./app/config";
import app from './app';

console.log("🚀 Server script started...");

async function main() {
 try {
  console.log("🔗 Attempting to connect to MongoDB...");
  await mongoose.connect(config.database_url as string);
  console.log("✅ Successfully connected to MongoDB!");

  app.listen(config.port, () => {
   console.log(`🚀 Server is running at port:${config.port}`);
  });

 } catch (err) {
  console.error("❌ Error starting server:", err);
 }
}

main();
