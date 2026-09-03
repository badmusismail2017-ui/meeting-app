// =====================================
// dashboard.js
// MeetAlarm Dashboard
// =====================================

// Import API functions

import {

    fetchMeetings,

    deleteMeeting,

    updateMeeting

} from "./api.js";

import { initNotifications } from "./notification.js";
/*
import { Link } from 'react-router-dom'

function Navbar() {
    return <Link to="/home">Home</Link>
} */

// =====================================
// CHECK LOGIN
// =====================================

const loggedInUser = JSON.parse(

    localStorage.getItem("loggedInUser")

);

if (!loggedInUser) {

    window.location.href = "login.html";

}

// =====================================
// DOM ELEMENTS
// =====================================

const userName = document.getElementById("userName");

const totalMeetings = document.getElementById("totalMeetings");

const todayMeetings = document.getElementById("todayMeetings");

const upcomingMeetings = document.getElementById("upcomingMeetings");

const missedMeetings = document.getElementById("missedMeetings");

const meetingTableBody = document.getElementById("meetingTableBody");

const searchMeeting = document.getElementById("searchMeeting");

const refreshBtn = document.getElementById("refreshBtn");

const logoutBtn = document.getElementById("logoutBtn");

// =====================================
// SHOW USER NAME
// =====================================

if (loggedInUser) {

    userName.textContent =

        loggedInUser.fullname ||

        loggedInUser.name ||

        "User";

}

// =====================================
// GLOBAL DATA
// =====================================

let meetings = [];

// =====================================
// LOAD DASHBOARD
// =====================================

async function loadDashboard() {

    try {

        meetings = await fetchMeetings();

        updateStatistics();

        renderMeetings(meetings);

    }

    catch (error) {

        console.error(error);

    }

}

// =====================================
// UPDATE DASHBOARD STATISTICS
// =====================================

function updateStatistics() {

    const today = new Date();

    let todayCount = 0;

    let upcomingCount = 0;

    let missedCount = 0;

    meetings.forEach(meeting => {

        const meetingDate = new Date(

            `${meeting.date}T${meeting.time}`

        );

        if (

            meetingDate.toDateString() ===

            today.toDateString()

        ) {

            todayCount++;

        }

        if (meetingDate > today) {

            upcomingCount++;

        }

        if (meetingDate < today) {

            missedCount++;

        }

    });

    totalMeetings.textContent = meetings.length;

    todayMeetings.textContent = todayCount;

    upcomingMeetings.textContent = upcomingCount;

    missedMeetings.textContent = missedCount;

}

// =====================================
// GET STATUS
// =====================================

function getMeetingStatus(meeting) {

    const now = new Date();

    const meetingDate = new Date(

        `${meeting.date}T${meeting.time}`

    );

    if (meetingDate > now) {

        return "Upcoming";

    }

    return "Missed";

}

// =====================================
// STATUS CLASS
// =====================================

function getStatusClass(status) {

    switch (status) {

        case "Upcoming":

            return "upcoming";

        case "Completed":

            return "completed";

        case "Missed":

            return "missed";

        default:

            return "upcoming";

    }

}

// =====================================
// RENDER MEETINGS
// =====================================

function renderMeetings(meetingList) {

    meetingTableBody.innerHTML = "";

    if (meetingList.length === 0) {

        meetingTableBody.innerHTML = `

<tr>

<td colspan="5">

No meetings found.

</td>

</tr>

`;

        return;

    }

    meetingList.forEach(meeting => {

        const status = getMeetingStatus(meeting);

        const row = document.createElement("tr");

        row.innerHTML = `

<td>${meeting.title}</td>

<td>${meeting.date}</td>

<td>${meeting.time}</td>

<td>

<span class="status ${getStatusClass(status)}">

${status}

</span>

</td>

<td>

<div class="table-actions">

<button

class="edit-btn"

data-id="${meeting.id}">

<i class="fas fa-pen"></i>

</button>

<button

class="delete-btn"

data-id="${meeting._id}">

<i class="fas fa-trash"></i>

</button>

</div>

</td>

`;

        meetingTableBody.appendChild(row);

    });

}

