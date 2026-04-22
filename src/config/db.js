const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Customer DB connected");
  } catch (err) {
    console.error("Customer DB connection error:", err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
