This project was bootstrapped with [Create React App](https://github.com/facebookincubator/create-react-app).

Below you will find some information on how to perform common tasks.<br>
You can find the most recent version of this guide [here](https://github.com/facebookincubator/create-react-app/blob/master/packages/react-scripts/template/README.md).

#xui-keystrokes

This is a small library for handling key and midi strokes specifically for Xsplit Broadcaster.
There is a postinstall script that generates a production build for distribution or manually invoke using command "webpack --env.production".

##KeyStrokeHandler object needs xjs to fully function.
- most methods of the class are static
- this handles both recieving and emitting key and midi strokes.

assignXjs(xjsObj)
  - encapsulates xjs object within the class.  

initWithXjsDllHook(xjsObj)
  - encapsulates xjs object within the class and loads the Xsplit Dll to listen for keyStrokes.

initMidiHook()
  - loads Xsplit Midi Dll to listen to Midi device inputs.

on(event, handler)
  - sets emitter for the event.

off(event, handler)
- removes emitter for the event.

##XUIKeyStrokes
- a react component to accept and display key and midi strokes.



