/******/ (function() { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/components/Notifications.js":
/*!*****************************************!*\
  !*** ./src/components/Notifications.js ***!
  \*****************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

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
    href: (0,_utils__WEBPACK_IMPORTED_MODULE_2__.upgradeToProLink)()
  }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Upgrade', 'wc-ajax-product-filter')))));
};

/* harmony default export */ __webpack_exports__["default"] = (ProFeaturesNotice);

/***/ }),

/***/ "./src/components/SEORules/SEORulesContext.js":
/*!****************************************************!*\
  !*** ./src/components/SEORules/SEORulesContext.js ***!
  \****************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "SEORulesProvider": function() { return /* binding */ SEORulesProvider; },
/* harmony export */   "useSEORules": function() { return /* binding */ useSEORules; }
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _seoRulesReducer__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./seoRulesReducer */ "./src/components/SEORules/seoRulesReducer.js");



const SEORulesContext = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createContext)(_seoRulesReducer__WEBPACK_IMPORTED_MODULE_1__.initialState);

const SEORulesProvider = _ref => {
  let {
    children
  } = _ref;
  const [state, dispatch] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useReducer)(_seoRulesReducer__WEBPACK_IMPORTED_MODULE_1__["default"], _seoRulesReducer__WEBPACK_IMPORTED_MODULE_1__.initialState);
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(SEORulesContext.Provider, {
    value: {
      state,
      dispatch
    }
  }, children);
};

const useSEORules = () => {
  const context = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useContext)(SEORulesContext);

  if (context === undefined) {
    throw new Error('useSEORules must be used within a SEORulesProvider');
  }

  return context;
};



/***/ }),

/***/ "./src/components/SEORules/Table.js":
/*!******************************************!*\
  !*** ./src/components/SEORules/Table.js ***!
  \******************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _ProFeaturesNotice__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../ProFeaturesNotice */ "./src/components/ProFeaturesNotice.js");
/* harmony import */ var _SVGIcons__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../SVGIcons */ "./src/components/SVGIcons.js");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../utils */ "./src/components/utils.js");
/* harmony import */ var _SEORulesContext__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./SEORulesContext */ "./src/components/SEORules/SEORulesContext.js");







const WCAPF_PRO = (0,_utils__WEBPACK_IMPORTED_MODULE_5__.foundProVersion)();
const headers = [(0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Title', 'wc-ajax-product-filter'), (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Actions', 'wc-ajax-product-filter')];

const Table = _ref => {
  let {
    openAddNewModal,
    openDeleteModal,
    openPublishModal,
    deletingItemId
  } = _ref;
  const {
    state: {
      rules
    }
  } = (0,_SEORulesContext__WEBPACK_IMPORTED_MODULE_6__.useSEORules)();
  const rulesFound = rules.length;

  const tableHeader = () => {
    return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("tr", null, headers.map(item => {
      return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("th", {
        className: (0,_utils__WEBPACK_IMPORTED_MODULE_5__.slugify)(item),
        key: `posts-table-${item}`
      }, item);
    }));
  };

  const tableBody = () => forms.map(_form => {
    const form = prepareFormData(_form);
    const formId = form.id;
    const formTitle = form.title ? form.title : (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('(no title)', 'wc-ajax-product-filter');
    const isDeleting = formId === deletingItemId;
    return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("tr", {
      key: formId
    }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("td", {
      className: "__Title"
    }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("a", {
      href: form.editLink,
      className: "__post_title"
    }, formTitle)), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("td", {
      className: "__Actions"
    }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.Button, {
      icon: _SVGIcons__WEBPACK_IMPORTED_MODULE_4__.DeleteIcon,
      onClick: () => openDeleteModal(formId),
      isBusy: isDeleting,
      disabled: isDeleting,
      isSmall: true
    }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.Button, {
      icon: CodeIcon,
      onClick: openPublishModal,
      isSmall: true
    }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.Button, {
      icon: _SVGIcons__WEBPACK_IMPORTED_MODULE_4__.EditIcon,
      href: form.editLink,
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
    if (rulesFound) {
      const countResults = (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.sprintf)((0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__._n)('Showing <b>%d</b> result', 'Showing <b>%d</b> results', rulesFound, 'wc-ajax-product-filter'), rulesFound);
      return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
        className: "__list_table_summary"
      }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
        dangerouslySetInnerHTML: {
          __html: countResults
        }
      }));
    }
  };

  let content;

  if (rulesFound) {
    content = listTable();
  } else {
    content = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("p", {
      style: {
        margin: 24
      }
    }, "Create your first seo rule");
  }

  content = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    style: {
      margin: '16px 24px'
    }
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_ProFeaturesNotice__WEBPACK_IMPORTED_MODULE_3__["default"], {
    message: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('SEO Rules are available only at the PRO version.', 'wc-ajax-product-filter')
  }));
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "__content"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "__list_table_wrapper"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "__list_table_header"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("h2", null, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('List of SEO Rules', 'wc-ajax-product-filter')), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.Button, {
    variant: "primary",
    onClick: openAddNewModal,
    disabled: !WCAPF_PRO
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.Icon, {
    icon: _SVGIcons__WEBPACK_IMPORTED_MODULE_4__.PlusIcon,
    size: 14
  }), (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Add New', 'wc-ajax-product-filter'))), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "__list_table_inner __seo_rules_table"
  }, content), listSummary()));
};

