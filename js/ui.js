// ===========================================
// ui.js
// Handles all Dashboard UI rendering
// ===========================================

import {
    formatDate,
    formatTime,
    getCountdown,
    getMeetingStatus
} from "./utils.js";


// Render all meetings
export function renderMeetings(meetings) {

    const meetingContainer = document.querySelector("#meetingContainer");

    if (!meetingContainer) return;

    meetingContainer.innerHTML = "";

    if (meetings.length === 0) {

        meetingContainer.innerHTML = `
            <div class="empty-state">
                <h3>No Meetings Yet</h3>
                <p>Create your first meeting.</p>
            </div>
        `;

        return;
    }

    meetings.forEach(meeting => {

        const card = createMeetingCard(meeting);

        meetingContainer.appendChild(card);

    });

}


// Create one meeting card
function createMeetingCard(meeting) {

    const card = document.createElement("div");

    card.className = "meeting-card";

    card.dataset.id = meeting.id;

    const status = getMeetingStatus(meeting.date);

    card.innerHTML = `
    
        <div class="meeting-top">

            <h3>${meeting.title}</h3>

            <span class="status ${status.toLowerCase()}">
                ${status}
            </span>

        </div>

        <p class="meeting-description">

            ${meeting.description || "No Description"}

        </p>

        <div class="meeting-date">

            📅 ${formatDate(meeting.date)}

        </div>

        <div class="meeting-time">

            ⏰ ${formatTime(meeting.date)}

        </div>

        <div class="meeting-countdown">

            ${getCountdown(meeting.date)}

        </div>

        <div class="meeting-actions">

            <button class="edit-btn">

                Edit

            </button>

            <button class="delete-btn">

                Delete

            </button>

        </div>

    `;

    return card;

}



// Update countdown every minute
export function updateCountdowns() {
    const meetings = getMeetings();

    const meeting = meetings.find(m => m.id === id);
    const cards = document.querySelectorAll(".meeting-card");

    cards.forEach(card => {

        const id = card.dataset.id;

        import { getMeetings } from "./storage.js";

        if (!meeting) return;

        const countdown = card.querySelector(".meeting-countdown");

        countdown.textContent = getCountdown(meeting.date);

    });

}



// Fill form for editing
export function fillMeetingForm(meeting) {

    document.querySelector("#title").value = meeting.title;

    document.querySelector("#description").value = meeting.description;

    document.querySelector("#date").value = meeting.date.split("T")[0];

    document.querySelector("#time").value = meeting.date.split("T")[1];

}



// Reset Form
export function clearForm() {

    document.querySelector("#meetingForm").reset();

}



// Display Toast
export function showToast(message) {

    const toast = document.createElement("div");

    toast.className = "toast";

    toast.innerText = message;

    document.body.appendChild(toast);

    setTimeout(() => {

        toast.classList.add("show");

    },100);

    setTimeout(() => {

        toast.classList.remove("show");

        setTimeout(() => {

            toast.remove();

        },400);

    },3000);

}