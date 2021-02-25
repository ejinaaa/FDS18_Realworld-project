/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/axios/index.js":
/*!*************************************!*\
  !*** ./node_modules/axios/index.js ***!
  \*************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = __webpack_require__(/*! ./lib/axios */ "./node_modules/axios/lib/axios.js");

/***/ }),

/***/ "./node_modules/axios/lib/adapters/xhr.js":
/*!************************************************!*\
  !*** ./node_modules/axios/lib/adapters/xhr.js ***!
  \************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");
var settle = __webpack_require__(/*! ./../core/settle */ "./node_modules/axios/lib/core/settle.js");
var cookies = __webpack_require__(/*! ./../helpers/cookies */ "./node_modules/axios/lib/helpers/cookies.js");
var buildURL = __webpack_require__(/*! ./../helpers/buildURL */ "./node_modules/axios/lib/helpers/buildURL.js");
var buildFullPath = __webpack_require__(/*! ../core/buildFullPath */ "./node_modules/axios/lib/core/buildFullPath.js");
var parseHeaders = __webpack_require__(/*! ./../helpers/parseHeaders */ "./node_modules/axios/lib/helpers/parseHeaders.js");
var isURLSameOrigin = __webpack_require__(/*! ./../helpers/isURLSameOrigin */ "./node_modules/axios/lib/helpers/isURLSameOrigin.js");
var createError = __webpack_require__(/*! ../core/createError */ "./node_modules/axios/lib/core/createError.js");

module.exports = function xhrAdapter(config) {
  return new Promise(function dispatchXhrRequest(resolve, reject) {
    var requestData = config.data;
    var requestHeaders = config.headers;

    if (utils.isFormData(requestData)) {
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

    // Listen for ready state
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

      // Prepare the response
      var responseHeaders = 'getAllResponseHeaders' in request ? parseHeaders(request.getAllResponseHeaders()) : null;
      var responseData = !config.responseType || config.responseType === 'text' ? request.responseText : request.response;
      var response = {
        data: responseData,
        status: request.status,
        statusText: request.statusText,
        headers: responseHeaders,
        config: config,
        request: request
      };

      settle(resolve, reject, response);

      // Clean up request
      request = null;
    };

    // Handle browser request cancellation (as opposed to a manual cancellation)
    request.onabort = function handleAbort() {
      if (!request) {
        return;
      }

      reject(createError('Request aborted', config, 'ECONNABORTED', request));

      // Clean up request
      request = null;
    };

    // Handle low level network errors
    request.onerror = function handleError() {
      // Real errors are hidden from us by the browser
      // onerror should only fire if it's a network error
      reject(createError('Network Error', config, null, request));

      // Clean up request
      request = null;
    };

    // Handle timeout
    request.ontimeout = function handleTimeout() {
      var timeoutErrorMessage = 'timeout of ' + config.timeout + 'ms exceeded';
      if (config.timeoutErrorMessage) {
        timeoutErrorMessage = config.timeoutErrorMessage;
      }
      reject(createError(timeoutErrorMessage, config, 'ECONNABORTED',
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
    if (config.responseType) {
      try {
        request.responseType = config.responseType;
      } catch (e) {
        // Expected DOMException thrown by browsers not compatible XMLHttpRequest Level 2.
        // But, this can be suppressed for 'json' type as it can be parsed by default 'transformResponse' function.
        if (config.responseType !== 'json') {
          throw e;
        }
      }
    }

    // Handle progress if needed
    if (typeof config.onDownloadProgress === 'function') {
      request.addEventListener('progress', config.onDownloadProgress);
    }

    // Not all browsers support upload events
    if (typeof config.onUploadProgress === 'function' && request.upload) {
      request.upload.addEventListener('progress', config.onUploadProgress);
    }

    if (config.cancelToken) {
      // Handle cancellation
      config.cancelToken.promise.then(function onCanceled(cancel) {
        if (!request) {
          return;
        }

        request.abort();
        reject(cancel);
        // Clean up request
        request = null;
      });
    }

    if (!requestData) {
      requestData = null;
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
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ./utils */ "./node_modules/axios/lib/utils.js");
var bind = __webpack_require__(/*! ./helpers/bind */ "./node_modules/axios/lib/helpers/bind.js");
var Axios = __webpack_require__(/*! ./core/Axios */ "./node_modules/axios/lib/core/Axios.js");
var mergeConfig = __webpack_require__(/*! ./core/mergeConfig */ "./node_modules/axios/lib/core/mergeConfig.js");
var defaults = __webpack_require__(/*! ./defaults */ "./node_modules/axios/lib/defaults.js");

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

  return instance;
}

// Create the default instance to be exported
var axios = createInstance(defaults);

// Expose Axios class to allow class inheritance
axios.Axios = Axios;

// Factory for creating new instances
axios.create = function create(instanceConfig) {
  return createInstance(mergeConfig(axios.defaults, instanceConfig));
};

// Expose Cancel & CancelToken
axios.Cancel = __webpack_require__(/*! ./cancel/Cancel */ "./node_modules/axios/lib/cancel/Cancel.js");
axios.CancelToken = __webpack_require__(/*! ./cancel/CancelToken */ "./node_modules/axios/lib/cancel/CancelToken.js");
axios.isCancel = __webpack_require__(/*! ./cancel/isCancel */ "./node_modules/axios/lib/cancel/isCancel.js");

// Expose all/spread
axios.all = function all(promises) {
  return Promise.all(promises);
};
axios.spread = __webpack_require__(/*! ./helpers/spread */ "./node_modules/axios/lib/helpers/spread.js");

// Expose isAxiosError
axios.isAxiosError = __webpack_require__(/*! ./helpers/isAxiosError */ "./node_modules/axios/lib/helpers/isAxiosError.js");

module.exports = axios;

// Allow use of default import syntax in TypeScript
module.exports.default = axios;


/***/ }),

/***/ "./node_modules/axios/lib/cancel/Cancel.js":
/*!*************************************************!*\
  !*** ./node_modules/axios/lib/cancel/Cancel.js ***!
  \*************************************************/
/***/ ((module) => {

"use strict";


/**
 * A `Cancel` is an object that is thrown when an operation is canceled.
 *
 * @class
 * @param {string=} message The message.
 */
function Cancel(message) {
  this.message = message;
}

Cancel.prototype.toString = function toString() {
  return 'Cancel' + (this.message ? ': ' + this.message : '');
};

Cancel.prototype.__CANCEL__ = true;

module.exports = Cancel;


/***/ }),

/***/ "./node_modules/axios/lib/cancel/CancelToken.js":
/*!******************************************************!*\
  !*** ./node_modules/axios/lib/cancel/CancelToken.js ***!
  \******************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var Cancel = __webpack_require__(/*! ./Cancel */ "./node_modules/axios/lib/cancel/Cancel.js");

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
  executor(function cancel(message) {
    if (token.reason) {
      // Cancellation has already been requested
      return;
    }

    token.reason = new Cancel(message);
    resolvePromise(token.reason);
  });
}

/**
 * Throws a `Cancel` if cancellation has been requested.
 */
CancelToken.prototype.throwIfRequested = function throwIfRequested() {
  if (this.reason) {
    throw this.reason;
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

/***/ "./node_modules/axios/lib/cancel/isCancel.js":
/*!***************************************************!*\
  !*** ./node_modules/axios/lib/cancel/isCancel.js ***!
  \***************************************************/
/***/ ((module) => {

"use strict";


module.exports = function isCancel(value) {
  return !!(value && value.__CANCEL__);
};


/***/ }),

/***/ "./node_modules/axios/lib/core/Axios.js":
/*!**********************************************!*\
  !*** ./node_modules/axios/lib/core/Axios.js ***!
  \**********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");
var buildURL = __webpack_require__(/*! ../helpers/buildURL */ "./node_modules/axios/lib/helpers/buildURL.js");
var InterceptorManager = __webpack_require__(/*! ./InterceptorManager */ "./node_modules/axios/lib/core/InterceptorManager.js");
var dispatchRequest = __webpack_require__(/*! ./dispatchRequest */ "./node_modules/axios/lib/core/dispatchRequest.js");
var mergeConfig = __webpack_require__(/*! ./mergeConfig */ "./node_modules/axios/lib/core/mergeConfig.js");

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
Axios.prototype.request = function request(config) {
  /*eslint no-param-reassign:0*/
  // Allow for axios('example/url'[, config]) a la fetch API
  if (typeof config === 'string') {
    config = arguments[1] || {};
    config.url = arguments[0];
  } else {
    config = config || {};
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

  // Hook up interceptors middleware
  var chain = [dispatchRequest, undefined];
  var promise = Promise.resolve(config);

  this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor) {
    chain.unshift(interceptor.fulfilled, interceptor.rejected);
  });

  this.interceptors.response.forEach(function pushResponseInterceptors(interceptor) {
    chain.push(interceptor.fulfilled, interceptor.rejected);
  });

  while (chain.length) {
    promise = promise.then(chain.shift(), chain.shift());
  }

  return promise;
};

Axios.prototype.getUri = function getUri(config) {
  config = mergeConfig(this.defaults, config);
  return buildURL(config.url, config.params, config.paramsSerializer).replace(/^\?/, '');
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
  Axios.prototype[method] = function(url, data, config) {
    return this.request(mergeConfig(config || {}, {
      method: method,
      url: url,
      data: data
    }));
  };
});

module.exports = Axios;


/***/ }),

/***/ "./node_modules/axios/lib/core/InterceptorManager.js":
/*!***********************************************************!*\
  !*** ./node_modules/axios/lib/core/InterceptorManager.js ***!
  \***********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

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
InterceptorManager.prototype.use = function use(fulfilled, rejected) {
  this.handlers.push({
    fulfilled: fulfilled,
    rejected: rejected
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
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

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

/***/ "./node_modules/axios/lib/core/createError.js":
/*!****************************************************!*\
  !*** ./node_modules/axios/lib/core/createError.js ***!
  \****************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var enhanceError = __webpack_require__(/*! ./enhanceError */ "./node_modules/axios/lib/core/enhanceError.js");

/**
 * Create an Error with the specified message, config, error code, request and response.
 *
 * @param {string} message The error message.
 * @param {Object} config The config.
 * @param {string} [code] The error code (for example, 'ECONNABORTED').
 * @param {Object} [request] The request.
 * @param {Object} [response] The response.
 * @returns {Error} The created error.
 */
module.exports = function createError(message, config, code, request, response) {
  var error = new Error(message);
  return enhanceError(error, config, code, request, response);
};


/***/ }),

/***/ "./node_modules/axios/lib/core/dispatchRequest.js":
/*!********************************************************!*\
  !*** ./node_modules/axios/lib/core/dispatchRequest.js ***!
  \********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");
var transformData = __webpack_require__(/*! ./transformData */ "./node_modules/axios/lib/core/transformData.js");
var isCancel = __webpack_require__(/*! ../cancel/isCancel */ "./node_modules/axios/lib/cancel/isCancel.js");
var defaults = __webpack_require__(/*! ../defaults */ "./node_modules/axios/lib/defaults.js");

/**
 * Throws a `Cancel` if cancellation has been requested.
 */
function throwIfCancellationRequested(config) {
  if (config.cancelToken) {
    config.cancelToken.throwIfRequested();
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
  config.data = transformData(
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
    response.data = transformData(
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
        reason.response.data = transformData(
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

/***/ "./node_modules/axios/lib/core/enhanceError.js":
/*!*****************************************************!*\
  !*** ./node_modules/axios/lib/core/enhanceError.js ***!
  \*****************************************************/
/***/ ((module) => {

"use strict";


/**
 * Update an Error with the specified config, error code, and response.
 *
 * @param {Error} error The error to update.
 * @param {Object} config The config.
 * @param {string} [code] The error code (for example, 'ECONNABORTED').
 * @param {Object} [request] The request.
 * @param {Object} [response] The response.
 * @returns {Error} The error.
 */
module.exports = function enhanceError(error, config, code, request, response) {
  error.config = config;
  if (code) {
    error.code = code;
  }

  error.request = request;
  error.response = response;
  error.isAxiosError = true;

  error.toJSON = function toJSON() {
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
      code: this.code
    };
  };
  return error;
};


/***/ }),

/***/ "./node_modules/axios/lib/core/mergeConfig.js":
/*!****************************************************!*\
  !*** ./node_modules/axios/lib/core/mergeConfig.js ***!
  \****************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

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

  var valueFromConfig2Keys = ['url', 'method', 'data'];
  var mergeDeepPropertiesKeys = ['headers', 'auth', 'proxy', 'params'];
  var defaultToConfig2Keys = [
    'baseURL', 'transformRequest', 'transformResponse', 'paramsSerializer',
    'timeout', 'timeoutMessage', 'withCredentials', 'adapter', 'responseType', 'xsrfCookieName',
    'xsrfHeaderName', 'onUploadProgress', 'onDownloadProgress', 'decompress',
    'maxContentLength', 'maxBodyLength', 'maxRedirects', 'transport', 'httpAgent',
    'httpsAgent', 'cancelToken', 'socketPath', 'responseEncoding'
  ];
  var directMergeKeys = ['validateStatus'];

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

  function mergeDeepProperties(prop) {
    if (!utils.isUndefined(config2[prop])) {
      config[prop] = getMergedValue(config1[prop], config2[prop]);
    } else if (!utils.isUndefined(config1[prop])) {
      config[prop] = getMergedValue(undefined, config1[prop]);
    }
  }

  utils.forEach(valueFromConfig2Keys, function valueFromConfig2(prop) {
    if (!utils.isUndefined(config2[prop])) {
      config[prop] = getMergedValue(undefined, config2[prop]);
    }
  });

  utils.forEach(mergeDeepPropertiesKeys, mergeDeepProperties);

  utils.forEach(defaultToConfig2Keys, function defaultToConfig2(prop) {
    if (!utils.isUndefined(config2[prop])) {
      config[prop] = getMergedValue(undefined, config2[prop]);
    } else if (!utils.isUndefined(config1[prop])) {
      config[prop] = getMergedValue(undefined, config1[prop]);
    }
  });

  utils.forEach(directMergeKeys, function merge(prop) {
    if (prop in config2) {
      config[prop] = getMergedValue(config1[prop], config2[prop]);
    } else if (prop in config1) {
      config[prop] = getMergedValue(undefined, config1[prop]);
    }
  });

  var axiosKeys = valueFromConfig2Keys
    .concat(mergeDeepPropertiesKeys)
    .concat(defaultToConfig2Keys)
    .concat(directMergeKeys);

  var otherKeys = Object
    .keys(config1)
    .concat(Object.keys(config2))
    .filter(function filterAxiosKeys(key) {
      return axiosKeys.indexOf(key) === -1;
    });

  utils.forEach(otherKeys, mergeDeepProperties);

  return config;
};


/***/ }),

/***/ "./node_modules/axios/lib/core/settle.js":
/*!***********************************************!*\
  !*** ./node_modules/axios/lib/core/settle.js ***!
  \***********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var createError = __webpack_require__(/*! ./createError */ "./node_modules/axios/lib/core/createError.js");

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
    reject(createError(
      'Request failed with status code ' + response.status,
      response.config,
      null,
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
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");

/**
 * Transform the data for a request or a response
 *
 * @param {Object|String} data The data to be transformed
 * @param {Array} headers The headers for the request or response
 * @param {Array|Function} fns A single function or Array of functions
 * @returns {*} The resulting transformed data
 */
module.exports = function transformData(data, headers, fns) {
  /*eslint no-param-reassign:0*/
  utils.forEach(fns, function transform(fn) {
    data = fn(data, headers);
  });

  return data;
};


/***/ }),

/***/ "./node_modules/axios/lib/defaults.js":
/*!********************************************!*\
  !*** ./node_modules/axios/lib/defaults.js ***!
  \********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ./utils */ "./node_modules/axios/lib/utils.js");
