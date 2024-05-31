const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("MongoDB Connected");
  } catch (err) {
    console.log(err);
    console.log("Failed to Connect MongoDB");
    return;
  }
};

module.exports = { connectDB };
