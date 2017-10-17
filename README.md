This project was bootstrapped with [Create React App](https://github.com/facebookincubator/create-react-app).

# xui-keystrokes

This is a small library for handling key and midi strokes specifically for Xsplit Broadcaster.
There is a postinstall script that generates a production build for distribution or manually invoke using command "webpack --env.production".

### KeyStrokeHandler object needs xjs to fully function.
- most methods of the class are static
- this handles both recieving and emitting key and midi strokes.

assignXjs(xjsObj)
  - encapsulates xjs object within the class.  

initWithXjsDllHook(xjsObj)
  - encapsulates xjs object within the class and loads the Xsplit Dll to listen for keyStrokes.

initMidiHook()
  - loads Xsplit Midi Dll to listen to Midi device inputs.

on(event, handler)
  - sets emitter for the event.

off(event, handler)
- removes emitter for the event.

### XUIKeyStrokes
- a react component to accept and display key and midi strokes.

### Example usage

#### package.json

"xjs-hotkeys": "git+https://github.com/xjsframework/xjs-hotkeys.git",
"xjs-framework": "git+https://github.com/xjsframework/xjs.git"

#### sample.js

import React from "react";
import ReactDOM from "react-dom";
import xjs from '../node_modules/xjs-framework/dist/xjs-es2015.min.js';
import { KeyStrokeHandler, XUIKeyStrokes } from "xjs-hotkeys";

xjs.ready().then(() => {

  KeyStrokeHandler.initWithXjsDllHook(xjs);
  KeyStrokeHandler.initMidiHook();

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

  renderReact();

});



