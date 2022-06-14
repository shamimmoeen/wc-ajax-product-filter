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

  $wcapfSingleFilters.on('wcapf-clear-filter', function () {
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNob3Nlbi5qcyIsImZpbHRlci1mb3JtLmpzIl0sIm5hbWVzIjpbImpRdWVyeSIsImRvY3VtZW50IiwicmVhZHkiLCIkIiwid2NhcGZfcGFyYW1zIiwiJGJvZHkiLCJyYW5nZVZhbHVlc1NlcGFyYXRvciIsIl9kZWxheSIsInBhcnNlSW50IiwiZmlsdGVyX2lucHV0X2RlbGF5IiwiZGVsYXkiLCJmaWVsZHMiLCIkd2NhcGZTaW5nbGVGaWx0ZXJzIiwiJHdjYXBmTmF2RmlsdGVycyIsIiR3Y2FwZk51bWJlclJhbmdlRmlsdGVycyIsImVhY2giLCIkZmllbGQiLCJpZCIsImF0dHIiLCIkd3JhcHBlciIsImZpbmQiLCJmaWx0ZXJLZXkiLCJtdWx0aXBsZUZpbHRlciIsImluaXRDaG9zZW4iLCJjaG9zZW4iLCIkdGhpcyIsIm9wdGlvbnMiLCJub1Jlc3VsdHNNZXNzYWdlIiwic2VhcmNoVGhyZXNob2xkIiwiY2hvc2VuX2xpYl9zZWFyY2hfdGhyZXNob2xkIiwiaW5pdEhpZXJhcmNoeUFjY29yZGlvbiIsIm9uIiwidG9nZ2xlQ2xhc3MiLCJudW1iZXJfZm9ybWF0IiwibnVtYmVyIiwiZGVjaW1hbHMiLCJkZWNfcG9pbnQiLCJ0aG91c2FuZHNfc2VwIiwicmVwbGFjZSIsIm4iLCJpc0Zpbml0ZSIsInByZWMiLCJNYXRoIiwiYWJzIiwic2VwIiwiZGVjIiwicyIsInRvRml4ZWRGaXgiLCJrIiwicG93Iiwicm91bmQiLCJzcGxpdCIsImxlbmd0aCIsIkFycmF5Iiwiam9pbiIsImluaXROb1VJU2xpZGVyIiwibm9VaVNsaWRlciIsIiRpdGVtIiwiJHNsaWRlciIsImhhc0NsYXNzIiwic2xpZGVySWQiLCJkaXNwbGF5VmFsdWVzQXMiLCJyYW5nZU1pblZhbHVlIiwicGFyc2VGbG9hdCIsInJhbmdlTWF4VmFsdWUiLCJzdGVwIiwiZGVjaW1hbFBsYWNlcyIsInRob3VzYW5kU2VwYXJhdG9yIiwiZGVjaW1hbFNlcGFyYXRvciIsIm1pblZhbHVlIiwibWF4VmFsdWUiLCIkbWluVmFsdWUiLCIkbWF4VmFsdWUiLCJzbGlkZXIiLCJnZXRFbGVtZW50QnlJZCIsImNyZWF0ZSIsInN0YXJ0IiwiY29ubmVjdCIsImNzc1ByZWZpeCIsInJhbmdlIiwidmFsdWVzIiwiaHRtbCIsInZhbCIsInRyaWdnZXIiLCJmaWx0ZXJQcm9kdWN0c0FjY29yZGluZ1RvU2xpZGVyIiwicXVlcnkiLCJ3Y2FwZlJlbW92ZVF1ZXJ5U3RyaW5nUGFyYW1ldGVyIiwiaGlzdG9yeSIsInB1c2hTdGF0ZSIsImZpbHRlclZhbFN0cmluZyIsIndjYXBmVXBkYXRlUXVlcnlTdHJpbmdQYXJhbWV0ZXIiLCJ3Y2FwZkZpbHRlclByb2R1Y3RzIiwiY2xlYXJUaW1lb3V0IiwiZGF0YSIsInNldFRpbWVvdXQiLCJyZW1vdmVEYXRhIiwiZXZlbnQiLCJwcmV2ZW50RGVmYXVsdCIsIiRpbnB1dCIsInNldCIsImdldCIsImluaXREYXRlcGlja2VyIiwiZGF0ZXBpY2tlciIsIiR3Y2FwZkRhdGVGaWx0ZXJzIiwiJHdjYXBmRGF0ZUZpbHRlciIsImZvcm1hdCIsInllYXJEcm9wZG93biIsIm1vbnRoRHJvcGRvd24iLCIkZnJvbSIsIiR0byIsImRhdGVGb3JtYXQiLCJjaGFuZ2VZZWFyIiwiY2hhbmdlTW9udGgiLCJmaWx0ZXJCeURhdGUiLCJ3Y2FwZkJlZm9yZVVwZGF0ZSIsIndjYXBmQWZ0ZXJVcGRhdGUiLCJmb3JjZVJlUmVuZGVyIiwid2luZG93IiwibG9jYXRpb24iLCJocmVmIiwiJGRhdGEiLCIkc2hvcExvb3BDb250YWluZXIiLCJzaG9wX2xvb3BfY29udGFpbmVyIiwiJG5vdEZvdW5kQ29udGFpbmVyIiwibm90X2ZvdW5kX2NvbnRhaW5lciIsImZpZWxkSUQiLCIkaW5uZXIiLCJfZmllbGQiLCJmaWVsZENsYXNzIiwiX2h0bWwiLCJjdXN0b21fc2NyaXB0cyIsImV2YWwiLCJ3Y2FwZkdldFVybFZhcnMiLCJ1cmwiLCJ2YXJzIiwiaGFzaCIsInJlcGxhY2VBbGwiLCJoYXNoZXMiLCJzbGljZSIsImluZGV4T2YiLCJoTGVuZ3RoIiwiaSIsIndjYXBmRml4UGFnaW5hdGlvbiIsInBhcmFtcyIsImN1cnJlbnRQYWdlSW5VcmwiLCJjdXJyZW50UGFnZUluUGFyYW1zIiwia2V5IiwidmFsdWUiLCJwdXNoSGlzdG9yeSIsInJlIiwiUmVnRXhwIiwic2VwYXJhdG9yIiwidXJsV2l0aFF1ZXJ5IiwibWF0Y2giLCJvbGRQYXJhbXMiLCJvbGRQYXJhbXNMZW5ndGgiLCJPYmplY3QiLCJrZXlzIiwic3RhcnRQb3NpdGlvbiIsImZpbHRlcktleVBvc2l0aW9uIiwiY2xlYW5VcmwiLCJjbGVhblF1ZXJ5IiwibmV3UGFyYW1zIiwid2NhcGZNYWtlUGFyYW1ldGVycyIsImZpbHRlclZhbHVlIiwiZm9yY2VSZXJlbmRlciIsInZhbHVlU2VwYXJhdG9yIiwibmV4dFZhbHVlcyIsImVtcHR5VmFsdWUiLCJwcmV2VmFsdWVzIiwicHJldlZhbHVlc0FycmF5IiwiZm91bmQiLCJpbkFycmF5Iiwic3BsaWNlIiwicHVzaCIsIndjYXBmU2luZ2xlRmlsdGVyIiwiaGFuZGxlRmlsdGVyUmVxdWVzdCIsImNsb3Nlc3QiLCJmaWVsZERhdGEiLCJ0b1N0cmluZyIsIiRyYW5nZU51bWJlciIsInJlc2V0RmlsdGVycyIsIiRidXR0b24iLCJfZmlsdGVyS2V5cyIsImZpbHRlcktleXMiLCJwcmV2VXJsIiwibmV3VXJsIiwiZSIsImlzUmFuZ2UiLCJydW5GaWx0ZXIiLCJmcm9tIiwidG8iLCJiaW5kIl0sIm1hcHBpbmdzIjoiOztBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUFBLE1BQU0sQ0FBRUMsUUFBRixDQUFOLENBQW1CQyxLQUFuQixDQUEwQixVQUFVQyxDQUFWLEVBQWMsQ0FJdkMsQ0FKRDs7O0FDWEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBLElBQU1DLFlBQVksR0FBR0EsWUFBWSxJQUFJO0FBQ3BDLHdCQUFzQixFQURjO0FBRXBDLGlDQUErQixFQUZLO0FBR3BDLHlC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LFFBQU14RyxTQUFTLEdBQUc2SixTQUFTLENBQUM3SixTQUE1QjtBQUVBLFFBQU1nRSxLQUFLLEdBQUdDLCtCQUErQixDQUFFakUsU0FBRixDQUE3QztBQUNBa0UsSUFBQUEsT0FBTyxDQUFDQyxTQUFSLENBQW1CLEVBQW5CLEVBQXVCLEVBQXZCLEVBQTJCSCxLQUEzQixFQVB3RCxDQVN4RDs7QUFDQU0sSUFBQUEsbUJBQW1CLENBQUUsSUFBRixDQUFuQjtBQUNBLEdBWEQsRUFwMEJhLENBaTFCYjs7QUFDQXhGLEVBQUFBLENBQUMsQ0FBRWtILE1BQUYsQ0FBRCxDQUFZMkUsSUFBWixDQUFrQixVQUFsQixFQUE4QixZQUFXO0FBQ3hDO0FBQ0FyRyxJQUFBQSxtQkFBbUIsQ0FBRSxJQUFGLENBQW5CO0FBQ0EsR0FIRDtBQUtBLENBeDFCRiIsImZpbGUiOiJ3Yy1hamF4LXByb2R1Y3QtZmlsdGVyLXB1YmxpYy1zY3JpcHRzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBEaXNwbGF5IHR5cGUgZmllbGRzLlxuICpcbiAqIFRPRE86IE1heWJlIGRlbGV0ZS5cbiAqXG4gKiBAc2luY2UgICAgICAzLjAuMFxuICogQHBhY2thZ2UgICAgd2MtYWpheC1wcm9kdWN0LWZpbHRlclxuICogQHN1YnBhY2thZ2Ugd2MtYWpheC1wcm9kdWN0LWZpbHRlci9hZG1pbi9zcmMvanNcbiAqIEBhdXRob3IgICAgIE1haW51bCBIYXNzYW4gTWFpblxuICovXG5cbmpRdWVyeSggZG9jdW1lbnQgKS5yZWFkeSggZnVuY3Rpb24oICQgKSB7XG5cblxuXG59ICk7XG4iLCIvKipcbiAqIFRoZSBmcm9udGVuZCBmaWx0ZXIgZm9ybS5cbiAqXG4gKiBAc2luY2UgICAgICAzLjAuMFxuICogQHBhY2thZ2UgICAgd2MtYWpheC1wcm9kdWN0LWZpbHRlclxuICogQHN1YnBhY2thZ2Ugd2MtYWpheC1wcm9kdWN0LWZpbHRlci9wdWJsaWMvc3JjL2pzXG4gKiBAYXV0aG9yICAgICBNYWludWwgSGFzc2FuIE1haW5cbiAqL1xuXG5jb25zdCB3Y2FwZl9wYXJhbXMgPSB3Y2FwZl9wYXJhbXMgfHwge1xuXHQnZmlsdGVyX2lucHV0X2RlbGF5JzogJycsXG5cdCdjaG9zZW5fbGliX3NlYXJjaF90aHJlc2hvbGQnOiAnJyxcblx0J3Nob3BfbG9vcF9jb250YWluZXInOiAnJyxcblx0J25vdF9mb3VuZF9jb250YWluZXInOiAnJyxcblx0J3BhZ2luYXRpb25fY29udGFpbmVyJzogJycsIC8vIHRvZG9cblx0J3NvcnRpbmdfY29udHJvbCc6ICcnLCAvLyB0b2RvXG5cdCdzY3JvbGxfdG9fdG9wJzogJycsIC8vIHRvZG9cblx0J3Njcm9sbF90b190b3Bfb2Zmc2V0JzogJycsIC8vIHRvZG9cblx0J2N1c3RvbV9zY3JpcHRzJzogJycsXG59O1xuXG5qUXVlcnkoIGRvY3VtZW50ICkucmVhZHkoXG5cdGZ1bmN0aW9uKCAkICkge1xuXG5cdFx0Y29uc3QgJGJvZHkgPSAkKCAnYm9keScgKTtcblxuXHRcdGNvbnN0IHJhbmdlVmFsdWVzU2VwYXJhdG9yID0gJ34nO1xuXG5cdFx0Ly8gcmV0dXJuIGZhbHNlIGlmIHdjYXBmX3BhcmFtcyB2YXJpYWJsZSBpcyBub3QgZm91bmRcblx0XHRpZiAoIHR5cGVvZiB3Y2FwZl9wYXJhbXMgPT09ICd1bmRlZmluZWQnICkge1xuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH1cblxuXHRcdGNvbnN0IF9kZWxheSA9IHBhcnNlSW50KCB3Y2FwZl9wYXJhbXMuZmlsdGVyX2lucHV0X2RlbGF5ICk7XG5cdFx0Y29uc3QgZGVsYXkgID0gX2RlbGF5ID49IDAgPyBfZGVsYXkgOiA4MDA7XG5cblx0XHQvLyBzdG9yZSBmaWVsZHMnIGlkIGFuZCBmaWx0ZXIgaW5mb3JtYXRpb25cblx0XHRjb25zdCBmaWVsZHMgPSB7fTtcblxuXHRcdGNvbnN0ICR3Y2FwZlNpbmdsZUZpbHRlcnMgICAgICA9ICQoICcud2NhcGYtc2luZ2xlLWZpbHRlcicgKTtcblx0XHRjb25zdCAkd2NhcGZOYXZGaWx0ZXJzICAgICAgICAgPSAkKCAnLndjYXBmLW5hdi1maWx0ZXInICk7XG5cdFx0Y29uc3QgJHdjYXBmTnVtYmVyUmFuZ2VGaWx0ZXJzID0gJCggJy53Y2FwZi1udW1iZXItcmFuZ2UtZmlsdGVyJyApO1xuXG5cdFx0JHdjYXBmU2luZ2xlRmlsdGVycy5lYWNoKFxuXHRcdFx0ZnVuY3Rpb24oKSB7XG5cdFx0XHRcdGNvbnN0ICRmaWVsZCAgICAgICAgID0gJCggdGhpcyApO1xuXHRcdFx0XHRjb25zdCBpZCAgICAgICAgICAgICA9ICRmaWVsZC5hdHRyKCAnZGF0YS1pZCcgKTtcblx0XHRcdFx0Y29uc3QgJHdyYXBwZXIgICAgICAgPSAkZmllbGQuZmluZCggJy53Y2FwZi1maWVsZC1pbm5lciA+IGRpdicgKTtcblx0XHRcdFx0Y29uc3QgZmlsdGVyS2V5ICAgICAgPSAkd3JhcHBlci5hdHRyKCAnZGF0YS1maWx0ZXIta2V5JyApO1xuXHRcdFx0XHRjb25zdCBtdWx0aXBsZUZpbHRlciA9IHBhcnNlSW50KCAkd3JhcHBlci5hdHRyKCAnZGF0YS1tdWx0aXBsZS1maWx0ZXInICkgKTtcblxuXHRcdFx0XHRmaWVsZHNbIGlkIF0gPSB7XG5cdFx0XHRcdFx0ZmlsdGVyS2V5OiBmaWx0ZXJLZXksXG5cdFx0XHRcdFx0bXVsdGlwbGVGaWx0ZXI6IG11bHRpcGxlRmlsdGVyXG5cdFx0XHRcdH07XG5cdFx0XHR9XG5cdFx0KTtcblxuXHRcdC8vIEluaXRpYWxpemUgalF1ZXJ5IGNob3NlbiBsaWJyYXJ5XG5cdFx0ZnVuY3Rpb24gaW5pdENob3NlbigpIHtcblx0XHRcdGlmICggISBqUXVlcnkoKS5jaG9zZW4gKSB7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblxuXHRcdFx0JHdjYXBmTmF2RmlsdGVycy5maW5kKCAnLndjYXBmLWNob3Nlbi1zZWxlY3QnICkuZWFjaCggZnVuY3Rpb24oKSB7XG5cdFx0XHRcdGNvbnN0ICR0aGlzICAgPSAkKCB0aGlzICk7XG5cdFx0XHRcdGNvbnN0IG9wdGlvbnMgPSB7fTtcblxuXHRcdFx0XHRjb25zdCBub1Jlc3VsdHNNZXNzYWdlID0gJHRoaXMuYXR0ciggJ2RhdGEtbm8tcmVzdWx0cy1tZXNzYWdlJyApO1xuXG5cdFx0XHRcdGlmICggbm9SZXN1bHRzTWVzc2FnZSApIHtcblx0XHRcdFx0XHRvcHRpb25zWyAnbm9fcmVzdWx0c190ZXh0JyBdID0gbm9SZXN1bHRzTWVzc2FnZTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGNvbnN0IHNlYXJjaFRocmVzaG9sZCA9IHBhcnNlSW50KCB3Y2FwZl9wYXJhbXMuY2hvc2VuX2xpYl9zZWFyY2hfdGhyZXNob2xkICk7XG5cblx0XHRcdFx0aWYgKCBzZWFyY2hUaHJlc2hvbGQgKSB7XG5cdFx0XHRcdFx0b3B0aW9uc1sgJ2Rpc2FibGVfc2VhcmNoX3RocmVzaG9sZCcgXSA9IHNlYXJjaFRocmVzaG9sZDtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdCR0aGlzLmNob3Nlbiggb3B0aW9ucyApO1xuXHRcdFx0fSApO1xuXHRcdH1cblxuXHRcdGluaXRDaG9zZW4oKTtcblxuXHRcdC8vIEluaXRpYWxpemUgaGllcmFyY2h5IGFjY29yZGlvblxuXHRcdGZ1bmN0aW9uIGluaXRIaWVyYXJjaHlBY2NvcmRpb24oKSB7XG5cdFx0XHQkd2NhcGZOYXZGaWx0ZXJzLmZpbmQoICcuaGllcmFyY2h5LWFjY29yZGlvbi10b2dnbGUnICkub24oICdjbGljaycsIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHQkKCB0aGlzICkudG9nZ2xlQ2xhc3MoICdhY3RpdmUnICk7XG5cdFx0XHR9ICk7XG5cdFx0fVxuXG5cdFx0aW5pdEhpZXJhcmNoeUFjY29yZGlvbigpO1xuXG5cdFx0LyoqXG5cdFx0ICogQHNvdXJjZSBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL2EvMzQxNDE4MTNcblx0XHQgKlxuXHRcdCAqIEBwYXJhbSBudW1iZXJcblx0XHQgKiBAcGFyYW0gZGVjaW1hbHNcblx0XHQgKiBAcGFyYW0gZGVjX3BvaW50XG5cdFx0ICogQHBhcmFtIHRob3VzYW5kc19zZXBcblx0XHQgKlxuXHRcdCAqIEByZXR1cm5zIHtzdHJpbmd9XG5cdFx0ICovXG5cdFx0ZnVuY3Rpb24gbnVtYmVyX2Zvcm1hdCggbnVtYmVyLCBkZWNpbWFscywgZGVjX3BvaW50LCB0aG91c2FuZHNfc2VwICkge1xuXHRcdFx0Ly8gU3RyaXAgYWxsIGNoYXJhY3RlcnMgYnV0IG51bWVyaWNhbCBvbmVzLlxuXHRcdFx0bnVtYmVyID0gKCBudW1iZXIgKyAnJyApLnJlcGxhY2UoIC9bXlxcZCtcXC1FZS5dL2csICcnICk7XG5cblx0XHRcdGNvbnN0IG4gICAgPSAhIGlzRmluaXRlKCArbnVtYmVyICkgPyAwIDogK251bWJlcjtcblx0XHRcdGNvbnN0IHByZWMgPSAhIGlzRmluaXRlKCArZGVjaW1hbHMgKSA/IDAgOiBNYXRoLmFicyggZGVjaW1hbHMgKTtcblx0XHRcdGNvbnN0IHNlcCAgPSAoIHR5cGVvZiB0aG91c2FuZHNfc2VwID09PSAndW5kZWZpbmVkJyApID8gJywnIDogdGhvdXNhbmRzX3NlcDtcblx0XHRcdGNvbnN0IGRlYyAgPSAoIHR5cGVvZiBkZWNfcG9pbnQgPT09ICd1bmRlZmluZWQnICkgPyAnLicgOiBkZWNfcG9pbnQ7XG5cblx0XHRcdGxldCBzO1xuXG5cdFx0XHRjb25zdCB0b0ZpeGVkRml4ID0gZnVuY3Rpb24oIG4sIHByZWMgKSB7XG5cdFx0XHRcdGNvbnN0IGsgPSBNYXRoLnBvdyggMTAsIHByZWMgKTtcblx0XHRcdFx0cmV0dXJuICcnICsgTWF0aC5yb3VuZCggbiAqIGsgKSAvIGs7XG5cdFx0XHR9O1xuXG5cdFx0XHQvLyBGaXggZm9yIElFIHBhcnNlRmxvYXQoMC41NSkudG9GaXhlZCgwKSA9IDA7XG5cdFx0XHRzID0gKCBwcmVjID8gdG9GaXhlZEZpeCggbiwgcHJlYyApIDogJycgKyBNYXRoLnJvdW5kKCBuICkgKS5zcGxpdCggJy4nICk7XG5cblx0XHRcdGlmICggc1sgMCBdLmxlbmd0aCA+IDMgKSB7XG5cdFx0XHRcdHNbIDAgXSA9IHNbIDAgXS5yZXBsYWNlKCAvXFxCKD89KD86XFxkezN9KSsoPyFcXGQpKS9nLCBzZXAgKTtcblx0XHRcdH1cblxuXHRcdFx0aWYgKCAoIHNbIDEgXSB8fCAnJyApLmxlbmd0aCA8IHByZWMgKSB7XG5cdFx0XHRcdHNbIDEgXSA9IHNbIDEgXSB8fCAnJztcblx0XHRcdFx0c1sgMSBdICs9IG5ldyBBcnJheSggcHJlYyAtIHNbIDEgXS5sZW5ndGggKyAxICkuam9pbiggJzAnICk7XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiBzLmpvaW4oIGRlYyApO1xuXHRcdH1cblxuXHRcdC8vIEluaXRpYWxpemUgbm9VSVNsaWRlclxuXHRcdGZ1bmN0aW9uIGluaXROb1VJU2xpZGVyKCkge1xuXHRcdFx0aWYgKCAndW5kZWZpbmVkJyA9PT0gdHlwZW9mIG5vVWlTbGlkZXIgKSB7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblxuXHRcdFx0JHdjYXBmTnVtYmVyUmFuZ2VGaWx0ZXJzLmZpbmQoICcud2NhcGYtcmFuZ2Utc2xpZGVyJyApLmVhY2goIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRjb25zdCAkaXRlbSA9ICQoIHRoaXMgKTtcblxuXHRcdFx0XHRjb25zdCBmaWx0ZXJLZXkgPSAkaXRlbS5hdHRyKCAnZGF0YS1maWx0ZXIta2V5JyApO1xuXHRcdFx0XHRjb25zdCAkc2xpZGVyICAgPSAkaXRlbS5maW5kKCAnLndjYXBmLW5vdWktc2xpZGVyJyApO1xuXG5cdFx0XHRcdC8vIElmIHNsaWRlciBpcyBhbHJlYWR5IGluaXRpYWxpemVkIHRoZW4gZG9uJ3QgcmVpbml0aWFsaXplIGFnYWluLlxuXHRcdFx0XHRpZiAoICRzbGlkZXIuaGFzQ2xhc3MoICd3Y2FwZi1ub3VpLXRhcmdldCcgKSApIHtcblx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRjb25zdCBzbGlkZXJJZCAgICAgICAgICA9ICRzbGlkZXIuYXR0ciggJ2lkJyApO1xuXHRcdFx0XHRjb25zdCBkaXNwbGF5VmFsdWVzQXMgICA9ICRpdGVtLmF0dHIoICdkYXRhLWRpc3BsYXktdmFsdWVzLWFzJyApO1xuXHRcdFx0XHRjb25zdCByYW5nZU1pblZhbHVlICAgICA9IHBhcnNlRmxvYXQoICRpdGVtLmF0dHIoICdkYXRhLXJhbmdlLW1pbi12YWx1ZScgKSApO1xuXHRcdFx0XHRjb25zdCByYW5nZU1heFZhbHVlICAgICA9IHBhcnNlRmxvYXQoICRpdGVtLmF0dHIoICdkYXRhLXJhbmdlLW1heC12YWx1ZScgKSApO1xuXHRcdFx0XHRjb25zdCBzdGVwICAgICAgICAgICAgICA9IHBhcnNlRmxvYXQoICRpdGVtLmF0dHIoICdkYXRhLXN0ZXAnICkgKTtcblx0XHRcdFx0Y29uc3QgZGVjaW1hbFBsYWNlcyAgICAgPSAkaXRlbS5hdHRyKCAnZGF0YS1kZWNpbWFsLXBsYWNlcycgKTtcblx0XHRcdFx0Y29uc3QgdGhvdXNhbmRTZXBhcmF0b3IgPSAkaXRlbS5hdHRyKCAnZGF0YS10aG91c2FuZC1zZXBhcmF0b3InICk7XG5cdFx0XHRcdGNvbnN0IGRlY2ltYWxTZXBhcmF0b3IgID0gJGl0ZW0uYXR0ciggJ2RhdGEtZGVjaW1hbC1zZXBhcmF0b3InICk7XG5cdFx0XHRcdGNvbnN0IG1pblZhbHVlICAgICAgICAgID0gcGFyc2VGbG9hdCggJGl0ZW0uYXR0ciggJ2RhdGEtbWluLXZhbHVlJyApICk7XG5cdFx0XHRcdGNvbnN0IG1heFZhbHVlICAgICAgICAgID0gcGFyc2VGbG9hdCggJGl0ZW0uYXR0ciggJ2RhdGEtbWF4LXZhbHVlJyApICk7XG5cdFx0XHRcdGNvbnN0ICRtaW5WYWx1ZSAgICAgICAgID0gJGl0ZW0uZmluZCggJy5taW4tdmFsdWUnICk7XG5cdFx0XHRcdGNvbnN0ICRtYXhWYWx1ZSAgICAgICAgID0gJGl0ZW0uZmluZCggJy5tYXgtdmFsdWUnICk7XG5cblx0XHRcdFx0Y29uc3Qgc2xpZGVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoIHNsaWRlcklkICk7XG5cblx0XHRcdFx0bm9VaVNsaWRlci5jcmVhdGUoIHNsaWRlciwge1xuXHRcdFx0XHRcdHN0YXJ0OiBbIG1pblZhbHVlLCBtYXhWYWx1ZSBdLFxuXHRcdFx0XHRcdHN0ZXAsXG5cdFx0XHRcdFx0Y29ubmVjdDogdHJ1ZSxcblx0XHRcdFx0XHRjc3NQcmVmaXg6ICd3Y2FwZi1ub3VpLScsXG5cdFx0XHRcdFx0cmFuZ2U6IHtcblx0XHRcdFx0XHRcdCdtaW4nOiByYW5nZU1pblZhbHVlLFxuXHRcdFx0XHRcdFx0J21heCc6IHJhbmdlTWF4VmFsdWUsXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9ICk7XG5cblx0XHRcdFx0c2xpZGVyLm5vVWlTbGlkZXIub24oICd1cGRhdGUnLCBmdW5jdGlvbiggdmFsdWVzICkge1xuXHRcdFx0XHRcdGNvbnN0IG1pblZhbHVlID0gbnVtYmVyX2Zvcm1hdCggdmFsdWVzWyAwIF0sIGRlY2ltYWxQbGFjZXMsIGRlY2ltYWxTZXBhcmF0b3IsIHRob3VzYW5kU2VwYXJhdG9yICk7XG5cdFx0XHRcdFx0Y29uc3QgbWF4VmFsdWUgPSBudW1iZXJfZm9ybWF0KCB2YWx1ZXNbIDEgXSwgZGVjaW1hbFBsYWNlcywgZGVjaW1hbFNlcGFyYXRvciwgdGhvdXNhbmRTZXBhcmF0b3IgKTtcblxuXHRcdFx0XHRcdGlmICggJ3BsYWluX3RleHQnID09PSBkaXNwbGF5VmFsdWVzQXMgKSB7XG5cdFx0XHRcdFx0XHQkbWluVmFsdWUuaHRtbCggbWluVmFsdWUgKTtcblx0XHRcdFx0XHRcdCRtYXhWYWx1ZS5odG1sKCBtYXhWYWx1ZSApO1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHQkbWluVmFsdWUudmFsKCBtaW5WYWx1ZSApO1xuXHRcdFx0XHRcdFx0JG1heFZhbHVlLnZhbCggbWF4VmFsdWUgKTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHQkYm9keS50cmlnZ2VyKCAnd2NhcGYtbm91aXNsaWRlci11cGRhdGUnLCBbICRpdGVtLCB2YWx1ZXMgXSApO1xuXHRcdFx0XHR9ICk7XG5cblx0XHRcdFx0ZnVuY3Rpb24gZmlsdGVyUHJvZHVjdHNBY2NvcmRpbmdUb1NsaWRlciggdmFsdWVzICkge1xuXHRcdFx0XHRcdCRib2R5LnRyaWdnZXIoICd3Y2FwZi1ub3Vpc2xpZGVyLWJlZm9yZS1maWx0ZXItcHJvZHVjdHMnLCBbICRpdGVtLCB2YWx1ZXMgXSApO1xuXG5cdFx0XHRcdFx0Y29uc3QgbWluVmFsdWUgPSBwYXJzZUZsb2F0KCB2YWx1ZXNbIDAgXSApO1xuXHRcdFx0XHRcdGNvbnN0IG1heFZhbHVlID0gcGFyc2VGbG9hdCggdmFsdWVzWyAxIF0gKTtcblxuXHRcdFx0XHRcdGlmICggbWluVmFsdWUgPT09IHJhbmdlTWluVmFsdWUgJiYgbWF4VmFsdWUgPT09IHJhbmdlTWF4VmFsdWUgKSB7XG5cdFx0XHRcdFx0XHRjb25zdCBxdWVyeSA9IHdjYXBmUmVtb3ZlUXVlcnlTdHJpbmdQYXJhbWV0ZXIoIGZpbHRlcktleSApO1xuXHRcdFx0XHRcdFx0aGlzdG9yeS5wdXNoU3RhdGUoIHt9LCAnJywgcXVlcnkgKTtcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0Y29uc3QgZmlsdGVyVmFsU3RyaW5nID0gbWluVmFsdWUgKyByYW5nZVZhbHVlc1NlcGFyYXRvciArIG1heFZhbHVlO1xuXHRcdFx0XHRcdFx0d2NhcGZVcGRhdGVRdWVyeVN0cmluZ1BhcmFtZXRlciggZmlsdGVyS2V5LCBmaWx0ZXJWYWxTdHJpbmcgKTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHQvLyBmaWx0ZXIgcHJvZHVjdHNcblx0XHRcdFx0XHR3Y2FwZkZpbHRlclByb2R1Y3RzKCk7XG5cblx0XHRcdFx0XHQkYm9keS50cmlnZ2VyKCAnd2NhcGYtbm91aXNsaWRlci1hZnRlci1maWx0ZXItcHJvZHVjdHMnLCBbICRpdGVtLCB2YWx1ZXMgXSApO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0c2xpZGVyLm5vVWlTbGlkZXIub24oICdzZXQnLCBmdW5jdGlvbiggdmFsdWVzICkge1xuXHRcdFx0XHRcdC8vIENsZWFyIGFueSBwcmV2aW91c2x5IHNldCB0aW1lciBiZWZvcmUgc2V0dGluZyBhIGZyZXNoIG9uZVxuXHRcdFx0XHRcdGNsZWFyVGltZW91dCggJGl0ZW0uZGF0YSggJ3RpbWVyJyApICk7XG5cblx0XHRcdFx0XHQkaXRlbS5kYXRhKCAndGltZXInLCBzZXRUaW1lb3V0KCBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHRcdCRpdGVtLnJlbW92ZURhdGEoICd0aW1lcicgKTtcblxuXHRcdFx0XHRcdFx0ZmlsdGVyUHJvZHVjdHNBY2NvcmRpbmdUb1NsaWRlciggdmFsdWVzICk7XG5cdFx0XHRcdFx0fSwgZGVsYXkgKSApO1xuXHRcdFx0XHR9ICk7XG5cblx0XHRcdFx0JG1pblZhbHVlLm9uKCAnaW5wdXQnLCBmdW5jdGlvbiggZXZlbnQgKSB7XG5cdFx0XHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcblxuXHRcdFx0XHRcdGNvbnN0ICRpbnB1dCA9ICQoIHRoaXMgKTtcblxuXHRcdFx0XHRcdC8vIENsZWFyIGFueSBwcmV2aW91c2x5IHNldCB0aW1lciBiZWZvcmUgc2V0dGluZyBhIGZyZXNoIG9uZVxuXHRcdFx0XHRcdGNsZWFyVGltZW91dCggJGlucHV0LmRhdGEoICd0aW1lcicgKSApO1xuXG5cdFx0XHRcdFx0JGlucHV0LmRhdGEoICd0aW1lcicsIHNldFRpbWVvdXQoIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdFx0JGlucHV0LnJlbW92ZURhdGEoICd0aW1lcicgKTtcblxuXHRcdFx0XHRcdFx0Y29uc3QgbWluVmFsdWUgPSAkaW5wdXQudmFsKCk7XG5cblx0XHRcdFx0XHRcdHNsaWRlci5ub1VpU2xpZGVyLnNldCggWyBtaW5WYWx1ZSwgbnVsbCBdICk7XG5cblx0XHRcdFx0XHRcdGZpbHRlclByb2R1Y3RzQWNjb3JkaW5nVG9TbGlkZXIoIHNsaWRlci5ub1VpU2xpZGVyLmdldCgpICk7XG5cdFx0XHRcdFx0fSwgZGVsYXkgKSApO1xuXHRcdFx0XHR9ICk7XG5cblx0XHRcdFx0JG1heFZhbHVlLm9uKCAnaW5wdXQnLCBmdW5jdGlvbiggZXZlbnQgKSB7XG5cdFx0XHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcblxuXHRcdFx0XHRcdGNvbnN0ICRpbnB1dCA9ICQoIHRoaXMgKTtcblxuXHRcdFx0XHRcdC8vIENsZWFyIGFueSBwcmV2aW91c2x5IHNldCB0aW1lciBiZWZvcmUgc2V0dGluZyBhIGZyZXNoIG9uZVxuXHRcdFx0XHRcdGNsZWFyVGltZW91dCggJGlucHV0LmRhdGEoICd0aW1lcicgKSApO1xuXG5cdFx0XHRcdFx0JGlucHV0LmRhdGEoICd0aW1lcicsIHNldFRpbWVvdXQoIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdFx0JGlucHV0LnJlbW92ZURhdGEoICd0aW1lcicgKTtcblxuXHRcdFx0XHRcdFx0Y29uc3QgbWF4VmFsdWUgPSAkaW5wdXQudmFsKCk7XG5cblx0XHRcdFx0XHRcdHNsaWRlci5ub1VpU2xpZGVyLnNldCggWyBudWxsLCBtYXhWYWx1ZSBdICk7XG5cblx0XHRcdFx0XHRcdGZpbHRlclByb2R1Y3RzQWNjb3JkaW5nVG9TbGlkZXIoIHNsaWRlci5ub1VpU2xpZGVyLmdldCgpICk7XG5cdFx0XHRcdFx0fSwgZGVsYXkgKSApO1xuXHRcdFx0XHR9ICk7XG5cdFx0XHR9ICk7XG5cdFx0fVxuXG5cdFx0aW5pdE5vVUlTbGlkZXIoKTtcblxuXHRcdGZ1bmN0aW9uIGluaXREYXRlcGlja2VyKCkge1xuXHRcdFx0aWYgKCAhIGpRdWVyeSgpLmRhdGVwaWNrZXIgKSB7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblxuXHRcdFx0Y29uc3QgJHdjYXBmRGF0ZUZpbHRlcnMgPSAkKCAnLndjYXBmLWRhdGUtcmFuZ2UtZmlsdGVyJyApO1xuXHRcdFx0Y29uc3QgJHdjYXBmRGF0ZUZpbHRlciAgPSAkd2NhcGZEYXRlRmlsdGVycy5maW5kKCAnLndjYXBmLWRhdGUtaW5wdXQnICk7XG5cblx0XHRcdGNvbnN0IGZvcm1hdCAgICAgICAgPSAkd2NhcGZEYXRlRmlsdGVyLmF0dHIoICdkYXRhLWRhdGUtZm9ybWF0JyApO1xuXHRcdFx0Y29uc3QgeWVhckRyb3Bkb3duICA9ICR3Y2FwZkRhdGVGaWx0ZXIuYXR0ciggJ2RhdGEtZGF0ZS1waWNrZXIteWVhci1kcm9wZG93bicgKTtcblx0XHRcdGNvbnN0IG1vbnRoRHJvcGRvd24gPSAkd2NhcGZEYXRlRmlsdGVyLmF0dHIoICdkYXRhLWRhdGUtcGlja2VyLW1vbnRoLWRyb3Bkb3duJyApO1xuXG5cdFx0XHRjb25zdCAkZnJvbSA9ICR3Y2FwZkRhdGVGaWx0ZXIuZmluZCggJy5kYXRlLWZyb20taW5wdXQnICk7XG5cdFx0XHRjb25zdCAkdG8gICA9ICR3Y2FwZkRhdGVGaWx0ZXIuZmluZCggJy5kYXRlLXRvLWlucHV0JyApO1xuXG5cdFx0XHQkZnJvbS5kYXRlcGlja2VyKCB7XG5cdFx0XHRcdGRhdGVGb3JtYXQ6IGZvcm1hdCxcblx0XHRcdFx0Y2hhbmdlWWVhcjogeWVhckRyb3Bkb3duLFxuXHRcdFx0XHRjaGFuZ2VNb250aDogbW9udGhEcm9wZG93bixcblx0XHRcdH0gKTtcblxuXHRcdFx0JHRvLmRhdGVwaWNrZXIoIHtcblx0XHRcdFx0ZGF0ZUZvcm1hdDogZm9ybWF0LFxuXHRcdFx0XHRjaGFuZ2VZZWFyOiB5ZWFyRHJvcGRvd24sXG5cdFx0XHRcdGNoYW5nZU1vbnRoOiBtb250aERyb3Bkb3duLFxuXHRcdFx0fSApO1xuXG5cdFx0XHQkZnJvbS5vbiggJ2NoYW5nZScsIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRjb25zdCAkaW5wdXQgPSAkKCB0aGlzICk7XG5cdFx0XHRcdGZpbHRlckJ5RGF0ZSggJGlucHV0ICk7XG5cdFx0XHR9ICk7XG5cblx0XHRcdCR0by5vbiggJ2NoYW5nZScsIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRjb25zdCAkaW5wdXQgPSAkKCB0aGlzICk7XG5cdFx0XHRcdGZpbHRlckJ5RGF0ZSggJGlucHV0ICk7XG5cdFx0XHR9ICk7XG5cdFx0fVxuXG5cdFx0aW5pdERhdGVwaWNrZXIoKTtcblxuXHRcdC8vIHNob3cgYSBsb2FkaW5nIGluZGljYXRvclxuXHRcdGZ1bmN0aW9uIHdjYXBmQmVmb3JlVXBkYXRlKCkge1xuXHRcdFx0JGJvZHkudHJpZ2dlciggJ3djYXBmX2JlZm9yZV91cGRhdGVfZmlsdGVycycgKTtcblx0XHR9XG5cblx0XHQvLyBzY3JvbGwgdG8gdG9wXG5cdFx0ZnVuY3Rpb24gd2NhcGZBZnRlclVwZGF0ZSgpIHtcblx0XHRcdGluaXRDaG9zZW4oKTtcblx0XHRcdGluaXRIaWVyYXJjaHlBY2NvcmRpb24oKTtcblx0XHRcdGluaXROb1VJU2xpZGVyKCk7XG5cdFx0XHRpbml0RGF0ZXBpY2tlcigpO1xuXG5cdFx0XHQkYm9keS50cmlnZ2VyKCAnd2NhcGZfYWZ0ZXJfdXBkYXRlX2ZpbHRlcnMnICk7XG5cdFx0fVxuXG5cdFx0Ly8gZmlsdGVyIHRoZSBwcm9kdWN0c1xuXHRcdGZ1bmN0aW9uIHdjYXBmRmlsdGVyUHJvZHVjdHMoIGZvcmNlUmVSZW5kZXIgPSBmYWxzZSApIHtcblx0XHRcdHdjYXBmQmVmb3JlVXBkYXRlKCk7XG5cblx0XHRcdCQuZ2V0KFxuXHRcdFx0XHR3aW5kb3cubG9jYXRpb24uaHJlZixcblx0XHRcdFx0ZnVuY3Rpb24oIGRhdGEgKSB7XG5cdFx0XHRcdFx0Y29uc3QgJGRhdGEgPSAkKCBkYXRhICk7XG5cblx0XHRcdFx0XHRjb25zdCAkc2hvcExvb3BDb250YWluZXIgPSAkZGF0YS5maW5kKCB3Y2FwZl9wYXJhbXMuc2hvcF9sb29wX2NvbnRhaW5lciApO1xuXHRcdFx0XHRcdGNvbnN0ICRub3RGb3VuZENvbnRhaW5lciA9ICRkYXRhLmZpbmQoIHdjYXBmX3BhcmFtcy5ub3RfZm91bmRfY29udGFpbmVyICk7XG5cblx0XHRcdFx0XHQvLyByZXBsYWNlIGZpZWxkcycgZGF0YSB3aXRoIG5ldyBkYXRhXG5cdFx0XHRcdFx0JC5lYWNoKFxuXHRcdFx0XHRcdFx0ZmllbGRzLFxuXHRcdFx0XHRcdFx0ZnVuY3Rpb24oIGlkICkge1xuXHRcdFx0XHRcdFx0XHRjb25zdCBmaWVsZElEICAgID0gJ1tkYXRhLWlkPVwiJyArIGlkICsgJ1wiXSc7XG5cdFx0XHRcdFx0XHRcdGNvbnN0ICRmaWVsZCAgICAgPSAkKCBmaWVsZElEICk7XG5cdFx0XHRcdFx0XHRcdGNvbnN0ICRpbm5lciAgICAgPSAkZmllbGQuZmluZCggJy53Y2FwZi1maWVsZC1pbm5lcicgKTtcblx0XHRcdFx0XHRcdFx0Y29uc3QgX2ZpZWxkICAgICA9ICRkYXRhLmZpbmQoIGZpZWxkSUQgKTtcblx0XHRcdFx0XHRcdFx0Y29uc3QgZmllbGRDbGFzcyA9ICQoIF9maWVsZCApLmF0dHIoICdjbGFzcycgKTtcblx0XHRcdFx0XHRcdFx0Y29uc3QgX2h0bWwgICAgICA9IF9maWVsZC5maW5kKCAnLndjYXBmLWZpZWxkLWlubmVyJyApLmh0bWwoKTtcblxuXHRcdFx0XHRcdFx0XHQvLyBXaGVuIGNhbGxlZCBmcm9tIGhpc3RvcnkgYmFjayBvciBmb3J3YXJkIHJlcXVlc3QgdGhlbiByZXJlbmRlciBhbGwgZmllbGRzLlxuXHRcdFx0XHRcdFx0XHRpZiAoIGZvcmNlUmVSZW5kZXIgKSB7XG5cblx0XHRcdFx0XHRcdFx0XHQvLyB1cGRhdGUgY2xhc3Ncblx0XHRcdFx0XHRcdFx0XHQkZmllbGQuYXR0ciggJ2NsYXNzJywgZmllbGRDbGFzcyApO1xuXG5cdFx0XHRcdFx0XHRcdFx0Ly8gdXBkYXRlIGZpZWxkXG5cdFx0XHRcdFx0XHRcdFx0JGlubmVyLmh0bWwoIF9odG1sICk7XG5cblx0XHRcdFx0XHRcdFx0fSBlbHNlIHtcblxuXHRcdFx0XHRcdFx0XHRcdC8vIFNlbGVjdGl2ZWx5IHJlcmVuZGVyIHRoZSBmaWVsZHMuXG5cdFx0XHRcdFx0XHRcdFx0aWYgKCAkZmllbGQuaGFzQ2xhc3MoICd3Y2FwZi1uYXYtZmlsdGVyJyApICkge1xuXG5cdFx0XHRcdFx0XHRcdFx0XHQvLyB1cGRhdGUgY2xhc3Ncblx0XHRcdFx0XHRcdFx0XHRcdCRmaWVsZC5hdHRyKCAnY2xhc3MnLCBmaWVsZENsYXNzICk7XG5cblx0XHRcdFx0XHRcdFx0XHRcdC8vIHVwZGF0ZSBmaWVsZFxuXHRcdFx0XHRcdFx0XHRcdFx0JGlubmVyLmh0bWwoIF9odG1sICk7XG5cblx0XHRcdFx0XHRcdFx0XHR9IGVsc2Uge1xuXG5cdFx0XHRcdFx0XHRcdFx0XHQvLyBXZSBuZWVkIHRvIHVwZGF0ZSB0aGUgZmllbGRzJyBjbGFzc2VzIGFsd2F5cy5cblx0XHRcdFx0XHRcdFx0XHRcdCRmaWVsZC5hdHRyKCAnY2xhc3MnLCBmaWVsZENsYXNzICk7XG5cblx0XHRcdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdCk7XG5cblx0XHRcdFx0XHQvLyByZXBsYWNlIG9sZCBzaG9wIGxvb3Agd2l0aCBuZXcgb25lXG5cdFx0XHRcdFx0aWYgKCB3Y2FwZl9wYXJhbXMuc2hvcF9sb29wX2NvbnRhaW5lciA9PT0gd2NhcGZfcGFyYW1zLm5vdF9mb3VuZF9jb250YWluZXIgKSB7XG5cdFx0XHRcdFx0XHQkKCB3Y2FwZl9wYXJhbXMuc2hvcF9sb29wX2NvbnRhaW5lciApLmh0bWwoICRzaG9wTG9vcENvbnRhaW5lci5odG1sKCkgKTtcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0aWYgKCAkKCB3Y2FwZl9wYXJhbXMubm90X2ZvdW5kX2NvbnRhaW5lciApLmxlbmd0aCApIHtcblx0XHRcdFx0XHRcdFx0aWYgKCAkc2hvcExvb3BDb250YWluZXIubGVuZ3RoICkge1xuXHRcdFx0XHRcdFx0XHRcdCQoIHdjYXBmX3BhcmFtcy5ub3RfZm91bmRfY29udGFpbmVyICkuaHRtbCggJHNob3BMb29wQ29udGFpbmVyLmh0bWwoKSApO1xuXHRcdFx0XHRcdFx0XHR9IGVsc2UgaWYgKCAkbm90Rm91bmRDb250YWluZXIubGVuZ3RoICkge1xuXHRcdFx0XHRcdFx0XHRcdCQoIHdjYXBmX3BhcmFtcy5ub3RfZm91bmRfY29udGFpbmVyICkuaHRtbCggJG5vdEZvdW5kQ29udGFpbmVyLmh0bWwoKSApO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9IGVsc2UgaWYgKCAkKCB3Y2FwZl9wYXJhbXMuc2hvcF9sb29wX2NvbnRhaW5lciApLmxlbmd0aCApIHtcblx0XHRcdFx0XHRcdFx0aWYgKCAkc2hvcExvb3BDb250YWluZXIubGVuZ3RoICkge1xuXHRcdFx0XHRcdFx0XHRcdCQoIHdjYXBmX3BhcmFtcy5zaG9wX2xvb3BfY29udGFpbmVyICkuaHRtbCggJHNob3BMb29wQ29udGFpbmVyLmh0bWwoKSApO1xuXHRcdFx0XHRcdFx0XHR9IGVsc2UgaWYgKCAkbm90Rm91bmRDb250YWluZXIubGVuZ3RoICkge1xuXHRcdFx0XHRcdFx0XHRcdCQoIHdjYXBmX3BhcmFtcy5zaG9wX2xvb3BfY29udGFpbmVyICkuaHRtbCggJG5vdEZvdW5kQ29udGFpbmVyLmh0bWwoKSApO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0d2NhcGZBZnRlclVwZGF0ZSgpO1xuXG5cdFx0XHRcdFx0Ly8gdG9kb1xuXHRcdFx0XHRcdC8vIHJlaW5pdGlhbGl6ZSBvcmRlcmluZ1xuXHRcdFx0XHRcdC8vIHdjYXBmSW5pdE9yZGVyKCk7XG5cblx0XHRcdFx0XHQvLyB0b2RvXG5cdFx0XHRcdFx0Ly8gcmVpbml0aWFsaXplIGRyb3Bkb3duIGZpbHRlclxuXHRcdFx0XHRcdC8vIHdjYXBmRHJvcERvd25GaWx0ZXIoKTtcblxuXHRcdFx0XHRcdC8vIHJ1biBzY3JpcHRzIGFmdGVyIHNob3AgbG9vcCB1bmRhdGVkXG5cdFx0XHRcdFx0aWYgKCB0eXBlb2Ygd2NhcGZfcGFyYW1zLmN1c3RvbV9zY3JpcHRzICE9PSAndW5kZWZpbmVkJyAmJiB3Y2FwZl9wYXJhbXMuY3VzdG9tX3NjcmlwdHMubGVuZ3RoID4gMCApIHtcblx0XHRcdFx0XHRcdGV2YWwoIHdjYXBmX3BhcmFtcy5jdXN0b21fc2NyaXB0cyApO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0KTtcblx0XHR9XG5cblx0XHQvLyBVUkwgUGFyc2VyXG5cdFx0ZnVuY3Rpb24gd2NhcGZHZXRVcmxWYXJzKCB1cmwgKSB7XG5cdFx0XHRsZXQgdmFycyA9IHt9LCBoYXNoO1xuXG5cdFx0XHRpZiAoIHR5cGVvZiB1cmwgPT09ICd1bmRlZmluZWQnICkge1xuXHRcdFx0XHR1cmwgPSB3aW5kb3cubG9jYXRpb24uaHJlZjtcblx0XHRcdH1cblxuXHRcdFx0dXJsID0gdXJsLnJlcGxhY2VBbGwoICclMkMnLCAnLCcgKTtcblxuXHRcdFx0Y29uc3QgaGFzaGVzICA9IHVybC5zbGljZSggdXJsLmluZGV4T2YoICc/JyApICsgMSApLnNwbGl0KCAnJicgKTtcblx0XHRcdGNvbnN0IGhMZW5ndGggPSBoYXNoZXMubGVuZ3RoO1xuXG5cdFx0XHRmb3IgKCBsZXQgaSA9IDA7IGkgPCBoTGVuZ3RoOyBpKysgKSB7XG5cdFx0XHRcdGhhc2ggPSBoYXNoZXNbIGkgXS5zcGxpdCggJz0nICk7XG5cblx0XHRcdFx0dmFyc1sgaGFzaFsgMCBdIF0gPSBoYXNoWyAxIF07XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiB2YXJzO1xuXHRcdH1cblxuXHRcdC8vIGV2ZXJ5dGltZSB3ZSBhcHBseSB0aGUgZmlsdGVyIHdlIHNldCB0aGUgY3VycmVudCBwYWdlIHRvIDFcblx0XHRmdW5jdGlvbiB3Y2FwZkZpeFBhZ2luYXRpb24oKSB7XG5cdFx0XHRsZXQgdXJsICAgICAgICAgICAgICAgID0gd2luZG93LmxvY2F0aW9uLmhyZWY7XG5cdFx0XHRjb25zdCBwYXJhbXMgICAgICAgICAgID0gd2NhcGZHZXRVcmxWYXJzKCB1cmwgKTtcblx0XHRcdGNvbnN0IGN1cnJlbnRQYWdlSW5VcmwgPSBwYXJzZUludCggdXJsLnJlcGxhY2UoIC8uK1xcL3BhZ2VcXC8oXFxkKykrLywgJyQxJyApICk7XG5cblx0XHRcdGlmICggY3VycmVudFBhZ2VJblVybCApIHtcblx0XHRcdFx0aWYgKCBjdXJyZW50UGFnZUluVXJsID4gMSApIHtcblx0XHRcdFx0XHR1cmwgPSB1cmwucmVwbGFjZSggL3BhZ2VcXC8oXFxkKykvLCAncGFnZS8xJyApO1xuXHRcdFx0XHR9XG5cdFx0XHR9IGVsc2UgaWYgKCB0eXBlb2YgcGFyYW1zWyAncGFnZWQnIF0gIT09ICd1bmRlZmluZWQnICkge1xuXHRcdFx0XHRjb25zdCBjdXJyZW50UGFnZUluUGFyYW1zID0gcGFyc2VJbnQoIHBhcmFtc1sgJ3BhZ2VkJyBdICk7XG5cblx0XHRcdFx0aWYgKCBjdXJyZW50UGFnZUluUGFyYW1zID4gMSApIHtcblx0XHRcdFx0XHR1cmwgPSB1cmwucmVwbGFjZSggJ3BhZ2VkPScgKyBjdXJyZW50UGFnZUluUGFyYW1zLCAncGFnZWQ9MScgKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gdXJsO1xuXHRcdH1cblxuXHRcdC8vIHVwZGF0ZSBxdWVyeSBzdHJpbmcgZm9yIGNhdGVnb3JpZXMsIG1ldGEgZXRjLi5cblx0XHRmdW5jdGlvbiB3Y2FwZlVwZGF0ZVF1ZXJ5U3RyaW5nUGFyYW1ldGVyKCBrZXksIHZhbHVlLCBwdXNoSGlzdG9yeSwgdXJsICkge1xuXHRcdFx0aWYgKCB0eXBlb2YgcHVzaEhpc3RvcnkgPT09ICd1bmRlZmluZWQnICkge1xuXHRcdFx0XHRwdXNoSGlzdG9yeSA9IHRydWU7XG5cdFx0XHR9XG5cblx0XHRcdGlmICggdHlwZW9mIHVybCA9PT0gJ3VuZGVmaW5lZCcgKSB7XG5cdFx0XHRcdHVybCA9IHdjYXBmRml4UGFnaW5hdGlvbigpO1xuXHRcdFx0fVxuXG5cdFx0XHRjb25zdCByZSAgICAgICAgPSBuZXcgUmVnRXhwKCAnKFs/Jl0pJyArIGtleSArICc9Lio/KCZ8JCknLCAnaScgKTtcblx0XHRcdGNvbnN0IHNlcGFyYXRvciA9IHVybC5pbmRleE9mKCAnPycgKSAhPT0gLTEgPyAnJicgOiAnPyc7XG5cdFx0XHRsZXQgdXJsV2l0aFF1ZXJ5O1xuXG5cdFx0XHRpZiAoIHVybC5tYXRjaCggcmUgKSApIHtcblx0XHRcdFx0dXJsV2l0aFF1ZXJ5ID0gdXJsLnJlcGxhY2UoIHJlLCAnJDEnICsga2V5ICsgJz0nICsgdmFsdWUgKyAnJDInICk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHR1cmxXaXRoUXVlcnkgPSB1cmwgKyBzZXBhcmF0b3IgKyBrZXkgKyAnPScgKyB2YWx1ZTtcblx0XHRcdH1cblxuXHRcdFx0aWYgKCBwdXNoSGlzdG9yeSA9PT0gdHJ1ZSApIHtcblx0XHRcdFx0cmV0dXJuIGhpc3RvcnkucHVzaFN0YXRlKCB7fSwgJycsIHVybFdpdGhRdWVyeSApO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0cmV0dXJuIHVybFdpdGhRdWVyeTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHQvLyByZW1vdmUgcGFyYW1ldGVyIGZyb20gdXJsXG5cdFx0ZnVuY3Rpb24gd2NhcGZSZW1vdmVRdWVyeVN0cmluZ1BhcmFtZXRlciggZmlsdGVyS2V5LCB1cmwgKSB7XG5cdFx0XHRpZiAoIHR5cGVvZiB1cmwgPT09ICd1bmRlZmluZWQnICkge1xuXHRcdFx0XHR1cmwgPSB3Y2FwZkZpeFBhZ2luYXRpb24oKTtcblx0XHRcdH1cblxuXHRcdFx0Y29uc3Qgb2xkUGFyYW1zICAgICAgICAgPSB3Y2FwZkdldFVybFZhcnMoIHVybCApO1xuXHRcdFx0Y29uc3Qgb2xkUGFyYW1zTGVuZ3RoICAgPSBPYmplY3Qua2V5cyggb2xkUGFyYW1zICkubGVuZ3RoO1xuXHRcdFx0Y29uc3Qgc3RhcnRQb3NpdGlvbiAgICAgPSB1cmwuaW5kZXhPZiggJz8nICk7XG5cdFx0XHRjb25zdCBmaWx0ZXJLZXlQb3NpdGlvbiA9IHVybC5pbmRleE9mKCBmaWx0ZXJLZXkgKTtcblx0XHRcdGxldCBjbGVhblVybCwgY2xlYW5RdWVyeTtcblxuXHRcdFx0aWYgKCBvbGRQYXJhbXNMZW5ndGggPiAxICkge1xuXHRcdFx0XHRpZiAoICggZmlsdGVyS2V5UG9zaXRpb24gLSBzdGFydFBvc2l0aW9uICkgPiAxICkge1xuXHRcdFx0XHRcdGNsZWFuVXJsID0gdXJsLnJlcGxhY2UoICcmJyArIGZpbHRlcktleSArICc9JyArIG9sZFBhcmFtc1sgZmlsdGVyS2V5IF0sICcnICk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0Y2xlYW5VcmwgPSB1cmwucmVwbGFjZSggZmlsdGVyS2V5ICsgJz0nICsgb2xkUGFyYW1zWyBmaWx0ZXJLZXkgXSArICcmJywgJycgKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGNvbnN0IG5ld1BhcmFtcyA9IGNsZWFuVXJsLnNwbGl0KCAnPycgKTtcblx0XHRcdFx0Y2xlYW5RdWVyeSAgICAgID0gJz8nICsgbmV3UGFyYW1zWyAxIF07XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRjbGVhblF1ZXJ5ID0gdXJsLnJlcGxhY2UoICc/JyArIGZpbHRlcktleSArICc9JyArIG9sZFBhcmFtc1sgZmlsdGVyS2V5IF0sICcnICk7XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiBjbGVhblF1ZXJ5O1xuXHRcdH1cblxuXHRcdC8vIHRha2UgdGhlIGtleSBhbmQgdmFsdWUgYW5kIG1ha2UgcXVlcnlcblx0XHRmdW5jdGlvbiB3Y2FwZk1ha2VQYXJhbWV0ZXJzKCBmaWx0ZXJLZXksIGZpbHRlclZhbHVlLCBmb3JjZVJlcmVuZGVyID0gZmFsc2UsIHVybCApIHtcblx0XHRcdGNvbnN0IHZhbHVlU2VwYXJhdG9yID0gJywnO1xuXG5cdFx0XHRsZXQgcGFyYW1zLCBuZXh0VmFsdWVzLCBlbXB0eVZhbHVlID0gZmFsc2U7XG5cblx0XHRcdGlmICggdHlwZW9mIHVybCAhPT0gJ3VuZGVmaW5lZCcgKSB7XG5cdFx0XHRcdHBhcmFtcyA9IHdjYXBmR2V0VXJsVmFycyggdXJsICk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRwYXJhbXMgPSB3Y2FwZkdldFVybFZhcnMoKTtcblx0XHRcdH1cblxuXHRcdFx0aWYgKCB0eXBlb2YgcGFyYW1zWyBmaWx0ZXJLZXkgXSAhPSAndW5kZWZpbmVkJyApIHtcblx0XHRcdFx0Y29uc3QgcHJldlZhbHVlcyAgICAgID0gcGFyYW1zWyBmaWx0ZXJLZXkgXTtcblx0XHRcdFx0Y29uc3QgcHJldlZhbHVlc0FycmF5ID0gcHJldlZhbHVlcy5zcGxpdCggdmFsdWVTZXBhcmF0b3IgKTtcblxuXHRcdFx0XHRpZiAoIHByZXZWYWx1ZXMubGVuZ3RoID4gMCApIHtcblx0XHRcdFx0XHRjb25zdCBmb3VuZCA9ICQuaW5BcnJheSggZmlsdGVyVmFsdWUsIHByZXZWYWx1ZXNBcnJheSApO1xuXG5cdFx0XHRcdFx0aWYgKCBmb3VuZCA+PSAwICkge1xuXHRcdFx0XHRcdFx0Ly8gRWxlbWVudCB3YXMgZm91bmQsIHJlbW92ZSBpdC5cblx0XHRcdFx0XHRcdHByZXZWYWx1ZXNBcnJheS5zcGxpY2UoIGZvdW5kLCAxICk7XG5cblx0XHRcdFx0XHRcdGlmICggcHJldlZhbHVlc0FycmF5Lmxlbmd0aCA9PT0gMCApIHtcblx0XHRcdFx0XHRcdFx0ZW1wdHlWYWx1ZSA9IHRydWU7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdC8vIEVsZW1lbnQgd2FzIG5vdCBmb3VuZCwgYWRkIGl0LlxuXHRcdFx0XHRcdFx0cHJldlZhbHVlc0FycmF5LnB1c2goIGZpbHRlclZhbHVlICk7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0aWYgKCBwcmV2VmFsdWVzQXJyYXkubGVuZ3RoID4gMSApIHtcblx0XHRcdFx0XHRcdG5leHRWYWx1ZXMgPSBwcmV2VmFsdWVzQXJyYXkuam9pbiggdmFsdWVTZXBhcmF0b3IgKTtcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0bmV4dFZhbHVlcyA9IHByZXZWYWx1ZXNBcnJheTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0bmV4dFZhbHVlcyA9IGZpbHRlclZhbHVlO1xuXHRcdFx0XHR9XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRuZXh0VmFsdWVzID0gZmlsdGVyVmFsdWU7XG5cdFx0XHR9XG5cblx0XHRcdC8vIHVwZGF0ZSB1cmwgYW5kIHF1ZXJ5IHN0cmluZ1xuXHRcdFx0aWYgKCAhIGVtcHR5VmFsdWUgKSB7XG5cdFx0XHRcdHdjYXBmVXBkYXRlUXVlcnlTdHJpbmdQYXJhbWV0ZXIoIGZpbHRlcktleSwgbmV4dFZhbHVlcyApO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0Y29uc3QgcXVlcnkgPSB3Y2FwZlJlbW92ZVF1ZXJ5U3RyaW5nUGFyYW1ldGVyKCBmaWx0ZXJLZXkgKTtcblx0XHRcdFx0aGlzdG9yeS5wdXNoU3RhdGUoIHt9LCAnJywgcXVlcnkgKTtcblx0XHRcdH1cblxuXHRcdFx0Ly8gZmlsdGVyIHByb2R1Y3RzXG5cdFx0XHR3Y2FwZkZpbHRlclByb2R1Y3RzKCBmb3JjZVJlcmVuZGVyICk7XG5cdFx0fVxuXG5cdFx0ZnVuY3Rpb24gd2NhcGZTaW5nbGVGaWx0ZXIoIGZpbHRlcktleSwgZmlsdGVyVmFsdWUgKSB7XG5cdFx0XHRjb25zdCBwYXJhbXMgPSB3Y2FwZkdldFVybFZhcnMoKTtcblx0XHRcdGxldCBxdWVyeTtcblxuXHRcdFx0aWYgKCB0eXBlb2YgcGFyYW1zWyBmaWx0ZXJLZXkgXSAhPT0gJ3VuZGVmaW5lZCcgJiYgcGFyYW1zWyBmaWx0ZXJLZXkgXSA9PT0gZmlsdGVyVmFsdWUgKSB7XG5cdFx0XHRcdHF1ZXJ5ID0gd2NhcGZSZW1vdmVRdWVyeVN0cmluZ1BhcmFtZXRlciggZmlsdGVyS2V5ICk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRxdWVyeSA9IHdjYXBmVXBkYXRlUXVlcnlTdHJpbmdQYXJhbWV0ZXIoIGZpbHRlcktleSwgZmlsdGVyVmFsdWUsIGZhbHNlICk7XG5cdFx0XHR9XG5cblx0XHRcdC8vIHVwZGF0ZSB1cmxcblx0XHRcdGhpc3RvcnkucHVzaFN0YXRlKCB7fSwgJycsIHF1ZXJ5ICk7XG5cblx0XHRcdC8vIGZpbHRlciBwcm9kdWN0c1xuXHRcdFx0d2NhcGZGaWx0ZXJQcm9kdWN0cygpO1xuXHRcdH1cblxuXHRcdC8vIFRoZSBtYWluIGZ1bmN0aW9uIHRvIGhhbmRsZSB0aGUgZmlsdGVyIHJlcXVlc3Rcblx0XHRmdW5jdGlvbiBoYW5kbGVGaWx0ZXJSZXF1ZXN0KCAkaXRlbSwgZmlsdGVyVmFsdWUgKSB7XG5cdFx0XHRjb25zdCAkZmllbGQgICAgICAgICA9ICRpdGVtLmNsb3Nlc3QoICcud2NhcGYtc2luZ2xlLWZpbHRlcicgKTtcblx0XHRcdGNvbnN0IGZpZWxkSUQgICAgICAgID0gJGZpZWxkLmF0dHIoICdkYXRhLWlkJyApO1xuXHRcdFx0Y29uc3QgZmllbGREYXRhICAgICAgPSBmaWVsZHNbIGZpZWxkSUQgXTtcblx0XHRcdGNvbnN0IGZpbHRlcktleSAgICAgID0gZmllbGREYXRhLmZpbHRlcktleTtcblx0XHRcdGNvbnN0IG11bHRpcGxlRmlsdGVyID0gZmllbGREYXRhLm11bHRpcGxlRmlsdGVyO1xuXG5cdFx0XHRpZiAoICEgZmlsdGVyS2V5ICkge1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdGlmICggISBmaWx0ZXJWYWx1ZS5sZW5ndGggKSB7XG5cdFx0XHRcdGNvbnN0IHF1ZXJ5ID0gd2NhcGZSZW1vdmVRdWVyeVN0cmluZ1BhcmFtZXRlciggZmlsdGVyS2V5ICk7XG5cdFx0XHRcdGhpc3RvcnkucHVzaFN0YXRlKCB7fSwgJycsIHF1ZXJ5ICk7XG5cblx0XHRcdFx0Ly8gZmlsdGVyIHByb2R1Y3RzXG5cdFx0XHRcdHdjYXBmRmlsdGVyUHJvZHVjdHMoKTtcblxuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdGlmICggbXVsdGlwbGVGaWx0ZXIgKSB7XG5cdFx0XHRcdHdjYXBmTWFrZVBhcmFtZXRlcnMoIGZpbHRlcktleSwgZmlsdGVyVmFsdWUgKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHdjYXBmU2luZ2xlRmlsdGVyKCBmaWx0ZXJLZXksIGZpbHRlclZhbHVlICk7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0Ly8gaGFuZGxlIHRoZSBmaWx0ZXIgcmVxdWVzdCBmb3IgbGlzdCBmaWVsZHNcblx0XHQkd2NhcGZOYXZGaWx0ZXJzLm9uKFxuXHRcdFx0J2NoYW5nZScsXG5cdFx0XHQnLndjYXBmLWxheWVyZWQtbmF2IFt0eXBlPVwiY2hlY2tib3hcIl0sIC53Y2FwZi1sYXllcmVkLW5hdiBbdHlwZT1cInJhZGlvXCJdJyxcblx0XHRcdGZ1bmN0aW9uKCBldmVudCApIHtcblx0XHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcblxuXHRcdFx0XHRjb25zdCAkaXRlbSAgICAgICA9ICQoIHRoaXMgKTtcblx0XHRcdFx0Y29uc3QgZmlsdGVyVmFsdWUgPSAkaXRlbS52YWwoKTtcblxuXHRcdFx0XHRoYW5kbGVGaWx0ZXJSZXF1ZXN0KCAkaXRlbSwgZmlsdGVyVmFsdWUgKTtcblx0XHRcdH1cblx0XHQpO1xuXG5cdFx0Ly8gVE9ETzogVXNlIGEgY29tYmluYXRpb24gb2YgbGFiZWwsIGNoZWNrYm94IGFuZCByYWRpb1xuXHRcdC8vIGhhbmRsZSB0aGUgZmlsdGVyIHJlcXVlc3QgZm9yIGxhYmVsZWQgaXRlbVxuXHRcdCR3Y2FwZk5hdkZpbHRlcnMub24oXG5cdFx0XHQnY2xpY2snLFxuXHRcdFx0Jy53Y2FwZi1sYWJlbGVkLW5hdiAuaXRlbScsXG5cdFx0XHRmdW5jdGlvbiggZXZlbnQgKSB7XG5cdFx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cblx0XHRcdFx0Y29uc3QgJGl0ZW0gICAgICAgPSAkKCB0aGlzICk7XG5cdFx0XHRcdGNvbnN0IGZpbHRlclZhbHVlID0gJGl0ZW0uYXR0ciggJ2RhdGEtdmFsdWUnICk7XG5cblx0XHRcdFx0aGFuZGxlRmlsdGVyUmVxdWVzdCggJGl0ZW0sIGZpbHRlclZhbHVlICk7XG5cdFx0XHR9XG5cdFx0KTtcblxuXHRcdC8vIGhhbmRsZSB0aGUgZmlsdGVyIHJlcXVlc3QgZm9yIGRpc3BsYXkgdHlwZSBzZWxlY3QgZmllbGRzXG5cdFx0JHdjYXBmTmF2RmlsdGVycy5vbihcblx0XHRcdCdjaGFuZ2UnLFxuXHRcdFx0J3NlbGVjdCcsXG5cdFx0XHRmdW5jdGlvbiggZXZlbnQgKSB7XG5cdFx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cblx0XHRcdFx0Y29uc3QgJGl0ZW0gICAgICAgPSAkKCB0aGlzICk7XG5cdFx0XHRcdGNvbnN0IGZpbHRlclZhbHVlID0gJGl0ZW0udmFsKCk7XG5cblx0XHRcdFx0Y29uc3QgJGZpZWxkICAgID0gJGl0ZW0uY2xvc2VzdCggJy53Y2FwZi1zaW5nbGUtZmlsdGVyJyApO1xuXHRcdFx0XHRjb25zdCBmaWVsZElEICAgPSAkZmllbGQuYXR0ciggJ2RhdGEtaWQnICk7XG5cdFx0XHRcdGNvbnN0IGZpZWxkRGF0YSA9IGZpZWxkc1sgZmllbGRJRCBdO1xuXHRcdFx0XHRjb25zdCBmaWx0ZXJLZXkgPSBmaWVsZERhdGEuZmlsdGVyS2V5O1xuXG5cdFx0XHRcdGlmICggISBmaWx0ZXJWYWx1ZS5sZW5ndGggKSB7XG5cdFx0XHRcdFx0Y29uc3QgcXVlcnkgPSB3Y2FwZlJlbW92ZVF1ZXJ5U3RyaW5nUGFyYW1ldGVyKCBmaWx0ZXJLZXkgKTtcblx0XHRcdFx0XHRoaXN0b3J5LnB1c2hTdGF0ZSgge30sICcnLCBxdWVyeSApO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdGNvbnN0IGZpbHRlclZhbFN0cmluZyA9IGZpbHRlclZhbHVlLnRvU3RyaW5nKCk7XG5cdFx0XHRcdFx0d2NhcGZVcGRhdGVRdWVyeVN0cmluZ1BhcmFtZXRlciggZmlsdGVyS2V5LCBmaWx0ZXJWYWxTdHJpbmcgKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdC8vIGZpbHRlciBwcm9kdWN0c1xuXHRcdFx0XHR3Y2FwZkZpbHRlclByb2R1Y3RzKCk7XG5cdFx0XHR9XG5cdFx0KTtcblxuXHRcdC8vIGhhbmRsZSB0aGUgZmlsdGVyIHJlcXVlc3QgZm9yIHJhbmdlIG51bWJlclxuXHRcdCR3Y2FwZk51bWJlclJhbmdlRmlsdGVycy5vbihcblx0XHRcdCdpbnB1dCcsXG5cdFx0XHQnLndjYXBmLXJhbmdlLW51bWJlciAubWluLXZhbHVlLCAud2NhcGYtcmFuZ2UtbnVtYmVyIC5tYXgtdmFsdWUnLFxuXHRcdFx0ZnVuY3Rpb24oIGV2ZW50ICkge1xuXHRcdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXG5cdFx0XHRcdGNvbnN0ICRpdGVtID0gJCggdGhpcyApO1xuXG5cdFx0XHRcdC8vIENsZWFyIGFueSBwcmV2aW91c2x5IHNldCB0aW1lciBiZWZvcmUgc2V0dGluZyBhIGZyZXNoIG9uZVxuXHRcdFx0XHRjbGVhclRpbWVvdXQoICRpdGVtLmRhdGEoICd0aW1lcicgKSApO1xuXG5cdFx0XHRcdCRpdGVtLmRhdGEoICd0aW1lcicsIHNldFRpbWVvdXQoIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdCRpdGVtLnJlbW92ZURhdGEoICd0aW1lcicgKTtcblxuXHRcdFx0XHRcdGNvbnN0ICRyYW5nZU51bWJlciAgPSAkaXRlbS5jbG9zZXN0KCAnLndjYXBmLXJhbmdlLW51bWJlcicgKTtcblx0XHRcdFx0XHRjb25zdCBmaWx0ZXJLZXkgICAgID0gJHJhbmdlTnVtYmVyLmF0dHIoICdkYXRhLWZpbHRlci1rZXknICk7XG5cdFx0XHRcdFx0Y29uc3QgcmFuZ2VNaW5WYWx1ZSA9ICRyYW5nZU51bWJlci5hdHRyKCAnZGF0YS1yYW5nZS1taW4tdmFsdWUnICk7XG5cdFx0XHRcdFx0Y29uc3QgcmFuZ2VNYXhWYWx1ZSA9ICRyYW5nZU51bWJlci5hdHRyKCAnZGF0YS1yYW5nZS1tYXgtdmFsdWUnICk7XG5cdFx0XHRcdFx0bGV0IG1pblZhbHVlICAgICAgICA9ICRyYW5nZU51bWJlci5maW5kKCAnLm1pbi12YWx1ZScgKS52YWwoKTtcblx0XHRcdFx0XHRsZXQgbWF4VmFsdWUgICAgICAgID0gJHJhbmdlTnVtYmVyLmZpbmQoICcubWF4LXZhbHVlJyApLnZhbCgpO1xuXG5cdFx0XHRcdFx0Ly8gRm9yY2UgdGhlIG1pblZhbHVlIG5vdCB0byBiZSBlbXB0eS5cblx0XHRcdFx0XHRpZiAoICEgbWluVmFsdWUubGVuZ3RoICkge1xuXHRcdFx0XHRcdFx0bWluVmFsdWUgPSByYW5nZU1pblZhbHVlO1xuXG5cdFx0XHRcdFx0XHQkcmFuZ2VOdW1iZXIuZmluZCggJy5taW4tdmFsdWUnICkudmFsKCBtaW5WYWx1ZSApO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdC8vIEZvcmNlIHRoZSBtYXhWYWx1ZSBub3QgdG8gYmUgZW1wdHkuXG5cdFx0XHRcdFx0aWYgKCAhIG1heFZhbHVlLmxlbmd0aCApIHtcblx0XHRcdFx0XHRcdG1heFZhbHVlID0gcmFuZ2VNYXhWYWx1ZTtcblxuXHRcdFx0XHRcdFx0JHJhbmdlTnVtYmVyLmZpbmQoICcubWF4LXZhbHVlJyApLnZhbCggbWF4VmFsdWUgKTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHQvLyBGb3JjZSB0aGUgbWluVmFsdWUgbm90IHRvIGdvIGJlbG93IHRoZSByYW5nZU1pblZhbHVlLlxuXHRcdFx0XHRcdGlmICggcGFyc2VGbG9hdCggbWluVmFsdWUgKSA8IHBhcnNlRmxvYXQoIHJhbmdlTWluVmFsdWUgKSApIHtcblx0XHRcdFx0XHRcdG1pblZhbHVlID0gcmFuZ2VNaW5WYWx1ZTtcblxuXHRcdFx0XHRcdFx0JHJhbmdlTnVtYmVyLmZpbmQoICcubWluLXZhbHVlJyApLnZhbCggbWluVmFsdWUgKTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHQvLyBGb3JjZSB0aGUgbWluVmFsdWUgbm90IHRvIGdvIHVwIHRoZSByYW5nZU1heFZhbHVlLlxuXHRcdFx0XHRcdGlmICggcGFyc2VGbG9hdCggbWluVmFsdWUgKSA+IHBhcnNlRmxvYXQoIHJhbmdlTWF4VmFsdWUgKSApIHtcblx0XHRcdFx0XHRcdG1pblZhbHVlID0gcmFuZ2VNYXhWYWx1ZTtcblxuXHRcdFx0XHRcdFx0JHJhbmdlTnVtYmVyLmZpbmQoICcubWluLXZhbHVlJyApLnZhbCggbWluVmFsdWUgKTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHQvLyBGb3JjZSB0aGUgbWF4VmFsdWUgbm90IHRvIGdvIHVwIHRoZSByYW5nZU1heFZhbHVlLlxuXHRcdFx0XHRcdGlmICggcGFyc2VGbG9hdCggbWF4VmFsdWUgKSA+IHBhcnNlRmxvYXQoIHJhbmdlTWF4VmFsdWUgKSApIHtcblx0XHRcdFx0XHRcdG1heFZhbHVlID0gcmFuZ2VNYXhWYWx1ZTtcblxuXHRcdFx0XHRcdFx0JHJhbmdlTnVtYmVyLmZpbmQoICcubWF4LXZhbHVlJyApLnZhbCggbWF4VmFsdWUgKTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHQvLyBGb3JjZSB0aGUgbWF4VmFsdWUgbm90IHRvIGdvIGJlbG93IHRoZSBtaW5WYWx1ZS5cblx0XHRcdFx0XHRpZiAoIHBhcnNlRmxvYXQoIG1pblZhbHVlICkgPiBwYXJzZUZsb2F0KCBtYXhWYWx1ZSApICkge1xuXHRcdFx0XHRcdFx0bWF4VmFsdWUgPSBtaW5WYWx1ZTtcblxuXHRcdFx0XHRcdFx0JHJhbmdlTnVtYmVyLmZpbmQoICcubWF4LXZhbHVlJyApLnZhbCggbWF4VmFsdWUgKTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRpZiAoIG1pblZhbHVlID09PSByYW5nZU1pblZhbHVlICYmIG1heFZhbHVlID09PSByYW5nZU1heFZhbHVlICkge1xuXHRcdFx0XHRcdFx0Y29uc3QgcXVlcnkgPSB3Y2FwZlJlbW92ZVF1ZXJ5U3RyaW5nUGFyYW1ldGVyKCBmaWx0ZXJLZXkgKTtcblx0XHRcdFx0XHRcdGhpc3RvcnkucHVzaFN0YXRlKCB7fSwgJycsIHF1ZXJ5ICk7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdGNvbnN0IGZpbHRlclZhbFN0cmluZyA9IG1pblZhbHVlICsgcmFuZ2VWYWx1ZXNTZXBhcmF0b3IgKyBtYXhWYWx1ZTtcblx0XHRcdFx0XHRcdHdjYXBmVXBkYXRlUXVlcnlTdHJpbmdQYXJhbWV0ZXIoIGZpbHRlcktleSwgZmlsdGVyVmFsU3RyaW5nICk7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0Ly8gZmlsdGVyIHByb2R1Y3RzXG5cdFx0XHRcdFx0d2NhcGZGaWx0ZXJQcm9kdWN0cygpO1xuXHRcdFx0XHR9LCBkZWxheSApICk7XG5cdFx0XHR9XG5cdFx0KTtcblxuXHRcdC8vIGhhbmRsZSByZW1vdmluZyB0aGUgYWN0aXZlIGZpbHRlcnNcblx0XHQkd2NhcGZOYXZGaWx0ZXJzLm9uKFxuXHRcdFx0J2NsaWNrJyxcblx0XHRcdCcud2NhcGYtYWN0aXZlLWZpbHRlcnMgLml0ZW0nLFxuXHRcdFx0ZnVuY3Rpb24oIGV2ZW50ICkge1xuXHRcdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXG5cdFx0XHRcdGNvbnN0ICRpdGVtICAgICAgID0gJCggdGhpcyApO1xuXHRcdFx0XHRjb25zdCBmaWx0ZXJLZXkgICA9ICRpdGVtLmF0dHIoICdkYXRhLWZpbHRlci1rZXknICk7XG5cdFx0XHRcdGNvbnN0IGZpbHRlclZhbHVlID0gJGl0ZW0uYXR0ciggJ2RhdGEtdmFsdWUnICk7XG5cblx0XHRcdFx0d2NhcGZNYWtlUGFyYW1ldGVycyggZmlsdGVyS2V5LCBmaWx0ZXJWYWx1ZSwgdHJ1ZSApO1xuXHRcdFx0fVxuXHRcdCk7XG5cblx0XHRmdW5jdGlvbiByZXNldEZpbHRlcnMoICRidXR0b24gKSB7XG5cdFx0XHRjb25zdCBfZmlsdGVyS2V5cyA9ICRidXR0b24uYXR0ciggJ2RhdGEta2V5cycgKTtcblxuXHRcdFx0aWYgKCAhIF9maWx0ZXJLZXlzICkge1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdGNvbnN0IGZpbHRlcktleXMgPSBfZmlsdGVyS2V5cy5zcGxpdCggJywnICk7XG5cblx0XHRcdGxldCBxdWVyeSA9ICcnO1xuXG5cdFx0XHQkLmVhY2goIGZpbHRlcktleXMsIGZ1bmN0aW9uKCBpLCBmaWx0ZXJLZXkgKSB7XG5cdFx0XHRcdGlmICggcXVlcnkgKSB7XG5cdFx0XHRcdFx0cXVlcnkgPSB3Y2FwZlJlbW92ZVF1ZXJ5U3RyaW5nUGFyYW1ldGVyKCBmaWx0ZXJLZXksIHF1ZXJ5ICk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0cXVlcnkgPSB3Y2FwZlJlbW92ZVF1ZXJ5U3RyaW5nUGFyYW1ldGVyKCBmaWx0ZXJLZXkgKTtcblx0XHRcdFx0fVxuXHRcdFx0fSApO1xuXG5cdFx0XHQvLyBFbXB0eSBxdWVyeSBjYXVzZXMgaXNzdWUoZG9lc24ndCByZW1vdmUgdGhlIGZpbHRlciBrZXlzIGZyb20gdGhlIHVybCksXG5cdFx0XHQvLyB0aGlzIGlzIHdoeSB3ZSBhcmUgc2V0dGluZyB0aGUgcGFnZSB1cmwgYXMgcXVlcnkuXG5cdFx0XHRpZiAoICEgcXVlcnkgKSB7XG5cdFx0XHRcdGNvbnN0IHByZXZVcmwgPSB3aW5kb3cubG9jYXRpb24uaHJlZjtcblx0XHRcdFx0Y29uc3QgbmV3VXJsICA9IHByZXZVcmwuc3BsaXQoICc/JyApO1xuXG5cdFx0XHRcdHF1ZXJ5ID0gbmV3VXJsWyAwIF07XG5cdFx0XHR9XG5cblx0XHRcdGhpc3RvcnkucHVzaFN0YXRlKCB7fSwgJycsIHF1ZXJ5ICk7XG5cblx0XHRcdC8vIGZpbHRlciBwcm9kdWN0c1xuXHRcdFx0d2NhcGZGaWx0ZXJQcm9kdWN0cyggdHJ1ZSApO1xuXHRcdH1cblxuXHRcdC8vIGNsZWFyL3Jlc2V0IGFsbCBmaWx0ZXJzXG5cdFx0JGJvZHkub24oICd3Y2FwZi1yZXNldC1maWx0ZXJzJywgZnVuY3Rpb24oIGUsICRidXR0b24gKSB7XG5cdFx0XHRyZXNldEZpbHRlcnMoICRidXR0b24gKTtcblx0XHR9ICk7XG5cblx0XHQkd2NhcGZOYXZGaWx0ZXJzLm9uKCAnY2xpY2snLCAnLndjYXBmLXJlc2V0LWZpbHRlcnMtYnRuJywgZnVuY3Rpb24oIGV2ZW50ICkge1xuXHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcblxuXHRcdFx0Y29uc3QgJGJ1dHRvbiA9ICQoIHRoaXMgKTtcblxuXHRcdFx0JGJvZHkudHJpZ2dlciggJ3djYXBmLXJlc2V0LWZpbHRlcnMnLCBbICRidXR0b24gXSApO1xuXHRcdH0gKTtcblxuXHRcdGZ1bmN0aW9uIGZpbHRlckJ5RGF0ZSggJGlucHV0ICkge1xuXHRcdFx0Y29uc3QgJHdjYXBmRGF0ZUZpbHRlciA9ICRpbnB1dC5jbG9zZXN0KCAnLndjYXBmLWRhdGUtaW5wdXQnICk7XG5cdFx0XHRjb25zdCBmaWx0ZXJLZXkgICAgICAgID0gJHdjYXBmRGF0ZUZpbHRlci5hdHRyKCAnZGF0YS1maWx0ZXIta2V5JyApO1xuXHRcdFx0Y29uc3QgaXNSYW5nZSAgICAgICAgICA9ICR3Y2FwZkRhdGVGaWx0ZXIuYXR0ciggJ2RhdGEtaXMtcmFuZ2UnICk7XG5cblx0XHRcdGxldCBmaWx0ZXJWYWx1ZSA9ICcnO1xuXHRcdFx0bGV0IHJ1bkZpbHRlciAgID0gZmFsc2U7XG5cblx0XHRcdC8vIENsZWFyIGFueSBwcmV2aW91c2x5IHNldCB0aW1lciBiZWZvcmUgc2V0dGluZyBhIGZyZXNoIG9uZVxuXHRcdFx0Y2xlYXJUaW1lb3V0KCAkd2NhcGZEYXRlRmlsdGVyLmRhdGEoICd0aW1lcicgKSApO1xuXG5cdFx0XHRpZiAoIGlzUmFuZ2UgKSB7XG5cdFx0XHRcdGNvbnN0IGZyb20gPSAkd2NhcGZEYXRlRmlsdGVyLmZpbmQoICcuZGF0ZS1mcm9tLWlucHV0JyApLnZhbCgpO1xuXHRcdFx0XHRjb25zdCB0byAgID0gJHdjYXBmRGF0ZUZpbHRlci5maW5kKCAnLmRhdGUtdG8taW5wdXQnICkudmFsKCk7XG5cblx0XHRcdFx0aWYgKCBmcm9tICYmIHRvICkge1xuXHRcdFx0XHRcdGZpbHRlclZhbHVlID0gZnJvbSArIHJhbmdlVmFsdWVzU2VwYXJhdG9yICsgdG87XG5cdFx0XHRcdFx0cnVuRmlsdGVyICAgPSB0cnVlO1xuXHRcdFx0XHR9IGVsc2UgaWYgKCAhIGZyb20gJiYgISB0byApIHtcblx0XHRcdFx0XHRydW5GaWx0ZXIgPSB0cnVlO1xuXHRcdFx0XHR9XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRjb25zdCBmcm9tID0gJHdjYXBmRGF0ZUZpbHRlci5maW5kKCAnLmRhdGUtZnJvbS1pbnB1dCcgKS52YWwoKTtcblxuXHRcdFx0XHRpZiAoIGZyb20gKSB7XG5cdFx0XHRcdFx0ZmlsdGVyVmFsdWUgPSBmcm9tO1xuXHRcdFx0XHRcdHJ1bkZpbHRlciAgID0gdHJ1ZTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRydW5GaWx0ZXIgPSB0cnVlO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHRcdGlmICggcnVuRmlsdGVyICkge1xuXHRcdFx0XHQkd2NhcGZEYXRlRmlsdGVyLmRhdGEoICd0aW1lcicsIHNldFRpbWVvdXQoIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdCR3Y2FwZkRhdGVGaWx0ZXIucmVtb3ZlRGF0YSggJ3RpbWVyJyApO1xuXG5cdFx0XHRcdFx0aWYgKCBmaWx0ZXJWYWx1ZSApIHtcblx0XHRcdFx0XHRcdHdjYXBmVXBkYXRlUXVlcnlTdHJpbmdQYXJhbWV0ZXIoIGZpbHRlcktleSwgZmlsdGVyVmFsdWUgKTtcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0Y29uc3QgcXVlcnkgPSB3Y2FwZlJlbW92ZVF1ZXJ5U3RyaW5nUGFyYW1ldGVyKCBmaWx0ZXJLZXkgKTtcblx0XHRcdFx0XHRcdGhpc3RvcnkucHVzaFN0YXRlKCB7fSwgJycsIHF1ZXJ5ICk7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0Ly8gZmlsdGVyIHByb2R1Y3RzXG5cdFx0XHRcdFx0d2NhcGZGaWx0ZXJQcm9kdWN0cygpO1xuXHRcdFx0XHR9LCBkZWxheSApICk7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0JHdjYXBmU2luZ2xlRmlsdGVycy5vbiggJ3djYXBmLWNsZWFyLWZpbHRlcicsIGZ1bmN0aW9uKCkge1xuXHRcdFx0Y29uc3QgJGZpZWxkICAgID0gJCggdGhpcyApO1xuXHRcdFx0Y29uc3QgZmllbGRJRCAgID0gJGZpZWxkLmF0dHIoICdkYXRhLWlkJyApO1xuXHRcdFx0Y29uc3QgZmllbGREYXRhID0gZmllbGRzWyBmaWVsZElEIF07XG5cdFx0XHRjb25zdCBmaWx0ZXJLZXkgPSBmaWVsZERhdGEuZmlsdGVyS2V5O1xuXG5cdFx0XHRjb25zdCBxdWVyeSA9IHdjYXBmUmVtb3ZlUXVlcnlTdHJpbmdQYXJhbWV0ZXIoIGZpbHRlcktleSApO1xuXHRcdFx0aGlzdG9yeS5wdXNoU3RhdGUoIHt9LCAnJywgcXVlcnkgKTtcblxuXHRcdFx0Ly8gZmlsdGVyIHByb2R1Y3RzXG5cdFx0XHR3Y2FwZkZpbHRlclByb2R1Y3RzKCB0cnVlICk7XG5cdFx0fSApO1xuXG5cdFx0Ly8gaGlzdG9yeSBiYWNrIGFuZCBmb3J3YXJkIHJlcXVlc3QgaGFuZGxpbmdcblx0XHQkKCB3aW5kb3cgKS5iaW5kKCAncG9wc3RhdGUnLCBmdW5jdGlvbigpIHtcblx0XHRcdC8vIGZpbHRlciBwcm9kdWN0c1xuXHRcdFx0d2NhcGZGaWx0ZXJQcm9kdWN0cyggdHJ1ZSApO1xuXHRcdH0gKTtcblxuXHR9XG4pO1xuIl19
