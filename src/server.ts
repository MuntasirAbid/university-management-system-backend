import mongoose from "mongoose";
import config from "./app/config";
import app from "./app";
import { Server } from "http";

let server: Server;

console.log("🚀 Server script started...");

async function main() {
  try {
    console.log("🔗 Attempting to connect to MongoDB...");
    await mongoose.connect(config.database_url as string);
    console.log("✅ Successfully connected to MongoDB!");

    server = app.listen(config.port, () => {
      console.log(`🚀 Server is running at port:${config.port}`);
    });
  } catch (err) {
    console.error("❌ Error starting server:", err);
  }
}

main();

process.on("unhandledRejection", () => {
  console.log(` unhandledRejection is detected, shutting down ...`);
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
  process.exit(1);
});

process.on("uncaughtException", () => {
  console.log(` uncaughtException is detected, shutting down ...`);
  process.exit(1);
});
