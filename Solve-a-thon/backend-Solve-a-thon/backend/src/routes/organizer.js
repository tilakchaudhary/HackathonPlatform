const express = require("express");
const Hackathon = require("../models/Hackathon");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

// Middleware: only organizer
function requireOrganizer(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth?.startsWith("Bearer ")) return res.status(401).json({ message: "Unauthorized" });

  try {
    const token = auth.split(" ")[1];
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    if (payload.role !== "organizer") return res.status(403).json({ message: "Forbidden: Organizers only" });
    req.user = payload;
    next();
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }
}

// ✅ Create hackathon
router.post("/hackathons", requireOrganizer, async (req, res) => {
  try {
    const { title, description, startDate, endDate } = req.body;
    const hackathon = new Hackathon({
      title,
      description,
      startDate,
      endDate,
      organizer: req.user.id,   // set organizer automatically
    });
    await hackathon.save();
    res.json(hackathon);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});


// ✅ Get hackathons by organizer
router.get("/hackathons", requireOrganizer, async (req, res) => {
  try {
    const hacks = await Hackathon.find({ organizer: req.user.id });
    res.json(hacks);
  } catch {
    res.status(500).json({ message: "Server error" });
  }
});


// ✅ Assign participant
router.get("/users", requireOrganizer, async (req, res) => {
  try {
    const users = await User.find({ role: { $in: ["participant", "judge"] } })
      .select("name email role");
    res.json(users);
  } catch {
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Assign judge
router.post("/hackathons/:id/judges", requireOrganizer, async (req, res) => {
  try {
    const { userId } = req.body;
    const hackathon = await Hackathon.findByIdAndUpdate(
      req.params.id,
      { $addToSet: { judges: userId } },
      { new: true }
    ).populate("judges", "name email");
    res.json(hackathon);
  } catch {
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Edit hackathon
router.put("/hackathons/:id", requireOrganizer, async (req, res) => {
  try {
    const updated = await Hackathon.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Delete hackathon
router.delete("/hackathons/:id", requireOrganizer, async (req, res) => {
  try {
    await Hackathon.findByIdAndDelete(req.params.id);
    res.json({ message: "Hackathon deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});


module.exports = router;