var normalizeHeaderName = __webpack_require__(/*! ./helpers/normalizeHeaderName */ "./node_modules/axios/lib/helpers/normalizeHeaderName.js");

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
    adapter = __webpack_require__(/*! ./adapters/xhr */ "./node_modules/axios/lib/adapters/xhr.js");
  } else if (typeof process !== 'undefined' && Object.prototype.toString.call(process) === '[object process]') {
    // For node use HTTP adapter
    adapter = __webpack_require__(/*! ./adapters/http */ "./node_modules/axios/lib/adapters/xhr.js");
  }
  return adapter;
}

var defaults = {
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
    if (utils.isObject(data)) {
      setContentTypeIfUnset(headers, 'application/json;charset=utf-8');
      return JSON.stringify(data);
    }
    return data;
  }],

  transformResponse: [function transformResponse(data) {
    /*eslint no-param-reassign:0*/
    if (typeof data === 'string') {
      try {
        data = JSON.parse(data);
      } catch (e) { /* Ignore */ }
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

  validateStatus: function validateStatus(status) {
    return status >= 200 && status < 300;
  }
};

defaults.headers = {
  common: {
    'Accept': 'application/json, text/plain, */*'
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

/***/ "./node_modules/axios/lib/helpers/bind.js":
/*!************************************************!*\
  !*** ./node_modules/axios/lib/helpers/bind.js ***!
  \************************************************/
/***/ ((module) => {

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
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

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
/***/ ((module) => {

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
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

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
/***/ ((module) => {

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
  return /^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(url);
};


/***/ }),

/***/ "./node_modules/axios/lib/helpers/isAxiosError.js":
/*!********************************************************!*\
  !*** ./node_modules/axios/lib/helpers/isAxiosError.js ***!
  \********************************************************/
/***/ ((module) => {

"use strict";


/**
 * Determines whether the payload is an error thrown by Axios
 *
 * @param {*} payload The value to test
 * @returns {boolean} True if the payload is an error thrown by Axios, otherwise false
 */
module.exports = function isAxiosError(payload) {
  return (typeof payload === 'object') && (payload.isAxiosError === true);
};


/***/ }),

/***/ "./node_modules/axios/lib/helpers/isURLSameOrigin.js":
/*!***********************************************************!*\
  !*** ./node_modules/axios/lib/helpers/isURLSameOrigin.js ***!
  \***********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

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
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

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

/***/ "./node_modules/axios/lib/helpers/parseHeaders.js":
/*!********************************************************!*\
  !*** ./node_modules/axios/lib/helpers/parseHeaders.js ***!
  \********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

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

/***/ "./node_modules/axios/lib/helpers/spread.js":
/*!**************************************************!*\
  !*** ./node_modules/axios/lib/helpers/spread.js ***!
  \**************************************************/
/***/ ((module) => {

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

/***/ "./node_modules/axios/lib/utils.js":
/*!*****************************************!*\
  !*** ./node_modules/axios/lib/utils.js ***!
  \*****************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var bind = __webpack_require__(/*! ./helpers/bind */ "./node_modules/axios/lib/helpers/bind.js");

/*global toString:true*/

// utils is a library of generic helper functions non-specific to axios

var toString = Object.prototype.toString;

/**
 * Determine if a value is an Array
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an Array, otherwise false
 */
function isArray(val) {
  return toString.call(val) === '[object Array]';
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
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an ArrayBuffer, otherwise false
 */
function isArrayBuffer(val) {
  return toString.call(val) === '[object ArrayBuffer]';
}

/**
 * Determine if a value is a FormData
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an FormData, otherwise false
 */
function isFormData(val) {
  return (typeof FormData !== 'undefined') && (val instanceof FormData);
}

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
    result = (val) && (val.buffer) && (val.buffer instanceof ArrayBuffer);
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
  if (toString.call(val) !== '[object Object]') {
    return false;
  }

  var prototype = Object.getPrototypeOf(val);
  return prototype === null || prototype === Object.prototype;
}

/**
 * Determine if a value is a Date
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Date, otherwise false
 */
function isDate(val) {
  return toString.call(val) === '[object Date]';
}

/**
 * Determine if a value is a File
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a File, otherwise false
 */
function isFile(val) {
  return toString.call(val) === '[object File]';
}

/**
 * Determine if a value is a Blob
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Blob, otherwise false
 */
function isBlob(val) {
  return toString.call(val) === '[object Blob]';
}

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
 * Determine if a value is a URLSearchParams object
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a URLSearchParams object, otherwise false
 */
function isURLSearchParams(val) {
  return typeof URLSearchParams !== 'undefined' && val instanceof URLSearchParams;
}

/**
 * Trim excess whitespace off the beginning and end of a string
 *
 * @param {String} str The String to trim
 * @returns {String} The String freed of excess whitespace
 */
function trim(str) {
  return str.replace(/^\s*/, '').replace(/\s*$/, '');
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
  stripBOM: stripBOM
};


/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js!./client/src/scss/style.scss":
/*!*****************************************************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js!./client/src/scss/style.scss ***!
  \*****************************************************************************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_cssWithMappingToString_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../node_modules/css-loader/dist/runtime/cssWithMappingToString.js */ "./node_modules/css-loader/dist/runtime/cssWithMappingToString.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_cssWithMappingToString_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_cssWithMappingToString_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../node_modules/css-loader/dist/runtime/api.js */ "./node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_cssWithMappingToString_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, "@keyframes loading {\n  0% {\n    transform: translateX(0);\n  }\n  50%, 100% {\n    transform: translateX(675px);\n  }\n}\n.skeleton-article-meta {\n  display: flex;\n  flex-flow: row nowrap;\n  align-items: center;\n  margin-bottom: 16px;\n}\n\n.skeleton-info {\n  display: inline-block;\n  padding-top: 5px;\n  margin-left: 5px;\n}\n\n.skeleton-img {\n  display: inline-block;\n  background: #f2f2f2;\n  width: 35px;\n  height: 35px;\n  border-radius: 50%;\n}\n\n.skeleton-author {\n  display: block;\n  width: 90px;\n  height: 14px;\n  background: #f2f2f2;\n}\n\n.skeleton-date {\n  display: inline-block;\n  width: 100px;\n  height: 14px;\n  background: #f2f2f2;\n}\n\n.skeleton-heading {\n  width: 85%;\n  height: 14px;\n  background: #f2f2f2;\n}\n\n.skeleton-content {\n  width: 90%;\n  height: 14px;\n  background: #f2f2f2;\n}\n\n.skeleton-more {\n  display: inline-block;\n  width: 85%;\n  height: 14px;\n  background: #f2f2f2;\n}\n\n.skeleton {\n  position: relative;\n  overflow: hidden;\n}\n\n.skeleton::before {\n  content: \"\";\n  position: absolute;\n  top: 0;\n  left: 0;\n  width: 30px;\n  height: 100%;\n  background: linear-gradient(to right, #f2f2f2, #ddd, #f2f2f2);\n  animation: loading 2s infinite linear;\n}\n\n@keyframes loading {\n  0% {\n    transform: translateX(0);\n  }\n  50%, 100% {\n    transform: translateX(910px);\n  }\n}\n.article-heading-skeleton {\n  width: 910px;\n  height: 40px;\n  background: #5e5e5e;\n  border-radius: 3px;\n}\n\n.author-img-skeleton {\n  display: inline-block;\n  background: #5e5e5e;\n  width: 36px;\n  height: 36px;\n  border-radius: 50%;\n}\n\n.author-name-skeleton {\n  display: block;\n  width: 90px;\n  height: 12px;\n  background: #5e5e5e;\n  margin-bottom: 5px;\n}\n\n.create-at-skeleton {\n  display: inline-block;\n  width: 100px;\n  height: 12px;\n  background: #5e5e5e;\n}\n\n.article-body-skeleton1 {\n  display: block;\n  width: 92%;\n  height: 20px;\n  background: #f2f2f2;\n  margin-bottom: 7px;\n}\n\n.article-body-skeleton2 {\n  display: block;\n  width: 94%;\n  height: 20px;\n  background: #f2f2f2;\n  margin-bottom: 7px;\n}\n\n.article-body-skeleton3 {\n  display: block;\n  width: 96%;\n  height: 20px;\n  background: #f2f2f2;\n  margin-bottom: 7px;\n}\n\n.article-body-skeleton4 {\n  display: block;\n  width: 98%;\n  height: 20px;\n  background: #f2f2f2;\n  margin-bottom: 7px;\n}\n\n.article-body-skeleton5 {\n  display: block;\n  width: 100%;\n  height: 20px;\n  background: #f2f2f2;\n  margin-bottom: 7px;\n}\n\n.article-body-skeleton6 {\n  display: block;\n  width: 98%;\n  height: 20px;\n  background: #f2f2f2;\n  margin-bottom: 7px;\n}\n\n.article-body-skeleton7 {\n  display: block;\n  width: 96%;\n  height: 20px;\n  background: #f2f2f2;\n  margin-bottom: 7px;\n}\n\n.article-body-skeleton8 {\n  display: block;\n  width: 94%;\n  height: 20px;\n  background: #f2f2f2;\n  margin-bottom: 7px;\n}\n\n.article-body-skeleton9 {\n  display: block;\n  width: 92%;\n  height: 20px;\n  background: #f2f2f2;\n  margin-bottom: 7px;\n}\n\n.skeleton-comment-meta {\n  display: flex;\n  flex-flow: row nowrap;\n  justify-content: center;\n  align-items: center;\n  margin-bottom: 16px;\n}\n\n.comment-author-img-skeleton {\n  display: inline-block;\n  background: #f2f2f2;\n  width: 35px;\n  height: 35px;\n  border-radius: 50%;\n}\n\n.comment-author-name-skeleton {\n  display: block;\n  width: 90px;\n  height: 12px;\n  background: #f2f2f2;\n  margin-bottom: 5px;\n}\n\n.comment-create-at-skeleton {\n  display: block;\n  width: 100px;\n  height: 12px;\n  background: #f2f2f2;\n}\n\n.heading-skeleton {\n  position: relative;\n  overflow: hidden;\n}\n\n.heading-skeleton::before {\n  content: \"\";\n  position: absolute;\n  top: 0;\n  left: 0;\n  width: 30px;\n  height: 100%;\n  background: linear-gradient(to right, #5e5e5e, #828282, #5e5e5e);\n  animation: loading 2s infinite linear;\n}\n\n.pagination-wraper {\n  display: flex;\n  justify-content: center;\n  border-top: 1px solid rgba(0, 0, 0, 0.1);\n}\n\n.pagination {\n  display: flex;\n}\n\n.move-prev-page {\n  border-right: 0;\n}\n\n.move-next-page {\n  border-left: 0;\n}\n\n.page-slides {\n  padding-left: 0;\n  width: 197px;\n  overflow: hidden;\n  list-style: none;\n}\n\n.page-numbers {\n  padding-left: 0;\n  display: flex;\n  flex-flow: row nowrap;\n  transform: translateX();\n  transition: transform 300ms ease-out;\n  transform: translateX(0);\n}\n\n.page-numbers .page-item .page-number {\n  border-radius: 0;\n  min-width: 40px !important;\n  max-width: 40px;\n  text-align: center;\n}\n\n.page-numbers .page-item:last-child {\n  border-right: 1px solid rgba(0, 0, 0, 0.1);\n}\n\n.page-link {\n  cursor: pointer;\n}", "",{"version":3,"sources":["webpack://./client/src/scss/_mainArticlesSkeleton.scss","webpack://./client/src/scss/style.scss","webpack://./client/src/scss/_articleSkeleton.scss","webpack://./client/src/scss/_pagination.scss"],"names":[],"mappings":"AAGA;EACE;IACE,wBAAA;ECFF;EDIA;IAEE,4BAAA;ECHF;AACF;ADMA;EACE,aAAA;EACA,qBAAA;EACA,mBAAA;EACA,mBAAA;ACJF;;ADOA;EACE,qBAAA;EACA,gBAAA;EACA,gBAAA;ACJF;;ADOA;EACE,qBAAA;EACA,mBA5Bc;EA6Bd,WAAA;EACA,YAAA;EACA,kBAAA;ACJF;;ADOA;EACE,cAAA;EACA,WAAA;EACA,YApCe;EAqCf,mBAtCc;ACkChB;;ADOA;EACE,qBAAA;EACA,YAAA;EACA,YA3Ce;EA4Cf,mBA7Cc;ACyChB;;ADOA;EACE,UAAA;EACA,YAjDe;EAkDf,mBAnDc;AC+ChB;;ADOA;EACE,UAAA;EACA,YAvDe;EAwDf,mBAzDc;ACqDhB;;ADOA;EACE,qBAAA;EACA,UAAA;EACA,YA9De;EA+Df,mBAhEc;AC4DhB;;ADOA;EACE,kBAAA;EACA,gBAAA;ACJF;;ADOA;EACE,WAAA;EACA,kBAAA;EACA,MAAA;EACA,OAAA;EACA,WAAA;EACA,YAAA;EACA,6DAAA;EACA,qCAAA;ACJF;;ACxEA;EACE;IACE,wBAAA;ED2EF;ECzEA;IAEE,4BAAA;ED0EF;AACF;ACvEA;EACE,YAAA;EACA,YAAA;EACA,mBAAA;EACA,kBAAA;ADyEF;;ACtEA;EACE,qBAAA;EACA,mBArBqB;EAsBrB,WAAA;EACA,YAAA;EACA,kBAAA;ADyEF;;ACtEA;EACE,cAAA;EACA,WAAA;EACA,YA/Be;EAgCf,mBA/BqB;EAgCrB,kBAAA;ADyEF;;ACtEA;EACE,qBAAA;EACA,YAAA;EACA,YAvCe;EAwCf,mBAvCqB;ADgHvB;;ACrEE;EACE,cAAA;EACA,UAAA;EACA,YAAA;EACA,mBAjDY;EAkDZ,kBAAA;ADwEJ;;AC7EE;EACE,cAAA;EACA,UAAA;EACA,YAAA;EACA,mBAjDY;EAkDZ,kBAAA;ADgFJ;;ACrFE;EACE,cAAA;EACA,UAAA;EACA,YAAA;EACA,mBAjDY;EAkDZ,kBAAA;ADwFJ;;AC7FE;EACE,cAAA;EACA,UAAA;EACA,YAAA;EACA,mBAjDY;EAkDZ,kBAAA;ADgGJ;;AC3FE;EACE,cAAA;EACA,WAAA;EACA,YAAA;EACA,mBA3DY;EA4DZ,kBAAA;AD8FJ;;ACnGE;EACE,cAAA;EACA,UAAA;EACA,YAAA;EACA,mBA3DY;EA4DZ,kBAAA;ADsGJ;;AC3GE;EACE,cAAA;EACA,UAAA;EACA,YAAA;EACA,mBA3DY;EA4DZ,kBAAA;AD8GJ;;ACnHE;EACE,cAAA;EACA,UAAA;EACA,YAAA;EACA,mBA3DY;EA4DZ,kBAAA;ADsHJ;;AC3HE;EACE,cAAA;EACA,UAAA;EACA,YAAA;EACA,mBA3DY;EA4DZ,kBAAA;AD8HJ;;AC1HA;EACE,aAAA;EACA,qBAAA;EACA,uBAAA;EACA,mBAAA;EACA,mBAAA;AD6HF;;AC1HA;EACE,qBAAA;EACA,mBA1Ec;EA2Ed,WAAA;EACA,YAAA;EACA,kBAAA;AD6HF;;AC1HA;EACE,cAAA;EACA,WAAA;EACA,YAlFe;EAmFf,mBApFc;EAqFd,kBAAA;AD6HF;;AC1HA;EACE,cAAA;EACA,YAAA;EACA,YA1Fe;EA2Ff,mBA5Fc;ADyNhB;;AC1HA;EACE,kBAAA;EACA,gBAAA;AD6HF;;AC1HA;EACE,WAAA;EACA,kBAAA;EACA,MAAA;EACA,OAAA;EACA,WAAA;EACA,YAAA;EACA,gEAAA;EACA,qCAAA;AD6HF;;AEzOA;EACE,aAAA;EACA,uBAAA;EACA,wCAAA;AF4OF;;AEzOA;EACE,aAAA;AF4OF;;AEzOA;EACE,eAAA;AF4OF;;AEzOA;EACE,cAAA;AF4OF;;AEzOA;EACE,eAAA;EACA,YAAA;EACA,gBAAA;EACA,gBAAA;AF4OF;;AEzOA;EAEE,eAAA;EACA,aAAA;EACA,qBAAA;EACA,uBAAA;EACA,oCAAA;EACA,wBAAA;AF2OF;;AExOA;EACE,gBAAA;EACA,0BAAA;EACA,eAAA;EACA,kBAAA;AF2OF;;AExOA;EACE,0CAAA;AF2OF;;AExOA;EACE,eAAA;AF2OF","sourcesContent":["$skeletonColor: #f2f2f2;\n$skeletonHeight: 14px;\n\n@keyframes loading {\n  0% {\n    transform: translateX(0);\n  }\n  50%,\n  100% {\n    transform: translateX(675px);\n  }\n}\n\n.skeleton-article-meta {\n  display: flex;\n  flex-flow: row nowrap;\n  align-items: center;\n  margin-bottom: 16px;\n}\n\n.skeleton-info {\n  display: inline-block;\n  padding-top: 5px;\n  margin-left: 5px;\n}\n\n.skeleton-img {\n  display: inline-block;\n  background: $skeletonColor;\n  width: 35px;\n  height: 35px;\n  border-radius: 50%;\n}\n\n.skeleton-author {\n  display: block;\n  width: 90px;\n  height: $skeletonHeight;\n  background: $skeletonColor;\n}\n\n.skeleton-date {\n  display: inline-block;\n  width: 100px;\n  height: $skeletonHeight;\n  background: $skeletonColor;\n}\n\n.skeleton-heading {\n  width: 85%;\n  height: $skeletonHeight;\n  background: $skeletonColor;\n}\n\n.skeleton-content {\n  width: 90%;\n  height: $skeletonHeight;\n  background: $skeletonColor;\n}\n\n.skeleton-more {\n  display: inline-block;\n  width: 85%;\n  height: $skeletonHeight;\n  background: $skeletonColor;\n}\n\n.skeleton {\n  position: relative;\n  overflow: hidden;\n}\n\n.skeleton::before {\n  content: '';\n  position: absolute;\n  top: 0;\n  left: 0;\n  width: 30px;\n  height: 100%;\n  background: linear-gradient(to right, #f2f2f2, #ddd, #f2f2f2);\n  animation: loading 2s infinite linear;\n}\n","@keyframes loading {\n  0% {\n    transform: translateX(0);\n  }\n  50%, 100% {\n    transform: translateX(675px);\n  }\n}\n.skeleton-article-meta {\n  display: flex;\n  flex-flow: row nowrap;\n  align-items: center;\n  margin-bottom: 16px;\n}\n\n.skeleton-info {\n  display: inline-block;\n  padding-top: 5px;\n  margin-left: 5px;\n}\n\n.skeleton-img {\n  display: inline-block;\n  background: #f2f2f2;\n  width: 35px;\n  height: 35px;\n  border-radius: 50%;\n}\n\n.skeleton-author {\n  display: block;\n  width: 90px;\n  height: 14px;\n  background: #f2f2f2;\n}\n\n.skeleton-date {\n  display: inline-block;\n  width: 100px;\n  height: 14px;\n  background: #f2f2f2;\n}\n\n.skeleton-heading {\n  width: 85%;\n  height: 14px;\n  background: #f2f2f2;\n}\n\n.skeleton-content {\n  width: 90%;\n  height: 14px;\n  background: #f2f2f2;\n}\n\n.skeleton-more {\n  display: inline-block;\n  width: 85%;\n  height: 14px;\n  background: #f2f2f2;\n}\n\n.skeleton {\n  position: relative;\n  overflow: hidden;\n}\n\n.skeleton::before {\n  content: \"\";\n  position: absolute;\n  top: 0;\n  left: 0;\n  width: 30px;\n  height: 100%;\n  background: linear-gradient(to right, #f2f2f2, #ddd, #f2f2f2);\n  animation: loading 2s infinite linear;\n}\n\n@keyframes loading {\n  0% {\n    transform: translateX(0);\n  }\n  50%, 100% {\n    transform: translateX(910px);\n  }\n}\n.article-heading-skeleton {\n  width: 910px;\n  height: 40px;\n  background: #5e5e5e;\n  border-radius: 3px;\n}\n\n.author-img-skeleton {\n  display: inline-block;\n  background: #5e5e5e;\n  width: 36px;\n  height: 36px;\n  border-radius: 50%;\n}\n\n.author-name-skeleton {\n  display: block;\n  width: 90px;\n  height: 12px;\n  background: #5e5e5e;\n  margin-bottom: 5px;\n}\n\n.create-at-skeleton {\n  display: inline-block;\n  width: 100px;\n  height: 12px;\n  background: #5e5e5e;\n}\n\n.article-body-skeleton1 {\n  display: block;\n  width: 92%;\n  height: 20px;\n  background: #f2f2f2;\n  margin-bottom: 7px;\n}\n\n.article-body-skeleton2 {\n  display: block;\n  width: 94%;\n  height: 20px;\n  background: #f2f2f2;\n  margin-bottom: 7px;\n}\n\n.article-body-skeleton3 {\n  display: block;\n  width: 96%;\n  height: 20px;\n  background: #f2f2f2;\n  margin-bottom: 7px;\n}\n\n.article-body-skeleton4 {\n  display: block;\n  width: 98%;\n  height: 20px;\n  background: #f2f2f2;\n  margin-bottom: 7px;\n}\n\n.article-body-skeleton5 {\n  display: block;\n  width: 100%;\n  height: 20px;\n  background: #f2f2f2;\n  margin-bottom: 7px;\n}\n\n.article-body-skeleton6 {\n  display: block;\n  width: 98%;\n  height: 20px;\n  background: #f2f2f2;\n  margin-bottom: 7px;\n}\n\n.article-body-skeleton7 {\n  display: block;\n  width: 96%;\n  height: 20px;\n  background: #f2f2f2;\n  margin-bottom: 7px;\n}\n\n.article-body-skeleton8 {\n  display: block;\n  width: 94%;\n  height: 20px;\n  background: #f2f2f2;\n  margin-bottom: 7px;\n}\n\n.article-body-skeleton9 {\n  display: block;\n  width: 92%;\n  height: 20px;\n  background: #f2f2f2;\n  margin-bottom: 7px;\n}\n\n.skeleton-comment-meta {\n  display: flex;\n  flex-flow: row nowrap;\n  justify-content: center;\n  align-items: center;\n  margin-bottom: 16px;\n}\n\n.comment-author-img-skeleton {\n  display: inline-block;\n  background: #f2f2f2;\n  width: 35px;\n  height: 35px;\n  border-radius: 50%;\n}\n\n.comment-author-name-skeleton {\n  display: block;\n  width: 90px;\n  height: 12px;\n  background: #f2f2f2;\n  margin-bottom: 5px;\n}\n\n.comment-create-at-skeleton {\n  display: block;\n  width: 100px;\n  height: 12px;\n  background: #f2f2f2;\n}\n\n.heading-skeleton {\n  position: relative;\n  overflow: hidden;\n}\n\n.heading-skeleton::before {\n  content: \"\";\n  position: absolute;\n  top: 0;\n  left: 0;\n  width: 30px;\n  height: 100%;\n  background: linear-gradient(to right, #5e5e5e, #828282, #5e5e5e);\n  animation: loading 2s infinite linear;\n}\n\n.pagination-wraper {\n  display: flex;\n  justify-content: center;\n  border-top: 1px solid rgba(0, 0, 0, 0.1);\n}\n\n.pagination {\n  display: flex;\n}\n\n.move-prev-page {\n  border-right: 0;\n}\n\n.move-next-page {\n  border-left: 0;\n}\n\n.page-slides {\n  padding-left: 0;\n  width: 197px;\n  overflow: hidden;\n  list-style: none;\n}\n\n.page-numbers {\n  padding-left: 0;\n  display: flex;\n  flex-flow: row nowrap;\n  transform: translateX();\n  transition: transform 300ms ease-out;\n  transform: translateX(0);\n}\n\n.page-numbers .page-item .page-number {\n  border-radius: 0;\n  min-width: 40px !important;\n  max-width: 40px;\n  text-align: center;\n}\n\n.page-numbers .page-item:last-child {\n  border-right: 1px solid rgba(0, 0, 0, 0.1);\n}\n\n.page-link {\n  cursor: pointer;\n}","$skeletonColor: #f2f2f2;\n$skeletonHeight: 12px;\n$headingSkeletonColor: #5e5e5e;\n\n@keyframes loading {\n  0% {\n    transform: translateX(0);\n  }\n  50%,\n  100% {\n    transform: translateX(910px);\n  }\n}\n\n.article-heading-skeleton {\n  width: 910px;\n  height: 40px;\n  background: #5e5e5e;\n  border-radius: 3px;\n}\n\n.author-img-skeleton {\n  display: inline-block;\n  background: $headingSkeletonColor;\n  width: 36px;\n  height: 36px;\n  border-radius: 50%;\n}\n\n.author-name-skeleton {\n  display: block;\n  width: 90px;\n  height: $skeletonHeight;\n  background: $headingSkeletonColor;\n  margin-bottom: 5px;\n}\n\n.create-at-skeleton {\n  display: inline-block;\n  width: 100px;\n  height: $skeletonHeight;\n  background: $headingSkeletonColor;\n}\n\n@for $index from 1 to 5 {\n  .article-body-skeleton#{$index} {\n    display: block;\n    width: 90% + 2 * $index;\n    height: 20px;\n    background: $skeletonColor;\n    margin-bottom: 7px;\n  }\n}\n\n@for $index from 5 to 10 {\n  .article-body-skeleton#{$index} {\n    display: block;\n    width: 110% - 2 * $index;\n    height: 20px;\n    background: $skeletonColor;\n    margin-bottom: 7px;\n  }\n}\n\n.skeleton-comment-meta {\n  display: flex;\n  flex-flow: row nowrap;\n  justify-content: center;\n  align-items: center;\n  margin-bottom: 16px;\n}\n\n.comment-author-img-skeleton {\n  display: inline-block;\n  background: $skeletonColor;\n  width: 35px;\n  height: 35px;\n  border-radius: 50%;\n}\n\n.comment-author-name-skeleton {\n  display: block;\n  width: 90px;\n  height: $skeletonHeight;\n  background: $skeletonColor;\n  margin-bottom: 5px;\n}\n\n.comment-create-at-skeleton {\n  display: block;\n  width: 100px;\n  height: $skeletonHeight;\n  background: $skeletonColor;\n}\n\n.heading-skeleton {\n  position: relative;\n  overflow: hidden;\n}\n\n.heading-skeleton::before {\n  content: '';\n  position: absolute;\n  top: 0;\n  left: 0;\n  width: 30px;\n  height: 100%;\n  background: linear-gradient(to right, #5e5e5e, #828282, #5e5e5e);\n  animation: loading 2s infinite linear;\n}\n",".pagination-wraper {\n  display: flex;\n  justify-content: center;\n  border-top: 1px solid rgba(0, 0, 0, 0.1);\n}\n\n.pagination {\n  display: flex;\n}\n\n.move-prev-page {\n  border-right: 0;\n}\n\n.move-next-page {\n  border-left: 0;\n}\n\n.page-slides {\n  padding-left: 0;\n  width: 197px;\n  overflow: hidden;\n  list-style: none;\n}\n\n.page-numbers {\n  $index: 1;\n  padding-left: 0;\n  display: flex;\n  flex-flow: row nowrap;\n  transform: translateX();\n  transition: transform 300ms ease-out;\n  transform: translateX(0);\n}\n\n.page-numbers .page-item .page-number {\n  border-radius: 0;\n  min-width: 40px !important;\n  max-width: 40px;\n  text-align: center;\n}\n\n.page-numbers .page-item:last-child {\n  border-right: 1px solid rgba(0, 0, 0, 0.1);\n}\n\n.page-link {\n  cursor: pointer;\n}\n"],"sourceRoot":""}]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/css-loader/dist/runtime/api.js":
/*!*****************************************************!*\
  !*** ./node_modules/css-loader/dist/runtime/api.js ***!
  \*****************************************************/
/***/ ((module) => {

"use strict";


/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
// eslint-disable-next-line func-names
module.exports = function (cssWithMappingToString) {
  var list = []; // return the list of modules as css string

  list.toString = function toString() {
    return this.map(function (item) {
      var content = cssWithMappingToString(item);

      if (item[2]) {
        return "@media ".concat(item[2], " {").concat(content, "}");
      }

      return content;
    }).join("");
  }; // import a list of modules into the list
  // eslint-disable-next-line func-names


  list.i = function (modules, mediaQuery, dedupe) {
    if (typeof modules === "string") {
      // eslint-disable-next-line no-param-reassign
      modules = [[null, modules, ""]];
    }

    var alreadyImportedModules = {};

    if (dedupe) {
      for (var i = 0; i < this.length; i++) {
        // eslint-disable-next-line prefer-destructuring
        var id = this[i][0];

        if (id != null) {
          alreadyImportedModules[id] = true;
        }
      }
    }

    for (var _i = 0; _i < modules.length; _i++) {
      var item = [].concat(modules[_i]);

      if (dedupe && alreadyImportedModules[item[0]]) {
        // eslint-disable-next-line no-continue
        continue;
      }

      if (mediaQuery) {
        if (!item[2]) {
          item[2] = mediaQuery;
        } else {
          item[2] = "".concat(mediaQuery, " and ").concat(item[2]);
        }
      }

      list.push(item);
    }
  };

  return list;
};

/***/ }),

/***/ "./node_modules/css-loader/dist/runtime/cssWithMappingToString.js":
/*!************************************************************************!*\
  !*** ./node_modules/css-loader/dist/runtime/cssWithMappingToString.js ***!
  \************************************************************************/
/***/ ((module) => {

"use strict";


function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

module.exports = function cssWithMappingToString(item) {
  var _item = _slicedToArray(item, 4),
      content = _item[1],
      cssMapping = _item[3];

  if (typeof btoa === "function") {
    // eslint-disable-next-line no-undef
    var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(cssMapping))));
    var data = "sourceMappingURL=data:application/json;charset=utf-8;base64,".concat(base64);
    var sourceMapping = "/*# ".concat(data, " */");
    var sourceURLs = cssMapping.sources.map(function (source) {
      return "/*# sourceURL=".concat(cssMapping.sourceRoot || "").concat(source, " */");
    });
    return [content].concat(sourceURLs).concat([sourceMapping]).join("\n");
  }

  return [content].join("\n");
};

/***/ }),

/***/ "./client/src/scss/style.scss":
/*!************************************!*\
  !*** ./client/src/scss/style.scss ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !../../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_style_scss__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !!../../../node_modules/css-loader/dist/cjs.js!../../../node_modules/sass-loader/dist/cjs.js!./style.scss */ "./node_modules/css-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js!./client/src/scss/style.scss");

            

var options = {};

options.insert = "head";
options.singleton = false;

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_style_scss__WEBPACK_IMPORTED_MODULE_1__.default, options);



/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_style_scss__WEBPACK_IMPORTED_MODULE_1__.default.locals || {});

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js":
/*!****************************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js ***!
  \****************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var isOldIE = function isOldIE() {
  var memo;
  return function memorize() {
    if (typeof memo === 'undefined') {
      // Test for IE <= 9 as proposed by Browserhacks
      // @see http://browserhacks.com/#hack-e71d8692f65334173fee715c222cb805
      // Tests for existence of standard globals is to allow style-loader
      // to operate correctly into non-standard environments
      // @see https://github.com/webpack-contrib/style-loader/issues/177
      memo = Boolean(window && document && document.all && !window.atob);
    }

    return memo;
  };
}();

var getTarget = function getTarget() {
  var memo = {};
  return function memorize(target) {
    if (typeof memo[target] === 'undefined') {
      var styleTarget = document.querySelector(target); // Special case to return head of iframe instead of iframe itself

      if (window.HTMLIFrameElement && styleTarget instanceof window.HTMLIFrameElement) {
        try {
          // This will throw an exception if access to iframe is blocked
          // due to cross-origin restrictions
          styleTarget = styleTarget.contentDocument.head;
        } catch (e) {
          // istanbul ignore next
          styleTarget = null;
        }
      }

      memo[target] = styleTarget;
    }

    return memo[target];
  };
}();

var stylesInDom = [];

function getIndexByIdentifier(identifier) {
  var result = -1;

  for (var i = 0; i < stylesInDom.length; i++) {
    if (stylesInDom[i].identifier === identifier) {
      result = i;
      break;
    }
  }

  return result;
}

function modulesToDom(list, options) {
  var idCountMap = {};
  var identifiers = [];

  for (var i = 0; i < list.length; i++) {
    var item = list[i];
    var id = options.base ? item[0] + options.base : item[0];
    var count = idCountMap[id] || 0;
    var identifier = "".concat(id, " ").concat(count);
    idCountMap[id] = count + 1;
    var index = getIndexByIdentifier(identifier);
    var obj = {
      css: item[1],
      media: item[2],
      sourceMap: item[3]
    };

    if (index !== -1) {
      stylesInDom[index].references++;
      stylesInDom[index].updater(obj);
    } else {
      stylesInDom.push({
        identifier: identifier,
        updater: addStyle(obj, options),
        references: 1
      });
    }

    identifiers.push(identifier);
  }

  return identifiers;
}

function insertStyleElement(options) {
  var style = document.createElement('style');
  var attributes = options.attributes || {};

  if (typeof attributes.nonce === 'undefined') {
    var nonce =  true ? __webpack_require__.nc : 0;

    if (nonce) {
      attributes.nonce = nonce;
    }
  }

  Object.keys(attributes).forEach(function (key) {
    style.setAttribute(key, attributes[key]);
  });

  if (typeof options.insert === 'function') {
    options.insert(style);
  } else {
    var target = getTarget(options.insert || 'head');

    if (!target) {
      throw new Error("Couldn't find a style target. This probably means that the value for the 'insert' parameter is invalid.");
    }

    target.appendChild(style);
  }

  return style;
}

function removeStyleElement(style) {
  // istanbul ignore if
  if (style.parentNode === null) {
    return false;
  }

  style.parentNode.removeChild(style);
}
/* istanbul ignore next  */


var replaceText = function replaceText() {
  var textStore = [];
  return function replace(index, replacement) {
    textStore[index] = replacement;
    return textStore.filter(Boolean).join('\n');
  };
}();

function applyToSingletonTag(style, index, remove, obj) {
  var css = remove ? '' : obj.media ? "@media ".concat(obj.media, " {").concat(obj.css, "}") : obj.css; // For old IE

  /* istanbul ignore if  */

  if (style.styleSheet) {
    style.styleSheet.cssText = replaceText(index, css);
  } else {
    var cssNode = document.createTextNode(css);
    var childNodes = style.childNodes;

    if (childNodes[index]) {
      style.removeChild(childNodes[index]);
    }

    if (childNodes.length) {
      style.insertBefore(cssNode, childNodes[index]);
    } else {
      style.appendChild(cssNode);
    }
  }
}

function applyToTag(style, options, obj) {
  var css = obj.css;
  var media = obj.media;
  var sourceMap = obj.sourceMap;

  if (media) {
    style.setAttribute('media', media);
  } else {
    style.removeAttribute('media');
  }

  if (sourceMap && typeof btoa !== 'undefined') {
    css += "\n/*# sourceMappingURL=data:application/json;base64,".concat(btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))), " */");
  } // For old IE

  /* istanbul ignore if  */


  if (style.styleSheet) {
    style.styleSheet.cssText = css;
  } else {
    while (style.firstChild) {
      style.removeChild(style.firstChild);
    }

    style.appendChild(document.createTextNode(css));
  }
}

