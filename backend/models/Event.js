const mongoose = require("mongoose");

const registrationSchema = new mongoose.Schema({
  attendeeName: { type: String, required: true, trim: true },
  attendeeEmail: { type: String, required: true, trim: true },
  registeredAt: { type: Date, default: Date.now },
});

const eventSchema = new mongoose.Schema(
  {
    eventName: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    eventDate: { type: Date, required: true },
    venue: { type: String, required: true, trim: true },
    registrations: [registrationSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Event", eventSchema);