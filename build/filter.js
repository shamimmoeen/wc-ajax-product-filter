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

/***/ "./node_modules/@emotion/is-prop-valid/dist/emotion-is-prop-valid.browser.esm.js":
/*!***************************************************************************************!*\
  !*** ./node_modules/@emotion/is-prop-valid/dist/emotion-is-prop-valid.browser.esm.js ***!
  \***************************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _emotion_memoize__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @emotion/memoize */ "./node_modules/@emotion/memoize/dist/emotion-memoize.browser.esm.js");


var reactPropsRegex = /^((children|dangerouslySetInnerHTML|key|ref|autoFocus|defaultValue|defaultChecked|innerHTML|suppressContentEditableWarning|suppressHydrationWarning|valueLink|abbr|accept|acceptCharset|accessKey|action|allow|allowUserMedia|allowPaymentRequest|allowFullScreen|allowTransparency|alt|async|autoComplete|autoPlay|capture|cellPadding|cellSpacing|challenge|charSet|checked|cite|classID|className|cols|colSpan|content|contentEditable|contextMenu|controls|controlsList|coords|crossOrigin|data|dateTime|decoding|default|defer|dir|disabled|disablePictureInPicture|download|draggable|encType|enterKeyHint|form|formAction|formEncType|formMethod|formNoValidate|formTarget|frameBorder|headers|height|hidden|high|href|hrefLang|htmlFor|httpEquiv|id|inputMode|integrity|is|keyParams|keyType|kind|label|lang|list|loading|loop|low|marginHeight|marginWidth|max|maxLength|media|mediaGroup|method|min|minLength|multiple|muted|name|nonce|noValidate|open|optimum|pattern|placeholder|playsInline|poster|preload|profile|radioGroup|readOnly|referrerPolicy|rel|required|reversed|role|rows|rowSpan|sandbox|scope|scoped|scrolling|seamless|selected|shape|size|sizes|slot|span|spellCheck|src|srcDoc|srcLang|srcSet|start|step|style|summary|tabIndex|target|title|translate|type|useMap|value|width|wmode|wrap|about|datatype|inlist|prefix|property|resource|typeof|vocab|autoCapitalize|autoCorrect|autoSave|color|incremental|fallback|inert|itemProp|itemScope|itemType|itemID|itemRef|on|option|results|security|unselectable|accentHeight|accumulate|additive|alignmentBaseline|allowReorder|alphabetic|amplitude|arabicForm|ascent|attributeName|attributeType|autoReverse|azimuth|baseFrequency|baselineShift|baseProfile|bbox|begin|bias|by|calcMode|capHeight|clip|clipPathUnits|clipPath|clipRule|colorInterpolation|colorInterpolationFilters|colorProfile|colorRendering|contentScriptType|contentStyleType|cursor|cx|cy|d|decelerate|descent|diffuseConstant|direction|display|divisor|dominantBaseline|dur|dx|dy|edgeMode|elevation|enableBackground|end|exponent|externalResourcesRequired|fill|fillOpacity|fillRule|filter|filterRes|filterUnits|floodColor|floodOpacity|focusable|fontFamily|fontSize|fontSizeAdjust|fontStretch|fontStyle|fontVariant|fontWeight|format|from|fr|fx|fy|g1|g2|glyphName|glyphOrientationHorizontal|glyphOrientationVertical|glyphRef|gradientTransform|gradientUnits|hanging|horizAdvX|horizOriginX|ideographic|imageRendering|in|in2|intercept|k|k1|k2|k3|k4|kernelMatrix|kernelUnitLength|kerning|keyPoints|keySplines|keyTimes|lengthAdjust|letterSpacing|lightingColor|limitingConeAngle|local|markerEnd|markerMid|markerStart|markerHeight|markerUnits|markerWidth|mask|maskContentUnits|maskUnits|mathematical|mode|numOctaves|offset|opacity|operator|order|orient|orientation|origin|overflow|overlinePosition|overlineThickness|panose1|paintOrder|pathLength|patternContentUnits|patternTransform|patternUnits|pointerEvents|points|pointsAtX|pointsAtY|pointsAtZ|preserveAlpha|preserveAspectRatio|primitiveUnits|r|radius|refX|refY|renderingIntent|repeatCount|repeatDur|requiredExtensions|requiredFeatures|restart|result|rotate|rx|ry|scale|seed|shapeRendering|slope|spacing|specularConstant|specularExponent|speed|spreadMethod|startOffset|stdDeviation|stemh|stemv|stitchTiles|stopColor|stopOpacity|strikethroughPosition|strikethroughThickness|string|stroke|strokeDasharray|strokeDashoffset|strokeLinecap|strokeLinejoin|strokeMiterlimit|strokeOpacity|strokeWidth|surfaceScale|systemLanguage|tableValues|targetX|targetY|textAnchor|textDecoration|textRendering|textLength|to|transform|u1|u2|underlinePosition|underlineThickness|unicode|unicodeBidi|unicodeRange|unitsPerEm|vAlphabetic|vHanging|vIdeographic|vMathematical|values|vectorEffect|version|vertAdvY|vertOriginX|vertOriginY|viewBox|viewTarget|visibility|widths|wordSpacing|writingMode|x|xHeight|x1|x2|xChannelSelector|xlinkActuate|xlinkArcrole|xlinkHref|xlinkRole|xlinkShow|xlinkTitle|xlinkType|xmlBase|xmlns|xmlnsXlink|xmlLang|xmlSpace|y|y1|y2|yChannelSelector|z|zoomAndPan|for|class|autofocus)|(([Dd][Aa][Tt][Aa]|[Aa][Rr][Ii][Aa]|x)-.*))$/; // https://esbench.com/bench/5bfee68a4cd7e6009ef61d23

var isPropValid = /* #__PURE__ */(0,_emotion_memoize__WEBPACK_IMPORTED_MODULE_0__["default"])(function (prop) {
  return reactPropsRegex.test(prop) || prop.charCodeAt(0) === 111
  /* o */
  && prop.charCodeAt(1) === 110
  /* n */
  && prop.charCodeAt(2) < 91;
}
/* Z+1 */
);

/* harmony default export */ __webpack_exports__["default"] = (isPropValid);


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

/***/ "./node_modules/@wordpress/icons/build-module/library/drag-handle.js":
/*!***************************************************************************!*\
  !*** ./node_modules/@wordpress/icons/build-module/library/drag-handle.js ***!
  \***************************************************************************/
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

const dragHandle = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_primitives__WEBPACK_IMPORTED_MODULE_1__.SVG, {
  width: "24",
  height: "24",
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 24 24"
}, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_primitives__WEBPACK_IMPORTED_MODULE_1__.Path, {
  d: "M8 7h2V5H8v2zm0 6h2v-2H8v2zm0 6h2v-2H8v2zm6-14v2h2V5h-2zm0 8h2v-2h-2v2zm0 6h2v-2h-2v2z"
}));
/* harmony default export */ __webpack_exports__["default"] = (dragHandle);
//# sourceMappingURL=drag-handle.js.map

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
  }, (0,_Filter_utils__WEBPACK_IMPORTED_MODULE_3__.getAvailableFilters)().map(filter => {
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

/***/ "./src/components/CustomTabPanel.js":
/*!******************************************!*\
  !*** ./src/components/CustomTabPanel.js ***!
  \******************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ CustomTabPanel; }
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_extends__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/extends */ "./node_modules/@babel/runtime/helpers/esm/extends.js");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! classnames */ "./node_modules/classnames/index.js");
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(classnames__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! lodash */ "lodash");
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(lodash__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _wordpress_compose__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @wordpress/compose */ "@wordpress/compose");
/* harmony import */ var _wordpress_compose__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_wordpress_compose__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_5__);



/**
 * @wordpress/components '^19.16.0'
 * @wordpress/scripts '^23.5.0'
 */

/**
 * External dependencies
 */


/**
 * WordPress dependencies
 */



/**
 * Internal dependencies
 */



const noop = () => {};

const TabButton = _ref => {
  let {
    tabId,
    onClick,
    isDisabled,
    children,
    selected,
    ...rest
  } = _ref;
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_5__.Button, (0,_babel_runtime_helpers_extends__WEBPACK_IMPORTED_MODULE_0__["default"])({
    role: "tab",
    tabIndex: selected ? null : -1,
    "aria-selected": selected,
    id: tabId,
    onClick: onClick,
    disabled: isDisabled
  }, rest), children);
};

function CustomTabPanel(_ref2) {
  var _selectedTab$name;

  let {
    className,
    children,
    tabs,
    initialTabName,
    orientation = 'horizontal',
    activeClass = 'is-active',
    onSelect = noop
  } = _ref2;
  const instanceId = (0,_wordpress_compose__WEBPACK_IMPORTED_MODULE_4__.useInstanceId)(CustomTabPanel, 'tab-panel');
  const [selected, setSelected] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.useState)(null);

  const handleClick = tabKey => {
    setSelected(tabKey);
    onSelect(tabKey);
  };

  const onNavigate = (childIndex, child) => {
    child.click();
  };

  const selectedTab = (0,lodash__WEBPACK_IMPORTED_MODULE_3__.find)(tabs, {
    name: selected
  });
  const selectedId = `${instanceId}-${(_selectedTab$name = selectedTab === null || selectedTab === void 0 ? void 0 : selectedTab.name) !== null && _selectedTab$name !== void 0 ? _selectedTab$name : 'none'}`;
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.useEffect)(() => {
    const newSelectedTab = (0,lodash__WEBPACK_IMPORTED_MODULE_3__.find)(tabs, {
      name: selected
    });

    if (!newSelectedTab) {
      setSelected(initialTabName || (tabs.length > 0 ? tabs[0].name : null));
    }
  }, [tabs]);
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)("div", {
    className: className
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_5__.NavigableMenu, {
    role: "tablist",
    orientation: orientation,
    onNavigate: onNavigate,
    className: "components-tab-panel__tabs"
  }, tabs.map(tab => (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(TabButton, {
    className: classnames__WEBPACK_IMPORTED_MODULE_2___default()('components-tab-panel__tabs-item', tab.className, {
      [activeClass]: tab.name === selected
    }),
    tabId: `${instanceId}-${tab.name}`,
    "aria-controls": `${instanceId}-${tab.name}-view`,
    selected: tab.name === selected,
    key: tab.name,
    onClick: (0,lodash__WEBPACK_IMPORTED_MODULE_3__.partial)(handleClick, tab.name),
    isDisabled: tab.isDisabled
  }, tab.title))), selectedTab && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)("div", {
    key: selectedId,
    "aria-labelledby": selectedId,
    role: "tabpanel",
    id: `${selectedId}-view`,
    className: "components-tab-panel__tab-content"
  }, children(selectedTab)));
}

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
    onChange: onChange
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
      maxHeight: 90
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

/***/ "./src/components/Field/Radio.js":
/*!***************************************!*\
  !*** ./src/components/Field/Radio.js ***!
  \***************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! classnames */ "./node_modules/classnames/index.js");
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(classnames__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../utils */ "./src/components/utils.js");




const Radio = _ref => {
  let {
    label,
    id,
    value,
    options,
    isVertical,
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
    className: classnames__WEBPACK_IMPORTED_MODULE_1___default()('__wrapper', 'radio-group', {
      'radio-group-vertical': isVertical
    })
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "__input_wrapper"
  }, options.map((option, index) => (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    key: `${id}-${index}`,
    className: classnames__WEBPACK_IMPORTED_MODULE_1___default()('components-radio-control__option')
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("input", {
    id: `${id}-${index}`,
    className: "components-radio-control__input",
    type: "radio",
    name: id,
    value: option.value,
    onChange: onChange,
    checked: option.value === value
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("label", {
    htmlFor: `${id}-${index}`
  }, option.label, (0,_utils__WEBPACK_IMPORTED_MODULE_2__.proTag)(option.isPro))))))), description ? (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("p", {
    className: "description"
  }, description) : '');
};

/* harmony default export */ __webpack_exports__["default"] = (Radio);

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
/* harmony import */ var react_dropdown_select__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react-dropdown-select */ "./node_modules/react-dropdown-select/lib/index.js");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils */ "./src/components/utils.js");




const Select = _ref => {
  let {
    label,
    id,
    values,
    options,
    onChange,
    description,
    placeholder,
    searchable,
    clearable,
    isPro,
    width
  } = _ref;
  const style = width ? {
    width
  } : {};
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "__form_control"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "__inner"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "__label"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("label", {
    htmlFor: id
  }, label, (0,_utils__WEBPACK_IMPORTED_MODULE_1__.proTag)(isPro))), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "__wrapper"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "__input_wrapper"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(react_dropdown_select__WEBPACK_IMPORTED_MODULE_2__["default"], {
    id: id,
    options: options,
    values: values,
    className: "__custom_select_control",
    disabled: (0,_utils__WEBPACK_IMPORTED_MODULE_1__.isProFeature)(isPro),
    separator: true,
    onChange: onChange,
    placeholder: placeholder,
    searchable: searchable,
    clearable: clearable,
    style: style
  })))), description ? (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("p", {
    className: "description"
  }, description) : '');
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
    onChange: onChange
  }, rest))))), description ? (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)("p", {
    className: "description"
  }, description) : '');
};

/* harmony default export */ __webpack_exports__["default"] = (Text);

/***/ }),

/***/ "./src/components/Filter/FilterContext.js":
/*!************************************************!*\
  !*** ./src/components/Filter/FilterContext.js ***!
  \************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "FilterProvider": function() { return /* binding */ FilterProvider; },
/* harmony export */   "useFilter": function() { return /* binding */ useFilter; }
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _filterReducer__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./filterReducer */ "./src/components/Filter/filterReducer.js");



const FilterContext = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createContext)(_filterReducer__WEBPACK_IMPORTED_MODULE_1__.initialState);

const FilterProvider = _ref => {
  let {
    children
  } = _ref;
  const [state, dispatch] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useReducer)(_filterReducer__WEBPACK_IMPORTED_MODULE_1__["default"], _filterReducer__WEBPACK_IMPORTED_MODULE_1__.initialState);
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(FilterContext.Provider, {
    value: {
      state,
      dispatch
    }
  }, children);
};

const useFilter = () => {
  const context = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useContext)(FilterContext);

  if (context === undefined) {
    throw new Error('useFilter must be used within a FilterProvider');
  }

  return context;
};



/***/ }),

/***/ "./src/components/Filter/FilterNav/FilterUI/Advanced.js":
/*!**************************************************************!*\
  !*** ./src/components/Filter/FilterNav/FilterUI/Advanced.js ***!
  \**************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _Field_Checkbox__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../Field/Checkbox */ "./src/components/Field/Checkbox.js");
/* harmony import */ var _Field_Radio__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../Field/Radio */ "./src/components/Field/Radio.js");
/* harmony import */ var _Field_Text__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../Field/Text */ "./src/components/Field/Text.js");
/* harmony import */ var _FilterContext__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../FilterContext */ "./src/components/Filter/FilterContext.js");







const Advanced = () => {
  const {
    state: {
      activeFilterData
    },
    dispatch
  } = (0,_FilterContext__WEBPACK_IMPORTED_MODULE_5__.useFilter)();
  const {
    show_title,
    use_term_slug_in_url,
    enable_accordion,
    accordion_default_state,
    show_clear_button,
    enable_soft_limit,
    soft_limit
  } = activeFilterData;

  const handleCheckboxChange = (key, value) => {
    const _value = value ? '1' : '';

    dispatch({
      type: 'SET_ACTIVE_FILTER_DATA',
      payload: { ...activeFilterData,
        [key]: _value
      }
    });
  };

  const handleRadioChange = (e, key) => {
    const value = e.target.value;
    dispatch({
      type: 'SET_ACTIVE_FILTER_DATA',
      payload: { ...activeFilterData,
        [key]: value
      }
    });
  };

  const handleTextChange = (e, key) => {
    const value = e.target.value;
    dispatch({
      type: 'SET_ACTIVE_FILTER_DATA',
      payload: { ...activeFilterData,
        [key]: value
      }
    });
  };

  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, show_title && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_Field_Checkbox__WEBPACK_IMPORTED_MODULE_2__["default"], {
    id: 'enable_accordion',
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Enable Accordion', 'wc-ajax-product-filter'),
    description: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Place more filters by collapsing the filter options.', 'wc-ajax-product-filter'),
    isChecked: enable_accordion,
    onChange: value => handleCheckboxChange('enable_accordion', value)
  }), enable_accordion && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_Field_Radio__WEBPACK_IMPORTED_MODULE_3__["default"], {
    id: 'accordion_default_state',
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Accordion default state', 'wc-ajax-product-filter'),
    description: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Determines how the accordion should appear initially.', 'wc-ajax-product-filter'),
    value: accordion_default_state,
    onChange: e => handleRadioChange(e, 'accordion_default_state'),
    options: [{
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Expanded', 'wc-ajax-product-filter'),
      value: 'expanded'
    }, {
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Collapsed', 'wc-ajax-product-filter'),
      value: 'collapsed'
    }]
  })), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_Field_Checkbox__WEBPACK_IMPORTED_MODULE_2__["default"], {
    id: 'show_clear_button',
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Enable clear filter', 'wc-ajax-product-filter'),
    description: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Show a button to clear the filter items.', 'wc-ajax-product-filter'),
    isChecked: show_clear_button,
    onChange: value => handleCheckboxChange('show_clear_button', value)
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_Field_Checkbox__WEBPACK_IMPORTED_MODULE_2__["default"], {
    id: 'enable_soft_limit',
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Soft Limit', 'wc-ajax-product-filter'),
    description: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Hide the long list of options with a `Show More/Show Less` toggle.', 'wc-ajax-product-filter'),
    isChecked: enable_soft_limit,
    onChange: value => handleCheckboxChange('enable_soft_limit', value),
    isPro: true
  }), enable_soft_limit && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_Field_Text__WEBPACK_IMPORTED_MODULE_4__["default"], {
    id: 'soft_limit',
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Number of visible options', 'wc-ajax-product-filter	'),
    description: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Show the toggle after this many options.', 'wc-ajax-product-filter	'),
    value: soft_limit,
    onChange: e => handleTextChange(e, 'soft_limit'),
    type: 'number',
    min: 1
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_Field_Checkbox__WEBPACK_IMPORTED_MODULE_2__["default"], {
    id: 'use_term_slug_in_url',
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Term slug in URL', 'wc-ajax-product-filter'),
    description: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Use term slug instead of id in the URL.', 'wc-ajax-product-filter'),
    isChecked: use_term_slug_in_url,
    onChange: value => handleCheckboxChange('use_term_slug_in_url', value),
    isPro: true
  }));
};

/* harmony default export */ __webpack_exports__["default"] = (Advanced);

/***/ }),

/***/ "./src/components/Filter/FilterNav/FilterUI/Appearance.js":
/*!****************************************************************!*\
  !*** ./src/components/Filter/FilterNav/FilterUI/Appearance.js ***!
  \****************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _Field_Checkbox__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../Field/Checkbox */ "./src/components/Field/Checkbox.js");
/* harmony import */ var _Field_Radio__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../Field/Radio */ "./src/components/Field/Radio.js");
/* harmony import */ var _Field_Text__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../Field/Text */ "./src/components/Field/Text.js");
/* harmony import */ var _DisplayTypeField__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./DisplayTypeField */ "./src/components/Filter/FilterNav/FilterUI/DisplayTypeField.js");
/* harmony import */ var _FilterContext__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../FilterContext */ "./src/components/Filter/FilterContext.js");
/* harmony import */ var _TooltipPosition__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./TooltipPosition */ "./src/components/Filter/FilterNav/FilterUI/TooltipPosition.js");









const Layout = () => {
  const {
    state: {
      activeFilterData
    },
    dispatch
  } = (0,_FilterContext__WEBPACK_IMPORTED_MODULE_6__.useFilter)();
  const {
    show_title,
    display_type,
    query_type,
    all_items_label,
    use_chosen,
    chosen_no_results_message,
    enable_multiple_filter,
    show_count,
    hide_empty,
    enable_tooltip,
    show_count_in_tooltip
  } = activeFilterData;

  const handleCheckboxChange = (key, value) => {
    const _value = value ? '1' : '';

    dispatch({
      type: 'SET_ACTIVE_FILTER_DATA',
      payload: { ...activeFilterData,
        [key]: _value
      }
    });
  };

  const handleRadioChange = (e, key) => {
    const value = e.target.value;
    dispatch({
      type: 'SET_ACTIVE_FILTER_DATA',
      payload: { ...activeFilterData,
        [key]: value
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

  const enableMultipleFilterField = () => {
    let showField = false;

    if ('label' === display_type || 'color' === display_type || 'image' === display_type) {
      showField = true;
    }

    if (showField) {
      return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_Field_Checkbox__WEBPACK_IMPORTED_MODULE_2__["default"], {
        id: 'enable_multiple_filter',
        label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Multiple Selection', 'wc-ajax-product-filter'),
        description: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Determines if the user can select multiple options when filtering products.', 'wc-ajax-product-filter'),
        isChecked: enable_multiple_filter,
        onChange: value => handleCheckboxChange('enable_multiple_filter', value)
      });
    }
  };

  const queryTypeField = () => {
    let showField = false;

    if ('checkbox' === display_type || 'multi-select' === display_type) {
      showField = true;
    } else if (('label' === display_type || 'color' === display_type || 'image' === display_type) && '1' === enable_multiple_filter) {
      showField = true;
    }

    if (showField) {
      return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_Field_Radio__WEBPACK_IMPORTED_MODULE_3__["default"], {
        id: 'query_type',
        label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Query Type', 'wc-ajax-product-filter'),
        description: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('AND: products that have both options, OR: products that matched any option.', 'wc-ajax-product-filter'),
        options: [{
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('AND', 'wc-ajax-product-filter'),
          value: 'and'
        }, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('OR', 'wc-ajax-product-filter'),
          value: 'or'
        }],
        onChange: e => handleRadioChange(e, 'query_type'),
        value: query_type
      });
    }
  };

  const allItemsLabelField = () => {
    let showField = false;

    if ('radio' === display_type || 'select' === display_type) {
      showField = true;
    }

    if (showField) {
      return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_Field_Text__WEBPACK_IMPORTED_MODULE_4__["default"], {
        id: 'all_items_label',
        label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('All Items Label', 'wc-ajax-product-filter'),
        description: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Change the default option label.', 'wc-ajax-product-filter'),
        value: all_items_label,
        onChange: e => handleTextFieldChange(e, 'all_items_label')
      });
    }
  };

  const useChosenField = () => {
    let showField = false;

    if ('select' === display_type || 'multi-select' === display_type) {
      showField = true;
    }

    if (showField) {
      return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_Field_Checkbox__WEBPACK_IMPORTED_MODULE_2__["default"], {
        id: 'use_chosen',
        label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Enable Combobox', 'wc-ajax-product-filter'),
        description: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Whether to use jQuery Chosen library instead of the native select element.', 'wc-ajax-product-filter'),
        isChecked: use_chosen,
        onChange: value => handleCheckboxChange('use_chosen', value)
      });
    }
  };

  const allItemsLabelFieldForUseChosen = () => {
    let showField = false;

    if ('multi-select' === display_type && '1' === use_chosen) {
      showField = true;
    }

    if (showField) {
      return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_Field_Text__WEBPACK_IMPORTED_MODULE_4__["default"], {
        id: 'all_items_label',
        label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('All Items Label', 'wc-ajax-product-filter'),
        description: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Change the default option label.', 'wc-ajax-product-filter'),
        value: all_items_label,
        onChange: e => handleTextFieldChange(e, 'all_items_label')
      });
    }
  };

  const noResultsMessageField = () => {
    let showField = false;

    if (('select' === display_type || 'multi-select' === display_type) && use_chosen) {
      showField = true;
    }

    if (showField) {
      return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_Field_Text__WEBPACK_IMPORTED_MODULE_4__["default"], {
        id: 'chosen_no_results_message',
        label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('No Matches Message', 'wc-ajax-product-filter'),
        description: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('This message is usually displayed when no options match the search term. Leave blank to show the default message.', 'wc-ajax-product-filter'),
        value: chosen_no_results_message,
        onChange: e => handleTextFieldChange(e, 'chosen_no_results_message')
      });
    }
  };

  const enableTooltipField = () => {
    let showField = false;

    if ('color' === display_type || 'image' === display_type) {
      showField = true;
    }

    if (showField) {
      return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_Field_Checkbox__WEBPACK_IMPORTED_MODULE_2__["default"], {
        id: 'enable_tooltip',
        label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Enable Tooltip', 'wc-ajax-product-filter'),
        description: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Display additional information in a tooltip when users hover over the option.', 'wc-ajax-product-filter'),
        isChecked: enable_tooltip,
        onChange: value => handleCheckboxChange('enable_tooltip', value)
      });
    }
  };

  const tooltipPositionField = () => {
    let showField = false;

    if (('color' === display_type || 'image' === display_type) && enable_tooltip) {
      showField = true;
    }

    if (showField) {
      return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_TooltipPosition__WEBPACK_IMPORTED_MODULE_7__["default"], null);
    }
  };

  const showCountInTooltipField = () => {
    let showField = false;

    if (('color' === display_type || 'image' === display_type) && enable_tooltip) {
      showField = true;
    }

    if (showField) {
      return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_Field_Checkbox__WEBPACK_IMPORTED_MODULE_2__["default"], {
        id: 'show_count_in_tooltip',
        label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Count in tooltip', 'wc-ajax-product-filter'),
        description: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Whether to show the product count in tooltip.', 'wc-ajax-product-filter'),
        isChecked: show_count_in_tooltip,
        onChange: value => handleCheckboxChange('show_count_in_tooltip', value)
      });
    }
  };

  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_Field_Checkbox__WEBPACK_IMPORTED_MODULE_2__["default"], {
    id: 'show_title',
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Show Title', 'wc-ajax-product-filter'),
    isChecked: show_title,
    onChange: value => handleCheckboxChange('show_title', value),
    description: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Whether to show the filter title before the options.', 'wc-ajax-product-filter')
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_DisplayTypeField__WEBPACK_IMPORTED_MODULE_5__["default"], null), enableMultipleFilterField(), queryTypeField(), allItemsLabelField(), useChosenField(), allItemsLabelFieldForUseChosen(), noResultsMessageField(), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_Field_Checkbox__WEBPACK_IMPORTED_MODULE_2__["default"], {
    id: 'show_count',
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Show Count', 'wc-ajax-product-filter'),
    description: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Whether to show the product count in options.', 'wc-ajax-product-filter'),
    isChecked: show_count,
    onChange: value => handleCheckboxChange('show_count', value)
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_Field_Checkbox__WEBPACK_IMPORTED_MODULE_2__["default"], {
    id: 'hide_empty',
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Remove Empty', 'wc-ajax-product-filter'),
    description: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Whether to remove the options that show empty results.', 'wc-ajax-product-filter'),
    isChecked: hide_empty,
    onChange: value => handleCheckboxChange('hide_empty', value)
  }), enableTooltipField(), tooltipPositionField(), showCountInTooltipField());
};

/* harmony default export */ __webpack_exports__["default"] = (Layout);

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
/* harmony import */ var _FilterContext__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../FilterContext */ "./src/components/Filter/FilterContext.js");
/* harmony import */ var _AvailableFilters__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../AvailableFilters */ "./src/components/AvailableFilters.js");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../utils */ "./src/components/Filter/utils.js");





const AvaialableFilters = () => {
  const {
    state: {
      filterType,
      filtersData,
      activeFilterData
    },
    dispatch
  } = (0,_FilterContext__WEBPACK_IMPORTED_MODULE_1__.useFilter)();

  const handleSetFilterType = filter => {
    const _filterType = filter.type;

    if (_filterType === filterType) {
      return;
    }

    dispatch({
      type: 'SET_FILTER_TYPE',
      payload: _filterType
    });
    dispatch({
      type: 'SET_DIRTY'
    });
    let filterData = filtersData[_filterType];

    if (!filterData) {
      filterData = (0,_utils__WEBPACK_IMPORTED_MODULE_3__.getFilterDefaultData)(_filterType);
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

  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_AvailableFilters__WEBPACK_IMPORTED_MODULE_2__["default"], {
    filterType: filterType,
    handleSetFilterType: handleSetFilterType
  });
};

/* harmony default export */ __webpack_exports__["default"] = (AvaialableFilters);

/***/ }),

/***/ "./src/components/Filter/FilterNav/FilterUI/DisplayTypeField.js":
/*!**********************************************************************!*\
  !*** ./src/components/Filter/FilterNav/FilterUI/DisplayTypeField.js ***!
  \**********************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! classnames */ "./node_modules/classnames/index.js");
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(classnames__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../utils */ "./src/components/utils.js");
/* harmony import */ var _FilterContext__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../FilterContext */ "./src/components/Filter/FilterContext.js");






const DisplayTypeField = () => {
  const {
    state: {
      activeFilterData
    },
    dispatch
  } = (0,_FilterContext__WEBPACK_IMPORTED_MODULE_4__.useFilter)();
  const {
    display_type
  } = activeFilterData;
  const id = 'display_type';

  const label = (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Display Type', 'wc-ajax-product-filter');

  const description = (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Determines how the filter will be shown on the frontend.', 'wc-ajax-product-filter');

  const firstSegment = [{
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Checkbox', 'wc-ajax-product-filter'),
    value: 'checkbox'
  }, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Radio', 'wc-ajax-product-filter'),
    value: 'radio'
  }, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Select', 'wc-ajax-product-filter'),
    value: 'select'
  }, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Multi select', 'wc-ajax-product-filter'),
    value: 'multi-select'
  }];
  const secondSegment = [{
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Label', 'wc-ajax-product-filter'),
    value: 'label'
  }, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Color', 'wc-ajax-product-filter'),
    value: 'color',
    isPro: true
  }, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Image', 'wc-ajax-product-filter'),
    value: 'image',
    isPro: true
  }];

  const handleDisplayTypeChange = e => {
    const value = e.target.value;
    dispatch({
      type: 'SET_ACTIVE_FILTER_DATA',
      payload: { ...activeFilterData,
        display_type: value
      }
    });
  };

  const renderOptions = options => {
    return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, options.map(option => (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      key: option.value,
      className: classnames__WEBPACK_IMPORTED_MODULE_2___default()('components-radio-control__option')
    }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("input", {
      id: option.value,
      className: "components-radio-control__input",
      type: "radio",
      name: id,
      value: option.value,
      onChange: handleDisplayTypeChange,
      checked: option.value === display_type
    }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("label", {
      htmlFor: option.value
    }, option.label, (0,_utils__WEBPACK_IMPORTED_MODULE_3__.proTag)(option.isPro)))));
  };

  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "__form_control display-type"
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
    className: "__row1"
  }, renderOptions(firstSegment)), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "__row2"
  }, renderOptions(secondSegment))))), description ? (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("p", {
    className: "description"
  }, description) : '');
};

/* harmony default export */ __webpack_exports__["default"] = (DisplayTypeField);

/***/ }),

/***/ "./src/components/Filter/FilterNav/FilterUI/General.js":
/*!*************************************************************!*\
  !*** ./src/components/Filter/FilterNav/FilterUI/General.js ***!
  \*************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _FilterContext__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../FilterContext */ "./src/components/Filter/FilterContext.js");
/* harmony import */ var _AvailableFilters__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./AvailableFilters */ "./src/components/Filter/FilterNav/FilterUI/AvailableFilters.js");
/* harmony import */ var _GeneralFields__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./GeneralFields */ "./src/components/Filter/FilterNav/FilterUI/GeneralFields.js");





const Basic = () => {
  const {
    state: {
      filterType,
      activeFilterData,
      filterKeys,
      additionalData
    },
    dispatch
  } = (0,_FilterContext__WEBPACK_IMPORTED_MODULE_1__.useFilter)();
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_AvailableFilters__WEBPACK_IMPORTED_MODULE_2__["default"], null), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_GeneralFields__WEBPACK_IMPORTED_MODULE_3__["default"], {
    filterType: filterType,
    activeFilterData: activeFilterData,
    filterKeys: filterKeys,
    additionalData: additionalData,
    dispatch: dispatch
  }));
};

/* harmony default export */ __webpack_exports__["default"] = (Basic);

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
/* harmony import */ var _Field_Text__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../Field/Text */ "./src/components/Field/Text.js");
/* harmony import */ var _Field_Listbox__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../Field/Listbox */ "./src/components/Field/Listbox.js");





const GeneralFields = _ref => {
  var _activeFilterData$fie;

  let {
    filterType,
    activeFilterData,
    filterKeys,
    additionalData,
    dispatch
  } = _ref;
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
      let data = {};
      let options = [];

      if ('custom-taxonomy' === filterType) {
        taxonomyFieldLabel = (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Taxonomy', 'wc-ajax-product-filter');
        data = additionalData['custom_taxonomies'];
      } else {
        taxonomyFieldLabel = (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Attribute', 'wc-ajax-product-filter');
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
        id: 'post_property',
        options: options,
        value: postProperty,
        onChange: handlePostPropertyChange,
        searchable: false
      });
    }
  };

  const handleFilterKeyChange = e => {
    const _filterKey = e.target.value;
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
      return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_Field_Text__WEBPACK_IMPORTED_MODULE_2__["default"], {
        id: 'filter_key',
        label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Filter Key', 'wc-ajax-product-filter'),
        description: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('The unique key that will be used to identify the filter.', 'wc-ajax-product-filter'),
        value: filterKey,
        onChange: handleFilterKeyChange
      });
    }
  };

  let output = '';

  if (filterType) {
    output = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, taxonomyField(), postMetaField(), postPropertyField(), filterKeyField());
  }

  return output;
};

/* harmony default export */ __webpack_exports__["default"] = (GeneralFields);

/***/ }),

/***/ "./src/components/Filter/FilterNav/FilterUI/LimitFields/index.js":
/*!***********************************************************************!*\
  !*** ./src/components/Filter/FilterNav/FilterUI/LimitFields/index.js ***!
  \***********************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _FilterContext__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../FilterContext */ "./src/components/Filter/FilterContext.js");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../utils */ "./src/components/Filter/utils.js");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../../../utils */ "./src/components/utils.js");







const LimitBy = () => {
  const {
    state: {
      activeFilterData
    },
    dispatch
  } = (0,_FilterContext__WEBPACK_IMPORTED_MODULE_3__.useFilter)();
  const {
    limit_options
  } = activeFilterData;
  const id = 'limit_options';

  const label = (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Limit Options', 'wc-ajax-product-filter');

  const description = (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Limit the filter options.', 'wc-ajax-product-filter');

  const options = (0,_utils__WEBPACK_IMPORTED_MODULE_4__.getTaxonomyLimitByOptions)();
  const isPro = true;

  const handleChange = value => {
    if (value === limit_options) {
      return;
    }

    dispatch({
      type: 'SET_ACTIVE_FILTER_DATA',
      payload: { ...activeFilterData,
        [id]: value
      }
    });
  };

  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "__form_control"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "__inner"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "__label"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("label", {
    htmlFor: id
  }, label, (0,_utils__WEBPACK_IMPORTED_MODULE_5__.proTag)(isPro))), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "__wrapper"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "__input_wrapper"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.ButtonGroup, null, options.map(option => (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Button, {
    value: option.value,
    key: `${id}-${option.value}`,
    onClick: () => handleChange(option.value),
    variant: limit_options === option.value ? 'primary' : ''
  }, option.label)))))), description ? (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("p", {
    className: "description"
  }, description) : '');
};

/* harmony default export */ __webpack_exports__["default"] = (LimitBy);

/***/ }),

/***/ "./src/components/Filter/FilterNav/FilterUI/Options.js":
/*!*************************************************************!*\
  !*** ./src/components/Filter/FilterNav/FilterUI/Options.js ***!
  \*************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _Field_Radio__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../Field/Radio */ "./src/components/Field/Radio.js");
/* harmony import */ var _Field_Select__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../Field/Select */ "./src/components/Field/Select.js");
/* harmony import */ var _FilterContext__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../FilterContext */ "./src/components/Filter/FilterContext.js");
/* harmony import */ var _OptionsTable__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./OptionsTable */ "./src/components/Filter/FilterNav/FilterUI/OptionsTable.js");
/* harmony import */ var _OptionsTableModal__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./OptionsTableModal */ "./src/components/Filter/FilterNav/FilterUI/OptionsTableModal.js");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../utils */ "./src/components/Filter/utils.js");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_8___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_8__);
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! axios */ "./node_modules/axios/index.js");
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_9___default = /*#__PURE__*/__webpack_require__.n(axios__WEBPACK_IMPORTED_MODULE_9__);
/* harmony import */ var _wordpress_notices__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @wordpress/notices */ "@wordpress/notices");
/* harmony import */ var _wordpress_notices__WEBPACK_IMPORTED_MODULE_10___default = /*#__PURE__*/__webpack_require__.n(_wordpress_notices__WEBPACK_IMPORTED_MODULE_10__);
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @wordpress/data */ "@wordpress/data");
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_11___default = /*#__PURE__*/__webpack_require__.n(_wordpress_data__WEBPACK_IMPORTED_MODULE_11__);
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! lodash */ "lodash");
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_12___default = /*#__PURE__*/__webpack_require__.n(lodash__WEBPACK_IMPORTED_MODULE_12__);
/* harmony import */ var _LimitFields__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./LimitFields */ "./src/components/Filter/FilterNav/FilterUI/LimitFields/index.js");
















const Options = () => {
  const {
    state: {
      activeFilterData,
      isFilterOptionsLoading
    },
    dispatch
  } = (0,_FilterContext__WEBPACK_IMPORTED_MODULE_4__.useFilter)();
  const [isOpen, setOpen] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(false);
  const {
    get_options,
    limit_options,
    parent_term,
    limit_values_by_id,
    exclude_values_id,
    order_terms_by,
    order_terms_dir
  } = activeFilterData;
  const {
    createErrorNotice
  } = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_11__.useDispatch)(_wordpress_notices__WEBPACK_IMPORTED_MODULE_10__.store);
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    const data = {
      action: 'get_taxonomy_filter_options',
      taxonomy: 'pa_color'
    };
    axios__WEBPACK_IMPORTED_MODULE_9___default().get(wcapf_admin_params.ajaxurl, {
      params: data
    }).then(res => {
      const data = res.data.data;
      dispatch({
        type: 'SET_FILTERS_OPTIONS_LOADING',
        payload: false
      });
      dispatch({
        type: 'SET_FILTERS_MODAL_OPTIONS',
        payload: data
      });
    }).catch(err => {
      console.log(err);
      dispatch({
        type: 'SET_FILTERS_OPTIONS_LOADING',
        payload: false
      });
      createErrorNotice((0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('There was an error fetching the filter options', 'wc-ajax-product-filter'), {
        type: 'snackbar',
        icon: '🔥'
      });
    });
  }, []);

  const openModal = () => setOpen(true);

  const closeModal = () => setOpen(false);

  const handleRadioChange = (e, key) => {
    const value = e.target.value;
    dispatch({
      type: 'SET_ACTIVE_FILTER_DATA',
      payload: { ...activeFilterData,
        [key]: value
      }
    });
  };

  const handleSelectChange = (values, key) => {
    if ((0,lodash__WEBPACK_IMPORTED_MODULE_12__.isEmpty)(values)) {
      dispatch({
        type: 'SET_ACTIVE_FILTER_DATA',
        payload: { ...activeFilterData,
          [key]: ''
        }
      });
    } else {
      const {
        value
      } = values[0];
      dispatch({
        type: 'SET_ACTIVE_FILTER_DATA',
        payload: { ...activeFilterData,
          [key]: value
        }
      });
    }
  };

  const getOptionsField = () => {
    return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_Field_Radio__WEBPACK_IMPORTED_MODULE_2__["default"], {
      id: 'get_options',
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Get Options', 'wc-ajax-product-filter'),
      value: get_options,
      onChange: e => handleRadioChange(e, 'get_options'),
      options: [{
        label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Automatically', 'wc-ajax-product-filter'),
        value: 'automatically'
      }, {
        label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Manual Entry', 'wc-ajax-product-filter'),
        value: 'manual_entry',
        isPro: true
      }],
      description: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Whether to get the options automatically or you want to add the options manually.')
    });
  };

  const orderByField = () => {
    const options = (0,_utils__WEBPACK_IMPORTED_MODULE_7__.getOrderByOptions)();

    const _value = (0,lodash__WEBPACK_IMPORTED_MODULE_12__.find)(options, {
      value: order_terms_by
    });

    const value = _value ? [_value] : [];
    return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_Field_Select__WEBPACK_IMPORTED_MODULE_3__["default"], {
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Order By', 'wc-ajax-product-filter'),
      id: 'order_terms_by',
      options: options,
      values: value,
      onChange: values => handleSelectChange(values, 'order_terms_by'),
      placeholder: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Default', 'wc-ajax-product-filter'),
      searchable: false,
      description: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Field to order options by.', 'wc-ajax-product-filter')
    });
  };

  const orderDirectionField = () => {
    if (order_terms_by) {
      return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_Field_Radio__WEBPACK_IMPORTED_MODULE_2__["default"], {
        id: 'order_terms_dir',
        label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Order Direction', 'wc-ajax-product-filter'),
        value: order_terms_dir,
        onChange: e => handleRadioChange(e, 'order_terms_dir'),
        options: (0,_utils__WEBPACK_IMPORTED_MODULE_7__.getOrderDirectionOptions)(),
        description: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Whether to order options in ascending or descending order.', 'wc-ajax-product-filter')
      });
    }
  };

  const limitOptionsField = () => {
    if ('automatically' === get_options) {
      return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_LimitFields__WEBPACK_IMPORTED_MODULE_13__["default"], null);
    }
  };

  const parentTermField = () => {
    const options = [];
    const value = [];

    if ('automatically' === get_options && 'child' === limit_options) {
      return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_Field_Select__WEBPACK_IMPORTED_MODULE_3__["default"], {
        label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Parent Term', 'wc-ajax-product-filter'),
        id: 'parent_term',
        options: options,
        values: value,
        onChange: values => handleSelectChange(values, 'parent_term'),
        description: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Only show the child terms of a parent term.', 'wc-ajax-product-filter')
      });
    }
  };

  const includeTermsField = () => {
    const options = [];
    const value = [];

    if ('automatically' === get_options && 'include' === limit_options) {
      return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_Field_Select__WEBPACK_IMPORTED_MODULE_3__["default"], {
        label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Terms to include', 'wc-ajax-product-filter'),
        id: 'limit_values_by_id',
        options: options,
        values: value,
        onChange: values => handleSelectChange(values, 'limit_values_by_id'),
        description: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Select the terms that will be available to filter by.', 'wc-ajax-product-filter')
      });
    }
  };

  const excludeTermsField = () => {
    const options = [];
    const value = [];

    if ('automatically' === get_options && 'exclude' === limit_options) {
      return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_Field_Select__WEBPACK_IMPORTED_MODULE_3__["default"], {
        label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Terms to exclude', 'wc-ajax-product-filter'),
        id: 'exclude_values_id',
        options: options,
        values: value,
        onChange: values => handleSelectChange(values, 'exclude_values_id'),
        description: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Select the terms that will be excluded.', 'wc-ajax-product-filter')
      });
    }
  };

  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", null, getOptionsField(), orderByField(), orderDirectionField(), limitOptionsField(), parentTermField(), includeTermsField(), excludeTermsField(), isFilterOptionsLoading ? (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_8__.Spinner, null) : (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_OptionsTable__WEBPACK_IMPORTED_MODULE_5__["default"], {
    openModal: openModal
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_OptionsTableModal__WEBPACK_IMPORTED_MODULE_6__["default"], {
    isOpen: isOpen,
    closeModal: closeModal
  })));
};

/* harmony default export */ __webpack_exports__["default"] = (Options);

/***/ }),

/***/ "./src/components/Filter/FilterNav/FilterUI/OptionsTable.js":
/*!******************************************************************!*\
  !*** ./src/components/Filter/FilterNav/FilterUI/OptionsTable.js ***!
  \******************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _FilterContext__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../FilterContext */ "./src/components/Filter/FilterContext.js");
/* harmony import */ var react_sortablejs__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! react-sortablejs */ "./node_modules/react-sortablejs/dist/index.js");
/* harmony import */ var react_sortablejs__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(react_sortablejs__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _wordpress_icons__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @wordpress/icons */ "./node_modules/@wordpress/icons/build-module/library/drag-handle.js");
/* harmony import */ var _wordpress_icons__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @wordpress/icons */ "./node_modules/@wordpress/icons/build-module/library/cancel-circle-filled.js");
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! lodash */ "lodash");
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(lodash__WEBPACK_IMPORTED_MODULE_5__);









const OptionsTable = _ref => {
  let {
    openModal
  } = _ref;
  const {
    state: {
      activeFilterData: {
        get_options,
        display_type
      },
      filterOptions
    },
    dispatch
  } = (0,_FilterContext__WEBPACK_IMPORTED_MODULE_3__.useFilter)();
  const [rows, setRows] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(filterOptions);
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    setRows(filterOptions);
  }, [filterOptions]);

  const handleSort = () => {
    dispatch({
      type: 'SET_FILTERS_OPTIONS',
      payload: rows
    });
  };

  const handleRemoveAll = () => {
    dispatch({
      type: 'SET_FILTERS_OPTIONS',
      payload: []
    });
  };

  const handleRemove = row => {
    const _filterOptions = filterOptions.filter(option => option.term_id !== row.term_id);

    dispatch({
      type: 'SET_FILTERS_OPTIONS',
      payload: _filterOptions
    });
  };

  const handleLabelChange = () => {};

  const table = () => {
    return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("table", {
      className: "wp-list-table widefat fixed striped"
    }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("thead", null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("tr", null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("th", {
      className: "__drag_handle"
    }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("th", {
      className: "__option"
    }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Value', 'wc-ajax-product-filter')), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("th", {
      className: "__label"
    }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Label', 'wc-ajax-product-filter')), 'color' === display_type ? (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("th", {
      className: "__color"
    }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Color', 'wc-ajax-product-filter')) : null, 'image' === display_type ? (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("th", {
      className: "__image"
    }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Image', 'wc-ajax-product-filter')) : null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("th", {
      className: "__action"
    }))), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(react_sortablejs__WEBPACK_IMPORTED_MODULE_4__.ReactSortable, {
      list: rows,
      setList: setRows,
      tag: 'tbody',
      direction: 'vertical',
      handle: ".__drag_handler",
      onSort: handleSort
    }, rows.map((row, rowIndex) => {
      const {
        term_id,
        slug,
        color,
        image
      } = row;
      const label = row.label ? row.label : row.name;
      return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("tr", {
        key: `filter-option-${rowIndex}`
      }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("td", null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.Icon, {
        icon: _wordpress_icons__WEBPACK_IMPORTED_MODULE_6__["default"],
        className: "__drag_handler"
      }))), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("td", null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
        className: "__option_value"
      }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
        className: "slug"
      }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Slug', 'wc-ajax-product-filter'), ":", ` `, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", null, slug)), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
        className: "id"
      }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('ID', 'wc-ajax-product-filter'), ":", ` `, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", null, term_id)))), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("td", null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("input", {
        type: "text",
        value: label,
        className: "components-text-control__input",
        onChange: handleLabelChange
      }))), 'color' === display_type ? (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("td", null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", null, color)) : null, 'image' === display_type ? (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("td", null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", null, image)) : null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("td", null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("button", {
        className: "button-link button-link-delete",
        onClick: () => handleRemove(row)
      }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.Icon, {
        icon: _wordpress_icons__WEBPACK_IMPORTED_MODULE_7__["default"],
        size: 20
      })))));
    })));
  };

  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, 'manual_entry' === get_options && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "__options_table"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "__form_control"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "__inner"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "__label"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("label", null, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Filter Options', 'wc-ajax-product-filter'))), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "__wrapper"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "__input_wrapper"
  }))), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("p", {
    className: "description"
  }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Add the options that will be available to the filter.', 'wc-ajax-product-filter'))), !(0,lodash__WEBPACK_IMPORTED_MODULE_5__.isEmpty)(rows) && table(), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "__button_group"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.Button, {
    variant: "secondary",
    onClick: openModal
  }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Browse Options', 'wc-ajax-product-filter')), !(0,lodash__WEBPACK_IMPORTED_MODULE_5__.isEmpty)(rows) && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, ` `, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.Button, {
    variant: "tertiary",
    isDestructive: true,
    onClick: handleRemoveAll
  }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Remove All', 'wc-ajax-product-filter'))))));
};

/* harmony default export */ __webpack_exports__["default"] = (OptionsTable);

/***/ }),

/***/ "./src/components/Filter/FilterNav/FilterUI/OptionsTableModal.js":
/*!***********************************************************************!*\
  !*** ./src/components/Filter/FilterNav/FilterUI/OptionsTableModal.js ***!
  \***********************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _FilterContext__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../FilterContext */ "./src/components/Filter/FilterContext.js");
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! lodash */ "lodash");
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(lodash__WEBPACK_IMPORTED_MODULE_4__);







const OptionsTableModal = _ref => {
  let {
    isOpen,
    closeModal
  } = _ref;
  const {
    state: {
      filterOptions,
      filterModalOptions
    },
    dispatch
  } = (0,_FilterContext__WEBPACK_IMPORTED_MODULE_3__.useFilter)();
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    if (!isOpen) {
      return;
    }

    const _filterModalOptions = filterModalOptions.map(option => {
      const found = (0,lodash__WEBPACK_IMPORTED_MODULE_4__.find)(filterOptions, {
        term_id: option.term_id
      });

      if (found) {
        option['status'] = 'added';
      } else {
        option['status'] = '';
      }

      return option;
    });

    dispatch({
      type: 'SET_FILTERS_MODAL_OPTIONS',
      payload: _filterModalOptions
    });
  }, [isOpen]);

  const handleSelectAll = () => {
    const _filterModalOptions = filterModalOptions.map(option => {
      option['status'] = 'added';
      return option;
    });

    dispatch({
      type: 'SET_FILTERS_MODAL_OPTIONS',
      payload: _filterModalOptions
    });
  };

  const handleClearSelection = () => {
    const _filterModalOptions = filterModalOptions.map(option => {
      option['status'] = '';
      return option;
    });

    dispatch({
      type: 'SET_FILTERS_MODAL_OPTIONS',
      payload: _filterModalOptions
    });
  };

  const handleUpdateFilterOptions = () => {
    let _filterOptions = [...filterOptions];
    const removeIds = [];
    (0,lodash__WEBPACK_IMPORTED_MODULE_4__.each)(filterModalOptions, option => {
      if ('added' === option.status) {
        if (!(0,lodash__WEBPACK_IMPORTED_MODULE_4__.find)(_filterOptions, {
          term_id: option.term_id
        })) {
          _filterOptions.push(option);
        }
      } else {
        if ((0,lodash__WEBPACK_IMPORTED_MODULE_4__.find)(_filterOptions, {
          term_id: option.term_id
        })) {
          removeIds.push(option.term_id);
        }
      }
    });

    if (removeIds.length) {
      _filterOptions = _filterOptions.filter(option => !removeIds.includes(option.term_id));
    }

    dispatch({
      type: 'SET_FILTERS_OPTIONS',
      payload: _filterOptions
    });
    closeModal();
  };

  const handleOptionChange = (value, option) => {
    const _filterModalOptions = filterModalOptions.map(_option => {
      if (option.term_id === _option.term_id) {
        _option['status'] = value ? 'added' : '';
      }

      return _option;
    });

    dispatch({
      type: 'SET_FILTERS_MODAL_OPTIONS',
      payload: _filterModalOptions
    });
  };

  const modalOptions = () => {
    return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: "__options"
    }, filterModalOptions.map((option, index) => {
      return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.CheckboxControl, {
        key: `modal-option-${index}`,
        label: option.name,
        checked: 'added' === option.status,
        onChange: value => handleOptionChange(value, option)
      });
    }));
  };

  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, isOpen && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.Modal, {
    title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Add Filter Options', 'wc-ajax-product-filter'),
    onRequestClose: closeModal,
    className: "__options_table_modal"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("p", {
    className: "description"
  }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Found the following options for', 'wc-ajax-product-filter'), ` `, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("b", null, "product category"), "."), modalOptions(), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.Flex, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.FlexItem, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.Flex, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.Button, {
    variant: "secondary",
    onClick: handleSelectAll
  }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Select All', 'wc-ajax-product-filter')), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.Button, {
    variant: "secondary",
    onClick: handleClearSelection
  }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Clear Selection', 'wc-ajax-product-filter')))), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.FlexItem, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.Flex, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.Button, {
    variant: "primary",
    onClick: handleUpdateFilterOptions
  }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Update', 'wc-ajax-product-filter')))))));
};

/* harmony default export */ __webpack_exports__["default"] = (OptionsTableModal);

/***/ }),

/***/ "./src/components/Filter/FilterNav/FilterUI/TooltipPosition.js":
/*!*********************************************************************!*\
  !*** ./src/components/Filter/FilterNav/FilterUI/TooltipPosition.js ***!
  \*********************************************************************/
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
/* harmony import */ var _FilterContext__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../FilterContext */ "./src/components/Filter/FilterContext.js");






const TooltipPosition = () => {
  const {
    state: {
      activeFilterData
    },
    dispatch
  } = (0,_FilterContext__WEBPACK_IMPORTED_MODULE_4__.useFilter)();
  const {
    tooltip_position
  } = activeFilterData;
  const id = 'tooltip_position';

  const label = (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Tooltip Position', 'wc-ajax-product-filter');

  const description = (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Determines on which side the tooltip will be placed.', 'wc-ajax-product-filter');

  const options = (0,_utils__WEBPACK_IMPORTED_MODULE_3__.getTooltipPositionOptions)();

  const handleChange = value => {
    if (value === tooltip_position) {
      return;
    }

    dispatch({
      type: 'SET_ACTIVE_FILTER_DATA',
      payload: { ...activeFilterData,
        [id]: value
      }
    });
  };

  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "__form_control"
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
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.ButtonGroup, null, options.map(option => (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Button, {
    value: option.value,
    key: `${id}-${option.value}`,
    onClick: () => handleChange(option.value),
    variant: tooltip_position === option.value ? 'primary' : ''
  }, option.label)))))), description ? (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("p", {
    className: "description"
  }, description) : '');
};

/* harmony default export */ __webpack_exports__["default"] = (TooltipPosition);

/***/ }),

/***/ "./src/components/Filter/FilterNav/FilterUI/index.js":
/*!***********************************************************!*\
  !*** ./src/components/Filter/FilterNav/FilterUI/index.js ***!
  \***********************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _CustomTabPanel__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../CustomTabPanel */ "./src/components/CustomTabPanel.js");
/* harmony import */ var _FilterContext__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../FilterContext */ "./src/components/Filter/FilterContext.js");
/* harmony import */ var _Advanced__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./Advanced */ "./src/components/Filter/FilterNav/FilterUI/Advanced.js");
/* harmony import */ var _General__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./General */ "./src/components/Filter/FilterNav/FilterUI/General.js");
/* harmony import */ var _Appearance__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./Appearance */ "./src/components/Filter/FilterNav/FilterUI/Appearance.js");
/* harmony import */ var _Options__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./Options */ "./src/components/Filter/FilterNav/FilterUI/Options.js");









const FilterUI = () => {
  const {
    state: {
      activeUIStep,
      filterType
    },
    dispatch
  } = (0,_FilterContext__WEBPACK_IMPORTED_MODULE_3__.useFilter)();

  const handleSelect = tabName => {
    if (activeUIStep !== tabName) {
      dispatch({
        type: 'SET_ACTIVE_UI_STEP',
        payload: tabName
      });
    }
  };

  let initialTabName = 'general';

  if (activeUIStep) {
    initialTabName = activeUIStep;
  }

  const disableTabItem = !filterType.length ? true : false;
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_CustomTabPanel__WEBPACK_IMPORTED_MODULE_2__["default"], {
    className: "__filter_ui_tab_panel",
    activeClass: "active-tab",
    orientation: "vertical",
    initialTabName: initialTabName,
    onSelect: handleSelect,
    tabs: [{
      name: 'general',
      title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('General', 'wc-ajax-product-filter'),
      className: 'general'
    }, {
      name: 'appearance',
      title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Appearance', 'wc-ajax-product-filter'),
      className: 'appearance',
      isDisabled: disableTabItem
    }, {
      name: 'options',
      title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Options', 'wc-ajax-product-filter'),
      className: 'options',
      isDisabled: disableTabItem
    }, {
      name: 'advanced',
      title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Advanced', 'wc-ajax-product-filter'),
      className: 'advanced',
      isDisabled: disableTabItem
    }]
  }, tab => {
    if ('general' === tab.name) {
      return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_General__WEBPACK_IMPORTED_MODULE_5__["default"], null);
    } else if ('appearance' === tab.name) {
      return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_Appearance__WEBPACK_IMPORTED_MODULE_6__["default"], null);
    } else if ('options' === tab.name) {
      return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_Options__WEBPACK_IMPORTED_MODULE_7__["default"], null);
    } else if ('advanced' === tab.name) {
      return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_Advanced__WEBPACK_IMPORTED_MODULE_4__["default"], null);
    }
  });
};

/* harmony default export */ __webpack_exports__["default"] = (FilterUI);

/***/ }),

/***/ "./src/components/Filter/FilterNav/index.js":
/*!**************************************************!*\
  !*** ./src/components/Filter/FilterNav/index.js ***!
  \**************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _FilterUI__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./FilterUI */ "./src/components/Filter/FilterNav/FilterUI/index.js");
/* harmony import */ var _VisibilityRules__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../VisibilityRules */ "./src/components/VisibilityRules/index.js");
/* harmony import */ var _FilterContext__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../FilterContext */ "./src/components/Filter/FilterContext.js");








const FilterNav = () => {
  const {
    state: {
      isLoading
    }
  } = (0,_FilterContext__WEBPACK_IMPORTED_MODULE_5__.useFilter)();
  const [activeTab, setActiveTab] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)('filter_ui');

  const handleSelect = tabName => {
    setActiveTab(tabName);
  };

  let tabPanelClasses = '__tab_panel';

  if ('filter_ui' === activeTab) {
    tabPanelClasses += ' filter_ui';
  }

  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.TabPanel, {
    className: tabPanelClasses,
    activeClass: "active-tab",
    onSelect: handleSelect,
    tabs: [{
      name: 'filter_ui',
      title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Filter UI', 'wc-ajax-product-filter'),
      className: 'filter_ui'
    }, {
      name: 'visibility_rules',
      title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Visibility Rules', 'wc-ajax-product-filter'),
      className: 'visibility_rules'
    }, {
      name: 'customize',
      title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Customize', 'wc-ajax-product-filter'),
      className: 'customize'
    }]
  }, tab => {
    if (isLoading) {
      return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.Flex, {
        justify: 'center',
        style: {
          margin: '2em 0'
        }
      }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.Spinner, null));
    } else {
      if (tab.name === 'filter_ui') {
        return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_FilterUI__WEBPACK_IMPORTED_MODULE_3__["default"], null);
      } else if (tab.name === 'visibility_rules') {
        return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_VisibilityRules__WEBPACK_IMPORTED_MODULE_4__["default"], null);
      } else if (tab.name === 'customize') {
        return 'Customize Form';
      }
    }
  });
};

/* harmony default export */ __webpack_exports__["default"] = (FilterNav);

/***/ }),

/***/ "./src/components/Filter/FilterPreview.js":
/*!************************************************!*\
  !*** ./src/components/Filter/FilterPreview.js ***!
  \************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! axios */ "./node_modules/axios/index.js");
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(axios__WEBPACK_IMPORTED_MODULE_3__);






const FilterPreview = () => {
  const [preview, setPreview] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)('');
  const [isLoading, setLoading] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(true);
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    axios__WEBPACK_IMPORTED_MODULE_3___default().get(wcapf_admin_params.ajaxurl, {
      params: {
        action: 'get_filter_preview'
      }
    }).then(_ref => {
      let {
        data: {
          data
        }
      } = _ref;
      setPreview(data);
      setLoading(false);
    }).catch(err => {
      console.log(err);
      setLoading(false);
    });
  }, []);
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: 'editor-preview'
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: '__inner'
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("h3", {
    className: "__title"
  }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Preview', 'wc-ajax-product-filter	')), isLoading ? (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.Spinner, null) : (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    dangerouslySetInnerHTML: {
      __html: preview
    }
  })), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: '__overlay'
  }));
};

/* harmony default export */ __webpack_exports__["default"] = (FilterPreview);

/***/ }),

/***/ "./src/components/Filter/FilterSaveButton.js":
/*!***************************************************!*\
  !*** ./src/components/Filter/FilterSaveButton.js ***!
  \***************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! axios */ "./node_modules/axios/index.js");
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(axios__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _FilterContext__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./FilterContext */ "./src/components/Filter/FilterContext.js");
/* harmony import */ var _wordpress_notices__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @wordpress/notices */ "@wordpress/notices");
/* harmony import */ var _wordpress_notices__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_wordpress_notices__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @wordpress/data */ "@wordpress/data");
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_wordpress_data__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _SaveButton__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../SaveButton */ "./src/components/SaveButton.js");








const FilterSaveButton = () => {
  const {
    state: {
      isDirty,
      title
    },
    dispatch
  } = (0,_FilterContext__WEBPACK_IMPORTED_MODULE_2__.useFilter)();
  const [isLoading, setLoading] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(false);
  const {
    createErrorNotice
  } = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_4__.useDispatch)(_wordpress_notices__WEBPACK_IMPORTED_MODULE_3__.store);

  const handleSave = () => {
    setLoading(true);
    const formData = new FormData();
    formData.append('action', 'save_filter');
    formData.append('post_title', title);
    axios__WEBPACK_IMPORTED_MODULE_1___default().post(wcapf_admin_params.ajaxurl, formData).then(() => {
      setLoading(false);
      dispatch({
        type: 'UNSET_DIRTY'
      });
    }).catch(err => {
      setLoading(false);
      createErrorNotice(err.message, {
        type: 'snackbar',
        icon: '🔥'
      });
    });
  };

  let _disabled = false;

  if (!isDirty) {
    _disabled = true;
  } else if (isLoading) {
    _disabled = true;
  }

  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_SaveButton__WEBPACK_IMPORTED_MODULE_5__["default"], {
    disabled: _disabled,
    isLoading: isLoading,
    handleSave: handleSave
  });
};

/* harmony default export */ __webpack_exports__["default"] = (FilterSaveButton);

/***/ }),

/***/ "./src/components/Filter/FilterSettings.js":
/*!*************************************************!*\
  !*** ./src/components/Filter/FilterSettings.js ***!
  \*************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _FilterNav__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./FilterNav */ "./src/components/Filter/FilterNav/index.js");
/* harmony import */ var _FilterTitle__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./FilterTitle */ "./src/components/Filter/FilterTitle.js");




const FilterSettings = () => {
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: 'editor-control'
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_FilterTitle__WEBPACK_IMPORTED_MODULE_2__["default"], null), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_FilterNav__WEBPACK_IMPORTED_MODULE_1__["default"], null));
};

/* harmony default export */ __webpack_exports__["default"] = (FilterSettings);

/***/ }),

/***/ "./src/components/Filter/FilterTitle.js":
/*!**********************************************!*\
  !*** ./src/components/Filter/FilterTitle.js ***!
  \**********************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _FilterContext__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./FilterContext */ "./src/components/Filter/FilterContext.js");
/* harmony import */ var _Title__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../Title */ "./src/components/Title.js");





const FilterTitle = () => {
  const {
    state: {
      title
    },
    dispatch
  } = (0,_FilterContext__WEBPACK_IMPORTED_MODULE_2__.useFilter)();

  const handleChange = value => {
    dispatch({
      type: 'SET_TITLE',
      payload: value
    });
    dispatch({
      type: 'SET_DIRTY'
    });
  };

  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_Title__WEBPACK_IMPORTED_MODULE_3__["default"], {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Filter Title', 'wc-ajax-product-filter'),
    value: title,
    handleChange: handleChange
  });
};

/* harmony default export */ __webpack_exports__["default"] = (FilterTitle);

/***/ }),

/***/ "./src/components/Filter/filterReducer.js":
/*!************************************************!*\
  !*** ./src/components/Filter/filterReducer.js ***!
  \************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "initialState": function() { return /* binding */ initialState; }
/* harmony export */ });
const initialState = {
  isLoading: true,
  filterType: '',
  activeUIStep: '',
  filterKeys: {},
  additionalData: {},
  activeFilterData: {},
  filtersData: {},
  title: '',
  isDirty: false,
  isFilterOptionsLoading: true,
  filterOptions: [],
  filterModalOptions: []
};

const filterReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state,
        isLoading: action.payload
      };

    case 'SET_TITLE':
      return { ...state,
        title: action.payload
      };

    case 'SET_DIRTY':
      return { ...state,
        isDirty: true
      };

    case 'UNSET_DIRTY':
      return { ...state,
        isDirty: false
      };

    case 'SET_FILTER_TYPE':
      return { ...state,
        filterType: action.payload
      };

    case 'SET_ACTIVE_UI_STEP':
      return { ...state,
        activeUIStep: action.payload
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

    case 'SET_FILTERS_OPTIONS_LOADING':
      return { ...state,
        isFilterOptionsLoading: action.payload
      };

    case 'SET_FILTERS_MODAL_OPTIONS':
      return { ...state,
        filterModalOptions: action.payload
      };

    case 'SET_FILTERS_OPTIONS':
      return { ...state,
        filterOptions: action.payload
      };

    default:
      return state;
  }
};

/* harmony default export */ __webpack_exports__["default"] = (filterReducer);

/***/ }),

/***/ "./src/components/Filter/index.js":
/*!****************************************!*\
  !*** ./src/components/Filter/index.js ***!
  \****************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _FilterSettings__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./FilterSettings */ "./src/components/Filter/FilterSettings.js");
/* harmony import */ var _FilterPreview__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./FilterPreview */ "./src/components/Filter/FilterPreview.js");
/* harmony import */ var _Notifications__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../Notifications */ "./src/components/Notifications.js");
/* harmony import */ var _FilterSaveButton__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./FilterSaveButton */ "./src/components/Filter/FilterSaveButton.js");
/* harmony import */ var _FilterContext__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./FilterContext */ "./src/components/Filter/FilterContext.js");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./utils */ "./src/components/Filter/utils.js");
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! axios */ "./node_modules/axios/index.js");
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(axios__WEBPACK_IMPORTED_MODULE_7__);
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! lodash */ "lodash");
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_8___default = /*#__PURE__*/__webpack_require__.n(lodash__WEBPACK_IMPORTED_MODULE_8__);
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../utils */ "./src/components/utils.js");












const Filter = () => {
  const {
    dispatch
  } = (0,_FilterContext__WEBPACK_IMPORTED_MODULE_5__.useFilter)();

  const getFilterData = () => {
    /**
     * @source https://stackoverflow.com/a/979995
     */
    var query = new URL(window.location.href);
    var id = query.searchParams.get('id');
    const data = {
      action: 'get_filter_data',
      post_id: id
    };
    return axios__WEBPACK_IMPORTED_MODULE_7___default().get(wcapf_admin_params.ajaxurl, {
      params: data
    });
  };

  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    Promise.all([getFilterData(), (0,_utils__WEBPACK_IMPORTED_MODULE_9__.getAdditionalData)()]).then(results => {
      const resFilterData = results[0];
      const resAdditionalData = results[1];
      const {
        data: {
          data: filterData
        }
      } = resFilterData;
      const {
        data: {
          data: additionalData
        }
      } = resAdditionalData;
      let activeFilterData = {};
      let filterType = '';
      let filterKey = '';

      if (!(0,lodash__WEBPACK_IMPORTED_MODULE_8__.isEmpty)(filterData)) {
        dispatch({
          type: 'SET_TITLE',
          payload: filterData['post_title']
        });
        activeFilterData = (0,lodash__WEBPACK_IMPORTED_MODULE_8__.merge)((0,_utils__WEBPACK_IMPORTED_MODULE_6__.filterDefaultData)(), filterData['field_data']);
        filterType = activeFilterData['type'];
        filterKey = activeFilterData['field_key'];
        dispatch({
          type: 'SET_ACTIVE_FILTER_DATA',
          payload: activeFilterData
        });
        dispatch({
          type: 'SET_FILTER_TYPE',
          payload: filterType
        });
      }

      dispatch({
        type: 'SET_ADDITIONAL_DATA',
        payload: additionalData
      });
      /**
       * TODO: Sets the filter options.
       */

      const filterOptions = [{
        term_id: 18,
        name: 'Blue',
        slug: 'blue'
      }, {
        term_id: 28,
        name: 'Gray',
        slug: 'gray',
        status: 'added'
      }];
      dispatch({
        type: 'SET_FILTERS_OPTIONS',
        payload: filterOptions
      });
      /**
       * Sets the default filter keys.
       */

      const filterKeys = {};
      (0,_utils__WEBPACK_IMPORTED_MODULE_6__.getAvailableFilters)().map(item => {
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
      dispatch({
        type: 'SET_LOADING',
        payload: false
      });
    }).catch(err => console.log(err));
  }, []);
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_FilterSettings__WEBPACK_IMPORTED_MODULE_1__["default"], null), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_FilterSaveButton__WEBPACK_IMPORTED_MODULE_4__["default"], null), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_FilterPreview__WEBPACK_IMPORTED_MODULE_2__["default"], null), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_Notifications__WEBPACK_IMPORTED_MODULE_3__["default"], null));
};

/* harmony default export */ __webpack_exports__["default"] = (Filter);

/***/ }),

/***/ "./src/components/Filter/utils.js":
/*!****************************************!*\
  !*** ./src/components/Filter/utils.js ***!
  \****************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "filterDefaultData": function() { return /* binding */ filterDefaultData; },
/* harmony export */   "getAvailableFilters": function() { return /* binding */ getAvailableFilters; },
/* harmony export */   "getFilterDefaultData": function() { return /* binding */ getFilterDefaultData; },
/* harmony export */   "getOrderByOptions": function() { return /* binding */ getOrderByOptions; },
/* harmony export */   "getOrderDirectionOptions": function() { return /* binding */ getOrderDirectionOptions; },
/* harmony export */   "getTaxonomyLimitByOptions": function() { return /* binding */ getTaxonomyLimitByOptions; },
/* harmony export */   "getTooltipPositionOptions": function() { return /* binding */ getTooltipPositionOptions; }
/* harmony export */ });
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! lodash */ "lodash");
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(lodash__WEBPACK_IMPORTED_MODULE_1__);


function filterDefaultData() {
  return {
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
    type: '',
    field_id: '',
    enable_visibility_rules: '',
    visibility_rules: [],
    get_options: 'automatically'
  };
}
function getFilterDefaultData(type) {
  const defaultData = filterDefaultData();
  const filterData = (0,lodash__WEBPACK_IMPORTED_MODULE_1__.find)(getAvailableFilters(), {
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
function getAvailableFilters() {
  return [{
    title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Active Filters', 'wc-ajax-product-filter'),
    type: 'active-filters'
  }, {
    title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Category', 'wc-ajax-product-filter'),
    type: 'category',
    defaultFilterKey: '_product-cat'
  }, {
    title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Tag', 'wc-ajax-product-filter'),
    type: 'tag',
    defaultFilterKey: '_product-tag'
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
    defaultFilterKey: '_product-status'
  }, {
    title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Post Property', 'wc-ajax-product-filter'),
    type: 'post-property'
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
    defaultFilterKey: '_sort-by',
    isPro: true
  }, {
    title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Per page', 'wc-ajax-product-filter'),
    type: 'per-page',
    defaultFilterKey: '_per-page',
    isPro: true
  }, {
    title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Reset Button', 'wc-ajax-product-filter'),
    type: 'reset-button'
  }];
}
function getTooltipPositionOptions() {
  return [{
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Top', 'wc-ajax-product-filter'),
    value: 'top'
  }, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Right', 'wc-ajax-product-filter'),
    value: 'right'
  }, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Bottom', 'wc-ajax-product-filter'),
    value: 'bottom'
  }, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Left', 'wc-ajax-product-filter'),
    value: 'left'
  }];
}
function getTaxonomyLimitByOptions() {
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
function getOrderByOptions() {
  return [{
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
function getOrderDirectionOptions() {
  return [{
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('ASC', 'wc-ajax-product-filter'),
    value: 'asc'
  }, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('DESC', 'wc-ajax-product-filter'),
    value: 'desc'
  }];
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

/***/ "./src/components/SaveButton.js":
/*!**************************************!*\
  !*** ./src/components/SaveButton.js ***!
  \**************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__);




const SaveButton = _ref => {
  let {
    disabled,
    isLoading,
    handleSave
  } = _ref;
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.Button, {
    variant: "primary",
    className: "__save_post",
    disabled: disabled,
    onClick: handleSave
  }, isLoading ? (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.Spinner, null) : (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.Icon, {
    icon: (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("svg", {
      focusable: "false",
      "aria-hidden": "true",
      viewBox: "0 0 24 24",
      "data-testid": "SaveIcon"
    }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
      d: "M17 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-10H5V5h10v4z"
    })),
    size: 24
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
    className: "__text"
  }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Save', 'wc-ajax-product-filter'))));
};

/* harmony default export */ __webpack_exports__["default"] = (SaveButton);

/***/ }),

/***/ "./src/components/Title.js":
/*!*********************************!*\
  !*** ./src/components/Title.js ***!
  \*********************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./utils */ "./src/components/utils.js");




const Title = _ref => {
  let {
    label,
    value,
    handleChange
  } = _ref;
  const link = (0,_utils__WEBPACK_IMPORTED_MODULE_2__.removeParam)('id', window.location.search);
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.Flex, {
    justify: 'normal',
    align: 'end'
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "__back_button_wrapper"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.Button, {
    href: link
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.Icon, {
    icon: (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("svg", {
      id: "__back_button_svg",
      width: "16px",
      height: "16px",
      viewBox: "0 0 512.006 512.006"
    }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("g", null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("g", null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
      d: "M388.419,475.59L168.834,256.005L388.418,36.421c8.341-8.341,8.341-21.824,0-30.165s-21.824-8.341-30.165,0    L123.586,240.923c-8.341,8.341-8.341,21.824,0,30.165l234.667,234.667c4.16,4.16,9.621,6.251,15.083,6.251    c5.461,0,10.923-2.091,15.083-6.251C396.76,497.414,396.76,483.931,388.419,475.59z"
    }))), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("g", null), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("g", null), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("g", null), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("g", null), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("g", null), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("g", null), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("g", null), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("g", null), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("g", null), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("g", null), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("g", null), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("g", null), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("g", null), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("g", null), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("g", null)),
    size: 56,
    className: "__back_button"
  }))), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.FlexItem, {
    style: {
      flex: 1
    }
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.TextControl, {
    label: label,
    value: value,
    onChange: value => handleChange(value),
    className: '__title'
  })));
};

/* harmony default export */ __webpack_exports__["default"] = (Title);

/***/ }),

/***/ "./src/components/VisibilityRules/index.js":
/*!*************************************************!*\
  !*** ./src/components/VisibilityRules/index.js ***!
  \*************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _CustomTabPanel__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../CustomTabPanel */ "./src/components/CustomTabPanel.js");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__);




const VisibilityRules = () => {
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("h3", {
    style: {
      textTransform: 'uppercase'
    }
  }, "visibility rules");
};

/* harmony default export */ __webpack_exports__["default"] = (VisibilityRules);

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
/* harmony export */   "isProFeature": function() { return /* binding */ isProFeature; },
/* harmony export */   "prepareFilterData": function() { return /* binding */ prepareFilterData; },
/* harmony export */   "prepareMetaKeys": function() { return /* binding */ prepareMetaKeys; },
/* harmony export */   "proTag": function() { return /* binding */ proTag; },
/* harmony export */   "removeParam": function() { return /* binding */ removeParam; }
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _Filter_utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Filter/utils */ "./src/components/Filter/utils.js");
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! lodash */ "lodash");
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(lodash__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! axios */ "./node_modules/axios/index.js");
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(axios__WEBPACK_IMPORTED_MODULE_3__);




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
  return axios__WEBPACK_IMPORTED_MODULE_3___default().get(wcapf_admin_params.ajaxurl, {
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
  const availableFilters = (0,_Filter_utils__WEBPACK_IMPORTED_MODULE_1__.getAvailableFilters)();

  const _filterData = (0,lodash__WEBPACK_IMPORTED_MODULE_2__.find)(availableFilters, {
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

/***/ "./src/filter.scss":
/*!*************************!*\
  !*** ./src/filter.scss ***!
  \*************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./node_modules/object-assign/index.js":
/*!*********************************************!*\
  !*** ./node_modules/object-assign/index.js ***!
  \*********************************************/
/***/ (function(module) {

"use strict";
/*
object-assign
(c) Sindre Sorhus
@license MIT
*/


/* eslint-disable no-unused-vars */
var getOwnPropertySymbols = Object.getOwnPropertySymbols;
var hasOwnProperty = Object.prototype.hasOwnProperty;
var propIsEnumerable = Object.prototype.propertyIsEnumerable;

function toObject(val) {
	if (val === null || val === undefined) {
		throw new TypeError('Object.assign cannot be called with null or undefined');
	}

	return Object(val);
}

function shouldUseNative() {
	try {
		if (!Object.assign) {
			return false;
		}

		// Detect buggy property enumeration order in older V8 versions.

		// https://bugs.chromium.org/p/v8/issues/detail?id=4118
		var test1 = new String('abc');  // eslint-disable-line no-new-wrappers
		test1[5] = 'de';
		if (Object.getOwnPropertyNames(test1)[0] === '5') {
			return false;
		}

		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
		var test2 = {};
		for (var i = 0; i < 10; i++) {
			test2['_' + String.fromCharCode(i)] = i;
		}
		var order2 = Object.getOwnPropertyNames(test2).map(function (n) {
			return test2[n];
		});
		if (order2.join('') !== '0123456789') {
			return false;
		}

		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
		var test3 = {};
		'abcdefghijklmnopqrst'.split('').forEach(function (letter) {
			test3[letter] = letter;
		});
		if (Object.keys(Object.assign({}, test3)).join('') !==
				'abcdefghijklmnopqrst') {
			return false;
		}

		return true;
	} catch (err) {
		// We don't expect any of the above to throw, but better to be safe.
		return false;
	}
}

module.exports = shouldUseNative() ? Object.assign : function (target, source) {
	var from;
	var to = toObject(target);
	var symbols;

	for (var s = 1; s < arguments.length; s++) {
		from = Object(arguments[s]);

		for (var key in from) {
			if (hasOwnProperty.call(from, key)) {
				to[key] = from[key];
			}
		}

		if (getOwnPropertySymbols) {
			symbols = getOwnPropertySymbols(from);
			for (var i = 0; i < symbols.length; i++) {
				if (propIsEnumerable.call(from, symbols[i])) {
					to[symbols[i]] = from[symbols[i]];
				}
			}
		}
	}

	return to;
};


/***/ }),

/***/ "./node_modules/prop-types/checkPropTypes.js":
/*!***************************************************!*\
  !*** ./node_modules/prop-types/checkPropTypes.js ***!
  \***************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */



var printWarning = function() {};

if (true) {
  var ReactPropTypesSecret = __webpack_require__(/*! ./lib/ReactPropTypesSecret */ "./node_modules/prop-types/lib/ReactPropTypesSecret.js");
  var loggedTypeFailures = {};
  var has = __webpack_require__(/*! ./lib/has */ "./node_modules/prop-types/lib/has.js");

  printWarning = function(text) {
    var message = 'Warning: ' + text;
    if (typeof console !== 'undefined') {
      console.error(message);
    }
    try {
      // --- Welcome to debugging React ---
      // This error was thrown as a convenience so that you can use this stack
      // to find the callsite that caused this warning to fire.
      throw new Error(message);
    } catch (x) { /**/ }
  };
}

/**
 * Assert that the values match with the type specs.
 * Error messages are memorized and will only be shown once.
 *
 * @param {object} typeSpecs Map of name to a ReactPropType
 * @param {object} values Runtime values that need to be type-checked
 * @param {string} location e.g. "prop", "context", "child context"
 * @param {string} componentName Name of the component for error messages.
 * @param {?Function} getStack Returns the component stack.
 * @private
 */
function checkPropTypes(typeSpecs, values, location, componentName, getStack) {
  if (true) {
    for (var typeSpecName in typeSpecs) {
      if (has(typeSpecs, typeSpecName)) {
        var error;
        // Prop type validation may throw. In case they do, we don't want to
        // fail the render phase where it didn't fail before. So we log it.
        // After these have been cleaned up, we'll let them throw.
        try {
          // This is intentionally an invariant that gets caught. It's the same
          // behavior as without this statement except with a better message.
          if (typeof typeSpecs[typeSpecName] !== 'function') {
            var err = Error(
              (componentName || 'React class') + ': ' + location + ' type `' + typeSpecName + '` is invalid; ' +
              'it must be a function, usually from the `prop-types` package, but received `' + typeof typeSpecs[typeSpecName] + '`.' +
              'This often happens because of typos such as `PropTypes.function` instead of `PropTypes.func`.'
            );
            err.name = 'Invariant Violation';
            throw err;
          }
          error = typeSpecs[typeSpecName](values, typeSpecName, componentName, location, null, ReactPropTypesSecret);
        } catch (ex) {
          error = ex;
        }
        if (error && !(error instanceof Error)) {
          printWarning(
            (componentName || 'React class') + ': type specification of ' +
            location + ' `' + typeSpecName + '` is invalid; the type checker ' +
            'function must return `null` or an `Error` but returned a ' + typeof error + '. ' +
            'You may have forgotten to pass an argument to the type checker ' +
            'creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and ' +
            'shape all require an argument).'
          );
        }
        if (error instanceof Error && !(error.message in loggedTypeFailures)) {
          // Only monitor this failure once because there tends to be a lot of the
          // same error.
          loggedTypeFailures[error.message] = true;

          var stack = getStack ? getStack() : '';

          printWarning(
            'Failed ' + location + ' type: ' + error.message + (stack != null ? stack : '')
          );
        }
      }
    }
  }
}

/**
 * Resets warning cache when testing.
 *
 * @private
 */
checkPropTypes.resetWarningCache = function() {
  if (true) {
    loggedTypeFailures = {};
  }
}

module.exports = checkPropTypes;


/***/ }),

/***/ "./node_modules/prop-types/factoryWithTypeCheckers.js":
/*!************************************************************!*\
  !*** ./node_modules/prop-types/factoryWithTypeCheckers.js ***!
  \************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */



var ReactIs = __webpack_require__(/*! react-is */ "./node_modules/react-is/index.js");
var assign = __webpack_require__(/*! object-assign */ "./node_modules/object-assign/index.js");

var ReactPropTypesSecret = __webpack_require__(/*! ./lib/ReactPropTypesSecret */ "./node_modules/prop-types/lib/ReactPropTypesSecret.js");
var has = __webpack_require__(/*! ./lib/has */ "./node_modules/prop-types/lib/has.js");
var checkPropTypes = __webpack_require__(/*! ./checkPropTypes */ "./node_modules/prop-types/checkPropTypes.js");

var printWarning = function() {};

if (true) {
  printWarning = function(text) {
    var message = 'Warning: ' + text;
    if (typeof console !== 'undefined') {
      console.error(message);
    }
    try {
      // --- Welcome to debugging React ---
      // This error was thrown as a convenience so that you can use this stack
      // to find the callsite that caused this warning to fire.
      throw new Error(message);
    } catch (x) {}
  };
}

function emptyFunctionThatReturnsNull() {
  return null;
}

module.exports = function(isValidElement, throwOnDirectAccess) {
  /* global Symbol */
  var ITERATOR_SYMBOL = typeof Symbol === 'function' && Symbol.iterator;
  var FAUX_ITERATOR_SYMBOL = '@@iterator'; // Before Symbol spec.

  /**
   * Returns the iterator method function contained on the iterable object.
   *
   * Be sure to invoke the function with the iterable as context:
   *
   *     var iteratorFn = getIteratorFn(myIterable);
   *     if (iteratorFn) {
   *       var iterator = iteratorFn.call(myIterable);
   *       ...
   *     }
   *
   * @param {?object} maybeIterable
   * @return {?function}
   */
  function getIteratorFn(maybeIterable) {
    var iteratorFn = maybeIterable && (ITERATOR_SYMBOL && maybeIterable[ITERATOR_SYMBOL] || maybeIterable[FAUX_ITERATOR_SYMBOL]);
    if (typeof iteratorFn === 'function') {
      return iteratorFn;
    }
  }

  /**
   * Collection of methods that allow declaration and validation of props that are
   * supplied to React components. Example usage:
   *
   *   var Props = require('ReactPropTypes');
   *   var MyArticle = React.createClass({
   *     propTypes: {
   *       // An optional string prop named "description".
   *       description: Props.string,
   *
   *       // A required enum prop named "category".
   *       category: Props.oneOf(['News','Photos']).isRequired,
   *
   *       // A prop named "dialog" that requires an instance of Dialog.
   *       dialog: Props.instanceOf(Dialog).isRequired
   *     },
   *     render: function() { ... }
   *   });
   *
   * A more formal specification of how these methods are used:
   *
   *   type := array|bool|func|object|number|string|oneOf([...])|instanceOf(...)
   *   decl := ReactPropTypes.{type}(.isRequired)?
   *
   * Each and every declaration produces a function with the same signature. This
   * allows the creation of custom validation functions. For example:
   *
   *  var MyLink = React.createClass({
   *    propTypes: {
   *      // An optional string or URI prop named "href".
   *      href: function(props, propName, componentName) {
   *        var propValue = props[propName];
   *        if (propValue != null && typeof propValue !== 'string' &&
   *            !(propValue instanceof URI)) {
   *          return new Error(
   *            'Expected a string or an URI for ' + propName + ' in ' +
   *            componentName
   *          );
   *        }
   *      }
   *    },
   *    render: function() {...}
   *  });
   *
   * @internal
   */

  var ANONYMOUS = '<<anonymous>>';

  // Important!
  // Keep this list in sync with production version in `./factoryWithThrowingShims.js`.
  var ReactPropTypes = {
    array: createPrimitiveTypeChecker('array'),
    bigint: createPrimitiveTypeChecker('bigint'),
    bool: createPrimitiveTypeChecker('boolean'),
    func: createPrimitiveTypeChecker('function'),
    number: createPrimitiveTypeChecker('number'),
    object: createPrimitiveTypeChecker('object'),
    string: createPrimitiveTypeChecker('string'),
    symbol: createPrimitiveTypeChecker('symbol'),

    any: createAnyTypeChecker(),
    arrayOf: createArrayOfTypeChecker,
    element: createElementTypeChecker(),
    elementType: createElementTypeTypeChecker(),
    instanceOf: createInstanceTypeChecker,
    node: createNodeChecker(),
    objectOf: createObjectOfTypeChecker,
    oneOf: createEnumTypeChecker,
    oneOfType: createUnionTypeChecker,
    shape: createShapeTypeChecker,
    exact: createStrictShapeTypeChecker,
  };

  /**
   * inlined Object.is polyfill to avoid requiring consumers ship their own
   * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is
   */
  /*eslint-disable no-self-compare*/
  function is(x, y) {
    // SameValue algorithm
    if (x === y) {
      // Steps 1-5, 7-10
      // Steps 6.b-6.e: +0 != -0
      return x !== 0 || 1 / x === 1 / y;
    } else {
      // Step 6.a: NaN == NaN
      return x !== x && y !== y;
    }
  }
  /*eslint-enable no-self-compare*/

  /**
   * We use an Error-like object for backward compatibility as people may call
   * PropTypes directly and inspect their output. However, we don't use real
   * Errors anymore. We don't inspect their stack anyway, and creating them
   * is prohibitively expensive if they are created too often, such as what
   * happens in oneOfType() for any type before the one that matched.
   */
  function PropTypeError(message, data) {
    this.message = message;
    this.data = data && typeof data === 'object' ? data: {};
    this.stack = '';
  }
  // Make `instanceof Error` still work for returned errors.
  PropTypeError.prototype = Error.prototype;

  function createChainableTypeChecker(validate) {
    if (true) {
      var manualPropTypeCallCache = {};
      var manualPropTypeWarningCount = 0;
    }
    function checkType(isRequired, props, propName, componentName, location, propFullName, secret) {
      componentName = componentName || ANONYMOUS;
      propFullName = propFullName || propName;

      if (secret !== ReactPropTypesSecret) {
        if (throwOnDirectAccess) {
          // New behavior only for users of `prop-types` package
          var err = new Error(
            'Calling PropTypes validators directly is not supported by the `prop-types` package. ' +
            'Use `PropTypes.checkPropTypes()` to call them. ' +
            'Read more at http://fb.me/use-check-prop-types'
          );
          err.name = 'Invariant Violation';
          throw err;
        } else if ( true && typeof console !== 'undefined') {
          // Old behavior for people using React.PropTypes
          var cacheKey = componentName + ':' + propName;
          if (
            !manualPropTypeCallCache[cacheKey] &&
            // Avoid spamming the console because they are often not actionable except for lib authors
            manualPropTypeWarningCount < 3
          ) {
            printWarning(
              'You are manually calling a React.PropTypes validation ' +
              'function for the `' + propFullName + '` prop on `' + componentName + '`. This is deprecated ' +
              'and will throw in the standalone `prop-types` package. ' +
              'You may be seeing this warning due to a third-party PropTypes ' +
              'library. See https://fb.me/react-warning-dont-call-proptypes ' + 'for details.'
            );
            manualPropTypeCallCache[cacheKey] = true;
            manualPropTypeWarningCount++;
          }
        }
      }
      if (props[propName] == null) {
        if (isRequired) {
          if (props[propName] === null) {
            return new PropTypeError('The ' + location + ' `' + propFullName + '` is marked as required ' + ('in `' + componentName + '`, but its value is `null`.'));
          }
          return new PropTypeError('The ' + location + ' `' + propFullName + '` is marked as required in ' + ('`' + componentName + '`, but its value is `undefined`.'));
        }
        return null;
      } else {
        return validate(props, propName, componentName, location, propFullName);
      }
    }

    var chainedCheckType = checkType.bind(null, false);
    chainedCheckType.isRequired = checkType.bind(null, true);

    return chainedCheckType;
  }

  function createPrimitiveTypeChecker(expectedType) {
    function validate(props, propName, componentName, location, propFullName, secret) {
      var propValue = props[propName];
      var propType = getPropType(propValue);
      if (propType !== expectedType) {
        // `propValue` being instance of, say, date/regexp, pass the 'object'
        // check, but we can offer a more precise error message here rather than
        // 'of type `object`'.
        var preciseType = getPreciseType(propValue);

        return new PropTypeError(
          'Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + preciseType + '` supplied to `' + componentName + '`, expected ') + ('`' + expectedType + '`.'),
          {expectedType: expectedType}
        );
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createAnyTypeChecker() {
    return createChainableTypeChecker(emptyFunctionThatReturnsNull);
  }

  function createArrayOfTypeChecker(typeChecker) {
    function validate(props, propName, componentName, location, propFullName) {
      if (typeof typeChecker !== 'function') {
        return new PropTypeError('Property `' + propFullName + '` of component `' + componentName + '` has invalid PropType notation inside arrayOf.');
      }
      var propValue = props[propName];
      if (!Array.isArray(propValue)) {
        var propType = getPropType(propValue);
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + propType + '` supplied to `' + componentName + '`, expected an array.'));
      }
      for (var i = 0; i < propValue.length; i++) {
        var error = typeChecker(propValue, i, componentName, location, propFullName + '[' + i + ']', ReactPropTypesSecret);
        if (error instanceof Error) {
          return error;
        }
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createElementTypeChecker() {
    function validate(props, propName, componentName, location, propFullName) {
      var propValue = props[propName];
      if (!isValidElement(propValue)) {
        var propType = getPropType(propValue);
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + propType + '` supplied to `' + componentName + '`, expected a single ReactElement.'));
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createElementTypeTypeChecker() {
    function validate(props, propName, componentName, location, propFullName) {
      var propValue = props[propName];
      if (!ReactIs.isValidElementType(propValue)) {
        var propType = getPropType(propValue);
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + propType + '` supplied to `' + componentName + '`, expected a single ReactElement type.'));
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createInstanceTypeChecker(expectedClass) {
    function validate(props, propName, componentName, location, propFullName) {
      if (!(props[propName] instanceof expectedClass)) {
        var expectedClassName = expectedClass.name || ANONYMOUS;
        var actualClassName = getClassName(props[propName]);
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + actualClassName + '` supplied to `' + componentName + '`, expected ') + ('instance of `' + expectedClassName + '`.'));
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createEnumTypeChecker(expectedValues) {
    if (!Array.isArray(expectedValues)) {
      if (true) {
        if (arguments.length > 1) {
          printWarning(
            'Invalid arguments supplied to oneOf, expected an array, got ' + arguments.length + ' arguments. ' +
            'A common mistake is to write oneOf(x, y, z) instead of oneOf([x, y, z]).'
          );
        } else {
          printWarning('Invalid argument supplied to oneOf, expected an array.');
        }
      }
      return emptyFunctionThatReturnsNull;
    }

    function validate(props, propName, componentName, location, propFullName) {
      var propValue = props[propName];
      for (var i = 0; i < expectedValues.length; i++) {
        if (is(propValue, expectedValues[i])) {
          return null;
        }
      }

      var valuesString = JSON.stringify(expectedValues, function replacer(key, value) {
        var type = getPreciseType(value);
        if (type === 'symbol') {
          return String(value);
        }
        return value;
      });
      return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of value `' + String(propValue) + '` ' + ('supplied to `' + componentName + '`, expected one of ' + valuesString + '.'));
    }
    return createChainableTypeChecker(validate);
  }

  function createObjectOfTypeChecker(typeChecker) {
    function validate(props, propName, componentName, location, propFullName) {
      if (typeof typeChecker !== 'function') {
        return new PropTypeError('Property `' + propFullName + '` of component `' + componentName + '` has invalid PropType notation inside objectOf.');
      }
      var propValue = props[propName];
      var propType = getPropType(propValue);
      if (propType !== 'object') {
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + propType + '` supplied to `' + componentName + '`, expected an object.'));
      }
      for (var key in propValue) {
        if (has(propValue, key)) {
          var error = typeChecker(propValue, key, componentName, location, propFullName + '.' + key, ReactPropTypesSecret);
          if (error instanceof Error) {
            return error;
          }
        }
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createUnionTypeChecker(arrayOfTypeCheckers) {
    if (!Array.isArray(arrayOfTypeCheckers)) {
       true ? printWarning('Invalid argument supplied to oneOfType, expected an instance of array.') : 0;
      return emptyFunctionThatReturnsNull;
    }

    for (var i = 0; i < arrayOfTypeCheckers.length; i++) {
      var checker = arrayOfTypeCheckers[i];
      if (typeof checker !== 'function') {
        printWarning(
          'Invalid argument supplied to oneOfType. Expected an array of check functions, but ' +
          'received ' + getPostfixForTypeWarning(checker) + ' at index ' + i + '.'
        );
        return emptyFunctionThatReturnsNull;
      }
    }

    function validate(props, propName, componentName, location, propFullName) {
      var expectedTypes = [];
      for (var i = 0; i < arrayOfTypeCheckers.length; i++) {
        var checker = arrayOfTypeCheckers[i];
        var checkerResult = checker(props, propName, componentName, location, propFullName, ReactPropTypesSecret);
        if (checkerResult == null) {
          return null;
        }
        if (checkerResult.data && has(checkerResult.data, 'expectedType')) {
          expectedTypes.push(checkerResult.data.expectedType);
        }
      }
      var expectedTypesMessage = (expectedTypes.length > 0) ? ', expected one of type [' + expectedTypes.join(', ') + ']': '';
      return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` supplied to ' + ('`' + componentName + '`' + expectedTypesMessage + '.'));
    }
    return createChainableTypeChecker(validate);
  }

  function createNodeChecker() {
    function validate(props, propName, componentName, location, propFullName) {
      if (!isNode(props[propName])) {
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` supplied to ' + ('`' + componentName + '`, expected a ReactNode.'));
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function invalidValidatorError(componentName, location, propFullName, key, type) {
    return new PropTypeError(
      (componentName || 'React class') + ': ' + location + ' type `' + propFullName + '.' + key + '` is invalid; ' +
      'it must be a function, usually from the `prop-types` package, but received `' + type + '`.'
    );
  }

  function createShapeTypeChecker(shapeTypes) {
    function validate(props, propName, componentName, location, propFullName) {
      var propValue = props[propName];
      var propType = getPropType(propValue);
      if (propType !== 'object') {
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type `' + propType + '` ' + ('supplied to `' + componentName + '`, expected `object`.'));
      }
      for (var key in shapeTypes) {
        var checker = shapeTypes[key];
        if (typeof checker !== 'function') {
          return invalidValidatorError(componentName, location, propFullName, key, getPreciseType(checker));
        }
        var error = checker(propValue, key, componentName, location, propFullName + '.' + key, ReactPropTypesSecret);
        if (error) {
          return error;
        }
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createStrictShapeTypeChecker(shapeTypes) {
    function validate(props, propName, componentName, location, propFullName) {
      var propValue = props[propName];
      var propType = getPropType(propValue);
      if (propType !== 'object') {
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type `' + propType + '` ' + ('supplied to `' + componentName + '`, expected `object`.'));
      }
      // We need to check all keys in case some are required but missing from props.
      var allKeys = assign({}, props[propName], shapeTypes);
      for (var key in allKeys) {
        var checker = shapeTypes[key];
        if (has(shapeTypes, key) && typeof checker !== 'function') {
          return invalidValidatorError(componentName, location, propFullName, key, getPreciseType(checker));
        }
        if (!checker) {
          return new PropTypeError(
            'Invalid ' + location + ' `' + propFullName + '` key `' + key + '` supplied to `' + componentName + '`.' +
            '\nBad object: ' + JSON.stringify(props[propName], null, '  ') +
            '\nValid keys: ' + JSON.stringify(Object.keys(shapeTypes), null, '  ')
          );
        }
        var error = checker(propValue, key, componentName, location, propFullName + '.' + key, ReactPropTypesSecret);
        if (error) {
          return error;
        }
      }
      return null;
    }

    return createChainableTypeChecker(validate);
  }

  function isNode(propValue) {
    switch (typeof propValue) {
      case 'number':
      case 'string':
      case 'undefined':
        return true;
      case 'boolean':
        return !propValue;
      case 'object':
        if (Array.isArray(propValue)) {
          return propValue.every(isNode);
        }
        if (propValue === null || isValidElement(propValue)) {
          return true;
        }

        var iteratorFn = getIteratorFn(propValue);
        if (iteratorFn) {
          var iterator = iteratorFn.call(propValue);
          var step;
          if (iteratorFn !== propValue.entries) {
            while (!(step = iterator.next()).done) {
              if (!isNode(step.value)) {
                return false;
              }
            }
          } else {
            // Iterator will provide entry [k,v] tuples rather than values.
            while (!(step = iterator.next()).done) {
              var entry = step.value;
              if (entry) {
                if (!isNode(entry[1])) {
                  return false;
                }
              }
            }
          }
        } else {
          return false;
        }

        return true;
      default:
        return false;
    }
  }

  function isSymbol(propType, propValue) {
    // Native Symbol.
    if (propType === 'symbol') {
      return true;
    }

    // falsy value can't be a Symbol
    if (!propValue) {
      return false;
    }

    // 19.4.3.5 Symbol.prototype[@@toStringTag] === 'Symbol'
    if (propValue['@@toStringTag'] === 'Symbol') {
      return true;
    }

    // Fallback for non-spec compliant Symbols which are polyfilled.
    if (typeof Symbol === 'function' && propValue instanceof Symbol) {
      return true;
    }

    return false;
  }

  // Equivalent of `typeof` but with special handling for array and regexp.
  function getPropType(propValue) {
    var propType = typeof propValue;
    if (Array.isArray(propValue)) {
      return 'array';
    }
    if (propValue instanceof RegExp) {
      // Old webkits (at least until Android 4.0) return 'function' rather than
      // 'object' for typeof a RegExp. We'll normalize this here so that /bla/
      // passes PropTypes.object.
      return 'object';
    }
    if (isSymbol(propType, propValue)) {
      return 'symbol';
    }
    return propType;
  }

  // This handles more types than `getPropType`. Only used for error messages.
  // See `createPrimitiveTypeChecker`.
  function getPreciseType(propValue) {
    if (typeof propValue === 'undefined' || propValue === null) {
      return '' + propValue;
    }
    var propType = getPropType(propValue);
    if (propType === 'object') {
      if (propValue instanceof Date) {
        return 'date';
      } else if (propValue instanceof RegExp) {
        return 'regexp';
      }
    }
    return propType;
  }

  // Returns a string that is postfixed to a warning about an invalid type.
  // For example, "undefined" or "of type array"
  function getPostfixForTypeWarning(value) {
    var type = getPreciseType(value);
    switch (type) {
      case 'array':
      case 'object':
        return 'an ' + type;
      case 'boolean':
      case 'date':
      case 'regexp':
        return 'a ' + type;
      default:
        return type;
    }
  }

  // Returns class name of the object, if any.
  function getClassName(propValue) {
    if (!propValue.constructor || !propValue.constructor.name) {
      return ANONYMOUS;
    }
    return propValue.constructor.name;
  }

  ReactPropTypes.checkPropTypes = checkPropTypes;
  ReactPropTypes.resetWarningCache = checkPropTypes.resetWarningCache;
  ReactPropTypes.PropTypes = ReactPropTypes;

  return ReactPropTypes;
};


/***/ }),

/***/ "./node_modules/prop-types/index.js":
/*!******************************************!*\
  !*** ./node_modules/prop-types/index.js ***!
  \******************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

if (true) {
  var ReactIs = __webpack_require__(/*! react-is */ "./node_modules/react-is/index.js");

  // By explicitly using `prop-types` you are opting into new development behavior.
  // http://fb.me/prop-types-in-prod
  var throwOnDirectAccess = true;
  module.exports = __webpack_require__(/*! ./factoryWithTypeCheckers */ "./node_modules/prop-types/factoryWithTypeCheckers.js")(ReactIs.isElement, throwOnDirectAccess);
} else {}


/***/ }),

/***/ "./node_modules/prop-types/lib/ReactPropTypesSecret.js":
/*!*************************************************************!*\
  !*** ./node_modules/prop-types/lib/ReactPropTypesSecret.js ***!
  \*************************************************************/
/***/ (function(module) {

"use strict";
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */



var ReactPropTypesSecret = 'SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED';

module.exports = ReactPropTypesSecret;


/***/ }),

/***/ "./node_modules/prop-types/lib/has.js":
/*!********************************************!*\
  !*** ./node_modules/prop-types/lib/has.js ***!
  \********************************************/
/***/ (function(module) {

module.exports = Function.call.bind(Object.prototype.hasOwnProperty);


/***/ }),

/***/ "./node_modules/react-dropdown-select/lib/components/Clear.js":
/*!********************************************************************!*\
  !*** ./node_modules/react-dropdown-select/lib/components/Clear.js ***!
  \********************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";
exports.__esModule=!0,exports["default"]=void 0;var _base=_interopRequireDefault(__webpack_require__(/*! @emotion/styled/base */ "./node_modules/react-dropdown-select/node_modules/@emotion/styled/base/dist/emotion-styled-base.browser.esm.js")),_react=_interopRequireDefault(__webpack_require__(/*! react */ "react")),_constants=__webpack_require__(/*! ../constants */ "./node_modules/react-dropdown-select/lib/constants.js");function _interopRequireDefault(a){return a&&a.__esModule?a:{default:a}}function _EMOTION_STRINGIFIED_CSS_ERROR__(){return"You have tried to stringify object returned from `css` function. It isn't supposed to be used directly (e.g. as value of the `className` prop), but rather handed to emotion so it can handle it (e.g. as value of `css` prop)."}var Clear=function(a){var b=a.props,c=a.state,d=a.methods;return b.clearRenderer?b.clearRenderer({props:b,state:c,methods:d}):_react.default.createElement(ClearComponent,{className:_constants.LIB_NAME+"-clear",tabIndex:"-1",onClick:function onClick(){return d.clearAll()},onKeyPress:function onKeyPress(){return d.clearAll()}},"\xD7")},ClearComponent=(0,_base.default)("div", false?0:{target:"e11qlq5e0",label:"ClearComponent"})( false?0:{name:"992gsg",styles:"line-height:25px;margin:0 10px;cursor:pointer;:focus{outline:none;}:hover{color:tomato;}",map:"/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb21wb25lbnRzL0NsZWFyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQWlCaUMiLCJmaWxlIjoiLi4vLi4vc3JjL2NvbXBvbmVudHMvQ2xlYXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IHN0eWxlZCBmcm9tICdAZW1vdGlvbi9zdHlsZWQnO1xuaW1wb3J0IHsgTElCX05BTUUgfSBmcm9tICcuLi9jb25zdGFudHMnO1xuXG5jb25zdCBDbGVhciA9ICh7IHByb3BzLCBzdGF0ZSwgbWV0aG9kcyB9KSA9PlxuICBwcm9wcy5jbGVhclJlbmRlcmVyID8gKFxuICAgIHByb3BzLmNsZWFyUmVuZGVyZXIoeyBwcm9wcywgc3RhdGUsIG1ldGhvZHMgfSlcbiAgKSA6IChcbiAgICA8Q2xlYXJDb21wb25lbnRcbiAgICAgIGNsYXNzTmFtZT17YCR7TElCX05BTUV9LWNsZWFyYH1cbiAgICAgIHRhYkluZGV4PVwiLTFcIlxuICAgICAgb25DbGljaz17KCkgPT4gbWV0aG9kcy5jbGVhckFsbCgpfVxuICAgICAgb25LZXlQcmVzcz17KCkgPT4gbWV0aG9kcy5jbGVhckFsbCgpfT5cbiAgICAgICZ0aW1lcztcbiAgICA8L0NsZWFyQ29tcG9uZW50PlxuICApO1xuXG5jb25zdCBDbGVhckNvbXBvbmVudCA9IHN0eWxlZC5kaXZgXG4gIGxpbmUtaGVpZ2h0OiAyNXB4O1xuICBtYXJnaW46IDAgMTBweDtcbiAgY3Vyc29yOiBwb2ludGVyO1xuXG4gIDpmb2N1cyB7XG4gICAgb3V0bGluZTogbm9uZTtcbiAgfVxuXG4gIDpob3ZlciB7XG4gICAgY29sb3I6IHRvbWF0bztcbiAgfVxuYDtcblxuZXhwb3J0IGRlZmF1bHQgQ2xlYXI7XG4iXX0= */",toString:_EMOTION_STRINGIFIED_CSS_ERROR__}),_default=Clear;exports["default"]=_default;

/***/ }),

/***/ "./node_modules/react-dropdown-select/lib/components/ClickOutside.js":
/*!***************************************************************************!*\
  !*** ./node_modules/react-dropdown-select/lib/components/ClickOutside.js ***!
  \***************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";
exports.__esModule=!0,exports["default"]=void 0;var _react=_interopRequireDefault(__webpack_require__(/*! react */ "react")),_propTypes=_interopRequireDefault(__webpack_require__(/*! prop-types */ "./node_modules/prop-types/index.js"));function _interopRequireDefault(a){return a&&a.__esModule?a:{default:a}}function _assertThisInitialized(a){if(void 0===a)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return a}function _inheritsLoose(a,b){a.prototype=Object.create(b.prototype),a.prototype.constructor=a,a.__proto__=b}function _defineProperty(a,b,c){return b in a?Object.defineProperty(a,b,{value:c,enumerable:!0,configurable:!0,writable:!0}):a[b]=c,a}var ClickOutside=/*#__PURE__*/function(a){function b(){for(var b,c=arguments.length,d=Array(c),e=0;e<c;e++)d[e]=arguments[e];return b=a.call.apply(a,[this].concat(d))||this,_defineProperty(_assertThisInitialized(b),"container",_react.default.createRef()),_defineProperty(_assertThisInitialized(b),"handleClick",function(a){var c=b.container.current,d=a.target,e=b.props.onClickOutside;(c&&c===d||c&&!c.contains(d))&&e(a)}),b}_inheritsLoose(b,a);var c=b.prototype;return c.componentDidMount=function componentDidMount(){document.addEventListener("click",this.handleClick,!0)},c.componentWillUnmount=function componentWillUnmount(){document.removeEventListener("click",this.handleClick,!0)},c.render=function render(){var a=this.props,b=a.className,c=a.children;return _react.default.createElement("div",{className:b,ref:this.container},c)},b}(_react.default.Component),_default=ClickOutside;exports["default"]=_default;

/***/ }),

/***/ "./node_modules/react-dropdown-select/lib/components/Content.js":
/*!**********************************************************************!*\
  !*** ./node_modules/react-dropdown-select/lib/components/Content.js ***!
  \**********************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";
exports.__esModule=!0,exports["default"]=void 0;var _base=_interopRequireDefault(__webpack_require__(/*! @emotion/styled/base */ "./node_modules/react-dropdown-select/node_modules/@emotion/styled/base/dist/emotion-styled-base.browser.esm.js")),_react=_interopRequireDefault(__webpack_require__(/*! react */ "react")),_Option=_interopRequireDefault(__webpack_require__(/*! ./Option */ "./node_modules/react-dropdown-select/lib/components/Option.js")),_Input=_interopRequireDefault(__webpack_require__(/*! ./Input */ "./node_modules/react-dropdown-select/lib/components/Input.js")),_constants=__webpack_require__(/*! ../constants */ "./node_modules/react-dropdown-select/lib/constants.js"),_util=__webpack_require__(/*! ../util */ "./node_modules/react-dropdown-select/lib/util.js");function _interopRequireDefault(a){return a&&a.__esModule?a:{default:a}}function _EMOTION_STRINGIFIED_CSS_ERROR__(){return"You have tried to stringify object returned from `css` function. It isn't supposed to be used directly (e.g. as value of the `className` prop), but rather handed to emotion so it can handle it (e.g. as value of `css` prop)."}var Content=function(a){var b=a.props,c=a.state,d=a.methods;return _react.default.createElement(ContentComponent,{className:_constants.LIB_NAME+"-content "+(b.multi?_constants.LIB_NAME+"-type-multi":_constants.LIB_NAME+"-type-single"),onClick:function onClick(a){a.stopPropagation(),d.dropDown("open")}},b.contentRenderer?b.contentRenderer({props:b,state:c,methods:d}):_react.default.createElement(_react.default.Fragment,null,b.multi?c.values&&c.values.map(function(a){return _react.default.createElement(_Option.default,{key:""+(0,_util.getByPath)(a,b.valueField)+(0,_util.getByPath)(a,b.labelField),item:a,state:c,props:b,methods:d})}):c.values&&0<c.values.length&&_react.default.createElement("span",null,(0,_util.getByPath)(c.values[0],b.labelField)),_react.default.createElement(_Input.default,{props:b,methods:d,state:c})))},ContentComponent=(0,_base.default)("div", false?0:{target:"e1gn6jc30",label:"ContentComponent"})( false?0:{name:"1m5113o",styles:"display:flex;flex:1;flex-wrap:wrap",map:"/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb21wb25lbnRzL0NvbnRlbnQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBMENtQyIsImZpbGUiOiIuLi8uLi9zcmMvY29tcG9uZW50cy9Db250ZW50LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCBzdHlsZWQgZnJvbSAnQGVtb3Rpb24vc3R5bGVkJztcblxuaW1wb3J0IE9wdGlvbiBmcm9tICcuL09wdGlvbic7XG5pbXBvcnQgSW5wdXQgZnJvbSAnLi9JbnB1dCc7XG5pbXBvcnQgeyBMSUJfTkFNRSB9IGZyb20gJy4uL2NvbnN0YW50cyc7XG5pbXBvcnQge2dldEJ5UGF0aH0gZnJvbSAnLi4vdXRpbCc7XG5cbmNvbnN0IENvbnRlbnQgPSAoeyBwcm9wcywgc3RhdGUsIG1ldGhvZHMgfSkgPT4ge1xuICByZXR1cm4gKFxuICAgIDxDb250ZW50Q29tcG9uZW50XG4gICAgICBjbGFzc05hbWU9e2Ake0xJQl9OQU1FfS1jb250ZW50ICR7XG4gICAgICAgIHByb3BzLm11bHRpID8gYCR7TElCX05BTUV9LXR5cGUtbXVsdGlgIDogYCR7TElCX05BTUV9LXR5cGUtc2luZ2xlYFxuICAgICAgfWB9XG4gICAgICBvbkNsaWNrPXsoZXZlbnQpID0+IHtcbiAgICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgIG1ldGhvZHMuZHJvcERvd24oJ29wZW4nKTtcbiAgICAgIH19PlxuICAgICAge3Byb3BzLmNvbnRlbnRSZW5kZXJlciA/IChcbiAgICAgICAgcHJvcHMuY29udGVudFJlbmRlcmVyKHsgcHJvcHMsIHN0YXRlLCBtZXRob2RzIH0pXG4gICAgICApIDogKFxuICAgICAgICA8UmVhY3QuRnJhZ21lbnQ+XG4gICAgICAgICAge3Byb3BzLm11bHRpXG4gICAgICAgICAgICA/IHN0YXRlLnZhbHVlcyAmJlxuICAgICAgICAgICAgICBzdGF0ZS52YWx1ZXMubWFwKChpdGVtKSA9PiAoXG4gICAgICAgICAgICAgICAgPE9wdGlvblxuICAgICAgICAgICAgICAgICAga2V5PXtgJHtnZXRCeVBhdGgoaXRlbSwgcHJvcHMudmFsdWVGaWVsZCl9JHtnZXRCeVBhdGgoaXRlbSwgcHJvcHMubGFiZWxGaWVsZCl9YH1cbiAgICAgICAgICAgICAgICAgIGl0ZW09e2l0ZW19XG4gICAgICAgICAgICAgICAgICBzdGF0ZT17c3RhdGV9XG4gICAgICAgICAgICAgICAgICBwcm9wcz17cHJvcHN9XG4gICAgICAgICAgICAgICAgICBtZXRob2RzPXttZXRob2RzfVxuICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgICkpXG4gICAgICAgICAgICA6IHN0YXRlLnZhbHVlcyAmJlxuICAgICAgICAgICAgICBzdGF0ZS52YWx1ZXMubGVuZ3RoID4gMCAmJiA8c3Bhbj57Z2V0QnlQYXRoKHN0YXRlLnZhbHVlc1swXSwgcHJvcHMubGFiZWxGaWVsZCl9PC9zcGFuPn1cbiAgICAgICAgICA8SW5wdXQgcHJvcHM9e3Byb3BzfSBtZXRob2RzPXttZXRob2RzfSBzdGF0ZT17c3RhdGV9IC8+XG4gICAgICAgIDwvUmVhY3QuRnJhZ21lbnQ+XG4gICAgICApfVxuICAgIDwvQ29udGVudENvbXBvbmVudD5cbiAgKTtcbn07XG5cbmNvbnN0IENvbnRlbnRDb21wb25lbnQgPSBzdHlsZWQuZGl2YFxuICBkaXNwbGF5OiBmbGV4O1xuICBmbGV4OiAxO1xuICBmbGV4LXdyYXA6IHdyYXA7XG5gO1xuXG5leHBvcnQgZGVmYXVsdCBDb250ZW50O1xuIl19 */",toString:_EMOTION_STRINGIFIED_CSS_ERROR__}),_default=Content;exports["default"]=_default;

/***/ }),

/***/ "./node_modules/react-dropdown-select/lib/components/Dropdown.js":
/*!***********************************************************************!*\
  !*** ./node_modules/react-dropdown-select/lib/components/Dropdown.js ***!
  \***********************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";
exports.__esModule=!0,exports["default"]=void 0;var _base=_interopRequireDefault(__webpack_require__(/*! @emotion/styled/base */ "./node_modules/react-dropdown-select/node_modules/@emotion/styled/base/dist/emotion-styled-base.browser.esm.js")),_react=_interopRequireDefault(__webpack_require__(/*! react */ "react")),_constants=__webpack_require__(/*! ../constants */ "./node_modules/react-dropdown-select/lib/constants.js"),_NoData=_interopRequireDefault(__webpack_require__(/*! ../components/NoData */ "./node_modules/react-dropdown-select/lib/components/NoData.js")),_Item=_interopRequireDefault(__webpack_require__(/*! ../components/Item */ "./node_modules/react-dropdown-select/lib/components/Item.js")),_util=__webpack_require__(/*! ../util */ "./node_modules/react-dropdown-select/lib/util.js");function _interopRequireDefault(a){return a&&a.__esModule?a:{default:a}}var dropdownPosition=function(a,b){var c=b.getSelectRef().getBoundingClientRect(),d=c.bottom+parseInt(a.dropdownHeight,10)+parseInt(a.dropdownGap,10);return"auto"===a.dropdownPosition?d>(0,_util.isomorphicWindow)().innerHeight&&d>c.top?"top":"bottom":a.dropdownPosition},Dropdown=function(a){var b=a.props,c=a.state,d=a.methods;return _react.default.createElement(DropDown,{tabIndex:"-1","aria-expanded":"true",role:"list",dropdownPosition:dropdownPosition(b,d),selectBounds:c.selectBounds,portal:b.portal,dropdownGap:b.dropdownGap,dropdownHeight:b.dropdownHeight,className:_constants.LIB_NAME+"-dropdown "+_constants.LIB_NAME+"-dropdown-position-"+dropdownPosition(b,d)},b.dropdownRenderer?b.dropdownRenderer({props:b,state:c,methods:d}):_react.default.createElement(_react.default.Fragment,null,b.create&&c.search&&!(0,_util.valueExistInSelected)(c.search,[].concat(c.values,b.options),b)&&_react.default.createElement(AddNew,{role:"button",className:_constants.LIB_NAME+"-dropdown-add-new",color:b.color,onClick:function onClick(){return d.createNew(c.search)}},b.createNewLabel.replace("{search}","\""+c.search+"\"")),0===c.searchResults.length?_react.default.createElement(_NoData.default,{className:_constants.LIB_NAME+"-no-data",state:c,props:b,methods:d}):c.searchResults.map(function(a,e){return _react.default.createElement(_Item.default,{key:a[b.valueField].toString(),item:a,itemIndex:e,state:c,props:b,methods:d})})))},DropDown=(0,_base.default)("div", false?0:{target:"e1qjn9k91",label:"DropDown"})("position:absolute;",function(a){var b=a.selectBounds,c=a.dropdownGap,d=a.dropdownPosition;return"top"===d?"bottom: "+(b.height+2+c)+"px":"top: "+(b.height+2+c)+"px"},";",function(a){var b=a.selectBounds,c=a.dropdownGap,d=a.dropdownPosition,e=a.portal;return e?"\n      position: fixed;\n      "+("bottom"===d?"top: "+(b.bottom+c)+"px;":"bottom: "+((0,_util.isomorphicWindow)().innerHeight-b.top+c)+"px;")+"\n      left: "+(b.left-1)+"px;":"left: -1px;"},";border:1px solid #ccc;width:",function(a){var b=a.selectBounds;return b.width},"px;padding:0;display:flex;flex-direction:column;background:#fff;border-radius:2px;box-shadow:0 0 10px 0 ",function(){return(0,_util.hexToRGBA)("#000000",.2)},";max-height:",function(a){var b=a.dropdownHeight;return b},";overflow:auto;z-index:9;:focus{outline:none;}"+( false?0:"/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb21wb25lbnRzL0Ryb3Bkb3duLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQTZFMkIiLCJmaWxlIjoiLi4vLi4vc3JjL2NvbXBvbmVudHMvRHJvcGRvd24uanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IHN0eWxlZCBmcm9tICdAZW1vdGlvbi9zdHlsZWQnO1xuXG5pbXBvcnQgeyBMSUJfTkFNRSB9IGZyb20gJy4uL2NvbnN0YW50cyc7XG5pbXBvcnQgTm9EYXRhIGZyb20gJy4uL2NvbXBvbmVudHMvTm9EYXRhJztcbmltcG9ydCBJdGVtIGZyb20gJy4uL2NvbXBvbmVudHMvSXRlbSc7XG5cbmltcG9ydCB7IHZhbHVlRXhpc3RJblNlbGVjdGVkLCBoZXhUb1JHQkEsIGlzb21vcnBoaWNXaW5kb3cgfSBmcm9tICcuLi91dGlsJztcblxuY29uc3QgZHJvcGRvd25Qb3NpdGlvbiA9IChwcm9wcywgbWV0aG9kcykgPT4ge1xuICBjb25zdCBEcm9wZG93bkJvdW5kaW5nQ2xpZW50UmVjdCA9IG1ldGhvZHMuZ2V0U2VsZWN0UmVmKCkuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gIGNvbnN0IGRyb3Bkb3duSGVpZ2h0ID1cbiAgICBEcm9wZG93bkJvdW5kaW5nQ2xpZW50UmVjdC5ib3R0b20gKyBwYXJzZUludChwcm9wcy5kcm9wZG93bkhlaWdodCwgMTApICsgcGFyc2VJbnQocHJvcHMuZHJvcGRvd25HYXAsIDEwKTtcblxuICBpZiAocHJvcHMuZHJvcGRvd25Qb3NpdGlvbiAhPT0gJ2F1dG8nKSB7XG4gICAgcmV0dXJuIHByb3BzLmRyb3Bkb3duUG9zaXRpb247XG4gIH1cblxuICBpZiAoZHJvcGRvd25IZWlnaHQgPiBpc29tb3JwaGljV2luZG93KCkuaW5uZXJIZWlnaHQgJiYgZHJvcGRvd25IZWlnaHQgPiBEcm9wZG93bkJvdW5kaW5nQ2xpZW50UmVjdC50b3ApIHtcbiAgICByZXR1cm4gJ3RvcCc7XG4gIH1cblxuICByZXR1cm4gJ2JvdHRvbSc7XG59O1xuXG5jb25zdCBEcm9wZG93biA9ICh7IHByb3BzLCBzdGF0ZSwgbWV0aG9kcyB9KSA9PiAoXG4gIDxEcm9wRG93blxuICAgIHRhYkluZGV4PVwiLTFcIlxuICAgIGFyaWEtZXhwYW5kZWQ9XCJ0cnVlXCJcbiAgICByb2xlPVwibGlzdFwiXG4gICAgZHJvcGRvd25Qb3NpdGlvbj17ZHJvcGRvd25Qb3NpdGlvbihwcm9wcywgbWV0aG9kcyl9XG4gICAgc2VsZWN0Qm91bmRzPXtzdGF0ZS5zZWxlY3RCb3VuZHN9XG4gICAgcG9ydGFsPXtwcm9wcy5wb3J0YWx9XG4gICAgZHJvcGRvd25HYXA9e3Byb3BzLmRyb3Bkb3duR2FwfVxuICAgIGRyb3Bkb3duSGVpZ2h0PXtwcm9wcy5kcm9wZG93bkhlaWdodH1cbiAgICBjbGFzc05hbWU9e2Ake0xJQl9OQU1FfS1kcm9wZG93biAke0xJQl9OQU1FfS1kcm9wZG93bi1wb3NpdGlvbi0ke2Ryb3Bkb3duUG9zaXRpb24oXG4gICAgICBwcm9wcyxcbiAgICAgIG1ldGhvZHNcbiAgICApfWB9PlxuICAgIHtwcm9wcy5kcm9wZG93blJlbmRlcmVyID8gKFxuICAgICAgcHJvcHMuZHJvcGRvd25SZW5kZXJlcih7IHByb3BzLCBzdGF0ZSwgbWV0aG9kcyB9KVxuICAgICkgOiAoXG4gICAgICA8UmVhY3QuRnJhZ21lbnQ+XG4gICAgICAgIHtwcm9wcy5jcmVhdGUgJiYgc3RhdGUuc2VhcmNoICYmICF2YWx1ZUV4aXN0SW5TZWxlY3RlZChzdGF0ZS5zZWFyY2gsIFsuLi5zdGF0ZS52YWx1ZXMsIC4uLnByb3BzLm9wdGlvbnNdLCBwcm9wcykgJiYgKFxuICAgICAgICAgIDxBZGROZXdcbiAgICAgICAgICAgIHJvbGU9XCJidXR0b25cIlxuICAgICAgICAgICAgY2xhc3NOYW1lPXtgJHtMSUJfTkFNRX0tZHJvcGRvd24tYWRkLW5ld2B9XG4gICAgICAgICAgICBjb2xvcj17cHJvcHMuY29sb3J9XG4gICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiBtZXRob2RzLmNyZWF0ZU5ldyhzdGF0ZS5zZWFyY2gpfT5cbiAgICAgICAgICAgIHtwcm9wcy5jcmVhdGVOZXdMYWJlbC5yZXBsYWNlKCd7c2VhcmNofScsIGBcIiR7c3RhdGUuc2VhcmNofVwiYCl9XG4gICAgICAgICAgPC9BZGROZXc+XG4gICAgICAgICl9XG4gICAgICAgIHtzdGF0ZS5zZWFyY2hSZXN1bHRzLmxlbmd0aCA9PT0gMCA/IChcbiAgICAgICAgICA8Tm9EYXRhXG4gICAgICAgICAgICBjbGFzc05hbWU9e2Ake0xJQl9OQU1FfS1uby1kYXRhYH1cbiAgICAgICAgICAgIHN0YXRlPXtzdGF0ZX1cbiAgICAgICAgICAgIHByb3BzPXtwcm9wc31cbiAgICAgICAgICAgIG1ldGhvZHM9e21ldGhvZHN9XG4gICAgICAgICAgLz5cbiAgICAgICAgKSA6IChcbiAgICAgICAgICAgIHN0YXRlLnNlYXJjaFJlc3VsdHNcbiAgICAgICAgICAgICAgLm1hcCgoaXRlbSwgaXRlbUluZGV4KSA9PiAoXG4gICAgICAgICAgICAgICAgPEl0ZW1cbiAgICAgICAgICAgICAgICAgIGtleT17aXRlbVtwcm9wcy52YWx1ZUZpZWxkXS50b1N0cmluZygpfVxuICAgICAgICAgICAgICAgICAgaXRlbT17aXRlbX1cbiAgICAgICAgICAgICAgICAgIGl0ZW1JbmRleD17aXRlbUluZGV4fVxuICAgICAgICAgICAgICAgICAgc3RhdGU9e3N0YXRlfVxuICAgICAgICAgICAgICAgICAgcHJvcHM9e3Byb3BzfVxuICAgICAgICAgICAgICAgICAgbWV0aG9kcz17bWV0aG9kc31cbiAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICApKVxuICAgICAgICAgICl9XG4gICAgICA8L1JlYWN0LkZyYWdtZW50PlxuICAgICl9XG4gIDwvRHJvcERvd24+XG4pO1xuXG5jb25zdCBEcm9wRG93biA9IHN0eWxlZC5kaXZgXG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgJHsoeyBzZWxlY3RCb3VuZHMsIGRyb3Bkb3duR2FwLCBkcm9wZG93blBvc2l0aW9uIH0pID0+XG4gICAgZHJvcGRvd25Qb3NpdGlvbiA9PT0gJ3RvcCdcbiAgICAgID8gYGJvdHRvbTogJHtzZWxlY3RCb3VuZHMuaGVpZ2h0ICsgMiArIGRyb3Bkb3duR2FwfXB4YFxuICAgICAgOiBgdG9wOiAke3NlbGVjdEJvdW5kcy5oZWlnaHQgKyAyICsgZHJvcGRvd25HYXB9cHhgfTtcblxuICAkeyh7IHNlbGVjdEJvdW5kcywgZHJvcGRvd25HYXAsIGRyb3Bkb3duUG9zaXRpb24sIHBvcnRhbCB9KSA9PlxuICAgIHBvcnRhbFxuICAgICAgPyBgXG4gICAgICBwb3NpdGlvbjogZml4ZWQ7XG4gICAgICAke2Ryb3Bkb3duUG9zaXRpb24gPT09ICdib3R0b20nID8gYHRvcDogJHtzZWxlY3RCb3VuZHMuYm90dG9tICsgZHJvcGRvd25HYXB9cHg7YCA6IGBib3R0b206ICR7aXNvbW9ycGhpY1dpbmRvdygpLmlubmVySGVpZ2h0IC0gc2VsZWN0Qm91bmRzLnRvcCArIGRyb3Bkb3duR2FwfXB4O2B9XG4gICAgICBsZWZ0OiAke3NlbGVjdEJvdW5kcy5sZWZ0IC0gMX1weDtgXG4gICAgICA6ICdsZWZ0OiAtMXB4Oyd9O1xuICBib3JkZXI6IDFweCBzb2xpZCAjY2NjO1xuICB3aWR0aDogJHsoeyBzZWxlY3RCb3VuZHMgfSkgPT4gc2VsZWN0Qm91bmRzLndpZHRofXB4O1xuICBwYWRkaW5nOiAwO1xuICBkaXNwbGF5OiBmbGV4O1xuICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xuICBiYWNrZ3JvdW5kOiAjZmZmO1xuICBib3JkZXItcmFkaXVzOiAycHg7XG4gIGJveC1zaGFkb3c6IDAgMCAxMHB4IDAgJHsoKSA9PiBoZXhUb1JHQkEoJyMwMDAwMDAnLCAwLjIpfTtcbiAgbWF4LWhlaWdodDogJHsoeyBkcm9wZG93bkhlaWdodCB9KSA9PiBkcm9wZG93bkhlaWdodH07XG4gIG92ZXJmbG93OiBhdXRvO1xuICB6LWluZGV4OiA5O1xuXG4gIDpmb2N1cyB7XG4gICAgb3V0bGluZTogbm9uZTtcbiAgfVxufVxuYDtcblxuY29uc3QgQWRkTmV3ID0gc3R5bGVkLmRpdmBcbiAgY29sb3I6ICR7KHsgY29sb3IgfSkgPT4gY29sb3J9O1xuICBwYWRkaW5nOiA1cHggMTBweDtcblxuICA6aG92ZXIge1xuICAgIGJhY2tncm91bmQ6ICR7KHsgY29sb3IgfSkgPT4gY29sb3IgJiYgaGV4VG9SR0JBKGNvbG9yLCAwLjEpfTtcbiAgICBvdXRsaW5lOiBub25lO1xuICAgIGN1cnNvcjogcG9pbnRlcjtcbiAgfVxuYDtcblxuZXhwb3J0IGRlZmF1bHQgRHJvcGRvd247XG4iXX0= */")),AddNew=(0,_base.default)("div", false?0:{target:"e1qjn9k90",label:"AddNew"})("color:",function(a){var b=a.color;return b},";padding:5px 10px;:hover{background:",function(a){var b=a.color;return b&&(0,_util.hexToRGBA)(b,.1)},";outline:none;cursor:pointer;}"+( false?0:"/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb21wb25lbnRzL0Ryb3Bkb3duLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQTZHeUIiLCJmaWxlIjoiLi4vLi4vc3JjL2NvbXBvbmVudHMvRHJvcGRvd24uanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IHN0eWxlZCBmcm9tICdAZW1vdGlvbi9zdHlsZWQnO1xuXG5pbXBvcnQgeyBMSUJfTkFNRSB9IGZyb20gJy4uL2NvbnN0YW50cyc7XG5pbXBvcnQgTm9EYXRhIGZyb20gJy4uL2NvbXBvbmVudHMvTm9EYXRhJztcbmltcG9ydCBJdGVtIGZyb20gJy4uL2NvbXBvbmVudHMvSXRlbSc7XG5cbmltcG9ydCB7IHZhbHVlRXhpc3RJblNlbGVjdGVkLCBoZXhUb1JHQkEsIGlzb21vcnBoaWNXaW5kb3cgfSBmcm9tICcuLi91dGlsJztcblxuY29uc3QgZHJvcGRvd25Qb3NpdGlvbiA9IChwcm9wcywgbWV0aG9kcykgPT4ge1xuICBjb25zdCBEcm9wZG93bkJvdW5kaW5nQ2xpZW50UmVjdCA9IG1ldGhvZHMuZ2V0U2VsZWN0UmVmKCkuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gIGNvbnN0IGRyb3Bkb3duSGVpZ2h0ID1cbiAgICBEcm9wZG93bkJvdW5kaW5nQ2xpZW50UmVjdC5ib3R0b20gKyBwYXJzZUludChwcm9wcy5kcm9wZG93bkhlaWdodCwgMTApICsgcGFyc2VJbnQocHJvcHMuZHJvcGRvd25HYXAsIDEwKTtcblxuICBpZiAocHJvcHMuZHJvcGRvd25Qb3NpdGlvbiAhPT0gJ2F1dG8nKSB7XG4gICAgcmV0dXJuIHByb3BzLmRyb3Bkb3duUG9zaXRpb247XG4gIH1cblxuICBpZiAoZHJvcGRvd25IZWlnaHQgPiBpc29tb3JwaGljV2luZG93KCkuaW5uZXJIZWlnaHQgJiYgZHJvcGRvd25IZWlnaHQgPiBEcm9wZG93bkJvdW5kaW5nQ2xpZW50UmVjdC50b3ApIHtcbiAgICByZXR1cm4gJ3RvcCc7XG4gIH1cblxuICByZXR1cm4gJ2JvdHRvbSc7XG59O1xuXG5jb25zdCBEcm9wZG93biA9ICh7IHByb3BzLCBzdGF0ZSwgbWV0aG9kcyB9KSA9PiAoXG4gIDxEcm9wRG93blxuICAgIHRhYkluZGV4PVwiLTFcIlxuICAgIGFyaWEtZXhwYW5kZWQ9XCJ0cnVlXCJcbiAgICByb2xlPVwibGlzdFwiXG4gICAgZHJvcGRvd25Qb3NpdGlvbj17ZHJvcGRvd25Qb3NpdGlvbihwcm9wcywgbWV0aG9kcyl9XG4gICAgc2VsZWN0Qm91bmRzPXtzdGF0ZS5zZWxlY3RCb3VuZHN9XG4gICAgcG9ydGFsPXtwcm9wcy5wb3J0YWx9XG4gICAgZHJvcGRvd25HYXA9e3Byb3BzLmRyb3Bkb3duR2FwfVxuICAgIGRyb3Bkb3duSGVpZ2h0PXtwcm9wcy5kcm9wZG93bkhlaWdodH1cbiAgICBjbGFzc05hbWU9e2Ake0xJQl9OQU1FfS1kcm9wZG93biAke0xJQl9OQU1FfS1kcm9wZG93bi1wb3NpdGlvbi0ke2Ryb3Bkb3duUG9zaXRpb24oXG4gICAgICBwcm9wcyxcbiAgICAgIG1ldGhvZHNcbiAgICApfWB9PlxuICAgIHtwcm9wcy5kcm9wZG93blJlbmRlcmVyID8gKFxuICAgICAgcHJvcHMuZHJvcGRvd25SZW5kZXJlcih7IHByb3BzLCBzdGF0ZSwgbWV0aG9kcyB9KVxuICAgICkgOiAoXG4gICAgICA8UmVhY3QuRnJhZ21lbnQ+XG4gICAgICAgIHtwcm9wcy5jcmVhdGUgJiYgc3RhdGUuc2VhcmNoICYmICF2YWx1ZUV4aXN0SW5TZWxlY3RlZChzdGF0ZS5zZWFyY2gsIFsuLi5zdGF0ZS52YWx1ZXMsIC4uLnByb3BzLm9wdGlvbnNdLCBwcm9wcykgJiYgKFxuICAgICAgICAgIDxBZGROZXdcbiAgICAgICAgICAgIHJvbGU9XCJidXR0b25cIlxuICAgICAgICAgICAgY2xhc3NOYW1lPXtgJHtMSUJfTkFNRX0tZHJvcGRvd24tYWRkLW5ld2B9XG4gICAgICAgICAgICBjb2xvcj17cHJvcHMuY29sb3J9XG4gICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiBtZXRob2RzLmNyZWF0ZU5ldyhzdGF0ZS5zZWFyY2gpfT5cbiAgICAgICAgICAgIHtwcm9wcy5jcmVhdGVOZXdMYWJlbC5yZXBsYWNlKCd7c2VhcmNofScsIGBcIiR7c3RhdGUuc2VhcmNofVwiYCl9XG4gICAgICAgICAgPC9BZGROZXc+XG4gICAgICAgICl9XG4gICAgICAgIHtzdGF0ZS5zZWFyY2hSZXN1bHRzLmxlbmd0aCA9PT0gMCA/IChcbiAgICAgICAgICA8Tm9EYXRhXG4gICAgICAgICAgICBjbGFzc05hbWU9e2Ake0xJQl9OQU1FfS1uby1kYXRhYH1cbiAgICAgICAgICAgIHN0YXRlPXtzdGF0ZX1cbiAgICAgICAgICAgIHByb3BzPXtwcm9wc31cbiAgICAgICAgICAgIG1ldGhvZHM9e21ldGhvZHN9XG4gICAgICAgICAgLz5cbiAgICAgICAgKSA6IChcbiAgICAgICAgICAgIHN0YXRlLnNlYXJjaFJlc3VsdHNcbiAgICAgICAgICAgICAgLm1hcCgoaXRlbSwgaXRlbUluZGV4KSA9PiAoXG4gICAgICAgICAgICAgICAgPEl0ZW1cbiAgICAgICAgICAgICAgICAgIGtleT17aXRlbVtwcm9wcy52YWx1ZUZpZWxkXS50b1N0cmluZygpfVxuICAgICAgICAgICAgICAgICAgaXRlbT17aXRlbX1cbiAgICAgICAgICAgICAgICAgIGl0ZW1JbmRleD17aXRlbUluZGV4fVxuICAgICAgICAgICAgICAgICAgc3RhdGU9e3N0YXRlfVxuICAgICAgICAgICAgICAgICAgcHJvcHM9e3Byb3BzfVxuICAgICAgICAgICAgICAgICAgbWV0aG9kcz17bWV0aG9kc31cbiAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICApKVxuICAgICAgICAgICl9XG4gICAgICA8L1JlYWN0LkZyYWdtZW50PlxuICAgICl9XG4gIDwvRHJvcERvd24+XG4pO1xuXG5jb25zdCBEcm9wRG93biA9IHN0eWxlZC5kaXZgXG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgJHsoeyBzZWxlY3RCb3VuZHMsIGRyb3Bkb3duR2FwLCBkcm9wZG93blBvc2l0aW9uIH0pID0+XG4gICAgZHJvcGRvd25Qb3NpdGlvbiA9PT0gJ3RvcCdcbiAgICAgID8gYGJvdHRvbTogJHtzZWxlY3RCb3VuZHMuaGVpZ2h0ICsgMiArIGRyb3Bkb3duR2FwfXB4YFxuICAgICAgOiBgdG9wOiAke3NlbGVjdEJvdW5kcy5oZWlnaHQgKyAyICsgZHJvcGRvd25HYXB9cHhgfTtcblxuICAkeyh7IHNlbGVjdEJvdW5kcywgZHJvcGRvd25HYXAsIGRyb3Bkb3duUG9zaXRpb24sIHBvcnRhbCB9KSA9PlxuICAgIHBvcnRhbFxuICAgICAgPyBgXG4gICAgICBwb3NpdGlvbjogZml4ZWQ7XG4gICAgICAke2Ryb3Bkb3duUG9zaXRpb24gPT09ICdib3R0b20nID8gYHRvcDogJHtzZWxlY3RCb3VuZHMuYm90dG9tICsgZHJvcGRvd25HYXB9cHg7YCA6IGBib3R0b206ICR7aXNvbW9ycGhpY1dpbmRvdygpLmlubmVySGVpZ2h0IC0gc2VsZWN0Qm91bmRzLnRvcCArIGRyb3Bkb3duR2FwfXB4O2B9XG4gICAgICBsZWZ0OiAke3NlbGVjdEJvdW5kcy5sZWZ0IC0gMX1weDtgXG4gICAgICA6ICdsZWZ0OiAtMXB4Oyd9O1xuICBib3JkZXI6IDFweCBzb2xpZCAjY2NjO1xuICB3aWR0aDogJHsoeyBzZWxlY3RCb3VuZHMgfSkgPT4gc2VsZWN0Qm91bmRzLndpZHRofXB4O1xuICBwYWRkaW5nOiAwO1xuICBkaXNwbGF5OiBmbGV4O1xuICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xuICBiYWNrZ3JvdW5kOiAjZmZmO1xuICBib3JkZXItcmFkaXVzOiAycHg7XG4gIGJveC1zaGFkb3c6IDAgMCAxMHB4IDAgJHsoKSA9PiBoZXhUb1JHQkEoJyMwMDAwMDAnLCAwLjIpfTtcbiAgbWF4LWhlaWdodDogJHsoeyBkcm9wZG93bkhlaWdodCB9KSA9PiBkcm9wZG93bkhlaWdodH07XG4gIG92ZXJmbG93OiBhdXRvO1xuICB6LWluZGV4OiA5O1xuXG4gIDpmb2N1cyB7XG4gICAgb3V0bGluZTogbm9uZTtcbiAgfVxufVxuYDtcblxuY29uc3QgQWRkTmV3ID0gc3R5bGVkLmRpdmBcbiAgY29sb3I6ICR7KHsgY29sb3IgfSkgPT4gY29sb3J9O1xuICBwYWRkaW5nOiA1cHggMTBweDtcblxuICA6aG92ZXIge1xuICAgIGJhY2tncm91bmQ6ICR7KHsgY29sb3IgfSkgPT4gY29sb3IgJiYgaGV4VG9SR0JBKGNvbG9yLCAwLjEpfTtcbiAgICBvdXRsaW5lOiBub25lO1xuICAgIGN1cnNvcjogcG9pbnRlcjtcbiAgfVxuYDtcblxuZXhwb3J0IGRlZmF1bHQgRHJvcGRvd247XG4iXX0= */")),_default=Dropdown;exports["default"]=_default;

/***/ }),

/***/ "./node_modules/react-dropdown-select/lib/components/DropdownHandle.js":
/*!*****************************************************************************!*\
  !*** ./node_modules/react-dropdown-select/lib/components/DropdownHandle.js ***!
  \*****************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";
exports.__esModule=!0,exports["default"]=void 0;var _base=_interopRequireDefault(__webpack_require__(/*! @emotion/styled/base */ "./node_modules/react-dropdown-select/node_modules/@emotion/styled/base/dist/emotion-styled-base.browser.esm.js")),_react=_interopRequireDefault(__webpack_require__(/*! react */ "react")),_constants=__webpack_require__(/*! ../constants */ "./node_modules/react-dropdown-select/lib/constants.js");function _interopRequireDefault(a){return a&&a.__esModule?a:{default:a}}var DropdownHandle=function(a){var b=a.props,c=a.state,d=a.methods;return _react.default.createElement(DropdownHandleComponent,{tabIndex:"-1",onClick:function onClick(a){return d.dropDown(c.dropdown?"close":"open",a)},dropdownOpen:c.dropdown,onKeyPress:function onKeyPress(a){return d.dropDown("toggle",a)},onKeyDown:function onKeyDown(a){return d.dropDown("toggle",a)},className:_constants.LIB_NAME+"-dropdown-handle",rotate:b.dropdownHandleRenderer?0:1,color:b.color},b.dropdownHandleRenderer?b.dropdownHandleRenderer({props:b,state:c,methods:d}):_react.default.createElement("svg",{fill:"currentColor",viewBox:"0 0 40 40"},_react.default.createElement("path",{d:"M31 26.4q0 .3-.2.5l-1.1 1.2q-.3.2-.6.2t-.5-.2l-8.7-8.8-8.8 8.8q-.2.2-.5.2t-.5-.2l-1.2-1.2q-.2-.2-.2-.5t.2-.5l10.4-10.4q.3-.2.6-.2t.5.2l10.4 10.4q.2.2.2.5z"})))},DropdownHandleComponent=(0,_base.default)("div", false?0:{target:"e1vudypg0",label:"DropdownHandleComponent"})("text-align:center;",function(a){var b=a.dropdownOpen,c=a.rotate;return b?"\n      pointer-events: all;\n      "+(c?"transform: rotate(0deg);margin: 0px 0 -3px 5px;":"")+"\n      ":"\n      pointer-events: none;\n      "+(c?"margin: 0 0 0 5px;transform: rotate(180deg);":"")+"\n      "},";cursor:pointer;svg{width:16px;height:16px;}:hover{path{stroke:",function(a){var b=a.color;return b},";}}:focus{outline:none;path{stroke:",function(a){var b=a.color;return b},";}}"+( false?0:"/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb21wb25lbnRzL0Ryb3Bkb3duSGFuZGxlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQXdCMEMiLCJmaWxlIjoiLi4vLi4vc3JjL2NvbXBvbmVudHMvRHJvcGRvd25IYW5kbGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IHN0eWxlZCBmcm9tICdAZW1vdGlvbi9zdHlsZWQnO1xuaW1wb3J0IHsgTElCX05BTUUgfSBmcm9tICcuLi9jb25zdGFudHMnO1xuXG5jb25zdCBEcm9wZG93bkhhbmRsZSA9ICh7IHByb3BzLCBzdGF0ZSwgbWV0aG9kcyB9KSA9PiAoXG4gIDxEcm9wZG93bkhhbmRsZUNvbXBvbmVudFxuICAgIHRhYkluZGV4PVwiLTFcIlxuICAgIG9uQ2xpY2s9eyhldmVudCkgPT4gbWV0aG9kcy5kcm9wRG93bihzdGF0ZS5kcm9wZG93biA/ICdjbG9zZScgOiAnb3BlbicsIGV2ZW50KX1cbiAgICBkcm9wZG93bk9wZW49e3N0YXRlLmRyb3Bkb3dufVxuICAgIG9uS2V5UHJlc3M9eyhldmVudCkgPT4gbWV0aG9kcy5kcm9wRG93bigndG9nZ2xlJywgZXZlbnQpfVxuICAgIG9uS2V5RG93bj17KGV2ZW50KSA9PiBtZXRob2RzLmRyb3BEb3duKCd0b2dnbGUnLCBldmVudCl9XG4gICAgY2xhc3NOYW1lPXtgJHtMSUJfTkFNRX0tZHJvcGRvd24taGFuZGxlYH1cbiAgICByb3RhdGU9e3Byb3BzLmRyb3Bkb3duSGFuZGxlUmVuZGVyZXIgPyAwIDogMX1cbiAgICBjb2xvcj17cHJvcHMuY29sb3J9PlxuICAgIHtwcm9wcy5kcm9wZG93bkhhbmRsZVJlbmRlcmVyID8gKFxuICAgICAgcHJvcHMuZHJvcGRvd25IYW5kbGVSZW5kZXJlcih7IHByb3BzLCBzdGF0ZSwgbWV0aG9kcyB9KVxuICAgICkgOiAoXG4gICAgICA8c3ZnIGZpbGw9XCJjdXJyZW50Q29sb3JcIiB2aWV3Qm94PVwiMCAwIDQwIDQwXCI+XG4gICAgICAgIDxwYXRoIGQ9XCJNMzEgMjYuNHEwIC4zLS4yLjVsLTEuMSAxLjJxLS4zLjItLjYuMnQtLjUtLjJsLTguNy04LjgtOC44IDguOHEtLjIuMi0uNS4ydC0uNS0uMmwtMS4yLTEuMnEtLjItLjItLjItLjV0LjItLjVsMTAuNC0xMC40cS4zLS4yLjYtLjJ0LjUuMmwxMC40IDEwLjRxLjIuMi4yLjV6XCIgLz5cbiAgICAgIDwvc3ZnPlxuICAgICl9XG4gIDwvRHJvcGRvd25IYW5kbGVDb21wb25lbnQ+XG4pO1xuXG5jb25zdCBEcm9wZG93bkhhbmRsZUNvbXBvbmVudCA9IHN0eWxlZC5kaXZgXG4gIHRleHQtYWxpZ246IGNlbnRlcjtcbiAgJHsoeyBkcm9wZG93bk9wZW4sIHJvdGF0ZSB9KSA9PlxuICAgIGRyb3Bkb3duT3BlblxuICAgICAgPyBgXG4gICAgICBwb2ludGVyLWV2ZW50czogYWxsO1xuICAgICAgJHtyb3RhdGUgPyAndHJhbnNmb3JtOiByb3RhdGUoMGRlZyk7bWFyZ2luOiAwcHggMCAtM3B4IDVweDsnIDogJyd9XG4gICAgICBgXG4gICAgICA6IGBcbiAgICAgIHBvaW50ZXItZXZlbnRzOiBub25lO1xuICAgICAgJHtyb3RhdGUgPyAnbWFyZ2luOiAwIDAgMCA1cHg7dHJhbnNmb3JtOiByb3RhdGUoMTgwZGVnKTsnIDogJyd9XG4gICAgICBgfTtcbiAgY3Vyc29yOiBwb2ludGVyO1xuXG4gIHN2ZyB7XG4gICAgd2lkdGg6IDE2cHg7XG4gICAgaGVpZ2h0OiAxNnB4O1xuICB9XG5cbiAgOmhvdmVyIHtcbiAgICBwYXRoIHtcbiAgICAgIHN0cm9rZTogJHsoeyBjb2xvciB9KSA9PiBjb2xvcn07XG4gICAgfVxuICB9XG5cbiAgOmZvY3VzIHtcbiAgICBvdXRsaW5lOiBub25lO1xuXG4gICAgcGF0aCB7XG4gICAgICBzdHJva2U6ICR7KHsgY29sb3IgfSkgPT4gY29sb3J9O1xuICAgIH1cbiAgfVxuYDtcblxuZXhwb3J0IGRlZmF1bHQgRHJvcGRvd25IYW5kbGU7XG4iXX0= */")),_default=DropdownHandle;exports["default"]=_default;

/***/ }),

/***/ "./node_modules/react-dropdown-select/lib/components/Input.js":
/*!********************************************************************!*\
  !*** ./node_modules/react-dropdown-select/lib/components/Input.js ***!
  \********************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";
exports.__esModule=!0,exports["default"]=void 0;var _base=_interopRequireDefault(__webpack_require__(/*! @emotion/styled/base */ "./node_modules/react-dropdown-select/node_modules/@emotion/styled/base/dist/emotion-styled-base.browser.esm.js")),_react=_interopRequireWildcard(__webpack_require__(/*! react */ "react")),_util=__webpack_require__(/*! ../util */ "./node_modules/react-dropdown-select/lib/util.js"),PropTypes=_interopRequireWildcard(__webpack_require__(/*! prop-types */ "./node_modules/prop-types/index.js")),_constants=__webpack_require__(/*! ../constants */ "./node_modules/react-dropdown-select/lib/constants.js");function _getRequireWildcardCache(){if("function"!=typeof WeakMap)return null;var a=new WeakMap;return _getRequireWildcardCache=function(){return a},a}function _interopRequireWildcard(a){if(a&&a.__esModule)return a;if(null===a||"object"!=typeof a&&"function"!=typeof a)return{default:a};var b=_getRequireWildcardCache();if(b&&b.has(a))return b.get(a);var c={},d=Object.defineProperty&&Object.getOwnPropertyDescriptor;for(var e in a)if(Object.prototype.hasOwnProperty.call(a,e)){var f=d?Object.getOwnPropertyDescriptor(a,e):null;f&&(f.get||f.set)?Object.defineProperty(c,e,f):c[e]=a[e]}return c.default=a,b&&b.set(a,c),c}function _interopRequireDefault(a){return a&&a.__esModule?a:{default:a}}function _assertThisInitialized(a){if(void 0===a)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return a}function _inheritsLoose(a,b){a.prototype=Object.create(b.prototype),a.prototype.constructor=a,a.__proto__=b}function _defineProperty(a,b,c){return b in a?Object.defineProperty(a,b,{value:c,enumerable:!0,configurable:!0,writable:!0}):a[b]=c,a}var handlePlaceHolder=function(a,b){var c=a.addPlaceholder,d=a.searchable,e=a.placeholder,f=b.values&&0===b.values.length,g=b.values&&0<b.values.length;return g&&c&&d?c:f?e:g&&!d?"":""},Input=/*#__PURE__*/function(a){function b(){for(var b,c=arguments.length,d=Array(c),e=0;e<c;e++)d[e]=arguments[e];return b=a.call.apply(a,[this].concat(d))||this,_defineProperty(_assertThisInitialized(b),"input",_react.default.createRef()),_defineProperty(_assertThisInitialized(b),"onBlur",function(a){return a.stopPropagation(),b.props.state.dropdown?b.input.current.focus():b.input.current.blur()}),_defineProperty(_assertThisInitialized(b),"handleKeyPress",function(a){var c=b.props,d=c.props,e=c.state,f=c.methods;return d.create&&"Enter"===a.key&&!(0,_util.valueExistInSelected)(e.search,[].concat(e.values,d.options),b.props)&&e.search&&null===e.cursor&&f.createNew(e.search)}),b}_inheritsLoose(b,a);var c=b.prototype;return c.componentDidUpdate=function componentDidUpdate(a){(this.props.state.dropdown||a.state.dropdown!==this.props.state.dropdown&&this.props.state.dropdown||this.props.props.autoFocus)&&this.input.current.focus(),a.state.dropdown===this.props.state.dropdown||this.props.state.dropdown||this.input.current.blur()},c.render=function render(){var a=this.props,b=a.props,c=a.state,d=a.methods;return b.inputRenderer?b.inputRenderer({props:b,state:c,methods:d,inputRef:this.input}):_react.default.createElement(InputComponent,{ref:this.input,tabIndex:"-1",onFocus:function onFocus(a){return a.stopPropagation()},className:_constants.LIB_NAME+"-input",size:d.getInputSize(),value:c.search,readOnly:!b.searchable,onClick:function onClick(){return d.dropDown("open")},onKeyPress:this.handleKeyPress,onChange:d.setSearch,onBlur:this.onBlur,placeholder:handlePlaceHolder(b,c),disabled:b.disabled})},b}(_react.Component),InputComponent=(0,_base.default)("input", false?0:{target:"e11wid6y0",label:"InputComponent"})("line-height:inherit;border:none;margin-left:5px;background:transparent;padding:0;width:calc(",function(a){var b=a.size;return b+"ch"}," + 5px);font-size:smaller;",function(a){var b=a.readOnly;return b&&"cursor: pointer;"}," :focus{outline:none;}"+( false?0:"/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb21wb25lbnRzL0lucHV0LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQWlHbUMiLCJmaWxlIjoiLi4vLi4vc3JjL2NvbXBvbmVudHMvSW5wdXQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QsIHsgQ29tcG9uZW50IH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IHN0eWxlZCBmcm9tICdAZW1vdGlvbi9zdHlsZWQnO1xuaW1wb3J0IHsgdmFsdWVFeGlzdEluU2VsZWN0ZWQgfSBmcm9tICcuLi91dGlsJztcbmltcG9ydCAqIGFzIFByb3BUeXBlcyBmcm9tICdwcm9wLXR5cGVzJztcbmltcG9ydCB7IExJQl9OQU1FIH0gZnJvbSAnLi4vY29uc3RhbnRzJztcblxuY29uc3QgaGFuZGxlUGxhY2VIb2xkZXIgPSAocHJvcHMsIHN0YXRlKSA9PiB7XG4gIGNvbnN0IHsgYWRkUGxhY2Vob2xkZXIsIHNlYXJjaGFibGUsIHBsYWNlaG9sZGVyIH0gPSBwcm9wcztcbiAgY29uc3Qgbm9WYWx1ZXMgPSBzdGF0ZS52YWx1ZXMgJiYgc3RhdGUudmFsdWVzLmxlbmd0aCA9PT0gMDtcbiAgY29uc3QgaGFzVmFsdWVzID0gc3RhdGUudmFsdWVzICYmIHN0YXRlLnZhbHVlcy5sZW5ndGggPiAwO1xuXG4gIGlmIChoYXNWYWx1ZXMgJiYgYWRkUGxhY2Vob2xkZXIgJiYgc2VhcmNoYWJsZSkge1xuICAgIHJldHVybiBhZGRQbGFjZWhvbGRlcjtcbiAgfVxuXG4gIGlmIChub1ZhbHVlcykge1xuICAgIHJldHVybiBwbGFjZWhvbGRlcjtcbiAgfVxuXG4gIGlmIChoYXNWYWx1ZXMgJiYgIXNlYXJjaGFibGUpIHtcbiAgICByZXR1cm4gJyc7XG4gIH1cblxuICByZXR1cm4gJyc7XG59O1xuXG5jbGFzcyBJbnB1dCBleHRlbmRzIENvbXBvbmVudCB7XG4gIGlucHV0ID0gUmVhY3QuY3JlYXRlUmVmKCk7XG5cbiAgY29tcG9uZW50RGlkVXBkYXRlKHByZXZQcm9wcykge1xuICAgIGlmIChcbiAgICAgIHRoaXMucHJvcHMuc3RhdGUuZHJvcGRvd24gfHwgKHByZXZQcm9wcy5zdGF0ZS5kcm9wZG93biAhPT0gdGhpcy5wcm9wcy5zdGF0ZS5kcm9wZG93biAmJiB0aGlzLnByb3BzLnN0YXRlLmRyb3Bkb3duKSB8fFxuICAgICAgdGhpcy5wcm9wcy5wcm9wcy5hdXRvRm9jdXNcbiAgICApIHtcbiAgICAgIHRoaXMuaW5wdXQuY3VycmVudC5mb2N1cygpO1xuICAgIH1cblxuICAgIGlmIChwcmV2UHJvcHMuc3RhdGUuZHJvcGRvd24gIT09IHRoaXMucHJvcHMuc3RhdGUuZHJvcGRvd24gJiYgIXRoaXMucHJvcHMuc3RhdGUuZHJvcGRvd24pIHtcbiAgICAgICB0aGlzLmlucHV0LmN1cnJlbnQuYmx1cigpO1xuICAgIH1cbiAgfVxuXG4gIG9uQmx1ciA9IChldmVudCkgPT4ge1xuICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgIGlmICghdGhpcy5wcm9wcy5zdGF0ZS5kcm9wZG93bikge1xuICAgICAgcmV0dXJuIHRoaXMuaW5wdXQuY3VycmVudC5ibHVyKCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuaW5wdXQuY3VycmVudC5mb2N1cygpO1xuICB9O1xuXG4gIGhhbmRsZUtleVByZXNzID0gKGV2ZW50KSA9PiB7XG4gICAgY29uc3QgeyBwcm9wcywgc3RhdGUsIG1ldGhvZHMgfSA9IHRoaXMucHJvcHM7XG5cbiAgICByZXR1cm4gKFxuICAgICAgcHJvcHMuY3JlYXRlICYmXG4gICAgICBldmVudC5rZXkgPT09ICdFbnRlcicgJiZcbiAgICAgICF2YWx1ZUV4aXN0SW5TZWxlY3RlZChzdGF0ZS5zZWFyY2gsIFsuLi5zdGF0ZS52YWx1ZXMsIC4uLnByb3BzLm9wdGlvbnNdLCB0aGlzLnByb3BzKSAmJlxuICAgICAgc3RhdGUuc2VhcmNoICYmXG4gICAgICBzdGF0ZS5jdXJzb3IgPT09IG51bGwgJiZcbiAgICAgIG1ldGhvZHMuY3JlYXRlTmV3KHN0YXRlLnNlYXJjaClcbiAgICApO1xuICB9O1xuXG4gIHJlbmRlcigpIHtcbiAgICBjb25zdCB7IHByb3BzLCBzdGF0ZSwgbWV0aG9kcyB9ID0gdGhpcy5wcm9wcztcblxuICAgIGlmIChwcm9wcy5pbnB1dFJlbmRlcmVyKSB7XG4gICAgICByZXR1cm4gcHJvcHMuaW5wdXRSZW5kZXJlcih7IHByb3BzLCBzdGF0ZSwgbWV0aG9kcywgaW5wdXRSZWY6IHRoaXMuaW5wdXQgfSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIChcbiAgICAgIDxJbnB1dENvbXBvbmVudFxuICAgICAgICByZWY9e3RoaXMuaW5wdXR9XG4gICAgICAgIHRhYkluZGV4PVwiLTFcIlxuICAgICAgICBvbkZvY3VzPXsoZXZlbnQpID0+IGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpfVxuICAgICAgICBjbGFzc05hbWU9e2Ake0xJQl9OQU1FfS1pbnB1dGB9XG4gICAgICAgIHNpemU9e21ldGhvZHMuZ2V0SW5wdXRTaXplKCl9XG4gICAgICAgIHZhbHVlPXtzdGF0ZS5zZWFyY2h9XG4gICAgICAgIHJlYWRPbmx5PXshcHJvcHMuc2VhcmNoYWJsZX1cbiAgICAgICAgb25DbGljaz17KCkgPT4gbWV0aG9kcy5kcm9wRG93bignb3BlbicpfVxuICAgICAgICBvbktleVByZXNzPXt0aGlzLmhhbmRsZUtleVByZXNzfVxuICAgICAgICBvbkNoYW5nZT17bWV0aG9kcy5zZXRTZWFyY2h9XG4gICAgICAgIG9uQmx1cj17dGhpcy5vbkJsdXJ9XG4gICAgICAgIHBsYWNlaG9sZGVyPXtoYW5kbGVQbGFjZUhvbGRlcihwcm9wcywgc3RhdGUpfVxuICAgICAgICBkaXNhYmxlZD17cHJvcHMuZGlzYWJsZWR9XG4gICAgICAvPlxuICAgICk7XG4gIH1cbn1cblxuSW5wdXQucHJvcFR5cGVzID0ge1xuICBwcm9wczogUHJvcFR5cGVzLm9iamVjdCxcbiAgc3RhdGU6IFByb3BUeXBlcy5vYmplY3QsXG4gIG1ldGhvZHM6IFByb3BUeXBlcy5vYmplY3Rcbn07XG5cbmNvbnN0IElucHV0Q29tcG9uZW50ID0gc3R5bGVkLmlucHV0YFxuICBsaW5lLWhlaWdodDogaW5oZXJpdDtcbiAgYm9yZGVyOiBub25lO1xuICBtYXJnaW4tbGVmdDogNXB4O1xuICBiYWNrZ3JvdW5kOiB0cmFuc3BhcmVudDtcbiAgcGFkZGluZzogMDtcbiAgd2lkdGg6IGNhbGMoJHsoeyBzaXplIH0pID0+IGAke3NpemV9Y2hgfSArIDVweCk7XG4gIGZvbnQtc2l6ZTogc21hbGxlcjtcbiAgJHsoeyByZWFkT25seSB9KSA9PiByZWFkT25seSAmJiAnY3Vyc29yOiBwb2ludGVyOyd9XG4gIDpmb2N1cyB7XG4gICAgb3V0bGluZTogbm9uZTtcbiAgfVxuYDtcblxuZXhwb3J0IGRlZmF1bHQgSW5wdXQ7XG4iXX0= */")),_default=Input;exports["default"]=_default;

/***/ }),

/***/ "./node_modules/react-dropdown-select/lib/components/Item.js":
/*!*******************************************************************!*\
  !*** ./node_modules/react-dropdown-select/lib/components/Item.js ***!
  \*******************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";
exports.__esModule=!0,exports["default"]=void 0;var _base=_interopRequireDefault(__webpack_require__(/*! @emotion/styled/base */ "./node_modules/react-dropdown-select/node_modules/@emotion/styled/base/dist/emotion-styled-base.browser.esm.js")),_react=_interopRequireWildcard(__webpack_require__(/*! react */ "react")),_util=__webpack_require__(/*! ../util */ "./node_modules/react-dropdown-select/lib/util.js"),PropTypes=_interopRequireWildcard(__webpack_require__(/*! prop-types */ "./node_modules/prop-types/index.js")),_constants=__webpack_require__(/*! ../constants */ "./node_modules/react-dropdown-select/lib/constants.js");function _getRequireWildcardCache(){if("function"!=typeof WeakMap)return null;var a=new WeakMap;return _getRequireWildcardCache=function(){return a},a}function _interopRequireWildcard(a){if(a&&a.__esModule)return a;if(null===a||"object"!=typeof a&&"function"!=typeof a)return{default:a};var b=_getRequireWildcardCache();if(b&&b.has(a))return b.get(a);var c={},d=Object.defineProperty&&Object.getOwnPropertyDescriptor;for(var e in a)if(Object.prototype.hasOwnProperty.call(a,e)){var f=d?Object.getOwnPropertyDescriptor(a,e):null;f&&(f.get||f.set)?Object.defineProperty(c,e,f):c[e]=a[e]}return c.default=a,b&&b.set(a,c),c}function _interopRequireDefault(a){return a&&a.__esModule?a:{default:a}}function _assertThisInitialized(a){if(void 0===a)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return a}function _inheritsLoose(a,b){a.prototype=Object.create(b.prototype),a.prototype.constructor=a,a.__proto__=b}function _defineProperty(a,b,c){return b in a?Object.defineProperty(a,b,{value:c,enumerable:!0,configurable:!0,writable:!0}):a[b]=c,a}var Item=/*#__PURE__*/function(a){function b(){for(var b,c=arguments.length,d=Array(c),e=0;e<c;e++)d[e]=arguments[e];return b=a.call.apply(a,[this].concat(d))||this,_defineProperty(_assertThisInitialized(b),"item",_react.default.createRef()),b}_inheritsLoose(b,a);var c=b.prototype;return c.componentDidMount=function componentDidMount(){var a=this.props,b=a.props,c=a.methods;this.item.current&&!b.multi&&b.keepSelectedInList&&c.isSelected(this.props.item)&&this.item.current.scrollIntoView({block:"nearest",inline:"start"})},c.componentDidUpdate=function componentDidUpdate(){this.props.state.cursor===this.props.itemIndex&&this.item.current&&this.item.current.scrollIntoView({behavior:"smooth",block:"nearest",inline:"start"})},c.render=function render(){var a=this.props,b=a.props,c=a.state,d=a.methods,e=a.item,f=a.itemIndex;return b.itemRenderer?b.itemRenderer({item:e,itemIndex:f,props:b,state:c,methods:d}):!b.keepSelectedInList&&d.isSelected(e)?null:_react.default.createElement(ItemComponent,{role:"option",ref:this.item,"aria-selected":d.isSelected(e),"aria-disabled":e.disabled,"aria-label":(0,_util.getByPath)(e,b.labelField),disabled:e.disabled,key:""+(0,_util.getByPath)(e,b.valueField)+(0,_util.getByPath)(e,b.labelField),tabIndex:"-1",className:_constants.LIB_NAME+"-item "+(d.isSelected(e)?_constants.LIB_NAME+"-item-selected":"")+" "+(c.cursor===f?_constants.LIB_NAME+"-item-active":"")+" "+(e.disabled?_constants.LIB_NAME+"-item-disabled":""),onClick:e.disabled?void 0:function(){return d.addItem(e)},onKeyPress:e.disabled?void 0:function(){return d.addItem(e)},color:b.color},(0,_util.getByPath)(e,b.labelField)," ",e.disabled&&_react.default.createElement("ins",null,b.disabledLabel))},b}(_react.Component),ItemComponent=(0,_base.default)("span", false?0:{target:"evc32pp0",label:"ItemComponent"})("padding:5px 10px;cursor:pointer;border-bottom:1px solid #fff;&.",_constants.LIB_NAME,"-item-active{border-bottom:1px solid #fff;",function(a){var b=a.disabled,c=a.color;return!b&&c&&"background: "+(0,_util.hexToRGBA)(c,.1)+";"},";}:hover,:focus{background:",function(a){var b=a.color;return b&&(0,_util.hexToRGBA)(b,.1)},";outline:none;}&.",_constants.LIB_NAME,"-item-selected{",function(a){var b=a.disabled,c=a.color;return b?"\n    background: #f2f2f2;\n    color: #ccc;\n    ":"\n    background: "+c+";\n    color: #fff;\n    border-bottom: 1px solid #fff;\n    "},";}",function(a){var b=a.disabled;return b?"\n    background: #f2f2f2;\n    color: #ccc;\n\n    ins {\n      text-decoration: none;\n      border:1px solid #ccc;\n      border-radius: 2px;\n      padding: 0px 3px;\n      font-size: x-small;\n      text-transform: uppercase;\n    }\n    ":""},";"+( false?0:"/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb21wb25lbnRzL0l0ZW0uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBdUVpQyIsImZpbGUiOiIuLi8uLi9zcmMvY29tcG9uZW50cy9JdGVtLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0LCB7IENvbXBvbmVudCB9IGZyb20gJ3JlYWN0JztcbmltcG9ydCBzdHlsZWQgZnJvbSAnQGVtb3Rpb24vc3R5bGVkJztcbmltcG9ydCB7IGhleFRvUkdCQSwgZ2V0QnlQYXRoIH0gZnJvbSAnLi4vdXRpbCc7XG5pbXBvcnQgKiBhcyBQcm9wVHlwZXMgZnJvbSAncHJvcC10eXBlcyc7XG5pbXBvcnQgeyBMSUJfTkFNRSB9IGZyb20gJy4uL2NvbnN0YW50cyc7XG5cbmNsYXNzIEl0ZW0gZXh0ZW5kcyBDb21wb25lbnQge1xuICBpdGVtID0gUmVhY3QuY3JlYXRlUmVmKCk7XG5cbiAgY29tcG9uZW50RGlkTW91bnQoKSB7XG4gICAgY29uc3QgeyBwcm9wcywgbWV0aG9kcyB9ID0gdGhpcy5wcm9wcztcblxuICAgIGlmIChcbiAgICAgIHRoaXMuaXRlbS5jdXJyZW50ICYmXG4gICAgICAhcHJvcHMubXVsdGkgJiZcbiAgICAgIHByb3BzLmtlZXBTZWxlY3RlZEluTGlzdCAmJlxuICAgICAgbWV0aG9kcy5pc1NlbGVjdGVkKHRoaXMucHJvcHMuaXRlbSlcbiAgICApXG4gICAgICB0aGlzLml0ZW0uY3VycmVudC5zY3JvbGxJbnRvVmlldyh7IGJsb2NrOiAnbmVhcmVzdCcsIGlubGluZTogJ3N0YXJ0JyB9KTtcbiAgfVxuXG4gIGNvbXBvbmVudERpZFVwZGF0ZSgpIHtcbiAgICBpZiAodGhpcy5wcm9wcy5zdGF0ZS5jdXJzb3IgPT09IHRoaXMucHJvcHMuaXRlbUluZGV4KSB7XG4gICAgICB0aGlzLml0ZW0uY3VycmVudCAmJlxuICAgICAgICB0aGlzLml0ZW0uY3VycmVudC5zY3JvbGxJbnRvVmlldyh7IGJlaGF2aW9yOiAnc21vb3RoJywgYmxvY2s6ICduZWFyZXN0JywgaW5saW5lOiAnc3RhcnQnIH0pO1xuICAgIH1cbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICBjb25zdCB7IHByb3BzLCBzdGF0ZSwgbWV0aG9kcywgaXRlbSwgaXRlbUluZGV4IH0gPSB0aGlzLnByb3BzO1xuXG4gICAgaWYgKHByb3BzLml0ZW1SZW5kZXJlcikge1xuICAgICAgcmV0dXJuIHByb3BzLml0ZW1SZW5kZXJlcih7IGl0ZW0sIGl0ZW1JbmRleCwgcHJvcHMsIHN0YXRlLCBtZXRob2RzIH0pO1xuICAgIH1cblxuICAgIGlmICghcHJvcHMua2VlcFNlbGVjdGVkSW5MaXN0ICYmIG1ldGhvZHMuaXNTZWxlY3RlZChpdGVtKSkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgcmV0dXJuIChcbiAgICAgIDxJdGVtQ29tcG9uZW50XG4gICAgICAgIHJvbGU9XCJvcHRpb25cIlxuICAgICAgICByZWY9e3RoaXMuaXRlbX1cbiAgICAgICAgYXJpYS1zZWxlY3RlZD17bWV0aG9kcy5pc1NlbGVjdGVkKGl0ZW0pfVxuICAgICAgICBhcmlhLWRpc2FibGVkPXtpdGVtLmRpc2FibGVkfVxuICAgICAgICBhcmlhLWxhYmVsPXtnZXRCeVBhdGgoaXRlbSwgcHJvcHMubGFiZWxGaWVsZCl9XG4gICAgICAgIGRpc2FibGVkPXtpdGVtLmRpc2FibGVkfVxuICAgICAgICBrZXk9e2Ake2dldEJ5UGF0aChpdGVtLCBwcm9wcy52YWx1ZUZpZWxkKX0ke2dldEJ5UGF0aChpdGVtLCBwcm9wcy5sYWJlbEZpZWxkKX1gfVxuICAgICAgICB0YWJJbmRleD1cIi0xXCJcbiAgICAgICAgY2xhc3NOYW1lPXtgJHtMSUJfTkFNRX0taXRlbSAke1xuICAgICAgICAgIG1ldGhvZHMuaXNTZWxlY3RlZChpdGVtKSA/IGAke0xJQl9OQU1FfS1pdGVtLXNlbGVjdGVkYCA6ICcnXG4gICAgICAgIH0gJHtzdGF0ZS5jdXJzb3IgPT09IGl0ZW1JbmRleCA/IGAke0xJQl9OQU1FfS1pdGVtLWFjdGl2ZWAgOiAnJ30gJHtcbiAgICAgICAgICBpdGVtLmRpc2FibGVkID8gYCR7TElCX05BTUV9LWl0ZW0tZGlzYWJsZWRgIDogJydcbiAgICAgICAgfWB9XG4gICAgICAgIG9uQ2xpY2s9e2l0ZW0uZGlzYWJsZWQgPyB1bmRlZmluZWQgOiAoKSA9PiBtZXRob2RzLmFkZEl0ZW0oaXRlbSl9XG4gICAgICAgIG9uS2V5UHJlc3M9e2l0ZW0uZGlzYWJsZWQgPyB1bmRlZmluZWQgOiAoKSA9PiBtZXRob2RzLmFkZEl0ZW0oaXRlbSl9XG4gICAgICAgIGNvbG9yPXtwcm9wcy5jb2xvcn0+XG4gICAgICAgIHtnZXRCeVBhdGgoaXRlbSwgcHJvcHMubGFiZWxGaWVsZCl9IHtpdGVtLmRpc2FibGVkICYmIDxpbnM+e3Byb3BzLmRpc2FibGVkTGFiZWx9PC9pbnM+fVxuICAgICAgPC9JdGVtQ29tcG9uZW50PlxuICAgICk7XG4gIH1cbn1cblxuSXRlbS5wcm9wVHlwZXMgPSB7XG4gIHByb3BzOiBQcm9wVHlwZXMuYW55LFxuICBzdGF0ZTogUHJvcFR5cGVzLmFueSxcbiAgbWV0aG9kczogUHJvcFR5cGVzLmFueSxcbiAgaXRlbTogUHJvcFR5cGVzLmFueSxcbiAgaXRlbUluZGV4OiBQcm9wVHlwZXMuYW55XG59O1xuXG5jb25zdCBJdGVtQ29tcG9uZW50ID0gc3R5bGVkLnNwYW5gXG4gIHBhZGRpbmc6IDVweCAxMHB4O1xuICBjdXJzb3I6IHBvaW50ZXI7XG4gIGJvcmRlci1ib3R0b206IDFweCBzb2xpZCAjZmZmO1xuXG4gICYuJHtMSUJfTkFNRX0taXRlbS1hY3RpdmUge1xuICAgIGJvcmRlci1ib3R0b206IDFweCBzb2xpZCAjZmZmO1xuICAgICR7KHsgZGlzYWJsZWQsIGNvbG9yIH0pID0+ICFkaXNhYmxlZCAmJiBjb2xvciAmJiBgYmFja2dyb3VuZDogJHtoZXhUb1JHQkEoY29sb3IsIDAuMSl9O2B9XG4gIH1cblxuICA6aG92ZXIsXG4gIDpmb2N1cyB7XG4gICAgYmFja2dyb3VuZDogJHsoeyBjb2xvciB9KSA9PiBjb2xvciAmJiBoZXhUb1JHQkEoY29sb3IsIDAuMSl9O1xuICAgIG91dGxpbmU6IG5vbmU7XG4gIH1cblxuICAmLiR7TElCX05BTUV9LWl0ZW0tc2VsZWN0ZWQge1xuICAgICR7KHsgZGlzYWJsZWQsIGNvbG9yIH0pID0+XG4gICAgICBkaXNhYmxlZFxuICAgICAgICA/IGBcbiAgICBiYWNrZ3JvdW5kOiAjZjJmMmYyO1xuICAgIGNvbG9yOiAjY2NjO1xuICAgIGBcbiAgICAgICAgOiBgXG4gICAgYmFja2dyb3VuZDogJHtjb2xvcn07XG4gICAgY29sb3I6ICNmZmY7XG4gICAgYm9yZGVyLWJvdHRvbTogMXB4IHNvbGlkICNmZmY7XG4gICAgYH1cbiAgfVxuXG4gICR7KHsgZGlzYWJsZWQgfSkgPT5cbiAgICBkaXNhYmxlZFxuICAgICAgPyBgXG4gICAgYmFja2dyb3VuZDogI2YyZjJmMjtcbiAgICBjb2xvcjogI2NjYztcblxuICAgIGlucyB7XG4gICAgICB0ZXh0LWRlY29yYXRpb246IG5vbmU7XG4gICAgICBib3JkZXI6MXB4IHNvbGlkICNjY2M7XG4gICAgICBib3JkZXItcmFkaXVzOiAycHg7XG4gICAgICBwYWRkaW5nOiAwcHggM3B4O1xuICAgICAgZm9udC1zaXplOiB4LXNtYWxsO1xuICAgICAgdGV4dC10cmFuc2Zvcm06IHVwcGVyY2FzZTtcbiAgICB9XG4gICAgYFxuICAgICAgOiAnJ31cbmA7XG5cbmV4cG9ydCBkZWZhdWx0IEl0ZW07XG4iXX0= */")),_default=Item;exports["default"]=_default;

/***/ }),

/***/ "./node_modules/react-dropdown-select/lib/components/Loading.js":
/*!**********************************************************************!*\
  !*** ./node_modules/react-dropdown-select/lib/components/Loading.js ***!
  \**********************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";
exports.__esModule=!0,exports["default"]=void 0;var _base=_interopRequireDefault(__webpack_require__(/*! @emotion/styled/base */ "./node_modules/react-dropdown-select/node_modules/@emotion/styled/base/dist/emotion-styled-base.browser.esm.js")),_react=_interopRequireDefault(__webpack_require__(/*! react */ "react")),_constants=__webpack_require__(/*! ../constants */ "./node_modules/react-dropdown-select/lib/constants.js");function _interopRequireDefault(a){return a&&a.__esModule?a:{default:a}}var Loading=function(a){var b=a.props;return b.loadingRenderer?b.loadingRenderer({props:b}):_react.default.createElement(LoadingComponent,{className:_constants.LIB_NAME+"-loading",color:b.color})},LoadingComponent=(0,_base.default)("div", false?0:{target:"e1l5cpc30",label:"LoadingComponent"})("@keyframes dual-ring-spin{0%{transform:rotate(0deg);}100%{transform:rotate(180deg);}}padding:0 5px;display:block;width:auto;height:auto;:after{content:' ';display:block;width:16px;height:16px;border-radius:50%;border-width:1px;border-style:solid;border-color:",function(a){var b=a.color;return b}," transparent;animation:dual-ring-spin 0.7s ease-in-out infinite;margin:0 0 0 -10px;}"+( false?0:"/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb21wb25lbnRzL0xvYWRpbmcuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBV21DIiwiZmlsZSI6Ii4uLy4uL3NyYy9jb21wb25lbnRzL0xvYWRpbmcuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IHN0eWxlZCBmcm9tICdAZW1vdGlvbi9zdHlsZWQnO1xuaW1wb3J0IHsgTElCX05BTUUgfSBmcm9tICcuLi9jb25zdGFudHMnO1xuXG5jb25zdCBMb2FkaW5nID0gKHsgcHJvcHMgfSkgPT5cbiAgcHJvcHMubG9hZGluZ1JlbmRlcmVyID8gKFxuICAgIHByb3BzLmxvYWRpbmdSZW5kZXJlcih7IHByb3BzIH0pXG4gICkgOiAoXG4gICAgPExvYWRpbmdDb21wb25lbnQgY2xhc3NOYW1lPXtgJHtMSUJfTkFNRX0tbG9hZGluZ2B9IGNvbG9yPXtwcm9wcy5jb2xvcn0gLz5cbiAgKTtcblxuY29uc3QgTG9hZGluZ0NvbXBvbmVudCA9IHN0eWxlZC5kaXZgXG4gIEBrZXlmcmFtZXMgZHVhbC1yaW5nLXNwaW4ge1xuICAgIDAlIHtcbiAgICAgIHRyYW5zZm9ybTogcm90YXRlKDBkZWcpO1xuICAgIH1cbiAgICAxMDAlIHtcbiAgICAgIHRyYW5zZm9ybTogcm90YXRlKDE4MGRlZyk7XG4gICAgfVxuICB9XG5cbiAgcGFkZGluZzogMCA1cHg7XG4gIGRpc3BsYXk6IGJsb2NrO1xuICB3aWR0aDogYXV0bztcbiAgaGVpZ2h0OiBhdXRvO1xuXG4gIDphZnRlciB7XG4gICAgY29udGVudDogJyAnO1xuICAgIGRpc3BsYXk6IGJsb2NrO1xuICAgIHdpZHRoOiAxNnB4O1xuICAgIGhlaWdodDogMTZweDtcbiAgICBib3JkZXItcmFkaXVzOiA1MCU7XG4gICAgYm9yZGVyLXdpZHRoOiAxcHg7XG4gICAgYm9yZGVyLXN0eWxlOiBzb2xpZDtcbiAgICBib3JkZXItY29sb3I6ICR7KHsgY29sb3IgfSkgPT4gY29sb3J9IHRyYW5zcGFyZW50O1xuICAgIGFuaW1hdGlvbjogZHVhbC1yaW5nLXNwaW4gMC43cyBlYXNlLWluLW91dCBpbmZpbml0ZTtcbiAgICBtYXJnaW46IDAgMCAwIC0xMHB4O1xuICB9XG5gO1xuXG5leHBvcnQgZGVmYXVsdCBMb2FkaW5nO1xuIl19 */")),_default=Loading;exports["default"]=_default;

/***/ }),

/***/ "./node_modules/react-dropdown-select/lib/components/NoData.js":
/*!*********************************************************************!*\
  !*** ./node_modules/react-dropdown-select/lib/components/NoData.js ***!
  \*********************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";
exports.__esModule=!0,exports["default"]=void 0;var _base=_interopRequireDefault(__webpack_require__(/*! @emotion/styled/base */ "./node_modules/react-dropdown-select/node_modules/@emotion/styled/base/dist/emotion-styled-base.browser.esm.js")),_react=_interopRequireDefault(__webpack_require__(/*! react */ "react")),_constants=__webpack_require__(/*! ../constants */ "./node_modules/react-dropdown-select/lib/constants.js");function _interopRequireDefault(a){return a&&a.__esModule?a:{default:a}}var NoData=function(a){var b=a.props,c=a.state,d=a.methods;return b.noDataRenderer?b.noDataRenderer({props:b,state:c,methods:d}):_react.default.createElement(NoDataComponent,{className:_constants.LIB_NAME+"-no-data",color:b.color},b.noDataLabel)},NoDataComponent=(0,_base.default)("div", false?0:{target:"e1l5ho1t0",label:"NoDataComponent"})("padding:10px;text-align:center;color:",function(a){var b=a.color;return b},";"+( false?0:"/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb21wb25lbnRzL05vRGF0YS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFha0MiLCJmaWxlIjoiLi4vLi4vc3JjL2NvbXBvbmVudHMvTm9EYXRhLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCBzdHlsZWQgZnJvbSAnQGVtb3Rpb24vc3R5bGVkJztcbmltcG9ydCB7IExJQl9OQU1FIH0gZnJvbSAnLi4vY29uc3RhbnRzJztcblxuY29uc3QgTm9EYXRhID0gKHsgcHJvcHMsIHN0YXRlLCBtZXRob2RzIH0pID0+XG4gIHByb3BzLm5vRGF0YVJlbmRlcmVyID8gKFxuICAgIHByb3BzLm5vRGF0YVJlbmRlcmVyKHsgcHJvcHMsIHN0YXRlLCBtZXRob2RzIH0pXG4gICkgOiAoXG4gICAgPE5vRGF0YUNvbXBvbmVudCBjbGFzc05hbWU9e2Ake0xJQl9OQU1FfS1uby1kYXRhYH0gY29sb3I9e3Byb3BzLmNvbG9yfT5cbiAgICAgIHtwcm9wcy5ub0RhdGFMYWJlbH1cbiAgICA8L05vRGF0YUNvbXBvbmVudD5cbiAgKTtcblxuY29uc3QgTm9EYXRhQ29tcG9uZW50ID0gc3R5bGVkLmRpdmBcbiAgcGFkZGluZzogMTBweDtcbiAgdGV4dC1hbGlnbjogY2VudGVyO1xuICBjb2xvcjogJHsoeyBjb2xvciB9KSA9PiBjb2xvcn07XG5gO1xuXG5leHBvcnQgZGVmYXVsdCBOb0RhdGE7XG4iXX0= */")),_default=NoData;exports["default"]=_default;

/***/ }),

/***/ "./node_modules/react-dropdown-select/lib/components/Option.js":
/*!*********************************************************************!*\
  !*** ./node_modules/react-dropdown-select/lib/components/Option.js ***!
  \*********************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";
exports.__esModule=!0,exports["default"]=void 0;var _base=_interopRequireDefault(__webpack_require__(/*! @emotion/styled/base */ "./node_modules/react-dropdown-select/node_modules/@emotion/styled/base/dist/emotion-styled-base.browser.esm.js")),_react=_interopRequireDefault(__webpack_require__(/*! react */ "react")),_util=__webpack_require__(/*! ../util */ "./node_modules/react-dropdown-select/lib/util.js"),_constants=__webpack_require__(/*! ../constants */ "./node_modules/react-dropdown-select/lib/constants.js");function _interopRequireDefault(a){return a&&a.__esModule?a:{default:a}}var Option=function(a){var b=a.item,c=a.props,d=a.state,e=a.methods;return b&&c.optionRenderer?c.optionRenderer({item:b,props:c,state:d,methods:e}):_react.default.createElement(OptionComponent,{role:"listitem",disabled:c.disabled,direction:c.direction,className:_constants.LIB_NAME+"-option",color:c.color},_react.default.createElement("span",{className:_constants.LIB_NAME+"-option-label"},(0,_util.getByPath)(b,c.labelField)),_react.default.createElement("span",{className:_constants.LIB_NAME+"-option-remove",onClick:function onClick(a){return e.removeItem(a,b,c.closeOnSelect)}},"\xD7"))},OptionComponent=(0,_base.default)("span", false?0:{target:"e1l4eby50",label:"OptionComponent"})("padding:0 5px;border-radius:2px;line-height:21px;margin:3px 0 3px 5px;background:",function(a){var b=a.color;return b},";color:#fff;display:flex;flex-direction:",function(a){var b=a.direction;return"rtl"===b?"row-reverse":"row"},";.",_constants.LIB_NAME,"-option-remove{cursor:pointer;width:22px;height:22px;display:inline-block;text-align:center;margin:0 -5px 0 0px;border-radius:0 3px 3px 0;:hover{color:tomato;}}:hover,:hover>span{opacity:0.9;}"+( false?0:"/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb21wb25lbnRzL09wdGlvbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUF3Qm1DIiwiZmlsZSI6Ii4uLy4uL3NyYy9jb21wb25lbnRzL09wdGlvbi5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgc3R5bGVkIGZyb20gJ0BlbW90aW9uL3N0eWxlZCc7XG5pbXBvcnQge2dldEJ5UGF0aH0gZnJvbSAnLi4vdXRpbCc7XG5pbXBvcnQgeyBMSUJfTkFNRSB9IGZyb20gJy4uL2NvbnN0YW50cyc7XG5cbmNvbnN0IE9wdGlvbiA9ICh7IGl0ZW0sIHByb3BzLCBzdGF0ZSwgbWV0aG9kcyB9KSA9PlxuICBpdGVtICYmIHByb3BzLm9wdGlvblJlbmRlcmVyID8gKFxuICAgIHByb3BzLm9wdGlvblJlbmRlcmVyKHsgaXRlbSwgcHJvcHMsIHN0YXRlLCBtZXRob2RzIH0pXG4gICkgOiAoXG4gICAgPE9wdGlvbkNvbXBvbmVudFxuICAgICAgcm9sZT1cImxpc3RpdGVtXCJcbiAgICAgIGRpc2FibGVkPXtwcm9wcy5kaXNhYmxlZH1cbiAgICAgIGRpcmVjdGlvbj17cHJvcHMuZGlyZWN0aW9ufVxuICAgICAgY2xhc3NOYW1lPXtgJHtMSUJfTkFNRX0tb3B0aW9uYH1cbiAgICAgIGNvbG9yPXtwcm9wcy5jb2xvcn0+XG4gICAgICA8c3BhbiBjbGFzc05hbWU9e2Ake0xJQl9OQU1FfS1vcHRpb24tbGFiZWxgfT57Z2V0QnlQYXRoKGl0ZW0sIHByb3BzLmxhYmVsRmllbGQpfTwvc3Bhbj5cbiAgICAgIDxzcGFuXG4gICAgICAgIGNsYXNzTmFtZT17YCR7TElCX05BTUV9LW9wdGlvbi1yZW1vdmVgfVxuICAgICAgICBvbkNsaWNrPXsoZXZlbnQpID0+IG1ldGhvZHMucmVtb3ZlSXRlbShldmVudCwgaXRlbSwgcHJvcHMuY2xvc2VPblNlbGVjdCl9PlxuICAgICAgICAmdGltZXM7XG4gICAgICA8L3NwYW4+XG4gICAgPC9PcHRpb25Db21wb25lbnQ+XG4gICk7XG5cbmNvbnN0IE9wdGlvbkNvbXBvbmVudCA9IHN0eWxlZC5zcGFuYFxuICBwYWRkaW5nOiAwIDVweDtcbiAgYm9yZGVyLXJhZGl1czogMnB4O1xuICBsaW5lLWhlaWdodDogMjFweDtcbiAgbWFyZ2luOiAzcHggMCAzcHggNXB4O1xuICBiYWNrZ3JvdW5kOiAkeyh7IGNvbG9yIH0pID0+IGNvbG9yfTtcbiAgY29sb3I6ICNmZmY7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIGZsZXgtZGlyZWN0aW9uOiAkeyh7IGRpcmVjdGlvbiB9KSA9PiBkaXJlY3Rpb24gPT09ICdydGwnID8gJ3Jvdy1yZXZlcnNlJyA6ICdyb3cnfTtcbiAgXG5cbiAgLiR7TElCX05BTUV9LW9wdGlvbi1yZW1vdmUge1xuICAgIGN1cnNvcjogcG9pbnRlcjtcbiAgICB3aWR0aDogMjJweDtcbiAgICBoZWlnaHQ6IDIycHg7XG4gICAgZGlzcGxheTogaW5saW5lLWJsb2NrO1xuICAgIHRleHQtYWxpZ246IGNlbnRlcjtcbiAgICBtYXJnaW46IDAgLTVweCAwIDBweDtcbiAgICBib3JkZXItcmFkaXVzOiAwIDNweCAzcHggMDtcblxuICAgIDpob3ZlciB7XG4gICAgICBjb2xvcjogdG9tYXRvO1xuICAgIH1cbiAgfVxuXG4gIDpob3ZlcixcbiAgOmhvdmVyID4gc3BhbiB7XG4gICAgb3BhY2l0eTogMC45O1xuICB9XG5gO1xuXG5leHBvcnQgZGVmYXVsdCBPcHRpb247XG4iXX0= */")),_default=Option;exports["default"]=_default;

/***/ }),

/***/ "./node_modules/react-dropdown-select/lib/components/Separator.js":
/*!************************************************************************!*\
  !*** ./node_modules/react-dropdown-select/lib/components/Separator.js ***!
  \************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";
exports.__esModule=!0,exports["default"]=void 0;var _base=_interopRequireDefault(__webpack_require__(/*! @emotion/styled/base */ "./node_modules/react-dropdown-select/node_modules/@emotion/styled/base/dist/emotion-styled-base.browser.esm.js")),_react=_interopRequireDefault(__webpack_require__(/*! react */ "react")),_constants=__webpack_require__(/*! ../constants */ "./node_modules/react-dropdown-select/lib/constants.js");function _interopRequireDefault(a){return a&&a.__esModule?a:{default:a}}function _EMOTION_STRINGIFIED_CSS_ERROR__(){return"You have tried to stringify object returned from `css` function. It isn't supposed to be used directly (e.g. as value of the `className` prop), but rather handed to emotion so it can handle it (e.g. as value of `css` prop)."}var Separator=function(a){var b=a.props,c=a.state,d=a.methods;return b.separatorRenderer?b.separatorRenderer({props:b,state:c,methods:d}):_react.default.createElement(SeparatorComponent,{className:_constants.LIB_NAME+"-separator"})},SeparatorComponent=(0,_base.default)("div", false?0:{target:"e19h5j1v0",label:"SeparatorComponent"})( false?0:{name:"cmi1n0",styles:"border-left:1px solid #ccc;width:1px;height:25px;display:block",map:"/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb21wb25lbnRzL1NlcGFyYXRvci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFXcUMiLCJmaWxlIjoiLi4vLi4vc3JjL2NvbXBvbmVudHMvU2VwYXJhdG9yLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCBzdHlsZWQgZnJvbSAnQGVtb3Rpb24vc3R5bGVkJztcbmltcG9ydCB7IExJQl9OQU1FIH0gZnJvbSAnLi4vY29uc3RhbnRzJztcblxuY29uc3QgU2VwYXJhdG9yID0gKHsgcHJvcHMsIHN0YXRlLCBtZXRob2RzIH0pID0+XG4gIHByb3BzLnNlcGFyYXRvclJlbmRlcmVyID8gKFxuICAgIHByb3BzLnNlcGFyYXRvclJlbmRlcmVyKHsgcHJvcHMsIHN0YXRlLCBtZXRob2RzIH0pXG4gICkgOiAoXG4gICAgPFNlcGFyYXRvckNvbXBvbmVudCBjbGFzc05hbWU9e2Ake0xJQl9OQU1FfS1zZXBhcmF0b3JgfSAvPlxuICApO1xuXG5jb25zdCBTZXBhcmF0b3JDb21wb25lbnQgPSBzdHlsZWQuZGl2YFxuICBib3JkZXItbGVmdDogMXB4IHNvbGlkICNjY2M7XG4gIHdpZHRoOiAxcHg7XG4gIGhlaWdodDogMjVweDtcbiAgZGlzcGxheTogYmxvY2s7XG5gO1xuXG5leHBvcnQgZGVmYXVsdCBTZXBhcmF0b3I7XG4iXX0= */",toString:_EMOTION_STRINGIFIED_CSS_ERROR__}),_default=Separator;exports["default"]=_default;

/***/ }),

/***/ "./node_modules/react-dropdown-select/lib/constants.js":
/*!*************************************************************!*\
  !*** ./node_modules/react-dropdown-select/lib/constants.js ***!
  \*************************************************************/
/***/ (function(__unused_webpack_module, exports) {

"use strict";
exports.__esModule=!0,exports.LIB_NAME=void 0;var LIB_NAME="react-dropdown-select";exports.LIB_NAME="react-dropdown-select";

/***/ }),

/***/ "./node_modules/react-dropdown-select/lib/index.js":
/*!*********************************************************!*\
  !*** ./node_modules/react-dropdown-select/lib/index.js ***!
  \*********************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";
exports.__esModule=!0,exports["default"]=exports.Select=void 0;var _base=_interopRequireDefault(__webpack_require__(/*! @emotion/styled/base */ "./node_modules/react-dropdown-select/node_modules/@emotion/styled/base/dist/emotion-styled-base.browser.esm.js")),_react=_interopRequireWildcard(__webpack_require__(/*! react */ "react")),_reactDom=_interopRequireDefault(__webpack_require__(/*! react-dom */ "react-dom")),_propTypes=_interopRequireDefault(__webpack_require__(/*! prop-types */ "./node_modules/prop-types/index.js")),_ClickOutside=_interopRequireDefault(__webpack_require__(/*! ./components/ClickOutside */ "./node_modules/react-dropdown-select/lib/components/ClickOutside.js")),_Content=_interopRequireDefault(__webpack_require__(/*! ./components/Content */ "./node_modules/react-dropdown-select/lib/components/Content.js")),_Dropdown=_interopRequireDefault(__webpack_require__(/*! ./components/Dropdown */ "./node_modules/react-dropdown-select/lib/components/Dropdown.js")),_Loading=_interopRequireDefault(__webpack_require__(/*! ./components/Loading */ "./node_modules/react-dropdown-select/lib/components/Loading.js")),_Clear=_interopRequireDefault(__webpack_require__(/*! ./components/Clear */ "./node_modules/react-dropdown-select/lib/components/Clear.js")),_Separator=_interopRequireDefault(__webpack_require__(/*! ./components/Separator */ "./node_modules/react-dropdown-select/lib/components/Separator.js")),_DropdownHandle=_interopRequireDefault(__webpack_require__(/*! ./components/DropdownHandle */ "./node_modules/react-dropdown-select/lib/components/DropdownHandle.js")),_util=__webpack_require__(/*! ./util */ "./node_modules/react-dropdown-select/lib/util.js"),_constants=__webpack_require__(/*! ./constants */ "./node_modules/react-dropdown-select/lib/constants.js");function _getRequireWildcardCache(){if("function"!=typeof WeakMap)return null;var a=new WeakMap;return _getRequireWildcardCache=function(){return a},a}function _interopRequireWildcard(a){if(a&&a.__esModule)return a;if(null===a||"object"!=typeof a&&"function"!=typeof a)return{default:a};var b=_getRequireWildcardCache();if(b&&b.has(a))return b.get(a);var c={},d=Object.defineProperty&&Object.getOwnPropertyDescriptor;for(var e in a)if(Object.prototype.hasOwnProperty.call(a,e)){var f=d?Object.getOwnPropertyDescriptor(a,e):null;f&&(f.get||f.set)?Object.defineProperty(c,e,f):c[e]=a[e]}return c.default=a,b&&b.set(a,c),c}function _interopRequireDefault(a){return a&&a.__esModule?a:{default:a}}function _extends(){return _extends=Object.assign||function(a){for(var b,c=1;c<arguments.length;c++)for(var d in b=arguments[c],b)Object.prototype.hasOwnProperty.call(b,d)&&(a[d]=b[d]);return a},_extends.apply(this,arguments)}function _assertThisInitialized(a){if(void 0===a)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return a}function _inheritsLoose(a,b){a.prototype=Object.create(b.prototype),a.prototype.constructor=a,a.__proto__=b}function _defineProperty(a,b,c){return b in a?Object.defineProperty(a,b,{value:c,enumerable:!0,configurable:!0,writable:!0}):a[b]=c,a}var Select=/*#__PURE__*/function(a){function b(b){var c;return c=a.call(this,b)||this,_defineProperty(_assertThisInitialized(c),"onDropdownClose",function(){c.setState({cursor:null}),c.props.onDropdownClose()}),_defineProperty(_assertThisInitialized(c),"onScroll",function(){c.props.closeOnScroll&&c.dropDown("close"),c.updateSelectBounds()}),_defineProperty(_assertThisInitialized(c),"updateSelectBounds",function(){return c.select.current&&c.setState({selectBounds:c.select.current.getBoundingClientRect()})}),_defineProperty(_assertThisInitialized(c),"getSelectBounds",function(){return c.state.selectBounds}),_defineProperty(_assertThisInitialized(c),"dropDown",function(a,b,d){void 0===a&&(a="toggle"),void 0===d&&(d=!1);var e=b&&b.target||b&&b.srcElement;return void 0!==c.props.onDropdownCloseRequest&&c.state.dropdown&&!1===d&&"close"===a?c.props.onDropdownCloseRequest({props:c.props,methods:c.methods,state:c.state,close:function close(){return c.dropDown("close",null,!0)}}):c.props.portal&&!c.props.closeOnScroll&&!c.props.closeOnSelect&&b&&e&&e.offsetParent&&e.offsetParent.classList.contains("react-dropdown-select-dropdown")?void 0:c.props.keepOpen?c.setState({dropdown:!0}):"close"===a&&c.state.dropdown?(c.select.current.blur(),c.setState({dropdown:!1,search:c.props.clearOnBlur?"":c.state.search,searchResults:c.props.options})):"open"!==a||c.state.dropdown?"toggle"===a&&(c.select.current.focus(),c.setState({dropdown:!c.state.dropdown})):c.setState({dropdown:!0})}),_defineProperty(_assertThisInitialized(c),"getSelectRef",function(){return c.select.current}),_defineProperty(_assertThisInitialized(c),"addItem",function(a){if(c.props.multi){if((0,_util.valueExistInSelected)((0,_util.getByPath)(a,c.props.valueField),c.state.values,c.props))return c.removeItem(null,a,!1);c.setState({values:[].concat(c.state.values,[a])})}else c.setState({values:[a],dropdown:!1});return c.props.clearOnSelect&&c.setState({search:""},function(){c.setState({searchResults:c.searchResults()})}),!0}),_defineProperty(_assertThisInitialized(c),"removeItem",function(a,b,d){void 0===d&&(d=!1),a&&d&&(a.preventDefault(),a.stopPropagation(),c.dropDown("close")),c.setState({values:c.state.values.filter(function(a){return(0,_util.getByPath)(a,c.props.valueField)!==(0,_util.getByPath)(b,c.props.valueField)})})}),_defineProperty(_assertThisInitialized(c),"setSearch",function(a){c.setState({cursor:null}),c.setState({search:a.target.value},function(){c.setState({searchResults:c.searchResults()})})}),_defineProperty(_assertThisInitialized(c),"getInputSize",function(){return c.state.search?c.state.search.length:0<c.state.values.length?c.props.addPlaceholder.length:c.props.placeholder.length}),_defineProperty(_assertThisInitialized(c),"toggleSelectAll",function(){return c.setState({values:0===c.state.values.length?c.selectAll():c.clearAll()})}),_defineProperty(_assertThisInitialized(c),"clearAll",function(){c.props.onClearAll(),c.setState({values:[]})}),_defineProperty(_assertThisInitialized(c),"selectAll",function(a){void 0===a&&(a=[]),c.props.onSelectAll();var b=0<a.length?a:c.props.options.filter(function(a){return!a.disabled});c.setState({values:b})}),_defineProperty(_assertThisInitialized(c),"isSelected",function(a){return!!c.state.values.find(function(b){return(0,_util.getByPath)(b,c.props.valueField)===(0,_util.getByPath)(a,c.props.valueField)})}),_defineProperty(_assertThisInitialized(c),"areAllSelected",function(){return c.state.values.length===c.props.options.filter(function(a){return!a.disabled}).length}),_defineProperty(_assertThisInitialized(c),"safeString",function(a){return a.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")}),_defineProperty(_assertThisInitialized(c),"sortBy",function(){var a=c.props,d=a.sortBy,e=a.options;return d?(e.sort(function(c,a){return(0,_util.getProp)(c,d)<(0,_util.getProp)(a,d)?-1:(0,_util.getProp)(c,d)>(0,_util.getProp)(a,d)?1:0}),e):e}),_defineProperty(_assertThisInitialized(c),"searchFn",function(a){var b=a.state,d=a.methods,e=new RegExp(d.safeString(b.search),"i");return d.sortBy().filter(function(a){return e.test((0,_util.getByPath)(a,c.props.searchBy)||(0,_util.getByPath)(a,c.props.valueField))})}),_defineProperty(_assertThisInitialized(c),"searchResults",function(){var a={state:c.state,props:c.props,methods:c.methods};return c.props.searchFn(a)||c.searchFn(a)}),_defineProperty(_assertThisInitialized(c),"activeCursorItem",function(a){return c.setState({activeCursorItem:a})}),_defineProperty(_assertThisInitialized(c),"handleKeyDown",function(a){var b={event:a,state:c.state,props:c.props,methods:c.methods,setState:c.setState.bind(_assertThisInitialized(c))};return c.props.handleKeyDownFn(b)||c.handleKeyDownFn(b)}),_defineProperty(_assertThisInitialized(c),"handleKeyDownFn",function(a){var b=a.event,d=a.state,e=a.props,f=a.methods,g=a.setState,h=d.cursor,i=d.searchResults,j="Escape"===b.key,k="Enter"===b.key,l="ArrowUp"===b.key,m="ArrowDown"===b.key,n="Backspace"===b.key,o="Tab"===b.key&&!b.shiftKey,p=b.shiftKey&&"Tab"===b.key;if(m&&!d.dropdown)return b.preventDefault(),c.dropDown("open"),g({cursor:0});if((m||o&&d.dropdown)&&null===h)return g({cursor:0});if((l||m||p&&d.dropdown||o&&d.dropdown)&&b.preventDefault(),j&&c.dropDown("close"),k){var q=i[h];if(q&&!q.disabled){if(e.create&&(0,_util.valueExistInSelected)(d.search,d.values,e))return null;f.addItem(q)}}return(m||o&&d.dropdown)&&i.length===h?g({cursor:0}):void((m||o&&d.dropdown)&&g(function(a){return{cursor:a.cursor+1}}),(l||p&&d.dropdown)&&0<h&&g(function(a){return{cursor:a.cursor-1}}),(l||p&&d.dropdown)&&0===h&&g({cursor:i.length}),n&&e.backspaceDelete&&0===c.getInputSize()&&c.setState({values:c.state.values.slice(0,-1)}))}),_defineProperty(_assertThisInitialized(c),"renderDropdown",function(){return c.props.portal?_reactDom.default.createPortal(_react.default.createElement(_Dropdown.default,{props:c.props,state:c.state,methods:c.methods}),c.dropdownRoot):_react.default.createElement(_Dropdown.default,{props:c.props,state:c.state,methods:c.methods})}),_defineProperty(_assertThisInitialized(c),"createNew",function(a){var b,d=(b={},b[c.props.labelField]=a,b[c.props.valueField]=a,b);c.addItem(d),c.props.onCreateNew(d),c.setState({search:""})}),c.state={dropdown:!1,values:b.values,search:"",selectBounds:{},cursor:null,searchResults:b.options},c.methods={removeItem:c.removeItem,dropDown:c.dropDown,addItem:c.addItem,setSearch:c.setSearch,getInputSize:c.getInputSize,toggleSelectAll:c.toggleSelectAll,clearAll:c.clearAll,selectAll:c.selectAll,searchResults:c.searchResults,getSelectRef:c.getSelectRef,isSelected:c.isSelected,getSelectBounds:c.getSelectBounds,areAllSelected:c.areAllSelected,handleKeyDown:c.handleKeyDown,activeCursorItem:c.activeCursorItem,createNew:c.createNew,sortBy:c.sortBy,safeString:c.safeString},c.select=_react.default.createRef(),c.dropdownRoot="undefined"!=typeof document&&document.createElement("div"),c}_inheritsLoose(b,a);var c=b.prototype;return c.componentDidMount=function componentDidMount(){this.props.portal&&this.props.portal.appendChild(this.dropdownRoot),(0,_util.isomorphicWindow)().addEventListener("resize",(0,_util.debounce)(this.updateSelectBounds)),(0,_util.isomorphicWindow)().addEventListener("scroll",(0,_util.debounce)(this.onScroll)),this.dropDown("close"),this.select&&this.updateSelectBounds()},c.componentDidUpdate=function componentDidUpdate(a,b){var c=this;!this.props.compareValuesFunc(a.values,this.props.values)&&this.props.compareValuesFunc(a.values,b.values)&&(this.setState({values:this.props.values},function(){c.props.onChange(c.state.values)}),this.updateSelectBounds()),a.options!==this.props.options&&this.setState({searchResults:this.searchResults()}),b.values!==this.state.values&&(this.props.onChange(this.state.values),this.updateSelectBounds()),b.search!==this.state.search&&this.updateSelectBounds(),b.values!==this.state.values&&this.props.closeOnSelect&&this.dropDown("close"),a.multi!==this.props.multi&&this.updateSelectBounds(),b.dropdown&&b.dropdown!==this.state.dropdown&&this.onDropdownClose(),b.dropdown||b.dropdown===this.state.dropdown||this.props.onDropdownOpen()},c.componentWillUnmount=function componentWillUnmount(){this.props.portal&&this.props.portal.removeChild(this.dropdownRoot),(0,_util.isomorphicWindow)().removeEventListener("resize",(0,_util.debounce)(this.updateSelectBounds,this.props.debounceDelay)),(0,_util.isomorphicWindow)().removeEventListener("scroll",(0,_util.debounce)(this.onScroll,this.props.debounceDelay))},c.render=function render(){var a=this;return _react.default.createElement(_ClickOutside.default,{onClickOutside:function onClickOutside(b){return a.dropDown("close",b)}},_react.default.createElement(ReactDropdownSelect,_extends({onKeyDown:this.handleKeyDown,"aria-label":"Dropdown select","aria-expanded":this.state.dropdown,onClick:function onClick(b){return a.dropDown("open",b)},tabIndex:this.props.disabled?"-1":"0",direction:this.props.direction,style:this.props.style,ref:this.select,disabled:this.props.disabled,className:_constants.LIB_NAME+" "+this.props.className,color:this.props.color},this.props.additionalProps),_react.default.createElement(_Content.default,{props:this.props,state:this.state,methods:this.methods}),(this.props.name||this.props.required)&&_react.default.createElement("input",{tabIndex:-1,style:{opacity:0,width:0,position:"absolute"},name:this.props.name,required:this.props.required,pattern:this.props.pattern,defaultValue:this.state.values.map(function(b){return b[a.props.labelField]}).toString()||[],disabled:this.props.disabled}),this.props.loading&&_react.default.createElement(_Loading.default,{props:this.props}),this.props.clearable&&_react.default.createElement(_Clear.default,{props:this.props,state:this.state,methods:this.methods}),this.props.separator&&_react.default.createElement(_Separator.default,{props:this.props,state:this.state,methods:this.methods}),this.props.dropdownHandle&&_react.default.createElement(_DropdownHandle.default,{onClick:function onClick(){return a.select.current.focus()},props:this.props,state:this.state,methods:this.methods}),this.state.dropdown&&!this.props.disabled&&this.renderDropdown()))},b}(_react.Component);exports.Select=Select,Select.defaultProps={addPlaceholder:"",placeholder:"Select...",values:[],options:[],multi:!1,disabled:!1,searchBy:"label",sortBy:null,clearable:!1,searchable:!0,dropdownHandle:!0,separator:!1,keepOpen:void 0,noDataLabel:"No data",createNewLabel:"add {search}",disabledLabel:"disabled",dropdownGap:5,closeOnScroll:!1,debounceDelay:0,labelField:"label",valueField:"value",color:"#0074D9",keepSelectedInList:!0,closeOnSelect:!1,clearOnBlur:!0,clearOnSelect:!0,dropdownPosition:"bottom",dropdownHeight:"300px",autoFocus:!1,portal:null,create:!1,direction:"ltr",name:null,required:!1,pattern:void 0,onChange:function onChange(){},onDropdownOpen:function onDropdownOpen(){},onDropdownClose:function onDropdownClose(){},onDropdownCloseRequest:void 0,onClearAll:function onClearAll(){},onSelectAll:function onSelectAll(){},onCreateNew:function onCreateNew(){},searchFn:function searchFn(){},handleKeyDownFn:function handleKeyDownFn(){},additionalProps:null,backspaceDelete:!0,compareValuesFunc:_util.isEqual};var ReactDropdownSelect=(0,_base.default)("div", false?0:{target:"e1gzf2xs0",label:"ReactDropdownSelect"})("box-sizing:border-box;position:relative;display:flex;border:1px solid #ccc;width:100%;border-radius:2px;padding:2px 5px;flex-direction:row;direction:",function(a){var b=a.direction;return b},";align-items:center;cursor:pointer;min-height:36px;",function(a){var b=a.disabled;return b?"cursor: not-allowed;pointer-events: none;opacity: 0.3;":"pointer-events: all;"}," :hover,:focus-within{border-color:",function(a){var b=a.color;return b},";}:focus,:focus-within{outline:0;box-shadow:0 0 0 3px ",function(a){var b=a.color;return(0,_util.hexToRGBA)(b,.2)},";}*{box-sizing:border-box;}"+( false?0:"/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9pbmRleC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUErbEJzQyIsImZpbGUiOiIuLi9zcmMvaW5kZXguanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QsIHsgQ29tcG9uZW50IH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IFJlYWN0RE9NIGZyb20gJ3JlYWN0LWRvbSc7XG5pbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnO1xuaW1wb3J0IHN0eWxlZCBmcm9tICdAZW1vdGlvbi9zdHlsZWQnO1xuaW1wb3J0IENsaWNrT3V0c2lkZSBmcm9tICcuL2NvbXBvbmVudHMvQ2xpY2tPdXRzaWRlJztcblxuaW1wb3J0IENvbnRlbnQgZnJvbSAnLi9jb21wb25lbnRzL0NvbnRlbnQnO1xuaW1wb3J0IERyb3Bkb3duIGZyb20gJy4vY29tcG9uZW50cy9Ecm9wZG93bic7XG5pbXBvcnQgTG9hZGluZyBmcm9tICcuL2NvbXBvbmVudHMvTG9hZGluZyc7XG5pbXBvcnQgQ2xlYXIgZnJvbSAnLi9jb21wb25lbnRzL0NsZWFyJztcbmltcG9ydCBTZXBhcmF0b3IgZnJvbSAnLi9jb21wb25lbnRzL1NlcGFyYXRvcic7XG5pbXBvcnQgRHJvcGRvd25IYW5kbGUgZnJvbSAnLi9jb21wb25lbnRzL0Ryb3Bkb3duSGFuZGxlJztcblxuaW1wb3J0IHtcbiAgZGVib3VuY2UsXG4gIGhleFRvUkdCQSxcbiAgaXNFcXVhbCxcbiAgZ2V0QnlQYXRoLFxuICBnZXRQcm9wLFxuICB2YWx1ZUV4aXN0SW5TZWxlY3RlZCxcbiAgaXNvbW9ycGhpY1dpbmRvd1xufSBmcm9tICcuL3V0aWwnO1xuaW1wb3J0IHsgTElCX05BTUUgfSBmcm9tICcuL2NvbnN0YW50cyc7XG5cbmV4cG9ydCBjbGFzcyBTZWxlY3QgZXh0ZW5kcyBDb21wb25lbnQge1xuICBzdGF0aWMgcHJvcFR5cGVzID0ge1xuICAgIG9uQ2hhbmdlOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICAgIG9uRHJvcGRvd25DbG9zZTogUHJvcFR5cGVzLmZ1bmMsXG4gICAgb25Ecm9wZG93bkNsb3NlUmVxdWVzdDogUHJvcFR5cGVzLmZ1bmMsXG4gICAgb25Ecm9wZG93bk9wZW46IFByb3BUeXBlcy5mdW5jLFxuICAgIG9uQ2xlYXJBbGw6IFByb3BUeXBlcy5mdW5jLFxuICAgIG9uU2VsZWN0QWxsOiBQcm9wVHlwZXMuZnVuYyxcbiAgICB2YWx1ZXM6IFByb3BUeXBlcy5hcnJheSxcbiAgICBvcHRpb25zOiBQcm9wVHlwZXMuYXJyYXkuaXNSZXF1aXJlZCxcbiAgICBrZWVwT3BlbjogUHJvcFR5cGVzLmJvb2wsXG4gICAgZHJvcGRvd25HYXA6IFByb3BUeXBlcy5udW1iZXIsXG4gICAgbXVsdGk6IFByb3BUeXBlcy5ib29sLFxuICAgIHBsYWNlaG9sZGVyOiBQcm9wVHlwZXMuc3RyaW5nLFxuICAgIGFkZFBsYWNlaG9sZGVyOiBQcm9wVHlwZXMuc3RyaW5nLFxuICAgIGRpc2FibGVkOiBQcm9wVHlwZXMuYm9vbCxcbiAgICBjbGFzc05hbWU6IFByb3BUeXBlcy5zdHJpbmcsXG4gICAgbG9hZGluZzogUHJvcFR5cGVzLmJvb2wsXG4gICAgY2xlYXJhYmxlOiBQcm9wVHlwZXMuYm9vbCxcbiAgICBzZWFyY2hhYmxlOiBQcm9wVHlwZXMuYm9vbCxcbiAgICBzZXBhcmF0b3I6IFByb3BUeXBlcy5ib29sLFxuICAgIGRyb3Bkb3duSGFuZGxlOiBQcm9wVHlwZXMuYm9vbCxcbiAgICBzZWFyY2hCeTogUHJvcFR5cGVzLnN0cmluZyxcbiAgICBzb3J0Qnk6IFByb3BUeXBlcy5zdHJpbmcsXG4gICAgY2xvc2VPblNjcm9sbDogUHJvcFR5cGVzLmJvb2wsXG4gICAgb3Blbk9uVG9wOiBQcm9wVHlwZXMuYm9vbCxcbiAgICBzdHlsZTogUHJvcFR5cGVzLm9iamVjdCxcbiAgICBjb250ZW50UmVuZGVyZXI6IFByb3BUeXBlcy5mdW5jLFxuICAgIGRyb3Bkb3duUmVuZGVyZXI6IFByb3BUeXBlcy5mdW5jLFxuICAgIGl0ZW1SZW5kZXJlcjogUHJvcFR5cGVzLmZ1bmMsXG4gICAgbm9EYXRhUmVuZGVyZXI6IFByb3BUeXBlcy5mdW5jLFxuICAgIG9wdGlvblJlbmRlcmVyOiBQcm9wVHlwZXMuZnVuYyxcbiAgICBpbnB1dFJlbmRlcmVyOiBQcm9wVHlwZXMuZnVuYyxcbiAgICBsb2FkaW5nUmVuZGVyZXI6IFByb3BUeXBlcy5mdW5jLFxuICAgIGNsZWFyUmVuZGVyZXI6IFByb3BUeXBlcy5mdW5jLFxuICAgIHNlcGFyYXRvclJlbmRlcmVyOiBQcm9wVHlwZXMuZnVuYyxcbiAgICBkcm9wZG93bkhhbmRsZVJlbmRlcmVyOiBQcm9wVHlwZXMuZnVuYyxcbiAgICBkaXJlY3Rpb246IFByb3BUeXBlcy5zdHJpbmcsXG4gICAgcmVxdWlyZWQ6IFByb3BUeXBlcy5ib29sLFxuICAgIHBhdHRlcm46IFByb3BUeXBlcy5zdHJpbmcsXG4gICAgbmFtZTogUHJvcFR5cGVzLnN0cmluZyxcbiAgICBiYWNrc3BhY2VEZWxldGU6IFByb3BUeXBlcy5ib29sLFxuICAgIGNvbXBhcmVWYWx1ZXNGdW5jOiBQcm9wVHlwZXMuZnVuY1xuICB9O1xuXG4gIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgc3VwZXIocHJvcHMpO1xuXG4gICAgdGhpcy5zdGF0ZSA9IHtcbiAgICAgIGRyb3Bkb3duOiBmYWxzZSxcbiAgICAgIHZhbHVlczogcHJvcHMudmFsdWVzLFxuICAgICAgc2VhcmNoOiAnJyxcbiAgICAgIHNlbGVjdEJvdW5kczoge30sXG4gICAgICBjdXJzb3I6IG51bGwsXG4gICAgICBzZWFyY2hSZXN1bHRzOiBwcm9wcy5vcHRpb25zLFxuICAgIH07XG5cbiAgICB0aGlzLm1ldGhvZHMgPSB7XG4gICAgICByZW1vdmVJdGVtOiB0aGlzLnJlbW92ZUl0ZW0sXG4gICAgICBkcm9wRG93bjogdGhpcy5kcm9wRG93bixcbiAgICAgIGFkZEl0ZW06IHRoaXMuYWRkSXRlbSxcbiAgICAgIHNldFNlYXJjaDogdGhpcy5zZXRTZWFyY2gsXG4gICAgICBnZXRJbnB1dFNpemU6IHRoaXMuZ2V0SW5wdXRTaXplLFxuICAgICAgdG9nZ2xlU2VsZWN0QWxsOiB0aGlzLnRvZ2dsZVNlbGVjdEFsbCxcbiAgICAgIGNsZWFyQWxsOiB0aGlzLmNsZWFyQWxsLFxuICAgICAgc2VsZWN0QWxsOiB0aGlzLnNlbGVjdEFsbCxcbiAgICAgIHNlYXJjaFJlc3VsdHM6IHRoaXMuc2VhcmNoUmVzdWx0cyxcbiAgICAgIGdldFNlbGVjdFJlZjogdGhpcy5nZXRTZWxlY3RSZWYsXG4gICAgICBpc1NlbGVjdGVkOiB0aGlzLmlzU2VsZWN0ZWQsXG4gICAgICBnZXRTZWxlY3RCb3VuZHM6IHRoaXMuZ2V0U2VsZWN0Qm91bmRzLFxuICAgICAgYXJlQWxsU2VsZWN0ZWQ6IHRoaXMuYXJlQWxsU2VsZWN0ZWQsXG4gICAgICBoYW5kbGVLZXlEb3duOiB0aGlzLmhhbmRsZUtleURvd24sXG4gICAgICBhY3RpdmVDdXJzb3JJdGVtOiB0aGlzLmFjdGl2ZUN1cnNvckl0ZW0sXG4gICAgICBjcmVhdGVOZXc6IHRoaXMuY3JlYXRlTmV3LFxuICAgICAgc29ydEJ5OiB0aGlzLnNvcnRCeSxcbiAgICAgIHNhZmVTdHJpbmc6IHRoaXMuc2FmZVN0cmluZ1xuICAgIH07XG5cbiAgICB0aGlzLnNlbGVjdCA9IFJlYWN0LmNyZWF0ZVJlZigpO1xuICAgIHRoaXMuZHJvcGRvd25Sb290ID0gdHlwZW9mIGRvY3VtZW50ICE9PSAndW5kZWZpbmVkJyAmJiBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgfVxuXG4gIGNvbXBvbmVudERpZE1vdW50KCkge1xuICAgIHRoaXMucHJvcHMucG9ydGFsICYmIHRoaXMucHJvcHMucG9ydGFsLmFwcGVuZENoaWxkKHRoaXMuZHJvcGRvd25Sb290KTtcbiAgICBpc29tb3JwaGljV2luZG93KCkuYWRkRXZlbnRMaXN0ZW5lcigncmVzaXplJywgZGVib3VuY2UodGhpcy51cGRhdGVTZWxlY3RCb3VuZHMpKTtcbiAgICBpc29tb3JwaGljV2luZG93KCkuYWRkRXZlbnRMaXN0ZW5lcignc2Nyb2xsJywgZGVib3VuY2UodGhpcy5vblNjcm9sbCkpO1xuXG4gICAgdGhpcy5kcm9wRG93bignY2xvc2UnKTtcblxuICAgIGlmICh0aGlzLnNlbGVjdCkge1xuICAgICAgdGhpcy51cGRhdGVTZWxlY3RCb3VuZHMoKTtcbiAgICB9XG4gIH1cblxuICBjb21wb25lbnREaWRVcGRhdGUocHJldlByb3BzLCBwcmV2U3RhdGUpIHtcbiAgICBpZiAoXG4gICAgICAhdGhpcy5wcm9wcy5jb21wYXJlVmFsdWVzRnVuYyhwcmV2UHJvcHMudmFsdWVzLCB0aGlzLnByb3BzLnZhbHVlcykgJiZcbiAgICAgIHRoaXMucHJvcHMuY29tcGFyZVZhbHVlc0Z1bmMocHJldlByb3BzLnZhbHVlcywgcHJldlN0YXRlLnZhbHVlcylcbiAgICApIHtcbiAgICAgIHRoaXMuc2V0U3RhdGUoXG4gICAgICAgIHtcbiAgICAgICAgICB2YWx1ZXM6IHRoaXMucHJvcHMudmFsdWVzXG4gICAgICAgIH0sXG4gICAgICAgICgpID0+IHtcbiAgICAgICAgICB0aGlzLnByb3BzLm9uQ2hhbmdlKHRoaXMuc3RhdGUudmFsdWVzKTtcbiAgICAgICAgfVxuICAgICAgKTtcbiAgICAgIHRoaXMudXBkYXRlU2VsZWN0Qm91bmRzKCk7XG4gICAgfVxuXG4gICAgaWYgKHByZXZQcm9wcy5vcHRpb25zICE9PSB0aGlzLnByb3BzLm9wdGlvbnMpIHtcbiAgICAgIHRoaXMuc2V0U3RhdGUoeyBzZWFyY2hSZXN1bHRzOiB0aGlzLnNlYXJjaFJlc3VsdHMoKSB9KTtcbiAgICB9XG5cbiAgICBpZiAocHJldlN0YXRlLnZhbHVlcyAhPT0gdGhpcy5zdGF0ZS52YWx1ZXMpIHtcbiAgICAgIHRoaXMucHJvcHMub25DaGFuZ2UodGhpcy5zdGF0ZS52YWx1ZXMpO1xuICAgICAgdGhpcy51cGRhdGVTZWxlY3RCb3VuZHMoKTtcbiAgICB9XG5cbiAgICBpZiAocHJldlN0YXRlLnNlYXJjaCAhPT0gdGhpcy5zdGF0ZS5zZWFyY2gpIHtcbiAgICAgIHRoaXMudXBkYXRlU2VsZWN0Qm91bmRzKCk7XG4gICAgfVxuXG4gICAgaWYgKHByZXZTdGF0ZS52YWx1ZXMgIT09IHRoaXMuc3RhdGUudmFsdWVzICYmIHRoaXMucHJvcHMuY2xvc2VPblNlbGVjdCkge1xuICAgICAgdGhpcy5kcm9wRG93bignY2xvc2UnKTtcbiAgICB9XG5cbiAgICBpZiAocHJldlByb3BzLm11bHRpICE9PSB0aGlzLnByb3BzLm11bHRpKSB7XG4gICAgICB0aGlzLnVwZGF0ZVNlbGVjdEJvdW5kcygpO1xuICAgIH1cblxuICAgIGlmIChwcmV2U3RhdGUuZHJvcGRvd24gJiYgcHJldlN0YXRlLmRyb3Bkb3duICE9PSB0aGlzLnN0YXRlLmRyb3Bkb3duKSB7XG4gICAgICB0aGlzLm9uRHJvcGRvd25DbG9zZSgpO1xuICAgIH1cblxuICAgIGlmICghcHJldlN0YXRlLmRyb3Bkb3duICYmIHByZXZTdGF0ZS5kcm9wZG93biAhPT0gdGhpcy5zdGF0ZS5kcm9wZG93bikge1xuICAgICAgdGhpcy5wcm9wcy5vbkRyb3Bkb3duT3BlbigpO1xuICAgIH1cbiAgfVxuXG4gIGNvbXBvbmVudFdpbGxVbm1vdW50KCkge1xuICAgIHRoaXMucHJvcHMucG9ydGFsICYmIHRoaXMucHJvcHMucG9ydGFsLnJlbW92ZUNoaWxkKHRoaXMuZHJvcGRvd25Sb290KTtcbiAgICBpc29tb3JwaGljV2luZG93KCkucmVtb3ZlRXZlbnRMaXN0ZW5lcihcbiAgICAgICdyZXNpemUnLFxuICAgICAgZGVib3VuY2UodGhpcy51cGRhdGVTZWxlY3RCb3VuZHMsIHRoaXMucHJvcHMuZGVib3VuY2VEZWxheSlcbiAgICApO1xuICAgIGlzb21vcnBoaWNXaW5kb3coKS5yZW1vdmVFdmVudExpc3RlbmVyKFxuICAgICAgJ3Njcm9sbCcsXG4gICAgICBkZWJvdW5jZSh0aGlzLm9uU2Nyb2xsLCB0aGlzLnByb3BzLmRlYm91bmNlRGVsYXkpXG4gICAgKTtcbiAgfVxuXG4gIG9uRHJvcGRvd25DbG9zZSA9ICgpID0+IHtcbiAgICB0aGlzLnNldFN0YXRlKHsgY3Vyc29yOiBudWxsIH0pO1xuICAgIHRoaXMucHJvcHMub25Ecm9wZG93bkNsb3NlKCk7XG4gIH07XG5cbiAgb25TY3JvbGwgPSAoKSA9PiB7XG4gICAgaWYgKHRoaXMucHJvcHMuY2xvc2VPblNjcm9sbCkge1xuICAgICAgdGhpcy5kcm9wRG93bignY2xvc2UnKTtcbiAgICB9XG5cbiAgICB0aGlzLnVwZGF0ZVNlbGVjdEJvdW5kcygpO1xuICB9O1xuXG4gIHVwZGF0ZVNlbGVjdEJvdW5kcyA9ICgpID0+XG4gICAgdGhpcy5zZWxlY3QuY3VycmVudCAmJlxuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgc2VsZWN0Qm91bmRzOiB0aGlzLnNlbGVjdC5jdXJyZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpXG4gICAgfSk7XG5cbiAgZ2V0U2VsZWN0Qm91bmRzID0gKCkgPT4gdGhpcy5zdGF0ZS5zZWxlY3RCb3VuZHM7XG5cbiAgZHJvcERvd24gPSAoYWN0aW9uID0gJ3RvZ2dsZScsIGV2ZW50LCBmb3JjZSA9IGZhbHNlKSA9PiB7XG4gICAgY29uc3QgdGFyZ2V0ID0gKGV2ZW50ICYmIGV2ZW50LnRhcmdldCkgfHwgKGV2ZW50ICYmIGV2ZW50LnNyY0VsZW1lbnQpO1xuXG4gICAgaWYgKFxuICAgICAgdGhpcy5wcm9wcy5vbkRyb3Bkb3duQ2xvc2VSZXF1ZXN0ICE9PSB1bmRlZmluZWQgJiZcbiAgICAgIHRoaXMuc3RhdGUuZHJvcGRvd24gJiZcbiAgICAgIGZvcmNlID09PSBmYWxzZSAmJlxuICAgICAgYWN0aW9uID09PSAnY2xvc2UnXG4gICAgKSB7XG4gICAgICByZXR1cm4gdGhpcy5wcm9wcy5vbkRyb3Bkb3duQ2xvc2VSZXF1ZXN0KHtcbiAgICAgICAgcHJvcHM6IHRoaXMucHJvcHMsXG4gICAgICAgIG1ldGhvZHM6IHRoaXMubWV0aG9kcyxcbiAgICAgICAgc3RhdGU6IHRoaXMuc3RhdGUsXG4gICAgICAgIGNsb3NlOiAoKSA9PiB0aGlzLmRyb3BEb3duKCdjbG9zZScsIG51bGwsIHRydWUpXG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBpZiAoXG4gICAgICB0aGlzLnByb3BzLnBvcnRhbCAmJlxuICAgICAgIXRoaXMucHJvcHMuY2xvc2VPblNjcm9sbCAmJlxuICAgICAgIXRoaXMucHJvcHMuY2xvc2VPblNlbGVjdCAmJlxuICAgICAgZXZlbnQgJiZcbiAgICAgIHRhcmdldCAmJlxuICAgICAgdGFyZ2V0Lm9mZnNldFBhcmVudCAmJlxuICAgICAgdGFyZ2V0Lm9mZnNldFBhcmVudC5jbGFzc0xpc3QuY29udGFpbnMoJ3JlYWN0LWRyb3Bkb3duLXNlbGVjdC1kcm9wZG93bicpXG4gICAgKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKHRoaXMucHJvcHMua2VlcE9wZW4pIHtcbiAgICAgIHJldHVybiB0aGlzLnNldFN0YXRlKHsgZHJvcGRvd246IHRydWUgfSk7XG4gICAgfVxuXG4gICAgaWYgKGFjdGlvbiA9PT0gJ2Nsb3NlJyAmJiB0aGlzLnN0YXRlLmRyb3Bkb3duKSB7XG4gICAgICB0aGlzLnNlbGVjdC5jdXJyZW50LmJsdXIoKTtcblxuICAgICAgcmV0dXJuIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICBkcm9wZG93bjogZmFsc2UsXG4gICAgICAgIHNlYXJjaDogdGhpcy5wcm9wcy5jbGVhck9uQmx1ciA/ICcnIDogdGhpcy5zdGF0ZS5zZWFyY2gsXG4gICAgICAgIHNlYXJjaFJlc3VsdHM6IHRoaXMucHJvcHMub3B0aW9ucyxcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGlmIChhY3Rpb24gPT09ICdvcGVuJyAmJiAhdGhpcy5zdGF0ZS5kcm9wZG93bikge1xuICAgICAgcmV0dXJuIHRoaXMuc2V0U3RhdGUoeyBkcm9wZG93bjogdHJ1ZSB9KTtcbiAgICB9XG5cbiAgICBpZiAoYWN0aW9uID09PSAndG9nZ2xlJykge1xuICAgICAgdGhpcy5zZWxlY3QuY3VycmVudC5mb2N1cygpO1xuICAgICAgcmV0dXJuIHRoaXMuc2V0U3RhdGUoeyBkcm9wZG93bjogIXRoaXMuc3RhdGUuZHJvcGRvd24gfSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGZhbHNlO1xuICB9O1xuXG4gIGdldFNlbGVjdFJlZiA9ICgpID0+IHRoaXMuc2VsZWN0LmN1cnJlbnQ7XG5cbiAgYWRkSXRlbSA9IChpdGVtKSA9PiB7XG4gICAgaWYgKHRoaXMucHJvcHMubXVsdGkpIHtcbiAgICAgIGlmIChcbiAgICAgICAgdmFsdWVFeGlzdEluU2VsZWN0ZWQoZ2V0QnlQYXRoKGl0ZW0sIHRoaXMucHJvcHMudmFsdWVGaWVsZCksIHRoaXMuc3RhdGUudmFsdWVzLCB0aGlzLnByb3BzKVxuICAgICAgKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnJlbW92ZUl0ZW0obnVsbCwgaXRlbSwgZmFsc2UpO1xuICAgICAgfVxuXG4gICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgdmFsdWVzOiBbLi4udGhpcy5zdGF0ZS52YWx1ZXMsIGl0ZW1dXG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgIHZhbHVlczogW2l0ZW1dLFxuICAgICAgICBkcm9wZG93bjogZmFsc2VcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIHRoaXMucHJvcHMuY2xlYXJPblNlbGVjdCAmJlxuICAgICAgdGhpcy5zZXRTdGF0ZSh7IHNlYXJjaDogJycgfSwgKCkgPT4ge1xuICAgICAgICB0aGlzLnNldFN0YXRlKHsgc2VhcmNoUmVzdWx0czogdGhpcy5zZWFyY2hSZXN1bHRzKCkgfSk7XG4gICAgICB9KTtcblxuICAgIHJldHVybiB0cnVlO1xuICB9O1xuXG4gIHJlbW92ZUl0ZW0gPSAoZXZlbnQsIGl0ZW0sIGNsb3NlID0gZmFsc2UpID0+IHtcbiAgICBpZiAoZXZlbnQgJiYgY2xvc2UpIHtcbiAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgIHRoaXMuZHJvcERvd24oJ2Nsb3NlJyk7XG4gICAgfVxuXG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICB2YWx1ZXM6IHRoaXMuc3RhdGUudmFsdWVzLmZpbHRlcihcbiAgICAgICAgKHZhbHVlcykgPT5cbiAgICAgICAgICBnZXRCeVBhdGgodmFsdWVzLCB0aGlzLnByb3BzLnZhbHVlRmllbGQpICE9PSBnZXRCeVBhdGgoaXRlbSwgdGhpcy5wcm9wcy52YWx1ZUZpZWxkKVxuICAgICAgKVxuICAgIH0pO1xuICB9O1xuXG4gIHNldFNlYXJjaCA9IChldmVudCkgPT4ge1xuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgY3Vyc29yOiBudWxsXG4gICAgfSk7XG5cbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIHNlYXJjaDogZXZlbnQudGFyZ2V0LnZhbHVlLFxuICAgIH0sICgpID0+IHtcbiAgICAgIHRoaXMuc2V0U3RhdGUoeyBzZWFyY2hSZXN1bHRzOiB0aGlzLnNlYXJjaFJlc3VsdHMoKSB9KVxuICAgIH0pO1xuICB9O1xuXG4gIGdldElucHV0U2l6ZSA9ICgpID0+IHtcbiAgICBpZiAodGhpcy5zdGF0ZS5zZWFyY2gpIHtcbiAgICAgIHJldHVybiB0aGlzLnN0YXRlLnNlYXJjaC5sZW5ndGg7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuc3RhdGUudmFsdWVzLmxlbmd0aCA+IDApIHtcbiAgICAgIHJldHVybiB0aGlzLnByb3BzLmFkZFBsYWNlaG9sZGVyLmxlbmd0aDtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5wcm9wcy5wbGFjZWhvbGRlci5sZW5ndGg7XG4gIH07XG5cbiAgdG9nZ2xlU2VsZWN0QWxsID0gKCkgPT4ge1xuICAgIHJldHVybiB0aGlzLnNldFN0YXRlKHtcbiAgICAgIHZhbHVlczogdGhpcy5zdGF0ZS52YWx1ZXMubGVuZ3RoID09PSAwID8gdGhpcy5zZWxlY3RBbGwoKSA6IHRoaXMuY2xlYXJBbGwoKVxuICAgIH0pO1xuICB9O1xuXG4gIGNsZWFyQWxsID0gKCkgPT4ge1xuICAgIHRoaXMucHJvcHMub25DbGVhckFsbCgpO1xuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgdmFsdWVzOiBbXVxuICAgIH0pO1xuICB9O1xuXG4gIHNlbGVjdEFsbCA9ICh2YWx1ZXNMaXN0ID0gW10pID0+IHtcbiAgICB0aGlzLnByb3BzLm9uU2VsZWN0QWxsKCk7XG4gICAgY29uc3QgdmFsdWVzID1cbiAgICAgIHZhbHVlc0xpc3QubGVuZ3RoID4gMCA/IHZhbHVlc0xpc3QgOiB0aGlzLnByb3BzLm9wdGlvbnMuZmlsdGVyKChvcHRpb24pID0+ICFvcHRpb24uZGlzYWJsZWQpO1xuXG4gICAgdGhpcy5zZXRTdGF0ZSh7IHZhbHVlcyB9KTtcbiAgfTtcblxuICBpc1NlbGVjdGVkID0gKG9wdGlvbikgPT5cbiAgICAhIXRoaXMuc3RhdGUudmFsdWVzLmZpbmQoXG4gICAgICAodmFsdWUpID0+XG4gICAgICAgIGdldEJ5UGF0aCh2YWx1ZSwgdGhpcy5wcm9wcy52YWx1ZUZpZWxkKSA9PT0gZ2V0QnlQYXRoKG9wdGlvbiwgdGhpcy5wcm9wcy52YWx1ZUZpZWxkKVxuICAgICk7XG5cbiAgYXJlQWxsU2VsZWN0ZWQgPSAoKSA9PlxuICAgIHRoaXMuc3RhdGUudmFsdWVzLmxlbmd0aCA9PT0gdGhpcy5wcm9wcy5vcHRpb25zLmZpbHRlcigob3B0aW9uKSA9PiAhb3B0aW9uLmRpc2FibGVkKS5sZW5ndGg7XG5cbiAgc2FmZVN0cmluZyA9IChzdHJpbmcpID0+IHN0cmluZy5yZXBsYWNlKC9bLiorP14ke30oKXxbXFxdXFxcXF0vZywgJ1xcXFwkJicpO1xuXG4gIHNvcnRCeSA9ICgpID0+IHtcbiAgICBjb25zdCB7IHNvcnRCeSwgb3B0aW9ucyB9ID0gdGhpcy5wcm9wcztcblxuICAgIGlmICghc29ydEJ5KSB7XG4gICAgICByZXR1cm4gb3B0aW9ucztcbiAgICB9XG5cbiAgICBvcHRpb25zLnNvcnQoKGEsIGIpID0+IHtcbiAgICAgIGlmIChnZXRQcm9wKGEsIHNvcnRCeSkgPCBnZXRQcm9wKGIsIHNvcnRCeSkpIHtcbiAgICAgICAgcmV0dXJuIC0xO1xuICAgICAgfSBlbHNlIGlmIChnZXRQcm9wKGEsIHNvcnRCeSkgPiBnZXRQcm9wKGIsIHNvcnRCeSkpIHtcbiAgICAgICAgcmV0dXJuIDE7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gMDtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIHJldHVybiBvcHRpb25zO1xuICB9O1xuXG4gIHNlYXJjaEZuID0gKHsgc3RhdGUsIG1ldGhvZHMgfSkgPT4ge1xuICAgIGNvbnN0IHJlZ2V4cCA9IG5ldyBSZWdFeHAobWV0aG9kcy5zYWZlU3RyaW5nKHN0YXRlLnNlYXJjaCksICdpJyk7XG5cbiAgICByZXR1cm4gbWV0aG9kc1xuICAgICAgLnNvcnRCeSgpXG4gICAgICAuZmlsdGVyKChpdGVtKSA9PlxuICAgICAgICByZWdleHAudGVzdChnZXRCeVBhdGgoaXRlbSwgdGhpcy5wcm9wcy5zZWFyY2hCeSkgfHwgZ2V0QnlQYXRoKGl0ZW0sIHRoaXMucHJvcHMudmFsdWVGaWVsZCkpXG4gICAgICApO1xuICB9O1xuXG4gIHNlYXJjaFJlc3VsdHMgPSAoKSA9PiB7XG4gICAgY29uc3QgYXJncyA9IHsgc3RhdGU6IHRoaXMuc3RhdGUsIHByb3BzOiB0aGlzLnByb3BzLCBtZXRob2RzOiB0aGlzLm1ldGhvZHMgfTtcblxuICAgIHJldHVybiB0aGlzLnByb3BzLnNlYXJjaEZuKGFyZ3MpIHx8IHRoaXMuc2VhcmNoRm4oYXJncyk7XG4gIH07XG5cbiAgYWN0aXZlQ3Vyc29ySXRlbSA9IChhY3RpdmVDdXJzb3JJdGVtKSA9PlxuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgYWN0aXZlQ3Vyc29ySXRlbVxuICAgIH0pO1xuXG4gIGhhbmRsZUtleURvd24gPSAoZXZlbnQpID0+IHtcbiAgICBjb25zdCBhcmdzID0ge1xuICAgICAgZXZlbnQsXG4gICAgICBzdGF0ZTogdGhpcy5zdGF0ZSxcbiAgICAgIHByb3BzOiB0aGlzLnByb3BzLFxuICAgICAgbWV0aG9kczogdGhpcy5tZXRob2RzLFxuICAgICAgc2V0U3RhdGU6IHRoaXMuc2V0U3RhdGUuYmluZCh0aGlzKVxuICAgIH07XG5cbiAgICByZXR1cm4gdGhpcy5wcm9wcy5oYW5kbGVLZXlEb3duRm4oYXJncykgfHwgdGhpcy5oYW5kbGVLZXlEb3duRm4oYXJncyk7XG4gIH07XG5cbiAgaGFuZGxlS2V5RG93bkZuID0gKHsgZXZlbnQsIHN0YXRlLCBwcm9wcywgbWV0aG9kcywgc2V0U3RhdGUgfSkgPT4ge1xuICAgIGNvbnN0IHsgY3Vyc29yLCBzZWFyY2hSZXN1bHRzIH0gPSBzdGF0ZTtcbiAgICBjb25zdCBlc2NhcGUgPSBldmVudC5rZXkgPT09ICdFc2NhcGUnO1xuICAgIGNvbnN0IGVudGVyID0gZXZlbnQua2V5ID09PSAnRW50ZXInO1xuICAgIGNvbnN0IGFycm93VXAgPSBldmVudC5rZXkgPT09ICdBcnJvd1VwJztcbiAgICBjb25zdCBhcnJvd0Rvd24gPSBldmVudC5rZXkgPT09ICdBcnJvd0Rvd24nO1xuICAgIGNvbnN0IGJhY2tzcGFjZSA9IGV2ZW50LmtleSA9PT0gJ0JhY2tzcGFjZSc7XG4gICAgY29uc3QgdGFiID0gZXZlbnQua2V5ID09PSAnVGFiJyAmJiAhZXZlbnQuc2hpZnRLZXk7XG4gICAgY29uc3Qgc2hpZnRUYWIgPSBldmVudC5zaGlmdEtleSAmJiBldmVudC5rZXkgPT09ICdUYWInO1xuXG4gICAgaWYgKGFycm93RG93biAmJiAhc3RhdGUuZHJvcGRvd24pIHtcbiAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICB0aGlzLmRyb3BEb3duKCdvcGVuJyk7XG4gICAgICByZXR1cm4gc2V0U3RhdGUoe1xuICAgICAgICBjdXJzb3I6IDBcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGlmICgoYXJyb3dEb3duIHx8ICh0YWIgJiYgc3RhdGUuZHJvcGRvd24pKSAmJiBjdXJzb3IgPT09IG51bGwpIHtcbiAgICAgIHJldHVybiBzZXRTdGF0ZSh7XG4gICAgICAgIGN1cnNvcjogMFxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgaWYgKGFycm93VXAgfHwgYXJyb3dEb3duIHx8IChzaGlmdFRhYiAmJiBzdGF0ZS5kcm9wZG93bikgfHwgKHRhYiAmJiBzdGF0ZS5kcm9wZG93bikpIHtcbiAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgfVxuXG4gICAgaWYgKGVzY2FwZSkge1xuICAgICAgdGhpcy5kcm9wRG93bignY2xvc2UnKTtcbiAgICB9XG5cbiAgICBpZiAoZW50ZXIpIHtcbiAgICAgIGNvbnN0IGN1cnJlbnRJdGVtID0gc2VhcmNoUmVzdWx0c1tjdXJzb3JdO1xuICAgICAgaWYgKGN1cnJlbnRJdGVtICYmICFjdXJyZW50SXRlbS5kaXNhYmxlZCkge1xuICAgICAgICBpZiAocHJvcHMuY3JlYXRlICYmIHZhbHVlRXhpc3RJblNlbGVjdGVkKHN0YXRlLnNlYXJjaCwgc3RhdGUudmFsdWVzLCBwcm9wcykpIHtcbiAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuXG4gICAgICAgIG1ldGhvZHMuYWRkSXRlbShjdXJyZW50SXRlbSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKChhcnJvd0Rvd24gfHwgKHRhYiAmJiBzdGF0ZS5kcm9wZG93bikpICYmIHNlYXJjaFJlc3VsdHMubGVuZ3RoID09PSBjdXJzb3IpIHtcbiAgICAgIHJldHVybiBzZXRTdGF0ZSh7XG4gICAgICAgIGN1cnNvcjogMFxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgaWYgKGFycm93RG93biB8fCAodGFiICYmIHN0YXRlLmRyb3Bkb3duKSkge1xuICAgICAgc2V0U3RhdGUoKHByZXZTdGF0ZSkgPT4gKHtcbiAgICAgICAgY3Vyc29yOiBwcmV2U3RhdGUuY3Vyc29yICsgMVxuICAgICAgfSkpO1xuICAgIH1cblxuICAgIGlmICgoYXJyb3dVcCB8fCAoc2hpZnRUYWIgJiYgc3RhdGUuZHJvcGRvd24pKSAmJiBjdXJzb3IgPiAwKSB7XG4gICAgICBzZXRTdGF0ZSgocHJldlN0YXRlKSA9PiAoe1xuICAgICAgICBjdXJzb3I6IHByZXZTdGF0ZS5jdXJzb3IgLSAxXG4gICAgICB9KSk7XG4gICAgfVxuXG4gICAgaWYgKChhcnJvd1VwIHx8IChzaGlmdFRhYiAmJiBzdGF0ZS5kcm9wZG93bikpICYmIGN1cnNvciA9PT0gMCkge1xuICAgICAgc2V0U3RhdGUoe1xuICAgICAgICBjdXJzb3I6IHNlYXJjaFJlc3VsdHMubGVuZ3RoXG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBpZiAoYmFja3NwYWNlICYmIHByb3BzLmJhY2tzcGFjZURlbGV0ZSAmJiB0aGlzLmdldElucHV0U2l6ZSgpID09PSAwKSB7XG4gICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgdmFsdWVzOiB0aGlzLnN0YXRlLnZhbHVlcy5zbGljZSgwLCAtMSlcbiAgICAgIH0pO1xuICAgIH1cbiAgfTtcblxuICByZW5kZXJEcm9wZG93biA9ICgpID0+XG4gICAgdGhpcy5wcm9wcy5wb3J0YWwgPyAoXG4gICAgICBSZWFjdERPTS5jcmVhdGVQb3J0YWwoXG4gICAgICAgIDxEcm9wZG93biBwcm9wcz17dGhpcy5wcm9wc30gc3RhdGU9e3RoaXMuc3RhdGV9IG1ldGhvZHM9e3RoaXMubWV0aG9kc30gLz4sXG4gICAgICAgIHRoaXMuZHJvcGRvd25Sb290XG4gICAgICApXG4gICAgKSA6IChcbiAgICAgIDxEcm9wZG93biBwcm9wcz17dGhpcy5wcm9wc30gc3RhdGU9e3RoaXMuc3RhdGV9IG1ldGhvZHM9e3RoaXMubWV0aG9kc30gLz5cbiAgICApO1xuXG4gIGNyZWF0ZU5ldyA9IChpdGVtKSA9PiB7XG4gICAgY29uc3QgbmV3VmFsdWUgPSB7XG4gICAgICBbdGhpcy5wcm9wcy5sYWJlbEZpZWxkXTogaXRlbSxcbiAgICAgIFt0aGlzLnByb3BzLnZhbHVlRmllbGRdOiBpdGVtXG4gICAgfTtcblxuICAgIHRoaXMuYWRkSXRlbShuZXdWYWx1ZSk7XG4gICAgdGhpcy5wcm9wcy5vbkNyZWF0ZU5ldyhuZXdWYWx1ZSk7XG4gICAgdGhpcy5zZXRTdGF0ZSh7IHNlYXJjaDogJycgfSk7XG4gIH07XG5cbiAgcmVuZGVyKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8Q2xpY2tPdXRzaWRlIG9uQ2xpY2tPdXRzaWRlPXsoZXZlbnQpID0+IHRoaXMuZHJvcERvd24oJ2Nsb3NlJywgZXZlbnQpfT5cbiAgICAgICAgPFJlYWN0RHJvcGRvd25TZWxlY3RcbiAgICAgICAgICBvbktleURvd249e3RoaXMuaGFuZGxlS2V5RG93bn1cbiAgICAgICAgICBhcmlhLWxhYmVsPVwiRHJvcGRvd24gc2VsZWN0XCJcbiAgICAgICAgICBhcmlhLWV4cGFuZGVkPXt0aGlzLnN0YXRlLmRyb3Bkb3dufVxuICAgICAgICAgIG9uQ2xpY2s9eyhldmVudCkgPT4gdGhpcy5kcm9wRG93bignb3BlbicsIGV2ZW50KX1cbiAgICAgICAgICB0YWJJbmRleD17dGhpcy5wcm9wcy5kaXNhYmxlZCA/ICctMScgOiAnMCd9XG4gICAgICAgICAgZGlyZWN0aW9uPXt0aGlzLnByb3BzLmRpcmVjdGlvbn1cbiAgICAgICAgICBzdHlsZT17dGhpcy5wcm9wcy5zdHlsZX1cbiAgICAgICAgICByZWY9e3RoaXMuc2VsZWN0fVxuICAgICAgICAgIGRpc2FibGVkPXt0aGlzLnByb3BzLmRpc2FibGVkfVxuICAgICAgICAgIGNsYXNzTmFtZT17YCR7TElCX05BTUV9ICR7dGhpcy5wcm9wcy5jbGFzc05hbWV9YH1cbiAgICAgICAgICBjb2xvcj17dGhpcy5wcm9wcy5jb2xvcn1cbiAgICAgICAgICB7Li4udGhpcy5wcm9wcy5hZGRpdGlvbmFsUHJvcHN9PlxuICAgICAgICAgIDxDb250ZW50IHByb3BzPXt0aGlzLnByb3BzfSBzdGF0ZT17dGhpcy5zdGF0ZX0gbWV0aG9kcz17dGhpcy5tZXRob2RzfSAvPlxuXG4gICAgICAgICAgeyh0aGlzLnByb3BzLm5hbWUgfHwgdGhpcy5wcm9wcy5yZXF1aXJlZCkgJiYgKFxuICAgICAgICAgICAgPGlucHV0XG4gICAgICAgICAgICAgIHRhYkluZGV4PXstMX1cbiAgICAgICAgICAgICAgc3R5bGU9e3sgb3BhY2l0eTogMCwgd2lkdGg6IDAsIHBvc2l0aW9uOiAnYWJzb2x1dGUnIH19XG4gICAgICAgICAgICAgIG5hbWU9e3RoaXMucHJvcHMubmFtZX1cbiAgICAgICAgICAgICAgcmVxdWlyZWQ9e3RoaXMucHJvcHMucmVxdWlyZWR9XG4gICAgICAgICAgICAgIHBhdHRlcm49e3RoaXMucHJvcHMucGF0dGVybn1cbiAgICAgICAgICAgICAgZGVmYXVsdFZhbHVlPXtcbiAgICAgICAgICAgICAgICB0aGlzLnN0YXRlLnZhbHVlcy5tYXAoKHZhbHVlKSA9PiB2YWx1ZVt0aGlzLnByb3BzLmxhYmVsRmllbGRdKS50b1N0cmluZygpIHx8IFtdXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgZGlzYWJsZWQ9e3RoaXMucHJvcHMuZGlzYWJsZWR9XG4gICAgICAgICAgICAvPlxuICAgICAgICAgICl9XG5cbiAgICAgICAgICB7dGhpcy5wcm9wcy5sb2FkaW5nICYmIDxMb2FkaW5nIHByb3BzPXt0aGlzLnByb3BzfSAvPn1cblxuICAgICAgICAgIHt0aGlzLnByb3BzLmNsZWFyYWJsZSAmJiAoXG4gICAgICAgICAgICA8Q2xlYXIgcHJvcHM9e3RoaXMucHJvcHN9IHN0YXRlPXt0aGlzLnN0YXRlfSBtZXRob2RzPXt0aGlzLm1ldGhvZHN9IC8+XG4gICAgICAgICAgKX1cblxuICAgICAgICAgIHt0aGlzLnByb3BzLnNlcGFyYXRvciAmJiAoXG4gICAgICAgICAgICA8U2VwYXJhdG9yIHByb3BzPXt0aGlzLnByb3BzfSBzdGF0ZT17dGhpcy5zdGF0ZX0gbWV0aG9kcz17dGhpcy5tZXRob2RzfSAvPlxuICAgICAgICAgICl9XG5cbiAgICAgICAgICB7dGhpcy5wcm9wcy5kcm9wZG93bkhhbmRsZSAmJiAoXG4gICAgICAgICAgICA8RHJvcGRvd25IYW5kbGVcbiAgICAgICAgICAgICAgb25DbGljaz17KCkgPT4gdGhpcy5zZWxlY3QuY3VycmVudC5mb2N1cygpfVxuICAgICAgICAgICAgICBwcm9wcz17dGhpcy5wcm9wc31cbiAgICAgICAgICAgICAgc3RhdGU9e3RoaXMuc3RhdGV9XG4gICAgICAgICAgICAgIG1ldGhvZHM9e3RoaXMubWV0aG9kc31cbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgKX1cblxuICAgICAgICAgIHt0aGlzLnN0YXRlLmRyb3Bkb3duICYmICF0aGlzLnByb3BzLmRpc2FibGVkICYmIHRoaXMucmVuZGVyRHJvcGRvd24oKX1cbiAgICAgICAgPC9SZWFjdERyb3Bkb3duU2VsZWN0PlxuICAgICAgPC9DbGlja091dHNpZGU+XG4gICAgKTtcbiAgfVxufVxuXG5TZWxlY3QuZGVmYXVsdFByb3BzID0ge1xuICBhZGRQbGFjZWhvbGRlcjogJycsXG4gIHBsYWNlaG9sZGVyOiAnU2VsZWN0Li4uJyxcbiAgdmFsdWVzOiBbXSxcbiAgb3B0aW9uczogW10sXG4gIG11bHRpOiBmYWxzZSxcbiAgZGlzYWJsZWQ6IGZhbHNlLFxuICBzZWFyY2hCeTogJ2xhYmVsJyxcbiAgc29ydEJ5OiBudWxsLFxuICBjbGVhcmFibGU6IGZhbHNlLFxuICBzZWFyY2hhYmxlOiB0cnVlLFxuICBkcm9wZG93bkhhbmRsZTogdHJ1ZSxcbiAgc2VwYXJhdG9yOiBmYWxzZSxcbiAga2VlcE9wZW46IHVuZGVmaW5lZCxcbiAgbm9EYXRhTGFiZWw6ICdObyBkYXRhJyxcbiAgY3JlYXRlTmV3TGFiZWw6ICdhZGQge3NlYXJjaH0nLFxuICBkaXNhYmxlZExhYmVsOiAnZGlzYWJsZWQnLFxuICBkcm9wZG93bkdhcDogNSxcbiAgY2xvc2VPblNjcm9sbDogZmFsc2UsXG4gIGRlYm91bmNlRGVsYXk6IDAsXG4gIGxhYmVsRmllbGQ6ICdsYWJlbCcsXG4gIHZhbHVlRmllbGQ6ICd2YWx1ZScsXG4gIGNvbG9yOiAnIzAwNzREOScsXG4gIGtlZXBTZWxlY3RlZEluTGlzdDogdHJ1ZSxcbiAgY2xvc2VPblNlbGVjdDogZmFsc2UsXG4gIGNsZWFyT25CbHVyOiB0cnVlLFxuICBjbGVhck9uU2VsZWN0OiB0cnVlLFxuICBkcm9wZG93blBvc2l0aW9uOiAnYm90dG9tJyxcbiAgZHJvcGRvd25IZWlnaHQ6ICczMDBweCcsXG4gIGF1dG9Gb2N1czogZmFsc2UsXG4gIHBvcnRhbDogbnVsbCxcbiAgY3JlYXRlOiBmYWxzZSxcbiAgZGlyZWN0aW9uOiAnbHRyJyxcbiAgbmFtZTogbnVsbCxcbiAgcmVxdWlyZWQ6IGZhbHNlLFxuICBwYXR0ZXJuOiB1bmRlZmluZWQsXG4gIG9uQ2hhbmdlOiAoKSA9PiB1bmRlZmluZWQsXG4gIG9uRHJvcGRvd25PcGVuOiAoKSA9PiB1bmRlZmluZWQsXG4gIG9uRHJvcGRvd25DbG9zZTogKCkgPT4gdW5kZWZpbmVkLFxuICBvbkRyb3Bkb3duQ2xvc2VSZXF1ZXN0OiB1bmRlZmluZWQsXG4gIG9uQ2xlYXJBbGw6ICgpID0+IHVuZGVmaW5lZCxcbiAgb25TZWxlY3RBbGw6ICgpID0+IHVuZGVmaW5lZCxcbiAgb25DcmVhdGVOZXc6ICgpID0+IHVuZGVmaW5lZCxcbiAgc2VhcmNoRm46ICgpID0+IHVuZGVmaW5lZCxcbiAgaGFuZGxlS2V5RG93bkZuOiAoKSA9PiB1bmRlZmluZWQsXG4gIGFkZGl0aW9uYWxQcm9wczogbnVsbCxcbiAgYmFja3NwYWNlRGVsZXRlOiB0cnVlLFxuICBjb21wYXJlVmFsdWVzRnVuYzogaXNFcXVhbFxufTtcblxuY29uc3QgUmVhY3REcm9wZG93blNlbGVjdCA9IHN0eWxlZC5kaXZgXG4gIGJveC1zaXppbmc6IGJvcmRlci1ib3g7XG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcbiAgZGlzcGxheTogZmxleDtcbiAgYm9yZGVyOiAxcHggc29saWQgI2NjYztcbiAgd2lkdGg6IDEwMCU7XG4gIGJvcmRlci1yYWRpdXM6IDJweDtcbiAgcGFkZGluZzogMnB4IDVweDtcbiAgZmxleC1kaXJlY3Rpb246IHJvdztcbiAgZGlyZWN0aW9uOiAkeyh7IGRpcmVjdGlvbiB9KSA9PiBkaXJlY3Rpb259O1xuICBhbGlnbi1pdGVtczogY2VudGVyO1xuICBjdXJzb3I6IHBvaW50ZXI7XG4gIG1pbi1oZWlnaHQ6IDM2cHg7XG4gICR7KHsgZGlzYWJsZWQgfSkgPT5cbiAgICBkaXNhYmxlZCA/ICdjdXJzb3I6IG5vdC1hbGxvd2VkO3BvaW50ZXItZXZlbnRzOiBub25lO29wYWNpdHk6IDAuMzsnIDogJ3BvaW50ZXItZXZlbnRzOiBhbGw7J31cblxuICA6aG92ZXIsXG4gIDpmb2N1cy13aXRoaW4ge1xuICAgIGJvcmRlci1jb2xvcjogJHsoeyBjb2xvciB9KSA9PiBjb2xvcn07XG4gIH1cblxuICA6Zm9jdXMsXG4gIDpmb2N1cy13aXRoaW4ge1xuICAgIG91dGxpbmU6IDA7XG4gICAgYm94LXNoYWRvdzogMCAwIDAgM3B4ICR7KHsgY29sb3IgfSkgPT4gaGV4VG9SR0JBKGNvbG9yLCAwLjIpfTtcbiAgfVxuXG4gICoge1xuICAgIGJveC1zaXppbmc6IGJvcmRlci1ib3g7XG4gIH1cbmA7XG5cbmV4cG9ydCBkZWZhdWx0IFNlbGVjdDtcbiJdfQ== */")),_default=Select;exports["default"]=_default;

/***/ }),

/***/ "./node_modules/react-dropdown-select/lib/util.js":
/*!********************************************************!*\
  !*** ./node_modules/react-dropdown-select/lib/util.js ***!
  \********************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";
exports.__esModule=!0,exports.isomorphicWindow=exports.getProp=exports.getByPath=exports.isEqual=exports.debounce=exports.hexToRGBA=exports.valueExistInSelected=void 0;var valueExistInSelected=function(a,b,c){return!!b.find(function(b){return getByPath(b,c.valueField)===a||getByPath(b,c.labelField)===a})};exports.valueExistInSelected=valueExistInSelected;var hexToRGBA=function(a,b){4===a.length&&(a=""+a[1]+a[1]+a[2]+a[2]+a[3]+a[3]+"}");var c=parseInt(a.slice(1,3),16),d=parseInt(a.slice(3,5),16),e=parseInt(a.slice(5,7),16);return"rgba("+c+", "+d+", "+e+(b&&", "+b)+")"};exports.hexToRGBA=hexToRGBA;var debounce=function(a,b){void 0===b&&(b=0);var c;return function(){for(var d=arguments.length,e=Array(d),f=0;f<d;f++)e[f]=arguments[f];c&&clearTimeout(c),c=setTimeout(function(){a.apply(void 0,e),c=null},b)}};exports.debounce=debounce;var isEqual=function(c,a){return JSON.stringify(c)===JSON.stringify(a)};exports.isEqual=isEqual;var getByPath=function(a,b){return b?b.split(".").reduce(function(a,b){return a[b]},a):void 0};exports.getByPath=getByPath;var getProp=function(a,b,c){if(!b)return a;var d=Array.isArray(b)?b:b.split(".").filter(function(a){return a.length});return d.length?getProp(a[d.shift()],d,c):void 0===a?c:a};exports.getProp=getProp;var isomorphicWindow=function(){return"undefined"==typeof window&&(__webpack_require__.g.window={}),window};exports.isomorphicWindow=isomorphicWindow;

/***/ }),

/***/ "./node_modules/react-dropdown-select/node_modules/@emotion/react/_isolated-hnrs/dist/emotion-react-_isolated-hnrs.browser.esm.js":
/*!****************************************************************************************************************************************!*\
  !*** ./node_modules/react-dropdown-select/node_modules/@emotion/react/_isolated-hnrs/dist/emotion-react-_isolated-hnrs.browser.esm.js ***!
  \****************************************************************************************************************************************/
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

/***/ "./node_modules/react-dropdown-select/node_modules/@emotion/react/dist/emotion-element-cbed451f.browser.esm.js":
/*!*********************************************************************************************************************!*\
  !*** ./node_modules/react-dropdown-select/node_modules/@emotion/react/dist/emotion-element-cbed451f.browser.esm.js ***!
  \*********************************************************************************************************************/
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
/* harmony import */ var _isolated_hnrs_dist_emotion_react_isolated_hnrs_browser_esm_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../_isolated-hnrs/dist/emotion-react-_isolated-hnrs.browser.esm.js */ "./node_modules/react-dropdown-select/node_modules/@emotion/react/_isolated-hnrs/dist/emotion-react-_isolated-hnrs.browser.esm.js");
/* harmony import */ var _emotion_utils__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @emotion/utils */ "./node_modules/react-dropdown-select/node_modules/@emotion/utils/dist/emotion-utils.browser.esm.js");
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

/***/ "./node_modules/react-dropdown-select/node_modules/@emotion/styled/base/dist/emotion-styled-base.browser.esm.js":
/*!**********************************************************************************************************************!*\
  !*** ./node_modules/react-dropdown-select/node_modules/@emotion/styled/base/dist/emotion-styled-base.browser.esm.js ***!
  \**********************************************************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _babel_runtime_helpers_esm_extends__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/esm/extends */ "./node_modules/@babel/runtime/helpers/esm/extends.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _emotion_is_prop_valid__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @emotion/is-prop-valid */ "./node_modules/@emotion/is-prop-valid/dist/emotion-is-prop-valid.browser.esm.js");
/* harmony import */ var _emotion_react__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @emotion/react */ "./node_modules/react-dropdown-select/node_modules/@emotion/react/dist/emotion-element-cbed451f.browser.esm.js");
/* harmony import */ var _emotion_utils__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @emotion/utils */ "./node_modules/react-dropdown-select/node_modules/@emotion/utils/dist/emotion-utils.browser.esm.js");
/* harmony import */ var _emotion_serialize__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @emotion/serialize */ "./node_modules/@emotion/serialize/dist/emotion-serialize.browser.esm.js");








var testOmitPropsOnStringTag = _emotion_is_prop_valid__WEBPACK_IMPORTED_MODULE_2__["default"];

var testOmitPropsOnComponent = function testOmitPropsOnComponent(key) {
  return key !== 'theme';
};

var getDefaultShouldForwardProp = function getDefaultShouldForwardProp(tag) {
  return typeof tag === 'string' && // 96 is one less than the char code
  // for "a" so this is checking that
  // it's a lowercase character
  tag.charCodeAt(0) > 96 ? testOmitPropsOnStringTag : testOmitPropsOnComponent;
};
var composeShouldForwardProps = function composeShouldForwardProps(tag, options, isReal) {
  var shouldForwardProp;

  if (options) {
    var optionsShouldForwardProp = options.shouldForwardProp;
    shouldForwardProp = tag.__emotion_forwardProp && optionsShouldForwardProp ? function (propName) {
      return tag.__emotion_forwardProp(propName) && optionsShouldForwardProp(propName);
    } : optionsShouldForwardProp;
  }

  if (typeof shouldForwardProp !== 'function' && isReal) {
    shouldForwardProp = tag.__emotion_forwardProp;
  }

  return shouldForwardProp;
};

var useInsertionEffect = react__WEBPACK_IMPORTED_MODULE_1__['useInsertion' + 'Effect'] ? react__WEBPACK_IMPORTED_MODULE_1__['useInsertion' + 'Effect'] : function useInsertionEffect(create) {
  create();
};
function useInsertionEffectMaybe(create) {

  useInsertionEffect(create);
}

var ILLEGAL_ESCAPE_SEQUENCE_ERROR = "You have illegal escape sequence in your template literal, most likely inside content's property value.\nBecause you write your CSS inside a JavaScript string you actually have to do double escaping, so for example \"content: '\\00d7';\" should become \"content: '\\\\00d7';\".\nYou can read more about this here:\nhttps://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals#ES2018_revision_of_illegal_escape_sequences";

var Insertion = function Insertion(_ref) {
  var cache = _ref.cache,
      serialized = _ref.serialized,
      isStringTag = _ref.isStringTag;
  (0,_emotion_utils__WEBPACK_IMPORTED_MODULE_3__.registerStyles)(cache, serialized, isStringTag);
  var rules = useInsertionEffectMaybe(function () {
    return (0,_emotion_utils__WEBPACK_IMPORTED_MODULE_3__.insertStyles)(cache, serialized, isStringTag);
  });

  return null;
};

var createStyled = function createStyled(tag, options) {
  if (true) {
    if (tag === undefined) {
      throw new Error('You are trying to create a styled element with an undefined component.\nYou may have forgotten to import it.');
    }
  }

  var isReal = tag.__emotion_real === tag;
  var baseTag = isReal && tag.__emotion_base || tag;
  var identifierName;
  var targetClassName;

  if (options !== undefined) {
    identifierName = options.label;
    targetClassName = options.target;
  }

  var shouldForwardProp = composeShouldForwardProps(tag, options, isReal);
  var defaultShouldForwardProp = shouldForwardProp || getDefaultShouldForwardProp(baseTag);
  var shouldUseAs = !defaultShouldForwardProp('as');
  return function () {
    var args = arguments;
    var styles = isReal && tag.__emotion_styles !== undefined ? tag.__emotion_styles.slice(0) : [];

    if (identifierName !== undefined) {
      styles.push("label:" + identifierName + ";");
    }

    if (args[0] == null || args[0].raw === undefined) {
      styles.push.apply(styles, args);
    } else {
      if ( true && args[0][0] === undefined) {
        console.error(ILLEGAL_ESCAPE_SEQUENCE_ERROR);
      }

      styles.push(args[0][0]);
      var len = args.length;
      var i = 1;

      for (; i < len; i++) {
        if ( true && args[0][i] === undefined) {
          console.error(ILLEGAL_ESCAPE_SEQUENCE_ERROR);
        }

        styles.push(args[i], args[0][i]);
      }
    } // $FlowFixMe: we need to cast StatelessFunctionalComponent to our PrivateStyledComponent class


    var Styled = (0,_emotion_react__WEBPACK_IMPORTED_MODULE_5__.w)(function (props, cache, ref) {
      var FinalTag = shouldUseAs && props.as || baseTag;
      var className = '';
      var classInterpolations = [];
      var mergedProps = props;

      if (props.theme == null) {
        mergedProps = {};

        for (var key in props) {
          mergedProps[key] = props[key];
        }

        mergedProps.theme = (0,react__WEBPACK_IMPORTED_MODULE_1__.useContext)(_emotion_react__WEBPACK_IMPORTED_MODULE_5__.T);
      }

      if (typeof props.className === 'string') {
        className = (0,_emotion_utils__WEBPACK_IMPORTED_MODULE_3__.getRegisteredStyles)(cache.registered, classInterpolations, props.className);
      } else if (props.className != null) {
        className = props.className + " ";
      }

      var serialized = (0,_emotion_serialize__WEBPACK_IMPORTED_MODULE_4__.serializeStyles)(styles.concat(classInterpolations), cache.registered, mergedProps);
      className += cache.key + "-" + serialized.name;

      if (targetClassName !== undefined) {
        className += " " + targetClassName;
      }

      var finalShouldForwardProp = shouldUseAs && shouldForwardProp === undefined ? getDefaultShouldForwardProp(FinalTag) : defaultShouldForwardProp;
      var newProps = {};

      for (var _key in props) {
        if (shouldUseAs && _key === 'as') continue;

        if ( // $FlowFixMe
        finalShouldForwardProp(_key)) {
          newProps[_key] = props[_key];
        }
      }

      newProps.className = className;
      newProps.ref = ref;
      return /*#__PURE__*/(0,react__WEBPACK_IMPORTED_MODULE_1__.createElement)(react__WEBPACK_IMPORTED_MODULE_1__.Fragment, null, /*#__PURE__*/(0,react__WEBPACK_IMPORTED_MODULE_1__.createElement)(Insertion, {
        cache: cache,
        serialized: serialized,
        isStringTag: typeof FinalTag === 'string'
      }), /*#__PURE__*/(0,react__WEBPACK_IMPORTED_MODULE_1__.createElement)(FinalTag, newProps));
    });
    Styled.displayName = identifierName !== undefined ? identifierName : "Styled(" + (typeof baseTag === 'string' ? baseTag : baseTag.displayName || baseTag.name || 'Component') + ")";
    Styled.defaultProps = tag.defaultProps;
    Styled.__emotion_real = Styled;
    Styled.__emotion_base = baseTag;
    Styled.__emotion_styles = styles;
    Styled.__emotion_forwardProp = shouldForwardProp;
    Object.defineProperty(Styled, 'toString', {
      value: function value() {
        if (targetClassName === undefined && "development" !== 'production') {
          return 'NO_COMPONENT_SELECTOR';
        } // $FlowFixMe: coerce undefined to string


        return "." + targetClassName;
      }
    });

    Styled.withComponent = function (nextTag, nextOptions) {
      return createStyled(nextTag, (0,_babel_runtime_helpers_esm_extends__WEBPACK_IMPORTED_MODULE_0__["default"])({}, options, nextOptions, {
        shouldForwardProp: composeShouldForwardProps(Styled, nextOptions, true)
      })).apply(void 0, styles);
    };

    return Styled;
  };
};

/* harmony default export */ __webpack_exports__["default"] = (createStyled);


/***/ }),

/***/ "./node_modules/react-dropdown-select/node_modules/@emotion/utils/dist/emotion-utils.browser.esm.js":
/*!**********************************************************************************************************!*\
  !*** ./node_modules/react-dropdown-select/node_modules/@emotion/utils/dist/emotion-utils.browser.esm.js ***!
  \**********************************************************************************************************/
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

/***/ "./node_modules/react-sortablejs/dist/index.js":
/*!*****************************************************!*\
  !*** ./node_modules/react-sortablejs/dist/index.js ***!
  \*****************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var $8zHUo$sortablejs = __webpack_require__(/*! sortablejs */ "./node_modules/sortablejs/modular/sortable.esm.js");
var $8zHUo$classnames = __webpack_require__(/*! classnames */ "./node_modules/classnames/index.js");
var $8zHUo$react = __webpack_require__(/*! react */ "react");
var $8zHUo$tinyinvariant = __webpack_require__(/*! tiny-invariant */ "./node_modules/tiny-invariant/dist/tiny-invariant.esm.js");

function $parcel$interopDefault(a) {
  return a && a.__esModule ? a.default : a;
}
function $parcel$export(e, n, v, s) {
  Object.defineProperty(e, n, {get: v, set: s, enumerable: true, configurable: true});
}
function $parcel$exportWildcard(dest, source) {
  Object.keys(source).forEach(function(key) {
    if (key === 'default' || key === '__esModule' || dest.hasOwnProperty(key)) {
      return;
    }

    Object.defineProperty(dest, key, {
      enumerable: true,
      get: function get() {
        return source[key];
      }
    });
  });

  return dest;
}

$parcel$export(module.exports, "Sortable", () => $882b6d93070905b3$re_export$Sortable);
$parcel$export(module.exports, "Direction", () => $882b6d93070905b3$re_export$Direction);
$parcel$export(module.exports, "DOMRect", () => $882b6d93070905b3$re_export$DOMRect);
$parcel$export(module.exports, "GroupOptions", () => $882b6d93070905b3$re_export$GroupOptions);
$parcel$export(module.exports, "MoveEvent", () => $882b6d93070905b3$re_export$MoveEvent);
$parcel$export(module.exports, "Options", () => $882b6d93070905b3$re_export$Options);
$parcel$export(module.exports, "PullResult", () => $882b6d93070905b3$re_export$PullResult);
$parcel$export(module.exports, "PutResult", () => $882b6d93070905b3$re_export$PutResult);
$parcel$export(module.exports, "SortableEvent", () => $882b6d93070905b3$re_export$SortableEvent);
$parcel$export(module.exports, "SortableOptions", () => $882b6d93070905b3$re_export$SortableOptions);
$parcel$export(module.exports, "Utils", () => $882b6d93070905b3$re_export$Utils);
$parcel$export(module.exports, "ReactSortable", () => $7fe8e3ea572bda7a$export$11bbed9ee0012c13);





function $eb03e74f8f7db1f3$export$1d0aa160432dfea5(node) {
    if (node.parentElement !== null) node.parentElement.removeChild(node);
}
function $eb03e74f8f7db1f3$export$6d240faa51aa562f(parent, newChild, index) {
    const refChild = parent.children[index] || null;
    parent.insertBefore(newChild, refChild);
}
function $eb03e74f8f7db1f3$export$d7d742816c28cf91(customs) {
    $eb03e74f8f7db1f3$export$77f49a256021c8de(customs);
    $eb03e74f8f7db1f3$export$a6177d5829f70ebc(customs);
}
function $eb03e74f8f7db1f3$export$77f49a256021c8de(customs) {
    customs.forEach((curr)=>$eb03e74f8f7db1f3$export$1d0aa160432dfea5(curr.element));
}
function $eb03e74f8f7db1f3$export$a6177d5829f70ebc(customs) {
    customs.forEach((curr)=>{
        $eb03e74f8f7db1f3$export$6d240faa51aa562f(curr.parentElement, curr.element, curr.oldIndex);
    });
}
function $eb03e74f8f7db1f3$export$4655efe700f887a(evt, list) {
    const mode = $eb03e74f8f7db1f3$export$1fc0f6205829e19c(evt);
    const parentElement = {
        parentElement: evt.from
    };
    let custom = [];
    switch(mode){
        case "normal":
            /* eslint-disable */ const item = {
                element: evt.item,
                newIndex: evt.newIndex,
                oldIndex: evt.oldIndex,
                parentElement: evt.from
            };
            custom = [
                item
            ];
            break;
        case "swap":
            const drag = {
                element: evt.item,
                oldIndex: evt.oldIndex,
                newIndex: evt.newIndex,
                ...parentElement
            };
            const swap = {
                element: evt.swapItem,
                oldIndex: evt.newIndex,
                newIndex: evt.oldIndex,
                ...parentElement
            };
            custom = [
                drag,
                swap
            ];
            break;
        case "multidrag":
            custom = evt.oldIndicies.map((curr, index)=>({
                    element: curr.multiDragElement,
                    oldIndex: curr.index,
                    newIndex: evt.newIndicies[index].index,
                    ...parentElement
                }));
            break;
    }
    /* eslint-enable */ const customs = $eb03e74f8f7db1f3$export$bc06a3af7dc65f53(custom, list);
    return customs;
}
function $eb03e74f8f7db1f3$export$c25cf8080bd305ec(normalized, list) {
    const a = $eb03e74f8f7db1f3$export$be2da95e6167b0bd(normalized, list);
    const b = $eb03e74f8f7db1f3$export$eca851ee65ae17e4(normalized, a);
    return b;
}
function $eb03e74f8f7db1f3$export$be2da95e6167b0bd(normalized, list) {
    const newList = [
        ...list
    ];
    normalized.concat().reverse().forEach((curr)=>newList.splice(curr.oldIndex, 1));
    return newList;
}
function $eb03e74f8f7db1f3$export$eca851ee65ae17e4(normalized, list, evt, clone) {
    const newList = [
        ...list
    ];
    normalized.forEach((curr)=>{
        const newItem = clone && evt && clone(curr.item, evt);
        newList.splice(curr.newIndex, 0, newItem || curr.item);
    });
    return newList;
}
function $eb03e74f8f7db1f3$export$1fc0f6205829e19c(evt) {
    if (evt.oldIndicies && evt.oldIndicies.length > 0) return "multidrag";
    if (evt.swapItem) return "swap";
    return "normal";
}
function $eb03e74f8f7db1f3$export$bc06a3af7dc65f53(inputs, list) {
    const normalized = inputs.map((curr)=>({
            ...curr,
            item: list[curr.oldIndex]
        })).sort((a, b)=>a.oldIndex - b.oldIndex);
    return normalized;
}
function $eb03e74f8f7db1f3$export$7553c81e62e31b7e(props) {
    /* eslint-disable */ const { list: // react sortable props
    list , setList: setList , children: children , tag: tag , style: style , className: className , clone: clone , onAdd: // sortable options that have methods we want to overwrite
    onAdd , onChange: onChange , onChoose: onChoose , onClone: onClone , onEnd: onEnd , onFilter: onFilter , onRemove: onRemove , onSort: onSort , onStart: onStart , onUnchoose: onUnchoose , onUpdate: onUpdate , onMove: onMove , onSpill: onSpill , onSelect: onSelect , onDeselect: onDeselect , ...options } = props;
    /* eslint-enable */ return options;
}


/** Holds a global reference for which react element is being dragged */ // @todo - use context to manage this. How does one use 2 different providers?
const $7fe8e3ea572bda7a$var$store = {
    dragging: null
};
class $7fe8e3ea572bda7a$export$11bbed9ee0012c13 extends (0, $8zHUo$react.Component) {
    /* eslint-disable-next-line */ static defaultProps = {
        clone: (item)=>item
    };
    constructor(props){
        super(props);
        // @todo forward ref this component
        this.ref = /*#__PURE__*/ (0, $8zHUo$react.createRef)();
        // make all state false because we can't change sortable unless a mouse gesture is made.
        const newList = [
            ...props.list
        ].map((item)=>Object.assign(item, {
                chosen: false,
                selected: false
            }));
        props.setList(newList, this.sortable, $7fe8e3ea572bda7a$var$store);
        (0, ($parcel$interopDefault($8zHUo$tinyinvariant)))(//@ts-expect-error: Doesn't exist. Will deprecate soon.
        !props.plugins, `
Plugins prop is no longer supported.
Instead, mount it with "Sortable.mount(new MultiDrag())"
Please read the updated README.md at https://github.com/SortableJS/react-sortablejs.
      `);
    }
    componentDidMount() {
        if (this.ref.current === null) return;
        const newOptions = this.makeOptions();
        (0, ($parcel$interopDefault($8zHUo$sortablejs))).create(this.ref.current, newOptions);
    }
    componentDidUpdate(prevProps) {
        if (prevProps.disabled !== this.props.disabled && this.sortable) this.sortable.option("disabled", this.props.disabled);
    }
    render() {
        const { tag: tag , style: style , className: className , id: id  } = this.props;
        const classicProps = {
            style: style,
            className: className,
            id: id
        };
        // if no tag, default to a `div` element.
        const newTag = !tag || tag === null ? "div" : tag;
        return /*#__PURE__*/ (0, $8zHUo$react.createElement)(newTag, {
            // @todo - find a way (perhaps with the callback) to allow AntD components to work
            ref: this.ref,
            ...classicProps
        }, this.getChildren());
    }
    getChildren() {
        const { children: children , dataIdAttr: dataIdAttr , selectedClass: selectedClass = "sortable-selected" , chosenClass: chosenClass = "sortable-chosen" , dragClass: /* eslint-disable */ dragClass = "sortable-drag" , fallbackClass: fallbackClass = "sortable-falback" , ghostClass: ghostClass = "sortable-ghost" , swapClass: swapClass = "sortable-swap-highlight" , filter: /* eslint-enable */ filter = "sortable-filter" , list: list ,  } = this.props;
        // if no children, don't do anything.
        if (!children || children == null) return null;
        const dataid = dataIdAttr || "data-id";
        /* eslint-disable-next-line */ return (0, $8zHUo$react.Children).map(children, (child, index)=>{
            if (child === undefined) return undefined;
            const item = list[index] || {};
            const { className: prevClassName  } = child.props;
            // @todo - handle the function if avalable. I don't think anyone will be doing this soon.
            const filtered = typeof filter === "string" && {
                [filter.replace(".", "")]: !!item.filtered
            };
            const className = (0, ($parcel$interopDefault($8zHUo$classnames)))(prevClassName, {
                [selectedClass]: item.selected,
                [chosenClass]: item.chosen,
                ...filtered
            });
            return /*#__PURE__*/ (0, $8zHUo$react.cloneElement)(child, {
                [dataid]: child.key,
                className: className
            });
        });
    }
    /** Appends the `sortable` property to this component */ get sortable() {
        const el = this.ref.current;
        if (el === null) return null;
        const key = Object.keys(el).find((k)=>k.includes("Sortable"));
        if (!key) return null;
        //@ts-expect-error: fix me.
        return el[key];
    }
    /** Converts all the props from `ReactSortable` into the `options` object that `Sortable.create(el, [options])` can use. */ makeOptions() {
        const DOMHandlers = [
            "onAdd",
            "onChoose",
            "onDeselect",
            "onEnd",
            "onRemove",
            "onSelect",
            "onSpill",
            "onStart",
            "onUnchoose",
            "onUpdate", 
        ];
        const NonDOMHandlers = [
            "onChange",
            "onClone",
            "onFilter",
            "onSort", 
        ];
        const newOptions = (0, $eb03e74f8f7db1f3$export$7553c81e62e31b7e)(this.props);
        DOMHandlers.forEach((name)=>newOptions[name] = this.prepareOnHandlerPropAndDOM(name));
        NonDOMHandlers.forEach((name)=>newOptions[name] = this.prepareOnHandlerProp(name));
        /** onMove has 2 arguments and needs to be handled seperately. */ const onMove1 = (evt, originalEvt)=>{
            const { onMove: onMove  } = this.props;
            const defaultValue = evt.willInsertAfter || -1;
            if (!onMove) return defaultValue;
            const result = onMove(evt, originalEvt, this.sortable, $7fe8e3ea572bda7a$var$store);
            if (typeof result === "undefined") return false;
            return result;
        };
        return {
            ...newOptions,
            onMove: onMove1
        };
    }
    /** Prepares a method that will be used in the sortable options to call an `on[Handler]` prop & an `on[Handler]` ReactSortable method.  */ prepareOnHandlerPropAndDOM(evtName) {
        return (evt)=>{
            // call the component prop
            this.callOnHandlerProp(evt, evtName);
            // calls state change
            //@ts-expect-error: until @types multidrag item is in
            this[evtName](evt);
        };
    }
    /** Prepares a method that will be used in the sortable options to call an `on[Handler]` prop */ prepareOnHandlerProp(evtName) {
        return (evt)=>{
            // call the component prop
            this.callOnHandlerProp(evt, evtName);
        };
    }
    /** Calls the `props.on[Handler]` function */ callOnHandlerProp(evt, evtName) {
        const propEvent = this.props[evtName];
        if (propEvent) propEvent(evt, this.sortable, $7fe8e3ea572bda7a$var$store);
    }
    // SORTABLE DOM HANDLING
    onAdd(evt) {
        const { list: list , setList: setList , clone: clone  } = this.props;
        /* eslint-disable-next-line */ const otherList = [
            ...$7fe8e3ea572bda7a$var$store.dragging.props.list
        ];
        const customs = (0, $eb03e74f8f7db1f3$export$4655efe700f887a)(evt, otherList);
        (0, $eb03e74f8f7db1f3$export$77f49a256021c8de)(customs);
        const newList = (0, $eb03e74f8f7db1f3$export$eca851ee65ae17e4)(customs, list, evt, clone).map((item)=>Object.assign(item, {
                selected: false
            }));
        setList(newList, this.sortable, $7fe8e3ea572bda7a$var$store);
    }
    onRemove(evt) {
        const { list: list , setList: setList  } = this.props;
        const mode = (0, $eb03e74f8f7db1f3$export$1fc0f6205829e19c)(evt);
        const customs = (0, $eb03e74f8f7db1f3$export$4655efe700f887a)(evt, list);
        (0, $eb03e74f8f7db1f3$export$a6177d5829f70ebc)(customs);
        let newList = [
            ...list
        ];
        // remove state if not in clone mode. otherwise, keep.
        if (evt.pullMode !== "clone") newList = (0, $eb03e74f8f7db1f3$export$be2da95e6167b0bd)(customs, newList);
        else {
            // switch used to get the clone
            let customClones = customs;
            switch(mode){
                case "multidrag":
                    customClones = customs.map((item, index)=>({
                            ...item,
                            element: evt.clones[index]
                        }));
                    break;
                case "normal":
                    customClones = customs.map((item)=>({
                            ...item,
                            element: evt.clone
                        }));
                    break;
                case "swap":
                default:
                    (0, ($parcel$interopDefault($8zHUo$tinyinvariant)))(true, `mode "${mode}" cannot clone. Please remove "props.clone" from <ReactSortable/> when using the "${mode}" plugin`);
            }
            (0, $eb03e74f8f7db1f3$export$77f49a256021c8de)(customClones);
            // replace selected items with cloned items
            customs.forEach((curr)=>{
                const index = curr.oldIndex;
                /* eslint-disable-next-line */ const newItem = this.props.clone(curr.item, evt);
                newList.splice(index, 1, newItem);
            });
        }
        // remove item.selected from list
        newList = newList.map((item)=>Object.assign(item, {
                selected: false
            }));
        setList(newList, this.sortable, $7fe8e3ea572bda7a$var$store);
    }
    onUpdate(evt) {
        const { list: list , setList: setList  } = this.props;
        const customs = (0, $eb03e74f8f7db1f3$export$4655efe700f887a)(evt, list);
        (0, $eb03e74f8f7db1f3$export$77f49a256021c8de)(customs);
        (0, $eb03e74f8f7db1f3$export$a6177d5829f70ebc)(customs);
        const newList = (0, $eb03e74f8f7db1f3$export$c25cf8080bd305ec)(customs, list);
        return setList(newList, this.sortable, $7fe8e3ea572bda7a$var$store);
    }
    onStart() {
        $7fe8e3ea572bda7a$var$store.dragging = this;
    }
    onEnd() {
        $7fe8e3ea572bda7a$var$store.dragging = null;
    }
    onChoose(evt) {
        const { list: list , setList: setList  } = this.props;
        const newList = list.map((item, index)=>{
            let newItem = item;
            if (index === evt.oldIndex) newItem = Object.assign(item, {
                chosen: true
            });
            return newItem;
        });
        setList(newList, this.sortable, $7fe8e3ea572bda7a$var$store);
    }
    onUnchoose(evt) {
        const { list: list , setList: setList  } = this.props;
        const newList = list.map((item, index)=>{
            let newItem = item;
            if (index === evt.oldIndex) newItem = Object.assign(newItem, {
                chosen: false
            });
            return newItem;
        });
        setList(newList, this.sortable, $7fe8e3ea572bda7a$var$store);
    }
    onSpill(evt) {
        const { removeOnSpill: removeOnSpill , revertOnSpill: revertOnSpill  } = this.props;
        if (removeOnSpill && !revertOnSpill) (0, $eb03e74f8f7db1f3$export$1d0aa160432dfea5)(evt.item);
    }
    onSelect(evt) {
        const { list: list , setList: setList  } = this.props;
        const newList = list.map((item)=>Object.assign(item, {
                selected: false
            }));
        evt.newIndicies.forEach((curr)=>{
            const index = curr.index;
            if (index === -1) {
                console.log(`"${evt.type}" had indice of "${curr.index}", which is probably -1 and doesn't usually happen here.`);
                console.log(evt);
                return;
            }
            newList[index].selected = true;
        });
        setList(newList, this.sortable, $7fe8e3ea572bda7a$var$store);
    }
    onDeselect(evt) {
        const { list: list , setList: setList  } = this.props;
        const newList = list.map((item)=>Object.assign(item, {
                selected: false
            }));
        evt.newIndicies.forEach((curr)=>{
            const index = curr.index;
            if (index === -1) return;
            newList[index].selected = true;
        });
        setList(newList, this.sortable, $7fe8e3ea572bda7a$var$store);
    }
}


var $faefaad95e5fcca0$exports = {};


$parcel$exportWildcard(module.exports, $faefaad95e5fcca0$exports);


//# sourceMappingURL=index.js.map


/***/ }),

/***/ "./node_modules/sortablejs/modular/sortable.esm.js":
/*!*********************************************************!*\
  !*** ./node_modules/sortablejs/modular/sortable.esm.js ***!
  \*********************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "MultiDrag": function() { return /* binding */ MultiDragPlugin; },
/* harmony export */   "Sortable": function() { return /* binding */ Sortable; },
/* harmony export */   "Swap": function() { return /* binding */ SwapPlugin; }
/* harmony export */ });
/**!
 * Sortable 1.15.0
 * @author	RubaXa   <trash@rubaxa.org>
 * @author	owenm    <owen23355@gmail.com>
 * @license MIT
 */
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

function _typeof(obj) {
  "@babel/helpers - typeof";

  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof = function (obj) {
      return typeof obj;
    };
  } else {
    _typeof = function (obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
  }

  return _typeof(obj);
}

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

function _objectWithoutProperties(source, excluded) {
  if (source == null) return {};

  var target = _objectWithoutPropertiesLoose(source, excluded);

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

function _toConsumableArray(arr) {
  return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
}

function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) return _arrayLikeToArray(arr);
}

function _iterableToArray(iter) {
  if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter);
}

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}

function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;

  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

  return arr2;
}

function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

var version = "1.15.0";

function userAgent(pattern) {
  if (typeof window !== 'undefined' && window.navigator) {
    return !! /*@__PURE__*/navigator.userAgent.match(pattern);
  }
}

var IE11OrLess = userAgent(/(?:Trident.*rv[ :]?11\.|msie|iemobile|Windows Phone)/i);
var Edge = userAgent(/Edge/i);
var FireFox = userAgent(/firefox/i);
var Safari = userAgent(/safari/i) && !userAgent(/chrome/i) && !userAgent(/android/i);
var IOS = userAgent(/iP(ad|od|hone)/i);
var ChromeForAndroid = userAgent(/chrome/i) && userAgent(/android/i);

var captureMode = {
  capture: false,
  passive: false
};

function on(el, event, fn) {
  el.addEventListener(event, fn, !IE11OrLess && captureMode);
}

function off(el, event, fn) {
  el.removeEventListener(event, fn, !IE11OrLess && captureMode);
}

function matches(
/**HTMLElement*/
el,
/**String*/
selector) {
  if (!selector) return;
  selector[0] === '>' && (selector = selector.substring(1));

  if (el) {
    try {
      if (el.matches) {
        return el.matches(selector);
      } else if (el.msMatchesSelector) {
        return el.msMatchesSelector(selector);
      } else if (el.webkitMatchesSelector) {
        return el.webkitMatchesSelector(selector);
      }
    } catch (_) {
      return false;
    }
  }

  return false;
}

function getParentOrHost(el) {
  return el.host && el !== document && el.host.nodeType ? el.host : el.parentNode;
}

function closest(
/**HTMLElement*/
el,
/**String*/
selector,
/**HTMLElement*/
ctx, includeCTX) {
  if (el) {
    ctx = ctx || document;

    do {
      if (selector != null && (selector[0] === '>' ? el.parentNode === ctx && matches(el, selector) : matches(el, selector)) || includeCTX && el === ctx) {
        return el;
      }

      if (el === ctx) break;
      /* jshint boss:true */
    } while (el = getParentOrHost(el));
  }

  return null;
}

var R_SPACE = /\s+/g;

function toggleClass(el, name, state) {
  if (el && name) {
    if (el.classList) {
      el.classList[state ? 'add' : 'remove'](name);
    } else {
      var className = (' ' + el.className + ' ').replace(R_SPACE, ' ').replace(' ' + name + ' ', ' ');
      el.className = (className + (state ? ' ' + name : '')).replace(R_SPACE, ' ');
    }
  }
}

function css(el, prop, val) {
  var style = el && el.style;

  if (style) {
    if (val === void 0) {
      if (document.defaultView && document.defaultView.getComputedStyle) {
        val = document.defaultView.getComputedStyle(el, '');
      } else if (el.currentStyle) {
        val = el.currentStyle;
      }

      return prop === void 0 ? val : val[prop];
    } else {
      if (!(prop in style) && prop.indexOf('webkit') === -1) {
        prop = '-webkit-' + prop;
      }

      style[prop] = val + (typeof val === 'string' ? '' : 'px');
    }
  }
}

function matrix(el, selfOnly) {
  var appliedTransforms = '';

  if (typeof el === 'string') {
    appliedTransforms = el;
  } else {
    do {
      var transform = css(el, 'transform');

      if (transform && transform !== 'none') {
        appliedTransforms = transform + ' ' + appliedTransforms;
      }
      /* jshint boss:true */

    } while (!selfOnly && (el = el.parentNode));
  }

  var matrixFn = window.DOMMatrix || window.WebKitCSSMatrix || window.CSSMatrix || window.MSCSSMatrix;
  /*jshint -W056 */

  return matrixFn && new matrixFn(appliedTransforms);
}

function find(ctx, tagName, iterator) {
  if (ctx) {
    var list = ctx.getElementsByTagName(tagName),
        i = 0,
        n = list.length;

    if (iterator) {
      for (; i < n; i++) {
        iterator(list[i], i);
      }
    }

    return list;
  }

  return [];
}

function getWindowScrollingElement() {
  var scrollingElement = document.scrollingElement;

  if (scrollingElement) {
    return scrollingElement;
  } else {
    return document.documentElement;
  }
}
/**
 * Returns the "bounding client rect" of given element
 * @param  {HTMLElement} el                       The element whose boundingClientRect is wanted
 * @param  {[Boolean]} relativeToContainingBlock  Whether the rect should be relative to the containing block of (including) the container
 * @param  {[Boolean]} relativeToNonStaticParent  Whether the rect should be relative to the relative parent of (including) the contaienr
 * @param  {[Boolean]} undoScale                  Whether the container's scale() should be undone
 * @param  {[HTMLElement]} container              The parent the element will be placed in
 * @return {Object}                               The boundingClientRect of el, with specified adjustments
 */


function getRect(el, relativeToContainingBlock, relativeToNonStaticParent, undoScale, container) {
  if (!el.getBoundingClientRect && el !== window) return;
  var elRect, top, left, bottom, right, height, width;

  if (el !== window && el.parentNode && el !== getWindowScrollingElement()) {
    elRect = el.getBoundingClientRect();
    top = elRect.top;
    left = elRect.left;
    bottom = elRect.bottom;
    right = elRect.right;
    height = elRect.height;
    width = elRect.width;
  } else {
    top = 0;
    left = 0;
    bottom = window.innerHeight;
    right = window.innerWidth;
    height = window.innerHeight;
    width = window.innerWidth;
  }

  if ((relativeToContainingBlock || relativeToNonStaticParent) && el !== window) {
    // Adjust for translate()
    container = container || el.parentNode; // solves #1123 (see: https://stackoverflow.com/a/37953806/6088312)
    // Not needed on <= IE11

    if (!IE11OrLess) {
      do {
        if (container && container.getBoundingClientRect && (css(container, 'transform') !== 'none' || relativeToNonStaticParent && css(container, 'position') !== 'static')) {
          var containerRect = container.getBoundingClientRect(); // Set relative to edges of padding box of container

          top -= containerRect.top + parseInt(css(container, 'border-top-width'));
          left -= containerRect.left + parseInt(css(container, 'border-left-width'));
          bottom = top + elRect.height;
          right = left + elRect.width;
          break;
        }
        /* jshint boss:true */

      } while (container = container.parentNode);
    }
  }

  if (undoScale && el !== window) {
    // Adjust for scale()
    var elMatrix = matrix(container || el),
        scaleX = elMatrix && elMatrix.a,
        scaleY = elMatrix && elMatrix.d;

    if (elMatrix) {
      top /= scaleY;
      left /= scaleX;
      width /= scaleX;
      height /= scaleY;
      bottom = top + height;
      right = left + width;
    }
  }

  return {
    top: top,
    left: left,
    bottom: bottom,
    right: right,
    width: width,
    height: height
  };
}
/**
 * Checks if a side of an element is scrolled past a side of its parents
 * @param  {HTMLElement}  el           The element who's side being scrolled out of view is in question
 * @param  {String}       elSide       Side of the element in question ('top', 'left', 'right', 'bottom')
 * @param  {String}       parentSide   Side of the parent in question ('top', 'left', 'right', 'bottom')
 * @return {HTMLElement}               The parent scroll element that the el's side is scrolled past, or null if there is no such element
 */


function isScrolledPast(el, elSide, parentSide) {
  var parent = getParentAutoScrollElement(el, true),
      elSideVal = getRect(el)[elSide];
  /* jshint boss:true */

  while (parent) {
    var parentSideVal = getRect(parent)[parentSide],
        visible = void 0;

    if (parentSide === 'top' || parentSide === 'left') {
      visible = elSideVal >= parentSideVal;
    } else {
      visible = elSideVal <= parentSideVal;
    }

    if (!visible) return parent;
    if (parent === getWindowScrollingElement()) break;
    parent = getParentAutoScrollElement(parent, false);
  }

  return false;
}
/**
 * Gets nth child of el, ignoring hidden children, sortable's elements (does not ignore clone if it's visible)
 * and non-draggable elements
 * @param  {HTMLElement} el       The parent element
 * @param  {Number} childNum      The index of the child
 * @param  {Object} options       Parent Sortable's options
 * @return {HTMLElement}          The child at index childNum, or null if not found
 */


function getChild(el, childNum, options, includeDragEl) {
  var currentChild = 0,
      i = 0,
      children = el.children;

  while (i < children.length) {
    if (children[i].style.display !== 'none' && children[i] !== Sortable.ghost && (includeDragEl || children[i] !== Sortable.dragged) && closest(children[i], options.draggable, el, false)) {
      if (currentChild === childNum) {
        return children[i];
      }

      currentChild++;
    }

    i++;
  }

  return null;
}
/**
 * Gets the last child in the el, ignoring ghostEl or invisible elements (clones)
 * @param  {HTMLElement} el       Parent element
 * @param  {selector} selector    Any other elements that should be ignored
 * @return {HTMLElement}          The last child, ignoring ghostEl
 */


function lastChild(el, selector) {
  var last = el.lastElementChild;

  while (last && (last === Sortable.ghost || css(last, 'display') === 'none' || selector && !matches(last, selector))) {
    last = last.previousElementSibling;
  }

  return last || null;
}
/**
 * Returns the index of an element within its parent for a selected set of
 * elements
 * @param  {HTMLElement} el
 * @param  {selector} selector
 * @return {number}
 */


function index(el, selector) {
  var index = 0;

  if (!el || !el.parentNode) {
    return -1;
  }
  /* jshint boss:true */


  while (el = el.previousElementSibling) {
    if (el.nodeName.toUpperCase() !== 'TEMPLATE' && el !== Sortable.clone && (!selector || matches(el, selector))) {
      index++;
    }
  }

  return index;
}
/**
 * Returns the scroll offset of the given element, added with all the scroll offsets of parent elements.
 * The value is returned in real pixels.
 * @param  {HTMLElement} el
 * @return {Array}             Offsets in the format of [left, top]
 */


function getRelativeScrollOffset(el) {
  var offsetLeft = 0,
      offsetTop = 0,
      winScroller = getWindowScrollingElement();

  if (el) {
    do {
      var elMatrix = matrix(el),
          scaleX = elMatrix.a,
          scaleY = elMatrix.d;
      offsetLeft += el.scrollLeft * scaleX;
      offsetTop += el.scrollTop * scaleY;
    } while (el !== winScroller && (el = el.parentNode));
  }

  return [offsetLeft, offsetTop];
}
/**
 * Returns the index of the object within the given array
 * @param  {Array} arr   Array that may or may not hold the object
 * @param  {Object} obj  An object that has a key-value pair unique to and identical to a key-value pair in the object you want to find
 * @return {Number}      The index of the object in the array, or -1
 */


function indexOfObject(arr, obj) {
  for (var i in arr) {
    if (!arr.hasOwnProperty(i)) continue;

    for (var key in obj) {
      if (obj.hasOwnProperty(key) && obj[key] === arr[i][key]) return Number(i);
    }
  }

  return -1;
}

function getParentAutoScrollElement(el, includeSelf) {
  // skip to window
  if (!el || !el.getBoundingClientRect) return getWindowScrollingElement();
  var elem = el;
  var gotSelf = false;

  do {
    // we don't need to get elem css if it isn't even overflowing in the first place (performance)
    if (elem.clientWidth < elem.scrollWidth || elem.clientHeight < elem.scrollHeight) {
      var elemCSS = css(elem);

      if (elem.clientWidth < elem.scrollWidth && (elemCSS.overflowX == 'auto' || elemCSS.overflowX == 'scroll') || elem.clientHeight < elem.scrollHeight && (elemCSS.overflowY == 'auto' || elemCSS.overflowY == 'scroll')) {
        if (!elem.getBoundingClientRect || elem === document.body) return getWindowScrollingElement();
        if (gotSelf || includeSelf) return elem;
        gotSelf = true;
      }
    }
    /* jshint boss:true */

  } while (elem = elem.parentNode);

  return getWindowScrollingElement();
}

function extend(dst, src) {
  if (dst && src) {
    for (var key in src) {
      if (src.hasOwnProperty(key)) {
        dst[key] = src[key];
      }
    }
  }

  return dst;
}

function isRectEqual(rect1, rect2) {
  return Math.round(rect1.top) === Math.round(rect2.top) && Math.round(rect1.left) === Math.round(rect2.left) && Math.round(rect1.height) === Math.round(rect2.height) && Math.round(rect1.width) === Math.round(rect2.width);
}

var _throttleTimeout;

function throttle(callback, ms) {
  return function () {
    if (!_throttleTimeout) {
      var args = arguments,
          _this = this;

      if (args.length === 1) {
        callback.call(_this, args[0]);
      } else {
        callback.apply(_this, args);
      }

      _throttleTimeout = setTimeout(function () {
        _throttleTimeout = void 0;
      }, ms);
    }
  };
}

function cancelThrottle() {
  clearTimeout(_throttleTimeout);
  _throttleTimeout = void 0;
}

function scrollBy(el, x, y) {
  el.scrollLeft += x;
  el.scrollTop += y;
}

function clone(el) {
  var Polymer = window.Polymer;
  var $ = window.jQuery || window.Zepto;

  if (Polymer && Polymer.dom) {
    return Polymer.dom(el).cloneNode(true);
  } else if ($) {
    return $(el).clone(true)[0];
  } else {
    return el.cloneNode(true);
  }
}

function setRect(el, rect) {
  css(el, 'position', 'absolute');
  css(el, 'top', rect.top);
  css(el, 'left', rect.left);
  css(el, 'width', rect.width);
  css(el, 'height', rect.height);
}

function unsetRect(el) {
  css(el, 'position', '');
  css(el, 'top', '');
  css(el, 'left', '');
  css(el, 'width', '');
  css(el, 'height', '');
}

var expando = 'Sortable' + new Date().getTime();

function AnimationStateManager() {
  var animationStates = [],
      animationCallbackId;
  return {
    captureAnimationState: function captureAnimationState() {
      animationStates = [];
      if (!this.options.animation) return;
      var children = [].slice.call(this.el.children);
      children.forEach(function (child) {
        if (css(child, 'display') === 'none' || child === Sortable.ghost) return;
        animationStates.push({
          target: child,
          rect: getRect(child)
        });

        var fromRect = _objectSpread2({}, animationStates[animationStates.length - 1].rect); // If animating: compensate for current animation


        if (child.thisAnimationDuration) {
          var childMatrix = matrix(child, true);

          if (childMatrix) {
            fromRect.top -= childMatrix.f;
            fromRect.left -= childMatrix.e;
          }
        }

        child.fromRect = fromRect;
      });
    },
    addAnimationState: function addAnimationState(state) {
      animationStates.push(state);
    },
    removeAnimationState: function removeAnimationState(target) {
      animationStates.splice(indexOfObject(animationStates, {
        target: target
      }), 1);
    },
    animateAll: function animateAll(callback) {
      var _this = this;

      if (!this.options.animation) {
        clearTimeout(animationCallbackId);
        if (typeof callback === 'function') callback();
        return;
      }

      var animating = false,
          animationTime = 0;
      animationStates.forEach(function (state) {
        var time = 0,
            target = state.target,
            fromRect = target.fromRect,
            toRect = getRect(target),
            prevFromRect = target.prevFromRect,
            prevToRect = target.prevToRect,
            animatingRect = state.rect,
            targetMatrix = matrix(target, true);

        if (targetMatrix) {
          // Compensate for current animation
          toRect.top -= targetMatrix.f;
          toRect.left -= targetMatrix.e;
        }

        target.toRect = toRect;

        if (target.thisAnimationDuration) {
          // Could also check if animatingRect is between fromRect and toRect
          if (isRectEqual(prevFromRect, toRect) && !isRectEqual(fromRect, toRect) && // Make sure animatingRect is on line between toRect & fromRect
          (animatingRect.top - toRect.top) / (animatingRect.left - toRect.left) === (fromRect.top - toRect.top) / (fromRect.left - toRect.left)) {
            // If returning to same place as started from animation and on same axis
            time = calculateRealTime(animatingRect, prevFromRect, prevToRect, _this.options);
          }
        } // if fromRect != toRect: animate


        if (!isRectEqual(toRect, fromRect)) {
          target.prevFromRect = fromRect;
          target.prevToRect = toRect;

          if (!time) {
            time = _this.options.animation;
          }

          _this.animate(target, animatingRect, toRect, time);
        }

        if (time) {
          animating = true;
          animationTime = Math.max(animationTime, time);
          clearTimeout(target.animationResetTimer);
          target.animationResetTimer = setTimeout(function () {
            target.animationTime = 0;
            target.prevFromRect = null;
            target.fromRect = null;
            target.prevToRect = null;
            target.thisAnimationDuration = null;
          }, time);
          target.thisAnimationDuration = time;
        }
      });
      clearTimeout(animationCallbackId);

      if (!animating) {
        if (typeof callback === 'function') callback();
      } else {
        animationCallbackId = setTimeout(function () {
          if (typeof callback === 'function') callback();
        }, animationTime);
      }

      animationStates = [];
    },
    animate: function animate(target, currentRect, toRect, duration) {
      if (duration) {
        css(target, 'transition', '');
        css(target, 'transform', '');
        var elMatrix = matrix(this.el),
            scaleX = elMatrix && elMatrix.a,
            scaleY = elMatrix && elMatrix.d,
            translateX = (currentRect.left - toRect.left) / (scaleX || 1),
            translateY = (currentRect.top - toRect.top) / (scaleY || 1);
        target.animatingX = !!translateX;
        target.animatingY = !!translateY;
        css(target, 'transform', 'translate3d(' + translateX + 'px,' + translateY + 'px,0)');
        this.forRepaintDummy = repaint(target); // repaint

        css(target, 'transition', 'transform ' + duration + 'ms' + (this.options.easing ? ' ' + this.options.easing : ''));
        css(target, 'transform', 'translate3d(0,0,0)');
        typeof target.animated === 'number' && clearTimeout(target.animated);
        target.animated = setTimeout(function () {
          css(target, 'transition', '');
          css(target, 'transform', '');
          target.animated = false;
          target.animatingX = false;
          target.animatingY = false;
        }, duration);
      }
    }
  };
}

function repaint(target) {
  return target.offsetWidth;
}

function calculateRealTime(animatingRect, fromRect, toRect, options) {
  return Math.sqrt(Math.pow(fromRect.top - animatingRect.top, 2) + Math.pow(fromRect.left - animatingRect.left, 2)) / Math.sqrt(Math.pow(fromRect.top - toRect.top, 2) + Math.pow(fromRect.left - toRect.left, 2)) * options.animation;
}

var plugins = [];
var defaults = {
  initializeByDefault: true
};
var PluginManager = {
  mount: function mount(plugin) {
    // Set default static properties
    for (var option in defaults) {
      if (defaults.hasOwnProperty(option) && !(option in plugin)) {
        plugin[option] = defaults[option];
      }
    }

    plugins.forEach(function (p) {
      if (p.pluginName === plugin.pluginName) {
        throw "Sortable: Cannot mount plugin ".concat(plugin.pluginName, " more than once");
      }
    });
    plugins.push(plugin);
  },
  pluginEvent: function pluginEvent(eventName, sortable, evt) {
    var _this = this;

    this.eventCanceled = false;

    evt.cancel = function () {
      _this.eventCanceled = true;
    };

    var eventNameGlobal = eventName + 'Global';
    plugins.forEach(function (plugin) {
      if (!sortable[plugin.pluginName]) return; // Fire global events if it exists in this sortable

      if (sortable[plugin.pluginName][eventNameGlobal]) {
        sortable[plugin.pluginName][eventNameGlobal](_objectSpread2({
          sortable: sortable
        }, evt));
      } // Only fire plugin event if plugin is enabled in this sortable,
      // and plugin has event defined


      if (sortable.options[plugin.pluginName] && sortable[plugin.pluginName][eventName]) {
        sortable[plugin.pluginName][eventName](_objectSpread2({
          sortable: sortable
        }, evt));
      }
    });
  },
  initializePlugins: function initializePlugins(sortable, el, defaults, options) {
    plugins.forEach(function (plugin) {
      var pluginName = plugin.pluginName;
      if (!sortable.options[pluginName] && !plugin.initializeByDefault) return;
      var initialized = new plugin(sortable, el, sortable.options);
      initialized.sortable = sortable;
      initialized.options = sortable.options;
      sortable[pluginName] = initialized; // Add default options from plugin

      _extends(defaults, initialized.defaults);
    });

    for (var option in sortable.options) {
      if (!sortable.options.hasOwnProperty(option)) continue;
      var modified = this.modifyOption(sortable, option, sortable.options[option]);

      if (typeof modified !== 'undefined') {
        sortable.options[option] = modified;
      }
    }
  },
  getEventProperties: function getEventProperties(name, sortable) {
    var eventProperties = {};
    plugins.forEach(function (plugin) {
      if (typeof plugin.eventProperties !== 'function') return;

      _extends(eventProperties, plugin.eventProperties.call(sortable[plugin.pluginName], name));
    });
    return eventProperties;
  },
  modifyOption: function modifyOption(sortable, name, value) {
    var modifiedValue;
    plugins.forEach(function (plugin) {
      // Plugin must exist on the Sortable
      if (!sortable[plugin.pluginName]) return; // If static option listener exists for this option, call in the context of the Sortable's instance of this plugin

      if (plugin.optionListeners && typeof plugin.optionListeners[name] === 'function') {
        modifiedValue = plugin.optionListeners[name].call(sortable[plugin.pluginName], value);
      }
    });
    return modifiedValue;
  }
};

function dispatchEvent(_ref) {
  var sortable = _ref.sortable,
      rootEl = _ref.rootEl,
      name = _ref.name,
      targetEl = _ref.targetEl,
      cloneEl = _ref.cloneEl,
      toEl = _ref.toEl,
      fromEl = _ref.fromEl,
      oldIndex = _ref.oldIndex,
      newIndex = _ref.newIndex,
      oldDraggableIndex = _ref.oldDraggableIndex,
      newDraggableIndex = _ref.newDraggableIndex,
      originalEvent = _ref.originalEvent,
      putSortable = _ref.putSortable,
      extraEventProperties = _ref.extraEventProperties;
  sortable = sortable || rootEl && rootEl[expando];
  if (!sortable) return;
  var evt,
      options = sortable.options,
      onName = 'on' + name.charAt(0).toUpperCase() + name.substr(1); // Support for new CustomEvent feature

  if (window.CustomEvent && !IE11OrLess && !Edge) {
    evt = new CustomEvent(name, {
      bubbles: true,
      cancelable: true
    });
  } else {
    evt = document.createEvent('Event');
    evt.initEvent(name, true, true);
  }

  evt.to = toEl || rootEl;
  evt.from = fromEl || rootEl;
  evt.item = targetEl || rootEl;
  evt.clone = cloneEl;
  evt.oldIndex = oldIndex;
  evt.newIndex = newIndex;
  evt.oldDraggableIndex = oldDraggableIndex;
  evt.newDraggableIndex = newDraggableIndex;
  evt.originalEvent = originalEvent;
  evt.pullMode = putSortable ? putSortable.lastPutMode : undefined;

  var allEventProperties = _objectSpread2(_objectSpread2({}, extraEventProperties), PluginManager.getEventProperties(name, sortable));

  for (var option in allEventProperties) {
    evt[option] = allEventProperties[option];
  }

  if (rootEl) {
    rootEl.dispatchEvent(evt);
  }

  if (options[onName]) {
    options[onName].call(sortable, evt);
  }
}

var _excluded = ["evt"];

var pluginEvent = function pluginEvent(eventName, sortable) {
  var _ref = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
      originalEvent = _ref.evt,
      data = _objectWithoutProperties(_ref, _excluded);

  PluginManager.pluginEvent.bind(Sortable)(eventName, sortable, _objectSpread2({
    dragEl: dragEl,
    parentEl: parentEl,
    ghostEl: ghostEl,
    rootEl: rootEl,
    nextEl: nextEl,
    lastDownEl: lastDownEl,
    cloneEl: cloneEl,
    cloneHidden: cloneHidden,
    dragStarted: moved,
    putSortable: putSortable,
    activeSortable: Sortable.active,
    originalEvent: originalEvent,
    oldIndex: oldIndex,
    oldDraggableIndex: oldDraggableIndex,
    newIndex: newIndex,
    newDraggableIndex: newDraggableIndex,
    hideGhostForTarget: _hideGhostForTarget,
    unhideGhostForTarget: _unhideGhostForTarget,
    cloneNowHidden: function cloneNowHidden() {
      cloneHidden = true;
    },
    cloneNowShown: function cloneNowShown() {
      cloneHidden = false;
    },
    dispatchSortableEvent: function dispatchSortableEvent(name) {
      _dispatchEvent({
        sortable: sortable,
        name: name,
        originalEvent: originalEvent
      });
    }
  }, data));
};

function _dispatchEvent(info) {
  dispatchEvent(_objectSpread2({
    putSortable: putSortable,
    cloneEl: cloneEl,
    targetEl: dragEl,
    rootEl: rootEl,
    oldIndex: oldIndex,
    oldDraggableIndex: oldDraggableIndex,
    newIndex: newIndex,
    newDraggableIndex: newDraggableIndex
  }, info));
}

var dragEl,
    parentEl,
    ghostEl,
    rootEl,
    nextEl,
    lastDownEl,
    cloneEl,
    cloneHidden,
    oldIndex,
    newIndex,
    oldDraggableIndex,
    newDraggableIndex,
    activeGroup,
    putSortable,
    awaitingDragStarted = false,
    ignoreNextClick = false,
    sortables = [],
    tapEvt,
    touchEvt,
    lastDx,
    lastDy,
    tapDistanceLeft,
    tapDistanceTop,
    moved,
    lastTarget,
    lastDirection,
    pastFirstInvertThresh = false,
    isCircumstantialInvert = false,
    targetMoveDistance,
    // For positioning ghost absolutely
ghostRelativeParent,
    ghostRelativeParentInitialScroll = [],
    // (left, top)
_silent = false,
    savedInputChecked = [];
/** @const */

var documentExists = typeof document !== 'undefined',
    PositionGhostAbsolutely = IOS,
    CSSFloatProperty = Edge || IE11OrLess ? 'cssFloat' : 'float',
    // This will not pass for IE9, because IE9 DnD only works on anchors
supportDraggable = documentExists && !ChromeForAndroid && !IOS && 'draggable' in document.createElement('div'),
    supportCssPointerEvents = function () {
  if (!documentExists) return; // false when <= IE11

  if (IE11OrLess) {
    return false;
  }

  var el = document.createElement('x');
  el.style.cssText = 'pointer-events:auto';
  return el.style.pointerEvents === 'auto';
}(),
    _detectDirection = function _detectDirection(el, options) {
  var elCSS = css(el),
      elWidth = parseInt(elCSS.width) - parseInt(elCSS.paddingLeft) - parseInt(elCSS.paddingRight) - parseInt(elCSS.borderLeftWidth) - parseInt(elCSS.borderRightWidth),
      child1 = getChild(el, 0, options),
      child2 = getChild(el, 1, options),
      firstChildCSS = child1 && css(child1),
      secondChildCSS = child2 && css(child2),
      firstChildWidth = firstChildCSS && parseInt(firstChildCSS.marginLeft) + parseInt(firstChildCSS.marginRight) + getRect(child1).width,
      secondChildWidth = secondChildCSS && parseInt(secondChildCSS.marginLeft) + parseInt(secondChildCSS.marginRight) + getRect(child2).width;

  if (elCSS.display === 'flex') {
    return elCSS.flexDirection === 'column' || elCSS.flexDirection === 'column-reverse' ? 'vertical' : 'horizontal';
  }

  if (elCSS.display === 'grid') {
    return elCSS.gridTemplateColumns.split(' ').length <= 1 ? 'vertical' : 'horizontal';
  }

  if (child1 && firstChildCSS["float"] && firstChildCSS["float"] !== 'none') {
    var touchingSideChild2 = firstChildCSS["float"] === 'left' ? 'left' : 'right';
    return child2 && (secondChildCSS.clear === 'both' || secondChildCSS.clear === touchingSideChild2) ? 'vertical' : 'horizontal';
  }

  return child1 && (firstChildCSS.display === 'block' || firstChildCSS.display === 'flex' || firstChildCSS.display === 'table' || firstChildCSS.display === 'grid' || firstChildWidth >= elWidth && elCSS[CSSFloatProperty] === 'none' || child2 && elCSS[CSSFloatProperty] === 'none' && firstChildWidth + secondChildWidth > elWidth) ? 'vertical' : 'horizontal';
},
    _dragElInRowColumn = function _dragElInRowColumn(dragRect, targetRect, vertical) {
  var dragElS1Opp = vertical ? dragRect.left : dragRect.top,
      dragElS2Opp = vertical ? dragRect.right : dragRect.bottom,
      dragElOppLength = vertical ? dragRect.width : dragRect.height,
      targetS1Opp = vertical ? targetRect.left : targetRect.top,
      targetS2Opp = vertical ? targetRect.right : targetRect.bottom,
      targetOppLength = vertical ? targetRect.width : targetRect.height;
  return dragElS1Opp === targetS1Opp || dragElS2Opp === targetS2Opp || dragElS1Opp + dragElOppLength / 2 === targetS1Opp + targetOppLength / 2;
},

/**
 * Detects first nearest empty sortable to X and Y position using emptyInsertThreshold.
 * @param  {Number} x      X position
 * @param  {Number} y      Y position
 * @return {HTMLElement}   Element of the first found nearest Sortable
 */
_detectNearestEmptySortable = function _detectNearestEmptySortable(x, y) {
  var ret;
  sortables.some(function (sortable) {
    var threshold = sortable[expando].options.emptyInsertThreshold;
    if (!threshold || lastChild(sortable)) return;
    var rect = getRect(sortable),
        insideHorizontally = x >= rect.left - threshold && x <= rect.right + threshold,
        insideVertically = y >= rect.top - threshold && y <= rect.bottom + threshold;

    if (insideHorizontally && insideVertically) {
      return ret = sortable;
    }
  });
  return ret;
},
    _prepareGroup = function _prepareGroup(options) {
  function toFn(value, pull) {
    return function (to, from, dragEl, evt) {
      var sameGroup = to.options.group.name && from.options.group.name && to.options.group.name === from.options.group.name;

      if (value == null && (pull || sameGroup)) {
        // Default pull value
        // Default pull and put value if same group
        return true;
      } else if (value == null || value === false) {
        return false;
      } else if (pull && value === 'clone') {
        return value;
      } else if (typeof value === 'function') {
        return toFn(value(to, from, dragEl, evt), pull)(to, from, dragEl, evt);
      } else {
        var otherGroup = (pull ? to : from).options.group.name;
        return value === true || typeof value === 'string' && value === otherGroup || value.join && value.indexOf(otherGroup) > -1;
      }
    };
  }

  var group = {};
  var originalGroup = options.group;

  if (!originalGroup || _typeof(originalGroup) != 'object') {
    originalGroup = {
      name: originalGroup
    };
  }

  group.name = originalGroup.name;
  group.checkPull = toFn(originalGroup.pull, true);
  group.checkPut = toFn(originalGroup.put);
  group.revertClone = originalGroup.revertClone;
  options.group = group;
},
    _hideGhostForTarget = function _hideGhostForTarget() {
  if (!supportCssPointerEvents && ghostEl) {
    css(ghostEl, 'display', 'none');
  }
},
    _unhideGhostForTarget = function _unhideGhostForTarget() {
  if (!supportCssPointerEvents && ghostEl) {
    css(ghostEl, 'display', '');
  }
}; // #1184 fix - Prevent click event on fallback if dragged but item not changed position


if (documentExists && !ChromeForAndroid) {
  document.addEventListener('click', function (evt) {
    if (ignoreNextClick) {
      evt.preventDefault();
      evt.stopPropagation && evt.stopPropagation();
      evt.stopImmediatePropagation && evt.stopImmediatePropagation();
      ignoreNextClick = false;
      return false;
    }
  }, true);
}

var nearestEmptyInsertDetectEvent = function nearestEmptyInsertDetectEvent(evt) {
  if (dragEl) {
    evt = evt.touches ? evt.touches[0] : evt;

    var nearest = _detectNearestEmptySortable(evt.clientX, evt.clientY);

    if (nearest) {
      // Create imitation event
      var event = {};

      for (var i in evt) {
        if (evt.hasOwnProperty(i)) {
          event[i] = evt[i];
        }
      }

      event.target = event.rootEl = nearest;
      event.preventDefault = void 0;
      event.stopPropagation = void 0;

      nearest[expando]._onDragOver(event);
    }
  }
};

var _checkOutsideTargetEl = function _checkOutsideTargetEl(evt) {
  if (dragEl) {
    dragEl.parentNode[expando]._isOutsideThisEl(evt.target);
  }
};
/**
 * @class  Sortable
 * @param  {HTMLElement}  el
 * @param  {Object}       [options]
 */


function Sortable(el, options) {
  if (!(el && el.nodeType && el.nodeType === 1)) {
    throw "Sortable: `el` must be an HTMLElement, not ".concat({}.toString.call(el));
  }

  this.el = el; // root element

  this.options = options = _extends({}, options); // Export instance

  el[expando] = this;
  var defaults = {
    group: null,
    sort: true,
    disabled: false,
    store: null,
    handle: null,
    draggable: /^[uo]l$/i.test(el.nodeName) ? '>li' : '>*',
    swapThreshold: 1,
    // percentage; 0 <= x <= 1
    invertSwap: false,
    // invert always
    invertedSwapThreshold: null,
    // will be set to same as swapThreshold if default
    removeCloneOnHide: true,
    direction: function direction() {
      return _detectDirection(el, this.options);
    },
    ghostClass: 'sortable-ghost',
    chosenClass: 'sortable-chosen',
    dragClass: 'sortable-drag',
    ignore: 'a, img',
    filter: null,
    preventOnFilter: true,
    animation: 0,
    easing: null,
    setData: function setData(dataTransfer, dragEl) {
      dataTransfer.setData('Text', dragEl.textContent);
    },
    dropBubble: false,
    dragoverBubble: false,
    dataIdAttr: 'data-id',
    delay: 0,
    delayOnTouchOnly: false,
    touchStartThreshold: (Number.parseInt ? Number : window).parseInt(window.devicePixelRatio, 10) || 1,
    forceFallback: false,
    fallbackClass: 'sortable-fallback',
    fallbackOnBody: false,
    fallbackTolerance: 0,
    fallbackOffset: {
      x: 0,
      y: 0
    },
    supportPointer: Sortable.supportPointer !== false && 'PointerEvent' in window && !Safari,
    emptyInsertThreshold: 5
  };
  PluginManager.initializePlugins(this, el, defaults); // Set default options

  for (var name in defaults) {
    !(name in options) && (options[name] = defaults[name]);
  }

  _prepareGroup(options); // Bind all private methods


  for (var fn in this) {
    if (fn.charAt(0) === '_' && typeof this[fn] === 'function') {
      this[fn] = this[fn].bind(this);
    }
  } // Setup drag mode


  this.nativeDraggable = options.forceFallback ? false : supportDraggable;

  if (this.nativeDraggable) {
    // Touch start threshold cannot be greater than the native dragstart threshold
    this.options.touchStartThreshold = 1;
  } // Bind events


  if (options.supportPointer) {
    on(el, 'pointerdown', this._onTapStart);
  } else {
    on(el, 'mousedown', this._onTapStart);
    on(el, 'touchstart', this._onTapStart);
  }

  if (this.nativeDraggable) {
    on(el, 'dragover', this);
    on(el, 'dragenter', this);
  }

  sortables.push(this.el); // Restore sorting

  options.store && options.store.get && this.sort(options.store.get(this) || []); // Add animation state manager

  _extends(this, AnimationStateManager());
}

Sortable.prototype =
/** @lends Sortable.prototype */
{
  constructor: Sortable,
  _isOutsideThisEl: function _isOutsideThisEl(target) {
    if (!this.el.contains(target) && target !== this.el) {
      lastTarget = null;
    }
  },
  _getDirection: function _getDirection(evt, target) {
    return typeof this.options.direction === 'function' ? this.options.direction.call(this, evt, target, dragEl) : this.options.direction;
  },
  _onTapStart: function _onTapStart(
  /** Event|TouchEvent */
  evt) {
    if (!evt.cancelable) return;

    var _this = this,
        el = this.el,
        options = this.options,
        preventOnFilter = options.preventOnFilter,
        type = evt.type,
        touch = evt.touches && evt.touches[0] || evt.pointerType && evt.pointerType === 'touch' && evt,
        target = (touch || evt).target,
        originalTarget = evt.target.shadowRoot && (evt.path && evt.path[0] || evt.composedPath && evt.composedPath()[0]) || target,
        filter = options.filter;

    _saveInputCheckedState(el); // Don't trigger start event when an element is been dragged, otherwise the evt.oldindex always wrong when set option.group.


    if (dragEl) {
      return;
    }

    if (/mousedown|pointerdown/.test(type) && evt.button !== 0 || options.disabled) {
      return; // only left button and enabled
    } // cancel dnd if original target is content editable


    if (originalTarget.isContentEditable) {
      return;
    } // Safari ignores further event handling after mousedown


    if (!this.nativeDraggable && Safari && target && target.tagName.toUpperCase() === 'SELECT') {
      return;
    }

    target = closest(target, options.draggable, el, false);

    if (target && target.animated) {
      return;
    }

    if (lastDownEl === target) {
      // Ignoring duplicate `down`
      return;
    } // Get the index of the dragged element within its parent


    oldIndex = index(target);
    oldDraggableIndex = index(target, options.draggable); // Check filter

    if (typeof filter === 'function') {
      if (filter.call(this, evt, target, this)) {
        _dispatchEvent({
          sortable: _this,
          rootEl: originalTarget,
          name: 'filter',
          targetEl: target,
          toEl: el,
          fromEl: el
        });

        pluginEvent('filter', _this, {
          evt: evt
        });
        preventOnFilter && evt.cancelable && evt.preventDefault();
        return; // cancel dnd
      }
    } else if (filter) {
      filter = filter.split(',').some(function (criteria) {
        criteria = closest(originalTarget, criteria.trim(), el, false);

        if (criteria) {
          _dispatchEvent({
            sortable: _this,
            rootEl: criteria,
            name: 'filter',
            targetEl: target,
            fromEl: el,
            toEl: el
          });

          pluginEvent('filter', _this, {
            evt: evt
          });
          return true;
        }
      });

      if (filter) {
        preventOnFilter && evt.cancelable && evt.preventDefault();
        return; // cancel dnd
      }
    }

    if (options.handle && !closest(originalTarget, options.handle, el, false)) {
      return;
    } // Prepare `dragstart`


    this._prepareDragStart(evt, touch, target);
  },
  _prepareDragStart: function _prepareDragStart(
  /** Event */
  evt,
  /** Touch */
  touch,
  /** HTMLElement */
  target) {
    var _this = this,
        el = _this.el,
        options = _this.options,
        ownerDocument = el.ownerDocument,
        dragStartFn;

    if (target && !dragEl && target.parentNode === el) {
      var dragRect = getRect(target);
      rootEl = el;
      dragEl = target;
      parentEl = dragEl.parentNode;
      nextEl = dragEl.nextSibling;
      lastDownEl = target;
      activeGroup = options.group;
      Sortable.dragged = dragEl;
      tapEvt = {
        target: dragEl,
        clientX: (touch || evt).clientX,
        clientY: (touch || evt).clientY
      };
      tapDistanceLeft = tapEvt.clientX - dragRect.left;
      tapDistanceTop = tapEvt.clientY - dragRect.top;
      this._lastX = (touch || evt).clientX;
      this._lastY = (touch || evt).clientY;
      dragEl.style['will-change'] = 'all';

      dragStartFn = function dragStartFn() {
        pluginEvent('delayEnded', _this, {
          evt: evt
        });

        if (Sortable.eventCanceled) {
          _this._onDrop();

          return;
        } // Delayed drag has been triggered
        // we can re-enable the events: touchmove/mousemove


        _this._disableDelayedDragEvents();

        if (!FireFox && _this.nativeDraggable) {
          dragEl.draggable = true;
        } // Bind the events: dragstart/dragend


        _this._triggerDragStart(evt, touch); // Drag start event


        _dispatchEvent({
          sortable: _this,
          name: 'choose',
          originalEvent: evt
        }); // Chosen item


        toggleClass(dragEl, options.chosenClass, true);
      }; // Disable "draggable"


      options.ignore.split(',').forEach(function (criteria) {
        find(dragEl, criteria.trim(), _disableDraggable);
      });
      on(ownerDocument, 'dragover', nearestEmptyInsertDetectEvent);
      on(ownerDocument, 'mousemove', nearestEmptyInsertDetectEvent);
      on(ownerDocument, 'touchmove', nearestEmptyInsertDetectEvent);
      on(ownerDocument, 'mouseup', _this._onDrop);
      on(ownerDocument, 'touchend', _this._onDrop);
      on(ownerDocument, 'touchcancel', _this._onDrop); // Make dragEl draggable (must be before delay for FireFox)

      if (FireFox && this.nativeDraggable) {
        this.options.touchStartThreshold = 4;
        dragEl.draggable = true;
      }

      pluginEvent('delayStart', this, {
        evt: evt
      }); // Delay is impossible for native DnD in Edge or IE

      if (options.delay && (!options.delayOnTouchOnly || touch) && (!this.nativeDraggable || !(Edge || IE11OrLess))) {
        if (Sortable.eventCanceled) {
          this._onDrop();

          return;
        } // If the user moves the pointer or let go the click or touch
        // before the delay has been reached:
        // disable the delayed drag


        on(ownerDocument, 'mouseup', _this._disableDelayedDrag);
        on(ownerDocument, 'touchend', _this._disableDelayedDrag);
        on(ownerDocument, 'touchcancel', _this._disableDelayedDrag);
        on(ownerDocument, 'mousemove', _this._delayedDragTouchMoveHandler);
        on(ownerDocument, 'touchmove', _this._delayedDragTouchMoveHandler);
        options.supportPointer && on(ownerDocument, 'pointermove', _this._delayedDragTouchMoveHandler);
        _this._dragStartTimer = setTimeout(dragStartFn, options.delay);
      } else {
        dragStartFn();
      }
    }
  },
  _delayedDragTouchMoveHandler: function _delayedDragTouchMoveHandler(
  /** TouchEvent|PointerEvent **/
  e) {
    var touch = e.touches ? e.touches[0] : e;

    if (Math.max(Math.abs(touch.clientX - this._lastX), Math.abs(touch.clientY - this._lastY)) >= Math.floor(this.options.touchStartThreshold / (this.nativeDraggable && window.devicePixelRatio || 1))) {
      this._disableDelayedDrag();
    }
  },
  _disableDelayedDrag: function _disableDelayedDrag() {
    dragEl && _disableDraggable(dragEl);
    clearTimeout(this._dragStartTimer);

    this._disableDelayedDragEvents();
  },
  _disableDelayedDragEvents: function _disableDelayedDragEvents() {
    var ownerDocument = this.el.ownerDocument;
    off(ownerDocument, 'mouseup', this._disableDelayedDrag);
    off(ownerDocument, 'touchend', this._disableDelayedDrag);
    off(ownerDocument, 'touchcancel', this._disableDelayedDrag);
    off(ownerDocument, 'mousemove', this._delayedDragTouchMoveHandler);
    off(ownerDocument, 'touchmove', this._delayedDragTouchMoveHandler);
    off(ownerDocument, 'pointermove', this._delayedDragTouchMoveHandler);
  },
  _triggerDragStart: function _triggerDragStart(
  /** Event */
  evt,
  /** Touch */
  touch) {
    touch = touch || evt.pointerType == 'touch' && evt;

    if (!this.nativeDraggable || touch) {
      if (this.options.supportPointer) {
        on(document, 'pointermove', this._onTouchMove);
      } else if (touch) {
        on(document, 'touchmove', this._onTouchMove);
      } else {
        on(document, 'mousemove', this._onTouchMove);
      }
    } else {
      on(dragEl, 'dragend', this);
      on(rootEl, 'dragstart', this._onDragStart);
    }

    try {
      if (document.selection) {
        // Timeout neccessary for IE9
        _nextTick(function () {
          document.selection.empty();
        });
      } else {
        window.getSelection().removeAllRanges();
      }
    } catch (err) {}
  },
  _dragStarted: function _dragStarted(fallback, evt) {

    awaitingDragStarted = false;

    if (rootEl && dragEl) {
      pluginEvent('dragStarted', this, {
        evt: evt
      });

      if (this.nativeDraggable) {
        on(document, 'dragover', _checkOutsideTargetEl);
      }

      var options = this.options; // Apply effect

      !fallback && toggleClass(dragEl, options.dragClass, false);
      toggleClass(dragEl, options.ghostClass, true);
      Sortable.active = this;
      fallback && this._appendGhost(); // Drag start event

      _dispatchEvent({
        sortable: this,
        name: 'start',
        originalEvent: evt
      });
    } else {
      this._nulling();
    }
  },
  _emulateDragOver: function _emulateDragOver() {
    if (touchEvt) {
      this._lastX = touchEvt.clientX;
      this._lastY = touchEvt.clientY;

      _hideGhostForTarget();

      var target = document.elementFromPoint(touchEvt.clientX, touchEvt.clientY);
      var parent = target;

      while (target && target.shadowRoot) {
        target = target.shadowRoot.elementFromPoint(touchEvt.clientX, touchEvt.clientY);
        if (target === parent) break;
        parent = target;
      }

      dragEl.parentNode[expando]._isOutsideThisEl(target);

      if (parent) {
        do {
          if (parent[expando]) {
            var inserted = void 0;
            inserted = parent[expando]._onDragOver({
              clientX: touchEvt.clientX,
              clientY: touchEvt.clientY,
              target: target,
              rootEl: parent
            });

            if (inserted && !this.options.dragoverBubble) {
              break;
            }
          }

          target = parent; // store last element
        }
        /* jshint boss:true */
        while (parent = parent.parentNode);
      }

      _unhideGhostForTarget();
    }
  },
  _onTouchMove: function _onTouchMove(
  /**TouchEvent*/
  evt) {
    if (tapEvt) {
      var options = this.options,
          fallbackTolerance = options.fallbackTolerance,
          fallbackOffset = options.fallbackOffset,
          touch = evt.touches ? evt.touches[0] : evt,
          ghostMatrix = ghostEl && matrix(ghostEl, true),
          scaleX = ghostEl && ghostMatrix && ghostMatrix.a,
          scaleY = ghostEl && ghostMatrix && ghostMatrix.d,
          relativeScrollOffset = PositionGhostAbsolutely && ghostRelativeParent && getRelativeScrollOffset(ghostRelativeParent),
          dx = (touch.clientX - tapEvt.clientX + fallbackOffset.x) / (scaleX || 1) + (relativeScrollOffset ? relativeScrollOffset[0] - ghostRelativeParentInitialScroll[0] : 0) / (scaleX || 1),
          dy = (touch.clientY - tapEvt.clientY + fallbackOffset.y) / (scaleY || 1) + (relativeScrollOffset ? relativeScrollOffset[1] - ghostRelativeParentInitialScroll[1] : 0) / (scaleY || 1); // only set the status to dragging, when we are actually dragging

      if (!Sortable.active && !awaitingDragStarted) {
        if (fallbackTolerance && Math.max(Math.abs(touch.clientX - this._lastX), Math.abs(touch.clientY - this._lastY)) < fallbackTolerance) {
          return;
        }

        this._onDragStart(evt, true);
      }

      if (ghostEl) {
        if (ghostMatrix) {
          ghostMatrix.e += dx - (lastDx || 0);
          ghostMatrix.f += dy - (lastDy || 0);
        } else {
          ghostMatrix = {
            a: 1,
            b: 0,
            c: 0,
            d: 1,
            e: dx,
            f: dy
          };
        }

        var cssMatrix = "matrix(".concat(ghostMatrix.a, ",").concat(ghostMatrix.b, ",").concat(ghostMatrix.c, ",").concat(ghostMatrix.d, ",").concat(ghostMatrix.e, ",").concat(ghostMatrix.f, ")");
        css(ghostEl, 'webkitTransform', cssMatrix);
        css(ghostEl, 'mozTransform', cssMatrix);
        css(ghostEl, 'msTransform', cssMatrix);
        css(ghostEl, 'transform', cssMatrix);
        lastDx = dx;
        lastDy = dy;
        touchEvt = touch;
      }

      evt.cancelable && evt.preventDefault();
    }
  },
  _appendGhost: function _appendGhost() {
    // Bug if using scale(): https://stackoverflow.com/questions/2637058
    // Not being adjusted for
    if (!ghostEl) {
      var container = this.options.fallbackOnBody ? document.body : rootEl,
          rect = getRect(dragEl, true, PositionGhostAbsolutely, true, container),
          options = this.options; // Position absolutely

      if (PositionGhostAbsolutely) {
        // Get relatively positioned parent
        ghostRelativeParent = container;

        while (css(ghostRelativeParent, 'position') === 'static' && css(ghostRelativeParent, 'transform') === 'none' && ghostRelativeParent !== document) {
          ghostRelativeParent = ghostRelativeParent.parentNode;
        }

        if (ghostRelativeParent !== document.body && ghostRelativeParent !== document.documentElement) {
          if (ghostRelativeParent === document) ghostRelativeParent = getWindowScrollingElement();
          rect.top += ghostRelativeParent.scrollTop;
          rect.left += ghostRelativeParent.scrollLeft;
        } else {
          ghostRelativeParent = getWindowScrollingElement();
        }

        ghostRelativeParentInitialScroll = getRelativeScrollOffset(ghostRelativeParent);
      }

      ghostEl = dragEl.cloneNode(true);
      toggleClass(ghostEl, options.ghostClass, false);
      toggleClass(ghostEl, options.fallbackClass, true);
      toggleClass(ghostEl, options.dragClass, true);
      css(ghostEl, 'transition', '');
      css(ghostEl, 'transform', '');
      css(ghostEl, 'box-sizing', 'border-box');
      css(ghostEl, 'margin', 0);
      css(ghostEl, 'top', rect.top);
      css(ghostEl, 'left', rect.left);
      css(ghostEl, 'width', rect.width);
      css(ghostEl, 'height', rect.height);
      css(ghostEl, 'opacity', '0.8');
      css(ghostEl, 'position', PositionGhostAbsolutely ? 'absolute' : 'fixed');
      css(ghostEl, 'zIndex', '100000');
      css(ghostEl, 'pointerEvents', 'none');
      Sortable.ghost = ghostEl;
      container.appendChild(ghostEl); // Set transform-origin

      css(ghostEl, 'transform-origin', tapDistanceLeft / parseInt(ghostEl.style.width) * 100 + '% ' + tapDistanceTop / parseInt(ghostEl.style.height) * 100 + '%');
    }
  },
  _onDragStart: function _onDragStart(
  /**Event*/
  evt,
  /**boolean*/
  fallback) {
    var _this = this;

    var dataTransfer = evt.dataTransfer;
    var options = _this.options;
    pluginEvent('dragStart', this, {
      evt: evt
    });

    if (Sortable.eventCanceled) {
      this._onDrop();

      return;
    }

    pluginEvent('setupClone', this);

    if (!Sortable.eventCanceled) {
      cloneEl = clone(dragEl);
      cloneEl.removeAttribute("id");
      cloneEl.draggable = false;
      cloneEl.style['will-change'] = '';

      this._hideClone();

      toggleClass(cloneEl, this.options.chosenClass, false);
      Sortable.clone = cloneEl;
    } // #1143: IFrame support workaround


    _this.cloneId = _nextTick(function () {
      pluginEvent('clone', _this);
      if (Sortable.eventCanceled) return;

      if (!_this.options.removeCloneOnHide) {
        rootEl.insertBefore(cloneEl, dragEl);
      }

      _this._hideClone();

      _dispatchEvent({
        sortable: _this,
        name: 'clone'
      });
    });
    !fallback && toggleClass(dragEl, options.dragClass, true); // Set proper drop events

    if (fallback) {
      ignoreNextClick = true;
      _this._loopId = setInterval(_this._emulateDragOver, 50);
    } else {
      // Undo what was set in _prepareDragStart before drag started
      off(document, 'mouseup', _this._onDrop);
      off(document, 'touchend', _this._onDrop);
      off(document, 'touchcancel', _this._onDrop);

      if (dataTransfer) {
        dataTransfer.effectAllowed = 'move';
        options.setData && options.setData.call(_this, dataTransfer, dragEl);
      }

      on(document, 'drop', _this); // #1276 fix:

      css(dragEl, 'transform', 'translateZ(0)');
    }

    awaitingDragStarted = true;
    _this._dragStartId = _nextTick(_this._dragStarted.bind(_this, fallback, evt));
    on(document, 'selectstart', _this);
    moved = true;

    if (Safari) {
      css(document.body, 'user-select', 'none');
    }
  },
  // Returns true - if no further action is needed (either inserted or another condition)
  _onDragOver: function _onDragOver(
  /**Event*/
  evt) {
    var el = this.el,
        target = evt.target,
        dragRect,
        targetRect,
        revert,
        options = this.options,
        group = options.group,
        activeSortable = Sortable.active,
        isOwner = activeGroup === group,
        canSort = options.sort,
        fromSortable = putSortable || activeSortable,
        vertical,
        _this = this,
        completedFired = false;

    if (_silent) return;

    function dragOverEvent(name, extra) {
      pluginEvent(name, _this, _objectSpread2({
        evt: evt,
        isOwner: isOwner,
        axis: vertical ? 'vertical' : 'horizontal',
        revert: revert,
        dragRect: dragRect,
        targetRect: targetRect,
        canSort: canSort,
        fromSortable: fromSortable,
        target: target,
        completed: completed,
        onMove: function onMove(target, after) {
          return _onMove(rootEl, el, dragEl, dragRect, target, getRect(target), evt, after);
        },
        changed: changed
      }, extra));
    } // Capture animation state


    function capture() {
      dragOverEvent('dragOverAnimationCapture');

      _this.captureAnimationState();

      if (_this !== fromSortable) {
        fromSortable.captureAnimationState();
      }
    } // Return invocation when dragEl is inserted (or completed)


    function completed(insertion) {
      dragOverEvent('dragOverCompleted', {
        insertion: insertion
      });

      if (insertion) {
        // Clones must be hidden before folding animation to capture dragRectAbsolute properly
        if (isOwner) {
          activeSortable._hideClone();
        } else {
          activeSortable._showClone(_this);
        }

        if (_this !== fromSortable) {
          // Set ghost class to new sortable's ghost class
          toggleClass(dragEl, putSortable ? putSortable.options.ghostClass : activeSortable.options.ghostClass, false);
          toggleClass(dragEl, options.ghostClass, true);
        }

        if (putSortable !== _this && _this !== Sortable.active) {
          putSortable = _this;
        } else if (_this === Sortable.active && putSortable) {
          putSortable = null;
        } // Animation


        if (fromSortable === _this) {
          _this._ignoreWhileAnimating = target;
        }

        _this.animateAll(function () {
          dragOverEvent('dragOverAnimationComplete');
          _this._ignoreWhileAnimating = null;
        });

        if (_this !== fromSortable) {
          fromSortable.animateAll();
          fromSortable._ignoreWhileAnimating = null;
        }
      } // Null lastTarget if it is not inside a previously swapped element


      if (target === dragEl && !dragEl.animated || target === el && !target.animated) {
        lastTarget = null;
      } // no bubbling and not fallback


      if (!options.dragoverBubble && !evt.rootEl && target !== document) {
        dragEl.parentNode[expando]._isOutsideThisEl(evt.target); // Do not detect for empty insert if already inserted


        !insertion && nearestEmptyInsertDetectEvent(evt);
      }

      !options.dragoverBubble && evt.stopPropagation && evt.stopPropagation();
      return completedFired = true;
    } // Call when dragEl has been inserted


    function changed() {
      newIndex = index(dragEl);
      newDraggableIndex = index(dragEl, options.draggable);

      _dispatchEvent({
        sortable: _this,
        name: 'change',
        toEl: el,
        newIndex: newIndex,
        newDraggableIndex: newDraggableIndex,
        originalEvent: evt
      });
    }

    if (evt.preventDefault !== void 0) {
      evt.cancelable && evt.preventDefault();
    }

    target = closest(target, options.draggable, el, true);
    dragOverEvent('dragOver');
    if (Sortable.eventCanceled) return completedFired;

    if (dragEl.contains(evt.target) || target.animated && target.animatingX && target.animatingY || _this._ignoreWhileAnimating === target) {
      return completed(false);
    }

    ignoreNextClick = false;

    if (activeSortable && !options.disabled && (isOwner ? canSort || (revert = parentEl !== rootEl) // Reverting item into the original list
    : putSortable === this || (this.lastPutMode = activeGroup.checkPull(this, activeSortable, dragEl, evt)) && group.checkPut(this, activeSortable, dragEl, evt))) {
      vertical = this._getDirection(evt, target) === 'vertical';
      dragRect = getRect(dragEl);
      dragOverEvent('dragOverValid');
      if (Sortable.eventCanceled) return completedFired;

      if (revert) {
        parentEl = rootEl; // actualization

        capture();

        this._hideClone();

        dragOverEvent('revert');

        if (!Sortable.eventCanceled) {
          if (nextEl) {
            rootEl.insertBefore(dragEl, nextEl);
          } else {
            rootEl.appendChild(dragEl);
          }
        }

        return completed(true);
      }

      var elLastChild = lastChild(el, options.draggable);

      if (!elLastChild || _ghostIsLast(evt, vertical, this) && !elLastChild.animated) {
        // Insert to end of list
        // If already at end of list: Do not insert
        if (elLastChild === dragEl) {
          return completed(false);
        } // if there is a last element, it is the target


        if (elLastChild && el === evt.target) {
          target = elLastChild;
        }

        if (target) {
          targetRect = getRect(target);
        }

        if (_onMove(rootEl, el, dragEl, dragRect, target, targetRect, evt, !!target) !== false) {
          capture();

          if (elLastChild && elLastChild.nextSibling) {
            // the last draggable element is not the last node
            el.insertBefore(dragEl, elLastChild.nextSibling);
          } else {
            el.appendChild(dragEl);
          }

          parentEl = el; // actualization

          changed();
          return completed(true);
        }
      } else if (elLastChild && _ghostIsFirst(evt, vertical, this)) {
        // Insert to start of list
        var firstChild = getChild(el, 0, options, true);

        if (firstChild === dragEl) {
          return completed(false);
        }

        target = firstChild;
        targetRect = getRect(target);

        if (_onMove(rootEl, el, dragEl, dragRect, target, targetRect, evt, false) !== false) {
          capture();
          el.insertBefore(dragEl, firstChild);
          parentEl = el; // actualization

          changed();
          return completed(true);
        }
      } else if (target.parentNode === el) {
        targetRect = getRect(target);
        var direction = 0,
            targetBeforeFirstSwap,
            differentLevel = dragEl.parentNode !== el,
            differentRowCol = !_dragElInRowColumn(dragEl.animated && dragEl.toRect || dragRect, target.animated && target.toRect || targetRect, vertical),
            side1 = vertical ? 'top' : 'left',
            scrolledPastTop = isScrolledPast(target, 'top', 'top') || isScrolledPast(dragEl, 'top', 'top'),
            scrollBefore = scrolledPastTop ? scrolledPastTop.scrollTop : void 0;

        if (lastTarget !== target) {
          targetBeforeFirstSwap = targetRect[side1];
          pastFirstInvertThresh = false;
          isCircumstantialInvert = !differentRowCol && options.invertSwap || differentLevel;
        }

        direction = _getSwapDirection(evt, target, targetRect, vertical, differentRowCol ? 1 : options.swapThreshold, options.invertedSwapThreshold == null ? options.swapThreshold : options.invertedSwapThreshold, isCircumstantialInvert, lastTarget === target);
        var sibling;

        if (direction !== 0) {
          // Check if target is beside dragEl in respective direction (ignoring hidden elements)
          var dragIndex = index(dragEl);

          do {
            dragIndex -= direction;
            sibling = parentEl.children[dragIndex];
          } while (sibling && (css(sibling, 'display') === 'none' || sibling === ghostEl));
        } // If dragEl is already beside target: Do not insert


        if (direction === 0 || sibling === target) {
          return completed(false);
        }

        lastTarget = target;
        lastDirection = direction;
        var nextSibling = target.nextElementSibling,
            after = false;
        after = direction === 1;

        var moveVector = _onMove(rootEl, el, dragEl, dragRect, target, targetRect, evt, after);

        if (moveVector !== false) {
          if (moveVector === 1 || moveVector === -1) {
            after = moveVector === 1;
          }

          _silent = true;
          setTimeout(_unsilent, 30);
          capture();

          if (after && !nextSibling) {
            el.appendChild(dragEl);
          } else {
            target.parentNode.insertBefore(dragEl, after ? nextSibling : target);
          } // Undo chrome's scroll adjustment (has no effect on other browsers)


          if (scrolledPastTop) {
            scrollBy(scrolledPastTop, 0, scrollBefore - scrolledPastTop.scrollTop);
          }

          parentEl = dragEl.parentNode; // actualization
          // must be done before animation

          if (targetBeforeFirstSwap !== undefined && !isCircumstantialInvert) {
            targetMoveDistance = Math.abs(targetBeforeFirstSwap - getRect(target)[side1]);
          }

          changed();
          return completed(true);
        }
      }

      if (el.contains(dragEl)) {
        return completed(false);
      }
    }

    return false;
  },
  _ignoreWhileAnimating: null,
  _offMoveEvents: function _offMoveEvents() {
    off(document, 'mousemove', this._onTouchMove);
    off(document, 'touchmove', this._onTouchMove);
    off(document, 'pointermove', this._onTouchMove);
    off(document, 'dragover', nearestEmptyInsertDetectEvent);
    off(document, 'mousemove', nearestEmptyInsertDetectEvent);
    off(document, 'touchmove', nearestEmptyInsertDetectEvent);
  },
  _offUpEvents: function _offUpEvents() {
    var ownerDocument = this.el.ownerDocument;
    off(ownerDocument, 'mouseup', this._onDrop);
    off(ownerDocument, 'touchend', this._onDrop);
    off(ownerDocument, 'pointerup', this._onDrop);
    off(ownerDocument, 'touchcancel', this._onDrop);
    off(document, 'selectstart', this);
  },
  _onDrop: function _onDrop(
  /**Event*/
  evt) {
    var el = this.el,
        options = this.options; // Get the index of the dragged element within its parent

    newIndex = index(dragEl);
    newDraggableIndex = index(dragEl, options.draggable);
    pluginEvent('drop', this, {
      evt: evt
    });
    parentEl = dragEl && dragEl.parentNode; // Get again after plugin event

    newIndex = index(dragEl);
    newDraggableIndex = index(dragEl, options.draggable);

    if (Sortable.eventCanceled) {
      this._nulling();

      return;
    }

    awaitingDragStarted = false;
    isCircumstantialInvert = false;
    pastFirstInvertThresh = false;
    clearInterval(this._loopId);
    clearTimeout(this._dragStartTimer);

    _cancelNextTick(this.cloneId);

    _cancelNextTick(this._dragStartId); // Unbind events


    if (this.nativeDraggable) {
      off(document, 'drop', this);
      off(el, 'dragstart', this._onDragStart);
    }

    this._offMoveEvents();

    this._offUpEvents();

    if (Safari) {
      css(document.body, 'user-select', '');
    }

    css(dragEl, 'transform', '');

    if (evt) {
      if (moved) {
        evt.cancelable && evt.preventDefault();
        !options.dropBubble && evt.stopPropagation();
      }

      ghostEl && ghostEl.parentNode && ghostEl.parentNode.removeChild(ghostEl);

      if (rootEl === parentEl || putSortable && putSortable.lastPutMode !== 'clone') {
        // Remove clone(s)
        cloneEl && cloneEl.parentNode && cloneEl.parentNode.removeChild(cloneEl);
      }

      if (dragEl) {
        if (this.nativeDraggable) {
          off(dragEl, 'dragend', this);
        }

        _disableDraggable(dragEl);

        dragEl.style['will-change'] = ''; // Remove classes
        // ghostClass is added in dragStarted

        if (moved && !awaitingDragStarted) {
          toggleClass(dragEl, putSortable ? putSortable.options.ghostClass : this.options.ghostClass, false);
        }

        toggleClass(dragEl, this.options.chosenClass, false); // Drag stop event

        _dispatchEvent({
          sortable: this,
          name: 'unchoose',
          toEl: parentEl,
          newIndex: null,
          newDraggableIndex: null,
          originalEvent: evt
        });

        if (rootEl !== parentEl) {
          if (newIndex >= 0) {
            // Add event
            _dispatchEvent({
              rootEl: parentEl,
              name: 'add',
              toEl: parentEl,
              fromEl: rootEl,
              originalEvent: evt
            }); // Remove event


            _dispatchEvent({
              sortable: this,
              name: 'remove',
              toEl: parentEl,
              originalEvent: evt
            }); // drag from one list and drop into another


            _dispatchEvent({
              rootEl: parentEl,
              name: 'sort',
              toEl: parentEl,
              fromEl: rootEl,
              originalEvent: evt
            });

            _dispatchEvent({
              sortable: this,
              name: 'sort',
              toEl: parentEl,
              originalEvent: evt
            });
          }

          putSortable && putSortable.save();
        } else {
          if (newIndex !== oldIndex) {
            if (newIndex >= 0) {
              // drag & drop within the same list
              _dispatchEvent({
                sortable: this,
                name: 'update',
                toEl: parentEl,
                originalEvent: evt
              });

              _dispatchEvent({
                sortable: this,
                name: 'sort',
                toEl: parentEl,
                originalEvent: evt
              });
            }
          }
        }

        if (Sortable.active) {
          /* jshint eqnull:true */
          if (newIndex == null || newIndex === -1) {
            newIndex = oldIndex;
            newDraggableIndex = oldDraggableIndex;
          }

          _dispatchEvent({
            sortable: this,
            name: 'end',
            toEl: parentEl,
            originalEvent: evt
          }); // Save sorting


          this.save();
        }
      }
    }

    this._nulling();
  },
  _nulling: function _nulling() {
    pluginEvent('nulling', this);
    rootEl = dragEl = parentEl = ghostEl = nextEl = cloneEl = lastDownEl = cloneHidden = tapEvt = touchEvt = moved = newIndex = newDraggableIndex = oldIndex = oldDraggableIndex = lastTarget = lastDirection = putSortable = activeGroup = Sortable.dragged = Sortable.ghost = Sortable.clone = Sortable.active = null;
    savedInputChecked.forEach(function (el) {
      el.checked = true;
    });
    savedInputChecked.length = lastDx = lastDy = 0;
  },
  handleEvent: function handleEvent(
  /**Event*/
  evt) {
    switch (evt.type) {
      case 'drop':
      case 'dragend':
        this._onDrop(evt);

        break;

      case 'dragenter':
      case 'dragover':
        if (dragEl) {
          this._onDragOver(evt);

          _globalDragOver(evt);
        }

        break;

      case 'selectstart':
        evt.preventDefault();
        break;
    }
  },

  /**
   * Serializes the item into an array of string.
   * @returns {String[]}
   */
  toArray: function toArray() {
    var order = [],
        el,
        children = this.el.children,
        i = 0,
        n = children.length,
        options = this.options;

    for (; i < n; i++) {
      el = children[i];

      if (closest(el, options.draggable, this.el, false)) {
        order.push(el.getAttribute(options.dataIdAttr) || _generateId(el));
      }
    }

    return order;
  },

  /**
   * Sorts the elements according to the array.
   * @param  {String[]}  order  order of the items
   */
  sort: function sort(order, useAnimation) {
    var items = {},
        rootEl = this.el;
    this.toArray().forEach(function (id, i) {
      var el = rootEl.children[i];

      if (closest(el, this.options.draggable, rootEl, false)) {
        items[id] = el;
      }
    }, this);
    useAnimation && this.captureAnimationState();
    order.forEach(function (id) {
      if (items[id]) {
        rootEl.removeChild(items[id]);
        rootEl.appendChild(items[id]);
      }
    });
    useAnimation && this.animateAll();
  },

  /**
   * Save the current sorting
   */
  save: function save() {
    var store = this.options.store;
    store && store.set && store.set(this);
  },

  /**
   * For each element in the set, get the first element that matches the selector by testing the element itself and traversing up through its ancestors in the DOM tree.
   * @param   {HTMLElement}  el
   * @param   {String}       [selector]  default: `options.draggable`
   * @returns {HTMLElement|null}
   */
  closest: function closest$1(el, selector) {
    return closest(el, selector || this.options.draggable, this.el, false);
  },

  /**
   * Set/get option
   * @param   {string} name
   * @param   {*}      [value]
   * @returns {*}
   */
  option: function option(name, value) {
    var options = this.options;

    if (value === void 0) {
      return options[name];
    } else {
      var modifiedValue = PluginManager.modifyOption(this, name, value);

      if (typeof modifiedValue !== 'undefined') {
        options[name] = modifiedValue;
      } else {
        options[name] = value;
      }

      if (name === 'group') {
        _prepareGroup(options);
      }
    }
  },

  /**
   * Destroy
   */
  destroy: function destroy() {
    pluginEvent('destroy', this);
    var el = this.el;
    el[expando] = null;
    off(el, 'mousedown', this._onTapStart);
    off(el, 'touchstart', this._onTapStart);
    off(el, 'pointerdown', this._onTapStart);

    if (this.nativeDraggable) {
      off(el, 'dragover', this);
      off(el, 'dragenter', this);
    } // Remove draggable attributes


    Array.prototype.forEach.call(el.querySelectorAll('[draggable]'), function (el) {
      el.removeAttribute('draggable');
    });

    this._onDrop();

    this._disableDelayedDragEvents();

    sortables.splice(sortables.indexOf(this.el), 1);
    this.el = el = null;
  },
  _hideClone: function _hideClone() {
    if (!cloneHidden) {
      pluginEvent('hideClone', this);
      if (Sortable.eventCanceled) return;
      css(cloneEl, 'display', 'none');

      if (this.options.removeCloneOnHide && cloneEl.parentNode) {
        cloneEl.parentNode.removeChild(cloneEl);
      }

      cloneHidden = true;
    }
  },
  _showClone: function _showClone(putSortable) {
    if (putSortable.lastPutMode !== 'clone') {
      this._hideClone();

      return;
    }

    if (cloneHidden) {
      pluginEvent('showClone', this);
      if (Sortable.eventCanceled) return; // show clone at dragEl or original position

      if (dragEl.parentNode == rootEl && !this.options.group.revertClone) {
        rootEl.insertBefore(cloneEl, dragEl);
      } else if (nextEl) {
        rootEl.insertBefore(cloneEl, nextEl);
      } else {
        rootEl.appendChild(cloneEl);
      }

      if (this.options.group.revertClone) {
        this.animate(dragEl, cloneEl);
      }

      css(cloneEl, 'display', '');
      cloneHidden = false;
    }
  }
};

function _globalDragOver(
/**Event*/
evt) {
  if (evt.dataTransfer) {
    evt.dataTransfer.dropEffect = 'move';
  }

  evt.cancelable && evt.preventDefault();
}

function _onMove(fromEl, toEl, dragEl, dragRect, targetEl, targetRect, originalEvent, willInsertAfter) {
  var evt,
      sortable = fromEl[expando],
      onMoveFn = sortable.options.onMove,
      retVal; // Support for new CustomEvent feature

  if (window.CustomEvent && !IE11OrLess && !Edge) {
    evt = new CustomEvent('move', {
      bubbles: true,
      cancelable: true
    });
  } else {
    evt = document.createEvent('Event');
    evt.initEvent('move', true, true);
  }

  evt.to = toEl;
  evt.from = fromEl;
  evt.dragged = dragEl;
  evt.draggedRect = dragRect;
  evt.related = targetEl || toEl;
  evt.relatedRect = targetRect || getRect(toEl);
  evt.willInsertAfter = willInsertAfter;
  evt.originalEvent = originalEvent;
  fromEl.dispatchEvent(evt);

  if (onMoveFn) {
    retVal = onMoveFn.call(sortable, evt, originalEvent);
  }

  return retVal;
}

function _disableDraggable(el) {
  el.draggable = false;
}

function _unsilent() {
  _silent = false;
}

function _ghostIsFirst(evt, vertical, sortable) {
  var rect = getRect(getChild(sortable.el, 0, sortable.options, true));
  var spacer = 10;
  return vertical ? evt.clientX < rect.left - spacer || evt.clientY < rect.top && evt.clientX < rect.right : evt.clientY < rect.top - spacer || evt.clientY < rect.bottom && evt.clientX < rect.left;
}

function _ghostIsLast(evt, vertical, sortable) {
  var rect = getRect(lastChild(sortable.el, sortable.options.draggable));
  var spacer = 10;
  return vertical ? evt.clientX > rect.right + spacer || evt.clientX <= rect.right && evt.clientY > rect.bottom && evt.clientX >= rect.left : evt.clientX > rect.right && evt.clientY > rect.top || evt.clientX <= rect.right && evt.clientY > rect.bottom + spacer;
}

function _getSwapDirection(evt, target, targetRect, vertical, swapThreshold, invertedSwapThreshold, invertSwap, isLastTarget) {
  var mouseOnAxis = vertical ? evt.clientY : evt.clientX,
      targetLength = vertical ? targetRect.height : targetRect.width,
      targetS1 = vertical ? targetRect.top : targetRect.left,
      targetS2 = vertical ? targetRect.bottom : targetRect.right,
      invert = false;

  if (!invertSwap) {
    // Never invert or create dragEl shadow when target movemenet causes mouse to move past the end of regular swapThreshold
    if (isLastTarget && targetMoveDistance < targetLength * swapThreshold) {
      // multiplied only by swapThreshold because mouse will already be inside target by (1 - threshold) * targetLength / 2
      // check if past first invert threshold on side opposite of lastDirection
      if (!pastFirstInvertThresh && (lastDirection === 1 ? mouseOnAxis > targetS1 + targetLength * invertedSwapThreshold / 2 : mouseOnAxis < targetS2 - targetLength * invertedSwapThreshold / 2)) {
        // past first invert threshold, do not restrict inverted threshold to dragEl shadow
        pastFirstInvertThresh = true;
      }

      if (!pastFirstInvertThresh) {
        // dragEl shadow (target move distance shadow)
        if (lastDirection === 1 ? mouseOnAxis < targetS1 + targetMoveDistance // over dragEl shadow
        : mouseOnAxis > targetS2 - targetMoveDistance) {
          return -lastDirection;
        }
      } else {
        invert = true;
      }
    } else {
      // Regular
      if (mouseOnAxis > targetS1 + targetLength * (1 - swapThreshold) / 2 && mouseOnAxis < targetS2 - targetLength * (1 - swapThreshold) / 2) {
        return _getInsertDirection(target);
      }
    }
  }

  invert = invert || invertSwap;

  if (invert) {
    // Invert of regular
    if (mouseOnAxis < targetS1 + targetLength * invertedSwapThreshold / 2 || mouseOnAxis > targetS2 - targetLength * invertedSwapThreshold / 2) {
      return mouseOnAxis > targetS1 + targetLength / 2 ? 1 : -1;
    }
  }

  return 0;
}
/**
 * Gets the direction dragEl must be swapped relative to target in order to make it
 * seem that dragEl has been "inserted" into that element's position
 * @param  {HTMLElement} target       The target whose position dragEl is being inserted at
 * @return {Number}                   Direction dragEl must be swapped
 */


function _getInsertDirection(target) {
  if (index(dragEl) < index(target)) {
    return 1;
  } else {
    return -1;
  }
}
/**
 * Generate id
 * @param   {HTMLElement} el
 * @returns {String}
 * @private
 */


function _generateId(el) {
  var str = el.tagName + el.className + el.src + el.href + el.textContent,
      i = str.length,
      sum = 0;

  while (i--) {
    sum += str.charCodeAt(i);
  }

  return sum.toString(36);
}

function _saveInputCheckedState(root) {
  savedInputChecked.length = 0;
  var inputs = root.getElementsByTagName('input');
  var idx = inputs.length;

  while (idx--) {
    var el = inputs[idx];
    el.checked && savedInputChecked.push(el);
  }
}

function _nextTick(fn) {
  return setTimeout(fn, 0);
}

function _cancelNextTick(id) {
  return clearTimeout(id);
} // Fixed #973:


if (documentExists) {
  on(document, 'touchmove', function (evt) {
    if ((Sortable.active || awaitingDragStarted) && evt.cancelable) {
      evt.preventDefault();
    }
  });
} // Export utils


Sortable.utils = {
  on: on,
  off: off,
  css: css,
  find: find,
  is: function is(el, selector) {
    return !!closest(el, selector, el, false);
  },
  extend: extend,
  throttle: throttle,
  closest: closest,
  toggleClass: toggleClass,
  clone: clone,
  index: index,
  nextTick: _nextTick,
  cancelNextTick: _cancelNextTick,
  detectDirection: _detectDirection,
  getChild: getChild
};
/**
 * Get the Sortable instance of an element
 * @param  {HTMLElement} element The element
 * @return {Sortable|undefined}         The instance of Sortable
 */

Sortable.get = function (element) {
  return element[expando];
};
/**
 * Mount a plugin to Sortable
 * @param  {...SortablePlugin|SortablePlugin[]} plugins       Plugins being mounted
 */


Sortable.mount = function () {
  for (var _len = arguments.length, plugins = new Array(_len), _key = 0; _key < _len; _key++) {
    plugins[_key] = arguments[_key];
  }

  if (plugins[0].constructor === Array) plugins = plugins[0];
  plugins.forEach(function (plugin) {
    if (!plugin.prototype || !plugin.prototype.constructor) {
      throw "Sortable: Mounted plugin must be a constructor function, not ".concat({}.toString.call(plugin));
    }

    if (plugin.utils) Sortable.utils = _objectSpread2(_objectSpread2({}, Sortable.utils), plugin.utils);
    PluginManager.mount(plugin);
  });
};
/**
 * Create sortable instance
 * @param {HTMLElement}  el
 * @param {Object}      [options]
 */


Sortable.create = function (el, options) {
  return new Sortable(el, options);
}; // Export


Sortable.version = version;

var autoScrolls = [],
    scrollEl,
    scrollRootEl,
    scrolling = false,
    lastAutoScrollX,
    lastAutoScrollY,
    touchEvt$1,
    pointerElemChangedInterval;

function AutoScrollPlugin() {
  function AutoScroll() {
    this.defaults = {
      scroll: true,
      forceAutoScrollFallback: false,
      scrollSensitivity: 30,
      scrollSpeed: 10,
      bubbleScroll: true
    }; // Bind all private methods

    for (var fn in this) {
      if (fn.charAt(0) === '_' && typeof this[fn] === 'function') {
        this[fn] = this[fn].bind(this);
      }
    }
  }

  AutoScroll.prototype = {
    dragStarted: function dragStarted(_ref) {
      var originalEvent = _ref.originalEvent;

      if (this.sortable.nativeDraggable) {
        on(document, 'dragover', this._handleAutoScroll);
      } else {
        if (this.options.supportPointer) {
          on(document, 'pointermove', this._handleFallbackAutoScroll);
        } else if (originalEvent.touches) {
          on(document, 'touchmove', this._handleFallbackAutoScroll);
        } else {
          on(document, 'mousemove', this._handleFallbackAutoScroll);
        }
      }
    },
    dragOverCompleted: function dragOverCompleted(_ref2) {
      var originalEvent = _ref2.originalEvent;

      // For when bubbling is canceled and using fallback (fallback 'touchmove' always reached)
      if (!this.options.dragOverBubble && !originalEvent.rootEl) {
        this._handleAutoScroll(originalEvent);
      }
    },
    drop: function drop() {
      if (this.sortable.nativeDraggable) {
        off(document, 'dragover', this._handleAutoScroll);
      } else {
        off(document, 'pointermove', this._handleFallbackAutoScroll);
        off(document, 'touchmove', this._handleFallbackAutoScroll);
        off(document, 'mousemove', this._handleFallbackAutoScroll);
      }

      clearPointerElemChangedInterval();
      clearAutoScrolls();
      cancelThrottle();
    },
    nulling: function nulling() {
      touchEvt$1 = scrollRootEl = scrollEl = scrolling = pointerElemChangedInterval = lastAutoScrollX = lastAutoScrollY = null;
      autoScrolls.length = 0;
    },
    _handleFallbackAutoScroll: function _handleFallbackAutoScroll(evt) {
      this._handleAutoScroll(evt, true);
    },
    _handleAutoScroll: function _handleAutoScroll(evt, fallback) {
      var _this = this;

      var x = (evt.touches ? evt.touches[0] : evt).clientX,
          y = (evt.touches ? evt.touches[0] : evt).clientY,
          elem = document.elementFromPoint(x, y);
      touchEvt$1 = evt; // IE does not seem to have native autoscroll,
      // Edge's autoscroll seems too conditional,
      // MACOS Safari does not have autoscroll,
      // Firefox and Chrome are good

      if (fallback || this.options.forceAutoScrollFallback || Edge || IE11OrLess || Safari) {
        autoScroll(evt, this.options, elem, fallback); // Listener for pointer element change

        var ogElemScroller = getParentAutoScrollElement(elem, true);

        if (scrolling && (!pointerElemChangedInterval || x !== lastAutoScrollX || y !== lastAutoScrollY)) {
          pointerElemChangedInterval && clearPointerElemChangedInterval(); // Detect for pointer elem change, emulating native DnD behaviour

          pointerElemChangedInterval = setInterval(function () {
            var newElem = getParentAutoScrollElement(document.elementFromPoint(x, y), true);

            if (newElem !== ogElemScroller) {
              ogElemScroller = newElem;
              clearAutoScrolls();
            }

            autoScroll(evt, _this.options, newElem, fallback);
          }, 10);
          lastAutoScrollX = x;
          lastAutoScrollY = y;
        }
      } else {
        // if DnD is enabled (and browser has good autoscrolling), first autoscroll will already scroll, so get parent autoscroll of first autoscroll
        if (!this.options.bubbleScroll || getParentAutoScrollElement(elem, true) === getWindowScrollingElement()) {
          clearAutoScrolls();
          return;
        }

        autoScroll(evt, this.options, getParentAutoScrollElement(elem, false), false);
      }
    }
  };
  return _extends(AutoScroll, {
    pluginName: 'scroll',
    initializeByDefault: true
  });
}

function clearAutoScrolls() {
  autoScrolls.forEach(function (autoScroll) {
    clearInterval(autoScroll.pid);
  });
  autoScrolls = [];
}

function clearPointerElemChangedInterval() {
  clearInterval(pointerElemChangedInterval);
}

var autoScroll = throttle(function (evt, options, rootEl, isFallback) {
  // Bug: https://bugzilla.mozilla.org/show_bug.cgi?id=505521
  if (!options.scroll) return;
  var x = (evt.touches ? evt.touches[0] : evt).clientX,
      y = (evt.touches ? evt.touches[0] : evt).clientY,
      sens = options.scrollSensitivity,
      speed = options.scrollSpeed,
      winScroller = getWindowScrollingElement();
  var scrollThisInstance = false,
      scrollCustomFn; // New scroll root, set scrollEl

  if (scrollRootEl !== rootEl) {
    scrollRootEl = rootEl;
    clearAutoScrolls();
    scrollEl = options.scroll;
    scrollCustomFn = options.scrollFn;

    if (scrollEl === true) {
      scrollEl = getParentAutoScrollElement(rootEl, true);
    }
  }

  var layersOut = 0;
  var currentParent = scrollEl;

  do {
    var el = currentParent,
        rect = getRect(el),
        top = rect.top,
        bottom = rect.bottom,
        left = rect.left,
        right = rect.right,
        width = rect.width,
        height = rect.height,
        canScrollX = void 0,
        canScrollY = void 0,
        scrollWidth = el.scrollWidth,
        scrollHeight = el.scrollHeight,
        elCSS = css(el),
        scrollPosX = el.scrollLeft,
        scrollPosY = el.scrollTop;

    if (el === winScroller) {
      canScrollX = width < scrollWidth && (elCSS.overflowX === 'auto' || elCSS.overflowX === 'scroll' || elCSS.overflowX === 'visible');
      canScrollY = height < scrollHeight && (elCSS.overflowY === 'auto' || elCSS.overflowY === 'scroll' || elCSS.overflowY === 'visible');
    } else {
      canScrollX = width < scrollWidth && (elCSS.overflowX === 'auto' || elCSS.overflowX === 'scroll');
      canScrollY = height < scrollHeight && (elCSS.overflowY === 'auto' || elCSS.overflowY === 'scroll');
    }

    var vx = canScrollX && (Math.abs(right - x) <= sens && scrollPosX + width < scrollWidth) - (Math.abs(left - x) <= sens && !!scrollPosX);
    var vy = canScrollY && (Math.abs(bottom - y) <= sens && scrollPosY + height < scrollHeight) - (Math.abs(top - y) <= sens && !!scrollPosY);

    if (!autoScrolls[layersOut]) {
      for (var i = 0; i <= layersOut; i++) {
        if (!autoScrolls[i]) {
          autoScrolls[i] = {};
        }
      }
    }

    if (autoScrolls[layersOut].vx != vx || autoScrolls[layersOut].vy != vy || autoScrolls[layersOut].el !== el) {
      autoScrolls[layersOut].el = el;
      autoScrolls[layersOut].vx = vx;
      autoScrolls[layersOut].vy = vy;
      clearInterval(autoScrolls[layersOut].pid);

      if (vx != 0 || vy != 0) {
        scrollThisInstance = true;
        /* jshint loopfunc:true */

        autoScrolls[layersOut].pid = setInterval(function () {
          // emulate drag over during autoscroll (fallback), emulating native DnD behaviour
          if (isFallback && this.layer === 0) {
            Sortable.active._onTouchMove(touchEvt$1); // To move ghost if it is positioned absolutely

          }

          var scrollOffsetY = autoScrolls[this.layer].vy ? autoScrolls[this.layer].vy * speed : 0;
          var scrollOffsetX = autoScrolls[this.layer].vx ? autoScrolls[this.layer].vx * speed : 0;

          if (typeof scrollCustomFn === 'function') {
            if (scrollCustomFn.call(Sortable.dragged.parentNode[expando], scrollOffsetX, scrollOffsetY, evt, touchEvt$1, autoScrolls[this.layer].el) !== 'continue') {
              return;
            }
          }

          scrollBy(autoScrolls[this.layer].el, scrollOffsetX, scrollOffsetY);
        }.bind({
          layer: layersOut
        }), 24);
      }
    }

    layersOut++;
  } while (options.bubbleScroll && currentParent !== winScroller && (currentParent = getParentAutoScrollElement(currentParent, false)));

  scrolling = scrollThisInstance; // in case another function catches scrolling as false in between when it is not
}, 30);

var drop = function drop(_ref) {
  var originalEvent = _ref.originalEvent,
      putSortable = _ref.putSortable,
      dragEl = _ref.dragEl,
      activeSortable = _ref.activeSortable,
      dispatchSortableEvent = _ref.dispatchSortableEvent,
      hideGhostForTarget = _ref.hideGhostForTarget,
      unhideGhostForTarget = _ref.unhideGhostForTarget;
  if (!originalEvent) return;
  var toSortable = putSortable || activeSortable;
  hideGhostForTarget();
  var touch = originalEvent.changedTouches && originalEvent.changedTouches.length ? originalEvent.changedTouches[0] : originalEvent;
  var target = document.elementFromPoint(touch.clientX, touch.clientY);
  unhideGhostForTarget();

  if (toSortable && !toSortable.el.contains(target)) {
    dispatchSortableEvent('spill');
    this.onSpill({
      dragEl: dragEl,
      putSortable: putSortable
    });
  }
};

function Revert() {}

Revert.prototype = {
  startIndex: null,
  dragStart: function dragStart(_ref2) {
    var oldDraggableIndex = _ref2.oldDraggableIndex;
    this.startIndex = oldDraggableIndex;
  },
  onSpill: function onSpill(_ref3) {
    var dragEl = _ref3.dragEl,
        putSortable = _ref3.putSortable;
    this.sortable.captureAnimationState();

    if (putSortable) {
      putSortable.captureAnimationState();
    }

    var nextSibling = getChild(this.sortable.el, this.startIndex, this.options);

    if (nextSibling) {
      this.sortable.el.insertBefore(dragEl, nextSibling);
    } else {
      this.sortable.el.appendChild(dragEl);
    }

    this.sortable.animateAll();

    if (putSortable) {
      putSortable.animateAll();
    }
  },
  drop: drop
};

_extends(Revert, {
  pluginName: 'revertOnSpill'
});

function Remove() {}

Remove.prototype = {
  onSpill: function onSpill(_ref4) {
    var dragEl = _ref4.dragEl,
        putSortable = _ref4.putSortable;
    var parentSortable = putSortable || this.sortable;
    parentSortable.captureAnimationState();
    dragEl.parentNode && dragEl.parentNode.removeChild(dragEl);
    parentSortable.animateAll();
  },
  drop: drop
};

_extends(Remove, {
  pluginName: 'removeOnSpill'
});

var lastSwapEl;

function SwapPlugin() {
  function Swap() {
    this.defaults = {
      swapClass: 'sortable-swap-highlight'
    };
  }

  Swap.prototype = {
    dragStart: function dragStart(_ref) {
      var dragEl = _ref.dragEl;
      lastSwapEl = dragEl;
    },
    dragOverValid: function dragOverValid(_ref2) {
      var completed = _ref2.completed,
          target = _ref2.target,
          onMove = _ref2.onMove,
          activeSortable = _ref2.activeSortable,
          changed = _ref2.changed,
          cancel = _ref2.cancel;
      if (!activeSortable.options.swap) return;
      var el = this.sortable.el,
          options = this.options;

      if (target && target !== el) {
        var prevSwapEl = lastSwapEl;

        if (onMove(target) !== false) {
          toggleClass(target, options.swapClass, true);
          lastSwapEl = target;
        } else {
          lastSwapEl = null;
        }

        if (prevSwapEl && prevSwapEl !== lastSwapEl) {
          toggleClass(prevSwapEl, options.swapClass, false);
        }
      }

      changed();
      completed(true);
      cancel();
    },
    drop: function drop(_ref3) {
      var activeSortable = _ref3.activeSortable,
          putSortable = _ref3.putSortable,
          dragEl = _ref3.dragEl;
      var toSortable = putSortable || this.sortable;
      var options = this.options;
      lastSwapEl && toggleClass(lastSwapEl, options.swapClass, false);

      if (lastSwapEl && (options.swap || putSortable && putSortable.options.swap)) {
        if (dragEl !== lastSwapEl) {
          toSortable.captureAnimationState();
          if (toSortable !== activeSortable) activeSortable.captureAnimationState();
          swapNodes(dragEl, lastSwapEl);
          toSortable.animateAll();
          if (toSortable !== activeSortable) activeSortable.animateAll();
        }
      }
    },
    nulling: function nulling() {
      lastSwapEl = null;
    }
  };
  return _extends(Swap, {
    pluginName: 'swap',
    eventProperties: function eventProperties() {
      return {
        swapItem: lastSwapEl
      };
    }
  });
}

function swapNodes(n1, n2) {
  var p1 = n1.parentNode,
      p2 = n2.parentNode,
      i1,
      i2;
  if (!p1 || !p2 || p1.isEqualNode(n2) || p2.isEqualNode(n1)) return;
  i1 = index(n1);
  i2 = index(n2);

  if (p1.isEqualNode(p2) && i1 < i2) {
    i2++;
  }

  p1.insertBefore(n2, p1.children[i1]);
  p2.insertBefore(n1, p2.children[i2]);
}

var multiDragElements = [],
    multiDragClones = [],
    lastMultiDragSelect,
    // for selection with modifier key down (SHIFT)
multiDragSortable,
    initialFolding = false,
    // Initial multi-drag fold when drag started
folding = false,
    // Folding any other time
dragStarted = false,
    dragEl$1,
    clonesFromRect,
    clonesHidden;

function MultiDragPlugin() {
  function MultiDrag(sortable) {
    // Bind all private methods
    for (var fn in this) {
      if (fn.charAt(0) === '_' && typeof this[fn] === 'function') {
        this[fn] = this[fn].bind(this);
      }
    }

    if (!sortable.options.avoidImplicitDeselect) {
      if (sortable.options.supportPointer) {
        on(document, 'pointerup', this._deselectMultiDrag);
      } else {
        on(document, 'mouseup', this._deselectMultiDrag);
        on(document, 'touchend', this._deselectMultiDrag);
      }
    }

    on(document, 'keydown', this._checkKeyDown);
    on(document, 'keyup', this._checkKeyUp);
    this.defaults = {
      selectedClass: 'sortable-selected',
      multiDragKey: null,
      avoidImplicitDeselect: false,
      setData: function setData(dataTransfer, dragEl) {
        var data = '';

        if (multiDragElements.length && multiDragSortable === sortable) {
          multiDragElements.forEach(function (multiDragElement, i) {
            data += (!i ? '' : ', ') + multiDragElement.textContent;
          });
        } else {
          data = dragEl.textContent;
        }

        dataTransfer.setData('Text', data);
      }
    };
  }

  MultiDrag.prototype = {
    multiDragKeyDown: false,
    isMultiDrag: false,
    delayStartGlobal: function delayStartGlobal(_ref) {
      var dragged = _ref.dragEl;
      dragEl$1 = dragged;
    },
    delayEnded: function delayEnded() {
      this.isMultiDrag = ~multiDragElements.indexOf(dragEl$1);
    },
    setupClone: function setupClone(_ref2) {
      var sortable = _ref2.sortable,
          cancel = _ref2.cancel;
      if (!this.isMultiDrag) return;

      for (var i = 0; i < multiDragElements.length; i++) {
        multiDragClones.push(clone(multiDragElements[i]));
        multiDragClones[i].sortableIndex = multiDragElements[i].sortableIndex;
        multiDragClones[i].draggable = false;
        multiDragClones[i].style['will-change'] = '';
        toggleClass(multiDragClones[i], this.options.selectedClass, false);
        multiDragElements[i] === dragEl$1 && toggleClass(multiDragClones[i], this.options.chosenClass, false);
      }

      sortable._hideClone();

      cancel();
    },
    clone: function clone(_ref3) {
      var sortable = _ref3.sortable,
          rootEl = _ref3.rootEl,
          dispatchSortableEvent = _ref3.dispatchSortableEvent,
          cancel = _ref3.cancel;
      if (!this.isMultiDrag) return;

      if (!this.options.removeCloneOnHide) {
        if (multiDragElements.length && multiDragSortable === sortable) {
          insertMultiDragClones(true, rootEl);
          dispatchSortableEvent('clone');
          cancel();
        }
      }
    },
    showClone: function showClone(_ref4) {
      var cloneNowShown = _ref4.cloneNowShown,
          rootEl = _ref4.rootEl,
          cancel = _ref4.cancel;
      if (!this.isMultiDrag) return;
      insertMultiDragClones(false, rootEl);
      multiDragClones.forEach(function (clone) {
        css(clone, 'display', '');
      });
      cloneNowShown();
      clonesHidden = false;
      cancel();
    },
    hideClone: function hideClone(_ref5) {
      var _this = this;

      var sortable = _ref5.sortable,
          cloneNowHidden = _ref5.cloneNowHidden,
          cancel = _ref5.cancel;
      if (!this.isMultiDrag) return;
      multiDragClones.forEach(function (clone) {
        css(clone, 'display', 'none');

        if (_this.options.removeCloneOnHide && clone.parentNode) {
          clone.parentNode.removeChild(clone);
        }
      });
      cloneNowHidden();
      clonesHidden = true;
      cancel();
    },
    dragStartGlobal: function dragStartGlobal(_ref6) {
      var sortable = _ref6.sortable;

      if (!this.isMultiDrag && multiDragSortable) {
        multiDragSortable.multiDrag._deselectMultiDrag();
      }

      multiDragElements.forEach(function (multiDragElement) {
        multiDragElement.sortableIndex = index(multiDragElement);
      }); // Sort multi-drag elements

      multiDragElements = multiDragElements.sort(function (a, b) {
        return a.sortableIndex - b.sortableIndex;
      });
      dragStarted = true;
    },
    dragStarted: function dragStarted(_ref7) {
      var _this2 = this;

      var sortable = _ref7.sortable;
      if (!this.isMultiDrag) return;

      if (this.options.sort) {
        // Capture rects,
        // hide multi drag elements (by positioning them absolute),
        // set multi drag elements rects to dragRect,
        // show multi drag elements,
        // animate to rects,
        // unset rects & remove from DOM
        sortable.captureAnimationState();

        if (this.options.animation) {
          multiDragElements.forEach(function (multiDragElement) {
            if (multiDragElement === dragEl$1) return;
            css(multiDragElement, 'position', 'absolute');
          });
          var dragRect = getRect(dragEl$1, false, true, true);
          multiDragElements.forEach(function (multiDragElement) {
            if (multiDragElement === dragEl$1) return;
            setRect(multiDragElement, dragRect);
          });
          folding = true;
          initialFolding = true;
        }
      }

      sortable.animateAll(function () {
        folding = false;
        initialFolding = false;

        if (_this2.options.animation) {
          multiDragElements.forEach(function (multiDragElement) {
            unsetRect(multiDragElement);
          });
        } // Remove all auxiliary multidrag items from el, if sorting enabled


        if (_this2.options.sort) {
          removeMultiDragElements();
        }
      });
    },
    dragOver: function dragOver(_ref8) {
      var target = _ref8.target,
          completed = _ref8.completed,
          cancel = _ref8.cancel;

      if (folding && ~multiDragElements.indexOf(target)) {
        completed(false);
        cancel();
      }
    },
    revert: function revert(_ref9) {
      var fromSortable = _ref9.fromSortable,
          rootEl = _ref9.rootEl,
          sortable = _ref9.sortable,
          dragRect = _ref9.dragRect;

      if (multiDragElements.length > 1) {
        // Setup unfold animation
        multiDragElements.forEach(function (multiDragElement) {
          sortable.addAnimationState({
            target: multiDragElement,
            rect: folding ? getRect(multiDragElement) : dragRect
          });
          unsetRect(multiDragElement);
          multiDragElement.fromRect = dragRect;
          fromSortable.removeAnimationState(multiDragElement);
        });
        folding = false;
        insertMultiDragElements(!this.options.removeCloneOnHide, rootEl);
      }
    },
    dragOverCompleted: function dragOverCompleted(_ref10) {
      var sortable = _ref10.sortable,
          isOwner = _ref10.isOwner,
          insertion = _ref10.insertion,
          activeSortable = _ref10.activeSortable,
          parentEl = _ref10.parentEl,
          putSortable = _ref10.putSortable;
      var options = this.options;

      if (insertion) {
        // Clones must be hidden before folding animation to capture dragRectAbsolute properly
        if (isOwner) {
          activeSortable._hideClone();
        }

        initialFolding = false; // If leaving sort:false root, or already folding - Fold to new location

        if (options.animation && multiDragElements.length > 1 && (folding || !isOwner && !activeSortable.options.sort && !putSortable)) {
          // Fold: Set all multi drag elements's rects to dragEl's rect when multi-drag elements are invisible
          var dragRectAbsolute = getRect(dragEl$1, false, true, true);
          multiDragElements.forEach(function (multiDragElement) {
            if (multiDragElement === dragEl$1) return;
            setRect(multiDragElement, dragRectAbsolute); // Move element(s) to end of parentEl so that it does not interfere with multi-drag clones insertion if they are inserted
            // while folding, and so that we can capture them again because old sortable will no longer be fromSortable

            parentEl.appendChild(multiDragElement);
          });
          folding = true;
        } // Clones must be shown (and check to remove multi drags) after folding when interfering multiDragElements are moved out


        if (!isOwner) {
          // Only remove if not folding (folding will remove them anyways)
          if (!folding) {
            removeMultiDragElements();
          }

          if (multiDragElements.length > 1) {
            var clonesHiddenBefore = clonesHidden;

            activeSortable._showClone(sortable); // Unfold animation for clones if showing from hidden


            if (activeSortable.options.animation && !clonesHidden && clonesHiddenBefore) {
              multiDragClones.forEach(function (clone) {
                activeSortable.addAnimationState({
                  target: clone,
                  rect: clonesFromRect
                });
                clone.fromRect = clonesFromRect;
                clone.thisAnimationDuration = null;
              });
            }
          } else {
            activeSortable._showClone(sortable);
          }
        }
      }
    },
    dragOverAnimationCapture: function dragOverAnimationCapture(_ref11) {
      var dragRect = _ref11.dragRect,
          isOwner = _ref11.isOwner,
          activeSortable = _ref11.activeSortable;
      multiDragElements.forEach(function (multiDragElement) {
        multiDragElement.thisAnimationDuration = null;
      });

      if (activeSortable.options.animation && !isOwner && activeSortable.multiDrag.isMultiDrag) {
        clonesFromRect = _extends({}, dragRect);
        var dragMatrix = matrix(dragEl$1, true);
        clonesFromRect.top -= dragMatrix.f;
        clonesFromRect.left -= dragMatrix.e;
      }
    },
    dragOverAnimationComplete: function dragOverAnimationComplete() {
      if (folding) {
        folding = false;
        removeMultiDragElements();
      }
    },
    drop: function drop(_ref12) {
      var evt = _ref12.originalEvent,
          rootEl = _ref12.rootEl,
          parentEl = _ref12.parentEl,
          sortable = _ref12.sortable,
          dispatchSortableEvent = _ref12.dispatchSortableEvent,
          oldIndex = _ref12.oldIndex,
          putSortable = _ref12.putSortable;
      var toSortable = putSortable || this.sortable;
      if (!evt) return;
      var options = this.options,
          children = parentEl.children; // Multi-drag selection

      if (!dragStarted) {
        if (options.multiDragKey && !this.multiDragKeyDown) {
          this._deselectMultiDrag();
        }

        toggleClass(dragEl$1, options.selectedClass, !~multiDragElements.indexOf(dragEl$1));

        if (!~multiDragElements.indexOf(dragEl$1)) {
          multiDragElements.push(dragEl$1);
          dispatchEvent({
            sortable: sortable,
            rootEl: rootEl,
            name: 'select',
            targetEl: dragEl$1,
            originalEvent: evt
          }); // Modifier activated, select from last to dragEl

          if (evt.shiftKey && lastMultiDragSelect && sortable.el.contains(lastMultiDragSelect)) {
            var lastIndex = index(lastMultiDragSelect),
                currentIndex = index(dragEl$1);

            if (~lastIndex && ~currentIndex && lastIndex !== currentIndex) {
              // Must include lastMultiDragSelect (select it), in case modified selection from no selection
              // (but previous selection existed)
              var n, i;

              if (currentIndex > lastIndex) {
                i = lastIndex;
                n = currentIndex;
              } else {
                i = currentIndex;
                n = lastIndex + 1;
              }

              for (; i < n; i++) {
                if (~multiDragElements.indexOf(children[i])) continue;
                toggleClass(children[i], options.selectedClass, true);
                multiDragElements.push(children[i]);
                dispatchEvent({
                  sortable: sortable,
                  rootEl: rootEl,
                  name: 'select',
                  targetEl: children[i],
                  originalEvent: evt
                });
              }
            }
          } else {
            lastMultiDragSelect = dragEl$1;
          }

          multiDragSortable = toSortable;
        } else {
          multiDragElements.splice(multiDragElements.indexOf(dragEl$1), 1);
          lastMultiDragSelect = null;
          dispatchEvent({
            sortable: sortable,
            rootEl: rootEl,
            name: 'deselect',
            targetEl: dragEl$1,
            originalEvent: evt
          });
        }
      } // Multi-drag drop


      if (dragStarted && this.isMultiDrag) {
        folding = false; // Do not "unfold" after around dragEl if reverted

        if ((parentEl[expando].options.sort || parentEl !== rootEl) && multiDragElements.length > 1) {
          var dragRect = getRect(dragEl$1),
              multiDragIndex = index(dragEl$1, ':not(.' + this.options.selectedClass + ')');
          if (!initialFolding && options.animation) dragEl$1.thisAnimationDuration = null;
          toSortable.captureAnimationState();

          if (!initialFolding) {
            if (options.animation) {
              dragEl$1.fromRect = dragRect;
              multiDragElements.forEach(function (multiDragElement) {
                multiDragElement.thisAnimationDuration = null;

                if (multiDragElement !== dragEl$1) {
                  var rect = folding ? getRect(multiDragElement) : dragRect;
                  multiDragElement.fromRect = rect; // Prepare unfold animation

                  toSortable.addAnimationState({
                    target: multiDragElement,
                    rect: rect
                  });
                }
              });
            } // Multi drag elements are not necessarily removed from the DOM on drop, so to reinsert
            // properly they must all be removed


            removeMultiDragElements();
            multiDragElements.forEach(function (multiDragElement) {
              if (children[multiDragIndex]) {
                parentEl.insertBefore(multiDragElement, children[multiDragIndex]);
              } else {
                parentEl.appendChild(multiDragElement);
              }

              multiDragIndex++;
            }); // If initial folding is done, the elements may have changed position because they are now
            // unfolding around dragEl, even though dragEl may not have his index changed, so update event
            // must be fired here as Sortable will not.

            if (oldIndex === index(dragEl$1)) {
              var update = false;
              multiDragElements.forEach(function (multiDragElement) {
                if (multiDragElement.sortableIndex !== index(multiDragElement)) {
                  update = true;
                  return;
                }
              });

              if (update) {
                dispatchSortableEvent('update');
              }
            }
          } // Must be done after capturing individual rects (scroll bar)


          multiDragElements.forEach(function (multiDragElement) {
            unsetRect(multiDragElement);
          });
          toSortable.animateAll();
        }

        multiDragSortable = toSortable;
      } // Remove clones if necessary


      if (rootEl === parentEl || putSortable && putSortable.lastPutMode !== 'clone') {
        multiDragClones.forEach(function (clone) {
          clone.parentNode && clone.parentNode.removeChild(clone);
        });
      }
    },
    nullingGlobal: function nullingGlobal() {
      this.isMultiDrag = dragStarted = false;
      multiDragClones.length = 0;
    },
    destroyGlobal: function destroyGlobal() {
      this._deselectMultiDrag();

      off(document, 'pointerup', this._deselectMultiDrag);
      off(document, 'mouseup', this._deselectMultiDrag);
      off(document, 'touchend', this._deselectMultiDrag);
      off(document, 'keydown', this._checkKeyDown);
      off(document, 'keyup', this._checkKeyUp);
    },
    _deselectMultiDrag: function _deselectMultiDrag(evt) {
      if (typeof dragStarted !== "undefined" && dragStarted) return; // Only deselect if selection is in this sortable

      if (multiDragSortable !== this.sortable) return; // Only deselect if target is not item in this sortable

      if (evt && closest(evt.target, this.options.draggable, this.sortable.el, false)) return; // Only deselect if left click

      if (evt && evt.button !== 0) return;

      while (multiDragElements.length) {
        var el = multiDragElements[0];
        toggleClass(el, this.options.selectedClass, false);
        multiDragElements.shift();
        dispatchEvent({
          sortable: this.sortable,
          rootEl: this.sortable.el,
          name: 'deselect',
          targetEl: el,
          originalEvent: evt
        });
      }
    },
    _checkKeyDown: function _checkKeyDown(evt) {
      if (evt.key === this.options.multiDragKey) {
        this.multiDragKeyDown = true;
      }
    },
    _checkKeyUp: function _checkKeyUp(evt) {
      if (evt.key === this.options.multiDragKey) {
        this.multiDragKeyDown = false;
      }
    }
  };
  return _extends(MultiDrag, {
    // Static methods & properties
    pluginName: 'multiDrag',
    utils: {
      /**
       * Selects the provided multi-drag item
       * @param  {HTMLElement} el    The element to be selected
       */
      select: function select(el) {
        var sortable = el.parentNode[expando];
        if (!sortable || !sortable.options.multiDrag || ~multiDragElements.indexOf(el)) return;

        if (multiDragSortable && multiDragSortable !== sortable) {
          multiDragSortable.multiDrag._deselectMultiDrag();

          multiDragSortable = sortable;
        }

        toggleClass(el, sortable.options.selectedClass, true);
        multiDragElements.push(el);
      },

      /**
       * Deselects the provided multi-drag item
       * @param  {HTMLElement} el    The element to be deselected
       */
      deselect: function deselect(el) {
        var sortable = el.parentNode[expando],
            index = multiDragElements.indexOf(el);
        if (!sortable || !sortable.options.multiDrag || !~index) return;
        toggleClass(el, sortable.options.selectedClass, false);
        multiDragElements.splice(index, 1);
      }
    },
    eventProperties: function eventProperties() {
      var _this3 = this;

      var oldIndicies = [],
          newIndicies = [];
      multiDragElements.forEach(function (multiDragElement) {
        oldIndicies.push({
          multiDragElement: multiDragElement,
          index: multiDragElement.sortableIndex
        }); // multiDragElements will already be sorted if folding

        var newIndex;

        if (folding && multiDragElement !== dragEl$1) {
          newIndex = -1;
        } else if (folding) {
          newIndex = index(multiDragElement, ':not(.' + _this3.options.selectedClass + ')');
        } else {
          newIndex = index(multiDragElement);
        }

        newIndicies.push({
          multiDragElement: multiDragElement,
          index: newIndex
        });
      });
      return {
        items: _toConsumableArray(multiDragElements),
        clones: [].concat(multiDragClones),
        oldIndicies: oldIndicies,
        newIndicies: newIndicies
      };
    },
    optionListeners: {
      multiDragKey: function multiDragKey(key) {
        key = key.toLowerCase();

        if (key === 'ctrl') {
          key = 'Control';
        } else if (key.length > 1) {
          key = key.charAt(0).toUpperCase() + key.substr(1);
        }

        return key;
      }
    }
  });
}

function insertMultiDragElements(clonesInserted, rootEl) {
  multiDragElements.forEach(function (multiDragElement, i) {
    var target = rootEl.children[multiDragElement.sortableIndex + (clonesInserted ? Number(i) : 0)];

    if (target) {
      rootEl.insertBefore(multiDragElement, target);
    } else {
      rootEl.appendChild(multiDragElement);
    }
  });
}
/**
 * Insert multi-drag clones
 * @param  {[Boolean]} elementsInserted  Whether the multi-drag elements are inserted
 * @param  {HTMLElement} rootEl
 */


function insertMultiDragClones(elementsInserted, rootEl) {
  multiDragClones.forEach(function (clone, i) {
    var target = rootEl.children[clone.sortableIndex + (elementsInserted ? Number(i) : 0)];

    if (target) {
      rootEl.insertBefore(clone, target);
    } else {
      rootEl.appendChild(clone);
    }
  });
}

function removeMultiDragElements() {
  multiDragElements.forEach(function (multiDragElement) {
    if (multiDragElement === dragEl$1) return;
    multiDragElement.parentNode && multiDragElement.parentNode.removeChild(multiDragElement);
  });
}

Sortable.mount(new AutoScrollPlugin());
Sortable.mount(Remove, Revert);

/* harmony default export */ __webpack_exports__["default"] = (Sortable);



/***/ }),

/***/ "./node_modules/tiny-invariant/dist/tiny-invariant.esm.js":
/*!****************************************************************!*\
  !*** ./node_modules/tiny-invariant/dist/tiny-invariant.esm.js ***!
  \****************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ invariant; }
/* harmony export */ });
var isProduction = "development" === 'production';
var prefix = 'Invariant failed';
function invariant(condition, message) {
    if (condition) {
        return;
    }
    if (isProduction) {
        throw new Error(prefix);
    }
    var provided = typeof message === 'function' ? message() : message;
    var value = provided ? prefix + ": " + provided : prefix;
    throw new Error(value);
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

/***/ "@wordpress/compose":
/*!*********************************!*\
  !*** external ["wp","compose"] ***!
  \*********************************/
/***/ (function(module) {

"use strict";
module.exports = window["wp"]["compose"];

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
/*!***********************!*\
  !*** ./src/filter.js ***!
  \***********************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _filter_scss__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./filter.scss */ "./src/filter.scss");
/* harmony import */ var _components_Filter__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./components/Filter */ "./src/components/Filter/index.js");
/* harmony import */ var _components_Filter_FilterContext__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./components/Filter/FilterContext */ "./src/components/Filter/FilterContext.js");






const App = () => {
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_components_Filter_FilterContext__WEBPACK_IMPORTED_MODULE_3__.FilterProvider, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_components_Filter__WEBPACK_IMPORTED_MODULE_2__["default"], null));
};

document.addEventListener('DOMContentLoaded', () => {
  const renderElementInstance = document.getElementById('wcapf-filter-admin-ui');

  if (renderElementInstance) {
    (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.render)((0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.StrictMode, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(App, null)), renderElementInstance);
  }
});
}();
/******/ })()
;
//# sourceMappingURL=filter.js.map