/******/ (function() { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/@wordpress/icons/build-module/library/trash.js":
/*!*********************************************************************!*\
  !*** ./node_modules/@wordpress/icons/build-module/library/trash.js ***!
  \*********************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_primitives__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/primitives */ "@wordpress/primitives");
/* harmony import */ var _wordpress_primitives__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_primitives__WEBPACK_IMPORTED_MODULE_1__);


/**
 * WordPress dependencies
 */

const trash = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_primitives__WEBPACK_IMPORTED_MODULE_1__.SVG, {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 24 24"
}, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_primitives__WEBPACK_IMPORTED_MODULE_1__.Path, {
  d: "M20 5h-5.7c0-1.3-1-2.3-2.3-2.3S9.7 3.7 9.7 5H4v2h1.5v.3l1.7 11.1c.1 1 1 1.7 2 1.7h5.7c1 0 1.8-.7 2-1.7l1.7-11.1V7H20V5zm-3.2 2l-1.7 11.1c0 .1-.1.2-.3.2H9.1c-.1 0-.3-.1-.3-.2L7.2 7h9.6z"
}));
/* harmony default export */ __webpack_exports__["default"] = (trash);
//# sourceMappingURL=trash.js.map

/***/ }),

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

/***/ "./src/components/AvailableFilters.js":
/*!********************************************!*\
  !*** ./src/components/AvailableFilters.js ***!
  \********************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _Filter_utils__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./Filter/utils */ "./src/components/Filter/utils.js");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./utils */ "./src/components/utils.js");






const AvailableFilters = _ref => {
  let {
    filterType,
    handleSetFilterType
  } = _ref;
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "__available_filters"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "__inner"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("p", {
    className: "description"
  }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Select a component to start building the filter.', 'wc-ajax-product-filter')), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "__filters"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.NavigableMenu, {
    role: 'menu',
    orientation: "horizontal"
  }, (0,_Filter_utils__WEBPACK_IMPORTED_MODULE_3__.availableFilters)().map(filter => {
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
  })))), description ? (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("p", {
    className: "description"
  }, description) : '');
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
  }, option.label)))))))), description ? (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("p", {
    className: "description"
  }, description) : '');
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
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)("input", (0,_babel_runtime_helpers_extends__WEBPACK_IMPORTED_MODULE_0__["default"])({
    type: type,
    id: id,
    className: "components-text-control__input",
    value: value,
    onChange: e => onChange(e, id)
  }, rest))))), description ? (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)("p", {
    className: "description"
  }, description) : '');
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



const Text = _ref => {
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
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)("input", (0,_babel_runtime_helpers_extends__WEBPACK_IMPORTED_MODULE_0__["default"])({
    type: type,
    id: id,
    className: "components-text-control__input",
    value: value,
    onChange: e => onChange(e, id)
  }, rest))))), description ? (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)("p", {
    className: "description"
  }, description) : '');
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
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../utils */ "./src/components/utils.js");





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
  }, label, (0,_utils__WEBPACK_IMPORTED_MODULE_3__.proTag)(isPro))), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "__wrapper"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "__input_wrapper"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.ButtonGroup, null, options.map(option => (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Button, {
    value: option.value,
    key: `fradio-group-${id}-${option.value}`,
    onClick: () => onChange(option.value, id),
    variant: value === option.value ? 'primary' : ''
  }, option.label)))))), description ? (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("p", {
    className: "description"
  }, description) : '');
};

/* harmony default export */ __webpack_exports__["default"] = (ToggleGroup);

/***/ }),

/***/ "./src/components/Filter/FilterNav/FilterUI/FilterKey.js":
/*!***************************************************************!*\
  !*** ./src/components/Filter/FilterNav/FilterUI/FilterKey.js ***!
  \***************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _babel_runtime_helpers_extends__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/extends */ "./node_modules/@babel/runtime/helpers/esm/extends.js");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__);




const FilterKey = _ref => {
  let {
    label,
    id,
    value,
    onChange,
    description,
    type = 'text',
    isFilterKeyChecking,
    ...rest
  } = _ref;
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)("div", {
    className: "__form_control __filter_key"
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
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)("input", (0,_babel_runtime_helpers_extends__WEBPACK_IMPORTED_MODULE_0__["default"])({
    type: type,
    id: id,
    className: "components-text-control__input",
    value: value,
    onChange: onChange
  }, rest)), isFilterKeyChecking && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Spinner, null)))), description ? (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)("p", {
    className: "description"
  }, description) : '');
};

/* harmony default export */ __webpack_exports__["default"] = (FilterKey);

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
/* harmony import */ var _sindresorhus_slugify__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @sindresorhus/slugify */ "./node_modules/@sindresorhus/slugify/index.js");
/* harmony import */ var _Field_Listbox__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../Field/Listbox */ "./src/components/Field/Listbox.js");
/* harmony import */ var _FilterKey__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./FilterKey */ "./src/components/Filter/FilterNav/FilterUI/FilterKey.js");
/* harmony import */ var _Field_ToggleGroup__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../../Field/ToggleGroup */ "./src/components/Field/ToggleGroup.js");
/* harmony import */ var _Field_Checkbox__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../../Field/Checkbox */ "./src/components/Field/Checkbox.js");
/* harmony import */ var _useFilterData__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../useFilterData */ "./src/components/Filter/useFilterData.js");
/* harmony import */ var _Field_Number__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../../Field/Number */ "./src/components/Field/Number.js");










const GeneralFields = _ref => {
  var _activeFilterData$fie;

  let {
    isFilterKeyChecking,
    filterType,
    activeFilterData,
    filterKeys,
    additionalData,
    dispatch
  } = _ref;
  const {
    handleCheckboxChange,
    handleToggleGroupChange,
    handleTextFieldChange
  } = (0,_useFilterData__WEBPACK_IMPORTED_MODULE_7__["default"])(activeFilterData, dispatch);
  const {
    value_type,
    value_decimal,
    value_decimal_places
  } = activeFilterData;
  const filterKey = (_activeFilterData$fie = activeFilterData['field_key']) !== null && _activeFilterData$fie !== void 0 ? _activeFilterData$fie : '';

  const handleTaxonomyChange = value => {
    if (!value) {
      const _activeFilterData = { ...activeFilterData,
        field_key: '',
        taxonomy: ''
      };
      dispatch({
        type: 'SET_ACTIVE_FILTER_DATA',
        payload: _activeFilterData
      });
      return;
    }

    const type = activeFilterData['type'];
    const filterKey = filterKeys[type][value];
    const _activeFilterData = { ...activeFilterData,
      field_key: filterKey,
      taxonomy: value
    };
    dispatch({
      type: 'SET_ACTIVE_FILTER_DATA',
      payload: _activeFilterData
    });
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

      return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_Field_Listbox__WEBPACK_IMPORTED_MODULE_3__["default"], {
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
    if (!value) {
      const _activeFilterData = { ...activeFilterData,
        field_key: '',
        meta_key: ''
      };
      dispatch({
        type: 'SET_ACTIVE_FILTER_DATA',
        payload: _activeFilterData
      });
      return;
    }

    const type = activeFilterData['type'];
    const filterKey = filterKeys[type][value];
    const _activeFilterData = { ...activeFilterData,
      field_key: filterKey,
      meta_key: value
    };
    dispatch({
      type: 'SET_ACTIVE_FILTER_DATA',
      payload: _activeFilterData
    });
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

      return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_Field_Listbox__WEBPACK_IMPORTED_MODULE_3__["default"], {
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
    if (!value) {
      const _activeFilterData = { ...activeFilterData,
        field_key: '',
        post_property: ''
      };
      dispatch({
        type: 'SET_ACTIVE_FILTER_DATA',
        payload: _activeFilterData
      });
      return;
    }

    const type = activeFilterData['type'];
    const filterKey = filterKeys[type][value];
    const _activeFilterData = { ...activeFilterData,
      field_key: filterKey,
      post_property: value
    };
    dispatch({
      type: 'SET_ACTIVE_FILTER_DATA',
      payload: _activeFilterData
    });
  };

  const postPropertyField = () => {
    if ('post-property' === filterType) {
      const postProperty = activeFilterData['post_property'];
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

      return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_Field_Listbox__WEBPACK_IMPORTED_MODULE_3__["default"], {
        label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Post Property', 'wc-ajax-product-filter'),
        description: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Select the post property that values will be available as filter options.', 'wc-ajax-product-filter'),
        id: 'post_property',
        options: options,
        value: postProperty,
        onChange: handlePostPropertyChange,
        searchable: false
      });
    }
  };

  const handleFilterKeyChange = e => {
    // TODO: Check for default filter key change.
    console.log('onChange event'); // Slugify the filter key.

    const _filterKey = (0,_sindresorhus_slugify__WEBPACK_IMPORTED_MODULE_2__["default"])(e.target.value, {
      preserveLeadingUnderscore: true,
      preserveTrailingDash: true,
      separator: '_'
    });

    const _activeFilterData = { ...activeFilterData,
      field_key: _filterKey
    };
    dispatch({
      type: 'SET_ACTIVE_FILTER_DATA',
      payload: _activeFilterData
    });

    if ('custom-taxonomy' === filterType || 'attribute' === filterType) {
      const taxonomy = activeFilterData['taxonomy'];

      let _filterKeys;

      if ('attribute' === filterType) {
        _filterKeys = { ...filterKeys,
          attribute: { ...filterKeys['attribute'],
            [taxonomy]: _filterKey
          }
        };
      } else {
        _filterKeys = { ...filterKeys,
          'custom-taxonomy': { ...filterKeys['custom-taxonomy'],
            [taxonomy]: _filterKey
          }
        };
      }

      dispatch({
        type: 'SET_FILTER_KEYS',
        payload: _filterKeys
      });
    }
  };

  const filterKeyField = () => {
    if ('active-filters' !== filterType && 'reset-button' !== filterType) {
      return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_FilterKey__WEBPACK_IMPORTED_MODULE_4__["default"], {
        id: 'filter_key',
        label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Filter Key', 'wc-ajax-product-filter'),
        description: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('The unique key that will be used to identify the filter.', 'wc-ajax-product-filter'),
        value: filterKey,
        onChange: handleFilterKeyChange,
        isFilterKeyChecking: isFilterKeyChecking
      });
    }
  };

  const valueTypeField = () => {
    if ('post-meta' === filterType) {
      return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_Field_ToggleGroup__WEBPACK_IMPORTED_MODULE_5__["default"], {
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
      return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_Field_Checkbox__WEBPACK_IMPORTED_MODULE_6__["default"], {
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
      return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_Field_Number__WEBPACK_IMPORTED_MODULE_8__["default"], {
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
const useFilterData = (activeFilterData, dispatch) => {
  const handleRadioChange = (e, key) => {
    const value = e.target.value;
    dispatch({
      type: 'SET_ACTIVE_FILTER_DATA',
      payload: { ...activeFilterData,
        [key]: value
      }
    });
  };

  const handleCheckboxChange = (value, key) => {
    const _value = value ? '1' : '';

    dispatch({
      type: 'SET_ACTIVE_FILTER_DATA',
      payload: { ...activeFilterData,
        [key]: _value
      }
    });
  };

  const handleTextFieldChange = (e, key) => {
    const value = e.target.value;
    dispatch({
      type: 'SET_ACTIVE_FILTER_DATA',
      payload: { ...activeFilterData,
        [key]: value
      }
    });
  };

  const handleToggleGroupChange = (value, key) => {
    dispatch({
      type: 'SET_ACTIVE_FILTER_DATA',
      payload: { ...activeFilterData,
        [key]: value
      }
    });
  };

  const handleDropdownChange = (selectedItem, key) => {
    dispatch({
      type: 'SET_ACTIVE_FILTER_DATA',
      payload: { ...activeFilterData,
        [key]: selectedItem.key
      }
    });
  };

  return {
    handleRadioChange,
    handleCheckboxChange,
    handleTextFieldChange,
    handleToggleGroupChange,
    handleDropdownChange
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
/* harmony export */   "availableFilters": function() { return /* binding */ availableFilters; },
/* harmony export */   "dateDisplayTypes": function() { return /* binding */ dateDisplayTypes; },
/* harmony export */   "filterDefaultData": function() { return /* binding */ filterDefaultData; },
/* harmony export */   "getFilterDefaultData": function() { return /* binding */ getFilterDefaultData; },
/* harmony export */   "getOptionsTableModalData": function() { return /* binding */ getOptionsTableModalData; },
/* harmony export */   "getTableData": function() { return /* binding */ getTableData; },
/* harmony export */   "isTaxonomyFilters": function() { return /* binding */ isTaxonomyFilters; },
/* harmony export */   "numberDisplayTypes": function() { return /* binding */ numberDisplayTypes; },
/* harmony export */   "orderByOptions": function() { return /* binding */ orderByOptions; },
/* harmony export */   "orderDirectionOptions": function() { return /* binding */ orderDirectionOptions; },
/* harmony export */   "orderTypeOptions": function() { return /* binding */ orderTypeOptions; },
/* harmony export */   "productStatusOptions": function() { return /* binding */ productStatusOptions; },
/* harmony export */   "sanitizeFilterData": function() { return /* binding */ sanitizeFilterData; },
/* harmony export */   "taxonomyLimitByOptions": function() { return /* binding */ taxonomyLimitByOptions; },
/* harmony export */   "termsOrderByOptions": function() { return /* binding */ termsOrderByOptions; },
/* harmony export */   "textDisplayTypes": function() { return /* binding */ textDisplayTypes; }
/* harmony export */ });
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! lodash */ "lodash");
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(lodash__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../utils */ "./src/components/utils.js");



function availableFilters() {
  return [{
    title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Active Filters', 'wc-ajax-product-filter'),
    type: 'active-filters'
  }, {
    title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Category', 'wc-ajax-product-filter'),
    type: 'category',
    defaultFilterKey: '_product_cat'
  }, {
    title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Tag', 'wc-ajax-product-filter'),
    type: 'tag',
    defaultFilterKey: '_product_tag'
  }, {
    title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Attribute', 'wc-ajax-product-filter'),
    type: 'attribute'
  }, {
    title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Price', 'wc-ajax-product-filter'),
    type: 'price',
    defaultFilterKey: '_price'
  }, {
    title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Rating', 'wc-ajax-product-filter'),
    type: 'rating',
    defaultFilterKey: '_rating'
  }, {
    title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Product Status', 'wc-ajax-product-filter'),
    type: 'product-status',
    defaultFilterKey: '_status'
  }, {
    title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Post Property', 'wc-ajax-product-filter'),
    type: 'post-property',
    isPro: true
  }, {
    title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Custom Taxonomy', 'wc-ajax-product-filter'),
    type: 'custom-taxonomy',
    isPro: true
  }, {
    title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Post Meta', 'wc-ajax-product-filter'),
    type: 'post-meta',
    isPro: true
  }, {
    title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Sort by', 'wc-ajax-product-filter'),
    type: 'sort-by',
    defaultFilterKey: '_sort_by',
    isPro: true
  }, {
    title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Per page', 'wc-ajax-product-filter'),
    type: 'per-page',
    defaultFilterKey: '_per_page',
    isPro: true
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
    exclude_values_id: '',
    show_clear_button: '',
    order_terms_by: 'default',
    order_terms_dir: 'asc',
    enable_accordion: '',
    accordion_default_state: 'expanded',
    enable_soft_limit: '',
    soft_limit: '5',
    type: '',
    field_id: '',
    enable_visibility_rules: '',
    visibility_rules: [],
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
    max_value: '1000',
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
    options_order_by: 'value',
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
    // Sort By
    sort_by_options: [],
    // Reset Button
    reset_button_label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Reset', 'wc-ajax-product-filter')
  };
}

function ratingDefaultData() {
  return {
    options_order_dir: 'desc'
  };
}

function perPageDefaultData() {
  return {
    display_type: 'radio',
    min_value: '25',
    max_value: '100',
    step: '25'
  };
} // Sanitize the filter data.


function sanitizeFilterData(activeFilterData) {
  if (!activeFilterData.order_terms_dir) {
    activeFilterData.order_terms_dir = 'asc';
  }

  if (!activeFilterData.options_order_dir) {
    activeFilterData.options_order_dir = 'asc';
  }

  if (!activeFilterData.options_order_type) {
    activeFilterData.options_order_type = 'alphabetical';
  }

  return activeFilterData;
}
function getFilterDefaultData(type) {
  const defaultData = filterDefaultData();
  const filterData = (0,lodash__WEBPACK_IMPORTED_MODULE_1__.find)(availableFilters(), {
    type
  });
  const defaultFilterKey = filterData.defaultFilterKey;

  if (defaultFilterKey) {
    return { ...defaultData,
      type,
      field_key: defaultFilterKey
    };
  }

  return { ...defaultData,
    type
  };
}
function taxonomyLimitByOptions() {
  return [{
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Off', 'wc-ajax-product-filter'),
    value: 'off'
  }, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Include terms', 'wc-ajax-product-filter'),
    value: 'include'
  }, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Exclude terms', 'wc-ajax-product-filter'),
    value: 'exclude'
  }, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Child of', 'wc-ajax-product-filter'),
    value: 'child',
    isPro: true
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
function productStatusOptions() {
  return [{
    key: 'featured',
    name: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Featured', 'wc-ajax-product-filter')
  }, {
    key: 'on_sale',
    name: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('On Sale', 'wc-ajax-product-filter')
  }];
}
function textDisplayTypes() {
  let withPro = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
  const options = [{
    name: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Checkbox', 'wc-ajax-product-filter'),
    key: 'checkbox'
  }, {
    name: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Radio', 'wc-ajax-product-filter'),
    key: 'radio'
  }, {
    name: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Select', 'wc-ajax-product-filter'),
    key: 'select'
  }, {
    name: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Multi select', 'wc-ajax-product-filter'),
    key: 'multi-select'
  }, {
    name: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Label', 'wc-ajax-product-filter'),
    key: 'label'
  }, {
    name: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Color', 'wc-ajax-product-filter'),
    key: 'color'
  }, {
    name: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Image', 'wc-ajax-product-filter'),
    key: 'image'
  }];

  if (withPro && !(0,_utils__WEBPACK_IMPORTED_MODULE_2__.foundProVersion)()) {
    const proDisplayTypes = ['color', 'image'];
    return options.map(option => {
      if (!proDisplayTypes.includes(option.key)) {
        return option;
      } else {
        option.__experimentalHint = 'Pro';
        return option;
      }
    });
  }

  return options;
}
function numberDisplayTypes() {
  let withPro = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
  const options = [{
    name: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Range - Slider', 'wc-ajax-product-filter'),
    key: 'range_slider'
  }, {
    name: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Range - Number', 'wc-ajax-product-filter'),
    key: 'range_number'
  }, {
    name: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Range - Checkbox', 'wc-ajax-product-filter'),
    key: 'range_checkbox'
  }, {
    name: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Range - Radio', 'wc-ajax-product-filter'),
    key: 'range_radio'
  }, {
    name: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Range - Select', 'wc-ajax-product-filter'),
    key: 'range_select'
  }, {
    name: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Range - Multiselect', 'wc-ajax-product-filter'),
    key: 'range_multiselect'
  }, {
    name: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Range - Label', 'wc-ajax-product-filter'),
    key: 'range_label'
  }];

  if (withPro && !(0,_utils__WEBPACK_IMPORTED_MODULE_2__.foundProVersion)()) {
    const allowed = ['range_slider', 'range_number'];
    return options.map(option => {
      if (allowed.includes(option.key)) {
        return option;
      } else {
        option.__experimentalHint = 'Pro';
        return option;
      }
    });
  }

  return options;
}
function dateDisplayTypes() {
  return [{
    name: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Input - Date', 'wc-ajax-product-filter'),
    key: 'input_date'
  }, {
    name: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Input - Date Range', 'wc-ajax-product-filter'),
    key: 'input_date_range'
  }, {
    name: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Time Period - Checkbox', 'wc-ajax-product-filter'),
    key: 'time_period_checkbox'
  }, {
    name: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Time Period - Radio', 'wc-ajax-product-filter'),
    key: 'time_period_radio'
  }, {
    name: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Time Period - Select', 'wc-ajax-product-filter'),
    key: 'time_period_select'
  }, {
    name: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Time Period - Multi select', 'wc-ajax-product-filter'),
    key: 'time_period_multiselect'
  }, {
    name: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Time Period - Label', 'wc-ajax-product-filter'),
    key: 'time_period_label'
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

  if (isTaxonomyFilters(filterType)) {
    type = 'taxonomy-options';
    optionsKey = 'manual_options';
  } else if ('price' === filterType || 'rating' === filterType) {
    type = 'number-options';
    optionsKey = 'number_manual_options';
  } else if ('product-status' === filterType) {
    type = 'product-status-options';
    optionsKey = 'product_status_options';
  } else if ('post-meta' === filterType) {
    if ('text' === value_type) {
      type = 'text-options';
    } else if ('number' === value_type) {
      type = 'number-options';
      optionsKey = 'number_manual_options';
    } else if ('date' === value_type) {
      type = 'time-period-options';
      optionsKey = 'time_period_options';
    }
  }

  return {
    type,
    optionsKey
  };
}
function getOptionsTableModalData(filterType, activeFilterData) {
  let keyword;
  let type;
  let optionsKey;
  let ajaxParams;

  if (isTaxonomyFilters(filterType)) {
    type = 'taxonomy';
    optionsKey = 'manual_options';

    if ('category' === filterType) {
      keyword = 'product_cat';
    } else if ('tag' === filterType) {
      keyword = 'product_tag';
    } else if ('attribute' === filterType || 'custom-taxonomy' === filterType) {
      keyword = activeFilterData.taxonomy;
    }

    ajaxParams = {
      action: 'get_taxonomy_filter_options',
      taxonomy: keyword
    };
  }

  return {
    keyword,
    type,
    optionsKey,
    ajaxParams
  };
}

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
/* harmony import */ var _AvailableFilters__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../AvailableFilters */ "./src/components/AvailableFilters.js");
/* harmony import */ var _Field_Text__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../Field/Text */ "./src/components/Field/Text.js");
/* harmony import */ var _Filter_FilterNav_FilterUI_GeneralFields__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../Filter/FilterNav/FilterUI/GeneralFields */ "./src/components/Filter/FilterNav/FilterUI/GeneralFields.js");
/* harmony import */ var _Filter_utils__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../Filter/utils */ "./src/components/Filter/utils.js");
/* harmony import */ var _ListFiltersContext__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../ListFiltersContext */ "./src/components/ListFilters/ListFiltersContext.js");








const Body = _ref => {
  let {
    step,
    setTotalSteps
  } = _ref;
  const {
    state: {
      isFilterKeyChecking,
      title,
      filterType,
      activeFilterData,
      filterKeys,
      additionalData,
      filtersData
    },
    dispatch
  } = (0,_ListFiltersContext__WEBPACK_IMPORTED_MODULE_6__.useListFilters)();

  const handleTitleChange = e => {
    const {
      target: {
        value
      }
    } = e;
    dispatch({
      type: 'SET_TITLE',
      payload: value
    });
  };

  const handleSetFilterType = filter => {
    const _filterType = filter.type;

    if (_filterType === filterType) {
      return;
    }

    if ('active-filters' === _filterType || 'reset-button' === _filterType) {
      setTotalSteps(2);
    } else {
      setTotalSteps(3);
    }

    dispatch({
      type: 'SET_FILTER_TYPE',
      payload: _filterType
    });
    let filterData = filtersData[_filterType];

    if (!filterData) {
      filterData = (0,_Filter_utils__WEBPACK_IMPORTED_MODULE_5__.getFilterDefaultData)(_filterType);
    }

    dispatch({
      type: 'SET_ACTIVE_FILTER_DATA',
      payload: filterData
    });
    const _filtersData = { ...filtersData,
      [filterType]: activeFilterData
    };
    dispatch({
      type: 'SET_FILTERS_DATA',
      payload: _filtersData
    });
  };

  let content;

  if (1 === step) {
    content = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: "__step_inner __title_step"
    }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_Field_Text__WEBPACK_IMPORTED_MODULE_3__["default"], {
      id: 'filter_title',
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Filter Title', 'wc-ajax-product-filter'),
      placeholder: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Enter filter title', 'wc-ajax-product-filter'),
      value: title,
      onChange: handleTitleChange
    }));
  } else if (2 === step) {
    content = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_AvailableFilters__WEBPACK_IMPORTED_MODULE_2__["default"], {
      filterType: filterType,
      handleSetFilterType: handleSetFilterType
    });
  } else if (3 === step) {
    content = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: "__step_inner"
    }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_Filter_FilterNav_FilterUI_GeneralFields__WEBPACK_IMPORTED_MODULE_4__["default"], {
      isFilterKeyChecking: isFilterKeyChecking,
      filterType: filterType,
      activeFilterData: activeFilterData,
      filterKeys: filterKeys,
      additionalData: additionalData,
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
/* harmony import */ var _ListFiltersContext__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../ListFiltersContext */ "./src/components/ListFilters/ListFiltersContext.js");
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! classnames */ "./node_modules/classnames/index.js");
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(classnames__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../utils */ "./src/components/utils.js");







