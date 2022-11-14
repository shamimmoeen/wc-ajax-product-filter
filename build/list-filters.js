/******/ (function() { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/axios/index.js":
/*!*************************************!*\
  !*** ./node_modules/axios/index.js ***!
  \*************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

module.exports = __webpack_require__(/*! ./lib/axios */ "./node_modules/axios/lib/axios.js");

/***/ }),

/***/ "./node_modules/axios/lib/adapters/xhr.js":
/*!************************************************!*\
  !*** ./node_modules/axios/lib/adapters/xhr.js ***!
  \************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");
var settle = __webpack_require__(/*! ./../core/settle */ "./node_modules/axios/lib/core/settle.js");
var cookies = __webpack_require__(/*! ./../helpers/cookies */ "./node_modules/axios/lib/helpers/cookies.js");
var buildURL = __webpack_require__(/*! ./../helpers/buildURL */ "./node_modules/axios/lib/helpers/buildURL.js");
var buildFullPath = __webpack_require__(/*! ../core/buildFullPath */ "./node_modules/axios/lib/core/buildFullPath.js");
var parseHeaders = __webpack_require__(/*! ./../helpers/parseHeaders */ "./node_modules/axios/lib/helpers/parseHeaders.js");
var isURLSameOrigin = __webpack_require__(/*! ./../helpers/isURLSameOrigin */ "./node_modules/axios/lib/helpers/isURLSameOrigin.js");
var transitionalDefaults = __webpack_require__(/*! ../defaults/transitional */ "./node_modules/axios/lib/defaults/transitional.js");
var AxiosError = __webpack_require__(/*! ../core/AxiosError */ "./node_modules/axios/lib/core/AxiosError.js");
var CanceledError = __webpack_require__(/*! ../cancel/CanceledError */ "./node_modules/axios/lib/cancel/CanceledError.js");
var parseProtocol = __webpack_require__(/*! ../helpers/parseProtocol */ "./node_modules/axios/lib/helpers/parseProtocol.js");

module.exports = function xhrAdapter(config) {
  return new Promise(function dispatchXhrRequest(resolve, reject) {
    var requestData = config.data;
    var requestHeaders = config.headers;
    var responseType = config.responseType;
    var onCanceled;
    function done() {
      if (config.cancelToken) {
        config.cancelToken.unsubscribe(onCanceled);
      }

      if (config.signal) {
        config.signal.removeEventListener('abort', onCanceled);
      }
    }

    if (utils.isFormData(requestData) && utils.isStandardBrowserEnv()) {
      delete requestHeaders['Content-Type']; // Let the browser set it
    }

    var request = new XMLHttpRequest();

    // HTTP basic authentication
    if (config.auth) {
      var username = config.auth.username || '';
      var password = config.auth.password ? unescape(encodeURIComponent(config.auth.password)) : '';
      requestHeaders.Authorization = 'Basic ' + btoa(username + ':' + password);
    }

    var fullPath = buildFullPath(config.baseURL, config.url);

    request.open(config.method.toUpperCase(), buildURL(fullPath, config.params, config.paramsSerializer), true);

    // Set the request timeout in MS
    request.timeout = config.timeout;

    function onloadend() {
      if (!request) {
        return;
      }
      // Prepare the response
      var responseHeaders = 'getAllResponseHeaders' in request ? parseHeaders(request.getAllResponseHeaders()) : null;
      var responseData = !responseType || responseType === 'text' ||  responseType === 'json' ?
        request.responseText : request.response;
      var response = {
        data: responseData,
        status: request.status,
        statusText: request.statusText,
        headers: responseHeaders,
        config: config,
        request: request
      };

      settle(function _resolve(value) {
        resolve(value);
        done();
      }, function _reject(err) {
        reject(err);
        done();
      }, response);

      // Clean up request
      request = null;
    }

    if ('onloadend' in request) {
      // Use onloadend if available
      request.onloadend = onloadend;
    } else {
      // Listen for ready state to emulate onloadend
      request.onreadystatechange = function handleLoad() {
        if (!request || request.readyState !== 4) {
          return;
        }

        // The request errored out and we didn't get a response, this will be
        // handled by onerror instead
        // With one exception: request that using file: protocol, most browsers
        // will return status as 0 even though it's a successful request
        if (request.status === 0 && !(request.responseURL && request.responseURL.indexOf('file:') === 0)) {
          return;
        }
        // readystate handler is calling before onerror or ontimeout handlers,
        // so we should call onloadend on the next 'tick'
        setTimeout(onloadend);
      };
    }

    // Handle browser request cancellation (as opposed to a manual cancellation)
    request.onabort = function handleAbort() {
      if (!request) {
        return;
      }

      reject(new AxiosError('Request aborted', AxiosError.ECONNABORTED, config, request));

      // Clean up request
      request = null;
    };

    // Handle low level network errors
    request.onerror = function handleError() {
      // Real errors are hidden from us by the browser
      // onerror should only fire if it's a network error
      reject(new AxiosError('Network Error', AxiosError.ERR_NETWORK, config, request, request));

      // Clean up request
      request = null;
    };

    // Handle timeout
    request.ontimeout = function handleTimeout() {
      var timeoutErrorMessage = config.timeout ? 'timeout of ' + config.timeout + 'ms exceeded' : 'timeout exceeded';
      var transitional = config.transitional || transitionalDefaults;
      if (config.timeoutErrorMessage) {
        timeoutErrorMessage = config.timeoutErrorMessage;
      }
      reject(new AxiosError(
        timeoutErrorMessage,
        transitional.clarifyTimeoutError ? AxiosError.ETIMEDOUT : AxiosError.ECONNABORTED,
        config,
        request));

      // Clean up request
      request = null;
    };

    // Add xsrf header
    // This is only done if running in a standard browser environment.
    // Specifically not if we're in a web worker, or react-native.
    if (utils.isStandardBrowserEnv()) {
      // Add xsrf header
      var xsrfValue = (config.withCredentials || isURLSameOrigin(fullPath)) && config.xsrfCookieName ?
        cookies.read(config.xsrfCookieName) :
        undefined;

      if (xsrfValue) {
        requestHeaders[config.xsrfHeaderName] = xsrfValue;
      }
    }

    // Add headers to the request
    if ('setRequestHeader' in request) {
      utils.forEach(requestHeaders, function setRequestHeader(val, key) {
        if (typeof requestData === 'undefined' && key.toLowerCase() === 'content-type') {
          // Remove Content-Type if data is undefined
          delete requestHeaders[key];
        } else {
          // Otherwise add header to the request
          request.setRequestHeader(key, val);
        }
      });
    }

    // Add withCredentials to request if needed
    if (!utils.isUndefined(config.withCredentials)) {
      request.withCredentials = !!config.withCredentials;
    }

    // Add responseType to request if needed
    if (responseType && responseType !== 'json') {
      request.responseType = config.responseType;
    }

    // Handle progress if needed
    if (typeof config.onDownloadProgress === 'function') {
      request.addEventListener('progress', config.onDownloadProgress);
    }

    // Not all browsers support upload events
    if (typeof config.onUploadProgress === 'function' && request.upload) {
      request.upload.addEventListener('progress', config.onUploadProgress);
    }

    if (config.cancelToken || config.signal) {
      // Handle cancellation
      // eslint-disable-next-line func-names
      onCanceled = function(cancel) {
        if (!request) {
          return;
        }
        reject(!cancel || (cancel && cancel.type) ? new CanceledError() : cancel);
        request.abort();
        request = null;
      };

      config.cancelToken && config.cancelToken.subscribe(onCanceled);
      if (config.signal) {
        config.signal.aborted ? onCanceled() : config.signal.addEventListener('abort', onCanceled);
      }
    }

    if (!requestData) {
      requestData = null;
    }

    var protocol = parseProtocol(fullPath);

    if (protocol && [ 'http', 'https', 'file' ].indexOf(protocol) === -1) {
      reject(new AxiosError('Unsupported protocol ' + protocol + ':', AxiosError.ERR_BAD_REQUEST, config));
      return;
    }


    // Send the request
    request.send(requestData);
  });
};


/***/ }),

/***/ "./node_modules/axios/lib/axios.js":
/*!*****************************************!*\
  !*** ./node_modules/axios/lib/axios.js ***!
  \*****************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(/*! ./utils */ "./node_modules/axios/lib/utils.js");
var bind = __webpack_require__(/*! ./helpers/bind */ "./node_modules/axios/lib/helpers/bind.js");
var Axios = __webpack_require__(/*! ./core/Axios */ "./node_modules/axios/lib/core/Axios.js");
var mergeConfig = __webpack_require__(/*! ./core/mergeConfig */ "./node_modules/axios/lib/core/mergeConfig.js");
var defaults = __webpack_require__(/*! ./defaults */ "./node_modules/axios/lib/defaults/index.js");

/**
 * Create an instance of Axios
 *
 * @param {Object} defaultConfig The default config for the instance
 * @return {Axios} A new instance of Axios
 */
function createInstance(defaultConfig) {
  var context = new Axios(defaultConfig);
  var instance = bind(Axios.prototype.request, context);

  // Copy axios.prototype to instance
  utils.extend(instance, Axios.prototype, context);

  // Copy context to instance
  utils.extend(instance, context);

  // Factory for creating new instances
  instance.create = function create(instanceConfig) {
    return createInstance(mergeConfig(defaultConfig, instanceConfig));
  };

  return instance;
}

// Create the default instance to be exported
var axios = createInstance(defaults);

// Expose Axios class to allow class inheritance
axios.Axios = Axios;

// Expose Cancel & CancelToken
axios.CanceledError = __webpack_require__(/*! ./cancel/CanceledError */ "./node_modules/axios/lib/cancel/CanceledError.js");
axios.CancelToken = __webpack_require__(/*! ./cancel/CancelToken */ "./node_modules/axios/lib/cancel/CancelToken.js");
axios.isCancel = __webpack_require__(/*! ./cancel/isCancel */ "./node_modules/axios/lib/cancel/isCancel.js");
axios.VERSION = (__webpack_require__(/*! ./env/data */ "./node_modules/axios/lib/env/data.js").version);
axios.toFormData = __webpack_require__(/*! ./helpers/toFormData */ "./node_modules/axios/lib/helpers/toFormData.js");

// Expose AxiosError class
axios.AxiosError = __webpack_require__(/*! ../lib/core/AxiosError */ "./node_modules/axios/lib/core/AxiosError.js");

// alias for CanceledError for backward compatibility
axios.Cancel = axios.CanceledError;

// Expose all/spread
axios.all = function all(promises) {
  return Promise.all(promises);
};
axios.spread = __webpack_require__(/*! ./helpers/spread */ "./node_modules/axios/lib/helpers/spread.js");

// Expose isAxiosError
axios.isAxiosError = __webpack_require__(/*! ./helpers/isAxiosError */ "./node_modules/axios/lib/helpers/isAxiosError.js");

module.exports = axios;

// Allow use of default import syntax in TypeScript
module.exports["default"] = axios;


/***/ }),

/***/ "./node_modules/axios/lib/cancel/CancelToken.js":
/*!******************************************************!*\
  !*** ./node_modules/axios/lib/cancel/CancelToken.js ***!
  \******************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var CanceledError = __webpack_require__(/*! ./CanceledError */ "./node_modules/axios/lib/cancel/CanceledError.js");

/**
 * A `CancelToken` is an object that can be used to request cancellation of an operation.
 *
 * @class
 * @param {Function} executor The executor function.
 */
function CancelToken(executor) {
  if (typeof executor !== 'function') {
    throw new TypeError('executor must be a function.');
  }

  var resolvePromise;

  this.promise = new Promise(function promiseExecutor(resolve) {
    resolvePromise = resolve;
  });

  var token = this;

  // eslint-disable-next-line func-names
  this.promise.then(function(cancel) {
    if (!token._listeners) return;

    var i;
    var l = token._listeners.length;

    for (i = 0; i < l; i++) {
      token._listeners[i](cancel);
    }
    token._listeners = null;
  });

  // eslint-disable-next-line func-names
  this.promise.then = function(onfulfilled) {
    var _resolve;
    // eslint-disable-next-line func-names
    var promise = new Promise(function(resolve) {
      token.subscribe(resolve);
      _resolve = resolve;
    }).then(onfulfilled);

    promise.cancel = function reject() {
      token.unsubscribe(_resolve);
    };

    return promise;
  };

  executor(function cancel(message) {
    if (token.reason) {
      // Cancellation has already been requested
      return;
    }

    token.reason = new CanceledError(message);
    resolvePromise(token.reason);
  });
}

/**
 * Throws a `CanceledError` if cancellation has been requested.
 */
CancelToken.prototype.throwIfRequested = function throwIfRequested() {
  if (this.reason) {
    throw this.reason;
  }
};

/**
 * Subscribe to the cancel signal
 */

CancelToken.prototype.subscribe = function subscribe(listener) {
  if (this.reason) {
    listener(this.reason);
    return;
  }

  if (this._listeners) {
    this._listeners.push(listener);
  } else {
    this._listeners = [listener];
  }
};

/**
 * Unsubscribe from the cancel signal
 */

CancelToken.prototype.unsubscribe = function unsubscribe(listener) {
  if (!this._listeners) {
    return;
  }
  var index = this._listeners.indexOf(listener);
  if (index !== -1) {
    this._listeners.splice(index, 1);
  }
};

/**
 * Returns an object that contains a new `CancelToken` and a function that, when called,
 * cancels the `CancelToken`.
 */
CancelToken.source = function source() {
  var cancel;
  var token = new CancelToken(function executor(c) {
    cancel = c;
  });
  return {
    token: token,
    cancel: cancel
  };
};

module.exports = CancelToken;


/***/ }),

/***/ "./node_modules/axios/lib/cancel/CanceledError.js":
/*!********************************************************!*\
  !*** ./node_modules/axios/lib/cancel/CanceledError.js ***!
  \********************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var AxiosError = __webpack_require__(/*! ../core/AxiosError */ "./node_modules/axios/lib/core/AxiosError.js");
var utils = __webpack_require__(/*! ../utils */ "./node_modules/axios/lib/utils.js");

/**
 * A `CanceledError` is an object that is thrown when an operation is canceled.
 *
 * @class
 * @param {string=} message The message.
 */
function CanceledError(message) {
  // eslint-disable-next-line no-eq-null,eqeqeq
  AxiosError.call(this, message == null ? 'canceled' : message, AxiosError.ERR_CANCELED);
  this.name = 'CanceledError';
}

utils.inherits(CanceledError, AxiosError, {
  __CANCEL__: true
});

module.exports = CanceledError;


/***/ }),

/***/ "./node_modules/axios/lib/cancel/isCancel.js":
/*!***************************************************!*\
  !*** ./node_modules/axios/lib/cancel/isCancel.js ***!
  \***************************************************/
/***/ (function(module) {

"use strict";


module.exports = function isCancel(value) {
  return !!(value && value.__CANCEL__);
};


/***/ }),

/***/ "./node_modules/axios/lib/core/Axios.js":
/*!**********************************************!*\
  !*** ./node_modules/axios/lib/core/Axios.js ***!
  \**********************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");
var buildURL = __webpack_require__(/*! ../helpers/buildURL */ "./node_modules/axios/lib/helpers/buildURL.js");
var InterceptorManager = __webpack_require__(/*! ./InterceptorManager */ "./node_modules/axios/lib/core/InterceptorManager.js");
var dispatchRequest = __webpack_require__(/*! ./dispatchRequest */ "./node_modules/axios/lib/core/dispatchRequest.js");
var mergeConfig = __webpack_require__(/*! ./mergeConfig */ "./node_modules/axios/lib/core/mergeConfig.js");
var buildFullPath = __webpack_require__(/*! ./buildFullPath */ "./node_modules/axios/lib/core/buildFullPath.js");
var validator = __webpack_require__(/*! ../helpers/validator */ "./node_modules/axios/lib/helpers/validator.js");

var validators = validator.validators;
/**
 * Create a new instance of Axios
 *
 * @param {Object} instanceConfig The default config for the instance
 */
function Axios(instanceConfig) {
  this.defaults = instanceConfig;
  this.interceptors = {
    request: new InterceptorManager(),
    response: new InterceptorManager()
  };
}

/**
 * Dispatch a request
 *
 * @param {Object} config The config specific for this request (merged with this.defaults)
 */
Axios.prototype.request = function request(configOrUrl, config) {
  /*eslint no-param-reassign:0*/
  // Allow for axios('example/url'[, config]) a la fetch API
  if (typeof configOrUrl === 'string') {
    config = config || {};
    config.url = configOrUrl;
  } else {
    config = configOrUrl || {};
  }

  config = mergeConfig(this.defaults, config);

  // Set config.method
  if (config.method) {
    config.method = config.method.toLowerCase();
  } else if (this.defaults.method) {
    config.method = this.defaults.method.toLowerCase();
  } else {
    config.method = 'get';
  }

  var transitional = config.transitional;

  if (transitional !== undefined) {
    validator.assertOptions(transitional, {
      silentJSONParsing: validators.transitional(validators.boolean),
      forcedJSONParsing: validators.transitional(validators.boolean),
      clarifyTimeoutError: validators.transitional(validators.boolean)
    }, false);
  }

  // filter out skipped interceptors
  var requestInterceptorChain = [];
  var synchronousRequestInterceptors = true;
  this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor) {
    if (typeof interceptor.runWhen === 'function' && interceptor.runWhen(config) === false) {
      return;
    }

    synchronousRequestInterceptors = synchronousRequestInterceptors && interceptor.synchronous;

    requestInterceptorChain.unshift(interceptor.fulfilled, interceptor.rejected);
  });

  var responseInterceptorChain = [];
  this.interceptors.response.forEach(function pushResponseInterceptors(interceptor) {
    responseInterceptorChain.push(interceptor.fulfilled, interceptor.rejected);
  });

  var promise;

  if (!synchronousRequestInterceptors) {
    var chain = [dispatchRequest, undefined];

    Array.prototype.unshift.apply(chain, requestInterceptorChain);
    chain = chain.concat(responseInterceptorChain);

    promise = Promise.resolve(config);
    while (chain.length) {
      promise = promise.then(chain.shift(), chain.shift());
    }

    return promise;
  }


  var newConfig = config;
  while (requestInterceptorChain.length) {
    var onFulfilled = requestInterceptorChain.shift();
    var onRejected = requestInterceptorChain.shift();
    try {
      newConfig = onFulfilled(newConfig);
    } catch (error) {
      onRejected(error);
      break;
    }
  }

  try {
    promise = dispatchRequest(newConfig);
  } catch (error) {
    return Promise.reject(error);
  }

  while (responseInterceptorChain.length) {
    promise = promise.then(responseInterceptorChain.shift(), responseInterceptorChain.shift());
  }

  return promise;
};

Axios.prototype.getUri = function getUri(config) {
  config = mergeConfig(this.defaults, config);
  var fullPath = buildFullPath(config.baseURL, config.url);
  return buildURL(fullPath, config.params, config.paramsSerializer);
};

// Provide aliases for supported request methods
utils.forEach(['delete', 'get', 'head', 'options'], function forEachMethodNoData(method) {
  /*eslint func-names:0*/
  Axios.prototype[method] = function(url, config) {
    return this.request(mergeConfig(config || {}, {
      method: method,
      url: url,
      data: (config || {}).data
    }));
  };
});

utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
  /*eslint func-names:0*/

  function generateHTTPMethod(isForm) {
    return function httpMethod(url, data, config) {
      return this.request(mergeConfig(config || {}, {
        method: method,
        headers: isForm ? {
          'Content-Type': 'multipart/form-data'
        } : {},
        url: url,
        data: data
      }));
    };
  }

  Axios.prototype[method] = generateHTTPMethod();

  Axios.prototype[method + 'Form'] = generateHTTPMethod(true);
});

module.exports = Axios;


/***/ }),

/***/ "./node_modules/axios/lib/core/AxiosError.js":
/*!***************************************************!*\
  !*** ./node_modules/axios/lib/core/AxiosError.js ***!
  \***************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(/*! ../utils */ "./node_modules/axios/lib/utils.js");

/**
 * Create an Error with the specified message, config, error code, request and response.
 *
 * @param {string} message The error message.
 * @param {string} [code] The error code (for example, 'ECONNABORTED').
 * @param {Object} [config] The config.
 * @param {Object} [request] The request.
 * @param {Object} [response] The response.
 * @returns {Error} The created error.
 */
function AxiosError(message, code, config, request, response) {
  Error.call(this);
  this.message = message;
  this.name = 'AxiosError';
  code && (this.code = code);
  config && (this.config = config);
  request && (this.request = request);
  response && (this.response = response);
}

utils.inherits(AxiosError, Error, {
  toJSON: function toJSON() {
    return {
      // Standard
      message: this.message,
      name: this.name,
      // Microsoft
      description: this.description,
      number: this.number,
      // Mozilla
      fileName: this.fileName,
      lineNumber: this.lineNumber,
      columnNumber: this.columnNumber,
      stack: this.stack,
      // Axios
      config: this.config,
      code: this.code,
      status: this.response && this.response.status ? this.response.status : null
    };
  }
});

var prototype = AxiosError.prototype;
var descriptors = {};

[
  'ERR_BAD_OPTION_VALUE',
  'ERR_BAD_OPTION',
  'ECONNABORTED',
  'ETIMEDOUT',
  'ERR_NETWORK',
  'ERR_FR_TOO_MANY_REDIRECTS',
  'ERR_DEPRECATED',
  'ERR_BAD_RESPONSE',
  'ERR_BAD_REQUEST',
  'ERR_CANCELED'
// eslint-disable-next-line func-names
].forEach(function(code) {
  descriptors[code] = {value: code};
});

Object.defineProperties(AxiosError, descriptors);
Object.defineProperty(prototype, 'isAxiosError', {value: true});

// eslint-disable-next-line func-names
AxiosError.from = function(error, code, config, request, response, customProps) {
  var axiosError = Object.create(prototype);

  utils.toFlatObject(error, axiosError, function filter(obj) {
    return obj !== Error.prototype;
  });

  AxiosError.call(axiosError, error.message, code, config, request, response);

  axiosError.name = error.name;

  customProps && Object.assign(axiosError, customProps);

  return axiosError;
};

module.exports = AxiosError;


/***/ }),

/***/ "./node_modules/axios/lib/core/InterceptorManager.js":
/*!***********************************************************!*\
  !*** ./node_modules/axios/lib/core/InterceptorManager.js ***!
  \***********************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");

function InterceptorManager() {
  this.handlers = [];
}

/**
 * Add a new interceptor to the stack
 *
 * @param {Function} fulfilled The function to handle `then` for a `Promise`
 * @param {Function} rejected The function to handle `reject` for a `Promise`
 *
 * @return {Number} An ID used to remove interceptor later
 */
InterceptorManager.prototype.use = function use(fulfilled, rejected, options) {
  this.handlers.push({
    fulfilled: fulfilled,
    rejected: rejected,
    synchronous: options ? options.synchronous : false,
    runWhen: options ? options.runWhen : null
  });
  return this.handlers.length - 1;
};

/**
 * Remove an interceptor from the stack
 *
 * @param {Number} id The ID that was returned by `use`
 */
InterceptorManager.prototype.eject = function eject(id) {
  if (this.handlers[id]) {
    this.handlers[id] = null;
  }
};

/**
 * Iterate over all the registered interceptors
 *
 * This method is particularly useful for skipping over any
 * interceptors that may have become `null` calling `eject`.
 *
 * @param {Function} fn The function to call for each interceptor
 */
InterceptorManager.prototype.forEach = function forEach(fn) {
  utils.forEach(this.handlers, function forEachHandler(h) {
    if (h !== null) {
      fn(h);
    }
  });
};

module.exports = InterceptorManager;


/***/ }),

/***/ "./node_modules/axios/lib/core/buildFullPath.js":
/*!******************************************************!*\
  !*** ./node_modules/axios/lib/core/buildFullPath.js ***!
  \******************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var isAbsoluteURL = __webpack_require__(/*! ../helpers/isAbsoluteURL */ "./node_modules/axios/lib/helpers/isAbsoluteURL.js");
var combineURLs = __webpack_require__(/*! ../helpers/combineURLs */ "./node_modules/axios/lib/helpers/combineURLs.js");

/**
 * Creates a new URL by combining the baseURL with the requestedURL,
 * only when the requestedURL is not already an absolute URL.
 * If the requestURL is absolute, this function returns the requestedURL untouched.
 *
 * @param {string} baseURL The base URL
 * @param {string} requestedURL Absolute or relative URL to combine
 * @returns {string} The combined full path
 */
module.exports = function buildFullPath(baseURL, requestedURL) {
  if (baseURL && !isAbsoluteURL(requestedURL)) {
    return combineURLs(baseURL, requestedURL);
  }
  return requestedURL;
};


/***/ }),

