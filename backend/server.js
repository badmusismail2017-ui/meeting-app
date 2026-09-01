// =====================================
// MeetAlarm Backend Server
// =====================================

const express = require("express");

const cors = require("cors");

const meetingRoutes = require("./routes/meetings");

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
// API ROUTES
// =====================================

app.use("/api/meetings", meetingRoutes);

// =====================================
// START SERVER
// =====================================

app.listen(PORT, () => {

    console.log(`

========================================
 MeetAlarm Server Started
========================================

Server:
http://localhost:${PORT}

API:
http://localhost:${PORT}/api/meetings

========================================

`);

});