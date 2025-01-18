const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("MongoDB is connected successfully.");
  } catch (err) {
    console.log(err);
  }
};

module.exports = connectDB;