// =====================================
// api.js
// MeetAlarm API Service
// =====================================

const API_URL = "https://meeting-backend-ixzg.onrender.com/meetings";

// =====================================
// GET ALL MEETINGS
// =====================================

export async function fetchMeetings() {

    const response = await fetch(API_URL);

    if (!response.ok) {

        throw new Error("Failed to fetch meetings.");

    }

    return await response.json();

}

// =====================================
// CREATE MEETING
// =====================================

export async function createMeeting(meeting) {

    const response = await fetch(API_URL, {

        method: "POST",

        headers: {

            "Content-Type": "application/json"

        },

        body: JSON.stringify(meeting)

    });

    if (!response.ok) {

        throw new Error("Failed to create meeting.");

    }

    return await response.json();

}

// =====================================
// UPDATE MEETING
// =====================================

export async function updateMeeting(id, meeting) {

    const response = await fetch(`${API_URL}/${id}`, {

        method: "PUT",

        headers: {

            "Content-Type": "application/json"

        },

        body: JSON.stringify(meeting)

    });

    if (!response.ok) {

        throw new Error("Failed to update meeting.");

    }

    return await response.json();

}

// =====================================
// DELETE MEETING
// =====================================

export async function deleteMeeting(id) {

    const response = await fetch(`${API_URL}/${id}`, {

        method: "DELETE"

    });

    if (!response.ok) {

        throw new Error("Failed to delete meeting.");

    }

    return await response.json();

}