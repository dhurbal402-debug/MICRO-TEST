require('dotenv').config();

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const readingsRouter = require('./routes/readings');
const dns =require("dns");
dns.setServers(['8.8.8.8','1.1.1.1']);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({
    message: 'Smart Waste Bin Data Server is running',
    endpoints: {
      health: 'GET /api/health',
      createReading: 'POST /api/readings',
      latestReading: 'GET /api/readings/latest',
      allReadings: 'GET /api/readings'
    }
  });
});

app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    server: 'running',
    database: mongoose.connection.readyState === 1 ? 'connected' : 'not connected (temporary memory mode)'
  });
});

app.use('/api/readings', readingsRouter);

async function startServer() {
  const mongoUri = process.env.MONGODB_URI;

  if (mongoUri) {
    try {
      await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 4000 });
      console.log('MongoDB connected successfully.');
    } catch (error) {
      console.log('MongoDB connection unavailable. Starting in temporary memory mode.');
      console.log('MongoDB detail:', error.message);
    }
  } else {
    console.log('MONGODB_URI not set. Starting in temporary memory mode.');
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Smart Waste Bin server running at http://localhost:${PORT}`);
    console.log(`Health check: http://localhost:${PORT}/api/health`);
  });
}

startServer();
