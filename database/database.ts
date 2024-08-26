import mongoose from "mongoose";
import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";

export const connectToDb = async () => {
  if (mongoose.connections[0].readyState) {
    return;
  }
  const uri = `mongodb+srv://barberrybar:${process.env.NEXT_PUBLIC_MONGO_PASSWORD}@cluster0.egdpv1u.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
  try {
    await mongoose.connect(uri);
    console.log("Successfully connected to the database.");
  } catch (error) {
    console.error("Error connecting to the database: ", error);
    throw new Error("Could not connect to the database");
  }
};

export const connectToDbHandler =
  (handler: NextApiHandler) =>
  async (req: NextApiRequest, res: NextApiResponse) => {
    await connectToDb();
    return handler(req, res);
  };
