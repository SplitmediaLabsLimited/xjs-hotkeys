import React from 'react';
import ReactDOM from 'react-dom';
import './css/index.css';
import registerServiceWorker from './registerServiceWorker';
import KeyStrokeHandler from './js/lib/KeyStrokeHandler.js';
import XUIKeyStrokes from './js/component/XUIKeyStrokes.js';
import xjs from '../node_modules/xjs-framework/dist/xjs-es2015.min.js';

document.onselectstart = function(event) {
  var nodeName = event.target.nodeName;
  if (nodeName === 'INPUT' || nodeName === 'TEXTAREA' || event.target.contentEditable === true) {
    return true;
  } else {
    return false;
  }
};

document.onkeydown = function(event) {
  if (
    (event.target || event.srcElement).nodeName !== 'INPUT' &&
    (event.target || event.srcElement).nodeName !== 'TEXTAREA' &&
    (event.target || event.srcElement).contentEditable !== true
  ) {
    if (event.keyCode === 8) return false;
  }
};

document.oncontextmenu = function() {
  return false;
};

xjs.ready().then(() => {
  let dll = xjs.Dll;
  dll.load(['Scriptdlls\\SplitMediaLabs\\XjsEx.dll']).then(() => {
    KeyStrokeHandler.assignXjs(xjs);

    dll.on('access-granted', () => {
      KeyStrokeHandler.assignHookOnAccessGranted();
      KeyStrokeHandler.initMidiHook();
    });

    dll.on('access-revoked', () => {
      KeyStrokeHandler.removeHookOnRevoke();
    });

    dll.isAccessGranted().then(isGranted => {
      if (isGranted) {
        KeyStrokeHandler.assignHookOnAccessGranted();
        KeyStrokeHandler.initMidiHook();
      } else {
        KeyStrokeHandler.removeHookOnRevoke();
      }
    });
  });

  let hotKey = obj => {
    console.log('HOTKEY: emitted event ' + obj);
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

  let clickDown = () => {
    let input = document.querySelectorAll('[data-key="keyStroke1"]')[0];
    KeyStrokeHandler.onDown(input.value, hotKey);
  };

  let clickDownOff = () => {
    let input = document.querySelectorAll('[data-key="keyStroke1"]')[0];
    KeyStrokeHandler.offDown(input.value, hotKey);
  };

  let clickOn1 = () => {
    let input = document.querySelectorAll('[data-key="keyStroke2"]')[0];
    KeyStrokeHandler.on(input.value, hotKey);
  };

  let clickOff1 = () => {
    let input = document.querySelectorAll('[data-key="keyStroke2"]')[0];
    KeyStrokeHandler.off(input.value, hotKey);
  };

  let clickDown1 = () => {
    let input = document.querySelectorAll('[data-key="keyStroke2"]')[0];
    KeyStrokeHandler.onDown(input.value, hotKey);
  };

  let clickDownOff1 = () => {
    let input = document.querySelectorAll('[data-key="keyStroke2"]')[0];
    KeyStrokeHandler.offDown(input.value, hotKey);
  };

  let renderReact = () => {
    ReactDOM.render(
      <div>
        <XUIKeyStrokes
          placeholderText="None"
          inputName="keyStroke1"
          onValueChange={changeFunc}
          onInitialization={changeFunc}
          KeyStrokeHandler={KeyStrokeHandler}
        />
        <button onClick={clickOn}>On</button>
        <button onClick={clickOff}>Off</button>
        <button onClick={clickDown}>On DOWN</button>
        <button onClick={clickDownOff}>Off DOWN</button>
        <br />
        <XUIKeyStrokes
          placeholderText="None"
          inputName="keyStroke2"
          onValueChange={changeFunc}
          onInitialization={changeFunc}
          KeyStrokeHandler={KeyStrokeHandler}
        />
        <button onClick={clickOn1}>On</button>
        <button onClick={clickOff1}>Off</button>
        <button onClick={clickDown1}>On DOWN</button>
        <button onClick={clickDownOff1}>Off DOWN</button>
      </div>,
      document.getElementById('root')
    );
    registerServiceWorker();
  };
  renderReact();
});