// =====================================
// LIVE SEARCH
// =====================================

searchMeeting.addEventListener("input", () => {

    const keyword = searchMeeting.value
        .toLowerCase()
        .trim();

    const filteredMeetings = meetings.filter(meeting => {

        return (

            meeting.title.toLowerCase().includes(keyword) ||

            meeting.date.toLowerCase().includes(keyword) ||

            meeting.time.toLowerCase().includes(keyword)

        );

    });

    renderMeetings(filteredMeetings);

});

// =====================================
// DELETE MEETING
// =====================================

meetingTableBody.addEventListener("click", async (event) => {

    const deleteButton = event.target.closest(".delete-btn");

    if (!deleteButton) return;

    const meetingId = deleteButton.dataset.id;

    const confirmDelete = confirm(

        "Are you sure you want to delete this meeting?"

    );

    if (!confirmDelete) return;

    try {

        await deleteMeeting(meetingId);

        meetings = meetings.filter(
            meeting => meeting._id !== meetingId
        );

        updateStatistics();

        renderMeetings(meetings);

        alert("Meeting deleted successfully.");

    }

    catch (error) {

        console.error(error);

        alert("Unable to delete meeting.");

    }

});

// =====================================
// REFRESH DASHBOARD
// =====================================

refreshBtn.addEventListener("click", async () => {

    refreshBtn.disabled = true;

    refreshBtn.innerHTML = `

<i class="fas fa-spinner fa-spin"></i>

Refreshing...

`;

    await loadDashboard();

    refreshBtn.disabled = false;

    refreshBtn.innerHTML = `

<i class="fas fa-rotate"></i>

Refresh

`;

});

// =====================================
// LOGOUT
// =====================================

logoutBtn.addEventListener("click", () => {

    const logout = confirm(

        "Do you really want to logout?"

    );

    if (!logout) return;

    localStorage.removeItem("loggedInUser");

    window.location.href = "login.html";

});

// =====================================
// GREETING
// =====================================

function showGreeting() {

    const greetingElement = document.querySelector(".topbar p");

    if (!greetingElement) return;

    const hour = new Date().getHours();

    let greeting = "Welcome";

    if (hour < 12) {

        greeting = "Good Morning";

    }

    else if (hour < 18) {

        greeting = "Good Afternoon";

    }

    else {

        greeting = "Good Evening";

    }

    greetingElement.innerHTML = `

${greeting},

<span id="userName">

${loggedInUser.fullname || loggedInUser.name || "User"}

</span>

 👋

`;

}

// =====================================
// LOAD EVERYTHING
// =====================================

showGreeting();

loadDashboard();

// =====================================
// LIVE CLOCK
// =====================================

function startClock() {

    const clockElement = document.getElementById("liveClock");

    if (!clockElement) return;

    function updateClock() {

        const now = new Date();

        clockElement.textContent = now.toLocaleTimeString([], {

            hour: "2-digit",

            minute: "2-digit",

            second: "2-digit"

        });

    }

    updateClock();

    setInterval(updateClock, 1000);

}

// =====================================
// CALENDAR
// =====================================

function generateCalendar() {

    const calendar = document.getElementById("calendarDates");

    const monthTitle = document.getElementById("currentMonth");

    if (!calendar || !monthTitle) return;

    calendar.innerHTML = "";

    const today = new Date();

    const year = today.getFullYear();

    const month = today.getMonth();

    monthTitle.textContent = today.toLocaleString("default", {

        month: "long",

        year: "numeric"

    });

    const firstDay = new Date(year, month, 1).getDay();

    const lastDate = new Date(year, month + 1, 0).getDate();

    for (let i = 0; i < firstDay; i++) {

        const empty = document.createElement("div");

        calendar.appendChild(empty);

    }

    for (let day = 1; day <= lastDate; day++) {

        const cell = document.createElement("div");

        cell.textContent = day;

        if (day === today.getDate()) {

            cell.classList.add("today");

        }

        calendar.appendChild(cell);

    }

}

// =====================================
// RECENT ACTIVITY
// =====================================

