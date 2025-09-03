const express = require("express");
const router = express.Router();
const User = require("../Models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
router.post("/register", async(req, res) => {
    try {
      const {
        name,
        email,
        password,
        gender,
        age,
        location,
        income,
        occupation,
        interests,
      } = req.body;
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ msg: " User already exists" });
      }
      // 1- Basic validation
      if (!name || !email || !password) {
        return res
          .status(400)
          .json({ msg: "⚠️ Please enter all required fields" });
      }
      if (password.length < 6) {
        return res
          .status(400)
          .json({ msg: "⚠️ Password must be at least 6 characters" });
      }

      // 3- Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      // 4- Create new user
      const newUser = new User({
        name,
        email,
        password: hashedPassword,
        role: "user",
        gender,
        age,
        location,
        income,
        occupation,
        interests,
      });
      await newUser.save();
      // 5- Generate JWT token
      const token = jwt.sign(
        { id: newUser._id, role:newUser.role },
        process.env.JWT_SECRET ,
        
        );
        res.status(201).json({
          msg: "User registered successfully",
          token,
          user: {
            id: newUser._id,
            name: newUser.name,
            email: newUser.email,
            role: newUser.role,
            gender,
            age,
            location,
            income,
            occupation,
            interests,
          },
        });
    }
    catch (error) {
        console.error("❌ Error in /register:", error);
        res.status(500).json({ msg: "Server Error" });
    }
})





router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ msg: "⚠️ Please enter all required fields" });
    }

    // تحقق من وجود المستخدم
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: "❌ User not found" });
    }

    // تحقق الباسورد
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "❌ Invalid Passowrd" });
    }

    // توليد JWT
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
    
    );

    res.status(200).json({
      msg: "✅ Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        gender:user.gender,
        age:user.age,
        location:user.location,
        income:user.income,
        occupation:user.occupation,
        interests:user.interests,
      },
    });
    console.log("Signing with:", process.env.JWT_SECRET);

  } catch (error) {
    console.error("❌ Error in /login:", error);
    res.status(500).json({ msg: "Server Error" });
  }
});





//create admin
router.post("/create-admin", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password)
      return res.status(400).json({ msg: "All fields required" });

    // تحقق من وجود المستخدم
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ msg: "User already exists" });

    // تشفير الباسورد
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // إنشاء الادمن
    const newAdmin = new User({
      name,
      email,
      password: hashedPassword,
      role: "admin", // ثابت
    });

    await newAdmin.save();

    res.status(201).json({ msg: "Admin created successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server Error" });
  }
});

module.exports = router;