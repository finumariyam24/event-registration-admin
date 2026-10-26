require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const Event = require("./models/Event");

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:5173" }));
app.use(express.json());

app.get("/api/events", async (req, res) => {
  try {
    const events = await Event.find().sort({ eventDate: 1 });
    res.json(events);
  } catch (error) {
    console.error("GET /api/events failed:", error);
    res.status(500).json({ message: "Could not load events." });
  }
});

app.post("/api/events", async (req, res) => {
  try {
    const event = await Event.create(req.body);
    res.status(201).json(event);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.put("/api/events/:id", async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!event) return res.status(404).json({ message: "Event not found." });
    res.json(event);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.delete("/api/events/:id", async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);

    if (!event) return res.status(404).json({ message: "Event not found." });
    res.json({ message: "Event deleted." });
  } catch (error) {
    res.status(400).json({ message: "Could not delete event." });
  }
});
app.get("/api/events/:id", async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) return res.status(404).json({ message: "Event not found." });
    res.json(event);
  } catch (error) {
    res.status(400).json({ message: "Invalid event ID." });
  }
});

app.post("/api/events/:id/registrations", async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) return res.status(404).json({ message: "Event not found." });

    event.registrations.push({
      attendeeName: req.body.attendeeName,
      attendeeEmail: req.body.attendeeEmail,
    });

    await event.save();
    res.status(201).json(event);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB Atlas");
    app.listen(PORT, () => console.log(`API running on port ${PORT}`));
  })
  .catch((error) => {
    console.error("MongoDB connection failed:", error.message);
  });
