/******/ (function() { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/@emotion/cache/dist/emotion-cache.browser.esm.js":
/*!***********************************************************************!*\
  !*** ./node_modules/@emotion/cache/dist/emotion-cache.browser.esm.js ***!
  \***********************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _emotion_sheet__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @emotion/sheet */ "./node_modules/@emotion/sheet/dist/emotion-sheet.browser.esm.js");
/* harmony import */ var stylis__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! stylis */ "./node_modules/stylis/src/Tokenizer.js");
/* harmony import */ var stylis__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! stylis */ "./node_modules/stylis/src/Utility.js");
/* harmony import */ var stylis__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! stylis */ "./node_modules/stylis/src/Middleware.js");
/* harmony import */ var stylis__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! stylis */ "./node_modules/stylis/src/Serializer.js");
/* harmony import */ var stylis__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! stylis */ "./node_modules/stylis/src/Enum.js");
/* harmony import */ var stylis__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! stylis */ "./node_modules/stylis/src/Parser.js");
/* harmony import */ var _emotion_weak_memoize__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @emotion/weak-memoize */ "./node_modules/@emotion/weak-memoize/dist/weak-memoize.browser.esm.js");
/* harmony import */ var _emotion_memoize__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @emotion/memoize */ "./node_modules/@emotion/memoize/dist/emotion-memoize.browser.esm.js");





var last = function last(arr) {
  return arr.length ? arr[arr.length - 1] : null;
}; // based on https://github.com/thysultan/stylis.js/blob/e6843c373ebcbbfade25ebcc23f540ed8508da0a/src/Tokenizer.js#L239-L244


var identifierWithPointTracking = function identifierWithPointTracking(begin, points, index) {
  var previous = 0;
  var character = 0;

  while (true) {
    previous = character;
    character = (0,stylis__WEBPACK_IMPORTED_MODULE_3__.peek)(); // &\f

    if (previous === 38 && character === 12) {
      points[index] = 1;
    }

    if ((0,stylis__WEBPACK_IMPORTED_MODULE_3__.token)(character)) {
      break;
    }

    (0,stylis__WEBPACK_IMPORTED_MODULE_3__.next)();
  }

  return (0,stylis__WEBPACK_IMPORTED_MODULE_3__.slice)(begin, stylis__WEBPACK_IMPORTED_MODULE_3__.position);
};

var toRules = function toRules(parsed, points) {
  // pretend we've started with a comma
  var index = -1;
  var character = 44;

  do {
    switch ((0,stylis__WEBPACK_IMPORTED_MODULE_3__.token)(character)) {
      case 0:
        // &\f
        if (character === 38 && (0,stylis__WEBPACK_IMPORTED_MODULE_3__.peek)() === 12) {
          // this is not 100% correct, we don't account for literal sequences here - like for example quoted strings
          // stylis inserts \f after & to know when & where it should replace this sequence with the context selector
          // and when it should just concatenate the outer and inner selectors
          // it's very unlikely for this sequence to actually appear in a different context, so we just leverage this fact here
          points[index] = 1;
        }

        parsed[index] += identifierWithPointTracking(stylis__WEBPACK_IMPORTED_MODULE_3__.position - 1, points, index);
        break;

      case 2:
        parsed[index] += (0,stylis__WEBPACK_IMPORTED_MODULE_3__.delimit)(character);
        break;

      case 4:
        // comma
        if (character === 44) {
          // colon
          parsed[++index] = (0,stylis__WEBPACK_IMPORTED_MODULE_3__.peek)() === 58 ? '&\f' : '';
          points[index] = parsed[index].length;
          break;
        }

      // fallthrough

      default:
        parsed[index] += (0,stylis__WEBPACK_IMPORTED_MODULE_4__.from)(character);
    }
  } while (character = (0,stylis__WEBPACK_IMPORTED_MODULE_3__.next)());

  return parsed;
};

var getRules = function getRules(value, points) {
  return (0,stylis__WEBPACK_IMPORTED_MODULE_3__.dealloc)(toRules((0,stylis__WEBPACK_IMPORTED_MODULE_3__.alloc)(value), points));
}; // WeakSet would be more appropriate, but only WeakMap is supported in IE11


var fixedElements = /* #__PURE__ */new WeakMap();
var compat = function compat(element) {
  if (element.type !== 'rule' || !element.parent || // positive .length indicates that this rule contains pseudo
  // negative .length indicates that this rule has been already prefixed
  element.length < 1) {
    return;
  }

  var value = element.value,
      parent = element.parent;
  var isImplicitRule = element.column === parent.column && element.line === parent.line;

  while (parent.type !== 'rule') {
    parent = parent.parent;
    if (!parent) return;
  } // short-circuit for the simplest case


  if (element.props.length === 1 && value.charCodeAt(0) !== 58
  /* colon */
  && !fixedElements.get(parent)) {
    return;
  } // if this is an implicitly inserted rule (the one eagerly inserted at the each new nested level)
  // then the props has already been manipulated beforehand as they that array is shared between it and its "rule parent"


  if (isImplicitRule) {
    return;
  }

  fixedElements.set(element, true);
  var points = [];
  var rules = getRules(value, points);
  var parentRules = parent.props;

  for (var i = 0, k = 0; i < rules.length; i++) {
    for (var j = 0; j < parentRules.length; j++, k++) {
      element.props[k] = points[i] ? rules[i].replace(/&\f/g, parentRules[j]) : parentRules[j] + " " + rules[i];
    }
  }
};
var removeLabel = function removeLabel(element) {
  if (element.type === 'decl') {
    var value = element.value;

    if ( // charcode for l
    value.charCodeAt(0) === 108 && // charcode for b
    value.charCodeAt(2) === 98) {
      // this ignores label
      element["return"] = '';
      element.value = '';
    }
  }
};
var ignoreFlag = 'emotion-disable-server-rendering-unsafe-selector-warning-please-do-not-use-this-the-warning-exists-for-a-reason';

var isIgnoringComment = function isIgnoringComment(element) {
  return !!element && element.type === 'comm' && element.children.indexOf(ignoreFlag) > -1;
};

var createUnsafeSelectorsAlarm = function createUnsafeSelectorsAlarm(cache) {
  return function (element, index, children) {
    if (element.type !== 'rule') return;
    var unsafePseudoClasses = element.value.match(/(:first|:nth|:nth-last)-child/g);

    if (unsafePseudoClasses && cache.compat !== true) {
      var prevElement = index > 0 ? children[index - 1] : null;

      if (prevElement && isIgnoringComment(last(prevElement.children))) {
        return;
      }

      unsafePseudoClasses.forEach(function (unsafePseudoClass) {
        console.error("The pseudo class \"" + unsafePseudoClass + "\" is potentially unsafe when doing server-side rendering. Try changing it to \"" + unsafePseudoClass.split('-child')[0] + "-of-type\".");
      });
    }
  };
};

var isImportRule = function isImportRule(element) {
  return element.type.charCodeAt(1) === 105 && element.type.charCodeAt(0) === 64;
};

var isPrependedWithRegularRules = function isPrependedWithRegularRules(index, children) {
  for (var i = index - 1; i >= 0; i--) {
    if (!isImportRule(children[i])) {
      return true;
    }
  }

  return false;
}; // use this to remove incorrect elements from further processing
// so they don't get handed to the `sheet` (or anything else)
// as that could potentially lead to additional logs which in turn could be overhelming to the user


var nullifyElement = function nullifyElement(element) {
  element.type = '';
  element.value = '';
  element["return"] = '';
  element.children = '';
  element.props = '';
};

var incorrectImportAlarm = function incorrectImportAlarm(element, index, children) {
  if (!isImportRule(element)) {
    return;
  }

  if (element.parent) {
    console.error("`@import` rules can't be nested inside other rules. Please move it to the top level and put it before regular rules. Keep in mind that they can only be used within global styles.");
    nullifyElement(element);
  } else if (isPrependedWithRegularRules(index, children)) {
    console.error("`@import` rules can't be after other rules. Please put your `@import` rules before your other rules.");
    nullifyElement(element);
  }
};

var defaultStylisPlugins = [stylis__WEBPACK_IMPORTED_MODULE_5__.prefixer];

var createCache = function createCache(options) {
  var key = options.key;

  if ( true && !key) {
    throw new Error("You have to configure `key` for your cache. Please make sure it's unique (and not equal to 'css') as it's used for linking styles to your cache.\n" + "If multiple caches share the same key they might \"fight\" for each other's style elements.");
  }

  if ( key === 'css') {
    var ssrStyles = document.querySelectorAll("style[data-emotion]:not([data-s])"); // get SSRed styles out of the way of React's hydration
    // document.head is a safe place to move them to(though note document.head is not necessarily the last place they will be)
    // note this very very intentionally targets all style elements regardless of the key to ensure
    // that creating a cache works inside of render of a React component

    Array.prototype.forEach.call(ssrStyles, function (node) {
      // we want to only move elements which have a space in the data-emotion attribute value
      // because that indicates that it is an Emotion 11 server-side rendered style elements
      // while we will already ignore Emotion 11 client-side inserted styles because of the :not([data-s]) part in the selector
      // Emotion 10 client-side inserted styles did not have data-s (but importantly did not have a space in their data-emotion attributes)
      // so checking for the space ensures that loading Emotion 11 after Emotion 10 has inserted some styles
      // will not result in the Emotion 10 styles being destroyed
      var dataEmotionAttribute = node.getAttribute('data-emotion');

      if (dataEmotionAttribute.indexOf(' ') === -1) {
        return;
      }
      document.head.appendChild(node);
      node.setAttribute('data-s', '');
    });
  }

  var stylisPlugins = options.stylisPlugins || defaultStylisPlugins;

  if (true) {
    // $FlowFixMe
    if (/[^a-z-]/.test(key)) {
      throw new Error("Emotion key must only contain lower case alphabetical characters and - but \"" + key + "\" was passed");
    }
  }

  var inserted = {};
  var container;
  var nodesToHydrate = [];

  {
    container = options.container || document.head;
    Array.prototype.forEach.call( // this means we will ignore elements which don't have a space in them which
    // means that the style elements we're looking at are only Emotion 11 server-rendered style elements
    document.querySelectorAll("style[data-emotion^=\"" + key + " \"]"), function (node) {
      var attrib = node.getAttribute("data-emotion").split(' '); // $FlowFixMe

      for (var i = 1; i < attrib.length; i++) {
        inserted[attrib[i]] = true;
      }

      nodesToHydrate.push(node);
    });
  }

  var _insert;

  var omnipresentPlugins = [compat, removeLabel];

  if (true) {
    omnipresentPlugins.push(createUnsafeSelectorsAlarm({
      get compat() {
        return cache.compat;
      }

    }), incorrectImportAlarm);
  }

  {
    var currentSheet;
    var finalizingPlugins = [stylis__WEBPACK_IMPORTED_MODULE_6__.stringify,  true ? function (element) {
      if (!element.root) {
        if (element["return"]) {
          currentSheet.insert(element["return"]);
        } else if (element.value && element.type !== stylis__WEBPACK_IMPORTED_MODULE_7__.COMMENT) {
          // insert empty rule in non-production environments
          // so @emotion/jest can grab `key` from the (JS)DOM for caches without any rules inserted yet
          currentSheet.insert(element.value + "{}");
        }
      }
    } : 0];
    var serializer = (0,stylis__WEBPACK_IMPORTED_MODULE_5__.middleware)(omnipresentPlugins.concat(stylisPlugins, finalizingPlugins));

    var stylis = function stylis(styles) {
      return (0,stylis__WEBPACK_IMPORTED_MODULE_6__.serialize)((0,stylis__WEBPACK_IMPORTED_MODULE_8__.compile)(styles), serializer);
    };

    _insert = function insert(selector, serialized, sheet, shouldCache) {
      currentSheet = sheet;

      if ( true && serialized.map !== undefined) {
        currentSheet = {
          insert: function insert(rule) {
            sheet.insert(rule + serialized.map);
          }
        };
      }

      stylis(selector ? selector + "{" + serialized.styles + "}" : serialized.styles);

      if (shouldCache) {
        cache.inserted[serialized.name] = true;
      }
    };
  }

  var cache = {
    key: key,
    sheet: new _emotion_sheet__WEBPACK_IMPORTED_MODULE_0__.StyleSheet({
      key: key,
      container: container,
      nonce: options.nonce,
      speedy: options.speedy,
      prepend: options.prepend,
      insertionPoint: options.insertionPoint
    }),
    nonce: options.nonce,
    inserted: inserted,
    registered: {},
    insert: _insert
  };
  cache.sheet.hydrate(nodesToHydrate);
  return cache;
};

/* harmony default export */ __webpack_exports__["default"] = (createCache);


/***/ }),

/***/ "./node_modules/@emotion/hash/dist/hash.browser.esm.js":
/*!*************************************************************!*\
  !*** ./node_modules/@emotion/hash/dist/hash.browser.esm.js ***!
  \*************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* eslint-disable */
// Inspired by https://github.com/garycourt/murmurhash-js
// Ported from https://github.com/aappleby/smhasher/blob/61a0530f28277f2e850bfc39600ce61d02b518de/src/MurmurHash2.cpp#L37-L86
function murmur2(str) {
  // 'm' and 'r' are mixing constants generated offline.
  // They're not really 'magic', they just happen to work well.
  // const m = 0x5bd1e995;
  // const r = 24;
  // Initialize the hash
  var h = 0; // Mix 4 bytes at a time into the hash

  var k,
      i = 0,
      len = str.length;

  for (; len >= 4; ++i, len -= 4) {
    k = str.charCodeAt(i) & 0xff | (str.charCodeAt(++i) & 0xff) << 8 | (str.charCodeAt(++i) & 0xff) << 16 | (str.charCodeAt(++i) & 0xff) << 24;
    k =
    /* Math.imul(k, m): */
    (k & 0xffff) * 0x5bd1e995 + ((k >>> 16) * 0xe995 << 16);
    k ^=
    /* k >>> r: */
    k >>> 24;
    h =
    /* Math.imul(k, m): */
    (k & 0xffff) * 0x5bd1e995 + ((k >>> 16) * 0xe995 << 16) ^
    /* Math.imul(h, m): */
    (h & 0xffff) * 0x5bd1e995 + ((h >>> 16) * 0xe995 << 16);
  } // Handle the last few bytes of the input array


  switch (len) {
    case 3:
      h ^= (str.charCodeAt(i + 2) & 0xff) << 16;

    case 2:
      h ^= (str.charCodeAt(i + 1) & 0xff) << 8;

    case 1:
      h ^= str.charCodeAt(i) & 0xff;
      h =
      /* Math.imul(h, m): */
      (h & 0xffff) * 0x5bd1e995 + ((h >>> 16) * 0xe995 << 16);
  } // Do a few final mixes of the hash to ensure the last few
  // bytes are well-incorporated.


  h ^= h >>> 13;
  h =
  /* Math.imul(h, m): */
  (h & 0xffff) * 0x5bd1e995 + ((h >>> 16) * 0xe995 << 16);
  return ((h ^ h >>> 15) >>> 0).toString(36);
}

/* harmony default export */ __webpack_exports__["default"] = (murmur2);


/***/ }),

/***/ "./node_modules/@emotion/memoize/dist/emotion-memoize.browser.esm.js":
/*!***************************************************************************!*\
  !*** ./node_modules/@emotion/memoize/dist/emotion-memoize.browser.esm.js ***!
  \***************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
function memoize(fn) {
  var cache = Object.create(null);
  return function (arg) {
    if (cache[arg] === undefined) cache[arg] = fn(arg);
    return cache[arg];
  };
}

/* harmony default export */ __webpack_exports__["default"] = (memoize);


/***/ }),

/***/ "./node_modules/@emotion/react/_isolated-hnrs/dist/emotion-react-_isolated-hnrs.browser.esm.js":
/*!*****************************************************************************************************!*\
  !*** ./node_modules/@emotion/react/_isolated-hnrs/dist/emotion-react-_isolated-hnrs.browser.esm.js ***!
  \*****************************************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var hoist_non_react_statics__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! hoist-non-react-statics */ "./node_modules/hoist-non-react-statics/dist/hoist-non-react-statics.cjs.js");
/* harmony import */ var hoist_non_react_statics__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(hoist_non_react_statics__WEBPACK_IMPORTED_MODULE_0__);


// this file isolates this package that is not tree-shakeable
// and if this module doesn't actually contain any logic of its own
// then Rollup just use 'hoist-non-react-statics' directly in other chunks

var hoistNonReactStatics = (function (targetComponent, sourceComponent) {
  return hoist_non_react_statics__WEBPACK_IMPORTED_MODULE_0___default()(targetComponent, sourceComponent);
});

/* harmony default export */ __webpack_exports__["default"] = (hoistNonReactStatics);


/***/ }),

/***/ "./node_modules/@emotion/react/dist/emotion-element-cbed451f.browser.esm.js":
/*!**********************************************************************************!*\
  !*** ./node_modules/@emotion/react/dist/emotion-element-cbed451f.browser.esm.js ***!
  \**********************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "C": function() { return /* binding */ CacheProvider; },
/* harmony export */   "E": function() { return /* binding */ Emotion; },
/* harmony export */   "T": function() { return /* binding */ ThemeContext; },
/* harmony export */   "_": function() { return /* binding */ __unsafe_useEmotionCache; },
/* harmony export */   "a": function() { return /* binding */ useTheme; },
/* harmony export */   "b": function() { return /* binding */ ThemeProvider; },
/* harmony export */   "c": function() { return /* binding */ createEmotionProps; },
/* harmony export */   "d": function() { return /* binding */ withTheme; },
/* harmony export */   "h": function() { return /* binding */ hasOwnProperty; },
/* harmony export */   "u": function() { return /* binding */ useInsertionEffectMaybe; },
/* harmony export */   "w": function() { return /* binding */ withEmotionCache; }
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _emotion_cache__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @emotion/cache */ "./node_modules/@emotion/cache/dist/emotion-cache.browser.esm.js");
/* harmony import */ var _babel_runtime_helpers_esm_extends__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @babel/runtime/helpers/esm/extends */ "./node_modules/@babel/runtime/helpers/esm/extends.js");
/* harmony import */ var _emotion_weak_memoize__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @emotion/weak-memoize */ "./node_modules/@emotion/weak-memoize/dist/weak-memoize.browser.esm.js");
/* harmony import */ var _isolated_hnrs_dist_emotion_react_isolated_hnrs_browser_esm_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../_isolated-hnrs/dist/emotion-react-_isolated-hnrs.browser.esm.js */ "./node_modules/@emotion/react/_isolated-hnrs/dist/emotion-react-_isolated-hnrs.browser.esm.js");
/* harmony import */ var _emotion_utils__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @emotion/utils */ "./node_modules/@emotion/react/node_modules/@emotion/utils/dist/emotion-utils.browser.esm.js");
/* harmony import */ var _emotion_serialize__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @emotion/serialize */ "./node_modules/@emotion/serialize/dist/emotion-serialize.browser.esm.js");









var hasOwnProperty = {}.hasOwnProperty;

var EmotionCacheContext = /* #__PURE__ */(0,react__WEBPACK_IMPORTED_MODULE_0__.createContext)( // we're doing this to avoid preconstruct's dead code elimination in this one case
// because this module is primarily intended for the browser and node
// but it's also required in react native and similar environments sometimes
// and we could have a special build just for that
// but this is much easier and the native packages
// might use a different theme context in the future anyway
typeof HTMLElement !== 'undefined' ? /* #__PURE__ */(0,_emotion_cache__WEBPACK_IMPORTED_MODULE_1__["default"])({
  key: 'css'
}) : null);

if (true) {
  EmotionCacheContext.displayName = 'EmotionCacheContext';
}

var CacheProvider = EmotionCacheContext.Provider;
var __unsafe_useEmotionCache = function useEmotionCache() {
  return (0,react__WEBPACK_IMPORTED_MODULE_0__.useContext)(EmotionCacheContext);
};

var withEmotionCache = function withEmotionCache(func) {
  // $FlowFixMe
  return /*#__PURE__*/(0,react__WEBPACK_IMPORTED_MODULE_0__.forwardRef)(function (props, ref) {
    // the cache will never be null in the browser
    var cache = (0,react__WEBPACK_IMPORTED_MODULE_0__.useContext)(EmotionCacheContext);
    return func(props, cache, ref);
  });
};

var ThemeContext = /* #__PURE__ */(0,react__WEBPACK_IMPORTED_MODULE_0__.createContext)({});

if (true) {
  ThemeContext.displayName = 'EmotionThemeContext';
}

var useTheme = function useTheme() {
  return (0,react__WEBPACK_IMPORTED_MODULE_0__.useContext)(ThemeContext);
};

var getTheme = function getTheme(outerTheme, theme) {
  if (typeof theme === 'function') {
    var mergedTheme = theme(outerTheme);

    if ( true && (mergedTheme == null || typeof mergedTheme !== 'object' || Array.isArray(mergedTheme))) {
      throw new Error('[ThemeProvider] Please return an object from your theme function, i.e. theme={() => ({})}!');
    }

    return mergedTheme;
  }

  if ( true && (theme == null || typeof theme !== 'object' || Array.isArray(theme))) {
    throw new Error('[ThemeProvider] Please make your theme prop a plain object');
  }

  return (0,_babel_runtime_helpers_esm_extends__WEBPACK_IMPORTED_MODULE_2__["default"])({}, outerTheme, theme);
};

var createCacheWithTheme = /* #__PURE__ */(0,_emotion_weak_memoize__WEBPACK_IMPORTED_MODULE_3__["default"])(function (outerTheme) {
  return (0,_emotion_weak_memoize__WEBPACK_IMPORTED_MODULE_3__["default"])(function (theme) {
    return getTheme(outerTheme, theme);
  });
});
var ThemeProvider = function ThemeProvider(props) {
  var theme = (0,react__WEBPACK_IMPORTED_MODULE_0__.useContext)(ThemeContext);

  if (props.theme !== theme) {
    theme = createCacheWithTheme(theme)(props.theme);
  }

  return /*#__PURE__*/(0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(ThemeContext.Provider, {
    value: theme
  }, props.children);
};
function withTheme(Component) {
  var componentName = Component.displayName || Component.name || 'Component';

  var render = function render(props, ref) {
    var theme = (0,react__WEBPACK_IMPORTED_MODULE_0__.useContext)(ThemeContext);
    return /*#__PURE__*/(0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(Component, (0,_babel_runtime_helpers_esm_extends__WEBPACK_IMPORTED_MODULE_2__["default"])({
      theme: theme,
      ref: ref
    }, props));
  }; // $FlowFixMe


  var WithTheme = /*#__PURE__*/(0,react__WEBPACK_IMPORTED_MODULE_0__.forwardRef)(render);
  WithTheme.displayName = "WithTheme(" + componentName + ")";
  return (0,_isolated_hnrs_dist_emotion_react_isolated_hnrs_browser_esm_js__WEBPACK_IMPORTED_MODULE_6__["default"])(WithTheme, Component);
}

var getLastPart = function getLastPart(functionName) {
  // The match may be something like 'Object.createEmotionProps' or
  // 'Loader.prototype.render'
  var parts = functionName.split('.');
  return parts[parts.length - 1];
};

var getFunctionNameFromStackTraceLine = function getFunctionNameFromStackTraceLine(line) {
  // V8
  var match = /^\s+at\s+([A-Za-z0-9$.]+)\s/.exec(line);
  if (match) return getLastPart(match[1]); // Safari / Firefox

  match = /^([A-Za-z0-9$.]+)@/.exec(line);
  if (match) return getLastPart(match[1]);
  return undefined;
};

var internalReactFunctionNames = /* #__PURE__ */new Set(['renderWithHooks', 'processChild', 'finishClassComponent', 'renderToString']); // These identifiers come from error stacks, so they have to be valid JS
// identifiers, thus we only need to replace what is a valid character for JS,
// but not for CSS.

var sanitizeIdentifier = function sanitizeIdentifier(identifier) {
  return identifier.replace(/\$/g, '-');
};

var getLabelFromStackTrace = function getLabelFromStackTrace(stackTrace) {
  if (!stackTrace) return undefined;
  var lines = stackTrace.split('\n');

  for (var i = 0; i < lines.length; i++) {
    var functionName = getFunctionNameFromStackTraceLine(lines[i]); // The first line of V8 stack traces is just "Error"

    if (!functionName) continue; // If we reach one of these, we have gone too far and should quit

    if (internalReactFunctionNames.has(functionName)) break; // The component name is the first function in the stack that starts with an
    // uppercase letter

    if (/^[A-Z]/.test(functionName)) return sanitizeIdentifier(functionName);
  }

  return undefined;
};

var useInsertionEffect = react__WEBPACK_IMPORTED_MODULE_0__['useInsertion' + 'Effect'] ? react__WEBPACK_IMPORTED_MODULE_0__['useInsertion' + 'Effect'] : function useInsertionEffect(create) {
  create();
};
function useInsertionEffectMaybe(create) {

  useInsertionEffect(create);
}

var typePropName = '__EMOTION_TYPE_PLEASE_DO_NOT_USE__';
var labelPropName = '__EMOTION_LABEL_PLEASE_DO_NOT_USE__';
var createEmotionProps = function createEmotionProps(type, props) {
  if ( true && typeof props.css === 'string' && // check if there is a css declaration
  props.css.indexOf(':') !== -1) {
    throw new Error("Strings are not allowed as css prop values, please wrap it in a css template literal from '@emotion/react' like this: css`" + props.css + "`");
  }

  var newProps = {};

  for (var key in props) {
    if (hasOwnProperty.call(props, key)) {
      newProps[key] = props[key];
    }
  }

  newProps[typePropName] = type; // For performance, only call getLabelFromStackTrace in development and when
  // the label hasn't already been computed

  if ( true && !!props.css && (typeof props.css !== 'object' || typeof props.css.name !== 'string' || props.css.name.indexOf('-') === -1)) {
    var label = getLabelFromStackTrace(new Error().stack);
    if (label) newProps[labelPropName] = label;
  }

  return newProps;
};

var Insertion = function Insertion(_ref) {
  var cache = _ref.cache,
      serialized = _ref.serialized,
      isStringTag = _ref.isStringTag;
  (0,_emotion_utils__WEBPACK_IMPORTED_MODULE_4__.registerStyles)(cache, serialized, isStringTag);
  var rules = useInsertionEffectMaybe(function () {
    return (0,_emotion_utils__WEBPACK_IMPORTED_MODULE_4__.insertStyles)(cache, serialized, isStringTag);
  });

  return null;
};

var Emotion = /* #__PURE__ */withEmotionCache(function (props, cache, ref) {
  var cssProp = props.css; // so that using `css` from `emotion` and passing the result to the css prop works
  // not passing the registered cache to serializeStyles because it would
  // make certain babel optimisations not possible

  if (typeof cssProp === 'string' && cache.registered[cssProp] !== undefined) {
    cssProp = cache.registered[cssProp];
  }

  var WrappedComponent = props[typePropName];
  var registeredStyles = [cssProp];
  var className = '';

  if (typeof props.className === 'string') {
    className = (0,_emotion_utils__WEBPACK_IMPORTED_MODULE_4__.getRegisteredStyles)(cache.registered, registeredStyles, props.className);
  } else if (props.className != null) {
    className = props.className + " ";
  }

  var serialized = (0,_emotion_serialize__WEBPACK_IMPORTED_MODULE_5__.serializeStyles)(registeredStyles, undefined, (0,react__WEBPACK_IMPORTED_MODULE_0__.useContext)(ThemeContext));

  if ( true && serialized.name.indexOf('-') === -1) {
    var labelFromStack = props[labelPropName];

    if (labelFromStack) {
      serialized = (0,_emotion_serialize__WEBPACK_IMPORTED_MODULE_5__.serializeStyles)([serialized, 'label:' + labelFromStack + ';']);
    }
  }

  className += cache.key + "-" + serialized.name;
  var newProps = {};

  for (var key in props) {
    if (hasOwnProperty.call(props, key) && key !== 'css' && key !== typePropName && ( false || key !== labelPropName)) {
      newProps[key] = props[key];
    }
  }

  newProps.ref = ref;
  newProps.className = className;
  return /*#__PURE__*/(0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(react__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, /*#__PURE__*/(0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(Insertion, {
    cache: cache,
    serialized: serialized,
    isStringTag: typeof WrappedComponent === 'string'
  }), /*#__PURE__*/(0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(WrappedComponent, newProps));
});

if (true) {
  Emotion.displayName = 'EmotionCssPropInternal';
}




/***/ }),

/***/ "./node_modules/@emotion/react/dist/emotion-react.browser.esm.js":
/*!***********************************************************************!*\
  !*** ./node_modules/@emotion/react/dist/emotion-react.browser.esm.js ***!
  \***********************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "CacheProvider": function() { return /* reexport safe */ _emotion_element_cbed451f_browser_esm_js__WEBPACK_IMPORTED_MODULE_2__.C; },
/* harmony export */   "ClassNames": function() { return /* binding */ ClassNames; },
/* harmony export */   "Global": function() { return /* binding */ Global; },
/* harmony export */   "ThemeContext": function() { return /* reexport safe */ _emotion_element_cbed451f_browser_esm_js__WEBPACK_IMPORTED_MODULE_2__.T; },
/* harmony export */   "ThemeProvider": function() { return /* reexport safe */ _emotion_element_cbed451f_browser_esm_js__WEBPACK_IMPORTED_MODULE_2__.b; },
/* harmony export */   "__unsafe_useEmotionCache": function() { return /* reexport safe */ _emotion_element_cbed451f_browser_esm_js__WEBPACK_IMPORTED_MODULE_2__._; },
/* harmony export */   "createElement": function() { return /* binding */ jsx; },
/* harmony export */   "css": function() { return /* binding */ css; },
/* harmony export */   "jsx": function() { return /* binding */ jsx; },
/* harmony export */   "keyframes": function() { return /* binding */ keyframes; },
/* harmony export */   "useTheme": function() { return /* reexport safe */ _emotion_element_cbed451f_browser_esm_js__WEBPACK_IMPORTED_MODULE_2__.a; },
/* harmony export */   "withEmotionCache": function() { return /* reexport safe */ _emotion_element_cbed451f_browser_esm_js__WEBPACK_IMPORTED_MODULE_2__.w; },
/* harmony export */   "withTheme": function() { return /* reexport safe */ _emotion_element_cbed451f_browser_esm_js__WEBPACK_IMPORTED_MODULE_2__.d; }
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _emotion_cache__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @emotion/cache */ "./node_modules/@emotion/cache/dist/emotion-cache.browser.esm.js");
/* harmony import */ var _emotion_element_cbed451f_browser_esm_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./emotion-element-cbed451f.browser.esm.js */ "./node_modules/@emotion/react/dist/emotion-element-cbed451f.browser.esm.js");
/* harmony import */ var _babel_runtime_helpers_extends__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @babel/runtime/helpers/extends */ "./node_modules/@babel/runtime/helpers/esm/extends.js");
/* harmony import */ var _emotion_weak_memoize__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @emotion/weak-memoize */ "./node_modules/@emotion/weak-memoize/dist/weak-memoize.browser.esm.js");
/* harmony import */ var hoist_non_react_statics__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! hoist-non-react-statics */ "./node_modules/hoist-non-react-statics/dist/hoist-non-react-statics.cjs.js");
/* harmony import */ var hoist_non_react_statics__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(hoist_non_react_statics__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _emotion_utils__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @emotion/utils */ "./node_modules/@emotion/react/node_modules/@emotion/utils/dist/emotion-utils.browser.esm.js");
/* harmony import */ var _emotion_serialize__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @emotion/serialize */ "./node_modules/@emotion/serialize/dist/emotion-serialize.browser.esm.js");












var pkg = {
	name: "@emotion/react",
	version: "11.9.3",
	main: "dist/emotion-react.cjs.js",
	module: "dist/emotion-react.esm.js",
	browser: {
		"./dist/emotion-react.cjs.js": "./dist/emotion-react.browser.cjs.js",
		"./dist/emotion-react.esm.js": "./dist/emotion-react.browser.esm.js"
	},
	types: "types/index.d.ts",
	files: [
		"src",
		"dist",
		"jsx-runtime",
		"jsx-dev-runtime",
		"_isolated-hnrs",
		"types/*.d.ts",
		"macro.js",
		"macro.d.ts",
		"macro.js.flow"
	],
	sideEffects: false,
	author: "Emotion Contributors",
	license: "MIT",
	scripts: {
		"test:typescript": "dtslint types"
	},
	dependencies: {
		"@babel/runtime": "^7.13.10",
		"@emotion/babel-plugin": "^11.7.1",
		"@emotion/cache": "^11.9.3",
		"@emotion/serialize": "^1.0.4",
		"@emotion/utils": "^1.1.0",
		"@emotion/weak-memoize": "^0.2.5",
		"hoist-non-react-statics": "^3.3.1"
	},
	peerDependencies: {
		"@babel/core": "^7.0.0",
		react: ">=16.8.0"
	},
	peerDependenciesMeta: {
		"@babel/core": {
			optional: true
		},
		"@types/react": {
			optional: true
		}
	},
	devDependencies: {
		"@babel/core": "^7.13.10",
		"@definitelytyped/dtslint": "0.0.112",
		"@emotion/css": "11.9.0",
		"@emotion/css-prettifier": "1.0.1",
		"@emotion/server": "11.4.0",
		"@emotion/styled": "11.9.3",
		"html-tag-names": "^1.1.2",
		react: "16.14.0",
		"svg-tag-names": "^1.1.1",
		typescript: "^4.5.5"
	},
	repository: "https://github.com/emotion-js/emotion/tree/main/packages/react",
	publishConfig: {
		access: "public"
	},
	"umd:main": "dist/emotion-react.umd.min.js",
	preconstruct: {
		entrypoints: [
			"./index.js",
			"./jsx-runtime.js",
			"./jsx-dev-runtime.js",
			"./_isolated-hnrs.js"
		],
		umdName: "emotionReact"
	}
};

var jsx = function jsx(type, props) {
  var args = arguments;

  if (props == null || !_emotion_element_cbed451f_browser_esm_js__WEBPACK_IMPORTED_MODULE_2__.h.call(props, 'css')) {
    // $FlowFixMe
    return react__WEBPACK_IMPORTED_MODULE_0__.createElement.apply(undefined, args);
  }

  var argsLength = args.length;
  var createElementArgArray = new Array(argsLength);
  createElementArgArray[0] = _emotion_element_cbed451f_browser_esm_js__WEBPACK_IMPORTED_MODULE_2__.E;
  createElementArgArray[1] = (0,_emotion_element_cbed451f_browser_esm_js__WEBPACK_IMPORTED_MODULE_2__.c)(type, props);

  for (var i = 2; i < argsLength; i++) {
    createElementArgArray[i] = args[i];
  } // $FlowFixMe


  return react__WEBPACK_IMPORTED_MODULE_0__.createElement.apply(null, createElementArgArray);
};

var useInsertionEffect = react__WEBPACK_IMPORTED_MODULE_0__['useInsertion' + 'Effect'] ? react__WEBPACK_IMPORTED_MODULE_0__['useInsertion' + 'Effect'] : react__WEBPACK_IMPORTED_MODULE_0__.useLayoutEffect;
var warnedAboutCssPropForGlobal = false; // maintain place over rerenders.
// initial render from browser, insertBefore context.sheet.tags[0] or if a style hasn't been inserted there yet, appendChild
// initial client-side render from SSR, use place of hydrating tag

var Global = /* #__PURE__ */(0,_emotion_element_cbed451f_browser_esm_js__WEBPACK_IMPORTED_MODULE_2__.w)(function (props, cache) {
  if ( true && !warnedAboutCssPropForGlobal && ( // check for className as well since the user is
  // probably using the custom createElement which
  // means it will be turned into a className prop
  // $FlowFixMe I don't really want to add it to the type since it shouldn't be used
  props.className || props.css)) {
    console.error("It looks like you're using the css prop on Global, did you mean to use the styles prop instead?");
    warnedAboutCssPropForGlobal = true;
  }

  var styles = props.styles;
  var serialized = (0,_emotion_serialize__WEBPACK_IMPORTED_MODULE_7__.serializeStyles)([styles], undefined, (0,react__WEBPACK_IMPORTED_MODULE_0__.useContext)(_emotion_element_cbed451f_browser_esm_js__WEBPACK_IMPORTED_MODULE_2__.T));
  // but it is based on a constant that will never change at runtime
  // it's effectively like having two implementations and switching them out
  // so it's not actually breaking anything


  var sheetRef = (0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)();
  useInsertionEffect(function () {
    var key = cache.key + "-global"; // use case of https://github.com/emotion-js/emotion/issues/2675

    var sheet = new cache.sheet.constructor({
      key: key,
      nonce: cache.sheet.nonce,
      container: cache.sheet.container,
      speedy: cache.sheet.isSpeedy
    });
    var rehydrating = false; // $FlowFixMe

    var node = document.querySelector("style[data-emotion=\"" + key + " " + serialized.name + "\"]");

    if (cache.sheet.tags.length) {
      sheet.before = cache.sheet.tags[0];
    }

    if (node !== null) {
      rehydrating = true; // clear the hash so this node won't be recognizable as rehydratable by other <Global/>s

      node.setAttribute('data-emotion', key);
      sheet.hydrate([node]);
    }

    sheetRef.current = [sheet, rehydrating];
    return function () {
      sheet.flush();
    };
  }, [cache]);
  useInsertionEffect(function () {
    var sheetRefCurrent = sheetRef.current;
    var sheet = sheetRefCurrent[0],
        rehydrating = sheetRefCurrent[1];

    if (rehydrating) {
      sheetRefCurrent[1] = false;
      return;
    }

    if (serialized.next !== undefined) {
      // insert keyframes
      (0,_emotion_utils__WEBPACK_IMPORTED_MODULE_6__.insertStyles)(cache, serialized.next, true);
    }

    if (sheet.tags.length) {
      // if this doesn't exist then it will be null so the style element will be appended
      var element = sheet.tags[sheet.tags.length - 1].nextElementSibling;
      sheet.before = element;
      sheet.flush();
    }

    cache.insert("", serialized, sheet, false);
  }, [cache, serialized.name]);
  return null;
});

if (true) {
  Global.displayName = 'EmotionGlobal';
}

function css() {
  for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  return (0,_emotion_serialize__WEBPACK_IMPORTED_MODULE_7__.serializeStyles)(args);
}

var keyframes = function keyframes() {
  var insertable = css.apply(void 0, arguments);
  var name = "animation-" + insertable.name; // $FlowFixMe

  return {
    name: name,
    styles: "@keyframes " + name + "{" + insertable.styles + "}",
    anim: 1,
    toString: function toString() {
      return "_EMO_" + this.name + "_" + this.styles + "_EMO_";
    }
  };
};

var classnames = function classnames(args) {
  var len = args.length;
  var i = 0;
  var cls = '';

  for (; i < len; i++) {
    var arg = args[i];
    if (arg == null) continue;
    var toAdd = void 0;

    switch (typeof arg) {
      case 'boolean':
        break;

      case 'object':
        {
          if (Array.isArray(arg)) {
            toAdd = classnames(arg);
          } else {
            if ( true && arg.styles !== undefined && arg.name !== undefined) {
              console.error('You have passed styles created with `css` from `@emotion/react` package to the `cx`.\n' + '`cx` is meant to compose class names (strings) so you should convert those styles to a class name by passing them to the `css` received from <ClassNames/> component.');
            }

            toAdd = '';

            for (var k in arg) {
              if (arg[k] && k) {
                toAdd && (toAdd += ' ');
                toAdd += k;
              }
            }
          }

          break;
        }

      default:
        {
          toAdd = arg;
        }
    }

    if (toAdd) {
      cls && (cls += ' ');
      cls += toAdd;
    }
  }

  return cls;
};

function merge(registered, css, className) {
  var registeredStyles = [];
  var rawClassName = (0,_emotion_utils__WEBPACK_IMPORTED_MODULE_6__.getRegisteredStyles)(registered, registeredStyles, className);

  if (registeredStyles.length < 2) {
    return className;
  }

  return rawClassName + css(registeredStyles);
}

var Insertion = function Insertion(_ref) {
  var cache = _ref.cache,
      serializedArr = _ref.serializedArr;
  var rules = (0,_emotion_element_cbed451f_browser_esm_js__WEBPACK_IMPORTED_MODULE_2__.u)(function () {

    for (var i = 0; i < serializedArr.length; i++) {
      var res = (0,_emotion_utils__WEBPACK_IMPORTED_MODULE_6__.insertStyles)(cache, serializedArr[i], false);
    }
  });

  return null;
};

var ClassNames = /* #__PURE__ */(0,_emotion_element_cbed451f_browser_esm_js__WEBPACK_IMPORTED_MODULE_2__.w)(function (props, cache) {
  var hasRendered = false;
  var serializedArr = [];

  var css = function css() {
    if (hasRendered && "development" !== 'production') {
      throw new Error('css can only be used during render');
    }

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    var serialized = (0,_emotion_serialize__WEBPACK_IMPORTED_MODULE_7__.serializeStyles)(args, cache.registered);
    serializedArr.push(serialized); // registration has to happen here as the result of this might get consumed by `cx`

    (0,_emotion_utils__WEBPACK_IMPORTED_MODULE_6__.registerStyles)(cache, serialized, false);
    return cache.key + "-" + serialized.name;
  };

  var cx = function cx() {
    if (hasRendered && "development" !== 'production') {
      throw new Error('cx can only be used during render');
    }

    for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }

    return merge(cache.registered, css, classnames(args));
  };

  var content = {
    css: css,
    cx: cx,
    theme: (0,react__WEBPACK_IMPORTED_MODULE_0__.useContext)(_emotion_element_cbed451f_browser_esm_js__WEBPACK_IMPORTED_MODULE_2__.T)
  };
  var ele = props.children(content);
  hasRendered = true;
  return /*#__PURE__*/(0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(react__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, /*#__PURE__*/(0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(Insertion, {
    cache: cache,
    serializedArr: serializedArr
  }), ele);
});

if (true) {
  ClassNames.displayName = 'EmotionClassNames';
}

if (true) {
  var isBrowser = "object" !== 'undefined'; // #1727 for some reason Jest evaluates modules twice if some consuming module gets mocked with jest.mock

  var isJest = typeof jest !== 'undefined';

  if (isBrowser && !isJest) {
    // globalThis has wide browser support - https://caniuse.com/?search=globalThis, Node.js 12 and later
    var globalContext = // $FlowIgnore
    typeof globalThis !== 'undefined' ? globalThis // eslint-disable-line no-undef
    : isBrowser ? window : __webpack_require__.g;
    var globalKey = "__EMOTION_REACT_" + pkg.version.split('.')[0] + "__";

    if (globalContext[globalKey]) {
      console.warn('You are loading @emotion/react when it is already loaded. Running ' + 'multiple instances may cause problems. This can happen if multiple ' + 'versions are used, or if multiple builds of the same version are ' + 'used.');
    }

    globalContext[globalKey] = true;
  }
}




/***/ }),

/***/ "./node_modules/@emotion/react/node_modules/@emotion/utils/dist/emotion-utils.browser.esm.js":
/*!***************************************************************************************************!*\
  !*** ./node_modules/@emotion/react/node_modules/@emotion/utils/dist/emotion-utils.browser.esm.js ***!
  \***************************************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "getRegisteredStyles": function() { return /* binding */ getRegisteredStyles; },
/* harmony export */   "insertStyles": function() { return /* binding */ insertStyles; },
/* harmony export */   "registerStyles": function() { return /* binding */ registerStyles; }
/* harmony export */ });
var isBrowser = "object" !== 'undefined';
function getRegisteredStyles(registered, registeredStyles, classNames) {
  var rawClassName = '';
  classNames.split(' ').forEach(function (className) {
    if (registered[className] !== undefined) {
      registeredStyles.push(registered[className] + ";");
    } else {
      rawClassName += className + " ";
    }
  });
  return rawClassName;
}
var registerStyles = function registerStyles(cache, serialized, isStringTag) {
  var className = cache.key + "-" + serialized.name;

  if ( // we only need to add the styles to the registered cache if the
  // class name could be used further down
  // the tree but if it's a string tag, we know it won't
  // so we don't have to add it to registered cache.
  // this improves memory usage since we can avoid storing the whole style string
  (isStringTag === false || // we need to always store it if we're in compat mode and
  // in node since emotion-server relies on whether a style is in
  // the registered cache to know whether a style is global or not
  // also, note that this check will be dead code eliminated in the browser
  isBrowser === false ) && cache.registered[className] === undefined) {
    cache.registered[className] = serialized.styles;
  }
};
var insertStyles = function insertStyles(cache, serialized, isStringTag) {
  registerStyles(cache, serialized, isStringTag);
  var className = cache.key + "-" + serialized.name;

  if (cache.inserted[serialized.name] === undefined) {
    var current = serialized;

    do {
      var maybeStyles = cache.insert(serialized === current ? "." + className : '', current, cache.sheet, true);

      current = current.next;
    } while (current !== undefined);
  }
};




/***/ }),

/***/ "./node_modules/@emotion/serialize/dist/emotion-serialize.browser.esm.js":
/*!*******************************************************************************!*\
  !*** ./node_modules/@emotion/serialize/dist/emotion-serialize.browser.esm.js ***!
  \*******************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "serializeStyles": function() { return /* binding */ serializeStyles; }
/* harmony export */ });
/* harmony import */ var _emotion_hash__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @emotion/hash */ "./node_modules/@emotion/hash/dist/hash.browser.esm.js");
/* harmony import */ var _emotion_unitless__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @emotion/unitless */ "./node_modules/@emotion/unitless/dist/unitless.browser.esm.js");
/* harmony import */ var _emotion_memoize__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @emotion/memoize */ "./node_modules/@emotion/memoize/dist/emotion-memoize.browser.esm.js");




var ILLEGAL_ESCAPE_SEQUENCE_ERROR = "You have illegal escape sequence in your template literal, most likely inside content's property value.\nBecause you write your CSS inside a JavaScript string you actually have to do double escaping, so for example \"content: '\\00d7';\" should become \"content: '\\\\00d7';\".\nYou can read more about this here:\nhttps://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals#ES2018_revision_of_illegal_escape_sequences";
var UNDEFINED_AS_OBJECT_KEY_ERROR = "You have passed in falsy value as style object's key (can happen when in example you pass unexported component as computed key).";
var hyphenateRegex = /[A-Z]|^ms/g;
var animationRegex = /_EMO_([^_]+?)_([^]*?)_EMO_/g;

var isCustomProperty = function isCustomProperty(property) {
  return property.charCodeAt(1) === 45;
};

var isProcessableValue = function isProcessableValue(value) {
  return value != null && typeof value !== 'boolean';
};

var processStyleName = /* #__PURE__ */(0,_emotion_memoize__WEBPACK_IMPORTED_MODULE_2__["default"])(function (styleName) {
  return isCustomProperty(styleName) ? styleName : styleName.replace(hyphenateRegex, '-$&').toLowerCase();
});

var processStyleValue = function processStyleValue(key, value) {
  switch (key) {
    case 'animation':
    case 'animationName':
      {
        if (typeof value === 'string') {
          return value.replace(animationRegex, function (match, p1, p2) {
            cursor = {
              name: p1,
              styles: p2,
              next: cursor
            };
            return p1;
          });
        }
      }
  }

  if (_emotion_unitless__WEBPACK_IMPORTED_MODULE_1__["default"][key] !== 1 && !isCustomProperty(key) && typeof value === 'number' && value !== 0) {
    return value + 'px';
  }

  return value;
};

if (true) {
  var contentValuePattern = /(var|attr|counters?|url|(((repeating-)?(linear|radial))|conic)-gradient)\(|(no-)?(open|close)-quote/;
  var contentValues = ['normal', 'none', 'initial', 'inherit', 'unset'];
  var oldProcessStyleValue = processStyleValue;
  var msPattern = /^-ms-/;
  var hyphenPattern = /-(.)/g;
  var hyphenatedCache = {};

  processStyleValue = function processStyleValue(key, value) {
    if (key === 'content') {
      if (typeof value !== 'string' || contentValues.indexOf(value) === -1 && !contentValuePattern.test(value) && (value.charAt(0) !== value.charAt(value.length - 1) || value.charAt(0) !== '"' && value.charAt(0) !== "'")) {
        throw new Error("You seem to be using a value for 'content' without quotes, try replacing it with `content: '\"" + value + "\"'`");
      }
    }

    var processed = oldProcessStyleValue(key, value);

    if (processed !== '' && !isCustomProperty(key) && key.indexOf('-') !== -1 && hyphenatedCache[key] === undefined) {
      hyphenatedCache[key] = true;
      console.error("Using kebab-case for css properties in objects is not supported. Did you mean " + key.replace(msPattern, 'ms-').replace(hyphenPattern, function (str, _char) {
        return _char.toUpperCase();
      }) + "?");
    }

    return processed;
  };
}

var noComponentSelectorMessage = 'Component selectors can only be used in conjunction with ' + '@emotion/babel-plugin, the swc Emotion plugin, or another Emotion-aware ' + 'compiler transform.';

function handleInterpolation(mergedProps, registered, interpolation) {
  if (interpolation == null) {
    return '';
  }

  if (interpolation.__emotion_styles !== undefined) {
    if ( true && interpolation.toString() === 'NO_COMPONENT_SELECTOR') {
      throw new Error(noComponentSelectorMessage);
    }

    return interpolation;
  }

  switch (typeof interpolation) {
    case 'boolean':
      {
        return '';
      }

    case 'object':
      {
        if (interpolation.anim === 1) {
          cursor = {
            name: interpolation.name,
            styles: interpolation.styles,
            next: cursor
          };
          return interpolation.name;
        }

        if (interpolation.styles !== undefined) {
          var next = interpolation.next;

          if (next !== undefined) {
            // not the most efficient thing ever but this is a pretty rare case
            // and there will be very few iterations of this generally
            while (next !== undefined) {
              cursor = {
                name: next.name,
                styles: next.styles,
                next: cursor
              };
              next = next.next;
            }
          }

          var styles = interpolation.styles + ";";

          if ( true && interpolation.map !== undefined) {
            styles += interpolation.map;
          }

          return styles;
        }

        return createStringFromObject(mergedProps, registered, interpolation);
      }

    case 'function':
      {
        if (mergedProps !== undefined) {
          var previousCursor = cursor;
          var result = interpolation(mergedProps);
          cursor = previousCursor;
          return handleInterpolation(mergedProps, registered, result);
        } else if (true) {
          console.error('Functions that are interpolated in css calls will be stringified.\n' + 'If you want to have a css call based on props, create a function that returns a css call like this\n' + 'let dynamicStyle = (props) => css`color: ${props.color}`\n' + 'It can be called directly with props or interpolated in a styled call like this\n' + "let SomeComponent = styled('div')`${dynamicStyle}`");
        }

        break;
      }

    case 'string':
      if (true) {
        var matched = [];
        var replaced = interpolation.replace(animationRegex, function (match, p1, p2) {
          var fakeVarName = "animation" + matched.length;
          matched.push("const " + fakeVarName + " = keyframes`" + p2.replace(/^@keyframes animation-\w+/, '') + "`");
          return "${" + fakeVarName + "}";
        });

        if (matched.length) {
          console.error('`keyframes` output got interpolated into plain string, please wrap it with `css`.\n\n' + 'Instead of doing this:\n\n' + [].concat(matched, ["`" + replaced + "`"]).join('\n') + '\n\nYou should wrap it with `css` like this:\n\n' + ("css`" + replaced + "`"));
        }
      }

      break;
  } // finalize string values (regular strings and functions interpolated into css calls)


  if (registered == null) {
    return interpolation;
  }

  var cached = registered[interpolation];
  return cached !== undefined ? cached : interpolation;
}

function createStringFromObject(mergedProps, registered, obj) {
  var string = '';

  if (Array.isArray(obj)) {
    for (var i = 0; i < obj.length; i++) {
      string += handleInterpolation(mergedProps, registered, obj[i]) + ";";
    }
  } else {
    for (var _key in obj) {
      var value = obj[_key];

      if (typeof value !== 'object') {
        if (registered != null && registered[value] !== undefined) {
          string += _key + "{" + registered[value] + "}";
        } else if (isProcessableValue(value)) {
          string += processStyleName(_key) + ":" + processStyleValue(_key, value) + ";";
        }
      } else {
        if (_key === 'NO_COMPONENT_SELECTOR' && "development" !== 'production') {
          throw new Error(noComponentSelectorMessage);
        }

        if (Array.isArray(value) && typeof value[0] === 'string' && (registered == null || registered[value[0]] === undefined)) {
          for (var _i = 0; _i < value.length; _i++) {
            if (isProcessableValue(value[_i])) {
              string += processStyleName(_key) + ":" + processStyleValue(_key, value[_i]) + ";";
            }
          }
        } else {
          var interpolated = handleInterpolation(mergedProps, registered, value);

          switch (_key) {
            case 'animation':
            case 'animationName':
              {
                string += processStyleName(_key) + ":" + interpolated + ";";
                break;
              }

            default:
              {
                if ( true && _key === 'undefined') {
                  console.error(UNDEFINED_AS_OBJECT_KEY_ERROR);
                }

                string += _key + "{" + interpolated + "}";
              }
          }
        }
      }
    }
  }

  return string;
}

var labelPattern = /label:\s*([^\s;\n{]+)\s*(;|$)/g;
var sourceMapPattern;

if (true) {
  sourceMapPattern = /\/\*#\ssourceMappingURL=data:application\/json;\S+\s+\*\//g;
} // this is the cursor for keyframes
// keyframes are stored on the SerializedStyles object as a linked list


var cursor;
var serializeStyles = function serializeStyles(args, registered, mergedProps) {
  if (args.length === 1 && typeof args[0] === 'object' && args[0] !== null && args[0].styles !== undefined) {
    return args[0];
  }

  var stringMode = true;
  var styles = '';
  cursor = undefined;
  var strings = args[0];

  if (strings == null || strings.raw === undefined) {
    stringMode = false;
    styles += handleInterpolation(mergedProps, registered, strings);
  } else {
    if ( true && strings[0] === undefined) {
      console.error(ILLEGAL_ESCAPE_SEQUENCE_ERROR);
    }

    styles += strings[0];
  } // we start at 1 since we've already handled the first arg


  for (var i = 1; i < args.length; i++) {
    styles += handleInterpolation(mergedProps, registered, args[i]);

    if (stringMode) {
      if ( true && strings[i] === undefined) {
        console.error(ILLEGAL_ESCAPE_SEQUENCE_ERROR);
      }

      styles += strings[i];
    }
  }

  var sourceMap;

  if (true) {
    styles = styles.replace(sourceMapPattern, function (match) {
      sourceMap = match;
      return '';
    });
  } // using a global regex with .exec is stateful so lastIndex has to be reset each time


  labelPattern.lastIndex = 0;
  var identifierName = '';
  var match; // https://esbench.com/bench/5b809c2cf2949800a0f61fb5

  while ((match = labelPattern.exec(styles)) !== null) {
    identifierName += '-' + // $FlowFixMe we know it's not null
    match[1];
  }

  var name = (0,_emotion_hash__WEBPACK_IMPORTED_MODULE_0__["default"])(styles) + identifierName;

  if (true) {
    // $FlowFixMe SerializedStyles type doesn't have toString property (and we don't want to add it)
    return {
      name: name,
      styles: styles,
      map: sourceMap,
      next: cursor,
      toString: function toString() {
        return "You have tried to stringify object returned from `css` function. It isn't supposed to be used directly (e.g. as value of the `className` prop), but rather handed to emotion so it can handle it (e.g. as value of `css` prop).";
      }
    };
  }

  return {
    name: name,
    styles: styles,
    next: cursor
  };
};




/***/ }),

/***/ "./node_modules/@emotion/sheet/dist/emotion-sheet.browser.esm.js":
/*!***********************************************************************!*\
  !*** ./node_modules/@emotion/sheet/dist/emotion-sheet.browser.esm.js ***!
  \***********************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "StyleSheet": function() { return /* binding */ StyleSheet; }
/* harmony export */ });
/*

Based off glamor's StyleSheet, thanks Sunil ❤️

high performance StyleSheet for css-in-js systems

- uses multiple style tags behind the scenes for millions of rules
- uses `insertRule` for appending in production for *much* faster performance

// usage

import { StyleSheet } from '@emotion/sheet'

let styleSheet = new StyleSheet({ key: '', container: document.head })

styleSheet.insert('#box { border: 1px solid red; }')
- appends a css rule into the stylesheet

styleSheet.flush()
- empties the stylesheet of all its contents

*/
// $FlowFixMe
function sheetForTag(tag) {
  if (tag.sheet) {
    // $FlowFixMe
    return tag.sheet;
  } // this weirdness brought to you by firefox

  /* istanbul ignore next */


  for (var i = 0; i < document.styleSheets.length; i++) {
    if (document.styleSheets[i].ownerNode === tag) {
      // $FlowFixMe
      return document.styleSheets[i];
    }
  }
}

function createStyleElement(options) {
  var tag = document.createElement('style');
  tag.setAttribute('data-emotion', options.key);

  if (options.nonce !== undefined) {
    tag.setAttribute('nonce', options.nonce);
  }

  tag.appendChild(document.createTextNode(''));
  tag.setAttribute('data-s', '');
  return tag;
}

var StyleSheet = /*#__PURE__*/function () {
  // Using Node instead of HTMLElement since container may be a ShadowRoot
  function StyleSheet(options) {
    var _this = this;

    this._insertTag = function (tag) {
      var before;

      if (_this.tags.length === 0) {
        if (_this.insertionPoint) {
          before = _this.insertionPoint.nextSibling;
        } else if (_this.prepend) {
          before = _this.container.firstChild;
        } else {
          before = _this.before;
        }
      } else {
        before = _this.tags[_this.tags.length - 1].nextSibling;
      }

      _this.container.insertBefore(tag, before);

      _this.tags.push(tag);
    };

    this.isSpeedy = options.speedy === undefined ? "development" === 'production' : options.speedy;
    this.tags = [];
    this.ctr = 0;
    this.nonce = options.nonce; // key is the value of the data-emotion attribute, it's used to identify different sheets

    this.key = options.key;
    this.container = options.container;
    this.prepend = options.prepend;
    this.insertionPoint = options.insertionPoint;
    this.before = null;
  }

  var _proto = StyleSheet.prototype;

  _proto.hydrate = function hydrate(nodes) {
    nodes.forEach(this._insertTag);
  };

  _proto.insert = function insert(rule) {
    // the max length is how many rules we have per style tag, it's 65000 in speedy mode
    // it's 1 in dev because we insert source maps that map a single rule to a location
    // and you can only have one source map per style tag
    if (this.ctr % (this.isSpeedy ? 65000 : 1) === 0) {
      this._insertTag(createStyleElement(this));
    }

    var tag = this.tags[this.tags.length - 1];

    if (true) {
      var isImportRule = rule.charCodeAt(0) === 64 && rule.charCodeAt(1) === 105;

      if (isImportRule && this._alreadyInsertedOrderInsensitiveRule) {
        // this would only cause problem in speedy mode
        // but we don't want enabling speedy to affect the observable behavior
        // so we report this error at all times
        console.error("You're attempting to insert the following rule:\n" + rule + '\n\n`@import` rules must be before all other types of rules in a stylesheet but other rules have already been inserted. Please ensure that `@import` rules are before all other rules.');
      }
      this._alreadyInsertedOrderInsensitiveRule = this._alreadyInsertedOrderInsensitiveRule || !isImportRule;
    }

    if (this.isSpeedy) {
      var sheet = sheetForTag(tag);

      try {
        // this is the ultrafast version, works across browsers
        // the big drawback is that the css won't be editable in devtools
        sheet.insertRule(rule, sheet.cssRules.length);
      } catch (e) {
        if ( true && !/:(-moz-placeholder|-moz-focus-inner|-moz-focusring|-ms-input-placeholder|-moz-read-write|-moz-read-only|-ms-clear){/.test(rule)) {
          console.error("There was a problem inserting the following rule: \"" + rule + "\"", e);
        }
      }
    } else {
      tag.appendChild(document.createTextNode(rule));
    }

    this.ctr++;
  };

  _proto.flush = function flush() {
    // $FlowFixMe
    this.tags.forEach(function (tag) {
      return tag.parentNode && tag.parentNode.removeChild(tag);
    });
    this.tags = [];
    this.ctr = 0;

    if (true) {
      this._alreadyInsertedOrderInsensitiveRule = false;
    }
  };

  return StyleSheet;
}();




/***/ }),

/***/ "./node_modules/@emotion/unitless/dist/unitless.browser.esm.js":
/*!*********************************************************************!*\
  !*** ./node_modules/@emotion/unitless/dist/unitless.browser.esm.js ***!
  \*********************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
var unitlessKeys = {
  animationIterationCount: 1,
  borderImageOutset: 1,
  borderImageSlice: 1,
  borderImageWidth: 1,
  boxFlex: 1,
  boxFlexGroup: 1,
  boxOrdinalGroup: 1,
  columnCount: 1,
  columns: 1,
  flex: 1,
  flexGrow: 1,
  flexPositive: 1,
  flexShrink: 1,
  flexNegative: 1,
  flexOrder: 1,
  gridRow: 1,
  gridRowEnd: 1,
  gridRowSpan: 1,
  gridRowStart: 1,
  gridColumn: 1,
  gridColumnEnd: 1,
  gridColumnSpan: 1,
  gridColumnStart: 1,
  msGridRow: 1,
  msGridRowSpan: 1,
  msGridColumn: 1,
  msGridColumnSpan: 1,
  fontWeight: 1,
  lineHeight: 1,
  opacity: 1,
  order: 1,
  orphans: 1,
  tabSize: 1,
  widows: 1,
  zIndex: 1,
  zoom: 1,
  WebkitLineClamp: 1,
  // SVG-related properties
  fillOpacity: 1,
  floodOpacity: 1,
  stopOpacity: 1,
  strokeDasharray: 1,
  strokeDashoffset: 1,
  strokeMiterlimit: 1,
  strokeOpacity: 1,
  strokeWidth: 1
};

/* harmony default export */ __webpack_exports__["default"] = (unitlessKeys);


/***/ }),

/***/ "./node_modules/@emotion/weak-memoize/dist/weak-memoize.browser.esm.js":
/*!*****************************************************************************!*\
  !*** ./node_modules/@emotion/weak-memoize/dist/weak-memoize.browser.esm.js ***!
  \*****************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
var weakMemoize = function weakMemoize(func) {
  // $FlowFixMe flow doesn't include all non-primitive types as allowed for weakmaps
  var cache = new WeakMap();
  return function (arg) {
    if (cache.has(arg)) {
      // $FlowFixMe
      return cache.get(arg);
    }

    var ret = func(arg);
    cache.set(arg, ret);
    return ret;
  };
};

/* harmony default export */ __webpack_exports__["default"] = (weakMemoize);


/***/ }),

/***/ "./node_modules/@wordpress/icons/build-module/library/cancel-circle-filled.js":
/*!************************************************************************************!*\
  !*** ./node_modules/@wordpress/icons/build-module/library/cancel-circle-filled.js ***!
  \************************************************************************************/
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

const cancelCircleFilled = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_primitives__WEBPACK_IMPORTED_MODULE_1__.SVG, {
  viewBox: "0 0 24 24",
  xmlns: "http://www.w3.org/2000/svg"
}, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_primitives__WEBPACK_IMPORTED_MODULE_1__.Path, {
  d: "M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21ZM15.5303 8.46967C15.8232 8.76256 15.8232 9.23744 15.5303 9.53033L13.0607 12L15.5303 14.4697C15.8232 14.7626 15.8232 15.2374 15.5303 15.5303C15.2374 15.8232 14.7626 15.8232 14.4697 15.5303L12 13.0607L9.53033 15.5303C9.23744 15.8232 8.76256 15.8232 8.46967 15.5303C8.17678 15.2374 8.17678 14.7626 8.46967 14.4697L10.9393 12L8.46967 9.53033C8.17678 9.23744 8.17678 8.76256 8.46967 8.46967C8.76256 8.17678 9.23744 8.17678 9.53033 8.46967L12 10.9393L14.4697 8.46967C14.7626 8.17678 15.2374 8.17678 15.5303 8.46967Z"
}));
/* harmony default export */ __webpack_exports__["default"] = (cancelCircleFilled);
//# sourceMappingURL=cancel-circle-filled.js.map

/***/ }),

/***/ "./node_modules/@wordpress/icons/build-module/library/check.js":
/*!*********************************************************************!*\
  !*** ./node_modules/@wordpress/icons/build-module/library/check.js ***!
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

const check = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_primitives__WEBPACK_IMPORTED_MODULE_1__.SVG, {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 24 24"
}, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_primitives__WEBPACK_IMPORTED_MODULE_1__.Path, {
  d: "M16.7 7.1l-6.3 8.5-3.3-2.5-.9 1.2 4.5 3.4L17.9 8z"
}));
/* harmony default export */ __webpack_exports__["default"] = (check);
//# sourceMappingURL=check.js.map

/***/ }),

/***/ "./node_modules/@wordpress/icons/build-module/library/chevron-down.js":
/*!****************************************************************************!*\
  !*** ./node_modules/@wordpress/icons/build-module/library/chevron-down.js ***!
  \****************************************************************************/
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

const chevronDown = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_primitives__WEBPACK_IMPORTED_MODULE_1__.SVG, {
  viewBox: "0 0 24 24",
  xmlns: "http://www.w3.org/2000/svg"
}, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_primitives__WEBPACK_IMPORTED_MODULE_1__.Path, {
  d: "M17.5 11.6L12 16l-5.5-4.4.9-1.2L12 14l4.5-3.6 1 1.2z"
}));
/* harmony default export */ __webpack_exports__["default"] = (chevronDown);
//# sourceMappingURL=chevron-down.js.map

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

  const renderDescription = () => {
    if (description) {
      if ('enable_soft_limit' === id || 'enable_soft_limit_for_extended_layout' === id) {
        return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("p", {
          className: "description",
          dangerouslySetInnerHTML: {
            __html: description
          }
        });
      } else {
        return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("p", {
          className: "description"
        }, description);
      }
    }
  };

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
  })))), renderDescription());
};

/* harmony default export */ __webpack_exports__["default"] = (Checkbox);

/***/ }),

/***/ "./src/components/Field/ImagePicker.js":
/*!*********************************************!*\
  !*** ./src/components/Field/ImagePicker.js ***!
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
/* harmony import */ var _wordpress_media_utils__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @wordpress/media-utils */ "@wordpress/media-utils");
/* harmony import */ var _wordpress_media_utils__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_wordpress_media_utils__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _wordpress_icons__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @wordpress/icons */ "./node_modules/@wordpress/icons/build-module/library/cancel-circle-filled.js");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../utils */ "./src/components/utils.js");






const ALLOWED_MEDIA_TYPES = ['image'];

const ImagePickerField = _ref => {
  let {
    imageId,
    imageUrl,
    onChange,
    onClear
  } = _ref;
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_media_utils__WEBPACK_IMPORTED_MODULE_3__.MediaUpload, {
    onSelect: media => onChange(media),
    allowedTypes: ALLOWED_MEDIA_TYPES,
    value: imageId,
    render: _ref2 => {
      let {
        open
      } = _ref2;

      if (imageId) {
        return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
          className: "__image_picker_group"
        }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.Button, {
          variant: "secondary",
          className: "__thumbnail",
          onClick: open
        }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
          style: {
            backgroundImage: `url(${imageUrl})`
          }
        })), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("button", {
          className: "button-link button-link-delete",
          onClick: onClear
        }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.Icon, {
          icon: _wordpress_icons__WEBPACK_IMPORTED_MODULE_5__["default"],
          size: 20
        })));
      } else {
        return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.Button, {
          className: "__image_picker_button",
          variant: "secondary",
          onClick: open
        }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Select Image', 'wc-ajax-product-filter'));
      }
    }
  });
};

const ImagePicker = _ref3 => {
  let {
    label,
    id,
    imageId,
    imageUrl,
    onChange,
    onClear,
    description,
    isPro,
    renderAsFormField = true
  } = _ref3;

  if (renderAsFormField) {
    return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: "__form_control __image_picker"
    }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: "__inner"
    }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: "__label"
    }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("label", {
      htmlFor: id
    }, label, (0,_utils__WEBPACK_IMPORTED_MODULE_4__.proTag)(isPro))), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: "__wrapper"
    }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: "__input_wrapper"
    }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(ImagePickerField, {
      imageId: imageId,
      imageUrl: imageUrl,
      onChange: onChange,
      onClear: onClear
    })))), description && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("p", {
      className: "description"
    }, description));
  } else {
    return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(ImagePickerField, {
      imageId: imageId,
      imageUrl: imageUrl,
      onChange: onChange,
      onClear: onClear
    });
  }
};

/* harmony default export */ __webpack_exports__["default"] = (ImagePicker);

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
  }, rest))))), description ? (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)("p", {
    className: "description"
  }, description) : '');
};

/* harmony default export */ __webpack_exports__["default"] = (Number);

/***/ }),

/***/ "./src/components/Field/Select.js":
/*!****************************************!*\
  !*** ./src/components/Field/Select.js ***!
  \****************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_select__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react-select */ "./node_modules/react-select/dist/react-select.esm.js");
/* harmony import */ var _Field_utilsForReactSelect__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../Field/utilsForReactSelect */ "./src/components/Field/utilsForReactSelect.js");




const SimpleReactSelect = _ref => {
  let {
    options,
    value,
    onChange,
    classes,
    portalTarget
  } = _ref;
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(react_select__WEBPACK_IMPORTED_MODULE_2__["default"], {
    components: {
      IndicatorSeparator: _Field_utilsForReactSelect__WEBPACK_IMPORTED_MODULE_1__.IndicatorSeparator,
      DropdownIndicator: _Field_utilsForReactSelect__WEBPACK_IMPORTED_MODULE_1__.DropdownIndicator,
      Option: _Field_utilsForReactSelect__WEBPACK_IMPORTED_MODULE_1__.Option,
      SingleValue: _Field_utilsForReactSelect__WEBPACK_IMPORTED_MODULE_1__.SingleValue,
      Group: _Field_utilsForReactSelect__WEBPACK_IMPORTED_MODULE_1__.Group
    },
    formatGroupLabel: _Field_utilsForReactSelect__WEBPACK_IMPORTED_MODULE_1__.FormatGroupLabel,
    isSearchable: false,
    options: options,
    value: value,
    onChange: onChange,
    styles: _Field_utilsForReactSelect__WEBPACK_IMPORTED_MODULE_1__.customStyles,
    className: classes,
    menuPortalTarget: portalTarget,
    classNamePrefix: "__react_select",
    theme: theme => ({ ...theme,
      borderRadius: 0,
      colors: { ...theme.colors,
        primary: '#007cba'
      }
    })
  });
};

const Select = _ref2 => {
  let {
    id,
    label,
    description,
    options,
    value,
    onChange,
    renderAsFormField = false,
    childComponent,
    portalTarget = false
  } = _ref2;
  let customClasses = '__custom_react_select __single_select';
  let html;

  if (id) {
    customClasses += ` ${id}`;
  }

  if (renderAsFormField) {
    html = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: "__form_control react_select_simple"
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
    }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(SimpleReactSelect, {
      options: options,
      value: value,
      classes: customClasses,
      portalTarget: portalTarget,
      onChange: selectedItem => onChange(selectedItem, id)
    }), childComponent))), description ? (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("p", {
      className: "description"
    }, description) : '');
  } else {
    html = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(SimpleReactSelect, {
      options: options,
      value: value,
      classes: customClasses,
      portalTarget: portalTarget,
      onChange: selectedItem => onChange(selectedItem)
    });
  }

  return html;
};

/* harmony default export */ __webpack_exports__["default"] = (Select);

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
      className: "description"
    }, description));
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

/***/ "./src/components/Field/utilsForReactSelect.js":
/*!*****************************************************!*\
  !*** ./src/components/Field/utilsForReactSelect.js ***!
  \*****************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "DropdownIndicator": function() { return /* binding */ DropdownIndicator; },
/* harmony export */   "FormatGroupLabel": function() { return /* binding */ FormatGroupLabel; },
/* harmony export */   "FormatSelectMultiLabel": function() { return /* binding */ FormatSelectMultiLabel; },
/* harmony export */   "Group": function() { return /* binding */ Group; },
/* harmony export */   "IndicatorSeparator": function() { return /* binding */ IndicatorSeparator; },
/* harmony export */   "Option": function() { return /* binding */ Option; },
/* harmony export */   "OptionForSelectArchive": function() { return /* binding */ OptionForSelectArchive; },
/* harmony export */   "OptionForSelectRule": function() { return /* binding */ OptionForSelectRule; },
/* harmony export */   "SingleValue": function() { return /* binding */ SingleValue; },
/* harmony export */   "SingleValueForSelectArchive": function() { return /* binding */ SingleValueForSelectArchive; },
/* harmony export */   "SingleValueForSelectRule": function() { return /* binding */ SingleValueForSelectRule; },
/* harmony export */   "customStyles": function() { return /* binding */ customStyles; }
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _wordpress_icons__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @wordpress/icons */ "./node_modules/@wordpress/icons/build-module/library/chevron-down.js");
/* harmony import */ var _wordpress_icons__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @wordpress/icons */ "./node_modules/@wordpress/icons/build-module/library/check.js");
/* harmony import */ var react_select__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! react-select */ "./node_modules/react-select/dist/index-a7690a33.esm.js");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../utils */ "./src/components/utils.js");






const customStyles = {
  control: base => ({ ...base,
    height: 30,
    minHeight: 30
  }),
  dropdownIndicator: base => ({ ...base,
    padding: '0 4px 0 0'
  }),
  clearIndicator: base => ({ ...base,
    paddingTop: 0,
    paddingBottom: 0
  }),
  input: base => ({ ...base,
    paddingTop: 0,
    paddingBottom: 0
  }),
  singleValue: base => ({ ...base,
    marginLeft: 0,
    marginRight: 0
  }),
  menuPortal: base => ({ ...base,
    zIndex: 300
  }),
  menu: base => ({ ...base,
    borderRadius: 2,
    boxShadow: 'none',
    border: '1px solid #ddd',
    marginTop: 5,
    marginBottom: 5,
    zIndex: 300
  }),
  menuList: base => ({ ...base,
    padding: 0,
    borderRadius: 2
  }),
  option: (base, _ref) => {
    let {
      isFocused
    } = _ref;
    return { ...base,
      padding: '1px 8px',
      lineHeight: '28px',
      backgroundColor: isFocused ? '#ddd' : 'transparent',
      color: 'unset'
    };
  },
  group: base => ({ ...base,
    paddingBottom: 0
  }),
  groupHeading: base => ({ ...base,
    padding: '0 8px'
  })
};
const IndicatorSeparator = () => null;

const CaretDownIcon = () => {
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Icon, {
    icon: _wordpress_icons__WEBPACK_IMPORTED_MODULE_4__["default"],
    size: 18
  });
};

const DropdownIndicator = props => {
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(react_select__WEBPACK_IMPORTED_MODULE_5__.c.DropdownIndicator, props, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(CaretDownIcon, null));
};
const Option = props => {
  const {
    data,
    isSelected
  } = props;
  const {
    label,
    isPro
  } = data;
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(react_select__WEBPACK_IMPORTED_MODULE_5__.c.Option, props, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "__wrapper"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "__option_label"
  }, label, (0,_utils__WEBPACK_IMPORTED_MODULE_3__.isProFeature)(isPro) && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
    className: "__pro_tag"
  })), isSelected && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Icon, {
    icon: _wordpress_icons__WEBPACK_IMPORTED_MODULE_6__["default"],
    className: "__icon"
  })));
};

const Info = _ref2 => {
  let {
    value
  } = _ref2;
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
    className: "__info"
  }, "[", (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.sprintf)((0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('ID: %s', 'wc-ajax-product-filter'), value), "]");
};

const groupInfoForSelectRule = _ref3 => {
  let {
    value,
    group
  } = _ref3;
  let html = '';

  if ('archive' === group) {
    html = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
      className: "__info"
    }, value);
  } else if ('filter' === group) {
    html = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(Info, {
      value: value
    });
  }

  return html;
};

const OptionForSelectRule = props => {
  const {
    data,
    isSelected
  } = props;
  const {
    label
  } = data;
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(react_select__WEBPACK_IMPORTED_MODULE_5__.c.Option, props, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "__wrapper"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "__option_label"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
    className: "__name"
  }, label), groupInfoForSelectRule(data)), isSelected && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Icon, {
    icon: _wordpress_icons__WEBPACK_IMPORTED_MODULE_6__["default"],
    className: "__icon"
  })));
};
const OptionForSelectArchive = props => {
  const {
    data,
    isSelected
  } = props;
  const {
    label
  } = data;
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(react_select__WEBPACK_IMPORTED_MODULE_5__.c.Option, props, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "__wrapper"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "__option_label"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
    className: "__name"
  }, label), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(Info, {
    value: data.value
  })), isSelected && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Icon, {
    icon: _wordpress_icons__WEBPACK_IMPORTED_MODULE_6__["default"],
    className: "__icon"
  })));
};
const SingleValue = props => {
  const {
    data
  } = props;
  const {
    label,
    isPro
  } = data;
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(react_select__WEBPACK_IMPORTED_MODULE_5__.c.SingleValue, props, label, (0,_utils__WEBPACK_IMPORTED_MODULE_3__.isProFeature)(isPro) && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
    className: "__pro_tag"
  }));
};
const SingleValueForSelectArchive = props => {
  const {
    data
  } = props;
  const {
    label
  } = data;
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(react_select__WEBPACK_IMPORTED_MODULE_5__.c.SingleValue, props, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
    className: "__name"
  }, label), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(Info, {
    value: data.value
  }));
};
const SingleValueForSelectRule = props => {
  const {
    data
  } = props;
  const {
    label
  } = data;
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(react_select__WEBPACK_IMPORTED_MODULE_5__.c.SingleValue, props, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
    className: "__name"
  }, label), groupInfoForSelectRule(data));
};
const Group = props => {
  if (props.data.proGroup) {
    return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: "__pro_group"
    }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(react_select__WEBPACK_IMPORTED_MODULE_5__.c.Group, props));
  }

  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(react_select__WEBPACK_IMPORTED_MODULE_5__.c.Group, props);
};
const FormatSelectMultiLabel = data => {
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
    className: "__name"
  }, data.label), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(Info, {
    value: data.value
  }));
};
const FormatGroupLabel = data => {
  if (data.proGroup) {
    return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
      className: "__pro_heading_wrapper"
    }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
      className: "__pro_heading"
    }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Pro', 'wc-ajax-product-filter')));
  }

  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", null, data.label);
};

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

/***/ }),

/***/ "./src/components/Settings/Fields/ScrollWindowTo.js":
/*!**********************************************************!*\
  !*** ./src/components/Settings/Fields/ScrollWindowTo.js ***!
  \**********************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _Field_Select__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../Field/Select */ "./src/components/Field/Select.js");
/* harmony import */ var _SettingsContext__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../SettingsContext */ "./src/components/Settings/SettingsContext.js");
/* harmony import */ var _useSettingsData__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../useSettingsData */ "./src/components/Settings/useSettingsData.js");





const scrollWindowOptions = [{
  label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Results container', 'wc-ajax-product-filter'),
  value: 'results'
}, {
  label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Custom element', 'wc-ajax-product-filter'),
  value: 'custom'
}, {
  label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('None', 'wc-ajax-product-filter'),
  value: 'none'
}];
const scrollWindowForOptions = [{
  label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Both in desktop and mobile', 'wc-ajax-product-filter'),
  value: 'both'
}, {
  label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Desktop only', 'wc-ajax-product-filter'),
  value: 'desktop'
}, {
  label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Mobile only', 'wc-ajax-product-filter'),
  value: 'mobile'
}];
const scrollWindowWhenOptions = [{
  label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Immediately', 'wc-ajax-product-filter'),
  value: 'immediately'
}, {
  label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('After updating the results', 'wc-ajax-product-filter'),
  value: 'after'
}];

const ScrollWindowTo = () => {
  const {
    state,
    dispatch
  } = (0,_SettingsContext__WEBPACK_IMPORTED_MODULE_3__.useSettings)();
  const {
    handleSelectChange
  } = (0,_useSettingsData__WEBPACK_IMPORTED_MODULE_4__["default"])(state, dispatch);
  const {
    settings: {
      scroll_window,
      scroll_window_for,
      scroll_window_when
    }
  } = state;
  const scrollWindow = scrollWindowOptions.find(option => option.value === scroll_window);
  const scrollWindowFor = scrollWindowForOptions.find(option => option.value === scroll_window_for);
  const scrollWindowWhen = scrollWindowWhenOptions.find(option => option.value === scroll_window_when);
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "__form_control __scroll_window_to"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "__inner"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "__label"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("label", {
    htmlFor: "scroll_window"
  }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Scroll window to', 'wc-ajax-product-filter'))), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "__wrapper"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "__input_wrapper"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_Field_Select__WEBPACK_IMPORTED_MODULE_2__["default"], {
    id: 'scroll_window',
    value: scrollWindow,
    options: scrollWindowOptions,
    onChange: selected => handleSelectChange(selected, 'scroll_window')
  }), 'none' !== scroll_window && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_Field_Select__WEBPACK_IMPORTED_MODULE_2__["default"], {
    id: 'scroll_window_for',
    value: scrollWindowFor,
    options: scrollWindowForOptions,
    onChange: selected => handleSelectChange(selected, 'scroll_window_for')
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_Field_Select__WEBPACK_IMPORTED_MODULE_2__["default"], {
    id: 'scroll_window_when',
    value: scrollWindowWhen,
    options: scrollWindowWhenOptions,
    onChange: selected => handleSelectChange(selected, 'scroll_window_when')
  }))))), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("p", {
    className: "description"
  }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Determines the scroll behavior.', 'wc-ajax-product-filter')));
};

/* harmony default export */ __webpack_exports__["default"] = (ScrollWindowTo);

/***/ }),

/***/ "./src/components/Settings/Fields/index.js":
/*!*************************************************!*\
  !*** ./src/components/Settings/Fields/index.js ***!
  \*************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _SettingsContext__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../SettingsContext */ "./src/components/Settings/SettingsContext.js");
/* harmony import */ var _Field_Text__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../Field/Text */ "./src/components/Field/Text.js");
/* harmony import */ var _Field_Checkbox__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../Field/Checkbox */ "./src/components/Field/Checkbox.js");
/* harmony import */ var _useSettingsData__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../useSettingsData */ "./src/components/Settings/useSettingsData.js");
/* harmony import */ var _Field_Select__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../Field/Select */ "./src/components/Field/Select.js");
/* harmony import */ var _Field_Number__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../Field/Number */ "./src/components/Field/Number.js");
/* harmony import */ var _Field_ImagePicker__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../Field/ImagePicker */ "./src/components/Field/ImagePicker.js");
/* harmony import */ var _ScrollWindowTo__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./ScrollWindowTo */ "./src/components/Settings/Fields/ScrollWindowTo.js");










const filterRelationshipOptions = [{
  label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('AND', 'wc-ajax-product-filter'),
  value: 'and'
}, {
  label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('OR', 'wc-ajax-product-filter'),
  value: 'or'
}];

const Fields = () => {
  const {
    state,
    dispatch
  } = (0,_SettingsContext__WEBPACK_IMPORTED_MODULE_2__.useSettings)();
  const {
    handleCheckboxChange,
    handleTextFieldChange,
    handleSelectChange,
    handleImageChange,
    handleImageRemove
  } = (0,_useSettingsData__WEBPACK_IMPORTED_MODULE_5__["default"])(state, dispatch);
  const {
    settings: {
      shop_loop_container,
      not_found_container,
      enable_pagination_via_ajax,
      pagination_container,
      sorting_control,
      show_sorting_data_in_active_filters,
      attach_chosen_on_sorting,
      loading_animation,
      loading_image,
      loading_image_src,
      scroll_to_top_offset,
      scroll_window,
      scroll_window_custom_element,
      filter_relationships,
      update_count,
      remove_data
    }
  } = state;
  const filterRelationship = filterRelationshipOptions.find(option => option.value === filter_relationships);

  const handleLoaderImageChange = media => {
    handleImageChange(media, 'loading_image');
  };

  const handleLoaderImageClear = () => {
    handleImageRemove('loading_image');
  };

  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_Field_Text__WEBPACK_IMPORTED_MODULE_3__["default"], {
    id: 'shop_loop_container',
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Shop loop container', 'wc-ajax-product-filter'),
    description: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)("The element selector that is holding the shop loop. In most cases, you don't need to change this.", 'wc-ajax-product-filter'),
    value: shop_loop_container,
    onChange: handleTextFieldChange
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_Field_Text__WEBPACK_IMPORTED_MODULE_3__["default"], {
    id: 'not_found_container',
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('No products container', 'wc-ajax-product-filter'),
    description: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)("The element selector that is holding the no products found message. In most cases, you don't need to change this.", 'wc-ajax-product-filter'),
    value: not_found_container,
    onChange: handleTextFieldChange
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_Field_Checkbox__WEBPACK_IMPORTED_MODULE_4__["default"], {
    id: 'enable_pagination_via_ajax',
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Pagination via AJAX', 'wc-ajax-product-filter'),
    description: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Whether to enable ajax to paginate the products.', 'wc-ajax-product-filter'),
    isChecked: enable_pagination_via_ajax,
    onChange: handleCheckboxChange
  }), '1' === enable_pagination_via_ajax && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_Field_Text__WEBPACK_IMPORTED_MODULE_3__["default"], {
    id: 'pagination_container',
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Pagination container', 'wc-ajax-product-filter'),
    description: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)("The element selector that is holding the pagination. In most cases, you don't need to change this.", 'wc-ajax-product-filter'),
    value: pagination_container,
    onChange: handleTextFieldChange
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_Field_Checkbox__WEBPACK_IMPORTED_MODULE_4__["default"], {
    id: 'sorting_control',
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Product sorting via AJAX', 'wc-ajax-product-filter'),
    description: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Whether to enable ajax for the default product sorting dropdown.', 'wc-ajax-product-filter'),
    isChecked: sorting_control,
    onChange: handleCheckboxChange
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_Field_Checkbox__WEBPACK_IMPORTED_MODULE_4__["default"], {
    id: 'show_sorting_data_in_active_filters',
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Sorting data in Active Filters', 'wc-ajax-product-filter'),
    description: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Whether to show the sort by data in active filters.', 'wc-ajax-product-filter'),
    isChecked: show_sorting_data_in_active_filters,
    onChange: handleCheckboxChange
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_Field_Checkbox__WEBPACK_IMPORTED_MODULE_4__["default"], {
    id: 'attach_chosen_on_sorting',
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Combobox for sorting dropdown', 'wc-ajax-product-filter'),
    description: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Use jQuery Chosen library for the sorting dropdown instead of the native select element.', 'wc-ajax-product-filter'),
    isChecked: attach_chosen_on_sorting,
    onChange: handleCheckboxChange
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_Field_Checkbox__WEBPACK_IMPORTED_MODULE_4__["default"], {
    id: 'loading_animation',
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Loading Animation', 'wc-ajax-product-filter'),
    description: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Whether to show an animation while the results are fetching.', 'wc-ajax-product-filter'),
    isChecked: loading_animation,
    onChange: handleCheckboxChange
  }), '1' === loading_animation && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_Field_ImagePicker__WEBPACK_IMPORTED_MODULE_8__["default"], {
    id: 'loading_image',
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Loading Image', 'wc-ajax-product-filter'),
    description: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Change the default loading image.', 'wc-ajax-product-filter'),
    imageId: loading_image,
    imageUrl: loading_image_src,
    onChange: handleLoaderImageChange,
    onClear: handleLoaderImageClear
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_ScrollWindowTo__WEBPACK_IMPORTED_MODULE_9__["default"], null), 'custom' === scroll_window && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_Field_Text__WEBPACK_IMPORTED_MODULE_3__["default"], {
    id: 'scroll_window_custom_element',
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Custom element identifier', 'wc-ajax-product-filter'),
    description: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Give a valid id/class of the HTML element you want to scroll to.', 'wc-ajax-product-filter'),
    value: scroll_window_custom_element,
    onChange: handleTextFieldChange,
    placeholder: '#id or .class'
  }), 'none' !== scroll_window && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_Field_Number__WEBPACK_IMPORTED_MODULE_7__["default"], {
    id: 'scroll_to_top_offset',
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Scroll to top offset', 'wc-ajax-product-filter'),
    description: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('You can change this value to adjust the scroll to position, eg: 100.', 'wc-ajax-product-filter'),
    value: scroll_to_top_offset,
    onChange: handleTextFieldChange,
    type: 'number'
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_Field_Select__WEBPACK_IMPORTED_MODULE_6__["default"], {
    id: 'filter_relationships',
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Filter relationships', 'wc-ajax-product-filter'),
    description: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('The relationship between filters. AND - products shown will match all filters, OR - products shown will match any of the filters.', 'wc-ajax-product-filter'),
    value: filterRelationship,
    onChange: handleSelectChange,
    options: filterRelationshipOptions,
    renderAsFormField: true
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_Field_Checkbox__WEBPACK_IMPORTED_MODULE_4__["default"], {
    id: 'update_count',
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Enable auto count', 'wc-ajax-product-filter'),
    description: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Update the count number according to the applied filters.', 'wc-ajax-product-filter'),
    isChecked: update_count,
    onChange: handleCheckboxChange
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_Field_Checkbox__WEBPACK_IMPORTED_MODULE_4__["default"], {
    id: 'remove_data',
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Remove data', 'wc-ajax-product-filter'),
    description: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Enable this setting to remove all data when uninstalling WC Ajax Product Filter via the `plugins` page.', 'wc-ajax-product-filter'),
    isChecked: remove_data,
    onChange: handleCheckboxChange
  }));
};

/* harmony default export */ __webpack_exports__["default"] = (Fields);

/***/ }),

/***/ "./src/components/Settings/SettingsContext.js":
/*!****************************************************!*\
  !*** ./src/components/Settings/SettingsContext.js ***!
  \****************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "SettingsProvider": function() { return /* binding */ SettingsProvider; },
/* harmony export */   "useSettings": function() { return /* binding */ useSettings; }
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _settingsReducer__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./settingsReducer */ "./src/components/Settings/settingsReducer.js");



const SettingsContext = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createContext)(_settingsReducer__WEBPACK_IMPORTED_MODULE_1__.initialState);

const SettingsProvider = _ref => {
  let {
    children
  } = _ref;
  const [state, dispatch] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useReducer)(_settingsReducer__WEBPACK_IMPORTED_MODULE_1__["default"], _settingsReducer__WEBPACK_IMPORTED_MODULE_1__.initialState);
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(SettingsContext.Provider, {
    value: {
      state,
      dispatch
    }
  }, children);
};

const useSettings = () => {
  const context = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useContext)(SettingsContext);

  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }

  return context;
};



/***/ }),

/***/ "./src/components/Settings/index.js":
/*!******************************************!*\
  !*** ./src/components/Settings/index.js ***!
  \******************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _Sidebar__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../Sidebar */ "./src/components/Sidebar.js");
/* harmony import */ var _TopBar__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../TopBar */ "./src/components/TopBar.js");
/* harmony import */ var _Fields__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./Fields */ "./src/components/Settings/Fields/index.js");
/* harmony import */ var _Notifications__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../Notifications */ "./src/components/Notifications.js");
/* harmony import */ var _SettingsContext__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./SettingsContext */ "./src/components/Settings/SettingsContext.js");
/* harmony import */ var _SVGIcons__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../SVGIcons */ "./src/components/SVGIcons.js");
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! axios */ "./node_modules/axios/index.js");
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_9___default = /*#__PURE__*/__webpack_require__.n(axios__WEBPACK_IMPORTED_MODULE_9__);
/* harmony import */ var _notices__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../notices */ "./src/components/notices.js");













const Settings = () => {
  const {
    state: {
      isDirty,
      settings
    },
    dispatch
  } = (0,_SettingsContext__WEBPACK_IMPORTED_MODULE_7__.useSettings)();
  const [saveBtnBusy, setSaveBtnBusy] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(false);
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    if (!isDirty) {
      return;
    }

    (0,_notices__WEBPACK_IMPORTED_MODULE_10__.removeSettingsSavedNotices)();
  }, [isDirty]);

  const handleSaveSettings = () => {
    setSaveBtnBusy(true);
    const formData = new FormData();
    formData.append('action', 'wcapf_save_settings');
    formData.append('settings', JSON.stringify(settings));
    axios__WEBPACK_IMPORTED_MODULE_9___default().post(wcapf_admin_params.ajaxurl, formData).then(res => {
      setSaveBtnBusy(false);
      const {
        data: {
          data,
          success
        }
      } = res;

      if (success) {
        dispatch({
          type: 'SET_DIRTY',
          payload: false
        });
        (0,_notices__WEBPACK_IMPORTED_MODULE_10__.settingsSavedSuccessNotice)(data);
      } else {
        (0,_notices__WEBPACK_IMPORTED_MODULE_10__.settingsSavedErrorNotice)(data);
      }
    }).catch(err => {
      setSaveBtnBusy(false);
      (0,_notices__WEBPACK_IMPORTED_MODULE_10__.settingsSavedErrorNotice)(err.message);
    });
  };

  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "__wcapf_admin"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_TopBar__WEBPACK_IMPORTED_MODULE_4__["default"], {
    view: 'settings'
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "__wcapf_layout"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "__main"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "__content"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "__settings_wrapper"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "__settings_header"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("h2", null, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Settings', 'wc-ajax-product-filter')), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Button, {
    variant: "primary",
    disabled: !isDirty || saveBtnBusy,
    isBusy: saveBtnBusy,
    onClick: handleSaveSettings
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Icon, {
    icon: _SVGIcons__WEBPACK_IMPORTED_MODULE_8__.SaveIcon
  }), (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Save', 'wc-ajax-product-filter'))), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "__settings_fields"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_Fields__WEBPACK_IMPORTED_MODULE_5__["default"], null)))), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_Sidebar__WEBPACK_IMPORTED_MODULE_3__["default"], null)), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_Notifications__WEBPACK_IMPORTED_MODULE_6__["default"], null)));
};

/* harmony default export */ __webpack_exports__["default"] = (Settings);

/***/ }),

/***/ "./src/components/Settings/settingsReducer.js":
/*!****************************************************!*\
  !*** ./src/components/Settings/settingsReducer.js ***!
  \****************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "initialState": function() { return /* binding */ initialState; }
/* harmony export */ });
const initialSettings = wcapf_admin_params.settings;
const initialState = {
  isDirty: false,
  settings: initialSettings
};

const settingsReducer = (state, action) => {
  switch (action.type) {
    case 'SET_DIRTY':
      return { ...state,
        isDirty: action.payload
      };

    case 'UPDATE_SETTINGS':
      return { ...state,
        settings: action.payload
      };

    default:
      return state;
  }
};

/* harmony default export */ __webpack_exports__["default"] = (settingsReducer);

/***/ }),

/***/ "./src/components/Settings/useSettingsData.js":
/*!****************************************************!*\
  !*** ./src/components/Settings/useSettingsData.js ***!
  \****************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
const useSettingsData = (state, dispatch) => {
  const {
    isDirty,
    settings
  } = state;

  const setDirty = () => {
    if (!isDirty) {
      dispatch({
        type: 'SET_DIRTY',
        payload: true
      });
    }
  };

  const handleRadioChange = (e, key) => {
    const value = e.target.value;
    updateSingleSettings(key, value);
  };

  const handleCheckboxChange = (value, key) => {
    const _value = value ? '1' : '';

    updateSingleSettings(key, _value);
  };

  const handleTextFieldChange = (value, key) => {
    updateSingleSettings(key, value);
  };

  const handleSelectChange = (selectedItem, key) => {
    updateSingleSettings(key, selectedItem.value);
  };

  const handleImageChange = (attachment, key) => {
    const imageId = attachment.id;
    const imageUrl = attachment.sizes.full.url;
    const prevValue = parseInt(settings[key]);

    if (imageId === prevValue) {
      return;
    }

    const primaryKey = key;
    const secondaryKey = `${key}_src`;
    const _settings = { ...settings,
      [primaryKey]: imageId,
      [secondaryKey]: imageUrl
    };
    updateSettings(_settings);
  };

  const handleImageRemove = key => {
    const primaryKey = key;
    const secondaryKey = `${key}_src`;
    const _settings = { ...settings,
      [primaryKey]: '',
      [secondaryKey]: ''
    };
    updateSettings(_settings);
  };

  const updateSingleSettings = (key, value) => {
    const prevValue = settings[key];

    if (value === prevValue) {
      return;
    }

    dispatch({
      type: 'UPDATE_SETTINGS',
      payload: { ...settings,
        [key]: value
      }
    });
    setDirty();
  };

  const updateSettings = _settings => {
    dispatch({
      type: 'UPDATE_SETTINGS',
      payload: _settings
    });
    setDirty();
  };

  return {
    setDirty,
    handleRadioChange,
    handleCheckboxChange,
    handleTextFieldChange,
    handleSelectChange,
    handleImageChange,
    handleImageRemove
  };
};

/* harmony default export */ __webpack_exports__["default"] = (useSettingsData);

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

/***/ "./node_modules/hoist-non-react-statics/dist/hoist-non-react-statics.cjs.js":
/*!**********************************************************************************!*\
  !*** ./node_modules/hoist-non-react-statics/dist/hoist-non-react-statics.cjs.js ***!
  \**********************************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var reactIs = __webpack_require__(/*! react-is */ "./node_modules/react-is/index.js");

/**
 * Copyright 2015, Yahoo! Inc.
 * Copyrights licensed under the New BSD License. See the accompanying LICENSE file for terms.
 */
var REACT_STATICS = {
  childContextTypes: true,
  contextType: true,
  contextTypes: true,
  defaultProps: true,
  displayName: true,
  getDefaultProps: true,
  getDerivedStateFromError: true,
  getDerivedStateFromProps: true,
  mixins: true,
  propTypes: true,
  type: true
};
var KNOWN_STATICS = {
  name: true,
  length: true,
  prototype: true,
  caller: true,
  callee: true,
  arguments: true,
  arity: true
};
var FORWARD_REF_STATICS = {
  '$$typeof': true,
  render: true,
  defaultProps: true,
  displayName: true,
  propTypes: true
};
var MEMO_STATICS = {
  '$$typeof': true,
  compare: true,
  defaultProps: true,
  displayName: true,
  propTypes: true,
  type: true
};
var TYPE_STATICS = {};
TYPE_STATICS[reactIs.ForwardRef] = FORWARD_REF_STATICS;
TYPE_STATICS[reactIs.Memo] = MEMO_STATICS;

function getStatics(component) {
  // React v16.11 and below
  if (reactIs.isMemo(component)) {
    return MEMO_STATICS;
  } // React v16.12 and above


  return TYPE_STATICS[component['$$typeof']] || REACT_STATICS;
}

var defineProperty = Object.defineProperty;
var getOwnPropertyNames = Object.getOwnPropertyNames;
var getOwnPropertySymbols = Object.getOwnPropertySymbols;
var getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
var getPrototypeOf = Object.getPrototypeOf;
var objectPrototype = Object.prototype;
function hoistNonReactStatics(targetComponent, sourceComponent, blacklist) {
  if (typeof sourceComponent !== 'string') {
    // don't hoist over string (html) components
    if (objectPrototype) {
      var inheritedComponent = getPrototypeOf(sourceComponent);

      if (inheritedComponent && inheritedComponent !== objectPrototype) {
        hoistNonReactStatics(targetComponent, inheritedComponent, blacklist);
      }
    }

    var keys = getOwnPropertyNames(sourceComponent);

    if (getOwnPropertySymbols) {
      keys = keys.concat(getOwnPropertySymbols(sourceComponent));
    }

    var targetStatics = getStatics(targetComponent);
    var sourceStatics = getStatics(sourceComponent);

    for (var i = 0; i < keys.length; ++i) {
      var key = keys[i];

      if (!KNOWN_STATICS[key] && !(blacklist && blacklist[key]) && !(sourceStatics && sourceStatics[key]) && !(targetStatics && targetStatics[key])) {
        var descriptor = getOwnPropertyDescriptor(sourceComponent, key);

        try {
          // Avoid failures from read-only properties
          defineProperty(targetComponent, key, descriptor);
        } catch (e) {}
      }
    }
  }

  return targetComponent;
}

module.exports = hoistNonReactStatics;


/***/ }),

/***/ "./node_modules/memoize-one/dist/memoize-one.esm.js":
/*!**********************************************************!*\
  !*** ./node_modules/memoize-one/dist/memoize-one.esm.js ***!
  \**********************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
var safeIsNaN = Number.isNaN ||
    function ponyfill(value) {
        return typeof value === 'number' && value !== value;
    };
function isEqual(first, second) {
    if (first === second) {
        return true;
    }
    if (safeIsNaN(first) && safeIsNaN(second)) {
        return true;
    }
    return false;
}
function areInputsEqual(newInputs, lastInputs) {
    if (newInputs.length !== lastInputs.length) {
        return false;
    }
    for (var i = 0; i < newInputs.length; i++) {
        if (!isEqual(newInputs[i], lastInputs[i])) {
            return false;
        }
    }
    return true;
}

function memoizeOne(resultFn, isEqual) {
    if (isEqual === void 0) { isEqual = areInputsEqual; }
    var lastThis;
    var lastArgs = [];
    var lastResult;
    var calledOnce = false;
    function memoized() {
        var newArgs = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            newArgs[_i] = arguments[_i];
        }
        if (calledOnce && lastThis === this && isEqual(newArgs, lastArgs)) {
            return lastResult;
        }
        lastResult = resultFn.apply(this, newArgs);
        calledOnce = true;
        lastThis = this;
        lastArgs = newArgs;
        return lastResult;
    }
    return memoized;
}

/* harmony default export */ __webpack_exports__["default"] = (memoizeOne);


/***/ }),

/***/ "./src/settings.scss":
/*!***************************!*\
  !*** ./src/settings.scss ***!
  \***************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./node_modules/react-is/cjs/react-is.development.js":
/*!***********************************************************!*\
  !*** ./node_modules/react-is/cjs/react-is.development.js ***!
  \***********************************************************/
/***/ (function(__unused_webpack_module, exports) {

"use strict";
/** @license React v16.13.1
 * react-is.development.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */





if (true) {
  (function() {
'use strict';

// The Symbol used to tag the ReactElement-like types. If there is no native Symbol
// nor polyfill, then a plain number is used for performance.
var hasSymbol = typeof Symbol === 'function' && Symbol.for;
var REACT_ELEMENT_TYPE = hasSymbol ? Symbol.for('react.element') : 0xeac7;
var REACT_PORTAL_TYPE = hasSymbol ? Symbol.for('react.portal') : 0xeaca;
var REACT_FRAGMENT_TYPE = hasSymbol ? Symbol.for('react.fragment') : 0xeacb;
var REACT_STRICT_MODE_TYPE = hasSymbol ? Symbol.for('react.strict_mode') : 0xeacc;
var REACT_PROFILER_TYPE = hasSymbol ? Symbol.for('react.profiler') : 0xead2;
var REACT_PROVIDER_TYPE = hasSymbol ? Symbol.for('react.provider') : 0xeacd;
var REACT_CONTEXT_TYPE = hasSymbol ? Symbol.for('react.context') : 0xeace; // TODO: We don't use AsyncMode or ConcurrentMode anymore. They were temporary
// (unstable) APIs that have been removed. Can we remove the symbols?

var REACT_ASYNC_MODE_TYPE = hasSymbol ? Symbol.for('react.async_mode') : 0xeacf;
var REACT_CONCURRENT_MODE_TYPE = hasSymbol ? Symbol.for('react.concurrent_mode') : 0xeacf;
var REACT_FORWARD_REF_TYPE = hasSymbol ? Symbol.for('react.forward_ref') : 0xead0;
var REACT_SUSPENSE_TYPE = hasSymbol ? Symbol.for('react.suspense') : 0xead1;
var REACT_SUSPENSE_LIST_TYPE = hasSymbol ? Symbol.for('react.suspense_list') : 0xead8;
var REACT_MEMO_TYPE = hasSymbol ? Symbol.for('react.memo') : 0xead3;
var REACT_LAZY_TYPE = hasSymbol ? Symbol.for('react.lazy') : 0xead4;
var REACT_BLOCK_TYPE = hasSymbol ? Symbol.for('react.block') : 0xead9;
var REACT_FUNDAMENTAL_TYPE = hasSymbol ? Symbol.for('react.fundamental') : 0xead5;
var REACT_RESPONDER_TYPE = hasSymbol ? Symbol.for('react.responder') : 0xead6;
var REACT_SCOPE_TYPE = hasSymbol ? Symbol.for('react.scope') : 0xead7;

function isValidElementType(type) {
  return typeof type === 'string' || typeof type === 'function' || // Note: its typeof might be other than 'symbol' or 'number' if it's a polyfill.
  type === REACT_FRAGMENT_TYPE || type === REACT_CONCURRENT_MODE_TYPE || type === REACT_PROFILER_TYPE || type === REACT_STRICT_MODE_TYPE || type === REACT_SUSPENSE_TYPE || type === REACT_SUSPENSE_LIST_TYPE || typeof type === 'object' && type !== null && (type.$$typeof === REACT_LAZY_TYPE || type.$$typeof === REACT_MEMO_TYPE || type.$$typeof === REACT_PROVIDER_TYPE || type.$$typeof === REACT_CONTEXT_TYPE || type.$$typeof === REACT_FORWARD_REF_TYPE || type.$$typeof === REACT_FUNDAMENTAL_TYPE || type.$$typeof === REACT_RESPONDER_TYPE || type.$$typeof === REACT_SCOPE_TYPE || type.$$typeof === REACT_BLOCK_TYPE);
}

function typeOf(object) {
  if (typeof object === 'object' && object !== null) {
    var $$typeof = object.$$typeof;

    switch ($$typeof) {
      case REACT_ELEMENT_TYPE:
        var type = object.type;

        switch (type) {
          case REACT_ASYNC_MODE_TYPE:
          case REACT_CONCURRENT_MODE_TYPE:
          case REACT_FRAGMENT_TYPE:
          case REACT_PROFILER_TYPE:
          case REACT_STRICT_MODE_TYPE:
          case REACT_SUSPENSE_TYPE:
            return type;

          default:
            var $$typeofType = type && type.$$typeof;

            switch ($$typeofType) {
              case REACT_CONTEXT_TYPE:
              case REACT_FORWARD_REF_TYPE:
              case REACT_LAZY_TYPE:
              case REACT_MEMO_TYPE:
              case REACT_PROVIDER_TYPE:
                return $$typeofType;

              default:
                return $$typeof;
            }

        }

      case REACT_PORTAL_TYPE:
        return $$typeof;
    }
  }

  return undefined;
} // AsyncMode is deprecated along with isAsyncMode

var AsyncMode = REACT_ASYNC_MODE_TYPE;
var ConcurrentMode = REACT_CONCURRENT_MODE_TYPE;
var ContextConsumer = REACT_CONTEXT_TYPE;
var ContextProvider = REACT_PROVIDER_TYPE;
var Element = REACT_ELEMENT_TYPE;
var ForwardRef = REACT_FORWARD_REF_TYPE;
var Fragment = REACT_FRAGMENT_TYPE;
var Lazy = REACT_LAZY_TYPE;
var Memo = REACT_MEMO_TYPE;
var Portal = REACT_PORTAL_TYPE;
var Profiler = REACT_PROFILER_TYPE;
var StrictMode = REACT_STRICT_MODE_TYPE;
var Suspense = REACT_SUSPENSE_TYPE;
var hasWarnedAboutDeprecatedIsAsyncMode = false; // AsyncMode should be deprecated

function isAsyncMode(object) {
  {
    if (!hasWarnedAboutDeprecatedIsAsyncMode) {
      hasWarnedAboutDeprecatedIsAsyncMode = true; // Using console['warn'] to evade Babel and ESLint

      console['warn']('The ReactIs.isAsyncMode() alias has been deprecated, ' + 'and will be removed in React 17+. Update your code to use ' + 'ReactIs.isConcurrentMode() instead. It has the exact same API.');
    }
  }

  return isConcurrentMode(object) || typeOf(object) === REACT_ASYNC_MODE_TYPE;
}
function isConcurrentMode(object) {
  return typeOf(object) === REACT_CONCURRENT_MODE_TYPE;
}
function isContextConsumer(object) {
  return typeOf(object) === REACT_CONTEXT_TYPE;
}
function isContextProvider(object) {
  return typeOf(object) === REACT_PROVIDER_TYPE;
}
function isElement(object) {
  return typeof object === 'object' && object !== null && object.$$typeof === REACT_ELEMENT_TYPE;
}
function isForwardRef(object) {
  return typeOf(object) === REACT_FORWARD_REF_TYPE;
}
function isFragment(object) {
  return typeOf(object) === REACT_FRAGMENT_TYPE;
}
function isLazy(object) {
  return typeOf(object) === REACT_LAZY_TYPE;
}
function isMemo(object) {
  return typeOf(object) === REACT_MEMO_TYPE;
}
function isPortal(object) {
  return typeOf(object) === REACT_PORTAL_TYPE;
}
function isProfiler(object) {
  return typeOf(object) === REACT_PROFILER_TYPE;
}
function isStrictMode(object) {
  return typeOf(object) === REACT_STRICT_MODE_TYPE;
}
function isSuspense(object) {
  return typeOf(object) === REACT_SUSPENSE_TYPE;
}

exports.AsyncMode = AsyncMode;
exports.ConcurrentMode = ConcurrentMode;
exports.ContextConsumer = ContextConsumer;
exports.ContextProvider = ContextProvider;
exports.Element = Element;
exports.ForwardRef = ForwardRef;
exports.Fragment = Fragment;
exports.Lazy = Lazy;
exports.Memo = Memo;
exports.Portal = Portal;
exports.Profiler = Profiler;
exports.StrictMode = StrictMode;
exports.Suspense = Suspense;
exports.isAsyncMode = isAsyncMode;
exports.isConcurrentMode = isConcurrentMode;
exports.isContextConsumer = isContextConsumer;
exports.isContextProvider = isContextProvider;
exports.isElement = isElement;
exports.isForwardRef = isForwardRef;
exports.isFragment = isFragment;
exports.isLazy = isLazy;
exports.isMemo = isMemo;
exports.isPortal = isPortal;
exports.isProfiler = isProfiler;
exports.isStrictMode = isStrictMode;
exports.isSuspense = isSuspense;
exports.isValidElementType = isValidElementType;
exports.typeOf = typeOf;
  })();
}


/***/ }),

/***/ "./node_modules/react-is/index.js":
/*!****************************************!*\
  !*** ./node_modules/react-is/index.js ***!
  \****************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";


if (false) {} else {
  module.exports = __webpack_require__(/*! ./cjs/react-is.development.js */ "./node_modules/react-is/cjs/react-is.development.js");
}


/***/ }),

/***/ "./node_modules/react-select/dist/Select-54ac8379.esm.js":
/*!***************************************************************!*\
  !*** ./node_modules/react-select/dist/Select-54ac8379.esm.js ***!
  \***************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "S": function() { return /* binding */ Select; },
/* harmony export */   "a": function() { return /* binding */ getOptionLabel$1; },
/* harmony export */   "b": function() { return /* binding */ defaultProps; },
/* harmony export */   "c": function() { return /* binding */ createFilter; },
/* harmony export */   "d": function() { return /* binding */ defaultTheme; },
/* harmony export */   "g": function() { return /* binding */ getOptionValue$1; },
/* harmony export */   "m": function() { return /* binding */ mergeStyles; }
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_esm_extends__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/esm/extends */ "./node_modules/@babel/runtime/helpers/esm/extends.js");
/* harmony import */ var _index_a7690a33_esm_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./index-a7690a33.esm.js */ "./node_modules/react-select/dist/index-a7690a33.esm.js");
/* harmony import */ var _babel_runtime_helpers_esm_classCallCheck__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @babel/runtime/helpers/esm/classCallCheck */ "./node_modules/@babel/runtime/helpers/esm/classCallCheck.js");
/* harmony import */ var _babel_runtime_helpers_esm_createClass__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @babel/runtime/helpers/esm/createClass */ "./node_modules/@babel/runtime/helpers/esm/createClass.js");
/* harmony import */ var _babel_runtime_helpers_esm_inherits__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @babel/runtime/helpers/esm/inherits */ "./node_modules/@babel/runtime/helpers/esm/inherits.js");
/* harmony import */ var _babel_runtime_helpers_esm_toConsumableArray__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @babel/runtime/helpers/esm/toConsumableArray */ "./node_modules/@babel/runtime/helpers/esm/toConsumableArray.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _emotion_react__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @emotion/react */ "./node_modules/@emotion/react/dist/emotion-react.browser.esm.js");
/* harmony import */ var memoize_one__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! memoize-one */ "./node_modules/memoize-one/dist/memoize-one.esm.js");
/* harmony import */ var _babel_runtime_helpers_esm_objectWithoutProperties__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @babel/runtime/helpers/esm/objectWithoutProperties */ "./node_modules/@babel/runtime/helpers/esm/objectWithoutProperties.js");












function _EMOTION_STRINGIFIED_CSS_ERROR__$1() { return "You have tried to stringify object returned from `css` function. It isn't supposed to be used directly (e.g. as value of the `className` prop), but rather handed to emotion so it can handle it (e.g. as value of `css` prop)."; }

var _ref =  false ? 0 : {
  name: "1f43avz-a11yText-A11yText",
  styles: "label:a11yText;z-index:9999;border:0;clip:rect(1px, 1px, 1px, 1px);height:1px;width:1px;position:absolute;overflow:hidden;padding:0;white-space:nowrap;label:A11yText;",
  map: "/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkExMXlUZXh0LnRzeCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFNSSIsImZpbGUiOiJBMTF5VGV4dC50c3giLCJzb3VyY2VzQ29udGVudCI6WyIvKiogQGpzeCBqc3ggKi9cbmltcG9ydCB7IGpzeCB9IGZyb20gJ0BlbW90aW9uL3JlYWN0JztcblxuLy8gQXNzaXN0aXZlIHRleHQgdG8gZGVzY3JpYmUgdmlzdWFsIGVsZW1lbnRzLiBIaWRkZW4gZm9yIHNpZ2h0ZWQgdXNlcnMuXG5jb25zdCBBMTF5VGV4dCA9IChwcm9wczogSlNYLkludHJpbnNpY0VsZW1lbnRzWydzcGFuJ10pID0+IChcbiAgPHNwYW5cbiAgICBjc3M9e3tcbiAgICAgIGxhYmVsOiAnYTExeVRleHQnLFxuICAgICAgekluZGV4OiA5OTk5LFxuICAgICAgYm9yZGVyOiAwLFxuICAgICAgY2xpcDogJ3JlY3QoMXB4LCAxcHgsIDFweCwgMXB4KScsXG4gICAgICBoZWlnaHQ6IDEsXG4gICAgICB3aWR0aDogMSxcbiAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgICAgb3ZlcmZsb3c6ICdoaWRkZW4nLFxuICAgICAgcGFkZGluZzogMCxcbiAgICAgIHdoaXRlU3BhY2U6ICdub3dyYXAnLFxuICAgIH19XG4gICAgey4uLnByb3BzfVxuICAvPlxuKTtcblxuZXhwb3J0IGRlZmF1bHQgQTExeVRleHQ7XG4iXX0= */",
  toString: _EMOTION_STRINGIFIED_CSS_ERROR__$1
};

var A11yText = function A11yText(props) {
  return (0,_emotion_react__WEBPACK_IMPORTED_MODULE_7__.jsx)("span", (0,_babel_runtime_helpers_esm_extends__WEBPACK_IMPORTED_MODULE_0__["default"])({
    css: _ref
  }, props));
};

var defaultAriaLiveMessages = {
  guidance: function guidance(props) {
    var isSearchable = props.isSearchable,
        isMulti = props.isMulti,
        isDisabled = props.isDisabled,
        tabSelectsValue = props.tabSelectsValue,
        context = props.context;

    switch (context) {
      case 'menu':
        return "Use Up and Down to choose options".concat(isDisabled ? '' : ', press Enter to select the currently focused option', ", press Escape to exit the menu").concat(tabSelectsValue ? ', press Tab to select the option and exit the menu' : '', ".");

      case 'input':
        return "".concat(props['aria-label'] || 'Select', " is focused ").concat(isSearchable ? ',type to refine list' : '', ", press Down to open the menu, ").concat(isMulti ? ' press left to focus selected values' : '');

      case 'value':
        return 'Use left and right to toggle between focused values, press Backspace to remove the currently focused value';

      default:
        return '';
    }
  },
  onChange: function onChange(props) {
    var action = props.action,
        _props$label = props.label,
        label = _props$label === void 0 ? '' : _props$label,
        labels = props.labels,
        isDisabled = props.isDisabled;

    switch (action) {
      case 'deselect-option':
      case 'pop-value':
      case 'remove-value':
        return "option ".concat(label, ", deselected.");

      case 'clear':
        return 'All selected options have been cleared.';

      case 'initial-input-focus':
        return "option".concat(labels.length > 1 ? 's' : '', " ").concat(labels.join(','), ", selected.");

      case 'select-option':
        return isDisabled ? "option ".concat(label, " is disabled. Select another option.") : "option ".concat(label, ", selected.");

      default:
        return '';
    }
  },
  onFocus: function onFocus(props) {
    var context = props.context,
        focused = props.focused,
        options = props.options,
        _props$label2 = props.label,
        label = _props$label2 === void 0 ? '' : _props$label2,
        selectValue = props.selectValue,
        isDisabled = props.isDisabled,
        isSelected = props.isSelected;

    var getArrayIndex = function getArrayIndex(arr, item) {
      return arr && arr.length ? "".concat(arr.indexOf(item) + 1, " of ").concat(arr.length) : '';
    };

    if (context === 'value' && selectValue) {
      return "value ".concat(label, " focused, ").concat(getArrayIndex(selectValue, focused), ".");
    }

    if (context === 'menu') {
      var disabled = isDisabled ? ' disabled' : '';
      var status = "".concat(isSelected ? 'selected' : 'focused').concat(disabled);
      return "option ".concat(label, " ").concat(status, ", ").concat(getArrayIndex(options, focused), ".");
    }

    return '';
  },
  onFilter: function onFilter(props) {
    var inputValue = props.inputValue,
        resultsMessage = props.resultsMessage;
    return "".concat(resultsMessage).concat(inputValue ? ' for search term ' + inputValue : '', ".");
  }
};

var LiveRegion = function LiveRegion(props) {
  var ariaSelection = props.ariaSelection,
      focusedOption = props.focusedOption,
      focusedValue = props.focusedValue,
      focusableOptions = props.focusableOptions,
      isFocused = props.isFocused,
      selectValue = props.selectValue,
      selectProps = props.selectProps,
      id = props.id;
  var ariaLiveMessages = selectProps.ariaLiveMessages,
      getOptionLabel = selectProps.getOptionLabel,
      inputValue = selectProps.inputValue,
      isMulti = selectProps.isMulti,
      isOptionDisabled = selectProps.isOptionDisabled,
      isSearchable = selectProps.isSearchable,
      menuIsOpen = selectProps.menuIsOpen,
      options = selectProps.options,
      screenReaderStatus = selectProps.screenReaderStatus,
      tabSelectsValue = selectProps.tabSelectsValue;
  var ariaLabel = selectProps['aria-label'];
  var ariaLive = selectProps['aria-live']; // Update aria live message configuration when prop changes

  var messages = (0,react__WEBPACK_IMPORTED_MODULE_5__.useMemo)(function () {
    return (0,_index_a7690a33_esm_js__WEBPACK_IMPORTED_MODULE_8__.a)((0,_index_a7690a33_esm_js__WEBPACK_IMPORTED_MODULE_8__.a)({}, defaultAriaLiveMessages), ariaLiveMessages || {});
  }, [ariaLiveMessages]); // Update aria live selected option when prop changes

  var ariaSelected = (0,react__WEBPACK_IMPORTED_MODULE_5__.useMemo)(function () {
    var message = '';

    if (ariaSelection && messages.onChange) {
      var option = ariaSelection.option,
          selectedOptions = ariaSelection.options,
          removedValue = ariaSelection.removedValue,
          removedValues = ariaSelection.removedValues,
          value = ariaSelection.value; // select-option when !isMulti does not return option so we assume selected option is value

      var asOption = function asOption(val) {
        return !Array.isArray(val) ? val : null;
      }; // If there is just one item from the action then get its label


      var selected = removedValue || option || asOption(value);
      var label = selected ? getOptionLabel(selected) : ''; // If there are multiple items from the action then return an array of labels

      var multiSelected = selectedOptions || removedValues || undefined;
      var labels = multiSelected ? multiSelected.map(getOptionLabel) : [];

      var onChangeProps = (0,_index_a7690a33_esm_js__WEBPACK_IMPORTED_MODULE_8__.a)({
        // multiSelected items are usually items that have already been selected
        // or set by the user as a default value so we assume they are not disabled
        isDisabled: selected && isOptionDisabled(selected, selectValue),
        label: label,
        labels: labels
      }, ariaSelection);

      message = messages.onChange(onChangeProps);
    }

    return message;
  }, [ariaSelection, messages, isOptionDisabled, selectValue, getOptionLabel]);
  var ariaFocused = (0,react__WEBPACK_IMPORTED_MODULE_5__.useMemo)(function () {
    var focusMsg = '';
    var focused = focusedOption || focusedValue;
    var isSelected = !!(focusedOption && selectValue && selectValue.includes(focusedOption));

    if (focused && messages.onFocus) {
      var onFocusProps = {
        focused: focused,
        label: getOptionLabel(focused),
        isDisabled: isOptionDisabled(focused, selectValue),
        isSelected: isSelected,
        options: options,
        context: focused === focusedOption ? 'menu' : 'value',
        selectValue: selectValue
      };
      focusMsg = messages.onFocus(onFocusProps);
    }

    return focusMsg;
  }, [focusedOption, focusedValue, getOptionLabel, isOptionDisabled, messages, options, selectValue]);
  var ariaResults = (0,react__WEBPACK_IMPORTED_MODULE_5__.useMemo)(function () {
    var resultsMsg = '';

    if (menuIsOpen && options.length && messages.onFilter) {
      var resultsMessage = screenReaderStatus({
        count: focusableOptions.length
      });
      resultsMsg = messages.onFilter({
        inputValue: inputValue,
        resultsMessage: resultsMessage
      });
    }

    return resultsMsg;
  }, [focusableOptions, inputValue, menuIsOpen, messages, options, screenReaderStatus]);
  var ariaGuidance = (0,react__WEBPACK_IMPORTED_MODULE_5__.useMemo)(function () {
    var guidanceMsg = '';

    if (messages.guidance) {
      var context = focusedValue ? 'value' : menuIsOpen ? 'menu' : 'input';
      guidanceMsg = messages.guidance({
        'aria-label': ariaLabel,
        context: context,
        isDisabled: focusedOption && isOptionDisabled(focusedOption, selectValue),
        isMulti: isMulti,
        isSearchable: isSearchable,
        tabSelectsValue: tabSelectsValue
      });
    }

    return guidanceMsg;
  }, [ariaLabel, focusedOption, focusedValue, isMulti, isOptionDisabled, isSearchable, menuIsOpen, messages, selectValue, tabSelectsValue]);
  var ariaContext = "".concat(ariaFocused, " ").concat(ariaResults, " ").concat(ariaGuidance);
  var ScreenReaderText = (0,_emotion_react__WEBPACK_IMPORTED_MODULE_7__.jsx)(react__WEBPACK_IMPORTED_MODULE_5__.Fragment, null, (0,_emotion_react__WEBPACK_IMPORTED_MODULE_7__.jsx)("span", {
    id: "aria-selection"
  }, ariaSelected), (0,_emotion_react__WEBPACK_IMPORTED_MODULE_7__.jsx)("span", {
    id: "aria-context"
  }, ariaContext));
  var isInitialFocus = (ariaSelection === null || ariaSelection === void 0 ? void 0 : ariaSelection.action) === 'initial-input-focus';
  return (0,_emotion_react__WEBPACK_IMPORTED_MODULE_7__.jsx)(react__WEBPACK_IMPORTED_MODULE_5__.Fragment, null, (0,_emotion_react__WEBPACK_IMPORTED_MODULE_7__.jsx)(A11yText, {
    id: id
  }, isInitialFocus && ScreenReaderText), (0,_emotion_react__WEBPACK_IMPORTED_MODULE_7__.jsx)(A11yText, {
    "aria-live": ariaLive,
    "aria-atomic": "false",
    "aria-relevant": "additions text"
  }, isFocused && !isInitialFocus && ScreenReaderText));
};

var diacritics = [{
  base: 'A',
  letters: "A\u24B6\uFF21\xC0\xC1\xC2\u1EA6\u1EA4\u1EAA\u1EA8\xC3\u0100\u0102\u1EB0\u1EAE\u1EB4\u1EB2\u0226\u01E0\xC4\u01DE\u1EA2\xC5\u01FA\u01CD\u0200\u0202\u1EA0\u1EAC\u1EB6\u1E00\u0104\u023A\u2C6F"
}, {
  base: 'AA',
  letters: "\uA732"
}, {
  base: 'AE',
  letters: "\xC6\u01FC\u01E2"
}, {
  base: 'AO',
  letters: "\uA734"
}, {
  base: 'AU',
  letters: "\uA736"
}, {
  base: 'AV',
  letters: "\uA738\uA73A"
}, {
  base: 'AY',
  letters: "\uA73C"
}, {
  base: 'B',
  letters: "B\u24B7\uFF22\u1E02\u1E04\u1E06\u0243\u0182\u0181"
}, {
  base: 'C',
  letters: "C\u24B8\uFF23\u0106\u0108\u010A\u010C\xC7\u1E08\u0187\u023B\uA73E"
}, {
  base: 'D',
  letters: "D\u24B9\uFF24\u1E0A\u010E\u1E0C\u1E10\u1E12\u1E0E\u0110\u018B\u018A\u0189\uA779"
}, {
  base: 'DZ',
  letters: "\u01F1\u01C4"
}, {
  base: 'Dz',
  letters: "\u01F2\u01C5"
}, {
  base: 'E',
  letters: "E\u24BA\uFF25\xC8\xC9\xCA\u1EC0\u1EBE\u1EC4\u1EC2\u1EBC\u0112\u1E14\u1E16\u0114\u0116\xCB\u1EBA\u011A\u0204\u0206\u1EB8\u1EC6\u0228\u1E1C\u0118\u1E18\u1E1A\u0190\u018E"
}, {
  base: 'F',
  letters: "F\u24BB\uFF26\u1E1E\u0191\uA77B"
}, {
  base: 'G',
  letters: "G\u24BC\uFF27\u01F4\u011C\u1E20\u011E\u0120\u01E6\u0122\u01E4\u0193\uA7A0\uA77D\uA77E"
}, {
  base: 'H',
  letters: "H\u24BD\uFF28\u0124\u1E22\u1E26\u021E\u1E24\u1E28\u1E2A\u0126\u2C67\u2C75\uA78D"
}, {
  base: 'I',
  letters: "I\u24BE\uFF29\xCC\xCD\xCE\u0128\u012A\u012C\u0130\xCF\u1E2E\u1EC8\u01CF\u0208\u020A\u1ECA\u012E\u1E2C\u0197"
}, {
  base: 'J',
  letters: "J\u24BF\uFF2A\u0134\u0248"
}, {
  base: 'K',
  letters: "K\u24C0\uFF2B\u1E30\u01E8\u1E32\u0136\u1E34\u0198\u2C69\uA740\uA742\uA744\uA7A2"
}, {
  base: 'L',
  letters: "L\u24C1\uFF2C\u013F\u0139\u013D\u1E36\u1E38\u013B\u1E3C\u1E3A\u0141\u023D\u2C62\u2C60\uA748\uA746\uA780"
}, {
  base: 'LJ',
  letters: "\u01C7"
}, {
  base: 'Lj',
  letters: "\u01C8"
}, {
  base: 'M',
  letters: "M\u24C2\uFF2D\u1E3E\u1E40\u1E42\u2C6E\u019C"
}, {
  base: 'N',
  letters: "N\u24C3\uFF2E\u01F8\u0143\xD1\u1E44\u0147\u1E46\u0145\u1E4A\u1E48\u0220\u019D\uA790\uA7A4"
}, {
  base: 'NJ',
  letters: "\u01CA"
}, {
  base: 'Nj',
  letters: "\u01CB"
}, {
  base: 'O',
  letters: "O\u24C4\uFF2F\xD2\xD3\xD4\u1ED2\u1ED0\u1ED6\u1ED4\xD5\u1E4C\u022C\u1E4E\u014C\u1E50\u1E52\u014E\u022E\u0230\xD6\u022A\u1ECE\u0150\u01D1\u020C\u020E\u01A0\u1EDC\u1EDA\u1EE0\u1EDE\u1EE2\u1ECC\u1ED8\u01EA\u01EC\xD8\u01FE\u0186\u019F\uA74A\uA74C"
}, {
  base: 'OI',
  letters: "\u01A2"
}, {
  base: 'OO',
  letters: "\uA74E"
}, {
  base: 'OU',
  letters: "\u0222"
}, {
  base: 'P',
  letters: "P\u24C5\uFF30\u1E54\u1E56\u01A4\u2C63\uA750\uA752\uA754"
}, {
  base: 'Q',
  letters: "Q\u24C6\uFF31\uA756\uA758\u024A"
}, {
  base: 'R',
  letters: "R\u24C7\uFF32\u0154\u1E58\u0158\u0210\u0212\u1E5A\u1E5C\u0156\u1E5E\u024C\u2C64\uA75A\uA7A6\uA782"
}, {
  base: 'S',
  letters: "S\u24C8\uFF33\u1E9E\u015A\u1E64\u015C\u1E60\u0160\u1E66\u1E62\u1E68\u0218\u015E\u2C7E\uA7A8\uA784"
}, {
  base: 'T',
  letters: "T\u24C9\uFF34\u1E6A\u0164\u1E6C\u021A\u0162\u1E70\u1E6E\u0166\u01AC\u01AE\u023E\uA786"
}, {
  base: 'TZ',
  letters: "\uA728"
}, {
  base: 'U',
  letters: "U\u24CA\uFF35\xD9\xDA\xDB\u0168\u1E78\u016A\u1E7A\u016C\xDC\u01DB\u01D7\u01D5\u01D9\u1EE6\u016E\u0170\u01D3\u0214\u0216\u01AF\u1EEA\u1EE8\u1EEE\u1EEC\u1EF0\u1EE4\u1E72\u0172\u1E76\u1E74\u0244"
}, {
  base: 'V',
  letters: "V\u24CB\uFF36\u1E7C\u1E7E\u01B2\uA75E\u0245"
}, {
  base: 'VY',
  letters: "\uA760"
}, {
  base: 'W',
  letters: "W\u24CC\uFF37\u1E80\u1E82\u0174\u1E86\u1E84\u1E88\u2C72"
}, {
  base: 'X',
  letters: "X\u24CD\uFF38\u1E8A\u1E8C"
}, {
  base: 'Y',
  letters: "Y\u24CE\uFF39\u1EF2\xDD\u0176\u1EF8\u0232\u1E8E\u0178\u1EF6\u1EF4\u01B3\u024E\u1EFE"
}, {
  base: 'Z',
  letters: "Z\u24CF\uFF3A\u0179\u1E90\u017B\u017D\u1E92\u1E94\u01B5\u0224\u2C7F\u2C6B\uA762"
}, {
  base: 'a',
  letters: "a\u24D0\uFF41\u1E9A\xE0\xE1\xE2\u1EA7\u1EA5\u1EAB\u1EA9\xE3\u0101\u0103\u1EB1\u1EAF\u1EB5\u1EB3\u0227\u01E1\xE4\u01DF\u1EA3\xE5\u01FB\u01CE\u0201\u0203\u1EA1\u1EAD\u1EB7\u1E01\u0105\u2C65\u0250"
}, {
  base: 'aa',
  letters: "\uA733"
}, {
  base: 'ae',
  letters: "\xE6\u01FD\u01E3"
}, {
  base: 'ao',
  letters: "\uA735"
}, {
  base: 'au',
  letters: "\uA737"
}, {
  base: 'av',
  letters: "\uA739\uA73B"
}, {
  base: 'ay',
  letters: "\uA73D"
}, {
  base: 'b',
  letters: "b\u24D1\uFF42\u1E03\u1E05\u1E07\u0180\u0183\u0253"
}, {
  base: 'c',
  letters: "c\u24D2\uFF43\u0107\u0109\u010B\u010D\xE7\u1E09\u0188\u023C\uA73F\u2184"
}, {
  base: 'd',
  letters: "d\u24D3\uFF44\u1E0B\u010F\u1E0D\u1E11\u1E13\u1E0F\u0111\u018C\u0256\u0257\uA77A"
}, {
  base: 'dz',
  letters: "\u01F3\u01C6"
}, {
  base: 'e',
  letters: "e\u24D4\uFF45\xE8\xE9\xEA\u1EC1\u1EBF\u1EC5\u1EC3\u1EBD\u0113\u1E15\u1E17\u0115\u0117\xEB\u1EBB\u011B\u0205\u0207\u1EB9\u1EC7\u0229\u1E1D\u0119\u1E19\u1E1B\u0247\u025B\u01DD"
}, {
  base: 'f',
  letters: "f\u24D5\uFF46\u1E1F\u0192\uA77C"
}, {
  base: 'g',
  letters: "g\u24D6\uFF47\u01F5\u011D\u1E21\u011F\u0121\u01E7\u0123\u01E5\u0260\uA7A1\u1D79\uA77F"
}, {
  base: 'h',
  letters: "h\u24D7\uFF48\u0125\u1E23\u1E27\u021F\u1E25\u1E29\u1E2B\u1E96\u0127\u2C68\u2C76\u0265"
}, {
  base: 'hv',
  letters: "\u0195"
}, {
  base: 'i',
  letters: "i\u24D8\uFF49\xEC\xED\xEE\u0129\u012B\u012D\xEF\u1E2F\u1EC9\u01D0\u0209\u020B\u1ECB\u012F\u1E2D\u0268\u0131"
}, {
  base: 'j',
  letters: "j\u24D9\uFF4A\u0135\u01F0\u0249"
}, {
  base: 'k',
  letters: "k\u24DA\uFF4B\u1E31\u01E9\u1E33\u0137\u1E35\u0199\u2C6A\uA741\uA743\uA745\uA7A3"
}, {
  base: 'l',
  letters: "l\u24DB\uFF4C\u0140\u013A\u013E\u1E37\u1E39\u013C\u1E3D\u1E3B\u017F\u0142\u019A\u026B\u2C61\uA749\uA781\uA747"
}, {
  base: 'lj',
  letters: "\u01C9"
}, {
  base: 'm',
  letters: "m\u24DC\uFF4D\u1E3F\u1E41\u1E43\u0271\u026F"
}, {
  base: 'n',
  letters: "n\u24DD\uFF4E\u01F9\u0144\xF1\u1E45\u0148\u1E47\u0146\u1E4B\u1E49\u019E\u0272\u0149\uA791\uA7A5"
}, {
  base: 'nj',
  letters: "\u01CC"
}, {
  base: 'o',
  letters: "o\u24DE\uFF4F\xF2\xF3\xF4\u1ED3\u1ED1\u1ED7\u1ED5\xF5\u1E4D\u022D\u1E4F\u014D\u1E51\u1E53\u014F\u022F\u0231\xF6\u022B\u1ECF\u0151\u01D2\u020D\u020F\u01A1\u1EDD\u1EDB\u1EE1\u1EDF\u1EE3\u1ECD\u1ED9\u01EB\u01ED\xF8\u01FF\u0254\uA74B\uA74D\u0275"
}, {
  base: 'oi',
  letters: "\u01A3"
}, {
  base: 'ou',
  letters: "\u0223"
}, {
  base: 'oo',
  letters: "\uA74F"
}, {
  base: 'p',
  letters: "p\u24DF\uFF50\u1E55\u1E57\u01A5\u1D7D\uA751\uA753\uA755"
}, {
  base: 'q',
  letters: "q\u24E0\uFF51\u024B\uA757\uA759"
}, {
  base: 'r',
  letters: "r\u24E1\uFF52\u0155\u1E59\u0159\u0211\u0213\u1E5B\u1E5D\u0157\u1E5F\u024D\u027D\uA75B\uA7A7\uA783"
}, {
  base: 's',
  letters: "s\u24E2\uFF53\xDF\u015B\u1E65\u015D\u1E61\u0161\u1E67\u1E63\u1E69\u0219\u015F\u023F\uA7A9\uA785\u1E9B"
}, {
  base: 't',
  letters: "t\u24E3\uFF54\u1E6B\u1E97\u0165\u1E6D\u021B\u0163\u1E71\u1E6F\u0167\u01AD\u0288\u2C66\uA787"
}, {
  base: 'tz',
  letters: "\uA729"
}, {
  base: 'u',
  letters: "u\u24E4\uFF55\xF9\xFA\xFB\u0169\u1E79\u016B\u1E7B\u016D\xFC\u01DC\u01D8\u01D6\u01DA\u1EE7\u016F\u0171\u01D4\u0215\u0217\u01B0\u1EEB\u1EE9\u1EEF\u1EED\u1EF1\u1EE5\u1E73\u0173\u1E77\u1E75\u0289"
}, {
  base: 'v',
  letters: "v\u24E5\uFF56\u1E7D\u1E7F\u028B\uA75F\u028C"
}, {
  base: 'vy',
  letters: "\uA761"
}, {
  base: 'w',
  letters: "w\u24E6\uFF57\u1E81\u1E83\u0175\u1E87\u1E85\u1E98\u1E89\u2C73"
}, {
  base: 'x',
  letters: "x\u24E7\uFF58\u1E8B\u1E8D"
}, {
  base: 'y',
  letters: "y\u24E8\uFF59\u1EF3\xFD\u0177\u1EF9\u0233\u1E8F\xFF\u1EF7\u1E99\u1EF5\u01B4\u024F\u1EFF"
}, {
  base: 'z',
  letters: "z\u24E9\uFF5A\u017A\u1E91\u017C\u017E\u1E93\u1E95\u01B6\u0225\u0240\u2C6C\uA763"
}];
var anyDiacritic = new RegExp('[' + diacritics.map(function (d) {
  return d.letters;
}).join('') + ']', 'g');
var diacriticToBase = {};

for (var i = 0; i < diacritics.length; i++) {
  var diacritic = diacritics[i];

  for (var j = 0; j < diacritic.letters.length; j++) {
    diacriticToBase[diacritic.letters[j]] = diacritic.base;
  }
}

var stripDiacritics = function stripDiacritics(str) {
  return str.replace(anyDiacritic, function (match) {
    return diacriticToBase[match];
  });
};

var memoizedStripDiacriticsForInput = (0,memoize_one__WEBPACK_IMPORTED_MODULE_9__["default"])(stripDiacritics);

var trimString = function trimString(str) {
  return str.replace(/^\s+|\s+$/g, '');
};

var defaultStringify = function defaultStringify(option) {
  return "".concat(option.label, " ").concat(option.value);
};

var createFilter = function createFilter(config) {
  return function (option, rawInput) {
    // eslint-disable-next-line no-underscore-dangle
    if (option.data.__isNew__) return true;

    var _ignoreCase$ignoreAcc = (0,_index_a7690a33_esm_js__WEBPACK_IMPORTED_MODULE_8__.a)({
      ignoreCase: true,
      ignoreAccents: true,
      stringify: defaultStringify,
      trim: true,
      matchFrom: 'any'
    }, config),
        ignoreCase = _ignoreCase$ignoreAcc.ignoreCase,
        ignoreAccents = _ignoreCase$ignoreAcc.ignoreAccents,
        stringify = _ignoreCase$ignoreAcc.stringify,
        trim = _ignoreCase$ignoreAcc.trim,
        matchFrom = _ignoreCase$ignoreAcc.matchFrom;

    var input = trim ? trimString(rawInput) : rawInput;
    var candidate = trim ? trimString(stringify(option)) : stringify(option);

    if (ignoreCase) {
      input = input.toLowerCase();
      candidate = candidate.toLowerCase();
    }

    if (ignoreAccents) {
      input = memoizedStripDiacriticsForInput(input);
      candidate = stripDiacritics(candidate);
    }

    return matchFrom === 'start' ? candidate.substr(0, input.length) === input : candidate.indexOf(input) > -1;
  };
};

var _excluded = ["innerRef"];
function DummyInput(_ref) {
  var innerRef = _ref.innerRef,
      props = (0,_babel_runtime_helpers_esm_objectWithoutProperties__WEBPACK_IMPORTED_MODULE_6__["default"])(_ref, _excluded);

  // Remove animation props not meant for HTML elements
  var filteredProps = (0,_index_a7690a33_esm_js__WEBPACK_IMPORTED_MODULE_8__.r)(props, 'onExited', 'in', 'enter', 'exit', 'appear');
  return (0,_emotion_react__WEBPACK_IMPORTED_MODULE_7__.jsx)("input", (0,_babel_runtime_helpers_esm_extends__WEBPACK_IMPORTED_MODULE_0__["default"])({
    ref: innerRef
  }, filteredProps, {
    css: /*#__PURE__*/(0,_emotion_react__WEBPACK_IMPORTED_MODULE_7__.css)({
      label: 'dummyInput',
      // get rid of any default styles
      background: 0,
      border: 0,
      // important! this hides the flashing cursor
      caretColor: 'transparent',
      fontSize: 'inherit',
      gridArea: '1 / 1 / 2 / 3',
      outline: 0,
      padding: 0,
      // important! without `width` browsers won't allow focus
      width: 1,
      // remove cursor on desktop
      color: 'transparent',
      // remove cursor on mobile whilst maintaining "scroll into view" behaviour
      left: -100,
      opacity: 0,
      position: 'relative',
      transform: 'scale(.01)'
    },  false ? 0 : ";label:DummyInput;",  false ? 0 : "/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkR1bW15SW5wdXQudHN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQXlCTSIsImZpbGUiOiJEdW1teUlucHV0LnRzeCIsInNvdXJjZXNDb250ZW50IjpbIi8qKiBAanN4IGpzeCAqL1xuaW1wb3J0IHsgUmVmIH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IHsganN4IH0gZnJvbSAnQGVtb3Rpb24vcmVhY3QnO1xuaW1wb3J0IHsgcmVtb3ZlUHJvcHMgfSBmcm9tICcuLi91dGlscyc7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIER1bW15SW5wdXQoe1xuICBpbm5lclJlZixcbiAgLi4ucHJvcHNcbn06IEpTWC5JbnRyaW5zaWNFbGVtZW50c1snaW5wdXQnXSAmIHtcbiAgcmVhZG9ubHkgaW5uZXJSZWY6IFJlZjxIVE1MSW5wdXRFbGVtZW50Pjtcbn0pIHtcbiAgLy8gUmVtb3ZlIGFuaW1hdGlvbiBwcm9wcyBub3QgbWVhbnQgZm9yIEhUTUwgZWxlbWVudHNcbiAgY29uc3QgZmlsdGVyZWRQcm9wcyA9IHJlbW92ZVByb3BzKFxuICAgIHByb3BzLFxuICAgICdvbkV4aXRlZCcsXG4gICAgJ2luJyxcbiAgICAnZW50ZXInLFxuICAgICdleGl0JyxcbiAgICAnYXBwZWFyJ1xuICApO1xuXG4gIHJldHVybiAoXG4gICAgPGlucHV0XG4gICAgICByZWY9e2lubmVyUmVmfVxuICAgICAgey4uLmZpbHRlcmVkUHJvcHN9XG4gICAgICBjc3M9e3tcbiAgICAgICAgbGFiZWw6ICdkdW1teUlucHV0JyxcbiAgICAgICAgLy8gZ2V0IHJpZCBvZiBhbnkgZGVmYXVsdCBzdHlsZXNcbiAgICAgICAgYmFja2dyb3VuZDogMCxcbiAgICAgICAgYm9yZGVyOiAwLFxuICAgICAgICAvLyBpbXBvcnRhbnQhIHRoaXMgaGlkZXMgdGhlIGZsYXNoaW5nIGN1cnNvclxuICAgICAgICBjYXJldENvbG9yOiAndHJhbnNwYXJlbnQnLFxuICAgICAgICBmb250U2l6ZTogJ2luaGVyaXQnLFxuICAgICAgICBncmlkQXJlYTogJzEgLyAxIC8gMiAvIDMnLFxuICAgICAgICBvdXRsaW5lOiAwLFxuICAgICAgICBwYWRkaW5nOiAwLFxuICAgICAgICAvLyBpbXBvcnRhbnQhIHdpdGhvdXQgYHdpZHRoYCBicm93c2VycyB3b24ndCBhbGxvdyBmb2N1c1xuICAgICAgICB3aWR0aDogMSxcblxuICAgICAgICAvLyByZW1vdmUgY3Vyc29yIG9uIGRlc2t0b3BcbiAgICAgICAgY29sb3I6ICd0cmFuc3BhcmVudCcsXG5cbiAgICAgICAgLy8gcmVtb3ZlIGN1cnNvciBvbiBtb2JpbGUgd2hpbHN0IG1haW50YWluaW5nIFwic2Nyb2xsIGludG8gdmlld1wiIGJlaGF2aW91clxuICAgICAgICBsZWZ0OiAtMTAwLFxuICAgICAgICBvcGFjaXR5OiAwLFxuICAgICAgICBwb3NpdGlvbjogJ3JlbGF0aXZlJyxcbiAgICAgICAgdHJhbnNmb3JtOiAnc2NhbGUoLjAxKScsXG4gICAgICB9fVxuICAgIC8+XG4gICk7XG59XG4iXX0= */")
  }));
}

var cancelScroll = function cancelScroll(event) {
  event.preventDefault();
  event.stopPropagation();
};

function useScrollCapture(_ref) {
  var isEnabled = _ref.isEnabled,
      onBottomArrive = _ref.onBottomArrive,
      onBottomLeave = _ref.onBottomLeave,
      onTopArrive = _ref.onTopArrive,
      onTopLeave = _ref.onTopLeave;
  var isBottom = (0,react__WEBPACK_IMPORTED_MODULE_5__.useRef)(false);
  var isTop = (0,react__WEBPACK_IMPORTED_MODULE_5__.useRef)(false);
  var touchStart = (0,react__WEBPACK_IMPORTED_MODULE_5__.useRef)(0);
  var scrollTarget = (0,react__WEBPACK_IMPORTED_MODULE_5__.useRef)(null);
  var handleEventDelta = (0,react__WEBPACK_IMPORTED_MODULE_5__.useCallback)(function (event, delta) {
    if (scrollTarget.current === null) return;
    var _scrollTarget$current = scrollTarget.current,
        scrollTop = _scrollTarget$current.scrollTop,
        scrollHeight = _scrollTarget$current.scrollHeight,
        clientHeight = _scrollTarget$current.clientHeight;
    var target = scrollTarget.current;
    var isDeltaPositive = delta > 0;
    var availableScroll = scrollHeight - clientHeight - scrollTop;
    var shouldCancelScroll = false; // reset bottom/top flags

    if (availableScroll > delta && isBottom.current) {
      if (onBottomLeave) onBottomLeave(event);
      isBottom.current = false;
    }

    if (isDeltaPositive && isTop.current) {
      if (onTopLeave) onTopLeave(event);
      isTop.current = false;
    } // bottom limit


    if (isDeltaPositive && delta > availableScroll) {
      if (onBottomArrive && !isBottom.current) {
        onBottomArrive(event);
      }

      target.scrollTop = scrollHeight;
      shouldCancelScroll = true;
      isBottom.current = true; // top limit
    } else if (!isDeltaPositive && -delta > scrollTop) {
      if (onTopArrive && !isTop.current) {
        onTopArrive(event);
      }

      target.scrollTop = 0;
      shouldCancelScroll = true;
      isTop.current = true;
    } // cancel scroll


    if (shouldCancelScroll) {
      cancelScroll(event);
    }
  }, [onBottomArrive, onBottomLeave, onTopArrive, onTopLeave]);
  var onWheel = (0,react__WEBPACK_IMPORTED_MODULE_5__.useCallback)(function (event) {
    handleEventDelta(event, event.deltaY);
  }, [handleEventDelta]);
  var onTouchStart = (0,react__WEBPACK_IMPORTED_MODULE_5__.useCallback)(function (event) {
    // set touch start so we can calculate touchmove delta
    touchStart.current = event.changedTouches[0].clientY;
  }, []);
  var onTouchMove = (0,react__WEBPACK_IMPORTED_MODULE_5__.useCallback)(function (event) {
    var deltaY = touchStart.current - event.changedTouches[0].clientY;
    handleEventDelta(event, deltaY);
  }, [handleEventDelta]);
  var startListening = (0,react__WEBPACK_IMPORTED_MODULE_5__.useCallback)(function (el) {
    // bail early if no element is available to attach to
    if (!el) return;
    var notPassive = _index_a7690a33_esm_js__WEBPACK_IMPORTED_MODULE_8__.s ? {
      passive: false
    } : false;
    el.addEventListener('wheel', onWheel, notPassive);
    el.addEventListener('touchstart', onTouchStart, notPassive);
    el.addEventListener('touchmove', onTouchMove, notPassive);
  }, [onTouchMove, onTouchStart, onWheel]);
  var stopListening = (0,react__WEBPACK_IMPORTED_MODULE_5__.useCallback)(function (el) {
    // bail early if no element is available to detach from
    if (!el) return;
    el.removeEventListener('wheel', onWheel, false);
    el.removeEventListener('touchstart', onTouchStart, false);
    el.removeEventListener('touchmove', onTouchMove, false);
  }, [onTouchMove, onTouchStart, onWheel]);
  (0,react__WEBPACK_IMPORTED_MODULE_5__.useEffect)(function () {
    if (!isEnabled) return;
    var element = scrollTarget.current;
    startListening(element);
    return function () {
      stopListening(element);
    };
  }, [isEnabled, startListening, stopListening]);
  return function (element) {
    scrollTarget.current = element;
  };
}

var STYLE_KEYS = ['boxSizing', 'height', 'overflow', 'paddingRight', 'position'];
var LOCK_STYLES = {
  boxSizing: 'border-box',
  // account for possible declaration `width: 100%;` on body
  overflow: 'hidden',
  position: 'relative',
  height: '100%'
};

function preventTouchMove(e) {
  e.preventDefault();
}

function allowTouchMove(e) {
  e.stopPropagation();
}

function preventInertiaScroll() {
  var top = this.scrollTop;
  var totalScroll = this.scrollHeight;
  var currentScroll = top + this.offsetHeight;

  if (top === 0) {
    this.scrollTop = 1;
  } else if (currentScroll === totalScroll) {
    this.scrollTop = top - 1;
  }
} // `ontouchstart` check works on most browsers
// `maxTouchPoints` works on IE10/11 and Surface


function isTouchDevice() {
  return 'ontouchstart' in window || navigator.maxTouchPoints;
}

var canUseDOM = !!(typeof window !== 'undefined' && window.document && window.document.createElement);
var activeScrollLocks = 0;
var listenerOptions = {
  capture: false,
  passive: false
};
function useScrollLock(_ref) {
  var isEnabled = _ref.isEnabled,
      _ref$accountForScroll = _ref.accountForScrollbars,
      accountForScrollbars = _ref$accountForScroll === void 0 ? true : _ref$accountForScroll;
  var originalStyles = (0,react__WEBPACK_IMPORTED_MODULE_5__.useRef)({});
  var scrollTarget = (0,react__WEBPACK_IMPORTED_MODULE_5__.useRef)(null);
  var addScrollLock = (0,react__WEBPACK_IMPORTED_MODULE_5__.useCallback)(function (touchScrollTarget) {
    if (!canUseDOM) return;
    var target = document.body;
    var targetStyle = target && target.style;

    if (accountForScrollbars) {
      // store any styles already applied to the body
      STYLE_KEYS.forEach(function (key) {
        var val = targetStyle && targetStyle[key];
        originalStyles.current[key] = val;
      });
    } // apply the lock styles and padding if this is the first scroll lock


    if (accountForScrollbars && activeScrollLocks < 1) {
      var currentPadding = parseInt(originalStyles.current.paddingRight, 10) || 0;
      var clientWidth = document.body ? document.body.clientWidth : 0;
      var adjustedPadding = window.innerWidth - clientWidth + currentPadding || 0;
      Object.keys(LOCK_STYLES).forEach(function (key) {
        var val = LOCK_STYLES[key];

        if (targetStyle) {
          targetStyle[key] = val;
        }
      });

      if (targetStyle) {
        targetStyle.paddingRight = "".concat(adjustedPadding, "px");
      }
    } // account for touch devices


    if (target && isTouchDevice()) {
      // Mobile Safari ignores { overflow: hidden } declaration on the body.
      target.addEventListener('touchmove', preventTouchMove, listenerOptions); // Allow scroll on provided target

      if (touchScrollTarget) {
        touchScrollTarget.addEventListener('touchstart', preventInertiaScroll, listenerOptions);
        touchScrollTarget.addEventListener('touchmove', allowTouchMove, listenerOptions);
      }
    } // increment active scroll locks


    activeScrollLocks += 1;
  }, [accountForScrollbars]);
  var removeScrollLock = (0,react__WEBPACK_IMPORTED_MODULE_5__.useCallback)(function (touchScrollTarget) {
    if (!canUseDOM) return;
    var target = document.body;
    var targetStyle = target && target.style; // safely decrement active scroll locks

    activeScrollLocks = Math.max(activeScrollLocks - 1, 0); // reapply original body styles, if any

    if (accountForScrollbars && activeScrollLocks < 1) {
      STYLE_KEYS.forEach(function (key) {
        var val = originalStyles.current[key];

        if (targetStyle) {
          targetStyle[key] = val;
        }
      });
    } // remove touch listeners


    if (target && isTouchDevice()) {
      target.removeEventListener('touchmove', preventTouchMove, listenerOptions);

      if (touchScrollTarget) {
        touchScrollTarget.removeEventListener('touchstart', preventInertiaScroll, listenerOptions);
        touchScrollTarget.removeEventListener('touchmove', allowTouchMove, listenerOptions);
      }
    }
  }, [accountForScrollbars]);
  (0,react__WEBPACK_IMPORTED_MODULE_5__.useEffect)(function () {
    if (!isEnabled) return;
    var element = scrollTarget.current;
    addScrollLock(element);
    return function () {
      removeScrollLock(element);
    };
  }, [isEnabled, addScrollLock, removeScrollLock]);
  return function (element) {
    scrollTarget.current = element;
  };
}

function _EMOTION_STRINGIFIED_CSS_ERROR__() { return "You have tried to stringify object returned from `css` function. It isn't supposed to be used directly (e.g. as value of the `className` prop), but rather handed to emotion so it can handle it (e.g. as value of `css` prop)."; }

var blurSelectInput = function blurSelectInput() {
  return document.activeElement && document.activeElement.blur();
};

var _ref2 =  false ? 0 : {
  name: "bp8cua-ScrollManager",
  styles: "position:fixed;left:0;bottom:0;right:0;top:0;label:ScrollManager;",
  map: "/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlNjcm9sbE1hbmFnZXIudHN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQStDVSIsImZpbGUiOiJTY3JvbGxNYW5hZ2VyLnRzeCIsInNvdXJjZXNDb250ZW50IjpbIi8qKiBAanN4IGpzeCAqL1xuaW1wb3J0IHsganN4IH0gZnJvbSAnQGVtb3Rpb24vcmVhY3QnO1xuaW1wb3J0IHsgRnJhZ21lbnQsIFJlYWN0RWxlbWVudCwgUmVmQ2FsbGJhY2sgfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgdXNlU2Nyb2xsQ2FwdHVyZSBmcm9tICcuL3VzZVNjcm9sbENhcHR1cmUnO1xuaW1wb3J0IHVzZVNjcm9sbExvY2sgZnJvbSAnLi91c2VTY3JvbGxMb2NrJztcblxuaW50ZXJmYWNlIFByb3BzIHtcbiAgcmVhZG9ubHkgY2hpbGRyZW46IChyZWY6IFJlZkNhbGxiYWNrPEhUTUxFbGVtZW50PikgPT4gUmVhY3RFbGVtZW50O1xuICByZWFkb25seSBsb2NrRW5hYmxlZDogYm9vbGVhbjtcbiAgcmVhZG9ubHkgY2FwdHVyZUVuYWJsZWQ6IGJvb2xlYW47XG4gIHJlYWRvbmx5IG9uQm90dG9tQXJyaXZlPzogKGV2ZW50OiBXaGVlbEV2ZW50IHwgVG91Y2hFdmVudCkgPT4gdm9pZDtcbiAgcmVhZG9ubHkgb25Cb3R0b21MZWF2ZT86IChldmVudDogV2hlZWxFdmVudCB8IFRvdWNoRXZlbnQpID0+IHZvaWQ7XG4gIHJlYWRvbmx5IG9uVG9wQXJyaXZlPzogKGV2ZW50OiBXaGVlbEV2ZW50IHwgVG91Y2hFdmVudCkgPT4gdm9pZDtcbiAgcmVhZG9ubHkgb25Ub3BMZWF2ZT86IChldmVudDogV2hlZWxFdmVudCB8IFRvdWNoRXZlbnQpID0+IHZvaWQ7XG59XG5cbmNvbnN0IGJsdXJTZWxlY3RJbnB1dCA9ICgpID0+XG4gIGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQgJiYgKGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQgYXMgSFRNTEVsZW1lbnQpLmJsdXIoKTtcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gU2Nyb2xsTWFuYWdlcih7XG4gIGNoaWxkcmVuLFxuICBsb2NrRW5hYmxlZCxcbiAgY2FwdHVyZUVuYWJsZWQgPSB0cnVlLFxuICBvbkJvdHRvbUFycml2ZSxcbiAgb25Cb3R0b21MZWF2ZSxcbiAgb25Ub3BBcnJpdmUsXG4gIG9uVG9wTGVhdmUsXG59OiBQcm9wcykge1xuICBjb25zdCBzZXRTY3JvbGxDYXB0dXJlVGFyZ2V0ID0gdXNlU2Nyb2xsQ2FwdHVyZSh7XG4gICAgaXNFbmFibGVkOiBjYXB0dXJlRW5hYmxlZCxcbiAgICBvbkJvdHRvbUFycml2ZSxcbiAgICBvbkJvdHRvbUxlYXZlLFxuICAgIG9uVG9wQXJyaXZlLFxuICAgIG9uVG9wTGVhdmUsXG4gIH0pO1xuICBjb25zdCBzZXRTY3JvbGxMb2NrVGFyZ2V0ID0gdXNlU2Nyb2xsTG9jayh7IGlzRW5hYmxlZDogbG9ja0VuYWJsZWQgfSk7XG5cbiAgY29uc3QgdGFyZ2V0UmVmOiBSZWZDYWxsYmFjazxIVE1MRWxlbWVudD4gPSAoZWxlbWVudCkgPT4ge1xuICAgIHNldFNjcm9sbENhcHR1cmVUYXJnZXQoZWxlbWVudCk7XG4gICAgc2V0U2Nyb2xsTG9ja1RhcmdldChlbGVtZW50KTtcbiAgfTtcblxuICByZXR1cm4gKFxuICAgIDxGcmFnbWVudD5cbiAgICAgIHtsb2NrRW5hYmxlZCAmJiAoXG4gICAgICAgIDxkaXZcbiAgICAgICAgICBvbkNsaWNrPXtibHVyU2VsZWN0SW5wdXR9XG4gICAgICAgICAgY3NzPXt7IHBvc2l0aW9uOiAnZml4ZWQnLCBsZWZ0OiAwLCBib3R0b206IDAsIHJpZ2h0OiAwLCB0b3A6IDAgfX1cbiAgICAgICAgLz5cbiAgICAgICl9XG4gICAgICB7Y2hpbGRyZW4odGFyZ2V0UmVmKX1cbiAgICA8L0ZyYWdtZW50PlxuICApO1xufVxuIl19 */",
  toString: _EMOTION_STRINGIFIED_CSS_ERROR__
};

function ScrollManager(_ref) {
  var children = _ref.children,
      lockEnabled = _ref.lockEnabled,
      _ref$captureEnabled = _ref.captureEnabled,
      captureEnabled = _ref$captureEnabled === void 0 ? true : _ref$captureEnabled,
      onBottomArrive = _ref.onBottomArrive,
      onBottomLeave = _ref.onBottomLeave,
      onTopArrive = _ref.onTopArrive,
      onTopLeave = _ref.onTopLeave;
  var setScrollCaptureTarget = useScrollCapture({
    isEnabled: captureEnabled,
    onBottomArrive: onBottomArrive,
    onBottomLeave: onBottomLeave,
    onTopArrive: onTopArrive,
    onTopLeave: onTopLeave
  });
  var setScrollLockTarget = useScrollLock({
    isEnabled: lockEnabled
  });

  var targetRef = function targetRef(element) {
    setScrollCaptureTarget(element);
    setScrollLockTarget(element);
  };

  return (0,_emotion_react__WEBPACK_IMPORTED_MODULE_7__.jsx)(react__WEBPACK_IMPORTED_MODULE_5__.Fragment, null, lockEnabled && (0,_emotion_react__WEBPACK_IMPORTED_MODULE_7__.jsx)("div", {
    onClick: blurSelectInput,
    css: _ref2
  }), children(targetRef));
}

var formatGroupLabel = function formatGroupLabel(group) {
  return group.label;
};
var getOptionLabel$1 = function getOptionLabel(option) {
  return option.label;
};
var getOptionValue$1 = function getOptionValue(option) {
  return option.value;
};
var isOptionDisabled = function isOptionDisabled(option) {
  return !!option.isDisabled;
};

var defaultStyles = {
  clearIndicator: _index_a7690a33_esm_js__WEBPACK_IMPORTED_MODULE_8__.b,
  container: _index_a7690a33_esm_js__WEBPACK_IMPORTED_MODULE_8__.d,
  control: _index_a7690a33_esm_js__WEBPACK_IMPORTED_MODULE_8__.e,
  dropdownIndicator: _index_a7690a33_esm_js__WEBPACK_IMPORTED_MODULE_8__.f,
  group: _index_a7690a33_esm_js__WEBPACK_IMPORTED_MODULE_8__.g,
  groupHeading: _index_a7690a33_esm_js__WEBPACK_IMPORTED_MODULE_8__.h,
  indicatorsContainer: _index_a7690a33_esm_js__WEBPACK_IMPORTED_MODULE_8__.i,
  indicatorSeparator: _index_a7690a33_esm_js__WEBPACK_IMPORTED_MODULE_8__.j,
  input: _index_a7690a33_esm_js__WEBPACK_IMPORTED_MODULE_8__.k,
  loadingIndicator: _index_a7690a33_esm_js__WEBPACK_IMPORTED_MODULE_8__.l,
  loadingMessage: _index_a7690a33_esm_js__WEBPACK_IMPORTED_MODULE_8__.m,
  menu: _index_a7690a33_esm_js__WEBPACK_IMPORTED_MODULE_8__.n,
  menuList: _index_a7690a33_esm_js__WEBPACK_IMPORTED_MODULE_8__.o,
  menuPortal: _index_a7690a33_esm_js__WEBPACK_IMPORTED_MODULE_8__.p,
  multiValue: _index_a7690a33_esm_js__WEBPACK_IMPORTED_MODULE_8__.q,
  multiValueLabel: _index_a7690a33_esm_js__WEBPACK_IMPORTED_MODULE_8__.t,
  multiValueRemove: _index_a7690a33_esm_js__WEBPACK_IMPORTED_MODULE_8__.u,
  noOptionsMessage: _index_a7690a33_esm_js__WEBPACK_IMPORTED_MODULE_8__.v,
  option: _index_a7690a33_esm_js__WEBPACK_IMPORTED_MODULE_8__.w,
  placeholder: _index_a7690a33_esm_js__WEBPACK_IMPORTED_MODULE_8__.x,
  singleValue: _index_a7690a33_esm_js__WEBPACK_IMPORTED_MODULE_8__.y,
  valueContainer: _index_a7690a33_esm_js__WEBPACK_IMPORTED_MODULE_8__.z
}; // Merge Utility
// Allows consumers to extend a base Select with additional styles

function mergeStyles(source) {
  var target = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  // initialize with source styles
  var styles = (0,_index_a7690a33_esm_js__WEBPACK_IMPORTED_MODULE_8__.a)({}, source); // massage in target styles


  Object.keys(target).forEach(function (keyAsString) {
    var key = keyAsString;

    if (source[key]) {
      styles[key] = function (rsCss, props) {
        return target[key](source[key](rsCss, props), props);
      };
    } else {
      styles[key] = target[key];
    }
  });
  return styles;
}

var colors = {
  primary: '#2684FF',
  primary75: '#4C9AFF',
  primary50: '#B2D4FF',
  primary25: '#DEEBFF',
  danger: '#DE350B',
  dangerLight: '#FFBDAD',
  neutral0: 'hsl(0, 0%, 100%)',
  neutral5: 'hsl(0, 0%, 95%)',
  neutral10: 'hsl(0, 0%, 90%)',
  neutral20: 'hsl(0, 0%, 80%)',
  neutral30: 'hsl(0, 0%, 70%)',
  neutral40: 'hsl(0, 0%, 60%)',
  neutral50: 'hsl(0, 0%, 50%)',
  neutral60: 'hsl(0, 0%, 40%)',
  neutral70: 'hsl(0, 0%, 30%)',
  neutral80: 'hsl(0, 0%, 20%)',
  neutral90: 'hsl(0, 0%, 10%)'
};
var borderRadius = 4; // Used to calculate consistent margin/padding on elements

var baseUnit = 4; // The minimum height of the control

var controlHeight = 38; // The amount of space between the control and menu */

var menuGutter = baseUnit * 2;
var spacing = {
  baseUnit: baseUnit,
  controlHeight: controlHeight,
  menuGutter: menuGutter
};
var defaultTheme = {
  borderRadius: borderRadius,
  colors: colors,
  spacing: spacing
};

var defaultProps = {
  'aria-live': 'polite',
  backspaceRemovesValue: true,
  blurInputOnSelect: (0,_index_a7690a33_esm_js__WEBPACK_IMPORTED_MODULE_8__.A)(),
  captureMenuScroll: !(0,_index_a7690a33_esm_js__WEBPACK_IMPORTED_MODULE_8__.A)(),
  closeMenuOnSelect: true,
  closeMenuOnScroll: false,
  components: {},
  controlShouldRenderValue: true,
  escapeClearsValue: false,
  filterOption: createFilter(),
  formatGroupLabel: formatGroupLabel,
  getOptionLabel: getOptionLabel$1,
  getOptionValue: getOptionValue$1,
  isDisabled: false,
  isLoading: false,
  isMulti: false,
  isRtl: false,
  isSearchable: true,
  isOptionDisabled: isOptionDisabled,
  loadingMessage: function loadingMessage() {
    return 'Loading...';
  },
  maxMenuHeight: 300,
  minMenuHeight: 140,
  menuIsOpen: false,
  menuPlacement: 'bottom',
  menuPosition: 'absolute',
  menuShouldBlockScroll: false,
  menuShouldScrollIntoView: !(0,_index_a7690a33_esm_js__WEBPACK_IMPORTED_MODULE_8__.B)(),
  noOptionsMessage: function noOptionsMessage() {
    return 'No options';
  },
  openMenuOnFocus: false,
  openMenuOnClick: true,
  options: [],
  pageSize: 5,
  placeholder: 'Select...',
  screenReaderStatus: function screenReaderStatus(_ref) {
    var count = _ref.count;
    return "".concat(count, " result").concat(count !== 1 ? 's' : '', " available");
  },
  styles: {},
  tabIndex: 0,
  tabSelectsValue: true
};

function toCategorizedOption(props, option, selectValue, index) {
  var isDisabled = _isOptionDisabled(props, option, selectValue);

  var isSelected = _isOptionSelected(props, option, selectValue);

  var label = getOptionLabel(props, option);
  var value = getOptionValue(props, option);
  return {
    type: 'option',
    data: option,
    isDisabled: isDisabled,
    isSelected: isSelected,
    label: label,
    value: value,
    index: index
  };
}

function buildCategorizedOptions(props, selectValue) {
  return props.options.map(function (groupOrOption, groupOrOptionIndex) {
    if ('options' in groupOrOption) {
      var categorizedOptions = groupOrOption.options.map(function (option, optionIndex) {
        return toCategorizedOption(props, option, selectValue, optionIndex);
      }).filter(function (categorizedOption) {
        return isFocusable(props, categorizedOption);
      });
      return categorizedOptions.length > 0 ? {
        type: 'group',
        data: groupOrOption,
        options: categorizedOptions,
        index: groupOrOptionIndex
      } : undefined;
    }

    var categorizedOption = toCategorizedOption(props, groupOrOption, selectValue, groupOrOptionIndex);
    return isFocusable(props, categorizedOption) ? categorizedOption : undefined;
  }).filter(_index_a7690a33_esm_js__WEBPACK_IMPORTED_MODULE_8__.H);
}

function buildFocusableOptionsFromCategorizedOptions(categorizedOptions) {
  return categorizedOptions.reduce(function (optionsAccumulator, categorizedOption) {
    if (categorizedOption.type === 'group') {
      optionsAccumulator.push.apply(optionsAccumulator, (0,_babel_runtime_helpers_esm_toConsumableArray__WEBPACK_IMPORTED_MODULE_4__["default"])(categorizedOption.options.map(function (option) {
        return option.data;
      })));
    } else {
      optionsAccumulator.push(categorizedOption.data);
    }

    return optionsAccumulator;
  }, []);
}

function buildFocusableOptions(props, selectValue) {
  return buildFocusableOptionsFromCategorizedOptions(buildCategorizedOptions(props, selectValue));
}

function isFocusable(props, categorizedOption) {
  var _props$inputValue = props.inputValue,
      inputValue = _props$inputValue === void 0 ? '' : _props$inputValue;
  var data = categorizedOption.data,
      isSelected = categorizedOption.isSelected,
      label = categorizedOption.label,
      value = categorizedOption.value;
  return (!shouldHideSelectedOptions(props) || !isSelected) && _filterOption(props, {
    label: label,
    value: value,
    data: data
  }, inputValue);
}

function getNextFocusedValue(state, nextSelectValue) {
  var focusedValue = state.focusedValue,
      lastSelectValue = state.selectValue;
  var lastFocusedIndex = lastSelectValue.indexOf(focusedValue);

  if (lastFocusedIndex > -1) {
    var nextFocusedIndex = nextSelectValue.indexOf(focusedValue);

    if (nextFocusedIndex > -1) {
      // the focused value is still in the selectValue, return it
      return focusedValue;
    } else if (lastFocusedIndex < nextSelectValue.length) {
      // the focusedValue is not present in the next selectValue array by
      // reference, so return the new value at the same index
      return nextSelectValue[lastFocusedIndex];
    }
  }

  return null;
}

function getNextFocusedOption(state, options) {
  var lastFocusedOption = state.focusedOption;
  return lastFocusedOption && options.indexOf(lastFocusedOption) > -1 ? lastFocusedOption : options[0];
}

var getOptionLabel = function getOptionLabel(props, data) {
  return props.getOptionLabel(data);
};

var getOptionValue = function getOptionValue(props, data) {
  return props.getOptionValue(data);
};

function _isOptionDisabled(props, option, selectValue) {
  return typeof props.isOptionDisabled === 'function' ? props.isOptionDisabled(option, selectValue) : false;
}

function _isOptionSelected(props, option, selectValue) {
  if (selectValue.indexOf(option) > -1) return true;

  if (typeof props.isOptionSelected === 'function') {
    return props.isOptionSelected(option, selectValue);
  }

  var candidate = getOptionValue(props, option);
  return selectValue.some(function (i) {
    return getOptionValue(props, i) === candidate;
  });
}

function _filterOption(props, option, inputValue) {
  return props.filterOption ? props.filterOption(option, inputValue) : true;
}

var shouldHideSelectedOptions = function shouldHideSelectedOptions(props) {
  var hideSelectedOptions = props.hideSelectedOptions,
      isMulti = props.isMulti;
  if (hideSelectedOptions === undefined) return isMulti;
  return hideSelectedOptions;
};

var instanceId = 1;

var Select = /*#__PURE__*/function (_Component) {
  (0,_babel_runtime_helpers_esm_inherits__WEBPACK_IMPORTED_MODULE_3__["default"])(Select, _Component);

  var _super = (0,_index_a7690a33_esm_js__WEBPACK_IMPORTED_MODULE_8__._)(Select);

  // Misc. Instance Properties
  // ------------------------------
  // TODO
  // Refs
  // ------------------------------
  // Lifecycle
  // ------------------------------
  function Select(_props) {
    var _this;

    (0,_babel_runtime_helpers_esm_classCallCheck__WEBPACK_IMPORTED_MODULE_1__["default"])(this, Select);

    _this = _super.call(this, _props);
    _this.state = {
      ariaSelection: null,
      focusedOption: null,
      focusedValue: null,
      inputIsHidden: false,
      isFocused: false,
      selectValue: [],
      clearFocusValueOnUpdate: false,
      prevWasFocused: false,
      inputIsHiddenAfterUpdate: undefined,
      prevProps: undefined
    };
    _this.blockOptionHover = false;
    _this.isComposing = false;
    _this.commonProps = void 0;
    _this.initialTouchX = 0;
    _this.initialTouchY = 0;
    _this.instancePrefix = '';
    _this.openAfterFocus = false;
    _this.scrollToFocusedOptionOnUpdate = false;
    _this.userIsDragging = void 0;
    _this.controlRef = null;

    _this.getControlRef = function (ref) {
      _this.controlRef = ref;
    };

    _this.focusedOptionRef = null;

    _this.getFocusedOptionRef = function (ref) {
      _this.focusedOptionRef = ref;
    };

    _this.menuListRef = null;

    _this.getMenuListRef = function (ref) {
      _this.menuListRef = ref;
    };

    _this.inputRef = null;

    _this.getInputRef = function (ref) {
      _this.inputRef = ref;
    };

    _this.focus = _this.focusInput;
    _this.blur = _this.blurInput;

    _this.onChange = function (newValue, actionMeta) {
      var _this$props = _this.props,
          onChange = _this$props.onChange,
          name = _this$props.name;
      actionMeta.name = name;

      _this.ariaOnChange(newValue, actionMeta);

      onChange(newValue, actionMeta);
    };

    _this.setValue = function (newValue, action, option) {
      var _this$props2 = _this.props,
          closeMenuOnSelect = _this$props2.closeMenuOnSelect,
          isMulti = _this$props2.isMulti,
          inputValue = _this$props2.inputValue;

      _this.onInputChange('', {
        action: 'set-value',
        prevInputValue: inputValue
      });

      if (closeMenuOnSelect) {
        _this.setState({
          inputIsHiddenAfterUpdate: !isMulti
        });

        _this.onMenuClose();
      } // when the select value should change, we should reset focusedValue


      _this.setState({
        clearFocusValueOnUpdate: true
      });

      _this.onChange(newValue, {
        action: action,
        option: option
      });
    };

    _this.selectOption = function (newValue) {
      var _this$props3 = _this.props,
          blurInputOnSelect = _this$props3.blurInputOnSelect,
          isMulti = _this$props3.isMulti,
          name = _this$props3.name;
      var selectValue = _this.state.selectValue;

      var deselected = isMulti && _this.isOptionSelected(newValue, selectValue);

      var isDisabled = _this.isOptionDisabled(newValue, selectValue);

      if (deselected) {
        var candidate = _this.getOptionValue(newValue);

        _this.setValue((0,_index_a7690a33_esm_js__WEBPACK_IMPORTED_MODULE_8__.C)(selectValue.filter(function (i) {
          return _this.getOptionValue(i) !== candidate;
        })), 'deselect-option', newValue);
      } else if (!isDisabled) {
        // Select option if option is not disabled
        if (isMulti) {
          _this.setValue((0,_index_a7690a33_esm_js__WEBPACK_IMPORTED_MODULE_8__.C)([].concat((0,_babel_runtime_helpers_esm_toConsumableArray__WEBPACK_IMPORTED_MODULE_4__["default"])(selectValue), [newValue])), 'select-option', newValue);
        } else {
          _this.setValue((0,_index_a7690a33_esm_js__WEBPACK_IMPORTED_MODULE_8__.D)(newValue), 'select-option');
        }
      } else {
        _this.ariaOnChange((0,_index_a7690a33_esm_js__WEBPACK_IMPORTED_MODULE_8__.D)(newValue), {
          action: 'select-option',
          option: newValue,
          name: name
        });

        return;
      }

      if (blurInputOnSelect) {
        _this.blurInput();
      }
    };

    _this.removeValue = function (removedValue) {
      var isMulti = _this.props.isMulti;
      var selectValue = _this.state.selectValue;

      var candidate = _this.getOptionValue(removedValue);

      var newValueArray = selectValue.filter(function (i) {
        return _this.getOptionValue(i) !== candidate;
      });
      var newValue = (0,_index_a7690a33_esm_js__WEBPACK_IMPORTED_MODULE_8__.E)(isMulti, newValueArray, newValueArray[0] || null);

      _this.onChange(newValue, {
        action: 'remove-value',
        removedValue: removedValue
      });

      _this.focusInput();
    };

    _this.clearValue = function () {
      var selectValue = _this.state.selectValue;

      _this.onChange((0,_index_a7690a33_esm_js__WEBPACK_IMPORTED_MODULE_8__.E)(_this.props.isMulti, [], null), {
        action: 'clear',
        removedValues: selectValue
      });
    };

    _this.popValue = function () {
      var isMulti = _this.props.isMulti;
      var selectValue = _this.state.selectValue;
      var lastSelectedValue = selectValue[selectValue.length - 1];
      var newValueArray = selectValue.slice(0, selectValue.length - 1);
      var newValue = (0,_index_a7690a33_esm_js__WEBPACK_IMPORTED_MODULE_8__.E)(isMulti, newValueArray, newValueArray[0] || null);

      _this.onChange(newValue, {
        action: 'pop-value',
        removedValue: lastSelectedValue
      });
    };

    _this.getValue = function () {
      return _this.state.selectValue;
    };

    _this.cx = function () {
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      return _index_a7690a33_esm_js__WEBPACK_IMPORTED_MODULE_8__.F.apply(void 0, [_this.props.classNamePrefix].concat(args));
    };

    _this.getOptionLabel = function (data) {
      return getOptionLabel(_this.props, data);
    };

    _this.getOptionValue = function (data) {
      return getOptionValue(_this.props, data);
    };

    _this.getStyles = function (key, props) {
      var base = defaultStyles[key](props);
      base.boxSizing = 'border-box';
      var custom = _this.props.styles[key];
      return custom ? custom(base, props) : base;
    };

    _this.getElementId = function (element) {
      return "".concat(_this.instancePrefix, "-").concat(element);
    };

    _this.getComponents = function () {
      return (0,_index_a7690a33_esm_js__WEBPACK_IMPORTED_MODULE_8__.G)(_this.props);
    };

    _this.buildCategorizedOptions = function () {
      return buildCategorizedOptions(_this.props, _this.state.selectValue);
    };

    _this.getCategorizedOptions = function () {
      return _this.props.menuIsOpen ? _this.buildCategorizedOptions() : [];
    };

    _this.buildFocusableOptions = function () {
      return buildFocusableOptionsFromCategorizedOptions(_this.buildCategorizedOptions());
    };

    _this.getFocusableOptions = function () {
      return _this.props.menuIsOpen ? _this.buildFocusableOptions() : [];
    };

    _this.ariaOnChange = function (value, actionMeta) {
      _this.setState({
        ariaSelection: (0,_index_a7690a33_esm_js__WEBPACK_IMPORTED_MODULE_8__.a)({
          value: value
        }, actionMeta)
      });
    };

    _this.onMenuMouseDown = function (event) {
      if (event.button !== 0) {
        return;
      }

      event.stopPropagation();
      event.preventDefault();

      _this.focusInput();
    };

    _this.onMenuMouseMove = function (event) {
      _this.blockOptionHover = false;
    };

    _this.onControlMouseDown = function (event) {
      // Event captured by dropdown indicator
      if (event.defaultPrevented) {
        return;
      }

      var openMenuOnClick = _this.props.openMenuOnClick;

      if (!_this.state.isFocused) {
        if (openMenuOnClick) {
          _this.openAfterFocus = true;
        }

        _this.focusInput();
      } else if (!_this.props.menuIsOpen) {
        if (openMenuOnClick) {
          _this.openMenu('first');
        }
      } else {
        if (event.target.tagName !== 'INPUT' && event.target.tagName !== 'TEXTAREA') {
          _this.onMenuClose();
        }
      }

      if (event.target.tagName !== 'INPUT' && event.target.tagName !== 'TEXTAREA') {
        event.preventDefault();
      }
    };

    _this.onDropdownIndicatorMouseDown = function (event) {
      // ignore mouse events that weren't triggered by the primary button
      if (event && event.type === 'mousedown' && event.button !== 0) {
        return;
      }

      if (_this.props.isDisabled) return;
      var _this$props4 = _this.props,
          isMulti = _this$props4.isMulti,
          menuIsOpen = _this$props4.menuIsOpen;

      _this.focusInput();

      if (menuIsOpen) {
        _this.setState({
          inputIsHiddenAfterUpdate: !isMulti
        });

        _this.onMenuClose();
      } else {
        _this.openMenu('first');
      }

      event.preventDefault();
    };

    _this.onClearIndicatorMouseDown = function (event) {
      // ignore mouse events that weren't triggered by the primary button
      if (event && event.type === 'mousedown' && event.button !== 0) {
        return;
      }

      _this.clearValue();

      event.preventDefault();
      _this.openAfterFocus = false;

      if (event.type === 'touchend') {
        _this.focusInput();
      } else {
        setTimeout(function () {
          return _this.focusInput();
        });
      }
    };

    _this.onScroll = function (event) {
      if (typeof _this.props.closeMenuOnScroll === 'boolean') {
        if (event.target instanceof HTMLElement && (0,_index_a7690a33_esm_js__WEBPACK_IMPORTED_MODULE_8__.I)(event.target)) {
          _this.props.onMenuClose();
        }
      } else if (typeof _this.props.closeMenuOnScroll === 'function') {
        if (_this.props.closeMenuOnScroll(event)) {
          _this.props.onMenuClose();
        }
      }
    };

    _this.onCompositionStart = function () {
      _this.isComposing = true;
    };

    _this.onCompositionEnd = function () {
      _this.isComposing = false;
    };

    _this.onTouchStart = function (_ref2) {
      var touches = _ref2.touches;
      var touch = touches && touches.item(0);

      if (!touch) {
        return;
      }

      _this.initialTouchX = touch.clientX;
      _this.initialTouchY = touch.clientY;
      _this.userIsDragging = false;
    };

    _this.onTouchMove = function (_ref3) {
      var touches = _ref3.touches;
      var touch = touches && touches.item(0);

      if (!touch) {
        return;
      }

      var deltaX = Math.abs(touch.clientX - _this.initialTouchX);
      var deltaY = Math.abs(touch.clientY - _this.initialTouchY);
      var moveThreshold = 5;
      _this.userIsDragging = deltaX > moveThreshold || deltaY > moveThreshold;
    };

    _this.onTouchEnd = function (event) {
      if (_this.userIsDragging) return; // close the menu if the user taps outside
      // we're checking on event.target here instead of event.currentTarget, because we want to assert information
      // on events on child elements, not the document (which we've attached this handler to).

      if (_this.controlRef && !_this.controlRef.contains(event.target) && _this.menuListRef && !_this.menuListRef.contains(event.target)) {
        _this.blurInput();
      } // reset move vars


      _this.initialTouchX = 0;
      _this.initialTouchY = 0;
    };

    _this.onControlTouchEnd = function (event) {
      if (_this.userIsDragging) return;

      _this.onControlMouseDown(event);
    };

    _this.onClearIndicatorTouchEnd = function (event) {
      if (_this.userIsDragging) return;

      _this.onClearIndicatorMouseDown(event);
    };

    _this.onDropdownIndicatorTouchEnd = function (event) {
      if (_this.userIsDragging) return;

      _this.onDropdownIndicatorMouseDown(event);
    };

    _this.handleInputChange = function (event) {
      var prevInputValue = _this.props.inputValue;
      var inputValue = event.currentTarget.value;

      _this.setState({
        inputIsHiddenAfterUpdate: false
      });

      _this.onInputChange(inputValue, {
        action: 'input-change',
        prevInputValue: prevInputValue
      });

      if (!_this.props.menuIsOpen) {
        _this.onMenuOpen();
      }
    };

    _this.onInputFocus = function (event) {
      if (_this.props.onFocus) {
        _this.props.onFocus(event);
      }

      _this.setState({
        inputIsHiddenAfterUpdate: false,
        isFocused: true
      });

      if (_this.openAfterFocus || _this.props.openMenuOnFocus) {
        _this.openMenu('first');
      }

      _this.openAfterFocus = false;
    };

    _this.onInputBlur = function (event) {
      var prevInputValue = _this.props.inputValue;

      if (_this.menuListRef && _this.menuListRef.contains(document.activeElement)) {
        _this.inputRef.focus();

        return;
      }

      if (_this.props.onBlur) {
        _this.props.onBlur(event);
      }

      _this.onInputChange('', {
        action: 'input-blur',
        prevInputValue: prevInputValue
      });

      _this.onMenuClose();

      _this.setState({
        focusedValue: null,
        isFocused: false
      });
    };

    _this.onOptionHover = function (focusedOption) {
      if (_this.blockOptionHover || _this.state.focusedOption === focusedOption) {
        return;
      }

      _this.setState({
        focusedOption: focusedOption
      });
    };

    _this.shouldHideSelectedOptions = function () {
      return shouldHideSelectedOptions(_this.props);
    };

    _this.onKeyDown = function (event) {
      var _this$props5 = _this.props,
          isMulti = _this$props5.isMulti,
          backspaceRemovesValue = _this$props5.backspaceRemovesValue,
          escapeClearsValue = _this$props5.escapeClearsValue,
          inputValue = _this$props5.inputValue,
          isClearable = _this$props5.isClearable,
          isDisabled = _this$props5.isDisabled,
          menuIsOpen = _this$props5.menuIsOpen,
          onKeyDown = _this$props5.onKeyDown,
          tabSelectsValue = _this$props5.tabSelectsValue,
          openMenuOnFocus = _this$props5.openMenuOnFocus;
      var _this$state = _this.state,
          focusedOption = _this$state.focusedOption,
          focusedValue = _this$state.focusedValue,
          selectValue = _this$state.selectValue;
      if (isDisabled) return;

      if (typeof onKeyDown === 'function') {
        onKeyDown(event);

        if (event.defaultPrevented) {
          return;
        }
      } // Block option hover events when the user has just pressed a key


      _this.blockOptionHover = true;

      switch (event.key) {
        case 'ArrowLeft':
          if (!isMulti || inputValue) return;

          _this.focusValue('previous');

          break;

        case 'ArrowRight':
          if (!isMulti || inputValue) return;

          _this.focusValue('next');

          break;

        case 'Delete':
        case 'Backspace':
          if (inputValue) return;

          if (focusedValue) {
            _this.removeValue(focusedValue);
          } else {
            if (!backspaceRemovesValue) return;

            if (isMulti) {
              _this.popValue();
            } else if (isClearable) {
              _this.clearValue();
            }
          }

          break;

        case 'Tab':
          if (_this.isComposing) return;

          if (event.shiftKey || !menuIsOpen || !tabSelectsValue || !focusedOption || // don't capture the event if the menu opens on focus and the focused
          // option is already selected; it breaks the flow of navigation
          openMenuOnFocus && _this.isOptionSelected(focusedOption, selectValue)) {
            return;
          }

          _this.selectOption(focusedOption);

          break;

        case 'Enter':
          if (event.keyCode === 229) {
            // ignore the keydown event from an Input Method Editor(IME)
            // ref. https://www.w3.org/TR/uievents/#determine-keydown-keyup-keyCode
            break;
          }

          if (menuIsOpen) {
            if (!focusedOption) return;
            if (_this.isComposing) return;

            _this.selectOption(focusedOption);

            break;
          }

          return;

        case 'Escape':
          if (menuIsOpen) {
            _this.setState({
              inputIsHiddenAfterUpdate: false
            });

            _this.onInputChange('', {
              action: 'menu-close',
              prevInputValue: inputValue
            });

            _this.onMenuClose();
          } else if (isClearable && escapeClearsValue) {
            _this.clearValue();
          }

          break;

        case ' ':
          // space
          if (inputValue) {
            return;
          }

          if (!menuIsOpen) {
            _this.openMenu('first');

            break;
          }

          if (!focusedOption) return;

          _this.selectOption(focusedOption);

          break;

        case 'ArrowUp':
          if (menuIsOpen) {
            _this.focusOption('up');
          } else {
            _this.openMenu('last');
          }

          break;

        case 'ArrowDown':
          if (menuIsOpen) {
            _this.focusOption('down');
          } else {
            _this.openMenu('first');
          }

          break;

        case 'PageUp':
          if (!menuIsOpen) return;

          _this.focusOption('pageup');

          break;

        case 'PageDown':
          if (!menuIsOpen) return;

          _this.focusOption('pagedown');

          break;

        case 'Home':
          if (!menuIsOpen) return;

          _this.focusOption('first');

          break;

        case 'End':
          if (!menuIsOpen) return;

          _this.focusOption('last');

          break;

        default:
          return;
      }

      event.preventDefault();
    };

    _this.instancePrefix = 'react-select-' + (_this.props.instanceId || ++instanceId);
    _this.state.selectValue = (0,_index_a7690a33_esm_js__WEBPACK_IMPORTED_MODULE_8__.J)(_props.value);
    return _this;
  }

  (0,_babel_runtime_helpers_esm_createClass__WEBPACK_IMPORTED_MODULE_2__["default"])(Select, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      this.startListeningComposition();
      this.startListeningToTouch();

      if (this.props.closeMenuOnScroll && document && document.addEventListener) {
        // Listen to all scroll events, and filter them out inside of 'onScroll'
        document.addEventListener('scroll', this.onScroll, true);
      }

      if (this.props.autoFocus) {
        this.focusInput();
      }
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps) {
      var _this$props6 = this.props,
          isDisabled = _this$props6.isDisabled,
          menuIsOpen = _this$props6.menuIsOpen;
      var isFocused = this.state.isFocused;

      if ( // ensure focus is restored correctly when the control becomes enabled
      isFocused && !isDisabled && prevProps.isDisabled || // ensure focus is on the Input when the menu opens
      isFocused && menuIsOpen && !prevProps.menuIsOpen) {
        this.focusInput();
      }

      if (isFocused && isDisabled && !prevProps.isDisabled) {
        // ensure select state gets blurred in case Select is programmatically disabled while focused
        // eslint-disable-next-line react/no-did-update-set-state
        this.setState({
          isFocused: false
        }, this.onMenuClose);
      } // scroll the focused option into view if necessary


      if (this.menuListRef && this.focusedOptionRef && this.scrollToFocusedOptionOnUpdate) {
        (0,_index_a7690a33_esm_js__WEBPACK_IMPORTED_MODULE_8__.K)(this.menuListRef, this.focusedOptionRef);
        this.scrollToFocusedOptionOnUpdate = false;
      }
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      this.stopListeningComposition();
      this.stopListeningToTouch();
      document.removeEventListener('scroll', this.onScroll, true);
    } // ==============================
    // Consumer Handlers
    // ==============================

  }, {
    key: "onMenuOpen",
    value: function onMenuOpen() {
      this.props.onMenuOpen();
    }
  }, {
    key: "onMenuClose",
    value: function onMenuClose() {
      this.onInputChange('', {
        action: 'menu-close',
        prevInputValue: this.props.inputValue
      });
      this.props.onMenuClose();
    }
  }, {
    key: "onInputChange",
    value: function onInputChange(newValue, actionMeta) {
      this.props.onInputChange(newValue, actionMeta);
    } // ==============================
    // Methods
    // ==============================

  }, {
    key: "focusInput",
    value: function focusInput() {
      if (!this.inputRef) return;
      this.inputRef.focus();
    }
  }, {
    key: "blurInput",
    value: function blurInput() {
      if (!this.inputRef) return;
      this.inputRef.blur();
    } // aliased for consumers

  }, {
    key: "openMenu",
    value: function openMenu(focusOption) {
      var _this2 = this;

      var _this$state2 = this.state,
          selectValue = _this$state2.selectValue,
          isFocused = _this$state2.isFocused;
      var focusableOptions = this.buildFocusableOptions();
      var openAtIndex = focusOption === 'first' ? 0 : focusableOptions.length - 1;

      if (!this.props.isMulti) {
        var selectedIndex = focusableOptions.indexOf(selectValue[0]);

        if (selectedIndex > -1) {
          openAtIndex = selectedIndex;
        }
      } // only scroll if the menu isn't already open


      this.scrollToFocusedOptionOnUpdate = !(isFocused && this.menuListRef);
      this.setState({
        inputIsHiddenAfterUpdate: false,
        focusedValue: null,
        focusedOption: focusableOptions[openAtIndex]
      }, function () {
        return _this2.onMenuOpen();
      });
    }
  }, {
    key: "focusValue",
    value: function focusValue(direction) {
      var _this$state3 = this.state,
          selectValue = _this$state3.selectValue,
          focusedValue = _this$state3.focusedValue; // Only multiselects support value focusing

      if (!this.props.isMulti) return;
      this.setState({
        focusedOption: null
      });
      var focusedIndex = selectValue.indexOf(focusedValue);

      if (!focusedValue) {
        focusedIndex = -1;
      }

      var lastIndex = selectValue.length - 1;
      var nextFocus = -1;
      if (!selectValue.length) return;

      switch (direction) {
        case 'previous':
          if (focusedIndex === 0) {
            // don't cycle from the start to the end
            nextFocus = 0;
          } else if (focusedIndex === -1) {
            // if nothing is focused, focus the last value first
            nextFocus = lastIndex;
          } else {
            nextFocus = focusedIndex - 1;
          }

          break;

        case 'next':
          if (focusedIndex > -1 && focusedIndex < lastIndex) {
            nextFocus = focusedIndex + 1;
          }

          break;
      }

      this.setState({
        inputIsHidden: nextFocus !== -1,
        focusedValue: selectValue[nextFocus]
      });
    }
  }, {
    key: "focusOption",
    value: function focusOption() {
      var direction = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'first';
      var pageSize = this.props.pageSize;
      var focusedOption = this.state.focusedOption;
      var options = this.getFocusableOptions();
      if (!options.length) return;
      var nextFocus = 0; // handles 'first'

      var focusedIndex = options.indexOf(focusedOption);

      if (!focusedOption) {
        focusedIndex = -1;
      }

      if (direction === 'up') {
        nextFocus = focusedIndex > 0 ? focusedIndex - 1 : options.length - 1;
      } else if (direction === 'down') {
        nextFocus = (focusedIndex + 1) % options.length;
      } else if (direction === 'pageup') {
        nextFocus = focusedIndex - pageSize;
        if (nextFocus < 0) nextFocus = 0;
      } else if (direction === 'pagedown') {
        nextFocus = focusedIndex + pageSize;
        if (nextFocus > options.length - 1) nextFocus = options.length - 1;
      } else if (direction === 'last') {
        nextFocus = options.length - 1;
      }

      this.scrollToFocusedOptionOnUpdate = true;
      this.setState({
        focusedOption: options[nextFocus],
        focusedValue: null
      });
    }
  }, {
    key: "getTheme",
    value: // ==============================
    // Getters
    // ==============================
    function getTheme() {
      // Use the default theme if there are no customizations.
      if (!this.props.theme) {
        return defaultTheme;
      } // If the theme prop is a function, assume the function
      // knows how to merge the passed-in default theme with
      // its own modifications.


      if (typeof this.props.theme === 'function') {
        return this.props.theme(defaultTheme);
      } // Otherwise, if a plain theme object was passed in,
      // overlay it with the default theme.


      return (0,_index_a7690a33_esm_js__WEBPACK_IMPORTED_MODULE_8__.a)((0,_index_a7690a33_esm_js__WEBPACK_IMPORTED_MODULE_8__.a)({}, defaultTheme), this.props.theme);
    }
  }, {
    key: "getCommonProps",
    value: function getCommonProps() {
      var clearValue = this.clearValue,
          cx = this.cx,
          getStyles = this.getStyles,
          getValue = this.getValue,
          selectOption = this.selectOption,
          setValue = this.setValue,
          props = this.props;
      var isMulti = props.isMulti,
          isRtl = props.isRtl,
          options = props.options;
      var hasValue = this.hasValue();
      return {
        clearValue: clearValue,
        cx: cx,
        getStyles: getStyles,
        getValue: getValue,
        hasValue: hasValue,
        isMulti: isMulti,
        isRtl: isRtl,
        options: options,
        selectOption: selectOption,
        selectProps: props,
        setValue: setValue,
        theme: this.getTheme()
      };
    }
  }, {
    key: "hasValue",
    value: function hasValue() {
      var selectValue = this.state.selectValue;
      return selectValue.length > 0;
    }
  }, {
    key: "hasOptions",
    value: function hasOptions() {
      return !!this.getFocusableOptions().length;
    }
  }, {
    key: "isClearable",
    value: function isClearable() {
      var _this$props7 = this.props,
          isClearable = _this$props7.isClearable,
          isMulti = _this$props7.isMulti; // single select, by default, IS NOT clearable
      // multi select, by default, IS clearable

      if (isClearable === undefined) return isMulti;
      return isClearable;
    }
  }, {
    key: "isOptionDisabled",
    value: function isOptionDisabled(option, selectValue) {
      return _isOptionDisabled(this.props, option, selectValue);
    }
  }, {
    key: "isOptionSelected",
    value: function isOptionSelected(option, selectValue) {
      return _isOptionSelected(this.props, option, selectValue);
    }
  }, {
    key: "filterOption",
    value: function filterOption(option, inputValue) {
      return _filterOption(this.props, option, inputValue);
    }
  }, {
    key: "formatOptionLabel",
    value: function formatOptionLabel(data, context) {
      if (typeof this.props.formatOptionLabel === 'function') {
        var _inputValue = this.props.inputValue;
        var _selectValue = this.state.selectValue;
        return this.props.formatOptionLabel(data, {
          context: context,
          inputValue: _inputValue,
          selectValue: _selectValue
        });
      } else {
        return this.getOptionLabel(data);
      }
    }
  }, {
    key: "formatGroupLabel",
    value: function formatGroupLabel(data) {
      return this.props.formatGroupLabel(data);
    } // ==============================
    // Mouse Handlers
    // ==============================

  }, {
    key: "startListeningComposition",
    value: // ==============================
    // Composition Handlers
    // ==============================
    function startListeningComposition() {
      if (document && document.addEventListener) {
        document.addEventListener('compositionstart', this.onCompositionStart, false);
        document.addEventListener('compositionend', this.onCompositionEnd, false);
      }
    }
  }, {
    key: "stopListeningComposition",
    value: function stopListeningComposition() {
      if (document && document.removeEventListener) {
        document.removeEventListener('compositionstart', this.onCompositionStart);
        document.removeEventListener('compositionend', this.onCompositionEnd);
      }
    }
  }, {
    key: "startListeningToTouch",
    value: // ==============================
    // Touch Handlers
    // ==============================
    function startListeningToTouch() {
      if (document && document.addEventListener) {
        document.addEventListener('touchstart', this.onTouchStart, false);
        document.addEventListener('touchmove', this.onTouchMove, false);
        document.addEventListener('touchend', this.onTouchEnd, false);
      }
    }
  }, {
    key: "stopListeningToTouch",
    value: function stopListeningToTouch() {
      if (document && document.removeEventListener) {
        document.removeEventListener('touchstart', this.onTouchStart);
        document.removeEventListener('touchmove', this.onTouchMove);
        document.removeEventListener('touchend', this.onTouchEnd);
      }
    }
  }, {
    key: "renderInput",
    value: // ==============================
    // Renderers
    // ==============================
    function renderInput() {
      var _this$props8 = this.props,
          isDisabled = _this$props8.isDisabled,
          isSearchable = _this$props8.isSearchable,
          inputId = _this$props8.inputId,
          inputValue = _this$props8.inputValue,
          tabIndex = _this$props8.tabIndex,
          form = _this$props8.form,
          menuIsOpen = _this$props8.menuIsOpen;

      var _this$getComponents = this.getComponents(),
          Input = _this$getComponents.Input;

      var _this$state4 = this.state,
          inputIsHidden = _this$state4.inputIsHidden,
          ariaSelection = _this$state4.ariaSelection;
      var commonProps = this.commonProps;
      var id = inputId || this.getElementId('input'); // aria attributes makes the JSX "noisy", separated for clarity

      var ariaAttributes = (0,_index_a7690a33_esm_js__WEBPACK_IMPORTED_MODULE_8__.a)((0,_index_a7690a33_esm_js__WEBPACK_IMPORTED_MODULE_8__.a)((0,_index_a7690a33_esm_js__WEBPACK_IMPORTED_MODULE_8__.a)({
        'aria-autocomplete': 'list',
        'aria-expanded': menuIsOpen,
        'aria-haspopup': true,
        'aria-errormessage': this.props['aria-errormessage'],
        'aria-invalid': this.props['aria-invalid'],
        'aria-label': this.props['aria-label'],
        'aria-labelledby': this.props['aria-labelledby'],
        role: 'combobox'
      }, menuIsOpen && {
        'aria-controls': this.getElementId('listbox'),
        'aria-owns': this.getElementId('listbox')
      }), !isSearchable && {
        'aria-readonly': true
      }), this.hasValue() ? (ariaSelection === null || ariaSelection === void 0 ? void 0 : ariaSelection.action) === 'initial-input-focus' && {
        'aria-describedby': this.getElementId('live-region')
      } : {
        'aria-describedby': this.getElementId('placeholder')
      });

      if (!isSearchable) {
        // use a dummy input to maintain focus/blur functionality
        return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_5__.createElement(DummyInput, (0,_babel_runtime_helpers_esm_extends__WEBPACK_IMPORTED_MODULE_0__["default"])({
          id: id,
          innerRef: this.getInputRef,
          onBlur: this.onInputBlur,
          onChange: _index_a7690a33_esm_js__WEBPACK_IMPORTED_MODULE_8__.L,
          onFocus: this.onInputFocus,
          disabled: isDisabled,
          tabIndex: tabIndex,
          inputMode: "none",
          form: form,
          value: ""
        }, ariaAttributes));
      }

      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_5__.createElement(Input, (0,_babel_runtime_helpers_esm_extends__WEBPACK_IMPORTED_MODULE_0__["default"])({}, commonProps, {
        autoCapitalize: "none",
        autoComplete: "off",
        autoCorrect: "off",
        id: id,
        innerRef: this.getInputRef,
        isDisabled: isDisabled,
        isHidden: inputIsHidden,
        onBlur: this.onInputBlur,
        onChange: this.handleInputChange,
        onFocus: this.onInputFocus,
        spellCheck: "false",
        tabIndex: tabIndex,
        form: form,
        type: "text",
        value: inputValue
      }, ariaAttributes));
    }
  }, {
    key: "renderPlaceholderOrValue",
    value: function renderPlaceholderOrValue() {
      var _this3 = this;

      var _this$getComponents2 = this.getComponents(),
          MultiValue = _this$getComponents2.MultiValue,
          MultiValueContainer = _this$getComponents2.MultiValueContainer,
          MultiValueLabel = _this$getComponents2.MultiValueLabel,
          MultiValueRemove = _this$getComponents2.MultiValueRemove,
          SingleValue = _this$getComponents2.SingleValue,
          Placeholder = _this$getComponents2.Placeholder;

      var commonProps = this.commonProps;
      var _this$props9 = this.props,
          controlShouldRenderValue = _this$props9.controlShouldRenderValue,
          isDisabled = _this$props9.isDisabled,
          isMulti = _this$props9.isMulti,
          inputValue = _this$props9.inputValue,
          placeholder = _this$props9.placeholder;
      var _this$state5 = this.state,
          selectValue = _this$state5.selectValue,
          focusedValue = _this$state5.focusedValue,
          isFocused = _this$state5.isFocused;

      if (!this.hasValue() || !controlShouldRenderValue) {
        return inputValue ? null : /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_5__.createElement(Placeholder, (0,_babel_runtime_helpers_esm_extends__WEBPACK_IMPORTED_MODULE_0__["default"])({}, commonProps, {
          key: "placeholder",
          isDisabled: isDisabled,
          isFocused: isFocused,
          innerProps: {
            id: this.getElementId('placeholder')
          }
        }), placeholder);
      }

      if (isMulti) {
        return selectValue.map(function (opt, index) {
          var isOptionFocused = opt === focusedValue;
          var key = "".concat(_this3.getOptionLabel(opt), "-").concat(_this3.getOptionValue(opt));
          return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_5__.createElement(MultiValue, (0,_babel_runtime_helpers_esm_extends__WEBPACK_IMPORTED_MODULE_0__["default"])({}, commonProps, {
            components: {
              Container: MultiValueContainer,
              Label: MultiValueLabel,
              Remove: MultiValueRemove
            },
            isFocused: isOptionFocused,
            isDisabled: isDisabled,
            key: key,
            index: index,
            removeProps: {
              onClick: function onClick() {
                return _this3.removeValue(opt);
              },
              onTouchEnd: function onTouchEnd() {
                return _this3.removeValue(opt);
              },
              onMouseDown: function onMouseDown(e) {
                e.preventDefault();
              }
            },
            data: opt
          }), _this3.formatOptionLabel(opt, 'value'));
        });
      }

      if (inputValue) {
        return null;
      }

      var singleValue = selectValue[0];
      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_5__.createElement(SingleValue, (0,_babel_runtime_helpers_esm_extends__WEBPACK_IMPORTED_MODULE_0__["default"])({}, commonProps, {
        data: singleValue,
        isDisabled: isDisabled
      }), this.formatOptionLabel(singleValue, 'value'));
    }
  }, {
    key: "renderClearIndicator",
    value: function renderClearIndicator() {
      var _this$getComponents3 = this.getComponents(),
          ClearIndicator = _this$getComponents3.ClearIndicator;

      var commonProps = this.commonProps;
      var _this$props10 = this.props,
          isDisabled = _this$props10.isDisabled,
          isLoading = _this$props10.isLoading;
      var isFocused = this.state.isFocused;

      if (!this.isClearable() || !ClearIndicator || isDisabled || !this.hasValue() || isLoading) {
        return null;
      }

      var innerProps = {
        onMouseDown: this.onClearIndicatorMouseDown,
        onTouchEnd: this.onClearIndicatorTouchEnd,
        'aria-hidden': 'true'
      };
      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_5__.createElement(ClearIndicator, (0,_babel_runtime_helpers_esm_extends__WEBPACK_IMPORTED_MODULE_0__["default"])({}, commonProps, {
        innerProps: innerProps,
        isFocused: isFocused
      }));
    }
  }, {
    key: "renderLoadingIndicator",
    value: function renderLoadingIndicator() {
      var _this$getComponents4 = this.getComponents(),
          LoadingIndicator = _this$getComponents4.LoadingIndicator;

      var commonProps = this.commonProps;
      var _this$props11 = this.props,
          isDisabled = _this$props11.isDisabled,
          isLoading = _this$props11.isLoading;
      var isFocused = this.state.isFocused;
      if (!LoadingIndicator || !isLoading) return null;
      var innerProps = {
        'aria-hidden': 'true'
      };
      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_5__.createElement(LoadingIndicator, (0,_babel_runtime_helpers_esm_extends__WEBPACK_IMPORTED_MODULE_0__["default"])({}, commonProps, {
        innerProps: innerProps,
        isDisabled: isDisabled,
        isFocused: isFocused
      }));
    }
  }, {
    key: "renderIndicatorSeparator",
    value: function renderIndicatorSeparator() {
      var _this$getComponents5 = this.getComponents(),
          DropdownIndicator = _this$getComponents5.DropdownIndicator,
          IndicatorSeparator = _this$getComponents5.IndicatorSeparator; // separator doesn't make sense without the dropdown indicator


      if (!DropdownIndicator || !IndicatorSeparator) return null;
      var commonProps = this.commonProps;
      var isDisabled = this.props.isDisabled;
      var isFocused = this.state.isFocused;
      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_5__.createElement(IndicatorSeparator, (0,_babel_runtime_helpers_esm_extends__WEBPACK_IMPORTED_MODULE_0__["default"])({}, commonProps, {
        isDisabled: isDisabled,
        isFocused: isFocused
      }));
    }
  }, {
    key: "renderDropdownIndicator",
    value: function renderDropdownIndicator() {
      var _this$getComponents6 = this.getComponents(),
          DropdownIndicator = _this$getComponents6.DropdownIndicator;

      if (!DropdownIndicator) return null;
      var commonProps = this.commonProps;
      var isDisabled = this.props.isDisabled;
      var isFocused = this.state.isFocused;
      var innerProps = {
        onMouseDown: this.onDropdownIndicatorMouseDown,
        onTouchEnd: this.onDropdownIndicatorTouchEnd,
        'aria-hidden': 'true'
      };
      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_5__.createElement(DropdownIndicator, (0,_babel_runtime_helpers_esm_extends__WEBPACK_IMPORTED_MODULE_0__["default"])({}, commonProps, {
        innerProps: innerProps,
        isDisabled: isDisabled,
        isFocused: isFocused
      }));
    }
  }, {
    key: "renderMenu",
    value: function renderMenu() {
      var _this4 = this;

      var _this$getComponents7 = this.getComponents(),
          Group = _this$getComponents7.Group,
          GroupHeading = _this$getComponents7.GroupHeading,
          Menu = _this$getComponents7.Menu,
          MenuList = _this$getComponents7.MenuList,
          MenuPortal = _this$getComponents7.MenuPortal,
          LoadingMessage = _this$getComponents7.LoadingMessage,
          NoOptionsMessage = _this$getComponents7.NoOptionsMessage,
          Option = _this$getComponents7.Option;

      var commonProps = this.commonProps;
      var focusedOption = this.state.focusedOption;
      var _this$props12 = this.props,
          captureMenuScroll = _this$props12.captureMenuScroll,
          inputValue = _this$props12.inputValue,
          isLoading = _this$props12.isLoading,
          loadingMessage = _this$props12.loadingMessage,
          minMenuHeight = _this$props12.minMenuHeight,
          maxMenuHeight = _this$props12.maxMenuHeight,
          menuIsOpen = _this$props12.menuIsOpen,
          menuPlacement = _this$props12.menuPlacement,
          menuPosition = _this$props12.menuPosition,
          menuPortalTarget = _this$props12.menuPortalTarget,
          menuShouldBlockScroll = _this$props12.menuShouldBlockScroll,
          menuShouldScrollIntoView = _this$props12.menuShouldScrollIntoView,
          noOptionsMessage = _this$props12.noOptionsMessage,
          onMenuScrollToTop = _this$props12.onMenuScrollToTop,
          onMenuScrollToBottom = _this$props12.onMenuScrollToBottom;
      if (!menuIsOpen) return null; // TODO: Internal Option Type here

      var render = function render(props, id) {
        var type = props.type,
            data = props.data,
            isDisabled = props.isDisabled,
            isSelected = props.isSelected,
            label = props.label,
            value = props.value;
        var isFocused = focusedOption === data;
        var onHover = isDisabled ? undefined : function () {
          return _this4.onOptionHover(data);
        };
        var onSelect = isDisabled ? undefined : function () {
          return _this4.selectOption(data);
        };
        var optionId = "".concat(_this4.getElementId('option'), "-").concat(id);
        var innerProps = {
          id: optionId,
          onClick: onSelect,
          onMouseMove: onHover,
          onMouseOver: onHover,
          tabIndex: -1
        };
        return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_5__.createElement(Option, (0,_babel_runtime_helpers_esm_extends__WEBPACK_IMPORTED_MODULE_0__["default"])({}, commonProps, {
          innerProps: innerProps,
          data: data,
          isDisabled: isDisabled,
          isSelected: isSelected,
          key: optionId,
          label: label,
          type: type,
          value: value,
          isFocused: isFocused,
          innerRef: isFocused ? _this4.getFocusedOptionRef : undefined
        }), _this4.formatOptionLabel(props.data, 'menu'));
      };

      var menuUI;

      if (this.hasOptions()) {
        menuUI = this.getCategorizedOptions().map(function (item) {
          if (item.type === 'group') {
            var _data = item.data,
                options = item.options,
                groupIndex = item.index;
            var groupId = "".concat(_this4.getElementId('group'), "-").concat(groupIndex);
            var headingId = "".concat(groupId, "-heading");
            return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_5__.createElement(Group, (0,_babel_runtime_helpers_esm_extends__WEBPACK_IMPORTED_MODULE_0__["default"])({}, commonProps, {
              key: groupId,
              data: _data,
              options: options,
              Heading: GroupHeading,
              headingProps: {
                id: headingId,
                data: item.data
              },
              label: _this4.formatGroupLabel(item.data)
            }), item.options.map(function (option) {
              return render(option, "".concat(groupIndex, "-").concat(option.index));
            }));
          } else if (item.type === 'option') {
            return render(item, "".concat(item.index));
          }
        });
      } else if (isLoading) {
        var message = loadingMessage({
          inputValue: inputValue
        });
        if (message === null) return null;
        menuUI = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_5__.createElement(LoadingMessage, commonProps, message);
      } else {
        var _message = noOptionsMessage({
          inputValue: inputValue
        });

        if (_message === null) return null;
        menuUI = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_5__.createElement(NoOptionsMessage, commonProps, _message);
      }

      var menuPlacementProps = {
        minMenuHeight: minMenuHeight,
        maxMenuHeight: maxMenuHeight,
        menuPlacement: menuPlacement,
        menuPosition: menuPosition,
        menuShouldScrollIntoView: menuShouldScrollIntoView
      };
      var menuElement = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_5__.createElement(_index_a7690a33_esm_js__WEBPACK_IMPORTED_MODULE_8__.M, (0,_babel_runtime_helpers_esm_extends__WEBPACK_IMPORTED_MODULE_0__["default"])({}, commonProps, menuPlacementProps), function (_ref4) {
        var ref = _ref4.ref,
            _ref4$placerProps = _ref4.placerProps,
            placement = _ref4$placerProps.placement,
            maxHeight = _ref4$placerProps.maxHeight;
        return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_5__.createElement(Menu, (0,_babel_runtime_helpers_esm_extends__WEBPACK_IMPORTED_MODULE_0__["default"])({}, commonProps, menuPlacementProps, {
          innerRef: ref,
          innerProps: {
            onMouseDown: _this4.onMenuMouseDown,
            onMouseMove: _this4.onMenuMouseMove,
            id: _this4.getElementId('listbox')
          },
          isLoading: isLoading,
          placement: placement
        }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_5__.createElement(ScrollManager, {
          captureEnabled: captureMenuScroll,
          onTopArrive: onMenuScrollToTop,
          onBottomArrive: onMenuScrollToBottom,
          lockEnabled: menuShouldBlockScroll
        }, function (scrollTargetRef) {
          return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_5__.createElement(MenuList, (0,_babel_runtime_helpers_esm_extends__WEBPACK_IMPORTED_MODULE_0__["default"])({}, commonProps, {
            innerRef: function innerRef(instance) {
              _this4.getMenuListRef(instance);

              scrollTargetRef(instance);
            },
            isLoading: isLoading,
            maxHeight: maxHeight,
            focusedOption: focusedOption
          }), menuUI);
        }));
      }); // positioning behaviour is almost identical for portalled and fixed,
      // so we use the same component. the actual portalling logic is forked
      // within the component based on `menuPosition`

      return menuPortalTarget || menuPosition === 'fixed' ? /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_5__.createElement(MenuPortal, (0,_babel_runtime_helpers_esm_extends__WEBPACK_IMPORTED_MODULE_0__["default"])({}, commonProps, {
        appendTo: menuPortalTarget,
        controlElement: this.controlRef,
        menuPlacement: menuPlacement,
        menuPosition: menuPosition
      }), menuElement) : menuElement;
    }
  }, {
    key: "renderFormField",
    value: function renderFormField() {
      var _this5 = this;

      var _this$props13 = this.props,
          delimiter = _this$props13.delimiter,
          isDisabled = _this$props13.isDisabled,
          isMulti = _this$props13.isMulti,
          name = _this$props13.name;
      var selectValue = this.state.selectValue;
      if (!name || isDisabled) return;

      if (isMulti) {
        if (delimiter) {
          var value = selectValue.map(function (opt) {
            return _this5.getOptionValue(opt);
          }).join(delimiter);
          return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_5__.createElement("input", {
            name: name,
            type: "hidden",
            value: value
          });
        } else {
          var input = selectValue.length > 0 ? selectValue.map(function (opt, i) {
            return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_5__.createElement("input", {
              key: "i-".concat(i),
              name: name,
              type: "hidden",
              value: _this5.getOptionValue(opt)
            });
          }) : /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_5__.createElement("input", {
            name: name,
            type: "hidden"
          });
          return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_5__.createElement("div", null, input);
        }
      } else {
        var _value = selectValue[0] ? this.getOptionValue(selectValue[0]) : '';

        return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_5__.createElement("input", {
          name: name,
          type: "hidden",
          value: _value
        });
      }
    }
  }, {
    key: "renderLiveRegion",
    value: function renderLiveRegion() {
      var commonProps = this.commonProps;
      var _this$state6 = this.state,
          ariaSelection = _this$state6.ariaSelection,
          focusedOption = _this$state6.focusedOption,
          focusedValue = _this$state6.focusedValue,
          isFocused = _this$state6.isFocused,
          selectValue = _this$state6.selectValue;
      var focusableOptions = this.getFocusableOptions();
      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_5__.createElement(LiveRegion, (0,_babel_runtime_helpers_esm_extends__WEBPACK_IMPORTED_MODULE_0__["default"])({}, commonProps, {
        id: this.getElementId('live-region'),
        ariaSelection: ariaSelection,
        focusedOption: focusedOption,
        focusedValue: focusedValue,
        isFocused: isFocused,
        selectValue: selectValue,
        focusableOptions: focusableOptions
      }));
    }
  }, {
    key: "render",
    value: function render() {
      var _this$getComponents8 = this.getComponents(),
          Control = _this$getComponents8.Control,
          IndicatorsContainer = _this$getComponents8.IndicatorsContainer,
          SelectContainer = _this$getComponents8.SelectContainer,
          ValueContainer = _this$getComponents8.ValueContainer;

      var _this$props14 = this.props,
          className = _this$props14.className,
          id = _this$props14.id,
          isDisabled = _this$props14.isDisabled,
          menuIsOpen = _this$props14.menuIsOpen;
      var isFocused = this.state.isFocused;
      var commonProps = this.commonProps = this.getCommonProps();
      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_5__.createElement(SelectContainer, (0,_babel_runtime_helpers_esm_extends__WEBPACK_IMPORTED_MODULE_0__["default"])({}, commonProps, {
        className: className,
        innerProps: {
          id: id,
          onKeyDown: this.onKeyDown
        },
        isDisabled: isDisabled,
        isFocused: isFocused
      }), this.renderLiveRegion(), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_5__.createElement(Control, (0,_babel_runtime_helpers_esm_extends__WEBPACK_IMPORTED_MODULE_0__["default"])({}, commonProps, {
        innerRef: this.getControlRef,
        innerProps: {
          onMouseDown: this.onControlMouseDown,
          onTouchEnd: this.onControlTouchEnd
        },
        isDisabled: isDisabled,
        isFocused: isFocused,
        menuIsOpen: menuIsOpen
      }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_5__.createElement(ValueContainer, (0,_babel_runtime_helpers_esm_extends__WEBPACK_IMPORTED_MODULE_0__["default"])({}, commonProps, {
        isDisabled: isDisabled
      }), this.renderPlaceholderOrValue(), this.renderInput()), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_5__.createElement(IndicatorsContainer, (0,_babel_runtime_helpers_esm_extends__WEBPACK_IMPORTED_MODULE_0__["default"])({}, commonProps, {
        isDisabled: isDisabled
      }), this.renderClearIndicator(), this.renderLoadingIndicator(), this.renderIndicatorSeparator(), this.renderDropdownIndicator())), this.renderMenu(), this.renderFormField());
    }
  }], [{
    key: "getDerivedStateFromProps",
    value: function getDerivedStateFromProps(props, state) {
      var prevProps = state.prevProps,
          clearFocusValueOnUpdate = state.clearFocusValueOnUpdate,
          inputIsHiddenAfterUpdate = state.inputIsHiddenAfterUpdate,
          ariaSelection = state.ariaSelection,
          isFocused = state.isFocused,
          prevWasFocused = state.prevWasFocused;
      var options = props.options,
          value = props.value,
          menuIsOpen = props.menuIsOpen,
          inputValue = props.inputValue,
          isMulti = props.isMulti;
      var selectValue = (0,_index_a7690a33_esm_js__WEBPACK_IMPORTED_MODULE_8__.J)(value);
      var newMenuOptionsState = {};

      if (prevProps && (value !== prevProps.value || options !== prevProps.options || menuIsOpen !== prevProps.menuIsOpen || inputValue !== prevProps.inputValue)) {
        var focusableOptions = menuIsOpen ? buildFocusableOptions(props, selectValue) : [];
        var focusedValue = clearFocusValueOnUpdate ? getNextFocusedValue(state, selectValue) : null;
        var focusedOption = getNextFocusedOption(state, focusableOptions);
        newMenuOptionsState = {
          selectValue: selectValue,
          focusedOption: focusedOption,
          focusedValue: focusedValue,
          clearFocusValueOnUpdate: false
        };
      } // some updates should toggle the state of the input visibility


      var newInputIsHiddenState = inputIsHiddenAfterUpdate != null && props !== prevProps ? {
        inputIsHidden: inputIsHiddenAfterUpdate,
        inputIsHiddenAfterUpdate: undefined
      } : {};
      var newAriaSelection = ariaSelection;
      var hasKeptFocus = isFocused && prevWasFocused;

      if (isFocused && !hasKeptFocus) {
        // If `value` or `defaultValue` props are not empty then announce them
        // when the Select is initially focused
        newAriaSelection = {
          value: (0,_index_a7690a33_esm_js__WEBPACK_IMPORTED_MODULE_8__.E)(isMulti, selectValue, selectValue[0] || null),
          options: selectValue,
          action: 'initial-input-focus'
        };
        hasKeptFocus = !prevWasFocused;
      } // If the 'initial-input-focus' action has been set already
      // then reset the ariaSelection to null


      if ((ariaSelection === null || ariaSelection === void 0 ? void 0 : ariaSelection.action) === 'initial-input-focus') {
        newAriaSelection = null;
      }

      return (0,_index_a7690a33_esm_js__WEBPACK_IMPORTED_MODULE_8__.a)((0,_index_a7690a33_esm_js__WEBPACK_IMPORTED_MODULE_8__.a)((0,_index_a7690a33_esm_js__WEBPACK_IMPORTED_MODULE_8__.a)({}, newMenuOptionsState), newInputIsHiddenState), {}, {
        prevProps: props,
        ariaSelection: newAriaSelection,
        prevWasFocused: hasKeptFocus
      });
    }
  }]);

  return Select;
}(react__WEBPACK_IMPORTED_MODULE_5__.Component);

Select.defaultProps = defaultProps;




/***/ }),

/***/ "./node_modules/react-select/dist/index-a7690a33.esm.js":
/*!**************************************************************!*\
  !*** ./node_modules/react-select/dist/index-a7690a33.esm.js ***!
  \**************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "A": function() { return /* binding */ isTouchCapable; },
/* harmony export */   "B": function() { return /* binding */ isMobileDevice; },
/* harmony export */   "C": function() { return /* binding */ multiValueAsValue; },
/* harmony export */   "D": function() { return /* binding */ singleValueAsValue; },
/* harmony export */   "E": function() { return /* binding */ valueTernary; },
/* harmony export */   "F": function() { return /* binding */ classNames; },
/* harmony export */   "G": function() { return /* binding */ defaultComponents; },
/* harmony export */   "H": function() { return /* binding */ notNullish; },
/* harmony export */   "I": function() { return /* binding */ isDocumentElement; },
/* harmony export */   "J": function() { return /* binding */ cleanValue; },
/* harmony export */   "K": function() { return /* binding */ scrollIntoView; },
/* harmony export */   "L": function() { return /* binding */ noop; },
/* harmony export */   "M": function() { return /* binding */ MenuPlacer; },
/* harmony export */   "N": function() { return /* binding */ handleInputChange; },
/* harmony export */   "_": function() { return /* binding */ _createSuper; },
/* harmony export */   "a": function() { return /* binding */ _objectSpread2; },
/* harmony export */   "b": function() { return /* binding */ clearIndicatorCSS; },
/* harmony export */   "c": function() { return /* binding */ components; },
/* harmony export */   "d": function() { return /* binding */ containerCSS; },
/* harmony export */   "e": function() { return /* binding */ css$1; },
/* harmony export */   "f": function() { return /* binding */ dropdownIndicatorCSS; },
/* harmony export */   "g": function() { return /* binding */ groupCSS; },
/* harmony export */   "h": function() { return /* binding */ groupHeadingCSS; },
/* harmony export */   "i": function() { return /* binding */ indicatorsContainerCSS; },
/* harmony export */   "j": function() { return /* binding */ indicatorSeparatorCSS; },
/* harmony export */   "k": function() { return /* binding */ inputCSS; },
/* harmony export */   "l": function() { return /* binding */ loadingIndicatorCSS; },
/* harmony export */   "m": function() { return /* binding */ loadingMessageCSS; },
/* harmony export */   "n": function() { return /* binding */ menuCSS; },
/* harmony export */   "o": function() { return /* binding */ menuListCSS; },
/* harmony export */   "p": function() { return /* binding */ menuPortalCSS; },
/* harmony export */   "q": function() { return /* binding */ multiValueCSS; },
/* harmony export */   "r": function() { return /* binding */ removeProps; },
/* harmony export */   "s": function() { return /* binding */ supportsPassiveEvents; },
/* harmony export */   "t": function() { return /* binding */ multiValueLabelCSS; },
/* harmony export */   "u": function() { return /* binding */ multiValueRemoveCSS; },
/* harmony export */   "v": function() { return /* binding */ noOptionsMessageCSS; },
/* harmony export */   "w": function() { return /* binding */ optionCSS; },
/* harmony export */   "x": function() { return /* binding */ placeholderCSS; },
/* harmony export */   "y": function() { return /* binding */ css; },
/* harmony export */   "z": function() { return /* binding */ valueContainerCSS; }
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_esm_extends__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/esm/extends */ "./node_modules/@babel/runtime/helpers/esm/extends.js");
/* harmony import */ var _emotion_react__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @emotion/react */ "./node_modules/@emotion/react/dist/emotion-react.browser.esm.js");
/* harmony import */ var _babel_runtime_helpers_esm_taggedTemplateLiteral__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @babel/runtime/helpers/esm/taggedTemplateLiteral */ "./node_modules/@babel/runtime/helpers/esm/taggedTemplateLiteral.js");
/* harmony import */ var _babel_runtime_helpers_esm_objectWithoutProperties__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @babel/runtime/helpers/esm/objectWithoutProperties */ "./node_modules/@babel/runtime/helpers/esm/objectWithoutProperties.js");
/* harmony import */ var _babel_runtime_helpers_esm_slicedToArray__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @babel/runtime/helpers/esm/slicedToArray */ "./node_modules/@babel/runtime/helpers/esm/slicedToArray.js");
/* harmony import */ var _babel_runtime_helpers_esm_typeof__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @babel/runtime/helpers/esm/typeof */ "./node_modules/@babel/runtime/helpers/esm/typeof.js");
/* harmony import */ var _babel_runtime_helpers_esm_classCallCheck__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @babel/runtime/helpers/esm/classCallCheck */ "./node_modules/@babel/runtime/helpers/esm/classCallCheck.js");
/* harmony import */ var _babel_runtime_helpers_esm_createClass__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @babel/runtime/helpers/esm/createClass */ "./node_modules/@babel/runtime/helpers/esm/createClass.js");
/* harmony import */ var _babel_runtime_helpers_esm_inherits__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @babel/runtime/helpers/esm/inherits */ "./node_modules/@babel/runtime/helpers/esm/inherits.js");
/* harmony import */ var _babel_runtime_helpers_esm_defineProperty__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @babel/runtime/helpers/esm/defineProperty */ "./node_modules/@babel/runtime/helpers/esm/defineProperty.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_9___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_9__);
/* harmony import */ var react_dom__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! react-dom */ "react-dom");
/* harmony import */ var react_dom__WEBPACK_IMPORTED_MODULE_10___default = /*#__PURE__*/__webpack_require__.n(react_dom__WEBPACK_IMPORTED_MODULE_10__);













function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);

  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);

    if (enumerableOnly) {
      symbols = symbols.filter(function (sym) {
        return Object.getOwnPropertyDescriptor(object, sym).enumerable;
      });
    }

    keys.push.apply(keys, symbols);
  }

  return keys;
}

function _objectSpread2(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};

    if (i % 2) {
      ownKeys(Object(source), true).forEach(function (key) {
        _defineProperty(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      ownKeys(Object(source)).forEach(function (key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
      });
    }
  }

  return target;
}

function _getPrototypeOf(o) {
  _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
    return o.__proto__ || Object.getPrototypeOf(o);
  };
  return _getPrototypeOf(o);
}

function _isNativeReflectConstruct() {
  if (typeof Reflect === "undefined" || !Reflect.construct) return false;
  if (Reflect.construct.sham) return false;
  if (typeof Proxy === "function") return true;

  try {
    Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {}));
    return true;
  } catch (e) {
    return false;
  }
}

function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return self;
}

function _possibleConstructorReturn(self, call) {
  if (call && (typeof call === "object" || typeof call === "function")) {
    return call;
  }

  return _assertThisInitialized(self);
}

function _createSuper(Derived) {
  var hasNativeReflectConstruct = _isNativeReflectConstruct();
  return function _createSuperInternal() {
    var Super = _getPrototypeOf(Derived),
        result;

    if (hasNativeReflectConstruct) {
      var NewTarget = _getPrototypeOf(this).constructor;
      result = Reflect.construct(Super, arguments, NewTarget);
    } else {
      result = Super.apply(this, arguments);
    }

    return _possibleConstructorReturn(this, result);
  };
}

var _excluded$3 = ["className", "clearValue", "cx", "getStyles", "getValue", "hasValue", "isMulti", "isRtl", "options", "selectOption", "selectProps", "setValue", "theme"];
// ==============================
// NO OP
// ==============================
var noop = function noop() {};
// Class Name Prefixer
// ==============================

/**
 String representation of component state for styling with class names.

 Expects an array of strings OR a string/object pair:
 - className(['comp', 'comp-arg', 'comp-arg-2'])
   @returns 'react-select__comp react-select__comp-arg react-select__comp-arg-2'
 - className('comp', { some: true, state: false })
   @returns 'react-select__comp react-select__comp--some'
*/

function applyPrefixToName(prefix, name) {
  if (!name) {
    return prefix;
  } else if (name[0] === '-') {
    return prefix + name;
  } else {
    return prefix + '__' + name;
  }
}

function classNames(prefix, state, className) {
  var arr = [className];

  if (state && prefix) {
    for (var key in state) {
      if (state.hasOwnProperty(key) && state[key]) {
        arr.push("".concat(applyPrefixToName(prefix, key)));
      }
    }
  }

  return arr.filter(function (i) {
    return i;
  }).map(function (i) {
    return String(i).trim();
  }).join(' ');
} // ==============================
// Clean Value
// ==============================

var cleanValue = function cleanValue(value) {
  if (isArray(value)) return value.filter(Boolean);
  if ((0,_babel_runtime_helpers_esm_typeof__WEBPACK_IMPORTED_MODULE_4__["default"])(value) === 'object' && value !== null) return [value];
  return [];
}; // ==============================
// Clean Common Props
// ==============================

var cleanCommonProps = function cleanCommonProps(props) {
  //className
  props.className;
      props.clearValue;
      props.cx;
      props.getStyles;
      props.getValue;
      props.hasValue;
      props.isMulti;
      props.isRtl;
      props.options;
      props.selectOption;
      props.selectProps;
      props.setValue;
      props.theme;
      var innerProps = (0,_babel_runtime_helpers_esm_objectWithoutProperties__WEBPACK_IMPORTED_MODULE_2__["default"])(props, _excluded$3);

  return _objectSpread2({}, innerProps);
}; // ==============================
// Handle Input Change
// ==============================

function handleInputChange(inputValue, actionMeta, onInputChange) {
  if (onInputChange) {
    var _newValue = onInputChange(inputValue, actionMeta);

    if (typeof _newValue === 'string') return _newValue;
  }

  return inputValue;
} // ==============================
// Scroll Helpers
// ==============================

function isDocumentElement(el) {
  return [document.documentElement, document.body, window].indexOf(el) > -1;
} // Normalized Scroll Top
// ------------------------------

function normalizedHeight(el) {
  if (isDocumentElement(el)) {
    return window.innerHeight;
  }

  return el.clientHeight;
} // Normalized scrollTo & scrollTop
// ------------------------------

function getScrollTop(el) {
  if (isDocumentElement(el)) {
    return window.pageYOffset;
  }

  return el.scrollTop;
}
function scrollTo(el, top) {
  // with a scroll distance, we perform scroll on the element
  if (isDocumentElement(el)) {
    window.scrollTo(0, top);
    return;
  }

  el.scrollTop = top;
} // Get Scroll Parent
// ------------------------------

function getScrollParent(element) {
  var style = getComputedStyle(element);
  var excludeStaticParent = style.position === 'absolute';
  var overflowRx = /(auto|scroll)/;
  if (style.position === 'fixed') return document.documentElement;

  for (var parent = element; parent = parent.parentElement;) {
    style = getComputedStyle(parent);

    if (excludeStaticParent && style.position === 'static') {
      continue;
    }

    if (overflowRx.test(style.overflow + style.overflowY + style.overflowX)) {
      return parent;
    }
  }

  return document.documentElement;
} // Animated Scroll To
// ------------------------------

/**
  @param t: time (elapsed)
  @param b: initial value
  @param c: amount of change
  @param d: duration
*/

function easeOutCubic(t, b, c, d) {
  return c * ((t = t / d - 1) * t * t + 1) + b;
}

function animatedScrollTo(element, to) {
  var duration = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 200;
  var callback = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : noop;
  var start = getScrollTop(element);
  var change = to - start;
  var increment = 10;
  var currentTime = 0;

  function animateScroll() {
    currentTime += increment;
    var val = easeOutCubic(currentTime, start, change, duration);
    scrollTo(element, val);

    if (currentTime < duration) {
      window.requestAnimationFrame(animateScroll);
    } else {
      callback(element);
    }
  }

  animateScroll();
} // Scroll Into View
// ------------------------------

function scrollIntoView(menuEl, focusedEl) {
  var menuRect = menuEl.getBoundingClientRect();
  var focusedRect = focusedEl.getBoundingClientRect();
  var overScroll = focusedEl.offsetHeight / 3;

  if (focusedRect.bottom + overScroll > menuRect.bottom) {
    scrollTo(menuEl, Math.min(focusedEl.offsetTop + focusedEl.clientHeight - menuEl.offsetHeight + overScroll, menuEl.scrollHeight));
  } else if (focusedRect.top - overScroll < menuRect.top) {
    scrollTo(menuEl, Math.max(focusedEl.offsetTop - overScroll, 0));
  }
} // ==============================
// Get bounding client object
// ==============================
// cannot get keys using array notation with DOMRect

function getBoundingClientObj(element) {
  var rect = element.getBoundingClientRect();
  return {
    bottom: rect.bottom,
    height: rect.height,
    left: rect.left,
    right: rect.right,
    top: rect.top,
    width: rect.width
  };
}
// Touch Capability Detector
// ==============================

function isTouchCapable() {
  try {
    document.createEvent('TouchEvent');
    return true;
  } catch (e) {
    return false;
  }
} // ==============================
// Mobile Device Detector
// ==============================

function isMobileDevice() {
  try {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  } catch (e) {
    return false;
  }
} // ==============================
// Passive Event Detector
// ==============================
// https://github.com/rafgraph/detect-it/blob/main/src/index.ts#L19-L36

var passiveOptionAccessed = false;
var options = {
  get passive() {
    return passiveOptionAccessed = true;
  }

}; // check for SSR

var w = typeof window !== 'undefined' ? window : {};

if (w.addEventListener && w.removeEventListener) {
  w.addEventListener('p', noop, options);
  w.removeEventListener('p', noop, false);
}

var supportsPassiveEvents = passiveOptionAccessed;
function notNullish(item) {
  return item != null;
}
function isArray(arg) {
  return Array.isArray(arg);
}
function valueTernary(isMulti, multiValue, singleValue) {
  return isMulti ? multiValue : singleValue;
}
function singleValueAsValue(singleValue) {
  return singleValue;
}
function multiValueAsValue(multiValue) {
  return multiValue;
}
var removeProps = function removeProps(propsObj) {
  for (var _len = arguments.length, properties = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    properties[_key - 1] = arguments[_key];
  }

  var propsMap = Object.entries(propsObj).filter(function (_ref) {
    var _ref2 = (0,_babel_runtime_helpers_esm_slicedToArray__WEBPACK_IMPORTED_MODULE_3__["default"])(_ref, 1),
        key = _ref2[0];

    return !properties.includes(key);
  });
  return propsMap.reduce(function (newProps, _ref3) {
    var _ref4 = (0,_babel_runtime_helpers_esm_slicedToArray__WEBPACK_IMPORTED_MODULE_3__["default"])(_ref3, 2),
        key = _ref4[0],
        val = _ref4[1];

    newProps[key] = val;
    return newProps;
  }, {});
};

function getMenuPlacement(_ref) {
  var maxHeight = _ref.maxHeight,
      menuEl = _ref.menuEl,
      minHeight = _ref.minHeight,
      placement = _ref.placement,
      shouldScroll = _ref.shouldScroll,
      isFixedPosition = _ref.isFixedPosition,
      theme = _ref.theme;
  var spacing = theme.spacing;
  var scrollParent = getScrollParent(menuEl);
  var defaultState = {
    placement: 'bottom',
    maxHeight: maxHeight
  }; // something went wrong, return default state

  if (!menuEl || !menuEl.offsetParent) return defaultState; // we can't trust `scrollParent.scrollHeight` --> it may increase when
  // the menu is rendered

  var _scrollParent$getBoun = scrollParent.getBoundingClientRect(),
      scrollHeight = _scrollParent$getBoun.height;

  var _menuEl$getBoundingCl = menuEl.getBoundingClientRect(),
      menuBottom = _menuEl$getBoundingCl.bottom,
      menuHeight = _menuEl$getBoundingCl.height,
      menuTop = _menuEl$getBoundingCl.top;

  var _menuEl$offsetParent$ = menuEl.offsetParent.getBoundingClientRect(),
      containerTop = _menuEl$offsetParent$.top;

  var viewHeight = isFixedPosition ? window.innerHeight : normalizedHeight(scrollParent);
  var scrollTop = getScrollTop(scrollParent);
  var marginBottom = parseInt(getComputedStyle(menuEl).marginBottom, 10);
  var marginTop = parseInt(getComputedStyle(menuEl).marginTop, 10);
  var viewSpaceAbove = containerTop - marginTop;
  var viewSpaceBelow = viewHeight - menuTop;
  var scrollSpaceAbove = viewSpaceAbove + scrollTop;
  var scrollSpaceBelow = scrollHeight - scrollTop - menuTop;
  var scrollDown = menuBottom - viewHeight + scrollTop + marginBottom;
  var scrollUp = scrollTop + menuTop - marginTop;
  var scrollDuration = 160;

  switch (placement) {
    case 'auto':
    case 'bottom':
      // 1: the menu will fit, do nothing
      if (viewSpaceBelow >= menuHeight) {
        return {
          placement: 'bottom',
          maxHeight: maxHeight
        };
      } // 2: the menu will fit, if scrolled


      if (scrollSpaceBelow >= menuHeight && !isFixedPosition) {
        if (shouldScroll) {
          animatedScrollTo(scrollParent, scrollDown, scrollDuration);
        }

        return {
          placement: 'bottom',
          maxHeight: maxHeight
        };
      } // 3: the menu will fit, if constrained


      if (!isFixedPosition && scrollSpaceBelow >= minHeight || isFixedPosition && viewSpaceBelow >= minHeight) {
        if (shouldScroll) {
          animatedScrollTo(scrollParent, scrollDown, scrollDuration);
        } // we want to provide as much of the menu as possible to the user,
        // so give them whatever is available below rather than the minHeight.


        var constrainedHeight = isFixedPosition ? viewSpaceBelow - marginBottom : scrollSpaceBelow - marginBottom;
        return {
          placement: 'bottom',
          maxHeight: constrainedHeight
        };
      } // 4. Forked beviour when there isn't enough space below
      // AUTO: flip the menu, render above


      if (placement === 'auto' || isFixedPosition) {
        // may need to be constrained after flipping
        var _constrainedHeight = maxHeight;
        var spaceAbove = isFixedPosition ? viewSpaceAbove : scrollSpaceAbove;

        if (spaceAbove >= minHeight) {
          _constrainedHeight = Math.min(spaceAbove - marginBottom - spacing.controlHeight, maxHeight);
        }

        return {
          placement: 'top',
          maxHeight: _constrainedHeight
        };
      } // BOTTOM: allow browser to increase scrollable area and immediately set scroll


      if (placement === 'bottom') {
        if (shouldScroll) {
          scrollTo(scrollParent, scrollDown);
        }

        return {
          placement: 'bottom',
          maxHeight: maxHeight
        };
      }

      break;

    case 'top':
      // 1: the menu will fit, do nothing
      if (viewSpaceAbove >= menuHeight) {
        return {
          placement: 'top',
          maxHeight: maxHeight
        };
      } // 2: the menu will fit, if scrolled


      if (scrollSpaceAbove >= menuHeight && !isFixedPosition) {
        if (shouldScroll) {
          animatedScrollTo(scrollParent, scrollUp, scrollDuration);
        }

        return {
          placement: 'top',
          maxHeight: maxHeight
        };
      } // 3: the menu will fit, if constrained


      if (!isFixedPosition && scrollSpaceAbove >= minHeight || isFixedPosition && viewSpaceAbove >= minHeight) {
        var _constrainedHeight2 = maxHeight; // we want to provide as much of the menu as possible to the user,
        // so give them whatever is available below rather than the minHeight.

        if (!isFixedPosition && scrollSpaceAbove >= minHeight || isFixedPosition && viewSpaceAbove >= minHeight) {
          _constrainedHeight2 = isFixedPosition ? viewSpaceAbove - marginTop : scrollSpaceAbove - marginTop;
        }

        if (shouldScroll) {
          animatedScrollTo(scrollParent, scrollUp, scrollDuration);
        }

        return {
          placement: 'top',
          maxHeight: _constrainedHeight2
        };
      } // 4. not enough space, the browser WILL NOT increase scrollable area when
      // absolutely positioned element rendered above the viewport (only below).
      // Flip the menu, render below


      return {
        placement: 'bottom',
        maxHeight: maxHeight
      };

    default:
      throw new Error("Invalid placement provided \"".concat(placement, "\"."));
  }

  return defaultState;
} // Menu Component
// ------------------------------

function alignToControl(placement) {
  var placementToCSSProp = {
    bottom: 'top',
    top: 'bottom'
  };
  return placement ? placementToCSSProp[placement] : 'bottom';
}

var coercePlacement = function coercePlacement(p) {
  return p === 'auto' ? 'bottom' : p;
};

var menuCSS = function menuCSS(_ref2) {
  var _ref3;

  var placement = _ref2.placement,
      _ref2$theme = _ref2.theme,
      borderRadius = _ref2$theme.borderRadius,
      spacing = _ref2$theme.spacing,
      colors = _ref2$theme.colors;
  return _ref3 = {
    label: 'menu'
  }, (0,_babel_runtime_helpers_esm_defineProperty__WEBPACK_IMPORTED_MODULE_8__["default"])(_ref3, alignToControl(placement), '100%'), (0,_babel_runtime_helpers_esm_defineProperty__WEBPACK_IMPORTED_MODULE_8__["default"])(_ref3, "backgroundColor", colors.neutral0), (0,_babel_runtime_helpers_esm_defineProperty__WEBPACK_IMPORTED_MODULE_8__["default"])(_ref3, "borderRadius", borderRadius), (0,_babel_runtime_helpers_esm_defineProperty__WEBPACK_IMPORTED_MODULE_8__["default"])(_ref3, "boxShadow", '0 0 0 1px hsla(0, 0%, 0%, 0.1), 0 4px 11px hsla(0, 0%, 0%, 0.1)'), (0,_babel_runtime_helpers_esm_defineProperty__WEBPACK_IMPORTED_MODULE_8__["default"])(_ref3, "marginBottom", spacing.menuGutter), (0,_babel_runtime_helpers_esm_defineProperty__WEBPACK_IMPORTED_MODULE_8__["default"])(_ref3, "marginTop", spacing.menuGutter), (0,_babel_runtime_helpers_esm_defineProperty__WEBPACK_IMPORTED_MODULE_8__["default"])(_ref3, "position", 'absolute'), (0,_babel_runtime_helpers_esm_defineProperty__WEBPACK_IMPORTED_MODULE_8__["default"])(_ref3, "width", '100%'), (0,_babel_runtime_helpers_esm_defineProperty__WEBPACK_IMPORTED_MODULE_8__["default"])(_ref3, "zIndex", 1), _ref3;
};
var PortalPlacementContext = /*#__PURE__*/(0,react__WEBPACK_IMPORTED_MODULE_9__.createContext)({
  getPortalPlacement: null
}); // NOTE: internal only

var MenuPlacer = /*#__PURE__*/function (_Component) {
  (0,_babel_runtime_helpers_esm_inherits__WEBPACK_IMPORTED_MODULE_7__["default"])(MenuPlacer, _Component);

  var _super = _createSuper(MenuPlacer);

  function MenuPlacer() {
    var _this;

    (0,_babel_runtime_helpers_esm_classCallCheck__WEBPACK_IMPORTED_MODULE_5__["default"])(this, MenuPlacer);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _super.call.apply(_super, [this].concat(args));
    _this.state = {
      maxHeight: _this.props.maxMenuHeight,
      placement: null
    };
    _this.context = void 0;

    _this.getPlacement = function (ref) {
      var _this$props = _this.props,
          minMenuHeight = _this$props.minMenuHeight,
          maxMenuHeight = _this$props.maxMenuHeight,
          menuPlacement = _this$props.menuPlacement,
          menuPosition = _this$props.menuPosition,
          menuShouldScrollIntoView = _this$props.menuShouldScrollIntoView,
          theme = _this$props.theme;
      if (!ref) return; // DO NOT scroll if position is fixed

      var isFixedPosition = menuPosition === 'fixed';
      var shouldScroll = menuShouldScrollIntoView && !isFixedPosition;
      var state = getMenuPlacement({
        maxHeight: maxMenuHeight,
        menuEl: ref,
        minHeight: minMenuHeight,
        placement: menuPlacement,
        shouldScroll: shouldScroll,
        isFixedPosition: isFixedPosition,
        theme: theme
      });
      var getPortalPlacement = _this.context.getPortalPlacement;
      if (getPortalPlacement) getPortalPlacement(state);

      _this.setState(state);
    };

    _this.getUpdatedProps = function () {
      var menuPlacement = _this.props.menuPlacement;
      var placement = _this.state.placement || coercePlacement(menuPlacement);
      return _objectSpread2(_objectSpread2({}, _this.props), {}, {
        placement: placement,
        maxHeight: _this.state.maxHeight
      });
    };

    return _this;
  }

  (0,_babel_runtime_helpers_esm_createClass__WEBPACK_IMPORTED_MODULE_6__["default"])(MenuPlacer, [{
    key: "render",
    value: function render() {
      var children = this.props.children;
      return children({
        ref: this.getPlacement,
        placerProps: this.getUpdatedProps()
      });
    }
  }]);

  return MenuPlacer;
}(react__WEBPACK_IMPORTED_MODULE_9__.Component);
MenuPlacer.contextType = PortalPlacementContext;

var Menu = function Menu(props) {
  var children = props.children,
      className = props.className,
      cx = props.cx,
      getStyles = props.getStyles,
      innerRef = props.innerRef,
      innerProps = props.innerProps;
  return (0,_emotion_react__WEBPACK_IMPORTED_MODULE_11__.jsx)("div", (0,_babel_runtime_helpers_esm_extends__WEBPACK_IMPORTED_MODULE_0__["default"])({
    css: getStyles('menu', props),
    className: cx({
      menu: true
    }, className),
    ref: innerRef
  }, innerProps), children);
};
// Menu List
// ==============================

var menuListCSS = function menuListCSS(_ref4) {
  var maxHeight = _ref4.maxHeight,
      baseUnit = _ref4.theme.spacing.baseUnit;
  return {
    maxHeight: maxHeight,
    overflowY: 'auto',
    paddingBottom: baseUnit,
    paddingTop: baseUnit,
    position: 'relative',
    // required for offset[Height, Top] > keyboard scroll
    WebkitOverflowScrolling: 'touch'
  };
};
var MenuList = function MenuList(props) {
  var children = props.children,
      className = props.className,
      cx = props.cx,
      getStyles = props.getStyles,
      innerProps = props.innerProps,
      innerRef = props.innerRef,
      isMulti = props.isMulti;
  return (0,_emotion_react__WEBPACK_IMPORTED_MODULE_11__.jsx)("div", (0,_babel_runtime_helpers_esm_extends__WEBPACK_IMPORTED_MODULE_0__["default"])({
    css: getStyles('menuList', props),
    className: cx({
      'menu-list': true,
      'menu-list--is-multi': isMulti
    }, className),
    ref: innerRef
  }, innerProps), children);
}; // ==============================
// Menu Notices
// ==============================

var noticeCSS = function noticeCSS(_ref5) {
  var _ref5$theme = _ref5.theme,
      baseUnit = _ref5$theme.spacing.baseUnit,
      colors = _ref5$theme.colors;
  return {
    color: colors.neutral40,
    padding: "".concat(baseUnit * 2, "px ").concat(baseUnit * 3, "px"),
    textAlign: 'center'
  };
};

var noOptionsMessageCSS = noticeCSS;
var loadingMessageCSS = noticeCSS;
var NoOptionsMessage = function NoOptionsMessage(props) {
  var children = props.children,
      className = props.className,
      cx = props.cx,
      getStyles = props.getStyles,
      innerProps = props.innerProps;
  return (0,_emotion_react__WEBPACK_IMPORTED_MODULE_11__.jsx)("div", (0,_babel_runtime_helpers_esm_extends__WEBPACK_IMPORTED_MODULE_0__["default"])({
    css: getStyles('noOptionsMessage', props),
    className: cx({
      'menu-notice': true,
      'menu-notice--no-options': true
    }, className)
  }, innerProps), children);
};
NoOptionsMessage.defaultProps = {
  children: 'No options'
};
var LoadingMessage = function LoadingMessage(props) {
  var children = props.children,
      className = props.className,
      cx = props.cx,
      getStyles = props.getStyles,
      innerProps = props.innerProps;
  return (0,_emotion_react__WEBPACK_IMPORTED_MODULE_11__.jsx)("div", (0,_babel_runtime_helpers_esm_extends__WEBPACK_IMPORTED_MODULE_0__["default"])({
    css: getStyles('loadingMessage', props),
    className: cx({
      'menu-notice': true,
      'menu-notice--loading': true
    }, className)
  }, innerProps), children);
};
LoadingMessage.defaultProps = {
  children: 'Loading...'
}; // ==============================
// Menu Portal
// ==============================

var menuPortalCSS = function menuPortalCSS(_ref6) {
  var rect = _ref6.rect,
      offset = _ref6.offset,
      position = _ref6.position;
  return {
    left: rect.left,
    position: position,
    top: offset,
    width: rect.width,
    zIndex: 1
  };
};
var MenuPortal = /*#__PURE__*/function (_Component2) {
  (0,_babel_runtime_helpers_esm_inherits__WEBPACK_IMPORTED_MODULE_7__["default"])(MenuPortal, _Component2);

  var _super2 = _createSuper(MenuPortal);

  function MenuPortal() {
    var _this2;

    (0,_babel_runtime_helpers_esm_classCallCheck__WEBPACK_IMPORTED_MODULE_5__["default"])(this, MenuPortal);

    for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }

    _this2 = _super2.call.apply(_super2, [this].concat(args));
    _this2.state = {
      placement: null
    };

    _this2.getPortalPlacement = function (_ref7) {
      var placement = _ref7.placement;
      var initialPlacement = coercePlacement(_this2.props.menuPlacement); // avoid re-renders if the placement has not changed

      if (placement !== initialPlacement) {
        _this2.setState({
          placement: placement
        });
      }
    };

    return _this2;
  }

  (0,_babel_runtime_helpers_esm_createClass__WEBPACK_IMPORTED_MODULE_6__["default"])(MenuPortal, [{
    key: "render",
    value: function render() {
      var _this$props2 = this.props,
          appendTo = _this$props2.appendTo,
          children = _this$props2.children,
          className = _this$props2.className,
          controlElement = _this$props2.controlElement,
          cx = _this$props2.cx,
          innerProps = _this$props2.innerProps,
          menuPlacement = _this$props2.menuPlacement,
          position = _this$props2.menuPosition,
          getStyles = _this$props2.getStyles;
      var isFixed = position === 'fixed'; // bail early if required elements aren't present

      if (!appendTo && !isFixed || !controlElement) {
        return null;
      }

      var placement = this.state.placement || coercePlacement(menuPlacement);
      var rect = getBoundingClientObj(controlElement);
      var scrollDistance = isFixed ? 0 : window.pageYOffset;
      var offset = rect[placement] + scrollDistance;
      var state = {
        offset: offset,
        position: position,
        rect: rect
      }; // same wrapper element whether fixed or portalled

      var menuWrapper = (0,_emotion_react__WEBPACK_IMPORTED_MODULE_11__.jsx)("div", (0,_babel_runtime_helpers_esm_extends__WEBPACK_IMPORTED_MODULE_0__["default"])({
        css: getStyles('menuPortal', state),
        className: cx({
          'menu-portal': true
        }, className)
      }, innerProps), children);
      return (0,_emotion_react__WEBPACK_IMPORTED_MODULE_11__.jsx)(PortalPlacementContext.Provider, {
        value: {
          getPortalPlacement: this.getPortalPlacement
        }
      }, appendTo ? /*#__PURE__*/(0,react_dom__WEBPACK_IMPORTED_MODULE_10__.createPortal)(menuWrapper, appendTo) : menuWrapper);
    }
  }]);

  return MenuPortal;
}(react__WEBPACK_IMPORTED_MODULE_9__.Component);

var containerCSS = function containerCSS(_ref) {
  var isDisabled = _ref.isDisabled,
      isRtl = _ref.isRtl;
  return {
    label: 'container',
    direction: isRtl ? 'rtl' : undefined,
    pointerEvents: isDisabled ? 'none' : undefined,
    // cancel mouse events when disabled
    position: 'relative'
  };
};
var SelectContainer = function SelectContainer(props) {
  var children = props.children,
      className = props.className,
      cx = props.cx,
      getStyles = props.getStyles,
      innerProps = props.innerProps,
      isDisabled = props.isDisabled,
      isRtl = props.isRtl;
  return (0,_emotion_react__WEBPACK_IMPORTED_MODULE_11__.jsx)("div", (0,_babel_runtime_helpers_esm_extends__WEBPACK_IMPORTED_MODULE_0__["default"])({
    css: getStyles('container', props),
    className: cx({
      '--is-disabled': isDisabled,
      '--is-rtl': isRtl
    }, className)
  }, innerProps), children);
}; // ==============================
// Value Container
// ==============================

var valueContainerCSS = function valueContainerCSS(_ref2) {
  var spacing = _ref2.theme.spacing,
      isMulti = _ref2.isMulti,
      hasValue = _ref2.hasValue,
      controlShouldRenderValue = _ref2.selectProps.controlShouldRenderValue;
  return {
    alignItems: 'center',
    display: isMulti && hasValue && controlShouldRenderValue ? 'flex' : 'grid',
    flex: 1,
    flexWrap: 'wrap',
    padding: "".concat(spacing.baseUnit / 2, "px ").concat(spacing.baseUnit * 2, "px"),
    WebkitOverflowScrolling: 'touch',
    position: 'relative',
    overflow: 'hidden'
  };
};
var ValueContainer = function ValueContainer(props) {
  var children = props.children,
      className = props.className,
      cx = props.cx,
      innerProps = props.innerProps,
      isMulti = props.isMulti,
      getStyles = props.getStyles,
      hasValue = props.hasValue;
  return (0,_emotion_react__WEBPACK_IMPORTED_MODULE_11__.jsx)("div", (0,_babel_runtime_helpers_esm_extends__WEBPACK_IMPORTED_MODULE_0__["default"])({
    css: getStyles('valueContainer', props),
    className: cx({
      'value-container': true,
      'value-container--is-multi': isMulti,
      'value-container--has-value': hasValue
    }, className)
  }, innerProps), children);
}; // ==============================
// Indicator Container
// ==============================

var indicatorsContainerCSS = function indicatorsContainerCSS() {
  return {
    alignItems: 'center',
    alignSelf: 'stretch',
    display: 'flex',
    flexShrink: 0
  };
};
var IndicatorsContainer = function IndicatorsContainer(props) {
  var children = props.children,
      className = props.className,
      cx = props.cx,
      innerProps = props.innerProps,
      getStyles = props.getStyles;
  return (0,_emotion_react__WEBPACK_IMPORTED_MODULE_11__.jsx)("div", (0,_babel_runtime_helpers_esm_extends__WEBPACK_IMPORTED_MODULE_0__["default"])({
    css: getStyles('indicatorsContainer', props),
    className: cx({
      indicators: true
    }, className)
  }, innerProps), children);
};

var _templateObject;

var _excluded$2 = ["size"];

function _EMOTION_STRINGIFIED_CSS_ERROR__() { return "You have tried to stringify object returned from `css` function. It isn't supposed to be used directly (e.g. as value of the `className` prop), but rather handed to emotion so it can handle it (e.g. as value of `css` prop)."; }

var _ref2 =  false ? 0 : {
  name: "tj5bde-Svg",
  styles: "display:inline-block;fill:currentColor;line-height:1;stroke:currentColor;stroke-width:0;label:Svg;",
  map: "/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImluZGljYXRvcnMudHN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQXdCSSIsImZpbGUiOiJpbmRpY2F0b3JzLnRzeCIsInNvdXJjZXNDb250ZW50IjpbIi8qKiBAanN4IGpzeCAqL1xuaW1wb3J0IHsgUmVhY3ROb2RlIH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IHsganN4LCBrZXlmcmFtZXMgfSBmcm9tICdAZW1vdGlvbi9yZWFjdCc7XG5cbmltcG9ydCB7XG4gIENvbW1vblByb3BzQW5kQ2xhc3NOYW1lLFxuICBDU1NPYmplY3RXaXRoTGFiZWwsXG4gIEdyb3VwQmFzZSxcbn0gZnJvbSAnLi4vdHlwZXMnO1xuXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbi8vIERyb3Bkb3duICYgQ2xlYXIgSWNvbnNcbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG5jb25zdCBTdmcgPSAoe1xuICBzaXplLFxuICAuLi5wcm9wc1xufTogSlNYLkludHJpbnNpY0VsZW1lbnRzWydzdmcnXSAmIHsgc2l6ZTogbnVtYmVyIH0pID0+IChcbiAgPHN2Z1xuICAgIGhlaWdodD17c2l6ZX1cbiAgICB3aWR0aD17c2l6ZX1cbiAgICB2aWV3Qm94PVwiMCAwIDIwIDIwXCJcbiAgICBhcmlhLWhpZGRlbj1cInRydWVcIlxuICAgIGZvY3VzYWJsZT1cImZhbHNlXCJcbiAgICBjc3M9e3tcbiAgICAgIGRpc3BsYXk6ICdpbmxpbmUtYmxvY2snLFxuICAgICAgZmlsbDogJ2N1cnJlbnRDb2xvcicsXG4gICAgICBsaW5lSGVpZ2h0OiAxLFxuICAgICAgc3Ryb2tlOiAnY3VycmVudENvbG9yJyxcbiAgICAgIHN0cm9rZVdpZHRoOiAwLFxuICAgIH19XG4gICAgey4uLnByb3BzfVxuICAvPlxuKTtcblxuZXhwb3J0IHR5cGUgQ3Jvc3NJY29uUHJvcHMgPSBKU1guSW50cmluc2ljRWxlbWVudHNbJ3N2ZyddICYgeyBzaXplPzogbnVtYmVyIH07XG5leHBvcnQgY29uc3QgQ3Jvc3NJY29uID0gKHByb3BzOiBDcm9zc0ljb25Qcm9wcykgPT4gKFxuICA8U3ZnIHNpemU9ezIwfSB7Li4ucHJvcHN9PlxuICAgIDxwYXRoIGQ9XCJNMTQuMzQ4IDE0Ljg0OWMtMC40NjkgMC40NjktMS4yMjkgMC40NjktMS42OTcgMGwtMi42NTEtMy4wMzAtMi42NTEgMy4wMjljLTAuNDY5IDAuNDY5LTEuMjI5IDAuNDY5LTEuNjk3IDAtMC40NjktMC40NjktMC40NjktMS4yMjkgMC0xLjY5N2wyLjc1OC0zLjE1LTIuNzU5LTMuMTUyYy0wLjQ2OS0wLjQ2OS0wLjQ2OS0xLjIyOCAwLTEuNjk3czEuMjI4LTAuNDY5IDEuNjk3IDBsMi42NTIgMy4wMzEgMi42NTEtMy4wMzFjMC40NjktMC40NjkgMS4yMjgtMC40NjkgMS42OTcgMHMwLjQ2OSAxLjIyOSAwIDEuNjk3bC0yLjc1OCAzLjE1MiAyLjc1OCAzLjE1YzAuNDY5IDAuNDY5IDAuNDY5IDEuMjI5IDAgMS42OTh6XCIgLz5cbiAgPC9Tdmc+XG4pO1xuZXhwb3J0IHR5cGUgRG93bkNoZXZyb25Qcm9wcyA9IEpTWC5JbnRyaW5zaWNFbGVtZW50c1snc3ZnJ10gJiB7IHNpemU/OiBudW1iZXIgfTtcbmV4cG9ydCBjb25zdCBEb3duQ2hldnJvbiA9IChwcm9wczogRG93bkNoZXZyb25Qcm9wcykgPT4gKFxuICA8U3ZnIHNpemU9ezIwfSB7Li4ucHJvcHN9PlxuICAgIDxwYXRoIGQ9XCJNNC41MTYgNy41NDhjMC40MzYtMC40NDYgMS4wNDMtMC40ODEgMS41NzYgMGwzLjkwOCAzLjc0NyAzLjkwOC0zLjc0N2MwLjUzMy0wLjQ4MSAxLjE0MS0wLjQ0NiAxLjU3NCAwIDAuNDM2IDAuNDQ1IDAuNDA4IDEuMTk3IDAgMS42MTUtMC40MDYgMC40MTgtNC42OTUgNC41MDItNC42OTUgNC41MDItMC4yMTcgMC4yMjMtMC41MDIgMC4zMzUtMC43ODcgMC4zMzVzLTAuNTctMC4xMTItMC43ODktMC4zMzVjMCAwLTQuMjg3LTQuMDg0LTQuNjk1LTQuNTAycy0wLjQzNi0xLjE3IDAtMS42MTV6XCIgLz5cbiAgPC9Tdmc+XG4pO1xuXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbi8vIERyb3Bkb3duICYgQ2xlYXIgQnV0dG9uc1xuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbmV4cG9ydCBpbnRlcmZhY2UgRHJvcGRvd25JbmRpY2F0b3JQcm9wczxcbiAgT3B0aW9uID0gdW5rbm93bixcbiAgSXNNdWx0aSBleHRlbmRzIGJvb2xlYW4gPSBib29sZWFuLFxuICBHcm91cCBleHRlbmRzIEdyb3VwQmFzZTxPcHRpb24+ID0gR3JvdXBCYXNlPE9wdGlvbj5cbj4gZXh0ZW5kcyBDb21tb25Qcm9wc0FuZENsYXNzTmFtZTxPcHRpb24sIElzTXVsdGksIEdyb3VwPiB7XG4gIC8qKiBUaGUgY2hpbGRyZW4gdG8gYmUgcmVuZGVyZWQgaW5zaWRlIHRoZSBpbmRpY2F0b3IuICovXG4gIGNoaWxkcmVuPzogUmVhY3ROb2RlO1xuICAvKiogUHJvcHMgdGhhdCB3aWxsIGJlIHBhc3NlZCBvbiB0byB0aGUgY2hpbGRyZW4uICovXG4gIGlubmVyUHJvcHM6IEpTWC5JbnRyaW5zaWNFbGVtZW50c1snZGl2J107XG4gIC8qKiBUaGUgZm9jdXNlZCBzdGF0ZSBvZiB0aGUgc2VsZWN0LiAqL1xuICBpc0ZvY3VzZWQ6IGJvb2xlYW47XG4gIGlzRGlzYWJsZWQ6IGJvb2xlYW47XG59XG5cbmNvbnN0IGJhc2VDU1MgPSA8XG4gIE9wdGlvbixcbiAgSXNNdWx0aSBleHRlbmRzIGJvb2xlYW4sXG4gIEdyb3VwIGV4dGVuZHMgR3JvdXBCYXNlPE9wdGlvbj5cbj4oe1xuICBpc0ZvY3VzZWQsXG4gIHRoZW1lOiB7XG4gICAgc3BhY2luZzogeyBiYXNlVW5pdCB9LFxuICAgIGNvbG9ycyxcbiAgfSxcbn06XG4gIHwgRHJvcGRvd25JbmRpY2F0b3JQcm9wczxPcHRpb24sIElzTXVsdGksIEdyb3VwPlxuICB8IENsZWFySW5kaWNhdG9yUHJvcHM8T3B0aW9uLCBJc011bHRpLCBHcm91cD4pOiBDU1NPYmplY3RXaXRoTGFiZWwgPT4gKHtcbiAgbGFiZWw6ICdpbmRpY2F0b3JDb250YWluZXInLFxuICBjb2xvcjogaXNGb2N1c2VkID8gY29sb3JzLm5ldXRyYWw2MCA6IGNvbG9ycy5uZXV0cmFsMjAsXG4gIGRpc3BsYXk6ICdmbGV4JyxcbiAgcGFkZGluZzogYmFzZVVuaXQgKiAyLFxuICB0cmFuc2l0aW9uOiAnY29sb3IgMTUwbXMnLFxuXG4gICc6aG92ZXInOiB7XG4gICAgY29sb3I6IGlzRm9jdXNlZCA/IGNvbG9ycy5uZXV0cmFsODAgOiBjb2xvcnMubmV1dHJhbDQwLFxuICB9LFxufSk7XG5cbmV4cG9ydCBjb25zdCBkcm9wZG93bkluZGljYXRvckNTUyA9IGJhc2VDU1M7XG5leHBvcnQgY29uc3QgRHJvcGRvd25JbmRpY2F0b3IgPSA8XG4gIE9wdGlvbixcbiAgSXNNdWx0aSBleHRlbmRzIGJvb2xlYW4sXG4gIEdyb3VwIGV4dGVuZHMgR3JvdXBCYXNlPE9wdGlvbj5cbj4oXG4gIHByb3BzOiBEcm9wZG93bkluZGljYXRvclByb3BzPE9wdGlvbiwgSXNNdWx0aSwgR3JvdXA+XG4pID0+IHtcbiAgY29uc3QgeyBjaGlsZHJlbiwgY2xhc3NOYW1lLCBjeCwgZ2V0U3R5bGVzLCBpbm5lclByb3BzIH0gPSBwcm9wcztcbiAgcmV0dXJuIChcbiAgICA8ZGl2XG4gICAgICBjc3M9e2dldFN0eWxlcygnZHJvcGRvd25JbmRpY2F0b3InLCBwcm9wcyl9XG4gICAgICBjbGFzc05hbWU9e2N4KFxuICAgICAgICB7XG4gICAgICAgICAgaW5kaWNhdG9yOiB0cnVlLFxuICAgICAgICAgICdkcm9wZG93bi1pbmRpY2F0b3InOiB0cnVlLFxuICAgICAgICB9LFxuICAgICAgICBjbGFzc05hbWVcbiAgICAgICl9XG4gICAgICB7Li4uaW5uZXJQcm9wc31cbiAgICA+XG4gICAgICB7Y2hpbGRyZW4gfHwgPERvd25DaGV2cm9uIC8+fVxuICAgIDwvZGl2PlxuICApO1xufTtcblxuZXhwb3J0IGludGVyZmFjZSBDbGVhckluZGljYXRvclByb3BzPFxuICBPcHRpb24gPSB1bmtub3duLFxuICBJc011bHRpIGV4dGVuZHMgYm9vbGVhbiA9IGJvb2xlYW4sXG4gIEdyb3VwIGV4dGVuZHMgR3JvdXBCYXNlPE9wdGlvbj4gPSBHcm91cEJhc2U8T3B0aW9uPlxuPiBleHRlbmRzIENvbW1vblByb3BzQW5kQ2xhc3NOYW1lPE9wdGlvbiwgSXNNdWx0aSwgR3JvdXA+IHtcbiAgLyoqIFRoZSBjaGlsZHJlbiB0byBiZSByZW5kZXJlZCBpbnNpZGUgdGhlIGluZGljYXRvci4gKi9cbiAgY2hpbGRyZW4/OiBSZWFjdE5vZGU7XG4gIC8qKiBQcm9wcyB0aGF0IHdpbGwgYmUgcGFzc2VkIG9uIHRvIHRoZSBjaGlsZHJlbi4gKi9cbiAgaW5uZXJQcm9wczogSlNYLkludHJpbnNpY0VsZW1lbnRzWydkaXYnXTtcbiAgLyoqIFRoZSBmb2N1c2VkIHN0YXRlIG9mIHRoZSBzZWxlY3QuICovXG4gIGlzRm9jdXNlZDogYm9vbGVhbjtcbn1cblxuZXhwb3J0IGNvbnN0IGNsZWFySW5kaWNhdG9yQ1NTID0gYmFzZUNTUztcbmV4cG9ydCBjb25zdCBDbGVhckluZGljYXRvciA9IDxcbiAgT3B0aW9uLFxuICBJc011bHRpIGV4dGVuZHMgYm9vbGVhbixcbiAgR3JvdXAgZXh0ZW5kcyBHcm91cEJhc2U8T3B0aW9uPlxuPihcbiAgcHJvcHM6IENsZWFySW5kaWNhdG9yUHJvcHM8T3B0aW9uLCBJc011bHRpLCBHcm91cD5cbikgPT4ge1xuICBjb25zdCB7IGNoaWxkcmVuLCBjbGFzc05hbWUsIGN4LCBnZXRTdHlsZXMsIGlubmVyUHJvcHMgfSA9IHByb3BzO1xuICByZXR1cm4gKFxuICAgIDxkaXZcbiAgICAgIGNzcz17Z2V0U3R5bGVzKCdjbGVhckluZGljYXRvcicsIHByb3BzKX1cbiAgICAgIGNsYXNzTmFtZT17Y3goXG4gICAgICAgIHtcbiAgICAgICAgICBpbmRpY2F0b3I6IHRydWUsXG4gICAgICAgICAgJ2NsZWFyLWluZGljYXRvcic6IHRydWUsXG4gICAgICAgIH0sXG4gICAgICAgIGNsYXNzTmFtZVxuICAgICAgKX1cbiAgICAgIHsuLi5pbm5lclByb3BzfVxuICAgID5cbiAgICAgIHtjaGlsZHJlbiB8fCA8Q3Jvc3NJY29uIC8+fVxuICAgIDwvZGl2PlxuICApO1xufTtcblxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4vLyBTZXBhcmF0b3Jcbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG5leHBvcnQgaW50ZXJmYWNlIEluZGljYXRvclNlcGFyYXRvclByb3BzPFxuICBPcHRpb24gPSB1bmtub3duLFxuICBJc011bHRpIGV4dGVuZHMgYm9vbGVhbiA9IGJvb2xlYW4sXG4gIEdyb3VwIGV4dGVuZHMgR3JvdXBCYXNlPE9wdGlvbj4gPSBHcm91cEJhc2U8T3B0aW9uPlxuPiBleHRlbmRzIENvbW1vblByb3BzQW5kQ2xhc3NOYW1lPE9wdGlvbiwgSXNNdWx0aSwgR3JvdXA+IHtcbiAgaXNEaXNhYmxlZDogYm9vbGVhbjtcbiAgaXNGb2N1c2VkOiBib29sZWFuO1xuICBpbm5lclByb3BzPzogSlNYLkludHJpbnNpY0VsZW1lbnRzWydzcGFuJ107XG59XG5cbmV4cG9ydCBjb25zdCBpbmRpY2F0b3JTZXBhcmF0b3JDU1MgPSA8XG4gIE9wdGlvbixcbiAgSXNNdWx0aSBleHRlbmRzIGJvb2xlYW4sXG4gIEdyb3VwIGV4dGVuZHMgR3JvdXBCYXNlPE9wdGlvbj5cbj4oe1xuICBpc0Rpc2FibGVkLFxuICB0aGVtZToge1xuICAgIHNwYWNpbmc6IHsgYmFzZVVuaXQgfSxcbiAgICBjb2xvcnMsXG4gIH0sXG59OiBJbmRpY2F0b3JTZXBhcmF0b3JQcm9wczxPcHRpb24sIElzTXVsdGksIEdyb3VwPik6IENTU09iamVjdFdpdGhMYWJlbCA9PiAoe1xuICBsYWJlbDogJ2luZGljYXRvclNlcGFyYXRvcicsXG4gIGFsaWduU2VsZjogJ3N0cmV0Y2gnLFxuICBiYWNrZ3JvdW5kQ29sb3I6IGlzRGlzYWJsZWQgPyBjb2xvcnMubmV1dHJhbDEwIDogY29sb3JzLm5ldXRyYWwyMCxcbiAgbWFyZ2luQm90dG9tOiBiYXNlVW5pdCAqIDIsXG4gIG1hcmdpblRvcDogYmFzZVVuaXQgKiAyLFxuICB3aWR0aDogMSxcbn0pO1xuXG5leHBvcnQgY29uc3QgSW5kaWNhdG9yU2VwYXJhdG9yID0gPFxuICBPcHRpb24sXG4gIElzTXVsdGkgZXh0ZW5kcyBib29sZWFuLFxuICBHcm91cCBleHRlbmRzIEdyb3VwQmFzZTxPcHRpb24+XG4+KFxuICBwcm9wczogSW5kaWNhdG9yU2VwYXJhdG9yUHJvcHM8T3B0aW9uLCBJc011bHRpLCBHcm91cD5cbikgPT4ge1xuICBjb25zdCB7IGNsYXNzTmFtZSwgY3gsIGdldFN0eWxlcywgaW5uZXJQcm9wcyB9ID0gcHJvcHM7XG4gIHJldHVybiAoXG4gICAgPHNwYW5cbiAgICAgIHsuLi5pbm5lclByb3BzfVxuICAgICAgY3NzPXtnZXRTdHlsZXMoJ2luZGljYXRvclNlcGFyYXRvcicsIHByb3BzKX1cbiAgICAgIGNsYXNzTmFtZT17Y3goeyAnaW5kaWNhdG9yLXNlcGFyYXRvcic6IHRydWUgfSwgY2xhc3NOYW1lKX1cbiAgICAvPlxuICApO1xufTtcblxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4vLyBMb2FkaW5nXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuY29uc3QgbG9hZGluZ0RvdEFuaW1hdGlvbnMgPSBrZXlmcmFtZXNgXG4gIDAlLCA4MCUsIDEwMCUgeyBvcGFjaXR5OiAwOyB9XG4gIDQwJSB7IG9wYWNpdHk6IDE7IH1cbmA7XG5cbmV4cG9ydCBjb25zdCBsb2FkaW5nSW5kaWNhdG9yQ1NTID0gPFxuICBPcHRpb24sXG4gIElzTXVsdGkgZXh0ZW5kcyBib29sZWFuLFxuICBHcm91cCBleHRlbmRzIEdyb3VwQmFzZTxPcHRpb24+XG4+KHtcbiAgaXNGb2N1c2VkLFxuICBzaXplLFxuICB0aGVtZToge1xuICAgIGNvbG9ycyxcbiAgICBzcGFjaW5nOiB7IGJhc2VVbml0IH0sXG4gIH0sXG59OiBMb2FkaW5nSW5kaWNhdG9yUHJvcHM8T3B0aW9uLCBJc011bHRpLCBHcm91cD4pOiBDU1NPYmplY3RXaXRoTGFiZWwgPT4gKHtcbiAgbGFiZWw6ICdsb2FkaW5nSW5kaWNhdG9yJyxcbiAgY29sb3I6IGlzRm9jdXNlZCA/IGNvbG9ycy5uZXV0cmFsNjAgOiBjb2xvcnMubmV1dHJhbDIwLFxuICBkaXNwbGF5OiAnZmxleCcsXG4gIHBhZGRpbmc6IGJhc2VVbml0ICogMixcbiAgdHJhbnNpdGlvbjogJ2NvbG9yIDE1MG1zJyxcbiAgYWxpZ25TZWxmOiAnY2VudGVyJyxcbiAgZm9udFNpemU6IHNpemUsXG4gIGxpbmVIZWlnaHQ6IDEsXG4gIG1hcmdpblJpZ2h0OiBzaXplLFxuICB0ZXh0QWxpZ246ICdjZW50ZXInLFxuICB2ZXJ0aWNhbEFsaWduOiAnbWlkZGxlJyxcbn0pO1xuXG5pbnRlcmZhY2UgTG9hZGluZ0RvdFByb3BzIHtcbiAgZGVsYXk6IG51bWJlcjtcbiAgb2Zmc2V0OiBib29sZWFuO1xufVxuY29uc3QgTG9hZGluZ0RvdCA9ICh7IGRlbGF5LCBvZmZzZXQgfTogTG9hZGluZ0RvdFByb3BzKSA9PiAoXG4gIDxzcGFuXG4gICAgY3NzPXt7XG4gICAgICBhbmltYXRpb246IGAke2xvYWRpbmdEb3RBbmltYXRpb25zfSAxcyBlYXNlLWluLW91dCAke2RlbGF5fW1zIGluZmluaXRlO2AsXG4gICAgICBiYWNrZ3JvdW5kQ29sb3I6ICdjdXJyZW50Q29sb3InLFxuICAgICAgYm9yZGVyUmFkaXVzOiAnMWVtJyxcbiAgICAgIGRpc3BsYXk6ICdpbmxpbmUtYmxvY2snLFxuICAgICAgbWFyZ2luTGVmdDogb2Zmc2V0ID8gJzFlbScgOiB1bmRlZmluZWQsXG4gICAgICBoZWlnaHQ6ICcxZW0nLFxuICAgICAgdmVydGljYWxBbGlnbjogJ3RvcCcsXG4gICAgICB3aWR0aDogJzFlbScsXG4gICAgfX1cbiAgLz5cbik7XG5cbmV4cG9ydCBpbnRlcmZhY2UgTG9hZGluZ0luZGljYXRvclByb3BzPFxuICBPcHRpb24gPSB1bmtub3duLFxuICBJc011bHRpIGV4dGVuZHMgYm9vbGVhbiA9IGJvb2xlYW4sXG4gIEdyb3VwIGV4dGVuZHMgR3JvdXBCYXNlPE9wdGlvbj4gPSBHcm91cEJhc2U8T3B0aW9uPlxuPiBleHRlbmRzIENvbW1vblByb3BzQW5kQ2xhc3NOYW1lPE9wdGlvbiwgSXNNdWx0aSwgR3JvdXA+IHtcbiAgLyoqIFByb3BzIHRoYXQgd2lsbCBiZSBwYXNzZWQgb24gdG8gdGhlIGNoaWxkcmVuLiAqL1xuICBpbm5lclByb3BzOiBKU1guSW50cmluc2ljRWxlbWVudHNbJ2RpdiddO1xuICAvKiogVGhlIGZvY3VzZWQgc3RhdGUgb2YgdGhlIHNlbGVjdC4gKi9cbiAgaXNGb2N1c2VkOiBib29sZWFuO1xuICBpc0Rpc2FibGVkOiBib29sZWFuO1xuICAvKiogU2V0IHNpemUgb2YgdGhlIGNvbnRhaW5lci4gKi9cbiAgc2l6ZTogbnVtYmVyO1xufVxuZXhwb3J0IGNvbnN0IExvYWRpbmdJbmRpY2F0b3IgPSA8XG4gIE9wdGlvbixcbiAgSXNNdWx0aSBleHRlbmRzIGJvb2xlYW4sXG4gIEdyb3VwIGV4dGVuZHMgR3JvdXBCYXNlPE9wdGlvbj5cbj4oXG4gIHByb3BzOiBMb2FkaW5nSW5kaWNhdG9yUHJvcHM8T3B0aW9uLCBJc011bHRpLCBHcm91cD5cbikgPT4ge1xuICBjb25zdCB7IGNsYXNzTmFtZSwgY3gsIGdldFN0eWxlcywgaW5uZXJQcm9wcywgaXNSdGwgfSA9IHByb3BzO1xuXG4gIHJldHVybiAoXG4gICAgPGRpdlxuICAgICAgY3NzPXtnZXRTdHlsZXMoJ2xvYWRpbmdJbmRpY2F0b3InLCBwcm9wcyl9XG4gICAgICBjbGFzc05hbWU9e2N4KFxuICAgICAgICB7XG4gICAgICAgICAgaW5kaWNhdG9yOiB0cnVlLFxuICAgICAgICAgICdsb2FkaW5nLWluZGljYXRvcic6IHRydWUsXG4gICAgICAgIH0sXG4gICAgICAgIGNsYXNzTmFtZVxuICAgICAgKX1cbiAgICAgIHsuLi5pbm5lclByb3BzfVxuICAgID5cbiAgICAgIDxMb2FkaW5nRG90IGRlbGF5PXswfSBvZmZzZXQ9e2lzUnRsfSAvPlxuICAgICAgPExvYWRpbmdEb3QgZGVsYXk9ezE2MH0gb2Zmc2V0IC8+XG4gICAgICA8TG9hZGluZ0RvdCBkZWxheT17MzIwfSBvZmZzZXQ9eyFpc1J0bH0gLz5cbiAgICA8L2Rpdj5cbiAgKTtcbn07XG5Mb2FkaW5nSW5kaWNhdG9yLmRlZmF1bHRQcm9wcyA9IHsgc2l6ZTogNCB9O1xuIl19 */",
  toString: _EMOTION_STRINGIFIED_CSS_ERROR__
};

// ==============================
// Dropdown & Clear Icons
// ==============================
var Svg = function Svg(_ref) {
  var size = _ref.size,
      props = (0,_babel_runtime_helpers_esm_objectWithoutProperties__WEBPACK_IMPORTED_MODULE_2__["default"])(_ref, _excluded$2);

  return (0,_emotion_react__WEBPACK_IMPORTED_MODULE_11__.jsx)("svg", (0,_babel_runtime_helpers_esm_extends__WEBPACK_IMPORTED_MODULE_0__["default"])({
    height: size,
    width: size,
    viewBox: "0 0 20 20",
    "aria-hidden": "true",
    focusable: "false",
    css: _ref2
  }, props));
};

var CrossIcon = function CrossIcon(props) {
  return (0,_emotion_react__WEBPACK_IMPORTED_MODULE_11__.jsx)(Svg, (0,_babel_runtime_helpers_esm_extends__WEBPACK_IMPORTED_MODULE_0__["default"])({
    size: 20
  }, props), (0,_emotion_react__WEBPACK_IMPORTED_MODULE_11__.jsx)("path", {
    d: "M14.348 14.849c-0.469 0.469-1.229 0.469-1.697 0l-2.651-3.030-2.651 3.029c-0.469 0.469-1.229 0.469-1.697 0-0.469-0.469-0.469-1.229 0-1.697l2.758-3.15-2.759-3.152c-0.469-0.469-0.469-1.228 0-1.697s1.228-0.469 1.697 0l2.652 3.031 2.651-3.031c0.469-0.469 1.228-0.469 1.697 0s0.469 1.229 0 1.697l-2.758 3.152 2.758 3.15c0.469 0.469 0.469 1.229 0 1.698z"
  }));
};
var DownChevron = function DownChevron(props) {
  return (0,_emotion_react__WEBPACK_IMPORTED_MODULE_11__.jsx)(Svg, (0,_babel_runtime_helpers_esm_extends__WEBPACK_IMPORTED_MODULE_0__["default"])({
    size: 20
  }, props), (0,_emotion_react__WEBPACK_IMPORTED_MODULE_11__.jsx)("path", {
    d: "M4.516 7.548c0.436-0.446 1.043-0.481 1.576 0l3.908 3.747 3.908-3.747c0.533-0.481 1.141-0.446 1.574 0 0.436 0.445 0.408 1.197 0 1.615-0.406 0.418-4.695 4.502-4.695 4.502-0.217 0.223-0.502 0.335-0.787 0.335s-0.57-0.112-0.789-0.335c0 0-4.287-4.084-4.695-4.502s-0.436-1.17 0-1.615z"
  }));
}; // ==============================
// Dropdown & Clear Buttons
// ==============================

var baseCSS = function baseCSS(_ref3) {
  var isFocused = _ref3.isFocused,
      _ref3$theme = _ref3.theme,
      baseUnit = _ref3$theme.spacing.baseUnit,
      colors = _ref3$theme.colors;
  return {
    label: 'indicatorContainer',
    color: isFocused ? colors.neutral60 : colors.neutral20,
    display: 'flex',
    padding: baseUnit * 2,
    transition: 'color 150ms',
    ':hover': {
      color: isFocused ? colors.neutral80 : colors.neutral40
    }
  };
};

var dropdownIndicatorCSS = baseCSS;
var DropdownIndicator = function DropdownIndicator(props) {
  var children = props.children,
      className = props.className,
      cx = props.cx,
      getStyles = props.getStyles,
      innerProps = props.innerProps;
  return (0,_emotion_react__WEBPACK_IMPORTED_MODULE_11__.jsx)("div", (0,_babel_runtime_helpers_esm_extends__WEBPACK_IMPORTED_MODULE_0__["default"])({
    css: getStyles('dropdownIndicator', props),
    className: cx({
      indicator: true,
      'dropdown-indicator': true
    }, className)
  }, innerProps), children || (0,_emotion_react__WEBPACK_IMPORTED_MODULE_11__.jsx)(DownChevron, null));
};
var clearIndicatorCSS = baseCSS;
var ClearIndicator = function ClearIndicator(props) {
  var children = props.children,
      className = props.className,
      cx = props.cx,
      getStyles = props.getStyles,
      innerProps = props.innerProps;
  return (0,_emotion_react__WEBPACK_IMPORTED_MODULE_11__.jsx)("div", (0,_babel_runtime_helpers_esm_extends__WEBPACK_IMPORTED_MODULE_0__["default"])({
    css: getStyles('clearIndicator', props),
    className: cx({
      indicator: true,
      'clear-indicator': true
    }, className)
  }, innerProps), children || (0,_emotion_react__WEBPACK_IMPORTED_MODULE_11__.jsx)(CrossIcon, null));
}; // ==============================
// Separator
// ==============================

var indicatorSeparatorCSS = function indicatorSeparatorCSS(_ref4) {
  var isDisabled = _ref4.isDisabled,
      _ref4$theme = _ref4.theme,
      baseUnit = _ref4$theme.spacing.baseUnit,
      colors = _ref4$theme.colors;
  return {
    label: 'indicatorSeparator',
    alignSelf: 'stretch',
    backgroundColor: isDisabled ? colors.neutral10 : colors.neutral20,
    marginBottom: baseUnit * 2,
    marginTop: baseUnit * 2,
    width: 1
  };
};
var IndicatorSeparator = function IndicatorSeparator(props) {
  var className = props.className,
      cx = props.cx,
      getStyles = props.getStyles,
      innerProps = props.innerProps;
  return (0,_emotion_react__WEBPACK_IMPORTED_MODULE_11__.jsx)("span", (0,_babel_runtime_helpers_esm_extends__WEBPACK_IMPORTED_MODULE_0__["default"])({}, innerProps, {
    css: getStyles('indicatorSeparator', props),
    className: cx({
      'indicator-separator': true
    }, className)
  }));
}; // ==============================
// Loading
// ==============================

var loadingDotAnimations = (0,_emotion_react__WEBPACK_IMPORTED_MODULE_11__.keyframes)(_templateObject || (_templateObject = (0,_babel_runtime_helpers_esm_taggedTemplateLiteral__WEBPACK_IMPORTED_MODULE_1__["default"])(["\n  0%, 80%, 100% { opacity: 0; }\n  40% { opacity: 1; }\n"])));
var loadingIndicatorCSS = function loadingIndicatorCSS(_ref5) {
  var isFocused = _ref5.isFocused,
      size = _ref5.size,
      _ref5$theme = _ref5.theme,
      colors = _ref5$theme.colors,
      baseUnit = _ref5$theme.spacing.baseUnit;
  return {
    label: 'loadingIndicator',
    color: isFocused ? colors.neutral60 : colors.neutral20,
    display: 'flex',
    padding: baseUnit * 2,
    transition: 'color 150ms',
    alignSelf: 'center',
    fontSize: size,
    lineHeight: 1,
    marginRight: size,
    textAlign: 'center',
    verticalAlign: 'middle'
  };
};

var LoadingDot = function LoadingDot(_ref6) {
  var delay = _ref6.delay,
      offset = _ref6.offset;
  return (0,_emotion_react__WEBPACK_IMPORTED_MODULE_11__.jsx)("span", {
    css: /*#__PURE__*/(0,_emotion_react__WEBPACK_IMPORTED_MODULE_11__.css)({
      animation: "".concat(loadingDotAnimations, " 1s ease-in-out ").concat(delay, "ms infinite;"),
      backgroundColor: 'currentColor',
      borderRadius: '1em',
      display: 'inline-block',
      marginLeft: offset ? '1em' : undefined,
      height: '1em',
      verticalAlign: 'top',
      width: '1em'
    },  false ? 0 : ";label:LoadingDot;",  false ? 0 : "/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImluZGljYXRvcnMudHN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQXFQSSIsImZpbGUiOiJpbmRpY2F0b3JzLnRzeCIsInNvdXJjZXNDb250ZW50IjpbIi8qKiBAanN4IGpzeCAqL1xuaW1wb3J0IHsgUmVhY3ROb2RlIH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IHsganN4LCBrZXlmcmFtZXMgfSBmcm9tICdAZW1vdGlvbi9yZWFjdCc7XG5cbmltcG9ydCB7XG4gIENvbW1vblByb3BzQW5kQ2xhc3NOYW1lLFxuICBDU1NPYmplY3RXaXRoTGFiZWwsXG4gIEdyb3VwQmFzZSxcbn0gZnJvbSAnLi4vdHlwZXMnO1xuXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbi8vIERyb3Bkb3duICYgQ2xlYXIgSWNvbnNcbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG5jb25zdCBTdmcgPSAoe1xuICBzaXplLFxuICAuLi5wcm9wc1xufTogSlNYLkludHJpbnNpY0VsZW1lbnRzWydzdmcnXSAmIHsgc2l6ZTogbnVtYmVyIH0pID0+IChcbiAgPHN2Z1xuICAgIGhlaWdodD17c2l6ZX1cbiAgICB3aWR0aD17c2l6ZX1cbiAgICB2aWV3Qm94PVwiMCAwIDIwIDIwXCJcbiAgICBhcmlhLWhpZGRlbj1cInRydWVcIlxuICAgIGZvY3VzYWJsZT1cImZhbHNlXCJcbiAgICBjc3M9e3tcbiAgICAgIGRpc3BsYXk6ICdpbmxpbmUtYmxvY2snLFxuICAgICAgZmlsbDogJ2N1cnJlbnRDb2xvcicsXG4gICAgICBsaW5lSGVpZ2h0OiAxLFxuICAgICAgc3Ryb2tlOiAnY3VycmVudENvbG9yJyxcbiAgICAgIHN0cm9rZVdpZHRoOiAwLFxuICAgIH19XG4gICAgey4uLnByb3BzfVxuICAvPlxuKTtcblxuZXhwb3J0IHR5cGUgQ3Jvc3NJY29uUHJvcHMgPSBKU1guSW50cmluc2ljRWxlbWVudHNbJ3N2ZyddICYgeyBzaXplPzogbnVtYmVyIH07XG5leHBvcnQgY29uc3QgQ3Jvc3NJY29uID0gKHByb3BzOiBDcm9zc0ljb25Qcm9wcykgPT4gKFxuICA8U3ZnIHNpemU9ezIwfSB7Li4ucHJvcHN9PlxuICAgIDxwYXRoIGQ9XCJNMTQuMzQ4IDE0Ljg0OWMtMC40NjkgMC40NjktMS4yMjkgMC40NjktMS42OTcgMGwtMi42NTEtMy4wMzAtMi42NTEgMy4wMjljLTAuNDY5IDAuNDY5LTEuMjI5IDAuNDY5LTEuNjk3IDAtMC40NjktMC40NjktMC40NjktMS4yMjkgMC0xLjY5N2wyLjc1OC0zLjE1LTIuNzU5LTMuMTUyYy0wLjQ2OS0wLjQ2OS0wLjQ2OS0xLjIyOCAwLTEuNjk3czEuMjI4LTAuNDY5IDEuNjk3IDBsMi42NTIgMy4wMzEgMi42NTEtMy4wMzFjMC40NjktMC40NjkgMS4yMjgtMC40NjkgMS42OTcgMHMwLjQ2OSAxLjIyOSAwIDEuNjk3bC0yLjc1OCAzLjE1MiAyLjc1OCAzLjE1YzAuNDY5IDAuNDY5IDAuNDY5IDEuMjI5IDAgMS42OTh6XCIgLz5cbiAgPC9Tdmc+XG4pO1xuZXhwb3J0IHR5cGUgRG93bkNoZXZyb25Qcm9wcyA9IEpTWC5JbnRyaW5zaWNFbGVtZW50c1snc3ZnJ10gJiB7IHNpemU/OiBudW1iZXIgfTtcbmV4cG9ydCBjb25zdCBEb3duQ2hldnJvbiA9IChwcm9wczogRG93bkNoZXZyb25Qcm9wcykgPT4gKFxuICA8U3ZnIHNpemU9ezIwfSB7Li4ucHJvcHN9PlxuICAgIDxwYXRoIGQ9XCJNNC41MTYgNy41NDhjMC40MzYtMC40NDYgMS4wNDMtMC40ODEgMS41NzYgMGwzLjkwOCAzLjc0NyAzLjkwOC0zLjc0N2MwLjUzMy0wLjQ4MSAxLjE0MS0wLjQ0NiAxLjU3NCAwIDAuNDM2IDAuNDQ1IDAuNDA4IDEuMTk3IDAgMS42MTUtMC40MDYgMC40MTgtNC42OTUgNC41MDItNC42OTUgNC41MDItMC4yMTcgMC4yMjMtMC41MDIgMC4zMzUtMC43ODcgMC4zMzVzLTAuNTctMC4xMTItMC43ODktMC4zMzVjMCAwLTQuMjg3LTQuMDg0LTQuNjk1LTQuNTAycy0wLjQzNi0xLjE3IDAtMS42MTV6XCIgLz5cbiAgPC9Tdmc+XG4pO1xuXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbi8vIERyb3Bkb3duICYgQ2xlYXIgQnV0dG9uc1xuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbmV4cG9ydCBpbnRlcmZhY2UgRHJvcGRvd25JbmRpY2F0b3JQcm9wczxcbiAgT3B0aW9uID0gdW5rbm93bixcbiAgSXNNdWx0aSBleHRlbmRzIGJvb2xlYW4gPSBib29sZWFuLFxuICBHcm91cCBleHRlbmRzIEdyb3VwQmFzZTxPcHRpb24+ID0gR3JvdXBCYXNlPE9wdGlvbj5cbj4gZXh0ZW5kcyBDb21tb25Qcm9wc0FuZENsYXNzTmFtZTxPcHRpb24sIElzTXVsdGksIEdyb3VwPiB7XG4gIC8qKiBUaGUgY2hpbGRyZW4gdG8gYmUgcmVuZGVyZWQgaW5zaWRlIHRoZSBpbmRpY2F0b3IuICovXG4gIGNoaWxkcmVuPzogUmVhY3ROb2RlO1xuICAvKiogUHJvcHMgdGhhdCB3aWxsIGJlIHBhc3NlZCBvbiB0byB0aGUgY2hpbGRyZW4uICovXG4gIGlubmVyUHJvcHM6IEpTWC5JbnRyaW5zaWNFbGVtZW50c1snZGl2J107XG4gIC8qKiBUaGUgZm9jdXNlZCBzdGF0ZSBvZiB0aGUgc2VsZWN0LiAqL1xuICBpc0ZvY3VzZWQ6IGJvb2xlYW47XG4gIGlzRGlzYWJsZWQ6IGJvb2xlYW47XG59XG5cbmNvbnN0IGJhc2VDU1MgPSA8XG4gIE9wdGlvbixcbiAgSXNNdWx0aSBleHRlbmRzIGJvb2xlYW4sXG4gIEdyb3VwIGV4dGVuZHMgR3JvdXBCYXNlPE9wdGlvbj5cbj4oe1xuICBpc0ZvY3VzZWQsXG4gIHRoZW1lOiB7XG4gICAgc3BhY2luZzogeyBiYXNlVW5pdCB9LFxuICAgIGNvbG9ycyxcbiAgfSxcbn06XG4gIHwgRHJvcGRvd25JbmRpY2F0b3JQcm9wczxPcHRpb24sIElzTXVsdGksIEdyb3VwPlxuICB8IENsZWFySW5kaWNhdG9yUHJvcHM8T3B0aW9uLCBJc011bHRpLCBHcm91cD4pOiBDU1NPYmplY3RXaXRoTGFiZWwgPT4gKHtcbiAgbGFiZWw6ICdpbmRpY2F0b3JDb250YWluZXInLFxuICBjb2xvcjogaXNGb2N1c2VkID8gY29sb3JzLm5ldXRyYWw2MCA6IGNvbG9ycy5uZXV0cmFsMjAsXG4gIGRpc3BsYXk6ICdmbGV4JyxcbiAgcGFkZGluZzogYmFzZVVuaXQgKiAyLFxuICB0cmFuc2l0aW9uOiAnY29sb3IgMTUwbXMnLFxuXG4gICc6aG92ZXInOiB7XG4gICAgY29sb3I6IGlzRm9jdXNlZCA/IGNvbG9ycy5uZXV0cmFsODAgOiBjb2xvcnMubmV1dHJhbDQwLFxuICB9LFxufSk7XG5cbmV4cG9ydCBjb25zdCBkcm9wZG93bkluZGljYXRvckNTUyA9IGJhc2VDU1M7XG5leHBvcnQgY29uc3QgRHJvcGRvd25JbmRpY2F0b3IgPSA8XG4gIE9wdGlvbixcbiAgSXNNdWx0aSBleHRlbmRzIGJvb2xlYW4sXG4gIEdyb3VwIGV4dGVuZHMgR3JvdXBCYXNlPE9wdGlvbj5cbj4oXG4gIHByb3BzOiBEcm9wZG93bkluZGljYXRvclByb3BzPE9wdGlvbiwgSXNNdWx0aSwgR3JvdXA+XG4pID0+IHtcbiAgY29uc3QgeyBjaGlsZHJlbiwgY2xhc3NOYW1lLCBjeCwgZ2V0U3R5bGVzLCBpbm5lclByb3BzIH0gPSBwcm9wcztcbiAgcmV0dXJuIChcbiAgICA8ZGl2XG4gICAgICBjc3M9e2dldFN0eWxlcygnZHJvcGRvd25JbmRpY2F0b3InLCBwcm9wcyl9XG4gICAgICBjbGFzc05hbWU9e2N4KFxuICAgICAgICB7XG4gICAgICAgICAgaW5kaWNhdG9yOiB0cnVlLFxuICAgICAgICAgICdkcm9wZG93bi1pbmRpY2F0b3InOiB0cnVlLFxuICAgICAgICB9LFxuICAgICAgICBjbGFzc05hbWVcbiAgICAgICl9XG4gICAgICB7Li4uaW5uZXJQcm9wc31cbiAgICA+XG4gICAgICB7Y2hpbGRyZW4gfHwgPERvd25DaGV2cm9uIC8+fVxuICAgIDwvZGl2PlxuICApO1xufTtcblxuZXhwb3J0IGludGVyZmFjZSBDbGVhckluZGljYXRvclByb3BzPFxuICBPcHRpb24gPSB1bmtub3duLFxuICBJc011bHRpIGV4dGVuZHMgYm9vbGVhbiA9IGJvb2xlYW4sXG4gIEdyb3VwIGV4dGVuZHMgR3JvdXBCYXNlPE9wdGlvbj4gPSBHcm91cEJhc2U8T3B0aW9uPlxuPiBleHRlbmRzIENvbW1vblByb3BzQW5kQ2xhc3NOYW1lPE9wdGlvbiwgSXNNdWx0aSwgR3JvdXA+IHtcbiAgLyoqIFRoZSBjaGlsZHJlbiB0byBiZSByZW5kZXJlZCBpbnNpZGUgdGhlIGluZGljYXRvci4gKi9cbiAgY2hpbGRyZW4/OiBSZWFjdE5vZGU7XG4gIC8qKiBQcm9wcyB0aGF0IHdpbGwgYmUgcGFzc2VkIG9uIHRvIHRoZSBjaGlsZHJlbi4gKi9cbiAgaW5uZXJQcm9wczogSlNYLkludHJpbnNpY0VsZW1lbnRzWydkaXYnXTtcbiAgLyoqIFRoZSBmb2N1c2VkIHN0YXRlIG9mIHRoZSBzZWxlY3QuICovXG4gIGlzRm9jdXNlZDogYm9vbGVhbjtcbn1cblxuZXhwb3J0IGNvbnN0IGNsZWFySW5kaWNhdG9yQ1NTID0gYmFzZUNTUztcbmV4cG9ydCBjb25zdCBDbGVhckluZGljYXRvciA9IDxcbiAgT3B0aW9uLFxuICBJc011bHRpIGV4dGVuZHMgYm9vbGVhbixcbiAgR3JvdXAgZXh0ZW5kcyBHcm91cEJhc2U8T3B0aW9uPlxuPihcbiAgcHJvcHM6IENsZWFySW5kaWNhdG9yUHJvcHM8T3B0aW9uLCBJc011bHRpLCBHcm91cD5cbikgPT4ge1xuICBjb25zdCB7IGNoaWxkcmVuLCBjbGFzc05hbWUsIGN4LCBnZXRTdHlsZXMsIGlubmVyUHJvcHMgfSA9IHByb3BzO1xuICByZXR1cm4gKFxuICAgIDxkaXZcbiAgICAgIGNzcz17Z2V0U3R5bGVzKCdjbGVhckluZGljYXRvcicsIHByb3BzKX1cbiAgICAgIGNsYXNzTmFtZT17Y3goXG4gICAgICAgIHtcbiAgICAgICAgICBpbmRpY2F0b3I6IHRydWUsXG4gICAgICAgICAgJ2NsZWFyLWluZGljYXRvcic6IHRydWUsXG4gICAgICAgIH0sXG4gICAgICAgIGNsYXNzTmFtZVxuICAgICAgKX1cbiAgICAgIHsuLi5pbm5lclByb3BzfVxuICAgID5cbiAgICAgIHtjaGlsZHJlbiB8fCA8Q3Jvc3NJY29uIC8+fVxuICAgIDwvZGl2PlxuICApO1xufTtcblxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4vLyBTZXBhcmF0b3Jcbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG5leHBvcnQgaW50ZXJmYWNlIEluZGljYXRvclNlcGFyYXRvclByb3BzPFxuICBPcHRpb24gPSB1bmtub3duLFxuICBJc011bHRpIGV4dGVuZHMgYm9vbGVhbiA9IGJvb2xlYW4sXG4gIEdyb3VwIGV4dGVuZHMgR3JvdXBCYXNlPE9wdGlvbj4gPSBHcm91cEJhc2U8T3B0aW9uPlxuPiBleHRlbmRzIENvbW1vblByb3BzQW5kQ2xhc3NOYW1lPE9wdGlvbiwgSXNNdWx0aSwgR3JvdXA+IHtcbiAgaXNEaXNhYmxlZDogYm9vbGVhbjtcbiAgaXNGb2N1c2VkOiBib29sZWFuO1xuICBpbm5lclByb3BzPzogSlNYLkludHJpbnNpY0VsZW1lbnRzWydzcGFuJ107XG59XG5cbmV4cG9ydCBjb25zdCBpbmRpY2F0b3JTZXBhcmF0b3JDU1MgPSA8XG4gIE9wdGlvbixcbiAgSXNNdWx0aSBleHRlbmRzIGJvb2xlYW4sXG4gIEdyb3VwIGV4dGVuZHMgR3JvdXBCYXNlPE9wdGlvbj5cbj4oe1xuICBpc0Rpc2FibGVkLFxuICB0aGVtZToge1xuICAgIHNwYWNpbmc6IHsgYmFzZVVuaXQgfSxcbiAgICBjb2xvcnMsXG4gIH0sXG59OiBJbmRpY2F0b3JTZXBhcmF0b3JQcm9wczxPcHRpb24sIElzTXVsdGksIEdyb3VwPik6IENTU09iamVjdFdpdGhMYWJlbCA9PiAoe1xuICBsYWJlbDogJ2luZGljYXRvclNlcGFyYXRvcicsXG4gIGFsaWduU2VsZjogJ3N0cmV0Y2gnLFxuICBiYWNrZ3JvdW5kQ29sb3I6IGlzRGlzYWJsZWQgPyBjb2xvcnMubmV1dHJhbDEwIDogY29sb3JzLm5ldXRyYWwyMCxcbiAgbWFyZ2luQm90dG9tOiBiYXNlVW5pdCAqIDIsXG4gIG1hcmdpblRvcDogYmFzZVVuaXQgKiAyLFxuICB3aWR0aDogMSxcbn0pO1xuXG5leHBvcnQgY29uc3QgSW5kaWNhdG9yU2VwYXJhdG9yID0gPFxuICBPcHRpb24sXG4gIElzTXVsdGkgZXh0ZW5kcyBib29sZWFuLFxuICBHcm91cCBleHRlbmRzIEdyb3VwQmFzZTxPcHRpb24+XG4+KFxuICBwcm9wczogSW5kaWNhdG9yU2VwYXJhdG9yUHJvcHM8T3B0aW9uLCBJc011bHRpLCBHcm91cD5cbikgPT4ge1xuICBjb25zdCB7IGNsYXNzTmFtZSwgY3gsIGdldFN0eWxlcywgaW5uZXJQcm9wcyB9ID0gcHJvcHM7XG4gIHJldHVybiAoXG4gICAgPHNwYW5cbiAgICAgIHsuLi5pbm5lclByb3BzfVxuICAgICAgY3NzPXtnZXRTdHlsZXMoJ2luZGljYXRvclNlcGFyYXRvcicsIHByb3BzKX1cbiAgICAgIGNsYXNzTmFtZT17Y3goeyAnaW5kaWNhdG9yLXNlcGFyYXRvcic6IHRydWUgfSwgY2xhc3NOYW1lKX1cbiAgICAvPlxuICApO1xufTtcblxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4vLyBMb2FkaW5nXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuY29uc3QgbG9hZGluZ0RvdEFuaW1hdGlvbnMgPSBrZXlmcmFtZXNgXG4gIDAlLCA4MCUsIDEwMCUgeyBvcGFjaXR5OiAwOyB9XG4gIDQwJSB7IG9wYWNpdHk6IDE7IH1cbmA7XG5cbmV4cG9ydCBjb25zdCBsb2FkaW5nSW5kaWNhdG9yQ1NTID0gPFxuICBPcHRpb24sXG4gIElzTXVsdGkgZXh0ZW5kcyBib29sZWFuLFxuICBHcm91cCBleHRlbmRzIEdyb3VwQmFzZTxPcHRpb24+XG4+KHtcbiAgaXNGb2N1c2VkLFxuICBzaXplLFxuICB0aGVtZToge1xuICAgIGNvbG9ycyxcbiAgICBzcGFjaW5nOiB7IGJhc2VVbml0IH0sXG4gIH0sXG59OiBMb2FkaW5nSW5kaWNhdG9yUHJvcHM8T3B0aW9uLCBJc011bHRpLCBHcm91cD4pOiBDU1NPYmplY3RXaXRoTGFiZWwgPT4gKHtcbiAgbGFiZWw6ICdsb2FkaW5nSW5kaWNhdG9yJyxcbiAgY29sb3I6IGlzRm9jdXNlZCA/IGNvbG9ycy5uZXV0cmFsNjAgOiBjb2xvcnMubmV1dHJhbDIwLFxuICBkaXNwbGF5OiAnZmxleCcsXG4gIHBhZGRpbmc6IGJhc2VVbml0ICogMixcbiAgdHJhbnNpdGlvbjogJ2NvbG9yIDE1MG1zJyxcbiAgYWxpZ25TZWxmOiAnY2VudGVyJyxcbiAgZm9udFNpemU6IHNpemUsXG4gIGxpbmVIZWlnaHQ6IDEsXG4gIG1hcmdpblJpZ2h0OiBzaXplLFxuICB0ZXh0QWxpZ246ICdjZW50ZXInLFxuICB2ZXJ0aWNhbEFsaWduOiAnbWlkZGxlJyxcbn0pO1xuXG5pbnRlcmZhY2UgTG9hZGluZ0RvdFByb3BzIHtcbiAgZGVsYXk6IG51bWJlcjtcbiAgb2Zmc2V0OiBib29sZWFuO1xufVxuY29uc3QgTG9hZGluZ0RvdCA9ICh7IGRlbGF5LCBvZmZzZXQgfTogTG9hZGluZ0RvdFByb3BzKSA9PiAoXG4gIDxzcGFuXG4gICAgY3NzPXt7XG4gICAgICBhbmltYXRpb246IGAke2xvYWRpbmdEb3RBbmltYXRpb25zfSAxcyBlYXNlLWluLW91dCAke2RlbGF5fW1zIGluZmluaXRlO2AsXG4gICAgICBiYWNrZ3JvdW5kQ29sb3I6ICdjdXJyZW50Q29sb3InLFxuICAgICAgYm9yZGVyUmFkaXVzOiAnMWVtJyxcbiAgICAgIGRpc3BsYXk6ICdpbmxpbmUtYmxvY2snLFxuICAgICAgbWFyZ2luTGVmdDogb2Zmc2V0ID8gJzFlbScgOiB1bmRlZmluZWQsXG4gICAgICBoZWlnaHQ6ICcxZW0nLFxuICAgICAgdmVydGljYWxBbGlnbjogJ3RvcCcsXG4gICAgICB3aWR0aDogJzFlbScsXG4gICAgfX1cbiAgLz5cbik7XG5cbmV4cG9ydCBpbnRlcmZhY2UgTG9hZGluZ0luZGljYXRvclByb3BzPFxuICBPcHRpb24gPSB1bmtub3duLFxuICBJc011bHRpIGV4dGVuZHMgYm9vbGVhbiA9IGJvb2xlYW4sXG4gIEdyb3VwIGV4dGVuZHMgR3JvdXBCYXNlPE9wdGlvbj4gPSBHcm91cEJhc2U8T3B0aW9uPlxuPiBleHRlbmRzIENvbW1vblByb3BzQW5kQ2xhc3NOYW1lPE9wdGlvbiwgSXNNdWx0aSwgR3JvdXA+IHtcbiAgLyoqIFByb3BzIHRoYXQgd2lsbCBiZSBwYXNzZWQgb24gdG8gdGhlIGNoaWxkcmVuLiAqL1xuICBpbm5lclByb3BzOiBKU1guSW50cmluc2ljRWxlbWVudHNbJ2RpdiddO1xuICAvKiogVGhlIGZvY3VzZWQgc3RhdGUgb2YgdGhlIHNlbGVjdC4gKi9cbiAgaXNGb2N1c2VkOiBib29sZWFuO1xuICBpc0Rpc2FibGVkOiBib29sZWFuO1xuICAvKiogU2V0IHNpemUgb2YgdGhlIGNvbnRhaW5lci4gKi9cbiAgc2l6ZTogbnVtYmVyO1xufVxuZXhwb3J0IGNvbnN0IExvYWRpbmdJbmRpY2F0b3IgPSA8XG4gIE9wdGlvbixcbiAgSXNNdWx0aSBleHRlbmRzIGJvb2xlYW4sXG4gIEdyb3VwIGV4dGVuZHMgR3JvdXBCYXNlPE9wdGlvbj5cbj4oXG4gIHByb3BzOiBMb2FkaW5nSW5kaWNhdG9yUHJvcHM8T3B0aW9uLCBJc011bHRpLCBHcm91cD5cbikgPT4ge1xuICBjb25zdCB7IGNsYXNzTmFtZSwgY3gsIGdldFN0eWxlcywgaW5uZXJQcm9wcywgaXNSdGwgfSA9IHByb3BzO1xuXG4gIHJldHVybiAoXG4gICAgPGRpdlxuICAgICAgY3NzPXtnZXRTdHlsZXMoJ2xvYWRpbmdJbmRpY2F0b3InLCBwcm9wcyl9XG4gICAgICBjbGFzc05hbWU9e2N4KFxuICAgICAgICB7XG4gICAgICAgICAgaW5kaWNhdG9yOiB0cnVlLFxuICAgICAgICAgICdsb2FkaW5nLWluZGljYXRvcic6IHRydWUsXG4gICAgICAgIH0sXG4gICAgICAgIGNsYXNzTmFtZVxuICAgICAgKX1cbiAgICAgIHsuLi5pbm5lclByb3BzfVxuICAgID5cbiAgICAgIDxMb2FkaW5nRG90IGRlbGF5PXswfSBvZmZzZXQ9e2lzUnRsfSAvPlxuICAgICAgPExvYWRpbmdEb3QgZGVsYXk9ezE2MH0gb2Zmc2V0IC8+XG4gICAgICA8TG9hZGluZ0RvdCBkZWxheT17MzIwfSBvZmZzZXQ9eyFpc1J0bH0gLz5cbiAgICA8L2Rpdj5cbiAgKTtcbn07XG5Mb2FkaW5nSW5kaWNhdG9yLmRlZmF1bHRQcm9wcyA9IHsgc2l6ZTogNCB9O1xuIl19 */")
  });
};

var LoadingIndicator = function LoadingIndicator(props) {
  var className = props.className,
      cx = props.cx,
      getStyles = props.getStyles,
      innerProps = props.innerProps,
      isRtl = props.isRtl;
  return (0,_emotion_react__WEBPACK_IMPORTED_MODULE_11__.jsx)("div", (0,_babel_runtime_helpers_esm_extends__WEBPACK_IMPORTED_MODULE_0__["default"])({
    css: getStyles('loadingIndicator', props),
    className: cx({
      indicator: true,
      'loading-indicator': true
    }, className)
  }, innerProps), (0,_emotion_react__WEBPACK_IMPORTED_MODULE_11__.jsx)(LoadingDot, {
    delay: 0,
    offset: isRtl
  }), (0,_emotion_react__WEBPACK_IMPORTED_MODULE_11__.jsx)(LoadingDot, {
    delay: 160,
    offset: true
  }), (0,_emotion_react__WEBPACK_IMPORTED_MODULE_11__.jsx)(LoadingDot, {
    delay: 320,
    offset: !isRtl
  }));
};
LoadingIndicator.defaultProps = {
  size: 4
};

var css$1 = function css(_ref) {
  var isDisabled = _ref.isDisabled,
      isFocused = _ref.isFocused,
      _ref$theme = _ref.theme,
      colors = _ref$theme.colors,
      borderRadius = _ref$theme.borderRadius,
      spacing = _ref$theme.spacing;
  return {
    label: 'control',
    alignItems: 'center',
    backgroundColor: isDisabled ? colors.neutral5 : colors.neutral0,
    borderColor: isDisabled ? colors.neutral10 : isFocused ? colors.primary : colors.neutral20,
    borderRadius: borderRadius,
    borderStyle: 'solid',
    borderWidth: 1,
    boxShadow: isFocused ? "0 0 0 1px ".concat(colors.primary) : undefined,
    cursor: 'default',
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    minHeight: spacing.controlHeight,
    outline: '0 !important',
    position: 'relative',
    transition: 'all 100ms',
    '&:hover': {
      borderColor: isFocused ? colors.primary : colors.neutral30
    }
  };
};

var Control = function Control(props) {
  var children = props.children,
      cx = props.cx,
      getStyles = props.getStyles,
      className = props.className,
      isDisabled = props.isDisabled,
      isFocused = props.isFocused,
      innerRef = props.innerRef,
      innerProps = props.innerProps,
      menuIsOpen = props.menuIsOpen;
  return (0,_emotion_react__WEBPACK_IMPORTED_MODULE_11__.jsx)("div", (0,_babel_runtime_helpers_esm_extends__WEBPACK_IMPORTED_MODULE_0__["default"])({
    ref: innerRef,
    css: getStyles('control', props),
    className: cx({
      control: true,
      'control--is-disabled': isDisabled,
      'control--is-focused': isFocused,
      'control--menu-is-open': menuIsOpen
    }, className)
  }, innerProps), children);
};

var _excluded$1 = ["data"];
var groupCSS = function groupCSS(_ref) {
  var spacing = _ref.theme.spacing;
  return {
    paddingBottom: spacing.baseUnit * 2,
    paddingTop: spacing.baseUnit * 2
  };
};

var Group = function Group(props) {
  var children = props.children,
      className = props.className,
      cx = props.cx,
      getStyles = props.getStyles,
      Heading = props.Heading,
      headingProps = props.headingProps,
      innerProps = props.innerProps,
      label = props.label,
      theme = props.theme,
      selectProps = props.selectProps;
  return (0,_emotion_react__WEBPACK_IMPORTED_MODULE_11__.jsx)("div", (0,_babel_runtime_helpers_esm_extends__WEBPACK_IMPORTED_MODULE_0__["default"])({
    css: getStyles('group', props),
    className: cx({
      group: true
    }, className)
  }, innerProps), (0,_emotion_react__WEBPACK_IMPORTED_MODULE_11__.jsx)(Heading, (0,_babel_runtime_helpers_esm_extends__WEBPACK_IMPORTED_MODULE_0__["default"])({}, headingProps, {
    selectProps: selectProps,
    theme: theme,
    getStyles: getStyles,
    cx: cx
  }), label), (0,_emotion_react__WEBPACK_IMPORTED_MODULE_11__.jsx)("div", null, children));
};

var groupHeadingCSS = function groupHeadingCSS(_ref2) {
  var spacing = _ref2.theme.spacing;
  return {
    label: 'group',
    color: '#999',
    cursor: 'default',
    display: 'block',
    fontSize: '75%',
    fontWeight: 500,
    marginBottom: '0.25em',
    paddingLeft: spacing.baseUnit * 3,
    paddingRight: spacing.baseUnit * 3,
    textTransform: 'uppercase'
  };
};
var GroupHeading = function GroupHeading(props) {
  var getStyles = props.getStyles,
      cx = props.cx,
      className = props.className;

  var _cleanCommonProps = cleanCommonProps(props);
      _cleanCommonProps.data;
      var innerProps = (0,_babel_runtime_helpers_esm_objectWithoutProperties__WEBPACK_IMPORTED_MODULE_2__["default"])(_cleanCommonProps, _excluded$1);

  return (0,_emotion_react__WEBPACK_IMPORTED_MODULE_11__.jsx)("div", (0,_babel_runtime_helpers_esm_extends__WEBPACK_IMPORTED_MODULE_0__["default"])({
    css: getStyles('groupHeading', props),
    className: cx({
      'group-heading': true
    }, className)
  }, innerProps));
};

var _excluded = ["innerRef", "isDisabled", "isHidden", "inputClassName"];
var inputCSS = function inputCSS(_ref) {
  var isDisabled = _ref.isDisabled,
      value = _ref.value,
      _ref$theme = _ref.theme,
      spacing = _ref$theme.spacing,
      colors = _ref$theme.colors;
  return _objectSpread2({
    margin: spacing.baseUnit / 2,
    paddingBottom: spacing.baseUnit / 2,
    paddingTop: spacing.baseUnit / 2,
    visibility: isDisabled ? 'hidden' : 'visible',
    color: colors.neutral80,
    // force css to recompute when value change due to @emotion bug.
    // We can remove it whenever the bug is fixed.
    transform: value ? 'translateZ(0)' : ''
  }, containerStyle);
};
var spacingStyle = {
  gridArea: '1 / 2',
  font: 'inherit',
  minWidth: '2px',
  border: 0,
  margin: 0,
  outline: 0,
  padding: 0
};
var containerStyle = {
  flex: '1 1 auto',
  display: 'inline-grid',
  gridArea: '1 / 1 / 2 / 3',
  gridTemplateColumns: '0 min-content',
  '&:after': _objectSpread2({
    content: 'attr(data-value) " "',
    visibility: 'hidden',
    whiteSpace: 'pre'
  }, spacingStyle)
};

var inputStyle = function inputStyle(isHidden) {
  return _objectSpread2({
    label: 'input',
    color: 'inherit',
    background: 0,
    opacity: isHidden ? 0 : 1,
    width: '100%'
  }, spacingStyle);
};

var Input = function Input(props) {
  var className = props.className,
      cx = props.cx,
      getStyles = props.getStyles,
      value = props.value;

  var _cleanCommonProps = cleanCommonProps(props),
      innerRef = _cleanCommonProps.innerRef,
      isDisabled = _cleanCommonProps.isDisabled,
      isHidden = _cleanCommonProps.isHidden,
      inputClassName = _cleanCommonProps.inputClassName,
      innerProps = (0,_babel_runtime_helpers_esm_objectWithoutProperties__WEBPACK_IMPORTED_MODULE_2__["default"])(_cleanCommonProps, _excluded);

  return (0,_emotion_react__WEBPACK_IMPORTED_MODULE_11__.jsx)("div", {
    className: cx({
      'input-container': true
    }, className),
    css: getStyles('input', props),
    "data-value": value || ''
  }, (0,_emotion_react__WEBPACK_IMPORTED_MODULE_11__.jsx)("input", (0,_babel_runtime_helpers_esm_extends__WEBPACK_IMPORTED_MODULE_0__["default"])({
    className: cx({
      input: true
    }, inputClassName),
    ref: innerRef,
    style: inputStyle(isHidden),
    disabled: isDisabled
  }, innerProps)));
};

var multiValueCSS = function multiValueCSS(_ref) {
  var _ref$theme = _ref.theme,
      spacing = _ref$theme.spacing,
      borderRadius = _ref$theme.borderRadius,
      colors = _ref$theme.colors;
  return {
    label: 'multiValue',
    backgroundColor: colors.neutral10,
    borderRadius: borderRadius / 2,
    display: 'flex',
    margin: spacing.baseUnit / 2,
    minWidth: 0 // resolves flex/text-overflow bug

  };
};
var multiValueLabelCSS = function multiValueLabelCSS(_ref2) {
  var _ref2$theme = _ref2.theme,
      borderRadius = _ref2$theme.borderRadius,
      colors = _ref2$theme.colors,
      cropWithEllipsis = _ref2.cropWithEllipsis;
  return {
    borderRadius: borderRadius / 2,
    color: colors.neutral80,
    fontSize: '85%',
    overflow: 'hidden',
    padding: 3,
    paddingLeft: 6,
    textOverflow: cropWithEllipsis || cropWithEllipsis === undefined ? 'ellipsis' : undefined,
    whiteSpace: 'nowrap'
  };
};
var multiValueRemoveCSS = function multiValueRemoveCSS(_ref3) {
  var _ref3$theme = _ref3.theme,
      spacing = _ref3$theme.spacing,
      borderRadius = _ref3$theme.borderRadius,
      colors = _ref3$theme.colors,
      isFocused = _ref3.isFocused;
  return {
    alignItems: 'center',
    borderRadius: borderRadius / 2,
    backgroundColor: isFocused ? colors.dangerLight : undefined,
    display: 'flex',
    paddingLeft: spacing.baseUnit,
    paddingRight: spacing.baseUnit,
    ':hover': {
      backgroundColor: colors.dangerLight,
      color: colors.danger
    }
  };
};
var MultiValueGeneric = function MultiValueGeneric(_ref4) {
  var children = _ref4.children,
      innerProps = _ref4.innerProps;
  return (0,_emotion_react__WEBPACK_IMPORTED_MODULE_11__.jsx)("div", innerProps, children);
};
var MultiValueContainer = MultiValueGeneric;
var MultiValueLabel = MultiValueGeneric;
function MultiValueRemove(_ref5) {
  var children = _ref5.children,
      innerProps = _ref5.innerProps;
  return (0,_emotion_react__WEBPACK_IMPORTED_MODULE_11__.jsx)("div", (0,_babel_runtime_helpers_esm_extends__WEBPACK_IMPORTED_MODULE_0__["default"])({
    role: "button"
  }, innerProps), children || (0,_emotion_react__WEBPACK_IMPORTED_MODULE_11__.jsx)(CrossIcon, {
    size: 14
  }));
}

var MultiValue = function MultiValue(props) {
  var children = props.children,
      className = props.className,
      components = props.components,
      cx = props.cx,
      data = props.data,
      getStyles = props.getStyles,
      innerProps = props.innerProps,
      isDisabled = props.isDisabled,
      removeProps = props.removeProps,
      selectProps = props.selectProps;
  var Container = components.Container,
      Label = components.Label,
      Remove = components.Remove;
  return (0,_emotion_react__WEBPACK_IMPORTED_MODULE_11__.jsx)(_emotion_react__WEBPACK_IMPORTED_MODULE_11__.ClassNames, null, function (_ref6) {
    var css = _ref6.css,
        emotionCx = _ref6.cx;
    return (0,_emotion_react__WEBPACK_IMPORTED_MODULE_11__.jsx)(Container, {
      data: data,
      innerProps: _objectSpread2({
        className: emotionCx(css(getStyles('multiValue', props)), cx({
          'multi-value': true,
          'multi-value--is-disabled': isDisabled
        }, className))
      }, innerProps),
      selectProps: selectProps
    }, (0,_emotion_react__WEBPACK_IMPORTED_MODULE_11__.jsx)(Label, {
      data: data,
      innerProps: {
        className: emotionCx(css(getStyles('multiValueLabel', props)), cx({
          'multi-value__label': true
        }, className))
      },
      selectProps: selectProps
    }, children), (0,_emotion_react__WEBPACK_IMPORTED_MODULE_11__.jsx)(Remove, {
      data: data,
      innerProps: _objectSpread2({
        className: emotionCx(css(getStyles('multiValueRemove', props)), cx({
          'multi-value__remove': true
        }, className)),
        'aria-label': "Remove ".concat(children || 'option')
      }, removeProps),
      selectProps: selectProps
    }));
  });
};

var optionCSS = function optionCSS(_ref) {
  var isDisabled = _ref.isDisabled,
      isFocused = _ref.isFocused,
      isSelected = _ref.isSelected,
      _ref$theme = _ref.theme,
      spacing = _ref$theme.spacing,
      colors = _ref$theme.colors;
  return {
    label: 'option',
    backgroundColor: isSelected ? colors.primary : isFocused ? colors.primary25 : 'transparent',
    color: isDisabled ? colors.neutral20 : isSelected ? colors.neutral0 : 'inherit',
    cursor: 'default',
    display: 'block',
    fontSize: 'inherit',
    padding: "".concat(spacing.baseUnit * 2, "px ").concat(spacing.baseUnit * 3, "px"),
    width: '100%',
    userSelect: 'none',
    WebkitTapHighlightColor: 'rgba(0, 0, 0, 0)',
    // provide some affordance on touch devices
    ':active': {
      backgroundColor: !isDisabled ? isSelected ? colors.primary : colors.primary50 : undefined
    }
  };
};

var Option = function Option(props) {
  var children = props.children,
      className = props.className,
      cx = props.cx,
      getStyles = props.getStyles,
      isDisabled = props.isDisabled,
      isFocused = props.isFocused,
      isSelected = props.isSelected,
      innerRef = props.innerRef,
      innerProps = props.innerProps;
  return (0,_emotion_react__WEBPACK_IMPORTED_MODULE_11__.jsx)("div", (0,_babel_runtime_helpers_esm_extends__WEBPACK_IMPORTED_MODULE_0__["default"])({
    css: getStyles('option', props),
    className: cx({
      option: true,
      'option--is-disabled': isDisabled,
      'option--is-focused': isFocused,
      'option--is-selected': isSelected
    }, className),
    ref: innerRef,
    "aria-disabled": isDisabled
  }, innerProps), children);
};

var placeholderCSS = function placeholderCSS(_ref) {
  var _ref$theme = _ref.theme,
      spacing = _ref$theme.spacing,
      colors = _ref$theme.colors;
  return {
    label: 'placeholder',
    color: colors.neutral50,
    gridArea: '1 / 1 / 2 / 3',
    marginLeft: spacing.baseUnit / 2,
    marginRight: spacing.baseUnit / 2
  };
};

var Placeholder = function Placeholder(props) {
  var children = props.children,
      className = props.className,
      cx = props.cx,
      getStyles = props.getStyles,
      innerProps = props.innerProps;
  return (0,_emotion_react__WEBPACK_IMPORTED_MODULE_11__.jsx)("div", (0,_babel_runtime_helpers_esm_extends__WEBPACK_IMPORTED_MODULE_0__["default"])({
    css: getStyles('placeholder', props),
    className: cx({
      placeholder: true
    }, className)
  }, innerProps), children);
};

var css = function css(_ref) {
  var isDisabled = _ref.isDisabled,
      _ref$theme = _ref.theme,
      spacing = _ref$theme.spacing,
      colors = _ref$theme.colors;
  return {
    label: 'singleValue',
    color: isDisabled ? colors.neutral40 : colors.neutral80,
    gridArea: '1 / 1 / 2 / 3',
    marginLeft: spacing.baseUnit / 2,
    marginRight: spacing.baseUnit / 2,
    maxWidth: '100%',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap'
  };
};

var SingleValue = function SingleValue(props) {
  var children = props.children,
      className = props.className,
      cx = props.cx,
      getStyles = props.getStyles,
      isDisabled = props.isDisabled,
      innerProps = props.innerProps;
  return (0,_emotion_react__WEBPACK_IMPORTED_MODULE_11__.jsx)("div", (0,_babel_runtime_helpers_esm_extends__WEBPACK_IMPORTED_MODULE_0__["default"])({
    css: getStyles('singleValue', props),
    className: cx({
      'single-value': true,
      'single-value--is-disabled': isDisabled
    }, className)
  }, innerProps), children);
};

var components = {
  ClearIndicator: ClearIndicator,
  Control: Control,
  DropdownIndicator: DropdownIndicator,
  DownChevron: DownChevron,
  CrossIcon: CrossIcon,
  Group: Group,
  GroupHeading: GroupHeading,
  IndicatorsContainer: IndicatorsContainer,
  IndicatorSeparator: IndicatorSeparator,
  Input: Input,
  LoadingIndicator: LoadingIndicator,
  Menu: Menu,
  MenuList: MenuList,
  MenuPortal: MenuPortal,
  LoadingMessage: LoadingMessage,
  NoOptionsMessage: NoOptionsMessage,
  MultiValue: MultiValue,
  MultiValueContainer: MultiValueContainer,
  MultiValueLabel: MultiValueLabel,
  MultiValueRemove: MultiValueRemove,
  Option: Option,
  Placeholder: Placeholder,
  SelectContainer: SelectContainer,
  SingleValue: SingleValue,
  ValueContainer: ValueContainer
};
var defaultComponents = function defaultComponents(props) {
  return _objectSpread2(_objectSpread2({}, components), props.components);
};




/***/ }),

/***/ "./node_modules/react-select/dist/react-select.esm.js":
/*!************************************************************!*\
  !*** ./node_modules/react-select/dist/react-select.esm.js ***!
  \************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "NonceProvider": function() { return /* binding */ NonceProvider; },
/* harmony export */   "components": function() { return /* reexport safe */ _index_a7690a33_esm_js__WEBPACK_IMPORTED_MODULE_7__.c; },
/* harmony export */   "createFilter": function() { return /* reexport safe */ _Select_54ac8379_esm_js__WEBPACK_IMPORTED_MODULE_3__.c; },
/* harmony export */   "defaultTheme": function() { return /* reexport safe */ _Select_54ac8379_esm_js__WEBPACK_IMPORTED_MODULE_3__.d; },
/* harmony export */   "mergeStyles": function() { return /* reexport safe */ _Select_54ac8379_esm_js__WEBPACK_IMPORTED_MODULE_3__.m; },
/* harmony export */   "useStateManager": function() { return /* reexport safe */ _useStateManager_68425271_esm_js__WEBPACK_IMPORTED_MODULE_0__.u; }
/* harmony export */ });
/* harmony import */ var _useStateManager_68425271_esm_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./useStateManager-68425271.esm.js */ "./node_modules/react-select/dist/useStateManager-68425271.esm.js");
/* harmony import */ var _babel_runtime_helpers_esm_extends__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @babel/runtime/helpers/esm/extends */ "./node_modules/@babel/runtime/helpers/esm/extends.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _Select_54ac8379_esm_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./Select-54ac8379.esm.js */ "./node_modules/react-select/dist/Select-54ac8379.esm.js");
/* harmony import */ var _babel_runtime_helpers_esm_classCallCheck__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @babel/runtime/helpers/esm/classCallCheck */ "./node_modules/@babel/runtime/helpers/esm/classCallCheck.js");
/* harmony import */ var _babel_runtime_helpers_esm_createClass__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @babel/runtime/helpers/esm/createClass */ "./node_modules/@babel/runtime/helpers/esm/createClass.js");
/* harmony import */ var _babel_runtime_helpers_esm_inherits__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @babel/runtime/helpers/esm/inherits */ "./node_modules/@babel/runtime/helpers/esm/inherits.js");
/* harmony import */ var _index_a7690a33_esm_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./index-a7690a33.esm.js */ "./node_modules/react-select/dist/index-a7690a33.esm.js");
/* harmony import */ var _emotion_react__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! @emotion/react */ "./node_modules/@emotion/react/dist/emotion-element-cbed451f.browser.esm.js");
/* harmony import */ var _emotion_cache__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @emotion/cache */ "./node_modules/@emotion/cache/dist/emotion-cache.browser.esm.js");
/* harmony import */ var memoize_one__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! memoize-one */ "./node_modules/memoize-one/dist/memoize-one.esm.js");
/* harmony import */ var _babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @babel/runtime/helpers/slicedToArray */ "./node_modules/@babel/runtime/helpers/esm/slicedToArray.js");
/* harmony import */ var _babel_runtime_helpers_objectWithoutProperties__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @babel/runtime/helpers/objectWithoutProperties */ "./node_modules/@babel/runtime/helpers/esm/objectWithoutProperties.js");
/* harmony import */ var _babel_runtime_helpers_toConsumableArray__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @babel/runtime/helpers/toConsumableArray */ "./node_modules/@babel/runtime/helpers/esm/toConsumableArray.js");
/* harmony import */ var _babel_runtime_helpers_taggedTemplateLiteral__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! @babel/runtime/helpers/taggedTemplateLiteral */ "./node_modules/@babel/runtime/helpers/esm/taggedTemplateLiteral.js");
/* harmony import */ var _babel_runtime_helpers_typeof__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! @babel/runtime/helpers/typeof */ "./node_modules/@babel/runtime/helpers/esm/typeof.js");
/* harmony import */ var _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! @babel/runtime/helpers/defineProperty */ "./node_modules/@babel/runtime/helpers/esm/defineProperty.js");
/* harmony import */ var react_dom__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! react-dom */ "react-dom");
/* harmony import */ var react_dom__WEBPACK_IMPORTED_MODULE_15___default = /*#__PURE__*/__webpack_require__.n(react_dom__WEBPACK_IMPORTED_MODULE_15__);























var StateManagedSelect = /*#__PURE__*/(0,react__WEBPACK_IMPORTED_MODULE_2__.forwardRef)(function (props, ref) {
  var baseSelectProps = (0,_useStateManager_68425271_esm_js__WEBPACK_IMPORTED_MODULE_0__.u)(props);
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2__.createElement(_Select_54ac8379_esm_js__WEBPACK_IMPORTED_MODULE_3__.S, (0,_babel_runtime_helpers_esm_extends__WEBPACK_IMPORTED_MODULE_1__["default"])({
    ref: ref
  }, baseSelectProps));
});

var NonceProvider = /*#__PURE__*/function (_Component) {
  (0,_babel_runtime_helpers_esm_inherits__WEBPACK_IMPORTED_MODULE_6__["default"])(NonceProvider, _Component);

  var _super = (0,_index_a7690a33_esm_js__WEBPACK_IMPORTED_MODULE_7__._)(NonceProvider);

  function NonceProvider(props) {
    var _this;

    (0,_babel_runtime_helpers_esm_classCallCheck__WEBPACK_IMPORTED_MODULE_4__["default"])(this, NonceProvider);

    _this = _super.call(this, props);

    _this.createEmotionCache = function (nonce, key) {
      return (0,_emotion_cache__WEBPACK_IMPORTED_MODULE_8__["default"])({
        nonce: nonce,
        key: key
      });
    };

    _this.createEmotionCache = (0,memoize_one__WEBPACK_IMPORTED_MODULE_16__["default"])(_this.createEmotionCache);
    return _this;
  }

  (0,_babel_runtime_helpers_esm_createClass__WEBPACK_IMPORTED_MODULE_5__["default"])(NonceProvider, [{
    key: "render",
    value: function render() {
      var emotionCache = this.createEmotionCache(this.props.nonce, this.props.cacheKey);
      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2__.createElement(_emotion_react__WEBPACK_IMPORTED_MODULE_17__.C, {
        value: emotionCache
      }, this.props.children);
    }
  }]);

  return NonceProvider;
}(react__WEBPACK_IMPORTED_MODULE_2__.Component);

/* harmony default export */ __webpack_exports__["default"] = (StateManagedSelect);



/***/ }),

/***/ "./node_modules/react-select/dist/useStateManager-68425271.esm.js":
/*!************************************************************************!*\
  !*** ./node_modules/react-select/dist/useStateManager-68425271.esm.js ***!
  \************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "u": function() { return /* binding */ useStateManager; }
/* harmony export */ });
/* harmony import */ var _index_a7690a33_esm_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./index-a7690a33.esm.js */ "./node_modules/react-select/dist/index-a7690a33.esm.js");
/* harmony import */ var _babel_runtime_helpers_esm_slicedToArray__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/esm/slicedToArray */ "./node_modules/@babel/runtime/helpers/esm/slicedToArray.js");
/* harmony import */ var _babel_runtime_helpers_esm_objectWithoutProperties__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @babel/runtime/helpers/esm/objectWithoutProperties */ "./node_modules/@babel/runtime/helpers/esm/objectWithoutProperties.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_2__);





var _excluded = ["defaultInputValue", "defaultMenuIsOpen", "defaultValue", "inputValue", "menuIsOpen", "onChange", "onInputChange", "onMenuClose", "onMenuOpen", "value"];
function useStateManager(_ref) {
  var _ref$defaultInputValu = _ref.defaultInputValue,
      defaultInputValue = _ref$defaultInputValu === void 0 ? '' : _ref$defaultInputValu,
      _ref$defaultMenuIsOpe = _ref.defaultMenuIsOpen,
      defaultMenuIsOpen = _ref$defaultMenuIsOpe === void 0 ? false : _ref$defaultMenuIsOpe,
      _ref$defaultValue = _ref.defaultValue,
      defaultValue = _ref$defaultValue === void 0 ? null : _ref$defaultValue,
      propsInputValue = _ref.inputValue,
      propsMenuIsOpen = _ref.menuIsOpen,
      propsOnChange = _ref.onChange,
      propsOnInputChange = _ref.onInputChange,
      propsOnMenuClose = _ref.onMenuClose,
      propsOnMenuOpen = _ref.onMenuOpen,
      propsValue = _ref.value,
      restSelectProps = (0,_babel_runtime_helpers_esm_objectWithoutProperties__WEBPACK_IMPORTED_MODULE_1__["default"])(_ref, _excluded);

  var _useState = (0,react__WEBPACK_IMPORTED_MODULE_2__.useState)(propsInputValue !== undefined ? propsInputValue : defaultInputValue),
      _useState2 = (0,_babel_runtime_helpers_esm_slicedToArray__WEBPACK_IMPORTED_MODULE_0__["default"])(_useState, 2),
      stateInputValue = _useState2[0],
      setStateInputValue = _useState2[1];

  var _useState3 = (0,react__WEBPACK_IMPORTED_MODULE_2__.useState)(propsMenuIsOpen !== undefined ? propsMenuIsOpen : defaultMenuIsOpen),
      _useState4 = (0,_babel_runtime_helpers_esm_slicedToArray__WEBPACK_IMPORTED_MODULE_0__["default"])(_useState3, 2),
      stateMenuIsOpen = _useState4[0],
      setStateMenuIsOpen = _useState4[1];

  var _useState5 = (0,react__WEBPACK_IMPORTED_MODULE_2__.useState)(propsValue !== undefined ? propsValue : defaultValue),
      _useState6 = (0,_babel_runtime_helpers_esm_slicedToArray__WEBPACK_IMPORTED_MODULE_0__["default"])(_useState5, 2),
      stateValue = _useState6[0],
      setStateValue = _useState6[1];

  var onChange = (0,react__WEBPACK_IMPORTED_MODULE_2__.useCallback)(function (value, actionMeta) {
    if (typeof propsOnChange === 'function') {
      propsOnChange(value, actionMeta);
    }

    setStateValue(value);
  }, [propsOnChange]);
  var onInputChange = (0,react__WEBPACK_IMPORTED_MODULE_2__.useCallback)(function (value, actionMeta) {
    var newValue;

    if (typeof propsOnInputChange === 'function') {
      newValue = propsOnInputChange(value, actionMeta);
    }

    setStateInputValue(newValue !== undefined ? newValue : value);
  }, [propsOnInputChange]);
  var onMenuOpen = (0,react__WEBPACK_IMPORTED_MODULE_2__.useCallback)(function () {
    if (typeof propsOnMenuOpen === 'function') {
      propsOnMenuOpen();
    }

    setStateMenuIsOpen(true);
  }, [propsOnMenuOpen]);
  var onMenuClose = (0,react__WEBPACK_IMPORTED_MODULE_2__.useCallback)(function () {
    if (typeof propsOnMenuClose === 'function') {
      propsOnMenuClose();
    }

    setStateMenuIsOpen(false);
  }, [propsOnMenuClose]);
  var inputValue = propsInputValue !== undefined ? propsInputValue : stateInputValue;
  var menuIsOpen = propsMenuIsOpen !== undefined ? propsMenuIsOpen : stateMenuIsOpen;
  var value = propsValue !== undefined ? propsValue : stateValue;
  return (0,_index_a7690a33_esm_js__WEBPACK_IMPORTED_MODULE_3__.a)((0,_index_a7690a33_esm_js__WEBPACK_IMPORTED_MODULE_3__.a)({}, restSelectProps), {}, {
    inputValue: inputValue,
    menuIsOpen: menuIsOpen,
    onChange: onChange,
    onInputChange: onInputChange,
    onMenuClose: onMenuClose,
    onMenuOpen: onMenuOpen,
    value: value
  });
}




/***/ }),

/***/ "react":
/*!************************!*\
  !*** external "React" ***!
  \************************/
/***/ (function(module) {

"use strict";
module.exports = window["React"];

/***/ }),

/***/ "react-dom":
/*!***************************!*\
  !*** external "ReactDOM" ***!
  \***************************/
/***/ (function(module) {

"use strict";
module.exports = window["ReactDOM"];

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

/***/ "@wordpress/media-utils":
/*!************************************!*\
  !*** external ["wp","mediaUtils"] ***!
  \************************************/
/***/ (function(module) {

"use strict";
module.exports = window["wp"]["mediaUtils"];

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

/***/ "./node_modules/@babel/runtime/helpers/esm/arrayLikeToArray.js":
/*!*********************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/arrayLikeToArray.js ***!
  \*********************************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ _arrayLikeToArray; }
/* harmony export */ });
function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;

  for (var i = 0, arr2 = new Array(len); i < len; i++) {
    arr2[i] = arr[i];
  }

  return arr2;
}

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/arrayWithHoles.js":
/*!*******************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/arrayWithHoles.js ***!
  \*******************************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ _arrayWithHoles; }
/* harmony export */ });
function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/arrayWithoutHoles.js":
/*!**********************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/arrayWithoutHoles.js ***!
  \**********************************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ _arrayWithoutHoles; }
/* harmony export */ });
/* harmony import */ var _arrayLikeToArray_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./arrayLikeToArray.js */ "./node_modules/@babel/runtime/helpers/esm/arrayLikeToArray.js");

function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) return (0,_arrayLikeToArray_js__WEBPACK_IMPORTED_MODULE_0__["default"])(arr);
}

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/classCallCheck.js":
/*!*******************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/classCallCheck.js ***!
  \*******************************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ _classCallCheck; }
/* harmony export */ });
function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/createClass.js":
/*!****************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/createClass.js ***!
  \****************************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ _createClass; }
/* harmony export */ });
function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/defineProperty.js":
/*!*******************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/defineProperty.js ***!
  \*******************************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ _defineProperty; }
/* harmony export */ });
function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

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

/***/ "./node_modules/@babel/runtime/helpers/esm/inherits.js":
/*!*************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/inherits.js ***!
  \*************************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ _inherits; }
/* harmony export */ });
/* harmony import */ var _setPrototypeOf_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./setPrototypeOf.js */ "./node_modules/@babel/runtime/helpers/esm/setPrototypeOf.js");

function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      writable: true,
      configurable: true
    }
  });
  if (superClass) (0,_setPrototypeOf_js__WEBPACK_IMPORTED_MODULE_0__["default"])(subClass, superClass);
}

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/iterableToArray.js":
/*!********************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/iterableToArray.js ***!
  \********************************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ _iterableToArray; }
/* harmony export */ });
function _iterableToArray(iter) {
  if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter);
}

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/iterableToArrayLimit.js":
/*!*************************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/iterableToArrayLimit.js ***!
  \*************************************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ _iterableToArrayLimit; }
/* harmony export */ });
function _iterableToArrayLimit(arr, i) {
  var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"];

  if (_i == null) return;
  var _arr = [];
  var _n = true;
  var _d = false;

  var _s, _e;

  try {
    for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) {
      _arr.push(_s.value);

      if (i && _arr.length === i) break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i["return"] != null) _i["return"]();
    } finally {
      if (_d) throw _e;
    }
  }

  return _arr;
}

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/nonIterableRest.js":
/*!********************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/nonIterableRest.js ***!
  \********************************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ _nonIterableRest; }
/* harmony export */ });
function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/nonIterableSpread.js":
/*!**********************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/nonIterableSpread.js ***!
  \**********************************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ _nonIterableSpread; }
/* harmony export */ });
function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/objectWithoutProperties.js":
/*!****************************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/objectWithoutProperties.js ***!
  \****************************************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ _objectWithoutProperties; }
/* harmony export */ });
/* harmony import */ var _objectWithoutPropertiesLoose_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./objectWithoutPropertiesLoose.js */ "./node_modules/@babel/runtime/helpers/esm/objectWithoutPropertiesLoose.js");

function _objectWithoutProperties(source, excluded) {
  if (source == null) return {};
  var target = (0,_objectWithoutPropertiesLoose_js__WEBPACK_IMPORTED_MODULE_0__["default"])(source, excluded);
  var key, i;

  if (Object.getOwnPropertySymbols) {
    var sourceSymbolKeys = Object.getOwnPropertySymbols(source);

    for (i = 0; i < sourceSymbolKeys.length; i++) {
      key = sourceSymbolKeys[i];
      if (excluded.indexOf(key) >= 0) continue;
      if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
      target[key] = source[key];
    }
  }

  return target;
}

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/objectWithoutPropertiesLoose.js":
/*!*********************************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/objectWithoutPropertiesLoose.js ***!
  \*********************************************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ _objectWithoutPropertiesLoose; }
/* harmony export */ });
function _objectWithoutPropertiesLoose(source, excluded) {
  if (source == null) return {};
  var target = {};
  var sourceKeys = Object.keys(source);
  var key, i;

  for (i = 0; i < sourceKeys.length; i++) {
    key = sourceKeys[i];
    if (excluded.indexOf(key) >= 0) continue;
    target[key] = source[key];
  }

  return target;
}

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/setPrototypeOf.js":
/*!*******************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/setPrototypeOf.js ***!
  \*******************************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ _setPrototypeOf; }
/* harmony export */ });
function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };

  return _setPrototypeOf(o, p);
}

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/slicedToArray.js":
/*!******************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/slicedToArray.js ***!
  \******************************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ _slicedToArray; }
/* harmony export */ });
/* harmony import */ var _arrayWithHoles_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./arrayWithHoles.js */ "./node_modules/@babel/runtime/helpers/esm/arrayWithHoles.js");
/* harmony import */ var _iterableToArrayLimit_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./iterableToArrayLimit.js */ "./node_modules/@babel/runtime/helpers/esm/iterableToArrayLimit.js");
/* harmony import */ var _unsupportedIterableToArray_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./unsupportedIterableToArray.js */ "./node_modules/@babel/runtime/helpers/esm/unsupportedIterableToArray.js");
/* harmony import */ var _nonIterableRest_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./nonIterableRest.js */ "./node_modules/@babel/runtime/helpers/esm/nonIterableRest.js");




function _slicedToArray(arr, i) {
  return (0,_arrayWithHoles_js__WEBPACK_IMPORTED_MODULE_0__["default"])(arr) || (0,_iterableToArrayLimit_js__WEBPACK_IMPORTED_MODULE_1__["default"])(arr, i) || (0,_unsupportedIterableToArray_js__WEBPACK_IMPORTED_MODULE_2__["default"])(arr, i) || (0,_nonIterableRest_js__WEBPACK_IMPORTED_MODULE_3__["default"])();
}

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/taggedTemplateLiteral.js":
/*!**************************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/taggedTemplateLiteral.js ***!
  \**************************************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ _taggedTemplateLiteral; }
/* harmony export */ });
function _taggedTemplateLiteral(strings, raw) {
  if (!raw) {
    raw = strings.slice(0);
  }

  return Object.freeze(Object.defineProperties(strings, {
    raw: {
      value: Object.freeze(raw)
    }
  }));
}

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/toConsumableArray.js":
/*!**********************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/toConsumableArray.js ***!
  \**********************************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ _toConsumableArray; }
/* harmony export */ });
/* harmony import */ var _arrayWithoutHoles_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./arrayWithoutHoles.js */ "./node_modules/@babel/runtime/helpers/esm/arrayWithoutHoles.js");
/* harmony import */ var _iterableToArray_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./iterableToArray.js */ "./node_modules/@babel/runtime/helpers/esm/iterableToArray.js");
/* harmony import */ var _unsupportedIterableToArray_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./unsupportedIterableToArray.js */ "./node_modules/@babel/runtime/helpers/esm/unsupportedIterableToArray.js");
/* harmony import */ var _nonIterableSpread_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./nonIterableSpread.js */ "./node_modules/@babel/runtime/helpers/esm/nonIterableSpread.js");




function _toConsumableArray(arr) {
  return (0,_arrayWithoutHoles_js__WEBPACK_IMPORTED_MODULE_0__["default"])(arr) || (0,_iterableToArray_js__WEBPACK_IMPORTED_MODULE_1__["default"])(arr) || (0,_unsupportedIterableToArray_js__WEBPACK_IMPORTED_MODULE_2__["default"])(arr) || (0,_nonIterableSpread_js__WEBPACK_IMPORTED_MODULE_3__["default"])();
}

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/typeof.js":
/*!***********************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/typeof.js ***!
  \***********************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ _typeof; }
/* harmony export */ });
function _typeof(obj) {
  "@babel/helpers - typeof";

  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof = function _typeof(obj) {
      return typeof obj;
    };
  } else {
    _typeof = function _typeof(obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
  }

  return _typeof(obj);
}

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/unsupportedIterableToArray.js":
/*!*******************************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/unsupportedIterableToArray.js ***!
  \*******************************************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ _unsupportedIterableToArray; }
/* harmony export */ });
/* harmony import */ var _arrayLikeToArray_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./arrayLikeToArray.js */ "./node_modules/@babel/runtime/helpers/esm/arrayLikeToArray.js");

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return (0,_arrayLikeToArray_js__WEBPACK_IMPORTED_MODULE_0__["default"])(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return (0,_arrayLikeToArray_js__WEBPACK_IMPORTED_MODULE_0__["default"])(o, minLen);
}

/***/ }),

/***/ "./node_modules/stylis/src/Enum.js":
/*!*****************************************!*\
  !*** ./node_modules/stylis/src/Enum.js ***!
  \*****************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "CHARSET": function() { return /* binding */ CHARSET; },
/* harmony export */   "COMMENT": function() { return /* binding */ COMMENT; },
/* harmony export */   "COUNTER_STYLE": function() { return /* binding */ COUNTER_STYLE; },
/* harmony export */   "DECLARATION": function() { return /* binding */ DECLARATION; },
/* harmony export */   "DOCUMENT": function() { return /* binding */ DOCUMENT; },
/* harmony export */   "FONT_FACE": function() { return /* binding */ FONT_FACE; },
/* harmony export */   "FONT_FEATURE_VALUES": function() { return /* binding */ FONT_FEATURE_VALUES; },
/* harmony export */   "IMPORT": function() { return /* binding */ IMPORT; },
/* harmony export */   "KEYFRAMES": function() { return /* binding */ KEYFRAMES; },
/* harmony export */   "MEDIA": function() { return /* binding */ MEDIA; },
/* harmony export */   "MOZ": function() { return /* binding */ MOZ; },
/* harmony export */   "MS": function() { return /* binding */ MS; },
/* harmony export */   "NAMESPACE": function() { return /* binding */ NAMESPACE; },
/* harmony export */   "PAGE": function() { return /* binding */ PAGE; },
/* harmony export */   "RULESET": function() { return /* binding */ RULESET; },
/* harmony export */   "SUPPORTS": function() { return /* binding */ SUPPORTS; },
/* harmony export */   "VIEWPORT": function() { return /* binding */ VIEWPORT; },
/* harmony export */   "WEBKIT": function() { return /* binding */ WEBKIT; }
/* harmony export */ });
var MS = '-ms-'
var MOZ = '-moz-'
var WEBKIT = '-webkit-'

var COMMENT = 'comm'
var RULESET = 'rule'
var DECLARATION = 'decl'

var PAGE = '@page'
var MEDIA = '@media'
var IMPORT = '@import'
var CHARSET = '@charset'
var VIEWPORT = '@viewport'
var SUPPORTS = '@supports'
var DOCUMENT = '@document'
var NAMESPACE = '@namespace'
var KEYFRAMES = '@keyframes'
var FONT_FACE = '@font-face'
var COUNTER_STYLE = '@counter-style'
var FONT_FEATURE_VALUES = '@font-feature-values'


/***/ }),

/***/ "./node_modules/stylis/src/Middleware.js":
/*!***********************************************!*\
  !*** ./node_modules/stylis/src/Middleware.js ***!
  \***********************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "middleware": function() { return /* binding */ middleware; },
/* harmony export */   "namespace": function() { return /* binding */ namespace; },
/* harmony export */   "prefixer": function() { return /* binding */ prefixer; },
/* harmony export */   "rulesheet": function() { return /* binding */ rulesheet; }
/* harmony export */ });
/* harmony import */ var _Enum_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Enum.js */ "./node_modules/stylis/src/Enum.js");
/* harmony import */ var _Utility_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Utility.js */ "./node_modules/stylis/src/Utility.js");
/* harmony import */ var _Tokenizer_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./Tokenizer.js */ "./node_modules/stylis/src/Tokenizer.js");
/* harmony import */ var _Serializer_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./Serializer.js */ "./node_modules/stylis/src/Serializer.js");
/* harmony import */ var _Prefixer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Prefixer.js */ "./node_modules/stylis/src/Prefixer.js");






/**
 * @param {function[]} collection
 * @return {function}
 */
function middleware (collection) {
	var length = (0,_Utility_js__WEBPACK_IMPORTED_MODULE_0__.sizeof)(collection)

	return function (element, index, children, callback) {
		var output = ''

		for (var i = 0; i < length; i++)
			output += collection[i](element, index, children, callback) || ''

		return output
	}
}

/**
 * @param {function} callback
 * @return {function}
 */
function rulesheet (callback) {
	return function (element) {
		if (!element.root)
			if (element = element.return)
				callback(element)
	}
}

/**
 * @param {object} element
 * @param {number} index
 * @param {object[]} children
 * @param {function} callback
 */
function prefixer (element, index, children, callback) {
	if (element.length > -1)
		if (!element.return)
			switch (element.type) {
				case _Enum_js__WEBPACK_IMPORTED_MODULE_1__.DECLARATION: element.return = (0,_Prefixer_js__WEBPACK_IMPORTED_MODULE_2__.prefix)(element.value, element.length)
					break
				case _Enum_js__WEBPACK_IMPORTED_MODULE_1__.KEYFRAMES:
					return (0,_Serializer_js__WEBPACK_IMPORTED_MODULE_3__.serialize)([(0,_Tokenizer_js__WEBPACK_IMPORTED_MODULE_4__.copy)(element, {value: (0,_Utility_js__WEBPACK_IMPORTED_MODULE_0__.replace)(element.value, '@', '@' + _Enum_js__WEBPACK_IMPORTED_MODULE_1__.WEBKIT)})], callback)
				case _Enum_js__WEBPACK_IMPORTED_MODULE_1__.RULESET:
					if (element.length)
						return (0,_Utility_js__WEBPACK_IMPORTED_MODULE_0__.combine)(element.props, function (value) {
							switch ((0,_Utility_js__WEBPACK_IMPORTED_MODULE_0__.match)(value, /(::plac\w+|:read-\w+)/)) {
								// :read-(only|write)
								case ':read-only': case ':read-write':
									return (0,_Serializer_js__WEBPACK_IMPORTED_MODULE_3__.serialize)([(0,_Tokenizer_js__WEBPACK_IMPORTED_MODULE_4__.copy)(element, {props: [(0,_Utility_js__WEBPACK_IMPORTED_MODULE_0__.replace)(value, /:(read-\w+)/, ':' + _Enum_js__WEBPACK_IMPORTED_MODULE_1__.MOZ + '$1')]})], callback)
								// :placeholder
								case '::placeholder':
									return (0,_Serializer_js__WEBPACK_IMPORTED_MODULE_3__.serialize)([
										(0,_Tokenizer_js__WEBPACK_IMPORTED_MODULE_4__.copy)(element, {props: [(0,_Utility_js__WEBPACK_IMPORTED_MODULE_0__.replace)(value, /:(plac\w+)/, ':' + _Enum_js__WEBPACK_IMPORTED_MODULE_1__.WEBKIT + 'input-$1')]}),
										(0,_Tokenizer_js__WEBPACK_IMPORTED_MODULE_4__.copy)(element, {props: [(0,_Utility_js__WEBPACK_IMPORTED_MODULE_0__.replace)(value, /:(plac\w+)/, ':' + _Enum_js__WEBPACK_IMPORTED_MODULE_1__.MOZ + '$1')]}),
										(0,_Tokenizer_js__WEBPACK_IMPORTED_MODULE_4__.copy)(element, {props: [(0,_Utility_js__WEBPACK_IMPORTED_MODULE_0__.replace)(value, /:(plac\w+)/, _Enum_js__WEBPACK_IMPORTED_MODULE_1__.MS + 'input-$1')]})
									], callback)
							}

							return ''
						})
			}
}

/**
 * @param {object} element
 * @param {number} index
 * @param {object[]} children
 */
function namespace (element) {
	switch (element.type) {
		case _Enum_js__WEBPACK_IMPORTED_MODULE_1__.RULESET:
			element.props = element.props.map(function (value) {
				return (0,_Utility_js__WEBPACK_IMPORTED_MODULE_0__.combine)((0,_Tokenizer_js__WEBPACK_IMPORTED_MODULE_4__.tokenize)(value), function (value, index, children) {
					switch ((0,_Utility_js__WEBPACK_IMPORTED_MODULE_0__.charat)(value, 0)) {
						// \f
						case 12:
							return (0,_Utility_js__WEBPACK_IMPORTED_MODULE_0__.substr)(value, 1, (0,_Utility_js__WEBPACK_IMPORTED_MODULE_0__.strlen)(value))
						// \0 ( + > ~
						case 0: case 40: case 43: case 62: case 126:
							return value
						// :
						case 58:
							if (children[++index] === 'global')
								children[index] = '', children[++index] = '\f' + (0,_Utility_js__WEBPACK_IMPORTED_MODULE_0__.substr)(children[index], index = 1, -1)
						// \s
						case 32:
							return index === 1 ? '' : value
						default:
							switch (index) {
								case 0: element = value
									return (0,_Utility_js__WEBPACK_IMPORTED_MODULE_0__.sizeof)(children) > 1 ? '' : value
								case index = (0,_Utility_js__WEBPACK_IMPORTED_MODULE_0__.sizeof)(children) - 1: case 2:
									return index === 2 ? value + element + element : value + element
								default:
									return value
							}
					}
				})
			})
	}
}


/***/ }),

/***/ "./node_modules/stylis/src/Parser.js":
/*!*******************************************!*\
  !*** ./node_modules/stylis/src/Parser.js ***!
  \*******************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "comment": function() { return /* binding */ comment; },
/* harmony export */   "compile": function() { return /* binding */ compile; },
/* harmony export */   "declaration": function() { return /* binding */ declaration; },
/* harmony export */   "parse": function() { return /* binding */ parse; },
/* harmony export */   "ruleset": function() { return /* binding */ ruleset; }
/* harmony export */ });
/* harmony import */ var _Enum_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Enum.js */ "./node_modules/stylis/src/Enum.js");
/* harmony import */ var _Utility_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Utility.js */ "./node_modules/stylis/src/Utility.js");
/* harmony import */ var _Tokenizer_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Tokenizer.js */ "./node_modules/stylis/src/Tokenizer.js");




/**
 * @param {string} value
 * @return {object[]}
 */
function compile (value) {
	return (0,_Tokenizer_js__WEBPACK_IMPORTED_MODULE_0__.dealloc)(parse('', null, null, null, [''], value = (0,_Tokenizer_js__WEBPACK_IMPORTED_MODULE_0__.alloc)(value), 0, [0], value))
}

/**
 * @param {string} value
 * @param {object} root
 * @param {object?} parent
 * @param {string[]} rule
 * @param {string[]} rules
 * @param {string[]} rulesets
 * @param {number[]} pseudo
 * @param {number[]} points
 * @param {string[]} declarations
 * @return {object}
 */
function parse (value, root, parent, rule, rules, rulesets, pseudo, points, declarations) {
	var index = 0
	var offset = 0
	var length = pseudo
	var atrule = 0
	var property = 0
	var previous = 0
	var variable = 1
	var scanning = 1
	var ampersand = 1
	var character = 0
	var type = ''
	var props = rules
	var children = rulesets
	var reference = rule
	var characters = type

	while (scanning)
		switch (previous = character, character = (0,_Tokenizer_js__WEBPACK_IMPORTED_MODULE_0__.next)()) {
			// (
			case 40:
				if (previous != 108 && characters.charCodeAt(length - 1) == 58) {
					if ((0,_Utility_js__WEBPACK_IMPORTED_MODULE_1__.indexof)(characters += (0,_Utility_js__WEBPACK_IMPORTED_MODULE_1__.replace)((0,_Tokenizer_js__WEBPACK_IMPORTED_MODULE_0__.delimit)(character), '&', '&\f'), '&\f') != -1)
						ampersand = -1
					break
				}
			// " ' [
			case 34: case 39: case 91:
				characters += (0,_Tokenizer_js__WEBPACK_IMPORTED_MODULE_0__.delimit)(character)
				break
			// \t \n \r \s
			case 9: case 10: case 13: case 32:
				characters += (0,_Tokenizer_js__WEBPACK_IMPORTED_MODULE_0__.whitespace)(previous)
				break
			// \
			case 92:
				characters += (0,_Tokenizer_js__WEBPACK_IMPORTED_MODULE_0__.escaping)((0,_Tokenizer_js__WEBPACK_IMPORTED_MODULE_0__.caret)() - 1, 7)
				continue
			// /
			case 47:
				switch ((0,_Tokenizer_js__WEBPACK_IMPORTED_MODULE_0__.peek)()) {
					case 42: case 47:
						;(0,_Utility_js__WEBPACK_IMPORTED_MODULE_1__.append)(comment((0,_Tokenizer_js__WEBPACK_IMPORTED_MODULE_0__.commenter)((0,_Tokenizer_js__WEBPACK_IMPORTED_MODULE_0__.next)(), (0,_Tokenizer_js__WEBPACK_IMPORTED_MODULE_0__.caret)()), root, parent), declarations)
						break
					default:
						characters += '/'
				}
				break
			// {
			case 123 * variable:
				points[index++] = (0,_Utility_js__WEBPACK_IMPORTED_MODULE_1__.strlen)(characters) * ampersand
			// } ; \0
			case 125 * variable: case 59: case 0:
				switch (character) {
					// \0 }
					case 0: case 125: scanning = 0
					// ;
					case 59 + offset:
						if (property > 0 && ((0,_Utility_js__WEBPACK_IMPORTED_MODULE_1__.strlen)(characters) - length))
							(0,_Utility_js__WEBPACK_IMPORTED_MODULE_1__.append)(property > 32 ? declaration(characters + ';', rule, parent, length - 1) : declaration((0,_Utility_js__WEBPACK_IMPORTED_MODULE_1__.replace)(characters, ' ', '') + ';', rule, parent, length - 2), declarations)
						break
					// @ ;
					case 59: characters += ';'
					// { rule/at-rule
					default:
						;(0,_Utility_js__WEBPACK_IMPORTED_MODULE_1__.append)(reference = ruleset(characters, root, parent, index, offset, rules, points, type, props = [], children = [], length), rulesets)

						if (character === 123)
							if (offset === 0)
								parse(characters, root, reference, reference, props, rulesets, length, points, children)
							else
								switch (atrule) {
									// d m s
									case 100: case 109: case 115:
										parse(value, reference, reference, rule && (0,_Utility_js__WEBPACK_IMPORTED_MODULE_1__.append)(ruleset(value, reference, reference, 0, 0, rules, points, type, rules, props = [], length), children), rules, children, length, points, rule ? props : children)
										break
									default:
										parse(characters, reference, reference, reference, [''], children, 0, points, children)
								}
				}

				index = offset = property = 0, variable = ampersand = 1, type = characters = '', length = pseudo
				break
			// :
			case 58:
				length = 1 + (0,_Utility_js__WEBPACK_IMPORTED_MODULE_1__.strlen)(characters), property = previous
			default:
				if (variable < 1)
					if (character == 123)
						--variable
					else if (character == 125 && variable++ == 0 && (0,_Tokenizer_js__WEBPACK_IMPORTED_MODULE_0__.prev)() == 125)
						continue

				switch (characters += (0,_Utility_js__WEBPACK_IMPORTED_MODULE_1__.from)(character), character * variable) {
					// &
					case 38:
						ampersand = offset > 0 ? 1 : (characters += '\f', -1)
						break
					// ,
					case 44:
						points[index++] = ((0,_Utility_js__WEBPACK_IMPORTED_MODULE_1__.strlen)(characters) - 1) * ampersand, ampersand = 1
						break
					// @
					case 64:
						// -
						if ((0,_Tokenizer_js__WEBPACK_IMPORTED_MODULE_0__.peek)() === 45)
							characters += (0,_Tokenizer_js__WEBPACK_IMPORTED_MODULE_0__.delimit)((0,_Tokenizer_js__WEBPACK_IMPORTED_MODULE_0__.next)())

						atrule = (0,_Tokenizer_js__WEBPACK_IMPORTED_MODULE_0__.peek)(), offset = length = (0,_Utility_js__WEBPACK_IMPORTED_MODULE_1__.strlen)(type = characters += (0,_Tokenizer_js__WEBPACK_IMPORTED_MODULE_0__.identifier)((0,_Tokenizer_js__WEBPACK_IMPORTED_MODULE_0__.caret)())), character++
						break
					// -
					case 45:
						if (previous === 45 && (0,_Utility_js__WEBPACK_IMPORTED_MODULE_1__.strlen)(characters) == 2)
							variable = 0
				}
		}

	return rulesets
}

/**
 * @param {string} value
 * @param {object} root
 * @param {object?} parent
 * @param {number} index
 * @param {number} offset
 * @param {string[]} rules
 * @param {number[]} points
 * @param {string} type
 * @param {string[]} props
 * @param {string[]} children
 * @param {number} length
 * @return {object}
 */
function ruleset (value, root, parent, index, offset, rules, points, type, props, children, length) {
	var post = offset - 1
	var rule = offset === 0 ? rules : ['']
	var size = (0,_Utility_js__WEBPACK_IMPORTED_MODULE_1__.sizeof)(rule)

	for (var i = 0, j = 0, k = 0; i < index; ++i)
		for (var x = 0, y = (0,_Utility_js__WEBPACK_IMPORTED_MODULE_1__.substr)(value, post + 1, post = (0,_Utility_js__WEBPACK_IMPORTED_MODULE_1__.abs)(j = points[i])), z = value; x < size; ++x)
			if (z = (0,_Utility_js__WEBPACK_IMPORTED_MODULE_1__.trim)(j > 0 ? rule[x] + ' ' + y : (0,_Utility_js__WEBPACK_IMPORTED_MODULE_1__.replace)(y, /&\f/g, rule[x])))
				props[k++] = z

	return (0,_Tokenizer_js__WEBPACK_IMPORTED_MODULE_0__.node)(value, root, parent, offset === 0 ? _Enum_js__WEBPACK_IMPORTED_MODULE_2__.RULESET : type, props, children, length)
}

/**
 * @param {number} value
 * @param {object} root
 * @param {object?} parent
 * @return {object}
 */
function comment (value, root, parent) {
	return (0,_Tokenizer_js__WEBPACK_IMPORTED_MODULE_0__.node)(value, root, parent, _Enum_js__WEBPACK_IMPORTED_MODULE_2__.COMMENT, (0,_Utility_js__WEBPACK_IMPORTED_MODULE_1__.from)((0,_Tokenizer_js__WEBPACK_IMPORTED_MODULE_0__.char)()), (0,_Utility_js__WEBPACK_IMPORTED_MODULE_1__.substr)(value, 2, -2), 0)
}

/**
 * @param {string} value
 * @param {object} root
 * @param {object?} parent
 * @param {number} length
 * @return {object}
 */
function declaration (value, root, parent, length) {
	return (0,_Tokenizer_js__WEBPACK_IMPORTED_MODULE_0__.node)(value, root, parent, _Enum_js__WEBPACK_IMPORTED_MODULE_2__.DECLARATION, (0,_Utility_js__WEBPACK_IMPORTED_MODULE_1__.substr)(value, 0, length), (0,_Utility_js__WEBPACK_IMPORTED_MODULE_1__.substr)(value, length + 1, -1), length)
}


/***/ }),

/***/ "./node_modules/stylis/src/Prefixer.js":
/*!*********************************************!*\
  !*** ./node_modules/stylis/src/Prefixer.js ***!
  \*********************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "prefix": function() { return /* binding */ prefix; }
/* harmony export */ });
/* harmony import */ var _Enum_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Enum.js */ "./node_modules/stylis/src/Enum.js");
/* harmony import */ var _Utility_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Utility.js */ "./node_modules/stylis/src/Utility.js");



/**
 * @param {string} value
 * @param {number} length
 * @return {string}
 */
function prefix (value, length) {
	switch ((0,_Utility_js__WEBPACK_IMPORTED_MODULE_0__.hash)(value, length)) {
		// color-adjust
		case 5103:
			return _Enum_js__WEBPACK_IMPORTED_MODULE_1__.WEBKIT + 'print-' + value + value
		// animation, animation-(delay|direction|duration|fill-mode|iteration-count|name|play-state|timing-function)
		case 5737: case 4201: case 3177: case 3433: case 1641: case 4457: case 2921:
		// text-decoration, filter, clip-path, backface-visibility, column, box-decoration-break
		case 5572: case 6356: case 5844: case 3191: case 6645: case 3005:
		// mask, mask-image, mask-(mode|clip|size), mask-(repeat|origin), mask-position, mask-composite,
		case 6391: case 5879: case 5623: case 6135: case 4599: case 4855:
		// background-clip, columns, column-(count|fill|gap|rule|rule-color|rule-style|rule-width|span|width)
		case 4215: case 6389: case 5109: case 5365: case 5621: case 3829:
			return _Enum_js__WEBPACK_IMPORTED_MODULE_1__.WEBKIT + value + value
		// appearance, user-select, transform, hyphens, text-size-adjust
		case 5349: case 4246: case 4810: case 6968: case 2756:
			return _Enum_js__WEBPACK_IMPORTED_MODULE_1__.WEBKIT + value + _Enum_js__WEBPACK_IMPORTED_MODULE_1__.MOZ + value + _Enum_js__WEBPACK_IMPORTED_MODULE_1__.MS + value + value
		// flex, flex-direction
		case 6828: case 4268:
			return _Enum_js__WEBPACK_IMPORTED_MODULE_1__.WEBKIT + value + _Enum_js__WEBPACK_IMPORTED_MODULE_1__.MS + value + value
		// order
		case 6165:
			return _Enum_js__WEBPACK_IMPORTED_MODULE_1__.WEBKIT + value + _Enum_js__WEBPACK_IMPORTED_MODULE_1__.MS + 'flex-' + value + value
		// align-items
		case 5187:
			return _Enum_js__WEBPACK_IMPORTED_MODULE_1__.WEBKIT + value + (0,_Utility_js__WEBPACK_IMPORTED_MODULE_0__.replace)(value, /(\w+).+(:[^]+)/, _Enum_js__WEBPACK_IMPORTED_MODULE_1__.WEBKIT + 'box-$1$2' + _Enum_js__WEBPACK_IMPORTED_MODULE_1__.MS + 'flex-$1$2') + value
		// align-self
		case 5443:
			return _Enum_js__WEBPACK_IMPORTED_MODULE_1__.WEBKIT + value + _Enum_js__WEBPACK_IMPORTED_MODULE_1__.MS + 'flex-item-' + (0,_Utility_js__WEBPACK_IMPORTED_MODULE_0__.replace)(value, /flex-|-self/, '') + value
		// align-content
		case 4675:
			return _Enum_js__WEBPACK_IMPORTED_MODULE_1__.WEBKIT + value + _Enum_js__WEBPACK_IMPORTED_MODULE_1__.MS + 'flex-line-pack' + (0,_Utility_js__WEBPACK_IMPORTED_MODULE_0__.replace)(value, /align-content|flex-|-self/, '') + value
		// flex-shrink
		case 5548:
			return _Enum_js__WEBPACK_IMPORTED_MODULE_1__.WEBKIT + value + _Enum_js__WEBPACK_IMPORTED_MODULE_1__.MS + (0,_Utility_js__WEBPACK_IMPORTED_MODULE_0__.replace)(value, 'shrink', 'negative') + value
		// flex-basis
		case 5292:
			return _Enum_js__WEBPACK_IMPORTED_MODULE_1__.WEBKIT + value + _Enum_js__WEBPACK_IMPORTED_MODULE_1__.MS + (0,_Utility_js__WEBPACK_IMPORTED_MODULE_0__.replace)(value, 'basis', 'preferred-size') + value
		// flex-grow
		case 6060:
			return _Enum_js__WEBPACK_IMPORTED_MODULE_1__.WEBKIT + 'box-' + (0,_Utility_js__WEBPACK_IMPORTED_MODULE_0__.replace)(value, '-grow', '') + _Enum_js__WEBPACK_IMPORTED_MODULE_1__.WEBKIT + value + _Enum_js__WEBPACK_IMPORTED_MODULE_1__.MS + (0,_Utility_js__WEBPACK_IMPORTED_MODULE_0__.replace)(value, 'grow', 'positive') + value
		// transition
		case 4554:
			return _Enum_js__WEBPACK_IMPORTED_MODULE_1__.WEBKIT + (0,_Utility_js__WEBPACK_IMPORTED_MODULE_0__.replace)(value, /([^-])(transform)/g, '$1' + _Enum_js__WEBPACK_IMPORTED_MODULE_1__.WEBKIT + '$2') + value
		// cursor
		case 6187:
			return (0,_Utility_js__WEBPACK_IMPORTED_MODULE_0__.replace)((0,_Utility_js__WEBPACK_IMPORTED_MODULE_0__.replace)((0,_Utility_js__WEBPACK_IMPORTED_MODULE_0__.replace)(value, /(zoom-|grab)/, _Enum_js__WEBPACK_IMPORTED_MODULE_1__.WEBKIT + '$1'), /(image-set)/, _Enum_js__WEBPACK_IMPORTED_MODULE_1__.WEBKIT + '$1'), value, '') + value
		// background, background-image
		case 5495: case 3959:
			return (0,_Utility_js__WEBPACK_IMPORTED_MODULE_0__.replace)(value, /(image-set\([^]*)/, _Enum_js__WEBPACK_IMPORTED_MODULE_1__.WEBKIT + '$1' + '$`$1')
		// justify-content
		case 4968:
			return (0,_Utility_js__WEBPACK_IMPORTED_MODULE_0__.replace)((0,_Utility_js__WEBPACK_IMPORTED_MODULE_0__.replace)(value, /(.+:)(flex-)?(.*)/, _Enum_js__WEBPACK_IMPORTED_MODULE_1__.WEBKIT + 'box-pack:$3' + _Enum_js__WEBPACK_IMPORTED_MODULE_1__.MS + 'flex-pack:$3'), /s.+-b[^;]+/, 'justify') + _Enum_js__WEBPACK_IMPORTED_MODULE_1__.WEBKIT + value + value
		// (margin|padding)-inline-(start|end)
		case 4095: case 3583: case 4068: case 2532:
			return (0,_Utility_js__WEBPACK_IMPORTED_MODULE_0__.replace)(value, /(.+)-inline(.+)/, _Enum_js__WEBPACK_IMPORTED_MODULE_1__.WEBKIT + '$1$2') + value
		// (min|max)?(width|height|inline-size|block-size)
		case 8116: case 7059: case 5753: case 5535:
		case 5445: case 5701: case 4933: case 4677:
		case 5533: case 5789: case 5021: case 4765:
			// stretch, max-content, min-content, fill-available
			if ((0,_Utility_js__WEBPACK_IMPORTED_MODULE_0__.strlen)(value) - 1 - length > 6)
				switch ((0,_Utility_js__WEBPACK_IMPORTED_MODULE_0__.charat)(value, length + 1)) {
					// (m)ax-content, (m)in-content
					case 109:
						// -
						if ((0,_Utility_js__WEBPACK_IMPORTED_MODULE_0__.charat)(value, length + 4) !== 45)
							break
					// (f)ill-available, (f)it-content
					case 102:
						return (0,_Utility_js__WEBPACK_IMPORTED_MODULE_0__.replace)(value, /(.+:)(.+)-([^]+)/, '$1' + _Enum_js__WEBPACK_IMPORTED_MODULE_1__.WEBKIT + '$2-$3' + '$1' + _Enum_js__WEBPACK_IMPORTED_MODULE_1__.MOZ + ((0,_Utility_js__WEBPACK_IMPORTED_MODULE_0__.charat)(value, length + 3) == 108 ? '$3' : '$2-$3')) + value
					// (s)tretch
					case 115:
						return ~(0,_Utility_js__WEBPACK_IMPORTED_MODULE_0__.indexof)(value, 'stretch') ? prefix((0,_Utility_js__WEBPACK_IMPORTED_MODULE_0__.replace)(value, 'stretch', 'fill-available'), length) + value : value
				}
			break
		// position: sticky
		case 4949:
			// (s)ticky?
			if ((0,_Utility_js__WEBPACK_IMPORTED_MODULE_0__.charat)(value, length + 1) !== 115)
				break
		// display: (flex|inline-flex)
		case 6444:
			switch ((0,_Utility_js__WEBPACK_IMPORTED_MODULE_0__.charat)(value, (0,_Utility_js__WEBPACK_IMPORTED_MODULE_0__.strlen)(value) - 3 - (~(0,_Utility_js__WEBPACK_IMPORTED_MODULE_0__.indexof)(value, '!important') && 10))) {
				// stic(k)y
				case 107:
					return (0,_Utility_js__WEBPACK_IMPORTED_MODULE_0__.replace)(value, ':', ':' + _Enum_js__WEBPACK_IMPORTED_MODULE_1__.WEBKIT) + value
				// (inline-)?fl(e)x
				case 101:
					return (0,_Utility_js__WEBPACK_IMPORTED_MODULE_0__.replace)(value, /(.+:)([^;!]+)(;|!.+)?/, '$1' + _Enum_js__WEBPACK_IMPORTED_MODULE_1__.WEBKIT + ((0,_Utility_js__WEBPACK_IMPORTED_MODULE_0__.charat)(value, 14) === 45 ? 'inline-' : '') + 'box$3' + '$1' + _Enum_js__WEBPACK_IMPORTED_MODULE_1__.WEBKIT + '$2$3' + '$1' + _Enum_js__WEBPACK_IMPORTED_MODULE_1__.MS + '$2box$3') + value
			}
			break
		// writing-mode
		case 5936:
			switch ((0,_Utility_js__WEBPACK_IMPORTED_MODULE_0__.charat)(value, length + 11)) {
				// vertical-l(r)
				case 114:
					return _Enum_js__WEBPACK_IMPORTED_MODULE_1__.WEBKIT + value + _Enum_js__WEBPACK_IMPORTED_MODULE_1__.MS + (0,_Utility_js__WEBPACK_IMPORTED_MODULE_0__.replace)(value, /[svh]\w+-[tblr]{2}/, 'tb') + value
				// vertical-r(l)
				case 108:
					return _Enum_js__WEBPACK_IMPORTED_MODULE_1__.WEBKIT + value + _Enum_js__WEBPACK_IMPORTED_MODULE_1__.MS + (0,_Utility_js__WEBPACK_IMPORTED_MODULE_0__.replace)(value, /[svh]\w+-[tblr]{2}/, 'tb-rl') + value
				// horizontal(-)tb
				case 45:
					return _Enum_js__WEBPACK_IMPORTED_MODULE_1__.WEBKIT + value + _Enum_js__WEBPACK_IMPORTED_MODULE_1__.MS + (0,_Utility_js__WEBPACK_IMPORTED_MODULE_0__.replace)(value, /[svh]\w+-[tblr]{2}/, 'lr') + value
			}

			return _Enum_js__WEBPACK_IMPORTED_MODULE_1__.WEBKIT + value + _Enum_js__WEBPACK_IMPORTED_MODULE_1__.MS + value + value
	}

	return value
}


/***/ }),

/***/ "./node_modules/stylis/src/Serializer.js":
/*!***********************************************!*\
  !*** ./node_modules/stylis/src/Serializer.js ***!
  \***********************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "serialize": function() { return /* binding */ serialize; },
/* harmony export */   "stringify": function() { return /* binding */ stringify; }
/* harmony export */ });
/* harmony import */ var _Enum_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Enum.js */ "./node_modules/stylis/src/Enum.js");
/* harmony import */ var _Utility_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Utility.js */ "./node_modules/stylis/src/Utility.js");



/**
 * @param {object[]} children
 * @param {function} callback
 * @return {string}
 */
function serialize (children, callback) {
	var output = ''
	var length = (0,_Utility_js__WEBPACK_IMPORTED_MODULE_0__.sizeof)(children)

	for (var i = 0; i < length; i++)
		output += callback(children[i], i, children, callback) || ''

	return output
}

/**
 * @param {object} element
 * @param {number} index
 * @param {object[]} children
 * @param {function} callback
 * @return {string}
 */
function stringify (element, index, children, callback) {
	switch (element.type) {
		case _Enum_js__WEBPACK_IMPORTED_MODULE_1__.IMPORT: case _Enum_js__WEBPACK_IMPORTED_MODULE_1__.DECLARATION: return element.return = element.return || element.value
		case _Enum_js__WEBPACK_IMPORTED_MODULE_1__.COMMENT: return ''
		case _Enum_js__WEBPACK_IMPORTED_MODULE_1__.KEYFRAMES: return element.return = element.value + '{' + serialize(element.children, callback) + '}'
		case _Enum_js__WEBPACK_IMPORTED_MODULE_1__.RULESET: element.value = element.props.join(',')
	}

	return (0,_Utility_js__WEBPACK_IMPORTED_MODULE_0__.strlen)(children = serialize(element.children, callback)) ? element.return = element.value + '{' + children + '}' : ''
}


/***/ }),

/***/ "./node_modules/stylis/src/Tokenizer.js":
/*!**********************************************!*\
  !*** ./node_modules/stylis/src/Tokenizer.js ***!
  \**********************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "alloc": function() { return /* binding */ alloc; },
/* harmony export */   "caret": function() { return /* binding */ caret; },
/* harmony export */   "char": function() { return /* binding */ char; },
/* harmony export */   "character": function() { return /* binding */ character; },
/* harmony export */   "characters": function() { return /* binding */ characters; },
/* harmony export */   "column": function() { return /* binding */ column; },
/* harmony export */   "commenter": function() { return /* binding */ commenter; },
/* harmony export */   "copy": function() { return /* binding */ copy; },
/* harmony export */   "dealloc": function() { return /* binding */ dealloc; },
/* harmony export */   "delimit": function() { return /* binding */ delimit; },
/* harmony export */   "delimiter": function() { return /* binding */ delimiter; },
/* harmony export */   "escaping": function() { return /* binding */ escaping; },
/* harmony export */   "identifier": function() { return /* binding */ identifier; },
/* harmony export */   "length": function() { return /* binding */ length; },
/* harmony export */   "line": function() { return /* binding */ line; },
/* harmony export */   "next": function() { return /* binding */ next; },
/* harmony export */   "node": function() { return /* binding */ node; },
/* harmony export */   "peek": function() { return /* binding */ peek; },
/* harmony export */   "position": function() { return /* binding */ position; },
/* harmony export */   "prev": function() { return /* binding */ prev; },
/* harmony export */   "slice": function() { return /* binding */ slice; },
/* harmony export */   "token": function() { return /* binding */ token; },
/* harmony export */   "tokenize": function() { return /* binding */ tokenize; },
/* harmony export */   "tokenizer": function() { return /* binding */ tokenizer; },
/* harmony export */   "whitespace": function() { return /* binding */ whitespace; }
/* harmony export */ });
/* harmony import */ var _Utility_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Utility.js */ "./node_modules/stylis/src/Utility.js");


var line = 1
var column = 1
var length = 0
var position = 0
var character = 0
var characters = ''

/**
 * @param {string} value
 * @param {object | null} root
 * @param {object | null} parent
 * @param {string} type
 * @param {string[] | string} props
 * @param {object[] | string} children
 * @param {number} length
 */
function node (value, root, parent, type, props, children, length) {
	return {value: value, root: root, parent: parent, type: type, props: props, children: children, line: line, column: column, length: length, return: ''}
}

/**
 * @param {object} root
 * @param {object} props
 * @return {object}
 */
function copy (root, props) {
	return (0,_Utility_js__WEBPACK_IMPORTED_MODULE_0__.assign)(node('', null, null, '', null, null, 0), root, {length: -root.length}, props)
}

/**
 * @return {number}
 */
function char () {
	return character
}

/**
 * @return {number}
 */
function prev () {
	character = position > 0 ? (0,_Utility_js__WEBPACK_IMPORTED_MODULE_0__.charat)(characters, --position) : 0

	if (column--, character === 10)
		column = 1, line--

	return character
}

/**
 * @return {number}
 */
function next () {
	character = position < length ? (0,_Utility_js__WEBPACK_IMPORTED_MODULE_0__.charat)(characters, position++) : 0

	if (column++, character === 10)
		column = 1, line++

	return character
}

/**
 * @return {number}
 */
function peek () {
	return (0,_Utility_js__WEBPACK_IMPORTED_MODULE_0__.charat)(characters, position)
}

/**
 * @return {number}
 */
function caret () {
	return position
}

/**
 * @param {number} begin
 * @param {number} end
 * @return {string}
 */
function slice (begin, end) {
	return (0,_Utility_js__WEBPACK_IMPORTED_MODULE_0__.substr)(characters, begin, end)
}

/**
 * @param {number} type
 * @return {number}
 */
function token (type) {
	switch (type) {
		// \0 \t \n \r \s whitespace token
		case 0: case 9: case 10: case 13: case 32:
			return 5
		// ! + , / > @ ~ isolate token
		case 33: case 43: case 44: case 47: case 62: case 64: case 126:
		// ; { } breakpoint token
		case 59: case 123: case 125:
			return 4
		// : accompanied token
		case 58:
			return 3
		// " ' ( [ opening delimit token
		case 34: case 39: case 40: case 91:
			return 2
		// ) ] closing delimit token
		case 41: case 93:
			return 1
	}

	return 0
}

/**
 * @param {string} value
 * @return {any[]}
 */
function alloc (value) {
	return line = column = 1, length = (0,_Utility_js__WEBPACK_IMPORTED_MODULE_0__.strlen)(characters = value), position = 0, []
}

/**
 * @param {any} value
 * @return {any}
 */
function dealloc (value) {
	return characters = '', value
}

/**
 * @param {number} type
 * @return {string}
 */
function delimit (type) {
	return (0,_Utility_js__WEBPACK_IMPORTED_MODULE_0__.trim)(slice(position - 1, delimiter(type === 91 ? type + 2 : type === 40 ? type + 1 : type)))
}

/**
 * @param {string} value
 * @return {string[]}
 */
function tokenize (value) {
	return dealloc(tokenizer(alloc(value)))
}

/**
 * @param {number} type
 * @return {string}
 */
function whitespace (type) {
	while (character = peek())
		if (character < 33)
			next()
		else
			break

	return token(type) > 2 || token(character) > 3 ? '' : ' '
}

/**
 * @param {string[]} children
 * @return {string[]}
 */
function tokenizer (children) {
	while (next())
		switch (token(character)) {
			case 0: (0,_Utility_js__WEBPACK_IMPORTED_MODULE_0__.append)(identifier(position - 1), children)
				break
			case 2: ;(0,_Utility_js__WEBPACK_IMPORTED_MODULE_0__.append)(delimit(character), children)
				break
			default: ;(0,_Utility_js__WEBPACK_IMPORTED_MODULE_0__.append)((0,_Utility_js__WEBPACK_IMPORTED_MODULE_0__.from)(character), children)
		}

	return children
}

/**
 * @param {number} index
 * @param {number} count
 * @return {string}
 */
function escaping (index, count) {
	while (--count && next())
		// not 0-9 A-F a-f
		if (character < 48 || character > 102 || (character > 57 && character < 65) || (character > 70 && character < 97))
			break

	return slice(index, caret() + (count < 6 && peek() == 32 && next() == 32))
}

/**
 * @param {number} type
 * @return {number}
 */
function delimiter (type) {
	while (next())
		switch (character) {
			// ] ) " '
			case type:
				return position
			// " '
			case 34: case 39:
				if (type !== 34 && type !== 39)
					delimiter(character)
				break
			// (
			case 40:
				if (type === 41)
					delimiter(type)
				break
			// \
			case 92:
				next()
				break
		}

	return position
}

/**
 * @param {number} type
 * @param {number} index
 * @return {number}
 */
function commenter (type, index) {
	while (next())
		// //
		if (type + character === 47 + 10)
			break
		// /*
		else if (type + character === 42 + 42 && peek() === 47)
			break

	return '/*' + slice(index, position - 1) + '*' + (0,_Utility_js__WEBPACK_IMPORTED_MODULE_0__.from)(type === 47 ? type : next())
}

/**
 * @param {number} index
 * @return {string}
 */
function identifier (index) {
	while (!token(peek()))
		next()

	return slice(index, position)
}


/***/ }),

/***/ "./node_modules/stylis/src/Utility.js":
/*!********************************************!*\
  !*** ./node_modules/stylis/src/Utility.js ***!
  \********************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "abs": function() { return /* binding */ abs; },
/* harmony export */   "append": function() { return /* binding */ append; },
/* harmony export */   "assign": function() { return /* binding */ assign; },
/* harmony export */   "charat": function() { return /* binding */ charat; },
/* harmony export */   "combine": function() { return /* binding */ combine; },
/* harmony export */   "from": function() { return /* binding */ from; },
/* harmony export */   "hash": function() { return /* binding */ hash; },
/* harmony export */   "indexof": function() { return /* binding */ indexof; },
/* harmony export */   "match": function() { return /* binding */ match; },
/* harmony export */   "replace": function() { return /* binding */ replace; },
/* harmony export */   "sizeof": function() { return /* binding */ sizeof; },
/* harmony export */   "strlen": function() { return /* binding */ strlen; },
/* harmony export */   "substr": function() { return /* binding */ substr; },
/* harmony export */   "trim": function() { return /* binding */ trim; }
/* harmony export */ });
/**
 * @param {number}
 * @return {number}
 */
var abs = Math.abs

/**
 * @param {number}
 * @return {string}
 */
var from = String.fromCharCode

/**
 * @param {object}
 * @return {object}
 */
var assign = Object.assign

/**
 * @param {string} value
 * @param {number} length
 * @return {number}
 */
function hash (value, length) {
	return (((((((length << 2) ^ charat(value, 0)) << 2) ^ charat(value, 1)) << 2) ^ charat(value, 2)) << 2) ^ charat(value, 3)
}

/**
 * @param {string} value
 * @return {string}
 */
function trim (value) {
	return value.trim()
}

/**
 * @param {string} value
 * @param {RegExp} pattern
 * @return {string?}
 */
function match (value, pattern) {
	return (value = pattern.exec(value)) ? value[0] : value
}

/**
 * @param {string} value
 * @param {(string|RegExp)} pattern
 * @param {string} replacement
 * @return {string}
 */
function replace (value, pattern, replacement) {
	return value.replace(pattern, replacement)
}

/**
 * @param {string} value
 * @param {string} search
 * @return {number}
 */
function indexof (value, search) {
	return value.indexOf(search)
}

/**
 * @param {string} value
 * @param {number} index
 * @return {number}
 */
function charat (value, index) {
	return value.charCodeAt(index) | 0
}

/**
 * @param {string} value
 * @param {number} begin
 * @param {number} end
 * @return {string}
 */
function substr (value, begin, end) {
	return value.slice(begin, end)
}

/**
 * @param {string} value
 * @return {number}
 */
function strlen (value) {
	return value.length
}

/**
 * @param {any[]} value
 * @return {number}
 */
function sizeof (value) {
	return value.length
}

/**
 * @param {any} value
 * @param {any[]} array
 * @return {any}
 */
function append (value, array) {
	return array.push(value), value
}

/**
 * @param {string[]} array
 * @param {function} callback
 * @return {string}
 */
function combine (array, callback) {
	return array.map(callback).join('')
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
/*!*************************!*\
  !*** ./src/settings.js ***!
  \*************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _settings_scss__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./settings.scss */ "./src/settings.scss");
/* harmony import */ var _components_Settings_SettingsContext__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./components/Settings/SettingsContext */ "./src/components/Settings/SettingsContext.js");
/* harmony import */ var _components_Settings__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./components/Settings */ "./src/components/Settings/index.js");






const App = () => {
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_components_Settings_SettingsContext__WEBPACK_IMPORTED_MODULE_2__.SettingsProvider, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_components_Settings__WEBPACK_IMPORTED_MODULE_3__["default"], null));
};

document.addEventListener('DOMContentLoaded', () => {
  const renderElementInstance = document.getElementById('wcapf-settings-admin-ui');

  if (renderElementInstance) {
    (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.render)((0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.StrictMode, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(App, null)), renderElementInstance);
  }
});
}();
/******/ })()
;
//# sourceMappingURL=settings.js.map