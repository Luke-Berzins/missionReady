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

app.get('/api/branches/:branchCode', async (req, res) => {
  try {
    await client.connect();
    const db = client.db('artillery_training');
    
    const branchCode = req.params.branchCode;
    console.log('Fetching data for branch:', branchCode);

    // Get core courses for the branch
    const coreCourses = await db.collection('courses')
      .find({ 
        branch: branchCode,
        type: 'core'
      })
      .sort({ courseCode: 1 })
      .toArray();

    // Get specialty tracks for the branch
    const specialtyTracks = await db.collection('specialty_tracks')
      .find({ branch: branchCode })
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