var singleton = null;
var singletonCounter = 0;

function addStyle(obj, options) {
  var style;
  var update;
  var remove;

  if (options.singleton) {
    var styleIndex = singletonCounter++;
    style = singleton || (singleton = insertStyleElement(options));
    update = applyToSingletonTag.bind(null, style, styleIndex, false);
    remove = applyToSingletonTag.bind(null, style, styleIndex, true);
  } else {
    style = insertStyleElement(options);
    update = applyToTag.bind(null, style, options);

    remove = function remove() {
      removeStyleElement(style);
    };
  }

  update(obj);
  return function updateStyle(newObj) {
    if (newObj) {
      if (newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap) {
        return;
      }

      update(obj = newObj);
    } else {
      remove();
    }
  };
}

module.exports = function (list, options) {
  options = options || {}; // Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
  // tags it will allow on a page

  if (!options.singleton && typeof options.singleton !== 'boolean') {
    options.singleton = isOldIE();
  }

  list = list || [];
  var lastIdentifiers = modulesToDom(list, options);
  return function update(newList) {
    newList = newList || [];

    if (Object.prototype.toString.call(newList) !== '[object Array]') {
      return;
    }

    for (var i = 0; i < lastIdentifiers.length; i++) {
      var identifier = lastIdentifiers[i];
      var index = getIndexByIdentifier(identifier);
      stylesInDom[index].references--;
    }

    var newLastIdentifiers = modulesToDom(newList, options);

    for (var _i = 0; _i < lastIdentifiers.length; _i++) {
      var _identifier = lastIdentifiers[_i];

      var _index = getIndexByIdentifier(_identifier);

      if (stylesInDom[_index].references === 0) {
        stylesInDom[_index].updater();

        stylesInDom.splice(_index, 1);
      }
    }

    lastIdentifiers = newLastIdentifiers;
  };
};

