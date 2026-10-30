// src/backend/server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

const MONGO_URI = process.env.MONGO_URL || process.env.MONGO_URI || 'mongodb://mongodb:27017/threetierdb';

mongoose.connect(MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

const ItemSchema = new mongoose.Schema({ name: String, createdAt: { type: Date, default: Date.now } });
const Item = mongoose.model('Item', ItemSchema);

app.get(['/health', '/api/health', '/healthz'], (req, res) => res.status(200).json({ status: 'healthy', database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected' }));

app.get(['/items', '/api/items'], async (req, res) => {
  try {
    const items = await Item.find().sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post(['/items', '/api/items'], async (req, res) => {
  try {
    const newItem = new Item({ name: req.body.name });
    await newItem.save();
    res.status(201).json(newItem);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
