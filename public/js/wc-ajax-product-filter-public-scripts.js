"use strict";

/**
 * The frontend filter form.
 *
 * @since      3.0.0
 * @package    wc-ajax-product-filter
 * @subpackage wc-ajax-product-filter/public/src/js
 * @author     wptools.io
 */
var wcapf_params = wcapf_params || {
  'is_rtl': '',
  'filter_input_delay': '',
  'chosen_display_selected_options': '',
  'chosen_no_results_text': '',
  'chosen_options_none_text': '',
  'search_box_in_default_orderby': '',
  'chosen_lib_search_threshold': '',
  // todo
  'preserve_hierarchy_accordion_state': '',
  'preserve_soft_limit_state': '',
  'enable_animation_for_filter_accordion': '',
  'filter_accordion_animation_speed': '',
  'filter_accordion_animation_easing': '',
  'enable_animation_for_hierarchy_accordion': '',
  'hierarchy_accordion_animation_speed': '',
  'hierarchy_accordion_animation_easing': '',
  'restore_focus_after_filtering': '',
  'loading_overlay_options': '',
  'scroll_to_top_speed': '',
  'scroll_to_top_easing': '',
  'is_mobile': '',
  'disable_inputs_while_fetching_results': '',
  'apply_filters_on_browser_history_change': '',
  'shop_loop_container': '',
  'not_found_container': '',
  'enable_pagination_via_ajax': '',
  'pagination_container': '',
  'sorting_control': '',
  'attach_chosen_on_sorting': '',
  'loading_animation': '',
  'scroll_window': '',
  'scroll_window_for': '',
  'scroll_window_when': '',
  'scroll_window_custom_element': '',
  'scroll_to_top_offset': '',
  'for_preview': ''
};
jQuery(document).ready(function ($) {
  return;
  var $body = $('body');
  var rangeValuesSeparator = '~';

  var _delay = parseInt(wcapf_params.filter_input_delay);

  var delay = _delay >= 0 ? _delay : 800; // Store fields' id and filter information.

  var fields = {};
  var wcapfSingleFilterSelector = '.wcapf-single-filter';
  var wcapfNavFilterSelector = '.wcapf-nav-filter';
  var wcapfNumberRangeFilterSelector = '.wcapf-number-range-filter';
  var wcapfDateFilterSelector = '.wcapf-date-range-filter';
  var $wcapfSingleFilters = $(wcapfSingleFilterSelector);
  var $wcapfNavFilters = $(wcapfNavFilterSelector);
  var $wcapfNumberRangeFilters = $(wcapfNumberRangeFilterSelector);
  var $wcapfDateFilters = $(wcapfDateFilterSelector);
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

    var $root;

    if (wcapf_params.for_preview) {
      $root = $(wcapfNavFilterSelector);
    } else {
      $root = $wcapfNavFilters;
    }

    $root.find('.wcapf-chosen-select').each(function () {
      var $this = $(this);
      var options = {
        inherit_select_classes: true,
        inherit_option_classes: true
      };

      if (wcapf_params.is_rtl) {
        options['rtl'] = true;
      }

      var noResultsMessage = $this.attr('data-no-results-message');

      if (noResultsMessage) {
        options['no_results_text'] = noResultsMessage;
      } // options[ 'disable_search' ] = true;


      var searchThreshold = parseInt(wcapf_params.chosen_lib_search_threshold);

      if (searchThreshold) {// options[ 'disable_search_threshold' ] = searchThreshold;
      } // options[ 'display_selected_options' ] = false;
      // minimumResultsForSearch: 20
      // options['minimumResultsForSearch'] = -1;


      $this.chosen(options);
    });
  }

  initChosen(); // Initialize hierarchy accordion.

  function initHierarchyAccordion() {
    var $root;

    if (wcapf_params.for_preview) {
      $root = $(wcapfNavFilterSelector);
    } else {
      $root = $wcapfNavFilters;
    }

    function toggleAccordion($el) {
      // Check to see if the button is pressed
      var pressed = $el.attr('aria-pressed') === 'true'; // Change aria-pressed to the opposite state

      $el.attr('aria-pressed', !pressed);
      var $child = $el.closest('li').children('ul');

      if (wcapf_params.enable_animation_for_hierarchy_accordion) {
        $child.slideToggle(wcapf_params.hierarchy_accordion_animation_speed, wcapf_params.hierarchy_accordion_animation_easing);
      } else {
        $child.toggle();
      }
    }

    $root.find('.wcapf-hierarchy-accordion-toggle').on('click', function () {
      toggleAccordion($(this));
    });
    $root.find('.wcapf-hierarchy-accordion-toggle').on('keydown', function (e) {
      if (e.key === ' ' || e.key === 'Enter' || e.key === 'Spacebar') {
        // Prevent the default action to stop scrolling when space is pressed
        e.preventDefault();
        toggleAccordion($(this));
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

    var $root;

    if (wcapf_params.for_preview) {
      $root = $(wcapfNumberRangeFilterSelector);
    } else {
      $root = $wcapfNumberRangeFilters;
    }

    $root.find('.wcapf-range-slider').each(function () {
      var $item = $(this); // TODO: Remove filter key.

      var filterKey = $item.attr('data-filter-key');
      var $slider = $item.find('.wcapf-noui-slider'); // If slider is already initialized then don't reinitialize again.

      if ($slider.hasClass('wcapf-noui-target')) {
        return;
      }

      var sliderId = $slider.attr('id');
      var displayValuesAs = $item.attr('data-display-values-as');
      var formatNumbers = $item.attr('data-format-numbers');
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
        var minValue;
        var maxValue;

        if (formatNumbers) {
          minValue = number_format(values[0], decimalPlaces, decimalSeparator, thousandSeparator);
          maxValue = number_format(values[1], decimalPlaces, decimalSeparator, thousandSeparator);
        } else {
          minValue = parseFloat(values[0]);
          maxValue = parseFloat(values[1]);
        }

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
        if (wcapf_params.for_preview) {
          return;
        }

        var minValue = parseFloat(values[0]);
        var maxValue = parseFloat(values[1]);

        if (minValue === rangeMinValue && maxValue === rangeMaxValue) {
          // Remove range filter.
          requestFilter($item.data('clear-filter-url'));
        } else {
          // Add range filter.
          var url = $item.data('url').replace('%1s', minValue).replace('%2s', maxValue);
          requestFilter(url);
        }
      }

      slider.noUiSlider.on('change', function (values) {
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
    if (wcapf_params.for_preview) {
      return;
    }

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
          updateQueryStringParameter(filterKey, filterValue);
        } else {
          var query = removeQueryStringParameter(filterKey);
          history.pushState({}, '', query);
        }

        filterProducts();
      }, delay));
    }
  }

  function initDatepicker() {
    if (!jQuery().datepicker) {
      return;
    }

    var $root;

    if (wcapf_params.for_preview) {
      $root = $(wcapfDateFilterSelector);
    } else {
      $root = $wcapfDateFilters;
    }

    var $wcapfDateFilter = $root.find('.wcapf-date-input');
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

  initDatepicker();

  function initDefaultOrderBy() {
    // Attach chosen.
    if (wcapf_params.attach_chosen_on_sorting) {
      if (jQuery().chosen) {
        $body.find('.woocommerce-ordering select.orderby').chosen({
          'disable_search_threshold': 15
        });
      }
    }

    if (!wcapf_params.sorting_control) {
      $body.find('.woocommerce-ordering').each(function () {
        var $orderingForm = $(this);
        $orderingForm.on('change', 'select.orderby', function () {
          $orderingForm.submit();
        });
      });
      return;
    } // todo: check if ajax disabled.


    $body.find('.woocommerce-ordering').each(function () {
      var $orderingForm = $(this);
      $orderingForm.on('submit', function (e) {
        e.preventDefault();
      });
      $orderingForm.on('change', 'select.orderby', function (e) {
        e.preventDefault();
        var order = $(this).val();
        var filter_key = 'orderby';
        updateQueryStringParameter(filter_key, order);
        filterProducts();
      });
    });
  }

  initDefaultOrderBy();

  function updateProductsCountResult($results) {
    var selector = '.woocommerce-result-count';

    if ($(wcapf_params.shop_loop_container).find(selector).length) {
      return;
    }

    var newProductCount = $results.find(selector).html();
    $body.find(selector).html(newProductCount);
  }

  function showLoadingAnimation() {
    if (!wcapf_params.loading_animation) {
      return;
    }

    $.LoadingOverlay('show', wcapf_params.loading_overlay_options);
  }

  function disableNoUiSliders() {
    if ('undefined' === typeof noUiSlider) {
      return;
    }

    $wcapfNumberRangeFilters.find('.wcapf-noui-slider').each(function (e, element) {
      element.setAttribute('disabled', true);
    });
  }

  function disableLabels() {
    var selectors = '.wcapf-labeled-nav .item, .wcapf-active-filters .item'; // TODO: Add disabled attribute.

    $wcapfSingleFilters.find(selectors).addClass('disabled');
  }

  function disableInputs() {
    if (!wcapf_params.disable_inputs_while_fetching_results) {
      return;
    }

    var inputs = 'input, select';
    $wcapfSingleFilters.find(inputs).attr('disabled', 'disabled');
    $wcapfSingleFilters.find(inputs).trigger('chosen:updated');
    disableNoUiSliders();
    disableLabels();
  }

  function enableNoUiSliders() {
    if ('undefined' === typeof noUiSlider) {
      return;
    }

    $wcapfNumberRangeFilters.find('.wcapf-noui-slider').each(function (e, element) {
      element.removeAttribute('disabled');
    });
  }

  function enableInputs() {
    if (!wcapf_params.disable_inputs_while_fetching_results) {
      return;
    }

    var inputs = 'input';
    $wcapfNumberRangeFilters.find(inputs).removeAttr('disabled');
    $wcapfDateFilters.find(inputs).removeAttr('disabled');
    enableNoUiSliders();
  }

  function resetLoadingAnimation() {
    if (!wcapf_params.loading_animation) {
      return;
    }

    $.LoadingOverlay('hide');
  }

  function scrollTo() {
    if ('none' === wcapf_params.scroll_window) {
      return;
    }

    var scrollFor = wcapf_params.scroll_window_for;
    var isMobile = wcapf_params.is_mobile;
    var proceed = false;

    if ('mobile' === scrollFor && isMobile) {
      proceed = true;
    } else if ('desktop' === scrollFor && !isMobile) {
      proceed = true;
    } else if ('both' === scrollFor) {
      proceed = true;
    }

    if (!proceed) {
      return;
    }

    var adjustingOffset, offset;

    if (wcapf_params.scroll_to_top_offset) {
      adjustingOffset = parseInt(wcapf_params.scroll_to_top_offset);
    }

    var container;

    if ($(wcapf_params.shop_loop_container).length) {
      container = wcapf_params.shop_loop_container;
    } else if ($(wcapf_params.not_found_container).length) {
      container = wcapf_params.not_found_container;
    }

    if ('custom' === wcapf_params.scroll_window) {
      container = wcapf_params.scroll_window_custom_element;
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
  } // Things are done before fetching the products like showing a loading indicator.


  function beforeFetchingProducts() {
    disableInputs();
    showLoadingAnimation();

    if ('immediately' === wcapf_params.scroll_window_when) {
      scrollTo();
    }

    $body.trigger('wcapf_before_fetching_products');
  }

  function beforeUpdatingProducts($results) {
    resetLoadingAnimation();
    $body.trigger('wcapf_before_updating_products', [$results]);
  } // Things are done after applying the filter like scroll to top.


  function afterUpdatingProducts($results) {
    initChosen();
    initHierarchyAccordion();
    initNoUISlider();
    initDatepicker();
    initDefaultOrderBy();
    updateProductsCountResult($results);
    enableInputs();

    if ('after' === wcapf_params.scroll_window_when) {
      scrollTo();
    }

    $body.trigger('wcapf_after_updating_products', [$results]);
  } // The main filter function.


  function filterProducts() {
    var forceReRender = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

    if (wcapf_params.for_preview) {
      return;
    }

    beforeFetchingProducts();
    $.get(window.location.href, function (data) {
      var $data = $(data); // Replace the fields' data with new data.

      $.each(fields, function (id) {
        var fieldID = '[data-id="' + id + '"]';
        var $field = $(fieldID);
        var $inner = $field.find('.wcapf-field-inner');

        var _field = $data.find(fieldID);

        var fieldClasses = $(_field).attr('class'); // Preserve hierarchy accordion state.

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

        var _html = _field.find('.wcapf-field-inner').html(); // Show soft limit items.


        var softLimitSelector = 'show-hidden-items';

        if ($field.hasClass(softLimitSelector)) {
          if (!_field.hasClass(softLimitSelector)) {
            fieldClasses += ' ' + softLimitSelector;
          }
        } else {
          fieldClasses = fieldClasses.replace(softLimitSelector, '');
        } // Update the field's class.


        $field.attr('class', fieldClasses.trim()); // When called from history back or forward request then rerender all fields.

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
      });
      beforeUpdatingProducts($data); // Replace old shop loop with new one.

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

      afterUpdatingProducts($data);
    });
  } // URL Parser


  function getUrlVars(url) {
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


  function fixPagination() {
    var url = window.location.href;
    var params = getUrlVars(url);
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


  function updateQueryStringParameter(key, value, pushHistory, url) {
    if (typeof pushHistory === 'undefined') {
      pushHistory = true;
    }

    if (typeof url === 'undefined') {
      url = fixPagination();
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


  function removeQueryStringParameter(filterKey, url) {
    if (typeof url === 'undefined') {
      url = fixPagination();
    }

    var oldParams = getUrlVars(url);
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


  function makeParameters(filterKey, filterValue) {
    var forceRerender = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
    var url = arguments.length > 3 ? arguments[3] : undefined;
    var valueSeparator = ',';
    var params,
        nextValues,
        emptyValue = false;

    if (typeof url !== 'undefined') {
      params = getUrlVars(url);
    } else {
      params = getUrlVars();
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
      updateQueryStringParameter(filterKey, nextValues);
    } else {
      var query = removeQueryStringParameter(filterKey);
      history.pushState({}, '', query);
    }

    filterProducts(forceRerender);
  }

  function singleFilter(filterKey, filterValue) {
    var params = getUrlVars();
    var query;

    if (typeof params[filterKey] !== 'undefined' && params[filterKey] === filterValue) {
      query = removeQueryStringParameter(filterKey);
    } else {
      query = updateQueryStringParameter(filterKey, filterValue, false);
    } // update url


    history.pushState({}, '', query);
    filterProducts();
  } // Handle the pagination request via ajax.


  if (wcapf_params.enable_pagination_via_ajax && wcapf_params.pagination_container) {
    var $container = $(wcapf_params.shop_loop_container);
    var selector = wcapf_params.pagination_container + ' a'; // todo: check if ajax disabled.

    if ($container.length) {
      $container.on('click', selector, function (e) {
        e.preventDefault();
        var location = $(this).attr('href');
        history.pushState({}, '', location);
        filterProducts();
      });
    }
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
      var query = removeQueryStringParameter(filterKey);
      history.pushState({}, '', query);
      filterProducts();
      return;
    }

    if (multipleFilter) {
      makeParameters(filterKey, filterValue);
    } else {
      singleFilter(filterKey, filterValue);
    }
  }

  function requestFilter(url) {
    if (!url) {
      return;
    } // window.location.href = url;
    // TODO: Filter the products conditionally.
    // filterProducts();

  } // Handle the filter request for list field.


  $wcapfNavFilters.on('change', '.wcapf-layered-nav [type="checkbox"], .wcapf-layered-nav [type="radio"]', function (event) {
    event.preventDefault();
    var $item = $(this);
    requestFilter($item.data('url'));
  }); // Handle the filter request for labeled item.

  $wcapfNavFilters.on('click', '.wcapf-labeled-nav .item:not(.disabled)', function (event) {
    event.preventDefault();
    var $item = $(this);
    requestFilter($item.data('url'));
  }); // Handle the filter request for display type select fields.

  $wcapfNavFilters.on('change', 'select', function (event) {
    event.preventDefault();
    var $select = $(this);
    var values = $select.val();
    var filterURL = $select.data('url');
    var clearFilterURL = $select.data('clear-filter-url');
    var url;

    if (values.length) {
      url = filterURL.replace('%s', values.toString());
    } else {
      url = clearFilterURL;
    }

    requestFilter(url);
  });
  /**
   * Handle the filter request for range number.
   */

  var rangeNumberSelectors = '.wcapf-range-number .min-value, .wcapf-range-number .max-value'; // TODO: Maybe use 'change' event.

  $wcapfNumberRangeFilters.on('input', rangeNumberSelectors, function (event) {
    event.preventDefault();
    var $item = $(this);
    var $rangeNumber = $item.closest('.wcapf-range-number');
    var formatNumbers = $rangeNumber.attr('data-format-numbers');
    var rangeMinValue = parseFloat($rangeNumber.attr('data-range-min-value'));
    var rangeMaxValue = parseFloat($rangeNumber.attr('data-range-max-value'));
    var decimalPlaces = $rangeNumber.attr('data-decimal-places');
    var thousandSeparator = $rangeNumber.attr('data-thousand-separator');
    var decimalSeparator = $rangeNumber.attr('data-decimal-separator'); // Clear any previously set timer before setting a fresh one

    clearTimeout($item.data('timer'));

    function getValue(floatValue) {
      if (formatNumbers) {
        return number_format(floatValue, decimalPlaces, decimalSeparator, thousandSeparator);
      }

      return floatValue;
    }

    $item.data('timer', setTimeout(function () {
      $item.removeData('timer');
      var minValue = parseFloat($rangeNumber.find('.min-value').val());
      var maxValue = parseFloat($rangeNumber.find('.max-value').val()); // Force the minValue not to be empty.

      if (isNaN(minValue)) {
        minValue = rangeMinValue;
        $rangeNumber.find('.min-value').val(getValue(minValue));
      } else {
        $rangeNumber.find('.min-value').val(getValue(minValue));
      } // Force the maxValue not to be empty.


      if (isNaN(maxValue)) {
        maxValue = rangeMaxValue;
        $rangeNumber.find('.max-value').val(getValue(maxValue));
      } else {
        $rangeNumber.find('.max-value').val(getValue(maxValue));
      } // Force the minValue not to go below the rangeMinValue.


      if (minValue < rangeMinValue) {
        minValue = rangeMinValue;
        $rangeNumber.find('.min-value').val(getValue(minValue));
      } // Force the minValue not to go up the rangeMaxValue.


      if (minValue > rangeMaxValue) {
        minValue = rangeMaxValue;
        $rangeNumber.find('.min-value').val(getValue(minValue));
      } // Force the maxValue not to go up the rangeMaxValue.


      if (maxValue > rangeMaxValue) {
        maxValue = rangeMaxValue;
        $rangeNumber.find('.max-value').val(getValue(maxValue));
      } // Force the maxValue not to go below the minValue.


      if (minValue > maxValue) {
        maxValue = minValue;
        $rangeNumber.find('.max-value').val(getValue(maxValue));
      }

      if (minValue === rangeMinValue && maxValue === rangeMaxValue) {
        // Remove range filter.
        requestFilter($rangeNumber.data('clear-filter-url'));
      } else {
        // Add range filter.
        var url = $rangeNumber.data('url').replace('%1s', minValue).replace('%2s', maxValue);
        requestFilter(url);
      }
    }, delay));
  }); // Handle removing the active filters.

  $wcapfNavFilters.on('click', '.wcapf-active-filters .item:not(.disabled)', function (event) {
    event.preventDefault();
    var $item = $(this);
    var filterKey = $item.attr('data-filter-key');
    var filterValue = $item.attr('data-value');
    makeParameters(filterKey, filterValue, true);
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
        query = removeQueryStringParameter(filterKey, query);
      } else {
        query = removeQueryStringParameter(filterKey);
      }
    }); // Empty query causes issue(doesn't remove the filter keys from the url),
    // this is why we are setting the page url as query.

    if (!query) {
      var prevUrl = window.location.href;
      var newUrl = prevUrl.split('?');
      query = newUrl[0];
    }

    history.pushState({}, '', query);
    filterProducts(true);
  } // Clear/Reset all filters.


  $body.on('wcapf-reset-filters', function (e, $button) {
    resetFilters($button);
  });
  $body.on('click', '.wcapf-reset-filters-btn', function () {
    var $button = $(this);
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
    var query = removeQueryStringParameter(filterKey);
    history.pushState({}, '', query);
    filterProducts(true);
  }); // Run ajax filter when browser history changes (user goes back or forward).

  if ($(wcapf_params.shop_loop_container).length || $(wcapf_params.not_found_container).length) {
    if (wcapf_params.apply_filters_on_browser_history_change) {
      $(window).bind('popstate', function () {
        filterProducts(true);
      });
    }
  } // The hook that manually run the ajax filters (can be useful for other plugins).


  $body.on('wcapf-run-filter-products', function (e, forceReRender) {
    filterProducts(forceReRender);
  }); // The hook that reinitialize the filter widgets (to show the preview in the backend).

  $body.on('init_filter_widgets', function () {
    initChosen();
    initHierarchyAccordion();
    initNoUISlider();
    initDatepicker();
  });
  /**
   * Make it compatible with other plugins.
   */

  $body.on('wcapf_after_updating_products', function () {
    // woo-variation-swatches
    $(document).trigger('woo_variation_swatches_pro_init');
  });
});
"use strict";

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

(function ($, window) {
  var _delay = parseInt(wcapf_params.filter_input_delay);

  var delay = _delay >= 0 ? _delay : 800;
  var $body = $('body');
  var instanceIds = [];
  $('.wcapf-filter').each(function () {
    instanceIds.push($(this).data('id'));
  });
  var focusedElm;
  window.WCAPF = window.WCAPF || {};
  window.WCAPF = {
    handleFilterAccordion: function handleFilterAccordion() {
      var toggleAccordion = function toggleAccordion($el) {
        // Check to see if the accordion is opened
        var pressed = $el.attr('aria-expanded') === 'true'; // Change aria-expanded to the opposite state

        $el.attr('aria-expanded', !pressed);
        var $filterInner = $el.closest('.wcapf-filter').children('.wcapf-filter-inner');

        if (wcapf_params.enable_animation_for_filter_accordion) {
          $filterInner.slideToggle(wcapf_params.filter_accordion_animation_speed, wcapf_params.filter_accordion_animation_easing);
        } else {
          $filterInner.toggle();
        }
      };

      $body.on('click', '.wcapf-filter-accordion-trigger', function () {
        toggleAccordion($(this));
      });
    },
    handleHierarchyToggle: function handleHierarchyToggle() {
      var toggleAccordion = function toggleAccordion($el) {
        // Check to see if the button is pressed
        var pressed = $el.attr('aria-pressed') === 'true'; // Change aria-pressed to the opposite state

        $el.attr('aria-pressed', !pressed);
        var $child = $el.closest('li').children('ul');

        if (wcapf_params.enable_animation_for_hierarchy_accordion) {
          $child.slideToggle(wcapf_params.hierarchy_accordion_animation_speed, wcapf_params.hierarchy_accordion_animation_easing);
        } else {
          $child.toggle();
        }
      };

      $body.on('click', '.wcapf-hierarchy-accordion-toggle', function () {
        toggleAccordion($(this));
      }).on('keydown', '.wcapf-hierarchy-accordion-toggle', function (e) {
        if (e.key === ' ' || e.key === 'Enter' || e.key === 'Spacebar') {
          // Prevent the default action to stop scrolling when space is pressed
          e.preventDefault();
          toggleAccordion($(this));
        }
      });
    },
    handleSoftLimit: function handleSoftLimit() {
      var toggleFilterOptions = function toggleFilterOptions($el) {
        // Check to see if the button is pressed
        var pressed = $el.attr('aria-pressed') === 'true'; // Change aria-pressed to the opposite state

        $el.attr('aria-pressed', !pressed);
        var $listWrapper = $el.closest('.wcapf-list-wrapper');

        if (pressed) {
          $listWrapper.removeClass('show-hidden-options');
        } else {
          $listWrapper.addClass('show-hidden-options');
        }
      };

      $body.on('click', '.wcapf-soft-limit-trigger', function () {
        toggleFilterOptions($(this));
      }).on('keydown', '.wcapf-soft-limit-trigger', function (e) {
        if (e.key === ' ' || e.key === 'Enter' || e.key === 'Spacebar') {
          // Prevent the default action to stop scrolling when space is pressed
          e.preventDefault();
          toggleFilterOptions($(this));
        }
      });
    },
    handleSearchFilterOptions: function handleSearchFilterOptions() {},
    updateProductsCountResult: function updateProductsCountResult($response) {
      var $container = $(wcapf_params.shop_loop_container);
      var selector = '.woocommerce-result-count';
      var newCount = $response.find(selector).html();
      $body.find(selector).each(function () {
        var $el = $(this);

        if (!$container.has($el).length) {
          $el.html(newCount);
        }
      });
    },
    showLoadingAnimation: function showLoadingAnimation() {
      if (!wcapf_params.loading_animation) {
        return;
      }

      $.LoadingOverlay('show', wcapf_params.loading_overlay_options);
    },
    resetLoadingAnimation: function resetLoadingAnimation() {
      if (!wcapf_params.loading_animation) {
        return;
      }

      $.LoadingOverlay('hide');
    },
    scrollTo: function scrollTo() {
      if ('none' === wcapf_params.scroll_window) {
        return;
      }

      var scrollFor = wcapf_params.scroll_window_for;
      var isMobile = wcapf_params.is_mobile;
      var proceed = false;

      if ('mobile' === scrollFor && isMobile) {
        proceed = true;
      } else if ('desktop' === scrollFor && !isMobile) {
        proceed = true;
      } else if ('both' === scrollFor) {
        proceed = true;
      }

      if (!proceed) {
        return;
      }

      var adjustingOffset, offset;

      if (wcapf_params.scroll_to_top_offset) {
        adjustingOffset = parseInt(wcapf_params.scroll_to_top_offset);
      }

      var container;

      if ($(wcapf_params.shop_loop_container).length) {
        container = wcapf_params.shop_loop_container;
      } else if ($(wcapf_params.not_found_container).length) {
        container = wcapf_params.not_found_container;
      }

      if ('custom' === wcapf_params.scroll_window) {
        container = wcapf_params.scroll_window_custom_element;
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
    },
    // Things are done before fetching the products like showing the loading indicator.
    beforeFetchingProducts: function beforeFetchingProducts() {
      // Track the current element focus.
      focusedElm = document.activeElement;
      WCAPF.showLoadingAnimation();

      if ('immediately' === wcapf_params.scroll_window_when) {
        WCAPF.scrollTo();
      }

      $body.trigger('wcapf_before_fetching_products');
    },
    // Things are done before updating the products like hiding the loading indicator.
    beforeUpdatingProducts: function beforeUpdatingProducts($response) {
      WCAPF.resetLoadingAnimation();
      $body.trigger('wcapf_before_updating_products', [$response]);
    },
    afterUpdatingProducts: function afterUpdatingProducts($response) {
      WCAPF.updateProductsCountResult($response); // Restore the focus.
      // Maybe restoring the focus in mobile device isn't good.

      if (wcapf_params.restore_focus_after_filtering && !wcapf_params.is_mobile) {
        if (document.body !== focusedElm) {
          if (focusedElm.id) {
            $("#".concat(focusedElm.id)).focus();
          }
        }
      } // Reinitialize wcapf.


      WCAPF.init();

      if ('after' === wcapf_params.scroll_window_when) {
        WCAPF.scrollTo();
      } // Trigger the document ready event.


      $(document).trigger('ready');
      $body.trigger('wcapf_after_updating_products', [$response]);
    },
    filterProducts: function filterProducts() {
      WCAPF.beforeFetchingProducts();
      $.ajax({
        url: window.location.href,
        success: function success(response) {
          var $response = $(response);
          WCAPF.beforeUpdatingProducts($response);
          /**
           * Update document title.
           *
           * @source https://stackoverflow.com/a/7599562
           */

          document.title = $response.filter('title').text(); // Update the instances.

          var _iterator = _createForOfIteratorHelper(instanceIds),
              _step;

          try {
            var _loop = function _loop() {
              var id = _step.value;
              var instanceId = '[data-id="' + id + '"]';
              var $instance = $(instanceId);
              var $inner = $instance.find('.wcapf-filter-inner');

              var _instance = $response.find(instanceId);

              var _instanceClasses = $(_instance).attr('class'); // Preserve hierarchy accordion state.


              if (wcapf_params.preserve_hierarchy_accordion_state) {
                if ($instance.hasClass('has-hierarchy-accordion')) {
                  $instance.find('.wcapf-hierarchy-accordion-toggle').each(function () {
                    var $el = $(this);
                    var id = $el.data('id');
                    var toggleSelector = ".wcapf-hierarchy-accordion-toggle[data-id=\"".concat(id, "\"]"); // Check to see if the accordion is opened

                    var pressed = $el.attr('aria-pressed') === 'true';

                    if (pressed) {
                      _instance.find(toggleSelector).attr('aria-pressed', 'true');

                      _instance.find(toggleSelector).closest('li').children('ul').show();
                    } else {
                      _instance.find(toggleSelector).attr('aria-pressed', 'false');

                      _instance.find(toggleSelector).closest('li').children('ul').hide();
                    }
                  });
                }
              } // Preserve soft limit state.


              if (wcapf_params.preserve_soft_limit_state) {
                if ($instance.hasClass('has-soft-limit')) {
                  var $listWrapper = $instance.find('.wcapf-list-wrapper');

                  if ($listWrapper.hasClass('show-hidden-options')) {
                    _instance.find('.wcapf-list-wrapper').addClass('show-hidden-options');

                    _instance.find('.wcapf-soft-limit-trigger').attr('aria-pressed', 'true');
                  } else {
                    _instance.find('.wcapf-list-wrapper').removeClass('show-hidden-options');

                    _instance.find('.wcapf-soft-limit-trigger').attr('aria-pressed', 'false');
                  }
                }
              } // Update the instance classes.


              $instance.attr('class', _instanceClasses.trim());

              var _html = _instance.find('.wcapf-filter-inner').html(); // Finally update the instance.


              $inner.html(_html);
              $instance.trigger('wcapf-filter-updated', [_instance]);
            };

            for (_iterator.s(); !(_step = _iterator.n()).done;) {
              _loop();
            } // Replace old shop loop with new one.

          } catch (err) {
            _iterator.e(err);
          } finally {
            _iterator.f();
          }

          var $shopLoopContainer = $response.find(wcapf_params.shop_loop_container);
          var $notFoundContainer = $response.find(wcapf_params.not_found_container);

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

          WCAPF.afterUpdatingProducts($response);
        }
      });
    },
    requestFilter: function requestFilter(url) {
      if (!url) {
        return;
      }

      var hostname = location.hostname; // TODO: Remove from production build.

      if ('localhost' === hostname) {
        url = url.replace('http://wcfilter-2.test', '//localhost:3001');
      } // window.location.href = url;


      history.pushState({}, '', url);
      WCAPF.filterProducts();
    },
    handleNumberInputFilters: function handleNumberInputFilters() {
      var rangeNumberSelectors = '.wcapf-range-number .min-value, .wcapf-range-number .max-value';
      $body.on('input', rangeNumberSelectors, function () {
        var $item = $(this);
        var $rangeNumber = $item.closest('.wcapf-range-number');
        var formatNumbers = $rangeNumber.attr('data-format-numbers');
        var rangeMinValue = parseFloat($rangeNumber.attr('data-range-min-value'));
        var rangeMaxValue = parseFloat($rangeNumber.attr('data-range-max-value'));
        var oldMinValue = parseFloat($rangeNumber.attr('data-min-value'));
        var oldMaxValue = parseFloat($rangeNumber.attr('data-max-value'));
        var decimalPlaces = $rangeNumber.attr('data-decimal-places');
        var thousandSeparator = $rangeNumber.attr('data-thousand-separator');
        var decimalSeparator = $rangeNumber.attr('data-decimal-separator'); // Clear any previously set timer before setting a fresh one

        clearTimeout($item.data('timer'));

        var getValue = function getValue(floatValue) {
          if (formatNumbers) {
            return numberFormat(floatValue, decimalPlaces, decimalSeparator, thousandSeparator);
          }

          return floatValue;
        };

        $item.data('timer', setTimeout(function () {
          $item.removeData('timer');
          var minValue = parseFloat($rangeNumber.find('.min-value').val());
          var maxValue = parseFloat($rangeNumber.find('.max-value').val()); // Force the minValue not to be empty.

          if (isNaN(minValue)) {
            minValue = rangeMinValue;
            $rangeNumber.find('.min-value').val(getValue(minValue));
          } else {
            $rangeNumber.find('.min-value').val(getValue(minValue));
          } // Force the maxValue not to be empty.


          if (isNaN(maxValue)) {
            maxValue = rangeMaxValue;
            $rangeNumber.find('.max-value').val(getValue(maxValue));
          } else {
            $rangeNumber.find('.max-value').val(getValue(maxValue));
          } // Force the minValue not to go below the rangeMinValue.


          if (minValue < rangeMinValue) {
            minValue = rangeMinValue;
            $rangeNumber.find('.min-value').val(getValue(minValue));
          } // Force the minValue not to go up the rangeMaxValue.


          if (minValue > rangeMaxValue) {
            minValue = rangeMaxValue;
            $rangeNumber.find('.min-value').val(getValue(minValue));
          } // Force the maxValue not to go up the rangeMaxValue.


          if (maxValue > rangeMaxValue) {
            maxValue = rangeMaxValue;
            $rangeNumber.find('.max-value').val(getValue(maxValue));
          } // Force the maxValue not to go below the minValue.


          if (minValue > maxValue) {
            maxValue = minValue;
            $rangeNumber.find('.max-value').val(getValue(maxValue));
          } // If value is not changed then don't proceed.


          if (minValue === oldMinValue && maxValue === oldMaxValue) {
            return;
          }

          if (minValue === rangeMinValue && maxValue === rangeMaxValue) {
            // Remove range filter.
            WCAPF.requestFilter($rangeNumber.data('clear-filter-url'));
          } else {
            // Add range filter.
            var url = $rangeNumber.data('url').replace('%1s', minValue).replace('%2s', maxValue);
            WCAPF.requestFilter(url);
          }
        }, delay));
      });
    },
    handleListFilters: function handleListFilters() {
      var nativeInputs = '.list-type-native [type="checkbox"],' + '.list-type-native [type="radio"],' + '.list-type-custom-checkbox [type="checkbox"]';
      $body.on('change', nativeInputs, function () {
        WCAPF.requestFilter($(this).data('url'));
      });
      var customRadioSelector = '.list-type-custom-radio';
      $body.on('change', customRadioSelector + ' [type="checkbox"]', function () {
        // https://stackoverflow.com/a/5839924
        $(this).closest(customRadioSelector).find('[type="checkbox"]').not(this).prop('checked', false);
        WCAPF.requestFilter($(this).data('url'));
      });
    },
    handleDropdownFilters: function handleDropdownFilters() {
      $body.on('change', '.wcapf-dropdown-wrapper select', function () {
        var $select = $(this);
        var values = $select.val();
        var filterURL = $select.data('url');
        var clearFilterURL = $select.data('clear-filter-url');
        var url;

        if (values.length) {
          url = filterURL.replace('%s', values.toString());
        } else {
          url = clearFilterURL;
        }

        WCAPF.requestFilter(url);
      });
    },
    handlePagination: function handlePagination() {
      if (wcapf_params.enable_pagination_via_ajax && wcapf_params.pagination_container) {
        var $container = $(wcapf_params.shop_loop_container);
        var selector = wcapf_params.pagination_container + ' a';

        if ($container.length) {
          $container.on('click', selector, function (e) {
            e.preventDefault();
            var href = $(this).attr('href');
            WCAPF.requestFilter(href);
          });
        }
      }
    },
    handleDefaultOrderby: function handleDefaultOrderby() {
      if (!wcapf_params.sorting_control) {
        // Submit the orderby form when value is changed.
        $body.on('change', '.woocommerce-ordering select.orderby', function () {
          $(this).closest('form').trigger('submit');
        });
        return;
      } // Prevent the auto submission of the orderby form.


      $body.on('submit', '.woocommerce-ordering', function () {
        return false;
      }); // Handle the filter request via ajax when the orderby value is changed.

      $body.on('change', '.woocommerce-ordering select.orderby', function () {
        var order = $(this).val();
        var url = new URL(window.location);
        url.searchParams.set('orderby', order);
        WCAPF.requestFilter(getOrderByUrl(url.href));
        return false;
      });
    },
    handleResetAllFilters: function handleResetAllFilters() {
      $body.on('click', '.wcapf-reset-filters-btn', function () {
        console.log('reset all filters');
      });
    },
    initCombobox: function initCombobox() {
      if (!jQuery().chosenWCAPF) {
        return;
      }

      var options = {
        inherit_select_classes: true,
        inherit_option_classes: true,
        no_results_text: wcapf_params.chosen_no_results_text,
        options_none_text: wcapf_params.chosen_options_none_text
      };

      if (wcapf_params.is_rtl) {
        options['rtl'] = true;
      }

      $body.find('.wcapf-chosen').each(function () {
        var $this = $(this); // If hierarchy enabled then we show the selected options.

        if ($this.hasClass('has-hierarchy')) {
          options['display_selected_options'] = true;
        } else {
          options['display_selected_options'] = wcapf_params.chosen_display_selected_options;
        }

        $this.chosenWCAPF(options);
      }); // Attach chosen for default orderby.

      if (wcapf_params.attach_chosen_on_sorting) {
        var disableSearch = true;

        if (wcapf_params.search_box_in_default_orderby) {
          disableSearch = false;
        }

        options['disable_search'] = disableSearch;
        $body.find('.woocommerce-ordering select.orderby').chosenWCAPF(options);
      }
    },
    initRangeSlider: function initRangeSlider() {
      if ('undefined' === typeof noUiSlider) {
        return;
      }

      $body.find('.wcapf-range-slider').each(function () {
        var $item = $(this);
        var $slider = $item.find('.wcapf-noui-slider');
        var sliderId = $slider.attr('id');
        var displayValuesAs = $item.attr('data-display-values-as');
        var formatNumbers = $item.attr('data-format-numbers');
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
          var minValue;
          var maxValue;

          if (formatNumbers) {
            minValue = numberFormat(values[0], decimalPlaces, decimalSeparator, thousandSeparator);
            maxValue = numberFormat(values[1], decimalPlaces, decimalSeparator, thousandSeparator);
          } else {
            minValue = parseFloat(values[0]);
            maxValue = parseFloat(values[1]);
          }

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
          var _minValue = parseFloat(values[0]);

          var _maxValue = parseFloat(values[1]); // If value is not changed then don't proceed.


          if (_minValue === minValue && _maxValue === maxValue) {
            return;
          }

          if (_minValue === rangeMinValue && _maxValue === rangeMaxValue) {
            // Remove range filter.
            WCAPF.requestFilter($item.data('clear-filter-url'));
          } else {
            // Add range filter.
            var url = $item.data('url').replace('%1s', _minValue).replace('%2s', _maxValue);
            WCAPF.requestFilter(url);
          }
        }

        slider.noUiSlider.on('change', function (values) {
          filterProductsAccordingToSlider(values);
        });
        $minValue.on('input', function () {
          var $input = $(this); // Clear any previously set timer before setting a fresh one

          clearTimeout($input.data('timer'));
          $input.data('timer', setTimeout(function () {
            $input.removeData('timer');
            var minValue = $input.val();
            slider.noUiSlider.set([minValue, null]);
            filterProductsAccordingToSlider(slider.noUiSlider.get());
          }, delay));
        });
        $maxValue.on('input', function () {
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
    },
    init: function init() {
      WCAPF.initCombobox();
      WCAPF.initRangeSlider();
    }
  };
})(jQuery, window);

(function ($, WCAPF) {
  WCAPF.init();
  WCAPF.handleFilterAccordion();
  WCAPF.handleHierarchyToggle();
  WCAPF.handleSoftLimit();
  WCAPF.handleSearchFilterOptions();
  WCAPF.handleListFilters();
  WCAPF.handleDropdownFilters();
  WCAPF.handleNumberInputFilters();
  WCAPF.handlePagination();
  WCAPF.handleDefaultOrderby();
  WCAPF.handleResetAllFilters();
})(jQuery, window.WCAPF);
"use strict";

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
function numberFormat(number, decimals, dec_point, thousands_sep) {
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
}

function cleanUrl(url) {
  return url.replace(/%2C/g, ',');
}

function getOrderByUrl(url) {
  var paged = parseInt(url.replace(/.+\/page\/(\d+)+/, '$1'));

  if (paged) {
    url = url.replace(/page\/(\d+)\//, '');
  }

  return cleanUrl(url);
}
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImZpbHRlci1mb3JtLmpzIiwicmVmYWN0b3JlZC5qcyIsInV0aWxzLmpzIl0sIm5hbWVzIjpbIndjYXBmX3BhcmFtcyIsImpRdWVyeSIsImRvY3VtZW50IiwicmVhZHkiLCIkIiwiJGJvZHkiLCJyYW5nZVZhbHVlc1NlcGFyYXRvciIsIl9kZWxheSIsInBhcnNlSW50IiwiZmlsdGVyX2lucHV0X2RlbGF5IiwiZGVsYXkiLCJmaWVsZHMiLCJ3Y2FwZlNpbmdsZUZpbHRlclNlbGVjdG9yIiwid2NhcGZOYXZGaWx0ZXJTZWxlY3RvciIsIndjYXBmTnVtYmVyUmFuZ2VGaWx0ZXJTZWxlY3RvciIsIndjYXBmRGF0ZUZpbHRlclNlbGVjdG9yIiwiJHdjYXBmU2luZ2xlRmlsdGVycyIsIiR3Y2FwZk5hdkZpbHRlcnMiLCIkd2NhcGZOdW1iZXJSYW5nZUZpbHRlcnMiLCIkd2NhcGZEYXRlRmlsdGVycyIsImVhY2giLCIkZmllbGQiLCJpZCIsImF0dHIiLCIkd3JhcHBlciIsImZpbmQiLCJmaWx0ZXJLZXkiLCJtdWx0aXBsZUZpbHRlciIsImluaXRDaG9zZW4iLCJjaG9zZW4iLCIkcm9vdCIsImZvcl9wcmV2aWV3IiwiJHRoaXMiLCJvcHRpb25zIiwiaW5oZXJpdF9zZWxlY3RfY2xhc3NlcyIsImluaGVyaXRfb3B0aW9uX2NsYXNzZXMiLCJpc19ydGwiLCJub1Jlc3VsdHNNZXNzYWdlIiwic2VhcmNoVGhyZXNob2xkIiwiY2hvc2VuX2xpYl9zZWFyY2hfdGhyZXNob2xkIiwiaW5pdEhpZXJhcmNoeUFjY29yZGlvbiIsInRvZ2dsZUFjY29yZGlvbiIsIiRlbCIsInByZXNzZWQiLCIkY2hpbGQiLCJjbG9zZXN0IiwiY2hpbGRyZW4iLCJlbmFibGVfYW5pbWF0aW9uX2Zvcl9oaWVyYXJjaHlfYWNjb3JkaW9uIiwic2xpZGVUb2dnbGUiLCJoaWVyYXJjaHlfYWNjb3JkaW9uX2FuaW1hdGlvbl9zcGVlZCIsImhpZXJhcmNoeV9hY2NvcmRpb25fYW5pbWF0aW9uX2Vhc2luZyIsInRvZ2dsZSIsIm9uIiwiZSIsImtleSIsInByZXZlbnREZWZhdWx0IiwibnVtYmVyX2Zvcm1hdCIsIm51bWJlciIsImRlY2ltYWxzIiwiZGVjX3BvaW50IiwidGhvdXNhbmRzX3NlcCIsInJlcGxhY2UiLCJuIiwiaXNGaW5pdGUiLCJwcmVjIiwiTWF0aCIsImFicyIsInNlcCIsImRlYyIsInMiLCJ0b0ZpeGVkRml4IiwiayIsInBvdyIsInJvdW5kIiwic3BsaXQiLCJsZW5ndGgiLCJBcnJheSIsImpvaW4iLCJpbml0Tm9VSVNsaWRlciIsIm5vVWlTbGlkZXIiLCIkaXRlbSIsIiRzbGlkZXIiLCJoYXNDbGFzcyIsInNsaWRlcklkIiwiZGlzcGxheVZhbHVlc0FzIiwiZm9ybWF0TnVtYmVycyIsInJhbmdlTWluVmFsdWUiLCJwYXJzZUZsb2F0IiwicmFuZ2VNYXhWYWx1ZSIsInN0ZXAiLCJkZWNpbWFsUGxhY2VzIiwidGhvdXNhbmRTZXBhcmF0b3IiLCJkZWNpbWFsU2VwYXJhdG9yIiwibWluVmFsdWUiLCJtYXhWYWx1ZSIsIiRtaW5WYWx1ZSIsIiRtYXhWYWx1ZSIsInNsaWRlciIsImdldEVsZW1lbnRCeUlkIiwiY3JlYXRlIiwic3RhcnQiLCJjb25uZWN0IiwiY3NzUHJlZml4IiwicmFuZ2UiLCJ2YWx1ZXMiLCJodG1sIiwidmFsIiwidHJpZ2dlciIsImZpbHRlclByb2R1Y3RzQWNjb3JkaW5nVG9TbGlkZXIiLCJyZXF1ZXN0RmlsdGVyIiwiZGF0YSIsInVybCIsImNsZWFyVGltZW91dCIsInNldFRpbWVvdXQiLCJyZW1vdmVEYXRhIiwiZXZlbnQiLCIkaW5wdXQiLCJzZXQiLCJnZXQiLCJmaWx0ZXJCeURhdGUiLCIkd2NhcGZEYXRlRmlsdGVyIiwiaXNSYW5nZSIsImZpbHRlclZhbHVlIiwicnVuRmlsdGVyIiwiZnJvbSIsInRvIiwidXBkYXRlUXVlcnlTdHJpbmdQYXJhbWV0ZXIiLCJxdWVyeSIsInJlbW92ZVF1ZXJ5U3RyaW5nUGFyYW1ldGVyIiwiaGlzdG9yeSIsInB1c2hTdGF0ZSIsImZpbHRlclByb2R1Y3RzIiwiaW5pdERhdGVwaWNrZXIiLCJkYXRlcGlja2VyIiwiZm9ybWF0IiwieWVhckRyb3Bkb3duIiwibW9udGhEcm9wZG93biIsIiRmcm9tIiwiJHRvIiwiZGF0ZUZvcm1hdCIsImNoYW5nZVllYXIiLCJjaGFuZ2VNb250aCIsImluaXREZWZhdWx0T3JkZXJCeSIsImF0dGFjaF9jaG9zZW5fb25fc29ydGluZyIsInNvcnRpbmdfY29udHJvbCIsIiRvcmRlcmluZ0Zvcm0iLCJzdWJtaXQiLCJvcmRlciIsImZpbHRlcl9rZXkiLCJ1cGRhdGVQcm9kdWN0c0NvdW50UmVzdWx0IiwiJHJlc3VsdHMiLCJzZWxlY3RvciIsInNob3BfbG9vcF9jb250YWluZXIiLCJuZXdQcm9kdWN0Q291bnQiLCJzaG93TG9hZGluZ0FuaW1hdGlvbiIsImxvYWRpbmdfYW5pbWF0aW9uIiwiTG9hZGluZ092ZXJsYXkiLCJsb2FkaW5nX292ZXJsYXlfb3B0aW9ucyIsImRpc2FibGVOb1VpU2xpZGVycyIsImVsZW1lbnQiLCJzZXRBdHRyaWJ1dGUiLCJkaXNhYmxlTGFiZWxzIiwic2VsZWN0b3JzIiwiYWRkQ2xhc3MiLCJkaXNhYmxlSW5wdXRzIiwiZGlzYWJsZV9pbnB1dHNfd2hpbGVfZmV0Y2hpbmdfcmVzdWx0cyIsImlucHV0cyIsImVuYWJsZU5vVWlTbGlkZXJzIiwicmVtb3ZlQXR0cmlidXRlIiwiZW5hYmxlSW5wdXRzIiwicmVtb3ZlQXR0ciIsInJlc2V0TG9hZGluZ0FuaW1hdGlvbiIsInNjcm9sbFRvIiwic2Nyb2xsX3dpbmRvdyIsInNjcm9sbEZvciIsInNjcm9sbF93aW5kb3dfZm9yIiwiaXNNb2JpbGUiLCJpc19tb2JpbGUiLCJwcm9jZWVkIiwiYWRqdXN0aW5nT2Zmc2V0Iiwib2Zmc2V0Iiwic2Nyb2xsX3RvX3RvcF9vZmZzZXQiLCJjb250YWluZXIiLCJub3RfZm91bmRfY29udGFpbmVyIiwic2Nyb2xsX3dpbmRvd19jdXN0b21fZWxlbWVudCIsIiRjb250YWluZXIiLCJ0b3AiLCJzdG9wIiwiYW5pbWF0ZSIsInNjcm9sbFRvcCIsInNjcm9sbF90b190b3Bfc3BlZWQiLCJzY3JvbGxfdG9fdG9wX2Vhc2luZyIsImJlZm9yZUZldGNoaW5nUHJvZHVjdHMiLCJzY3JvbGxfd2luZG93X3doZW4iLCJiZWZvcmVVcGRhdGluZ1Byb2R1Y3RzIiwiYWZ0ZXJVcGRhdGluZ1Byb2R1Y3RzIiwiZm9yY2VSZVJlbmRlciIsIndpbmRvdyIsImxvY2F0aW9uIiwiaHJlZiIsIiRkYXRhIiwiZmllbGRJRCIsIiRpbm5lciIsIl9maWVsZCIsImZpZWxkQ2xhc3NlcyIsInByZXNlcnZlX2hpZXJhcmNoeV9hY2NvcmRpb25fc3RhdGUiLCJpdGVtVmFsdWUiLCJwYXJlbnQiLCJ0b2dnbGVTZWxlY3RvciIsInVsU2VsZWN0b3IiLCJfY2xhc3NlcyIsInNob3ciLCJfaHRtbCIsInNvZnRMaW1pdFNlbGVjdG9yIiwidHJpbSIsIiRzaG9wTG9vcENvbnRhaW5lciIsIiRub3RGb3VuZENvbnRhaW5lciIsImdldFVybFZhcnMiLCJ2YXJzIiwiaGFzaCIsInJlcGxhY2VBbGwiLCJoYXNoZXMiLCJzbGljZSIsImluZGV4T2YiLCJoTGVuZ3RoIiwiaSIsImZpeFBhZ2luYXRpb24iLCJwYXJhbXMiLCJjdXJyZW50UGFnZUluVXJsIiwiY3VycmVudFBhZ2VJblBhcmFtcyIsInZhbHVlIiwicHVzaEhpc3RvcnkiLCJyZSIsIlJlZ0V4cCIsInNlcGFyYXRvciIsInVybFdpdGhRdWVyeSIsIm1hdGNoIiwib2xkUGFyYW1zIiwib2xkUGFyYW1zTGVuZ3RoIiwiT2JqZWN0Iiwia2V5cyIsInN0YXJ0UG9zaXRpb24iLCJmaWx0ZXJLZXlQb3NpdGlvbiIsImNsZWFuVXJsIiwiY2xlYW5RdWVyeSIsIm5ld1BhcmFtcyIsIm1ha2VQYXJhbWV0ZXJzIiwiZm9yY2VSZXJlbmRlciIsInZhbHVlU2VwYXJhdG9yIiwibmV4dFZhbHVlcyIsImVtcHR5VmFsdWUiLCJwcmV2VmFsdWVzIiwicHJldlZhbHVlc0FycmF5IiwiZm91bmQiLCJpbkFycmF5Iiwic3BsaWNlIiwicHVzaCIsInNpbmdsZUZpbHRlciIsImVuYWJsZV9wYWdpbmF0aW9uX3ZpYV9hamF4IiwicGFnaW5hdGlvbl9jb250YWluZXIiLCJoYW5kbGVGaWx0ZXJSZXF1ZXN0IiwiZmllbGREYXRhIiwiJHNlbGVjdCIsImZpbHRlclVSTCIsImNsZWFyRmlsdGVyVVJMIiwidG9TdHJpbmciLCJyYW5nZU51bWJlclNlbGVjdG9ycyIsIiRyYW5nZU51bWJlciIsImdldFZhbHVlIiwiZmxvYXRWYWx1ZSIsImlzTmFOIiwicmVzZXRGaWx0ZXJzIiwiJGJ1dHRvbiIsIl9maWx0ZXJLZXlzIiwiZmlsdGVyS2V5cyIsInByZXZVcmwiLCJuZXdVcmwiLCJhcHBseV9maWx0ZXJzX29uX2Jyb3dzZXJfaGlzdG9yeV9jaGFuZ2UiLCJiaW5kIiwiaW5zdGFuY2VJZHMiLCJmb2N1c2VkRWxtIiwiV0NBUEYiLCJoYW5kbGVGaWx0ZXJBY2NvcmRpb24iLCIkZmlsdGVySW5uZXIiLCJlbmFibGVfYW5pbWF0aW9uX2Zvcl9maWx0ZXJfYWNjb3JkaW9uIiwiZmlsdGVyX2FjY29yZGlvbl9hbmltYXRpb25fc3BlZWQiLCJmaWx0ZXJfYWNjb3JkaW9uX2FuaW1hdGlvbl9lYXNpbmciLCJoYW5kbGVIaWVyYXJjaHlUb2dnbGUiLCJoYW5kbGVTb2Z0TGltaXQiLCJ0b2dnbGVGaWx0ZXJPcHRpb25zIiwiJGxpc3RXcmFwcGVyIiwicmVtb3ZlQ2xhc3MiLCJoYW5kbGVTZWFyY2hGaWx0ZXJPcHRpb25zIiwiJHJlc3BvbnNlIiwibmV3Q291bnQiLCJoYXMiLCJhY3RpdmVFbGVtZW50IiwicmVzdG9yZV9mb2N1c19hZnRlcl9maWx0ZXJpbmciLCJib2R5IiwiZm9jdXMiLCJpbml0IiwiYWpheCIsInN1Y2Nlc3MiLCJyZXNwb25zZSIsInRpdGxlIiwiZmlsdGVyIiwidGV4dCIsImluc3RhbmNlSWQiLCIkaW5zdGFuY2UiLCJfaW5zdGFuY2UiLCJfaW5zdGFuY2VDbGFzc2VzIiwiaGlkZSIsInByZXNlcnZlX3NvZnRfbGltaXRfc3RhdGUiLCJob3N0bmFtZSIsImhhbmRsZU51bWJlcklucHV0RmlsdGVycyIsIm9sZE1pblZhbHVlIiwib2xkTWF4VmFsdWUiLCJudW1iZXJGb3JtYXQiLCJoYW5kbGVMaXN0RmlsdGVycyIsIm5hdGl2ZUlucHV0cyIsImN1c3RvbVJhZGlvU2VsZWN0b3IiLCJub3QiLCJwcm9wIiwiaGFuZGxlRHJvcGRvd25GaWx0ZXJzIiwiaGFuZGxlUGFnaW5hdGlvbiIsImhhbmRsZURlZmF1bHRPcmRlcmJ5IiwiVVJMIiwic2VhcmNoUGFyYW1zIiwiZ2V0T3JkZXJCeVVybCIsImhhbmRsZVJlc2V0QWxsRmlsdGVycyIsImNvbnNvbGUiLCJsb2ciLCJpbml0Q29tYm9ib3giLCJjaG9zZW5XQ0FQRiIsIm5vX3Jlc3VsdHNfdGV4dCIsImNob3Nlbl9ub19yZXN1bHRzX3RleHQiLCJvcHRpb25zX25vbmVfdGV4dCIsImNob3Nlbl9vcHRpb25zX25vbmVfdGV4dCIsImNob3Nlbl9kaXNwbGF5X3NlbGVjdGVkX29wdGlvbnMiLCJkaXNhYmxlU2VhcmNoIiwic2VhcmNoX2JveF9pbl9kZWZhdWx0X29yZGVyYnkiLCJpbml0UmFuZ2VTbGlkZXIiLCJfbWluVmFsdWUiLCJfbWF4VmFsdWUiLCJwYWdlZCJdLCJtYXBwaW5ncyI6Ijs7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUEsSUFBTUEsWUFBWSxHQUFHQSxZQUFZLElBQUk7QUFDcEMsWUFBVSxFQUQwQjtBQUVwQyx3QkFBc0IsRUFGYztBQUdwQyxxQ0FBbUMsRUFIQztBQUlwQyw0QkFBMEIsRUFKVTtBQUtwQyw4QkFBNEIsRUFMUTtBQU1wQyxtQ0FBaUMsRUFORztBQU9wQyxpQ0FBK0IsRUFQSztBQU9EO0FBQ25DLHdDQUFzQyxFQVJGO0FBU3BDLCtCQUE2QixFQVRPO0FBVXBDLDJDQUF5QyxFQVZMO0FBV3BDLHNDQUFvQyxFQVhBO0FBWXBDLHVDQUFxQyxFQVpEO0FBYXBDLDhDQUE0QyxFQWJSO0FBY3BDLHlDQUF1QyxFQWRIO0FBZXBDLDBDQUF3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Q0FBRCxDQUFPUixPQUFQLENBQWdCLHlCQUFoQixFQUEyQ00sR0FBM0MsQ0FBVDtBQUNBOztBQUVELE1BQUssQ0FBRUUsQ0FBQyxDQUFFLENBQUYsQ0FBRCxJQUFVLEVBQVosRUFBaUJNLE1BQWpCLEdBQTBCWCxJQUEvQixFQUFzQztBQUNyQ0ssSUFBQUEsQ0FBQyxDQUFFLENBQUYsQ0FBRCxHQUFTQSxDQUFDLENBQUUsQ0FBRixDQUFELElBQVUsRUFBbkI7QUFDQUEsSUFBQUEsQ0FBQyxDQUFFLENBQUYsQ0FBRCxJQUFVLElBQUlPLEtBQUosQ0FBV1osSUFBSSxHQUFHSyxDQUFDLENBQUUsQ0FBRixDQUFELENBQU9NLE1BQWQsR0FBdUIsQ0FBbEMsRUFBc0NFLElBQXRDLENBQTRDLEdBQTVDLENBQVY7QUFDQTs7QUFFRCxTQUFPUixDQUFDLENBQUNRLElBQUYsQ0FBUVQsR0FBUixDQUFQO0FBQ0E7O0FBRUQsU0FBUytLLFFBQVQsQ0FBbUJwSSxHQUFuQixFQUF5QjtBQUN4QixTQUFPQSxHQUFHLENBQUNsRCxPQUFKLENBQWEsTUFBYixFQUFxQixHQUFyQixDQUFQO0FBQ0E7O0FBRUQsU0FBUzJRLGFBQVQsQ0FBd0J6TixHQUF4QixFQUE4QjtBQUM3QixNQUFNeU8sS0FBSyxHQUFHaFYsUUFBUSxDQUFFdUcsR0FBRyxDQUFDbEQsT0FBSixDQUFhLGtCQUFiLEVBQWlDLElBQWpDLENBQUYsQ0FBdEI7O0FBRUEsTUFBSzJSLEtBQUwsRUFBYTtBQUNaek8sSUFBQUEsR0FBRyxHQUFHQSxHQUFHLENBQUNsRCxPQUFKLENBQWEsZUFBYixFQUE4QixFQUE5QixDQUFOO0FBQ0E7O0FBRUQsU0FBT3NMLFFBQVEsQ0FBRXBJLEdBQUYsQ0FBZjtBQUNBIiwiZmlsZSI6IndjLWFqYXgtcHJvZHVjdC1maWx0ZXItcHVibGljLXNjcmlwdHMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIFRoZSBmcm9udGVuZCBmaWx0ZXIgZm9ybS5cbiAqXG4gKiBAc2luY2UgICAgICAzLjAuMFxuICogQHBhY2thZ2UgICAgd2MtYWpheC1wcm9kdWN0LWZpbHRlclxuICogQHN1YnBhY2thZ2Ugd2MtYWpheC1wcm9kdWN0LWZpbHRlci9wdWJsaWMvc3JjL2pzXG4gKiBAYXV0aG9yICAgICB3cHRvb2xzLmlvXG4gKi9cblxuY29uc3Qgd2NhcGZfcGFyYW1zID0gd2NhcGZfcGFyYW1zIHx8IHtcblx0J2lzX3J0bCc6ICcnLFxuXHQnZmlsdGVyX2lucHV0X2RlbGF5JzogJycsXG5cdCdjaG9zZW5fZGlzcGxheV9zZWxlY3RlZF9vcHRpb25zJzogJycsXG5cdCdjaG9zZW5fbm9fcmVzdWx0c190ZXh0JzogJycsXG5cdCdjaG9zZW5fb3B0aW9uc19ub25lX3RleHQnOiAnJyxcblx0J3NlYXJjaF9ib3hfaW5fZGVmYXVsdF9vcmRlcmJ5JzogJycsXG5cdCdjaG9zZW5fbGliX3NlYXJjaF90aHJlc2hvbGQnOiAnJywgLy8gdG9kb1xuXHQncHJlc2VydmVfaGllcmFyY2h5X2FjY29yZGlvbl9zdGF0ZSc6ICcnLFxuXHQncHJlc2VydmVfc29mdF9saW1pdF9zdGF0ZSc6ICcnLFxuXHQnZW5hYmxlX2FuaW1hdGlvbl9mb3JfZmlsdGVyX2FjY29yZGlvbic6ICcnLFxuXHQnZmlsdGVyX2FjY29yZGlvbl9hbmltYXRpb25fc3BlZWQnOiAnJyxcblx0J2ZpbHRlcl9hY2NvcmRpb25fYW5pbWF0aW9uX2Vhc2luZyc6ICcnLFxuXHQnZW5hYmxlX2FuaW1hdGlvbl9mb3JfaGllcmFyY2h5X2FjY29yZGlvbic6ICcnLFxuXHQnaGllcmFyY2h5X2FjY29yZGlvbl9hbmltYXRpb25fc3BlZWQnOiAnJyxcblx0J2hpZXJhcmNoeV9hY2NvcmRpb25fYW5pbWF0aW9uX2Vhc2luZyc6ICcnLFxuXHQncmVzdG9yZV9mb2N1c19hZnRlcl9maWx0ZXJpbmcnOiAnJyxcblx0J2xvYWRpbmdfb3ZlcmxheV9vcHRpb25zJzogJycsXG5cdCdzY3JvbGxfdG9fdG9wX3NwZWVkJzogJycsXG5cdCdzY3JvbGxfdG9fdG9wX2Vhc2luZyc6ICcnLFxuXHQnaXNfbW9iaWxlJzogJycsXG5cdCdkaXNhYmxlX2lucHV0c193aGlsZV9mZXRjaGluZ19yZXN1bHRzJzogJycsXG5cdCdhcHBseV9maWx0ZXJzX29uX2Jyb3dzZXJfaGlzdG9yeV9jaGFuZ2UnOiAnJyxcblx0J3Nob3BfbG9vcF9jb250YWluZXInOiAnJyxcblx0J25vdF9mb3VuZF9jb250YWluZXInOiAnJyxcblx0J2VuYWJsZV9wYWdpbmF0aW9uX3ZpYV9hamF4JzogJycsXG5cdCdwYWdpbmF0aW9uX2NvbnRhaW5lcic6ICcnLFxuXHQnc29ydGluZ19jb250cm9sJzogJycsXG5cdCdhdHRhY2hfY2hvc2VuX29uX3NvcnRpbmcnOiAnJyxcblx0J2xvYWRpbmdfYW5pbWF0aW9uJzogJycsXG5cdCdzY3JvbGxfd2luZG93JzogJycsXG5cdCdzY3JvbGxfd2luZG93X2Zvcic6ICcnLFxuXHQnc2Nyb2xsX3dpbmRvd193aGVuJzogJycsXG5cdCdzY3JvbGxfd2luZG93X2N1c3RvbV9lbGVtZW50JzogJycsXG5cdCdzY3JvbGxfdG9fdG9wX29mZnNldCc6ICcnLFxuXHQnZm9yX3ByZXZpZXcnOiAnJyxcbn07XG5cbmpRdWVyeSggZG9jdW1lbnQgKS5yZWFkeSggZnVuY3Rpb24oICQgKSB7XG5cblx0cmV0dXJuO1xuXG5cdGNvbnN0ICRib2R5ID0gJCggJ2JvZHknICk7XG5cblx0Y29uc3QgcmFuZ2VWYWx1ZXNTZXBhcmF0b3IgPSAnfic7XG5cblx0Y29uc3QgX2RlbGF5ID0gcGFyc2VJbnQoIHdjYXBmX3BhcmFtcy5maWx0ZXJfaW5wdXRfZGVsYXkgKTtcblx0Y29uc3QgZGVsYXkgID0gX2RlbGF5ID49IDAgPyBfZGVsYXkgOiA4MDA7XG5cblx0Ly8gU3RvcmUgZmllbGRzJyBpZCBhbmQgZmlsdGVyIGluZm9ybWF0aW9uLlxuXHRjb25zdCBmaWVsZHMgPSB7fTtcblxuXHRjb25zdCB3Y2FwZlNpbmdsZUZpbHRlclNlbGVjdG9yICAgICAgPSAnLndjYXBmLXNpbmdsZS1maWx0ZXInO1xuXHRjb25zdCB3Y2FwZk5hdkZpbHRlclNlbGVjdG9yICAgICAgICAgPSAnLndjYXBmLW5hdi1maWx0ZXInO1xuXHRjb25zdCB3Y2FwZk51bWJlclJhbmdlRmlsdGVyU2VsZWN0b3IgPSAnLndjYXBmLW51bWJlci1yYW5nZS1maWx0ZXInO1xuXHRjb25zdCB3Y2FwZkRhdGVGaWx0ZXJTZWxlY3RvciAgICAgICAgPSAnLndjYXBmLWRhdGUtcmFuZ2UtZmlsdGVyJztcblxuXHRjb25zdCAkd2NhcGZTaW5nbGVGaWx0ZXJzICAgICAgPSAkKCB3Y2FwZlNpbmdsZUZpbHRlclNlbGVjdG9yICk7XG5cdGNvbnN0ICR3Y2FwZk5hdkZpbHRlcnMgICAgICAgICA9ICQoIHdjYXBmTmF2RmlsdGVyU2VsZWN0b3IgKTtcblx0Y29uc3QgJHdjYXBmTnVtYmVyUmFuZ2VGaWx0ZXJzID0gJCggd2NhcGZOdW1iZXJSYW5nZUZpbHRlclNlbGVjdG9yICk7XG5cdGNvbnN0ICR3Y2FwZkRhdGVGaWx0ZXJzICAgICAgICA9ICQoIHdjYXBmRGF0ZUZpbHRlclNlbGVjdG9yICk7XG5cblx0JHdjYXBmU2luZ2xlRmlsdGVycy5lYWNoKCBmdW5jdGlvbigpIHtcblx0XHRjb25zdCAkZmllbGQgICAgICAgICA9ICQoIHRoaXMgKTtcblx0XHRjb25zdCBpZCAgICAgICAgICAgICA9ICRmaWVsZC5hdHRyKCAnZGF0YS1pZCcgKTtcblx0XHRjb25zdCAkd3JhcHBlciAgICAgICA9ICRmaWVsZC5maW5kKCAnLndjYXBmLWZpZWxkLWlubmVyID4gZGl2JyApO1xuXHRcdGNvbnN0IGZpbHRlcktleSAgICAgID0gJHdyYXBwZXIuYXR0ciggJ2RhdGEtZmlsdGVyLWtleScgKTtcblx0XHRjb25zdCBtdWx0aXBsZUZpbHRlciA9IHBhcnNlSW50KCAkd3JhcHBlci5hdHRyKCAnZGF0YS1tdWx0aXBsZS1maWx0ZXInICkgKTtcblxuXHRcdGZpZWxkc1sgaWQgXSA9IHtcblx0XHRcdGZpbHRlcktleTogZmlsdGVyS2V5LFxuXHRcdFx0bXVsdGlwbGVGaWx0ZXI6IG11bHRpcGxlRmlsdGVyXG5cdFx0fTtcblx0fSApO1xuXG5cdC8vIEluaXRpYWxpemUgalF1ZXJ5IGNob3NlbiBsaWJyYXJ5LlxuXHRmdW5jdGlvbiBpbml0Q2hvc2VuKCkge1xuXHRcdGlmICggISBqUXVlcnkoKS5jaG9zZW4gKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0bGV0ICRyb290O1xuXG5cdFx0aWYgKCB3Y2FwZl9wYXJhbXMuZm9yX3ByZXZpZXcgKSB7XG5cdFx0XHQkcm9vdCA9ICQoIHdjYXBmTmF2RmlsdGVyU2VsZWN0b3IgKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0JHJvb3QgPSAkd2NhcGZOYXZGaWx0ZXJzO1xuXHRcdH1cblxuXHRcdCRyb290LmZpbmQoICcud2NhcGYtY2hvc2VuLXNlbGVjdCcgKS5lYWNoKCBmdW5jdGlvbigpIHtcblx0XHRcdGNvbnN0ICR0aGlzICAgPSAkKCB0aGlzICk7XG5cdFx0XHRjb25zdCBvcHRpb25zID0ge1xuXHRcdFx0XHRpbmhlcml0X3NlbGVjdF9jbGFzc2VzOiB0cnVlLFxuXHRcdFx0XHRpbmhlcml0X29wdGlvbl9jbGFzc2VzOiB0cnVlLFxuXHRcdFx0fTtcblxuXHRcdFx0aWYgKCB3Y2FwZl9wYXJhbXMuaXNfcnRsICkge1xuXHRcdFx0XHRvcHRpb25zWyAncnRsJyBdID0gdHJ1ZTtcblx0XHRcdH1cblxuXHRcdFx0Y29uc3Qgbm9SZXN1bHRzTWVzc2FnZSA9ICR0aGlzLmF0dHIoICdkYXRhLW5vLXJlc3VsdHMtbWVzc2FnZScgKTtcblxuXHRcdFx0aWYgKCBub1Jlc3VsdHNNZXNzYWdlICkge1xuXHRcdFx0XHRvcHRpb25zWyAnbm9fcmVzdWx0c190ZXh0JyBdID0gbm9SZXN1bHRzTWVzc2FnZTtcblx0XHRcdH1cblxuXHRcdFx0Ly8gb3B0aW9uc1sgJ2Rpc2FibGVfc2VhcmNoJyBdID0gdHJ1ZTtcblxuXHRcdFx0Y29uc3Qgc2VhcmNoVGhyZXNob2xkID0gcGFyc2VJbnQoIHdjYXBmX3BhcmFtcy5jaG9zZW5fbGliX3NlYXJjaF90aHJlc2hvbGQgKTtcblxuXHRcdFx0aWYgKCBzZWFyY2hUaHJlc2hvbGQgKSB7XG5cdFx0XHRcdC8vIG9wdGlvbnNbICdkaXNhYmxlX3NlYXJjaF90aHJlc2hvbGQnIF0gPSBzZWFyY2hUaHJlc2hvbGQ7XG5cdFx0XHR9XG5cblx0XHRcdC8vIG9wdGlvbnNbICdkaXNwbGF5X3NlbGVjdGVkX29wdGlvbnMnIF0gPSBmYWxzZTtcblxuXHRcdFx0Ly8gbWluaW11bVJlc3VsdHNGb3JTZWFyY2g6IDIwXG5cblx0XHRcdC8vIG9wdGlvbnNbJ21pbmltdW1SZXN1bHRzRm9yU2VhcmNoJ10gPSAtMTtcblxuXHRcdFx0JHRoaXMuY2hvc2VuKCBvcHRpb25zICk7XG5cdFx0fSApO1xuXHR9XG5cblx0aW5pdENob3NlbigpO1xuXG5cdC8vIEluaXRpYWxpemUgaGllcmFyY2h5IGFjY29yZGlvbi5cblx0ZnVuY3Rpb24gaW5pdEhpZXJhcmNoeUFjY29yZGlvbigpIHtcblx0XHRsZXQgJHJvb3Q7XG5cblx0XHRpZiAoIHdjYXBmX3BhcmFtcy5mb3JfcHJldmlldyApIHtcblx0XHRcdCRyb290ID0gJCggd2NhcGZOYXZGaWx0ZXJTZWxlY3RvciApO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHQkcm9vdCA9ICR3Y2FwZk5hdkZpbHRlcnM7XG5cdFx0fVxuXG5cdFx0ZnVuY3Rpb24gdG9nZ2xlQWNjb3JkaW9uKCAkZWwgKSB7XG5cdFx0XHQvLyBDaGVjayB0byBzZWUgaWYgdGhlIGJ1dHRvbiBpcyBwcmVzc2VkXG5cdFx0XHRjb25zdCBwcmVzc2VkID0gJGVsLmF0dHIoICdhcmlhLXByZXNzZWQnICkgPT09ICd0cnVlJztcblxuXHRcdFx0Ly8gQ2hhbmdlIGFyaWEtcHJlc3NlZCB0byB0aGUgb3Bwb3NpdGUgc3RhdGVcblx0XHRcdCRlbC5hdHRyKCAnYXJpYS1wcmVzc2VkJywgISBwcmVzc2VkICk7XG5cblx0XHRcdGNvbnN0ICRjaGlsZCA9ICRlbC5jbG9zZXN0KCAnbGknICkuY2hpbGRyZW4oICd1bCcgKTtcblxuXHRcdFx0aWYgKCB3Y2FwZl9wYXJhbXMuZW5hYmxlX2FuaW1hdGlvbl9mb3JfaGllcmFyY2h5X2FjY29yZGlvbiApIHtcblx0XHRcdFx0JGNoaWxkLnNsaWRlVG9nZ2xlKFxuXHRcdFx0XHRcdHdjYXBmX3BhcmFtcy5oaWVyYXJjaHlfYWNjb3JkaW9uX2FuaW1hdGlvbl9zcGVlZCxcblx0XHRcdFx0XHR3Y2FwZl9wYXJhbXMuaGllcmFyY2h5X2FjY29yZGlvbl9hbmltYXRpb25fZWFzaW5nXG5cdFx0XHRcdCk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHQkY2hpbGQudG9nZ2xlKCk7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0JHJvb3QuZmluZCggJy53Y2FwZi1oaWVyYXJjaHktYWNjb3JkaW9uLXRvZ2dsZScgKS5vbiggJ2NsaWNrJywgZnVuY3Rpb24oKSB7XG5cdFx0XHR0b2dnbGVBY2NvcmRpb24oICQoIHRoaXMgKSApO1xuXHRcdH0gKTtcblxuXHRcdCRyb290LmZpbmQoICcud2NhcGYtaGllcmFyY2h5LWFjY29yZGlvbi10b2dnbGUnICkub24oICdrZXlkb3duJywgZnVuY3Rpb24oIGUgKSB7XG5cdFx0XHRpZiAoIGUua2V5ID09PSAnICcgfHwgZS5rZXkgPT09ICdFbnRlcicgfHwgZS5rZXkgPT09ICdTcGFjZWJhcicgKSB7XG5cdFx0XHRcdC8vIFByZXZlbnQgdGhlIGRlZmF1bHQgYWN0aW9uIHRvIHN0b3Agc2Nyb2xsaW5nIHdoZW4gc3BhY2UgaXMgcHJlc3NlZFxuXHRcdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cblx0XHRcdFx0dG9nZ2xlQWNjb3JkaW9uKCAkKCB0aGlzICkgKTtcblx0XHRcdH1cblx0XHR9ICk7XG5cdH1cblxuXHRpbml0SGllcmFyY2h5QWNjb3JkaW9uKCk7XG5cblx0LyoqXG5cdCAqIEBzb3VyY2UgaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9hLzM0MTQxODEzXG5cdCAqXG5cdCAqIEBwYXJhbSBudW1iZXJcblx0ICogQHBhcmFtIGRlY2ltYWxzXG5cdCAqIEBwYXJhbSBkZWNfcG9pbnRcblx0ICogQHBhcmFtIHRob3VzYW5kc19zZXBcblx0ICpcblx0ICogQHJldHVybnMge3N0cmluZ31cblx0ICovXG5cdGZ1bmN0aW9uIG51bWJlcl9mb3JtYXQoIG51bWJlciwgZGVjaW1hbHMsIGRlY19wb2ludCwgdGhvdXNhbmRzX3NlcCApIHtcblx0XHQvLyBTdHJpcCBhbGwgY2hhcmFjdGVycyBidXQgbnVtZXJpY2FsIG9uZXMuXG5cdFx0bnVtYmVyID0gKCBudW1iZXIgKyAnJyApLnJlcGxhY2UoIC9bXlxcZCtcXC1FZS5dL2csICcnICk7XG5cblx0XHRjb25zdCBuICAgID0gISBpc0Zpbml0ZSggK251bWJlciApID8gMCA6ICtudW1iZXI7XG5cdFx0Y29uc3QgcHJlYyA9ICEgaXNGaW5pdGUoICtkZWNpbWFscyApID8gMCA6IE1hdGguYWJzKCBkZWNpbWFscyApO1xuXHRcdGNvbnN0IHNlcCAgPSAoIHR5cGVvZiB0aG91c2FuZHNfc2VwID09PSAndW5kZWZpbmVkJyApID8gJywnIDogdGhvdXNhbmRzX3NlcDtcblx0XHRjb25zdCBkZWMgID0gKCB0eXBlb2YgZGVjX3BvaW50ID09PSAndW5kZWZpbmVkJyApID8gJy4nIDogZGVjX3BvaW50O1xuXG5cdFx0bGV0IHM7XG5cblx0XHRjb25zdCB0b0ZpeGVkRml4ID0gZnVuY3Rpb24oIG4sIHByZWMgKSB7XG5cdFx0XHRjb25zdCBrID0gTWF0aC5wb3coIDEwLCBwcmVjICk7XG5cdFx0XHRyZXR1cm4gJycgKyBNYXRoLnJvdW5kKCBuICogayApIC8gaztcblx0XHR9O1xuXG5cdFx0Ly8gRml4IGZvciBJRSBwYXJzZUZsb2F0KDAuNTUpLnRvRml4ZWQoMCkgPSAwO1xuXHRcdHMgPSAoIHByZWMgPyB0b0ZpeGVkRml4KCBuLCBwcmVjICkgOiAnJyArIE1hdGgucm91bmQoIG4gKSApLnNwbGl0KCAnLicgKTtcblxuXHRcdGlmICggc1sgMCBdLmxlbmd0aCA+IDMgKSB7XG5cdFx0XHRzWyAwIF0gPSBzWyAwIF0ucmVwbGFjZSggL1xcQig/PSg/OlxcZHszfSkrKD8hXFxkKSkvZywgc2VwICk7XG5cdFx0fVxuXG5cdFx0aWYgKCAoIHNbIDEgXSB8fCAnJyApLmxlbmd0aCA8IHByZWMgKSB7XG5cdFx0XHRzWyAxIF0gPSBzWyAxIF0gfHwgJyc7XG5cdFx0XHRzWyAxIF0gKz0gbmV3IEFycmF5KCBwcmVjIC0gc1sgMSBdLmxlbmd0aCArIDEgKS5qb2luKCAnMCcgKTtcblx0XHR9XG5cblx0XHRyZXR1cm4gcy5qb2luKCBkZWMgKTtcblx0fVxuXG5cdC8vIEluaXRpYWxpemUgbm9VSVNsaWRlci5cblx0ZnVuY3Rpb24gaW5pdE5vVUlTbGlkZXIoKSB7XG5cdFx0aWYgKCAndW5kZWZpbmVkJyA9PT0gdHlwZW9mIG5vVWlTbGlkZXIgKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0bGV0ICRyb290O1xuXG5cdFx0aWYgKCB3Y2FwZl9wYXJhbXMuZm9yX3ByZXZpZXcgKSB7XG5cdFx0XHQkcm9vdCA9ICQoIHdjYXBmTnVtYmVyUmFuZ2VGaWx0ZXJTZWxlY3RvciApO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHQkcm9vdCA9ICR3Y2FwZk51bWJlclJhbmdlRmlsdGVycztcblx0XHR9XG5cblx0XHQkcm9vdC5maW5kKCAnLndjYXBmLXJhbmdlLXNsaWRlcicgKS5lYWNoKCBmdW5jdGlvbigpIHtcblx0XHRcdGNvbnN0ICRpdGVtID0gJCggdGhpcyApO1xuXG5cdFx0XHQvLyBUT0RPOiBSZW1vdmUgZmlsdGVyIGtleS5cblx0XHRcdGNvbnN0IGZpbHRlcktleSA9ICRpdGVtLmF0dHIoICdkYXRhLWZpbHRlci1rZXknICk7XG5cdFx0XHRjb25zdCAkc2xpZGVyICAgPSAkaXRlbS5maW5kKCAnLndjYXBmLW5vdWktc2xpZGVyJyApO1xuXG5cdFx0XHQvLyBJZiBzbGlkZXIgaXMgYWxyZWFkeSBpbml0aWFsaXplZCB0aGVuIGRvbid0IHJlaW5pdGlhbGl6ZSBhZ2Fpbi5cblx0XHRcdGlmICggJHNsaWRlci5oYXNDbGFzcyggJ3djYXBmLW5vdWktdGFyZ2V0JyApICkge1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdGNvbnN0IHNsaWRlcklkICAgICAgICAgID0gJHNsaWRlci5hdHRyKCAnaWQnICk7XG5cdFx0XHRjb25zdCBkaXNwbGF5VmFsdWVzQXMgICA9ICRpdGVtLmF0dHIoICdkYXRhLWRpc3BsYXktdmFsdWVzLWFzJyApO1xuXHRcdFx0Y29uc3QgZm9ybWF0TnVtYmVycyAgICAgPSAkaXRlbS5hdHRyKCAnZGF0YS1mb3JtYXQtbnVtYmVycycgKTtcblx0XHRcdGNvbnN0IHJhbmdlTWluVmFsdWUgICAgID0gcGFyc2VGbG9hdCggJGl0ZW0uYXR0ciggJ2RhdGEtcmFuZ2UtbWluLXZhbHVlJyApICk7XG5cdFx0XHRjb25zdCByYW5nZU1heFZhbHVlICAgICA9IHBhcnNlRmxvYXQoICRpdGVtLmF0dHIoICdkYXRhLXJhbmdlLW1heC12YWx1ZScgKSApO1xuXHRcdFx0Y29uc3Qgc3RlcCAgICAgICAgICAgICAgPSBwYXJzZUZsb2F0KCAkaXRlbS5hdHRyKCAnZGF0YS1zdGVwJyApICk7XG5cdFx0XHRjb25zdCBkZWNpbWFsUGxhY2VzICAgICA9ICRpdGVtLmF0dHIoICdkYXRhLWRlY2ltYWwtcGxhY2VzJyApO1xuXHRcdFx0Y29uc3QgdGhvdXNhbmRTZXBhcmF0b3IgPSAkaXRlbS5hdHRyKCAnZGF0YS10aG91c2FuZC1zZXBhcmF0b3InICk7XG5cdFx0XHRjb25zdCBkZWNpbWFsU2VwYXJhdG9yICA9ICRpdGVtLmF0dHIoICdkYXRhLWRlY2ltYWwtc2VwYXJhdG9yJyApO1xuXHRcdFx0Y29uc3QgbWluVmFsdWUgICAgICAgICAgPSBwYXJzZUZsb2F0KCAkaXRlbS5hdHRyKCAnZGF0YS1taW4tdmFsdWUnICkgKTtcblx0XHRcdGNvbnN0IG1heFZhbHVlICAgICAgICAgID0gcGFyc2VGbG9hdCggJGl0ZW0uYXR0ciggJ2RhdGEtbWF4LXZhbHVlJyApICk7XG5cdFx0XHRjb25zdCAkbWluVmFsdWUgICAgICAgICA9ICRpdGVtLmZpbmQoICcubWluLXZhbHVlJyApO1xuXHRcdFx0Y29uc3QgJG1heFZhbHVlICAgICAgICAgPSAkaXRlbS5maW5kKCAnLm1heC12YWx1ZScgKTtcblxuXHRcdFx0Y29uc3Qgc2xpZGVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoIHNsaWRlcklkICk7XG5cblx0XHRcdG5vVWlTbGlkZXIuY3JlYXRlKCBzbGlkZXIsIHtcblx0XHRcdFx0c3RhcnQ6IFsgbWluVmFsdWUsIG1heFZhbHVlIF0sXG5cdFx0XHRcdHN0ZXAsXG5cdFx0XHRcdGNvbm5lY3Q6IHRydWUsXG5cdFx0XHRcdGNzc1ByZWZpeDogJ3djYXBmLW5vdWktJyxcblx0XHRcdFx0cmFuZ2U6IHtcblx0XHRcdFx0XHQnbWluJzogcmFuZ2VNaW5WYWx1ZSxcblx0XHRcdFx0XHQnbWF4JzogcmFuZ2VNYXhWYWx1ZSxcblx0XHRcdFx0fVxuXHRcdFx0fSApO1xuXG5cdFx0XHRzbGlkZXIubm9VaVNsaWRlci5vbiggJ3VwZGF0ZScsIGZ1bmN0aW9uKCB2YWx1ZXMgKSB7XG5cdFx0XHRcdGxldCBtaW5WYWx1ZTtcblx0XHRcdFx0bGV0IG1heFZhbHVlO1xuXG5cdFx0XHRcdGlmICggZm9ybWF0TnVtYmVycyApIHtcblx0XHRcdFx0XHRtaW5WYWx1ZSA9IG51bWJlcl9mb3JtYXQoIHZhbHVlc1sgMCBdLCBkZWNpbWFsUGxhY2VzLCBkZWNpbWFsU2VwYXJhdG9yLCB0aG91c2FuZFNlcGFyYXRvciApO1xuXHRcdFx0XHRcdG1heFZhbHVlID0gbnVtYmVyX2Zvcm1hdCggdmFsdWVzWyAxIF0sIGRlY2ltYWxQbGFjZXMsIGRlY2ltYWxTZXBhcmF0b3IsIHRob3VzYW5kU2VwYXJhdG9yICk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0bWluVmFsdWUgPSBwYXJzZUZsb2F0KCB2YWx1ZXNbIDAgXSApO1xuXHRcdFx0XHRcdG1heFZhbHVlID0gcGFyc2VGbG9hdCggdmFsdWVzWyAxIF0gKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGlmICggJ3BsYWluX3RleHQnID09PSBkaXNwbGF5VmFsdWVzQXMgKSB7XG5cdFx0XHRcdFx0JG1pblZhbHVlLmh0bWwoIG1pblZhbHVlICk7XG5cdFx0XHRcdFx0JG1heFZhbHVlLmh0bWwoIG1heFZhbHVlICk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0JG1pblZhbHVlLnZhbCggbWluVmFsdWUgKTtcblx0XHRcdFx0XHQkbWF4VmFsdWUudmFsKCBtYXhWYWx1ZSApO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0JGJvZHkudHJpZ2dlciggJ3djYXBmLW5vdWlzbGlkZXItdXBkYXRlJywgWyAkaXRlbSwgdmFsdWVzIF0gKTtcblx0XHRcdH0gKTtcblxuXHRcdFx0ZnVuY3Rpb24gZmlsdGVyUHJvZHVjdHNBY2NvcmRpbmdUb1NsaWRlciggdmFsdWVzICkge1xuXHRcdFx0XHRpZiAoIHdjYXBmX3BhcmFtcy5mb3JfcHJldmlldyApIHtcblx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRjb25zdCBtaW5WYWx1ZSA9IHBhcnNlRmxvYXQoIHZhbHVlc1sgMCBdICk7XG5cdFx0XHRcdGNvbnN0IG1heFZhbHVlID0gcGFyc2VGbG9hdCggdmFsdWVzWyAxIF0gKTtcblxuXHRcdFx0XHRpZiAoIG1pblZhbHVlID09PSByYW5nZU1pblZhbHVlICYmIG1heFZhbHVlID09PSByYW5nZU1heFZhbHVlICkge1xuXHRcdFx0XHRcdC8vIFJlbW92ZSByYW5nZSBmaWx0ZXIuXG5cdFx0XHRcdFx0cmVxdWVzdEZpbHRlciggJGl0ZW0uZGF0YSggJ2NsZWFyLWZpbHRlci11cmwnICkgKTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHQvLyBBZGQgcmFuZ2UgZmlsdGVyLlxuXHRcdFx0XHRcdGNvbnN0IHVybCA9ICRpdGVtLmRhdGEoICd1cmwnICkucmVwbGFjZSggJyUxcycsIG1pblZhbHVlICkucmVwbGFjZSggJyUycycsIG1heFZhbHVlICk7XG5cdFx0XHRcdFx0cmVxdWVzdEZpbHRlciggdXJsICk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdFx0c2xpZGVyLm5vVWlTbGlkZXIub24oICdjaGFuZ2UnLCBmdW5jdGlvbiggdmFsdWVzICkge1xuXHRcdFx0XHQvLyBDbGVhciBhbnkgcHJldmlvdXNseSBzZXQgdGltZXIgYmVmb3JlIHNldHRpbmcgYSBmcmVzaCBvbmVcblx0XHRcdFx0Y2xlYXJUaW1lb3V0KCAkaXRlbS5kYXRhKCAndGltZXInICkgKTtcblxuXHRcdFx0XHQkaXRlbS5kYXRhKCAndGltZXInLCBzZXRUaW1lb3V0KCBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHQkaXRlbS5yZW1vdmVEYXRhKCAndGltZXInICk7XG5cblx0XHRcdFx0XHRmaWx0ZXJQcm9kdWN0c0FjY29yZGluZ1RvU2xpZGVyKCB2YWx1ZXMgKTtcblx0XHRcdFx0fSwgZGVsYXkgKSApO1xuXHRcdFx0fSApO1xuXG5cdFx0XHQkbWluVmFsdWUub24oICdpbnB1dCcsIGZ1bmN0aW9uKCBldmVudCApIHtcblx0XHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcblxuXHRcdFx0XHRjb25zdCAkaW5wdXQgPSAkKCB0aGlzICk7XG5cblx0XHRcdFx0Ly8gQ2xlYXIgYW55IHByZXZpb3VzbHkgc2V0IHRpbWVyIGJlZm9yZSBzZXR0aW5nIGEgZnJlc2ggb25lXG5cdFx0XHRcdGNsZWFyVGltZW91dCggJGlucHV0LmRhdGEoICd0aW1lcicgKSApO1xuXG5cdFx0XHRcdCRpbnB1dC5kYXRhKCAndGltZXInLCBzZXRUaW1lb3V0KCBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHQkaW5wdXQucmVtb3ZlRGF0YSggJ3RpbWVyJyApO1xuXG5cdFx0XHRcdFx0Y29uc3QgbWluVmFsdWUgPSAkaW5wdXQudmFsKCk7XG5cblx0XHRcdFx0XHRzbGlkZXIubm9VaVNsaWRlci5zZXQoIFsgbWluVmFsdWUsIG51bGwgXSApO1xuXG5cdFx0XHRcdFx0ZmlsdGVyUHJvZHVjdHNBY2NvcmRpbmdUb1NsaWRlciggc2xpZGVyLm5vVWlTbGlkZXIuZ2V0KCkgKTtcblx0XHRcdFx0fSwgZGVsYXkgKSApO1xuXHRcdFx0fSApO1xuXG5cdFx0XHQkbWF4VmFsdWUub24oICdpbnB1dCcsIGZ1bmN0aW9uKCBldmVudCApIHtcblx0XHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcblxuXHRcdFx0XHRjb25zdCAkaW5wdXQgPSAkKCB0aGlzICk7XG5cblx0XHRcdFx0Ly8gQ2xlYXIgYW55IHByZXZpb3VzbHkgc2V0IHRpbWVyIGJlZm9yZSBzZXR0aW5nIGEgZnJlc2ggb25lXG5cdFx0XHRcdGNsZWFyVGltZW91dCggJGlucHV0LmRhdGEoICd0aW1lcicgKSApO1xuXG5cdFx0XHRcdCRpbnB1dC5kYXRhKCAndGltZXInLCBzZXRUaW1lb3V0KCBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHQkaW5wdXQucmVtb3ZlRGF0YSggJ3RpbWVyJyApO1xuXG5cdFx0XHRcdFx0Y29uc3QgbWF4VmFsdWUgPSAkaW5wdXQudmFsKCk7XG5cblx0XHRcdFx0XHRzbGlkZXIubm9VaVNsaWRlci5zZXQoIFsgbnVsbCwgbWF4VmFsdWUgXSApO1xuXG5cdFx0XHRcdFx0ZmlsdGVyUHJvZHVjdHNBY2NvcmRpbmdUb1NsaWRlciggc2xpZGVyLm5vVWlTbGlkZXIuZ2V0KCkgKTtcblx0XHRcdFx0fSwgZGVsYXkgKSApO1xuXHRcdFx0fSApO1xuXHRcdH0gKTtcblx0fVxuXG5cdGluaXROb1VJU2xpZGVyKCk7XG5cblx0ZnVuY3Rpb24gZmlsdGVyQnlEYXRlKCAkaW5wdXQgKSB7XG5cdFx0aWYgKCB3Y2FwZl9wYXJhbXMuZm9yX3ByZXZpZXcgKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0Y29uc3QgJHdjYXBmRGF0ZUZpbHRlciA9ICRpbnB1dC5jbG9zZXN0KCAnLndjYXBmLWRhdGUtaW5wdXQnICk7XG5cdFx0Y29uc3QgZmlsdGVyS2V5ICAgICAgICA9ICR3Y2FwZkRhdGVGaWx0ZXIuYXR0ciggJ2RhdGEtZmlsdGVyLWtleScgKTtcblx0XHRjb25zdCBpc1JhbmdlICAgICAgICAgID0gJHdjYXBmRGF0ZUZpbHRlci5hdHRyKCAnZGF0YS1pcy1yYW5nZScgKTtcblxuXHRcdGxldCBmaWx0ZXJWYWx1ZSA9ICcnO1xuXHRcdGxldCBydW5GaWx0ZXIgICA9IGZhbHNlO1xuXG5cdFx0Ly8gQ2xlYXIgYW55IHByZXZpb3VzbHkgc2V0IHRpbWVyIGJlZm9yZSBzZXR0aW5nIGEgZnJlc2ggb25lXG5cdFx0Y2xlYXJUaW1lb3V0KCAkd2NhcGZEYXRlRmlsdGVyLmRhdGEoICd0aW1lcicgKSApO1xuXG5cdFx0aWYgKCBpc1JhbmdlICkge1xuXHRcdFx0Y29uc3QgZnJvbSA9ICR3Y2FwZkRhdGVGaWx0ZXIuZmluZCggJy5kYXRlLWZyb20taW5wdXQnICkudmFsKCk7XG5cdFx0XHRjb25zdCB0byAgID0gJHdjYXBmRGF0ZUZpbHRlci5maW5kKCAnLmRhdGUtdG8taW5wdXQnICkudmFsKCk7XG5cblx0XHRcdGlmICggZnJvbSAmJiB0byApIHtcblx0XHRcdFx0ZmlsdGVyVmFsdWUgPSBmcm9tICsgcmFuZ2VWYWx1ZXNTZXBhcmF0b3IgKyB0bztcblx0XHRcdFx0cnVuRmlsdGVyICAgPSB0cnVlO1xuXHRcdFx0fSBlbHNlIGlmICggISBmcm9tICYmICEgdG8gKSB7XG5cdFx0XHRcdHJ1bkZpbHRlciA9IHRydWU7XG5cdFx0XHR9XG5cdFx0fSBlbHNlIHtcblx0XHRcdGNvbnN0IGZyb20gPSAkd2NhcGZEYXRlRmlsdGVyLmZpbmQoICcuZGF0ZS1mcm9tLWlucHV0JyApLnZhbCgpO1xuXG5cdFx0XHRpZiAoIGZyb20gKSB7XG5cdFx0XHRcdGZpbHRlclZhbHVlID0gZnJvbTtcblx0XHRcdFx0cnVuRmlsdGVyICAgPSB0cnVlO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0cnVuRmlsdGVyID0gdHJ1ZTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHRpZiAoIHJ1bkZpbHRlciApIHtcblx0XHRcdCR3Y2FwZkRhdGVGaWx0ZXIuZGF0YSggJ3RpbWVyJywgc2V0VGltZW91dCggZnVuY3Rpb24oKSB7XG5cdFx0XHRcdCR3Y2FwZkRhdGVGaWx0ZXIucmVtb3ZlRGF0YSggJ3RpbWVyJyApO1xuXG5cdFx0XHRcdGlmICggZmlsdGVyVmFsdWUgKSB7XG5cdFx0XHRcdFx0dXBkYXRlUXVlcnlTdHJpbmdQYXJhbWV0ZXIoIGZpbHRlcktleSwgZmlsdGVyVmFsdWUgKTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRjb25zdCBxdWVyeSA9IHJlbW92ZVF1ZXJ5U3RyaW5nUGFyYW1ldGVyKCBmaWx0ZXJLZXkgKTtcblx0XHRcdFx0XHRoaXN0b3J5LnB1c2hTdGF0ZSgge30sICcnLCBxdWVyeSApO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0ZmlsdGVyUHJvZHVjdHMoKTtcblx0XHRcdH0sIGRlbGF5ICkgKTtcblx0XHR9XG5cdH1cblxuXHRmdW5jdGlvbiBpbml0RGF0ZXBpY2tlcigpIHtcblx0XHRpZiAoICEgalF1ZXJ5KCkuZGF0ZXBpY2tlciApIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHRsZXQgJHJvb3Q7XG5cblx0XHRpZiAoIHdjYXBmX3BhcmFtcy5mb3JfcHJldmlldyApIHtcblx0XHRcdCRyb290ID0gJCggd2NhcGZEYXRlRmlsdGVyU2VsZWN0b3IgKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0JHJvb3QgPSAkd2NhcGZEYXRlRmlsdGVycztcblx0XHR9XG5cblx0XHRjb25zdCAkd2NhcGZEYXRlRmlsdGVyID0gJHJvb3QuZmluZCggJy53Y2FwZi1kYXRlLWlucHV0JyApO1xuXG5cdFx0Y29uc3QgZm9ybWF0ICAgICAgICA9ICR3Y2FwZkRhdGVGaWx0ZXIuYXR0ciggJ2RhdGEtZGF0ZS1mb3JtYXQnICk7XG5cdFx0Y29uc3QgeWVhckRyb3Bkb3duICA9ICR3Y2FwZkRhdGVGaWx0ZXIuYXR0ciggJ2RhdGEtZGF0ZS1waWNrZXIteWVhci1kcm9wZG93bicgKTtcblx0XHRjb25zdCBtb250aERyb3Bkb3duID0gJHdjYXBmRGF0ZUZpbHRlci5hdHRyKCAnZGF0YS1kYXRlLXBpY2tlci1tb250aC1kcm9wZG93bicgKTtcblxuXHRcdGNvbnN0ICRmcm9tID0gJHdjYXBmRGF0ZUZpbHRlci5maW5kKCAnLmRhdGUtZnJvbS1pbnB1dCcgKTtcblx0XHRjb25zdCAkdG8gICA9ICR3Y2FwZkRhdGVGaWx0ZXIuZmluZCggJy5kYXRlLXRvLWlucHV0JyApO1xuXG5cdFx0JGZyb20uZGF0ZXBpY2tlcigge1xuXHRcdFx0ZGF0ZUZvcm1hdDogZm9ybWF0LFxuXHRcdFx0Y2hhbmdlWWVhcjogeWVhckRyb3Bkb3duLFxuXHRcdFx0Y2hhbmdlTW9udGg6IG1vbnRoRHJvcGRvd24sXG5cdFx0fSApO1xuXG5cdFx0JHRvLmRhdGVwaWNrZXIoIHtcblx0XHRcdGRhdGVGb3JtYXQ6IGZvcm1hdCxcblx0XHRcdGNoYW5nZVllYXI6IHllYXJEcm9wZG93bixcblx0XHRcdGNoYW5nZU1vbnRoOiBtb250aERyb3Bkb3duLFxuXHRcdH0gKTtcblxuXHRcdCRmcm9tLm9uKCAnY2hhbmdlJywgZnVuY3Rpb24oKSB7XG5cdFx0XHRjb25zdCAkaW5wdXQgPSAkKCB0aGlzICk7XG5cdFx0XHRmaWx0ZXJCeURhdGUoICRpbnB1dCApO1xuXHRcdH0gKTtcblxuXHRcdCR0by5vbiggJ2NoYW5nZScsIGZ1bmN0aW9uKCkge1xuXHRcdFx0Y29uc3QgJGlucHV0ID0gJCggdGhpcyApO1xuXHRcdFx0ZmlsdGVyQnlEYXRlKCAkaW5wdXQgKTtcblx0XHR9ICk7XG5cdH1cblxuXHRpbml0RGF0ZXBpY2tlcigpO1xuXG5cdGZ1bmN0aW9uIGluaXREZWZhdWx0T3JkZXJCeSgpIHtcblx0XHQvLyBBdHRhY2ggY2hvc2VuLlxuXHRcdGlmICggd2NhcGZfcGFyYW1zLmF0dGFjaF9jaG9zZW5fb25fc29ydGluZyApIHtcblx0XHRcdGlmICggalF1ZXJ5KCkuY2hvc2VuICkge1xuXHRcdFx0XHQkYm9keS5maW5kKCAnLndvb2NvbW1lcmNlLW9yZGVyaW5nIHNlbGVjdC5vcmRlcmJ5JyApLmNob3Nlbigge1xuXHRcdFx0XHRcdCdkaXNhYmxlX3NlYXJjaF90aHJlc2hvbGQnOiAxNSxcblx0XHRcdFx0fSApO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdGlmICggISB3Y2FwZl9wYXJhbXMuc29ydGluZ19jb250cm9sICkge1xuXHRcdFx0JGJvZHkuZmluZCggJy53b29jb21tZXJjZS1vcmRlcmluZycgKS5lYWNoKCBmdW5jdGlvbigpIHtcblx0XHRcdFx0Y29uc3QgJG9yZGVyaW5nRm9ybSA9ICQoIHRoaXMgKTtcblxuXHRcdFx0XHQkb3JkZXJpbmdGb3JtLm9uKCAnY2hhbmdlJywgJ3NlbGVjdC5vcmRlcmJ5JywgZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0JG9yZGVyaW5nRm9ybS5zdWJtaXQoKTtcblx0XHRcdFx0fSApO1xuXHRcdFx0fSApO1xuXG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0Ly8gdG9kbzogY2hlY2sgaWYgYWpheCBkaXNhYmxlZC5cblx0XHQkYm9keS5maW5kKCAnLndvb2NvbW1lcmNlLW9yZGVyaW5nJyApLmVhY2goIGZ1bmN0aW9uKCkge1xuXHRcdFx0Y29uc3QgJG9yZGVyaW5nRm9ybSA9ICQoIHRoaXMgKTtcblxuXHRcdFx0JG9yZGVyaW5nRm9ybS5vbiggJ3N1Ym1pdCcsIGZ1bmN0aW9uKCBlICkge1xuXHRcdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHR9ICk7XG5cblx0XHRcdCRvcmRlcmluZ0Zvcm0ub24oICdjaGFuZ2UnLCAnc2VsZWN0Lm9yZGVyYnknLCBmdW5jdGlvbiggZSApIHtcblx0XHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG5cdFx0XHRcdGNvbnN0IG9yZGVyICAgICAgPSAkKCB0aGlzICkudmFsKCk7XG5cdFx0XHRcdGNvbnN0IGZpbHRlcl9rZXkgPSAnb3JkZXJieSc7XG5cblx0XHRcdFx0dXBkYXRlUXVlcnlTdHJpbmdQYXJhbWV0ZXIoIGZpbHRlcl9rZXksIG9yZGVyICk7XG5cdFx0XHRcdGZpbHRlclByb2R1Y3RzKCk7XG5cdFx0XHR9ICk7XG5cdFx0fSApO1xuXHR9XG5cblx0aW5pdERlZmF1bHRPcmRlckJ5KCk7XG5cblx0ZnVuY3Rpb24gdXBkYXRlUHJvZHVjdHNDb3VudFJlc3VsdCggJHJlc3VsdHMgKSB7XG5cdFx0Y29uc3Qgc2VsZWN0b3IgPSAnLndvb2NvbW1lcmNlLXJlc3VsdC1jb3VudCc7XG5cblx0XHRpZiAoICQoIHdjYXBmX3BhcmFtcy5zaG9wX2xvb3BfY29udGFpbmVyICkuZmluZCggc2VsZWN0b3IgKS5sZW5ndGggKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0Y29uc3QgbmV3UHJvZHVjdENvdW50ID0gJHJlc3VsdHMuZmluZCggc2VsZWN0b3IgKS5odG1sKCk7XG5cblx0XHQkYm9keS5maW5kKCBzZWxlY3RvciApLmh0bWwoIG5ld1Byb2R1Y3RDb3VudCApO1xuXHR9XG5cblx0ZnVuY3Rpb24gc2hvd0xvYWRpbmdBbmltYXRpb24oKSB7XG5cdFx0aWYgKCAhIHdjYXBmX3BhcmFtcy5sb2FkaW5nX2FuaW1hdGlvbiApIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHQkLkxvYWRpbmdPdmVybGF5KCAnc2hvdycsIHdjYXBmX3BhcmFtcy5sb2FkaW5nX292ZXJsYXlfb3B0aW9ucyApO1xuXHR9XG5cblx0ZnVuY3Rpb24gZGlzYWJsZU5vVWlTbGlkZXJzKCkge1xuXHRcdGlmICggJ3VuZGVmaW5lZCcgPT09IHR5cGVvZiBub1VpU2xpZGVyICkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdCR3Y2FwZk51bWJlclJhbmdlRmlsdGVycy5maW5kKCAnLndjYXBmLW5vdWktc2xpZGVyJyApLmVhY2goIGZ1bmN0aW9uKCBlLCBlbGVtZW50ICkge1xuXHRcdFx0ZWxlbWVudC5zZXRBdHRyaWJ1dGUoICdkaXNhYmxlZCcsIHRydWUgKTtcblx0XHR9ICk7XG5cdH1cblxuXHRmdW5jdGlvbiBkaXNhYmxlTGFiZWxzKCkge1xuXHRcdGNvbnN0IHNlbGVjdG9ycyA9ICcud2NhcGYtbGFiZWxlZC1uYXYgLml0ZW0sIC53Y2FwZi1hY3RpdmUtZmlsdGVycyAuaXRlbSc7XG5cblx0XHQvLyBUT0RPOiBBZGQgZGlzYWJsZWQgYXR0cmlidXRlLlxuXHRcdCR3Y2FwZlNpbmdsZUZpbHRlcnMuZmluZCggc2VsZWN0b3JzICkuYWRkQ2xhc3MoICdkaXNhYmxlZCcgKTtcblx0fVxuXG5cdGZ1bmN0aW9uIGRpc2FibGVJbnB1dHMoKSB7XG5cdFx0aWYgKCAhIHdjYXBmX3BhcmFtcy5kaXNhYmxlX2lucHV0c193aGlsZV9mZXRjaGluZ19yZXN1bHRzICkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdGNvbnN0IGlucHV0cyA9ICdpbnB1dCwgc2VsZWN0JztcblxuXHRcdCR3Y2FwZlNpbmdsZUZpbHRlcnMuZmluZCggaW5wdXRzICkuYXR0ciggJ2Rpc2FibGVkJywgJ2Rpc2FibGVkJyApO1xuXHRcdCR3Y2FwZlNpbmdsZUZpbHRlcnMuZmluZCggaW5wdXRzICkudHJpZ2dlciggJ2Nob3Nlbjp1cGRhdGVkJyApO1xuXG5cdFx0ZGlzYWJsZU5vVWlTbGlkZXJzKCk7XG5cdFx0ZGlzYWJsZUxhYmVscygpO1xuXHR9XG5cblx0ZnVuY3Rpb24gZW5hYmxlTm9VaVNsaWRlcnMoKSB7XG5cdFx0aWYgKCAndW5kZWZpbmVkJyA9PT0gdHlwZW9mIG5vVWlTbGlkZXIgKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0JHdjYXBmTnVtYmVyUmFuZ2VGaWx0ZXJzLmZpbmQoICcud2NhcGYtbm91aS1zbGlkZXInICkuZWFjaCggZnVuY3Rpb24oIGUsIGVsZW1lbnQgKSB7XG5cdFx0XHRlbGVtZW50LnJlbW92ZUF0dHJpYnV0ZSggJ2Rpc2FibGVkJyApO1xuXHRcdH0gKTtcblx0fVxuXG5cdGZ1bmN0aW9uIGVuYWJsZUlucHV0cygpIHtcblx0XHRpZiAoICEgd2NhcGZfcGFyYW1zLmRpc2FibGVfaW5wdXRzX3doaWxlX2ZldGNoaW5nX3Jlc3VsdHMgKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0Y29uc3QgaW5wdXRzID0gJ2lucHV0JztcblxuXHRcdCR3Y2FwZk51bWJlclJhbmdlRmlsdGVycy5maW5kKCBpbnB1dHMgKS5yZW1vdmVBdHRyKCAnZGlzYWJsZWQnICk7XG5cdFx0JHdjYXBmRGF0ZUZpbHRlcnMuZmluZCggaW5wdXRzICkucmVtb3ZlQXR0ciggJ2Rpc2FibGVkJyApO1xuXG5cdFx0ZW5hYmxlTm9VaVNsaWRlcnMoKTtcblx0fVxuXG5cdGZ1bmN0aW9uIHJlc2V0TG9hZGluZ0FuaW1hdGlvbigpIHtcblx0XHRpZiAoICEgd2NhcGZfcGFyYW1zLmxvYWRpbmdfYW5pbWF0aW9uICkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdCQuTG9hZGluZ092ZXJsYXkoICdoaWRlJyApO1xuXHR9XG5cblx0ZnVuY3Rpb24gc2Nyb2xsVG8oKSB7XG5cdFx0aWYgKCAnbm9uZScgPT09IHdjYXBmX3BhcmFtcy5zY3JvbGxfd2luZG93ICkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdGNvbnN0IHNjcm9sbEZvciA9IHdjYXBmX3BhcmFtcy5zY3JvbGxfd2luZG93X2Zvcjtcblx0XHRjb25zdCBpc01vYmlsZSAgPSB3Y2FwZl9wYXJhbXMuaXNfbW9iaWxlO1xuXHRcdGxldCBwcm9jZWVkICAgICA9IGZhbHNlO1xuXG5cdFx0aWYgKCAnbW9iaWxlJyA9PT0gc2Nyb2xsRm9yICYmIGlzTW9iaWxlICkge1xuXHRcdFx0cHJvY2VlZCA9IHRydWU7XG5cdFx0fSBlbHNlIGlmICggJ2Rlc2t0b3AnID09PSBzY3JvbGxGb3IgJiYgISBpc01vYmlsZSApIHtcblx0XHRcdHByb2NlZWQgPSB0cnVlO1xuXHRcdH0gZWxzZSBpZiAoICdib3RoJyA9PT0gc2Nyb2xsRm9yICkge1xuXHRcdFx0cHJvY2VlZCA9IHRydWU7XG5cdFx0fVxuXG5cdFx0aWYgKCAhIHByb2NlZWQgKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0bGV0IGFkanVzdGluZ09mZnNldCwgb2Zmc2V0O1xuXG5cdFx0aWYgKCB3Y2FwZl9wYXJhbXMuc2Nyb2xsX3RvX3RvcF9vZmZzZXQgKSB7XG5cdFx0XHRhZGp1c3RpbmdPZmZzZXQgPSBwYXJzZUludCggd2NhcGZfcGFyYW1zLnNjcm9sbF90b190b3Bfb2Zmc2V0ICk7XG5cdFx0fVxuXG5cdFx0bGV0IGNvbnRhaW5lcjtcblxuXHRcdGlmICggJCggd2NhcGZfcGFyYW1zLnNob3BfbG9vcF9jb250YWluZXIgKS5sZW5ndGggKSB7XG5cdFx0XHRjb250YWluZXIgPSB3Y2FwZl9wYXJhbXMuc2hvcF9sb29wX2NvbnRhaW5lcjtcblx0XHR9IGVsc2UgaWYgKCAkKCB3Y2FwZl9wYXJhbXMubm90X2ZvdW5kX2NvbnRhaW5lciApLmxlbmd0aCApIHtcblx0XHRcdGNvbnRhaW5lciA9IHdjYXBmX3BhcmFtcy5ub3RfZm91bmRfY29udGFpbmVyO1xuXHRcdH1cblxuXHRcdGlmICggJ2N1c3RvbScgPT09IHdjYXBmX3BhcmFtcy5zY3JvbGxfd2luZG93ICkge1xuXHRcdFx0Y29udGFpbmVyID0gd2NhcGZfcGFyYW1zLnNjcm9sbF93aW5kb3dfY3VzdG9tX2VsZW1lbnQ7XG5cdFx0fVxuXG5cdFx0Y29uc3QgJGNvbnRhaW5lciA9ICQoIGNvbnRhaW5lciApO1xuXG5cdFx0aWYgKCAkY29udGFpbmVyLmxlbmd0aCApIHtcblx0XHRcdG9mZnNldCA9ICRjb250YWluZXIub2Zmc2V0KCkudG9wIC0gYWRqdXN0aW5nT2Zmc2V0O1xuXG5cdFx0XHRpZiAoIG9mZnNldCA8IDAgKSB7XG5cdFx0XHRcdG9mZnNldCA9IDA7XG5cdFx0XHR9XG5cblx0XHRcdCQoICdodG1sLCBib2R5JyApLnN0b3AoKS5hbmltYXRlKFxuXHRcdFx0XHR7IHNjcm9sbFRvcDogb2Zmc2V0IH0sXG5cdFx0XHRcdHdjYXBmX3BhcmFtcy5zY3JvbGxfdG9fdG9wX3NwZWVkLFxuXHRcdFx0XHR3Y2FwZl9wYXJhbXMuc2Nyb2xsX3RvX3RvcF9lYXNpbmdcblx0XHRcdCk7XG5cdFx0fVxuXHR9XG5cblx0Ly8gVGhpbmdzIGFyZSBkb25lIGJlZm9yZSBmZXRjaGluZyB0aGUgcHJvZHVjdHMgbGlrZSBzaG93aW5nIGEgbG9hZGluZyBpbmRpY2F0b3IuXG5cdGZ1bmN0aW9uIGJlZm9yZUZldGNoaW5nUHJvZHVjdHMoKSB7XG5cdFx0ZGlzYWJsZUlucHV0cygpO1xuXHRcdHNob3dMb2FkaW5nQW5pbWF0aW9uKCk7XG5cblx0XHRpZiAoICdpbW1lZGlhdGVseScgPT09IHdjYXBmX3BhcmFtcy5zY3JvbGxfd2luZG93X3doZW4gKSB7XG5cdFx0XHRzY3JvbGxUbygpO1xuXHRcdH1cblxuXHRcdCRib2R5LnRyaWdnZXIoICd3Y2FwZl9iZWZvcmVfZmV0Y2hpbmdfcHJvZHVjdHMnICk7XG5cdH1cblxuXHRmdW5jdGlvbiBiZWZvcmVVcGRhdGluZ1Byb2R1Y3RzKCAkcmVzdWx0cyApIHtcblx0XHRyZXNldExvYWRpbmdBbmltYXRpb24oKTtcblxuXHRcdCRib2R5LnRyaWdnZXIoICd3Y2FwZl9iZWZvcmVfdXBkYXRpbmdfcHJvZHVjdHMnLCBbICRyZXN1bHRzIF0gKTtcblx0fVxuXG5cdC8vIFRoaW5ncyBhcmUgZG9uZSBhZnRlciBhcHBseWluZyB0aGUgZmlsdGVyIGxpa2Ugc2Nyb2xsIHRvIHRvcC5cblx0ZnVuY3Rpb24gYWZ0ZXJVcGRhdGluZ1Byb2R1Y3RzKCAkcmVzdWx0cyApIHtcblx0XHRpbml0Q2hvc2VuKCk7XG5cdFx0aW5pdEhpZXJhcmNoeUFjY29yZGlvbigpO1xuXHRcdGluaXROb1VJU2xpZGVyKCk7XG5cdFx0aW5pdERhdGVwaWNrZXIoKTtcblx0XHRpbml0RGVmYXVsdE9yZGVyQnkoKTtcblx0XHR1cGRhdGVQcm9kdWN0c0NvdW50UmVzdWx0KCAkcmVzdWx0cyApO1xuXHRcdGVuYWJsZUlucHV0cygpO1xuXG5cdFx0aWYgKCAnYWZ0ZXInID09PSB3Y2FwZl9wYXJhbXMuc2Nyb2xsX3dpbmRvd193aGVuICkge1xuXHRcdFx0c2Nyb2xsVG8oKTtcblx0XHR9XG5cblx0XHQkYm9keS50cmlnZ2VyKCAnd2NhcGZfYWZ0ZXJfdXBkYXRpbmdfcHJvZHVjdHMnLCBbICRyZXN1bHRzIF0gKTtcblx0fVxuXG5cdC8vIFRoZSBtYWluIGZpbHRlciBmdW5jdGlvbi5cblx0ZnVuY3Rpb24gZmlsdGVyUHJvZHVjdHMoIGZvcmNlUmVSZW5kZXIgPSBmYWxzZSApIHtcblx0XHRpZiAoIHdjYXBmX3BhcmFtcy5mb3JfcHJldmlldyApIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHRiZWZvcmVGZXRjaGluZ1Byb2R1Y3RzKCk7XG5cblx0XHQkLmdldCggd2luZG93LmxvY2F0aW9uLmhyZWYsIGZ1bmN0aW9uKCBkYXRhICkge1xuXHRcdFx0Y29uc3QgJGRhdGEgPSAkKCBkYXRhICk7XG5cblx0XHRcdC8vIFJlcGxhY2UgdGhlIGZpZWxkcycgZGF0YSB3aXRoIG5ldyBkYXRhLlxuXHRcdFx0JC5lYWNoKCBmaWVsZHMsIGZ1bmN0aW9uKCBpZCApIHtcblx0XHRcdFx0Y29uc3QgZmllbGRJRCAgICA9ICdbZGF0YS1pZD1cIicgKyBpZCArICdcIl0nO1xuXHRcdFx0XHRjb25zdCAkZmllbGQgICAgID0gJCggZmllbGRJRCApO1xuXHRcdFx0XHRjb25zdCAkaW5uZXIgICAgID0gJGZpZWxkLmZpbmQoICcud2NhcGYtZmllbGQtaW5uZXInICk7XG5cdFx0XHRcdGNvbnN0IF9maWVsZCAgICAgPSAkZGF0YS5maW5kKCBmaWVsZElEICk7XG5cdFx0XHRcdGxldCBmaWVsZENsYXNzZXMgPSAkKCBfZmllbGQgKS5hdHRyKCAnY2xhc3MnICk7XG5cblx0XHRcdFx0Ly8gUHJlc2VydmUgaGllcmFyY2h5IGFjY29yZGlvbiBzdGF0ZS5cblx0XHRcdFx0aWYgKCB3Y2FwZl9wYXJhbXMucHJlc2VydmVfaGllcmFyY2h5X2FjY29yZGlvbl9zdGF0ZSApIHtcblx0XHRcdFx0XHRpZiAoICRmaWVsZC5oYXNDbGFzcyggJ2hpZXJhcmNoeS1hY2NvcmRpb24nICkgKSB7XG5cdFx0XHRcdFx0XHQkZmllbGQuZmluZCggJy5oaWVyYXJjaHktYWNjb3JkaW9uLXRvZ2dsZS5hY3RpdmUnICkuZWFjaCggZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0XHRcdGNvbnN0IGl0ZW1WYWx1ZSAgICAgID0gJCggdGhpcyApLnBhcmVudCgpLmNoaWxkcmVuKCAnaW5wdXQnICkudmFsKCk7XG5cdFx0XHRcdFx0XHRcdGNvbnN0IHRvZ2dsZVNlbGVjdG9yID0gJ2lucHV0W3ZhbHVlPVwiJyArIGl0ZW1WYWx1ZSArICdcIl0gfiAuaGllcmFyY2h5LWFjY29yZGlvbi10b2dnbGUnO1xuXHRcdFx0XHRcdFx0XHRjb25zdCB1bFNlbGVjdG9yICAgICA9ICdpbnB1dFt2YWx1ZT1cIicgKyBpdGVtVmFsdWUgKyAnXCJdIH4gdWwnO1xuXHRcdFx0XHRcdFx0XHRjb25zdCBfY2xhc3NlcyAgICAgICA9ICdoaWVyYXJjaHktYWNjb3JkaW9uLXRvZ2dsZSBhY3RpdmUnO1xuXG5cdFx0XHRcdFx0XHRcdF9maWVsZC5maW5kKCB0b2dnbGVTZWxlY3RvciApLmF0dHIoICdjbGFzcycsIF9jbGFzc2VzICk7XG5cdFx0XHRcdFx0XHRcdF9maWVsZC5maW5kKCB1bFNlbGVjdG9yICkuc2hvdygpO1xuXHRcdFx0XHRcdFx0fSApO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXG5cdFx0XHRcdGNvbnN0IF9odG1sID0gX2ZpZWxkLmZpbmQoICcud2NhcGYtZmllbGQtaW5uZXInICkuaHRtbCgpO1xuXG5cdFx0XHRcdC8vIFNob3cgc29mdCBsaW1pdCBpdGVtcy5cblx0XHRcdFx0Y29uc3Qgc29mdExpbWl0U2VsZWN0b3IgPSAnc2hvdy1oaWRkZW4taXRlbXMnO1xuXG5cdFx0XHRcdGlmICggJGZpZWxkLmhhc0NsYXNzKCBzb2Z0TGltaXRTZWxlY3RvciApICkge1xuXHRcdFx0XHRcdGlmICggISBfZmllbGQuaGFzQ2xhc3MoIHNvZnRMaW1pdFNlbGVjdG9yICkgKSB7XG5cdFx0XHRcdFx0XHRmaWVsZENsYXNzZXMgKz0gJyAnICsgc29mdExpbWl0U2VsZWN0b3I7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdGZpZWxkQ2xhc3NlcyA9IGZpZWxkQ2xhc3Nlcy5yZXBsYWNlKCBzb2Z0TGltaXRTZWxlY3RvciwgJycgKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdC8vIFVwZGF0ZSB0aGUgZmllbGQncyBjbGFzcy5cblx0XHRcdFx0JGZpZWxkLmF0dHIoICdjbGFzcycsIGZpZWxkQ2xhc3Nlcy50cmltKCkgKTtcblxuXHRcdFx0XHQvLyBXaGVuIGNhbGxlZCBmcm9tIGhpc3RvcnkgYmFjayBvciBmb3J3YXJkIHJlcXVlc3QgdGhlbiByZXJlbmRlciBhbGwgZmllbGRzLlxuXHRcdFx0XHRpZiAoIGZvcmNlUmVSZW5kZXIgKSB7XG5cblx0XHRcdFx0XHQvLyB1cGRhdGUgZmllbGRcblx0XHRcdFx0XHQkaW5uZXIuaHRtbCggX2h0bWwgKTtcblxuXHRcdFx0XHR9IGVsc2Uge1xuXG5cdFx0XHRcdFx0Ly8gU2VsZWN0aXZlbHkgcmVyZW5kZXIgdGhlIGZpZWxkcy5cblx0XHRcdFx0XHRpZiAoICRmaWVsZC5oYXNDbGFzcyggJ3djYXBmLW5hdi1maWx0ZXInICkgKSB7XG5cblx0XHRcdFx0XHRcdC8vIHVwZGF0ZSBmaWVsZFxuXHRcdFx0XHRcdFx0JGlubmVyLmh0bWwoIF9odG1sICk7XG5cblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0fVxuXG5cdFx0XHRcdCRmaWVsZC50cmlnZ2VyKCAnd2NhcGYtZmllbGQtdXBkYXRlZCcsIFsgX2ZpZWxkIF0gKTtcblx0XHRcdH0gKTtcblxuXHRcdFx0YmVmb3JlVXBkYXRpbmdQcm9kdWN0cyggJGRhdGEgKTtcblxuXHRcdFx0Ly8gUmVwbGFjZSBvbGQgc2hvcCBsb29wIHdpdGggbmV3IG9uZS5cblx0XHRcdGNvbnN0ICRzaG9wTG9vcENvbnRhaW5lciA9ICRkYXRhLmZpbmQoIHdjYXBmX3BhcmFtcy5zaG9wX2xvb3BfY29udGFpbmVyICk7XG5cdFx0XHRjb25zdCAkbm90Rm91bmRDb250YWluZXIgPSAkZGF0YS5maW5kKCB3Y2FwZl9wYXJhbXMubm90X2ZvdW5kX2NvbnRhaW5lciApO1xuXG5cdFx0XHRpZiAoIHdjYXBmX3BhcmFtcy5zaG9wX2xvb3BfY29udGFpbmVyID09PSB3Y2FwZl9wYXJhbXMubm90X2ZvdW5kX2NvbnRhaW5lciApIHtcblx0XHRcdFx0JCggd2NhcGZfcGFyYW1zLnNob3BfbG9vcF9jb250YWluZXIgKS5odG1sKCAkc2hvcExvb3BDb250YWluZXIuaHRtbCgpICk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRpZiAoICQoIHdjYXBmX3BhcmFtcy5ub3RfZm91bmRfY29udGFpbmVyICkubGVuZ3RoICkge1xuXHRcdFx0XHRcdGlmICggJHNob3BMb29wQ29udGFpbmVyLmxlbmd0aCApIHtcblx0XHRcdFx0XHRcdCQoIHdjYXBmX3BhcmFtcy5ub3RfZm91bmRfY29udGFpbmVyICkuaHRtbCggJHNob3BMb29wQ29udGFpbmVyLmh0bWwoKSApO1xuXHRcdFx0XHRcdH0gZWxzZSBpZiAoICRub3RGb3VuZENvbnRhaW5lci5sZW5ndGggKSB7XG5cdFx0XHRcdFx0XHQkKCB3Y2FwZl9wYXJhbXMubm90X2ZvdW5kX2NvbnRhaW5lciApLmh0bWwoICRub3RGb3VuZENvbnRhaW5lci5odG1sKCkgKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0gZWxzZSBpZiAoICQoIHdjYXBmX3BhcmFtcy5zaG9wX2xvb3BfY29udGFpbmVyICkubGVuZ3RoICkge1xuXHRcdFx0XHRcdGlmICggJHNob3BMb29wQ29udGFpbmVyLmxlbmd0aCApIHtcblx0XHRcdFx0XHRcdCQoIHdjYXBmX3BhcmFtcy5zaG9wX2xvb3BfY29udGFpbmVyICkuaHRtbCggJHNob3BMb29wQ29udGFpbmVyLmh0bWwoKSApO1xuXHRcdFx0XHRcdH0gZWxzZSBpZiAoICRub3RGb3VuZENvbnRhaW5lci5sZW5ndGggKSB7XG5cdFx0XHRcdFx0XHQkKCB3Y2FwZl9wYXJhbXMuc2hvcF9sb29wX2NvbnRhaW5lciApLmh0bWwoICRub3RGb3VuZENvbnRhaW5lci5odG1sKCkgKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdFx0YWZ0ZXJVcGRhdGluZ1Byb2R1Y3RzKCAkZGF0YSApO1xuXHRcdH0gKTtcblx0fVxuXG5cdC8vIFVSTCBQYXJzZXJcblx0ZnVuY3Rpb24gZ2V0VXJsVmFycyggdXJsICkge1xuXHRcdGxldCB2YXJzID0ge30sIGhhc2g7XG5cblx0XHRpZiAoIHR5cGVvZiB1cmwgPT09ICd1bmRlZmluZWQnICkge1xuXHRcdFx0dXJsID0gd2luZG93LmxvY2F0aW9uLmhyZWY7XG5cdFx0fVxuXG5cdFx0dXJsID0gdXJsLnJlcGxhY2VBbGwoICclMkMnLCAnLCcgKTtcblxuXHRcdGNvbnN0IGhhc2hlcyAgPSB1cmwuc2xpY2UoIHVybC5pbmRleE9mKCAnPycgKSArIDEgKS5zcGxpdCggJyYnICk7XG5cdFx0Y29uc3QgaExlbmd0aCA9IGhhc2hlcy5sZW5ndGg7XG5cblx0XHRmb3IgKCBsZXQgaSA9IDA7IGkgPCBoTGVuZ3RoOyBpKysgKSB7XG5cdFx0XHRoYXNoID0gaGFzaGVzWyBpIF0uc3BsaXQoICc9JyApO1xuXG5cdFx0XHR2YXJzWyBoYXNoWyAwIF0gXSA9IGhhc2hbIDEgXTtcblx0XHR9XG5cblx0XHRyZXR1cm4gdmFycztcblx0fVxuXG5cdC8vIGV2ZXJ5dGltZSB3ZSBhcHBseSB0aGUgZmlsdGVyIHdlIHNldCB0aGUgY3VycmVudCBwYWdlIHRvIDFcblx0ZnVuY3Rpb24gZml4UGFnaW5hdGlvbigpIHtcblx0XHRsZXQgdXJsICAgICAgICAgICAgICAgID0gd2luZG93LmxvY2F0aW9uLmhyZWY7XG5cdFx0Y29uc3QgcGFyYW1zICAgICAgICAgICA9IGdldFVybFZhcnMoIHVybCApO1xuXHRcdGNvbnN0IGN1cnJlbnRQYWdlSW5VcmwgPSBwYXJzZUludCggdXJsLnJlcGxhY2UoIC8uK1xcL3BhZ2VcXC8oXFxkKykrLywgJyQxJyApICk7XG5cblx0XHRpZiAoIGN1cnJlbnRQYWdlSW5VcmwgKSB7XG5cdFx0XHRpZiAoIGN1cnJlbnRQYWdlSW5VcmwgPiAxICkge1xuXHRcdFx0XHR1cmwgPSB1cmwucmVwbGFjZSggL3BhZ2VcXC8oXFxkKykvLCAncGFnZS8xJyApO1xuXHRcdFx0fVxuXHRcdH0gZWxzZSBpZiAoIHR5cGVvZiBwYXJhbXNbICdwYWdlZCcgXSAhPT0gJ3VuZGVmaW5lZCcgKSB7XG5cdFx0XHRjb25zdCBjdXJyZW50UGFnZUluUGFyYW1zID0gcGFyc2VJbnQoIHBhcmFtc1sgJ3BhZ2VkJyBdICk7XG5cblx0XHRcdGlmICggY3VycmVudFBhZ2VJblBhcmFtcyA+IDEgKSB7XG5cdFx0XHRcdHVybCA9IHVybC5yZXBsYWNlKCAncGFnZWQ9JyArIGN1cnJlbnRQYWdlSW5QYXJhbXMsICdwYWdlZD0xJyApO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdHJldHVybiB1cmw7XG5cdH1cblxuXHQvLyB1cGRhdGUgcXVlcnkgc3RyaW5nIGZvciBjYXRlZ29yaWVzLCBtZXRhIGV0Yy4uXG5cdGZ1bmN0aW9uIHVwZGF0ZVF1ZXJ5U3RyaW5nUGFyYW1ldGVyKCBrZXksIHZhbHVlLCBwdXNoSGlzdG9yeSwgdXJsICkge1xuXHRcdGlmICggdHlwZW9mIHB1c2hIaXN0b3J5ID09PSAndW5kZWZpbmVkJyApIHtcblx0XHRcdHB1c2hIaXN0b3J5ID0gdHJ1ZTtcblx0XHR9XG5cblx0XHRpZiAoIHR5cGVvZiB1cmwgPT09ICd1bmRlZmluZWQnICkge1xuXHRcdFx0dXJsID0gZml4UGFnaW5hdGlvbigpO1xuXHRcdH1cblxuXHRcdGNvbnN0IHJlICAgICAgICA9IG5ldyBSZWdFeHAoICcoWz8mXSknICsga2V5ICsgJz0uKj8oJnwkKScsICdpJyApO1xuXHRcdGNvbnN0IHNlcGFyYXRvciA9IHVybC5pbmRleE9mKCAnPycgKSAhPT0gLTEgPyAnJicgOiAnPyc7XG5cdFx0bGV0IHVybFdpdGhRdWVyeTtcblxuXHRcdGlmICggdXJsLm1hdGNoKCByZSApICkge1xuXHRcdFx0dXJsV2l0aFF1ZXJ5ID0gdXJsLnJlcGxhY2UoIHJlLCAnJDEnICsga2V5ICsgJz0nICsgdmFsdWUgKyAnJDInICk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHVybFdpdGhRdWVyeSA9IHVybCArIHNlcGFyYXRvciArIGtleSArICc9JyArIHZhbHVlO1xuXHRcdH1cblxuXHRcdGlmICggcHVzaEhpc3RvcnkgPT09IHRydWUgKSB7XG5cdFx0XHRyZXR1cm4gaGlzdG9yeS5wdXNoU3RhdGUoIHt9LCAnJywgdXJsV2l0aFF1ZXJ5ICk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHJldHVybiB1cmxXaXRoUXVlcnk7XG5cdFx0fVxuXHR9XG5cblx0Ly8gcmVtb3ZlIHBhcmFtZXRlciBmcm9tIHVybFxuXHRmdW5jdGlvbiByZW1vdmVRdWVyeVN0cmluZ1BhcmFtZXRlciggZmlsdGVyS2V5LCB1cmwgKSB7XG5cdFx0aWYgKCB0eXBlb2YgdXJsID09PSAndW5kZWZpbmVkJyApIHtcblx0XHRcdHVybCA9IGZpeFBhZ2luYXRpb24oKTtcblx0XHR9XG5cblx0XHRjb25zdCBvbGRQYXJhbXMgICAgICAgICA9IGdldFVybFZhcnMoIHVybCApO1xuXHRcdGNvbnN0IG9sZFBhcmFtc0xlbmd0aCAgID0gT2JqZWN0LmtleXMoIG9sZFBhcmFtcyApLmxlbmd0aDtcblx0XHRjb25zdCBzdGFydFBvc2l0aW9uICAgICA9IHVybC5pbmRleE9mKCAnPycgKTtcblx0XHRjb25zdCBmaWx0ZXJLZXlQb3NpdGlvbiA9IHVybC5pbmRleE9mKCBmaWx0ZXJLZXkgKTtcblx0XHRsZXQgY2xlYW5VcmwsIGNsZWFuUXVlcnk7XG5cblx0XHRpZiAoIG9sZFBhcmFtc0xlbmd0aCA+IDEgKSB7XG5cdFx0XHRpZiAoICggZmlsdGVyS2V5UG9zaXRpb24gLSBzdGFydFBvc2l0aW9uICkgPiAxICkge1xuXHRcdFx0XHRjbGVhblVybCA9IHVybC5yZXBsYWNlKCAnJicgKyBmaWx0ZXJLZXkgKyAnPScgKyBvbGRQYXJhbXNbIGZpbHRlcktleSBdLCAnJyApO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0Y2xlYW5VcmwgPSB1cmwucmVwbGFjZSggZmlsdGVyS2V5ICsgJz0nICsgb2xkUGFyYW1zWyBmaWx0ZXJLZXkgXSArICcmJywgJycgKTtcblx0XHRcdH1cblxuXHRcdFx0Y29uc3QgbmV3UGFyYW1zID0gY2xlYW5Vcmwuc3BsaXQoICc/JyApO1xuXHRcdFx0Y2xlYW5RdWVyeSAgICAgID0gJz8nICsgbmV3UGFyYW1zWyAxIF07XG5cdFx0fSBlbHNlIHtcblx0XHRcdGNsZWFuUXVlcnkgPSB1cmwucmVwbGFjZSggJz8nICsgZmlsdGVyS2V5ICsgJz0nICsgb2xkUGFyYW1zWyBmaWx0ZXJLZXkgXSwgJycgKTtcblx0XHR9XG5cblx0XHRyZXR1cm4gY2xlYW5RdWVyeTtcblx0fVxuXG5cdC8vIHRha2UgdGhlIGtleSBhbmQgdmFsdWUgYW5kIG1ha2UgcXVlcnlcblx0ZnVuY3Rpb24gbWFrZVBhcmFtZXRlcnMoIGZpbHRlcktleSwgZmlsdGVyVmFsdWUsIGZvcmNlUmVyZW5kZXIgPSBmYWxzZSwgdXJsICkge1xuXHRcdGNvbnN0IHZhbHVlU2VwYXJhdG9yID0gJywnO1xuXG5cdFx0bGV0IHBhcmFtcywgbmV4dFZhbHVlcywgZW1wdHlWYWx1ZSA9IGZhbHNlO1xuXG5cdFx0aWYgKCB0eXBlb2YgdXJsICE9PSAndW5kZWZpbmVkJyApIHtcblx0XHRcdHBhcmFtcyA9IGdldFVybFZhcnMoIHVybCApO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRwYXJhbXMgPSBnZXRVcmxWYXJzKCk7XG5cdFx0fVxuXG5cdFx0aWYgKCB0eXBlb2YgcGFyYW1zWyBmaWx0ZXJLZXkgXSAhPSAndW5kZWZpbmVkJyApIHtcblx0XHRcdGNvbnN0IHByZXZWYWx1ZXMgICAgICA9IHBhcmFtc1sgZmlsdGVyS2V5IF07XG5cdFx0XHRjb25zdCBwcmV2VmFsdWVzQXJyYXkgPSBwcmV2VmFsdWVzLnNwbGl0KCB2YWx1ZVNlcGFyYXRvciApO1xuXG5cdFx0XHRpZiAoIHByZXZWYWx1ZXMubGVuZ3RoID4gMCApIHtcblx0XHRcdFx0Y29uc3QgZm91bmQgPSAkLmluQXJyYXkoIGZpbHRlclZhbHVlLCBwcmV2VmFsdWVzQXJyYXkgKTtcblxuXHRcdFx0XHRpZiAoIGZvdW5kID49IDAgKSB7XG5cdFx0XHRcdFx0Ly8gRWxlbWVudCB3YXMgZm91bmQsIHJlbW92ZSBpdC5cblx0XHRcdFx0XHRwcmV2VmFsdWVzQXJyYXkuc3BsaWNlKCBmb3VuZCwgMSApO1xuXG5cdFx0XHRcdFx0aWYgKCBwcmV2VmFsdWVzQXJyYXkubGVuZ3RoID09PSAwICkge1xuXHRcdFx0XHRcdFx0ZW1wdHlWYWx1ZSA9IHRydWU7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdC8vIEVsZW1lbnQgd2FzIG5vdCBmb3VuZCwgYWRkIGl0LlxuXHRcdFx0XHRcdHByZXZWYWx1ZXNBcnJheS5wdXNoKCBmaWx0ZXJWYWx1ZSApO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0aWYgKCBwcmV2VmFsdWVzQXJyYXkubGVuZ3RoID4gMSApIHtcblx0XHRcdFx0XHRuZXh0VmFsdWVzID0gcHJldlZhbHVlc0FycmF5LmpvaW4oIHZhbHVlU2VwYXJhdG9yICk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0bmV4dFZhbHVlcyA9IHByZXZWYWx1ZXNBcnJheTtcblx0XHRcdFx0fVxuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0bmV4dFZhbHVlcyA9IGZpbHRlclZhbHVlO1xuXHRcdFx0fVxuXHRcdH0gZWxzZSB7XG5cdFx0XHRuZXh0VmFsdWVzID0gZmlsdGVyVmFsdWU7XG5cdFx0fVxuXG5cdFx0Ly8gdXBkYXRlIHVybCBhbmQgcXVlcnkgc3RyaW5nXG5cdFx0aWYgKCAhIGVtcHR5VmFsdWUgKSB7XG5cdFx0XHR1cGRhdGVRdWVyeVN0cmluZ1BhcmFtZXRlciggZmlsdGVyS2V5LCBuZXh0VmFsdWVzICk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdGNvbnN0IHF1ZXJ5ID0gcmVtb3ZlUXVlcnlTdHJpbmdQYXJhbWV0ZXIoIGZpbHRlcktleSApO1xuXHRcdFx0aGlzdG9yeS5wdXNoU3RhdGUoIHt9LCAnJywgcXVlcnkgKTtcblx0XHR9XG5cblx0XHRmaWx0ZXJQcm9kdWN0cyggZm9yY2VSZXJlbmRlciApO1xuXHR9XG5cblx0ZnVuY3Rpb24gc2luZ2xlRmlsdGVyKCBmaWx0ZXJLZXksIGZpbHRlclZhbHVlICkge1xuXHRcdGNvbnN0IHBhcmFtcyA9IGdldFVybFZhcnMoKTtcblx0XHRsZXQgcXVlcnk7XG5cblx0XHRpZiAoIHR5cGVvZiBwYXJhbXNbIGZpbHRlcktleSBdICE9PSAndW5kZWZpbmVkJyAmJiBwYXJhbXNbIGZpbHRlcktleSBdID09PSBmaWx0ZXJWYWx1ZSApIHtcblx0XHRcdHF1ZXJ5ID0gcmVtb3ZlUXVlcnlTdHJpbmdQYXJhbWV0ZXIoIGZpbHRlcktleSApO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRxdWVyeSA9IHVwZGF0ZVF1ZXJ5U3RyaW5nUGFyYW1ldGVyKCBmaWx0ZXJLZXksIGZpbHRlclZhbHVlLCBmYWxzZSApO1xuXHRcdH1cblxuXHRcdC8vIHVwZGF0ZSB1cmxcblx0XHRoaXN0b3J5LnB1c2hTdGF0ZSgge30sICcnLCBxdWVyeSApO1xuXG5cdFx0ZmlsdGVyUHJvZHVjdHMoKTtcblx0fVxuXG5cdC8vIEhhbmRsZSB0aGUgcGFnaW5hdGlvbiByZXF1ZXN0IHZpYSBhamF4LlxuXHRpZiAoIHdjYXBmX3BhcmFtcy5lbmFibGVfcGFnaW5hdGlvbl92aWFfYWpheCAmJiB3Y2FwZl9wYXJhbXMucGFnaW5hdGlvbl9jb250YWluZXIgKSB7XG5cdFx0Y29uc3QgJGNvbnRhaW5lciA9ICQoIHdjYXBmX3BhcmFtcy5zaG9wX2xvb3BfY29udGFpbmVyICk7XG5cdFx0Y29uc3Qgc2VsZWN0b3IgICA9IHdjYXBmX3BhcmFtcy5wYWdpbmF0aW9uX2NvbnRhaW5lciArICcgYSc7XG5cblx0XHQvLyB0b2RvOiBjaGVjayBpZiBhamF4IGRpc2FibGVkLlxuXHRcdGlmICggJGNvbnRhaW5lci5sZW5ndGggKSB7XG5cdFx0XHQkY29udGFpbmVyLm9uKCAnY2xpY2snLCBzZWxlY3RvciwgZnVuY3Rpb24oIGUgKSB7XG5cdFx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcblxuXHRcdFx0XHRjb25zdCBsb2NhdGlvbiA9ICQoIHRoaXMgKS5hdHRyKCAnaHJlZicgKTtcblxuXHRcdFx0XHRoaXN0b3J5LnB1c2hTdGF0ZSgge30sICcnLCBsb2NhdGlvbiApO1xuXG5cdFx0XHRcdGZpbHRlclByb2R1Y3RzKCk7XG5cdFx0XHR9ICk7XG5cdFx0fVxuXHR9XG5cblx0Ly8gVGhlIGZ1bmN0aW9uIHRvIGhhbmRsZSB0aGUgY29tbW9uIGZpbHRlciByZXF1ZXN0cy5cblx0ZnVuY3Rpb24gaGFuZGxlRmlsdGVyUmVxdWVzdCggJGl0ZW0sIGZpbHRlclZhbHVlICkge1xuXHRcdGNvbnN0ICRmaWVsZCAgICAgICAgID0gJGl0ZW0uY2xvc2VzdCggJy53Y2FwZi1zaW5nbGUtZmlsdGVyJyApO1xuXHRcdGNvbnN0IGZpZWxkSUQgICAgICAgID0gJGZpZWxkLmF0dHIoICdkYXRhLWlkJyApO1xuXHRcdGNvbnN0IGZpZWxkRGF0YSAgICAgID0gZmllbGRzWyBmaWVsZElEIF07XG5cdFx0Y29uc3QgZmlsdGVyS2V5ICAgICAgPSBmaWVsZERhdGEuZmlsdGVyS2V5O1xuXHRcdGNvbnN0IG11bHRpcGxlRmlsdGVyID0gZmllbGREYXRhLm11bHRpcGxlRmlsdGVyO1xuXG5cdFx0aWYgKCAhIGZpbHRlcktleSApIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHRpZiAoICEgZmlsdGVyVmFsdWUubGVuZ3RoICkge1xuXHRcdFx0Y29uc3QgcXVlcnkgPSByZW1vdmVRdWVyeVN0cmluZ1BhcmFtZXRlciggZmlsdGVyS2V5ICk7XG5cdFx0XHRoaXN0b3J5LnB1c2hTdGF0ZSgge30sICcnLCBxdWVyeSApO1xuXG5cdFx0XHRmaWx0ZXJQcm9kdWN0cygpO1xuXG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0aWYgKCBtdWx0aXBsZUZpbHRlciApIHtcblx0XHRcdG1ha2VQYXJhbWV0ZXJzKCBmaWx0ZXJLZXksIGZpbHRlclZhbHVlICk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHNpbmdsZUZpbHRlciggZmlsdGVyS2V5LCBmaWx0ZXJWYWx1ZSApO1xuXHRcdH1cblx0fVxuXG5cdGZ1bmN0aW9uIHJlcXVlc3RGaWx0ZXIoIHVybCApIHtcblx0XHRpZiAoICEgdXJsICkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdC8vIHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gdXJsO1xuXG5cdFx0Ly8gVE9ETzogRmlsdGVyIHRoZSBwcm9kdWN0cyBjb25kaXRpb25hbGx5LlxuXHRcdC8vIGZpbHRlclByb2R1Y3RzKCk7XG5cdH1cblxuXHQvLyBIYW5kbGUgdGhlIGZpbHRlciByZXF1ZXN0IGZvciBsaXN0IGZpZWxkLlxuXHQkd2NhcGZOYXZGaWx0ZXJzLm9uKFxuXHRcdCdjaGFuZ2UnLFxuXHRcdCcud2NhcGYtbGF5ZXJlZC1uYXYgW3R5cGU9XCJjaGVja2JveFwiXSwgLndjYXBmLWxheWVyZWQtbmF2IFt0eXBlPVwicmFkaW9cIl0nLFxuXHRcdGZ1bmN0aW9uKCBldmVudCApIHtcblx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cblx0XHRcdGNvbnN0ICRpdGVtID0gJCggdGhpcyApO1xuXG5cdFx0XHRyZXF1ZXN0RmlsdGVyKCAkaXRlbS5kYXRhKCAndXJsJyApICk7XG5cdFx0fVxuXHQpO1xuXG5cdC8vIEhhbmRsZSB0aGUgZmlsdGVyIHJlcXVlc3QgZm9yIGxhYmVsZWQgaXRlbS5cblx0JHdjYXBmTmF2RmlsdGVycy5vbiggJ2NsaWNrJywgJy53Y2FwZi1sYWJlbGVkLW5hdiAuaXRlbTpub3QoLmRpc2FibGVkKScsIGZ1bmN0aW9uKCBldmVudCApIHtcblx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXG5cdFx0Y29uc3QgJGl0ZW0gPSAkKCB0aGlzICk7XG5cblx0XHRyZXF1ZXN0RmlsdGVyKCAkaXRlbS5kYXRhKCAndXJsJyApICk7XG5cdH0gKTtcblxuXHQvLyBIYW5kbGUgdGhlIGZpbHRlciByZXF1ZXN0IGZvciBkaXNwbGF5IHR5cGUgc2VsZWN0IGZpZWxkcy5cblx0JHdjYXBmTmF2RmlsdGVycy5vbiggJ2NoYW5nZScsICdzZWxlY3QnLCBmdW5jdGlvbiggZXZlbnQgKSB7XG5cdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcblxuXHRcdGNvbnN0ICRzZWxlY3QgICAgICAgID0gJCggdGhpcyApO1xuXHRcdGNvbnN0IHZhbHVlcyAgICAgICAgID0gJHNlbGVjdC52YWwoKTtcblx0XHRjb25zdCBmaWx0ZXJVUkwgICAgICA9ICRzZWxlY3QuZGF0YSggJ3VybCcgKTtcblx0XHRjb25zdCBjbGVhckZpbHRlclVSTCA9ICRzZWxlY3QuZGF0YSggJ2NsZWFyLWZpbHRlci11cmwnICk7XG5cdFx0bGV0IHVybDtcblxuXHRcdGlmICggdmFsdWVzLmxlbmd0aCApIHtcblx0XHRcdHVybCA9IGZpbHRlclVSTC5yZXBsYWNlKCAnJXMnLCB2YWx1ZXMudG9TdHJpbmcoKSApO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHR1cmwgPSBjbGVhckZpbHRlclVSTDtcblx0XHR9XG5cblx0XHRyZXF1ZXN0RmlsdGVyKCB1cmwgKTtcblx0fSApO1xuXG5cdC8qKlxuXHQgKiBIYW5kbGUgdGhlIGZpbHRlciByZXF1ZXN0IGZvciByYW5nZSBudW1iZXIuXG5cdCAqL1xuXHRjb25zdCByYW5nZU51bWJlclNlbGVjdG9ycyA9ICcud2NhcGYtcmFuZ2UtbnVtYmVyIC5taW4tdmFsdWUsIC53Y2FwZi1yYW5nZS1udW1iZXIgLm1heC12YWx1ZSc7XG5cblx0Ly8gVE9ETzogTWF5YmUgdXNlICdjaGFuZ2UnIGV2ZW50LlxuXHQkd2NhcGZOdW1iZXJSYW5nZUZpbHRlcnMub24oICdpbnB1dCcsIHJhbmdlTnVtYmVyU2VsZWN0b3JzLCBmdW5jdGlvbiggZXZlbnQgKSB7XG5cdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcblxuXHRcdGNvbnN0ICRpdGVtID0gJCggdGhpcyApO1xuXG5cdFx0Y29uc3QgJHJhbmdlTnVtYmVyICAgICAgPSAkaXRlbS5jbG9zZXN0KCAnLndjYXBmLXJhbmdlLW51bWJlcicgKTtcblx0XHRjb25zdCBmb3JtYXROdW1iZXJzICAgICA9ICRyYW5nZU51bWJlci5hdHRyKCAnZGF0YS1mb3JtYXQtbnVtYmVycycgKTtcblx0XHRjb25zdCByYW5nZU1pblZhbHVlICAgICA9IHBhcnNlRmxvYXQoICRyYW5nZU51bWJlci5hdHRyKCAnZGF0YS1yYW5nZS1taW4tdmFsdWUnICkgKTtcblx0XHRjb25zdCByYW5nZU1heFZhbHVlICAgICA9IHBhcnNlRmxvYXQoICRyYW5nZU51bWJlci5hdHRyKCAnZGF0YS1yYW5nZS1tYXgtdmFsdWUnICkgKTtcblx0XHRjb25zdCBkZWNpbWFsUGxhY2VzICAgICA9ICRyYW5nZU51bWJlci5hdHRyKCAnZGF0YS1kZWNpbWFsLXBsYWNlcycgKTtcblx0XHRjb25zdCB0aG91c2FuZFNlcGFyYXRvciA9ICRyYW5nZU51bWJlci5hdHRyKCAnZGF0YS10aG91c2FuZC1zZXBhcmF0b3InICk7XG5cdFx0Y29uc3QgZGVjaW1hbFNlcGFyYXRvciAgPSAkcmFuZ2VOdW1iZXIuYXR0ciggJ2RhdGEtZGVjaW1hbC1zZXBhcmF0b3InICk7XG5cblx0XHQvLyBDbGVhciBhbnkgcHJldmlvdXNseSBzZXQgdGltZXIgYmVmb3JlIHNldHRpbmcgYSBmcmVzaCBvbmVcblx0XHRjbGVhclRpbWVvdXQoICRpdGVtLmRhdGEoICd0aW1lcicgKSApO1xuXG5cdFx0ZnVuY3Rpb24gZ2V0VmFsdWUoIGZsb2F0VmFsdWUgKSB7XG5cdFx0XHRpZiAoIGZvcm1hdE51bWJlcnMgKSB7XG5cdFx0XHRcdHJldHVybiBudW1iZXJfZm9ybWF0KCBmbG9hdFZhbHVlLCBkZWNpbWFsUGxhY2VzLCBkZWNpbWFsU2VwYXJhdG9yLCB0aG91c2FuZFNlcGFyYXRvciApO1xuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gZmxvYXRWYWx1ZTtcblx0XHR9XG5cblx0XHQkaXRlbS5kYXRhKCAndGltZXInLCBzZXRUaW1lb3V0KCBmdW5jdGlvbigpIHtcblx0XHRcdCRpdGVtLnJlbW92ZURhdGEoICd0aW1lcicgKTtcblxuXHRcdFx0bGV0IG1pblZhbHVlID0gcGFyc2VGbG9hdCggJHJhbmdlTnVtYmVyLmZpbmQoICcubWluLXZhbHVlJyApLnZhbCgpICk7XG5cdFx0XHRsZXQgbWF4VmFsdWUgPSBwYXJzZUZsb2F0KCAkcmFuZ2VOdW1iZXIuZmluZCggJy5tYXgtdmFsdWUnICkudmFsKCkgKTtcblxuXHRcdFx0Ly8gRm9yY2UgdGhlIG1pblZhbHVlIG5vdCB0byBiZSBlbXB0eS5cblx0XHRcdGlmICggaXNOYU4oIG1pblZhbHVlICkgKSB7XG5cdFx0XHRcdG1pblZhbHVlID0gcmFuZ2VNaW5WYWx1ZTtcblxuXHRcdFx0XHQkcmFuZ2VOdW1iZXIuZmluZCggJy5taW4tdmFsdWUnICkudmFsKCBnZXRWYWx1ZSggbWluVmFsdWUgKSApO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0JHJhbmdlTnVtYmVyLmZpbmQoICcubWluLXZhbHVlJyApLnZhbCggZ2V0VmFsdWUoIG1pblZhbHVlICkgKTtcblx0XHRcdH1cblxuXHRcdFx0Ly8gRm9yY2UgdGhlIG1heFZhbHVlIG5vdCB0byBiZSBlbXB0eS5cblx0XHRcdGlmICggaXNOYU4oIG1heFZhbHVlICkgKSB7XG5cdFx0XHRcdG1heFZhbHVlID0gcmFuZ2VNYXhWYWx1ZTtcblxuXHRcdFx0XHQkcmFuZ2VOdW1iZXIuZmluZCggJy5tYXgtdmFsdWUnICkudmFsKCBnZXRWYWx1ZSggbWF4VmFsdWUgKSApO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0JHJhbmdlTnVtYmVyLmZpbmQoICcubWF4LXZhbHVlJyApLnZhbCggZ2V0VmFsdWUoIG1heFZhbHVlICkgKTtcblx0XHRcdH1cblxuXHRcdFx0Ly8gRm9yY2UgdGhlIG1pblZhbHVlIG5vdCB0byBnbyBiZWxvdyB0aGUgcmFuZ2VNaW5WYWx1ZS5cblx0XHRcdGlmICggbWluVmFsdWUgPCByYW5nZU1pblZhbHVlICkge1xuXHRcdFx0XHRtaW5WYWx1ZSA9IHJhbmdlTWluVmFsdWU7XG5cblx0XHRcdFx0JHJhbmdlTnVtYmVyLmZpbmQoICcubWluLXZhbHVlJyApLnZhbCggZ2V0VmFsdWUoIG1pblZhbHVlICkgKTtcblx0XHRcdH1cblxuXHRcdFx0Ly8gRm9yY2UgdGhlIG1pblZhbHVlIG5vdCB0byBnbyB1cCB0aGUgcmFuZ2VNYXhWYWx1ZS5cblx0XHRcdGlmICggbWluVmFsdWUgPiByYW5nZU1heFZhbHVlICkge1xuXHRcdFx0XHRtaW5WYWx1ZSA9IHJhbmdlTWF4VmFsdWU7XG5cblx0XHRcdFx0JHJhbmdlTnVtYmVyLmZpbmQoICcubWluLXZhbHVlJyApLnZhbCggZ2V0VmFsdWUoIG1pblZhbHVlICkgKTtcblx0XHRcdH1cblxuXHRcdFx0Ly8gRm9yY2UgdGhlIG1heFZhbHVlIG5vdCB0byBnbyB1cCB0aGUgcmFuZ2VNYXhWYWx1ZS5cblx0XHRcdGlmICggbWF4VmFsdWUgPiByYW5nZU1heFZhbHVlICkge1xuXHRcdFx0XHRtYXhWYWx1ZSA9IHJhbmdlTWF4VmFsdWU7XG5cblx0XHRcdFx0JHJhbmdlTnVtYmVyLmZpbmQoICcubWF4LXZhbHVlJyApLnZhbCggZ2V0VmFsdWUoIG1heFZhbHVlICkgKTtcblx0XHRcdH1cblxuXHRcdFx0Ly8gRm9yY2UgdGhlIG1heFZhbHVlIG5vdCB0byBnbyBiZWxvdyB0aGUgbWluVmFsdWUuXG5cdFx0XHRpZiAoIG1pblZhbHVlID4gbWF4VmFsdWUgKSB7XG5cdFx0XHRcdG1heFZhbHVlID0gbWluVmFsdWU7XG5cblx0XHRcdFx0JHJhbmdlTnVtYmVyLmZpbmQoICcubWF4LXZhbHVlJyApLnZhbCggZ2V0VmFsdWUoIG1heFZhbHVlICkgKTtcblx0XHRcdH1cblxuXHRcdFx0aWYgKCBtaW5WYWx1ZSA9PT0gcmFuZ2VNaW5WYWx1ZSAmJiBtYXhWYWx1ZSA9PT0gcmFuZ2VNYXhWYWx1ZSApIHtcblx0XHRcdFx0Ly8gUmVtb3ZlIHJhbmdlIGZpbHRlci5cblx0XHRcdFx0cmVxdWVzdEZpbHRlciggJHJhbmdlTnVtYmVyLmRhdGEoICdjbGVhci1maWx0ZXItdXJsJyApICk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHQvLyBBZGQgcmFuZ2UgZmlsdGVyLlxuXHRcdFx0XHRjb25zdCB1cmwgPSAkcmFuZ2VOdW1iZXIuZGF0YSggJ3VybCcgKS5yZXBsYWNlKCAnJTFzJywgbWluVmFsdWUgKS5yZXBsYWNlKCAnJTJzJywgbWF4VmFsdWUgKTtcblx0XHRcdFx0cmVxdWVzdEZpbHRlciggdXJsICk7XG5cdFx0XHR9XG5cdFx0fSwgZGVsYXkgKSApO1xuXHR9ICk7XG5cblx0Ly8gSGFuZGxlIHJlbW92aW5nIHRoZSBhY3RpdmUgZmlsdGVycy5cblx0JHdjYXBmTmF2RmlsdGVycy5vbiggJ2NsaWNrJywgJy53Y2FwZi1hY3RpdmUtZmlsdGVycyAuaXRlbTpub3QoLmRpc2FibGVkKScsIGZ1bmN0aW9uKCBldmVudCApIHtcblx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXG5cdFx0Y29uc3QgJGl0ZW0gICAgICAgPSAkKCB0aGlzICk7XG5cdFx0Y29uc3QgZmlsdGVyS2V5ICAgPSAkaXRlbS5hdHRyKCAnZGF0YS1maWx0ZXIta2V5JyApO1xuXHRcdGNvbnN0IGZpbHRlclZhbHVlID0gJGl0ZW0uYXR0ciggJ2RhdGEtdmFsdWUnICk7XG5cblx0XHRtYWtlUGFyYW1ldGVycyggZmlsdGVyS2V5LCBmaWx0ZXJWYWx1ZSwgdHJ1ZSApO1xuXHR9ICk7XG5cblx0ZnVuY3Rpb24gcmVzZXRGaWx0ZXJzKCAkYnV0dG9uICkge1xuXHRcdGNvbnN0IF9maWx0ZXJLZXlzID0gJGJ1dHRvbi5hdHRyKCAnZGF0YS1rZXlzJyApO1xuXG5cdFx0aWYgKCAhIF9maWx0ZXJLZXlzICkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdGNvbnN0IGZpbHRlcktleXMgPSBfZmlsdGVyS2V5cy5zcGxpdCggJywnICk7XG5cblx0XHRsZXQgcXVlcnkgPSAnJztcblxuXHRcdCQuZWFjaCggZmlsdGVyS2V5cywgZnVuY3Rpb24oIGksIGZpbHRlcktleSApIHtcblx0XHRcdGlmICggcXVlcnkgKSB7XG5cdFx0XHRcdHF1ZXJ5ID0gcmVtb3ZlUXVlcnlTdHJpbmdQYXJhbWV0ZXIoIGZpbHRlcktleSwgcXVlcnkgKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHF1ZXJ5ID0gcmVtb3ZlUXVlcnlTdHJpbmdQYXJhbWV0ZXIoIGZpbHRlcktleSApO1xuXHRcdFx0fVxuXHRcdH0gKTtcblxuXHRcdC8vIEVtcHR5IHF1ZXJ5IGNhdXNlcyBpc3N1ZShkb2Vzbid0IHJlbW92ZSB0aGUgZmlsdGVyIGtleXMgZnJvbSB0aGUgdXJsKSxcblx0XHQvLyB0aGlzIGlzIHdoeSB3ZSBhcmUgc2V0dGluZyB0aGUgcGFnZSB1cmwgYXMgcXVlcnkuXG5cdFx0aWYgKCAhIHF1ZXJ5ICkge1xuXHRcdFx0Y29uc3QgcHJldlVybCA9IHdpbmRvdy5sb2NhdGlvbi5ocmVmO1xuXHRcdFx0Y29uc3QgbmV3VXJsICA9IHByZXZVcmwuc3BsaXQoICc/JyApO1xuXG5cdFx0XHRxdWVyeSA9IG5ld1VybFsgMCBdO1xuXHRcdH1cblxuXHRcdGhpc3RvcnkucHVzaFN0YXRlKCB7fSwgJycsIHF1ZXJ5ICk7XG5cblx0XHRmaWx0ZXJQcm9kdWN0cyggdHJ1ZSApO1xuXHR9XG5cblx0Ly8gQ2xlYXIvUmVzZXQgYWxsIGZpbHRlcnMuXG5cdCRib2R5Lm9uKCAnd2NhcGYtcmVzZXQtZmlsdGVycycsIGZ1bmN0aW9uKCBlLCAkYnV0dG9uICkge1xuXHRcdHJlc2V0RmlsdGVycyggJGJ1dHRvbiApO1xuXHR9ICk7XG5cblx0JGJvZHkub24oICdjbGljaycsICcud2NhcGYtcmVzZXQtZmlsdGVycy1idG4nLCBmdW5jdGlvbigpIHtcblx0XHRjb25zdCAkYnV0dG9uID0gJCggdGhpcyApO1xuXG5cdFx0cmVzZXRGaWx0ZXJzKCAkYnV0dG9uICk7XG5cdH0gKTtcblxuXHQkd2NhcGZOYXZGaWx0ZXJzLm9uKCAnY2xpY2snLCAnLndjYXBmLXJlc2V0LWZpbHRlcnMtYnRuJywgZnVuY3Rpb24oIGV2ZW50ICkge1xuXHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cblx0XHRjb25zdCAkYnV0dG9uID0gJCggdGhpcyApO1xuXG5cdFx0JGJvZHkudHJpZ2dlciggJ3djYXBmLXJlc2V0LWZpbHRlcnMnLCBbICRidXR0b24gXSApO1xuXHR9ICk7XG5cblx0JHdjYXBmU2luZ2xlRmlsdGVycy5vbiggJ3djYXBmLWNsZWFyLWZpbHRlcicsIGZ1bmN0aW9uKCkge1xuXHRcdGNvbnN0ICRmaWVsZCAgICA9ICQoIHRoaXMgKTtcblx0XHRjb25zdCBmaWVsZElEICAgPSAkZmllbGQuYXR0ciggJ2RhdGEtaWQnICk7XG5cdFx0Y29uc3QgZmllbGREYXRhID0gZmllbGRzWyBmaWVsZElEIF07XG5cdFx0Y29uc3QgZmlsdGVyS2V5ID0gZmllbGREYXRhLmZpbHRlcktleTtcblxuXHRcdGNvbnN0IHF1ZXJ5ID0gcmVtb3ZlUXVlcnlTdHJpbmdQYXJhbWV0ZXIoIGZpbHRlcktleSApO1xuXHRcdGhpc3RvcnkucHVzaFN0YXRlKCB7fSwgJycsIHF1ZXJ5ICk7XG5cblx0XHRmaWx0ZXJQcm9kdWN0cyggdHJ1ZSApO1xuXHR9ICk7XG5cblx0Ly8gUnVuIGFqYXggZmlsdGVyIHdoZW4gYnJvd3NlciBoaXN0b3J5IGNoYW5nZXMgKHVzZXIgZ29lcyBiYWNrIG9yIGZvcndhcmQpLlxuXHRpZiAoICQoIHdjYXBmX3BhcmFtcy5zaG9wX2xvb3BfY29udGFpbmVyICkubGVuZ3RoIHx8ICQoIHdjYXBmX3BhcmFtcy5ub3RfZm91bmRfY29udGFpbmVyICkubGVuZ3RoICkge1xuXHRcdGlmICggd2NhcGZfcGFyYW1zLmFwcGx5X2ZpbHRlcnNfb25fYnJvd3Nlcl9oaXN0b3J5X2NoYW5nZSApIHtcblx0XHRcdCQoIHdpbmRvdyApLmJpbmQoICdwb3BzdGF0ZScsIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRmaWx0ZXJQcm9kdWN0cyggdHJ1ZSApO1xuXHRcdFx0fSApO1xuXHRcdH1cblx0fVxuXG5cdC8vIFRoZSBob29rIHRoYXQgbWFudWFsbHkgcnVuIHRoZSBhamF4IGZpbHRlcnMgKGNhbiBiZSB1c2VmdWwgZm9yIG90aGVyIHBsdWdpbnMpLlxuXHQkYm9keS5vbiggJ3djYXBmLXJ1bi1maWx0ZXItcHJvZHVjdHMnLCBmdW5jdGlvbiggZSwgZm9yY2VSZVJlbmRlciApIHtcblx0XHRmaWx0ZXJQcm9kdWN0cyggZm9yY2VSZVJlbmRlciApO1xuXHR9ICk7XG5cblx0Ly8gVGhlIGhvb2sgdGhhdCByZWluaXRpYWxpemUgdGhlIGZpbHRlciB3aWRnZXRzICh0byBzaG93IHRoZSBwcmV2aWV3IGluIHRoZSBiYWNrZW5kKS5cblx0JGJvZHkub24oICdpbml0X2ZpbHRlcl93aWRnZXRzJywgZnVuY3Rpb24oKSB7XG5cdFx0aW5pdENob3NlbigpO1xuXHRcdGluaXRIaWVyYXJjaHlBY2NvcmRpb24oKTtcblx0XHRpbml0Tm9VSVNsaWRlcigpO1xuXHRcdGluaXREYXRlcGlja2VyKCk7XG5cdH0gKTtcblxuXHQvKipcblx0ICogTWFrZSBpdCBjb21wYXRpYmxlIHdpdGggb3RoZXIgcGx1Z2lucy5cblx0ICovXG5cdCRib2R5Lm9uKCAnd2NhcGZfYWZ0ZXJfdXBkYXRpbmdfcHJvZHVjdHMnLCBmdW5jdGlvbigpIHtcblx0XHQvLyB3b28tdmFyaWF0aW9uLXN3YXRjaGVzXG5cdFx0JCggZG9jdW1lbnQgKS50cmlnZ2VyKCAnd29vX3ZhcmlhdGlvbl9zd2F0Y2hlc19wcm9faW5pdCcgKTtcblx0fSApO1xufSApO1xuIiwiKCBmdW5jdGlvbiggJCwgd2luZG93ICkge1xuXG5cdGNvbnN0IF9kZWxheSA9IHBhcnNlSW50KCB3Y2FwZl9wYXJhbXMuZmlsdGVyX2lucHV0X2RlbGF5ICk7XG5cdGNvbnN0IGRlbGF5ICA9IF9kZWxheSA+PSAwID8gX2RlbGF5IDogODAwO1xuXG5cdGNvbnN0ICRib2R5ID0gJCggJ2JvZHknICk7XG5cblx0Y29uc3QgaW5zdGFuY2VJZHMgPSBbXTtcblxuXHQkKCAnLndjYXBmLWZpbHRlcicgKS5lYWNoKCBmdW5jdGlvbigpIHtcblx0XHRpbnN0YW5jZUlkcy5wdXNoKCAkKCB0aGlzICkuZGF0YSggJ2lkJyApICk7XG5cdH0gKTtcblxuXHRsZXQgZm9jdXNlZEVsbTtcblxuXHR3aW5kb3cuV0NBUEYgPSB3aW5kb3cuV0NBUEYgfHwge307XG5cblx0d2luZG93LldDQVBGID0ge1xuXHRcdGhhbmRsZUZpbHRlckFjY29yZGlvbjogZnVuY3Rpb24oKSB7XG5cdFx0XHRjb25zdCB0b2dnbGVBY2NvcmRpb24gPSAoICRlbCApID0+IHtcblx0XHRcdFx0Ly8gQ2hlY2sgdG8gc2VlIGlmIHRoZSBhY2NvcmRpb24gaXMgb3BlbmVkXG5cdFx0XHRcdGNvbnN0IHByZXNzZWQgPSAkZWwuYXR0ciggJ2FyaWEtZXhwYW5kZWQnICkgPT09ICd0cnVlJztcblxuXHRcdFx0XHQvLyBDaGFuZ2UgYXJpYS1leHBhbmRlZCB0byB0aGUgb3Bwb3NpdGUgc3RhdGVcblx0XHRcdFx0JGVsLmF0dHIoICdhcmlhLWV4cGFuZGVkJywgISBwcmVzc2VkICk7XG5cblx0XHRcdFx0Y29uc3QgJGZpbHRlcklubmVyID0gJGVsLmNsb3Nlc3QoICcud2NhcGYtZmlsdGVyJyApLmNoaWxkcmVuKCAnLndjYXBmLWZpbHRlci1pbm5lcicgKTtcblxuXHRcdFx0XHRpZiAoIHdjYXBmX3BhcmFtcy5lbmFibGVfYW5pbWF0aW9uX2Zvcl9maWx0ZXJfYWNjb3JkaW9uICkge1xuXHRcdFx0XHRcdCRmaWx0ZXJJbm5lci5zbGlkZVRvZ2dsZShcblx0XHRcdFx0XHRcdHdjYXBmX3BhcmFtcy5maWx0ZXJfYWNjb3JkaW9uX2FuaW1hdGlvbl9zcGVlZCxcblx0XHRcdFx0XHRcdHdjYXBmX3BhcmFtcy5maWx0ZXJfYWNjb3JkaW9uX2FuaW1hdGlvbl9lYXNpbmdcblx0XHRcdFx0XHQpO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdCRmaWx0ZXJJbm5lci50b2dnbGUoKTtcblx0XHRcdFx0fVxuXHRcdFx0fTtcblxuXHRcdFx0JGJvZHkub24oICdjbGljaycsICcud2NhcGYtZmlsdGVyLWFjY29yZGlvbi10cmlnZ2VyJywgZnVuY3Rpb24oKSB7XG5cdFx0XHRcdHRvZ2dsZUFjY29yZGlvbiggJCggdGhpcyApICk7XG5cdFx0XHR9ICk7XG5cdFx0fSxcblx0XHRoYW5kbGVIaWVyYXJjaHlUb2dnbGU6IGZ1bmN0aW9uKCkge1xuXHRcdFx0Y29uc3QgdG9nZ2xlQWNjb3JkaW9uID0gKCAkZWwgKSA9PiB7XG5cdFx0XHRcdC8vIENoZWNrIHRvIHNlZSBpZiB0aGUgYnV0dG9uIGlzIHByZXNzZWRcblx0XHRcdFx0Y29uc3QgcHJlc3NlZCA9ICRlbC5hdHRyKCAnYXJpYS1wcmVzc2VkJyApID09PSAndHJ1ZSc7XG5cblx0XHRcdFx0Ly8gQ2hhbmdlIGFyaWEtcHJlc3NlZCB0byB0aGUgb3Bwb3NpdGUgc3RhdGVcblx0XHRcdFx0JGVsLmF0dHIoICdhcmlhLXByZXNzZWQnLCAhIHByZXNzZWQgKTtcblxuXHRcdFx0XHRjb25zdCAkY2hpbGQgPSAkZWwuY2xvc2VzdCggJ2xpJyApLmNoaWxkcmVuKCAndWwnICk7XG5cblx0XHRcdFx0aWYgKCB3Y2FwZl9wYXJhbXMuZW5hYmxlX2FuaW1hdGlvbl9mb3JfaGllcmFyY2h5X2FjY29yZGlvbiApIHtcblx0XHRcdFx0XHQkY2hpbGQuc2xpZGVUb2dnbGUoXG5cdFx0XHRcdFx0XHR3Y2FwZl9wYXJhbXMuaGllcmFyY2h5X2FjY29yZGlvbl9hbmltYXRpb25fc3BlZWQsXG5cdFx0XHRcdFx0XHR3Y2FwZl9wYXJhbXMuaGllcmFyY2h5X2FjY29yZGlvbl9hbmltYXRpb25fZWFzaW5nXG5cdFx0XHRcdFx0KTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHQkY2hpbGQudG9nZ2xlKCk7XG5cdFx0XHRcdH1cblx0XHRcdH07XG5cblx0XHRcdCRib2R5XG5cdFx0XHRcdC5vbiggJ2NsaWNrJywgJy53Y2FwZi1oaWVyYXJjaHktYWNjb3JkaW9uLXRvZ2dsZScsIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdHRvZ2dsZUFjY29yZGlvbiggJCggdGhpcyApICk7XG5cdFx0XHRcdH0gKVxuXHRcdFx0XHQub24oICdrZXlkb3duJywgJy53Y2FwZi1oaWVyYXJjaHktYWNjb3JkaW9uLXRvZ2dsZScsIGZ1bmN0aW9uKCBlICkge1xuXHRcdFx0XHRcdGlmICggZS5rZXkgPT09ICcgJyB8fCBlLmtleSA9PT0gJ0VudGVyJyB8fCBlLmtleSA9PT0gJ1NwYWNlYmFyJyApIHtcblx0XHRcdFx0XHRcdC8vIFByZXZlbnQgdGhlIGRlZmF1bHQgYWN0aW9uIHRvIHN0b3Agc2Nyb2xsaW5nIHdoZW4gc3BhY2UgaXMgcHJlc3NlZFxuXHRcdFx0XHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG5cdFx0XHRcdFx0XHR0b2dnbGVBY2NvcmRpb24oICQoIHRoaXMgKSApO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSApO1xuXHRcdH0sXG5cdFx0aGFuZGxlU29mdExpbWl0OiBmdW5jdGlvbigpIHtcblx0XHRcdGNvbnN0IHRvZ2dsZUZpbHRlck9wdGlvbnMgPSAoICRlbCApID0+IHtcblx0XHRcdFx0Ly8gQ2hlY2sgdG8gc2VlIGlmIHRoZSBidXR0b24gaXMgcHJlc3NlZFxuXHRcdFx0XHRjb25zdCBwcmVzc2VkID0gJGVsLmF0dHIoICdhcmlhLXByZXNzZWQnICkgPT09ICd0cnVlJztcblxuXHRcdFx0XHQvLyBDaGFuZ2UgYXJpYS1wcmVzc2VkIHRvIHRoZSBvcHBvc2l0ZSBzdGF0ZVxuXHRcdFx0XHQkZWwuYXR0ciggJ2FyaWEtcHJlc3NlZCcsICEgcHJlc3NlZCApO1xuXG5cdFx0XHRcdGNvbnN0ICRsaXN0V3JhcHBlciA9ICRlbC5jbG9zZXN0KCAnLndjYXBmLWxpc3Qtd3JhcHBlcicgKTtcblxuXHRcdFx0XHRpZiAoIHByZXNzZWQgKSB7XG5cdFx0XHRcdFx0JGxpc3RXcmFwcGVyLnJlbW92ZUNsYXNzKCAnc2hvdy1oaWRkZW4tb3B0aW9ucycgKTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHQkbGlzdFdyYXBwZXIuYWRkQ2xhc3MoICdzaG93LWhpZGRlbi1vcHRpb25zJyApO1xuXHRcdFx0XHR9XG5cdFx0XHR9O1xuXG5cdFx0XHQkYm9keVxuXHRcdFx0XHQub24oICdjbGljaycsICcud2NhcGYtc29mdC1saW1pdC10cmlnZ2VyJywgZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0dG9nZ2xlRmlsdGVyT3B0aW9ucyggJCggdGhpcyApICk7XG5cdFx0XHRcdH0gKVxuXHRcdFx0XHQub24oICdrZXlkb3duJywgJy53Y2FwZi1zb2Z0LWxpbWl0LXRyaWdnZXInLCBmdW5jdGlvbiggZSApIHtcblx0XHRcdFx0XHRpZiAoIGUua2V5ID09PSAnICcgfHwgZS5rZXkgPT09ICdFbnRlcicgfHwgZS5rZXkgPT09ICdTcGFjZWJhcicgKSB7XG5cdFx0XHRcdFx0XHQvLyBQcmV2ZW50IHRoZSBkZWZhdWx0IGFjdGlvbiB0byBzdG9wIHNjcm9sbGluZyB3aGVuIHNwYWNlIGlzIHByZXNzZWRcblx0XHRcdFx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcblxuXHRcdFx0XHRcdFx0dG9nZ2xlRmlsdGVyT3B0aW9ucyggJCggdGhpcyApICk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9ICk7XG5cdFx0fSxcblx0XHRoYW5kbGVTZWFyY2hGaWx0ZXJPcHRpb25zOiBmdW5jdGlvbigpIHtcblxuXHRcdH0sXG5cdFx0dXBkYXRlUHJvZHVjdHNDb3VudFJlc3VsdDogZnVuY3Rpb24oICRyZXNwb25zZSApIHtcblx0XHRcdGNvbnN0ICRjb250YWluZXIgPSAkKCB3Y2FwZl9wYXJhbXMuc2hvcF9sb29wX2NvbnRhaW5lciApO1xuXHRcdFx0Y29uc3Qgc2VsZWN0b3IgICA9ICcud29vY29tbWVyY2UtcmVzdWx0LWNvdW50Jztcblx0XHRcdGNvbnN0IG5ld0NvdW50ICAgPSAkcmVzcG9uc2UuZmluZCggc2VsZWN0b3IgKS5odG1sKCk7XG5cblx0XHRcdCRib2R5LmZpbmQoIHNlbGVjdG9yICkuZWFjaCggZnVuY3Rpb24oKSB7XG5cdFx0XHRcdGNvbnN0ICRlbCA9ICQoIHRoaXMgKTtcblxuXHRcdFx0XHRpZiAoICEgJGNvbnRhaW5lci5oYXMoICRlbCApLmxlbmd0aCApIHtcblx0XHRcdFx0XHQkZWwuaHRtbCggbmV3Q291bnQgKTtcblx0XHRcdFx0fVxuXHRcdFx0fSApO1xuXHRcdH0sXG5cdFx0c2hvd0xvYWRpbmdBbmltYXRpb246IGZ1bmN0aW9uKCkge1xuXHRcdFx0aWYgKCAhIHdjYXBmX3BhcmFtcy5sb2FkaW5nX2FuaW1hdGlvbiApIHtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXG5cdFx0XHQkLkxvYWRpbmdPdmVybGF5KCAnc2hvdycsIHdjYXBmX3BhcmFtcy5sb2FkaW5nX292ZXJsYXlfb3B0aW9ucyApO1xuXHRcdH0sXG5cdFx0cmVzZXRMb2FkaW5nQW5pbWF0aW9uOiBmdW5jdGlvbigpIHtcblx0XHRcdGlmICggISB3Y2FwZl9wYXJhbXMubG9hZGluZ19hbmltYXRpb24gKSB7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblxuXHRcdFx0JC5Mb2FkaW5nT3ZlcmxheSggJ2hpZGUnICk7XG5cdFx0fSxcblx0XHRzY3JvbGxUbzogZnVuY3Rpb24oKSB7XG5cdFx0XHRpZiAoICdub25lJyA9PT0gd2NhcGZfcGFyYW1zLnNjcm9sbF93aW5kb3cgKSB7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblxuXHRcdFx0Y29uc3Qgc2Nyb2xsRm9yID0gd2NhcGZfcGFyYW1zLnNjcm9sbF93aW5kb3dfZm9yO1xuXHRcdFx0Y29uc3QgaXNNb2JpbGUgID0gd2NhcGZfcGFyYW1zLmlzX21vYmlsZTtcblx0XHRcdGxldCBwcm9jZWVkICAgICA9IGZhbHNlO1xuXG5cdFx0XHRpZiAoICdtb2JpbGUnID09PSBzY3JvbGxGb3IgJiYgaXNNb2JpbGUgKSB7XG5cdFx0XHRcdHByb2NlZWQgPSB0cnVlO1xuXHRcdFx0fSBlbHNlIGlmICggJ2Rlc2t0b3AnID09PSBzY3JvbGxGb3IgJiYgISBpc01vYmlsZSApIHtcblx0XHRcdFx0cHJvY2VlZCA9IHRydWU7XG5cdFx0XHR9IGVsc2UgaWYgKCAnYm90aCcgPT09IHNjcm9sbEZvciApIHtcblx0XHRcdFx0cHJvY2VlZCA9IHRydWU7XG5cdFx0XHR9XG5cblx0XHRcdGlmICggISBwcm9jZWVkICkge1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdGxldCBhZGp1c3RpbmdPZmZzZXQsIG9mZnNldDtcblxuXHRcdFx0aWYgKCB3Y2FwZl9wYXJhbXMuc2Nyb2xsX3RvX3RvcF9vZmZzZXQgKSB7XG5cdFx0XHRcdGFkanVzdGluZ09mZnNldCA9IHBhcnNlSW50KCB3Y2FwZl9wYXJhbXMuc2Nyb2xsX3RvX3RvcF9vZmZzZXQgKTtcblx0XHRcdH1cblxuXHRcdFx0bGV0IGNvbnRhaW5lcjtcblxuXHRcdFx0aWYgKCAkKCB3Y2FwZl9wYXJhbXMuc2hvcF9sb29wX2NvbnRhaW5lciApLmxlbmd0aCApIHtcblx0XHRcdFx0Y29udGFpbmVyID0gd2NhcGZfcGFyYW1zLnNob3BfbG9vcF9jb250YWluZXI7XG5cdFx0XHR9IGVsc2UgaWYgKCAkKCB3Y2FwZl9wYXJhbXMubm90X2ZvdW5kX2NvbnRhaW5lciApLmxlbmd0aCApIHtcblx0XHRcdFx0Y29udGFpbmVyID0gd2NhcGZfcGFyYW1zLm5vdF9mb3VuZF9jb250YWluZXI7XG5cdFx0XHR9XG5cblx0XHRcdGlmICggJ2N1c3RvbScgPT09IHdjYXBmX3BhcmFtcy5zY3JvbGxfd2luZG93ICkge1xuXHRcdFx0XHRjb250YWluZXIgPSB3Y2FwZl9wYXJhbXMuc2Nyb2xsX3dpbmRvd19jdXN0b21fZWxlbWVudDtcblx0XHRcdH1cblxuXHRcdFx0Y29uc3QgJGNvbnRhaW5lciA9ICQoIGNvbnRhaW5lciApO1xuXG5cdFx0XHRpZiAoICRjb250YWluZXIubGVuZ3RoICkge1xuXHRcdFx0XHRvZmZzZXQgPSAkY29udGFpbmVyLm9mZnNldCgpLnRvcCAtIGFkanVzdGluZ09mZnNldDtcblxuXHRcdFx0XHRpZiAoIG9mZnNldCA8IDAgKSB7XG5cdFx0XHRcdFx0b2Zmc2V0ID0gMDtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdCQoICdodG1sLCBib2R5JyApLnN0b3AoKS5hbmltYXRlKFxuXHRcdFx0XHRcdHsgc2Nyb2xsVG9wOiBvZmZzZXQgfSxcblx0XHRcdFx0XHR3Y2FwZl9wYXJhbXMuc2Nyb2xsX3RvX3RvcF9zcGVlZCxcblx0XHRcdFx0XHR3Y2FwZl9wYXJhbXMuc2Nyb2xsX3RvX3RvcF9lYXNpbmdcblx0XHRcdFx0KTtcblx0XHRcdH1cblx0XHR9LFxuXHRcdC8vIFRoaW5ncyBhcmUgZG9uZSBiZWZvcmUgZmV0Y2hpbmcgdGhlIHByb2R1Y3RzIGxpa2Ugc2hvd2luZyB0aGUgbG9hZGluZyBpbmRpY2F0b3IuXG5cdFx0YmVmb3JlRmV0Y2hpbmdQcm9kdWN0czogZnVuY3Rpb24oKSB7XG5cdFx0XHQvLyBUcmFjayB0aGUgY3VycmVudCBlbGVtZW50IGZvY3VzLlxuXHRcdFx0Zm9jdXNlZEVsbSA9IGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQ7XG5cblx0XHRcdFdDQVBGLnNob3dMb2FkaW5nQW5pbWF0aW9uKCk7XG5cblx0XHRcdGlmICggJ2ltbWVkaWF0ZWx5JyA9PT0gd2NhcGZfcGFyYW1zLnNjcm9sbF93aW5kb3dfd2hlbiApIHtcblx0XHRcdFx0V0NBUEYuc2Nyb2xsVG8oKTtcblx0XHRcdH1cblxuXHRcdFx0JGJvZHkudHJpZ2dlciggJ3djYXBmX2JlZm9yZV9mZXRjaGluZ19wcm9kdWN0cycgKTtcblx0XHR9LFxuXHRcdC8vIFRoaW5ncyBhcmUgZG9uZSBiZWZvcmUgdXBkYXRpbmcgdGhlIHByb2R1Y3RzIGxpa2UgaGlkaW5nIHRoZSBsb2FkaW5nIGluZGljYXRvci5cblx0XHRiZWZvcmVVcGRhdGluZ1Byb2R1Y3RzOiBmdW5jdGlvbiggJHJlc3BvbnNlICkge1xuXHRcdFx0V0NBUEYucmVzZXRMb2FkaW5nQW5pbWF0aW9uKCk7XG5cblx0XHRcdCRib2R5LnRyaWdnZXIoICd3Y2FwZl9iZWZvcmVfdXBkYXRpbmdfcHJvZHVjdHMnLCBbICRyZXNwb25zZSBdICk7XG5cdFx0fSxcblx0XHRhZnRlclVwZGF0aW5nUHJvZHVjdHM6IGZ1bmN0aW9uKCAkcmVzcG9uc2UgKSB7XG5cdFx0XHRXQ0FQRi51cGRhdGVQcm9kdWN0c0NvdW50UmVzdWx0KCAkcmVzcG9uc2UgKTtcblxuXHRcdFx0Ly8gUmVzdG9yZSB0aGUgZm9jdXMuXG5cdFx0XHQvLyBNYXliZSByZXN0b3JpbmcgdGhlIGZvY3VzIGluIG1vYmlsZSBkZXZpY2UgaXNuJ3QgZ29vZC5cblx0XHRcdGlmICggd2NhcGZfcGFyYW1zLnJlc3RvcmVfZm9jdXNfYWZ0ZXJfZmlsdGVyaW5nICYmICEgd2NhcGZfcGFyYW1zLmlzX21vYmlsZSApIHtcblx0XHRcdFx0aWYgKCBkb2N1bWVudC5ib2R5ICE9PSBmb2N1c2VkRWxtICkge1xuXHRcdFx0XHRcdGlmICggZm9jdXNlZEVsbS5pZCApIHtcblx0XHRcdFx0XHRcdCQoIGAjJHsgZm9jdXNlZEVsbS5pZCB9YCApLmZvY3VzKCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHRcdC8vIFJlaW5pdGlhbGl6ZSB3Y2FwZi5cblx0XHRcdFdDQVBGLmluaXQoKTtcblxuXHRcdFx0aWYgKCAnYWZ0ZXInID09PSB3Y2FwZl9wYXJhbXMuc2Nyb2xsX3dpbmRvd193aGVuICkge1xuXHRcdFx0XHRXQ0FQRi5zY3JvbGxUbygpO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBUcmlnZ2VyIHRoZSBkb2N1bWVudCByZWFkeSBldmVudC5cblx0XHRcdCQoIGRvY3VtZW50ICkudHJpZ2dlciggJ3JlYWR5JyApO1xuXG5cdFx0XHQkYm9keS50cmlnZ2VyKCAnd2NhcGZfYWZ0ZXJfdXBkYXRpbmdfcHJvZHVjdHMnLCBbICRyZXNwb25zZSBdICk7XG5cdFx0fSxcblx0XHRmaWx0ZXJQcm9kdWN0czogZnVuY3Rpb24oKSB7XG5cdFx0XHRXQ0FQRi5iZWZvcmVGZXRjaGluZ1Byb2R1Y3RzKCk7XG5cblx0XHRcdCQuYWpheCgge1xuXHRcdFx0XHR1cmw6IHdpbmRvdy5sb2NhdGlvbi5ocmVmLFxuXHRcdFx0XHRzdWNjZXNzOiBmdW5jdGlvbiggcmVzcG9uc2UgKSB7XG5cdFx0XHRcdFx0Y29uc3QgJHJlc3BvbnNlID0gJCggcmVzcG9uc2UgKTtcblxuXHRcdFx0XHRcdFdDQVBGLmJlZm9yZVVwZGF0aW5nUHJvZHVjdHMoICRyZXNwb25zZSApO1xuXG5cdFx0XHRcdFx0LyoqXG5cdFx0XHRcdFx0ICogVXBkYXRlIGRvY3VtZW50IHRpdGxlLlxuXHRcdFx0XHRcdCAqXG5cdFx0XHRcdFx0ICogQHNvdXJjZSBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL2EvNzU5OTU2MlxuXHRcdFx0XHRcdCAqL1xuXHRcdFx0XHRcdGRvY3VtZW50LnRpdGxlID0gJHJlc3BvbnNlLmZpbHRlciggJ3RpdGxlJyApLnRleHQoKTtcblxuXHRcdFx0XHRcdC8vIFVwZGF0ZSB0aGUgaW5zdGFuY2VzLlxuXHRcdFx0XHRcdGZvciAoIGNvbnN0IGlkIG9mIGluc3RhbmNlSWRzICkge1xuXHRcdFx0XHRcdFx0Y29uc3QgaW5zdGFuY2VJZCAgICAgPSAnW2RhdGEtaWQ9XCInICsgaWQgKyAnXCJdJztcblx0XHRcdFx0XHRcdGNvbnN0ICRpbnN0YW5jZSAgICAgID0gJCggaW5zdGFuY2VJZCApO1xuXHRcdFx0XHRcdFx0Y29uc3QgJGlubmVyICAgICAgICAgPSAkaW5zdGFuY2UuZmluZCggJy53Y2FwZi1maWx0ZXItaW5uZXInICk7XG5cdFx0XHRcdFx0XHRjb25zdCBfaW5zdGFuY2UgICAgICA9ICRyZXNwb25zZS5maW5kKCBpbnN0YW5jZUlkICk7XG5cdFx0XHRcdFx0XHRsZXQgX2luc3RhbmNlQ2xhc3NlcyA9ICQoIF9pbnN0YW5jZSApLmF0dHIoICdjbGFzcycgKTtcblxuXHRcdFx0XHRcdFx0Ly8gUHJlc2VydmUgaGllcmFyY2h5IGFjY29yZGlvbiBzdGF0ZS5cblx0XHRcdFx0XHRcdGlmICggd2NhcGZfcGFyYW1zLnByZXNlcnZlX2hpZXJhcmNoeV9hY2NvcmRpb25fc3RhdGUgKSB7XG5cdFx0XHRcdFx0XHRcdGlmICggJGluc3RhbmNlLmhhc0NsYXNzKCAnaGFzLWhpZXJhcmNoeS1hY2NvcmRpb24nICkgKSB7XG5cdFx0XHRcdFx0XHRcdFx0JGluc3RhbmNlLmZpbmQoICcud2NhcGYtaGllcmFyY2h5LWFjY29yZGlvbi10b2dnbGUnICkuZWFjaCggZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRjb25zdCAkZWwgPSAkKCB0aGlzICk7XG5cdFx0XHRcdFx0XHRcdFx0XHRjb25zdCBpZCAgPSAkZWwuZGF0YSggJ2lkJyApO1xuXG5cdFx0XHRcdFx0XHRcdFx0XHRjb25zdCB0b2dnbGVTZWxlY3RvciA9IGAud2NhcGYtaGllcmFyY2h5LWFjY29yZGlvbi10b2dnbGVbZGF0YS1pZD1cIiR7IGlkIH1cIl1gO1xuXG5cdFx0XHRcdFx0XHRcdFx0XHQvLyBDaGVjayB0byBzZWUgaWYgdGhlIGFjY29yZGlvbiBpcyBvcGVuZWRcblx0XHRcdFx0XHRcdFx0XHRcdGNvbnN0IHByZXNzZWQgPSAkZWwuYXR0ciggJ2FyaWEtcHJlc3NlZCcgKSA9PT0gJ3RydWUnO1xuXG5cdFx0XHRcdFx0XHRcdFx0XHRpZiAoIHByZXNzZWQgKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdF9pbnN0YW5jZS5maW5kKCB0b2dnbGVTZWxlY3RvciApLmF0dHIoICdhcmlhLXByZXNzZWQnLCAndHJ1ZScgKTtcblx0XHRcdFx0XHRcdFx0XHRcdFx0X2luc3RhbmNlLmZpbmQoIHRvZ2dsZVNlbGVjdG9yICkuY2xvc2VzdCggJ2xpJyApLmNoaWxkcmVuKCAndWwnICkuc2hvdygpO1xuXHRcdFx0XHRcdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0X2luc3RhbmNlLmZpbmQoIHRvZ2dsZVNlbGVjdG9yICkuYXR0ciggJ2FyaWEtcHJlc3NlZCcsICdmYWxzZScgKTtcblx0XHRcdFx0XHRcdFx0XHRcdFx0X2luc3RhbmNlLmZpbmQoIHRvZ2dsZVNlbGVjdG9yICkuY2xvc2VzdCggJ2xpJyApLmNoaWxkcmVuKCAndWwnICkuaGlkZSgpO1xuXHRcdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdH0gKTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHQvLyBQcmVzZXJ2ZSBzb2Z0IGxpbWl0IHN0YXRlLlxuXHRcdFx0XHRcdFx0aWYgKCB3Y2FwZl9wYXJhbXMucHJlc2VydmVfc29mdF9saW1pdF9zdGF0ZSApIHtcblx0XHRcdFx0XHRcdFx0aWYgKCAkaW5zdGFuY2UuaGFzQ2xhc3MoICdoYXMtc29mdC1saW1pdCcgKSApIHtcblx0XHRcdFx0XHRcdFx0XHRjb25zdCAkbGlzdFdyYXBwZXIgPSAkaW5zdGFuY2UuZmluZCggJy53Y2FwZi1saXN0LXdyYXBwZXInICk7XG5cblx0XHRcdFx0XHRcdFx0XHRpZiAoICRsaXN0V3JhcHBlci5oYXNDbGFzcyggJ3Nob3ctaGlkZGVuLW9wdGlvbnMnICkgKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRfaW5zdGFuY2UuZmluZCggJy53Y2FwZi1saXN0LXdyYXBwZXInICkuYWRkQ2xhc3MoICdzaG93LWhpZGRlbi1vcHRpb25zJyApO1xuXHRcdFx0XHRcdFx0XHRcdFx0X2luc3RhbmNlLmZpbmQoICcud2NhcGYtc29mdC1saW1pdC10cmlnZ2VyJyApLmF0dHIoICdhcmlhLXByZXNzZWQnLCAndHJ1ZScgKTtcblx0XHRcdFx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0XHRcdFx0X2luc3RhbmNlLmZpbmQoICcud2NhcGYtbGlzdC13cmFwcGVyJyApLnJlbW92ZUNsYXNzKCAnc2hvdy1oaWRkZW4tb3B0aW9ucycgKTtcblx0XHRcdFx0XHRcdFx0XHRcdF9pbnN0YW5jZS5maW5kKCAnLndjYXBmLXNvZnQtbGltaXQtdHJpZ2dlcicgKS5hdHRyKCAnYXJpYS1wcmVzc2VkJywgJ2ZhbHNlJyApO1xuXHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHQvLyBVcGRhdGUgdGhlIGluc3RhbmNlIGNsYXNzZXMuXG5cdFx0XHRcdFx0XHQkaW5zdGFuY2UuYXR0ciggJ2NsYXNzJywgX2luc3RhbmNlQ2xhc3Nlcy50cmltKCkgKTtcblxuXHRcdFx0XHRcdFx0Y29uc3QgX2h0bWwgPSBfaW5zdGFuY2UuZmluZCggJy53Y2FwZi1maWx0ZXItaW5uZXInICkuaHRtbCgpO1xuXG5cdFx0XHRcdFx0XHQvLyBGaW5hbGx5IHVwZGF0ZSB0aGUgaW5zdGFuY2UuXG5cdFx0XHRcdFx0XHQkaW5uZXIuaHRtbCggX2h0bWwgKTtcblxuXHRcdFx0XHRcdFx0JGluc3RhbmNlLnRyaWdnZXIoICd3Y2FwZi1maWx0ZXItdXBkYXRlZCcsIFsgX2luc3RhbmNlIF0gKTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHQvLyBSZXBsYWNlIG9sZCBzaG9wIGxvb3Agd2l0aCBuZXcgb25lLlxuXHRcdFx0XHRcdGNvbnN0ICRzaG9wTG9vcENvbnRhaW5lciA9ICRyZXNwb25zZS5maW5kKCB3Y2FwZl9wYXJhbXMuc2hvcF9sb29wX2NvbnRhaW5lciApO1xuXHRcdFx0XHRcdGNvbnN0ICRub3RGb3VuZENvbnRhaW5lciA9ICRyZXNwb25zZS5maW5kKCB3Y2FwZl9wYXJhbXMubm90X2ZvdW5kX2NvbnRhaW5lciApO1xuXG5cdFx0XHRcdFx0aWYgKCB3Y2FwZl9wYXJhbXMuc2hvcF9sb29wX2NvbnRhaW5lciA9PT0gd2NhcGZfcGFyYW1zLm5vdF9mb3VuZF9jb250YWluZXIgKSB7XG5cdFx0XHRcdFx0XHQkKCB3Y2FwZl9wYXJhbXMuc2hvcF9sb29wX2NvbnRhaW5lciApLmh0bWwoICRzaG9wTG9vcENvbnRhaW5lci5odG1sKCkgKTtcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0aWYgKCAkKCB3Y2FwZl9wYXJhbXMubm90X2ZvdW5kX2NvbnRhaW5lciApLmxlbmd0aCApIHtcblx0XHRcdFx0XHRcdFx0aWYgKCAkc2hvcExvb3BDb250YWluZXIubGVuZ3RoICkge1xuXHRcdFx0XHRcdFx0XHRcdCQoIHdjYXBmX3BhcmFtcy5ub3RfZm91bmRfY29udGFpbmVyICkuaHRtbCggJHNob3BMb29wQ29udGFpbmVyLmh0bWwoKSApO1xuXHRcdFx0XHRcdFx0XHR9IGVsc2UgaWYgKCAkbm90Rm91bmRDb250YWluZXIubGVuZ3RoICkge1xuXHRcdFx0XHRcdFx0XHRcdCQoIHdjYXBmX3BhcmFtcy5ub3RfZm91bmRfY29udGFpbmVyICkuaHRtbCggJG5vdEZvdW5kQ29udGFpbmVyLmh0bWwoKSApO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9IGVsc2UgaWYgKCAkKCB3Y2FwZl9wYXJhbXMuc2hvcF9sb29wX2NvbnRhaW5lciApLmxlbmd0aCApIHtcblx0XHRcdFx0XHRcdFx0aWYgKCAkc2hvcExvb3BDb250YWluZXIubGVuZ3RoICkge1xuXHRcdFx0XHRcdFx0XHRcdCQoIHdjYXBmX3BhcmFtcy5zaG9wX2xvb3BfY29udGFpbmVyICkuaHRtbCggJHNob3BMb29wQ29udGFpbmVyLmh0bWwoKSApO1xuXHRcdFx0XHRcdFx0XHR9IGVsc2UgaWYgKCAkbm90Rm91bmRDb250YWluZXIubGVuZ3RoICkge1xuXHRcdFx0XHRcdFx0XHRcdCQoIHdjYXBmX3BhcmFtcy5zaG9wX2xvb3BfY29udGFpbmVyICkuaHRtbCggJG5vdEZvdW5kQ29udGFpbmVyLmh0bWwoKSApO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0V0NBUEYuYWZ0ZXJVcGRhdGluZ1Byb2R1Y3RzKCAkcmVzcG9uc2UgKTtcblx0XHRcdFx0fVxuXHRcdFx0fSApO1xuXHRcdH0sXG5cdFx0cmVxdWVzdEZpbHRlcjogZnVuY3Rpb24oIHVybCApIHtcblx0XHRcdGlmICggISB1cmwgKSB7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblxuXHRcdFx0Y29uc3QgaG9zdG5hbWUgPSBsb2NhdGlvbi5ob3N0bmFtZTtcblxuXHRcdFx0Ly8gVE9ETzogUmVtb3ZlIGZyb20gcHJvZHVjdGlvbiBidWlsZC5cblx0XHRcdGlmICggJ2xvY2FsaG9zdCcgPT09IGhvc3RuYW1lICkge1xuXHRcdFx0XHR1cmwgPSB1cmwucmVwbGFjZSggJ2h0dHA6Ly93Y2ZpbHRlci0yLnRlc3QnLCAnLy9sb2NhbGhvc3Q6MzAwMScgKTtcblx0XHRcdH1cblxuXHRcdFx0Ly8gd2luZG93LmxvY2F0aW9uLmhyZWYgPSB1cmw7XG5cblx0XHRcdGhpc3RvcnkucHVzaFN0YXRlKCB7fSwgJycsIHVybCApO1xuXG5cdFx0XHRXQ0FQRi5maWx0ZXJQcm9kdWN0cygpO1xuXHRcdH0sXG5cdFx0aGFuZGxlTnVtYmVySW5wdXRGaWx0ZXJzOiBmdW5jdGlvbigpIHtcblx0XHRcdGNvbnN0IHJhbmdlTnVtYmVyU2VsZWN0b3JzID0gJy53Y2FwZi1yYW5nZS1udW1iZXIgLm1pbi12YWx1ZSwgLndjYXBmLXJhbmdlLW51bWJlciAubWF4LXZhbHVlJztcblxuXHRcdFx0JGJvZHkub24oICdpbnB1dCcsIHJhbmdlTnVtYmVyU2VsZWN0b3JzLCBmdW5jdGlvbigpIHtcblx0XHRcdFx0Y29uc3QgJGl0ZW0gPSAkKCB0aGlzICk7XG5cblx0XHRcdFx0Y29uc3QgJHJhbmdlTnVtYmVyICAgICAgPSAkaXRlbS5jbG9zZXN0KCAnLndjYXBmLXJhbmdlLW51bWJlcicgKTtcblx0XHRcdFx0Y29uc3QgZm9ybWF0TnVtYmVycyAgICAgPSAkcmFuZ2VOdW1iZXIuYXR0ciggJ2RhdGEtZm9ybWF0LW51bWJlcnMnICk7XG5cdFx0XHRcdGNvbnN0IHJhbmdlTWluVmFsdWUgICAgID0gcGFyc2VGbG9hdCggJHJhbmdlTnVtYmVyLmF0dHIoICdkYXRhLXJhbmdlLW1pbi12YWx1ZScgKSApO1xuXHRcdFx0XHRjb25zdCByYW5nZU1heFZhbHVlICAgICA9IHBhcnNlRmxvYXQoICRyYW5nZU51bWJlci5hdHRyKCAnZGF0YS1yYW5nZS1tYXgtdmFsdWUnICkgKTtcblx0XHRcdFx0Y29uc3Qgb2xkTWluVmFsdWUgICAgICAgPSBwYXJzZUZsb2F0KCAkcmFuZ2VOdW1iZXIuYXR0ciggJ2RhdGEtbWluLXZhbHVlJyApICk7XG5cdFx0XHRcdGNvbnN0IG9sZE1heFZhbHVlICAgICAgID0gcGFyc2VGbG9hdCggJHJhbmdlTnVtYmVyLmF0dHIoICdkYXRhLW1heC12YWx1ZScgKSApO1xuXHRcdFx0XHRjb25zdCBkZWNpbWFsUGxhY2VzICAgICA9ICRyYW5nZU51bWJlci5hdHRyKCAnZGF0YS1kZWNpbWFsLXBsYWNlcycgKTtcblx0XHRcdFx0Y29uc3QgdGhvdXNhbmRTZXBhcmF0b3IgPSAkcmFuZ2VOdW1iZXIuYXR0ciggJ2RhdGEtdGhvdXNhbmQtc2VwYXJhdG9yJyApO1xuXHRcdFx0XHRjb25zdCBkZWNpbWFsU2VwYXJhdG9yICA9ICRyYW5nZU51bWJlci5hdHRyKCAnZGF0YS1kZWNpbWFsLXNlcGFyYXRvcicgKTtcblxuXHRcdFx0XHQvLyBDbGVhciBhbnkgcHJldmlvdXNseSBzZXQgdGltZXIgYmVmb3JlIHNldHRpbmcgYSBmcmVzaCBvbmVcblx0XHRcdFx0Y2xlYXJUaW1lb3V0KCAkaXRlbS5kYXRhKCAndGltZXInICkgKTtcblxuXHRcdFx0XHRjb25zdCBnZXRWYWx1ZSA9ICggZmxvYXRWYWx1ZSApID0+IHtcblx0XHRcdFx0XHRpZiAoIGZvcm1hdE51bWJlcnMgKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gbnVtYmVyRm9ybWF0KCBmbG9hdFZhbHVlLCBkZWNpbWFsUGxhY2VzLCBkZWNpbWFsU2VwYXJhdG9yLCB0aG91c2FuZFNlcGFyYXRvciApO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdHJldHVybiBmbG9hdFZhbHVlO1xuXHRcdFx0XHR9O1xuXG5cdFx0XHRcdCRpdGVtLmRhdGEoICd0aW1lcicsIHNldFRpbWVvdXQoIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdCRpdGVtLnJlbW92ZURhdGEoICd0aW1lcicgKTtcblxuXHRcdFx0XHRcdGxldCBtaW5WYWx1ZSA9IHBhcnNlRmxvYXQoICRyYW5nZU51bWJlci5maW5kKCAnLm1pbi12YWx1ZScgKS52YWwoKSApO1xuXHRcdFx0XHRcdGxldCBtYXhWYWx1ZSA9IHBhcnNlRmxvYXQoICRyYW5nZU51bWJlci5maW5kKCAnLm1heC12YWx1ZScgKS52YWwoKSApO1xuXG5cdFx0XHRcdFx0Ly8gRm9yY2UgdGhlIG1pblZhbHVlIG5vdCB0byBiZSBlbXB0eS5cblx0XHRcdFx0XHRpZiAoIGlzTmFOKCBtaW5WYWx1ZSApICkge1xuXHRcdFx0XHRcdFx0bWluVmFsdWUgPSByYW5nZU1pblZhbHVlO1xuXG5cdFx0XHRcdFx0XHQkcmFuZ2VOdW1iZXIuZmluZCggJy5taW4tdmFsdWUnICkudmFsKCBnZXRWYWx1ZSggbWluVmFsdWUgKSApO1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHQkcmFuZ2VOdW1iZXIuZmluZCggJy5taW4tdmFsdWUnICkudmFsKCBnZXRWYWx1ZSggbWluVmFsdWUgKSApO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdC8vIEZvcmNlIHRoZSBtYXhWYWx1ZSBub3QgdG8gYmUgZW1wdHkuXG5cdFx0XHRcdFx0aWYgKCBpc05hTiggbWF4VmFsdWUgKSApIHtcblx0XHRcdFx0XHRcdG1heFZhbHVlID0gcmFuZ2VNYXhWYWx1ZTtcblxuXHRcdFx0XHRcdFx0JHJhbmdlTnVtYmVyLmZpbmQoICcubWF4LXZhbHVlJyApLnZhbCggZ2V0VmFsdWUoIG1heFZhbHVlICkgKTtcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0JHJhbmdlTnVtYmVyLmZpbmQoICcubWF4LXZhbHVlJyApLnZhbCggZ2V0VmFsdWUoIG1heFZhbHVlICkgKTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHQvLyBGb3JjZSB0aGUgbWluVmFsdWUgbm90IHRvIGdvIGJlbG93IHRoZSByYW5nZU1pblZhbHVlLlxuXHRcdFx0XHRcdGlmICggbWluVmFsdWUgPCByYW5nZU1pblZhbHVlICkge1xuXHRcdFx0XHRcdFx0bWluVmFsdWUgPSByYW5nZU1pblZhbHVlO1xuXG5cdFx0XHRcdFx0XHQkcmFuZ2VOdW1iZXIuZmluZCggJy5taW4tdmFsdWUnICkudmFsKCBnZXRWYWx1ZSggbWluVmFsdWUgKSApO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdC8vIEZvcmNlIHRoZSBtaW5WYWx1ZSBub3QgdG8gZ28gdXAgdGhlIHJhbmdlTWF4VmFsdWUuXG5cdFx0XHRcdFx0aWYgKCBtaW5WYWx1ZSA+IHJhbmdlTWF4VmFsdWUgKSB7XG5cdFx0XHRcdFx0XHRtaW5WYWx1ZSA9IHJhbmdlTWF4VmFsdWU7XG5cblx0XHRcdFx0XHRcdCRyYW5nZU51bWJlci5maW5kKCAnLm1pbi12YWx1ZScgKS52YWwoIGdldFZhbHVlKCBtaW5WYWx1ZSApICk7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0Ly8gRm9yY2UgdGhlIG1heFZhbHVlIG5vdCB0byBnbyB1cCB0aGUgcmFuZ2VNYXhWYWx1ZS5cblx0XHRcdFx0XHRpZiAoIG1heFZhbHVlID4gcmFuZ2VNYXhWYWx1ZSApIHtcblx0XHRcdFx0XHRcdG1heFZhbHVlID0gcmFuZ2VNYXhWYWx1ZTtcblxuXHRcdFx0XHRcdFx0JHJhbmdlTnVtYmVyLmZpbmQoICcubWF4LXZhbHVlJyApLnZhbCggZ2V0VmFsdWUoIG1heFZhbHVlICkgKTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHQvLyBGb3JjZSB0aGUgbWF4VmFsdWUgbm90IHRvIGdvIGJlbG93IHRoZSBtaW5WYWx1ZS5cblx0XHRcdFx0XHRpZiAoIG1pblZhbHVlID4gbWF4VmFsdWUgKSB7XG5cdFx0XHRcdFx0XHRtYXhWYWx1ZSA9IG1pblZhbHVlO1xuXG5cdFx0XHRcdFx0XHQkcmFuZ2VOdW1iZXIuZmluZCggJy5tYXgtdmFsdWUnICkudmFsKCBnZXRWYWx1ZSggbWF4VmFsdWUgKSApO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdC8vIElmIHZhbHVlIGlzIG5vdCBjaGFuZ2VkIHRoZW4gZG9uJ3QgcHJvY2VlZC5cblx0XHRcdFx0XHRpZiAoIG1pblZhbHVlID09PSBvbGRNaW5WYWx1ZSAmJiBtYXhWYWx1ZSA9PT0gb2xkTWF4VmFsdWUgKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0aWYgKCBtaW5WYWx1ZSA9PT0gcmFuZ2VNaW5WYWx1ZSAmJiBtYXhWYWx1ZSA9PT0gcmFuZ2VNYXhWYWx1ZSApIHtcblx0XHRcdFx0XHRcdC8vIFJlbW92ZSByYW5nZSBmaWx0ZXIuXG5cdFx0XHRcdFx0XHRXQ0FQRi5yZXF1ZXN0RmlsdGVyKCAkcmFuZ2VOdW1iZXIuZGF0YSggJ2NsZWFyLWZpbHRlci11cmwnICkgKTtcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0Ly8gQWRkIHJhbmdlIGZpbHRlci5cblx0XHRcdFx0XHRcdGNvbnN0IHVybCA9ICRyYW5nZU51bWJlci5kYXRhKCAndXJsJyApLnJlcGxhY2UoICclMXMnLCBtaW5WYWx1ZSApLnJlcGxhY2UoICclMnMnLCBtYXhWYWx1ZSApO1xuXHRcdFx0XHRcdFx0V0NBUEYucmVxdWVzdEZpbHRlciggdXJsICk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9LCBkZWxheSApICk7XG5cdFx0XHR9ICk7XG5cdFx0fSxcblx0XHRoYW5kbGVMaXN0RmlsdGVyczogZnVuY3Rpb24oKSB7XG5cdFx0XHRjb25zdCBuYXRpdmVJbnB1dHMgPSAnLmxpc3QtdHlwZS1uYXRpdmUgW3R5cGU9XCJjaGVja2JveFwiXSwnICtcblx0XHRcdFx0Jy5saXN0LXR5cGUtbmF0aXZlIFt0eXBlPVwicmFkaW9cIl0sJyArXG5cdFx0XHRcdCcubGlzdC10eXBlLWN1c3RvbS1jaGVja2JveCBbdHlwZT1cImNoZWNrYm94XCJdJztcblxuXHRcdFx0JGJvZHkub24oICdjaGFuZ2UnLCBuYXRpdmVJbnB1dHMsIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRXQ0FQRi5yZXF1ZXN0RmlsdGVyKCAkKCB0aGlzICkuZGF0YSggJ3VybCcgKSApO1xuXHRcdFx0fSApO1xuXG5cdFx0XHRjb25zdCBjdXN0b21SYWRpb1NlbGVjdG9yID0gJy5saXN0LXR5cGUtY3VzdG9tLXJhZGlvJztcblxuXHRcdFx0JGJvZHkub24oICdjaGFuZ2UnLCBjdXN0b21SYWRpb1NlbGVjdG9yICsgJyBbdHlwZT1cImNoZWNrYm94XCJdJywgZnVuY3Rpb24oKSB7XG5cdFx0XHRcdC8vIGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vYS81ODM5OTI0XG5cdFx0XHRcdCQoIHRoaXMgKVxuXHRcdFx0XHRcdC5jbG9zZXN0KCBjdXN0b21SYWRpb1NlbGVjdG9yIClcblx0XHRcdFx0XHQuZmluZCggJ1t0eXBlPVwiY2hlY2tib3hcIl0nICkubm90KCB0aGlzIClcblx0XHRcdFx0XHQucHJvcCggJ2NoZWNrZWQnLCBmYWxzZSApO1xuXG5cdFx0XHRcdFdDQVBGLnJlcXVlc3RGaWx0ZXIoICQoIHRoaXMgKS5kYXRhKCAndXJsJyApICk7XG5cdFx0XHR9ICk7XG5cdFx0fSxcblx0XHRoYW5kbGVEcm9wZG93bkZpbHRlcnM6IGZ1bmN0aW9uKCkge1xuXHRcdFx0JGJvZHkub24oICdjaGFuZ2UnLCAnLndjYXBmLWRyb3Bkb3duLXdyYXBwZXIgc2VsZWN0JywgZnVuY3Rpb24oKSB7XG5cdFx0XHRcdGNvbnN0ICRzZWxlY3QgICAgICAgID0gJCggdGhpcyApO1xuXHRcdFx0XHRjb25zdCB2YWx1ZXMgICAgICAgICA9ICRzZWxlY3QudmFsKCk7XG5cdFx0XHRcdGNvbnN0IGZpbHRlclVSTCAgICAgID0gJHNlbGVjdC5kYXRhKCAndXJsJyApO1xuXHRcdFx0XHRjb25zdCBjbGVhckZpbHRlclVSTCA9ICRzZWxlY3QuZGF0YSggJ2NsZWFyLWZpbHRlci11cmwnICk7XG5cdFx0XHRcdGxldCB1cmw7XG5cblx0XHRcdFx0aWYgKCB2YWx1ZXMubGVuZ3RoICkge1xuXHRcdFx0XHRcdHVybCA9IGZpbHRlclVSTC5yZXBsYWNlKCAnJXMnLCB2YWx1ZXMudG9TdHJpbmcoKSApO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdHVybCA9IGNsZWFyRmlsdGVyVVJMO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0V0NBUEYucmVxdWVzdEZpbHRlciggdXJsICk7XG5cdFx0XHR9ICk7XG5cdFx0fSxcblx0XHRoYW5kbGVQYWdpbmF0aW9uOiBmdW5jdGlvbigpIHtcblx0XHRcdGlmICggd2NhcGZfcGFyYW1zLmVuYWJsZV9wYWdpbmF0aW9uX3ZpYV9hamF4ICYmIHdjYXBmX3BhcmFtcy5wYWdpbmF0aW9uX2NvbnRhaW5lciApIHtcblx0XHRcdFx0Y29uc3QgJGNvbnRhaW5lciA9ICQoIHdjYXBmX3BhcmFtcy5zaG9wX2xvb3BfY29udGFpbmVyICk7XG5cdFx0XHRcdGNvbnN0IHNlbGVjdG9yICAgPSB3Y2FwZl9wYXJhbXMucGFnaW5hdGlvbl9jb250YWluZXIgKyAnIGEnO1xuXG5cdFx0XHRcdGlmICggJGNvbnRhaW5lci5sZW5ndGggKSB7XG5cdFx0XHRcdFx0JGNvbnRhaW5lci5vbiggJ2NsaWNrJywgc2VsZWN0b3IsIGZ1bmN0aW9uKCBlICkge1xuXHRcdFx0XHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG5cdFx0XHRcdFx0XHRjb25zdCBocmVmID0gJCggdGhpcyApLmF0dHIoICdocmVmJyApO1xuXG5cdFx0XHRcdFx0XHRXQ0FQRi5yZXF1ZXN0RmlsdGVyKCBocmVmICk7XG5cdFx0XHRcdFx0fSApO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fSxcblx0XHRoYW5kbGVEZWZhdWx0T3JkZXJieTogZnVuY3Rpb24oKSB7XG5cdFx0XHRpZiAoICEgd2NhcGZfcGFyYW1zLnNvcnRpbmdfY29udHJvbCApIHtcblx0XHRcdFx0Ly8gU3VibWl0IHRoZSBvcmRlcmJ5IGZvcm0gd2hlbiB2YWx1ZSBpcyBjaGFuZ2VkLlxuXHRcdFx0XHQkYm9keS5vbiggJ2NoYW5nZScsICcud29vY29tbWVyY2Utb3JkZXJpbmcgc2VsZWN0Lm9yZGVyYnknLCBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHQkKCB0aGlzICkuY2xvc2VzdCggJ2Zvcm0nICkudHJpZ2dlciggJ3N1Ym1pdCcgKTtcblx0XHRcdFx0fSApO1xuXG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblxuXHRcdFx0Ly8gUHJldmVudCB0aGUgYXV0byBzdWJtaXNzaW9uIG9mIHRoZSBvcmRlcmJ5IGZvcm0uXG5cdFx0XHQkYm9keS5vbiggJ3N1Ym1pdCcsICcud29vY29tbWVyY2Utb3JkZXJpbmcnLCBmdW5jdGlvbigpIHtcblx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0fSApO1xuXG5cdFx0XHQvLyBIYW5kbGUgdGhlIGZpbHRlciByZXF1ZXN0IHZpYSBhamF4IHdoZW4gdGhlIG9yZGVyYnkgdmFsdWUgaXMgY2hhbmdlZC5cblx0XHRcdCRib2R5Lm9uKCAnY2hhbmdlJywgJy53b29jb21tZXJjZS1vcmRlcmluZyBzZWxlY3Qub3JkZXJieScsIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRjb25zdCBvcmRlciA9ICQoIHRoaXMgKS52YWwoKTtcblxuXHRcdFx0XHRjb25zdCB1cmwgPSBuZXcgVVJMKCB3aW5kb3cubG9jYXRpb24gKTtcblx0XHRcdFx0dXJsLnNlYXJjaFBhcmFtcy5zZXQoICdvcmRlcmJ5Jywgb3JkZXIgKTtcblxuXHRcdFx0XHRXQ0FQRi5yZXF1ZXN0RmlsdGVyKCBnZXRPcmRlckJ5VXJsKCB1cmwuaHJlZiApICk7XG5cblx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0fSApO1xuXHRcdH0sXG5cdFx0aGFuZGxlUmVzZXRBbGxGaWx0ZXJzOiBmdW5jdGlvbigpIHtcblx0XHRcdCRib2R5Lm9uKCAnY2xpY2snLCAnLndjYXBmLXJlc2V0LWZpbHRlcnMtYnRuJywgZnVuY3Rpb24oKSB7XG5cdFx0XHRcdGNvbnNvbGUubG9nKCAncmVzZXQgYWxsIGZpbHRlcnMnICk7XG5cdFx0XHR9ICk7XG5cdFx0fSxcblx0XHRpbml0Q29tYm9ib3g6IGZ1bmN0aW9uKCkge1xuXHRcdFx0aWYgKCAhIGpRdWVyeSgpLmNob3NlbldDQVBGICkge1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdGNvbnN0IG9wdGlvbnMgPSB7XG5cdFx0XHRcdGluaGVyaXRfc2VsZWN0X2NsYXNzZXM6IHRydWUsXG5cdFx0XHRcdGluaGVyaXRfb3B0aW9uX2NsYXNzZXM6IHRydWUsXG5cdFx0XHRcdG5vX3Jlc3VsdHNfdGV4dDogd2NhcGZfcGFyYW1zLmNob3Nlbl9ub19yZXN1bHRzX3RleHQsXG5cdFx0XHRcdG9wdGlvbnNfbm9uZV90ZXh0OiB3Y2FwZl9wYXJhbXMuY2hvc2VuX29wdGlvbnNfbm9uZV90ZXh0LFxuXHRcdFx0fTtcblxuXHRcdFx0aWYgKCB3Y2FwZl9wYXJhbXMuaXNfcnRsICkge1xuXHRcdFx0XHRvcHRpb25zWyAncnRsJyBdID0gdHJ1ZTtcblx0XHRcdH1cblxuXHRcdFx0JGJvZHkuZmluZCggJy53Y2FwZi1jaG9zZW4nICkuZWFjaCggZnVuY3Rpb24oKSB7XG5cdFx0XHRcdGNvbnN0ICR0aGlzID0gJCggdGhpcyApO1xuXG5cdFx0XHRcdC8vIElmIGhpZXJhcmNoeSBlbmFibGVkIHRoZW4gd2Ugc2hvdyB0aGUgc2VsZWN0ZWQgb3B0aW9ucy5cblx0XHRcdFx0aWYgKCAkdGhpcy5oYXNDbGFzcyggJ2hhcy1oaWVyYXJjaHknICkgKSB7XG5cdFx0XHRcdFx0b3B0aW9uc1sgJ2Rpc3BsYXlfc2VsZWN0ZWRfb3B0aW9ucycgXSA9IHRydWU7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0b3B0aW9uc1sgJ2Rpc3BsYXlfc2VsZWN0ZWRfb3B0aW9ucycgXSA9IHdjYXBmX3BhcmFtcy5jaG9zZW5fZGlzcGxheV9zZWxlY3RlZF9vcHRpb25zO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0JHRoaXMuY2hvc2VuV0NBUEYoIG9wdGlvbnMgKTtcblx0XHRcdH0gKTtcblxuXHRcdFx0Ly8gQXR0YWNoIGNob3NlbiBmb3IgZGVmYXVsdCBvcmRlcmJ5LlxuXHRcdFx0aWYgKCB3Y2FwZl9wYXJhbXMuYXR0YWNoX2Nob3Nlbl9vbl9zb3J0aW5nICkge1xuXHRcdFx0XHRsZXQgZGlzYWJsZVNlYXJjaCA9IHRydWU7XG5cblx0XHRcdFx0aWYgKCB3Y2FwZl9wYXJhbXMuc2VhcmNoX2JveF9pbl9kZWZhdWx0X29yZGVyYnkgKSB7XG5cdFx0XHRcdFx0ZGlzYWJsZVNlYXJjaCA9IGZhbHNlO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0b3B0aW9uc1sgJ2Rpc2FibGVfc2VhcmNoJyBdID0gZGlzYWJsZVNlYXJjaDtcblxuXHRcdFx0XHQkYm9keS5maW5kKCAnLndvb2NvbW1lcmNlLW9yZGVyaW5nIHNlbGVjdC5vcmRlcmJ5JyApLmNob3NlbldDQVBGKCBvcHRpb25zICk7XG5cdFx0XHR9XG5cdFx0fSxcblx0XHRpbml0UmFuZ2VTbGlkZXI6IGZ1bmN0aW9uKCkge1xuXHRcdFx0aWYgKCAndW5kZWZpbmVkJyA9PT0gdHlwZW9mIG5vVWlTbGlkZXIgKSB7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblxuXHRcdFx0JGJvZHkuZmluZCggJy53Y2FwZi1yYW5nZS1zbGlkZXInICkuZWFjaCggZnVuY3Rpb24oKSB7XG5cdFx0XHRcdGNvbnN0ICRpdGVtICAgPSAkKCB0aGlzICk7XG5cdFx0XHRcdGNvbnN0ICRzbGlkZXIgPSAkaXRlbS5maW5kKCAnLndjYXBmLW5vdWktc2xpZGVyJyApO1xuXG5cdFx0XHRcdGNvbnN0IHNsaWRlcklkICAgICAgICAgID0gJHNsaWRlci5hdHRyKCAnaWQnICk7XG5cdFx0XHRcdGNvbnN0IGRpc3BsYXlWYWx1ZXNBcyAgID0gJGl0ZW0uYXR0ciggJ2RhdGEtZGlzcGxheS12YWx1ZXMtYXMnICk7XG5cdFx0XHRcdGNvbnN0IGZvcm1hdE51bWJlcnMgICAgID0gJGl0ZW0uYXR0ciggJ2RhdGEtZm9ybWF0LW51bWJlcnMnICk7XG5cdFx0XHRcdGNvbnN0IHJhbmdlTWluVmFsdWUgICAgID0gcGFyc2VGbG9hdCggJGl0ZW0uYXR0ciggJ2RhdGEtcmFuZ2UtbWluLXZhbHVlJyApICk7XG5cdFx0XHRcdGNvbnN0IHJhbmdlTWF4VmFsdWUgICAgID0gcGFyc2VGbG9hdCggJGl0ZW0uYXR0ciggJ2RhdGEtcmFuZ2UtbWF4LXZhbHVlJyApICk7XG5cdFx0XHRcdGNvbnN0IHN0ZXAgICAgICAgICAgICAgID0gcGFyc2VGbG9hdCggJGl0ZW0uYXR0ciggJ2RhdGEtc3RlcCcgKSApO1xuXHRcdFx0XHRjb25zdCBkZWNpbWFsUGxhY2VzICAgICA9ICRpdGVtLmF0dHIoICdkYXRhLWRlY2ltYWwtcGxhY2VzJyApO1xuXHRcdFx0XHRjb25zdCB0aG91c2FuZFNlcGFyYXRvciA9ICRpdGVtLmF0dHIoICdkYXRhLXRob3VzYW5kLXNlcGFyYXRvcicgKTtcblx0XHRcdFx0Y29uc3QgZGVjaW1hbFNlcGFyYXRvciAgPSAkaXRlbS5hdHRyKCAnZGF0YS1kZWNpbWFsLXNlcGFyYXRvcicgKTtcblx0XHRcdFx0Y29uc3QgbWluVmFsdWUgICAgICAgICAgPSBwYXJzZUZsb2F0KCAkaXRlbS5hdHRyKCAnZGF0YS1taW4tdmFsdWUnICkgKTtcblx0XHRcdFx0Y29uc3QgbWF4VmFsdWUgICAgICAgICAgPSBwYXJzZUZsb2F0KCAkaXRlbS5hdHRyKCAnZGF0YS1tYXgtdmFsdWUnICkgKTtcblx0XHRcdFx0Y29uc3QgJG1pblZhbHVlICAgICAgICAgPSAkaXRlbS5maW5kKCAnLm1pbi12YWx1ZScgKTtcblx0XHRcdFx0Y29uc3QgJG1heFZhbHVlICAgICAgICAgPSAkaXRlbS5maW5kKCAnLm1heC12YWx1ZScgKTtcblxuXHRcdFx0XHRjb25zdCBzbGlkZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCggc2xpZGVySWQgKTtcblxuXHRcdFx0XHRub1VpU2xpZGVyLmNyZWF0ZSggc2xpZGVyLCB7XG5cdFx0XHRcdFx0c3RhcnQ6IFsgbWluVmFsdWUsIG1heFZhbHVlIF0sXG5cdFx0XHRcdFx0c3RlcCxcblx0XHRcdFx0XHRjb25uZWN0OiB0cnVlLFxuXHRcdFx0XHRcdGNzc1ByZWZpeDogJ3djYXBmLW5vdWktJyxcblx0XHRcdFx0XHRyYW5nZToge1xuXHRcdFx0XHRcdFx0J21pbic6IHJhbmdlTWluVmFsdWUsXG5cdFx0XHRcdFx0XHQnbWF4JzogcmFuZ2VNYXhWYWx1ZSxcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0gKTtcblxuXHRcdFx0XHRzbGlkZXIubm9VaVNsaWRlci5vbiggJ3VwZGF0ZScsIGZ1bmN0aW9uKCB2YWx1ZXMgKSB7XG5cdFx0XHRcdFx0bGV0IG1pblZhbHVlO1xuXHRcdFx0XHRcdGxldCBtYXhWYWx1ZTtcblxuXHRcdFx0XHRcdGlmICggZm9ybWF0TnVtYmVycyApIHtcblx0XHRcdFx0XHRcdG1pblZhbHVlID0gbnVtYmVyRm9ybWF0KCB2YWx1ZXNbIDAgXSwgZGVjaW1hbFBsYWNlcywgZGVjaW1hbFNlcGFyYXRvciwgdGhvdXNhbmRTZXBhcmF0b3IgKTtcblx0XHRcdFx0XHRcdG1heFZhbHVlID0gbnVtYmVyRm9ybWF0KCB2YWx1ZXNbIDEgXSwgZGVjaW1hbFBsYWNlcywgZGVjaW1hbFNlcGFyYXRvciwgdGhvdXNhbmRTZXBhcmF0b3IgKTtcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0bWluVmFsdWUgPSBwYXJzZUZsb2F0KCB2YWx1ZXNbIDAgXSApO1xuXHRcdFx0XHRcdFx0bWF4VmFsdWUgPSBwYXJzZUZsb2F0KCB2YWx1ZXNbIDEgXSApO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdGlmICggJ3BsYWluX3RleHQnID09PSBkaXNwbGF5VmFsdWVzQXMgKSB7XG5cdFx0XHRcdFx0XHQkbWluVmFsdWUuaHRtbCggbWluVmFsdWUgKTtcblx0XHRcdFx0XHRcdCRtYXhWYWx1ZS5odG1sKCBtYXhWYWx1ZSApO1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHQkbWluVmFsdWUudmFsKCBtaW5WYWx1ZSApO1xuXHRcdFx0XHRcdFx0JG1heFZhbHVlLnZhbCggbWF4VmFsdWUgKTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHQkYm9keS50cmlnZ2VyKCAnd2NhcGYtbm91aXNsaWRlci11cGRhdGUnLCBbICRpdGVtLCB2YWx1ZXMgXSApO1xuXHRcdFx0XHR9ICk7XG5cblx0XHRcdFx0ZnVuY3Rpb24gZmlsdGVyUHJvZHVjdHNBY2NvcmRpbmdUb1NsaWRlciggdmFsdWVzICkge1xuXHRcdFx0XHRcdGNvbnN0IF9taW5WYWx1ZSA9IHBhcnNlRmxvYXQoIHZhbHVlc1sgMCBdICk7XG5cdFx0XHRcdFx0Y29uc3QgX21heFZhbHVlID0gcGFyc2VGbG9hdCggdmFsdWVzWyAxIF0gKTtcblxuXHRcdFx0XHRcdC8vIElmIHZhbHVlIGlzIG5vdCBjaGFuZ2VkIHRoZW4gZG9uJ3QgcHJvY2VlZC5cblx0XHRcdFx0XHRpZiAoIF9taW5WYWx1ZSA9PT0gbWluVmFsdWUgJiYgX21heFZhbHVlID09PSBtYXhWYWx1ZSApIHtcblx0XHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRpZiAoIF9taW5WYWx1ZSA9PT0gcmFuZ2VNaW5WYWx1ZSAmJiBfbWF4VmFsdWUgPT09IHJhbmdlTWF4VmFsdWUgKSB7XG5cdFx0XHRcdFx0XHQvLyBSZW1vdmUgcmFuZ2UgZmlsdGVyLlxuXHRcdFx0XHRcdFx0V0NBUEYucmVxdWVzdEZpbHRlciggJGl0ZW0uZGF0YSggJ2NsZWFyLWZpbHRlci11cmwnICkgKTtcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0Ly8gQWRkIHJhbmdlIGZpbHRlci5cblx0XHRcdFx0XHRcdGNvbnN0IHVybCA9ICRpdGVtLmRhdGEoICd1cmwnICkucmVwbGFjZSggJyUxcycsIF9taW5WYWx1ZSApLnJlcGxhY2UoICclMnMnLCBfbWF4VmFsdWUgKTtcblx0XHRcdFx0XHRcdFdDQVBGLnJlcXVlc3RGaWx0ZXIoIHVybCApO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXG5cdFx0XHRcdHNsaWRlci5ub1VpU2xpZGVyLm9uKCAnY2hhbmdlJywgZnVuY3Rpb24oIHZhbHVlcyApIHtcblx0XHRcdFx0XHRmaWx0ZXJQcm9kdWN0c0FjY29yZGluZ1RvU2xpZGVyKCB2YWx1ZXMgKTtcblx0XHRcdFx0fSApO1xuXG5cdFx0XHRcdCRtaW5WYWx1ZS5vbiggJ2lucHV0JywgZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0Y29uc3QgJGlucHV0ID0gJCggdGhpcyApO1xuXG5cdFx0XHRcdFx0Ly8gQ2xlYXIgYW55IHByZXZpb3VzbHkgc2V0IHRpbWVyIGJlZm9yZSBzZXR0aW5nIGEgZnJlc2ggb25lXG5cdFx0XHRcdFx0Y2xlYXJUaW1lb3V0KCAkaW5wdXQuZGF0YSggJ3RpbWVyJyApICk7XG5cblx0XHRcdFx0XHQkaW5wdXQuZGF0YSggJ3RpbWVyJywgc2V0VGltZW91dCggZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0XHQkaW5wdXQucmVtb3ZlRGF0YSggJ3RpbWVyJyApO1xuXG5cdFx0XHRcdFx0XHRjb25zdCBtaW5WYWx1ZSA9ICRpbnB1dC52YWwoKTtcblxuXHRcdFx0XHRcdFx0c2xpZGVyLm5vVWlTbGlkZXIuc2V0KCBbIG1pblZhbHVlLCBudWxsIF0gKTtcblxuXHRcdFx0XHRcdFx0ZmlsdGVyUHJvZHVjdHNBY2NvcmRpbmdUb1NsaWRlciggc2xpZGVyLm5vVWlTbGlkZXIuZ2V0KCkgKTtcblx0XHRcdFx0XHR9LCBkZWxheSApICk7XG5cdFx0XHRcdH0gKTtcblxuXHRcdFx0XHQkbWF4VmFsdWUub24oICdpbnB1dCcsIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdGNvbnN0ICRpbnB1dCA9ICQoIHRoaXMgKTtcblxuXHRcdFx0XHRcdC8vIENsZWFyIGFueSBwcmV2aW91c2x5IHNldCB0aW1lciBiZWZvcmUgc2V0dGluZyBhIGZyZXNoIG9uZVxuXHRcdFx0XHRcdGNsZWFyVGltZW91dCggJGlucHV0LmRhdGEoICd0aW1lcicgKSApO1xuXG5cdFx0XHRcdFx0JGlucHV0LmRhdGEoICd0aW1lcicsIHNldFRpbWVvdXQoIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdFx0JGlucHV0LnJlbW92ZURhdGEoICd0aW1lcicgKTtcblxuXHRcdFx0XHRcdFx0Y29uc3QgbWF4VmFsdWUgPSAkaW5wdXQudmFsKCk7XG5cblx0XHRcdFx0XHRcdHNsaWRlci5ub1VpU2xpZGVyLnNldCggWyBudWxsLCBtYXhWYWx1ZSBdICk7XG5cblx0XHRcdFx0XHRcdGZpbHRlclByb2R1Y3RzQWNjb3JkaW5nVG9TbGlkZXIoIHNsaWRlci5ub1VpU2xpZGVyLmdldCgpICk7XG5cdFx0XHRcdFx0fSwgZGVsYXkgKSApO1xuXHRcdFx0XHR9ICk7XG5cdFx0XHR9ICk7XG5cdFx0fSxcblx0XHRpbml0OiBmdW5jdGlvbigpIHtcblx0XHRcdFdDQVBGLmluaXRDb21ib2JveCgpO1xuXHRcdFx0V0NBUEYuaW5pdFJhbmdlU2xpZGVyKCk7XG5cdFx0fVxuXHR9O1xuXG59KCBqUXVlcnksIHdpbmRvdyApICk7XG5cbiggZnVuY3Rpb24oICQsIFdDQVBGICkge1xuXG5cdFdDQVBGLmluaXQoKTtcblxuXHRXQ0FQRi5oYW5kbGVGaWx0ZXJBY2NvcmRpb24oKTtcblx0V0NBUEYuaGFuZGxlSGllcmFyY2h5VG9nZ2xlKCk7XG5cdFdDQVBGLmhhbmRsZVNvZnRMaW1pdCgpO1xuXHRXQ0FQRi5oYW5kbGVTZWFyY2hGaWx0ZXJPcHRpb25zKCk7XG5cblx0V0NBUEYuaGFuZGxlTGlzdEZpbHRlcnMoKTtcblx0V0NBUEYuaGFuZGxlRHJvcGRvd25GaWx0ZXJzKCk7XG5cdFdDQVBGLmhhbmRsZU51bWJlcklucHV0RmlsdGVycygpO1xuXHRXQ0FQRi5oYW5kbGVQYWdpbmF0aW9uKCk7XG5cdFdDQVBGLmhhbmRsZURlZmF1bHRPcmRlcmJ5KCk7XG5cblx0V0NBUEYuaGFuZGxlUmVzZXRBbGxGaWx0ZXJzKCk7XG5cbn0oIGpRdWVyeSwgd2luZG93LldDQVBGICkgKTtcbiIsIi8qKlxuICogQHNvdXJjZSBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL2EvMzQxNDE4MTNcbiAqXG4gKiBAcGFyYW0gbnVtYmVyXG4gKiBAcGFyYW0gZGVjaW1hbHNcbiAqIEBwYXJhbSBkZWNfcG9pbnRcbiAqIEBwYXJhbSB0aG91c2FuZHNfc2VwXG4gKlxuICogQHJldHVybnMge3N0cmluZ31cbiAqL1xuZnVuY3Rpb24gbnVtYmVyRm9ybWF0KCBudW1iZXIsIGRlY2ltYWxzLCBkZWNfcG9pbnQsIHRob3VzYW5kc19zZXAgKSB7XG5cdC8vIFN0cmlwIGFsbCBjaGFyYWN0ZXJzIGJ1dCBudW1lcmljYWwgb25lcy5cblx0bnVtYmVyID0gKCBudW1iZXIgKyAnJyApLnJlcGxhY2UoIC9bXlxcZCtcXC1FZS5dL2csICcnICk7XG5cblx0Y29uc3QgbiAgICA9ICEgaXNGaW5pdGUoICtudW1iZXIgKSA/IDAgOiArbnVtYmVyO1xuXHRjb25zdCBwcmVjID0gISBpc0Zpbml0ZSggK2RlY2ltYWxzICkgPyAwIDogTWF0aC5hYnMoIGRlY2ltYWxzICk7XG5cdGNvbnN0IHNlcCAgPSAoIHR5cGVvZiB0aG91c2FuZHNfc2VwID09PSAndW5kZWZpbmVkJyApID8gJywnIDogdGhvdXNhbmRzX3NlcDtcblx0Y29uc3QgZGVjICA9ICggdHlwZW9mIGRlY19wb2ludCA9PT0gJ3VuZGVmaW5lZCcgKSA/ICcuJyA6IGRlY19wb2ludDtcblxuXHRsZXQgcztcblxuXHRjb25zdCB0b0ZpeGVkRml4ID0gZnVuY3Rpb24oIG4sIHByZWMgKSB7XG5cdFx0Y29uc3QgayA9IE1hdGgucG93KCAxMCwgcHJlYyApO1xuXHRcdHJldHVybiAnJyArIE1hdGgucm91bmQoIG4gKiBrICkgLyBrO1xuXHR9O1xuXG5cdC8vIEZpeCBmb3IgSUUgcGFyc2VGbG9hdCgwLjU1KS50b0ZpeGVkKDApID0gMDtcblx0cyA9ICggcHJlYyA/IHRvRml4ZWRGaXgoIG4sIHByZWMgKSA6ICcnICsgTWF0aC5yb3VuZCggbiApICkuc3BsaXQoICcuJyApO1xuXG5cdGlmICggc1sgMCBdLmxlbmd0aCA+IDMgKSB7XG5cdFx0c1sgMCBdID0gc1sgMCBdLnJlcGxhY2UoIC9cXEIoPz0oPzpcXGR7M30pKyg/IVxcZCkpL2csIHNlcCApO1xuXHR9XG5cblx0aWYgKCAoIHNbIDEgXSB8fCAnJyApLmxlbmd0aCA8IHByZWMgKSB7XG5cdFx0c1sgMSBdID0gc1sgMSBdIHx8ICcnO1xuXHRcdHNbIDEgXSArPSBuZXcgQXJyYXkoIHByZWMgLSBzWyAxIF0ubGVuZ3RoICsgMSApLmpvaW4oICcwJyApO1xuXHR9XG5cblx0cmV0dXJuIHMuam9pbiggZGVjICk7XG59XG5cbmZ1bmN0aW9uIGNsZWFuVXJsKCB1cmwgKSB7XG5cdHJldHVybiB1cmwucmVwbGFjZSggLyUyQy9nLCAnLCcgKTtcbn1cblxuZnVuY3Rpb24gZ2V0T3JkZXJCeVVybCggdXJsICkge1xuXHRjb25zdCBwYWdlZCA9IHBhcnNlSW50KCB1cmwucmVwbGFjZSggLy4rXFwvcGFnZVxcLyhcXGQrKSsvLCAnJDEnICkgKTtcblxuXHRpZiAoIHBhZ2VkICkge1xuXHRcdHVybCA9IHVybC5yZXBsYWNlKCAvcGFnZVxcLyhcXGQrKVxcLy8sICcnICk7XG5cdH1cblxuXHRyZXR1cm4gY2xlYW5VcmwoIHVybCApO1xufVxuIl19