/***/ "./node_modules/axios/lib/core/dispatchRequest.js":
/*!********************************************************!*\
  !*** ./node_modules/axios/lib/core/dispatchRequest.js ***!
  \********************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");
var transformData = __webpack_require__(/*! ./transformData */ "./node_modules/axios/lib/core/transformData.js");
var isCancel = __webpack_require__(/*! ../cancel/isCancel */ "./node_modules/axios/lib/cancel/isCancel.js");
var defaults = __webpack_require__(/*! ../defaults */ "./node_modules/axios/lib/defaults/index.js");
var CanceledError = __webpack_require__(/*! ../cancel/CanceledError */ "./node_modules/axios/lib/cancel/CanceledError.js");

/**
 * Throws a `CanceledError` if cancellation has been requested.
 */
function throwIfCancellationRequested(config) {
  if (config.cancelToken) {
    config.cancelToken.throwIfRequested();
  }

  if (config.signal && config.signal.aborted) {
    throw new CanceledError();
  }
}

/**
 * Dispatch a request to the server using the configured adapter.
 *
 * @param {object} config The config that is to be used for the request
 * @returns {Promise} The Promise to be fulfilled
 */
module.exports = function dispatchRequest(config) {
  throwIfCancellationRequested(config);

  // Ensure headers exist
  config.headers = config.headers || {};

  // Transform request data
  config.data = transformData.call(
    config,
    config.data,
    config.headers,
    config.transformRequest
  );

  // Flatten headers
  config.headers = utils.merge(
    config.headers.common || {},
    config.headers[config.method] || {},
    config.headers
  );

  utils.forEach(
    ['delete', 'get', 'head', 'post', 'put', 'patch', 'common'],
    function cleanHeaderConfig(method) {
      delete config.headers[method];
    }
  );

  var adapter = config.adapter || defaults.adapter;

  return adapter(config).then(function onAdapterResolution(response) {
    throwIfCancellationRequested(config);

    // Transform response data
    response.data = transformData.call(
      config,
      response.data,
      response.headers,
      config.transformResponse
    );

    return response;
  }, function onAdapterRejection(reason) {
    if (!isCancel(reason)) {
      throwIfCancellationRequested(config);

      // Transform response data
      if (reason && reason.response) {
        reason.response.data = transformData.call(
          config,
          reason.response.data,
          reason.response.headers,
          config.transformResponse
        );
      }
    }

    return Promise.reject(reason);
  });
};


/***/ }),

/***/ "./node_modules/axios/lib/core/mergeConfig.js":
/*!****************************************************!*\
  !*** ./node_modules/axios/lib/core/mergeConfig.js ***!
  \****************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(/*! ../utils */ "./node_modules/axios/lib/utils.js");

/**
 * Config-specific merge-function which creates a new config-object
 * by merging two configuration objects together.
 *
 * @param {Object} config1
 * @param {Object} config2
 * @returns {Object} New object resulting from merging config2 to config1
 */
module.exports = function mergeConfig(config1, config2) {
  // eslint-disable-next-line no-param-reassign
  config2 = config2 || {};
  var config = {};

  function getMergedValue(target, source) {
    if (utils.isPlainObject(target) && utils.isPlainObject(source)) {
      return utils.merge(target, source);
    } else if (utils.isPlainObject(source)) {
      return utils.merge({}, source);
    } else if (utils.isArray(source)) {
      return source.slice();
    }
    return source;
  }

  // eslint-disable-next-line consistent-return
  function mergeDeepProperties(prop) {
    if (!utils.isUndefined(config2[prop])) {
      return getMergedValue(config1[prop], config2[prop]);
    } else if (!utils.isUndefined(config1[prop])) {
      return getMergedValue(undefined, config1[prop]);
    }
  }

  // eslint-disable-next-line consistent-return
  function valueFromConfig2(prop) {
    if (!utils.isUndefined(config2[prop])) {
      return getMergedValue(undefined, config2[prop]);
    }
  }

  // eslint-disable-next-line consistent-return
  function defaultToConfig2(prop) {
    if (!utils.isUndefined(config2[prop])) {
      return getMergedValue(undefined, config2[prop]);
    } else if (!utils.isUndefined(config1[prop])) {
      return getMergedValue(undefined, config1[prop]);
    }
  }

  // eslint-disable-next-line consistent-return
  function mergeDirectKeys(prop) {
    if (prop in config2) {
      return getMergedValue(config1[prop], config2[prop]);
    } else if (prop in config1) {
      return getMergedValue(undefined, config1[prop]);
    }
  }

  var mergeMap = {
    'url': valueFromConfig2,
    'method': valueFromConfig2,
    'data': valueFromConfig2,
    'baseURL': defaultToConfig2,
    'transformRequest': defaultToConfig2,
    'transformResponse': defaultToConfig2,
    'paramsSerializer': defaultToConfig2,
    'timeout': defaultToConfig2,
    'timeoutMessage': defaultToConfig2,
    'withCredentials': defaultToConfig2,
    'adapter': defaultToConfig2,
    'responseType': defaultToConfig2,
    'xsrfCookieName': defaultToConfig2,
    'xsrfHeaderName': defaultToConfig2,
    'onUploadProgress': defaultToConfig2,
    'onDownloadProgress': defaultToConfig2,
    'decompress': defaultToConfig2,
    'maxContentLength': defaultToConfig2,
    'maxBodyLength': defaultToConfig2,
    'beforeRedirect': defaultToConfig2,
    'transport': defaultToConfig2,
    'httpAgent': defaultToConfig2,
    'httpsAgent': defaultToConfig2,
    'cancelToken': defaultToConfig2,
    'socketPath': defaultToConfig2,
    'responseEncoding': defaultToConfig2,
    'validateStatus': mergeDirectKeys
  };

  utils.forEach(Object.keys(config1).concat(Object.keys(config2)), function computeConfigValue(prop) {
    var merge = mergeMap[prop] || mergeDeepProperties;
    var configValue = merge(prop);
    (utils.isUndefined(configValue) && merge !== mergeDirectKeys) || (config[prop] = configValue);
  });

  return config;
};


/***/ }),

/***/ "./node_modules/axios/lib/core/settle.js":
/*!***********************************************!*\
  !*** ./node_modules/axios/lib/core/settle.js ***!
  \***********************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var AxiosError = __webpack_require__(/*! ./AxiosError */ "./node_modules/axios/lib/core/AxiosError.js");

/**
 * Resolve or reject a Promise based on response status.
 *
 * @param {Function} resolve A function that resolves the promise.
 * @param {Function} reject A function that rejects the promise.
 * @param {object} response The response.
 */
module.exports = function settle(resolve, reject, response) {
  var validateStatus = response.config.validateStatus;
  if (!response.status || !validateStatus || validateStatus(response.status)) {
    resolve(response);
  } else {
    reject(new AxiosError(
      'Request failed with status code ' + response.status,
      [AxiosError.ERR_BAD_REQUEST, AxiosError.ERR_BAD_RESPONSE][Math.floor(response.status / 100) - 4],
      response.config,
      response.request,
      response
    ));
  }
};


/***/ }),

/***/ "./node_modules/axios/lib/core/transformData.js":
/*!******************************************************!*\
  !*** ./node_modules/axios/lib/core/transformData.js ***!
  \******************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");
var defaults = __webpack_require__(/*! ../defaults */ "./node_modules/axios/lib/defaults/index.js");

/**
 * Transform the data for a request or a response
 *
 * @param {Object|String} data The data to be transformed
 * @param {Array} headers The headers for the request or response
 * @param {Array|Function} fns A single function or Array of functions
 * @returns {*} The resulting transformed data
 */
module.exports = function transformData(data, headers, fns) {
  var context = this || defaults;
  /*eslint no-param-reassign:0*/
  utils.forEach(fns, function transform(fn) {
    data = fn.call(context, data, headers);
  });

  return data;
};


/***/ }),

/***/ "./node_modules/axios/lib/defaults/index.js":
/*!**************************************************!*\
  !*** ./node_modules/axios/lib/defaults/index.js ***!
  \**************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(/*! ../utils */ "./node_modules/axios/lib/utils.js");
var normalizeHeaderName = __webpack_require__(/*! ../helpers/normalizeHeaderName */ "./node_modules/axios/lib/helpers/normalizeHeaderName.js");
var AxiosError = __webpack_require__(/*! ../core/AxiosError */ "./node_modules/axios/lib/core/AxiosError.js");
var transitionalDefaults = __webpack_require__(/*! ./transitional */ "./node_modules/axios/lib/defaults/transitional.js");
var toFormData = __webpack_require__(/*! ../helpers/toFormData */ "./node_modules/axios/lib/helpers/toFormData.js");

var DEFAULT_CONTENT_TYPE = {
  'Content-Type': 'application/x-www-form-urlencoded'
};

function setContentTypeIfUnset(headers, value) {
  if (!utils.isUndefined(headers) && utils.isUndefined(headers['Content-Type'])) {
    headers['Content-Type'] = value;
  }
}

function getDefaultAdapter() {
  var adapter;
  if (typeof XMLHttpRequest !== 'undefined') {
    // For browsers use XHR adapter
    adapter = __webpack_require__(/*! ../adapters/xhr */ "./node_modules/axios/lib/adapters/xhr.js");
  } else if (typeof process !== 'undefined' && Object.prototype.toString.call(process) === '[object process]') {
    // For node use HTTP adapter
    adapter = __webpack_require__(/*! ../adapters/http */ "./node_modules/axios/lib/adapters/xhr.js");
  }
  return adapter;
}

function stringifySafely(rawValue, parser, encoder) {
  if (utils.isString(rawValue)) {
    try {
      (parser || JSON.parse)(rawValue);
      return utils.trim(rawValue);
    } catch (e) {
      if (e.name !== 'SyntaxError') {
        throw e;
      }
    }
  }

  return (encoder || JSON.stringify)(rawValue);
}

var defaults = {

  transitional: transitionalDefaults,

  adapter: getDefaultAdapter(),

  transformRequest: [function transformRequest(data, headers) {
    normalizeHeaderName(headers, 'Accept');
    normalizeHeaderName(headers, 'Content-Type');

    if (utils.isFormData(data) ||
      utils.isArrayBuffer(data) ||
      utils.isBuffer(data) ||
      utils.isStream(data) ||
      utils.isFile(data) ||
      utils.isBlob(data)
    ) {
      return data;
    }
    if (utils.isArrayBufferView(data)) {
      return data.buffer;
    }
    if (utils.isURLSearchParams(data)) {
      setContentTypeIfUnset(headers, 'application/x-www-form-urlencoded;charset=utf-8');
      return data.toString();
    }

    var isObjectPayload = utils.isObject(data);
    var contentType = headers && headers['Content-Type'];

    var isFileList;

    if ((isFileList = utils.isFileList(data)) || (isObjectPayload && contentType === 'multipart/form-data')) {
      var _FormData = this.env && this.env.FormData;
      return toFormData(isFileList ? {'files[]': data} : data, _FormData && new _FormData());
    } else if (isObjectPayload || contentType === 'application/json') {
      setContentTypeIfUnset(headers, 'application/json');
      return stringifySafely(data);
    }

    return data;
  }],

  transformResponse: [function transformResponse(data) {
    var transitional = this.transitional || defaults.transitional;
    var silentJSONParsing = transitional && transitional.silentJSONParsing;
    var forcedJSONParsing = transitional && transitional.forcedJSONParsing;
    var strictJSONParsing = !silentJSONParsing && this.responseType === 'json';

    if (strictJSONParsing || (forcedJSONParsing && utils.isString(data) && data.length)) {
      try {
        return JSON.parse(data);
      } catch (e) {
        if (strictJSONParsing) {
          if (e.name === 'SyntaxError') {
            throw AxiosError.from(e, AxiosError.ERR_BAD_RESPONSE, this, null, this.response);
          }
          throw e;
        }
      }
    }

    return data;
  }],

  /**
   * A timeout in milliseconds to abort a request. If set to 0 (default) a
   * timeout is not created.
   */
  timeout: 0,

  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-XSRF-TOKEN',

  maxContentLength: -1,
  maxBodyLength: -1,

  env: {
    FormData: __webpack_require__(/*! ./env/FormData */ "./node_modules/axios/lib/helpers/null.js")
  },

  validateStatus: function validateStatus(status) {
    return status >= 200 && status < 300;
  },

  headers: {
    common: {
      'Accept': 'application/json, text/plain, */*'
    }
  }
};

utils.forEach(['delete', 'get', 'head'], function forEachMethodNoData(method) {
  defaults.headers[method] = {};
});

utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
  defaults.headers[method] = utils.merge(DEFAULT_CONTENT_TYPE);
});

module.exports = defaults;


/***/ }),

/***/ "./node_modules/axios/lib/defaults/transitional.js":
/*!*********************************************************!*\
  !*** ./node_modules/axios/lib/defaults/transitional.js ***!
  \*********************************************************/
/***/ (function(module) {

"use strict";


module.exports = {
  silentJSONParsing: true,
  forcedJSONParsing: true,
  clarifyTimeoutError: false
};


/***/ }),

/***/ "./node_modules/axios/lib/env/data.js":
/*!********************************************!*\
  !*** ./node_modules/axios/lib/env/data.js ***!
  \********************************************/
/***/ (function(module) {

module.exports = {
  "version": "0.27.2"
};

/***/ }),

/***/ "./node_modules/axios/lib/helpers/bind.js":
/*!************************************************!*\
  !*** ./node_modules/axios/lib/helpers/bind.js ***!
  \************************************************/
/***/ (function(module) {

"use strict";


module.exports = function bind(fn, thisArg) {
  return function wrap() {
    var args = new Array(arguments.length);
    for (var i = 0; i < args.length; i++) {
      args[i] = arguments[i];
    }
    return fn.apply(thisArg, args);
  };
};


/***/ }),

/***/ "./node_modules/axios/lib/helpers/buildURL.js":
/*!****************************************************!*\
  !*** ./node_modules/axios/lib/helpers/buildURL.js ***!
  \****************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");

function encode(val) {
  return encodeURIComponent(val).
    replace(/%3A/gi, ':').
    replace(/%24/g, '$').
    replace(/%2C/gi, ',').
    replace(/%20/g, '+').
    replace(/%5B/gi, '[').
    replace(/%5D/gi, ']');
}

/**
 * Build a URL by appending params to the end
 *
 * @param {string} url The base of the url (e.g., http://www.google.com)
 * @param {object} [params] The params to be appended
 * @returns {string} The formatted url
 */
module.exports = function buildURL(url, params, paramsSerializer) {
  /*eslint no-param-reassign:0*/
  if (!params) {
    return url;
  }

  var serializedParams;
  if (paramsSerializer) {
    serializedParams = paramsSerializer(params);
  } else if (utils.isURLSearchParams(params)) {
    serializedParams = params.toString();
  } else {
    var parts = [];

    utils.forEach(params, function serialize(val, key) {
      if (val === null || typeof val === 'undefined') {
        return;
      }

      if (utils.isArray(val)) {
        key = key + '[]';
      } else {
        val = [val];
      }

      utils.forEach(val, function parseValue(v) {
        if (utils.isDate(v)) {
          v = v.toISOString();
        } else if (utils.isObject(v)) {
          v = JSON.stringify(v);
        }
        parts.push(encode(key) + '=' + encode(v));
      });
    });

    serializedParams = parts.join('&');
  }

  if (serializedParams) {
    var hashmarkIndex = url.indexOf('#');
    if (hashmarkIndex !== -1) {
      url = url.slice(0, hashmarkIndex);
    }

    url += (url.indexOf('?') === -1 ? '?' : '&') + serializedParams;
  }

  return url;
};


/***/ }),

/***/ "./node_modules/axios/lib/helpers/combineURLs.js":
/*!*******************************************************!*\
  !*** ./node_modules/axios/lib/helpers/combineURLs.js ***!
  \*******************************************************/
/***/ (function(module) {

"use strict";


/**
 * Creates a new URL by combining the specified URLs
 *
 * @param {string} baseURL The base URL
 * @param {string} relativeURL The relative URL
 * @returns {string} The combined URL
 */
module.exports = function combineURLs(baseURL, relativeURL) {
  return relativeURL
    ? baseURL.replace(/\/+$/, '') + '/' + relativeURL.replace(/^\/+/, '')
    : baseURL;
};


/***/ }),

/***/ "./node_modules/axios/lib/helpers/cookies.js":
/*!***************************************************!*\
  !*** ./node_modules/axios/lib/helpers/cookies.js ***!
  \***************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");

module.exports = (
  utils.isStandardBrowserEnv() ?

  // Standard browser envs support document.cookie
    (function standardBrowserEnv() {
      return {
        write: function write(name, value, expires, path, domain, secure) {
          var cookie = [];
          cookie.push(name + '=' + encodeURIComponent(value));

          if (utils.isNumber(expires)) {
            cookie.push('expires=' + new Date(expires).toGMTString());
          }

          if (utils.isString(path)) {
            cookie.push('path=' + path);
          }

          if (utils.isString(domain)) {
            cookie.push('domain=' + domain);
          }

          if (secure === true) {
            cookie.push('secure');
          }

          document.cookie = cookie.join('; ');
        },

        read: function read(name) {
          var match = document.cookie.match(new RegExp('(^|;\\s*)(' + name + ')=([^;]*)'));
          return (match ? decodeURIComponent(match[3]) : null);
        },

        remove: function remove(name) {
          this.write(name, '', Date.now() - 86400000);
        }
      };
    })() :

  // Non standard browser env (web workers, react-native) lack needed support.
    (function nonStandardBrowserEnv() {
      return {
        write: function write() {},
        read: function read() { return null; },
        remove: function remove() {}
      };
    })()
);


/***/ }),

/***/ "./node_modules/axios/lib/helpers/isAbsoluteURL.js":
/*!*********************************************************!*\
  !*** ./node_modules/axios/lib/helpers/isAbsoluteURL.js ***!
  \*********************************************************/
/***/ (function(module) {

"use strict";


/**
 * Determines whether the specified URL is absolute
 *
 * @param {string} url The URL to test
 * @returns {boolean} True if the specified URL is absolute, otherwise false
 */
module.exports = function isAbsoluteURL(url) {
  // A URL is considered absolute if it begins with "<scheme>://" or "//" (protocol-relative URL).
  // RFC 3986 defines scheme name as a sequence of characters beginning with a letter and followed
  // by any combination of letters, digits, plus, period, or hyphen.
  return /^([a-z][a-z\d+\-.]*:)?\/\//i.test(url);
};


/***/ }),

/***/ "./node_modules/axios/lib/helpers/isAxiosError.js":
/*!********************************************************!*\
  !*** ./node_modules/axios/lib/helpers/isAxiosError.js ***!
  \********************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");

/**
 * Determines whether the payload is an error thrown by Axios
 *
 * @param {*} payload The value to test
 * @returns {boolean} True if the payload is an error thrown by Axios, otherwise false
 */
module.exports = function isAxiosError(payload) {
  return utils.isObject(payload) && (payload.isAxiosError === true);
};


/***/ }),

/***/ "./node_modules/axios/lib/helpers/isURLSameOrigin.js":
/*!***********************************************************!*\
  !*** ./node_modules/axios/lib/helpers/isURLSameOrigin.js ***!
  \***********************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");

module.exports = (
  utils.isStandardBrowserEnv() ?

  // Standard browser envs have full support of the APIs needed to test
  // whether the request URL is of the same origin as current location.
    (function standardBrowserEnv() {
      var msie = /(msie|trident)/i.test(navigator.userAgent);
      var urlParsingNode = document.createElement('a');
      var originURL;

      /**
    * Parse a URL to discover it's components
    *
    * @param {String} url The URL to be parsed
    * @returns {Object}
    */
      function resolveURL(url) {
        var href = url;

        if (msie) {
        // IE needs attribute set twice to normalize properties
          urlParsingNode.setAttribute('href', href);
          href = urlParsingNode.href;
        }

        urlParsingNode.setAttribute('href', href);

        // urlParsingNode provides the UrlUtils interface - http://url.spec.whatwg.org/#urlutils
        return {
          href: urlParsingNode.href,
          protocol: urlParsingNode.protocol ? urlParsingNode.protocol.replace(/:$/, '') : '',
          host: urlParsingNode.host,
          search: urlParsingNode.search ? urlParsingNode.search.replace(/^\?/, '') : '',
          hash: urlParsingNode.hash ? urlParsingNode.hash.replace(/^#/, '') : '',
          hostname: urlParsingNode.hostname,
          port: urlParsingNode.port,
          pathname: (urlParsingNode.pathname.charAt(0) === '/') ?
            urlParsingNode.pathname :
            '/' + urlParsingNode.pathname
        };
      }

      originURL = resolveURL(window.location.href);

      /**
    * Determine if a URL shares the same origin as the current location
    *
    * @param {String} requestURL The URL to test
    * @returns {boolean} True if URL shares the same origin, otherwise false
    */
      return function isURLSameOrigin(requestURL) {
        var parsed = (utils.isString(requestURL)) ? resolveURL(requestURL) : requestURL;
        return (parsed.protocol === originURL.protocol &&
            parsed.host === originURL.host);
      };
    })() :

  // Non standard browser envs (web workers, react-native) lack needed support.
    (function nonStandardBrowserEnv() {
      return function isURLSameOrigin() {
        return true;
      };
    })()
);


/***/ }),

/***/ "./node_modules/axios/lib/helpers/normalizeHeaderName.js":
/*!***************************************************************!*\
  !*** ./node_modules/axios/lib/helpers/normalizeHeaderName.js ***!
  \***************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(/*! ../utils */ "./node_modules/axios/lib/utils.js");

module.exports = function normalizeHeaderName(headers, normalizedName) {
  utils.forEach(headers, function processHeader(value, name) {
    if (name !== normalizedName && name.toUpperCase() === normalizedName.toUpperCase()) {
      headers[normalizedName] = value;
      delete headers[name];
    }
  });
};


/***/ }),

/***/ "./node_modules/axios/lib/helpers/null.js":
/*!************************************************!*\
  !*** ./node_modules/axios/lib/helpers/null.js ***!
  \************************************************/
/***/ (function(module) {

// eslint-disable-next-line strict
module.exports = null;


/***/ }),

/***/ "./node_modules/axios/lib/helpers/parseHeaders.js":
/*!********************************************************!*\
  !*** ./node_modules/axios/lib/helpers/parseHeaders.js ***!
  \********************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");

// Headers whose duplicates are ignored by node
// c.f. https://nodejs.org/api/http.html#http_message_headers
var ignoreDuplicateOf = [
  'age', 'authorization', 'content-length', 'content-type', 'etag',
  'expires', 'from', 'host', 'if-modified-since', 'if-unmodified-since',
  'last-modified', 'location', 'max-forwards', 'proxy-authorization',
  'referer', 'retry-after', 'user-agent'
];

/**
 * Parse headers into an object
 *
 * ```
 * Date: Wed, 27 Aug 2014 08:58:49 GMT
 * Content-Type: application/json
 * Connection: keep-alive
 * Transfer-Encoding: chunked
 * ```
 *
 * @param {String} headers Headers needing to be parsed
 * @returns {Object} Headers parsed into an object
 */
module.exports = function parseHeaders(headers) {
  var parsed = {};
  var key;
  var val;
  var i;

  if (!headers) { return parsed; }

  utils.forEach(headers.split('\n'), function parser(line) {
    i = line.indexOf(':');
    key = utils.trim(line.substr(0, i)).toLowerCase();
    val = utils.trim(line.substr(i + 1));

    if (key) {
      if (parsed[key] && ignoreDuplicateOf.indexOf(key) >= 0) {
        return;
      }
      if (key === 'set-cookie') {
        parsed[key] = (parsed[key] ? parsed[key] : []).concat([val]);
      } else {
        parsed[key] = parsed[key] ? parsed[key] + ', ' + val : val;
      }
    }
  });

  return parsed;
};


/***/ }),

/***/ "./node_modules/axios/lib/helpers/parseProtocol.js":
/*!*********************************************************!*\
  !*** ./node_modules/axios/lib/helpers/parseProtocol.js ***!
  \*********************************************************/
/***/ (function(module) {

"use strict";


module.exports = function parseProtocol(url) {
  var match = /^([-+\w]{1,25})(:?\/\/|:)/.exec(url);
  return match && match[1] || '';
};


/***/ }),

/***/ "./node_modules/axios/lib/helpers/spread.js":
/*!**************************************************!*\
  !*** ./node_modules/axios/lib/helpers/spread.js ***!
  \**************************************************/
/***/ (function(module) {

"use strict";


/**
 * Syntactic sugar for invoking a function and expanding an array for arguments.
 *
 * Common use case would be to use `Function.prototype.apply`.
 *
 *  ```js
 *  function f(x, y, z) {}
 *  var args = [1, 2, 3];
 *  f.apply(null, args);
 *  ```
 *
 * With `spread` this example can be re-written.
 *
 *  ```js
 *  spread(function(x, y, z) {})([1, 2, 3]);
 *  ```
 *
 * @param {Function} callback
 * @returns {Function}
 */
module.exports = function spread(callback) {
  return function wrap(arr) {
    return callback.apply(null, arr);
  };
};


/***/ }),

