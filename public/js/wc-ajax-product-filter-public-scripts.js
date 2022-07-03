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
  'hierarchy_accordion_animation_speed': '',
  'hierarchy_accordion_animation_easing': '',
  'loading_element_class': '',
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
  'loading_animation_on': '',
  'scroll_window': '',
  'scroll_window_for': '',
  'scroll_window_when': '',
  'scroll_window_custom_element': '',
  'scroll_to_top_offset': ''
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
  var $wcapfDateFilters = $('.wcapf-date-range-filter');
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
          var query = removeQueryStringParameter(filterKey);
          history.pushState({}, '', query);
        } else {
          var filterValString = minValue + rangeValuesSeparator + maxValue;
          updateQueryStringParameter(filterKey, filterValString);
        }

        filterProducts();
        $body.trigger('wcapf-nouislider-after-filter-products', [$item, values]);
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

  initDatepicker();

  function initDefaultOrderBy() {
    var $container = $(wcapf_params.shop_loop_container); // Attach chosen.

    if (wcapf_params.attach_chosen_on_sorting) {
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
        updateQueryStringParameter(filter_key, order);
        filterProducts();
      });
    });
  }

  initDefaultOrderBy();

  function showLoadingAnimation() {
    var container;

    if ($(wcapf_params.shop_loop_container).length) {
      container = wcapf_params.shop_loop_container;
    } else if ($(wcapf_params.not_found_container).length) {
      container = wcapf_params.not_found_container;
    }

    if ('body' === wcapf_params.loading_animation_on) {
      container = wcapf_params.loading_animation_on;
      $(container).addClass('wcapf-results-loading');
    } // Show loading image.


    if ('none' !== wcapf_params.loading_animation_on) {
      var loadingMarkup = '<div class="' + wcapf_params.loading_element_class + '">' + '<span class="loading-img"></span>' + '</div>';
      $(loadingMarkup).prependTo(container);
    }
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
    var selectors = '.wcapf-labeled-nav .item, .wcapf-active-filters .item';
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
    if ('body' === wcapf_params.loading_animation_on) {
      $(wcapf_params.loading_animation_on).removeClass('wcapf-results-loading');
      var selector = '.' + wcapf_params.loading_element_class;
      $(wcapf_params.loading_animation_on).find(selector).remove();
    }
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

  function beforeUpdatingProducts() {
    resetLoadingAnimation();
    $body.trigger('wcapf_before_updating_products');
  } // Things are done after applying the filter like scroll to top.


  function afterUpdatingProducts() {
    initChosen();
    initHierarchyAccordion();
    initNoUISlider();
    initDatepicker();
    initDefaultOrderBy();
    enableInputs();

    if ('after' === wcapf_params.scroll_window_when) {
      scrollTo();
    }

    $body.trigger('wcapf_after_updating_products');
  } // The main filter function.


  function filterProducts() {
    var forceReRender = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
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
      beforeUpdatingProducts(); // Replace old shop loop with new one.

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

      afterUpdatingProducts();
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
    var selector = wcapf_params.pagination_container + ' a';

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
  } // Handle the filter request for list field.


  $wcapfNavFilters.on('change', '.wcapf-layered-nav [type="checkbox"], .wcapf-layered-nav [type="radio"]', function (event) {
    event.preventDefault();
    var $item = $(this);
    var filterValue = $item.val();
    handleFilterRequest($item, filterValue);
  }); // Handle the filter request for labeled item.

  $wcapfNavFilters.on('click', '.wcapf-labeled-nav .item:not(.disabled)', function (event) {
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
      var query = removeQueryStringParameter(filterKey);
      history.pushState({}, '', query);
    } else {
      var filterValString = filterValue.toString();
      updateQueryStringParameter(filterKey, filterValString);
    }

    filterProducts();
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
        var query = removeQueryStringParameter(filterKey);
        history.pushState({}, '', query);
      } else {
        var filterValString = minValue + rangeValuesSeparator + maxValue;
        updateQueryStringParameter(filterKey, filterValString);
      }

      filterProducts();
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
  });
  $body.on('wcapf-run-filter-products', function (e, forceReRender) {
    filterProducts(forceReRender);
  });

  if ($(wcapf_params.shop_loop_container).length || $(wcapf_params.not_found_container).length) {
    if (wcapf_params.apply_filters_on_browser_history_change) {
      $(window).bind('popstate', function () {
        filterProducts(true);
      });
    }
  }
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImZpbHRlci1mb3JtLmpzIl0sIm5hbWVzIjpbIndjYXBmX3BhcmFtcyIsImpRdWVyeSIsImRvY3VtZW50IiwicmVhZHkiLCIkIiwiJGJvZHkiLCJyYW5nZVZhbHVlc1NlcGFyYXRvciIsIl9kZWxheSIsInBhcnNlSW50IiwiZmlsdGVyX2lucHV0X2RlbGF5IiwiZGVsYXkiLCJmaWVsZHMiLCIkd2NhcGZTaW5nbGVGaWx0ZXJzIiwiJHdjYXBmTmF2RmlsdGVycyIsIiR3Y2FwZk51bWJlclJhbmdlRmlsdGVycyIsIiR3Y2FwZkRhdGVGaWx0ZXJzIiwiZWFjaCIsIiRmaWVsZCIsImlkIiwiYXR0ciIsIiR3cmFwcGVyIiwiZmluZCIsImZpbHRlcktleSIsIm11bHRpcGxlRmlsdGVyIiwiaW5pdENob3NlbiIsImNob3NlbiIsIiR0aGlzIiwib3B0aW9ucyIsIm5vUmVzdWx0c01lc3NhZ2UiLCJzZWFyY2hUaHJlc2hvbGQiLCJjaG9zZW5fbGliX3NlYXJjaF90aHJlc2hvbGQiLCJpbml0SGllcmFyY2h5QWNjb3JkaW9uIiwib24iLCIkY2hpbGQiLCJwYXJlbnQiLCJjaGlsZHJlbiIsInRvZ2dsZUNsYXNzIiwiZW5hYmxlX2FuaW1hdGlvbl9mb3JfaGllcmFyY2h5X2FjY29yZGlvbiIsInNsaWRlVG9nZ2xlIiwiaGllcmFyY2h5X2FjY29yZGlvbl9hbmltYXRpb25fc3BlZWQiLCJoaWVyYXJjaHlfYWNjb3JkaW9uX2FuaW1hdGlvbl9lYXNpbmciLCJ0b2dnbGUiLCJudW1iZXJfZm9ybWF0IiwibnVtYmVyIiwiZGVjaW1hbHMiLCJkZWNfcG9pbnQiLCJ0aG91c2FuZHNfc2VwIiwicmVwbGFjZSIsIm4iLCJpc0Zpbml0ZSIsInByZWMiLCJNYXRoIiwiYWJzIiwic2VwIiwiZGVjIiwicyIsInRvRml4ZWRGaXgiLCJrIiwicG93Iiwicm91bmQiLCJzcGxpdCIsImxlbmd0aCIsIkFycmF5Iiwiam9pbiIsImluaXROb1VJU2xpZGVyIiwibm9VaVNsaWRlciIsIiRpdGVtIiwiJHNsaWRlciIsImhhc0NsYXNzIiwic2xpZGVySWQiLCJkaXNwbGF5VmFsdWVzQXMiLCJyYW5nZU1pblZhbHVlIiwicGFyc2VGbG9hdCIsInJhbmdlTWF4VmFsdWUiLCJzdGVwIiwiZGVjaW1hbFBsYWNlcyIsInRob3VzYW5kU2VwYXJhdG9yIiwiZGVjaW1hbFNlcGFyYXRvciIsIm1pblZhbHVlIiwibWF4VmFsdWUiLCIkbWluVmFsdWUiLCIkbWF4VmFsdWUiLCJzbGlkZXIiLCJnZXRFbGVtZW50QnlJZCIsImNyZWF0ZSIsInN0YXJ0IiwiY29ubmVjdCIsImNzc1ByZWZpeCIsInJhbmdlIiwidmFsdWVzIiwiaHRtbCIsInZhbCIsInRyaWdnZXIiLCJmaWx0ZXJQcm9kdWN0c0FjY29yZGluZ1RvU2xpZGVyIiwicXVlcnkiLCJyZW1vdmVRdWVyeVN0cmluZ1BhcmFtZXRlciIsImhpc3RvcnkiLCJwdXNoU3RhdGUiLCJmaWx0ZXJWYWxTdHJpbmciLCJ1cGRhdGVRdWVyeVN0cmluZ1BhcmFtZXRlciIsImZpbHRlclByb2R1Y3RzIiwiY2xlYXJUaW1lb3V0IiwiZGF0YSIsInNldFRpbWVvdXQiLCJyZW1vdmVEYXRhIiwiZXZlbnQiLCJwcmV2ZW50RGVmYXVsdCIsIiRpbnB1dCIsInNldCIsImdldCIsImZpbHRlckJ5RGF0ZSIsIiR3Y2FwZkRhdGVGaWx0ZXIiLCJjbG9zZXN0IiwiaXNSYW5nZSIsImZpbHRlclZhbHVlIiwicnVuRmlsdGVyIiwiZnJvbSIsInRvIiwiaW5pdERhdGVwaWNrZXIiLCJkYXRlcGlja2VyIiwiZm9ybWF0IiwieWVhckRyb3Bkb3duIiwibW9udGhEcm9wZG93biIsIiRmcm9tIiwiJHRvIiwiZGF0ZUZvcm1hdCIsImNoYW5nZVllYXIiLCJjaGFuZ2VNb250aCIsImluaXREZWZhdWx0T3JkZXJCeSIsIiRjb250YWluZXIiLCJzaG9wX2xvb3BfY29udGFpbmVyIiwiYXR0YWNoX2Nob3Nlbl9vbl9zb3J0aW5nIiwic29ydGluZ19jb250cm9sIiwiJG9yZGVyaW5nRm9ybSIsInN1Ym1pdCIsImUiLCJvcmRlciIsImZpbHRlcl9rZXkiLCJzaG93TG9hZGluZ0FuaW1hdGlvbiIsImNvbnRhaW5lciIsIm5vdF9mb3VuZF9jb250YWluZXIiLCJsb2FkaW5nX2FuaW1hdGlvbl9vbiIsImFkZENsYXNzIiwibG9hZGluZ01hcmt1cCIsImxvYWRpbmdfZWxlbWVudF9jbGFzcyIsInByZXBlbmRUbyIsImRpc2FibGVOb1VpU2xpZGVycyIsImVsZW1lbnQiLCJzZXRBdHRyaWJ1dGUiLCJkaXNhYmxlTGFiZWxzIiwic2VsZWN0b3JzIiwiZGlzYWJsZUlucHV0cyIsImRpc2FibGVfaW5wdXRzX3doaWxlX2ZldGNoaW5nX3Jlc3VsdHMiLCJpbnB1dHMiLCJlbmFibGVOb1VpU2xpZGVycyIsInJlbW92ZUF0dHJpYnV0ZSIsImVuYWJsZUlucHV0cyIsInJlbW92ZUF0dHIiLCJyZXNldExvYWRpbmdBbmltYXRpb24iLCJyZW1vdmVDbGFzcyIsInNlbGVjdG9yIiwicmVtb3ZlIiwic2Nyb2xsVG8iLCJzY3JvbGxfd2luZG93Iiwic2Nyb2xsRm9yIiwic2Nyb2xsX3dpbmRvd19mb3IiLCJpc01vYmlsZSIsImlzX21vYmlsZSIsInByb2NlZWQiLCJhZGp1c3RpbmdPZmZzZXQiLCJvZmZzZXQiLCJzY3JvbGxfdG9fdG9wX29mZnNldCIsInNjcm9sbF93aW5kb3dfY3VzdG9tX2VsZW1lbnQiLCJ0b3AiLCJzdG9wIiwiYW5pbWF0ZSIsInNjcm9sbFRvcCIsInNjcm9sbF90b190b3Bfc3BlZWQiLCJzY3JvbGxfdG9fdG9wX2Vhc2luZyIsImJlZm9yZUZldGNoaW5nUHJvZHVjdHMiLCJzY3JvbGxfd2luZG93X3doZW4iLCJiZWZvcmVVcGRhdGluZ1Byb2R1Y3RzIiwiYWZ0ZXJVcGRhdGluZ1Byb2R1Y3RzIiwiZm9yY2VSZVJlbmRlciIsIndpbmRvdyIsImxvY2F0aW9uIiwiaHJlZiIsIiRkYXRhIiwiZmllbGRJRCIsIiRpbm5lciIsIl9maWVsZCIsImZpZWxkQ2xhc3NlcyIsInByZXNlcnZlX2hpZXJhcmNoeV9hY2NvcmRpb25fc3RhdGUiLCJpdGVtVmFsdWUiLCJ0b2dnbGVTZWxlY3RvciIsInVsU2VsZWN0b3IiLCJfY2xhc3NlcyIsInNob3ciLCJfaHRtbCIsInNvZnRMaW1pdFNlbGVjdG9yIiwidHJpbSIsIiRzaG9wTG9vcENvbnRhaW5lciIsIiRub3RGb3VuZENvbnRhaW5lciIsImdldFVybFZhcnMiLCJ1cmwiLCJ2YXJzIiwiaGFzaCIsInJlcGxhY2VBbGwiLCJoYXNoZXMiLCJzbGljZSIsImluZGV4T2YiLCJoTGVuZ3RoIiwiaSIsImZpeFBhZ2luYXRpb24iLCJwYXJhbXMiLCJjdXJyZW50UGFnZUluVXJsIiwiY3VycmVudFBhZ2VJblBhcmFtcyIsImtleSIsInZhbHVlIiwicHVzaEhpc3RvcnkiLCJyZSIsIlJlZ0V4cCIsInNlcGFyYXRvciIsInVybFdpdGhRdWVyeSIsIm1hdGNoIiwib2xkUGFyYW1zIiwib2xkUGFyYW1zTGVuZ3RoIiwiT2JqZWN0Iiwia2V5cyIsInN0YXJ0UG9zaXRpb24iLCJmaWx0ZXJLZXlQb3NpdGlvbiIsImNsZWFuVXJsIiwiY2xlYW5RdWVyeSIsIm5ld1BhcmFtcyIsIm1ha2VQYXJhbWV0ZXJzIiwiZm9yY2VSZXJlbmRlciIsInZhbHVlU2VwYXJhdG9yIiwibmV4dFZhbHVlcyIsImVtcHR5VmFsdWUiLCJwcmV2VmFsdWVzIiwicHJldlZhbHVlc0FycmF5IiwiZm91bmQiLCJpbkFycmF5Iiwic3BsaWNlIiwicHVzaCIsInNpbmdsZUZpbHRlciIsImVuYWJsZV9wYWdpbmF0aW9uX3ZpYV9hamF4IiwicGFnaW5hdGlvbl9jb250YWluZXIiLCJoYW5kbGVGaWx0ZXJSZXF1ZXN0IiwiZmllbGREYXRhIiwidG9TdHJpbmciLCJyYW5nZU51bWJlclNlbGVjdG9ycyIsIiRyYW5nZU51bWJlciIsInJlc2V0RmlsdGVycyIsIiRidXR0b24iLCJfZmlsdGVyS2V5cyIsImZpbHRlcktleXMiLCJwcmV2VXJsIiwibmV3VXJsIiwiYXBwbHlfZmlsdGVyc19vbl9icm93c2VyX2hpc3RvcnlfY2hhbmdlIiwi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Q29CLEVBQXBCLENBQXdCLG9CQUF4QixFQUE4QyxZQUFXO0FBQ3hELFFBQU1mLE1BQU0sR0FBTWIsQ0FBQyxDQUFFLElBQUYsQ0FBbkI7QUFDQSxRQUFNd0wsT0FBTyxHQUFLM0ssTUFBTSxDQUFDRSxJQUFQLENBQWEsU0FBYixDQUFsQjtBQUNBLFFBQU1zTyxTQUFTLEdBQUc5TyxNQUFNLENBQUVpTCxPQUFGLENBQXhCO0FBQ0EsUUFBTXRLLFNBQVMsR0FBR21PLFNBQVMsQ0FBQ25PLFNBQTVCO0FBRUEsUUFBTXdFLEtBQUssR0FBR0MsMEJBQTBCLENBQUV6RSxTQUFGLENBQXhDO0FBQ0EwRSxJQUFBQSxPQUFPLENBQUNDLFNBQVIsQ0FBbUIsRUFBbkIsRUFBdUIsRUFBdkIsRUFBMkJILEtBQTNCO0FBRUFNLElBQUFBLGNBQWMsQ0FBRSxJQUFGLENBQWQ7QUFDQSxHQVZEO0FBWUEvRixFQUFBQSxLQUFLLENBQUMyQixFQUFOLENBQVUsMkJBQVYsRUFBdUMsVUFBVXVHLENBQVYsRUFBYWdELGFBQWIsRUFBNkI7QUFDbkVuRixJQUFBQSxjQUFjLENBQUVtRixhQUFGLENBQWQ7QUFDQSxHQUZEOztBQUlBLE1BQUtuTCxDQUFDLENBQUVKLFlBQVksQ0FBQ2tJLG1CQUFmLENBQUQsQ0FBc0NyRSxNQUF0QyxJQUFnRHpELENBQUMsQ0FBRUosWUFBWSxDQUFDNEksbUJBQWYsQ0FBRCxDQUFzQy9FLE1BQTNGLEVBQW9HO0FBQ25HLFFBQUs3RCxZQUFZLENBQUNtUSx1Q0FBbEIsRUFBNEQ7QUFDM0QvUCxNQUFBQSxDQUFDLENBQUVvTCxNQUFGLENBQUQsQ0FBWTRFLElBQVosQ0FBa0IsVUFBbEIsRUFBOEIsWUFBVztBQUN4Q2hLLFFBQUFBLGNBQWMsQ0FBRSxJQUFGLENBQWQ7QUFDQSxPQUZEO0FBR0E7QUFDRDtBQUVELENBampDRCIsImZpbGUiOiJ3Yy1hamF4LXByb2R1Y3QtZmlsdGVyLXB1YmxpYy1zY3JpcHRzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBUaGUgZnJvbnRlbmQgZmlsdGVyIGZvcm0uXG4gKlxuICogQHNpbmNlICAgICAgMy4wLjBcbiAqIEBwYWNrYWdlICAgIHdjLWFqYXgtcHJvZHVjdC1maWx0ZXJcbiAqIEBzdWJwYWNrYWdlIHdjLWFqYXgtcHJvZHVjdC1maWx0ZXIvcHVibGljL3NyYy9qc1xuICogQGF1dGhvciAgICAgTWFpbnVsIEhhc3NhbiBNYWluXG4gKi9cblxuY29uc3Qgd2NhcGZfcGFyYW1zID0gd2NhcGZfcGFyYW1zIHx8IHtcblx0J2ZpbHRlcl9pbnB1dF9kZWxheSc6ICcnLFxuXHQnY2hvc2VuX2xpYl9zZWFyY2hfdGhyZXNob2xkJzogJycsXG5cdCdwcmVzZXJ2ZV9oaWVyYXJjaHlfYWNjb3JkaW9uX3N0YXRlJzogJycsXG5cdCdlbmFibGVfYW5pbWF0aW9uX2Zvcl9oaWVyYXJjaHlfYWNjb3JkaW9uJzogJycsXG5cdCdoaWVyYXJjaHlfYWNjb3JkaW9uX2FuaW1hdGlvbl9zcGVlZCc6ICcnLFxuXHQnaGllcmFyY2h5X2FjY29yZGlvbl9hbmltYXRpb25fZWFzaW5nJzogJycsXG5cdCdsb2FkaW5nX2VsZW1lbnRfY2xhc3MnOiAnJyxcblx0J3Njcm9sbF90b190b3Bfc3BlZWQnOiAnJyxcblx0J3Njcm9sbF90b190b3BfZWFzaW5nJzogJycsXG5cdCdpc19tb2JpbGUnOiAnJyxcblx0J2Rpc2FibGVfaW5wdXRzX3doaWxlX2ZldGNoaW5nX3Jlc3VsdHMnOiAnJyxcblx0J2FwcGx5X2ZpbHRlcnNfb25fYnJvd3Nlcl9oaXN0b3J5X2NoYW5nZSc6ICcnLFxuXHQnc2hvcF9sb29wX2NvbnRhaW5lcic6ICcnLFxuXHQnbm90X2ZvdW5kX2NvbnRhaW5lcic6ICcnLFxuXHQnZW5hYmxlX3BhZ2luYXRpb25fdmlhX2FqYXgnOiAnJyxcblx0J3BhZ2luYXRpb25fY29udGFpbmVyJzogJycsXG5cdCdzb3J0aW5nX2NvbnRyb2wnOiAnJyxcblx0J2F0dGFjaF9jaG9zZW5fb25fc29ydGluZyc6ICcnLFxuXHQnbG9hZGluZ19hbmltYXRpb25fb24nOiAnJyxcblx0J3Njcm9sbF93aW5kb3cnOiAnJyxcblx0J3Njcm9sbF93aW5kb3dfZm9yJzogJycsXG5cdCdzY3JvbGxfd2luZG93X3doZW4nOiAnJyxcblx0J3Njcm9sbF93aW5kb3dfY3VzdG9tX2VsZW1lbnQnOiAnJyxcblx0J3Njcm9sbF90b190b3Bfb2Zmc2V0JzogJycsXG59O1xuXG5qUXVlcnkoIGRvY3VtZW50ICkucmVhZHkoIGZ1bmN0aW9uKCAkICkge1xuXG5cdGNvbnN0ICRib2R5ID0gJCggJ2JvZHknICk7XG5cblx0Y29uc3QgcmFuZ2VWYWx1ZXNTZXBhcmF0b3IgPSAnfic7XG5cblx0Y29uc3QgX2RlbGF5ID0gcGFyc2VJbnQoIHdjYXBmX3BhcmFtcy5maWx0ZXJfaW5wdXRfZGVsYXkgKTtcblx0Y29uc3QgZGVsYXkgID0gX2RlbGF5ID49IDAgPyBfZGVsYXkgOiA4MDA7XG5cblx0Ly8gU3RvcmUgZmllbGRzJyBpZCBhbmQgZmlsdGVyIGluZm9ybWF0aW9uLlxuXHRjb25zdCBmaWVsZHMgPSB7fTtcblxuXHRjb25zdCAkd2NhcGZTaW5nbGVGaWx0ZXJzICAgICAgPSAkKCAnLndjYXBmLXNpbmdsZS1maWx0ZXInICk7XG5cdGNvbnN0ICR3Y2FwZk5hdkZpbHRlcnMgICAgICAgICA9ICQoICcud2NhcGYtbmF2LWZpbHRlcicgKTtcblx0Y29uc3QgJHdjYXBmTnVtYmVyUmFuZ2VGaWx0ZXJzID0gJCggJy53Y2FwZi1udW1iZXItcmFuZ2UtZmlsdGVyJyApO1xuXHRjb25zdCAkd2NhcGZEYXRlRmlsdGVycyAgICAgICAgPSAkKCAnLndjYXBmLWRhdGUtcmFuZ2UtZmlsdGVyJyApO1xuXG5cdCR3Y2FwZlNpbmdsZUZpbHRlcnMuZWFjaCggZnVuY3Rpb24oKSB7XG5cdFx0Y29uc3QgJGZpZWxkICAgICAgICAgPSAkKCB0aGlzICk7XG5cdFx0Y29uc3QgaWQgICAgICAgICAgICAgPSAkZmllbGQuYXR0ciggJ2RhdGEtaWQnICk7XG5cdFx0Y29uc3QgJHdyYXBwZXIgICAgICAgPSAkZmllbGQuZmluZCggJy53Y2FwZi1maWVsZC1pbm5lciA+IGRpdicgKTtcblx0XHRjb25zdCBmaWx0ZXJLZXkgICAgICA9ICR3cmFwcGVyLmF0dHIoICdkYXRhLWZpbHRlci1rZXknICk7XG5cdFx0Y29uc3QgbXVsdGlwbGVGaWx0ZXIgPSBwYXJzZUludCggJHdyYXBwZXIuYXR0ciggJ2RhdGEtbXVsdGlwbGUtZmlsdGVyJyApICk7XG5cblx0XHRmaWVsZHNbIGlkIF0gPSB7XG5cdFx0XHRmaWx0ZXJLZXk6IGZpbHRlcktleSxcblx0XHRcdG11bHRpcGxlRmlsdGVyOiBtdWx0aXBsZUZpbHRlclxuXHRcdH07XG5cdH0gKTtcblxuXHQvLyBJbml0aWFsaXplIGpRdWVyeSBjaG9zZW4gbGlicmFyeS5cblx0ZnVuY3Rpb24gaW5pdENob3NlbigpIHtcblx0XHRpZiAoICEgalF1ZXJ5KCkuY2hvc2VuICkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdCR3Y2FwZk5hdkZpbHRlcnMuZmluZCggJy53Y2FwZi1jaG9zZW4tc2VsZWN0JyApLmVhY2goIGZ1bmN0aW9uKCkge1xuXHRcdFx0Y29uc3QgJHRoaXMgICA9ICQoIHRoaXMgKTtcblx0XHRcdGNvbnN0IG9wdGlvbnMgPSB7fTtcblxuXHRcdFx0Y29uc3Qgbm9SZXN1bHRzTWVzc2FnZSA9ICR0aGlzLmF0dHIoICdkYXRhLW5vLXJlc3VsdHMtbWVzc2FnZScgKTtcblxuXHRcdFx0aWYgKCBub1Jlc3VsdHNNZXNzYWdlICkge1xuXHRcdFx0XHRvcHRpb25zWyAnbm9fcmVzdWx0c190ZXh0JyBdID0gbm9SZXN1bHRzTWVzc2FnZTtcblx0XHRcdH1cblxuXHRcdFx0Y29uc3Qgc2VhcmNoVGhyZXNob2xkID0gcGFyc2VJbnQoIHdjYXBmX3BhcmFtcy5jaG9zZW5fbGliX3NlYXJjaF90aHJlc2hvbGQgKTtcblxuXHRcdFx0aWYgKCBzZWFyY2hUaHJlc2hvbGQgKSB7XG5cdFx0XHRcdG9wdGlvbnNbICdkaXNhYmxlX3NlYXJjaF90aHJlc2hvbGQnIF0gPSBzZWFyY2hUaHJlc2hvbGQ7XG5cdFx0XHR9XG5cblx0XHRcdCR0aGlzLmNob3Nlbiggb3B0aW9ucyApO1xuXHRcdH0gKTtcblx0fVxuXG5cdGluaXRDaG9zZW4oKTtcblxuXHQvLyBJbml0aWFsaXplIGhpZXJhcmNoeSBhY2NvcmRpb24uXG5cdGZ1bmN0aW9uIGluaXRIaWVyYXJjaHlBY2NvcmRpb24oKSB7XG5cdFx0JHdjYXBmTmF2RmlsdGVycy5maW5kKCAnLmhpZXJhcmNoeS1hY2NvcmRpb24tdG9nZ2xlJyApLm9uKCAnY2xpY2snLCBmdW5jdGlvbigpIHtcblx0XHRcdGNvbnN0ICR0aGlzICA9ICQoIHRoaXMgKTtcblx0XHRcdGNvbnN0ICRjaGlsZCA9ICR0aGlzLnBhcmVudCggJ2xpJyApLmNoaWxkcmVuKCAndWwnICk7XG5cblx0XHRcdCR0aGlzLnRvZ2dsZUNsYXNzKCAnYWN0aXZlJyApO1xuXG5cdFx0XHRpZiAoIHdjYXBmX3BhcmFtcy5lbmFibGVfYW5pbWF0aW9uX2Zvcl9oaWVyYXJjaHlfYWNjb3JkaW9uICkge1xuXHRcdFx0XHQkY2hpbGQuc2xpZGVUb2dnbGUoXG5cdFx0XHRcdFx0d2NhcGZfcGFyYW1zLmhpZXJhcmNoeV9hY2NvcmRpb25fYW5pbWF0aW9uX3NwZWVkLFxuXHRcdFx0XHRcdHdjYXBmX3BhcmFtcy5oaWVyYXJjaHlfYWNjb3JkaW9uX2FuaW1hdGlvbl9lYXNpbmdcblx0XHRcdFx0KTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdCRjaGlsZC50b2dnbGUoKTtcblx0XHRcdH1cblx0XHR9ICk7XG5cdH1cblxuXHRpbml0SGllcmFyY2h5QWNjb3JkaW9uKCk7XG5cblx0LyoqXG5cdCAqIEBzb3VyY2UgaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9hLzM0MTQxODEzXG5cdCAqXG5cdCAqIEBwYXJhbSBudW1iZXJcblx0ICogQHBhcmFtIGRlY2ltYWxzXG5cdCAqIEBwYXJhbSBkZWNfcG9pbnRcblx0ICogQHBhcmFtIHRob3VzYW5kc19zZXBcblx0ICpcblx0ICogQHJldHVybnMge3N0cmluZ31cblx0ICovXG5cdGZ1bmN0aW9uIG51bWJlcl9mb3JtYXQoIG51bWJlciwgZGVjaW1hbHMsIGRlY19wb2ludCwgdGhvdXNhbmRzX3NlcCApIHtcblx0XHQvLyBTdHJpcCBhbGwgY2hhcmFjdGVycyBidXQgbnVtZXJpY2FsIG9uZXMuXG5cdFx0bnVtYmVyID0gKCBudW1iZXIgKyAnJyApLnJlcGxhY2UoIC9bXlxcZCtcXC1FZS5dL2csICcnICk7XG5cblx0XHRjb25zdCBuICAgID0gISBpc0Zpbml0ZSggK251bWJlciApID8gMCA6ICtudW1iZXI7XG5cdFx0Y29uc3QgcHJlYyA9ICEgaXNGaW5pdGUoICtkZWNpbWFscyApID8gMCA6IE1hdGguYWJzKCBkZWNpbWFscyApO1xuXHRcdGNvbnN0IHNlcCAgPSAoIHR5cGVvZiB0aG91c2FuZHNfc2VwID09PSAndW5kZWZpbmVkJyApID8gJywnIDogdGhvdXNhbmRzX3NlcDtcblx0XHRjb25zdCBkZWMgID0gKCB0eXBlb2YgZGVjX3BvaW50ID09PSAndW5kZWZpbmVkJyApID8gJy4nIDogZGVjX3BvaW50O1xuXG5cdFx0bGV0IHM7XG5cblx0XHRjb25zdCB0b0ZpeGVkRml4ID0gZnVuY3Rpb24oIG4sIHByZWMgKSB7XG5cdFx0XHRjb25zdCBrID0gTWF0aC5wb3coIDEwLCBwcmVjICk7XG5cdFx0XHRyZXR1cm4gJycgKyBNYXRoLnJvdW5kKCBuICogayApIC8gaztcblx0XHR9O1xuXG5cdFx0Ly8gRml4IGZvciBJRSBwYXJzZUZsb2F0KDAuNTUpLnRvRml4ZWQoMCkgPSAwO1xuXHRcdHMgPSAoIHByZWMgPyB0b0ZpeGVkRml4KCBuLCBwcmVjICkgOiAnJyArIE1hdGgucm91bmQoIG4gKSApLnNwbGl0KCAnLicgKTtcblxuXHRcdGlmICggc1sgMCBdLmxlbmd0aCA+IDMgKSB7XG5cdFx0XHRzWyAwIF0gPSBzWyAwIF0ucmVwbGFjZSggL1xcQig/PSg/OlxcZHszfSkrKD8hXFxkKSkvZywgc2VwICk7XG5cdFx0fVxuXG5cdFx0aWYgKCAoIHNbIDEgXSB8fCAnJyApLmxlbmd0aCA8IHByZWMgKSB7XG5cdFx0XHRzWyAxIF0gPSBzWyAxIF0gfHwgJyc7XG5cdFx0XHRzWyAxIF0gKz0gbmV3IEFycmF5KCBwcmVjIC0gc1sgMSBdLmxlbmd0aCArIDEgKS5qb2luKCAnMCcgKTtcblx0XHR9XG5cblx0XHRyZXR1cm4gcy5qb2luKCBkZWMgKTtcblx0fVxuXG5cdC8vIEluaXRpYWxpemUgbm9VSVNsaWRlci5cblx0ZnVuY3Rpb24gaW5pdE5vVUlTbGlkZXIoKSB7XG5cdFx0aWYgKCAndW5kZWZpbmVkJyA9PT0gdHlwZW9mIG5vVWlTbGlkZXIgKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0JHdjYXBmTnVtYmVyUmFuZ2VGaWx0ZXJzLmZpbmQoICcud2NhcGYtcmFuZ2Utc2xpZGVyJyApLmVhY2goIGZ1bmN0aW9uKCkge1xuXHRcdFx0Y29uc3QgJGl0ZW0gPSAkKCB0aGlzICk7XG5cblx0XHRcdGNvbnN0IGZpbHRlcktleSA9ICRpdGVtLmF0dHIoICdkYXRhLWZpbHRlci1rZXknICk7XG5cdFx0XHRjb25zdCAkc2xpZGVyICAgPSAkaXRlbS5maW5kKCAnLndjYXBmLW5vdWktc2xpZGVyJyApO1xuXG5cdFx0XHQvLyBJZiBzbGlkZXIgaXMgYWxyZWFkeSBpbml0aWFsaXplZCB0aGVuIGRvbid0IHJlaW5pdGlhbGl6ZSBhZ2Fpbi5cblx0XHRcdGlmICggJHNsaWRlci5oYXNDbGFzcyggJ3djYXBmLW5vdWktdGFyZ2V0JyApICkge1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdGNvbnN0IHNsaWRlcklkICAgICAgICAgID0gJHNsaWRlci5hdHRyKCAnaWQnICk7XG5cdFx0XHRjb25zdCBkaXNwbGF5VmFsdWVzQXMgICA9ICRpdGVtLmF0dHIoICdkYXRhLWRpc3BsYXktdmFsdWVzLWFzJyApO1xuXHRcdFx0Y29uc3QgcmFuZ2VNaW5WYWx1ZSAgICAgPSBwYXJzZUZsb2F0KCAkaXRlbS5hdHRyKCAnZGF0YS1yYW5nZS1taW4tdmFsdWUnICkgKTtcblx0XHRcdGNvbnN0IHJhbmdlTWF4VmFsdWUgICAgID0gcGFyc2VGbG9hdCggJGl0ZW0uYXR0ciggJ2RhdGEtcmFuZ2UtbWF4LXZhbHVlJyApICk7XG5cdFx0XHRjb25zdCBzdGVwICAgICAgICAgICAgICA9IHBhcnNlRmxvYXQoICRpdGVtLmF0dHIoICdkYXRhLXN0ZXAnICkgKTtcblx0XHRcdGNvbnN0IGRlY2ltYWxQbGFjZXMgICAgID0gJGl0ZW0uYXR0ciggJ2RhdGEtZGVjaW1hbC1wbGFjZXMnICk7XG5cdFx0XHRjb25zdCB0aG91c2FuZFNlcGFyYXRvciA9ICRpdGVtLmF0dHIoICdkYXRhLXRob3VzYW5kLXNlcGFyYXRvcicgKTtcblx0XHRcdGNvbnN0IGRlY2ltYWxTZXBhcmF0b3IgID0gJGl0ZW0uYXR0ciggJ2RhdGEtZGVjaW1hbC1zZXBhcmF0b3InICk7XG5cdFx0XHRjb25zdCBtaW5WYWx1ZSAgICAgICAgICA9IHBhcnNlRmxvYXQoICRpdGVtLmF0dHIoICdkYXRhLW1pbi12YWx1ZScgKSApO1xuXHRcdFx0Y29uc3QgbWF4VmFsdWUgICAgICAgICAgPSBwYXJzZUZsb2F0KCAkaXRlbS5hdHRyKCAnZGF0YS1tYXgtdmFsdWUnICkgKTtcblx0XHRcdGNvbnN0ICRtaW5WYWx1ZSAgICAgICAgID0gJGl0ZW0uZmluZCggJy5taW4tdmFsdWUnICk7XG5cdFx0XHRjb25zdCAkbWF4VmFsdWUgICAgICAgICA9ICRpdGVtLmZpbmQoICcubWF4LXZhbHVlJyApO1xuXG5cdFx0XHRjb25zdCBzbGlkZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCggc2xpZGVySWQgKTtcblxuXHRcdFx0bm9VaVNsaWRlci5jcmVhdGUoIHNsaWRlciwge1xuXHRcdFx0XHRzdGFydDogWyBtaW5WYWx1ZSwgbWF4VmFsdWUgXSxcblx0XHRcdFx0c3RlcCxcblx0XHRcdFx0Y29ubmVjdDogdHJ1ZSxcblx0XHRcdFx0Y3NzUHJlZml4OiAnd2NhcGYtbm91aS0nLFxuXHRcdFx0XHRyYW5nZToge1xuXHRcdFx0XHRcdCdtaW4nOiByYW5nZU1pblZhbHVlLFxuXHRcdFx0XHRcdCdtYXgnOiByYW5nZU1heFZhbHVlLFxuXHRcdFx0XHR9XG5cdFx0XHR9ICk7XG5cblx0XHRcdHNsaWRlci5ub1VpU2xpZGVyLm9uKCAndXBkYXRlJywgZnVuY3Rpb24oIHZhbHVlcyApIHtcblx0XHRcdFx0Y29uc3QgbWluVmFsdWUgPSBudW1iZXJfZm9ybWF0KCB2YWx1ZXNbIDAgXSwgZGVjaW1hbFBsYWNlcywgZGVjaW1hbFNlcGFyYXRvciwgdGhvdXNhbmRTZXBhcmF0b3IgKTtcblx0XHRcdFx0Y29uc3QgbWF4VmFsdWUgPSBudW1iZXJfZm9ybWF0KCB2YWx1ZXNbIDEgXSwgZGVjaW1hbFBsYWNlcywgZGVjaW1hbFNlcGFyYXRvciwgdGhvdXNhbmRTZXBhcmF0b3IgKTtcblxuXHRcdFx0XHRpZiAoICdwbGFpbl90ZXh0JyA9PT0gZGlzcGxheVZhbHVlc0FzICkge1xuXHRcdFx0XHRcdCRtaW5WYWx1ZS5odG1sKCBtaW5WYWx1ZSApO1xuXHRcdFx0XHRcdCRtYXhWYWx1ZS5odG1sKCBtYXhWYWx1ZSApO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdCRtaW5WYWx1ZS52YWwoIG1pblZhbHVlICk7XG5cdFx0XHRcdFx0JG1heFZhbHVlLnZhbCggbWF4VmFsdWUgKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdCRib2R5LnRyaWdnZXIoICd3Y2FwZi1ub3Vpc2xpZGVyLXVwZGF0ZScsIFsgJGl0ZW0sIHZhbHVlcyBdICk7XG5cdFx0XHR9ICk7XG5cblx0XHRcdGZ1bmN0aW9uIGZpbHRlclByb2R1Y3RzQWNjb3JkaW5nVG9TbGlkZXIoIHZhbHVlcyApIHtcblx0XHRcdFx0JGJvZHkudHJpZ2dlciggJ3djYXBmLW5vdWlzbGlkZXItYmVmb3JlLWZpbHRlci1wcm9kdWN0cycsIFsgJGl0ZW0sIHZhbHVlcyBdICk7XG5cblx0XHRcdFx0Y29uc3QgbWluVmFsdWUgPSBwYXJzZUZsb2F0KCB2YWx1ZXNbIDAgXSApO1xuXHRcdFx0XHRjb25zdCBtYXhWYWx1ZSA9IHBhcnNlRmxvYXQoIHZhbHVlc1sgMSBdICk7XG5cblx0XHRcdFx0aWYgKCBtaW5WYWx1ZSA9PT0gcmFuZ2VNaW5WYWx1ZSAmJiBtYXhWYWx1ZSA9PT0gcmFuZ2VNYXhWYWx1ZSApIHtcblx0XHRcdFx0XHRjb25zdCBxdWVyeSA9IHJlbW92ZVF1ZXJ5U3RyaW5nUGFyYW1ldGVyKCBmaWx0ZXJLZXkgKTtcblx0XHRcdFx0XHRoaXN0b3J5LnB1c2hTdGF0ZSgge30sICcnLCBxdWVyeSApO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdGNvbnN0IGZpbHRlclZhbFN0cmluZyA9IG1pblZhbHVlICsgcmFuZ2VWYWx1ZXNTZXBhcmF0b3IgKyBtYXhWYWx1ZTtcblx0XHRcdFx0XHR1cGRhdGVRdWVyeVN0cmluZ1BhcmFtZXRlciggZmlsdGVyS2V5LCBmaWx0ZXJWYWxTdHJpbmcgKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGZpbHRlclByb2R1Y3RzKCk7XG5cblx0XHRcdFx0JGJvZHkudHJpZ2dlciggJ3djYXBmLW5vdWlzbGlkZXItYWZ0ZXItZmlsdGVyLXByb2R1Y3RzJywgWyAkaXRlbSwgdmFsdWVzIF0gKTtcblx0XHRcdH1cblxuXHRcdFx0c2xpZGVyLm5vVWlTbGlkZXIub24oICdjaGFuZ2UnLCBmdW5jdGlvbiggdmFsdWVzICkge1xuXHRcdFx0XHQvLyBDbGVhciBhbnkgcHJldmlvdXNseSBzZXQgdGltZXIgYmVmb3JlIHNldHRpbmcgYSBmcmVzaCBvbmVcblx0XHRcdFx0Y2xlYXJUaW1lb3V0KCAkaXRlbS5kYXRhKCAndGltZXInICkgKTtcblxuXHRcdFx0XHQkaXRlbS5kYXRhKCAndGltZXInLCBzZXRUaW1lb3V0KCBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHQkaXRlbS5yZW1vdmVEYXRhKCAndGltZXInICk7XG5cblx0XHRcdFx0XHRmaWx0ZXJQcm9kdWN0c0FjY29yZGluZ1RvU2xpZGVyKCB2YWx1ZXMgKTtcblx0XHRcdFx0fSwgZGVsYXkgKSApO1xuXHRcdFx0fSApO1xuXG5cdFx0XHQkbWluVmFsdWUub24oICdpbnB1dCcsIGZ1bmN0aW9uKCBldmVudCApIHtcblx0XHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcblxuXHRcdFx0XHRjb25zdCAkaW5wdXQgPSAkKCB0aGlzICk7XG5cblx0XHRcdFx0Ly8gQ2xlYXIgYW55IHByZXZpb3VzbHkgc2V0IHRpbWVyIGJlZm9yZSBzZXR0aW5nIGEgZnJlc2ggb25lXG5cdFx0XHRcdGNsZWFyVGltZW91dCggJGlucHV0LmRhdGEoICd0aW1lcicgKSApO1xuXG5cdFx0XHRcdCRpbnB1dC5kYXRhKCAndGltZXInLCBzZXRUaW1lb3V0KCBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHQkaW5wdXQucmVtb3ZlRGF0YSggJ3RpbWVyJyApO1xuXG5cdFx0XHRcdFx0Y29uc3QgbWluVmFsdWUgPSAkaW5wdXQudmFsKCk7XG5cblx0XHRcdFx0XHRzbGlkZXIubm9VaVNsaWRlci5zZXQoIFsgbWluVmFsdWUsIG51bGwgXSApO1xuXG5cdFx0XHRcdFx0ZmlsdGVyUHJvZHVjdHNBY2NvcmRpbmdUb1NsaWRlciggc2xpZGVyLm5vVWlTbGlkZXIuZ2V0KCkgKTtcblx0XHRcdFx0fSwgZGVsYXkgKSApO1xuXHRcdFx0fSApO1xuXG5cdFx0XHQkbWF4VmFsdWUub24oICdpbnB1dCcsIGZ1bmN0aW9uKCBldmVudCApIHtcblx0XHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcblxuXHRcdFx0XHRjb25zdCAkaW5wdXQgPSAkKCB0aGlzICk7XG5cblx0XHRcdFx0Ly8gQ2xlYXIgYW55IHByZXZpb3VzbHkgc2V0IHRpbWVyIGJlZm9yZSBzZXR0aW5nIGEgZnJlc2ggb25lXG5cdFx0XHRcdGNsZWFyVGltZW91dCggJGlucHV0LmRhdGEoICd0aW1lcicgKSApO1xuXG5cdFx0XHRcdCRpbnB1dC5kYXRhKCAndGltZXInLCBzZXRUaW1lb3V0KCBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHQkaW5wdXQucmVtb3ZlRGF0YSggJ3RpbWVyJyApO1xuXG5cdFx0XHRcdFx0Y29uc3QgbWF4VmFsdWUgPSAkaW5wdXQudmFsKCk7XG5cblx0XHRcdFx0XHRzbGlkZXIubm9VaVNsaWRlci5zZXQoIFsgbnVsbCwgbWF4VmFsdWUgXSApO1xuXG5cdFx0XHRcdFx0ZmlsdGVyUHJvZHVjdHNBY2NvcmRpbmdUb1NsaWRlciggc2xpZGVyLm5vVWlTbGlkZXIuZ2V0KCkgKTtcblx0XHRcdFx0fSwgZGVsYXkgKSApO1xuXHRcdFx0fSApO1xuXHRcdH0gKTtcblx0fVxuXG5cdGluaXROb1VJU2xpZGVyKCk7XG5cblx0ZnVuY3Rpb24gZmlsdGVyQnlEYXRlKCAkaW5wdXQgKSB7XG5cdFx0Y29uc3QgJHdjYXBmRGF0ZUZpbHRlciA9ICRpbnB1dC5jbG9zZXN0KCAnLndjYXBmLWRhdGUtaW5wdXQnICk7XG5cdFx0Y29uc3QgZmlsdGVyS2V5ICAgICAgICA9ICR3Y2FwZkRhdGVGaWx0ZXIuYXR0ciggJ2RhdGEtZmlsdGVyLWtleScgKTtcblx0XHRjb25zdCBpc1JhbmdlICAgICAgICAgID0gJHdjYXBmRGF0ZUZpbHRlci5hdHRyKCAnZGF0YS1pcy1yYW5nZScgKTtcblxuXHRcdGxldCBmaWx0ZXJWYWx1ZSA9ICcnO1xuXHRcdGxldCBydW5GaWx0ZXIgICA9IGZhbHNlO1xuXG5cdFx0Ly8gQ2xlYXIgYW55IHByZXZpb3VzbHkgc2V0IHRpbWVyIGJlZm9yZSBzZXR0aW5nIGEgZnJlc2ggb25lXG5cdFx0Y2xlYXJUaW1lb3V0KCAkd2NhcGZEYXRlRmlsdGVyLmRhdGEoICd0aW1lcicgKSApO1xuXG5cdFx0aWYgKCBpc1JhbmdlICkge1xuXHRcdFx0Y29uc3QgZnJvbSA9ICR3Y2FwZkRhdGVGaWx0ZXIuZmluZCggJy5kYXRlLWZyb20taW5wdXQnICkudmFsKCk7XG5cdFx0XHRjb25zdCB0byAgID0gJHdjYXBmRGF0ZUZpbHRlci5maW5kKCAnLmRhdGUtdG8taW5wdXQnICkudmFsKCk7XG5cblx0XHRcdGlmICggZnJvbSAmJiB0byApIHtcblx0XHRcdFx0ZmlsdGVyVmFsdWUgPSBmcm9tICsgcmFuZ2VWYWx1ZXNTZXBhcmF0b3IgKyB0bztcblx0XHRcdFx0cnVuRmlsdGVyICAgPSB0cnVlO1xuXHRcdFx0fSBlbHNlIGlmICggISBmcm9tICYmICEgdG8gKSB7XG5cdFx0XHRcdHJ1bkZpbHRlciA9IHRydWU7XG5cdFx0XHR9XG5cdFx0fSBlbHNlIHtcblx0XHRcdGNvbnN0IGZyb20gPSAkd2NhcGZEYXRlRmlsdGVyLmZpbmQoICcuZGF0ZS1mcm9tLWlucHV0JyApLnZhbCgpO1xuXG5cdFx0XHRpZiAoIGZyb20gKSB7XG5cdFx0XHRcdGZpbHRlclZhbHVlID0gZnJvbTtcblx0XHRcdFx0cnVuRmlsdGVyICAgPSB0cnVlO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0cnVuRmlsdGVyID0gdHJ1ZTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHRpZiAoIHJ1bkZpbHRlciApIHtcblx0XHRcdCR3Y2FwZkRhdGVGaWx0ZXIuZGF0YSggJ3RpbWVyJywgc2V0VGltZW91dCggZnVuY3Rpb24oKSB7XG5cdFx0XHRcdCR3Y2FwZkRhdGVGaWx0ZXIucmVtb3ZlRGF0YSggJ3RpbWVyJyApO1xuXG5cdFx0XHRcdGlmICggZmlsdGVyVmFsdWUgKSB7XG5cdFx0XHRcdFx0dXBkYXRlUXVlcnlTdHJpbmdQYXJhbWV0ZXIoIGZpbHRlcktleSwgZmlsdGVyVmFsdWUgKTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRjb25zdCBxdWVyeSA9IHJlbW92ZVF1ZXJ5U3RyaW5nUGFyYW1ldGVyKCBmaWx0ZXJLZXkgKTtcblx0XHRcdFx0XHRoaXN0b3J5LnB1c2hTdGF0ZSgge30sICcnLCBxdWVyeSApO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0ZmlsdGVyUHJvZHVjdHMoKTtcblx0XHRcdH0sIGRlbGF5ICkgKTtcblx0XHR9XG5cdH1cblxuXHRmdW5jdGlvbiBpbml0RGF0ZXBpY2tlcigpIHtcblx0XHRpZiAoICEgalF1ZXJ5KCkuZGF0ZXBpY2tlciApIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHRjb25zdCAkd2NhcGZEYXRlRmlsdGVyID0gJHdjYXBmRGF0ZUZpbHRlcnMuZmluZCggJy53Y2FwZi1kYXRlLWlucHV0JyApO1xuXG5cdFx0Y29uc3QgZm9ybWF0ICAgICAgICA9ICR3Y2FwZkRhdGVGaWx0ZXIuYXR0ciggJ2RhdGEtZGF0ZS1mb3JtYXQnICk7XG5cdFx0Y29uc3QgeWVhckRyb3Bkb3duICA9ICR3Y2FwZkRhdGVGaWx0ZXIuYXR0ciggJ2RhdGEtZGF0ZS1waWNrZXIteWVhci1kcm9wZG93bicgKTtcblx0XHRjb25zdCBtb250aERyb3Bkb3duID0gJHdjYXBmRGF0ZUZpbHRlci5hdHRyKCAnZGF0YS1kYXRlLXBpY2tlci1tb250aC1kcm9wZG93bicgKTtcblxuXHRcdGNvbnN0ICRmcm9tID0gJHdjYXBmRGF0ZUZpbHRlci5maW5kKCAnLmRhdGUtZnJvbS1pbnB1dCcgKTtcblx0XHRjb25zdCAkdG8gICA9ICR3Y2FwZkRhdGVGaWx0ZXIuZmluZCggJy5kYXRlLXRvLWlucHV0JyApO1xuXG5cdFx0JGZyb20uZGF0ZXBpY2tlcigge1xuXHRcdFx0ZGF0ZUZvcm1hdDogZm9ybWF0LFxuXHRcdFx0Y2hhbmdlWWVhcjogeWVhckRyb3Bkb3duLFxuXHRcdFx0Y2hhbmdlTW9udGg6IG1vbnRoRHJvcGRvd24sXG5cdFx0fSApO1xuXG5cdFx0JHRvLmRhdGVwaWNrZXIoIHtcblx0XHRcdGRhdGVGb3JtYXQ6IGZvcm1hdCxcblx0XHRcdGNoYW5nZVllYXI6IHllYXJEcm9wZG93bixcblx0XHRcdGNoYW5nZU1vbnRoOiBtb250aERyb3Bkb3duLFxuXHRcdH0gKTtcblxuXHRcdCRmcm9tLm9uKCAnY2hhbmdlJywgZnVuY3Rpb24oKSB7XG5cdFx0XHRjb25zdCAkaW5wdXQgPSAkKCB0aGlzICk7XG5cdFx0XHRmaWx0ZXJCeURhdGUoICRpbnB1dCApO1xuXHRcdH0gKTtcblxuXHRcdCR0by5vbiggJ2NoYW5nZScsIGZ1bmN0aW9uKCkge1xuXHRcdFx0Y29uc3QgJGlucHV0ID0gJCggdGhpcyApO1xuXHRcdFx0ZmlsdGVyQnlEYXRlKCAkaW5wdXQgKTtcblx0XHR9ICk7XG5cdH1cblxuXHRpbml0RGF0ZXBpY2tlcigpO1xuXG5cdGZ1bmN0aW9uIGluaXREZWZhdWx0T3JkZXJCeSgpIHtcblx0XHRjb25zdCAkY29udGFpbmVyID0gJCggd2NhcGZfcGFyYW1zLnNob3BfbG9vcF9jb250YWluZXIgKTtcblxuXHRcdC8vIEF0dGFjaCBjaG9zZW4uXG5cdFx0aWYgKCB3Y2FwZl9wYXJhbXMuYXR0YWNoX2Nob3Nlbl9vbl9zb3J0aW5nICkge1xuXHRcdFx0aWYgKCBqUXVlcnkoKS5jaG9zZW4gKSB7XG5cdFx0XHRcdCRjb250YWluZXIuZmluZCggJy53b29jb21tZXJjZS1vcmRlcmluZyBzZWxlY3Qub3JkZXJieScgKS5jaG9zZW4oIHtcblx0XHRcdFx0XHQnZGlzYWJsZV9zZWFyY2hfdGhyZXNob2xkJzogMTUsXG5cdFx0XHRcdH0gKTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHRpZiAoICEgd2NhcGZfcGFyYW1zLnNvcnRpbmdfY29udHJvbCApIHtcblx0XHRcdCRjb250YWluZXIuZmluZCggJy53b29jb21tZXJjZS1vcmRlcmluZycgKS5lYWNoKCBmdW5jdGlvbigpIHtcblx0XHRcdFx0Y29uc3QgJG9yZGVyaW5nRm9ybSA9ICQoIHRoaXMgKTtcblxuXHRcdFx0XHQkb3JkZXJpbmdGb3JtLm9uKCAnY2hhbmdlJywgJ3NlbGVjdC5vcmRlcmJ5JywgZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0JG9yZGVyaW5nRm9ybS5zdWJtaXQoKTtcblx0XHRcdFx0fSApO1xuXHRcdFx0fSApO1xuXG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0JGNvbnRhaW5lci5maW5kKCAnLndvb2NvbW1lcmNlLW9yZGVyaW5nJyApLmVhY2goIGZ1bmN0aW9uKCkge1xuXHRcdFx0Y29uc3QgJG9yZGVyaW5nRm9ybSA9ICQoIHRoaXMgKTtcblxuXHRcdFx0JG9yZGVyaW5nRm9ybS5vbiggJ3N1Ym1pdCcsIGZ1bmN0aW9uKCBlICkge1xuXHRcdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHR9ICk7XG5cblx0XHRcdCRvcmRlcmluZ0Zvcm0ub24oICdjaGFuZ2UnLCAnc2VsZWN0Lm9yZGVyYnknLCBmdW5jdGlvbiggZSApIHtcblx0XHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG5cdFx0XHRcdGNvbnN0IG9yZGVyICAgICAgPSAkKCB0aGlzICkudmFsKCk7XG5cdFx0XHRcdGNvbnN0IGZpbHRlcl9rZXkgPSAnb3JkZXJieSc7XG5cblx0XHRcdFx0dXBkYXRlUXVlcnlTdHJpbmdQYXJhbWV0ZXIoIGZpbHRlcl9rZXksIG9yZGVyICk7XG5cdFx0XHRcdGZpbHRlclByb2R1Y3RzKCk7XG5cdFx0XHR9ICk7XG5cdFx0fSApO1xuXHR9XG5cblx0aW5pdERlZmF1bHRPcmRlckJ5KCk7XG5cblx0ZnVuY3Rpb24gc2hvd0xvYWRpbmdBbmltYXRpb24oKSB7XG5cdFx0bGV0IGNvbnRhaW5lcjtcblxuXHRcdGlmICggJCggd2NhcGZfcGFyYW1zLnNob3BfbG9vcF9jb250YWluZXIgKS5sZW5ndGggKSB7XG5cdFx0XHRjb250YWluZXIgPSB3Y2FwZl9wYXJhbXMuc2hvcF9sb29wX2NvbnRhaW5lcjtcblx0XHR9IGVsc2UgaWYgKCAkKCB3Y2FwZl9wYXJhbXMubm90X2ZvdW5kX2NvbnRhaW5lciApLmxlbmd0aCApIHtcblx0XHRcdGNvbnRhaW5lciA9IHdjYXBmX3BhcmFtcy5ub3RfZm91bmRfY29udGFpbmVyO1xuXHRcdH1cblxuXHRcdGlmICggJ2JvZHknID09PSB3Y2FwZl9wYXJhbXMubG9hZGluZ19hbmltYXRpb25fb24gKSB7XG5cdFx0XHRjb250YWluZXIgPSB3Y2FwZl9wYXJhbXMubG9hZGluZ19hbmltYXRpb25fb247XG5cblx0XHRcdCQoIGNvbnRhaW5lciApLmFkZENsYXNzKCAnd2NhcGYtcmVzdWx0cy1sb2FkaW5nJyApO1xuXHRcdH1cblxuXHRcdC8vIFNob3cgbG9hZGluZyBpbWFnZS5cblx0XHRpZiAoICdub25lJyAhPT0gd2NhcGZfcGFyYW1zLmxvYWRpbmdfYW5pbWF0aW9uX29uICkge1xuXHRcdFx0Y29uc3QgbG9hZGluZ01hcmt1cCA9ICc8ZGl2IGNsYXNzPVwiJyArIHdjYXBmX3BhcmFtcy5sb2FkaW5nX2VsZW1lbnRfY2xhc3MgKyAnXCI+JyArXG5cdFx0XHRcdCc8c3BhbiBjbGFzcz1cImxvYWRpbmctaW1nXCI+PC9zcGFuPicgK1xuXHRcdFx0XHQnPC9kaXY+JztcblxuXHRcdFx0JCggbG9hZGluZ01hcmt1cCApLnByZXBlbmRUbyggY29udGFpbmVyICk7XG5cdFx0fVxuXHR9XG5cblx0ZnVuY3Rpb24gZGlzYWJsZU5vVWlTbGlkZXJzKCkge1xuXHRcdGlmICggJ3VuZGVmaW5lZCcgPT09IHR5cGVvZiBub1VpU2xpZGVyICkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdCR3Y2FwZk51bWJlclJhbmdlRmlsdGVycy5maW5kKCAnLndjYXBmLW5vdWktc2xpZGVyJyApLmVhY2goIGZ1bmN0aW9uKCBlLCBlbGVtZW50ICkge1xuXHRcdFx0ZWxlbWVudC5zZXRBdHRyaWJ1dGUoICdkaXNhYmxlZCcsIHRydWUgKTtcblx0XHR9ICk7XG5cdH1cblxuXHRmdW5jdGlvbiBkaXNhYmxlTGFiZWxzKCkge1xuXHRcdGNvbnN0IHNlbGVjdG9ycyA9ICcud2NhcGYtbGFiZWxlZC1uYXYgLml0ZW0sIC53Y2FwZi1hY3RpdmUtZmlsdGVycyAuaXRlbSc7XG5cblx0XHQkd2NhcGZTaW5nbGVGaWx0ZXJzLmZpbmQoIHNlbGVjdG9ycyApLmFkZENsYXNzKCAnZGlzYWJsZWQnICk7XG5cdH1cblxuXHRmdW5jdGlvbiBkaXNhYmxlSW5wdXRzKCkge1xuXHRcdGlmICggISB3Y2FwZl9wYXJhbXMuZGlzYWJsZV9pbnB1dHNfd2hpbGVfZmV0Y2hpbmdfcmVzdWx0cyApIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHRjb25zdCBpbnB1dHMgPSAnaW5wdXQsIHNlbGVjdCc7XG5cblx0XHQkd2NhcGZTaW5nbGVGaWx0ZXJzLmZpbmQoIGlucHV0cyApLmF0dHIoICdkaXNhYmxlZCcsICdkaXNhYmxlZCcgKTtcblx0XHQkd2NhcGZTaW5nbGVGaWx0ZXJzLmZpbmQoIGlucHV0cyApLnRyaWdnZXIoICdjaG9zZW46dXBkYXRlZCcgKTtcblxuXHRcdGRpc2FibGVOb1VpU2xpZGVycygpO1xuXHRcdGRpc2FibGVMYWJlbHMoKTtcblx0fVxuXG5cdGZ1bmN0aW9uIGVuYWJsZU5vVWlTbGlkZXJzKCkge1xuXHRcdGlmICggJ3VuZGVmaW5lZCcgPT09IHR5cGVvZiBub1VpU2xpZGVyICkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdCR3Y2FwZk51bWJlclJhbmdlRmlsdGVycy5maW5kKCAnLndjYXBmLW5vdWktc2xpZGVyJyApLmVhY2goIGZ1bmN0aW9uKCBlLCBlbGVtZW50ICkge1xuXHRcdFx0ZWxlbWVudC5yZW1vdmVBdHRyaWJ1dGUoICdkaXNhYmxlZCcgKTtcblx0XHR9ICk7XG5cdH1cblxuXHRmdW5jdGlvbiBlbmFibGVJbnB1dHMoKSB7XG5cdFx0aWYgKCAhIHdjYXBmX3BhcmFtcy5kaXNhYmxlX2lucHV0c193aGlsZV9mZXRjaGluZ19yZXN1bHRzICkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdGNvbnN0IGlucHV0cyA9ICdpbnB1dCc7XG5cblx0XHQkd2NhcGZOdW1iZXJSYW5nZUZpbHRlcnMuZmluZCggaW5wdXRzICkucmVtb3ZlQXR0ciggJ2Rpc2FibGVkJyApO1xuXHRcdCR3Y2FwZkRhdGVGaWx0ZXJzLmZpbmQoIGlucHV0cyApLnJlbW92ZUF0dHIoICdkaXNhYmxlZCcgKTtcblxuXHRcdGVuYWJsZU5vVWlTbGlkZXJzKCk7XG5cdH1cblxuXHRmdW5jdGlvbiByZXNldExvYWRpbmdBbmltYXRpb24oKSB7XG5cdFx0aWYgKCAnYm9keScgPT09IHdjYXBmX3BhcmFtcy5sb2FkaW5nX2FuaW1hdGlvbl9vbiApIHtcblx0XHRcdCQoIHdjYXBmX3BhcmFtcy5sb2FkaW5nX2FuaW1hdGlvbl9vbiApLnJlbW92ZUNsYXNzKCAnd2NhcGYtcmVzdWx0cy1sb2FkaW5nJyApO1xuXG5cdFx0XHRjb25zdCBzZWxlY3RvciA9ICcuJyArIHdjYXBmX3BhcmFtcy5sb2FkaW5nX2VsZW1lbnRfY2xhc3M7XG5cdFx0XHQkKCB3Y2FwZl9wYXJhbXMubG9hZGluZ19hbmltYXRpb25fb24gKS5maW5kKCBzZWxlY3RvciApLnJlbW92ZSgpO1xuXHRcdH1cblx0fVxuXG5cdGZ1bmN0aW9uIHNjcm9sbFRvKCkge1xuXHRcdGlmICggJ25vbmUnID09PSB3Y2FwZl9wYXJhbXMuc2Nyb2xsX3dpbmRvdyApIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHRjb25zdCBzY3JvbGxGb3IgPSB3Y2FwZl9wYXJhbXMuc2Nyb2xsX3dpbmRvd19mb3I7XG5cdFx0Y29uc3QgaXNNb2JpbGUgID0gd2NhcGZfcGFyYW1zLmlzX21vYmlsZTtcblx0XHRsZXQgcHJvY2VlZCAgICAgPSBmYWxzZTtcblxuXHRcdGlmICggJ21vYmlsZScgPT09IHNjcm9sbEZvciAmJiBpc01vYmlsZSApIHtcblx0XHRcdHByb2NlZWQgPSB0cnVlO1xuXHRcdH0gZWxzZSBpZiAoICdkZXNrdG9wJyA9PT0gc2Nyb2xsRm9yICYmICEgaXNNb2JpbGUgKSB7XG5cdFx0XHRwcm9jZWVkID0gdHJ1ZTtcblx0XHR9IGVsc2UgaWYgKCAnYm90aCcgPT09IHNjcm9sbEZvciApIHtcblx0XHRcdHByb2NlZWQgPSB0cnVlO1xuXHRcdH1cblxuXHRcdGlmICggISBwcm9jZWVkICkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdGxldCBhZGp1c3RpbmdPZmZzZXQsIG9mZnNldDtcblxuXHRcdGlmICggd2NhcGZfcGFyYW1zLnNjcm9sbF90b190b3Bfb2Zmc2V0ICkge1xuXHRcdFx0YWRqdXN0aW5nT2Zmc2V0ID0gcGFyc2VJbnQoIHdjYXBmX3BhcmFtcy5zY3JvbGxfdG9fdG9wX29mZnNldCApO1xuXHRcdH1cblxuXHRcdGxldCBjb250YWluZXI7XG5cblx0XHRpZiAoICQoIHdjYXBmX3BhcmFtcy5zaG9wX2xvb3BfY29udGFpbmVyICkubGVuZ3RoICkge1xuXHRcdFx0Y29udGFpbmVyID0gd2NhcGZfcGFyYW1zLnNob3BfbG9vcF9jb250YWluZXI7XG5cdFx0fSBlbHNlIGlmICggJCggd2NhcGZfcGFyYW1zLm5vdF9mb3VuZF9jb250YWluZXIgKS5sZW5ndGggKSB7XG5cdFx0XHRjb250YWluZXIgPSB3Y2FwZl9wYXJhbXMubm90X2ZvdW5kX2NvbnRhaW5lcjtcblx0XHR9XG5cblx0XHRpZiAoICdjdXN0b20nID09PSB3Y2FwZl9wYXJhbXMuc2Nyb2xsX3dpbmRvdyApIHtcblx0XHRcdGNvbnRhaW5lciA9IHdjYXBmX3BhcmFtcy5zY3JvbGxfd2luZG93X2N1c3RvbV9lbGVtZW50O1xuXHRcdH1cblxuXHRcdGNvbnN0ICRjb250YWluZXIgPSAkKCBjb250YWluZXIgKTtcblxuXHRcdGlmICggJGNvbnRhaW5lci5sZW5ndGggKSB7XG5cdFx0XHRvZmZzZXQgPSAkY29udGFpbmVyLm9mZnNldCgpLnRvcCAtIGFkanVzdGluZ09mZnNldDtcblxuXHRcdFx0aWYgKCBvZmZzZXQgPCAwICkge1xuXHRcdFx0XHRvZmZzZXQgPSAwO1xuXHRcdFx0fVxuXG5cdFx0XHQkKCAnaHRtbCwgYm9keScgKS5zdG9wKCkuYW5pbWF0ZShcblx0XHRcdFx0eyBzY3JvbGxUb3A6IG9mZnNldCB9LFxuXHRcdFx0XHR3Y2FwZl9wYXJhbXMuc2Nyb2xsX3RvX3RvcF9zcGVlZCxcblx0XHRcdFx0d2NhcGZfcGFyYW1zLnNjcm9sbF90b190b3BfZWFzaW5nXG5cdFx0XHQpO1xuXHRcdH1cblx0fVxuXG5cdC8vIFRoaW5ncyBhcmUgZG9uZSBiZWZvcmUgZmV0Y2hpbmcgdGhlIHByb2R1Y3RzIGxpa2Ugc2hvd2luZyBhIGxvYWRpbmcgaW5kaWNhdG9yLlxuXHRmdW5jdGlvbiBiZWZvcmVGZXRjaGluZ1Byb2R1Y3RzKCkge1xuXHRcdGRpc2FibGVJbnB1dHMoKTtcblx0XHRzaG93TG9hZGluZ0FuaW1hdGlvbigpO1xuXG5cdFx0aWYgKCAnaW1tZWRpYXRlbHknID09PSB3Y2FwZl9wYXJhbXMuc2Nyb2xsX3dpbmRvd193aGVuICkge1xuXHRcdFx0c2Nyb2xsVG8oKTtcblx0XHR9XG5cblx0XHQkYm9keS50cmlnZ2VyKCAnd2NhcGZfYmVmb3JlX2ZldGNoaW5nX3Byb2R1Y3RzJyApO1xuXHR9XG5cblx0ZnVuY3Rpb24gYmVmb3JlVXBkYXRpbmdQcm9kdWN0cygpIHtcblx0XHRyZXNldExvYWRpbmdBbmltYXRpb24oKTtcblxuXHRcdCRib2R5LnRyaWdnZXIoICd3Y2FwZl9iZWZvcmVfdXBkYXRpbmdfcHJvZHVjdHMnICk7XG5cdH1cblxuXHQvLyBUaGluZ3MgYXJlIGRvbmUgYWZ0ZXIgYXBwbHlpbmcgdGhlIGZpbHRlciBsaWtlIHNjcm9sbCB0byB0b3AuXG5cdGZ1bmN0aW9uIGFmdGVyVXBkYXRpbmdQcm9kdWN0cygpIHtcblx0XHRpbml0Q2hvc2VuKCk7XG5cdFx0aW5pdEhpZXJhcmNoeUFjY29yZGlvbigpO1xuXHRcdGluaXROb1VJU2xpZGVyKCk7XG5cdFx0aW5pdERhdGVwaWNrZXIoKTtcblx0XHRpbml0RGVmYXVsdE9yZGVyQnkoKTtcblx0XHRlbmFibGVJbnB1dHMoKTtcblxuXHRcdGlmICggJ2FmdGVyJyA9PT0gd2NhcGZfcGFyYW1zLnNjcm9sbF93aW5kb3dfd2hlbiApIHtcblx0XHRcdHNjcm9sbFRvKCk7XG5cdFx0fVxuXG5cdFx0JGJvZHkudHJpZ2dlciggJ3djYXBmX2FmdGVyX3VwZGF0aW5nX3Byb2R1Y3RzJyApO1xuXHR9XG5cblx0Ly8gVGhlIG1haW4gZmlsdGVyIGZ1bmN0aW9uLlxuXHRmdW5jdGlvbiBmaWx0ZXJQcm9kdWN0cyggZm9yY2VSZVJlbmRlciA9IGZhbHNlICkge1xuXHRcdGJlZm9yZUZldGNoaW5nUHJvZHVjdHMoKTtcblxuXHRcdCQuZ2V0KCB3aW5kb3cubG9jYXRpb24uaHJlZiwgZnVuY3Rpb24oIGRhdGEgKSB7XG5cdFx0XHRjb25zdCAkZGF0YSA9ICQoIGRhdGEgKTtcblxuXHRcdFx0Ly8gUmVwbGFjZSB0aGUgZmllbGRzJyBkYXRhIHdpdGggbmV3IGRhdGEuXG5cdFx0XHQkLmVhY2goIGZpZWxkcywgZnVuY3Rpb24oIGlkICkge1xuXHRcdFx0XHRjb25zdCBmaWVsZElEICAgID0gJ1tkYXRhLWlkPVwiJyArIGlkICsgJ1wiXSc7XG5cdFx0XHRcdGNvbnN0ICRmaWVsZCAgICAgPSAkKCBmaWVsZElEICk7XG5cdFx0XHRcdGNvbnN0ICRpbm5lciAgICAgPSAkZmllbGQuZmluZCggJy53Y2FwZi1maWVsZC1pbm5lcicgKTtcblx0XHRcdFx0Y29uc3QgX2ZpZWxkICAgICA9ICRkYXRhLmZpbmQoIGZpZWxkSUQgKTtcblx0XHRcdFx0bGV0IGZpZWxkQ2xhc3NlcyA9ICQoIF9maWVsZCApLmF0dHIoICdjbGFzcycgKTtcblxuXHRcdFx0XHQvLyBQcmVzZXJ2ZSBoaWVyYXJjaHkgYWNjb3JkaW9uIHN0YXRlLlxuXHRcdFx0XHRpZiAoIHdjYXBmX3BhcmFtcy5wcmVzZXJ2ZV9oaWVyYXJjaHlfYWNjb3JkaW9uX3N0YXRlICkge1xuXHRcdFx0XHRcdGlmICggJGZpZWxkLmhhc0NsYXNzKCAnaGllcmFyY2h5LWFjY29yZGlvbicgKSApIHtcblx0XHRcdFx0XHRcdCRmaWVsZC5maW5kKCAnLmhpZXJhcmNoeS1hY2NvcmRpb24tdG9nZ2xlLmFjdGl2ZScgKS5lYWNoKCBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHRcdFx0Y29uc3QgaXRlbVZhbHVlICAgICAgPSAkKCB0aGlzICkucGFyZW50KCkuY2hpbGRyZW4oICdpbnB1dCcgKS52YWwoKTtcblx0XHRcdFx0XHRcdFx0Y29uc3QgdG9nZ2xlU2VsZWN0b3IgPSAnaW5wdXRbdmFsdWU9XCInICsgaXRlbVZhbHVlICsgJ1wiXSB+IC5oaWVyYXJjaHktYWNjb3JkaW9uLXRvZ2dsZSc7XG5cdFx0XHRcdFx0XHRcdGNvbnN0IHVsU2VsZWN0b3IgICAgID0gJ2lucHV0W3ZhbHVlPVwiJyArIGl0ZW1WYWx1ZSArICdcIl0gfiB1bCc7XG5cdFx0XHRcdFx0XHRcdGNvbnN0IF9jbGFzc2VzICAgICAgID0gJ2hpZXJhcmNoeS1hY2NvcmRpb24tdG9nZ2xlIGFjdGl2ZSc7XG5cblx0XHRcdFx0XHRcdFx0X2ZpZWxkLmZpbmQoIHRvZ2dsZVNlbGVjdG9yICkuYXR0ciggJ2NsYXNzJywgX2NsYXNzZXMgKTtcblx0XHRcdFx0XHRcdFx0X2ZpZWxkLmZpbmQoIHVsU2VsZWN0b3IgKS5zaG93KCk7XG5cdFx0XHRcdFx0XHR9ICk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cblx0XHRcdFx0Y29uc3QgX2h0bWwgPSBfZmllbGQuZmluZCggJy53Y2FwZi1maWVsZC1pbm5lcicgKS5odG1sKCk7XG5cblx0XHRcdFx0Ly8gU2hvdyBzb2Z0IGxpbWl0IGl0ZW1zLlxuXHRcdFx0XHRjb25zdCBzb2Z0TGltaXRTZWxlY3RvciA9ICdzaG93LWhpZGRlbi1pdGVtcyc7XG5cblx0XHRcdFx0aWYgKCAkZmllbGQuaGFzQ2xhc3MoIHNvZnRMaW1pdFNlbGVjdG9yICkgKSB7XG5cdFx0XHRcdFx0aWYgKCAhIF9maWVsZC5oYXNDbGFzcyggc29mdExpbWl0U2VsZWN0b3IgKSApIHtcblx0XHRcdFx0XHRcdGZpZWxkQ2xhc3NlcyArPSAnICcgKyBzb2Z0TGltaXRTZWxlY3Rvcjtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0ZmllbGRDbGFzc2VzID0gZmllbGRDbGFzc2VzLnJlcGxhY2UoIHNvZnRMaW1pdFNlbGVjdG9yLCAnJyApO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0Ly8gVXBkYXRlIHRoZSBmaWVsZCdzIGNsYXNzLlxuXHRcdFx0XHQkZmllbGQuYXR0ciggJ2NsYXNzJywgZmllbGRDbGFzc2VzLnRyaW0oKSApO1xuXG5cdFx0XHRcdC8vIFdoZW4gY2FsbGVkIGZyb20gaGlzdG9yeSBiYWNrIG9yIGZvcndhcmQgcmVxdWVzdCB0aGVuIHJlcmVuZGVyIGFsbCBmaWVsZHMuXG5cdFx0XHRcdGlmICggZm9yY2VSZVJlbmRlciApIHtcblxuXHRcdFx0XHRcdC8vIHVwZGF0ZSBmaWVsZFxuXHRcdFx0XHRcdCRpbm5lci5odG1sKCBfaHRtbCApO1xuXG5cdFx0XHRcdH0gZWxzZSB7XG5cblx0XHRcdFx0XHQvLyBTZWxlY3RpdmVseSByZXJlbmRlciB0aGUgZmllbGRzLlxuXHRcdFx0XHRcdGlmICggJGZpZWxkLmhhc0NsYXNzKCAnd2NhcGYtbmF2LWZpbHRlcicgKSApIHtcblxuXHRcdFx0XHRcdFx0Ly8gdXBkYXRlIGZpZWxkXG5cdFx0XHRcdFx0XHQkaW5uZXIuaHRtbCggX2h0bWwgKTtcblxuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHR9XG5cblx0XHRcdFx0JGZpZWxkLnRyaWdnZXIoICd3Y2FwZi1maWVsZC11cGRhdGVkJywgWyBfZmllbGQgXSApO1xuXHRcdFx0fSApO1xuXG5cdFx0XHRiZWZvcmVVcGRhdGluZ1Byb2R1Y3RzKCk7XG5cblx0XHRcdC8vIFJlcGxhY2Ugb2xkIHNob3AgbG9vcCB3aXRoIG5ldyBvbmUuXG5cdFx0XHRjb25zdCAkc2hvcExvb3BDb250YWluZXIgPSAkZGF0YS5maW5kKCB3Y2FwZl9wYXJhbXMuc2hvcF9sb29wX2NvbnRhaW5lciApO1xuXHRcdFx0Y29uc3QgJG5vdEZvdW5kQ29udGFpbmVyID0gJGRhdGEuZmluZCggd2NhcGZfcGFyYW1zLm5vdF9mb3VuZF9jb250YWluZXIgKTtcblxuXHRcdFx0aWYgKCB3Y2FwZl9wYXJhbXMuc2hvcF9sb29wX2NvbnRhaW5lciA9PT0gd2NhcGZfcGFyYW1zLm5vdF9mb3VuZF9jb250YWluZXIgKSB7XG5cdFx0XHRcdCQoIHdjYXBmX3BhcmFtcy5zaG9wX2xvb3BfY29udGFpbmVyICkuaHRtbCggJHNob3BMb29wQ29udGFpbmVyLmh0bWwoKSApO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0aWYgKCAkKCB3Y2FwZl9wYXJhbXMubm90X2ZvdW5kX2NvbnRhaW5lciApLmxlbmd0aCApIHtcblx0XHRcdFx0XHRpZiAoICRzaG9wTG9vcENvbnRhaW5lci5sZW5ndGggKSB7XG5cdFx0XHRcdFx0XHQkKCB3Y2FwZl9wYXJhbXMubm90X2ZvdW5kX2NvbnRhaW5lciApLmh0bWwoICRzaG9wTG9vcENvbnRhaW5lci5odG1sKCkgKTtcblx0XHRcdFx0XHR9IGVsc2UgaWYgKCAkbm90Rm91bmRDb250YWluZXIubGVuZ3RoICkge1xuXHRcdFx0XHRcdFx0JCggd2NhcGZfcGFyYW1zLm5vdF9mb3VuZF9jb250YWluZXIgKS5odG1sKCAkbm90Rm91bmRDb250YWluZXIuaHRtbCgpICk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9IGVsc2UgaWYgKCAkKCB3Y2FwZl9wYXJhbXMuc2hvcF9sb29wX2NvbnRhaW5lciApLmxlbmd0aCApIHtcblx0XHRcdFx0XHRpZiAoICRzaG9wTG9vcENvbnRhaW5lci5sZW5ndGggKSB7XG5cdFx0XHRcdFx0XHQkKCB3Y2FwZl9wYXJhbXMuc2hvcF9sb29wX2NvbnRhaW5lciApLmh0bWwoICRzaG9wTG9vcENvbnRhaW5lci5odG1sKCkgKTtcblx0XHRcdFx0XHR9IGVsc2UgaWYgKCAkbm90Rm91bmRDb250YWluZXIubGVuZ3RoICkge1xuXHRcdFx0XHRcdFx0JCggd2NhcGZfcGFyYW1zLnNob3BfbG9vcF9jb250YWluZXIgKS5odG1sKCAkbm90Rm91bmRDb250YWluZXIuaHRtbCgpICk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHRcdGFmdGVyVXBkYXRpbmdQcm9kdWN0cygpO1xuXHRcdH0gKTtcblx0fVxuXG5cdC8vIFVSTCBQYXJzZXJcblx0ZnVuY3Rpb24gZ2V0VXJsVmFycyggdXJsICkge1xuXHRcdGxldCB2YXJzID0ge30sIGhhc2g7XG5cblx0XHRpZiAoIHR5cGVvZiB1cmwgPT09ICd1bmRlZmluZWQnICkge1xuXHRcdFx0dXJsID0gd2luZG93LmxvY2F0aW9uLmhyZWY7XG5cdFx0fVxuXG5cdFx0dXJsID0gdXJsLnJlcGxhY2VBbGwoICclMkMnLCAnLCcgKTtcblxuXHRcdGNvbnN0IGhhc2hlcyAgPSB1cmwuc2xpY2UoIHVybC5pbmRleE9mKCAnPycgKSArIDEgKS5zcGxpdCggJyYnICk7XG5cdFx0Y29uc3QgaExlbmd0aCA9IGhhc2hlcy5sZW5ndGg7XG5cblx0XHRmb3IgKCBsZXQgaSA9IDA7IGkgPCBoTGVuZ3RoOyBpKysgKSB7XG5cdFx0XHRoYXNoID0gaGFzaGVzWyBpIF0uc3BsaXQoICc9JyApO1xuXG5cdFx0XHR2YXJzWyBoYXNoWyAwIF0gXSA9IGhhc2hbIDEgXTtcblx0XHR9XG5cblx0XHRyZXR1cm4gdmFycztcblx0fVxuXG5cdC8vIGV2ZXJ5dGltZSB3ZSBhcHBseSB0aGUgZmlsdGVyIHdlIHNldCB0aGUgY3VycmVudCBwYWdlIHRvIDFcblx0ZnVuY3Rpb24gZml4UGFnaW5hdGlvbigpIHtcblx0XHRsZXQgdXJsICAgICAgICAgICAgICAgID0gd2luZG93LmxvY2F0aW9uLmhyZWY7XG5cdFx0Y29uc3QgcGFyYW1zICAgICAgICAgICA9IGdldFVybFZhcnMoIHVybCApO1xuXHRcdGNvbnN0IGN1cnJlbnRQYWdlSW5VcmwgPSBwYXJzZUludCggdXJsLnJlcGxhY2UoIC8uK1xcL3BhZ2VcXC8oXFxkKykrLywgJyQxJyApICk7XG5cblx0XHRpZiAoIGN1cnJlbnRQYWdlSW5VcmwgKSB7XG5cdFx0XHRpZiAoIGN1cnJlbnRQYWdlSW5VcmwgPiAxICkge1xuXHRcdFx0XHR1cmwgPSB1cmwucmVwbGFjZSggL3BhZ2VcXC8oXFxkKykvLCAncGFnZS8xJyApO1xuXHRcdFx0fVxuXHRcdH0gZWxzZSBpZiAoIHR5cGVvZiBwYXJhbXNbICdwYWdlZCcgXSAhPT0gJ3VuZGVmaW5lZCcgKSB7XG5cdFx0XHRjb25zdCBjdXJyZW50UGFnZUluUGFyYW1zID0gcGFyc2VJbnQoIHBhcmFtc1sgJ3BhZ2VkJyBdICk7XG5cblx0XHRcdGlmICggY3VycmVudFBhZ2VJblBhcmFtcyA+IDEgKSB7XG5cdFx0XHRcdHVybCA9IHVybC5yZXBsYWNlKCAncGFnZWQ9JyArIGN1cnJlbnRQYWdlSW5QYXJhbXMsICdwYWdlZD0xJyApO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdHJldHVybiB1cmw7XG5cdH1cblxuXHQvLyB1cGRhdGUgcXVlcnkgc3RyaW5nIGZvciBjYXRlZ29yaWVzLCBtZXRhIGV0Yy4uXG5cdGZ1bmN0aW9uIHVwZGF0ZVF1ZXJ5U3RyaW5nUGFyYW1ldGVyKCBrZXksIHZhbHVlLCBwdXNoSGlzdG9yeSwgdXJsICkge1xuXHRcdGlmICggdHlwZW9mIHB1c2hIaXN0b3J5ID09PSAndW5kZWZpbmVkJyApIHtcblx0XHRcdHB1c2hIaXN0b3J5ID0gdHJ1ZTtcblx0XHR9XG5cblx0XHRpZiAoIHR5cGVvZiB1cmwgPT09ICd1bmRlZmluZWQnICkge1xuXHRcdFx0dXJsID0gZml4UGFnaW5hdGlvbigpO1xuXHRcdH1cblxuXHRcdGNvbnN0IHJlICAgICAgICA9IG5ldyBSZWdFeHAoICcoWz8mXSknICsga2V5ICsgJz0uKj8oJnwkKScsICdpJyApO1xuXHRcdGNvbnN0IHNlcGFyYXRvciA9IHVybC5pbmRleE9mKCAnPycgKSAhPT0gLTEgPyAnJicgOiAnPyc7XG5cdFx0bGV0IHVybFdpdGhRdWVyeTtcblxuXHRcdGlmICggdXJsLm1hdGNoKCByZSApICkge1xuXHRcdFx0dXJsV2l0aFF1ZXJ5ID0gdXJsLnJlcGxhY2UoIHJlLCAnJDEnICsga2V5ICsgJz0nICsgdmFsdWUgKyAnJDInICk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHVybFdpdGhRdWVyeSA9IHVybCArIHNlcGFyYXRvciArIGtleSArICc9JyArIHZhbHVlO1xuXHRcdH1cblxuXHRcdGlmICggcHVzaEhpc3RvcnkgPT09IHRydWUgKSB7XG5cdFx0XHRyZXR1cm4gaGlzdG9yeS5wdXNoU3RhdGUoIHt9LCAnJywgdXJsV2l0aFF1ZXJ5ICk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHJldHVybiB1cmxXaXRoUXVlcnk7XG5cdFx0fVxuXHR9XG5cblx0Ly8gcmVtb3ZlIHBhcmFtZXRlciBmcm9tIHVybFxuXHRmdW5jdGlvbiByZW1vdmVRdWVyeVN0cmluZ1BhcmFtZXRlciggZmlsdGVyS2V5LCB1cmwgKSB7XG5cdFx0aWYgKCB0eXBlb2YgdXJsID09PSAndW5kZWZpbmVkJyApIHtcblx0XHRcdHVybCA9IGZpeFBhZ2luYXRpb24oKTtcblx0XHR9XG5cblx0XHRjb25zdCBvbGRQYXJhbXMgICAgICAgICA9IGdldFVybFZhcnMoIHVybCApO1xuXHRcdGNvbnN0IG9sZFBhcmFtc0xlbmd0aCAgID0gT2JqZWN0LmtleXMoIG9sZFBhcmFtcyApLmxlbmd0aDtcblx0XHRjb25zdCBzdGFydFBvc2l0aW9uICAgICA9IHVybC5pbmRleE9mKCAnPycgKTtcblx0XHRjb25zdCBmaWx0ZXJLZXlQb3NpdGlvbiA9IHVybC5pbmRleE9mKCBmaWx0ZXJLZXkgKTtcblx0XHRsZXQgY2xlYW5VcmwsIGNsZWFuUXVlcnk7XG5cblx0XHRpZiAoIG9sZFBhcmFtc0xlbmd0aCA+IDEgKSB7XG5cdFx0XHRpZiAoICggZmlsdGVyS2V5UG9zaXRpb24gLSBzdGFydFBvc2l0aW9uICkgPiAxICkge1xuXHRcdFx0XHRjbGVhblVybCA9IHVybC5yZXBsYWNlKCAnJicgKyBmaWx0ZXJLZXkgKyAnPScgKyBvbGRQYXJhbXNbIGZpbHRlcktleSBdLCAnJyApO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0Y2xlYW5VcmwgPSB1cmwucmVwbGFjZSggZmlsdGVyS2V5ICsgJz0nICsgb2xkUGFyYW1zWyBmaWx0ZXJLZXkgXSArICcmJywgJycgKTtcblx0XHRcdH1cblxuXHRcdFx0Y29uc3QgbmV3UGFyYW1zID0gY2xlYW5Vcmwuc3BsaXQoICc/JyApO1xuXHRcdFx0Y2xlYW5RdWVyeSAgICAgID0gJz8nICsgbmV3UGFyYW1zWyAxIF07XG5cdFx0fSBlbHNlIHtcblx0XHRcdGNsZWFuUXVlcnkgPSB1cmwucmVwbGFjZSggJz8nICsgZmlsdGVyS2V5ICsgJz0nICsgb2xkUGFyYW1zWyBmaWx0ZXJLZXkgXSwgJycgKTtcblx0XHR9XG5cblx0XHRyZXR1cm4gY2xlYW5RdWVyeTtcblx0fVxuXG5cdC8vIHRha2UgdGhlIGtleSBhbmQgdmFsdWUgYW5kIG1ha2UgcXVlcnlcblx0ZnVuY3Rpb24gbWFrZVBhcmFtZXRlcnMoIGZpbHRlcktleSwgZmlsdGVyVmFsdWUsIGZvcmNlUmVyZW5kZXIgPSBmYWxzZSwgdXJsICkge1xuXHRcdGNvbnN0IHZhbHVlU2VwYXJhdG9yID0gJywnO1xuXG5cdFx0bGV0IHBhcmFtcywgbmV4dFZhbHVlcywgZW1wdHlWYWx1ZSA9IGZhbHNlO1xuXG5cdFx0aWYgKCB0eXBlb2YgdXJsICE9PSAndW5kZWZpbmVkJyApIHtcblx0XHRcdHBhcmFtcyA9IGdldFVybFZhcnMoIHVybCApO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRwYXJhbXMgPSBnZXRVcmxWYXJzKCk7XG5cdFx0fVxuXG5cdFx0aWYgKCB0eXBlb2YgcGFyYW1zWyBmaWx0ZXJLZXkgXSAhPSAndW5kZWZpbmVkJyApIHtcblx0XHRcdGNvbnN0IHByZXZWYWx1ZXMgICAgICA9IHBhcmFtc1sgZmlsdGVyS2V5IF07XG5cdFx0XHRjb25zdCBwcmV2VmFsdWVzQXJyYXkgPSBwcmV2VmFsdWVzLnNwbGl0KCB2YWx1ZVNlcGFyYXRvciApO1xuXG5cdFx0XHRpZiAoIHByZXZWYWx1ZXMubGVuZ3RoID4gMCApIHtcblx0XHRcdFx0Y29uc3QgZm91bmQgPSAkLmluQXJyYXkoIGZpbHRlclZhbHVlLCBwcmV2VmFsdWVzQXJyYXkgKTtcblxuXHRcdFx0XHRpZiAoIGZvdW5kID49IDAgKSB7XG5cdFx0XHRcdFx0Ly8gRWxlbWVudCB3YXMgZm91bmQsIHJlbW92ZSBpdC5cblx0XHRcdFx0XHRwcmV2VmFsdWVzQXJyYXkuc3BsaWNlKCBmb3VuZCwgMSApO1xuXG5cdFx0XHRcdFx0aWYgKCBwcmV2VmFsdWVzQXJyYXkubGVuZ3RoID09PSAwICkge1xuXHRcdFx0XHRcdFx0ZW1wdHlWYWx1ZSA9IHRydWU7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdC8vIEVsZW1lbnQgd2FzIG5vdCBmb3VuZCwgYWRkIGl0LlxuXHRcdFx0XHRcdHByZXZWYWx1ZXNBcnJheS5wdXNoKCBmaWx0ZXJWYWx1ZSApO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0aWYgKCBwcmV2VmFsdWVzQXJyYXkubGVuZ3RoID4gMSApIHtcblx0XHRcdFx0XHRuZXh0VmFsdWVzID0gcHJldlZhbHVlc0FycmF5LmpvaW4oIHZhbHVlU2VwYXJhdG9yICk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0bmV4dFZhbHVlcyA9IHByZXZWYWx1ZXNBcnJheTtcblx0XHRcdFx0fVxuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0bmV4dFZhbHVlcyA9IGZpbHRlclZhbHVlO1xuXHRcdFx0fVxuXHRcdH0gZWxzZSB7XG5cdFx0XHRuZXh0VmFsdWVzID0gZmlsdGVyVmFsdWU7XG5cdFx0fVxuXG5cdFx0Ly8gdXBkYXRlIHVybCBhbmQgcXVlcnkgc3RyaW5nXG5cdFx0aWYgKCAhIGVtcHR5VmFsdWUgKSB7XG5cdFx0XHR1cGRhdGVRdWVyeVN0cmluZ1BhcmFtZXRlciggZmlsdGVyS2V5LCBuZXh0VmFsdWVzICk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdGNvbnN0IHF1ZXJ5ID0gcmVtb3ZlUXVlcnlTdHJpbmdQYXJhbWV0ZXIoIGZpbHRlcktleSApO1xuXHRcdFx0aGlzdG9yeS5wdXNoU3RhdGUoIHt9LCAnJywgcXVlcnkgKTtcblx0XHR9XG5cblx0XHRmaWx0ZXJQcm9kdWN0cyggZm9yY2VSZXJlbmRlciApO1xuXHR9XG5cblx0ZnVuY3Rpb24gc2luZ2xlRmlsdGVyKCBmaWx0ZXJLZXksIGZpbHRlclZhbHVlICkge1xuXHRcdGNvbnN0IHBhcmFtcyA9IGdldFVybFZhcnMoKTtcblx0XHRsZXQgcXVlcnk7XG5cblx0XHRpZiAoIHR5cGVvZiBwYXJhbXNbIGZpbHRlcktleSBdICE9PSAndW5kZWZpbmVkJyAmJiBwYXJhbXNbIGZpbHRlcktleSBdID09PSBmaWx0ZXJWYWx1ZSApIHtcblx0XHRcdHF1ZXJ5ID0gcmVtb3ZlUXVlcnlTdHJpbmdQYXJhbWV0ZXIoIGZpbHRlcktleSApO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRxdWVyeSA9IHVwZGF0ZVF1ZXJ5U3RyaW5nUGFyYW1ldGVyKCBmaWx0ZXJLZXksIGZpbHRlclZhbHVlLCBmYWxzZSApO1xuXHRcdH1cblxuXHRcdC8vIHVwZGF0ZSB1cmxcblx0XHRoaXN0b3J5LnB1c2hTdGF0ZSgge30sICcnLCBxdWVyeSApO1xuXG5cdFx0ZmlsdGVyUHJvZHVjdHMoKTtcblx0fVxuXG5cdC8vIEhhbmRsZSB0aGUgcGFnaW5hdGlvbiByZXF1ZXN0IHZpYSBhamF4LlxuXHRpZiAoIHdjYXBmX3BhcmFtcy5lbmFibGVfcGFnaW5hdGlvbl92aWFfYWpheCAmJiB3Y2FwZl9wYXJhbXMucGFnaW5hdGlvbl9jb250YWluZXIgKSB7XG5cdFx0Y29uc3QgJGNvbnRhaW5lciA9ICQoIHdjYXBmX3BhcmFtcy5zaG9wX2xvb3BfY29udGFpbmVyICk7XG5cdFx0Y29uc3Qgc2VsZWN0b3IgICA9IHdjYXBmX3BhcmFtcy5wYWdpbmF0aW9uX2NvbnRhaW5lciArICcgYSc7XG5cblx0XHRpZiAoICRjb250YWluZXIubGVuZ3RoICkge1xuXHRcdFx0JGNvbnRhaW5lci5vbiggJ2NsaWNrJywgc2VsZWN0b3IsIGZ1bmN0aW9uKCBlICkge1xuXHRcdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cblx0XHRcdFx0Y29uc3QgbG9jYXRpb24gPSAkKCB0aGlzICkuYXR0ciggJ2hyZWYnICk7XG5cblx0XHRcdFx0aGlzdG9yeS5wdXNoU3RhdGUoIHt9LCAnJywgbG9jYXRpb24gKTtcblxuXHRcdFx0XHRmaWx0ZXJQcm9kdWN0cygpO1xuXHRcdFx0fSApO1xuXHRcdH1cblx0fVxuXG5cdC8vIFRoZSBmdW5jdGlvbiB0byBoYW5kbGUgdGhlIGNvbW1vbiBmaWx0ZXIgcmVxdWVzdHMuXG5cdGZ1bmN0aW9uIGhhbmRsZUZpbHRlclJlcXVlc3QoICRpdGVtLCBmaWx0ZXJWYWx1ZSApIHtcblx0XHRjb25zdCAkZmllbGQgICAgICAgICA9ICRpdGVtLmNsb3Nlc3QoICcud2NhcGYtc2luZ2xlLWZpbHRlcicgKTtcblx0XHRjb25zdCBmaWVsZElEICAgICAgICA9ICRmaWVsZC5hdHRyKCAnZGF0YS1pZCcgKTtcblx0XHRjb25zdCBmaWVsZERhdGEgICAgICA9IGZpZWxkc1sgZmllbGRJRCBdO1xuXHRcdGNvbnN0IGZpbHRlcktleSAgICAgID0gZmllbGREYXRhLmZpbHRlcktleTtcblx0XHRjb25zdCBtdWx0aXBsZUZpbHRlciA9IGZpZWxkRGF0YS5tdWx0aXBsZUZpbHRlcjtcblxuXHRcdGlmICggISBmaWx0ZXJLZXkgKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0aWYgKCAhIGZpbHRlclZhbHVlLmxlbmd0aCApIHtcblx0XHRcdGNvbnN0IHF1ZXJ5ID0gcmVtb3ZlUXVlcnlTdHJpbmdQYXJhbWV0ZXIoIGZpbHRlcktleSApO1xuXHRcdFx0aGlzdG9yeS5wdXNoU3RhdGUoIHt9LCAnJywgcXVlcnkgKTtcblxuXHRcdFx0ZmlsdGVyUHJvZHVjdHMoKTtcblxuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdGlmICggbXVsdGlwbGVGaWx0ZXIgKSB7XG5cdFx0XHRtYWtlUGFyYW1ldGVycyggZmlsdGVyS2V5LCBmaWx0ZXJWYWx1ZSApO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRzaW5nbGVGaWx0ZXIoIGZpbHRlcktleSwgZmlsdGVyVmFsdWUgKTtcblx0XHR9XG5cdH1cblxuXHQvLyBIYW5kbGUgdGhlIGZpbHRlciByZXF1ZXN0IGZvciBsaXN0IGZpZWxkLlxuXHQkd2NhcGZOYXZGaWx0ZXJzLm9uKFxuXHRcdCdjaGFuZ2UnLFxuXHRcdCcud2NhcGYtbGF5ZXJlZC1uYXYgW3R5cGU9XCJjaGVja2JveFwiXSwgLndjYXBmLWxheWVyZWQtbmF2IFt0eXBlPVwicmFkaW9cIl0nLFxuXHRcdGZ1bmN0aW9uKCBldmVudCApIHtcblx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cblx0XHRcdGNvbnN0ICRpdGVtICAgICAgID0gJCggdGhpcyApO1xuXHRcdFx0Y29uc3QgZmlsdGVyVmFsdWUgPSAkaXRlbS52YWwoKTtcblxuXHRcdFx0aGFuZGxlRmlsdGVyUmVxdWVzdCggJGl0ZW0sIGZpbHRlclZhbHVlICk7XG5cdFx0fVxuXHQpO1xuXG5cdC8vIEhhbmRsZSB0aGUgZmlsdGVyIHJlcXVlc3QgZm9yIGxhYmVsZWQgaXRlbS5cblx0JHdjYXBmTmF2RmlsdGVycy5vbiggJ2NsaWNrJywgJy53Y2FwZi1sYWJlbGVkLW5hdiAuaXRlbTpub3QoLmRpc2FibGVkKScsIGZ1bmN0aW9uKCBldmVudCApIHtcblx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXG5cdFx0Y29uc3QgJGl0ZW0gICAgICAgPSAkKCB0aGlzICk7XG5cdFx0Y29uc3QgZmlsdGVyVmFsdWUgPSAkaXRlbS5hdHRyKCAnZGF0YS12YWx1ZScgKTtcblxuXHRcdGhhbmRsZUZpbHRlclJlcXVlc3QoICRpdGVtLCBmaWx0ZXJWYWx1ZSApO1xuXHR9ICk7XG5cblx0Ly8gSGFuZGxlIHRoZSBmaWx0ZXIgcmVxdWVzdCBmb3IgZGlzcGxheSB0eXBlIHNlbGVjdCBmaWVsZHMuXG5cdCR3Y2FwZk5hdkZpbHRlcnMub24oICdjaGFuZ2UnLCAnc2VsZWN0JywgZnVuY3Rpb24oIGV2ZW50ICkge1xuXHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cblx0XHRjb25zdCAkaXRlbSAgICAgICA9ICQoIHRoaXMgKTtcblx0XHRjb25zdCBmaWx0ZXJWYWx1ZSA9ICRpdGVtLnZhbCgpO1xuXG5cdFx0Y29uc3QgJGZpZWxkICAgID0gJGl0ZW0uY2xvc2VzdCggJy53Y2FwZi1zaW5nbGUtZmlsdGVyJyApO1xuXHRcdGNvbnN0IGZpZWxkSUQgICA9ICRmaWVsZC5hdHRyKCAnZGF0YS1pZCcgKTtcblx0XHRjb25zdCBmaWVsZERhdGEgPSBmaWVsZHNbIGZpZWxkSUQgXTtcblx0XHRjb25zdCBmaWx0ZXJLZXkgPSBmaWVsZERhdGEuZmlsdGVyS2V5O1xuXG5cdFx0aWYgKCAhIGZpbHRlclZhbHVlLmxlbmd0aCApIHtcblx0XHRcdGNvbnN0IHF1ZXJ5ID0gcmVtb3ZlUXVlcnlTdHJpbmdQYXJhbWV0ZXIoIGZpbHRlcktleSApO1xuXHRcdFx0aGlzdG9yeS5wdXNoU3RhdGUoIHt9LCAnJywgcXVlcnkgKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0Y29uc3QgZmlsdGVyVmFsU3RyaW5nID0gZmlsdGVyVmFsdWUudG9TdHJpbmcoKTtcblx0XHRcdHVwZGF0ZVF1ZXJ5U3RyaW5nUGFyYW1ldGVyKCBmaWx0ZXJLZXksIGZpbHRlclZhbFN0cmluZyApO1xuXHRcdH1cblxuXHRcdGZpbHRlclByb2R1Y3RzKCk7XG5cdH0gKTtcblxuXHQvKipcblx0ICogSGFuZGxlIHRoZSBmaWx0ZXIgcmVxdWVzdCBmb3IgcmFuZ2UgbnVtYmVyLlxuXHQgKi9cblx0Y29uc3QgcmFuZ2VOdW1iZXJTZWxlY3RvcnMgPSAnLndjYXBmLXJhbmdlLW51bWJlciAubWluLXZhbHVlLCAud2NhcGYtcmFuZ2UtbnVtYmVyIC5tYXgtdmFsdWUnO1xuXG5cdCR3Y2FwZk51bWJlclJhbmdlRmlsdGVycy5vbiggJ2lucHV0JywgcmFuZ2VOdW1iZXJTZWxlY3RvcnMsIGZ1bmN0aW9uKCBldmVudCApIHtcblx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXG5cdFx0Y29uc3QgJGl0ZW0gPSAkKCB0aGlzICk7XG5cblx0XHQvLyBDbGVhciBhbnkgcHJldmlvdXNseSBzZXQgdGltZXIgYmVmb3JlIHNldHRpbmcgYSBmcmVzaCBvbmVcblx0XHRjbGVhclRpbWVvdXQoICRpdGVtLmRhdGEoICd0aW1lcicgKSApO1xuXG5cdFx0JGl0ZW0uZGF0YSggJ3RpbWVyJywgc2V0VGltZW91dCggZnVuY3Rpb24oKSB7XG5cdFx0XHQkaXRlbS5yZW1vdmVEYXRhKCAndGltZXInICk7XG5cblx0XHRcdGNvbnN0ICRyYW5nZU51bWJlciAgPSAkaXRlbS5jbG9zZXN0KCAnLndjYXBmLXJhbmdlLW51bWJlcicgKTtcblx0XHRcdGNvbnN0IGZpbHRlcktleSAgICAgPSAkcmFuZ2VOdW1iZXIuYXR0ciggJ2RhdGEtZmlsdGVyLWtleScgKTtcblx0XHRcdGNvbnN0IHJhbmdlTWluVmFsdWUgPSAkcmFuZ2VOdW1iZXIuYXR0ciggJ2RhdGEtcmFuZ2UtbWluLXZhbHVlJyApO1xuXHRcdFx0Y29uc3QgcmFuZ2VNYXhWYWx1ZSA9ICRyYW5nZU51bWJlci5hdHRyKCAnZGF0YS1yYW5nZS1tYXgtdmFsdWUnICk7XG5cdFx0XHRsZXQgbWluVmFsdWUgICAgICAgID0gJHJhbmdlTnVtYmVyLmZpbmQoICcubWluLXZhbHVlJyApLnZhbCgpO1xuXHRcdFx0bGV0IG1heFZhbHVlICAgICAgICA9ICRyYW5nZU51bWJlci5maW5kKCAnLm1heC12YWx1ZScgKS52YWwoKTtcblxuXHRcdFx0Ly8gRm9yY2UgdGhlIG1pblZhbHVlIG5vdCB0byBiZSBlbXB0eS5cblx0XHRcdGlmICggISBtaW5WYWx1ZS5sZW5ndGggKSB7XG5cdFx0XHRcdG1pblZhbHVlID0gcmFuZ2VNaW5WYWx1ZTtcblxuXHRcdFx0XHQkcmFuZ2VOdW1iZXIuZmluZCggJy5taW4tdmFsdWUnICkudmFsKCBtaW5WYWx1ZSApO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBGb3JjZSB0aGUgbWF4VmFsdWUgbm90IHRvIGJlIGVtcHR5LlxuXHRcdFx0aWYgKCAhIG1heFZhbHVlLmxlbmd0aCApIHtcblx0XHRcdFx0bWF4VmFsdWUgPSByYW5nZU1heFZhbHVlO1xuXG5cdFx0XHRcdCRyYW5nZU51bWJlci5maW5kKCAnLm1heC12YWx1ZScgKS52YWwoIG1heFZhbHVlICk7XG5cdFx0XHR9XG5cblx0XHRcdC8vIEZvcmNlIHRoZSBtaW5WYWx1ZSBub3QgdG8gZ28gYmVsb3cgdGhlIHJhbmdlTWluVmFsdWUuXG5cdFx0XHRpZiAoIHBhcnNlRmxvYXQoIG1pblZhbHVlICkgPCBwYXJzZUZsb2F0KCByYW5nZU1pblZhbHVlICkgKSB7XG5cdFx0XHRcdG1pblZhbHVlID0gcmFuZ2VNaW5WYWx1ZTtcblxuXHRcdFx0XHQkcmFuZ2VOdW1iZXIuZmluZCggJy5taW4tdmFsdWUnICkudmFsKCBtaW5WYWx1ZSApO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBGb3JjZSB0aGUgbWluVmFsdWUgbm90IHRvIGdvIHVwIHRoZSByYW5nZU1heFZhbHVlLlxuXHRcdFx0aWYgKCBwYXJzZUZsb2F0KCBtaW5WYWx1ZSApID4gcGFyc2VGbG9hdCggcmFuZ2VNYXhWYWx1ZSApICkge1xuXHRcdFx0XHRtaW5WYWx1ZSA9IHJhbmdlTWF4VmFsdWU7XG5cblx0XHRcdFx0JHJhbmdlTnVtYmVyLmZpbmQoICcubWluLXZhbHVlJyApLnZhbCggbWluVmFsdWUgKTtcblx0XHRcdH1cblxuXHRcdFx0Ly8gRm9yY2UgdGhlIG1heFZhbHVlIG5vdCB0byBnbyB1cCB0aGUgcmFuZ2VNYXhWYWx1ZS5cblx0XHRcdGlmICggcGFyc2VGbG9hdCggbWF4VmFsdWUgKSA+IHBhcnNlRmxvYXQoIHJhbmdlTWF4VmFsdWUgKSApIHtcblx0XHRcdFx0bWF4VmFsdWUgPSByYW5nZU1heFZhbHVlO1xuXG5cdFx0XHRcdCRyYW5nZU51bWJlci5maW5kKCAnLm1heC12YWx1ZScgKS52YWwoIG1heFZhbHVlICk7XG5cdFx0XHR9XG5cblx0XHRcdC8vIEZvcmNlIHRoZSBtYXhWYWx1ZSBub3QgdG8gZ28gYmVsb3cgdGhlIG1pblZhbHVlLlxuXHRcdFx0aWYgKCBwYXJzZUZsb2F0KCBtaW5WYWx1ZSApID4gcGFyc2VGbG9hdCggbWF4VmFsdWUgKSApIHtcblx0XHRcdFx0bWF4VmFsdWUgPSBtaW5WYWx1ZTtcblxuXHRcdFx0XHQkcmFuZ2VOdW1iZXIuZmluZCggJy5tYXgtdmFsdWUnICkudmFsKCBtYXhWYWx1ZSApO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAoIG1pblZhbHVlID09PSByYW5nZU1pblZhbHVlICYmIG1heFZhbHVlID09PSByYW5nZU1heFZhbHVlICkge1xuXHRcdFx0XHRjb25zdCBxdWVyeSA9IHJlbW92ZVF1ZXJ5U3RyaW5nUGFyYW1ldGVyKCBmaWx0ZXJLZXkgKTtcblx0XHRcdFx0aGlzdG9yeS5wdXNoU3RhdGUoIHt9LCAnJywgcXVlcnkgKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGNvbnN0IGZpbHRlclZhbFN0cmluZyA9IG1pblZhbHVlICsgcmFuZ2VWYWx1ZXNTZXBhcmF0b3IgKyBtYXhWYWx1ZTtcblx0XHRcdFx0dXBkYXRlUXVlcnlTdHJpbmdQYXJhbWV0ZXIoIGZpbHRlcktleSwgZmlsdGVyVmFsU3RyaW5nICk7XG5cdFx0XHR9XG5cblx0XHRcdGZpbHRlclByb2R1Y3RzKCk7XG5cdFx0fSwgZGVsYXkgKSApO1xuXHR9ICk7XG5cblx0Ly8gSGFuZGxlIHJlbW92aW5nIHRoZSBhY3RpdmUgZmlsdGVycy5cblx0JHdjYXBmTmF2RmlsdGVycy5vbiggJ2NsaWNrJywgJy53Y2FwZi1hY3RpdmUtZmlsdGVycyAuaXRlbTpub3QoLmRpc2FibGVkKScsIGZ1bmN0aW9uKCBldmVudCApIHtcblx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXG5cdFx0Y29uc3QgJGl0ZW0gICAgICAgPSAkKCB0aGlzICk7XG5cdFx0Y29uc3QgZmlsdGVyS2V5ICAgPSAkaXRlbS5hdHRyKCAnZGF0YS1maWx0ZXIta2V5JyApO1xuXHRcdGNvbnN0IGZpbHRlclZhbHVlID0gJGl0ZW0uYXR0ciggJ2RhdGEtdmFsdWUnICk7XG5cblx0XHRtYWtlUGFyYW1ldGVycyggZmlsdGVyS2V5LCBmaWx0ZXJWYWx1ZSwgdHJ1ZSApO1xuXHR9ICk7XG5cblx0ZnVuY3Rpb24gcmVzZXRGaWx0ZXJzKCAkYnV0dG9uICkge1xuXHRcdGNvbnN0IF9maWx0ZXJLZXlzID0gJGJ1dHRvbi5hdHRyKCAnZGF0YS1rZXlzJyApO1xuXG5cdFx0aWYgKCAhIF9maWx0ZXJLZXlzICkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdGNvbnN0IGZpbHRlcktleXMgPSBfZmlsdGVyS2V5cy5zcGxpdCggJywnICk7XG5cblx0XHRsZXQgcXVlcnkgPSAnJztcblxuXHRcdCQuZWFjaCggZmlsdGVyS2V5cywgZnVuY3Rpb24oIGksIGZpbHRlcktleSApIHtcblx0XHRcdGlmICggcXVlcnkgKSB7XG5cdFx0XHRcdHF1ZXJ5ID0gcmVtb3ZlUXVlcnlTdHJpbmdQYXJhbWV0ZXIoIGZpbHRlcktleSwgcXVlcnkgKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHF1ZXJ5ID0gcmVtb3ZlUXVlcnlTdHJpbmdQYXJhbWV0ZXIoIGZpbHRlcktleSApO1xuXHRcdFx0fVxuXHRcdH0gKTtcblxuXHRcdC8vIEVtcHR5IHF1ZXJ5IGNhdXNlcyBpc3N1ZShkb2Vzbid0IHJlbW92ZSB0aGUgZmlsdGVyIGtleXMgZnJvbSB0aGUgdXJsKSxcblx0XHQvLyB0aGlzIGlzIHdoeSB3ZSBhcmUgc2V0dGluZyB0aGUgcGFnZSB1cmwgYXMgcXVlcnkuXG5cdFx0aWYgKCAhIHF1ZXJ5ICkge1xuXHRcdFx0Y29uc3QgcHJldlVybCA9IHdpbmRvdy5sb2NhdGlvbi5ocmVmO1xuXHRcdFx0Y29uc3QgbmV3VXJsICA9IHByZXZVcmwuc3BsaXQoICc/JyApO1xuXG5cdFx0XHRxdWVyeSA9IG5ld1VybFsgMCBdO1xuXHRcdH1cblxuXHRcdGhpc3RvcnkucHVzaFN0YXRlKCB7fSwgJycsIHF1ZXJ5ICk7XG5cblx0XHRmaWx0ZXJQcm9kdWN0cyggdHJ1ZSApO1xuXHR9XG5cblx0Ly8gQ2xlYXIvUmVzZXQgYWxsIGZpbHRlcnMuXG5cdCRib2R5Lm9uKCAnd2NhcGYtcmVzZXQtZmlsdGVycycsIGZ1bmN0aW9uKCBlLCAkYnV0dG9uICkge1xuXHRcdHJlc2V0RmlsdGVycyggJGJ1dHRvbiApO1xuXHR9ICk7XG5cblx0JHdjYXBmTmF2RmlsdGVycy5vbiggJ2NsaWNrJywgJy53Y2FwZi1yZXNldC1maWx0ZXJzLWJ0bicsIGZ1bmN0aW9uKCBldmVudCApIHtcblx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXG5cdFx0Y29uc3QgJGJ1dHRvbiA9ICQoIHRoaXMgKTtcblxuXHRcdCRib2R5LnRyaWdnZXIoICd3Y2FwZi1yZXNldC1maWx0ZXJzJywgWyAkYnV0dG9uIF0gKTtcblx0fSApO1xuXG5cdCR3Y2FwZlNpbmdsZUZpbHRlcnMub24oICd3Y2FwZi1jbGVhci1maWx0ZXInLCBmdW5jdGlvbigpIHtcblx0XHRjb25zdCAkZmllbGQgICAgPSAkKCB0aGlzICk7XG5cdFx0Y29uc3QgZmllbGRJRCAgID0gJGZpZWxkLmF0dHIoICdkYXRhLWlkJyApO1xuXHRcdGNvbnN0IGZpZWxkRGF0YSA9IGZpZWxkc1sgZmllbGRJRCBdO1xuXHRcdGNvbnN0IGZpbHRlcktleSA9IGZpZWxkRGF0YS5maWx0ZXJLZXk7XG5cblx0XHRjb25zdCBxdWVyeSA9IHJlbW92ZVF1ZXJ5U3RyaW5nUGFyYW1ldGVyKCBmaWx0ZXJLZXkgKTtcblx0XHRoaXN0b3J5LnB1c2hTdGF0ZSgge30sICcnLCBxdWVyeSApO1xuXG5cdFx0ZmlsdGVyUHJvZHVjdHMoIHRydWUgKTtcblx0fSApO1xuXG5cdCRib2R5Lm9uKCAnd2NhcGYtcnVuLWZpbHRlci1wcm9kdWN0cycsIGZ1bmN0aW9uKCBlLCBmb3JjZVJlUmVuZGVyICkge1xuXHRcdGZpbHRlclByb2R1Y3RzKCBmb3JjZVJlUmVuZGVyICk7XG5cdH0gKTtcblxuXHRpZiAoICQoIHdjYXBmX3BhcmFtcy5zaG9wX2xvb3BfY29udGFpbmVyICkubGVuZ3RoIHx8ICQoIHdjYXBmX3BhcmFtcy5ub3RfZm91bmRfY29udGFpbmVyICkubGVuZ3RoICkge1xuXHRcdGlmICggd2NhcGZfcGFyYW1zLmFwcGx5X2ZpbHRlcnNfb25fYnJvd3Nlcl9oaXN0b3J5X2NoYW5nZSApIHtcblx0XHRcdCQoIHdpbmRvdyApLmJpbmQoICdwb3BzdGF0ZScsIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRmaWx0ZXJQcm9kdWN0cyggdHJ1ZSApO1xuXHRcdFx0fSApO1xuXHRcdH1cblx0fVxuXG59ICk7XG4iXX0=