const Footer = _ref => {
  let {
    step,
    setStep,
    totalSteps,
    closeModal,
    handleFilterSubmit
  } = _ref;
  const {
    state: {
      isFilterKeyChecking,
      title,
      filterType,
      activeFilterData
    }
  } = (0,_ListFiltersContext__WEBPACK_IMPORTED_MODULE_3__.useListFilters)();

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
        if (isFilterKeyChecking) {
          disabled = true;
        } else {
          disabled = (0,_utils__WEBPACK_IMPORTED_MODULE_5__.disableFilterHandling)(activeFilterData);
        }
      }

      content = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Button, {
        variant: "primary",
        onClick: handleFilterSubmit,
        disabled: disabled
      }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Finish', 'wc-ajax-product-filter'));
    }

    return content;
  };

  const dots = () => {
    return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: "_dots"
    }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
      className: classnames__WEBPACK_IMPORTED_MODULE_4___default()({
        active: 1 === step
      })
    }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
      className: classnames__WEBPACK_IMPORTED_MODULE_4___default()({
        active: 2 === step
      })
    }), 3 === totalSteps && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
      className: classnames__WEBPACK_IMPORTED_MODULE_4___default()({
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
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _Footer__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./Footer */ "./src/components/ListFilters/AddNewModal/Footer.js");
/* harmony import */ var _Body__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./Body */ "./src/components/ListFilters/AddNewModal/Body.js");
/* harmony import */ var _ListFiltersContext__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../ListFiltersContext */ "./src/components/ListFilters/ListFiltersContext.js");
/* harmony import */ var _Filter_utils__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../Filter/utils */ "./src/components/Filter/utils.js");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../utils */ "./src/components/utils.js");










const AddNewModal = _ref => {
  let {
    isOpen,
    closeModal,
    step,
    setStep,
    totalSteps,
    setTotalSteps,
    loading,
    setLoading,
    handleFilterSubmit,
    addPostModalContent
  } = _ref;
  const {
    dispatch
  } = (0,_ListFiltersContext__WEBPACK_IMPORTED_MODULE_5__.useListFilters)();
  const modalRef = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useRef)(null); // Reset the modal.

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
  }, [step]);
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    if (!isOpen) {
      return;
    }

    (0,_utils__WEBPACK_IMPORTED_MODULE_7__.getAdditionalData)().then(res => {
      const {
        data: {
          data: additionalData
        }
      } = res;
      dispatch({
        type: 'SET_ADDITIONAL_DATA',
        payload: additionalData
      });
      let activeFilterData = {};
      let filterType = '';
      let filterKey = '';
      /**
       * Sets the default filter keys.
       */

      const filterKeys = {};
      (0,_Filter_utils__WEBPACK_IMPORTED_MODULE_6__.availableFilters)().map(item => {
        const type = item.type;

        if ('active-filters' === type || 'reset-button' === type) {
          return false;
        }

        if ('attribute' === type || 'custom-taxonomy' === type || 'post-meta' === type || 'post-property' === type) {
          let data = {};

          if ('attribute' === type) {
            data = additionalData['attributes'];
          } else if ('custom-taxonomy' === type) {
            data = additionalData['custom_taxonomies'];
          } else if ('post-meta' === type) {
            data = additionalData['meta_keys'];
          } else if ('post-property' === type) {
            data = additionalData['post_properties'];
          }

          const _filterKeys = {};

          for (const item in data) {
            let _filterKey = `_${item}`;

            if (filterType === type) {
              let selected = '';

              if ('attribute' === type || 'custom-taxonomy' === type) {
                selected = activeFilterData['taxonomy'];
              } else if (true) {
                selected = activeFilterData['meta_key'];
              } else {}

              if (item === selected) {
                _filterKey = filterKey;
              }
            }

            _filterKeys[item] = _filterKey;
          }

          filterKeys[type] = _filterKeys;
        } else {
          let defaultFilterKey = item.defaultFilterKey;

          if (filterType === type) {
            defaultFilterKey = filterKey;
          }

          filterKeys[type] = defaultFilterKey;
        }
      });
      dispatch({
        type: 'SET_FILTER_KEYS',
        payload: filterKeys
      });
      setLoading(false);
    }).catch(err => console.log(err));
  }, [isOpen]);
  return isOpen && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.Modal, {
    className: "__add_filter_modal",
    onRequestClose: closeModal,
    ref: modalRef,
    __experimentalHideHeader: true
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "__add_post_modal"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("h3", {
    className: "__heading"
  }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Add Filter', 'wc-ajax-product-filter')), loading ? (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "__loader"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.Spinner, null)) : (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, addPostModalContent ? addPostModalContent : (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_Body__WEBPACK_IMPORTED_MODULE_4__["default"], {
    step: step,
    setTotalSteps: setTotalSteps
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_Footer__WEBPACK_IMPORTED_MODULE_3__["default"], {
    step: step,
    setStep: setStep,
    totalSteps: totalSteps,
    closeModal: closeModal,
    handleFilterSubmit: handleFilterSubmit
  })))));
};

/* harmony default export */ __webpack_exports__["default"] = (AddNewModal);

/***/ }),

/***/ "./src/components/ListFilters/DeleteModal.js":
/*!***************************************************!*\
  !*** ./src/components/ListFilters/DeleteModal.js ***!
  \***************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_icons__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @wordpress/icons */ "./node_modules/@wordpress/icons/build-module/library/trash.js");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__);





const DeleteModal = _ref => {
  let {
    isOpen,
    closeModal
  } = _ref;
  return isOpen && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.Modal, {
    onRequestClose: closeModal,
    __experimentalHideHeader: true
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "__delete_modal"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.Icon, {
    icon: _wordpress_icons__WEBPACK_IMPORTED_MODULE_3__["default"],
    size: 40
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("h3", null, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Are you sure?', 'wc-ajax-product-filter')), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("p", {
    className: "description"
  }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('This will delete the filter permanently.', 'wc-ajax-product-filter')), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "__buttons"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.Button, {
    variant: "secondary",
    onClick: closeModal
  }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Cancel', 'wc-ajax-product-filter')), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.Button, {
    variant: "primary"
  }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Delete', 'wc-ajax-product-filter')))));
};

