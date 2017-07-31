import React from "react";
import ReactDOM from "react-dom";
import "./css/index.css";
import registerServiceWorker from "./registerServiceWorker";
import KeyStrokeHandler from "./js/lib/KeyStrokeHandler.js";
import XUIKeyStrokes from "./js/component/XUIKeyStrokes.js";
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

xjs.ready().then(() => {
  KeyStrokeHandler.initialize(xjs);

  let hotKey = obj => {
    console.log("HotKey: emitted event " + obj);
  };

  let changeFunc = obj => {
    console.log(obj);
  };

  let clickOn = () => {
    let input = document.querySelectorAll('[data-key="keyStroke1"]')[0];
    KeyStrokeHandler.on(input.value, hotKey);
  };

  let clickOff = () => {
    let input = document.querySelectorAll('[data-key="keyStroke1"]')[0];
    KeyStrokeHandler.off(input.value, hotKey);
  };

  let renderReact = () => {
    ReactDOM.render(
      <div>
        <XUIKeyStrokes
          placeholderText="None"
          inputName="keyStroke1"
          onValueChange={changeFunc}
          onInitialization={changeFunc}
        />
        <button onClick={clickOn}>On</button>
        <button onClick={clickOff}>Off</button>
      </div>,
      document.getElementById("root")
    );
    registerServiceWorker();
  };
  renderReact();
});
