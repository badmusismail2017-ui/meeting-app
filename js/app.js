// =====================================
// app.js
// MeetAlarm Application Initializer
// =====================================

import { initNotifications } from "./notification.js";

// =====================================
// APPLICATION STARTUP
// =====================================

document.addEventListener("DOMContentLoaded", async () => {

    console.log("================================");
    console.log("MeetAlarm Started Successfully");
    console.log("================================");

    const currentPage = window.location.pathname
        .split("/")
        .pop();

    switch (currentPage) {

        case "dashboard.html":

            await initNotifications();

            break;

        case "create-meeting.html":

            console.log("Create Meeting Page Loaded");

            break;

        case "login.html":

            console.log("Login Page Loaded");

            break;

        case "register.html":

            console.log("Register Page Loaded");

            break;

        default:

            console.log("Home Page Loaded");

    }

});