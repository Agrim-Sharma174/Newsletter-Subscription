const mongoose = require('mongoose');
require('dotenv').config();

const connectToDatabase = async () => {
  const dbURI = process.env.MONGODB_URI;

  try {
    await mongoose.connect(dbURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected successfully');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  }
};

module.exports = connectToDatabase;