/***/ }),

/***/ "./client/src/api/request.ts":
/*!***********************************!*\
  !*** ./client/src/api/request.ts ***!
  \***********************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
var axios_1 = __importDefault(__webpack_require__(/*! axios */ "./node_modules/axios/index.js"));
var API_URL = 'https://conduit.productionready.io/api';
// 요청 후 받은 응답의 status를 보고 검사해야 하기 때문에 .data를 반환하지 않았음
var request = {
    getCurrentUserInfo: function () {
        return __awaiter(this, void 0, void 0, function () {
            var userToken;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        userToken = localStorage.getItem('JWT');
                        return [4 /*yield*/, axios_1.default.get(API_URL + "/user", {
                                headers: {
                                    Authorization: "Token " + userToken
                                }
                            })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    },
    getUserProfile: function (username) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, axios_1.default.get(API_URL + "/profiles/" + username)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    },
    getArticle: function (slug) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, axios_1.default.get(API_URL + "/articles/" + slug)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    },
    getArticles: function (param) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, axios_1.default.get(API_URL + "/articles?" + param)];
                    case 1: 
                    // 인수는 'limit=10&offset=20' 형식으로 하나만 전달해준다.
                    return [2 /*return*/, _a.sent()];
                }
            });
        });
    },
    getFeedArticles: function (param) {
        return __awaiter(this, void 0, void 0, function () {
            var userToken;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        userToken = localStorage.getItem('JWT');
                        return [4 /*yield*/, axios_1.default.get(API_URL + "/articles/feed/" + param, {
                                headers: {
                                    Authorization: "Token " + userToken
                                }
                            })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    },
    getComments: function (slug) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, axios_1.default.get(API_URL + "/articles/" + slug + "/comments")];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    },
    getTags: function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, axios_1.default.get(API_URL + "/tags")];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    },
    signin: function (email, password) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, axios_1.default.post(API_URL + "/users/login", {
                            user: {
                                email: email,
                                password: password
                            }
                        })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    },
    signup: function (username, email, password) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, axios_1.default.post(API_URL + "/users", {
                            user: {
                                username: username,
                                email: email,
                                password: password
                            }
                        })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    },
    updateUserInfo: function (email, bio, image, password) {
        return __awaiter(this, void 0, void 0, function () {
            var userToken;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        userToken = localStorage.getItem('JWT');
                        return [4 /*yield*/, axios_1.default.put(API_URL + "/user", {
                                user: {
                                    image: image,
                                    bio: bio,
                                    email: email,
                                    password: password
                                }
                            }, {
                                headers: {
                                    Authorization: "Token " + userToken
                                }
                            })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    },
    followUser: function (followedUsername) {
        return __awaiter(this, void 0, void 0, function () {
            var userToken;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        userToken = localStorage.getItem('JWT');
                        return [4 /*yield*/, axios_1.default.post(API_URL + "/profiles/" + followedUsername + "/follow", {
                                headers: {
                                    Authorization: "Token " + userToken
                                }
                            })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    },
    unfollowUser: function (unfollowedUsername) {
        return __awaiter(this, void 0, void 0, function () {
            var userToken;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        userToken = localStorage.getItem('JWT');
                        return [4 /*yield*/, axios_1.default.delete(API_URL + "/profiles/" + unfollowedUsername + "/follow", {
                                headers: {
                                    Authorization: "Token " + userToken
                                }
                            })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    },
    createAticle: function (title, description, body, tagList) {
        return __awaiter(this, void 0, void 0, function () {
            var userToken;
            return __generator(this, function (_a) {
                userToken = localStorage.getItem('JWT');
                return [2 /*return*/, axios_1.default.post('https://conduit.productionready.io/api/articles', {
                        article: {
                            title: title,
                            description: description,
                            body: body,
                            tagList: tagList
                        }
                    }, { headers: { Authorization: "Token " + userToken } })];
            });
        });
    },
    updateArticle: function (slug, title, description, body, tagList) {
        return __awaiter(this, void 0, void 0, function () {
            var userToken;
            return __generator(this, function (_a) {
                userToken = localStorage.getItem('JWT');
                return [2 /*return*/, axios_1.default.put(API_URL + "/articles/" + slug, {
                        article: {
                            title: title,
                            description: description,
                            body: body,
                            tagList: tagList
                        }
                    }, { headers: { Authorization: "Token " + userToken } })];
            });
        });
    },
    deleteArticle: function (slug) {
        return __awaiter(this, void 0, void 0, function () {
            var userToken;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        userToken = localStorage.getItem('JWT');
                        return [4 /*yield*/, axios_1.default.delete(API_URL + "/articles/" + slug, {
                                headers: {
                                    Authorization: "Token " + userToken
                                }
                            })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    },
    createComment: function (slug, body) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, axios_1.default.post(API_URL + "/articles/" + slug + "/comments", {
                            comment: {
                                body: body
                            }
                        })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    },
    deleteComment: function (slug, commentId) {
        return __awaiter(this, void 0, void 0, function () {
            var userToken;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        userToken = localStorage.getItem('JWT');
                        return [4 /*yield*/, axios_1.default.delete(API_URL + "/articles/" + slug + "/comments/" + commentId, {
                                headers: {
                                    Authorization: "Token " + userToken
                                }
                            })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    },
    favoriteArticle: function (slug) {
        return __awaiter(this, void 0, void 0, function () {
            var userToken;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        userToken = localStorage.getItem('JWT');
                        return [4 /*yield*/, axios_1.default.post(API_URL + "/articles/" + slug + "/favorite", null, {
                                headers: {
                                    Authorization: "Token " + userToken
                                }
                            })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    },
    unfavoriteArticle: function (slug) {
        return __awaiter(this, void 0, void 0, function () {
            var userToken;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        userToken = localStorage.getItem('JWT');
                        return [4 /*yield*/, axios_1.default.delete(API_URL + "/articles/" + slug + "/favorite", {
                                headers: {
                                    Authorization: "Token " + userToken
                                }
                            })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    }
};
exports.default = request;


/***/ }),

/***/ "./client/src/components/articlePreview.ts":
/*!*************************************************!*\
  !*** ./client/src/components/articlePreview.ts ***!
  \*************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
var View_1 = __importDefault(__webpack_require__(/*! ../utils/View */ "./client/src/utils/View.ts"));
var dateConverter_1 = __importDefault(__webpack_require__(/*! ../utils/dateConverter */ "./client/src/utils/dateConverter.ts"));
var navigateTo_1 = __importDefault(__webpack_require__(/*! ../utils/navigateTo */ "./client/src/utils/navigateTo.ts"));
var request_1 = __importDefault(__webpack_require__(/*! ../api/request */ "./client/src/api/request.ts"));
var isLoading = false;
var nowSlug = '';
var currentUserInfo;
var isCurrentUserArticle = false;
var nowArticleData;
var Article = /** @class */ (function (_super) {
    __extends(Article, _super);
    function Article() {
        var _this = _super.call(this) || this;
        _this.slug = '';
        _this.setTitle('Article');
        return _this;
    }
    Article.prototype.skeleton = function () {
        return "\n    <div class=\"article-page\">\n\n      <div class=\"banner\">\n        <div class=\"container\">\n    \n          <h1 class=\"article-heading-skeleton heading-skeleton\"></h1>\n    \n          <div class=\"article-meta skeleton-article-meta\">\n            <a><span class=\"author-img-skeleton heading-skeleton\"></span></a>\n            <div class=\"info\">\n              <a class=\"author author-name-skeleton heading-skeleton\"></a>\n              <span class=\"date create-at-skeleton heading-skeleton\"></span>\n            </div>\n          </div>\n    \n        </div>\n      </div>\n    \n      <div class=\"container page\">\n    \n        <div class=\"row article-content\">\n          <div class=\"col-md-12\">\n            <p style=\"min-height: 250px\">\n              <span class=\"article-body-skeleton1 skeleton\"></span>\n              <span class=\"article-body-skeleton2 skeleton\"></span>\n              <span class=\"article-body-skeleton3 skeleton\"></span>\n              <span class=\"article-body-skeleton4 skeleton\"></span>\n              <span class=\"article-body-skeleton5 skeleton\"></span>\n              <span class=\"article-body-skeleton6 skeleton\"></span>\n              <span class=\"article-body-skeleton7 skeleton\"></span>\n              <span class=\"article-body-skeleton8 skeleton\"></span>\n              <span class=\"article-body-skeleton9 skeleton\"></span>\n              <span class=\"article-body-skeleton10 skeleton\"></span>\n            </p>\n          </div>\n        </div>\n    \n        <hr/>\n    \n        <div class=\"article-actions\">\n          <div class=\"article-meta skeleton-comment-meta\">\n            <a><span class=\"comment-author-img-skeleton skeleton\"></span></a>\n            <div class=\"info\">\n              <a class=\"author comment-author-name-skeleton skeleton\"></a>\n              <span class=\"date comment-create-at-skeleton skeleton\"></span>\n            </div>\n    \n            <button class=\"btn btn-sm btn-outline-secondary\">\n              " + (isCurrentUserArticle ? "<i class=\"ion-edit\"></i> Edit Article" : "<i class=\"ion-plus-round\"></i> Follow") + "\n            </button>\n            &nbsp;\n            <button class=\"btn btn-sm " + (isCurrentUserArticle ? 'btn-outline-danger' : 'btn-outline-primary') + "\">\n              " + (isCurrentUserArticle ? "<i class=\"ion-trash-a\"></i> Delete Article" : "<i class=\"ion-heart\"></i> Favorite Post <span class=\"counter\">()</span>") + "\n            </button>\n          </div>\n        </div>\n    \n        <div class=\"row\">\n    \n          <div class=\"col-xs-12 col-md-8 offset-md-2\">\n    \n            <form class=\"card comment-form\">\n              <div class=\"card-block\">\n                <textarea class=\"form-control comment-body\" placeholder=\"Write a comment...\" rows=\"3\"></textarea>\n              </div>\n              <div class=\"card-footer\">\n                <span class=\"comment-author-img-skeleton skeleton\"></span>\n                <button class=\"btn btn-sm btn-primary\">\n                  Post Comment\n                </button>\n              </div>\n            </form>\n          </div>\n        </div>\n      </div>\n    </div>";
    };
    Article.prototype.getHtml = function () {
        return __awaiter(this, void 0, void 0, function () {
            var commentsData, author;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        nowSlug = window.location.pathname.split('@')[1];
                        if (!this.USER_TOKEN) return [3 /*break*/, 3];
                        return [4 /*yield*/, request_1.default.getCurrentUserInfo()];
                    case 1:
                        currentUserInfo = (_a.sent()).data.user;
                        return [4 /*yield*/, request_1.default.getComments(nowSlug)];
                    case 2:
                        commentsData = (_a.sent()).data.comments;
                        _a.label = 3;
                    case 3: return [4 /*yield*/, request_1.default.getArticle(nowSlug)];
                    case 4:
                        nowArticleData = (_a.sent()).data.article;
                        author = nowArticleData.author;
                        isCurrentUserArticle = currentUserInfo.username === author.username;
                        isLoading = true;
                        return [2 /*return*/, "<div class=\"article-page\">\n\n      <div class=\"banner\">\n        <div class=\"container\">\n    \n          <h1>" + nowArticleData.title + "</h1>\n    \n          <div class=\"article-meta\">\n            <a href=\"/profile@" + author.username + "\"><img src=\"" + author.image + "\"/></a>\n            <div class=\"info\">\n              <a href=\"/profile@" + author.username + "\" class=\"author\">" + author.username + "</a>\n              <span class=\"date\">" + dateConverter_1.default(nowArticleData.createdAt) + "</span>\n            </div>\n            <button class=\"btn btn-sm btn-outline-secondary " + (isCurrentUserArticle ? 'edit-article-btn' : 'follow-user-btn') + "\">\n              " + (isCurrentUserArticle ? "<i class=\"ion-edit\"></i> Edit Article" : "<i class=\"ion-plus-round\"></i> Follow " + author.username) + "\n            </button>\n            &nbsp;\n            <button class=\"btn btn-sm " + (isCurrentUserArticle ? 'btn-outline-danger delete-article-btn' : 'btn-outline-primary favorite-article-btn') + "\">\n              " + (isCurrentUserArticle ? "<i class=\"ion-trash-a\"></i> Delete Article" : "<i class=\"ion-heart\"></i> Favorite Post <span class=\"counter\">(" + nowArticleData.favoritesCount + ")</span>") + "\n            </button>\n          </div>\n    \n        </div>\n      </div>\n    \n      <div class=\"container page\">\n    \n        <div class=\"row article-content\">\n          <div class=\"col-md-12\">\n            <p style=\"min-height: 250px\">" + nowArticleData.body + "</p>\n          </div>\n        </div>\n    \n        <hr/>\n    \n        <div class=\"article-actions\">\n          <div class=\"article-meta\">\n            <a href=\"/profile@" + author.username + "\"><img src=\"" + author.image + "\" /></a>\n            <div class=\"info\">\n              <a href=\"/profile@" + author.username + "\" class=\"author\">" + author.username + "</a>\n              <span class=\"date\">" + dateConverter_1.default(nowArticleData.createdAt) + "</span>\n            </div>\n    \n            <button class=\"btn btn-sm btn-outline-secondary " + (isCurrentUserArticle ? 'edit-article-btn' : 'follow-user-btn') + "\">\n              " + (isCurrentUserArticle ? "<i class=\"ion-edit\"></i> Edit Article" : "<i class=\"ion-plus-round\"></i> Follow " + author.username) + "\n            </button>\n            &nbsp;\n            <button class=\"btn btn-sm " + (isCurrentUserArticle ? 'btn-outline-danger delete-article-btn' : 'btn-outline-primary favorite-article-btn') + "\">\n              " + (isCurrentUserArticle ? "<i class=\"ion-trash-a\"></i> Delete Article" : "<i class=\"ion-heart\"></i> Favorite Post <span class=\"counter\">(" + nowArticleData.favoritesCount + ")</span>") + "\n            </button>\n          </div>\n        </div>\n    \n        <div class=\"row\">\n    \n          <div class=\"col-xs-12 col-md-8 offset-md-2\">\n    \n            <form class=\"card comment-form\">\n              <div class=\"card-block\">\n                <textarea class=\"form-control comment-body\" placeholder=\"Write a comment...\" rows=\"3\"></textarea>\n              </div>\n              <div class=\"card-footer\">\n                <img src=\"" + currentUserInfo.image + "\" class=\"comment-author-img\" />\n                <button class=\"btn btn-sm btn-primary\">\n                  Post Comment\n                </button>\n              </div>\n            </form>\n            \n            <section class=\"comments-section\">\n              " + commentsData.map(function (comment) { return "\n              <div id=\"" + comment.id + "\" class=\"card\">\n                <div class=\"card-block\">\n                  <p class=\"card-text\">" + comment.body + "</p>\n                </div>\n                <div class=\"card-footer\">\n                  <a href=\"/profile@" + comment.author.username + "\" class=\"comment-author\">\n                    <img src=\"" + comment.author.image + "\" class=\"comment-author-img\" />\n                  </a>\n                  &nbsp;\n                  <a href=\"/profile@" + comment.author.username + "\" class=\"comment-author\">J" + comment.author.username + "</a>\n                  <span class=\"date-posted\">" + dateConverter_1.default(comment.createdAt) + "</span>\n                  " + (currentUserInfo.username === comment.author.username ? '<span class="mod-options"><i class="ion-trash-a"></i></span>' : '') + "\n                </div>\n              </div>"; }).join('') + " \n            </section>\n          </div>\n        </div>\n      </div>\n    </div>"];
                }
            });
        });
    };
    Article.prototype.eventBinding = function () {
        var _this = this;
        var $articlePage = document.querySelector('.article-page');
        var $commentForm = document.querySelector('.comment-form');
        var $commentsSection = document.querySelector('.comments-section');
        var $editArticleBtns = Array.from(document.querySelectorAll('.edit-article-btn'));
        var $deleteArticleBtns = Array.from(document.querySelectorAll('.delete-article-btn'));
        $articlePage.addEventListener('click', function (e) {
            var target = e.target;
            var parentNode = target.parentNode;
            if (target.matches('[href] > *')) {
                e.preventDefault();
                navigateTo_1.default(parentNode.href);
            }
        });
        $commentForm.addEventListener('submit', function (e) { return __awaiter(_this, void 0, void 0, function () {
            var $commentBody, $firstComment, commentValue, resComment, $comment;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        e.preventDefault();
                        $commentBody = document.querySelector('.comment-body');
                        $firstComment = $commentsSection.firstChild;
                        commentValue = $commentBody.value;
                        if (commentValue.trim() === '')
                            return [2 /*return*/];
                        return [4 /*yield*/, request_1.default.createComment(nowSlug, commentValue)];
                    case 1:
                        resComment = (_a.sent()).data.comment;
                        $commentBody.value = '';
                        $commentBody.focus();
                        $comment = document.createElement('div');
                        $comment.classList.add('card');
                        $comment.id = resComment.id.toString();
                        $comment.innerHTML = "<div class=\"card-block\">\n      <p class=\"card-text\">" + resComment.body + "</p>\n    </div>\n    <div class=\"card-footer\">\n      <a href=\"/profile@" + resComment.author.username + "\" class=\"comment-author\">\n        <img src=\"" + resComment.author.image + "\" class=\"comment-author-img\" />\n      </a>\n      &nbsp;\n      <a href=\"/profile@" + resComment.author.username + "\" class=\"comment-author\">J" + resComment.author.username + "</a>\n      <span class=\"date-posted\">" + dateConverter_1.default(resComment.createdAt) + "</span>\n      <span class=\"mod-options\"><i class=\"ion-trash-a\"></i></span>\n    </div>";
                        $firstComment.before($comment);
                        return [2 /*return*/];
                }
            });
        }); });
        $commentsSection.addEventListener('click', function (e) { return __awaiter(_this, void 0, void 0, function () {
            var target, commentId, idOwningNode, parentNode, parentNode, grandParentNode, res, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        target = e.target;
                        if (!target.classList.contains('mod-options') && !target.classList.contains('ion-trash-a'))
                            return [2 /*return*/];
                        commentId = 0;
                        if (target.classList.contains('mod-options')) {
                            parentNode = target.parentNode;
                            idOwningNode = parentNode.parentNode;
                            commentId = +idOwningNode.id;
                        }
                        else {
                            parentNode = target.parentNode;
                            grandParentNode = parentNode.parentNode;
                            idOwningNode = grandParentNode.parentNode;
                            commentId = +idOwningNode.id;
                        }
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, request_1.default.deleteComment(nowSlug, commentId)];
                    case 2:
                        res = _a.sent();
                        if (res.status === 200)
                            idOwningNode.remove();
                        return [3 /*break*/, 4];
                    case 3:
                        error_1 = _a.sent();
                        throw new Error(error_1);
                    case 4: return [2 /*return*/];
                }
            });
        }); });
        $editArticleBtns.forEach(function ($editArticleBtn) {
            $editArticleBtn.addEventListener('click', function () { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    navigateTo_1.default("/editor@" + nowSlug);
                    return [2 /*return*/];
                });
            }); });
        });
        $deleteArticleBtns.forEach(function ($deleteArticleBtn) {
            $deleteArticleBtn.addEventListener('click', function () {
                var nowArticleAuthorName = nowArticleData.author.username;
                request_1.default.deleteArticle(nowSlug);
                navigateTo_1.default('/home');
            });
        });
    };
    return Article;
}(View_1.default));
exports.default = Article;


/***/ }),

