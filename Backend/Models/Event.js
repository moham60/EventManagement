const mongoose = require("mongoose");
const seatSchema = new mongoose.Schema({
  seatNumber: String,
  isBooked: { type: Boolean, default: false },
  bookedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null,
  },
  status: {
    type: String,
    enum: ["available", "reserved", "paid"],
    default: "available",
  },
});
const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  date: { type: Date, required: true },
  price: { type: String, required: true, default: "100" },
  starttime: { type: String, match: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/ },
  endtime: { type: String, match: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/ },
  venue: { type: mongoose.Schema.Types.ObjectId, ref: "Venue" },
  organizer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  // status field
  status: {
    type: String,
    enum: ["upcoming", "pending","closed"],
    default: "upcoming",
  },
  tickets: [{ type: mongoose.Schema.Types.ObjectId, ref: "Ticket" }],
  totalseats: {
    type: Number,
    required: true,
    default: 25,
  },
  bookedSeats: {
    type: Number,
    default: 0,
  },
  paidSeats: {
    type: Number,
    default: 0,
  },
  popularity: {
    type: String,
    enum: ["low", "medium", "high"],
    default: "low",
  },
  expectedAttends: {
    type: Number,
    default: 100,
  },
  tags: {
    type: String,
    default: function () {
      return this.title ? `#${this.title}` : null;
    },
  },
  seats: [seatSchema],

  createdAt: { type: Date, default: Date.now },
});


// Virtual لحساب عدد المقاعد المتاحة
eventSchema.virtual("availableSeats").get(function () {
  return this.totalseats - this.bookedSeats;
});

// نخلي الـ virtuals يظهروا في JSON
eventSchema.set("toJSON", { virtuals: true });
eventSchema.set("toObject", { virtuals: true });




module.exports = mongoose.model("Event", eventSchema);
