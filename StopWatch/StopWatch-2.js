// Grabs the <div id="display"> from the HTML so we can update its text
const display = document.getElementById("display");

// Stores the ID returned by setInterval() so we can cancel it with clearInterval()
let timer = null;

// Timestamp (ms) of when the stopwatch was started or resumed
let startTime = 0;

// Total milliseconds elapsed — kept separate so pause/resume works correctly
let elapsedTime = 0;

// Prevents start() from creating multiple intervals if clicked while running
let isRunning = false;


function start() {
    if (!isRunning) {
        // Subtract elapsedTime so resuming picks up from where we paused
        // Date.now() returns current time in ms since Jan 1, 1970
        startTime = Date.now() - elapsedTime;

        // Calls update() every 10ms — stores the ID so we can stop it later
        timer = setInterval(update, 10);

        isRunning = true;
    }
}


function stop() {
    if (isRunning) {
        // Cancels the interval using the ID stored in 'timer'
        clearInterval(timer);

        // Save elapsed time so we can resume from this point
        elapsedTime = Date.now() - startTime;

        isRunning = false;
    }
}


function reset() {
    clearInterval(timer);

    // No 'let' here — we reassign the outer global variables.
    // Using 'let' would create local variables that vanish after the function ends.
    startTime = 0;
    elapsedTime = 0;
    isRunning = false;

    display.textContent = "00:00:00:00";
}


function update() {
    elapsedTime = Date.now() - startTime;

    // Convert raw milliseconds into individual time units
    let hours        = Math.floor(elapsedTime / (1000 * 60 * 60));
    let minutes      = Math.floor(elapsedTime / (1000 * 60) % 60);
    let seconds      = Math.floor(elapsedTime / 1000 % 60);
    // ⚠️ Must be (elapsedTime / 1000 % 60), NOT (elapsedTime / (1000 % 60))
    // because 1000 % 60 = 40, which gives a completely wrong result
    let milliseconds = Math.floor(elapsedTime % 1000 / 10);
    // % 1000 isolates leftover ms, / 10 compresses 0-999 into 0-99 (two digits)

    // padStart(2, "0") ensures always 2 digits — e.g. 7 → "07"
    hours        = String(hours).padStart(2, "0");
    minutes      = String(minutes).padStart(2, "0");
    seconds      = String(seconds).padStart(2, "0");
    milliseconds = String(milliseconds).padStart(2, "0");

    // Template literal updates the display text every 10ms
    display.textContent = `${hours}:${minutes}:${seconds}:${milliseconds}`;
}