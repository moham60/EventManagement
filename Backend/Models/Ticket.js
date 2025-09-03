const mongoose = require("mongoose");

const ticketSchema = new mongoose.Schema({
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Event",
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  seatNumber: {
    type: String,
    required: true,
  },
  qrCode: {
    type: String, // Base64 string or URL
  },
  status: {
    type: String,
    enum: ["booked", "cancelled", "checked-in"],
    default: "booked",
  },
  bookedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Ticket", ticketSchema);