/***/ "./node_modules/axios/lib/helpers/toFormData.js":
/*!******************************************************!*\
  !*** ./node_modules/axios/lib/helpers/toFormData.js ***!
  \******************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(/*! ../utils */ "./node_modules/axios/lib/utils.js");

/**
 * Convert a data object to FormData
 * @param {Object} obj
 * @param {?Object} [formData]
 * @returns {Object}
 **/

function toFormData(obj, formData) {
  // eslint-disable-next-line no-param-reassign
  formData = formData || new FormData();

  var stack = [];

  function convertValue(value) {
    if (value === null) return '';

    if (utils.isDate(value)) {
      return value.toISOString();
    }

    if (utils.isArrayBuffer(value) || utils.isTypedArray(value)) {
      return typeof Blob === 'function' ? new Blob([value]) : Buffer.from(value);
    }

    return value;
  }

  function build(data, parentKey) {
    if (utils.isPlainObject(data) || utils.isArray(data)) {
      if (stack.indexOf(data) !== -1) {
        throw Error('Circular reference detected in ' + parentKey);
      }

      stack.push(data);

      utils.forEach(data, function each(value, key) {
        if (utils.isUndefined(value)) return;
        var fullKey = parentKey ? parentKey + '.' + key : key;
        var arr;

        if (value && !parentKey && typeof value === 'object') {
          if (utils.endsWith(key, '{}')) {
            // eslint-disable-next-line no-param-reassign
            value = JSON.stringify(value);
          } else if (utils.endsWith(key, '[]') && (arr = utils.toArray(value))) {
            // eslint-disable-next-line func-names
            arr.forEach(function(el) {
              !utils.isUndefined(el) && formData.append(fullKey, convertValue(el));
            });
            return;
          }
        }

        build(value, fullKey);
      });

      stack.pop();
    } else {
      formData.append(parentKey, convertValue(data));
    }
  }

  build(obj);

  return formData;
}

module.exports = toFormData;


/***/ }),

/***/ "./node_modules/axios/lib/helpers/validator.js":
/*!*****************************************************!*\
  !*** ./node_modules/axios/lib/helpers/validator.js ***!
  \*****************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var VERSION = (__webpack_require__(/*! ../env/data */ "./node_modules/axios/lib/env/data.js").version);
var AxiosError = __webpack_require__(/*! ../core/AxiosError */ "./node_modules/axios/lib/core/AxiosError.js");

var validators = {};

// eslint-disable-next-line func-names
['object', 'boolean', 'number', 'function', 'string', 'symbol'].forEach(function(type, i) {
  validators[type] = function validator(thing) {
    return typeof thing === type || 'a' + (i < 1 ? 'n ' : ' ') + type;
  };
});

var deprecatedWarnings = {};

/**
 * Transitional option validator
 * @param {function|boolean?} validator - set to false if the transitional option has been removed
 * @param {string?} version - deprecated version / removed since version
 * @param {string?} message - some message with additional info
 * @returns {function}
 */
validators.transitional = function transitional(validator, version, message) {
  function formatMessage(opt, desc) {
    return '[Axios v' + VERSION + '] Transitional option \'' + opt + '\'' + desc + (message ? '. ' + message : '');
  }

  // eslint-disable-next-line func-names
  return function(value, opt, opts) {
    if (validator === false) {
      throw new AxiosError(
        formatMessage(opt, ' has been removed' + (version ? ' in ' + version : '')),
        AxiosError.ERR_DEPRECATED
      );
    }

    if (version && !deprecatedWarnings[opt]) {
      deprecatedWarnings[opt] = true;
      // eslint-disable-next-line no-console
      console.warn(
        formatMessage(
          opt,
          ' has been deprecated since v' + version + ' and will be removed in the near future'
        )
      );
    }

    return validator ? validator(value, opt, opts) : true;
  };
};

/**
 * Assert object's properties type
 * @param {object} options
 * @param {object} schema
 * @param {boolean?} allowUnknown
 */

function assertOptions(options, schema, allowUnknown) {
  if (typeof options !== 'object') {
    throw new AxiosError('options must be an object', AxiosError.ERR_BAD_OPTION_VALUE);
  }
  var keys = Object.keys(options);
  var i = keys.length;
  while (i-- > 0) {
    var opt = keys[i];
    var validator = schema[opt];
    if (validator) {
      var value = options[opt];
      var result = value === undefined || validator(value, opt, options);
      if (result !== true) {
        throw new AxiosError('option ' + opt + ' must be ' + result, AxiosError.ERR_BAD_OPTION_VALUE);
      }
      continue;
    }
    if (allowUnknown !== true) {
      throw new AxiosError('Unknown option ' + opt, AxiosError.ERR_BAD_OPTION);
    }
  }
}

module.exports = {
  assertOptions: assertOptions,
  validators: validators
};


/***/ }),

/***/ "./node_modules/axios/lib/utils.js":
/*!*****************************************!*\
  !*** ./node_modules/axios/lib/utils.js ***!
  \*****************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var bind = __webpack_require__(/*! ./helpers/bind */ "./node_modules/axios/lib/helpers/bind.js");

// utils is a library of generic helper functions non-specific to axios

var toString = Object.prototype.toString;

// eslint-disable-next-line func-names
var kindOf = (function(cache) {
  // eslint-disable-next-line func-names
  return function(thing) {
    var str = toString.call(thing);
    return cache[str] || (cache[str] = str.slice(8, -1).toLowerCase());
  };
})(Object.create(null));

function kindOfTest(type) {
  type = type.toLowerCase();
  return function isKindOf(thing) {
    return kindOf(thing) === type;
  };
}

/**
 * Determine if a value is an Array
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an Array, otherwise false
 */
function isArray(val) {
  return Array.isArray(val);
}

/**
 * Determine if a value is undefined
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if the value is undefined, otherwise false
 */
function isUndefined(val) {
  return typeof val === 'undefined';
}

/**
 * Determine if a value is a Buffer
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Buffer, otherwise false
 */
function isBuffer(val) {
  return val !== null && !isUndefined(val) && val.constructor !== null && !isUndefined(val.constructor)
    && typeof val.constructor.isBuffer === 'function' && val.constructor.isBuffer(val);
}

/**
 * Determine if a value is an ArrayBuffer
 *
 * @function
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an ArrayBuffer, otherwise false
 */
var isArrayBuffer = kindOfTest('ArrayBuffer');


/**
 * Determine if a value is a view on an ArrayBuffer
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a view on an ArrayBuffer, otherwise false
 */
function isArrayBufferView(val) {
  var result;
  if ((typeof ArrayBuffer !== 'undefined') && (ArrayBuffer.isView)) {
    result = ArrayBuffer.isView(val);
  } else {
    result = (val) && (val.buffer) && (isArrayBuffer(val.buffer));
  }
  return result;
}

/**
 * Determine if a value is a String
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a String, otherwise false
 */
function isString(val) {
  return typeof val === 'string';
}

/**
 * Determine if a value is a Number
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Number, otherwise false
 */
function isNumber(val) {
  return typeof val === 'number';
}

/**
 * Determine if a value is an Object
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an Object, otherwise false
 */
function isObject(val) {
  return val !== null && typeof val === 'object';
}

/**
 * Determine if a value is a plain Object
 *
 * @param {Object} val The value to test
 * @return {boolean} True if value is a plain Object, otherwise false
 */
function isPlainObject(val) {
  if (kindOf(val) !== 'object') {
    return false;
  }

  var prototype = Object.getPrototypeOf(val);
  return prototype === null || prototype === Object.prototype;
}

/**
 * Determine if a value is a Date
 *
 * @function
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Date, otherwise false
 */
var isDate = kindOfTest('Date');

/**
 * Determine if a value is a File
 *
 * @function
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a File, otherwise false
 */
var isFile = kindOfTest('File');

/**
 * Determine if a value is a Blob
 *
 * @function
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Blob, otherwise false
 */
var isBlob = kindOfTest('Blob');

/**
 * Determine if a value is a FileList
 *
 * @function
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a File, otherwise false
 */
var isFileList = kindOfTest('FileList');

/**
 * Determine if a value is a Function
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Function, otherwise false
 */
function isFunction(val) {
  return toString.call(val) === '[object Function]';
}

/**
 * Determine if a value is a Stream
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Stream, otherwise false
 */
function isStream(val) {
  return isObject(val) && isFunction(val.pipe);
}

/**
 * Determine if a value is a FormData
 *
 * @param {Object} thing The value to test
 * @returns {boolean} True if value is an FormData, otherwise false
 */
function isFormData(thing) {
  var pattern = '[object FormData]';
  return thing && (
    (typeof FormData === 'function' && thing instanceof FormData) ||
    toString.call(thing) === pattern ||
    (isFunction(thing.toString) && thing.toString() === pattern)
  );
}

/**
 * Determine if a value is a URLSearchParams object
 * @function
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a URLSearchParams object, otherwise false
 */
var isURLSearchParams = kindOfTest('URLSearchParams');

/**
 * Trim excess whitespace off the beginning and end of a string
 *
 * @param {String} str The String to trim
 * @returns {String} The String freed of excess whitespace
 */
function trim(str) {
  return str.trim ? str.trim() : str.replace(/^\s+|\s+$/g, '');
}

/**
 * Determine if we're running in a standard browser environment
 *
 * This allows axios to run in a web worker, and react-native.
 * Both environments support XMLHttpRequest, but not fully standard globals.
 *
 * web workers:
 *  typeof window -> undefined
 *  typeof document -> undefined
 *
 * react-native:
 *  navigator.product -> 'ReactNative'
 * nativescript
 *  navigator.product -> 'NativeScript' or 'NS'
 */
function isStandardBrowserEnv() {
  if (typeof navigator !== 'undefined' && (navigator.product === 'ReactNative' ||
                                           navigator.product === 'NativeScript' ||
                                           navigator.product === 'NS')) {
    return false;
  }
  return (
    typeof window !== 'undefined' &&
    typeof document !== 'undefined'
  );
}

/**
 * Iterate over an Array or an Object invoking a function for each item.
 *
 * If `obj` is an Array callback will be called passing
 * the value, index, and complete array for each item.
 *
 * If 'obj' is an Object callback will be called passing
 * the value, key, and complete object for each property.
 *
 * @param {Object|Array} obj The object to iterate
 * @param {Function} fn The callback to invoke for each item
 */
function forEach(obj, fn) {
  // Don't bother if no value provided
  if (obj === null || typeof obj === 'undefined') {
    return;
  }

  // Force an array if not already something iterable
  if (typeof obj !== 'object') {
    /*eslint no-param-reassign:0*/
    obj = [obj];
  }

  if (isArray(obj)) {
    // Iterate over array values
    for (var i = 0, l = obj.length; i < l; i++) {
      fn.call(null, obj[i], i, obj);
    }
  } else {
    // Iterate over object keys
    for (var key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        fn.call(null, obj[key], key, obj);
      }
    }
  }
}

/**
 * Accepts varargs expecting each argument to be an object, then
 * immutably merges the properties of each object and returns result.
 *
 * When multiple objects contain the same key the later object in
 * the arguments list will take precedence.
 *
 * Example:
 *
 * ```js
 * var result = merge({foo: 123}, {foo: 456});
 * console.log(result.foo); // outputs 456
 * ```
 *
 * @param {Object} obj1 Object to merge
 * @returns {Object} Result of all merge properties
 */
function merge(/* obj1, obj2, obj3, ... */) {
  var result = {};
  function assignValue(val, key) {
    if (isPlainObject(result[key]) && isPlainObject(val)) {
      result[key] = merge(result[key], val);
    } else if (isPlainObject(val)) {
      result[key] = merge({}, val);
    } else if (isArray(val)) {
      result[key] = val.slice();
    } else {
      result[key] = val;
    }
  }

  for (var i = 0, l = arguments.length; i < l; i++) {
    forEach(arguments[i], assignValue);
  }
  return result;
}

/**
 * Extends object a by mutably adding to it the properties of object b.
 *
 * @param {Object} a The object to be extended
 * @param {Object} b The object to copy properties from
 * @param {Object} thisArg The object to bind function to
 * @return {Object} The resulting value of object a
 */
function extend(a, b, thisArg) {
  forEach(b, function assignValue(val, key) {
    if (thisArg && typeof val === 'function') {
      a[key] = bind(val, thisArg);
    } else {
      a[key] = val;
    }
  });
  return a;
}

/**
 * Remove byte order marker. This catches EF BB BF (the UTF-8 BOM)
 *
 * @param {string} content with BOM
 * @return {string} content value without BOM
 */
function stripBOM(content) {
  if (content.charCodeAt(0) === 0xFEFF) {
    content = content.slice(1);
  }
  return content;
}

/**
 * Inherit the prototype methods from one constructor into another
 * @param {function} constructor
 * @param {function} superConstructor
 * @param {object} [props]
 * @param {object} [descriptors]
 */

function inherits(constructor, superConstructor, props, descriptors) {
  constructor.prototype = Object.create(superConstructor.prototype, descriptors);
  constructor.prototype.constructor = constructor;
  props && Object.assign(constructor.prototype, props);
}

/**
 * Resolve object with deep prototype chain to a flat object
 * @param {Object} sourceObj source object
 * @param {Object} [destObj]
 * @param {Function} [filter]
 * @returns {Object}
 */

function toFlatObject(sourceObj, destObj, filter) {
  var props;
  var i;
  var prop;
  var merged = {};

  destObj = destObj || {};

  do {
    props = Object.getOwnPropertyNames(sourceObj);
    i = props.length;
    while (i-- > 0) {
      prop = props[i];
      if (!merged[prop]) {
        destObj[prop] = sourceObj[prop];
        merged[prop] = true;
      }
    }
    sourceObj = Object.getPrototypeOf(sourceObj);
  } while (sourceObj && (!filter || filter(sourceObj, destObj)) && sourceObj !== Object.prototype);

  return destObj;
}

/*
 * determines whether a string ends with the characters of a specified string
 * @param {String} str
 * @param {String} searchString
 * @param {Number} [position= 0]
 * @returns {boolean}
 */
function endsWith(str, searchString, position) {
  str = String(str);
  if (position === undefined || position > str.length) {
    position = str.length;
  }
  position -= searchString.length;
  var lastIndex = str.indexOf(searchString, position);
  return lastIndex !== -1 && lastIndex === position;
}


/**
 * Returns new array from array like object
 * @param {*} [thing]
 * @returns {Array}
 */
function toArray(thing) {
  if (!thing) return null;
  var i = thing.length;
  if (isUndefined(i)) return null;
  var arr = new Array(i);
  while (i-- > 0) {
    arr[i] = thing[i];
  }
  return arr;
}

// eslint-disable-next-line func-names
var isTypedArray = (function(TypedArray) {
  // eslint-disable-next-line func-names
  return function(thing) {
    return TypedArray && thing instanceof TypedArray;
  };
})(typeof Uint8Array !== 'undefined' && Object.getPrototypeOf(Uint8Array));

module.exports = {
  isArray: isArray,
  isArrayBuffer: isArrayBuffer,
  isBuffer: isBuffer,
  isFormData: isFormData,
  isArrayBufferView: isArrayBufferView,
  isString: isString,
  isNumber: isNumber,
  isObject: isObject,
  isPlainObject: isPlainObject,
  isUndefined: isUndefined,
  isDate: isDate,
  isFile: isFile,
  isBlob: isBlob,
  isFunction: isFunction,
  isStream: isStream,
  isURLSearchParams: isURLSearchParams,
  isStandardBrowserEnv: isStandardBrowserEnv,
  forEach: forEach,
  merge: merge,
  extend: extend,
  trim: trim,
  stripBOM: stripBOM,
  inherits: inherits,
  toFlatObject: toFlatObject,
  kindOf: kindOf,
  kindOfTest: kindOfTest,
  endsWith: endsWith,
  toArray: toArray,
  isTypedArray: isTypedArray,
  isFileList: isFileList
};


/***/ }),

/***/ "./src/components/Field/Checkbox.js":
/*!******************************************!*\
  !*** ./src/components/Field/Checkbox.js ***!
  \******************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../utils */ "./src/components/utils.js");




const Checkbox = _ref => {
  let {
    id,
    label,
    isChecked,
    onChange,
    description,
    isPro
  } = _ref;
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "__form_control __checkbox_toggle"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "__inner"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "__label"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("label", {
    htmlFor: id
  }, label, (0,_utils__WEBPACK_IMPORTED_MODULE_2__.proTag)(isPro))), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "__wrapper"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "__input_wrapper"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.CheckboxControl, {
    checked: isChecked,
    id: id,
    onChange: value => onChange(value, id)
  })))), description && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("p", {
    className: "description",
    dangerouslySetInnerHTML: {
      __html: description
    }
  }));
};

/* harmony default export */ __webpack_exports__["default"] = (Checkbox);

/***/ }),

/***/ "./src/components/Field/Listbox.js":
/*!*****************************************!*\
  !*** ./src/components/Field/Listbox.js ***!
  \*****************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! classnames */ "./node_modules/classnames/index.js");
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(classnames__WEBPACK_IMPORTED_MODULE_2__);





const Listbox = _ref => {
  let {
    id,
    label,
    description,
    options,
    value,
    onChange
  } = _ref;
  const wrapperRef = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useRef)(null);
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useLayoutEffect)(() => {
    if (!wrapperRef || !wrapperRef.current) {
      return;
    }

    const target = wrapperRef.current.querySelector('.active');

    if (null === target) {
      return;
    }
    /**
     * @source https://stackoverflow.com/a/11041376
     */


    target.parentNode.parentNode.scrollTop = target.offsetTop - target.parentNode.parentNode.offsetTop;
  }, []);
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "__form_control __form_control_listbox"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "__inner"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "__label"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("label", {
    htmlFor: id
  }, label)), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "__wrapper"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "__input_wrapper"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "__form_input_listbox"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.__experimentalScrollable, {
    style: {
      maxHeight: 92
    }
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    ref: wrapperRef
  }, options.map((option, index) => (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    key: `listbox-${option.value}-${index}`,
    className: classnames__WEBPACK_IMPORTED_MODULE_2___default()('__item', {
      active: option.value === value
    }),
    tabIndex: 0,
    onClick: () => onChange(option.value)
  }, option.label)))))))), description && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("p", {
    className: "description",
    dangerouslySetInnerHTML: {
      __html: description
    }
  }));
};

/* harmony default export */ __webpack_exports__["default"] = (Listbox);

/***/ }),

/***/ "./src/components/Field/Number.js":
/*!****************************************!*\
  !*** ./src/components/Field/Number.js ***!
  \****************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _babel_runtime_helpers_extends__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/extends */ "./node_modules/@babel/runtime/helpers/esm/extends.js");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _Text__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Text */ "./src/components/Field/Text.js");




const Number = _ref => {
  let {
    label,
    id,
    value,
    onChange,
    description,
    type = 'text',
    ...rest
  } = _ref;
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)("div", {
    className: "__form_control number"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)("div", {
    className: "__inner"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)("div", {
    className: "__label"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)("label", {
    htmlFor: id
  }, label)), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)("div", {
    className: "__wrapper"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)("div", {
    className: "__input_wrapper"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_Text__WEBPACK_IMPORTED_MODULE_2__["default"], (0,_babel_runtime_helpers_extends__WEBPACK_IMPORTED_MODULE_0__["default"])({
    type: type,
    id: id,
    value: value,
    onChange: onChange,
    renderAsFormField: false
  }, rest))))), description && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)("p", {
    className: "description",
    dangerouslySetInnerHTML: {
      __html: description
    }
  }));
};

/* harmony default export */ __webpack_exports__["default"] = (Number);

/***/ }),

/***/ "./src/components/Field/Text.js":
/*!**************************************!*\
  !*** ./src/components/Field/Text.js ***!
  \**************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _babel_runtime_helpers_extends__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/extends */ "./node_modules/@babel/runtime/helpers/esm/extends.js");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _Filter_wp_fe_sanitize_title__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../Filter/wp-fe-sanitize-title */ "./src/components/Filter/wp-fe-sanitize-title.js");





const InputField = _ref => {
  let {
    id,
    index,
    initialValue,
    onChange,
    type = 'text',
    isFilterKey,
    ...rest
  } = _ref;
  const [value, setValue] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.useState)(initialValue);
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.useLayoutEffect)(() => {
    setValue(initialValue);
  }, [initialValue]);

  const handleInputChange = e => {
    let _value;

    if (isFilterKey) {
      _value = (0,_Filter_wp_fe_sanitize_title__WEBPACK_IMPORTED_MODULE_2__.wpFeSanitizeTitle)(e.target.value);
    } else {
      _value = e.target.value;
    }

    setValue(_value);
  };

  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)("input", (0,_babel_runtime_helpers_extends__WEBPACK_IMPORTED_MODULE_0__["default"])({
    type: type,
    id: id,
    className: "components-text-control__input",
    value: value,
    onChange: handleInputChange,
    onBlur: () => onChange(value, id, index)
  }, rest));
};

const Text = _ref2 => {
  let {
    label,
    id,
    value,
    index,
    // Index is used on the manual options table
    onChange,
    description,
    type = 'text',
    renderAsFormField = true,
    isFilterKey = false,
    ...rest
  } = _ref2;

  if (renderAsFormField) {
    return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)("div", {
      className: "__form_control"
    }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)("div", {
      className: "__inner"
    }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)("div", {
      className: "__label"
    }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)("label", {
      htmlFor: id
    }, label)), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)("div", {
      className: "__wrapper"
    }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)("div", {
      className: "__input_wrapper"
    }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(InputField, (0,_babel_runtime_helpers_extends__WEBPACK_IMPORTED_MODULE_0__["default"])({
      id: id,
      index: index,
      initialValue: value,
      onChange: onChange,
      type: type,
      isFilterKey: isFilterKey
    }, rest))))), description && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)("p", {
      className: "description",
      dangerouslySetInnerHTML: {
        __html: description
      }
    }));
  } else {
    return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(InputField, (0,_babel_runtime_helpers_extends__WEBPACK_IMPORTED_MODULE_0__["default"])({
      id: id,
      index: index,
      initialValue: value,
      onChange: onChange,
      type: type,
      isFilterKey: isFilterKey
    }, rest));
  }
};

/* harmony default export */ __webpack_exports__["default"] = (Text);

/***/ }),

/***/ "./src/components/Field/ToggleGroup.js":
/*!*********************************************!*\
  !*** ./src/components/Field/ToggleGroup.js ***!
  \*********************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../utils */ "./src/components/utils.js");




const ToggleGroup = _ref => {
  let {
    label,
    id,
    value,
    options,
    onChange,
    description,
    isPro
  } = _ref;
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "__form_control"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "__inner"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "__label"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("label", {
    htmlFor: id
  }, label, (0,_utils__WEBPACK_IMPORTED_MODULE_2__.proTag)(isPro))), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "__wrapper"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "__input_wrapper"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.ButtonGroup, null, options.map(option => (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.Button, {
    value: option.value,
    key: `radio-group-${id}-${option.value}`,
    onClick: () => onChange(option.value, id),
    variant: value === option.value ? 'primary' : ''
  }, option.label, (0,_utils__WEBPACK_IMPORTED_MODULE_2__.proTag)(option.isPro))))))), description && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("p", {
    className: "description",
    dangerouslySetInnerHTML: {
      __html: description
    }
  }));
};

/* harmony default export */ __webpack_exports__["default"] = (ToggleGroup);

/***/ }),

/***/ "./src/components/Filter/FilterNav/FilterUI/AvailableFilters.js":
/*!**********************************************************************!*\
  !*** ./src/components/Filter/FilterNav/FilterUI/AvailableFilters.js ***!
  \**********************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../utils */ "./src/components/Filter/utils.js");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../utils */ "./src/components/utils.js");






const AvailableFilters = _ref => {
  let {
    state,
    dispatch,
    callback
  } = _ref;
  const {
    filterType,
    activeFilterData,
    additionalData: {
      initial_filter_keys: initialFilterKeysData
    },
    filtersData
  } = state;

  const handleSetFilterType = filter => {
    const _filterType = filter.type;

    if (_filterType === filterType) {
      return;
    }

    dispatch({
      type: 'SET_FILTER_TYPE',
      payload: _filterType
    });
    let _activeFilterData = filtersData[_filterType];

    if (!_activeFilterData) {
      _activeFilterData = (0,_utils__WEBPACK_IMPORTED_MODULE_3__.getFilterDefaultData)(_filterType, initialFilterKeysData);
    }

    dispatch({
      type: 'SET_ACTIVE_FILTER_DATA',
      payload: _activeFilterData
    });
    const _filtersData = { ...filtersData,
      [filterType]: activeFilterData
    };
    dispatch({
      type: 'SET_FILTERS_DATA',
      payload: _filtersData
    }); // Make the filter dirty.

    if (callback) {
      callback();
    }
  };

  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "__available_filters"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "__inner"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("p", {
    className: "__description"
  }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Select a component to start building the filter.', 'wc-ajax-product-filter')), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "__filters"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.NavigableMenu, {
    role: 'menu',
    orientation: "horizontal"
  }, (0,_utils__WEBPACK_IMPORTED_MODULE_3__.availableFilters)().map(filter => {
    let _classes = '__item';

    if (filterType === filter.type) {
      _classes += ' active';
    }

    return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Button, {
      className: _classes,
      key: filter.type,
      onClick: () => handleSetFilterType(filter)
    }, filter.title, (0,_utils__WEBPACK_IMPORTED_MODULE_4__.proTag)(filter.isPro));
  })))));
};