/***/ "./client/src/components/articlesSkeleton.ts":
/*!***************************************************!*\
  !*** ./client/src/components/articlesSkeleton.ts ***!
  \***************************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
var ONE_PAGE_ARTICLE_CNT = 10;
var articlesSkeleton = function () { return "" + Array.from({ length: ONE_PAGE_ARTICLE_CNT }).map(function (post) {
    return "<div class=\"skeleton-wrap article-preview\">\n    <div class=\"skeleton-article-meta\">\n      <span class=\"skeleton skeleton-img\"></span>\n      <div class=\"skeleton skeleton-info\">\n        <span class=\"skeleton skeleton-author\"></span>\n        <span class=\"skeleton skeleton-date\"></span>\n      </div>\n    </div>\n    <a href=\"\" class=\"preview-link\">\n      <h1 class=\"skeleton skeleton-heading\"></h1>\n      <p class=\"skeleton skeleton-content\"></p>\n      <span class=\"skeleton-more\"></span>\n    </a>\n  </div>";
}).join(''); };
exports.default = articlesSkeleton;


/***/ }),

/***/ "./client/src/components/edit.ts":
/*!***************************************!*\
  !*** ./client/src/components/edit.ts ***!
  \***************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
var View_1 = __importDefault(__webpack_require__(/*! ../utils/View */ "./client/src/utils/View.ts"));
var navigateTo_1 = __importDefault(__webpack_require__(/*! ../utils/navigateTo */ "./client/src/utils/navigateTo.ts"));
var request_1 = __importDefault(__webpack_require__(/*! ../api/request */ "./client/src/api/request.ts"));
var isUpdate = false;
var slug = '';
var Edit = /** @class */ (function (_super) {
    __extends(Edit, _super);
    function Edit() {
        var _this = _super.call(this) || this;
        _this.setTitle('Create Article');
        return _this;
    }
    Edit.prototype.skeleton = function () {
        return '';
    };
    Edit.prototype.getHtml = function () {
        return __awaiter(this, void 0, void 0, function () {
            var title, description, body, tags, editArticleData;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        isUpdate = false;
                        title = '';
                        description = '';
                        body = '';
                        tags = [];
                        slug = location.pathname.split('@')[1];
                        if (slug)
                            isUpdate = true;
                        if (!isUpdate) return [3 /*break*/, 2];
                        return [4 /*yield*/, request_1.default.getArticle(slug)];
                    case 1:
                        editArticleData = (_a.sent()).data.article;
                        title = editArticleData.title;
                        description = editArticleData.description;
                        body = editArticleData.body;
                        tags = editArticleData.tagList;
                        _a.label = 2;
                    case 2: return [2 /*return*/, "<div class=\"editor-page\">\n    <div class=\"container page\">\n      <div class=\"row\">\n  \n        <div class=\"col-md-10 offset-md-1 col-xs-12\">\n          <form>\n            <fieldset>\n              <fieldset class=\"form-group\">\n                  <input type=\"text\" class=\"article-title form-control form-control-lg\" placeholder=\"Article Title\" value=\"" + title + "\">\n              </fieldset>\n              <fieldset class=\"form-group\">\n                  <input type=\"text\" class=\"article-description form-control\" placeholder=\"What's this article about?\" value=\"" + description + "\">\n              </fieldset>\n              <fieldset class=\"form-group\">\n                  <textarea class=\"article-body form-control\" rows=\"8\" placeholder=\"Write your article (in markdown)\">" + body + "</textarea>\n              </fieldset>\n              <fieldset class=\"form-group\">\n                  <input type=\"text\" class=\"article-tag-list form-control\" placeholder=\"Enter tags\" value=\"" + tags + "\"><div class=\"tag-list\"></div>\n              </fieldset>\n              <button class=\"btn btn-lg btn-publish pull-xs-right btn-primary\" type=\"button\">\n                  Publish Article\n              </button>\n            </fieldset>\n          </form>\n        </div>\n  \n      </div>\n    </div>\n  </div>"];
                }
            });
        });
    };
    Edit.prototype.eventBinding = function () {
        var _this = this;
        var $articleTitle = document.querySelector('.article-title');
        var $articleDescription = document.querySelector('.article-description');
        var $articleBody = document.querySelector('.article-body');
        var $articleTagList = document.querySelector('.article-tag-list');
        var $btnPublish = document.querySelector('.btn-publish');
        $btnPublish.addEventListener('click', function () { return __awaiter(_this, void 0, void 0, function () {
            var title, description, body, tagList;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        title = $articleTitle.value;
                        description = $articleDescription.value;
                        body = $articleBody.value;
                        tagList = $articleTagList.value.split(',');
                        if (!isUpdate) return [3 /*break*/, 2];
                        return [4 /*yield*/, request_1.default.updateArticle(slug, title, description, body, tagList)];
                    case 1:
                        _a.sent();
                        navigateTo_1.default("/article@" + slug);
                        return [3 /*break*/, 4];
                    case 2: return [4 /*yield*/, request_1.default.createAticle(title, description, body, tagList)];
                    case 3:
                        _a.sent();
                        navigateTo_1.default('/home');
                        _a.label = 4;
                    case 4: return [2 /*return*/];
                }
            });
        }); });
    };
    return Edit;
}(View_1.default));
exports.default = Edit;


