import mongoose from "mongoose";
import dotenv from "dotenv";
import { MongoMemoryServer } from "mongodb-memory-server";

dotenv.config();

let mongoServer;

async function connectDB() {
  try {
    if (process.env.MONGODB_URL) {
      try {
        await mongoose.connect(process.env.MONGODB_URL);
        console.log("connect DB");
        return;
      } catch (atlasError) {
        console.log("Atlas connection failed, falling back to local memory DB", atlasError.message);
      }
    }

    if (!mongoServer) {
      mongoServer = await MongoMemoryServer.create();
    }

    const uri = mongoServer.getUri();
    await mongoose.connect(uri);
    console.log("connect DB (memory)");
  } catch (error) {
    console.log("Mongodb connect error", error);
  }
}

export default connectDB;