/* harmony default export */ __webpack_exports__["default"] = (AvailableFilters);

/***/ }),

/***/ "./src/components/Filter/FilterNav/FilterUI/GeneralFields.js":
/*!*******************************************************************!*\
  !*** ./src/components/Filter/FilterNav/FilterUI/GeneralFields.js ***!
  \*******************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! lodash */ "lodash");
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(lodash__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _wp_fe_sanitize_title__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../wp-fe-sanitize-title */ "./src/components/Filter/wp-fe-sanitize-title.js");
/* harmony import */ var _Field_Listbox__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../Field/Listbox */ "./src/components/Field/Listbox.js");
/* harmony import */ var _Field_Text__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../../Field/Text */ "./src/components/Field/Text.js");
/* harmony import */ var _Field_ToggleGroup__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../../Field/ToggleGroup */ "./src/components/Field/ToggleGroup.js");
/* harmony import */ var _Field_Checkbox__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../../Field/Checkbox */ "./src/components/Field/Checkbox.js");
/* harmony import */ var _useFilterData__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../useFilterData */ "./src/components/Filter/useFilterData.js");
/* harmony import */ var _Field_Number__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../../../Field/Number */ "./src/components/Field/Number.js");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../../utils */ "./src/components/Filter/utils.js");













const GeneralFields = _ref => {
  let {
    state,
    dispatch
  } = _ref;
  const {
    handleCheckboxChange,
    handleToggleGroupChange,
    handleTextFieldChange,
    setActiveFilterData,
    setActiveFilterMultiData
  } = (0,_useFilterData__WEBPACK_IMPORTED_MODULE_8__["default"])(state, dispatch);
  const {
    filterType,
    activeFilterData,
    additionalData,
    filterKeys
  } = state;
  const {
    field_key,
    value_type,
    value_decimal,
    value_decimal_places,
    post_property
  } = activeFilterData;
  const {
    initial_filter_keys: initialFilterKeysData
  } = additionalData;
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    var _post_property_data$p;

    if ('post-property' !== filterType) {
      return;
    }

    const {
      post_property_data
    } = additionalData;
    const propertyType = (_post_property_data$p = post_property_data[post_property]) !== null && _post_property_data$p !== void 0 ? _post_property_data$p : 'text';
    setActiveFilterData('value_type', propertyType, false);
  }, [post_property]);
  /**
   * TODO: Check if key is already in use, then generate a new one.
   *
   * type = 'post-meta'
   * value = '_stock_status'
   * property = 'meta_key'
   */

  const handleVariableFilterTypesChange = (type, value, property) => {
    let filterKey;

    let _filterKeys;

    if ((0,lodash__WEBPACK_IMPORTED_MODULE_2__.has)(filterKeys, [type, value])) {
      filterKey = filterKeys[type][value];
    } else {
      if ((0,lodash__WEBPACK_IMPORTED_MODULE_2__.has)(initialFilterKeysData, [type, value])) {
        filterKey = initialFilterKeysData[type][value];
      } else {
        filterKey = '_' + (0,_wp_fe_sanitize_title__WEBPACK_IMPORTED_MODULE_3__.wpFeSanitizeTitle)(value);
      }

      _filterKeys = { ...filterKeys,
        [type]: { ...filterKeys[type],
          [value]: filterKey
        }
      };
    }

    const data = {
      field_key: filterKey,
      [property]: value
    };
    setActiveFilterMultiData(data);

    if (_filterKeys) {
      dispatch({
        type: 'SET_FILTER_KEYS',
        payload: _filterKeys
      });
    }
  };

  const handleTaxonomyChange = value => {
    const {
      type,
      taxonomy
    } = activeFilterData;

    if (value === taxonomy) {
      return;
    }

    handleVariableFilterTypesChange(type, value, 'taxonomy');
  };

  const taxonomyField = () => {
    if ('custom-taxonomy' === filterType || 'attribute' === filterType) {
      const taxonomy = activeFilterData['taxonomy'];
      let taxonomyFieldLabel;
      let taxonomyFieldDesc;
      let data = {};
      let options = [];

      if ('custom-taxonomy' === filterType) {
        taxonomyFieldLabel = (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Taxonomy', 'wc-ajax-product-filter');
        taxonomyFieldDesc = (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Select the taxonomy that terms will be available as filter options.', 'wc-ajax-product-filter');
        data = additionalData['custom_taxonomies'];
      } else {
        taxonomyFieldLabel = (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Attribute', 'wc-ajax-product-filter');
        taxonomyFieldDesc = (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Select the attribute that values will be available as filter options.', 'wc-ajax-product-filter');
        data = additionalData['attributes'];
      }

      for (const [value, label] of Object.entries(data)) {
        options.push({
          label,
          value
        });
      }

      return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_Field_Listbox__WEBPACK_IMPORTED_MODULE_4__["default"], {
        label: taxonomyFieldLabel,
        description: taxonomyFieldDesc,
        id: 'taxonomy',
        options: options,
        value: taxonomy,
        onChange: handleTaxonomyChange,
        searchable: false
      });
    }
  };

  const handleMetaKeyChange = value => {
    const {
      type,
      meta_key
    } = activeFilterData;

    if (value === meta_key) {
      return;
    }

    handleVariableFilterTypesChange(type, value, 'meta_key');
  };

  const postMetaField = () => {
    if ('post-meta' === filterType) {
      const metaKey = activeFilterData['meta_key'];
      const data = additionalData['meta_keys'];
      let options = [];

      for (const [value, label] of Object.entries(data)) {
        options.push({
          label,
          value
        });
      }

      return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_Field_Listbox__WEBPACK_IMPORTED_MODULE_4__["default"], {
        id: 'meta_key',
        label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Meta Key', 'wc-ajax-product-filter'),
        description: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Select the meta key that values will be available as filter options.', 'wc-ajax-product-filter'),
        options: options,
        value: metaKey,
        onChange: handleMetaKeyChange,
        visible: 4
      }));
    }
  };

  const handlePostPropertyChange = value => {
    const {
      type,
      post_property
    } = activeFilterData;

    if (value === post_property) {
      return;
    }

    handleVariableFilterTypesChange(type, value, 'post_property');
  };

  const postPropertyField = () => {
    if ('post-property' === filterType) {
      const data = additionalData['post_properties'];
      let options = [];

      for (const [value, {
        label
      }] of Object.entries(data)) {
        options.push({
          label,
          value
        });
      }

      return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_Field_Listbox__WEBPACK_IMPORTED_MODULE_4__["default"], {
        label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Post Property', 'wc-ajax-product-filter'),
        description: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Select the post property that values will be available as filter options.', 'wc-ajax-product-filter'),
        id: 'post_property',
        options: options,
        value: post_property,
        onChange: handlePostPropertyChange,
        searchable: false
      });
    }
  };

  const handleFilterKeyChange = filterKey => {
    setActiveFilterData('field_key', filterKey);
    const variableFilterTypes = (0,_utils__WEBPACK_IMPORTED_MODULE_10__.variableFilterTypesData)();
    const variableFilterTypeKeys = Object.keys(variableFilterTypes);

    if (variableFilterTypeKeys.includes(filterType)) {
      let _filterKeys;

      variableFilterTypeKeys.forEach(type => {
        if (filterType === type) {
          const property = variableFilterTypes[type];
          const key = activeFilterData[property];
          _filterKeys = { ...filterKeys,
            [type]: { ...filterKeys[type],
              [key]: filterKey
            }
          };
        }
      });

      if (_filterKeys) {
        dispatch({
          type: 'SET_FILTER_KEYS',
          payload: _filterKeys
        });
      }
    }
  };

  const filterKeyField = () => {
    if ('active-filters' !== filterType && 'reset-button' !== filterType) {
      return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_Field_Text__WEBPACK_IMPORTED_MODULE_5__["default"], {
        id: 'filter_key',
        label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Filter Key', 'wc-ajax-product-filter'),
        description: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('The unique key that will be used in the URL. Only a-z, 0-9, "_" and "-" symbols are supported.', 'wc-ajax-product-filter'),
        value: field_key,
        onChange: handleFilterKeyChange,
        isFilterKey: true
      });
    }
  };

  const valueTypeField = () => {
    if ('post-meta' === filterType) {
      return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_Field_ToggleGroup__WEBPACK_IMPORTED_MODULE_6__["default"], {
        id: 'value_type',
        label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Value Type', 'wc-ajax-product-filter'),
        description: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Determines the meta value type.', 'wc-ajax-product-filter'),
        options: [{
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Text', 'wc-ajax-product-filter'),
          value: 'text'
        }, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Number', 'wc-ajax-product-filter'),
          value: 'number'
        }, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Date', 'wc-ajax-product-filter'),
          value: 'date'
        }],
        onChange: handleToggleGroupChange,
        value: value_type
      });
    }
  };

  const valueIsDecimalField = () => {
    if ('post-meta' === filterType && 'number' === value_type) {
      return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_Field_Checkbox__WEBPACK_IMPORTED_MODULE_7__["default"], {
        id: 'value_decimal',
        label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Value is decimal', 'wc-ajax-product-filter'),
        description: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Whether the meta values have decimal places.', 'wc-ajax-product-filter'),
        isChecked: value_decimal,
        onChange: handleCheckboxChange
      });
    }
  };

  const decimalPlacesField = () => {
    if ('post-meta' === filterType && 'number' === value_type && '1' === value_decimal) {
      return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_Field_Number__WEBPACK_IMPORTED_MODULE_9__["default"], {
        id: 'value_decimal_places',
        label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Decimal Places', 'wc-ajax-product-filter'),
        description: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Determines the number of decimal places in meta values.', 'wc-ajax-product-filter'),
        value: value_decimal_places,
        onChange: handleTextFieldChange
      });
    }
  };

  let output = '';

  if (filterType) {
    output = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, taxonomyField(), postMetaField(), postPropertyField(), filterKeyField(), valueTypeField(), valueIsDecimalField(), decimalPlacesField());
  }

  return output;
};

/* harmony default export */ __webpack_exports__["default"] = (GeneralFields);

/***/ }),

/***/ "./src/components/Filter/useFilterData.js":
/*!************************************************!*\
  !*** ./src/components/Filter/useFilterData.js ***!
  \************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
const useFilterData = (state, dispatch) => {
  const {
    activeFilterData,
    isDirty
  } = state;

  const setDirty = () => {
    if (!isDirty) {
      dispatch({
        type: 'SET_DIRTY',
        payload: true
      });
      dispatch({
        type: 'SET_LOAD_PREVIEW',
        payload: true
      });
    }
  };

  const handleRadioChange = (e, key) => {
    const value = e.target.value;
    setActiveFilterData(key, value);
  };

  const handleCheckboxChange = (value, key) => {
    const _value = value ? '1' : '';

    setActiveFilterData(key, _value);
  };

  const handleTextFieldChange = (value, key) => {
    setActiveFilterData(key, value);
  };

  const handleToggleGroupChange = (value, key) => {
    setActiveFilterData(key, value);
  };

  const handleSelectChange = (selectedItem, key) => {
    setActiveFilterData(key, selectedItem.value);
  };

  const handleSelectTermChange = (selected, key) => {
    setActiveFilterData(key, selected);
  };

  const setActiveFilterData = function (key, value) {
    let makeDirty = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
    const prevValue = activeFilterData[key];

    if (value === prevValue) {
      return;
    }

    dispatch({
      type: 'SET_ACTIVE_FILTER_DATA',
      payload: { ...activeFilterData,
        [key]: value
      }
    });

    if (makeDirty) {
      setDirty();
    }
  };

  const setActiveFilterMultiData = data => {
    dispatch({
      type: 'SET_ACTIVE_FILTER_DATA',
      payload: { ...activeFilterData,
        ...data
      }
    });
    setDirty();
  };

  return {
    setDirty,
    handleRadioChange,
    handleCheckboxChange,
    handleTextFieldChange,
    handleToggleGroupChange,
    handleSelectChange,
    handleSelectTermChange,
    setActiveFilterData,
    setActiveFilterMultiData
  };
};

/* harmony default export */ __webpack_exports__["default"] = (useFilterData);

/***/ }),

/***/ "./src/components/Filter/utils.js":
/*!****************************************!*\
  !*** ./src/components/Filter/utils.js ***!
  \****************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "accordionStates": function() { return /* binding */ accordionStates; },
/* harmony export */   "authorLimitByOptions": function() { return /* binding */ authorLimitByOptions; },
/* harmony export */   "authorOrderByOptions": function() { return /* binding */ authorOrderByOptions; },
/* harmony export */   "availableFilters": function() { return /* binding */ availableFilters; },
/* harmony export */   "dateDisplayTypes": function() { return /* binding */ dateDisplayTypes; },
/* harmony export */   "filterDefaultData": function() { return /* binding */ filterDefaultData; },
/* harmony export */   "getCustomAppearanceModalData": function() { return /* binding */ getCustomAppearanceModalData; },
/* harmony export */   "getFilterDefaultData": function() { return /* binding */ getFilterDefaultData; },
/* harmony export */   "getMetaOptions": function() { return /* binding */ getMetaOptions; },
/* harmony export */   "getTableData": function() { return /* binding */ getTableData; },
/* harmony export */   "getTaxonomy": function() { return /* binding */ getTaxonomy; },
/* harmony export */   "initialFilterKeysData": function() { return /* binding */ initialFilterKeysData; },
/* harmony export */   "isTaxonomyFilters": function() { return /* binding */ isTaxonomyFilters; },
/* harmony export */   "isTaxonomyHierarchical": function() { return /* binding */ isTaxonomyHierarchical; },
/* harmony export */   "methodsOfGettingOptions": function() { return /* binding */ methodsOfGettingOptions; },
/* harmony export */   "numberDisplayTypes": function() { return /* binding */ numberDisplayTypes; },
/* harmony export */   "orderByOptions": function() { return /* binding */ orderByOptions; },
/* harmony export */   "orderDirectionOptions": function() { return /* binding */ orderDirectionOptions; },
/* harmony export */   "orderTypeOptions": function() { return /* binding */ orderTypeOptions; },
/* harmony export */   "productStatusOptions": function() { return /* binding */ productStatusOptions; },
/* harmony export */   "taxonomyLimitByOptions": function() { return /* binding */ taxonomyLimitByOptions; },
/* harmony export */   "termsOrderByOptions": function() { return /* binding */ termsOrderByOptions; },
/* harmony export */   "textDisplayTypes": function() { return /* binding */ textDisplayTypes; },
/* harmony export */   "variableFilterTypesData": function() { return /* binding */ variableFilterTypesData; }
/* harmony export */ });
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils */ "./src/components/utils.js");


function availableFilters() {
  return [{
    title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Category', 'wc-ajax-product-filter'),
    type: 'category'
  }, {
    title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Tag', 'wc-ajax-product-filter'),
    type: 'tag'
  }, {
    title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Attribute', 'wc-ajax-product-filter'),
    type: 'attribute'
  }, {
    title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Price', 'wc-ajax-product-filter'),
    type: 'price'
  }, {
    title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Rating', 'wc-ajax-product-filter'),
    type: 'rating'
  }, {
    title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Product Status', 'wc-ajax-product-filter'),
    type: 'product-status'
  }, {
    title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Post Property', 'wc-ajax-product-filter'),
    type: 'post-property'
  }, {
    title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Post Meta', 'wc-ajax-product-filter'),
    type: 'post-meta'
  }, {
    title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Search', 'wc-ajax-product-filter'),
    type: 'search',
    isPro: true
  }, {
    title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Custom Taxonomy', 'wc-ajax-product-filter'),
    type: 'custom-taxonomy',
    isPro: true
  }, {
    title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Sort by', 'wc-ajax-product-filter'),
    type: 'sort-by',
    isPro: true
  }, {
    title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Per page', 'wc-ajax-product-filter'),
    type: 'per-page',
    isPro: true
  }, {
    title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Active Filters', 'wc-ajax-product-filter'),
    type: 'active-filters'
  }, {
    title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Reset Button', 'wc-ajax-product-filter'),
    type: 'reset-button'
  }];
}
function filterDefaultData() {
  return {
    // Taxonomy
    show_title: '1',
    field_key: '',
    taxonomy: '',
    display_type: 'checkbox',
    query_type: 'and',
    all_items_label: '',
    use_chosen: '',
    chosen_no_results_message: '',
    enable_multiple_filter: '',
    hierarchical: '',
    enable_hierarchy_accordion: '',
    show_count: '',
    hide_empty: '',
    enable_tooltip: '',
    show_count_in_tooltip: '',
    tooltip_position: 'top',
    custom_appearance_options: [],
    use_term_slug_in_url: '',
    limit_options: 'off',
    parent_term: '',
    limit_values_by_id: '',
    limit_values_include_children: '',
    exclude_values_id: '',
    exclude_values_include_children: '',
    order_terms_by: 'default',
    order_terms_dir: 'asc',
    enable_accordion: '',
    accordion_default_state: 'expanded',
    show_clear_button: '',
    enable_soft_limit: '',
    soft_limit: '5',
    type: '',
    field_id: '',
    get_options: 'automatically',
    use_category_images: '',
    // Active Filters
    active_filters_layout: 'simple',
    enable_clear_all_button: '1',
    clear_all_button_label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Clear All', 'wc-ajax-product-filter'),
    show_if_empty: '',
    empty_filter_message: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('No filter is applied.', 'wc-ajax-product-filter'),
    move_clear_all_button_in_title: '',
    enable_soft_limit_for_extended_layout: '',
    soft_limit_for_extended_layout: '5',
    // Price Filter
    number_display_type: 'range_slider',
    number_range_slider_display_values_as: 'plain_text',
    align_values_at_the_end: '1',
    number_range_enable_multiple_filter: '',
    number_range_query_type: 'and',
    number_range_select_all_items_label: '',
    number_range_use_chosen: '',
    number_range_chosen_no_results_message: '',
    number_range_show_count: '',
    number_range_hide_empty: '',
    number_get_options: 'automatically',
    manual_options: [],
    number_manual_options: [],
    time_period_options: [],
    min_value: '0',
    min_value_auto_detect: '',
    max_value: '100',
    max_value_auto_detect: '',
    step: '10',
    value_prefix: '',
    value_postfix: '',
    values_separator: '-',
    decimal_places: '0',
    thousand_separator: '',
    decimal_separator: '.',
    // Product Status
    product_status_options: [],
    // Post Meta
    meta_key: '',
    value_type: 'text',
    value_decimal: '',
    value_decimal_places: '2',
    options_order_by: 'none',
    options_order_dir: 'asc',
    options_order_type: 'alphabetical',
    // Post Meta - value type Date
    date_display_type: 'input_date',
    date_format: 'dd-mm-yy',
    time_period_enable_multiple_filter: '',
    time_period_query_type: 'and',
    time_period_select_all_items_label: '',
    time_period_use_chosen: '',
    time_period_chosen_no_results_message: '',
    show_date_inputs_inline: '',
    time_period_show_count: '',
    time_period_hide_empty: '',
    date_picker_month_dropdown: '',
    date_picker_year_dropdown: '',
    date_from_prefix: '',
    date_from_postfix: '',
    date_from_placeholder: '',
    date_to_prefix: '',
    date_to_postfix: '',
    date_to_placeholder: '',
    // Post Property
    post_property: '',
    post_author_order_by: 'default',
    post_author_order_dir: 'asc',
    include_user_roles: '',
    // Sort by
    sort_by_options: [],
    // Per page
    per_page_options: [],
    // Reset Button
    reset_button_label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Reset', 'wc-ajax-product-filter')
  };
}

function perPageFilterDefaultData() {
  return {
    display_type: 'select'
  };
}

function sortByFilterDefaultData() {
  return {
    display_type: 'select'
  };
}

