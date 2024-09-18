const mongoose = require('mongoose');

const dbURI = 'mongodb://127.0.0.1:27017/mobilePad'; 

const connectDB = async () => {
  try {
    await mongoose.connect(dbURI); 
    console.log('db connected!\n\n');
  } catch (err) {
    console.error('MongoDB connection error:', err);
  }
};

module.exports = connectDB;
