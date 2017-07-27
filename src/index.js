import React from "react";
import ReactDOM from "react-dom";
import "./css/index.css";
import registerServiceWorker from "./registerServiceWorker";
import KeyStrokeHandler from "./js/lib/KeyStrokeHandler.js";
import xjs from "../node_modules/xjs-framework/dist/xjs-es2015.min.js";

document.onselectstart = function(event) {
  var nodeName = event.target.nodeName;
  if (
    nodeName === "INPUT" ||
    nodeName === "TEXTAREA" ||
    event.target.contentEditable === true
  ) {
    return true;
  } else {
    return false;
  }
};

document.onkeydown = function(event) {
  if (
    (event.target || event.srcElement).nodeName !== "INPUT" &&
    (event.target || event.srcElement).nodeName !== "TEXTAREA" &&
    (event.target || event.srcElement).contentEditable !== true
  ) {
    if (event.keyCode === 8) return false;
  }
};

document.oncontextmenu = function() {
  return false;
};

let event1 = "S";
let event2 = "A";
let event3 = "Ctrl+S";
let event4 = "Alt+Ctrl+Shift+Q";

function messageFunc1(){ 
  console.log("Function: " + event1); 
}

function messageFunc2(){ 
  console.log("Function: " + event2); 
}

function messageFunc3(){ 
  console.log("Function: " + event3); 
}

function messageFunc4(){ 
  console.log("Function: " + event4); 
}

xjs.ready().then(() => {  
  KeyStrokeHandler.initialize(xjs);
  window.SomeKeyHandler = KeyStrokeHandler; 
  KeyStrokeHandler.on(event1, messageFunc1);
  KeyStrokeHandler.on(event2, messageFunc2);
  KeyStrokeHandler.on(event3, messageFunc3);
  KeyStrokeHandler.on(event4, messageFunc4);  
});
