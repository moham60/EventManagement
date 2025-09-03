const mongoose=require('mongoose')

const venueSchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: { type: String},
  capacity: { type: Number },
  city: { type: String },
  country: { type: String},
});

module.exports= mongoose.model("Venue", venueSchema);
