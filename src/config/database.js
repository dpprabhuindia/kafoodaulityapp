const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // MongoDB connection string - you can replace this with your actual MongoDB URI
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/food-transparency-portal';
    
    const conn = await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error('Database connection error:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
