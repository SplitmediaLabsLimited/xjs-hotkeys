const wrapCallbackHandler = (callbackFunc, oldCallbackFunc) => {
  return (...args) => {
    callbackFunc(...args);
    oldCallbackFunc && oldCallbackFunc(...args);
  };
};

export default callbacks => {
  Object.entries(callbacks).forEach(([funcName, callback]) => {
    window[funcName] = wrapCallbackHandler(callback, window[funcName]);
  });
};
