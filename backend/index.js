const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const noteRoutes = require('./routes/noteRoutes');
const path = require('path');

const app = express();

// Middleware
const corsOptions = {
  origin: 'https://notestack-frontend-u4z4.onrender.com',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type'],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ Connected to MongoDB'))
.catch((err) => console.error('❌ MongoDB connection error:', err));

// Routes
app.use('/api/notes', noteRoutes);
app.get('/api/test', (req, res) => {
  res.json({ message: 'Hello from backend!' });
});

// Serve static React build
app.use(express.static(path.resolve(__dirname, 'build')));

// Catch-all for React routing
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'build', 'index.html'));
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on https://notestack-frontend-u4z4.onrender.com`);
});
