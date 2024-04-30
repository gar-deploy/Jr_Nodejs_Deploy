import mongoose from "mongoose";

const dbConnection = async () => {
  try {
    await mongoose.connect(process.env.MONGO_DB_URL); // Getting data from .env File
    console.log("Mongodb is connected");
  } catch (error) {
    console.log("Error to connect Mongo DB", error.message);
  }
};

export default dbConnection; 