function loadRecentActivity() {

    const activity = document.getElementById("activityList");

    if (!activity) return;

    activity.innerHTML = "";

    if (meetings.length === 0) {

        activity.innerHTML = `

<div class="activity-item">

<div class="activity-icon">

<i class="fas fa-circle-info"></i>

</div>

<div>

<h4>

No Activity Yet

</h4>

<p>

Create your first meeting to begin tracking activity.

</p>

</div>

</div>

`;

        return;

    }

    meetings.slice(0, 5).forEach(meeting => {

        activity.innerHTML += `

<div class="activity-item">

<div class="activity-icon">

<i class="fas fa-calendar-check"></i>

</div>

<div>

<h4>

${meeting.title}

</h4>

<p>

${meeting.date} • ${meeting.time}

</p>

</div>

</div>

`;

    });

}

// =====================================
// LOADING SCREEN
// =====================================

function hideLoading() {

    document.body.classList.add("loaded");

}

// =====================================
// INITIALIZE DASHBOARD
// =====================================

async function initializeDashboard() {

    await loadDashboard();

    await initNotifications();

    generateCalendar();

    loadRecentActivity();

    showGreeting();

    startClock();

    hideLoading();

}

initializeDashboard();

// =====================================
// EXPORTS
// =====================================

export {

    loadDashboard,

    renderMeetings,

    updateStatistics

};

// =====================================
// EDIT MEETING MODAL
// =====================================

const editModal = document.getElementById("editModal");

const closeModal = document.getElementById("closeModal");

const editMeetingForm = document.getElementById("editMeetingForm");

const editMeetingId = document.getElementById("editMeetingId");

const editTitle = document.getElementById("editTitle");

const editDate = document.getElementById("editDate");

const editTime = document.getElementById("editTime");

const editLink = document.getElementById("editLink");

const editReminder = document.getElementById("editReminder");

const editDescription = document.getElementById("editDescription");

// =====================================
// OPEN EDIT MODAL
// =====================================

meetingTableBody.addEventListener("click", (event) => {

    const editButton = event.target.closest(".edit-btn");

    if (!editButton) return;

    const meetingId = editButton.dataset.id;

    const meeting = meetings.find(
        item => item.id === meetingId
    );

    if (!meeting) return;

    editMeetingId.value = meeting.id;

    editTitle.value = meeting.title || "";

    editDate.value = meeting.date || "";

    editTime.value = meeting.time || "";

    editLink.value = meeting.link || "";

    editReminder.value = meeting.reminder || "10";

    editDescription.value = meeting.description || "";

    editModal.classList.add("active");

});

// =====================================
// CLOSE MODAL
// =====================================

closeModal.addEventListener("click", () => {

    editModal.classList.remove("active");

});

editModal.addEventListener("click", (event) => {

    if (event.target === editModal) {

        editModal.classList.remove("active");

    }

});

// =====================================
// ESC KEY CLOSE
// =====================================

document.addEventListener("keydown", (event) => {

    if (

        event.key === "Escape" &&

        editModal.classList.contains("active")

    ) {

        editModal.classList.remove("active");

    }

});

// =====================================
// UPDATE MEETING
// =====================================

editMeetingForm.addEventListener("submit", async (event) => {

    event.preventDefault();

    const meetingId = editMeetingId.value;

    const updatedMeeting = {

        title: editTitle.value.trim(),

        date: editDate.value,

        time: editTime.value,

        link: editLink.value.trim(),

        reminder: editReminder.value,

        description: editDescription.value.trim()

    };

    try {

        await updateMeeting(

            meetingId,

            updatedMeeting

        );

        const index = meetings.findIndex(
            meeting => meeting.id === meetingId
        );

        if (index !== -1) {

            meetings[index] = {

                ...meetings[index],

                ...updatedMeeting

            };

        }

        updateStatistics();

        renderMeetings(meetings);

        loadRecentActivity();

        editModal.classList.remove("active");

        alert("Meeting updated successfully.");

    }

    catch (error) {

        console.error(error);

        alert("Unable to update meeting.");

    }

});