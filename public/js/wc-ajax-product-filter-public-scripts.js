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
  'chosen_lib_search_threshold': '',
  'preserve_hierarchy_accordion_state': '',
  'enable_animation_for_hierarchy_accordion': '',
  'hierarchy_accordion_animation_speed': '',
  'hierarchy_accordion_animation_easing': '',
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImZpbHRlci1mb3JtLmpzIl0sIm5hbWVzIjpbIndjYXBmX3BhcmFtcyIsImpRdWVyeSIsImRvY3VtZW50IiwicmVhZHkiLCIkIiwiJGJvZHkiLCJyYW5nZVZhbHVlc1NlcGFyYXRvciIsIl9kZWxheSIsInBhcnNlSW50IiwiZmlsdGVyX2lucHV0X2RlbGF5IiwiZGVsYXkiLCJmaWVsZHMiLCJ3Y2FwZlNpbmdsZUZpbHRlclNlbGVjdG9yIiwid2NhcGZOYXZGaWx0ZXJTZWxlY3RvciIsIndjYXBmTnVtYmVyUmFuZ2VGaWx0ZXJTZWxlY3RvciIsIndjYXBmRGF0ZUZpbHRlclNlbGVjdG9yIiwiJHdjYXBmU2luZ2xlRmlsdGVycyIsIiR3Y2FwZk5hdkZpbHRlcnMiLCIkd2NhcGZOdW1iZXJSYW5nZUZpbHRlcnMiLCIkd2NhcGZEYXRlRmlsdGVycyIsImVhY2giLCIkZmllbGQiLCJpZCIsImF0dHIiLCIkd3JhcHBlciIsImZpbmQiLCJmaWx0ZXJLZXkiLCJtdWx0aXBsZUZpbHRlciIsImluaXRDaG9zZW4iLCJjaG9zZW4iLCIkcm9vdCIsImZvcl9wcmV2aWV3IiwiJHRoaXMiLCJvcHRpb25zIiwiaW5oZXJpdF9zZWxlY3RfY2xhc3NlcyIsImluaGVyaXRfb3B0aW9uX2NsYXNzZXMiLCJpc19ydGwiLCJub1Jlc3VsdHNNZXNzYWdlIiwic2VhcmNoVGhyZXNob2xkIiwiY2hvc2VuX2xpYl9zZWFyY2hfdGhyZXNob2xkIiwiaW5pdEhpZXJhcmNoeUFjY29yZGlvbiIsInRvZ2dsZUFjY29yZGlvbiIsIiRlbCIsInByZXNzZWQiLCIkY2hpbGQiLCJjbG9zZXN0IiwiY2hpbGRyZW4iLCJlbmFibGVfYW5pbWF0aW9uX2Zvcl9oaWVyYXJjaHlfYWNjb3JkaW9uIiwic2xpZGVUb2dnbGUiLCJoaWVyYXJjaHlfYWNjb3JkaW9uX2FuaW1hdGlvbl9zcGVlZCIsImhpZXJhcmNoeV9hY2NvcmRpb25fYW5pbWF0aW9uX2Vhc2luZyIsInRvZ2dsZSIsIm9uIiwiZSIsImtleSIsInByZXZlbnREZWZhdWx0IiwibnVtYmVyX2Zvcm1hdCIsIm51bWJlciIsImRlY2ltYWxzIiwiZGVjX3BvaW50IiwidGhvdXNhbmRzX3NlcCIsInJlcGxhY2UiLCJuIiwiaXNGaW5pdGUiLCJwcmVjIiwiTWF0aCIsImFicyIsInNlcCIsImRlYyIsInMiLCJ0b0ZpeGVkRml4IiwiayIsInBvdyIsInJvdW5kIiwic3BsaXQiLCJsZW5ndGgiLCJBcnJheSIsImpvaW4iLCJpbml0Tm9VSVNsaWRlciIsIm5vVWlTbGlkZXIiLCIkaXRlbSIsIiRzbGlkZXIiLCJoYXNDbGFzcyIsInNsaWRlcklkIiwiZGlzcGxheVZhbHVlc0FzIiwiZm9ybWF0TnVtYmVycyIsInJhbmdlTWluVmFsdWUiLCJwYXJzZUZsb2F0IiwicmFuZ2VNYXhWYWx1ZSIsInN0ZXAiLCJkZWNpbWFsUGxhY2VzIiwidGhvdXNhbmRTZXBhcmF0b3IiLCJkZWNpbWFsU2VwYXJhdG9yIiwibWluVmFsdWUiLCJtYXhWYWx1ZSIsIiRtaW5WYWx1ZSIsIiRtYXhWYWx1ZSIsInNsaWRlciIsImdldEVsZW1lbnRCeUlkIiwiY3JlYXRlIiwic3RhcnQiLCJjb25uZWN0IiwiY3NzUHJlZml4IiwicmFuZ2UiLCJ2YWx1ZXMiLCJodG1sIiwidmFsIiwidHJpZ2dlciIsImZpbHRlclByb2R1Y3RzQWNjb3JkaW5nVG9TbGlkZXIiLCJyZXF1ZXN0RmlsdGVyIiwiZGF0YSIsInVybCIsImNsZWFyVGltZW91dCIsInNldFRpbWVvdXQiLCJyZW1vdmVEYXRhIiwiZXZlbnQiLCIkaW5wdXQiLCJzZXQiLCJnZXQiLCJmaWx0ZXJCeURhdGUiLCIkd2NhcGZEYXRlRmlsdGVyIiwiaXNSYW5nZSIsImZpbHRlclZhbHVlIiwicnVuRmlsdGVyIiwiZnJvbSIsInRvIiwidXBkYXRlUXVlcnlTdHJpbmdQYXJhbWV0ZXIiLCJxdWVyeSIsInJlbW92ZVF1ZXJ5U3RyaW5nUGFyYW1ldGVyIiwiaGlzdG9yeSIsInB1c2hTdGF0ZSIsImZpbHRlclByb2R1Y3RzIiwiaW5pdERhdGVwaWNrZXIiLCJkYXRlcGlja2VyIiwiZm9ybWF0IiwieWVhckRyb3Bkb3duIiwibW9udGhEcm9wZG93biIsIiRmcm9tIiwiJHRvIiwiZGF0ZUZvcm1hdCIsImNoYW5nZVllYXIiLCJjaGFuZ2VNb250aCIsImluaXREZWZhdWx0T3JkZXJCeSIsImF0dGFjaF9jaG9zZW5fb25fc29ydGluZyIsInNvcnRpbmdfY29udHJvbCIsIiRvcmRlcmluZ0Zvcm0iLCJzdWJtaXQiLCJvcmRlciIsImZpbHRlcl9rZXkiLCJ1cGRhdGVQcm9kdWN0c0NvdW50UmVzdWx0IiwiJHJlc3VsdHMiLCJzZWxlY3RvciIsInNob3BfbG9vcF9jb250YWluZXIiLCJuZXdQcm9kdWN0Q291bnQiLCJzaG93TG9hZGluZ0FuaW1hdGlvbiIsImxvYWRpbmdfYW5pbWF0aW9uIiwiTG9hZGluZ092ZXJsYXkiLCJsb2FkaW5nX292ZXJsYXlfb3B0aW9ucyIsImRpc2FibGVOb1VpU2xpZGVycyIsImVsZW1lbnQiLCJzZXRBdHRyaWJ1dGUiLCJkaXNhYmxlTGFiZWxzIiwic2VsZWN0b3JzIiwiYWRkQ2xhc3MiLCJkaXNhYmxlSW5wdXRzIiwiZGlzYWJsZV9pbnB1dHNfd2hpbGVfZmV0Y2hpbmdfcmVzdWx0cyIsImlucHV0cyIsImVuYWJsZU5vVWlTbGlkZXJzIiwicmVtb3ZlQXR0cmlidXRlIiwiZW5hYmxlSW5wdXRzIiwicmVtb3ZlQXR0ciIsInJlc2V0TG9hZGluZ0FuaW1hdGlvbiIsInNjcm9sbFRvIiwic2Nyb2xsX3dpbmRvdyIsInNjcm9sbEZvciIsInNjcm9sbF93aW5kb3dfZm9yIiwiaXNNb2JpbGUiLCJpc19tb2JpbGUiLCJwcm9jZWVkIiwiYWRqdXN0aW5nT2Zmc2V0Iiwib2Zmc2V0Iiwic2Nyb2xsX3RvX3RvcF9vZmZzZXQiLCJjb250YWluZXIiLCJub3RfZm91bmRfY29udGFpbmVyIiwic2Nyb2xsX3dpbmRvd19jdXN0b21fZWxlbWVudCIsIiRjb250YWluZXIiLCJ0b3AiLCJzdG9wIiwiYW5pbWF0ZSIsInNjcm9sbFRvcCIsInNjcm9sbF90b190b3Bfc3BlZWQiLCJzY3JvbGxfdG9fdG9wX2Vhc2luZyIsImJlZm9yZUZldGNoaW5nUHJvZHVjdHMiLCJzY3JvbGxfd2luZG93X3doZW4iLCJiZWZvcmVVcGRhdGluZ1Byb2R1Y3RzIiwiYWZ0ZXJVcGRhdGluZ1Byb2R1Y3RzIiwiZm9yY2VSZVJlbmRlciIsIndpbmRvdyIsImxvY2F0aW9uIiwiaHJlZiIsIiRkYXRhIiwiZmllbGRJRCIsIiRpbm5lciIsIl9maWVsZCIsImZpZWxkQ2xhc3NlcyIsInByZXNlcnZlX2hpZXJhcmNoeV9hY2NvcmRpb25fc3RhdGUiLCJpdGVtVmFsdWUiLCJwYXJlbnQiLCJ0b2dnbGVTZWxlY3RvciIsInVsU2VsZWN0b3IiLCJfY2xhc3NlcyIsInNob3ciLCJfaHRtbCIsInNvZnRMaW1pdFNlbGVjdG9yIiwidHJpbSIsIiRzaG9wTG9vcENvbnRhaW5lciIsIiRub3RGb3VuZENvbnRhaW5lciIsImdldFVybFZhcnMiLCJ2YXJzIiwiaGFzaCIsInJlcGxhY2VBbGwiLCJoYXNoZXMiLCJzbGljZSIsImluZGV4T2YiLCJoTGVuZ3RoIiwiaSIsImZpeFBhZ2luYXRpb24iLCJwYXJhbXMiLCJjdXJyZW50UGFnZUluVXJsIiwiY3VycmVudFBhZ2VJblBhcmFtcyIsInZhbHVlIiwicHVzaEhpc3RvcnkiLCJyZSIsIlJlZ0V4cCIsInNlcGFyYXRvciIsInVybFdpdGhRdWVyeSIsIm1hdGNoIiwib2xkUGFyYW1zIiwib2xkUGFyYW1zTGVuZ3RoIiwiT2JqZWN0Iiwia2V5cyIsInN0YXJ0UG9zaXRpb24iLCJmaWx0ZXJLZXlQb3NpdGlvbiIsImNsZWFuVXJsIiwiY2xlYW5RdWVyeSIsIm5ld1BhcmFtcyIsIm1ha2VQYXJhbWV0ZXJzIiwiZm9yY2VSZXJlbmRlciIsInZhbHVlU2VwYXJhdG9yIiwibmV4dFZhbHVlcyIsImVtcHR5VmFsdWUiLCJwcmV2VmFsdWVzIiwicHJldlZhbHVlc0FycmF5IiwiZm91bmQiLCJpbkFycmF5Iiwic3BsaWNlIiwicHVzaCIsInNpbmdsZUZpbHRlciIsImVuYWJsZV9wYWdpbmF0aW9uX3ZpYV9hamF4IiwicGFnaW5hdGlvbl9jb250YWluZXIiLCJoYW5kbGVGaWx0ZXJSZXF1ZXN0IiwiZmllbGREYXRhIiwiJHNlbGVjdCIsImZpbHRlclVSTCIsImNsZWFyRmlsdGVyVVJMIiwidG9TdHJpbmciLCJyYW5nZU51bWJlclNlbGVjdG9ycyIsIiRyYW5nZU51bWJlciIsImdldFZhbHVlIiwiZmxvYXRWYWx1ZSIsImlzTmFOIiwicmVzZXRGaWx0ZXJzIiwiJGJ1dHRvbiIsIl9maWx0ZXJLZXlzIiwiZmlsdGVyS2V5cyIsInByZXZVcmwiLCJuZXdVcmwiLCJhcHBseV9maWx0ZXJzX29uX2Jyb3dzZXJfaGlzdG9yeV9jaGFuZ2UiLCJiaW5kIl0sIm1hcHBpbmdzIjoiOztBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQSxJQUFNQSxZQUFZLEdBQUdBLFlBQVksSUFBSTtBQUNwQyxZQUFVLEVBRDBCO0FBRXBDLHdCQUFzQixFQUZjO0FBR3BDLGlDQUErQixFQUhLO0FBSXBDLHdDQUFzQyxFQUpGO0FBS3BDLDhDQUE0QyxFQUxSO0FBTXBDLHlDQUF1QyxFQU5IO0FBT3BDLDBDQUF3QyxFQVBKO0FBUXBDLDZCQUEyQixFQVJTO0FBU3BDLHlCQUF1QixFQVRhO0FBVXBDLDBCQUF3QixFQVZZO0FBV3BDLGVBQWEsRUFYdUI7QUFZcEMsMkNBQXlDLEVBWkw7QUFhcEMsNkNBQTJDLEVBYlA7QUFjcEMseUJBQXVCLEVBZGE7QUFlcEMseUJBQXVCLEVBZmE7QUFnQnBDLGdDQUE4QixFQWhCTTtBQWlCcEMsMEJBQXdCLEVBakJZO0FBa0JwQyxxQkFBbUIsRUFsQmlCO0FBbUJwQyw4QkFBNEIsRUFuQlE7QUFvQnBDLHVCQUFxQixFQXBCZTtBQXFCcEMsbUJBQWlCLEVBckJtQjtBQXNCcEMsdUJBQXFCLEVBdEJlO0FBdUJwQyx3QkFBc0IsRUF2QmM7QUF3QnBDLGtDQUFnQyxFQXhCSTtBQXlCcEMsMEJBQXdCLEVBekJZO0FBMEJwQyxpQkFBZTtBQTFCcUIsQ0FBckM7QUE2QkFDLE1BQU0sQ0FBRUMsUUFBRixDQUFOLENBQW1CQyxLQUFuQixDQUEwQixVQUFVQyxDQUFWLEVBQWM7QUFFdkMsTUFBTUMsS0FBSyxHQUFHRCxDQUFDLENBQUUsTUFBRixDQUFmO0FBRUEsTUFBTUUsb0JBQW9CLEdBQUcsR0FBN0I7O0FBRUEsTUFBTUMsTUFBTSxHQUFHQyxRQUFRLENBQUVSLFlBQVksQ0FBQ1Msa0JBQWYsQ0FBdkI7O0FBQ0EsTUFBTUMsS0FBSyxHQUFJSCxNQUFNLElBQUksQ0FBVixHQUFjQSxNQUFkLEdBQXVCLEdBQXRDLENBUHVDLENBU3ZDOztBQUNBLE1BQU1JLE1BQU0sR0FBRyxFQUFmO0FBRUEsTUFBTUMseUJBQXlCLEdBQVEsc0JBQXZDO0FBQ0EsTUFBTUMsc0JBQXNCLEdBQVcsbUJBQXZDO0FBQ0EsTUFBTUMsOEJBQThCLEdBQUcsNEJBQXZDO0FBQ0EsTUFBTUMsdUJBQXVCLEdBQVUsMEJBQXZDO0FBRUEsTUFBTUMsbUJBQW1CLEdBQVFaLENBQUMsQ0FBRVEseUJBQUYsQ0FBbEM7QUFDQSxNQUFNSyxnQkFBZ0IsR0FBV2IsQ0FBQyxDQUFFUyxzQkFBRixDQUFsQztBQUNBLE1BQU1LLHdCQUF3QixHQUFHZCxDQUFDLENBQUVVLDhCQUFGLENBQWxDO0FBQ0EsTUFBTUssaUJBQWlCLEdBQVVmLENBQUMsQ0FBRVcsdUJBQUYsQ0FBbEM7QUFFQUMsRUFBQUEsbUJBQW1CLENBQUNJLElBQXBCLENBQTBCLFlBQVc7QUFDcEMsUUFBTUMsTUFBTSxHQUFXakIsQ0FBQyxDQUFFLElBQUYsQ0FBeEI7QUFDQSxRQUFNa0IsRUFBRSxHQUFlRCxNQUFNLENBQUNFLElBQVAsQ0FBYSxTQUFiLENBQXZCO0FBQ0EsUUFBTUMsUUFBUSxHQUFTSCxNQUFNLENBQUNJLElBQVAsQ0FBYSwwQkFBYixDQUF2QjtBQUNBLFFBQU1DLFNBQVMsR0FBUUYsUUFBUSxDQUFDRCxJQUFULENBQWUsaUJBQWYsQ0FBdkI7QUFDQSxRQUFNSSxjQUFjLEdBQUduQixRQUFRLENBQUVnQixRQUFRLENBQUNELElBQVQsQ0FBZSxzQkFBZixDQUFGLENBQS9CO0FBRUFaLElBQUFBLE1BQU0sQ0FBRVcsRUFBRixDQUFOLEdBQWU7QUFDZEksTUFBQUEsU0FBUyxFQUFFQSxTQURHO0FBRWRDLE1BQUFBLGNBQWMsRUFBRUE7QUFGRixLQUFmO0FBSUEsR0FYRCxFQXRCdUMsQ0FtQ3ZDOztBQUNBLFdBQVNDLFVBQVQsR0FBc0I7QUFDckIsUUFBSyxDQUFFM0IsTUFBTSxHQUFHNEIsTUFBaEIsRUFBeUI7QUFDeEI7QUFDQTs7QUFFRCxRQUFJQyxLQUFKOztBQUVBLFFBQUs5QixZQUFZLENBQUMrQixXQUFsQixFQUFnQztBQUMvQkQsTUFBQUEsS0FBSyxHQUFHMUIsQ0FBQyxDQUFFUyxzQkFBRixDQUFUO0FBQ0EsS0FGRCxNQUVPO0FBQ05pQixNQUFBQSxLQUFLLEdBQUdiLGdCQUFSO0FBQ0E7O0FBRURhLElBQUFBLEtBQUssQ0FBQ0wsSUFBTixDQUFZLHNCQUFaLEVBQXFDTCxJQUFyQyxDQUEyQyxZQUFXO0FBQ3JELFVBQU1ZLEtBQUssR0FBSzVCLENBQUMsQ0FBRSxJQUFGLENBQWpCO0FBQ0EsVUFBTTZCLE9BQU8sR0FBRztBQUNmQyxRQUFBQSxzQkFBc0IsRUFBRSxJQURUO0FBRWZDLFFBQUFBLHNCQUFzQixFQUFFO0FBRlQsT0FBaEI7O0FBS0EsVUFBS25DLFlBQVksQ0FBQ29DLE1BQWxCLEVBQTJCO0FBQzFCSCxRQUFBQSxPQUFPLENBQUUsS0FBRixDQUFQLEdBQW1CLElBQW5CO0FBQ0E7O0FBRUQsVUFBTUksZ0JBQWdCLEdBQUdMLEtBQUssQ0FBQ1QsSUFBTixDQUFZLHlCQUFaLENBQXpCOztBQUVBLFVBQUtjLGdCQUFMLEVBQXdCO0FBQ3ZCSixRQUFBQSxPQUFPLENBQUUsaUJBQUYsQ0FBUCxHQUErQkksZ0JBQS9CO0FBQ0EsT0Fmb0QsQ0FpQnJEOzs7QUFFQSxVQUFNQyxlQUFlLEdBQUc5QixRQUFRLENBQUVSLFlBQVksQ0FBQ3VDLDJCQUFmLENBQWhDOztBQUVBLFVBQUtELGVBQUwsRUFBdUIsQ0FDdEI7QUFDQSxPQXZCb0QsQ0F5QnJEO0FBRUE7QUFFQTs7O0FBRUFOLE1BQUFBLEtBQUssQ0FBQ0gsTUFBTixDQUFjSSxPQUFkO0FBQ0EsS0FoQ0Q7QUFpQ0E7O0FBRURMLEVBQUFBLFVBQVUsR0FwRjZCLENBc0Z2Qzs7QUFDQSxXQUFTWSxzQkFBVCxHQUFrQztBQUNqQyxRQUFJVixLQUFKOztBQUVBLFFBQUs5QixZQUFZLENBQUMrQixXQUFsQixFQUFnQztBQUMvQkQsTUFBQUEsS0FBSyxHQUFHMUIsQ0FBQyxDQUFFUyxzQkFBRixDQUFUO0FBQ0EsS0FGRCxNQUVPO0FBQ05pQixNQUFBQSxLQUFLLEdBQUdiLGdCQUFSO0FBQ0E7O0FBRUQsYUFBU3dCLGVBQVQsQ0FBMEJDLEdBQTFCLEVBQWdDO0FBQy9CO0FBQ0EsVUFBTUMsT0FBTyxHQUFHRCxHQUFHLENBQUNuQixJQUFKLENBQVUsY0FBVixNQUErQixNQUEvQyxDQUYrQixDQUkvQjs7QUFDQW1CLE1BQUFBLEdBQUcsQ0FBQ25CLElBQUosQ0FBVSxjQUFWLEVBQTBCLENBQUVvQixPQUE1QjtBQUVBLFVBQU1DLE1BQU0sR0FBR0YsR0FBRyxDQUFDRyxPQUFKLENBQWEsSUFBYixFQUFvQkMsUUFBcEIsQ0FBOEIsSUFBOUIsQ0FBZjs7QUFFQSxVQUFLOUMsWUFBWSxDQUFDK0Msd0NBQWxCLEVBQTZEO0FBQzVESCxRQUFBQSxNQUFNLENBQUNJLFdBQVAsQ0FDQ2hELFlBQVksQ0FBQ2lELG1DQURkLEVBRUNqRCxZQUFZLENBQUNrRCxvQ0FGZDtBQUlBLE9BTEQsTUFLTztBQUNOTixRQUFBQSxNQUFNLENBQUNPLE1BQVA7QUFDQTtBQUNEOztBQUVEckIsSUFBQUEsS0FBSyxDQUFDTCxJQUFOLENBQVksbUNBQVosRUFBa0QyQixFQUFsRCxDQUFzRCxPQUF0RCxFQUErRCxZQUFXO0FBQ3pFWCxNQUFBQSxlQUFlLENBQUVyQyxDQUFDLENBQUUsSUFBRixDQUFILENBQWY7QUFDQSxLQUZEO0FBSUEwQixJQUFBQSxLQUFLLENBQUNMLElBQU4sQ0FBWSxtQ0FBWixFQUFrRDJCLEVBQWxELENBQXNELFNBQXRELEVBQWlFLFVBQVVDLENBQVYsRUFBYztBQUM5RSxVQUFLQSxDQUFDLENBQUNDLEdBQUYsS0FBVSxHQUFWLElBQWlCRCxDQUFDLENBQUNDLEdBQUYsS0FBVSxPQUEzQixJQUFzQ0QsQ0FBQyxDQUFDQyxHQUFGLEtBQVUsVUFBckQsRUFBa0U7QUFDakU7QUFDQUQsUUFBQUEsQ0FBQyxDQUFDRSxjQUFGO0FBRUFkLFFBQUFBLGVBQWUsQ0FBRXJDLENBQUMsQ0FBRSxJQUFGLENBQUgsQ0FBZjtBQUNBO0FBQ0QsS0FQRDtBQVFBOztBQUVEb0MsRUFBQUEsc0JBQXNCO0FBRXRCO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUNDLFdBQVNnQixhQUFULENBQXdCQyxNQUF4QixFQUFnQ0MsUUFBaEMsRUFBMENDLFNBQTFDLEVBQXFEQyxhQUFyRCxFQUFxRTtBQUNwRTtBQUNBSCxJQUFBQSxNQUFNLEdBQUcsQ0FBRUEsTUFBTSxHQUFHLEVBQVgsRUFBZ0JJLE9BQWhCLENBQXlCLGNBQXpCLEVBQXlDLEVBQXpDLENBQVQ7QUFFQSxRQUFNQyxDQUFDLEdBQU0sQ0FBRUMsUUFBUSxDQUFFLENBQUNOLE1BQUgsQ0FBVixHQUF3QixDQUF4QixHQUE0QixDQUFDQSxNQUExQztBQUNBLFFBQU1PLElBQUksR0FBRyxDQUFFRCxRQUFRLENBQUUsQ0FBQ0wsUUFBSCxDQUFWLEdBQTBCLENBQTFCLEdBQThCTyxJQUFJLENBQUNDLEdBQUwsQ0FBVVIsUUFBVixDQUEzQztBQUNBLFFBQU1TLEdBQUcsR0FBTSxPQUFPUCxhQUFQLEtBQXlCLFdBQTNCLEdBQTJDLEdBQTNDLEdBQWlEQSxhQUE5RDtBQUNBLFFBQU1RLEdBQUcsR0FBTSxPQUFPVCxTQUFQLEtBQXFCLFdBQXZCLEdBQXVDLEdBQXZDLEdBQTZDQSxTQUExRDtBQUVBLFFBQUlVLENBQUo7O0FBRUEsUUFBTUMsVUFBVSxHQUFHLFNBQWJBLFVBQWEsQ0FBVVIsQ0FBVixFQUFhRSxJQUFiLEVBQW9CO0FBQ3RDLFVBQU1PLENBQUMsR0FBR04sSUFBSSxDQUFDTyxHQUFMLENBQVUsRUFBVixFQUFjUixJQUFkLENBQVY7QUFDQSxhQUFPLEtBQUtDLElBQUksQ0FBQ1EsS0FBTCxDQUFZWCxDQUFDLEdBQUdTLENBQWhCLElBQXNCQSxDQUFsQztBQUNBLEtBSEQsQ0FYb0UsQ0FnQnBFOzs7QUFDQUYsSUFBQUEsQ0FBQyxHQUFHLENBQUVMLElBQUksR0FBR00sVUFBVSxDQUFFUixDQUFGLEVBQUtFLElBQUwsQ0FBYixHQUEyQixLQUFLQyxJQUFJLENBQUNRLEtBQUwsQ0FBWVgsQ0FBWixDQUF0QyxFQUF3RFksS0FBeEQsQ0FBK0QsR0FBL0QsQ0FBSjs7QUFFQSxRQUFLTCxDQUFDLENBQUUsQ0FBRixDQUFELENBQU9NLE1BQVAsR0FBZ0IsQ0FBckIsRUFBeUI7QUFDeEJOLE1BQUFBLENBQUMsQ0FBRSxDQUFGLENBQUQsR0FBU0EsQ0FBQyxDQUFFLENBQUYsQ0FBRCxDQUFPUixPQUFQLENBQWdCLHlCQUFoQixFQUEyQ00sR0FBM0MsQ0FBVDtBQUNBOztBQUVELFFBQUssQ0FBRUUsQ0FBQyxDQUFFLENBQUYsQ0FBRCxJQUFVLEVBQVosRUFBaUJNLE1BQWpCLEdBQTBCWCxJQUEvQixFQUFzQztBQUNyQ0ssTUFBQUEsQ0FBQyxDQUFFLENBQUYsQ0FBRCxHQUFTQSxDQUFDLENBQUUsQ0FBRixDQUFELElBQVUsRUFBbkI7QUFDQUEsTUFBQUEsQ0FBQyxDQUFFLENBQUYsQ0FBRCxJQUFVLElBQUlPLEtBQUosQ0FBV1osSUFBSSxHQUFHSyxDQUFDLENBQUUsQ0FBRixDQUFELENBQU9NLE1BQWQsR0FBdUIsQ0FBbEMsRUFBc0NFLElBQXRDLENBQTRDLEdBQTVDLENBQVY7QUFDQTs7QUFFRCxXQUFPUixDQUFDLENBQUNRLElBQUYsQ0FBUVQsR0FBUixDQUFQO0FBQ0EsR0ExS3NDLENBNEt2Qzs7O0FBQ0EsV0FBU1UsY0FBVCxHQUEwQjtBQUN6QixRQUFLLGdCQUFnQixPQUFPQyxVQUE1QixFQUF5QztBQUN4QztBQUNBOztBQUVELFFBQUlqRCxLQUFKOztBQUVBLFFBQUs5QixZQUFZLENBQUMrQixXQUFsQixFQUFnQztBQUMvQkQsTUFBQUEsS0FBSyxHQUFHMUIsQ0FBQyxDQUFFVSw4QkFBRixDQUFUO0FBQ0EsS0FGRCxNQUVPO0FBQ05nQixNQUFBQSxLQUFLLEdBQUdaLHdCQUFSO0FBQ0E7O0FBRURZLElBQUFBLEtBQUssQ0FBQ0wsSUFBTixDQUFZLHFCQUFaLEVBQW9DTCxJQUFwQyxDQUEwQyxZQUFXO0FBQ3BELFVBQU00RCxLQUFLLEdBQUc1RSxDQUFDLENBQUUsSUFBRixDQUFmLENBRG9ELENBR3BEOztBQUNBLFVBQU1zQixTQUFTLEdBQUdzRCxLQUFLLENBQUN6RCxJQUFOLENBQVksaUJBQVosQ0FBbEI7QUFDQSxVQUFNMEQsT0FBTyxHQUFLRCxLQUFLLENBQUN2RCxJQUFOLENBQVksb0JBQVosQ0FBbEIsQ0FMb0QsQ0FPcEQ7O0FBQ0EsVUFBS3dELE9BQU8sQ0FBQ0MsUUFBUixDQUFrQixtQkFBbEIsQ0FBTCxFQUErQztBQUM5QztBQUNBOztBQUVELFVBQU1DLFFBQVEsR0FBWUYsT0FBTyxDQUFDMUQsSUFBUixDQUFjLElBQWQsQ0FBMUI7QUFDQSxVQUFNNkQsZUFBZSxHQUFLSixLQUFLLENBQUN6RCxJQUFOLENBQVksd0JBQVosQ0FBMUI7QUFDQSxVQUFNOEQsYUFBYSxHQUFPTCxLQUFLLENBQUN6RCxJQUFOLENBQVkscUJBQVosQ0FBMUI7QUFDQSxVQUFNK0QsYUFBYSxHQUFPQyxVQUFVLENBQUVQLEtBQUssQ0FBQ3pELElBQU4sQ0FBWSxzQkFBWixDQUFGLENBQXBDO0FBQ0EsVUFBTWlFLGFBQWEsR0FBT0QsVUFBVSxDQUFFUCxLQUFLLENBQUN6RCxJQUFOLENBQVksc0JBQVosQ0FBRixDQUFwQztBQUNBLFVBQU1rRSxJQUFJLEdBQWdCRixVQUFVLENBQUVQLEtBQUssQ0FBQ3pELElBQU4sQ0FBWSxXQUFaLENBQUYsQ0FBcEM7QUFDQSxVQUFNbUUsYUFBYSxHQUFPVixLQUFLLENBQUN6RCxJQUFOLENBQVkscUJBQVosQ0FBMUI7QUFDQSxVQUFNb0UsaUJBQWlCLEdBQUdYLEtBQUssQ0FBQ3pELElBQU4sQ0FBWSx5QkFBWixDQUExQjtBQUNBLFVBQU1xRSxnQkFBZ0IsR0FBSVosS0FBSyxDQUFDekQsSUFBTixDQUFZLHdCQUFaLENBQTFCO0FBQ0EsVUFBTXNFLFFBQVEsR0FBWU4sVUFBVSxDQUFFUCxLQUFLLENBQUN6RCxJQUFOLENBQVksZ0JBQVosQ0FBRixDQUFwQztBQUNBLFVBQU11RSxRQUFRLEdBQVlQLFVBQVUsQ0FBRVAsS0FBSyxDQUFDekQsSUFBTixDQUFZLGdCQUFaLENBQUYsQ0FBcEM7QUFDQSxVQUFNd0UsU0FBUyxHQUFXZixLQUFLLENBQUN2RCxJQUFOLENBQVksWUFBWixDQUExQjtBQUNBLFVBQU11RSxTQUFTLEdBQVdoQixLQUFLLENBQUN2RCxJQUFOLENBQVksWUFBWixDQUExQjtBQUVBLFVBQU13RSxNQUFNLEdBQUcvRixRQUFRLENBQUNnRyxjQUFULENBQXlCZixRQUF6QixDQUFmO0FBRUFKLE1BQUFBLFVBQVUsQ0FBQ29CLE1BQVgsQ0FBbUJGLE1BQW5CLEVBQTJCO0FBQzFCRyxRQUFBQSxLQUFLLEVBQUUsQ0FBRVAsUUFBRixFQUFZQyxRQUFaLENBRG1CO0FBRTFCTCxRQUFBQSxJQUFJLEVBQUpBLElBRjBCO0FBRzFCWSxRQUFBQSxPQUFPLEVBQUUsSUFIaUI7QUFJMUJDLFFBQUFBLFNBQVMsRUFBRSxhQUplO0FBSzFCQyxRQUFBQSxLQUFLLEVBQUU7QUFDTixpQkFBT2pCLGFBREQ7QUFFTixpQkFBT0U7QUFGRDtBQUxtQixPQUEzQjtBQVdBUyxNQUFBQSxNQUFNLENBQUNsQixVQUFQLENBQWtCM0IsRUFBbEIsQ0FBc0IsUUFBdEIsRUFBZ0MsVUFBVW9ELE1BQVYsRUFBbUI7QUFDbEQsWUFBSVgsUUFBSjtBQUNBLFlBQUlDLFFBQUo7O0FBRUEsWUFBS1QsYUFBTCxFQUFxQjtBQUNwQlEsVUFBQUEsUUFBUSxHQUFHckMsYUFBYSxDQUFFZ0QsTUFBTSxDQUFFLENBQUYsQ0FBUixFQUFlZCxhQUFmLEVBQThCRSxnQkFBOUIsRUFBZ0RELGlCQUFoRCxDQUF4QjtBQUNBRyxVQUFBQSxRQUFRLEdBQUd0QyxhQUFhLENBQUVnRCxNQUFNLENBQUUsQ0FBRixDQUFSLEVBQWVkLGFBQWYsRUFBOEJFLGdCQUE5QixFQUFnREQsaUJBQWhELENBQXhCO0FBQ0EsU0FIRCxNQUdPO0FBQ05FLFVBQUFBLFFBQVEsR0FBR04sVUFBVSxDQUFFaUIsTUFBTSxDQUFFLENBQUYsQ0FBUixDQUFyQjtBQUNBVixVQUFBQSxRQUFRLEdBQUdQLFVBQVUsQ0FBRWlCLE1BQU0sQ0FBRSxDQUFGLENBQVIsQ0FBckI7QUFDQTs7QUFFRCxZQUFLLGlCQUFpQnBCLGVBQXRCLEVBQXdDO0FBQ3ZDVyxVQUFBQSxTQUFTLENBQUNVLElBQVYsQ0FBZ0JaLFFBQWhCO0FBQ0FHLFVBQUFBLFNBQVMsQ0FBQ1MsSUFBVixDQUFnQlgsUUFBaEI7QUFDQSxTQUhELE1BR087QUFDTkMsVUFBQUEsU0FBUyxDQUFDVyxHQUFWLENBQWViLFFBQWY7QUFDQUcsVUFBQUEsU0FBUyxDQUFDVSxHQUFWLENBQWVaLFFBQWY7QUFDQTs7QUFFRHpGLFFBQUFBLEtBQUssQ0FBQ3NHLE9BQU4sQ0FBZSx5QkFBZixFQUEwQyxDQUFFM0IsS0FBRixFQUFTd0IsTUFBVCxDQUExQztBQUNBLE9BckJEOztBQXVCQSxlQUFTSSwrQkFBVCxDQUEwQ0osTUFBMUMsRUFBbUQ7QUFDbEQsWUFBS3hHLFlBQVksQ0FBQytCLFdBQWxCLEVBQWdDO0FBQy9CO0FBQ0E7O0FBRUQsWUFBTThELFFBQVEsR0FBR04sVUFBVSxDQUFFaUIsTUFBTSxDQUFFLENBQUYsQ0FBUixDQUEzQjtBQUNBLFlBQU1WLFFBQVEsR0FBR1AsVUFBVSxDQUFFaUIsTUFBTSxDQUFFLENBQUYsQ0FBUixDQUEzQjs7QUFFQSxZQUFLWCxRQUFRLEtBQUtQLGFBQWIsSUFBOEJRLFFBQVEsS0FBS04sYUFBaEQsRUFBZ0U7QUFDL0Q7QUFDQXFCLFVBQUFBLGFBQWEsQ0FBRTdCLEtBQUssQ0FBQzhCLElBQU4sQ0FBWSxrQkFBWixDQUFGLENBQWI7QUFDQSxTQUhELE1BR087QUFDTjtBQUNBLGNBQU1DLEdBQUcsR0FBRy9CLEtBQUssQ0FBQzhCLElBQU4sQ0FBWSxLQUFaLEVBQW9CakQsT0FBcEIsQ0FBNkIsS0FBN0IsRUFBb0NnQyxRQUFwQyxFQUErQ2hDLE9BQS9DLENBQXdELEtBQXhELEVBQStEaUMsUUFBL0QsQ0FBWjtBQUNBZSxVQUFBQSxhQUFhLENBQUVFLEdBQUYsQ0FBYjtBQUNBO0FBQ0Q7O0FBRURkLE1BQUFBLE1BQU0sQ0FBQ2xCLFVBQVAsQ0FBa0IzQixFQUFsQixDQUFzQixRQUF0QixFQUFnQyxVQUFVb0QsTUFBVixFQUFtQjtBQUNsRDtBQUNBUSxRQUFBQSxZQUFZLENBQUVoQyxLQUFLLENBQUM4QixJQUFOLENBQVksT0FBWixDQUFGLENBQVo7QUFFQTlCLFFBQUFBLEtBQUssQ0FBQzhCLElBQU4sQ0FBWSxPQUFaLEVBQXFCRyxVQUFVLENBQUUsWUFBVztBQUMzQ2pDLFVBQUFBLEtBQUssQ0FBQ2tDLFVBQU4sQ0FBa0IsT0FBbEI7QUFFQU4sVUFBQUEsK0JBQStCLENBQUVKLE1BQUYsQ0FBL0I7QUFDQSxTQUo4QixFQUk1QjlGLEtBSjRCLENBQS9CO0FBS0EsT0FURDtBQVdBcUYsTUFBQUEsU0FBUyxDQUFDM0MsRUFBVixDQUFjLE9BQWQsRUFBdUIsVUFBVStELEtBQVYsRUFBa0I7QUFDeENBLFFBQUFBLEtBQUssQ0FBQzVELGNBQU47QUFFQSxZQUFNNkQsTUFBTSxHQUFHaEgsQ0FBQyxDQUFFLElBQUYsQ0FBaEIsQ0FId0MsQ0FLeEM7O0FBQ0E0RyxRQUFBQSxZQUFZLENBQUVJLE1BQU0sQ0FBQ04sSUFBUCxDQUFhLE9BQWIsQ0FBRixDQUFaO0FBRUFNLFFBQUFBLE1BQU0sQ0FBQ04sSUFBUCxDQUFhLE9BQWIsRUFBc0JHLFVBQVUsQ0FBRSxZQUFXO0FBQzVDRyxVQUFBQSxNQUFNLENBQUNGLFVBQVAsQ0FBbUIsT0FBbkI7QUFFQSxjQUFNckIsUUFBUSxHQUFHdUIsTUFBTSxDQUFDVixHQUFQLEVBQWpCO0FBRUFULFVBQUFBLE1BQU0sQ0FBQ2xCLFVBQVAsQ0FBa0JzQyxHQUFsQixDQUF1QixDQUFFeEIsUUFBRixFQUFZLElBQVosQ0FBdkI7QUFFQWUsVUFBQUEsK0JBQStCLENBQUVYLE1BQU0sQ0FBQ2xCLFVBQVAsQ0FBa0J1QyxHQUFsQixFQUFGLENBQS9CO0FBQ0EsU0FSK0IsRUFRN0I1RyxLQVI2QixDQUFoQztBQVNBLE9BakJEO0FBbUJBc0YsTUFBQUEsU0FBUyxDQUFDNUMsRUFBVixDQUFjLE9BQWQsRUFBdUIsVUFBVStELEtBQVYsRUFBa0I7QUFDeENBLFFBQUFBLEtBQUssQ0FBQzVELGNBQU47QUFFQSxZQUFNNkQsTUFBTSxHQUFHaEgsQ0FBQyxDQUFFLElBQUYsQ0FBaEIsQ0FId0MsQ0FLeEM7O0FBQ0E0RyxRQUFBQSxZQUFZLENBQUVJLE1BQU0sQ0FBQ04sSUFBUCxDQUFhLE9BQWIsQ0FBRixDQUFaO0FBRUFNLFFBQUFBLE1BQU0sQ0FBQ04sSUFBUCxDQUFhLE9BQWIsRUFBc0JHLFVBQVUsQ0FBRSxZQUFXO0FBQzVDRyxVQUFBQSxNQUFNLENBQUNGLFVBQVAsQ0FBbUIsT0FBbkI7QUFFQSxjQUFNcEIsUUFBUSxHQUFHc0IsTUFBTSxDQUFDVixHQUFQLEVBQWpCO0FBRUFULFVBQUFBLE1BQU0sQ0FBQ2xCLFVBQVAsQ0FBa0JzQyxHQUFsQixDQUF1QixDQUFFLElBQUYsRUFBUXZCLFFBQVIsQ0FBdkI7QUFFQWMsVUFBQUEsK0JBQStCLENBQUVYLE1BQU0sQ0FBQ2xCLFVBQVAsQ0FBa0J1QyxHQUFsQixFQUFGLENBQS9CO0FBQ0EsU0FSK0IsRUFRN0I1RyxLQVI2QixDQUFoQztBQVNBLE9BakJEO0FBa0JBLEtBaElEO0FBaUlBOztBQUVEb0UsRUFBQUEsY0FBYzs7QUFFZCxXQUFTeUMsWUFBVCxDQUF1QkgsTUFBdkIsRUFBZ0M7QUFDL0IsUUFBS3BILFlBQVksQ0FBQytCLFdBQWxCLEVBQWdDO0FBQy9CO0FBQ0E7O0FBRUQsUUFBTXlGLGdCQUFnQixHQUFHSixNQUFNLENBQUN2RSxPQUFQLENBQWdCLG1CQUFoQixDQUF6QjtBQUNBLFFBQU1uQixTQUFTLEdBQVU4RixnQkFBZ0IsQ0FBQ2pHLElBQWpCLENBQXVCLGlCQUF2QixDQUF6QjtBQUNBLFFBQU1rRyxPQUFPLEdBQVlELGdCQUFnQixDQUFDakcsSUFBakIsQ0FBdUIsZUFBdkIsQ0FBekI7QUFFQSxRQUFJbUcsV0FBVyxHQUFHLEVBQWxCO0FBQ0EsUUFBSUMsU0FBUyxHQUFLLEtBQWxCLENBVitCLENBWS9COztBQUNBWCxJQUFBQSxZQUFZLENBQUVRLGdCQUFnQixDQUFDVixJQUFqQixDQUF1QixPQUF2QixDQUFGLENBQVo7O0FBRUEsUUFBS1csT0FBTCxFQUFlO0FBQ2QsVUFBTUcsSUFBSSxHQUFHSixnQkFBZ0IsQ0FBQy9GLElBQWpCLENBQXVCLGtCQUF2QixFQUE0Q2lGLEdBQTVDLEVBQWI7QUFDQSxVQUFNbUIsRUFBRSxHQUFLTCxnQkFBZ0IsQ0FBQy9GLElBQWpCLENBQXVCLGdCQUF2QixFQUEwQ2lGLEdBQTFDLEVBQWI7O0FBRUEsVUFBS2tCLElBQUksSUFBSUMsRUFBYixFQUFrQjtBQUNqQkgsUUFBQUEsV0FBVyxHQUFHRSxJQUFJLEdBQUd0SCxvQkFBUCxHQUE4QnVILEVBQTVDO0FBQ0FGLFFBQUFBLFNBQVMsR0FBSyxJQUFkO0FBQ0EsT0FIRCxNQUdPLElBQUssQ0FBRUMsSUFBRixJQUFVLENBQUVDLEVBQWpCLEVBQXNCO0FBQzVCRixRQUFBQSxTQUFTLEdBQUcsSUFBWjtBQUNBO0FBQ0QsS0FWRCxNQVVPO0FBQ04sVUFBTUMsS0FBSSxHQUFHSixnQkFBZ0IsQ0FBQy9GLElBQWpCLENBQXVCLGtCQUF2QixFQUE0Q2lGLEdBQTVDLEVBQWI7O0FBRUEsVUFBS2tCLEtBQUwsRUFBWTtBQUNYRixRQUFBQSxXQUFXLEdBQUdFLEtBQWQ7QUFDQUQsUUFBQUEsU0FBUyxHQUFLLElBQWQ7QUFDQSxPQUhELE1BR087QUFDTkEsUUFBQUEsU0FBUyxHQUFHLElBQVo7QUFDQTtBQUNEOztBQUVELFFBQUtBLFNBQUwsRUFBaUI7QUFDaEJILE1BQUFBLGdCQUFnQixDQUFDVixJQUFqQixDQUF1QixPQUF2QixFQUFnQ0csVUFBVSxDQUFFLFlBQVc7QUFDdERPLFFBQUFBLGdCQUFnQixDQUFDTixVQUFqQixDQUE2QixPQUE3Qjs7QUFFQSxZQUFLUSxXQUFMLEVBQW1CO0FBQ2xCSSxVQUFBQSwwQkFBMEIsQ0FBRXBHLFNBQUYsRUFBYWdHLFdBQWIsQ0FBMUI7QUFDQSxTQUZELE1BRU87QUFDTixjQUFNSyxLQUFLLEdBQUdDLDBCQUEwQixDQUFFdEcsU0FBRixDQUF4QztBQUNBdUcsVUFBQUEsT0FBTyxDQUFDQyxTQUFSLENBQW1CLEVBQW5CLEVBQXVCLEVBQXZCLEVBQTJCSCxLQUEzQjtBQUNBOztBQUVESSxRQUFBQSxjQUFjO0FBQ2QsT0FYeUMsRUFXdkN6SCxLQVh1QyxDQUExQztBQVlBO0FBQ0Q7O0FBRUQsV0FBUzBILGNBQVQsR0FBMEI7QUFDekIsUUFBSyxDQUFFbkksTUFBTSxHQUFHb0ksVUFBaEIsRUFBNkI7QUFDNUI7QUFDQTs7QUFFRCxRQUFJdkcsS0FBSjs7QUFFQSxRQUFLOUIsWUFBWSxDQUFDK0IsV0FBbEIsRUFBZ0M7QUFDL0JELE1BQUFBLEtBQUssR0FBRzFCLENBQUMsQ0FBRVcsdUJBQUYsQ0FBVDtBQUNBLEtBRkQsTUFFTztBQUNOZSxNQUFBQSxLQUFLLEdBQUdYLGlCQUFSO0FBQ0E7O0FBRUQsUUFBTXFHLGdCQUFnQixHQUFHMUYsS0FBSyxDQUFDTCxJQUFOLENBQVksbUJBQVosQ0FBekI7QUFFQSxRQUFNNkcsTUFBTSxHQUFVZCxnQkFBZ0IsQ0FBQ2pHLElBQWpCLENBQXVCLGtCQUF2QixDQUF0QjtBQUNBLFFBQU1nSCxZQUFZLEdBQUlmLGdCQUFnQixDQUFDakcsSUFBakIsQ0FBdUIsZ0NBQXZCLENBQXRCO0FBQ0EsUUFBTWlILGFBQWEsR0FBR2hCLGdCQUFnQixDQUFDakcsSUFBakIsQ0FBdUIsaUNBQXZCLENBQXRCO0FBRUEsUUFBTWtILEtBQUssR0FBR2pCLGdCQUFnQixDQUFDL0YsSUFBakIsQ0FBdUIsa0JBQXZCLENBQWQ7QUFDQSxRQUFNaUgsR0FBRyxHQUFLbEIsZ0JBQWdCLENBQUMvRixJQUFqQixDQUF1QixnQkFBdkIsQ0FBZDtBQUVBZ0gsSUFBQUEsS0FBSyxDQUFDSixVQUFOLENBQWtCO0FBQ2pCTSxNQUFBQSxVQUFVLEVBQUVMLE1BREs7QUFFakJNLE1BQUFBLFVBQVUsRUFBRUwsWUFGSztBQUdqQk0sTUFBQUEsV0FBVyxFQUFFTDtBQUhJLEtBQWxCO0FBTUFFLElBQUFBLEdBQUcsQ0FBQ0wsVUFBSixDQUFnQjtBQUNmTSxNQUFBQSxVQUFVLEVBQUVMLE1BREc7QUFFZk0sTUFBQUEsVUFBVSxFQUFFTCxZQUZHO0FBR2ZNLE1BQUFBLFdBQVcsRUFBRUw7QUFIRSxLQUFoQjtBQU1BQyxJQUFBQSxLQUFLLENBQUNyRixFQUFOLENBQVUsUUFBVixFQUFvQixZQUFXO0FBQzlCLFVBQU1nRSxNQUFNLEdBQUdoSCxDQUFDLENBQUUsSUFBRixDQUFoQjtBQUNBbUgsTUFBQUEsWUFBWSxDQUFFSCxNQUFGLENBQVo7QUFDQSxLQUhEO0FBS0FzQixJQUFBQSxHQUFHLENBQUN0RixFQUFKLENBQVEsUUFBUixFQUFrQixZQUFXO0FBQzVCLFVBQU1nRSxNQUFNLEdBQUdoSCxDQUFDLENBQUUsSUFBRixDQUFoQjtBQUNBbUgsTUFBQUEsWUFBWSxDQUFFSCxNQUFGLENBQVo7QUFDQSxLQUhEO0FBSUE7O0FBRURnQixFQUFBQSxjQUFjOztBQUVkLFdBQVNVLGtCQUFULEdBQThCO0FBQzdCO0FBQ0EsUUFBSzlJLFlBQVksQ0FBQytJLHdCQUFsQixFQUE2QztBQUM1QyxVQUFLOUksTUFBTSxHQUFHNEIsTUFBZCxFQUF1QjtBQUN0QnhCLFFBQUFBLEtBQUssQ0FBQ29CLElBQU4sQ0FBWSxzQ0FBWixFQUFxREksTUFBckQsQ0FBNkQ7QUFDNUQsc0NBQTRCO0FBRGdDLFNBQTdEO0FBR0E7QUFDRDs7QUFFRCxRQUFLLENBQUU3QixZQUFZLENBQUNnSixlQUFwQixFQUFzQztBQUNyQzNJLE1BQUFBLEtBQUssQ0FBQ29CLElBQU4sQ0FBWSx1QkFBWixFQUFzQ0wsSUFBdEMsQ0FBNEMsWUFBVztBQUN0RCxZQUFNNkgsYUFBYSxHQUFHN0ksQ0FBQyxDQUFFLElBQUYsQ0FBdkI7QUFFQTZJLFFBQUFBLGFBQWEsQ0FBQzdGLEVBQWQsQ0FBa0IsUUFBbEIsRUFBNEIsZ0JBQTVCLEVBQThDLFlBQVc7QUFDeEQ2RixVQUFBQSxhQUFhLENBQUNDLE1BQWQ7QUFDQSxTQUZEO0FBR0EsT0FORDtBQVFBO0FBQ0EsS0FwQjRCLENBc0I3Qjs7O0FBQ0E3SSxJQUFBQSxLQUFLLENBQUNvQixJQUFOLENBQVksdUJBQVosRUFBc0NMLElBQXRDLENBQTRDLFlBQVc7QUFDdEQsVUFBTTZILGFBQWEsR0FBRzdJLENBQUMsQ0FBRSxJQUFGLENBQXZCO0FBRUE2SSxNQUFBQSxhQUFhLENBQUM3RixFQUFkLENBQWtCLFFBQWxCLEVBQTRCLFVBQVVDLENBQVYsRUFBYztBQUN6Q0EsUUFBQUEsQ0FBQyxDQUFDRSxjQUFGO0FBQ0EsT0FGRDtBQUlBMEYsTUFBQUEsYUFBYSxDQUFDN0YsRUFBZCxDQUFrQixRQUFsQixFQUE0QixnQkFBNUIsRUFBOEMsVUFBVUMsQ0FBVixFQUFjO0FBQzNEQSxRQUFBQSxDQUFDLENBQUNFLGNBQUY7QUFFQSxZQUFNNEYsS0FBSyxHQUFRL0ksQ0FBQyxDQUFFLElBQUYsQ0FBRCxDQUFVc0csR0FBVixFQUFuQjtBQUNBLFlBQU0wQyxVQUFVLEdBQUcsU0FBbkI7QUFFQXRCLFFBQUFBLDBCQUEwQixDQUFFc0IsVUFBRixFQUFjRCxLQUFkLENBQTFCO0FBQ0FoQixRQUFBQSxjQUFjO0FBQ2QsT0FSRDtBQVNBLEtBaEJEO0FBaUJBOztBQUVEVyxFQUFBQSxrQkFBa0I7O0FBRWxCLFdBQVNPLHlCQUFULENBQW9DQyxRQUFwQyxFQUErQztBQUM5QyxRQUFNQyxRQUFRLEdBQUcsMkJBQWpCOztBQUVBLFFBQUtuSixDQUFDLENBQUVKLFlBQVksQ0FBQ3dKLG1CQUFmLENBQUQsQ0FBc0MvSCxJQUF0QyxDQUE0QzhILFFBQTVDLEVBQXVENUUsTUFBNUQsRUFBcUU7QUFDcEU7QUFDQTs7QUFFRCxRQUFNOEUsZUFBZSxHQUFHSCxRQUFRLENBQUM3SCxJQUFULENBQWU4SCxRQUFmLEVBQTBCOUMsSUFBMUIsRUFBeEI7QUFFQXBHLElBQUFBLEtBQUssQ0FBQ29CLElBQU4sQ0FBWThILFFBQVosRUFBdUI5QyxJQUF2QixDQUE2QmdELGVBQTdCO0FBQ0E7O0FBRUQsV0FBU0Msb0JBQVQsR0FBZ0M7QUFDL0IsUUFBSyxDQUFFMUosWUFBWSxDQUFDMkosaUJBQXBCLEVBQXdDO0FBQ3ZDO0FBQ0E7O0FBRUR2SixJQUFBQSxDQUFDLENBQUN3SixjQUFGLENBQWtCLE1BQWxCLEVBQTBCNUosWUFBWSxDQUFDNkosdUJBQXZDO0FBQ0E7O0FBRUQsV0FBU0Msa0JBQVQsR0FBOEI7QUFDN0IsUUFBSyxnQkFBZ0IsT0FBTy9FLFVBQTVCLEVBQXlDO0FBQ3hDO0FBQ0E7O0FBRUQ3RCxJQUFBQSx3QkFBd0IsQ0FBQ08sSUFBekIsQ0FBK0Isb0JBQS9CLEVBQXNETCxJQUF0RCxDQUE0RCxVQUFVaUMsQ0FBVixFQUFhMEcsT0FBYixFQUF1QjtBQUNsRkEsTUFBQUEsT0FBTyxDQUFDQyxZQUFSLENBQXNCLFVBQXRCLEVBQWtDLElBQWxDO0FBQ0EsS0FGRDtBQUdBOztBQUVELFdBQVNDLGFBQVQsR0FBeUI7QUFDeEIsUUFBTUMsU0FBUyxHQUFHLHVEQUFsQixDQUR3QixDQUd4Qjs7QUFDQWxKLElBQUFBLG1CQUFtQixDQUFDUyxJQUFwQixDQUEwQnlJLFNBQTFCLEVBQXNDQyxRQUF0QyxDQUFnRCxVQUFoRDtBQUNBOztBQUVELFdBQVNDLGFBQVQsR0FBeUI7QUFDeEIsUUFBSyxDQUFFcEssWUFBWSxDQUFDcUsscUNBQXBCLEVBQTREO0FBQzNEO0FBQ0E7O0FBRUQsUUFBTUMsTUFBTSxHQUFHLGVBQWY7QUFFQXRKLElBQUFBLG1CQUFtQixDQUFDUyxJQUFwQixDQUEwQjZJLE1BQTFCLEVBQW1DL0ksSUFBbkMsQ0FBeUMsVUFBekMsRUFBcUQsVUFBckQ7QUFDQVAsSUFBQUEsbUJBQW1CLENBQUNTLElBQXBCLENBQTBCNkksTUFBMUIsRUFBbUMzRCxPQUFuQyxDQUE0QyxnQkFBNUM7QUFFQW1ELElBQUFBLGtCQUFrQjtBQUNsQkcsSUFBQUEsYUFBYTtBQUNiOztBQUVELFdBQVNNLGlCQUFULEdBQTZCO0FBQzVCLFFBQUssZ0JBQWdCLE9BQU94RixVQUE1QixFQUF5QztBQUN4QztBQUNBOztBQUVEN0QsSUFBQUEsd0JBQXdCLENBQUNPLElBQXpCLENBQStCLG9CQUEvQixFQUFzREwsSUFBdEQsQ0FBNEQsVUFBVWlDLENBQVYsRUFBYTBHLE9BQWIsRUFBdUI7QUFDbEZBLE1BQUFBLE9BQU8sQ0FBQ1MsZUFBUixDQUF5QixVQUF6QjtBQUNBLEtBRkQ7QUFHQTs7QUFFRCxXQUFTQyxZQUFULEdBQXdCO0FBQ3ZCLFFBQUssQ0FBRXpLLFlBQVksQ0FBQ3FLLHFDQUFwQixFQUE0RDtBQUMzRDtBQUNBOztBQUVELFFBQU1DLE1BQU0sR0FBRyxPQUFmO0FBRUFwSixJQUFBQSx3QkFBd0IsQ0FBQ08sSUFBekIsQ0FBK0I2SSxNQUEvQixFQUF3Q0ksVUFBeEMsQ0FBb0QsVUFBcEQ7QUFDQXZKLElBQUFBLGlCQUFpQixDQUFDTSxJQUFsQixDQUF3QjZJLE1BQXhCLEVBQWlDSSxVQUFqQyxDQUE2QyxVQUE3QztBQUVBSCxJQUFBQSxpQkFBaUI7QUFDakI7O0FBRUQsV0FBU0kscUJBQVQsR0FBaUM7QUFDaEMsUUFBSyxDQUFFM0ssWUFBWSxDQUFDMkosaUJBQXBCLEVBQXdDO0FBQ3ZDO0FBQ0E7O0FBRUR2SixJQUFBQSxDQUFDLENBQUN3SixjQUFGLENBQWtCLE1BQWxCO0FBQ0E7O0FBRUQsV0FBU2dCLFFBQVQsR0FBb0I7QUFDbkIsUUFBSyxXQUFXNUssWUFBWSxDQUFDNkssYUFBN0IsRUFBNkM7QUFDNUM7QUFDQTs7QUFFRCxRQUFNQyxTQUFTLEdBQUc5SyxZQUFZLENBQUMrSyxpQkFBL0I7QUFDQSxRQUFNQyxRQUFRLEdBQUloTCxZQUFZLENBQUNpTCxTQUEvQjtBQUNBLFFBQUlDLE9BQU8sR0FBTyxLQUFsQjs7QUFFQSxRQUFLLGFBQWFKLFNBQWIsSUFBMEJFLFFBQS9CLEVBQTBDO0FBQ3pDRSxNQUFBQSxPQUFPLEdBQUcsSUFBVjtBQUNBLEtBRkQsTUFFTyxJQUFLLGNBQWNKLFNBQWQsSUFBMkIsQ0FBRUUsUUFBbEMsRUFBNkM7QUFDbkRFLE1BQUFBLE9BQU8sR0FBRyxJQUFWO0FBQ0EsS0FGTSxNQUVBLElBQUssV0FBV0osU0FBaEIsRUFBNEI7QUFDbENJLE1BQUFBLE9BQU8sR0FBRyxJQUFWO0FBQ0E7O0FBRUQsUUFBSyxDQUFFQSxPQUFQLEVBQWlCO0FBQ2hCO0FBQ0E7O0FBRUQsUUFBSUMsZUFBSixFQUFxQkMsTUFBckI7O0FBRUEsUUFBS3BMLFlBQVksQ0FBQ3FMLG9CQUFsQixFQUF5QztBQUN4Q0YsTUFBQUEsZUFBZSxHQUFHM0ssUUFBUSxDQUFFUixZQUFZLENBQUNxTCxvQkFBZixDQUExQjtBQUNBOztBQUVELFFBQUlDLFNBQUo7O0FBRUEsUUFBS2xMLENBQUMsQ0FBRUosWUFBWSxDQUFDd0osbUJBQWYsQ0FBRCxDQUFzQzdFLE1BQTNDLEVBQW9EO0FBQ25EMkcsTUFBQUEsU0FBUyxHQUFHdEwsWUFBWSxDQUFDd0osbUJBQXpCO0FBQ0EsS0FGRCxNQUVPLElBQUtwSixDQUFDLENBQUVKLFlBQVksQ0FBQ3VMLG1CQUFmLENBQUQsQ0FBc0M1RyxNQUEzQyxFQUFvRDtBQUMxRDJHLE1BQUFBLFNBQVMsR0FBR3RMLFlBQVksQ0FBQ3VMLG1CQUF6QjtBQUNBOztBQUVELFFBQUssYUFBYXZMLFlBQVksQ0FBQzZLLGFBQS9CLEVBQStDO0FBQzlDUyxNQUFBQSxTQUFTLEdBQUd0TCxZQUFZLENBQUN3TCw0QkFBekI7QUFDQTs7QUFFRCxRQUFNQyxVQUFVLEdBQUdyTCxDQUFDLENBQUVrTCxTQUFGLENBQXBCOztBQUVBLFFBQUtHLFVBQVUsQ0FBQzlHLE1BQWhCLEVBQXlCO0FBQ3hCeUcsTUFBQUEsTUFBTSxHQUFHSyxVQUFVLENBQUNMLE1BQVgsR0FBb0JNLEdBQXBCLEdBQTBCUCxlQUFuQzs7QUFFQSxVQUFLQyxNQUFNLEdBQUcsQ0FBZCxFQUFrQjtBQUNqQkEsUUFBQUEsTUFBTSxHQUFHLENBQVQ7QUFDQTs7QUFFRGhMLE1BQUFBLENBQUMsQ0FBRSxZQUFGLENBQUQsQ0FBa0J1TCxJQUFsQixHQUF5QkMsT0FBekIsQ0FDQztBQUFFQyxRQUFBQSxTQUFTLEVBQUVUO0FBQWIsT0FERCxFQUVDcEwsWUFBWSxDQUFDOEwsbUJBRmQsRUFHQzlMLFlBQVksQ0FBQytMLG9CQUhkO0FBS0E7QUFDRCxHQXRsQnNDLENBd2xCdkM7OztBQUNBLFdBQVNDLHNCQUFULEdBQWtDO0FBQ2pDNUIsSUFBQUEsYUFBYTtBQUNiVixJQUFBQSxvQkFBb0I7O0FBRXBCLFFBQUssa0JBQWtCMUosWUFBWSxDQUFDaU0sa0JBQXBDLEVBQXlEO0FBQ3hEckIsTUFBQUEsUUFBUTtBQUNSOztBQUVEdkssSUFBQUEsS0FBSyxDQUFDc0csT0FBTixDQUFlLGdDQUFmO0FBQ0E7O0FBRUQsV0FBU3VGLHNCQUFULENBQWlDNUMsUUFBakMsRUFBNEM7QUFDM0NxQixJQUFBQSxxQkFBcUI7QUFFckJ0SyxJQUFBQSxLQUFLLENBQUNzRyxPQUFOLENBQWUsZ0NBQWYsRUFBaUQsQ0FBRTJDLFFBQUYsQ0FBakQ7QUFDQSxHQXhtQnNDLENBMG1CdkM7OztBQUNBLFdBQVM2QyxxQkFBVCxDQUFnQzdDLFFBQWhDLEVBQTJDO0FBQzFDMUgsSUFBQUEsVUFBVTtBQUNWWSxJQUFBQSxzQkFBc0I7QUFDdEJzQyxJQUFBQSxjQUFjO0FBQ2RzRCxJQUFBQSxjQUFjO0FBQ2RVLElBQUFBLGtCQUFrQjtBQUNsQk8sSUFBQUEseUJBQXlCLENBQUVDLFFBQUYsQ0FBekI7QUFDQW1CLElBQUFBLFlBQVk7O0FBRVosUUFBSyxZQUFZekssWUFBWSxDQUFDaU0sa0JBQTlCLEVBQW1EO0FBQ2xEckIsTUFBQUEsUUFBUTtBQUNSOztBQUVEdkssSUFBQUEsS0FBSyxDQUFDc0csT0FBTixDQUFlLCtCQUFmLEVBQWdELENBQUUyQyxRQUFGLENBQWhEO0FBQ0EsR0F6bkJzQyxDQTJuQnZDOzs7QUFDQSxXQUFTbkIsY0FBVCxHQUFpRDtBQUFBLFFBQXhCaUUsYUFBd0IsdUVBQVIsS0FBUTs7QUFDaEQsUUFBS3BNLFlBQVksQ0FBQytCLFdBQWxCLEVBQWdDO0FBQy9CO0FBQ0E7O0FBRURpSyxJQUFBQSxzQkFBc0I7QUFFdEI1TCxJQUFBQSxDQUFDLENBQUNrSCxHQUFGLENBQU8rRSxNQUFNLENBQUNDLFFBQVAsQ0FBZ0JDLElBQXZCLEVBQTZCLFVBQVV6RixJQUFWLEVBQWlCO0FBQzdDLFVBQU0wRixLQUFLLEdBQUdwTSxDQUFDLENBQUUwRyxJQUFGLENBQWYsQ0FENkMsQ0FHN0M7O0FBQ0ExRyxNQUFBQSxDQUFDLENBQUNnQixJQUFGLENBQVFULE1BQVIsRUFBZ0IsVUFBVVcsRUFBVixFQUFlO0FBQzlCLFlBQU1tTCxPQUFPLEdBQU0sZUFBZW5MLEVBQWYsR0FBb0IsSUFBdkM7QUFDQSxZQUFNRCxNQUFNLEdBQU9qQixDQUFDLENBQUVxTSxPQUFGLENBQXBCO0FBQ0EsWUFBTUMsTUFBTSxHQUFPckwsTUFBTSxDQUFDSSxJQUFQLENBQWEsb0JBQWIsQ0FBbkI7O0FBQ0EsWUFBTWtMLE1BQU0sR0FBT0gsS0FBSyxDQUFDL0ssSUFBTixDQUFZZ0wsT0FBWixDQUFuQjs7QUFDQSxZQUFJRyxZQUFZLEdBQUd4TSxDQUFDLENBQUV1TSxNQUFGLENBQUQsQ0FBWXBMLElBQVosQ0FBa0IsT0FBbEIsQ0FBbkIsQ0FMOEIsQ0FPOUI7O0FBQ0EsWUFBS3ZCLFlBQVksQ0FBQzZNLGtDQUFsQixFQUF1RDtBQUN0RCxjQUFLeEwsTUFBTSxDQUFDNkQsUUFBUCxDQUFpQixxQkFBakIsQ0FBTCxFQUFnRDtBQUMvQzdELFlBQUFBLE1BQU0sQ0FBQ0ksSUFBUCxDQUFhLG9DQUFiLEVBQW9ETCxJQUFwRCxDQUEwRCxZQUFXO0FBQ3BFLGtCQUFNMEwsU0FBUyxHQUFRMU0sQ0FBQyxDQUFFLElBQUYsQ0FBRCxDQUFVMk0sTUFBVixHQUFtQmpLLFFBQW5CLENBQTZCLE9BQTdCLEVBQXVDNEQsR0FBdkMsRUFBdkI7QUFDQSxrQkFBTXNHLGNBQWMsR0FBRyxrQkFBa0JGLFNBQWxCLEdBQThCLGtDQUFyRDtBQUNBLGtCQUFNRyxVQUFVLEdBQU8sa0JBQWtCSCxTQUFsQixHQUE4QixTQUFyRDtBQUNBLGtCQUFNSSxRQUFRLEdBQVMsbUNBQXZCOztBQUVBUCxjQUFBQSxNQUFNLENBQUNsTCxJQUFQLENBQWF1TCxjQUFiLEVBQThCekwsSUFBOUIsQ0FBb0MsT0FBcEMsRUFBNkMyTCxRQUE3Qzs7QUFDQVAsY0FBQUEsTUFBTSxDQUFDbEwsSUFBUCxDQUFhd0wsVUFBYixFQUEwQkUsSUFBMUI7QUFDQSxhQVJEO0FBU0E7QUFDRDs7QUFFRCxZQUFNQyxLQUFLLEdBQUdULE1BQU0sQ0FBQ2xMLElBQVAsQ0FBYSxvQkFBYixFQUFvQ2dGLElBQXBDLEVBQWQsQ0F0QjhCLENBd0I5Qjs7O0FBQ0EsWUFBTTRHLGlCQUFpQixHQUFHLG1CQUExQjs7QUFFQSxZQUFLaE0sTUFBTSxDQUFDNkQsUUFBUCxDQUFpQm1JLGlCQUFqQixDQUFMLEVBQTRDO0FBQzNDLGNBQUssQ0FBRVYsTUFBTSxDQUFDekgsUUFBUCxDQUFpQm1JLGlCQUFqQixDQUFQLEVBQThDO0FBQzdDVCxZQUFBQSxZQUFZLElBQUksTUFBTVMsaUJBQXRCO0FBQ0E7QUFDRCxTQUpELE1BSU87QUFDTlQsVUFBQUEsWUFBWSxHQUFHQSxZQUFZLENBQUMvSSxPQUFiLENBQXNCd0osaUJBQXRCLEVBQXlDLEVBQXpDLENBQWY7QUFDQSxTQWpDNkIsQ0FtQzlCOzs7QUFDQWhNLFFBQUFBLE1BQU0sQ0FBQ0UsSUFBUCxDQUFhLE9BQWIsRUFBc0JxTCxZQUFZLENBQUNVLElBQWIsRUFBdEIsRUFwQzhCLENBc0M5Qjs7QUFDQSxZQUFLbEIsYUFBTCxFQUFxQjtBQUVwQjtBQUNBTSxVQUFBQSxNQUFNLENBQUNqRyxJQUFQLENBQWEyRyxLQUFiO0FBRUEsU0FMRCxNQUtPO0FBRU47QUFDQSxjQUFLL0wsTUFBTSxDQUFDNkQsUUFBUCxDQUFpQixrQkFBakIsQ0FBTCxFQUE2QztBQUU1QztBQUNBd0gsWUFBQUEsTUFBTSxDQUFDakcsSUFBUCxDQUFhMkcsS0FBYjtBQUVBO0FBRUQ7O0FBRUQvTCxRQUFBQSxNQUFNLENBQUNzRixPQUFQLENBQWdCLHFCQUFoQixFQUF1QyxDQUFFZ0csTUFBRixDQUF2QztBQUNBLE9BekREO0FBMkRBVCxNQUFBQSxzQkFBc0IsQ0FBRU0sS0FBRixDQUF0QixDQS9ENkMsQ0FpRTdDOztBQUNBLFVBQU1lLGtCQUFrQixHQUFHZixLQUFLLENBQUMvSyxJQUFOLENBQVl6QixZQUFZLENBQUN3SixtQkFBekIsQ0FBM0I7QUFDQSxVQUFNZ0Usa0JBQWtCLEdBQUdoQixLQUFLLENBQUMvSyxJQUFOLENBQVl6QixZQUFZLENBQUN1TCxtQkFBekIsQ0FBM0I7O0FBRUEsVUFBS3ZMLFlBQVksQ0FBQ3dKLG1CQUFiLEtBQXFDeEosWUFBWSxDQUFDdUwsbUJBQXZELEVBQTZFO0FBQzVFbkwsUUFBQUEsQ0FBQyxDQUFFSixZQUFZLENBQUN3SixtQkFBZixDQUFELENBQXNDL0MsSUFBdEMsQ0FBNEM4RyxrQkFBa0IsQ0FBQzlHLElBQW5CLEVBQTVDO0FBQ0EsT0FGRCxNQUVPO0FBQ04sWUFBS3JHLENBQUMsQ0FBRUosWUFBWSxDQUFDdUwsbUJBQWYsQ0FBRCxDQUFzQzVHLE1BQTNDLEVBQW9EO0FBQ25ELGNBQUs0SSxrQkFBa0IsQ0FBQzVJLE1BQXhCLEVBQWlDO0FBQ2hDdkUsWUFBQUEsQ0FBQyxDQUFFSixZQUFZLENBQUN1TCxtQkFBZixDQUFELENBQXNDOUUsSUFBdEMsQ0FBNEM4RyxrQkFBa0IsQ0FBQzlHLElBQW5CLEVBQTVDO0FBQ0EsV0FGRCxNQUVPLElBQUsrRyxrQkFBa0IsQ0FBQzdJLE1BQXhCLEVBQWlDO0FBQ3ZDdkUsWUFBQUEsQ0FBQyxDQUFFSixZQUFZLENBQUN1TCxtQkFBZixDQUFELENBQXNDOUUsSUFBdEMsQ0FBNEMrRyxrQkFBa0IsQ0FBQy9HLElBQW5CLEVBQTVDO0FBQ0E7QUFDRCxTQU5ELE1BTU8sSUFBS3JHLENBQUMsQ0FBRUosWUFBWSxDQUFDd0osbUJBQWYsQ0FBRCxDQUFzQzdFLE1BQTNDLEVBQW9EO0FBQzFELGNBQUs0SSxrQkFBa0IsQ0FBQzVJLE1BQXhCLEVBQWlDO0FBQ2hDdkUsWUFBQUEsQ0FBQyxDQUFFSixZQUFZLENBQUN3SixtQkFBZixDQUFELENBQXNDL0MsSUFBdEMsQ0FBNEM4RyxrQkFBa0IsQ0FBQzlHLElBQW5CLEVBQTVDO0FBQ0EsV0FGRCxNQUVPLElBQUsrRyxrQkFBa0IsQ0FBQzdJLE1BQXhCLEVBQWlDO0FBQ3ZDdkUsWUFBQUEsQ0FBQyxDQUFFSixZQUFZLENBQUN3SixtQkFBZixDQUFELENBQXNDL0MsSUFBdEMsQ0FBNEMrRyxrQkFBa0IsQ0FBQy9HLElBQW5CLEVBQTVDO0FBQ0E7QUFDRDtBQUNEOztBQUVEMEYsTUFBQUEscUJBQXFCLENBQUVLLEtBQUYsQ0FBckI7QUFDQSxLQXhGRDtBQXlGQSxHQTV0QnNDLENBOHRCdkM7OztBQUNBLFdBQVNpQixVQUFULENBQXFCMUcsR0FBckIsRUFBMkI7QUFDMUIsUUFBSTJHLElBQUksR0FBRyxFQUFYO0FBQUEsUUFBZUMsSUFBZjs7QUFFQSxRQUFLLE9BQU81RyxHQUFQLEtBQWUsV0FBcEIsRUFBa0M7QUFDakNBLE1BQUFBLEdBQUcsR0FBR3NGLE1BQU0sQ0FBQ0MsUUFBUCxDQUFnQkMsSUFBdEI7QUFDQTs7QUFFRHhGLElBQUFBLEdBQUcsR0FBR0EsR0FBRyxDQUFDNkcsVUFBSixDQUFnQixLQUFoQixFQUF1QixHQUF2QixDQUFOO0FBRUEsUUFBTUMsTUFBTSxHQUFJOUcsR0FBRyxDQUFDK0csS0FBSixDQUFXL0csR0FBRyxDQUFDZ0gsT0FBSixDQUFhLEdBQWIsSUFBcUIsQ0FBaEMsRUFBb0NySixLQUFwQyxDQUEyQyxHQUEzQyxDQUFoQjtBQUNBLFFBQU1zSixPQUFPLEdBQUdILE1BQU0sQ0FBQ2xKLE1BQXZCOztBQUVBLFNBQU0sSUFBSXNKLENBQUMsR0FBRyxDQUFkLEVBQWlCQSxDQUFDLEdBQUdELE9BQXJCLEVBQThCQyxDQUFDLEVBQS9CLEVBQW9DO0FBQ25DTixNQUFBQSxJQUFJLEdBQUdFLE1BQU0sQ0FBRUksQ0FBRixDQUFOLENBQVl2SixLQUFaLENBQW1CLEdBQW5CLENBQVA7QUFFQWdKLE1BQUFBLElBQUksQ0FBRUMsSUFBSSxDQUFFLENBQUYsQ0FBTixDQUFKLEdBQW9CQSxJQUFJLENBQUUsQ0FBRixDQUF4QjtBQUNBOztBQUVELFdBQU9ELElBQVA7QUFDQSxHQWx2QnNDLENBb3ZCdkM7OztBQUNBLFdBQVNRLGFBQVQsR0FBeUI7QUFDeEIsUUFBSW5ILEdBQUcsR0FBa0JzRixNQUFNLENBQUNDLFFBQVAsQ0FBZ0JDLElBQXpDO0FBQ0EsUUFBTTRCLE1BQU0sR0FBYVYsVUFBVSxDQUFFMUcsR0FBRixDQUFuQztBQUNBLFFBQU1xSCxnQkFBZ0IsR0FBRzVOLFFBQVEsQ0FBRXVHLEdBQUcsQ0FBQ2xELE9BQUosQ0FBYSxrQkFBYixFQUFpQyxJQUFqQyxDQUFGLENBQWpDOztBQUVBLFFBQUt1SyxnQkFBTCxFQUF3QjtBQUN2QixVQUFLQSxnQkFBZ0IsR0FBRyxDQUF4QixFQUE0QjtBQUMzQnJILFFBQUFBLEdBQUcsR0FBR0EsR0FBRyxDQUFDbEQsT0FBSixDQUFhLGFBQWIsRUFBNEIsUUFBNUIsQ0FBTjtBQUNBO0FBQ0QsS0FKRCxNQUlPLElBQUssT0FBT3NLLE1BQU0sQ0FBRSxPQUFGLENBQWIsS0FBNkIsV0FBbEMsRUFBZ0Q7QUFDdEQsVUFBTUUsbUJBQW1CLEdBQUc3TixRQUFRLENBQUUyTixNQUFNLENBQUUsT0FBRixDQUFSLENBQXBDOztBQUVBLFVBQUtFLG1CQUFtQixHQUFHLENBQTNCLEVBQStCO0FBQzlCdEgsUUFBQUEsR0FBRyxHQUFHQSxHQUFHLENBQUNsRCxPQUFKLENBQWEsV0FBV3dLLG1CQUF4QixFQUE2QyxTQUE3QyxDQUFOO0FBQ0E7QUFDRDs7QUFFRCxXQUFPdEgsR0FBUDtBQUNBLEdBdndCc0MsQ0F5d0J2Qzs7O0FBQ0EsV0FBU2UsMEJBQVQsQ0FBcUN4RSxHQUFyQyxFQUEwQ2dMLEtBQTFDLEVBQWlEQyxXQUFqRCxFQUE4RHhILEdBQTlELEVBQW9FO0FBQ25FLFFBQUssT0FBT3dILFdBQVAsS0FBdUIsV0FBNUIsRUFBMEM7QUFDekNBLE1BQUFBLFdBQVcsR0FBRyxJQUFkO0FBQ0E7O0FBRUQsUUFBSyxPQUFPeEgsR0FBUCxLQUFlLFdBQXBCLEVBQWtDO0FBQ2pDQSxNQUFBQSxHQUFHLEdBQUdtSCxhQUFhLEVBQW5CO0FBQ0E7O0FBRUQsUUFBTU0sRUFBRSxHQUFVLElBQUlDLE1BQUosQ0FBWSxXQUFXbkwsR0FBWCxHQUFpQixXQUE3QixFQUEwQyxHQUExQyxDQUFsQjtBQUNBLFFBQU1vTCxTQUFTLEdBQUczSCxHQUFHLENBQUNnSCxPQUFKLENBQWEsR0FBYixNQUF1QixDQUFDLENBQXhCLEdBQTRCLEdBQTVCLEdBQWtDLEdBQXBEO0FBQ0EsUUFBSVksWUFBSjs7QUFFQSxRQUFLNUgsR0FBRyxDQUFDNkgsS0FBSixDQUFXSixFQUFYLENBQUwsRUFBdUI7QUFDdEJHLE1BQUFBLFlBQVksR0FBRzVILEdBQUcsQ0FBQ2xELE9BQUosQ0FBYTJLLEVBQWIsRUFBaUIsT0FBT2xMLEdBQVAsR0FBYSxHQUFiLEdBQW1CZ0wsS0FBbkIsR0FBMkIsSUFBNUMsQ0FBZjtBQUNBLEtBRkQsTUFFTztBQUNOSyxNQUFBQSxZQUFZLEdBQUc1SCxHQUFHLEdBQUcySCxTQUFOLEdBQWtCcEwsR0FBbEIsR0FBd0IsR0FBeEIsR0FBOEJnTCxLQUE3QztBQUNBOztBQUVELFFBQUtDLFdBQVcsS0FBSyxJQUFyQixFQUE0QjtBQUMzQixhQUFPdEcsT0FBTyxDQUFDQyxTQUFSLENBQW1CLEVBQW5CLEVBQXVCLEVBQXZCLEVBQTJCeUcsWUFBM0IsQ0FBUDtBQUNBLEtBRkQsTUFFTztBQUNOLGFBQU9BLFlBQVA7QUFDQTtBQUNELEdBbHlCc0MsQ0FveUJ2Qzs7O0FBQ0EsV0FBUzNHLDBCQUFULENBQXFDdEcsU0FBckMsRUFBZ0RxRixHQUFoRCxFQUFzRDtBQUNyRCxRQUFLLE9BQU9BLEdBQVAsS0FBZSxXQUFwQixFQUFrQztBQUNqQ0EsTUFBQUEsR0FBRyxHQUFHbUgsYUFBYSxFQUFuQjtBQUNBOztBQUVELFFBQU1XLFNBQVMsR0FBV3BCLFVBQVUsQ0FBRTFHLEdBQUYsQ0FBcEM7QUFDQSxRQUFNK0gsZUFBZSxHQUFLQyxNQUFNLENBQUNDLElBQVAsQ0FBYUgsU0FBYixFQUF5QmxLLE1BQW5EO0FBQ0EsUUFBTXNLLGFBQWEsR0FBT2xJLEdBQUcsQ0FBQ2dILE9BQUosQ0FBYSxHQUFiLENBQTFCO0FBQ0EsUUFBTW1CLGlCQUFpQixHQUFHbkksR0FBRyxDQUFDZ0gsT0FBSixDQUFhck0sU0FBYixDQUExQjtBQUNBLFFBQUl5TixRQUFKLEVBQWNDLFVBQWQ7O0FBRUEsUUFBS04sZUFBZSxHQUFHLENBQXZCLEVBQTJCO0FBQzFCLFVBQU9JLGlCQUFpQixHQUFHRCxhQUF0QixHQUF3QyxDQUE3QyxFQUFpRDtBQUNoREUsUUFBQUEsUUFBUSxHQUFHcEksR0FBRyxDQUFDbEQsT0FBSixDQUFhLE1BQU1uQyxTQUFOLEdBQWtCLEdBQWxCLEdBQXdCbU4sU0FBUyxDQUFFbk4sU0FBRixDQUE5QyxFQUE2RCxFQUE3RCxDQUFYO0FBQ0EsT0FGRCxNQUVPO0FBQ055TixRQUFBQSxRQUFRLEdBQUdwSSxHQUFHLENBQUNsRCxPQUFKLENBQWFuQyxTQUFTLEdBQUcsR0FBWixHQUFrQm1OLFNBQVMsQ0FBRW5OLFNBQUYsQ0FBM0IsR0FBMkMsR0FBeEQsRUFBNkQsRUFBN0QsQ0FBWDtBQUNBOztBQUVELFVBQU0yTixTQUFTLEdBQUdGLFFBQVEsQ0FBQ3pLLEtBQVQsQ0FBZ0IsR0FBaEIsQ0FBbEI7QUFDQTBLLE1BQUFBLFVBQVUsR0FBUSxNQUFNQyxTQUFTLENBQUUsQ0FBRixDQUFqQztBQUNBLEtBVEQsTUFTTztBQUNORCxNQUFBQSxVQUFVLEdBQUdySSxHQUFHLENBQUNsRCxPQUFKLENBQWEsTUFBTW5DLFNBQU4sR0FBa0IsR0FBbEIsR0FBd0JtTixTQUFTLENBQUVuTixTQUFGLENBQTlDLEVBQTZELEVBQTdELENBQWI7QUFDQTs7QUFFRCxXQUFPME4sVUFBUDtBQUNBLEdBOXpCc0MsQ0FnMEJ2Qzs7O0FBQ0EsV0FBU0UsY0FBVCxDQUF5QjVOLFNBQXpCLEVBQW9DZ0csV0FBcEMsRUFBOEU7QUFBQSxRQUE3QjZILGFBQTZCLHVFQUFiLEtBQWE7QUFBQSxRQUFOeEksR0FBTTtBQUM3RSxRQUFNeUksY0FBYyxHQUFHLEdBQXZCO0FBRUEsUUFBSXJCLE1BQUo7QUFBQSxRQUFZc0IsVUFBWjtBQUFBLFFBQXdCQyxVQUFVLEdBQUcsS0FBckM7O0FBRUEsUUFBSyxPQUFPM0ksR0FBUCxLQUFlLFdBQXBCLEVBQWtDO0FBQ2pDb0gsTUFBQUEsTUFBTSxHQUFHVixVQUFVLENBQUUxRyxHQUFGLENBQW5CO0FBQ0EsS0FGRCxNQUVPO0FBQ05vSCxNQUFBQSxNQUFNLEdBQUdWLFVBQVUsRUFBbkI7QUFDQTs7QUFFRCxRQUFLLE9BQU9VLE1BQU0sQ0FBRXpNLFNBQUYsQ0FBYixJQUE4QixXQUFuQyxFQUFpRDtBQUNoRCxVQUFNaU8sVUFBVSxHQUFReEIsTUFBTSxDQUFFek0sU0FBRixDQUE5QjtBQUNBLFVBQU1rTyxlQUFlLEdBQUdELFVBQVUsQ0FBQ2pMLEtBQVgsQ0FBa0I4SyxjQUFsQixDQUF4Qjs7QUFFQSxVQUFLRyxVQUFVLENBQUNoTCxNQUFYLEdBQW9CLENBQXpCLEVBQTZCO0FBQzVCLFlBQU1rTCxLQUFLLEdBQUd6UCxDQUFDLENBQUMwUCxPQUFGLENBQVdwSSxXQUFYLEVBQXdCa0ksZUFBeEIsQ0FBZDs7QUFFQSxZQUFLQyxLQUFLLElBQUksQ0FBZCxFQUFrQjtBQUNqQjtBQUNBRCxVQUFBQSxlQUFlLENBQUNHLE1BQWhCLENBQXdCRixLQUF4QixFQUErQixDQUEvQjs7QUFFQSxjQUFLRCxlQUFlLENBQUNqTCxNQUFoQixLQUEyQixDQUFoQyxFQUFvQztBQUNuQytLLFlBQUFBLFVBQVUsR0FBRyxJQUFiO0FBQ0E7QUFDRCxTQVBELE1BT087QUFDTjtBQUNBRSxVQUFBQSxlQUFlLENBQUNJLElBQWhCLENBQXNCdEksV0FBdEI7QUFDQTs7QUFFRCxZQUFLa0ksZUFBZSxDQUFDakwsTUFBaEIsR0FBeUIsQ0FBOUIsRUFBa0M7QUFDakM4SyxVQUFBQSxVQUFVLEdBQUdHLGVBQWUsQ0FBQy9LLElBQWhCLENBQXNCMkssY0FBdEIsQ0FBYjtBQUNBLFNBRkQsTUFFTztBQUNOQyxVQUFBQSxVQUFVLEdBQUdHLGVBQWI7QUFDQTtBQUNELE9BcEJELE1Bb0JPO0FBQ05ILFFBQUFBLFVBQVUsR0FBRy9ILFdBQWI7QUFDQTtBQUNELEtBM0JELE1BMkJPO0FBQ04rSCxNQUFBQSxVQUFVLEdBQUcvSCxXQUFiO0FBQ0EsS0F4QzRFLENBMEM3RTs7O0FBQ0EsUUFBSyxDQUFFZ0ksVUFBUCxFQUFvQjtBQUNuQjVILE1BQUFBLDBCQUEwQixDQUFFcEcsU0FBRixFQUFhK04sVUFBYixDQUExQjtBQUNBLEtBRkQsTUFFTztBQUNOLFVBQU0xSCxLQUFLLEdBQUdDLDBCQUEwQixDQUFFdEcsU0FBRixDQUF4QztBQUNBdUcsTUFBQUEsT0FBTyxDQUFDQyxTQUFSLENBQW1CLEVBQW5CLEVBQXVCLEVBQXZCLEVBQTJCSCxLQUEzQjtBQUNBOztBQUVESSxJQUFBQSxjQUFjLENBQUVvSCxhQUFGLENBQWQ7QUFDQTs7QUFFRCxXQUFTVSxZQUFULENBQXVCdk8sU0FBdkIsRUFBa0NnRyxXQUFsQyxFQUFnRDtBQUMvQyxRQUFNeUcsTUFBTSxHQUFHVixVQUFVLEVBQXpCO0FBQ0EsUUFBSTFGLEtBQUo7O0FBRUEsUUFBSyxPQUFPb0csTUFBTSxDQUFFek0sU0FBRixDQUFiLEtBQStCLFdBQS9CLElBQThDeU0sTUFBTSxDQUFFek0sU0FBRixDQUFOLEtBQXdCZ0csV0FBM0UsRUFBeUY7QUFDeEZLLE1BQUFBLEtBQUssR0FBR0MsMEJBQTBCLENBQUV0RyxTQUFGLENBQWxDO0FBQ0EsS0FGRCxNQUVPO0FBQ05xRyxNQUFBQSxLQUFLLEdBQUdELDBCQUEwQixDQUFFcEcsU0FBRixFQUFhZ0csV0FBYixFQUEwQixLQUExQixDQUFsQztBQUNBLEtBUjhDLENBVS9DOzs7QUFDQU8sSUFBQUEsT0FBTyxDQUFDQyxTQUFSLENBQW1CLEVBQW5CLEVBQXVCLEVBQXZCLEVBQTJCSCxLQUEzQjtBQUVBSSxJQUFBQSxjQUFjO0FBQ2QsR0FwNEJzQyxDQXM0QnZDOzs7QUFDQSxNQUFLbkksWUFBWSxDQUFDa1EsMEJBQWIsSUFBMkNsUSxZQUFZLENBQUNtUSxvQkFBN0QsRUFBb0Y7QUFDbkYsUUFBTTFFLFVBQVUsR0FBR3JMLENBQUMsQ0FBRUosWUFBWSxDQUFDd0osbUJBQWYsQ0FBcEI7QUFDQSxRQUFNRCxRQUFRLEdBQUt2SixZQUFZLENBQUNtUSxvQkFBYixHQUFvQyxJQUF2RCxDQUZtRixDQUluRjs7QUFDQSxRQUFLMUUsVUFBVSxDQUFDOUcsTUFBaEIsRUFBeUI7QUFDeEI4RyxNQUFBQSxVQUFVLENBQUNySSxFQUFYLENBQWUsT0FBZixFQUF3Qm1HLFFBQXhCLEVBQWtDLFVBQVVsRyxDQUFWLEVBQWM7QUFDL0NBLFFBQUFBLENBQUMsQ0FBQ0UsY0FBRjtBQUVBLFlBQU0rSSxRQUFRLEdBQUdsTSxDQUFDLENBQUUsSUFBRixDQUFELENBQVVtQixJQUFWLENBQWdCLE1BQWhCLENBQWpCO0FBRUEwRyxRQUFBQSxPQUFPLENBQUNDLFNBQVIsQ0FBbUIsRUFBbkIsRUFBdUIsRUFBdkIsRUFBMkJvRSxRQUEzQjtBQUVBbkUsUUFBQUEsY0FBYztBQUNkLE9BUkQ7QUFTQTtBQUNELEdBdjVCc0MsQ0F5NUJ2Qzs7O0FBQ0EsV0FBU2lJLG1CQUFULENBQThCcEwsS0FBOUIsRUFBcUMwQyxXQUFyQyxFQUFtRDtBQUNsRCxRQUFNckcsTUFBTSxHQUFXMkQsS0FBSyxDQUFDbkMsT0FBTixDQUFlLHNCQUFmLENBQXZCO0FBQ0EsUUFBTTRKLE9BQU8sR0FBVXBMLE1BQU0sQ0FBQ0UsSUFBUCxDQUFhLFNBQWIsQ0FBdkI7QUFDQSxRQUFNOE8sU0FBUyxHQUFRMVAsTUFBTSxDQUFFOEwsT0FBRixDQUE3QjtBQUNBLFFBQU0vSyxTQUFTLEdBQVEyTyxTQUFTLENBQUMzTyxTQUFqQztBQUNBLFFBQU1DLGNBQWMsR0FBRzBPLFNBQVMsQ0FBQzFPLGNBQWpDOztBQUVBLFFBQUssQ0FBRUQsU0FBUCxFQUFtQjtBQUNsQjtBQUNBOztBQUVELFFBQUssQ0FBRWdHLFdBQVcsQ0FBQy9DLE1BQW5CLEVBQTRCO0FBQzNCLFVBQU1vRCxLQUFLLEdBQUdDLDBCQUEwQixDQUFFdEcsU0FBRixDQUF4QztBQUNBdUcsTUFBQUEsT0FBTyxDQUFDQyxTQUFSLENBQW1CLEVBQW5CLEVBQXVCLEVBQXZCLEVBQTJCSCxLQUEzQjtBQUVBSSxNQUFBQSxjQUFjO0FBRWQ7QUFDQTs7QUFFRCxRQUFLeEcsY0FBTCxFQUFzQjtBQUNyQjJOLE1BQUFBLGNBQWMsQ0FBRTVOLFNBQUYsRUFBYWdHLFdBQWIsQ0FBZDtBQUNBLEtBRkQsTUFFTztBQUNOdUksTUFBQUEsWUFBWSxDQUFFdk8sU0FBRixFQUFhZ0csV0FBYixDQUFaO0FBQ0E7QUFDRDs7QUFFRCxXQUFTYixhQUFULENBQXdCRSxHQUF4QixFQUE4QjtBQUM3QixRQUFLLENBQUVBLEdBQVAsRUFBYTtBQUNaO0FBQ0EsS0FINEIsQ0FLN0I7QUFFQTtBQUNBOztBQUNBLEdBOTdCc0MsQ0FnOEJ2Qzs7O0FBQ0E5RixFQUFBQSxnQkFBZ0IsQ0FBQ21DLEVBQWpCLENBQ0MsUUFERCxFQUVDLHlFQUZELEVBR0MsVUFBVStELEtBQVYsRUFBa0I7QUFDakJBLElBQUFBLEtBQUssQ0FBQzVELGNBQU47QUFFQSxRQUFNeUIsS0FBSyxHQUFHNUUsQ0FBQyxDQUFFLElBQUYsQ0FBZjtBQUVBeUcsSUFBQUEsYUFBYSxDQUFFN0IsS0FBSyxDQUFDOEIsSUFBTixDQUFZLEtBQVosQ0FBRixDQUFiO0FBQ0EsR0FURixFQWo4QnVDLENBNjhCdkM7O0FBQ0E3RixFQUFBQSxnQkFBZ0IsQ0FBQ21DLEVBQWpCLENBQXFCLE9BQXJCLEVBQThCLHlDQUE5QixFQUF5RSxVQUFVK0QsS0FBVixFQUFrQjtBQUMxRkEsSUFBQUEsS0FBSyxDQUFDNUQsY0FBTjtBQUVBLFFBQU15QixLQUFLLEdBQUc1RSxDQUFDLENBQUUsSUFBRixDQUFmO0FBRUF5RyxJQUFBQSxhQUFhLENBQUU3QixLQUFLLENBQUM4QixJQUFOLENBQVksS0FBWixDQUFGLENBQWI7QUFDQSxHQU5ELEVBOThCdUMsQ0FzOUJ2Qzs7QUFDQTdGLEVBQUFBLGdCQUFnQixDQUFDbUMsRUFBakIsQ0FBcUIsUUFBckIsRUFBK0IsUUFBL0IsRUFBeUMsVUFBVStELEtBQVYsRUFBa0I7QUFDMURBLElBQUFBLEtBQUssQ0FBQzVELGNBQU47QUFFQSxRQUFNK00sT0FBTyxHQUFVbFEsQ0FBQyxDQUFFLElBQUYsQ0FBeEI7QUFDQSxRQUFNb0csTUFBTSxHQUFXOEosT0FBTyxDQUFDNUosR0FBUixFQUF2QjtBQUNBLFFBQU02SixTQUFTLEdBQVFELE9BQU8sQ0FBQ3hKLElBQVIsQ0FBYyxLQUFkLENBQXZCO0FBQ0EsUUFBTTBKLGNBQWMsR0FBR0YsT0FBTyxDQUFDeEosSUFBUixDQUFjLGtCQUFkLENBQXZCO0FBQ0EsUUFBSUMsR0FBSjs7QUFFQSxRQUFLUCxNQUFNLENBQUM3QixNQUFaLEVBQXFCO0FBQ3BCb0MsTUFBQUEsR0FBRyxHQUFHd0osU0FBUyxDQUFDMU0sT0FBVixDQUFtQixJQUFuQixFQUF5QjJDLE1BQU0sQ0FBQ2lLLFFBQVAsRUFBekIsQ0FBTjtBQUNBLEtBRkQsTUFFTztBQUNOMUosTUFBQUEsR0FBRyxHQUFHeUosY0FBTjtBQUNBOztBQUVEM0osSUFBQUEsYUFBYSxDQUFFRSxHQUFGLENBQWI7QUFDQSxHQWhCRDtBQWtCQTtBQUNEO0FBQ0E7O0FBQ0MsTUFBTTJKLG9CQUFvQixHQUFHLGdFQUE3QixDQTUrQnVDLENBOCtCdkM7O0FBQ0F4UCxFQUFBQSx3QkFBd0IsQ0FBQ2tDLEVBQXpCLENBQTZCLE9BQTdCLEVBQXNDc04sb0JBQXRDLEVBQTRELFVBQVV2SixLQUFWLEVBQWtCO0FBQzdFQSxJQUFBQSxLQUFLLENBQUM1RCxjQUFOO0FBRUEsUUFBTXlCLEtBQUssR0FBRzVFLENBQUMsQ0FBRSxJQUFGLENBQWY7QUFFQSxRQUFNdVEsWUFBWSxHQUFRM0wsS0FBSyxDQUFDbkMsT0FBTixDQUFlLHFCQUFmLENBQTFCO0FBQ0EsUUFBTXdDLGFBQWEsR0FBT3NMLFlBQVksQ0FBQ3BQLElBQWIsQ0FBbUIscUJBQW5CLENBQTFCO0FBQ0EsUUFBTStELGFBQWEsR0FBT0MsVUFBVSxDQUFFb0wsWUFBWSxDQUFDcFAsSUFBYixDQUFtQixzQkFBbkIsQ0FBRixDQUFwQztBQUNBLFFBQU1pRSxhQUFhLEdBQU9ELFVBQVUsQ0FBRW9MLFlBQVksQ0FBQ3BQLElBQWIsQ0FBbUIsc0JBQW5CLENBQUYsQ0FBcEM7QUFDQSxRQUFNbUUsYUFBYSxHQUFPaUwsWUFBWSxDQUFDcFAsSUFBYixDQUFtQixxQkFBbkIsQ0FBMUI7QUFDQSxRQUFNb0UsaUJBQWlCLEdBQUdnTCxZQUFZLENBQUNwUCxJQUFiLENBQW1CLHlCQUFuQixDQUExQjtBQUNBLFFBQU1xRSxnQkFBZ0IsR0FBSStLLFlBQVksQ0FBQ3BQLElBQWIsQ0FBbUIsd0JBQW5CLENBQTFCLENBWDZFLENBYTdFOztBQUNBeUYsSUFBQUEsWUFBWSxDQUFFaEMsS0FBSyxDQUFDOEIsSUFBTixDQUFZLE9BQVosQ0FBRixDQUFaOztBQUVBLGFBQVM4SixRQUFULENBQW1CQyxVQUFuQixFQUFnQztBQUMvQixVQUFLeEwsYUFBTCxFQUFxQjtBQUNwQixlQUFPN0IsYUFBYSxDQUFFcU4sVUFBRixFQUFjbkwsYUFBZCxFQUE2QkUsZ0JBQTdCLEVBQStDRCxpQkFBL0MsQ0FBcEI7QUFDQTs7QUFFRCxhQUFPa0wsVUFBUDtBQUNBOztBQUVEN0wsSUFBQUEsS0FBSyxDQUFDOEIsSUFBTixDQUFZLE9BQVosRUFBcUJHLFVBQVUsQ0FBRSxZQUFXO0FBQzNDakMsTUFBQUEsS0FBSyxDQUFDa0MsVUFBTixDQUFrQixPQUFsQjtBQUVBLFVBQUlyQixRQUFRLEdBQUdOLFVBQVUsQ0FBRW9MLFlBQVksQ0FBQ2xQLElBQWIsQ0FBbUIsWUFBbkIsRUFBa0NpRixHQUFsQyxFQUFGLENBQXpCO0FBQ0EsVUFBSVosUUFBUSxHQUFHUCxVQUFVLENBQUVvTCxZQUFZLENBQUNsUCxJQUFiLENBQW1CLFlBQW5CLEVBQWtDaUYsR0FBbEMsRUFBRixDQUF6QixDQUoyQyxDQU0zQzs7QUFDQSxVQUFLb0ssS0FBSyxDQUFFakwsUUFBRixDQUFWLEVBQXlCO0FBQ3hCQSxRQUFBQSxRQUFRLEdBQUdQLGFBQVg7QUFFQXFMLFFBQUFBLFlBQVksQ0FBQ2xQLElBQWIsQ0FBbUIsWUFBbkIsRUFBa0NpRixHQUFsQyxDQUF1Q2tLLFFBQVEsQ0FBRS9LLFFBQUYsQ0FBL0M7QUFDQSxPQUpELE1BSU87QUFDTjhLLFFBQUFBLFlBQVksQ0FBQ2xQLElBQWIsQ0FBbUIsWUFBbkIsRUFBa0NpRixHQUFsQyxDQUF1Q2tLLFFBQVEsQ0FBRS9LLFFBQUYsQ0FBL0M7QUFDQSxPQWIwQyxDQWUzQzs7O0FBQ0EsVUFBS2lMLEtBQUssQ0FBRWhMLFFBQUYsQ0FBVixFQUF5QjtBQUN4QkEsUUFBQUEsUUFBUSxHQUFHTixhQUFYO0FBRUFtTCxRQUFBQSxZQUFZLENBQUNsUCxJQUFiLENBQW1CLFlBQW5CLEVBQWtDaUYsR0FBbEMsQ0FBdUNrSyxRQUFRLENBQUU5SyxRQUFGLENBQS9DO0FBQ0EsT0FKRCxNQUlPO0FBQ042SyxRQUFBQSxZQUFZLENBQUNsUCxJQUFiLENBQW1CLFlBQW5CLEVBQWtDaUYsR0FBbEMsQ0FBdUNrSyxRQUFRLENBQUU5SyxRQUFGLENBQS9DO0FBQ0EsT0F0QjBDLENBd0IzQzs7O0FBQ0EsVUFBS0QsUUFBUSxHQUFHUCxhQUFoQixFQUFnQztBQUMvQk8sUUFBQUEsUUFBUSxHQUFHUCxhQUFYO0FBRUFxTCxRQUFBQSxZQUFZLENBQUNsUCxJQUFiLENBQW1CLFlBQW5CLEVBQWtDaUYsR0FBbEMsQ0FBdUNrSyxRQUFRLENBQUUvSyxRQUFGLENBQS9DO0FBQ0EsT0E3QjBDLENBK0IzQzs7O0FBQ0EsVUFBS0EsUUFBUSxHQUFHTCxhQUFoQixFQUFnQztBQUMvQkssUUFBQUEsUUFBUSxHQUFHTCxhQUFYO0FBRUFtTCxRQUFBQSxZQUFZLENBQUNsUCxJQUFiLENBQW1CLFlBQW5CLEVBQWtDaUYsR0FBbEMsQ0FBdUNrSyxRQUFRLENBQUUvSyxRQUFGLENBQS9DO0FBQ0EsT0FwQzBDLENBc0MzQzs7O0FBQ0EsVUFBS0MsUUFBUSxHQUFHTixhQUFoQixFQUFnQztBQUMvQk0sUUFBQUEsUUFBUSxHQUFHTixhQUFYO0FBRUFtTCxRQUFBQSxZQUFZLENBQUNsUCxJQUFiLENBQW1CLFlBQW5CLEVBQWtDaUYsR0FBbEMsQ0FBdUNrSyxRQUFRLENBQUU5SyxRQUFGLENBQS9DO0FBQ0EsT0EzQzBDLENBNkMzQzs7O0FBQ0EsVUFBS0QsUUFBUSxHQUFHQyxRQUFoQixFQUEyQjtBQUMxQkEsUUFBQUEsUUFBUSxHQUFHRCxRQUFYO0FBRUE4SyxRQUFBQSxZQUFZLENBQUNsUCxJQUFiLENBQW1CLFlBQW5CLEVBQWtDaUYsR0FBbEMsQ0FBdUNrSyxRQUFRLENBQUU5SyxRQUFGLENBQS9DO0FBQ0E7O0FBRUQsVUFBS0QsUUFBUSxLQUFLUCxhQUFiLElBQThCUSxRQUFRLEtBQUtOLGFBQWhELEVBQWdFO0FBQy9EO0FBQ0FxQixRQUFBQSxhQUFhLENBQUU4SixZQUFZLENBQUM3SixJQUFiLENBQW1CLGtCQUFuQixDQUFGLENBQWI7QUFDQSxPQUhELE1BR087QUFDTjtBQUNBLFlBQU1DLEdBQUcsR0FBRzRKLFlBQVksQ0FBQzdKLElBQWIsQ0FBbUIsS0FBbkIsRUFBMkJqRCxPQUEzQixDQUFvQyxLQUFwQyxFQUEyQ2dDLFFBQTNDLEVBQXNEaEMsT0FBdEQsQ0FBK0QsS0FBL0QsRUFBc0VpQyxRQUF0RSxDQUFaO0FBQ0FlLFFBQUFBLGFBQWEsQ0FBRUUsR0FBRixDQUFiO0FBQ0E7QUFDRCxLQTVEOEIsRUE0RDVCckcsS0E1RDRCLENBQS9CO0FBNkRBLEdBckZELEVBLytCdUMsQ0Fza0N2Qzs7QUFDQU8sRUFBQUEsZ0JBQWdCLENBQUNtQyxFQUFqQixDQUFxQixPQUFyQixFQUE4Qiw0Q0FBOUIsRUFBNEUsVUFBVStELEtBQVYsRUFBa0I7QUFDN0ZBLElBQUFBLEtBQUssQ0FBQzVELGNBQU47QUFFQSxRQUFNeUIsS0FBSyxHQUFTNUUsQ0FBQyxDQUFFLElBQUYsQ0FBckI7QUFDQSxRQUFNc0IsU0FBUyxHQUFLc0QsS0FBSyxDQUFDekQsSUFBTixDQUFZLGlCQUFaLENBQXBCO0FBQ0EsUUFBTW1HLFdBQVcsR0FBRzFDLEtBQUssQ0FBQ3pELElBQU4sQ0FBWSxZQUFaLENBQXBCO0FBRUErTixJQUFBQSxjQUFjLENBQUU1TixTQUFGLEVBQWFnRyxXQUFiLEVBQTBCLElBQTFCLENBQWQ7QUFDQSxHQVJEOztBQVVBLFdBQVNxSixZQUFULENBQXVCQyxPQUF2QixFQUFpQztBQUNoQyxRQUFNQyxXQUFXLEdBQUdELE9BQU8sQ0FBQ3pQLElBQVIsQ0FBYyxXQUFkLENBQXBCOztBQUVBLFFBQUssQ0FBRTBQLFdBQVAsRUFBcUI7QUFDcEI7QUFDQTs7QUFFRCxRQUFNQyxVQUFVLEdBQUdELFdBQVcsQ0FBQ3ZNLEtBQVosQ0FBbUIsR0FBbkIsQ0FBbkI7O0FBRUEsUUFBSXFELEtBQUssR0FBRyxFQUFaO0FBRUEzSCxJQUFBQSxDQUFDLENBQUNnQixJQUFGLENBQVE4UCxVQUFSLEVBQW9CLFVBQVVqRCxDQUFWLEVBQWF2TSxTQUFiLEVBQXlCO0FBQzVDLFVBQUtxRyxLQUFMLEVBQWE7QUFDWkEsUUFBQUEsS0FBSyxHQUFHQywwQkFBMEIsQ0FBRXRHLFNBQUYsRUFBYXFHLEtBQWIsQ0FBbEM7QUFDQSxPQUZELE1BRU87QUFDTkEsUUFBQUEsS0FBSyxHQUFHQywwQkFBMEIsQ0FBRXRHLFNBQUYsQ0FBbEM7QUFDQTtBQUNELEtBTkQsRUFYZ0MsQ0FtQmhDO0FBQ0E7O0FBQ0EsUUFBSyxDQUFFcUcsS0FBUCxFQUFlO0FBQ2QsVUFBTW9KLE9BQU8sR0FBRzlFLE1BQU0sQ0FBQ0MsUUFBUCxDQUFnQkMsSUFBaEM7QUFDQSxVQUFNNkUsTUFBTSxHQUFJRCxPQUFPLENBQUN6TSxLQUFSLENBQWUsR0FBZixDQUFoQjtBQUVBcUQsTUFBQUEsS0FBSyxHQUFHcUosTUFBTSxDQUFFLENBQUYsQ0FBZDtBQUNBOztBQUVEbkosSUFBQUEsT0FBTyxDQUFDQyxTQUFSLENBQW1CLEVBQW5CLEVBQXVCLEVBQXZCLEVBQTJCSCxLQUEzQjtBQUVBSSxJQUFBQSxjQUFjLENBQUUsSUFBRixDQUFkO0FBQ0EsR0FobkNzQyxDQWtuQ3ZDOzs7QUFDQTlILEVBQUFBLEtBQUssQ0FBQytDLEVBQU4sQ0FBVSxxQkFBVixFQUFpQyxVQUFVQyxDQUFWLEVBQWEyTixPQUFiLEVBQXVCO0FBQ3ZERCxJQUFBQSxZQUFZLENBQUVDLE9BQUYsQ0FBWjtBQUNBLEdBRkQ7QUFJQTNRLEVBQUFBLEtBQUssQ0FBQytDLEVBQU4sQ0FBVSxPQUFWLEVBQW1CLDBCQUFuQixFQUErQyxZQUFXO0FBQ3pELFFBQU00TixPQUFPLEdBQUc1USxDQUFDLENBQUUsSUFBRixDQUFqQjtBQUVBMlEsSUFBQUEsWUFBWSxDQUFFQyxPQUFGLENBQVo7QUFDQSxHQUpEO0FBTUEvUCxFQUFBQSxnQkFBZ0IsQ0FBQ21DLEVBQWpCLENBQXFCLE9BQXJCLEVBQThCLDBCQUE5QixFQUEwRCxVQUFVK0QsS0FBVixFQUFrQjtBQUMzRUEsSUFBQUEsS0FBSyxDQUFDNUQsY0FBTjtBQUVBLFFBQU15TixPQUFPLEdBQUc1USxDQUFDLENBQUUsSUFBRixDQUFqQjtBQUVBQyxJQUFBQSxLQUFLLENBQUNzRyxPQUFOLENBQWUscUJBQWYsRUFBc0MsQ0FBRXFLLE9BQUYsQ0FBdEM7QUFDQSxHQU5EO0FBUUFoUSxFQUFBQSxtQkFBbUIsQ0FBQ29DLEVBQXBCLENBQXdCLG9CQUF4QixFQUE4QyxZQUFXO0FBQ3hELFFBQU0vQixNQUFNLEdBQU1qQixDQUFDLENBQUUsSUFBRixDQUFuQjtBQUNBLFFBQU1xTSxPQUFPLEdBQUtwTCxNQUFNLENBQUNFLElBQVAsQ0FBYSxTQUFiLENBQWxCO0FBQ0EsUUFBTThPLFNBQVMsR0FBRzFQLE1BQU0sQ0FBRThMLE9BQUYsQ0FBeEI7QUFDQSxRQUFNL0ssU0FBUyxHQUFHMk8sU0FBUyxDQUFDM08sU0FBNUI7QUFFQSxRQUFNcUcsS0FBSyxHQUFHQywwQkFBMEIsQ0FBRXRHLFNBQUYsQ0FBeEM7QUFDQXVHLElBQUFBLE9BQU8sQ0FBQ0MsU0FBUixDQUFtQixFQUFuQixFQUF1QixFQUF2QixFQUEyQkgsS0FBM0I7QUFFQUksSUFBQUEsY0FBYyxDQUFFLElBQUYsQ0FBZDtBQUNBLEdBVkQsRUFyb0N1QyxDQWlwQ3ZDOztBQUNBLE1BQUsvSCxDQUFDLENBQUVKLFlBQVksQ0FBQ3dKLG1CQUFmLENBQUQsQ0FBc0M3RSxNQUF0QyxJQUFnRHZFLENBQUMsQ0FBRUosWUFBWSxDQUFDdUwsbUJBQWYsQ0FBRCxDQUFzQzVHLE1BQTNGLEVBQW9HO0FBQ25HLFFBQUszRSxZQUFZLENBQUNxUix1Q0FBbEIsRUFBNEQ7QUFDM0RqUixNQUFBQSxDQUFDLENBQUVpTSxNQUFGLENBQUQsQ0FBWWlGLElBQVosQ0FBa0IsVUFBbEIsRUFBOEIsWUFBVztBQUN4Q25KLFFBQUFBLGNBQWMsQ0FBRSxJQUFGLENBQWQ7QUFDQSxPQUZEO0FBR0E7QUFDRCxHQXhwQ3NDLENBMHBDdkM7OztBQUNBOUgsRUFBQUEsS0FBSyxDQUFDK0MsRUFBTixDQUFVLDJCQUFWLEVBQXVDLFVBQVVDLENBQVYsRUFBYStJLGFBQWIsRUFBNkI7QUFDbkVqRSxJQUFBQSxjQUFjLENBQUVpRSxhQUFGLENBQWQ7QUFDQSxHQUZELEVBM3BDdUMsQ0ErcEN2Qzs7QUFDQS9MLEVBQUFBLEtBQUssQ0FBQytDLEVBQU4sQ0FBVSxxQkFBVixFQUFpQyxZQUFXO0FBQzNDeEIsSUFBQUEsVUFBVTtBQUNWWSxJQUFBQSxzQkFBc0I7QUFDdEJzQyxJQUFBQSxjQUFjO0FBQ2RzRCxJQUFBQSxjQUFjO0FBQ2QsR0FMRDtBQU9BO0FBQ0Q7QUFDQTs7QUFDQy9ILEVBQUFBLEtBQUssQ0FBQytDLEVBQU4sQ0FBVSwrQkFBVixFQUEyQyxZQUFXO0FBQ3JEO0FBQ0FoRCxJQUFBQSxDQUFDLENBQUVGLFFBQUYsQ0FBRCxDQUFjeUcsT0FBZCxDQUF1QixpQ0FBdkI7QUFDQSxHQUhEO0FBSUEsQ0E5cUNEIiwiZmlsZSI6IndjLWFqYXgtcHJvZHVjdC1maWx0ZXItcHVibGljLXNjcmlwdHMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIFRoZSBmcm9udGVuZCBmaWx0ZXIgZm9ybS5cbiAqXG4gKiBAc2luY2UgICAgICAzLjAuMFxuICogQHBhY2thZ2UgICAgd2MtYWpheC1wcm9kdWN0LWZpbHRlclxuICogQHN1YnBhY2thZ2Ugd2MtYWpheC1wcm9kdWN0LWZpbHRlci9wdWJsaWMvc3JjL2pzXG4gKiBAYXV0aG9yICAgICB3cHRvb2xzLmlvXG4gKi9cblxuY29uc3Qgd2NhcGZfcGFyYW1zID0gd2NhcGZfcGFyYW1zIHx8IHtcblx0J2lzX3J0bCc6ICcnLFxuXHQnZmlsdGVyX2lucHV0X2RlbGF5JzogJycsXG5cdCdjaG9zZW5fbGliX3NlYXJjaF90aHJlc2hvbGQnOiAnJyxcblx0J3ByZXNlcnZlX2hpZXJhcmNoeV9hY2NvcmRpb25fc3RhdGUnOiAnJyxcblx0J2VuYWJsZV9hbmltYXRpb25fZm9yX2hpZXJhcmNoeV9hY2NvcmRpb24nOiAnJyxcblx0J2hpZXJhcmNoeV9hY2NvcmRpb25fYW5pbWF0aW9uX3NwZWVkJzogJycsXG5cdCdoaWVyYXJjaHlfYWNjb3JkaW9uX2FuaW1hdGlvbl9lYXNpbmcnOiAnJyxcblx0J2xvYWRpbmdfb3ZlcmxheV9vcHRpb25zJzogJycsXG5cdCdzY3JvbGxfdG9fdG9wX3NwZWVkJzogJycsXG5cdCdzY3JvbGxfdG9fdG9wX2Vhc2luZyc6ICcnLFxuXHQnaXNfbW9iaWxlJzogJycsXG5cdCdkaXNhYmxlX2lucHV0c193aGlsZV9mZXRjaGluZ19yZXN1bHRzJzogJycsXG5cdCdhcHBseV9maWx0ZXJzX29uX2Jyb3dzZXJfaGlzdG9yeV9jaGFuZ2UnOiAnJyxcblx0J3Nob3BfbG9vcF9jb250YWluZXInOiAnJyxcblx0J25vdF9mb3VuZF9jb250YWluZXInOiAnJyxcblx0J2VuYWJsZV9wYWdpbmF0aW9uX3ZpYV9hamF4JzogJycsXG5cdCdwYWdpbmF0aW9uX2NvbnRhaW5lcic6ICcnLFxuXHQnc29ydGluZ19jb250cm9sJzogJycsXG5cdCdhdHRhY2hfY2hvc2VuX29uX3NvcnRpbmcnOiAnJyxcblx0J2xvYWRpbmdfYW5pbWF0aW9uJzogJycsXG5cdCdzY3JvbGxfd2luZG93JzogJycsXG5cdCdzY3JvbGxfd2luZG93X2Zvcic6ICcnLFxuXHQnc2Nyb2xsX3dpbmRvd193aGVuJzogJycsXG5cdCdzY3JvbGxfd2luZG93X2N1c3RvbV9lbGVtZW50JzogJycsXG5cdCdzY3JvbGxfdG9fdG9wX29mZnNldCc6ICcnLFxuXHQnZm9yX3ByZXZpZXcnOiAnJyxcbn07XG5cbmpRdWVyeSggZG9jdW1lbnQgKS5yZWFkeSggZnVuY3Rpb24oICQgKSB7XG5cblx0Y29uc3QgJGJvZHkgPSAkKCAnYm9keScgKTtcblxuXHRjb25zdCByYW5nZVZhbHVlc1NlcGFyYXRvciA9ICd+JztcblxuXHRjb25zdCBfZGVsYXkgPSBwYXJzZUludCggd2NhcGZfcGFyYW1zLmZpbHRlcl9pbnB1dF9kZWxheSApO1xuXHRjb25zdCBkZWxheSAgPSBfZGVsYXkgPj0gMCA/IF9kZWxheSA6IDgwMDtcblxuXHQvLyBTdG9yZSBmaWVsZHMnIGlkIGFuZCBmaWx0ZXIgaW5mb3JtYXRpb24uXG5cdGNvbnN0IGZpZWxkcyA9IHt9O1xuXG5cdGNvbnN0IHdjYXBmU2luZ2xlRmlsdGVyU2VsZWN0b3IgICAgICA9ICcud2NhcGYtc2luZ2xlLWZpbHRlcic7XG5cdGNvbnN0IHdjYXBmTmF2RmlsdGVyU2VsZWN0b3IgICAgICAgICA9ICcud2NhcGYtbmF2LWZpbHRlcic7XG5cdGNvbnN0IHdjYXBmTnVtYmVyUmFuZ2VGaWx0ZXJTZWxlY3RvciA9ICcud2NhcGYtbnVtYmVyLXJhbmdlLWZpbHRlcic7XG5cdGNvbnN0IHdjYXBmRGF0ZUZpbHRlclNlbGVjdG9yICAgICAgICA9ICcud2NhcGYtZGF0ZS1yYW5nZS1maWx0ZXInO1xuXG5cdGNvbnN0ICR3Y2FwZlNpbmdsZUZpbHRlcnMgICAgICA9ICQoIHdjYXBmU2luZ2xlRmlsdGVyU2VsZWN0b3IgKTtcblx0Y29uc3QgJHdjYXBmTmF2RmlsdGVycyAgICAgICAgID0gJCggd2NhcGZOYXZGaWx0ZXJTZWxlY3RvciApO1xuXHRjb25zdCAkd2NhcGZOdW1iZXJSYW5nZUZpbHRlcnMgPSAkKCB3Y2FwZk51bWJlclJhbmdlRmlsdGVyU2VsZWN0b3IgKTtcblx0Y29uc3QgJHdjYXBmRGF0ZUZpbHRlcnMgICAgICAgID0gJCggd2NhcGZEYXRlRmlsdGVyU2VsZWN0b3IgKTtcblxuXHQkd2NhcGZTaW5nbGVGaWx0ZXJzLmVhY2goIGZ1bmN0aW9uKCkge1xuXHRcdGNvbnN0ICRmaWVsZCAgICAgICAgID0gJCggdGhpcyApO1xuXHRcdGNvbnN0IGlkICAgICAgICAgICAgID0gJGZpZWxkLmF0dHIoICdkYXRhLWlkJyApO1xuXHRcdGNvbnN0ICR3cmFwcGVyICAgICAgID0gJGZpZWxkLmZpbmQoICcud2NhcGYtZmllbGQtaW5uZXIgPiBkaXYnICk7XG5cdFx0Y29uc3QgZmlsdGVyS2V5ICAgICAgPSAkd3JhcHBlci5hdHRyKCAnZGF0YS1maWx0ZXIta2V5JyApO1xuXHRcdGNvbnN0IG11bHRpcGxlRmlsdGVyID0gcGFyc2VJbnQoICR3cmFwcGVyLmF0dHIoICdkYXRhLW11bHRpcGxlLWZpbHRlcicgKSApO1xuXG5cdFx0ZmllbGRzWyBpZCBdID0ge1xuXHRcdFx0ZmlsdGVyS2V5OiBmaWx0ZXJLZXksXG5cdFx0XHRtdWx0aXBsZUZpbHRlcjogbXVsdGlwbGVGaWx0ZXJcblx0XHR9O1xuXHR9ICk7XG5cblx0Ly8gSW5pdGlhbGl6ZSBqUXVlcnkgY2hvc2VuIGxpYnJhcnkuXG5cdGZ1bmN0aW9uIGluaXRDaG9zZW4oKSB7XG5cdFx0aWYgKCAhIGpRdWVyeSgpLmNob3NlbiApIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHRsZXQgJHJvb3Q7XG5cblx0XHRpZiAoIHdjYXBmX3BhcmFtcy5mb3JfcHJldmlldyApIHtcblx0XHRcdCRyb290ID0gJCggd2NhcGZOYXZGaWx0ZXJTZWxlY3RvciApO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHQkcm9vdCA9ICR3Y2FwZk5hdkZpbHRlcnM7XG5cdFx0fVxuXG5cdFx0JHJvb3QuZmluZCggJy53Y2FwZi1jaG9zZW4tc2VsZWN0JyApLmVhY2goIGZ1bmN0aW9uKCkge1xuXHRcdFx0Y29uc3QgJHRoaXMgICA9ICQoIHRoaXMgKTtcblx0XHRcdGNvbnN0IG9wdGlvbnMgPSB7XG5cdFx0XHRcdGluaGVyaXRfc2VsZWN0X2NsYXNzZXM6IHRydWUsXG5cdFx0XHRcdGluaGVyaXRfb3B0aW9uX2NsYXNzZXM6IHRydWUsXG5cdFx0XHR9O1xuXG5cdFx0XHRpZiAoIHdjYXBmX3BhcmFtcy5pc19ydGwgKSB7XG5cdFx0XHRcdG9wdGlvbnNbICdydGwnIF0gPSB0cnVlO1xuXHRcdFx0fVxuXG5cdFx0XHRjb25zdCBub1Jlc3VsdHNNZXNzYWdlID0gJHRoaXMuYXR0ciggJ2RhdGEtbm8tcmVzdWx0cy1tZXNzYWdlJyApO1xuXG5cdFx0XHRpZiAoIG5vUmVzdWx0c01lc3NhZ2UgKSB7XG5cdFx0XHRcdG9wdGlvbnNbICdub19yZXN1bHRzX3RleHQnIF0gPSBub1Jlc3VsdHNNZXNzYWdlO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBvcHRpb25zWyAnZGlzYWJsZV9zZWFyY2gnIF0gPSB0cnVlO1xuXG5cdFx0XHRjb25zdCBzZWFyY2hUaHJlc2hvbGQgPSBwYXJzZUludCggd2NhcGZfcGFyYW1zLmNob3Nlbl9saWJfc2VhcmNoX3RocmVzaG9sZCApO1xuXG5cdFx0XHRpZiAoIHNlYXJjaFRocmVzaG9sZCApIHtcblx0XHRcdFx0Ly8gb3B0aW9uc1sgJ2Rpc2FibGVfc2VhcmNoX3RocmVzaG9sZCcgXSA9IHNlYXJjaFRocmVzaG9sZDtcblx0XHRcdH1cblxuXHRcdFx0Ly8gb3B0aW9uc1sgJ2Rpc3BsYXlfc2VsZWN0ZWRfb3B0aW9ucycgXSA9IGZhbHNlO1xuXG5cdFx0XHQvLyBtaW5pbXVtUmVzdWx0c0ZvclNlYXJjaDogMjBcblxuXHRcdFx0Ly8gb3B0aW9uc1snbWluaW11bVJlc3VsdHNGb3JTZWFyY2gnXSA9IC0xO1xuXG5cdFx0XHQkdGhpcy5jaG9zZW4oIG9wdGlvbnMgKTtcblx0XHR9ICk7XG5cdH1cblxuXHRpbml0Q2hvc2VuKCk7XG5cblx0Ly8gSW5pdGlhbGl6ZSBoaWVyYXJjaHkgYWNjb3JkaW9uLlxuXHRmdW5jdGlvbiBpbml0SGllcmFyY2h5QWNjb3JkaW9uKCkge1xuXHRcdGxldCAkcm9vdDtcblxuXHRcdGlmICggd2NhcGZfcGFyYW1zLmZvcl9wcmV2aWV3ICkge1xuXHRcdFx0JHJvb3QgPSAkKCB3Y2FwZk5hdkZpbHRlclNlbGVjdG9yICk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdCRyb290ID0gJHdjYXBmTmF2RmlsdGVycztcblx0XHR9XG5cblx0XHRmdW5jdGlvbiB0b2dnbGVBY2NvcmRpb24oICRlbCApIHtcblx0XHRcdC8vIENoZWNrIHRvIHNlZSBpZiB0aGUgYnV0dG9uIGlzIHByZXNzZWRcblx0XHRcdGNvbnN0IHByZXNzZWQgPSAkZWwuYXR0ciggJ2FyaWEtcHJlc3NlZCcgKSA9PT0gJ3RydWUnO1xuXG5cdFx0XHQvLyBDaGFuZ2UgYXJpYS1wcmVzc2VkIHRvIHRoZSBvcHBvc2l0ZSBzdGF0ZVxuXHRcdFx0JGVsLmF0dHIoICdhcmlhLXByZXNzZWQnLCAhIHByZXNzZWQgKTtcblxuXHRcdFx0Y29uc3QgJGNoaWxkID0gJGVsLmNsb3Nlc3QoICdsaScgKS5jaGlsZHJlbiggJ3VsJyApO1xuXG5cdFx0XHRpZiAoIHdjYXBmX3BhcmFtcy5lbmFibGVfYW5pbWF0aW9uX2Zvcl9oaWVyYXJjaHlfYWNjb3JkaW9uICkge1xuXHRcdFx0XHQkY2hpbGQuc2xpZGVUb2dnbGUoXG5cdFx0XHRcdFx0d2NhcGZfcGFyYW1zLmhpZXJhcmNoeV9hY2NvcmRpb25fYW5pbWF0aW9uX3NwZWVkLFxuXHRcdFx0XHRcdHdjYXBmX3BhcmFtcy5oaWVyYXJjaHlfYWNjb3JkaW9uX2FuaW1hdGlvbl9lYXNpbmdcblx0XHRcdFx0KTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdCRjaGlsZC50b2dnbGUoKTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHQkcm9vdC5maW5kKCAnLndjYXBmLWhpZXJhcmNoeS1hY2NvcmRpb24tdG9nZ2xlJyApLm9uKCAnY2xpY2snLCBmdW5jdGlvbigpIHtcblx0XHRcdHRvZ2dsZUFjY29yZGlvbiggJCggdGhpcyApICk7XG5cdFx0fSApO1xuXG5cdFx0JHJvb3QuZmluZCggJy53Y2FwZi1oaWVyYXJjaHktYWNjb3JkaW9uLXRvZ2dsZScgKS5vbiggJ2tleWRvd24nLCBmdW5jdGlvbiggZSApIHtcblx0XHRcdGlmICggZS5rZXkgPT09ICcgJyB8fCBlLmtleSA9PT0gJ0VudGVyJyB8fCBlLmtleSA9PT0gJ1NwYWNlYmFyJyApIHtcblx0XHRcdFx0Ly8gUHJldmVudCB0aGUgZGVmYXVsdCBhY3Rpb24gdG8gc3RvcCBzY3JvbGxpbmcgd2hlbiBzcGFjZSBpcyBwcmVzc2VkXG5cdFx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcblxuXHRcdFx0XHR0b2dnbGVBY2NvcmRpb24oICQoIHRoaXMgKSApO1xuXHRcdFx0fVxuXHRcdH0gKTtcblx0fVxuXG5cdGluaXRIaWVyYXJjaHlBY2NvcmRpb24oKTtcblxuXHQvKipcblx0ICogQHNvdXJjZSBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL2EvMzQxNDE4MTNcblx0ICpcblx0ICogQHBhcmFtIG51bWJlclxuXHQgKiBAcGFyYW0gZGVjaW1hbHNcblx0ICogQHBhcmFtIGRlY19wb2ludFxuXHQgKiBAcGFyYW0gdGhvdXNhbmRzX3NlcFxuXHQgKlxuXHQgKiBAcmV0dXJucyB7c3RyaW5nfVxuXHQgKi9cblx0ZnVuY3Rpb24gbnVtYmVyX2Zvcm1hdCggbnVtYmVyLCBkZWNpbWFscywgZGVjX3BvaW50LCB0aG91c2FuZHNfc2VwICkge1xuXHRcdC8vIFN0cmlwIGFsbCBjaGFyYWN0ZXJzIGJ1dCBudW1lcmljYWwgb25lcy5cblx0XHRudW1iZXIgPSAoIG51bWJlciArICcnICkucmVwbGFjZSggL1teXFxkK1xcLUVlLl0vZywgJycgKTtcblxuXHRcdGNvbnN0IG4gICAgPSAhIGlzRmluaXRlKCArbnVtYmVyICkgPyAwIDogK251bWJlcjtcblx0XHRjb25zdCBwcmVjID0gISBpc0Zpbml0ZSggK2RlY2ltYWxzICkgPyAwIDogTWF0aC5hYnMoIGRlY2ltYWxzICk7XG5cdFx0Y29uc3Qgc2VwICA9ICggdHlwZW9mIHRob3VzYW5kc19zZXAgPT09ICd1bmRlZmluZWQnICkgPyAnLCcgOiB0aG91c2FuZHNfc2VwO1xuXHRcdGNvbnN0IGRlYyAgPSAoIHR5cGVvZiBkZWNfcG9pbnQgPT09ICd1bmRlZmluZWQnICkgPyAnLicgOiBkZWNfcG9pbnQ7XG5cblx0XHRsZXQgcztcblxuXHRcdGNvbnN0IHRvRml4ZWRGaXggPSBmdW5jdGlvbiggbiwgcHJlYyApIHtcblx0XHRcdGNvbnN0IGsgPSBNYXRoLnBvdyggMTAsIHByZWMgKTtcblx0XHRcdHJldHVybiAnJyArIE1hdGgucm91bmQoIG4gKiBrICkgLyBrO1xuXHRcdH07XG5cblx0XHQvLyBGaXggZm9yIElFIHBhcnNlRmxvYXQoMC41NSkudG9GaXhlZCgwKSA9IDA7XG5cdFx0cyA9ICggcHJlYyA/IHRvRml4ZWRGaXgoIG4sIHByZWMgKSA6ICcnICsgTWF0aC5yb3VuZCggbiApICkuc3BsaXQoICcuJyApO1xuXG5cdFx0aWYgKCBzWyAwIF0ubGVuZ3RoID4gMyApIHtcblx0XHRcdHNbIDAgXSA9IHNbIDAgXS5yZXBsYWNlKCAvXFxCKD89KD86XFxkezN9KSsoPyFcXGQpKS9nLCBzZXAgKTtcblx0XHR9XG5cblx0XHRpZiAoICggc1sgMSBdIHx8ICcnICkubGVuZ3RoIDwgcHJlYyApIHtcblx0XHRcdHNbIDEgXSA9IHNbIDEgXSB8fCAnJztcblx0XHRcdHNbIDEgXSArPSBuZXcgQXJyYXkoIHByZWMgLSBzWyAxIF0ubGVuZ3RoICsgMSApLmpvaW4oICcwJyApO1xuXHRcdH1cblxuXHRcdHJldHVybiBzLmpvaW4oIGRlYyApO1xuXHR9XG5cblx0Ly8gSW5pdGlhbGl6ZSBub1VJU2xpZGVyLlxuXHRmdW5jdGlvbiBpbml0Tm9VSVNsaWRlcigpIHtcblx0XHRpZiAoICd1bmRlZmluZWQnID09PSB0eXBlb2Ygbm9VaVNsaWRlciApIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHRsZXQgJHJvb3Q7XG5cblx0XHRpZiAoIHdjYXBmX3BhcmFtcy5mb3JfcHJldmlldyApIHtcblx0XHRcdCRyb290ID0gJCggd2NhcGZOdW1iZXJSYW5nZUZpbHRlclNlbGVjdG9yICk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdCRyb290ID0gJHdjYXBmTnVtYmVyUmFuZ2VGaWx0ZXJzO1xuXHRcdH1cblxuXHRcdCRyb290LmZpbmQoICcud2NhcGYtcmFuZ2Utc2xpZGVyJyApLmVhY2goIGZ1bmN0aW9uKCkge1xuXHRcdFx0Y29uc3QgJGl0ZW0gPSAkKCB0aGlzICk7XG5cblx0XHRcdC8vIFRPRE86IFJlbW92ZSBmaWx0ZXIga2V5LlxuXHRcdFx0Y29uc3QgZmlsdGVyS2V5ID0gJGl0ZW0uYXR0ciggJ2RhdGEtZmlsdGVyLWtleScgKTtcblx0XHRcdGNvbnN0ICRzbGlkZXIgICA9ICRpdGVtLmZpbmQoICcud2NhcGYtbm91aS1zbGlkZXInICk7XG5cblx0XHRcdC8vIElmIHNsaWRlciBpcyBhbHJlYWR5IGluaXRpYWxpemVkIHRoZW4gZG9uJ3QgcmVpbml0aWFsaXplIGFnYWluLlxuXHRcdFx0aWYgKCAkc2xpZGVyLmhhc0NsYXNzKCAnd2NhcGYtbm91aS10YXJnZXQnICkgKSB7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblxuXHRcdFx0Y29uc3Qgc2xpZGVySWQgICAgICAgICAgPSAkc2xpZGVyLmF0dHIoICdpZCcgKTtcblx0XHRcdGNvbnN0IGRpc3BsYXlWYWx1ZXNBcyAgID0gJGl0ZW0uYXR0ciggJ2RhdGEtZGlzcGxheS12YWx1ZXMtYXMnICk7XG5cdFx0XHRjb25zdCBmb3JtYXROdW1iZXJzICAgICA9ICRpdGVtLmF0dHIoICdkYXRhLWZvcm1hdC1udW1iZXJzJyApO1xuXHRcdFx0Y29uc3QgcmFuZ2VNaW5WYWx1ZSAgICAgPSBwYXJzZUZsb2F0KCAkaXRlbS5hdHRyKCAnZGF0YS1yYW5nZS1taW4tdmFsdWUnICkgKTtcblx0XHRcdGNvbnN0IHJhbmdlTWF4VmFsdWUgICAgID0gcGFyc2VGbG9hdCggJGl0ZW0uYXR0ciggJ2RhdGEtcmFuZ2UtbWF4LXZhbHVlJyApICk7XG5cdFx0XHRjb25zdCBzdGVwICAgICAgICAgICAgICA9IHBhcnNlRmxvYXQoICRpdGVtLmF0dHIoICdkYXRhLXN0ZXAnICkgKTtcblx0XHRcdGNvbnN0IGRlY2ltYWxQbGFjZXMgICAgID0gJGl0ZW0uYXR0ciggJ2RhdGEtZGVjaW1hbC1wbGFjZXMnICk7XG5cdFx0XHRjb25zdCB0aG91c2FuZFNlcGFyYXRvciA9ICRpdGVtLmF0dHIoICdkYXRhLXRob3VzYW5kLXNlcGFyYXRvcicgKTtcblx0XHRcdGNvbnN0IGRlY2ltYWxTZXBhcmF0b3IgID0gJGl0ZW0uYXR0ciggJ2RhdGEtZGVjaW1hbC1zZXBhcmF0b3InICk7XG5cdFx0XHRjb25zdCBtaW5WYWx1ZSAgICAgICAgICA9IHBhcnNlRmxvYXQoICRpdGVtLmF0dHIoICdkYXRhLW1pbi12YWx1ZScgKSApO1xuXHRcdFx0Y29uc3QgbWF4VmFsdWUgICAgICAgICAgPSBwYXJzZUZsb2F0KCAkaXRlbS5hdHRyKCAnZGF0YS1tYXgtdmFsdWUnICkgKTtcblx0XHRcdGNvbnN0ICRtaW5WYWx1ZSAgICAgICAgID0gJGl0ZW0uZmluZCggJy5taW4tdmFsdWUnICk7XG5cdFx0XHRjb25zdCAkbWF4VmFsdWUgICAgICAgICA9ICRpdGVtLmZpbmQoICcubWF4LXZhbHVlJyApO1xuXG5cdFx0XHRjb25zdCBzbGlkZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCggc2xpZGVySWQgKTtcblxuXHRcdFx0bm9VaVNsaWRlci5jcmVhdGUoIHNsaWRlciwge1xuXHRcdFx0XHRzdGFydDogWyBtaW5WYWx1ZSwgbWF4VmFsdWUgXSxcblx0XHRcdFx0c3RlcCxcblx0XHRcdFx0Y29ubmVjdDogdHJ1ZSxcblx0XHRcdFx0Y3NzUHJlZml4OiAnd2NhcGYtbm91aS0nLFxuXHRcdFx0XHRyYW5nZToge1xuXHRcdFx0XHRcdCdtaW4nOiByYW5nZU1pblZhbHVlLFxuXHRcdFx0XHRcdCdtYXgnOiByYW5nZU1heFZhbHVlLFxuXHRcdFx0XHR9XG5cdFx0XHR9ICk7XG5cblx0XHRcdHNsaWRlci5ub1VpU2xpZGVyLm9uKCAndXBkYXRlJywgZnVuY3Rpb24oIHZhbHVlcyApIHtcblx0XHRcdFx0bGV0IG1pblZhbHVlO1xuXHRcdFx0XHRsZXQgbWF4VmFsdWU7XG5cblx0XHRcdFx0aWYgKCBmb3JtYXROdW1iZXJzICkge1xuXHRcdFx0XHRcdG1pblZhbHVlID0gbnVtYmVyX2Zvcm1hdCggdmFsdWVzWyAwIF0sIGRlY2ltYWxQbGFjZXMsIGRlY2ltYWxTZXBhcmF0b3IsIHRob3VzYW5kU2VwYXJhdG9yICk7XG5cdFx0XHRcdFx0bWF4VmFsdWUgPSBudW1iZXJfZm9ybWF0KCB2YWx1ZXNbIDEgXSwgZGVjaW1hbFBsYWNlcywgZGVjaW1hbFNlcGFyYXRvciwgdGhvdXNhbmRTZXBhcmF0b3IgKTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRtaW5WYWx1ZSA9IHBhcnNlRmxvYXQoIHZhbHVlc1sgMCBdICk7XG5cdFx0XHRcdFx0bWF4VmFsdWUgPSBwYXJzZUZsb2F0KCB2YWx1ZXNbIDEgXSApO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0aWYgKCAncGxhaW5fdGV4dCcgPT09IGRpc3BsYXlWYWx1ZXNBcyApIHtcblx0XHRcdFx0XHQkbWluVmFsdWUuaHRtbCggbWluVmFsdWUgKTtcblx0XHRcdFx0XHQkbWF4VmFsdWUuaHRtbCggbWF4VmFsdWUgKTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHQkbWluVmFsdWUudmFsKCBtaW5WYWx1ZSApO1xuXHRcdFx0XHRcdCRtYXhWYWx1ZS52YWwoIG1heFZhbHVlICk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHQkYm9keS50cmlnZ2VyKCAnd2NhcGYtbm91aXNsaWRlci11cGRhdGUnLCBbICRpdGVtLCB2YWx1ZXMgXSApO1xuXHRcdFx0fSApO1xuXG5cdFx0XHRmdW5jdGlvbiBmaWx0ZXJQcm9kdWN0c0FjY29yZGluZ1RvU2xpZGVyKCB2YWx1ZXMgKSB7XG5cdFx0XHRcdGlmICggd2NhcGZfcGFyYW1zLmZvcl9wcmV2aWV3ICkge1xuXHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGNvbnN0IG1pblZhbHVlID0gcGFyc2VGbG9hdCggdmFsdWVzWyAwIF0gKTtcblx0XHRcdFx0Y29uc3QgbWF4VmFsdWUgPSBwYXJzZUZsb2F0KCB2YWx1ZXNbIDEgXSApO1xuXG5cdFx0XHRcdGlmICggbWluVmFsdWUgPT09IHJhbmdlTWluVmFsdWUgJiYgbWF4VmFsdWUgPT09IHJhbmdlTWF4VmFsdWUgKSB7XG5cdFx0XHRcdFx0Ly8gUmVtb3ZlIHJhbmdlIGZpbHRlci5cblx0XHRcdFx0XHRyZXF1ZXN0RmlsdGVyKCAkaXRlbS5kYXRhKCAnY2xlYXItZmlsdGVyLXVybCcgKSApO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdC8vIEFkZCByYW5nZSBmaWx0ZXIuXG5cdFx0XHRcdFx0Y29uc3QgdXJsID0gJGl0ZW0uZGF0YSggJ3VybCcgKS5yZXBsYWNlKCAnJTFzJywgbWluVmFsdWUgKS5yZXBsYWNlKCAnJTJzJywgbWF4VmFsdWUgKTtcblx0XHRcdFx0XHRyZXF1ZXN0RmlsdGVyKCB1cmwgKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0XHRzbGlkZXIubm9VaVNsaWRlci5vbiggJ2NoYW5nZScsIGZ1bmN0aW9uKCB2YWx1ZXMgKSB7XG5cdFx0XHRcdC8vIENsZWFyIGFueSBwcmV2aW91c2x5IHNldCB0aW1lciBiZWZvcmUgc2V0dGluZyBhIGZyZXNoIG9uZVxuXHRcdFx0XHRjbGVhclRpbWVvdXQoICRpdGVtLmRhdGEoICd0aW1lcicgKSApO1xuXG5cdFx0XHRcdCRpdGVtLmRhdGEoICd0aW1lcicsIHNldFRpbWVvdXQoIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdCRpdGVtLnJlbW92ZURhdGEoICd0aW1lcicgKTtcblxuXHRcdFx0XHRcdGZpbHRlclByb2R1Y3RzQWNjb3JkaW5nVG9TbGlkZXIoIHZhbHVlcyApO1xuXHRcdFx0XHR9LCBkZWxheSApICk7XG5cdFx0XHR9ICk7XG5cblx0XHRcdCRtaW5WYWx1ZS5vbiggJ2lucHV0JywgZnVuY3Rpb24oIGV2ZW50ICkge1xuXHRcdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXG5cdFx0XHRcdGNvbnN0ICRpbnB1dCA9ICQoIHRoaXMgKTtcblxuXHRcdFx0XHQvLyBDbGVhciBhbnkgcHJldmlvdXNseSBzZXQgdGltZXIgYmVmb3JlIHNldHRpbmcgYSBmcmVzaCBvbmVcblx0XHRcdFx0Y2xlYXJUaW1lb3V0KCAkaW5wdXQuZGF0YSggJ3RpbWVyJyApICk7XG5cblx0XHRcdFx0JGlucHV0LmRhdGEoICd0aW1lcicsIHNldFRpbWVvdXQoIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdCRpbnB1dC5yZW1vdmVEYXRhKCAndGltZXInICk7XG5cblx0XHRcdFx0XHRjb25zdCBtaW5WYWx1ZSA9ICRpbnB1dC52YWwoKTtcblxuXHRcdFx0XHRcdHNsaWRlci5ub1VpU2xpZGVyLnNldCggWyBtaW5WYWx1ZSwgbnVsbCBdICk7XG5cblx0XHRcdFx0XHRmaWx0ZXJQcm9kdWN0c0FjY29yZGluZ1RvU2xpZGVyKCBzbGlkZXIubm9VaVNsaWRlci5nZXQoKSApO1xuXHRcdFx0XHR9LCBkZWxheSApICk7XG5cdFx0XHR9ICk7XG5cblx0XHRcdCRtYXhWYWx1ZS5vbiggJ2lucHV0JywgZnVuY3Rpb24oIGV2ZW50ICkge1xuXHRcdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXG5cdFx0XHRcdGNvbnN0ICRpbnB1dCA9ICQoIHRoaXMgKTtcblxuXHRcdFx0XHQvLyBDbGVhciBhbnkgcHJldmlvdXNseSBzZXQgdGltZXIgYmVmb3JlIHNldHRpbmcgYSBmcmVzaCBvbmVcblx0XHRcdFx0Y2xlYXJUaW1lb3V0KCAkaW5wdXQuZGF0YSggJ3RpbWVyJyApICk7XG5cblx0XHRcdFx0JGlucHV0LmRhdGEoICd0aW1lcicsIHNldFRpbWVvdXQoIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdCRpbnB1dC5yZW1vdmVEYXRhKCAndGltZXInICk7XG5cblx0XHRcdFx0XHRjb25zdCBtYXhWYWx1ZSA9ICRpbnB1dC52YWwoKTtcblxuXHRcdFx0XHRcdHNsaWRlci5ub1VpU2xpZGVyLnNldCggWyBudWxsLCBtYXhWYWx1ZSBdICk7XG5cblx0XHRcdFx0XHRmaWx0ZXJQcm9kdWN0c0FjY29yZGluZ1RvU2xpZGVyKCBzbGlkZXIubm9VaVNsaWRlci5nZXQoKSApO1xuXHRcdFx0XHR9LCBkZWxheSApICk7XG5cdFx0XHR9ICk7XG5cdFx0fSApO1xuXHR9XG5cblx0aW5pdE5vVUlTbGlkZXIoKTtcblxuXHRmdW5jdGlvbiBmaWx0ZXJCeURhdGUoICRpbnB1dCApIHtcblx0XHRpZiAoIHdjYXBmX3BhcmFtcy5mb3JfcHJldmlldyApIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHRjb25zdCAkd2NhcGZEYXRlRmlsdGVyID0gJGlucHV0LmNsb3Nlc3QoICcud2NhcGYtZGF0ZS1pbnB1dCcgKTtcblx0XHRjb25zdCBmaWx0ZXJLZXkgICAgICAgID0gJHdjYXBmRGF0ZUZpbHRlci5hdHRyKCAnZGF0YS1maWx0ZXIta2V5JyApO1xuXHRcdGNvbnN0IGlzUmFuZ2UgICAgICAgICAgPSAkd2NhcGZEYXRlRmlsdGVyLmF0dHIoICdkYXRhLWlzLXJhbmdlJyApO1xuXG5cdFx0bGV0IGZpbHRlclZhbHVlID0gJyc7XG5cdFx0bGV0IHJ1bkZpbHRlciAgID0gZmFsc2U7XG5cblx0XHQvLyBDbGVhciBhbnkgcHJldmlvdXNseSBzZXQgdGltZXIgYmVmb3JlIHNldHRpbmcgYSBmcmVzaCBvbmVcblx0XHRjbGVhclRpbWVvdXQoICR3Y2FwZkRhdGVGaWx0ZXIuZGF0YSggJ3RpbWVyJyApICk7XG5cblx0XHRpZiAoIGlzUmFuZ2UgKSB7XG5cdFx0XHRjb25zdCBmcm9tID0gJHdjYXBmRGF0ZUZpbHRlci5maW5kKCAnLmRhdGUtZnJvbS1pbnB1dCcgKS52YWwoKTtcblx0XHRcdGNvbnN0IHRvICAgPSAkd2NhcGZEYXRlRmlsdGVyLmZpbmQoICcuZGF0ZS10by1pbnB1dCcgKS52YWwoKTtcblxuXHRcdFx0aWYgKCBmcm9tICYmIHRvICkge1xuXHRcdFx0XHRmaWx0ZXJWYWx1ZSA9IGZyb20gKyByYW5nZVZhbHVlc1NlcGFyYXRvciArIHRvO1xuXHRcdFx0XHRydW5GaWx0ZXIgICA9IHRydWU7XG5cdFx0XHR9IGVsc2UgaWYgKCAhIGZyb20gJiYgISB0byApIHtcblx0XHRcdFx0cnVuRmlsdGVyID0gdHJ1ZTtcblx0XHRcdH1cblx0XHR9IGVsc2Uge1xuXHRcdFx0Y29uc3QgZnJvbSA9ICR3Y2FwZkRhdGVGaWx0ZXIuZmluZCggJy5kYXRlLWZyb20taW5wdXQnICkudmFsKCk7XG5cblx0XHRcdGlmICggZnJvbSApIHtcblx0XHRcdFx0ZmlsdGVyVmFsdWUgPSBmcm9tO1xuXHRcdFx0XHRydW5GaWx0ZXIgICA9IHRydWU7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRydW5GaWx0ZXIgPSB0cnVlO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdGlmICggcnVuRmlsdGVyICkge1xuXHRcdFx0JHdjYXBmRGF0ZUZpbHRlci5kYXRhKCAndGltZXInLCBzZXRUaW1lb3V0KCBmdW5jdGlvbigpIHtcblx0XHRcdFx0JHdjYXBmRGF0ZUZpbHRlci5yZW1vdmVEYXRhKCAndGltZXInICk7XG5cblx0XHRcdFx0aWYgKCBmaWx0ZXJWYWx1ZSApIHtcblx0XHRcdFx0XHR1cGRhdGVRdWVyeVN0cmluZ1BhcmFtZXRlciggZmlsdGVyS2V5LCBmaWx0ZXJWYWx1ZSApO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdGNvbnN0IHF1ZXJ5ID0gcmVtb3ZlUXVlcnlTdHJpbmdQYXJhbWV0ZXIoIGZpbHRlcktleSApO1xuXHRcdFx0XHRcdGhpc3RvcnkucHVzaFN0YXRlKCB7fSwgJycsIHF1ZXJ5ICk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRmaWx0ZXJQcm9kdWN0cygpO1xuXHRcdFx0fSwgZGVsYXkgKSApO1xuXHRcdH1cblx0fVxuXG5cdGZ1bmN0aW9uIGluaXREYXRlcGlja2VyKCkge1xuXHRcdGlmICggISBqUXVlcnkoKS5kYXRlcGlja2VyICkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdGxldCAkcm9vdDtcblxuXHRcdGlmICggd2NhcGZfcGFyYW1zLmZvcl9wcmV2aWV3ICkge1xuXHRcdFx0JHJvb3QgPSAkKCB3Y2FwZkRhdGVGaWx0ZXJTZWxlY3RvciApO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHQkcm9vdCA9ICR3Y2FwZkRhdGVGaWx0ZXJzO1xuXHRcdH1cblxuXHRcdGNvbnN0ICR3Y2FwZkRhdGVGaWx0ZXIgPSAkcm9vdC5maW5kKCAnLndjYXBmLWRhdGUtaW5wdXQnICk7XG5cblx0XHRjb25zdCBmb3JtYXQgICAgICAgID0gJHdjYXBmRGF0ZUZpbHRlci5hdHRyKCAnZGF0YS1kYXRlLWZvcm1hdCcgKTtcblx0XHRjb25zdCB5ZWFyRHJvcGRvd24gID0gJHdjYXBmRGF0ZUZpbHRlci5hdHRyKCAnZGF0YS1kYXRlLXBpY2tlci15ZWFyLWRyb3Bkb3duJyApO1xuXHRcdGNvbnN0IG1vbnRoRHJvcGRvd24gPSAkd2NhcGZEYXRlRmlsdGVyLmF0dHIoICdkYXRhLWRhdGUtcGlja2VyLW1vbnRoLWRyb3Bkb3duJyApO1xuXG5cdFx0Y29uc3QgJGZyb20gPSAkd2NhcGZEYXRlRmlsdGVyLmZpbmQoICcuZGF0ZS1mcm9tLWlucHV0JyApO1xuXHRcdGNvbnN0ICR0byAgID0gJHdjYXBmRGF0ZUZpbHRlci5maW5kKCAnLmRhdGUtdG8taW5wdXQnICk7XG5cblx0XHQkZnJvbS5kYXRlcGlja2VyKCB7XG5cdFx0XHRkYXRlRm9ybWF0OiBmb3JtYXQsXG5cdFx0XHRjaGFuZ2VZZWFyOiB5ZWFyRHJvcGRvd24sXG5cdFx0XHRjaGFuZ2VNb250aDogbW9udGhEcm9wZG93bixcblx0XHR9ICk7XG5cblx0XHQkdG8uZGF0ZXBpY2tlcigge1xuXHRcdFx0ZGF0ZUZvcm1hdDogZm9ybWF0LFxuXHRcdFx0Y2hhbmdlWWVhcjogeWVhckRyb3Bkb3duLFxuXHRcdFx0Y2hhbmdlTW9udGg6IG1vbnRoRHJvcGRvd24sXG5cdFx0fSApO1xuXG5cdFx0JGZyb20ub24oICdjaGFuZ2UnLCBmdW5jdGlvbigpIHtcblx0XHRcdGNvbnN0ICRpbnB1dCA9ICQoIHRoaXMgKTtcblx0XHRcdGZpbHRlckJ5RGF0ZSggJGlucHV0ICk7XG5cdFx0fSApO1xuXG5cdFx0JHRvLm9uKCAnY2hhbmdlJywgZnVuY3Rpb24oKSB7XG5cdFx0XHRjb25zdCAkaW5wdXQgPSAkKCB0aGlzICk7XG5cdFx0XHRmaWx0ZXJCeURhdGUoICRpbnB1dCApO1xuXHRcdH0gKTtcblx0fVxuXG5cdGluaXREYXRlcGlja2VyKCk7XG5cblx0ZnVuY3Rpb24gaW5pdERlZmF1bHRPcmRlckJ5KCkge1xuXHRcdC8vIEF0dGFjaCBjaG9zZW4uXG5cdFx0aWYgKCB3Y2FwZl9wYXJhbXMuYXR0YWNoX2Nob3Nlbl9vbl9zb3J0aW5nICkge1xuXHRcdFx0aWYgKCBqUXVlcnkoKS5jaG9zZW4gKSB7XG5cdFx0XHRcdCRib2R5LmZpbmQoICcud29vY29tbWVyY2Utb3JkZXJpbmcgc2VsZWN0Lm9yZGVyYnknICkuY2hvc2VuKCB7XG5cdFx0XHRcdFx0J2Rpc2FibGVfc2VhcmNoX3RocmVzaG9sZCc6IDE1LFxuXHRcdFx0XHR9ICk7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0aWYgKCAhIHdjYXBmX3BhcmFtcy5zb3J0aW5nX2NvbnRyb2wgKSB7XG5cdFx0XHQkYm9keS5maW5kKCAnLndvb2NvbW1lcmNlLW9yZGVyaW5nJyApLmVhY2goIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRjb25zdCAkb3JkZXJpbmdGb3JtID0gJCggdGhpcyApO1xuXG5cdFx0XHRcdCRvcmRlcmluZ0Zvcm0ub24oICdjaGFuZ2UnLCAnc2VsZWN0Lm9yZGVyYnknLCBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHQkb3JkZXJpbmdGb3JtLnN1Ym1pdCgpO1xuXHRcdFx0XHR9ICk7XG5cdFx0XHR9ICk7XG5cblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHQvLyB0b2RvOiBjaGVjayBpZiBhamF4IGRpc2FibGVkLlxuXHRcdCRib2R5LmZpbmQoICcud29vY29tbWVyY2Utb3JkZXJpbmcnICkuZWFjaCggZnVuY3Rpb24oKSB7XG5cdFx0XHRjb25zdCAkb3JkZXJpbmdGb3JtID0gJCggdGhpcyApO1xuXG5cdFx0XHQkb3JkZXJpbmdGb3JtLm9uKCAnc3VibWl0JywgZnVuY3Rpb24oIGUgKSB7XG5cdFx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcblx0XHRcdH0gKTtcblxuXHRcdFx0JG9yZGVyaW5nRm9ybS5vbiggJ2NoYW5nZScsICdzZWxlY3Qub3JkZXJieScsIGZ1bmN0aW9uKCBlICkge1xuXHRcdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cblx0XHRcdFx0Y29uc3Qgb3JkZXIgICAgICA9ICQoIHRoaXMgKS52YWwoKTtcblx0XHRcdFx0Y29uc3QgZmlsdGVyX2tleSA9ICdvcmRlcmJ5JztcblxuXHRcdFx0XHR1cGRhdGVRdWVyeVN0cmluZ1BhcmFtZXRlciggZmlsdGVyX2tleSwgb3JkZXIgKTtcblx0XHRcdFx0ZmlsdGVyUHJvZHVjdHMoKTtcblx0XHRcdH0gKTtcblx0XHR9ICk7XG5cdH1cblxuXHRpbml0RGVmYXVsdE9yZGVyQnkoKTtcblxuXHRmdW5jdGlvbiB1cGRhdGVQcm9kdWN0c0NvdW50UmVzdWx0KCAkcmVzdWx0cyApIHtcblx0XHRjb25zdCBzZWxlY3RvciA9ICcud29vY29tbWVyY2UtcmVzdWx0LWNvdW50JztcblxuXHRcdGlmICggJCggd2NhcGZfcGFyYW1zLnNob3BfbG9vcF9jb250YWluZXIgKS5maW5kKCBzZWxlY3RvciApLmxlbmd0aCApIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHRjb25zdCBuZXdQcm9kdWN0Q291bnQgPSAkcmVzdWx0cy5maW5kKCBzZWxlY3RvciApLmh0bWwoKTtcblxuXHRcdCRib2R5LmZpbmQoIHNlbGVjdG9yICkuaHRtbCggbmV3UHJvZHVjdENvdW50ICk7XG5cdH1cblxuXHRmdW5jdGlvbiBzaG93TG9hZGluZ0FuaW1hdGlvbigpIHtcblx0XHRpZiAoICEgd2NhcGZfcGFyYW1zLmxvYWRpbmdfYW5pbWF0aW9uICkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdCQuTG9hZGluZ092ZXJsYXkoICdzaG93Jywgd2NhcGZfcGFyYW1zLmxvYWRpbmdfb3ZlcmxheV9vcHRpb25zICk7XG5cdH1cblxuXHRmdW5jdGlvbiBkaXNhYmxlTm9VaVNsaWRlcnMoKSB7XG5cdFx0aWYgKCAndW5kZWZpbmVkJyA9PT0gdHlwZW9mIG5vVWlTbGlkZXIgKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0JHdjYXBmTnVtYmVyUmFuZ2VGaWx0ZXJzLmZpbmQoICcud2NhcGYtbm91aS1zbGlkZXInICkuZWFjaCggZnVuY3Rpb24oIGUsIGVsZW1lbnQgKSB7XG5cdFx0XHRlbGVtZW50LnNldEF0dHJpYnV0ZSggJ2Rpc2FibGVkJywgdHJ1ZSApO1xuXHRcdH0gKTtcblx0fVxuXG5cdGZ1bmN0aW9uIGRpc2FibGVMYWJlbHMoKSB7XG5cdFx0Y29uc3Qgc2VsZWN0b3JzID0gJy53Y2FwZi1sYWJlbGVkLW5hdiAuaXRlbSwgLndjYXBmLWFjdGl2ZS1maWx0ZXJzIC5pdGVtJztcblxuXHRcdC8vIFRPRE86IEFkZCBkaXNhYmxlZCBhdHRyaWJ1dGUuXG5cdFx0JHdjYXBmU2luZ2xlRmlsdGVycy5maW5kKCBzZWxlY3RvcnMgKS5hZGRDbGFzcyggJ2Rpc2FibGVkJyApO1xuXHR9XG5cblx0ZnVuY3Rpb24gZGlzYWJsZUlucHV0cygpIHtcblx0XHRpZiAoICEgd2NhcGZfcGFyYW1zLmRpc2FibGVfaW5wdXRzX3doaWxlX2ZldGNoaW5nX3Jlc3VsdHMgKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0Y29uc3QgaW5wdXRzID0gJ2lucHV0LCBzZWxlY3QnO1xuXG5cdFx0JHdjYXBmU2luZ2xlRmlsdGVycy5maW5kKCBpbnB1dHMgKS5hdHRyKCAnZGlzYWJsZWQnLCAnZGlzYWJsZWQnICk7XG5cdFx0JHdjYXBmU2luZ2xlRmlsdGVycy5maW5kKCBpbnB1dHMgKS50cmlnZ2VyKCAnY2hvc2VuOnVwZGF0ZWQnICk7XG5cblx0XHRkaXNhYmxlTm9VaVNsaWRlcnMoKTtcblx0XHRkaXNhYmxlTGFiZWxzKCk7XG5cdH1cblxuXHRmdW5jdGlvbiBlbmFibGVOb1VpU2xpZGVycygpIHtcblx0XHRpZiAoICd1bmRlZmluZWQnID09PSB0eXBlb2Ygbm9VaVNsaWRlciApIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHQkd2NhcGZOdW1iZXJSYW5nZUZpbHRlcnMuZmluZCggJy53Y2FwZi1ub3VpLXNsaWRlcicgKS5lYWNoKCBmdW5jdGlvbiggZSwgZWxlbWVudCApIHtcblx0XHRcdGVsZW1lbnQucmVtb3ZlQXR0cmlidXRlKCAnZGlzYWJsZWQnICk7XG5cdFx0fSApO1xuXHR9XG5cblx0ZnVuY3Rpb24gZW5hYmxlSW5wdXRzKCkge1xuXHRcdGlmICggISB3Y2FwZl9wYXJhbXMuZGlzYWJsZV9pbnB1dHNfd2hpbGVfZmV0Y2hpbmdfcmVzdWx0cyApIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHRjb25zdCBpbnB1dHMgPSAnaW5wdXQnO1xuXG5cdFx0JHdjYXBmTnVtYmVyUmFuZ2VGaWx0ZXJzLmZpbmQoIGlucHV0cyApLnJlbW92ZUF0dHIoICdkaXNhYmxlZCcgKTtcblx0XHQkd2NhcGZEYXRlRmlsdGVycy5maW5kKCBpbnB1dHMgKS5yZW1vdmVBdHRyKCAnZGlzYWJsZWQnICk7XG5cblx0XHRlbmFibGVOb1VpU2xpZGVycygpO1xuXHR9XG5cblx0ZnVuY3Rpb24gcmVzZXRMb2FkaW5nQW5pbWF0aW9uKCkge1xuXHRcdGlmICggISB3Y2FwZl9wYXJhbXMubG9hZGluZ19hbmltYXRpb24gKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0JC5Mb2FkaW5nT3ZlcmxheSggJ2hpZGUnICk7XG5cdH1cblxuXHRmdW5jdGlvbiBzY3JvbGxUbygpIHtcblx0XHRpZiAoICdub25lJyA9PT0gd2NhcGZfcGFyYW1zLnNjcm9sbF93aW5kb3cgKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0Y29uc3Qgc2Nyb2xsRm9yID0gd2NhcGZfcGFyYW1zLnNjcm9sbF93aW5kb3dfZm9yO1xuXHRcdGNvbnN0IGlzTW9iaWxlICA9IHdjYXBmX3BhcmFtcy5pc19tb2JpbGU7XG5cdFx0bGV0IHByb2NlZWQgICAgID0gZmFsc2U7XG5cblx0XHRpZiAoICdtb2JpbGUnID09PSBzY3JvbGxGb3IgJiYgaXNNb2JpbGUgKSB7XG5cdFx0XHRwcm9jZWVkID0gdHJ1ZTtcblx0XHR9IGVsc2UgaWYgKCAnZGVza3RvcCcgPT09IHNjcm9sbEZvciAmJiAhIGlzTW9iaWxlICkge1xuXHRcdFx0cHJvY2VlZCA9IHRydWU7XG5cdFx0fSBlbHNlIGlmICggJ2JvdGgnID09PSBzY3JvbGxGb3IgKSB7XG5cdFx0XHRwcm9jZWVkID0gdHJ1ZTtcblx0XHR9XG5cblx0XHRpZiAoICEgcHJvY2VlZCApIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHRsZXQgYWRqdXN0aW5nT2Zmc2V0LCBvZmZzZXQ7XG5cblx0XHRpZiAoIHdjYXBmX3BhcmFtcy5zY3JvbGxfdG9fdG9wX29mZnNldCApIHtcblx0XHRcdGFkanVzdGluZ09mZnNldCA9IHBhcnNlSW50KCB3Y2FwZl9wYXJhbXMuc2Nyb2xsX3RvX3RvcF9vZmZzZXQgKTtcblx0XHR9XG5cblx0XHRsZXQgY29udGFpbmVyO1xuXG5cdFx0aWYgKCAkKCB3Y2FwZl9wYXJhbXMuc2hvcF9sb29wX2NvbnRhaW5lciApLmxlbmd0aCApIHtcblx0XHRcdGNvbnRhaW5lciA9IHdjYXBmX3BhcmFtcy5zaG9wX2xvb3BfY29udGFpbmVyO1xuXHRcdH0gZWxzZSBpZiAoICQoIHdjYXBmX3BhcmFtcy5ub3RfZm91bmRfY29udGFpbmVyICkubGVuZ3RoICkge1xuXHRcdFx0Y29udGFpbmVyID0gd2NhcGZfcGFyYW1zLm5vdF9mb3VuZF9jb250YWluZXI7XG5cdFx0fVxuXG5cdFx0aWYgKCAnY3VzdG9tJyA9PT0gd2NhcGZfcGFyYW1zLnNjcm9sbF93aW5kb3cgKSB7XG5cdFx0XHRjb250YWluZXIgPSB3Y2FwZl9wYXJhbXMuc2Nyb2xsX3dpbmRvd19jdXN0b21fZWxlbWVudDtcblx0XHR9XG5cblx0XHRjb25zdCAkY29udGFpbmVyID0gJCggY29udGFpbmVyICk7XG5cblx0XHRpZiAoICRjb250YWluZXIubGVuZ3RoICkge1xuXHRcdFx0b2Zmc2V0ID0gJGNvbnRhaW5lci5vZmZzZXQoKS50b3AgLSBhZGp1c3RpbmdPZmZzZXQ7XG5cblx0XHRcdGlmICggb2Zmc2V0IDwgMCApIHtcblx0XHRcdFx0b2Zmc2V0ID0gMDtcblx0XHRcdH1cblxuXHRcdFx0JCggJ2h0bWwsIGJvZHknICkuc3RvcCgpLmFuaW1hdGUoXG5cdFx0XHRcdHsgc2Nyb2xsVG9wOiBvZmZzZXQgfSxcblx0XHRcdFx0d2NhcGZfcGFyYW1zLnNjcm9sbF90b190b3Bfc3BlZWQsXG5cdFx0XHRcdHdjYXBmX3BhcmFtcy5zY3JvbGxfdG9fdG9wX2Vhc2luZ1xuXHRcdFx0KTtcblx0XHR9XG5cdH1cblxuXHQvLyBUaGluZ3MgYXJlIGRvbmUgYmVmb3JlIGZldGNoaW5nIHRoZSBwcm9kdWN0cyBsaWtlIHNob3dpbmcgYSBsb2FkaW5nIGluZGljYXRvci5cblx0ZnVuY3Rpb24gYmVmb3JlRmV0Y2hpbmdQcm9kdWN0cygpIHtcblx0XHRkaXNhYmxlSW5wdXRzKCk7XG5cdFx0c2hvd0xvYWRpbmdBbmltYXRpb24oKTtcblxuXHRcdGlmICggJ2ltbWVkaWF0ZWx5JyA9PT0gd2NhcGZfcGFyYW1zLnNjcm9sbF93aW5kb3dfd2hlbiApIHtcblx0XHRcdHNjcm9sbFRvKCk7XG5cdFx0fVxuXG5cdFx0JGJvZHkudHJpZ2dlciggJ3djYXBmX2JlZm9yZV9mZXRjaGluZ19wcm9kdWN0cycgKTtcblx0fVxuXG5cdGZ1bmN0aW9uIGJlZm9yZVVwZGF0aW5nUHJvZHVjdHMoICRyZXN1bHRzICkge1xuXHRcdHJlc2V0TG9hZGluZ0FuaW1hdGlvbigpO1xuXG5cdFx0JGJvZHkudHJpZ2dlciggJ3djYXBmX2JlZm9yZV91cGRhdGluZ19wcm9kdWN0cycsIFsgJHJlc3VsdHMgXSApO1xuXHR9XG5cblx0Ly8gVGhpbmdzIGFyZSBkb25lIGFmdGVyIGFwcGx5aW5nIHRoZSBmaWx0ZXIgbGlrZSBzY3JvbGwgdG8gdG9wLlxuXHRmdW5jdGlvbiBhZnRlclVwZGF0aW5nUHJvZHVjdHMoICRyZXN1bHRzICkge1xuXHRcdGluaXRDaG9zZW4oKTtcblx0XHRpbml0SGllcmFyY2h5QWNjb3JkaW9uKCk7XG5cdFx0aW5pdE5vVUlTbGlkZXIoKTtcblx0XHRpbml0RGF0ZXBpY2tlcigpO1xuXHRcdGluaXREZWZhdWx0T3JkZXJCeSgpO1xuXHRcdHVwZGF0ZVByb2R1Y3RzQ291bnRSZXN1bHQoICRyZXN1bHRzICk7XG5cdFx0ZW5hYmxlSW5wdXRzKCk7XG5cblx0XHRpZiAoICdhZnRlcicgPT09IHdjYXBmX3BhcmFtcy5zY3JvbGxfd2luZG93X3doZW4gKSB7XG5cdFx0XHRzY3JvbGxUbygpO1xuXHRcdH1cblxuXHRcdCRib2R5LnRyaWdnZXIoICd3Y2FwZl9hZnRlcl91cGRhdGluZ19wcm9kdWN0cycsIFsgJHJlc3VsdHMgXSApO1xuXHR9XG5cblx0Ly8gVGhlIG1haW4gZmlsdGVyIGZ1bmN0aW9uLlxuXHRmdW5jdGlvbiBmaWx0ZXJQcm9kdWN0cyggZm9yY2VSZVJlbmRlciA9IGZhbHNlICkge1xuXHRcdGlmICggd2NhcGZfcGFyYW1zLmZvcl9wcmV2aWV3ICkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdGJlZm9yZUZldGNoaW5nUHJvZHVjdHMoKTtcblxuXHRcdCQuZ2V0KCB3aW5kb3cubG9jYXRpb24uaHJlZiwgZnVuY3Rpb24oIGRhdGEgKSB7XG5cdFx0XHRjb25zdCAkZGF0YSA9ICQoIGRhdGEgKTtcblxuXHRcdFx0Ly8gUmVwbGFjZSB0aGUgZmllbGRzJyBkYXRhIHdpdGggbmV3IGRhdGEuXG5cdFx0XHQkLmVhY2goIGZpZWxkcywgZnVuY3Rpb24oIGlkICkge1xuXHRcdFx0XHRjb25zdCBmaWVsZElEICAgID0gJ1tkYXRhLWlkPVwiJyArIGlkICsgJ1wiXSc7XG5cdFx0XHRcdGNvbnN0ICRmaWVsZCAgICAgPSAkKCBmaWVsZElEICk7XG5cdFx0XHRcdGNvbnN0ICRpbm5lciAgICAgPSAkZmllbGQuZmluZCggJy53Y2FwZi1maWVsZC1pbm5lcicgKTtcblx0XHRcdFx0Y29uc3QgX2ZpZWxkICAgICA9ICRkYXRhLmZpbmQoIGZpZWxkSUQgKTtcblx0XHRcdFx0bGV0IGZpZWxkQ2xhc3NlcyA9ICQoIF9maWVsZCApLmF0dHIoICdjbGFzcycgKTtcblxuXHRcdFx0XHQvLyBQcmVzZXJ2ZSBoaWVyYXJjaHkgYWNjb3JkaW9uIHN0YXRlLlxuXHRcdFx0XHRpZiAoIHdjYXBmX3BhcmFtcy5wcmVzZXJ2ZV9oaWVyYXJjaHlfYWNjb3JkaW9uX3N0YXRlICkge1xuXHRcdFx0XHRcdGlmICggJGZpZWxkLmhhc0NsYXNzKCAnaGllcmFyY2h5LWFjY29yZGlvbicgKSApIHtcblx0XHRcdFx0XHRcdCRmaWVsZC5maW5kKCAnLmhpZXJhcmNoeS1hY2NvcmRpb24tdG9nZ2xlLmFjdGl2ZScgKS5lYWNoKCBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHRcdFx0Y29uc3QgaXRlbVZhbHVlICAgICAgPSAkKCB0aGlzICkucGFyZW50KCkuY2hpbGRyZW4oICdpbnB1dCcgKS52YWwoKTtcblx0XHRcdFx0XHRcdFx0Y29uc3QgdG9nZ2xlU2VsZWN0b3IgPSAnaW5wdXRbdmFsdWU9XCInICsgaXRlbVZhbHVlICsgJ1wiXSB+IC5oaWVyYXJjaHktYWNjb3JkaW9uLXRvZ2dsZSc7XG5cdFx0XHRcdFx0XHRcdGNvbnN0IHVsU2VsZWN0b3IgICAgID0gJ2lucHV0W3ZhbHVlPVwiJyArIGl0ZW1WYWx1ZSArICdcIl0gfiB1bCc7XG5cdFx0XHRcdFx0XHRcdGNvbnN0IF9jbGFzc2VzICAgICAgID0gJ2hpZXJhcmNoeS1hY2NvcmRpb24tdG9nZ2xlIGFjdGl2ZSc7XG5cblx0XHRcdFx0XHRcdFx0X2ZpZWxkLmZpbmQoIHRvZ2dsZVNlbGVjdG9yICkuYXR0ciggJ2NsYXNzJywgX2NsYXNzZXMgKTtcblx0XHRcdFx0XHRcdFx0X2ZpZWxkLmZpbmQoIHVsU2VsZWN0b3IgKS5zaG93KCk7XG5cdFx0XHRcdFx0XHR9ICk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cblx0XHRcdFx0Y29uc3QgX2h0bWwgPSBfZmllbGQuZmluZCggJy53Y2FwZi1maWVsZC1pbm5lcicgKS5odG1sKCk7XG5cblx0XHRcdFx0Ly8gU2hvdyBzb2Z0IGxpbWl0IGl0ZW1zLlxuXHRcdFx0XHRjb25zdCBzb2Z0TGltaXRTZWxlY3RvciA9ICdzaG93LWhpZGRlbi1pdGVtcyc7XG5cblx0XHRcdFx0aWYgKCAkZmllbGQuaGFzQ2xhc3MoIHNvZnRMaW1pdFNlbGVjdG9yICkgKSB7XG5cdFx0XHRcdFx0aWYgKCAhIF9maWVsZC5oYXNDbGFzcyggc29mdExpbWl0U2VsZWN0b3IgKSApIHtcblx0XHRcdFx0XHRcdGZpZWxkQ2xhc3NlcyArPSAnICcgKyBzb2Z0TGltaXRTZWxlY3Rvcjtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0ZmllbGRDbGFzc2VzID0gZmllbGRDbGFzc2VzLnJlcGxhY2UoIHNvZnRMaW1pdFNlbGVjdG9yLCAnJyApO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0Ly8gVXBkYXRlIHRoZSBmaWVsZCdzIGNsYXNzLlxuXHRcdFx0XHQkZmllbGQuYXR0ciggJ2NsYXNzJywgZmllbGRDbGFzc2VzLnRyaW0oKSApO1xuXG5cdFx0XHRcdC8vIFdoZW4gY2FsbGVkIGZyb20gaGlzdG9yeSBiYWNrIG9yIGZvcndhcmQgcmVxdWVzdCB0aGVuIHJlcmVuZGVyIGFsbCBmaWVsZHMuXG5cdFx0XHRcdGlmICggZm9yY2VSZVJlbmRlciApIHtcblxuXHRcdFx0XHRcdC8vIHVwZGF0ZSBmaWVsZFxuXHRcdFx0XHRcdCRpbm5lci5odG1sKCBfaHRtbCApO1xuXG5cdFx0XHRcdH0gZWxzZSB7XG5cblx0XHRcdFx0XHQvLyBTZWxlY3RpdmVseSByZXJlbmRlciB0aGUgZmllbGRzLlxuXHRcdFx0XHRcdGlmICggJGZpZWxkLmhhc0NsYXNzKCAnd2NhcGYtbmF2LWZpbHRlcicgKSApIHtcblxuXHRcdFx0XHRcdFx0Ly8gdXBkYXRlIGZpZWxkXG5cdFx0XHRcdFx0XHQkaW5uZXIuaHRtbCggX2h0bWwgKTtcblxuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHR9XG5cblx0XHRcdFx0JGZpZWxkLnRyaWdnZXIoICd3Y2FwZi1maWVsZC11cGRhdGVkJywgWyBfZmllbGQgXSApO1xuXHRcdFx0fSApO1xuXG5cdFx0XHRiZWZvcmVVcGRhdGluZ1Byb2R1Y3RzKCAkZGF0YSApO1xuXG5cdFx0XHQvLyBSZXBsYWNlIG9sZCBzaG9wIGxvb3Agd2l0aCBuZXcgb25lLlxuXHRcdFx0Y29uc3QgJHNob3BMb29wQ29udGFpbmVyID0gJGRhdGEuZmluZCggd2NhcGZfcGFyYW1zLnNob3BfbG9vcF9jb250YWluZXIgKTtcblx0XHRcdGNvbnN0ICRub3RGb3VuZENvbnRhaW5lciA9ICRkYXRhLmZpbmQoIHdjYXBmX3BhcmFtcy5ub3RfZm91bmRfY29udGFpbmVyICk7XG5cblx0XHRcdGlmICggd2NhcGZfcGFyYW1zLnNob3BfbG9vcF9jb250YWluZXIgPT09IHdjYXBmX3BhcmFtcy5ub3RfZm91bmRfY29udGFpbmVyICkge1xuXHRcdFx0XHQkKCB3Y2FwZl9wYXJhbXMuc2hvcF9sb29wX2NvbnRhaW5lciApLmh0bWwoICRzaG9wTG9vcENvbnRhaW5lci5odG1sKCkgKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGlmICggJCggd2NhcGZfcGFyYW1zLm5vdF9mb3VuZF9jb250YWluZXIgKS5sZW5ndGggKSB7XG5cdFx0XHRcdFx0aWYgKCAkc2hvcExvb3BDb250YWluZXIubGVuZ3RoICkge1xuXHRcdFx0XHRcdFx0JCggd2NhcGZfcGFyYW1zLm5vdF9mb3VuZF9jb250YWluZXIgKS5odG1sKCAkc2hvcExvb3BDb250YWluZXIuaHRtbCgpICk7XG5cdFx0XHRcdFx0fSBlbHNlIGlmICggJG5vdEZvdW5kQ29udGFpbmVyLmxlbmd0aCApIHtcblx0XHRcdFx0XHRcdCQoIHdjYXBmX3BhcmFtcy5ub3RfZm91bmRfY29udGFpbmVyICkuaHRtbCggJG5vdEZvdW5kQ29udGFpbmVyLmh0bWwoKSApO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSBlbHNlIGlmICggJCggd2NhcGZfcGFyYW1zLnNob3BfbG9vcF9jb250YWluZXIgKS5sZW5ndGggKSB7XG5cdFx0XHRcdFx0aWYgKCAkc2hvcExvb3BDb250YWluZXIubGVuZ3RoICkge1xuXHRcdFx0XHRcdFx0JCggd2NhcGZfcGFyYW1zLnNob3BfbG9vcF9jb250YWluZXIgKS5odG1sKCAkc2hvcExvb3BDb250YWluZXIuaHRtbCgpICk7XG5cdFx0XHRcdFx0fSBlbHNlIGlmICggJG5vdEZvdW5kQ29udGFpbmVyLmxlbmd0aCApIHtcblx0XHRcdFx0XHRcdCQoIHdjYXBmX3BhcmFtcy5zaG9wX2xvb3BfY29udGFpbmVyICkuaHRtbCggJG5vdEZvdW5kQ29udGFpbmVyLmh0bWwoKSApO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0XHRhZnRlclVwZGF0aW5nUHJvZHVjdHMoICRkYXRhICk7XG5cdFx0fSApO1xuXHR9XG5cblx0Ly8gVVJMIFBhcnNlclxuXHRmdW5jdGlvbiBnZXRVcmxWYXJzKCB1cmwgKSB7XG5cdFx0bGV0IHZhcnMgPSB7fSwgaGFzaDtcblxuXHRcdGlmICggdHlwZW9mIHVybCA9PT0gJ3VuZGVmaW5lZCcgKSB7XG5cdFx0XHR1cmwgPSB3aW5kb3cubG9jYXRpb24uaHJlZjtcblx0XHR9XG5cblx0XHR1cmwgPSB1cmwucmVwbGFjZUFsbCggJyUyQycsICcsJyApO1xuXG5cdFx0Y29uc3QgaGFzaGVzICA9IHVybC5zbGljZSggdXJsLmluZGV4T2YoICc/JyApICsgMSApLnNwbGl0KCAnJicgKTtcblx0XHRjb25zdCBoTGVuZ3RoID0gaGFzaGVzLmxlbmd0aDtcblxuXHRcdGZvciAoIGxldCBpID0gMDsgaSA8IGhMZW5ndGg7IGkrKyApIHtcblx0XHRcdGhhc2ggPSBoYXNoZXNbIGkgXS5zcGxpdCggJz0nICk7XG5cblx0XHRcdHZhcnNbIGhhc2hbIDAgXSBdID0gaGFzaFsgMSBdO1xuXHRcdH1cblxuXHRcdHJldHVybiB2YXJzO1xuXHR9XG5cblx0Ly8gZXZlcnl0aW1lIHdlIGFwcGx5IHRoZSBmaWx0ZXIgd2Ugc2V0IHRoZSBjdXJyZW50IHBhZ2UgdG8gMVxuXHRmdW5jdGlvbiBmaXhQYWdpbmF0aW9uKCkge1xuXHRcdGxldCB1cmwgICAgICAgICAgICAgICAgPSB3aW5kb3cubG9jYXRpb24uaHJlZjtcblx0XHRjb25zdCBwYXJhbXMgICAgICAgICAgID0gZ2V0VXJsVmFycyggdXJsICk7XG5cdFx0Y29uc3QgY3VycmVudFBhZ2VJblVybCA9IHBhcnNlSW50KCB1cmwucmVwbGFjZSggLy4rXFwvcGFnZVxcLyhcXGQrKSsvLCAnJDEnICkgKTtcblxuXHRcdGlmICggY3VycmVudFBhZ2VJblVybCApIHtcblx0XHRcdGlmICggY3VycmVudFBhZ2VJblVybCA+IDEgKSB7XG5cdFx0XHRcdHVybCA9IHVybC5yZXBsYWNlKCAvcGFnZVxcLyhcXGQrKS8sICdwYWdlLzEnICk7XG5cdFx0XHR9XG5cdFx0fSBlbHNlIGlmICggdHlwZW9mIHBhcmFtc1sgJ3BhZ2VkJyBdICE9PSAndW5kZWZpbmVkJyApIHtcblx0XHRcdGNvbnN0IGN1cnJlbnRQYWdlSW5QYXJhbXMgPSBwYXJzZUludCggcGFyYW1zWyAncGFnZWQnIF0gKTtcblxuXHRcdFx0aWYgKCBjdXJyZW50UGFnZUluUGFyYW1zID4gMSApIHtcblx0XHRcdFx0dXJsID0gdXJsLnJlcGxhY2UoICdwYWdlZD0nICsgY3VycmVudFBhZ2VJblBhcmFtcywgJ3BhZ2VkPTEnICk7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHVybDtcblx0fVxuXG5cdC8vIHVwZGF0ZSBxdWVyeSBzdHJpbmcgZm9yIGNhdGVnb3JpZXMsIG1ldGEgZXRjLi5cblx0ZnVuY3Rpb24gdXBkYXRlUXVlcnlTdHJpbmdQYXJhbWV0ZXIoIGtleSwgdmFsdWUsIHB1c2hIaXN0b3J5LCB1cmwgKSB7XG5cdFx0aWYgKCB0eXBlb2YgcHVzaEhpc3RvcnkgPT09ICd1bmRlZmluZWQnICkge1xuXHRcdFx0cHVzaEhpc3RvcnkgPSB0cnVlO1xuXHRcdH1cblxuXHRcdGlmICggdHlwZW9mIHVybCA9PT0gJ3VuZGVmaW5lZCcgKSB7XG5cdFx0XHR1cmwgPSBmaXhQYWdpbmF0aW9uKCk7XG5cdFx0fVxuXG5cdFx0Y29uc3QgcmUgICAgICAgID0gbmV3IFJlZ0V4cCggJyhbPyZdKScgKyBrZXkgKyAnPS4qPygmfCQpJywgJ2knICk7XG5cdFx0Y29uc3Qgc2VwYXJhdG9yID0gdXJsLmluZGV4T2YoICc/JyApICE9PSAtMSA/ICcmJyA6ICc/Jztcblx0XHRsZXQgdXJsV2l0aFF1ZXJ5O1xuXG5cdFx0aWYgKCB1cmwubWF0Y2goIHJlICkgKSB7XG5cdFx0XHR1cmxXaXRoUXVlcnkgPSB1cmwucmVwbGFjZSggcmUsICckMScgKyBrZXkgKyAnPScgKyB2YWx1ZSArICckMicgKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0dXJsV2l0aFF1ZXJ5ID0gdXJsICsgc2VwYXJhdG9yICsga2V5ICsgJz0nICsgdmFsdWU7XG5cdFx0fVxuXG5cdFx0aWYgKCBwdXNoSGlzdG9yeSA9PT0gdHJ1ZSApIHtcblx0XHRcdHJldHVybiBoaXN0b3J5LnB1c2hTdGF0ZSgge30sICcnLCB1cmxXaXRoUXVlcnkgKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0cmV0dXJuIHVybFdpdGhRdWVyeTtcblx0XHR9XG5cdH1cblxuXHQvLyByZW1vdmUgcGFyYW1ldGVyIGZyb20gdXJsXG5cdGZ1bmN0aW9uIHJlbW92ZVF1ZXJ5U3RyaW5nUGFyYW1ldGVyKCBmaWx0ZXJLZXksIHVybCApIHtcblx0XHRpZiAoIHR5cGVvZiB1cmwgPT09ICd1bmRlZmluZWQnICkge1xuXHRcdFx0dXJsID0gZml4UGFnaW5hdGlvbigpO1xuXHRcdH1cblxuXHRcdGNvbnN0IG9sZFBhcmFtcyAgICAgICAgID0gZ2V0VXJsVmFycyggdXJsICk7XG5cdFx0Y29uc3Qgb2xkUGFyYW1zTGVuZ3RoICAgPSBPYmplY3Qua2V5cyggb2xkUGFyYW1zICkubGVuZ3RoO1xuXHRcdGNvbnN0IHN0YXJ0UG9zaXRpb24gICAgID0gdXJsLmluZGV4T2YoICc/JyApO1xuXHRcdGNvbnN0IGZpbHRlcktleVBvc2l0aW9uID0gdXJsLmluZGV4T2YoIGZpbHRlcktleSApO1xuXHRcdGxldCBjbGVhblVybCwgY2xlYW5RdWVyeTtcblxuXHRcdGlmICggb2xkUGFyYW1zTGVuZ3RoID4gMSApIHtcblx0XHRcdGlmICggKCBmaWx0ZXJLZXlQb3NpdGlvbiAtIHN0YXJ0UG9zaXRpb24gKSA+IDEgKSB7XG5cdFx0XHRcdGNsZWFuVXJsID0gdXJsLnJlcGxhY2UoICcmJyArIGZpbHRlcktleSArICc9JyArIG9sZFBhcmFtc1sgZmlsdGVyS2V5IF0sICcnICk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRjbGVhblVybCA9IHVybC5yZXBsYWNlKCBmaWx0ZXJLZXkgKyAnPScgKyBvbGRQYXJhbXNbIGZpbHRlcktleSBdICsgJyYnLCAnJyApO1xuXHRcdFx0fVxuXG5cdFx0XHRjb25zdCBuZXdQYXJhbXMgPSBjbGVhblVybC5zcGxpdCggJz8nICk7XG5cdFx0XHRjbGVhblF1ZXJ5ICAgICAgPSAnPycgKyBuZXdQYXJhbXNbIDEgXTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0Y2xlYW5RdWVyeSA9IHVybC5yZXBsYWNlKCAnPycgKyBmaWx0ZXJLZXkgKyAnPScgKyBvbGRQYXJhbXNbIGZpbHRlcktleSBdLCAnJyApO1xuXHRcdH1cblxuXHRcdHJldHVybiBjbGVhblF1ZXJ5O1xuXHR9XG5cblx0Ly8gdGFrZSB0aGUga2V5IGFuZCB2YWx1ZSBhbmQgbWFrZSBxdWVyeVxuXHRmdW5jdGlvbiBtYWtlUGFyYW1ldGVycyggZmlsdGVyS2V5LCBmaWx0ZXJWYWx1ZSwgZm9yY2VSZXJlbmRlciA9IGZhbHNlLCB1cmwgKSB7XG5cdFx0Y29uc3QgdmFsdWVTZXBhcmF0b3IgPSAnLCc7XG5cblx0XHRsZXQgcGFyYW1zLCBuZXh0VmFsdWVzLCBlbXB0eVZhbHVlID0gZmFsc2U7XG5cblx0XHRpZiAoIHR5cGVvZiB1cmwgIT09ICd1bmRlZmluZWQnICkge1xuXHRcdFx0cGFyYW1zID0gZ2V0VXJsVmFycyggdXJsICk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHBhcmFtcyA9IGdldFVybFZhcnMoKTtcblx0XHR9XG5cblx0XHRpZiAoIHR5cGVvZiBwYXJhbXNbIGZpbHRlcktleSBdICE9ICd1bmRlZmluZWQnICkge1xuXHRcdFx0Y29uc3QgcHJldlZhbHVlcyAgICAgID0gcGFyYW1zWyBmaWx0ZXJLZXkgXTtcblx0XHRcdGNvbnN0IHByZXZWYWx1ZXNBcnJheSA9IHByZXZWYWx1ZXMuc3BsaXQoIHZhbHVlU2VwYXJhdG9yICk7XG5cblx0XHRcdGlmICggcHJldlZhbHVlcy5sZW5ndGggPiAwICkge1xuXHRcdFx0XHRjb25zdCBmb3VuZCA9ICQuaW5BcnJheSggZmlsdGVyVmFsdWUsIHByZXZWYWx1ZXNBcnJheSApO1xuXG5cdFx0XHRcdGlmICggZm91bmQgPj0gMCApIHtcblx0XHRcdFx0XHQvLyBFbGVtZW50IHdhcyBmb3VuZCwgcmVtb3ZlIGl0LlxuXHRcdFx0XHRcdHByZXZWYWx1ZXNBcnJheS5zcGxpY2UoIGZvdW5kLCAxICk7XG5cblx0XHRcdFx0XHRpZiAoIHByZXZWYWx1ZXNBcnJheS5sZW5ndGggPT09IDAgKSB7XG5cdFx0XHRcdFx0XHRlbXB0eVZhbHVlID0gdHJ1ZTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0Ly8gRWxlbWVudCB3YXMgbm90IGZvdW5kLCBhZGQgaXQuXG5cdFx0XHRcdFx0cHJldlZhbHVlc0FycmF5LnB1c2goIGZpbHRlclZhbHVlICk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRpZiAoIHByZXZWYWx1ZXNBcnJheS5sZW5ndGggPiAxICkge1xuXHRcdFx0XHRcdG5leHRWYWx1ZXMgPSBwcmV2VmFsdWVzQXJyYXkuam9pbiggdmFsdWVTZXBhcmF0b3IgKTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRuZXh0VmFsdWVzID0gcHJldlZhbHVlc0FycmF5O1xuXHRcdFx0XHR9XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRuZXh0VmFsdWVzID0gZmlsdGVyVmFsdWU7XG5cdFx0XHR9XG5cdFx0fSBlbHNlIHtcblx0XHRcdG5leHRWYWx1ZXMgPSBmaWx0ZXJWYWx1ZTtcblx0XHR9XG5cblx0XHQvLyB1cGRhdGUgdXJsIGFuZCBxdWVyeSBzdHJpbmdcblx0XHRpZiAoICEgZW1wdHlWYWx1ZSApIHtcblx0XHRcdHVwZGF0ZVF1ZXJ5U3RyaW5nUGFyYW1ldGVyKCBmaWx0ZXJLZXksIG5leHRWYWx1ZXMgKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0Y29uc3QgcXVlcnkgPSByZW1vdmVRdWVyeVN0cmluZ1BhcmFtZXRlciggZmlsdGVyS2V5ICk7XG5cdFx0XHRoaXN0b3J5LnB1c2hTdGF0ZSgge30sICcnLCBxdWVyeSApO1xuXHRcdH1cblxuXHRcdGZpbHRlclByb2R1Y3RzKCBmb3JjZVJlcmVuZGVyICk7XG5cdH1cblxuXHRmdW5jdGlvbiBzaW5nbGVGaWx0ZXIoIGZpbHRlcktleSwgZmlsdGVyVmFsdWUgKSB7XG5cdFx0Y29uc3QgcGFyYW1zID0gZ2V0VXJsVmFycygpO1xuXHRcdGxldCBxdWVyeTtcblxuXHRcdGlmICggdHlwZW9mIHBhcmFtc1sgZmlsdGVyS2V5IF0gIT09ICd1bmRlZmluZWQnICYmIHBhcmFtc1sgZmlsdGVyS2V5IF0gPT09IGZpbHRlclZhbHVlICkge1xuXHRcdFx0cXVlcnkgPSByZW1vdmVRdWVyeVN0cmluZ1BhcmFtZXRlciggZmlsdGVyS2V5ICk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHF1ZXJ5ID0gdXBkYXRlUXVlcnlTdHJpbmdQYXJhbWV0ZXIoIGZpbHRlcktleSwgZmlsdGVyVmFsdWUsIGZhbHNlICk7XG5cdFx0fVxuXG5cdFx0Ly8gdXBkYXRlIHVybFxuXHRcdGhpc3RvcnkucHVzaFN0YXRlKCB7fSwgJycsIHF1ZXJ5ICk7XG5cblx0XHRmaWx0ZXJQcm9kdWN0cygpO1xuXHR9XG5cblx0Ly8gSGFuZGxlIHRoZSBwYWdpbmF0aW9uIHJlcXVlc3QgdmlhIGFqYXguXG5cdGlmICggd2NhcGZfcGFyYW1zLmVuYWJsZV9wYWdpbmF0aW9uX3ZpYV9hamF4ICYmIHdjYXBmX3BhcmFtcy5wYWdpbmF0aW9uX2NvbnRhaW5lciApIHtcblx0XHRjb25zdCAkY29udGFpbmVyID0gJCggd2NhcGZfcGFyYW1zLnNob3BfbG9vcF9jb250YWluZXIgKTtcblx0XHRjb25zdCBzZWxlY3RvciAgID0gd2NhcGZfcGFyYW1zLnBhZ2luYXRpb25fY29udGFpbmVyICsgJyBhJztcblxuXHRcdC8vIHRvZG86IGNoZWNrIGlmIGFqYXggZGlzYWJsZWQuXG5cdFx0aWYgKCAkY29udGFpbmVyLmxlbmd0aCApIHtcblx0XHRcdCRjb250YWluZXIub24oICdjbGljaycsIHNlbGVjdG9yLCBmdW5jdGlvbiggZSApIHtcblx0XHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG5cdFx0XHRcdGNvbnN0IGxvY2F0aW9uID0gJCggdGhpcyApLmF0dHIoICdocmVmJyApO1xuXG5cdFx0XHRcdGhpc3RvcnkucHVzaFN0YXRlKCB7fSwgJycsIGxvY2F0aW9uICk7XG5cblx0XHRcdFx0ZmlsdGVyUHJvZHVjdHMoKTtcblx0XHRcdH0gKTtcblx0XHR9XG5cdH1cblxuXHQvLyBUaGUgZnVuY3Rpb24gdG8gaGFuZGxlIHRoZSBjb21tb24gZmlsdGVyIHJlcXVlc3RzLlxuXHRmdW5jdGlvbiBoYW5kbGVGaWx0ZXJSZXF1ZXN0KCAkaXRlbSwgZmlsdGVyVmFsdWUgKSB7XG5cdFx0Y29uc3QgJGZpZWxkICAgICAgICAgPSAkaXRlbS5jbG9zZXN0KCAnLndjYXBmLXNpbmdsZS1maWx0ZXInICk7XG5cdFx0Y29uc3QgZmllbGRJRCAgICAgICAgPSAkZmllbGQuYXR0ciggJ2RhdGEtaWQnICk7XG5cdFx0Y29uc3QgZmllbGREYXRhICAgICAgPSBmaWVsZHNbIGZpZWxkSUQgXTtcblx0XHRjb25zdCBmaWx0ZXJLZXkgICAgICA9IGZpZWxkRGF0YS5maWx0ZXJLZXk7XG5cdFx0Y29uc3QgbXVsdGlwbGVGaWx0ZXIgPSBmaWVsZERhdGEubXVsdGlwbGVGaWx0ZXI7XG5cblx0XHRpZiAoICEgZmlsdGVyS2V5ICkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdGlmICggISBmaWx0ZXJWYWx1ZS5sZW5ndGggKSB7XG5cdFx0XHRjb25zdCBxdWVyeSA9IHJlbW92ZVF1ZXJ5U3RyaW5nUGFyYW1ldGVyKCBmaWx0ZXJLZXkgKTtcblx0XHRcdGhpc3RvcnkucHVzaFN0YXRlKCB7fSwgJycsIHF1ZXJ5ICk7XG5cblx0XHRcdGZpbHRlclByb2R1Y3RzKCk7XG5cblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHRpZiAoIG11bHRpcGxlRmlsdGVyICkge1xuXHRcdFx0bWFrZVBhcmFtZXRlcnMoIGZpbHRlcktleSwgZmlsdGVyVmFsdWUgKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0c2luZ2xlRmlsdGVyKCBmaWx0ZXJLZXksIGZpbHRlclZhbHVlICk7XG5cdFx0fVxuXHR9XG5cblx0ZnVuY3Rpb24gcmVxdWVzdEZpbHRlciggdXJsICkge1xuXHRcdGlmICggISB1cmwgKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0Ly8gd2luZG93LmxvY2F0aW9uLmhyZWYgPSB1cmw7XG5cblx0XHQvLyBUT0RPOiBGaWx0ZXIgdGhlIHByb2R1Y3RzIGNvbmRpdGlvbmFsbHkuXG5cdFx0Ly8gZmlsdGVyUHJvZHVjdHMoKTtcblx0fVxuXG5cdC8vIEhhbmRsZSB0aGUgZmlsdGVyIHJlcXVlc3QgZm9yIGxpc3QgZmllbGQuXG5cdCR3Y2FwZk5hdkZpbHRlcnMub24oXG5cdFx0J2NoYW5nZScsXG5cdFx0Jy53Y2FwZi1sYXllcmVkLW5hdiBbdHlwZT1cImNoZWNrYm94XCJdLCAud2NhcGYtbGF5ZXJlZC1uYXYgW3R5cGU9XCJyYWRpb1wiXScsXG5cdFx0ZnVuY3Rpb24oIGV2ZW50ICkge1xuXHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcblxuXHRcdFx0Y29uc3QgJGl0ZW0gPSAkKCB0aGlzICk7XG5cblx0XHRcdHJlcXVlc3RGaWx0ZXIoICRpdGVtLmRhdGEoICd1cmwnICkgKTtcblx0XHR9XG5cdCk7XG5cblx0Ly8gSGFuZGxlIHRoZSBmaWx0ZXIgcmVxdWVzdCBmb3IgbGFiZWxlZCBpdGVtLlxuXHQkd2NhcGZOYXZGaWx0ZXJzLm9uKCAnY2xpY2snLCAnLndjYXBmLWxhYmVsZWQtbmF2IC5pdGVtOm5vdCguZGlzYWJsZWQpJywgZnVuY3Rpb24oIGV2ZW50ICkge1xuXHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cblx0XHRjb25zdCAkaXRlbSA9ICQoIHRoaXMgKTtcblxuXHRcdHJlcXVlc3RGaWx0ZXIoICRpdGVtLmRhdGEoICd1cmwnICkgKTtcblx0fSApO1xuXG5cdC8vIEhhbmRsZSB0aGUgZmlsdGVyIHJlcXVlc3QgZm9yIGRpc3BsYXkgdHlwZSBzZWxlY3QgZmllbGRzLlxuXHQkd2NhcGZOYXZGaWx0ZXJzLm9uKCAnY2hhbmdlJywgJ3NlbGVjdCcsIGZ1bmN0aW9uKCBldmVudCApIHtcblx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXG5cdFx0Y29uc3QgJHNlbGVjdCAgICAgICAgPSAkKCB0aGlzICk7XG5cdFx0Y29uc3QgdmFsdWVzICAgICAgICAgPSAkc2VsZWN0LnZhbCgpO1xuXHRcdGNvbnN0IGZpbHRlclVSTCAgICAgID0gJHNlbGVjdC5kYXRhKCAndXJsJyApO1xuXHRcdGNvbnN0IGNsZWFyRmlsdGVyVVJMID0gJHNlbGVjdC5kYXRhKCAnY2xlYXItZmlsdGVyLXVybCcgKTtcblx0XHRsZXQgdXJsO1xuXG5cdFx0aWYgKCB2YWx1ZXMubGVuZ3RoICkge1xuXHRcdFx0dXJsID0gZmlsdGVyVVJMLnJlcGxhY2UoICclcycsIHZhbHVlcy50b1N0cmluZygpICk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHVybCA9IGNsZWFyRmlsdGVyVVJMO1xuXHRcdH1cblxuXHRcdHJlcXVlc3RGaWx0ZXIoIHVybCApO1xuXHR9ICk7XG5cblx0LyoqXG5cdCAqIEhhbmRsZSB0aGUgZmlsdGVyIHJlcXVlc3QgZm9yIHJhbmdlIG51bWJlci5cblx0ICovXG5cdGNvbnN0IHJhbmdlTnVtYmVyU2VsZWN0b3JzID0gJy53Y2FwZi1yYW5nZS1udW1iZXIgLm1pbi12YWx1ZSwgLndjYXBmLXJhbmdlLW51bWJlciAubWF4LXZhbHVlJztcblxuXHQvLyBUT0RPOiBNYXliZSB1c2UgJ2NoYW5nZScgZXZlbnQuXG5cdCR3Y2FwZk51bWJlclJhbmdlRmlsdGVycy5vbiggJ2lucHV0JywgcmFuZ2VOdW1iZXJTZWxlY3RvcnMsIGZ1bmN0aW9uKCBldmVudCApIHtcblx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXG5cdFx0Y29uc3QgJGl0ZW0gPSAkKCB0aGlzICk7XG5cblx0XHRjb25zdCAkcmFuZ2VOdW1iZXIgICAgICA9ICRpdGVtLmNsb3Nlc3QoICcud2NhcGYtcmFuZ2UtbnVtYmVyJyApO1xuXHRcdGNvbnN0IGZvcm1hdE51bWJlcnMgICAgID0gJHJhbmdlTnVtYmVyLmF0dHIoICdkYXRhLWZvcm1hdC1udW1iZXJzJyApO1xuXHRcdGNvbnN0IHJhbmdlTWluVmFsdWUgICAgID0gcGFyc2VGbG9hdCggJHJhbmdlTnVtYmVyLmF0dHIoICdkYXRhLXJhbmdlLW1pbi12YWx1ZScgKSApO1xuXHRcdGNvbnN0IHJhbmdlTWF4VmFsdWUgICAgID0gcGFyc2VGbG9hdCggJHJhbmdlTnVtYmVyLmF0dHIoICdkYXRhLXJhbmdlLW1heC12YWx1ZScgKSApO1xuXHRcdGNvbnN0IGRlY2ltYWxQbGFjZXMgICAgID0gJHJhbmdlTnVtYmVyLmF0dHIoICdkYXRhLWRlY2ltYWwtcGxhY2VzJyApO1xuXHRcdGNvbnN0IHRob3VzYW5kU2VwYXJhdG9yID0gJHJhbmdlTnVtYmVyLmF0dHIoICdkYXRhLXRob3VzYW5kLXNlcGFyYXRvcicgKTtcblx0XHRjb25zdCBkZWNpbWFsU2VwYXJhdG9yICA9ICRyYW5nZU51bWJlci5hdHRyKCAnZGF0YS1kZWNpbWFsLXNlcGFyYXRvcicgKTtcblxuXHRcdC8vIENsZWFyIGFueSBwcmV2aW91c2x5IHNldCB0aW1lciBiZWZvcmUgc2V0dGluZyBhIGZyZXNoIG9uZVxuXHRcdGNsZWFyVGltZW91dCggJGl0ZW0uZGF0YSggJ3RpbWVyJyApICk7XG5cblx0XHRmdW5jdGlvbiBnZXRWYWx1ZSggZmxvYXRWYWx1ZSApIHtcblx0XHRcdGlmICggZm9ybWF0TnVtYmVycyApIHtcblx0XHRcdFx0cmV0dXJuIG51bWJlcl9mb3JtYXQoIGZsb2F0VmFsdWUsIGRlY2ltYWxQbGFjZXMsIGRlY2ltYWxTZXBhcmF0b3IsIHRob3VzYW5kU2VwYXJhdG9yICk7XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiBmbG9hdFZhbHVlO1xuXHRcdH1cblxuXHRcdCRpdGVtLmRhdGEoICd0aW1lcicsIHNldFRpbWVvdXQoIGZ1bmN0aW9uKCkge1xuXHRcdFx0JGl0ZW0ucmVtb3ZlRGF0YSggJ3RpbWVyJyApO1xuXG5cdFx0XHRsZXQgbWluVmFsdWUgPSBwYXJzZUZsb2F0KCAkcmFuZ2VOdW1iZXIuZmluZCggJy5taW4tdmFsdWUnICkudmFsKCkgKTtcblx0XHRcdGxldCBtYXhWYWx1ZSA9IHBhcnNlRmxvYXQoICRyYW5nZU51bWJlci5maW5kKCAnLm1heC12YWx1ZScgKS52YWwoKSApO1xuXG5cdFx0XHQvLyBGb3JjZSB0aGUgbWluVmFsdWUgbm90IHRvIGJlIGVtcHR5LlxuXHRcdFx0aWYgKCBpc05hTiggbWluVmFsdWUgKSApIHtcblx0XHRcdFx0bWluVmFsdWUgPSByYW5nZU1pblZhbHVlO1xuXG5cdFx0XHRcdCRyYW5nZU51bWJlci5maW5kKCAnLm1pbi12YWx1ZScgKS52YWwoIGdldFZhbHVlKCBtaW5WYWx1ZSApICk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHQkcmFuZ2VOdW1iZXIuZmluZCggJy5taW4tdmFsdWUnICkudmFsKCBnZXRWYWx1ZSggbWluVmFsdWUgKSApO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBGb3JjZSB0aGUgbWF4VmFsdWUgbm90IHRvIGJlIGVtcHR5LlxuXHRcdFx0aWYgKCBpc05hTiggbWF4VmFsdWUgKSApIHtcblx0XHRcdFx0bWF4VmFsdWUgPSByYW5nZU1heFZhbHVlO1xuXG5cdFx0XHRcdCRyYW5nZU51bWJlci5maW5kKCAnLm1heC12YWx1ZScgKS52YWwoIGdldFZhbHVlKCBtYXhWYWx1ZSApICk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHQkcmFuZ2VOdW1iZXIuZmluZCggJy5tYXgtdmFsdWUnICkudmFsKCBnZXRWYWx1ZSggbWF4VmFsdWUgKSApO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBGb3JjZSB0aGUgbWluVmFsdWUgbm90IHRvIGdvIGJlbG93IHRoZSByYW5nZU1pblZhbHVlLlxuXHRcdFx0aWYgKCBtaW5WYWx1ZSA8IHJhbmdlTWluVmFsdWUgKSB7XG5cdFx0XHRcdG1pblZhbHVlID0gcmFuZ2VNaW5WYWx1ZTtcblxuXHRcdFx0XHQkcmFuZ2VOdW1iZXIuZmluZCggJy5taW4tdmFsdWUnICkudmFsKCBnZXRWYWx1ZSggbWluVmFsdWUgKSApO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBGb3JjZSB0aGUgbWluVmFsdWUgbm90IHRvIGdvIHVwIHRoZSByYW5nZU1heFZhbHVlLlxuXHRcdFx0aWYgKCBtaW5WYWx1ZSA+IHJhbmdlTWF4VmFsdWUgKSB7XG5cdFx0XHRcdG1pblZhbHVlID0gcmFuZ2VNYXhWYWx1ZTtcblxuXHRcdFx0XHQkcmFuZ2VOdW1iZXIuZmluZCggJy5taW4tdmFsdWUnICkudmFsKCBnZXRWYWx1ZSggbWluVmFsdWUgKSApO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBGb3JjZSB0aGUgbWF4VmFsdWUgbm90IHRvIGdvIHVwIHRoZSByYW5nZU1heFZhbHVlLlxuXHRcdFx0aWYgKCBtYXhWYWx1ZSA+IHJhbmdlTWF4VmFsdWUgKSB7XG5cdFx0XHRcdG1heFZhbHVlID0gcmFuZ2VNYXhWYWx1ZTtcblxuXHRcdFx0XHQkcmFuZ2VOdW1iZXIuZmluZCggJy5tYXgtdmFsdWUnICkudmFsKCBnZXRWYWx1ZSggbWF4VmFsdWUgKSApO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBGb3JjZSB0aGUgbWF4VmFsdWUgbm90IHRvIGdvIGJlbG93IHRoZSBtaW5WYWx1ZS5cblx0XHRcdGlmICggbWluVmFsdWUgPiBtYXhWYWx1ZSApIHtcblx0XHRcdFx0bWF4VmFsdWUgPSBtaW5WYWx1ZTtcblxuXHRcdFx0XHQkcmFuZ2VOdW1iZXIuZmluZCggJy5tYXgtdmFsdWUnICkudmFsKCBnZXRWYWx1ZSggbWF4VmFsdWUgKSApO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAoIG1pblZhbHVlID09PSByYW5nZU1pblZhbHVlICYmIG1heFZhbHVlID09PSByYW5nZU1heFZhbHVlICkge1xuXHRcdFx0XHQvLyBSZW1vdmUgcmFuZ2UgZmlsdGVyLlxuXHRcdFx0XHRyZXF1ZXN0RmlsdGVyKCAkcmFuZ2VOdW1iZXIuZGF0YSggJ2NsZWFyLWZpbHRlci11cmwnICkgKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdC8vIEFkZCByYW5nZSBmaWx0ZXIuXG5cdFx0XHRcdGNvbnN0IHVybCA9ICRyYW5nZU51bWJlci5kYXRhKCAndXJsJyApLnJlcGxhY2UoICclMXMnLCBtaW5WYWx1ZSApLnJlcGxhY2UoICclMnMnLCBtYXhWYWx1ZSApO1xuXHRcdFx0XHRyZXF1ZXN0RmlsdGVyKCB1cmwgKTtcblx0XHRcdH1cblx0XHR9LCBkZWxheSApICk7XG5cdH0gKTtcblxuXHQvLyBIYW5kbGUgcmVtb3ZpbmcgdGhlIGFjdGl2ZSBmaWx0ZXJzLlxuXHQkd2NhcGZOYXZGaWx0ZXJzLm9uKCAnY2xpY2snLCAnLndjYXBmLWFjdGl2ZS1maWx0ZXJzIC5pdGVtOm5vdCguZGlzYWJsZWQpJywgZnVuY3Rpb24oIGV2ZW50ICkge1xuXHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cblx0XHRjb25zdCAkaXRlbSAgICAgICA9ICQoIHRoaXMgKTtcblx0XHRjb25zdCBmaWx0ZXJLZXkgICA9ICRpdGVtLmF0dHIoICdkYXRhLWZpbHRlci1rZXknICk7XG5cdFx0Y29uc3QgZmlsdGVyVmFsdWUgPSAkaXRlbS5hdHRyKCAnZGF0YS12YWx1ZScgKTtcblxuXHRcdG1ha2VQYXJhbWV0ZXJzKCBmaWx0ZXJLZXksIGZpbHRlclZhbHVlLCB0cnVlICk7XG5cdH0gKTtcblxuXHRmdW5jdGlvbiByZXNldEZpbHRlcnMoICRidXR0b24gKSB7XG5cdFx0Y29uc3QgX2ZpbHRlcktleXMgPSAkYnV0dG9uLmF0dHIoICdkYXRhLWtleXMnICk7XG5cblx0XHRpZiAoICEgX2ZpbHRlcktleXMgKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0Y29uc3QgZmlsdGVyS2V5cyA9IF9maWx0ZXJLZXlzLnNwbGl0KCAnLCcgKTtcblxuXHRcdGxldCBxdWVyeSA9ICcnO1xuXG5cdFx0JC5lYWNoKCBmaWx0ZXJLZXlzLCBmdW5jdGlvbiggaSwgZmlsdGVyS2V5ICkge1xuXHRcdFx0aWYgKCBxdWVyeSApIHtcblx0XHRcdFx0cXVlcnkgPSByZW1vdmVRdWVyeVN0cmluZ1BhcmFtZXRlciggZmlsdGVyS2V5LCBxdWVyeSApO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0cXVlcnkgPSByZW1vdmVRdWVyeVN0cmluZ1BhcmFtZXRlciggZmlsdGVyS2V5ICk7XG5cdFx0XHR9XG5cdFx0fSApO1xuXG5cdFx0Ly8gRW1wdHkgcXVlcnkgY2F1c2VzIGlzc3VlKGRvZXNuJ3QgcmVtb3ZlIHRoZSBmaWx0ZXIga2V5cyBmcm9tIHRoZSB1cmwpLFxuXHRcdC8vIHRoaXMgaXMgd2h5IHdlIGFyZSBzZXR0aW5nIHRoZSBwYWdlIHVybCBhcyBxdWVyeS5cblx0XHRpZiAoICEgcXVlcnkgKSB7XG5cdFx0XHRjb25zdCBwcmV2VXJsID0gd2luZG93LmxvY2F0aW9uLmhyZWY7XG5cdFx0XHRjb25zdCBuZXdVcmwgID0gcHJldlVybC5zcGxpdCggJz8nICk7XG5cblx0XHRcdHF1ZXJ5ID0gbmV3VXJsWyAwIF07XG5cdFx0fVxuXG5cdFx0aGlzdG9yeS5wdXNoU3RhdGUoIHt9LCAnJywgcXVlcnkgKTtcblxuXHRcdGZpbHRlclByb2R1Y3RzKCB0cnVlICk7XG5cdH1cblxuXHQvLyBDbGVhci9SZXNldCBhbGwgZmlsdGVycy5cblx0JGJvZHkub24oICd3Y2FwZi1yZXNldC1maWx0ZXJzJywgZnVuY3Rpb24oIGUsICRidXR0b24gKSB7XG5cdFx0cmVzZXRGaWx0ZXJzKCAkYnV0dG9uICk7XG5cdH0gKTtcblxuXHQkYm9keS5vbiggJ2NsaWNrJywgJy53Y2FwZi1yZXNldC1maWx0ZXJzLWJ0bicsIGZ1bmN0aW9uKCkge1xuXHRcdGNvbnN0ICRidXR0b24gPSAkKCB0aGlzICk7XG5cblx0XHRyZXNldEZpbHRlcnMoICRidXR0b24gKTtcblx0fSApO1xuXG5cdCR3Y2FwZk5hdkZpbHRlcnMub24oICdjbGljaycsICcud2NhcGYtcmVzZXQtZmlsdGVycy1idG4nLCBmdW5jdGlvbiggZXZlbnQgKSB7XG5cdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcblxuXHRcdGNvbnN0ICRidXR0b24gPSAkKCB0aGlzICk7XG5cblx0XHQkYm9keS50cmlnZ2VyKCAnd2NhcGYtcmVzZXQtZmlsdGVycycsIFsgJGJ1dHRvbiBdICk7XG5cdH0gKTtcblxuXHQkd2NhcGZTaW5nbGVGaWx0ZXJzLm9uKCAnd2NhcGYtY2xlYXItZmlsdGVyJywgZnVuY3Rpb24oKSB7XG5cdFx0Y29uc3QgJGZpZWxkICAgID0gJCggdGhpcyApO1xuXHRcdGNvbnN0IGZpZWxkSUQgICA9ICRmaWVsZC5hdHRyKCAnZGF0YS1pZCcgKTtcblx0XHRjb25zdCBmaWVsZERhdGEgPSBmaWVsZHNbIGZpZWxkSUQgXTtcblx0XHRjb25zdCBmaWx0ZXJLZXkgPSBmaWVsZERhdGEuZmlsdGVyS2V5O1xuXG5cdFx0Y29uc3QgcXVlcnkgPSByZW1vdmVRdWVyeVN0cmluZ1BhcmFtZXRlciggZmlsdGVyS2V5ICk7XG5cdFx0aGlzdG9yeS5wdXNoU3RhdGUoIHt9LCAnJywgcXVlcnkgKTtcblxuXHRcdGZpbHRlclByb2R1Y3RzKCB0cnVlICk7XG5cdH0gKTtcblxuXHQvLyBSdW4gYWpheCBmaWx0ZXIgd2hlbiBicm93c2VyIGhpc3RvcnkgY2hhbmdlcyAodXNlciBnb2VzIGJhY2sgb3IgZm9yd2FyZCkuXG5cdGlmICggJCggd2NhcGZfcGFyYW1zLnNob3BfbG9vcF9jb250YWluZXIgKS5sZW5ndGggfHwgJCggd2NhcGZfcGFyYW1zLm5vdF9mb3VuZF9jb250YWluZXIgKS5sZW5ndGggKSB7XG5cdFx0aWYgKCB3Y2FwZl9wYXJhbXMuYXBwbHlfZmlsdGVyc19vbl9icm93c2VyX2hpc3RvcnlfY2hhbmdlICkge1xuXHRcdFx0JCggd2luZG93ICkuYmluZCggJ3BvcHN0YXRlJywgZnVuY3Rpb24oKSB7XG5cdFx0XHRcdGZpbHRlclByb2R1Y3RzKCB0cnVlICk7XG5cdFx0XHR9ICk7XG5cdFx0fVxuXHR9XG5cblx0Ly8gVGhlIGhvb2sgdGhhdCBtYW51YWxseSBydW4gdGhlIGFqYXggZmlsdGVycyAoY2FuIGJlIHVzZWZ1bCBmb3Igb3RoZXIgcGx1Z2lucykuXG5cdCRib2R5Lm9uKCAnd2NhcGYtcnVuLWZpbHRlci1wcm9kdWN0cycsIGZ1bmN0aW9uKCBlLCBmb3JjZVJlUmVuZGVyICkge1xuXHRcdGZpbHRlclByb2R1Y3RzKCBmb3JjZVJlUmVuZGVyICk7XG5cdH0gKTtcblxuXHQvLyBUaGUgaG9vayB0aGF0IHJlaW5pdGlhbGl6ZSB0aGUgZmlsdGVyIHdpZGdldHMgKHRvIHNob3cgdGhlIHByZXZpZXcgaW4gdGhlIGJhY2tlbmQpLlxuXHQkYm9keS5vbiggJ2luaXRfZmlsdGVyX3dpZGdldHMnLCBmdW5jdGlvbigpIHtcblx0XHRpbml0Q2hvc2VuKCk7XG5cdFx0aW5pdEhpZXJhcmNoeUFjY29yZGlvbigpO1xuXHRcdGluaXROb1VJU2xpZGVyKCk7XG5cdFx0aW5pdERhdGVwaWNrZXIoKTtcblx0fSApO1xuXG5cdC8qKlxuXHQgKiBNYWtlIGl0IGNvbXBhdGlibGUgd2l0aCBvdGhlciBwbHVnaW5zLlxuXHQgKi9cblx0JGJvZHkub24oICd3Y2FwZl9hZnRlcl91cGRhdGluZ19wcm9kdWN0cycsIGZ1bmN0aW9uKCkge1xuXHRcdC8vIHdvby12YXJpYXRpb24tc3dhdGNoZXNcblx0XHQkKCBkb2N1bWVudCApLnRyaWdnZXIoICd3b29fdmFyaWF0aW9uX3N3YXRjaGVzX3Byb19pbml0JyApO1xuXHR9ICk7XG59ICk7XG4iXX0=
