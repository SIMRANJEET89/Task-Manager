import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

if (!process.env.MONGODB_URI) {
  throw new Error("Please provide Mongodb connection string");
}

async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log(connectDB, "db connect successfully");
  } catch (error) {
    console.log("error occur", error);
  }
}

export default connectDB;
