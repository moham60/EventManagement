const express = require("express");
const router = express.Router();
const Ticket = require("../Models/Ticket");
const Event = require("../Models/Event");
const QRCode = require("qrcode");


// GET all tickets
router.get("/", async (req, res) => {
  try {
    const tickets = await Ticket.find()
      .populate("event", "title date bookedSeats totalseats") // include event info
      .populate("user", "name email"); // include user info
    res.json(tickets);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
})
// GET tickets for specific user
router.get("/user/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const tickets = await Ticket.find({ user: userId })
      .populate("event", "title date bookedSeats totalseats")
      .populate("user", "name email");

    if (!tickets || tickets.length === 0) {
      return res.status(404).json({ message: "No tickets found for this user" });
    }

    res.json(tickets);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});


// POST  book-multiple ticket or multiple seats
router.post("/book-multiple", async (req, res) => {
  try {
      console.log("Body received:", req.body);
      const { eventId, seatIds, userId } = req.body;
      const event = await Event.findById(eventId);
      if (!event) return res.status(404).json({ message: "Event not found" });

    const bookedSeats = [];
    const failedSeats = [];

    for (let seatId of seatIds) {
      const seat = event.seats.id(seatId);

      if (seat && seat.status === "available") {
        seat.status = "reserved";
        seat.bookedBy = userId;
        seat.isBooked = true;
        bookedSeats.push(seat);
        event.bookedSeats = event.seats.filter(
          (seat) => seat.status === "reserved" || seat.status === "paid"
        ).length;

        const ticketData = JSON.stringify({
          eventId,
          userId,
          seatNumber: seat.seatNumber,
        });
        const qrCode = await QRCode.toDataURL(ticketData);

        const ticket = new Ticket({
          event: eventId,
          user: userId,
          seatNumber: seat.seatNumber,
          qrCode,
        });

        await ticket.save();
        event.tickets.push(ticket._id);
      } else {
        failedSeats.push(seatId);
      }
      //  بعد ما نحجز المقاعد، نشوف لو كلها محجوزة
      const allBooked = event.seats.every((s) => s.isBooked === true);
      if (allBooked) {
        event.status = "closed";
      }
    }
  
   
    await event.save();
    res.json({
      bookedSeats: bookedSeats,
      failedSeats,
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// cancel seat reservation
router.put("/:eventId/seats/:seatId/cancel", async (req, res) => {
  try {
    const { eventId, seatId } = req.params;
    const { userId, role } = req.body; // لازم تبعت role كمان (admin or user)

    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ msg: "Event not found" });

    const seat = event.seats.id(seatId);
    if (!seat) return res.status(404).json({ msg: "Seat not found" });

    //  لو المستخدم مش Admin ولا هو صاحب المقعد → يرجع Forbidden
    if (role !== "admin" && seat.bookedBy.toString() !== userId) {
      return res
        .status(403)
        .json({ msg: "You are not allowed to cancel this seat" });
    }

    if (seat.status !== "reserved") {
      return res.status(400).json({ msg: "Seat is not reserved" });
    }

    // إلغاء المقعد
    seat.status = "available";
    seat.bookedBy = null;
    seat.isBooked = false;

    event.bookedSeats = event.seats.filter(
      (s) => s.status === "reserved" || s.status === "paid"
    ).length;

    await event.save();

    // حذف التذكرة
    await Ticket.findOneAndDelete({
      event: eventId,
      user: userId,
      seatNumber: seat.seatNumber,
    });

    res.json({
      success: true,
      msg: "Booking cancelled & ticket deleted",
      bookedSeats: event.bookedSeats,
      availableSeats: event.totalseats - event.bookedSeats,
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: err.message });
  }
});


//delete ticket for the deleted event
router.delete("/cleanup", async (req, res) => {
  try {
    const result = await Ticket.deleteMany({ event: null });
    res.status(200).json({
      message: "Deleted all tickets with null event",
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    res.status(500).json({ message: "Error deleting tickets", error });
  }
});
module.exports = router;
