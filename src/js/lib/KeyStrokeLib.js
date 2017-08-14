//all keys
const W_PARAM_MAP = {
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
const MOUSE_MAP = {
  0: "MLeft",
  left: "MLeft",
  1: "MCenter",
  middle: "MCenter",
  2: "MRight",
  right: "MRight",
  wheel: "MWheel"
};

// hook message constants
const HOOK_MESSAGE_TYPE = {
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
const RESTRICTED_SPECIALKEYS = {
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
const SPECIALKEYS = {
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

const MIDI_MESSAGETYPE = {
  8: "NoteOff",
  9: "NoteOn",
  10: "PolyphonicAftertouch",
  11: "ControlChange",
  12: "ProgramChange",
  13: "ChannelAftertouch",
  14: "PitchWheel"
};

let _combinationKeys = {
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

export class KeyStrokeLib {
  static combinedKeyPressed() {
    return _combinationKeys;
  }

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

  static mouseMap() {
    return MOUSE_MAP;
  }

  static midiMessageType() {
    return MIDI_MESSAGETYPE;
  }
}
