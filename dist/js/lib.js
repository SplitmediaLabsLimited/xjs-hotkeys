/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 23);
/******/ })
/************************************************************************/
/******/ ({

/***/ 20:
/***/ (function(module, exports) {

/**
 * @name Evemit
 * @description Minimal and fast JavaScript event emitter for Node.js and front-end.
 * @author Nicolas Tallefourtane <dev@nicolab.net>
 * @link https://github.com/Nicolab/evemit
 * @license MIT https://github.com/Nicolab/evemit/blob/master/LICENSE
 */
;(function() {

  'use strict';

  /**
   * Evemit
   *
   * @constructor
   * @api public
   */
  function Evemit() {
    this.events = {};
  }

  /**
   * Register a new event listener for a given event.
   *
   * @param {string}   event      Event name.
   * @param {function} fn         Callback function (listener).
   * @param {*}        [context]  Context for function execution.
   * @return {Evemit} Current instance.
   * @api public
   */
  Evemit.prototype.on = function(event, fn, context) {

    if (!this.events[event]) {
      this.events[event] = [];
    }

    if(context) {
      fn._E_ctx = context;
    }

    this.events[event].push(fn);

    return this;
  };

  /**
   * Add an event listener that's only called once.
   *
   * @param {string}    event      Event name.
   * @param {function}  fn         Callback function (listener).
   * @param {*}         [context]  Context for function execution.
   * @return {Evemit} Current instance.
   * @api public
   */
  Evemit.prototype.once = function(event, fn, context) {
    fn._E_once = true;
    return this.on(event, fn, context);
  };

  /**
   * Emit an event to all registered event listeners.
   *
   * @param  {string} event      Event name.
   * @param  {*}      [...arg]   One or more arguments to pass to the listeners.
   * @return {bool} Indication, `true` if at least one listener was executed,
   * otherwise returns `false`.
   * @api public
   */
  Evemit.prototype.emit = function(event, arg1, arg2, arg3, arg4) {

    var fn, evs, args, aLn;

    if(!this.events[event]) {
      return false;
    }

    args = Array.prototype.slice.call(arguments, 1);
    aLn  = args.length;
    evs  = this.events[event];

    for(var i = 0, ln = evs.length; i < ln; i++) {

      fn = evs[i];

      if (fn._E_once) {
        this.off(event, fn);
      }

      // Function.apply() is a bit slower, so try to do without
      switch (aLn) {
        case 0:
          fn.call(fn._E_ctx);
          break;
        case 1:
          fn.call(fn._E_ctx, arg1);
          break;
        case 2:
          fn.call(fn._E_ctx, arg1, arg2);
          break;
        case 3:
          fn.call(fn._E_ctx, arg1, arg2, arg3);
          break;
        case 4:
          fn.call(fn._E_ctx, arg1, arg2, arg3, arg4);
          break;
        default:
          fn.apply(fn._E_ctx, args);
      }
    }

    return true;
  };

  /**
   * Remove event listeners.
   *
   * @param {string}   event  The event to remove.
   * @param {function} fn     The listener that we need to find.
   * @return {Evemit} Current instance.
   * @api public
   */
  Evemit.prototype.off = function(event, fn) {

    if (!this.events[event]) {
      return this;
    }

    for (var i = 0, ln = this.events[event].length; i < ln; i++) {

      if (this.events[event][i] === fn) {

        this.events[event][i] = null;
        delete this.events[event][i];
      }
    }

    // re-index
    this.events[event] = this.events[event].filter(function(ltns) {
      return typeof ltns !== 'undefined';
    });

    return this;
  };

  /**
   * Get a list of assigned event listeners.
   *
   * @param {string} [event] The events that should be listed.
   * If not provided, all listeners are returned.
   * Use the property `Evemit.events` if you want to get an object like
   * ```
   * {event1: [array of listeners], event2: [array of listeners], ...}
   * ```
   *
   * @return {array}
   * @api public
   */
  Evemit.prototype.listeners = function(event) {
    var evs, ltns;

    if(event) {
      return this.events[event] || [];
    }

    evs  = this.events;
    ltns = [];

    for(var ev in evs) {
      ltns = ltns.concat(evs[ev].valueOf());
    }

    return ltns;
  };

  /**
   * Expose Evemit
   * @type {Evemit}
   */
  if(typeof module !== 'undefined' && module.exports) {
    module.exports = Evemit;
  } else {
    window.Evemit = Evemit;
  }

})();


/***/ }),

/***/ 23:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _evemit = __webpack_require__(20);

var _evemit2 = _interopRequireDefault(_evemit);

var _KeyStrokeLib = __webpack_require__(5);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _keyEventEmitter = new _evemit2.default();
var _xjsObj = {};

var KeyStrokeHandler = function () {
  function KeyStrokeHandler() {
    _classCallCheck(this, KeyStrokeHandler);
  }

  _createClass(KeyStrokeHandler, null, [{
    key: "assignXjs",
    value: function assignXjs(xjsObj) {
      _xjsObj = xjsObj;
      if (!_xjsObj && !_xjsObj.hasOwnProperty("Dll")) {
        return new Error("Invalid xjs object parameter");
      }
    }
  }, {
    key: "initWithXjsDllHook",
    value: function initWithXjsDllHook(xjsObj) {
      _xjsObj = xjsObj;
      if (_xjsObj && _xjsObj.hasOwnProperty("Dll")) {
        var dll = _xjsObj.Dll;
        dll.load(["Scriptdlls\\SplitMediaLabs\\XjsEx.dll"]);
        dll.on("access-granted", function () {
          KeyStrokeHandler.assignHookOnAccessGranted();
        });
        dll.on("access-revoked", function () {
          KeyStrokeHandler.removeHookOnRevoke();
        });
        dll.isAccessGranted().then(function (isGranted) {
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
  }, {
    key: "assignHookOnAccessGranted",
    value: function assignHookOnAccessGranted() {
      window.OnDllOnInputHookEvent = KeyStrokeHandler.readHookEvent.bind(_xjsObj.Dll);
      _xjsObj.Dll.callEx("xsplit.HookSubscribe").then(function () {}).catch(function (err) {
        console.error(err.message);
      });
    }
  }, {
    key: "removeHookOnRevoke",
    value: function removeHookOnRevoke() {
      window.OnDllOnInputHookEvent = function () {};
    }
  }, {
    key: "readHookEvent",
    value: function readHookEvent(msg, wparam, lparam) {
      var _hookMessageType = _KeyStrokeLib.KeyStrokeLib.hookMessageType();
      var _mouseMap = _KeyStrokeLib.KeyStrokeLib.mouseMap();

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
  }, {
    key: "handleMouseScroll",
    value: function handleMouseScroll(mouseEvent) {
      KeyStrokeHandler.processMouseEvent(mouseEvent);
    }
  }, {
    key: "handleMouseUp",
    value: function handleMouseUp(mouseEvent) {
      KeyStrokeHandler.processMouseEvent(mouseEvent);
    }
  }, {
    key: "processMouseEvent",
    value: function processMouseEvent(mouseEvent) {
      var _eventValue = KeyStrokeHandler.detectCombinedKeys();
      _eventValue.event = _eventValue.event + _eventValue.sep + mouseEvent;
      if (_eventValue.event && _eventValue.event !== "") {
        _keyEventEmitter.emit(_eventValue.event, _eventValue.event);
      }
    }
  }, {
    key: "handleKeydown",
    value: function handleKeydown(wparam, lparam) {
      if (_KeyStrokeLib.KeyStrokeLib.combinedKeyPressed().hasOwnProperty(wparam)) {
        _KeyStrokeLib.KeyStrokeLib.combinedKeyPressed()[wparam].active = true;
      }
    }
  }, {
    key: "handleKeyup",
    value: function handleKeyup(wparam, lparam) {
      if (_KeyStrokeLib.KeyStrokeLib.combinedKeyPressed().hasOwnProperty(wparam)) {
        _KeyStrokeLib.KeyStrokeLib.combinedKeyPressed()[wparam].active = false;
      }
      if (_KeyStrokeLib.KeyStrokeLib.wParamMap().hasOwnProperty(wparam)) {
        KeyStrokeHandler.processKeyEvent(wparam, lparam);
      }
    }
  }, {
    key: "detectCombinedKeys",
    value: function detectCombinedKeys() {
      var _combinedKeysMap = new Map();
      var _activeEvent = "";
      for (var key in _KeyStrokeLib.KeyStrokeLib.combinedKeyPressed()) {
        if (_KeyStrokeLib.KeyStrokeLib.combinedKeyPressed().hasOwnProperty(key)) {
          if (_KeyStrokeLib.KeyStrokeLib.combinedKeyPressed()[key].active) {
            _combinedKeysMap.set(_KeyStrokeLib.KeyStrokeLib.combinedKeyPressed()[key].value, key);
          }
        }
      }
      var _newSortedMap = new Map([].concat(_toConsumableArray(_combinedKeysMap.entries())).sort());
      var _sep = "";
      _newSortedMap.forEach(function (value, key, map) {
        _activeEvent = _activeEvent + _sep + key;
        _sep = "+";
      });
      return { event: _activeEvent, sep: _sep };
    }
  }, {
    key: "processKeyEvent",
    value: function processKeyEvent(wparam, lparam) {
      var _eventValue = KeyStrokeHandler.detectCombinedKeys();
      var _wParam = _KeyStrokeLib.KeyStrokeLib.wParamMap();
      _eventValue.event = _eventValue.event + _eventValue.sep + _wParam[wparam];
      if (_eventValue.event && _eventValue.event !== "") {
        _keyEventEmitter.emit(_eventValue.event, _eventValue.event);
      }
    }
  }, {
    key: "on",
    value: function on(event, handler) {
      if (event && event !== "" && event !== "None") {
        _keyEventEmitter.on(event, handler);
      }
    }
  }, {
    key: "off",
    value: function off(event, handler) {
      if (event && event !== "" && event !== "None") {
        _keyEventEmitter.off(event, handler);
      }
    }
  }]);

  return KeyStrokeHandler;
}();

exports.default = KeyStrokeHandler;

/***/ }),

/***/ 5:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

//all keys
var W_PARAM_MAP = {
  8: "Backspace",
  9: "Tab",
  12: "Num5", // VK_CLEAR. Sent when Num5 is pressed with NumLock off.
  13: "Enter",
  16: "Shift",
  17: "Ctrl",
  18: "Alt",
  19: "Pause",
  20: "CapsLock",
  27: "Esc",
  32: "Space",
  33: "PageUp",
  34: "PageDown",
  35: "End",
  36: "Home",
  37: "Left",
  38: "Up",
  39: "Right",
  40: "Down",
  44: "PrtScr",
  45: "Insert",
  46: "Delete",
  48: "0",
  49: "1",
  50: "2",
  51: "3",
  52: "4",
  53: "5",
  54: "6",
  55: "7",
  56: "8",
  57: "9",
  65: "A",
  66: "B",
  67: "C",
  68: "D",
  69: "E",
  70: "F",
  71: "G",
  72: "H",
  73: "I",
  74: "J",
  75: "K",
  76: "L",
  77: "M",
  78: "N",
  79: "O",
  80: "P",
  81: "Q",
  82: "R",
  83: "S",
  84: "T",
  85: "U",
  86: "V",
  87: "W",
  88: "X",
  89: "Y",
  90: "Z",
  91: "LCommand",
  92: "RCommand",
  93: "Menu",
  96: "Num0",
  97: "Num1",
  98: "Num2",
  99: "Num3",
  100: "Num4",
  101: "Num5",
  102: "Num6",
  103: "Num7",
  104: "Num8",
  105: "Num9",
  106: "*",
  107: "+",
  109: "-",
  110: ".",
  111: "/",
  112: "F1",
  113: "F2",
  114: "F3",
  115: "F4",
  116: "F5",
  117: "F6",
  118: "F7",
  119: "F8",
  120: "F9",
  121: "F10",
  122: "F11",
  123: "F12",
  144: "NumLock",
  145: "ScrollLock",
  160: "Shift",
  161: "Shift",
  162: "Ctrl",
  163: "Ctrl",
  164: "Alt",
  165: "Alt",
  186: ";",
  187: "=",
  188: ",",
  189: "-",
  190: ".",
  191: "/",
  192: "`",
  219: "[",
  220: "Backslash",
  221: "]",
  222: "Quote"
};

//javascript mouse key values
var MOUSE_MAP = {
  0: "MOUSE LEFT",
  left: "MOUSE LEFT",
  1: "MOUSE MIDDLE",
  middle: "MOUSE MIDDLE",
  2: "MOUSE RIGHT",
  right: "MOUSE RIGHT",
  wheel: "MOUSE WHEEL"
};

// hook message constants
var HOOK_MESSAGE_TYPE = {
  WM_KEYDOWN: 0x0100,
  WM_KEYUP: 0x0101,
  WM_SYSKEYDOWN: 0x0104,
  WM_SYSKEYUP: 0x0105,
  WM_LBUTTONDOWN: 0x0201,
  WM_LBUTTONUP: 0x0202,
  WM_MOUSEMOVE: 0x0200,
  WM_MOUSEWHEEL: 0x020a,
  WM_MOUSEHWHEEL: 0x020e,
  WM_RBUTTONDOWN: 0x0204,
  WM_RBUTTONUP: 0x0205,
  WM_MBUTTONDOWN: 0x0207,
  WM_MBUTTONUP: 0x0208
};

//restricted keys
var RESTRICTED_SPECIALKEYS = {
  8: "Backspace",
  9: "Tab",
  13: "Enter",
  19: "Pause",
  20: "CapsLock",
  27: "Esc",
  32: "Space",
  33: "PageUp",
  34: "PageDown",
  35: "End",
  36: "Home",
  37: "Left",
  38: "Up",
  39: "Right",
  40: "Down",
  45: "Insert",
  46: "Delete",
  106: "*",
  110: ".",
  111: "/",
  144: "NumLock",
  145: "ScrollLock"
};

//special keys
var SPECIALKEYS = {
  16: "Shift",
  160: "Shift",
  161: "Shift",
  17: "Ctrl",
  162: "Ctrl",
  163: "Ctrl",
  18: "Alt",
  164: "Alt",
  165: "Alt",
  96: "Num0",
  97: "Num1",
  98: "Num2",
  99: "Num3",
  100: "Num4",
  101: "Num5",
  102: "Num6",
  103: "Num7",
  104: "Num8",
  105: "Num9",
  107: "+",
  109: "-",
  112: "F1",
  113: "F2",
  114: "F3",
  115: "F4",
  116: "F5",
  117: "F6",
  118: "F7",
  119: "F8",
  120: "F9",
  121: "F10",
  122: "F11",
  123: "F12"
};

var _combinationKeys = {
  160: {
    active: false,
    value: "Shift"
  },
  161: {
    active: false,
    value: "Shift"
  },
  162: {
    active: false,
    value: "Ctrl"
  },
  163: {
    active: false,
    value: "Ctrl"
  },
  164: {
    active: false,
    value: "Alt"
  },
  165: {
    active: false,
    value: "Alt"
  },
  16: {
    active: false,
    value: "Shift"
  },
  17: {
    active: false,
    value: "Ctrl"
  },
  18: {
    active: false,
    value: "Alt"
  }
};

var KeyStrokeLib = exports.KeyStrokeLib = function () {
  function KeyStrokeLib() {
    _classCallCheck(this, KeyStrokeLib);
  }

  _createClass(KeyStrokeLib, null, [{
    key: "combinedKeyPressed",
    value: function combinedKeyPressed() {
      return _combinationKeys;
    }
  }, {
    key: "wParamMap",
    value: function wParamMap() {
      return W_PARAM_MAP;
    }
  }, {
    key: "hookMessageType",
    value: function hookMessageType() {
      return HOOK_MESSAGE_TYPE;
    }
  }, {
    key: "restrictedSpecialKeys",
    value: function restrictedSpecialKeys() {
      return RESTRICTED_SPECIALKEYS;
    }
  }, {
    key: "specialKeys",
    value: function specialKeys() {
      return SPECIALKEYS;
    }
  }, {
    key: "mouseMap",
    value: function mouseMap() {
      return MOUSE_MAP;
    }
  }]);

  return KeyStrokeLib;
}();

/***/ })

/******/ });