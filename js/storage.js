// =====================================
// storage.js
// Handles localStorage operations
// =====================================

const STORAGE_KEY = "meetings";

/**
 * Get all meetings
 */
function getMeetings() {

    return JSON.parse(
        localStorage.getItem(STORAGE_KEY)
    ) || [];

}

/**
 * Save all meetings
 */
function saveMeetings(meetings) {

    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(meetings)
    );

}

/**
 * Add one meeting
 */
function addMeeting(meeting){

    const meetings = getMeetings();

    meetings.push(meeting);

    saveMeetings(meetings);

}

/**
 * Delete meeting
 */
function removeMeeting(id){

    const meetings = getMeetings().filter(meeting=>meeting.id!==id);

    saveMeetings(meetings);

}

/**
 * Find meeting
 */
function getMeeting(id){

    return getMeetings().find(meeting=>meeting.id===id);

}

/**
 * Update meeting
 */
function updateMeeting(updatedMeeting){

    const meetings = getMeetings().map(meeting=>{

        if(meeting.id===updatedMeeting.id){

            return updatedMeeting;

        }

        return meeting;

    });

    saveMeetings(meetings);

}