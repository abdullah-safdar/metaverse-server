import mongoose from "mongoose";
import { config } from "../config";

mongoose.set("strictQuery", false);

async function connectToDatabase() {
  try {
    await mongoose.connect(config.MONGO_URL, {});

    console.log("MongoDB connected!!");
  } catch (err) {
    console.log("Failed to connect to MongoDB", err);
  }
}

export default connectToDatabase;
