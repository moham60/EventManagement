// routes/user.js
const express = require("express");
const router = express.Router();
const User = require("../Models/User");
const authMiddleware = require("../MiddleWare/auth");
const checkAdmin = require("../MiddleWare/checkAdmin");

// GET /api/users/locations
router.get("/locations", checkAdmin, async (req, res) => {
  try {
    const users = await User.find({}, "location");

    // رجع locations normalized (شيل spaces)
    const normalized = users
      .map((u) => u.location?.trim().replace(/\s*,\s*/g, ", ")) // Cairo,Egypt → Cairo, Egypt
      .filter(Boolean);

    // remove duplicates
    const uniqueLocations = [...new Set(normalized)];

    res.json({
      success: true,
      count: uniqueLocations.length,
      locations: uniqueLocations,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// GET user info by ID
router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.params.id) // find user info by id
      if (!user) {
        
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (err) {
      console.log(err);
    res.status(500).json({ message: err.message });
  }
});

// UPDATE user info

router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      gender,
      occupation,
      income,
      location,
      interests,
      age,
      
    } = req.body;

    const updateData = {
      name,
      email,
      gender,
      occupation,
      income,
      location,
      interests,
      age,
    };

    // لو المستخدم بعت password جديد
    if (password && password.trim() !== "") {
      const bcrypt = require("bcryptjs");
      const hashedPassword = await bcrypt.hash(password, 10);
      updateData.password = hashedPassword;
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


module.exports = router;
