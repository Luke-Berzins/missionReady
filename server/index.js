// server.js
const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());


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

    // Get all courses for the trade
    const courses = await db.collection('courses')
      .find({ trade: tradeCode })
      .toArray();

    // Separate core courses and track courses
    const coreCourses = courses.filter(course => course.type === 'core');
    const trackCourses = courses.filter(course => course.type !== 'core');

    // Get unique track types
    const trackTypes = [...new Set(trackCourses.map(course => course.type))];

    // Build specialty tracks data
    const specialtyTracks = trackTypes.map(type => {
      const trackCoursesOfType = trackCourses.filter(course => course.type === type);
      const { color, description } = trackCoursesOfType[0]; // Assuming color and description are the same for all courses in a track
      return {
        code: type,
        name: trackCoursesOfType[0].name.split(' I')[0], // Extract base name
        description,
        color,
        courses: trackCoursesOfType,
        minimumRank: trackCoursesOfType[0].rank
      };
    });

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

app.post('/api/node-click', async (req, res) => {
  const { courseCode } = req.body;
  console.log('Course code received:', courseCode);

  try {
    // Fetch sessions for the given courseCode
    const sessions = await db.collection('course_sessions')
      .find({ courseCode })
      .toArray();

    res.json({ sessions });
  } catch (error) {
    console.error('Error fetching sessions:', error);
    res.status(500).json({ error: error.message });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