/***/ }),

/***/ "./client/src/components/getArticlesHtml.ts":
/*!**************************************************!*\
  !*** ./client/src/components/getArticlesHtml.ts ***!
  \**************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
var dateConverter_1 = __importDefault(__webpack_require__(/*! ../utils/dateConverter */ "./client/src/utils/dateConverter.ts"));
var getArticlesHtml = function (articlesInfo) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        return [2 /*return*/, articlesInfo.map(function (articleInfo) {
                var authorInfo = articleInfo.author;
                var tagList = articleInfo.tagList.map(function (tag) { return "<li class=\"tag-default tag-pill tag-outline\">" + tag + "</li>"; }).join('');
                return "<div class=\"article-preview\">\n      <div class=\"article-meta\">\n        <a href=\"/profile@" + authorInfo.username + "\"><img src=\"" + authorInfo.image + "\" /></a>\n        <div class=\"info\">\n          <a href=\"/profile@" + authorInfo.username + "\" class=\"author\">" + authorInfo.username + "</a>\n          <span class=\"date\">" + dateConverter_1.default(articleInfo.createdAt) + "</span>\n        </div>\n        <button class=\"btn btn-outline-primary btn-sm pull-xs-right\">\n          <i class=\"ion-heart\"></i> " + articleInfo.favoritesCount + "\n        </button>\n      </div>\n      <a href=\"/article@" + articleInfo.slug + "\" class=\"preview-link\">\n        <h1>" + articleInfo.title + "</h1>\n        <p>" + articleInfo.description + "</p>\n        <span>Read more...</span>\n        <ul class=\"tag-list\">\n          " + tagList + "\n        </ul>\n      </a>\n    </div>";
            }).join('')];
    });
}); };
exports.default = getArticlesHtml;


/***/ }),

/***/ "./client/src/components/home.ts":
/*!***************************************!*\
  !*** ./client/src/components/home.ts ***!
  \***************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
var View_1 = __importDefault(__webpack_require__(/*! ../utils/View */ "./client/src/utils/View.ts"));
var navigateTo_1 = __importDefault(__webpack_require__(/*! ../utils/navigateTo */ "./client/src/utils/navigateTo.ts"));
var dateConverter_1 = __importDefault(__webpack_require__(/*! ../utils/dateConverter */ "./client/src/utils/dateConverter.ts"));
var articlesSkeleton_1 = __importDefault(__webpack_require__(/*! ./articlesSkeleton */ "./client/src/components/articlesSkeleton.ts"));
var request_1 = __importDefault(__webpack_require__(/*! ../api/request */ "./client/src/api/request.ts"));
var posts = [];
var tags = [];
var nowPage = 1;
var articlesCount = 0;
var slidesX = 0;
var ARTICLE_LIMIT = 10;
var PAGE_MENU_COUNT = 5;
var Home = /** @class */ (function (_super) {
    __extends(Home, _super);
    function Home() {
        var _this = _super.call(this) || this;
        _this.setTitle('Home');
        return _this;
    }
    Home.prototype.skeleton = function () {
        return "<div class=\"home-page\">\n      <div class=\"banner\">\n        <div class=\"container\">\n          <h1 class=\"logo-font\">conduit</h1>\n          <p>A place to share your knowledge.</p>\n        </div>\n      </div>\n    \n      <div class=\"container page\">\n        <div class=\"row\">\n    \n          <div class=\"col-md-9\">\n            <div class=\"feed-toggle\">\n              <ul class=\"nav nav-pills outline-active\">\n                <li class=\"nav-item\">\n                  <a class=\"nav-link disabled\" href=\"\">Your Feed</a>\n                </li>\n                <li class=\"nav-item\">\n                  <a class=\"nav-link active\" href=\"\">Global Feed</a>\n                </li>\n              </ul>\n            </div>\n            " + articlesSkeleton_1.default() + "            \n          </div>\n    \n          <div class=\"col-md-3\">\n            <div class=\"sidebar\">\n            <p>Popular Tags</p>\n            \n            <div class=\"tag-list\">\n              Loading...\n            </div>\n          </div>\n        </div>\n  \n      </div>\n    </div>\n  \n  </div>";
    };
    Home.prototype.getHtml = function () {
        return __awaiter(this, void 0, void 0, function () {
            var articleData;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, request_1.default.getArticles("limit=" + ARTICLE_LIMIT + "&offset=" + (nowPage - 1) * ARTICLE_LIMIT)];
                    case 1:
                        articleData = (_a.sent()).data;
                        articlesCount = articleData.articlesCount;
                        posts = articleData.articles;
                        return [4 /*yield*/, request_1.default.getTags()];
                    case 2: return [4 /*yield*/, (_a.sent()).data.tags];
                    case 3:
                        tags = _a.sent();
                        return [2 /*return*/, "<div class=\"home-page\">\n    <div class=\"banner\">\n      <div class=\"container\">\n        <h1 class=\"logo-font\">conduit</h1>\n        <p>A place to share your knowledge.</p>\n      </div>\n    </div>\n  \n    <div class=\"container page\">\n      <div class=\"row\">\n  \n        <div class=\"col-md-9\">\n          <div class=\"feed-toggle\">\n            <ul class=\"nav nav-pills outline-active\">\n              <li class=\"nav-item\">\n                <a class=\"nav-link disabled\" href=\"\">Your Feed</a>\n              </li>\n              <li class=\"nav-item\">\n                <a class=\"nav-link active\" href=\"\">Global Feed</a>\n              </li>\n            </ul>\n          </div>\n          " + posts.map(function (post) {
                                return "<div class=\"article-preview\">\n              <div class=\"article-meta\">\n                <a href=\"/profile\"><img src=\"" + post.author.image + "\"/></a>\n                <div class=\"info\">\n                  <a href=\"/profile@" + post.author.username + "\" class=\"author\">" + post.author.username + "</a>\n                  <span class=\"date\">" + dateConverter_1.default(post.createdAt) + "</span>\n                </div>\n                <button class=\"btn btn-outline-primary btn-sm pull-xs-right\">\n                  <i class=\"ion-heart\"></i> " + post.favoritesCount + "\n                </button>\n              </div>\n              <a href=\"/article@" + post.slug + "\" class=\"preview-link\">\n                <h1>" + post.title + "</h1>\n                <p>" + post.description + "</p>\n                <span>Read more...</span>\n              </a>\n            </div>";
                            }).join('') + "\n            <div class=\"pagination-wraper\">\n              <ul class=\"pagination\">\n                <li class=\"page-item\"><a class=\"page-link move-first-page\">&lt;&lt;</a></li>\n                <li class=\"page-item\"><a class=\"page-link move-prev-page\"> &lt; </a></li>\n                <li class=\"page-slides\">\n                  <ul class=\"page-numbers\" style=\"transform: translateX(-" + slidesX + "px)\">\n                    " + Array.from({ length: articlesCount / ARTICLE_LIMIT }, function (_, i) { return i + 1; }).map(function (page) {
                                return "<li class=\"page-item " + (+nowPage === page ? 'active' : '') + "\"><a class=\"page-link page-number\">" + page + "</a></li>";
                            }).join('') + "\n                  </ul>\n                </li>\n                <li class=\"page-item\"><a class=\"page-link move-next-page\"> &gt; </a></li>\n                <li class=\"page-item\"><a class=\"page-link move-last-page\">&gt;&gt;</a></li>\n              </ul>\n            </div>\n        </div>\n  \n        <div class=\"col-md-3\">\n          <div class=\"sidebar\">\n            <p>Popular Tags</p>\n  \n            <div class=\"tag-list\">\n              " + tags.map(function (tag) { return "<a href=\"\" class=\"tag-pill tag-default\">" + tag + "</a>"; }).join('') + "\n            </div>\n          </div>\n        </div>\n  \n      </div>\n    </div>\n  \n  </div>"];
                }
            });
        });
    };
    Home.prototype.eventBinding = function () {
        var _this = this;
        var $colMd9 = document.querySelector('.col-md-9');
        var $pagination = document.querySelector('.pagination');
        var $pageNumbers = document.querySelector('.page-numbers');
        var $moveFirstPage = document.querySelector('.move-first-page');
        var $movePrevPage = document.querySelector('.move-prev-page');
        var $moveNextPage = document.querySelector('.move-next-page');
        var $moveLastPage = document.querySelector('.move-last-page');
        $colMd9.addEventListener('click', function (e) {
            var target = e.target;
            var parentNode = target.parentNode;
            if (target.matches('[href] > *')) {
                e.preventDefault();
                navigateTo_1.default(parentNode.href);
            }
        });
        $pagination.addEventListener('click', function (e) { return __awaiter(_this, void 0, void 0, function () {
            var target, pageListItem, pageNumber;
            return __generator(this, function (_a) {
                target = e.target;
                pageListItem = target.parentNode;
                if (!target.classList.contains('page-number') || pageListItem.classList.contains('active'))
                    return [2 /*return*/];
                pageNumber = target.textContent;
                nowPage = pageNumber;
                navigateTo_1.default("/home");
                return [2 /*return*/];
            });
        }); });
        $moveFirstPage.addEventListener('click', function () {
            slidesX = 0;
            $pageNumbers.style.transform = "translateX(-" + slidesX + "px)";
        });
        $movePrevPage.addEventListener('click', function () {
            slidesX -= ($pageNumbers.clientWidth - 2);
            if (slidesX < 0) {
                slidesX = 0;
                return;
            }
            $pageNumbers.style.transform = "translateX(-" + slidesX + "px)";
        });
        $moveNextPage.addEventListener('click', function () {
            slidesX += ($pageNumbers.clientWidth - 2);
            if (slidesX > $pageNumbers.scrollWidth - 5) {
                slidesX = $pageNumbers.scrollWidth - 195;
                return;
            }
            $pageNumbers.style.transform = "translateX(-" + slidesX + "px)";
        });
        $moveLastPage.addEventListener('click', function () {
            slidesX = $pageNumbers.scrollWidth - $pageNumbers.clientWidth;
            $pageNumbers.style.transform = "translateX(-" + slidesX + "px)";
        });
    };
    return Home;
}(View_1.default));
exports.default = Home;


/***/ }),

/***/ "./client/src/components/login.ts":
/*!****************************************!*\
  !*** ./client/src/components/login.ts ***!
  \****************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
var View_1 = __importDefault(__webpack_require__(/*! ../utils/View */ "./client/src/utils/View.ts"));
var request_1 = __importDefault(__webpack_require__(/*! ../api/request */ "./client/src/api/request.ts"));
var switchHeaderNav_1 = __importDefault(__webpack_require__(/*! ./switchHeaderNav */ "./client/src/components/switchHeaderNav.ts"));
var Login = /** @class */ (function (_super) {
    __extends(Login, _super);
    function Login() {
        var _this = _super.call(this) || this;
        _this.setTitle('login');
        return _this;
    }
    Login.prototype.skeleton = function () {
        return '';
    };
    // eslint-disable-next-line class-methods-use-this
    Login.prototype.getHtml = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, "<div class=\"auth-page\">\n    <div class=\"container page\">\n      <div class=\"row\">\n  \n        <div class=\"col-md-6 offset-md-3 col-xs-12 login-container\">\n          <h1 class=\"text-xs-center\">Sign in</h1>\n\n          <p class=\"text-xs-center\">\n            <a href=\"/register\">Need an account?</a>\n          </p>\n  \n          <form>\n            <fieldset class=\"form-group\">\n              <input class=\"form-control form-control-lg login-input-email\" type=\"text\" placeholder=\"Email\">\n            </fieldset>\n            <fieldset class=\"form-group\">\n              <input class=\"form-control form-control-lg login-input-pw\" type=\"password\" placeholder=\"Password\">\n            </fieldset>\n            <button class=\"btn btn-lg btn-primary pull-xs-right login-btn\">\n              Sign up\n            </button>\n          </form>\n        </div>\n  \n      </div>\n    </div>\n  </div>"];
            });
        });
    };
    Login.prototype.eventBinding = function () {
        var _this = this;
        var $loginBtn = document.querySelector('.login-btn');
        var $loginContainer = document.querySelector('.login-container');
        var $errorMessages = document.createElement('ul');
        var signin = function (e) { return __awaiter(_this, void 0, void 0, function () {
            var $inputEmail, $inputPassword, email, password, userToken, err_1, errorObj, errorName, errorMessage;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        e.preventDefault();
                        $inputEmail = document.querySelector('.login-input-email');
                        $inputPassword = document.querySelector('.login-input-pw');
                        email = $inputEmail.value;
                        password = $inputPassword.value;
                        return [4 /*yield*/, request_1.default.signin(email, password)];
                    case 1:
                        userToken = (_a.sent()).data.user.token;
                        localStorage.setItem('JWT', userToken);
                        switchHeaderNav_1.default();
                        $errorMessages.innerHTML = '';
                        $inputEmail.value = '';
                        $inputPassword.value = '';
                        return [3 /*break*/, 3];
                    case 2:
                        err_1 = _a.sent();
                        errorObj = err_1.response.data.errors;
                        errorName = Object.keys(errorObj);
                        errorMessage = Object.values(errorObj);
                        $errorMessages.innerHTML = "<li>" + errorName + " " + errorMessage + "</li>";
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); };
        $loginContainer.insertBefore($errorMessages, $loginContainer.lastElementChild);
        $errorMessages.classList.add('error-messages');
        $loginBtn.addEventListener('click', signin);
    };
    return Login;
}(View_1.default));
exports.default = Login;


/***/ }),

