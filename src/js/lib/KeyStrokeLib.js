//all keys
const W_PARAM_MAP = {
  8: "Backspace",
  9: "Tab",
  12: "Num5", // VK_CLEAR. Sent when Num5 is pressed with NumLock off.
  13: ["Enter", "NumEnter"],
  19: "Pause",
  20: "CapsLock",
  27: "Esc",
  32: "Space",
  33: ["Num9", "PageUp"],
  34: ["Num3", "PageDown"],
  35: ["Num1", "End"],
  36: ["Num7", "Home"],
  37: ["Num4", "Left"],
  38: ["Num8", "Up"],
  39: ["Num6", "Right"],
  40: ["Num2", "Down"],
  44: "PrtScr",
  45: ["Num0", "Insert"],
  46: ["NumDecimal", "Delete"],
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
  106: "Multiply",
  107: "Add",
  109: "Subtract",
  110: "NumDecimal",
  111: "Divide",
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
  160: "LShift",
  161: "RShift",
  162: "LCtrl",
  163: "RCtrl",
  164: "LAlt",
  165: "RAlt",
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

// hook message constants
const HOOK_MESSAGE_TYPE = {
  WM_KEYDOWN: 0x0100,
  WM_KEYUP: 0x0101,
  WM_SYSKEYDOWN: 0x0104,
  WM_SYSKEYUP: 0x0105
};

//restricted keys
const RESTRICTED_SPECIALKEYS = {
  8: "backspace",
  9: "tab",
  13: "return",
  19: "pause",
  20: "capslock",
  27: "esc",
  32: "space",
  33: "pageup",
  34: "pagedown",
  35: "end",
  36: "home",
  37: "left",
  38: "up",
  39: "right",
  40: "down",
  45: "insert",
  46: "del",
  106: "*",
  110: ".",
  111: "/",
  144: "numlock",
  145: "scroll",
  224: "meta"
};

//special keys
const SPECIALKEYS = {
  16: "Shift",
  160: "Shift",
  161: "Shift",
  17: "Control",
  162: "Control",
  163: "Control",
  18: "Alt",
  164: "Alt",
  165: "Alt",
  96: "NumPad0",
  97: "NumPad1",
  98: "NumPad2",
  99: "NumPad3",
  100: "NumPad4",
  101: "NumPad5",
  102: "NumPad6",
  103: "NumPad7",
  104: "NumPad8",
  105: "NumPad9",
  107: "OemPlus",
  109: "OemMinus",
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

export default class KeyStrokeLib {
  static _combinedKeyPressed = {
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
    }
  };

  static wParamMap() {
    return W_PARAM_MAP;
  }

  static hookMessageType() {
    return HOOK_MESSAGE_TYPE;
  }

  static restrictedSpecialKeys() {
    return RESTRICTED_SPECIALKEYS;
  }

  static specialKeys() {
    return SPECIALKEYS;
  }
}
