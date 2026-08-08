// =====================================
// utils.js
// Shared utility functions
// =====================================

/**
 * Generate unique ID
 */
function generateId() {
    return Date.now();
}

/**
 * Format date
 * Example:
 * 2026-06-30
 * →
 * Jun 30, 2026
 */
function formatDate(dateString) {

    const options = {
        year: "numeric",
        month: "short",
        day: "numeric"
    };

    return new Date(dateString)
        .toLocaleDateString("en-US", options);

}

/**
 * Format Time
 * 13:30
 * →
 * 1:30 PM
 */
function formatTime(timeString){

    const [hour, minute] = timeString.split(":");

    const date = new Date();

    date.setHours(hour);

    date.setMinutes(minute);

    return date.toLocaleTimeString([],{
        hour:"numeric",
        minute:"2-digit"
    });

}

/**
 * Countdown
 */
function getCountdown(date,time){

    const target = new Date(date+"T"+time);

    const now = new Date();

    const diff = target-now;

    if(diff<=0){

        return "Completed";

    }

    const days=Math.floor(diff/(1000*60*60*24));

    const hours=Math.floor(

        (diff%(1000*60*60*24))
        /(1000*60*60)

    );

    const minutes=Math.floor(

        (diff%(1000*60*60))
        /(1000*60)

    );

    return `${days}d ${hours}h ${minutes}m`;

}

/**
 * Meeting Status
 */

function getMeetingStatus(date,time){

    const meeting = new Date(date+"T"+time);

    const now = new Date();

    const difference = meeting-now;

    if(difference<=0){

        return "Completed";

    }

    if(difference<=1000*60*30){

        return "Starting Soon";

    }

    return "Upcoming";

}

/**
 * Sort Meetings
 */

function sortMeetings(meetings){

    return meetings.sort((a,b)=>{

        return new Date(a.date+"T"+a.time)
            -
            new Date(b.date+"T"+b.time);

    });

}