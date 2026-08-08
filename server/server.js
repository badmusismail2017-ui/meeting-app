// =====================================
// server.js
// MeetAlarm Backend
// =====================================

const express = require("express");
const cors = require("cors");

const meetingRoutes = require("../backend/routes/meetings");

const app = express();

app.use(cors());

app.use(express.json());

app.use("/api/meetings", meetingRoutes);

const PORT = 5000;

app.listen(PORT, () => {

    console.log(`Server running on port ${PORT}`);

});