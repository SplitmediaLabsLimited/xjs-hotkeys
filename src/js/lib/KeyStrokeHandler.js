import Evemit from 'evemit';
import { KeyStrokeLib } from './KeyStrokeLib.js';

let _keyEventEmitter = new Evemit();
let _xjsObj = {};
let _midiClientId = '';
let _preventEmitKeyHandler = false;

export default class KeyStrokeHandler {
  static assignXjs(xjsObj) {
    _xjsObj = xjsObj;
    if (!_xjsObj && !_xjsObj.hasOwnProperty('Dll')) {
      return new Error('Invalid xjs object parameter');
    }
  }

  static preventKeyHandlerEmit(value) {
    _preventEmitKeyHandler = value;
  }

  static initWithXjsDllHook(xjsObj) {
    _xjsObj = xjsObj;
    KeyStrokeHandler.removeHookOnRevoke();
    if (_xjsObj && _xjsObj.hasOwnProperty('Dll')) {
      let dll = _xjsObj.Dll;
      dll.load(['Scriptdlls\\SplitMediaLabs\\XSplitScriptPluginInternal.dll']);
      dll.on('access-granted', () => {
        KeyStrokeHandler.assignHookOnAccessGranted();
      });
      dll.on('access-revoked', () => {
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
      return new Error('Invalid xjs object parameter');
    }
  }

  static assignHookOnAccessGranted() {
    _xjsObj.Dll
      .callEx('xsplit.HookSubscribe')
      .then(() => {
        window.OnDllOnInputHookEvent = KeyStrokeHandler.readHookEvent;
      })
      .catch(err => {
        KeyStrokeHandler.removeHookOnRevoke();
        console.error(err.message);
      });
  }

  static removeHookOnRevoke() {
    _xjsObj.Dll
      .callEx('xsplit.HookUnsubscribe')
      .then(() => {
        window.OnDllOnInputHookEvent = () => {};
      })
      .catch(err => {
        window.OnDllOnInputHookEvent = () => {};
        console.error(err.message);
      });
  }

  static readHookEvent(msg, wparam, lparam) {
    let _hookMessageType = KeyStrokeLib.hookMessageType();
    let _mouseMap = KeyStrokeLib.mouseMap();

    console.log('hook message', msg, parseInt(msg, 10));

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
        KeyStrokeHandler.handleMouseUp(_mouseMap['left']);
        break;
      case _hookMessageType.WM_RBUTTONUP:
        KeyStrokeHandler.handleMouseUp(_mouseMap['right']);
        break;
      case _hookMessageType.WM_MBUTTONUP:
        KeyStrokeHandler.handleMouseUp(_mouseMap['middle']);
        break;
      case _hookMessageType.WM_MOUSEWHEEL:
      case _hookMessageType.WM_MOUSEHWHEEL:
        KeyStrokeHandler.handleMouseScroll(_mouseMap['wheel']);
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
    if (_eventValue.event && _eventValue.event !== '') {
      if (!_preventEmitKeyHandler) {
        _keyEventEmitter.emit(_eventValue.event, _eventValue.event);
      }
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
    let _activeEvent = '';
    for (let key in KeyStrokeLib.combinedKeyPressed()) {
      if (KeyStrokeLib.combinedKeyPressed().hasOwnProperty(key)) {
        if (KeyStrokeLib.combinedKeyPressed()[key].active) {
          _combinedKeysMap.set(KeyStrokeLib.combinedKeyPressed()[key].value, key);
        }
      }
    }
    let _sep = '';

    if (_combinedKeysMap.has('Ctrl')) {
      _activeEvent = _activeEvent + _sep + 'Ctrl';
      _sep = '+';
    }

    if (_combinedKeysMap.has('Shift')) {
      _activeEvent = _activeEvent + _sep + 'Shift';
      _sep = '+';
    }

    if (_combinedKeysMap.has('Alt')) {
      _activeEvent = _activeEvent + _sep + 'Alt';
      _sep = '+';
    }

    return { event: _activeEvent, sep: _sep };
  }

  static processKeyEvent(wparam, lparam) {
    let _eventValue = KeyStrokeHandler.detectCombinedKeys();
    let _wParam = KeyStrokeLib.wParamMap();
    _eventValue.event = _eventValue.event + _eventValue.sep + _wParam[wparam];
    if (_eventValue.event && _eventValue.event !== '') {
      if (!_preventEmitKeyHandler) {
        _keyEventEmitter.emit(_eventValue.event, _eventValue.event);
      }
    }
  }

  //Initialize Midi Devices
  static initMidiHook() {
    _xjsObj.Dll
      .call('xsplit.Midi.StartMonitor')
      .then(midiClientId => {
        _midiClientId = midiClientId ? midiClientId : '';
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
    let midiClient = localStorage.getItem('midiClient');
    if (midiClient && midiClient !== '')
      window.external.CallDll('xsplit.Midi.StopMonitor', midiClient);
  }

  static removeMidiHook() {
    window.external.CallDll('xsplit.Midi.StopMonitor', _midiClientId);
    localStorage.setItem('midiClient', _midiClientId);
    _midiClientId = '';
    window.OnDllMidiChannelMessage = () => {};
  }

  static createStopMidiMonitorEvent() {
    window.addEventListener('beforeunload', event => {
      KeyStrokeHandler.removeMidiHook();
    });
  }

  static readMidiHookEvent(type, channel, data1, data2) {
    let _midiEvent = '';    
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
      _midiEvent = _midiMessage[type] + ' ' + channel + ':' + data1;
      if (!_preventEmitKeyHandler) {
        _keyEventEmitter.emit(_midiEvent, _midiEvent);
      }
    }
  }

  static on(event, handler) {
    if (event && event !== '' && event !== 'None') {
      _keyEventEmitter.on(event, handler);
    }
  }

  static off(event, handler) {
    if (event && event !== '' && event !== 'None') {
      _keyEventEmitter.off(event, handler);
    }
  }
}
