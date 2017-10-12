import React, { Component } from "react";
import "../../../src/css/XUIKeyStrokes.css";
import { KeyStrokeLib } from "../lib/KeyStrokeLib.js";

class XUIKeyStrokes extends Component {
  constructor(props) {
    super(props);
    this.onValueChange = this.onValueChange.bind(this);
    this.callValueChange = this.callValueChange.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
    this.onKeyUp = this.onKeyUp.bind(this);
    this.onDeleteClick = this.onDeleteClick.bind(this);
    this.onMouseDown = this.onMouseDown.bind(this);
    this.onMouseUp = this.onMouseUp.bind(this);
    this.onWheel = this.onWheel.bind(this);
    this.getInputKeyStoke = this.getInputKeyStoke.bind(this);
    this.getValueOnSave = this.getValueOnSave.bind(this);
    this.inputKeyStroke = null;
    this.onBlur = this.onBlur.bind(this);
    this.onFocus = this.onFocus.bind(this);
    this.oldDllMidiChannelMessage = () => {};
    this.noHotkeyValue = typeof props.noHotkeyValue !== 'undefined' ? props.noHotkeyValue : 'None';
    this.state = {
      previousValue: this.noHotkeyValue,
      prevKeyDownValue: '',
      toggleFocus: false,
      isEmpty: props.value ? props.value === '' : true
    };
  }

  onValueChange(value, dataKey) {
    let eventValue = value;
    this.setState({ previousValue: eventValue });
    if (value === '') {
      this.inputKeyStroke.value = this.noHotkeyValue ? this.noHotkeyValue : '';
      this.setState({ isEmpty: true });
    } else {
      this.setState({ isEmpty: false });
      this.inputKeyStroke.value = value;
    }
    this.inputKeyStroke.focus();
  }

  callValueChange() {    
    // we use to timeout to resolve race-condition bug
    // of the same event for setting hotkeys also triggering the macro
    setTimeout(() => {
      let eventValue = this.inputKeyStroke.value === this.noHotkeyValue
        ? ''
        : this.inputKeyStroke.value;
      this.props.onValueChange({
        inputKey: this.inputKeyStroke.dataset.key,
        value: eventValue,
        label: eventValue,
        callToSave: true
      });
    }, 0);
  }

  onBlur() {
    window.OnDllMidiChannelMessage = this.oldDllMidiChannelMessage;
    this.oldDllMidiChannelMessage = {};
    this.setState({ toggleFocus: false });
  }

  onFocus() {
    this.oldDllMidiChannelMessage = window.OnDllMidiChannelMessage;
    window.OnDllMidiChannelMessage = this.readMidiHookEvent.bind(this);
    if (!this.state.toggleFocus) {
      this.setState({ toggleFocus: true });
    }
  }

  readMidiHookEvent(type, channel, data1, data2) {
    let _midiEvent = '';
    if (Number.isNaN(type) || Number.isNaN(channel) || Number.isNaN(data1) || Number.isNaN(data2)) {
      return;
    }
    let _midiMessage = KeyStrokeLib.midiMessageType();
    if (_midiMessage[type]) {
      _midiEvent = _midiMessage[type] + ' ' + channel + ':' + data1;
      //midi key down
      if (0 !== parseInt(data2, 10)) {
        this.onValueChange(_midiEvent, this.inputKeyStroke.dataset.key);
      }
      //midi key up
      if (0 === parseInt(data2, 10)) {
        this.oldDllMidiChannelMessage(type, channel, data1, data2);
        this.callValueChange();
      }
    }
  }

  onWheel(event) {
    event.preventDefault();
    let wheelMove = '';
    let _keyPressed = this.determinePressedKey(event);
    let _mouseMap = KeyStrokeLib.mouseMap();
    wheelMove = _keyPressed.pressed + _keyPressed.sep + _mouseMap['wheel'];
    event.target.value = wheelMove;
    this.onValueChange(wheelMove, event.target.dataset.key);
    this.callValueChange();
  }

  onMouseDown(event) {
    if (!this.state.toggleFocus) {
      this.setState({ toggleFocus: true });
      return;
    }
    event.preventDefault();
    let clicked = '';
    let _keyPressed = this.determinePressedKey(event);
    let _mouseMap = KeyStrokeLib.mouseMap();
    if (_mouseMap[event.button]) {
      clicked = _keyPressed.pressed + _keyPressed.sep + _mouseMap[event.button];
      event.target.value = clicked;
      this.onValueChange(clicked, event.target.dataset.key);
    }
  }

