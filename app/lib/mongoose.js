import mongoose from "mongoose";

let isConnected = false;

export const connectToDB = async () => {
  const MONGO_URL =
    "mongodb+srv://sanjaysirangi:RObVhXU5WVl7SgnM@cluster0.1vtmcv5.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
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
