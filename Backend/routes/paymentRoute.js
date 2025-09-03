// routes/payment.js
const express = require("express");
const router = express.Router();
const Event = require("../Models/Event");

// الدفع للمقاعد المختارة
router.post("/:eventId", async (req, res) => {
  try {
    const { eventId } = req.params;
    const { seatIds } = req.body; // Array of seats

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    let newlyPaidSeats = 0;

    // تحديث حالة المقاعد
    event.seats = event.seats.map((seat) => {
      if (seatIds.includes(seat._id.toString()) && seat.status !== "paid") {
        newlyPaidSeats++;
        return { ...seat.toObject(), status: "paid" };
      }
      return seat;
    });

    // تحديث paidSeats بشكل تراكمي
    event.paidSeats = (event.paidSeats || 0) + newlyPaidSeats;

    await event.save();

    res.json({
      message: "Payment successful",
      event,
      paidSeats: seatIds,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Payment failed", error: error.message });
  }
});


module.exports = router;