function getFilterDefaultData(type, filterKeys) {
  const defaultData = filterDefaultData(); // Set filter type.

  defaultData.type = type;
  const variableFilterTypes = Object.keys(variableFilterTypesData()); // Set the filter key for non variable filter types.

  if (!variableFilterTypes.includes(type)) {
    var _filterKeys$type;

    defaultData.field_key = (_filterKeys$type = filterKeys[type]) !== null && _filterKeys$type !== void 0 ? _filterKeys$type : '';
  } // Per-Page filter default options.


  if ('per-page' === type) {
    for (const [key, value] of Object.entries(perPageFilterDefaultData())) {
      defaultData[key] = value;
    }
  } // Sort By filter default options.


  if ('sort-by' === type) {
    for (const [key, value] of Object.entries(sortByFilterDefaultData())) {
      defaultData[key] = value;
    }
  }

  return defaultData;
}
function variableFilterTypesData() {
  return {
    attribute: 'taxonomy',
    'custom-taxonomy': 'taxonomy',
    'post-meta': 'meta_key',
    'post-property': 'post_property'
  };
}
function initialFilterKeysData(activeFilterData) {
  var _activeFilterData$typ, _activeFilterData$fie;

  const filterType = (_activeFilterData$typ = activeFilterData['type']) !== null && _activeFilterData$typ !== void 0 ? _activeFilterData$typ : '';
  const filterKey = (_activeFilterData$fie = activeFilterData['field_key']) !== null && _activeFilterData$fie !== void 0 ? _activeFilterData$fie : '';
  const filterKeys = {};

  if (!filterType || !filterKey) {
    return filterKeys;
  }

  if ('active-filters' === filterType || 'reset-button' === filterType) {
    return filterKeys;
  }

  const variableFilterTypes = variableFilterTypesData();
  const variableFilterTypeKeys = Object.keys(variableFilterTypes);

  if (variableFilterTypeKeys.includes(filterType)) {
    variableFilterTypeKeys.forEach(type => {
      if (filterType === type) {
        const property = variableFilterTypes[type];
        const data = {
          [activeFilterData[property]]: filterKey
        };
        filterKeys[type] = data;
      }
    });
  }

  return filterKeys;
}
function methodsOfGettingOptions() {
  return [{
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Automatically', 'wc-ajax-product-filter'),
    value: 'automatically'
  }, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Manual Entry', 'wc-ajax-product-filter'),
    value: 'manual_entry',
    isPro: true
  }];
}
function taxonomyLimitByOptions() {
  return [{
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Off', 'wc-ajax-product-filter'),
    value: 'off'
  }, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Include', 'wc-ajax-product-filter'),
    value: 'include'
  }, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Exclude', 'wc-ajax-product-filter'),
    value: 'exclude'
  }, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Child of', 'wc-ajax-product-filter'),
    value: 'child'
  }, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Parent Only', 'wc-ajax-product-filter'),
    value: 'parent_only'
  }];
}
function termsOrderByOptions() {
  return [{
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Default', 'wc-ajax-product-filter'),
    value: 'default'
  }, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('ID', 'wc-ajax-product-filter'),
    value: 'id'
  }, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Name', 'wc-ajax-product-filter'),
    value: 'name'
  }, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Slug', 'wc-ajax-product-filter'),
    value: 'slug'
  }, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Count', 'wc-ajax-product-filter'),
    value: 'count'
  }, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Entry', 'wc-ajax-product-filter'),
    value: 'entry'
  }];
}
function orderByOptions() {
  return [{
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Default', 'wc-ajax-product-filter'),
    value: 'none'
  }, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Label', 'wc-ajax-product-filter'),
    value: 'label'
  }, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Value', 'wc-ajax-product-filter'),
    value: 'value'
  }, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Count', 'wc-ajax-product-filter'),
    value: 'count'
  }];
}
function orderDirectionOptions() {
  return [{
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('ASC', 'wc-ajax-product-filter'),
    value: 'asc'
  }, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('DESC', 'wc-ajax-product-filter'),
    value: 'desc'
  }];
}
function orderTypeOptions() {
  return [{
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Alphabetical', 'wc-ajax-product-filter'),
    value: 'alphabetical'
  }, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Numerical', 'wc-ajax-product-filter'),
    value: 'numerical'
  }];
}
function authorOrderByOptions() {
  return [{
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Default', 'wc-ajax-product-filter'),
    value: 'default'
  }, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('ID', 'wc-ajax-product-filter'),
    value: 'id'
  }, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Name', 'wc-ajax-product-filter'),
    value: 'name'
  }, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Count', 'wc-ajax-product-filter'),
    value: 'count'
  }];
}
function authorLimitByOptions() {
  return [{
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Off', 'wc-ajax-product-filter'),
    value: 'off'
  }, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Include', 'wc-ajax-product-filter'),
    value: 'include'
  }, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Exclude', 'wc-ajax-product-filter'),
    value: 'exclude'
  }, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Role', 'wc-ajax-product-filter'),
    value: 'user_roles'
  }];
}
function productStatusOptions() {
  return [{
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Featured', 'wc-ajax-product-filter'),
    value: 'featured'
  }, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('On Sale', 'wc-ajax-product-filter'),
    value: 'on_sale'
  }];
}
function textDisplayTypes() {
  let withPro = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
  const options = [{
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Checkbox', 'wc-ajax-product-filter'),
    value: 'checkbox'
  }, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Radio', 'wc-ajax-product-filter'),
    value: 'radio'
  }, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Select', 'wc-ajax-product-filter'),
    value: 'select'
  }, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Multi select', 'wc-ajax-product-filter'),
    value: 'multi-select'
  }, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Label', 'wc-ajax-product-filter'),
    value: 'label'
  }, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Color', 'wc-ajax-product-filter'),
    value: 'color'
  }, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Image', 'wc-ajax-product-filter'),
    value: 'image'
  }];

  if (withPro && !(0,_utils__WEBPACK_IMPORTED_MODULE_1__.foundProVersion)()) {
    const proDisplayTypes = ['color', 'image'];
    return options.map(option => {
      if (!proDisplayTypes.includes(option.value)) {
        return option;
      } else {
        option.isPro = true;
        return option;
      }
    });
  }

  return options;
}
function numberDisplayTypes() {
  let withPro = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
  const options = [{
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Range - Slider', 'wc-ajax-product-filter'),
    value: 'range_slider'
  }, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Range - Number', 'wc-ajax-product-filter'),
    value: 'range_number'
  }, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Range - Checkbox', 'wc-ajax-product-filter'),
    value: 'range_checkbox'
  }, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Range - Radio', 'wc-ajax-product-filter'),
    value: 'range_radio'
  }, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Range - Select', 'wc-ajax-product-filter'),
    value: 'range_select'
  }, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Range - Multiselect', 'wc-ajax-product-filter'),
    value: 'range_multiselect'
  }, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Range - Label', 'wc-ajax-product-filter'),
    value: 'range_label'
  }];

  if (withPro && !(0,_utils__WEBPACK_IMPORTED_MODULE_1__.foundProVersion)()) {
    const allowed = ['range_slider', 'range_number'];
    return options.map(option => {
      if (allowed.includes(option.value)) {
        return option;
      } else {
        option.isPro = true;
        return option;
      }
    });
  }

  return options;
}
function dateDisplayTypes() {
  return [{
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Input - Date', 'wc-ajax-product-filter'),
    value: 'input_date'
  }, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Input - Date Range', 'wc-ajax-product-filter'),
    value: 'input_date_range'
  }, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Time Period - Checkbox', 'wc-ajax-product-filter'),
    value: 'time_period_checkbox'
  }, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Time Period - Radio', 'wc-ajax-product-filter'),
    value: 'time_period_radio'
  }, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Time Period - Select', 'wc-ajax-product-filter'),
    value: 'time_period_select'
  }, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Time Period - Multi select', 'wc-ajax-product-filter'),
    value: 'time_period_multiselect'
  }, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Time Period - Label', 'wc-ajax-product-filter'),
    value: 'time_period_label'
  }];
}
function accordionStates() {
  return [{
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Expanded', 'wc-ajax-product-filter'),
    value: 'expanded'
  }, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Collapsed', 'wc-ajax-product-filter'),
    value: 'collapsed'
  }];
}
function getMetaOptions(meta_keys) {
  const metaOptions = [];

  for (const key in meta_keys) {
    const option = {
      label: key,
      value: key
    };
    metaOptions.push(option);
  }

  return metaOptions;
}
function getTaxonomy(filterType, taxonomy) {
  let _taxonomy;

  if ('category' === filterType) {
    _taxonomy = 'product_cat';
  } else if ('tag' === filterType) {
    _taxonomy = 'product_tag';
  } else {
    _taxonomy = taxonomy;
  }

  return _taxonomy;
}
function isTaxonomyHierarchical(currentTaxonomy, hierarchicalData) {
  let hierarchical;

  if ('product_cat' === currentTaxonomy) {
    hierarchical = true;
  } else if ('product_tag' === currentTaxonomy) {
    hierarchical = false;
  } else {
    hierarchical = hierarchicalData[currentTaxonomy];
  }

  return hierarchical;
}
function isTaxonomyFilters(filterType) {
  const taxonomyFilterTypes = ['category', 'tag', 'attribute', 'custom-taxonomy'];
  return taxonomyFilterTypes.includes(filterType);
}
function getTableData(filterType, activeFilterData) {
  let type;
  let optionsKey;
  const {
    value_type
  } = activeFilterData;

  if ('price' === filterType || 'rating' === filterType) {
    type = 'number-options';
    optionsKey = 'number_manual_options';
  } else if ('product-status' === filterType) {
    type = 'product-status-options';
    optionsKey = 'product_status_options';
  } else if ('post-meta' === filterType || 'post-property' === filterType) {
    if ('text' === value_type) {
      type = 'text-options';
      optionsKey = 'manual_options';
    } else if ('number' === value_type) {
      type = 'number-options';
      optionsKey = 'number_manual_options';
    } else if ('date' === value_type) {
      type = 'time-period-options';
      optionsKey = 'time_period_options';
    }
  } else if ('sort-by' === filterType) {
    type = 'sort-by-options';
    optionsKey = 'sort_by_options';
  } else if ('per-page' === filterType) {
    type = 'per-page-options';
    optionsKey = 'per_page_options';
  } else if (isTaxonomyFilters(filterType)) {
    type = 'taxonomy-options';
    optionsKey = 'manual_options';
  }

  return {
    type,
    optionsKey
  };
}
function getCustomAppearanceModalData(filterType, activeFilterData) {
  let taxonomy = '';
  let type = '';

  if (isTaxonomyFilters(filterType)) {
    const {
      display_type: _type,
      taxonomy: _taxonomy,
      use_category_images
    } = activeFilterData;

    if ('color' === _type || 'image' === _type && !use_category_images) {
      taxonomy = getTaxonomy(filterType, _taxonomy);
      type = _type;
    }
  }

  return {
    type,
    taxonomy
  };
}

/***/ }),

/***/ "./src/components/Filter/wp-fe-sanitize-title.js":
/*!*******************************************************!*\
  !*** ./src/components/Filter/wp-fe-sanitize-title.js ***!
  \*******************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "wpFeSanitizeTitle": function() { return /* binding */ wpFeSanitizeTitle; }
/* harmony export */ });
/**
 * Original Source: https://salferrarello.com/wordpress-sanitize-title-javascript/
 *
 * Version: 1.1.1
 *
 * JavaScript function to mimic the WordPress PHP function sanitize_title()
 * See https://codex.wordpress.org/Function_Reference/sanitize_title
 *
 * Note: the WordPress PHP function sanitize_title() accepts two additional
 * optional parameters. At this time, this function does not.
 *
 * @param string title The title to be santized.
 * @return string The sanitized string.
 */
function wpFeSanitizeTitle(title) {
  var diacriticsMap;
  return removeSingleLeadingDash(removeSingleTrailingDash(replaceSpacesWithDash(removeHTMLEntities(removeAccents( // Strip any HTML tags.
  title.replace(/<[^>]+>/gi, '')).toLowerCase() // Replace &nbsp;, &ndash;, and &mdash with a dash (-).
  .replace(/&(?:(?:nbsp)|(?:ndash)|(?:mdash));/g, '-')) // Replace any forward slashes (/) or periods (.) with a dash (-).
  .replace(/[\/\.]/g, '-') // Replace anything that is not a:
  // word character
  // space
  // nor a dash (-)
  // with an empty string (i.e. remove it).
  .replace(/[^\w\s-]+/g, ''))));
  /**
   * Replace all HTML Entities.
   *
   * The string to remove (replace with '')
   * - start with an ampersand &
   * - has 0 or more characters (non-greedy) .*?
   * - ends in a semi-color ;
   *
   * @param str String that may contain HTML entities.
   * @return String with HTML entities removed.
   */

  function removeHTMLEntities(str) {
    return str.replace(/&.*?;/g, '');
  }
  /**
   * Replace one or more blank spaces (or repeated dashes) with a single dash.
   *
   * @param str String that may contain spaces or multiple dashes.
   * @return String with spaces replaced by dashes and no more than one dash in a row.
   */


  function replaceSpacesWithDash(str) {
    return str // Replace one or more blank spaces with a single dash (-)
    .replace(/ +/g, '-') // Replace two or more dashes (-) with a single dash (-).
    .replace(/-{2,}/g, '-');
  }
  /**
   * If the string end in a dash, remove it.
   *
   * @param string str The string which may or may not end in a dash.
   * @return string The string without a dash on the end.
   */


  function removeSingleTrailingDash(str) {
    if ('-' === str.substr(str.length - 1)) {
      return str.substr(0, str.length - 1);
    }

    return str;
  }
  /**
   * If the string starts with a dash, remove it.
   *
   * @param string str The string which may or may not start in a dash.
   * @return string The string without a dash on the start.
   */


  function removeSingleLeadingDash(str) {
    if ('-' === str.substr(0, 1)) {
      return str.substr(1, str.length - 1);
    }

    return str;
  }
  /* Remove accents/diacritics in a string in JavaScript
   * from https://stackoverflow.com/a/18391901
   */

  /*
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */


  function getDiacriticsRemovalMap() {
    if (diacriticsMap) {
      return diacriticsMap;
    }

    var defaultDiacriticsRemovalMap = [{
      base: '-',
      letters: '\u2013\u2014\u00A0'
    }, {
      base: 'A',
      letters: '\u0041\u24B6\uFF21\u00C0\u00C1\u00C2\u1EA6\u1EA4\u1EAA\u1EA8\u00C3\u0100\u0102\u1EB0\u1EAE\u1EB4\u1EB2\u0226\u01E0\u00C4\u01DE\u1EA2\u00C5\u01FA\u01CD\u0200\u0202\u1EA0\u1EAC\u1EB6\u1E00\u0104\u023A\u2C6F'
    }, {
      base: 'AA',
      letters: '\uA732'
    }, {
      base: 'AE',
      letters: '\u00C6\u01FC\u01E2'
    }, {
      base: 'AO',
      letters: '\uA734'
    }, {
      base: 'AU',
      letters: '\uA736'
    }, {
      base: 'AV',
      letters: '\uA738\uA73A'
    }, {
      base: 'AY',
      letters: '\uA73C'
    }, {
      base: 'B',
      letters: '\u0042\u24B7\uFF22\u1E02\u1E04\u1E06\u0243\u0182\u0181'
    }, {
      base: 'C',
      letters: '\u0043\u24B8\uFF23\u0106\u0108\u010A\u010C\u00C7\u1E08\u0187\u023B\uA73E'
    }, {
      base: 'D',
      letters: '\u0044\u24B9\uFF24\u1E0A\u010E\u1E0C\u1E10\u1E12\u1E0E\u0110\u018B\u018A\u0189\uA779\u00D0'
    }, {
      base: 'DZ',
      letters: '\u01F1\u01C4'
    }, {
      base: 'Dz',
      letters: '\u01F2\u01C5'
    }, {
      base: 'E',
      letters: '\u0045\u24BA\uFF25\u00C8\u00C9\u00CA\u1EC0\u1EBE\u1EC4\u1EC2\u1EBC\u0112\u1E14\u1E16\u0114\u0116\u00CB\u1EBA\u011A\u0204\u0206\u1EB8\u1EC6\u0228\u1E1C\u0118\u1E18\u1E1A\u0190\u018E'
    }, {
      base: 'F',
      letters: '\u0046\u24BB\uFF26\u1E1E\u0191\uA77B'
    }, {
      base: 'G',
      letters: '\u0047\u24BC\uFF27\u01F4\u011C\u1E20\u011E\u0120\u01E6\u0122\u01E4\u0193\uA7A0\uA77D\uA77E'
    }, {
      base: 'H',
      letters: '\u0048\u24BD\uFF28\u0124\u1E22\u1E26\u021E\u1E24\u1E28\u1E2A\u0126\u2C67\u2C75\uA78D'
    }, {
      base: 'I',
      letters: '\u0049\u24BE\uFF29\u00CC\u00CD\u00CE\u0128\u012A\u012C\u0130\u00CF\u1E2E\u1EC8\u01CF\u0208\u020A\u1ECA\u012E\u1E2C\u0197'
    }, {
      base: 'J',
      letters: '\u004A\u24BF\uFF2A\u0134\u0248'
    }, {
      base: 'K',
      letters: '\u004B\u24C0\uFF2B\u1E30\u01E8\u1E32\u0136\u1E34\u0198\u2C69\uA740\uA742\uA744\uA7A2'
    }, {
      base: 'L',
      letters: '\u004C\u24C1\uFF2C\u013F\u0139\u013D\u1E36\u1E38\u013B\u1E3C\u1E3A\u0141\u023D\u2C62\u2C60\uA748\uA746\uA780'
    }, {
      base: 'LJ',
      letters: '\u01C7'
    }, {
      base: 'Lj',
      letters: '\u01C8'
    }, {
      base: 'M',
      letters: '\u004D\u24C2\uFF2D\u1E3E\u1E40\u1E42\u2C6E\u019C'
    }, {
      base: 'N',
      letters: '\u004E\u24C3\uFF2E\u01F8\u0143\u00D1\u1E44\u0147\u1E46\u0145\u1E4A\u1E48\u0220\u019D\uA790\uA7A4'
    }, {
      base: 'NJ',
      letters: '\u01CA'
    }, {
      base: 'Nj',
      letters: '\u01CB'
    }, {
      base: 'O',
      letters: '\u004F\u24C4\uFF2F\u00D2\u00D3\u00D4\u1ED2\u1ED0\u1ED6\u1ED4\u00D5\u1E4C\u022C\u1E4E\u014C\u1E50\u1E52\u014E\u022E\u0230\u00D6\u022A\u1ECE\u0150\u01D1\u020C\u020E\u01A0\u1EDC\u1EDA\u1EE0\u1EDE\u1EE2\u1ECC\u1ED8\u01EA\u01EC\u00D8\u01FE\u0186\u019F\uA74A\uA74C'
    }, {
      base: 'OI',
      letters: '\u01A2'
    }, {
      base: 'OO',
      letters: '\uA74E'
    }, {
      base: 'OU',
      letters: '\u0222'
    }, {
      base: 'OE',
      letters: '\u008C\u0152'
    }, {
      base: 'oe',
      letters: '\u009C\u0153'
    }, {
      base: 'P',
      letters: '\u0050\u24C5\uFF30\u1E54\u1E56\u01A4\u2C63\uA750\uA752\uA754'
    }, {
      base: 'Q',
      letters: '\u0051\u24C6\uFF31\uA756\uA758\u024A'
    }, {
      base: 'R',
      letters: '\u0052\u24C7\uFF32\u0154\u1E58\u0158\u0210\u0212\u1E5A\u1E5C\u0156\u1E5E\u024C\u2C64\uA75A\uA7A6\uA782'
    }, {
      base: 'S',
      letters: '\u0053\u24C8\uFF33\u1E9E\u015A\u1E64\u015C\u1E60\u0160\u1E66\u1E62\u1E68\u0218\u015E\u2C7E\uA7A8\uA784'
    }, {
      base: 'T',
      letters: '\u0054\u24C9\uFF34\u1E6A\u0164\u1E6C\u021A\u0162\u1E70\u1E6E\u0166\u01AC\u01AE\u023E\uA786'
    }, {
      base: 'TZ',
      letters: '\uA728'
    }, {
      base: 'U',
      letters: '\u0055\u24CA\uFF35\u00D9\u00DA\u00DB\u0168\u1E78\u016A\u1E7A\u016C\u00DC\u01DB\u01D7\u01D5\u01D9\u1EE6\u016E\u0170\u01D3\u0214\u0216\u01AF\u1EEA\u1EE8\u1EEE\u1EEC\u1EF0\u1EE4\u1E72\u0172\u1E76\u1E74\u0244'
    }, {
      base: 'V',
      letters: '\u0056\u24CB\uFF36\u1E7C\u1E7E\u01B2\uA75E\u0245'
    }, {
      base: 'VY',
      letters: '\uA760'
    }, {
      base: 'W',
      letters: '\u0057\u24CC\uFF37\u1E80\u1E82\u0174\u1E86\u1E84\u1E88\u2C72'
    }, {
      base: 'X',
      letters: '\u0058\u24CD\uFF38\u1E8A\u1E8C'
    }, {
      base: 'Y',
      letters: '\u0059\u24CE\uFF39\u1EF2\u00DD\u0176\u1EF8\u0232\u1E8E\u0178\u1EF6\u1EF4\u01B3\u024E\u1EFE'
    }, {
      base: 'Z',
      letters: '\u005A\u24CF\uFF3A\u0179\u1E90\u017B\u017D\u1E92\u1E94\u01B5\u0224\u2C7F\u2C6B\uA762'
    }, {
      base: 'a',
      letters: '\u0061\u24D0\uFF41\u1E9A\u00E0\u00E1\u00E2\u1EA7\u1EA5\u1EAB\u1EA9\u00E3\u0101\u0103\u1EB1\u1EAF\u1EB5\u1EB3\u0227\u01E1\u00E4\u01DF\u1EA3\u00E5\u01FB\u01CE\u0201\u0203\u1EA1\u1EAD\u1EB7\u1E01\u0105\u2C65\u0250'
    }, {
      base: 'aa',
      letters: '\uA733'
    }, {
      base: 'ae',
      letters: '\u00E6\u01FD\u01E3'
    }, {
      base: 'ao',
      letters: '\uA735'
    }, {
      base: 'au',
      letters: '\uA737'
    }, {
      base: 'av',
      letters: '\uA739\uA73B'
    }, {
      base: 'ay',
      letters: '\uA73D'
    }, {
      base: 'b',
      letters: '\u0062\u24D1\uFF42\u1E03\u1E05\u1E07\u0180\u0183\u0253'
    }, {
      base: 'c',
      letters: '\u0063\u24D2\uFF43\u0107\u0109\u010B\u010D\u00E7\u1E09\u0188\u023C\uA73F\u2184'
    }, {
      base: 'd',
      letters: '\u0064\u24D3\uFF44\u1E0B\u010F\u1E0D\u1E11\u1E13\u1E0F\u0111\u018C\u0256\u0257\uA77A'
    }, {
      base: 'dz',
      letters: '\u01F3\u01C6'
    }, {
      base: 'e',
      letters: '\u0065\u24D4\uFF45\u00E8\u00E9\u00EA\u1EC1\u1EBF\u1EC5\u1EC3\u1EBD\u0113\u1E15\u1E17\u0115\u0117\u00EB\u1EBB\u011B\u0205\u0207\u1EB9\u1EC7\u0229\u1E1D\u0119\u1E19\u1E1B\u0247\u025B\u01DD'
    }, {
      base: 'f',
      letters: '\u0066\u24D5\uFF46\u1E1F\u0192\uA77C'
    }, {
      base: 'g',
      letters: '\u0067\u24D6\uFF47\u01F5\u011D\u1E21\u011F\u0121\u01E7\u0123\u01E5\u0260\uA7A1\u1D79\uA77F'
    }, {
      base: 'h',
      letters: '\u0068\u24D7\uFF48\u0125\u1E23\u1E27\u021F\u1E25\u1E29\u1E2B\u1E96\u0127\u2C68\u2C76\u0265'
    }, {
      base: 'hv',
      letters: '\u0195'
    }, {
      base: 'i',
      letters: '\u0069\u24D8\uFF49\u00EC\u00ED\u00EE\u0129\u012B\u012D\u00EF\u1E2F\u1EC9\u01D0\u0209\u020B\u1ECB\u012F\u1E2D\u0268\u0131'
    }, {
      base: 'j',
      letters: '\u006A\u24D9\uFF4A\u0135\u01F0\u0249'
    }, {
      base: 'k',
      letters: '\u006B\u24DA\uFF4B\u1E31\u01E9\u1E33\u0137\u1E35\u0199\u2C6A\uA741\uA743\uA745\uA7A3'
    }, {
      base: 'l',
      letters: '\u006C\u24DB\uFF4C\u0140\u013A\u013E\u1E37\u1E39\u013C\u1E3D\u1E3B\u017F\u0142\u019A\u026B\u2C61\uA749\uA781\uA747'
    }, {
      base: 'lj',
      letters: '\u01C9'
    }, {
      base: 'm',
      letters: '\u006D\u24DC\uFF4D\u1E3F\u1E41\u1E43\u0271\u026F'
    }, {
      base: 'n',
      letters: '\u006E\u24DD\uFF4E\u01F9\u0144\u00F1\u1E45\u0148\u1E47\u0146\u1E4B\u1E49\u019E\u0272\u0149\uA791\uA7A5'
    }, {
      base: 'nj',
      letters: '\u01CC'
    }, {
      base: 'o',
      letters: '\u006F\u24DE\uFF4F\u00F2\u00F3\u00F4\u1ED3\u1ED1\u1ED7\u1ED5\u00F5\u1E4D\u022D\u1E4F\u014D\u1E51\u1E53\u014F\u022F\u0231\u00F6\u022B\u1ECF\u0151\u01D2\u020D\u020F\u01A1\u1EDD\u1EDB\u1EE1\u1EDF\u1EE3\u1ECD\u1ED9\u01EB\u01ED\u00F8\u01FF\u0254\uA74B\uA74D\u0275'
    }, {
      base: 'oi',
      letters: '\u01A3'
    }, {
      base: 'ou',
      letters: '\u0223'
    }, {
      base: 'oo',
      letters: '\uA74F'
    }, {
      base: 'p',
      letters: '\u0070\u24DF\uFF50\u1E55\u1E57\u01A5\u1D7D\uA751\uA753\uA755'
    }, {
      base: 'q',
      letters: '\u0071\u24E0\uFF51\u024B\uA757\uA759'
    }, {
      base: 'r',
      letters: '\u0072\u24E1\uFF52\u0155\u1E59\u0159\u0211\u0213\u1E5B\u1E5D\u0157\u1E5F\u024D\u027D\uA75B\uA7A7\uA783'
    }, {
      base: 's',
      letters: '\u0073\u24E2\uFF53\u00DF\u015B\u1E65\u015D\u1E61\u0161\u1E67\u1E63\u1E69\u0219\u015F\u023F\uA7A9\uA785\u1E9B'
    }, {
      base: 't',
      letters: '\u0074\u24E3\uFF54\u1E6B\u1E97\u0165\u1E6D\u021B\u0163\u1E71\u1E6F\u0167\u01AD\u0288\u2C66\uA787'
    }, {
      base: 'tz',
      letters: '\uA729'
    }, {
      base: 'u',
      letters: '\u0075\u24E4\uFF55\u00F9\u00FA\u00FB\u0169\u1E79\u016B\u1E7B\u016D\u00FC\u01DC\u01D8\u01D6\u01DA\u1EE7\u016F\u0171\u01D4\u0215\u0217\u01B0\u1EEB\u1EE9\u1EEF\u1EED\u1EF1\u1EE5\u1E73\u0173\u1E77\u1E75\u0289'
    }, {
      base: 'v',
      letters: '\u0076\u24E5\uFF56\u1E7D\u1E7F\u028B\uA75F\u028C'
    }, {
      base: 'vy',
      letters: '\uA761'
    }, {
      base: 'w',
      letters: '\u0077\u24E6\uFF57\u1E81\u1E83\u0175\u1E87\u1E85\u1E98\u1E89\u2C73'
    }, {
      base: 'x',
      letters: '\u0078\u24E7\uFF58\u1E8B\u1E8D'
    }, {
      base: 'y',
      letters: '\u0079\u24E8\uFF59\u1EF3\u00FD\u0177\u1EF9\u0233\u1E8F\u00FF\u1EF7\u1E99\u1EF5\u01B4\u024F\u1EFF'
    }, {
      base: 'z',
      letters: '\u007A\u24E9\uFF5A\u017A\u1E91\u017C\u017E\u1E93\u1E95\u01B6\u0225\u0240\u2C6C\uA763'
    }];
    diacriticsMap = {};

    for (var i = 0; i < defaultDiacriticsRemovalMap.length; i++) {
      var letters = defaultDiacriticsRemovalMap[i].letters;

      for (var j = 0; j < letters.length; j++) {
        diacriticsMap[letters[j]] = defaultDiacriticsRemovalMap[i].base;
      }
    }

    return diacriticsMap;
  } // Remove accent characters/diacritics from the string.


  function removeAccents(str) {
    diacriticsMap = getDiacriticsRemovalMap();
    return str.replace(/[^\u0000-\u007E]/g, function (a) {
      return diacriticsMap[a] || a;
    });
  }
}

/***/ }),

