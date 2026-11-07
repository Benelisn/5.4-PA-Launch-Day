/*
    Author: Joshua Farr
    Date: 11/7/2026
    Purpose: Checks whether the page is running on a local server. When it is, it switches to Uplink Mode, updates the hero text, and saves the launch time in a cookie called lastUplink.
*/

/* =========================================
     COOKIE FUNCTIONS
========================================= */

function setCookie(name, value, days) {
    const maxAge = days * 24 * 60 * 60;
    document.cookie = `${name}=${value}; max-age=${maxAge}; path=/`;
}

function getCookie(name) {
    const cookies = document.cookie.split(";");

    for (const cookie of cookies) {
        const trimmed = cookie.trim();
        if (trimmed.startsWith(name + "=")) {
            return trimmed.substring(name.length + 1);
        }
    }
    return "";
}

/* =========================================
     ELEMENT REFERENCES
========================================= */

const heroTitle = document.getElementById("heroTitle");
const heroText = document.getElementById("heroText");
const connectionStatus = document.getElementById("connectionStatus");
const lastOnline = document.getElementById("lastOnline");
const refreshButton = document.getElementById("refreshButton");
const hostInfo = document.getElementById("hostInfo");
const portInfo = document.getElementById("portInfo");
const protocolInfo = document.getElementById("protocolInfo");

/* =========================================
     LAUNCH DETECTION
========================================= */

// The page is live when a local server serves it over http/https
const isLive = location.protocol === "http:" || location.protocol === "https:";

/* =========================================
     SYSTEM INFORMATION
========================================= */

hostInfo.textContent = location.hostname || "No host (static file)";
portInfo.textContent = location.port ? `Port ${location.port}` : "No port (default)";
protocolInfo.textContent = location.protocol.replace(":", "").toUpperCase();

/* =========================================
     LAST TIME LAUNCHED
========================================= */

// Read the previous launch before saving the new one
const previousUplink = getCookie("lastUplink");

if (previousUplink) {
    lastOnline.textContent = previousUplink;
} else if (isLive) {
    lastOnline.textContent = "First uplink. Refresh to see this launch time.";
}

/* =========================================
     UPLINK MODE
========================================= */

if (isLive) {
    document.body.classList.add("uplink-mode");

    const now = new Date().toLocaleString();

    heroTitle.textContent = "SATELLITE UPLINK ESTABLISHED";
    heroText.innerHTML = `
        Signal locked with orbital relay.<br>
        Telemetry streaming from ${location.hostname}:${location.port}.<br>
        Uplink time: ${now}
    `;
    connectionStatus.textContent = "Online - Uplink Active";

    // Save this launch time for the next visit
    setCookie("lastUplink", now, 30);
} else {
    heroTitle.textContent = "GROUND STANDBY";
    heroText.textContent = "Awaiting Uplink Authorization... Launch through a local server to connect.";
    connectionStatus.textContent = "Offline - Satellite systems on standby";
}

/* =========================================
     REFRESH BUTTON
========================================= */

refreshButton.addEventListener("click", function () {
    location.reload();
});