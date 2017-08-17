import Evemit from "evemit";
import { KeyStrokeLib } from "./KeyStrokeLib.js";

let _keyEventEmitter = new Evemit();
let _xjsObj = {};
let _midiClientId = "";

export default class KeyStrokeHandler {
  static assignXjs(xjsObj) {
    _xjsObj = xjsObj;
    if (!_xjsObj && !_xjsObj.hasOwnProperty("Dll")) {
      return new Error("Invalid xjs object parameter");
    }
  }

  static initWithXjsDllHook(xjsObj) {
    _xjsObj = xjsObj;
    if (_xjsObj && _xjsObj.hasOwnProperty("Dll")) {
      let dll = _xjsObj.Dll;
      dll.load(["Scriptdlls\\SplitMediaLabs\\XjsEx.dll"]);
      dll.on("access-granted", () => {
        KeyStrokeHandler.assignHookOnAccessGranted();
      });
      dll.on("access-revoked", () => {
        KeyStrokeHandler.removeHookOnRevoke();
      });
      dll.isAccessGranted().then(isGranted => {
        if (isGranted) {
          KeyStrokeHandler.assignHookOnAccessGranted();
        } else {
          KeyStrokeHandler.removeHookOnRevoke();
        }
      });
    } else {
      return new Error("Invalid xjs object parameter");
    }
  }

  static assignHookOnAccessGranted() {
    window.OnDllOnInputHookEvent = KeyStrokeHandler.readHookEvent.bind(
      _xjsObj.Dll
    );
    _xjsObj.Dll.callEx("xsplit.HookSubscribe").then(() => {}).catch(err => {
      console.error(err.message);
    });
  }

  static removeHookOnRevoke() {
    window.OnDllOnInputHookEvent = () => {};
  }

  static readHookEvent(msg, wparam, lparam) {
    let _hookMessageType = KeyStrokeLib.hookMessageType();
    let _mouseMap = KeyStrokeLib.mouseMap();

    //identify message type
    switch (parseInt(msg, 10)) {
      case _hookMessageType.WM_KEYDOWN:
      case _hookMessageType.WM_SYSKEYDOWN:
        KeyStrokeHandler.handleKeydown(wparam, lparam);
        break;
      case _hookMessageType.WM_KEYUP:
      case _hookMessageType.WM_SYSKEYUP:
        KeyStrokeHandler.handleKeyup(wparam, lparam);
        break;
      case _hookMessageType.WM_LBUTTONUP:
        KeyStrokeHandler.handleMouseUp(_mouseMap["left"]);
        break;
      case _hookMessageType.WM_RBUTTONUP:
        KeyStrokeHandler.handleMouseUp(_mouseMap["right"]);
        break;
      case _hookMessageType.WM_MBUTTONUP:
        KeyStrokeHandler.handleMouseUp(_mouseMap["middle"]);
        break;
      case _hookMessageType.WM_MOUSEWHEEL:
      case _hookMessageType.WM_MOUSEHWHEEL:
        KeyStrokeHandler.handleMouseScroll(_mouseMap["wheel"]);
        break;
      default:
        break;
    }
  }

  static handleMouseScroll(mouseEvent) {
    KeyStrokeHandler.processMouseEvent(mouseEvent);
  }

  static handleMouseUp(mouseEvent) {
    KeyStrokeHandler.processMouseEvent(mouseEvent);
  }

  static processMouseEvent(mouseEvent) {
    let _eventValue = KeyStrokeHandler.detectCombinedKeys();
    _eventValue.event = _eventValue.event + _eventValue.sep + mouseEvent;
    if (_eventValue.event && _eventValue.event !== "") {
      _keyEventEmitter.emit(_eventValue.event, _eventValue.event);
    }
  }

  static handleKeydown(wparam, lparam) {
    if (KeyStrokeLib.combinedKeyPressed().hasOwnProperty(wparam)) {
      KeyStrokeLib.combinedKeyPressed()[wparam].active = true;
    }
  }

  static handleKeyup(wparam, lparam) {
    if (KeyStrokeLib.combinedKeyPressed().hasOwnProperty(wparam)) {
      KeyStrokeLib.combinedKeyPressed()[wparam].active = false;
    }
    if (KeyStrokeLib.wParamMap().hasOwnProperty(wparam)) {
      KeyStrokeHandler.processKeyEvent(wparam, lparam);
    }
  }

  static detectCombinedKeys() {
    let _combinedKeysMap = new Map();
    let _activeEvent = "";
    for (let key in KeyStrokeLib.combinedKeyPressed()) {
      if (KeyStrokeLib.combinedKeyPressed().hasOwnProperty(key)) {
        if (KeyStrokeLib.combinedKeyPressed()[key].active) {
          _combinedKeysMap.set(
            KeyStrokeLib.combinedKeyPressed()[key].value,
            key
          );
        }
      }
    }
    let _newSortedMap = new Map([..._combinedKeysMap.entries()].sort());
    let _sep = "";
    _newSortedMap.forEach((value, key, map) => {
      _activeEvent = _activeEvent + _sep + key;
      _sep = "+";
    });
    return { event: _activeEvent, sep: _sep };
  }

  static processKeyEvent(wparam, lparam) {
    let _eventValue = KeyStrokeHandler.detectCombinedKeys();
    let _wParam = KeyStrokeLib.wParamMap();
    _eventValue.event = _eventValue.event + _eventValue.sep + _wParam[wparam];
    if (_eventValue.event && _eventValue.event !== "") {
      _keyEventEmitter.emit(_eventValue.event, _eventValue.event);
    }
  }

  //Initialize Midi Devices
  static initMidiHook() {
    _xjsObj.Dll
      .call("xsplit.Midi.StartMonitor")
      .then(midiClientId => {                
        _midiClientId = midiClientId;        
        window.OnDllMidiChannelMessage = KeyStrokeHandler.readMidiHookEvent;
        KeyStrokeHandler.cleanUpPreviousMidiHook();
        KeyStrokeHandler.createStopMidiMonitorEvent();
      })
      .catch(err => {
        console.error(err);
        KeyStrokeHandler.removeMidiHook();
      });
  }

  static cleanUpPreviousMidiHook() { 
    let midiClient = localStorage.getItem("midiClient");
    if(midiClient !== null) window.external.CallDll("xsplit.Midi.StopMonitor", midiClient);    
  }

  static removeMidiHook() {       
    window.external.CallDll("xsplit.Midi.StopMonitor", _midiClientId);
    localStorage.setItem("midiClient", _midiClientId);
    _midiClientId = "";
    window.OnDllMidiChannelMessage = () => {};
  }

  static createStopMidiMonitorEvent() {
    window.addEventListener("beforeunload", event => {
      KeyStrokeHandler.removeMidiHook();
    });
  }

  static readMidiHookEvent(type, channel, data1, data2) {
    let _midiEvent = "";
    if (
      Number.isNaN(type) ||
      Number.isNaN(channel) ||
      Number.isNaN(data1) ||
      Number.isNaN(data2) ||
      0 !== parseInt(data2, 10)
    ) {
      return;
    }
    let _midiMessage = KeyStrokeLib.midiMessageType();
    if (_midiMessage[type]) {
      _midiEvent = _midiMessage[type] + " " + channel + ":" + data1;
      _keyEventEmitter.emit(_midiEvent, _midiEvent);
    }
  }

  static on(event, handler) {
    if (event && event !== "" && event !== "None") {
      _keyEventEmitter.on(event, handler);
    }
  }

  static off(event, handler) {
    if (event && event !== "" && event !== "None") {
      _keyEventEmitter.off(event, handler);
    }
  }
}
