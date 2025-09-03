require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");
const authRoute = require("./routes/authRoute");
const eventRoute = require("./routes/eventsRoute");
const venueRoute = require("./routes/venueRoute");
const ticketRoute=require("./routes/ticketRoute");
const paymentRoute = require("./routes/paymentRoute");
const dashboardRoute=require("./routes/dashboardRoute");
const reportsRoute = require("./routes/reports");
const userRoute = require("./routes/userRoute");
const cors = require("cors");


const app = express();

// Middleware
app.use(express.json());

// Connect DB
connectDB();

// السماح لجميع الدومينات (للتجربة فقط)
app.use(cors());

//authRout
app.use("/api/auth", authRoute);

//eventRoute
app.use("/api/event", eventRoute);
//venueRoute
app.use("/api/venue", venueRoute);
//ticketRoute
app.use("/api/tickets", ticketRoute);
//paymentRoute
app.use("/api/pay", paymentRoute);
//dashboardRoute
app.use("/api/dashboard", dashboardRoute);
//reportsRoute
app.use("/api/reports", reportsRoute);
//userRoute
app.use("/api/user", userRoute);
/////
module.exports = app;

