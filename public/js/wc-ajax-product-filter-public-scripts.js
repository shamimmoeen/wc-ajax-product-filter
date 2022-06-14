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
  var $body = $('body');
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

        $body.trigger('wcapf-nouislider-update', [$item, values]);
      });

      function filterProductsAccordingToSlider(values) {
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
    $body.trigger('wcapf_before_update_filters');
  } // scroll to top


  function wcapfAfterUpdate() {
    initChosen();
    initHierarchyAccordion();
    initNoUISlider();
    initDatepicker();
    $body.trigger('wcapf_after_update_filters');
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
  } // clear/reset all filters


  $body.on('wcapf-reset-filters', function (e, $button) {
    resetFilters($button);
  });
  $wcapfNavFilters.on('click', '.wcapf-reset-filters-btn', function (event) {
    event.preventDefault();
    var $button = $(this);
    $body.trigger('wcapf-reset-filters', [$button]);
  });
  $wcapfSingleFilters.on('wcapf-clear-filter', function () {
    var $field = $(this);
    var fieldID = $field.attr('data-id');
    var fieldData = fields[fieldID];
    var filterKey = fieldData.filterKey;
    var query = wcapfRemoveQueryStringParameter(filterKey);
    history.pushState({}, '', query); // filter products

    wcapfFilterProducts(true);
  });
  $body.on('wcapf-run-filter-products', function (e, forceReRender) {
    wcapfFilterProducts(forceReRender);
  }); // history back and forward request handling

  $(window).bind('popstate', function () {
    // filter products
    wcapfFilterProducts(true);
  });
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNob3Nlbi5qcyIsImZpbHRlci1mb3JtLmpzIl0sIm5hbWVzIjpbImpRdWVyeSIsImRvY3VtZW50IiwicmVhZHkiLCIkIiwid2NhcGZfcGFyYW1zIiwiJGJvZHkiLCJyYW5nZVZhbHVlc1NlcGFyYXRvciIsIl9kZWxheSIsInBhcnNlSW50IiwiZmlsdGVyX2lucHV0X2RlbGF5IiwiZGVsYXkiLCJmaWVsZHMiLCIkd2NhcGZTaW5nbGVGaWx0ZXJzIiwiJHdjYXBmTmF2RmlsdGVycyIsIiR3Y2FwZk51bWJlclJhbmdlRmlsdGVycyIsImVhY2giLCIkZmllbGQiLCJpZCIsImF0dHIiLCIkd3JhcHBlciIsImZpbmQiLCJmaWx0ZXJLZXkiLCJtdWx0aXBsZUZpbHRlciIsImluaXRDaG9zZW4iLCJjaG9zZW4iLCIkdGhpcyIsIm9wdGlvbnMiLCJub1Jlc3VsdHNNZXNzYWdlIiwic2VhcmNoVGhyZXNob2xkIiwiY2hvc2VuX2xpYl9zZWFyY2hfdGhyZXNob2xkIiwiaW5pdEhpZXJhcmNoeUFjY29yZGlvbiIsIm9uIiwidG9nZ2xlQ2xhc3MiLCJudW1iZXJfZm9ybWF0IiwibnVtYmVyIiwiZGVjaW1hbHMiLCJkZWNfcG9pbnQiLCJ0aG91c2FuZHNfc2VwIiwicmVwbGFjZSIsIm4iLCJpc0Zpbml0ZSIsInByZWMiLCJNYXRoIiwiYWJzIiwic2VwIiwiZGVjIiwicyIsInRvRml4ZWRGaXgiLCJrIiwicG93Iiwicm91bmQiLCJzcGxpdCIsImxlbmd0aCIsIkFycmF5Iiwiam9pbiIsImluaXROb1VJU2xpZGVyIiwibm9VaVNsaWRlciIsIiRpdGVtIiwiJHNsaWRlciIsImhhc0NsYXNzIiwic2xpZGVySWQiLCJkaXNwbGF5VmFsdWVzQXMiLCJyYW5nZU1pblZhbHVlIiwicGFyc2VGbG9hdCIsInJhbmdlTWF4VmFsdWUiLCJzdGVwIiwiZGVjaW1hbFBsYWNlcyIsInRob3VzYW5kU2VwYXJhdG9yIiwiZGVjaW1hbFNlcGFyYXRvciIsIm1pblZhbHVlIiwibWF4VmFsdWUiLCIkbWluVmFsdWUiLCIkbWF4VmFsdWUiLCJzbGlkZXIiLCJnZXRFbGVtZW50QnlJZCIsImNyZWF0ZSIsInN0YXJ0IiwiY29ubmVjdCIsImNzc1ByZWZpeCIsInJhbmdlIiwidmFsdWVzIiwiaHRtbCIsInZhbCIsInRyaWdnZXIiLCJmaWx0ZXJQcm9kdWN0c0FjY29yZGluZ1RvU2xpZGVyIiwicXVlcnkiLCJ3Y2FwZlJlbW92ZVF1ZXJ5U3RyaW5nUGFyYW1ldGVyIiwiaGlzdG9yeSIsInB1c2hTdGF0ZSIsImZpbHRlclZhbFN0cmluZyIsIndjYXBmVXBkYXRlUXVlcnlTdHJpbmdQYXJhbWV0ZXIiLCJ3Y2FwZkZpbHRlclByb2R1Y3RzIiwiY2xlYXJUaW1lb3V0IiwiZGF0YSIsInNldFRpbWVvdXQiLCJyZW1vdmVEYXRhIiwiZXZlbnQiLCJwcmV2ZW50RGVmYXVsdCIsIiRpbnB1dCIsInNldCIsImdldCIsImZpbHRlckJ5RGF0ZSIsIiR3Y2FwZkRhdGVGaWx0ZXIiLCJjbG9zZXN0IiwiaXNSYW5nZSIsImZpbHRlclZhbHVlIiwicnVuRmlsdGVyIiwiZnJvbSIsInRvIiwiaW5pdERhdGVwaWNrZXIiLCJkYXRlcGlja2VyIiwiJHdjYXBmRGF0ZUZpbHRlcnMiLCJmb3JtYXQiLCJ5ZWFyRHJvcGRvd24iLCJtb250aERyb3Bkb3duIiwiJGZyb20iLCIkdG8iLCJkYXRlRm9ybWF0IiwiY2hhbmdlWWVhciIsImNoYW5nZU1vbnRoIiwid2NhcGZCZWZvcmVVcGRhdGUiLCJ3Y2FwZkFmdGVyVXBkYXRlIiwiZm9yY2VSZVJlbmRlciIsIndpbmRvdyIsImxvY2F0aW9uIiwiaHJlZiIsIiRkYXRhIiwiJHNob3BMb29wQ29udGFpbmVyIiwic2hvcF9sb29wX2NvbnRhaW5lciIsIiRub3RGb3VuZENvbnRhaW5lciIsIm5vdF9mb3VuZF9jb250YWluZXIiLCJmaWVsZElEIiwiJGlubmVyIiwiX2ZpZWxkIiwiZmllbGRDbGFzcyIsIl9odG1sIiwiY3VzdG9tX3NjcmlwdHMiLCJldmFsIiwid2NhcGZHZXRVcmxWYXJzIiwidXJsIiwidmFycyIsImhhc2giLCJyZXBsYWNlQWxsIiwiaGFzaGVzIiwic2xpY2UiLCJpbmRleE9mIiwiaExlbmd0aCIsImkiLCJ3Y2FwZkZpeFBhZ2luYXRpb24iLCJwYXJhbXMiLCJjdXJyZW50UGFnZUluVXJsIiwiY3VycmVudFBhZ2VJblBhcmFtcyIsImtleSIsInZhbHVlIiwicHVzaEhpc3RvcnkiLCJyZSIsIlJlZ0V4cCIsInNlcGFyYXRvciIsInVybFdpdGhRdWVyeSIsIm1hdGNoIiwib2xkUGFyYW1zIiwib2xkUGFyYW1zTGVuZ3RoIiwiT2JqZWN0Iiwia2V5cyIsInN0YXJ0UG9zaXRpb24iLCJmaWx0ZXJLZXlQb3NpdGlvbiIsImNsZWFuVXJsIiwiY2xlYW5RdWVyeSIsIm5ld1BhcmFtcyIsIndjYXBmTWFrZVBhcmFtZXRlcnMiLCJmb3JjZVJlcmVuZGVyIiwidmFsdWVTZXBhcmF0b3IiLCJuZXh0VmFsdWVzIiwiZW1wdHlWYWx1ZSIsInByZXZWYWx1ZXMiLCJwcmV2VmFsdWVzQXJyYXkiLCJmb3VuZCIsImluQXJyYXkiLCJzcGxpY2UiLCJwdXNoIiwid2NhcGZTaW5nbGVGaWx0ZXIiLCJoYW5kbGVGaWx0ZXJSZXF1ZXN0IiwiZmllbGREYXRhIiwidG9TdHJpbmciLCIkcmFuZ2VOdW1iZXIiLCJyZXNldEZpbHRlcnMiLCIkYnV0dG9uIiwiX2ZpbHRlcktleXMiLCJmaWx0ZXJLZXlzIiwicHJldlVybCIsIm5ld1VybCIsImUiLCJiaW5kIl0sIm1hcHBpbmdzIjoiOztBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUFBLE1BQU0sQ0FBRUMsUUFBRixDQUFOLENBQW1CQyxLQUFuQixDQUEwQixVQUFVQyxDQUFWLEVBQWMsQ0FJdkMsQ0FKRDs7O0FDWEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBLElBQU1DLFlBQVksR0FBR0EsWUFBWSxJQUFJO0FBQ3BDLHdCQUFzQixFQURjO0FBRXBDLGlDQUErQixFQUZLO0FBR3BDLHlC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UUFBTTlHLFNBQVMsR0FBR2lLLFNBQVMsQ0FBQ2pLLFNBQTVCO0FBRUEsUUFBTWdFLEtBQUssR0FBR0MsK0JBQStCLENBQUVqRSxTQUFGLENBQTdDO0FBQ0FrRSxJQUFBQSxPQUFPLENBQUNDLFNBQVIsQ0FBbUIsRUFBbkIsRUFBdUIsRUFBdkIsRUFBMkJILEtBQTNCLEVBUHdELENBU3hEOztBQUNBTSxJQUFBQSxtQkFBbUIsQ0FBRSxJQUFGLENBQW5CO0FBQ0EsR0FYRDtBQWFBdEYsRUFBQUEsS0FBSyxDQUFDMEIsRUFBTixDQUFVLDJCQUFWLEVBQXVDLFVBQVVnSyxDQUFWLEVBQWFyRSxhQUFiLEVBQTZCO0FBQ25FL0IsSUFBQUEsbUJBQW1CLENBQUUrQixhQUFGLENBQW5CO0FBQ0EsR0FGRCxFQWoxQmEsQ0FxMUJiOztBQUNBdkgsRUFBQUEsQ0FBQyxDQUFFd0gsTUFBRixDQUFELENBQVlxRSxJQUFaLENBQWtCLFVBQWxCLEVBQThCLFlBQVc7QUFDeEM7QUFDQXJHLElBQUFBLG1CQUFtQixDQUFFLElBQUYsQ0FBbkI7QUFDQSxHQUhEO0FBS0EsQ0E1MUJGIiwiZmlsZSI6IndjLWFqYXgtcHJvZHVjdC1maWx0ZXItcHVibGljLXNjcmlwdHMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIERpc3BsYXkgdHlwZSBmaWVsZHMuXG4gKlxuICogVE9ETzogTWF5YmUgZGVsZXRlLlxuICpcbiAqIEBzaW5jZSAgICAgIDMuMC4wXG4gKiBAcGFja2FnZSAgICB3Yy1hamF4LXByb2R1Y3QtZmlsdGVyXG4gKiBAc3VicGFja2FnZSB3Yy1hamF4LXByb2R1Y3QtZmlsdGVyL2FkbWluL3NyYy9qc1xuICogQGF1dGhvciAgICAgTWFpbnVsIEhhc3NhbiBNYWluXG4gKi9cblxualF1ZXJ5KCBkb2N1bWVudCApLnJlYWR5KCBmdW5jdGlvbiggJCApIHtcblxuXG5cbn0gKTtcbiIsIi8qKlxuICogVGhlIGZyb250ZW5kIGZpbHRlciBmb3JtLlxuICpcbiAqIEBzaW5jZSAgICAgIDMuMC4wXG4gKiBAcGFja2FnZSAgICB3Yy1hamF4LXByb2R1Y3QtZmlsdGVyXG4gKiBAc3VicGFja2FnZSB3Yy1hamF4LXByb2R1Y3QtZmlsdGVyL3B1YmxpYy9zcmMvanNcbiAqIEBhdXRob3IgICAgIE1haW51bCBIYXNzYW4gTWFpblxuICovXG5cbmNvbnN0IHdjYXBmX3BhcmFtcyA9IHdjYXBmX3BhcmFtcyB8fCB7XG5cdCdmaWx0ZXJfaW5wdXRfZGVsYXknOiAnJyxcblx0J2Nob3Nlbl9saWJfc2VhcmNoX3RocmVzaG9sZCc6ICcnLFxuXHQnc2hvcF9sb29wX2NvbnRhaW5lcic6ICcnLFxuXHQnbm90X2ZvdW5kX2NvbnRhaW5lcic6ICcnLFxuXHQncGFnaW5hdGlvbl9jb250YWluZXInOiAnJywgLy8gdG9kb1xuXHQnc29ydGluZ19jb250cm9sJzogJycsIC8vIHRvZG9cblx0J3Njcm9sbF90b190b3AnOiAnJywgLy8gdG9kb1xuXHQnc2Nyb2xsX3RvX3RvcF9vZmZzZXQnOiAnJywgLy8gdG9kb1xuXHQnY3VzdG9tX3NjcmlwdHMnOiAnJyxcbn07XG5cbmpRdWVyeSggZG9jdW1lbnQgKS5yZWFkeShcblx0ZnVuY3Rpb24oICQgKSB7XG5cblx0XHRjb25zdCAkYm9keSA9ICQoICdib2R5JyApO1xuXG5cdFx0Y29uc3QgcmFuZ2VWYWx1ZXNTZXBhcmF0b3IgPSAnfic7XG5cblx0XHQvLyByZXR1cm4gZmFsc2UgaWYgd2NhcGZfcGFyYW1zIHZhcmlhYmxlIGlzIG5vdCBmb3VuZFxuXHRcdGlmICggdHlwZW9mIHdjYXBmX3BhcmFtcyA9PT0gJ3VuZGVmaW5lZCcgKSB7XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fVxuXG5cdFx0Y29uc3QgX2RlbGF5ID0gcGFyc2VJbnQoIHdjYXBmX3BhcmFtcy5maWx0ZXJfaW5wdXRfZGVsYXkgKTtcblx0XHRjb25zdCBkZWxheSAgPSBfZGVsYXkgPj0gMCA/IF9kZWxheSA6IDgwMDtcblxuXHRcdC8vIHN0b3JlIGZpZWxkcycgaWQgYW5kIGZpbHRlciBpbmZvcm1hdGlvblxuXHRcdGNvbnN0IGZpZWxkcyA9IHt9O1xuXG5cdFx0Y29uc3QgJHdjYXBmU2luZ2xlRmlsdGVycyAgICAgID0gJCggJy53Y2FwZi1zaW5nbGUtZmlsdGVyJyApO1xuXHRcdGNvbnN0ICR3Y2FwZk5hdkZpbHRlcnMgICAgICAgICA9ICQoICcud2NhcGYtbmF2LWZpbHRlcicgKTtcblx0XHRjb25zdCAkd2NhcGZOdW1iZXJSYW5nZUZpbHRlcnMgPSAkKCAnLndjYXBmLW51bWJlci1yYW5nZS1maWx0ZXInICk7XG5cblx0XHQkd2NhcGZTaW5nbGVGaWx0ZXJzLmVhY2goXG5cdFx0XHRmdW5jdGlvbigpIHtcblx0XHRcdFx0Y29uc3QgJGZpZWxkICAgICAgICAgPSAkKCB0aGlzICk7XG5cdFx0XHRcdGNvbnN0IGlkICAgICAgICAgICAgID0gJGZpZWxkLmF0dHIoICdkYXRhLWlkJyApO1xuXHRcdFx0XHRjb25zdCAkd3JhcHBlciAgICAgICA9ICRmaWVsZC5maW5kKCAnLndjYXBmLWZpZWxkLWlubmVyID4gZGl2JyApO1xuXHRcdFx0XHRjb25zdCBmaWx0ZXJLZXkgICAgICA9ICR3cmFwcGVyLmF0dHIoICdkYXRhLWZpbHRlci1rZXknICk7XG5cdFx0XHRcdGNvbnN0IG11bHRpcGxlRmlsdGVyID0gcGFyc2VJbnQoICR3cmFwcGVyLmF0dHIoICdkYXRhLW11bHRpcGxlLWZpbHRlcicgKSApO1xuXG5cdFx0XHRcdGZpZWxkc1sgaWQgXSA9IHtcblx0XHRcdFx0XHRmaWx0ZXJLZXk6IGZpbHRlcktleSxcblx0XHRcdFx0XHRtdWx0aXBsZUZpbHRlcjogbXVsdGlwbGVGaWx0ZXJcblx0XHRcdFx0fTtcblx0XHRcdH1cblx0XHQpO1xuXG5cdFx0Ly8gSW5pdGlhbGl6ZSBqUXVlcnkgY2hvc2VuIGxpYnJhcnlcblx0XHRmdW5jdGlvbiBpbml0Q2hvc2VuKCkge1xuXHRcdFx0aWYgKCAhIGpRdWVyeSgpLmNob3NlbiApIHtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXG5cdFx0XHQkd2NhcGZOYXZGaWx0ZXJzLmZpbmQoICcud2NhcGYtY2hvc2VuLXNlbGVjdCcgKS5lYWNoKCBmdW5jdGlvbigpIHtcblx0XHRcdFx0Y29uc3QgJHRoaXMgICA9ICQoIHRoaXMgKTtcblx0XHRcdFx0Y29uc3Qgb3B0aW9ucyA9IHt9O1xuXG5cdFx0XHRcdGNvbnN0IG5vUmVzdWx0c01lc3NhZ2UgPSAkdGhpcy5hdHRyKCAnZGF0YS1uby1yZXN1bHRzLW1lc3NhZ2UnICk7XG5cblx0XHRcdFx0aWYgKCBub1Jlc3VsdHNNZXNzYWdlICkge1xuXHRcdFx0XHRcdG9wdGlvbnNbICdub19yZXN1bHRzX3RleHQnIF0gPSBub1Jlc3VsdHNNZXNzYWdlO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0Y29uc3Qgc2VhcmNoVGhyZXNob2xkID0gcGFyc2VJbnQoIHdjYXBmX3BhcmFtcy5jaG9zZW5fbGliX3NlYXJjaF90aHJlc2hvbGQgKTtcblxuXHRcdFx0XHRpZiAoIHNlYXJjaFRocmVzaG9sZCApIHtcblx0XHRcdFx0XHRvcHRpb25zWyAnZGlzYWJsZV9zZWFyY2hfdGhyZXNob2xkJyBdID0gc2VhcmNoVGhyZXNob2xkO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0JHRoaXMuY2hvc2VuKCBvcHRpb25zICk7XG5cdFx0XHR9ICk7XG5cdFx0fVxuXG5cdFx0aW5pdENob3NlbigpO1xuXG5cdFx0Ly8gSW5pdGlhbGl6ZSBoaWVyYXJjaHkgYWNjb3JkaW9uXG5cdFx0ZnVuY3Rpb24gaW5pdEhpZXJhcmNoeUFjY29yZGlvbigpIHtcblx0XHRcdCR3Y2FwZk5hdkZpbHRlcnMuZmluZCggJy5oaWVyYXJjaHktYWNjb3JkaW9uLXRvZ2dsZScgKS5vbiggJ2NsaWNrJywgZnVuY3Rpb24oKSB7XG5cdFx0XHRcdCQoIHRoaXMgKS50b2dnbGVDbGFzcyggJ2FjdGl2ZScgKTtcblx0XHRcdH0gKTtcblx0XHR9XG5cblx0XHRpbml0SGllcmFyY2h5QWNjb3JkaW9uKCk7XG5cblx0XHQvKipcblx0XHQgKiBAc291cmNlIGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vYS8zNDE0MTgxM1xuXHRcdCAqXG5cdFx0ICogQHBhcmFtIG51bWJlclxuXHRcdCAqIEBwYXJhbSBkZWNpbWFsc1xuXHRcdCAqIEBwYXJhbSBkZWNfcG9pbnRcblx0XHQgKiBAcGFyYW0gdGhvdXNhbmRzX3NlcFxuXHRcdCAqXG5cdFx0ICogQHJldHVybnMge3N0cmluZ31cblx0XHQgKi9cblx0XHRmdW5jdGlvbiBudW1iZXJfZm9ybWF0KCBudW1iZXIsIGRlY2ltYWxzLCBkZWNfcG9pbnQsIHRob3VzYW5kc19zZXAgKSB7XG5cdFx0XHQvLyBTdHJpcCBhbGwgY2hhcmFjdGVycyBidXQgbnVtZXJpY2FsIG9uZXMuXG5cdFx0XHRudW1iZXIgPSAoIG51bWJlciArICcnICkucmVwbGFjZSggL1teXFxkK1xcLUVlLl0vZywgJycgKTtcblxuXHRcdFx0Y29uc3QgbiAgICA9ICEgaXNGaW5pdGUoICtudW1iZXIgKSA/IDAgOiArbnVtYmVyO1xuXHRcdFx0Y29uc3QgcHJlYyA9ICEgaXNGaW5pdGUoICtkZWNpbWFscyApID8gMCA6IE1hdGguYWJzKCBkZWNpbWFscyApO1xuXHRcdFx0Y29uc3Qgc2VwICA9ICggdHlwZW9mIHRob3VzYW5kc19zZXAgPT09ICd1bmRlZmluZWQnICkgPyAnLCcgOiB0aG91c2FuZHNfc2VwO1xuXHRcdFx0Y29uc3QgZGVjICA9ICggdHlwZW9mIGRlY19wb2ludCA9PT0gJ3VuZGVmaW5lZCcgKSA/ICcuJyA6IGRlY19wb2ludDtcblxuXHRcdFx0bGV0IHM7XG5cblx0XHRcdGNvbnN0IHRvRml4ZWRGaXggPSBmdW5jdGlvbiggbiwgcHJlYyApIHtcblx0XHRcdFx0Y29uc3QgayA9IE1hdGgucG93KCAxMCwgcHJlYyApO1xuXHRcdFx0XHRyZXR1cm4gJycgKyBNYXRoLnJvdW5kKCBuICogayApIC8gaztcblx0XHRcdH07XG5cblx0XHRcdC8vIEZpeCBmb3IgSUUgcGFyc2VGbG9hdCgwLjU1KS50b0ZpeGVkKDApID0gMDtcblx0XHRcdHMgPSAoIHByZWMgPyB0b0ZpeGVkRml4KCBuLCBwcmVjICkgOiAnJyArIE1hdGgucm91bmQoIG4gKSApLnNwbGl0KCAnLicgKTtcblxuXHRcdFx0aWYgKCBzWyAwIF0ubGVuZ3RoID4gMyApIHtcblx0XHRcdFx0c1sgMCBdID0gc1sgMCBdLnJlcGxhY2UoIC9cXEIoPz0oPzpcXGR7M30pKyg/IVxcZCkpL2csIHNlcCApO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAoICggc1sgMSBdIHx8ICcnICkubGVuZ3RoIDwgcHJlYyApIHtcblx0XHRcdFx0c1sgMSBdID0gc1sgMSBdIHx8ICcnO1xuXHRcdFx0XHRzWyAxIF0gKz0gbmV3IEFycmF5KCBwcmVjIC0gc1sgMSBdLmxlbmd0aCArIDEgKS5qb2luKCAnMCcgKTtcblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuIHMuam9pbiggZGVjICk7XG5cdFx0fVxuXG5cdFx0Ly8gSW5pdGlhbGl6ZSBub1VJU2xpZGVyXG5cdFx0ZnVuY3Rpb24gaW5pdE5vVUlTbGlkZXIoKSB7XG5cdFx0XHRpZiAoICd1bmRlZmluZWQnID09PSB0eXBlb2Ygbm9VaVNsaWRlciApIHtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXG5cdFx0XHQkd2NhcGZOdW1iZXJSYW5nZUZpbHRlcnMuZmluZCggJy53Y2FwZi1yYW5nZS1zbGlkZXInICkuZWFjaCggZnVuY3Rpb24oKSB7XG5cdFx0XHRcdGNvbnN0ICRpdGVtID0gJCggdGhpcyApO1xuXG5cdFx0XHRcdGNvbnN0IGZpbHRlcktleSA9ICRpdGVtLmF0dHIoICdkYXRhLWZpbHRlci1rZXknICk7XG5cdFx0XHRcdGNvbnN0ICRzbGlkZXIgICA9ICRpdGVtLmZpbmQoICcud2NhcGYtbm91aS1zbGlkZXInICk7XG5cblx0XHRcdFx0Ly8gSWYgc2xpZGVyIGlzIGFscmVhZHkgaW5pdGlhbGl6ZWQgdGhlbiBkb24ndCByZWluaXRpYWxpemUgYWdhaW4uXG5cdFx0XHRcdGlmICggJHNsaWRlci5oYXNDbGFzcyggJ3djYXBmLW5vdWktdGFyZ2V0JyApICkge1xuXHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGNvbnN0IHNsaWRlcklkICAgICAgICAgID0gJHNsaWRlci5hdHRyKCAnaWQnICk7XG5cdFx0XHRcdGNvbnN0IGRpc3BsYXlWYWx1ZXNBcyAgID0gJGl0ZW0uYXR0ciggJ2RhdGEtZGlzcGxheS12YWx1ZXMtYXMnICk7XG5cdFx0XHRcdGNvbnN0IHJhbmdlTWluVmFsdWUgICAgID0gcGFyc2VGbG9hdCggJGl0ZW0uYXR0ciggJ2RhdGEtcmFuZ2UtbWluLXZhbHVlJyApICk7XG5cdFx0XHRcdGNvbnN0IHJhbmdlTWF4VmFsdWUgICAgID0gcGFyc2VGbG9hdCggJGl0ZW0uYXR0ciggJ2RhdGEtcmFuZ2UtbWF4LXZhbHVlJyApICk7XG5cdFx0XHRcdGNvbnN0IHN0ZXAgICAgICAgICAgICAgID0gcGFyc2VGbG9hdCggJGl0ZW0uYXR0ciggJ2RhdGEtc3RlcCcgKSApO1xuXHRcdFx0XHRjb25zdCBkZWNpbWFsUGxhY2VzICAgICA9ICRpdGVtLmF0dHIoICdkYXRhLWRlY2ltYWwtcGxhY2VzJyApO1xuXHRcdFx0XHRjb25zdCB0aG91c2FuZFNlcGFyYXRvciA9ICRpdGVtLmF0dHIoICdkYXRhLXRob3VzYW5kLXNlcGFyYXRvcicgKTtcblx0XHRcdFx0Y29uc3QgZGVjaW1hbFNlcGFyYXRvciAgPSAkaXRlbS5hdHRyKCAnZGF0YS1kZWNpbWFsLXNlcGFyYXRvcicgKTtcblx0XHRcdFx0Y29uc3QgbWluVmFsdWUgICAgICAgICAgPSBwYXJzZUZsb2F0KCAkaXRlbS5hdHRyKCAnZGF0YS1taW4tdmFsdWUnICkgKTtcblx0XHRcdFx0Y29uc3QgbWF4VmFsdWUgICAgICAgICAgPSBwYXJzZUZsb2F0KCAkaXRlbS5hdHRyKCAnZGF0YS1tYXgtdmFsdWUnICkgKTtcblx0XHRcdFx0Y29uc3QgJG1pblZhbHVlICAgICAgICAgPSAkaXRlbS5maW5kKCAnLm1pbi12YWx1ZScgKTtcblx0XHRcdFx0Y29uc3QgJG1heFZhbHVlICAgICAgICAgPSAkaXRlbS5maW5kKCAnLm1heC12YWx1ZScgKTtcblxuXHRcdFx0XHRjb25zdCBzbGlkZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCggc2xpZGVySWQgKTtcblxuXHRcdFx0XHRub1VpU2xpZGVyLmNyZWF0ZSggc2xpZGVyLCB7XG5cdFx0XHRcdFx0c3RhcnQ6IFsgbWluVmFsdWUsIG1heFZhbHVlIF0sXG5cdFx0XHRcdFx0c3RlcCxcblx0XHRcdFx0XHRjb25uZWN0OiB0cnVlLFxuXHRcdFx0XHRcdGNzc1ByZWZpeDogJ3djYXBmLW5vdWktJyxcblx0XHRcdFx0XHRyYW5nZToge1xuXHRcdFx0XHRcdFx0J21pbic6IHJhbmdlTWluVmFsdWUsXG5cdFx0XHRcdFx0XHQnbWF4JzogcmFuZ2VNYXhWYWx1ZSxcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0gKTtcblxuXHRcdFx0XHRzbGlkZXIubm9VaVNsaWRlci5vbiggJ3VwZGF0ZScsIGZ1bmN0aW9uKCB2YWx1ZXMgKSB7XG5cdFx0XHRcdFx0Y29uc3QgbWluVmFsdWUgPSBudW1iZXJfZm9ybWF0KCB2YWx1ZXNbIDAgXSwgZGVjaW1hbFBsYWNlcywgZGVjaW1hbFNlcGFyYXRvciwgdGhvdXNhbmRTZXBhcmF0b3IgKTtcblx0XHRcdFx0XHRjb25zdCBtYXhWYWx1ZSA9IG51bWJlcl9mb3JtYXQoIHZhbHVlc1sgMSBdLCBkZWNpbWFsUGxhY2VzLCBkZWNpbWFsU2VwYXJhdG9yLCB0aG91c2FuZFNlcGFyYXRvciApO1xuXG5cdFx0XHRcdFx0aWYgKCAncGxhaW5fdGV4dCcgPT09IGRpc3BsYXlWYWx1ZXNBcyApIHtcblx0XHRcdFx0XHRcdCRtaW5WYWx1ZS5odG1sKCBtaW5WYWx1ZSApO1xuXHRcdFx0XHRcdFx0JG1heFZhbHVlLmh0bWwoIG1heFZhbHVlICk7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdCRtaW5WYWx1ZS52YWwoIG1pblZhbHVlICk7XG5cdFx0XHRcdFx0XHQkbWF4VmFsdWUudmFsKCBtYXhWYWx1ZSApO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdCRib2R5LnRyaWdnZXIoICd3Y2FwZi1ub3Vpc2xpZGVyLXVwZGF0ZScsIFsgJGl0ZW0sIHZhbHVlcyBdICk7XG5cdFx0XHRcdH0gKTtcblxuXHRcdFx0XHRmdW5jdGlvbiBmaWx0ZXJQcm9kdWN0c0FjY29yZGluZ1RvU2xpZGVyKCB2YWx1ZXMgKSB7XG5cdFx0XHRcdFx0JGJvZHkudHJpZ2dlciggJ3djYXBmLW5vdWlzbGlkZXItYmVmb3JlLWZpbHRlci1wcm9kdWN0cycsIFsgJGl0ZW0sIHZhbHVlcyBdICk7XG5cblx0XHRcdFx0XHRjb25zdCBtaW5WYWx1ZSA9IHBhcnNlRmxvYXQoIHZhbHVlc1sgMCBdICk7XG5cdFx0XHRcdFx0Y29uc3QgbWF4VmFsdWUgPSBwYXJzZUZsb2F0KCB2YWx1ZXNbIDEgXSApO1xuXG5cdFx0XHRcdFx0aWYgKCBtaW5WYWx1ZSA9PT0gcmFuZ2VNaW5WYWx1ZSAmJiBtYXhWYWx1ZSA9PT0gcmFuZ2VNYXhWYWx1ZSApIHtcblx0XHRcdFx0XHRcdGNvbnN0IHF1ZXJ5ID0gd2NhcGZSZW1vdmVRdWVyeVN0cmluZ1BhcmFtZXRlciggZmlsdGVyS2V5ICk7XG5cdFx0XHRcdFx0XHRoaXN0b3J5LnB1c2hTdGF0ZSgge30sICcnLCBxdWVyeSApO1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRjb25zdCBmaWx0ZXJWYWxTdHJpbmcgPSBtaW5WYWx1ZSArIHJhbmdlVmFsdWVzU2VwYXJhdG9yICsgbWF4VmFsdWU7XG5cdFx0XHRcdFx0XHR3Y2FwZlVwZGF0ZVF1ZXJ5U3RyaW5nUGFyYW1ldGVyKCBmaWx0ZXJLZXksIGZpbHRlclZhbFN0cmluZyApO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdC8vIGZpbHRlciBwcm9kdWN0c1xuXHRcdFx0XHRcdHdjYXBmRmlsdGVyUHJvZHVjdHMoKTtcblxuXHRcdFx0XHRcdCRib2R5LnRyaWdnZXIoICd3Y2FwZi1ub3Vpc2xpZGVyLWFmdGVyLWZpbHRlci1wcm9kdWN0cycsIFsgJGl0ZW0sIHZhbHVlcyBdICk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRzbGlkZXIubm9VaVNsaWRlci5vbiggJ3NldCcsIGZ1bmN0aW9uKCB2YWx1ZXMgKSB7XG5cdFx0XHRcdFx0Ly8gQ2xlYXIgYW55IHByZXZpb3VzbHkgc2V0IHRpbWVyIGJlZm9yZSBzZXR0aW5nIGEgZnJlc2ggb25lXG5cdFx0XHRcdFx0Y2xlYXJUaW1lb3V0KCAkaXRlbS5kYXRhKCAndGltZXInICkgKTtcblxuXHRcdFx0XHRcdCRpdGVtLmRhdGEoICd0aW1lcicsIHNldFRpbWVvdXQoIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdFx0JGl0ZW0ucmVtb3ZlRGF0YSggJ3RpbWVyJyApO1xuXG5cdFx0XHRcdFx0XHRmaWx0ZXJQcm9kdWN0c0FjY29yZGluZ1RvU2xpZGVyKCB2YWx1ZXMgKTtcblx0XHRcdFx0XHR9LCBkZWxheSApICk7XG5cdFx0XHRcdH0gKTtcblxuXHRcdFx0XHQkbWluVmFsdWUub24oICdpbnB1dCcsIGZ1bmN0aW9uKCBldmVudCApIHtcblx0XHRcdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXG5cdFx0XHRcdFx0Y29uc3QgJGlucHV0ID0gJCggdGhpcyApO1xuXG5cdFx0XHRcdFx0Ly8gQ2xlYXIgYW55IHByZXZpb3VzbHkgc2V0IHRpbWVyIGJlZm9yZSBzZXR0aW5nIGEgZnJlc2ggb25lXG5cdFx0XHRcdFx0Y2xlYXJUaW1lb3V0KCAkaW5wdXQuZGF0YSggJ3RpbWVyJyApICk7XG5cblx0XHRcdFx0XHQkaW5wdXQuZGF0YSggJ3RpbWVyJywgc2V0VGltZW91dCggZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0XHQkaW5wdXQucmVtb3ZlRGF0YSggJ3RpbWVyJyApO1xuXG5cdFx0XHRcdFx0XHRjb25zdCBtaW5WYWx1ZSA9ICRpbnB1dC52YWwoKTtcblxuXHRcdFx0XHRcdFx0c2xpZGVyLm5vVWlTbGlkZXIuc2V0KCBbIG1pblZhbHVlLCBudWxsIF0gKTtcblxuXHRcdFx0XHRcdFx0ZmlsdGVyUHJvZHVjdHNBY2NvcmRpbmdUb1NsaWRlciggc2xpZGVyLm5vVWlTbGlkZXIuZ2V0KCkgKTtcblx0XHRcdFx0XHR9LCBkZWxheSApICk7XG5cdFx0XHRcdH0gKTtcblxuXHRcdFx0XHQkbWF4VmFsdWUub24oICdpbnB1dCcsIGZ1bmN0aW9uKCBldmVudCApIHtcblx0XHRcdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXG5cdFx0XHRcdFx0Y29uc3QgJGlucHV0ID0gJCggdGhpcyApO1xuXG5cdFx0XHRcdFx0Ly8gQ2xlYXIgYW55IHByZXZpb3VzbHkgc2V0IHRpbWVyIGJlZm9yZSBzZXR0aW5nIGEgZnJlc2ggb25lXG5cdFx0XHRcdFx0Y2xlYXJUaW1lb3V0KCAkaW5wdXQuZGF0YSggJ3RpbWVyJyApICk7XG5cblx0XHRcdFx0XHQkaW5wdXQuZGF0YSggJ3RpbWVyJywgc2V0VGltZW91dCggZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0XHQkaW5wdXQucmVtb3ZlRGF0YSggJ3RpbWVyJyApO1xuXG5cdFx0XHRcdFx0XHRjb25zdCBtYXhWYWx1ZSA9ICRpbnB1dC52YWwoKTtcblxuXHRcdFx0XHRcdFx0c2xpZGVyLm5vVWlTbGlkZXIuc2V0KCBbIG51bGwsIG1heFZhbHVlIF0gKTtcblxuXHRcdFx0XHRcdFx0ZmlsdGVyUHJvZHVjdHNBY2NvcmRpbmdUb1NsaWRlciggc2xpZGVyLm5vVWlTbGlkZXIuZ2V0KCkgKTtcblx0XHRcdFx0XHR9LCBkZWxheSApICk7XG5cdFx0XHRcdH0gKTtcblx0XHRcdH0gKTtcblx0XHR9XG5cblx0XHRpbml0Tm9VSVNsaWRlcigpO1xuXG5cdFx0ZnVuY3Rpb24gZmlsdGVyQnlEYXRlKCAkaW5wdXQgKSB7XG5cdFx0XHRjb25zdCAkd2NhcGZEYXRlRmlsdGVyID0gJGlucHV0LmNsb3Nlc3QoICcud2NhcGYtZGF0ZS1pbnB1dCcgKTtcblx0XHRcdGNvbnN0IGZpbHRlcktleSAgICAgICAgPSAkd2NhcGZEYXRlRmlsdGVyLmF0dHIoICdkYXRhLWZpbHRlci1rZXknICk7XG5cdFx0XHRjb25zdCBpc1JhbmdlICAgICAgICAgID0gJHdjYXBmRGF0ZUZpbHRlci5hdHRyKCAnZGF0YS1pcy1yYW5nZScgKTtcblxuXHRcdFx0bGV0IGZpbHRlclZhbHVlID0gJyc7XG5cdFx0XHRsZXQgcnVuRmlsdGVyICAgPSBmYWxzZTtcblxuXHRcdFx0Ly8gQ2xlYXIgYW55IHByZXZpb3VzbHkgc2V0IHRpbWVyIGJlZm9yZSBzZXR0aW5nIGEgZnJlc2ggb25lXG5cdFx0XHRjbGVhclRpbWVvdXQoICR3Y2FwZkRhdGVGaWx0ZXIuZGF0YSggJ3RpbWVyJyApICk7XG5cblx0XHRcdGlmICggaXNSYW5nZSApIHtcblx0XHRcdFx0Y29uc3QgZnJvbSA9ICR3Y2FwZkRhdGVGaWx0ZXIuZmluZCggJy5kYXRlLWZyb20taW5wdXQnICkudmFsKCk7XG5cdFx0XHRcdGNvbnN0IHRvICAgPSAkd2NhcGZEYXRlRmlsdGVyLmZpbmQoICcuZGF0ZS10by1pbnB1dCcgKS52YWwoKTtcblxuXHRcdFx0XHRpZiAoIGZyb20gJiYgdG8gKSB7XG5cdFx0XHRcdFx0ZmlsdGVyVmFsdWUgPSBmcm9tICsgcmFuZ2VWYWx1ZXNTZXBhcmF0b3IgKyB0bztcblx0XHRcdFx0XHRydW5GaWx0ZXIgICA9IHRydWU7XG5cdFx0XHRcdH0gZWxzZSBpZiAoICEgZnJvbSAmJiAhIHRvICkge1xuXHRcdFx0XHRcdHJ1bkZpbHRlciA9IHRydWU7XG5cdFx0XHRcdH1cblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGNvbnN0IGZyb20gPSAkd2NhcGZEYXRlRmlsdGVyLmZpbmQoICcuZGF0ZS1mcm9tLWlucHV0JyApLnZhbCgpO1xuXG5cdFx0XHRcdGlmICggZnJvbSApIHtcblx0XHRcdFx0XHRmaWx0ZXJWYWx1ZSA9IGZyb207XG5cdFx0XHRcdFx0cnVuRmlsdGVyICAgPSB0cnVlO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdHJ1bkZpbHRlciA9IHRydWU7XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdFx0aWYgKCBydW5GaWx0ZXIgKSB7XG5cdFx0XHRcdCR3Y2FwZkRhdGVGaWx0ZXIuZGF0YSggJ3RpbWVyJywgc2V0VGltZW91dCggZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0JHdjYXBmRGF0ZUZpbHRlci5yZW1vdmVEYXRhKCAndGltZXInICk7XG5cblx0XHRcdFx0XHRpZiAoIGZpbHRlclZhbHVlICkge1xuXHRcdFx0XHRcdFx0d2NhcGZVcGRhdGVRdWVyeVN0cmluZ1BhcmFtZXRlciggZmlsdGVyS2V5LCBmaWx0ZXJWYWx1ZSApO1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRjb25zdCBxdWVyeSA9IHdjYXBmUmVtb3ZlUXVlcnlTdHJpbmdQYXJhbWV0ZXIoIGZpbHRlcktleSApO1xuXHRcdFx0XHRcdFx0aGlzdG9yeS5wdXNoU3RhdGUoIHt9LCAnJywgcXVlcnkgKTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHQvLyBmaWx0ZXIgcHJvZHVjdHNcblx0XHRcdFx0XHR3Y2FwZkZpbHRlclByb2R1Y3RzKCk7XG5cdFx0XHRcdH0sIGRlbGF5ICkgKTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHRmdW5jdGlvbiBpbml0RGF0ZXBpY2tlcigpIHtcblx0XHRcdGlmICggISBqUXVlcnkoKS5kYXRlcGlja2VyICkge1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdGNvbnN0ICR3Y2FwZkRhdGVGaWx0ZXJzID0gJCggJy53Y2FwZi1kYXRlLXJhbmdlLWZpbHRlcicgKTtcblx0XHRcdGNvbnN0ICR3Y2FwZkRhdGVGaWx0ZXIgID0gJHdjYXBmRGF0ZUZpbHRlcnMuZmluZCggJy53Y2FwZi1kYXRlLWlucHV0JyApO1xuXG5cdFx0XHRjb25zdCBmb3JtYXQgICAgICAgID0gJHdjYXBmRGF0ZUZpbHRlci5hdHRyKCAnZGF0YS1kYXRlLWZvcm1hdCcgKTtcblx0XHRcdGNvbnN0IHllYXJEcm9wZG93biAgPSAkd2NhcGZEYXRlRmlsdGVyLmF0dHIoICdkYXRhLWRhdGUtcGlja2VyLXllYXItZHJvcGRvd24nICk7XG5cdFx0XHRjb25zdCBtb250aERyb3Bkb3duID0gJHdjYXBmRGF0ZUZpbHRlci5hdHRyKCAnZGF0YS1kYXRlLXBpY2tlci1tb250aC1kcm9wZG93bicgKTtcblxuXHRcdFx0Y29uc3QgJGZyb20gPSAkd2NhcGZEYXRlRmlsdGVyLmZpbmQoICcuZGF0ZS1mcm9tLWlucHV0JyApO1xuXHRcdFx0Y29uc3QgJHRvICAgPSAkd2NhcGZEYXRlRmlsdGVyLmZpbmQoICcuZGF0ZS10by1pbnB1dCcgKTtcblxuXHRcdFx0JGZyb20uZGF0ZXBpY2tlcigge1xuXHRcdFx0XHRkYXRlRm9ybWF0OiBmb3JtYXQsXG5cdFx0XHRcdGNoYW5nZVllYXI6IHllYXJEcm9wZG93bixcblx0XHRcdFx0Y2hhbmdlTW9udGg6IG1vbnRoRHJvcGRvd24sXG5cdFx0XHR9ICk7XG5cblx0XHRcdCR0by5kYXRlcGlja2VyKCB7XG5cdFx0XHRcdGRhdGVGb3JtYXQ6IGZvcm1hdCxcblx0XHRcdFx0Y2hhbmdlWWVhcjogeWVhckRyb3Bkb3duLFxuXHRcdFx0XHRjaGFuZ2VNb250aDogbW9udGhEcm9wZG93bixcblx0XHRcdH0gKTtcblxuXHRcdFx0JGZyb20ub24oICdjaGFuZ2UnLCBmdW5jdGlvbigpIHtcblx0XHRcdFx0Y29uc3QgJGlucHV0ID0gJCggdGhpcyApO1xuXHRcdFx0XHRmaWx0ZXJCeURhdGUoICRpbnB1dCApO1xuXHRcdFx0fSApO1xuXG5cdFx0XHQkdG8ub24oICdjaGFuZ2UnLCBmdW5jdGlvbigpIHtcblx0XHRcdFx0Y29uc3QgJGlucHV0ID0gJCggdGhpcyApO1xuXHRcdFx0XHRmaWx0ZXJCeURhdGUoICRpbnB1dCApO1xuXHRcdFx0fSApO1xuXHRcdH1cblxuXHRcdGluaXREYXRlcGlja2VyKCk7XG5cblx0XHQvLyBzaG93IGEgbG9hZGluZyBpbmRpY2F0b3Jcblx0XHRmdW5jdGlvbiB3Y2FwZkJlZm9yZVVwZGF0ZSgpIHtcblx0XHRcdCRib2R5LnRyaWdnZXIoICd3Y2FwZl9iZWZvcmVfdXBkYXRlX2ZpbHRlcnMnICk7XG5cdFx0fVxuXG5cdFx0Ly8gc2Nyb2xsIHRvIHRvcFxuXHRcdGZ1bmN0aW9uIHdjYXBmQWZ0ZXJVcGRhdGUoKSB7XG5cdFx0XHRpbml0Q2hvc2VuKCk7XG5cdFx0XHRpbml0SGllcmFyY2h5QWNjb3JkaW9uKCk7XG5cdFx0XHRpbml0Tm9VSVNsaWRlcigpO1xuXHRcdFx0aW5pdERhdGVwaWNrZXIoKTtcblxuXHRcdFx0JGJvZHkudHJpZ2dlciggJ3djYXBmX2FmdGVyX3VwZGF0ZV9maWx0ZXJzJyApO1xuXHRcdH1cblxuXHRcdC8vIGZpbHRlciB0aGUgcHJvZHVjdHNcblx0XHRmdW5jdGlvbiB3Y2FwZkZpbHRlclByb2R1Y3RzKCBmb3JjZVJlUmVuZGVyID0gZmFsc2UgKSB7XG5cdFx0XHR3Y2FwZkJlZm9yZVVwZGF0ZSgpO1xuXG5cdFx0XHQkLmdldChcblx0XHRcdFx0d2luZG93LmxvY2F0aW9uLmhyZWYsXG5cdFx0XHRcdGZ1bmN0aW9uKCBkYXRhICkge1xuXHRcdFx0XHRcdGNvbnN0ICRkYXRhID0gJCggZGF0YSApO1xuXG5cdFx0XHRcdFx0Y29uc3QgJHNob3BMb29wQ29udGFpbmVyID0gJGRhdGEuZmluZCggd2NhcGZfcGFyYW1zLnNob3BfbG9vcF9jb250YWluZXIgKTtcblx0XHRcdFx0XHRjb25zdCAkbm90Rm91bmRDb250YWluZXIgPSAkZGF0YS5maW5kKCB3Y2FwZl9wYXJhbXMubm90X2ZvdW5kX2NvbnRhaW5lciApO1xuXG5cdFx0XHRcdFx0Ly8gcmVwbGFjZSBmaWVsZHMnIGRhdGEgd2l0aCBuZXcgZGF0YVxuXHRcdFx0XHRcdCQuZWFjaChcblx0XHRcdFx0XHRcdGZpZWxkcyxcblx0XHRcdFx0XHRcdGZ1bmN0aW9uKCBpZCApIHtcblx0XHRcdFx0XHRcdFx0Y29uc3QgZmllbGRJRCAgICA9ICdbZGF0YS1pZD1cIicgKyBpZCArICdcIl0nO1xuXHRcdFx0XHRcdFx0XHRjb25zdCAkZmllbGQgICAgID0gJCggZmllbGRJRCApO1xuXHRcdFx0XHRcdFx0XHRjb25zdCAkaW5uZXIgICAgID0gJGZpZWxkLmZpbmQoICcud2NhcGYtZmllbGQtaW5uZXInICk7XG5cdFx0XHRcdFx0XHRcdGNvbnN0IF9maWVsZCAgICAgPSAkZGF0YS5maW5kKCBmaWVsZElEICk7XG5cdFx0XHRcdFx0XHRcdGNvbnN0IGZpZWxkQ2xhc3MgPSAkKCBfZmllbGQgKS5hdHRyKCAnY2xhc3MnICk7XG5cdFx0XHRcdFx0XHRcdGNvbnN0IF9odG1sICAgICAgPSBfZmllbGQuZmluZCggJy53Y2FwZi1maWVsZC1pbm5lcicgKS5odG1sKCk7XG5cblx0XHRcdFx0XHRcdFx0Ly8gV2hlbiBjYWxsZWQgZnJvbSBoaXN0b3J5IGJhY2sgb3IgZm9yd2FyZCByZXF1ZXN0IHRoZW4gcmVyZW5kZXIgYWxsIGZpZWxkcy5cblx0XHRcdFx0XHRcdFx0aWYgKCBmb3JjZVJlUmVuZGVyICkge1xuXG5cdFx0XHRcdFx0XHRcdFx0Ly8gdXBkYXRlIGNsYXNzXG5cdFx0XHRcdFx0XHRcdFx0JGZpZWxkLmF0dHIoICdjbGFzcycsIGZpZWxkQ2xhc3MgKTtcblxuXHRcdFx0XHRcdFx0XHRcdC8vIHVwZGF0ZSBmaWVsZFxuXHRcdFx0XHRcdFx0XHRcdCRpbm5lci5odG1sKCBfaHRtbCApO1xuXG5cdFx0XHRcdFx0XHRcdH0gZWxzZSB7XG5cblx0XHRcdFx0XHRcdFx0XHQvLyBTZWxlY3RpdmVseSByZXJlbmRlciB0aGUgZmllbGRzLlxuXHRcdFx0XHRcdFx0XHRcdGlmICggJGZpZWxkLmhhc0NsYXNzKCAnd2NhcGYtbmF2LWZpbHRlcicgKSApIHtcblxuXHRcdFx0XHRcdFx0XHRcdFx0Ly8gdXBkYXRlIGNsYXNzXG5cdFx0XHRcdFx0XHRcdFx0XHQkZmllbGQuYXR0ciggJ2NsYXNzJywgZmllbGRDbGFzcyApO1xuXG5cdFx0XHRcdFx0XHRcdFx0XHQvLyB1cGRhdGUgZmllbGRcblx0XHRcdFx0XHRcdFx0XHRcdCRpbm5lci5odG1sKCBfaHRtbCApO1xuXG5cdFx0XHRcdFx0XHRcdFx0fSBlbHNlIHtcblxuXHRcdFx0XHRcdFx0XHRcdFx0Ly8gV2UgbmVlZCB0byB1cGRhdGUgdGhlIGZpZWxkcycgY2xhc3NlcyBhbHdheXMuXG5cdFx0XHRcdFx0XHRcdFx0XHQkZmllbGQuYXR0ciggJ2NsYXNzJywgZmllbGRDbGFzcyApO1xuXG5cdFx0XHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHQpO1xuXG5cdFx0XHRcdFx0Ly8gcmVwbGFjZSBvbGQgc2hvcCBsb29wIHdpdGggbmV3IG9uZVxuXHRcdFx0XHRcdGlmICggd2NhcGZfcGFyYW1zLnNob3BfbG9vcF9jb250YWluZXIgPT09IHdjYXBmX3BhcmFtcy5ub3RfZm91bmRfY29udGFpbmVyICkge1xuXHRcdFx0XHRcdFx0JCggd2NhcGZfcGFyYW1zLnNob3BfbG9vcF9jb250YWluZXIgKS5odG1sKCAkc2hvcExvb3BDb250YWluZXIuaHRtbCgpICk7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdGlmICggJCggd2NhcGZfcGFyYW1zLm5vdF9mb3VuZF9jb250YWluZXIgKS5sZW5ndGggKSB7XG5cdFx0XHRcdFx0XHRcdGlmICggJHNob3BMb29wQ29udGFpbmVyLmxlbmd0aCApIHtcblx0XHRcdFx0XHRcdFx0XHQkKCB3Y2FwZl9wYXJhbXMubm90X2ZvdW5kX2NvbnRhaW5lciApLmh0bWwoICRzaG9wTG9vcENvbnRhaW5lci5odG1sKCkgKTtcblx0XHRcdFx0XHRcdFx0fSBlbHNlIGlmICggJG5vdEZvdW5kQ29udGFpbmVyLmxlbmd0aCApIHtcblx0XHRcdFx0XHRcdFx0XHQkKCB3Y2FwZl9wYXJhbXMubm90X2ZvdW5kX2NvbnRhaW5lciApLmh0bWwoICRub3RGb3VuZENvbnRhaW5lci5odG1sKCkgKTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fSBlbHNlIGlmICggJCggd2NhcGZfcGFyYW1zLnNob3BfbG9vcF9jb250YWluZXIgKS5sZW5ndGggKSB7XG5cdFx0XHRcdFx0XHRcdGlmICggJHNob3BMb29wQ29udGFpbmVyLmxlbmd0aCApIHtcblx0XHRcdFx0XHRcdFx0XHQkKCB3Y2FwZl9wYXJhbXMuc2hvcF9sb29wX2NvbnRhaW5lciApLmh0bWwoICRzaG9wTG9vcENvbnRhaW5lci5odG1sKCkgKTtcblx0XHRcdFx0XHRcdFx0fSBlbHNlIGlmICggJG5vdEZvdW5kQ29udGFpbmVyLmxlbmd0aCApIHtcblx0XHRcdFx0XHRcdFx0XHQkKCB3Y2FwZl9wYXJhbXMuc2hvcF9sb29wX2NvbnRhaW5lciApLmh0bWwoICRub3RGb3VuZENvbnRhaW5lci5odG1sKCkgKTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdHdjYXBmQWZ0ZXJVcGRhdGUoKTtcblxuXHRcdFx0XHRcdC8vIHRvZG9cblx0XHRcdFx0XHQvLyByZWluaXRpYWxpemUgb3JkZXJpbmdcblx0XHRcdFx0XHQvLyB3Y2FwZkluaXRPcmRlcigpO1xuXG5cdFx0XHRcdFx0Ly8gdG9kb1xuXHRcdFx0XHRcdC8vIHJlaW5pdGlhbGl6ZSBkcm9wZG93biBmaWx0ZXJcblx0XHRcdFx0XHQvLyB3Y2FwZkRyb3BEb3duRmlsdGVyKCk7XG5cblx0XHRcdFx0XHQvLyBydW4gc2NyaXB0cyBhZnRlciBzaG9wIGxvb3AgdW5kYXRlZFxuXHRcdFx0XHRcdGlmICggdHlwZW9mIHdjYXBmX3BhcmFtcy5jdXN0b21fc2NyaXB0cyAhPT0gJ3VuZGVmaW5lZCcgJiYgd2NhcGZfcGFyYW1zLmN1c3RvbV9zY3JpcHRzLmxlbmd0aCA+IDAgKSB7XG5cdFx0XHRcdFx0XHRldmFsKCB3Y2FwZl9wYXJhbXMuY3VzdG9tX3NjcmlwdHMgKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdCk7XG5cdFx0fVxuXG5cdFx0Ly8gVVJMIFBhcnNlclxuXHRcdGZ1bmN0aW9uIHdjYXBmR2V0VXJsVmFycyggdXJsICkge1xuXHRcdFx0bGV0IHZhcnMgPSB7fSwgaGFzaDtcblxuXHRcdFx0aWYgKCB0eXBlb2YgdXJsID09PSAndW5kZWZpbmVkJyApIHtcblx0XHRcdFx0dXJsID0gd2luZG93LmxvY2F0aW9uLmhyZWY7XG5cdFx0XHR9XG5cblx0XHRcdHVybCA9IHVybC5yZXBsYWNlQWxsKCAnJTJDJywgJywnICk7XG5cblx0XHRcdGNvbnN0IGhhc2hlcyAgPSB1cmwuc2xpY2UoIHVybC5pbmRleE9mKCAnPycgKSArIDEgKS5zcGxpdCggJyYnICk7XG5cdFx0XHRjb25zdCBoTGVuZ3RoID0gaGFzaGVzLmxlbmd0aDtcblxuXHRcdFx0Zm9yICggbGV0IGkgPSAwOyBpIDwgaExlbmd0aDsgaSsrICkge1xuXHRcdFx0XHRoYXNoID0gaGFzaGVzWyBpIF0uc3BsaXQoICc9JyApO1xuXG5cdFx0XHRcdHZhcnNbIGhhc2hbIDAgXSBdID0gaGFzaFsgMSBdO1xuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gdmFycztcblx0XHR9XG5cblx0XHQvLyBldmVyeXRpbWUgd2UgYXBwbHkgdGhlIGZpbHRlciB3ZSBzZXQgdGhlIGN1cnJlbnQgcGFnZSB0byAxXG5cdFx0ZnVuY3Rpb24gd2NhcGZGaXhQYWdpbmF0aW9uKCkge1xuXHRcdFx0bGV0IHVybCAgICAgICAgICAgICAgICA9IHdpbmRvdy5sb2NhdGlvbi5ocmVmO1xuXHRcdFx0Y29uc3QgcGFyYW1zICAgICAgICAgICA9IHdjYXBmR2V0VXJsVmFycyggdXJsICk7XG5cdFx0XHRjb25zdCBjdXJyZW50UGFnZUluVXJsID0gcGFyc2VJbnQoIHVybC5yZXBsYWNlKCAvLitcXC9wYWdlXFwvKFxcZCspKy8sICckMScgKSApO1xuXG5cdFx0XHRpZiAoIGN1cnJlbnRQYWdlSW5VcmwgKSB7XG5cdFx0XHRcdGlmICggY3VycmVudFBhZ2VJblVybCA+IDEgKSB7XG5cdFx0XHRcdFx0dXJsID0gdXJsLnJlcGxhY2UoIC9wYWdlXFwvKFxcZCspLywgJ3BhZ2UvMScgKTtcblx0XHRcdFx0fVxuXHRcdFx0fSBlbHNlIGlmICggdHlwZW9mIHBhcmFtc1sgJ3BhZ2VkJyBdICE9PSAndW5kZWZpbmVkJyApIHtcblx0XHRcdFx0Y29uc3QgY3VycmVudFBhZ2VJblBhcmFtcyA9IHBhcnNlSW50KCBwYXJhbXNbICdwYWdlZCcgXSApO1xuXG5cdFx0XHRcdGlmICggY3VycmVudFBhZ2VJblBhcmFtcyA+IDEgKSB7XG5cdFx0XHRcdFx0dXJsID0gdXJsLnJlcGxhY2UoICdwYWdlZD0nICsgY3VycmVudFBhZ2VJblBhcmFtcywgJ3BhZ2VkPTEnICk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuIHVybDtcblx0XHR9XG5cblx0XHQvLyB1cGRhdGUgcXVlcnkgc3RyaW5nIGZvciBjYXRlZ29yaWVzLCBtZXRhIGV0Yy4uXG5cdFx0ZnVuY3Rpb24gd2NhcGZVcGRhdGVRdWVyeVN0cmluZ1BhcmFtZXRlcigga2V5LCB2YWx1ZSwgcHVzaEhpc3RvcnksIHVybCApIHtcblx0XHRcdGlmICggdHlwZW9mIHB1c2hIaXN0b3J5ID09PSAndW5kZWZpbmVkJyApIHtcblx0XHRcdFx0cHVzaEhpc3RvcnkgPSB0cnVlO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAoIHR5cGVvZiB1cmwgPT09ICd1bmRlZmluZWQnICkge1xuXHRcdFx0XHR1cmwgPSB3Y2FwZkZpeFBhZ2luYXRpb24oKTtcblx0XHRcdH1cblxuXHRcdFx0Y29uc3QgcmUgICAgICAgID0gbmV3IFJlZ0V4cCggJyhbPyZdKScgKyBrZXkgKyAnPS4qPygmfCQpJywgJ2knICk7XG5cdFx0XHRjb25zdCBzZXBhcmF0b3IgPSB1cmwuaW5kZXhPZiggJz8nICkgIT09IC0xID8gJyYnIDogJz8nO1xuXHRcdFx0bGV0IHVybFdpdGhRdWVyeTtcblxuXHRcdFx0aWYgKCB1cmwubWF0Y2goIHJlICkgKSB7XG5cdFx0XHRcdHVybFdpdGhRdWVyeSA9IHVybC5yZXBsYWNlKCByZSwgJyQxJyArIGtleSArICc9JyArIHZhbHVlICsgJyQyJyApO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0dXJsV2l0aFF1ZXJ5ID0gdXJsICsgc2VwYXJhdG9yICsga2V5ICsgJz0nICsgdmFsdWU7XG5cdFx0XHR9XG5cblx0XHRcdGlmICggcHVzaEhpc3RvcnkgPT09IHRydWUgKSB7XG5cdFx0XHRcdHJldHVybiBoaXN0b3J5LnB1c2hTdGF0ZSgge30sICcnLCB1cmxXaXRoUXVlcnkgKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHJldHVybiB1cmxXaXRoUXVlcnk7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0Ly8gcmVtb3ZlIHBhcmFtZXRlciBmcm9tIHVybFxuXHRcdGZ1bmN0aW9uIHdjYXBmUmVtb3ZlUXVlcnlTdHJpbmdQYXJhbWV0ZXIoIGZpbHRlcktleSwgdXJsICkge1xuXHRcdFx0aWYgKCB0eXBlb2YgdXJsID09PSAndW5kZWZpbmVkJyApIHtcblx0XHRcdFx0dXJsID0gd2NhcGZGaXhQYWdpbmF0aW9uKCk7XG5cdFx0XHR9XG5cblx0XHRcdGNvbnN0IG9sZFBhcmFtcyAgICAgICAgID0gd2NhcGZHZXRVcmxWYXJzKCB1cmwgKTtcblx0XHRcdGNvbnN0IG9sZFBhcmFtc0xlbmd0aCAgID0gT2JqZWN0LmtleXMoIG9sZFBhcmFtcyApLmxlbmd0aDtcblx0XHRcdGNvbnN0IHN0YXJ0UG9zaXRpb24gICAgID0gdXJsLmluZGV4T2YoICc/JyApO1xuXHRcdFx0Y29uc3QgZmlsdGVyS2V5UG9zaXRpb24gPSB1cmwuaW5kZXhPZiggZmlsdGVyS2V5ICk7XG5cdFx0XHRsZXQgY2xlYW5VcmwsIGNsZWFuUXVlcnk7XG5cblx0XHRcdGlmICggb2xkUGFyYW1zTGVuZ3RoID4gMSApIHtcblx0XHRcdFx0aWYgKCAoIGZpbHRlcktleVBvc2l0aW9uIC0gc3RhcnRQb3NpdGlvbiApID4gMSApIHtcblx0XHRcdFx0XHRjbGVhblVybCA9IHVybC5yZXBsYWNlKCAnJicgKyBmaWx0ZXJLZXkgKyAnPScgKyBvbGRQYXJhbXNbIGZpbHRlcktleSBdLCAnJyApO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdGNsZWFuVXJsID0gdXJsLnJlcGxhY2UoIGZpbHRlcktleSArICc9JyArIG9sZFBhcmFtc1sgZmlsdGVyS2V5IF0gKyAnJicsICcnICk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRjb25zdCBuZXdQYXJhbXMgPSBjbGVhblVybC5zcGxpdCggJz8nICk7XG5cdFx0XHRcdGNsZWFuUXVlcnkgICAgICA9ICc/JyArIG5ld1BhcmFtc1sgMSBdO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0Y2xlYW5RdWVyeSA9IHVybC5yZXBsYWNlKCAnPycgKyBmaWx0ZXJLZXkgKyAnPScgKyBvbGRQYXJhbXNbIGZpbHRlcktleSBdLCAnJyApO1xuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gY2xlYW5RdWVyeTtcblx0XHR9XG5cblx0XHQvLyB0YWtlIHRoZSBrZXkgYW5kIHZhbHVlIGFuZCBtYWtlIHF1ZXJ5XG5cdFx0ZnVuY3Rpb24gd2NhcGZNYWtlUGFyYW1ldGVycyggZmlsdGVyS2V5LCBmaWx0ZXJWYWx1ZSwgZm9yY2VSZXJlbmRlciA9IGZhbHNlLCB1cmwgKSB7XG5cdFx0XHRjb25zdCB2YWx1ZVNlcGFyYXRvciA9ICcsJztcblxuXHRcdFx0bGV0IHBhcmFtcywgbmV4dFZhbHVlcywgZW1wdHlWYWx1ZSA9IGZhbHNlO1xuXG5cdFx0XHRpZiAoIHR5cGVvZiB1cmwgIT09ICd1bmRlZmluZWQnICkge1xuXHRcdFx0XHRwYXJhbXMgPSB3Y2FwZkdldFVybFZhcnMoIHVybCApO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0cGFyYW1zID0gd2NhcGZHZXRVcmxWYXJzKCk7XG5cdFx0XHR9XG5cblx0XHRcdGlmICggdHlwZW9mIHBhcmFtc1sgZmlsdGVyS2V5IF0gIT0gJ3VuZGVmaW5lZCcgKSB7XG5cdFx0XHRcdGNvbnN0IHByZXZWYWx1ZXMgICAgICA9IHBhcmFtc1sgZmlsdGVyS2V5IF07XG5cdFx0XHRcdGNvbnN0IHByZXZWYWx1ZXNBcnJheSA9IHByZXZWYWx1ZXMuc3BsaXQoIHZhbHVlU2VwYXJhdG9yICk7XG5cblx0XHRcdFx0aWYgKCBwcmV2VmFsdWVzLmxlbmd0aCA+IDAgKSB7XG5cdFx0XHRcdFx0Y29uc3QgZm91bmQgPSAkLmluQXJyYXkoIGZpbHRlclZhbHVlLCBwcmV2VmFsdWVzQXJyYXkgKTtcblxuXHRcdFx0XHRcdGlmICggZm91bmQgPj0gMCApIHtcblx0XHRcdFx0XHRcdC8vIEVsZW1lbnQgd2FzIGZvdW5kLCByZW1vdmUgaXQuXG5cdFx0XHRcdFx0XHRwcmV2VmFsdWVzQXJyYXkuc3BsaWNlKCBmb3VuZCwgMSApO1xuXG5cdFx0XHRcdFx0XHRpZiAoIHByZXZWYWx1ZXNBcnJheS5sZW5ndGggPT09IDAgKSB7XG5cdFx0XHRcdFx0XHRcdGVtcHR5VmFsdWUgPSB0cnVlO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHQvLyBFbGVtZW50IHdhcyBub3QgZm91bmQsIGFkZCBpdC5cblx0XHRcdFx0XHRcdHByZXZWYWx1ZXNBcnJheS5wdXNoKCBmaWx0ZXJWYWx1ZSApO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdGlmICggcHJldlZhbHVlc0FycmF5Lmxlbmd0aCA+IDEgKSB7XG5cdFx0XHRcdFx0XHRuZXh0VmFsdWVzID0gcHJldlZhbHVlc0FycmF5LmpvaW4oIHZhbHVlU2VwYXJhdG9yICk7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdG5leHRWYWx1ZXMgPSBwcmV2VmFsdWVzQXJyYXk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdG5leHRWYWx1ZXMgPSBmaWx0ZXJWYWx1ZTtcblx0XHRcdFx0fVxuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0bmV4dFZhbHVlcyA9IGZpbHRlclZhbHVlO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyB1cGRhdGUgdXJsIGFuZCBxdWVyeSBzdHJpbmdcblx0XHRcdGlmICggISBlbXB0eVZhbHVlICkge1xuXHRcdFx0XHR3Y2FwZlVwZGF0ZVF1ZXJ5U3RyaW5nUGFyYW1ldGVyKCBmaWx0ZXJLZXksIG5leHRWYWx1ZXMgKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGNvbnN0IHF1ZXJ5ID0gd2NhcGZSZW1vdmVRdWVyeVN0cmluZ1BhcmFtZXRlciggZmlsdGVyS2V5ICk7XG5cdFx0XHRcdGhpc3RvcnkucHVzaFN0YXRlKCB7fSwgJycsIHF1ZXJ5ICk7XG5cdFx0XHR9XG5cblx0XHRcdC8vIGZpbHRlciBwcm9kdWN0c1xuXHRcdFx0d2NhcGZGaWx0ZXJQcm9kdWN0cyggZm9yY2VSZXJlbmRlciApO1xuXHRcdH1cblxuXHRcdGZ1bmN0aW9uIHdjYXBmU2luZ2xlRmlsdGVyKCBmaWx0ZXJLZXksIGZpbHRlclZhbHVlICkge1xuXHRcdFx0Y29uc3QgcGFyYW1zID0gd2NhcGZHZXRVcmxWYXJzKCk7XG5cdFx0XHRsZXQgcXVlcnk7XG5cblx0XHRcdGlmICggdHlwZW9mIHBhcmFtc1sgZmlsdGVyS2V5IF0gIT09ICd1bmRlZmluZWQnICYmIHBhcmFtc1sgZmlsdGVyS2V5IF0gPT09IGZpbHRlclZhbHVlICkge1xuXHRcdFx0XHRxdWVyeSA9IHdjYXBmUmVtb3ZlUXVlcnlTdHJpbmdQYXJhbWV0ZXIoIGZpbHRlcktleSApO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0cXVlcnkgPSB3Y2FwZlVwZGF0ZVF1ZXJ5U3RyaW5nUGFyYW1ldGVyKCBmaWx0ZXJLZXksIGZpbHRlclZhbHVlLCBmYWxzZSApO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyB1cGRhdGUgdXJsXG5cdFx0XHRoaXN0b3J5LnB1c2hTdGF0ZSgge30sICcnLCBxdWVyeSApO1xuXG5cdFx0XHQvLyBmaWx0ZXIgcHJvZHVjdHNcblx0XHRcdHdjYXBmRmlsdGVyUHJvZHVjdHMoKTtcblx0XHR9XG5cblx0XHQvLyBUaGUgbWFpbiBmdW5jdGlvbiB0byBoYW5kbGUgdGhlIGZpbHRlciByZXF1ZXN0XG5cdFx0ZnVuY3Rpb24gaGFuZGxlRmlsdGVyUmVxdWVzdCggJGl0ZW0sIGZpbHRlclZhbHVlICkge1xuXHRcdFx0Y29uc3QgJGZpZWxkICAgICAgICAgPSAkaXRlbS5jbG9zZXN0KCAnLndjYXBmLXNpbmdsZS1maWx0ZXInICk7XG5cdFx0XHRjb25zdCBmaWVsZElEICAgICAgICA9ICRmaWVsZC5hdHRyKCAnZGF0YS1pZCcgKTtcblx0XHRcdGNvbnN0IGZpZWxkRGF0YSAgICAgID0gZmllbGRzWyBmaWVsZElEIF07XG5cdFx0XHRjb25zdCBmaWx0ZXJLZXkgICAgICA9IGZpZWxkRGF0YS5maWx0ZXJLZXk7XG5cdFx0XHRjb25zdCBtdWx0aXBsZUZpbHRlciA9IGZpZWxkRGF0YS5tdWx0aXBsZUZpbHRlcjtcblxuXHRcdFx0aWYgKCAhIGZpbHRlcktleSApIHtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAoICEgZmlsdGVyVmFsdWUubGVuZ3RoICkge1xuXHRcdFx0XHRjb25zdCBxdWVyeSA9IHdjYXBmUmVtb3ZlUXVlcnlTdHJpbmdQYXJhbWV0ZXIoIGZpbHRlcktleSApO1xuXHRcdFx0XHRoaXN0b3J5LnB1c2hTdGF0ZSgge30sICcnLCBxdWVyeSApO1xuXG5cdFx0XHRcdC8vIGZpbHRlciBwcm9kdWN0c1xuXHRcdFx0XHR3Y2FwZkZpbHRlclByb2R1Y3RzKCk7XG5cblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAoIG11bHRpcGxlRmlsdGVyICkge1xuXHRcdFx0XHR3Y2FwZk1ha2VQYXJhbWV0ZXJzKCBmaWx0ZXJLZXksIGZpbHRlclZhbHVlICk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHR3Y2FwZlNpbmdsZUZpbHRlciggZmlsdGVyS2V5LCBmaWx0ZXJWYWx1ZSApO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdC8vIGhhbmRsZSB0aGUgZmlsdGVyIHJlcXVlc3QgZm9yIGxpc3QgZmllbGRzXG5cdFx0JHdjYXBmTmF2RmlsdGVycy5vbihcblx0XHRcdCdjaGFuZ2UnLFxuXHRcdFx0Jy53Y2FwZi1sYXllcmVkLW5hdiBbdHlwZT1cImNoZWNrYm94XCJdLCAud2NhcGYtbGF5ZXJlZC1uYXYgW3R5cGU9XCJyYWRpb1wiXScsXG5cdFx0XHRmdW5jdGlvbiggZXZlbnQgKSB7XG5cdFx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cblx0XHRcdFx0Y29uc3QgJGl0ZW0gICAgICAgPSAkKCB0aGlzICk7XG5cdFx0XHRcdGNvbnN0IGZpbHRlclZhbHVlID0gJGl0ZW0udmFsKCk7XG5cblx0XHRcdFx0aGFuZGxlRmlsdGVyUmVxdWVzdCggJGl0ZW0sIGZpbHRlclZhbHVlICk7XG5cdFx0XHR9XG5cdFx0KTtcblxuXHRcdC8vIFRPRE86IFVzZSBhIGNvbWJpbmF0aW9uIG9mIGxhYmVsLCBjaGVja2JveCBhbmQgcmFkaW9cblx0XHQvLyBoYW5kbGUgdGhlIGZpbHRlciByZXF1ZXN0IGZvciBsYWJlbGVkIGl0ZW1cblx0XHQkd2NhcGZOYXZGaWx0ZXJzLm9uKFxuXHRcdFx0J2NsaWNrJyxcblx0XHRcdCcud2NhcGYtbGFiZWxlZC1uYXYgLml0ZW0nLFxuXHRcdFx0ZnVuY3Rpb24oIGV2ZW50ICkge1xuXHRcdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXG5cdFx0XHRcdGNvbnN0ICRpdGVtICAgICAgID0gJCggdGhpcyApO1xuXHRcdFx0XHRjb25zdCBmaWx0ZXJWYWx1ZSA9ICRpdGVtLmF0dHIoICdkYXRhLXZhbHVlJyApO1xuXG5cdFx0XHRcdGhhbmRsZUZpbHRlclJlcXVlc3QoICRpdGVtLCBmaWx0ZXJWYWx1ZSApO1xuXHRcdFx0fVxuXHRcdCk7XG5cblx0XHQvLyBoYW5kbGUgdGhlIGZpbHRlciByZXF1ZXN0IGZvciBkaXNwbGF5IHR5cGUgc2VsZWN0IGZpZWxkc1xuXHRcdCR3Y2FwZk5hdkZpbHRlcnMub24oXG5cdFx0XHQnY2hhbmdlJyxcblx0XHRcdCdzZWxlY3QnLFxuXHRcdFx0ZnVuY3Rpb24oIGV2ZW50ICkge1xuXHRcdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXG5cdFx0XHRcdGNvbnN0ICRpdGVtICAgICAgID0gJCggdGhpcyApO1xuXHRcdFx0XHRjb25zdCBmaWx0ZXJWYWx1ZSA9ICRpdGVtLnZhbCgpO1xuXG5cdFx0XHRcdGNvbnN0ICRmaWVsZCAgICA9ICRpdGVtLmNsb3Nlc3QoICcud2NhcGYtc2luZ2xlLWZpbHRlcicgKTtcblx0XHRcdFx0Y29uc3QgZmllbGRJRCAgID0gJGZpZWxkLmF0dHIoICdkYXRhLWlkJyApO1xuXHRcdFx0XHRjb25zdCBmaWVsZERhdGEgPSBmaWVsZHNbIGZpZWxkSUQgXTtcblx0XHRcdFx0Y29uc3QgZmlsdGVyS2V5ID0gZmllbGREYXRhLmZpbHRlcktleTtcblxuXHRcdFx0XHRpZiAoICEgZmlsdGVyVmFsdWUubGVuZ3RoICkge1xuXHRcdFx0XHRcdGNvbnN0IHF1ZXJ5ID0gd2NhcGZSZW1vdmVRdWVyeVN0cmluZ1BhcmFtZXRlciggZmlsdGVyS2V5ICk7XG5cdFx0XHRcdFx0aGlzdG9yeS5wdXNoU3RhdGUoIHt9LCAnJywgcXVlcnkgKTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRjb25zdCBmaWx0ZXJWYWxTdHJpbmcgPSBmaWx0ZXJWYWx1ZS50b1N0cmluZygpO1xuXHRcdFx0XHRcdHdjYXBmVXBkYXRlUXVlcnlTdHJpbmdQYXJhbWV0ZXIoIGZpbHRlcktleSwgZmlsdGVyVmFsU3RyaW5nICk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHQvLyBmaWx0ZXIgcHJvZHVjdHNcblx0XHRcdFx0d2NhcGZGaWx0ZXJQcm9kdWN0cygpO1xuXHRcdFx0fVxuXHRcdCk7XG5cblx0XHQvLyBoYW5kbGUgdGhlIGZpbHRlciByZXF1ZXN0IGZvciByYW5nZSBudW1iZXJcblx0XHQkd2NhcGZOdW1iZXJSYW5nZUZpbHRlcnMub24oXG5cdFx0XHQnaW5wdXQnLFxuXHRcdFx0Jy53Y2FwZi1yYW5nZS1udW1iZXIgLm1pbi12YWx1ZSwgLndjYXBmLXJhbmdlLW51bWJlciAubWF4LXZhbHVlJyxcblx0XHRcdGZ1bmN0aW9uKCBldmVudCApIHtcblx0XHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcblxuXHRcdFx0XHRjb25zdCAkaXRlbSA9ICQoIHRoaXMgKTtcblxuXHRcdFx0XHQvLyBDbGVhciBhbnkgcHJldmlvdXNseSBzZXQgdGltZXIgYmVmb3JlIHNldHRpbmcgYSBmcmVzaCBvbmVcblx0XHRcdFx0Y2xlYXJUaW1lb3V0KCAkaXRlbS5kYXRhKCAndGltZXInICkgKTtcblxuXHRcdFx0XHQkaXRlbS5kYXRhKCAndGltZXInLCBzZXRUaW1lb3V0KCBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHQkaXRlbS5yZW1vdmVEYXRhKCAndGltZXInICk7XG5cblx0XHRcdFx0XHRjb25zdCAkcmFuZ2VOdW1iZXIgID0gJGl0ZW0uY2xvc2VzdCggJy53Y2FwZi1yYW5nZS1udW1iZXInICk7XG5cdFx0XHRcdFx0Y29uc3QgZmlsdGVyS2V5ICAgICA9ICRyYW5nZU51bWJlci5hdHRyKCAnZGF0YS1maWx0ZXIta2V5JyApO1xuXHRcdFx0XHRcdGNvbnN0IHJhbmdlTWluVmFsdWUgPSAkcmFuZ2VOdW1iZXIuYXR0ciggJ2RhdGEtcmFuZ2UtbWluLXZhbHVlJyApO1xuXHRcdFx0XHRcdGNvbnN0IHJhbmdlTWF4VmFsdWUgPSAkcmFuZ2VOdW1iZXIuYXR0ciggJ2RhdGEtcmFuZ2UtbWF4LXZhbHVlJyApO1xuXHRcdFx0XHRcdGxldCBtaW5WYWx1ZSAgICAgICAgPSAkcmFuZ2VOdW1iZXIuZmluZCggJy5taW4tdmFsdWUnICkudmFsKCk7XG5cdFx0XHRcdFx0bGV0IG1heFZhbHVlICAgICAgICA9ICRyYW5nZU51bWJlci5maW5kKCAnLm1heC12YWx1ZScgKS52YWwoKTtcblxuXHRcdFx0XHRcdC8vIEZvcmNlIHRoZSBtaW5WYWx1ZSBub3QgdG8gYmUgZW1wdHkuXG5cdFx0XHRcdFx0aWYgKCAhIG1pblZhbHVlLmxlbmd0aCApIHtcblx0XHRcdFx0XHRcdG1pblZhbHVlID0gcmFuZ2VNaW5WYWx1ZTtcblxuXHRcdFx0XHRcdFx0JHJhbmdlTnVtYmVyLmZpbmQoICcubWluLXZhbHVlJyApLnZhbCggbWluVmFsdWUgKTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHQvLyBGb3JjZSB0aGUgbWF4VmFsdWUgbm90IHRvIGJlIGVtcHR5LlxuXHRcdFx0XHRcdGlmICggISBtYXhWYWx1ZS5sZW5ndGggKSB7XG5cdFx0XHRcdFx0XHRtYXhWYWx1ZSA9IHJhbmdlTWF4VmFsdWU7XG5cblx0XHRcdFx0XHRcdCRyYW5nZU51bWJlci5maW5kKCAnLm1heC12YWx1ZScgKS52YWwoIG1heFZhbHVlICk7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0Ly8gRm9yY2UgdGhlIG1pblZhbHVlIG5vdCB0byBnbyBiZWxvdyB0aGUgcmFuZ2VNaW5WYWx1ZS5cblx0XHRcdFx0XHRpZiAoIHBhcnNlRmxvYXQoIG1pblZhbHVlICkgPCBwYXJzZUZsb2F0KCByYW5nZU1pblZhbHVlICkgKSB7XG5cdFx0XHRcdFx0XHRtaW5WYWx1ZSA9IHJhbmdlTWluVmFsdWU7XG5cblx0XHRcdFx0XHRcdCRyYW5nZU51bWJlci5maW5kKCAnLm1pbi12YWx1ZScgKS52YWwoIG1pblZhbHVlICk7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0Ly8gRm9yY2UgdGhlIG1pblZhbHVlIG5vdCB0byBnbyB1cCB0aGUgcmFuZ2VNYXhWYWx1ZS5cblx0XHRcdFx0XHRpZiAoIHBhcnNlRmxvYXQoIG1pblZhbHVlICkgPiBwYXJzZUZsb2F0KCByYW5nZU1heFZhbHVlICkgKSB7XG5cdFx0XHRcdFx0XHRtaW5WYWx1ZSA9IHJhbmdlTWF4VmFsdWU7XG5cblx0XHRcdFx0XHRcdCRyYW5nZU51bWJlci5maW5kKCAnLm1pbi12YWx1ZScgKS52YWwoIG1pblZhbHVlICk7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0Ly8gRm9yY2UgdGhlIG1heFZhbHVlIG5vdCB0byBnbyB1cCB0aGUgcmFuZ2VNYXhWYWx1ZS5cblx0XHRcdFx0XHRpZiAoIHBhcnNlRmxvYXQoIG1heFZhbHVlICkgPiBwYXJzZUZsb2F0KCByYW5nZU1heFZhbHVlICkgKSB7XG5cdFx0XHRcdFx0XHRtYXhWYWx1ZSA9IHJhbmdlTWF4VmFsdWU7XG5cblx0XHRcdFx0XHRcdCRyYW5nZU51bWJlci5maW5kKCAnLm1heC12YWx1ZScgKS52YWwoIG1heFZhbHVlICk7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0Ly8gRm9yY2UgdGhlIG1heFZhbHVlIG5vdCB0byBnbyBiZWxvdyB0aGUgbWluVmFsdWUuXG5cdFx0XHRcdFx0aWYgKCBwYXJzZUZsb2F0KCBtaW5WYWx1ZSApID4gcGFyc2VGbG9hdCggbWF4VmFsdWUgKSApIHtcblx0XHRcdFx0XHRcdG1heFZhbHVlID0gbWluVmFsdWU7XG5cblx0XHRcdFx0XHRcdCRyYW5nZU51bWJlci5maW5kKCAnLm1heC12YWx1ZScgKS52YWwoIG1heFZhbHVlICk7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0aWYgKCBtaW5WYWx1ZSA9PT0gcmFuZ2VNaW5WYWx1ZSAmJiBtYXhWYWx1ZSA9PT0gcmFuZ2VNYXhWYWx1ZSApIHtcblx0XHRcdFx0XHRcdGNvbnN0IHF1ZXJ5ID0gd2NhcGZSZW1vdmVRdWVyeVN0cmluZ1BhcmFtZXRlciggZmlsdGVyS2V5ICk7XG5cdFx0XHRcdFx0XHRoaXN0b3J5LnB1c2hTdGF0ZSgge30sICcnLCBxdWVyeSApO1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRjb25zdCBmaWx0ZXJWYWxTdHJpbmcgPSBtaW5WYWx1ZSArIHJhbmdlVmFsdWVzU2VwYXJhdG9yICsgbWF4VmFsdWU7XG5cdFx0XHRcdFx0XHR3Y2FwZlVwZGF0ZVF1ZXJ5U3RyaW5nUGFyYW1ldGVyKCBmaWx0ZXJLZXksIGZpbHRlclZhbFN0cmluZyApO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdC8vIGZpbHRlciBwcm9kdWN0c1xuXHRcdFx0XHRcdHdjYXBmRmlsdGVyUHJvZHVjdHMoKTtcblx0XHRcdFx0fSwgZGVsYXkgKSApO1xuXHRcdFx0fVxuXHRcdCk7XG5cblx0XHQvLyBoYW5kbGUgcmVtb3ZpbmcgdGhlIGFjdGl2ZSBmaWx0ZXJzXG5cdFx0JHdjYXBmTmF2RmlsdGVycy5vbihcblx0XHRcdCdjbGljaycsXG5cdFx0XHQnLndjYXBmLWFjdGl2ZS1maWx0ZXJzIC5pdGVtJyxcblx0XHRcdGZ1bmN0aW9uKCBldmVudCApIHtcblx0XHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcblxuXHRcdFx0XHRjb25zdCAkaXRlbSAgICAgICA9ICQoIHRoaXMgKTtcblx0XHRcdFx0Y29uc3QgZmlsdGVyS2V5ICAgPSAkaXRlbS5hdHRyKCAnZGF0YS1maWx0ZXIta2V5JyApO1xuXHRcdFx0XHRjb25zdCBmaWx0ZXJWYWx1ZSA9ICRpdGVtLmF0dHIoICdkYXRhLXZhbHVlJyApO1xuXG5cdFx0XHRcdHdjYXBmTWFrZVBhcmFtZXRlcnMoIGZpbHRlcktleSwgZmlsdGVyVmFsdWUsIHRydWUgKTtcblx0XHRcdH1cblx0XHQpO1xuXG5cdFx0ZnVuY3Rpb24gcmVzZXRGaWx0ZXJzKCAkYnV0dG9uICkge1xuXHRcdFx0Y29uc3QgX2ZpbHRlcktleXMgPSAkYnV0dG9uLmF0dHIoICdkYXRhLWtleXMnICk7XG5cblx0XHRcdGlmICggISBfZmlsdGVyS2V5cyApIHtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXG5cdFx0XHRjb25zdCBmaWx0ZXJLZXlzID0gX2ZpbHRlcktleXMuc3BsaXQoICcsJyApO1xuXG5cdFx0XHRsZXQgcXVlcnkgPSAnJztcblxuXHRcdFx0JC5lYWNoKCBmaWx0ZXJLZXlzLCBmdW5jdGlvbiggaSwgZmlsdGVyS2V5ICkge1xuXHRcdFx0XHRpZiAoIHF1ZXJ5ICkge1xuXHRcdFx0XHRcdHF1ZXJ5ID0gd2NhcGZSZW1vdmVRdWVyeVN0cmluZ1BhcmFtZXRlciggZmlsdGVyS2V5LCBxdWVyeSApO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdHF1ZXJ5ID0gd2NhcGZSZW1vdmVRdWVyeVN0cmluZ1BhcmFtZXRlciggZmlsdGVyS2V5ICk7XG5cdFx0XHRcdH1cblx0XHRcdH0gKTtcblxuXHRcdFx0Ly8gRW1wdHkgcXVlcnkgY2F1c2VzIGlzc3VlKGRvZXNuJ3QgcmVtb3ZlIHRoZSBmaWx0ZXIga2V5cyBmcm9tIHRoZSB1cmwpLFxuXHRcdFx0Ly8gdGhpcyBpcyB3aHkgd2UgYXJlIHNldHRpbmcgdGhlIHBhZ2UgdXJsIGFzIHF1ZXJ5LlxuXHRcdFx0aWYgKCAhIHF1ZXJ5ICkge1xuXHRcdFx0XHRjb25zdCBwcmV2VXJsID0gd2luZG93LmxvY2F0aW9uLmhyZWY7XG5cdFx0XHRcdGNvbnN0IG5ld1VybCAgPSBwcmV2VXJsLnNwbGl0KCAnPycgKTtcblxuXHRcdFx0XHRxdWVyeSA9IG5ld1VybFsgMCBdO1xuXHRcdFx0fVxuXG5cdFx0XHRoaXN0b3J5LnB1c2hTdGF0ZSgge30sICcnLCBxdWVyeSApO1xuXG5cdFx0XHQvLyBmaWx0ZXIgcHJvZHVjdHNcblx0XHRcdHdjYXBmRmlsdGVyUHJvZHVjdHMoIHRydWUgKTtcblx0XHR9XG5cblx0XHQvLyBjbGVhci9yZXNldCBhbGwgZmlsdGVyc1xuXHRcdCRib2R5Lm9uKCAnd2NhcGYtcmVzZXQtZmlsdGVycycsIGZ1bmN0aW9uKCBlLCAkYnV0dG9uICkge1xuXHRcdFx0cmVzZXRGaWx0ZXJzKCAkYnV0dG9uICk7XG5cdFx0fSApO1xuXG5cdFx0JHdjYXBmTmF2RmlsdGVycy5vbiggJ2NsaWNrJywgJy53Y2FwZi1yZXNldC1maWx0ZXJzLWJ0bicsIGZ1bmN0aW9uKCBldmVudCApIHtcblx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cblx0XHRcdGNvbnN0ICRidXR0b24gPSAkKCB0aGlzICk7XG5cblx0XHRcdCRib2R5LnRyaWdnZXIoICd3Y2FwZi1yZXNldC1maWx0ZXJzJywgWyAkYnV0dG9uIF0gKTtcblx0XHR9ICk7XG5cblx0XHQkd2NhcGZTaW5nbGVGaWx0ZXJzLm9uKCAnd2NhcGYtY2xlYXItZmlsdGVyJywgZnVuY3Rpb24oKSB7XG5cdFx0XHRjb25zdCAkZmllbGQgICAgPSAkKCB0aGlzICk7XG5cdFx0XHRjb25zdCBmaWVsZElEICAgPSAkZmllbGQuYXR0ciggJ2RhdGEtaWQnICk7XG5cdFx0XHRjb25zdCBmaWVsZERhdGEgPSBmaWVsZHNbIGZpZWxkSUQgXTtcblx0XHRcdGNvbnN0IGZpbHRlcktleSA9IGZpZWxkRGF0YS5maWx0ZXJLZXk7XG5cblx0XHRcdGNvbnN0IHF1ZXJ5ID0gd2NhcGZSZW1vdmVRdWVyeVN0cmluZ1BhcmFtZXRlciggZmlsdGVyS2V5ICk7XG5cdFx0XHRoaXN0b3J5LnB1c2hTdGF0ZSgge30sICcnLCBxdWVyeSApO1xuXG5cdFx0XHQvLyBmaWx0ZXIgcHJvZHVjdHNcblx0XHRcdHdjYXBmRmlsdGVyUHJvZHVjdHMoIHRydWUgKTtcblx0XHR9ICk7XG5cblx0XHQkYm9keS5vbiggJ3djYXBmLXJ1bi1maWx0ZXItcHJvZHVjdHMnLCBmdW5jdGlvbiggZSwgZm9yY2VSZVJlbmRlciApIHtcblx0XHRcdHdjYXBmRmlsdGVyUHJvZHVjdHMoIGZvcmNlUmVSZW5kZXIgKTtcblx0XHR9ICk7XG5cblx0XHQvLyBoaXN0b3J5IGJhY2sgYW5kIGZvcndhcmQgcmVxdWVzdCBoYW5kbGluZ1xuXHRcdCQoIHdpbmRvdyApLmJpbmQoICdwb3BzdGF0ZScsIGZ1bmN0aW9uKCkge1xuXHRcdFx0Ly8gZmlsdGVyIHByb2R1Y3RzXG5cdFx0XHR3Y2FwZkZpbHRlclByb2R1Y3RzKCB0cnVlICk7XG5cdFx0fSApO1xuXG5cdH1cbik7XG4iXX0=
