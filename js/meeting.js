// =====================================
// meeting.js
// Create & Edit Meeting
// =====================================
// =====================================
// API IMPORTS
// =====================================

import {

    fetchMeetings,

    createMeeting,

    updateMeeting

} from "./api.js";
// Check if user is logged in
const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

if (!loggedInUser) {
    window.location.href = "login.html";
}

// Form
const meetingForm = document.getElementById("meetingForm");

// Inputs
const titleInput = document.getElementById("title");
const descriptionInput = document.getElementById("description");
const dateInput = document.getElementById("date");
const timeInput = document.getElementById("time");

// Get meeting ID from URL
const params = new URLSearchParams(window.location.search);
const meetingId = params.get("id");

const cancelBtn = document.getElementById("cancelBtn");

// =====================================
// Load Meeting for Editing
// =====================================

async function loadMeeting() {

    if (!meetingId) return;

    try {

        const meetings = await fetchMeetings();

        const meeting = meetings.find(

            item => String(item.id) === String(meetingId)

        );

        if (!meeting) {

            alert("Meeting not found.");

            window.location.href = "dashboard.html";

            return;

        }

        titleInput.value = meeting.title;
        descriptionInput.value = meeting.description;
        dateInput.value = meeting.date;
        timeInput.value = meeting.time;

    }

    catch (error) {

        console.error(error);

        alert("Unable to load meeting.");

    }

}

loadMeeting();

if (cancelBtn) {

    cancelBtn.addEventListener("click", () => {

        window.location.href = "dashboard.html";

    });

}
// =====================================
// Submit Form
// =====================================

if (meetingForm) {

    meetingForm.addEventListener("submit", async function (e) {

        e.preventDefault();

        const meeting = {

            title: titleInput.value.trim(),

            description: descriptionInput.value.trim(),

            date: dateInput.value,

            time: timeInput.value,

            createdBy: loggedInUser.email

        };

        try {

            if (meetingId) {

                await updateMeeting(meetingId, meeting);

                alert("Meeting updated successfully!");

            }

            else {

                await createMeeting(meeting);

                alert("Meeting created successfully!");

            }

            window.location.href = "dashboard.html";

        }

        catch (error) {

            console.error(error);

            alert("Something went wrong.");

        }

    });

}