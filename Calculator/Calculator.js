// CALCUTLATOR PROGRAM


const display = document.getElementById("display");


function appendToDisplay(input){
  display.value += input;

}

function clearDisplay(){
  display.value = "";
}


function calculate(){
  try{
    display.value = eval(display.value);
  }

  catch(error){
    display.value = "Error";

  }
  
}





/*

function calculate() {
  try {
    display.value = Function('"use strict"; return (' + display.value + ')')();
  } catch (e) {
    display.value = "Error"; // shows "Error" if the expression is invalid
  }
}

the eval can be use to do the calculation but it is major security danger
so the safer option is to use a function like the => function calculate(){}
it not compeltely safe but safer than eval(); for real life calculator people 
uses libaries like math.js which parse math experation without executing
arbitrary code at all

*/


"Hello" + " " + "World" // → "Hello World"