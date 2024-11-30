const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');

const app = express();
app.use(cors());

const uri = "mongodb://mongo:27017";
const client = new MongoClient(uri);

// Basic health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.get('/api/trades/:tradeCode', async (req, res) => {
  try {
    await client.connect();
    const db = client.db('career_paths');
    
    const tradeCode = req.params.tradeCode;
    console.log('Fetching data for trade:', tradeCode);

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
      coreCourses,
      specialtyTracks
    });

  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: error.message });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});