/* harmony default export */ __webpack_exports__["default"] = (DeleteModal);

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

/***/ "./src/components/ListFilters/index.js":
/*!*********************************************!*\
  !*** ./src/components/ListFilters/index.js ***!
  \*********************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _PostTable__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../PostTable */ "./src/components/PostTable.js");
/* harmony import */ var _ListFiltersContext__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./ListFiltersContext */ "./src/components/ListFilters/ListFiltersContext.js");
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! axios */ "./node_modules/axios/index.js");
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(axios__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../utils */ "./src/components/utils.js");
/* harmony import */ var _DeleteModal__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./DeleteModal */ "./src/components/ListFilters/DeleteModal.js");
/* harmony import */ var _AddNewModal__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./AddNewModal */ "./src/components/ListFilters/AddNewModal/index.js");
/* harmony import */ var _wordpress_notices__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @wordpress/notices */ "@wordpress/notices");
/* harmony import */ var _wordpress_notices__WEBPACK_IMPORTED_MODULE_9___default = /*#__PURE__*/__webpack_require__.n(_wordpress_notices__WEBPACK_IMPORTED_MODULE_9__);
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @wordpress/data */ "@wordpress/data");
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_10___default = /*#__PURE__*/__webpack_require__.n(_wordpress_data__WEBPACK_IMPORTED_MODULE_10__);
/* harmony import */ var _Notifications__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../Notifications */ "./src/components/Notifications.js");
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! classnames */ "./node_modules/classnames/index.js");
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_12___default = /*#__PURE__*/__webpack_require__.n(classnames__WEBPACK_IMPORTED_MODULE_12__);















const ListFilters = () => {
  const {
    state: {
      filters
    },
    dispatch
  } = (0,_ListFiltersContext__WEBPACK_IMPORTED_MODULE_4__.useListFilters)();
  const [deletePostModalOpen, setDeletePostModalOpen] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(false);
  const [addPostModalOpen, setAddPostModalOpen] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(false);
  const [addPostModalStep, setAddPostModalStep] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(1);
  const [addPostModalTotalSteps, setAddPostModalTotalSteps] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(2); // const [addPostModalOpen, setAddPostModalOpen] = useState(true);
  // const [addPostModalStep, setAddPostModalStep] = useState(3);
  // const [addPostModalTotalSteps, setAddPostModalTotalSteps] = useState(3);

  const [addPostModalLoading, setAddPostModalLoading] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(true);
  const [addPostModalContent, setAddPostModalContent] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)('');

  const openDeletePostModal = () => setDeletePostModalOpen(true);

  const closeDeletePostModal = () => setDeletePostModalOpen(false);

  const openAddPostModal = () => setAddPostModalOpen(true);

  const closeAddPostModal = () => setAddPostModalOpen(false);

  const {
    createErrorNotice
  } = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_10__.useDispatch)(_wordpress_notices__WEBPACK_IMPORTED_MODULE_9__.store);

  const getFilters = () => {
    const data = {
      action: 'get_filters'
    };
    return axios__WEBPACK_IMPORTED_MODULE_5___default().get(wcapf_admin_params.ajaxurl, {
      params: data
    });
  };

  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    getFilters().then(res => {
      const {
        data: {
          data: _filters
        }
      } = res;
      const newFilters = [];

      _filters.forEach(filter => {
        newFilters.push((0,_utils__WEBPACK_IMPORTED_MODULE_6__.prepareFilterData)(filter));
      });

      dispatch({
        type: 'SET_FILTERS',
        payload: newFilters
      });
      dispatch({
        type: 'SET_LOADING',
        payload: false
      });
    }).catch(err => console.log(err));
  }, []); // Reset the add filter modal when closing the modal.

  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    if (addPostModalOpen) {
      return;
    }

    setAddPostModalStep(1);
    setAddPostModalTotalSteps(2);
    setAddPostModalLoading(true);
    setAddPostModalContent('');
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
  }, [addPostModalOpen]);

  const handleAddFilter = () => {
    openAddPostModal();
  };

  const handleDeleteFilter = filter => {
    openDeletePostModal();
    console.log(filter);
  };

  const handleCopyShortcode = filterId => {
    navigator.clipboard.writeText(`[wcapf_filter id="${filterId}"]`);
    createErrorNotice((0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Shortcode copied to clipboard', 'wc-ajax-product-filter'), {
      type: 'snackbar'
    });
  };

  const getTableData = () => {
    let html;

    if (filters.length) {
      html = filters.map(filter => (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("tr", {
        key: filter.id
      }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("td", {
        className: "title column-primary",
        "data-colname": (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Title', 'wc-ajax-product-filter')
      }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("a", {
        href: filter.permalink,
        className: "row-title"
      }, filter.title), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
        className: "__post_id"
      }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('ID', 'wc-ajax-product-filter'), ":", ` `, filter.id)), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("td", {
        "data-colname": (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Filter Key', 'wc-ajax-product-filter'),
        className: classnames__WEBPACK_IMPORTED_MODULE_12___default()({
          empty: !filter.filter_key
        })
      }, filter.filter_key), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("td", {
        "data-colname": (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Component', 'wc-ajax-product-filter')
      }, filter.component, filter.componentExtra && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
        className: "__component_extra"
      }, ` `, filter.componentExtra)), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("td", {
        "data-colname": (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Actions', 'wc-ajax-product-filter'),
        className: "__action_buttons_column"
      }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
        className: "__action_buttons"
      }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Button, {
        icon: 'edit',
        className: "__primary",
        href: filter.permalink
      }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Button, {
        icon: 'trash',
        className: "__destructive",
        onClick: () => handleDeleteFilter(filter)
      }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Button, {
        icon: 'shortcode',
        className: "__contextual",
        onClick: () => handleCopyShortcode(filter.id)
      })))));
    } else {
      html = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("tr", {
        className: "__no_results"
      }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("td", {
        colSpan: 5
      }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("p", {
        className: "description"
      }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('No matching results found.', 'wc-ajax-product-filter'))));
    }

    return html;
  };

  const content = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "__filter_response"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Icon, {
    icon: (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("svg", {
      viewBox: "0 0 24 24"
    }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("polyline", {
      points: "20 6 9 17 4 12"
    }))
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("h4", null, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Filter was created', 'wc-ajax-product-filter')), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("p", {
    className: "description"
  }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Now you can edit all the settings of this filter.', 'wc-ajax-product-filter')), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "_buttons"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Button, {
    variant: "secondary",
    onClick: closeAddPostModal
  }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Maybe Later', 'wc-ajax-product-filter')), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Button, {
    variant: "primary"
  }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Edit Filter', 'wc-ajax-product-filter'))));

  const handleFilterSubmit = () => {
    console.log('submit filter');
    setAddPostModalLoading(true);
    setTimeout(() => {
      setAddPostModalContent(content);
      setAddPostModalLoading(false);
      setAddPostModalStep(addPostModalStep + 1);
    }, 500);
  };

  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_PostTable__WEBPACK_IMPORTED_MODULE_3__["default"], {
    title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('List of Filters', 'wc-ajax-product-filter'),
    addBtnTitle: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Add Filter', 'wc-ajax-product-filter'),
    handleAddFilter: handleAddFilter,
    headers: [(0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Title', 'wc-ajax-product-filter'), (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Filter Key', 'wc-ajax-product-filter'), (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Component', 'wc-ajax-product-filter'), (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Actions', 'wc-ajax-product-filter')],
    tbody: getTableData
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_AddNewModal__WEBPACK_IMPORTED_MODULE_8__["default"], {
    isOpen: addPostModalOpen,
    closeModal: closeAddPostModal,
    step: addPostModalStep,
    setStep: setAddPostModalStep,
    totalSteps: addPostModalTotalSteps,
    setTotalSteps: setAddPostModalTotalSteps,
    loading: addPostModalLoading,
    setLoading: setAddPostModalLoading,
    handleFilterSubmit: handleFilterSubmit,
    addPostModalContent: addPostModalContent
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_DeleteModal__WEBPACK_IMPORTED_MODULE_7__["default"], {
    isOpen: deletePostModalOpen,
    closeModal: closeDeletePostModal
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_Notifications__WEBPACK_IMPORTED_MODULE_11__["default"], null));
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
const _activeFilterData = {
  show_title: '1',
  field_key: '',
  taxonomy: '',
  display_type: 'checkbox',
  query_type: 'and',
  all_items_label: '',
  use_chosen: '',
  chosen_no_results_message: '',
  enable_multiple_filter: '',
  show_count: '',
  hide_empty: '',
  enable_tooltip: '',
  show_count_in_tooltip: '',
  tooltip_position: '',
  custom_appearance_options: {},
  use_term_slug_in_url: '',
  limit_options: '',
  parent_term: '',
  limit_values_by_id: '',
  exclude_values_id: '',
  show_clear_button: '',
  order_terms_by: 'name',
  order_terms_dir: 'asc',
  enable_accordion: '',
  accordion_default_state: 'expanded',
  enable_soft_limit: '',
  soft_limit: '',
  type: 'attribute',
  field_id: '',
  enable_visibility_rules: '',
  visibility_rules: [],
  get_options: 'automatically'
};
const _filterType = 'attribute';
const _filterTitle = 'Hello World';
const initialState = {
  isLoading: true,
  isFilterKeyChecking: false,
  title: _filterTitle,
  filterType: _filterType,
  filterKeys: {},
  additionalData: {},
  activeFilterData: _activeFilterData,
  filtersData: {},
  filters: []
};

const listFiltersReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state,
        isLoading: action.payload
      };

    case 'SET_FILTER_KEY_CHECKING':
      return { ...state,
        isFilterKeyChecking: action.payload
      };

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

/***/ "./src/components/PostTable.js":
/*!*************************************!*\
  !*** ./src/components/PostTable.js ***!
  \*************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _ListFilters_ListFiltersContext__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./ListFilters/ListFiltersContext */ "./src/components/ListFilters/ListFiltersContext.js");






const PostTable = _ref => {
  let {
    title,
    addBtnTitle,
    handleAddFilter,
    headers,
    tbody
  } = _ref;
  const {
    state: {
      isLoading,
      filters
    }
  } = (0,_ListFilters_ListFiltersContext__WEBPACK_IMPORTED_MODULE_3__.useListFilters)();
  const [searchInput, setSearchInput] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)('');
  const filtersFound = filters.length;
  let html;

  if (isLoading) {
    html = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.Spinner, null);
  } else if (filtersFound) {
    html = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("table", {
      className: "wp-list-table widefat fixed striped __list_table"
    }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("thead", null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("tr", null, headers.map((item, index) => {
      let _classes = `__${item}`;

      if (0 === index) {
        _classes = 'column-title column-primary';
      }

      return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("th", {
        className: _classes,
        key: `posts-table-${item}`
      }, item);
    }))), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("tbody", null, tbody())), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.Flex, {
      className: "__list_table_footer"
    }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.FlexItem, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("p", {
      className: "description"
    }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.sprintf)((0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__._n)('Showing %d result', 'Showing %d results', filtersFound, 'wc-ajax-product-filter'), filtersFound)))));
  } else {
    html = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: "__import_data"
    }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.Icon, {
      icon: 'filter'
    }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("h3", null, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)("You don't have any filters yet.", 'wc-ajax-product-filter')), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("p", {
      className: "description"
    }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Do you want to import sample filters? Click on the button below.', 'wc-ajax-product-filter')), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.Button, {
      variant: "primary"
    }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Import Sample Filters', 'wc-ajax-product-filter')));
  }

  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "wrap"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("h1", null, title), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "__list_table_search"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "__search_box"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.SearchControl, {
    value: searchInput,
    onChange: setSearchInput
  })), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: ""
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.Button, {
    variant: "primary",
    onClick: handleAddFilter
  }, addBtnTitle))), html);
};

/* harmony default export */ __webpack_exports__["default"] = (PostTable);

/***/ }),

/***/ "./src/components/utils.js":
/*!*********************************!*\
  !*** ./src/components/utils.js ***!
  \*********************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "disableFilterHandling": function() { return /* binding */ disableFilterHandling; },