/***/ "./src/components/ImportSampleFilters.js":
/*!***********************************************!*\
  !*** ./src/components/ImportSampleFilters.js ***!
  \***********************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _SVGIcons__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./SVGIcons */ "./src/components/SVGIcons.js");





const ImportSampleFilters = _ref => {
  let {
    view,
    callback
  } = _ref;

  const handleImportSampleFilters = () => {
    console.log('clicked');

    if (callback) {
      callback();
    }
  };

  let description;

  if ('forms' === view) {
    description = (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('In order to create a form you need to have filters first. Do you want to import sample filters? Click on the button below.', 'wc-ajax-product-filter');
  } else if ('filters' === view) {
    description = (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Do you want to import sample filters? Click on the button below.', 'wc-ajax-product-filter');
  }

  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "__import_sample_filters"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Icon, {
    icon: 'filter'
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("h3", null, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)("You don't have any filters yet.", 'wc-ajax-product-filter')), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("p", {
    className: "__description"
  }, description), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Button, {
    variant: "primary",
    onClick: handleImportSampleFilters
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Icon, {
    icon: _SVGIcons__WEBPACK_IMPORTED_MODULE_3__.ImportIcon
  }), (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Import Sample Filters', 'wc-ajax-product-filter')));
};

/* harmony default export */ __webpack_exports__["default"] = (ImportSampleFilters);

/***/ }),

/***/ "./src/components/ListFilters/AddNewModal/Body.js":
/*!********************************************************!*\
  !*** ./src/components/ListFilters/AddNewModal/Body.js ***!
  \********************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _ListFiltersContext__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../ListFiltersContext */ "./src/components/ListFilters/ListFiltersContext.js");
/* harmony import */ var _Filter_FilterNav_FilterUI_AvailableFilters__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../Filter/FilterNav/FilterUI/AvailableFilters */ "./src/components/Filter/FilterNav/FilterUI/AvailableFilters.js");
/* harmony import */ var _Filter_FilterNav_FilterUI_GeneralFields__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../Filter/FilterNav/FilterUI/GeneralFields */ "./src/components/Filter/FilterNav/FilterUI/GeneralFields.js");
/* harmony import */ var _ProFeaturesNotice__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../ProFeaturesNotice */ "./src/components/ProFeaturesNotice.js");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./utils */ "./src/components/ListFilters/AddNewModal/utils.js");








const Body = _ref => {
  let {
    step
  } = _ref;
  const {
    state,
    dispatch
  } = (0,_ListFiltersContext__WEBPACK_IMPORTED_MODULE_2__.useListFilters)();
  const {
    title,
    filterType
  } = state;

  const handleTitleChange = e => {
    const value = e.target.value;
    dispatch({
      type: 'SET_TITLE',
      payload: value
    });
  };

  let content;

  if (1 === step) {
    content = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: "__step_inner __title_step"
    }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("input", {
      type: 'text',
      placeholder: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Enter filter title', 'wc-ajax-product-filter'),
      className: "components-text-control__input",
      value: title,
      onChange: handleTitleChange
    }));
  } else if (2 === step) {
    content = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_Filter_FilterNav_FilterUI_AvailableFilters__WEBPACK_IMPORTED_MODULE_3__["default"], {
      state: state,
      dispatch: dispatch
    });
  } else if (3 === step) {
    content = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: "__step_inner"
    }, (0,_utils__WEBPACK_IMPORTED_MODULE_6__.tryingProFilterType)(filterType) && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_ProFeaturesNotice__WEBPACK_IMPORTED_MODULE_5__["default"], {
      message: (0,_utils__WEBPACK_IMPORTED_MODULE_6__.proFilterTypeMessage)(filterType)
    }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_Filter_FilterNav_FilterUI_GeneralFields__WEBPACK_IMPORTED_MODULE_4__["default"], {
      state: state,
      dispatch: dispatch
    }));
  }

  return content;
};

/* harmony default export */ __webpack_exports__["default"] = (Body);

/***/ }),

/***/ "./src/components/ListFilters/AddNewModal/Footer.js":
/*!**********************************************************!*\
  !*** ./src/components/ListFilters/AddNewModal/Footer.js ***!
  \**********************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! classnames */ "./node_modules/classnames/index.js");
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(classnames__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _ListFiltersContext__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../ListFiltersContext */ "./src/components/ListFilters/ListFiltersContext.js");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./utils */ "./src/components/ListFilters/AddNewModal/utils.js");







const Footer = _ref => {
  let {
    step,
    setStep,
    totalSteps,
    closeModal,
    handleSubmit
  } = _ref;
  const {
    state: {
      title,
      filterType,
      activeFilterData
    }
  } = (0,_ListFiltersContext__WEBPACK_IMPORTED_MODULE_4__.useListFilters)();

  const backButton = () => {
    let content;

    if (1 === step) {
      content = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Button, {
        variant: "secondary",
        onClick: closeModal
      }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Cancel', 'wc-ajax-product-filter'));
    } else {
      content = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Button, {
        variant: "secondary",
        onClick: () => setStep(step - 1)
      }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Back', 'wc-ajax-product-filter'));
    }

    return content;
  };

  const nextButton = () => {
    let content;

    if (1 === step || 3 === totalSteps && 2 === step) {
      let disabled = false;

      if (1 === step && !title) {
        disabled = true;
      } else if (3 === totalSteps && 2 === step && !filterType) {
        disabled = true;
      }

      content = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Button, {
        variant: "primary",
        onClick: () => setStep(step + 1),
        disabled: disabled
      }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Next', 'wc-ajax-product-filter'));
    } else {
      let disabled = false;

      if (2 === step) {
        if (!filterType) {
          disabled = true;
        }
      } else if (3 === step) {
        disabled = (0,_utils__WEBPACK_IMPORTED_MODULE_5__.disableFilterSubmission)(activeFilterData);
      }

      content = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Button, {
        variant: "primary",
        onClick: handleSubmit,
        disabled: disabled
      }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Finish', 'wc-ajax-product-filter'));
    }

    return content;
  };

  const dots = () => {
    return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: "_dots"
    }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
      className: classnames__WEBPACK_IMPORTED_MODULE_3___default()({
        active: 1 === step
      })
    }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
      className: classnames__WEBPACK_IMPORTED_MODULE_3___default()({
        active: 2 === step
      })
    }), 3 === totalSteps && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
      className: classnames__WEBPACK_IMPORTED_MODULE_3___default()({
        active: 3 === step
      })
    }));
  };

  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Flex, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.FlexItem, {
    className: "__left"
  }, backButton()), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.FlexItem, {
    className: "__stepper"
  }, dots()), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.FlexItem, {
    className: "__right"
  }, nextButton()));
};

/* harmony default export */ __webpack_exports__["default"] = (Footer);

/***/ }),

/***/ "./src/components/ListFilters/AddNewModal/index.js":
/*!*********************************************************!*\
  !*** ./src/components/ListFilters/AddNewModal/index.js ***!
  \*********************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _Footer__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./Footer */ "./src/components/ListFilters/AddNewModal/Footer.js");
/* harmony import */ var _Body__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./Body */ "./src/components/ListFilters/AddNewModal/Body.js");
/* harmony import */ var _ListFiltersContext__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../ListFiltersContext */ "./src/components/ListFilters/ListFiltersContext.js");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../utils */ "./src/components/utils.js");
/* harmony import */ var _SVGIcons__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../SVGIcons */ "./src/components/SVGIcons.js");
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! axios */ "./node_modules/axios/index.js");
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_8___default = /*#__PURE__*/__webpack_require__.n(axios__WEBPACK_IMPORTED_MODULE_8__);
/* harmony import */ var _notices__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../../notices */ "./src/components/notices.js");












const AddNewModal = _ref => {
  let {
    isOpen,
    setAddNewModalOpen
  } = _ref;
  const {
    state: {
      title,
      filterType,
      activeFilterData,
      filters
    },
    dispatch
  } = (0,_ListFiltersContext__WEBPACK_IMPORTED_MODULE_5__.useListFilters)();
  const [loading, setLoading] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(true);
  const [step, setStep] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(1);
  const [totalSteps, setTotalSteps] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(3);
  const [newItemId, setNewItemId] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)('');
  const modalRef = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useRef)(null);
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    if (!isOpen) {
      return;
    }

    (0,_utils__WEBPACK_IMPORTED_MODULE_6__.getAdditionalData)().then(res => {
      const {
        data: {
          data: additionalData
        }
      } = res;
      dispatch({
        type: 'SET_ADDITIONAL_DATA',
        payload: additionalData
      });
      setLoading(false);
    }).catch(err => console.log(err));
  }, [isOpen]); // Focus the modal when step gets changed.

  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    if (!isOpen) {
      return;
    }

    if (!modalRef.current) {
      return;
    }

    if (step < 2) {
      return;
    }

    modalRef.current.children[0].focus();
  }, [step]); // Focus the modal when loading state gets changed.

  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    if (!isOpen) {
      return;
    }

    if (!modalRef.current) {
      return;
    }

    if (step < 2) {
      return;
    }

    if (loading) {
      return;
    }

    modalRef.current.children[0].focus();
  }, [loading]); // Change the total steps according to the filter type.

  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    if (!filterType) {
      return;
    }

    const filtersWithoutOptions = ['active-filters', 'reset-button'];

    if (filtersWithoutOptions.includes(filterType)) {
      if (3 === totalSteps) {
        setTotalSteps(2);
      }
    } else {
      if (2 === totalSteps) {
        setTotalSteps(3);
      }
    }
  }, [filterType]);

  const handleCloseModal = () => {
    (0,_notices__WEBPACK_IMPORTED_MODULE_9__.removeItemCreateNotice)();
    setAddNewModalOpen(false);
    setStep(1);
    setTotalSteps(3);
    setLoading(true);
    setNewItemId('');
    dispatch({
      type: 'SET_TITLE',
      payload: ''
    });
    dispatch({
      type: 'SET_FILTER_TYPE',
      payload: ''
    });
    dispatch({
      type: 'SET_ACTIVE_FILTER_DATA',
      payload: {}
    });
    dispatch({
      type: 'SET_FILTER_KEYS',
      payload: {}
    });
    dispatch({
      type: 'SET_ADDITIONAL_DATA',
      payload: {}
    });
    dispatch({
      type: 'SET_FILTERS_DATA',
      payload: {}
    });
  };

  const handleSubmit = () => {
    (0,_notices__WEBPACK_IMPORTED_MODULE_9__.removeItemCreateNotice)();
    setLoading(true);
    const formData = new FormData();
    formData.append('action', 'wcapf_save_filter');
    formData.append('filter_title', title);
    formData.append('filter_data', JSON.stringify(activeFilterData));
    formData.append('visibility_rules', JSON.stringify({}));
    axios__WEBPACK_IMPORTED_MODULE_8___default().post(wcapf_admin_params.ajaxurl, formData).then(res => {
      setLoading(false);
      const {
        data: {
          data,
          success
        }
      } = res;

      if (success) {
        const {
          short: newFilterData
        } = data;
        setNewItemId(newFilterData.id);
        const _filters = [newFilterData, ...filters];
        dispatch({
          type: 'SET_FILTERS',
          payload: _filters
        });
      } else {
        (0,_notices__WEBPACK_IMPORTED_MODULE_9__.itemCreateErrorNotice)(data);
      }
    }).catch(err => {
      setLoading(false);
      (0,_notices__WEBPACK_IMPORTED_MODULE_9__.itemCreateErrorNotice)(err.message);
    });
  };

  const modalContent = () => {
    if (loading) {
      return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
        className: "__loader"
      }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Spinner, null));
    } else if (newItemId) {
      return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
        className: "__filter_response"
      }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Icon, {
        icon: _SVGIcons__WEBPACK_IMPORTED_MODULE_7__.CheckIcon
      }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("h4", null, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Filter was created', 'wc-ajax-product-filter')), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("p", {
        className: "description"
      }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Now you can edit all the settings of this filter.', 'wc-ajax-product-filter')), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
        className: "_buttons"
      }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Button, {
        variant: "secondary",
        onClick: handleCloseModal
      }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Maybe Later', 'wc-ajax-product-filter')), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Button, {
        variant: "primary",
        href: (0,_utils__WEBPACK_IMPORTED_MODULE_6__.getEditFilterLink)(newItemId)
      }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Edit Filter', 'wc-ajax-product-filter'))));
    } else {
      return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_Body__WEBPACK_IMPORTED_MODULE_4__["default"], {
        step: step,
        setTotalSteps: setTotalSteps
      }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_Footer__WEBPACK_IMPORTED_MODULE_3__["default"], {
        step: step,
        setStep: setStep,
        totalSteps: totalSteps,
        closeModal: handleCloseModal,
        handleSubmit: handleSubmit
      }));
    }
  };

  return isOpen && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Modal, {
    className: "__add_new_modal",
    onRequestClose: handleCloseModal,
    ref: modalRef,
    __experimentalHideHeader: true
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "__add_post_modal"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("h3", {
    className: "__heading"
  }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Add Filter', 'wc-ajax-product-filter')), modalContent()));
};

/* harmony default export */ __webpack_exports__["default"] = (AddNewModal);

/***/ }),

/***/ "./src/components/ListFilters/AddNewModal/utils.js":
/*!*********************************************************!*\
  !*** ./src/components/ListFilters/AddNewModal/utils.js ***!
  \*********************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "disableFilterSubmission": function() { return /* binding */ disableFilterSubmission; },
/* harmony export */   "proFilterTypeMessage": function() { return /* binding */ proFilterTypeMessage; },
/* harmony export */   "tryingProFilterType": function() { return /* binding */ tryingProFilterType; }
/* harmony export */ });
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _Filter_utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../Filter/utils */ "./src/components/Filter/utils.js");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../utils */ "./src/components/utils.js");




function getProFilterTypes() {
  const filterTypes = [];
  (0,_Filter_utils__WEBPACK_IMPORTED_MODULE_1__.availableFilters)().forEach(data => {
    if (data.isPro) {
      filterTypes.push(data.type);
    }
  });
  return filterTypes;
}

function tryingProFilterType(filterType) {
  return getProFilterTypes().includes(filterType);
}
function proFilterTypeMessage(filterType) {
  let message;

  switch (filterType) {
    case 'post-property':
      message = (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Filter by post property is a PRO feature.', 'wc-ajax-product-filter');
      break;

    case 'custom-taxonomy':
      message = (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Filter by custom taxonomy is a PRO feature.', 'wc-ajax-product-filter');
      break;

    case 'post-meta':
      message = (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Filter by post meta is a PRO feature.', 'wc-ajax-product-filter');
      break;

    case 'sort-by':
      message = (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Sort by filter is a PRO feature.', 'wc-ajax-product-filter');
      break;

    case 'per-page':
      message = (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Per page filter is a PRO feature.', 'wc-ajax-product-filter');
      break;
  }

  return message;
}
function disableFilterSubmission(activeFilterData) {
  const {
    type
  } = activeFilterData;

  if (!(0,_utils__WEBPACK_IMPORTED_MODULE_2__.foundProVersion)() && getProFilterTypes().includes(type)) {
    return true;
  }

  if ('active-filters' === type || 'reset-button' === type) {
    return false;
  }

  const {
    field_key
  } = activeFilterData;

  if (!field_key) {
    return true;
  }

  const {
    taxonomy,
    post_property,
    meta_key
  } = activeFilterData;
  let disabled = false;

  if ('attribute' === type || 'custom-taxonomy' === type) {
    if (!taxonomy) {
      disabled = true;
    }
  } else if ('post-property' === type) {
    if (!post_property) {
      disabled = true;
    }
  } else if ('post-meta' === type) {
    if (!meta_key) {
      disabled = true;
    }
  }

  return disabled;
}

/***/ }),

/***/ "./src/components/ListFilters/ListFiltersContext.js":
/*!**********************************************************!*\
  !*** ./src/components/ListFilters/ListFiltersContext.js ***!
  \**********************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ListFiltersProvider": function() { return /* binding */ ListFiltersProvider; },
/* harmony export */   "useListFilters": function() { return /* binding */ useListFilters; }
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _listFiltersReducer__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./listFiltersReducer */ "./src/components/ListFilters/listFiltersReducer.js");



const ListFiltersContext = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createContext)(_listFiltersReducer__WEBPACK_IMPORTED_MODULE_1__.initialState);

const ListFiltersProvider = _ref => {
  let {
    children
  } = _ref;
  const [state, dispatch] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useReducer)(_listFiltersReducer__WEBPACK_IMPORTED_MODULE_1__["default"], _listFiltersReducer__WEBPACK_IMPORTED_MODULE_1__.initialState);
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(ListFiltersContext.Provider, {
    value: {
      state,
      dispatch
    }
  }, children);
};

const useListFilters = () => {
  const context = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useContext)(ListFiltersContext);

  if (context === undefined) {
    throw new Error('useListFilters must be used within a ListFiltersProvider');
  }

  return context;
};



/***/ }),

/***/ "./src/components/ListFilters/Table.js":
/*!*********************************************!*\
  !*** ./src/components/ListFilters/Table.js ***!
  \*********************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _ImportSampleFilters__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../ImportSampleFilters */ "./src/components/ImportSampleFilters.js");
/* harmony import */ var _SVGIcons__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../SVGIcons */ "./src/components/SVGIcons.js");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../utils */ "./src/components/utils.js");
/* harmony import */ var _ListFiltersContext__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./ListFiltersContext */ "./src/components/ListFilters/ListFiltersContext.js");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./utils */ "./src/components/ListFilters/utils.js");








const headers = [(0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Title', 'wc-ajax-product-filter'), (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Component', 'wc-ajax-product-filter'), (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Filter Key', 'wc-ajax-product-filter'), (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Actions', 'wc-ajax-product-filter')];

const Table = _ref => {
  let {
    openAddNewModal,
    openDeleteModal,
    openDuplicateModal,
    openPublishModal,
    deletingItemId,
    duplicatingItemId
  } = _ref;
  const {
    state: {
      filters
    }
  } = (0,_ListFiltersContext__WEBPACK_IMPORTED_MODULE_6__.useListFilters)();
  const filtersFound = filters.length;

  const tableHeader = () => {
    return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("tr", null, headers.map(item => {
      return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("th", {
        className: (0,_utils__WEBPACK_IMPORTED_MODULE_5__.slugify)(item),
        key: `posts-table-${item}`
      }, item);
    }));
  };

  const tableBody = () => filters.map(_filter => {
    const filter = (0,_utils__WEBPACK_IMPORTED_MODULE_7__.prepareFilterData)(_filter);
    const filterId = filter.id;
    const filterTitle = filter.title ? filter.title : (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('(no title)', 'wc-ajax-product-filter');
    const isDeleting = filterId === deletingItemId;
    const isDuplicating = filterId === duplicatingItemId;
    return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("tr", {
      key: filterId
    }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("td", {
      className: "__Title"
    }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("a", {
      href: filter.editLink,
      className: "__post_title"
    }, filterTitle), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
      className: "__post_id"
    }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('ID', 'wc-ajax-product-filter'), ":", ` `, filterId)), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("td", {
      className: "__Filter_Type"
    }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
      className: "__component"
    }, filter.component), filter.componentExtra && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
      className: "__component_extra"
    }, filter.componentExtra)), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("td", {
      className: "__Filter_Key"
    }, filter.filter_key), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("td", {
      className: "__Actions"
    }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.Button, {
      icon: _SVGIcons__WEBPACK_IMPORTED_MODULE_4__.DeleteIcon,
      onClick: () => openDeleteModal(filterId),
      isBusy: isDeleting,
      disabled: isDeleting,
      isSmall: true
    }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.Button, {
      icon: _SVGIcons__WEBPACK_IMPORTED_MODULE_4__.DuplicateIcon,
      onClick: () => openDuplicateModal(filterId),
      isBusy: isDuplicating,
      disabled: isDuplicating,
      isSmall: true
    }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.Button, {
      icon: _SVGIcons__WEBPACK_IMPORTED_MODULE_4__.CodeIcon,
      onClick: () => openPublishModal(filterId),
      isSmall: true
    }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.Button, {
      icon: _SVGIcons__WEBPACK_IMPORTED_MODULE_4__.EditIcon,
      href: filter.editLink,
      className: "__edit_btn",
      isSmall: true
    })));
  });

  const listTable = () => {
    return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: "__list_table_responsive_wrapper"
    }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("table", null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("thead", null, tableHeader()), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("tbody", null, tableBody())));
  };

  const listSummary = () => {
    if (filtersFound) {
      const countResults = (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.sprintf)((0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__._n)('Showing <b>%d</b> result', 'Showing <b>%d</b> results', filtersFound, 'wc-ajax-product-filter'), filtersFound);
      return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
        className: "__list_table_summary"
      }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
        dangerouslySetInnerHTML: {
          __html: countResults
        }
      }));
    }
  };

  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "__content"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "__list_table_wrapper"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "__list_table_header"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("h2", null, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('List of Filters', 'wc-ajax-product-filter')), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.Button, {
    variant: "primary",
    onClick: openAddNewModal
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.Icon, {
    icon: _SVGIcons__WEBPACK_IMPORTED_MODULE_4__.PlusIcon,
    size: 16
  }), (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Add New', 'wc-ajax-product-filter'))), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "__list_table_inner"
  }, filtersFound ? listTable() : (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_ImportSampleFilters__WEBPACK_IMPORTED_MODULE_3__["default"], {
    view: 'filters'
  })), listSummary()));
};

/* harmony default export */ __webpack_exports__["default"] = (Table);

/***/ }),

/***/ "./src/components/ListFilters/index.js":
/*!*********************************************!*\
  !*** ./src/components/ListFilters/index.js ***!
  \*********************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _ListFiltersContext__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./ListFiltersContext */ "./src/components/ListFilters/ListFiltersContext.js");
/* harmony import */ var _TopBar__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../TopBar */ "./src/components/TopBar.js");
/* harmony import */ var _Table__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./Table */ "./src/components/ListFilters/Table.js");
/* harmony import */ var _Sidebar__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../Sidebar */ "./src/components/Sidebar.js");
/* harmony import */ var _AddNewModal__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./AddNewModal */ "./src/components/ListFilters/AddNewModal/index.js");
/* harmony import */ var _Notifications__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../Notifications */ "./src/components/Notifications.js");
/* harmony import */ var _useListTable__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../useListTable */ "./src/components/useListTable.js");
/* harmony import */ var _Modals_DeleteModal__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../Modals/DeleteModal */ "./src/components/Modals/DeleteModal.js");
/* harmony import */ var _Modals_DuplicateModal__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../Modals/DuplicateModal */ "./src/components/Modals/DuplicateModal.js");
/* harmony import */ var _Modals_PublishModal__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../Modals/PublishModal */ "./src/components/Modals/PublishModal.js");












const ListFilters = () => {
  const {
    state: {
      filters: items
    },
    dispatch
  } = (0,_ListFiltersContext__WEBPACK_IMPORTED_MODULE_1__.useListFilters)();
  const postType = 'filter';
  const {
    addNewModalOpen,
    setAddNewModalOpen,
    handleOpenAddNewModal,
    deleteModalId,
    handleOpenDeleteModal,
    handleCloseDeleteModal,
    handleDeleteItem,
    duplicateModalId,
    handleOpenDuplicateModal,
    handleCloseDuplicateModal,
    handleDuplicateItem,
    publishModalId,
    handleOpenPublishModal,
    handleClosePublishModal,
    deletingItemId,
    duplicatingItemId
  } = (0,_useListTable__WEBPACK_IMPORTED_MODULE_7__["default"])(dispatch, items, postType);
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "__wcapf_admin"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_TopBar__WEBPACK_IMPORTED_MODULE_2__["default"], {
    view: 'filters'
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "__wcapf_layout"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "__main"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_Table__WEBPACK_IMPORTED_MODULE_3__["default"], {
    openAddNewModal: handleOpenAddNewModal,
    openDeleteModal: handleOpenDeleteModal,
    openDuplicateModal: handleOpenDuplicateModal,
    openPublishModal: handleOpenPublishModal,
    deletingItemId: deletingItemId,
    duplicatingItemId: duplicatingItemId
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_Sidebar__WEBPACK_IMPORTED_MODULE_4__["default"], null)), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_AddNewModal__WEBPACK_IMPORTED_MODULE_5__["default"], {
    isOpen: addNewModalOpen,
    setAddNewModalOpen: setAddNewModalOpen
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_Modals_DeleteModal__WEBPACK_IMPORTED_MODULE_8__["default"], {
    isOpen: deleteModalId,
    closeModal: handleCloseDeleteModal,
    deleteItem: handleDeleteItem,
    postType: postType
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_Modals_DuplicateModal__WEBPACK_IMPORTED_MODULE_9__["default"], {
    isOpen: duplicateModalId,
    closeModal: handleCloseDuplicateModal,
    duplicateItem: handleDuplicateItem,
    postType: postType
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_Modals_PublishModal__WEBPACK_IMPORTED_MODULE_10__["default"], {
    isOpen: publishModalId,
    closeModal: handleClosePublishModal,
    postType: postType
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_Notifications__WEBPACK_IMPORTED_MODULE_6__["default"], null)));
};

/* harmony default export */ __webpack_exports__["default"] = (ListFilters);

/***/ }),

