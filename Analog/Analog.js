const clockFace = document.getElementById("face");
// Grab the clock face div so we can inject number divs into it

const svg = document.getElementById("tick-layer");
// Grab the SVG element so we can inject tick mark lines into it


// --- TICK MARKS ---

for (let tick = 0; tick < 60; tick++) {
  // Loop 60 times, once for each second/minute mark around the clock face

  const angleDeg = (tick / 60) * 360 - 90;
  // Spread 60 ticks evenly around 360 degrees
  // Subtract 90 so tick 0 starts at the top (12 o'clock) not the right

  const angleRad = (angleDeg * Math.PI) / 180;
  // Convert degrees to radians for Math.cos() and Math.sin()

  const isHourMark = tick % 5 === 0;
  // Every 5th tick aligns with an hour number (60 / 12 = 5)

  const innerRadius = isHourMark ? 118 : 126;
  // Hour marks are longer — they start further from the center
  // Minute marks are shorter — they start closer to the edge

  const outerRadius = 136;
  // All ticks end at the same outer radius near the clock edge

  const x1 = Math.cos(angleRad) * innerRadius;
  const y1 = Math.sin(angleRad) * innerRadius;
  // Inner end of the tick line

  const x2 = Math.cos(angleRad) * outerRadius;
  const y2 = Math.sin(angleRad) * outerRadius;
  // Outer end of the tick line — same angle, larger radius

  const tickLine = document.createElementNS("http://www.w3.org/2000/svg", "line");
  // createElementNS() is required for SVG — regular createElement() won't work

  tickLine.setAttribute("x1", x1);
  tickLine.setAttribute("y1", y1);
  tickLine.setAttribute("x2", x2);
  tickLine.setAttribute("y2", y2);
  // Set the start and end coordinates of the line

  tickLine.setAttribute("stroke", isHourMark ? "#aaa" : "#444");
  // Hour marks are much brighter than minute marks

  tickLine.setAttribute("stroke-width", isHourMark ? "2.5" : "1");
  // Hour marks are thicker to further distinguish them

  tickLine.setAttribute("stroke-linecap", "round");
  // Rounds the ends of each tick mark for a cleaner, modern look

  svg.appendChild(tickLine);
  // Insert the finished tick line into the SVG layer
}


// --- NUMBERS ---

for (let num = 1; num <= 12; num++) {
  // Loop through 1 to 12 to place each hour number

  const angleDeg = (num / 12) * 360 - 90;
  // Spread 12 numbers evenly around 360 degrees
  // Subtract 90 so number 12 sits at the top

  const angleRad = (angleDeg * Math.PI) / 180;
  // Convert to radians for Math.cos() and Math.sin()

  const x = Math.cos(angleRad) * 108;
  const y = Math.sin(angleRad) * 108;
  // Radius 108 places numbers clearly inside the tick marks (which start at 118)
  // giving a clean gap between the numbers and the marks

  const numberDiv = document.createElement("div");
  numberDiv.classList.add("number");
  numberDiv.textContent = num;

  numberDiv.style.left = `calc(50% + ${x}px - 12px)`;
  numberDiv.style.top  = `calc(50% + ${y}px - 12px)`;
  // 50% = center of the clock face
  // + x/y = offset to the correct position on the circle
  // - 12px = shift back by half the div size (24px / 2) to center the number on that point

  clockFace.appendChild(numberDiv);
  // Insert the number div into the clock face
}


// --- HANDS ---

function update() {
  // Reads the current time and rotates all three hands
  // Runs once on load then every 1000ms via setInterval

  const now  = new Date();
  const sec  = now.getSeconds();
  const min  = now.getMinutes();
  const hour = now.getHours();

  const secDeg  = (sec / 60) * 360;
  // 60 seconds = 360 degrees, so each second = 6 degrees

  const minDeg  = (min / 60) * 360 + (sec / 60) * 6;
  // Each minute = 6 degrees
  // Adding the seconds fraction makes the minute hand glide smoothly

  const hourDeg = (hour / 12) * 360 + (min / 60) * 30;
  // Each hour = 30 degrees
  // Adding the minutes fraction makes the hour hand glide smoothly

  document.getElementById("sec").style.transform  = `rotate(${secDeg}deg)`;
  document.getElementById("min").style.transform  = `rotate(${minDeg}deg)`;
  document.getElementById("hour").style.transform = `rotate(${hourDeg}deg)`;
  // We no longer need translateX(-50%) here because each hand is
  // precisely centered using left: calc(50% - halfWidth) in CSS
}


update();
// Runs once immediately on page load so hands show correct time right away

setInterval(update, 1000);
// Updates every 1000ms to keep the hands moving