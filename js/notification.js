// =====================================
// notification.js
// MeetAlarm Notification Engine
// =====================================

import { fetchMeetings } from "./api.js";

// =====================================
// VARIABLES
// =====================================

const remindedMeetings = new Set();

const activeMeetings = new Set();

let alarmAudio = null;

let currentMeeting = null;

// Modal Elements

let reminderModal = null;

let reminderTitle = null;

let reminderMessage = null;

let joinMeetingBtn = null;

let snoozeMeetingBtn = null;

let stopAlarmBtn = null;

// =====================================
// INITIALIZE NOTIFICATIONS
// =====================================

export async function initNotifications() {

    if (!("Notification" in window)) {

        console.warn(

            "Browser notifications are not supported."

        );

        return;

    }

    if (Notification.permission === "default") {

        try {

            await Notification.requestPermission();

        }

        catch (error) {

            console.warn(

                "Unable to request notification permission."

            );

        }

    }

    // Alarm Sound

    alarmAudio = new Audio(

        "./assets/audio/alarm.mp3"

    );

    alarmAudio.loop = true;

    // Reminder Modal

    reminderModal = document.getElementById(

        "reminderModal"

    );

    reminderTitle = document.getElementById(

        "reminderTitle"

    );

    reminderMessage = document.getElementById(

        "reminderMessage"

    );

    joinMeetingBtn = document.getElementById(

        "joinMeetingBtn"

    );

    snoozeMeetingBtn = document.getElementById(

        "snoozeMeetingBtn"

    );

    stopAlarmBtn = document.getElementById(

        "stopAlarmBtn"

    );

    // =====================================
// BUTTON EVENTS
// =====================================

    if (joinMeetingBtn) {

        joinMeetingBtn.addEventListener(

            "click",

            joinMeeting

        );

    }

    if (snoozeMeetingBtn) {

        snoozeMeetingBtn.addEventListener(

            "click",

            snoozeMeeting

        );

    }

    if (stopAlarmBtn) {

        stopAlarmBtn.addEventListener(

            "click",

            stopAlarm

        );

    }

    startReminderEngine();

    console.log(

        "Notification engine started..."

    );

}

// =====================================
// START REMINDER ENGINE
// =====================================

function startReminderEngine() {

    checkMeetings();

    setInterval(checkMeetings, 15000);

    console.log(

        "Reminder engine running..."

    );

}

// =====================================
// CHECK MEETINGS
// =====================================

async function checkMeetings() {

    try {

        const meetings = await fetchMeetings();

        const now = new Date();

        meetings.forEach(meeting => {

            const meetingTime = new Date(

                `${meeting.date}T${meeting.time}:00`

            );

            const difference = meetingTime - now;

            const fiveMinutes = 5 * 60 * 1000;

            // ---------------------------------
            // 5-Minute Browser Notification
            // ---------------------------------

            if (

                difference <= fiveMinutes &&

                difference > 0 &&

                !remindedMeetings.has(meeting.id)

            ) {

                remindedMeetings.add(meeting.id);

                showNotification(meeting);

            }

            // ---------------------------------
            // Exact Meeting Time Popup
            // ---------------------------------

            if (

                difference <= 0 &&

                difference > -15000 &&

                !activeMeetings.has(meeting.id)

            ) {

                activeMeetings.add(meeting.id);

                currentMeeting = meeting;

                showReminderModal(meeting);

                playAlarm();

            }

        });

    }

    catch (error) {

        console.error(

            "Notification Error:",

            error

        );

    }

    console.log(

        "Checking meetings..."

    );

}

// =====================================
// SHOW BROWSER NOTIFICATION
// =====================================

function showNotification(meeting) {

    if (Notification.permission !== "granted") {

        return;

    }

    new Notification(

        "🔔 MeetAlarm Reminder",

        {

            body: `${meeting.title} starts in less than 5 minutes.`,

            icon: "./assets/images/logo.png",

            badge: "./assets/images/logo.png"

        }

    );

}

// =====================================
// SHOW REMINDER MODAL
// =====================================

function showReminderModal(meeting) {

    if (!reminderModal) return;

    currentMeeting = meeting;

    reminderTitle.textContent = meeting.title;

    reminderMessage.innerHTML = `

Your meeting <strong>${meeting.title}</strong> is starting now.<br><br>

<strong>Date:</strong> ${meeting.date}<br>

<strong>Time:</strong> ${meeting.time}

`;

    reminderModal.classList.add("active");

}

// =====================================
// PLAY ALARM
// =====================================

function playAlarm() {

    if (!alarmAudio) return;

    alarmAudio.currentTime = 0;

    alarmAudio.play().catch(error => {

        console.error(

            "Unable to play alarm:",

            error

        );

    });

}

// =====================================
// STOP ALARM
// =====================================

function stopAlarm() {

    if (alarmAudio) {

        alarmAudio.pause();

        alarmAudio.currentTime = 0;

    }

    hideReminderModal();

    currentMeeting = null;

}

// =====================================
// SNOOZE MEETING
// =====================================

function snoozeMeeting() {

    if (!currentMeeting) return;

    // Close the reminder and stop the alarm.
    // A persistent backend snooze will be added later.

    activeMeetings.delete(

        currentMeeting.id

    );

    stopAlarm();

}

// =====================================
// JOIN MEETING
// =====================================

function joinMeeting() {

    if (

        currentMeeting &&

        currentMeeting.link

    ) {

        window.open(

            currentMeeting.link,

            "_blank"

        );

    }

    stopAlarm();

}

// =====================================
// HIDE REMINDER MODAL
// =====================================

function hideReminderModal() {

    if (reminderModal) {

        reminderModal.classList.remove(

            "active"

        );

    }

}