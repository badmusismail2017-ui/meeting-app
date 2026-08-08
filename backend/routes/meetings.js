// =====================================
// routes/meetings.js
// =====================================

const express = require("express");

const router = express.Router();

const {

    getMeetings,

    createMeeting,

    updateMeeting,

    deleteMeeting

} = require("../controllers/meetingController");

// =====================================
// ROUTES
// =====================================

router.get("/", getMeetings);

router.post("/", createMeeting);

router.put("/:id", updateMeeting);

router.delete("/:id", deleteMeeting);

module.exports = router;