/***/ "./client/src/components/profile.ts":
/*!******************************************!*\
  !*** ./client/src/components/profile.ts ***!
  \******************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
var View_1 = __importDefault(__webpack_require__(/*! ../utils/View */ "./client/src/utils/View.ts"));
var request_1 = __importDefault(__webpack_require__(/*! ../api/request */ "./client/src/api/request.ts"));
var getArticlesHtml_1 = __importDefault(__webpack_require__(/*! ./getArticlesHtml */ "./client/src/components/getArticlesHtml.ts"));
var articlesSkeleton_1 = __importDefault(__webpack_require__(/*! ./articlesSkeleton */ "./client/src/components/articlesSkeleton.ts"));
var switchHeaderNav_1 = __importDefault(__webpack_require__(/*! ./switchHeaderNav */ "./client/src/components/switchHeaderNav.ts"));
var showArticle_1 = __importDefault(__webpack_require__(/*! ./showArticle */ "./client/src/components/showArticle.ts"));
var switchArticleSection_1 = __importDefault(__webpack_require__(/*! ./switchArticleSection */ "./client/src/components/switchArticleSection.ts"));
var toggleFavoriteArticle_1 = __importDefault(__webpack_require__(/*! ./toggleFavoriteArticle */ "./client/src/components/toggleFavoriteArticle.ts"));
var Profile = /** @class */ (function (_super) {
    __extends(Profile, _super);
    function Profile() {
        var _this = _super.call(this) || this;
        _this.setTitle('settings');
        return _this;
    }
    Profile.prototype.skeleton = function () {
        return "<div class=\"profile-page\">\n    <div class=\"user-info\">\n      <div class=\"container\">\n        <div class=\"row\">\n  \n          <div class=\"col-xs-12 col-md-10 offset-md-1\" style=\"height: 209px\">\n            <img src=\"https://static.productionready.io/images/smiley-cyrus.jpg\" class=\"user-img\" />\n            <h4 style=\"width: 200px; height: 26px; background-color: #ccc; margin: 0 auto 8px auto;\"></h4>\n            <p style=\"width: 200px; height: 24px; background-color: #ccc; margin: 0 auto 8px auto;\"></p>\n          </div>\n        </div>\n      </div>\n    </div>\n  \n    <div class=\"container\">\n      <div class=\"row\">\n  \n      <div class=\"articles-toggle\" style=\"margin-left: 8.33333%\">\n        <ul class=\"nav nav-pills outline-active\">\n          <li class=\"nav-item\">\n            <button class=\"nav-link active\" style=\"outline:none\">My Articles</button>\n          </li>\n          <li class=\"nav-item\">\n            <button class=\"nav-link\" style=\"outline:none\">Favorited Articles</button>\n          </li>\n        </ul>\n      </div>\n        <div class=\"col-xs-12 col-md-10 offset-md-1 articles-container\">\n          " + articlesSkeleton_1.default() + "\n        </div>\n      </div>\n    </div>\n  \n  </div>";
    };
    // eslint-disable-next-line class-methods-use-this
    Profile.prototype.getHtml = function () {
        return __awaiter(this, void 0, void 0, function () {
            var slug, currentUserName, userInfo, userArticlesInfo, _a, userImgUrl, userName, userBio, userFollowing, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        slug = window.location.pathname.split('@')[1];
                        return [4 /*yield*/, request_1.default.getCurrentUserInfo()];
                    case 1:
                        currentUserName = (_c.sent()).data.user.username;
                        return [4 /*yield*/, request_1.default.getUserProfile(slug)];
                    case 2:
                        userInfo = (_c.sent()).data.profile;
                        return [4 /*yield*/, request_1.default.getArticles("author=" + slug)];
                    case 3:
                        userArticlesInfo = (_c.sent()).data.articles;
                        _a = [userInfo.image, userInfo.username, userInfo.bio, userInfo.following], userImgUrl = _a[0], userName = _a[1], userBio = _a[2], userFollowing = _a[3];
                        _b = "<div class=\"profile-page\">\n    <div class=\"user-info\">\n      <div class=\"container\">\n        <div class=\"row\">\n  \n          <div class=\"col-xs-12 col-md-10 offset-md-1\" style=\"height: 209px\">\n            <img src=\"" + (userImgUrl ? userImgUrl : 'https://static.productionready.io/images/smiley-cyrus.jpg') + "\" class=\"user-img\" />\n            <h4>" + (userName ? userName : '') + "</h4>\n            <p>" + (userBio ? userBio : '') + "</p>\n            <button class=\"btn btn-sm btn-outline-secondary action-btn\" style=\"position: absolute; right: 10px; bottom: 10px; color: " + (slug === currentUserName ? '#b85c5c' : '') + "; border-color: " + (slug === currentUserName ? '#b85c5c' : '') + "\">" + (slug === currentUserName ? 'Sign out' : userFollowing ? 'Unfollow' : 'Follow') + "</button>\n          </div>\n        </div>\n      </div>\n    </div>\n  \n    <div class=\"container\">\n      <div class=\"row\">\n  \n      <div class=\"articles-toggle\" style=\"margin-left: 8.33333%\">\n        <ul class=\"nav nav-pills outline-active\">\n          <li class=\"nav-item\">\n            <button class=\"nav-link active\" style=\"outline:none\">My Articles</button>\n          </li>\n          <li class=\"nav-item\">\n            <button class=\"nav-link\" style=\"outline:none\">Favorited Articles</button>\n          </li>\n        </ul>\n      </div>\n        <div class=\"col-xs-12 col-md-10 offset-md-1 articles-container\">\n          ";
                        return [4 /*yield*/, getArticlesHtml_1.default(userArticlesInfo)];
                    case 4: return [2 /*return*/, _b + (_c.sent()) + "\n        </div>\n      </div>\n    </div>\n  \n  </div>"];
                }
            });
        });
    };
    Profile.prototype.eventBinding = function () {
        var $signoutFollowBtn = document.querySelector('.profile-page .btn');
        var $articleTab = document.querySelector('.nav-pills');
        var $articleContainer = document.querySelector('.articles-container');
        $signoutFollowBtn.addEventListener('click', function (e) {
            var target = e.target;
            var userName = window.location.pathname.split('@')[1];
            if (target.textContent === 'Sign out') {
                localStorage.removeItem('JWT');
                switchHeaderNav_1.default();
            }
            if (target.textContent === 'Follow') {
                request_1.default.followUser(userName);
                target.textContent = 'Unfollow';
            }
            if (target.textContent === 'Unfollow') {
                request_1.default.unfollowUser(userName);
                target.textContent = 'Follow';
            }
        });
        $articleTab.addEventListener('click', switchArticleSection_1.default);
        $articleContainer.addEventListener('click', function (e) {
            showArticle_1.default(e);
            toggleFavoriteArticle_1.default(e);
        });
    };
    return Profile;
}(View_1.default));
exports.default = Profile;


/***/ }),

/***/ "./client/src/components/register.ts":
/*!*******************************************!*\
  !*** ./client/src/components/register.ts ***!
  \*******************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
var View_1 = __importDefault(__webpack_require__(/*! ../utils/View */ "./client/src/utils/View.ts"));
var navigateTo_1 = __importDefault(__webpack_require__(/*! ../utils/navigateTo */ "./client/src/utils/navigateTo.ts"));
var request_1 = __importDefault(__webpack_require__(/*! ../api/request */ "./client/src/api/request.ts"));
var Register = /** @class */ (function (_super) {
    __extends(Register, _super);
    function Register() {
        var _this = _super.call(this) || this;
        _this.setTitle('register');
        return _this;
    }
    Register.prototype.skeleton = function () {
        return '';
    };
    // eslint-disable-next-line class-methods-use-this
    Register.prototype.getHtml = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, "<div class=\"auth-page\">\n    <div class=\"container page\">\n      <div class=\"row\">\n  \n        <div class=\"col-md-6 offset-md-3 col-xs-12 signup-container\">\n          <h1 class=\"text-xs-center\">Sign up</h1>\n          <p class=\"text-xs-center\">\n            <a href=\"\">Have an account?</a>\n          </p>\n  \n          <!-- <ul class=\"error-messages\">\n            <li>That email is already taken</li>\n          </ul> -->\n  \n          <form>\n            <fieldset class=\"form-group\">\n              <input class=\"form-control form-control-lg signup-input-name\" type=\"text\" placeholder=\"Your Name\">\n            </fieldset>\n            <fieldset class=\"form-group\">\n              <input class=\"form-control form-control-lg signup-input-email\" type=\"text\" placeholder=\"Email\">\n            </fieldset>\n            <fieldset class=\"form-group\">\n              <input class=\"form-control form-control-lg signup-input-pw\" type=\"password\" placeholder=\"Password\">\n            </fieldset>\n            <button class=\"btn btn-lg btn-primary pull-xs-right signup-btn\">\n              Sign up\n            </button>\n          </form>\n        </div>\n  \n      </div>\n    </div>\n  </div>"];
            });
        });
    };
    Register.prototype.eventBinding = function () {
        var _this = this;
        var $signupBtn = document.querySelector('.signup-btn');
        var $signupContainer = document.querySelector('.signup-container');
        var $errorMessages = document.createElement('ul');
        var signup = function (e) { return __awaiter(_this, void 0, void 0, function () {
            var $inputName, $inputEmail, $inputPassword, name_1, email, password, userToken, err_1, errorObj, errorNames_1, errorMessages;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        e.preventDefault();
                        $inputName = document.querySelector('.signup-input-name');
                        $inputEmail = document.querySelector('.signup-input-email');
                        $inputPassword = document.querySelector('.signup-input-pw');
                        name_1 = $inputName.value;
                        email = $inputEmail.value;
                        password = $inputPassword.value;
                        return [4 /*yield*/, request_1.default.signup(name_1, email, password)];
                    case 1:
                        userToken = (_a.sent()).data.user.token;
                        localStorage.setItem('JWT', userToken);
                        navigateTo_1.default('/');
                        $errorMessages.innerHTML = '';
                        $inputName.value = '';
                        $inputEmail.value = '';
                        $inputPassword.value = '';
                        return [3 /*break*/, 3];
                    case 2:
                        err_1 = _a.sent();
                        errorObj = err_1.response.data.errors;
                        errorNames_1 = Object.keys(errorObj);
                        errorMessages = Object.values(errorObj);
                        $errorMessages.innerHTML = errorMessages.map(function (message, index) {
                            return "<li>" + errorNames_1[index] + " " + message.join(', ') + "</li>";
                        }).join('');
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); };
        $signupContainer.insertBefore($errorMessages, $signupContainer.lastElementChild);
        $errorMessages.classList.add('error-messages');
        $signupBtn.addEventListener('click', signup);
    };
    return Register;
}(View_1.default));
exports.default = Register;


/***/ }),

/***/ "./client/src/components/renderFooter.ts":
/*!***********************************************!*\
  !*** ./client/src/components/renderFooter.ts ***!
  \***********************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
var renderFooter = function () { return "\n  <div class=\"container\">\n    <a href=\"/\" class=\"logo-font\">conduit</a>\n    <span class=\"attribution\">\n      An interactive learning project from <a href=\"https://thinkster.io\">Thinkster</a>. Code &amp; design licensed under MIT.\n    </span>\n  </div>\n"; };
exports.default = renderFooter;


/***/ }),

/***/ "./client/src/components/renderHeader.ts":
/*!***********************************************!*\
  !*** ./client/src/components/renderHeader.ts ***!
  \***********************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
var request_1 = __importDefault(__webpack_require__(/*! ../api/request */ "./client/src/api/request.ts"));
var renderHeader = function () { return __awaiter(void 0, void 0, void 0, function () {
    var userToken, currentPage, userName, userInfo;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                userToken = window.localStorage.getItem('JWT');
                currentPage = window.location.pathname.split('@')[0];
                userName = '';
                if (!userToken) return [3 /*break*/, 2];
                return [4 /*yield*/, request_1.default.getCurrentUserInfo()];
            case 1:
                userInfo = (_a.sent()).data.user;
                userName = userInfo.username;
                _a.label = 2;
            case 2: return [2 /*return*/, "<nav class=\"navbar navbar-light\">\n  <div class=\"container\">\n    <a class=\"navbar-brand\" href=\"/\">conduit</a>\n    <ul class=\"nav navbar-nav pull-xs-right\">\n      <li class=\"nav-item\">\n        <!-- Add \"active\" class when you're on that page\" -->\n        <a class=\"nav-link " + (currentPage === '/' ? 'active' : '') + "\" href=\"/\">Home</a>\n      </li>\n      <li class=\"nav-item\">\n      " + (userToken ? "<a class=\"nav-link " + (currentPage === '/editor' ? 'active' : '') + "\" href=\"/editor\">\n      <i class=\"ion-compose\"></i>&nbsp;New Post\n    </a>" : '') + "\n      </li>\n      <li class=\"nav-item\">\n        <a class=\"nav-link " + (currentPage === '/login' ? 'active' : currentPage === '/settings' ? 'active' : '') + "\" href=\"" + (userToken ? '/settings' : '/login') + "\">\n          " + (userToken ? '<i class="ion-gear-a"></i>&nbsp;Settings' : 'Sign in') + "\n        </a>\n      </li>\n      <li class=\"nav-item\">\n        <a class=\"nav-link " + (currentPage === '/register' ? 'active' : currentPage === '/profile' ? 'active' : '') + "\" href=\"" + (userToken ? "/profile@" + userName : '/register') + "\">" + (userToken ? userName : 'Sign up') + "</a>\n      </li>\n    </ul>\n  </div>\n</nav>"];
        }
    });
}); };
exports.default = renderHeader;


/***/ }),

