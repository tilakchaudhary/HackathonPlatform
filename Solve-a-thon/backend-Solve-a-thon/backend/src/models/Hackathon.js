const mongoose = require("mongoose");

const HackathonSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },

  // Organizer who created this hackathon
  organizer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

  // New fields
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  judges: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],

  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Hackathon", HackathonSchema);
