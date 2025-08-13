const express = require('express');
const path = require('path');
const cors = require('cors');
require('dotenv').config();

const sequelize = require('./config/playerDB');
const Song = require('./model/song');
const songsRouter = require('./routes/playerRouter');

const app = express();
app.use(cors({ 
  origin: /^http:\/\/localhost:\d+$/,
  credentials: true
}));
app.use(express.json());

// Logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path} - ${new Date().toISOString()}`);
  next();
});

// Serve static uploads for audio & images
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API
app.use('/api/songs', songsRouter);

// Health
app.get('/api/health', (_, res) => res.json({ ok: true }));

// Test database connection and table
app.get('/api/test-db', async (_, res) => {
  try {
    await sequelize.authenticate();
    const tableExists = await sequelize.getQueryInterface().showAllTables();
    const songCount = await Song.count();
    res.json({ 
      ok: true, 
      message: 'Database connected',
      tables: tableExists,
      songCount: songCount
    });
  } catch (error) {
    res.status(500).json({ 
      ok: false, 
      error: error.message 
    });
  }
});

// Reset database table (for development only)
app.post('/api/reset-db', async (_, res) => {
  try {
    await sequelize.sync({ force: true });
    res.json({ 
      ok: true, 
      message: 'Database table reset successfully',
      warning: 'All existing data has been deleted!'
    });
  } catch (error) {
    res.status(500).json({ 
      ok: false, 
      error: error.message 
    });
  }
});

// Start
(async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ force: true }); // Drop and recreate tables for dev
    const PORT = process.env.PORT || 2002;
    app.listen(PORT, () => console.log(`API on http://localhost:${PORT}`));
  } catch (e) {
    console.error('DB error:', e);
    process.exit(1);
  }
})();