/* harmony export */   "foundProVersion": function() { return /* binding */ foundProVersion; },
/* harmony export */   "getAdditionalData": function() { return /* binding */ getAdditionalData; },
/* harmony export */   "isProFeature": function() { return /* binding */ isProFeature; },
/* harmony export */   "prepareFilterData": function() { return /* binding */ prepareFilterData; },
/* harmony export */   "prepareMetaKeys": function() { return /* binding */ prepareMetaKeys; },
/* harmony export */   "proTag": function() { return /* binding */ proTag; },
/* harmony export */   "removeParam": function() { return /* binding */ removeParam; }
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! lodash */ "lodash");
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(lodash__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! axios */ "./node_modules/axios/index.js");
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(axios__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _Filter_utils__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./Filter/utils */ "./src/components/Filter/utils.js");




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
function getAdditionalData() {
  const data = {
    action: 'get_filter_additional_data'
  };
  return axios__WEBPACK_IMPORTED_MODULE_2___default().get(wcapf_admin_params.ajaxurl, {
    params: data
  });
}
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

  const _filterData = (0,lodash__WEBPACK_IMPORTED_MODULE_1__.find)((0,_Filter_utils__WEBPACK_IMPORTED_MODULE_3__.availableFilters)(), {
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

  let permalink = window.location.href;
  permalink += '&id=' + id;
  return {
    id,
    title,
    filter_key: field_key,
    shortcode,
    component,
    componentExtra,
    permalink
  };
}
function removeParam(key, sourceURL) {
  var rtn = sourceURL.split('?')[0],
      param,
      params_arr = [],
      queryString = sourceURL.indexOf('?') !== -1 ? sourceURL.split('?')[1] : '';

  if (queryString !== '') {
    params_arr = queryString.split('&');

    for (var i = params_arr.length - 1; i >= 0; i -= 1) {
      param = params_arr[i].split('=')[0];

      if (param === key) {
        params_arr.splice(i, 1);
      }
    }

    if (params_arr.length) rtn = rtn + '?' + params_arr.join('&');
  }

  return rtn;
}
function prepareMetaKeys(options) {
  const _options = [];

  for (const [value, label] of Object.entries(options)) {
    _options.push({
      label,
      value
    });
  }

  return _options;
}
function disableFilterHandling(activeFilterData) {
  const {
    type
  } = activeFilterData;

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

/***/ "./node_modules/lodash.deburr/index.js":
/*!*********************************************!*\
  !*** ./node_modules/lodash.deburr/index.js ***!
  \*********************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

/**
 * lodash (Custom Build) <https://lodash.com/>
 * Build: `lodash modularize exports="npm" -o ./`
 * Copyright jQuery Foundation and other contributors <https://jquery.org/>
 * Released under MIT license <https://lodash.com/license>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 */

/** Used as references for various `Number` constants. */
var INFINITY = 1 / 0;

/** `Object#toString` result references. */
var symbolTag = '[object Symbol]';

/** Used to match Latin Unicode letters (excluding mathematical operators). */
var reLatin = /[\xc0-\xd6\xd8-\xf6\xf8-\xff\u0100-\u017f]/g;

/** Used to compose unicode character classes. */
var rsComboMarksRange = '\\u0300-\\u036f\\ufe20-\\ufe23',
    rsComboSymbolsRange = '\\u20d0-\\u20f0';

/** Used to compose unicode capture groups. */
var rsCombo = '[' + rsComboMarksRange + rsComboSymbolsRange + ']';

/**
 * Used to match [combining diacritical marks](https://en.wikipedia.org/wiki/Combining_Diacritical_Marks) and
 * [combining diacritical marks for symbols](https://en.wikipedia.org/wiki/Combining_Diacritical_Marks_for_Symbols).
 */
var reComboMark = RegExp(rsCombo, 'g');

/** Used to map Latin Unicode letters to basic Latin letters. */
var deburredLetters = {
  // Latin-1 Supplement block.
  '\xc0': 'A',  '\xc1': 'A', '\xc2': 'A', '\xc3': 'A', '\xc4': 'A', '\xc5': 'A',
  '\xe0': 'a',  '\xe1': 'a', '\xe2': 'a', '\xe3': 'a', '\xe4': 'a', '\xe5': 'a',
  '\xc7': 'C',  '\xe7': 'c',
  '\xd0': 'D',  '\xf0': 'd',
  '\xc8': 'E',  '\xc9': 'E', '\xca': 'E', '\xcb': 'E',
  '\xe8': 'e',  '\xe9': 'e', '\xea': 'e', '\xeb': 'e',
  '\xcc': 'I',  '\xcd': 'I', '\xce': 'I', '\xcf': 'I',
  '\xec': 'i',  '\xed': 'i', '\xee': 'i', '\xef': 'i',
  '\xd1': 'N',  '\xf1': 'n',
  '\xd2': 'O',  '\xd3': 'O', '\xd4': 'O', '\xd5': 'O', '\xd6': 'O', '\xd8': 'O',
  '\xf2': 'o',  '\xf3': 'o', '\xf4': 'o', '\xf5': 'o', '\xf6': 'o', '\xf8': 'o',
  '\xd9': 'U',  '\xda': 'U', '\xdb': 'U', '\xdc': 'U',
  '\xf9': 'u',  '\xfa': 'u', '\xfb': 'u', '\xfc': 'u',
  '\xdd': 'Y',  '\xfd': 'y', '\xff': 'y',
  '\xc6': 'Ae', '\xe6': 'ae',
  '\xde': 'Th', '\xfe': 'th',
  '\xdf': 'ss',
  // Latin Extended-A block.
  '\u0100': 'A',  '\u0102': 'A', '\u0104': 'A',
  '\u0101': 'a',  '\u0103': 'a', '\u0105': 'a',
  '\u0106': 'C',  '\u0108': 'C', '\u010a': 'C', '\u010c': 'C',
  '\u0107': 'c',  '\u0109': 'c', '\u010b': 'c', '\u010d': 'c',
  '\u010e': 'D',  '\u0110': 'D', '\u010f': 'd', '\u0111': 'd',
  '\u0112': 'E',  '\u0114': 'E', '\u0116': 'E', '\u0118': 'E', '\u011a': 'E',
  '\u0113': 'e',  '\u0115': 'e', '\u0117': 'e', '\u0119': 'e', '\u011b': 'e',
  '\u011c': 'G',  '\u011e': 'G', '\u0120': 'G', '\u0122': 'G',
  '\u011d': 'g',  '\u011f': 'g', '\u0121': 'g', '\u0123': 'g',
  '\u0124': 'H',  '\u0126': 'H', '\u0125': 'h', '\u0127': 'h',
  '\u0128': 'I',  '\u012a': 'I', '\u012c': 'I', '\u012e': 'I', '\u0130': 'I',
  '\u0129': 'i',  '\u012b': 'i', '\u012d': 'i', '\u012f': 'i', '\u0131': 'i',
  '\u0134': 'J',  '\u0135': 'j',
  '\u0136': 'K',  '\u0137': 'k', '\u0138': 'k',
  '\u0139': 'L',  '\u013b': 'L', '\u013d': 'L', '\u013f': 'L', '\u0141': 'L',
  '\u013a': 'l',  '\u013c': 'l', '\u013e': 'l', '\u0140': 'l', '\u0142': 'l',
  '\u0143': 'N',  '\u0145': 'N', '\u0147': 'N', '\u014a': 'N',
  '\u0144': 'n',  '\u0146': 'n', '\u0148': 'n', '\u014b': 'n',
  '\u014c': 'O',  '\u014e': 'O', '\u0150': 'O',
  '\u014d': 'o',  '\u014f': 'o', '\u0151': 'o',
  '\u0154': 'R',  '\u0156': 'R', '\u0158': 'R',
  '\u0155': 'r',  '\u0157': 'r', '\u0159': 'r',
  '\u015a': 'S',  '\u015c': 'S', '\u015e': 'S', '\u0160': 'S',
  '\u015b': 's',  '\u015d': 's', '\u015f': 's', '\u0161': 's',
  '\u0162': 'T',  '\u0164': 'T', '\u0166': 'T',
  '\u0163': 't',  '\u0165': 't', '\u0167': 't',
  '\u0168': 'U',  '\u016a': 'U', '\u016c': 'U', '\u016e': 'U', '\u0170': 'U', '\u0172': 'U',
  '\u0169': 'u',  '\u016b': 'u', '\u016d': 'u', '\u016f': 'u', '\u0171': 'u', '\u0173': 'u',
  '\u0174': 'W',  '\u0175': 'w',
  '\u0176': 'Y',  '\u0177': 'y', '\u0178': 'Y',
  '\u0179': 'Z',  '\u017b': 'Z', '\u017d': 'Z',
  '\u017a': 'z',  '\u017c': 'z', '\u017e': 'z',
  '\u0132': 'IJ', '\u0133': 'ij',
  '\u0152': 'Oe', '\u0153': 'oe',
  '\u0149': "'n", '\u017f': 'ss'
};

/** Detect free variable `global` from Node.js. */
var freeGlobal = typeof __webpack_require__.g == 'object' && __webpack_require__.g && __webpack_require__.g.Object === Object && __webpack_require__.g;

/** Detect free variable `self`. */
var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root = freeGlobal || freeSelf || Function('return this')();

/**
 * The base implementation of `_.propertyOf` without support for deep paths.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Function} Returns the new accessor function.
 */
function basePropertyOf(object) {
  return function(key) {
    return object == null ? undefined : object[key];
  };
}

/**
 * Used by `_.deburr` to convert Latin-1 Supplement and Latin Extended-A
 * letters to basic Latin letters.
 *
 * @private
 * @param {string} letter The matched letter to deburr.
 * @returns {string} Returns the deburred letter.
 */
var deburrLetter = basePropertyOf(deburredLetters);

/** Used for built-in method references. */
var objectProto = Object.prototype;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var objectToString = objectProto.toString;

/** Built-in value references. */
var Symbol = root.Symbol;

/** Used to convert symbols to primitives and strings. */
var symbolProto = Symbol ? Symbol.prototype : undefined,
    symbolToString = symbolProto ? symbolProto.toString : undefined;

/**
 * The base implementation of `_.toString` which doesn't convert nullish
 * values to empty strings.
 *
 * @private
 * @param {*} value The value to process.
 * @returns {string} Returns the string.
 */
function baseToString(value) {
  // Exit early for strings to avoid a performance hit in some environments.
  if (typeof value == 'string') {
    return value;
  }
  if (isSymbol(value)) {
    return symbolToString ? symbolToString.call(value) : '';
  }
  var result = (value + '');
  return (result == '0' && (1 / value) == -INFINITY) ? '-0' : result;
}

/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return !!value && typeof value == 'object';
}

/**
 * Checks if `value` is classified as a `Symbol` primitive or object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
 * @example
 *
 * _.isSymbol(Symbol.iterator);
 * // => true
 *
 * _.isSymbol('abc');
 * // => false
 */
function isSymbol(value) {
  return typeof value == 'symbol' ||
    (isObjectLike(value) && objectToString.call(value) == symbolTag);
}

/**
 * Converts `value` to a string. An empty string is returned for `null`
 * and `undefined` values. The sign of `-0` is preserved.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to process.
 * @returns {string} Returns the string.
 * @example
 *
 * _.toString(null);
 * // => ''
 *
 * _.toString(-0);
 * // => '-0'
 *
 * _.toString([1, 2, 3]);
 * // => '1,2,3'
 */
function toString(value) {
  return value == null ? '' : baseToString(value);
}

/**
 * Deburrs `string` by converting
 * [Latin-1 Supplement](https://en.wikipedia.org/wiki/Latin-1_Supplement_(Unicode_block)#Character_table)
 * and [Latin Extended-A](https://en.wikipedia.org/wiki/Latin_Extended-A)
 * letters to basic Latin letters and removing
 * [combining diacritical marks](https://en.wikipedia.org/wiki/Combining_Diacritical_Marks).
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category String
 * @param {string} [string=''] The string to deburr.
 * @returns {string} Returns the deburred string.
 * @example
 *
 * _.deburr('déjà vu');
 * // => 'deja vu'
 */
function deburr(string) {
  string = toString(string);
  return string && string.replace(reLatin, deburrLetter).replace(reComboMark, '');
}

module.exports = deburr;


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

/***/ "@wordpress/primitives":
/*!************************************!*\
  !*** external ["wp","primitives"] ***!
  \************************************/
/***/ (function(module) {

"use strict";
module.exports = window["wp"]["primitives"];

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

/***/ }),

/***/ "./node_modules/@sindresorhus/slugify/index.js":
/*!*****************************************************!*\
  !*** ./node_modules/@sindresorhus/slugify/index.js ***!
  \*****************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ slugify; },
/* harmony export */   "slugifyWithCounter": function() { return /* binding */ slugifyWithCounter; }
/* harmony export */ });
/* harmony import */ var escape_string_regexp__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! escape-string-regexp */ "./node_modules/@sindresorhus/slugify/node_modules/escape-string-regexp/index.js");
/* harmony import */ var _sindresorhus_transliterate__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @sindresorhus/transliterate */ "./node_modules/@sindresorhus/transliterate/index.js");
/* harmony import */ var _overridable_replacements_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./overridable-replacements.js */ "./node_modules/@sindresorhus/slugify/overridable-replacements.js");




const decamelize = string => {
	return string
		// Separate capitalized words.
		.replace(/([A-Z]{2,})(\d+)/g, '$1 $2')
		.replace(/([a-z\d]+)([A-Z]{2,})/g, '$1 $2')

		.replace(/([a-z\d])([A-Z])/g, '$1 $2')
		.replace(/([A-Z]+)([A-Z][a-z\d]+)/g, '$1 $2');
};

const removeMootSeparators = (string, separator) => {
	const escapedSeparator = (0,escape_string_regexp__WEBPACK_IMPORTED_MODULE_0__["default"])(separator);

	return string
		.replace(new RegExp(`${escapedSeparator}{2,}`, 'g'), separator)
		.replace(new RegExp(`^${escapedSeparator}|${escapedSeparator}$`, 'g'), '');
};

function slugify(string, options) {
	if (typeof string !== 'string') {
		throw new TypeError(`Expected a string, got \`${typeof string}\``);
	}

	options = {
		separator: '-',
		lowercase: true,
		decamelize: true,
		customReplacements: [],
		preserveLeadingUnderscore: false,
		preserveTrailingDash: false,
		...options
	};

	const shouldPrependUnderscore = options.preserveLeadingUnderscore && string.startsWith('_');
	const shouldAppendDash = options.preserveTrailingDash && string.endsWith('-');

	const customReplacements = new Map([
		..._overridable_replacements_js__WEBPACK_IMPORTED_MODULE_2__["default"],
		...options.customReplacements
	]);

	string = (0,_sindresorhus_transliterate__WEBPACK_IMPORTED_MODULE_1__["default"])(string, {customReplacements});

	if (options.decamelize) {
		string = decamelize(string);
	}

	let patternSlug = /[^a-zA-Z\d]+/g;

	if (options.lowercase) {
		string = string.toLowerCase();
		patternSlug = /[^a-z\d]+/g;
	}

	string = string.replace(patternSlug, options.separator);
	string = string.replace(/\\/g, '');
	if (options.separator) {
		string = removeMootSeparators(string, options.separator);
	}

	if (shouldPrependUnderscore) {
		string = `_${string}`;
	}

	if (shouldAppendDash) {
		string = `${string}-`;
	}

	return string;
}

function slugifyWithCounter() {
	const occurrences = new Map();

	const countable = (string, options) => {
		string = slugify(string, options);

		if (!string) {
			return '';
		}

		const stringLower = string.toLowerCase();
		const numberless = occurrences.get(stringLower.replace(/(?:-\d+?)+?$/, '')) || 0;
		const counter = occurrences.get(stringLower);
		occurrences.set(stringLower, typeof counter === 'number' ? counter + 1 : 1);
		const newCounter = occurrences.get(stringLower) || 2;
		if (newCounter >= 2 || numberless > 2) {
			string = `${string}-${newCounter}`;
		}

		return string;
	};

	countable.reset = () => {
		occurrences.clear();
	};

	return countable;
}


/***/ }),

/***/ "./node_modules/@sindresorhus/slugify/node_modules/escape-string-regexp/index.js":
/*!***************************************************************************************!*\
  !*** ./node_modules/@sindresorhus/slugify/node_modules/escape-string-regexp/index.js ***!
  \***************************************************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ escapeStringRegexp; }
/* harmony export */ });
function escapeStringRegexp(string) {
	if (typeof string !== 'string') {
		throw new TypeError('Expected a string');
	}

	// Escape characters with special meaning either inside or outside character sets.
	// Use a simple backslash escape when it’s always valid, and a `\xnn` escape when the simpler form would be disallowed by Unicode patterns’ stricter grammar.
	return string
		.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&')
		.replace(/-/g, '\\x2d');
}


/***/ }),

/***/ "./node_modules/@sindresorhus/slugify/overridable-replacements.js":
/*!************************************************************************!*\
  !*** ./node_modules/@sindresorhus/slugify/overridable-replacements.js ***!
  \************************************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
const overridableReplacements = [
	['&', ' and '],
	['🦄', ' unicorn '],
	['♥', ' love ']
];

/* harmony default export */ __webpack_exports__["default"] = (overridableReplacements);


/***/ }),

/***/ "./node_modules/@sindresorhus/transliterate/index.js":
/*!***********************************************************!*\
  !*** ./node_modules/@sindresorhus/transliterate/index.js ***!
  \***********************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ transliterate; }
/* harmony export */ });
/* harmony import */ var lodash_deburr__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! lodash.deburr */ "./node_modules/lodash.deburr/index.js");
/* harmony import */ var escape_string_regexp__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! escape-string-regexp */ "./node_modules/@sindresorhus/transliterate/node_modules/escape-string-regexp/index.js");
/* harmony import */ var _replacements_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./replacements.js */ "./node_modules/@sindresorhus/transliterate/replacements.js");




const doCustomReplacements = (string, replacements) => {
	for (const [key, value] of replacements) {
		// TODO: Use `String#replaceAll()` when targeting Node.js 16.
		string = string.replace(new RegExp((0,escape_string_regexp__WEBPACK_IMPORTED_MODULE_1__["default"])(key), 'g'), value);
	}

	return string;
};

function transliterate(string, options) {
	if (typeof string !== 'string') {
		throw new TypeError(`Expected a string, got \`${typeof string}\``);
	}

	options = {
		customReplacements: [],
		...options
	};

	const customReplacements = new Map([
		..._replacements_js__WEBPACK_IMPORTED_MODULE_2__["default"],
		...options.customReplacements
	]);

	string = string.normalize();
	string = doCustomReplacements(string, customReplacements);
	string = lodash_deburr__WEBPACK_IMPORTED_MODULE_0__(string);

	return string;
}


/***/ }),

