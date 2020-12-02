import mongoose from "mongoose";
import config from "../config";
export { Schema } from "mongoose";

export async function connect() {
  try {
    const client = await mongoose.connect(config.mongodb.uri, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true,
    });
    console.log("Successfully connected");
  } catch (error) {
    console.error("Error connecting to database: ", error);
    return process.exit(1);
  }
}
