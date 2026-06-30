// CALCUTLATOR PROGRAM
//this the professional method, using a math.js libarie, not eval or a function
//it is safe because the input just understands math not any other thing. so it can't 
//accepts any other type of input like a string of code other kind of malicous attack.


const display = document.getElementById("display");


function appendToDisplay(input){
  display.value += input;

}

function clearDisplay(){
  display.value = "";
}

function calculate() {
  try {
    display.value = math.evaluate(display.value);
  } catch (e) {
    display.value = "Error";
  }
}