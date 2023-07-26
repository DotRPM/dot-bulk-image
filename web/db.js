import mongoose from "mongoose";
import "dotenv/config";

connectDB().catch((err) => console.log(err));

export async function connectDB() {
  await mongoose.connect(process.env.DATABASE_URL);
}
