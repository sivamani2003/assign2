const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');
dotenv.config();

// Initialize app
const app = express();

// Middleware
app.use(express.json()); // To parse JSON in request body
const allowedOrigins = [
  "http://localhost:5173"
];

app.use(cors({
  origin: (origin, callback) => {
    if (allowedOrigins.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  }
}));

// Routes
app.use('/api/auth', authRoutes);


// MongoDB connection
mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.log(err));

// Start the server
const port = process.env.PORT || 5003;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
