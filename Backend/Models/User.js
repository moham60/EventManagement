  const mongoose = require("mongoose");

  const userSchema = mongoose.Schema(
    {
      name: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 50,
      },
      email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
      },
      password: {
        type: String,
        required: true,
        minlength: 6,
      },
      role: {
        type: String,
        enum: ["user", "admin"],
        default: "user",
      },
      gender: { type: String, enum: ["Male", "Female", "Other"],default:"Male" },
      occupation: { type: String ,default:"Software Engineer"},
      age:{type:Number,default:20},
      location: { type: String,default:"Cairo,Egypt" },
      income: { type: Number,default:2000 }, // optional
      // 🆕 Interests
      interests: {
        type: [String], // Array of strings
        default: [],
      },
      tickets: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Ticket",
        },
      ],
    
    },
    { timestamps: true } // بيضيف createdAt & updatedAt أوتوماتيك
  );

  const User = mongoose.model("User",userSchema);
  module.exports = User;