// routes/venueRoute.js
const express = require("express");
const Venue = require("../Models/Venue");

const router = express.Router();
const verifyToken = require("../MiddleWare/auth");

// Create Venue
router.post("/",verifyToken,async (req, res) => {
  try {
    const venue = new Venue(req.body);
    const savedVenue = await venue.save();
    res.status(201).json(savedVenue);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});
// Get all venues
router.get("/get",verifyToken, async (req, res) => {
  try {
    const venues = await Venue.find(); // ✅ استخدم await
    res.json(venues);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

//update venue
router.put("/updateNameVenue/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    const updatedVenue = await Venue.findByIdAndUpdate(
      id,
      { $set: { name: name } }, 
      { new: true, runValidators: true }
    );

    if (!updatedVenue) {
      return res.status(404).json({ message: "Venue not found" });
    }

    res.status(200).json({ message: "Venue updated", venue: updatedVenue });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating venue", error: error.message });
  }
});








module.exports= router;
