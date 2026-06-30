const display = document.getElementById("display");
const keys = document.getElementById("keys");
const equalsBtn = document.getElementById("equals-btn");
const clearBtn = document.getElementById("clear-btn");

// Event listener für Button-Klicks
keys.addEventListener("click", function(event) {
  const button = event.target;
  if (button.tagName !== "BUTTON") return;
  const value = button.dataset.value;
  if (value !== undefined) {
    display.value += value;
  }
});

equalsBtn.addEventListener("click", function() {
  try {
    display.value = math.evaluate(display.value);
  } catch (e) {
    display.value = "Error";
  }
});

clearBtn.addEventListener("click", function() {
  display.value = "";
});

// NEW: Keyboard support
document.addEventListener("keydown", function(event) {
  const key = event.key;

  // Numbers und Operators
  if (/[0-9+\-*/.]/. test(key)) {
    display.value += key;
  }
  
  else if (key === "Enter" || key === "=") {
    event.preventDefault();
    try {
      display.value = math.evaluate(display.value);
    } catch (e) {
      display.value = "Error";
    }
  }
  // Backspace für Löschen
  else if (key === "Backspace") {
    display.value = display.value.slice(0, -1);
  }
  // C für Clear
  else if (key.toLowerCase() === "c") {
    display.value = "";
  }
});