const noteRoutes = require('./routes/notes');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const corsOptions = {
  origin: 'https://notestack-frontend-u4z4.onrender.com',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type'],
  credentials: true,
};



app.use(cors(corsOptions));

app.use(express.json());

const PORT = process.env.PORT || 5000;


mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected ✅'))
.catch(err => console.error('MongoDB connection error:', err));


app.get('/', (req, res) => {
  res.send('Welcome to NoteStack Backend!');
});
app.get('/api/test', (req, res) => {
  res.json({ message: 'Hello from backend!' });
});

app.use('/api/notes', noteRoutes);


app.listen(PORT, () => {
  console.log(`Server running on https://notestack-frontend-u4z4.onrender.com`);
});



