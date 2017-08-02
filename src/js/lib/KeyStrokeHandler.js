import Evemit from "evemit";
import { KeyStrokeLib } from "./KeyStrokeLib.js";

let _KeyStrokeHandlerEventEmitter = new Evemit();
let _KeyStrokeHandlerXJS = {};

export default class KeyStrokeHandler {

  static assignXjs(xjsObj) {
    _KeyStrokeHandlerXJS = xjsObj;
    if (!_KeyStrokeHandlerXJS && !_KeyStrokeHandlerXJS.hasOwnProperty("Dll")) {
      return new Error("Invalid xjs object parameter");
    }
  }

  static initWithXjsDllHook(xjsObj) {
    _KeyStrokeHandlerXJS = xjsObj;
    if (_KeyStrokeHandlerXJS && _KeyStrokeHandlerXJS.hasOwnProperty("Dll")) {
      let dll = _KeyStrokeHandlerXJS.Dll;
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
      _KeyStrokeHandlerXJS.Dll
    );
    _KeyStrokeHandlerXJS.Dll
      .callEx("xsplit.HookSubscribe")
      .then(() => {})
      .catch(err => {
        console.error(err.message);
      });
  }

  static removeHookOnRevoke() {
    window.OnDllOnInputHookEvent = () => {};
  }

  static readHookEvent(msg, wparam, lparam) {
    let _hookMessageType = KeyStrokeLib.hookMessageType();

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
      default:
        break;
    }
  }

  static handleKeydown(wparam, lparam) {
    if (KeyStrokeLib._combinedKeyPressed().hasOwnProperty(wparam)) {
      KeyStrokeLib._combinedKeyPressed()[wparam].active = true;
    }
  }

  static handleKeyup(wparam, lparam) {
    if (KeyStrokeLib._combinedKeyPressed().hasOwnProperty(wparam)) {
      KeyStrokeLib._combinedKeyPressed()[wparam].active = false;
    } else if (KeyStrokeLib.wParamMap().hasOwnProperty(wparam)) {
      KeyStrokeHandler.processKeyEvent(wparam, lparam);
    }
  }

  static processKeyEvent(wparam, lparam) {
    let _combinedKeysMap = new Map();
    let _keyPress = "";
    for (let key in KeyStrokeLib._combinedKeyPressed()) {
      if (KeyStrokeLib._combinedKeyPressed().hasOwnProperty(key)) {
        if (KeyStrokeLib._combinedKeyPressed()[key].active) {
          _combinedKeysMap.set(
            KeyStrokeLib._combinedKeyPressed()[key].value,
            key
          );
        }
      }
    }

    let _newSortedMap = new Map([..._combinedKeysMap.entries()].sort());
    let _sep = "";
    _newSortedMap.forEach((value, key, map) => {
      _keyPress = _keyPress + _sep + key;
      _sep = "+";
    });

    let _wParam = KeyStrokeLib.wParamMap();
    _keyPress = _keyPress + _sep + _wParam[wparam];

    if (_keyPress && _keyPress !== "")
      _KeyStrokeHandlerEventEmitter.emit(_keyPress, _keyPress);
  }

  static on(event, handler) {
    if (event && event !== "" && event !== "None") {
      _KeyStrokeHandlerEventEmitter.on(event, handler);
    }
  }

  static off(event, handler) {
    if (event && event !== "" && event !== "None") {
      _KeyStrokeHandlerEventEmitter.off(event, handler);
    }
  }
}
