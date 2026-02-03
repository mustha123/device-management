const mongoose = require("mongoose");

const mongoURL = process.env.MONGO_URI;

const connectToMongo = async () => {
  try {
    console.log("Mongo URI:", mongoURL); // 🔥 ADD THIS
    await mongoose.connect(mongoURL);
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.log("Error connecting to MongoDB:", error);
  }
};

module.exports = connectToMongo;
