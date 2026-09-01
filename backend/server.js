// =====================================
// MeetAlarm Backend Server
// =====================================

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose"); // ADD THIS
require("dotenv").config(); // ADD THIS

const meetingRoutes = require("./routes/meetings"); // PICK THIS ONE FILE

const app = express();
const PORT = process.env.PORT || 5000;

// =====================================
// MIDDLEWARE
// =====================================
app.use(cors());
app.use(express.json());

// =====================================
// HOME ROUTE
// =====================================
app.get("/", (req, res) => {
    res.json({
        message: "MeetAlarm Backend Running Successfully"
    });
});

// =====================================
// API ROUTES - ONLY 1 TIME
// =====================================
app.use("/api/meetings", meetingRoutes);

// =====================================
// CONNECT TO MONGODB - ADD THIS
// =====================================
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log(err));

// =====================================
// START SERVER
// =====================================
app.listen(PORT, () => {
    console.log(`
========================================
 MeetAlarm Server Started
========================================
Server: http://localhost:${PORT}
API: http://localhost:${PORT}/api/meetings
========================================
`);
});