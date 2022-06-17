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
  'preserve_hierarchy_accordion_state': '',
  'enable_animation_for_hierarchy_accordion': '',
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
  var rangeValuesSeparator = '~';

  var _delay = parseInt(wcapf_params.filter_input_delay);

  var delay = _delay >= 0 ? _delay : 800; // Store fields' id and filter information.

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
  }); // Initialize jQuery chosen library.

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

  initChosen(); // Initialize hierarchy accordion.

  function initHierarchyAccordion() {
    $wcapfNavFilters.find('.hierarchy-accordion-toggle').on('click', function () {
      var $this = $(this);
      var $child = $this.parent('li').children('ul');
      $this.toggleClass('active');

      if (wcapf_params.enable_animation_for_hierarchy_accordion) {
        $child.slideToggle();
      } else {
        $child.toggle();
      }
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
  } // Initialize noUISlider.


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
        }

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
        }

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

  initDatepicker(); // Things are done before applying the filter like showing a loading indicator.

  function wcapfBeforeUpdate() {
    $body.trigger('wcapf_before_update_filters');
  } // Things are done after applying the filter like scroll to top.


  function wcapfAfterUpdate() {
    initChosen();
    initHierarchyAccordion();
    initNoUISlider();
    initDatepicker(); // todo
    // reinitialize ordering
    // wcapfInitOrder();

    $body.trigger('wcapf_after_update_filters');
  } // The main filter function.


  function wcapfFilterProducts() {
    var forceReRender = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
    wcapfBeforeUpdate();
    $.get(window.location.href, function (data) {
      var $data = $(data); // Replace the fields' data with new data.

      $.each(fields, function (id) {
        var fieldID = '[data-id="' + id + '"]';
        var $field = $(fieldID);
        var $inner = $field.find('.wcapf-field-inner');

        var _field = $data.find(fieldID);

        var fieldClass = $(_field).attr('class'); // Preserve hierarchy accordion state.

        if (wcapf_params.preserve_hierarchy_accordion_state) {
          if ($field.hasClass('hierarchy-accordion')) {
            $field.find('.hierarchy-accordion-toggle.active').each(function () {
              var itemValue = $(this).parent().children('input').val();
              var toggleSelector = 'input[value="' + itemValue + '"] ~ .hierarchy-accordion-toggle';
              var ulSelector = 'input[value="' + itemValue + '"] ~ ul';
              var _classes = 'hierarchy-accordion-toggle active';

              _field.find(toggleSelector).attr('class', _classes);

              _field.find(ulSelector).show();
            });
          }
        }

        var _html = _field.find('.wcapf-field-inner').html(); // Update the field's class.


        $field.attr('class', fieldClass); // When called from history back or forward request then rerender all fields.

        if (forceReRender) {
          // update field
          $inner.html(_html);
        } else {
          // Selectively rerender the fields.
          if ($field.hasClass('wcapf-nav-filter')) {
            // update field
            $inner.html(_html);
          }
        }
      }); // Replace old shop loop with new one.

      var $shopLoopContainer = $data.find(wcapf_params.shop_loop_container);
      var $notFoundContainer = $data.find(wcapf_params.not_found_container);

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

      wcapfAfterUpdate(); // run scripts after shop loop undated

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
    }

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


    history.pushState({}, '', query);
    wcapfFilterProducts();
  } // The function to handle the common filter requests.


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
      history.pushState({}, '', query);
      wcapfFilterProducts();
      return;
    }

    if (multipleFilter) {
      wcapfMakeParameters(filterKey, filterValue);
    } else {
      wcapfSingleFilter(filterKey, filterValue);
    }
  } // Handle the filter request for list field.


  $wcapfNavFilters.on('change', '.wcapf-layered-nav [type="checkbox"], .wcapf-layered-nav [type="radio"]', function (event) {
    event.preventDefault();
    var $item = $(this);
    var filterValue = $item.val();
    handleFilterRequest($item, filterValue);
  }); // Handle the filter request for labeled item.

  $wcapfNavFilters.on('click', '.wcapf-labeled-nav .item', function (event) {
    event.preventDefault();
    var $item = $(this);
    var filterValue = $item.attr('data-value');
    handleFilterRequest($item, filterValue);
  }); // Handle the filter request for display type select fields.

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
    }

    wcapfFilterProducts();
  });
  /**
   * Handle the filter request for range number.
   */

  var rangeNumberSelectors = '.wcapf-range-number .min-value, .wcapf-range-number .max-value';
  $wcapfNumberRangeFilters.on('input', rangeNumberSelectors, function (event) {
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
      }

      wcapfFilterProducts();
    }, delay));
  }); // Handle removing the active filters.

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

    history.pushState({}, '', query);
    wcapfFilterProducts(true);
  } // Clear/Reset all filters.


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
    history.pushState({}, '', query);
    wcapfFilterProducts(true);
  });
  $body.on('wcapf-run-filter-products', function (e, forceReRender) {
    wcapfFilterProducts(forceReRender);
  }); // History back and forward request handling.

  $(window).bind('popstate', function () {
    wcapfFilterProducts(true);
  });
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImZpbHRlci1mb3JtLmpzIl0sIm5hbWVzIjpbIndjYXBmX3BhcmFtcyIsImpRdWVyeSIsImRvY3VtZW50IiwicmVhZHkiLCIkIiwiJGJvZHkiLCJyYW5nZVZhbHVlc1NlcGFyYXRvciIsIl9kZWxheSIsInBhcnNlSW50IiwiZmlsdGVyX2lucHV0X2RlbGF5IiwiZGVsYXkiLCJmaWVsZHMiLCIkd2NhcGZTaW5nbGVGaWx0ZXJzIiwiJHdjYXBmTmF2RmlsdGVycyIsIiR3Y2FwZk51bWJlclJhbmdlRmlsdGVycyIsImVhY2giLCIkZmllbGQiLCJpZCIsImF0dHIiLCIkd3JhcHBlciIsImZpbmQiLCJmaWx0ZXJLZXkiLCJtdWx0aXBsZUZpbHRlciIsImluaXRDaG9zZW4iLCJjaG9zZW4iLCIkdGhpcyIsIm9wdGlvbnMiLCJub1Jlc3VsdHNNZXNzYWdlIiwic2VhcmNoVGhyZXNob2xkIiwiY2hvc2VuX2xpYl9zZWFyY2hfdGhyZXNob2xkIiwiaW5pdEhpZXJhcmNoeUFjY29yZGlvbiIsIm9uIiwiJGNoaWxkIiwicGFyZW50IiwiY2hpbGRyZW4iLCJ0b2dnbGVDbGFzcyIsImVuYWJsZV9hbmltYXRpb25fZm9yX2hpZXJhcmNoeV9hY2NvcmRpb24iLCJzbGlkZVRvZ2dsZSIsInRvZ2dsZSIsIm51bWJlcl9mb3JtYXQiLCJudW1iZXIiLCJkZWNpbWFscyIsImRlY19wb2ludCIsInRob3VzYW5kc19zZXAiLCJyZXBsYWNlIiwibiIsImlzRmluaXRlIiwicHJlYyIsIk1hdGgiLCJhYnMiLCJzZXAiLCJkZWMiLCJzIiwidG9GaXhlZEZpeCIsImsiLCJwb3ciLCJyb3VuZCIsInNwbGl0IiwibGVuZ3RoIiwiQXJyYXkiLCJqb2luIiwiaW5pdE5vVUlTbGlkZXIiLCJub1VpU2xpZGVyIiwiJGl0ZW0iLCIkc2xpZGVyIiwiaGFzQ2xhc3MiLCJzbGlkZXJJZCIsImRpc3BsYXlWYWx1ZXNBcyIsInJhbmdlTWluVmFsdWUiLCJwYXJzZUZsb2F0IiwicmFuZ2VNYXhWYWx1ZSIsInN0ZXAiLCJkZWNpbWFsUGxhY2VzIiwidGhvdXNhbmRTZXBhcmF0b3IiLCJkZWNpbWFsU2VwYXJhdG9yIiwibWluVmFsdWUiLCJtYXhWYWx1ZSIsIiRtaW5WYWx1ZSIsIiRtYXhWYWx1ZSIsInNsaWRlciIsImdldEVsZW1lbnRCeUlkIiwiY3JlYXRlIiwic3RhcnQiLCJjb25uZWN0IiwiY3NzUHJlZml4IiwicmFuZ2UiLCJ2YWx1ZXMiLCJodG1sIiwidmFsIiwidHJpZ2dlciIsImZpbHRlclByb2R1Y3RzQWNjb3JkaW5nVG9TbGlkZXIiLCJxdWVyeSIsIndjYXBmUmVtb3ZlUXVlcnlTdHJpbmdQYXJhbWV0ZXIiLCJoaXN0b3J5IiwicHVzaFN0YXRlIiwiZmlsdGVyVmFsU3RyaW5nIiwid2NhcGZVcGRhdGVRdWVyeVN0cmluZ1BhcmFtZXRlciIsIndjYXBmRmlsdGVyUHJvZHVjdHMiLCJjbGVhclRpbWVvdXQiLCJkYXRhIiwic2V0VGltZW91dCIsInJlbW92ZURhdGEiLCJldmVudCIsInByZXZlbnREZWZhdWx0IiwiJGlucHV0Iiwic2V0IiwiZ2V0IiwiZmlsdGVyQnlEYXRlIiwiJHdjYXBmRGF0ZUZpbHRlciIsImNsb3Nlc3QiLCJpc1JhbmdlIiwiZmlsdGVyVmFsdWUiLCJydW5GaWx0ZXIiLCJmcm9tIiwidG8iLCJpbml0RGF0ZXBpY2tlciIsImRhdGVwaWNrZXIiLCIkd2NhcGZEYXRlRmlsdGVycyIsImZvcm1hdCIsInllYXJEcm9wZG93biIsIm1vbnRoRHJvcGRvd24iLCIkZnJvbSIsIiR0byIsImRhdGVGb3JtYXQiLCJjaGFuZ2VZZWFyIiwiY2hhbmdlTW9udGgiLCJ3Y2FwZkJlZm9yZVVwZGF0ZSIsIndjYXBmQWZ0ZXJVcGRhdGUiLCJmb3JjZVJlUmVuZGVyIiwid2luZG93IiwibG9jYXRpb24iLCJocmVmIiwiJGRhdGEiLCJmaWVsZElEIiwiJGlubmVyIiwiX2ZpZWxkIiwiZmllbGRDbGFzcyIsInByZXNlcnZlX2hpZXJhcmNoeV9hY2NvcmRpb25fc3RhdGUiLCJpdGVtVmFsdWUiLCJ0b2dnbGVTZWxlY3RvciIsInVsU2VsZWN0b3IiLCJfY2xhc3NlcyIsInNob3ciLCJfaHRtbCIsIiRzaG9wTG9vcENvbnRhaW5lciIsInNob3BfbG9vcF9jb250YWluZXIiLCIkbm90Rm91bmRDb250YWluZXIiLCJub3RfZm91bmRfY29udGFpbmVyIiwiY3VzdG9tX3NjcmlwdHMiLCJldmFsIiwid2NhcGZHZXRVcmxWYXJzIiwidXJsIiwidmFycyIsImhhc2giLCJyZXBsYWNlQWxsIiwiaGFzaGVzIiwic2xpY2UiLCJpbmRleE9mIiwiaExlbmd0aCIsImkiLCJ3Y2FwZkZpeFBhZ2luYXRpb24iLCJwYXJhbXMiLCJjdXJyZW50UGFnZUluVXJsIiwiY3VycmVudFBhZ2VJblBhcmFtcyIsImtleSIsInZhbHVlIiwicHVzaEhpc3RvcnkiLCJyZSIsIlJlZ0V4cCIsInNlcGFyYXRvciIsInVybFdpdGhRdWVyeSIsIm1hdGNoIiwib2xkUGFyYW1zIiwib2xkUGFyYW1zTGVuZ3RoIiwiT2JqZWN0Iiwia2V5cyIsInN0YXJ0UG9zaXRpb24iLCJmaWx0ZXJLZXlQb3NpdGlvbiIsImNsZWFuVXJsIiwiY2xlYW5RdWVyeSIsIm5ld1BhcmFtcyIsIndjYXBmTWFrZVBhcmFtZXRlcnMiLCJmb3JjZVJlcmVuZGVyIiwidmFsdWVTZXBhcmF0b3IiLCJuZXh0VmFsdWVzIiwiZW1wdHlWYWx1ZSIsInByZXZWYWx1ZXMiLCJwcmV2VmFsdWVzQXJyYXkiLCJmb3VuZCIsImluQXJyYXkiLCJzcGxpY2UiLCJwdXNoIiwid2NhcGZTaW5nbGVGaWx0ZXIiLCJoYW5kbGVGaWx0ZXJSZXF1ZXN0IiwiZmllbGREYXRhIiwidG9TdHJpbmciLCJyYW5nZU51bWJlclNlbGVjdG9ycyIsIiRyYW5nZU51bWJlciIsInJlc2V0RmlsdGVycyIsIiRidXR0b24iLCJfZmlsdGVyS2V5cyIsImZpbHRlcktleXMiLCJwcmV2VXJsIiwibmV3VXJsIiwiZSIsImJpbmQiXSwibWFwcGluZ3MiOiI7O0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFD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dUMsVUFBVTZLLENBQVYsRUFBYTVFLGFBQWIsRUFBNkI7QUFDbkUvQixJQUFBQSxtQkFBbUIsQ0FBRStCLGFBQUYsQ0FBbkI7QUFDQSxHQUZELEVBM3pCdUMsQ0ErekJ2Qzs7QUFDQTVILEVBQUFBLENBQUMsQ0FBRTZILE1BQUYsQ0FBRCxDQUFZNEUsSUFBWixDQUFrQixVQUFsQixFQUE4QixZQUFXO0FBQ3hDNUcsSUFBQUEsbUJBQW1CLENBQUUsSUFBRixDQUFuQjtBQUNBLEdBRkQ7QUFJQSxDQXAwQkQiLCJmaWxlIjoid2MtYWpheC1wcm9kdWN0LWZpbHRlci1wdWJsaWMtc2NyaXB0cy5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogVGhlIGZyb250ZW5kIGZpbHRlciBmb3JtLlxuICpcbiAqIEBzaW5jZSAgICAgIDMuMC4wXG4gKiBAcGFja2FnZSAgICB3Yy1hamF4LXByb2R1Y3QtZmlsdGVyXG4gKiBAc3VicGFja2FnZSB3Yy1hamF4LXByb2R1Y3QtZmlsdGVyL3B1YmxpYy9zcmMvanNcbiAqIEBhdXRob3IgICAgIE1haW51bCBIYXNzYW4gTWFpblxuICovXG5cbmNvbnN0IHdjYXBmX3BhcmFtcyA9IHdjYXBmX3BhcmFtcyB8fCB7XG5cdCdmaWx0ZXJfaW5wdXRfZGVsYXknOiAnJyxcblx0J2Nob3Nlbl9saWJfc2VhcmNoX3RocmVzaG9sZCc6ICcnLFxuXHQncHJlc2VydmVfaGllcmFyY2h5X2FjY29yZGlvbl9zdGF0ZSc6ICcnLFxuXHQnZW5hYmxlX2FuaW1hdGlvbl9mb3JfaGllcmFyY2h5X2FjY29yZGlvbic6ICcnLFxuXHQnc2hvcF9sb29wX2NvbnRhaW5lcic6ICcnLFxuXHQnbm90X2ZvdW5kX2NvbnRhaW5lcic6ICcnLFxuXHQncGFnaW5hdGlvbl9jb250YWluZXInOiAnJywgLy8gdG9kb1xuXHQnc29ydGluZ19jb250cm9sJzogJycsIC8vIHRvZG9cblx0J3Njcm9sbF90b190b3AnOiAnJywgLy8gdG9kb1xuXHQnc2Nyb2xsX3RvX3RvcF9vZmZzZXQnOiAnJywgLy8gdG9kb1xuXHQnY3VzdG9tX3NjcmlwdHMnOiAnJyxcbn07XG5cbmpRdWVyeSggZG9jdW1lbnQgKS5yZWFkeSggZnVuY3Rpb24oICQgKSB7XG5cblx0Y29uc3QgJGJvZHkgPSAkKCAnYm9keScgKTtcblxuXHRjb25zdCByYW5nZVZhbHVlc1NlcGFyYXRvciA9ICd+JztcblxuXHRjb25zdCBfZGVsYXkgPSBwYXJzZUludCggd2NhcGZfcGFyYW1zLmZpbHRlcl9pbnB1dF9kZWxheSApO1xuXHRjb25zdCBkZWxheSAgPSBfZGVsYXkgPj0gMCA/IF9kZWxheSA6IDgwMDtcblxuXHQvLyBTdG9yZSBmaWVsZHMnIGlkIGFuZCBmaWx0ZXIgaW5mb3JtYXRpb24uXG5cdGNvbnN0IGZpZWxkcyA9IHt9O1xuXG5cdGNvbnN0ICR3Y2FwZlNpbmdsZUZpbHRlcnMgICAgICA9ICQoICcud2NhcGYtc2luZ2xlLWZpbHRlcicgKTtcblx0Y29uc3QgJHdjYXBmTmF2RmlsdGVycyAgICAgICAgID0gJCggJy53Y2FwZi1uYXYtZmlsdGVyJyApO1xuXHRjb25zdCAkd2NhcGZOdW1iZXJSYW5nZUZpbHRlcnMgPSAkKCAnLndjYXBmLW51bWJlci1yYW5nZS1maWx0ZXInICk7XG5cblx0JHdjYXBmU2luZ2xlRmlsdGVycy5lYWNoKCBmdW5jdGlvbigpIHtcblx0XHRjb25zdCAkZmllbGQgICAgICAgICA9ICQoIHRoaXMgKTtcblx0XHRjb25zdCBpZCAgICAgICAgICAgICA9ICRmaWVsZC5hdHRyKCAnZGF0YS1pZCcgKTtcblx0XHRjb25zdCAkd3JhcHBlciAgICAgICA9ICRmaWVsZC5maW5kKCAnLndjYXBmLWZpZWxkLWlubmVyID4gZGl2JyApO1xuXHRcdGNvbnN0IGZpbHRlcktleSAgICAgID0gJHdyYXBwZXIuYXR0ciggJ2RhdGEtZmlsdGVyLWtleScgKTtcblx0XHRjb25zdCBtdWx0aXBsZUZpbHRlciA9IHBhcnNlSW50KCAkd3JhcHBlci5hdHRyKCAnZGF0YS1tdWx0aXBsZS1maWx0ZXInICkgKTtcblxuXHRcdGZpZWxkc1sgaWQgXSA9IHtcblx0XHRcdGZpbHRlcktleTogZmlsdGVyS2V5LFxuXHRcdFx0bXVsdGlwbGVGaWx0ZXI6IG11bHRpcGxlRmlsdGVyXG5cdFx0fTtcblx0fSApO1xuXG5cdC8vIEluaXRpYWxpemUgalF1ZXJ5IGNob3NlbiBsaWJyYXJ5LlxuXHRmdW5jdGlvbiBpbml0Q2hvc2VuKCkge1xuXHRcdGlmICggISBqUXVlcnkoKS5jaG9zZW4gKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0JHdjYXBmTmF2RmlsdGVycy5maW5kKCAnLndjYXBmLWNob3Nlbi1zZWxlY3QnICkuZWFjaCggZnVuY3Rpb24oKSB7XG5cdFx0XHRjb25zdCAkdGhpcyAgID0gJCggdGhpcyApO1xuXHRcdFx0Y29uc3Qgb3B0aW9ucyA9IHt9O1xuXG5cdFx0XHRjb25zdCBub1Jlc3VsdHNNZXNzYWdlID0gJHRoaXMuYXR0ciggJ2RhdGEtbm8tcmVzdWx0cy1tZXNzYWdlJyApO1xuXG5cdFx0XHRpZiAoIG5vUmVzdWx0c01lc3NhZ2UgKSB7XG5cdFx0XHRcdG9wdGlvbnNbICdub19yZXN1bHRzX3RleHQnIF0gPSBub1Jlc3VsdHNNZXNzYWdlO1xuXHRcdFx0fVxuXG5cdFx0XHRjb25zdCBzZWFyY2hUaHJlc2hvbGQgPSBwYXJzZUludCggd2NhcGZfcGFyYW1zLmNob3Nlbl9saWJfc2VhcmNoX3RocmVzaG9sZCApO1xuXG5cdFx0XHRpZiAoIHNlYXJjaFRocmVzaG9sZCApIHtcblx0XHRcdFx0b3B0aW9uc1sgJ2Rpc2FibGVfc2VhcmNoX3RocmVzaG9sZCcgXSA9IHNlYXJjaFRocmVzaG9sZDtcblx0XHRcdH1cblxuXHRcdFx0JHRoaXMuY2hvc2VuKCBvcHRpb25zICk7XG5cdFx0fSApO1xuXHR9XG5cblx0aW5pdENob3NlbigpO1xuXG5cdC8vIEluaXRpYWxpemUgaGllcmFyY2h5IGFjY29yZGlvbi5cblx0ZnVuY3Rpb24gaW5pdEhpZXJhcmNoeUFjY29yZGlvbigpIHtcblx0XHQkd2NhcGZOYXZGaWx0ZXJzLmZpbmQoICcuaGllcmFyY2h5LWFjY29yZGlvbi10b2dnbGUnICkub24oICdjbGljaycsIGZ1bmN0aW9uKCkge1xuXHRcdFx0Y29uc3QgJHRoaXMgID0gJCggdGhpcyApO1xuXHRcdFx0Y29uc3QgJGNoaWxkID0gJHRoaXMucGFyZW50KCAnbGknICkuY2hpbGRyZW4oICd1bCcgKTtcblxuXHRcdFx0JHRoaXMudG9nZ2xlQ2xhc3MoICdhY3RpdmUnICk7XG5cblx0XHRcdGlmICggd2NhcGZfcGFyYW1zLmVuYWJsZV9hbmltYXRpb25fZm9yX2hpZXJhcmNoeV9hY2NvcmRpb24gKSB7XG5cdFx0XHRcdCRjaGlsZC5zbGlkZVRvZ2dsZSgpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0JGNoaWxkLnRvZ2dsZSgpO1xuXHRcdFx0fVxuXHRcdH0gKTtcblx0fVxuXG5cdGluaXRIaWVyYXJjaHlBY2NvcmRpb24oKTtcblxuXHQvKipcblx0ICogQHNvdXJjZSBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL2EvMzQxNDE4MTNcblx0ICpcblx0ICogQHBhcmFtIG51bWJlclxuXHQgKiBAcGFyYW0gZGVjaW1hbHNcblx0ICogQHBhcmFtIGRlY19wb2ludFxuXHQgKiBAcGFyYW0gdGhvdXNhbmRzX3NlcFxuXHQgKlxuXHQgKiBAcmV0dXJucyB7c3RyaW5nfVxuXHQgKi9cblx0ZnVuY3Rpb24gbnVtYmVyX2Zvcm1hdCggbnVtYmVyLCBkZWNpbWFscywgZGVjX3BvaW50LCB0aG91c2FuZHNfc2VwICkge1xuXHRcdC8vIFN0cmlwIGFsbCBjaGFyYWN0ZXJzIGJ1dCBudW1lcmljYWwgb25lcy5cblx0XHRudW1iZXIgPSAoIG51bWJlciArICcnICkucmVwbGFjZSggL1teXFxkK1xcLUVlLl0vZywgJycgKTtcblxuXHRcdGNvbnN0IG4gICAgPSAhIGlzRmluaXRlKCArbnVtYmVyICkgPyAwIDogK251bWJlcjtcblx0XHRjb25zdCBwcmVjID0gISBpc0Zpbml0ZSggK2RlY2ltYWxzICkgPyAwIDogTWF0aC5hYnMoIGRlY2ltYWxzICk7XG5cdFx0Y29uc3Qgc2VwICA9ICggdHlwZW9mIHRob3VzYW5kc19zZXAgPT09ICd1bmRlZmluZWQnICkgPyAnLCcgOiB0aG91c2FuZHNfc2VwO1xuXHRcdGNvbnN0IGRlYyAgPSAoIHR5cGVvZiBkZWNfcG9pbnQgPT09ICd1bmRlZmluZWQnICkgPyAnLicgOiBkZWNfcG9pbnQ7XG5cblx0XHRsZXQgcztcblxuXHRcdGNvbnN0IHRvRml4ZWRGaXggPSBmdW5jdGlvbiggbiwgcHJlYyApIHtcblx0XHRcdGNvbnN0IGsgPSBNYXRoLnBvdyggMTAsIHByZWMgKTtcblx0XHRcdHJldHVybiAnJyArIE1hdGgucm91bmQoIG4gKiBrICkgLyBrO1xuXHRcdH07XG5cblx0XHQvLyBGaXggZm9yIElFIHBhcnNlRmxvYXQoMC41NSkudG9GaXhlZCgwKSA9IDA7XG5cdFx0cyA9ICggcHJlYyA/IHRvRml4ZWRGaXgoIG4sIHByZWMgKSA6ICcnICsgTWF0aC5yb3VuZCggbiApICkuc3BsaXQoICcuJyApO1xuXG5cdFx0aWYgKCBzWyAwIF0ubGVuZ3RoID4gMyApIHtcblx0XHRcdHNbIDAgXSA9IHNbIDAgXS5yZXBsYWNlKCAvXFxCKD89KD86XFxkezN9KSsoPyFcXGQpKS9nLCBzZXAgKTtcblx0XHR9XG5cblx0XHRpZiAoICggc1sgMSBdIHx8ICcnICkubGVuZ3RoIDwgcHJlYyApIHtcblx0XHRcdHNbIDEgXSA9IHNbIDEgXSB8fCAnJztcblx0XHRcdHNbIDEgXSArPSBuZXcgQXJyYXkoIHByZWMgLSBzWyAxIF0ubGVuZ3RoICsgMSApLmpvaW4oICcwJyApO1xuXHRcdH1cblxuXHRcdHJldHVybiBzLmpvaW4oIGRlYyApO1xuXHR9XG5cblx0Ly8gSW5pdGlhbGl6ZSBub1VJU2xpZGVyLlxuXHRmdW5jdGlvbiBpbml0Tm9VSVNsaWRlcigpIHtcblx0XHRpZiAoICd1bmRlZmluZWQnID09PSB0eXBlb2Ygbm9VaVNsaWRlciApIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHQkd2NhcGZOdW1iZXJSYW5nZUZpbHRlcnMuZmluZCggJy53Y2FwZi1yYW5nZS1zbGlkZXInICkuZWFjaCggZnVuY3Rpb24oKSB7XG5cdFx0XHRjb25zdCAkaXRlbSA9ICQoIHRoaXMgKTtcblxuXHRcdFx0Y29uc3QgZmlsdGVyS2V5ID0gJGl0ZW0uYXR0ciggJ2RhdGEtZmlsdGVyLWtleScgKTtcblx0XHRcdGNvbnN0ICRzbGlkZXIgICA9ICRpdGVtLmZpbmQoICcud2NhcGYtbm91aS1zbGlkZXInICk7XG5cblx0XHRcdC8vIElmIHNsaWRlciBpcyBhbHJlYWR5IGluaXRpYWxpemVkIHRoZW4gZG9uJ3QgcmVpbml0aWFsaXplIGFnYWluLlxuXHRcdFx0aWYgKCAkc2xpZGVyLmhhc0NsYXNzKCAnd2NhcGYtbm91aS10YXJnZXQnICkgKSB7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblxuXHRcdFx0Y29uc3Qgc2xpZGVySWQgICAgICAgICAgPSAkc2xpZGVyLmF0dHIoICdpZCcgKTtcblx0XHRcdGNvbnN0IGRpc3BsYXlWYWx1ZXNBcyAgID0gJGl0ZW0uYXR0ciggJ2RhdGEtZGlzcGxheS12YWx1ZXMtYXMnICk7XG5cdFx0XHRjb25zdCByYW5nZU1pblZhbHVlICAgICA9IHBhcnNlRmxvYXQoICRpdGVtLmF0dHIoICdkYXRhLXJhbmdlLW1pbi12YWx1ZScgKSApO1xuXHRcdFx0Y29uc3QgcmFuZ2VNYXhWYWx1ZSAgICAgPSBwYXJzZUZsb2F0KCAkaXRlbS5hdHRyKCAnZGF0YS1yYW5nZS1tYXgtdmFsdWUnICkgKTtcblx0XHRcdGNvbnN0IHN0ZXAgICAgICAgICAgICAgID0gcGFyc2VGbG9hdCggJGl0ZW0uYXR0ciggJ2RhdGEtc3RlcCcgKSApO1xuXHRcdFx0Y29uc3QgZGVjaW1hbFBsYWNlcyAgICAgPSAkaXRlbS5hdHRyKCAnZGF0YS1kZWNpbWFsLXBsYWNlcycgKTtcblx0XHRcdGNvbnN0IHRob3VzYW5kU2VwYXJhdG9yID0gJGl0ZW0uYXR0ciggJ2RhdGEtdGhvdXNhbmQtc2VwYXJhdG9yJyApO1xuXHRcdFx0Y29uc3QgZGVjaW1hbFNlcGFyYXRvciAgPSAkaXRlbS5hdHRyKCAnZGF0YS1kZWNpbWFsLXNlcGFyYXRvcicgKTtcblx0XHRcdGNvbnN0IG1pblZhbHVlICAgICAgICAgID0gcGFyc2VGbG9hdCggJGl0ZW0uYXR0ciggJ2RhdGEtbWluLXZhbHVlJyApICk7XG5cdFx0XHRjb25zdCBtYXhWYWx1ZSAgICAgICAgICA9IHBhcnNlRmxvYXQoICRpdGVtLmF0dHIoICdkYXRhLW1heC12YWx1ZScgKSApO1xuXHRcdFx0Y29uc3QgJG1pblZhbHVlICAgICAgICAgPSAkaXRlbS5maW5kKCAnLm1pbi12YWx1ZScgKTtcblx0XHRcdGNvbnN0ICRtYXhWYWx1ZSAgICAgICAgID0gJGl0ZW0uZmluZCggJy5tYXgtdmFsdWUnICk7XG5cblx0XHRcdGNvbnN0IHNsaWRlciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCBzbGlkZXJJZCApO1xuXG5cdFx0XHRub1VpU2xpZGVyLmNyZWF0ZSggc2xpZGVyLCB7XG5cdFx0XHRcdHN0YXJ0OiBbIG1pblZhbHVlLCBtYXhWYWx1ZSBdLFxuXHRcdFx0XHRzdGVwLFxuXHRcdFx0XHRjb25uZWN0OiB0cnVlLFxuXHRcdFx0XHRjc3NQcmVmaXg6ICd3Y2FwZi1ub3VpLScsXG5cdFx0XHRcdHJhbmdlOiB7XG5cdFx0XHRcdFx0J21pbic6IHJhbmdlTWluVmFsdWUsXG5cdFx0XHRcdFx0J21heCc6IHJhbmdlTWF4VmFsdWUsXG5cdFx0XHRcdH1cblx0XHRcdH0gKTtcblxuXHRcdFx0c2xpZGVyLm5vVWlTbGlkZXIub24oICd1cGRhdGUnLCBmdW5jdGlvbiggdmFsdWVzICkge1xuXHRcdFx0XHRjb25zdCBtaW5WYWx1ZSA9IG51bWJlcl9mb3JtYXQoIHZhbHVlc1sgMCBdLCBkZWNpbWFsUGxhY2VzLCBkZWNpbWFsU2VwYXJhdG9yLCB0aG91c2FuZFNlcGFyYXRvciApO1xuXHRcdFx0XHRjb25zdCBtYXhWYWx1ZSA9IG51bWJlcl9mb3JtYXQoIHZhbHVlc1sgMSBdLCBkZWNpbWFsUGxhY2VzLCBkZWNpbWFsU2VwYXJhdG9yLCB0aG91c2FuZFNlcGFyYXRvciApO1xuXG5cdFx0XHRcdGlmICggJ3BsYWluX3RleHQnID09PSBkaXNwbGF5VmFsdWVzQXMgKSB7XG5cdFx0XHRcdFx0JG1pblZhbHVlLmh0bWwoIG1pblZhbHVlICk7XG5cdFx0XHRcdFx0JG1heFZhbHVlLmh0bWwoIG1heFZhbHVlICk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0JG1pblZhbHVlLnZhbCggbWluVmFsdWUgKTtcblx0XHRcdFx0XHQkbWF4VmFsdWUudmFsKCBtYXhWYWx1ZSApO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0JGJvZHkudHJpZ2dlciggJ3djYXBmLW5vdWlzbGlkZXItdXBkYXRlJywgWyAkaXRlbSwgdmFsdWVzIF0gKTtcblx0XHRcdH0gKTtcblxuXHRcdFx0ZnVuY3Rpb24gZmlsdGVyUHJvZHVjdHNBY2NvcmRpbmdUb1NsaWRlciggdmFsdWVzICkge1xuXHRcdFx0XHQkYm9keS50cmlnZ2VyKCAnd2NhcGYtbm91aXNsaWRlci1iZWZvcmUtZmlsdGVyLXByb2R1Y3RzJywgWyAkaXRlbSwgdmFsdWVzIF0gKTtcblxuXHRcdFx0XHRjb25zdCBtaW5WYWx1ZSA9IHBhcnNlRmxvYXQoIHZhbHVlc1sgMCBdICk7XG5cdFx0XHRcdGNvbnN0IG1heFZhbHVlID0gcGFyc2VGbG9hdCggdmFsdWVzWyAxIF0gKTtcblxuXHRcdFx0XHRpZiAoIG1pblZhbHVlID09PSByYW5nZU1pblZhbHVlICYmIG1heFZhbHVlID09PSByYW5nZU1heFZhbHVlICkge1xuXHRcdFx0XHRcdGNvbnN0IHF1ZXJ5ID0gd2NhcGZSZW1vdmVRdWVyeVN0cmluZ1BhcmFtZXRlciggZmlsdGVyS2V5ICk7XG5cdFx0XHRcdFx0aGlzdG9yeS5wdXNoU3RhdGUoIHt9LCAnJywgcXVlcnkgKTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRjb25zdCBmaWx0ZXJWYWxTdHJpbmcgPSBtaW5WYWx1ZSArIHJhbmdlVmFsdWVzU2VwYXJhdG9yICsgbWF4VmFsdWU7XG5cdFx0XHRcdFx0d2NhcGZVcGRhdGVRdWVyeVN0cmluZ1BhcmFtZXRlciggZmlsdGVyS2V5LCBmaWx0ZXJWYWxTdHJpbmcgKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdHdjYXBmRmlsdGVyUHJvZHVjdHMoKTtcblxuXHRcdFx0XHQkYm9keS50cmlnZ2VyKCAnd2NhcGYtbm91aXNsaWRlci1hZnRlci1maWx0ZXItcHJvZHVjdHMnLCBbICRpdGVtLCB2YWx1ZXMgXSApO1xuXHRcdFx0fVxuXG5cdFx0XHRzbGlkZXIubm9VaVNsaWRlci5vbiggJ3NldCcsIGZ1bmN0aW9uKCB2YWx1ZXMgKSB7XG5cdFx0XHRcdC8vIENsZWFyIGFueSBwcmV2aW91c2x5IHNldCB0aW1lciBiZWZvcmUgc2V0dGluZyBhIGZyZXNoIG9uZVxuXHRcdFx0XHRjbGVhclRpbWVvdXQoICRpdGVtLmRhdGEoICd0aW1lcicgKSApO1xuXG5cdFx0XHRcdCRpdGVtLmRhdGEoICd0aW1lcicsIHNldFRpbWVvdXQoIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdCRpdGVtLnJlbW92ZURhdGEoICd0aW1lcicgKTtcblxuXHRcdFx0XHRcdGZpbHRlclByb2R1Y3RzQWNjb3JkaW5nVG9TbGlkZXIoIHZhbHVlcyApO1xuXHRcdFx0XHR9LCBkZWxheSApICk7XG5cdFx0XHR9ICk7XG5cblx0XHRcdCRtaW5WYWx1ZS5vbiggJ2lucHV0JywgZnVuY3Rpb24oIGV2ZW50ICkge1xuXHRcdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXG5cdFx0XHRcdGNvbnN0ICRpbnB1dCA9ICQoIHRoaXMgKTtcblxuXHRcdFx0XHQvLyBDbGVhciBhbnkgcHJldmlvdXNseSBzZXQgdGltZXIgYmVmb3JlIHNldHRpbmcgYSBmcmVzaCBvbmVcblx0XHRcdFx0Y2xlYXJUaW1lb3V0KCAkaW5wdXQuZGF0YSggJ3RpbWVyJyApICk7XG5cblx0XHRcdFx0JGlucHV0LmRhdGEoICd0aW1lcicsIHNldFRpbWVvdXQoIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdCRpbnB1dC5yZW1vdmVEYXRhKCAndGltZXInICk7XG5cblx0XHRcdFx0XHRjb25zdCBtaW5WYWx1ZSA9ICRpbnB1dC52YWwoKTtcblxuXHRcdFx0XHRcdHNsaWRlci5ub1VpU2xpZGVyLnNldCggWyBtaW5WYWx1ZSwgbnVsbCBdICk7XG5cblx0XHRcdFx0XHRmaWx0ZXJQcm9kdWN0c0FjY29yZGluZ1RvU2xpZGVyKCBzbGlkZXIubm9VaVNsaWRlci5nZXQoKSApO1xuXHRcdFx0XHR9LCBkZWxheSApICk7XG5cdFx0XHR9ICk7XG5cblx0XHRcdCRtYXhWYWx1ZS5vbiggJ2lucHV0JywgZnVuY3Rpb24oIGV2ZW50ICkge1xuXHRcdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXG5cdFx0XHRcdGNvbnN0ICRpbnB1dCA9ICQoIHRoaXMgKTtcblxuXHRcdFx0XHQvLyBDbGVhciBhbnkgcHJldmlvdXNseSBzZXQgdGltZXIgYmVmb3JlIHNldHRpbmcgYSBmcmVzaCBvbmVcblx0XHRcdFx0Y2xlYXJUaW1lb3V0KCAkaW5wdXQuZGF0YSggJ3RpbWVyJyApICk7XG5cblx0XHRcdFx0JGlucHV0LmRhdGEoICd0aW1lcicsIHNldFRpbWVvdXQoIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdCRpbnB1dC5yZW1vdmVEYXRhKCAndGltZXInICk7XG5cblx0XHRcdFx0XHRjb25zdCBtYXhWYWx1ZSA9ICRpbnB1dC52YWwoKTtcblxuXHRcdFx0XHRcdHNsaWRlci5ub1VpU2xpZGVyLnNldCggWyBudWxsLCBtYXhWYWx1ZSBdICk7XG5cblx0XHRcdFx0XHRmaWx0ZXJQcm9kdWN0c0FjY29yZGluZ1RvU2xpZGVyKCBzbGlkZXIubm9VaVNsaWRlci5nZXQoKSApO1xuXHRcdFx0XHR9LCBkZWxheSApICk7XG5cdFx0XHR9ICk7XG5cdFx0fSApO1xuXHR9XG5cblx0aW5pdE5vVUlTbGlkZXIoKTtcblxuXHRmdW5jdGlvbiBmaWx0ZXJCeURhdGUoICRpbnB1dCApIHtcblx0XHRjb25zdCAkd2NhcGZEYXRlRmlsdGVyID0gJGlucHV0LmNsb3Nlc3QoICcud2NhcGYtZGF0ZS1pbnB1dCcgKTtcblx0XHRjb25zdCBmaWx0ZXJLZXkgICAgICAgID0gJHdjYXBmRGF0ZUZpbHRlci5hdHRyKCAnZGF0YS1maWx0ZXIta2V5JyApO1xuXHRcdGNvbnN0IGlzUmFuZ2UgICAgICAgICAgPSAkd2NhcGZEYXRlRmlsdGVyLmF0dHIoICdkYXRhLWlzLXJhbmdlJyApO1xuXG5cdFx0bGV0IGZpbHRlclZhbHVlID0gJyc7XG5cdFx0bGV0IHJ1bkZpbHRlciAgID0gZmFsc2U7XG5cblx0XHQvLyBDbGVhciBhbnkgcHJldmlvdXNseSBzZXQgdGltZXIgYmVmb3JlIHNldHRpbmcgYSBmcmVzaCBvbmVcblx0XHRjbGVhclRpbWVvdXQoICR3Y2FwZkRhdGVGaWx0ZXIuZGF0YSggJ3RpbWVyJyApICk7XG5cblx0XHRpZiAoIGlzUmFuZ2UgKSB7XG5cdFx0XHRjb25zdCBmcm9tID0gJHdjYXBmRGF0ZUZpbHRlci5maW5kKCAnLmRhdGUtZnJvbS1pbnB1dCcgKS52YWwoKTtcblx0XHRcdGNvbnN0IHRvICAgPSAkd2NhcGZEYXRlRmlsdGVyLmZpbmQoICcuZGF0ZS10by1pbnB1dCcgKS52YWwoKTtcblxuXHRcdFx0aWYgKCBmcm9tICYmIHRvICkge1xuXHRcdFx0XHRmaWx0ZXJWYWx1ZSA9IGZyb20gKyByYW5nZVZhbHVlc1NlcGFyYXRvciArIHRvO1xuXHRcdFx0XHRydW5GaWx0ZXIgICA9IHRydWU7XG5cdFx0XHR9IGVsc2UgaWYgKCAhIGZyb20gJiYgISB0byApIHtcblx0XHRcdFx0cnVuRmlsdGVyID0gdHJ1ZTtcblx0XHRcdH1cblx0XHR9IGVsc2Uge1xuXHRcdFx0Y29uc3QgZnJvbSA9ICR3Y2FwZkRhdGVGaWx0ZXIuZmluZCggJy5kYXRlLWZyb20taW5wdXQnICkudmFsKCk7XG5cblx0XHRcdGlmICggZnJvbSApIHtcblx0XHRcdFx0ZmlsdGVyVmFsdWUgPSBmcm9tO1xuXHRcdFx0XHRydW5GaWx0ZXIgICA9IHRydWU7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRydW5GaWx0ZXIgPSB0cnVlO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdGlmICggcnVuRmlsdGVyICkge1xuXHRcdFx0JHdjYXBmRGF0ZUZpbHRlci5kYXRhKCAndGltZXInLCBzZXRUaW1lb3V0KCBmdW5jdGlvbigpIHtcblx0XHRcdFx0JHdjYXBmRGF0ZUZpbHRlci5yZW1vdmVEYXRhKCAndGltZXInICk7XG5cblx0XHRcdFx0aWYgKCBmaWx0ZXJWYWx1ZSApIHtcblx0XHRcdFx0XHR3Y2FwZlVwZGF0ZVF1ZXJ5U3RyaW5nUGFyYW1ldGVyKCBmaWx0ZXJLZXksIGZpbHRlclZhbHVlICk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0Y29uc3QgcXVlcnkgPSB3Y2FwZlJlbW92ZVF1ZXJ5U3RyaW5nUGFyYW1ldGVyKCBmaWx0ZXJLZXkgKTtcblx0XHRcdFx0XHRoaXN0b3J5LnB1c2hTdGF0ZSgge30sICcnLCBxdWVyeSApO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0d2NhcGZGaWx0ZXJQcm9kdWN0cygpO1xuXHRcdFx0fSwgZGVsYXkgKSApO1xuXHRcdH1cblx0fVxuXG5cdGZ1bmN0aW9uIGluaXREYXRlcGlja2VyKCkge1xuXHRcdGlmICggISBqUXVlcnkoKS5kYXRlcGlja2VyICkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdGNvbnN0ICR3Y2FwZkRhdGVGaWx0ZXJzID0gJCggJy53Y2FwZi1kYXRlLXJhbmdlLWZpbHRlcicgKTtcblx0XHRjb25zdCAkd2NhcGZEYXRlRmlsdGVyICA9ICR3Y2FwZkRhdGVGaWx0ZXJzLmZpbmQoICcud2NhcGYtZGF0ZS1pbnB1dCcgKTtcblxuXHRcdGNvbnN0IGZvcm1hdCAgICAgICAgPSAkd2NhcGZEYXRlRmlsdGVyLmF0dHIoICdkYXRhLWRhdGUtZm9ybWF0JyApO1xuXHRcdGNvbnN0IHllYXJEcm9wZG93biAgPSAkd2NhcGZEYXRlRmlsdGVyLmF0dHIoICdkYXRhLWRhdGUtcGlja2VyLXllYXItZHJvcGRvd24nICk7XG5cdFx0Y29uc3QgbW9udGhEcm9wZG93biA9ICR3Y2FwZkRhdGVGaWx0ZXIuYXR0ciggJ2RhdGEtZGF0ZS1waWNrZXItbW9udGgtZHJvcGRvd24nICk7XG5cblx0XHRjb25zdCAkZnJvbSA9ICR3Y2FwZkRhdGVGaWx0ZXIuZmluZCggJy5kYXRlLWZyb20taW5wdXQnICk7XG5cdFx0Y29uc3QgJHRvICAgPSAkd2NhcGZEYXRlRmlsdGVyLmZpbmQoICcuZGF0ZS10by1pbnB1dCcgKTtcblxuXHRcdCRmcm9tLmRhdGVwaWNrZXIoIHtcblx0XHRcdGRhdGVGb3JtYXQ6IGZvcm1hdCxcblx0XHRcdGNoYW5nZVllYXI6IHllYXJEcm9wZG93bixcblx0XHRcdGNoYW5nZU1vbnRoOiBtb250aERyb3Bkb3duLFxuXHRcdH0gKTtcblxuXHRcdCR0by5kYXRlcGlja2VyKCB7XG5cdFx0XHRkYXRlRm9ybWF0OiBmb3JtYXQsXG5cdFx0XHRjaGFuZ2VZZWFyOiB5ZWFyRHJvcGRvd24sXG5cdFx0XHRjaGFuZ2VNb250aDogbW9udGhEcm9wZG93bixcblx0XHR9ICk7XG5cblx0XHQkZnJvbS5vbiggJ2NoYW5nZScsIGZ1bmN0aW9uKCkge1xuXHRcdFx0Y29uc3QgJGlucHV0ID0gJCggdGhpcyApO1xuXHRcdFx0ZmlsdGVyQnlEYXRlKCAkaW5wdXQgKTtcblx0XHR9ICk7XG5cblx0XHQkdG8ub24oICdjaGFuZ2UnLCBmdW5jdGlvbigpIHtcblx0XHRcdGNvbnN0ICRpbnB1dCA9ICQoIHRoaXMgKTtcblx0XHRcdGZpbHRlckJ5RGF0ZSggJGlucHV0ICk7XG5cdFx0fSApO1xuXHR9XG5cblx0aW5pdERhdGVwaWNrZXIoKTtcblxuXHQvLyBUaGluZ3MgYXJlIGRvbmUgYmVmb3JlIGFwcGx5aW5nIHRoZSBmaWx0ZXIgbGlrZSBzaG93aW5nIGEgbG9hZGluZyBpbmRpY2F0b3IuXG5cdGZ1bmN0aW9uIHdjYXBmQmVmb3JlVXBkYXRlKCkge1xuXHRcdCRib2R5LnRyaWdnZXIoICd3Y2FwZl9iZWZvcmVfdXBkYXRlX2ZpbHRlcnMnICk7XG5cdH1cblxuXHQvLyBUaGluZ3MgYXJlIGRvbmUgYWZ0ZXIgYXBwbHlpbmcgdGhlIGZpbHRlciBsaWtlIHNjcm9sbCB0byB0b3AuXG5cdGZ1bmN0aW9uIHdjYXBmQWZ0ZXJVcGRhdGUoKSB7XG5cdFx0aW5pdENob3NlbigpO1xuXHRcdGluaXRIaWVyYXJjaHlBY2NvcmRpb24oKTtcblx0XHRpbml0Tm9VSVNsaWRlcigpO1xuXHRcdGluaXREYXRlcGlja2VyKCk7XG5cblx0XHQvLyB0b2RvXG5cdFx0Ly8gcmVpbml0aWFsaXplIG9yZGVyaW5nXG5cdFx0Ly8gd2NhcGZJbml0T3JkZXIoKTtcblxuXHRcdCRib2R5LnRyaWdnZXIoICd3Y2FwZl9hZnRlcl91cGRhdGVfZmlsdGVycycgKTtcblx0fVxuXG5cdC8vIFRoZSBtYWluIGZpbHRlciBmdW5jdGlvbi5cblx0ZnVuY3Rpb24gd2NhcGZGaWx0ZXJQcm9kdWN0cyggZm9yY2VSZVJlbmRlciA9IGZhbHNlICkge1xuXHRcdHdjYXBmQmVmb3JlVXBkYXRlKCk7XG5cblx0XHQkLmdldCggd2luZG93LmxvY2F0aW9uLmhyZWYsIGZ1bmN0aW9uKCBkYXRhICkge1xuXHRcdFx0Y29uc3QgJGRhdGEgPSAkKCBkYXRhICk7XG5cblx0XHRcdC8vIFJlcGxhY2UgdGhlIGZpZWxkcycgZGF0YSB3aXRoIG5ldyBkYXRhLlxuXHRcdFx0JC5lYWNoKCBmaWVsZHMsIGZ1bmN0aW9uKCBpZCApIHtcblx0XHRcdFx0Y29uc3QgZmllbGRJRCAgICA9ICdbZGF0YS1pZD1cIicgKyBpZCArICdcIl0nO1xuXHRcdFx0XHRjb25zdCAkZmllbGQgICAgID0gJCggZmllbGRJRCApO1xuXHRcdFx0XHRjb25zdCAkaW5uZXIgICAgID0gJGZpZWxkLmZpbmQoICcud2NhcGYtZmllbGQtaW5uZXInICk7XG5cdFx0XHRcdGNvbnN0IF9maWVsZCAgICAgPSAkZGF0YS5maW5kKCBmaWVsZElEICk7XG5cdFx0XHRcdGNvbnN0IGZpZWxkQ2xhc3MgPSAkKCBfZmllbGQgKS5hdHRyKCAnY2xhc3MnICk7XG5cblx0XHRcdFx0Ly8gUHJlc2VydmUgaGllcmFyY2h5IGFjY29yZGlvbiBzdGF0ZS5cblx0XHRcdFx0aWYgKCB3Y2FwZl9wYXJhbXMucHJlc2VydmVfaGllcmFyY2h5X2FjY29yZGlvbl9zdGF0ZSApIHtcblx0XHRcdFx0XHRpZiAoICRmaWVsZC5oYXNDbGFzcyggJ2hpZXJhcmNoeS1hY2NvcmRpb24nICkgKSB7XG5cdFx0XHRcdFx0XHQkZmllbGQuZmluZCggJy5oaWVyYXJjaHktYWNjb3JkaW9uLXRvZ2dsZS5hY3RpdmUnICkuZWFjaCggZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0XHRcdGNvbnN0IGl0ZW1WYWx1ZSAgICAgID0gJCggdGhpcyApLnBhcmVudCgpLmNoaWxkcmVuKCAnaW5wdXQnICkudmFsKCk7XG5cdFx0XHRcdFx0XHRcdGNvbnN0IHRvZ2dsZVNlbGVjdG9yID0gJ2lucHV0W3ZhbHVlPVwiJyArIGl0ZW1WYWx1ZSArICdcIl0gfiAuaGllcmFyY2h5LWFjY29yZGlvbi10b2dnbGUnO1xuXHRcdFx0XHRcdFx0XHRjb25zdCB1bFNlbGVjdG9yICAgICA9ICdpbnB1dFt2YWx1ZT1cIicgKyBpdGVtVmFsdWUgKyAnXCJdIH4gdWwnO1xuXHRcdFx0XHRcdFx0XHRjb25zdCBfY2xhc3NlcyAgICAgICA9ICdoaWVyYXJjaHktYWNjb3JkaW9uLXRvZ2dsZSBhY3RpdmUnO1xuXG5cdFx0XHRcdFx0XHRcdF9maWVsZC5maW5kKCB0b2dnbGVTZWxlY3RvciApLmF0dHIoICdjbGFzcycsIF9jbGFzc2VzICk7XG5cdFx0XHRcdFx0XHRcdF9maWVsZC5maW5kKCB1bFNlbGVjdG9yICkuc2hvdygpO1xuXHRcdFx0XHRcdFx0fSApO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXG5cdFx0XHRcdGNvbnN0IF9odG1sID0gX2ZpZWxkLmZpbmQoICcud2NhcGYtZmllbGQtaW5uZXInICkuaHRtbCgpO1xuXG5cdFx0XHRcdC8vIFVwZGF0ZSB0aGUgZmllbGQncyBjbGFzcy5cblx0XHRcdFx0JGZpZWxkLmF0dHIoICdjbGFzcycsIGZpZWxkQ2xhc3MgKTtcblxuXHRcdFx0XHQvLyBXaGVuIGNhbGxlZCBmcm9tIGhpc3RvcnkgYmFjayBvciBmb3J3YXJkIHJlcXVlc3QgdGhlbiByZXJlbmRlciBhbGwgZmllbGRzLlxuXHRcdFx0XHRpZiAoIGZvcmNlUmVSZW5kZXIgKSB7XG5cblx0XHRcdFx0XHQvLyB1cGRhdGUgZmllbGRcblx0XHRcdFx0XHQkaW5uZXIuaHRtbCggX2h0bWwgKTtcblxuXHRcdFx0XHR9IGVsc2Uge1xuXG5cdFx0XHRcdFx0Ly8gU2VsZWN0aXZlbHkgcmVyZW5kZXIgdGhlIGZpZWxkcy5cblx0XHRcdFx0XHRpZiAoICRmaWVsZC5oYXNDbGFzcyggJ3djYXBmLW5hdi1maWx0ZXInICkgKSB7XG5cblx0XHRcdFx0XHRcdC8vIHVwZGF0ZSBmaWVsZFxuXHRcdFx0XHRcdFx0JGlubmVyLmh0bWwoIF9odG1sICk7XG5cblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0fVxuXHRcdFx0fSApO1xuXG5cdFx0XHQvLyBSZXBsYWNlIG9sZCBzaG9wIGxvb3Agd2l0aCBuZXcgb25lLlxuXHRcdFx0Y29uc3QgJHNob3BMb29wQ29udGFpbmVyID0gJGRhdGEuZmluZCggd2NhcGZfcGFyYW1zLnNob3BfbG9vcF9jb250YWluZXIgKTtcblx0XHRcdGNvbnN0ICRub3RGb3VuZENvbnRhaW5lciA9ICRkYXRhLmZpbmQoIHdjYXBmX3BhcmFtcy5ub3RfZm91bmRfY29udGFpbmVyICk7XG5cblx0XHRcdGlmICggd2NhcGZfcGFyYW1zLnNob3BfbG9vcF9jb250YWluZXIgPT09IHdjYXBmX3BhcmFtcy5ub3RfZm91bmRfY29udGFpbmVyICkge1xuXHRcdFx0XHQkKCB3Y2FwZl9wYXJhbXMuc2hvcF9sb29wX2NvbnRhaW5lciApLmh0bWwoICRzaG9wTG9vcENvbnRhaW5lci5odG1sKCkgKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGlmICggJCggd2NhcGZfcGFyYW1zLm5vdF9mb3VuZF9jb250YWluZXIgKS5sZW5ndGggKSB7XG5cdFx0XHRcdFx0aWYgKCAkc2hvcExvb3BDb250YWluZXIubGVuZ3RoICkge1xuXHRcdFx0XHRcdFx0JCggd2NhcGZfcGFyYW1zLm5vdF9mb3VuZF9jb250YWluZXIgKS5odG1sKCAkc2hvcExvb3BDb250YWluZXIuaHRtbCgpICk7XG5cdFx0XHRcdFx0fSBlbHNlIGlmICggJG5vdEZvdW5kQ29udGFpbmVyLmxlbmd0aCApIHtcblx0XHRcdFx0XHRcdCQoIHdjYXBmX3BhcmFtcy5ub3RfZm91bmRfY29udGFpbmVyICkuaHRtbCggJG5vdEZvdW5kQ29udGFpbmVyLmh0bWwoKSApO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSBlbHNlIGlmICggJCggd2NhcGZfcGFyYW1zLnNob3BfbG9vcF9jb250YWluZXIgKS5sZW5ndGggKSB7XG5cdFx0XHRcdFx0aWYgKCAkc2hvcExvb3BDb250YWluZXIubGVuZ3RoICkge1xuXHRcdFx0XHRcdFx0JCggd2NhcGZfcGFyYW1zLnNob3BfbG9vcF9jb250YWluZXIgKS5odG1sKCAkc2hvcExvb3BDb250YWluZXIuaHRtbCgpICk7XG5cdFx0XHRcdFx0fSBlbHNlIGlmICggJG5vdEZvdW5kQ29udGFpbmVyLmxlbmd0aCApIHtcblx0XHRcdFx0XHRcdCQoIHdjYXBmX3BhcmFtcy5zaG9wX2xvb3BfY29udGFpbmVyICkuaHRtbCggJG5vdEZvdW5kQ29udGFpbmVyLmh0bWwoKSApO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0XHR3Y2FwZkFmdGVyVXBkYXRlKCk7XG5cblx0XHRcdC8vIHJ1biBzY3JpcHRzIGFmdGVyIHNob3AgbG9vcCB1bmRhdGVkXG5cdFx0XHRpZiAoIHR5cGVvZiB3Y2FwZl9wYXJhbXMuY3VzdG9tX3NjcmlwdHMgIT09ICd1bmRlZmluZWQnICYmIHdjYXBmX3BhcmFtcy5jdXN0b21fc2NyaXB0cy5sZW5ndGggPiAwICkge1xuXHRcdFx0XHRldmFsKCB3Y2FwZl9wYXJhbXMuY3VzdG9tX3NjcmlwdHMgKTtcblx0XHRcdH1cblx0XHR9ICk7XG5cdH1cblxuXHQvLyBVUkwgUGFyc2VyXG5cdGZ1bmN0aW9uIHdjYXBmR2V0VXJsVmFycyggdXJsICkge1xuXHRcdGxldCB2YXJzID0ge30sIGhhc2g7XG5cblx0XHRpZiAoIHR5cGVvZiB1cmwgPT09ICd1bmRlZmluZWQnICkge1xuXHRcdFx0dXJsID0gd2luZG93LmxvY2F0aW9uLmhyZWY7XG5cdFx0fVxuXG5cdFx0dXJsID0gdXJsLnJlcGxhY2VBbGwoICclMkMnLCAnLCcgKTtcblxuXHRcdGNvbnN0IGhhc2hlcyAgPSB1cmwuc2xpY2UoIHVybC5pbmRleE9mKCAnPycgKSArIDEgKS5zcGxpdCggJyYnICk7XG5cdFx0Y29uc3QgaExlbmd0aCA9IGhhc2hlcy5sZW5ndGg7XG5cblx0XHRmb3IgKCBsZXQgaSA9IDA7IGkgPCBoTGVuZ3RoOyBpKysgKSB7XG5cdFx0XHRoYXNoID0gaGFzaGVzWyBpIF0uc3BsaXQoICc9JyApO1xuXG5cdFx0XHR2YXJzWyBoYXNoWyAwIF0gXSA9IGhhc2hbIDEgXTtcblx0XHR9XG5cblx0XHRyZXR1cm4gdmFycztcblx0fVxuXG5cdC8vIGV2ZXJ5dGltZSB3ZSBhcHBseSB0aGUgZmlsdGVyIHdlIHNldCB0aGUgY3VycmVudCBwYWdlIHRvIDFcblx0ZnVuY3Rpb24gd2NhcGZGaXhQYWdpbmF0aW9uKCkge1xuXHRcdGxldCB1cmwgICAgICAgICAgICAgICAgPSB3aW5kb3cubG9jYXRpb24uaHJlZjtcblx0XHRjb25zdCBwYXJhbXMgICAgICAgICAgID0gd2NhcGZHZXRVcmxWYXJzKCB1cmwgKTtcblx0XHRjb25zdCBjdXJyZW50UGFnZUluVXJsID0gcGFyc2VJbnQoIHVybC5yZXBsYWNlKCAvLitcXC9wYWdlXFwvKFxcZCspKy8sICckMScgKSApO1xuXG5cdFx0aWYgKCBjdXJyZW50UGFnZUluVXJsICkge1xuXHRcdFx0aWYgKCBjdXJyZW50UGFnZUluVXJsID4gMSApIHtcblx0XHRcdFx0dXJsID0gdXJsLnJlcGxhY2UoIC9wYWdlXFwvKFxcZCspLywgJ3BhZ2UvMScgKTtcblx0XHRcdH1cblx0XHR9IGVsc2UgaWYgKCB0eXBlb2YgcGFyYW1zWyAncGFnZWQnIF0gIT09ICd1bmRlZmluZWQnICkge1xuXHRcdFx0Y29uc3QgY3VycmVudFBhZ2VJblBhcmFtcyA9IHBhcnNlSW50KCBwYXJhbXNbICdwYWdlZCcgXSApO1xuXG5cdFx0XHRpZiAoIGN1cnJlbnRQYWdlSW5QYXJhbXMgPiAxICkge1xuXHRcdFx0XHR1cmwgPSB1cmwucmVwbGFjZSggJ3BhZ2VkPScgKyBjdXJyZW50UGFnZUluUGFyYW1zLCAncGFnZWQ9MScgKTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHRyZXR1cm4gdXJsO1xuXHR9XG5cblx0Ly8gdXBkYXRlIHF1ZXJ5IHN0cmluZyBmb3IgY2F0ZWdvcmllcywgbWV0YSBldGMuLlxuXHRmdW5jdGlvbiB3Y2FwZlVwZGF0ZVF1ZXJ5U3RyaW5nUGFyYW1ldGVyKCBrZXksIHZhbHVlLCBwdXNoSGlzdG9yeSwgdXJsICkge1xuXHRcdGlmICggdHlwZW9mIHB1c2hIaXN0b3J5ID09PSAndW5kZWZpbmVkJyApIHtcblx0XHRcdHB1c2hIaXN0b3J5ID0gdHJ1ZTtcblx0XHR9XG5cblx0XHRpZiAoIHR5cGVvZiB1cmwgPT09ICd1bmRlZmluZWQnICkge1xuXHRcdFx0dXJsID0gd2NhcGZGaXhQYWdpbmF0aW9uKCk7XG5cdFx0fVxuXG5cdFx0Y29uc3QgcmUgICAgICAgID0gbmV3IFJlZ0V4cCggJyhbPyZdKScgKyBrZXkgKyAnPS4qPygmfCQpJywgJ2knICk7XG5cdFx0Y29uc3Qgc2VwYXJhdG9yID0gdXJsLmluZGV4T2YoICc/JyApICE9PSAtMSA/ICcmJyA6ICc/Jztcblx0XHRsZXQgdXJsV2l0aFF1ZXJ5O1xuXG5cdFx0aWYgKCB1cmwubWF0Y2goIHJlICkgKSB7XG5cdFx0XHR1cmxXaXRoUXVlcnkgPSB1cmwucmVwbGFjZSggcmUsICckMScgKyBrZXkgKyAnPScgKyB2YWx1ZSArICckMicgKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0dXJsV2l0aFF1ZXJ5ID0gdXJsICsgc2VwYXJhdG9yICsga2V5ICsgJz0nICsgdmFsdWU7XG5cdFx0fVxuXG5cdFx0aWYgKCBwdXNoSGlzdG9yeSA9PT0gdHJ1ZSApIHtcblx0XHRcdHJldHVybiBoaXN0b3J5LnB1c2hTdGF0ZSgge30sICcnLCB1cmxXaXRoUXVlcnkgKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0cmV0dXJuIHVybFdpdGhRdWVyeTtcblx0XHR9XG5cdH1cblxuXHQvLyByZW1vdmUgcGFyYW1ldGVyIGZyb20gdXJsXG5cdGZ1bmN0aW9uIHdjYXBmUmVtb3ZlUXVlcnlTdHJpbmdQYXJhbWV0ZXIoIGZpbHRlcktleSwgdXJsICkge1xuXHRcdGlmICggdHlwZW9mIHVybCA9PT0gJ3VuZGVmaW5lZCcgKSB7XG5cdFx0XHR1cmwgPSB3Y2FwZkZpeFBhZ2luYXRpb24oKTtcblx0XHR9XG5cblx0XHRjb25zdCBvbGRQYXJhbXMgICAgICAgICA9IHdjYXBmR2V0VXJsVmFycyggdXJsICk7XG5cdFx0Y29uc3Qgb2xkUGFyYW1zTGVuZ3RoICAgPSBPYmplY3Qua2V5cyggb2xkUGFyYW1zICkubGVuZ3RoO1xuXHRcdGNvbnN0IHN0YXJ0UG9zaXRpb24gICAgID0gdXJsLmluZGV4T2YoICc/JyApO1xuXHRcdGNvbnN0IGZpbHRlcktleVBvc2l0aW9uID0gdXJsLmluZGV4T2YoIGZpbHRlcktleSApO1xuXHRcdGxldCBjbGVhblVybCwgY2xlYW5RdWVyeTtcblxuXHRcdGlmICggb2xkUGFyYW1zTGVuZ3RoID4gMSApIHtcblx0XHRcdGlmICggKCBmaWx0ZXJLZXlQb3NpdGlvbiAtIHN0YXJ0UG9zaXRpb24gKSA+IDEgKSB7XG5cdFx0XHRcdGNsZWFuVXJsID0gdXJsLnJlcGxhY2UoICcmJyArIGZpbHRlcktleSArICc9JyArIG9sZFBhcmFtc1sgZmlsdGVyS2V5IF0sICcnICk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRjbGVhblVybCA9IHVybC5yZXBsYWNlKCBmaWx0ZXJLZXkgKyAnPScgKyBvbGRQYXJhbXNbIGZpbHRlcktleSBdICsgJyYnLCAnJyApO1xuXHRcdFx0fVxuXG5cdFx0XHRjb25zdCBuZXdQYXJhbXMgPSBjbGVhblVybC5zcGxpdCggJz8nICk7XG5cdFx0XHRjbGVhblF1ZXJ5ICAgICAgPSAnPycgKyBuZXdQYXJhbXNbIDEgXTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0Y2xlYW5RdWVyeSA9IHVybC5yZXBsYWNlKCAnPycgKyBmaWx0ZXJLZXkgKyAnPScgKyBvbGRQYXJhbXNbIGZpbHRlcktleSBdLCAnJyApO1xuXHRcdH1cblxuXHRcdHJldHVybiBjbGVhblF1ZXJ5O1xuXHR9XG5cblx0Ly8gdGFrZSB0aGUga2V5IGFuZCB2YWx1ZSBhbmQgbWFrZSBxdWVyeVxuXHRmdW5jdGlvbiB3Y2FwZk1ha2VQYXJhbWV0ZXJzKCBmaWx0ZXJLZXksIGZpbHRlclZhbHVlLCBmb3JjZVJlcmVuZGVyID0gZmFsc2UsIHVybCApIHtcblx0XHRjb25zdCB2YWx1ZVNlcGFyYXRvciA9ICcsJztcblxuXHRcdGxldCBwYXJhbXMsIG5leHRWYWx1ZXMsIGVtcHR5VmFsdWUgPSBmYWxzZTtcblxuXHRcdGlmICggdHlwZW9mIHVybCAhPT0gJ3VuZGVmaW5lZCcgKSB7XG5cdFx0XHRwYXJhbXMgPSB3Y2FwZkdldFVybFZhcnMoIHVybCApO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRwYXJhbXMgPSB3Y2FwZkdldFVybFZhcnMoKTtcblx0XHR9XG5cblx0XHRpZiAoIHR5cGVvZiBwYXJhbXNbIGZpbHRlcktleSBdICE9ICd1bmRlZmluZWQnICkge1xuXHRcdFx0Y29uc3QgcHJldlZhbHVlcyAgICAgID0gcGFyYW1zWyBmaWx0ZXJLZXkgXTtcblx0XHRcdGNvbnN0IHByZXZWYWx1ZXNBcnJheSA9IHByZXZWYWx1ZXMuc3BsaXQoIHZhbHVlU2VwYXJhdG9yICk7XG5cblx0XHRcdGlmICggcHJldlZhbHVlcy5sZW5ndGggPiAwICkge1xuXHRcdFx0XHRjb25zdCBmb3VuZCA9ICQuaW5BcnJheSggZmlsdGVyVmFsdWUsIHByZXZWYWx1ZXNBcnJheSApO1xuXG5cdFx0XHRcdGlmICggZm91bmQgPj0gMCApIHtcblx0XHRcdFx0XHQvLyBFbGVtZW50IHdhcyBmb3VuZCwgcmVtb3ZlIGl0LlxuXHRcdFx0XHRcdHByZXZWYWx1ZXNBcnJheS5zcGxpY2UoIGZvdW5kLCAxICk7XG5cblx0XHRcdFx0XHRpZiAoIHByZXZWYWx1ZXNBcnJheS5sZW5ndGggPT09IDAgKSB7XG5cdFx0XHRcdFx0XHRlbXB0eVZhbHVlID0gdHJ1ZTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0Ly8gRWxlbWVudCB3YXMgbm90IGZvdW5kLCBhZGQgaXQuXG5cdFx0XHRcdFx0cHJldlZhbHVlc0FycmF5LnB1c2goIGZpbHRlclZhbHVlICk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRpZiAoIHByZXZWYWx1ZXNBcnJheS5sZW5ndGggPiAxICkge1xuXHRcdFx0XHRcdG5leHRWYWx1ZXMgPSBwcmV2VmFsdWVzQXJyYXkuam9pbiggdmFsdWVTZXBhcmF0b3IgKTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRuZXh0VmFsdWVzID0gcHJldlZhbHVlc0FycmF5O1xuXHRcdFx0XHR9XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRuZXh0VmFsdWVzID0gZmlsdGVyVmFsdWU7XG5cdFx0XHR9XG5cdFx0fSBlbHNlIHtcblx0XHRcdG5leHRWYWx1ZXMgPSBmaWx0ZXJWYWx1ZTtcblx0XHR9XG5cblx0XHQvLyB1cGRhdGUgdXJsIGFuZCBxdWVyeSBzdHJpbmdcblx0XHRpZiAoICEgZW1wdHlWYWx1ZSApIHtcblx0XHRcdHdjYXBmVXBkYXRlUXVlcnlTdHJpbmdQYXJhbWV0ZXIoIGZpbHRlcktleSwgbmV4dFZhbHVlcyApO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRjb25zdCBxdWVyeSA9IHdjYXBmUmVtb3ZlUXVlcnlTdHJpbmdQYXJhbWV0ZXIoIGZpbHRlcktleSApO1xuXHRcdFx0aGlzdG9yeS5wdXNoU3RhdGUoIHt9LCAnJywgcXVlcnkgKTtcblx0XHR9XG5cblx0XHR3Y2FwZkZpbHRlclByb2R1Y3RzKCBmb3JjZVJlcmVuZGVyICk7XG5cdH1cblxuXHRmdW5jdGlvbiB3Y2FwZlNpbmdsZUZpbHRlciggZmlsdGVyS2V5LCBmaWx0ZXJWYWx1ZSApIHtcblx0XHRjb25zdCBwYXJhbXMgPSB3Y2FwZkdldFVybFZhcnMoKTtcblx0XHRsZXQgcXVlcnk7XG5cblx0XHRpZiAoIHR5cGVvZiBwYXJhbXNbIGZpbHRlcktleSBdICE9PSAndW5kZWZpbmVkJyAmJiBwYXJhbXNbIGZpbHRlcktleSBdID09PSBmaWx0ZXJWYWx1ZSApIHtcblx0XHRcdHF1ZXJ5ID0gd2NhcGZSZW1vdmVRdWVyeVN0cmluZ1BhcmFtZXRlciggZmlsdGVyS2V5ICk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHF1ZXJ5ID0gd2NhcGZVcGRhdGVRdWVyeVN0cmluZ1BhcmFtZXRlciggZmlsdGVyS2V5LCBmaWx0ZXJWYWx1ZSwgZmFsc2UgKTtcblx0XHR9XG5cblx0XHQvLyB1cGRhdGUgdXJsXG5cdFx0aGlzdG9yeS5wdXNoU3RhdGUoIHt9LCAnJywgcXVlcnkgKTtcblxuXHRcdHdjYXBmRmlsdGVyUHJvZHVjdHMoKTtcblx0fVxuXG5cdC8vIFRoZSBmdW5jdGlvbiB0byBoYW5kbGUgdGhlIGNvbW1vbiBmaWx0ZXIgcmVxdWVzdHMuXG5cdGZ1bmN0aW9uIGhhbmRsZUZpbHRlclJlcXVlc3QoICRpdGVtLCBmaWx0ZXJWYWx1ZSApIHtcblx0XHRjb25zdCAkZmllbGQgICAgICAgICA9ICRpdGVtLmNsb3Nlc3QoICcud2NhcGYtc2luZ2xlLWZpbHRlcicgKTtcblx0XHRjb25zdCBmaWVsZElEICAgICAgICA9ICRmaWVsZC5hdHRyKCAnZGF0YS1pZCcgKTtcblx0XHRjb25zdCBmaWVsZERhdGEgICAgICA9IGZpZWxkc1sgZmllbGRJRCBdO1xuXHRcdGNvbnN0IGZpbHRlcktleSAgICAgID0gZmllbGREYXRhLmZpbHRlcktleTtcblx0XHRjb25zdCBtdWx0aXBsZUZpbHRlciA9IGZpZWxkRGF0YS5tdWx0aXBsZUZpbHRlcjtcblxuXHRcdGlmICggISBmaWx0ZXJLZXkgKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0aWYgKCAhIGZpbHRlclZhbHVlLmxlbmd0aCApIHtcblx0XHRcdGNvbnN0IHF1ZXJ5ID0gd2NhcGZSZW1vdmVRdWVyeVN0cmluZ1BhcmFtZXRlciggZmlsdGVyS2V5ICk7XG5cdFx0XHRoaXN0b3J5LnB1c2hTdGF0ZSgge30sICcnLCBxdWVyeSApO1xuXG5cdFx0XHR3Y2FwZkZpbHRlclByb2R1Y3RzKCk7XG5cblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHRpZiAoIG11bHRpcGxlRmlsdGVyICkge1xuXHRcdFx0d2NhcGZNYWtlUGFyYW1ldGVycyggZmlsdGVyS2V5LCBmaWx0ZXJWYWx1ZSApO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHR3Y2FwZlNpbmdsZUZpbHRlciggZmlsdGVyS2V5LCBmaWx0ZXJWYWx1ZSApO1xuXHRcdH1cblx0fVxuXG5cdC8vIEhhbmRsZSB0aGUgZmlsdGVyIHJlcXVlc3QgZm9yIGxpc3QgZmllbGQuXG5cdCR3Y2FwZk5hdkZpbHRlcnMub24oXG5cdFx0J2NoYW5nZScsXG5cdFx0Jy53Y2FwZi1sYXllcmVkLW5hdiBbdHlwZT1cImNoZWNrYm94XCJdLCAud2NhcGYtbGF5ZXJlZC1uYXYgW3R5cGU9XCJyYWRpb1wiXScsXG5cdFx0ZnVuY3Rpb24oIGV2ZW50ICkge1xuXHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcblxuXHRcdFx0Y29uc3QgJGl0ZW0gICAgICAgPSAkKCB0aGlzICk7XG5cdFx0XHRjb25zdCBmaWx0ZXJWYWx1ZSA9ICRpdGVtLnZhbCgpO1xuXG5cdFx0XHRoYW5kbGVGaWx0ZXJSZXF1ZXN0KCAkaXRlbSwgZmlsdGVyVmFsdWUgKTtcblx0XHR9XG5cdCk7XG5cblx0Ly8gSGFuZGxlIHRoZSBmaWx0ZXIgcmVxdWVzdCBmb3IgbGFiZWxlZCBpdGVtLlxuXHQkd2NhcGZOYXZGaWx0ZXJzLm9uKCAnY2xpY2snLCAnLndjYXBmLWxhYmVsZWQtbmF2IC5pdGVtJywgZnVuY3Rpb24oIGV2ZW50ICkge1xuXHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cblx0XHRjb25zdCAkaXRlbSAgICAgICA9ICQoIHRoaXMgKTtcblx0XHRjb25zdCBmaWx0ZXJWYWx1ZSA9ICRpdGVtLmF0dHIoICdkYXRhLXZhbHVlJyApO1xuXG5cdFx0aGFuZGxlRmlsdGVyUmVxdWVzdCggJGl0ZW0sIGZpbHRlclZhbHVlICk7XG5cdH0gKTtcblxuXHQvLyBIYW5kbGUgdGhlIGZpbHRlciByZXF1ZXN0IGZvciBkaXNwbGF5IHR5cGUgc2VsZWN0IGZpZWxkcy5cblx0JHdjYXBmTmF2RmlsdGVycy5vbiggJ2NoYW5nZScsICdzZWxlY3QnLCBmdW5jdGlvbiggZXZlbnQgKSB7XG5cdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcblxuXHRcdGNvbnN0ICRpdGVtICAgICAgID0gJCggdGhpcyApO1xuXHRcdGNvbnN0IGZpbHRlclZhbHVlID0gJGl0ZW0udmFsKCk7XG5cblx0XHRjb25zdCAkZmllbGQgICAgPSAkaXRlbS5jbG9zZXN0KCAnLndjYXBmLXNpbmdsZS1maWx0ZXInICk7XG5cdFx0Y29uc3QgZmllbGRJRCAgID0gJGZpZWxkLmF0dHIoICdkYXRhLWlkJyApO1xuXHRcdGNvbnN0IGZpZWxkRGF0YSA9IGZpZWxkc1sgZmllbGRJRCBdO1xuXHRcdGNvbnN0IGZpbHRlcktleSA9IGZpZWxkRGF0YS5maWx0ZXJLZXk7XG5cblx0XHRpZiAoICEgZmlsdGVyVmFsdWUubGVuZ3RoICkge1xuXHRcdFx0Y29uc3QgcXVlcnkgPSB3Y2FwZlJlbW92ZVF1ZXJ5U3RyaW5nUGFyYW1ldGVyKCBmaWx0ZXJLZXkgKTtcblx0XHRcdGhpc3RvcnkucHVzaFN0YXRlKCB7fSwgJycsIHF1ZXJ5ICk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdGNvbnN0IGZpbHRlclZhbFN0cmluZyA9IGZpbHRlclZhbHVlLnRvU3RyaW5nKCk7XG5cdFx0XHR3Y2FwZlVwZGF0ZVF1ZXJ5U3RyaW5nUGFyYW1ldGVyKCBmaWx0ZXJLZXksIGZpbHRlclZhbFN0cmluZyApO1xuXHRcdH1cblxuXHRcdHdjYXBmRmlsdGVyUHJvZHVjdHMoKTtcblx0fSApO1xuXG5cdC8qKlxuXHQgKiBIYW5kbGUgdGhlIGZpbHRlciByZXF1ZXN0IGZvciByYW5nZSBudW1iZXIuXG5cdCAqL1xuXHRjb25zdCByYW5nZU51bWJlclNlbGVjdG9ycyA9ICcud2NhcGYtcmFuZ2UtbnVtYmVyIC5taW4tdmFsdWUsIC53Y2FwZi1yYW5nZS1udW1iZXIgLm1heC12YWx1ZSc7XG5cblx0JHdjYXBmTnVtYmVyUmFuZ2VGaWx0ZXJzLm9uKCAnaW5wdXQnLCByYW5nZU51bWJlclNlbGVjdG9ycywgZnVuY3Rpb24oIGV2ZW50ICkge1xuXHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cblx0XHRjb25zdCAkaXRlbSA9ICQoIHRoaXMgKTtcblxuXHRcdC8vIENsZWFyIGFueSBwcmV2aW91c2x5IHNldCB0aW1lciBiZWZvcmUgc2V0dGluZyBhIGZyZXNoIG9uZVxuXHRcdGNsZWFyVGltZW91dCggJGl0ZW0uZGF0YSggJ3RpbWVyJyApICk7XG5cblx0XHQkaXRlbS5kYXRhKCAndGltZXInLCBzZXRUaW1lb3V0KCBmdW5jdGlvbigpIHtcblx0XHRcdCRpdGVtLnJlbW92ZURhdGEoICd0aW1lcicgKTtcblxuXHRcdFx0Y29uc3QgJHJhbmdlTnVtYmVyICA9ICRpdGVtLmNsb3Nlc3QoICcud2NhcGYtcmFuZ2UtbnVtYmVyJyApO1xuXHRcdFx0Y29uc3QgZmlsdGVyS2V5ICAgICA9ICRyYW5nZU51bWJlci5hdHRyKCAnZGF0YS1maWx0ZXIta2V5JyApO1xuXHRcdFx0Y29uc3QgcmFuZ2VNaW5WYWx1ZSA9ICRyYW5nZU51bWJlci5hdHRyKCAnZGF0YS1yYW5nZS1taW4tdmFsdWUnICk7XG5cdFx0XHRjb25zdCByYW5nZU1heFZhbHVlID0gJHJhbmdlTnVtYmVyLmF0dHIoICdkYXRhLXJhbmdlLW1heC12YWx1ZScgKTtcblx0XHRcdGxldCBtaW5WYWx1ZSAgICAgICAgPSAkcmFuZ2VOdW1iZXIuZmluZCggJy5taW4tdmFsdWUnICkudmFsKCk7XG5cdFx0XHRsZXQgbWF4VmFsdWUgICAgICAgID0gJHJhbmdlTnVtYmVyLmZpbmQoICcubWF4LXZhbHVlJyApLnZhbCgpO1xuXG5cdFx0XHQvLyBGb3JjZSB0aGUgbWluVmFsdWUgbm90IHRvIGJlIGVtcHR5LlxuXHRcdFx0aWYgKCAhIG1pblZhbHVlLmxlbmd0aCApIHtcblx0XHRcdFx0bWluVmFsdWUgPSByYW5nZU1pblZhbHVlO1xuXG5cdFx0XHRcdCRyYW5nZU51bWJlci5maW5kKCAnLm1pbi12YWx1ZScgKS52YWwoIG1pblZhbHVlICk7XG5cdFx0XHR9XG5cblx0XHRcdC8vIEZvcmNlIHRoZSBtYXhWYWx1ZSBub3QgdG8gYmUgZW1wdHkuXG5cdFx0XHRpZiAoICEgbWF4VmFsdWUubGVuZ3RoICkge1xuXHRcdFx0XHRtYXhWYWx1ZSA9IHJhbmdlTWF4VmFsdWU7XG5cblx0XHRcdFx0JHJhbmdlTnVtYmVyLmZpbmQoICcubWF4LXZhbHVlJyApLnZhbCggbWF4VmFsdWUgKTtcblx0XHRcdH1cblxuXHRcdFx0Ly8gRm9yY2UgdGhlIG1pblZhbHVlIG5vdCB0byBnbyBiZWxvdyB0aGUgcmFuZ2VNaW5WYWx1ZS5cblx0XHRcdGlmICggcGFyc2VGbG9hdCggbWluVmFsdWUgKSA8IHBhcnNlRmxvYXQoIHJhbmdlTWluVmFsdWUgKSApIHtcblx0XHRcdFx0bWluVmFsdWUgPSByYW5nZU1pblZhbHVlO1xuXG5cdFx0XHRcdCRyYW5nZU51bWJlci5maW5kKCAnLm1pbi12YWx1ZScgKS52YWwoIG1pblZhbHVlICk7XG5cdFx0XHR9XG5cblx0XHRcdC8vIEZvcmNlIHRoZSBtaW5WYWx1ZSBub3QgdG8gZ28gdXAgdGhlIHJhbmdlTWF4VmFsdWUuXG5cdFx0XHRpZiAoIHBhcnNlRmxvYXQoIG1pblZhbHVlICkgPiBwYXJzZUZsb2F0KCByYW5nZU1heFZhbHVlICkgKSB7XG5cdFx0XHRcdG1pblZhbHVlID0gcmFuZ2VNYXhWYWx1ZTtcblxuXHRcdFx0XHQkcmFuZ2VOdW1iZXIuZmluZCggJy5taW4tdmFsdWUnICkudmFsKCBtaW5WYWx1ZSApO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBGb3JjZSB0aGUgbWF4VmFsdWUgbm90IHRvIGdvIHVwIHRoZSByYW5nZU1heFZhbHVlLlxuXHRcdFx0aWYgKCBwYXJzZUZsb2F0KCBtYXhWYWx1ZSApID4gcGFyc2VGbG9hdCggcmFuZ2VNYXhWYWx1ZSApICkge1xuXHRcdFx0XHRtYXhWYWx1ZSA9IHJhbmdlTWF4VmFsdWU7XG5cblx0XHRcdFx0JHJhbmdlTnVtYmVyLmZpbmQoICcubWF4LXZhbHVlJyApLnZhbCggbWF4VmFsdWUgKTtcblx0XHRcdH1cblxuXHRcdFx0Ly8gRm9yY2UgdGhlIG1heFZhbHVlIG5vdCB0byBnbyBiZWxvdyB0aGUgbWluVmFsdWUuXG5cdFx0XHRpZiAoIHBhcnNlRmxvYXQoIG1pblZhbHVlICkgPiBwYXJzZUZsb2F0KCBtYXhWYWx1ZSApICkge1xuXHRcdFx0XHRtYXhWYWx1ZSA9IG1pblZhbHVlO1xuXG5cdFx0XHRcdCRyYW5nZU51bWJlci5maW5kKCAnLm1heC12YWx1ZScgKS52YWwoIG1heFZhbHVlICk7XG5cdFx0XHR9XG5cblx0XHRcdGlmICggbWluVmFsdWUgPT09IHJhbmdlTWluVmFsdWUgJiYgbWF4VmFsdWUgPT09IHJhbmdlTWF4VmFsdWUgKSB7XG5cdFx0XHRcdGNvbnN0IHF1ZXJ5ID0gd2NhcGZSZW1vdmVRdWVyeVN0cmluZ1BhcmFtZXRlciggZmlsdGVyS2V5ICk7XG5cdFx0XHRcdGhpc3RvcnkucHVzaFN0YXRlKCB7fSwgJycsIHF1ZXJ5ICk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRjb25zdCBmaWx0ZXJWYWxTdHJpbmcgPSBtaW5WYWx1ZSArIHJhbmdlVmFsdWVzU2VwYXJhdG9yICsgbWF4VmFsdWU7XG5cdFx0XHRcdHdjYXBmVXBkYXRlUXVlcnlTdHJpbmdQYXJhbWV0ZXIoIGZpbHRlcktleSwgZmlsdGVyVmFsU3RyaW5nICk7XG5cdFx0XHR9XG5cblx0XHRcdHdjYXBmRmlsdGVyUHJvZHVjdHMoKTtcblx0XHR9LCBkZWxheSApICk7XG5cdH0gKTtcblxuXHQvLyBIYW5kbGUgcmVtb3ZpbmcgdGhlIGFjdGl2ZSBmaWx0ZXJzLlxuXHQkd2NhcGZOYXZGaWx0ZXJzLm9uKCAnY2xpY2snLCAnLndjYXBmLWFjdGl2ZS1maWx0ZXJzIC5pdGVtJywgZnVuY3Rpb24oIGV2ZW50ICkge1xuXHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cblx0XHRjb25zdCAkaXRlbSAgICAgICA9ICQoIHRoaXMgKTtcblx0XHRjb25zdCBmaWx0ZXJLZXkgICA9ICRpdGVtLmF0dHIoICdkYXRhLWZpbHRlci1rZXknICk7XG5cdFx0Y29uc3QgZmlsdGVyVmFsdWUgPSAkaXRlbS5hdHRyKCAnZGF0YS12YWx1ZScgKTtcblxuXHRcdHdjYXBmTWFrZVBhcmFtZXRlcnMoIGZpbHRlcktleSwgZmlsdGVyVmFsdWUsIHRydWUgKTtcblx0fSApO1xuXG5cdGZ1bmN0aW9uIHJlc2V0RmlsdGVycyggJGJ1dHRvbiApIHtcblx0XHRjb25zdCBfZmlsdGVyS2V5cyA9ICRidXR0b24uYXR0ciggJ2RhdGEta2V5cycgKTtcblxuXHRcdGlmICggISBfZmlsdGVyS2V5cyApIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHRjb25zdCBmaWx0ZXJLZXlzID0gX2ZpbHRlcktleXMuc3BsaXQoICcsJyApO1xuXG5cdFx0bGV0IHF1ZXJ5ID0gJyc7XG5cblx0XHQkLmVhY2goIGZpbHRlcktleXMsIGZ1bmN0aW9uKCBpLCBmaWx0ZXJLZXkgKSB7XG5cdFx0XHRpZiAoIHF1ZXJ5ICkge1xuXHRcdFx0XHRxdWVyeSA9IHdjYXBmUmVtb3ZlUXVlcnlTdHJpbmdQYXJhbWV0ZXIoIGZpbHRlcktleSwgcXVlcnkgKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHF1ZXJ5ID0gd2NhcGZSZW1vdmVRdWVyeVN0cmluZ1BhcmFtZXRlciggZmlsdGVyS2V5ICk7XG5cdFx0XHR9XG5cdFx0fSApO1xuXG5cdFx0Ly8gRW1wdHkgcXVlcnkgY2F1c2VzIGlzc3VlKGRvZXNuJ3QgcmVtb3ZlIHRoZSBmaWx0ZXIga2V5cyBmcm9tIHRoZSB1cmwpLFxuXHRcdC8vIHRoaXMgaXMgd2h5IHdlIGFyZSBzZXR0aW5nIHRoZSBwYWdlIHVybCBhcyBxdWVyeS5cblx0XHRpZiAoICEgcXVlcnkgKSB7XG5cdFx0XHRjb25zdCBwcmV2VXJsID0gd2luZG93LmxvY2F0aW9uLmhyZWY7XG5cdFx0XHRjb25zdCBuZXdVcmwgID0gcHJldlVybC5zcGxpdCggJz8nICk7XG5cblx0XHRcdHF1ZXJ5ID0gbmV3VXJsWyAwIF07XG5cdFx0fVxuXG5cdFx0aGlzdG9yeS5wdXNoU3RhdGUoIHt9LCAnJywgcXVlcnkgKTtcblxuXHRcdHdjYXBmRmlsdGVyUHJvZHVjdHMoIHRydWUgKTtcblx0fVxuXG5cdC8vIENsZWFyL1Jlc2V0IGFsbCBmaWx0ZXJzLlxuXHQkYm9keS5vbiggJ3djYXBmLXJlc2V0LWZpbHRlcnMnLCBmdW5jdGlvbiggZSwgJGJ1dHRvbiApIHtcblx0XHRyZXNldEZpbHRlcnMoICRidXR0b24gKTtcblx0fSApO1xuXG5cdCR3Y2FwZk5hdkZpbHRlcnMub24oICdjbGljaycsICcud2NhcGYtcmVzZXQtZmlsdGVycy1idG4nLCBmdW5jdGlvbiggZXZlbnQgKSB7XG5cdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcblxuXHRcdGNvbnN0ICRidXR0b24gPSAkKCB0aGlzICk7XG5cblx0XHQkYm9keS50cmlnZ2VyKCAnd2NhcGYtcmVzZXQtZmlsdGVycycsIFsgJGJ1dHRvbiBdICk7XG5cdH0gKTtcblxuXHQkd2NhcGZTaW5nbGVGaWx0ZXJzLm9uKCAnd2NhcGYtY2xlYXItZmlsdGVyJywgZnVuY3Rpb24oKSB7XG5cdFx0Y29uc3QgJGZpZWxkICAgID0gJCggdGhpcyApO1xuXHRcdGNvbnN0IGZpZWxkSUQgICA9ICRmaWVsZC5hdHRyKCAnZGF0YS1pZCcgKTtcblx0XHRjb25zdCBmaWVsZERhdGEgPSBmaWVsZHNbIGZpZWxkSUQgXTtcblx0XHRjb25zdCBmaWx0ZXJLZXkgPSBmaWVsZERhdGEuZmlsdGVyS2V5O1xuXG5cdFx0Y29uc3QgcXVlcnkgPSB3Y2FwZlJlbW92ZVF1ZXJ5U3RyaW5nUGFyYW1ldGVyKCBmaWx0ZXJLZXkgKTtcblx0XHRoaXN0b3J5LnB1c2hTdGF0ZSgge30sICcnLCBxdWVyeSApO1xuXG5cdFx0d2NhcGZGaWx0ZXJQcm9kdWN0cyggdHJ1ZSApO1xuXHR9ICk7XG5cblx0JGJvZHkub24oICd3Y2FwZi1ydW4tZmlsdGVyLXByb2R1Y3RzJywgZnVuY3Rpb24oIGUsIGZvcmNlUmVSZW5kZXIgKSB7XG5cdFx0d2NhcGZGaWx0ZXJQcm9kdWN0cyggZm9yY2VSZVJlbmRlciApO1xuXHR9ICk7XG5cblx0Ly8gSGlzdG9yeSBiYWNrIGFuZCBmb3J3YXJkIHJlcXVlc3QgaGFuZGxpbmcuXG5cdCQoIHdpbmRvdyApLmJpbmQoICdwb3BzdGF0ZScsIGZ1bmN0aW9uKCkge1xuXHRcdHdjYXBmRmlsdGVyUHJvZHVjdHMoIHRydWUgKTtcblx0fSApO1xuXG59ICk7XG4iXX0=
