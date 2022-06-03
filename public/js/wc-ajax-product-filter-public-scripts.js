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

      if ('undefined' === typeof noUiSlider) {
        return;
      }

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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNob3Nlbi5qcyIsImZpbHRlci1mb3JtLmpzIl0sIm5hbWVzIjpbImpRdWVyeSIsImRvY3VtZW50IiwicmVhZHkiLCIkIiwid2NhcGZfcGFyYW1zIiwicmFuZ2VWYWx1ZXNTZXBhcmF0b3IiLCJfZGVsYXkiLCJwYXJzZUludCIsImZpbHRlcl9pbnB1dF9kZWxheSIsImRlbGF5IiwiZmllbGRzIiwiJHdjYXBmU2luZ2xlRmlsdGVycyIsIiR3Y2FwZk5hdkZpbHRlcnMiLCIkd2NhcGZOdW1iZXJSYW5nZUZpbHRlcnMiLCJlYWNoIiwiJGZpZWxkIiwiaWQiLCJhdHRyIiwiJHdyYXBwZXIiLCJjaGlsZHJlbiIsImZpbHRlcktleSIsIm11bHRpcGxlRmlsdGVyIiwiaW5pdENob3NlbiIsImNob3NlbiIsImZpbmQiLCIkdGhpcyIsIm9wdGlvbnMiLCJub1Jlc3VsdHNNZXNzYWdlIiwic2VhcmNoVGhyZXNob2xkIiwiY2hvc2VuX2xpYl9zZWFyY2hfdGhyZXNob2xkIiwiaW5pdEhpZXJhcmNoeUFjY29yZGlvbiIsIm9uIiwidG9nZ2xlQ2xhc3MiLCJudW1iZXJfZm9ybWF0IiwibnVtYmVyIiwiZGVjaW1hbHMiLCJkZWNfcG9pbnQiLCJ0aG91c2FuZHNfc2VwIiwicmVwbGFjZSIsIm4iLCJpc0Zpbml0ZSIsInByZWMiLCJNYXRoIiwiYWJzIiwic2VwIiwiZGVjIiwicyIsInRvRml4ZWRGaXgiLCJrIiwicG93Iiwicm91bmQiLCJzcGxpdCIsImxlbmd0aCIsIkFycmF5Iiwiam9pbiIsImluaXROb1VJU2xpZGVyIiwiJGl0ZW0iLCIkc2xpZGVyIiwiaGFzQ2xhc3MiLCJzbGlkZXJJZCIsImRpc3BsYXlWYWx1ZXNBcyIsInJhbmdlTWluVmFsdWUiLCJwYXJzZUZsb2F0IiwicmFuZ2VNYXhWYWx1ZSIsInN0ZXAiLCJkZWNpbWFsUGxhY2VzIiwidGhvdXNhbmRTZXBhcmF0b3IiLCJkZWNpbWFsU2VwYXJhdG9yIiwibWluVmFsdWUiLCJtYXhWYWx1ZSIsIiRtaW5WYWx1ZSIsIiRtYXhWYWx1ZSIsIm5vVWlTbGlkZXIiLCJzbGlkZXIiLCJnZXRFbGVtZW50QnlJZCIsImNyZWF0ZSIsInN0YXJ0IiwiY29ubmVjdCIsInJhbmdlIiwidmFsdWVzIiwiaHRtbCIsInZhbCIsImZpbHRlclByb2R1Y3RzQWNjb3JkaW5nVG9TbGlkZXIiLCJxdWVyeSIsIndjYXBmUmVtb3ZlUXVlcnlTdHJpbmdQYXJhbWV0ZXIiLCJoaXN0b3J5IiwicHVzaFN0YXRlIiwiZmlsdGVyVmFsU3RyaW5nIiwid2NhcGZVcGRhdGVRdWVyeVN0cmluZ1BhcmFtZXRlciIsIndjYXBmRmlsdGVyUHJvZHVjdHMiLCJjbGVhclRpbWVvdXQiLCJkYXRhIiwic2V0VGltZW91dCIsInJlbW92ZURhdGEiLCJldmVudCIsInByZXZlbnREZWZhdWx0IiwiJGlucHV0Iiwic2V0IiwiZ2V0IiwiaW5pdERhdGVwaWNrZXIiLCIkd2NhcGZEYXRlRmlsdGVycyIsIiR3Y2FwZkRhdGVGaWx0ZXIiLCJmb3JtYXQiLCJ5ZWFyRHJvcGRvd24iLCJtb250aERyb3Bkb3duIiwiJGZyb20iLCIkdG8iLCJkYXRlcGlja2VyIiwiZGF0ZUZvcm1hdCIsImNoYW5nZVllYXIiLCJjaGFuZ2VNb250aCIsImZpbHRlckJ5RGF0ZSIsIndjYXBmQmVmb3JlVXBkYXRlIiwidHJpZ2dlciIsIndjYXBmQWZ0ZXJVcGRhdGUiLCJmb3JjZVJlUmVuZGVyIiwid2luZG93IiwibG9jYXRpb24iLCJocmVmIiwiJGRhdGEiLCIkc2hvcExvb3BDb250YWluZXIiLCJzaG9wX2xvb3BfY29udGFpbmVyIiwiJG5vdEZvdW5kQ29udGFpbmVyIiwibm90X2ZvdW5kX2NvbnRhaW5lciIsImZpZWxkSUQiLCJfZmllbGQiLCJmaWVsZENsYXNzIiwiY3VzdG9tX3NjcmlwdHMiLCJldmFsIiwid2NhcGZHZXRVcmxWYXJzIiwidXJsIiwidmFycyIsImhhc2giLCJyZXBsYWNlQWxsIiwiaGFzaGVzIiwic2xpY2UiLCJpbmRleE9mIiwiaExlbmd0aCIsImkiLCJ3Y2FwZkZpeFBhZ2luYXRpb24iLCJwYXJhbXMiLCJjdXJyZW50UGFnZUluVXJsIiwiY3VycmVudFBhZ2VJblBhcmFtcyIsImtleSIsInZhbHVlIiwicHVzaEhpc3RvcnkiLCJyZSIsIlJlZ0V4cCIsInNlcGFyYXRvciIsInVybFdpdGhRdWVyeSIsIm1hdGNoIiwib2xkUGFyYW1zIiwib2xkUGFyYW1zTGVuZ3RoIiwiT2JqZWN0Iiwia2V5cyIsInN0YXJ0UG9zaXRpb24iLCJmaWx0ZXJLZXlQb3NpdGlvbiIsImNsZWFuVXJsIiwiY2xlYW5RdWVyeSIsIm5ld1BhcmFtcyIsIndjYXBmTWFrZVBhcmFtZXRlcnMiLCJmaWx0ZXJWYWx1ZSIsImZvcmNlUmVyZW5kZXIiLCJ2YWx1ZVNlcGFyYXRvciIsIm5leHRWYWx1ZXMiLCJlbXB0eVZhbHVlIiwicHJldlZhbHVlcyIsInByZXZWYWx1ZXNBcnJheSIsImZvdW5kIiwiaW5BcnJheSIsInNwbGljZSIsInB1c2giLCJ3Y2FwZlNpbmdsZUZpbHRlciIsImhhbmRsZUZpbHRlclJlcXVlc3QiLCJjbG9zZXN0IiwiZmllbGREYXRhIiwidG9TdHJpbmciLCIkcmFuZ2VOdW1iZXIiLCJyZXNldEZpbHRlcnMiLCIkYnV0dG9uIiwiX2ZpbHRlcktleXMiLCJmaWx0ZXJLZXlzIiwicHJldlVybCIsIm5ld1VybCIsImlzUmFuZ2UiLCJydW5GaWx0ZXIiLCJmcm9tIiwidG8iLCJiaW5kIl0sIm1hcHBpbmdzIjoiOztBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUFBLE1BQU0sQ0FBRUMsUUFBRixDQUFOLENBQW1CQyxLQUFuQixDQUEwQixVQUFVQyxDQUFWLEVBQWMsQ0FJdkMsQ0FKRDs7O0FDWEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBLElBQU1DLFlBQVksR0FBR0EsWUFBWSxJQUFJO0FBQ3BDLHdCQUFzQixFQURjO0FBRXBDLGlDQUErQixFQUZLO0FBR3BDLHlCQUF1QixFQUhhO0FBSXBDLHlCQUF1QixFQUphO0FB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V0FBYixDQUEvQjtBQUNBLFNBRkQsTUFFTztBQUNOLGNBQU05RSxLQUFLLEdBQUdDLCtCQUErQixDQUFFaEUsU0FBRixDQUE3QztBQUNBaUUsVUFBQUEsT0FBTyxDQUFDQyxTQUFSLENBQW1CLEVBQW5CLEVBQXVCLEVBQXZCLEVBQTJCSCxLQUEzQjtBQUNBLFNBUnFELENBVXREOzs7QUFDQU0sUUFBQUEsbUJBQW1CO0FBQ25CLE9BWnlDLEVBWXZDaEYsS0FadUMsQ0FBMUM7QUFhQTtBQUNELEdBM3pCWSxDQTZ6QmI7OztBQUNBTixFQUFBQSxDQUFDLENBQUVpSCxNQUFGLENBQUQsQ0FBWXdFLElBQVosQ0FBa0IsVUFBbEIsRUFBOEIsWUFBVztBQUN4QztBQUNBbkcsSUFBQUEsbUJBQW1CLENBQUUsSUFBRixDQUFuQjtBQUNBLEdBSEQ7QUFLQSxDQXAwQkYiLCJmaWxlIjoid2MtYWpheC1wcm9kdWN0LWZpbHRlci1wdWJsaWMtc2NyaXB0cy5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogRGlzcGxheSB0eXBlIGZpZWxkcy5cbiAqXG4gKiBUT0RPOiBNYXliZSBkZWxldGUuXG4gKlxuICogQHNpbmNlICAgICAgMy4wLjBcbiAqIEBwYWNrYWdlICAgIHdjLWFqYXgtcHJvZHVjdC1maWx0ZXJcbiAqIEBzdWJwYWNrYWdlIHdjLWFqYXgtcHJvZHVjdC1maWx0ZXIvYWRtaW4vc3JjL2pzXG4gKiBAYXV0aG9yICAgICBNYWludWwgSGFzc2FuIE1haW5cbiAqL1xuXG5qUXVlcnkoIGRvY3VtZW50ICkucmVhZHkoIGZ1bmN0aW9uKCAkICkge1xuXG5cblxufSApO1xuIiwiLyoqXG4gKiBUaGUgZnJvbnRlbmQgZmlsdGVyIGZvcm0uXG4gKlxuICogQHNpbmNlICAgICAgMy4wLjBcbiAqIEBwYWNrYWdlICAgIHdjLWFqYXgtcHJvZHVjdC1maWx0ZXJcbiAqIEBzdWJwYWNrYWdlIHdjLWFqYXgtcHJvZHVjdC1maWx0ZXIvcHVibGljL3NyYy9qc1xuICogQGF1dGhvciAgICAgTWFpbnVsIEhhc3NhbiBNYWluXG4gKi9cblxuY29uc3Qgd2NhcGZfcGFyYW1zID0gd2NhcGZfcGFyYW1zIHx8IHtcblx0J2ZpbHRlcl9pbnB1dF9kZWxheSc6ICcnLFxuXHQnY2hvc2VuX2xpYl9zZWFyY2hfdGhyZXNob2xkJzogJycsXG5cdCdzaG9wX2xvb3BfY29udGFpbmVyJzogJycsXG5cdCdub3RfZm91bmRfY29udGFpbmVyJzogJycsXG5cdCdwYWdpbmF0aW9uX2NvbnRhaW5lcic6ICcnLCAvLyB0b2RvXG5cdCdzb3J0aW5nX2NvbnRyb2wnOiAnJywgLy8gdG9kb1xuXHQnc2Nyb2xsX3RvX3RvcCc6ICcnLCAvLyB0b2RvXG5cdCdzY3JvbGxfdG9fdG9wX29mZnNldCc6ICcnLCAvLyB0b2RvXG5cdCdjdXN0b21fc2NyaXB0cyc6ICcnLFxufTtcblxualF1ZXJ5KCBkb2N1bWVudCApLnJlYWR5KFxuXHRmdW5jdGlvbiggJCApIHtcblxuXHRcdGNvbnN0IHJhbmdlVmFsdWVzU2VwYXJhdG9yID0gJ34nO1xuXG5cdFx0Ly8gcmV0dXJuIGZhbHNlIGlmIHdjYXBmX3BhcmFtcyB2YXJpYWJsZSBpcyBub3QgZm91bmRcblx0XHRpZiAoIHR5cGVvZiB3Y2FwZl9wYXJhbXMgPT09ICd1bmRlZmluZWQnICkge1xuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH1cblxuXHRcdGNvbnN0IF9kZWxheSA9IHBhcnNlSW50KCB3Y2FwZl9wYXJhbXMuZmlsdGVyX2lucHV0X2RlbGF5ICk7XG5cdFx0Y29uc3QgZGVsYXkgID0gX2RlbGF5ID49IDAgPyBfZGVsYXkgOiA4MDA7XG5cblx0XHQvLyBzdG9yZSBmaWVsZHMnIGlkIGFuZCBmaWx0ZXIgaW5mb3JtYXRpb25cblx0XHRjb25zdCBmaWVsZHMgPSB7fTtcblxuXHRcdGNvbnN0ICR3Y2FwZlNpbmdsZUZpbHRlcnMgICAgICA9ICQoICcud2NhcGYtc2luZ2xlLWZpbHRlcicgKTtcblx0XHRjb25zdCAkd2NhcGZOYXZGaWx0ZXJzICAgICAgICAgPSAkKCAnLndjYXBmLW5hdi1maWx0ZXInICk7XG5cdFx0Y29uc3QgJHdjYXBmTnVtYmVyUmFuZ2VGaWx0ZXJzID0gJCggJy53Y2FwZi1udW1iZXItcmFuZ2UtZmlsdGVyJyApO1xuXG5cdFx0JHdjYXBmU2luZ2xlRmlsdGVycy5lYWNoKFxuXHRcdFx0ZnVuY3Rpb24oKSB7XG5cdFx0XHRcdGNvbnN0ICRmaWVsZCAgICAgICAgID0gJCggdGhpcyApO1xuXHRcdFx0XHRjb25zdCBpZCAgICAgICAgICAgICA9ICRmaWVsZC5hdHRyKCAnZGF0YS1pZCcgKTtcblx0XHRcdFx0Y29uc3QgJHdyYXBwZXIgICAgICAgPSAkZmllbGQuY2hpbGRyZW4oICdkaXYnICk7XG5cdFx0XHRcdGNvbnN0IGZpbHRlcktleSAgICAgID0gJHdyYXBwZXIuYXR0ciggJ2RhdGEtZmlsdGVyLWtleScgKTtcblx0XHRcdFx0Y29uc3QgbXVsdGlwbGVGaWx0ZXIgPSBwYXJzZUludCggJHdyYXBwZXIuYXR0ciggJ2RhdGEtbXVsdGlwbGUtZmlsdGVyJyApICk7XG5cblx0XHRcdFx0ZmllbGRzWyBpZCBdID0ge1xuXHRcdFx0XHRcdGZpbHRlcktleTogZmlsdGVyS2V5LFxuXHRcdFx0XHRcdG11bHRpcGxlRmlsdGVyOiBtdWx0aXBsZUZpbHRlclxuXHRcdFx0XHR9O1xuXHRcdFx0fVxuXHRcdCk7XG5cblx0XHQvLyBJbml0aWFsaXplIGpRdWVyeSBjaG9zZW4gbGlicmFyeVxuXHRcdGZ1bmN0aW9uIGluaXRDaG9zZW4oKSB7XG5cdFx0XHRpZiAoICEgalF1ZXJ5KCkuY2hvc2VuICkge1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdCR3Y2FwZk5hdkZpbHRlcnMuZmluZCggJy53Y2FwZi1jaG9zZW4tc2VsZWN0JyApLmVhY2goIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRjb25zdCAkdGhpcyAgID0gJCggdGhpcyApO1xuXHRcdFx0XHRjb25zdCBvcHRpb25zID0ge307XG5cblx0XHRcdFx0Y29uc3Qgbm9SZXN1bHRzTWVzc2FnZSA9ICR0aGlzLmF0dHIoICdkYXRhLW5vLXJlc3VsdHMtbWVzc2FnZScgKTtcblxuXHRcdFx0XHRpZiAoIG5vUmVzdWx0c01lc3NhZ2UgKSB7XG5cdFx0XHRcdFx0b3B0aW9uc1sgJ25vX3Jlc3VsdHNfdGV4dCcgXSA9IG5vUmVzdWx0c01lc3NhZ2U7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRjb25zdCBzZWFyY2hUaHJlc2hvbGQgPSBwYXJzZUludCggd2NhcGZfcGFyYW1zLmNob3Nlbl9saWJfc2VhcmNoX3RocmVzaG9sZCApO1xuXG5cdFx0XHRcdGlmICggc2VhcmNoVGhyZXNob2xkICkge1xuXHRcdFx0XHRcdG9wdGlvbnNbICdkaXNhYmxlX3NlYXJjaF90aHJlc2hvbGQnIF0gPSBzZWFyY2hUaHJlc2hvbGQ7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHQkdGhpcy5jaG9zZW4oIG9wdGlvbnMgKTtcblx0XHRcdH0gKTtcblx0XHR9XG5cblx0XHRpbml0Q2hvc2VuKCk7XG5cblx0XHQvLyBJbml0aWFsaXplIGhpZXJhcmNoeSBhY2NvcmRpb25cblx0XHRmdW5jdGlvbiBpbml0SGllcmFyY2h5QWNjb3JkaW9uKCkge1xuXHRcdFx0JHdjYXBmTmF2RmlsdGVycy5maW5kKCAnLmhpZXJhcmNoeS1hY2NvcmRpb24tdG9nZ2xlJyApLm9uKCAnY2xpY2snLCBmdW5jdGlvbigpIHtcblx0XHRcdFx0JCggdGhpcyApLnRvZ2dsZUNsYXNzKCAnYWN0aXZlJyApO1xuXHRcdFx0fSApO1xuXHRcdH1cblxuXHRcdGluaXRIaWVyYXJjaHlBY2NvcmRpb24oKTtcblxuXHRcdC8qKlxuXHRcdCAqIEBzb3VyY2UgaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9hLzM0MTQxODEzXG5cdFx0ICpcblx0XHQgKiBAcGFyYW0gbnVtYmVyXG5cdFx0ICogQHBhcmFtIGRlY2ltYWxzXG5cdFx0ICogQHBhcmFtIGRlY19wb2ludFxuXHRcdCAqIEBwYXJhbSB0aG91c2FuZHNfc2VwXG5cdFx0ICpcblx0XHQgKiBAcmV0dXJucyB7c3RyaW5nfVxuXHRcdCAqL1xuXHRcdGZ1bmN0aW9uIG51bWJlcl9mb3JtYXQoIG51bWJlciwgZGVjaW1hbHMsIGRlY19wb2ludCwgdGhvdXNhbmRzX3NlcCApIHtcblx0XHRcdC8vIFN0cmlwIGFsbCBjaGFyYWN0ZXJzIGJ1dCBudW1lcmljYWwgb25lcy5cblx0XHRcdG51bWJlciA9ICggbnVtYmVyICsgJycgKS5yZXBsYWNlKCAvW15cXGQrXFwtRWUuXS9nLCAnJyApO1xuXG5cdFx0XHRjb25zdCBuICAgID0gISBpc0Zpbml0ZSggK251bWJlciApID8gMCA6ICtudW1iZXI7XG5cdFx0XHRjb25zdCBwcmVjID0gISBpc0Zpbml0ZSggK2RlY2ltYWxzICkgPyAwIDogTWF0aC5hYnMoIGRlY2ltYWxzICk7XG5cdFx0XHRjb25zdCBzZXAgID0gKCB0eXBlb2YgdGhvdXNhbmRzX3NlcCA9PT0gJ3VuZGVmaW5lZCcgKSA/ICcsJyA6IHRob3VzYW5kc19zZXA7XG5cdFx0XHRjb25zdCBkZWMgID0gKCB0eXBlb2YgZGVjX3BvaW50ID09PSAndW5kZWZpbmVkJyApID8gJy4nIDogZGVjX3BvaW50O1xuXG5cdFx0XHRsZXQgcztcblxuXHRcdFx0Y29uc3QgdG9GaXhlZEZpeCA9IGZ1bmN0aW9uKCBuLCBwcmVjICkge1xuXHRcdFx0XHRjb25zdCBrID0gTWF0aC5wb3coIDEwLCBwcmVjICk7XG5cdFx0XHRcdHJldHVybiAnJyArIE1hdGgucm91bmQoIG4gKiBrICkgLyBrO1xuXHRcdFx0fTtcblxuXHRcdFx0Ly8gRml4IGZvciBJRSBwYXJzZUZsb2F0KDAuNTUpLnRvRml4ZWQoMCkgPSAwO1xuXHRcdFx0cyA9ICggcHJlYyA/IHRvRml4ZWRGaXgoIG4sIHByZWMgKSA6ICcnICsgTWF0aC5yb3VuZCggbiApICkuc3BsaXQoICcuJyApO1xuXG5cdFx0XHRpZiAoIHNbIDAgXS5sZW5ndGggPiAzICkge1xuXHRcdFx0XHRzWyAwIF0gPSBzWyAwIF0ucmVwbGFjZSggL1xcQig/PSg/OlxcZHszfSkrKD8hXFxkKSkvZywgc2VwICk7XG5cdFx0XHR9XG5cblx0XHRcdGlmICggKCBzWyAxIF0gfHwgJycgKS5sZW5ndGggPCBwcmVjICkge1xuXHRcdFx0XHRzWyAxIF0gPSBzWyAxIF0gfHwgJyc7XG5cdFx0XHRcdHNbIDEgXSArPSBuZXcgQXJyYXkoIHByZWMgLSBzWyAxIF0ubGVuZ3RoICsgMSApLmpvaW4oICcwJyApO1xuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gcy5qb2luKCBkZWMgKTtcblx0XHR9XG5cblx0XHQvLyBJbml0aWFsaXplIG5vVUlTbGlkZXJcblx0XHRmdW5jdGlvbiBpbml0Tm9VSVNsaWRlcigpIHtcblx0XHRcdCR3Y2FwZk51bWJlclJhbmdlRmlsdGVycy5maW5kKCAnLndjYXBmLXJhbmdlLXNsaWRlcicgKS5lYWNoKCBmdW5jdGlvbigpIHtcblx0XHRcdFx0Y29uc3QgJGl0ZW0gPSAkKCB0aGlzICk7XG5cblx0XHRcdFx0Y29uc3QgZmlsdGVyS2V5ID0gJGl0ZW0uYXR0ciggJ2RhdGEtZmlsdGVyLWtleScgKTtcblx0XHRcdFx0Y29uc3QgJHNsaWRlciAgID0gJGl0ZW0uZmluZCggJy53Y2FwZi1ub3VpLXNsaWRlcicgKTtcblxuXHRcdFx0XHQvLyBJZiBzbGlkZXIgaXMgYWxyZWFkeSBpbml0aWFsaXplZCB0aGVuIGRvbid0IHJlaW5pdGlhbGl6ZSBhZ2Fpbi5cblx0XHRcdFx0aWYgKCAkc2xpZGVyLmhhc0NsYXNzKCAnbm9VaS10YXJnZXQnICkgKSB7XG5cdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0Y29uc3Qgc2xpZGVySWQgICAgICAgICAgPSAkc2xpZGVyLmF0dHIoICdpZCcgKTtcblx0XHRcdFx0Y29uc3QgZGlzcGxheVZhbHVlc0FzICAgPSAkaXRlbS5hdHRyKCAnZGF0YS1kaXNwbGF5LXZhbHVlcy1hcycgKTtcblx0XHRcdFx0Y29uc3QgcmFuZ2VNaW5WYWx1ZSAgICAgPSBwYXJzZUZsb2F0KCAkaXRlbS5hdHRyKCAnZGF0YS1yYW5nZS1taW4tdmFsdWUnICkgKTtcblx0XHRcdFx0Y29uc3QgcmFuZ2VNYXhWYWx1ZSAgICAgPSBwYXJzZUZsb2F0KCAkaXRlbS5hdHRyKCAnZGF0YS1yYW5nZS1tYXgtdmFsdWUnICkgKTtcblx0XHRcdFx0Y29uc3Qgc3RlcCAgICAgICAgICAgICAgPSBwYXJzZUZsb2F0KCAkaXRlbS5hdHRyKCAnZGF0YS1zdGVwJyApICk7XG5cdFx0XHRcdGNvbnN0IGRlY2ltYWxQbGFjZXMgICAgID0gJGl0ZW0uYXR0ciggJ2RhdGEtZGVjaW1hbC1wbGFjZXMnICk7XG5cdFx0XHRcdGNvbnN0IHRob3VzYW5kU2VwYXJhdG9yID0gJGl0ZW0uYXR0ciggJ2RhdGEtdGhvdXNhbmQtc2VwYXJhdG9yJyApO1xuXHRcdFx0XHRjb25zdCBkZWNpbWFsU2VwYXJhdG9yICA9ICRpdGVtLmF0dHIoICdkYXRhLWRlY2ltYWwtc2VwYXJhdG9yJyApO1xuXHRcdFx0XHRjb25zdCBtaW5WYWx1ZSAgICAgICAgICA9IHBhcnNlRmxvYXQoICRpdGVtLmF0dHIoICdkYXRhLW1pbi12YWx1ZScgKSApO1xuXHRcdFx0XHRjb25zdCBtYXhWYWx1ZSAgICAgICAgICA9IHBhcnNlRmxvYXQoICRpdGVtLmF0dHIoICdkYXRhLW1heC12YWx1ZScgKSApO1xuXHRcdFx0XHRjb25zdCAkbWluVmFsdWUgICAgICAgICA9ICRpdGVtLmZpbmQoICcubWluLXZhbHVlJyApO1xuXHRcdFx0XHRjb25zdCAkbWF4VmFsdWUgICAgICAgICA9ICRpdGVtLmZpbmQoICcubWF4LXZhbHVlJyApO1xuXG5cdFx0XHRcdGlmICggJ3VuZGVmaW5lZCcgPT09IHR5cGVvZiBub1VpU2xpZGVyICkge1xuXHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGNvbnN0IHNsaWRlciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCBzbGlkZXJJZCApO1xuXG5cdFx0XHRcdG5vVWlTbGlkZXIuY3JlYXRlKCBzbGlkZXIsIHtcblx0XHRcdFx0XHRzdGFydDogWyBtaW5WYWx1ZSwgbWF4VmFsdWUgXSxcblx0XHRcdFx0XHRzdGVwLFxuXHRcdFx0XHRcdGNvbm5lY3Q6IHRydWUsXG5cdFx0XHRcdFx0cmFuZ2U6IHtcblx0XHRcdFx0XHRcdCdtaW4nOiByYW5nZU1pblZhbHVlLFxuXHRcdFx0XHRcdFx0J21heCc6IHJhbmdlTWF4VmFsdWUsXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9ICk7XG5cblx0XHRcdFx0c2xpZGVyLm5vVWlTbGlkZXIub24oICd1cGRhdGUnLCBmdW5jdGlvbiggdmFsdWVzICkge1xuXHRcdFx0XHRcdGNvbnN0IG1pblZhbHVlID0gbnVtYmVyX2Zvcm1hdCggdmFsdWVzWyAwIF0sIGRlY2ltYWxQbGFjZXMsIGRlY2ltYWxTZXBhcmF0b3IsIHRob3VzYW5kU2VwYXJhdG9yICk7XG5cdFx0XHRcdFx0Y29uc3QgbWF4VmFsdWUgPSBudW1iZXJfZm9ybWF0KCB2YWx1ZXNbIDEgXSwgZGVjaW1hbFBsYWNlcywgZGVjaW1hbFNlcGFyYXRvciwgdGhvdXNhbmRTZXBhcmF0b3IgKTtcblxuXHRcdFx0XHRcdGlmICggJ3BsYWluX3RleHQnID09PSBkaXNwbGF5VmFsdWVzQXMgKSB7XG5cdFx0XHRcdFx0XHQkbWluVmFsdWUuaHRtbCggbWluVmFsdWUgKTtcblx0XHRcdFx0XHRcdCRtYXhWYWx1ZS5odG1sKCBtYXhWYWx1ZSApO1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHQkbWluVmFsdWUudmFsKCBtaW5WYWx1ZSApO1xuXHRcdFx0XHRcdFx0JG1heFZhbHVlLnZhbCggbWF4VmFsdWUgKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0gKTtcblxuXHRcdFx0XHRmdW5jdGlvbiBmaWx0ZXJQcm9kdWN0c0FjY29yZGluZ1RvU2xpZGVyKCB2YWx1ZXMgKSB7XG5cdFx0XHRcdFx0Y29uc3QgbWluVmFsdWUgPSBwYXJzZUZsb2F0KCB2YWx1ZXNbIDAgXSApO1xuXHRcdFx0XHRcdGNvbnN0IG1heFZhbHVlID0gcGFyc2VGbG9hdCggdmFsdWVzWyAxIF0gKTtcblxuXHRcdFx0XHRcdGlmICggbWluVmFsdWUgPT09IHJhbmdlTWluVmFsdWUgJiYgbWF4VmFsdWUgPT09IHJhbmdlTWF4VmFsdWUgKSB7XG5cdFx0XHRcdFx0XHRjb25zdCBxdWVyeSA9IHdjYXBmUmVtb3ZlUXVlcnlTdHJpbmdQYXJhbWV0ZXIoIGZpbHRlcktleSApO1xuXHRcdFx0XHRcdFx0aGlzdG9yeS5wdXNoU3RhdGUoIHt9LCAnJywgcXVlcnkgKTtcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0Y29uc3QgZmlsdGVyVmFsU3RyaW5nID0gbWluVmFsdWUgKyByYW5nZVZhbHVlc1NlcGFyYXRvciArIG1heFZhbHVlO1xuXHRcdFx0XHRcdFx0d2NhcGZVcGRhdGVRdWVyeVN0cmluZ1BhcmFtZXRlciggZmlsdGVyS2V5LCBmaWx0ZXJWYWxTdHJpbmcgKTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHQvLyBmaWx0ZXIgcHJvZHVjdHNcblx0XHRcdFx0XHR3Y2FwZkZpbHRlclByb2R1Y3RzKCk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRzbGlkZXIubm9VaVNsaWRlci5vbiggJ2VuZCcsIGZ1bmN0aW9uKCB2YWx1ZXMgKSB7XG5cdFx0XHRcdFx0Ly8gQ2xlYXIgYW55IHByZXZpb3VzbHkgc2V0IHRpbWVyIGJlZm9yZSBzZXR0aW5nIGEgZnJlc2ggb25lXG5cdFx0XHRcdFx0Y2xlYXJUaW1lb3V0KCAkaXRlbS5kYXRhKCAndGltZXInICkgKTtcblxuXHRcdFx0XHRcdCRpdGVtLmRhdGEoICd0aW1lcicsIHNldFRpbWVvdXQoIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdFx0JGl0ZW0ucmVtb3ZlRGF0YSggJ3RpbWVyJyApO1xuXG5cdFx0XHRcdFx0XHRmaWx0ZXJQcm9kdWN0c0FjY29yZGluZ1RvU2xpZGVyKCB2YWx1ZXMgKTtcblx0XHRcdFx0XHR9LCBkZWxheSApICk7XG5cdFx0XHRcdH0gKTtcblxuXHRcdFx0XHQkbWluVmFsdWUub24oICdpbnB1dCcsIGZ1bmN0aW9uKCBldmVudCApIHtcblx0XHRcdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXG5cdFx0XHRcdFx0Y29uc3QgJGlucHV0ID0gJCggdGhpcyApO1xuXG5cdFx0XHRcdFx0Ly8gQ2xlYXIgYW55IHByZXZpb3VzbHkgc2V0IHRpbWVyIGJlZm9yZSBzZXR0aW5nIGEgZnJlc2ggb25lXG5cdFx0XHRcdFx0Y2xlYXJUaW1lb3V0KCAkaW5wdXQuZGF0YSggJ3RpbWVyJyApICk7XG5cblx0XHRcdFx0XHQkaW5wdXQuZGF0YSggJ3RpbWVyJywgc2V0VGltZW91dCggZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0XHQkaW5wdXQucmVtb3ZlRGF0YSggJ3RpbWVyJyApO1xuXG5cdFx0XHRcdFx0XHRjb25zdCBtaW5WYWx1ZSA9ICRpbnB1dC52YWwoKTtcblxuXHRcdFx0XHRcdFx0c2xpZGVyLm5vVWlTbGlkZXIuc2V0KCBbIG1pblZhbHVlLCBudWxsIF0gKTtcblxuXHRcdFx0XHRcdFx0ZmlsdGVyUHJvZHVjdHNBY2NvcmRpbmdUb1NsaWRlciggc2xpZGVyLm5vVWlTbGlkZXIuZ2V0KCkgKTtcblx0XHRcdFx0XHR9LCBkZWxheSApICk7XG5cdFx0XHRcdH0gKTtcblxuXHRcdFx0XHQkbWF4VmFsdWUub24oICdpbnB1dCcsIGZ1bmN0aW9uKCBldmVudCApIHtcblx0XHRcdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXG5cdFx0XHRcdFx0Y29uc3QgJGlucHV0ID0gJCggdGhpcyApO1xuXG5cdFx0XHRcdFx0Ly8gQ2xlYXIgYW55IHByZXZpb3VzbHkgc2V0IHRpbWVyIGJlZm9yZSBzZXR0aW5nIGEgZnJlc2ggb25lXG5cdFx0XHRcdFx0Y2xlYXJUaW1lb3V0KCAkaW5wdXQuZGF0YSggJ3RpbWVyJyApICk7XG5cblx0XHRcdFx0XHQkaW5wdXQuZGF0YSggJ3RpbWVyJywgc2V0VGltZW91dCggZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0XHQkaW5wdXQucmVtb3ZlRGF0YSggJ3RpbWVyJyApO1xuXG5cdFx0XHRcdFx0XHRjb25zdCBtYXhWYWx1ZSA9ICRpbnB1dC52YWwoKTtcblxuXHRcdFx0XHRcdFx0c2xpZGVyLm5vVWlTbGlkZXIuc2V0KCBbIG51bGwsIG1heFZhbHVlIF0gKTtcblxuXHRcdFx0XHRcdFx0ZmlsdGVyUHJvZHVjdHNBY2NvcmRpbmdUb1NsaWRlciggc2xpZGVyLm5vVWlTbGlkZXIuZ2V0KCkgKTtcblx0XHRcdFx0XHR9LCBkZWxheSApICk7XG5cdFx0XHRcdH0gKTtcblx0XHRcdH0gKTtcblx0XHR9XG5cblx0XHRpbml0Tm9VSVNsaWRlcigpO1xuXG5cdFx0ZnVuY3Rpb24gaW5pdERhdGVwaWNrZXIoKSB7XG5cdFx0XHRjb25zdCAkd2NhcGZEYXRlRmlsdGVycyA9ICQoICcud2NhcGYtZGF0ZS1yYW5nZS1maWx0ZXInICk7XG5cdFx0XHRjb25zdCAkd2NhcGZEYXRlRmlsdGVyICA9ICR3Y2FwZkRhdGVGaWx0ZXJzLmZpbmQoICcud2NhcGYtZGF0ZS1pbnB1dCcgKTtcblxuXHRcdFx0Y29uc3QgZm9ybWF0ICAgICAgICA9ICR3Y2FwZkRhdGVGaWx0ZXIuYXR0ciggJ2RhdGEtZGF0ZS1mb3JtYXQnICk7XG5cdFx0XHRjb25zdCB5ZWFyRHJvcGRvd24gID0gJHdjYXBmRGF0ZUZpbHRlci5hdHRyKCAnZGF0YS1kYXRlLXBpY2tlci15ZWFyLWRyb3Bkb3duJyApO1xuXHRcdFx0Y29uc3QgbW9udGhEcm9wZG93biA9ICR3Y2FwZkRhdGVGaWx0ZXIuYXR0ciggJ2RhdGEtZGF0ZS1waWNrZXItbW9udGgtZHJvcGRvd24nICk7XG5cblx0XHRcdGNvbnN0ICRmcm9tID0gJHdjYXBmRGF0ZUZpbHRlci5maW5kKCAnLmRhdGUtZnJvbS1pbnB1dCcgKTtcblx0XHRcdGNvbnN0ICR0byAgID0gJHdjYXBmRGF0ZUZpbHRlci5maW5kKCAnLmRhdGUtdG8taW5wdXQnICk7XG5cblx0XHRcdCRmcm9tLmRhdGVwaWNrZXIoIHtcblx0XHRcdFx0ZGF0ZUZvcm1hdDogZm9ybWF0LFxuXHRcdFx0XHRjaGFuZ2VZZWFyOiB5ZWFyRHJvcGRvd24sXG5cdFx0XHRcdGNoYW5nZU1vbnRoOiBtb250aERyb3Bkb3duLFxuXHRcdFx0fSApO1xuXG5cdFx0XHQkdG8uZGF0ZXBpY2tlcigge1xuXHRcdFx0XHRkYXRlRm9ybWF0OiBmb3JtYXQsXG5cdFx0XHRcdGNoYW5nZVllYXI6IHllYXJEcm9wZG93bixcblx0XHRcdFx0Y2hhbmdlTW9udGg6IG1vbnRoRHJvcGRvd24sXG5cdFx0XHR9ICk7XG5cblx0XHRcdCRmcm9tLm9uKCAnY2hhbmdlJywgZnVuY3Rpb24oKSB7XG5cdFx0XHRcdGNvbnN0ICRpbnB1dCA9ICQoIHRoaXMgKTtcblx0XHRcdFx0ZmlsdGVyQnlEYXRlKCAkaW5wdXQgKTtcblx0XHRcdH0gKTtcblxuXHRcdFx0JHRvLm9uKCAnY2hhbmdlJywgZnVuY3Rpb24oKSB7XG5cdFx0XHRcdGNvbnN0ICRpbnB1dCA9ICQoIHRoaXMgKTtcblx0XHRcdFx0ZmlsdGVyQnlEYXRlKCAkaW5wdXQgKTtcblx0XHRcdH0gKTtcblx0XHR9XG5cblx0XHRpbml0RGF0ZXBpY2tlcigpO1xuXG5cdFx0Ly8gc2hvdyBhIGxvYWRpbmcgaW5kaWNhdG9yXG5cdFx0ZnVuY3Rpb24gd2NhcGZCZWZvcmVVcGRhdGUoKSB7XG5cdFx0XHQkKCAnYm9keScgKS50cmlnZ2VyKCAnd2NhcGZfYmVmb3JlX3VwZGF0ZV9maWx0ZXJzJyApO1xuXHRcdH1cblxuXHRcdC8vIHNjcm9sbCB0byB0b3Bcblx0XHRmdW5jdGlvbiB3Y2FwZkFmdGVyVXBkYXRlKCkge1xuXHRcdFx0aW5pdENob3NlbigpO1xuXHRcdFx0aW5pdEhpZXJhcmNoeUFjY29yZGlvbigpO1xuXHRcdFx0aW5pdE5vVUlTbGlkZXIoKTtcblx0XHRcdGluaXREYXRlcGlja2VyKCk7XG5cblx0XHRcdCQoICdib2R5JyApLnRyaWdnZXIoICd3Y2FwZl9hZnRlcl91cGRhdGVfZmlsdGVycycgKTtcblx0XHR9XG5cblx0XHQvLyBmaWx0ZXIgdGhlIHByb2R1Y3RzXG5cdFx0ZnVuY3Rpb24gd2NhcGZGaWx0ZXJQcm9kdWN0cyggZm9yY2VSZVJlbmRlciA9IGZhbHNlICkge1xuXHRcdFx0d2NhcGZCZWZvcmVVcGRhdGUoKTtcblxuXHRcdFx0JC5nZXQoXG5cdFx0XHRcdHdpbmRvdy5sb2NhdGlvbi5ocmVmLFxuXHRcdFx0XHRmdW5jdGlvbiggZGF0YSApIHtcblx0XHRcdFx0XHRjb25zdCAkZGF0YSA9ICQoIGRhdGEgKTtcblxuXHRcdFx0XHRcdGNvbnN0ICRzaG9wTG9vcENvbnRhaW5lciA9ICRkYXRhLmZpbmQoIHdjYXBmX3BhcmFtcy5zaG9wX2xvb3BfY29udGFpbmVyICk7XG5cdFx0XHRcdFx0Y29uc3QgJG5vdEZvdW5kQ29udGFpbmVyID0gJGRhdGEuZmluZCggd2NhcGZfcGFyYW1zLm5vdF9mb3VuZF9jb250YWluZXIgKTtcblxuXHRcdFx0XHRcdC8vIHJlcGxhY2UgZmllbGRzJyBkYXRhIHdpdGggbmV3IGRhdGFcblx0XHRcdFx0XHQkLmVhY2goXG5cdFx0XHRcdFx0XHRmaWVsZHMsXG5cdFx0XHRcdFx0XHRmdW5jdGlvbiggaWQgKSB7XG5cdFx0XHRcdFx0XHRcdGNvbnN0IGZpZWxkSUQgICAgPSAnW2RhdGEtaWQ9XCInICsgaWQgKyAnXCJdJztcblx0XHRcdFx0XHRcdFx0Y29uc3QgJGZpZWxkICAgICA9ICQoIGZpZWxkSUQgKTtcblx0XHRcdFx0XHRcdFx0Y29uc3QgX2ZpZWxkICAgICA9ICRkYXRhLmZpbmQoIGZpZWxkSUQgKTtcblx0XHRcdFx0XHRcdFx0Y29uc3QgZmllbGRDbGFzcyA9ICQoIF9maWVsZCApLmF0dHIoICdjbGFzcycgKTtcblxuXHRcdFx0XHRcdFx0XHQvLyBXaGVuIGNhbGxlZCBmcm9tIGhpc3RvcnkgYmFjayBvciBmb3J3YXJkIHJlcXVlc3QgdGhlbiByZXJlbmRlciBhbGwgZmllbGRzLlxuXHRcdFx0XHRcdFx0XHRpZiAoIGZvcmNlUmVSZW5kZXIgKSB7XG5cblx0XHRcdFx0XHRcdFx0XHQvLyB1cGRhdGUgY2xhc3Ncblx0XHRcdFx0XHRcdFx0XHQkZmllbGQuYXR0ciggJ2NsYXNzJywgZmllbGRDbGFzcyApO1xuXG5cdFx0XHRcdFx0XHRcdFx0Ly8gdXBkYXRlIGZpZWxkXG5cdFx0XHRcdFx0XHRcdFx0JGZpZWxkLmh0bWwoIF9maWVsZC5odG1sKCkgKTtcblxuXHRcdFx0XHRcdFx0XHR9IGVsc2Uge1xuXG5cdFx0XHRcdFx0XHRcdFx0Ly8gU2VsZWN0aXZlbHkgcmVyZW5kZXIgdGhlIGZpZWxkcy5cblx0XHRcdFx0XHRcdFx0XHRpZiAoICRmaWVsZC5oYXNDbGFzcyggJ3djYXBmLW5hdi1maWx0ZXInICkgKSB7XG5cblx0XHRcdFx0XHRcdFx0XHRcdC8vIHVwZGF0ZSBjbGFzc1xuXHRcdFx0XHRcdFx0XHRcdFx0JGZpZWxkLmF0dHIoICdjbGFzcycsIGZpZWxkQ2xhc3MgKTtcblxuXHRcdFx0XHRcdFx0XHRcdFx0Ly8gdXBkYXRlIGZpZWxkXG5cdFx0XHRcdFx0XHRcdFx0XHQkZmllbGQuaHRtbCggX2ZpZWxkLmh0bWwoKSApO1xuXG5cdFx0XHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHQpO1xuXG5cdFx0XHRcdFx0Ly8gcmVwbGFjZSBvbGQgc2hvcCBsb29wIHdpdGggbmV3IG9uZVxuXHRcdFx0XHRcdGlmICggd2NhcGZfcGFyYW1zLnNob3BfbG9vcF9jb250YWluZXIgPT09IHdjYXBmX3BhcmFtcy5ub3RfZm91bmRfY29udGFpbmVyICkge1xuXHRcdFx0XHRcdFx0JCggd2NhcGZfcGFyYW1zLnNob3BfbG9vcF9jb250YWluZXIgKS5odG1sKCAkc2hvcExvb3BDb250YWluZXIuaHRtbCgpICk7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdGlmICggJCggd2NhcGZfcGFyYW1zLm5vdF9mb3VuZF9jb250YWluZXIgKS5sZW5ndGggKSB7XG5cdFx0XHRcdFx0XHRcdGlmICggJHNob3BMb29wQ29udGFpbmVyLmxlbmd0aCApIHtcblx0XHRcdFx0XHRcdFx0XHQkKCB3Y2FwZl9wYXJhbXMubm90X2ZvdW5kX2NvbnRhaW5lciApLmh0bWwoICRzaG9wTG9vcENvbnRhaW5lci5odG1sKCkgKTtcblx0XHRcdFx0XHRcdFx0fSBlbHNlIGlmICggJG5vdEZvdW5kQ29udGFpbmVyLmxlbmd0aCApIHtcblx0XHRcdFx0XHRcdFx0XHQkKCB3Y2FwZl9wYXJhbXMubm90X2ZvdW5kX2NvbnRhaW5lciApLmh0bWwoICRub3RGb3VuZENvbnRhaW5lci5odG1sKCkgKTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fSBlbHNlIGlmICggJCggd2NhcGZfcGFyYW1zLnNob3BfbG9vcF9jb250YWluZXIgKS5sZW5ndGggKSB7XG5cdFx0XHRcdFx0XHRcdGlmICggJHNob3BMb29wQ29udGFpbmVyLmxlbmd0aCApIHtcblx0XHRcdFx0XHRcdFx0XHQkKCB3Y2FwZl9wYXJhbXMuc2hvcF9sb29wX2NvbnRhaW5lciApLmh0bWwoICRzaG9wTG9vcENvbnRhaW5lci5odG1sKCkgKTtcblx0XHRcdFx0XHRcdFx0fSBlbHNlIGlmICggJG5vdEZvdW5kQ29udGFpbmVyLmxlbmd0aCApIHtcblx0XHRcdFx0XHRcdFx0XHQkKCB3Y2FwZl9wYXJhbXMuc2hvcF9sb29wX2NvbnRhaW5lciApLmh0bWwoICRub3RGb3VuZENvbnRhaW5lci5odG1sKCkgKTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdHdjYXBmQWZ0ZXJVcGRhdGUoKTtcblxuXHRcdFx0XHRcdC8vIHRvZG9cblx0XHRcdFx0XHQvLyByZWluaXRpYWxpemUgb3JkZXJpbmdcblx0XHRcdFx0XHQvLyB3Y2FwZkluaXRPcmRlcigpO1xuXG5cdFx0XHRcdFx0Ly8gdG9kb1xuXHRcdFx0XHRcdC8vIHJlaW5pdGlhbGl6ZSBkcm9wZG93biBmaWx0ZXJcblx0XHRcdFx0XHQvLyB3Y2FwZkRyb3BEb3duRmlsdGVyKCk7XG5cblx0XHRcdFx0XHQvLyBydW4gc2NyaXB0cyBhZnRlciBzaG9wIGxvb3AgdW5kYXRlZFxuXHRcdFx0XHRcdGlmICggdHlwZW9mIHdjYXBmX3BhcmFtcy5jdXN0b21fc2NyaXB0cyAhPT0gJ3VuZGVmaW5lZCcgJiYgd2NhcGZfcGFyYW1zLmN1c3RvbV9zY3JpcHRzLmxlbmd0aCA+IDAgKSB7XG5cdFx0XHRcdFx0XHRldmFsKCB3Y2FwZl9wYXJhbXMuY3VzdG9tX3NjcmlwdHMgKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdCk7XG5cdFx0fVxuXG5cdFx0Ly8gVVJMIFBhcnNlclxuXHRcdGZ1bmN0aW9uIHdjYXBmR2V0VXJsVmFycyggdXJsICkge1xuXHRcdFx0bGV0IHZhcnMgPSB7fSwgaGFzaDtcblxuXHRcdFx0aWYgKCB0eXBlb2YgdXJsID09PSAndW5kZWZpbmVkJyApIHtcblx0XHRcdFx0dXJsID0gd2luZG93LmxvY2F0aW9uLmhyZWY7XG5cdFx0XHR9XG5cblx0XHRcdHVybCA9IHVybC5yZXBsYWNlQWxsKCAnJTJDJywgJywnICk7XG5cblx0XHRcdGNvbnN0IGhhc2hlcyAgPSB1cmwuc2xpY2UoIHVybC5pbmRleE9mKCAnPycgKSArIDEgKS5zcGxpdCggJyYnICk7XG5cdFx0XHRjb25zdCBoTGVuZ3RoID0gaGFzaGVzLmxlbmd0aDtcblxuXHRcdFx0Zm9yICggbGV0IGkgPSAwOyBpIDwgaExlbmd0aDsgaSsrICkge1xuXHRcdFx0XHRoYXNoID0gaGFzaGVzWyBpIF0uc3BsaXQoICc9JyApO1xuXG5cdFx0XHRcdHZhcnNbIGhhc2hbIDAgXSBdID0gaGFzaFsgMSBdO1xuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gdmFycztcblx0XHR9XG5cblx0XHQvLyBldmVyeXRpbWUgd2UgYXBwbHkgdGhlIGZpbHRlciB3ZSBzZXQgdGhlIGN1cnJlbnQgcGFnZSB0byAxXG5cdFx0ZnVuY3Rpb24gd2NhcGZGaXhQYWdpbmF0aW9uKCkge1xuXHRcdFx0bGV0IHVybCAgICAgICAgICAgICAgICA9IHdpbmRvdy5sb2NhdGlvbi5ocmVmO1xuXHRcdFx0Y29uc3QgcGFyYW1zICAgICAgICAgICA9IHdjYXBmR2V0VXJsVmFycyggdXJsICk7XG5cdFx0XHRjb25zdCBjdXJyZW50UGFnZUluVXJsID0gcGFyc2VJbnQoIHVybC5yZXBsYWNlKCAvLitcXC9wYWdlXFwvKFxcZCspKy8sICckMScgKSApO1xuXG5cdFx0XHRpZiAoIGN1cnJlbnRQYWdlSW5VcmwgKSB7XG5cdFx0XHRcdGlmICggY3VycmVudFBhZ2VJblVybCA+IDEgKSB7XG5cdFx0XHRcdFx0dXJsID0gdXJsLnJlcGxhY2UoIC9wYWdlXFwvKFxcZCspLywgJ3BhZ2UvMScgKTtcblx0XHRcdFx0fVxuXHRcdFx0fSBlbHNlIGlmICggdHlwZW9mIHBhcmFtc1sgJ3BhZ2VkJyBdICE9PSAndW5kZWZpbmVkJyApIHtcblx0XHRcdFx0Y29uc3QgY3VycmVudFBhZ2VJblBhcmFtcyA9IHBhcnNlSW50KCBwYXJhbXNbICdwYWdlZCcgXSApO1xuXG5cdFx0XHRcdGlmICggY3VycmVudFBhZ2VJblBhcmFtcyA+IDEgKSB7XG5cdFx0XHRcdFx0dXJsID0gdXJsLnJlcGxhY2UoICdwYWdlZD0nICsgY3VycmVudFBhZ2VJblBhcmFtcywgJ3BhZ2VkPTEnICk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuIHVybDtcblx0XHR9XG5cblx0XHQvLyB1cGRhdGUgcXVlcnkgc3RyaW5nIGZvciBjYXRlZ29yaWVzLCBtZXRhIGV0Yy4uXG5cdFx0ZnVuY3Rpb24gd2NhcGZVcGRhdGVRdWVyeVN0cmluZ1BhcmFtZXRlcigga2V5LCB2YWx1ZSwgcHVzaEhpc3RvcnksIHVybCApIHtcblx0XHRcdGlmICggdHlwZW9mIHB1c2hIaXN0b3J5ID09PSAndW5kZWZpbmVkJyApIHtcblx0XHRcdFx0cHVzaEhpc3RvcnkgPSB0cnVlO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAoIHR5cGVvZiB1cmwgPT09ICd1bmRlZmluZWQnICkge1xuXHRcdFx0XHR1cmwgPSB3Y2FwZkZpeFBhZ2luYXRpb24oKTtcblx0XHRcdH1cblxuXHRcdFx0Y29uc3QgcmUgICAgICAgID0gbmV3IFJlZ0V4cCggJyhbPyZdKScgKyBrZXkgKyAnPS4qPygmfCQpJywgJ2knICk7XG5cdFx0XHRjb25zdCBzZXBhcmF0b3IgPSB1cmwuaW5kZXhPZiggJz8nICkgIT09IC0xID8gJyYnIDogJz8nO1xuXHRcdFx0bGV0IHVybFdpdGhRdWVyeTtcblxuXHRcdFx0aWYgKCB1cmwubWF0Y2goIHJlICkgKSB7XG5cdFx0XHRcdHVybFdpdGhRdWVyeSA9IHVybC5yZXBsYWNlKCByZSwgJyQxJyArIGtleSArICc9JyArIHZhbHVlICsgJyQyJyApO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0dXJsV2l0aFF1ZXJ5ID0gdXJsICsgc2VwYXJhdG9yICsga2V5ICsgJz0nICsgdmFsdWU7XG5cdFx0XHR9XG5cblx0XHRcdGlmICggcHVzaEhpc3RvcnkgPT09IHRydWUgKSB7XG5cdFx0XHRcdHJldHVybiBoaXN0b3J5LnB1c2hTdGF0ZSgge30sICcnLCB1cmxXaXRoUXVlcnkgKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHJldHVybiB1cmxXaXRoUXVlcnk7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0Ly8gcmVtb3ZlIHBhcmFtZXRlciBmcm9tIHVybFxuXHRcdGZ1bmN0aW9uIHdjYXBmUmVtb3ZlUXVlcnlTdHJpbmdQYXJhbWV0ZXIoIGZpbHRlcktleSwgdXJsICkge1xuXHRcdFx0aWYgKCB0eXBlb2YgdXJsID09PSAndW5kZWZpbmVkJyApIHtcblx0XHRcdFx0dXJsID0gd2NhcGZGaXhQYWdpbmF0aW9uKCk7XG5cdFx0XHR9XG5cblx0XHRcdGNvbnN0IG9sZFBhcmFtcyAgICAgICAgID0gd2NhcGZHZXRVcmxWYXJzKCB1cmwgKTtcblx0XHRcdGNvbnN0IG9sZFBhcmFtc0xlbmd0aCAgID0gT2JqZWN0LmtleXMoIG9sZFBhcmFtcyApLmxlbmd0aDtcblx0XHRcdGNvbnN0IHN0YXJ0UG9zaXRpb24gICAgID0gdXJsLmluZGV4T2YoICc/JyApO1xuXHRcdFx0Y29uc3QgZmlsdGVyS2V5UG9zaXRpb24gPSB1cmwuaW5kZXhPZiggZmlsdGVyS2V5ICk7XG5cdFx0XHRsZXQgY2xlYW5VcmwsIGNsZWFuUXVlcnk7XG5cblx0XHRcdGlmICggb2xkUGFyYW1zTGVuZ3RoID4gMSApIHtcblx0XHRcdFx0aWYgKCAoIGZpbHRlcktleVBvc2l0aW9uIC0gc3RhcnRQb3NpdGlvbiApID4gMSApIHtcblx0XHRcdFx0XHRjbGVhblVybCA9IHVybC5yZXBsYWNlKCAnJicgKyBmaWx0ZXJLZXkgKyAnPScgKyBvbGRQYXJhbXNbIGZpbHRlcktleSBdLCAnJyApO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdGNsZWFuVXJsID0gdXJsLnJlcGxhY2UoIGZpbHRlcktleSArICc9JyArIG9sZFBhcmFtc1sgZmlsdGVyS2V5IF0gKyAnJicsICcnICk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRjb25zdCBuZXdQYXJhbXMgPSBjbGVhblVybC5zcGxpdCggJz8nICk7XG5cdFx0XHRcdGNsZWFuUXVlcnkgICAgICA9ICc/JyArIG5ld1BhcmFtc1sgMSBdO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0Y2xlYW5RdWVyeSA9IHVybC5yZXBsYWNlKCAnPycgKyBmaWx0ZXJLZXkgKyAnPScgKyBvbGRQYXJhbXNbIGZpbHRlcktleSBdLCAnJyApO1xuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gY2xlYW5RdWVyeTtcblx0XHR9XG5cblx0XHQvLyB0YWtlIHRoZSBrZXkgYW5kIHZhbHVlIGFuZCBtYWtlIHF1ZXJ5XG5cdFx0ZnVuY3Rpb24gd2NhcGZNYWtlUGFyYW1ldGVycyggZmlsdGVyS2V5LCBmaWx0ZXJWYWx1ZSwgZm9yY2VSZXJlbmRlciA9IGZhbHNlLCB1cmwgKSB7XG5cdFx0XHRjb25zdCB2YWx1ZVNlcGFyYXRvciA9ICcsJztcblxuXHRcdFx0bGV0IHBhcmFtcywgbmV4dFZhbHVlcywgZW1wdHlWYWx1ZSA9IGZhbHNlO1xuXG5cdFx0XHRpZiAoIHR5cGVvZiB1cmwgIT09ICd1bmRlZmluZWQnICkge1xuXHRcdFx0XHRwYXJhbXMgPSB3Y2FwZkdldFVybFZhcnMoIHVybCApO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0cGFyYW1zID0gd2NhcGZHZXRVcmxWYXJzKCk7XG5cdFx0XHR9XG5cblx0XHRcdGlmICggdHlwZW9mIHBhcmFtc1sgZmlsdGVyS2V5IF0gIT0gJ3VuZGVmaW5lZCcgKSB7XG5cdFx0XHRcdGNvbnN0IHByZXZWYWx1ZXMgICAgICA9IHBhcmFtc1sgZmlsdGVyS2V5IF07XG5cdFx0XHRcdGNvbnN0IHByZXZWYWx1ZXNBcnJheSA9IHByZXZWYWx1ZXMuc3BsaXQoIHZhbHVlU2VwYXJhdG9yICk7XG5cblx0XHRcdFx0aWYgKCBwcmV2VmFsdWVzLmxlbmd0aCA+IDAgKSB7XG5cdFx0XHRcdFx0Y29uc3QgZm91bmQgPSAkLmluQXJyYXkoIGZpbHRlclZhbHVlLCBwcmV2VmFsdWVzQXJyYXkgKTtcblxuXHRcdFx0XHRcdGlmICggZm91bmQgPj0gMCApIHtcblx0XHRcdFx0XHRcdC8vIEVsZW1lbnQgd2FzIGZvdW5kLCByZW1vdmUgaXQuXG5cdFx0XHRcdFx0XHRwcmV2VmFsdWVzQXJyYXkuc3BsaWNlKCBmb3VuZCwgMSApO1xuXG5cdFx0XHRcdFx0XHRpZiAoIHByZXZWYWx1ZXNBcnJheS5sZW5ndGggPT09IDAgKSB7XG5cdFx0XHRcdFx0XHRcdGVtcHR5VmFsdWUgPSB0cnVlO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHQvLyBFbGVtZW50IHdhcyBub3QgZm91bmQsIGFkZCBpdC5cblx0XHRcdFx0XHRcdHByZXZWYWx1ZXNBcnJheS5wdXNoKCBmaWx0ZXJWYWx1ZSApO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdGlmICggcHJldlZhbHVlc0FycmF5Lmxlbmd0aCA+IDEgKSB7XG5cdFx0XHRcdFx0XHRuZXh0VmFsdWVzID0gcHJldlZhbHVlc0FycmF5LmpvaW4oIHZhbHVlU2VwYXJhdG9yICk7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdG5leHRWYWx1ZXMgPSBwcmV2VmFsdWVzQXJyYXk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdG5leHRWYWx1ZXMgPSBmaWx0ZXJWYWx1ZTtcblx0XHRcdFx0fVxuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0bmV4dFZhbHVlcyA9IGZpbHRlclZhbHVlO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyB1cGRhdGUgdXJsIGFuZCBxdWVyeSBzdHJpbmdcblx0XHRcdGlmICggISBlbXB0eVZhbHVlICkge1xuXHRcdFx0XHR3Y2FwZlVwZGF0ZVF1ZXJ5U3RyaW5nUGFyYW1ldGVyKCBmaWx0ZXJLZXksIG5leHRWYWx1ZXMgKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGNvbnN0IHF1ZXJ5ID0gd2NhcGZSZW1vdmVRdWVyeVN0cmluZ1BhcmFtZXRlciggZmlsdGVyS2V5ICk7XG5cdFx0XHRcdGhpc3RvcnkucHVzaFN0YXRlKCB7fSwgJycsIHF1ZXJ5ICk7XG5cdFx0XHR9XG5cblx0XHRcdC8vIGZpbHRlciBwcm9kdWN0c1xuXHRcdFx0d2NhcGZGaWx0ZXJQcm9kdWN0cyggZm9yY2VSZXJlbmRlciApO1xuXHRcdH1cblxuXHRcdGZ1bmN0aW9uIHdjYXBmU2luZ2xlRmlsdGVyKCBmaWx0ZXJLZXksIGZpbHRlclZhbHVlICkge1xuXHRcdFx0Y29uc3QgcGFyYW1zID0gd2NhcGZHZXRVcmxWYXJzKCk7XG5cdFx0XHRsZXQgcXVlcnk7XG5cblx0XHRcdGlmICggdHlwZW9mIHBhcmFtc1sgZmlsdGVyS2V5IF0gIT09ICd1bmRlZmluZWQnICYmIHBhcmFtc1sgZmlsdGVyS2V5IF0gPT09IGZpbHRlclZhbHVlICkge1xuXHRcdFx0XHRxdWVyeSA9IHdjYXBmUmVtb3ZlUXVlcnlTdHJpbmdQYXJhbWV0ZXIoIGZpbHRlcktleSApO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0cXVlcnkgPSB3Y2FwZlVwZGF0ZVF1ZXJ5U3RyaW5nUGFyYW1ldGVyKCBmaWx0ZXJLZXksIGZpbHRlclZhbHVlLCBmYWxzZSApO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyB1cGRhdGUgdXJsXG5cdFx0XHRoaXN0b3J5LnB1c2hTdGF0ZSgge30sICcnLCBxdWVyeSApO1xuXG5cdFx0XHQvLyBmaWx0ZXIgcHJvZHVjdHNcblx0XHRcdHdjYXBmRmlsdGVyUHJvZHVjdHMoKTtcblx0XHR9XG5cblx0XHQvLyBUaGUgbWFpbiBmdW5jdGlvbiB0byBoYW5kbGUgdGhlIGZpbHRlciByZXF1ZXN0XG5cdFx0ZnVuY3Rpb24gaGFuZGxlRmlsdGVyUmVxdWVzdCggJGl0ZW0sIGZpbHRlclZhbHVlICkge1xuXHRcdFx0Y29uc3QgJGZpZWxkICAgICAgICAgPSAkaXRlbS5jbG9zZXN0KCAnLndjYXBmLXNpbmdsZS1maWx0ZXInICk7XG5cdFx0XHRjb25zdCBmaWVsZElEICAgICAgICA9ICRmaWVsZC5hdHRyKCAnZGF0YS1pZCcgKTtcblx0XHRcdGNvbnN0IGZpZWxkRGF0YSAgICAgID0gZmllbGRzWyBmaWVsZElEIF07XG5cdFx0XHRjb25zdCBmaWx0ZXJLZXkgICAgICA9IGZpZWxkRGF0YS5maWx0ZXJLZXk7XG5cdFx0XHRjb25zdCBtdWx0aXBsZUZpbHRlciA9IGZpZWxkRGF0YS5tdWx0aXBsZUZpbHRlcjtcblxuXHRcdFx0aWYgKCAhIGZpbHRlcktleSApIHtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAoICEgZmlsdGVyVmFsdWUubGVuZ3RoICkge1xuXHRcdFx0XHRjb25zdCBxdWVyeSA9IHdjYXBmUmVtb3ZlUXVlcnlTdHJpbmdQYXJhbWV0ZXIoIGZpbHRlcktleSApO1xuXHRcdFx0XHRoaXN0b3J5LnB1c2hTdGF0ZSgge30sICcnLCBxdWVyeSApO1xuXG5cdFx0XHRcdC8vIGZpbHRlciBwcm9kdWN0c1xuXHRcdFx0XHR3Y2FwZkZpbHRlclByb2R1Y3RzKCk7XG5cblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAoIG11bHRpcGxlRmlsdGVyICkge1xuXHRcdFx0XHR3Y2FwZk1ha2VQYXJhbWV0ZXJzKCBmaWx0ZXJLZXksIGZpbHRlclZhbHVlICk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHR3Y2FwZlNpbmdsZUZpbHRlciggZmlsdGVyS2V5LCBmaWx0ZXJWYWx1ZSApO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdC8vIGhhbmRsZSB0aGUgZmlsdGVyIHJlcXVlc3QgZm9yIGxpc3QgZmllbGRzXG5cdFx0JHdjYXBmTmF2RmlsdGVycy5vbihcblx0XHRcdCdjaGFuZ2UnLFxuXHRcdFx0Jy53Y2FwZi1sYXllcmVkLW5hdiBbdHlwZT1cImNoZWNrYm94XCJdLCAud2NhcGYtbGF5ZXJlZC1uYXYgW3R5cGU9XCJyYWRpb1wiXScsXG5cdFx0XHRmdW5jdGlvbiggZXZlbnQgKSB7XG5cdFx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cblx0XHRcdFx0Y29uc3QgJGl0ZW0gICAgICAgPSAkKCB0aGlzICk7XG5cdFx0XHRcdGNvbnN0IGZpbHRlclZhbHVlID0gJGl0ZW0udmFsKCk7XG5cblx0XHRcdFx0aGFuZGxlRmlsdGVyUmVxdWVzdCggJGl0ZW0sIGZpbHRlclZhbHVlICk7XG5cdFx0XHR9XG5cdFx0KTtcblxuXHRcdC8vIFRPRE86IFVzZSBhIGNvbWJpbmF0aW9uIG9mIGxhYmVsLCBjaGVja2JveCBhbmQgcmFkaW9cblx0XHQvLyBoYW5kbGUgdGhlIGZpbHRlciByZXF1ZXN0IGZvciBsYWJlbGVkIGl0ZW1cblx0XHQkd2NhcGZOYXZGaWx0ZXJzLm9uKFxuXHRcdFx0J2NsaWNrJyxcblx0XHRcdCcud2NhcGYtbGFiZWxlZC1uYXYgLml0ZW0nLFxuXHRcdFx0ZnVuY3Rpb24oIGV2ZW50ICkge1xuXHRcdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXG5cdFx0XHRcdGNvbnN0ICRpdGVtICAgICAgID0gJCggdGhpcyApO1xuXHRcdFx0XHRjb25zdCBmaWx0ZXJWYWx1ZSA9ICRpdGVtLmF0dHIoICdkYXRhLXZhbHVlJyApO1xuXG5cdFx0XHRcdGhhbmRsZUZpbHRlclJlcXVlc3QoICRpdGVtLCBmaWx0ZXJWYWx1ZSApO1xuXHRcdFx0fVxuXHRcdCk7XG5cblx0XHQvLyBoYW5kbGUgdGhlIGZpbHRlciByZXF1ZXN0IGZvciBkaXNwbGF5IHR5cGUgc2VsZWN0IGZpZWxkc1xuXHRcdCR3Y2FwZk5hdkZpbHRlcnMub24oXG5cdFx0XHQnY2hhbmdlJyxcblx0XHRcdCdzZWxlY3QnLFxuXHRcdFx0ZnVuY3Rpb24oIGV2ZW50ICkge1xuXHRcdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXG5cdFx0XHRcdGNvbnN0ICRpdGVtICAgICAgID0gJCggdGhpcyApO1xuXHRcdFx0XHRjb25zdCBmaWx0ZXJWYWx1ZSA9ICRpdGVtLnZhbCgpO1xuXG5cdFx0XHRcdGNvbnN0ICRmaWVsZCAgICA9ICRpdGVtLmNsb3Nlc3QoICcud2NhcGYtc2luZ2xlLWZpbHRlcicgKTtcblx0XHRcdFx0Y29uc3QgZmllbGRJRCAgID0gJGZpZWxkLmF0dHIoICdkYXRhLWlkJyApO1xuXHRcdFx0XHRjb25zdCBmaWVsZERhdGEgPSBmaWVsZHNbIGZpZWxkSUQgXTtcblx0XHRcdFx0Y29uc3QgZmlsdGVyS2V5ID0gZmllbGREYXRhLmZpbHRlcktleTtcblxuXHRcdFx0XHRpZiAoICEgZmlsdGVyVmFsdWUubGVuZ3RoICkge1xuXHRcdFx0XHRcdGNvbnN0IHF1ZXJ5ID0gd2NhcGZSZW1vdmVRdWVyeVN0cmluZ1BhcmFtZXRlciggZmlsdGVyS2V5ICk7XG5cdFx0XHRcdFx0aGlzdG9yeS5wdXNoU3RhdGUoIHt9LCAnJywgcXVlcnkgKTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRjb25zdCBmaWx0ZXJWYWxTdHJpbmcgPSBmaWx0ZXJWYWx1ZS50b1N0cmluZygpO1xuXHRcdFx0XHRcdHdjYXBmVXBkYXRlUXVlcnlTdHJpbmdQYXJhbWV0ZXIoIGZpbHRlcktleSwgZmlsdGVyVmFsU3RyaW5nICk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHQvLyBmaWx0ZXIgcHJvZHVjdHNcblx0XHRcdFx0d2NhcGZGaWx0ZXJQcm9kdWN0cygpO1xuXHRcdFx0fVxuXHRcdCk7XG5cblx0XHQvLyBoYW5kbGUgdGhlIGZpbHRlciByZXF1ZXN0IGZvciByYW5nZSBudW1iZXJcblx0XHQkd2NhcGZOdW1iZXJSYW5nZUZpbHRlcnMub24oXG5cdFx0XHQnaW5wdXQnLFxuXHRcdFx0Jy53Y2FwZi1yYW5nZS1udW1iZXIgLm1pbi12YWx1ZSwgLndjYXBmLXJhbmdlLW51bWJlciAubWF4LXZhbHVlJyxcblx0XHRcdGZ1bmN0aW9uKCBldmVudCApIHtcblx0XHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcblxuXHRcdFx0XHRjb25zdCAkaXRlbSA9ICQoIHRoaXMgKTtcblxuXHRcdFx0XHQvLyBDbGVhciBhbnkgcHJldmlvdXNseSBzZXQgdGltZXIgYmVmb3JlIHNldHRpbmcgYSBmcmVzaCBvbmVcblx0XHRcdFx0Y2xlYXJUaW1lb3V0KCAkaXRlbS5kYXRhKCAndGltZXInICkgKTtcblxuXHRcdFx0XHQkaXRlbS5kYXRhKCAndGltZXInLCBzZXRUaW1lb3V0KCBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHQkaXRlbS5yZW1vdmVEYXRhKCAndGltZXInICk7XG5cblx0XHRcdFx0XHRjb25zdCAkcmFuZ2VOdW1iZXIgID0gJGl0ZW0uY2xvc2VzdCggJy53Y2FwZi1yYW5nZS1udW1iZXInICk7XG5cdFx0XHRcdFx0Y29uc3QgZmlsdGVyS2V5ICAgICA9ICRyYW5nZU51bWJlci5hdHRyKCAnZGF0YS1maWx0ZXIta2V5JyApO1xuXHRcdFx0XHRcdGNvbnN0IHJhbmdlTWluVmFsdWUgPSAkcmFuZ2VOdW1iZXIuYXR0ciggJ2RhdGEtcmFuZ2UtbWluLXZhbHVlJyApO1xuXHRcdFx0XHRcdGNvbnN0IHJhbmdlTWF4VmFsdWUgPSAkcmFuZ2VOdW1iZXIuYXR0ciggJ2RhdGEtcmFuZ2UtbWF4LXZhbHVlJyApO1xuXHRcdFx0XHRcdGxldCBtaW5WYWx1ZSAgICAgICAgPSAkcmFuZ2VOdW1iZXIuZmluZCggJy5taW4tdmFsdWUnICkudmFsKCk7XG5cdFx0XHRcdFx0bGV0IG1heFZhbHVlICAgICAgICA9ICRyYW5nZU51bWJlci5maW5kKCAnLm1heC12YWx1ZScgKS52YWwoKTtcblxuXHRcdFx0XHRcdC8vIEZvcmNlIHRoZSBtaW5WYWx1ZSBub3QgdG8gYmUgZW1wdHkuXG5cdFx0XHRcdFx0aWYgKCAhIG1pblZhbHVlLmxlbmd0aCApIHtcblx0XHRcdFx0XHRcdG1pblZhbHVlID0gcmFuZ2VNaW5WYWx1ZTtcblxuXHRcdFx0XHRcdFx0JHJhbmdlTnVtYmVyLmZpbmQoICcubWluLXZhbHVlJyApLnZhbCggbWluVmFsdWUgKTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHQvLyBGb3JjZSB0aGUgbWF4VmFsdWUgbm90IHRvIGJlIGVtcHR5LlxuXHRcdFx0XHRcdGlmICggISBtYXhWYWx1ZS5sZW5ndGggKSB7XG5cdFx0XHRcdFx0XHRtYXhWYWx1ZSA9IHJhbmdlTWF4VmFsdWU7XG5cblx0XHRcdFx0XHRcdCRyYW5nZU51bWJlci5maW5kKCAnLm1heC12YWx1ZScgKS52YWwoIG1heFZhbHVlICk7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0Ly8gRm9yY2UgdGhlIG1pblZhbHVlIG5vdCB0byBnbyBiZWxvdyB0aGUgcmFuZ2VNaW5WYWx1ZS5cblx0XHRcdFx0XHRpZiAoIHBhcnNlRmxvYXQoIG1pblZhbHVlICkgPCBwYXJzZUZsb2F0KCByYW5nZU1pblZhbHVlICkgKSB7XG5cdFx0XHRcdFx0XHRtaW5WYWx1ZSA9IHJhbmdlTWluVmFsdWU7XG5cblx0XHRcdFx0XHRcdCRyYW5nZU51bWJlci5maW5kKCAnLm1pbi12YWx1ZScgKS52YWwoIG1pblZhbHVlICk7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0Ly8gRm9yY2UgdGhlIG1pblZhbHVlIG5vdCB0byBnbyB1cCB0aGUgcmFuZ2VNYXhWYWx1ZS5cblx0XHRcdFx0XHRpZiAoIHBhcnNlRmxvYXQoIG1pblZhbHVlICkgPiBwYXJzZUZsb2F0KCByYW5nZU1heFZhbHVlICkgKSB7XG5cdFx0XHRcdFx0XHRtaW5WYWx1ZSA9IHJhbmdlTWF4VmFsdWU7XG5cblx0XHRcdFx0XHRcdCRyYW5nZU51bWJlci5maW5kKCAnLm1pbi12YWx1ZScgKS52YWwoIG1pblZhbHVlICk7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0Ly8gRm9yY2UgdGhlIG1heFZhbHVlIG5vdCB0byBnbyB1cCB0aGUgcmFuZ2VNYXhWYWx1ZS5cblx0XHRcdFx0XHRpZiAoIHBhcnNlRmxvYXQoIG1heFZhbHVlICkgPiBwYXJzZUZsb2F0KCByYW5nZU1heFZhbHVlICkgKSB7XG5cdFx0XHRcdFx0XHRtYXhWYWx1ZSA9IHJhbmdlTWF4VmFsdWU7XG5cblx0XHRcdFx0XHRcdCRyYW5nZU51bWJlci5maW5kKCAnLm1heC12YWx1ZScgKS52YWwoIG1heFZhbHVlICk7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0Ly8gRm9yY2UgdGhlIG1heFZhbHVlIG5vdCB0byBnbyBiZWxvdyB0aGUgbWluVmFsdWUuXG5cdFx0XHRcdFx0aWYgKCBwYXJzZUZsb2F0KCBtaW5WYWx1ZSApID4gcGFyc2VGbG9hdCggbWF4VmFsdWUgKSApIHtcblx0XHRcdFx0XHRcdG1heFZhbHVlID0gbWluVmFsdWU7XG5cblx0XHRcdFx0XHRcdCRyYW5nZU51bWJlci5maW5kKCAnLm1heC12YWx1ZScgKS52YWwoIG1heFZhbHVlICk7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0aWYgKCBtaW5WYWx1ZSA9PT0gcmFuZ2VNaW5WYWx1ZSAmJiBtYXhWYWx1ZSA9PT0gcmFuZ2VNYXhWYWx1ZSApIHtcblx0XHRcdFx0XHRcdGNvbnN0IHF1ZXJ5ID0gd2NhcGZSZW1vdmVRdWVyeVN0cmluZ1BhcmFtZXRlciggZmlsdGVyS2V5ICk7XG5cdFx0XHRcdFx0XHRoaXN0b3J5LnB1c2hTdGF0ZSgge30sICcnLCBxdWVyeSApO1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRjb25zdCBmaWx0ZXJWYWxTdHJpbmcgPSBtaW5WYWx1ZSArIHJhbmdlVmFsdWVzU2VwYXJhdG9yICsgbWF4VmFsdWU7XG5cdFx0XHRcdFx0XHR3Y2FwZlVwZGF0ZVF1ZXJ5U3RyaW5nUGFyYW1ldGVyKCBmaWx0ZXJLZXksIGZpbHRlclZhbFN0cmluZyApO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdC8vIGZpbHRlciBwcm9kdWN0c1xuXHRcdFx0XHRcdHdjYXBmRmlsdGVyUHJvZHVjdHMoKTtcblx0XHRcdFx0fSwgZGVsYXkgKSApO1xuXHRcdFx0fVxuXHRcdCk7XG5cblx0XHQvLyBoYW5kbGUgcmVtb3ZpbmcgdGhlIGFjdGl2ZSBmaWx0ZXJzXG5cdFx0JHdjYXBmTmF2RmlsdGVycy5vbihcblx0XHRcdCdjbGljaycsXG5cdFx0XHQnLndjYXBmLWFjdGl2ZS1maWx0ZXJzIC5pdGVtJyxcblx0XHRcdGZ1bmN0aW9uKCBldmVudCApIHtcblx0XHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcblxuXHRcdFx0XHRjb25zdCAkaXRlbSAgICAgICA9ICQoIHRoaXMgKTtcblx0XHRcdFx0Y29uc3QgZmlsdGVyS2V5ICAgPSAkaXRlbS5hdHRyKCAnZGF0YS1maWx0ZXIta2V5JyApO1xuXHRcdFx0XHRjb25zdCBmaWx0ZXJWYWx1ZSA9ICRpdGVtLmF0dHIoICdkYXRhLXZhbHVlJyApO1xuXG5cdFx0XHRcdHdjYXBmTWFrZVBhcmFtZXRlcnMoIGZpbHRlcktleSwgZmlsdGVyVmFsdWUsIHRydWUgKTtcblx0XHRcdH1cblx0XHQpO1xuXG5cdFx0ZnVuY3Rpb24gcmVzZXRGaWx0ZXJzKCAkYnV0dG9uICkge1xuXHRcdFx0Y29uc3QgX2ZpbHRlcktleXMgPSAkYnV0dG9uLmF0dHIoICdkYXRhLWtleXMnICk7XG5cblx0XHRcdGlmICggISBfZmlsdGVyS2V5cyApIHtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXG5cdFx0XHRjb25zdCBmaWx0ZXJLZXlzID0gX2ZpbHRlcktleXMuc3BsaXQoICcsJyApO1xuXG5cdFx0XHRsZXQgcXVlcnkgPSAnJztcblxuXHRcdFx0JC5lYWNoKCBmaWx0ZXJLZXlzLCBmdW5jdGlvbiggaSwgZmlsdGVyS2V5ICkge1xuXHRcdFx0XHRpZiAoIHF1ZXJ5ICkge1xuXHRcdFx0XHRcdHF1ZXJ5ID0gd2NhcGZSZW1vdmVRdWVyeVN0cmluZ1BhcmFtZXRlciggZmlsdGVyS2V5LCBxdWVyeSApO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdHF1ZXJ5ID0gd2NhcGZSZW1vdmVRdWVyeVN0cmluZ1BhcmFtZXRlciggZmlsdGVyS2V5ICk7XG5cdFx0XHRcdH1cblx0XHRcdH0gKTtcblxuXHRcdFx0Ly8gRW1wdHkgcXVlcnkgY2F1c2VzIGlzc3VlKGRvZXNuJ3QgcmVtb3ZlIHRoZSBmaWx0ZXIga2V5cyBmcm9tIHRoZSB1cmwpLFxuXHRcdFx0Ly8gdGhpcyBpcyB3aHkgd2UgYXJlIHNldHRpbmcgdGhlIHBhZ2UgdXJsIGFzIHF1ZXJ5LlxuXHRcdFx0aWYgKCAhIHF1ZXJ5ICkge1xuXHRcdFx0XHRjb25zdCBwcmV2VXJsID0gd2luZG93LmxvY2F0aW9uLmhyZWY7XG5cdFx0XHRcdGNvbnN0IG5ld1VybCAgPSBwcmV2VXJsLnNwbGl0KCAnPycgKTtcblxuXHRcdFx0XHRxdWVyeSA9IG5ld1VybFsgMCBdO1xuXHRcdFx0fVxuXG5cdFx0XHRoaXN0b3J5LnB1c2hTdGF0ZSgge30sICcnLCBxdWVyeSApO1xuXG5cdFx0XHQvLyBmaWx0ZXIgcHJvZHVjdHNcblx0XHRcdHdjYXBmRmlsdGVyUHJvZHVjdHMoIHRydWUgKTtcblx0XHR9XG5cblx0XHQvLyBjbGVhciBhbGwgZmlsdGVyc1xuXHRcdCR3Y2FwZk5hdkZpbHRlcnMub24oXG5cdFx0XHQnY2xpY2snLFxuXHRcdFx0Jy53Y2FwZi1hY3RpdmUtZmlsdGVycyAud2NhcGYtcmVzZXQtZmlsdGVycy1idG4nLFxuXHRcdFx0ZnVuY3Rpb24oIGV2ZW50ICkge1xuXHRcdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXG5cdFx0XHRcdGNvbnN0ICRidXR0b24gPSAkKCB0aGlzICk7XG5cblx0XHRcdFx0cmVzZXRGaWx0ZXJzKCAkYnV0dG9uICk7XG5cdFx0XHR9XG5cdFx0KTtcblxuXHRcdC8vIHJlc2V0IGZpbHRlcnNcblx0XHQkd2NhcGZOYXZGaWx0ZXJzLm9uKFxuXHRcdFx0J2NsaWNrJyxcblx0XHRcdCcud2NhcGYtcmVzZXQtZmlsdGVycy1idG4nLFxuXHRcdFx0ZnVuY3Rpb24oIGV2ZW50ICkge1xuXHRcdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXG5cdFx0XHRcdGNvbnN0ICRidXR0b24gPSAkKCB0aGlzICk7XG5cblx0XHRcdFx0cmVzZXRGaWx0ZXJzKCAkYnV0dG9uICk7XG5cdFx0XHR9XG5cdFx0KTtcblxuXHRcdGZ1bmN0aW9uIGZpbHRlckJ5RGF0ZSggJGlucHV0ICkge1xuXHRcdFx0Y29uc3QgJHdjYXBmRGF0ZUZpbHRlciA9ICRpbnB1dC5jbG9zZXN0KCAnLndjYXBmLWRhdGUtaW5wdXQnICk7XG5cdFx0XHRjb25zdCBmaWx0ZXJLZXkgICAgICAgID0gJHdjYXBmRGF0ZUZpbHRlci5hdHRyKCAnZGF0YS1maWx0ZXIta2V5JyApO1xuXHRcdFx0Y29uc3QgaXNSYW5nZSAgICAgICAgICA9ICR3Y2FwZkRhdGVGaWx0ZXIuYXR0ciggJ2RhdGEtaXMtcmFuZ2UnICk7XG5cblx0XHRcdGxldCBmaWx0ZXJWYWx1ZSA9ICcnO1xuXHRcdFx0bGV0IHJ1bkZpbHRlciAgID0gZmFsc2U7XG5cblx0XHRcdC8vIENsZWFyIGFueSBwcmV2aW91c2x5IHNldCB0aW1lciBiZWZvcmUgc2V0dGluZyBhIGZyZXNoIG9uZVxuXHRcdFx0Y2xlYXJUaW1lb3V0KCAkd2NhcGZEYXRlRmlsdGVyLmRhdGEoICd0aW1lcicgKSApO1xuXG5cdFx0XHRpZiAoIGlzUmFuZ2UgKSB7XG5cdFx0XHRcdGNvbnN0IGZyb20gPSAkd2NhcGZEYXRlRmlsdGVyLmZpbmQoICcuZGF0ZS1mcm9tLWlucHV0JyApLnZhbCgpO1xuXHRcdFx0XHRjb25zdCB0byAgID0gJHdjYXBmRGF0ZUZpbHRlci5maW5kKCAnLmRhdGUtdG8taW5wdXQnICkudmFsKCk7XG5cblx0XHRcdFx0aWYgKCBmcm9tICYmIHRvICkge1xuXHRcdFx0XHRcdGZpbHRlclZhbHVlID0gZnJvbSArIHJhbmdlVmFsdWVzU2VwYXJhdG9yICsgdG87XG5cdFx0XHRcdFx0cnVuRmlsdGVyICAgPSB0cnVlO1xuXHRcdFx0XHR9IGVsc2UgaWYgKCAhIGZyb20gJiYgISB0byApIHtcblx0XHRcdFx0XHRydW5GaWx0ZXIgPSB0cnVlO1xuXHRcdFx0XHR9XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRjb25zdCBmcm9tID0gJHdjYXBmRGF0ZUZpbHRlci5maW5kKCAnLmRhdGUtZnJvbS1pbnB1dCcgKS52YWwoKTtcblxuXHRcdFx0XHRpZiAoIGZyb20gKSB7XG5cdFx0XHRcdFx0ZmlsdGVyVmFsdWUgPSBmcm9tO1xuXHRcdFx0XHRcdHJ1bkZpbHRlciAgID0gdHJ1ZTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRydW5GaWx0ZXIgPSB0cnVlO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHRcdGlmICggcnVuRmlsdGVyICkge1xuXHRcdFx0XHQkd2NhcGZEYXRlRmlsdGVyLmRhdGEoICd0aW1lcicsIHNldFRpbWVvdXQoIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdCR3Y2FwZkRhdGVGaWx0ZXIucmVtb3ZlRGF0YSggJ3RpbWVyJyApO1xuXG5cdFx0XHRcdFx0aWYgKCBmaWx0ZXJWYWx1ZSApIHtcblx0XHRcdFx0XHRcdHdjYXBmVXBkYXRlUXVlcnlTdHJpbmdQYXJhbWV0ZXIoIGZpbHRlcktleSwgZmlsdGVyVmFsdWUgKTtcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0Y29uc3QgcXVlcnkgPSB3Y2FwZlJlbW92ZVF1ZXJ5U3RyaW5nUGFyYW1ldGVyKCBmaWx0ZXJLZXkgKTtcblx0XHRcdFx0XHRcdGhpc3RvcnkucHVzaFN0YXRlKCB7fSwgJycsIHF1ZXJ5ICk7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0Ly8gZmlsdGVyIHByb2R1Y3RzXG5cdFx0XHRcdFx0d2NhcGZGaWx0ZXJQcm9kdWN0cygpO1xuXHRcdFx0XHR9LCBkZWxheSApICk7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0Ly8gaGlzdG9yeSBiYWNrIGFuZCBmb3J3YXJkIHJlcXVlc3QgaGFuZGxpbmdcblx0XHQkKCB3aW5kb3cgKS5iaW5kKCAncG9wc3RhdGUnLCBmdW5jdGlvbigpIHtcblx0XHRcdC8vIGZpbHRlciBwcm9kdWN0c1xuXHRcdFx0d2NhcGZGaWx0ZXJQcm9kdWN0cyggdHJ1ZSApO1xuXHRcdH0gKTtcblxuXHR9XG4pO1xuIl19
