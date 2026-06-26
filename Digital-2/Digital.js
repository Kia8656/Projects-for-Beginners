let currentHourFormat = 12;
// Tracks the current hour format (12 or 24); starts in 12-hour mode

let areSecondsVisible = true;
// Tracks whether seconds are currently visible; starts as true (visible)

const dayNames = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
// Array of day names; index 0 = Sunday, matching what getDay() returns

const monthNames = ["January","February","March","April","May","June",
                    "July","August","September","October","November","December"];
// Array of month names; index 0 = January, matching what getMonth() returns


function setHourFormat(selectedFormat) {
// Called when the user clicks "12-hour" or "24-hour"
// selectedFormat receives either 12 or 24 depending on which button was clicked
// IMPORTANT: the onclick in index.html must say setHourFormat() — not setFmt() or any old name

  currentHourFormat = selectedFormat;
  // Updates the global format variable so updateClockDisplay() uses the new format on every tick

  const twelveHourButton = document.getElementById("btn-format-12");
  const twentyFourHourButton = document.getElementById("btn-format-24");
  // Grab both format buttons so we can highlight the active one and unhighlight the other

  twelveHourButton.classList.toggle("active", selectedFormat === 12);
  // Adds "active" class to the 12-hour button if selectedFormat is 12, removes it otherwise

  twentyFourHourButton.classList.toggle("active", selectedFormat === 24);
  // Adds "active" class to the 24-hour button if selectedFormat is 24, removes it otherwise

  const meridiemLabel = document.getElementById("clock-meridiem");
  meridiemLabel.style.display = selectedFormat === 12 ? "" : "none";
  // Shows AM/PM in 12-hour mode ("" restores default display), hides it in 24-hour mode

  updateClockDisplay();
  // Immediately re-renders the clock so the change shows without waiting for the next interval
}


function toggleSecondsVisibility() {
// Called when the user clicks the "Seconds" button
// IMPORTANT: the onclick in index.html must say toggleSecondsVisibility() — not toggleSeconds()

  areSecondsVisible = !areSecondsVisible;
  // Flips the boolean: true becomes false, false becomes true

  const secondsToggleButton = document.getElementById("btn-toggle-seconds");
  secondsToggleButton.classList.toggle("active", areSecondsVisible);
  // Highlights the button when seconds are on, un-highlights when off

  updateClockDisplay();
  // Let updateClockDisplay() handle the actual showing/hiding of the seconds elements
  // This is the fix for the broken toggle — previously we set style.display here,
  // but setInterval calls updateClockDisplay() every second and was overwriting it.
  // Now updateClockDisplay() checks areSecondsVisible on every single tick,
  // so the visibility stays correct no matter how many times it runs
}


function updateClockDisplay() {
// Reads the current time and updates every element on the clock face
// This runs once immediately on load, then every 1000ms via setInterval

  const currentDateTime = new Date();
  // Creates a Date object representing the exact moment this function runs

  let currentHour = currentDateTime.getHours();
  // Gets the current hour in 24-hour format (0–23)
  // let because we may convert it to 12-hour format below

  const meridiemValue = currentHour >= 12 ? "PM" : "AM";
  // Determines AM/PM before we modify currentHour
  // Anything 12 or above is PM; anything below 12 is AM

  if (currentHourFormat === 12) currentHour = currentHour % 12 || 12;
  // Converts to 12-hour format only when the user has selected 12-hour mode
  // % 12 maps 13→1, 14→2, 23→11 etc.
  // || 12 handles the edge case where % 12 returns 0 (midnight and noon) → 12

  const hoursDisplay = document.getElementById("clock-hours");
  hoursDisplay.textContent = currentHour.toString().padStart(2, "0");
  // Converts hour to a string and pads to 2 digits so "9" becomes "09"

  const minutesDisplay = document.getElementById("clock-minutes");
  minutesDisplay.textContent = currentDateTime.getMinutes().toString().padStart(2, "0");
  // Gets minutes (0–59), converts to string, pads to 2 digits so "4" becomes "04"

  const secondsDisplay = document.getElementById("clock-seconds");
  secondsDisplay.textContent = currentDateTime.getSeconds().toString().padStart(2, "0");
  // Gets seconds (0–59), converts to string, pads to 2 digits so "7" becomes "07"

  secondsDisplay.style.display = areSecondsVisible ? "" : "none";
  // ✅ Enforces visibility on every tick by reading the global areSecondsVisible
  // This is what fixes the toggle — previously this was only set inside toggleSecondsVisibility(),
  // meaning setInterval would run updateClockDisplay() a second later and undo the hide

  const secondsSeparatorColon = document.getElementById("clock-seconds-separator");
  secondsSeparatorColon.style.display = areSecondsVisible ? "" : "none";
  // ✅ Same fix applied to the colon — hides/shows it in sync with the seconds digits
  // Both elements must always match, otherwise you'd get a dangling ":" with no seconds

  const meridiemDisplay = document.getElementById("clock-meridiem");
  meridiemDisplay.textContent = meridiemValue;
  // Sets the AM/PM label (only visible in 12-hour mode due to display:none set in setHourFormat)

  const currentDayName = dayNames[currentDateTime.getDay()];
  // getDay() returns 0–6; we use it as an index into dayNames e.g. 5 → "Friday"

  const currentMonthName = monthNames[currentDateTime.getMonth()];
  // getMonth() returns 0–11; we use it as an index into monthNames e.g. 5 → "June"

  const currentDayOfMonth = currentDateTime.getDate();
  // getDate() returns the day of the month (1–31)

  const currentYear = currentDateTime.getFullYear();
  // getFullYear() returns the four-digit year e.g. 2026

  const dateDisplay = document.getElementById("clock-date");
  dateDisplay.textContent = `${currentDayName}, ${currentMonthName} ${currentDayOfMonth}, ${currentYear}`;
  // Builds the full date string e.g. "Friday, June 26, 2026"

  const timezoneDisplay = document.getElementById("clock-timezone");
  timezoneDisplay.textContent = Intl.DateTimeFormat().resolvedOptions().timeZone;
  // Intl.DateTimeFormat() creates a formatter using the browser's locale
  // .resolvedOptions() returns an object with the browser's locale settings
  // .timeZone extracts the IANA timezone name e.g. "Europe/Berlin"
}


updateClockDisplay();
// Runs once immediately on page load so the clock shows a time right away
// Without this the clock would show "--:--:--" for the first second

setInterval(updateClockDisplay, 1000);
// Calls updateClockDisplay() every 1000 milliseconds (1 second) to keep the clock live