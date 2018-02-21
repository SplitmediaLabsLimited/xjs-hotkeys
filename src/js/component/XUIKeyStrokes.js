import React, { Component } from 'react';
import '../../../src/css/XUIKeyStrokes.css';
import { KeyStrokeLib } from '../lib/KeyStrokeLib.js';

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
    this.inputKeyStroke = null;
    this.onBlur = this.onBlur.bind(this);
    this.onFocus = this.onFocus.bind(this);
    this.oldDllMidiChannelMessage = () => {};
    this.state = {
      prevKeyDownValue: '',
      toggleFocus: false
    };
  }

  onValueChange(value, dataKey) {
    this.inputKeyStroke.value = value;
    this.inputKeyStroke.focus();
  }

  callValueChange() {
    // we use to timeout to resolve race-condition bug
    // of the same event for setting hotkeys also triggering the macro
    setTimeout(() => {
      let eventValue = this.inputKeyStroke.value;
      this.props.onValueChange(eventValue);
    }, 0);
  }

  onBlur() {
    //option to turn on/off KeyStrokeHandler emitter
    if (this.props.KeyStrokeHandler) {
      this.props.KeyStrokeHandler.preventKeyHandlerEmit(false);
    }
    window.OnDllMidiChannelMessage = this.oldDllMidiChannelMessage;
    this.oldDllMidiChannelMessage = {};
    this.setState({ toggleFocus: false });
  }

  onFocus() {
    //option to turn on/off KeyStrokeHandler emitter
    if (this.props.KeyStrokeHandler) {
      this.props.KeyStrokeHandler.preventKeyHandlerEmit(true);
    }
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
      pressed =
        _keyPressed.pressed +
        (KeyStrokeLib.combinedKeyPressed()[event.which]
          ? ''
          : _keyPressed.sep + _wpParamMap[event.which]);
      event.target.value = pressed;
      this.onValueChange(pressed, event.target.dataset.key);
    }
  }

  onKeyUp(event) {
    event.preventDefault();
    this.setState({ prevKeyDownValue: '' });
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
    //let _combinedKeys = KeyStrokeLib.combinedKeyPressed();
    //if (!_combinedKeys[event.which]) {
    if (event.ctrlKey) {
      pressed = 'Ctrl';
      sep = '+';
    }
    if (event.shiftKey) {
      pressed = pressed + sep + 'Shift';
      sep = '+';
    }
    if (event.altKey) {
      pressed = pressed + sep + 'Alt';
      sep = '+';
    }
    //}
    return { pressed: pressed, sep: sep };
  }

  onDeleteClick(event) {
    this.onValueChange('', this.props.inputName);
    this.callValueChange();
  }

  getInputKeyStoke(ref) {
    this.inputKeyStroke = ref;
  }

  render() {
    let defaultValue = '';
    let placeHolderText = 'None';
    let thisClass = 'xui-keyStroke';

    if (typeof this.props.placeholderText !== 'undefined') {
      placeHolderText = this.props.placeholderText;
    }

    if (typeof this.props.value !== 'undefined') {
      defaultValue = this.props.value;
    }

    return (
      <div className={thisClass}>
        <input
          type="text"
          ref={this.getInputKeyStoke}
          placeholder={placeHolderText}
          data-key={this.props.inputName}
          onKeyDown={this.onKeyDown}
          onMouseDown={this.onMouseDown}
          onMouseUp={this.onMouseUp}
          onKeyUp={this.onKeyUp}
          onWheel={this.onWheel}
          onBlur={this.onBlur}
          onFocus={this.onFocus}
          defaultValue={defaultValue}
        />
        <button name="delete" onClick={this.onDeleteClick} />
      </div>
    );
  }
}

export default XUIKeyStrokes;