/***/ "./src/components/ListFilters/listFiltersReducer.js":
/*!**********************************************************!*\
  !*** ./src/components/ListFilters/listFiltersReducer.js ***!
  \**********************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "initialState": function() { return /* binding */ initialState; }
/* harmony export */ });
const initialFilters = wcapf_admin_params.filters;
const initialState = {
  title: '',
  filterType: '',
  filterKeys: {},
  additionalData: {},
  activeFilterData: {},
  filtersData: {},
  filters: initialFilters
};

const listFiltersReducer = (state, action) => {
  switch (action.type) {
    case 'SET_TITLE':
      return { ...state,
        title: action.payload
      };

    case 'SET_FILTER_TYPE':
      return { ...state,
        filterType: action.payload
      };

    case 'SET_ACTIVE_FILTER_DATA':
      return { ...state,
        activeFilterData: action.payload
      };

    case 'SET_FILTER_KEYS':
      return { ...state,
        filterKeys: action.payload
      };

    case 'SET_ADDITIONAL_DATA':
      return { ...state,
        additionalData: action.payload
      };

    case 'SET_FILTERS_DATA':
      return { ...state,
        filtersData: action.payload
      };

    case 'SET_FILTERS':
      return { ...state,
        filters: action.payload
      };

    default:
      return state;
  }
};

/* harmony default export */ __webpack_exports__["default"] = (listFiltersReducer);

/***/ }),

/***/ "./src/components/ListFilters/utils.js":
/*!*********************************************!*\
  !*** ./src/components/ListFilters/utils.js ***!
  \*********************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "prepareFilterData": function() { return /* binding */ prepareFilterData; }
/* harmony export */ });
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! lodash */ "lodash");
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(lodash__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _Filter_utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../Filter/utils */ "./src/components/Filter/utils.js");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../utils */ "./src/components/utils.js");



function prepareFilterData(raw) {
  const {
    id,
    field_key,
    type,
    taxonomy,
    meta_key,
    post_property,
    title
  } = raw;
  const shortcode = `[wcapf_filter id="${id}"]`;

  const _filterData = (0,lodash__WEBPACK_IMPORTED_MODULE_0__.find)((0,_Filter_utils__WEBPACK_IMPORTED_MODULE_1__.availableFilters)(), {
    type: type
  });

  const component = _filterData['title'];
  let componentExtra = '';

  if ('custom-taxonomy' === type || 'attribute' === type) {
    componentExtra = taxonomy;
  } else if ('post-meta' === type) {
    componentExtra = meta_key;
  } else if ('post-property' === type) {
    componentExtra = post_property;
  }

  const editLink = (0,_utils__WEBPACK_IMPORTED_MODULE_2__.getEditFilterLink)(id);
  return {
    id,
    title,
    filter_key: field_key,
    shortcode,
    component,
    componentExtra,
    editLink
  };
}

/***/ }),

/***/ "./src/components/Modals/DeleteModal.js":
/*!**********************************************!*\
  !*** ./src/components/Modals/DeleteModal.js ***!
  \**********************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _SVGIcons__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../SVGIcons */ "./src/components/SVGIcons.js");





const DeleteModal = _ref => {
  let {
    isOpen,
    closeModal,
    deleteItem,
    postType
  } = _ref;
  let heading;
  let description;

  if ('filter' === postType) {
    heading = (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Delete Filter?', 'wc-ajax-product-filter');
    description = (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('This will delete the filter permanently.', 'wc-ajax-product-filter');
  } else if ('form' === postType) {
    heading = (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Delete Form?', 'wc-ajax-product-filter');
    description = (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('This will delete the form permanently.', 'wc-ajax-product-filter');
  }

  return isOpen && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.Modal, {
    onRequestClose: closeModal,
    __experimentalHideHeader: true
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "__action_modal __delete_modal"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.Icon, {
    icon: _SVGIcons__WEBPACK_IMPORTED_MODULE_3__.DeleteIcon,
    size: 60,
    className: "__icon"
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("h3", null, heading), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("p", {
    className: "description"
  }, description), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "__buttons"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.Button, {
    variant: "secondary",
    onClick: closeModal
  }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('No', 'wc-ajax-product-filter')), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.Button, {
    variant: "primary",
    onClick: deleteItem
  }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Yes', 'wc-ajax-product-filter')))));
};

/* harmony default export */ __webpack_exports__["default"] = (DeleteModal);

/***/ }),

/***/ "./src/components/Modals/DuplicateModal.js":
/*!*************************************************!*\
  !*** ./src/components/Modals/DuplicateModal.js ***!
  \*************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _SVGIcons__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../SVGIcons */ "./src/components/SVGIcons.js");





const DuplicateModal = _ref => {
  let {
    isOpen,
    closeModal,
    duplicateItem,
    postType
  } = _ref;
  let heading;
  let description;

  if ('filter' === postType) {
    heading = (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Duplicate Filter?', 'wc-ajax-product-filter');
    description = (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('This will duplicate the filter with all settings.', 'wc-ajax-product-filter');
  } else if ('form' === postType) {
    heading = (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Duplicate Form?', 'wc-ajax-product-filter');
    description = (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('This will duplicate the form with all settings.', 'wc-ajax-product-filter');
  }

  return isOpen && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.Modal, {
    onRequestClose: closeModal,
    __experimentalHideHeader: true
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "__action_modal __duplicate_modal"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.Icon, {
    icon: _SVGIcons__WEBPACK_IMPORTED_MODULE_3__.DuplicateIcon,
    size: 60,
    className: "__icon"
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("h3", null, heading), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("p", {
    className: "description"
  }, description), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "__buttons"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.Button, {
    variant: "secondary",
    onClick: closeModal
  }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('No', 'wc-ajax-product-filter')), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.Button, {
    variant: "primary",
    onClick: duplicateItem
  }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Yes', 'wc-ajax-product-filter')))));
};

/* harmony default export */ __webpack_exports__["default"] = (DuplicateModal);

/***/ }),

/***/ "./src/components/Modals/PublishModal.js":
/*!***********************************************!*\
  !*** ./src/components/Modals/PublishModal.js ***!
  \***********************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _SVGIcons__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../SVGIcons */ "./src/components/SVGIcons.js");
/* harmony import */ var _notices__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../notices */ "./src/components/notices.js");






const PublishModal = _ref => {
  let {
    isOpen: id,
    closeModal,
    postType
  } = _ref;
  const clipboardApiFound = window.isSecureContext && navigator.clipboard;

  const handleCopyToClipboard = text => {
    if (!clipboardApiFound) {
      return;
    }

    navigator.clipboard.writeText(text);
    (0,_notices__WEBPACK_IMPORTED_MODULE_4__.copiedToClipboardNotice)();
  };

  const handleTabChange = () => {
    (0,_notices__WEBPACK_IMPORTED_MODULE_4__.removeCopiedToClipboardNotice)();
  };

  const getTabContent = tab => {
    let description;
    let code;
    let shortcode;
    let widgetName;

    if ('filter' === postType) {
      shortcode = `[wcapf_filter id="${id}"]`;
      widgetName = 'WC Ajax Product Filter';
    } else if ('form' === postType) {
      shortcode = `[wcapf_form id="${id}"]`;
      widgetName = 'WC Ajax Product Filter Form';
    }

    const widgetsPageLink = wcapf_admin_params.widgets_page_link;

    if ('shortcode' === tab) {
      description = (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('If you want to publish using shortcode, just copy code below and use it.', 'wc-ajax-product-filter');
      code = shortcode;
    } else if ('php-code' === tab) {
      description = (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('If you want to publish using PHP code, just copy code below and use it.', 'wc-ajax-product-filter');
      code = `<?php echo do_shortcode( '${shortcode}' ); ?>`;
    } else {
      description = (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.sprintf)((0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('If you want to use it in a widget, go to the widgets page, add <b>%s</b> widget to the desired area.', 'wc-ajax-product-filter'), widgetName);
    }

    let classes = '__code';

    if (clipboardApiFound) {
      classes += ' __clipboard-api-found';
    }

    return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: "__publish_tab_content"
    }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("p", {
      dangerouslySetInnerHTML: {
        __html: description
      }
    }), ('shortcode' === tab || 'php-code' === tab) && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: classes,
      tabIndex: 0,
      onClick: () => handleCopyToClipboard(code)
    }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: "__text"
    }, code), clipboardApiFound && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.Icon, {
      icon: _SVGIcons__WEBPACK_IMPORTED_MODULE_3__.ClipboardIcon,
      size: 24
    })), 'widget' === tab && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: "__link"
    }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.Button, {
      variant: "primary",
      href: widgetsPageLink,
      target: "_blank"
    }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Go to Widgets', 'wc-ajax-product-filter'))), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: "__buttons"
    }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.Button, {
      variant: "secondary",
      onClick: closeModal
    }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Cancel', 'wc-ajax-product-filter'))));
  };

  let heading;

  if ('filter' === postType) {
    heading = (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Publish Filter', 'wc-ajax-product-filter');
  } else if ('form' === postType) {
    heading = (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Publish Form', 'wc-ajax-product-filter');
  }

  return id && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.Modal, {
    onRequestClose: closeModal,
    __experimentalHideHeader: true,
    className: "__publish_modal"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("h3", null, heading), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.TabPanel, {
    className: "__publish_tab_panel",
    activeClass: "active-tab",
    onSelect: handleTabChange,
    tabs: [{
      name: 'shortcode',
      title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Shortcode', 'wc-ajax-product-filter'),
      className: 'shortcode'
    }, {
      name: 'php-code',
      title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('PHP Code', 'wc-ajax-product-filter'),
      className: 'php-code'
    }, {
      name: 'widget',
      title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Widget', 'wc-ajax-product-filter'),
      className: 'widget'
    }]
  }, tab => getTabContent(tab.name))));
};

/* harmony default export */ __webpack_exports__["default"] = (PublishModal);

/***/ }),

/***/ "./src/components/Notifications.js":
/*!*****************************************!*\
  !*** ./src/components/Notifications.js ***!
  \*****************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_notices__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/notices */ "@wordpress/notices");
/* harmony import */ var _wordpress_notices__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_notices__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @wordpress/data */ "@wordpress/data");
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_wordpress_data__WEBPACK_IMPORTED_MODULE_3__);





const Notifications = () => {
  const notices = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_3__.useSelect)(select => select(_wordpress_notices__WEBPACK_IMPORTED_MODULE_2__.store).getNotices(), []);
  const {
    removeNotice
  } = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_3__.useDispatch)(_wordpress_notices__WEBPACK_IMPORTED_MODULE_2__.store);
  const snackbarNotices = notices.filter(_ref => {
    let {
      type
    } = _ref;
    return type === 'snackbar';
  });
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.SnackbarList, {
    notices: snackbarNotices,
    className: "components-editor-notices__snackbar",
    onRemove: removeNotice
  });
};

/* harmony default export */ __webpack_exports__["default"] = (Notifications);

/***/ }),

/***/ "./src/components/ProFeaturesNotice.js":
/*!*********************************************!*\
  !*** ./src/components/ProFeaturesNotice.js ***!
  \*********************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./utils */ "./src/components/utils.js");




const ProFeaturesNotice = _ref => {
  let {
    message
  } = _ref;
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, !(0,_utils__WEBPACK_IMPORTED_MODULE_2__.foundProVersion)() && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "__pro_settings"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("p", null, message, ` `, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("a", {
    href: (0,_utils__WEBPACK_IMPORTED_MODULE_2__.upgradeToProLink)(),
    target: "_blank"
  }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Upgrade', 'wc-ajax-product-filter')))));
};

/* harmony default export */ __webpack_exports__["default"] = (ProFeaturesNotice);

/***/ }),

/***/ "./src/components/SVGIcons.js":
/*!************************************!*\
  !*** ./src/components/SVGIcons.js ***!
  \************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "BackIcon": function() { return /* binding */ BackIcon; },
/* harmony export */   "CheckIcon": function() { return /* binding */ CheckIcon; },
/* harmony export */   "ClipboardIcon": function() { return /* binding */ ClipboardIcon; },
/* harmony export */   "CodeIcon": function() { return /* binding */ CodeIcon; },
/* harmony export */   "DeleteIcon": function() { return /* binding */ DeleteIcon; },
/* harmony export */   "DiamondIcon": function() { return /* binding */ DiamondIcon; },
/* harmony export */   "DuplicateIcon": function() { return /* binding */ DuplicateIcon; },
/* harmony export */   "EditIcon": function() { return /* binding */ EditIcon; },
/* harmony export */   "ImportIcon": function() { return /* binding */ ImportIcon; },
/* harmony export */   "PictureIcon": function() { return /* binding */ PictureIcon; },
/* harmony export */   "PlusIcon": function() { return /* binding */ PlusIcon; },
/* harmony export */   "SaveIcon": function() { return /* binding */ SaveIcon; }
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);

const EditIcon = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("svg", {
  viewBox: "0 0 48 48"
}, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  d: "M16.1161 39.6339C15.628 39.1457 15.628 38.3543 16.1161 37.8661L29.9822 24L16.1161 10.1339C15.628 9.64573 15.628 8.85427 16.1161 8.36612C16.6043 7.87796 17.3957 7.87796 17.8839 8.36612L32.6339 23.1161C33.122 23.6043 33.122 24.3957 32.6339 24.8839L17.8839 39.6339C17.3957 40.122 16.6043 40.122 16.1161 39.6339Z"
}));
const DeleteIcon = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("svg", {
  viewBox: "0 0 256 256"
}, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  d: "M215.99609,52H172V40a20.0226,20.0226,0,0,0-20-20H104A20.0226,20.0226,0,0,0,84,40V52H39.99609a4,4,0,0,0,0,8h12V208a12.01375,12.01375,0,0,0,12,12h128a12.01375,12.01375,0,0,0,12-12V60h12a4,4,0,0,0,0-8ZM92,40a12.01375,12.01375,0,0,1,12-12h48a12.01375,12.01375,0,0,1,12,12V52H92ZM195.99609,208a4.00458,4.00458,0,0,1-4,4h-128a4.00458,4.00458,0,0,1-4-4V60h136ZM108,104v64a4,4,0,0,1-8,0V104a4,4,0,0,1,8,0Zm48,0v64a4,4,0,0,1-8,0V104a4,4,0,0,1,8,0Z"
}));
const CodeIcon = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("svg", {
  viewBox: "0 0 16 16"
}, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  d: "M10.478 1.647a.5.5 0 1 0-.956-.294l-4 13a.5.5 0 0 0 .956.294l4-13zM4.854 4.146a.5.5 0 0 1 0 .708L1.707 8l3.147 3.146a.5.5 0 0 1-.708.708l-3.5-3.5a.5.5 0 0 1 0-.708l3.5-3.5a.5.5 0 0 1 .708 0zm6.292 0a.5.5 0 0 0 0 .708L14.293 8l-3.147 3.146a.5.5 0 0 0 .708.708l3.5-3.5a.5.5 0 0 0 0-.708l-3.5-3.5a.5.5 0 0 0-.708 0z"
}));
const DuplicateIcon = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("svg", {
  viewBox: "0 0 255.99316 255.99316"
}, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  d: "M219.99268,39.99414v144.001a4,4,0,0,1-8,0V43.99414H71.98584a4,4,0,0,1,0-8H215.99268A4.0002,4.0002,0,0,1,219.99268,39.99414Zm-32,32.001v144a4.0002,4.0002,0,0,1-4,4H39.98584a4.0002,4.0002,0,0,1-4-4v-144a4.0002,4.0002,0,0,1,4-4H183.99268A4.0002,4.0002,0,0,1,187.99268,71.99512Zm-8,4H43.98584v136H179.99268Z"
}));
const BackIcon = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("svg", {
  viewBox: "0 0 512.006 512.006"
}, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  d: "M388.419,475.59L168.834,256.005L388.418,36.421c8.341-8.341,8.341-21.824,0-30.165s-21.824-8.341-30.165,0    L123.586,240.923c-8.341,8.341-8.341,21.824,0,30.165l234.667,234.667c4.16,4.16,9.621,6.251,15.083,6.251    c5.461,0,10.923-2.091,15.083-6.251C396.76,497.414,396.76,483.931,388.419,475.59z"
}));
const ClipboardIcon = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("svg", {
  viewBox: "0 0 21 21"
}, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("g", {
  fill: "none",
  fillRule: "evenodd",
  stroke: "currentColor",
  strokeLinecap: "round",
  strokeLinejoin: "round",
  transform: "translate(4 3)"
}, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  d: "m6.5 11.5-3-3 3-3"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  d: "m3.5 8.5h11"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  d: "m12.5 6.5v-4.00491374c0-.51283735-.3860402-.93550867-.8833789-.99327378l-.1190802-.00672622-1.9975409.00491374m-6 0-1.99754087-.00492752c-.51283429-.00124584-.93645365.38375378-.99544161.88094891l-.00701752.11906329v10.99753792c.00061497.5520447.44795562.9996604 1 1.0006148l10 .0061554c.5128356.0008784.9357441-.3848611.993815-.8821612l.006185-.1172316v-2.5"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  d: "m4.5.5h4c.55228475 0 1 .44771525 1 1s-.44771525 1-1 1h-4c-.55228475 0-1-.44771525-1-1s.44771525-1 1-1z"
})));
const DiamondIcon = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("svg", {
  viewBox: "0 0 64 64"
}, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  id: "Diamond",
  d: "M63.6870499,18.5730648L48.7831497,4.278266c-0.1855011-0.1758003-0.4316025-0.4813001-0.6870003-0.4813001 H15.9037514c-0.2553005,0-0.5014,0.3054998-0.6870003,0.4813001l-14.9038,14.1908998 c-0.374,0.3535004-0.4184,0.9855995-0.1025,1.3917999c0.21,0.2703991,30.8237991,39.7256012,31.0517006,39.9812012 c0.1022987,0.1149979,0.2402992,0.2215996,0.3428001,0.266098c0.2763996,0.1206017,0.5077,0.1296997,0.7900982,0.0065002 c0.1025009-0.0444984,0.2404022-0.1348991,0.3428001-0.2499008c0.0151024-0.0168991,0.0377007-0.0224991,0.0517006-0.0404968 L63.789547,19.9121666C64.1054459,19.5058651,64.0610504,18.9265652,63.6870499,18.5730648z M15.6273508,6.4344659 l4.9945002,11.3625011H3.6061509L15.6273508,6.4344659z M24.0795517,17.7969666l7.9203987-11.2617006l7.9204979,11.2617006 H24.0795517z M40.7191467,19.7969666l-8.7191963,34.8769989l-8.719099-34.8769989H40.7191467z M33.9257507,5.7969656h12.5423012 l-4.8240013,10.9746008L33.9257507,5.7969656z M22.3559513,16.7715664L17.53195,5.7969656h12.5423012L22.3559513,16.7715664z M21.2191505,19.7969666l8.6596012,34.638401L2.975451,19.7969666H21.2191505z M42.7808495,19.7969666h18.2436981 l-26.9032974,34.638401L42.7808495,19.7969666z M43.3781471,17.7969666l4.9944992-11.3625011l12.0212021,11.3625011H43.3781471z"
}));
const CheckIcon = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("svg", {
  viewBox: "0 0 24 24"
}, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("polyline", {
  points: "20 6 9 17 4 12"
}));
const PlusIcon = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("svg", {
  viewBox: "0 0 492 492"
}, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  d: "M465.064,207.566l0.028,0H284.436V27.25c0-14.84-12.016-27.248-26.856-27.248h-23.116 c-14.836,0-26.904,12.408-26.904,27.248v180.316H26.908c-14.832,0-26.908,12-26.908,26.844v23.248 c0,14.832,12.072,26.78,26.908,26.78h180.656v180.968c0,14.832,12.064,26.592,26.904,26.592h23.116 c14.84,0,26.856-11.764,26.856-26.592V284.438h180.624c14.84,0,26.936-11.952,26.936-26.78V234.41 C492,219.566,479.904,207.566,465.064,207.566z"
}));
const SaveIcon = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("svg", {
  viewBox: "0 0 24 24"
}, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  d: "M3 5.75C3 4.23122 4.23122 3 5.75 3H15.7145C16.5764 3 17.4031 3.34241 18.0126 3.9519L20.0481 5.98744C20.6576 6.59693 21 7.42358 21 8.28553V18.25C21 19.7688 19.7688 21 18.25 21H5.75C4.23122 21 3 19.7688 3 18.25V5.75ZM5.75 4.5C5.05964 4.5 4.5 5.05964 4.5 5.75V18.25C4.5 18.9404 5.05964 19.5 5.75 19.5H6V14.25C6 13.0074 7.00736 12 8.25 12H15.75C16.9926 12 18 13.0074 18 14.25V19.5H18.25C18.9404 19.5 19.5 18.9404 19.5 18.25V8.28553C19.5 7.8214 19.3156 7.37629 18.9874 7.0481L16.9519 5.01256C16.6918 4.75246 16.3582 4.58269 16 4.52344V7.25C16 8.49264 14.9926 9.5 13.75 9.5H9.25C8.00736 9.5 7 8.49264 7 7.25V4.5H5.75ZM16.5 19.5V14.25C16.5 13.8358 16.1642 13.5 15.75 13.5H8.25C7.83579 13.5 7.5 13.8358 7.5 14.25V19.5H16.5ZM8.5 4.5V7.25C8.5 7.66421 8.83579 8 9.25 8H13.75C14.1642 8 14.5 7.66421 14.5 7.25V4.5H8.5Z"
}));
const ImportIcon = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("svg", {
  viewBox: "0 0 24 24"
}, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  d: "M16.4 19.62H6.39999C5.40543 19.62 4.4516 19.2249 3.74834 18.5216C3.04508 17.8184 2.64999 16.8646 2.64999 15.87V13.37C2.64999 13.1711 2.72901 12.9803 2.86966 12.8397C3.01032 12.699 3.20108 12.62 3.39999 12.62C3.59891 12.62 3.78967 12.699 3.93032 12.8397C4.07098 12.9803 4.14999 13.1711 4.14999 13.37V15.87C4.14999 16.4667 4.38705 17.039 4.809 17.461C5.23096 17.8829 5.80326 18.12 6.39999 18.12H16.4C16.9967 18.12 17.569 17.8829 17.991 17.461C18.4129 17.039 18.65 16.4667 18.65 15.87V13.37C18.65 13.1711 18.729 12.9803 18.8697 12.8397C19.0103 12.699 19.2011 12.62 19.4 12.62C19.5989 12.62 19.7897 12.699 19.9303 12.8397C20.071 12.9803 20.15 13.1711 20.15 13.37V15.87C20.15 16.8646 19.7549 17.8184 19.0516 18.5216C18.3484 19.2249 17.3946 19.62 16.4 19.62Z"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  d: "M11.4 14.88C11.2011 14.88 11.0103 14.801 10.8697 14.6603C10.729 14.5197 10.65 14.3289 10.65 14.13V5.13C10.65 4.93109 10.729 4.74033 10.8697 4.59967C11.0103 4.45902 11.2011 4.38 11.4 4.38C11.5989 4.38 11.7897 4.45902 11.9303 4.59967C12.071 4.74033 12.15 4.93109 12.15 5.13V14.13C12.1474 14.3281 12.0676 14.5174 11.9275 14.6575C11.7874 14.7976 11.5981 14.8774 11.4 14.88Z"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  d: "M11.4 16.12C11.3014 16.121 11.2036 16.1021 11.1125 16.0643C11.0214 16.0265 10.9389 15.9706 10.87 15.9L6.63 11.66C6.55925 11.5911 6.50301 11.5086 6.46461 11.4176C6.42621 11.3266 6.40643 11.2288 6.40643 11.13C6.40643 11.0312 6.42621 10.9334 6.46461 10.8424C6.50301 10.7514 6.55925 10.669 6.63 10.6C6.77063 10.4596 6.96125 10.3807 7.16 10.3807C7.35875 10.3807 7.54938 10.4596 7.69 10.6L11.4 14.31L15.11 10.6C15.1787 10.5263 15.2615 10.4672 15.3535 10.4262C15.4455 10.3852 15.5448 10.3632 15.6455 10.3614C15.7462 10.3596 15.8462 10.3782 15.9396 10.4159C16.033 10.4536 16.1178 10.5097 16.189 10.581C16.2603 10.6522 16.3164 10.737 16.3541 10.8304C16.3918 10.9238 16.4104 11.0238 16.4086 11.1245C16.4068 11.2252 16.3848 11.3245 16.3438 11.4165C16.3028 11.5085 16.2437 11.5913 16.17 11.66L11.93 15.9C11.8608 15.9701 11.7782 16.0257 11.6872 16.0635C11.5962 16.1013 11.4985 16.1205 11.4 16.12Z"
}));
const PictureIcon = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("svg", {
  viewBox: "0 0 64 64"
}, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("g", null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  d: "M0,3.26315v57.4737015h64V3.26315H0z M62,5.2631502V34.480751L47.1523018,20.5346508 c-0.1992035-0.1875-0.4580002-0.2890015-0.7422028-0.2695007c-0.2733994,0.0156002-0.5282974,0.1425991-0.7059975,0.352499 L28.4267006,41.04245L15.4111004,30.3715496c-0.3984003-0.3270988-0.9863005-0.2967987-1.3496008,0.075201L2,42.8066483V5.2631502 H62z M2,58.7368507V45.6702499l12.8525-13.1707001l13.0684004,10.7137985 c0.4228001,0.347702,1.044899,0.2901001,1.3973999-0.1278992l17.2325001-20.3720989L62,37.2237511v21.5130997H2z"
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  d: "M26,26.2631493c3.8593006,0,7-3.1406002,7-7c0-3.8592997-3.1406994-6.999999-7-6.999999 c-3.8593998,0-7,3.1406994-7,6.999999C19,23.1225491,22.1406002,26.2631493,26,26.2631493z M26,14.2631502 c2.7567997,0,5,2.2431993,5,4.999999c0,2.7569008-2.2432003,5-5,5c-2.7569008,0-5-2.2430992-5-5 C21,16.5063496,23.2430992,14.2631502,26,14.2631502z"
})));

