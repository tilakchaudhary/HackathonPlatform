// src/models/Hackathon.js
const mongoose = require('mongoose');

const HackathonSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, default: '' },
  startDate: { type: Date },
  endDate: { type: Date },
  status: {
    type: String,
    enum: ['Not Started','Ongoing','Completed'],
    default: 'Not Started'
  },
  logoUrl: { type: String, default: '' },
  rulesFileUrl: { type: String, default: '' },
  organizer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  judges: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  rounds: [{ type: String }],
}, { timestamps: true });

module.exports = mongoose.model('Hackathon', HackathonSchema);
