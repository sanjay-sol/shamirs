import mongoose from "mongoose";

let isConnected = false;

export const connectToDB = async () => {
  const MONGO_URL =
    process.env.MONGO_URL;
  try {
    if (!MONGO_URL) return console.log("MongoDB url not found");

    if (isConnected) {
      console.log("Already connected to MongoDB");
      return;
    } else {
      await mongoose.connect(MONGO_URL);
      isConnected = true;
      console.log("Connected to MongoDB");
      return;
    }
  } catch (err) {
    console.log(err + "Error connecting to MongoDB");
  }
};
