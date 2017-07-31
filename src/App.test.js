import React from "react";
import ReactDOM from "react-dom";
import XUIKeyStrokes from "./js/component/XUIKeyStrokes";

it("renders without crashing", () => {
  const div = document.createElement("div");
  ReactDOM.render(<XUIKeyStrokes />, div);
});
