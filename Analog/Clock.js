const clockFace = document.getElementById("face");
// Grab the clock face div so we can inject number divs into it

const svg = document.getElementById("tick-layer");
// Grab the SVG layer so we can inject tick mark lines into it

const infoTime = document.getElementById("info-time");
// Digital time display below the clock

const infoDate = document.getElementById("info-date");
// Date display below the digital time

const dayNames   = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
const monthNames = ["January","February","March","April","May","June",
                    "July","August","September","October","November","December"];


// --- TICK MARKS ---

for (let tick = 0; tick < 60; tick++) {
  // Loop 60 times — one tick mark for each second around the clock

  const angleDeg = (tick / 60) * 360 - 90;
  // Spread ticks evenly around 360 degrees
  // Subtract 90 so tick 0 starts at the top (12 o'clock), not the right

  const angleRad = (angleDeg * Math.PI) / 180;
  // Convert degrees to radians — required by Math.cos() and Math.sin()

  const isHourMark = tick % 5 === 0;
  // Every 5th tick aligns with an hour number (60 ticks / 12 hours = 5)

  const isQuarterMark = tick % 15 === 0;
  // 12, 3, 6, and 9 o'clock positions — made extra prominent

  const innerRadius = isQuarterMark ? 112 : isHourMark ? 118 : 126;
  // Quarter marks are longest, hour marks medium, minute marks shortest
  // All start at different inner radii but share the same outer radius

  const outerRadius = 136;
  // All ticks end at the same outer edge

  const x1 = Math.cos(angleRad) * innerRadius;
  const y1 = Math.sin(angleRad) * innerRadius;
  // Inner end of the tick line

  const x2 = Math.cos(angleRad) * outerRadius;
  const y2 = Math.sin(angleRad) * outerRadius;
  // Outer end of the tick line

  const tickLine = document.createElementNS("http://www.w3.org/2000/svg", "line");
  // createElementNS() is required for SVG elements — createElement() won't work

  tickLine.setAttribute("x1", x1);
  tickLine.setAttribute("y1", y1);
  tickLine.setAttribute("x2", x2);
  tickLine.setAttribute("y2", y2);
  // Set the start and end coordinates

  tickLine.setAttribute("stroke-linecap", "round");
  // Rounded ends on every tick mark — softer, more modern look

  if (isQuarterMark) {
    tickLine.setAttribute("stroke", "#888");
    tickLine.setAttribute("stroke-width", "2.5");
    // Quarter marks (12, 3, 6, 9) are brightest and thickest
  } else if (isHourMark) {
    tickLine.setAttribute("stroke", "#444");
    tickLine.setAttribute("stroke-width", "1.5");
    // Hour marks are medium brightness and thickness
  } else {
    tickLine.setAttribute("stroke", "#272727");
    tickLine.setAttribute("stroke-width", "1");
    // Minute marks are very subtle — barely visible, just enough for reference
  }

  svg.appendChild(tickLine);
  // Insert the tick line into the SVG layer
}


// --- NUMBERS ---

for (let num = 1; num <= 12; num++) {
  // Loop 1 to 12 to place each hour number on the face

  const angleDeg = (num / 12) * 360 - 90;
  // Same formula as tick marks but divided by 12 instead of 60
  // Each number is 30 degrees apart (360 / 12 = 30)

  const angleRad = (angleDeg * Math.PI) / 180;

  const x = Math.cos(angleRad) * 108;
  const y = Math.sin(angleRad) * 108;
  // Radius 108 sits inside the tick marks (which start at 112–126)
  // leaving a clean visible gap between numbers and tick marks

  const numberDiv = document.createElement("div");
  numberDiv.classList.add("number");
  numberDiv.textContent = num;

  numberDiv.style.left = `calc(50% + ${x}px - 13px)`;
  numberDiv.style.top  = `calc(50% + ${y}px - 13px)`;
  // 50% = center of the clock face
  // + x/y = offset to the correct position on the circle
  // - 13px = shift back by half the div size (26px / 2) to center the number on that point

  clockFace.appendChild(numberDiv);
  // Insert the number into the clock face
}


// --- HANDS & DISPLAY ---

function update() {
  // Reads current time, rotates hands, and updates the digital display
  // Called once on load then every 1000ms via setInterval

  const now  = new Date();
  const sec  = now.getSeconds();
  const min  = now.getMinutes();
  const hour = now.getHours();

  const secDeg  = (sec / 60) * 360;
  // 60 seconds = 360 degrees; each second = 6 degrees

  const minDeg  = (min / 60) * 360 + (sec / 60) * 6;
  // Each minute = 6 degrees; the seconds fraction makes the hand glide smoothly

  const hourDeg = (hour / 12) * 360 + (min / 60) * 30;
  // Each hour = 30 degrees; the minutes fraction makes the hand glide smoothly

  document.getElementById("sec").style.transform  = `rotate(${secDeg}deg)`;
  document.getElementById("min").style.transform  = `rotate(${minDeg}deg)`;
  document.getElementById("hour").style.transform = `rotate(${hourDeg}deg)`;
  // Rotate each hand around its own transform-origin (set in CSS)

  // Digital time
  const mer  = hour >= 12 ? "PM" : "AM";
  const h12  = (hour % 12 || 12).toString().padStart(2, "0");
  const mm   = min.toString().padStart(2, "0");
  const ss   = sec.toString().padStart(2, "0");
  infoTime.textContent = `${h12}:${mm}:${ss} ${mer}`;
  // Formats the time as HH:MM:SS AM/PM e.g. "03:45:07 PM"

  // Date
  const dayName   = dayNames[now.getDay()];
  const monthName = monthNames[now.getMonth()];
  const dayOfMonth = now.getDate();
  const year      = now.getFullYear();
  infoDate.textContent = `${dayName}, ${monthName} ${dayOfMonth}, ${year}`;
  // Formats as e.g. "Friday, June 26, 2026"
}


update();
// Runs immediately on load so the clock shows the correct time right away

setInterval(update, 1000);
// Updates every second to keep the hands and digital display in sync