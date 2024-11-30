// server.js
const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');

const app = express();
app.use(cors());

// MongoDB connection URI and client
const uri = "mongodb://mongo:27017";
const client = new MongoClient(uri);

// Connect to MongoDB once at startup
let db;
client.connect()
  .then(() => {
    db = client.db('artillery_training'); // Updated database name
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
  });

// Basic health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Get all trades
app.get('/api/trades', async (req, res) => {
  try {
    const trades = await db.collection('trades').find({}).toArray();
    res.json(trades);
  } catch (error) {
    console.error('Error fetching trades:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get details for a specific trade
app.get('/api/trades/:tradeCode', async (req, res) => {
  try {
    const tradeCode = req.params.tradeCode;
    console.log('Fetching data for trade:', tradeCode);

    // Get trade details
    const trade = await db.collection('trades').findOne({ code: tradeCode });
    if (!trade) {
      return res.status(404).json({ error: 'Trade not found' });
    }

    // Get core courses for the trade
    const coreCourses = await db.collection('courses')
      .find({ 
        trade: tradeCode,
        type: 'core'
      })
      .toArray();

    // Get specialty tracks for the trade
    const specialtyTracks = await db.collection('specialty_tracks')
      .find({ trade: tradeCode })
      .toArray();

    console.log('Found courses:', coreCourses.length);
    console.log('Found specialty tracks:', specialtyTracks.length);

    res.json({
      trade,
      coreCourses,
      specialtyTracks
    });

  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: error.message });
  }
});

/** NEW ROUTES FOR RANKS **/

// Get all ranks
app.get('/api/ranks', async (req, res) => {
  try {
    const ranks = await db.collection('ranks').find({}).sort({ order: 1 }).toArray();
    res.json(ranks);
  } catch (error) {
    console.error('Error fetching ranks:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get details for a specific rank
app.get('/api/ranks/:rankName', async (req, res) => {
  try {
    const rankName = req.params.rankName;
    console.log('Fetching data for rank:', rankName);

    // Get rank details
    const rank = await db.collection('ranks').findOne({ rank: rankName });
    if (!rank) {
      return res.status(404).json({ error: 'Rank not found' });
    }

    res.json(rank);

  } catch (error) {
    console.error('Error fetching rank:', error);
    res.status(500).json({ error: error.message });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
