import React, { Component } from "react";

class XUIKeyStrokes extends Component {
  constructor(props) {
    super();
    this.onValueChange = this.onValueChange.bind(this);
    this.getInputKeyStoke = this.getInputKeyStoke.bind(this);
    this.getValueOnSave = this.getValueOnSave.bind(this);
    this.inputKeyStroke = null;
  }

  onValueChange(event) {
    let eventValue = event.target.value;
    this.props.onValueChange({
      inputKey: event.target.dataset.key,
      value: eventValue,
      label: eventValue
    });
  }

  getInputKeyStoke(ref) {
    this.inputKeyStroke = ref;
  }

  getValueOnSave() {
    let valueObject = {};
    valueObject["inputName"] = this.props.inputName;
    valueObject["value"] = this.inputKeyStroke.value;
    return valueObject;
  }

  render() {
    let defaultValue = 0;
    if (
      typeof this.props.placeholderText !== "undefined" &&
      typeof this.props.value === "undefined"
    ) {
      defaultValue = this.props.placeholderText;
    } else if (typeof this.props.value !== "undefined") {
      defaultValue = this.props.value;
    }
    return (
      <div className="xui-keyStroke">
        <input
          type="text"
          ref={this.getInputKeyStoke}
          defaultValue={defaultValue}
          data-key={this.props.inputName}
          onChange={this.onValueChange}
        />
      </div>
    );
  }

  componentDidMount() {
    if (typeof this.props.onInitialization === "function") {
      let keyStrokeValue = this.inputKeyStroke.value;
      this.props.onInitialization({
        inputKey: this.inputKeyStroke.dataset.key,
        value: keyStrokeValue,
        label: keyStrokeValue
      });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      prevProps["value"] === undefined &&
      this.props.value !== prevProps["value"]
    ) {
      this.inputKeyStroke.value = this.props.value;
      this.props.onInitialization({
        inputKey: this.inputKeyStroke.dataset.key,
        value: this.props.value,
        label: this.props.value
      });
    }
  }
}

export default XUIKeyStrokes;
