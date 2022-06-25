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
  'show_results_loading': '',
  'scroll_to_top_speed': '',
  'scroll_to_top_easing': '',
  'shop_loop_container': '',
  'not_found_container': '',
  'pagination_container': '',
  // todo
  'sorting_control': '',
  // todo
  'scroll_to_top': '',
  'scroll_to_top_offset': '',
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
    var container;

    if ($(wcapf_params.shop_loop_container.length)) {
      container = wcapf_params.shop_loop_container;
    } else if ($(wcapf_params.not_found_container).length) {
      container = wcapf_params.not_found_container;
    } // Show loading image.


    if (wcapf_params.show_results_loading) {
      var loadingMarkup = '<div class="wcapf-shop-loop-loading"></div>';
      $(loadingMarkup).prependTo(container);
    } // Scroll to top.


    if (wcapf_params.scroll_to_top) {
      var adjustingOffset, offset;

      if (wcapf_params.scroll_to_top_offset) {
        adjustingOffset = parseInt(wcapf_params.scroll_to_top_offset);
      }

      var $container = $(container);

      if ($container.length) {
        offset = $container.offset().top - adjustingOffset;

        if (offset < 0) {
          offset = 0;
        }

        $('html, body').stop().animate({
          scrollTop: offset
        }, wcapf_params.scroll_to_top_speed, wcapf_params.scroll_to_top_easing);
      }
    }
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

        $field.trigger('wcapf-field-updated', [_field]);
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImZpbHRlci1mb3JtLmpzIl0sIm5hbWVzIjpbIndjYXBmX3BhcmFtcyIsImpRdWVyeSIsImRvY3VtZW50IiwicmVhZHkiLCIkIiwiJGJvZHkiLCJyYW5nZVZhbHVlc1NlcGFyYXRvciIsIl9kZWxheSIsInBhcnNlSW50IiwiZmlsdGVyX2lucHV0X2RlbGF5IiwiZGVsYXkiLCJmaWVsZHMiLCIkd2NhcGZTaW5nbGVGaWx0ZXJzIiwiJHdjYXBmTmF2RmlsdGVycyIsIiR3Y2FwZk51bWJlclJhbmdlRmlsdGVycyIsImVhY2giLCIkZmllbGQiLCJpZCIsImF0dHIiLCIkd3JhcHBlciIsImZpbmQiLCJmaWx0ZXJLZXkiLCJtdWx0aXBsZUZpbHRlciIsImluaXRDaG9zZW4iLCJjaG9zZW4iLCIkdGhpcyIsIm9wdGlvbnMiLCJub1Jlc3VsdHNNZXNzYWdlIiwic2VhcmNoVGhyZXNob2xkIiwiY2hvc2VuX2xpYl9zZWFyY2hfdGhyZXNob2xkIiwiaW5pdEhpZXJhcmNoeUFjY29yZGlvbiIsIm9uIiwiJGNoaWxkIiwicGFyZW50IiwiY2hpbGRyZW4iLCJ0b2dnbGVDbGFzcyIsImVuYWJsZV9hbmltYXRpb25fZm9yX2hpZXJhcmNoeV9hY2NvcmRpb24iLCJzbGlkZVRvZ2dsZSIsInRvZ2dsZSIsIm51bWJlcl9mb3JtYXQiLCJudW1iZXIiLCJkZWNpbWFscyIsImRlY19wb2ludCIsInRob3VzYW5kc19zZXAiLCJyZXBsYWNlIiwibiIsImlzRmluaXRlIiwicHJlYyIsIk1hdGgiLCJhYnMiLCJzZXAiLCJkZWMiLCJzIiwidG9GaXhlZEZpeCIsImsiLCJwb3ciLCJyb3VuZCIsInNwbGl0IiwibGVuZ3RoIiwiQXJyYXkiLCJqb2luIiwiaW5pdE5vVUlTbGlkZXIiLCJub1VpU2xpZGVyIiwiJGl0ZW0iLCIkc2xpZGVyIiwiaGFzQ2xhc3MiLCJzbGlkZXJJZCIsImRpc3BsYXlWYWx1ZXNBcyIsInJhbmdlTWluVmFsdWUiLCJwYXJzZUZsb2F0IiwicmFuZ2VNYXhWYWx1ZSIsInN0ZXAiLCJkZWNpbWFsUGxhY2VzIiwidGhvdXNhbmRTZXBhcmF0b3IiLCJkZWNpbWFsU2VwYXJhdG9yIiwibWluVmFsdWUiLCJtYXhWYWx1ZSIsIiRtaW5WYWx1ZSIsIiRtYXhWYWx1ZSIsInNsaWRlciIsImdldEVsZW1lbnRCeUlkIiwiY3JlYXRlIiwic3RhcnQiLCJjb25uZWN0IiwiY3NzUHJlZml4IiwicmFuZ2UiLCJ2YWx1ZXMiLCJodG1sIiwidmFsIiwidHJpZ2dlciIsImZpbHRlclByb2R1Y3RzQWNjb3JkaW5nVG9TbGlkZXIiLCJxdWVyeSIsIndjYXBmUmVtb3ZlUXVlcnlTdHJpbmdQYXJhbWV0ZXIiLCJoaXN0b3J5IiwicHVzaFN0YXRlIiwiZmlsdGVyVmFsU3RyaW5nIiwid2NhcGZVcGRhdGVRdWVyeVN0cmluZ1BhcmFtZXRlciIsIndjYXBmRmlsdGVyUHJvZHVjdHMiLCJjbGVhclRpbWVvdXQiLCJkYXRhIiwic2V0VGltZW91dCIsInJlbW92ZURhdGEiLCJldmVudCIsInByZXZlbnREZWZhdWx0IiwiJGlucHV0Iiwic2V0IiwiZ2V0IiwiZmlsdGVyQnlEYXRlIiwiJHdjYXBmRGF0ZUZpbHRlciIsImNsb3Nlc3QiLCJpc1JhbmdlIiwiZmlsdGVyVmFsdWUiLCJydW5GaWx0ZXIiLCJmcm9tIiwidG8iLCJpbml0RGF0ZXBpY2tlciIsImRhdGVwaWNrZXIiLCIkd2NhcGZEYXRlRmlsdGVycyIsImZvcm1hdCIsInllYXJEcm9wZG93biIsIm1vbnRoRHJvcGRvd24iLCIkZnJvbSIsIiR0byIsImRhdGVGb3JtYXQiLCJjaGFuZ2VZZWFyIiwiY2hhbmdlTW9udGgiLCJ3Y2FwZkJlZm9yZVVwZGF0ZSIsImNvbnRhaW5lciIsInNob3BfbG9vcF9jb250YWluZXIiLCJub3RfZm91bmRfY29udGFpbmVyIiwic2hvd19yZXN1bHRzX2xvYWRpbmciLCJsb2FkaW5nTWFya3VwIiwicHJlcGVuZFRvIiwic2Nyb2xsX3RvX3RvcCIsImFkanVzdGluZ09mZnNldCIsIm9mZnNldCIsInNjcm9sbF90b190b3Bfb2Zmc2V0IiwiJGNvbnRhaW5lciIsInRvcCIsInN0b3AiLCJhbmltYXRlIiwic2Nyb2xsVG9wIiwic2Nyb2xsX3RvX3RvcF9zcGVlZCIsInNjcm9sbF90b190b3BfZWFzaW5nIiwid2NhcGZBZnRlclVwZGF0ZSIsImZvcmNlUmVSZW5kZXIiLCJ3aW5kb3ciLCJsb2NhdGlvbiIsImhyZWYiLCIkZGF0YSIsImZpZWxkSUQiLCIkaW5uZXIiLCJfZmllbGQiLCJmaWVsZENsYXNzIiwicHJlc2VydmVfaGllcmFyY2h5X2FjY29yZGlvbl9zdGF0ZSIsIml0ZW1WYWx1ZSIsInRvZ2dsZVNlbGVjdG9yIiwidWxTZWxlY3RvciIsIl9jbGFzc2VzIiwic2hvdyIsIl9odG1sIiwiJHNob3BMb29wQ29udGFpbmVyIiwiJG5vdEZvdW5kQ29udGFpbmVyIiwiY3VzdG9tX3NjcmlwdHMiLCJldmFsIiwid2NhcGZHZXRVcmxWYXJzIiwidXJsIiwidmFycyIsImhhc2giLCJyZXBsYWNlQWxsIiwiaGFzaGVzIiwic2xpY2UiLCJpbmRleE9mIiwiaExlbmd0aCIsImkiLCJ3Y2FwZkZpeFBhZ2luYXRpb24iLCJwYXJhbXMiLCJjdXJyZW50UGFnZUluVXJsIiwiY3VycmVudFBhZ2VJblBhcmFtcyIsImtleSIsInZhbHVlIiwicHVzaEhpc3RvcnkiLCJyZSIsIlJlZ0V4cCIsInNlcGFyYXRvciIsInVybFdpdGhRdWVyeSIsIm1hdGNoIiwib2xkUGFyYW1zIiwib2xkUGFyYW1zTGVuZ3RoIiwiT2JqZWN0Iiwia2V5cyIsInN0YXJ0UG9zaXRpb24iLCJmaWx0ZXJLZXlQb3NpdGlvbiIsImNsZWFuVXJsIiwiY2xlYW5RdWVyeSIsIm5ld1BhcmFtcyIsIndjYXBmTWFrZVBhcmFtZXRlcnMiLCJmb3JjZVJlcmVuZGVyIiwidmFsdWVTZXBhcmF0b3IiLCJuZXh0VmFsdWVzIiwiZW1wdHlWYWx1ZSIsInByZXZWYWx1ZXMiLCJwcmV2VmFsdWVzQXJyYXkiLCJmb3VuZCIsImluQXJyYXkiLCJzcGxpY2UiLCJwdXNoIiwid2NhcGZTaW5nbGVGaWx0ZXIiLCJoYW5kbGVGaWx0ZXJSZXF1ZXN0IiwiZmllbGREYXRhIiwidG9TdHJpbmciLCJyYW5nZU51bWJlclNlbGVjdG9ycyIsIiRyYW5nZU51bWJlciIsInJlc2V0RmlsdGVycyIsIiRidXR0b24iLCJfZmlsdGVyS2V5cyIsImZpbHRlcktleXMiLCJwcmV2VXJsIiwibmV3VXJsIiwiZSIsImJpbmQiXSwibWFwcGluZ3MiOiI7O0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBLElBQU1BLFlBQVksR0FBR0EsWUFBWSxJQUFJO0FBQ3BDLHdCQUFzQixFQURjO0FBRXBDLGlDQUErQixFQUZLO0FBR3BDLHdDQUFzQyxFQUhGO0FBSXBDLDhDQUE0QyxFQUpSO0FBS3BDLDBCQUF3QixFQUxZO0FBTXBDLHlCQUF1QixFQU5hO0FBT3BDLDBCQUF3QixFQVBZO0FBUXBDLHlCQUF1QixFQVJhO0FBU3BDLHlCQUF1QixFQVRhO0FBVXBDLDBCQUF3QixFQVZZO0FBVVI7QUFDNUIscUJBQW1CLEVBWGlCO0FBV2I7QUFDdkIsbUJBQWlCLEVBWm1CO0FBYXBDLDBCQUF3QixFQWJZO0FBY3BDLG9CQUFrQjtBQWRrQixDQUFyQztBQWlCQUMsTUFBTSxDQUFFQyxRQUFGLENBQU4sQ0FBbUJDLEtBQW5CLENBQTBCLFVBQVVDLENBQVYsRUFBYztBQUV2QyxNQUFNQyxLQUFLLEdBQUdELENBQUMsQ0FBRSxNQUFGLENBQWY7QUFFQSxNQUFNRSxvQkFBb0IsR0FBRyxHQUE3Qjs7QUFFQSxNQUFNQyxNQUFNLEdBQUdDLFFBQVEsQ0FBRVIsWUFBWSxDQUFDUyxrQkFBZixDQUF2Qjs7QUFDQSxNQUFNQyxLQUFLLEdBQUlILE1BQU0sSUFBSSxDQUFWLEdBQWNBLE1BQWQsR0FBdUIsR0FBdEMsQ0FQdUMsQ0FTdkM7O0FBQ0EsTUFBTUksTUFBTSxHQUFHLEVBQWY7QUFFQSxNQUFNQyxtQkFBbUIsR0FBUVIsQ0FBQyxDQUFFLHNCQUFGLENBQWxDO0FBQ0EsTUFBTVMsZ0JBQWdCLEdBQVdULENBQUMsQ0FBRSxt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OEMsWUFBVztBQUN4RCxRQUFNZixNQUFNLEdBQU1aLENBQUMsQ0FBRSxJQUFGLENBQW5CO0FBQ0EsUUFBTWtKLE9BQU8sR0FBS3RJLE1BQU0sQ0FBQ0UsSUFBUCxDQUFhLFNBQWIsQ0FBbEI7QUFDQSxRQUFNK0wsU0FBUyxHQUFHdE0sTUFBTSxDQUFFMkksT0FBRixDQUF4QjtBQUNBLFFBQU1qSSxTQUFTLEdBQUc0TCxTQUFTLENBQUM1TCxTQUE1QjtBQUVBLFFBQU1zRSxLQUFLLEdBQUdDLCtCQUErQixDQUFFdkUsU0FBRixDQUE3QztBQUNBd0UsSUFBQUEsT0FBTyxDQUFDQyxTQUFSLENBQW1CLEVBQW5CLEVBQXVCLEVBQXZCLEVBQTJCSCxLQUEzQjtBQUVBTSxJQUFBQSxtQkFBbUIsQ0FBRSxJQUFGLENBQW5CO0FBQ0EsR0FWRDtBQVlBNUYsRUFBQUEsS0FBSyxDQUFDMEIsRUFBTixDQUFVLDJCQUFWLEVBQXVDLFVBQVU0TCxDQUFWLEVBQWExRSxhQUFiLEVBQTZCO0FBQ25FaEQsSUFBQUEsbUJBQW1CLENBQUVnRCxhQUFGLENBQW5CO0FBQ0EsR0FGRCxFQXAyQnVDLENBdzJCdkM7O0FBQ0E3SSxFQUFBQSxDQUFDLENBQUU4SSxNQUFGLENBQUQsQ0FBWTBFLElBQVosQ0FBa0IsVUFBbEIsRUFBOEIsWUFBVztBQUN4QzNILElBQUFBLG1CQUFtQixDQUFFLElBQUYsQ0FBbkI7QUFDQSxHQUZEO0FBSUEsQ0E3MkJEIiwiZmlsZSI6IndjLWFqYXgtcHJvZHVjdC1maWx0ZXItcHVibGljLXNjcmlwdHMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIFRoZSBmcm9udGVuZCBmaWx0ZXIgZm9ybS5cbiAqXG4gKiBAc2luY2UgICAgICAzLjAuMFxuICogQHBhY2thZ2UgICAgd2MtYWpheC1wcm9kdWN0LWZpbHRlclxuICogQHN1YnBhY2thZ2Ugd2MtYWpheC1wcm9kdWN0LWZpbHRlci9wdWJsaWMvc3JjL2pzXG4gKiBAYXV0aG9yICAgICBNYWludWwgSGFzc2FuIE1haW5cbiAqL1xuXG5jb25zdCB3Y2FwZl9wYXJhbXMgPSB3Y2FwZl9wYXJhbXMgfHwge1xuXHQnZmlsdGVyX2lucHV0X2RlbGF5JzogJycsXG5cdCdjaG9zZW5fbGliX3NlYXJjaF90aHJlc2hvbGQnOiAnJyxcblx0J3ByZXNlcnZlX2hpZXJhcmNoeV9hY2NvcmRpb25fc3RhdGUnOiAnJyxcblx0J2VuYWJsZV9hbmltYXRpb25fZm9yX2hpZXJhcmNoeV9hY2NvcmRpb24nOiAnJyxcblx0J3Nob3dfcmVzdWx0c19sb2FkaW5nJzogJycsXG5cdCdzY3JvbGxfdG9fdG9wX3NwZWVkJzogJycsXG5cdCdzY3JvbGxfdG9fdG9wX2Vhc2luZyc6ICcnLFxuXHQnc2hvcF9sb29wX2NvbnRhaW5lcic6ICcnLFxuXHQnbm90X2ZvdW5kX2NvbnRhaW5lcic6ICcnLFxuXHQncGFnaW5hdGlvbl9jb250YWluZXInOiAnJywgLy8gdG9kb1xuXHQnc29ydGluZ19jb250cm9sJzogJycsIC8vIHRvZG9cblx0J3Njcm9sbF90b190b3AnOiAnJyxcblx0J3Njcm9sbF90b190b3Bfb2Zmc2V0JzogJycsXG5cdCdjdXN0b21fc2NyaXB0cyc6ICcnLFxufTtcblxualF1ZXJ5KCBkb2N1bWVudCApLnJlYWR5KCBmdW5jdGlvbiggJCApIHtcblxuXHRjb25zdCAkYm9keSA9ICQoICdib2R5JyApO1xuXG5cdGNvbnN0IHJhbmdlVmFsdWVzU2VwYXJhdG9yID0gJ34nO1xuXG5cdGNvbnN0IF9kZWxheSA9IHBhcnNlSW50KCB3Y2FwZl9wYXJhbXMuZmlsdGVyX2lucHV0X2RlbGF5ICk7XG5cdGNvbnN0IGRlbGF5ICA9IF9kZWxheSA+PSAwID8gX2RlbGF5IDogODAwO1xuXG5cdC8vIFN0b3JlIGZpZWxkcycgaWQgYW5kIGZpbHRlciBpbmZvcm1hdGlvbi5cblx0Y29uc3QgZmllbGRzID0ge307XG5cblx0Y29uc3QgJHdjYXBmU2luZ2xlRmlsdGVycyAgICAgID0gJCggJy53Y2FwZi1zaW5nbGUtZmlsdGVyJyApO1xuXHRjb25zdCAkd2NhcGZOYXZGaWx0ZXJzICAgICAgICAgPSAkKCAnLndjYXBmLW5hdi1maWx0ZXInICk7XG5cdGNvbnN0ICR3Y2FwZk51bWJlclJhbmdlRmlsdGVycyA9ICQoICcud2NhcGYtbnVtYmVyLXJhbmdlLWZpbHRlcicgKTtcblxuXHQkd2NhcGZTaW5nbGVGaWx0ZXJzLmVhY2goIGZ1bmN0aW9uKCkge1xuXHRcdGNvbnN0ICRmaWVsZCAgICAgICAgID0gJCggdGhpcyApO1xuXHRcdGNvbnN0IGlkICAgICAgICAgICAgID0gJGZpZWxkLmF0dHIoICdkYXRhLWlkJyApO1xuXHRcdGNvbnN0ICR3cmFwcGVyICAgICAgID0gJGZpZWxkLmZpbmQoICcud2NhcGYtZmllbGQtaW5uZXIgPiBkaXYnICk7XG5cdFx0Y29uc3QgZmlsdGVyS2V5ICAgICAgPSAkd3JhcHBlci5hdHRyKCAnZGF0YS1maWx0ZXIta2V5JyApO1xuXHRcdGNvbnN0IG11bHRpcGxlRmlsdGVyID0gcGFyc2VJbnQoICR3cmFwcGVyLmF0dHIoICdkYXRhLW11bHRpcGxlLWZpbHRlcicgKSApO1xuXG5cdFx0ZmllbGRzWyBpZCBdID0ge1xuXHRcdFx0ZmlsdGVyS2V5OiBmaWx0ZXJLZXksXG5cdFx0XHRtdWx0aXBsZUZpbHRlcjogbXVsdGlwbGVGaWx0ZXJcblx0XHR9O1xuXHR9ICk7XG5cblx0Ly8gSW5pdGlhbGl6ZSBqUXVlcnkgY2hvc2VuIGxpYnJhcnkuXG5cdGZ1bmN0aW9uIGluaXRDaG9zZW4oKSB7XG5cdFx0aWYgKCAhIGpRdWVyeSgpLmNob3NlbiApIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHQkd2NhcGZOYXZGaWx0ZXJzLmZpbmQoICcud2NhcGYtY2hvc2VuLXNlbGVjdCcgKS5lYWNoKCBmdW5jdGlvbigpIHtcblx0XHRcdGNvbnN0ICR0aGlzICAgPSAkKCB0aGlzICk7XG5cdFx0XHRjb25zdCBvcHRpb25zID0ge307XG5cblx0XHRcdGNvbnN0IG5vUmVzdWx0c01lc3NhZ2UgPSAkdGhpcy5hdHRyKCAnZGF0YS1uby1yZXN1bHRzLW1lc3NhZ2UnICk7XG5cblx0XHRcdGlmICggbm9SZXN1bHRzTWVzc2FnZSApIHtcblx0XHRcdFx0b3B0aW9uc1sgJ25vX3Jlc3VsdHNfdGV4dCcgXSA9IG5vUmVzdWx0c01lc3NhZ2U7XG5cdFx0XHR9XG5cblx0XHRcdGNvbnN0IHNlYXJjaFRocmVzaG9sZCA9IHBhcnNlSW50KCB3Y2FwZl9wYXJhbXMuY2hvc2VuX2xpYl9zZWFyY2hfdGhyZXNob2xkICk7XG5cblx0XHRcdGlmICggc2VhcmNoVGhyZXNob2xkICkge1xuXHRcdFx0XHRvcHRpb25zWyAnZGlzYWJsZV9zZWFyY2hfdGhyZXNob2xkJyBdID0gc2VhcmNoVGhyZXNob2xkO1xuXHRcdFx0fVxuXG5cdFx0XHQkdGhpcy5jaG9zZW4oIG9wdGlvbnMgKTtcblx0XHR9ICk7XG5cdH1cblxuXHRpbml0Q2hvc2VuKCk7XG5cblx0Ly8gSW5pdGlhbGl6ZSBoaWVyYXJjaHkgYWNjb3JkaW9uLlxuXHRmdW5jdGlvbiBpbml0SGllcmFyY2h5QWNjb3JkaW9uKCkge1xuXHRcdCR3Y2FwZk5hdkZpbHRlcnMuZmluZCggJy5oaWVyYXJjaHktYWNjb3JkaW9uLXRvZ2dsZScgKS5vbiggJ2NsaWNrJywgZnVuY3Rpb24oKSB7XG5cdFx0XHRjb25zdCAkdGhpcyAgPSAkKCB0aGlzICk7XG5cdFx0XHRjb25zdCAkY2hpbGQgPSAkdGhpcy5wYXJlbnQoICdsaScgKS5jaGlsZHJlbiggJ3VsJyApO1xuXG5cdFx0XHQkdGhpcy50b2dnbGVDbGFzcyggJ2FjdGl2ZScgKTtcblxuXHRcdFx0aWYgKCB3Y2FwZl9wYXJhbXMuZW5hYmxlX2FuaW1hdGlvbl9mb3JfaGllcmFyY2h5X2FjY29yZGlvbiApIHtcblx0XHRcdFx0JGNoaWxkLnNsaWRlVG9nZ2xlKCk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHQkY2hpbGQudG9nZ2xlKCk7XG5cdFx0XHR9XG5cdFx0fSApO1xuXHR9XG5cblx0aW5pdEhpZXJhcmNoeUFjY29yZGlvbigpO1xuXG5cdC8qKlxuXHQgKiBAc291cmNlIGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vYS8zNDE0MTgxM1xuXHQgKlxuXHQgKiBAcGFyYW0gbnVtYmVyXG5cdCAqIEBwYXJhbSBkZWNpbWFsc1xuXHQgKiBAcGFyYW0gZGVjX3BvaW50XG5cdCAqIEBwYXJhbSB0aG91c2FuZHNfc2VwXG5cdCAqXG5cdCAqIEByZXR1cm5zIHtzdHJpbmd9XG5cdCAqL1xuXHRmdW5jdGlvbiBudW1iZXJfZm9ybWF0KCBudW1iZXIsIGRlY2ltYWxzLCBkZWNfcG9pbnQsIHRob3VzYW5kc19zZXAgKSB7XG5cdFx0Ly8gU3RyaXAgYWxsIGNoYXJhY3RlcnMgYnV0IG51bWVyaWNhbCBvbmVzLlxuXHRcdG51bWJlciA9ICggbnVtYmVyICsgJycgKS5yZXBsYWNlKCAvW15cXGQrXFwtRWUuXS9nLCAnJyApO1xuXG5cdFx0Y29uc3QgbiAgICA9ICEgaXNGaW5pdGUoICtudW1iZXIgKSA/IDAgOiArbnVtYmVyO1xuXHRcdGNvbnN0IHByZWMgPSAhIGlzRmluaXRlKCArZGVjaW1hbHMgKSA/IDAgOiBNYXRoLmFicyggZGVjaW1hbHMgKTtcblx0XHRjb25zdCBzZXAgID0gKCB0eXBlb2YgdGhvdXNhbmRzX3NlcCA9PT0gJ3VuZGVmaW5lZCcgKSA/ICcsJyA6IHRob3VzYW5kc19zZXA7XG5cdFx0Y29uc3QgZGVjICA9ICggdHlwZW9mIGRlY19wb2ludCA9PT0gJ3VuZGVmaW5lZCcgKSA/ICcuJyA6IGRlY19wb2ludDtcblxuXHRcdGxldCBzO1xuXG5cdFx0Y29uc3QgdG9GaXhlZEZpeCA9IGZ1bmN0aW9uKCBuLCBwcmVjICkge1xuXHRcdFx0Y29uc3QgayA9IE1hdGgucG93KCAxMCwgcHJlYyApO1xuXHRcdFx0cmV0dXJuICcnICsgTWF0aC5yb3VuZCggbiAqIGsgKSAvIGs7XG5cdFx0fTtcblxuXHRcdC8vIEZpeCBmb3IgSUUgcGFyc2VGbG9hdCgwLjU1KS50b0ZpeGVkKDApID0gMDtcblx0XHRzID0gKCBwcmVjID8gdG9GaXhlZEZpeCggbiwgcHJlYyApIDogJycgKyBNYXRoLnJvdW5kKCBuICkgKS5zcGxpdCggJy4nICk7XG5cblx0XHRpZiAoIHNbIDAgXS5sZW5ndGggPiAzICkge1xuXHRcdFx0c1sgMCBdID0gc1sgMCBdLnJlcGxhY2UoIC9cXEIoPz0oPzpcXGR7M30pKyg/IVxcZCkpL2csIHNlcCApO1xuXHRcdH1cblxuXHRcdGlmICggKCBzWyAxIF0gfHwgJycgKS5sZW5ndGggPCBwcmVjICkge1xuXHRcdFx0c1sgMSBdID0gc1sgMSBdIHx8ICcnO1xuXHRcdFx0c1sgMSBdICs9IG5ldyBBcnJheSggcHJlYyAtIHNbIDEgXS5sZW5ndGggKyAxICkuam9pbiggJzAnICk7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHMuam9pbiggZGVjICk7XG5cdH1cblxuXHQvLyBJbml0aWFsaXplIG5vVUlTbGlkZXIuXG5cdGZ1bmN0aW9uIGluaXROb1VJU2xpZGVyKCkge1xuXHRcdGlmICggJ3VuZGVmaW5lZCcgPT09IHR5cGVvZiBub1VpU2xpZGVyICkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdCR3Y2FwZk51bWJlclJhbmdlRmlsdGVycy5maW5kKCAnLndjYXBmLXJhbmdlLXNsaWRlcicgKS5lYWNoKCBmdW5jdGlvbigpIHtcblx0XHRcdGNvbnN0ICRpdGVtID0gJCggdGhpcyApO1xuXG5cdFx0XHRjb25zdCBmaWx0ZXJLZXkgPSAkaXRlbS5hdHRyKCAnZGF0YS1maWx0ZXIta2V5JyApO1xuXHRcdFx0Y29uc3QgJHNsaWRlciAgID0gJGl0ZW0uZmluZCggJy53Y2FwZi1ub3VpLXNsaWRlcicgKTtcblxuXHRcdFx0Ly8gSWYgc2xpZGVyIGlzIGFscmVhZHkgaW5pdGlhbGl6ZWQgdGhlbiBkb24ndCByZWluaXRpYWxpemUgYWdhaW4uXG5cdFx0XHRpZiAoICRzbGlkZXIuaGFzQ2xhc3MoICd3Y2FwZi1ub3VpLXRhcmdldCcgKSApIHtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXG5cdFx0XHRjb25zdCBzbGlkZXJJZCAgICAgICAgICA9ICRzbGlkZXIuYXR0ciggJ2lkJyApO1xuXHRcdFx0Y29uc3QgZGlzcGxheVZhbHVlc0FzICAgPSAkaXRlbS5hdHRyKCAnZGF0YS1kaXNwbGF5LXZhbHVlcy1hcycgKTtcblx0XHRcdGNvbnN0IHJhbmdlTWluVmFsdWUgICAgID0gcGFyc2VGbG9hdCggJGl0ZW0uYXR0ciggJ2RhdGEtcmFuZ2UtbWluLXZhbHVlJyApICk7XG5cdFx0XHRjb25zdCByYW5nZU1heFZhbHVlICAgICA9IHBhcnNlRmxvYXQoICRpdGVtLmF0dHIoICdkYXRhLXJhbmdlLW1heC12YWx1ZScgKSApO1xuXHRcdFx0Y29uc3Qgc3RlcCAgICAgICAgICAgICAgPSBwYXJzZUZsb2F0KCAkaXRlbS5hdHRyKCAnZGF0YS1zdGVwJyApICk7XG5cdFx0XHRjb25zdCBkZWNpbWFsUGxhY2VzICAgICA9ICRpdGVtLmF0dHIoICdkYXRhLWRlY2ltYWwtcGxhY2VzJyApO1xuXHRcdFx0Y29uc3QgdGhvdXNhbmRTZXBhcmF0b3IgPSAkaXRlbS5hdHRyKCAnZGF0YS10aG91c2FuZC1zZXBhcmF0b3InICk7XG5cdFx0XHRjb25zdCBkZWNpbWFsU2VwYXJhdG9yICA9ICRpdGVtLmF0dHIoICdkYXRhLWRlY2ltYWwtc2VwYXJhdG9yJyApO1xuXHRcdFx0Y29uc3QgbWluVmFsdWUgICAgICAgICAgPSBwYXJzZUZsb2F0KCAkaXRlbS5hdHRyKCAnZGF0YS1taW4tdmFsdWUnICkgKTtcblx0XHRcdGNvbnN0IG1heFZhbHVlICAgICAgICAgID0gcGFyc2VGbG9hdCggJGl0ZW0uYXR0ciggJ2RhdGEtbWF4LXZhbHVlJyApICk7XG5cdFx0XHRjb25zdCAkbWluVmFsdWUgICAgICAgICA9ICRpdGVtLmZpbmQoICcubWluLXZhbHVlJyApO1xuXHRcdFx0Y29uc3QgJG1heFZhbHVlICAgICAgICAgPSAkaXRlbS5maW5kKCAnLm1heC12YWx1ZScgKTtcblxuXHRcdFx0Y29uc3Qgc2xpZGVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoIHNsaWRlcklkICk7XG5cblx0XHRcdG5vVWlTbGlkZXIuY3JlYXRlKCBzbGlkZXIsIHtcblx0XHRcdFx0c3RhcnQ6IFsgbWluVmFsdWUsIG1heFZhbHVlIF0sXG5cdFx0XHRcdHN0ZXAsXG5cdFx0XHRcdGNvbm5lY3Q6IHRydWUsXG5cdFx0XHRcdGNzc1ByZWZpeDogJ3djYXBmLW5vdWktJyxcblx0XHRcdFx0cmFuZ2U6IHtcblx0XHRcdFx0XHQnbWluJzogcmFuZ2VNaW5WYWx1ZSxcblx0XHRcdFx0XHQnbWF4JzogcmFuZ2VNYXhWYWx1ZSxcblx0XHRcdFx0fVxuXHRcdFx0fSApO1xuXG5cdFx0XHRzbGlkZXIubm9VaVNsaWRlci5vbiggJ3VwZGF0ZScsIGZ1bmN0aW9uKCB2YWx1ZXMgKSB7XG5cdFx0XHRcdGNvbnN0IG1pblZhbHVlID0gbnVtYmVyX2Zvcm1hdCggdmFsdWVzWyAwIF0sIGRlY2ltYWxQbGFjZXMsIGRlY2ltYWxTZXBhcmF0b3IsIHRob3VzYW5kU2VwYXJhdG9yICk7XG5cdFx0XHRcdGNvbnN0IG1heFZhbHVlID0gbnVtYmVyX2Zvcm1hdCggdmFsdWVzWyAxIF0sIGRlY2ltYWxQbGFjZXMsIGRlY2ltYWxTZXBhcmF0b3IsIHRob3VzYW5kU2VwYXJhdG9yICk7XG5cblx0XHRcdFx0aWYgKCAncGxhaW5fdGV4dCcgPT09IGRpc3BsYXlWYWx1ZXNBcyApIHtcblx0XHRcdFx0XHQkbWluVmFsdWUuaHRtbCggbWluVmFsdWUgKTtcblx0XHRcdFx0XHQkbWF4VmFsdWUuaHRtbCggbWF4VmFsdWUgKTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHQkbWluVmFsdWUudmFsKCBtaW5WYWx1ZSApO1xuXHRcdFx0XHRcdCRtYXhWYWx1ZS52YWwoIG1heFZhbHVlICk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHQkYm9keS50cmlnZ2VyKCAnd2NhcGYtbm91aXNsaWRlci11cGRhdGUnLCBbICRpdGVtLCB2YWx1ZXMgXSApO1xuXHRcdFx0fSApO1xuXG5cdFx0XHRmdW5jdGlvbiBmaWx0ZXJQcm9kdWN0c0FjY29yZGluZ1RvU2xpZGVyKCB2YWx1ZXMgKSB7XG5cdFx0XHRcdCRib2R5LnRyaWdnZXIoICd3Y2FwZi1ub3Vpc2xpZGVyLWJlZm9yZS1maWx0ZXItcHJvZHVjdHMnLCBbICRpdGVtLCB2YWx1ZXMgXSApO1xuXG5cdFx0XHRcdGNvbnN0IG1pblZhbHVlID0gcGFyc2VGbG9hdCggdmFsdWVzWyAwIF0gKTtcblx0XHRcdFx0Y29uc3QgbWF4VmFsdWUgPSBwYXJzZUZsb2F0KCB2YWx1ZXNbIDEgXSApO1xuXG5cdFx0XHRcdGlmICggbWluVmFsdWUgPT09IHJhbmdlTWluVmFsdWUgJiYgbWF4VmFsdWUgPT09IHJhbmdlTWF4VmFsdWUgKSB7XG5cdFx0XHRcdFx0Y29uc3QgcXVlcnkgPSB3Y2FwZlJlbW92ZVF1ZXJ5U3RyaW5nUGFyYW1ldGVyKCBmaWx0ZXJLZXkgKTtcblx0XHRcdFx0XHRoaXN0b3J5LnB1c2hTdGF0ZSgge30sICcnLCBxdWVyeSApO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdGNvbnN0IGZpbHRlclZhbFN0cmluZyA9IG1pblZhbHVlICsgcmFuZ2VWYWx1ZXNTZXBhcmF0b3IgKyBtYXhWYWx1ZTtcblx0XHRcdFx0XHR3Y2FwZlVwZGF0ZVF1ZXJ5U3RyaW5nUGFyYW1ldGVyKCBmaWx0ZXJLZXksIGZpbHRlclZhbFN0cmluZyApO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0d2NhcGZGaWx0ZXJQcm9kdWN0cygpO1xuXG5cdFx0XHRcdCRib2R5LnRyaWdnZXIoICd3Y2FwZi1ub3Vpc2xpZGVyLWFmdGVyLWZpbHRlci1wcm9kdWN0cycsIFsgJGl0ZW0sIHZhbHVlcyBdICk7XG5cdFx0XHR9XG5cblx0XHRcdHNsaWRlci5ub1VpU2xpZGVyLm9uKCAnc2V0JywgZnVuY3Rpb24oIHZhbHVlcyApIHtcblx0XHRcdFx0Ly8gQ2xlYXIgYW55IHByZXZpb3VzbHkgc2V0IHRpbWVyIGJlZm9yZSBzZXR0aW5nIGEgZnJlc2ggb25lXG5cdFx0XHRcdGNsZWFyVGltZW91dCggJGl0ZW0uZGF0YSggJ3RpbWVyJyApICk7XG5cblx0XHRcdFx0JGl0ZW0uZGF0YSggJ3RpbWVyJywgc2V0VGltZW91dCggZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0JGl0ZW0ucmVtb3ZlRGF0YSggJ3RpbWVyJyApO1xuXG5cdFx0XHRcdFx0ZmlsdGVyUHJvZHVjdHNBY2NvcmRpbmdUb1NsaWRlciggdmFsdWVzICk7XG5cdFx0XHRcdH0sIGRlbGF5ICkgKTtcblx0XHRcdH0gKTtcblxuXHRcdFx0JG1pblZhbHVlLm9uKCAnaW5wdXQnLCBmdW5jdGlvbiggZXZlbnQgKSB7XG5cdFx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cblx0XHRcdFx0Y29uc3QgJGlucHV0ID0gJCggdGhpcyApO1xuXG5cdFx0XHRcdC8vIENsZWFyIGFueSBwcmV2aW91c2x5IHNldCB0aW1lciBiZWZvcmUgc2V0dGluZyBhIGZyZXNoIG9uZVxuXHRcdFx0XHRjbGVhclRpbWVvdXQoICRpbnB1dC5kYXRhKCAndGltZXInICkgKTtcblxuXHRcdFx0XHQkaW5wdXQuZGF0YSggJ3RpbWVyJywgc2V0VGltZW91dCggZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0JGlucHV0LnJlbW92ZURhdGEoICd0aW1lcicgKTtcblxuXHRcdFx0XHRcdGNvbnN0IG1pblZhbHVlID0gJGlucHV0LnZhbCgpO1xuXG5cdFx0XHRcdFx0c2xpZGVyLm5vVWlTbGlkZXIuc2V0KCBbIG1pblZhbHVlLCBudWxsIF0gKTtcblxuXHRcdFx0XHRcdGZpbHRlclByb2R1Y3RzQWNjb3JkaW5nVG9TbGlkZXIoIHNsaWRlci5ub1VpU2xpZGVyLmdldCgpICk7XG5cdFx0XHRcdH0sIGRlbGF5ICkgKTtcblx0XHRcdH0gKTtcblxuXHRcdFx0JG1heFZhbHVlLm9uKCAnaW5wdXQnLCBmdW5jdGlvbiggZXZlbnQgKSB7XG5cdFx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cblx0XHRcdFx0Y29uc3QgJGlucHV0ID0gJCggdGhpcyApO1xuXG5cdFx0XHRcdC8vIENsZWFyIGFueSBwcmV2aW91c2x5IHNldCB0aW1lciBiZWZvcmUgc2V0dGluZyBhIGZyZXNoIG9uZVxuXHRcdFx0XHRjbGVhclRpbWVvdXQoICRpbnB1dC5kYXRhKCAndGltZXInICkgKTtcblxuXHRcdFx0XHQkaW5wdXQuZGF0YSggJ3RpbWVyJywgc2V0VGltZW91dCggZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0JGlucHV0LnJlbW92ZURhdGEoICd0aW1lcicgKTtcblxuXHRcdFx0XHRcdGNvbnN0IG1heFZhbHVlID0gJGlucHV0LnZhbCgpO1xuXG5cdFx0XHRcdFx0c2xpZGVyLm5vVWlTbGlkZXIuc2V0KCBbIG51bGwsIG1heFZhbHVlIF0gKTtcblxuXHRcdFx0XHRcdGZpbHRlclByb2R1Y3RzQWNjb3JkaW5nVG9TbGlkZXIoIHNsaWRlci5ub1VpU2xpZGVyLmdldCgpICk7XG5cdFx0XHRcdH0sIGRlbGF5ICkgKTtcblx0XHRcdH0gKTtcblx0XHR9ICk7XG5cdH1cblxuXHRpbml0Tm9VSVNsaWRlcigpO1xuXG5cdGZ1bmN0aW9uIGZpbHRlckJ5RGF0ZSggJGlucHV0ICkge1xuXHRcdGNvbnN0ICR3Y2FwZkRhdGVGaWx0ZXIgPSAkaW5wdXQuY2xvc2VzdCggJy53Y2FwZi1kYXRlLWlucHV0JyApO1xuXHRcdGNvbnN0IGZpbHRlcktleSAgICAgICAgPSAkd2NhcGZEYXRlRmlsdGVyLmF0dHIoICdkYXRhLWZpbHRlci1rZXknICk7XG5cdFx0Y29uc3QgaXNSYW5nZSAgICAgICAgICA9ICR3Y2FwZkRhdGVGaWx0ZXIuYXR0ciggJ2RhdGEtaXMtcmFuZ2UnICk7XG5cblx0XHRsZXQgZmlsdGVyVmFsdWUgPSAnJztcblx0XHRsZXQgcnVuRmlsdGVyICAgPSBmYWxzZTtcblxuXHRcdC8vIENsZWFyIGFueSBwcmV2aW91c2x5IHNldCB0aW1lciBiZWZvcmUgc2V0dGluZyBhIGZyZXNoIG9uZVxuXHRcdGNsZWFyVGltZW91dCggJHdjYXBmRGF0ZUZpbHRlci5kYXRhKCAndGltZXInICkgKTtcblxuXHRcdGlmICggaXNSYW5nZSApIHtcblx0XHRcdGNvbnN0IGZyb20gPSAkd2NhcGZEYXRlRmlsdGVyLmZpbmQoICcuZGF0ZS1mcm9tLWlucHV0JyApLnZhbCgpO1xuXHRcdFx0Y29uc3QgdG8gICA9ICR3Y2FwZkRhdGVGaWx0ZXIuZmluZCggJy5kYXRlLXRvLWlucHV0JyApLnZhbCgpO1xuXG5cdFx0XHRpZiAoIGZyb20gJiYgdG8gKSB7XG5cdFx0XHRcdGZpbHRlclZhbHVlID0gZnJvbSArIHJhbmdlVmFsdWVzU2VwYXJhdG9yICsgdG87XG5cdFx0XHRcdHJ1bkZpbHRlciAgID0gdHJ1ZTtcblx0XHRcdH0gZWxzZSBpZiAoICEgZnJvbSAmJiAhIHRvICkge1xuXHRcdFx0XHRydW5GaWx0ZXIgPSB0cnVlO1xuXHRcdFx0fVxuXHRcdH0gZWxzZSB7XG5cdFx0XHRjb25zdCBmcm9tID0gJHdjYXBmRGF0ZUZpbHRlci5maW5kKCAnLmRhdGUtZnJvbS1pbnB1dCcgKS52YWwoKTtcblxuXHRcdFx0aWYgKCBmcm9tICkge1xuXHRcdFx0XHRmaWx0ZXJWYWx1ZSA9IGZyb207XG5cdFx0XHRcdHJ1bkZpbHRlciAgID0gdHJ1ZTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHJ1bkZpbHRlciA9IHRydWU7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0aWYgKCBydW5GaWx0ZXIgKSB7XG5cdFx0XHQkd2NhcGZEYXRlRmlsdGVyLmRhdGEoICd0aW1lcicsIHNldFRpbWVvdXQoIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHQkd2NhcGZEYXRlRmlsdGVyLnJlbW92ZURhdGEoICd0aW1lcicgKTtcblxuXHRcdFx0XHRpZiAoIGZpbHRlclZhbHVlICkge1xuXHRcdFx0XHRcdHdjYXBmVXBkYXRlUXVlcnlTdHJpbmdQYXJhbWV0ZXIoIGZpbHRlcktleSwgZmlsdGVyVmFsdWUgKTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRjb25zdCBxdWVyeSA9IHdjYXBmUmVtb3ZlUXVlcnlTdHJpbmdQYXJhbWV0ZXIoIGZpbHRlcktleSApO1xuXHRcdFx0XHRcdGhpc3RvcnkucHVzaFN0YXRlKCB7fSwgJycsIHF1ZXJ5ICk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHR3Y2FwZkZpbHRlclByb2R1Y3RzKCk7XG5cdFx0XHR9LCBkZWxheSApICk7XG5cdFx0fVxuXHR9XG5cblx0ZnVuY3Rpb24gaW5pdERhdGVwaWNrZXIoKSB7XG5cdFx0aWYgKCAhIGpRdWVyeSgpLmRhdGVwaWNrZXIgKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0Y29uc3QgJHdjYXBmRGF0ZUZpbHRlcnMgPSAkKCAnLndjYXBmLWRhdGUtcmFuZ2UtZmlsdGVyJyApO1xuXHRcdGNvbnN0ICR3Y2FwZkRhdGVGaWx0ZXIgID0gJHdjYXBmRGF0ZUZpbHRlcnMuZmluZCggJy53Y2FwZi1kYXRlLWlucHV0JyApO1xuXG5cdFx0Y29uc3QgZm9ybWF0ICAgICAgICA9ICR3Y2FwZkRhdGVGaWx0ZXIuYXR0ciggJ2RhdGEtZGF0ZS1mb3JtYXQnICk7XG5cdFx0Y29uc3QgeWVhckRyb3Bkb3duICA9ICR3Y2FwZkRhdGVGaWx0ZXIuYXR0ciggJ2RhdGEtZGF0ZS1waWNrZXIteWVhci1kcm9wZG93bicgKTtcblx0XHRjb25zdCBtb250aERyb3Bkb3duID0gJHdjYXBmRGF0ZUZpbHRlci5hdHRyKCAnZGF0YS1kYXRlLXBpY2tlci1tb250aC1kcm9wZG93bicgKTtcblxuXHRcdGNvbnN0ICRmcm9tID0gJHdjYXBmRGF0ZUZpbHRlci5maW5kKCAnLmRhdGUtZnJvbS1pbnB1dCcgKTtcblx0XHRjb25zdCAkdG8gICA9ICR3Y2FwZkRhdGVGaWx0ZXIuZmluZCggJy5kYXRlLXRvLWlucHV0JyApO1xuXG5cdFx0JGZyb20uZGF0ZXBpY2tlcigge1xuXHRcdFx0ZGF0ZUZvcm1hdDogZm9ybWF0LFxuXHRcdFx0Y2hhbmdlWWVhcjogeWVhckRyb3Bkb3duLFxuXHRcdFx0Y2hhbmdlTW9udGg6IG1vbnRoRHJvcGRvd24sXG5cdFx0fSApO1xuXG5cdFx0JHRvLmRhdGVwaWNrZXIoIHtcblx0XHRcdGRhdGVGb3JtYXQ6IGZvcm1hdCxcblx0XHRcdGNoYW5nZVllYXI6IHllYXJEcm9wZG93bixcblx0XHRcdGNoYW5nZU1vbnRoOiBtb250aERyb3Bkb3duLFxuXHRcdH0gKTtcblxuXHRcdCRmcm9tLm9uKCAnY2hhbmdlJywgZnVuY3Rpb24oKSB7XG5cdFx0XHRjb25zdCAkaW5wdXQgPSAkKCB0aGlzICk7XG5cdFx0XHRmaWx0ZXJCeURhdGUoICRpbnB1dCApO1xuXHRcdH0gKTtcblxuXHRcdCR0by5vbiggJ2NoYW5nZScsIGZ1bmN0aW9uKCkge1xuXHRcdFx0Y29uc3QgJGlucHV0ID0gJCggdGhpcyApO1xuXHRcdFx0ZmlsdGVyQnlEYXRlKCAkaW5wdXQgKTtcblx0XHR9ICk7XG5cdH1cblxuXHRpbml0RGF0ZXBpY2tlcigpO1xuXG5cdC8vIFRoaW5ncyBhcmUgZG9uZSBiZWZvcmUgYXBwbHlpbmcgdGhlIGZpbHRlciBsaWtlIHNob3dpbmcgYSBsb2FkaW5nIGluZGljYXRvci5cblx0ZnVuY3Rpb24gd2NhcGZCZWZvcmVVcGRhdGUoKSB7XG5cdFx0JGJvZHkudHJpZ2dlciggJ3djYXBmX2JlZm9yZV91cGRhdGVfZmlsdGVycycgKTtcblxuXHRcdGxldCBjb250YWluZXI7XG5cblx0XHRpZiAoICQoIHdjYXBmX3BhcmFtcy5zaG9wX2xvb3BfY29udGFpbmVyLmxlbmd0aCApICkge1xuXHRcdFx0Y29udGFpbmVyID0gd2NhcGZfcGFyYW1zLnNob3BfbG9vcF9jb250YWluZXI7XG5cdFx0fSBlbHNlIGlmICggJCggd2NhcGZfcGFyYW1zLm5vdF9mb3VuZF9jb250YWluZXIgKS5sZW5ndGggKSB7XG5cdFx0XHRjb250YWluZXIgPSB3Y2FwZl9wYXJhbXMubm90X2ZvdW5kX2NvbnRhaW5lcjtcblx0XHR9XG5cblx0XHQvLyBTaG93IGxvYWRpbmcgaW1hZ2UuXG5cdFx0aWYgKCB3Y2FwZl9wYXJhbXMuc2hvd19yZXN1bHRzX2xvYWRpbmcgKSB7XG5cdFx0XHRjb25zdCBsb2FkaW5nTWFya3VwID0gJzxkaXYgY2xhc3M9XCJ3Y2FwZi1zaG9wLWxvb3AtbG9hZGluZ1wiPjwvZGl2Pic7XG5cdFx0XHQkKCBsb2FkaW5nTWFya3VwICkucHJlcGVuZFRvKCBjb250YWluZXIgKTtcblx0XHR9XG5cblx0XHQvLyBTY3JvbGwgdG8gdG9wLlxuXHRcdGlmICggd2NhcGZfcGFyYW1zLnNjcm9sbF90b190b3AgKSB7XG5cdFx0XHRsZXQgYWRqdXN0aW5nT2Zmc2V0LCBvZmZzZXQ7XG5cblx0XHRcdGlmICggd2NhcGZfcGFyYW1zLnNjcm9sbF90b190b3Bfb2Zmc2V0ICkge1xuXHRcdFx0XHRhZGp1c3RpbmdPZmZzZXQgPSBwYXJzZUludCggd2NhcGZfcGFyYW1zLnNjcm9sbF90b190b3Bfb2Zmc2V0ICk7XG5cdFx0XHR9XG5cblx0XHRcdGNvbnN0ICRjb250YWluZXIgPSAkKCBjb250YWluZXIgKTtcblxuXHRcdFx0aWYgKCAkY29udGFpbmVyLmxlbmd0aCApIHtcblx0XHRcdFx0b2Zmc2V0ID0gJGNvbnRhaW5lci5vZmZzZXQoKS50b3AgLSBhZGp1c3RpbmdPZmZzZXQ7XG5cblx0XHRcdFx0aWYgKCBvZmZzZXQgPCAwICkge1xuXHRcdFx0XHRcdG9mZnNldCA9IDA7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHQkKCAnaHRtbCwgYm9keScgKS5zdG9wKCkuYW5pbWF0ZShcblx0XHRcdFx0XHR7IHNjcm9sbFRvcDogb2Zmc2V0IH0sXG5cdFx0XHRcdFx0d2NhcGZfcGFyYW1zLnNjcm9sbF90b190b3Bfc3BlZWQsXG5cdFx0XHRcdFx0d2NhcGZfcGFyYW1zLnNjcm9sbF90b190b3BfZWFzaW5nLFxuXHRcdFx0XHQpO1xuXHRcdFx0fVxuXHRcdH1cblx0fVxuXG5cdC8vIFRoaW5ncyBhcmUgZG9uZSBhZnRlciBhcHBseWluZyB0aGUgZmlsdGVyIGxpa2Ugc2Nyb2xsIHRvIHRvcC5cblx0ZnVuY3Rpb24gd2NhcGZBZnRlclVwZGF0ZSgpIHtcblx0XHRpbml0Q2hvc2VuKCk7XG5cdFx0aW5pdEhpZXJhcmNoeUFjY29yZGlvbigpO1xuXHRcdGluaXROb1VJU2xpZGVyKCk7XG5cdFx0aW5pdERhdGVwaWNrZXIoKTtcblxuXHRcdC8vIHRvZG9cblx0XHQvLyByZWluaXRpYWxpemUgb3JkZXJpbmdcblx0XHQvLyB3Y2FwZkluaXRPcmRlcigpO1xuXG5cdFx0JGJvZHkudHJpZ2dlciggJ3djYXBmX2FmdGVyX3VwZGF0ZV9maWx0ZXJzJyApO1xuXHR9XG5cblx0Ly8gVGhlIG1haW4gZmlsdGVyIGZ1bmN0aW9uLlxuXHRmdW5jdGlvbiB3Y2FwZkZpbHRlclByb2R1Y3RzKCBmb3JjZVJlUmVuZGVyID0gZmFsc2UgKSB7XG5cdFx0d2NhcGZCZWZvcmVVcGRhdGUoKTtcblxuXHRcdCQuZ2V0KCB3aW5kb3cubG9jYXRpb24uaHJlZiwgZnVuY3Rpb24oIGRhdGEgKSB7XG5cdFx0XHRjb25zdCAkZGF0YSA9ICQoIGRhdGEgKTtcblxuXHRcdFx0Ly8gUmVwbGFjZSB0aGUgZmllbGRzJyBkYXRhIHdpdGggbmV3IGRhdGEuXG5cdFx0XHQkLmVhY2goIGZpZWxkcywgZnVuY3Rpb24oIGlkICkge1xuXHRcdFx0XHRjb25zdCBmaWVsZElEICAgID0gJ1tkYXRhLWlkPVwiJyArIGlkICsgJ1wiXSc7XG5cdFx0XHRcdGNvbnN0ICRmaWVsZCAgICAgPSAkKCBmaWVsZElEICk7XG5cdFx0XHRcdGNvbnN0ICRpbm5lciAgICAgPSAkZmllbGQuZmluZCggJy53Y2FwZi1maWVsZC1pbm5lcicgKTtcblx0XHRcdFx0Y29uc3QgX2ZpZWxkICAgICA9ICRkYXRhLmZpbmQoIGZpZWxkSUQgKTtcblx0XHRcdFx0Y29uc3QgZmllbGRDbGFzcyA9ICQoIF9maWVsZCApLmF0dHIoICdjbGFzcycgKTtcblxuXHRcdFx0XHQvLyBQcmVzZXJ2ZSBoaWVyYXJjaHkgYWNjb3JkaW9uIHN0YXRlLlxuXHRcdFx0XHRpZiAoIHdjYXBmX3BhcmFtcy5wcmVzZXJ2ZV9oaWVyYXJjaHlfYWNjb3JkaW9uX3N0YXRlICkge1xuXHRcdFx0XHRcdGlmICggJGZpZWxkLmhhc0NsYXNzKCAnaGllcmFyY2h5LWFjY29yZGlvbicgKSApIHtcblx0XHRcdFx0XHRcdCRmaWVsZC5maW5kKCAnLmhpZXJhcmNoeS1hY2NvcmRpb24tdG9nZ2xlLmFjdGl2ZScgKS5lYWNoKCBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHRcdFx0Y29uc3QgaXRlbVZhbHVlICAgICAgPSAkKCB0aGlzICkucGFyZW50KCkuY2hpbGRyZW4oICdpbnB1dCcgKS52YWwoKTtcblx0XHRcdFx0XHRcdFx0Y29uc3QgdG9nZ2xlU2VsZWN0b3IgPSAnaW5wdXRbdmFsdWU9XCInICsgaXRlbVZhbHVlICsgJ1wiXSB+IC5oaWVyYXJjaHktYWNjb3JkaW9uLXRvZ2dsZSc7XG5cdFx0XHRcdFx0XHRcdGNvbnN0IHVsU2VsZWN0b3IgICAgID0gJ2lucHV0W3ZhbHVlPVwiJyArIGl0ZW1WYWx1ZSArICdcIl0gfiB1bCc7XG5cdFx0XHRcdFx0XHRcdGNvbnN0IF9jbGFzc2VzICAgICAgID0gJ2hpZXJhcmNoeS1hY2NvcmRpb24tdG9nZ2xlIGFjdGl2ZSc7XG5cblx0XHRcdFx0XHRcdFx0X2ZpZWxkLmZpbmQoIHRvZ2dsZVNlbGVjdG9yICkuYXR0ciggJ2NsYXNzJywgX2NsYXNzZXMgKTtcblx0XHRcdFx0XHRcdFx0X2ZpZWxkLmZpbmQoIHVsU2VsZWN0b3IgKS5zaG93KCk7XG5cdFx0XHRcdFx0XHR9ICk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cblx0XHRcdFx0Y29uc3QgX2h0bWwgPSBfZmllbGQuZmluZCggJy53Y2FwZi1maWVsZC1pbm5lcicgKS5odG1sKCk7XG5cblx0XHRcdFx0Ly8gVXBkYXRlIHRoZSBmaWVsZCdzIGNsYXNzLlxuXHRcdFx0XHQkZmllbGQuYXR0ciggJ2NsYXNzJywgZmllbGRDbGFzcyApO1xuXG5cdFx0XHRcdC8vIFdoZW4gY2FsbGVkIGZyb20gaGlzdG9yeSBiYWNrIG9yIGZvcndhcmQgcmVxdWVzdCB0aGVuIHJlcmVuZGVyIGFsbCBmaWVsZHMuXG5cdFx0XHRcdGlmICggZm9yY2VSZVJlbmRlciApIHtcblxuXHRcdFx0XHRcdC8vIHVwZGF0ZSBmaWVsZFxuXHRcdFx0XHRcdCRpbm5lci5odG1sKCBfaHRtbCApO1xuXG5cdFx0XHRcdH0gZWxzZSB7XG5cblx0XHRcdFx0XHQvLyBTZWxlY3RpdmVseSByZXJlbmRlciB0aGUgZmllbGRzLlxuXHRcdFx0XHRcdGlmICggJGZpZWxkLmhhc0NsYXNzKCAnd2NhcGYtbmF2LWZpbHRlcicgKSApIHtcblxuXHRcdFx0XHRcdFx0Ly8gdXBkYXRlIGZpZWxkXG5cdFx0XHRcdFx0XHQkaW5uZXIuaHRtbCggX2h0bWwgKTtcblxuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHR9XG5cblx0XHRcdFx0JGZpZWxkLnRyaWdnZXIoICd3Y2FwZi1maWVsZC11cGRhdGVkJywgWyBfZmllbGQgXSApO1xuXHRcdFx0fSApO1xuXG5cdFx0XHQvLyBSZXBsYWNlIG9sZCBzaG9wIGxvb3Agd2l0aCBuZXcgb25lLlxuXHRcdFx0Y29uc3QgJHNob3BMb29wQ29udGFpbmVyID0gJGRhdGEuZmluZCggd2NhcGZfcGFyYW1zLnNob3BfbG9vcF9jb250YWluZXIgKTtcblx0XHRcdGNvbnN0ICRub3RGb3VuZENvbnRhaW5lciA9ICRkYXRhLmZpbmQoIHdjYXBmX3BhcmFtcy5ub3RfZm91bmRfY29udGFpbmVyICk7XG5cblx0XHRcdGlmICggd2NhcGZfcGFyYW1zLnNob3BfbG9vcF9jb250YWluZXIgPT09IHdjYXBmX3BhcmFtcy5ub3RfZm91bmRfY29udGFpbmVyICkge1xuXHRcdFx0XHQkKCB3Y2FwZl9wYXJhbXMuc2hvcF9sb29wX2NvbnRhaW5lciApLmh0bWwoICRzaG9wTG9vcENvbnRhaW5lci5odG1sKCkgKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGlmICggJCggd2NhcGZfcGFyYW1zLm5vdF9mb3VuZF9jb250YWluZXIgKS5sZW5ndGggKSB7XG5cdFx0XHRcdFx0aWYgKCAkc2hvcExvb3BDb250YWluZXIubGVuZ3RoICkge1xuXHRcdFx0XHRcdFx0JCggd2NhcGZfcGFyYW1zLm5vdF9mb3VuZF9jb250YWluZXIgKS5odG1sKCAkc2hvcExvb3BDb250YWluZXIuaHRtbCgpICk7XG5cdFx0XHRcdFx0fSBlbHNlIGlmICggJG5vdEZvdW5kQ29udGFpbmVyLmxlbmd0aCApIHtcblx0XHRcdFx0XHRcdCQoIHdjYXBmX3BhcmFtcy5ub3RfZm91bmRfY29udGFpbmVyICkuaHRtbCggJG5vdEZvdW5kQ29udGFpbmVyLmh0bWwoKSApO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSBlbHNlIGlmICggJCggd2NhcGZfcGFyYW1zLnNob3BfbG9vcF9jb250YWluZXIgKS5sZW5ndGggKSB7XG5cdFx0XHRcdFx0aWYgKCAkc2hvcExvb3BDb250YWluZXIubGVuZ3RoICkge1xuXHRcdFx0XHRcdFx0JCggd2NhcGZfcGFyYW1zLnNob3BfbG9vcF9jb250YWluZXIgKS5odG1sKCAkc2hvcExvb3BDb250YWluZXIuaHRtbCgpICk7XG5cdFx0XHRcdFx0fSBlbHNlIGlmICggJG5vdEZvdW5kQ29udGFpbmVyLmxlbmd0aCApIHtcblx0XHRcdFx0XHRcdCQoIHdjYXBmX3BhcmFtcy5zaG9wX2xvb3BfY29udGFpbmVyICkuaHRtbCggJG5vdEZvdW5kQ29udGFpbmVyLmh0bWwoKSApO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0XHR3Y2FwZkFmdGVyVXBkYXRlKCk7XG5cblx0XHRcdC8vIHJ1biBzY3JpcHRzIGFmdGVyIHNob3AgbG9vcCB1bmRhdGVkXG5cdFx0XHRpZiAoIHR5cGVvZiB3Y2FwZl9wYXJhbXMuY3VzdG9tX3NjcmlwdHMgIT09ICd1bmRlZmluZWQnICYmIHdjYXBmX3BhcmFtcy5jdXN0b21fc2NyaXB0cy5sZW5ndGggPiAwICkge1xuXHRcdFx0XHRldmFsKCB3Y2FwZl9wYXJhbXMuY3VzdG9tX3NjcmlwdHMgKTtcblx0XHRcdH1cblx0XHR9ICk7XG5cdH1cblxuXHQvLyBVUkwgUGFyc2VyXG5cdGZ1bmN0aW9uIHdjYXBmR2V0VXJsVmFycyggdXJsICkge1xuXHRcdGxldCB2YXJzID0ge30sIGhhc2g7XG5cblx0XHRpZiAoIHR5cGVvZiB1cmwgPT09ICd1bmRlZmluZWQnICkge1xuXHRcdFx0dXJsID0gd2luZG93LmxvY2F0aW9uLmhyZWY7XG5cdFx0fVxuXG5cdFx0dXJsID0gdXJsLnJlcGxhY2VBbGwoICclMkMnLCAnLCcgKTtcblxuXHRcdGNvbnN0IGhhc2hlcyAgPSB1cmwuc2xpY2UoIHVybC5pbmRleE9mKCAnPycgKSArIDEgKS5zcGxpdCggJyYnICk7XG5cdFx0Y29uc3QgaExlbmd0aCA9IGhhc2hlcy5sZW5ndGg7XG5cblx0XHRmb3IgKCBsZXQgaSA9IDA7IGkgPCBoTGVuZ3RoOyBpKysgKSB7XG5cdFx0XHRoYXNoID0gaGFzaGVzWyBpIF0uc3BsaXQoICc9JyApO1xuXG5cdFx0XHR2YXJzWyBoYXNoWyAwIF0gXSA9IGhhc2hbIDEgXTtcblx0XHR9XG5cblx0XHRyZXR1cm4gdmFycztcblx0fVxuXG5cdC8vIGV2ZXJ5dGltZSB3ZSBhcHBseSB0aGUgZmlsdGVyIHdlIHNldCB0aGUgY3VycmVudCBwYWdlIHRvIDFcblx0ZnVuY3Rpb24gd2NhcGZGaXhQYWdpbmF0aW9uKCkge1xuXHRcdGxldCB1cmwgICAgICAgICAgICAgICAgPSB3aW5kb3cubG9jYXRpb24uaHJlZjtcblx0XHRjb25zdCBwYXJhbXMgICAgICAgICAgID0gd2NhcGZHZXRVcmxWYXJzKCB1cmwgKTtcblx0XHRjb25zdCBjdXJyZW50UGFnZUluVXJsID0gcGFyc2VJbnQoIHVybC5yZXBsYWNlKCAvLitcXC9wYWdlXFwvKFxcZCspKy8sICckMScgKSApO1xuXG5cdFx0aWYgKCBjdXJyZW50UGFnZUluVXJsICkge1xuXHRcdFx0aWYgKCBjdXJyZW50UGFnZUluVXJsID4gMSApIHtcblx0XHRcdFx0dXJsID0gdXJsLnJlcGxhY2UoIC9wYWdlXFwvKFxcZCspLywgJ3BhZ2UvMScgKTtcblx0XHRcdH1cblx0XHR9IGVsc2UgaWYgKCB0eXBlb2YgcGFyYW1zWyAncGFnZWQnIF0gIT09ICd1bmRlZmluZWQnICkge1xuXHRcdFx0Y29uc3QgY3VycmVudFBhZ2VJblBhcmFtcyA9IHBhcnNlSW50KCBwYXJhbXNbICdwYWdlZCcgXSApO1xuXG5cdFx0XHRpZiAoIGN1cnJlbnRQYWdlSW5QYXJhbXMgPiAxICkge1xuXHRcdFx0XHR1cmwgPSB1cmwucmVwbGFjZSggJ3BhZ2VkPScgKyBjdXJyZW50UGFnZUluUGFyYW1zLCAncGFnZWQ9MScgKTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHRyZXR1cm4gdXJsO1xuXHR9XG5cblx0Ly8gdXBkYXRlIHF1ZXJ5IHN0cmluZyBmb3IgY2F0ZWdvcmllcywgbWV0YSBldGMuLlxuXHRmdW5jdGlvbiB3Y2FwZlVwZGF0ZVF1ZXJ5U3RyaW5nUGFyYW1ldGVyKCBrZXksIHZhbHVlLCBwdXNoSGlzdG9yeSwgdXJsICkge1xuXHRcdGlmICggdHlwZW9mIHB1c2hIaXN0b3J5ID09PSAndW5kZWZpbmVkJyApIHtcblx0XHRcdHB1c2hIaXN0b3J5ID0gdHJ1ZTtcblx0XHR9XG5cblx0XHRpZiAoIHR5cGVvZiB1cmwgPT09ICd1bmRlZmluZWQnICkge1xuXHRcdFx0dXJsID0gd2NhcGZGaXhQYWdpbmF0aW9uKCk7XG5cdFx0fVxuXG5cdFx0Y29uc3QgcmUgICAgICAgID0gbmV3IFJlZ0V4cCggJyhbPyZdKScgKyBrZXkgKyAnPS4qPygmfCQpJywgJ2knICk7XG5cdFx0Y29uc3Qgc2VwYXJhdG9yID0gdXJsLmluZGV4T2YoICc/JyApICE9PSAtMSA/ICcmJyA6ICc/Jztcblx0XHRsZXQgdXJsV2l0aFF1ZXJ5O1xuXG5cdFx0aWYgKCB1cmwubWF0Y2goIHJlICkgKSB7XG5cdFx0XHR1cmxXaXRoUXVlcnkgPSB1cmwucmVwbGFjZSggcmUsICckMScgKyBrZXkgKyAnPScgKyB2YWx1ZSArICckMicgKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0dXJsV2l0aFF1ZXJ5ID0gdXJsICsgc2VwYXJhdG9yICsga2V5ICsgJz0nICsgdmFsdWU7XG5cdFx0fVxuXG5cdFx0aWYgKCBwdXNoSGlzdG9yeSA9PT0gdHJ1ZSApIHtcblx0XHRcdHJldHVybiBoaXN0b3J5LnB1c2hTdGF0ZSgge30sICcnLCB1cmxXaXRoUXVlcnkgKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0cmV0dXJuIHVybFdpdGhRdWVyeTtcblx0XHR9XG5cdH1cblxuXHQvLyByZW1vdmUgcGFyYW1ldGVyIGZyb20gdXJsXG5cdGZ1bmN0aW9uIHdjYXBmUmVtb3ZlUXVlcnlTdHJpbmdQYXJhbWV0ZXIoIGZpbHRlcktleSwgdXJsICkge1xuXHRcdGlmICggdHlwZW9mIHVybCA9PT0gJ3VuZGVmaW5lZCcgKSB7XG5cdFx0XHR1cmwgPSB3Y2FwZkZpeFBhZ2luYXRpb24oKTtcblx0XHR9XG5cblx0XHRjb25zdCBvbGRQYXJhbXMgICAgICAgICA9IHdjYXBmR2V0VXJsVmFycyggdXJsICk7XG5cdFx0Y29uc3Qgb2xkUGFyYW1zTGVuZ3RoICAgPSBPYmplY3Qua2V5cyggb2xkUGFyYW1zICkubGVuZ3RoO1xuXHRcdGNvbnN0IHN0YXJ0UG9zaXRpb24gICAgID0gdXJsLmluZGV4T2YoICc/JyApO1xuXHRcdGNvbnN0IGZpbHRlcktleVBvc2l0aW9uID0gdXJsLmluZGV4T2YoIGZpbHRlcktleSApO1xuXHRcdGxldCBjbGVhblVybCwgY2xlYW5RdWVyeTtcblxuXHRcdGlmICggb2xkUGFyYW1zTGVuZ3RoID4gMSApIHtcblx0XHRcdGlmICggKCBmaWx0ZXJLZXlQb3NpdGlvbiAtIHN0YXJ0UG9zaXRpb24gKSA+IDEgKSB7XG5cdFx0XHRcdGNsZWFuVXJsID0gdXJsLnJlcGxhY2UoICcmJyArIGZpbHRlcktleSArICc9JyArIG9sZFBhcmFtc1sgZmlsdGVyS2V5IF0sICcnICk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRjbGVhblVybCA9IHVybC5yZXBsYWNlKCBmaWx0ZXJLZXkgKyAnPScgKyBvbGRQYXJhbXNbIGZpbHRlcktleSBdICsgJyYnLCAnJyApO1xuXHRcdFx0fVxuXG5cdFx0XHRjb25zdCBuZXdQYXJhbXMgPSBjbGVhblVybC5zcGxpdCggJz8nICk7XG5cdFx0XHRjbGVhblF1ZXJ5ICAgICAgPSAnPycgKyBuZXdQYXJhbXNbIDEgXTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0Y2xlYW5RdWVyeSA9IHVybC5yZXBsYWNlKCAnPycgKyBmaWx0ZXJLZXkgKyAnPScgKyBvbGRQYXJhbXNbIGZpbHRlcktleSBdLCAnJyApO1xuXHRcdH1cblxuXHRcdHJldHVybiBjbGVhblF1ZXJ5O1xuXHR9XG5cblx0Ly8gdGFrZSB0aGUga2V5IGFuZCB2YWx1ZSBhbmQgbWFrZSBxdWVyeVxuXHRmdW5jdGlvbiB3Y2FwZk1ha2VQYXJhbWV0ZXJzKCBmaWx0ZXJLZXksIGZpbHRlclZhbHVlLCBmb3JjZVJlcmVuZGVyID0gZmFsc2UsIHVybCApIHtcblx0XHRjb25zdCB2YWx1ZVNlcGFyYXRvciA9ICcsJztcblxuXHRcdGxldCBwYXJhbXMsIG5leHRWYWx1ZXMsIGVtcHR5VmFsdWUgPSBmYWxzZTtcblxuXHRcdGlmICggdHlwZW9mIHVybCAhPT0gJ3VuZGVmaW5lZCcgKSB7XG5cdFx0XHRwYXJhbXMgPSB3Y2FwZkdldFVybFZhcnMoIHVybCApO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRwYXJhbXMgPSB3Y2FwZkdldFVybFZhcnMoKTtcblx0XHR9XG5cblx0XHRpZiAoIHR5cGVvZiBwYXJhbXNbIGZpbHRlcktleSBdICE9ICd1bmRlZmluZWQnICkge1xuXHRcdFx0Y29uc3QgcHJldlZhbHVlcyAgICAgID0gcGFyYW1zWyBmaWx0ZXJLZXkgXTtcblx0XHRcdGNvbnN0IHByZXZWYWx1ZXNBcnJheSA9IHByZXZWYWx1ZXMuc3BsaXQoIHZhbHVlU2VwYXJhdG9yICk7XG5cblx0XHRcdGlmICggcHJldlZhbHVlcy5sZW5ndGggPiAwICkge1xuXHRcdFx0XHRjb25zdCBmb3VuZCA9ICQuaW5BcnJheSggZmlsdGVyVmFsdWUsIHByZXZWYWx1ZXNBcnJheSApO1xuXG5cdFx0XHRcdGlmICggZm91bmQgPj0gMCApIHtcblx0XHRcdFx0XHQvLyBFbGVtZW50IHdhcyBmb3VuZCwgcmVtb3ZlIGl0LlxuXHRcdFx0XHRcdHByZXZWYWx1ZXNBcnJheS5zcGxpY2UoIGZvdW5kLCAxICk7XG5cblx0XHRcdFx0XHRpZiAoIHByZXZWYWx1ZXNBcnJheS5sZW5ndGggPT09IDAgKSB7XG5cdFx0XHRcdFx0XHRlbXB0eVZhbHVlID0gdHJ1ZTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0Ly8gRWxlbWVudCB3YXMgbm90IGZvdW5kLCBhZGQgaXQuXG5cdFx0XHRcdFx0cHJldlZhbHVlc0FycmF5LnB1c2goIGZpbHRlclZhbHVlICk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRpZiAoIHByZXZWYWx1ZXNBcnJheS5sZW5ndGggPiAxICkge1xuXHRcdFx0XHRcdG5leHRWYWx1ZXMgPSBwcmV2VmFsdWVzQXJyYXkuam9pbiggdmFsdWVTZXBhcmF0b3IgKTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRuZXh0VmFsdWVzID0gcHJldlZhbHVlc0FycmF5O1xuXHRcdFx0XHR9XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRuZXh0VmFsdWVzID0gZmlsdGVyVmFsdWU7XG5cdFx0XHR9XG5cdFx0fSBlbHNlIHtcblx0XHRcdG5leHRWYWx1ZXMgPSBmaWx0ZXJWYWx1ZTtcblx0XHR9XG5cblx0XHQvLyB1cGRhdGUgdXJsIGFuZCBxdWVyeSBzdHJpbmdcblx0XHRpZiAoICEgZW1wdHlWYWx1ZSApIHtcblx0XHRcdHdjYXBmVXBkYXRlUXVlcnlTdHJpbmdQYXJhbWV0ZXIoIGZpbHRlcktleSwgbmV4dFZhbHVlcyApO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRjb25zdCBxdWVyeSA9IHdjYXBmUmVtb3ZlUXVlcnlTdHJpbmdQYXJhbWV0ZXIoIGZpbHRlcktleSApO1xuXHRcdFx0aGlzdG9yeS5wdXNoU3RhdGUoIHt9LCAnJywgcXVlcnkgKTtcblx0XHR9XG5cblx0XHR3Y2FwZkZpbHRlclByb2R1Y3RzKCBmb3JjZVJlcmVuZGVyICk7XG5cdH1cblxuXHRmdW5jdGlvbiB3Y2FwZlNpbmdsZUZpbHRlciggZmlsdGVyS2V5LCBmaWx0ZXJWYWx1ZSApIHtcblx0XHRjb25zdCBwYXJhbXMgPSB3Y2FwZkdldFVybFZhcnMoKTtcblx0XHRsZXQgcXVlcnk7XG5cblx0XHRpZiAoIHR5cGVvZiBwYXJhbXNbIGZpbHRlcktleSBdICE9PSAndW5kZWZpbmVkJyAmJiBwYXJhbXNbIGZpbHRlcktleSBdID09PSBmaWx0ZXJWYWx1ZSApIHtcblx0XHRcdHF1ZXJ5ID0gd2NhcGZSZW1vdmVRdWVyeVN0cmluZ1BhcmFtZXRlciggZmlsdGVyS2V5ICk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHF1ZXJ5ID0gd2NhcGZVcGRhdGVRdWVyeVN0cmluZ1BhcmFtZXRlciggZmlsdGVyS2V5LCBmaWx0ZXJWYWx1ZSwgZmFsc2UgKTtcblx0XHR9XG5cblx0XHQvLyB1cGRhdGUgdXJsXG5cdFx0aGlzdG9yeS5wdXNoU3RhdGUoIHt9LCAnJywgcXVlcnkgKTtcblxuXHRcdHdjYXBmRmlsdGVyUHJvZHVjdHMoKTtcblx0fVxuXG5cdC8vIFRoZSBmdW5jdGlvbiB0byBoYW5kbGUgdGhlIGNvbW1vbiBmaWx0ZXIgcmVxdWVzdHMuXG5cdGZ1bmN0aW9uIGhhbmRsZUZpbHRlclJlcXVlc3QoICRpdGVtLCBmaWx0ZXJWYWx1ZSApIHtcblx0XHRjb25zdCAkZmllbGQgICAgICAgICA9ICRpdGVtLmNsb3Nlc3QoICcud2NhcGYtc2luZ2xlLWZpbHRlcicgKTtcblx0XHRjb25zdCBmaWVsZElEICAgICAgICA9ICRmaWVsZC5hdHRyKCAnZGF0YS1pZCcgKTtcblx0XHRjb25zdCBmaWVsZERhdGEgICAgICA9IGZpZWxkc1sgZmllbGRJRCBdO1xuXHRcdGNvbnN0IGZpbHRlcktleSAgICAgID0gZmllbGREYXRhLmZpbHRlcktleTtcblx0XHRjb25zdCBtdWx0aXBsZUZpbHRlciA9IGZpZWxkRGF0YS5tdWx0aXBsZUZpbHRlcjtcblxuXHRcdGlmICggISBmaWx0ZXJLZXkgKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0aWYgKCAhIGZpbHRlclZhbHVlLmxlbmd0aCApIHtcblx0XHRcdGNvbnN0IHF1ZXJ5ID0gd2NhcGZSZW1vdmVRdWVyeVN0cmluZ1BhcmFtZXRlciggZmlsdGVyS2V5ICk7XG5cdFx0XHRoaXN0b3J5LnB1c2hTdGF0ZSgge30sICcnLCBxdWVyeSApO1xuXG5cdFx0XHR3Y2FwZkZpbHRlclByb2R1Y3RzKCk7XG5cblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHRpZiAoIG11bHRpcGxlRmlsdGVyICkge1xuXHRcdFx0d2NhcGZNYWtlUGFyYW1ldGVycyggZmlsdGVyS2V5LCBmaWx0ZXJWYWx1ZSApO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHR3Y2FwZlNpbmdsZUZpbHRlciggZmlsdGVyS2V5LCBmaWx0ZXJWYWx1ZSApO1xuXHRcdH1cblx0fVxuXG5cdC8vIEhhbmRsZSB0aGUgZmlsdGVyIHJlcXVlc3QgZm9yIGxpc3QgZmllbGQuXG5cdCR3Y2FwZk5hdkZpbHRlcnMub24oXG5cdFx0J2NoYW5nZScsXG5cdFx0Jy53Y2FwZi1sYXllcmVkLW5hdiBbdHlwZT1cImNoZWNrYm94XCJdLCAud2NhcGYtbGF5ZXJlZC1uYXYgW3R5cGU9XCJyYWRpb1wiXScsXG5cdFx0ZnVuY3Rpb24oIGV2ZW50ICkge1xuXHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcblxuXHRcdFx0Y29uc3QgJGl0ZW0gICAgICAgPSAkKCB0aGlzICk7XG5cdFx0XHRjb25zdCBmaWx0ZXJWYWx1ZSA9ICRpdGVtLnZhbCgpO1xuXG5cdFx0XHRoYW5kbGVGaWx0ZXJSZXF1ZXN0KCAkaXRlbSwgZmlsdGVyVmFsdWUgKTtcblx0XHR9XG5cdCk7XG5cblx0Ly8gSGFuZGxlIHRoZSBmaWx0ZXIgcmVxdWVzdCBmb3IgbGFiZWxlZCBpdGVtLlxuXHQkd2NhcGZOYXZGaWx0ZXJzLm9uKCAnY2xpY2snLCAnLndjYXBmLWxhYmVsZWQtbmF2IC5pdGVtJywgZnVuY3Rpb24oIGV2ZW50ICkge1xuXHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cblx0XHRjb25zdCAkaXRlbSAgICAgICA9ICQoIHRoaXMgKTtcblx0XHRjb25zdCBmaWx0ZXJWYWx1ZSA9ICRpdGVtLmF0dHIoICdkYXRhLXZhbHVlJyApO1xuXG5cdFx0aGFuZGxlRmlsdGVyUmVxdWVzdCggJGl0ZW0sIGZpbHRlclZhbHVlICk7XG5cdH0gKTtcblxuXHQvLyBIYW5kbGUgdGhlIGZpbHRlciByZXF1ZXN0IGZvciBkaXNwbGF5IHR5cGUgc2VsZWN0IGZpZWxkcy5cblx0JHdjYXBmTmF2RmlsdGVycy5vbiggJ2NoYW5nZScsICdzZWxlY3QnLCBmdW5jdGlvbiggZXZlbnQgKSB7XG5cdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcblxuXHRcdGNvbnN0ICRpdGVtICAgICAgID0gJCggdGhpcyApO1xuXHRcdGNvbnN0IGZpbHRlclZhbHVlID0gJGl0ZW0udmFsKCk7XG5cblx0XHRjb25zdCAkZmllbGQgICAgPSAkaXRlbS5jbG9zZXN0KCAnLndjYXBmLXNpbmdsZS1maWx0ZXInICk7XG5cdFx0Y29uc3QgZmllbGRJRCAgID0gJGZpZWxkLmF0dHIoICdkYXRhLWlkJyApO1xuXHRcdGNvbnN0IGZpZWxkRGF0YSA9IGZpZWxkc1sgZmllbGRJRCBdO1xuXHRcdGNvbnN0IGZpbHRlcktleSA9IGZpZWxkRGF0YS5maWx0ZXJLZXk7XG5cblx0XHRpZiAoICEgZmlsdGVyVmFsdWUubGVuZ3RoICkge1xuXHRcdFx0Y29uc3QgcXVlcnkgPSB3Y2FwZlJlbW92ZVF1ZXJ5U3RyaW5nUGFyYW1ldGVyKCBmaWx0ZXJLZXkgKTtcblx0XHRcdGhpc3RvcnkucHVzaFN0YXRlKCB7fSwgJycsIHF1ZXJ5ICk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdGNvbnN0IGZpbHRlclZhbFN0cmluZyA9IGZpbHRlclZhbHVlLnRvU3RyaW5nKCk7XG5cdFx0XHR3Y2FwZlVwZGF0ZVF1ZXJ5U3RyaW5nUGFyYW1ldGVyKCBmaWx0ZXJLZXksIGZpbHRlclZhbFN0cmluZyApO1xuXHRcdH1cblxuXHRcdHdjYXBmRmlsdGVyUHJvZHVjdHMoKTtcblx0fSApO1xuXG5cdC8qKlxuXHQgKiBIYW5kbGUgdGhlIGZpbHRlciByZXF1ZXN0IGZvciByYW5nZSBudW1iZXIuXG5cdCAqL1xuXHRjb25zdCByYW5nZU51bWJlclNlbGVjdG9ycyA9ICcud2NhcGYtcmFuZ2UtbnVtYmVyIC5taW4tdmFsdWUsIC53Y2FwZi1yYW5nZS1udW1iZXIgLm1heC12YWx1ZSc7XG5cblx0JHdjYXBmTnVtYmVyUmFuZ2VGaWx0ZXJzLm9uKCAnaW5wdXQnLCByYW5nZU51bWJlclNlbGVjdG9ycywgZnVuY3Rpb24oIGV2ZW50ICkge1xuXHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cblx0XHRjb25zdCAkaXRlbSA9ICQoIHRoaXMgKTtcblxuXHRcdC8vIENsZWFyIGFueSBwcmV2aW91c2x5IHNldCB0aW1lciBiZWZvcmUgc2V0dGluZyBhIGZyZXNoIG9uZVxuXHRcdGNsZWFyVGltZW91dCggJGl0ZW0uZGF0YSggJ3RpbWVyJyApICk7XG5cblx0XHQkaXRlbS5kYXRhKCAndGltZXInLCBzZXRUaW1lb3V0KCBmdW5jdGlvbigpIHtcblx0XHRcdCRpdGVtLnJlbW92ZURhdGEoICd0aW1lcicgKTtcblxuXHRcdFx0Y29uc3QgJHJhbmdlTnVtYmVyICA9ICRpdGVtLmNsb3Nlc3QoICcud2NhcGYtcmFuZ2UtbnVtYmVyJyApO1xuXHRcdFx0Y29uc3QgZmlsdGVyS2V5ICAgICA9ICRyYW5nZU51bWJlci5hdHRyKCAnZGF0YS1maWx0ZXIta2V5JyApO1xuXHRcdFx0Y29uc3QgcmFuZ2VNaW5WYWx1ZSA9ICRyYW5nZU51bWJlci5hdHRyKCAnZGF0YS1yYW5nZS1taW4tdmFsdWUnICk7XG5cdFx0XHRjb25zdCByYW5nZU1heFZhbHVlID0gJHJhbmdlTnVtYmVyLmF0dHIoICdkYXRhLXJhbmdlLW1heC12YWx1ZScgKTtcblx0XHRcdGxldCBtaW5WYWx1ZSAgICAgICAgPSAkcmFuZ2VOdW1iZXIuZmluZCggJy5taW4tdmFsdWUnICkudmFsKCk7XG5cdFx0XHRsZXQgbWF4VmFsdWUgICAgICAgID0gJHJhbmdlTnVtYmVyLmZpbmQoICcubWF4LXZhbHVlJyApLnZhbCgpO1xuXG5cdFx0XHQvLyBGb3JjZSB0aGUgbWluVmFsdWUgbm90IHRvIGJlIGVtcHR5LlxuXHRcdFx0aWYgKCAhIG1pblZhbHVlLmxlbmd0aCApIHtcblx0XHRcdFx0bWluVmFsdWUgPSByYW5nZU1pblZhbHVlO1xuXG5cdFx0XHRcdCRyYW5nZU51bWJlci5maW5kKCAnLm1pbi12YWx1ZScgKS52YWwoIG1pblZhbHVlICk7XG5cdFx0XHR9XG5cblx0XHRcdC8vIEZvcmNlIHRoZSBtYXhWYWx1ZSBub3QgdG8gYmUgZW1wdHkuXG5cdFx0XHRpZiAoICEgbWF4VmFsdWUubGVuZ3RoICkge1xuXHRcdFx0XHRtYXhWYWx1ZSA9IHJhbmdlTWF4VmFsdWU7XG5cblx0XHRcdFx0JHJhbmdlTnVtYmVyLmZpbmQoICcubWF4LXZhbHVlJyApLnZhbCggbWF4VmFsdWUgKTtcblx0XHRcdH1cblxuXHRcdFx0Ly8gRm9yY2UgdGhlIG1pblZhbHVlIG5vdCB0byBnbyBiZWxvdyB0aGUgcmFuZ2VNaW5WYWx1ZS5cblx0XHRcdGlmICggcGFyc2VGbG9hdCggbWluVmFsdWUgKSA8IHBhcnNlRmxvYXQoIHJhbmdlTWluVmFsdWUgKSApIHtcblx0XHRcdFx0bWluVmFsdWUgPSByYW5nZU1pblZhbHVlO1xuXG5cdFx0XHRcdCRyYW5nZU51bWJlci5maW5kKCAnLm1pbi12YWx1ZScgKS52YWwoIG1pblZhbHVlICk7XG5cdFx0XHR9XG5cblx0XHRcdC8vIEZvcmNlIHRoZSBtaW5WYWx1ZSBub3QgdG8gZ28gdXAgdGhlIHJhbmdlTWF4VmFsdWUuXG5cdFx0XHRpZiAoIHBhcnNlRmxvYXQoIG1pblZhbHVlICkgPiBwYXJzZUZsb2F0KCByYW5nZU1heFZhbHVlICkgKSB7XG5cdFx0XHRcdG1pblZhbHVlID0gcmFuZ2VNYXhWYWx1ZTtcblxuXHRcdFx0XHQkcmFuZ2VOdW1iZXIuZmluZCggJy5taW4tdmFsdWUnICkudmFsKCBtaW5WYWx1ZSApO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBGb3JjZSB0aGUgbWF4VmFsdWUgbm90IHRvIGdvIHVwIHRoZSByYW5nZU1heFZhbHVlLlxuXHRcdFx0aWYgKCBwYXJzZUZsb2F0KCBtYXhWYWx1ZSApID4gcGFyc2VGbG9hdCggcmFuZ2VNYXhWYWx1ZSApICkge1xuXHRcdFx0XHRtYXhWYWx1ZSA9IHJhbmdlTWF4VmFsdWU7XG5cblx0XHRcdFx0JHJhbmdlTnVtYmVyLmZpbmQoICcubWF4LXZhbHVlJyApLnZhbCggbWF4VmFsdWUgKTtcblx0XHRcdH1cblxuXHRcdFx0Ly8gRm9yY2UgdGhlIG1heFZhbHVlIG5vdCB0byBnbyBiZWxvdyB0aGUgbWluVmFsdWUuXG5cdFx0XHRpZiAoIHBhcnNlRmxvYXQoIG1pblZhbHVlICkgPiBwYXJzZUZsb2F0KCBtYXhWYWx1ZSApICkge1xuXHRcdFx0XHRtYXhWYWx1ZSA9IG1pblZhbHVlO1xuXG5cdFx0XHRcdCRyYW5nZU51bWJlci5maW5kKCAnLm1heC12YWx1ZScgKS52YWwoIG1heFZhbHVlICk7XG5cdFx0XHR9XG5cblx0XHRcdGlmICggbWluVmFsdWUgPT09IHJhbmdlTWluVmFsdWUgJiYgbWF4VmFsdWUgPT09IHJhbmdlTWF4VmFsdWUgKSB7XG5cdFx0XHRcdGNvbnN0IHF1ZXJ5ID0gd2NhcGZSZW1vdmVRdWVyeVN0cmluZ1BhcmFtZXRlciggZmlsdGVyS2V5ICk7XG5cdFx0XHRcdGhpc3RvcnkucHVzaFN0YXRlKCB7fSwgJycsIHF1ZXJ5ICk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRjb25zdCBmaWx0ZXJWYWxTdHJpbmcgPSBtaW5WYWx1ZSArIHJhbmdlVmFsdWVzU2VwYXJhdG9yICsgbWF4VmFsdWU7XG5cdFx0XHRcdHdjYXBmVXBkYXRlUXVlcnlTdHJpbmdQYXJhbWV0ZXIoIGZpbHRlcktleSwgZmlsdGVyVmFsU3RyaW5nICk7XG5cdFx0XHR9XG5cblx0XHRcdHdjYXBmRmlsdGVyUHJvZHVjdHMoKTtcblx0XHR9LCBkZWxheSApICk7XG5cdH0gKTtcblxuXHQvLyBIYW5kbGUgcmVtb3ZpbmcgdGhlIGFjdGl2ZSBmaWx0ZXJzLlxuXHQkd2NhcGZOYXZGaWx0ZXJzLm9uKCAnY2xpY2snLCAnLndjYXBmLWFjdGl2ZS1maWx0ZXJzIC5pdGVtJywgZnVuY3Rpb24oIGV2ZW50ICkge1xuXHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cblx0XHRjb25zdCAkaXRlbSAgICAgICA9ICQoIHRoaXMgKTtcblx0XHRjb25zdCBmaWx0ZXJLZXkgICA9ICRpdGVtLmF0dHIoICdkYXRhLWZpbHRlci1rZXknICk7XG5cdFx0Y29uc3QgZmlsdGVyVmFsdWUgPSAkaXRlbS5hdHRyKCAnZGF0YS12YWx1ZScgKTtcblxuXHRcdHdjYXBmTWFrZVBhcmFtZXRlcnMoIGZpbHRlcktleSwgZmlsdGVyVmFsdWUsIHRydWUgKTtcblx0fSApO1xuXG5cdGZ1bmN0aW9uIHJlc2V0RmlsdGVycyggJGJ1dHRvbiApIHtcblx0XHRjb25zdCBfZmlsdGVyS2V5cyA9ICRidXR0b24uYXR0ciggJ2RhdGEta2V5cycgKTtcblxuXHRcdGlmICggISBfZmlsdGVyS2V5cyApIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHRjb25zdCBmaWx0ZXJLZXlzID0gX2ZpbHRlcktleXMuc3BsaXQoICcsJyApO1xuXG5cdFx0bGV0IHF1ZXJ5ID0gJyc7XG5cblx0XHQkLmVhY2goIGZpbHRlcktleXMsIGZ1bmN0aW9uKCBpLCBmaWx0ZXJLZXkgKSB7XG5cdFx0XHRpZiAoIHF1ZXJ5ICkge1xuXHRcdFx0XHRxdWVyeSA9IHdjYXBmUmVtb3ZlUXVlcnlTdHJpbmdQYXJhbWV0ZXIoIGZpbHRlcktleSwgcXVlcnkgKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHF1ZXJ5ID0gd2NhcGZSZW1vdmVRdWVyeVN0cmluZ1BhcmFtZXRlciggZmlsdGVyS2V5ICk7XG5cdFx0XHR9XG5cdFx0fSApO1xuXG5cdFx0Ly8gRW1wdHkgcXVlcnkgY2F1c2VzIGlzc3VlKGRvZXNuJ3QgcmVtb3ZlIHRoZSBmaWx0ZXIga2V5cyBmcm9tIHRoZSB1cmwpLFxuXHRcdC8vIHRoaXMgaXMgd2h5IHdlIGFyZSBzZXR0aW5nIHRoZSBwYWdlIHVybCBhcyBxdWVyeS5cblx0XHRpZiAoICEgcXVlcnkgKSB7XG5cdFx0XHRjb25zdCBwcmV2VXJsID0gd2luZG93LmxvY2F0aW9uLmhyZWY7XG5cdFx0XHRjb25zdCBuZXdVcmwgID0gcHJldlVybC5zcGxpdCggJz8nICk7XG5cblx0XHRcdHF1ZXJ5ID0gbmV3VXJsWyAwIF07XG5cdFx0fVxuXG5cdFx0aGlzdG9yeS5wdXNoU3RhdGUoIHt9LCAnJywgcXVlcnkgKTtcblxuXHRcdHdjYXBmRmlsdGVyUHJvZHVjdHMoIHRydWUgKTtcblx0fVxuXG5cdC8vIENsZWFyL1Jlc2V0IGFsbCBmaWx0ZXJzLlxuXHQkYm9keS5vbiggJ3djYXBmLXJlc2V0LWZpbHRlcnMnLCBmdW5jdGlvbiggZSwgJGJ1dHRvbiApIHtcblx0XHRyZXNldEZpbHRlcnMoICRidXR0b24gKTtcblx0fSApO1xuXG5cdCR3Y2FwZk5hdkZpbHRlcnMub24oICdjbGljaycsICcud2NhcGYtcmVzZXQtZmlsdGVycy1idG4nLCBmdW5jdGlvbiggZXZlbnQgKSB7XG5cdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcblxuXHRcdGNvbnN0ICRidXR0b24gPSAkKCB0aGlzICk7XG5cblx0XHQkYm9keS50cmlnZ2VyKCAnd2NhcGYtcmVzZXQtZmlsdGVycycsIFsgJGJ1dHRvbiBdICk7XG5cdH0gKTtcblxuXHQkd2NhcGZTaW5nbGVGaWx0ZXJzLm9uKCAnd2NhcGYtY2xlYXItZmlsdGVyJywgZnVuY3Rpb24oKSB7XG5cdFx0Y29uc3QgJGZpZWxkICAgID0gJCggdGhpcyApO1xuXHRcdGNvbnN0IGZpZWxkSUQgICA9ICRmaWVsZC5hdHRyKCAnZGF0YS1pZCcgKTtcblx0XHRjb25zdCBmaWVsZERhdGEgPSBmaWVsZHNbIGZpZWxkSUQgXTtcblx0XHRjb25zdCBmaWx0ZXJLZXkgPSBmaWVsZERhdGEuZmlsdGVyS2V5O1xuXG5cdFx0Y29uc3QgcXVlcnkgPSB3Y2FwZlJlbW92ZVF1ZXJ5U3RyaW5nUGFyYW1ldGVyKCBmaWx0ZXJLZXkgKTtcblx0XHRoaXN0b3J5LnB1c2hTdGF0ZSgge30sICcnLCBxdWVyeSApO1xuXG5cdFx0d2NhcGZGaWx0ZXJQcm9kdWN0cyggdHJ1ZSApO1xuXHR9ICk7XG5cblx0JGJvZHkub24oICd3Y2FwZi1ydW4tZmlsdGVyLXByb2R1Y3RzJywgZnVuY3Rpb24oIGUsIGZvcmNlUmVSZW5kZXIgKSB7XG5cdFx0d2NhcGZGaWx0ZXJQcm9kdWN0cyggZm9yY2VSZVJlbmRlciApO1xuXHR9ICk7XG5cblx0Ly8gSGlzdG9yeSBiYWNrIGFuZCBmb3J3YXJkIHJlcXVlc3QgaGFuZGxpbmcuXG5cdCQoIHdpbmRvdyApLmJpbmQoICdwb3BzdGF0ZScsIGZ1bmN0aW9uKCkge1xuXHRcdHdjYXBmRmlsdGVyUHJvZHVjdHMoIHRydWUgKTtcblx0fSApO1xuXG59ICk7XG4iXX0=
