const mongoose=require("mongoose")
const express = require("express");
const router = express.Router();
const Event = require("../Models/Event");
const checkAdmin = require("../MiddleWare/checkAdmin"); 


// Get all events
router.get("/", async (req, res) => {
  try {
    const events = await Event.find(); // يجيب كل الـ events من الـ DB
    
    res.status(200).json({
      success: true,
      count: events.length,
      events,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: err.message,
    });
  }
});
//  Create Event (Admin only)
router.post("/", checkAdmin, async (req, res) => {
  try {
    const { totalseats } = req.body;
     const seats = Array.from({ length: totalseats }, (_, i) => ({
       seatNumber: `S${i + 1}`,
     }));
    const event = new Event({
      ...req.body,
      organizer: req.user.id,
      seats
    });

    await event.save();
    res.status(201).json(event);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


//Get Event Details By Id
router.get("/:id", async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate("venue", "name address city country")
      .populate("organizer");
    if (!event) return res.status(404).json({ message: "Event not found" });

    res.status(200).json(event);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error });
  }
});

//Update Event By Id
router.put("/edit/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid event id" });
    }
   const allowed = [
     "title",
     "description",
     "date",
     "price",
     "totalseats",
     "availableSeats",
     "tags",
     "expectedAttends",
     "popularity",
     "starttime",
     
   ];
    const updates = {};
    for (const key of allowed) {
      if (key in req.body) updates[key] = req.body[key];
    }
    const updated = await Event.findByIdAndUpdate(
      id,
      { $set: updates },
      {
        new: true,
        runValidators: true,
        context: "query",
      }
    );
    return res.status(200).json({
      message: "Event Updated Successfully",
      event: updated,
    });
  } catch (err) {
    console.error("❌ Update Event Error:", err);


    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
});


//deleteEvent
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid event id" });
    }
    const deleted = await Event.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: "Event not found" });
    }
    return res.json({ message: "Event deleted", event: deleted });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
});




// GET /api/events/:eventId/seats  => Get all seats for a specific event
router.get("/:eventId/seats", async (req, res) => {
  try {
    const { eventId } = req.params;

    // ابحث عن الحدث
    const event = await Event.findById(eventId);
    console.log(event);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    res.json({
      success: true,
      eventId: event._id,
      eventTitle: event.title,
      totalSeats: event.totalseats || 0,
      bookedSeats: event.bookedSeats || 0,
      seats: event.seats || [],
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: "Server error: " + err.message,
    });
  }
});


// PUT /api/event/seats/:seatId  change status of seat 
router.put("/:eventId/seats/:seatId", async (req, res) => {
  try {
    const { seatId, eventId } = req.params;
    const { status } = req.body;
    //sure that event is found
     const event = await Event.findById(eventId);
     if (!event) {
       return res.status(404).json({ message: "Event not found" });
    }
    //search for seat
     const seat = event.seats.id(seatId);
     if (!seat) {
       return res.status(404).json({ message: "Seat not found" });
    }
    //update status of seat
    seat.status = status;
        await event.save();

  } catch (err) {
    console.log(err);
        res.status(500).json({ message: "Server error", error: error.message });

  }
});


//  Get location stats of paid users for a specific event
router.get("/:eventId/attendees/locations", async (req, res) => {
  try {
    const { eventId } = req.params;

    // هات الـ Event ومعاه الـ seats.bookedBy = User
    const event = await Event.findById(eventId).populate("seats.bookedBy", "location");

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // فلترة المقاعد paid بس
    const paidSeats = event.seats.filter((seat) => seat.status === "paid" && seat.bookedBy);

    // عد المواقع
    const locationCounts = {};
    paidSeats.forEach((seat) => {
      const loc = seat.bookedBy.location || "Unknown";
      locationCounts[loc] = (locationCounts[loc] || 0) + 1;
    });

    // حولها لـ format ينفع للـ Chart
    const chartData = Object.entries(locationCounts).map(([location, count]) => ({
      x: location,
      y: count,
    }));

    res.json({
      success: true,
      totalPaidUsers: paidSeats.length,
      data: chartData,
    });
  } catch (err) {
    console.error("❌ Error getting paid user locations:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

//  Get age groups of paid attendees for a specific event
router.get("/:eventId/attendees/age-groups", async (req, res) => {
  try {
    const { eventId } = req.params;

    // هات الـ Event ومعاه اليوزرز اللي حاجزين المقاعد
    const event = await Event.findById(eventId).populate("seats.bookedBy", "age");

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // فلترة المقاعد paid فقط
    const paidSeats = event.seats.filter((seat) => seat.status === "paid" && seat.bookedBy);

    // تصنيف الأعمار (groups)
    const ageGroups = {
      "Under 18": 0,
      "18-25": 0,
      "26-35": 0,
      "36-50": 0,
      "48+": 0,
    };

    paidSeats.forEach((seat) => {
      const age = seat.bookedBy.age || 0;

      if (age < 18) ageGroups["Under 18"]++;
      else if (age >= 18 && age <= 25) ageGroups["18-25"]++;
      else if (age >= 26 && age <= 35) ageGroups["26-35"]++;
      else if (age >= 36 && age <= 50) ageGroups["36-50"]++;
      else ageGroups["48+"]++;
    });

    // تحويلها لـ format ينفع للـ Chart
    const chartData = Object.entries(ageGroups).map(([group, count]) => ({
      x: group,
      y: count,
    }));

    res.json({
      success: true,
      totalPaidUsers: paidSeats.length,
      data: chartData,
    });
  } catch (err) {
    console.log(err)
    console.error("❌ Error getting paid user age groups:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// GET attendees interests for a specific event
router.get("/:eventId/attendees/interests", async (req, res) => {
  try {
    const { eventId } = req.params;

    // نجيب الـ event بالـ tickets أو الـ seats مع اليوزر
    const event = await Event.findById(eventId).populate({
      path: "tickets",
      populate: { path: "user", select: "interests" }
    });

    if (!event) return res.status(404).json({ success: false, message: "Event not found" });

    // نجمع كل الـ interests
    let allInterests = [];
    event.tickets.forEach(ticket => {
      if (ticket.user && Array.isArray(ticket.user.interests)) {
        allInterests.push(...ticket.user.interests);
      }
    });

    // نعد تكرار كل interest
    const counts = allInterests.reduce((acc, interest) => {
      acc[interest] = (acc[interest] || 0) + 1;
      return acc;
    }, {});

    // نرجعهم في شكل مناسب للـ chart
    const chartData = Object.entries(counts).map(([interest, count]) => ({
      x: interest,
      y: count
    }));

    res.json({ success: true, data: chartData });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
});

module.exports = router;