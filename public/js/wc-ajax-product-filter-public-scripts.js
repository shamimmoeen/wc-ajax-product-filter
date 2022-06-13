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
    var $wrapper = $field.find('.wcapf-field-inner > div');
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

      if ($slider.hasClass('wcapf-noui-target')) {
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
        cssPrefix: 'wcapf-noui-',
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

        $('body').trigger('wcapf-nouislider-update', [$item, values]);
      });

      function filterProductsAccordingToSlider(values) {
        var $body = $('body');
        $body.trigger('wcapf-nouislider-before-filter-products', [$item, values]);
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
        $body.trigger('wcapf-nouislider-after-filter-products', [$item, values]);
      }

      slider.noUiSlider.on('set', function (values) {
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
        var $inner = $field.find('.wcapf-field-inner');

        var _field = $data.find(fieldID);

        var fieldClass = $(_field).attr('class');

        var _html = _field.find('.wcapf-field-inner').html(); // When called from history back or forward request then rerender all fields.


        if (forceReRender) {
          // update class
          $field.attr('class', fieldClass); // update field

          $inner.html(_html);
        } else {
          // Selectively rerender the fields.
          if ($field.hasClass('wcapf-nav-filter')) {
            // update class
            $field.attr('class', fieldClass); // update field

            $inner.html(_html);
          } else {
            // We need to update the fields' classes always.
            $field.attr('class', fieldClass);
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
  }

  $wcapfSingleFilters.on('clear_filter', function () {
    var $field = $(this);
    var fieldID = $field.attr('data-id');
    var fieldData = fields[fieldID];
    var filterKey = fieldData.filterKey;
    var query = wcapfRemoveQueryStringParameter(filterKey);
    history.pushState({}, '', query); // filter products

    wcapfFilterProducts(true);
  }); // history back and forward request handling

  $(window).bind('popstate', function () {
    // filter products
    wcapfFilterProducts(true);
  });
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNob3Nlbi5qcyIsImZpbHRlci1mb3JtLmpzIl0sIm5hbWVzIjpbImpRdWVyeSIsImRvY3VtZW50IiwicmVhZHkiLCIkIiwid2NhcGZfcGFyYW1zIiwicmFuZ2VWYWx1ZXNTZXBhcmF0b3IiLCJfZGVsYXkiLCJwYXJzZUludCIsImZpbHRlcl9pbnB1dF9kZWxheSIsImRlbGF5IiwiZmllbGRzIiwiJHdjYXBmU2luZ2xlRmlsdGVycyIsIiR3Y2FwZk5hdkZpbHRlcnMiLCIkd2NhcGZOdW1iZXJSYW5nZUZpbHRlcnMiLCJlYWNoIiwiJGZpZWxkIiwiaWQiLCJhdHRyIiwiJHdyYXBwZXIiLCJmaW5kIiwiZmlsdGVyS2V5IiwibXVsdGlwbGVGaWx0ZXIiLCJpbml0Q2hvc2VuIiwiY2hvc2VuIiwiJHRoaXMiLCJvcHRpb25zIiwibm9SZXN1bHRzTWVzc2FnZSIsInNlYXJjaFRocmVzaG9sZCIsImNob3Nlbl9saWJfc2VhcmNoX3RocmVzaG9sZCIsImluaXRIaWVyYXJjaHlBY2NvcmRpb24iLCJvbiIsInRvZ2dsZUNsYXNzIiwibnVtYmVyX2Zvcm1hdCIsIm51bWJlciIsImRlY2ltYWxzIiwiZGVjX3BvaW50IiwidGhvdXNhbmRzX3NlcCIsInJlcGxhY2UiLCJuIiwiaXNGaW5pdGUiLCJwcmVjIiwiTWF0aCIsImFicyIsInNlcCIsImRlYyIsInMiLCJ0b0ZpeGVkRml4IiwiayIsInBvdyIsInJvdW5kIiwic3BsaXQiLCJsZW5ndGgiLCJBcnJheSIsImpvaW4iLCJpbml0Tm9VSVNsaWRlciIsIm5vVWlTbGlkZXIiLCIkaXRlbSIsIiRzbGlkZXIiLCJoYXNDbGFzcyIsInNsaWRlcklkIiwiZGlzcGxheVZhbHVlc0FzIiwicmFuZ2VNaW5WYWx1ZSIsInBhcnNlRmxvYXQiLCJyYW5nZU1heFZhbHVlIiwic3RlcCIsImRlY2ltYWxQbGFjZXMiLCJ0aG91c2FuZFNlcGFyYXRvciIsImRlY2ltYWxTZXBhcmF0b3IiLCJtaW5WYWx1ZSIsIm1heFZhbHVlIiwiJG1pblZhbHVlIiwiJG1heFZhbHVlIiwic2xpZGVyIiwiZ2V0RWxlbWVudEJ5SWQiLCJjcmVhdGUiLCJzdGFydCIsImNvbm5lY3QiLCJjc3NQcmVmaXgiLCJyYW5nZSIsInZhbHVlcyIsImh0bWwiLCJ2YWwiLCJ0cmlnZ2VyIiwiZmlsdGVyUHJvZHVjdHNBY2NvcmRpbmdUb1NsaWRlciIsIiRib2R5IiwicXVlcnkiLCJ3Y2FwZlJlbW92ZVF1ZXJ5U3RyaW5nUGFyYW1ldGVyIiwiaGlzdG9yeSIsInB1c2hTdGF0ZSIsImZpbHRlclZhbFN0cmluZyIsIndjYXBmVXBkYXRlUXVlcnlTdHJpbmdQYXJhbWV0ZXIiLCJ3Y2FwZkZpbHRlclByb2R1Y3RzIiwiY2xlYXJUaW1lb3V0IiwiZGF0YSIsInNldFRpbWVvdXQiLCJyZW1vdmVEYXRhIiwiZXZlbnQiLCJwcmV2ZW50RGVmYXVsdCIsIiRpbnB1dCIsInNldCIsImdldCIsImluaXREYXRlcGlja2VyIiwiZGF0ZXBpY2tlciIsIiR3Y2FwZkRhdGVGaWx0ZXJzIiwiJHdjYXBmRGF0ZUZpbHRlciIsImZvcm1hdCIsInllYXJEcm9wZG93biIsIm1vbnRoRHJvcGRvd24iLCIkZnJvbSIsIiR0byIsImRhdGVGb3JtYXQiLCJjaGFuZ2VZZWFyIiwiY2hhbmdlTW9udGgiLCJmaWx0ZXJCeURhdGUiLCJ3Y2FwZkJlZm9yZVVwZGF0ZSIsIndjYXBmQWZ0ZXJVcGRhdGUiLCJmb3JjZVJlUmVuZGVyIiwid2luZG93IiwibG9jYXRpb24iLCJocmVmIiwiJGRhdGEiLCIkc2hvcExvb3BDb250YWluZXIiLCJzaG9wX2xvb3BfY29udGFpbmVyIiwiJG5vdEZvdW5kQ29udGFpbmVyIiwibm90X2ZvdW5kX2NvbnRhaW5lciIsImZpZWxkSUQiLCIkaW5uZXIiLCJfZmllbGQiLCJmaWVsZENsYXNzIiwiX2h0bWwiLCJjdXN0b21fc2NyaXB0cyIsImV2YWwiLCJ3Y2FwZkdldFVybFZhcnMiLCJ1cmwiLCJ2YXJzIiwiaGFzaCIsInJlcGxhY2VBbGwiLCJoYXNoZXMiLCJzbGljZSIsImluZGV4T2YiLCJoTGVuZ3RoIiwiaSIsIndjYXBmRml4UGFnaW5hdGlvbiIsInBhcmFtcyIsImN1cnJlbnRQYWdlSW5VcmwiLCJjdXJyZW50UGFnZUluUGFyYW1zIiwia2V5IiwidmFsdWUiLCJwdXNoSGlzdG9yeSIsInJlIiwiUmVnRXhwIiwic2VwYXJhdG9yIiwidXJsV2l0aFF1ZXJ5IiwibWF0Y2giLCJvbGRQYXJhbXMiLCJvbGRQYXJhbXNMZW5ndGgiLCJPYmplY3QiLCJrZXlzIiwic3RhcnRQb3NpdGlvbiIsImZpbHRlcktleVBvc2l0aW9uIiwiY2xlYW5VcmwiLCJjbGVhblF1ZXJ5IiwibmV3UGFyYW1zIiwid2NhcGZNYWtlUGFyYW1ldGVycyIsImZpbHRlclZhbHVlIiwiZm9yY2VSZXJlbmRlciIsInZhbHVlU2VwYXJhdG9yIiwibmV4dFZhbHVlcyIsImVtcHR5VmFsdWUiLCJwcmV2VmFsdWVzIiwicHJldlZhbHVlc0FycmF5IiwiZm91bmQiLCJpbkFycmF5Iiwic3BsaWNlIiwicHVzaCIsIndjYXBmU2luZ2xlRmlsdGVyIiwiaGFuZGxlRmlsdGVyUmVxdWVzdCIsImNsb3Nlc3QiLCJmaWVsZERhdGEiLCJ0b1N0cmluZyIsIiRyYW5nZU51bWJlciIsInJlc2V0RmlsdGVycyIsIiRidXR0b24iLCJfZmlsdGVyS2V5cyIsImZpbHRlcktleXMiLCJwcmV2VXJsIiwibmV3VXJsIiwiaXNSYW5nZSIsInJ1bkZpbHRlciIsImZyb20iLCJ0byIsImJpbmQiXSwibWFwcGluZ3MiOiI7O0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQUEsTUFBTSxDQUFFQyxRQUFGLENBQU4sQ0FBbUJDLEtBQW5CLENBQTBCLFVBQVVDLENBQVYsRUFBYyxDQUl2QyxDQUpEOzs7QUNYQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUEsSUFBTUMsWUFBWSxHQUFHQSxZQUFZLElBQUk7QUFDcEMsd0JBQXNCLEVBRGM7QUFFcEMsaUNBQStCLEVBRks7QUFHcEMseUJBQXVC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MEgsT0FBTyxHQUFLOUcsTUFBTSxDQUFDRSxJQUFQLENBQWEsU0FBYixDQUFsQjtBQUNBLFFBQU1pSyxTQUFTLEdBQUd4SyxNQUFNLENBQUVtSCxPQUFGLENBQXhCO0FBQ0EsUUFBTXpHLFNBQVMsR0FBRzhKLFNBQVMsQ0FBQzlKLFNBQTVCO0FBRUEsUUFBTWlFLEtBQUssR0FBR0MsK0JBQStCLENBQUVsRSxTQUFGLENBQTdDO0FBQ0FtRSxJQUFBQSxPQUFPLENBQUNDLFNBQVIsQ0FBbUIsRUFBbkIsRUFBdUIsRUFBdkIsRUFBMkJILEtBQTNCLEVBUGtELENBU2xEOztBQUNBTSxJQUFBQSxtQkFBbUIsQ0FBRSxJQUFGLENBQW5CO0FBQ0EsR0FYRCxFQWoxQmEsQ0E4MUJiOztBQUNBeEYsRUFBQUEsQ0FBQyxDQUFFa0gsTUFBRixDQUFELENBQVkwRSxJQUFaLENBQWtCLFVBQWxCLEVBQThCLFlBQVc7QUFDeEM7QUFDQXBHLElBQUFBLG1CQUFtQixDQUFFLElBQUYsQ0FBbkI7QUFDQSxHQUhEO0FBS0EsQ0FyMkJGIiwiZmlsZSI6IndjLWFqYXgtcHJvZHVjdC1maWx0ZXItcHVibGljLXNjcmlwdHMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIERpc3BsYXkgdHlwZSBmaWVsZHMuXG4gKlxuICogVE9ETzogTWF5YmUgZGVsZXRlLlxuICpcbiAqIEBzaW5jZSAgICAgIDMuMC4wXG4gKiBAcGFja2FnZSAgICB3Yy1hamF4LXByb2R1Y3QtZmlsdGVyXG4gKiBAc3VicGFja2FnZSB3Yy1hamF4LXByb2R1Y3QtZmlsdGVyL2FkbWluL3NyYy9qc1xuICogQGF1dGhvciAgICAgTWFpbnVsIEhhc3NhbiBNYWluXG4gKi9cblxualF1ZXJ5KCBkb2N1bWVudCApLnJlYWR5KCBmdW5jdGlvbiggJCApIHtcblxuXG5cbn0gKTtcbiIsIi8qKlxuICogVGhlIGZyb250ZW5kIGZpbHRlciBmb3JtLlxuICpcbiAqIEBzaW5jZSAgICAgIDMuMC4wXG4gKiBAcGFja2FnZSAgICB3Yy1hamF4LXByb2R1Y3QtZmlsdGVyXG4gKiBAc3VicGFja2FnZSB3Yy1hamF4LXByb2R1Y3QtZmlsdGVyL3B1YmxpYy9zcmMvanNcbiAqIEBhdXRob3IgICAgIE1haW51bCBIYXNzYW4gTWFpblxuICovXG5cbmNvbnN0IHdjYXBmX3BhcmFtcyA9IHdjYXBmX3BhcmFtcyB8fCB7XG5cdCdmaWx0ZXJfaW5wdXRfZGVsYXknOiAnJyxcblx0J2Nob3Nlbl9saWJfc2VhcmNoX3RocmVzaG9sZCc6ICcnLFxuXHQnc2hvcF9sb29wX2NvbnRhaW5lcic6ICcnLFxuXHQnbm90X2ZvdW5kX2NvbnRhaW5lcic6ICcnLFxuXHQncGFnaW5hdGlvbl9jb250YWluZXInOiAnJywgLy8gdG9kb1xuXHQnc29ydGluZ19jb250cm9sJzogJycsIC8vIHRvZG9cblx0J3Njcm9sbF90b190b3AnOiAnJywgLy8gdG9kb1xuXHQnc2Nyb2xsX3RvX3RvcF9vZmZzZXQnOiAnJywgLy8gdG9kb1xuXHQnY3VzdG9tX3NjcmlwdHMnOiAnJyxcbn07XG5cbmpRdWVyeSggZG9jdW1lbnQgKS5yZWFkeShcblx0ZnVuY3Rpb24oICQgKSB7XG5cblx0XHRjb25zdCByYW5nZVZhbHVlc1NlcGFyYXRvciA9ICd+JztcblxuXHRcdC8vIHJldHVybiBmYWxzZSBpZiB3Y2FwZl9wYXJhbXMgdmFyaWFibGUgaXMgbm90IGZvdW5kXG5cdFx0aWYgKCB0eXBlb2Ygd2NhcGZfcGFyYW1zID09PSAndW5kZWZpbmVkJyApIHtcblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9XG5cblx0XHRjb25zdCBfZGVsYXkgPSBwYXJzZUludCggd2NhcGZfcGFyYW1zLmZpbHRlcl9pbnB1dF9kZWxheSApO1xuXHRcdGNvbnN0IGRlbGF5ICA9IF9kZWxheSA+PSAwID8gX2RlbGF5IDogODAwO1xuXG5cdFx0Ly8gc3RvcmUgZmllbGRzJyBpZCBhbmQgZmlsdGVyIGluZm9ybWF0aW9uXG5cdFx0Y29uc3QgZmllbGRzID0ge307XG5cblx0XHRjb25zdCAkd2NhcGZTaW5nbGVGaWx0ZXJzICAgICAgPSAkKCAnLndjYXBmLXNpbmdsZS1maWx0ZXInICk7XG5cdFx0Y29uc3QgJHdjYXBmTmF2RmlsdGVycyAgICAgICAgID0gJCggJy53Y2FwZi1uYXYtZmlsdGVyJyApO1xuXHRcdGNvbnN0ICR3Y2FwZk51bWJlclJhbmdlRmlsdGVycyA9ICQoICcud2NhcGYtbnVtYmVyLXJhbmdlLWZpbHRlcicgKTtcblxuXHRcdCR3Y2FwZlNpbmdsZUZpbHRlcnMuZWFjaChcblx0XHRcdGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRjb25zdCAkZmllbGQgICAgICAgICA9ICQoIHRoaXMgKTtcblx0XHRcdFx0Y29uc3QgaWQgICAgICAgICAgICAgPSAkZmllbGQuYXR0ciggJ2RhdGEtaWQnICk7XG5cdFx0XHRcdGNvbnN0ICR3cmFwcGVyICAgICAgID0gJGZpZWxkLmZpbmQoICcud2NhcGYtZmllbGQtaW5uZXIgPiBkaXYnICk7XG5cdFx0XHRcdGNvbnN0IGZpbHRlcktleSAgICAgID0gJHdyYXBwZXIuYXR0ciggJ2RhdGEtZmlsdGVyLWtleScgKTtcblx0XHRcdFx0Y29uc3QgbXVsdGlwbGVGaWx0ZXIgPSBwYXJzZUludCggJHdyYXBwZXIuYXR0ciggJ2RhdGEtbXVsdGlwbGUtZmlsdGVyJyApICk7XG5cblx0XHRcdFx0ZmllbGRzWyBpZCBdID0ge1xuXHRcdFx0XHRcdGZpbHRlcktleTogZmlsdGVyS2V5LFxuXHRcdFx0XHRcdG11bHRpcGxlRmlsdGVyOiBtdWx0aXBsZUZpbHRlclxuXHRcdFx0XHR9O1xuXHRcdFx0fVxuXHRcdCk7XG5cblx0XHQvLyBJbml0aWFsaXplIGpRdWVyeSBjaG9zZW4gbGlicmFyeVxuXHRcdGZ1bmN0aW9uIGluaXRDaG9zZW4oKSB7XG5cdFx0XHRpZiAoICEgalF1ZXJ5KCkuY2hvc2VuICkge1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdCR3Y2FwZk5hdkZpbHRlcnMuZmluZCggJy53Y2FwZi1jaG9zZW4tc2VsZWN0JyApLmVhY2goIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRjb25zdCAkdGhpcyAgID0gJCggdGhpcyApO1xuXHRcdFx0XHRjb25zdCBvcHRpb25zID0ge307XG5cblx0XHRcdFx0Y29uc3Qgbm9SZXN1bHRzTWVzc2FnZSA9ICR0aGlzLmF0dHIoICdkYXRhLW5vLXJlc3VsdHMtbWVzc2FnZScgKTtcblxuXHRcdFx0XHRpZiAoIG5vUmVzdWx0c01lc3NhZ2UgKSB7XG5cdFx0XHRcdFx0b3B0aW9uc1sgJ25vX3Jlc3VsdHNfdGV4dCcgXSA9IG5vUmVzdWx0c01lc3NhZ2U7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRjb25zdCBzZWFyY2hUaHJlc2hvbGQgPSBwYXJzZUludCggd2NhcGZfcGFyYW1zLmNob3Nlbl9saWJfc2VhcmNoX3RocmVzaG9sZCApO1xuXG5cdFx0XHRcdGlmICggc2VhcmNoVGhyZXNob2xkICkge1xuXHRcdFx0XHRcdG9wdGlvbnNbICdkaXNhYmxlX3NlYXJjaF90aHJlc2hvbGQnIF0gPSBzZWFyY2hUaHJlc2hvbGQ7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHQkdGhpcy5jaG9zZW4oIG9wdGlvbnMgKTtcblx0XHRcdH0gKTtcblx0XHR9XG5cblx0XHRpbml0Q2hvc2VuKCk7XG5cblx0XHQvLyBJbml0aWFsaXplIGhpZXJhcmNoeSBhY2NvcmRpb25cblx0XHRmdW5jdGlvbiBpbml0SGllcmFyY2h5QWNjb3JkaW9uKCkge1xuXHRcdFx0JHdjYXBmTmF2RmlsdGVycy5maW5kKCAnLmhpZXJhcmNoeS1hY2NvcmRpb24tdG9nZ2xlJyApLm9uKCAnY2xpY2snLCBmdW5jdGlvbigpIHtcblx0XHRcdFx0JCggdGhpcyApLnRvZ2dsZUNsYXNzKCAnYWN0aXZlJyApO1xuXHRcdFx0fSApO1xuXHRcdH1cblxuXHRcdGluaXRIaWVyYXJjaHlBY2NvcmRpb24oKTtcblxuXHRcdC8qKlxuXHRcdCAqIEBzb3VyY2UgaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9hLzM0MTQxODEzXG5cdFx0ICpcblx0XHQgKiBAcGFyYW0gbnVtYmVyXG5cdFx0ICogQHBhcmFtIGRlY2ltYWxzXG5cdFx0ICogQHBhcmFtIGRlY19wb2ludFxuXHRcdCAqIEBwYXJhbSB0aG91c2FuZHNfc2VwXG5cdFx0ICpcblx0XHQgKiBAcmV0dXJucyB7c3RyaW5nfVxuXHRcdCAqL1xuXHRcdGZ1bmN0aW9uIG51bWJlcl9mb3JtYXQoIG51bWJlciwgZGVjaW1hbHMsIGRlY19wb2ludCwgdGhvdXNhbmRzX3NlcCApIHtcblx0XHRcdC8vIFN0cmlwIGFsbCBjaGFyYWN0ZXJzIGJ1dCBudW1lcmljYWwgb25lcy5cblx0XHRcdG51bWJlciA9ICggbnVtYmVyICsgJycgKS5yZXBsYWNlKCAvW15cXGQrXFwtRWUuXS9nLCAnJyApO1xuXG5cdFx0XHRjb25zdCBuICAgID0gISBpc0Zpbml0ZSggK251bWJlciApID8gMCA6ICtudW1iZXI7XG5cdFx0XHRjb25zdCBwcmVjID0gISBpc0Zpbml0ZSggK2RlY2ltYWxzICkgPyAwIDogTWF0aC5hYnMoIGRlY2ltYWxzICk7XG5cdFx0XHRjb25zdCBzZXAgID0gKCB0eXBlb2YgdGhvdXNhbmRzX3NlcCA9PT0gJ3VuZGVmaW5lZCcgKSA/ICcsJyA6IHRob3VzYW5kc19zZXA7XG5cdFx0XHRjb25zdCBkZWMgID0gKCB0eXBlb2YgZGVjX3BvaW50ID09PSAndW5kZWZpbmVkJyApID8gJy4nIDogZGVjX3BvaW50O1xuXG5cdFx0XHRsZXQgcztcblxuXHRcdFx0Y29uc3QgdG9GaXhlZEZpeCA9IGZ1bmN0aW9uKCBuLCBwcmVjICkge1xuXHRcdFx0XHRjb25zdCBrID0gTWF0aC5wb3coIDEwLCBwcmVjICk7XG5cdFx0XHRcdHJldHVybiAnJyArIE1hdGgucm91bmQoIG4gKiBrICkgLyBrO1xuXHRcdFx0fTtcblxuXHRcdFx0Ly8gRml4IGZvciBJRSBwYXJzZUZsb2F0KDAuNTUpLnRvRml4ZWQoMCkgPSAwO1xuXHRcdFx0cyA9ICggcHJlYyA/IHRvRml4ZWRGaXgoIG4sIHByZWMgKSA6ICcnICsgTWF0aC5yb3VuZCggbiApICkuc3BsaXQoICcuJyApO1xuXG5cdFx0XHRpZiAoIHNbIDAgXS5sZW5ndGggPiAzICkge1xuXHRcdFx0XHRzWyAwIF0gPSBzWyAwIF0ucmVwbGFjZSggL1xcQig/PSg/OlxcZHszfSkrKD8hXFxkKSkvZywgc2VwICk7XG5cdFx0XHR9XG5cblx0XHRcdGlmICggKCBzWyAxIF0gfHwgJycgKS5sZW5ndGggPCBwcmVjICkge1xuXHRcdFx0XHRzWyAxIF0gPSBzWyAxIF0gfHwgJyc7XG5cdFx0XHRcdHNbIDEgXSArPSBuZXcgQXJyYXkoIHByZWMgLSBzWyAxIF0ubGVuZ3RoICsgMSApLmpvaW4oICcwJyApO1xuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gcy5qb2luKCBkZWMgKTtcblx0XHR9XG5cblx0XHQvLyBJbml0aWFsaXplIG5vVUlTbGlkZXJcblx0XHRmdW5jdGlvbiBpbml0Tm9VSVNsaWRlcigpIHtcblx0XHRcdGlmICggJ3VuZGVmaW5lZCcgPT09IHR5cGVvZiBub1VpU2xpZGVyICkge1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdCR3Y2FwZk51bWJlclJhbmdlRmlsdGVycy5maW5kKCAnLndjYXBmLXJhbmdlLXNsaWRlcicgKS5lYWNoKCBmdW5jdGlvbigpIHtcblx0XHRcdFx0Y29uc3QgJGl0ZW0gPSAkKCB0aGlzICk7XG5cblx0XHRcdFx0Y29uc3QgZmlsdGVyS2V5ID0gJGl0ZW0uYXR0ciggJ2RhdGEtZmlsdGVyLWtleScgKTtcblx0XHRcdFx0Y29uc3QgJHNsaWRlciAgID0gJGl0ZW0uZmluZCggJy53Y2FwZi1ub3VpLXNsaWRlcicgKTtcblxuXHRcdFx0XHQvLyBJZiBzbGlkZXIgaXMgYWxyZWFkeSBpbml0aWFsaXplZCB0aGVuIGRvbid0IHJlaW5pdGlhbGl6ZSBhZ2Fpbi5cblx0XHRcdFx0aWYgKCAkc2xpZGVyLmhhc0NsYXNzKCAnd2NhcGYtbm91aS10YXJnZXQnICkgKSB7XG5cdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0Y29uc3Qgc2xpZGVySWQgICAgICAgICAgPSAkc2xpZGVyLmF0dHIoICdpZCcgKTtcblx0XHRcdFx0Y29uc3QgZGlzcGxheVZhbHVlc0FzICAgPSAkaXRlbS5hdHRyKCAnZGF0YS1kaXNwbGF5LXZhbHVlcy1hcycgKTtcblx0XHRcdFx0Y29uc3QgcmFuZ2VNaW5WYWx1ZSAgICAgPSBwYXJzZUZsb2F0KCAkaXRlbS5hdHRyKCAnZGF0YS1yYW5nZS1taW4tdmFsdWUnICkgKTtcblx0XHRcdFx0Y29uc3QgcmFuZ2VNYXhWYWx1ZSAgICAgPSBwYXJzZUZsb2F0KCAkaXRlbS5hdHRyKCAnZGF0YS1yYW5nZS1tYXgtdmFsdWUnICkgKTtcblx0XHRcdFx0Y29uc3Qgc3RlcCAgICAgICAgICAgICAgPSBwYXJzZUZsb2F0KCAkaXRlbS5hdHRyKCAnZGF0YS1zdGVwJyApICk7XG5cdFx0XHRcdGNvbnN0IGRlY2ltYWxQbGFjZXMgICAgID0gJGl0ZW0uYXR0ciggJ2RhdGEtZGVjaW1hbC1wbGFjZXMnICk7XG5cdFx0XHRcdGNvbnN0IHRob3VzYW5kU2VwYXJhdG9yID0gJGl0ZW0uYXR0ciggJ2RhdGEtdGhvdXNhbmQtc2VwYXJhdG9yJyApO1xuXHRcdFx0XHRjb25zdCBkZWNpbWFsU2VwYXJhdG9yICA9ICRpdGVtLmF0dHIoICdkYXRhLWRlY2ltYWwtc2VwYXJhdG9yJyApO1xuXHRcdFx0XHRjb25zdCBtaW5WYWx1ZSAgICAgICAgICA9IHBhcnNlRmxvYXQoICRpdGVtLmF0dHIoICdkYXRhLW1pbi12YWx1ZScgKSApO1xuXHRcdFx0XHRjb25zdCBtYXhWYWx1ZSAgICAgICAgICA9IHBhcnNlRmxvYXQoICRpdGVtLmF0dHIoICdkYXRhLW1heC12YWx1ZScgKSApO1xuXHRcdFx0XHRjb25zdCAkbWluVmFsdWUgICAgICAgICA9ICRpdGVtLmZpbmQoICcubWluLXZhbHVlJyApO1xuXHRcdFx0XHRjb25zdCAkbWF4VmFsdWUgICAgICAgICA9ICRpdGVtLmZpbmQoICcubWF4LXZhbHVlJyApO1xuXG5cdFx0XHRcdGNvbnN0IHNsaWRlciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCBzbGlkZXJJZCApO1xuXG5cdFx0XHRcdG5vVWlTbGlkZXIuY3JlYXRlKCBzbGlkZXIsIHtcblx0XHRcdFx0XHRzdGFydDogWyBtaW5WYWx1ZSwgbWF4VmFsdWUgXSxcblx0XHRcdFx0XHRzdGVwLFxuXHRcdFx0XHRcdGNvbm5lY3Q6IHRydWUsXG5cdFx0XHRcdFx0Y3NzUHJlZml4OiAnd2NhcGYtbm91aS0nLFxuXHRcdFx0XHRcdHJhbmdlOiB7XG5cdFx0XHRcdFx0XHQnbWluJzogcmFuZ2VNaW5WYWx1ZSxcblx0XHRcdFx0XHRcdCdtYXgnOiByYW5nZU1heFZhbHVlLFxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSApO1xuXG5cdFx0XHRcdHNsaWRlci5ub1VpU2xpZGVyLm9uKCAndXBkYXRlJywgZnVuY3Rpb24oIHZhbHVlcyApIHtcblx0XHRcdFx0XHRjb25zdCBtaW5WYWx1ZSA9IG51bWJlcl9mb3JtYXQoIHZhbHVlc1sgMCBdLCBkZWNpbWFsUGxhY2VzLCBkZWNpbWFsU2VwYXJhdG9yLCB0aG91c2FuZFNlcGFyYXRvciApO1xuXHRcdFx0XHRcdGNvbnN0IG1heFZhbHVlID0gbnVtYmVyX2Zvcm1hdCggdmFsdWVzWyAxIF0sIGRlY2ltYWxQbGFjZXMsIGRlY2ltYWxTZXBhcmF0b3IsIHRob3VzYW5kU2VwYXJhdG9yICk7XG5cblx0XHRcdFx0XHRpZiAoICdwbGFpbl90ZXh0JyA9PT0gZGlzcGxheVZhbHVlc0FzICkge1xuXHRcdFx0XHRcdFx0JG1pblZhbHVlLmh0bWwoIG1pblZhbHVlICk7XG5cdFx0XHRcdFx0XHQkbWF4VmFsdWUuaHRtbCggbWF4VmFsdWUgKTtcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0JG1pblZhbHVlLnZhbCggbWluVmFsdWUgKTtcblx0XHRcdFx0XHRcdCRtYXhWYWx1ZS52YWwoIG1heFZhbHVlICk7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0JCggJ2JvZHknICkudHJpZ2dlciggJ3djYXBmLW5vdWlzbGlkZXItdXBkYXRlJywgWyAkaXRlbSwgdmFsdWVzIF0gKTtcblx0XHRcdFx0fSApO1xuXG5cdFx0XHRcdGZ1bmN0aW9uIGZpbHRlclByb2R1Y3RzQWNjb3JkaW5nVG9TbGlkZXIoIHZhbHVlcyApIHtcblx0XHRcdFx0XHRjb25zdCAkYm9keSA9ICQoICdib2R5JyApO1xuXG5cdFx0XHRcdFx0JGJvZHkudHJpZ2dlciggJ3djYXBmLW5vdWlzbGlkZXItYmVmb3JlLWZpbHRlci1wcm9kdWN0cycsIFsgJGl0ZW0sIHZhbHVlcyBdICk7XG5cblx0XHRcdFx0XHRjb25zdCBtaW5WYWx1ZSA9IHBhcnNlRmxvYXQoIHZhbHVlc1sgMCBdICk7XG5cdFx0XHRcdFx0Y29uc3QgbWF4VmFsdWUgPSBwYXJzZUZsb2F0KCB2YWx1ZXNbIDEgXSApO1xuXG5cdFx0XHRcdFx0aWYgKCBtaW5WYWx1ZSA9PT0gcmFuZ2VNaW5WYWx1ZSAmJiBtYXhWYWx1ZSA9PT0gcmFuZ2VNYXhWYWx1ZSApIHtcblx0XHRcdFx0XHRcdGNvbnN0IHF1ZXJ5ID0gd2NhcGZSZW1vdmVRdWVyeVN0cmluZ1BhcmFtZXRlciggZmlsdGVyS2V5ICk7XG5cdFx0XHRcdFx0XHRoaXN0b3J5LnB1c2hTdGF0ZSgge30sICcnLCBxdWVyeSApO1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRjb25zdCBmaWx0ZXJWYWxTdHJpbmcgPSBtaW5WYWx1ZSArIHJhbmdlVmFsdWVzU2VwYXJhdG9yICsgbWF4VmFsdWU7XG5cdFx0XHRcdFx0XHR3Y2FwZlVwZGF0ZVF1ZXJ5U3RyaW5nUGFyYW1ldGVyKCBmaWx0ZXJLZXksIGZpbHRlclZhbFN0cmluZyApO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdC8vIGZpbHRlciBwcm9kdWN0c1xuXHRcdFx0XHRcdHdjYXBmRmlsdGVyUHJvZHVjdHMoKTtcblxuXHRcdFx0XHRcdCRib2R5LnRyaWdnZXIoICd3Y2FwZi1ub3Vpc2xpZGVyLWFmdGVyLWZpbHRlci1wcm9kdWN0cycsIFsgJGl0ZW0sIHZhbHVlcyBdICk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRzbGlkZXIubm9VaVNsaWRlci5vbiggJ3NldCcsIGZ1bmN0aW9uKCB2YWx1ZXMgKSB7XG5cdFx0XHRcdFx0Ly8gQ2xlYXIgYW55IHByZXZpb3VzbHkgc2V0IHRpbWVyIGJlZm9yZSBzZXR0aW5nIGEgZnJlc2ggb25lXG5cdFx0XHRcdFx0Y2xlYXJUaW1lb3V0KCAkaXRlbS5kYXRhKCAndGltZXInICkgKTtcblxuXHRcdFx0XHRcdCRpdGVtLmRhdGEoICd0aW1lcicsIHNldFRpbWVvdXQoIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdFx0JGl0ZW0ucmVtb3ZlRGF0YSggJ3RpbWVyJyApO1xuXG5cdFx0XHRcdFx0XHRmaWx0ZXJQcm9kdWN0c0FjY29yZGluZ1RvU2xpZGVyKCB2YWx1ZXMgKTtcblx0XHRcdFx0XHR9LCBkZWxheSApICk7XG5cdFx0XHRcdH0gKTtcblxuXHRcdFx0XHQkbWluVmFsdWUub24oICdpbnB1dCcsIGZ1bmN0aW9uKCBldmVudCApIHtcblx0XHRcdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXG5cdFx0XHRcdFx0Y29uc3QgJGlucHV0ID0gJCggdGhpcyApO1xuXG5cdFx0XHRcdFx0Ly8gQ2xlYXIgYW55IHByZXZpb3VzbHkgc2V0IHRpbWVyIGJlZm9yZSBzZXR0aW5nIGEgZnJlc2ggb25lXG5cdFx0XHRcdFx0Y2xlYXJUaW1lb3V0KCAkaW5wdXQuZGF0YSggJ3RpbWVyJyApICk7XG5cblx0XHRcdFx0XHQkaW5wdXQuZGF0YSggJ3RpbWVyJywgc2V0VGltZW91dCggZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0XHQkaW5wdXQucmVtb3ZlRGF0YSggJ3RpbWVyJyApO1xuXG5cdFx0XHRcdFx0XHRjb25zdCBtaW5WYWx1ZSA9ICRpbnB1dC52YWwoKTtcblxuXHRcdFx0XHRcdFx0c2xpZGVyLm5vVWlTbGlkZXIuc2V0KCBbIG1pblZhbHVlLCBudWxsIF0gKTtcblxuXHRcdFx0XHRcdFx0ZmlsdGVyUHJvZHVjdHNBY2NvcmRpbmdUb1NsaWRlciggc2xpZGVyLm5vVWlTbGlkZXIuZ2V0KCkgKTtcblx0XHRcdFx0XHR9LCBkZWxheSApICk7XG5cdFx0XHRcdH0gKTtcblxuXHRcdFx0XHQkbWF4VmFsdWUub24oICdpbnB1dCcsIGZ1bmN0aW9uKCBldmVudCApIHtcblx0XHRcdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXG5cdFx0XHRcdFx0Y29uc3QgJGlucHV0ID0gJCggdGhpcyApO1xuXG5cdFx0XHRcdFx0Ly8gQ2xlYXIgYW55IHByZXZpb3VzbHkgc2V0IHRpbWVyIGJlZm9yZSBzZXR0aW5nIGEgZnJlc2ggb25lXG5cdFx0XHRcdFx0Y2xlYXJUaW1lb3V0KCAkaW5wdXQuZGF0YSggJ3RpbWVyJyApICk7XG5cblx0XHRcdFx0XHQkaW5wdXQuZGF0YSggJ3RpbWVyJywgc2V0VGltZW91dCggZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0XHQkaW5wdXQucmVtb3ZlRGF0YSggJ3RpbWVyJyApO1xuXG5cdFx0XHRcdFx0XHRjb25zdCBtYXhWYWx1ZSA9ICRpbnB1dC52YWwoKTtcblxuXHRcdFx0XHRcdFx0c2xpZGVyLm5vVWlTbGlkZXIuc2V0KCBbIG51bGwsIG1heFZhbHVlIF0gKTtcblxuXHRcdFx0XHRcdFx0ZmlsdGVyUHJvZHVjdHNBY2NvcmRpbmdUb1NsaWRlciggc2xpZGVyLm5vVWlTbGlkZXIuZ2V0KCkgKTtcblx0XHRcdFx0XHR9LCBkZWxheSApICk7XG5cdFx0XHRcdH0gKTtcblx0XHRcdH0gKTtcblx0XHR9XG5cblx0XHRpbml0Tm9VSVNsaWRlcigpO1xuXG5cdFx0ZnVuY3Rpb24gaW5pdERhdGVwaWNrZXIoKSB7XG5cdFx0XHRpZiAoICEgalF1ZXJ5KCkuZGF0ZXBpY2tlciApIHtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXG5cdFx0XHRjb25zdCAkd2NhcGZEYXRlRmlsdGVycyA9ICQoICcud2NhcGYtZGF0ZS1yYW5nZS1maWx0ZXInICk7XG5cdFx0XHRjb25zdCAkd2NhcGZEYXRlRmlsdGVyICA9ICR3Y2FwZkRhdGVGaWx0ZXJzLmZpbmQoICcud2NhcGYtZGF0ZS1pbnB1dCcgKTtcblxuXHRcdFx0Y29uc3QgZm9ybWF0ICAgICAgICA9ICR3Y2FwZkRhdGVGaWx0ZXIuYXR0ciggJ2RhdGEtZGF0ZS1mb3JtYXQnICk7XG5cdFx0XHRjb25zdCB5ZWFyRHJvcGRvd24gID0gJHdjYXBmRGF0ZUZpbHRlci5hdHRyKCAnZGF0YS1kYXRlLXBpY2tlci15ZWFyLWRyb3Bkb3duJyApO1xuXHRcdFx0Y29uc3QgbW9udGhEcm9wZG93biA9ICR3Y2FwZkRhdGVGaWx0ZXIuYXR0ciggJ2RhdGEtZGF0ZS1waWNrZXItbW9udGgtZHJvcGRvd24nICk7XG5cblx0XHRcdGNvbnN0ICRmcm9tID0gJHdjYXBmRGF0ZUZpbHRlci5maW5kKCAnLmRhdGUtZnJvbS1pbnB1dCcgKTtcblx0XHRcdGNvbnN0ICR0byAgID0gJHdjYXBmRGF0ZUZpbHRlci5maW5kKCAnLmRhdGUtdG8taW5wdXQnICk7XG5cblx0XHRcdCRmcm9tLmRhdGVwaWNrZXIoIHtcblx0XHRcdFx0ZGF0ZUZvcm1hdDogZm9ybWF0LFxuXHRcdFx0XHRjaGFuZ2VZZWFyOiB5ZWFyRHJvcGRvd24sXG5cdFx0XHRcdGNoYW5nZU1vbnRoOiBtb250aERyb3Bkb3duLFxuXHRcdFx0fSApO1xuXG5cdFx0XHQkdG8uZGF0ZXBpY2tlcigge1xuXHRcdFx0XHRkYXRlRm9ybWF0OiBmb3JtYXQsXG5cdFx0XHRcdGNoYW5nZVllYXI6IHllYXJEcm9wZG93bixcblx0XHRcdFx0Y2hhbmdlTW9udGg6IG1vbnRoRHJvcGRvd24sXG5cdFx0XHR9ICk7XG5cblx0XHRcdCRmcm9tLm9uKCAnY2hhbmdlJywgZnVuY3Rpb24oKSB7XG5cdFx0XHRcdGNvbnN0ICRpbnB1dCA9ICQoIHRoaXMgKTtcblx0XHRcdFx0ZmlsdGVyQnlEYXRlKCAkaW5wdXQgKTtcblx0XHRcdH0gKTtcblxuXHRcdFx0JHRvLm9uKCAnY2hhbmdlJywgZnVuY3Rpb24oKSB7XG5cdFx0XHRcdGNvbnN0ICRpbnB1dCA9ICQoIHRoaXMgKTtcblx0XHRcdFx0ZmlsdGVyQnlEYXRlKCAkaW5wdXQgKTtcblx0XHRcdH0gKTtcblx0XHR9XG5cblx0XHRpbml0RGF0ZXBpY2tlcigpO1xuXG5cdFx0Ly8gc2hvdyBhIGxvYWRpbmcgaW5kaWNhdG9yXG5cdFx0ZnVuY3Rpb24gd2NhcGZCZWZvcmVVcGRhdGUoKSB7XG5cdFx0XHQkKCAnYm9keScgKS50cmlnZ2VyKCAnd2NhcGZfYmVmb3JlX3VwZGF0ZV9maWx0ZXJzJyApO1xuXHRcdH1cblxuXHRcdC8vIHNjcm9sbCB0byB0b3Bcblx0XHRmdW5jdGlvbiB3Y2FwZkFmdGVyVXBkYXRlKCkge1xuXHRcdFx0aW5pdENob3NlbigpO1xuXHRcdFx0aW5pdEhpZXJhcmNoeUFjY29yZGlvbigpO1xuXHRcdFx0aW5pdE5vVUlTbGlkZXIoKTtcblx0XHRcdGluaXREYXRlcGlja2VyKCk7XG5cblx0XHRcdCQoICdib2R5JyApLnRyaWdnZXIoICd3Y2FwZl9hZnRlcl91cGRhdGVfZmlsdGVycycgKTtcblx0XHR9XG5cblx0XHQvLyBmaWx0ZXIgdGhlIHByb2R1Y3RzXG5cdFx0ZnVuY3Rpb24gd2NhcGZGaWx0ZXJQcm9kdWN0cyggZm9yY2VSZVJlbmRlciA9IGZhbHNlICkge1xuXHRcdFx0d2NhcGZCZWZvcmVVcGRhdGUoKTtcblxuXHRcdFx0JC5nZXQoXG5cdFx0XHRcdHdpbmRvdy5sb2NhdGlvbi5ocmVmLFxuXHRcdFx0XHRmdW5jdGlvbiggZGF0YSApIHtcblx0XHRcdFx0XHRjb25zdCAkZGF0YSA9ICQoIGRhdGEgKTtcblxuXHRcdFx0XHRcdGNvbnN0ICRzaG9wTG9vcENvbnRhaW5lciA9ICRkYXRhLmZpbmQoIHdjYXBmX3BhcmFtcy5zaG9wX2xvb3BfY29udGFpbmVyICk7XG5cdFx0XHRcdFx0Y29uc3QgJG5vdEZvdW5kQ29udGFpbmVyID0gJGRhdGEuZmluZCggd2NhcGZfcGFyYW1zLm5vdF9mb3VuZF9jb250YWluZXIgKTtcblxuXHRcdFx0XHRcdC8vIHJlcGxhY2UgZmllbGRzJyBkYXRhIHdpdGggbmV3IGRhdGFcblx0XHRcdFx0XHQkLmVhY2goXG5cdFx0XHRcdFx0XHRmaWVsZHMsXG5cdFx0XHRcdFx0XHRmdW5jdGlvbiggaWQgKSB7XG5cdFx0XHRcdFx0XHRcdGNvbnN0IGZpZWxkSUQgICAgPSAnW2RhdGEtaWQ9XCInICsgaWQgKyAnXCJdJztcblx0XHRcdFx0XHRcdFx0Y29uc3QgJGZpZWxkICAgICA9ICQoIGZpZWxkSUQgKTtcblx0XHRcdFx0XHRcdFx0Y29uc3QgJGlubmVyICAgICA9ICRmaWVsZC5maW5kKCAnLndjYXBmLWZpZWxkLWlubmVyJyApO1xuXHRcdFx0XHRcdFx0XHRjb25zdCBfZmllbGQgICAgID0gJGRhdGEuZmluZCggZmllbGRJRCApO1xuXHRcdFx0XHRcdFx0XHRjb25zdCBmaWVsZENsYXNzID0gJCggX2ZpZWxkICkuYXR0ciggJ2NsYXNzJyApO1xuXHRcdFx0XHRcdFx0XHRjb25zdCBfaHRtbCAgICAgID0gX2ZpZWxkLmZpbmQoICcud2NhcGYtZmllbGQtaW5uZXInICkuaHRtbCgpO1xuXG5cdFx0XHRcdFx0XHRcdC8vIFdoZW4gY2FsbGVkIGZyb20gaGlzdG9yeSBiYWNrIG9yIGZvcndhcmQgcmVxdWVzdCB0aGVuIHJlcmVuZGVyIGFsbCBmaWVsZHMuXG5cdFx0XHRcdFx0XHRcdGlmICggZm9yY2VSZVJlbmRlciApIHtcblxuXHRcdFx0XHRcdFx0XHRcdC8vIHVwZGF0ZSBjbGFzc1xuXHRcdFx0XHRcdFx0XHRcdCRmaWVsZC5hdHRyKCAnY2xhc3MnLCBmaWVsZENsYXNzICk7XG5cblx0XHRcdFx0XHRcdFx0XHQvLyB1cGRhdGUgZmllbGRcblx0XHRcdFx0XHRcdFx0XHQkaW5uZXIuaHRtbCggX2h0bWwgKTtcblxuXHRcdFx0XHRcdFx0XHR9IGVsc2Uge1xuXG5cdFx0XHRcdFx0XHRcdFx0Ly8gU2VsZWN0aXZlbHkgcmVyZW5kZXIgdGhlIGZpZWxkcy5cblx0XHRcdFx0XHRcdFx0XHRpZiAoICRmaWVsZC5oYXNDbGFzcyggJ3djYXBmLW5hdi1maWx0ZXInICkgKSB7XG5cblx0XHRcdFx0XHRcdFx0XHRcdC8vIHVwZGF0ZSBjbGFzc1xuXHRcdFx0XHRcdFx0XHRcdFx0JGZpZWxkLmF0dHIoICdjbGFzcycsIGZpZWxkQ2xhc3MgKTtcblxuXHRcdFx0XHRcdFx0XHRcdFx0Ly8gdXBkYXRlIGZpZWxkXG5cdFx0XHRcdFx0XHRcdFx0XHQkaW5uZXIuaHRtbCggX2h0bWwgKTtcblxuXHRcdFx0XHRcdFx0XHRcdH0gZWxzZSB7XG5cblx0XHRcdFx0XHRcdFx0XHRcdC8vIFdlIG5lZWQgdG8gdXBkYXRlIHRoZSBmaWVsZHMnIGNsYXNzZXMgYWx3YXlzLlxuXHRcdFx0XHRcdFx0XHRcdFx0JGZpZWxkLmF0dHIoICdjbGFzcycsIGZpZWxkQ2xhc3MgKTtcblxuXHRcdFx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0KTtcblxuXHRcdFx0XHRcdC8vIHJlcGxhY2Ugb2xkIHNob3AgbG9vcCB3aXRoIG5ldyBvbmVcblx0XHRcdFx0XHRpZiAoIHdjYXBmX3BhcmFtcy5zaG9wX2xvb3BfY29udGFpbmVyID09PSB3Y2FwZl9wYXJhbXMubm90X2ZvdW5kX2NvbnRhaW5lciApIHtcblx0XHRcdFx0XHRcdCQoIHdjYXBmX3BhcmFtcy5zaG9wX2xvb3BfY29udGFpbmVyICkuaHRtbCggJHNob3BMb29wQ29udGFpbmVyLmh0bWwoKSApO1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRpZiAoICQoIHdjYXBmX3BhcmFtcy5ub3RfZm91bmRfY29udGFpbmVyICkubGVuZ3RoICkge1xuXHRcdFx0XHRcdFx0XHRpZiAoICRzaG9wTG9vcENvbnRhaW5lci5sZW5ndGggKSB7XG5cdFx0XHRcdFx0XHRcdFx0JCggd2NhcGZfcGFyYW1zLm5vdF9mb3VuZF9jb250YWluZXIgKS5odG1sKCAkc2hvcExvb3BDb250YWluZXIuaHRtbCgpICk7XG5cdFx0XHRcdFx0XHRcdH0gZWxzZSBpZiAoICRub3RGb3VuZENvbnRhaW5lci5sZW5ndGggKSB7XG5cdFx0XHRcdFx0XHRcdFx0JCggd2NhcGZfcGFyYW1zLm5vdF9mb3VuZF9jb250YWluZXIgKS5odG1sKCAkbm90Rm91bmRDb250YWluZXIuaHRtbCgpICk7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH0gZWxzZSBpZiAoICQoIHdjYXBmX3BhcmFtcy5zaG9wX2xvb3BfY29udGFpbmVyICkubGVuZ3RoICkge1xuXHRcdFx0XHRcdFx0XHRpZiAoICRzaG9wTG9vcENvbnRhaW5lci5sZW5ndGggKSB7XG5cdFx0XHRcdFx0XHRcdFx0JCggd2NhcGZfcGFyYW1zLnNob3BfbG9vcF9jb250YWluZXIgKS5odG1sKCAkc2hvcExvb3BDb250YWluZXIuaHRtbCgpICk7XG5cdFx0XHRcdFx0XHRcdH0gZWxzZSBpZiAoICRub3RGb3VuZENvbnRhaW5lci5sZW5ndGggKSB7XG5cdFx0XHRcdFx0XHRcdFx0JCggd2NhcGZfcGFyYW1zLnNob3BfbG9vcF9jb250YWluZXIgKS5odG1sKCAkbm90Rm91bmRDb250YWluZXIuaHRtbCgpICk7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHR3Y2FwZkFmdGVyVXBkYXRlKCk7XG5cblx0XHRcdFx0XHQvLyB0b2RvXG5cdFx0XHRcdFx0Ly8gcmVpbml0aWFsaXplIG9yZGVyaW5nXG5cdFx0XHRcdFx0Ly8gd2NhcGZJbml0T3JkZXIoKTtcblxuXHRcdFx0XHRcdC8vIHRvZG9cblx0XHRcdFx0XHQvLyByZWluaXRpYWxpemUgZHJvcGRvd24gZmlsdGVyXG5cdFx0XHRcdFx0Ly8gd2NhcGZEcm9wRG93bkZpbHRlcigpO1xuXG5cdFx0XHRcdFx0Ly8gcnVuIHNjcmlwdHMgYWZ0ZXIgc2hvcCBsb29wIHVuZGF0ZWRcblx0XHRcdFx0XHRpZiAoIHR5cGVvZiB3Y2FwZl9wYXJhbXMuY3VzdG9tX3NjcmlwdHMgIT09ICd1bmRlZmluZWQnICYmIHdjYXBmX3BhcmFtcy5jdXN0b21fc2NyaXB0cy5sZW5ndGggPiAwICkge1xuXHRcdFx0XHRcdFx0ZXZhbCggd2NhcGZfcGFyYW1zLmN1c3RvbV9zY3JpcHRzICk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHQpO1xuXHRcdH1cblxuXHRcdC8vIFVSTCBQYXJzZXJcblx0XHRmdW5jdGlvbiB3Y2FwZkdldFVybFZhcnMoIHVybCApIHtcblx0XHRcdGxldCB2YXJzID0ge30sIGhhc2g7XG5cblx0XHRcdGlmICggdHlwZW9mIHVybCA9PT0gJ3VuZGVmaW5lZCcgKSB7XG5cdFx0XHRcdHVybCA9IHdpbmRvdy5sb2NhdGlvbi5ocmVmO1xuXHRcdFx0fVxuXG5cdFx0XHR1cmwgPSB1cmwucmVwbGFjZUFsbCggJyUyQycsICcsJyApO1xuXG5cdFx0XHRjb25zdCBoYXNoZXMgID0gdXJsLnNsaWNlKCB1cmwuaW5kZXhPZiggJz8nICkgKyAxICkuc3BsaXQoICcmJyApO1xuXHRcdFx0Y29uc3QgaExlbmd0aCA9IGhhc2hlcy5sZW5ndGg7XG5cblx0XHRcdGZvciAoIGxldCBpID0gMDsgaSA8IGhMZW5ndGg7IGkrKyApIHtcblx0XHRcdFx0aGFzaCA9IGhhc2hlc1sgaSBdLnNwbGl0KCAnPScgKTtcblxuXHRcdFx0XHR2YXJzWyBoYXNoWyAwIF0gXSA9IGhhc2hbIDEgXTtcblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuIHZhcnM7XG5cdFx0fVxuXG5cdFx0Ly8gZXZlcnl0aW1lIHdlIGFwcGx5IHRoZSBmaWx0ZXIgd2Ugc2V0IHRoZSBjdXJyZW50IHBhZ2UgdG8gMVxuXHRcdGZ1bmN0aW9uIHdjYXBmRml4UGFnaW5hdGlvbigpIHtcblx0XHRcdGxldCB1cmwgICAgICAgICAgICAgICAgPSB3aW5kb3cubG9jYXRpb24uaHJlZjtcblx0XHRcdGNvbnN0IHBhcmFtcyAgICAgICAgICAgPSB3Y2FwZkdldFVybFZhcnMoIHVybCApO1xuXHRcdFx0Y29uc3QgY3VycmVudFBhZ2VJblVybCA9IHBhcnNlSW50KCB1cmwucmVwbGFjZSggLy4rXFwvcGFnZVxcLyhcXGQrKSsvLCAnJDEnICkgKTtcblxuXHRcdFx0aWYgKCBjdXJyZW50UGFnZUluVXJsICkge1xuXHRcdFx0XHRpZiAoIGN1cnJlbnRQYWdlSW5VcmwgPiAxICkge1xuXHRcdFx0XHRcdHVybCA9IHVybC5yZXBsYWNlKCAvcGFnZVxcLyhcXGQrKS8sICdwYWdlLzEnICk7XG5cdFx0XHRcdH1cblx0XHRcdH0gZWxzZSBpZiAoIHR5cGVvZiBwYXJhbXNbICdwYWdlZCcgXSAhPT0gJ3VuZGVmaW5lZCcgKSB7XG5cdFx0XHRcdGNvbnN0IGN1cnJlbnRQYWdlSW5QYXJhbXMgPSBwYXJzZUludCggcGFyYW1zWyAncGFnZWQnIF0gKTtcblxuXHRcdFx0XHRpZiAoIGN1cnJlbnRQYWdlSW5QYXJhbXMgPiAxICkge1xuXHRcdFx0XHRcdHVybCA9IHVybC5yZXBsYWNlKCAncGFnZWQ9JyArIGN1cnJlbnRQYWdlSW5QYXJhbXMsICdwYWdlZD0xJyApO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiB1cmw7XG5cdFx0fVxuXG5cdFx0Ly8gdXBkYXRlIHF1ZXJ5IHN0cmluZyBmb3IgY2F0ZWdvcmllcywgbWV0YSBldGMuLlxuXHRcdGZ1bmN0aW9uIHdjYXBmVXBkYXRlUXVlcnlTdHJpbmdQYXJhbWV0ZXIoIGtleSwgdmFsdWUsIHB1c2hIaXN0b3J5LCB1cmwgKSB7XG5cdFx0XHRpZiAoIHR5cGVvZiBwdXNoSGlzdG9yeSA9PT0gJ3VuZGVmaW5lZCcgKSB7XG5cdFx0XHRcdHB1c2hIaXN0b3J5ID0gdHJ1ZTtcblx0XHRcdH1cblxuXHRcdFx0aWYgKCB0eXBlb2YgdXJsID09PSAndW5kZWZpbmVkJyApIHtcblx0XHRcdFx0dXJsID0gd2NhcGZGaXhQYWdpbmF0aW9uKCk7XG5cdFx0XHR9XG5cblx0XHRcdGNvbnN0IHJlICAgICAgICA9IG5ldyBSZWdFeHAoICcoWz8mXSknICsga2V5ICsgJz0uKj8oJnwkKScsICdpJyApO1xuXHRcdFx0Y29uc3Qgc2VwYXJhdG9yID0gdXJsLmluZGV4T2YoICc/JyApICE9PSAtMSA/ICcmJyA6ICc/Jztcblx0XHRcdGxldCB1cmxXaXRoUXVlcnk7XG5cblx0XHRcdGlmICggdXJsLm1hdGNoKCByZSApICkge1xuXHRcdFx0XHR1cmxXaXRoUXVlcnkgPSB1cmwucmVwbGFjZSggcmUsICckMScgKyBrZXkgKyAnPScgKyB2YWx1ZSArICckMicgKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHVybFdpdGhRdWVyeSA9IHVybCArIHNlcGFyYXRvciArIGtleSArICc9JyArIHZhbHVlO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAoIHB1c2hIaXN0b3J5ID09PSB0cnVlICkge1xuXHRcdFx0XHRyZXR1cm4gaGlzdG9yeS5wdXNoU3RhdGUoIHt9LCAnJywgdXJsV2l0aFF1ZXJ5ICk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRyZXR1cm4gdXJsV2l0aFF1ZXJ5O1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdC8vIHJlbW92ZSBwYXJhbWV0ZXIgZnJvbSB1cmxcblx0XHRmdW5jdGlvbiB3Y2FwZlJlbW92ZVF1ZXJ5U3RyaW5nUGFyYW1ldGVyKCBmaWx0ZXJLZXksIHVybCApIHtcblx0XHRcdGlmICggdHlwZW9mIHVybCA9PT0gJ3VuZGVmaW5lZCcgKSB7XG5cdFx0XHRcdHVybCA9IHdjYXBmRml4UGFnaW5hdGlvbigpO1xuXHRcdFx0fVxuXG5cdFx0XHRjb25zdCBvbGRQYXJhbXMgICAgICAgICA9IHdjYXBmR2V0VXJsVmFycyggdXJsICk7XG5cdFx0XHRjb25zdCBvbGRQYXJhbXNMZW5ndGggICA9IE9iamVjdC5rZXlzKCBvbGRQYXJhbXMgKS5sZW5ndGg7XG5cdFx0XHRjb25zdCBzdGFydFBvc2l0aW9uICAgICA9IHVybC5pbmRleE9mKCAnPycgKTtcblx0XHRcdGNvbnN0IGZpbHRlcktleVBvc2l0aW9uID0gdXJsLmluZGV4T2YoIGZpbHRlcktleSApO1xuXHRcdFx0bGV0IGNsZWFuVXJsLCBjbGVhblF1ZXJ5O1xuXG5cdFx0XHRpZiAoIG9sZFBhcmFtc0xlbmd0aCA+IDEgKSB7XG5cdFx0XHRcdGlmICggKCBmaWx0ZXJLZXlQb3NpdGlvbiAtIHN0YXJ0UG9zaXRpb24gKSA+IDEgKSB7XG5cdFx0XHRcdFx0Y2xlYW5VcmwgPSB1cmwucmVwbGFjZSggJyYnICsgZmlsdGVyS2V5ICsgJz0nICsgb2xkUGFyYW1zWyBmaWx0ZXJLZXkgXSwgJycgKTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRjbGVhblVybCA9IHVybC5yZXBsYWNlKCBmaWx0ZXJLZXkgKyAnPScgKyBvbGRQYXJhbXNbIGZpbHRlcktleSBdICsgJyYnLCAnJyApO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0Y29uc3QgbmV3UGFyYW1zID0gY2xlYW5Vcmwuc3BsaXQoICc/JyApO1xuXHRcdFx0XHRjbGVhblF1ZXJ5ICAgICAgPSAnPycgKyBuZXdQYXJhbXNbIDEgXTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGNsZWFuUXVlcnkgPSB1cmwucmVwbGFjZSggJz8nICsgZmlsdGVyS2V5ICsgJz0nICsgb2xkUGFyYW1zWyBmaWx0ZXJLZXkgXSwgJycgKTtcblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuIGNsZWFuUXVlcnk7XG5cdFx0fVxuXG5cdFx0Ly8gdGFrZSB0aGUga2V5IGFuZCB2YWx1ZSBhbmQgbWFrZSBxdWVyeVxuXHRcdGZ1bmN0aW9uIHdjYXBmTWFrZVBhcmFtZXRlcnMoIGZpbHRlcktleSwgZmlsdGVyVmFsdWUsIGZvcmNlUmVyZW5kZXIgPSBmYWxzZSwgdXJsICkge1xuXHRcdFx0Y29uc3QgdmFsdWVTZXBhcmF0b3IgPSAnLCc7XG5cblx0XHRcdGxldCBwYXJhbXMsIG5leHRWYWx1ZXMsIGVtcHR5VmFsdWUgPSBmYWxzZTtcblxuXHRcdFx0aWYgKCB0eXBlb2YgdXJsICE9PSAndW5kZWZpbmVkJyApIHtcblx0XHRcdFx0cGFyYW1zID0gd2NhcGZHZXRVcmxWYXJzKCB1cmwgKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHBhcmFtcyA9IHdjYXBmR2V0VXJsVmFycygpO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAoIHR5cGVvZiBwYXJhbXNbIGZpbHRlcktleSBdICE9ICd1bmRlZmluZWQnICkge1xuXHRcdFx0XHRjb25zdCBwcmV2VmFsdWVzICAgICAgPSBwYXJhbXNbIGZpbHRlcktleSBdO1xuXHRcdFx0XHRjb25zdCBwcmV2VmFsdWVzQXJyYXkgPSBwcmV2VmFsdWVzLnNwbGl0KCB2YWx1ZVNlcGFyYXRvciApO1xuXG5cdFx0XHRcdGlmICggcHJldlZhbHVlcy5sZW5ndGggPiAwICkge1xuXHRcdFx0XHRcdGNvbnN0IGZvdW5kID0gJC5pbkFycmF5KCBmaWx0ZXJWYWx1ZSwgcHJldlZhbHVlc0FycmF5ICk7XG5cblx0XHRcdFx0XHRpZiAoIGZvdW5kID49IDAgKSB7XG5cdFx0XHRcdFx0XHQvLyBFbGVtZW50IHdhcyBmb3VuZCwgcmVtb3ZlIGl0LlxuXHRcdFx0XHRcdFx0cHJldlZhbHVlc0FycmF5LnNwbGljZSggZm91bmQsIDEgKTtcblxuXHRcdFx0XHRcdFx0aWYgKCBwcmV2VmFsdWVzQXJyYXkubGVuZ3RoID09PSAwICkge1xuXHRcdFx0XHRcdFx0XHRlbXB0eVZhbHVlID0gdHJ1ZTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0Ly8gRWxlbWVudCB3YXMgbm90IGZvdW5kLCBhZGQgaXQuXG5cdFx0XHRcdFx0XHRwcmV2VmFsdWVzQXJyYXkucHVzaCggZmlsdGVyVmFsdWUgKTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRpZiAoIHByZXZWYWx1ZXNBcnJheS5sZW5ndGggPiAxICkge1xuXHRcdFx0XHRcdFx0bmV4dFZhbHVlcyA9IHByZXZWYWx1ZXNBcnJheS5qb2luKCB2YWx1ZVNlcGFyYXRvciApO1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRuZXh0VmFsdWVzID0gcHJldlZhbHVlc0FycmF5O1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRuZXh0VmFsdWVzID0gZmlsdGVyVmFsdWU7XG5cdFx0XHRcdH1cblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdG5leHRWYWx1ZXMgPSBmaWx0ZXJWYWx1ZTtcblx0XHRcdH1cblxuXHRcdFx0Ly8gdXBkYXRlIHVybCBhbmQgcXVlcnkgc3RyaW5nXG5cdFx0XHRpZiAoICEgZW1wdHlWYWx1ZSApIHtcblx0XHRcdFx0d2NhcGZVcGRhdGVRdWVyeVN0cmluZ1BhcmFtZXRlciggZmlsdGVyS2V5LCBuZXh0VmFsdWVzICk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRjb25zdCBxdWVyeSA9IHdjYXBmUmVtb3ZlUXVlcnlTdHJpbmdQYXJhbWV0ZXIoIGZpbHRlcktleSApO1xuXHRcdFx0XHRoaXN0b3J5LnB1c2hTdGF0ZSgge30sICcnLCBxdWVyeSApO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBmaWx0ZXIgcHJvZHVjdHNcblx0XHRcdHdjYXBmRmlsdGVyUHJvZHVjdHMoIGZvcmNlUmVyZW5kZXIgKTtcblx0XHR9XG5cblx0XHRmdW5jdGlvbiB3Y2FwZlNpbmdsZUZpbHRlciggZmlsdGVyS2V5LCBmaWx0ZXJWYWx1ZSApIHtcblx0XHRcdGNvbnN0IHBhcmFtcyA9IHdjYXBmR2V0VXJsVmFycygpO1xuXHRcdFx0bGV0IHF1ZXJ5O1xuXG5cdFx0XHRpZiAoIHR5cGVvZiBwYXJhbXNbIGZpbHRlcktleSBdICE9PSAndW5kZWZpbmVkJyAmJiBwYXJhbXNbIGZpbHRlcktleSBdID09PSBmaWx0ZXJWYWx1ZSApIHtcblx0XHRcdFx0cXVlcnkgPSB3Y2FwZlJlbW92ZVF1ZXJ5U3RyaW5nUGFyYW1ldGVyKCBmaWx0ZXJLZXkgKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHF1ZXJ5ID0gd2NhcGZVcGRhdGVRdWVyeVN0cmluZ1BhcmFtZXRlciggZmlsdGVyS2V5LCBmaWx0ZXJWYWx1ZSwgZmFsc2UgKTtcblx0XHRcdH1cblxuXHRcdFx0Ly8gdXBkYXRlIHVybFxuXHRcdFx0aGlzdG9yeS5wdXNoU3RhdGUoIHt9LCAnJywgcXVlcnkgKTtcblxuXHRcdFx0Ly8gZmlsdGVyIHByb2R1Y3RzXG5cdFx0XHR3Y2FwZkZpbHRlclByb2R1Y3RzKCk7XG5cdFx0fVxuXG5cdFx0Ly8gVGhlIG1haW4gZnVuY3Rpb24gdG8gaGFuZGxlIHRoZSBmaWx0ZXIgcmVxdWVzdFxuXHRcdGZ1bmN0aW9uIGhhbmRsZUZpbHRlclJlcXVlc3QoICRpdGVtLCBmaWx0ZXJWYWx1ZSApIHtcblx0XHRcdGNvbnN0ICRmaWVsZCAgICAgICAgID0gJGl0ZW0uY2xvc2VzdCggJy53Y2FwZi1zaW5nbGUtZmlsdGVyJyApO1xuXHRcdFx0Y29uc3QgZmllbGRJRCAgICAgICAgPSAkZmllbGQuYXR0ciggJ2RhdGEtaWQnICk7XG5cdFx0XHRjb25zdCBmaWVsZERhdGEgICAgICA9IGZpZWxkc1sgZmllbGRJRCBdO1xuXHRcdFx0Y29uc3QgZmlsdGVyS2V5ICAgICAgPSBmaWVsZERhdGEuZmlsdGVyS2V5O1xuXHRcdFx0Y29uc3QgbXVsdGlwbGVGaWx0ZXIgPSBmaWVsZERhdGEubXVsdGlwbGVGaWx0ZXI7XG5cblx0XHRcdGlmICggISBmaWx0ZXJLZXkgKSB7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblxuXHRcdFx0aWYgKCAhIGZpbHRlclZhbHVlLmxlbmd0aCApIHtcblx0XHRcdFx0Y29uc3QgcXVlcnkgPSB3Y2FwZlJlbW92ZVF1ZXJ5U3RyaW5nUGFyYW1ldGVyKCBmaWx0ZXJLZXkgKTtcblx0XHRcdFx0aGlzdG9yeS5wdXNoU3RhdGUoIHt9LCAnJywgcXVlcnkgKTtcblxuXHRcdFx0XHQvLyBmaWx0ZXIgcHJvZHVjdHNcblx0XHRcdFx0d2NhcGZGaWx0ZXJQcm9kdWN0cygpO1xuXG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblxuXHRcdFx0aWYgKCBtdWx0aXBsZUZpbHRlciApIHtcblx0XHRcdFx0d2NhcGZNYWtlUGFyYW1ldGVycyggZmlsdGVyS2V5LCBmaWx0ZXJWYWx1ZSApO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0d2NhcGZTaW5nbGVGaWx0ZXIoIGZpbHRlcktleSwgZmlsdGVyVmFsdWUgKTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHQvLyBoYW5kbGUgdGhlIGZpbHRlciByZXF1ZXN0IGZvciBsaXN0IGZpZWxkc1xuXHRcdCR3Y2FwZk5hdkZpbHRlcnMub24oXG5cdFx0XHQnY2hhbmdlJyxcblx0XHRcdCcud2NhcGYtbGF5ZXJlZC1uYXYgW3R5cGU9XCJjaGVja2JveFwiXSwgLndjYXBmLWxheWVyZWQtbmF2IFt0eXBlPVwicmFkaW9cIl0nLFxuXHRcdFx0ZnVuY3Rpb24oIGV2ZW50ICkge1xuXHRcdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXG5cdFx0XHRcdGNvbnN0ICRpdGVtICAgICAgID0gJCggdGhpcyApO1xuXHRcdFx0XHRjb25zdCBmaWx0ZXJWYWx1ZSA9ICRpdGVtLnZhbCgpO1xuXG5cdFx0XHRcdGhhbmRsZUZpbHRlclJlcXVlc3QoICRpdGVtLCBmaWx0ZXJWYWx1ZSApO1xuXHRcdFx0fVxuXHRcdCk7XG5cblx0XHQvLyBUT0RPOiBVc2UgYSBjb21iaW5hdGlvbiBvZiBsYWJlbCwgY2hlY2tib3ggYW5kIHJhZGlvXG5cdFx0Ly8gaGFuZGxlIHRoZSBmaWx0ZXIgcmVxdWVzdCBmb3IgbGFiZWxlZCBpdGVtXG5cdFx0JHdjYXBmTmF2RmlsdGVycy5vbihcblx0XHRcdCdjbGljaycsXG5cdFx0XHQnLndjYXBmLWxhYmVsZWQtbmF2IC5pdGVtJyxcblx0XHRcdGZ1bmN0aW9uKCBldmVudCApIHtcblx0XHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcblxuXHRcdFx0XHRjb25zdCAkaXRlbSAgICAgICA9ICQoIHRoaXMgKTtcblx0XHRcdFx0Y29uc3QgZmlsdGVyVmFsdWUgPSAkaXRlbS5hdHRyKCAnZGF0YS12YWx1ZScgKTtcblxuXHRcdFx0XHRoYW5kbGVGaWx0ZXJSZXF1ZXN0KCAkaXRlbSwgZmlsdGVyVmFsdWUgKTtcblx0XHRcdH1cblx0XHQpO1xuXG5cdFx0Ly8gaGFuZGxlIHRoZSBmaWx0ZXIgcmVxdWVzdCBmb3IgZGlzcGxheSB0eXBlIHNlbGVjdCBmaWVsZHNcblx0XHQkd2NhcGZOYXZGaWx0ZXJzLm9uKFxuXHRcdFx0J2NoYW5nZScsXG5cdFx0XHQnc2VsZWN0Jyxcblx0XHRcdGZ1bmN0aW9uKCBldmVudCApIHtcblx0XHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcblxuXHRcdFx0XHRjb25zdCAkaXRlbSAgICAgICA9ICQoIHRoaXMgKTtcblx0XHRcdFx0Y29uc3QgZmlsdGVyVmFsdWUgPSAkaXRlbS52YWwoKTtcblxuXHRcdFx0XHRjb25zdCAkZmllbGQgICAgPSAkaXRlbS5jbG9zZXN0KCAnLndjYXBmLXNpbmdsZS1maWx0ZXInICk7XG5cdFx0XHRcdGNvbnN0IGZpZWxkSUQgICA9ICRmaWVsZC5hdHRyKCAnZGF0YS1pZCcgKTtcblx0XHRcdFx0Y29uc3QgZmllbGREYXRhID0gZmllbGRzWyBmaWVsZElEIF07XG5cdFx0XHRcdGNvbnN0IGZpbHRlcktleSA9IGZpZWxkRGF0YS5maWx0ZXJLZXk7XG5cblx0XHRcdFx0aWYgKCAhIGZpbHRlclZhbHVlLmxlbmd0aCApIHtcblx0XHRcdFx0XHRjb25zdCBxdWVyeSA9IHdjYXBmUmVtb3ZlUXVlcnlTdHJpbmdQYXJhbWV0ZXIoIGZpbHRlcktleSApO1xuXHRcdFx0XHRcdGhpc3RvcnkucHVzaFN0YXRlKCB7fSwgJycsIHF1ZXJ5ICk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0Y29uc3QgZmlsdGVyVmFsU3RyaW5nID0gZmlsdGVyVmFsdWUudG9TdHJpbmcoKTtcblx0XHRcdFx0XHR3Y2FwZlVwZGF0ZVF1ZXJ5U3RyaW5nUGFyYW1ldGVyKCBmaWx0ZXJLZXksIGZpbHRlclZhbFN0cmluZyApO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0Ly8gZmlsdGVyIHByb2R1Y3RzXG5cdFx0XHRcdHdjYXBmRmlsdGVyUHJvZHVjdHMoKTtcblx0XHRcdH1cblx0XHQpO1xuXG5cdFx0Ly8gaGFuZGxlIHRoZSBmaWx0ZXIgcmVxdWVzdCBmb3IgcmFuZ2UgbnVtYmVyXG5cdFx0JHdjYXBmTnVtYmVyUmFuZ2VGaWx0ZXJzLm9uKFxuXHRcdFx0J2lucHV0Jyxcblx0XHRcdCcud2NhcGYtcmFuZ2UtbnVtYmVyIC5taW4tdmFsdWUsIC53Y2FwZi1yYW5nZS1udW1iZXIgLm1heC12YWx1ZScsXG5cdFx0XHRmdW5jdGlvbiggZXZlbnQgKSB7XG5cdFx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cblx0XHRcdFx0Y29uc3QgJGl0ZW0gPSAkKCB0aGlzICk7XG5cblx0XHRcdFx0Ly8gQ2xlYXIgYW55IHByZXZpb3VzbHkgc2V0IHRpbWVyIGJlZm9yZSBzZXR0aW5nIGEgZnJlc2ggb25lXG5cdFx0XHRcdGNsZWFyVGltZW91dCggJGl0ZW0uZGF0YSggJ3RpbWVyJyApICk7XG5cblx0XHRcdFx0JGl0ZW0uZGF0YSggJ3RpbWVyJywgc2V0VGltZW91dCggZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0JGl0ZW0ucmVtb3ZlRGF0YSggJ3RpbWVyJyApO1xuXG5cdFx0XHRcdFx0Y29uc3QgJHJhbmdlTnVtYmVyICA9ICRpdGVtLmNsb3Nlc3QoICcud2NhcGYtcmFuZ2UtbnVtYmVyJyApO1xuXHRcdFx0XHRcdGNvbnN0IGZpbHRlcktleSAgICAgPSAkcmFuZ2VOdW1iZXIuYXR0ciggJ2RhdGEtZmlsdGVyLWtleScgKTtcblx0XHRcdFx0XHRjb25zdCByYW5nZU1pblZhbHVlID0gJHJhbmdlTnVtYmVyLmF0dHIoICdkYXRhLXJhbmdlLW1pbi12YWx1ZScgKTtcblx0XHRcdFx0XHRjb25zdCByYW5nZU1heFZhbHVlID0gJHJhbmdlTnVtYmVyLmF0dHIoICdkYXRhLXJhbmdlLW1heC12YWx1ZScgKTtcblx0XHRcdFx0XHRsZXQgbWluVmFsdWUgICAgICAgID0gJHJhbmdlTnVtYmVyLmZpbmQoICcubWluLXZhbHVlJyApLnZhbCgpO1xuXHRcdFx0XHRcdGxldCBtYXhWYWx1ZSAgICAgICAgPSAkcmFuZ2VOdW1iZXIuZmluZCggJy5tYXgtdmFsdWUnICkudmFsKCk7XG5cblx0XHRcdFx0XHQvLyBGb3JjZSB0aGUgbWluVmFsdWUgbm90IHRvIGJlIGVtcHR5LlxuXHRcdFx0XHRcdGlmICggISBtaW5WYWx1ZS5sZW5ndGggKSB7XG5cdFx0XHRcdFx0XHRtaW5WYWx1ZSA9IHJhbmdlTWluVmFsdWU7XG5cblx0XHRcdFx0XHRcdCRyYW5nZU51bWJlci5maW5kKCAnLm1pbi12YWx1ZScgKS52YWwoIG1pblZhbHVlICk7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0Ly8gRm9yY2UgdGhlIG1heFZhbHVlIG5vdCB0byBiZSBlbXB0eS5cblx0XHRcdFx0XHRpZiAoICEgbWF4VmFsdWUubGVuZ3RoICkge1xuXHRcdFx0XHRcdFx0bWF4VmFsdWUgPSByYW5nZU1heFZhbHVlO1xuXG5cdFx0XHRcdFx0XHQkcmFuZ2VOdW1iZXIuZmluZCggJy5tYXgtdmFsdWUnICkudmFsKCBtYXhWYWx1ZSApO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdC8vIEZvcmNlIHRoZSBtaW5WYWx1ZSBub3QgdG8gZ28gYmVsb3cgdGhlIHJhbmdlTWluVmFsdWUuXG5cdFx0XHRcdFx0aWYgKCBwYXJzZUZsb2F0KCBtaW5WYWx1ZSApIDwgcGFyc2VGbG9hdCggcmFuZ2VNaW5WYWx1ZSApICkge1xuXHRcdFx0XHRcdFx0bWluVmFsdWUgPSByYW5nZU1pblZhbHVlO1xuXG5cdFx0XHRcdFx0XHQkcmFuZ2VOdW1iZXIuZmluZCggJy5taW4tdmFsdWUnICkudmFsKCBtaW5WYWx1ZSApO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdC8vIEZvcmNlIHRoZSBtaW5WYWx1ZSBub3QgdG8gZ28gdXAgdGhlIHJhbmdlTWF4VmFsdWUuXG5cdFx0XHRcdFx0aWYgKCBwYXJzZUZsb2F0KCBtaW5WYWx1ZSApID4gcGFyc2VGbG9hdCggcmFuZ2VNYXhWYWx1ZSApICkge1xuXHRcdFx0XHRcdFx0bWluVmFsdWUgPSByYW5nZU1heFZhbHVlO1xuXG5cdFx0XHRcdFx0XHQkcmFuZ2VOdW1iZXIuZmluZCggJy5taW4tdmFsdWUnICkudmFsKCBtaW5WYWx1ZSApO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdC8vIEZvcmNlIHRoZSBtYXhWYWx1ZSBub3QgdG8gZ28gdXAgdGhlIHJhbmdlTWF4VmFsdWUuXG5cdFx0XHRcdFx0aWYgKCBwYXJzZUZsb2F0KCBtYXhWYWx1ZSApID4gcGFyc2VGbG9hdCggcmFuZ2VNYXhWYWx1ZSApICkge1xuXHRcdFx0XHRcdFx0bWF4VmFsdWUgPSByYW5nZU1heFZhbHVlO1xuXG5cdFx0XHRcdFx0XHQkcmFuZ2VOdW1iZXIuZmluZCggJy5tYXgtdmFsdWUnICkudmFsKCBtYXhWYWx1ZSApO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdC8vIEZvcmNlIHRoZSBtYXhWYWx1ZSBub3QgdG8gZ28gYmVsb3cgdGhlIG1pblZhbHVlLlxuXHRcdFx0XHRcdGlmICggcGFyc2VGbG9hdCggbWluVmFsdWUgKSA+IHBhcnNlRmxvYXQoIG1heFZhbHVlICkgKSB7XG5cdFx0XHRcdFx0XHRtYXhWYWx1ZSA9IG1pblZhbHVlO1xuXG5cdFx0XHRcdFx0XHQkcmFuZ2VOdW1iZXIuZmluZCggJy5tYXgtdmFsdWUnICkudmFsKCBtYXhWYWx1ZSApO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdGlmICggbWluVmFsdWUgPT09IHJhbmdlTWluVmFsdWUgJiYgbWF4VmFsdWUgPT09IHJhbmdlTWF4VmFsdWUgKSB7XG5cdFx0XHRcdFx0XHRjb25zdCBxdWVyeSA9IHdjYXBmUmVtb3ZlUXVlcnlTdHJpbmdQYXJhbWV0ZXIoIGZpbHRlcktleSApO1xuXHRcdFx0XHRcdFx0aGlzdG9yeS5wdXNoU3RhdGUoIHt9LCAnJywgcXVlcnkgKTtcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0Y29uc3QgZmlsdGVyVmFsU3RyaW5nID0gbWluVmFsdWUgKyByYW5nZVZhbHVlc1NlcGFyYXRvciArIG1heFZhbHVlO1xuXHRcdFx0XHRcdFx0d2NhcGZVcGRhdGVRdWVyeVN0cmluZ1BhcmFtZXRlciggZmlsdGVyS2V5LCBmaWx0ZXJWYWxTdHJpbmcgKTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHQvLyBmaWx0ZXIgcHJvZHVjdHNcblx0XHRcdFx0XHR3Y2FwZkZpbHRlclByb2R1Y3RzKCk7XG5cdFx0XHRcdH0sIGRlbGF5ICkgKTtcblx0XHRcdH1cblx0XHQpO1xuXG5cdFx0Ly8gaGFuZGxlIHJlbW92aW5nIHRoZSBhY3RpdmUgZmlsdGVyc1xuXHRcdCR3Y2FwZk5hdkZpbHRlcnMub24oXG5cdFx0XHQnY2xpY2snLFxuXHRcdFx0Jy53Y2FwZi1hY3RpdmUtZmlsdGVycyAuaXRlbScsXG5cdFx0XHRmdW5jdGlvbiggZXZlbnQgKSB7XG5cdFx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cblx0XHRcdFx0Y29uc3QgJGl0ZW0gICAgICAgPSAkKCB0aGlzICk7XG5cdFx0XHRcdGNvbnN0IGZpbHRlcktleSAgID0gJGl0ZW0uYXR0ciggJ2RhdGEtZmlsdGVyLWtleScgKTtcblx0XHRcdFx0Y29uc3QgZmlsdGVyVmFsdWUgPSAkaXRlbS5hdHRyKCAnZGF0YS12YWx1ZScgKTtcblxuXHRcdFx0XHR3Y2FwZk1ha2VQYXJhbWV0ZXJzKCBmaWx0ZXJLZXksIGZpbHRlclZhbHVlLCB0cnVlICk7XG5cdFx0XHR9XG5cdFx0KTtcblxuXHRcdGZ1bmN0aW9uIHJlc2V0RmlsdGVycyggJGJ1dHRvbiApIHtcblx0XHRcdGNvbnN0IF9maWx0ZXJLZXlzID0gJGJ1dHRvbi5hdHRyKCAnZGF0YS1rZXlzJyApO1xuXG5cdFx0XHRpZiAoICEgX2ZpbHRlcktleXMgKSB7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblxuXHRcdFx0Y29uc3QgZmlsdGVyS2V5cyA9IF9maWx0ZXJLZXlzLnNwbGl0KCAnLCcgKTtcblxuXHRcdFx0bGV0IHF1ZXJ5ID0gJyc7XG5cblx0XHRcdCQuZWFjaCggZmlsdGVyS2V5cywgZnVuY3Rpb24oIGksIGZpbHRlcktleSApIHtcblx0XHRcdFx0aWYgKCBxdWVyeSApIHtcblx0XHRcdFx0XHRxdWVyeSA9IHdjYXBmUmVtb3ZlUXVlcnlTdHJpbmdQYXJhbWV0ZXIoIGZpbHRlcktleSwgcXVlcnkgKTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRxdWVyeSA9IHdjYXBmUmVtb3ZlUXVlcnlTdHJpbmdQYXJhbWV0ZXIoIGZpbHRlcktleSApO1xuXHRcdFx0XHR9XG5cdFx0XHR9ICk7XG5cblx0XHRcdC8vIEVtcHR5IHF1ZXJ5IGNhdXNlcyBpc3N1ZShkb2Vzbid0IHJlbW92ZSB0aGUgZmlsdGVyIGtleXMgZnJvbSB0aGUgdXJsKSxcblx0XHRcdC8vIHRoaXMgaXMgd2h5IHdlIGFyZSBzZXR0aW5nIHRoZSBwYWdlIHVybCBhcyBxdWVyeS5cblx0XHRcdGlmICggISBxdWVyeSApIHtcblx0XHRcdFx0Y29uc3QgcHJldlVybCA9IHdpbmRvdy5sb2NhdGlvbi5ocmVmO1xuXHRcdFx0XHRjb25zdCBuZXdVcmwgID0gcHJldlVybC5zcGxpdCggJz8nICk7XG5cblx0XHRcdFx0cXVlcnkgPSBuZXdVcmxbIDAgXTtcblx0XHRcdH1cblxuXHRcdFx0aGlzdG9yeS5wdXNoU3RhdGUoIHt9LCAnJywgcXVlcnkgKTtcblxuXHRcdFx0Ly8gZmlsdGVyIHByb2R1Y3RzXG5cdFx0XHR3Y2FwZkZpbHRlclByb2R1Y3RzKCB0cnVlICk7XG5cdFx0fVxuXG5cdFx0Ly8gY2xlYXIgYWxsIGZpbHRlcnNcblx0XHQkd2NhcGZOYXZGaWx0ZXJzLm9uKFxuXHRcdFx0J2NsaWNrJyxcblx0XHRcdCcud2NhcGYtYWN0aXZlLWZpbHRlcnMgLndjYXBmLXJlc2V0LWZpbHRlcnMtYnRuJyxcblx0XHRcdGZ1bmN0aW9uKCBldmVudCApIHtcblx0XHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcblxuXHRcdFx0XHRjb25zdCAkYnV0dG9uID0gJCggdGhpcyApO1xuXG5cdFx0XHRcdHJlc2V0RmlsdGVycyggJGJ1dHRvbiApO1xuXHRcdFx0fVxuXHRcdCk7XG5cblx0XHQvLyByZXNldCBmaWx0ZXJzXG5cdFx0JHdjYXBmTmF2RmlsdGVycy5vbihcblx0XHRcdCdjbGljaycsXG5cdFx0XHQnLndjYXBmLXJlc2V0LWZpbHRlcnMtYnRuJyxcblx0XHRcdGZ1bmN0aW9uKCBldmVudCApIHtcblx0XHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcblxuXHRcdFx0XHRjb25zdCAkYnV0dG9uID0gJCggdGhpcyApO1xuXG5cdFx0XHRcdHJlc2V0RmlsdGVycyggJGJ1dHRvbiApO1xuXHRcdFx0fVxuXHRcdCk7XG5cblx0XHRmdW5jdGlvbiBmaWx0ZXJCeURhdGUoICRpbnB1dCApIHtcblx0XHRcdGNvbnN0ICR3Y2FwZkRhdGVGaWx0ZXIgPSAkaW5wdXQuY2xvc2VzdCggJy53Y2FwZi1kYXRlLWlucHV0JyApO1xuXHRcdFx0Y29uc3QgZmlsdGVyS2V5ICAgICAgICA9ICR3Y2FwZkRhdGVGaWx0ZXIuYXR0ciggJ2RhdGEtZmlsdGVyLWtleScgKTtcblx0XHRcdGNvbnN0IGlzUmFuZ2UgICAgICAgICAgPSAkd2NhcGZEYXRlRmlsdGVyLmF0dHIoICdkYXRhLWlzLXJhbmdlJyApO1xuXG5cdFx0XHRsZXQgZmlsdGVyVmFsdWUgPSAnJztcblx0XHRcdGxldCBydW5GaWx0ZXIgICA9IGZhbHNlO1xuXG5cdFx0XHQvLyBDbGVhciBhbnkgcHJldmlvdXNseSBzZXQgdGltZXIgYmVmb3JlIHNldHRpbmcgYSBmcmVzaCBvbmVcblx0XHRcdGNsZWFyVGltZW91dCggJHdjYXBmRGF0ZUZpbHRlci5kYXRhKCAndGltZXInICkgKTtcblxuXHRcdFx0aWYgKCBpc1JhbmdlICkge1xuXHRcdFx0XHRjb25zdCBmcm9tID0gJHdjYXBmRGF0ZUZpbHRlci5maW5kKCAnLmRhdGUtZnJvbS1pbnB1dCcgKS52YWwoKTtcblx0XHRcdFx0Y29uc3QgdG8gICA9ICR3Y2FwZkRhdGVGaWx0ZXIuZmluZCggJy5kYXRlLXRvLWlucHV0JyApLnZhbCgpO1xuXG5cdFx0XHRcdGlmICggZnJvbSAmJiB0byApIHtcblx0XHRcdFx0XHRmaWx0ZXJWYWx1ZSA9IGZyb20gKyByYW5nZVZhbHVlc1NlcGFyYXRvciArIHRvO1xuXHRcdFx0XHRcdHJ1bkZpbHRlciAgID0gdHJ1ZTtcblx0XHRcdFx0fSBlbHNlIGlmICggISBmcm9tICYmICEgdG8gKSB7XG5cdFx0XHRcdFx0cnVuRmlsdGVyID0gdHJ1ZTtcblx0XHRcdFx0fVxuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0Y29uc3QgZnJvbSA9ICR3Y2FwZkRhdGVGaWx0ZXIuZmluZCggJy5kYXRlLWZyb20taW5wdXQnICkudmFsKCk7XG5cblx0XHRcdFx0aWYgKCBmcm9tICkge1xuXHRcdFx0XHRcdGZpbHRlclZhbHVlID0gZnJvbTtcblx0XHRcdFx0XHRydW5GaWx0ZXIgICA9IHRydWU7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0cnVuRmlsdGVyID0gdHJ1ZTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0XHRpZiAoIHJ1bkZpbHRlciApIHtcblx0XHRcdFx0JHdjYXBmRGF0ZUZpbHRlci5kYXRhKCAndGltZXInLCBzZXRUaW1lb3V0KCBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHQkd2NhcGZEYXRlRmlsdGVyLnJlbW92ZURhdGEoICd0aW1lcicgKTtcblxuXHRcdFx0XHRcdGlmICggZmlsdGVyVmFsdWUgKSB7XG5cdFx0XHRcdFx0XHR3Y2FwZlVwZGF0ZVF1ZXJ5U3RyaW5nUGFyYW1ldGVyKCBmaWx0ZXJLZXksIGZpbHRlclZhbHVlICk7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdGNvbnN0IHF1ZXJ5ID0gd2NhcGZSZW1vdmVRdWVyeVN0cmluZ1BhcmFtZXRlciggZmlsdGVyS2V5ICk7XG5cdFx0XHRcdFx0XHRoaXN0b3J5LnB1c2hTdGF0ZSgge30sICcnLCBxdWVyeSApO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdC8vIGZpbHRlciBwcm9kdWN0c1xuXHRcdFx0XHRcdHdjYXBmRmlsdGVyUHJvZHVjdHMoKTtcblx0XHRcdFx0fSwgZGVsYXkgKSApO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdCR3Y2FwZlNpbmdsZUZpbHRlcnMub24oICdjbGVhcl9maWx0ZXInLCBmdW5jdGlvbigpIHtcblx0XHRcdGNvbnN0ICRmaWVsZCAgICA9ICQoIHRoaXMgKTtcblx0XHRcdGNvbnN0IGZpZWxkSUQgICA9ICRmaWVsZC5hdHRyKCAnZGF0YS1pZCcgKTtcblx0XHRcdGNvbnN0IGZpZWxkRGF0YSA9IGZpZWxkc1sgZmllbGRJRCBdO1xuXHRcdFx0Y29uc3QgZmlsdGVyS2V5ID0gZmllbGREYXRhLmZpbHRlcktleTtcblxuXHRcdFx0Y29uc3QgcXVlcnkgPSB3Y2FwZlJlbW92ZVF1ZXJ5U3RyaW5nUGFyYW1ldGVyKCBmaWx0ZXJLZXkgKTtcblx0XHRcdGhpc3RvcnkucHVzaFN0YXRlKCB7fSwgJycsIHF1ZXJ5ICk7XG5cblx0XHRcdC8vIGZpbHRlciBwcm9kdWN0c1xuXHRcdFx0d2NhcGZGaWx0ZXJQcm9kdWN0cyggdHJ1ZSApO1xuXHRcdH0gKTtcblxuXHRcdC8vIGhpc3RvcnkgYmFjayBhbmQgZm9yd2FyZCByZXF1ZXN0IGhhbmRsaW5nXG5cdFx0JCggd2luZG93ICkuYmluZCggJ3BvcHN0YXRlJywgZnVuY3Rpb24oKSB7XG5cdFx0XHQvLyBmaWx0ZXIgcHJvZHVjdHNcblx0XHRcdHdjYXBmRmlsdGVyUHJvZHVjdHMoIHRydWUgKTtcblx0XHR9ICk7XG5cblx0fVxuKTtcbiJdfQ==
