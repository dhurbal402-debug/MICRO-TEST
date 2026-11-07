const express = require('express');
const mongoose = require('mongoose');
const Reading = require('../models/Reading');

const router = express.Router();

// Temporary in-memory storage keeps the API testable if MongoDB is not running.
const memoryReadings = [];

function isMongoConnected() {
  return mongoose.connection.readyState === 1;
}



// POST /api/readings
// JSON example: { "binId": "BIN-01", "distanceCm": 12.5, "fillLevel": 75 }
router.post('/', async (req, res) => {
  try {
    const { binId = 'BIN-01', distanceCm, fillLevel } = req.body;

    if (typeof distanceCm !== 'number' || typeof fillLevel !== 'number') {
      return res.status(400).json({
        success: false,
        message: 'distanceCm and fillLevel must be numbers.'
      });
    }

    if (distanceCm < 0 || fillLevel < 0 || fillLevel > 100) {
      return res.status(400).json({
        success: false,
        message: 'distanceCm must be >= 0 and fillLevel must be between 0 and 100.'
      });
    }

    const payload = { binId, distanceCm, fillLevel, createdAt: new Date() };

    if (isMongoConnected()) {
      const saved = await Reading.create(payload);
      return res.status(201).json({ success: true, storage: 'mongodb', data: saved });
    }

    memoryReadings.unshift(payload);
    if (memoryReadings.length > 500) memoryReadings.pop();

    return res.status(201).json({
      success: true,
      storage: 'memory',
      message: 'MongoDB is not connected; reading stored temporarily in memory.',
      data: payload
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/readings/latest
router.get('/latest', async (req, res) => {
  try {
    const { binId } = req.query;
    let data;

    if (isMongoConnected()) {
      const filter = binId ? { binId } : {};
      data = await Reading.findOne(filter).sort({ createdAt: -1}).lean();
    } else {
      data = memoryReadings.find(item => !binId || item.binId === binId) || null;
    }

    return res.json({ success: true, data });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/readings?limit=50&binId=BIN-01
router.get('/', async (req, res) => {
  try {
    const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 50, 1), 500);
    const { binId } = req.query;
    let data;

    if (isMongoConnected()) {
      const filter = binId ? { binId } : {};
      data = await Reading.find(filter).sort({ createdAt: -1 }).limit(limit).lean();
    } else {
      data = memoryReadings.filter(item => !binId || item.binId === binId).slice(0, limit);
    }

    return res.json({ success: true, count: data.length, data });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});




module.exports = router;
