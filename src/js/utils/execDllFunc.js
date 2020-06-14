import registerCallbacks from './unsafeRegisterCallbacks.js';

const ASYNC_CALLBACK_TIMEOUT = 60000;

const callbacks = {};

const isCallbackExisting = asyncId => callbacks.hasOwnProperty(asyncId);

const runCallback = (asyncId, ...asyncRes) => {
  if (isCallbackExisting(asyncId)) {
    const callback = callbacks[asyncId];

    callback(...asyncRes);
    delete callbacks[asyncId];
  }
};

registerCallbacks({
  OnDllCallback: (func, asyncId, asyncRes) => {
    try {
      if (func === 'XSplit.LoginEx.StartPortListener') {
        return runCallback(asyncId, [asyncId, asyncRes]);
      }

      const decodedAsyncRes = decodeURIComponent(asyncRes);

      runCallback(asyncId, decodedAsyncRes);
    } catch (err) {
      // decode error: asyncRes is an invalid argument
      runCallback(asyncId, asyncRes);
    }
  }
});

const parseResult = result => {
  // sometimes the result looks like {asyncId:0, progress:0}
  // we need to get the asyncId
  if (result.startsWith('{') && result.endsWith('}')) {
    // remove the braces
    const raw = result.substring(1, result.length - 1);

    // split them
    const arrResult = raw.split(', ');

    for (let i = 0; i < arrResult.length; i++) {
      const res = arrResult[i];

      if (res.includes('asyncId') || res.includes('async')) {
        return res;
      }
    }
  }

  return result;
};

export const execDllFunc = (funcName, ...args) => {
  return new Promise((resolve, reject) => {
    const result = execDllSyncFunc(funcName, ...args);

    if (result === undefined) return null;

    const [resultType, resultValue] = parseResult(result).split(':');

    if (resultType === 'async' || resultType === 'asyncId') {
      const asyncCallbackTimeout = setTimeout(() => {
        delete callbacks[resultValue]; // callback clean up

        reject(
          new Error(`DLL function ${funcName} failed. Timeout error: args ${JSON.stringify(args)}`)
        );
      }, ASYNC_CALLBACK_TIMEOUT);

      callbacks[resultValue] = asyncResponse => {
        clearTimeout(asyncCallbackTimeout);

        resolve(asyncResponse);
      };

      return;
    }

    resolve(result);
  });
};

export const execDllSyncFunc = (funcName, ...args) => window.external.CallDll(funcName, ...args);

export const execDllExFunc = (funcName, ...args) => {
  return new Promise((resolve, reject) => {
    const result = execDllExSyncFunc(funcName, ...args);

    if (result === undefined) return null;

    const [resultType, resultValue] = parseResult(result).split(':');

    if (resultType === 'async' || resultType === 'asyncId') {
      const asyncCallbackTimeout = setTimeout(() => {
        delete callbacks[resultValue]; // callback clean up

        reject(
          new Error(`DLL function ${funcName} failed. Timeout error: args ${JSON.stringify(args)}`)
        );
      }, ASYNC_CALLBACK_TIMEOUT);

      callbacks[resultValue] = asyncResponse => {
        clearTimeout(asyncCallbackTimeout);

        resolve(asyncResponse);
      };

      return;
    }

    resolve(result);
  });
};

export const execDllExSyncFunc = (funcName, ...args) =>
  window.external.CallDllEx(funcName, ...args);

export default {
  execDllFunc,
  execDllSyncFunc,
  execDllExFunc,
  execDllExSyncFunc
};
