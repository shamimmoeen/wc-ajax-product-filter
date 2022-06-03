"use strict";

/**
 * Display type fields.
 *
 * TODO: Maybe delete.
 *
 * @since      3.0.0
 * @package    wc-ajax-product-filter
 * @subpackage wc-ajax-product-filter/admin/src/js
 * @author     Mainul Hassan Main
 */
jQuery(document).ready(function ($) {});
"use strict";

/**
 * The frontend filter form.
 *
 * @since      3.0.0
 * @package    wc-ajax-product-filter
 * @subpackage wc-ajax-product-filter/public/src/js
 * @author     Mainul Hassan Main
 */
var wcapf_params = wcapf_params || {
  'filter_input_delay': '',
  'chosen_lib_search_threshold': '',
  'shop_loop_container': '',
  'not_found_container': '',
  'pagination_container': '',
  // todo
  'sorting_control': '',
  // todo
  'scroll_to_top': '',
  // todo
  'scroll_to_top_offset': '',
  // todo
  'custom_scripts': ''
};
jQuery(document).ready(function ($) {
  var rangeValuesSeparator = '~'; // return false if wcapf_params variable is not found

  if (typeof wcapf_params === 'undefined') {
    return false;
  }

  var _delay = parseInt(wcapf_params.filter_input_delay);

  var delay = _delay >= 0 ? _delay : 800; // store fields' id and filter information

  var fields = {};
  var $wcapfSingleFilters = $('.wcapf-single-filter');
  var $wcapfNavFilters = $('.wcapf-nav-filter');
  var $wcapfNumberRangeFilters = $('.wcapf-number-range-filter');
  $wcapfSingleFilters.each(function () {
    var $field = $(this);
    var id = $field.attr('data-id');
    var $wrapper = $field.children('div');
    var filterKey = $wrapper.attr('data-filter-key');
    var multipleFilter = parseInt($wrapper.attr('data-multiple-filter'));
    fields[id] = {
      filterKey: filterKey,
      multipleFilter: multipleFilter
    };
  }); // Initialize jQuery chosen library

  function initChosen() {
    if (!jQuery().chosen) {
      return;
    }

    $wcapfNavFilters.find('.wcapf-chosen-select').each(function () {
      var $this = $(this);
      var options = {};
      var noResultsMessage = $this.attr('data-no-results-message');

      if (noResultsMessage) {
        options['no_results_text'] = noResultsMessage;
      }

      var searchThreshold = parseInt(wcapf_params.chosen_lib_search_threshold);

      if (searchThreshold) {
        options['disable_search_threshold'] = searchThreshold;
      }

      $this.chosen(options);
    });
  }

  initChosen(); // Initialize hierarchy accordion

  function initHierarchyAccordion() {
    $wcapfNavFilters.find('.hierarchy-accordion-toggle').on('click', function () {
      $(this).toggleClass('active');
    });
  }

  initHierarchyAccordion();
  /**
   * @source https://stackoverflow.com/a/34141813
   *
   * @param number
   * @param decimals
   * @param dec_point
   * @param thousands_sep
   *
   * @returns {string}
   */

  function number_format(number, decimals, dec_point, thousands_sep) {
    // Strip all characters but numerical ones.
    number = (number + '').replace(/[^\d+\-Ee.]/g, '');
    var n = !isFinite(+number) ? 0 : +number;
    var prec = !isFinite(+decimals) ? 0 : Math.abs(decimals);
    var sep = typeof thousands_sep === 'undefined' ? ',' : thousands_sep;
    var dec = typeof dec_point === 'undefined' ? '.' : dec_point;
    var s;

    var toFixedFix = function toFixedFix(n, prec) {
      var k = Math.pow(10, prec);
      return '' + Math.round(n * k) / k;
    }; // Fix for IE parseFloat(0.55).toFixed(0) = 0;


    s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.');

    if (s[0].length > 3) {
      s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep);
    }

    if ((s[1] || '').length < prec) {
      s[1] = s[1] || '';
      s[1] += new Array(prec - s[1].length + 1).join('0');
    }

    return s.join(dec);
  } // Initialize noUISlider


  function initNoUISlider() {
    if ('undefined' === typeof noUiSlider) {
      return;
    }

    $wcapfNumberRangeFilters.find('.wcapf-range-slider').each(function () {
      var $item = $(this);
      var filterKey = $item.attr('data-filter-key');
      var $slider = $item.find('.wcapf-noui-slider'); // If slider is already initialized then don't reinitialize again.

      if ($slider.hasClass('noUi-target')) {
        return;
      }

      var sliderId = $slider.attr('id');
      var displayValuesAs = $item.attr('data-display-values-as');
      var rangeMinValue = parseFloat($item.attr('data-range-min-value'));
      var rangeMaxValue = parseFloat($item.attr('data-range-max-value'));
      var step = parseFloat($item.attr('data-step'));
      var decimalPlaces = $item.attr('data-decimal-places');
      var thousandSeparator = $item.attr('data-thousand-separator');
      var decimalSeparator = $item.attr('data-decimal-separator');
      var minValue = parseFloat($item.attr('data-min-value'));
      var maxValue = parseFloat($item.attr('data-max-value'));
      var $minValue = $item.find('.min-value');
      var $maxValue = $item.find('.max-value');
      var slider = document.getElementById(sliderId);
      noUiSlider.create(slider, {
        start: [minValue, maxValue],
        step: step,
        connect: true,
        range: {
          'min': rangeMinValue,
          'max': rangeMaxValue
        }
      });
      slider.noUiSlider.on('update', function (values) {
        var minValue = number_format(values[0], decimalPlaces, decimalSeparator, thousandSeparator);
        var maxValue = number_format(values[1], decimalPlaces, decimalSeparator, thousandSeparator);

        if ('plain_text' === displayValuesAs) {
          $minValue.html(minValue);
          $maxValue.html(maxValue);
        } else {
          $minValue.val(minValue);
          $maxValue.val(maxValue);
        }
      });

      function filterProductsAccordingToSlider(values) {
        var minValue = parseFloat(values[0]);
        var maxValue = parseFloat(values[1]);

        if (minValue === rangeMinValue && maxValue === rangeMaxValue) {
          var query = wcapfRemoveQueryStringParameter(filterKey);
          history.pushState({}, '', query);
        } else {
          var filterValString = minValue + rangeValuesSeparator + maxValue;
          wcapfUpdateQueryStringParameter(filterKey, filterValString);
        } // filter products


        wcapfFilterProducts();
      }

      slider.noUiSlider.on('end', function (values) {
        // Clear any previously set timer before setting a fresh one
        clearTimeout($item.data('timer'));
        $item.data('timer', setTimeout(function () {
          $item.removeData('timer');
          filterProductsAccordingToSlider(values);
        }, delay));
      });
      $minValue.on('input', function (event) {
        event.preventDefault();
        var $input = $(this); // Clear any previously set timer before setting a fresh one

        clearTimeout($input.data('timer'));
        $input.data('timer', setTimeout(function () {
          $input.removeData('timer');
          var minValue = $input.val();
          slider.noUiSlider.set([minValue, null]);
          filterProductsAccordingToSlider(slider.noUiSlider.get());
        }, delay));
      });
      $maxValue.on('input', function (event) {
        event.preventDefault();
        var $input = $(this); // Clear any previously set timer before setting a fresh one

        clearTimeout($input.data('timer'));
        $input.data('timer', setTimeout(function () {
          $input.removeData('timer');
          var maxValue = $input.val();
          slider.noUiSlider.set([null, maxValue]);
          filterProductsAccordingToSlider(slider.noUiSlider.get());
        }, delay));
      });
    });
  }

  initNoUISlider();

  function initDatepicker() {
    if (!jQuery().datepicker) {
      return;
    }

    var $wcapfDateFilters = $('.wcapf-date-range-filter');
    var $wcapfDateFilter = $wcapfDateFilters.find('.wcapf-date-input');
    var format = $wcapfDateFilter.attr('data-date-format');
    var yearDropdown = $wcapfDateFilter.attr('data-date-picker-year-dropdown');
    var monthDropdown = $wcapfDateFilter.attr('data-date-picker-month-dropdown');
    var $from = $wcapfDateFilter.find('.date-from-input');
    var $to = $wcapfDateFilter.find('.date-to-input');
    $from.datepicker({
      dateFormat: format,
      changeYear: yearDropdown,
      changeMonth: monthDropdown
    });
    $to.datepicker({
      dateFormat: format,
      changeYear: yearDropdown,
      changeMonth: monthDropdown
    });
    $from.on('change', function () {
      var $input = $(this);
      filterByDate($input);
    });
    $to.on('change', function () {
      var $input = $(this);
      filterByDate($input);
    });
  }

  initDatepicker(); // show a loading indicator

  function wcapfBeforeUpdate() {
    $('body').trigger('wcapf_before_update_filters');
  } // scroll to top


  function wcapfAfterUpdate() {
    initChosen();
    initHierarchyAccordion();
    initNoUISlider();
    initDatepicker();
    $('body').trigger('wcapf_after_update_filters');
  } // filter the products


  function wcapfFilterProducts() {
    var forceReRender = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
    wcapfBeforeUpdate();
    $.get(window.location.href, function (data) {
      var $data = $(data);
      var $shopLoopContainer = $data.find(wcapf_params.shop_loop_container);
      var $notFoundContainer = $data.find(wcapf_params.not_found_container); // replace fields' data with new data

      $.each(fields, function (id) {
        var fieldID = '[data-id="' + id + '"]';
        var $field = $(fieldID);

        var _field = $data.find(fieldID);

        var fieldClass = $(_field).attr('class'); // When called from history back or forward request then rerender all fields.

        if (forceReRender) {
          // update class
          $field.attr('class', fieldClass); // update field

          $field.html(_field.html());
        } else {
          // Selectively rerender the fields.
          if ($field.hasClass('wcapf-nav-filter')) {
            // update class
            $field.attr('class', fieldClass); // update field

            $field.html(_field.html());
          }
        }
      }); // replace old shop loop with new one

      if (wcapf_params.shop_loop_container === wcapf_params.not_found_container) {
        $(wcapf_params.shop_loop_container).html($shopLoopContainer.html());
      } else {
        if ($(wcapf_params.not_found_container).length) {
          if ($shopLoopContainer.length) {
            $(wcapf_params.not_found_container).html($shopLoopContainer.html());
          } else if ($notFoundContainer.length) {
            $(wcapf_params.not_found_container).html($notFoundContainer.html());
          }
        } else if ($(wcapf_params.shop_loop_container).length) {
          if ($shopLoopContainer.length) {
            $(wcapf_params.shop_loop_container).html($shopLoopContainer.html());
          } else if ($notFoundContainer.length) {
            $(wcapf_params.shop_loop_container).html($notFoundContainer.html());
          }
        }
      }

      wcapfAfterUpdate(); // todo
      // reinitialize ordering
      // wcapfInitOrder();
      // todo
      // reinitialize dropdown filter
      // wcapfDropDownFilter();
      // run scripts after shop loop undated

      if (typeof wcapf_params.custom_scripts !== 'undefined' && wcapf_params.custom_scripts.length > 0) {
        eval(wcapf_params.custom_scripts);
      }
    });
  } // URL Parser


  function wcapfGetUrlVars(url) {
    var vars = {},
        hash;

    if (typeof url === 'undefined') {
      url = window.location.href;
    }

    url = url.replaceAll('%2C', ',');
    var hashes = url.slice(url.indexOf('?') + 1).split('&');
    var hLength = hashes.length;

    for (var i = 0; i < hLength; i++) {
      hash = hashes[i].split('=');
      vars[hash[0]] = hash[1];
    }

    return vars;
  } // everytime we apply the filter we set the current page to 1


  function wcapfFixPagination() {
    var url = window.location.href;
    var params = wcapfGetUrlVars(url);
    var currentPageInUrl = parseInt(url.replace(/.+\/page\/(\d+)+/, '$1'));

    if (currentPageInUrl) {
      if (currentPageInUrl > 1) {
        url = url.replace(/page\/(\d+)/, 'page/1');
      }
    } else if (typeof params['paged'] !== 'undefined') {
      var currentPageInParams = parseInt(params['paged']);

      if (currentPageInParams > 1) {
        url = url.replace('paged=' + currentPageInParams, 'paged=1');
      }
    }

    return url;
  } // update query string for categories, meta etc..


  function wcapfUpdateQueryStringParameter(key, value, pushHistory, url) {
    if (typeof pushHistory === 'undefined') {
      pushHistory = true;
    }

    if (typeof url === 'undefined') {
      url = wcapfFixPagination();
    }

    var re = new RegExp('([?&])' + key + '=.*?(&|$)', 'i');
    var separator = url.indexOf('?') !== -1 ? '&' : '?';
    var urlWithQuery;

    if (url.match(re)) {
      urlWithQuery = url.replace(re, '$1' + key + '=' + value + '$2');
    } else {
      urlWithQuery = url + separator + key + '=' + value;
    }

    if (pushHistory === true) {
      return history.pushState({}, '', urlWithQuery);
    } else {
      return urlWithQuery;
    }
  } // remove parameter from url


  function wcapfRemoveQueryStringParameter(filterKey, url) {
    if (typeof url === 'undefined') {
      url = wcapfFixPagination();
    }

    var oldParams = wcapfGetUrlVars(url);
    var oldParamsLength = Object.keys(oldParams).length;
    var startPosition = url.indexOf('?');
    var filterKeyPosition = url.indexOf(filterKey);
    var cleanUrl, cleanQuery;

    if (oldParamsLength > 1) {
      if (filterKeyPosition - startPosition > 1) {
        cleanUrl = url.replace('&' + filterKey + '=' + oldParams[filterKey], '');
      } else {
        cleanUrl = url.replace(filterKey + '=' + oldParams[filterKey] + '&', '');
      }

      var newParams = cleanUrl.split('?');
      cleanQuery = '?' + newParams[1];
    } else {
      cleanQuery = url.replace('?' + filterKey + '=' + oldParams[filterKey], '');
    }

    return cleanQuery;
  } // take the key and value and make query


  function wcapfMakeParameters(filterKey, filterValue) {
    var forceRerender = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
    var url = arguments.length > 3 ? arguments[3] : undefined;
    var valueSeparator = ',';
    var params,
        nextValues,
        emptyValue = false;

    if (typeof url !== 'undefined') {
      params = wcapfGetUrlVars(url);
    } else {
      params = wcapfGetUrlVars();
    }

    if (typeof params[filterKey] != 'undefined') {
      var prevValues = params[filterKey];
      var prevValuesArray = prevValues.split(valueSeparator);

      if (prevValues.length > 0) {
        var found = $.inArray(filterValue, prevValuesArray);

        if (found >= 0) {
          // Element was found, remove it.
          prevValuesArray.splice(found, 1);

          if (prevValuesArray.length === 0) {
            emptyValue = true;
          }
        } else {
          // Element was not found, add it.
          prevValuesArray.push(filterValue);
        }

        if (prevValuesArray.length > 1) {
          nextValues = prevValuesArray.join(valueSeparator);
        } else {
          nextValues = prevValuesArray;
        }
      } else {
        nextValues = filterValue;
      }
    } else {
      nextValues = filterValue;
    } // update url and query string


    if (!emptyValue) {
      wcapfUpdateQueryStringParameter(filterKey, nextValues);
    } else {
      var query = wcapfRemoveQueryStringParameter(filterKey);
      history.pushState({}, '', query);
    } // filter products


    wcapfFilterProducts(forceRerender);
  }

  function wcapfSingleFilter(filterKey, filterValue) {
    var params = wcapfGetUrlVars();
    var query;

    if (typeof params[filterKey] !== 'undefined' && params[filterKey] === filterValue) {
      query = wcapfRemoveQueryStringParameter(filterKey);
    } else {
      query = wcapfUpdateQueryStringParameter(filterKey, filterValue, false);
    } // update url


    history.pushState({}, '', query); // filter products

    wcapfFilterProducts();
  } // The main function to handle the filter request


  function handleFilterRequest($item, filterValue) {
    var $field = $item.closest('.wcapf-single-filter');
    var fieldID = $field.attr('data-id');
    var fieldData = fields[fieldID];
    var filterKey = fieldData.filterKey;
    var multipleFilter = fieldData.multipleFilter;

    if (!filterKey) {
      return;
    }

    if (!filterValue.length) {
      var query = wcapfRemoveQueryStringParameter(filterKey);
      history.pushState({}, '', query); // filter products

      wcapfFilterProducts();
      return;
    }

    if (multipleFilter) {
      wcapfMakeParameters(filterKey, filterValue);
    } else {
      wcapfSingleFilter(filterKey, filterValue);
    }
  } // handle the filter request for list fields


  $wcapfNavFilters.on('change', '.wcapf-layered-nav [type="checkbox"], .wcapf-layered-nav [type="radio"]', function (event) {
    event.preventDefault();
    var $item = $(this);
    var filterValue = $item.val();
    handleFilterRequest($item, filterValue);
  }); // TODO: Use a combination of label, checkbox and radio
  // handle the filter request for labeled item

  $wcapfNavFilters.on('click', '.wcapf-labeled-nav .item', function (event) {
    event.preventDefault();
    var $item = $(this);
    var filterValue = $item.attr('data-value');
    handleFilterRequest($item, filterValue);
  }); // handle the filter request for display type select fields

  $wcapfNavFilters.on('change', 'select', function (event) {
    event.preventDefault();
    var $item = $(this);
    var filterValue = $item.val();
    var $field = $item.closest('.wcapf-single-filter');
    var fieldID = $field.attr('data-id');
    var fieldData = fields[fieldID];
    var filterKey = fieldData.filterKey;

    if (!filterValue.length) {
      var query = wcapfRemoveQueryStringParameter(filterKey);
      history.pushState({}, '', query);
    } else {
      var filterValString = filterValue.toString();
      wcapfUpdateQueryStringParameter(filterKey, filterValString);
    } // filter products


    wcapfFilterProducts();
  }); // handle the filter request for range number

  $wcapfNumberRangeFilters.on('input', '.wcapf-range-number .min-value, .wcapf-range-number .max-value', function (event) {
    event.preventDefault();
    var $item = $(this); // Clear any previously set timer before setting a fresh one

    clearTimeout($item.data('timer'));
    $item.data('timer', setTimeout(function () {
      $item.removeData('timer');
      var $rangeNumber = $item.closest('.wcapf-range-number');
      var filterKey = $rangeNumber.attr('data-filter-key');
      var rangeMinValue = $rangeNumber.attr('data-range-min-value');
      var rangeMaxValue = $rangeNumber.attr('data-range-max-value');
      var minValue = $rangeNumber.find('.min-value').val();
      var maxValue = $rangeNumber.find('.max-value').val(); // Force the minValue not to be empty.

      if (!minValue.length) {
        minValue = rangeMinValue;
        $rangeNumber.find('.min-value').val(minValue);
      } // Force the maxValue not to be empty.


      if (!maxValue.length) {
        maxValue = rangeMaxValue;
        $rangeNumber.find('.max-value').val(maxValue);
      } // Force the minValue not to go below the rangeMinValue.


      if (parseFloat(minValue) < parseFloat(rangeMinValue)) {
        minValue = rangeMinValue;
        $rangeNumber.find('.min-value').val(minValue);
      } // Force the minValue not to go up the rangeMaxValue.


      if (parseFloat(minValue) > parseFloat(rangeMaxValue)) {
        minValue = rangeMaxValue;
        $rangeNumber.find('.min-value').val(minValue);
      } // Force the maxValue not to go up the rangeMaxValue.


      if (parseFloat(maxValue) > parseFloat(rangeMaxValue)) {
        maxValue = rangeMaxValue;
        $rangeNumber.find('.max-value').val(maxValue);
      } // Force the maxValue not to go below the minValue.


      if (parseFloat(minValue) > parseFloat(maxValue)) {
        maxValue = minValue;
        $rangeNumber.find('.max-value').val(maxValue);
      }

      if (minValue === rangeMinValue && maxValue === rangeMaxValue) {
        var query = wcapfRemoveQueryStringParameter(filterKey);
        history.pushState({}, '', query);
      } else {
        var filterValString = minValue + rangeValuesSeparator + maxValue;
        wcapfUpdateQueryStringParameter(filterKey, filterValString);
      } // filter products


      wcapfFilterProducts();
    }, delay));
  }); // handle removing the active filters

  $wcapfNavFilters.on('click', '.wcapf-active-filters .item', function (event) {
    event.preventDefault();
    var $item = $(this);
    var filterKey = $item.attr('data-filter-key');
    var filterValue = $item.attr('data-value');
    wcapfMakeParameters(filterKey, filterValue, true);
  });

  function resetFilters($button) {
    var _filterKeys = $button.attr('data-keys');

    if (!_filterKeys) {
      return;
    }

    var filterKeys = _filterKeys.split(',');

    var query = '';
    $.each(filterKeys, function (i, filterKey) {
      if (query) {
        query = wcapfRemoveQueryStringParameter(filterKey, query);
      } else {
        query = wcapfRemoveQueryStringParameter(filterKey);
      }
    }); // Empty query causes issue(doesn't remove the filter keys from the url),
    // this is why we are setting the page url as query.

    if (!query) {
      var prevUrl = window.location.href;
      var newUrl = prevUrl.split('?');
      query = newUrl[0];
    }

    history.pushState({}, '', query); // filter products

    wcapfFilterProducts(true);
  } // clear all filters


  $wcapfNavFilters.on('click', '.wcapf-active-filters .wcapf-reset-filters-btn', function (event) {
    event.preventDefault();
    var $button = $(this);
    resetFilters($button);
  }); // reset filters

  $wcapfNavFilters.on('click', '.wcapf-reset-filters-btn', function (event) {
    event.preventDefault();
    var $button = $(this);
    resetFilters($button);
  });

  function filterByDate($input) {
    var $wcapfDateFilter = $input.closest('.wcapf-date-input');
    var filterKey = $wcapfDateFilter.attr('data-filter-key');
    var isRange = $wcapfDateFilter.attr('data-is-range');
    var filterValue = '';
    var runFilter = false; // Clear any previously set timer before setting a fresh one

    clearTimeout($wcapfDateFilter.data('timer'));

    if (isRange) {
      var from = $wcapfDateFilter.find('.date-from-input').val();
      var to = $wcapfDateFilter.find('.date-to-input').val();

      if (from && to) {
        filterValue = from + rangeValuesSeparator + to;
        runFilter = true;
      } else if (!from && !to) {
        runFilter = true;
      }
    } else {
      var _from = $wcapfDateFilter.find('.date-from-input').val();

      if (_from) {
        filterValue = _from;
        runFilter = true;
      } else {
        runFilter = true;
      }
    }

    if (runFilter) {
      $wcapfDateFilter.data('timer', setTimeout(function () {
        $wcapfDateFilter.removeData('timer');

        if (filterValue) {
          wcapfUpdateQueryStringParameter(filterKey, filterValue);
        } else {
          var query = wcapfRemoveQueryStringParameter(filterKey);
          history.pushState({}, '', query);
        } // filter products


        wcapfFilterProducts();
      }, delay));
    }
  } // history back and forward request handling


  $(window).bind('popstate', function () {
    // filter products
    wcapfFilterProducts(true);
  });
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNob3Nlbi5qcyIsImZpbHRlci1mb3JtLmpzIl0sIm5hbWVzIjpbImpRdWVyeSIsImRvY3VtZW50IiwicmVhZHkiLCIkIiwid2NhcGZfcGFyYW1zIiwicmFuZ2VWYWx1ZXNTZXBhcmF0b3IiLCJfZGVsYXkiLCJwYXJzZUludCIsImZpbHRlcl9pbnB1dF9kZWxheSIsImRlbGF5IiwiZmllbGRzIiwiJHdjYXBmU2luZ2xlRmlsdGVycyIsIiR3Y2FwZk5hdkZpbHRlcnMiLCIkd2NhcGZOdW1iZXJSYW5nZUZpbHRlcnMiLCJlYWNoIiwiJGZpZWxkIiwiaWQiLCJhdHRyIiwiJHdyYXBwZXIiLCJjaGlsZHJlbiIsImZpbHRlcktleSIsIm11bHRpcGxlRmlsdGVyIiwiaW5pdENob3NlbiIsImNob3NlbiIsImZpbmQiLCIkdGhpcyIsIm9wdGlvbnMiLCJub1Jlc3VsdHNNZXNzYWdlIiwic2VhcmNoVGhyZXNob2xkIiwiY2hvc2VuX2xpYl9zZWFyY2hfdGhyZXNob2xkIiwiaW5pdEhpZXJhcmNoeUFjY29yZGlvbiIsIm9uIiwidG9nZ2xlQ2xhc3MiLCJudW1iZXJfZm9ybWF0IiwibnVtYmVyIiwiZGVjaW1hbHMiLCJkZWNfcG9pbnQiLCJ0aG91c2FuZHNfc2VwIiwicmVwbGFjZSIsIm4iLCJpc0Zpbml0ZSIsInByZWMiLCJNYXRoIiwiYWJzIiwic2VwIiwiZGVjIiwicyIsInRvRml4ZWRGaXgiLCJrIiwicG93Iiwicm91bmQiLCJzcGxpdCIsImxlbmd0aCIsIkFycmF5Iiwiam9pbiIsImluaXROb1VJU2xpZGVyIiwibm9VaVNsaWRlciIsIiRpdGVtIiwiJHNsaWRlciIsImhhc0NsYXNzIiwic2xpZGVySWQiLCJkaXNwbGF5VmFsdWVzQXMiLCJyYW5nZU1pblZhbHVlIiwicGFyc2VGbG9hdCIsInJhbmdlTWF4VmFsdWUiLCJzdGVwIiwiZGVjaW1hbFBsYWNlcyIsInRob3VzYW5kU2VwYXJhdG9yIiwiZGVjaW1hbFNlcGFyYXRvciIsIm1pblZhbHVlIiwibWF4VmFsdWUiLCIkbWluVmFsdWUiLCIkbWF4VmFsdWUiLCJzbGlkZXIiLCJnZXRFbGVtZW50QnlJZCIsImNyZWF0ZSIsInN0YXJ0IiwiY29ubmVjdCIsInJhbmdlIiwidmFsdWVzIiwiaHRtbCIsInZhbCIsImZpbHRlclByb2R1Y3RzQWNjb3JkaW5nVG9TbGlkZXIiLCJxdWVyeSIsIndjYXBmUmVtb3ZlUXVlcnlTdHJpbmdQYXJhbWV0ZXIiLCJoaXN0b3J5IiwicHVzaFN0YXRlIiwiZmlsdGVyVmFsU3RyaW5nIiwid2NhcGZVcGRhdGVRdWVyeVN0cmluZ1BhcmFtZXRlciIsIndjYXBmRmlsdGVyUHJvZHVjdHMiLCJjbGVhclRpbWVvdXQiLCJkYXRhIiwic2V0VGltZW91dCIsInJlbW92ZURhdGEiLCJldmVudCIsInByZXZlbnREZWZhdWx0IiwiJGlucHV0Iiwic2V0IiwiZ2V0IiwiaW5pdERhdGVwaWNrZXIiLCJkYXRlcGlja2VyIiwiJHdjYXBmRGF0ZUZpbHRlcnMiLCIkd2NhcGZEYXRlRmlsdGVyIiwiZm9ybWF0IiwieWVhckRyb3Bkb3duIiwibW9udGhEcm9wZG93biIsIiRmcm9tIiwiJHRvIiwiZGF0ZUZvcm1hdCIsImNoYW5nZVllYXIiLCJjaGFuZ2VNb250aCIsImZpbHRlckJ5RGF0ZSIsIndjYXBmQmVmb3JlVXBkYXRlIiwidHJpZ2dlciIsIndjYXBmQWZ0ZXJVcGRhdGUiLCJmb3JjZVJlUmVuZGVyIiwid2luZG93IiwibG9jYXRpb24iLCJocmVmIiwiJGRhdGEiLCIkc2hvcExvb3BDb250YWluZXIiLCJzaG9wX2xvb3BfY29udGFpbmVyIiwiJG5vdEZvdW5kQ29udGFpbmVyIiwibm90X2ZvdW5kX2NvbnRhaW5lciIsImZpZWxkSUQiLCJfZmllbGQiLCJmaWVsZENsYXNzIiwiY3VzdG9tX3NjcmlwdHMiLCJldmFsIiwid2NhcGZHZXRVcmxWYXJzIiwidXJsIiwidmFycyIsImhhc2giLCJyZXBsYWNlQWxsIiwiaGFzaGVzIiwic2xpY2UiLCJpbmRleE9mIiwiaExlbmd0aCIsImkiLCJ3Y2FwZkZpeFBhZ2luYXRpb24iLCJwYXJhbXMiLCJjdXJyZW50UGFnZUluVXJsIiwiY3VycmVudFBhZ2VJblBhcmFtcyIsImtleSIsInZhbHVlIiwicHVzaEhpc3RvcnkiLCJyZSIsIlJlZ0V4cCIsInNlcGFyYXRvciIsInVybFdpdGhRdWVyeSIsIm1hdGNoIiwib2xkUGFyYW1zIiwib2xkUGFyYW1zTGVuZ3RoIiwiT2JqZWN0Iiwia2V5cyIsInN0YXJ0UG9zaXRpb24iLCJmaWx0ZXJLZXlQb3NpdGlvbiIsImNsZWFuVXJsIiwiY2xlYW5RdWVyeSIsIm5ld1BhcmFtcyIsIndjYXBmTWFrZVBhcmFtZXRlcnMiLCJmaWx0ZXJWYWx1ZSIsImZvcmNlUmVyZW5kZXIiLCJ2YWx1ZVNlcGFyYXRvciIsIm5leHRWYWx1ZXMiLCJlbXB0eVZhbHVlIiwicHJldlZhbHVlcyIsInByZXZWYWx1ZXNBcnJheSIsImZvdW5kIiwiaW5BcnJheSIsInNwbGljZSIsInB1c2giLCJ3Y2FwZlNpbmdsZUZpbHRlciIsImhhbmRsZUZpbHRlclJlcXVlc3QiLCJjbG9zZXN0IiwiZmllbGREYXRhIiwidG9TdHJpbmciLCIkcmFuZ2VOdW1iZXIiLCJyZXNldEZpbHRlcnMiLCIkYnV0dG9uIiwiX2ZpbHRlcktleXMiLCJmaWx0ZXJLZXlzIiwicHJldlVybCIsIm5ld1VybCIsImlzUmFuZ2UiLCJydW5GaWx0ZXIiLCJmcm9tIiwidG8iLCJiaW5kIl0sIm1hcHBpbmdzIjoiOztBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUFBLE1BQU0sQ0FBRUMsUUFBRixDQUFOLENBQW1CQyxLQUFuQixDQUEwQixVQUFVQyxDQUFWLEVBQWMsQ0FJdkMsQ0FKRDs7O0FDWEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBLElBQU1DLFlBQVksR0FBR0EsWUFBWSxJQUFJO0FBQ3BDLHdCQUFzQixFQURjO0FBRXBDLGlDQUErQixFQUZLO0FBR3BDLHlCQUF1QixFQUhhO0FBSXBDLHlCQUF1QixFQUphO0FB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LFlBQUtvRSxXQUFMLEVBQW1CO0FBQ2xCekUsVUFBQUEsK0JBQStCLENBQUVwRSxTQUFGLEVBQWE2SSxXQUFiLENBQS9CO0FBQ0EsU0FGRCxNQUVPO0FBQ04sY0FBTTlFLEtBQUssR0FBR0MsK0JBQStCLENBQUVoRSxTQUFGLENBQTdDO0FBQ0FpRSxVQUFBQSxPQUFPLENBQUNDLFNBQVIsQ0FBbUIsRUFBbkIsRUFBdUIsRUFBdkIsRUFBMkJILEtBQTNCO0FBQ0EsU0FScUQsQ0FVdEQ7OztBQUNBTSxRQUFBQSxtQkFBbUI7QUFDbkIsT0FaeUMsRUFZdkNoRixLQVp1QyxDQUExQztBQWFBO0FBQ0QsR0EvekJZLENBaTBCYjs7O0FBQ0FOLEVBQUFBLENBQUMsQ0FBRWlILE1BQUYsQ0FBRCxDQUFZd0UsSUFBWixDQUFrQixVQUFsQixFQUE4QixZQUFXO0FBQ3hDO0FBQ0FuRyxJQUFBQSxtQkFBbUIsQ0FBRSxJQUFGLENBQW5CO0FBQ0EsR0FIRDtBQUtBLENBeDBCRiIsImZpbGUiOiJ3Yy1hamF4LXByb2R1Y3QtZmlsdGVyLXB1YmxpYy1zY3JpcHRzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBEaXNwbGF5IHR5cGUgZmllbGRzLlxuICpcbiAqIFRPRE86IE1heWJlIGRlbGV0ZS5cbiAqXG4gKiBAc2luY2UgICAgICAzLjAuMFxuICogQHBhY2thZ2UgICAgd2MtYWpheC1wcm9kdWN0LWZpbHRlclxuICogQHN1YnBhY2thZ2Ugd2MtYWpheC1wcm9kdWN0LWZpbHRlci9hZG1pbi9zcmMvanNcbiAqIEBhdXRob3IgICAgIE1haW51bCBIYXNzYW4gTWFpblxuICovXG5cbmpRdWVyeSggZG9jdW1lbnQgKS5yZWFkeSggZnVuY3Rpb24oICQgKSB7XG5cblxuXG59ICk7XG4iLCIvKipcbiAqIFRoZSBmcm9udGVuZCBmaWx0ZXIgZm9ybS5cbiAqXG4gKiBAc2luY2UgICAgICAzLjAuMFxuICogQHBhY2thZ2UgICAgd2MtYWpheC1wcm9kdWN0LWZpbHRlclxuICogQHN1YnBhY2thZ2Ugd2MtYWpheC1wcm9kdWN0LWZpbHRlci9wdWJsaWMvc3JjL2pzXG4gKiBAYXV0aG9yICAgICBNYWludWwgSGFzc2FuIE1haW5cbiAqL1xuXG5jb25zdCB3Y2FwZl9wYXJhbXMgPSB3Y2FwZl9wYXJhbXMgfHwge1xuXHQnZmlsdGVyX2lucHV0X2RlbGF5JzogJycsXG5cdCdjaG9zZW5fbGliX3NlYXJjaF90aHJlc2hvbGQnOiAnJyxcblx0J3Nob3BfbG9vcF9jb250YWluZXInOiAnJyxcblx0J25vdF9mb3VuZF9jb250YWluZXInOiAnJyxcblx0J3BhZ2luYXRpb25fY29udGFpbmVyJzogJycsIC8vIHRvZG9cblx0J3NvcnRpbmdfY29udHJvbCc6ICcnLCAvLyB0b2RvXG5cdCdzY3JvbGxfdG9fdG9wJzogJycsIC8vIHRvZG9cblx0J3Njcm9sbF90b190b3Bfb2Zmc2V0JzogJycsIC8vIHRvZG9cblx0J2N1c3RvbV9zY3JpcHRzJzogJycsXG59O1xuXG5qUXVlcnkoIGRvY3VtZW50ICkucmVhZHkoXG5cdGZ1bmN0aW9uKCAkICkge1xuXG5cdFx0Y29uc3QgcmFuZ2VWYWx1ZXNTZXBhcmF0b3IgPSAnfic7XG5cblx0XHQvLyByZXR1cm4gZmFsc2UgaWYgd2NhcGZfcGFyYW1zIHZhcmlhYmxlIGlzIG5vdCBmb3VuZFxuXHRcdGlmICggdHlwZW9mIHdjYXBmX3BhcmFtcyA9PT0gJ3VuZGVmaW5lZCcgKSB7XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fVxuXG5cdFx0Y29uc3QgX2RlbGF5ID0gcGFyc2VJbnQoIHdjYXBmX3BhcmFtcy5maWx0ZXJfaW5wdXRfZGVsYXkgKTtcblx0XHRjb25zdCBkZWxheSAgPSBfZGVsYXkgPj0gMCA/IF9kZWxheSA6IDgwMDtcblxuXHRcdC8vIHN0b3JlIGZpZWxkcycgaWQgYW5kIGZpbHRlciBpbmZvcm1hdGlvblxuXHRcdGNvbnN0IGZpZWxkcyA9IHt9O1xuXG5cdFx0Y29uc3QgJHdjYXBmU2luZ2xlRmlsdGVycyAgICAgID0gJCggJy53Y2FwZi1zaW5nbGUtZmlsdGVyJyApO1xuXHRcdGNvbnN0ICR3Y2FwZk5hdkZpbHRlcnMgICAgICAgICA9ICQoICcud2NhcGYtbmF2LWZpbHRlcicgKTtcblx0XHRjb25zdCAkd2NhcGZOdW1iZXJSYW5nZUZpbHRlcnMgPSAkKCAnLndjYXBmLW51bWJlci1yYW5nZS1maWx0ZXInICk7XG5cblx0XHQkd2NhcGZTaW5nbGVGaWx0ZXJzLmVhY2goXG5cdFx0XHRmdW5jdGlvbigpIHtcblx0XHRcdFx0Y29uc3QgJGZpZWxkICAgICAgICAgPSAkKCB0aGlzICk7XG5cdFx0XHRcdGNvbnN0IGlkICAgICAgICAgICAgID0gJGZpZWxkLmF0dHIoICdkYXRhLWlkJyApO1xuXHRcdFx0XHRjb25zdCAkd3JhcHBlciAgICAgICA9ICRmaWVsZC5jaGlsZHJlbiggJ2RpdicgKTtcblx0XHRcdFx0Y29uc3QgZmlsdGVyS2V5ICAgICAgPSAkd3JhcHBlci5hdHRyKCAnZGF0YS1maWx0ZXIta2V5JyApO1xuXHRcdFx0XHRjb25zdCBtdWx0aXBsZUZpbHRlciA9IHBhcnNlSW50KCAkd3JhcHBlci5hdHRyKCAnZGF0YS1tdWx0aXBsZS1maWx0ZXInICkgKTtcblxuXHRcdFx0XHRmaWVsZHNbIGlkIF0gPSB7XG5cdFx0XHRcdFx0ZmlsdGVyS2V5OiBmaWx0ZXJLZXksXG5cdFx0XHRcdFx0bXVsdGlwbGVGaWx0ZXI6IG11bHRpcGxlRmlsdGVyXG5cdFx0XHRcdH07XG5cdFx0XHR9XG5cdFx0KTtcblxuXHRcdC8vIEluaXRpYWxpemUgalF1ZXJ5IGNob3NlbiBsaWJyYXJ5XG5cdFx0ZnVuY3Rpb24gaW5pdENob3NlbigpIHtcblx0XHRcdGlmICggISBqUXVlcnkoKS5jaG9zZW4gKSB7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblxuXHRcdFx0JHdjYXBmTmF2RmlsdGVycy5maW5kKCAnLndjYXBmLWNob3Nlbi1zZWxlY3QnICkuZWFjaCggZnVuY3Rpb24oKSB7XG5cdFx0XHRcdGNvbnN0ICR0aGlzICAgPSAkKCB0aGlzICk7XG5cdFx0XHRcdGNvbnN0IG9wdGlvbnMgPSB7fTtcblxuXHRcdFx0XHRjb25zdCBub1Jlc3VsdHNNZXNzYWdlID0gJHRoaXMuYXR0ciggJ2RhdGEtbm8tcmVzdWx0cy1tZXNzYWdlJyApO1xuXG5cdFx0XHRcdGlmICggbm9SZXN1bHRzTWVzc2FnZSApIHtcblx0XHRcdFx0XHRvcHRpb25zWyAnbm9fcmVzdWx0c190ZXh0JyBdID0gbm9SZXN1bHRzTWVzc2FnZTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGNvbnN0IHNlYXJjaFRocmVzaG9sZCA9IHBhcnNlSW50KCB3Y2FwZl9wYXJhbXMuY2hvc2VuX2xpYl9zZWFyY2hfdGhyZXNob2xkICk7XG5cblx0XHRcdFx0aWYgKCBzZWFyY2hUaHJlc2hvbGQgKSB7XG5cdFx0XHRcdFx0b3B0aW9uc1sgJ2Rpc2FibGVfc2VhcmNoX3RocmVzaG9sZCcgXSA9IHNlYXJjaFRocmVzaG9sZDtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdCR0aGlzLmNob3Nlbiggb3B0aW9ucyApO1xuXHRcdFx0fSApO1xuXHRcdH1cblxuXHRcdGluaXRDaG9zZW4oKTtcblxuXHRcdC8vIEluaXRpYWxpemUgaGllcmFyY2h5IGFjY29yZGlvblxuXHRcdGZ1bmN0aW9uIGluaXRIaWVyYXJjaHlBY2NvcmRpb24oKSB7XG5cdFx0XHQkd2NhcGZOYXZGaWx0ZXJzLmZpbmQoICcuaGllcmFyY2h5LWFjY29yZGlvbi10b2dnbGUnICkub24oICdjbGljaycsIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHQkKCB0aGlzICkudG9nZ2xlQ2xhc3MoICdhY3RpdmUnICk7XG5cdFx0XHR9ICk7XG5cdFx0fVxuXG5cdFx0aW5pdEhpZXJhcmNoeUFjY29yZGlvbigpO1xuXG5cdFx0LyoqXG5cdFx0ICogQHNvdXJjZSBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL2EvMzQxNDE4MTNcblx0XHQgKlxuXHRcdCAqIEBwYXJhbSBudW1iZXJcblx0XHQgKiBAcGFyYW0gZGVjaW1hbHNcblx0XHQgKiBAcGFyYW0gZGVjX3BvaW50XG5cdFx0ICogQHBhcmFtIHRob3VzYW5kc19zZXBcblx0XHQgKlxuXHRcdCAqIEByZXR1cm5zIHtzdHJpbmd9XG5cdFx0ICovXG5cdFx0ZnVuY3Rpb24gbnVtYmVyX2Zvcm1hdCggbnVtYmVyLCBkZWNpbWFscywgZGVjX3BvaW50LCB0aG91c2FuZHNfc2VwICkge1xuXHRcdFx0Ly8gU3RyaXAgYWxsIGNoYXJhY3RlcnMgYnV0IG51bWVyaWNhbCBvbmVzLlxuXHRcdFx0bnVtYmVyID0gKCBudW1iZXIgKyAnJyApLnJlcGxhY2UoIC9bXlxcZCtcXC1FZS5dL2csICcnICk7XG5cblx0XHRcdGNvbnN0IG4gICAgPSAhIGlzRmluaXRlKCArbnVtYmVyICkgPyAwIDogK251bWJlcjtcblx0XHRcdGNvbnN0IHByZWMgPSAhIGlzRmluaXRlKCArZGVjaW1hbHMgKSA/IDAgOiBNYXRoLmFicyggZGVjaW1hbHMgKTtcblx0XHRcdGNvbnN0IHNlcCAgPSAoIHR5cGVvZiB0aG91c2FuZHNfc2VwID09PSAndW5kZWZpbmVkJyApID8gJywnIDogdGhvdXNhbmRzX3NlcDtcblx0XHRcdGNvbnN0IGRlYyAgPSAoIHR5cGVvZiBkZWNfcG9pbnQgPT09ICd1bmRlZmluZWQnICkgPyAnLicgOiBkZWNfcG9pbnQ7XG5cblx0XHRcdGxldCBzO1xuXG5cdFx0XHRjb25zdCB0b0ZpeGVkRml4ID0gZnVuY3Rpb24oIG4sIHByZWMgKSB7XG5cdFx0XHRcdGNvbnN0IGsgPSBNYXRoLnBvdyggMTAsIHByZWMgKTtcblx0XHRcdFx0cmV0dXJuICcnICsgTWF0aC5yb3VuZCggbiAqIGsgKSAvIGs7XG5cdFx0XHR9O1xuXG5cdFx0XHQvLyBGaXggZm9yIElFIHBhcnNlRmxvYXQoMC41NSkudG9GaXhlZCgwKSA9IDA7XG5cdFx0XHRzID0gKCBwcmVjID8gdG9GaXhlZEZpeCggbiwgcHJlYyApIDogJycgKyBNYXRoLnJvdW5kKCBuICkgKS5zcGxpdCggJy4nICk7XG5cblx0XHRcdGlmICggc1sgMCBdLmxlbmd0aCA+IDMgKSB7XG5cdFx0XHRcdHNbIDAgXSA9IHNbIDAgXS5yZXBsYWNlKCAvXFxCKD89KD86XFxkezN9KSsoPyFcXGQpKS9nLCBzZXAgKTtcblx0XHRcdH1cblxuXHRcdFx0aWYgKCAoIHNbIDEgXSB8fCAnJyApLmxlbmd0aCA8IHByZWMgKSB7XG5cdFx0XHRcdHNbIDEgXSA9IHNbIDEgXSB8fCAnJztcblx0XHRcdFx0c1sgMSBdICs9IG5ldyBBcnJheSggcHJlYyAtIHNbIDEgXS5sZW5ndGggKyAxICkuam9pbiggJzAnICk7XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiBzLmpvaW4oIGRlYyApO1xuXHRcdH1cblxuXHRcdC8vIEluaXRpYWxpemUgbm9VSVNsaWRlclxuXHRcdGZ1bmN0aW9uIGluaXROb1VJU2xpZGVyKCkge1xuXHRcdFx0aWYgKCAndW5kZWZpbmVkJyA9PT0gdHlwZW9mIG5vVWlTbGlkZXIgKSB7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblxuXHRcdFx0JHdjYXBmTnVtYmVyUmFuZ2VGaWx0ZXJzLmZpbmQoICcud2NhcGYtcmFuZ2Utc2xpZGVyJyApLmVhY2goIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRjb25zdCAkaXRlbSA9ICQoIHRoaXMgKTtcblxuXHRcdFx0XHRjb25zdCBmaWx0ZXJLZXkgPSAkaXRlbS5hdHRyKCAnZGF0YS1maWx0ZXIta2V5JyApO1xuXHRcdFx0XHRjb25zdCAkc2xpZGVyICAgPSAkaXRlbS5maW5kKCAnLndjYXBmLW5vdWktc2xpZGVyJyApO1xuXG5cdFx0XHRcdC8vIElmIHNsaWRlciBpcyBhbHJlYWR5IGluaXRpYWxpemVkIHRoZW4gZG9uJ3QgcmVpbml0aWFsaXplIGFnYWluLlxuXHRcdFx0XHRpZiAoICRzbGlkZXIuaGFzQ2xhc3MoICdub1VpLXRhcmdldCcgKSApIHtcblx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRjb25zdCBzbGlkZXJJZCAgICAgICAgICA9ICRzbGlkZXIuYXR0ciggJ2lkJyApO1xuXHRcdFx0XHRjb25zdCBkaXNwbGF5VmFsdWVzQXMgICA9ICRpdGVtLmF0dHIoICdkYXRhLWRpc3BsYXktdmFsdWVzLWFzJyApO1xuXHRcdFx0XHRjb25zdCByYW5nZU1pblZhbHVlICAgICA9IHBhcnNlRmxvYXQoICRpdGVtLmF0dHIoICdkYXRhLXJhbmdlLW1pbi12YWx1ZScgKSApO1xuXHRcdFx0XHRjb25zdCByYW5nZU1heFZhbHVlICAgICA9IHBhcnNlRmxvYXQoICRpdGVtLmF0dHIoICdkYXRhLXJhbmdlLW1heC12YWx1ZScgKSApO1xuXHRcdFx0XHRjb25zdCBzdGVwICAgICAgICAgICAgICA9IHBhcnNlRmxvYXQoICRpdGVtLmF0dHIoICdkYXRhLXN0ZXAnICkgKTtcblx0XHRcdFx0Y29uc3QgZGVjaW1hbFBsYWNlcyAgICAgPSAkaXRlbS5hdHRyKCAnZGF0YS1kZWNpbWFsLXBsYWNlcycgKTtcblx0XHRcdFx0Y29uc3QgdGhvdXNhbmRTZXBhcmF0b3IgPSAkaXRlbS5hdHRyKCAnZGF0YS10aG91c2FuZC1zZXBhcmF0b3InICk7XG5cdFx0XHRcdGNvbnN0IGRlY2ltYWxTZXBhcmF0b3IgID0gJGl0ZW0uYXR0ciggJ2RhdGEtZGVjaW1hbC1zZXBhcmF0b3InICk7XG5cdFx0XHRcdGNvbnN0IG1pblZhbHVlICAgICAgICAgID0gcGFyc2VGbG9hdCggJGl0ZW0uYXR0ciggJ2RhdGEtbWluLXZhbHVlJyApICk7XG5cdFx0XHRcdGNvbnN0IG1heFZhbHVlICAgICAgICAgID0gcGFyc2VGbG9hdCggJGl0ZW0uYXR0ciggJ2RhdGEtbWF4LXZhbHVlJyApICk7XG5cdFx0XHRcdGNvbnN0ICRtaW5WYWx1ZSAgICAgICAgID0gJGl0ZW0uZmluZCggJy5taW4tdmFsdWUnICk7XG5cdFx0XHRcdGNvbnN0ICRtYXhWYWx1ZSAgICAgICAgID0gJGl0ZW0uZmluZCggJy5tYXgtdmFsdWUnICk7XG5cblx0XHRcdFx0Y29uc3Qgc2xpZGVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoIHNsaWRlcklkICk7XG5cblx0XHRcdFx0bm9VaVNsaWRlci5jcmVhdGUoIHNsaWRlciwge1xuXHRcdFx0XHRcdHN0YXJ0OiBbIG1pblZhbHVlLCBtYXhWYWx1ZSBdLFxuXHRcdFx0XHRcdHN0ZXAsXG5cdFx0XHRcdFx0Y29ubmVjdDogdHJ1ZSxcblx0XHRcdFx0XHRyYW5nZToge1xuXHRcdFx0XHRcdFx0J21pbic6IHJhbmdlTWluVmFsdWUsXG5cdFx0XHRcdFx0XHQnbWF4JzogcmFuZ2VNYXhWYWx1ZSxcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0gKTtcblxuXHRcdFx0XHRzbGlkZXIubm9VaVNsaWRlci5vbiggJ3VwZGF0ZScsIGZ1bmN0aW9uKCB2YWx1ZXMgKSB7XG5cdFx0XHRcdFx0Y29uc3QgbWluVmFsdWUgPSBudW1iZXJfZm9ybWF0KCB2YWx1ZXNbIDAgXSwgZGVjaW1hbFBsYWNlcywgZGVjaW1hbFNlcGFyYXRvciwgdGhvdXNhbmRTZXBhcmF0b3IgKTtcblx0XHRcdFx0XHRjb25zdCBtYXhWYWx1ZSA9IG51bWJlcl9mb3JtYXQoIHZhbHVlc1sgMSBdLCBkZWNpbWFsUGxhY2VzLCBkZWNpbWFsU2VwYXJhdG9yLCB0aG91c2FuZFNlcGFyYXRvciApO1xuXG5cdFx0XHRcdFx0aWYgKCAncGxhaW5fdGV4dCcgPT09IGRpc3BsYXlWYWx1ZXNBcyApIHtcblx0XHRcdFx0XHRcdCRtaW5WYWx1ZS5odG1sKCBtaW5WYWx1ZSApO1xuXHRcdFx0XHRcdFx0JG1heFZhbHVlLmh0bWwoIG1heFZhbHVlICk7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdCRtaW5WYWx1ZS52YWwoIG1pblZhbHVlICk7XG5cdFx0XHRcdFx0XHQkbWF4VmFsdWUudmFsKCBtYXhWYWx1ZSApO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSApO1xuXG5cdFx0XHRcdGZ1bmN0aW9uIGZpbHRlclByb2R1Y3RzQWNjb3JkaW5nVG9TbGlkZXIoIHZhbHVlcyApIHtcblx0XHRcdFx0XHRjb25zdCBtaW5WYWx1ZSA9IHBhcnNlRmxvYXQoIHZhbHVlc1sgMCBdICk7XG5cdFx0XHRcdFx0Y29uc3QgbWF4VmFsdWUgPSBwYXJzZUZsb2F0KCB2YWx1ZXNbIDEgXSApO1xuXG5cdFx0XHRcdFx0aWYgKCBtaW5WYWx1ZSA9PT0gcmFuZ2VNaW5WYWx1ZSAmJiBtYXhWYWx1ZSA9PT0gcmFuZ2VNYXhWYWx1ZSApIHtcblx0XHRcdFx0XHRcdGNvbnN0IHF1ZXJ5ID0gd2NhcGZSZW1vdmVRdWVyeVN0cmluZ1BhcmFtZXRlciggZmlsdGVyS2V5ICk7XG5cdFx0XHRcdFx0XHRoaXN0b3J5LnB1c2hTdGF0ZSgge30sICcnLCBxdWVyeSApO1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRjb25zdCBmaWx0ZXJWYWxTdHJpbmcgPSBtaW5WYWx1ZSArIHJhbmdlVmFsdWVzU2VwYXJhdG9yICsgbWF4VmFsdWU7XG5cdFx0XHRcdFx0XHR3Y2FwZlVwZGF0ZVF1ZXJ5U3RyaW5nUGFyYW1ldGVyKCBmaWx0ZXJLZXksIGZpbHRlclZhbFN0cmluZyApO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdC8vIGZpbHRlciBwcm9kdWN0c1xuXHRcdFx0XHRcdHdjYXBmRmlsdGVyUHJvZHVjdHMoKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdHNsaWRlci5ub1VpU2xpZGVyLm9uKCAnZW5kJywgZnVuY3Rpb24oIHZhbHVlcyApIHtcblx0XHRcdFx0XHQvLyBDbGVhciBhbnkgcHJldmlvdXNseSBzZXQgdGltZXIgYmVmb3JlIHNldHRpbmcgYSBmcmVzaCBvbmVcblx0XHRcdFx0XHRjbGVhclRpbWVvdXQoICRpdGVtLmRhdGEoICd0aW1lcicgKSApO1xuXG5cdFx0XHRcdFx0JGl0ZW0uZGF0YSggJ3RpbWVyJywgc2V0VGltZW91dCggZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0XHQkaXRlbS5yZW1vdmVEYXRhKCAndGltZXInICk7XG5cblx0XHRcdFx0XHRcdGZpbHRlclByb2R1Y3RzQWNjb3JkaW5nVG9TbGlkZXIoIHZhbHVlcyApO1xuXHRcdFx0XHRcdH0sIGRlbGF5ICkgKTtcblx0XHRcdFx0fSApO1xuXG5cdFx0XHRcdCRtaW5WYWx1ZS5vbiggJ2lucHV0JywgZnVuY3Rpb24oIGV2ZW50ICkge1xuXHRcdFx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cblx0XHRcdFx0XHRjb25zdCAkaW5wdXQgPSAkKCB0aGlzICk7XG5cblx0XHRcdFx0XHQvLyBDbGVhciBhbnkgcHJldmlvdXNseSBzZXQgdGltZXIgYmVmb3JlIHNldHRpbmcgYSBmcmVzaCBvbmVcblx0XHRcdFx0XHRjbGVhclRpbWVvdXQoICRpbnB1dC5kYXRhKCAndGltZXInICkgKTtcblxuXHRcdFx0XHRcdCRpbnB1dC5kYXRhKCAndGltZXInLCBzZXRUaW1lb3V0KCBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHRcdCRpbnB1dC5yZW1vdmVEYXRhKCAndGltZXInICk7XG5cblx0XHRcdFx0XHRcdGNvbnN0IG1pblZhbHVlID0gJGlucHV0LnZhbCgpO1xuXG5cdFx0XHRcdFx0XHRzbGlkZXIubm9VaVNsaWRlci5zZXQoIFsgbWluVmFsdWUsIG51bGwgXSApO1xuXG5cdFx0XHRcdFx0XHRmaWx0ZXJQcm9kdWN0c0FjY29yZGluZ1RvU2xpZGVyKCBzbGlkZXIubm9VaVNsaWRlci5nZXQoKSApO1xuXHRcdFx0XHRcdH0sIGRlbGF5ICkgKTtcblx0XHRcdFx0fSApO1xuXG5cdFx0XHRcdCRtYXhWYWx1ZS5vbiggJ2lucHV0JywgZnVuY3Rpb24oIGV2ZW50ICkge1xuXHRcdFx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cblx0XHRcdFx0XHRjb25zdCAkaW5wdXQgPSAkKCB0aGlzICk7XG5cblx0XHRcdFx0XHQvLyBDbGVhciBhbnkgcHJldmlvdXNseSBzZXQgdGltZXIgYmVmb3JlIHNldHRpbmcgYSBmcmVzaCBvbmVcblx0XHRcdFx0XHRjbGVhclRpbWVvdXQoICRpbnB1dC5kYXRhKCAndGltZXInICkgKTtcblxuXHRcdFx0XHRcdCRpbnB1dC5kYXRhKCAndGltZXInLCBzZXRUaW1lb3V0KCBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHRcdCRpbnB1dC5yZW1vdmVEYXRhKCAndGltZXInICk7XG5cblx0XHRcdFx0XHRcdGNvbnN0IG1heFZhbHVlID0gJGlucHV0LnZhbCgpO1xuXG5cdFx0XHRcdFx0XHRzbGlkZXIubm9VaVNsaWRlci5zZXQoIFsgbnVsbCwgbWF4VmFsdWUgXSApO1xuXG5cdFx0XHRcdFx0XHRmaWx0ZXJQcm9kdWN0c0FjY29yZGluZ1RvU2xpZGVyKCBzbGlkZXIubm9VaVNsaWRlci5nZXQoKSApO1xuXHRcdFx0XHRcdH0sIGRlbGF5ICkgKTtcblx0XHRcdFx0fSApO1xuXHRcdFx0fSApO1xuXHRcdH1cblxuXHRcdGluaXROb1VJU2xpZGVyKCk7XG5cblx0XHRmdW5jdGlvbiBpbml0RGF0ZXBpY2tlcigpIHtcblx0XHRcdGlmICggISBqUXVlcnkoKS5kYXRlcGlja2VyICkge1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdGNvbnN0ICR3Y2FwZkRhdGVGaWx0ZXJzID0gJCggJy53Y2FwZi1kYXRlLXJhbmdlLWZpbHRlcicgKTtcblx0XHRcdGNvbnN0ICR3Y2FwZkRhdGVGaWx0ZXIgID0gJHdjYXBmRGF0ZUZpbHRlcnMuZmluZCggJy53Y2FwZi1kYXRlLWlucHV0JyApO1xuXG5cdFx0XHRjb25zdCBmb3JtYXQgICAgICAgID0gJHdjYXBmRGF0ZUZpbHRlci5hdHRyKCAnZGF0YS1kYXRlLWZvcm1hdCcgKTtcblx0XHRcdGNvbnN0IHllYXJEcm9wZG93biAgPSAkd2NhcGZEYXRlRmlsdGVyLmF0dHIoICdkYXRhLWRhdGUtcGlja2VyLXllYXItZHJvcGRvd24nICk7XG5cdFx0XHRjb25zdCBtb250aERyb3Bkb3duID0gJHdjYXBmRGF0ZUZpbHRlci5hdHRyKCAnZGF0YS1kYXRlLXBpY2tlci1tb250aC1kcm9wZG93bicgKTtcblxuXHRcdFx0Y29uc3QgJGZyb20gPSAkd2NhcGZEYXRlRmlsdGVyLmZpbmQoICcuZGF0ZS1mcm9tLWlucHV0JyApO1xuXHRcdFx0Y29uc3QgJHRvICAgPSAkd2NhcGZEYXRlRmlsdGVyLmZpbmQoICcuZGF0ZS10by1pbnB1dCcgKTtcblxuXHRcdFx0JGZyb20uZGF0ZXBpY2tlcigge1xuXHRcdFx0XHRkYXRlRm9ybWF0OiBmb3JtYXQsXG5cdFx0XHRcdGNoYW5nZVllYXI6IHllYXJEcm9wZG93bixcblx0XHRcdFx0Y2hhbmdlTW9udGg6IG1vbnRoRHJvcGRvd24sXG5cdFx0XHR9ICk7XG5cblx0XHRcdCR0by5kYXRlcGlja2VyKCB7XG5cdFx0XHRcdGRhdGVGb3JtYXQ6IGZvcm1hdCxcblx0XHRcdFx0Y2hhbmdlWWVhcjogeWVhckRyb3Bkb3duLFxuXHRcdFx0XHRjaGFuZ2VNb250aDogbW9udGhEcm9wZG93bixcblx0XHRcdH0gKTtcblxuXHRcdFx0JGZyb20ub24oICdjaGFuZ2UnLCBmdW5jdGlvbigpIHtcblx0XHRcdFx0Y29uc3QgJGlucHV0ID0gJCggdGhpcyApO1xuXHRcdFx0XHRmaWx0ZXJCeURhdGUoICRpbnB1dCApO1xuXHRcdFx0fSApO1xuXG5cdFx0XHQkdG8ub24oICdjaGFuZ2UnLCBmdW5jdGlvbigpIHtcblx0XHRcdFx0Y29uc3QgJGlucHV0ID0gJCggdGhpcyApO1xuXHRcdFx0XHRmaWx0ZXJCeURhdGUoICRpbnB1dCApO1xuXHRcdFx0fSApO1xuXHRcdH1cblxuXHRcdGluaXREYXRlcGlja2VyKCk7XG5cblx0XHQvLyBzaG93IGEgbG9hZGluZyBpbmRpY2F0b3Jcblx0XHRmdW5jdGlvbiB3Y2FwZkJlZm9yZVVwZGF0ZSgpIHtcblx0XHRcdCQoICdib2R5JyApLnRyaWdnZXIoICd3Y2FwZl9iZWZvcmVfdXBkYXRlX2ZpbHRlcnMnICk7XG5cdFx0fVxuXG5cdFx0Ly8gc2Nyb2xsIHRvIHRvcFxuXHRcdGZ1bmN0aW9uIHdjYXBmQWZ0ZXJVcGRhdGUoKSB7XG5cdFx0XHRpbml0Q2hvc2VuKCk7XG5cdFx0XHRpbml0SGllcmFyY2h5QWNjb3JkaW9uKCk7XG5cdFx0XHRpbml0Tm9VSVNsaWRlcigpO1xuXHRcdFx0aW5pdERhdGVwaWNrZXIoKTtcblxuXHRcdFx0JCggJ2JvZHknICkudHJpZ2dlciggJ3djYXBmX2FmdGVyX3VwZGF0ZV9maWx0ZXJzJyApO1xuXHRcdH1cblxuXHRcdC8vIGZpbHRlciB0aGUgcHJvZHVjdHNcblx0XHRmdW5jdGlvbiB3Y2FwZkZpbHRlclByb2R1Y3RzKCBmb3JjZVJlUmVuZGVyID0gZmFsc2UgKSB7XG5cdFx0XHR3Y2FwZkJlZm9yZVVwZGF0ZSgpO1xuXG5cdFx0XHQkLmdldChcblx0XHRcdFx0d2luZG93LmxvY2F0aW9uLmhyZWYsXG5cdFx0XHRcdGZ1bmN0aW9uKCBkYXRhICkge1xuXHRcdFx0XHRcdGNvbnN0ICRkYXRhID0gJCggZGF0YSApO1xuXG5cdFx0XHRcdFx0Y29uc3QgJHNob3BMb29wQ29udGFpbmVyID0gJGRhdGEuZmluZCggd2NhcGZfcGFyYW1zLnNob3BfbG9vcF9jb250YWluZXIgKTtcblx0XHRcdFx0XHRjb25zdCAkbm90Rm91bmRDb250YWluZXIgPSAkZGF0YS5maW5kKCB3Y2FwZl9wYXJhbXMubm90X2ZvdW5kX2NvbnRhaW5lciApO1xuXG5cdFx0XHRcdFx0Ly8gcmVwbGFjZSBmaWVsZHMnIGRhdGEgd2l0aCBuZXcgZGF0YVxuXHRcdFx0XHRcdCQuZWFjaChcblx0XHRcdFx0XHRcdGZpZWxkcyxcblx0XHRcdFx0XHRcdGZ1bmN0aW9uKCBpZCApIHtcblx0XHRcdFx0XHRcdFx0Y29uc3QgZmllbGRJRCAgICA9ICdbZGF0YS1pZD1cIicgKyBpZCArICdcIl0nO1xuXHRcdFx0XHRcdFx0XHRjb25zdCAkZmllbGQgICAgID0gJCggZmllbGRJRCApO1xuXHRcdFx0XHRcdFx0XHRjb25zdCBfZmllbGQgICAgID0gJGRhdGEuZmluZCggZmllbGRJRCApO1xuXHRcdFx0XHRcdFx0XHRjb25zdCBmaWVsZENsYXNzID0gJCggX2ZpZWxkICkuYXR0ciggJ2NsYXNzJyApO1xuXG5cdFx0XHRcdFx0XHRcdC8vIFdoZW4gY2FsbGVkIGZyb20gaGlzdG9yeSBiYWNrIG9yIGZvcndhcmQgcmVxdWVzdCB0aGVuIHJlcmVuZGVyIGFsbCBmaWVsZHMuXG5cdFx0XHRcdFx0XHRcdGlmICggZm9yY2VSZVJlbmRlciApIHtcblxuXHRcdFx0XHRcdFx0XHRcdC8vIHVwZGF0ZSBjbGFzc1xuXHRcdFx0XHRcdFx0XHRcdCRmaWVsZC5hdHRyKCAnY2xhc3MnLCBmaWVsZENsYXNzICk7XG5cblx0XHRcdFx0XHRcdFx0XHQvLyB1cGRhdGUgZmllbGRcblx0XHRcdFx0XHRcdFx0XHQkZmllbGQuaHRtbCggX2ZpZWxkLmh0bWwoKSApO1xuXG5cdFx0XHRcdFx0XHRcdH0gZWxzZSB7XG5cblx0XHRcdFx0XHRcdFx0XHQvLyBTZWxlY3RpdmVseSByZXJlbmRlciB0aGUgZmllbGRzLlxuXHRcdFx0XHRcdFx0XHRcdGlmICggJGZpZWxkLmhhc0NsYXNzKCAnd2NhcGYtbmF2LWZpbHRlcicgKSApIHtcblxuXHRcdFx0XHRcdFx0XHRcdFx0Ly8gdXBkYXRlIGNsYXNzXG5cdFx0XHRcdFx0XHRcdFx0XHQkZmllbGQuYXR0ciggJ2NsYXNzJywgZmllbGRDbGFzcyApO1xuXG5cdFx0XHRcdFx0XHRcdFx0XHQvLyB1cGRhdGUgZmllbGRcblx0XHRcdFx0XHRcdFx0XHRcdCRmaWVsZC5odG1sKCBfZmllbGQuaHRtbCgpICk7XG5cblx0XHRcdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdCk7XG5cblx0XHRcdFx0XHQvLyByZXBsYWNlIG9sZCBzaG9wIGxvb3Agd2l0aCBuZXcgb25lXG5cdFx0XHRcdFx0aWYgKCB3Y2FwZl9wYXJhbXMuc2hvcF9sb29wX2NvbnRhaW5lciA9PT0gd2NhcGZfcGFyYW1zLm5vdF9mb3VuZF9jb250YWluZXIgKSB7XG5cdFx0XHRcdFx0XHQkKCB3Y2FwZl9wYXJhbXMuc2hvcF9sb29wX2NvbnRhaW5lciApLmh0bWwoICRzaG9wTG9vcENvbnRhaW5lci5odG1sKCkgKTtcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0aWYgKCAkKCB3Y2FwZl9wYXJhbXMubm90X2ZvdW5kX2NvbnRhaW5lciApLmxlbmd0aCApIHtcblx0XHRcdFx0XHRcdFx0aWYgKCAkc2hvcExvb3BDb250YWluZXIubGVuZ3RoICkge1xuXHRcdFx0XHRcdFx0XHRcdCQoIHdjYXBmX3BhcmFtcy5ub3RfZm91bmRfY29udGFpbmVyICkuaHRtbCggJHNob3BMb29wQ29udGFpbmVyLmh0bWwoKSApO1xuXHRcdFx0XHRcdFx0XHR9IGVsc2UgaWYgKCAkbm90Rm91bmRDb250YWluZXIubGVuZ3RoICkge1xuXHRcdFx0XHRcdFx0XHRcdCQoIHdjYXBmX3BhcmFtcy5ub3RfZm91bmRfY29udGFpbmVyICkuaHRtbCggJG5vdEZvdW5kQ29udGFpbmVyLmh0bWwoKSApO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9IGVsc2UgaWYgKCAkKCB3Y2FwZl9wYXJhbXMuc2hvcF9sb29wX2NvbnRhaW5lciApLmxlbmd0aCApIHtcblx0XHRcdFx0XHRcdFx0aWYgKCAkc2hvcExvb3BDb250YWluZXIubGVuZ3RoICkge1xuXHRcdFx0XHRcdFx0XHRcdCQoIHdjYXBmX3BhcmFtcy5zaG9wX2xvb3BfY29udGFpbmVyICkuaHRtbCggJHNob3BMb29wQ29udGFpbmVyLmh0bWwoKSApO1xuXHRcdFx0XHRcdFx0XHR9IGVsc2UgaWYgKCAkbm90Rm91bmRDb250YWluZXIubGVuZ3RoICkge1xuXHRcdFx0XHRcdFx0XHRcdCQoIHdjYXBmX3BhcmFtcy5zaG9wX2xvb3BfY29udGFpbmVyICkuaHRtbCggJG5vdEZvdW5kQ29udGFpbmVyLmh0bWwoKSApO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0d2NhcGZBZnRlclVwZGF0ZSgpO1xuXG5cdFx0XHRcdFx0Ly8gdG9kb1xuXHRcdFx0XHRcdC8vIHJlaW5pdGlhbGl6ZSBvcmRlcmluZ1xuXHRcdFx0XHRcdC8vIHdjYXBmSW5pdE9yZGVyKCk7XG5cblx0XHRcdFx0XHQvLyB0b2RvXG5cdFx0XHRcdFx0Ly8gcmVpbml0aWFsaXplIGRyb3Bkb3duIGZpbHRlclxuXHRcdFx0XHRcdC8vIHdjYXBmRHJvcERvd25GaWx0ZXIoKTtcblxuXHRcdFx0XHRcdC8vIHJ1biBzY3JpcHRzIGFmdGVyIHNob3AgbG9vcCB1bmRhdGVkXG5cdFx0XHRcdFx0aWYgKCB0eXBlb2Ygd2NhcGZfcGFyYW1zLmN1c3RvbV9zY3JpcHRzICE9PSAndW5kZWZpbmVkJyAmJiB3Y2FwZl9wYXJhbXMuY3VzdG9tX3NjcmlwdHMubGVuZ3RoID4gMCApIHtcblx0XHRcdFx0XHRcdGV2YWwoIHdjYXBmX3BhcmFtcy5jdXN0b21fc2NyaXB0cyApO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0KTtcblx0XHR9XG5cblx0XHQvLyBVUkwgUGFyc2VyXG5cdFx0ZnVuY3Rpb24gd2NhcGZHZXRVcmxWYXJzKCB1cmwgKSB7XG5cdFx0XHRsZXQgdmFycyA9IHt9LCBoYXNoO1xuXG5cdFx0XHRpZiAoIHR5cGVvZiB1cmwgPT09ICd1bmRlZmluZWQnICkge1xuXHRcdFx0XHR1cmwgPSB3aW5kb3cubG9jYXRpb24uaHJlZjtcblx0XHRcdH1cblxuXHRcdFx0dXJsID0gdXJsLnJlcGxhY2VBbGwoICclMkMnLCAnLCcgKTtcblxuXHRcdFx0Y29uc3QgaGFzaGVzICA9IHVybC5zbGljZSggdXJsLmluZGV4T2YoICc/JyApICsgMSApLnNwbGl0KCAnJicgKTtcblx0XHRcdGNvbnN0IGhMZW5ndGggPSBoYXNoZXMubGVuZ3RoO1xuXG5cdFx0XHRmb3IgKCBsZXQgaSA9IDA7IGkgPCBoTGVuZ3RoOyBpKysgKSB7XG5cdFx0XHRcdGhhc2ggPSBoYXNoZXNbIGkgXS5zcGxpdCggJz0nICk7XG5cblx0XHRcdFx0dmFyc1sgaGFzaFsgMCBdIF0gPSBoYXNoWyAxIF07XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiB2YXJzO1xuXHRcdH1cblxuXHRcdC8vIGV2ZXJ5dGltZSB3ZSBhcHBseSB0aGUgZmlsdGVyIHdlIHNldCB0aGUgY3VycmVudCBwYWdlIHRvIDFcblx0XHRmdW5jdGlvbiB3Y2FwZkZpeFBhZ2luYXRpb24oKSB7XG5cdFx0XHRsZXQgdXJsICAgICAgICAgICAgICAgID0gd2luZG93LmxvY2F0aW9uLmhyZWY7XG5cdFx0XHRjb25zdCBwYXJhbXMgICAgICAgICAgID0gd2NhcGZHZXRVcmxWYXJzKCB1cmwgKTtcblx0XHRcdGNvbnN0IGN1cnJlbnRQYWdlSW5VcmwgPSBwYXJzZUludCggdXJsLnJlcGxhY2UoIC8uK1xcL3BhZ2VcXC8oXFxkKykrLywgJyQxJyApICk7XG5cblx0XHRcdGlmICggY3VycmVudFBhZ2VJblVybCApIHtcblx0XHRcdFx0aWYgKCBjdXJyZW50UGFnZUluVXJsID4gMSApIHtcblx0XHRcdFx0XHR1cmwgPSB1cmwucmVwbGFjZSggL3BhZ2VcXC8oXFxkKykvLCAncGFnZS8xJyApO1xuXHRcdFx0XHR9XG5cdFx0XHR9IGVsc2UgaWYgKCB0eXBlb2YgcGFyYW1zWyAncGFnZWQnIF0gIT09ICd1bmRlZmluZWQnICkge1xuXHRcdFx0XHRjb25zdCBjdXJyZW50UGFnZUluUGFyYW1zID0gcGFyc2VJbnQoIHBhcmFtc1sgJ3BhZ2VkJyBdICk7XG5cblx0XHRcdFx0aWYgKCBjdXJyZW50UGFnZUluUGFyYW1zID4gMSApIHtcblx0XHRcdFx0XHR1cmwgPSB1cmwucmVwbGFjZSggJ3BhZ2VkPScgKyBjdXJyZW50UGFnZUluUGFyYW1zLCAncGFnZWQ9MScgKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gdXJsO1xuXHRcdH1cblxuXHRcdC8vIHVwZGF0ZSBxdWVyeSBzdHJpbmcgZm9yIGNhdGVnb3JpZXMsIG1ldGEgZXRjLi5cblx0XHRmdW5jdGlvbiB3Y2FwZlVwZGF0ZVF1ZXJ5U3RyaW5nUGFyYW1ldGVyKCBrZXksIHZhbHVlLCBwdXNoSGlzdG9yeSwgdXJsICkge1xuXHRcdFx0aWYgKCB0eXBlb2YgcHVzaEhpc3RvcnkgPT09ICd1bmRlZmluZWQnICkge1xuXHRcdFx0XHRwdXNoSGlzdG9yeSA9IHRydWU7XG5cdFx0XHR9XG5cblx0XHRcdGlmICggdHlwZW9mIHVybCA9PT0gJ3VuZGVmaW5lZCcgKSB7XG5cdFx0XHRcdHVybCA9IHdjYXBmRml4UGFnaW5hdGlvbigpO1xuXHRcdFx0fVxuXG5cdFx0XHRjb25zdCByZSAgICAgICAgPSBuZXcgUmVnRXhwKCAnKFs/Jl0pJyArIGtleSArICc9Lio/KCZ8JCknLCAnaScgKTtcblx0XHRcdGNvbnN0IHNlcGFyYXRvciA9IHVybC5pbmRleE9mKCAnPycgKSAhPT0gLTEgPyAnJicgOiAnPyc7XG5cdFx0XHRsZXQgdXJsV2l0aFF1ZXJ5O1xuXG5cdFx0XHRpZiAoIHVybC5tYXRjaCggcmUgKSApIHtcblx0XHRcdFx0dXJsV2l0aFF1ZXJ5ID0gdXJsLnJlcGxhY2UoIHJlLCAnJDEnICsga2V5ICsgJz0nICsgdmFsdWUgKyAnJDInICk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHR1cmxXaXRoUXVlcnkgPSB1cmwgKyBzZXBhcmF0b3IgKyBrZXkgKyAnPScgKyB2YWx1ZTtcblx0XHRcdH1cblxuXHRcdFx0aWYgKCBwdXNoSGlzdG9yeSA9PT0gdHJ1ZSApIHtcblx0XHRcdFx0cmV0dXJuIGhpc3RvcnkucHVzaFN0YXRlKCB7fSwgJycsIHVybFdpdGhRdWVyeSApO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0cmV0dXJuIHVybFdpdGhRdWVyeTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHQvLyByZW1vdmUgcGFyYW1ldGVyIGZyb20gdXJsXG5cdFx0ZnVuY3Rpb24gd2NhcGZSZW1vdmVRdWVyeVN0cmluZ1BhcmFtZXRlciggZmlsdGVyS2V5LCB1cmwgKSB7XG5cdFx0XHRpZiAoIHR5cGVvZiB1cmwgPT09ICd1bmRlZmluZWQnICkge1xuXHRcdFx0XHR1cmwgPSB3Y2FwZkZpeFBhZ2luYXRpb24oKTtcblx0XHRcdH1cblxuXHRcdFx0Y29uc3Qgb2xkUGFyYW1zICAgICAgICAgPSB3Y2FwZkdldFVybFZhcnMoIHVybCApO1xuXHRcdFx0Y29uc3Qgb2xkUGFyYW1zTGVuZ3RoICAgPSBPYmplY3Qua2V5cyggb2xkUGFyYW1zICkubGVuZ3RoO1xuXHRcdFx0Y29uc3Qgc3RhcnRQb3NpdGlvbiAgICAgPSB1cmwuaW5kZXhPZiggJz8nICk7XG5cdFx0XHRjb25zdCBmaWx0ZXJLZXlQb3NpdGlvbiA9IHVybC5pbmRleE9mKCBmaWx0ZXJLZXkgKTtcblx0XHRcdGxldCBjbGVhblVybCwgY2xlYW5RdWVyeTtcblxuXHRcdFx0aWYgKCBvbGRQYXJhbXNMZW5ndGggPiAxICkge1xuXHRcdFx0XHRpZiAoICggZmlsdGVyS2V5UG9zaXRpb24gLSBzdGFydFBvc2l0aW9uICkgPiAxICkge1xuXHRcdFx0XHRcdGNsZWFuVXJsID0gdXJsLnJlcGxhY2UoICcmJyArIGZpbHRlcktleSArICc9JyArIG9sZFBhcmFtc1sgZmlsdGVyS2V5IF0sICcnICk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0Y2xlYW5VcmwgPSB1cmwucmVwbGFjZSggZmlsdGVyS2V5ICsgJz0nICsgb2xkUGFyYW1zWyBmaWx0ZXJLZXkgXSArICcmJywgJycgKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGNvbnN0IG5ld1BhcmFtcyA9IGNsZWFuVXJsLnNwbGl0KCAnPycgKTtcblx0XHRcdFx0Y2xlYW5RdWVyeSAgICAgID0gJz8nICsgbmV3UGFyYW1zWyAxIF07XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRjbGVhblF1ZXJ5ID0gdXJsLnJlcGxhY2UoICc/JyArIGZpbHRlcktleSArICc9JyArIG9sZFBhcmFtc1sgZmlsdGVyS2V5IF0sICcnICk7XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiBjbGVhblF1ZXJ5O1xuXHRcdH1cblxuXHRcdC8vIHRha2UgdGhlIGtleSBhbmQgdmFsdWUgYW5kIG1ha2UgcXVlcnlcblx0XHRmdW5jdGlvbiB3Y2FwZk1ha2VQYXJhbWV0ZXJzKCBmaWx0ZXJLZXksIGZpbHRlclZhbHVlLCBmb3JjZVJlcmVuZGVyID0gZmFsc2UsIHVybCApIHtcblx0XHRcdGNvbnN0IHZhbHVlU2VwYXJhdG9yID0gJywnO1xuXG5cdFx0XHRsZXQgcGFyYW1zLCBuZXh0VmFsdWVzLCBlbXB0eVZhbHVlID0gZmFsc2U7XG5cblx0XHRcdGlmICggdHlwZW9mIHVybCAhPT0gJ3VuZGVmaW5lZCcgKSB7XG5cdFx0XHRcdHBhcmFtcyA9IHdjYXBmR2V0VXJsVmFycyggdXJsICk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRwYXJhbXMgPSB3Y2FwZkdldFVybFZhcnMoKTtcblx0XHRcdH1cblxuXHRcdFx0aWYgKCB0eXBlb2YgcGFyYW1zWyBmaWx0ZXJLZXkgXSAhPSAndW5kZWZpbmVkJyApIHtcblx0XHRcdFx0Y29uc3QgcHJldlZhbHVlcyAgICAgID0gcGFyYW1zWyBmaWx0ZXJLZXkgXTtcblx0XHRcdFx0Y29uc3QgcHJldlZhbHVlc0FycmF5ID0gcHJldlZhbHVlcy5zcGxpdCggdmFsdWVTZXBhcmF0b3IgKTtcblxuXHRcdFx0XHRpZiAoIHByZXZWYWx1ZXMubGVuZ3RoID4gMCApIHtcblx0XHRcdFx0XHRjb25zdCBmb3VuZCA9ICQuaW5BcnJheSggZmlsdGVyVmFsdWUsIHByZXZWYWx1ZXNBcnJheSApO1xuXG5cdFx0XHRcdFx0aWYgKCBmb3VuZCA+PSAwICkge1xuXHRcdFx0XHRcdFx0Ly8gRWxlbWVudCB3YXMgZm91bmQsIHJlbW92ZSBpdC5cblx0XHRcdFx0XHRcdHByZXZWYWx1ZXNBcnJheS5zcGxpY2UoIGZvdW5kLCAxICk7XG5cblx0XHRcdFx0XHRcdGlmICggcHJldlZhbHVlc0FycmF5Lmxlbmd0aCA9PT0gMCApIHtcblx0XHRcdFx0XHRcdFx0ZW1wdHlWYWx1ZSA9IHRydWU7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdC8vIEVsZW1lbnQgd2FzIG5vdCBmb3VuZCwgYWRkIGl0LlxuXHRcdFx0XHRcdFx0cHJldlZhbHVlc0FycmF5LnB1c2goIGZpbHRlclZhbHVlICk7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0aWYgKCBwcmV2VmFsdWVzQXJyYXkubGVuZ3RoID4gMSApIHtcblx0XHRcdFx0XHRcdG5leHRWYWx1ZXMgPSBwcmV2VmFsdWVzQXJyYXkuam9pbiggdmFsdWVTZXBhcmF0b3IgKTtcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0bmV4dFZhbHVlcyA9IHByZXZWYWx1ZXNBcnJheTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0bmV4dFZhbHVlcyA9IGZpbHRlclZhbHVlO1xuXHRcdFx0XHR9XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRuZXh0VmFsdWVzID0gZmlsdGVyVmFsdWU7XG5cdFx0XHR9XG5cblx0XHRcdC8vIHVwZGF0ZSB1cmwgYW5kIHF1ZXJ5IHN0cmluZ1xuXHRcdFx0aWYgKCAhIGVtcHR5VmFsdWUgKSB7XG5cdFx0XHRcdHdjYXBmVXBkYXRlUXVlcnlTdHJpbmdQYXJhbWV0ZXIoIGZpbHRlcktleSwgbmV4dFZhbHVlcyApO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0Y29uc3QgcXVlcnkgPSB3Y2FwZlJlbW92ZVF1ZXJ5U3RyaW5nUGFyYW1ldGVyKCBmaWx0ZXJLZXkgKTtcblx0XHRcdFx0aGlzdG9yeS5wdXNoU3RhdGUoIHt9LCAnJywgcXVlcnkgKTtcblx0XHRcdH1cblxuXHRcdFx0Ly8gZmlsdGVyIHByb2R1Y3RzXG5cdFx0XHR3Y2FwZkZpbHRlclByb2R1Y3RzKCBmb3JjZVJlcmVuZGVyICk7XG5cdFx0fVxuXG5cdFx0ZnVuY3Rpb24gd2NhcGZTaW5nbGVGaWx0ZXIoIGZpbHRlcktleSwgZmlsdGVyVmFsdWUgKSB7XG5cdFx0XHRjb25zdCBwYXJhbXMgPSB3Y2FwZkdldFVybFZhcnMoKTtcblx0XHRcdGxldCBxdWVyeTtcblxuXHRcdFx0aWYgKCB0eXBlb2YgcGFyYW1zWyBmaWx0ZXJLZXkgXSAhPT0gJ3VuZGVmaW5lZCcgJiYgcGFyYW1zWyBmaWx0ZXJLZXkgXSA9PT0gZmlsdGVyVmFsdWUgKSB7XG5cdFx0XHRcdHF1ZXJ5ID0gd2NhcGZSZW1vdmVRdWVyeVN0cmluZ1BhcmFtZXRlciggZmlsdGVyS2V5ICk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRxdWVyeSA9IHdjYXBmVXBkYXRlUXVlcnlTdHJpbmdQYXJhbWV0ZXIoIGZpbHRlcktleSwgZmlsdGVyVmFsdWUsIGZhbHNlICk7XG5cdFx0XHR9XG5cblx0XHRcdC8vIHVwZGF0ZSB1cmxcblx0XHRcdGhpc3RvcnkucHVzaFN0YXRlKCB7fSwgJycsIHF1ZXJ5ICk7XG5cblx0XHRcdC8vIGZpbHRlciBwcm9kdWN0c1xuXHRcdFx0d2NhcGZGaWx0ZXJQcm9kdWN0cygpO1xuXHRcdH1cblxuXHRcdC8vIFRoZSBtYWluIGZ1bmN0aW9uIHRvIGhhbmRsZSB0aGUgZmlsdGVyIHJlcXVlc3Rcblx0XHRmdW5jdGlvbiBoYW5kbGVGaWx0ZXJSZXF1ZXN0KCAkaXRlbSwgZmlsdGVyVmFsdWUgKSB7XG5cdFx0XHRjb25zdCAkZmllbGQgICAgICAgICA9ICRpdGVtLmNsb3Nlc3QoICcud2NhcGYtc2luZ2xlLWZpbHRlcicgKTtcblx0XHRcdGNvbnN0IGZpZWxkSUQgICAgICAgID0gJGZpZWxkLmF0dHIoICdkYXRhLWlkJyApO1xuXHRcdFx0Y29uc3QgZmllbGREYXRhICAgICAgPSBmaWVsZHNbIGZpZWxkSUQgXTtcblx0XHRcdGNvbnN0IGZpbHRlcktleSAgICAgID0gZmllbGREYXRhLmZpbHRlcktleTtcblx0XHRcdGNvbnN0IG11bHRpcGxlRmlsdGVyID0gZmllbGREYXRhLm11bHRpcGxlRmlsdGVyO1xuXG5cdFx0XHRpZiAoICEgZmlsdGVyS2V5ICkge1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdGlmICggISBmaWx0ZXJWYWx1ZS5sZW5ndGggKSB7XG5cdFx0XHRcdGNvbnN0IHF1ZXJ5ID0gd2NhcGZSZW1vdmVRdWVyeVN0cmluZ1BhcmFtZXRlciggZmlsdGVyS2V5ICk7XG5cdFx0XHRcdGhpc3RvcnkucHVzaFN0YXRlKCB7fSwgJycsIHF1ZXJ5ICk7XG5cblx0XHRcdFx0Ly8gZmlsdGVyIHByb2R1Y3RzXG5cdFx0XHRcdHdjYXBmRmlsdGVyUHJvZHVjdHMoKTtcblxuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdGlmICggbXVsdGlwbGVGaWx0ZXIgKSB7XG5cdFx0XHRcdHdjYXBmTWFrZVBhcmFtZXRlcnMoIGZpbHRlcktleSwgZmlsdGVyVmFsdWUgKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHdjYXBmU2luZ2xlRmlsdGVyKCBmaWx0ZXJLZXksIGZpbHRlclZhbHVlICk7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0Ly8gaGFuZGxlIHRoZSBmaWx0ZXIgcmVxdWVzdCBmb3IgbGlzdCBmaWVsZHNcblx0XHQkd2NhcGZOYXZGaWx0ZXJzLm9uKFxuXHRcdFx0J2NoYW5nZScsXG5cdFx0XHQnLndjYXBmLWxheWVyZWQtbmF2IFt0eXBlPVwiY2hlY2tib3hcIl0sIC53Y2FwZi1sYXllcmVkLW5hdiBbdHlwZT1cInJhZGlvXCJdJyxcblx0XHRcdGZ1bmN0aW9uKCBldmVudCApIHtcblx0XHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcblxuXHRcdFx0XHRjb25zdCAkaXRlbSAgICAgICA9ICQoIHRoaXMgKTtcblx0XHRcdFx0Y29uc3QgZmlsdGVyVmFsdWUgPSAkaXRlbS52YWwoKTtcblxuXHRcdFx0XHRoYW5kbGVGaWx0ZXJSZXF1ZXN0KCAkaXRlbSwgZmlsdGVyVmFsdWUgKTtcblx0XHRcdH1cblx0XHQpO1xuXG5cdFx0Ly8gVE9ETzogVXNlIGEgY29tYmluYXRpb24gb2YgbGFiZWwsIGNoZWNrYm94IGFuZCByYWRpb1xuXHRcdC8vIGhhbmRsZSB0aGUgZmlsdGVyIHJlcXVlc3QgZm9yIGxhYmVsZWQgaXRlbVxuXHRcdCR3Y2FwZk5hdkZpbHRlcnMub24oXG5cdFx0XHQnY2xpY2snLFxuXHRcdFx0Jy53Y2FwZi1sYWJlbGVkLW5hdiAuaXRlbScsXG5cdFx0XHRmdW5jdGlvbiggZXZlbnQgKSB7XG5cdFx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cblx0XHRcdFx0Y29uc3QgJGl0ZW0gICAgICAgPSAkKCB0aGlzICk7XG5cdFx0XHRcdGNvbnN0IGZpbHRlclZhbHVlID0gJGl0ZW0uYXR0ciggJ2RhdGEtdmFsdWUnICk7XG5cblx0XHRcdFx0aGFuZGxlRmlsdGVyUmVxdWVzdCggJGl0ZW0sIGZpbHRlclZhbHVlICk7XG5cdFx0XHR9XG5cdFx0KTtcblxuXHRcdC8vIGhhbmRsZSB0aGUgZmlsdGVyIHJlcXVlc3QgZm9yIGRpc3BsYXkgdHlwZSBzZWxlY3QgZmllbGRzXG5cdFx0JHdjYXBmTmF2RmlsdGVycy5vbihcblx0XHRcdCdjaGFuZ2UnLFxuXHRcdFx0J3NlbGVjdCcsXG5cdFx0XHRmdW5jdGlvbiggZXZlbnQgKSB7XG5cdFx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cblx0XHRcdFx0Y29uc3QgJGl0ZW0gICAgICAgPSAkKCB0aGlzICk7XG5cdFx0XHRcdGNvbnN0IGZpbHRlclZhbHVlID0gJGl0ZW0udmFsKCk7XG5cblx0XHRcdFx0Y29uc3QgJGZpZWxkICAgID0gJGl0ZW0uY2xvc2VzdCggJy53Y2FwZi1zaW5nbGUtZmlsdGVyJyApO1xuXHRcdFx0XHRjb25zdCBmaWVsZElEICAgPSAkZmllbGQuYXR0ciggJ2RhdGEtaWQnICk7XG5cdFx0XHRcdGNvbnN0IGZpZWxkRGF0YSA9IGZpZWxkc1sgZmllbGRJRCBdO1xuXHRcdFx0XHRjb25zdCBmaWx0ZXJLZXkgPSBmaWVsZERhdGEuZmlsdGVyS2V5O1xuXG5cdFx0XHRcdGlmICggISBmaWx0ZXJWYWx1ZS5sZW5ndGggKSB7XG5cdFx0XHRcdFx0Y29uc3QgcXVlcnkgPSB3Y2FwZlJlbW92ZVF1ZXJ5U3RyaW5nUGFyYW1ldGVyKCBmaWx0ZXJLZXkgKTtcblx0XHRcdFx0XHRoaXN0b3J5LnB1c2hTdGF0ZSgge30sICcnLCBxdWVyeSApO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdGNvbnN0IGZpbHRlclZhbFN0cmluZyA9IGZpbHRlclZhbHVlLnRvU3RyaW5nKCk7XG5cdFx0XHRcdFx0d2NhcGZVcGRhdGVRdWVyeVN0cmluZ1BhcmFtZXRlciggZmlsdGVyS2V5LCBmaWx0ZXJWYWxTdHJpbmcgKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdC8vIGZpbHRlciBwcm9kdWN0c1xuXHRcdFx0XHR3Y2FwZkZpbHRlclByb2R1Y3RzKCk7XG5cdFx0XHR9XG5cdFx0KTtcblxuXHRcdC8vIGhhbmRsZSB0aGUgZmlsdGVyIHJlcXVlc3QgZm9yIHJhbmdlIG51bWJlclxuXHRcdCR3Y2FwZk51bWJlclJhbmdlRmlsdGVycy5vbihcblx0XHRcdCdpbnB1dCcsXG5cdFx0XHQnLndjYXBmLXJhbmdlLW51bWJlciAubWluLXZhbHVlLCAud2NhcGYtcmFuZ2UtbnVtYmVyIC5tYXgtdmFsdWUnLFxuXHRcdFx0ZnVuY3Rpb24oIGV2ZW50ICkge1xuXHRcdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXG5cdFx0XHRcdGNvbnN0ICRpdGVtID0gJCggdGhpcyApO1xuXG5cdFx0XHRcdC8vIENsZWFyIGFueSBwcmV2aW91c2x5IHNldCB0aW1lciBiZWZvcmUgc2V0dGluZyBhIGZyZXNoIG9uZVxuXHRcdFx0XHRjbGVhclRpbWVvdXQoICRpdGVtLmRhdGEoICd0aW1lcicgKSApO1xuXG5cdFx0XHRcdCRpdGVtLmRhdGEoICd0aW1lcicsIHNldFRpbWVvdXQoIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdCRpdGVtLnJlbW92ZURhdGEoICd0aW1lcicgKTtcblxuXHRcdFx0XHRcdGNvbnN0ICRyYW5nZU51bWJlciAgPSAkaXRlbS5jbG9zZXN0KCAnLndjYXBmLXJhbmdlLW51bWJlcicgKTtcblx0XHRcdFx0XHRjb25zdCBmaWx0ZXJLZXkgICAgID0gJHJhbmdlTnVtYmVyLmF0dHIoICdkYXRhLWZpbHRlci1rZXknICk7XG5cdFx0XHRcdFx0Y29uc3QgcmFuZ2VNaW5WYWx1ZSA9ICRyYW5nZU51bWJlci5hdHRyKCAnZGF0YS1yYW5nZS1taW4tdmFsdWUnICk7XG5cdFx0XHRcdFx0Y29uc3QgcmFuZ2VNYXhWYWx1ZSA9ICRyYW5nZU51bWJlci5hdHRyKCAnZGF0YS1yYW5nZS1tYXgtdmFsdWUnICk7XG5cdFx0XHRcdFx0bGV0IG1pblZhbHVlICAgICAgICA9ICRyYW5nZU51bWJlci5maW5kKCAnLm1pbi12YWx1ZScgKS52YWwoKTtcblx0XHRcdFx0XHRsZXQgbWF4VmFsdWUgICAgICAgID0gJHJhbmdlTnVtYmVyLmZpbmQoICcubWF4LXZhbHVlJyApLnZhbCgpO1xuXG5cdFx0XHRcdFx0Ly8gRm9yY2UgdGhlIG1pblZhbHVlIG5vdCB0byBiZSBlbXB0eS5cblx0XHRcdFx0XHRpZiAoICEgbWluVmFsdWUubGVuZ3RoICkge1xuXHRcdFx0XHRcdFx0bWluVmFsdWUgPSByYW5nZU1pblZhbHVlO1xuXG5cdFx0XHRcdFx0XHQkcmFuZ2VOdW1iZXIuZmluZCggJy5taW4tdmFsdWUnICkudmFsKCBtaW5WYWx1ZSApO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdC8vIEZvcmNlIHRoZSBtYXhWYWx1ZSBub3QgdG8gYmUgZW1wdHkuXG5cdFx0XHRcdFx0aWYgKCAhIG1heFZhbHVlLmxlbmd0aCApIHtcblx0XHRcdFx0XHRcdG1heFZhbHVlID0gcmFuZ2VNYXhWYWx1ZTtcblxuXHRcdFx0XHRcdFx0JHJhbmdlTnVtYmVyLmZpbmQoICcubWF4LXZhbHVlJyApLnZhbCggbWF4VmFsdWUgKTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHQvLyBGb3JjZSB0aGUgbWluVmFsdWUgbm90IHRvIGdvIGJlbG93IHRoZSByYW5nZU1pblZhbHVlLlxuXHRcdFx0XHRcdGlmICggcGFyc2VGbG9hdCggbWluVmFsdWUgKSA8IHBhcnNlRmxvYXQoIHJhbmdlTWluVmFsdWUgKSApIHtcblx0XHRcdFx0XHRcdG1pblZhbHVlID0gcmFuZ2VNaW5WYWx1ZTtcblxuXHRcdFx0XHRcdFx0JHJhbmdlTnVtYmVyLmZpbmQoICcubWluLXZhbHVlJyApLnZhbCggbWluVmFsdWUgKTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHQvLyBGb3JjZSB0aGUgbWluVmFsdWUgbm90IHRvIGdvIHVwIHRoZSByYW5nZU1heFZhbHVlLlxuXHRcdFx0XHRcdGlmICggcGFyc2VGbG9hdCggbWluVmFsdWUgKSA+IHBhcnNlRmxvYXQoIHJhbmdlTWF4VmFsdWUgKSApIHtcblx0XHRcdFx0XHRcdG1pblZhbHVlID0gcmFuZ2VNYXhWYWx1ZTtcblxuXHRcdFx0XHRcdFx0JHJhbmdlTnVtYmVyLmZpbmQoICcubWluLXZhbHVlJyApLnZhbCggbWluVmFsdWUgKTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHQvLyBGb3JjZSB0aGUgbWF4VmFsdWUgbm90IHRvIGdvIHVwIHRoZSByYW5nZU1heFZhbHVlLlxuXHRcdFx0XHRcdGlmICggcGFyc2VGbG9hdCggbWF4VmFsdWUgKSA+IHBhcnNlRmxvYXQoIHJhbmdlTWF4VmFsdWUgKSApIHtcblx0XHRcdFx0XHRcdG1heFZhbHVlID0gcmFuZ2VNYXhWYWx1ZTtcblxuXHRcdFx0XHRcdFx0JHJhbmdlTnVtYmVyLmZpbmQoICcubWF4LXZhbHVlJyApLnZhbCggbWF4VmFsdWUgKTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHQvLyBGb3JjZSB0aGUgbWF4VmFsdWUgbm90IHRvIGdvIGJlbG93IHRoZSBtaW5WYWx1ZS5cblx0XHRcdFx0XHRpZiAoIHBhcnNlRmxvYXQoIG1pblZhbHVlICkgPiBwYXJzZUZsb2F0KCBtYXhWYWx1ZSApICkge1xuXHRcdFx0XHRcdFx0bWF4VmFsdWUgPSBtaW5WYWx1ZTtcblxuXHRcdFx0XHRcdFx0JHJhbmdlTnVtYmVyLmZpbmQoICcubWF4LXZhbHVlJyApLnZhbCggbWF4VmFsdWUgKTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRpZiAoIG1pblZhbHVlID09PSByYW5nZU1pblZhbHVlICYmIG1heFZhbHVlID09PSByYW5nZU1heFZhbHVlICkge1xuXHRcdFx0XHRcdFx0Y29uc3QgcXVlcnkgPSB3Y2FwZlJlbW92ZVF1ZXJ5U3RyaW5nUGFyYW1ldGVyKCBmaWx0ZXJLZXkgKTtcblx0XHRcdFx0XHRcdGhpc3RvcnkucHVzaFN0YXRlKCB7fSwgJycsIHF1ZXJ5ICk7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdGNvbnN0IGZpbHRlclZhbFN0cmluZyA9IG1pblZhbHVlICsgcmFuZ2VWYWx1ZXNTZXBhcmF0b3IgKyBtYXhWYWx1ZTtcblx0XHRcdFx0XHRcdHdjYXBmVXBkYXRlUXVlcnlTdHJpbmdQYXJhbWV0ZXIoIGZpbHRlcktleSwgZmlsdGVyVmFsU3RyaW5nICk7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0Ly8gZmlsdGVyIHByb2R1Y3RzXG5cdFx0XHRcdFx0d2NhcGZGaWx0ZXJQcm9kdWN0cygpO1xuXHRcdFx0XHR9LCBkZWxheSApICk7XG5cdFx0XHR9XG5cdFx0KTtcblxuXHRcdC8vIGhhbmRsZSByZW1vdmluZyB0aGUgYWN0aXZlIGZpbHRlcnNcblx0XHQkd2NhcGZOYXZGaWx0ZXJzLm9uKFxuXHRcdFx0J2NsaWNrJyxcblx0XHRcdCcud2NhcGYtYWN0aXZlLWZpbHRlcnMgLml0ZW0nLFxuXHRcdFx0ZnVuY3Rpb24oIGV2ZW50ICkge1xuXHRcdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXG5cdFx0XHRcdGNvbnN0ICRpdGVtICAgICAgID0gJCggdGhpcyApO1xuXHRcdFx0XHRjb25zdCBmaWx0ZXJLZXkgICA9ICRpdGVtLmF0dHIoICdkYXRhLWZpbHRlci1rZXknICk7XG5cdFx0XHRcdGNvbnN0IGZpbHRlclZhbHVlID0gJGl0ZW0uYXR0ciggJ2RhdGEtdmFsdWUnICk7XG5cblx0XHRcdFx0d2NhcGZNYWtlUGFyYW1ldGVycyggZmlsdGVyS2V5LCBmaWx0ZXJWYWx1ZSwgdHJ1ZSApO1xuXHRcdFx0fVxuXHRcdCk7XG5cblx0XHRmdW5jdGlvbiByZXNldEZpbHRlcnMoICRidXR0b24gKSB7XG5cdFx0XHRjb25zdCBfZmlsdGVyS2V5cyA9ICRidXR0b24uYXR0ciggJ2RhdGEta2V5cycgKTtcblxuXHRcdFx0aWYgKCAhIF9maWx0ZXJLZXlzICkge1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdGNvbnN0IGZpbHRlcktleXMgPSBfZmlsdGVyS2V5cy5zcGxpdCggJywnICk7XG5cblx0XHRcdGxldCBxdWVyeSA9ICcnO1xuXG5cdFx0XHQkLmVhY2goIGZpbHRlcktleXMsIGZ1bmN0aW9uKCBpLCBmaWx0ZXJLZXkgKSB7XG5cdFx0XHRcdGlmICggcXVlcnkgKSB7XG5cdFx0XHRcdFx0cXVlcnkgPSB3Y2FwZlJlbW92ZVF1ZXJ5U3RyaW5nUGFyYW1ldGVyKCBmaWx0ZXJLZXksIHF1ZXJ5ICk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0cXVlcnkgPSB3Y2FwZlJlbW92ZVF1ZXJ5U3RyaW5nUGFyYW1ldGVyKCBmaWx0ZXJLZXkgKTtcblx0XHRcdFx0fVxuXHRcdFx0fSApO1xuXG5cdFx0XHQvLyBFbXB0eSBxdWVyeSBjYXVzZXMgaXNzdWUoZG9lc24ndCByZW1vdmUgdGhlIGZpbHRlciBrZXlzIGZyb20gdGhlIHVybCksXG5cdFx0XHQvLyB0aGlzIGlzIHdoeSB3ZSBhcmUgc2V0dGluZyB0aGUgcGFnZSB1cmwgYXMgcXVlcnkuXG5cdFx0XHRpZiAoICEgcXVlcnkgKSB7XG5cdFx0XHRcdGNvbnN0IHByZXZVcmwgPSB3aW5kb3cubG9jYXRpb24uaHJlZjtcblx0XHRcdFx0Y29uc3QgbmV3VXJsICA9IHByZXZVcmwuc3BsaXQoICc/JyApO1xuXG5cdFx0XHRcdHF1ZXJ5ID0gbmV3VXJsWyAwIF07XG5cdFx0XHR9XG5cblx0XHRcdGhpc3RvcnkucHVzaFN0YXRlKCB7fSwgJycsIHF1ZXJ5ICk7XG5cblx0XHRcdC8vIGZpbHRlciBwcm9kdWN0c1xuXHRcdFx0d2NhcGZGaWx0ZXJQcm9kdWN0cyggdHJ1ZSApO1xuXHRcdH1cblxuXHRcdC8vIGNsZWFyIGFsbCBmaWx0ZXJzXG5cdFx0JHdjYXBmTmF2RmlsdGVycy5vbihcblx0XHRcdCdjbGljaycsXG5cdFx0XHQnLndjYXBmLWFjdGl2ZS1maWx0ZXJzIC53Y2FwZi1yZXNldC1maWx0ZXJzLWJ0bicsXG5cdFx0XHRmdW5jdGlvbiggZXZlbnQgKSB7XG5cdFx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cblx0XHRcdFx0Y29uc3QgJGJ1dHRvbiA9ICQoIHRoaXMgKTtcblxuXHRcdFx0XHRyZXNldEZpbHRlcnMoICRidXR0b24gKTtcblx0XHRcdH1cblx0XHQpO1xuXG5cdFx0Ly8gcmVzZXQgZmlsdGVyc1xuXHRcdCR3Y2FwZk5hdkZpbHRlcnMub24oXG5cdFx0XHQnY2xpY2snLFxuXHRcdFx0Jy53Y2FwZi1yZXNldC1maWx0ZXJzLWJ0bicsXG5cdFx0XHRmdW5jdGlvbiggZXZlbnQgKSB7XG5cdFx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cblx0XHRcdFx0Y29uc3QgJGJ1dHRvbiA9ICQoIHRoaXMgKTtcblxuXHRcdFx0XHRyZXNldEZpbHRlcnMoICRidXR0b24gKTtcblx0XHRcdH1cblx0XHQpO1xuXG5cdFx0ZnVuY3Rpb24gZmlsdGVyQnlEYXRlKCAkaW5wdXQgKSB7XG5cdFx0XHRjb25zdCAkd2NhcGZEYXRlRmlsdGVyID0gJGlucHV0LmNsb3Nlc3QoICcud2NhcGYtZGF0ZS1pbnB1dCcgKTtcblx0XHRcdGNvbnN0IGZpbHRlcktleSAgICAgICAgPSAkd2NhcGZEYXRlRmlsdGVyLmF0dHIoICdkYXRhLWZpbHRlci1rZXknICk7XG5cdFx0XHRjb25zdCBpc1JhbmdlICAgICAgICAgID0gJHdjYXBmRGF0ZUZpbHRlci5hdHRyKCAnZGF0YS1pcy1yYW5nZScgKTtcblxuXHRcdFx0bGV0IGZpbHRlclZhbHVlID0gJyc7XG5cdFx0XHRsZXQgcnVuRmlsdGVyICAgPSBmYWxzZTtcblxuXHRcdFx0Ly8gQ2xlYXIgYW55IHByZXZpb3VzbHkgc2V0IHRpbWVyIGJlZm9yZSBzZXR0aW5nIGEgZnJlc2ggb25lXG5cdFx0XHRjbGVhclRpbWVvdXQoICR3Y2FwZkRhdGVGaWx0ZXIuZGF0YSggJ3RpbWVyJyApICk7XG5cblx0XHRcdGlmICggaXNSYW5nZSApIHtcblx0XHRcdFx0Y29uc3QgZnJvbSA9ICR3Y2FwZkRhdGVGaWx0ZXIuZmluZCggJy5kYXRlLWZyb20taW5wdXQnICkudmFsKCk7XG5cdFx0XHRcdGNvbnN0IHRvICAgPSAkd2NhcGZEYXRlRmlsdGVyLmZpbmQoICcuZGF0ZS10by1pbnB1dCcgKS52YWwoKTtcblxuXHRcdFx0XHRpZiAoIGZyb20gJiYgdG8gKSB7XG5cdFx0XHRcdFx0ZmlsdGVyVmFsdWUgPSBmcm9tICsgcmFuZ2VWYWx1ZXNTZXBhcmF0b3IgKyB0bztcblx0XHRcdFx0XHRydW5GaWx0ZXIgICA9IHRydWU7XG5cdFx0XHRcdH0gZWxzZSBpZiAoICEgZnJvbSAmJiAhIHRvICkge1xuXHRcdFx0XHRcdHJ1bkZpbHRlciA9IHRydWU7XG5cdFx0XHRcdH1cblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGNvbnN0IGZyb20gPSAkd2NhcGZEYXRlRmlsdGVyLmZpbmQoICcuZGF0ZS1mcm9tLWlucHV0JyApLnZhbCgpO1xuXG5cdFx0XHRcdGlmICggZnJvbSApIHtcblx0XHRcdFx0XHRmaWx0ZXJWYWx1ZSA9IGZyb207XG5cdFx0XHRcdFx0cnVuRmlsdGVyICAgPSB0cnVlO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdHJ1bkZpbHRlciA9IHRydWU7XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdFx0aWYgKCBydW5GaWx0ZXIgKSB7XG5cdFx0XHRcdCR3Y2FwZkRhdGVGaWx0ZXIuZGF0YSggJ3RpbWVyJywgc2V0VGltZW91dCggZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0JHdjYXBmRGF0ZUZpbHRlci5yZW1vdmVEYXRhKCAndGltZXInICk7XG5cblx0XHRcdFx0XHRpZiAoIGZpbHRlclZhbHVlICkge1xuXHRcdFx0XHRcdFx0d2NhcGZVcGRhdGVRdWVyeVN0cmluZ1BhcmFtZXRlciggZmlsdGVyS2V5LCBmaWx0ZXJWYWx1ZSApO1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRjb25zdCBxdWVyeSA9IHdjYXBmUmVtb3ZlUXVlcnlTdHJpbmdQYXJhbWV0ZXIoIGZpbHRlcktleSApO1xuXHRcdFx0XHRcdFx0aGlzdG9yeS5wdXNoU3RhdGUoIHt9LCAnJywgcXVlcnkgKTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHQvLyBmaWx0ZXIgcHJvZHVjdHNcblx0XHRcdFx0XHR3Y2FwZkZpbHRlclByb2R1Y3RzKCk7XG5cdFx0XHRcdH0sIGRlbGF5ICkgKTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHQvLyBoaXN0b3J5IGJhY2sgYW5kIGZvcndhcmQgcmVxdWVzdCBoYW5kbGluZ1xuXHRcdCQoIHdpbmRvdyApLmJpbmQoICdwb3BzdGF0ZScsIGZ1bmN0aW9uKCkge1xuXHRcdFx0Ly8gZmlsdGVyIHByb2R1Y3RzXG5cdFx0XHR3Y2FwZkZpbHRlclByb2R1Y3RzKCB0cnVlICk7XG5cdFx0fSApO1xuXG5cdH1cbik7XG4iXX0=
