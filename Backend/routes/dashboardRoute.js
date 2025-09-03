// routes/dashboard.js
const express = require("express");
const router = express.Router();
const Event = require("../Models/Event");

router.get("/stats", async (req, res) => {
  try {
    const events = await Event.find();

    const totalEvents = events.length;
    const totalBookings = events.reduce((sum, e) => sum + e.bookedSeats, 0);

    // حساب الإيراد بناءً على كل المقاعد اللي status === "paid"
    const totalRevenue = events.reduce((sum, e) => {
      const paidSeatsCount = e.seats.filter(
        (seat) => seat.status === "paid"
      ).length;
      return sum + parseFloat(e.price) * paidSeatsCount;
    }, 0);

    res.json({
      totalEvents,
      totalBookings,
      totalRevenue,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;
