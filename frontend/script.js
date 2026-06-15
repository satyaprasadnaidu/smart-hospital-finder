// ============================================================
// Smart Hospital Finder - script.js
// Located in: frontend/script.js
//
// This file handles:
//   1. Symptom search → sends request to FastAPI backend
//   2. Geolocation detection → uses browser Geolocation API
//   3. Interactive map → Leaflet.js + OpenStreetMap tiles
//
// Backend API URL: http://127.0.0.1:5000
// ============================================================

// ----------------------------------------------------------
// Global Variables: store user's coordinates after detection
// ----------------------------------------------------------
let userLatitude  = null;  // Will hold the detected latitude
let userLongitude = null;  // Will hold the detected longitude

// ----------------------------------------------------------
// Map Variables: track the Leaflet map instance and marker
// so we can update them if the user clicks the button again
// ----------------------------------------------------------
let leafletMap    = null;  // Leaflet Map object (null until first init)
let userMarker    = null;  // Leaflet Marker for the user's position


// ==========================================================
// FUNCTION 1: searchSymptom()
// Triggered by: clicking the "Search" button
// What it does: sends symptom text to FastAPI backend,
//               receives recommended specialization + hospitals
// ==========================================================
async function searchSymptom() {

    // Step 1: Get the input field element using its HTML id
    const symptomInput = document.getElementById('symptomInput');

    // Step 2: Read the value the user typed into the input
    const symptomValue = symptomInput.value;

    // Step 3: Get the result section where we display output
    const resultSection = document.getElementById('result');

    // Step 4: Validate — don't send an empty search
    if (symptomValue.trim() === "") {
        console.log("No symptom entered.");
        resultSection.textContent = "Please enter a symptom.";
        resultSection.style.color = "#e74c3c"; // Red for error
        return; // Stop here
    }

    try {
        // Step 5: Send POST request to FastAPI backend
        // Backend URL: http://127.0.0.1:5000/search
        const response = await fetch('http://127.0.0.1:5000/search', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            // Send symptom as JSON body
            body: JSON.stringify({ symptom: symptomValue })
        });

        // Step 6: Parse the JSON response from the backend
        const data = await response.json();
        console.log("Backend Response:", data);

        // Step 7: Display the recommended specialization in the result section
        resultSection.innerHTML = `Recommended Specialization: <strong>${data.specialization}</strong>`;
        resultSection.style.color = "#27ae60"; // Green for success

    } catch (error) {
        // Step 8: Handle network errors (e.g., backend not running)
        console.error("Error connecting to backend:", error);
        resultSection.textContent = "Error connecting to backend.";
        resultSection.style.color = "#e74c3c"; // Red for error
    }
}


// ==========================================================
// FUNCTION 2: getUserLocation()
// Triggered by: clicking the "Get My Location" button
// What it does:
//   - Checks if geolocation is supported by the browser
//   - Requests location permission from the user
//   - On success: stores & displays latitude and longitude
//   - On error: displays a friendly error message
// ==========================================================
function getUserLocation() {

    // Get references to all location-related HTML elements
    const locationCard  = document.getElementById('locationCard');
    const latitudeVal   = document.getElementById('latitudeVal');
    const longitudeVal  = document.getElementById('longitudeVal');
    const locationError = document.getElementById('locationError');
    const locationBtn   = document.getElementById('locationBtn');

    // Step 1: Reset previous state before a new request
    locationError.textContent = "";          // Clear any old error text
    locationCard.classList.add('hidden');    // Hide the coordinates card

    // Step 2: Check if the browser supports Geolocation API
    // Older browsers (e.g. very old IE) may not have navigator.geolocation
    if (!navigator.geolocation) {
        locationError.textContent = "Geolocation not supported";
        return; // Stop here — nothing more to do
    }

    // Step 3: Show a "loading" state while we wait for the user's response
    locationBtn.disabled = true;                         // Prevent double-clicks
    const originalText = locationBtn.textContent;        // Save button label
    locationBtn.textContent = "Detecting Location...";   // Temporary label

    // Step 4: Ask the browser for the user's current position
    // navigator.geolocation.getCurrentPosition() takes two callbacks:
    //   - successCallback: runs when location is retrieved
    //   - errorCallback:   runs if permission is denied or location fails
    navigator.geolocation.getCurrentPosition(

        // --- SUCCESS CALLBACK ---
        (position) => {
            // Restore button to original state
            locationBtn.disabled = false;
            locationBtn.textContent = originalText;

            // Step 5: Store coordinates in JavaScript variables
            userLatitude  = position.coords.latitude;
            userLongitude = position.coords.longitude;

            // Step 6: Display coordinates in the location card on the page
            latitudeVal.textContent  = userLatitude;
            longitudeVal.textContent = userLongitude;

            // Step 7: Reveal the location card (remove 'hidden' class)
            locationCard.classList.remove('hidden');

            // Step 8: Show the map section and render / update the map
            initOrUpdateMap(userLatitude, userLongitude);
        },

        // --- ERROR CALLBACK ---
        (error) => {
            // Restore button to original state
            locationBtn.disabled = false;
            locationBtn.textContent = originalText;

            // Step 9: Show an appropriate error message
            if (error.code === error.PERMISSION_DENIED) {
                // User clicked "Block" on the browser permission prompt
                locationError.textContent = "Location access denied";
            } else {
                // Other errors (e.g., GPS unavailable, timeout)
                locationError.textContent = "Error retrieving location: " + error.message;
            }
        }
    );
}


// ==========================================================
// FUNCTION 3: initOrUpdateMap(lat, lng)
// Called by: getUserLocation() after a successful position fix
//
// What it does:
//   - First call  → creates a brand-new Leaflet map centred on
//                   the user's coordinates and places a marker.
//   - Later calls → pans / flies the existing map to the new
//                   position and moves the marker (no full reload).
// ==========================================================
function initOrUpdateMap(lat, lng) {

    // Show the map wrapper div (CSS class toggle)
    const mapSection = document.getElementById('mapSection');
    mapSection.classList.add('visible');

    if (leafletMap === null) {
        // ── FIRST TIME: create the map ──────────────────────────

        // L.map('map') initialises Leaflet inside <div id="map">
        // setView([lat, lng], zoom) centres the map and sets zoom level
        leafletMap = L.map('map').setView([lat, lng], 13);

        // Add OpenStreetMap tile layer (free, no API key required)
        // {s} = subdomain, {z}/{x}/{y} = zoom/tile coords
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            maxZoom: 19
        }).addTo(leafletMap);

        // Place a marker at the user's location with a friendly popup
        userMarker = L.marker([lat, lng])
            .addTo(leafletMap)
            .bindPopup('<b>You are here</b>')
            .openPopup();

    } else {
        // ── SUBSEQUENT CALLS: update existing map ──────────────

        // flyTo() gives a smooth animated pan + zoom transition
        leafletMap.flyTo([lat, lng], 13);

        // Move the marker to the new position
        userMarker.setLatLng([lat, lng]);

        // Refresh the popup text and re-open it
        userMarker
            .bindPopup('<b>You are here</b>')
            .openPopup();
    }
}
