const mongoose = require('mongoose');

const readingSchema = new mongoose.Schema({
  binId: { type: String, required: true, trim: true },
  distanceCm: { type: Number, required: true, min: 0 },
  fillLevel: { type: Number, required: true, min: 0, max: 100 },
  createdAt: { type: Date, default: Date.now }
}, { versionKey: false });

module.exports = mongoose.model('Reading', readingSchema);