/***/ "./node_modules/@sindresorhus/transliterate/node_modules/escape-string-regexp/index.js":
/*!*********************************************************************************************!*\
  !*** ./node_modules/@sindresorhus/transliterate/node_modules/escape-string-regexp/index.js ***!
  \*********************************************************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ escapeStringRegexp; }
/* harmony export */ });
function escapeStringRegexp(string) {
	if (typeof string !== 'string') {
		throw new TypeError('Expected a string');
	}

	// Escape characters with special meaning either inside or outside character sets.
	// Use a simple backslash escape when it’s always valid, and a `\xnn` escape when the simpler form would be disallowed by Unicode patterns’ stricter grammar.
	return string
		.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&')
		.replace(/-/g, '\\x2d');
}


/***/ }),

/***/ "./node_modules/@sindresorhus/transliterate/replacements.js":
/*!******************************************************************!*\
  !*** ./node_modules/@sindresorhus/transliterate/replacements.js ***!
  \******************************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
const replacements = [
	// German umlauts
	['ß', 'ss'],
	['ẞ', 'Ss'],
	['ä', 'ae'],
	['Ä', 'Ae'],
	['ö', 'oe'],
	['Ö', 'Oe'],
	['ü', 'ue'],
	['Ü', 'Ue'],

	// Latin
	['À', 'A'],
	['Á', 'A'],
	['Â', 'A'],
	['Ã', 'A'],
	['Ä', 'Ae'],
	['Å', 'A'],
	['Æ', 'AE'],
	['Ç', 'C'],
	['È', 'E'],
	['É', 'E'],
	['Ê', 'E'],
	['Ë', 'E'],
	['Ì', 'I'],
	['Í', 'I'],
	['Î', 'I'],
	['Ï', 'I'],
	['Ð', 'D'],
	['Ñ', 'N'],
	['Ò', 'O'],
	['Ó', 'O'],
	['Ô', 'O'],
	['Õ', 'O'],
	['Ö', 'Oe'],
	['Ő', 'O'],
	['Ø', 'O'],
	['Ù', 'U'],
	['Ú', 'U'],
	['Û', 'U'],
	['Ü', 'Ue'],
	['Ű', 'U'],
	['Ý', 'Y'],
	['Þ', 'TH'],
	['ß', 'ss'],
	['à', 'a'],
	['á', 'a'],
	['â', 'a'],
	['ã', 'a'],
	['ä', 'ae'],
	['å', 'a'],
	['æ', 'ae'],
	['ç', 'c'],
	['è', 'e'],
	['é', 'e'],
	['ê', 'e'],
	['ë', 'e'],
	['ì', 'i'],
	['í', 'i'],
	['î', 'i'],
	['ï', 'i'],
	['ð', 'd'],
	['ñ', 'n'],
	['ò', 'o'],
	['ó', 'o'],
	['ô', 'o'],
	['õ', 'o'],
	['ö', 'oe'],
	['ő', 'o'],
	['ø', 'o'],
	['ù', 'u'],
	['ú', 'u'],
	['û', 'u'],
	['ü', 'ue'],
	['ű', 'u'],
	['ý', 'y'],
	['þ', 'th'],
	['ÿ', 'y'],
	['ẞ', 'SS'],

	// Vietnamese
	['à', 'a'],
	['À', 'A'],
	['á', 'a'],
	['Á', 'A'],
	['â', 'a'],
	['Â', 'A'],
	['ã', 'a'],
	['Ã', 'A'],
	['è', 'e'],
	['È', 'E'],
	['é', 'e'],
	['É', 'E'],
	['ê', 'e'],
	['Ê', 'E'],
	['ì', 'i'],
	['Ì', 'I'],
	['í', 'i'],
	['Í', 'I'],
	['ò', 'o'],
	['Ò', 'O'],
	['ó', 'o'],
	['Ó', 'O'],
	['ô', 'o'],
	['Ô', 'O'],
	['õ', 'o'],
	['Õ', 'O'],
	['ù', 'u'],
	['Ù', 'U'],
	['ú', 'u'],
	['Ú', 'U'],
	['ý', 'y'],
	['Ý', 'Y'],
	['ă', 'a'],
	['Ă', 'A'],
	['Đ', 'D'],
	['đ', 'd'],
	['ĩ', 'i'],
	['Ĩ', 'I'],
	['ũ', 'u'],
	['Ũ', 'U'],
	['ơ', 'o'],
	['Ơ', 'O'],
	['ư', 'u'],
	['Ư', 'U'],
	['ạ', 'a'],
	['Ạ', 'A'],
	['ả', 'a'],
	['Ả', 'A'],
	['ấ', 'a'],
	['Ấ', 'A'],
	['ầ', 'a'],
	['Ầ', 'A'],
	['ẩ', 'a'],
	['Ẩ', 'A'],
	['ẫ', 'a'],
	['Ẫ', 'A'],
	['ậ', 'a'],
	['Ậ', 'A'],
	['ắ', 'a'],
	['Ắ', 'A'],
	['ằ', 'a'],
	['Ằ', 'A'],
	['ẳ', 'a'],
	['Ẳ', 'A'],
	['ẵ', 'a'],
	['Ẵ', 'A'],
	['ặ', 'a'],
	['Ặ', 'A'],
	['ẹ', 'e'],
	['Ẹ', 'E'],
	['ẻ', 'e'],
	['Ẻ', 'E'],
	['ẽ', 'e'],
	['Ẽ', 'E'],
	['ế', 'e'],
	['Ế', 'E'],
	['ề', 'e'],
	['Ề', 'E'],
	['ể', 'e'],
	['Ể', 'E'],
	['ễ', 'e'],
	['Ễ', 'E'],
	['ệ', 'e'],
	['Ệ', 'E'],
	['ỉ', 'i'],
	['Ỉ', 'I'],
	['ị', 'i'],
	['Ị', 'I'],
	['ọ', 'o'],
	['Ọ', 'O'],
	['ỏ', 'o'],
	['Ỏ', 'O'],
	['ố', 'o'],
	['Ố', 'O'],
	['ồ', 'o'],
	['Ồ', 'O'],
	['ổ', 'o'],
	['Ổ', 'O'],
	['ỗ', 'o'],
	['Ỗ', 'O'],
	['ộ', 'o'],
	['Ộ', 'O'],
	['ớ', 'o'],
	['Ớ', 'O'],
	['ờ', 'o'],
	['Ờ', 'O'],
	['ở', 'o'],
	['Ở', 'O'],
	['ỡ', 'o'],
	['Ỡ', 'O'],
	['ợ', 'o'],
	['Ợ', 'O'],
	['ụ', 'u'],
	['Ụ', 'U'],
	['ủ', 'u'],
	['Ủ', 'U'],
	['ứ', 'u'],
	['Ứ', 'U'],
	['ừ', 'u'],
	['Ừ', 'U'],
	['ử', 'u'],
	['Ử', 'U'],
	['ữ', 'u'],
	['Ữ', 'U'],
	['ự', 'u'],
	['Ự', 'U'],
	['ỳ', 'y'],
	['Ỳ', 'Y'],
	['ỵ', 'y'],
	['Ỵ', 'Y'],
	['ỷ', 'y'],
	['Ỷ', 'Y'],
	['ỹ', 'y'],
	['Ỹ', 'Y'],

	// Arabic
	['ء', 'e'],
	['آ', 'a'],
	['أ', 'a'],
	['ؤ', 'w'],
	['إ', 'i'],
	['ئ', 'y'],
	['ا', 'a'],
	['ب', 'b'],
	['ة', 't'],
	['ت', 't'],
	['ث', 'th'],
	['ج', 'j'],
	['ح', 'h'],
	['خ', 'kh'],
	['د', 'd'],
	['ذ', 'dh'],
	['ر', 'r'],
	['ز', 'z'],
	['س', 's'],
	['ش', 'sh'],
	['ص', 's'],
	['ض', 'd'],
	['ط', 't'],
	['ظ', 'z'],
	['ع', 'e'],
	['غ', 'gh'],
	['ـ', '_'],
	['ف', 'f'],
	['ق', 'q'],
	['ك', 'k'],
	['ل', 'l'],
	['م', 'm'],
	['ن', 'n'],
	['ه', 'h'],
	['و', 'w'],
	['ى', 'a'],
	['ي', 'y'],
	['َ‎', 'a'],
	['ُ', 'u'],
	['ِ‎', 'i'],
	['٠', '0'],
	['١', '1'],
	['٢', '2'],
	['٣', '3'],
	['٤', '4'],
	['٥', '5'],
	['٦', '6'],
	['٧', '7'],
	['٨', '8'],
	['٩', '9'],

	// Persian / Farsi
	['چ', 'ch'],
	['ک', 'k'],
	['گ', 'g'],
	['پ', 'p'],
	['ژ', 'zh'],
	['ی', 'y'],
	['۰', '0'],
	['۱', '1'],
	['۲', '2'],
	['۳', '3'],
	['۴', '4'],
	['۵', '5'],
	['۶', '6'],
	['۷', '7'],
	['۸', '8'],
	['۹', '9'],

	// Pashto
	['ټ', 'p'],
	['ځ', 'z'],
	['څ', 'c'],
	['ډ', 'd'],
	['ﺫ', 'd'],
	['ﺭ', 'r'],
	['ړ', 'r'],
	['ﺯ', 'z'],
	['ږ', 'g'],
	['ښ', 'x'],
	['ګ', 'g'],
	['ڼ', 'n'],
	['ۀ', 'e'],
	['ې', 'e'],
	['ۍ', 'ai'],

	// Urdu
	['ٹ', 't'],
	['ڈ', 'd'],
	['ڑ', 'r'],
	['ں', 'n'],
	['ہ', 'h'],
	['ھ', 'h'],
	['ے', 'e'],

	// Russian
	['А', 'A'],
	['а', 'a'],
	['Б', 'B'],
	['б', 'b'],
	['В', 'V'],
	['в', 'v'],
	['Г', 'G'],
	['г', 'g'],
	['Д', 'D'],
	['д', 'd'],
	['ъе', 'ye'],
	['Ъе', 'Ye'],
	['ъЕ', 'yE'],
	['ЪЕ', 'YE'],
	['Е', 'E'],
	['е', 'e'],
	['Ё', 'Yo'],
	['ё', 'yo'],
	['Ж', 'Zh'],
	['ж', 'zh'],
	['З', 'Z'],
	['з', 'z'],
	['И', 'I'],
	['и', 'i'],
	['ый', 'iy'],
	['Ый', 'Iy'],
	['ЫЙ', 'IY'],
	['ыЙ', 'iY'],
	['Й', 'Y'],
	['й', 'y'],
	['К', 'K'],
	['к', 'k'],
	['Л', 'L'],
	['л', 'l'],
	['М', 'M'],
	['м', 'm'],
	['Н', 'N'],
	['н', 'n'],
	['О', 'O'],
	['о', 'o'],
	['П', 'P'],
	['п', 'p'],
	['Р', 'R'],
	['р', 'r'],
	['С', 'S'],
	['с', 's'],
	['Т', 'T'],
	['т', 't'],
	['У', 'U'],
	['у', 'u'],
	['Ф', 'F'],
	['ф', 'f'],
	['Х', 'Kh'],
	['х', 'kh'],
	['Ц', 'Ts'],
	['ц', 'ts'],
	['Ч', 'Ch'],
	['ч', 'ch'],
	['Ш', 'Sh'],
	['ш', 'sh'],
	['Щ', 'Sch'],
	['щ', 'sch'],
	['Ъ', ''],
	['ъ', ''],
	['Ы', 'Y'],
	['ы', 'y'],
	['Ь', ''],
	['ь', ''],
	['Э', 'E'],
	['э', 'e'],
	['Ю', 'Yu'],
	['ю', 'yu'],
	['Я', 'Ya'],
	['я', 'ya'],

	// Romanian
	['ă', 'a'],
	['Ă', 'A'],
	['ș', 's'],
	['Ș', 'S'],
	['ț', 't'],
	['Ț', 'T'],
	['ţ', 't'],
	['Ţ', 'T'],

	// Turkish
	['ş', 's'],
	['Ş', 'S'],
	['ç', 'c'],
	['Ç', 'C'],
	['ğ', 'g'],
	['Ğ', 'G'],
	['ı', 'i'],
	['İ', 'I'],

	// Armenian
	['ա', 'a'],
	['Ա', 'A'],
	['բ', 'b'],
	['Բ', 'B'],
	['գ', 'g'],
	['Գ', 'G'],
	['դ', 'd'],
	['Դ', 'D'],
	['ե', 'ye'],
	['Ե', 'Ye'],
	['զ', 'z'],
	['Զ', 'Z'],
	['է', 'e'],
	['Է', 'E'],
	['ը', 'y'],
	['Ը', 'Y'],
	['թ', 't'],
	['Թ', 'T'],
	['ժ', 'zh'],
	['Ժ', 'Zh'],
	['ի', 'i'],
	['Ի', 'I'],
	['լ', 'l'],
	['Լ', 'L'],
	['խ', 'kh'],
	['Խ', 'Kh'],
	['ծ', 'ts'],
	['Ծ', 'Ts'],
	['կ', 'k'],
	['Կ', 'K'],
	['հ', 'h'],
	['Հ', 'H'],
	['ձ', 'dz'],
	['Ձ', 'Dz'],
	['ղ', 'gh'],
	['Ղ', 'Gh'],
	['ճ', 'tch'],
	['Ճ', 'Tch'],
	['մ', 'm'],
	['Մ', 'M'],
	['յ', 'y'],
	['Յ', 'Y'],
	['ն', 'n'],
	['Ն', 'N'],
	['շ', 'sh'],
	['Շ', 'Sh'],
	['ո', 'vo'],
	['Ո', 'Vo'],
	['չ', 'ch'],
	['Չ', 'Ch'],
	['պ', 'p'],
	['Պ', 'P'],
	['ջ', 'j'],
	['Ջ', 'J'],
	['ռ', 'r'],
	['Ռ', 'R'],
	['ս', 's'],
	['Ս', 'S'],
	['վ', 'v'],
	['Վ', 'V'],
	['տ', 't'],
	['Տ', 'T'],
	['ր', 'r'],
	['Ր', 'R'],
	['ց', 'c'],
	['Ց', 'C'],
	['ու', 'u'],
	['ՈՒ', 'U'],
	['Ու', 'U'],
	['փ', 'p'],
	['Փ', 'P'],
	['ք', 'q'],
	['Ք', 'Q'],
	['օ', 'o'],
	['Օ', 'O'],
	['ֆ', 'f'],
	['Ֆ', 'F'],
	['և', 'yev'],

	// Georgian
	['ა', 'a'],
	['ბ', 'b'],
	['გ', 'g'],
	['დ', 'd'],
	['ე', 'e'],
	['ვ', 'v'],
	['ზ', 'z'],
	['თ', 't'],
	['ი', 'i'],
	['კ', 'k'],
	['ლ', 'l'],
	['მ', 'm'],
	['ნ', 'n'],
	['ო', 'o'],
	['პ', 'p'],
	['ჟ', 'zh'],
	['რ', 'r'],
	['ს', 's'],
	['ტ', 't'],
	['უ', 'u'],
	['ფ', 'ph'],
	['ქ', 'q'],
	['ღ', 'gh'],
	['ყ', 'k'],
	['შ', 'sh'],
	['ჩ', 'ch'],
	['ც', 'ts'],
	['ძ', 'dz'],
	['წ', 'ts'],
	['ჭ', 'tch'],
	['ხ', 'kh'],
	['ჯ', 'j'],
	['ჰ', 'h'],

	// Czech
	['č', 'c'],
	['ď', 'd'],
	['ě', 'e'],
	['ň', 'n'],
	['ř', 'r'],
	['š', 's'],
	['ť', 't'],
	['ů', 'u'],
	['ž', 'z'],
	['Č', 'C'],
	['Ď', 'D'],
	['Ě', 'E'],
	['Ň', 'N'],
	['Ř', 'R'],
	['Š', 'S'],
	['Ť', 'T'],
	['Ů', 'U'],
	['Ž', 'Z'],

	// Dhivehi
	['ހ', 'h'],
	['ށ', 'sh'],
	['ނ', 'n'],
	['ރ', 'r'],
	['ބ', 'b'],
	['ޅ', 'lh'],
	['ކ', 'k'],
	['އ', 'a'],
	['ވ', 'v'],
	['މ', 'm'],
	['ފ', 'f'],
	['ދ', 'dh'],
	['ތ', 'th'],
	['ލ', 'l'],
	['ގ', 'g'],
	['ޏ', 'gn'],
	['ސ', 's'],
	['ޑ', 'd'],
	['ޒ', 'z'],
	['ޓ', 't'],
	['ޔ', 'y'],
	['ޕ', 'p'],
	['ޖ', 'j'],
	['ޗ', 'ch'],
	['ޘ', 'tt'],
	['ޙ', 'hh'],
	['ޚ', 'kh'],
	['ޛ', 'th'],
	['ޜ', 'z'],
	['ޝ', 'sh'],
	['ޞ', 's'],
	['ޟ', 'd'],
	['ޠ', 't'],
	['ޡ', 'z'],
	['ޢ', 'a'],
	['ޣ', 'gh'],
	['ޤ', 'q'],
	['ޥ', 'w'],
	['ަ', 'a'],
	['ާ', 'aa'],
	['ި', 'i'],
	['ީ', 'ee'],
	['ު', 'u'],
	['ޫ', 'oo'],
	['ެ', 'e'],
	['ޭ', 'ey'],
	['ޮ', 'o'],
	['ޯ', 'oa'],
	['ް', ''],

	// Greek
	['α', 'a'],
	['β', 'v'],
	['γ', 'g'],
	['δ', 'd'],
	['ε', 'e'],
	['ζ', 'z'],
	['η', 'i'],
	['θ', 'th'],
	['ι', 'i'],
	['κ', 'k'],
	['λ', 'l'],
	['μ', 'm'],
	['ν', 'n'],
	['ξ', 'ks'],
	['ο', 'o'],
	['π', 'p'],
	['ρ', 'r'],
	['σ', 's'],
	['τ', 't'],
	['υ', 'y'],
	['φ', 'f'],
	['χ', 'x'],
	['ψ', 'ps'],
	['ω', 'o'],
	['ά', 'a'],
	['έ', 'e'],
	['ί', 'i'],
	['ό', 'o'],
	['ύ', 'y'],
	['ή', 'i'],
	['ώ', 'o'],
	['ς', 's'],
	['ϊ', 'i'],
	['ΰ', 'y'],
	['ϋ', 'y'],
	['ΐ', 'i'],
	['Α', 'A'],
	['Β', 'B'],
	['Γ', 'G'],
	['Δ', 'D'],
	['Ε', 'E'],
	['Ζ', 'Z'],
	['Η', 'I'],
	['Θ', 'TH'],
	['Ι', 'I'],
	['Κ', 'K'],
	['Λ', 'L'],
	['Μ', 'M'],
	['Ν', 'N'],
	['Ξ', 'KS'],
	['Ο', 'O'],
	['Π', 'P'],
	['Ρ', 'R'],
	['Σ', 'S'],
	['Τ', 'T'],
	['Υ', 'Y'],
	['Φ', 'F'],
	['Χ', 'X'],
	['Ψ', 'PS'],
	['Ω', 'O'],
	['Ά', 'A'],
	['Έ', 'E'],
	['Ί', 'I'],
	['Ό', 'O'],
	['Ύ', 'Y'],
	['Ή', 'I'],
	['Ώ', 'O'],
	['Ϊ', 'I'],
	['Ϋ', 'Y'],

	// Disabled as it conflicts with German and Latin.
	// Hungarian
	// ['ä', 'a'],
	// ['Ä', 'A'],
	// ['ö', 'o'],
	// ['Ö', 'O'],
	// ['ü', 'u'],
	// ['Ü', 'U'],
	// ['ű', 'u'],
	// ['Ű', 'U'],

	// Latvian
	['ā', 'a'],
	['ē', 'e'],
	['ģ', 'g'],
	['ī', 'i'],
	['ķ', 'k'],
	['ļ', 'l'],
	['ņ', 'n'],
	['ū', 'u'],
	['Ā', 'A'],
	['Ē', 'E'],
	['Ģ', 'G'],
	['Ī', 'I'],
	['Ķ', 'K'],
	['Ļ', 'L'],
	['Ņ', 'N'],
	['Ū', 'U'],
	['č', 'c'],
	['š', 's'],
	['ž', 'z'],
	['Č', 'C'],
	['Š', 'S'],
	['Ž', 'Z'],

	// Lithuanian
	['ą', 'a'],
	['č', 'c'],
	['ę', 'e'],
	['ė', 'e'],
	['į', 'i'],
	['š', 's'],
	['ų', 'u'],
	['ū', 'u'],
	['ž', 'z'],
	['Ą', 'A'],
	['Č', 'C'],
	['Ę', 'E'],
	['Ė', 'E'],
	['Į', 'I'],
	['Š', 'S'],
	['Ų', 'U'],
	['Ū', 'U'],

	// Macedonian
	['Ќ', 'Kj'],
	['ќ', 'kj'],
	['Љ', 'Lj'],
	['љ', 'lj'],
	['Њ', 'Nj'],
	['њ', 'nj'],
	['Тс', 'Ts'],
	['тс', 'ts'],

	// Polish
	['ą', 'a'],
	['ć', 'c'],
	['ę', 'e'],
	['ł', 'l'],
	['ń', 'n'],
	['ś', 's'],
	['ź', 'z'],
	['ż', 'z'],
	['Ą', 'A'],
	['Ć', 'C'],
	['Ę', 'E'],
	['Ł', 'L'],
	['Ń', 'N'],
	['Ś', 'S'],
	['Ź', 'Z'],
	['Ż', 'Z'],

	// Disabled as it conflicts with Vietnamese.
	// Serbian
	// ['љ', 'lj'],
	// ['њ', 'nj'],
	// ['Љ', 'Lj'],
	// ['Њ', 'Nj'],
	// ['đ', 'dj'],
	// ['Đ', 'Dj'],
	// ['ђ', 'dj'],
	// ['ј', 'j'],
	// ['ћ', 'c'],
	// ['џ', 'dz'],
	// ['Ђ', 'Dj'],
	// ['Ј', 'j'],
	// ['Ћ', 'C'],
	// ['Џ', 'Dz'],

	// Disabled as it conflicts with German and Latin.
	// Slovak
	// ['ä', 'a'],
	// ['Ä', 'A'],
	// ['ľ', 'l'],
	// ['ĺ', 'l'],
	// ['ŕ', 'r'],
	// ['Ľ', 'L'],
	// ['Ĺ', 'L'],
	// ['Ŕ', 'R'],

	// Disabled as it conflicts with German and Latin.
	// Swedish
	// ['å', 'o'],
	// ['Å', 'o'],
	// ['ä', 'a'],
	// ['Ä', 'A'],
	// ['ë', 'e'],
	// ['Ë', 'E'],
	// ['ö', 'o'],
	// ['Ö', 'O'],

	// Ukrainian
	['Є', 'Ye'],
	['І', 'I'],
	['Ї', 'Yi'],
	['Ґ', 'G'],
	['є', 'ye'],
	['і', 'i'],
	['ї', 'yi'],
	['ґ', 'g'],

	// Dutch
	['Ĳ', 'IJ'],
	['ĳ', 'ij'],

	// Danish
	// ['Æ', 'Ae'],
	// ['Ø', 'Oe'],
	// ['Å', 'Aa'],
	// ['æ', 'ae'],
	// ['ø', 'oe'],
	// ['å', 'aa']

	// Currencies
	['¢', 'c'],
	['¥', 'Y'],
	['߿', 'b'],
	['৳', 't'],
	['૱', 'Bo'],
	['฿', 'B'],
	['₠', 'CE'],
	['₡', 'C'],
	['₢', 'Cr'],
	['₣', 'F'],
	['₥', 'm'],
	['₦', 'N'],
	['₧', 'Pt'],
	['₨', 'Rs'],
	['₩', 'W'],
	['₫', 's'],
	['€', 'E'],
	['₭', 'K'],
	['₮', 'T'],
	['₯', 'Dp'],
	['₰', 'S'],
	['₱', 'P'],
	['₲', 'G'],
	['₳', 'A'],
	['₴', 'S'],
	['₵', 'C'],
	['₶', 'tt'],
	['₷', 'S'],
	['₸', 'T'],
	['₹', 'R'],
	['₺', 'L'],
	['₽', 'P'],
	['₿', 'B'],
	['﹩', '$'],
	['￠', 'c'],
	['￥', 'Y'],
	['￦', 'W'],

	// Latin
	['𝐀', 'A'],
	['𝐁', 'B'],
	['𝐂', 'C'],
	['𝐃', 'D'],
	['𝐄', 'E'],
	['𝐅', 'F'],
	['𝐆', 'G'],
	['𝐇', 'H'],
	['𝐈', 'I'],
	['𝐉', 'J'],
	['𝐊', 'K'],
	['𝐋', 'L'],
	['𝐌', 'M'],
	['𝐍', 'N'],
	['𝐎', 'O'],
	['𝐏', 'P'],
	['𝐐', 'Q'],
	['𝐑', 'R'],
	['𝐒', 'S'],
	['𝐓', 'T'],
	['𝐔', 'U'],
	['𝐕', 'V'],
	['𝐖', 'W'],
	['𝐗', 'X'],
	['𝐘', 'Y'],
	['𝐙', 'Z'],
	['𝐚', 'a'],
	['𝐛', 'b'],
	['𝐜', 'c'],
	['𝐝', 'd'],
	['𝐞', 'e'],
	['𝐟', 'f'],
	['𝐠', 'g'],
	['𝐡', 'h'],
	['𝐢', 'i'],
	['𝐣', 'j'],
	['𝐤', 'k'],
	['𝐥', 'l'],
	['𝐦', 'm'],
	['𝐧', 'n'],
	['𝐨', 'o'],
	['𝐩', 'p'],
	['𝐪', 'q'],
	['𝐫', 'r'],
	['𝐬', 's'],
	['𝐭', 't'],
	['𝐮', 'u'],
	['𝐯', 'v'],
	['𝐰', 'w'],
	['𝐱', 'x'],
	['𝐲', 'y'],
	['𝐳', 'z'],
	['𝐴', 'A'],
	['𝐵', 'B'],
	['𝐶', 'C'],
	['𝐷', 'D'],
	['𝐸', 'E'],
	['𝐹', 'F'],
	['𝐺', 'G'],
	['𝐻', 'H'],
	['𝐼', 'I'],
	['𝐽', 'J'],
	['𝐾', 'K'],
	['𝐿', 'L'],
	['𝑀', 'M'],
	['𝑁', 'N'],
	['𝑂', 'O'],
	['𝑃', 'P'],
	['𝑄', 'Q'],
	['𝑅', 'R'],
	['𝑆', 'S'],
	['𝑇', 'T'],
	['𝑈', 'U'],
	['𝑉', 'V'],
	['𝑊', 'W'],
	['𝑋', 'X'],
	['𝑌', 'Y'],
	['𝑍', 'Z'],
	['𝑎', 'a'],
	['𝑏', 'b'],
	['𝑐', 'c'],
	['𝑑', 'd'],
	['𝑒', 'e'],
	['𝑓', 'f'],
	['𝑔', 'g'],
	['𝑖', 'i'],
	['𝑗', 'j'],
	['𝑘', 'k'],
	['𝑙', 'l'],
	['𝑚', 'm'],
	['𝑛', 'n'],
	['𝑜', 'o'],
	['𝑝', 'p'],
	['𝑞', 'q'],
	['𝑟', 'r'],
	['𝑠', 's'],
	['𝑡', 't'],
	['𝑢', 'u'],
	['𝑣', 'v'],
	['𝑤', 'w'],
	['𝑥', 'x'],
	['𝑦', 'y'],
	['𝑧', 'z'],
	['𝑨', 'A'],
	['𝑩', 'B'],
	['𝑪', 'C'],
	['𝑫', 'D'],
	['𝑬', 'E'],
	['𝑭', 'F'],
	['𝑮', 'G'],
	['𝑯', 'H'],
	['𝑰', 'I'],
	['𝑱', 'J'],
	['𝑲', 'K'],
	['𝑳', 'L'],
	['𝑴', 'M'],
	['𝑵', 'N'],
	['𝑶', 'O'],
	['𝑷', 'P'],
	['𝑸', 'Q'],
	['𝑹', 'R'],
	['𝑺', 'S'],
	['𝑻', 'T'],
	['𝑼', 'U'],
	['𝑽', 'V'],
	['𝑾', 'W'],
	['𝑿', 'X'],
	['𝒀', 'Y'],
	['𝒁', 'Z'],
	['𝒂', 'a'],
	['𝒃', 'b'],
	['𝒄', 'c'],
	['𝒅', 'd'],
	['𝒆', 'e'],
	['𝒇', 'f'],
	['𝒈', 'g'],
	['𝒉', 'h'],
	['𝒊', 'i'],
	['𝒋', 'j'],
	['𝒌', 'k'],
	['𝒍', 'l'],
	['𝒎', 'm'],
	['𝒏', 'n'],
	['𝒐', 'o'],
	['𝒑', 'p'],
	['𝒒', 'q'],
	['𝒓', 'r'],
	['𝒔', 's'],
	['𝒕', 't'],
	['𝒖', 'u'],
	['𝒗', 'v'],
	['𝒘', 'w'],
	['𝒙', 'x'],
	['𝒚', 'y'],
	['𝒛', 'z'],
	['𝒜', 'A'],
	['𝒞', 'C'],
	['𝒟', 'D'],
	['𝒢', 'g'],
	['𝒥', 'J'],
	['𝒦', 'K'],
	['𝒩', 'N'],
	['𝒪', 'O'],
	['𝒫', 'P'],
	['𝒬', 'Q'],
	['𝒮', 'S'],
	['𝒯', 'T'],
	['𝒰', 'U'],
	['𝒱', 'V'],
	['𝒲', 'W'],
	['𝒳', 'X'],
	['𝒴', 'Y'],
	['𝒵', 'Z'],
	['𝒶', 'a'],
	['𝒷', 'b'],
	['𝒸', 'c'],
	['𝒹', 'd'],
	['𝒻', 'f'],
	['𝒽', 'h'],
	['𝒾', 'i'],
	['𝒿', 'j'],
	['𝓀', 'h'],
	['𝓁', 'l'],
	['𝓂', 'm'],
	['𝓃', 'n'],
	['𝓅', 'p'],
	['𝓆', 'q'],
	['𝓇', 'r'],
	['𝓈', 's'],
	['𝓉', 't'],
	['𝓊', 'u'],
	['𝓋', 'v'],
	['𝓌', 'w'],
	['𝓍', 'x'],
	['𝓎', 'y'],
	['𝓏', 'z'],
	['𝓐', 'A'],
	['𝓑', 'B'],
	['𝓒', 'C'],
	['𝓓', 'D'],
	['𝓔', 'E'],
	['𝓕', 'F'],
	['𝓖', 'G'],
	['𝓗', 'H'],
	['𝓘', 'I'],
	['𝓙', 'J'],
	['𝓚', 'K'],
	['𝓛', 'L'],
	['𝓜', 'M'],
	['𝓝', 'N'],
	['𝓞', 'O'],
	['𝓟', 'P'],
	['𝓠', 'Q'],
	['𝓡', 'R'],
	['𝓢', 'S'],
	['𝓣', 'T'],
	['𝓤', 'U'],
	['𝓥', 'V'],
	['𝓦', 'W'],
	['𝓧', 'X'],
	['𝓨', 'Y'],
	['𝓩', 'Z'],
	['𝓪', 'a'],
	['𝓫', 'b'],
	['𝓬', 'c'],
	['𝓭', 'd'],
	['𝓮', 'e'],
	['𝓯', 'f'],
	['𝓰', 'g'],
	['𝓱', 'h'],
	['𝓲', 'i'],
	['𝓳', 'j'],
	['𝓴', 'k'],
	['𝓵', 'l'],
	['𝓶', 'm'],
	['𝓷', 'n'],
	['𝓸', 'o'],
	['𝓹', 'p'],
	['𝓺', 'q'],
	['𝓻', 'r'],
	['𝓼', 's'],
	['𝓽', 't'],
	['𝓾', 'u'],
	['𝓿', 'v'],
	['𝔀', 'w'],
	['𝔁', 'x'],
	['𝔂', 'y'],
	['𝔃', 'z'],
	['𝔄', 'A'],
	['𝔅', 'B'],
	['𝔇', 'D'],
	['𝔈', 'E'],
	['𝔉', 'F'],
	['𝔊', 'G'],
	['𝔍', 'J'],
	['𝔎', 'K'],
	['𝔏', 'L'],
	['𝔐', 'M'],
	['𝔑', 'N'],
	['𝔒', 'O'],
	['𝔓', 'P'],
	['𝔔', 'Q'],
	['𝔖', 'S'],
	['𝔗', 'T'],
	['𝔘', 'U'],
	['𝔙', 'V'],
	['𝔚', 'W'],
	['𝔛', 'X'],
	['𝔜', 'Y'],
	['𝔞', 'a'],
	['𝔟', 'b'],
	['𝔠', 'c'],
	['𝔡', 'd'],
	['𝔢', 'e'],
	['𝔣', 'f'],
	['𝔤', 'g'],
	['𝔥', 'h'],
	['𝔦', 'i'],
	['𝔧', 'j'],
	['𝔨', 'k'],
	['𝔩', 'l'],
	['𝔪', 'm'],
	['𝔫', 'n'],
	['𝔬', 'o'],
	['𝔭', 'p'],
	['𝔮', 'q'],
	['𝔯', 'r'],
	['𝔰', 's'],
	['𝔱', 't'],
	['𝔲', 'u'],
	['𝔳', 'v'],
	['𝔴', 'w'],
	['𝔵', 'x'],
	['𝔶', 'y'],
	['𝔷', 'z'],
	['𝔸', 'A'],
	['𝔹', 'B'],
	['𝔻', 'D'],
	['𝔼', 'E'],
	['𝔽', 'F'],
	['𝔾', 'G'],
	['𝕀', 'I'],
	['𝕁', 'J'],
	['𝕂', 'K'],
	['𝕃', 'L'],
	['𝕄', 'M'],
	['𝕆', 'N'],
	['𝕊', 'S'],
	['𝕋', 'T'],
	['𝕌', 'U'],
	['𝕍', 'V'],
	['𝕎', 'W'],
	['𝕏', 'X'],
	['𝕐', 'Y'],
	['𝕒', 'a'],
	['𝕓', 'b'],
	['𝕔', 'c'],
	['𝕕', 'd'],
	['𝕖', 'e'],
	['𝕗', 'f'],
	['𝕘', 'g'],
	['𝕙', 'h'],
	['𝕚', 'i'],
	['𝕛', 'j'],
	['𝕜', 'k'],
	['𝕝', 'l'],
	['𝕞', 'm'],
	['𝕟', 'n'],
	['𝕠', 'o'],
	['𝕡', 'p'],
	['𝕢', 'q'],
	['𝕣', 'r'],
	['𝕤', 's'],
	['𝕥', 't'],
	['𝕦', 'u'],
	['𝕧', 'v'],
	['𝕨', 'w'],
	['𝕩', 'x'],
	['𝕪', 'y'],
	['𝕫', 'z'],
	['𝕬', 'A'],
	['𝕭', 'B'],
	['𝕮', 'C'],
	['𝕯', 'D'],
	['𝕰', 'E'],
	['𝕱', 'F'],
	['𝕲', 'G'],
	['𝕳', 'H'],
	['𝕴', 'I'],
	['𝕵', 'J'],
	['𝕶', 'K'],
	['𝕷', 'L'],
	['𝕸', 'M'],
	['𝕹', 'N'],
	['𝕺', 'O'],
	['𝕻', 'P'],
	['𝕼', 'Q'],
	['𝕽', 'R'],
	['𝕾', 'S'],
	['𝕿', 'T'],
	['𝖀', 'U'],
	['𝖁', 'V'],
	['𝖂', 'W'],
	['𝖃', 'X'],
	['𝖄', 'Y'],
	['𝖅', 'Z'],
	['𝖆', 'a'],
	['𝖇', 'b'],
	['𝖈', 'c'],
	['𝖉', 'd'],
	['𝖊', 'e'],
	['𝖋', 'f'],
	['𝖌', 'g'],
	['𝖍', 'h'],
	['𝖎', 'i'],
	['𝖏', 'j'],
	['𝖐', 'k'],
	['𝖑', 'l'],
	['𝖒', 'm'],
	['𝖓', 'n'],
	['𝖔', 'o'],
	['𝖕', 'p'],
	['𝖖', 'q'],
	['𝖗', 'r'],
	['𝖘', 's'],
	['𝖙', 't'],
	['𝖚', 'u'],
	['𝖛', 'v'],
	['𝖜', 'w'],
	['𝖝', 'x'],
	['𝖞', 'y'],
	['𝖟', 'z'],
	['𝖠', 'A'],
	['𝖡', 'B'],
	['𝖢', 'C'],
	['𝖣', 'D'],
	['𝖤', 'E'],
	['𝖥', 'F'],
	['𝖦', 'G'],
	['𝖧', 'H'],
	['𝖨', 'I'],
	['𝖩', 'J'],
	['𝖪', 'K'],
	['𝖫', 'L'],
	['𝖬', 'M'],
	['𝖭', 'N'],
	['𝖮', 'O'],
	['𝖯', 'P'],
	['𝖰', 'Q'],
	['𝖱', 'R'],
	['𝖲', 'S'],
	['𝖳', 'T'],
	['𝖴', 'U'],
	['𝖵', 'V'],
	['𝖶', 'W'],
	['𝖷', 'X'],
	['𝖸', 'Y'],
	['𝖹', 'Z'],
	['𝖺', 'a'],
	['𝖻', 'b'],
	['𝖼', 'c'],
	['𝖽', 'd'],
	['𝖾', 'e'],
	['𝖿', 'f'],
	['𝗀', 'g'],
	['𝗁', 'h'],
	['𝗂', 'i'],
	['𝗃', 'j'],
	['𝗄', 'k'],
	['𝗅', 'l'],
	['𝗆', 'm'],
	['𝗇', 'n'],
	['𝗈', 'o'],
	['𝗉', 'p'],
	['𝗊', 'q'],
	['𝗋', 'r'],
	['𝗌', 's'],
	['𝗍', 't'],
	['𝗎', 'u'],
	['𝗏', 'v'],
	['𝗐', 'w'],
	['𝗑', 'x'],
	['𝗒', 'y'],
	['𝗓', 'z'],
	['𝗔', 'A'],
	['𝗕', 'B'],
	['𝗖', 'C'],
	['𝗗', 'D'],
	['𝗘', 'E'],
	['𝗙', 'F'],
	['𝗚', 'G'],
	['𝗛', 'H'],
	['𝗜', 'I'],
	['𝗝', 'J'],
	['𝗞', 'K'],
	['𝗟', 'L'],
	['𝗠', 'M'],
	['𝗡', 'N'],
	['𝗢', 'O'],
	['𝗣', 'P'],
	['𝗤', 'Q'],
	['𝗥', 'R'],
	['𝗦', 'S'],
	['𝗧', 'T'],
	['𝗨', 'U'],
	['𝗩', 'V'],
	['𝗪', 'W'],
	['𝗫', 'X'],
	['𝗬', 'Y'],
	['𝗭', 'Z'],
	['𝗮', 'a'],
	['𝗯', 'b'],
	['𝗰', 'c'],
	['𝗱', 'd'],
	['𝗲', 'e'],
	['𝗳', 'f'],
	['𝗴', 'g'],
	['𝗵', 'h'],
	['𝗶', 'i'],
	['𝗷', 'j'],
	['𝗸', 'k'],
	['𝗹', 'l'],
	['𝗺', 'm'],
	['𝗻', 'n'],
	['𝗼', 'o'],
	['𝗽', 'p'],
	['𝗾', 'q'],
	['𝗿', 'r'],
	['𝘀', 's'],
	['𝘁', 't'],
	['𝘂', 'u'],
	['𝘃', 'v'],
	['𝘄', 'w'],
	['𝘅', 'x'],
	['𝘆', 'y'],
	['𝘇', 'z'],
	['𝘈', 'A'],
	['𝘉', 'B'],
	['𝘊', 'C'],
	['𝘋', 'D'],
	['𝘌', 'E'],
	['𝘍', 'F'],
	['𝘎', 'G'],
	['𝘏', 'H'],
	['𝘐', 'I'],
	['𝘑', 'J'],
	['𝘒', 'K'],
	['𝘓', 'L'],
	['𝘔', 'M'],
	['𝘕', 'N'],
	['𝘖', 'O'],
	['𝘗', 'P'],
	['𝘘', 'Q'],
	['𝘙', 'R'],
	['𝘚', 'S'],
	['𝘛', 'T'],
	['𝘜', 'U'],
	['𝘝', 'V'],
	['𝘞', 'W'],
	['𝘟', 'X'],
	['𝘠', 'Y'],
	['𝘡', 'Z'],
	['𝘢', 'a'],
	['𝘣', 'b'],
	['𝘤', 'c'],
	['𝘥', 'd'],
	['𝘦', 'e'],
	['𝘧', 'f'],
	['𝘨', 'g'],
	['𝘩', 'h'],
	['𝘪', 'i'],
	['𝘫', 'j'],
	['𝘬', 'k'],
	['𝘭', 'l'],
	['𝘮', 'm'],
	['𝘯', 'n'],
	['𝘰', 'o'],
	['𝘱', 'p'],
	['𝘲', 'q'],
	['𝘳', 'r'],
	['𝘴', 's'],
	['𝘵', 't'],
	['𝘶', 'u'],
	['𝘷', 'v'],
	['𝘸', 'w'],
	['𝘹', 'x'],
	['𝘺', 'y'],
	['𝘻', 'z'],
	['𝘼', 'A'],
	['𝘽', 'B'],
	['𝘾', 'C'],
	['𝘿', 'D'],
	['𝙀', 'E'],
	['𝙁', 'F'],
	['𝙂', 'G'],
	['𝙃', 'H'],
	['𝙄', 'I'],
	['𝙅', 'J'],
	['𝙆', 'K'],
	['𝙇', 'L'],
	['𝙈', 'M'],
	['𝙉', 'N'],
	['𝙊', 'O'],
	['𝙋', 'P'],
	['𝙌', 'Q'],
	['𝙍', 'R'],
	['𝙎', 'S'],
	['𝙏', 'T'],
	['𝙐', 'U'],
	['𝙑', 'V'],
	['𝙒', 'W'],
	['𝙓', 'X'],
	['𝙔', 'Y'],
	['𝙕', 'Z'],
	['𝙖', 'a'],
	['𝙗', 'b'],
	['𝙘', 'c'],
	['𝙙', 'd'],
	['𝙚', 'e'],
	['𝙛', 'f'],
	['𝙜', 'g'],
	['𝙝', 'h'],
	['𝙞', 'i'],
	['𝙟', 'j'],
	['𝙠', 'k'],
	['𝙡', 'l'],
	['𝙢', 'm'],
	['𝙣', 'n'],
	['𝙤', 'o'],
	['𝙥', 'p'],
	['𝙦', 'q'],
	['𝙧', 'r'],
	['𝙨', 's'],
	['𝙩', 't'],
	['𝙪', 'u'],
	['𝙫', 'v'],
	['𝙬', 'w'],
	['𝙭', 'x'],
	['𝙮', 'y'],
	['𝙯', 'z'],
	['𝙰', 'A'],
	['𝙱', 'B'],
	['𝙲', 'C'],
	['𝙳', 'D'],
	['𝙴', 'E'],
	['𝙵', 'F'],
	['𝙶', 'G'],
	['𝙷', 'H'],
	['𝙸', 'I'],
	['𝙹', 'J'],
	['𝙺', 'K'],
	['𝙻', 'L'],
	['𝙼', 'M'],
	['𝙽', 'N'],
	['𝙾', 'O'],
	['𝙿', 'P'],
	['𝚀', 'Q'],
	['𝚁', 'R'],
	['𝚂', 'S'],
	['𝚃', 'T'],
	['𝚄', 'U'],
	['𝚅', 'V'],
	['𝚆', 'W'],
	['𝚇', 'X'],
	['𝚈', 'Y'],
	['𝚉', 'Z'],
	['𝚊', 'a'],
	['𝚋', 'b'],
	['𝚌', 'c'],
	['𝚍', 'd'],
	['𝚎', 'e'],
	['𝚏', 'f'],
	['𝚐', 'g'],
	['𝚑', 'h'],
	['𝚒', 'i'],
	['𝚓', 'j'],
	['𝚔', 'k'],
	['𝚕', 'l'],
	['𝚖', 'm'],
	['𝚗', 'n'],
	['𝚘', 'o'],
	['𝚙', 'p'],
	['𝚚', 'q'],
	['𝚛', 'r'],
	['𝚜', 's'],
	['𝚝', 't'],
	['𝚞', 'u'],
	['𝚟', 'v'],
	['𝚠', 'w'],
	['𝚡', 'x'],
	['𝚢', 'y'],
	['𝚣', 'z'],

	// Dotless letters
	['𝚤', 'l'],
	['𝚥', 'j'],

	// Greek
	['𝛢', 'A'],
	['𝛣', 'B'],
	['𝛤', 'G'],
	['𝛥', 'D'],
	['𝛦', 'E'],
	['𝛧', 'Z'],
	['𝛨', 'I'],
	['𝛩', 'TH'],
	['𝛪', 'I'],
	['𝛫', 'K'],
	['𝛬', 'L'],
	['𝛭', 'M'],
	['𝛮', 'N'],
	['𝛯', 'KS'],
	['𝛰', 'O'],
	['𝛱', 'P'],
	['𝛲', 'R'],
	['𝛳', 'TH'],
	['𝛴', 'S'],
	['𝛵', 'T'],
	['𝛶', 'Y'],
	['𝛷', 'F'],
	['𝛸', 'x'],
	['𝛹', 'PS'],
	['𝛺', 'O'],
	['𝛻', 'D'],
	['𝛼', 'a'],
	['𝛽', 'b'],
	['𝛾', 'g'],
	['𝛿', 'd'],
	['𝜀', 'e'],
	['𝜁', 'z'],
	['𝜂', 'i'],
	['𝜃', 'th'],
	['𝜄', 'i'],
	['𝜅', 'k'],
	['𝜆', 'l'],
	['𝜇', 'm'],
	['𝜈', 'n'],
	['𝜉', 'ks'],
	['𝜊', 'o'],
	['𝜋', 'p'],
	['𝜌', 'r'],
	['𝜍', 's'],
	['𝜎', 's'],
	['𝜏', 't'],
	['𝜐', 'y'],
	['𝜑', 'f'],
	['𝜒', 'x'],
	['𝜓', 'ps'],
	['𝜔', 'o'],
	['𝜕', 'd'],
	['𝜖', 'E'],
	['𝜗', 'TH'],
	['𝜘', 'K'],
	['𝜙', 'f'],
	['𝜚', 'r'],
	['𝜛', 'p'],
	['𝜜', 'A'],
	['𝜝', 'V'],
	['𝜞', 'G'],
	['𝜟', 'D'],
	['𝜠', 'E'],
	['𝜡', 'Z'],
	['𝜢', 'I'],
	['𝜣', 'TH'],
	['𝜤', 'I'],
	['𝜥', 'K'],
	['𝜦', 'L'],
	['𝜧', 'M'],
	['𝜨', 'N'],
	['𝜩', 'KS'],
	['𝜪', 'O'],
	['𝜫', 'P'],
	['𝜬', 'S'],
	['𝜭', 'TH'],
	['𝜮', 'S'],
	['𝜯', 'T'],
	['𝜰', 'Y'],
	['𝜱', 'F'],
	['𝜲', 'X'],
	['𝜳', 'PS'],
	['𝜴', 'O'],
	['𝜵', 'D'],
	['𝜶', 'a'],
	['𝜷', 'v'],
	['𝜸', 'g'],
	['𝜹', 'd'],
	['𝜺', 'e'],
	['𝜻', 'z'],
	['𝜼', 'i'],
	['𝜽', 'th'],
	['𝜾', 'i'],
	['𝜿', 'k'],
	['𝝀', 'l'],
	['𝝁', 'm'],
	['𝝂', 'n'],
	['𝝃', 'ks'],
	['𝝄', 'o'],
	['𝝅', 'p'],
	['𝝆', 'r'],
	['𝝇', 's'],
	['𝝈', 's'],
	['𝝉', 't'],
	['𝝊', 'y'],
	['𝝋', 'f'],
	['𝝌', 'x'],
	['𝝍', 'ps'],
	['𝝎', 'o'],
	['𝝏', 'a'],
	['𝝐', 'e'],
	['𝝑', 'i'],
	['𝝒', 'k'],
	['𝝓', 'f'],
	['𝝔', 'r'],
	['𝝕', 'p'],
	['𝝖', 'A'],
	['𝝗', 'B'],
	['𝝘', 'G'],
	['𝝙', 'D'],
	['𝝚', 'E'],
	['𝝛', 'Z'],
	['𝝜', 'I'],
	['𝝝', 'TH'],
	['𝝞', 'I'],
	['𝝟', 'K'],
	['𝝠', 'L'],
	['𝝡', 'M'],
	['𝝢', 'N'],
	['𝝣', 'KS'],
	['𝝤', 'O'],
	['𝝥', 'P'],
	['𝝦', 'R'],
	['𝝧', 'TH'],
	['𝝨', 'S'],
	['𝝩', 'T'],
	['𝝪', 'Y'],
	['𝝫', 'F'],
	['𝝬', 'X'],
	['𝝭', 'PS'],
	['𝝮', 'O'],
	['𝝯', 'D'],
	['𝝰', 'a'],
	['𝝱', 'v'],
	['𝝲', 'g'],
	['𝝳', 'd'],
	['𝝴', 'e'],
	['𝝵', 'z'],
	['𝝶', 'i'],
	['𝝷', 'th'],
	['𝝸', 'i'],
	['𝝹', 'k'],
	['𝝺', 'l'],
	['𝝻', 'm'],
	['𝝼', 'n'],
	['𝝽', 'ks'],
	['𝝾', 'o'],
	['𝝿', 'p'],
	['𝞀', 'r'],
	['𝞁', 's'],
	['𝞂', 's'],
	['𝞃', 't'],
	['𝞄', 'y'],
	['𝞅', 'f'],
	['𝞆', 'x'],
	['𝞇', 'ps'],
	['𝞈', 'o'],
	['𝞉', 'a'],
	['𝞊', 'e'],
	['𝞋', 'i'],
	['𝞌', 'k'],
	['𝞍', 'f'],
	['𝞎', 'r'],
	['𝞏', 'p'],
	['𝞐', 'A'],
	['𝞑', 'V'],
	['𝞒', 'G'],
	['𝞓', 'D'],
	['𝞔', 'E'],
	['𝞕', 'Z'],
	['𝞖', 'I'],
	['𝞗', 'TH'],
	['𝞘', 'I'],
	['𝞙', 'K'],
	['𝞚', 'L'],
	['𝞛', 'M'],
	['𝞜', 'N'],
	['𝞝', 'KS'],
	['𝞞', 'O'],
	['𝞟', 'P'],
	['𝞠', 'S'],
	['𝞡', 'TH'],
	['𝞢', 'S'],
	['𝞣', 'T'],
	['𝞤', 'Y'],
	['𝞥', 'F'],
	['𝞦', 'X'],
	['𝞧', 'PS'],
	['𝞨', 'O'],
	['𝞩', 'D'],
	['𝞪', 'av'],
	['𝞫', 'g'],
	['𝞬', 'd'],
	['𝞭', 'e'],
	['𝞮', 'z'],
	['𝞯', 'i'],
	['𝞰', 'i'],
	['𝞱', 'th'],
	['𝞲', 'i'],
	['𝞳', 'k'],
	['𝞴', 'l'],
	['𝞵', 'm'],
	['𝞶', 'n'],
	['𝞷', 'ks'],
	['𝞸', 'o'],
	['𝞹', 'p'],
	['𝞺', 'r'],
	['𝞻', 's'],
	['𝞼', 's'],
	['𝞽', 't'],
	['𝞾', 'y'],
	['𝞿', 'f'],
	['𝟀', 'x'],
	['𝟁', 'ps'],
	['𝟂', 'o'],
	['𝟃', 'a'],
	['𝟄', 'e'],
	['𝟅', 'i'],
	['𝟆', 'k'],
	['𝟇', 'f'],
	['𝟈', 'r'],
	['𝟉', 'p'],
	['𝟊', 'F'],
	['𝟋', 'f'],
	['⒜', '(a)'],
	['⒝', '(b)'],
	['⒞', '(c)'],
	['⒟', '(d)'],
	['⒠', '(e)'],
	['⒡', '(f)'],
	['⒢', '(g)'],
	['⒣', '(h)'],
	['⒤', '(i)'],
	['⒥', '(j)'],
	['⒦', '(k)'],
	['⒧', '(l)'],
	['⒨', '(m)'],
	['⒩', '(n)'],
	['⒪', '(o)'],
	['⒫', '(p)'],
	['⒬', '(q)'],
	['⒭', '(r)'],
	['⒮', '(s)'],
	['⒯', '(t)'],
	['⒰', '(u)'],
	['⒱', '(v)'],
	['⒲', '(w)'],
	['⒳', '(x)'],
	['⒴', '(y)'],
	['⒵', '(z)'],
	['Ⓐ', '(A)'],
	['Ⓑ', '(B)'],
	['Ⓒ', '(C)'],
	['Ⓓ', '(D)'],
	['Ⓔ', '(E)'],
	['Ⓕ', '(F)'],
	['Ⓖ', '(G)'],
	['Ⓗ', '(H)'],
	['Ⓘ', '(I)'],
	['Ⓙ', '(J)'],
	['Ⓚ', '(K)'],
	['Ⓛ', '(L)'],
	['Ⓝ', '(N)'],
	['Ⓞ', '(O)'],
	['Ⓟ', '(P)'],
	['Ⓠ', '(Q)'],
	['Ⓡ', '(R)'],
	['Ⓢ', '(S)'],
	['Ⓣ', '(T)'],
	['Ⓤ', '(U)'],
	['Ⓥ', '(V)'],
	['Ⓦ', '(W)'],
	['Ⓧ', '(X)'],
	['Ⓨ', '(Y)'],
	['Ⓩ', '(Z)'],
	['ⓐ', '(a)'],
	['ⓑ', '(b)'],
	['ⓒ', '(b)'],
	['ⓓ', '(c)'],
	['ⓔ', '(e)'],
	['ⓕ', '(f)'],
	['ⓖ', '(g)'],
	['ⓗ', '(h)'],
	['ⓘ', '(i)'],
	['ⓙ', '(j)'],
	['ⓚ', '(k)'],
	['ⓛ', '(l)'],
	['ⓜ', '(m)'],
	['ⓝ', '(n)'],
	['ⓞ', '(o)'],
	['ⓟ', '(p)'],
	['ⓠ', '(q)'],
	['ⓡ', '(r)'],
	['ⓢ', '(s)'],
	['ⓣ', '(t)'],
	['ⓤ', '(u)'],
	['ⓥ', '(v)'],
	['ⓦ', '(w)'],
	['ⓧ', '(x)'],
	['ⓨ', '(y)'],
	['ⓩ', '(z)'],

	// Maltese
	['Ċ', 'C'],
	['ċ', 'c'],
	['Ġ', 'G'],
	['ġ', 'g'],
	['Ħ', 'H'],
	['ħ', 'h'],
	['Ż', 'Z'],
	['ż', 'z'],

	// Numbers
	['𝟎', '0'],
	['𝟏', '1'],
	['𝟐', '2'],
	['𝟑', '3'],
	['𝟒', '4'],
	['𝟓', '5'],
	['𝟔', '6'],
	['𝟕', '7'],
	['𝟖', '8'],
	['𝟗', '9'],
	['𝟘', '0'],
	['𝟙', '1'],
	['𝟚', '2'],
	['𝟛', '3'],
	['𝟜', '4'],
	['𝟝', '5'],
	['𝟞', '6'],
	['𝟟', '7'],
	['𝟠', '8'],
	['𝟡', '9'],
	['𝟢', '0'],
	['𝟣', '1'],
	['𝟤', '2'],
	['𝟥', '3'],
	['𝟦', '4'],
	['𝟧', '5'],
	['𝟨', '6'],
	['𝟩', '7'],
	['𝟪', '8'],
	['𝟫', '9'],
	['𝟬', '0'],
	['𝟭', '1'],
	['𝟮', '2'],
	['𝟯', '3'],
	['𝟰', '4'],
	['𝟱', '5'],
	['𝟲', '6'],
	['𝟳', '7'],
	['𝟴', '8'],
	['𝟵', '9'],
	['𝟶', '0'],
	['𝟷', '1'],
	['𝟸', '2'],
	['𝟹', '3'],
	['𝟺', '4'],
	['𝟻', '5'],
	['𝟼', '6'],
	['𝟽', '7'],
	['𝟾', '8'],
	['𝟿', '9'],
	['①', '1'],
	['②', '2'],
	['③', '3'],
	['④', '4'],
	['⑤', '5'],
	['⑥', '6'],
	['⑦', '7'],
	['⑧', '8'],
	['⑨', '9'],
	['⑩', '10'],
	['⑪', '11'],
	['⑫', '12'],
	['⑬', '13'],
	['⑭', '14'],
	['⑮', '15'],
	['⑯', '16'],
	['⑰', '17'],
	['⑱', '18'],
	['⑲', '19'],
	['⑳', '20'],
	['⑴', '1'],
	['⑵', '2'],
	['⑶', '3'],
	['⑷', '4'],
	['⑸', '5'],
	['⑹', '6'],
	['⑺', '7'],
	['⑻', '8'],
	['⑼', '9'],
	['⑽', '10'],
	['⑾', '11'],
	['⑿', '12'],
	['⒀', '13'],
	['⒁', '14'],
	['⒂', '15'],
	['⒃', '16'],
	['⒄', '17'],
	['⒅', '18'],
	['⒆', '19'],
	['⒇', '20'],
	['⒈', '1.'],
	['⒉', '2.'],
	['⒊', '3.'],
	['⒋', '4.'],
	['⒌', '5.'],
	['⒍', '6.'],
	['⒎', '7.'],
	['⒏', '8.'],
	['⒐', '9.'],
	['⒑', '10.'],
	['⒒', '11.'],
	['⒓', '12.'],
	['⒔', '13.'],
	['⒕', '14.'],
	['⒖', '15.'],
	['⒗', '16.'],
	['⒘', '17.'],
	['⒙', '18.'],
	['⒚', '19.'],
	['⒛', '20.'],
	['⓪', '0'],
	['⓫', '11'],
	['⓬', '12'],
	['⓭', '13'],
	['⓮', '14'],
	['⓯', '15'],
	['⓰', '16'],
	['⓱', '17'],
	['⓲', '18'],
	['⓳', '19'],
	['⓴', '20'],
	['⓵', '1'],
	['⓶', '2'],
	['⓷', '3'],
	['⓸', '4'],
	['⓹', '5'],
	['⓺', '6'],
	['⓻', '7'],
	['⓼', '8'],
	['⓽', '9'],
	['⓾', '10'],
	['⓿', '0'],

	// Punctuation
	['🙰', '&'],
	['🙱', '&'],
	['🙲', '&'],
	['🙳', '&'],
	['🙴', '&'],
	['🙵', '&'],
	['🙶', '"'],
	['🙷', '"'],
	['🙸', '"'],
	['‽', '?!'],
	['🙹', '?!'],
	['🙺', '?!'],
	['🙻', '?!'],
	['🙼', '/'],
	['🙽', '\\'],

	// Alchemy
	['🜇', 'AR'],
	['🜈', 'V'],
	['🜉', 'V'],
	['🜆', 'VR'],
	['🜅', 'VF'],
	['🜩', '2'],
	['🜪', '5'],
	['🝡', 'f'],
	['🝢', 'W'],
	['🝣', 'U'],
	['🝧', 'V'],
	['🝨', 'T'],
	['🝪', 'V'],
	['🝫', 'MB'],
	['🝬', 'VB'],
	['🝲', '3B'],
	['🝳', '3B'],

	// Emojis
	['💯', '100'],
	['🔙', 'BACK'],
	['🔚', 'END'],
	['🔛', 'ON!'],
	['🔜', 'SOON'],
	['🔝', 'TOP'],
	['🔞', '18'],
	['🔤', 'abc'],
	['🔠', 'ABCD'],
	['🔡', 'abcd'],
	['🔢', '1234'],
	['🔣', 'T&@%'],
	['#️⃣', '#'],
	['*️⃣', '*'],
	['0️⃣', '0'],
	['1️⃣', '1'],
	['2️⃣', '2'],
	['3️⃣', '3'],
	['4️⃣', '4'],
	['5️⃣', '5'],
	['6️⃣', '6'],
	['7️⃣', '7'],
	['8️⃣', '8'],
	['9️⃣', '9'],
	['🔟', '10'],
	['🅰️', 'A'],
	['🅱️', 'B'],
	['🆎', 'AB'],
	['🆑', 'CL'],
	['🅾️', 'O'],
	['🅿', 'P'],
	['🆘', 'SOS'],
	['🅲', 'C'],
	['🅳', 'D'],
	['🅴', 'E'],
	['🅵', 'F'],
	['🅶', 'G'],
	['🅷', 'H'],
	['🅸', 'I'],
	['🅹', 'J'],
	['🅺', 'K'],
	['🅻', 'L'],
	['🅼', 'M'],
	['🅽', 'N'],
	['🆀', 'Q'],
	['🆁', 'R'],
	['🆂', 'S'],
	['🆃', 'T'],
	['🆄', 'U'],
	['🆅', 'V'],
	['🆆', 'W'],
	['🆇', 'X'],
	['🆈', 'Y'],
	['🆉', 'Z']
];

/* harmony default export */ __webpack_exports__["default"] = (replacements);


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
/******/ 	/* webpack/runtime/global */
/******/ 	!function() {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
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