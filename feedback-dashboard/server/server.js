const express = require('express');
//const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();
const feedbackRoutes = require('./routes/feedbackRoutes');

const app = express();

// Middleware
const cors = require('cors');
app.use(cors({
  origin: [
    'https://https://feedbackproject12.netlify.app/', // Your Netlify URL
    'https://feedback-rosy-tau.vercel.app', // Your Vercel URL
    'http://localhost:3000' // Local development
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Routes
app.use('/api/feedback', feedbackRoutes);

// Basic route
app.get('/', (req, res) => {
  res.send('Feedback Dashboard API is running');
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Connect to MongoDB
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

const PORT = process.env.PORT || 5000;

// Start server after DB connection
const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer();
