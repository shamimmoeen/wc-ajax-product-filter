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
      var options = {};
      var noResultsMessage = $this.attr('data-no-results-message');

      if (noResultsMessage) {
        options['no_results_text'] = noResultsMessage;
      }

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

    $root.find('.hierarchy-accordion-toggle').on('click', function () {
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImZpbHRlci1mb3JtLmpzIl0sIm5hbWVzIjpbIndjYXBmX3BhcmFtcyIsImpRdWVyeSIsImRvY3VtZW50IiwicmVhZHkiLCIkIiwiJGJvZHkiLCJyYW5nZVZhbHVlc1NlcGFyYXRvciIsIl9kZWxheSIsInBhcnNlSW50IiwiZmlsdGVyX2lucHV0X2RlbGF5IiwiZGVsYXkiLCJmaWVsZHMiLCJ3Y2FwZlNpbmdsZUZpbHRlclNlbGVjdG9yIiwid2NhcGZOYXZGaWx0ZXJTZWxlY3RvciIsIndjYXBmTnVtYmVyUmFuZ2VGaWx0ZXJTZWxlY3RvciIsIndjYXBmRGF0ZUZpbHRlclNlbGVjdG9yIiwiJHdjYXBmU2luZ2xlRmlsdGVycyIsIiR3Y2FwZk5hdkZpbHRlcnMiLCIkd2NhcGZOdW1iZXJSYW5nZUZpbHRlcnMiLCIkd2NhcGZEYXRlRmlsdGVycyIsImVhY2giLCIkZmllbGQiLCJpZCIsImF0dHIiLCIkd3JhcHBlciIsImZpbmQiLCJmaWx0ZXJLZXkiLCJtdWx0aXBsZUZpbHRlciIsImluaXRDaG9zZW4iLCJjaG9zZW4iLCIkcm9vdCIsImZvcl9wcmV2aWV3IiwiJHRoaXMiLCJvcHRpb25zIiwibm9SZXN1bHRzTWVzc2FnZSIsInNlYXJjaFRocmVzaG9sZCIsImNob3Nlbl9saWJfc2VhcmNoX3RocmVzaG9sZCIsImluaXRIaWVyYXJjaHlBY2NvcmRpb24iLCJvbiIsIiRjaGlsZCIsInBhcmVudCIsImNoaWxkcmVuIiwidG9nZ2xlQ2xhc3MiLCJlbmFibGVfYW5pbWF0aW9uX2Zvcl9oaWVyYXJjaHlfYWNjb3JkaW9uIiwic2xpZGVUb2dnbGUiLCJoaWVyYXJjaHlfYWNjb3JkaW9uX2FuaW1hdGlvbl9zcGVlZCIsImhpZXJhcmNoeV9hY2NvcmRpb25fYW5pbWF0aW9uX2Vhc2luZyIsInRvZ2dsZSIsIm51bWJlcl9mb3JtYXQiLCJudW1iZXIiLCJkZWNpbWFscyIsImRlY19wb2ludCIsInRob3VzYW5kc19zZXAiLCJyZXBsYWNlIiwibiIsImlzRmluaXRlIiwicHJlYyIsIk1hdGgiLCJhYnMiLCJzZXAiLCJkZWMiLCJzIiwidG9GaXhlZEZpeCIsImsiLCJwb3ciLCJyb3VuZCIsInNwbGl0IiwibGVuZ3RoIiwiQXJyYXkiLCJqb2luIiwiaW5pdE5vVUlTbGlkZXIiLCJub1VpU2xpZGVyIiwiJGl0ZW0iLCIkc2xpZGVyIiwiaGFzQ2xhc3MiLCJzbGlkZXJJZCIsImRpc3BsYXlWYWx1ZXNBcyIsImZvcm1hdE51bWJlcnMiLCJyYW5nZU1pblZhbHVlIiwicGFyc2VGbG9hdCIsInJhbmdlTWF4VmFsdWUiLCJzdGVwIiwiZGVjaW1hbFBsYWNlcyIsInRob3VzYW5kU2VwYXJhdG9yIiwiZGVjaW1hbFNlcGFyYXRvciIsIm1pblZhbHVlIiwibWF4VmFsdWUiLCIkbWluVmFsdWUiLCIkbWF4VmFsdWUiLCJzbGlkZXIiLCJnZXRFbGVtZW50QnlJZCIsImNyZWF0ZSIsInN0YXJ0IiwiY29ubmVjdCIsImNzc1ByZWZpeCIsInJhbmdlIiwidmFsdWVzIiwiaHRtbCIsInZhbCIsInRyaWdnZXIiLCJmaWx0ZXJQcm9kdWN0c0FjY29yZGluZ1RvU2xpZGVyIiwicmVxdWVzdEZpbHRlciIsImRhdGEiLCJ1cmwiLCJjbGVhclRpbWVvdXQiLCJzZXRUaW1lb3V0IiwicmVtb3ZlRGF0YSIsImV2ZW50IiwicHJldmVudERlZmF1bHQiLCIkaW5wdXQiLCJzZXQiLCJnZXQiLCJmaWx0ZXJCeURhdGUiLCIkd2NhcGZEYXRlRmlsdGVyIiwiY2xvc2VzdCIsImlzUmFuZ2UiLCJmaWx0ZXJWYWx1ZSIsInJ1bkZpbHRlciIsImZyb20iLCJ0byIsInVwZGF0ZVF1ZXJ5U3RyaW5nUGFyYW1ldGVyIiwicXVlcnkiLCJyZW1vdmVRdWVyeVN0cmluZ1BhcmFtZXRlciIsImhpc3RvcnkiLCJwdXNoU3RhdGUiLCJmaWx0ZXJQcm9kdWN0cyIsImluaXREYXRlcGlja2VyIiwiZGF0ZXBpY2tlciIsImZvcm1hdCIsInllYXJEcm9wZG93biIsIm1vbnRoRHJvcGRvd24iLCIkZnJvbSIsIiR0byIsImRhdGVGb3JtYXQiLCJjaGFuZ2VZZWFyIiwiY2hhbmdlTW9udGgiLCJpbml0RGVmYXVsdE9yZGVyQnkiLCJhdHRhY2hfY2hvc2VuX29uX3NvcnRpbmciLCJzb3J0aW5nX2NvbnRyb2wiLCIkb3JkZXJpbmdGb3JtIiwic3VibWl0IiwiZSIsIm9yZGVyIiwiZmlsdGVyX2tleSIsInVwZGF0ZVByb2R1Y3RzQ291bnRSZXN1bHQiLCIkcmVzdWx0cyIsInNlbGVjdG9yIiwic2hvcF9sb29wX2NvbnRhaW5lciIsIm5ld1Byb2R1Y3RDb3VudCIsInNob3dMb2FkaW5nQW5pbWF0aW9uIiwibG9hZGluZ19hbmltYXRpb24iLCJMb2FkaW5nT3ZlcmxheSIsImxvYWRpbmdfb3ZlcmxheV9vcHRpb25zIiwiZGlzYWJsZU5vVWlTbGlkZXJzIiwiZWxlbWVudCIsInNldEF0dHJpYnV0ZSIsImRpc2FibGVMYWJlbHMiLCJzZWxlY3RvcnMiLCJhZGRDbGFzcyIsImRpc2FibGVJbnB1dHMiLCJkaXNhYmxlX2lucHV0c193aGlsZV9mZXRjaGluZ19yZXN1bHRzIiwiaW5wdXRzIiwiZW5hYmxlTm9VaVNsaWRlcnMiLCJyZW1vdmVBdHRyaWJ1dGUiLCJlbmFibGVJbnB1dHMiLCJyZW1vdmVBdHRyIiwicmVzZXRMb2FkaW5nQW5pbWF0aW9uIiwic2Nyb2xsVG8iLCJzY3JvbGxfd2luZG93Iiwic2Nyb2xsRm9yIiwic2Nyb2xsX3dpbmRvd19mb3IiLCJpc01vYmlsZSIsImlzX21vYmlsZSIsInByb2NlZWQiLCJhZGp1c3RpbmdPZmZzZXQiLCJvZmZzZXQiLCJzY3JvbGxfdG9fdG9wX29mZnNldCIsImNvbnRhaW5lciIsIm5vdF9mb3VuZF9jb250YWluZXIiLCJzY3JvbGxfd2luZG93X2N1c3RvbV9lbGVtZW50IiwiJGNvbnRhaW5lciIsInRvcCIsInN0b3AiLCJhbmltYXRlIiwic2Nyb2xsVG9wIiwic2Nyb2xsX3RvX3RvcF9zcGVlZCIsInNjcm9sbF90b190b3BfZWFzaW5nIiwiYmVmb3JlRmV0Y2hpbmdQcm9kdWN0cyIsInNjcm9sbF93aW5kb3dfd2hlbiIsImJlZm9yZVVwZGF0aW5nUHJvZHVjdHMiLCJhZnRlclVwZGF0aW5nUHJvZHVjdHMiLCJmb3JjZVJlUmVuZGVyIiwid2luZG93IiwibG9jYXRpb24iLCJocmVmIiwiJGRhdGEiLCJmaWVsZElEIiwiJGlubmVyIiwiX2ZpZWxkIiwiZmllbGRDbGFzc2VzIiwicHJlc2VydmVfaGllcmFyY2h5X2FjY29yZGlvbl9zdGF0ZSIsIml0ZW1WYWx1ZSIsInRvZ2dsZVNlbGVjdG9yIiwidWxTZWxlY3RvciIsIl9jbGFzc2VzIiwic2hvdyIsIl9odG1sIiwic29mdExpbWl0U2VsZWN0b3IiLCJ0cmltIiwiJHNob3BMb29wQ29udGFpbmVyIiwiJG5vdEZvdW5kQ29udGFpbmVyIiwiZ2V0VXJsVmFycyIsInZhcnMiLCJoYXNoIiwicmVwbGFjZUFsbCIsImhhc2hlcyIsInNsaWNlIiwiaW5kZXhPZiIsImhMZW5ndGgiLCJpIiwiZml4UGFnaW5hdGlvbiIsInBhcmFtcyIsImN1cnJlbnRQYWdlSW5VcmwiLCJjdXJyZW50UGFnZUluUGFyYW1zIiwia2V5IiwidmFsdWUiLCJwdXNoSGlzdG9yeSIsInJlIiwiUmVnRXhwIiwic2VwYXJhdG9yIiwidXJsV2l0aFF1ZXJ5IiwibWF0Y2giLCJvbGRQYXJhbXMiLCJvbGRQYXJhbXNMZW5ndGgiLCJPYmplY3QiLCJrZXlzIiwic3RhcnRQb3NpdGlvbiIsImZpbHRlcktleVBvc2l0aW9uIiwiY2xlYW5VcmwiLCJjbGVhblF1ZXJ5IiwibmV3UGFyYW1zIiwibWFrZVBhcmFtZXRlcnMiLCJmb3JjZVJlcmVuZGVyIiwidmFsdWVTZXBhcmF0b3IiLCJuZXh0VmFsdWVzIiwiZW1wdHlWYWx1ZSIsInByZXZWYWx1ZXMiLCJwcmV2VmFsdWVzQXJyYXkiLCJmb3VuZCIsImluQXJyYXkiLCJzcGxpY2UiLCJwdXNoIiwic2luZ2xlRmlsdGVyIiwiZW5hYmxlX3BhZ2luYXRpb25fdmlhX2FqYXgiLCJwYWdpbmF0aW9uX2NvbnRhaW5lciIsImhhbmRsZUZpbHRlclJlcXVlc3QiLCJmaWVsZERhdGEiLCIkc2VsZWN0IiwiZmlsdGVyVVJMIiwiY2xlYXJGaWx0ZXJVUkwiLCJ0b1N0cmluZyIsInJhbmdlTnVtYmVyU2VsZWN0b3JzIiwiJHJhbmdlTnVtYmVyIiwiZ2V0VmFsdWUiLCJmbG9hdFZhbHVlIiwiaXNOYU4iLCJyZXNldEZpbHRlcnMiLCIkYnV0dG9uIiwiX2ZpbHRlcktleXMiLCJmaWx0ZXJLZXlzIiwicHJldlVybCIsIm5ld1VybCIsImFwcGx5X2ZpbHRlcnNfb25fYnJvd3Nlcl9oaXN0b3J5X2NoYW5nZSIsImJpbmQiXSwibWFwcGluZ3MiOiI7O0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBLElBQU1BLFlBQVksR0FBR0EsWUFBWSxJQUFJO0FBQ3BDLHdCQUFzQixFQURjO0FBRXBDLGlDQUErQixFQUZLO0FBR3BDLHdDQUFzQyxFQUhGO0FBSXBDLDhDQUE0QyxFQUpSO0FBS3BDLHlDQUF1QyxFQUxIO0FBTXBDLDBDQUF3QyxFQU5KO0FBT3BDLDZCQUEyQixFQVBTO0FBUXBDLHlCQUF1QixFQVJhO0FBU3BDLDBCQUF3QixFQVRZO0FBVXBDLGVBQWEsRUFWdUI7QUFXcEMsMkNBQXlDLEVBWEw7QUFZcEMsNkNBQTJDLEVBWlA7QUFhcEMseUJBQXVCLEVBYmE7QUFjcEMseUJBQXVCLEVBZGE7QUFlcEMsZ0NBQThCLEVBZk07QUFnQnBDLDBCQUF3QixFQWhCWTtBQWlCcEMscUJBQW1CLEVBakJpQjtBQWtCcEMsOEJBQTRCLEVBbEJRO0FBbUJwQyx1QkFBcUIsRUFuQmU7QUFvQnBDLG1CQUFpQixFQXBCbUI7QUFxQnBDLHVCQUFxQixFQXJCZTtBQXNCcEMsd0JBQXNCLEVBdEJjO0FBdUJwQyxrQ0FBZ0MsRUF2Qkk7QUF3QnBDLDBCQUF3QixFQXhCWTtBQXlCcEMsaUJBQWU7QUF6QnFCLENBQXJDO0FBNEJBQyxNQUFNLENBQUVDLFFBQUYsQ0FBTixDQUFtQkMsS0FBbkIsQ0FBMEIsVUFBVUMsQ0FBVixFQUFjO0FBRXZDLE1BQU1DLEtBQUssR0FBR0QsQ0FBQyxDQUFFLE1BQUYsQ0FBZjtBQUVBLE1BQU1FLG9CQUFvQixHQUFHLEdBQTdCOztBQUVBLE1BQU1DLE1BQU0sR0FBR0MsUUFBUSxDQUFFUixZQUFZLENBQUNTLGtCQUFmLENBQXZCOztBQUNBLE1BQU1DLEtBQUssR0FBSUgsTUFBTSxJQUFJLENBQVYsR0FBY0EsTUFBZCxHQUF1QixHQUF0QyxDQVB1QyxDQVN2Qzs7QUFDQSxNQUFNSSxNQUFNLEdBQUcsRUFBZjtBQUVBLE1BQU1DLHlCQUF5QixHQUFRLHNCQUF2QztBQUNBLE1BQU1DLHNCQUFzQixHQUFXLG1CQUF2QztBQUNBLE1BQU1DLDhCQUE4QixHQUFHLDRCQUF2QztBQUNBLE1BQU1DLHVCQUF1QixHQUFVLDBCQUF2QztBQUVBLE1BQU1DLG1CQUFtQixHQUFRWixDQUFDLENBQUVRLHlCQUFGLENBQWxDO0FBQ0EsTUFBTUssZ0JBQWdCLEdBQVdiLENBQUMsQ0FBRVMsc0JBQUYsQ0FBbEM7QUFDQSxNQUFNSyx3QkFBd0IsR0FBR2QsQ0FBQyxDQUFFVSw4QkFBRixDQUFsQztBQUNBLE1BQU1LLGlCQUFpQixHQUFVZixDQUFDLENBQUVXLHVCQUFGLENBQWxDO0FBRUFDLEVBQUFBLG1CQUFtQixDQUFDSSxJQUFwQixDQUEwQixZQUFXO0FBQ3BDLFFBQU1DLE1BQU0sR0FBV2pCLENBQUMsQ0FBRSxJQUFGLENBQXhCO0FBQ0EsUUFBTWtCLEVBQUUsR0FBZUQsTUFBTSxDQUFDRSxJQUFQLENBQWEsU0FBYixDQUF2QjtBQUNBLFFBQU1DLFFBQVEsR0FBU0gsTUFBTSxDQUFDSSxJQUFQLENBQWEsMEJBQWIsQ0FBdkI7QUFDQSxRQUFNQyxTQUFTLEdBQVFGLFFBQVEsQ0FBQ0QsSUFBVCxDQUFlLGlCQUFmLENBQXZCO0FBQ0EsUUFBTUksY0FBYyxHQUFHbkIsUUFBUSxDQUFFZ0IsUUFBUSxDQUFDRCxJQUFULENBQWUsc0JBQWYsQ0FBRixDQUEvQjtBQUVBWixJQUFBQSxNQUFNLENBQUVXLEVBQUYsQ0FBTixHQUFlO0FBQ2RJLE1BQUFBLFNBQVMsRUFBRUEsU0FERztBQUVkQyxNQUFBQSxjQUFjLEVBQUVBO0FBRkYsS0FBZjtBQUlBLEdBWEQsRUF0QnVDLENBbUN2Qzs7QUFDQSxXQUFTQyxVQUFULEdBQXNCO0FBQ3JCLFFBQUssQ0FBRTNCLE1BQU0sR0FBRzRCLE1BQWhCLEVBQXlCO0FBQ3hCO0FBQ0E7O0FBRUQsUUFBSUMsS0FBSjs7QUFFQSxRQUFLOUIsWUFBWSxDQUFDK0IsV0FBbEIsRUFBZ0M7QUFDL0JELE1BQUFBLEtBQUssR0FBRzFCLENBQUMsQ0FBRVMsc0JBQUYsQ0FBVDtBQUNBLEtBRkQsTUFFTztBQUNOaUIsTUFBQUEsS0FBSyxHQUFHYixnQkFBUjtBQUNBOztBQUVEYSxJQUFBQSxLQUFLLENBQUNMLElBQU4sQ0FBWSxzQkFBWixFQUFxQ0wsSUFBckMsQ0FBMkMsWUFBVztBQUNyRCxVQUFNWSxLQUFLLEdBQUs1QixDQUFDLENBQUUsSUFBRixDQUFqQjtBQUNBLFVBQU02QixPQUFPLEdBQUcsRUFBaEI7QUFFQSxVQUFNQyxnQkFBZ0IsR0FBR0YsS0FBSyxDQUFDVCxJQUFOLENBQVkseUJBQVosQ0FBekI7O0FBRUEsVUFBS1csZ0JBQUwsRUFBd0I7QUFDdkJELFFBQUFBLE9BQU8sQ0FBRSxpQkFBRixDQUFQLEdBQStCQyxnQkFBL0I7QUFDQTs7QUFFRCxVQUFNQyxlQUFlLEdBQUczQixRQUFRLENBQUVSLFlBQVksQ0FBQ29DLDJCQUFmLENBQWhDOztBQUVBLFVBQUtELGVBQUwsRUFBdUIsQ0FDdEI7QUFDQSxPQWRvRCxDQWdCckQ7QUFFQTtBQUVBOzs7QUFFQUgsTUFBQUEsS0FBSyxDQUFDSCxNQUFOLENBQWNJLE9BQWQ7QUFDQSxLQXZCRDtBQXdCQTs7QUFFREwsRUFBQUEsVUFBVSxHQTNFNkIsQ0E2RXZDOztBQUNBLFdBQVNTLHNCQUFULEdBQWtDO0FBQ2pDLFFBQUlQLEtBQUo7O0FBRUEsUUFBSzlCLFlBQVksQ0FBQytCLFdBQWxCLEVBQWdDO0FBQy9CRCxNQUFBQSxLQUFLLEdBQUcxQixDQUFDLENBQUVTLHNCQUFGLENBQVQ7QUFDQSxLQUZELE1BRU87QUFDTmlCLE1BQUFBLEtBQUssR0FBR2IsZ0JBQVI7QUFDQTs7QUFFRGEsSUFBQUEsS0FBSyxDQUFDTCxJQUFOLENBQVksNkJBQVosRUFBNENhLEVBQTVDLENBQWdELE9BQWhELEVBQXlELFlBQVc7QUFDbkUsVUFBTU4sS0FBSyxHQUFJNUIsQ0FBQyxDQUFFLElBQUYsQ0FBaEI7QUFDQSxVQUFNbUMsTUFBTSxHQUFHUCxLQUFLLENBQUNRLE1BQU4sQ0FBYyxJQUFkLEVBQXFCQyxRQUFyQixDQUErQixJQUEvQixDQUFmO0FBRUFULE1BQUFBLEtBQUssQ0FBQ1UsV0FBTixDQUFtQixRQUFuQjs7QUFFQSxVQUFLMUMsWUFBWSxDQUFDMkMsd0NBQWxCLEVBQTZEO0FBQzVESixRQUFBQSxNQUFNLENBQUNLLFdBQVAsQ0FDQzVDLFlBQVksQ0FBQzZDLG1DQURkLEVBRUM3QyxZQUFZLENBQUM4QyxvQ0FGZDtBQUlBLE9BTEQsTUFLTztBQUNOUCxRQUFBQSxNQUFNLENBQUNRLE1BQVA7QUFDQTtBQUNELEtBZEQ7QUFlQTs7QUFFRFYsRUFBQUEsc0JBQXNCO0FBRXRCO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUNDLFdBQVNXLGFBQVQsQ0FBd0JDLE1BQXhCLEVBQWdDQyxRQUFoQyxFQUEwQ0MsU0FBMUMsRUFBcURDLGFBQXJELEVBQXFFO0FBQ3BFO0FBQ0FILElBQUFBLE1BQU0sR0FBRyxDQUFFQSxNQUFNLEdBQUcsRUFBWCxFQUFnQkksT0FBaEIsQ0FBeUIsY0FBekIsRUFBeUMsRUFBekMsQ0FBVDtBQUVBLFFBQU1DLENBQUMsR0FBTSxDQUFFQyxRQUFRLENBQUUsQ0FBQ04sTUFBSCxDQUFWLEdBQXdCLENBQXhCLEdBQTRCLENBQUNBLE1BQTFDO0FBQ0EsUUFBTU8sSUFBSSxHQUFHLENBQUVELFFBQVEsQ0FBRSxDQUFDTCxRQUFILENBQVYsR0FBMEIsQ0FBMUIsR0FBOEJPLElBQUksQ0FBQ0MsR0FBTCxDQUFVUixRQUFWLENBQTNDO0FBQ0EsUUFBTVMsR0FBRyxHQUFNLE9BQU9QLGFBQVAsS0FBeUIsV0FBM0IsR0FBMkMsR0FBM0MsR0FBaURBLGFBQTlEO0FBQ0EsUUFBTVEsR0FBRyxHQUFNLE9BQU9ULFNBQVAsS0FBcUIsV0FBdkIsR0FBdUMsR0FBdkMsR0FBNkNBLFNBQTFEO0FBRUEsUUFBSVUsQ0FBSjs7QUFFQSxRQUFNQyxVQUFVLEdBQUcsU0FBYkEsVUFBYSxDQUFVUixDQUFWLEVBQWFFLElBQWIsRUFBb0I7QUFDdEMsVUFBTU8sQ0FBQyxHQUFHTixJQUFJLENBQUNPLEdBQUwsQ0FBVSxFQUFWLEVBQWNSLElBQWQsQ0FBVjtBQUNBLGFBQU8sS0FBS0MsSUFBSSxDQUFDUSxLQUFMLENBQVlYLENBQUMsR0FBR1MsQ0FBaEIsSUFBc0JBLENBQWxDO0FBQ0EsS0FIRCxDQVhvRSxDQWdCcEU7OztBQUNBRixJQUFBQSxDQUFDLEdBQUcsQ0FBRUwsSUFBSSxHQUFHTSxVQUFVLENBQUVSLENBQUYsRUFBS0UsSUFBTCxDQUFiLEdBQTJCLEtBQUtDLElBQUksQ0FBQ1EsS0FBTCxDQUFZWCxDQUFaLENBQXRDLEVBQXdEWSxLQUF4RCxDQUErRCxHQUEvRCxDQUFKOztBQUVBLFFBQUtMLENBQUMsQ0FBRSxDQUFGLENBQUQsQ0FBT00sTUFBUCxHQUFnQixDQUFyQixFQUF5QjtBQUN4Qk4sTUFBQUEsQ0FBQyxDQUFFLENBQUYsQ0FBRCxHQUFTQSxDQUFDLENBQUUsQ0FBRixDQUFELENBQU9SLE9BQVAsQ0FBZ0IseUJBQWhCLEVBQTJDTSxHQUEzQyxDQUFUO0FBQ0E7O0FBRUQsUUFBSyxDQUFFRSxDQUFDLENBQUUsQ0FBRixDQUFELElBQVUsRUFBWixFQUFpQk0sTUFBakIsR0FBMEJYLElBQS9CLEVBQXNDO0FBQ3JDSyxNQUFBQSxDQUFDLENBQUUsQ0FBRixDQUFELEdBQVNBLENBQUMsQ0FBRSxDQUFGLENBQUQsSUFBVSxFQUFuQjtBQUNBQSxNQUFBQSxDQUFDLENBQUUsQ0FBRixDQUFELElBQVUsSUFBSU8sS0FBSixDQUFXWixJQUFJLEdBQUdLLENBQUMsQ0FBRSxDQUFGLENBQUQsQ0FBT00sTUFBZCxHQUF1QixDQUFsQyxFQUFzQ0UsSUFBdEMsQ0FBNEMsR0FBNUMsQ0FBVjtBQUNBOztBQUVELFdBQU9SLENBQUMsQ0FBQ1EsSUFBRixDQUFRVCxHQUFSLENBQVA7QUFDQSxHQWpKc0MsQ0FtSnZDOzs7QUFDQSxXQUFTVSxjQUFULEdBQTBCO0FBQ3pCLFFBQUssZ0JBQWdCLE9BQU9DLFVBQTVCLEVBQXlDO0FBQ3hDO0FBQ0E7O0FBRUQsUUFBSXpDLEtBQUo7O0FBRUEsUUFBSzlCLFlBQVksQ0FBQytCLFdBQWxCLEVBQWdDO0FBQy9CRCxNQUFBQSxLQUFLLEdBQUcxQixDQUFDLENBQUVVLDhCQUFGLENBQVQ7QUFDQSxLQUZELE1BRU87QUFDTmdCLE1BQUFBLEtBQUssR0FBR1osd0JBQVI7QUFDQTs7QUFFRFksSUFBQUEsS0FBSyxDQUFDTCxJQUFOLENBQVkscUJBQVosRUFBb0NMLElBQXBDLENBQTBDLFlBQVc7QUFDcEQsVUFBTW9ELEtBQUssR0FBR3BFLENBQUMsQ0FBRSxJQUFGLENBQWYsQ0FEb0QsQ0FHcEQ7O0FBQ0EsVUFBTXNCLFNBQVMsR0FBRzhDLEtBQUssQ0FBQ2pELElBQU4sQ0FBWSxpQkFBWixDQUFsQjtBQUNBLFVBQU1rRCxPQUFPLEdBQUtELEtBQUssQ0FBQy9DLElBQU4sQ0FBWSxvQkFBWixDQUFsQixDQUxvRCxDQU9wRDs7QUFDQSxVQUFLZ0QsT0FBTyxDQUFDQyxRQUFSLENBQWtCLG1CQUFsQixDQUFMLEVBQStDO0FBQzlDO0FBQ0E7O0FBRUQsVUFBTUMsUUFBUSxHQUFZRixPQUFPLENBQUNsRCxJQUFSLENBQWMsSUFBZCxDQUExQjtBQUNBLFVBQU1xRCxlQUFlLEdBQUtKLEtBQUssQ0FBQ2pELElBQU4sQ0FBWSx3QkFBWixDQUExQjtBQUNBLFVBQU1zRCxhQUFhLEdBQU9MLEtBQUssQ0FBQ2pELElBQU4sQ0FBWSxxQkFBWixDQUExQjtBQUNBLFVBQU11RCxhQUFhLEdBQU9DLFVBQVUsQ0FBRVAsS0FBSyxDQUFDakQsSUFBTixDQUFZLHNCQUFaLENBQUYsQ0FBcEM7QUFDQSxVQUFNeUQsYUFBYSxHQUFPRCxVQUFVLENBQUVQLEtBQUssQ0FBQ2pELElBQU4sQ0FBWSxzQkFBWixDQUFGLENBQXBDO0FBQ0EsVUFBTTBELElBQUksR0FBZ0JGLFVBQVUsQ0FBRVAsS0FBSyxDQUFDakQsSUFBTixDQUFZLFdBQVosQ0FBRixDQUFwQztBQUNBLFVBQU0yRCxhQUFhLEdBQU9WLEtBQUssQ0FBQ2pELElBQU4sQ0FBWSxxQkFBWixDQUExQjtBQUNBLFVBQU00RCxpQkFBaUIsR0FBR1gsS0FBSyxDQUFDakQsSUFBTixDQUFZLHlCQUFaLENBQTFCO0FBQ0EsVUFBTTZELGdCQUFnQixHQUFJWixLQUFLLENBQUNqRCxJQUFOLENBQVksd0JBQVosQ0FBMUI7QUFDQSxVQUFNOEQsUUFBUSxHQUFZTixVQUFVLENBQUVQLEtBQUssQ0FBQ2pELElBQU4sQ0FBWSxnQkFBWixDQUFGLENBQXBDO0FBQ0EsVUFBTStELFFBQVEsR0FBWVAsVUFBVSxDQUFFUCxLQUFLLENBQUNqRCxJQUFOLENBQVksZ0JBQVosQ0FBRixDQUFwQztBQUNBLFVBQU1nRSxTQUFTLEdBQVdmLEtBQUssQ0FBQy9DLElBQU4sQ0FBWSxZQUFaLENBQTFCO0FBQ0EsVUFBTStELFNBQVMsR0FBV2hCLEtBQUssQ0FBQy9DLElBQU4sQ0FBWSxZQUFaLENBQTFCO0FBRUEsVUFBTWdFLE1BQU0sR0FBR3ZGLFFBQVEsQ0FBQ3dGLGNBQVQsQ0FBeUJmLFFBQXpCLENBQWY7QUFFQUosTUFBQUEsVUFBVSxDQUFDb0IsTUFBWCxDQUFtQkYsTUFBbkIsRUFBMkI7QUFDMUJHLFFBQUFBLEtBQUssRUFBRSxDQUFFUCxRQUFGLEVBQVlDLFFBQVosQ0FEbUI7QUFFMUJMLFFBQUFBLElBQUksRUFBSkEsSUFGMEI7QUFHMUJZLFFBQUFBLE9BQU8sRUFBRSxJQUhpQjtBQUkxQkMsUUFBQUEsU0FBUyxFQUFFLGFBSmU7QUFLMUJDLFFBQUFBLEtBQUssRUFBRTtBQUNOLGlCQUFPakIsYUFERDtBQUVOLGlCQUFPRTtBQUZEO0FBTG1CLE9BQTNCO0FBV0FTLE1BQUFBLE1BQU0sQ0FBQ2xCLFVBQVAsQ0FBa0JqQyxFQUFsQixDQUFzQixRQUF0QixFQUFnQyxVQUFVMEQsTUFBVixFQUFtQjtBQUNsRCxZQUFJWCxRQUFKO0FBQ0EsWUFBSUMsUUFBSjs7QUFFQSxZQUFLVCxhQUFMLEVBQXFCO0FBQ3BCUSxVQUFBQSxRQUFRLEdBQUdyQyxhQUFhLENBQUVnRCxNQUFNLENBQUUsQ0FBRixDQUFSLEVBQWVkLGFBQWYsRUFBOEJFLGdCQUE5QixFQUFnREQsaUJBQWhELENBQXhCO0FBQ0FHLFVBQUFBLFFBQVEsR0FBR3RDLGFBQWEsQ0FBRWdELE1BQU0sQ0FBRSxDQUFGLENBQVIsRUFBZWQsYUFBZixFQUE4QkUsZ0JBQTlCLEVBQWdERCxpQkFBaEQsQ0FBeEI7QUFDQSxTQUhELE1BR087QUFDTkUsVUFBQUEsUUFBUSxHQUFHTixVQUFVLENBQUVpQixNQUFNLENBQUUsQ0FBRixDQUFSLENBQXJCO0FBQ0FWLFVBQUFBLFFBQVEsR0FBR1AsVUFBVSxDQUFFaUIsTUFBTSxDQUFFLENBQUYsQ0FBUixDQUFyQjtBQUNBOztBQUVELFlBQUssaUJBQWlCcEIsZUFBdEIsRUFBd0M7QUFDdkNXLFVBQUFBLFNBQVMsQ0FBQ1UsSUFBVixDQUFnQlosUUFBaEI7QUFDQUcsVUFBQUEsU0FBUyxDQUFDUyxJQUFWLENBQWdCWCxRQUFoQjtBQUNBLFNBSEQsTUFHTztBQUNOQyxVQUFBQSxTQUFTLENBQUNXLEdBQVYsQ0FBZWIsUUFBZjtBQUNBRyxVQUFBQSxTQUFTLENBQUNVLEdBQVYsQ0FBZVosUUFBZjtBQUNBOztBQUVEakYsUUFBQUEsS0FBSyxDQUFDOEYsT0FBTixDQUFlLHlCQUFmLEVBQTBDLENBQUUzQixLQUFGLEVBQVN3QixNQUFULENBQTFDO0FBQ0EsT0FyQkQ7O0FBdUJBLGVBQVNJLCtCQUFULENBQTBDSixNQUExQyxFQUFtRDtBQUNsRCxZQUFLaEcsWUFBWSxDQUFDK0IsV0FBbEIsRUFBZ0M7QUFDL0I7QUFDQTs7QUFFRCxZQUFNc0QsUUFBUSxHQUFHTixVQUFVLENBQUVpQixNQUFNLENBQUUsQ0FBRixDQUFSLENBQTNCO0FBQ0EsWUFBTVYsUUFBUSxHQUFHUCxVQUFVLENBQUVpQixNQUFNLENBQUUsQ0FBRixDQUFSLENBQTNCOztBQUVBLFlBQUtYLFFBQVEsS0FBS1AsYUFBYixJQUE4QlEsUUFBUSxLQUFLTixhQUFoRCxFQUFnRTtBQUMvRDtBQUNBcUIsVUFBQUEsYUFBYSxDQUFFN0IsS0FBSyxDQUFDOEIsSUFBTixDQUFZLGtCQUFaLENBQUYsQ0FBYjtBQUNBLFNBSEQsTUFHTztBQUNOO0FBQ0EsY0FBTUMsR0FBRyxHQUFHL0IsS0FBSyxDQUFDOEIsSUFBTixDQUFZLEtBQVosRUFBb0JqRCxPQUFwQixDQUE2QixLQUE3QixFQUFvQ2dDLFFBQXBDLEVBQStDaEMsT0FBL0MsQ0FBd0QsS0FBeEQsRUFBK0RpQyxRQUEvRCxDQUFaO0FBQ0FlLFVBQUFBLGFBQWEsQ0FBRUUsR0FBRixDQUFiO0FBQ0E7QUFDRDs7QUFFRGQsTUFBQUEsTUFBTSxDQUFDbEIsVUFBUCxDQUFrQmpDLEVBQWxCLENBQXNCLFFBQXRCLEVBQWdDLFVBQVUwRCxNQUFWLEVBQW1CO0FBQ2xEO0FBQ0FRLFFBQUFBLFlBQVksQ0FBRWhDLEtBQUssQ0FBQzhCLElBQU4sQ0FBWSxPQUFaLENBQUYsQ0FBWjtBQUVBOUIsUUFBQUEsS0FBSyxDQUFDOEIsSUFBTixDQUFZLE9BQVosRUFBcUJHLFVBQVUsQ0FBRSxZQUFXO0FBQzNDakMsVUFBQUEsS0FBSyxDQUFDa0MsVUFBTixDQUFrQixPQUFsQjtBQUVBTixVQUFBQSwrQkFBK0IsQ0FBRUosTUFBRixDQUEvQjtBQUNBLFNBSjhCLEVBSTVCdEYsS0FKNEIsQ0FBL0I7QUFLQSxPQVREO0FBV0E2RSxNQUFBQSxTQUFTLENBQUNqRCxFQUFWLENBQWMsT0FBZCxFQUF1QixVQUFVcUUsS0FBVixFQUFrQjtBQUN4Q0EsUUFBQUEsS0FBSyxDQUFDQyxjQUFOO0FBRUEsWUFBTUMsTUFBTSxHQUFHekcsQ0FBQyxDQUFFLElBQUYsQ0FBaEIsQ0FId0MsQ0FLeEM7O0FBQ0FvRyxRQUFBQSxZQUFZLENBQUVLLE1BQU0sQ0FBQ1AsSUFBUCxDQUFhLE9BQWIsQ0FBRixDQUFaO0FBRUFPLFFBQUFBLE1BQU0sQ0FBQ1AsSUFBUCxDQUFhLE9BQWIsRUFBc0JHLFVBQVUsQ0FBRSxZQUFXO0FBQzVDSSxVQUFBQSxNQUFNLENBQUNILFVBQVAsQ0FBbUIsT0FBbkI7QUFFQSxjQUFNckIsUUFBUSxHQUFHd0IsTUFBTSxDQUFDWCxHQUFQLEVBQWpCO0FBRUFULFVBQUFBLE1BQU0sQ0FBQ2xCLFVBQVAsQ0FBa0J1QyxHQUFsQixDQUF1QixDQUFFekIsUUFBRixFQUFZLElBQVosQ0FBdkI7QUFFQWUsVUFBQUEsK0JBQStCLENBQUVYLE1BQU0sQ0FBQ2xCLFVBQVAsQ0FBa0J3QyxHQUFsQixFQUFGLENBQS9CO0FBQ0EsU0FSK0IsRUFRN0JyRyxLQVI2QixDQUFoQztBQVNBLE9BakJEO0FBbUJBOEUsTUFBQUEsU0FBUyxDQUFDbEQsRUFBVixDQUFjLE9BQWQsRUFBdUIsVUFBVXFFLEtBQVYsRUFBa0I7QUFDeENBLFFBQUFBLEtBQUssQ0FBQ0MsY0FBTjtBQUVBLFlBQU1DLE1BQU0sR0FBR3pHLENBQUMsQ0FBRSxJQUFGLENBQWhCLENBSHdDLENBS3hDOztBQUNBb0csUUFBQUEsWUFBWSxDQUFFSyxNQUFNLENBQUNQLElBQVAsQ0FBYSxPQUFiLENBQUYsQ0FBWjtBQUVBTyxRQUFBQSxNQUFNLENBQUNQLElBQVAsQ0FBYSxPQUFiLEVBQXNCRyxVQUFVLENBQUUsWUFBVztBQUM1Q0ksVUFBQUEsTUFBTSxDQUFDSCxVQUFQLENBQW1CLE9BQW5CO0FBRUEsY0FBTXBCLFFBQVEsR0FBR3VCLE1BQU0sQ0FBQ1gsR0FBUCxFQUFqQjtBQUVBVCxVQUFBQSxNQUFNLENBQUNsQixVQUFQLENBQWtCdUMsR0FBbEIsQ0FBdUIsQ0FBRSxJQUFGLEVBQVF4QixRQUFSLENBQXZCO0FBRUFjLFVBQUFBLCtCQUErQixDQUFFWCxNQUFNLENBQUNsQixVQUFQLENBQWtCd0MsR0FBbEIsRUFBRixDQUEvQjtBQUNBLFNBUitCLEVBUTdCckcsS0FSNkIsQ0FBaEM7QUFTQSxPQWpCRDtBQWtCQSxLQWhJRDtBQWlJQTs7QUFFRDRELEVBQUFBLGNBQWM7O0FBRWQsV0FBUzBDLFlBQVQsQ0FBdUJILE1BQXZCLEVBQWdDO0FBQy9CLFFBQUs3RyxZQUFZLENBQUMrQixXQUFsQixFQUFnQztBQUMvQjtBQUNBOztBQUVELFFBQU1rRixnQkFBZ0IsR0FBR0osTUFBTSxDQUFDSyxPQUFQLENBQWdCLG1CQUFoQixDQUF6QjtBQUNBLFFBQU14RixTQUFTLEdBQVV1RixnQkFBZ0IsQ0FBQzFGLElBQWpCLENBQXVCLGlCQUF2QixDQUF6QjtBQUNBLFFBQU00RixPQUFPLEdBQVlGLGdCQUFnQixDQUFDMUYsSUFBakIsQ0FBdUIsZUFBdkIsQ0FBekI7QUFFQSxRQUFJNkYsV0FBVyxHQUFHLEVBQWxCO0FBQ0EsUUFBSUMsU0FBUyxHQUFLLEtBQWxCLENBVitCLENBWS9COztBQUNBYixJQUFBQSxZQUFZLENBQUVTLGdCQUFnQixDQUFDWCxJQUFqQixDQUF1QixPQUF2QixDQUFGLENBQVo7O0FBRUEsUUFBS2EsT0FBTCxFQUFlO0FBQ2QsVUFBTUcsSUFBSSxHQUFHTCxnQkFBZ0IsQ0FBQ3hGLElBQWpCLENBQXVCLGtCQUF2QixFQUE0Q3lFLEdBQTVDLEVBQWI7QUFDQSxVQUFNcUIsRUFBRSxHQUFLTixnQkFBZ0IsQ0FBQ3hGLElBQWpCLENBQXVCLGdCQUF2QixFQUEwQ3lFLEdBQTFDLEVBQWI7O0FBRUEsVUFBS29CLElBQUksSUFBSUMsRUFBYixFQUFrQjtBQUNqQkgsUUFBQUEsV0FBVyxHQUFHRSxJQUFJLEdBQUdoSCxvQkFBUCxHQUE4QmlILEVBQTVDO0FBQ0FGLFFBQUFBLFNBQVMsR0FBSyxJQUFkO0FBQ0EsT0FIRCxNQUdPLElBQUssQ0FBRUMsSUFBRixJQUFVLENBQUVDLEVBQWpCLEVBQXNCO0FBQzVCRixRQUFBQSxTQUFTLEdBQUcsSUFBWjtBQUNBO0FBQ0QsS0FWRCxNQVVPO0FBQ04sVUFBTUMsS0FBSSxHQUFHTCxnQkFBZ0IsQ0FBQ3hGLElBQWpCLENBQXVCLGtCQUF2QixFQUE0Q3lFLEdBQTVDLEVBQWI7O0FBRUEsVUFBS29CLEtBQUwsRUFBWTtBQUNYRixRQUFBQSxXQUFXLEdBQUdFLEtBQWQ7QUFDQUQsUUFBQUEsU0FBUyxHQUFLLElBQWQ7QUFDQSxPQUhELE1BR087QUFDTkEsUUFBQUEsU0FBUyxHQUFHLElBQVo7QUFDQTtBQUNEOztBQUVELFFBQUtBLFNBQUwsRUFBaUI7QUFDaEJKLE1BQUFBLGdCQUFnQixDQUFDWCxJQUFqQixDQUF1QixPQUF2QixFQUFnQ0csVUFBVSxDQUFFLFlBQVc7QUFDdERRLFFBQUFBLGdCQUFnQixDQUFDUCxVQUFqQixDQUE2QixPQUE3Qjs7QUFFQSxZQUFLVSxXQUFMLEVBQW1CO0FBQ2xCSSxVQUFBQSwwQkFBMEIsQ0FBRTlGLFNBQUYsRUFBYTBGLFdBQWIsQ0FBMUI7QUFDQSxTQUZELE1BRU87QUFDTixjQUFNSyxLQUFLLEdBQUdDLDBCQUEwQixDQUFFaEcsU0FBRixDQUF4QztBQUNBaUcsVUFBQUEsT0FBTyxDQUFDQyxTQUFSLENBQW1CLEVBQW5CLEVBQXVCLEVBQXZCLEVBQTJCSCxLQUEzQjtBQUNBOztBQUVESSxRQUFBQSxjQUFjO0FBQ2QsT0FYeUMsRUFXdkNuSCxLQVh1QyxDQUExQztBQVlBO0FBQ0Q7O0FBRUQsV0FBU29ILGNBQVQsR0FBMEI7QUFDekIsUUFBSyxDQUFFN0gsTUFBTSxHQUFHOEgsVUFBaEIsRUFBNkI7QUFDNUI7QUFDQTs7QUFFRCxRQUFJakcsS0FBSjs7QUFFQSxRQUFLOUIsWUFBWSxDQUFDK0IsV0FBbEIsRUFBZ0M7QUFDL0JELE1BQUFBLEtBQUssR0FBRzFCLENBQUMsQ0FBRVcsdUJBQUYsQ0FBVDtBQUNBLEtBRkQsTUFFTztBQUNOZSxNQUFBQSxLQUFLLEdBQUdYLGlCQUFSO0FBQ0E7O0FBRUQsUUFBTThGLGdCQUFnQixHQUFHbkYsS0FBSyxDQUFDTCxJQUFOLENBQVksbUJBQVosQ0FBekI7QUFFQSxRQUFNdUcsTUFBTSxHQUFVZixnQkFBZ0IsQ0FBQzFGLElBQWpCLENBQXVCLGtCQUF2QixDQUF0QjtBQUNBLFFBQU0wRyxZQUFZLEdBQUloQixnQkFBZ0IsQ0FBQzFGLElBQWpCLENBQXVCLGdDQUF2QixDQUF0QjtBQUNBLFFBQU0yRyxhQUFhLEdBQUdqQixnQkFBZ0IsQ0FBQzFGLElBQWpCLENBQXVCLGlDQUF2QixDQUF0QjtBQUVBLFFBQU00RyxLQUFLLEdBQUdsQixnQkFBZ0IsQ0FBQ3hGLElBQWpCLENBQXVCLGtCQUF2QixDQUFkO0FBQ0EsUUFBTTJHLEdBQUcsR0FBS25CLGdCQUFnQixDQUFDeEYsSUFBakIsQ0FBdUIsZ0JBQXZCLENBQWQ7QUFFQTBHLElBQUFBLEtBQUssQ0FBQ0osVUFBTixDQUFrQjtBQUNqQk0sTUFBQUEsVUFBVSxFQUFFTCxNQURLO0FBRWpCTSxNQUFBQSxVQUFVLEVBQUVMLFlBRks7QUFHakJNLE1BQUFBLFdBQVcsRUFBRUw7QUFISSxLQUFsQjtBQU1BRSxJQUFBQSxHQUFHLENBQUNMLFVBQUosQ0FBZ0I7QUFDZk0sTUFBQUEsVUFBVSxFQUFFTCxNQURHO0FBRWZNLE1BQUFBLFVBQVUsRUFBRUwsWUFGRztBQUdmTSxNQUFBQSxXQUFXLEVBQUVMO0FBSEUsS0FBaEI7QUFNQUMsSUFBQUEsS0FBSyxDQUFDN0YsRUFBTixDQUFVLFFBQVYsRUFBb0IsWUFBVztBQUM5QixVQUFNdUUsTUFBTSxHQUFHekcsQ0FBQyxDQUFFLElBQUYsQ0FBaEI7QUFDQTRHLE1BQUFBLFlBQVksQ0FBRUgsTUFBRixDQUFaO0FBQ0EsS0FIRDtBQUtBdUIsSUFBQUEsR0FBRyxDQUFDOUYsRUFBSixDQUFRLFFBQVIsRUFBa0IsWUFBVztBQUM1QixVQUFNdUUsTUFBTSxHQUFHekcsQ0FBQyxDQUFFLElBQUYsQ0FBaEI7QUFDQTRHLE1BQUFBLFlBQVksQ0FBRUgsTUFBRixDQUFaO0FBQ0EsS0FIRDtBQUlBOztBQUVEaUIsRUFBQUEsY0FBYzs7QUFFZCxXQUFTVSxrQkFBVCxHQUE4QjtBQUM3QjtBQUNBLFFBQUt4SSxZQUFZLENBQUN5SSx3QkFBbEIsRUFBNkM7QUFDNUMsVUFBS3hJLE1BQU0sR0FBRzRCLE1BQWQsRUFBdUI7QUFDdEJ4QixRQUFBQSxLQUFLLENBQUNvQixJQUFOLENBQVksc0NBQVosRUFBcURJLE1BQXJELENBQTZEO0FBQzVELHNDQUE0QjtBQURnQyxTQUE3RDtBQUdBO0FBQ0Q7O0FBRUQsUUFBSyxDQUFFN0IsWUFBWSxDQUFDMEksZUFBcEIsRUFBc0M7QUFDckNySSxNQUFBQSxLQUFLLENBQUNvQixJQUFOLENBQVksdUJBQVosRUFBc0NMLElBQXRDLENBQTRDLFlBQVc7QUFDdEQsWUFBTXVILGFBQWEsR0FBR3ZJLENBQUMsQ0FBRSxJQUFGLENBQXZCO0FBRUF1SSxRQUFBQSxhQUFhLENBQUNyRyxFQUFkLENBQWtCLFFBQWxCLEVBQTRCLGdCQUE1QixFQUE4QyxZQUFXO0FBQ3hEcUcsVUFBQUEsYUFBYSxDQUFDQyxNQUFkO0FBQ0EsU0FGRDtBQUdBLE9BTkQ7QUFRQTtBQUNBLEtBcEI0QixDQXNCN0I7OztBQUNBdkksSUFBQUEsS0FBSyxDQUFDb0IsSUFBTixDQUFZLHVCQUFaLEVBQXNDTCxJQUF0QyxDQUE0QyxZQUFXO0FBQ3RELFVBQU11SCxhQUFhLEdBQUd2SSxDQUFDLENBQUUsSUFBRixDQUF2QjtBQUVBdUksTUFBQUEsYUFBYSxDQUFDckcsRUFBZCxDQUFrQixRQUFsQixFQUE0QixVQUFVdUcsQ0FBVixFQUFjO0FBQ3pDQSxRQUFBQSxDQUFDLENBQUNqQyxjQUFGO0FBQ0EsT0FGRDtBQUlBK0IsTUFBQUEsYUFBYSxDQUFDckcsRUFBZCxDQUFrQixRQUFsQixFQUE0QixnQkFBNUIsRUFBOEMsVUFBVXVHLENBQVYsRUFBYztBQUMzREEsUUFBQUEsQ0FBQyxDQUFDakMsY0FBRjtBQUVBLFlBQU1rQyxLQUFLLEdBQVExSSxDQUFDLENBQUUsSUFBRixDQUFELENBQVU4RixHQUFWLEVBQW5CO0FBQ0EsWUFBTTZDLFVBQVUsR0FBRyxTQUFuQjtBQUVBdkIsUUFBQUEsMEJBQTBCLENBQUV1QixVQUFGLEVBQWNELEtBQWQsQ0FBMUI7QUFDQWpCLFFBQUFBLGNBQWM7QUFDZCxPQVJEO0FBU0EsS0FoQkQ7QUFpQkE7O0FBRURXLEVBQUFBLGtCQUFrQjs7QUFFbEIsV0FBU1EseUJBQVQsQ0FBb0NDLFFBQXBDLEVBQStDO0FBQzlDLFFBQU1DLFFBQVEsR0FBRywyQkFBakI7O0FBRUEsUUFBSzlJLENBQUMsQ0FBRUosWUFBWSxDQUFDbUosbUJBQWYsQ0FBRCxDQUFzQzFILElBQXRDLENBQTRDeUgsUUFBNUMsRUFBdUQvRSxNQUE1RCxFQUFxRTtBQUNwRTtBQUNBOztBQUVELFFBQU1pRixlQUFlLEdBQUdILFFBQVEsQ0FBQ3hILElBQVQsQ0FBZXlILFFBQWYsRUFBMEJqRCxJQUExQixFQUF4QjtBQUVBNUYsSUFBQUEsS0FBSyxDQUFDb0IsSUFBTixDQUFZeUgsUUFBWixFQUF1QmpELElBQXZCLENBQTZCbUQsZUFBN0I7QUFDQTs7QUFFRCxXQUFTQyxvQkFBVCxHQUFnQztBQUMvQixRQUFLLENBQUVySixZQUFZLENBQUNzSixpQkFBcEIsRUFBd0M7QUFDdkM7QUFDQTs7QUFFRGxKLElBQUFBLENBQUMsQ0FBQ21KLGNBQUYsQ0FBa0IsTUFBbEIsRUFBMEJ2SixZQUFZLENBQUN3Six1QkFBdkM7QUFDQTs7QUFFRCxXQUFTQyxrQkFBVCxHQUE4QjtBQUM3QixRQUFLLGdCQUFnQixPQUFPbEYsVUFBNUIsRUFBeUM7QUFDeEM7QUFDQTs7QUFFRHJELElBQUFBLHdCQUF3QixDQUFDTyxJQUF6QixDQUErQixvQkFBL0IsRUFBc0RMLElBQXRELENBQTRELFVBQVV5SCxDQUFWLEVBQWFhLE9BQWIsRUFBdUI7QUFDbEZBLE1BQUFBLE9BQU8sQ0FBQ0MsWUFBUixDQUFzQixVQUF0QixFQUFrQyxJQUFsQztBQUNBLEtBRkQ7QUFHQTs7QUFFRCxXQUFTQyxhQUFULEdBQXlCO0FBQ3hCLFFBQU1DLFNBQVMsR0FBRyx1REFBbEIsQ0FEd0IsQ0FHeEI7O0FBQ0E3SSxJQUFBQSxtQkFBbUIsQ0FBQ1MsSUFBcEIsQ0FBMEJvSSxTQUExQixFQUFzQ0MsUUFBdEMsQ0FBZ0QsVUFBaEQ7QUFDQTs7QUFFRCxXQUFTQyxhQUFULEdBQXlCO0FBQ3hCLFFBQUssQ0FBRS9KLFlBQVksQ0FBQ2dLLHFDQUFwQixFQUE0RDtBQUMzRDtBQUNBOztBQUVELFFBQU1DLE1BQU0sR0FBRyxlQUFmO0FBRUFqSixJQUFBQSxtQkFBbUIsQ0FBQ1MsSUFBcEIsQ0FBMEJ3SSxNQUExQixFQUFtQzFJLElBQW5DLENBQXlDLFVBQXpDLEVBQXFELFVBQXJEO0FBQ0FQLElBQUFBLG1CQUFtQixDQUFDUyxJQUFwQixDQUEwQndJLE1BQTFCLEVBQW1DOUQsT0FBbkMsQ0FBNEMsZ0JBQTVDO0FBRUFzRCxJQUFBQSxrQkFBa0I7QUFDbEJHLElBQUFBLGFBQWE7QUFDYjs7QUFFRCxXQUFTTSxpQkFBVCxHQUE2QjtBQUM1QixRQUFLLGdCQUFnQixPQUFPM0YsVUFBNUIsRUFBeUM7QUFDeEM7QUFDQTs7QUFFRHJELElBQUFBLHdCQUF3QixDQUFDTyxJQUF6QixDQUErQixvQkFBL0IsRUFBc0RMLElBQXRELENBQTRELFVBQVV5SCxDQUFWLEVBQWFhLE9BQWIsRUFBdUI7QUFDbEZBLE1BQUFBLE9BQU8sQ0FBQ1MsZUFBUixDQUF5QixVQUF6QjtBQUNBLEtBRkQ7QUFHQTs7QUFFRCxXQUFTQyxZQUFULEdBQXdCO0FBQ3ZCLFFBQUssQ0FBRXBLLFlBQVksQ0FBQ2dLLHFDQUFwQixFQUE0RDtBQUMzRDtBQUNBOztBQUVELFFBQU1DLE1BQU0sR0FBRyxPQUFmO0FBRUEvSSxJQUFBQSx3QkFBd0IsQ0FBQ08sSUFBekIsQ0FBK0J3SSxNQUEvQixFQUF3Q0ksVUFBeEMsQ0FBb0QsVUFBcEQ7QUFDQWxKLElBQUFBLGlCQUFpQixDQUFDTSxJQUFsQixDQUF3QndJLE1BQXhCLEVBQWlDSSxVQUFqQyxDQUE2QyxVQUE3QztBQUVBSCxJQUFBQSxpQkFBaUI7QUFDakI7O0FBRUQsV0FBU0kscUJBQVQsR0FBaUM7QUFDaEMsUUFBSyxDQUFFdEssWUFBWSxDQUFDc0osaUJBQXBCLEVBQXdDO0FBQ3ZDO0FBQ0E7O0FBRURsSixJQUFBQSxDQUFDLENBQUNtSixjQUFGLENBQWtCLE1BQWxCO0FBQ0E7O0FBRUQsV0FBU2dCLFFBQVQsR0FBb0I7QUFDbkIsUUFBSyxXQUFXdkssWUFBWSxDQUFDd0ssYUFBN0IsRUFBNkM7QUFDNUM7QUFDQTs7QUFFRCxRQUFNQyxTQUFTLEdBQUd6SyxZQUFZLENBQUMwSyxpQkFBL0I7QUFDQSxRQUFNQyxRQUFRLEdBQUkzSyxZQUFZLENBQUM0SyxTQUEvQjtBQUNBLFFBQUlDLE9BQU8sR0FBTyxLQUFsQjs7QUFFQSxRQUFLLGFBQWFKLFNBQWIsSUFBMEJFLFFBQS9CLEVBQTBDO0FBQ3pDRSxNQUFBQSxPQUFPLEdBQUcsSUFBVjtBQUNBLEtBRkQsTUFFTyxJQUFLLGNBQWNKLFNBQWQsSUFBMkIsQ0FBRUUsUUFBbEMsRUFBNkM7QUFDbkRFLE1BQUFBLE9BQU8sR0FBRyxJQUFWO0FBQ0EsS0FGTSxNQUVBLElBQUssV0FBV0osU0FBaEIsRUFBNEI7QUFDbENJLE1BQUFBLE9BQU8sR0FBRyxJQUFWO0FBQ0E7O0FBRUQsUUFBSyxDQUFFQSxPQUFQLEVBQWlCO0FBQ2hCO0FBQ0E7O0FBRUQsUUFBSUMsZUFBSixFQUFxQkMsTUFBckI7O0FBRUEsUUFBSy9LLFlBQVksQ0FBQ2dMLG9CQUFsQixFQUF5QztBQUN4Q0YsTUFBQUEsZUFBZSxHQUFHdEssUUFBUSxDQUFFUixZQUFZLENBQUNnTCxvQkFBZixDQUExQjtBQUNBOztBQUVELFFBQUlDLFNBQUo7O0FBRUEsUUFBSzdLLENBQUMsQ0FBRUosWUFBWSxDQUFDbUosbUJBQWYsQ0FBRCxDQUFzQ2hGLE1BQTNDLEVBQW9EO0FBQ25EOEcsTUFBQUEsU0FBUyxHQUFHakwsWUFBWSxDQUFDbUosbUJBQXpCO0FBQ0EsS0FGRCxNQUVPLElBQUsvSSxDQUFDLENBQUVKLFlBQVksQ0FBQ2tMLG1CQUFmLENBQUQsQ0FBc0MvRyxNQUEzQyxFQUFvRDtBQUMxRDhHLE1BQUFBLFNBQVMsR0FBR2pMLFlBQVksQ0FBQ2tMLG1CQUF6QjtBQUNBOztBQUVELFFBQUssYUFBYWxMLFlBQVksQ0FBQ3dLLGFBQS9CLEVBQStDO0FBQzlDUyxNQUFBQSxTQUFTLEdBQUdqTCxZQUFZLENBQUNtTCw0QkFBekI7QUFDQTs7QUFFRCxRQUFNQyxVQUFVLEdBQUdoTCxDQUFDLENBQUU2SyxTQUFGLENBQXBCOztBQUVBLFFBQUtHLFVBQVUsQ0FBQ2pILE1BQWhCLEVBQXlCO0FBQ3hCNEcsTUFBQUEsTUFBTSxHQUFHSyxVQUFVLENBQUNMLE1BQVgsR0FBb0JNLEdBQXBCLEdBQTBCUCxlQUFuQzs7QUFFQSxVQUFLQyxNQUFNLEdBQUcsQ0FBZCxFQUFrQjtBQUNqQkEsUUFBQUEsTUFBTSxHQUFHLENBQVQ7QUFDQTs7QUFFRDNLLE1BQUFBLENBQUMsQ0FBRSxZQUFGLENBQUQsQ0FBa0JrTCxJQUFsQixHQUF5QkMsT0FBekIsQ0FDQztBQUFFQyxRQUFBQSxTQUFTLEVBQUVUO0FBQWIsT0FERCxFQUVDL0ssWUFBWSxDQUFDeUwsbUJBRmQsRUFHQ3pMLFlBQVksQ0FBQzBMLG9CQUhkO0FBS0E7QUFDRCxHQTdqQnNDLENBK2pCdkM7OztBQUNBLFdBQVNDLHNCQUFULEdBQWtDO0FBQ2pDNUIsSUFBQUEsYUFBYTtBQUNiVixJQUFBQSxvQkFBb0I7O0FBRXBCLFFBQUssa0JBQWtCckosWUFBWSxDQUFDNEwsa0JBQXBDLEVBQXlEO0FBQ3hEckIsTUFBQUEsUUFBUTtBQUNSOztBQUVEbEssSUFBQUEsS0FBSyxDQUFDOEYsT0FBTixDQUFlLGdDQUFmO0FBQ0E7O0FBRUQsV0FBUzBGLHNCQUFULENBQWlDNUMsUUFBakMsRUFBNEM7QUFDM0NxQixJQUFBQSxxQkFBcUI7QUFFckJqSyxJQUFBQSxLQUFLLENBQUM4RixPQUFOLENBQWUsZ0NBQWYsRUFBaUQsQ0FBRThDLFFBQUYsQ0FBakQ7QUFDQSxHQS9rQnNDLENBaWxCdkM7OztBQUNBLFdBQVM2QyxxQkFBVCxDQUFnQzdDLFFBQWhDLEVBQTJDO0FBQzFDckgsSUFBQUEsVUFBVTtBQUNWUyxJQUFBQSxzQkFBc0I7QUFDdEJpQyxJQUFBQSxjQUFjO0FBQ2R3RCxJQUFBQSxjQUFjO0FBQ2RVLElBQUFBLGtCQUFrQjtBQUNsQlEsSUFBQUEseUJBQXlCLENBQUVDLFFBQUYsQ0FBekI7QUFDQW1CLElBQUFBLFlBQVk7O0FBRVosUUFBSyxZQUFZcEssWUFBWSxDQUFDNEwsa0JBQTlCLEVBQW1EO0FBQ2xEckIsTUFBQUEsUUFBUTtBQUNSOztBQUVEbEssSUFBQUEsS0FBSyxDQUFDOEYsT0FBTixDQUFlLCtCQUFmLEVBQWdELENBQUU4QyxRQUFGLENBQWhEO0FBQ0EsR0FobUJzQyxDQWttQnZDOzs7QUFDQSxXQUFTcEIsY0FBVCxHQUFpRDtBQUFBLFFBQXhCa0UsYUFBd0IsdUVBQVIsS0FBUTs7QUFDaEQsUUFBSy9MLFlBQVksQ0FBQytCLFdBQWxCLEVBQWdDO0FBQy9CO0FBQ0E7O0FBRUQ0SixJQUFBQSxzQkFBc0I7QUFFdEJ2TCxJQUFBQSxDQUFDLENBQUMyRyxHQUFGLENBQU9pRixNQUFNLENBQUNDLFFBQVAsQ0FBZ0JDLElBQXZCLEVBQTZCLFVBQVU1RixJQUFWLEVBQWlCO0FBQzdDLFVBQU02RixLQUFLLEdBQUcvTCxDQUFDLENBQUVrRyxJQUFGLENBQWYsQ0FENkMsQ0FHN0M7O0FBQ0FsRyxNQUFBQSxDQUFDLENBQUNnQixJQUFGLENBQVFULE1BQVIsRUFBZ0IsVUFBVVcsRUFBVixFQUFlO0FBQzlCLFlBQU04SyxPQUFPLEdBQU0sZUFBZTlLLEVBQWYsR0FBb0IsSUFBdkM7QUFDQSxZQUFNRCxNQUFNLEdBQU9qQixDQUFDLENBQUVnTSxPQUFGLENBQXBCO0FBQ0EsWUFBTUMsTUFBTSxHQUFPaEwsTUFBTSxDQUFDSSxJQUFQLENBQWEsb0JBQWIsQ0FBbkI7O0FBQ0EsWUFBTTZLLE1BQU0sR0FBT0gsS0FBSyxDQUFDMUssSUFBTixDQUFZMkssT0FBWixDQUFuQjs7QUFDQSxZQUFJRyxZQUFZLEdBQUduTSxDQUFDLENBQUVrTSxNQUFGLENBQUQsQ0FBWS9LLElBQVosQ0FBa0IsT0FBbEIsQ0FBbkIsQ0FMOEIsQ0FPOUI7O0FBQ0EsWUFBS3ZCLFlBQVksQ0FBQ3dNLGtDQUFsQixFQUF1RDtBQUN0RCxjQUFLbkwsTUFBTSxDQUFDcUQsUUFBUCxDQUFpQixxQkFBakIsQ0FBTCxFQUFnRDtBQUMvQ3JELFlBQUFBLE1BQU0sQ0FBQ0ksSUFBUCxDQUFhLG9DQUFiLEVBQW9ETCxJQUFwRCxDQUEwRCxZQUFXO0FBQ3BFLGtCQUFNcUwsU0FBUyxHQUFRck0sQ0FBQyxDQUFFLElBQUYsQ0FBRCxDQUFVb0MsTUFBVixHQUFtQkMsUUFBbkIsQ0FBNkIsT0FBN0IsRUFBdUN5RCxHQUF2QyxFQUF2QjtBQUNBLGtCQUFNd0csY0FBYyxHQUFHLGtCQUFrQkQsU0FBbEIsR0FBOEIsa0NBQXJEO0FBQ0Esa0JBQU1FLFVBQVUsR0FBTyxrQkFBa0JGLFNBQWxCLEdBQThCLFNBQXJEO0FBQ0Esa0JBQU1HLFFBQVEsR0FBUyxtQ0FBdkI7O0FBRUFOLGNBQUFBLE1BQU0sQ0FBQzdLLElBQVAsQ0FBYWlMLGNBQWIsRUFBOEJuTCxJQUE5QixDQUFvQyxPQUFwQyxFQUE2Q3FMLFFBQTdDOztBQUNBTixjQUFBQSxNQUFNLENBQUM3SyxJQUFQLENBQWFrTCxVQUFiLEVBQTBCRSxJQUExQjtBQUNBLGFBUkQ7QUFTQTtBQUNEOztBQUVELFlBQU1DLEtBQUssR0FBR1IsTUFBTSxDQUFDN0ssSUFBUCxDQUFhLG9CQUFiLEVBQW9Dd0UsSUFBcEMsRUFBZCxDQXRCOEIsQ0F3QjlCOzs7QUFDQSxZQUFNOEcsaUJBQWlCLEdBQUcsbUJBQTFCOztBQUVBLFlBQUsxTCxNQUFNLENBQUNxRCxRQUFQLENBQWlCcUksaUJBQWpCLENBQUwsRUFBNEM7QUFDM0MsY0FBSyxDQUFFVCxNQUFNLENBQUM1SCxRQUFQLENBQWlCcUksaUJBQWpCLENBQVAsRUFBOEM7QUFDN0NSLFlBQUFBLFlBQVksSUFBSSxNQUFNUSxpQkFBdEI7QUFDQTtBQUNELFNBSkQsTUFJTztBQUNOUixVQUFBQSxZQUFZLEdBQUdBLFlBQVksQ0FBQ2xKLE9BQWIsQ0FBc0IwSixpQkFBdEIsRUFBeUMsRUFBekMsQ0FBZjtBQUNBLFNBakM2QixDQW1DOUI7OztBQUNBMUwsUUFBQUEsTUFBTSxDQUFDRSxJQUFQLENBQWEsT0FBYixFQUFzQmdMLFlBQVksQ0FBQ1MsSUFBYixFQUF0QixFQXBDOEIsQ0FzQzlCOztBQUNBLFlBQUtqQixhQUFMLEVBQXFCO0FBRXBCO0FBQ0FNLFVBQUFBLE1BQU0sQ0FBQ3BHLElBQVAsQ0FBYTZHLEtBQWI7QUFFQSxTQUxELE1BS087QUFFTjtBQUNBLGNBQUt6TCxNQUFNLENBQUNxRCxRQUFQLENBQWlCLGtCQUFqQixDQUFMLEVBQTZDO0FBRTVDO0FBQ0EySCxZQUFBQSxNQUFNLENBQUNwRyxJQUFQLENBQWE2RyxLQUFiO0FBRUE7QUFFRDs7QUFFRHpMLFFBQUFBLE1BQU0sQ0FBQzhFLE9BQVAsQ0FBZ0IscUJBQWhCLEVBQXVDLENBQUVtRyxNQUFGLENBQXZDO0FBQ0EsT0F6REQ7QUEyREFULE1BQUFBLHNCQUFzQixDQUFFTSxLQUFGLENBQXRCLENBL0Q2QyxDQWlFN0M7O0FBQ0EsVUFBTWMsa0JBQWtCLEdBQUdkLEtBQUssQ0FBQzFLLElBQU4sQ0FBWXpCLFlBQVksQ0FBQ21KLG1CQUF6QixDQUEzQjtBQUNBLFVBQU0rRCxrQkFBa0IsR0FBR2YsS0FBSyxDQUFDMUssSUFBTixDQUFZekIsWUFBWSxDQUFDa0wsbUJBQXpCLENBQTNCOztBQUVBLFVBQUtsTCxZQUFZLENBQUNtSixtQkFBYixLQUFxQ25KLFlBQVksQ0FBQ2tMLG1CQUF2RCxFQUE2RTtBQUM1RTlLLFFBQUFBLENBQUMsQ0FBRUosWUFBWSxDQUFDbUosbUJBQWYsQ0FBRCxDQUFzQ2xELElBQXRDLENBQTRDZ0gsa0JBQWtCLENBQUNoSCxJQUFuQixFQUE1QztBQUNBLE9BRkQsTUFFTztBQUNOLFlBQUs3RixDQUFDLENBQUVKLFlBQVksQ0FBQ2tMLG1CQUFmLENBQUQsQ0FBc0MvRyxNQUEzQyxFQUFvRDtBQUNuRCxjQUFLOEksa0JBQWtCLENBQUM5SSxNQUF4QixFQUFpQztBQUNoQy9ELFlBQUFBLENBQUMsQ0FBRUosWUFBWSxDQUFDa0wsbUJBQWYsQ0FBRCxDQUFzQ2pGLElBQXRDLENBQTRDZ0gsa0JBQWtCLENBQUNoSCxJQUFuQixFQUE1QztBQUNBLFdBRkQsTUFFTyxJQUFLaUgsa0JBQWtCLENBQUMvSSxNQUF4QixFQUFpQztBQUN2Qy9ELFlBQUFBLENBQUMsQ0FBRUosWUFBWSxDQUFDa0wsbUJBQWYsQ0FBRCxDQUFzQ2pGLElBQXRDLENBQTRDaUgsa0JBQWtCLENBQUNqSCxJQUFuQixFQUE1QztBQUNBO0FBQ0QsU0FORCxNQU1PLElBQUs3RixDQUFDLENBQUVKLFlBQVksQ0FBQ21KLG1CQUFmLENBQUQsQ0FBc0NoRixNQUEzQyxFQUFvRDtBQUMxRCxjQUFLOEksa0JBQWtCLENBQUM5SSxNQUF4QixFQUFpQztBQUNoQy9ELFlBQUFBLENBQUMsQ0FBRUosWUFBWSxDQUFDbUosbUJBQWYsQ0FBRCxDQUFzQ2xELElBQXRDLENBQTRDZ0gsa0JBQWtCLENBQUNoSCxJQUFuQixFQUE1QztBQUNBLFdBRkQsTUFFTyxJQUFLaUgsa0JBQWtCLENBQUMvSSxNQUF4QixFQUFpQztBQUN2Qy9ELFlBQUFBLENBQUMsQ0FBRUosWUFBWSxDQUFDbUosbUJBQWYsQ0FBRCxDQUFzQ2xELElBQXRDLENBQTRDaUgsa0JBQWtCLENBQUNqSCxJQUFuQixFQUE1QztBQUNBO0FBQ0Q7QUFDRDs7QUFFRDZGLE1BQUFBLHFCQUFxQixDQUFFSyxLQUFGLENBQXJCO0FBQ0EsS0F4RkQ7QUF5RkEsR0Fuc0JzQyxDQXFzQnZDOzs7QUFDQSxXQUFTZ0IsVUFBVCxDQUFxQjVHLEdBQXJCLEVBQTJCO0FBQzFCLFFBQUk2RyxJQUFJLEdBQUcsRUFBWDtBQUFBLFFBQWVDLElBQWY7O0FBRUEsUUFBSyxPQUFPOUcsR0FBUCxLQUFlLFdBQXBCLEVBQWtDO0FBQ2pDQSxNQUFBQSxHQUFHLEdBQUd5RixNQUFNLENBQUNDLFFBQVAsQ0FBZ0JDLElBQXRCO0FBQ0E7O0FBRUQzRixJQUFBQSxHQUFHLEdBQUdBLEdBQUcsQ0FBQytHLFVBQUosQ0FBZ0IsS0FBaEIsRUFBdUIsR0FBdkIsQ0FBTjtBQUVBLFFBQU1DLE1BQU0sR0FBSWhILEdBQUcsQ0FBQ2lILEtBQUosQ0FBV2pILEdBQUcsQ0FBQ2tILE9BQUosQ0FBYSxHQUFiLElBQXFCLENBQWhDLEVBQW9DdkosS0FBcEMsQ0FBMkMsR0FBM0MsQ0FBaEI7QUFDQSxRQUFNd0osT0FBTyxHQUFHSCxNQUFNLENBQUNwSixNQUF2Qjs7QUFFQSxTQUFNLElBQUl3SixDQUFDLEdBQUcsQ0FBZCxFQUFpQkEsQ0FBQyxHQUFHRCxPQUFyQixFQUE4QkMsQ0FBQyxFQUEvQixFQUFvQztBQUNuQ04sTUFBQUEsSUFBSSxHQUFHRSxNQUFNLENBQUVJLENBQUYsQ0FBTixDQUFZekosS0FBWixDQUFtQixHQUFuQixDQUFQO0FBRUFrSixNQUFBQSxJQUFJLENBQUVDLElBQUksQ0FBRSxDQUFGLENBQU4sQ0FBSixHQUFvQkEsSUFBSSxDQUFFLENBQUYsQ0FBeEI7QUFDQTs7QUFFRCxXQUFPRCxJQUFQO0FBQ0EsR0F6dEJzQyxDQTJ0QnZDOzs7QUFDQSxXQUFTUSxhQUFULEdBQXlCO0FBQ3hCLFFBQUlySCxHQUFHLEdBQWtCeUYsTUFBTSxDQUFDQyxRQUFQLENBQWdCQyxJQUF6QztBQUNBLFFBQU0yQixNQUFNLEdBQWFWLFVBQVUsQ0FBRTVHLEdBQUYsQ0FBbkM7QUFDQSxRQUFNdUgsZ0JBQWdCLEdBQUd0TixRQUFRLENBQUUrRixHQUFHLENBQUNsRCxPQUFKLENBQWEsa0JBQWIsRUFBaUMsSUFBakMsQ0FBRixDQUFqQzs7QUFFQSxRQUFLeUssZ0JBQUwsRUFBd0I7QUFDdkIsVUFBS0EsZ0JBQWdCLEdBQUcsQ0FBeEIsRUFBNEI7QUFDM0J2SCxRQUFBQSxHQUFHLEdBQUdBLEdBQUcsQ0FBQ2xELE9BQUosQ0FBYSxhQUFiLEVBQTRCLFFBQTVCLENBQU47QUFDQTtBQUNELEtBSkQsTUFJTyxJQUFLLE9BQU93SyxNQUFNLENBQUUsT0FBRixDQUFiLEtBQTZCLFdBQWxDLEVBQWdEO0FBQ3RELFVBQU1FLG1CQUFtQixHQUFHdk4sUUFBUSxDQUFFcU4sTUFBTSxDQUFFLE9BQUYsQ0FBUixDQUFwQzs7QUFFQSxVQUFLRSxtQkFBbUIsR0FBRyxDQUEzQixFQUErQjtBQUM5QnhILFFBQUFBLEdBQUcsR0FBR0EsR0FBRyxDQUFDbEQsT0FBSixDQUFhLFdBQVcwSyxtQkFBeEIsRUFBNkMsU0FBN0MsQ0FBTjtBQUNBO0FBQ0Q7O0FBRUQsV0FBT3hILEdBQVA7QUFDQSxHQTl1QnNDLENBZ3ZCdkM7OztBQUNBLFdBQVNpQiwwQkFBVCxDQUFxQ3dHLEdBQXJDLEVBQTBDQyxLQUExQyxFQUFpREMsV0FBakQsRUFBOEQzSCxHQUE5RCxFQUFvRTtBQUNuRSxRQUFLLE9BQU8ySCxXQUFQLEtBQXVCLFdBQTVCLEVBQTBDO0FBQ3pDQSxNQUFBQSxXQUFXLEdBQUcsSUFBZDtBQUNBOztBQUVELFFBQUssT0FBTzNILEdBQVAsS0FBZSxXQUFwQixFQUFrQztBQUNqQ0EsTUFBQUEsR0FBRyxHQUFHcUgsYUFBYSxFQUFuQjtBQUNBOztBQUVELFFBQU1PLEVBQUUsR0FBVSxJQUFJQyxNQUFKLENBQVksV0FBV0osR0FBWCxHQUFpQixXQUE3QixFQUEwQyxHQUExQyxDQUFsQjtBQUNBLFFBQU1LLFNBQVMsR0FBRzlILEdBQUcsQ0FBQ2tILE9BQUosQ0FBYSxHQUFiLE1BQXVCLENBQUMsQ0FBeEIsR0FBNEIsR0FBNUIsR0FBa0MsR0FBcEQ7QUFDQSxRQUFJYSxZQUFKOztBQUVBLFFBQUsvSCxHQUFHLENBQUNnSSxLQUFKLENBQVdKLEVBQVgsQ0FBTCxFQUF1QjtBQUN0QkcsTUFBQUEsWUFBWSxHQUFHL0gsR0FBRyxDQUFDbEQsT0FBSixDQUFhOEssRUFBYixFQUFpQixPQUFPSCxHQUFQLEdBQWEsR0FBYixHQUFtQkMsS0FBbkIsR0FBMkIsSUFBNUMsQ0FBZjtBQUNBLEtBRkQsTUFFTztBQUNOSyxNQUFBQSxZQUFZLEdBQUcvSCxHQUFHLEdBQUc4SCxTQUFOLEdBQWtCTCxHQUFsQixHQUF3QixHQUF4QixHQUE4QkMsS0FBN0M7QUFDQTs7QUFFRCxRQUFLQyxXQUFXLEtBQUssSUFBckIsRUFBNEI7QUFDM0IsYUFBT3ZHLE9BQU8sQ0FBQ0MsU0FBUixDQUFtQixFQUFuQixFQUF1QixFQUF2QixFQUEyQjBHLFlBQTNCLENBQVA7QUFDQSxLQUZELE1BRU87QUFDTixhQUFPQSxZQUFQO0FBQ0E7QUFDRCxHQXp3QnNDLENBMndCdkM7OztBQUNBLFdBQVM1RywwQkFBVCxDQUFxQ2hHLFNBQXJDLEVBQWdENkUsR0FBaEQsRUFBc0Q7QUFDckQsUUFBSyxPQUFPQSxHQUFQLEtBQWUsV0FBcEIsRUFBa0M7QUFDakNBLE1BQUFBLEdBQUcsR0FBR3FILGFBQWEsRUFBbkI7QUFDQTs7QUFFRCxRQUFNWSxTQUFTLEdBQVdyQixVQUFVLENBQUU1RyxHQUFGLENBQXBDO0FBQ0EsUUFBTWtJLGVBQWUsR0FBS0MsTUFBTSxDQUFDQyxJQUFQLENBQWFILFNBQWIsRUFBeUJySyxNQUFuRDtBQUNBLFFBQU15SyxhQUFhLEdBQU9ySSxHQUFHLENBQUNrSCxPQUFKLENBQWEsR0FBYixDQUExQjtBQUNBLFFBQU1vQixpQkFBaUIsR0FBR3RJLEdBQUcsQ0FBQ2tILE9BQUosQ0FBYS9MLFNBQWIsQ0FBMUI7QUFDQSxRQUFJb04sUUFBSixFQUFjQyxVQUFkOztBQUVBLFFBQUtOLGVBQWUsR0FBRyxDQUF2QixFQUEyQjtBQUMxQixVQUFPSSxpQkFBaUIsR0FBR0QsYUFBdEIsR0FBd0MsQ0FBN0MsRUFBaUQ7QUFDaERFLFFBQUFBLFFBQVEsR0FBR3ZJLEdBQUcsQ0FBQ2xELE9BQUosQ0FBYSxNQUFNM0IsU0FBTixHQUFrQixHQUFsQixHQUF3QjhNLFNBQVMsQ0FBRTlNLFNBQUYsQ0FBOUMsRUFBNkQsRUFBN0QsQ0FBWDtBQUNBLE9BRkQsTUFFTztBQUNOb04sUUFBQUEsUUFBUSxHQUFHdkksR0FBRyxDQUFDbEQsT0FBSixDQUFhM0IsU0FBUyxHQUFHLEdBQVosR0FBa0I4TSxTQUFTLENBQUU5TSxTQUFGLENBQTNCLEdBQTJDLEdBQXhELEVBQTZELEVBQTdELENBQVg7QUFDQTs7QUFFRCxVQUFNc04sU0FBUyxHQUFHRixRQUFRLENBQUM1SyxLQUFULENBQWdCLEdBQWhCLENBQWxCO0FBQ0E2SyxNQUFBQSxVQUFVLEdBQVEsTUFBTUMsU0FBUyxDQUFFLENBQUYsQ0FBakM7QUFDQSxLQVRELE1BU087QUFDTkQsTUFBQUEsVUFBVSxHQUFHeEksR0FBRyxDQUFDbEQsT0FBSixDQUFhLE1BQU0zQixTQUFOLEdBQWtCLEdBQWxCLEdBQXdCOE0sU0FBUyxDQUFFOU0sU0FBRixDQUE5QyxFQUE2RCxFQUE3RCxDQUFiO0FBQ0E7O0FBRUQsV0FBT3FOLFVBQVA7QUFDQSxHQXJ5QnNDLENBdXlCdkM7OztBQUNBLFdBQVNFLGNBQVQsQ0FBeUJ2TixTQUF6QixFQUFvQzBGLFdBQXBDLEVBQThFO0FBQUEsUUFBN0I4SCxhQUE2Qix1RUFBYixLQUFhO0FBQUEsUUFBTjNJLEdBQU07QUFDN0UsUUFBTTRJLGNBQWMsR0FBRyxHQUF2QjtBQUVBLFFBQUl0QixNQUFKO0FBQUEsUUFBWXVCLFVBQVo7QUFBQSxRQUF3QkMsVUFBVSxHQUFHLEtBQXJDOztBQUVBLFFBQUssT0FBTzlJLEdBQVAsS0FBZSxXQUFwQixFQUFrQztBQUNqQ3NILE1BQUFBLE1BQU0sR0FBR1YsVUFBVSxDQUFFNUcsR0FBRixDQUFuQjtBQUNBLEtBRkQsTUFFTztBQUNOc0gsTUFBQUEsTUFBTSxHQUFHVixVQUFVLEVBQW5CO0FBQ0E7O0FBRUQsUUFBSyxPQUFPVSxNQUFNLENBQUVuTSxTQUFGLENBQWIsSUFBOEIsV0FBbkMsRUFBaUQ7QUFDaEQsVUFBTTROLFVBQVUsR0FBUXpCLE1BQU0sQ0FBRW5NLFNBQUYsQ0FBOUI7QUFDQSxVQUFNNk4sZUFBZSxHQUFHRCxVQUFVLENBQUNwTCxLQUFYLENBQWtCaUwsY0FBbEIsQ0FBeEI7O0FBRUEsVUFBS0csVUFBVSxDQUFDbkwsTUFBWCxHQUFvQixDQUF6QixFQUE2QjtBQUM1QixZQUFNcUwsS0FBSyxHQUFHcFAsQ0FBQyxDQUFDcVAsT0FBRixDQUFXckksV0FBWCxFQUF3Qm1JLGVBQXhCLENBQWQ7O0FBRUEsWUFBS0MsS0FBSyxJQUFJLENBQWQsRUFBa0I7QUFDakI7QUFDQUQsVUFBQUEsZUFBZSxDQUFDRyxNQUFoQixDQUF3QkYsS0FBeEIsRUFBK0IsQ0FBL0I7O0FBRUEsY0FBS0QsZUFBZSxDQUFDcEwsTUFBaEIsS0FBMkIsQ0FBaEMsRUFBb0M7QUFDbkNrTCxZQUFBQSxVQUFVLEdBQUcsSUFBYjtBQUNBO0FBQ0QsU0FQRCxNQU9PO0FBQ047QUFDQUUsVUFBQUEsZUFBZSxDQUFDSSxJQUFoQixDQUFzQnZJLFdBQXRCO0FBQ0E7O0FBRUQsWUFBS21JLGVBQWUsQ0FBQ3BMLE1BQWhCLEdBQXlCLENBQTlCLEVBQWtDO0FBQ2pDaUwsVUFBQUEsVUFBVSxHQUFHRyxlQUFlLENBQUNsTCxJQUFoQixDQUFzQjhLLGNBQXRCLENBQWI7QUFDQSxTQUZELE1BRU87QUFDTkMsVUFBQUEsVUFBVSxHQUFHRyxlQUFiO0FBQ0E7QUFDRCxPQXBCRCxNQW9CTztBQUNOSCxRQUFBQSxVQUFVLEdBQUdoSSxXQUFiO0FBQ0E7QUFDRCxLQTNCRCxNQTJCTztBQUNOZ0ksTUFBQUEsVUFBVSxHQUFHaEksV0FBYjtBQUNBLEtBeEM0RSxDQTBDN0U7OztBQUNBLFFBQUssQ0FBRWlJLFVBQVAsRUFBb0I7QUFDbkI3SCxNQUFBQSwwQkFBMEIsQ0FBRTlGLFNBQUYsRUFBYTBOLFVBQWIsQ0FBMUI7QUFDQSxLQUZELE1BRU87QUFDTixVQUFNM0gsS0FBSyxHQUFHQywwQkFBMEIsQ0FBRWhHLFNBQUYsQ0FBeEM7QUFDQWlHLE1BQUFBLE9BQU8sQ0FBQ0MsU0FBUixDQUFtQixFQUFuQixFQUF1QixFQUF2QixFQUEyQkgsS0FBM0I7QUFDQTs7QUFFREksSUFBQUEsY0FBYyxDQUFFcUgsYUFBRixDQUFkO0FBQ0E7O0FBRUQsV0FBU1UsWUFBVCxDQUF1QmxPLFNBQXZCLEVBQWtDMEYsV0FBbEMsRUFBZ0Q7QUFDL0MsUUFBTXlHLE1BQU0sR0FBR1YsVUFBVSxFQUF6QjtBQUNBLFFBQUkxRixLQUFKOztBQUVBLFFBQUssT0FBT29HLE1BQU0sQ0FBRW5NLFNBQUYsQ0FBYixLQUErQixXQUEvQixJQUE4Q21NLE1BQU0sQ0FBRW5NLFNBQUYsQ0FBTixLQUF3QjBGLFdBQTNFLEVBQXlGO0FBQ3hGSyxNQUFBQSxLQUFLLEdBQUdDLDBCQUEwQixDQUFFaEcsU0FBRixDQUFsQztBQUNBLEtBRkQsTUFFTztBQUNOK0YsTUFBQUEsS0FBSyxHQUFHRCwwQkFBMEIsQ0FBRTlGLFNBQUYsRUFBYTBGLFdBQWIsRUFBMEIsS0FBMUIsQ0FBbEM7QUFDQSxLQVI4QyxDQVUvQzs7O0FBQ0FPLElBQUFBLE9BQU8sQ0FBQ0MsU0FBUixDQUFtQixFQUFuQixFQUF1QixFQUF2QixFQUEyQkgsS0FBM0I7QUFFQUksSUFBQUEsY0FBYztBQUNkLEdBMzJCc0MsQ0E2MkJ2Qzs7O0FBQ0EsTUFBSzdILFlBQVksQ0FBQzZQLDBCQUFiLElBQTJDN1AsWUFBWSxDQUFDOFAsb0JBQTdELEVBQW9GO0FBQ25GLFFBQU0xRSxVQUFVLEdBQUdoTCxDQUFDLENBQUVKLFlBQVksQ0FBQ21KLG1CQUFmLENBQXBCO0FBQ0EsUUFBTUQsUUFBUSxHQUFLbEosWUFBWSxDQUFDOFAsb0JBQWIsR0FBb0MsSUFBdkQsQ0FGbUYsQ0FJbkY7O0FBQ0EsUUFBSzFFLFVBQVUsQ0FBQ2pILE1BQWhCLEVBQXlCO0FBQ3hCaUgsTUFBQUEsVUFBVSxDQUFDOUksRUFBWCxDQUFlLE9BQWYsRUFBd0I0RyxRQUF4QixFQUFrQyxVQUFVTCxDQUFWLEVBQWM7QUFDL0NBLFFBQUFBLENBQUMsQ0FBQ2pDLGNBQUY7QUFFQSxZQUFNcUYsUUFBUSxHQUFHN0wsQ0FBQyxDQUFFLElBQUYsQ0FBRCxDQUFVbUIsSUFBVixDQUFnQixNQUFoQixDQUFqQjtBQUVBb0csUUFBQUEsT0FBTyxDQUFDQyxTQUFSLENBQW1CLEVBQW5CLEVBQXVCLEVBQXZCLEVBQTJCcUUsUUFBM0I7QUFFQXBFLFFBQUFBLGNBQWM7QUFDZCxPQVJEO0FBU0E7QUFDRCxHQTkzQnNDLENBZzRCdkM7OztBQUNBLFdBQVNrSSxtQkFBVCxDQUE4QnZMLEtBQTlCLEVBQXFDNEMsV0FBckMsRUFBbUQ7QUFDbEQsUUFBTS9GLE1BQU0sR0FBV21ELEtBQUssQ0FBQzBDLE9BQU4sQ0FBZSxzQkFBZixDQUF2QjtBQUNBLFFBQU1rRixPQUFPLEdBQVUvSyxNQUFNLENBQUNFLElBQVAsQ0FBYSxTQUFiLENBQXZCO0FBQ0EsUUFBTXlPLFNBQVMsR0FBUXJQLE1BQU0sQ0FBRXlMLE9BQUYsQ0FBN0I7QUFDQSxRQUFNMUssU0FBUyxHQUFRc08sU0FBUyxDQUFDdE8sU0FBakM7QUFDQSxRQUFNQyxjQUFjLEdBQUdxTyxTQUFTLENBQUNyTyxjQUFqQzs7QUFFQSxRQUFLLENBQUVELFNBQVAsRUFBbUI7QUFDbEI7QUFDQTs7QUFFRCxRQUFLLENBQUUwRixXQUFXLENBQUNqRCxNQUFuQixFQUE0QjtBQUMzQixVQUFNc0QsS0FBSyxHQUFHQywwQkFBMEIsQ0FBRWhHLFNBQUYsQ0FBeEM7QUFDQWlHLE1BQUFBLE9BQU8sQ0FBQ0MsU0FBUixDQUFtQixFQUFuQixFQUF1QixFQUF2QixFQUEyQkgsS0FBM0I7QUFFQUksTUFBQUEsY0FBYztBQUVkO0FBQ0E7O0FBRUQsUUFBS2xHLGNBQUwsRUFBc0I7QUFDckJzTixNQUFBQSxjQUFjLENBQUV2TixTQUFGLEVBQWEwRixXQUFiLENBQWQ7QUFDQSxLQUZELE1BRU87QUFDTndJLE1BQUFBLFlBQVksQ0FBRWxPLFNBQUYsRUFBYTBGLFdBQWIsQ0FBWjtBQUNBO0FBQ0Q7O0FBRUQsV0FBU2YsYUFBVCxDQUF3QkUsR0FBeEIsRUFBOEI7QUFDN0IsUUFBSyxDQUFFQSxHQUFQLEVBQWE7QUFDWjtBQUNBLEtBSDRCLENBSzdCO0FBRUE7QUFDQTs7QUFDQSxHQXI2QnNDLENBdTZCdkM7OztBQUNBdEYsRUFBQUEsZ0JBQWdCLENBQUNxQixFQUFqQixDQUNDLFFBREQsRUFFQyx5RUFGRCxFQUdDLFVBQVVxRSxLQUFWLEVBQWtCO0FBQ2pCQSxJQUFBQSxLQUFLLENBQUNDLGNBQU47QUFFQSxRQUFNcEMsS0FBSyxHQUFHcEUsQ0FBQyxDQUFFLElBQUYsQ0FBZjtBQUVBaUcsSUFBQUEsYUFBYSxDQUFFN0IsS0FBSyxDQUFDOEIsSUFBTixDQUFZLEtBQVosQ0FBRixDQUFiO0FBQ0EsR0FURixFQXg2QnVDLENBbzdCdkM7O0FBQ0FyRixFQUFBQSxnQkFBZ0IsQ0FBQ3FCLEVBQWpCLENBQXFCLE9BQXJCLEVBQThCLHlDQUE5QixFQUF5RSxVQUFVcUUsS0FBVixFQUFrQjtBQUMxRkEsSUFBQUEsS0FBSyxDQUFDQyxjQUFOO0FBRUEsUUFBTXBDLEtBQUssR0FBR3BFLENBQUMsQ0FBRSxJQUFGLENBQWY7QUFFQWlHLElBQUFBLGFBQWEsQ0FBRTdCLEtBQUssQ0FBQzhCLElBQU4sQ0FBWSxLQUFaLENBQUYsQ0FBYjtBQUNBLEdBTkQsRUFyN0J1QyxDQTY3QnZDOztBQUNBckYsRUFBQUEsZ0JBQWdCLENBQUNxQixFQUFqQixDQUFxQixRQUFyQixFQUErQixRQUEvQixFQUF5QyxVQUFVcUUsS0FBVixFQUFrQjtBQUMxREEsSUFBQUEsS0FBSyxDQUFDQyxjQUFOO0FBRUEsUUFBTXFKLE9BQU8sR0FBVTdQLENBQUMsQ0FBRSxJQUFGLENBQXhCO0FBQ0EsUUFBTTRGLE1BQU0sR0FBV2lLLE9BQU8sQ0FBQy9KLEdBQVIsRUFBdkI7QUFDQSxRQUFNZ0ssU0FBUyxHQUFRRCxPQUFPLENBQUMzSixJQUFSLENBQWMsS0FBZCxDQUF2QjtBQUNBLFFBQU02SixjQUFjLEdBQUdGLE9BQU8sQ0FBQzNKLElBQVIsQ0FBYyxrQkFBZCxDQUF2QjtBQUNBLFFBQUlDLEdBQUo7O0FBRUEsUUFBS1AsTUFBTSxDQUFDN0IsTUFBWixFQUFxQjtBQUNwQm9DLE1BQUFBLEdBQUcsR0FBRzJKLFNBQVMsQ0FBQzdNLE9BQVYsQ0FBbUIsSUFBbkIsRUFBeUIyQyxNQUFNLENBQUNvSyxRQUFQLEVBQXpCLENBQU47QUFDQSxLQUZELE1BRU87QUFDTjdKLE1BQUFBLEdBQUcsR0FBRzRKLGNBQU47QUFDQTs7QUFFRDlKLElBQUFBLGFBQWEsQ0FBRUUsR0FBRixDQUFiO0FBQ0EsR0FoQkQ7QUFrQkE7QUFDRDtBQUNBOztBQUNDLE1BQU04SixvQkFBb0IsR0FBRyxnRUFBN0IsQ0FuOUJ1QyxDQXE5QnZDOztBQUNBblAsRUFBQUEsd0JBQXdCLENBQUNvQixFQUF6QixDQUE2QixPQUE3QixFQUFzQytOLG9CQUF0QyxFQUE0RCxVQUFVMUosS0FBVixFQUFrQjtBQUM3RUEsSUFBQUEsS0FBSyxDQUFDQyxjQUFOO0FBRUEsUUFBTXBDLEtBQUssR0FBR3BFLENBQUMsQ0FBRSxJQUFGLENBQWY7QUFFQSxRQUFNa1EsWUFBWSxHQUFROUwsS0FBSyxDQUFDMEMsT0FBTixDQUFlLHFCQUFmLENBQTFCO0FBQ0EsUUFBTXJDLGFBQWEsR0FBT3lMLFlBQVksQ0FBQy9PLElBQWIsQ0FBbUIscUJBQW5CLENBQTFCO0FBQ0EsUUFBTXVELGFBQWEsR0FBT0MsVUFBVSxDQUFFdUwsWUFBWSxDQUFDL08sSUFBYixDQUFtQixzQkFBbkIsQ0FBRixDQUFwQztBQUNBLFFBQU15RCxhQUFhLEdBQU9ELFVBQVUsQ0FBRXVMLFlBQVksQ0FBQy9PLElBQWIsQ0FBbUIsc0JBQW5CLENBQUYsQ0FBcEM7QUFDQSxRQUFNMkQsYUFBYSxHQUFPb0wsWUFBWSxDQUFDL08sSUFBYixDQUFtQixxQkFBbkIsQ0FBMUI7QUFDQSxRQUFNNEQsaUJBQWlCLEdBQUdtTCxZQUFZLENBQUMvTyxJQUFiLENBQW1CLHlCQUFuQixDQUExQjtBQUNBLFFBQU02RCxnQkFBZ0IsR0FBSWtMLFlBQVksQ0FBQy9PLElBQWIsQ0FBbUIsd0JBQW5CLENBQTFCLENBWDZFLENBYTdFOztBQUNBaUYsSUFBQUEsWUFBWSxDQUFFaEMsS0FBSyxDQUFDOEIsSUFBTixDQUFZLE9BQVosQ0FBRixDQUFaOztBQUVBLGFBQVNpSyxRQUFULENBQW1CQyxVQUFuQixFQUFnQztBQUMvQixVQUFLM0wsYUFBTCxFQUFxQjtBQUNwQixlQUFPN0IsYUFBYSxDQUFFd04sVUFBRixFQUFjdEwsYUFBZCxFQUE2QkUsZ0JBQTdCLEVBQStDRCxpQkFBL0MsQ0FBcEI7QUFDQTs7QUFFRCxhQUFPcUwsVUFBUDtBQUNBOztBQUVEaE0sSUFBQUEsS0FBSyxDQUFDOEIsSUFBTixDQUFZLE9BQVosRUFBcUJHLFVBQVUsQ0FBRSxZQUFXO0FBQzNDakMsTUFBQUEsS0FBSyxDQUFDa0MsVUFBTixDQUFrQixPQUFsQjtBQUVBLFVBQUlyQixRQUFRLEdBQUdOLFVBQVUsQ0FBRXVMLFlBQVksQ0FBQzdPLElBQWIsQ0FBbUIsWUFBbkIsRUFBa0N5RSxHQUFsQyxFQUFGLENBQXpCO0FBQ0EsVUFBSVosUUFBUSxHQUFHUCxVQUFVLENBQUV1TCxZQUFZLENBQUM3TyxJQUFiLENBQW1CLFlBQW5CLEVBQWtDeUUsR0FBbEMsRUFBRixDQUF6QixDQUoyQyxDQU0zQzs7QUFDQSxVQUFLdUssS0FBSyxDQUFFcEwsUUFBRixDQUFWLEVBQXlCO0FBQ3hCQSxRQUFBQSxRQUFRLEdBQUdQLGFBQVg7QUFFQXdMLFFBQUFBLFlBQVksQ0FBQzdPLElBQWIsQ0FBbUIsWUFBbkIsRUFBa0N5RSxHQUFsQyxDQUF1Q3FLLFFBQVEsQ0FBRWxMLFFBQUYsQ0FBL0M7QUFDQSxPQUpELE1BSU87QUFDTmlMLFFBQUFBLFlBQVksQ0FBQzdPLElBQWIsQ0FBbUIsWUFBbkIsRUFBa0N5RSxHQUFsQyxDQUF1Q3FLLFFBQVEsQ0FBRWxMLFFBQUYsQ0FBL0M7QUFDQSxPQWIwQyxDQWUzQzs7O0FBQ0EsVUFBS29MLEtBQUssQ0FBRW5MLFFBQUYsQ0FBVixFQUF5QjtBQUN4QkEsUUFBQUEsUUFBUSxHQUFHTixhQUFYO0FBRUFzTCxRQUFBQSxZQUFZLENBQUM3TyxJQUFiLENBQW1CLFlBQW5CLEVBQWtDeUUsR0FBbEMsQ0FBdUNxSyxRQUFRLENBQUVqTCxRQUFGLENBQS9DO0FBQ0EsT0FKRCxNQUlPO0FBQ05nTCxRQUFBQSxZQUFZLENBQUM3TyxJQUFiLENBQW1CLFlBQW5CLEVBQWtDeUUsR0FBbEMsQ0FBdUNxSyxRQUFRLENBQUVqTCxRQUFGLENBQS9DO0FBQ0EsT0F0QjBDLENBd0IzQzs7O0FBQ0EsVUFBS0QsUUFBUSxHQUFHUCxhQUFoQixFQUFnQztBQUMvQk8sUUFBQUEsUUFBUSxHQUFHUCxhQUFYO0FBRUF3TCxRQUFBQSxZQUFZLENBQUM3TyxJQUFiLENBQW1CLFlBQW5CLEVBQWtDeUUsR0FBbEMsQ0FBdUNxSyxRQUFRLENBQUVsTCxRQUFGLENBQS9DO0FBQ0EsT0E3QjBDLENBK0IzQzs7O0FBQ0EsVUFBS0EsUUFBUSxHQUFHTCxhQUFoQixFQUFnQztBQUMvQkssUUFBQUEsUUFBUSxHQUFHTCxhQUFYO0FBRUFzTCxRQUFBQSxZQUFZLENBQUM3TyxJQUFiLENBQW1CLFlBQW5CLEVBQWtDeUUsR0FBbEMsQ0FBdUNxSyxRQUFRLENBQUVsTCxRQUFGLENBQS9DO0FBQ0EsT0FwQzBDLENBc0MzQzs7O0FBQ0EsVUFBS0MsUUFBUSxHQUFHTixhQUFoQixFQUFnQztBQUMvQk0sUUFBQUEsUUFBUSxHQUFHTixhQUFYO0FBRUFzTCxRQUFBQSxZQUFZLENBQUM3TyxJQUFiLENBQW1CLFlBQW5CLEVBQWtDeUUsR0FBbEMsQ0FBdUNxSyxRQUFRLENBQUVqTCxRQUFGLENBQS9DO0FBQ0EsT0EzQzBDLENBNkMzQzs7O0FBQ0EsVUFBS0QsUUFBUSxHQUFHQyxRQUFoQixFQUEyQjtBQUMxQkEsUUFBQUEsUUFBUSxHQUFHRCxRQUFYO0FBRUFpTCxRQUFBQSxZQUFZLENBQUM3TyxJQUFiLENBQW1CLFlBQW5CLEVBQWtDeUUsR0FBbEMsQ0FBdUNxSyxRQUFRLENBQUVqTCxRQUFGLENBQS9DO0FBQ0E7O0FBRUQsVUFBS0QsUUFBUSxLQUFLUCxhQUFiLElBQThCUSxRQUFRLEtBQUtOLGFBQWhELEVBQWdFO0FBQy9EO0FBQ0FxQixRQUFBQSxhQUFhLENBQUVpSyxZQUFZLENBQUNoSyxJQUFiLENBQW1CLGtCQUFuQixDQUFGLENBQWI7QUFDQSxPQUhELE1BR087QUFDTjtBQUNBLFlBQU1DLEdBQUcsR0FBRytKLFlBQVksQ0FBQ2hLLElBQWIsQ0FBbUIsS0FBbkIsRUFBMkJqRCxPQUEzQixDQUFvQyxLQUFwQyxFQUEyQ2dDLFFBQTNDLEVBQXNEaEMsT0FBdEQsQ0FBK0QsS0FBL0QsRUFBc0VpQyxRQUF0RSxDQUFaO0FBQ0FlLFFBQUFBLGFBQWEsQ0FBRUUsR0FBRixDQUFiO0FBQ0E7QUFDRCxLQTVEOEIsRUE0RDVCN0YsS0E1RDRCLENBQS9CO0FBNkRBLEdBckZELEVBdDlCdUMsQ0E2aUN2Qzs7QUFDQU8sRUFBQUEsZ0JBQWdCLENBQUNxQixFQUFqQixDQUFxQixPQUFyQixFQUE4Qiw0Q0FBOUIsRUFBNEUsVUFBVXFFLEtBQVYsRUFBa0I7QUFDN0ZBLElBQUFBLEtBQUssQ0FBQ0MsY0FBTjtBQUVBLFFBQU1wQyxLQUFLLEdBQVNwRSxDQUFDLENBQUUsSUFBRixDQUFyQjtBQUNBLFFBQU1zQixTQUFTLEdBQUs4QyxLQUFLLENBQUNqRCxJQUFOLENBQVksaUJBQVosQ0FBcEI7QUFDQSxRQUFNNkYsV0FBVyxHQUFHNUMsS0FBSyxDQUFDakQsSUFBTixDQUFZLFlBQVosQ0FBcEI7QUFFQTBOLElBQUFBLGNBQWMsQ0FBRXZOLFNBQUYsRUFBYTBGLFdBQWIsRUFBMEIsSUFBMUIsQ0FBZDtBQUNBLEdBUkQ7O0FBVUEsV0FBU3NKLFlBQVQsQ0FBdUJDLE9BQXZCLEVBQWlDO0FBQ2hDLFFBQU1DLFdBQVcsR0FBR0QsT0FBTyxDQUFDcFAsSUFBUixDQUFjLFdBQWQsQ0FBcEI7O0FBRUEsUUFBSyxDQUFFcVAsV0FBUCxFQUFxQjtBQUNwQjtBQUNBOztBQUVELFFBQU1DLFVBQVUsR0FBR0QsV0FBVyxDQUFDMU0sS0FBWixDQUFtQixHQUFuQixDQUFuQjs7QUFFQSxRQUFJdUQsS0FBSyxHQUFHLEVBQVo7QUFFQXJILElBQUFBLENBQUMsQ0FBQ2dCLElBQUYsQ0FBUXlQLFVBQVIsRUFBb0IsVUFBVWxELENBQVYsRUFBYWpNLFNBQWIsRUFBeUI7QUFDNUMsVUFBSytGLEtBQUwsRUFBYTtBQUNaQSxRQUFBQSxLQUFLLEdBQUdDLDBCQUEwQixDQUFFaEcsU0FBRixFQUFhK0YsS0FBYixDQUFsQztBQUNBLE9BRkQsTUFFTztBQUNOQSxRQUFBQSxLQUFLLEdBQUdDLDBCQUEwQixDQUFFaEcsU0FBRixDQUFsQztBQUNBO0FBQ0QsS0FORCxFQVhnQyxDQW1CaEM7QUFDQTs7QUFDQSxRQUFLLENBQUUrRixLQUFQLEVBQWU7QUFDZCxVQUFNcUosT0FBTyxHQUFHOUUsTUFBTSxDQUFDQyxRQUFQLENBQWdCQyxJQUFoQztBQUNBLFVBQU02RSxNQUFNLEdBQUlELE9BQU8sQ0FBQzVNLEtBQVIsQ0FBZSxHQUFmLENBQWhCO0FBRUF1RCxNQUFBQSxLQUFLLEdBQUdzSixNQUFNLENBQUUsQ0FBRixDQUFkO0FBQ0E7O0FBRURwSixJQUFBQSxPQUFPLENBQUNDLFNBQVIsQ0FBbUIsRUFBbkIsRUFBdUIsRUFBdkIsRUFBMkJILEtBQTNCO0FBRUFJLElBQUFBLGNBQWMsQ0FBRSxJQUFGLENBQWQ7QUFDQSxHQXZsQ3NDLENBeWxDdkM7OztBQUNBeEgsRUFBQUEsS0FBSyxDQUFDaUMsRUFBTixDQUFVLHFCQUFWLEVBQWlDLFVBQVV1RyxDQUFWLEVBQWE4SCxPQUFiLEVBQXVCO0FBQ3ZERCxJQUFBQSxZQUFZLENBQUVDLE9BQUYsQ0FBWjtBQUNBLEdBRkQ7QUFJQXRRLEVBQUFBLEtBQUssQ0FBQ2lDLEVBQU4sQ0FBVSxPQUFWLEVBQW1CLDBCQUFuQixFQUErQyxZQUFXO0FBQ3pELFFBQU1xTyxPQUFPLEdBQUd2USxDQUFDLENBQUUsSUFBRixDQUFqQjtBQUVBc1EsSUFBQUEsWUFBWSxDQUFFQyxPQUFGLENBQVo7QUFDQSxHQUpEO0FBTUExUCxFQUFBQSxnQkFBZ0IsQ0FBQ3FCLEVBQWpCLENBQXFCLE9BQXJCLEVBQThCLDBCQUE5QixFQUEwRCxVQUFVcUUsS0FBVixFQUFrQjtBQUMzRUEsSUFBQUEsS0FBSyxDQUFDQyxjQUFOO0FBRUEsUUFBTStKLE9BQU8sR0FBR3ZRLENBQUMsQ0FBRSxJQUFGLENBQWpCO0FBRUFDLElBQUFBLEtBQUssQ0FBQzhGLE9BQU4sQ0FBZSxxQkFBZixFQUFzQyxDQUFFd0ssT0FBRixDQUF0QztBQUNBLEdBTkQ7QUFRQTNQLEVBQUFBLG1CQUFtQixDQUFDc0IsRUFBcEIsQ0FBd0Isb0JBQXhCLEVBQThDLFlBQVc7QUFDeEQsUUFBTWpCLE1BQU0sR0FBTWpCLENBQUMsQ0FBRSxJQUFGLENBQW5CO0FBQ0EsUUFBTWdNLE9BQU8sR0FBSy9LLE1BQU0sQ0FBQ0UsSUFBUCxDQUFhLFNBQWIsQ0FBbEI7QUFDQSxRQUFNeU8sU0FBUyxHQUFHclAsTUFBTSxDQUFFeUwsT0FBRixDQUF4QjtBQUNBLFFBQU0xSyxTQUFTLEdBQUdzTyxTQUFTLENBQUN0TyxTQUE1QjtBQUVBLFFBQU0rRixLQUFLLEdBQUdDLDBCQUEwQixDQUFFaEcsU0FBRixDQUF4QztBQUNBaUcsSUFBQUEsT0FBTyxDQUFDQyxTQUFSLENBQW1CLEVBQW5CLEVBQXVCLEVBQXZCLEVBQTJCSCxLQUEzQjtBQUVBSSxJQUFBQSxjQUFjLENBQUUsSUFBRixDQUFkO0FBQ0EsR0FWRCxFQTVtQ3VDLENBd25DdkM7O0FBQ0EsTUFBS3pILENBQUMsQ0FBRUosWUFBWSxDQUFDbUosbUJBQWYsQ0FBRCxDQUFzQ2hGLE1BQXRDLElBQWdEL0QsQ0FBQyxDQUFFSixZQUFZLENBQUNrTCxtQkFBZixDQUFELENBQXNDL0csTUFBM0YsRUFBb0c7QUFDbkcsUUFBS25FLFlBQVksQ0FBQ2dSLHVDQUFsQixFQUE0RDtBQUMzRDVRLE1BQUFBLENBQUMsQ0FBRTRMLE1BQUYsQ0FBRCxDQUFZaUYsSUFBWixDQUFrQixVQUFsQixFQUE4QixZQUFXO0FBQ3hDcEosUUFBQUEsY0FBYyxDQUFFLElBQUYsQ0FBZDtBQUNBLE9BRkQ7QUFHQTtBQUNELEdBL25Dc0MsQ0Fpb0N2Qzs7O0FBQ0F4SCxFQUFBQSxLQUFLLENBQUNpQyxFQUFOLENBQVUsMkJBQVYsRUFBdUMsVUFBVXVHLENBQVYsRUFBYWtELGFBQWIsRUFBNkI7QUFDbkVsRSxJQUFBQSxjQUFjLENBQUVrRSxhQUFGLENBQWQ7QUFDQSxHQUZELEVBbG9DdUMsQ0Fzb0N2Qzs7QUFDQTFMLEVBQUFBLEtBQUssQ0FBQ2lDLEVBQU4sQ0FBVSxxQkFBVixFQUFpQyxZQUFXO0FBQzNDVixJQUFBQSxVQUFVO0FBQ1ZTLElBQUFBLHNCQUFzQjtBQUN0QmlDLElBQUFBLGNBQWM7QUFDZHdELElBQUFBLGNBQWM7QUFDZCxHQUxEO0FBT0E7QUFDRDtBQUNBOztBQUNDekgsRUFBQUEsS0FBSyxDQUFDaUMsRUFBTixDQUFVLCtCQUFWLEVBQTJDLFlBQVc7QUFDckQ7QUFDQWxDLElBQUFBLENBQUMsQ0FBRUYsUUFBRixDQUFELENBQWNpRyxPQUFkLENBQXVCLGlDQUF2QjtBQUNBLEdBSEQ7QUFJQSxDQXJwQ0QiLCJmaWxlIjoid2MtYWpheC1wcm9kdWN0LWZpbHRlci1wdWJsaWMtc2NyaXB0cy5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogVGhlIGZyb250ZW5kIGZpbHRlciBmb3JtLlxuICpcbiAqIEBzaW5jZSAgICAgIDMuMC4wXG4gKiBAcGFja2FnZSAgICB3Yy1hamF4LXByb2R1Y3QtZmlsdGVyXG4gKiBAc3VicGFja2FnZSB3Yy1hamF4LXByb2R1Y3QtZmlsdGVyL3B1YmxpYy9zcmMvanNcbiAqIEBhdXRob3IgICAgIHdwdG9vbHMuaW9cbiAqL1xuXG5jb25zdCB3Y2FwZl9wYXJhbXMgPSB3Y2FwZl9wYXJhbXMgfHwge1xuXHQnZmlsdGVyX2lucHV0X2RlbGF5JzogJycsXG5cdCdjaG9zZW5fbGliX3NlYXJjaF90aHJlc2hvbGQnOiAnJyxcblx0J3ByZXNlcnZlX2hpZXJhcmNoeV9hY2NvcmRpb25fc3RhdGUnOiAnJyxcblx0J2VuYWJsZV9hbmltYXRpb25fZm9yX2hpZXJhcmNoeV9hY2NvcmRpb24nOiAnJyxcblx0J2hpZXJhcmNoeV9hY2NvcmRpb25fYW5pbWF0aW9uX3NwZWVkJzogJycsXG5cdCdoaWVyYXJjaHlfYWNjb3JkaW9uX2FuaW1hdGlvbl9lYXNpbmcnOiAnJyxcblx0J2xvYWRpbmdfb3ZlcmxheV9vcHRpb25zJzogJycsXG5cdCdzY3JvbGxfdG9fdG9wX3NwZWVkJzogJycsXG5cdCdzY3JvbGxfdG9fdG9wX2Vhc2luZyc6ICcnLFxuXHQnaXNfbW9iaWxlJzogJycsXG5cdCdkaXNhYmxlX2lucHV0c193aGlsZV9mZXRjaGluZ19yZXN1bHRzJzogJycsXG5cdCdhcHBseV9maWx0ZXJzX29uX2Jyb3dzZXJfaGlzdG9yeV9jaGFuZ2UnOiAnJyxcblx0J3Nob3BfbG9vcF9jb250YWluZXInOiAnJyxcblx0J25vdF9mb3VuZF9jb250YWluZXInOiAnJyxcblx0J2VuYWJsZV9wYWdpbmF0aW9uX3ZpYV9hamF4JzogJycsXG5cdCdwYWdpbmF0aW9uX2NvbnRhaW5lcic6ICcnLFxuXHQnc29ydGluZ19jb250cm9sJzogJycsXG5cdCdhdHRhY2hfY2hvc2VuX29uX3NvcnRpbmcnOiAnJyxcblx0J2xvYWRpbmdfYW5pbWF0aW9uJzogJycsXG5cdCdzY3JvbGxfd2luZG93JzogJycsXG5cdCdzY3JvbGxfd2luZG93X2Zvcic6ICcnLFxuXHQnc2Nyb2xsX3dpbmRvd193aGVuJzogJycsXG5cdCdzY3JvbGxfd2luZG93X2N1c3RvbV9lbGVtZW50JzogJycsXG5cdCdzY3JvbGxfdG9fdG9wX29mZnNldCc6ICcnLFxuXHQnZm9yX3ByZXZpZXcnOiAnJyxcbn07XG5cbmpRdWVyeSggZG9jdW1lbnQgKS5yZWFkeSggZnVuY3Rpb24oICQgKSB7XG5cblx0Y29uc3QgJGJvZHkgPSAkKCAnYm9keScgKTtcblxuXHRjb25zdCByYW5nZVZhbHVlc1NlcGFyYXRvciA9ICd+JztcblxuXHRjb25zdCBfZGVsYXkgPSBwYXJzZUludCggd2NhcGZfcGFyYW1zLmZpbHRlcl9pbnB1dF9kZWxheSApO1xuXHRjb25zdCBkZWxheSAgPSBfZGVsYXkgPj0gMCA/IF9kZWxheSA6IDgwMDtcblxuXHQvLyBTdG9yZSBmaWVsZHMnIGlkIGFuZCBmaWx0ZXIgaW5mb3JtYXRpb24uXG5cdGNvbnN0IGZpZWxkcyA9IHt9O1xuXG5cdGNvbnN0IHdjYXBmU2luZ2xlRmlsdGVyU2VsZWN0b3IgICAgICA9ICcud2NhcGYtc2luZ2xlLWZpbHRlcic7XG5cdGNvbnN0IHdjYXBmTmF2RmlsdGVyU2VsZWN0b3IgICAgICAgICA9ICcud2NhcGYtbmF2LWZpbHRlcic7XG5cdGNvbnN0IHdjYXBmTnVtYmVyUmFuZ2VGaWx0ZXJTZWxlY3RvciA9ICcud2NhcGYtbnVtYmVyLXJhbmdlLWZpbHRlcic7XG5cdGNvbnN0IHdjYXBmRGF0ZUZpbHRlclNlbGVjdG9yICAgICAgICA9ICcud2NhcGYtZGF0ZS1yYW5nZS1maWx0ZXInO1xuXG5cdGNvbnN0ICR3Y2FwZlNpbmdsZUZpbHRlcnMgICAgICA9ICQoIHdjYXBmU2luZ2xlRmlsdGVyU2VsZWN0b3IgKTtcblx0Y29uc3QgJHdjYXBmTmF2RmlsdGVycyAgICAgICAgID0gJCggd2NhcGZOYXZGaWx0ZXJTZWxlY3RvciApO1xuXHRjb25zdCAkd2NhcGZOdW1iZXJSYW5nZUZpbHRlcnMgPSAkKCB3Y2FwZk51bWJlclJhbmdlRmlsdGVyU2VsZWN0b3IgKTtcblx0Y29uc3QgJHdjYXBmRGF0ZUZpbHRlcnMgICAgICAgID0gJCggd2NhcGZEYXRlRmlsdGVyU2VsZWN0b3IgKTtcblxuXHQkd2NhcGZTaW5nbGVGaWx0ZXJzLmVhY2goIGZ1bmN0aW9uKCkge1xuXHRcdGNvbnN0ICRmaWVsZCAgICAgICAgID0gJCggdGhpcyApO1xuXHRcdGNvbnN0IGlkICAgICAgICAgICAgID0gJGZpZWxkLmF0dHIoICdkYXRhLWlkJyApO1xuXHRcdGNvbnN0ICR3cmFwcGVyICAgICAgID0gJGZpZWxkLmZpbmQoICcud2NhcGYtZmllbGQtaW5uZXIgPiBkaXYnICk7XG5cdFx0Y29uc3QgZmlsdGVyS2V5ICAgICAgPSAkd3JhcHBlci5hdHRyKCAnZGF0YS1maWx0ZXIta2V5JyApO1xuXHRcdGNvbnN0IG11bHRpcGxlRmlsdGVyID0gcGFyc2VJbnQoICR3cmFwcGVyLmF0dHIoICdkYXRhLW11bHRpcGxlLWZpbHRlcicgKSApO1xuXG5cdFx0ZmllbGRzWyBpZCBdID0ge1xuXHRcdFx0ZmlsdGVyS2V5OiBmaWx0ZXJLZXksXG5cdFx0XHRtdWx0aXBsZUZpbHRlcjogbXVsdGlwbGVGaWx0ZXJcblx0XHR9O1xuXHR9ICk7XG5cblx0Ly8gSW5pdGlhbGl6ZSBqUXVlcnkgY2hvc2VuIGxpYnJhcnkuXG5cdGZ1bmN0aW9uIGluaXRDaG9zZW4oKSB7XG5cdFx0aWYgKCAhIGpRdWVyeSgpLmNob3NlbiApIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHRsZXQgJHJvb3Q7XG5cblx0XHRpZiAoIHdjYXBmX3BhcmFtcy5mb3JfcHJldmlldyApIHtcblx0XHRcdCRyb290ID0gJCggd2NhcGZOYXZGaWx0ZXJTZWxlY3RvciApO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHQkcm9vdCA9ICR3Y2FwZk5hdkZpbHRlcnM7XG5cdFx0fVxuXG5cdFx0JHJvb3QuZmluZCggJy53Y2FwZi1jaG9zZW4tc2VsZWN0JyApLmVhY2goIGZ1bmN0aW9uKCkge1xuXHRcdFx0Y29uc3QgJHRoaXMgICA9ICQoIHRoaXMgKTtcblx0XHRcdGNvbnN0IG9wdGlvbnMgPSB7fTtcblxuXHRcdFx0Y29uc3Qgbm9SZXN1bHRzTWVzc2FnZSA9ICR0aGlzLmF0dHIoICdkYXRhLW5vLXJlc3VsdHMtbWVzc2FnZScgKTtcblxuXHRcdFx0aWYgKCBub1Jlc3VsdHNNZXNzYWdlICkge1xuXHRcdFx0XHRvcHRpb25zWyAnbm9fcmVzdWx0c190ZXh0JyBdID0gbm9SZXN1bHRzTWVzc2FnZTtcblx0XHRcdH1cblxuXHRcdFx0Y29uc3Qgc2VhcmNoVGhyZXNob2xkID0gcGFyc2VJbnQoIHdjYXBmX3BhcmFtcy5jaG9zZW5fbGliX3NlYXJjaF90aHJlc2hvbGQgKTtcblxuXHRcdFx0aWYgKCBzZWFyY2hUaHJlc2hvbGQgKSB7XG5cdFx0XHRcdC8vIG9wdGlvbnNbICdkaXNhYmxlX3NlYXJjaF90aHJlc2hvbGQnIF0gPSBzZWFyY2hUaHJlc2hvbGQ7XG5cdFx0XHR9XG5cblx0XHRcdC8vIG9wdGlvbnNbICdkaXNwbGF5X3NlbGVjdGVkX29wdGlvbnMnIF0gPSBmYWxzZTtcblxuXHRcdFx0Ly8gbWluaW11bVJlc3VsdHNGb3JTZWFyY2g6IDIwXG5cblx0XHRcdC8vIG9wdGlvbnNbJ21pbmltdW1SZXN1bHRzRm9yU2VhcmNoJ10gPSAtMTtcblxuXHRcdFx0JHRoaXMuY2hvc2VuKCBvcHRpb25zICk7XG5cdFx0fSApO1xuXHR9XG5cblx0aW5pdENob3NlbigpO1xuXG5cdC8vIEluaXRpYWxpemUgaGllcmFyY2h5IGFjY29yZGlvbi5cblx0ZnVuY3Rpb24gaW5pdEhpZXJhcmNoeUFjY29yZGlvbigpIHtcblx0XHRsZXQgJHJvb3Q7XG5cblx0XHRpZiAoIHdjYXBmX3BhcmFtcy5mb3JfcHJldmlldyApIHtcblx0XHRcdCRyb290ID0gJCggd2NhcGZOYXZGaWx0ZXJTZWxlY3RvciApO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHQkcm9vdCA9ICR3Y2FwZk5hdkZpbHRlcnM7XG5cdFx0fVxuXG5cdFx0JHJvb3QuZmluZCggJy5oaWVyYXJjaHktYWNjb3JkaW9uLXRvZ2dsZScgKS5vbiggJ2NsaWNrJywgZnVuY3Rpb24oKSB7XG5cdFx0XHRjb25zdCAkdGhpcyAgPSAkKCB0aGlzICk7XG5cdFx0XHRjb25zdCAkY2hpbGQgPSAkdGhpcy5wYXJlbnQoICdsaScgKS5jaGlsZHJlbiggJ3VsJyApO1xuXG5cdFx0XHQkdGhpcy50b2dnbGVDbGFzcyggJ2FjdGl2ZScgKTtcblxuXHRcdFx0aWYgKCB3Y2FwZl9wYXJhbXMuZW5hYmxlX2FuaW1hdGlvbl9mb3JfaGllcmFyY2h5X2FjY29yZGlvbiApIHtcblx0XHRcdFx0JGNoaWxkLnNsaWRlVG9nZ2xlKFxuXHRcdFx0XHRcdHdjYXBmX3BhcmFtcy5oaWVyYXJjaHlfYWNjb3JkaW9uX2FuaW1hdGlvbl9zcGVlZCxcblx0XHRcdFx0XHR3Y2FwZl9wYXJhbXMuaGllcmFyY2h5X2FjY29yZGlvbl9hbmltYXRpb25fZWFzaW5nXG5cdFx0XHRcdCk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHQkY2hpbGQudG9nZ2xlKCk7XG5cdFx0XHR9XG5cdFx0fSApO1xuXHR9XG5cblx0aW5pdEhpZXJhcmNoeUFjY29yZGlvbigpO1xuXG5cdC8qKlxuXHQgKiBAc291cmNlIGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vYS8zNDE0MTgxM1xuXHQgKlxuXHQgKiBAcGFyYW0gbnVtYmVyXG5cdCAqIEBwYXJhbSBkZWNpbWFsc1xuXHQgKiBAcGFyYW0gZGVjX3BvaW50XG5cdCAqIEBwYXJhbSB0aG91c2FuZHNfc2VwXG5cdCAqXG5cdCAqIEByZXR1cm5zIHtzdHJpbmd9XG5cdCAqL1xuXHRmdW5jdGlvbiBudW1iZXJfZm9ybWF0KCBudW1iZXIsIGRlY2ltYWxzLCBkZWNfcG9pbnQsIHRob3VzYW5kc19zZXAgKSB7XG5cdFx0Ly8gU3RyaXAgYWxsIGNoYXJhY3RlcnMgYnV0IG51bWVyaWNhbCBvbmVzLlxuXHRcdG51bWJlciA9ICggbnVtYmVyICsgJycgKS5yZXBsYWNlKCAvW15cXGQrXFwtRWUuXS9nLCAnJyApO1xuXG5cdFx0Y29uc3QgbiAgICA9ICEgaXNGaW5pdGUoICtudW1iZXIgKSA/IDAgOiArbnVtYmVyO1xuXHRcdGNvbnN0IHByZWMgPSAhIGlzRmluaXRlKCArZGVjaW1hbHMgKSA/IDAgOiBNYXRoLmFicyggZGVjaW1hbHMgKTtcblx0XHRjb25zdCBzZXAgID0gKCB0eXBlb2YgdGhvdXNhbmRzX3NlcCA9PT0gJ3VuZGVmaW5lZCcgKSA/ICcsJyA6IHRob3VzYW5kc19zZXA7XG5cdFx0Y29uc3QgZGVjICA9ICggdHlwZW9mIGRlY19wb2ludCA9PT0gJ3VuZGVmaW5lZCcgKSA/ICcuJyA6IGRlY19wb2ludDtcblxuXHRcdGxldCBzO1xuXG5cdFx0Y29uc3QgdG9GaXhlZEZpeCA9IGZ1bmN0aW9uKCBuLCBwcmVjICkge1xuXHRcdFx0Y29uc3QgayA9IE1hdGgucG93KCAxMCwgcHJlYyApO1xuXHRcdFx0cmV0dXJuICcnICsgTWF0aC5yb3VuZCggbiAqIGsgKSAvIGs7XG5cdFx0fTtcblxuXHRcdC8vIEZpeCBmb3IgSUUgcGFyc2VGbG9hdCgwLjU1KS50b0ZpeGVkKDApID0gMDtcblx0XHRzID0gKCBwcmVjID8gdG9GaXhlZEZpeCggbiwgcHJlYyApIDogJycgKyBNYXRoLnJvdW5kKCBuICkgKS5zcGxpdCggJy4nICk7XG5cblx0XHRpZiAoIHNbIDAgXS5sZW5ndGggPiAzICkge1xuXHRcdFx0c1sgMCBdID0gc1sgMCBdLnJlcGxhY2UoIC9cXEIoPz0oPzpcXGR7M30pKyg/IVxcZCkpL2csIHNlcCApO1xuXHRcdH1cblxuXHRcdGlmICggKCBzWyAxIF0gfHwgJycgKS5sZW5ndGggPCBwcmVjICkge1xuXHRcdFx0c1sgMSBdID0gc1sgMSBdIHx8ICcnO1xuXHRcdFx0c1sgMSBdICs9IG5ldyBBcnJheSggcHJlYyAtIHNbIDEgXS5sZW5ndGggKyAxICkuam9pbiggJzAnICk7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHMuam9pbiggZGVjICk7XG5cdH1cblxuXHQvLyBJbml0aWFsaXplIG5vVUlTbGlkZXIuXG5cdGZ1bmN0aW9uIGluaXROb1VJU2xpZGVyKCkge1xuXHRcdGlmICggJ3VuZGVmaW5lZCcgPT09IHR5cGVvZiBub1VpU2xpZGVyICkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdGxldCAkcm9vdDtcblxuXHRcdGlmICggd2NhcGZfcGFyYW1zLmZvcl9wcmV2aWV3ICkge1xuXHRcdFx0JHJvb3QgPSAkKCB3Y2FwZk51bWJlclJhbmdlRmlsdGVyU2VsZWN0b3IgKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0JHJvb3QgPSAkd2NhcGZOdW1iZXJSYW5nZUZpbHRlcnM7XG5cdFx0fVxuXG5cdFx0JHJvb3QuZmluZCggJy53Y2FwZi1yYW5nZS1zbGlkZXInICkuZWFjaCggZnVuY3Rpb24oKSB7XG5cdFx0XHRjb25zdCAkaXRlbSA9ICQoIHRoaXMgKTtcblxuXHRcdFx0Ly8gVE9ETzogUmVtb3ZlIGZpbHRlciBrZXkuXG5cdFx0XHRjb25zdCBmaWx0ZXJLZXkgPSAkaXRlbS5hdHRyKCAnZGF0YS1maWx0ZXIta2V5JyApO1xuXHRcdFx0Y29uc3QgJHNsaWRlciAgID0gJGl0ZW0uZmluZCggJy53Y2FwZi1ub3VpLXNsaWRlcicgKTtcblxuXHRcdFx0Ly8gSWYgc2xpZGVyIGlzIGFscmVhZHkgaW5pdGlhbGl6ZWQgdGhlbiBkb24ndCByZWluaXRpYWxpemUgYWdhaW4uXG5cdFx0XHRpZiAoICRzbGlkZXIuaGFzQ2xhc3MoICd3Y2FwZi1ub3VpLXRhcmdldCcgKSApIHtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXG5cdFx0XHRjb25zdCBzbGlkZXJJZCAgICAgICAgICA9ICRzbGlkZXIuYXR0ciggJ2lkJyApO1xuXHRcdFx0Y29uc3QgZGlzcGxheVZhbHVlc0FzICAgPSAkaXRlbS5hdHRyKCAnZGF0YS1kaXNwbGF5LXZhbHVlcy1hcycgKTtcblx0XHRcdGNvbnN0IGZvcm1hdE51bWJlcnMgICAgID0gJGl0ZW0uYXR0ciggJ2RhdGEtZm9ybWF0LW51bWJlcnMnICk7XG5cdFx0XHRjb25zdCByYW5nZU1pblZhbHVlICAgICA9IHBhcnNlRmxvYXQoICRpdGVtLmF0dHIoICdkYXRhLXJhbmdlLW1pbi12YWx1ZScgKSApO1xuXHRcdFx0Y29uc3QgcmFuZ2VNYXhWYWx1ZSAgICAgPSBwYXJzZUZsb2F0KCAkaXRlbS5hdHRyKCAnZGF0YS1yYW5nZS1tYXgtdmFsdWUnICkgKTtcblx0XHRcdGNvbnN0IHN0ZXAgICAgICAgICAgICAgID0gcGFyc2VGbG9hdCggJGl0ZW0uYXR0ciggJ2RhdGEtc3RlcCcgKSApO1xuXHRcdFx0Y29uc3QgZGVjaW1hbFBsYWNlcyAgICAgPSAkaXRlbS5hdHRyKCAnZGF0YS1kZWNpbWFsLXBsYWNlcycgKTtcblx0XHRcdGNvbnN0IHRob3VzYW5kU2VwYXJhdG9yID0gJGl0ZW0uYXR0ciggJ2RhdGEtdGhvdXNhbmQtc2VwYXJhdG9yJyApO1xuXHRcdFx0Y29uc3QgZGVjaW1hbFNlcGFyYXRvciAgPSAkaXRlbS5hdHRyKCAnZGF0YS1kZWNpbWFsLXNlcGFyYXRvcicgKTtcblx0XHRcdGNvbnN0IG1pblZhbHVlICAgICAgICAgID0gcGFyc2VGbG9hdCggJGl0ZW0uYXR0ciggJ2RhdGEtbWluLXZhbHVlJyApICk7XG5cdFx0XHRjb25zdCBtYXhWYWx1ZSAgICAgICAgICA9IHBhcnNlRmxvYXQoICRpdGVtLmF0dHIoICdkYXRhLW1heC12YWx1ZScgKSApO1xuXHRcdFx0Y29uc3QgJG1pblZhbHVlICAgICAgICAgPSAkaXRlbS5maW5kKCAnLm1pbi12YWx1ZScgKTtcblx0XHRcdGNvbnN0ICRtYXhWYWx1ZSAgICAgICAgID0gJGl0ZW0uZmluZCggJy5tYXgtdmFsdWUnICk7XG5cblx0XHRcdGNvbnN0IHNsaWRlciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCBzbGlkZXJJZCApO1xuXG5cdFx0XHRub1VpU2xpZGVyLmNyZWF0ZSggc2xpZGVyLCB7XG5cdFx0XHRcdHN0YXJ0OiBbIG1pblZhbHVlLCBtYXhWYWx1ZSBdLFxuXHRcdFx0XHRzdGVwLFxuXHRcdFx0XHRjb25uZWN0OiB0cnVlLFxuXHRcdFx0XHRjc3NQcmVmaXg6ICd3Y2FwZi1ub3VpLScsXG5cdFx0XHRcdHJhbmdlOiB7XG5cdFx0XHRcdFx0J21pbic6IHJhbmdlTWluVmFsdWUsXG5cdFx0XHRcdFx0J21heCc6IHJhbmdlTWF4VmFsdWUsXG5cdFx0XHRcdH1cblx0XHRcdH0gKTtcblxuXHRcdFx0c2xpZGVyLm5vVWlTbGlkZXIub24oICd1cGRhdGUnLCBmdW5jdGlvbiggdmFsdWVzICkge1xuXHRcdFx0XHRsZXQgbWluVmFsdWU7XG5cdFx0XHRcdGxldCBtYXhWYWx1ZTtcblxuXHRcdFx0XHRpZiAoIGZvcm1hdE51bWJlcnMgKSB7XG5cdFx0XHRcdFx0bWluVmFsdWUgPSBudW1iZXJfZm9ybWF0KCB2YWx1ZXNbIDAgXSwgZGVjaW1hbFBsYWNlcywgZGVjaW1hbFNlcGFyYXRvciwgdGhvdXNhbmRTZXBhcmF0b3IgKTtcblx0XHRcdFx0XHRtYXhWYWx1ZSA9IG51bWJlcl9mb3JtYXQoIHZhbHVlc1sgMSBdLCBkZWNpbWFsUGxhY2VzLCBkZWNpbWFsU2VwYXJhdG9yLCB0aG91c2FuZFNlcGFyYXRvciApO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdG1pblZhbHVlID0gcGFyc2VGbG9hdCggdmFsdWVzWyAwIF0gKTtcblx0XHRcdFx0XHRtYXhWYWx1ZSA9IHBhcnNlRmxvYXQoIHZhbHVlc1sgMSBdICk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRpZiAoICdwbGFpbl90ZXh0JyA9PT0gZGlzcGxheVZhbHVlc0FzICkge1xuXHRcdFx0XHRcdCRtaW5WYWx1ZS5odG1sKCBtaW5WYWx1ZSApO1xuXHRcdFx0XHRcdCRtYXhWYWx1ZS5odG1sKCBtYXhWYWx1ZSApO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdCRtaW5WYWx1ZS52YWwoIG1pblZhbHVlICk7XG5cdFx0XHRcdFx0JG1heFZhbHVlLnZhbCggbWF4VmFsdWUgKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdCRib2R5LnRyaWdnZXIoICd3Y2FwZi1ub3Vpc2xpZGVyLXVwZGF0ZScsIFsgJGl0ZW0sIHZhbHVlcyBdICk7XG5cdFx0XHR9ICk7XG5cblx0XHRcdGZ1bmN0aW9uIGZpbHRlclByb2R1Y3RzQWNjb3JkaW5nVG9TbGlkZXIoIHZhbHVlcyApIHtcblx0XHRcdFx0aWYgKCB3Y2FwZl9wYXJhbXMuZm9yX3ByZXZpZXcgKSB7XG5cdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0Y29uc3QgbWluVmFsdWUgPSBwYXJzZUZsb2F0KCB2YWx1ZXNbIDAgXSApO1xuXHRcdFx0XHRjb25zdCBtYXhWYWx1ZSA9IHBhcnNlRmxvYXQoIHZhbHVlc1sgMSBdICk7XG5cblx0XHRcdFx0aWYgKCBtaW5WYWx1ZSA9PT0gcmFuZ2VNaW5WYWx1ZSAmJiBtYXhWYWx1ZSA9PT0gcmFuZ2VNYXhWYWx1ZSApIHtcblx0XHRcdFx0XHQvLyBSZW1vdmUgcmFuZ2UgZmlsdGVyLlxuXHRcdFx0XHRcdHJlcXVlc3RGaWx0ZXIoICRpdGVtLmRhdGEoICdjbGVhci1maWx0ZXItdXJsJyApICk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0Ly8gQWRkIHJhbmdlIGZpbHRlci5cblx0XHRcdFx0XHRjb25zdCB1cmwgPSAkaXRlbS5kYXRhKCAndXJsJyApLnJlcGxhY2UoICclMXMnLCBtaW5WYWx1ZSApLnJlcGxhY2UoICclMnMnLCBtYXhWYWx1ZSApO1xuXHRcdFx0XHRcdHJlcXVlc3RGaWx0ZXIoIHVybCApO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHRcdHNsaWRlci5ub1VpU2xpZGVyLm9uKCAnY2hhbmdlJywgZnVuY3Rpb24oIHZhbHVlcyApIHtcblx0XHRcdFx0Ly8gQ2xlYXIgYW55IHByZXZpb3VzbHkgc2V0IHRpbWVyIGJlZm9yZSBzZXR0aW5nIGEgZnJlc2ggb25lXG5cdFx0XHRcdGNsZWFyVGltZW91dCggJGl0ZW0uZGF0YSggJ3RpbWVyJyApICk7XG5cblx0XHRcdFx0JGl0ZW0uZGF0YSggJ3RpbWVyJywgc2V0VGltZW91dCggZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0JGl0ZW0ucmVtb3ZlRGF0YSggJ3RpbWVyJyApO1xuXG5cdFx0XHRcdFx0ZmlsdGVyUHJvZHVjdHNBY2NvcmRpbmdUb1NsaWRlciggdmFsdWVzICk7XG5cdFx0XHRcdH0sIGRlbGF5ICkgKTtcblx0XHRcdH0gKTtcblxuXHRcdFx0JG1pblZhbHVlLm9uKCAnaW5wdXQnLCBmdW5jdGlvbiggZXZlbnQgKSB7XG5cdFx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cblx0XHRcdFx0Y29uc3QgJGlucHV0ID0gJCggdGhpcyApO1xuXG5cdFx0XHRcdC8vIENsZWFyIGFueSBwcmV2aW91c2x5IHNldCB0aW1lciBiZWZvcmUgc2V0dGluZyBhIGZyZXNoIG9uZVxuXHRcdFx0XHRjbGVhclRpbWVvdXQoICRpbnB1dC5kYXRhKCAndGltZXInICkgKTtcblxuXHRcdFx0XHQkaW5wdXQuZGF0YSggJ3RpbWVyJywgc2V0VGltZW91dCggZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0JGlucHV0LnJlbW92ZURhdGEoICd0aW1lcicgKTtcblxuXHRcdFx0XHRcdGNvbnN0IG1pblZhbHVlID0gJGlucHV0LnZhbCgpO1xuXG5cdFx0XHRcdFx0c2xpZGVyLm5vVWlTbGlkZXIuc2V0KCBbIG1pblZhbHVlLCBudWxsIF0gKTtcblxuXHRcdFx0XHRcdGZpbHRlclByb2R1Y3RzQWNjb3JkaW5nVG9TbGlkZXIoIHNsaWRlci5ub1VpU2xpZGVyLmdldCgpICk7XG5cdFx0XHRcdH0sIGRlbGF5ICkgKTtcblx0XHRcdH0gKTtcblxuXHRcdFx0JG1heFZhbHVlLm9uKCAnaW5wdXQnLCBmdW5jdGlvbiggZXZlbnQgKSB7XG5cdFx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cblx0XHRcdFx0Y29uc3QgJGlucHV0ID0gJCggdGhpcyApO1xuXG5cdFx0XHRcdC8vIENsZWFyIGFueSBwcmV2aW91c2x5IHNldCB0aW1lciBiZWZvcmUgc2V0dGluZyBhIGZyZXNoIG9uZVxuXHRcdFx0XHRjbGVhclRpbWVvdXQoICRpbnB1dC5kYXRhKCAndGltZXInICkgKTtcblxuXHRcdFx0XHQkaW5wdXQuZGF0YSggJ3RpbWVyJywgc2V0VGltZW91dCggZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0JGlucHV0LnJlbW92ZURhdGEoICd0aW1lcicgKTtcblxuXHRcdFx0XHRcdGNvbnN0IG1heFZhbHVlID0gJGlucHV0LnZhbCgpO1xuXG5cdFx0XHRcdFx0c2xpZGVyLm5vVWlTbGlkZXIuc2V0KCBbIG51bGwsIG1heFZhbHVlIF0gKTtcblxuXHRcdFx0XHRcdGZpbHRlclByb2R1Y3RzQWNjb3JkaW5nVG9TbGlkZXIoIHNsaWRlci5ub1VpU2xpZGVyLmdldCgpICk7XG5cdFx0XHRcdH0sIGRlbGF5ICkgKTtcblx0XHRcdH0gKTtcblx0XHR9ICk7XG5cdH1cblxuXHRpbml0Tm9VSVNsaWRlcigpO1xuXG5cdGZ1bmN0aW9uIGZpbHRlckJ5RGF0ZSggJGlucHV0ICkge1xuXHRcdGlmICggd2NhcGZfcGFyYW1zLmZvcl9wcmV2aWV3ICkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdGNvbnN0ICR3Y2FwZkRhdGVGaWx0ZXIgPSAkaW5wdXQuY2xvc2VzdCggJy53Y2FwZi1kYXRlLWlucHV0JyApO1xuXHRcdGNvbnN0IGZpbHRlcktleSAgICAgICAgPSAkd2NhcGZEYXRlRmlsdGVyLmF0dHIoICdkYXRhLWZpbHRlci1rZXknICk7XG5cdFx0Y29uc3QgaXNSYW5nZSAgICAgICAgICA9ICR3Y2FwZkRhdGVGaWx0ZXIuYXR0ciggJ2RhdGEtaXMtcmFuZ2UnICk7XG5cblx0XHRsZXQgZmlsdGVyVmFsdWUgPSAnJztcblx0XHRsZXQgcnVuRmlsdGVyICAgPSBmYWxzZTtcblxuXHRcdC8vIENsZWFyIGFueSBwcmV2aW91c2x5IHNldCB0aW1lciBiZWZvcmUgc2V0dGluZyBhIGZyZXNoIG9uZVxuXHRcdGNsZWFyVGltZW91dCggJHdjYXBmRGF0ZUZpbHRlci5kYXRhKCAndGltZXInICkgKTtcblxuXHRcdGlmICggaXNSYW5nZSApIHtcblx0XHRcdGNvbnN0IGZyb20gPSAkd2NhcGZEYXRlRmlsdGVyLmZpbmQoICcuZGF0ZS1mcm9tLWlucHV0JyApLnZhbCgpO1xuXHRcdFx0Y29uc3QgdG8gICA9ICR3Y2FwZkRhdGVGaWx0ZXIuZmluZCggJy5kYXRlLXRvLWlucHV0JyApLnZhbCgpO1xuXG5cdFx0XHRpZiAoIGZyb20gJiYgdG8gKSB7XG5cdFx0XHRcdGZpbHRlclZhbHVlID0gZnJvbSArIHJhbmdlVmFsdWVzU2VwYXJhdG9yICsgdG87XG5cdFx0XHRcdHJ1bkZpbHRlciAgID0gdHJ1ZTtcblx0XHRcdH0gZWxzZSBpZiAoICEgZnJvbSAmJiAhIHRvICkge1xuXHRcdFx0XHRydW5GaWx0ZXIgPSB0cnVlO1xuXHRcdFx0fVxuXHRcdH0gZWxzZSB7XG5cdFx0XHRjb25zdCBmcm9tID0gJHdjYXBmRGF0ZUZpbHRlci5maW5kKCAnLmRhdGUtZnJvbS1pbnB1dCcgKS52YWwoKTtcblxuXHRcdFx0aWYgKCBmcm9tICkge1xuXHRcdFx0XHRmaWx0ZXJWYWx1ZSA9IGZyb207XG5cdFx0XHRcdHJ1bkZpbHRlciAgID0gdHJ1ZTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHJ1bkZpbHRlciA9IHRydWU7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0aWYgKCBydW5GaWx0ZXIgKSB7XG5cdFx0XHQkd2NhcGZEYXRlRmlsdGVyLmRhdGEoICd0aW1lcicsIHNldFRpbWVvdXQoIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHQkd2NhcGZEYXRlRmlsdGVyLnJlbW92ZURhdGEoICd0aW1lcicgKTtcblxuXHRcdFx0XHRpZiAoIGZpbHRlclZhbHVlICkge1xuXHRcdFx0XHRcdHVwZGF0ZVF1ZXJ5U3RyaW5nUGFyYW1ldGVyKCBmaWx0ZXJLZXksIGZpbHRlclZhbHVlICk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0Y29uc3QgcXVlcnkgPSByZW1vdmVRdWVyeVN0cmluZ1BhcmFtZXRlciggZmlsdGVyS2V5ICk7XG5cdFx0XHRcdFx0aGlzdG9yeS5wdXNoU3RhdGUoIHt9LCAnJywgcXVlcnkgKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGZpbHRlclByb2R1Y3RzKCk7XG5cdFx0XHR9LCBkZWxheSApICk7XG5cdFx0fVxuXHR9XG5cblx0ZnVuY3Rpb24gaW5pdERhdGVwaWNrZXIoKSB7XG5cdFx0aWYgKCAhIGpRdWVyeSgpLmRhdGVwaWNrZXIgKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0bGV0ICRyb290O1xuXG5cdFx0aWYgKCB3Y2FwZl9wYXJhbXMuZm9yX3ByZXZpZXcgKSB7XG5cdFx0XHQkcm9vdCA9ICQoIHdjYXBmRGF0ZUZpbHRlclNlbGVjdG9yICk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdCRyb290ID0gJHdjYXBmRGF0ZUZpbHRlcnM7XG5cdFx0fVxuXG5cdFx0Y29uc3QgJHdjYXBmRGF0ZUZpbHRlciA9ICRyb290LmZpbmQoICcud2NhcGYtZGF0ZS1pbnB1dCcgKTtcblxuXHRcdGNvbnN0IGZvcm1hdCAgICAgICAgPSAkd2NhcGZEYXRlRmlsdGVyLmF0dHIoICdkYXRhLWRhdGUtZm9ybWF0JyApO1xuXHRcdGNvbnN0IHllYXJEcm9wZG93biAgPSAkd2NhcGZEYXRlRmlsdGVyLmF0dHIoICdkYXRhLWRhdGUtcGlja2VyLXllYXItZHJvcGRvd24nICk7XG5cdFx0Y29uc3QgbW9udGhEcm9wZG93biA9ICR3Y2FwZkRhdGVGaWx0ZXIuYXR0ciggJ2RhdGEtZGF0ZS1waWNrZXItbW9udGgtZHJvcGRvd24nICk7XG5cblx0XHRjb25zdCAkZnJvbSA9ICR3Y2FwZkRhdGVGaWx0ZXIuZmluZCggJy5kYXRlLWZyb20taW5wdXQnICk7XG5cdFx0Y29uc3QgJHRvICAgPSAkd2NhcGZEYXRlRmlsdGVyLmZpbmQoICcuZGF0ZS10by1pbnB1dCcgKTtcblxuXHRcdCRmcm9tLmRhdGVwaWNrZXIoIHtcblx0XHRcdGRhdGVGb3JtYXQ6IGZvcm1hdCxcblx0XHRcdGNoYW5nZVllYXI6IHllYXJEcm9wZG93bixcblx0XHRcdGNoYW5nZU1vbnRoOiBtb250aERyb3Bkb3duLFxuXHRcdH0gKTtcblxuXHRcdCR0by5kYXRlcGlja2VyKCB7XG5cdFx0XHRkYXRlRm9ybWF0OiBmb3JtYXQsXG5cdFx0XHRjaGFuZ2VZZWFyOiB5ZWFyRHJvcGRvd24sXG5cdFx0XHRjaGFuZ2VNb250aDogbW9udGhEcm9wZG93bixcblx0XHR9ICk7XG5cblx0XHQkZnJvbS5vbiggJ2NoYW5nZScsIGZ1bmN0aW9uKCkge1xuXHRcdFx0Y29uc3QgJGlucHV0ID0gJCggdGhpcyApO1xuXHRcdFx0ZmlsdGVyQnlEYXRlKCAkaW5wdXQgKTtcblx0XHR9ICk7XG5cblx0XHQkdG8ub24oICdjaGFuZ2UnLCBmdW5jdGlvbigpIHtcblx0XHRcdGNvbnN0ICRpbnB1dCA9ICQoIHRoaXMgKTtcblx0XHRcdGZpbHRlckJ5RGF0ZSggJGlucHV0ICk7XG5cdFx0fSApO1xuXHR9XG5cblx0aW5pdERhdGVwaWNrZXIoKTtcblxuXHRmdW5jdGlvbiBpbml0RGVmYXVsdE9yZGVyQnkoKSB7XG5cdFx0Ly8gQXR0YWNoIGNob3Nlbi5cblx0XHRpZiAoIHdjYXBmX3BhcmFtcy5hdHRhY2hfY2hvc2VuX29uX3NvcnRpbmcgKSB7XG5cdFx0XHRpZiAoIGpRdWVyeSgpLmNob3NlbiApIHtcblx0XHRcdFx0JGJvZHkuZmluZCggJy53b29jb21tZXJjZS1vcmRlcmluZyBzZWxlY3Qub3JkZXJieScgKS5jaG9zZW4oIHtcblx0XHRcdFx0XHQnZGlzYWJsZV9zZWFyY2hfdGhyZXNob2xkJzogMTUsXG5cdFx0XHRcdH0gKTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHRpZiAoICEgd2NhcGZfcGFyYW1zLnNvcnRpbmdfY29udHJvbCApIHtcblx0XHRcdCRib2R5LmZpbmQoICcud29vY29tbWVyY2Utb3JkZXJpbmcnICkuZWFjaCggZnVuY3Rpb24oKSB7XG5cdFx0XHRcdGNvbnN0ICRvcmRlcmluZ0Zvcm0gPSAkKCB0aGlzICk7XG5cblx0XHRcdFx0JG9yZGVyaW5nRm9ybS5vbiggJ2NoYW5nZScsICdzZWxlY3Qub3JkZXJieScsIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdCRvcmRlcmluZ0Zvcm0uc3VibWl0KCk7XG5cdFx0XHRcdH0gKTtcblx0XHRcdH0gKTtcblxuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdC8vIHRvZG86IGNoZWNrIGlmIGFqYXggZGlzYWJsZWQuXG5cdFx0JGJvZHkuZmluZCggJy53b29jb21tZXJjZS1vcmRlcmluZycgKS5lYWNoKCBmdW5jdGlvbigpIHtcblx0XHRcdGNvbnN0ICRvcmRlcmluZ0Zvcm0gPSAkKCB0aGlzICk7XG5cblx0XHRcdCRvcmRlcmluZ0Zvcm0ub24oICdzdWJtaXQnLCBmdW5jdGlvbiggZSApIHtcblx0XHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0fSApO1xuXG5cdFx0XHQkb3JkZXJpbmdGb3JtLm9uKCAnY2hhbmdlJywgJ3NlbGVjdC5vcmRlcmJ5JywgZnVuY3Rpb24oIGUgKSB7XG5cdFx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcblxuXHRcdFx0XHRjb25zdCBvcmRlciAgICAgID0gJCggdGhpcyApLnZhbCgpO1xuXHRcdFx0XHRjb25zdCBmaWx0ZXJfa2V5ID0gJ29yZGVyYnknO1xuXG5cdFx0XHRcdHVwZGF0ZVF1ZXJ5U3RyaW5nUGFyYW1ldGVyKCBmaWx0ZXJfa2V5LCBvcmRlciApO1xuXHRcdFx0XHRmaWx0ZXJQcm9kdWN0cygpO1xuXHRcdFx0fSApO1xuXHRcdH0gKTtcblx0fVxuXG5cdGluaXREZWZhdWx0T3JkZXJCeSgpO1xuXG5cdGZ1bmN0aW9uIHVwZGF0ZVByb2R1Y3RzQ291bnRSZXN1bHQoICRyZXN1bHRzICkge1xuXHRcdGNvbnN0IHNlbGVjdG9yID0gJy53b29jb21tZXJjZS1yZXN1bHQtY291bnQnO1xuXG5cdFx0aWYgKCAkKCB3Y2FwZl9wYXJhbXMuc2hvcF9sb29wX2NvbnRhaW5lciApLmZpbmQoIHNlbGVjdG9yICkubGVuZ3RoICkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdGNvbnN0IG5ld1Byb2R1Y3RDb3VudCA9ICRyZXN1bHRzLmZpbmQoIHNlbGVjdG9yICkuaHRtbCgpO1xuXG5cdFx0JGJvZHkuZmluZCggc2VsZWN0b3IgKS5odG1sKCBuZXdQcm9kdWN0Q291bnQgKTtcblx0fVxuXG5cdGZ1bmN0aW9uIHNob3dMb2FkaW5nQW5pbWF0aW9uKCkge1xuXHRcdGlmICggISB3Y2FwZl9wYXJhbXMubG9hZGluZ19hbmltYXRpb24gKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0JC5Mb2FkaW5nT3ZlcmxheSggJ3Nob3cnLCB3Y2FwZl9wYXJhbXMubG9hZGluZ19vdmVybGF5X29wdGlvbnMgKTtcblx0fVxuXG5cdGZ1bmN0aW9uIGRpc2FibGVOb1VpU2xpZGVycygpIHtcblx0XHRpZiAoICd1bmRlZmluZWQnID09PSB0eXBlb2Ygbm9VaVNsaWRlciApIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHQkd2NhcGZOdW1iZXJSYW5nZUZpbHRlcnMuZmluZCggJy53Y2FwZi1ub3VpLXNsaWRlcicgKS5lYWNoKCBmdW5jdGlvbiggZSwgZWxlbWVudCApIHtcblx0XHRcdGVsZW1lbnQuc2V0QXR0cmlidXRlKCAnZGlzYWJsZWQnLCB0cnVlICk7XG5cdFx0fSApO1xuXHR9XG5cblx0ZnVuY3Rpb24gZGlzYWJsZUxhYmVscygpIHtcblx0XHRjb25zdCBzZWxlY3RvcnMgPSAnLndjYXBmLWxhYmVsZWQtbmF2IC5pdGVtLCAud2NhcGYtYWN0aXZlLWZpbHRlcnMgLml0ZW0nO1xuXG5cdFx0Ly8gVE9ETzogQWRkIGRpc2FibGVkIGF0dHJpYnV0ZS5cblx0XHQkd2NhcGZTaW5nbGVGaWx0ZXJzLmZpbmQoIHNlbGVjdG9ycyApLmFkZENsYXNzKCAnZGlzYWJsZWQnICk7XG5cdH1cblxuXHRmdW5jdGlvbiBkaXNhYmxlSW5wdXRzKCkge1xuXHRcdGlmICggISB3Y2FwZl9wYXJhbXMuZGlzYWJsZV9pbnB1dHNfd2hpbGVfZmV0Y2hpbmdfcmVzdWx0cyApIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHRjb25zdCBpbnB1dHMgPSAnaW5wdXQsIHNlbGVjdCc7XG5cblx0XHQkd2NhcGZTaW5nbGVGaWx0ZXJzLmZpbmQoIGlucHV0cyApLmF0dHIoICdkaXNhYmxlZCcsICdkaXNhYmxlZCcgKTtcblx0XHQkd2NhcGZTaW5nbGVGaWx0ZXJzLmZpbmQoIGlucHV0cyApLnRyaWdnZXIoICdjaG9zZW46dXBkYXRlZCcgKTtcblxuXHRcdGRpc2FibGVOb1VpU2xpZGVycygpO1xuXHRcdGRpc2FibGVMYWJlbHMoKTtcblx0fVxuXG5cdGZ1bmN0aW9uIGVuYWJsZU5vVWlTbGlkZXJzKCkge1xuXHRcdGlmICggJ3VuZGVmaW5lZCcgPT09IHR5cGVvZiBub1VpU2xpZGVyICkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdCR3Y2FwZk51bWJlclJhbmdlRmlsdGVycy5maW5kKCAnLndjYXBmLW5vdWktc2xpZGVyJyApLmVhY2goIGZ1bmN0aW9uKCBlLCBlbGVtZW50ICkge1xuXHRcdFx0ZWxlbWVudC5yZW1vdmVBdHRyaWJ1dGUoICdkaXNhYmxlZCcgKTtcblx0XHR9ICk7XG5cdH1cblxuXHRmdW5jdGlvbiBlbmFibGVJbnB1dHMoKSB7XG5cdFx0aWYgKCAhIHdjYXBmX3BhcmFtcy5kaXNhYmxlX2lucHV0c193aGlsZV9mZXRjaGluZ19yZXN1bHRzICkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdGNvbnN0IGlucHV0cyA9ICdpbnB1dCc7XG5cblx0XHQkd2NhcGZOdW1iZXJSYW5nZUZpbHRlcnMuZmluZCggaW5wdXRzICkucmVtb3ZlQXR0ciggJ2Rpc2FibGVkJyApO1xuXHRcdCR3Y2FwZkRhdGVGaWx0ZXJzLmZpbmQoIGlucHV0cyApLnJlbW92ZUF0dHIoICdkaXNhYmxlZCcgKTtcblxuXHRcdGVuYWJsZU5vVWlTbGlkZXJzKCk7XG5cdH1cblxuXHRmdW5jdGlvbiByZXNldExvYWRpbmdBbmltYXRpb24oKSB7XG5cdFx0aWYgKCAhIHdjYXBmX3BhcmFtcy5sb2FkaW5nX2FuaW1hdGlvbiApIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHQkLkxvYWRpbmdPdmVybGF5KCAnaGlkZScgKTtcblx0fVxuXG5cdGZ1bmN0aW9uIHNjcm9sbFRvKCkge1xuXHRcdGlmICggJ25vbmUnID09PSB3Y2FwZl9wYXJhbXMuc2Nyb2xsX3dpbmRvdyApIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHRjb25zdCBzY3JvbGxGb3IgPSB3Y2FwZl9wYXJhbXMuc2Nyb2xsX3dpbmRvd19mb3I7XG5cdFx0Y29uc3QgaXNNb2JpbGUgID0gd2NhcGZfcGFyYW1zLmlzX21vYmlsZTtcblx0XHRsZXQgcHJvY2VlZCAgICAgPSBmYWxzZTtcblxuXHRcdGlmICggJ21vYmlsZScgPT09IHNjcm9sbEZvciAmJiBpc01vYmlsZSApIHtcblx0XHRcdHByb2NlZWQgPSB0cnVlO1xuXHRcdH0gZWxzZSBpZiAoICdkZXNrdG9wJyA9PT0gc2Nyb2xsRm9yICYmICEgaXNNb2JpbGUgKSB7XG5cdFx0XHRwcm9jZWVkID0gdHJ1ZTtcblx0XHR9IGVsc2UgaWYgKCAnYm90aCcgPT09IHNjcm9sbEZvciApIHtcblx0XHRcdHByb2NlZWQgPSB0cnVlO1xuXHRcdH1cblxuXHRcdGlmICggISBwcm9jZWVkICkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdGxldCBhZGp1c3RpbmdPZmZzZXQsIG9mZnNldDtcblxuXHRcdGlmICggd2NhcGZfcGFyYW1zLnNjcm9sbF90b190b3Bfb2Zmc2V0ICkge1xuXHRcdFx0YWRqdXN0aW5nT2Zmc2V0ID0gcGFyc2VJbnQoIHdjYXBmX3BhcmFtcy5zY3JvbGxfdG9fdG9wX29mZnNldCApO1xuXHRcdH1cblxuXHRcdGxldCBjb250YWluZXI7XG5cblx0XHRpZiAoICQoIHdjYXBmX3BhcmFtcy5zaG9wX2xvb3BfY29udGFpbmVyICkubGVuZ3RoICkge1xuXHRcdFx0Y29udGFpbmVyID0gd2NhcGZfcGFyYW1zLnNob3BfbG9vcF9jb250YWluZXI7XG5cdFx0fSBlbHNlIGlmICggJCggd2NhcGZfcGFyYW1zLm5vdF9mb3VuZF9jb250YWluZXIgKS5sZW5ndGggKSB7XG5cdFx0XHRjb250YWluZXIgPSB3Y2FwZl9wYXJhbXMubm90X2ZvdW5kX2NvbnRhaW5lcjtcblx0XHR9XG5cblx0XHRpZiAoICdjdXN0b20nID09PSB3Y2FwZl9wYXJhbXMuc2Nyb2xsX3dpbmRvdyApIHtcblx0XHRcdGNvbnRhaW5lciA9IHdjYXBmX3BhcmFtcy5zY3JvbGxfd2luZG93X2N1c3RvbV9lbGVtZW50O1xuXHRcdH1cblxuXHRcdGNvbnN0ICRjb250YWluZXIgPSAkKCBjb250YWluZXIgKTtcblxuXHRcdGlmICggJGNvbnRhaW5lci5sZW5ndGggKSB7XG5cdFx0XHRvZmZzZXQgPSAkY29udGFpbmVyLm9mZnNldCgpLnRvcCAtIGFkanVzdGluZ09mZnNldDtcblxuXHRcdFx0aWYgKCBvZmZzZXQgPCAwICkge1xuXHRcdFx0XHRvZmZzZXQgPSAwO1xuXHRcdFx0fVxuXG5cdFx0XHQkKCAnaHRtbCwgYm9keScgKS5zdG9wKCkuYW5pbWF0ZShcblx0XHRcdFx0eyBzY3JvbGxUb3A6IG9mZnNldCB9LFxuXHRcdFx0XHR3Y2FwZl9wYXJhbXMuc2Nyb2xsX3RvX3RvcF9zcGVlZCxcblx0XHRcdFx0d2NhcGZfcGFyYW1zLnNjcm9sbF90b190b3BfZWFzaW5nXG5cdFx0XHQpO1xuXHRcdH1cblx0fVxuXG5cdC8vIFRoaW5ncyBhcmUgZG9uZSBiZWZvcmUgZmV0Y2hpbmcgdGhlIHByb2R1Y3RzIGxpa2Ugc2hvd2luZyBhIGxvYWRpbmcgaW5kaWNhdG9yLlxuXHRmdW5jdGlvbiBiZWZvcmVGZXRjaGluZ1Byb2R1Y3RzKCkge1xuXHRcdGRpc2FibGVJbnB1dHMoKTtcblx0XHRzaG93TG9hZGluZ0FuaW1hdGlvbigpO1xuXG5cdFx0aWYgKCAnaW1tZWRpYXRlbHknID09PSB3Y2FwZl9wYXJhbXMuc2Nyb2xsX3dpbmRvd193aGVuICkge1xuXHRcdFx0c2Nyb2xsVG8oKTtcblx0XHR9XG5cblx0XHQkYm9keS50cmlnZ2VyKCAnd2NhcGZfYmVmb3JlX2ZldGNoaW5nX3Byb2R1Y3RzJyApO1xuXHR9XG5cblx0ZnVuY3Rpb24gYmVmb3JlVXBkYXRpbmdQcm9kdWN0cyggJHJlc3VsdHMgKSB7XG5cdFx0cmVzZXRMb2FkaW5nQW5pbWF0aW9uKCk7XG5cblx0XHQkYm9keS50cmlnZ2VyKCAnd2NhcGZfYmVmb3JlX3VwZGF0aW5nX3Byb2R1Y3RzJywgWyAkcmVzdWx0cyBdICk7XG5cdH1cblxuXHQvLyBUaGluZ3MgYXJlIGRvbmUgYWZ0ZXIgYXBwbHlpbmcgdGhlIGZpbHRlciBsaWtlIHNjcm9sbCB0byB0b3AuXG5cdGZ1bmN0aW9uIGFmdGVyVXBkYXRpbmdQcm9kdWN0cyggJHJlc3VsdHMgKSB7XG5cdFx0aW5pdENob3NlbigpO1xuXHRcdGluaXRIaWVyYXJjaHlBY2NvcmRpb24oKTtcblx0XHRpbml0Tm9VSVNsaWRlcigpO1xuXHRcdGluaXREYXRlcGlja2VyKCk7XG5cdFx0aW5pdERlZmF1bHRPcmRlckJ5KCk7XG5cdFx0dXBkYXRlUHJvZHVjdHNDb3VudFJlc3VsdCggJHJlc3VsdHMgKTtcblx0XHRlbmFibGVJbnB1dHMoKTtcblxuXHRcdGlmICggJ2FmdGVyJyA9PT0gd2NhcGZfcGFyYW1zLnNjcm9sbF93aW5kb3dfd2hlbiApIHtcblx0XHRcdHNjcm9sbFRvKCk7XG5cdFx0fVxuXG5cdFx0JGJvZHkudHJpZ2dlciggJ3djYXBmX2FmdGVyX3VwZGF0aW5nX3Byb2R1Y3RzJywgWyAkcmVzdWx0cyBdICk7XG5cdH1cblxuXHQvLyBUaGUgbWFpbiBmaWx0ZXIgZnVuY3Rpb24uXG5cdGZ1bmN0aW9uIGZpbHRlclByb2R1Y3RzKCBmb3JjZVJlUmVuZGVyID0gZmFsc2UgKSB7XG5cdFx0aWYgKCB3Y2FwZl9wYXJhbXMuZm9yX3ByZXZpZXcgKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0YmVmb3JlRmV0Y2hpbmdQcm9kdWN0cygpO1xuXG5cdFx0JC5nZXQoIHdpbmRvdy5sb2NhdGlvbi5ocmVmLCBmdW5jdGlvbiggZGF0YSApIHtcblx0XHRcdGNvbnN0ICRkYXRhID0gJCggZGF0YSApO1xuXG5cdFx0XHQvLyBSZXBsYWNlIHRoZSBmaWVsZHMnIGRhdGEgd2l0aCBuZXcgZGF0YS5cblx0XHRcdCQuZWFjaCggZmllbGRzLCBmdW5jdGlvbiggaWQgKSB7XG5cdFx0XHRcdGNvbnN0IGZpZWxkSUQgICAgPSAnW2RhdGEtaWQ9XCInICsgaWQgKyAnXCJdJztcblx0XHRcdFx0Y29uc3QgJGZpZWxkICAgICA9ICQoIGZpZWxkSUQgKTtcblx0XHRcdFx0Y29uc3QgJGlubmVyICAgICA9ICRmaWVsZC5maW5kKCAnLndjYXBmLWZpZWxkLWlubmVyJyApO1xuXHRcdFx0XHRjb25zdCBfZmllbGQgICAgID0gJGRhdGEuZmluZCggZmllbGRJRCApO1xuXHRcdFx0XHRsZXQgZmllbGRDbGFzc2VzID0gJCggX2ZpZWxkICkuYXR0ciggJ2NsYXNzJyApO1xuXG5cdFx0XHRcdC8vIFByZXNlcnZlIGhpZXJhcmNoeSBhY2NvcmRpb24gc3RhdGUuXG5cdFx0XHRcdGlmICggd2NhcGZfcGFyYW1zLnByZXNlcnZlX2hpZXJhcmNoeV9hY2NvcmRpb25fc3RhdGUgKSB7XG5cdFx0XHRcdFx0aWYgKCAkZmllbGQuaGFzQ2xhc3MoICdoaWVyYXJjaHktYWNjb3JkaW9uJyApICkge1xuXHRcdFx0XHRcdFx0JGZpZWxkLmZpbmQoICcuaGllcmFyY2h5LWFjY29yZGlvbi10b2dnbGUuYWN0aXZlJyApLmVhY2goIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdFx0XHRjb25zdCBpdGVtVmFsdWUgICAgICA9ICQoIHRoaXMgKS5wYXJlbnQoKS5jaGlsZHJlbiggJ2lucHV0JyApLnZhbCgpO1xuXHRcdFx0XHRcdFx0XHRjb25zdCB0b2dnbGVTZWxlY3RvciA9ICdpbnB1dFt2YWx1ZT1cIicgKyBpdGVtVmFsdWUgKyAnXCJdIH4gLmhpZXJhcmNoeS1hY2NvcmRpb24tdG9nZ2xlJztcblx0XHRcdFx0XHRcdFx0Y29uc3QgdWxTZWxlY3RvciAgICAgPSAnaW5wdXRbdmFsdWU9XCInICsgaXRlbVZhbHVlICsgJ1wiXSB+IHVsJztcblx0XHRcdFx0XHRcdFx0Y29uc3QgX2NsYXNzZXMgICAgICAgPSAnaGllcmFyY2h5LWFjY29yZGlvbi10b2dnbGUgYWN0aXZlJztcblxuXHRcdFx0XHRcdFx0XHRfZmllbGQuZmluZCggdG9nZ2xlU2VsZWN0b3IgKS5hdHRyKCAnY2xhc3MnLCBfY2xhc3NlcyApO1xuXHRcdFx0XHRcdFx0XHRfZmllbGQuZmluZCggdWxTZWxlY3RvciApLnNob3coKTtcblx0XHRcdFx0XHRcdH0gKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRjb25zdCBfaHRtbCA9IF9maWVsZC5maW5kKCAnLndjYXBmLWZpZWxkLWlubmVyJyApLmh0bWwoKTtcblxuXHRcdFx0XHQvLyBTaG93IHNvZnQgbGltaXQgaXRlbXMuXG5cdFx0XHRcdGNvbnN0IHNvZnRMaW1pdFNlbGVjdG9yID0gJ3Nob3ctaGlkZGVuLWl0ZW1zJztcblxuXHRcdFx0XHRpZiAoICRmaWVsZC5oYXNDbGFzcyggc29mdExpbWl0U2VsZWN0b3IgKSApIHtcblx0XHRcdFx0XHRpZiAoICEgX2ZpZWxkLmhhc0NsYXNzKCBzb2Z0TGltaXRTZWxlY3RvciApICkge1xuXHRcdFx0XHRcdFx0ZmllbGRDbGFzc2VzICs9ICcgJyArIHNvZnRMaW1pdFNlbGVjdG9yO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRmaWVsZENsYXNzZXMgPSBmaWVsZENsYXNzZXMucmVwbGFjZSggc29mdExpbWl0U2VsZWN0b3IsICcnICk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHQvLyBVcGRhdGUgdGhlIGZpZWxkJ3MgY2xhc3MuXG5cdFx0XHRcdCRmaWVsZC5hdHRyKCAnY2xhc3MnLCBmaWVsZENsYXNzZXMudHJpbSgpICk7XG5cblx0XHRcdFx0Ly8gV2hlbiBjYWxsZWQgZnJvbSBoaXN0b3J5IGJhY2sgb3IgZm9yd2FyZCByZXF1ZXN0IHRoZW4gcmVyZW5kZXIgYWxsIGZpZWxkcy5cblx0XHRcdFx0aWYgKCBmb3JjZVJlUmVuZGVyICkge1xuXG5cdFx0XHRcdFx0Ly8gdXBkYXRlIGZpZWxkXG5cdFx0XHRcdFx0JGlubmVyLmh0bWwoIF9odG1sICk7XG5cblx0XHRcdFx0fSBlbHNlIHtcblxuXHRcdFx0XHRcdC8vIFNlbGVjdGl2ZWx5IHJlcmVuZGVyIHRoZSBmaWVsZHMuXG5cdFx0XHRcdFx0aWYgKCAkZmllbGQuaGFzQ2xhc3MoICd3Y2FwZi1uYXYtZmlsdGVyJyApICkge1xuXG5cdFx0XHRcdFx0XHQvLyB1cGRhdGUgZmllbGRcblx0XHRcdFx0XHRcdCRpbm5lci5odG1sKCBfaHRtbCApO1xuXG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdH1cblxuXHRcdFx0XHQkZmllbGQudHJpZ2dlciggJ3djYXBmLWZpZWxkLXVwZGF0ZWQnLCBbIF9maWVsZCBdICk7XG5cdFx0XHR9ICk7XG5cblx0XHRcdGJlZm9yZVVwZGF0aW5nUHJvZHVjdHMoICRkYXRhICk7XG5cblx0XHRcdC8vIFJlcGxhY2Ugb2xkIHNob3AgbG9vcCB3aXRoIG5ldyBvbmUuXG5cdFx0XHRjb25zdCAkc2hvcExvb3BDb250YWluZXIgPSAkZGF0YS5maW5kKCB3Y2FwZl9wYXJhbXMuc2hvcF9sb29wX2NvbnRhaW5lciApO1xuXHRcdFx0Y29uc3QgJG5vdEZvdW5kQ29udGFpbmVyID0gJGRhdGEuZmluZCggd2NhcGZfcGFyYW1zLm5vdF9mb3VuZF9jb250YWluZXIgKTtcblxuXHRcdFx0aWYgKCB3Y2FwZl9wYXJhbXMuc2hvcF9sb29wX2NvbnRhaW5lciA9PT0gd2NhcGZfcGFyYW1zLm5vdF9mb3VuZF9jb250YWluZXIgKSB7XG5cdFx0XHRcdCQoIHdjYXBmX3BhcmFtcy5zaG9wX2xvb3BfY29udGFpbmVyICkuaHRtbCggJHNob3BMb29wQ29udGFpbmVyLmh0bWwoKSApO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0aWYgKCAkKCB3Y2FwZl9wYXJhbXMubm90X2ZvdW5kX2NvbnRhaW5lciApLmxlbmd0aCApIHtcblx0XHRcdFx0XHRpZiAoICRzaG9wTG9vcENvbnRhaW5lci5sZW5ndGggKSB7XG5cdFx0XHRcdFx0XHQkKCB3Y2FwZl9wYXJhbXMubm90X2ZvdW5kX2NvbnRhaW5lciApLmh0bWwoICRzaG9wTG9vcENvbnRhaW5lci5odG1sKCkgKTtcblx0XHRcdFx0XHR9IGVsc2UgaWYgKCAkbm90Rm91bmRDb250YWluZXIubGVuZ3RoICkge1xuXHRcdFx0XHRcdFx0JCggd2NhcGZfcGFyYW1zLm5vdF9mb3VuZF9jb250YWluZXIgKS5odG1sKCAkbm90Rm91bmRDb250YWluZXIuaHRtbCgpICk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9IGVsc2UgaWYgKCAkKCB3Y2FwZl9wYXJhbXMuc2hvcF9sb29wX2NvbnRhaW5lciApLmxlbmd0aCApIHtcblx0XHRcdFx0XHRpZiAoICRzaG9wTG9vcENvbnRhaW5lci5sZW5ndGggKSB7XG5cdFx0XHRcdFx0XHQkKCB3Y2FwZl9wYXJhbXMuc2hvcF9sb29wX2NvbnRhaW5lciApLmh0bWwoICRzaG9wTG9vcENvbnRhaW5lci5odG1sKCkgKTtcblx0XHRcdFx0XHR9IGVsc2UgaWYgKCAkbm90Rm91bmRDb250YWluZXIubGVuZ3RoICkge1xuXHRcdFx0XHRcdFx0JCggd2NhcGZfcGFyYW1zLnNob3BfbG9vcF9jb250YWluZXIgKS5odG1sKCAkbm90Rm91bmRDb250YWluZXIuaHRtbCgpICk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHRcdGFmdGVyVXBkYXRpbmdQcm9kdWN0cyggJGRhdGEgKTtcblx0XHR9ICk7XG5cdH1cblxuXHQvLyBVUkwgUGFyc2VyXG5cdGZ1bmN0aW9uIGdldFVybFZhcnMoIHVybCApIHtcblx0XHRsZXQgdmFycyA9IHt9LCBoYXNoO1xuXG5cdFx0aWYgKCB0eXBlb2YgdXJsID09PSAndW5kZWZpbmVkJyApIHtcblx0XHRcdHVybCA9IHdpbmRvdy5sb2NhdGlvbi5ocmVmO1xuXHRcdH1cblxuXHRcdHVybCA9IHVybC5yZXBsYWNlQWxsKCAnJTJDJywgJywnICk7XG5cblx0XHRjb25zdCBoYXNoZXMgID0gdXJsLnNsaWNlKCB1cmwuaW5kZXhPZiggJz8nICkgKyAxICkuc3BsaXQoICcmJyApO1xuXHRcdGNvbnN0IGhMZW5ndGggPSBoYXNoZXMubGVuZ3RoO1xuXG5cdFx0Zm9yICggbGV0IGkgPSAwOyBpIDwgaExlbmd0aDsgaSsrICkge1xuXHRcdFx0aGFzaCA9IGhhc2hlc1sgaSBdLnNwbGl0KCAnPScgKTtcblxuXHRcdFx0dmFyc1sgaGFzaFsgMCBdIF0gPSBoYXNoWyAxIF07XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHZhcnM7XG5cdH1cblxuXHQvLyBldmVyeXRpbWUgd2UgYXBwbHkgdGhlIGZpbHRlciB3ZSBzZXQgdGhlIGN1cnJlbnQgcGFnZSB0byAxXG5cdGZ1bmN0aW9uIGZpeFBhZ2luYXRpb24oKSB7XG5cdFx0bGV0IHVybCAgICAgICAgICAgICAgICA9IHdpbmRvdy5sb2NhdGlvbi5ocmVmO1xuXHRcdGNvbnN0IHBhcmFtcyAgICAgICAgICAgPSBnZXRVcmxWYXJzKCB1cmwgKTtcblx0XHRjb25zdCBjdXJyZW50UGFnZUluVXJsID0gcGFyc2VJbnQoIHVybC5yZXBsYWNlKCAvLitcXC9wYWdlXFwvKFxcZCspKy8sICckMScgKSApO1xuXG5cdFx0aWYgKCBjdXJyZW50UGFnZUluVXJsICkge1xuXHRcdFx0aWYgKCBjdXJyZW50UGFnZUluVXJsID4gMSApIHtcblx0XHRcdFx0dXJsID0gdXJsLnJlcGxhY2UoIC9wYWdlXFwvKFxcZCspLywgJ3BhZ2UvMScgKTtcblx0XHRcdH1cblx0XHR9IGVsc2UgaWYgKCB0eXBlb2YgcGFyYW1zWyAncGFnZWQnIF0gIT09ICd1bmRlZmluZWQnICkge1xuXHRcdFx0Y29uc3QgY3VycmVudFBhZ2VJblBhcmFtcyA9IHBhcnNlSW50KCBwYXJhbXNbICdwYWdlZCcgXSApO1xuXG5cdFx0XHRpZiAoIGN1cnJlbnRQYWdlSW5QYXJhbXMgPiAxICkge1xuXHRcdFx0XHR1cmwgPSB1cmwucmVwbGFjZSggJ3BhZ2VkPScgKyBjdXJyZW50UGFnZUluUGFyYW1zLCAncGFnZWQ9MScgKTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHRyZXR1cm4gdXJsO1xuXHR9XG5cblx0Ly8gdXBkYXRlIHF1ZXJ5IHN0cmluZyBmb3IgY2F0ZWdvcmllcywgbWV0YSBldGMuLlxuXHRmdW5jdGlvbiB1cGRhdGVRdWVyeVN0cmluZ1BhcmFtZXRlcigga2V5LCB2YWx1ZSwgcHVzaEhpc3RvcnksIHVybCApIHtcblx0XHRpZiAoIHR5cGVvZiBwdXNoSGlzdG9yeSA9PT0gJ3VuZGVmaW5lZCcgKSB7XG5cdFx0XHRwdXNoSGlzdG9yeSA9IHRydWU7XG5cdFx0fVxuXG5cdFx0aWYgKCB0eXBlb2YgdXJsID09PSAndW5kZWZpbmVkJyApIHtcblx0XHRcdHVybCA9IGZpeFBhZ2luYXRpb24oKTtcblx0XHR9XG5cblx0XHRjb25zdCByZSAgICAgICAgPSBuZXcgUmVnRXhwKCAnKFs/Jl0pJyArIGtleSArICc9Lio/KCZ8JCknLCAnaScgKTtcblx0XHRjb25zdCBzZXBhcmF0b3IgPSB1cmwuaW5kZXhPZiggJz8nICkgIT09IC0xID8gJyYnIDogJz8nO1xuXHRcdGxldCB1cmxXaXRoUXVlcnk7XG5cblx0XHRpZiAoIHVybC5tYXRjaCggcmUgKSApIHtcblx0XHRcdHVybFdpdGhRdWVyeSA9IHVybC5yZXBsYWNlKCByZSwgJyQxJyArIGtleSArICc9JyArIHZhbHVlICsgJyQyJyApO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHR1cmxXaXRoUXVlcnkgPSB1cmwgKyBzZXBhcmF0b3IgKyBrZXkgKyAnPScgKyB2YWx1ZTtcblx0XHR9XG5cblx0XHRpZiAoIHB1c2hIaXN0b3J5ID09PSB0cnVlICkge1xuXHRcdFx0cmV0dXJuIGhpc3RvcnkucHVzaFN0YXRlKCB7fSwgJycsIHVybFdpdGhRdWVyeSApO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRyZXR1cm4gdXJsV2l0aFF1ZXJ5O1xuXHRcdH1cblx0fVxuXG5cdC8vIHJlbW92ZSBwYXJhbWV0ZXIgZnJvbSB1cmxcblx0ZnVuY3Rpb24gcmVtb3ZlUXVlcnlTdHJpbmdQYXJhbWV0ZXIoIGZpbHRlcktleSwgdXJsICkge1xuXHRcdGlmICggdHlwZW9mIHVybCA9PT0gJ3VuZGVmaW5lZCcgKSB7XG5cdFx0XHR1cmwgPSBmaXhQYWdpbmF0aW9uKCk7XG5cdFx0fVxuXG5cdFx0Y29uc3Qgb2xkUGFyYW1zICAgICAgICAgPSBnZXRVcmxWYXJzKCB1cmwgKTtcblx0XHRjb25zdCBvbGRQYXJhbXNMZW5ndGggICA9IE9iamVjdC5rZXlzKCBvbGRQYXJhbXMgKS5sZW5ndGg7XG5cdFx0Y29uc3Qgc3RhcnRQb3NpdGlvbiAgICAgPSB1cmwuaW5kZXhPZiggJz8nICk7XG5cdFx0Y29uc3QgZmlsdGVyS2V5UG9zaXRpb24gPSB1cmwuaW5kZXhPZiggZmlsdGVyS2V5ICk7XG5cdFx0bGV0IGNsZWFuVXJsLCBjbGVhblF1ZXJ5O1xuXG5cdFx0aWYgKCBvbGRQYXJhbXNMZW5ndGggPiAxICkge1xuXHRcdFx0aWYgKCAoIGZpbHRlcktleVBvc2l0aW9uIC0gc3RhcnRQb3NpdGlvbiApID4gMSApIHtcblx0XHRcdFx0Y2xlYW5VcmwgPSB1cmwucmVwbGFjZSggJyYnICsgZmlsdGVyS2V5ICsgJz0nICsgb2xkUGFyYW1zWyBmaWx0ZXJLZXkgXSwgJycgKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGNsZWFuVXJsID0gdXJsLnJlcGxhY2UoIGZpbHRlcktleSArICc9JyArIG9sZFBhcmFtc1sgZmlsdGVyS2V5IF0gKyAnJicsICcnICk7XG5cdFx0XHR9XG5cblx0XHRcdGNvbnN0IG5ld1BhcmFtcyA9IGNsZWFuVXJsLnNwbGl0KCAnPycgKTtcblx0XHRcdGNsZWFuUXVlcnkgICAgICA9ICc/JyArIG5ld1BhcmFtc1sgMSBdO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRjbGVhblF1ZXJ5ID0gdXJsLnJlcGxhY2UoICc/JyArIGZpbHRlcktleSArICc9JyArIG9sZFBhcmFtc1sgZmlsdGVyS2V5IF0sICcnICk7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIGNsZWFuUXVlcnk7XG5cdH1cblxuXHQvLyB0YWtlIHRoZSBrZXkgYW5kIHZhbHVlIGFuZCBtYWtlIHF1ZXJ5XG5cdGZ1bmN0aW9uIG1ha2VQYXJhbWV0ZXJzKCBmaWx0ZXJLZXksIGZpbHRlclZhbHVlLCBmb3JjZVJlcmVuZGVyID0gZmFsc2UsIHVybCApIHtcblx0XHRjb25zdCB2YWx1ZVNlcGFyYXRvciA9ICcsJztcblxuXHRcdGxldCBwYXJhbXMsIG5leHRWYWx1ZXMsIGVtcHR5VmFsdWUgPSBmYWxzZTtcblxuXHRcdGlmICggdHlwZW9mIHVybCAhPT0gJ3VuZGVmaW5lZCcgKSB7XG5cdFx0XHRwYXJhbXMgPSBnZXRVcmxWYXJzKCB1cmwgKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0cGFyYW1zID0gZ2V0VXJsVmFycygpO1xuXHRcdH1cblxuXHRcdGlmICggdHlwZW9mIHBhcmFtc1sgZmlsdGVyS2V5IF0gIT0gJ3VuZGVmaW5lZCcgKSB7XG5cdFx0XHRjb25zdCBwcmV2VmFsdWVzICAgICAgPSBwYXJhbXNbIGZpbHRlcktleSBdO1xuXHRcdFx0Y29uc3QgcHJldlZhbHVlc0FycmF5ID0gcHJldlZhbHVlcy5zcGxpdCggdmFsdWVTZXBhcmF0b3IgKTtcblxuXHRcdFx0aWYgKCBwcmV2VmFsdWVzLmxlbmd0aCA+IDAgKSB7XG5cdFx0XHRcdGNvbnN0IGZvdW5kID0gJC5pbkFycmF5KCBmaWx0ZXJWYWx1ZSwgcHJldlZhbHVlc0FycmF5ICk7XG5cblx0XHRcdFx0aWYgKCBmb3VuZCA+PSAwICkge1xuXHRcdFx0XHRcdC8vIEVsZW1lbnQgd2FzIGZvdW5kLCByZW1vdmUgaXQuXG5cdFx0XHRcdFx0cHJldlZhbHVlc0FycmF5LnNwbGljZSggZm91bmQsIDEgKTtcblxuXHRcdFx0XHRcdGlmICggcHJldlZhbHVlc0FycmF5Lmxlbmd0aCA9PT0gMCApIHtcblx0XHRcdFx0XHRcdGVtcHR5VmFsdWUgPSB0cnVlO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHQvLyBFbGVtZW50IHdhcyBub3QgZm91bmQsIGFkZCBpdC5cblx0XHRcdFx0XHRwcmV2VmFsdWVzQXJyYXkucHVzaCggZmlsdGVyVmFsdWUgKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGlmICggcHJldlZhbHVlc0FycmF5Lmxlbmd0aCA+IDEgKSB7XG5cdFx0XHRcdFx0bmV4dFZhbHVlcyA9IHByZXZWYWx1ZXNBcnJheS5qb2luKCB2YWx1ZVNlcGFyYXRvciApO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdG5leHRWYWx1ZXMgPSBwcmV2VmFsdWVzQXJyYXk7XG5cdFx0XHRcdH1cblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdG5leHRWYWx1ZXMgPSBmaWx0ZXJWYWx1ZTtcblx0XHRcdH1cblx0XHR9IGVsc2Uge1xuXHRcdFx0bmV4dFZhbHVlcyA9IGZpbHRlclZhbHVlO1xuXHRcdH1cblxuXHRcdC8vIHVwZGF0ZSB1cmwgYW5kIHF1ZXJ5IHN0cmluZ1xuXHRcdGlmICggISBlbXB0eVZhbHVlICkge1xuXHRcdFx0dXBkYXRlUXVlcnlTdHJpbmdQYXJhbWV0ZXIoIGZpbHRlcktleSwgbmV4dFZhbHVlcyApO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRjb25zdCBxdWVyeSA9IHJlbW92ZVF1ZXJ5U3RyaW5nUGFyYW1ldGVyKCBmaWx0ZXJLZXkgKTtcblx0XHRcdGhpc3RvcnkucHVzaFN0YXRlKCB7fSwgJycsIHF1ZXJ5ICk7XG5cdFx0fVxuXG5cdFx0ZmlsdGVyUHJvZHVjdHMoIGZvcmNlUmVyZW5kZXIgKTtcblx0fVxuXG5cdGZ1bmN0aW9uIHNpbmdsZUZpbHRlciggZmlsdGVyS2V5LCBmaWx0ZXJWYWx1ZSApIHtcblx0XHRjb25zdCBwYXJhbXMgPSBnZXRVcmxWYXJzKCk7XG5cdFx0bGV0IHF1ZXJ5O1xuXG5cdFx0aWYgKCB0eXBlb2YgcGFyYW1zWyBmaWx0ZXJLZXkgXSAhPT0gJ3VuZGVmaW5lZCcgJiYgcGFyYW1zWyBmaWx0ZXJLZXkgXSA9PT0gZmlsdGVyVmFsdWUgKSB7XG5cdFx0XHRxdWVyeSA9IHJlbW92ZVF1ZXJ5U3RyaW5nUGFyYW1ldGVyKCBmaWx0ZXJLZXkgKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0cXVlcnkgPSB1cGRhdGVRdWVyeVN0cmluZ1BhcmFtZXRlciggZmlsdGVyS2V5LCBmaWx0ZXJWYWx1ZSwgZmFsc2UgKTtcblx0XHR9XG5cblx0XHQvLyB1cGRhdGUgdXJsXG5cdFx0aGlzdG9yeS5wdXNoU3RhdGUoIHt9LCAnJywgcXVlcnkgKTtcblxuXHRcdGZpbHRlclByb2R1Y3RzKCk7XG5cdH1cblxuXHQvLyBIYW5kbGUgdGhlIHBhZ2luYXRpb24gcmVxdWVzdCB2aWEgYWpheC5cblx0aWYgKCB3Y2FwZl9wYXJhbXMuZW5hYmxlX3BhZ2luYXRpb25fdmlhX2FqYXggJiYgd2NhcGZfcGFyYW1zLnBhZ2luYXRpb25fY29udGFpbmVyICkge1xuXHRcdGNvbnN0ICRjb250YWluZXIgPSAkKCB3Y2FwZl9wYXJhbXMuc2hvcF9sb29wX2NvbnRhaW5lciApO1xuXHRcdGNvbnN0IHNlbGVjdG9yICAgPSB3Y2FwZl9wYXJhbXMucGFnaW5hdGlvbl9jb250YWluZXIgKyAnIGEnO1xuXG5cdFx0Ly8gdG9kbzogY2hlY2sgaWYgYWpheCBkaXNhYmxlZC5cblx0XHRpZiAoICRjb250YWluZXIubGVuZ3RoICkge1xuXHRcdFx0JGNvbnRhaW5lci5vbiggJ2NsaWNrJywgc2VsZWN0b3IsIGZ1bmN0aW9uKCBlICkge1xuXHRcdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cblx0XHRcdFx0Y29uc3QgbG9jYXRpb24gPSAkKCB0aGlzICkuYXR0ciggJ2hyZWYnICk7XG5cblx0XHRcdFx0aGlzdG9yeS5wdXNoU3RhdGUoIHt9LCAnJywgbG9jYXRpb24gKTtcblxuXHRcdFx0XHRmaWx0ZXJQcm9kdWN0cygpO1xuXHRcdFx0fSApO1xuXHRcdH1cblx0fVxuXG5cdC8vIFRoZSBmdW5jdGlvbiB0byBoYW5kbGUgdGhlIGNvbW1vbiBmaWx0ZXIgcmVxdWVzdHMuXG5cdGZ1bmN0aW9uIGhhbmRsZUZpbHRlclJlcXVlc3QoICRpdGVtLCBmaWx0ZXJWYWx1ZSApIHtcblx0XHRjb25zdCAkZmllbGQgICAgICAgICA9ICRpdGVtLmNsb3Nlc3QoICcud2NhcGYtc2luZ2xlLWZpbHRlcicgKTtcblx0XHRjb25zdCBmaWVsZElEICAgICAgICA9ICRmaWVsZC5hdHRyKCAnZGF0YS1pZCcgKTtcblx0XHRjb25zdCBmaWVsZERhdGEgICAgICA9IGZpZWxkc1sgZmllbGRJRCBdO1xuXHRcdGNvbnN0IGZpbHRlcktleSAgICAgID0gZmllbGREYXRhLmZpbHRlcktleTtcblx0XHRjb25zdCBtdWx0aXBsZUZpbHRlciA9IGZpZWxkRGF0YS5tdWx0aXBsZUZpbHRlcjtcblxuXHRcdGlmICggISBmaWx0ZXJLZXkgKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0aWYgKCAhIGZpbHRlclZhbHVlLmxlbmd0aCApIHtcblx0XHRcdGNvbnN0IHF1ZXJ5ID0gcmVtb3ZlUXVlcnlTdHJpbmdQYXJhbWV0ZXIoIGZpbHRlcktleSApO1xuXHRcdFx0aGlzdG9yeS5wdXNoU3RhdGUoIHt9LCAnJywgcXVlcnkgKTtcblxuXHRcdFx0ZmlsdGVyUHJvZHVjdHMoKTtcblxuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdGlmICggbXVsdGlwbGVGaWx0ZXIgKSB7XG5cdFx0XHRtYWtlUGFyYW1ldGVycyggZmlsdGVyS2V5LCBmaWx0ZXJWYWx1ZSApO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRzaW5nbGVGaWx0ZXIoIGZpbHRlcktleSwgZmlsdGVyVmFsdWUgKTtcblx0XHR9XG5cdH1cblxuXHRmdW5jdGlvbiByZXF1ZXN0RmlsdGVyKCB1cmwgKSB7XG5cdFx0aWYgKCAhIHVybCApIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHQvLyB3aW5kb3cubG9jYXRpb24uaHJlZiA9IHVybDtcblxuXHRcdC8vIFRPRE86IEZpbHRlciB0aGUgcHJvZHVjdHMgY29uZGl0aW9uYWxseS5cblx0XHQvLyBmaWx0ZXJQcm9kdWN0cygpO1xuXHR9XG5cblx0Ly8gSGFuZGxlIHRoZSBmaWx0ZXIgcmVxdWVzdCBmb3IgbGlzdCBmaWVsZC5cblx0JHdjYXBmTmF2RmlsdGVycy5vbihcblx0XHQnY2hhbmdlJyxcblx0XHQnLndjYXBmLWxheWVyZWQtbmF2IFt0eXBlPVwiY2hlY2tib3hcIl0sIC53Y2FwZi1sYXllcmVkLW5hdiBbdHlwZT1cInJhZGlvXCJdJyxcblx0XHRmdW5jdGlvbiggZXZlbnQgKSB7XG5cdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXG5cdFx0XHRjb25zdCAkaXRlbSA9ICQoIHRoaXMgKTtcblxuXHRcdFx0cmVxdWVzdEZpbHRlciggJGl0ZW0uZGF0YSggJ3VybCcgKSApO1xuXHRcdH1cblx0KTtcblxuXHQvLyBIYW5kbGUgdGhlIGZpbHRlciByZXF1ZXN0IGZvciBsYWJlbGVkIGl0ZW0uXG5cdCR3Y2FwZk5hdkZpbHRlcnMub24oICdjbGljaycsICcud2NhcGYtbGFiZWxlZC1uYXYgLml0ZW06bm90KC5kaXNhYmxlZCknLCBmdW5jdGlvbiggZXZlbnQgKSB7XG5cdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcblxuXHRcdGNvbnN0ICRpdGVtID0gJCggdGhpcyApO1xuXG5cdFx0cmVxdWVzdEZpbHRlciggJGl0ZW0uZGF0YSggJ3VybCcgKSApO1xuXHR9ICk7XG5cblx0Ly8gSGFuZGxlIHRoZSBmaWx0ZXIgcmVxdWVzdCBmb3IgZGlzcGxheSB0eXBlIHNlbGVjdCBmaWVsZHMuXG5cdCR3Y2FwZk5hdkZpbHRlcnMub24oICdjaGFuZ2UnLCAnc2VsZWN0JywgZnVuY3Rpb24oIGV2ZW50ICkge1xuXHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cblx0XHRjb25zdCAkc2VsZWN0ICAgICAgICA9ICQoIHRoaXMgKTtcblx0XHRjb25zdCB2YWx1ZXMgICAgICAgICA9ICRzZWxlY3QudmFsKCk7XG5cdFx0Y29uc3QgZmlsdGVyVVJMICAgICAgPSAkc2VsZWN0LmRhdGEoICd1cmwnICk7XG5cdFx0Y29uc3QgY2xlYXJGaWx0ZXJVUkwgPSAkc2VsZWN0LmRhdGEoICdjbGVhci1maWx0ZXItdXJsJyApO1xuXHRcdGxldCB1cmw7XG5cblx0XHRpZiAoIHZhbHVlcy5sZW5ndGggKSB7XG5cdFx0XHR1cmwgPSBmaWx0ZXJVUkwucmVwbGFjZSggJyVzJywgdmFsdWVzLnRvU3RyaW5nKCkgKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0dXJsID0gY2xlYXJGaWx0ZXJVUkw7XG5cdFx0fVxuXG5cdFx0cmVxdWVzdEZpbHRlciggdXJsICk7XG5cdH0gKTtcblxuXHQvKipcblx0ICogSGFuZGxlIHRoZSBmaWx0ZXIgcmVxdWVzdCBmb3IgcmFuZ2UgbnVtYmVyLlxuXHQgKi9cblx0Y29uc3QgcmFuZ2VOdW1iZXJTZWxlY3RvcnMgPSAnLndjYXBmLXJhbmdlLW51bWJlciAubWluLXZhbHVlLCAud2NhcGYtcmFuZ2UtbnVtYmVyIC5tYXgtdmFsdWUnO1xuXG5cdC8vIFRPRE86IE1heWJlIHVzZSAnY2hhbmdlJyBldmVudC5cblx0JHdjYXBmTnVtYmVyUmFuZ2VGaWx0ZXJzLm9uKCAnaW5wdXQnLCByYW5nZU51bWJlclNlbGVjdG9ycywgZnVuY3Rpb24oIGV2ZW50ICkge1xuXHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cblx0XHRjb25zdCAkaXRlbSA9ICQoIHRoaXMgKTtcblxuXHRcdGNvbnN0ICRyYW5nZU51bWJlciAgICAgID0gJGl0ZW0uY2xvc2VzdCggJy53Y2FwZi1yYW5nZS1udW1iZXInICk7XG5cdFx0Y29uc3QgZm9ybWF0TnVtYmVycyAgICAgPSAkcmFuZ2VOdW1iZXIuYXR0ciggJ2RhdGEtZm9ybWF0LW51bWJlcnMnICk7XG5cdFx0Y29uc3QgcmFuZ2VNaW5WYWx1ZSAgICAgPSBwYXJzZUZsb2F0KCAkcmFuZ2VOdW1iZXIuYXR0ciggJ2RhdGEtcmFuZ2UtbWluLXZhbHVlJyApICk7XG5cdFx0Y29uc3QgcmFuZ2VNYXhWYWx1ZSAgICAgPSBwYXJzZUZsb2F0KCAkcmFuZ2VOdW1iZXIuYXR0ciggJ2RhdGEtcmFuZ2UtbWF4LXZhbHVlJyApICk7XG5cdFx0Y29uc3QgZGVjaW1hbFBsYWNlcyAgICAgPSAkcmFuZ2VOdW1iZXIuYXR0ciggJ2RhdGEtZGVjaW1hbC1wbGFjZXMnICk7XG5cdFx0Y29uc3QgdGhvdXNhbmRTZXBhcmF0b3IgPSAkcmFuZ2VOdW1iZXIuYXR0ciggJ2RhdGEtdGhvdXNhbmQtc2VwYXJhdG9yJyApO1xuXHRcdGNvbnN0IGRlY2ltYWxTZXBhcmF0b3IgID0gJHJhbmdlTnVtYmVyLmF0dHIoICdkYXRhLWRlY2ltYWwtc2VwYXJhdG9yJyApO1xuXG5cdFx0Ly8gQ2xlYXIgYW55IHByZXZpb3VzbHkgc2V0IHRpbWVyIGJlZm9yZSBzZXR0aW5nIGEgZnJlc2ggb25lXG5cdFx0Y2xlYXJUaW1lb3V0KCAkaXRlbS5kYXRhKCAndGltZXInICkgKTtcblxuXHRcdGZ1bmN0aW9uIGdldFZhbHVlKCBmbG9hdFZhbHVlICkge1xuXHRcdFx0aWYgKCBmb3JtYXROdW1iZXJzICkge1xuXHRcdFx0XHRyZXR1cm4gbnVtYmVyX2Zvcm1hdCggZmxvYXRWYWx1ZSwgZGVjaW1hbFBsYWNlcywgZGVjaW1hbFNlcGFyYXRvciwgdGhvdXNhbmRTZXBhcmF0b3IgKTtcblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuIGZsb2F0VmFsdWU7XG5cdFx0fVxuXG5cdFx0JGl0ZW0uZGF0YSggJ3RpbWVyJywgc2V0VGltZW91dCggZnVuY3Rpb24oKSB7XG5cdFx0XHQkaXRlbS5yZW1vdmVEYXRhKCAndGltZXInICk7XG5cblx0XHRcdGxldCBtaW5WYWx1ZSA9IHBhcnNlRmxvYXQoICRyYW5nZU51bWJlci5maW5kKCAnLm1pbi12YWx1ZScgKS52YWwoKSApO1xuXHRcdFx0bGV0IG1heFZhbHVlID0gcGFyc2VGbG9hdCggJHJhbmdlTnVtYmVyLmZpbmQoICcubWF4LXZhbHVlJyApLnZhbCgpICk7XG5cblx0XHRcdC8vIEZvcmNlIHRoZSBtaW5WYWx1ZSBub3QgdG8gYmUgZW1wdHkuXG5cdFx0XHRpZiAoIGlzTmFOKCBtaW5WYWx1ZSApICkge1xuXHRcdFx0XHRtaW5WYWx1ZSA9IHJhbmdlTWluVmFsdWU7XG5cblx0XHRcdFx0JHJhbmdlTnVtYmVyLmZpbmQoICcubWluLXZhbHVlJyApLnZhbCggZ2V0VmFsdWUoIG1pblZhbHVlICkgKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdCRyYW5nZU51bWJlci5maW5kKCAnLm1pbi12YWx1ZScgKS52YWwoIGdldFZhbHVlKCBtaW5WYWx1ZSApICk7XG5cdFx0XHR9XG5cblx0XHRcdC8vIEZvcmNlIHRoZSBtYXhWYWx1ZSBub3QgdG8gYmUgZW1wdHkuXG5cdFx0XHRpZiAoIGlzTmFOKCBtYXhWYWx1ZSApICkge1xuXHRcdFx0XHRtYXhWYWx1ZSA9IHJhbmdlTWF4VmFsdWU7XG5cblx0XHRcdFx0JHJhbmdlTnVtYmVyLmZpbmQoICcubWF4LXZhbHVlJyApLnZhbCggZ2V0VmFsdWUoIG1heFZhbHVlICkgKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdCRyYW5nZU51bWJlci5maW5kKCAnLm1heC12YWx1ZScgKS52YWwoIGdldFZhbHVlKCBtYXhWYWx1ZSApICk7XG5cdFx0XHR9XG5cblx0XHRcdC8vIEZvcmNlIHRoZSBtaW5WYWx1ZSBub3QgdG8gZ28gYmVsb3cgdGhlIHJhbmdlTWluVmFsdWUuXG5cdFx0XHRpZiAoIG1pblZhbHVlIDwgcmFuZ2VNaW5WYWx1ZSApIHtcblx0XHRcdFx0bWluVmFsdWUgPSByYW5nZU1pblZhbHVlO1xuXG5cdFx0XHRcdCRyYW5nZU51bWJlci5maW5kKCAnLm1pbi12YWx1ZScgKS52YWwoIGdldFZhbHVlKCBtaW5WYWx1ZSApICk7XG5cdFx0XHR9XG5cblx0XHRcdC8vIEZvcmNlIHRoZSBtaW5WYWx1ZSBub3QgdG8gZ28gdXAgdGhlIHJhbmdlTWF4VmFsdWUuXG5cdFx0XHRpZiAoIG1pblZhbHVlID4gcmFuZ2VNYXhWYWx1ZSApIHtcblx0XHRcdFx0bWluVmFsdWUgPSByYW5nZU1heFZhbHVlO1xuXG5cdFx0XHRcdCRyYW5nZU51bWJlci5maW5kKCAnLm1pbi12YWx1ZScgKS52YWwoIGdldFZhbHVlKCBtaW5WYWx1ZSApICk7XG5cdFx0XHR9XG5cblx0XHRcdC8vIEZvcmNlIHRoZSBtYXhWYWx1ZSBub3QgdG8gZ28gdXAgdGhlIHJhbmdlTWF4VmFsdWUuXG5cdFx0XHRpZiAoIG1heFZhbHVlID4gcmFuZ2VNYXhWYWx1ZSApIHtcblx0XHRcdFx0bWF4VmFsdWUgPSByYW5nZU1heFZhbHVlO1xuXG5cdFx0XHRcdCRyYW5nZU51bWJlci5maW5kKCAnLm1heC12YWx1ZScgKS52YWwoIGdldFZhbHVlKCBtYXhWYWx1ZSApICk7XG5cdFx0XHR9XG5cblx0XHRcdC8vIEZvcmNlIHRoZSBtYXhWYWx1ZSBub3QgdG8gZ28gYmVsb3cgdGhlIG1pblZhbHVlLlxuXHRcdFx0aWYgKCBtaW5WYWx1ZSA+IG1heFZhbHVlICkge1xuXHRcdFx0XHRtYXhWYWx1ZSA9IG1pblZhbHVlO1xuXG5cdFx0XHRcdCRyYW5nZU51bWJlci5maW5kKCAnLm1heC12YWx1ZScgKS52YWwoIGdldFZhbHVlKCBtYXhWYWx1ZSApICk7XG5cdFx0XHR9XG5cblx0XHRcdGlmICggbWluVmFsdWUgPT09IHJhbmdlTWluVmFsdWUgJiYgbWF4VmFsdWUgPT09IHJhbmdlTWF4VmFsdWUgKSB7XG5cdFx0XHRcdC8vIFJlbW92ZSByYW5nZSBmaWx0ZXIuXG5cdFx0XHRcdHJlcXVlc3RGaWx0ZXIoICRyYW5nZU51bWJlci5kYXRhKCAnY2xlYXItZmlsdGVyLXVybCcgKSApO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0Ly8gQWRkIHJhbmdlIGZpbHRlci5cblx0XHRcdFx0Y29uc3QgdXJsID0gJHJhbmdlTnVtYmVyLmRhdGEoICd1cmwnICkucmVwbGFjZSggJyUxcycsIG1pblZhbHVlICkucmVwbGFjZSggJyUycycsIG1heFZhbHVlICk7XG5cdFx0XHRcdHJlcXVlc3RGaWx0ZXIoIHVybCApO1xuXHRcdFx0fVxuXHRcdH0sIGRlbGF5ICkgKTtcblx0fSApO1xuXG5cdC8vIEhhbmRsZSByZW1vdmluZyB0aGUgYWN0aXZlIGZpbHRlcnMuXG5cdCR3Y2FwZk5hdkZpbHRlcnMub24oICdjbGljaycsICcud2NhcGYtYWN0aXZlLWZpbHRlcnMgLml0ZW06bm90KC5kaXNhYmxlZCknLCBmdW5jdGlvbiggZXZlbnQgKSB7XG5cdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcblxuXHRcdGNvbnN0ICRpdGVtICAgICAgID0gJCggdGhpcyApO1xuXHRcdGNvbnN0IGZpbHRlcktleSAgID0gJGl0ZW0uYXR0ciggJ2RhdGEtZmlsdGVyLWtleScgKTtcblx0XHRjb25zdCBmaWx0ZXJWYWx1ZSA9ICRpdGVtLmF0dHIoICdkYXRhLXZhbHVlJyApO1xuXG5cdFx0bWFrZVBhcmFtZXRlcnMoIGZpbHRlcktleSwgZmlsdGVyVmFsdWUsIHRydWUgKTtcblx0fSApO1xuXG5cdGZ1bmN0aW9uIHJlc2V0RmlsdGVycyggJGJ1dHRvbiApIHtcblx0XHRjb25zdCBfZmlsdGVyS2V5cyA9ICRidXR0b24uYXR0ciggJ2RhdGEta2V5cycgKTtcblxuXHRcdGlmICggISBfZmlsdGVyS2V5cyApIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHRjb25zdCBmaWx0ZXJLZXlzID0gX2ZpbHRlcktleXMuc3BsaXQoICcsJyApO1xuXG5cdFx0bGV0IHF1ZXJ5ID0gJyc7XG5cblx0XHQkLmVhY2goIGZpbHRlcktleXMsIGZ1bmN0aW9uKCBpLCBmaWx0ZXJLZXkgKSB7XG5cdFx0XHRpZiAoIHF1ZXJ5ICkge1xuXHRcdFx0XHRxdWVyeSA9IHJlbW92ZVF1ZXJ5U3RyaW5nUGFyYW1ldGVyKCBmaWx0ZXJLZXksIHF1ZXJ5ICk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRxdWVyeSA9IHJlbW92ZVF1ZXJ5U3RyaW5nUGFyYW1ldGVyKCBmaWx0ZXJLZXkgKTtcblx0XHRcdH1cblx0XHR9ICk7XG5cblx0XHQvLyBFbXB0eSBxdWVyeSBjYXVzZXMgaXNzdWUoZG9lc24ndCByZW1vdmUgdGhlIGZpbHRlciBrZXlzIGZyb20gdGhlIHVybCksXG5cdFx0Ly8gdGhpcyBpcyB3aHkgd2UgYXJlIHNldHRpbmcgdGhlIHBhZ2UgdXJsIGFzIHF1ZXJ5LlxuXHRcdGlmICggISBxdWVyeSApIHtcblx0XHRcdGNvbnN0IHByZXZVcmwgPSB3aW5kb3cubG9jYXRpb24uaHJlZjtcblx0XHRcdGNvbnN0IG5ld1VybCAgPSBwcmV2VXJsLnNwbGl0KCAnPycgKTtcblxuXHRcdFx0cXVlcnkgPSBuZXdVcmxbIDAgXTtcblx0XHR9XG5cblx0XHRoaXN0b3J5LnB1c2hTdGF0ZSgge30sICcnLCBxdWVyeSApO1xuXG5cdFx0ZmlsdGVyUHJvZHVjdHMoIHRydWUgKTtcblx0fVxuXG5cdC8vIENsZWFyL1Jlc2V0IGFsbCBmaWx0ZXJzLlxuXHQkYm9keS5vbiggJ3djYXBmLXJlc2V0LWZpbHRlcnMnLCBmdW5jdGlvbiggZSwgJGJ1dHRvbiApIHtcblx0XHRyZXNldEZpbHRlcnMoICRidXR0b24gKTtcblx0fSApO1xuXG5cdCRib2R5Lm9uKCAnY2xpY2snLCAnLndjYXBmLXJlc2V0LWZpbHRlcnMtYnRuJywgZnVuY3Rpb24oKSB7XG5cdFx0Y29uc3QgJGJ1dHRvbiA9ICQoIHRoaXMgKTtcblxuXHRcdHJlc2V0RmlsdGVycyggJGJ1dHRvbiApO1xuXHR9ICk7XG5cblx0JHdjYXBmTmF2RmlsdGVycy5vbiggJ2NsaWNrJywgJy53Y2FwZi1yZXNldC1maWx0ZXJzLWJ0bicsIGZ1bmN0aW9uKCBldmVudCApIHtcblx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXG5cdFx0Y29uc3QgJGJ1dHRvbiA9ICQoIHRoaXMgKTtcblxuXHRcdCRib2R5LnRyaWdnZXIoICd3Y2FwZi1yZXNldC1maWx0ZXJzJywgWyAkYnV0dG9uIF0gKTtcblx0fSApO1xuXG5cdCR3Y2FwZlNpbmdsZUZpbHRlcnMub24oICd3Y2FwZi1jbGVhci1maWx0ZXInLCBmdW5jdGlvbigpIHtcblx0XHRjb25zdCAkZmllbGQgICAgPSAkKCB0aGlzICk7XG5cdFx0Y29uc3QgZmllbGRJRCAgID0gJGZpZWxkLmF0dHIoICdkYXRhLWlkJyApO1xuXHRcdGNvbnN0IGZpZWxkRGF0YSA9IGZpZWxkc1sgZmllbGRJRCBdO1xuXHRcdGNvbnN0IGZpbHRlcktleSA9IGZpZWxkRGF0YS5maWx0ZXJLZXk7XG5cblx0XHRjb25zdCBxdWVyeSA9IHJlbW92ZVF1ZXJ5U3RyaW5nUGFyYW1ldGVyKCBmaWx0ZXJLZXkgKTtcblx0XHRoaXN0b3J5LnB1c2hTdGF0ZSgge30sICcnLCBxdWVyeSApO1xuXG5cdFx0ZmlsdGVyUHJvZHVjdHMoIHRydWUgKTtcblx0fSApO1xuXG5cdC8vIFJ1biBhamF4IGZpbHRlciB3aGVuIGJyb3dzZXIgaGlzdG9yeSBjaGFuZ2VzICh1c2VyIGdvZXMgYmFjayBvciBmb3J3YXJkKS5cblx0aWYgKCAkKCB3Y2FwZl9wYXJhbXMuc2hvcF9sb29wX2NvbnRhaW5lciApLmxlbmd0aCB8fCAkKCB3Y2FwZl9wYXJhbXMubm90X2ZvdW5kX2NvbnRhaW5lciApLmxlbmd0aCApIHtcblx0XHRpZiAoIHdjYXBmX3BhcmFtcy5hcHBseV9maWx0ZXJzX29uX2Jyb3dzZXJfaGlzdG9yeV9jaGFuZ2UgKSB7XG5cdFx0XHQkKCB3aW5kb3cgKS5iaW5kKCAncG9wc3RhdGUnLCBmdW5jdGlvbigpIHtcblx0XHRcdFx0ZmlsdGVyUHJvZHVjdHMoIHRydWUgKTtcblx0XHRcdH0gKTtcblx0XHR9XG5cdH1cblxuXHQvLyBUaGUgaG9vayB0aGF0IG1hbnVhbGx5IHJ1biB0aGUgYWpheCBmaWx0ZXJzIChjYW4gYmUgdXNlZnVsIGZvciBvdGhlciBwbHVnaW5zKS5cblx0JGJvZHkub24oICd3Y2FwZi1ydW4tZmlsdGVyLXByb2R1Y3RzJywgZnVuY3Rpb24oIGUsIGZvcmNlUmVSZW5kZXIgKSB7XG5cdFx0ZmlsdGVyUHJvZHVjdHMoIGZvcmNlUmVSZW5kZXIgKTtcblx0fSApO1xuXG5cdC8vIFRoZSBob29rIHRoYXQgcmVpbml0aWFsaXplIHRoZSBmaWx0ZXIgd2lkZ2V0cyAodG8gc2hvdyB0aGUgcHJldmlldyBpbiB0aGUgYmFja2VuZCkuXG5cdCRib2R5Lm9uKCAnaW5pdF9maWx0ZXJfd2lkZ2V0cycsIGZ1bmN0aW9uKCkge1xuXHRcdGluaXRDaG9zZW4oKTtcblx0XHRpbml0SGllcmFyY2h5QWNjb3JkaW9uKCk7XG5cdFx0aW5pdE5vVUlTbGlkZXIoKTtcblx0XHRpbml0RGF0ZXBpY2tlcigpO1xuXHR9ICk7XG5cblx0LyoqXG5cdCAqIE1ha2UgaXQgY29tcGF0aWJsZSB3aXRoIG90aGVyIHBsdWdpbnMuXG5cdCAqL1xuXHQkYm9keS5vbiggJ3djYXBmX2FmdGVyX3VwZGF0aW5nX3Byb2R1Y3RzJywgZnVuY3Rpb24oKSB7XG5cdFx0Ly8gd29vLXZhcmlhdGlvbi1zd2F0Y2hlc1xuXHRcdCQoIGRvY3VtZW50ICkudHJpZ2dlciggJ3dvb192YXJpYXRpb25fc3dhdGNoZXNfcHJvX2luaXQnICk7XG5cdH0gKTtcbn0gKTtcbiJdfQ==