  onMouseUp(event) {
    event.preventDefault();
    this.callValueChange();
  }

  onKeyDown(event) {
    event.preventDefault();
    let pressed = '';
    let _wpParamMap = KeyStrokeLib.wParamMap();
    if (this.state.prevKeyDownValue === _wpParamMap[event.which]) {
      return;
    } else {
      this.setState({ prevKeyDownValue: _wpParamMap[event.which] });
    }
    let _keyPressed = this.determinePressedKey(event);
    if (_wpParamMap[event.which]) {
      pressed = _keyPressed.pressed + _keyPressed.sep + _wpParamMap[event.which];
      event.target.value = pressed;
      this.onValueChange(pressed, event.target.dataset.key);
    }
  }

  onKeyUp(event) {
    this.setState({ prevKeyDownValue: '' });
    event.preventDefault();
    let pressed = '';
    let _wpParamMap = KeyStrokeLib.wParamMap();
    let _keyPressed = this.determinePressedKey(event);
    if (_wpParamMap[event.which] && _wpParamMap[44] === _wpParamMap[event.which]) {
      pressed = _keyPressed.pressed + _keyPressed.sep + _wpParamMap[event.which];
      event.target.value = pressed;
      this.onValueChange(pressed, event.target.dataset.key);
    }
    this.callValueChange();
  }

  determinePressedKey(event) {
    let pressed = '';
    let sep = '';
    let _combinedKeys = KeyStrokeLib.combinedKeyPressed();
    if (!_combinedKeys[event.which]) {
      if (event.altKey) {
        pressed = pressed + sep + 'Alt';
        sep = '+';
      }
      if (event.ctrlKey) {
        pressed = pressed + sep + 'Ctrl';
        sep = '+';
      }
      if (event.shiftKey) {
        pressed = pressed + sep + 'Shift';
        sep = '+';
      }
    }
    return { pressed: pressed, sep: sep };
  }

  onDeleteClick(event) {
    this.onValueChange('', this.props.inputName);
    this.callValueChange();
  }

  getInputKeyStoke(ref) {
    this.inputKeyStroke = ref;
  }

  getValueOnSave() {
    let valueObject = {};
    valueObject['inputName'] = this.props.inputName;
    valueObject['value'] = this.inputKeyStroke.value === this.noHotkeyValue
      ? ''
      : this.inputKeyStroke.value;
    return valueObject;
  }

  render() {
    let defaultValue = 'None';
    let thisClass = 'xui-keyStroke';
    if (
      typeof this.props.placeholderText !== 'undefined' &&
      typeof this.props.value === 'undefined'
    ) {
      defaultValue = this.props.placeholderText;
    } else if (typeof this.props.value !== 'undefined') {
      defaultValue = this.props.value;
    }
    if (defaultValue === '' && this.noHotkeyValue) {
      defaultValue = this.noHotkeyValue;
    }
    if (this.state.isEmpty) {
      thisClass = 'xui-keyStroke isEmpty';
    }
    return (
      <div className={thisClass}>
        <input
          type="text"
          ref={this.getInputKeyStoke}
          defaultValue={defaultValue}
          data-key={this.props.inputName}
          onKeyDown={this.onKeyDown}
          onMouseDown={this.onMouseDown}
          onMouseUp={this.onMouseUp}
          onKeyUp={this.onKeyUp}
          onWheel={this.onWheel}
          onBlur={this.onBlur}
          onFocus={this.onFocus}
        />
        <button name="delete" onClick={this.onDeleteClick} />
      </div>
    );
  }

  componentDidMount() {
    if (typeof this.props.onInitialization === 'function') {
      let keyStrokeValue = this.inputKeyStroke.value === this.noHotkeyValue
        ? ''
        : this.inputKeyStroke.value;
      this.props.onInitialization({
        inputKey: this.inputKeyStroke.dataset.key,
        value: keyStrokeValue,
        label: keyStrokeValue
      });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps['value'] === undefined && this.props.value !== prevProps['value']) {
      this.inputKeyStroke.value = this.props.value === '' ? this.noHotkeyValue : this.props.value;
      this.props.onInitialization({
        inputKey: this.inputKeyStroke.dataset.key,
        value: this.props.value,
        label: this.props.value
      });
    }
  }
}

export default XUIKeyStrokes;
