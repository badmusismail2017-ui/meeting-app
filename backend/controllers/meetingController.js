// =====================================
// controllers/meetingController.js
// =====================================

const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "../database/meetings.json");

// =====================================
// READ DATABASE
// =====================================

function readMeetings() {

    const data = fs.readFileSync(filePath, "utf8");

    return JSON.parse(data);

}

// =====================================
// SAVE DATABASE
// =====================================

function saveMeetings(meetings) {

    fs.writeFileSync(
        filePath,
        JSON.stringify(meetings, null, 2)
    );

}

// =====================================
// GET ALL MEETINGS
// =====================================

exports.getMeetings = (req, res) => {

    try {

        const meetings = readMeetings();

        res.status(200).json(meetings);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Unable to retrieve meetings."
        });

    }

};

// =====================================
// CREATE MEETING
// =====================================

exports.createMeeting = (req, res) => {

    try {

        const meetings = readMeetings();

        if (!req.body || Object.keys(req.body).length === 0) {

            return res.status(400).json({
                success: false,
                message: "Meeting data is required."
            });

        }

        const newMeeting = {

            id: Date.now().toString(),

            ...req.body

        };

        meetings.push(newMeeting);

        saveMeetings(meetings);

        res.status(201).json({
            success: true,
            message: "Meeting created successfully.",
            meeting: newMeeting
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Unable to create meeting."
        });

    }

};

// =====================================
// UPDATE MEETING
// =====================================

exports.updateMeeting = (req, res) => {

    try {

        const meetings = readMeetings();

        const meetingIndex = meetings.findIndex(

            meeting => meeting.id === req.params.id

        );

        if (meetingIndex === -1) {

            return res.status(404).json({
                success: false,
                message: "Meeting not found."
            });

        }

        meetings[meetingIndex] = {

            ...meetings[meetingIndex],

            ...req.body

        };

        saveMeetings(meetings);

        res.status(200).json({
            success: true,
            message: "Meeting updated successfully.",
            meeting: meetings[meetingIndex]
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Unable to update meeting."
        });

    }

};

// =====================================
// DELETE MEETING
// =====================================

exports.deleteMeeting = (req, res) => {

    try {

        const meetings = readMeetings();

        const meetingIndex = meetings.findIndex(

            meeting => meeting._id === req.params.id

        );

        if (meetingIndex === -1) {

            return res.status(404).json({
                success: false,
                message: "Meeting not found."
            });

        }

        meetings.splice(meetingIndex, 1);

        saveMeetings(meetings);

        res.status(200).json({
            success: true,
            message: "Meeting deleted successfully."
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Unable to delete meeting."
        });

    }

};