/***/ "./client/src/components/settings.ts":
/*!*******************************************!*\
  !*** ./client/src/components/settings.ts ***!
  \*******************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
var View_1 = __importDefault(__webpack_require__(/*! ../utils/View */ "./client/src/utils/View.ts"));
var navigateTo_1 = __importDefault(__webpack_require__(/*! ../utils/navigateTo */ "./client/src/utils/navigateTo.ts"));
var request_1 = __importDefault(__webpack_require__(/*! ../api/request */ "./client/src/api/request.ts"));
var Settings = /** @class */ (function (_super) {
    __extends(Settings, _super);
    function Settings() {
        var _this = _super.call(this) || this;
        _this.setTitle('settings');
        return _this;
    }
    Settings.prototype.skeleton = function () {
        return '';
    };
    // eslint-disable-next-line class-methods-use-this
    Settings.prototype.getHtml = function () {
        return __awaiter(this, void 0, void 0, function () {
            var userInfo, _a, userImgUrl, userName, userBio, userEmail;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, request_1.default.getCurrentUserInfo()];
                    case 1:
                        userInfo = (_b.sent()).data.user;
                        _a = [userInfo.image, userInfo.username, userInfo.bio, userInfo.email], userImgUrl = _a[0], userName = _a[1], userBio = _a[2], userEmail = _a[3];
                        return [2 /*return*/, "<div class=\"settings-page\">\n      <div class=\"container page\">\n        <div class=\"row\">\n    \n          <div class=\"col-md-6 offset-md-3 col-xs-12\">\n            <h1 class=\"text-xs-center\">Your Settings</h1>\n    \n            <form>\n              <fieldset>\n                  <fieldset class=\"form-group\">\n                    <input class=\"form-control setting-input-img-url\" type=\"text\" placeholder=\"URL of profile picture\" value=\"" + (userImgUrl ? userImgUrl : '') + "\">\n                  </fieldset>\n                  <fieldset class=\"form-group\">\n                    <input class=\"form-control form-control-lg setting-input-name\" type=\"text\" placeholder=\"Your Name\" value=\"" + (userName ? userName : '') + "\">\n                  </fieldset>\n                  <fieldset class=\"form-group\">\n                    <textarea class=\"form-control form-control-lg setting-input-bio\" rows=\"8\" placeholder=\"Short bio about you\">" + (userBio ? userBio : '') + "</textarea>\n                  </fieldset>\n                  <fieldset class=\"form-group\">\n                    <input class=\"form-control form-control-lg setting-input-email\" type=\"text\" placeholder=\"Email\" value=\"" + (userEmail ? userEmail : '') + "\">\n                  </fieldset>\n                  <fieldset class=\"form-group\">\n                    <input class=\"form-control form-control-lg setting-input-pw\" type=\"password\" placeholder=\"Password\">\n                  </fieldset>\n                  <button class=\"btn btn-lg btn-primary pull-xs-right setting-btn\">\n                    Update Settings\n                  </button>\n              </fieldset>\n            </form>\n          </div>\n    \n        </div>\n      </div>\n    </div>"];
                }
            });
        });
    };
    Settings.prototype.eventBinding = function () {
        return __awaiter(this, void 0, void 0, function () {
            var $settingBtn, updateSettings, errorObj, errorName, errorMessage;
            var _this = this;
            return __generator(this, function (_a) {
                try {
                    $settingBtn = document.querySelector('.setting-btn');
                    updateSettings = function (e) { return __awaiter(_this, void 0, void 0, function () {
                        var $inputImgUrl, $inputBio, $inputEmail, $inputPassword, image, bio, email, password, userName;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    e.preventDefault();
                                    $inputImgUrl = document.querySelector('.setting-input-img-url');
                                    $inputBio = document.querySelector('.setting-input-bio');
                                    $inputEmail = document.querySelector('.setting-input-email');
                                    $inputPassword = document.querySelector('.setting-input-pw');
                                    image = $inputImgUrl.value ? $inputImgUrl.value : '';
                                    bio = $inputBio.value ? $inputBio.value : '';
                                    email = $inputEmail.value ? $inputEmail.value : '';
                                    password = $inputPassword.value ? $inputPassword.value : '';
                                    return [4 /*yield*/, request_1.default.updateUserInfo(email, bio, image, password)];
                                case 1:
                                    userName = (_a.sent()).data.user.username;
                                    navigateTo_1.default("/profile@" + userName);
                                    return [2 /*return*/];
                            }
                        });
                    }); };
                    $settingBtn.addEventListener('click', updateSettings);
                }
                catch (err) {
                    errorObj = err.response.data.errors;
                    errorName = Object.keys(errorObj);
                    errorMessage = Object.values(errorObj);
                    console.log(errorName + " " + errorMessage);
                }
                return [2 /*return*/];
            });
        });
    };
    return Settings;
}(View_1.default));
exports.default = Settings;


/***/ }),

/***/ "./client/src/components/showArticle.ts":
/*!**********************************************!*\
  !*** ./client/src/components/showArticle.ts ***!
  \**********************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
var navigateTo_1 = __importDefault(__webpack_require__(/*! ../utils/navigateTo */ "./client/src/utils/navigateTo.ts"));
var showArticle = function (e) {
    var target = e.target;
    var parentNode = target.parentNode;
    if (!target.matches('[href] > *'))
        return;
    e.preventDefault();
    navigateTo_1.default(parentNode.href);
};
exports.default = showArticle;


/***/ }),

/***/ "./client/src/components/switchArticleSection.ts":
/*!*******************************************************!*\
  !*** ./client/src/components/switchArticleSection.ts ***!
  \*******************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
var getArticlesHtml_1 = __importDefault(__webpack_require__(/*! ./getArticlesHtml */ "./client/src/components/getArticlesHtml.ts"));
var articlesSkeleton_1 = __importDefault(__webpack_require__(/*! ./articlesSkeleton */ "./client/src/components/articlesSkeleton.ts"));
var request_1 = __importDefault(__webpack_require__(/*! ../api/request */ "./client/src/api/request.ts"));
var articleState = 'My Articles';
var switchArticleSection = function (e) { return __awaiter(void 0, void 0, void 0, function () {
    var target, $articlesContainer, articleTabs, userName, userArticlesInfo, favoritedArticlesInfo, _a, _b, err_1, errorObj, errorName, errorMessage;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _c.trys.push([0, 7, , 8]);
                target = e.target;
                $articlesContainer = document.querySelector('.articles-container');
                articleTabs = document.querySelectorAll('.nav-link');
                if (!target.matches('.nav-link'))
                    return [2 /*return*/];
                $articlesContainer.innerHTML = articlesSkeleton_1.default();
                userName = window.location.pathname.split('@')[1];
                return [4 /*yield*/, request_1.default.getArticles("author=" + userName)];
            case 1:
                userArticlesInfo = (_c.sent()).data.articles;
                return [4 /*yield*/, request_1.default.getArticles("favorited=" + userName)];
            case 2:
                favoritedArticlesInfo = (_c.sent()).data.articles;
                articleState = target.textContent;
                _a = $articlesContainer;
                if (!(articleState === 'My Articles')) return [3 /*break*/, 4];
                return [4 /*yield*/, getArticlesHtml_1.default(userArticlesInfo)];
            case 3:
                _b = _c.sent();
                return [3 /*break*/, 6];
            case 4: return [4 /*yield*/, getArticlesHtml_1.default(favoritedArticlesInfo)];
            case 5:
                _b = _c.sent();
                _c.label = 6;
            case 6:
                _a.innerHTML = _b;
                articleTabs.forEach(function (tab) { return tab.classList.remove('active'); });
                target.classList.add('active');
                return [3 /*break*/, 8];
            case 7:
                err_1 = _c.sent();
                errorObj = err_1.response.data.errors;
                errorName = Object.keys(errorObj);
                errorMessage = Object.values(errorObj);
                console.log(errorName + " " + errorMessage);
                return [3 /*break*/, 8];
            case 8: return [2 /*return*/];
        }
    });
}); };
exports.default = switchArticleSection;


/***/ }),

/***/ "./client/src/components/switchHeaderNav.ts":
/*!**************************************************!*\
  !*** ./client/src/components/switchHeaderNav.ts ***!
  \**************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
var renderHeader_1 = __importDefault(__webpack_require__(/*! ./renderHeader */ "./client/src/components/renderHeader.ts"));
var navigateTo_1 = __importDefault(__webpack_require__(/*! ../utils/navigateTo */ "./client/src/utils/navigateTo.ts"));
var switchHeaderNav = function () { return __awaiter(void 0, void 0, void 0, function () {
    var $header, _a, err_1, errorObj, errorName, errorMessage;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                $header = document.querySelector('header');
                _a = $header;
                return [4 /*yield*/, renderHeader_1.default()];
            case 1:
                _a.innerHTML = _b.sent();
                navigateTo_1.default('/');
                return [3 /*break*/, 3];
            case 2:
                err_1 = _b.sent();
                errorObj = err_1.response.data.errors;
                errorName = Object.keys(errorObj);
                errorMessage = Object.values(errorObj);
                console.log(errorName + " " + errorMessage);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.default = switchHeaderNav;


/***/ }),

/***/ "./client/src/components/toggleFavoriteArticle.ts":
/*!********************************************************!*\
  !*** ./client/src/components/toggleFavoriteArticle.ts ***!
  \********************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
var request_1 = __importDefault(__webpack_require__(/*! ../api/request */ "./client/src/api/request.ts"));
var toggleFavoriteArticle = function (e) { return __awaiter(void 0, void 0, void 0, function () {
    var targetElement, targetParentElement, targetParentSiblingElement, targetBtn, slug, selectedArticleFavorited, articleInfo, favoritesCount, err_1, errorObj, errorName, errorMessage;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 6, , 7]);
                targetElement = e.target;
                targetParentElement = targetElement.closest('.article-meta');
                targetParentSiblingElement = targetParentElement === null || targetParentElement === void 0 ? void 0 : targetParentElement.nextElementSibling;
                targetBtn = targetElement.closest('.btn');
                slug = targetParentSiblingElement.href.split('@')[1];
                return [4 /*yield*/, request_1.default.getArticle(slug)];
            case 1:
                selectedArticleFavorited = (_a.sent()).data.article.favorited;
                articleInfo = void 0;
                if (!!selectedArticleFavorited) return [3 /*break*/, 3];
                return [4 /*yield*/, request_1.default.favoriteArticle(slug)];
            case 2:
                articleInfo = (_a.sent()).data.article;
                return [3 /*break*/, 5];
            case 3: return [4 /*yield*/, request_1.default.unfavoriteArticle(slug)];
            case 4:
                articleInfo = (_a.sent()).data.article;
                _a.label = 5;
            case 5:
                favoritesCount = articleInfo.favoritesCount;
                targetBtn.innerHTML = "<i class=\"ion-heart\"></i> " + favoritesCount;
                return [3 /*break*/, 7];
            case 6:
                err_1 = _a.sent();
                errorObj = err_1.response.data.errors;
                errorName = Object.keys(errorObj);
                errorMessage = Object.values(errorObj);
                console.log(errorName + " " + errorMessage);
                return [3 /*break*/, 7];
            case 7: return [2 /*return*/];
        }
    });
}); };
exports.default = toggleFavoriteArticle;


/***/ }),

/***/ "./client/src/index.ts":
/*!*****************************!*\
  !*** ./client/src/index.ts ***!
  \*****************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
var routerHandler_1 = __importDefault(__webpack_require__(/*! ./utils/routerHandler */ "./client/src/utils/routerHandler.ts"));
var navigateTo_1 = __importDefault(__webpack_require__(/*! ./utils/navigateTo */ "./client/src/utils/navigateTo.ts"));
var renderHeader_1 = __importDefault(__webpack_require__(/*! ./components/renderHeader */ "./client/src/components/renderHeader.ts"));
var renderFooter_1 = __importDefault(__webpack_require__(/*! ./components/renderFooter */ "./client/src/components/renderFooter.ts"));
__webpack_require__(/*! ./scss/style.scss */ "./client/src/scss/style.scss");
var $root = document.getElementById('root');
// 이벤트 핸들러 등록
document.addEventListener('DOMContentLoaded', function () { return __awaiter(void 0, void 0, void 0, function () {
    var $header, $main, $footer, _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                $header = document.createElement('header');
                $main = document.createElement('main');
                $footer = document.createElement('footer');
                _a = $header;
                return [4 /*yield*/, renderHeader_1.default()];
            case 1:
                _a.innerHTML = _b.sent();
                $footer.innerHTML = renderFooter_1.default();
                $root.appendChild($header);
                $root.appendChild($main);
                $root.appendChild($footer);
                routerHandler_1.default();
                return [2 /*return*/];
        }
    });
}); });
window.addEventListener('popstate', routerHandler_1.default);
$root.addEventListener('click', function (e) {
    var target = e.target;
    if (target.matches('[href]')) {
        e.preventDefault();
        navigateTo_1.default(target.href);
    }
});


/***/ }),

/***/ "./client/src/utils/View.ts":
/*!**********************************!*\
  !*** ./client/src/utils/View.ts ***!
  \**********************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
var View = /** @class */ (function () {
    function View() {
        this.USER_TOKEN = localStorage.getItem('JWT');
    }
    View.prototype.setTitle = function (title) {
        document.title = "Conduit-" + title;
    };
    return View;
}());
exports.default = View;


/***/ }),

/***/ "./client/src/utils/dateConverter.ts":
/*!*******************************************!*\
  !*** ./client/src/utils/dateConverter.ts ***!
  \*******************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
var dateConverter = function (ISOdate) {
    var day = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    var month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
    var createDate = new Date(ISOdate);
    return day[createDate.getDay()] + " " + month[createDate.getMonth()] + " " + createDate.getDate() + " " + createDate.getFullYear();
};
exports.default = dateConverter;


/***/ }),

/***/ "./client/src/utils/navigateTo.ts":
/*!****************************************!*\
  !*** ./client/src/utils/navigateTo.ts ***!
  \****************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
var routerHandler_1 = __importDefault(__webpack_require__(/*! ./routerHandler */ "./client/src/utils/routerHandler.ts"));
var navigateTo = function (url) {
    if (window.location.href === url)
        return;
    window.history.pushState(null, '', url);
    routerHandler_1.default();
};
exports.default = navigateTo;


/***/ }),

/***/ "./client/src/utils/routerHandler.ts":
/*!*******************************************!*\
  !*** ./client/src/utils/routerHandler.ts ***!
  \*******************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
var home_1 = __importDefault(__webpack_require__(/*! ../components/home */ "./client/src/components/home.ts"));
var login_1 = __importDefault(__webpack_require__(/*! ../components/login */ "./client/src/components/login.ts"));
var register_1 = __importDefault(__webpack_require__(/*! ../components/register */ "./client/src/components/register.ts"));
var articlePreview_1 = __importDefault(__webpack_require__(/*! ../components/articlePreview */ "./client/src/components/articlePreview.ts"));
var edit_1 = __importDefault(__webpack_require__(/*! ../components/edit */ "./client/src/components/edit.ts"));
var settings_1 = __importDefault(__webpack_require__(/*! ../components/settings */ "./client/src/components/settings.ts"));
var profile_1 = __importDefault(__webpack_require__(/*! ../components/profile */ "./client/src/components/profile.ts"));
var renderHeader_1 = __importDefault(__webpack_require__(/*! ../components/renderHeader */ "./client/src/components/renderHeader.ts"));
var $root = document.getElementById('root');
var routerHandler = function () { return __awaiter(void 0, void 0, void 0, function () {
    var routes, potentialmatches, match, view, $main, $header, _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                routes = [
                    { path: '/home', View: home_1.default },
                    { path: '/login', View: login_1.default },
                    { path: '/register', View: register_1.default },
                    { path: '/article', View: articlePreview_1.default },
                    { path: '/editor', View: edit_1.default },
                    { path: '/settings', View: settings_1.default },
                    { path: '/profile', View: profile_1.default }
                ];
                potentialmatches = routes.map(function (route) { return ({
                    route: route,
                    // pathname이 route로 시작하는지 검사하는 정규표현식 작성
                    isMatch: new RegExp('^' + route.path).test(window.location.pathname)
                }); });
                match = potentialmatches.find(function (potentialmatch) { return potentialmatch.isMatch; });
                if (!match) {
                    match = {
                        route: routes[0],
                        isMatch: true
                    };
                    window.history.pushState(null, '', '/');
                }
                view = new match.route.View();
                $main = document.querySelector('main');
                $header = document.querySelector('header');
                _a = $header;
                return [4 /*yield*/, renderHeader_1.default()];
            case 1:
                _a.innerHTML = _c.sent();
                window.scrollTo(0, 0);
                $main.innerHTML = view.skeleton();
                _b = $main;
                return [4 /*yield*/, view.getHtml()];
            case 2:
                _b.innerHTML = _c.sent();
                view.eventBinding();
                return [2 /*return*/];
        }
    });
}); };
exports.default = routerHandler;


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		if(__webpack_module_cache__[moduleId]) {
/******/ 			return __webpack_module_cache__[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			id: moduleId,
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__("./client/src/index.ts");
/******/ 	
/******/ })()
;
//# sourceMappingURL=bundle.js.map