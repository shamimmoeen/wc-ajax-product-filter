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
  'enable_chosen_for_default_sorting': '',
  'preserve_hierarchy_accordion_state': '',
  'enable_animation_for_hierarchy_accordion': '',
  'show_results_loading': '',
  'hierarchy_accordion_animation_speed': '',
  'hierarchy_accordion_animation_easing': '',
  'scroll_to_top_speed': '',
  'scroll_to_top_easing': '',
  'shop_loop_container': '',
  'not_found_container': '',
  'pagination_container': '',
  // todo
  'sorting_control': '',
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
        $child.slideToggle(wcapf_params.hierarchy_accordion_animation_speed, wcapf_params.hierarchy_accordion_animation_easing);
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
  }

  function initDefaultOrderBy() {
    var $container = $(wcapf_params.shop_loop_container); // Attach chosen.

    if (wcapf_params.enable_chosen_for_default_sorting) {
      if (jQuery().chosen) {
        $container.find('.woocommerce-ordering select.orderby').chosen({
          'disable_search_threshold': 15
        });
      }
    }

    if (!wcapf_params.sorting_control) {
      $container.find('.woocommerce-ordering').each(function () {
        var $orderingForm = $(this);
        $orderingForm.on('change', 'select.orderby', function () {
          $orderingForm.submit();
        });
      });
      return;
    }

    $container.find('.woocommerce-ordering').each(function () {
      var $orderingForm = $(this);
      $orderingForm.on('submit', function (e) {
        e.preventDefault();
      });
      $orderingForm.on('change', 'select.orderby', function (e) {
        e.preventDefault();
        var order = $(this).val();
        var filter_key = 'orderby';
        wcapfUpdateQueryStringParameter(filter_key, order);
        wcapfFilterProducts();
      });
    });
  }

  initDefaultOrderBy(); // Things are done after applying the filter like scroll to top.

  function wcapfAfterUpdate() {
    initChosen();
    initHierarchyAccordion();
    initNoUISlider();
    initDatepicker();
    initDefaultOrderBy(); // todo
    // init pagination

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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImZpbHRlci1mb3JtLmpzIl0sIm5hbWVzIjpbIndjYXBmX3BhcmFtcyIsImpRdWVyeSIsImRvY3VtZW50IiwicmVhZHkiLCIkIiwiJGJvZHkiLCJyYW5nZVZhbHVlc1NlcGFyYXRvciIsIl9kZWxheSIsInBhcnNlSW50IiwiZmlsdGVyX2lucHV0X2RlbGF5IiwiZGVsYXkiLCJmaWVsZHMiLCIkd2NhcGZTaW5nbGVGaWx0ZXJzIiwiJHdjYXBmTmF2RmlsdGVycyIsIiR3Y2FwZk51bWJlclJhbmdlRmlsdGVycyIsImVhY2giLCIkZmllbGQiLCJpZCIsImF0dHIiLCIkd3JhcHBlciIsImZpbmQiLCJmaWx0ZXJLZXkiLCJtdWx0aXBsZUZpbHRlciIsImluaXRDaG9zZW4iLCJjaG9zZW4iLCIkdGhpcyIsIm9wdGlvbnMiLCJub1Jlc3VsdHNNZXNzYWdlIiwic2VhcmNoVGhyZXNob2xkIiwiY2hvc2VuX2xpYl9zZWFyY2hfdGhyZXNob2xkIiwiaW5pdEhpZXJhcmNoeUFjY29yZGlvbiIsIm9uIiwiJGNoaWxkIiwicGFyZW50IiwiY2hpbGRyZW4iLCJ0b2dnbGVDbGFzcyIsImVuYWJsZV9hbmltYXRpb25fZm9yX2hpZXJhcmNoeV9hY2NvcmRpb24iLCJzbGlkZVRvZ2dsZSIsImhpZXJhcmNoeV9hY2NvcmRpb25fYW5pbWF0aW9uX3NwZWVkIiwiaGllcmFyY2h5X2FjY29yZGlvbl9hbmltYXRpb25fZWFzaW5nIiwidG9nZ2xlIiwibnVtYmVyX2Zvcm1hdCIsIm51bWJlciIsImRlY2ltYWxzIiwiZGVjX3BvaW50IiwidGhvdXNhbmRzX3NlcCIsInJlcGxhY2UiLCJuIiwiaXNGaW5pdGUiLCJwcmVjIiwiTWF0aCIsImFicyIsInNlcCIsImRlYyIsInMiLCJ0b0ZpeGVkRml4IiwiayIsInBvdyIsInJvdW5kIiwic3BsaXQiLCJsZW5ndGgiLCJBcnJheSIsImpvaW4iLCJpbml0Tm9VSVNsaWRlciIsIm5vVWlTbGlkZXIiLCIkaXRlbSIsIiRzbGlkZXIiLCJoYXNDbGFzcyIsInNsaWRlcklkIiwiZGlzcGxheVZhbHVlc0FzIiwicmFuZ2VNaW5WYWx1ZSIsInBhcnNlRmxvYXQiLCJyYW5nZU1heFZhbHVlIiwic3RlcCIsImRlY2ltYWxQbGFjZXMiLCJ0aG91c2FuZFNlcGFyYXRvciIsImRlY2ltYWxTZXBhcmF0b3IiLCJtaW5WYWx1ZSIsIm1heFZhbHVlIiwiJG1pblZhbHVlIiwiJG1heFZhbHVlIiwic2xpZGVyIiwiZ2V0RWxlbWVudEJ5SWQiLCJjcmVhdGUiLCJzdGFydCIsImNvbm5lY3QiLCJjc3NQcmVmaXgiLCJyYW5nZSIsInZhbHVlcyIsImh0bWwiLCJ2YWwiLCJ0cmlnZ2VyIiwiZmlsdGVyUHJvZHVjdHNBY2NvcmRpbmdUb1NsaWRlciIsInF1ZXJ5Iiwid2NhcGZSZW1vdmVRdWVyeVN0cmluZ1BhcmFtZXRlciIsImhpc3RvcnkiLCJwdXNoU3RhdGUiLCJmaWx0ZXJWYWxTdHJpbmciLCJ3Y2FwZlVwZGF0ZVF1ZXJ5U3RyaW5nUGFyYW1ldGVyIiwid2NhcGZGaWx0ZXJQcm9kdWN0cyIsImNsZWFyVGltZW91dCIsImRhdGEiLCJzZXRUaW1lb3V0IiwicmVtb3ZlRGF0YSIsImV2ZW50IiwicHJldmVudERlZmF1bHQiLCIkaW5wdXQiLCJzZXQiLCJnZXQiLCJmaWx0ZXJCeURhdGUiLCIkd2NhcGZEYXRlRmlsdGVyIiwiY2xvc2VzdCIsImlzUmFuZ2UiLCJmaWx0ZXJWYWx1ZSIsInJ1bkZpbHRlciIsImZyb20iLCJ0byIsImluaXREYXRlcGlja2VyIiwiZGF0ZXBpY2tlciIsIiR3Y2FwZkRhdGVGaWx0ZXJzIiwiZm9ybWF0IiwieWVhckRyb3Bkb3duIiwibW9udGhEcm9wZG93biIsIiRmcm9tIiwiJHRvIiwiZGF0ZUZvcm1hdCIsImNoYW5nZVllYXIiLCJjaGFuZ2VNb250aCIsIndjYXBmQmVmb3JlVXBkYXRlIiwiY29udGFpbmVyIiwic2hvcF9sb29wX2NvbnRhaW5lciIsIm5vdF9mb3VuZF9jb250YWluZXIiLCJzaG93X3Jlc3VsdHNfbG9hZGluZyIsImxvYWRpbmdNYXJrdXAiLCJwcmVwZW5kVG8iLCJzY3JvbGxfdG9fdG9wIiwiYWRqdXN0aW5nT2Zmc2V0Iiwib2Zmc2V0Iiwic2Nyb2xsX3RvX3RvcF9vZmZzZXQiLCIkY29udGFpbmVyIiwidG9wIiwic3RvcCIsImFuaW1hdGUiLCJzY3JvbGxUb3AiLCJzY3JvbGxfdG9fdG9wX3NwZWVkIiwic2Nyb2xsX3RvX3RvcF9lYXNpbmciLCJpbml0RGVmYXVsdE9yZGVyQnkiLCJlbmFibGVfY2hvc2VuX2Zvcl9kZWZhdWx0X3NvcnRpbmciLCJzb3J0aW5nX2NvbnRyb2wiLCIkb3JkZXJpbmdGb3JtIiwic3VibWl0IiwiZSIsIm9yZGVyIiwiZmlsdGVyX2tleSIsIndjYXBmQWZ0ZXJVcGRhdGUiLCJmb3JjZVJlUmVuZGVyIiwid2luZG93IiwibG9jYXRpb24iLCJocmVmIiwiJGRhdGEiLCJmaWVsZElEIiwiJGlubmVyIiwiX2ZpZWxkIiwiZmllbGRDbGFzcyIsInByZXNlcnZlX2hpZXJhcmNoeV9hY2NvcmRpb25fc3RhdGUiLCJpdGVtVmFsdWUiLCJ0b2dnbGVTZWxlY3RvciIsInVsU2VsZWN0b3IiLCJfY2xhc3NlcyIsInNob3ciLCJfaHRtbCIsIiRzaG9wTG9vcENvbnRhaW5lciIsIiRub3RGb3VuZENvbnRhaW5lciIsImN1c3RvbV9zY3JpcHRzIiwiZXZhbCIsIndjYXBmR2V0VXJsVmFycyIsInVybCIsInZhcnMiLCJoYXNoIiwicmVwbGFjZUFsbCIsImhhc2hlcyIsInNsaWNlIiwiaW5kZXhPZiIsImhMZW5ndGgiLCJpIiwid2NhcGZGaXhQYWdpbmF0aW9uIiwicGFyYW1zIiwiY3VycmVudFBhZ2VJblVybCIsImN1cnJlbnRQYWdlSW5QYXJhbXMiLCJrZXkiLCJ2YWx1ZSIsInB1c2hIaXN0b3J5IiwicmUiLCJSZWdFeHAiLCJzZXBhcmF0b3IiLCJ1cmxXaXRoUXVlcnkiLCJtYXRjaCIsIm9sZFBhcmFtcyIsIm9sZFBhcmFtc0xlbmd0aCIsIk9iamVjdCIsImtleXMiLCJzdGFydFBvc2l0aW9uIiwiZmlsdGVyS2V5UG9zaXRpb24iLCJjbGVhblVybCIsImNsZWFuUXVlcnkiLCJuZXdQYXJhbXMiLCJ3Y2FwZk1ha2VQYXJhbWV0ZXJzIiwiZm9yY2VSZXJlbmRlciIsInZhbHVlU2VwYXJhdG9yIiwibmV4dFZhbHVlcyIsImVtcHR5VmFsdWUiLCJwcmV2VmFsdWVzIiwicHJldlZhbHVlc0FycmF5IiwiZm91bmQiLCJpbkFycmF5Iiwic3BsaWNlIiwicHVzaCIsIndjYXBmU2luZ2xlRmlsdGVyIiwiaGFuZGxlRmlsdGVyUmVxdWVzdCIsImZpZWxkRGF0YSIsInRvU3RyaW5nIiwicmFuZ2VOdW1iZXJTZWxlY3RvcnMiLCIkcmFuZ2VOdW1iZXIiLCJyZXNldEZpbHRlcnMiLCIkYnV0dG9uIiwiX2ZpbHRlcktleXMiLCJmaWx0ZXJLZXlzIiwicHJldlVybCIsIm5ld1VybCIsImJpbmQiXSwibWFwcGluZ3MiOiI7O0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBLElBQU1BLFlBQVksR0FBR0EsWUFBWSxJQUFJO0FBQ3BDLHdCQUFzQixFQURjO0FBRXBDLGlDQUErQixFQUZLO0FBR3BDLHVDQUFxQyxFQUhEO0FBSXBDLHdDQUFzQyxFQUpGO0FBS3BDLDhDQUE0QyxFQUxSO0FBTXBDLDBCQUF3QixFQU5ZO0FBT3BDLHlDQUF1QyxFQVBIO0FBUXBDLDBDQUF3QyxFQVJKO0FBU3BDLHlCQUF1QixFQVRhO0FBVXBDLDBCQUF3QixFQVZZO0FBV3BDLHlCQUF1QixFQVhhO0FBWXBDLHlCQUF1QixFQVphO0FBYXBDLDBCQUF3QixFQWJZO0FBYVI7QUFDNUIscUJBQW1CLEVBZGlCO0FBZXBDLG1CQUFpQixFQWZtQjtBQWdCcEMsMEJBQXdCLEVBaEJZO0FBaUJwQyxvQkFBa0I7QUFqQmtCLENBQXJDO0FBb0JBQyxNQUFNLENBQUVDLFFBQUYsQ0FBTixDQUFtQkMsS0FBbkIsQ0FBMEIsVUFBVUMsQ0FBVixFQUFjO0FBRXZDLE1BQU1DLEtBQUssR0FBR0QsQ0FBQyxDQUFFLE1BQUYsQ0FBZjtBQUVBLE1BQU1FLG9CQUFv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QUF1QyxVQUFVd0gsQ0FBVixFQUFhSSxhQUFiLEVBQTZCO0FBQ25FeEQsSUFBQUEsbUJBQW1CLENBQUV3RCxhQUFGLENBQW5CO0FBQ0EsR0FGRCxFQXA1QnVDLENBdzVCdkM7O0FBQ0F2SixFQUFBQSxDQUFDLENBQUV3SixNQUFGLENBQUQsQ0FBWXlFLElBQVosQ0FBa0IsVUFBbEIsRUFBOEIsWUFBVztBQUN4Q2xJLElBQUFBLG1CQUFtQixDQUFFLElBQUYsQ0FBbkI7QUFDQSxHQUZEO0FBSUEsQ0E3NUJEIiwiZmlsZSI6IndjLWFqYXgtcHJvZHVjdC1maWx0ZXItcHVibGljLXNjcmlwdHMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIFRoZSBmcm9udGVuZCBmaWx0ZXIgZm9ybS5cbiAqXG4gKiBAc2luY2UgICAgICAzLjAuMFxuICogQHBhY2thZ2UgICAgd2MtYWpheC1wcm9kdWN0LWZpbHRlclxuICogQHN1YnBhY2thZ2Ugd2MtYWpheC1wcm9kdWN0LWZpbHRlci9wdWJsaWMvc3JjL2pzXG4gKiBAYXV0aG9yICAgICBNYWludWwgSGFzc2FuIE1haW5cbiAqL1xuXG5jb25zdCB3Y2FwZl9wYXJhbXMgPSB3Y2FwZl9wYXJhbXMgfHwge1xuXHQnZmlsdGVyX2lucHV0X2RlbGF5JzogJycsXG5cdCdjaG9zZW5fbGliX3NlYXJjaF90aHJlc2hvbGQnOiAnJyxcblx0J2VuYWJsZV9jaG9zZW5fZm9yX2RlZmF1bHRfc29ydGluZyc6ICcnLFxuXHQncHJlc2VydmVfaGllcmFyY2h5X2FjY29yZGlvbl9zdGF0ZSc6ICcnLFxuXHQnZW5hYmxlX2FuaW1hdGlvbl9mb3JfaGllcmFyY2h5X2FjY29yZGlvbic6ICcnLFxuXHQnc2hvd19yZXN1bHRzX2xvYWRpbmcnOiAnJyxcblx0J2hpZXJhcmNoeV9hY2NvcmRpb25fYW5pbWF0aW9uX3NwZWVkJzogJycsXG5cdCdoaWVyYXJjaHlfYWNjb3JkaW9uX2FuaW1hdGlvbl9lYXNpbmcnOiAnJyxcblx0J3Njcm9sbF90b190b3Bfc3BlZWQnOiAnJyxcblx0J3Njcm9sbF90b190b3BfZWFzaW5nJzogJycsXG5cdCdzaG9wX2xvb3BfY29udGFpbmVyJzogJycsXG5cdCdub3RfZm91bmRfY29udGFpbmVyJzogJycsXG5cdCdwYWdpbmF0aW9uX2NvbnRhaW5lcic6ICcnLCAvLyB0b2RvXG5cdCdzb3J0aW5nX2NvbnRyb2wnOiAnJyxcblx0J3Njcm9sbF90b190b3AnOiAnJyxcblx0J3Njcm9sbF90b190b3Bfb2Zmc2V0JzogJycsXG5cdCdjdXN0b21fc2NyaXB0cyc6ICcnLFxufTtcblxualF1ZXJ5KCBkb2N1bWVudCApLnJlYWR5KCBmdW5jdGlvbiggJCApIHtcblxuXHRjb25zdCAkYm9keSA9ICQoICdib2R5JyApO1xuXG5cdGNvbnN0IHJhbmdlVmFsdWVzU2VwYXJhdG9yID0gJ34nO1xuXG5cdGNvbnN0IF9kZWxheSA9IHBhcnNlSW50KCB3Y2FwZl9wYXJhbXMuZmlsdGVyX2lucHV0X2RlbGF5ICk7XG5cdGNvbnN0IGRlbGF5ICA9IF9kZWxheSA+PSAwID8gX2RlbGF5IDogODAwO1xuXG5cdC8vIFN0b3JlIGZpZWxkcycgaWQgYW5kIGZpbHRlciBpbmZvcm1hdGlvbi5cblx0Y29uc3QgZmllbGRzID0ge307XG5cblx0Y29uc3QgJHdjYXBmU2luZ2xlRmlsdGVycyAgICAgID0gJCggJy53Y2FwZi1zaW5nbGUtZmlsdGVyJyApO1xuXHRjb25zdCAkd2NhcGZOYXZGaWx0ZXJzICAgICAgICAgPSAkKCAnLndjYXBmLW5hdi1maWx0ZXInICk7XG5cdGNvbnN0ICR3Y2FwZk51bWJlclJhbmdlRmlsdGVycyA9ICQoICcud2NhcGYtbnVtYmVyLXJhbmdlLWZpbHRlcicgKTtcblxuXHQkd2NhcGZTaW5nbGVGaWx0ZXJzLmVhY2goIGZ1bmN0aW9uKCkge1xuXHRcdGNvbnN0ICRmaWVsZCAgICAgICAgID0gJCggdGhpcyApO1xuXHRcdGNvbnN0IGlkICAgICAgICAgICAgID0gJGZpZWxkLmF0dHIoICdkYXRhLWlkJyApO1xuXHRcdGNvbnN0ICR3cmFwcGVyICAgICAgID0gJGZpZWxkLmZpbmQoICcud2NhcGYtZmllbGQtaW5uZXIgPiBkaXYnICk7XG5cdFx0Y29uc3QgZmlsdGVyS2V5ICAgICAgPSAkd3JhcHBlci5hdHRyKCAnZGF0YS1maWx0ZXIta2V5JyApO1xuXHRcdGNvbnN0IG11bHRpcGxlRmlsdGVyID0gcGFyc2VJbnQoICR3cmFwcGVyLmF0dHIoICdkYXRhLW11bHRpcGxlLWZpbHRlcicgKSApO1xuXG5cdFx0ZmllbGRzWyBpZCBdID0ge1xuXHRcdFx0ZmlsdGVyS2V5OiBmaWx0ZXJLZXksXG5cdFx0XHRtdWx0aXBsZUZpbHRlcjogbXVsdGlwbGVGaWx0ZXJcblx0XHR9O1xuXHR9ICk7XG5cblx0Ly8gSW5pdGlhbGl6ZSBqUXVlcnkgY2hvc2VuIGxpYnJhcnkuXG5cdGZ1bmN0aW9uIGluaXRDaG9zZW4oKSB7XG5cdFx0aWYgKCAhIGpRdWVyeSgpLmNob3NlbiApIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHQkd2NhcGZOYXZGaWx0ZXJzLmZpbmQoICcud2NhcGYtY2hvc2VuLXNlbGVjdCcgKS5lYWNoKCBmdW5jdGlvbigpIHtcblx0XHRcdGNvbnN0ICR0aGlzICAgPSAkKCB0aGlzICk7XG5cdFx0XHRjb25zdCBvcHRpb25zID0ge307XG5cblx0XHRcdGNvbnN0IG5vUmVzdWx0c01lc3NhZ2UgPSAkdGhpcy5hdHRyKCAnZGF0YS1uby1yZXN1bHRzLW1lc3NhZ2UnICk7XG5cblx0XHRcdGlmICggbm9SZXN1bHRzTWVzc2FnZSApIHtcblx0XHRcdFx0b3B0aW9uc1sgJ25vX3Jlc3VsdHNfdGV4dCcgXSA9IG5vUmVzdWx0c01lc3NhZ2U7XG5cdFx0XHR9XG5cblx0XHRcdGNvbnN0IHNlYXJjaFRocmVzaG9sZCA9IHBhcnNlSW50KCB3Y2FwZl9wYXJhbXMuY2hvc2VuX2xpYl9zZWFyY2hfdGhyZXNob2xkICk7XG5cblx0XHRcdGlmICggc2VhcmNoVGhyZXNob2xkICkge1xuXHRcdFx0XHRvcHRpb25zWyAnZGlzYWJsZV9zZWFyY2hfdGhyZXNob2xkJyBdID0gc2VhcmNoVGhyZXNob2xkO1xuXHRcdFx0fVxuXG5cdFx0XHQkdGhpcy5jaG9zZW4oIG9wdGlvbnMgKTtcblx0XHR9ICk7XG5cdH1cblxuXHRpbml0Q2hvc2VuKCk7XG5cblx0Ly8gSW5pdGlhbGl6ZSBoaWVyYXJjaHkgYWNjb3JkaW9uLlxuXHRmdW5jdGlvbiBpbml0SGllcmFyY2h5QWNjb3JkaW9uKCkge1xuXHRcdCR3Y2FwZk5hdkZpbHRlcnMuZmluZCggJy5oaWVyYXJjaHktYWNjb3JkaW9uLXRvZ2dsZScgKS5vbiggJ2NsaWNrJywgZnVuY3Rpb24oKSB7XG5cdFx0XHRjb25zdCAkdGhpcyAgPSAkKCB0aGlzICk7XG5cdFx0XHRjb25zdCAkY2hpbGQgPSAkdGhpcy5wYXJlbnQoICdsaScgKS5jaGlsZHJlbiggJ3VsJyApO1xuXG5cdFx0XHQkdGhpcy50b2dnbGVDbGFzcyggJ2FjdGl2ZScgKTtcblxuXHRcdFx0aWYgKCB3Y2FwZl9wYXJhbXMuZW5hYmxlX2FuaW1hdGlvbl9mb3JfaGllcmFyY2h5X2FjY29yZGlvbiApIHtcblx0XHRcdFx0JGNoaWxkLnNsaWRlVG9nZ2xlKFxuXHRcdFx0XHRcdHdjYXBmX3BhcmFtcy5oaWVyYXJjaHlfYWNjb3JkaW9uX2FuaW1hdGlvbl9zcGVlZCxcblx0XHRcdFx0XHR3Y2FwZl9wYXJhbXMuaGllcmFyY2h5X2FjY29yZGlvbl9hbmltYXRpb25fZWFzaW5nXG5cdFx0XHRcdCk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHQkY2hpbGQudG9nZ2xlKCk7XG5cdFx0XHR9XG5cdFx0fSApO1xuXHR9XG5cblx0aW5pdEhpZXJhcmNoeUFjY29yZGlvbigpO1xuXG5cdC8qKlxuXHQgKiBAc291cmNlIGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vYS8zNDE0MTgxM1xuXHQgKlxuXHQgKiBAcGFyYW0gbnVtYmVyXG5cdCAqIEBwYXJhbSBkZWNpbWFsc1xuXHQgKiBAcGFyYW0gZGVjX3BvaW50XG5cdCAqIEBwYXJhbSB0aG91c2FuZHNfc2VwXG5cdCAqXG5cdCAqIEByZXR1cm5zIHtzdHJpbmd9XG5cdCAqL1xuXHRmdW5jdGlvbiBudW1iZXJfZm9ybWF0KCBudW1iZXIsIGRlY2ltYWxzLCBkZWNfcG9pbnQsIHRob3VzYW5kc19zZXAgKSB7XG5cdFx0Ly8gU3RyaXAgYWxsIGNoYXJhY3RlcnMgYnV0IG51bWVyaWNhbCBvbmVzLlxuXHRcdG51bWJlciA9ICggbnVtYmVyICsgJycgKS5yZXBsYWNlKCAvW15cXGQrXFwtRWUuXS9nLCAnJyApO1xuXG5cdFx0Y29uc3QgbiAgICA9ICEgaXNGaW5pdGUoICtudW1iZXIgKSA/IDAgOiArbnVtYmVyO1xuXHRcdGNvbnN0IHByZWMgPSAhIGlzRmluaXRlKCArZGVjaW1hbHMgKSA/IDAgOiBNYXRoLmFicyggZGVjaW1hbHMgKTtcblx0XHRjb25zdCBzZXAgID0gKCB0eXBlb2YgdGhvdXNhbmRzX3NlcCA9PT0gJ3VuZGVmaW5lZCcgKSA/ICcsJyA6IHRob3VzYW5kc19zZXA7XG5cdFx0Y29uc3QgZGVjICA9ICggdHlwZW9mIGRlY19wb2ludCA9PT0gJ3VuZGVmaW5lZCcgKSA/ICcuJyA6IGRlY19wb2ludDtcblxuXHRcdGxldCBzO1xuXG5cdFx0Y29uc3QgdG9GaXhlZEZpeCA9IGZ1bmN0aW9uKCBuLCBwcmVjICkge1xuXHRcdFx0Y29uc3QgayA9IE1hdGgucG93KCAxMCwgcHJlYyApO1xuXHRcdFx0cmV0dXJuICcnICsgTWF0aC5yb3VuZCggbiAqIGsgKSAvIGs7XG5cdFx0fTtcblxuXHRcdC8vIEZpeCBmb3IgSUUgcGFyc2VGbG9hdCgwLjU1KS50b0ZpeGVkKDApID0gMDtcblx0XHRzID0gKCBwcmVjID8gdG9GaXhlZEZpeCggbiwgcHJlYyApIDogJycgKyBNYXRoLnJvdW5kKCBuICkgKS5zcGxpdCggJy4nICk7XG5cblx0XHRpZiAoIHNbIDAgXS5sZW5ndGggPiAzICkge1xuXHRcdFx0c1sgMCBdID0gc1sgMCBdLnJlcGxhY2UoIC9cXEIoPz0oPzpcXGR7M30pKyg/IVxcZCkpL2csIHNlcCApO1xuXHRcdH1cblxuXHRcdGlmICggKCBzWyAxIF0gfHwgJycgKS5sZW5ndGggPCBwcmVjICkge1xuXHRcdFx0c1sgMSBdID0gc1sgMSBdIHx8ICcnO1xuXHRcdFx0c1sgMSBdICs9IG5ldyBBcnJheSggcHJlYyAtIHNbIDEgXS5sZW5ndGggKyAxICkuam9pbiggJzAnICk7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHMuam9pbiggZGVjICk7XG5cdH1cblxuXHQvLyBJbml0aWFsaXplIG5vVUlTbGlkZXIuXG5cdGZ1bmN0aW9uIGluaXROb1VJU2xpZGVyKCkge1xuXHRcdGlmICggJ3VuZGVmaW5lZCcgPT09IHR5cGVvZiBub1VpU2xpZGVyICkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdCR3Y2FwZk51bWJlclJhbmdlRmlsdGVycy5maW5kKCAnLndjYXBmLXJhbmdlLXNsaWRlcicgKS5lYWNoKCBmdW5jdGlvbigpIHtcblx0XHRcdGNvbnN0ICRpdGVtID0gJCggdGhpcyApO1xuXG5cdFx0XHRjb25zdCBmaWx0ZXJLZXkgPSAkaXRlbS5hdHRyKCAnZGF0YS1maWx0ZXIta2V5JyApO1xuXHRcdFx0Y29uc3QgJHNsaWRlciAgID0gJGl0ZW0uZmluZCggJy53Y2FwZi1ub3VpLXNsaWRlcicgKTtcblxuXHRcdFx0Ly8gSWYgc2xpZGVyIGlzIGFscmVhZHkgaW5pdGlhbGl6ZWQgdGhlbiBkb24ndCByZWluaXRpYWxpemUgYWdhaW4uXG5cdFx0XHRpZiAoICRzbGlkZXIuaGFzQ2xhc3MoICd3Y2FwZi1ub3VpLXRhcmdldCcgKSApIHtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXG5cdFx0XHRjb25zdCBzbGlkZXJJZCAgICAgICAgICA9ICRzbGlkZXIuYXR0ciggJ2lkJyApO1xuXHRcdFx0Y29uc3QgZGlzcGxheVZhbHVlc0FzICAgPSAkaXRlbS5hdHRyKCAnZGF0YS1kaXNwbGF5LXZhbHVlcy1hcycgKTtcblx0XHRcdGNvbnN0IHJhbmdlTWluVmFsdWUgICAgID0gcGFyc2VGbG9hdCggJGl0ZW0uYXR0ciggJ2RhdGEtcmFuZ2UtbWluLXZhbHVlJyApICk7XG5cdFx0XHRjb25zdCByYW5nZU1heFZhbHVlICAgICA9IHBhcnNlRmxvYXQoICRpdGVtLmF0dHIoICdkYXRhLXJhbmdlLW1heC12YWx1ZScgKSApO1xuXHRcdFx0Y29uc3Qgc3RlcCAgICAgICAgICAgICAgPSBwYXJzZUZsb2F0KCAkaXRlbS5hdHRyKCAnZGF0YS1zdGVwJyApICk7XG5cdFx0XHRjb25zdCBkZWNpbWFsUGxhY2VzICAgICA9ICRpdGVtLmF0dHIoICdkYXRhLWRlY2ltYWwtcGxhY2VzJyApO1xuXHRcdFx0Y29uc3QgdGhvdXNhbmRTZXBhcmF0b3IgPSAkaXRlbS5hdHRyKCAnZGF0YS10aG91c2FuZC1zZXBhcmF0b3InICk7XG5cdFx0XHRjb25zdCBkZWNpbWFsU2VwYXJhdG9yICA9ICRpdGVtLmF0dHIoICdkYXRhLWRlY2ltYWwtc2VwYXJhdG9yJyApO1xuXHRcdFx0Y29uc3QgbWluVmFsdWUgICAgICAgICAgPSBwYXJzZUZsb2F0KCAkaXRlbS5hdHRyKCAnZGF0YS1taW4tdmFsdWUnICkgKTtcblx0XHRcdGNvbnN0IG1heFZhbHVlICAgICAgICAgID0gcGFyc2VGbG9hdCggJGl0ZW0uYXR0ciggJ2RhdGEtbWF4LXZhbHVlJyApICk7XG5cdFx0XHRjb25zdCAkbWluVmFsdWUgICAgICAgICA9ICRpdGVtLmZpbmQoICcubWluLXZhbHVlJyApO1xuXHRcdFx0Y29uc3QgJG1heFZhbHVlICAgICAgICAgPSAkaXRlbS5maW5kKCAnLm1heC12YWx1ZScgKTtcblxuXHRcdFx0Y29uc3Qgc2xpZGVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoIHNsaWRlcklkICk7XG5cblx0XHRcdG5vVWlTbGlkZXIuY3JlYXRlKCBzbGlkZXIsIHtcblx0XHRcdFx0c3RhcnQ6IFsgbWluVmFsdWUsIG1heFZhbHVlIF0sXG5cdFx0XHRcdHN0ZXAsXG5cdFx0XHRcdGNvbm5lY3Q6IHRydWUsXG5cdFx0XHRcdGNzc1ByZWZpeDogJ3djYXBmLW5vdWktJyxcblx0XHRcdFx0cmFuZ2U6IHtcblx0XHRcdFx0XHQnbWluJzogcmFuZ2VNaW5WYWx1ZSxcblx0XHRcdFx0XHQnbWF4JzogcmFuZ2VNYXhWYWx1ZSxcblx0XHRcdFx0fVxuXHRcdFx0fSApO1xuXG5cdFx0XHRzbGlkZXIubm9VaVNsaWRlci5vbiggJ3VwZGF0ZScsIGZ1bmN0aW9uKCB2YWx1ZXMgKSB7XG5cdFx0XHRcdGNvbnN0IG1pblZhbHVlID0gbnVtYmVyX2Zvcm1hdCggdmFsdWVzWyAwIF0sIGRlY2ltYWxQbGFjZXMsIGRlY2ltYWxTZXBhcmF0b3IsIHRob3VzYW5kU2VwYXJhdG9yICk7XG5cdFx0XHRcdGNvbnN0IG1heFZhbHVlID0gbnVtYmVyX2Zvcm1hdCggdmFsdWVzWyAxIF0sIGRlY2ltYWxQbGFjZXMsIGRlY2ltYWxTZXBhcmF0b3IsIHRob3VzYW5kU2VwYXJhdG9yICk7XG5cblx0XHRcdFx0aWYgKCAncGxhaW5fdGV4dCcgPT09IGRpc3BsYXlWYWx1ZXNBcyApIHtcblx0XHRcdFx0XHQkbWluVmFsdWUuaHRtbCggbWluVmFsdWUgKTtcblx0XHRcdFx0XHQkbWF4VmFsdWUuaHRtbCggbWF4VmFsdWUgKTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHQkbWluVmFsdWUudmFsKCBtaW5WYWx1ZSApO1xuXHRcdFx0XHRcdCRtYXhWYWx1ZS52YWwoIG1heFZhbHVlICk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHQkYm9keS50cmlnZ2VyKCAnd2NhcGYtbm91aXNsaWRlci11cGRhdGUnLCBbICRpdGVtLCB2YWx1ZXMgXSApO1xuXHRcdFx0fSApO1xuXG5cdFx0XHRmdW5jdGlvbiBmaWx0ZXJQcm9kdWN0c0FjY29yZGluZ1RvU2xpZGVyKCB2YWx1ZXMgKSB7XG5cdFx0XHRcdCRib2R5LnRyaWdnZXIoICd3Y2FwZi1ub3Vpc2xpZGVyLWJlZm9yZS1maWx0ZXItcHJvZHVjdHMnLCBbICRpdGVtLCB2YWx1ZXMgXSApO1xuXG5cdFx0XHRcdGNvbnN0IG1pblZhbHVlID0gcGFyc2VGbG9hdCggdmFsdWVzWyAwIF0gKTtcblx0XHRcdFx0Y29uc3QgbWF4VmFsdWUgPSBwYXJzZUZsb2F0KCB2YWx1ZXNbIDEgXSApO1xuXG5cdFx0XHRcdGlmICggbWluVmFsdWUgPT09IHJhbmdlTWluVmFsdWUgJiYgbWF4VmFsdWUgPT09IHJhbmdlTWF4VmFsdWUgKSB7XG5cdFx0XHRcdFx0Y29uc3QgcXVlcnkgPSB3Y2FwZlJlbW92ZVF1ZXJ5U3RyaW5nUGFyYW1ldGVyKCBmaWx0ZXJLZXkgKTtcblx0XHRcdFx0XHRoaXN0b3J5LnB1c2hTdGF0ZSgge30sICcnLCBxdWVyeSApO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdGNvbnN0IGZpbHRlclZhbFN0cmluZyA9IG1pblZhbHVlICsgcmFuZ2VWYWx1ZXNTZXBhcmF0b3IgKyBtYXhWYWx1ZTtcblx0XHRcdFx0XHR3Y2FwZlVwZGF0ZVF1ZXJ5U3RyaW5nUGFyYW1ldGVyKCBmaWx0ZXJLZXksIGZpbHRlclZhbFN0cmluZyApO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0d2NhcGZGaWx0ZXJQcm9kdWN0cygpO1xuXG5cdFx0XHRcdCRib2R5LnRyaWdnZXIoICd3Y2FwZi1ub3Vpc2xpZGVyLWFmdGVyLWZpbHRlci1wcm9kdWN0cycsIFsgJGl0ZW0sIHZhbHVlcyBdICk7XG5cdFx0XHR9XG5cblx0XHRcdHNsaWRlci5ub1VpU2xpZGVyLm9uKCAnc2V0JywgZnVuY3Rpb24oIHZhbHVlcyApIHtcblx0XHRcdFx0Ly8gQ2xlYXIgYW55IHByZXZpb3VzbHkgc2V0IHRpbWVyIGJlZm9yZSBzZXR0aW5nIGEgZnJlc2ggb25lXG5cdFx0XHRcdGNsZWFyVGltZW91dCggJGl0ZW0uZGF0YSggJ3RpbWVyJyApICk7XG5cblx0XHRcdFx0JGl0ZW0uZGF0YSggJ3RpbWVyJywgc2V0VGltZW91dCggZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0JGl0ZW0ucmVtb3ZlRGF0YSggJ3RpbWVyJyApO1xuXG5cdFx0XHRcdFx0ZmlsdGVyUHJvZHVjdHNBY2NvcmRpbmdUb1NsaWRlciggdmFsdWVzICk7XG5cdFx0XHRcdH0sIGRlbGF5ICkgKTtcblx0XHRcdH0gKTtcblxuXHRcdFx0JG1pblZhbHVlLm9uKCAnaW5wdXQnLCBmdW5jdGlvbiggZXZlbnQgKSB7XG5cdFx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cblx0XHRcdFx0Y29uc3QgJGlucHV0ID0gJCggdGhpcyApO1xuXG5cdFx0XHRcdC8vIENsZWFyIGFueSBwcmV2aW91c2x5IHNldCB0aW1lciBiZWZvcmUgc2V0dGluZyBhIGZyZXNoIG9uZVxuXHRcdFx0XHRjbGVhclRpbWVvdXQoICRpbnB1dC5kYXRhKCAndGltZXInICkgKTtcblxuXHRcdFx0XHQkaW5wdXQuZGF0YSggJ3RpbWVyJywgc2V0VGltZW91dCggZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0JGlucHV0LnJlbW92ZURhdGEoICd0aW1lcicgKTtcblxuXHRcdFx0XHRcdGNvbnN0IG1pblZhbHVlID0gJGlucHV0LnZhbCgpO1xuXG5cdFx0XHRcdFx0c2xpZGVyLm5vVWlTbGlkZXIuc2V0KCBbIG1pblZhbHVlLCBudWxsIF0gKTtcblxuXHRcdFx0XHRcdGZpbHRlclByb2R1Y3RzQWNjb3JkaW5nVG9TbGlkZXIoIHNsaWRlci5ub1VpU2xpZGVyLmdldCgpICk7XG5cdFx0XHRcdH0sIGRlbGF5ICkgKTtcblx0XHRcdH0gKTtcblxuXHRcdFx0JG1heFZhbHVlLm9uKCAnaW5wdXQnLCBmdW5jdGlvbiggZXZlbnQgKSB7XG5cdFx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cblx0XHRcdFx0Y29uc3QgJGlucHV0ID0gJCggdGhpcyApO1xuXG5cdFx0XHRcdC8vIENsZWFyIGFueSBwcmV2aW91c2x5IHNldCB0aW1lciBiZWZvcmUgc2V0dGluZyBhIGZyZXNoIG9uZVxuXHRcdFx0XHRjbGVhclRpbWVvdXQoICRpbnB1dC5kYXRhKCAndGltZXInICkgKTtcblxuXHRcdFx0XHQkaW5wdXQuZGF0YSggJ3RpbWVyJywgc2V0VGltZW91dCggZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0JGlucHV0LnJlbW92ZURhdGEoICd0aW1lcicgKTtcblxuXHRcdFx0XHRcdGNvbnN0IG1heFZhbHVlID0gJGlucHV0LnZhbCgpO1xuXG5cdFx0XHRcdFx0c2xpZGVyLm5vVWlTbGlkZXIuc2V0KCBbIG51bGwsIG1heFZhbHVlIF0gKTtcblxuXHRcdFx0XHRcdGZpbHRlclByb2R1Y3RzQWNjb3JkaW5nVG9TbGlkZXIoIHNsaWRlci5ub1VpU2xpZGVyLmdldCgpICk7XG5cdFx0XHRcdH0sIGRlbGF5ICkgKTtcblx0XHRcdH0gKTtcblx0XHR9ICk7XG5cdH1cblxuXHRpbml0Tm9VSVNsaWRlcigpO1xuXG5cdGZ1bmN0aW9uIGZpbHRlckJ5RGF0ZSggJGlucHV0ICkge1xuXHRcdGNvbnN0ICR3Y2FwZkRhdGVGaWx0ZXIgPSAkaW5wdXQuY2xvc2VzdCggJy53Y2FwZi1kYXRlLWlucHV0JyApO1xuXHRcdGNvbnN0IGZpbHRlcktleSAgICAgICAgPSAkd2NhcGZEYXRlRmlsdGVyLmF0dHIoICdkYXRhLWZpbHRlci1rZXknICk7XG5cdFx0Y29uc3QgaXNSYW5nZSAgICAgICAgICA9ICR3Y2FwZkRhdGVGaWx0ZXIuYXR0ciggJ2RhdGEtaXMtcmFuZ2UnICk7XG5cblx0XHRsZXQgZmlsdGVyVmFsdWUgPSAnJztcblx0XHRsZXQgcnVuRmlsdGVyICAgPSBmYWxzZTtcblxuXHRcdC8vIENsZWFyIGFueSBwcmV2aW91c2x5IHNldCB0aW1lciBiZWZvcmUgc2V0dGluZyBhIGZyZXNoIG9uZVxuXHRcdGNsZWFyVGltZW91dCggJHdjYXBmRGF0ZUZpbHRlci5kYXRhKCAndGltZXInICkgKTtcblxuXHRcdGlmICggaXNSYW5nZSApIHtcblx0XHRcdGNvbnN0IGZyb20gPSAkd2NhcGZEYXRlRmlsdGVyLmZpbmQoICcuZGF0ZS1mcm9tLWlucHV0JyApLnZhbCgpO1xuXHRcdFx0Y29uc3QgdG8gICA9ICR3Y2FwZkRhdGVGaWx0ZXIuZmluZCggJy5kYXRlLXRvLWlucHV0JyApLnZhbCgpO1xuXG5cdFx0XHRpZiAoIGZyb20gJiYgdG8gKSB7XG5cdFx0XHRcdGZpbHRlclZhbHVlID0gZnJvbSArIHJhbmdlVmFsdWVzU2VwYXJhdG9yICsgdG87XG5cdFx0XHRcdHJ1bkZpbHRlciAgID0gdHJ1ZTtcblx0XHRcdH0gZWxzZSBpZiAoICEgZnJvbSAmJiAhIHRvICkge1xuXHRcdFx0XHRydW5GaWx0ZXIgPSB0cnVlO1xuXHRcdFx0fVxuXHRcdH0gZWxzZSB7XG5cdFx0XHRjb25zdCBmcm9tID0gJHdjYXBmRGF0ZUZpbHRlci5maW5kKCAnLmRhdGUtZnJvbS1pbnB1dCcgKS52YWwoKTtcblxuXHRcdFx0aWYgKCBmcm9tICkge1xuXHRcdFx0XHRmaWx0ZXJWYWx1ZSA9IGZyb207XG5cdFx0XHRcdHJ1bkZpbHRlciAgID0gdHJ1ZTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHJ1bkZpbHRlciA9IHRydWU7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0aWYgKCBydW5GaWx0ZXIgKSB7XG5cdFx0XHQkd2NhcGZEYXRlRmlsdGVyLmRhdGEoICd0aW1lcicsIHNldFRpbWVvdXQoIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHQkd2NhcGZEYXRlRmlsdGVyLnJlbW92ZURhdGEoICd0aW1lcicgKTtcblxuXHRcdFx0XHRpZiAoIGZpbHRlclZhbHVlICkge1xuXHRcdFx0XHRcdHdjYXBmVXBkYXRlUXVlcnlTdHJpbmdQYXJhbWV0ZXIoIGZpbHRlcktleSwgZmlsdGVyVmFsdWUgKTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRjb25zdCBxdWVyeSA9IHdjYXBmUmVtb3ZlUXVlcnlTdHJpbmdQYXJhbWV0ZXIoIGZpbHRlcktleSApO1xuXHRcdFx0XHRcdGhpc3RvcnkucHVzaFN0YXRlKCB7fSwgJycsIHF1ZXJ5ICk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHR3Y2FwZkZpbHRlclByb2R1Y3RzKCk7XG5cdFx0XHR9LCBkZWxheSApICk7XG5cdFx0fVxuXHR9XG5cblx0ZnVuY3Rpb24gaW5pdERhdGVwaWNrZXIoKSB7XG5cdFx0aWYgKCAhIGpRdWVyeSgpLmRhdGVwaWNrZXIgKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0Y29uc3QgJHdjYXBmRGF0ZUZpbHRlcnMgPSAkKCAnLndjYXBmLWRhdGUtcmFuZ2UtZmlsdGVyJyApO1xuXHRcdGNvbnN0ICR3Y2FwZkRhdGVGaWx0ZXIgID0gJHdjYXBmRGF0ZUZpbHRlcnMuZmluZCggJy53Y2FwZi1kYXRlLWlucHV0JyApO1xuXG5cdFx0Y29uc3QgZm9ybWF0ICAgICAgICA9ICR3Y2FwZkRhdGVGaWx0ZXIuYXR0ciggJ2RhdGEtZGF0ZS1mb3JtYXQnICk7XG5cdFx0Y29uc3QgeWVhckRyb3Bkb3duICA9ICR3Y2FwZkRhdGVGaWx0ZXIuYXR0ciggJ2RhdGEtZGF0ZS1waWNrZXIteWVhci1kcm9wZG93bicgKTtcblx0XHRjb25zdCBtb250aERyb3Bkb3duID0gJHdjYXBmRGF0ZUZpbHRlci5hdHRyKCAnZGF0YS1kYXRlLXBpY2tlci1tb250aC1kcm9wZG93bicgKTtcblxuXHRcdGNvbnN0ICRmcm9tID0gJHdjYXBmRGF0ZUZpbHRlci5maW5kKCAnLmRhdGUtZnJvbS1pbnB1dCcgKTtcblx0XHRjb25zdCAkdG8gICA9ICR3Y2FwZkRhdGVGaWx0ZXIuZmluZCggJy5kYXRlLXRvLWlucHV0JyApO1xuXG5cdFx0JGZyb20uZGF0ZXBpY2tlcigge1xuXHRcdFx0ZGF0ZUZvcm1hdDogZm9ybWF0LFxuXHRcdFx0Y2hhbmdlWWVhcjogeWVhckRyb3Bkb3duLFxuXHRcdFx0Y2hhbmdlTW9udGg6IG1vbnRoRHJvcGRvd24sXG5cdFx0fSApO1xuXG5cdFx0JHRvLmRhdGVwaWNrZXIoIHtcblx0XHRcdGRhdGVGb3JtYXQ6IGZvcm1hdCxcblx0XHRcdGNoYW5nZVllYXI6IHllYXJEcm9wZG93bixcblx0XHRcdGNoYW5nZU1vbnRoOiBtb250aERyb3Bkb3duLFxuXHRcdH0gKTtcblxuXHRcdCRmcm9tLm9uKCAnY2hhbmdlJywgZnVuY3Rpb24oKSB7XG5cdFx0XHRjb25zdCAkaW5wdXQgPSAkKCB0aGlzICk7XG5cdFx0XHRmaWx0ZXJCeURhdGUoICRpbnB1dCApO1xuXHRcdH0gKTtcblxuXHRcdCR0by5vbiggJ2NoYW5nZScsIGZ1bmN0aW9uKCkge1xuXHRcdFx0Y29uc3QgJGlucHV0ID0gJCggdGhpcyApO1xuXHRcdFx0ZmlsdGVyQnlEYXRlKCAkaW5wdXQgKTtcblx0XHR9ICk7XG5cdH1cblxuXHRpbml0RGF0ZXBpY2tlcigpO1xuXG5cdC8vIFRoaW5ncyBhcmUgZG9uZSBiZWZvcmUgYXBwbHlpbmcgdGhlIGZpbHRlciBsaWtlIHNob3dpbmcgYSBsb2FkaW5nIGluZGljYXRvci5cblx0ZnVuY3Rpb24gd2NhcGZCZWZvcmVVcGRhdGUoKSB7XG5cdFx0JGJvZHkudHJpZ2dlciggJ3djYXBmX2JlZm9yZV91cGRhdGVfZmlsdGVycycgKTtcblxuXHRcdGxldCBjb250YWluZXI7XG5cblx0XHRpZiAoICQoIHdjYXBmX3BhcmFtcy5zaG9wX2xvb3BfY29udGFpbmVyLmxlbmd0aCApICkge1xuXHRcdFx0Y29udGFpbmVyID0gd2NhcGZfcGFyYW1zLnNob3BfbG9vcF9jb250YWluZXI7XG5cdFx0fSBlbHNlIGlmICggJCggd2NhcGZfcGFyYW1zLm5vdF9mb3VuZF9jb250YWluZXIgKS5sZW5ndGggKSB7XG5cdFx0XHRjb250YWluZXIgPSB3Y2FwZl9wYXJhbXMubm90X2ZvdW5kX2NvbnRhaW5lcjtcblx0XHR9XG5cblx0XHQvLyBTaG93IGxvYWRpbmcgaW1hZ2UuXG5cdFx0aWYgKCB3Y2FwZl9wYXJhbXMuc2hvd19yZXN1bHRzX2xvYWRpbmcgKSB7XG5cdFx0XHRjb25zdCBsb2FkaW5nTWFya3VwID0gJzxkaXYgY2xhc3M9XCJ3Y2FwZi1zaG9wLWxvb3AtbG9hZGluZ1wiPjwvZGl2Pic7XG5cdFx0XHQkKCBsb2FkaW5nTWFya3VwICkucHJlcGVuZFRvKCBjb250YWluZXIgKTtcblx0XHR9XG5cblx0XHQvLyBTY3JvbGwgdG8gdG9wLlxuXHRcdGlmICggd2NhcGZfcGFyYW1zLnNjcm9sbF90b190b3AgKSB7XG5cdFx0XHRsZXQgYWRqdXN0aW5nT2Zmc2V0LCBvZmZzZXQ7XG5cblx0XHRcdGlmICggd2NhcGZfcGFyYW1zLnNjcm9sbF90b190b3Bfb2Zmc2V0ICkge1xuXHRcdFx0XHRhZGp1c3RpbmdPZmZzZXQgPSBwYXJzZUludCggd2NhcGZfcGFyYW1zLnNjcm9sbF90b190b3Bfb2Zmc2V0ICk7XG5cdFx0XHR9XG5cblx0XHRcdGNvbnN0ICRjb250YWluZXIgPSAkKCBjb250YWluZXIgKTtcblxuXHRcdFx0aWYgKCAkY29udGFpbmVyLmxlbmd0aCApIHtcblx0XHRcdFx0b2Zmc2V0ID0gJGNvbnRhaW5lci5vZmZzZXQoKS50b3AgLSBhZGp1c3RpbmdPZmZzZXQ7XG5cblx0XHRcdFx0aWYgKCBvZmZzZXQgPCAwICkge1xuXHRcdFx0XHRcdG9mZnNldCA9IDA7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHQkKCAnaHRtbCwgYm9keScgKS5zdG9wKCkuYW5pbWF0ZShcblx0XHRcdFx0XHR7IHNjcm9sbFRvcDogb2Zmc2V0IH0sXG5cdFx0XHRcdFx0d2NhcGZfcGFyYW1zLnNjcm9sbF90b190b3Bfc3BlZWQsXG5cdFx0XHRcdFx0d2NhcGZfcGFyYW1zLnNjcm9sbF90b190b3BfZWFzaW5nXG5cdFx0XHRcdCk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cblx0ZnVuY3Rpb24gaW5pdERlZmF1bHRPcmRlckJ5KCkge1xuXHRcdGNvbnN0ICRjb250YWluZXIgPSAkKCB3Y2FwZl9wYXJhbXMuc2hvcF9sb29wX2NvbnRhaW5lciApO1xuXG5cdFx0Ly8gQXR0YWNoIGNob3Nlbi5cblx0XHRpZiAoIHdjYXBmX3BhcmFtcy5lbmFibGVfY2hvc2VuX2Zvcl9kZWZhdWx0X3NvcnRpbmcgKSB7XG5cdFx0XHRpZiAoIGpRdWVyeSgpLmNob3NlbiApIHtcblx0XHRcdFx0JGNvbnRhaW5lci5maW5kKCAnLndvb2NvbW1lcmNlLW9yZGVyaW5nIHNlbGVjdC5vcmRlcmJ5JyApLmNob3Nlbigge1xuXHRcdFx0XHRcdCdkaXNhYmxlX3NlYXJjaF90aHJlc2hvbGQnOiAxNSxcblx0XHRcdFx0fSApO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdGlmICggISB3Y2FwZl9wYXJhbXMuc29ydGluZ19jb250cm9sICkge1xuXHRcdFx0JGNvbnRhaW5lci5maW5kKCAnLndvb2NvbW1lcmNlLW9yZGVyaW5nJyApLmVhY2goIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRjb25zdCAkb3JkZXJpbmdGb3JtID0gJCggdGhpcyApO1xuXG5cdFx0XHRcdCRvcmRlcmluZ0Zvcm0ub24oICdjaGFuZ2UnLCAnc2VsZWN0Lm9yZGVyYnknLCBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHQkb3JkZXJpbmdGb3JtLnN1Ym1pdCgpO1xuXHRcdFx0XHR9ICk7XG5cdFx0XHR9ICk7XG5cblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHQkY29udGFpbmVyLmZpbmQoICcud29vY29tbWVyY2Utb3JkZXJpbmcnICkuZWFjaCggZnVuY3Rpb24oKSB7XG5cdFx0XHRjb25zdCAkb3JkZXJpbmdGb3JtID0gJCggdGhpcyApO1xuXG5cdFx0XHQkb3JkZXJpbmdGb3JtLm9uKCAnc3VibWl0JywgZnVuY3Rpb24oIGUgKSB7XG5cdFx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcblx0XHRcdH0gKTtcblxuXHRcdFx0JG9yZGVyaW5nRm9ybS5vbiggJ2NoYW5nZScsICdzZWxlY3Qub3JkZXJieScsIGZ1bmN0aW9uKCBlICkge1xuXHRcdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cblx0XHRcdFx0Y29uc3Qgb3JkZXIgICAgICA9ICQoIHRoaXMgKS52YWwoKTtcblx0XHRcdFx0Y29uc3QgZmlsdGVyX2tleSA9ICdvcmRlcmJ5JztcblxuXHRcdFx0XHR3Y2FwZlVwZGF0ZVF1ZXJ5U3RyaW5nUGFyYW1ldGVyKCBmaWx0ZXJfa2V5LCBvcmRlciApO1xuXHRcdFx0XHR3Y2FwZkZpbHRlclByb2R1Y3RzKCk7XG5cdFx0XHR9ICk7XG5cdFx0fSApO1xuXHR9XG5cblx0aW5pdERlZmF1bHRPcmRlckJ5KCk7XG5cblx0Ly8gVGhpbmdzIGFyZSBkb25lIGFmdGVyIGFwcGx5aW5nIHRoZSBmaWx0ZXIgbGlrZSBzY3JvbGwgdG8gdG9wLlxuXHRmdW5jdGlvbiB3Y2FwZkFmdGVyVXBkYXRlKCkge1xuXHRcdGluaXRDaG9zZW4oKTtcblx0XHRpbml0SGllcmFyY2h5QWNjb3JkaW9uKCk7XG5cdFx0aW5pdE5vVUlTbGlkZXIoKTtcblx0XHRpbml0RGF0ZXBpY2tlcigpO1xuXHRcdGluaXREZWZhdWx0T3JkZXJCeSgpO1xuXG5cdFx0Ly8gdG9kb1xuXHRcdC8vIGluaXQgcGFnaW5hdGlvblxuXG5cdFx0JGJvZHkudHJpZ2dlciggJ3djYXBmX2FmdGVyX3VwZGF0ZV9maWx0ZXJzJyApO1xuXHR9XG5cblx0Ly8gVGhlIG1haW4gZmlsdGVyIGZ1bmN0aW9uLlxuXHRmdW5jdGlvbiB3Y2FwZkZpbHRlclByb2R1Y3RzKCBmb3JjZVJlUmVuZGVyID0gZmFsc2UgKSB7XG5cdFx0d2NhcGZCZWZvcmVVcGRhdGUoKTtcblxuXHRcdCQuZ2V0KCB3aW5kb3cubG9jYXRpb24uaHJlZiwgZnVuY3Rpb24oIGRhdGEgKSB7XG5cdFx0XHRjb25zdCAkZGF0YSA9ICQoIGRhdGEgKTtcblxuXHRcdFx0Ly8gUmVwbGFjZSB0aGUgZmllbGRzJyBkYXRhIHdpdGggbmV3IGRhdGEuXG5cdFx0XHQkLmVhY2goIGZpZWxkcywgZnVuY3Rpb24oIGlkICkge1xuXHRcdFx0XHRjb25zdCBmaWVsZElEICAgID0gJ1tkYXRhLWlkPVwiJyArIGlkICsgJ1wiXSc7XG5cdFx0XHRcdGNvbnN0ICRmaWVsZCAgICAgPSAkKCBmaWVsZElEICk7XG5cdFx0XHRcdGNvbnN0ICRpbm5lciAgICAgPSAkZmllbGQuZmluZCggJy53Y2FwZi1maWVsZC1pbm5lcicgKTtcblx0XHRcdFx0Y29uc3QgX2ZpZWxkICAgICA9ICRkYXRhLmZpbmQoIGZpZWxkSUQgKTtcblx0XHRcdFx0Y29uc3QgZmllbGRDbGFzcyA9ICQoIF9maWVsZCApLmF0dHIoICdjbGFzcycgKTtcblxuXHRcdFx0XHQvLyBQcmVzZXJ2ZSBoaWVyYXJjaHkgYWNjb3JkaW9uIHN0YXRlLlxuXHRcdFx0XHRpZiAoIHdjYXBmX3BhcmFtcy5wcmVzZXJ2ZV9oaWVyYXJjaHlfYWNjb3JkaW9uX3N0YXRlICkge1xuXHRcdFx0XHRcdGlmICggJGZpZWxkLmhhc0NsYXNzKCAnaGllcmFyY2h5LWFjY29yZGlvbicgKSApIHtcblx0XHRcdFx0XHRcdCRmaWVsZC5maW5kKCAnLmhpZXJhcmNoeS1hY2NvcmRpb24tdG9nZ2xlLmFjdGl2ZScgKS5lYWNoKCBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHRcdFx0Y29uc3QgaXRlbVZhbHVlICAgICAgPSAkKCB0aGlzICkucGFyZW50KCkuY2hpbGRyZW4oICdpbnB1dCcgKS52YWwoKTtcblx0XHRcdFx0XHRcdFx0Y29uc3QgdG9nZ2xlU2VsZWN0b3IgPSAnaW5wdXRbdmFsdWU9XCInICsgaXRlbVZhbHVlICsgJ1wiXSB+IC5oaWVyYXJjaHktYWNjb3JkaW9uLXRvZ2dsZSc7XG5cdFx0XHRcdFx0XHRcdGNvbnN0IHVsU2VsZWN0b3IgICAgID0gJ2lucHV0W3ZhbHVlPVwiJyArIGl0ZW1WYWx1ZSArICdcIl0gfiB1bCc7XG5cdFx0XHRcdFx0XHRcdGNvbnN0IF9jbGFzc2VzICAgICAgID0gJ2hpZXJhcmNoeS1hY2NvcmRpb24tdG9nZ2xlIGFjdGl2ZSc7XG5cblx0XHRcdFx0XHRcdFx0X2ZpZWxkLmZpbmQoIHRvZ2dsZVNlbGVjdG9yICkuYXR0ciggJ2NsYXNzJywgX2NsYXNzZXMgKTtcblx0XHRcdFx0XHRcdFx0X2ZpZWxkLmZpbmQoIHVsU2VsZWN0b3IgKS5zaG93KCk7XG5cdFx0XHRcdFx0XHR9ICk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cblx0XHRcdFx0Y29uc3QgX2h0bWwgPSBfZmllbGQuZmluZCggJy53Y2FwZi1maWVsZC1pbm5lcicgKS5odG1sKCk7XG5cblx0XHRcdFx0Ly8gVXBkYXRlIHRoZSBmaWVsZCdzIGNsYXNzLlxuXHRcdFx0XHQkZmllbGQuYXR0ciggJ2NsYXNzJywgZmllbGRDbGFzcyApO1xuXG5cdFx0XHRcdC8vIFdoZW4gY2FsbGVkIGZyb20gaGlzdG9yeSBiYWNrIG9yIGZvcndhcmQgcmVxdWVzdCB0aGVuIHJlcmVuZGVyIGFsbCBmaWVsZHMuXG5cdFx0XHRcdGlmICggZm9yY2VSZVJlbmRlciApIHtcblxuXHRcdFx0XHRcdC8vIHVwZGF0ZSBmaWVsZFxuXHRcdFx0XHRcdCRpbm5lci5odG1sKCBfaHRtbCApO1xuXG5cdFx0XHRcdH0gZWxzZSB7XG5cblx0XHRcdFx0XHQvLyBTZWxlY3RpdmVseSByZXJlbmRlciB0aGUgZmllbGRzLlxuXHRcdFx0XHRcdGlmICggJGZpZWxkLmhhc0NsYXNzKCAnd2NhcGYtbmF2LWZpbHRlcicgKSApIHtcblxuXHRcdFx0XHRcdFx0Ly8gdXBkYXRlIGZpZWxkXG5cdFx0XHRcdFx0XHQkaW5uZXIuaHRtbCggX2h0bWwgKTtcblxuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHR9XG5cblx0XHRcdFx0JGZpZWxkLnRyaWdnZXIoICd3Y2FwZi1maWVsZC11cGRhdGVkJywgWyBfZmllbGQgXSApO1xuXHRcdFx0fSApO1xuXG5cdFx0XHQvLyBSZXBsYWNlIG9sZCBzaG9wIGxvb3Agd2l0aCBuZXcgb25lLlxuXHRcdFx0Y29uc3QgJHNob3BMb29wQ29udGFpbmVyID0gJGRhdGEuZmluZCggd2NhcGZfcGFyYW1zLnNob3BfbG9vcF9jb250YWluZXIgKTtcblx0XHRcdGNvbnN0ICRub3RGb3VuZENvbnRhaW5lciA9ICRkYXRhLmZpbmQoIHdjYXBmX3BhcmFtcy5ub3RfZm91bmRfY29udGFpbmVyICk7XG5cblx0XHRcdGlmICggd2NhcGZfcGFyYW1zLnNob3BfbG9vcF9jb250YWluZXIgPT09IHdjYXBmX3BhcmFtcy5ub3RfZm91bmRfY29udGFpbmVyICkge1xuXHRcdFx0XHQkKCB3Y2FwZl9wYXJhbXMuc2hvcF9sb29wX2NvbnRhaW5lciApLmh0bWwoICRzaG9wTG9vcENvbnRhaW5lci5odG1sKCkgKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGlmICggJCggd2NhcGZfcGFyYW1zLm5vdF9mb3VuZF9jb250YWluZXIgKS5sZW5ndGggKSB7XG5cdFx0XHRcdFx0aWYgKCAkc2hvcExvb3BDb250YWluZXIubGVuZ3RoICkge1xuXHRcdFx0XHRcdFx0JCggd2NhcGZfcGFyYW1zLm5vdF9mb3VuZF9jb250YWluZXIgKS5odG1sKCAkc2hvcExvb3BDb250YWluZXIuaHRtbCgpICk7XG5cdFx0XHRcdFx0fSBlbHNlIGlmICggJG5vdEZvdW5kQ29udGFpbmVyLmxlbmd0aCApIHtcblx0XHRcdFx0XHRcdCQoIHdjYXBmX3BhcmFtcy5ub3RfZm91bmRfY29udGFpbmVyICkuaHRtbCggJG5vdEZvdW5kQ29udGFpbmVyLmh0bWwoKSApO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSBlbHNlIGlmICggJCggd2NhcGZfcGFyYW1zLnNob3BfbG9vcF9jb250YWluZXIgKS5sZW5ndGggKSB7XG5cdFx0XHRcdFx0aWYgKCAkc2hvcExvb3BDb250YWluZXIubGVuZ3RoICkge1xuXHRcdFx0XHRcdFx0JCggd2NhcGZfcGFyYW1zLnNob3BfbG9vcF9jb250YWluZXIgKS5odG1sKCAkc2hvcExvb3BDb250YWluZXIuaHRtbCgpICk7XG5cdFx0XHRcdFx0fSBlbHNlIGlmICggJG5vdEZvdW5kQ29udGFpbmVyLmxlbmd0aCApIHtcblx0XHRcdFx0XHRcdCQoIHdjYXBmX3BhcmFtcy5zaG9wX2xvb3BfY29udGFpbmVyICkuaHRtbCggJG5vdEZvdW5kQ29udGFpbmVyLmh0bWwoKSApO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0XHR3Y2FwZkFmdGVyVXBkYXRlKCk7XG5cblx0XHRcdC8vIHJ1biBzY3JpcHRzIGFmdGVyIHNob3AgbG9vcCB1bmRhdGVkXG5cdFx0XHRpZiAoIHR5cGVvZiB3Y2FwZl9wYXJhbXMuY3VzdG9tX3NjcmlwdHMgIT09ICd1bmRlZmluZWQnICYmIHdjYXBmX3BhcmFtcy5jdXN0b21fc2NyaXB0cy5sZW5ndGggPiAwICkge1xuXHRcdFx0XHRldmFsKCB3Y2FwZl9wYXJhbXMuY3VzdG9tX3NjcmlwdHMgKTtcblx0XHRcdH1cblx0XHR9ICk7XG5cdH1cblxuXHQvLyBVUkwgUGFyc2VyXG5cdGZ1bmN0aW9uIHdjYXBmR2V0VXJsVmFycyggdXJsICkge1xuXHRcdGxldCB2YXJzID0ge30sIGhhc2g7XG5cblx0XHRpZiAoIHR5cGVvZiB1cmwgPT09ICd1bmRlZmluZWQnICkge1xuXHRcdFx0dXJsID0gd2luZG93LmxvY2F0aW9uLmhyZWY7XG5cdFx0fVxuXG5cdFx0dXJsID0gdXJsLnJlcGxhY2VBbGwoICclMkMnLCAnLCcgKTtcblxuXHRcdGNvbnN0IGhhc2hlcyAgPSB1cmwuc2xpY2UoIHVybC5pbmRleE9mKCAnPycgKSArIDEgKS5zcGxpdCggJyYnICk7XG5cdFx0Y29uc3QgaExlbmd0aCA9IGhhc2hlcy5sZW5ndGg7XG5cblx0XHRmb3IgKCBsZXQgaSA9IDA7IGkgPCBoTGVuZ3RoOyBpKysgKSB7XG5cdFx0XHRoYXNoID0gaGFzaGVzWyBpIF0uc3BsaXQoICc9JyApO1xuXG5cdFx0XHR2YXJzWyBoYXNoWyAwIF0gXSA9IGhhc2hbIDEgXTtcblx0XHR9XG5cblx0XHRyZXR1cm4gdmFycztcblx0fVxuXG5cdC8vIGV2ZXJ5dGltZSB3ZSBhcHBseSB0aGUgZmlsdGVyIHdlIHNldCB0aGUgY3VycmVudCBwYWdlIHRvIDFcblx0ZnVuY3Rpb24gd2NhcGZGaXhQYWdpbmF0aW9uKCkge1xuXHRcdGxldCB1cmwgICAgICAgICAgICAgICAgPSB3aW5kb3cubG9jYXRpb24uaHJlZjtcblx0XHRjb25zdCBwYXJhbXMgICAgICAgICAgID0gd2NhcGZHZXRVcmxWYXJzKCB1cmwgKTtcblx0XHRjb25zdCBjdXJyZW50UGFnZUluVXJsID0gcGFyc2VJbnQoIHVybC5yZXBsYWNlKCAvLitcXC9wYWdlXFwvKFxcZCspKy8sICckMScgKSApO1xuXG5cdFx0aWYgKCBjdXJyZW50UGFnZUluVXJsICkge1xuXHRcdFx0aWYgKCBjdXJyZW50UGFnZUluVXJsID4gMSApIHtcblx0XHRcdFx0dXJsID0gdXJsLnJlcGxhY2UoIC9wYWdlXFwvKFxcZCspLywgJ3BhZ2UvMScgKTtcblx0XHRcdH1cblx0XHR9IGVsc2UgaWYgKCB0eXBlb2YgcGFyYW1zWyAncGFnZWQnIF0gIT09ICd1bmRlZmluZWQnICkge1xuXHRcdFx0Y29uc3QgY3VycmVudFBhZ2VJblBhcmFtcyA9IHBhcnNlSW50KCBwYXJhbXNbICdwYWdlZCcgXSApO1xuXG5cdFx0XHRpZiAoIGN1cnJlbnRQYWdlSW5QYXJhbXMgPiAxICkge1xuXHRcdFx0XHR1cmwgPSB1cmwucmVwbGFjZSggJ3BhZ2VkPScgKyBjdXJyZW50UGFnZUluUGFyYW1zLCAncGFnZWQ9MScgKTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHRyZXR1cm4gdXJsO1xuXHR9XG5cblx0Ly8gdXBkYXRlIHF1ZXJ5IHN0cmluZyBmb3IgY2F0ZWdvcmllcywgbWV0YSBldGMuLlxuXHRmdW5jdGlvbiB3Y2FwZlVwZGF0ZVF1ZXJ5U3RyaW5nUGFyYW1ldGVyKCBrZXksIHZhbHVlLCBwdXNoSGlzdG9yeSwgdXJsICkge1xuXHRcdGlmICggdHlwZW9mIHB1c2hIaXN0b3J5ID09PSAndW5kZWZpbmVkJyApIHtcblx0XHRcdHB1c2hIaXN0b3J5ID0gdHJ1ZTtcblx0XHR9XG5cblx0XHRpZiAoIHR5cGVvZiB1cmwgPT09ICd1bmRlZmluZWQnICkge1xuXHRcdFx0dXJsID0gd2NhcGZGaXhQYWdpbmF0aW9uKCk7XG5cdFx0fVxuXG5cdFx0Y29uc3QgcmUgICAgICAgID0gbmV3IFJlZ0V4cCggJyhbPyZdKScgKyBrZXkgKyAnPS4qPygmfCQpJywgJ2knICk7XG5cdFx0Y29uc3Qgc2VwYXJhdG9yID0gdXJsLmluZGV4T2YoICc/JyApICE9PSAtMSA/ICcmJyA6ICc/Jztcblx0XHRsZXQgdXJsV2l0aFF1ZXJ5O1xuXG5cdFx0aWYgKCB1cmwubWF0Y2goIHJlICkgKSB7XG5cdFx0XHR1cmxXaXRoUXVlcnkgPSB1cmwucmVwbGFjZSggcmUsICckMScgKyBrZXkgKyAnPScgKyB2YWx1ZSArICckMicgKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0dXJsV2l0aFF1ZXJ5ID0gdXJsICsgc2VwYXJhdG9yICsga2V5ICsgJz0nICsgdmFsdWU7XG5cdFx0fVxuXG5cdFx0aWYgKCBwdXNoSGlzdG9yeSA9PT0gdHJ1ZSApIHtcblx0XHRcdHJldHVybiBoaXN0b3J5LnB1c2hTdGF0ZSgge30sICcnLCB1cmxXaXRoUXVlcnkgKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0cmV0dXJuIHVybFdpdGhRdWVyeTtcblx0XHR9XG5cdH1cblxuXHQvLyByZW1vdmUgcGFyYW1ldGVyIGZyb20gdXJsXG5cdGZ1bmN0aW9uIHdjYXBmUmVtb3ZlUXVlcnlTdHJpbmdQYXJhbWV0ZXIoIGZpbHRlcktleSwgdXJsICkge1xuXHRcdGlmICggdHlwZW9mIHVybCA9PT0gJ3VuZGVmaW5lZCcgKSB7XG5cdFx0XHR1cmwgPSB3Y2FwZkZpeFBhZ2luYXRpb24oKTtcblx0XHR9XG5cblx0XHRjb25zdCBvbGRQYXJhbXMgICAgICAgICA9IHdjYXBmR2V0VXJsVmFycyggdXJsICk7XG5cdFx0Y29uc3Qgb2xkUGFyYW1zTGVuZ3RoICAgPSBPYmplY3Qua2V5cyggb2xkUGFyYW1zICkubGVuZ3RoO1xuXHRcdGNvbnN0IHN0YXJ0UG9zaXRpb24gICAgID0gdXJsLmluZGV4T2YoICc/JyApO1xuXHRcdGNvbnN0IGZpbHRlcktleVBvc2l0aW9uID0gdXJsLmluZGV4T2YoIGZpbHRlcktleSApO1xuXHRcdGxldCBjbGVhblVybCwgY2xlYW5RdWVyeTtcblxuXHRcdGlmICggb2xkUGFyYW1zTGVuZ3RoID4gMSApIHtcblx0XHRcdGlmICggKCBmaWx0ZXJLZXlQb3NpdGlvbiAtIHN0YXJ0UG9zaXRpb24gKSA+IDEgKSB7XG5cdFx0XHRcdGNsZWFuVXJsID0gdXJsLnJlcGxhY2UoICcmJyArIGZpbHRlcktleSArICc9JyArIG9sZFBhcmFtc1sgZmlsdGVyS2V5IF0sICcnICk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRjbGVhblVybCA9IHVybC5yZXBsYWNlKCBmaWx0ZXJLZXkgKyAnPScgKyBvbGRQYXJhbXNbIGZpbHRlcktleSBdICsgJyYnLCAnJyApO1xuXHRcdFx0fVxuXG5cdFx0XHRjb25zdCBuZXdQYXJhbXMgPSBjbGVhblVybC5zcGxpdCggJz8nICk7XG5cdFx0XHRjbGVhblF1ZXJ5ICAgICAgPSAnPycgKyBuZXdQYXJhbXNbIDEgXTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0Y2xlYW5RdWVyeSA9IHVybC5yZXBsYWNlKCAnPycgKyBmaWx0ZXJLZXkgKyAnPScgKyBvbGRQYXJhbXNbIGZpbHRlcktleSBdLCAnJyApO1xuXHRcdH1cblxuXHRcdHJldHVybiBjbGVhblF1ZXJ5O1xuXHR9XG5cblx0Ly8gdGFrZSB0aGUga2V5IGFuZCB2YWx1ZSBhbmQgbWFrZSBxdWVyeVxuXHRmdW5jdGlvbiB3Y2FwZk1ha2VQYXJhbWV0ZXJzKCBmaWx0ZXJLZXksIGZpbHRlclZhbHVlLCBmb3JjZVJlcmVuZGVyID0gZmFsc2UsIHVybCApIHtcblx0XHRjb25zdCB2YWx1ZVNlcGFyYXRvciA9ICcsJztcblxuXHRcdGxldCBwYXJhbXMsIG5leHRWYWx1ZXMsIGVtcHR5VmFsdWUgPSBmYWxzZTtcblxuXHRcdGlmICggdHlwZW9mIHVybCAhPT0gJ3VuZGVmaW5lZCcgKSB7XG5cdFx0XHRwYXJhbXMgPSB3Y2FwZkdldFVybFZhcnMoIHVybCApO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRwYXJhbXMgPSB3Y2FwZkdldFVybFZhcnMoKTtcblx0XHR9XG5cblx0XHRpZiAoIHR5cGVvZiBwYXJhbXNbIGZpbHRlcktleSBdICE9ICd1bmRlZmluZWQnICkge1xuXHRcdFx0Y29uc3QgcHJldlZhbHVlcyAgICAgID0gcGFyYW1zWyBmaWx0ZXJLZXkgXTtcblx0XHRcdGNvbnN0IHByZXZWYWx1ZXNBcnJheSA9IHByZXZWYWx1ZXMuc3BsaXQoIHZhbHVlU2VwYXJhdG9yICk7XG5cblx0XHRcdGlmICggcHJldlZhbHVlcy5sZW5ndGggPiAwICkge1xuXHRcdFx0XHRjb25zdCBmb3VuZCA9ICQuaW5BcnJheSggZmlsdGVyVmFsdWUsIHByZXZWYWx1ZXNBcnJheSApO1xuXG5cdFx0XHRcdGlmICggZm91bmQgPj0gMCApIHtcblx0XHRcdFx0XHQvLyBFbGVtZW50IHdhcyBmb3VuZCwgcmVtb3ZlIGl0LlxuXHRcdFx0XHRcdHByZXZWYWx1ZXNBcnJheS5zcGxpY2UoIGZvdW5kLCAxICk7XG5cblx0XHRcdFx0XHRpZiAoIHByZXZWYWx1ZXNBcnJheS5sZW5ndGggPT09IDAgKSB7XG5cdFx0XHRcdFx0XHRlbXB0eVZhbHVlID0gdHJ1ZTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0Ly8gRWxlbWVudCB3YXMgbm90IGZvdW5kLCBhZGQgaXQuXG5cdFx0XHRcdFx0cHJldlZhbHVlc0FycmF5LnB1c2goIGZpbHRlclZhbHVlICk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRpZiAoIHByZXZWYWx1ZXNBcnJheS5sZW5ndGggPiAxICkge1xuXHRcdFx0XHRcdG5leHRWYWx1ZXMgPSBwcmV2VmFsdWVzQXJyYXkuam9pbiggdmFsdWVTZXBhcmF0b3IgKTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRuZXh0VmFsdWVzID0gcHJldlZhbHVlc0FycmF5O1xuXHRcdFx0XHR9XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRuZXh0VmFsdWVzID0gZmlsdGVyVmFsdWU7XG5cdFx0XHR9XG5cdFx0fSBlbHNlIHtcblx0XHRcdG5leHRWYWx1ZXMgPSBmaWx0ZXJWYWx1ZTtcblx0XHR9XG5cblx0XHQvLyB1cGRhdGUgdXJsIGFuZCBxdWVyeSBzdHJpbmdcblx0XHRpZiAoICEgZW1wdHlWYWx1ZSApIHtcblx0XHRcdHdjYXBmVXBkYXRlUXVlcnlTdHJpbmdQYXJhbWV0ZXIoIGZpbHRlcktleSwgbmV4dFZhbHVlcyApO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRjb25zdCBxdWVyeSA9IHdjYXBmUmVtb3ZlUXVlcnlTdHJpbmdQYXJhbWV0ZXIoIGZpbHRlcktleSApO1xuXHRcdFx0aGlzdG9yeS5wdXNoU3RhdGUoIHt9LCAnJywgcXVlcnkgKTtcblx0XHR9XG5cblx0XHR3Y2FwZkZpbHRlclByb2R1Y3RzKCBmb3JjZVJlcmVuZGVyICk7XG5cdH1cblxuXHRmdW5jdGlvbiB3Y2FwZlNpbmdsZUZpbHRlciggZmlsdGVyS2V5LCBmaWx0ZXJWYWx1ZSApIHtcblx0XHRjb25zdCBwYXJhbXMgPSB3Y2FwZkdldFVybFZhcnMoKTtcblx0XHRsZXQgcXVlcnk7XG5cblx0XHRpZiAoIHR5cGVvZiBwYXJhbXNbIGZpbHRlcktleSBdICE9PSAndW5kZWZpbmVkJyAmJiBwYXJhbXNbIGZpbHRlcktleSBdID09PSBmaWx0ZXJWYWx1ZSApIHtcblx0XHRcdHF1ZXJ5ID0gd2NhcGZSZW1vdmVRdWVyeVN0cmluZ1BhcmFtZXRlciggZmlsdGVyS2V5ICk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHF1ZXJ5ID0gd2NhcGZVcGRhdGVRdWVyeVN0cmluZ1BhcmFtZXRlciggZmlsdGVyS2V5LCBmaWx0ZXJWYWx1ZSwgZmFsc2UgKTtcblx0XHR9XG5cblx0XHQvLyB1cGRhdGUgdXJsXG5cdFx0aGlzdG9yeS5wdXNoU3RhdGUoIHt9LCAnJywgcXVlcnkgKTtcblxuXHRcdHdjYXBmRmlsdGVyUHJvZHVjdHMoKTtcblx0fVxuXG5cdC8vIFRoZSBmdW5jdGlvbiB0byBoYW5kbGUgdGhlIGNvbW1vbiBmaWx0ZXIgcmVxdWVzdHMuXG5cdGZ1bmN0aW9uIGhhbmRsZUZpbHRlclJlcXVlc3QoICRpdGVtLCBmaWx0ZXJWYWx1ZSApIHtcblx0XHRjb25zdCAkZmllbGQgICAgICAgICA9ICRpdGVtLmNsb3Nlc3QoICcud2NhcGYtc2luZ2xlLWZpbHRlcicgKTtcblx0XHRjb25zdCBmaWVsZElEICAgICAgICA9ICRmaWVsZC5hdHRyKCAnZGF0YS1pZCcgKTtcblx0XHRjb25zdCBmaWVsZERhdGEgICAgICA9IGZpZWxkc1sgZmllbGRJRCBdO1xuXHRcdGNvbnN0IGZpbHRlcktleSAgICAgID0gZmllbGREYXRhLmZpbHRlcktleTtcblx0XHRjb25zdCBtdWx0aXBsZUZpbHRlciA9IGZpZWxkRGF0YS5tdWx0aXBsZUZpbHRlcjtcblxuXHRcdGlmICggISBmaWx0ZXJLZXkgKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0aWYgKCAhIGZpbHRlclZhbHVlLmxlbmd0aCApIHtcblx0XHRcdGNvbnN0IHF1ZXJ5ID0gd2NhcGZSZW1vdmVRdWVyeVN0cmluZ1BhcmFtZXRlciggZmlsdGVyS2V5ICk7XG5cdFx0XHRoaXN0b3J5LnB1c2hTdGF0ZSgge30sICcnLCBxdWVyeSApO1xuXG5cdFx0XHR3Y2FwZkZpbHRlclByb2R1Y3RzKCk7XG5cblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHRpZiAoIG11bHRpcGxlRmlsdGVyICkge1xuXHRcdFx0d2NhcGZNYWtlUGFyYW1ldGVycyggZmlsdGVyS2V5LCBmaWx0ZXJWYWx1ZSApO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHR3Y2FwZlNpbmdsZUZpbHRlciggZmlsdGVyS2V5LCBmaWx0ZXJWYWx1ZSApO1xuXHRcdH1cblx0fVxuXG5cdC8vIEhhbmRsZSB0aGUgZmlsdGVyIHJlcXVlc3QgZm9yIGxpc3QgZmllbGQuXG5cdCR3Y2FwZk5hdkZpbHRlcnMub24oXG5cdFx0J2NoYW5nZScsXG5cdFx0Jy53Y2FwZi1sYXllcmVkLW5hdiBbdHlwZT1cImNoZWNrYm94XCJdLCAud2NhcGYtbGF5ZXJlZC1uYXYgW3R5cGU9XCJyYWRpb1wiXScsXG5cdFx0ZnVuY3Rpb24oIGV2ZW50ICkge1xuXHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcblxuXHRcdFx0Y29uc3QgJGl0ZW0gICAgICAgPSAkKCB0aGlzICk7XG5cdFx0XHRjb25zdCBmaWx0ZXJWYWx1ZSA9ICRpdGVtLnZhbCgpO1xuXG5cdFx0XHRoYW5kbGVGaWx0ZXJSZXF1ZXN0KCAkaXRlbSwgZmlsdGVyVmFsdWUgKTtcblx0XHR9XG5cdCk7XG5cblx0Ly8gSGFuZGxlIHRoZSBmaWx0ZXIgcmVxdWVzdCBmb3IgbGFiZWxlZCBpdGVtLlxuXHQkd2NhcGZOYXZGaWx0ZXJzLm9uKCAnY2xpY2snLCAnLndjYXBmLWxhYmVsZWQtbmF2IC5pdGVtJywgZnVuY3Rpb24oIGV2ZW50ICkge1xuXHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cblx0XHRjb25zdCAkaXRlbSAgICAgICA9ICQoIHRoaXMgKTtcblx0XHRjb25zdCBmaWx0ZXJWYWx1ZSA9ICRpdGVtLmF0dHIoICdkYXRhLXZhbHVlJyApO1xuXG5cdFx0aGFuZGxlRmlsdGVyUmVxdWVzdCggJGl0ZW0sIGZpbHRlclZhbHVlICk7XG5cdH0gKTtcblxuXHQvLyBIYW5kbGUgdGhlIGZpbHRlciByZXF1ZXN0IGZvciBkaXNwbGF5IHR5cGUgc2VsZWN0IGZpZWxkcy5cblx0JHdjYXBmTmF2RmlsdGVycy5vbiggJ2NoYW5nZScsICdzZWxlY3QnLCBmdW5jdGlvbiggZXZlbnQgKSB7XG5cdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcblxuXHRcdGNvbnN0ICRpdGVtICAgICAgID0gJCggdGhpcyApO1xuXHRcdGNvbnN0IGZpbHRlclZhbHVlID0gJGl0ZW0udmFsKCk7XG5cblx0XHRjb25zdCAkZmllbGQgICAgPSAkaXRlbS5jbG9zZXN0KCAnLndjYXBmLXNpbmdsZS1maWx0ZXInICk7XG5cdFx0Y29uc3QgZmllbGRJRCAgID0gJGZpZWxkLmF0dHIoICdkYXRhLWlkJyApO1xuXHRcdGNvbnN0IGZpZWxkRGF0YSA9IGZpZWxkc1sgZmllbGRJRCBdO1xuXHRcdGNvbnN0IGZpbHRlcktleSA9IGZpZWxkRGF0YS5maWx0ZXJLZXk7XG5cblx0XHRpZiAoICEgZmlsdGVyVmFsdWUubGVuZ3RoICkge1xuXHRcdFx0Y29uc3QgcXVlcnkgPSB3Y2FwZlJlbW92ZVF1ZXJ5U3RyaW5nUGFyYW1ldGVyKCBmaWx0ZXJLZXkgKTtcblx0XHRcdGhpc3RvcnkucHVzaFN0YXRlKCB7fSwgJycsIHF1ZXJ5ICk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdGNvbnN0IGZpbHRlclZhbFN0cmluZyA9IGZpbHRlclZhbHVlLnRvU3RyaW5nKCk7XG5cdFx0XHR3Y2FwZlVwZGF0ZVF1ZXJ5U3RyaW5nUGFyYW1ldGVyKCBmaWx0ZXJLZXksIGZpbHRlclZhbFN0cmluZyApO1xuXHRcdH1cblxuXHRcdHdjYXBmRmlsdGVyUHJvZHVjdHMoKTtcblx0fSApO1xuXG5cdC8qKlxuXHQgKiBIYW5kbGUgdGhlIGZpbHRlciByZXF1ZXN0IGZvciByYW5nZSBudW1iZXIuXG5cdCAqL1xuXHRjb25zdCByYW5nZU51bWJlclNlbGVjdG9ycyA9ICcud2NhcGYtcmFuZ2UtbnVtYmVyIC5taW4tdmFsdWUsIC53Y2FwZi1yYW5nZS1udW1iZXIgLm1heC12YWx1ZSc7XG5cblx0JHdjYXBmTnVtYmVyUmFuZ2VGaWx0ZXJzLm9uKCAnaW5wdXQnLCByYW5nZU51bWJlclNlbGVjdG9ycywgZnVuY3Rpb24oIGV2ZW50ICkge1xuXHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cblx0XHRjb25zdCAkaXRlbSA9ICQoIHRoaXMgKTtcblxuXHRcdC8vIENsZWFyIGFueSBwcmV2aW91c2x5IHNldCB0aW1lciBiZWZvcmUgc2V0dGluZyBhIGZyZXNoIG9uZVxuXHRcdGNsZWFyVGltZW91dCggJGl0ZW0uZGF0YSggJ3RpbWVyJyApICk7XG5cblx0XHQkaXRlbS5kYXRhKCAndGltZXInLCBzZXRUaW1lb3V0KCBmdW5jdGlvbigpIHtcblx0XHRcdCRpdGVtLnJlbW92ZURhdGEoICd0aW1lcicgKTtcblxuXHRcdFx0Y29uc3QgJHJhbmdlTnVtYmVyICA9ICRpdGVtLmNsb3Nlc3QoICcud2NhcGYtcmFuZ2UtbnVtYmVyJyApO1xuXHRcdFx0Y29uc3QgZmlsdGVyS2V5ICAgICA9ICRyYW5nZU51bWJlci5hdHRyKCAnZGF0YS1maWx0ZXIta2V5JyApO1xuXHRcdFx0Y29uc3QgcmFuZ2VNaW5WYWx1ZSA9ICRyYW5nZU51bWJlci5hdHRyKCAnZGF0YS1yYW5nZS1taW4tdmFsdWUnICk7XG5cdFx0XHRjb25zdCByYW5nZU1heFZhbHVlID0gJHJhbmdlTnVtYmVyLmF0dHIoICdkYXRhLXJhbmdlLW1heC12YWx1ZScgKTtcblx0XHRcdGxldCBtaW5WYWx1ZSAgICAgICAgPSAkcmFuZ2VOdW1iZXIuZmluZCggJy5taW4tdmFsdWUnICkudmFsKCk7XG5cdFx0XHRsZXQgbWF4VmFsdWUgICAgICAgID0gJHJhbmdlTnVtYmVyLmZpbmQoICcubWF4LXZhbHVlJyApLnZhbCgpO1xuXG5cdFx0XHQvLyBGb3JjZSB0aGUgbWluVmFsdWUgbm90IHRvIGJlIGVtcHR5LlxuXHRcdFx0aWYgKCAhIG1pblZhbHVlLmxlbmd0aCApIHtcblx0XHRcdFx0bWluVmFsdWUgPSByYW5nZU1pblZhbHVlO1xuXG5cdFx0XHRcdCRyYW5nZU51bWJlci5maW5kKCAnLm1pbi12YWx1ZScgKS52YWwoIG1pblZhbHVlICk7XG5cdFx0XHR9XG5cblx0XHRcdC8vIEZvcmNlIHRoZSBtYXhWYWx1ZSBub3QgdG8gYmUgZW1wdHkuXG5cdFx0XHRpZiAoICEgbWF4VmFsdWUubGVuZ3RoICkge1xuXHRcdFx0XHRtYXhWYWx1ZSA9IHJhbmdlTWF4VmFsdWU7XG5cblx0XHRcdFx0JHJhbmdlTnVtYmVyLmZpbmQoICcubWF4LXZhbHVlJyApLnZhbCggbWF4VmFsdWUgKTtcblx0XHRcdH1cblxuXHRcdFx0Ly8gRm9yY2UgdGhlIG1pblZhbHVlIG5vdCB0byBnbyBiZWxvdyB0aGUgcmFuZ2VNaW5WYWx1ZS5cblx0XHRcdGlmICggcGFyc2VGbG9hdCggbWluVmFsdWUgKSA8IHBhcnNlRmxvYXQoIHJhbmdlTWluVmFsdWUgKSApIHtcblx0XHRcdFx0bWluVmFsdWUgPSByYW5nZU1pblZhbHVlO1xuXG5cdFx0XHRcdCRyYW5nZU51bWJlci5maW5kKCAnLm1pbi12YWx1ZScgKS52YWwoIG1pblZhbHVlICk7XG5cdFx0XHR9XG5cblx0XHRcdC8vIEZvcmNlIHRoZSBtaW5WYWx1ZSBub3QgdG8gZ28gdXAgdGhlIHJhbmdlTWF4VmFsdWUuXG5cdFx0XHRpZiAoIHBhcnNlRmxvYXQoIG1pblZhbHVlICkgPiBwYXJzZUZsb2F0KCByYW5nZU1heFZhbHVlICkgKSB7XG5cdFx0XHRcdG1pblZhbHVlID0gcmFuZ2VNYXhWYWx1ZTtcblxuXHRcdFx0XHQkcmFuZ2VOdW1iZXIuZmluZCggJy5taW4tdmFsdWUnICkudmFsKCBtaW5WYWx1ZSApO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBGb3JjZSB0aGUgbWF4VmFsdWUgbm90IHRvIGdvIHVwIHRoZSByYW5nZU1heFZhbHVlLlxuXHRcdFx0aWYgKCBwYXJzZUZsb2F0KCBtYXhWYWx1ZSApID4gcGFyc2VGbG9hdCggcmFuZ2VNYXhWYWx1ZSApICkge1xuXHRcdFx0XHRtYXhWYWx1ZSA9IHJhbmdlTWF4VmFsdWU7XG5cblx0XHRcdFx0JHJhbmdlTnVtYmVyLmZpbmQoICcubWF4LXZhbHVlJyApLnZhbCggbWF4VmFsdWUgKTtcblx0XHRcdH1cblxuXHRcdFx0Ly8gRm9yY2UgdGhlIG1heFZhbHVlIG5vdCB0byBnbyBiZWxvdyB0aGUgbWluVmFsdWUuXG5cdFx0XHRpZiAoIHBhcnNlRmxvYXQoIG1pblZhbHVlICkgPiBwYXJzZUZsb2F0KCBtYXhWYWx1ZSApICkge1xuXHRcdFx0XHRtYXhWYWx1ZSA9IG1pblZhbHVlO1xuXG5cdFx0XHRcdCRyYW5nZU51bWJlci5maW5kKCAnLm1heC12YWx1ZScgKS52YWwoIG1heFZhbHVlICk7XG5cdFx0XHR9XG5cblx0XHRcdGlmICggbWluVmFsdWUgPT09IHJhbmdlTWluVmFsdWUgJiYgbWF4VmFsdWUgPT09IHJhbmdlTWF4VmFsdWUgKSB7XG5cdFx0XHRcdGNvbnN0IHF1ZXJ5ID0gd2NhcGZSZW1vdmVRdWVyeVN0cmluZ1BhcmFtZXRlciggZmlsdGVyS2V5ICk7XG5cdFx0XHRcdGhpc3RvcnkucHVzaFN0YXRlKCB7fSwgJycsIHF1ZXJ5ICk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRjb25zdCBmaWx0ZXJWYWxTdHJpbmcgPSBtaW5WYWx1ZSArIHJhbmdlVmFsdWVzU2VwYXJhdG9yICsgbWF4VmFsdWU7XG5cdFx0XHRcdHdjYXBmVXBkYXRlUXVlcnlTdHJpbmdQYXJhbWV0ZXIoIGZpbHRlcktleSwgZmlsdGVyVmFsU3RyaW5nICk7XG5cdFx0XHR9XG5cblx0XHRcdHdjYXBmRmlsdGVyUHJvZHVjdHMoKTtcblx0XHR9LCBkZWxheSApICk7XG5cdH0gKTtcblxuXHQvLyBIYW5kbGUgcmVtb3ZpbmcgdGhlIGFjdGl2ZSBmaWx0ZXJzLlxuXHQkd2NhcGZOYXZGaWx0ZXJzLm9uKCAnY2xpY2snLCAnLndjYXBmLWFjdGl2ZS1maWx0ZXJzIC5pdGVtJywgZnVuY3Rpb24oIGV2ZW50ICkge1xuXHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cblx0XHRjb25zdCAkaXRlbSAgICAgICA9ICQoIHRoaXMgKTtcblx0XHRjb25zdCBmaWx0ZXJLZXkgICA9ICRpdGVtLmF0dHIoICdkYXRhLWZpbHRlci1rZXknICk7XG5cdFx0Y29uc3QgZmlsdGVyVmFsdWUgPSAkaXRlbS5hdHRyKCAnZGF0YS12YWx1ZScgKTtcblxuXHRcdHdjYXBmTWFrZVBhcmFtZXRlcnMoIGZpbHRlcktleSwgZmlsdGVyVmFsdWUsIHRydWUgKTtcblx0fSApO1xuXG5cdGZ1bmN0aW9uIHJlc2V0RmlsdGVycyggJGJ1dHRvbiApIHtcblx0XHRjb25zdCBfZmlsdGVyS2V5cyA9ICRidXR0b24uYXR0ciggJ2RhdGEta2V5cycgKTtcblxuXHRcdGlmICggISBfZmlsdGVyS2V5cyApIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHRjb25zdCBmaWx0ZXJLZXlzID0gX2ZpbHRlcktleXMuc3BsaXQoICcsJyApO1xuXG5cdFx0bGV0IHF1ZXJ5ID0gJyc7XG5cblx0XHQkLmVhY2goIGZpbHRlcktleXMsIGZ1bmN0aW9uKCBpLCBmaWx0ZXJLZXkgKSB7XG5cdFx0XHRpZiAoIHF1ZXJ5ICkge1xuXHRcdFx0XHRxdWVyeSA9IHdjYXBmUmVtb3ZlUXVlcnlTdHJpbmdQYXJhbWV0ZXIoIGZpbHRlcktleSwgcXVlcnkgKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHF1ZXJ5ID0gd2NhcGZSZW1vdmVRdWVyeVN0cmluZ1BhcmFtZXRlciggZmlsdGVyS2V5ICk7XG5cdFx0XHR9XG5cdFx0fSApO1xuXG5cdFx0Ly8gRW1wdHkgcXVlcnkgY2F1c2VzIGlzc3VlKGRvZXNuJ3QgcmVtb3ZlIHRoZSBmaWx0ZXIga2V5cyBmcm9tIHRoZSB1cmwpLFxuXHRcdC8vIHRoaXMgaXMgd2h5IHdlIGFyZSBzZXR0aW5nIHRoZSBwYWdlIHVybCBhcyBxdWVyeS5cblx0XHRpZiAoICEgcXVlcnkgKSB7XG5cdFx0XHRjb25zdCBwcmV2VXJsID0gd2luZG93LmxvY2F0aW9uLmhyZWY7XG5cdFx0XHRjb25zdCBuZXdVcmwgID0gcHJldlVybC5zcGxpdCggJz8nICk7XG5cblx0XHRcdHF1ZXJ5ID0gbmV3VXJsWyAwIF07XG5cdFx0fVxuXG5cdFx0aGlzdG9yeS5wdXNoU3RhdGUoIHt9LCAnJywgcXVlcnkgKTtcblxuXHRcdHdjYXBmRmlsdGVyUHJvZHVjdHMoIHRydWUgKTtcblx0fVxuXG5cdC8vIENsZWFyL1Jlc2V0IGFsbCBmaWx0ZXJzLlxuXHQkYm9keS5vbiggJ3djYXBmLXJlc2V0LWZpbHRlcnMnLCBmdW5jdGlvbiggZSwgJGJ1dHRvbiApIHtcblx0XHRyZXNldEZpbHRlcnMoICRidXR0b24gKTtcblx0fSApO1xuXG5cdCR3Y2FwZk5hdkZpbHRlcnMub24oICdjbGljaycsICcud2NhcGYtcmVzZXQtZmlsdGVycy1idG4nLCBmdW5jdGlvbiggZXZlbnQgKSB7XG5cdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcblxuXHRcdGNvbnN0ICRidXR0b24gPSAkKCB0aGlzICk7XG5cblx0XHQkYm9keS50cmlnZ2VyKCAnd2NhcGYtcmVzZXQtZmlsdGVycycsIFsgJGJ1dHRvbiBdICk7XG5cdH0gKTtcblxuXHQkd2NhcGZTaW5nbGVGaWx0ZXJzLm9uKCAnd2NhcGYtY2xlYXItZmlsdGVyJywgZnVuY3Rpb24oKSB7XG5cdFx0Y29uc3QgJGZpZWxkICAgID0gJCggdGhpcyApO1xuXHRcdGNvbnN0IGZpZWxkSUQgICA9ICRmaWVsZC5hdHRyKCAnZGF0YS1pZCcgKTtcblx0XHRjb25zdCBmaWVsZERhdGEgPSBmaWVsZHNbIGZpZWxkSUQgXTtcblx0XHRjb25zdCBmaWx0ZXJLZXkgPSBmaWVsZERhdGEuZmlsdGVyS2V5O1xuXG5cdFx0Y29uc3QgcXVlcnkgPSB3Y2FwZlJlbW92ZVF1ZXJ5U3RyaW5nUGFyYW1ldGVyKCBmaWx0ZXJLZXkgKTtcblx0XHRoaXN0b3J5LnB1c2hTdGF0ZSgge30sICcnLCBxdWVyeSApO1xuXG5cdFx0d2NhcGZGaWx0ZXJQcm9kdWN0cyggdHJ1ZSApO1xuXHR9ICk7XG5cblx0JGJvZHkub24oICd3Y2FwZi1ydW4tZmlsdGVyLXByb2R1Y3RzJywgZnVuY3Rpb24oIGUsIGZvcmNlUmVSZW5kZXIgKSB7XG5cdFx0d2NhcGZGaWx0ZXJQcm9kdWN0cyggZm9yY2VSZVJlbmRlciApO1xuXHR9ICk7XG5cblx0Ly8gSGlzdG9yeSBiYWNrIGFuZCBmb3J3YXJkIHJlcXVlc3QgaGFuZGxpbmcuXG5cdCQoIHdpbmRvdyApLmJpbmQoICdwb3BzdGF0ZScsIGZ1bmN0aW9uKCkge1xuXHRcdHdjYXBmRmlsdGVyUHJvZHVjdHMoIHRydWUgKTtcblx0fSApO1xuXG59ICk7XG4iXX0=