/* harmony default export */ __webpack_exports__["default"] = (Table);

/***/ }),

/***/ "./src/components/SEORules/index.js":
/*!******************************************!*\
  !*** ./src/components/SEORules/index.js ***!
  \******************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _Notifications__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../Notifications */ "./src/components/Notifications.js");
/* harmony import */ var _Sidebar__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../Sidebar */ "./src/components/Sidebar.js");
/* harmony import */ var _TopBar__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../TopBar */ "./src/components/TopBar.js");
/* harmony import */ var _Table__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./Table */ "./src/components/SEORules/Table.js");







const SEORules = () => {
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "__wcapf_admin"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_TopBar__WEBPACK_IMPORTED_MODULE_4__["default"], {
    view: 'seo-rules'
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "__wcapf_layout"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "__main"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_Table__WEBPACK_IMPORTED_MODULE_5__["default"] // openAddNewModal={handleOpenAddNewModal}
  // openDeleteModal={handleOpenDeleteModal}
  // openDuplicateModal={handleOpenDuplicateModal}
  // openPublishModal={handleOpenPublishModal}
  // deletingItemId={deletingItemId}
  // duplicatingItemId={duplicatingItemId}
  , null), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_Sidebar__WEBPACK_IMPORTED_MODULE_3__["default"], null)), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_Notifications__WEBPACK_IMPORTED_MODULE_2__["default"], null)));
};

/* harmony default export */ __webpack_exports__["default"] = (SEORules);

/***/ }),

/***/ "./src/components/SEORules/seoRulesReducer.js":
/*!****************************************************!*\
  !*** ./src/components/SEORules/seoRulesReducer.js ***!
  \****************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "initialState": function() { return /* binding */ initialState; }
/* harmony export */ });
const initialState = {
  isDirty: false,
  rules: []
};

const seoRulesReducer = (state, action) => {
  switch (action.type) {
    case 'SET_DIRTY':
      return { ...state,
        isDirty: action.payload
      };

    case 'UPDATE_RULES':
      return { ...state,
        rules: action.payload
      };

    default:
      return state;
  }
};

/* harmony default export */ __webpack_exports__["default"] = (seoRulesReducer);

/***/ }),

/***/ "./src/components/SVGIcons.js":
/*!************************************!*\
  !*** ./src/components/SVGIcons.js ***!
  \************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

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
  label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Forms', 'wc-ajax-product-filter'),
  id: 'forms',
  href: (0,_utils__WEBPACK_IMPORTED_MODULE_4__.getFormsPageLink)()
}, {
  label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('SEO Rules', 'wc-ajax-product-filter'),
  id: 'seo-rules',
  href: (0,_utils__WEBPACK_IMPORTED_MODULE_4__.getSeoRulesPageLink)()
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
    const _view = 'form' === view ? 'forms' : view;

    const menuClass = _view === menu.id ? 'is-active' : '';
    return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("a", {
      className: menuClass,
      href: menu.href,
      key: menu.id
    }, menu.label);
  })), 'form' !== view && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "__cta"
  }, !(0,_utils__WEBPACK_IMPORTED_MODULE_4__.foundProVersion)() && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("a", {
    href: (0,_utils__WEBPACK_IMPORTED_MODULE_4__.upgradeToProLink)(),
    className: "__upgrade_btn"
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

/***/ "./src/components/utils.js":
/*!*********************************!*\
  !*** ./src/components/utils.js ***!
  \*********************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "arrayMove": function() { return /* binding */ arrayMove; },
/* harmony export */   "foundProVersion": function() { return /* binding */ foundProVersion; },
/* harmony export */   "getEditFormLink": function() { return /* binding */ getEditFormLink; },
/* harmony export */   "getFormsPageLink": function() { return /* binding */ getFormsPageLink; },
/* harmony export */   "getInputId": function() { return /* binding */ getInputId; },
/* harmony export */   "getSeoRulesPageLink": function() { return /* binding */ getSeoRulesPageLink; },
/* harmony export */   "getSettingsPageLink": function() { return /* binding */ getSettingsPageLink; },
/* harmony export */   "isProFeature": function() { return /* binding */ isProFeature; },
/* harmony export */   "mergeSelectOptions": function() { return /* binding */ mergeSelectOptions; },
/* harmony export */   "pluginVersion": function() { return /* binding */ pluginVersion; },
/* harmony export */   "proTag": function() { return /* binding */ proTag; },
/* harmony export */   "slugify": function() { return /* binding */ slugify; },
/* harmony export */   "upgradeToProLink": function() { return /* binding */ upgradeToProLink; },
/* harmony export */   "wcfmFound": function() { return /* binding */ wcfmFound; }
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! lodash */ "lodash");
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(lodash__WEBPACK_IMPORTED_MODULE_1__);