/***/ }),

/***/ "./src/components/Sidebar.js":
/*!***********************************!*\
  !*** ./src/components/Sidebar.js ***!
  \***********************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__);




const documentation = (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('There you can find detailed information about how to use the plugin correctly.', 'wc-ajax-product-filter');

const support = (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Did you find any <b>bugs</b> or <b>compatibility issues</b>? Please do not hesitate to open a thread on the support forum.', 'wc-ajax-product-filter');

const question = (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)("Do you have any <b>questions</b> or <b>feature requests</b> or do you need help with <b>custom development</b>? We'll be able to answer any kind of query.", 'wc-ajax-product-filter');

const Sidebar = () => {
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "__sidebar"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Card, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.CardHeader, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("h2", null, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Documentation', 'wc-ajax-product-filter'))), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.CardBody, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("p", {
    dangerouslySetInnerHTML: {
      __html: documentation
    }
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "__buttons"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Button, {
    variant: "secondary"
  }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('To Documentation', 'wc-ajax-product-filter')), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Button, {
    variant: "secondary"
  }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('View Demos', 'wc-ajax-product-filter'))))), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Card, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.CardHeader, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("h2", null, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Support', 'wc-ajax-product-filter'))), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.CardBody, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("p", {
    dangerouslySetInnerHTML: {
      __html: support
    }
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Button, {
    variant: "secondary"
  }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('To Support', 'wc-ajax-product-filter')))), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Card, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.CardHeader, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("h2", null, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Any Question?', 'wc-ajax-product-filter'))), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.CardBody, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("p", {
    dangerouslySetInnerHTML: {
      __html: question
    }
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Button, {
    variant: "secondary"
  }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Ask Us', 'wc-ajax-product-filter')))));
};

/* harmony default export */ __webpack_exports__["default"] = (Sidebar);

/***/ }),

/***/ "./src/components/TopBar.js":
/*!**********************************!*\
  !*** ./src/components/TopBar.js ***!
  \**********************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _SVGIcons__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./SVGIcons */ "./src/components/SVGIcons.js");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./utils */ "./src/components/utils.js");





const navMenus = [{
  label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Filters', 'wc-ajax-product-filter'),
  id: 'filters',
  href: (0,_utils__WEBPACK_IMPORTED_MODULE_4__.getFiltersPageLink)()
}, {
  label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Forms', 'wc-ajax-product-filter'),
  id: 'forms',
  href: (0,_utils__WEBPACK_IMPORTED_MODULE_4__.getFormsPageLink)()
}, {
  label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Settings', 'wc-ajax-product-filter'),
  id: 'settings',
  href: (0,_utils__WEBPACK_IMPORTED_MODULE_4__.getSettingsPageLink)()
}];

const TopBar = _ref => {
  let {
    view
  } = _ref;
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "__top_bar"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "__navbar"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("h2", null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Icon, {
    icon: 'filter',
    className: "__icon"
  }), "WC Ajax Product Filter"), navMenus.map(menu => {
    const menuClass = view === menu.id ? 'is-active' : '';
    return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("a", {
      className: menuClass,
      href: menu.href,
      key: menu.id
    }, menu.label);
  })), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "__cta"
  }, !(0,_utils__WEBPACK_IMPORTED_MODULE_4__.foundProVersion)() && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("a", {
    href: (0,_utils__WEBPACK_IMPORTED_MODULE_4__.upgradeToProLink)(),
    className: "__upgrade_btn",
    target: "_blank"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Icon, {
    icon: _SVGIcons__WEBPACK_IMPORTED_MODULE_3__.DiamondIcon,
    size: 18
  }), (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Upgrade to PRO', 'wc-ajax-product-filter')), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "__plan"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", null, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('You are on the', 'wc-ajax-product-filter')), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", null, (0,_utils__WEBPACK_IMPORTED_MODULE_4__.foundProVersion)() ? (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('PRO Plan') : (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('FREE Plan'))), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "__version"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", null, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Version', 'wc-ajax-product-filter')), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", null, (0,_utils__WEBPACK_IMPORTED_MODULE_4__.pluginVersion)()))));
};

/* harmony default export */ __webpack_exports__["default"] = (TopBar);

/***/ }),

/***/ "./src/components/notices.js":
/*!***********************************!*\
  !*** ./src/components/notices.js ***!
  \***********************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "addErrorNotice": function() { return /* binding */ addErrorNotice; },
/* harmony export */   "addSuccessNotice": function() { return /* binding */ addSuccessNotice; },
/* harmony export */   "copiedToClipboardNotice": function() { return /* binding */ copiedToClipboardNotice; },
/* harmony export */   "itemCreateErrorNotice": function() { return /* binding */ itemCreateErrorNotice; },
/* harmony export */   "itemDeletedErrorNotice": function() { return /* binding */ itemDeletedErrorNotice; },
/* harmony export */   "itemDeletedSuccessNotice": function() { return /* binding */ itemDeletedSuccessNotice; },
/* harmony export */   "itemDuplicatedErrorNotice": function() { return /* binding */ itemDuplicatedErrorNotice; },
/* harmony export */   "itemDuplicatedSuccessNotice": function() { return /* binding */ itemDuplicatedSuccessNotice; },
/* harmony export */   "itemSavedErrorNotice": function() { return /* binding */ itemSavedErrorNotice; },
/* harmony export */   "itemSavedSuccessNotice": function() { return /* binding */ itemSavedSuccessNotice; },
/* harmony export */   "removeCopiedToClipboardNotice": function() { return /* binding */ removeCopiedToClipboardNotice; },
/* harmony export */   "removeItemCreateNotice": function() { return /* binding */ removeItemCreateNotice; },
/* harmony export */   "removeItemDeletedNotices": function() { return /* binding */ removeItemDeletedNotices; },
/* harmony export */   "removeItemDuplicatedNotices": function() { return /* binding */ removeItemDuplicatedNotices; },
/* harmony export */   "removeItemSavedNotices": function() { return /* binding */ removeItemSavedNotices; },
/* harmony export */   "removeNotice": function() { return /* binding */ removeNotice; },
/* harmony export */   "removeSettingsSavedNotices": function() { return /* binding */ removeSettingsSavedNotices; },
/* harmony export */   "settingsSavedErrorNotice": function() { return /* binding */ settingsSavedErrorNotice; },
/* harmony export */   "settingsSavedSuccessNotice": function() { return /* binding */ settingsSavedSuccessNotice; }
/* harmony export */ });
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/data */ "@wordpress/data");
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_data__WEBPACK_IMPORTED_MODULE_1__);


function addSuccessNotice(message, id) {
  let icon = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';
  (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_1__.dispatch)('core/notices').createSuccessNotice(message, {
    type: 'snackbar',
    id,
    icon
  });
}
function addErrorNotice(message, id) {
  let icon = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';
  (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_1__.dispatch)('core/notices').createErrorNotice(message, {
    type: 'snackbar',
    id,
    icon
  });
}
function removeNotice(id) {
  (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_1__.dispatch)('core/notices').removeNotice(id);
} // Copied to clipboard notice.

function copiedToClipboardNotice() {
  addSuccessNotice((0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Copied to clipboard', 'wc-ajax-product-filter'), 'copied-to-clipboard');
}
function removeCopiedToClipboardNotice() {
  removeNotice('copied-to-clipboard');
} // Item Create Notices.

const itemCreateErrorNoticeId = 'item-create-error';
function itemCreateErrorNotice(message) {
  addSuccessNotice(message, itemCreateErrorNoticeId, '😟');
}
function removeItemCreateNotice() {
  removeNotice(itemCreateErrorNoticeId);
} // Item deleted notices.

const itemDeletedSuccessNoticeId = 'item-deleted-success';
const itemDeletedErrorNoticeId = 'item-deleted-error';
function itemDeletedSuccessNotice(message) {
  addSuccessNotice(message, itemDeletedSuccessNoticeId, '😵');
}
function itemDeletedErrorNotice(message) {
  addSuccessNotice(message, itemDeletedErrorNoticeId, '😟');
}
function removeItemDeletedNotices() {
  removeNotice(itemDeletedSuccessNoticeId);
  removeNotice(itemDeletedErrorNoticeId);
} // Item duplicated notices.

const itemDuplicatedSuccessNoticeId = 'item-duplicated-success';
const itemDuplicatedErrorNoticeId = 'item-duplicated-error';
function itemDuplicatedSuccessNotice(message) {
  addSuccessNotice(message, itemDuplicatedSuccessNoticeId, '🙌');
}
function itemDuplicatedErrorNotice(message) {
  addSuccessNotice(message, itemDuplicatedErrorNoticeId, '😟');
}
function removeItemDuplicatedNotices() {
  removeNotice(itemDuplicatedSuccessNoticeId);
  removeNotice(itemDuplicatedErrorNoticeId);
} // Item Save Notices.

const itemSaveSuccessNoticeId = 'item-save-success';
const itemSaveErrorNoticeId = 'item-save-error';
function itemSavedSuccessNotice(message) {
  addSuccessNotice(message, itemSaveSuccessNoticeId, '👌');
}
function itemSavedErrorNotice(message) {
  addSuccessNotice(message, itemSaveErrorNoticeId, '😟');
}
function removeItemSavedNotices() {
  removeNotice(itemSaveSuccessNoticeId);
  removeNotice(itemSaveErrorNoticeId);
} // Settings notices.

const settingsSaveSuccessNoticeId = 'settings-save-success';
const settingsSaveErrorNoticeId = 'settings-save-error';
function settingsSavedSuccessNotice(message) {
  addSuccessNotice(message, settingsSaveSuccessNoticeId, '👌');
}
function settingsSavedErrorNotice(message) {
  addSuccessNotice(message, settingsSaveErrorNoticeId, '😟');
}
function removeSettingsSavedNotices() {
  removeNotice(settingsSaveSuccessNoticeId);
  removeNotice(settingsSaveErrorNoticeId);
}

/***/ }),

/***/ "./src/components/useListTable.js":
/*!****************************************!*\
  !*** ./src/components/useListTable.js ***!
  \****************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! axios */ "./node_modules/axios/index.js");
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(axios__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _notices__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./notices */ "./src/components/notices.js");




const useListTable = (dispatch, items, postType) => {
  const [addNewModalOpen, setAddNewModalOpen] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(false);
  const [deleteModalId, setDeleteModalId] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(null);
  const [duplicateModalId, setDuplicateModalId] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(null);
  const [publishModalId, setPublishModalId] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(null);
  const [deletingItemId, setDeletingItemId] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(null);
  const [duplicatingItemId, setDuplicatingItemId] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(null);
  let dispatchType;

  if ('filter' === postType) {
    dispatchType = 'SET_FILTERS';
  } else if ('form' === postType) {
    dispatchType = 'SET_FORMS';
  }

  const handleOpenAddNewModal = () => {
    (0,_notices__WEBPACK_IMPORTED_MODULE_2__.removeItemDeletedNotices)();
    (0,_notices__WEBPACK_IMPORTED_MODULE_2__.removeItemDuplicatedNotices)();
    setAddNewModalOpen(true);
  };

  const handleOpenDeleteModal = id => {
    (0,_notices__WEBPACK_IMPORTED_MODULE_2__.removeItemDeletedNotices)();
    (0,_notices__WEBPACK_IMPORTED_MODULE_2__.removeItemDuplicatedNotices)();
    setDeleteModalId(id);
  };

  const handleCloseDeleteModal = () => {
    setDeleteModalId(null);
  };

  const handleDeleteItem = () => {
    const id = deleteModalId;
    handleCloseDeleteModal();
    setDeletingItemId(id);
    const formData = new FormData();
    formData.append('action', `wcapf_delete_${postType}`);
    formData.append('post_id', id);
    axios__WEBPACK_IMPORTED_MODULE_1___default().post(wcapf_admin_params.ajaxurl, formData).then(res => {
      setDeletingItemId(null);
      const {
        data: {
          data: message,
          success
        }
      } = res;

      if (success) {
        (0,_notices__WEBPACK_IMPORTED_MODULE_2__.itemDeletedSuccessNotice)(message);

        const _items = items.filter(item => item.id !== id);

        dispatch({
          type: dispatchType,
          payload: _items
        });
      } else {
        (0,_notices__WEBPACK_IMPORTED_MODULE_2__.itemDeletedErrorNotice)(message);
      }
    }).catch(err => {
      setDeletingItemId(null);
      (0,_notices__WEBPACK_IMPORTED_MODULE_2__.itemDeletedErrorNotice)(err.message);
    });
  };

  const handleOpenDuplicateModal = id => {
    (0,_notices__WEBPACK_IMPORTED_MODULE_2__.removeItemDeletedNotices)();
    (0,_notices__WEBPACK_IMPORTED_MODULE_2__.removeItemDuplicatedNotices)();
    setDuplicateModalId(id);
  };

  const handleCloseDuplicateModal = () => {
    setDuplicateModalId(null);
  };

  const handleDuplicateItem = () => {
    const id = duplicateModalId;
    handleCloseDuplicateModal();
    setDuplicatingItemId(id);
    const formData = new FormData();
    formData.append('action', `wcapf_duplicate_${postType}`);
    formData.append('post_id', id);
    axios__WEBPACK_IMPORTED_MODULE_1___default().post(wcapf_admin_params.ajaxurl, formData).then(res => {
      setDuplicatingItemId(null);
      const {
        data: {
          data,
          success
        }
      } = res;

      if (success) {
        const {
          message,
          new_post
        } = data;
        (0,_notices__WEBPACK_IMPORTED_MODULE_2__.itemDuplicatedSuccessNotice)(message);
        const _items = [new_post, ...items];
        dispatch({
          type: dispatchType,
          payload: _items
        });
      } else {
        (0,_notices__WEBPACK_IMPORTED_MODULE_2__.itemDuplicatedErrorNotice)(data);
      }
    }).catch(err => {
      setDuplicatingItemId(null);
      (0,_notices__WEBPACK_IMPORTED_MODULE_2__.itemDuplicatedErrorNotice)(err.message);
    });
  };

  const handleOpenPublishModal = id => {
    (0,_notices__WEBPACK_IMPORTED_MODULE_2__.removeItemDeletedNotices)();
    (0,_notices__WEBPACK_IMPORTED_MODULE_2__.removeItemDuplicatedNotices)();
    setPublishModalId(id);
  };

  const handleClosePublishModal = () => {
    (0,_notices__WEBPACK_IMPORTED_MODULE_2__.removeCopiedToClipboardNotice)();
    setPublishModalId(null);
  };

  return {
    addNewModalOpen,
    setAddNewModalOpen,
    handleOpenAddNewModal,
    deleteModalId,
    handleOpenDeleteModal,
    handleCloseDeleteModal,
    handleDeleteItem,
    duplicateModalId,
    handleOpenDuplicateModal,
    handleCloseDuplicateModal,
    handleDuplicateItem,
    publishModalId,
    handleOpenPublishModal,
    handleClosePublishModal,
    deletingItemId,
    duplicatingItemId
  };
};

/* harmony default export */ __webpack_exports__["default"] = (useListTable);

/***/ }),

/***/ "./src/components/utils.js":
/*!*********************************!*\
  !*** ./src/components/utils.js ***!
  \*********************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "foundProVersion": function() { return /* binding */ foundProVersion; },
/* harmony export */   "getAdditionalData": function() { return /* binding */ getAdditionalData; },
/* harmony export */   "getAvailableFilters": function() { return /* binding */ getAvailableFilters; },
/* harmony export */   "getEditFilterLink": function() { return /* binding */ getEditFilterLink; },
/* harmony export */   "getEditFormLink": function() { return /* binding */ getEditFormLink; },
/* harmony export */   "getFiltersPageLink": function() { return /* binding */ getFiltersPageLink; },
/* harmony export */   "getFormsPageLink": function() { return /* binding */ getFormsPageLink; },
/* harmony export */   "getNoOfMaxTermsToRender": function() { return /* binding */ getNoOfMaxTermsToRender; },
/* harmony export */   "getSettingsPageLink": function() { return /* binding */ getSettingsPageLink; },
/* harmony export */   "getTimeoutForRemovingMediaFrames": function() { return /* binding */ getTimeoutForRemovingMediaFrames; },
/* harmony export */   "isProFeature": function() { return /* binding */ isProFeature; },
/* harmony export */   "pluginVersion": function() { return /* binding */ pluginVersion; },
/* harmony export */   "proTag": function() { return /* binding */ proTag; },
/* harmony export */   "removeMediaFrames": function() { return /* binding */ removeMediaFrames; },
/* harmony export */   "slugify": function() { return /* binding */ slugify; },
/* harmony export */   "upgradeToProLink": function() { return /* binding */ upgradeToProLink; }
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! axios */ "./node_modules/axios/index.js");
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(axios__WEBPACK_IMPORTED_MODULE_1__);


function foundProVersion() {
  // return wcapf_admin_params.foundPro;
  return false;
} // To disable the input element.

function isProFeature(isProFeature) {
  if (foundProVersion()) {
    return false;
  }

  if (!isProFeature) {
    return false;
  }

  return true;
}
function proTag(isProFeature) {
  if (foundProVersion()) {
    return '';
  }

  if (!isProFeature) {
    return '';
  }

  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
    className: "__pro_tag"
  });
}
function upgradeToProLink() {
  return '#';
}
function pluginVersion() {
  return wcapf_admin_params.version;
}
function getAdditionalData() {
  const data = {
    action: 'get_filter_additional_data'
  };
  return axios__WEBPACK_IMPORTED_MODULE_1___default().get(wcapf_admin_params.ajaxurl, {
    params: data
  });
}
function getAvailableFilters() {
  const data = {
    action: 'wcapf_get_available_filters'
  };
  return axios__WEBPACK_IMPORTED_MODULE_1___default().get(wcapf_admin_params.ajaxurl, {
    params: data
  });
}
function getFiltersPageLink() {
  return wcapf_admin_params.filters_page_link;
}
function getEditFilterLink(filterId) {
  return getFiltersPageLink() + '&id=' + filterId;
}
function getFormsPageLink() {
  return wcapf_admin_params.forms_page_link;
}
function getEditFormLink(formId) {
  return getFormsPageLink() + '&id=' + formId;
}
function getSettingsPageLink() {
  return wcapf_admin_params.settings_page_link;
}
function slugify(value) {
  return '__' + value.replace(/ /g, '_');
}
function getNoOfMaxTermsToRender() {
  const maxItems = parseInt(wcapf_admin_params.max_items_in_custom_appearance_modal) || 99;
  return maxItems < 1 ? 99 : maxItems;
}
function getTimeoutForRemovingMediaFrames() {
  const timeout = parseInt(wcapf_admin_params.timeout_for_cleaning_wp_media_frames) || 100;
  return timeout < 99 ? 100 : timeout;
} // Causing too many media frame instances at every render.

function removeMediaFrames(timeout) {
  const $ = jQuery;
  $('body').children('button.browser').remove();
  $('body').children('div[id^="__wp-uploader-id"]').remove();
  setTimeout(() => {
    $('body').children('div.wp-uploader-browser').remove();
  }, timeout);
}

/***/ }),

/***/ "./node_modules/classnames/index.js":
/*!******************************************!*\
  !*** ./node_modules/classnames/index.js ***!
  \******************************************/
/***/ (function(module, exports) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/*!
  Copyright (c) 2018 Jed Watson.
  Licensed under the MIT License (MIT), see
  http://jedwatson.github.io/classnames
*/
/* global define */

(function () {
	'use strict';

	var hasOwn = {}.hasOwnProperty;

	function classNames() {
		var classes = [];

		for (var i = 0; i < arguments.length; i++) {
			var arg = arguments[i];
			if (!arg) continue;

			var argType = typeof arg;

			if (argType === 'string' || argType === 'number') {
				classes.push(arg);
			} else if (Array.isArray(arg)) {
				if (arg.length) {
					var inner = classNames.apply(null, arg);
					if (inner) {
						classes.push(inner);
					}
				}
			} else if (argType === 'object') {
				if (arg.toString === Object.prototype.toString) {
					for (var key in arg) {
						if (hasOwn.call(arg, key) && arg[key]) {
							classes.push(key);
						}
					}
				} else {
					classes.push(arg.toString());
				}
			}
		}

		return classes.join(' ');
	}

	if ( true && module.exports) {
		classNames.default = classNames;
		module.exports = classNames;
	} else if (true) {
		// register as 'classnames', consistent with npm package name
		!(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = (function () {
			return classNames;
		}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	} else {}
}());


/***/ }),

/***/ "./src/list-filters.scss":
/*!*******************************!*\
  !*** ./src/list-filters.scss ***!
  \*******************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "lodash":
/*!*************************!*\
  !*** external "lodash" ***!
  \*************************/
/***/ (function(module) {

"use strict";
module.exports = window["lodash"];

/***/ }),

/***/ "@wordpress/components":
/*!************************************!*\
  !*** external ["wp","components"] ***!
  \************************************/
/***/ (function(module) {

"use strict";
module.exports = window["wp"]["components"];

/***/ }),

/***/ "@wordpress/data":
/*!******************************!*\
  !*** external ["wp","data"] ***!
  \******************************/
/***/ (function(module) {

"use strict";
module.exports = window["wp"]["data"];

/***/ }),

/***/ "@wordpress/element":
/*!*********************************!*\
  !*** external ["wp","element"] ***!
  \*********************************/
/***/ (function(module) {

"use strict";
module.exports = window["wp"]["element"];

/***/ }),

/***/ "@wordpress/i18n":
/*!******************************!*\
  !*** external ["wp","i18n"] ***!
  \******************************/
/***/ (function(module) {

"use strict";
module.exports = window["wp"]["i18n"];

/***/ }),

/***/ "@wordpress/notices":
/*!*********************************!*\
  !*** external ["wp","notices"] ***!
  \*********************************/
/***/ (function(module) {

"use strict";
module.exports = window["wp"]["notices"];

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/extends.js":
/*!************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/extends.js ***!
  \************************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ _extends; }
/* harmony export */ });
function _extends() {
  _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  return _extends.apply(this, arguments);
}

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	!function() {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = function(module) {
/******/ 			var getter = module && module.__esModule ?
/******/ 				function() { return module['default']; } :
/******/ 				function() { return module; };
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	!function() {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = function(exports, definition) {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	!function() {
/******/ 		__webpack_require__.o = function(obj, prop) { return Object.prototype.hasOwnProperty.call(obj, prop); }
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	!function() {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = function(exports) {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	}();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
!function() {
"use strict";
/*!*****************************!*\
  !*** ./src/list-filters.js ***!
  \*****************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _list_filters_scss__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./list-filters.scss */ "./src/list-filters.scss");
/* harmony import */ var _components_ListFilters_ListFiltersContext__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./components/ListFilters/ListFiltersContext */ "./src/components/ListFilters/ListFiltersContext.js");
/* harmony import */ var _components_ListFilters__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./components/ListFilters */ "./src/components/ListFilters/index.js");






const App = () => {
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_components_ListFilters_ListFiltersContext__WEBPACK_IMPORTED_MODULE_2__.ListFiltersProvider, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_components_ListFilters__WEBPACK_IMPORTED_MODULE_3__["default"], null));
};

document.addEventListener('DOMContentLoaded', () => {
  const renderElementInstance = document.getElementById('wcapf-filters-list-admin-ui');

  if (renderElementInstance) {
    (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.render)((0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.StrictMode, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(App, null)), renderElementInstance);
  }
});
}();
/******/ })()
;
//# sourceMappingURL=list-filters.js.map