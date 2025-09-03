const mongoose = require("mongoose");


const Venue=require('../Models/Venue')
const venues=require('../seed/venues')

const connectDB = () => {
    mongoose
      .connect(process.env.MONGO_URI)
      .then(async () => {
        console.log("✅ Connected to MongoDB");
        for (const venue of venues) {
          const exists = await Venue.findOne({ name: venue.name });
          if (!exists) await Venue.create(venue);
        }
      })
      .catch((err) => {
        console.error("❌ MongoDB connection error:", err);
      });
};


module.exports = connectDB;