function foundProVersion() {
  return wcapf_admin_params.found_pro || false;
}
function getInputId(id) {
  let index = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
  let subIndex = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';
  let fieldId = id;

  if ('' !== index) {
    fieldId += '-' + index;
  }

  if ('' !== subIndex) {
    fieldId += '-' + subIndex;
  }

  return fieldId;
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
function pluginVersion() {
  return wcapf_admin_params.version;
}
function getFormsPageLink() {
  return wcapf_admin_params.forms_page_link;
}
function getEditFormLink(formId) {
  return getFormsPageLink() + '&id=' + formId;
}
function getSeoRulesPageLink() {
  return wcapf_admin_params.seo_rules_page_link;
}
function getSettingsPageLink() {
  return wcapf_admin_params.settings_page_link;
}
function upgradeToProLink() {
  return wcapf_admin_params.upgrade_page_link;
}
function slugify(value) {
  return '__' + value.replace(/ /g, '_');
}
function wcfmFound() {
  return wcapf_admin_params.wcfm_marketplace_found;
}
function arrayMove(arr, fromIndex, toIndex) {
  var element = arr[fromIndex];
  arr.splice(fromIndex, 1);
  arr.splice(toIndex, 0, element);
}
function mergeSelectOptions(freeOptions, proOptions) {
  let withPro = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
  let options;

  if (withPro && !foundProVersion()) {
    const _proOptions = proOptions.map(option => {
      option.isPro = true;
      return option;
    });

    options = (0,lodash__WEBPACK_IMPORTED_MODULE_1__.concat)(freeOptions, [{
      proGroup: true,
      options: _proOptions
    }]);
  } else {
    options = (0,lodash__WEBPACK_IMPORTED_MODULE_1__.concat)(freeOptions, proOptions);
  }

  return options;
}

/***/ }),

/***/ "./src/seo-rules.scss":
/*!****************************!*\
  !*** ./src/seo-rules.scss ***!
  \****************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "lodash":
/*!*************************!*\
  !*** external "lodash" ***!
  \*************************/
/***/ (function(module) {

module.exports = window["lodash"];

/***/ }),

/***/ "@wordpress/components":
/*!************************************!*\
  !*** external ["wp","components"] ***!
  \************************************/
/***/ (function(module) {

module.exports = window["wp"]["components"];

/***/ }),

/***/ "@wordpress/data":
/*!******************************!*\
  !*** external ["wp","data"] ***!
  \******************************/
/***/ (function(module) {

module.exports = window["wp"]["data"];

/***/ }),

/***/ "@wordpress/element":
/*!*********************************!*\
  !*** external ["wp","element"] ***!
  \*********************************/
/***/ (function(module) {

module.exports = window["wp"]["element"];

/***/ }),

/***/ "@wordpress/i18n":
/*!******************************!*\
  !*** external ["wp","i18n"] ***!
  \******************************/
/***/ (function(module) {

module.exports = window["wp"]["i18n"];

/***/ }),

/***/ "@wordpress/notices":
/*!*********************************!*\
  !*** external ["wp","notices"] ***!
  \*********************************/
/***/ (function(module) {

module.exports = window["wp"]["notices"];

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
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
!function() {
/*!**************************!*\
  !*** ./src/seo-rules.js ***!
  \**************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _seo_rules_scss__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./seo-rules.scss */ "./src/seo-rules.scss");
/* harmony import */ var _components_SEORules_SEORulesContext__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./components/SEORules/SEORulesContext */ "./src/components/SEORules/SEORulesContext.js");
/* harmony import */ var _components_SEORules__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./components/SEORules */ "./src/components/SEORules/index.js");






const App = () => {
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_components_SEORules_SEORulesContext__WEBPACK_IMPORTED_MODULE_2__.SEORulesProvider, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_components_SEORules__WEBPACK_IMPORTED_MODULE_3__["default"], null));
};

document.addEventListener('DOMContentLoaded', () => {
  const renderElementInstance = document.getElementById('wcapf-seo-rules-admin-ui');

  if (renderElementInstance) {
    (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.render)((0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.StrictMode, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(App, null)), renderElementInstance);
  }
});
}();
/******/ })()
;
//# sourceMappingURL=seo-rules.js.map