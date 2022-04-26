"use strict";

/**
 * Display type fields.
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
  'shop_loop_container': '',
  'not_found_container': '',
  'pagination_container': '',
  'overlay_bg_color': '',
  'sorting_control': '',
  'scroll_to_top': '',
  'scroll_to_top_offset': '',
  'custom_scripts': ''
};
jQuery(document).ready(function ($) {
  // return false if wcapf_params variable is not found
  if (typeof wcapf_params === 'undefined') {
    return false;
  }

  var delay = 800; // store fields' id and filter information

  var fields = {};
  var $wcapfTermFilter = $('.wcapf-ajax-term-filter');
  $wcapfTermFilter.each(function () {
    var $field = $(this);
    var id = $field.attr('id');
    var $wrapper = $field.children('div');
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

    $wcapfTermFilter.find('.wcapf-chosen-select').each(function () {
      var $this = $(this);
      var options = {};
      var noResultsMessage = $this.attr('data-no-results-message');

      if (noResultsMessage) {
        options['no_results_text'] = noResultsMessage;
      }

      $this.chosen(options);
    });
  }

  initChosen(); // Initialize hierarchy accordion

  function initHierarchyAccordion() {
    $wcapfTermFilter.find('.hierarchy-accordion-toggle').on('click', function () {
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
    number = (number + '').replace(/[^0-9+\-Ee.]/g, '');
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
    $wcapfTermFilter.find('.wcapf-range-slider').each(function () {
      var $item = $(this);
      var filterKey = $item.attr('data-filter-key');
      var $slider = $item.find('.wcapf-noui-slider');
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

      if ('undefined' === typeof noUiSlider) {
        return;
      }

      var slider = document.getElementById(sliderId);
      noUiSlider.create(slider, {
        start: [minValue, maxValue],
        step: step,
        connect: true,
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
      });

      function filterProductsAccordingToSlider(values) {
        var minValue = parseFloat(values[0]);
        var maxValue = parseFloat(values[1]);

        if (minValue === rangeMinValue && maxValue === rangeMaxValue) {
          var query = wcapfRemoveQueryStringParameter(filterKey);
          history.pushState({}, '', query);
        } else {
          var filterValString = minValue + '+' + maxValue;
          wcapfUpdateQueryStringParameter(filterKey, filterValString);
        } // filter products


        wcapfFilterProducts();
      }

      slider.noUiSlider.on('end', function (values) {
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

  initNoUISlider(); // show a loading indicator

  function wcapfBeforeUpdate() {} // scroll to top


  function wcapfAfterUpdate() {
    initChosen();
    initHierarchyAccordion();
    initNoUISlider();
    $('body').trigger('wcapf_after_update');
  } // filter the products


  function wcapfFilterProducts() {
    wcapfBeforeUpdate();
    $.get(window.location.href, function (data) {
      var $data = $(data);
      var $shopLoopContainer = $data.find(wcapf_params.shop_loop_container);
      var $notFoundContainer = $data.find(wcapf_params.not_found_container); // replace fields' data with new data

      $.each(fields, function (id) {
        var fieldID = '#' + id;
        var $field = $(fieldID);

        var _field = $data.find(fieldID);

        var fieldClass = $(_field).attr('class'); // update class

        $field.attr('class', fieldClass); // update field

        $field.html(_field.html());
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

      wcapfAfterUpdate(); // reinitialize ordering
      // wcapfInitOrder();
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
    var currentPageInUrl = parseInt(url.replace(/.+\/page\/([0-9]+)+/, '$1'));

    if (currentPageInUrl) {
      if (currentPageInUrl > 1) {
        url = url.replace(/page\/([0-9]+)/, 'page/1');
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


  function wcapfMakeParameters(filterKey, filterValue, url) {
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
      var prevValuesArray = prevValues.split(',');

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
          nextValues = prevValuesArray.join(',');
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


    wcapfFilterProducts();
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
    var $field = $item.closest('.wcapf-field-filter-form');
    var fieldID = $field.attr('id');
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


  $wcapfTermFilter.on('change', '.wcapf-layered-nav [type="checkbox"], .wcapf-layered-nav [type="radio"]', function (event) {
    event.preventDefault();
    var $item = $(this);
    var filterValue = $item.val();
    handleFilterRequest($item, filterValue);
  }); // TODO: Use a combination of label, checkbox and radio
  // handle the filter request for labeled item

  $wcapfTermFilter.on('click', '.wcapf-labeled-nav .item', function (event) {
    event.preventDefault();
    var $item = $(this);
    var filterValue = $item.attr('data-value');
    handleFilterRequest($item, filterValue);
  }); // handle the filter request for display type select fields

  $wcapfTermFilter.on('change', 'select', function (event) {
    event.preventDefault();
    var $item = $(this);
    var filterValue = $item.val();
    var $field = $item.closest('.wcapf-field-filter-form');
    var fieldID = $field.attr('id');
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

  $wcapfTermFilter.on('input', '.wcapf-range-number .min-value, .wcapf-range-number .max-value', function (event) {
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
      var maxValue = $rangeNumber.find('.max-value').val();

      if (!minValue.length) {
        minValue = rangeMinValue;
      }

      if (!maxValue.length) {
        maxValue = rangeMaxValue;
      }

      if (parseFloat(minValue) > parseFloat(maxValue)) {
        maxValue = minValue;
      }

      if (minValue === rangeMinValue && maxValue === rangeMaxValue) {
        var query = wcapfRemoveQueryStringParameter(filterKey);
        history.pushState({}, '', query);
      } else {
        var filterValString = minValue + '+' + maxValue;
        wcapfUpdateQueryStringParameter(filterKey, filterValString);
      } // filter products


      wcapfFilterProducts();
    }, delay));
  }); // history back and forward request handling

  $(window).bind('popstate', function () {
    // filter products
    wcapfFilterProducts();
  });
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNob3Nlbi5qcyIsImZpbHRlci1mb3JtLmpzIl0sIm5hbWVzIjpbImpRdWVyeSIsImRvY3VtZW50IiwicmVhZHkiLCIkIiwid2NhcGZfcGFyYW1zIiwiZGVsYXkiLCJmaWVsZHMiLCIkd2NhcGZUZXJtRmlsdGVyIiwiZWFjaCIsIiRmaWVsZCIsImlkIiwiYXR0ciIsIiR3cmFwcGVyIiwiY2hpbGRyZW4iLCJmaWx0ZXJLZXkiLCJtdWx0aXBsZUZpbHRlciIsInBhcnNlSW50IiwiaW5pdENob3NlbiIsImNob3NlbiIsImZpbmQiLCIkdGhpcyIsIm9wdGlvbnMiLCJub1Jlc3VsdHNNZXNzYWdlIiwiaW5pdEhpZXJhcmNoeUFjY29yZGlvbiIsIm9uIiwidG9nZ2xlQ2xhc3MiLCJudW1iZXJfZm9ybWF0IiwibnVtYmVyIiwiZGVjaW1hbHMiLCJkZWNfcG9pbnQiLCJ0aG91c2FuZHNfc2VwIiwicmVwbGFjZSIsIm4iLCJpc0Zpbml0ZSIsInByZWMiLCJNYXRoIiwiYWJzIiwic2VwIiwiZGVjIiwicyIsInRvRml4ZWRGaXgiLCJrIiwicG93Iiwicm91bmQiLCJzcGxpdCIsImxlbmd0aCIsIkFycmF5Iiwiam9pbiIsImluaXROb1VJU2xpZGVyIiwiJGl0ZW0iLCIkc2xpZGVyIiwic2xpZGVySWQiLCJkaXNwbGF5VmFsdWVzQXMiLCJyYW5nZU1pblZhbHVlIiwicGFyc2VGbG9hdCIsInJhbmdlTWF4VmFsdWUiLCJzdGVwIiwiZGVjaW1hbFBsYWNlcyIsInRob3VzYW5kU2VwYXJhdG9yIiwiZGVjaW1hbFNlcGFyYXRvciIsIm1pblZhbHVlIiwibWF4VmFsdWUiLCIkbWluVmFsdWUiLCIkbWF4VmFsdWUiLCJub1VpU2xpZGVyIiwic2xpZGVyIiwiZ2V0RWxlbWVudEJ5SWQiLCJjcmVhdGUiLCJzdGFydCIsImNvbm5lY3QiLCJyYW5nZSIsInZhbHVlcyIsImh0bWwiLCJ2YWwiLCJmaWx0ZXJQcm9kdWN0c0FjY29yZGluZ1RvU2xpZGVyIiwicXVlcnkiLCJ3Y2FwZlJlbW92ZVF1ZXJ5U3RyaW5nUGFyYW1ldGVyIiwiaGlzdG9yeSIsInB1c2hTdGF0ZSIsImZpbHRlclZhbFN0cmluZyIsIndjYXBmVXBkYXRlUXVlcnlTdHJpbmdQYXJhbWV0ZXIiLCJ3Y2FwZkZpbHRlclByb2R1Y3RzIiwiY2xlYXJUaW1lb3V0IiwiZGF0YSIsInNldFRpbWVvdXQiLCJyZW1vdmVEYXRhIiwiZXZlbnQiLCJwcmV2ZW50RGVmYXVsdCIsIiRpbnB1dCIsInNldCIsImdldCIsIndjYXBmQmVmb3JlVXBkYXRlIiwid2NhcGZBZnRlclVwZGF0ZSIsInRyaWdnZXIiLCJ3aW5kb3ciLCJsb2NhdGlvbiIsImhyZWYiLCIkZGF0YSIsIiRzaG9wTG9vcENvbnRhaW5lciIsInNob3BfbG9vcF9jb250YWluZXIiLCIkbm90Rm91bmRDb250YWluZXIiLCJub3RfZm91bmRfY29udGFpbmVyIiwiZmllbGRJRCIsIl9maWVsZCIsImZpZWxkQ2xhc3MiLCJjdXN0b21fc2NyaXB0cyIsImV2YWwiLCJ3Y2FwZkdldFVybFZhcnMiLCJ1cmwiLCJ2YXJzIiwiaGFzaCIsImhhc2hlcyIsInNsaWNlIiwiaW5kZXhPZiIsImhMZW5ndGgiLCJpIiwid2NhcGZGaXhQYWdpbmF0aW9uIiwicGFyYW1zIiwiY3VycmVudFBhZ2VJblVybCIsImN1cnJlbnRQYWdlSW5QYXJhbXMiLCJrZXkiLCJ2YWx1ZSIsInB1c2hIaXN0b3J5IiwicmUiLCJSZWdFeHAiLCJzZXBhcmF0b3IiLCJ1cmxXaXRoUXVlcnkiLCJtYXRjaCIsIm9sZFBhcmFtcyIsIm9sZFBhcmFtc0xlbmd0aCIsIk9iamVjdCIsImtleXMiLCJzdGFydFBvc2l0aW9uIiwiZmlsdGVyS2V5UG9zaXRpb24iLCJjbGVhblVybCIsImNsZWFuUXVlcnkiLCJuZXdQYXJhbXMiLCJ3Y2FwZk1ha2VQYXJhbWV0ZXJzIiwiZmlsdGVyVmFsdWUiLCJuZXh0VmFsdWVzIiwiZW1wdHlWYWx1ZSIsInByZXZWYWx1ZXMiLCJwcmV2VmFsdWVzQXJyYXkiLCJmb3VuZCIsImluQXJyYXkiLCJzcGxpY2UiLCJwdXNoIiwid2NhcGZTaW5nbGVGaWx0ZXIiLCJoYW5kbGVGaWx0ZXJSZXF1ZXN0IiwiY2xvc2VzdCIsImZpZWxkRGF0YSIsInRvU3RyaW5nIiwiJHJhbmdlTnVtYmVyIiwiYmluZCJdLCJtYXBwaW5ncyI6Ijs7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUFBLE1BQU0sQ0FBRUMsUUFBRixDQUFOLENBQW1CQyxLQUFuQixDQUEwQixVQUFVQyxDQUFWLEVBQWMsQ0FJdkMsQ0FKRDs7O0FDVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBLElBQU1DLFlBQVksR0FBR0EsWUFBWSxJQUFJO0FBQ3BDLHlCQUF1QixFQURhO0FBRXBDLHlCQUF1QixFQUZhO0FBR3BDLDBCQUF3QixFQUhZO0FBSXBDLHNCQUFvQixFQUpnQjtBQUtwQyxxQkFBbUIsRUFMaUI7QUFNcEMsbUJBQWlCLEVBTm1CO0FBT3BDLDBCQUF3QixFQVBZO0FBUXBDLG9CQUFrQjtBQVJrQixDQUFyQztBQVdBSixNQUFNLENBQUVDLFFBQUYsQ0FBTixDQUFtQkMsS0FBbkIsQ0FDQyxVQUFVQyxDQUFWLEVBQWM7QUFFYjtBQUNBLE1BQUssT0FBT0MsWUFBUCxLQUF3QixXQUE3QixFQUEyQztBQUMxQyxXQUFPLEtBQVA7QUFDQTs7QUFFRCxNQUFNQyxLQUFLLEdBQUcsR0FBZCxDQVBhLENBU2I7O0FBQ0EsTUFBTUMsTUFBTSxHQUFHLEVBQWY7QUFFQSxNQUFNQyxnQkFBZ0IsR0FBR0osQ0FBQyxDQUFFLHlCQUFGLENBQTFCO0FBRUFJLEVBQUFBLGdCQUFnQixDQUFDQyxJQUFqQixDQUNDLFlBQVc7QUFDVixRQUFNQyxNQUFNLEdBQVdOLENBQUMsQ0FBRSxJQUFGLENBQXhCO0FBQ0EsUUFBTU8sRUFBRSxHQUFlRCxNQUFNLENBQUNFLElBQVAsQ0FBYSxJQUFiLENBQXZCO0FBQ0EsUUFBTUMsUUFBUSxHQUFTSCxNQUFNLENBQUNJLFFBQVAsQ0FBaUIsS0FBakIsQ0FBdkI7QUFDQSxR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TyxDQUFDQyxTQUFSLENBQW1CLEVBQW5CLEVBQXVCLEVBQXZCLEVBQTJCSCxLQUEzQjtBQUNBLE9BSEQsTUFHTztBQUNOLFlBQU1JLGVBQWUsR0FBR25CLFFBQVEsR0FBRyxHQUFYLEdBQWlCQyxRQUF6QztBQUNBbUIsUUFBQUEsK0JBQStCLENBQUVsRSxTQUFGLEVBQWFpRSxlQUFiLENBQS9CO0FBQ0EsT0E1QjBDLENBOEIzQzs7O0FBQ0FFLE1BQUFBLG1CQUFtQjtBQUNuQixLQWhDOEIsRUFnQzVCNUUsS0FoQzRCLENBQS9CO0FBaUNBLEdBNUNGLEVBcmlCYSxDQW9sQmI7O0FBQ0FGLEVBQUFBLENBQUMsQ0FBRTJGLE1BQUYsQ0FBRCxDQUFZMkQsSUFBWixDQUFrQixVQUFsQixFQUE4QixZQUFXO0FBQ3hDO0FBQ0F4RSxJQUFBQSxtQkFBbUI7QUFDbkIsR0FIRDtBQUtBLENBM2xCRiIsImZpbGUiOiJ3Yy1hamF4LXByb2R1Y3QtZmlsdGVyLXB1YmxpYy1zY3JpcHRzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBEaXNwbGF5IHR5cGUgZmllbGRzLlxuICpcbiAqIEBzaW5jZSAgICAgIDMuMC4wXG4gKiBAcGFja2FnZSAgICB3Yy1hamF4LXByb2R1Y3QtZmlsdGVyXG4gKiBAc3VicGFja2FnZSB3Yy1hamF4LXByb2R1Y3QtZmlsdGVyL2FkbWluL3NyYy9qc1xuICogQGF1dGhvciAgICAgTWFpbnVsIEhhc3NhbiBNYWluXG4gKi9cblxualF1ZXJ5KCBkb2N1bWVudCApLnJlYWR5KCBmdW5jdGlvbiggJCApIHtcblxuXG5cbn0gKTtcbiIsIi8qKlxuICogVGhlIGZyb250ZW5kIGZpbHRlciBmb3JtLlxuICpcbiAqIEBzaW5jZSAgICAgIDMuMC4wXG4gKiBAcGFja2FnZSAgICB3Yy1hamF4LXByb2R1Y3QtZmlsdGVyXG4gKiBAc3VicGFja2FnZSB3Yy1hamF4LXByb2R1Y3QtZmlsdGVyL3B1YmxpYy9zcmMvanNcbiAqIEBhdXRob3IgICAgIE1haW51bCBIYXNzYW4gTWFpblxuICovXG5cbmNvbnN0IHdjYXBmX3BhcmFtcyA9IHdjYXBmX3BhcmFtcyB8fCB7XG5cdCdzaG9wX2xvb3BfY29udGFpbmVyJzogJycsXG5cdCdub3RfZm91bmRfY29udGFpbmVyJzogJycsXG5cdCdwYWdpbmF0aW9uX2NvbnRhaW5lcic6ICcnLFxuXHQnb3ZlcmxheV9iZ19jb2xvcic6ICcnLFxuXHQnc29ydGluZ19jb250cm9sJzogJycsXG5cdCdzY3JvbGxfdG9fdG9wJzogJycsXG5cdCdzY3JvbGxfdG9fdG9wX29mZnNldCc6ICcnLFxuXHQnY3VzdG9tX3NjcmlwdHMnOiAnJ1xufTtcblxualF1ZXJ5KCBkb2N1bWVudCApLnJlYWR5KFxuXHRmdW5jdGlvbiggJCApIHtcblxuXHRcdC8vIHJldHVybiBmYWxzZSBpZiB3Y2FwZl9wYXJhbXMgdmFyaWFibGUgaXMgbm90IGZvdW5kXG5cdFx0aWYgKCB0eXBlb2Ygd2NhcGZfcGFyYW1zID09PSAndW5kZWZpbmVkJyApIHtcblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9XG5cblx0XHRjb25zdCBkZWxheSA9IDgwMDtcblxuXHRcdC8vIHN0b3JlIGZpZWxkcycgaWQgYW5kIGZpbHRlciBpbmZvcm1hdGlvblxuXHRcdGNvbnN0IGZpZWxkcyA9IHt9O1xuXG5cdFx0Y29uc3QgJHdjYXBmVGVybUZpbHRlciA9ICQoICcud2NhcGYtYWpheC10ZXJtLWZpbHRlcicgKTtcblxuXHRcdCR3Y2FwZlRlcm1GaWx0ZXIuZWFjaChcblx0XHRcdGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRjb25zdCAkZmllbGQgICAgICAgICA9ICQoIHRoaXMgKTtcblx0XHRcdFx0Y29uc3QgaWQgICAgICAgICAgICAgPSAkZmllbGQuYXR0ciggJ2lkJyApO1xuXHRcdFx0XHRjb25zdCAkd3JhcHBlciAgICAgICA9ICRmaWVsZC5jaGlsZHJlbiggJ2RpdicgKTtcblx0XHRcdFx0Y29uc3QgZmlsdGVyS2V5ICAgICAgPSAkd3JhcHBlci5hdHRyKCAnZGF0YS1maWx0ZXIta2V5JyApO1xuXHRcdFx0XHRjb25zdCBtdWx0aXBsZUZpbHRlciA9IHBhcnNlSW50KCAkd3JhcHBlci5hdHRyKCAnZGF0YS1tdWx0aXBsZS1maWx0ZXInICkgKTtcblxuXHRcdFx0XHRmaWVsZHNbIGlkIF0gPSB7XG5cdFx0XHRcdFx0ZmlsdGVyS2V5OiBmaWx0ZXJLZXksXG5cdFx0XHRcdFx0bXVsdGlwbGVGaWx0ZXI6IG11bHRpcGxlRmlsdGVyXG5cdFx0XHRcdH07XG5cdFx0XHR9XG5cdFx0KTtcblxuXHRcdC8vIEluaXRpYWxpemUgalF1ZXJ5IGNob3NlbiBsaWJyYXJ5XG5cdFx0ZnVuY3Rpb24gaW5pdENob3NlbigpIHtcblx0XHRcdGlmICggISBqUXVlcnkoKS5jaG9zZW4gKSB7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblxuXHRcdFx0JHdjYXBmVGVybUZpbHRlci5maW5kKCAnLndjYXBmLWNob3Nlbi1zZWxlY3QnICkuZWFjaCggZnVuY3Rpb24oKSB7XG5cdFx0XHRcdGNvbnN0ICR0aGlzICAgPSAkKCB0aGlzICk7XG5cdFx0XHRcdGNvbnN0IG9wdGlvbnMgPSB7fTtcblxuXHRcdFx0XHRjb25zdCBub1Jlc3VsdHNNZXNzYWdlID0gJHRoaXMuYXR0ciggJ2RhdGEtbm8tcmVzdWx0cy1tZXNzYWdlJyApO1xuXG5cdFx0XHRcdGlmICggbm9SZXN1bHRzTWVzc2FnZSApIHtcblx0XHRcdFx0XHRvcHRpb25zWyAnbm9fcmVzdWx0c190ZXh0JyBdID0gbm9SZXN1bHRzTWVzc2FnZTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdCR0aGlzLmNob3Nlbiggb3B0aW9ucyApO1xuXHRcdFx0fSApO1xuXHRcdH1cblxuXHRcdGluaXRDaG9zZW4oKTtcblxuXHRcdC8vIEluaXRpYWxpemUgaGllcmFyY2h5IGFjY29yZGlvblxuXHRcdGZ1bmN0aW9uIGluaXRIaWVyYXJjaHlBY2NvcmRpb24oKSB7XG5cdFx0XHQkd2NhcGZUZXJtRmlsdGVyLmZpbmQoICcuaGllcmFyY2h5LWFjY29yZGlvbi10b2dnbGUnICkub24oICdjbGljaycsIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHQkKCB0aGlzICkudG9nZ2xlQ2xhc3MoICdhY3RpdmUnICk7XG5cdFx0XHR9ICk7XG5cdFx0fVxuXG5cdFx0aW5pdEhpZXJhcmNoeUFjY29yZGlvbigpO1xuXG5cdFx0LyoqXG5cdFx0ICogQHNvdXJjZSBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL2EvMzQxNDE4MTNcblx0XHQgKlxuXHRcdCAqIEBwYXJhbSBudW1iZXJcblx0XHQgKiBAcGFyYW0gZGVjaW1hbHNcblx0XHQgKiBAcGFyYW0gZGVjX3BvaW50XG5cdFx0ICogQHBhcmFtIHRob3VzYW5kc19zZXBcblx0XHQgKlxuXHRcdCAqIEByZXR1cm5zIHtzdHJpbmd9XG5cdFx0ICovXG5cdFx0ZnVuY3Rpb24gbnVtYmVyX2Zvcm1hdCggbnVtYmVyLCBkZWNpbWFscywgZGVjX3BvaW50LCB0aG91c2FuZHNfc2VwICkge1xuXHRcdFx0Ly8gU3RyaXAgYWxsIGNoYXJhY3RlcnMgYnV0IG51bWVyaWNhbCBvbmVzLlxuXHRcdFx0bnVtYmVyID0gKCBudW1iZXIgKyAnJyApLnJlcGxhY2UoIC9bXjAtOStcXC1FZS5dL2csICcnICk7XG5cblx0XHRcdGNvbnN0IG4gICAgPSAhIGlzRmluaXRlKCArbnVtYmVyICkgPyAwIDogK251bWJlcjtcblx0XHRcdGNvbnN0IHByZWMgPSAhIGlzRmluaXRlKCArZGVjaW1hbHMgKSA/IDAgOiBNYXRoLmFicyggZGVjaW1hbHMgKTtcblx0XHRcdGNvbnN0IHNlcCAgPSAoIHR5cGVvZiB0aG91c2FuZHNfc2VwID09PSAndW5kZWZpbmVkJyApID8gJywnIDogdGhvdXNhbmRzX3NlcDtcblx0XHRcdGNvbnN0IGRlYyAgPSAoIHR5cGVvZiBkZWNfcG9pbnQgPT09ICd1bmRlZmluZWQnICkgPyAnLicgOiBkZWNfcG9pbnQ7XG5cblx0XHRcdGxldCBzO1xuXG5cdFx0XHRjb25zdCB0b0ZpeGVkRml4ID0gZnVuY3Rpb24oIG4sIHByZWMgKSB7XG5cdFx0XHRcdGNvbnN0IGsgPSBNYXRoLnBvdyggMTAsIHByZWMgKTtcblx0XHRcdFx0cmV0dXJuICcnICsgTWF0aC5yb3VuZCggbiAqIGsgKSAvIGs7XG5cdFx0XHR9O1xuXG5cdFx0XHQvLyBGaXggZm9yIElFIHBhcnNlRmxvYXQoMC41NSkudG9GaXhlZCgwKSA9IDA7XG5cdFx0XHRzID0gKCBwcmVjID8gdG9GaXhlZEZpeCggbiwgcHJlYyApIDogJycgKyBNYXRoLnJvdW5kKCBuICkgKS5zcGxpdCggJy4nICk7XG5cblx0XHRcdGlmICggc1sgMCBdLmxlbmd0aCA+IDMgKSB7XG5cdFx0XHRcdHNbIDAgXSA9IHNbIDAgXS5yZXBsYWNlKCAvXFxCKD89KD86XFxkezN9KSsoPyFcXGQpKS9nLCBzZXAgKTtcblx0XHRcdH1cblxuXHRcdFx0aWYgKCAoIHNbIDEgXSB8fCAnJyApLmxlbmd0aCA8IHByZWMgKSB7XG5cdFx0XHRcdHNbIDEgXSA9IHNbIDEgXSB8fCAnJztcblx0XHRcdFx0c1sgMSBdICs9IG5ldyBBcnJheSggcHJlYyAtIHNbIDEgXS5sZW5ndGggKyAxICkuam9pbiggJzAnICk7XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiBzLmpvaW4oIGRlYyApO1xuXHRcdH1cblxuXHRcdC8vIEluaXRpYWxpemUgbm9VSVNsaWRlclxuXHRcdGZ1bmN0aW9uIGluaXROb1VJU2xpZGVyKCkge1xuXHRcdFx0JHdjYXBmVGVybUZpbHRlci5maW5kKCAnLndjYXBmLXJhbmdlLXNsaWRlcicgKS5lYWNoKCBmdW5jdGlvbigpIHtcblx0XHRcdFx0Y29uc3QgJGl0ZW0gPSAkKCB0aGlzICk7XG5cblx0XHRcdFx0Y29uc3QgZmlsdGVyS2V5ICAgICAgICAgPSAkaXRlbS5hdHRyKCAnZGF0YS1maWx0ZXIta2V5JyApO1xuXHRcdFx0XHRjb25zdCAkc2xpZGVyICAgICAgICAgICA9ICRpdGVtLmZpbmQoICcud2NhcGYtbm91aS1zbGlkZXInICk7XG5cdFx0XHRcdGNvbnN0IHNsaWRlcklkICAgICAgICAgID0gJHNsaWRlci5hdHRyKCAnaWQnICk7XG5cdFx0XHRcdGNvbnN0IGRpc3BsYXlWYWx1ZXNBcyAgID0gJGl0ZW0uYXR0ciggJ2RhdGEtZGlzcGxheS12YWx1ZXMtYXMnICk7XG5cdFx0XHRcdGNvbnN0IHJhbmdlTWluVmFsdWUgICAgID0gcGFyc2VGbG9hdCggJGl0ZW0uYXR0ciggJ2RhdGEtcmFuZ2UtbWluLXZhbHVlJyApICk7XG5cdFx0XHRcdGNvbnN0IHJhbmdlTWF4VmFsdWUgICAgID0gcGFyc2VGbG9hdCggJGl0ZW0uYXR0ciggJ2RhdGEtcmFuZ2UtbWF4LXZhbHVlJyApICk7XG5cdFx0XHRcdGNvbnN0IHN0ZXAgICAgICAgICAgICAgID0gcGFyc2VGbG9hdCggJGl0ZW0uYXR0ciggJ2RhdGEtc3RlcCcgKSApO1xuXHRcdFx0XHRjb25zdCBkZWNpbWFsUGxhY2VzICAgICA9ICRpdGVtLmF0dHIoICdkYXRhLWRlY2ltYWwtcGxhY2VzJyApO1xuXHRcdFx0XHRjb25zdCB0aG91c2FuZFNlcGFyYXRvciA9ICRpdGVtLmF0dHIoICdkYXRhLXRob3VzYW5kLXNlcGFyYXRvcicgKTtcblx0XHRcdFx0Y29uc3QgZGVjaW1hbFNlcGFyYXRvciAgPSAkaXRlbS5hdHRyKCAnZGF0YS1kZWNpbWFsLXNlcGFyYXRvcicgKTtcblx0XHRcdFx0Y29uc3QgbWluVmFsdWUgICAgICAgICAgPSBwYXJzZUZsb2F0KCAkaXRlbS5hdHRyKCAnZGF0YS1taW4tdmFsdWUnICkgKTtcblx0XHRcdFx0Y29uc3QgbWF4VmFsdWUgICAgICAgICAgPSBwYXJzZUZsb2F0KCAkaXRlbS5hdHRyKCAnZGF0YS1tYXgtdmFsdWUnICkgKTtcblx0XHRcdFx0Y29uc3QgJG1pblZhbHVlICAgICAgICAgPSAkaXRlbS5maW5kKCAnLm1pbi12YWx1ZScgKTtcblx0XHRcdFx0Y29uc3QgJG1heFZhbHVlICAgICAgICAgPSAkaXRlbS5maW5kKCAnLm1heC12YWx1ZScgKTtcblxuXHRcdFx0XHRpZiAoICd1bmRlZmluZWQnID09PSB0eXBlb2Ygbm9VaVNsaWRlciApIHtcblx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRjb25zdCBzbGlkZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCggc2xpZGVySWQgKTtcblxuXHRcdFx0XHRub1VpU2xpZGVyLmNyZWF0ZSggc2xpZGVyLCB7XG5cdFx0XHRcdFx0c3RhcnQ6IFsgbWluVmFsdWUsIG1heFZhbHVlIF0sXG5cdFx0XHRcdFx0c3RlcCxcblx0XHRcdFx0XHRjb25uZWN0OiB0cnVlLFxuXHRcdFx0XHRcdHJhbmdlOiB7XG5cdFx0XHRcdFx0XHQnbWluJzogcmFuZ2VNaW5WYWx1ZSxcblx0XHRcdFx0XHRcdCdtYXgnOiByYW5nZU1heFZhbHVlLFxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSApO1xuXG5cdFx0XHRcdHNsaWRlci5ub1VpU2xpZGVyLm9uKCAndXBkYXRlJywgZnVuY3Rpb24oIHZhbHVlcyApIHtcblx0XHRcdFx0XHRjb25zdCBtaW5WYWx1ZSA9IG51bWJlcl9mb3JtYXQoIHZhbHVlc1sgMCBdLCBkZWNpbWFsUGxhY2VzLCBkZWNpbWFsU2VwYXJhdG9yLCB0aG91c2FuZFNlcGFyYXRvciApO1xuXHRcdFx0XHRcdGNvbnN0IG1heFZhbHVlID0gbnVtYmVyX2Zvcm1hdCggdmFsdWVzWyAxIF0sIGRlY2ltYWxQbGFjZXMsIGRlY2ltYWxTZXBhcmF0b3IsIHRob3VzYW5kU2VwYXJhdG9yICk7XG5cblx0XHRcdFx0XHRpZiAoICdwbGFpbl90ZXh0JyA9PT0gZGlzcGxheVZhbHVlc0FzICkge1xuXHRcdFx0XHRcdFx0JG1pblZhbHVlLmh0bWwoIG1pblZhbHVlICk7XG5cdFx0XHRcdFx0XHQkbWF4VmFsdWUuaHRtbCggbWF4VmFsdWUgKTtcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0JG1pblZhbHVlLnZhbCggbWluVmFsdWUgKTtcblx0XHRcdFx0XHRcdCRtYXhWYWx1ZS52YWwoIG1heFZhbHVlICk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9ICk7XG5cblx0XHRcdFx0ZnVuY3Rpb24gZmlsdGVyUHJvZHVjdHNBY2NvcmRpbmdUb1NsaWRlciggdmFsdWVzICkge1xuXHRcdFx0XHRcdGNvbnN0IG1pblZhbHVlID0gcGFyc2VGbG9hdCggdmFsdWVzWyAwIF0gKTtcblx0XHRcdFx0XHRjb25zdCBtYXhWYWx1ZSA9IHBhcnNlRmxvYXQoIHZhbHVlc1sgMSBdICk7XG5cblx0XHRcdFx0XHRpZiAoIG1pblZhbHVlID09PSByYW5nZU1pblZhbHVlICYmIG1heFZhbHVlID09PSByYW5nZU1heFZhbHVlICkge1xuXHRcdFx0XHRcdFx0Y29uc3QgcXVlcnkgPSB3Y2FwZlJlbW92ZVF1ZXJ5U3RyaW5nUGFyYW1ldGVyKCBmaWx0ZXJLZXkgKTtcblx0XHRcdFx0XHRcdGhpc3RvcnkucHVzaFN0YXRlKCB7fSwgJycsIHF1ZXJ5ICk7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdGNvbnN0IGZpbHRlclZhbFN0cmluZyA9IG1pblZhbHVlICsgJysnICsgbWF4VmFsdWU7XG5cdFx0XHRcdFx0XHR3Y2FwZlVwZGF0ZVF1ZXJ5U3RyaW5nUGFyYW1ldGVyKCBmaWx0ZXJLZXksIGZpbHRlclZhbFN0cmluZyApO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdC8vIGZpbHRlciBwcm9kdWN0c1xuXHRcdFx0XHRcdHdjYXBmRmlsdGVyUHJvZHVjdHMoKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdHNsaWRlci5ub1VpU2xpZGVyLm9uKCAnZW5kJywgZnVuY3Rpb24oIHZhbHVlcyApIHtcblx0XHRcdFx0XHQvLyBDbGVhciBhbnkgcHJldmlvdXNseSBzZXQgdGltZXIgYmVmb3JlIHNldHRpbmcgYSBmcmVzaCBvbmVcblx0XHRcdFx0XHRjbGVhclRpbWVvdXQoICRpdGVtLmRhdGEoICd0aW1lcicgKSApO1xuXG5cdFx0XHRcdFx0JGl0ZW0uZGF0YSggJ3RpbWVyJywgc2V0VGltZW91dCggZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0XHQkaXRlbS5yZW1vdmVEYXRhKCAndGltZXInICk7XG5cblx0XHRcdFx0XHRcdGZpbHRlclByb2R1Y3RzQWNjb3JkaW5nVG9TbGlkZXIoIHZhbHVlcyApO1xuXHRcdFx0XHRcdH0sIGRlbGF5ICkgKTtcblx0XHRcdFx0fSApO1xuXG5cdFx0XHRcdCRtaW5WYWx1ZS5vbiggJ2lucHV0JywgZnVuY3Rpb24oIGV2ZW50ICkge1xuXHRcdFx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cblx0XHRcdFx0XHRjb25zdCAkaW5wdXQgPSAkKCB0aGlzICk7XG5cblx0XHRcdFx0XHQvLyBDbGVhciBhbnkgcHJldmlvdXNseSBzZXQgdGltZXIgYmVmb3JlIHNldHRpbmcgYSBmcmVzaCBvbmVcblx0XHRcdFx0XHRjbGVhclRpbWVvdXQoICRpbnB1dC5kYXRhKCAndGltZXInICkgKTtcblxuXHRcdFx0XHRcdCRpbnB1dC5kYXRhKCAndGltZXInLCBzZXRUaW1lb3V0KCBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHRcdCRpbnB1dC5yZW1vdmVEYXRhKCAndGltZXInICk7XG5cblx0XHRcdFx0XHRcdGNvbnN0IG1pblZhbHVlID0gJGlucHV0LnZhbCgpO1xuXG5cdFx0XHRcdFx0XHRzbGlkZXIubm9VaVNsaWRlci5zZXQoIFsgbWluVmFsdWUsIG51bGwgXSApO1xuXG5cdFx0XHRcdFx0XHRmaWx0ZXJQcm9kdWN0c0FjY29yZGluZ1RvU2xpZGVyKCBzbGlkZXIubm9VaVNsaWRlci5nZXQoKSApO1xuXHRcdFx0XHRcdH0sIGRlbGF5ICkgKTtcblx0XHRcdFx0fSApO1xuXG5cdFx0XHRcdCRtYXhWYWx1ZS5vbiggJ2lucHV0JywgZnVuY3Rpb24oIGV2ZW50ICkge1xuXHRcdFx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cblx0XHRcdFx0XHRjb25zdCAkaW5wdXQgPSAkKCB0aGlzICk7XG5cblx0XHRcdFx0XHQvLyBDbGVhciBhbnkgcHJldmlvdXNseSBzZXQgdGltZXIgYmVmb3JlIHNldHRpbmcgYSBmcmVzaCBvbmVcblx0XHRcdFx0XHRjbGVhclRpbWVvdXQoICRpbnB1dC5kYXRhKCAndGltZXInICkgKTtcblxuXHRcdFx0XHRcdCRpbnB1dC5kYXRhKCAndGltZXInLCBzZXRUaW1lb3V0KCBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHRcdCRpbnB1dC5yZW1vdmVEYXRhKCAndGltZXInICk7XG5cblx0XHRcdFx0XHRcdGNvbnN0IG1heFZhbHVlID0gJGlucHV0LnZhbCgpO1xuXG5cdFx0XHRcdFx0XHRzbGlkZXIubm9VaVNsaWRlci5zZXQoIFsgbnVsbCwgbWF4VmFsdWUgXSApO1xuXG5cdFx0XHRcdFx0XHRmaWx0ZXJQcm9kdWN0c0FjY29yZGluZ1RvU2xpZGVyKCBzbGlkZXIubm9VaVNsaWRlci5nZXQoKSApO1xuXHRcdFx0XHRcdH0sIGRlbGF5ICkgKTtcblx0XHRcdFx0fSApO1xuXHRcdFx0fSApO1xuXHRcdH1cblxuXHRcdGluaXROb1VJU2xpZGVyKCk7XG5cblx0XHQvLyBzaG93IGEgbG9hZGluZyBpbmRpY2F0b3Jcblx0XHRmdW5jdGlvbiB3Y2FwZkJlZm9yZVVwZGF0ZSgpIHtcblx0XHR9XG5cblx0XHQvLyBzY3JvbGwgdG8gdG9wXG5cdFx0ZnVuY3Rpb24gd2NhcGZBZnRlclVwZGF0ZSgpIHtcblx0XHRcdGluaXRDaG9zZW4oKTtcblx0XHRcdGluaXRIaWVyYXJjaHlBY2NvcmRpb24oKTtcblx0XHRcdGluaXROb1VJU2xpZGVyKCk7XG5cblx0XHRcdCQoICdib2R5JyApLnRyaWdnZXIoICd3Y2FwZl9hZnRlcl91cGRhdGUnICk7XG5cdFx0fVxuXG5cdFx0Ly8gZmlsdGVyIHRoZSBwcm9kdWN0c1xuXHRcdGZ1bmN0aW9uIHdjYXBmRmlsdGVyUHJvZHVjdHMoKSB7XG5cdFx0XHR3Y2FwZkJlZm9yZVVwZGF0ZSgpO1xuXG5cdFx0XHQkLmdldChcblx0XHRcdFx0d2luZG93LmxvY2F0aW9uLmhyZWYsXG5cdFx0XHRcdGZ1bmN0aW9uKCBkYXRhICkge1xuXHRcdFx0XHRcdGNvbnN0ICRkYXRhID0gJCggZGF0YSApO1xuXG5cdFx0XHRcdFx0Y29uc3QgJHNob3BMb29wQ29udGFpbmVyID0gJGRhdGEuZmluZCggd2NhcGZfcGFyYW1zLnNob3BfbG9vcF9jb250YWluZXIgKTtcblx0XHRcdFx0XHRjb25zdCAkbm90Rm91bmRDb250YWluZXIgPSAkZGF0YS5maW5kKCB3Y2FwZl9wYXJhbXMubm90X2ZvdW5kX2NvbnRhaW5lciApO1xuXG5cdFx0XHRcdFx0Ly8gcmVwbGFjZSBmaWVsZHMnIGRhdGEgd2l0aCBuZXcgZGF0YVxuXHRcdFx0XHRcdCQuZWFjaChcblx0XHRcdFx0XHRcdGZpZWxkcyxcblx0XHRcdFx0XHRcdGZ1bmN0aW9uKCBpZCApIHtcblx0XHRcdFx0XHRcdFx0Y29uc3QgZmllbGRJRCAgICA9ICcjJyArIGlkO1xuXHRcdFx0XHRcdFx0XHRjb25zdCAkZmllbGQgICAgID0gJCggZmllbGRJRCApO1xuXHRcdFx0XHRcdFx0XHRjb25zdCBfZmllbGQgICAgID0gJGRhdGEuZmluZCggZmllbGRJRCApO1xuXHRcdFx0XHRcdFx0XHRjb25zdCBmaWVsZENsYXNzID0gJCggX2ZpZWxkICkuYXR0ciggJ2NsYXNzJyApO1xuXG5cdFx0XHRcdFx0XHRcdC8vIHVwZGF0ZSBjbGFzc1xuXHRcdFx0XHRcdFx0XHQkZmllbGQuYXR0ciggJ2NsYXNzJywgZmllbGRDbGFzcyApO1xuXG5cdFx0XHRcdFx0XHRcdC8vIHVwZGF0ZSBmaWVsZFxuXHRcdFx0XHRcdFx0XHQkZmllbGQuaHRtbCggX2ZpZWxkLmh0bWwoKSApO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdCk7XG5cblx0XHRcdFx0XHQvLyByZXBsYWNlIG9sZCBzaG9wIGxvb3Agd2l0aCBuZXcgb25lXG5cdFx0XHRcdFx0aWYgKCB3Y2FwZl9wYXJhbXMuc2hvcF9sb29wX2NvbnRhaW5lciA9PT0gd2NhcGZfcGFyYW1zLm5vdF9mb3VuZF9jb250YWluZXIgKSB7XG5cdFx0XHRcdFx0XHQkKCB3Y2FwZl9wYXJhbXMuc2hvcF9sb29wX2NvbnRhaW5lciApLmh0bWwoICRzaG9wTG9vcENvbnRhaW5lci5odG1sKCkgKTtcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0aWYgKCAkKCB3Y2FwZl9wYXJhbXMubm90X2ZvdW5kX2NvbnRhaW5lciApLmxlbmd0aCApIHtcblx0XHRcdFx0XHRcdFx0aWYgKCAkc2hvcExvb3BDb250YWluZXIubGVuZ3RoICkge1xuXHRcdFx0XHRcdFx0XHRcdCQoIHdjYXBmX3BhcmFtcy5ub3RfZm91bmRfY29udGFpbmVyICkuaHRtbCggJHNob3BMb29wQ29udGFpbmVyLmh0bWwoKSApO1xuXHRcdFx0XHRcdFx0XHR9IGVsc2UgaWYgKCAkbm90Rm91bmRDb250YWluZXIubGVuZ3RoICkge1xuXHRcdFx0XHRcdFx0XHRcdCQoIHdjYXBmX3BhcmFtcy5ub3RfZm91bmRfY29udGFpbmVyICkuaHRtbCggJG5vdEZvdW5kQ29udGFpbmVyLmh0bWwoKSApO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9IGVsc2UgaWYgKCAkKCB3Y2FwZl9wYXJhbXMuc2hvcF9sb29wX2NvbnRhaW5lciApLmxlbmd0aCApIHtcblx0XHRcdFx0XHRcdFx0aWYgKCAkc2hvcExvb3BDb250YWluZXIubGVuZ3RoICkge1xuXHRcdFx0XHRcdFx0XHRcdCQoIHdjYXBmX3BhcmFtcy5zaG9wX2xvb3BfY29udGFpbmVyICkuaHRtbCggJHNob3BMb29wQ29udGFpbmVyLmh0bWwoKSApO1xuXHRcdFx0XHRcdFx0XHR9IGVsc2UgaWYgKCAkbm90Rm91bmRDb250YWluZXIubGVuZ3RoICkge1xuXHRcdFx0XHRcdFx0XHRcdCQoIHdjYXBmX3BhcmFtcy5zaG9wX2xvb3BfY29udGFpbmVyICkuaHRtbCggJG5vdEZvdW5kQ29udGFpbmVyLmh0bWwoKSApO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0d2NhcGZBZnRlclVwZGF0ZSgpO1xuXG5cdFx0XHRcdFx0Ly8gcmVpbml0aWFsaXplIG9yZGVyaW5nXG5cdFx0XHRcdFx0Ly8gd2NhcGZJbml0T3JkZXIoKTtcblxuXHRcdFx0XHRcdC8vIHJlaW5pdGlhbGl6ZSBkcm9wZG93biBmaWx0ZXJcblx0XHRcdFx0XHQvLyB3Y2FwZkRyb3BEb3duRmlsdGVyKCk7XG5cblx0XHRcdFx0XHQvLyBydW4gc2NyaXB0cyBhZnRlciBzaG9wIGxvb3AgdW5kYXRlZFxuXHRcdFx0XHRcdGlmICggdHlwZW9mIHdjYXBmX3BhcmFtcy5jdXN0b21fc2NyaXB0cyAhPT0gJ3VuZGVmaW5lZCcgJiYgd2NhcGZfcGFyYW1zLmN1c3RvbV9zY3JpcHRzLmxlbmd0aCA+IDAgKSB7XG5cdFx0XHRcdFx0XHRldmFsKCB3Y2FwZl9wYXJhbXMuY3VzdG9tX3NjcmlwdHMgKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdCk7XG5cdFx0fVxuXG5cdFx0Ly8gVVJMIFBhcnNlclxuXHRcdGZ1bmN0aW9uIHdjYXBmR2V0VXJsVmFycyggdXJsICkge1xuXHRcdFx0bGV0IHZhcnMgPSB7fSwgaGFzaDtcblxuXHRcdFx0aWYgKCB0eXBlb2YgdXJsID09PSAndW5kZWZpbmVkJyApIHtcblx0XHRcdFx0dXJsID0gd2luZG93LmxvY2F0aW9uLmhyZWY7XG5cdFx0XHR9XG5cblx0XHRcdGNvbnN0IGhhc2hlcyAgPSB1cmwuc2xpY2UoIHVybC5pbmRleE9mKCAnPycgKSArIDEgKS5zcGxpdCggJyYnICk7XG5cdFx0XHRjb25zdCBoTGVuZ3RoID0gaGFzaGVzLmxlbmd0aDtcblxuXHRcdFx0Zm9yICggbGV0IGkgPSAwOyBpIDwgaExlbmd0aDsgaSsrICkge1xuXHRcdFx0XHRoYXNoID0gaGFzaGVzWyBpIF0uc3BsaXQoICc9JyApO1xuXG5cdFx0XHRcdHZhcnNbIGhhc2hbIDAgXSBdID0gaGFzaFsgMSBdO1xuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gdmFycztcblx0XHR9XG5cblx0XHQvLyBldmVyeXRpbWUgd2UgYXBwbHkgdGhlIGZpbHRlciB3ZSBzZXQgdGhlIGN1cnJlbnQgcGFnZSB0byAxXG5cdFx0ZnVuY3Rpb24gd2NhcGZGaXhQYWdpbmF0aW9uKCkge1xuXHRcdFx0bGV0IHVybCAgICAgICAgICAgICAgICA9IHdpbmRvdy5sb2NhdGlvbi5ocmVmO1xuXHRcdFx0Y29uc3QgcGFyYW1zICAgICAgICAgICA9IHdjYXBmR2V0VXJsVmFycyggdXJsICk7XG5cdFx0XHRjb25zdCBjdXJyZW50UGFnZUluVXJsID0gcGFyc2VJbnQoIHVybC5yZXBsYWNlKCAvLitcXC9wYWdlXFwvKFswLTldKykrLywgJyQxJyApICk7XG5cblx0XHRcdGlmICggY3VycmVudFBhZ2VJblVybCApIHtcblx0XHRcdFx0aWYgKCBjdXJyZW50UGFnZUluVXJsID4gMSApIHtcblx0XHRcdFx0XHR1cmwgPSB1cmwucmVwbGFjZSggL3BhZ2VcXC8oWzAtOV0rKS8sICdwYWdlLzEnICk7XG5cdFx0XHRcdH1cblx0XHRcdH0gZWxzZSBpZiAoIHR5cGVvZiBwYXJhbXNbICdwYWdlZCcgXSAhPT0gJ3VuZGVmaW5lZCcgKSB7XG5cdFx0XHRcdGNvbnN0IGN1cnJlbnRQYWdlSW5QYXJhbXMgPSBwYXJzZUludCggcGFyYW1zWyAncGFnZWQnIF0gKTtcblxuXHRcdFx0XHRpZiAoIGN1cnJlbnRQYWdlSW5QYXJhbXMgPiAxICkge1xuXHRcdFx0XHRcdHVybCA9IHVybC5yZXBsYWNlKCAncGFnZWQ9JyArIGN1cnJlbnRQYWdlSW5QYXJhbXMsICdwYWdlZD0xJyApO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiB1cmw7XG5cdFx0fVxuXG5cdFx0Ly8gdXBkYXRlIHF1ZXJ5IHN0cmluZyBmb3IgY2F0ZWdvcmllcywgbWV0YSBldGMuLlxuXHRcdGZ1bmN0aW9uIHdjYXBmVXBkYXRlUXVlcnlTdHJpbmdQYXJhbWV0ZXIoIGtleSwgdmFsdWUsIHB1c2hIaXN0b3J5LCB1cmwgKSB7XG5cdFx0XHRpZiAoIHR5cGVvZiBwdXNoSGlzdG9yeSA9PT0gJ3VuZGVmaW5lZCcgKSB7XG5cdFx0XHRcdHB1c2hIaXN0b3J5ID0gdHJ1ZTtcblx0XHRcdH1cblxuXHRcdFx0aWYgKCB0eXBlb2YgdXJsID09PSAndW5kZWZpbmVkJyApIHtcblx0XHRcdFx0dXJsID0gd2NhcGZGaXhQYWdpbmF0aW9uKCk7XG5cdFx0XHR9XG5cblx0XHRcdGNvbnN0IHJlICAgICAgICA9IG5ldyBSZWdFeHAoICcoWz8mXSknICsga2V5ICsgJz0uKj8oJnwkKScsICdpJyApO1xuXHRcdFx0Y29uc3Qgc2VwYXJhdG9yID0gdXJsLmluZGV4T2YoICc/JyApICE9PSAtMSA/ICcmJyA6ICc/Jztcblx0XHRcdGxldCB1cmxXaXRoUXVlcnk7XG5cblx0XHRcdGlmICggdXJsLm1hdGNoKCByZSApICkge1xuXHRcdFx0XHR1cmxXaXRoUXVlcnkgPSB1cmwucmVwbGFjZSggcmUsICckMScgKyBrZXkgKyAnPScgKyB2YWx1ZSArICckMicgKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHVybFdpdGhRdWVyeSA9IHVybCArIHNlcGFyYXRvciArIGtleSArICc9JyArIHZhbHVlO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAoIHB1c2hIaXN0b3J5ID09PSB0cnVlICkge1xuXHRcdFx0XHRyZXR1cm4gaGlzdG9yeS5wdXNoU3RhdGUoIHt9LCAnJywgdXJsV2l0aFF1ZXJ5ICk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRyZXR1cm4gdXJsV2l0aFF1ZXJ5O1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdC8vIHJlbW92ZSBwYXJhbWV0ZXIgZnJvbSB1cmxcblx0XHRmdW5jdGlvbiB3Y2FwZlJlbW92ZVF1ZXJ5U3RyaW5nUGFyYW1ldGVyKCBmaWx0ZXJLZXksIHVybCApIHtcblx0XHRcdGlmICggdHlwZW9mIHVybCA9PT0gJ3VuZGVmaW5lZCcgKSB7XG5cdFx0XHRcdHVybCA9IHdjYXBmRml4UGFnaW5hdGlvbigpO1xuXHRcdFx0fVxuXG5cdFx0XHRjb25zdCBvbGRQYXJhbXMgICAgICAgICA9IHdjYXBmR2V0VXJsVmFycyggdXJsICk7XG5cdFx0XHRjb25zdCBvbGRQYXJhbXNMZW5ndGggICA9IE9iamVjdC5rZXlzKCBvbGRQYXJhbXMgKS5sZW5ndGg7XG5cdFx0XHRjb25zdCBzdGFydFBvc2l0aW9uICAgICA9IHVybC5pbmRleE9mKCAnPycgKTtcblx0XHRcdGNvbnN0IGZpbHRlcktleVBvc2l0aW9uID0gdXJsLmluZGV4T2YoIGZpbHRlcktleSApO1xuXHRcdFx0bGV0IGNsZWFuVXJsLCBjbGVhblF1ZXJ5O1xuXG5cdFx0XHRpZiAoIG9sZFBhcmFtc0xlbmd0aCA+IDEgKSB7XG5cdFx0XHRcdGlmICggKCBmaWx0ZXJLZXlQb3NpdGlvbiAtIHN0YXJ0UG9zaXRpb24gKSA+IDEgKSB7XG5cdFx0XHRcdFx0Y2xlYW5VcmwgPSB1cmwucmVwbGFjZSggJyYnICsgZmlsdGVyS2V5ICsgJz0nICsgb2xkUGFyYW1zWyBmaWx0ZXJLZXkgXSwgJycgKTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRjbGVhblVybCA9IHVybC5yZXBsYWNlKCBmaWx0ZXJLZXkgKyAnPScgKyBvbGRQYXJhbXNbIGZpbHRlcktleSBdICsgJyYnLCAnJyApO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0Y29uc3QgbmV3UGFyYW1zID0gY2xlYW5Vcmwuc3BsaXQoICc/JyApO1xuXHRcdFx0XHRjbGVhblF1ZXJ5ICAgICAgPSAnPycgKyBuZXdQYXJhbXNbIDEgXTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGNsZWFuUXVlcnkgPSB1cmwucmVwbGFjZSggJz8nICsgZmlsdGVyS2V5ICsgJz0nICsgb2xkUGFyYW1zWyBmaWx0ZXJLZXkgXSwgJycgKTtcblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuIGNsZWFuUXVlcnk7XG5cdFx0fVxuXG5cdFx0Ly8gdGFrZSB0aGUga2V5IGFuZCB2YWx1ZSBhbmQgbWFrZSBxdWVyeVxuXHRcdGZ1bmN0aW9uIHdjYXBmTWFrZVBhcmFtZXRlcnMoIGZpbHRlcktleSwgZmlsdGVyVmFsdWUsIHVybCApIHtcblx0XHRcdGxldCBwYXJhbXMsIG5leHRWYWx1ZXMsIGVtcHR5VmFsdWUgPSBmYWxzZTtcblxuXHRcdFx0aWYgKCB0eXBlb2YgdXJsICE9PSAndW5kZWZpbmVkJyApIHtcblx0XHRcdFx0cGFyYW1zID0gd2NhcGZHZXRVcmxWYXJzKCB1cmwgKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHBhcmFtcyA9IHdjYXBmR2V0VXJsVmFycygpO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAoIHR5cGVvZiBwYXJhbXNbIGZpbHRlcktleSBdICE9ICd1bmRlZmluZWQnICkge1xuXHRcdFx0XHRjb25zdCBwcmV2VmFsdWVzICAgICAgPSBwYXJhbXNbIGZpbHRlcktleSBdO1xuXHRcdFx0XHRjb25zdCBwcmV2VmFsdWVzQXJyYXkgPSBwcmV2VmFsdWVzLnNwbGl0KCAnLCcgKTtcblxuXHRcdFx0XHRpZiAoIHByZXZWYWx1ZXMubGVuZ3RoID4gMCApIHtcblx0XHRcdFx0XHRjb25zdCBmb3VuZCA9ICQuaW5BcnJheSggZmlsdGVyVmFsdWUsIHByZXZWYWx1ZXNBcnJheSApO1xuXG5cdFx0XHRcdFx0aWYgKCBmb3VuZCA+PSAwICkge1xuXHRcdFx0XHRcdFx0Ly8gRWxlbWVudCB3YXMgZm91bmQsIHJlbW92ZSBpdC5cblx0XHRcdFx0XHRcdHByZXZWYWx1ZXNBcnJheS5zcGxpY2UoIGZvdW5kLCAxICk7XG5cblx0XHRcdFx0XHRcdGlmICggcHJldlZhbHVlc0FycmF5Lmxlbmd0aCA9PT0gMCApIHtcblx0XHRcdFx0XHRcdFx0ZW1wdHlWYWx1ZSA9IHRydWU7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdC8vIEVsZW1lbnQgd2FzIG5vdCBmb3VuZCwgYWRkIGl0LlxuXHRcdFx0XHRcdFx0cHJldlZhbHVlc0FycmF5LnB1c2goIGZpbHRlclZhbHVlICk7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0aWYgKCBwcmV2VmFsdWVzQXJyYXkubGVuZ3RoID4gMSApIHtcblx0XHRcdFx0XHRcdG5leHRWYWx1ZXMgPSBwcmV2VmFsdWVzQXJyYXkuam9pbiggJywnICk7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdG5leHRWYWx1ZXMgPSBwcmV2VmFsdWVzQXJyYXk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdG5leHRWYWx1ZXMgPSBmaWx0ZXJWYWx1ZTtcblx0XHRcdFx0fVxuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0bmV4dFZhbHVlcyA9IGZpbHRlclZhbHVlO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyB1cGRhdGUgdXJsIGFuZCBxdWVyeSBzdHJpbmdcblx0XHRcdGlmICggISBlbXB0eVZhbHVlICkge1xuXHRcdFx0XHR3Y2FwZlVwZGF0ZVF1ZXJ5U3RyaW5nUGFyYW1ldGVyKCBmaWx0ZXJLZXksIG5leHRWYWx1ZXMgKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGNvbnN0IHF1ZXJ5ID0gd2NhcGZSZW1vdmVRdWVyeVN0cmluZ1BhcmFtZXRlciggZmlsdGVyS2V5ICk7XG5cdFx0XHRcdGhpc3RvcnkucHVzaFN0YXRlKCB7fSwgJycsIHF1ZXJ5ICk7XG5cdFx0XHR9XG5cblx0XHRcdC8vIGZpbHRlciBwcm9kdWN0c1xuXHRcdFx0d2NhcGZGaWx0ZXJQcm9kdWN0cygpO1xuXHRcdH1cblxuXHRcdGZ1bmN0aW9uIHdjYXBmU2luZ2xlRmlsdGVyKCBmaWx0ZXJLZXksIGZpbHRlclZhbHVlICkge1xuXHRcdFx0Y29uc3QgcGFyYW1zID0gd2NhcGZHZXRVcmxWYXJzKCk7XG5cdFx0XHRsZXQgcXVlcnk7XG5cblx0XHRcdGlmICggdHlwZW9mIHBhcmFtc1sgZmlsdGVyS2V5IF0gIT09ICd1bmRlZmluZWQnICYmIHBhcmFtc1sgZmlsdGVyS2V5IF0gPT09IGZpbHRlclZhbHVlICkge1xuXHRcdFx0XHRxdWVyeSA9IHdjYXBmUmVtb3ZlUXVlcnlTdHJpbmdQYXJhbWV0ZXIoIGZpbHRlcktleSApO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0cXVlcnkgPSB3Y2FwZlVwZGF0ZVF1ZXJ5U3RyaW5nUGFyYW1ldGVyKCBmaWx0ZXJLZXksIGZpbHRlclZhbHVlLCBmYWxzZSApO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyB1cGRhdGUgdXJsXG5cdFx0XHRoaXN0b3J5LnB1c2hTdGF0ZSgge30sICcnLCBxdWVyeSApO1xuXG5cdFx0XHQvLyBmaWx0ZXIgcHJvZHVjdHNcblx0XHRcdHdjYXBmRmlsdGVyUHJvZHVjdHMoKTtcblx0XHR9XG5cblx0XHQvLyBUaGUgbWFpbiBmdW5jdGlvbiB0byBoYW5kbGUgdGhlIGZpbHRlciByZXF1ZXN0XG5cdFx0ZnVuY3Rpb24gaGFuZGxlRmlsdGVyUmVxdWVzdCggJGl0ZW0sIGZpbHRlclZhbHVlICkge1xuXHRcdFx0Y29uc3QgJGZpZWxkICAgICAgICAgPSAkaXRlbS5jbG9zZXN0KCAnLndjYXBmLWZpZWxkLWZpbHRlci1mb3JtJyApO1xuXHRcdFx0Y29uc3QgZmllbGRJRCAgICAgICAgPSAkZmllbGQuYXR0ciggJ2lkJyApO1xuXHRcdFx0Y29uc3QgZmllbGREYXRhICAgICAgPSBmaWVsZHNbIGZpZWxkSUQgXTtcblx0XHRcdGNvbnN0IGZpbHRlcktleSAgICAgID0gZmllbGREYXRhLmZpbHRlcktleTtcblx0XHRcdGNvbnN0IG11bHRpcGxlRmlsdGVyID0gZmllbGREYXRhLm11bHRpcGxlRmlsdGVyO1xuXG5cdFx0XHRpZiAoICEgZmlsdGVyS2V5ICkge1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdGlmICggISBmaWx0ZXJWYWx1ZS5sZW5ndGggKSB7XG5cdFx0XHRcdGNvbnN0IHF1ZXJ5ID0gd2NhcGZSZW1vdmVRdWVyeVN0cmluZ1BhcmFtZXRlciggZmlsdGVyS2V5ICk7XG5cdFx0XHRcdGhpc3RvcnkucHVzaFN0YXRlKCB7fSwgJycsIHF1ZXJ5ICk7XG5cblx0XHRcdFx0Ly8gZmlsdGVyIHByb2R1Y3RzXG5cdFx0XHRcdHdjYXBmRmlsdGVyUHJvZHVjdHMoKTtcblxuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdGlmICggbXVsdGlwbGVGaWx0ZXIgKSB7XG5cdFx0XHRcdHdjYXBmTWFrZVBhcmFtZXRlcnMoIGZpbHRlcktleSwgZmlsdGVyVmFsdWUgKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHdjYXBmU2luZ2xlRmlsdGVyKCBmaWx0ZXJLZXksIGZpbHRlclZhbHVlICk7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0Ly8gaGFuZGxlIHRoZSBmaWx0ZXIgcmVxdWVzdCBmb3IgbGlzdCBmaWVsZHNcblx0XHQkd2NhcGZUZXJtRmlsdGVyLm9uKFxuXHRcdFx0J2NoYW5nZScsXG5cdFx0XHQnLndjYXBmLWxheWVyZWQtbmF2IFt0eXBlPVwiY2hlY2tib3hcIl0sIC53Y2FwZi1sYXllcmVkLW5hdiBbdHlwZT1cInJhZGlvXCJdJyxcblx0XHRcdGZ1bmN0aW9uKCBldmVudCApIHtcblx0XHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcblxuXHRcdFx0XHRjb25zdCAkaXRlbSAgICAgICA9ICQoIHRoaXMgKTtcblx0XHRcdFx0Y29uc3QgZmlsdGVyVmFsdWUgPSAkaXRlbS52YWwoKTtcblxuXHRcdFx0XHRoYW5kbGVGaWx0ZXJSZXF1ZXN0KCAkaXRlbSwgZmlsdGVyVmFsdWUgKTtcblx0XHRcdH1cblx0XHQpO1xuXG5cdFx0Ly8gVE9ETzogVXNlIGEgY29tYmluYXRpb24gb2YgbGFiZWwsIGNoZWNrYm94IGFuZCByYWRpb1xuXHRcdC8vIGhhbmRsZSB0aGUgZmlsdGVyIHJlcXVlc3QgZm9yIGxhYmVsZWQgaXRlbVxuXHRcdCR3Y2FwZlRlcm1GaWx0ZXIub24oXG5cdFx0XHQnY2xpY2snLFxuXHRcdFx0Jy53Y2FwZi1sYWJlbGVkLW5hdiAuaXRlbScsXG5cdFx0XHRmdW5jdGlvbiggZXZlbnQgKSB7XG5cdFx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cblx0XHRcdFx0Y29uc3QgJGl0ZW0gICAgICAgPSAkKCB0aGlzICk7XG5cdFx0XHRcdGNvbnN0IGZpbHRlclZhbHVlID0gJGl0ZW0uYXR0ciggJ2RhdGEtdmFsdWUnICk7XG5cblx0XHRcdFx0aGFuZGxlRmlsdGVyUmVxdWVzdCggJGl0ZW0sIGZpbHRlclZhbHVlICk7XG5cdFx0XHR9XG5cdFx0KTtcblxuXHRcdC8vIGhhbmRsZSB0aGUgZmlsdGVyIHJlcXVlc3QgZm9yIGRpc3BsYXkgdHlwZSBzZWxlY3QgZmllbGRzXG5cdFx0JHdjYXBmVGVybUZpbHRlci5vbihcblx0XHRcdCdjaGFuZ2UnLFxuXHRcdFx0J3NlbGVjdCcsXG5cdFx0XHRmdW5jdGlvbiggZXZlbnQgKSB7XG5cdFx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cblx0XHRcdFx0Y29uc3QgJGl0ZW0gICAgICAgPSAkKCB0aGlzICk7XG5cdFx0XHRcdGNvbnN0IGZpbHRlclZhbHVlID0gJGl0ZW0udmFsKCk7XG5cblx0XHRcdFx0Y29uc3QgJGZpZWxkICAgID0gJGl0ZW0uY2xvc2VzdCggJy53Y2FwZi1maWVsZC1maWx0ZXItZm9ybScgKTtcblx0XHRcdFx0Y29uc3QgZmllbGRJRCAgID0gJGZpZWxkLmF0dHIoICdpZCcgKTtcblx0XHRcdFx0Y29uc3QgZmllbGREYXRhID0gZmllbGRzWyBmaWVsZElEIF07XG5cdFx0XHRcdGNvbnN0IGZpbHRlcktleSA9IGZpZWxkRGF0YS5maWx0ZXJLZXk7XG5cblx0XHRcdFx0aWYgKCAhIGZpbHRlclZhbHVlLmxlbmd0aCApIHtcblx0XHRcdFx0XHRjb25zdCBxdWVyeSA9IHdjYXBmUmVtb3ZlUXVlcnlTdHJpbmdQYXJhbWV0ZXIoIGZpbHRlcktleSApO1xuXHRcdFx0XHRcdGhpc3RvcnkucHVzaFN0YXRlKCB7fSwgJycsIHF1ZXJ5ICk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0Y29uc3QgZmlsdGVyVmFsU3RyaW5nID0gZmlsdGVyVmFsdWUudG9TdHJpbmcoKTtcblx0XHRcdFx0XHR3Y2FwZlVwZGF0ZVF1ZXJ5U3RyaW5nUGFyYW1ldGVyKCBmaWx0ZXJLZXksIGZpbHRlclZhbFN0cmluZyApO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0Ly8gZmlsdGVyIHByb2R1Y3RzXG5cdFx0XHRcdHdjYXBmRmlsdGVyUHJvZHVjdHMoKTtcblx0XHRcdH1cblx0XHQpO1xuXG5cdFx0Ly8gaGFuZGxlIHRoZSBmaWx0ZXIgcmVxdWVzdCBmb3IgcmFuZ2UgbnVtYmVyXG5cdFx0JHdjYXBmVGVybUZpbHRlci5vbihcblx0XHRcdCdpbnB1dCcsXG5cdFx0XHQnLndjYXBmLXJhbmdlLW51bWJlciAubWluLXZhbHVlLCAud2NhcGYtcmFuZ2UtbnVtYmVyIC5tYXgtdmFsdWUnLFxuXHRcdFx0ZnVuY3Rpb24oIGV2ZW50ICkge1xuXHRcdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXG5cdFx0XHRcdGNvbnN0ICRpdGVtID0gJCggdGhpcyApO1xuXG5cdFx0XHRcdC8vIENsZWFyIGFueSBwcmV2aW91c2x5IHNldCB0aW1lciBiZWZvcmUgc2V0dGluZyBhIGZyZXNoIG9uZVxuXHRcdFx0XHRjbGVhclRpbWVvdXQoICRpdGVtLmRhdGEoICd0aW1lcicgKSApO1xuXG5cdFx0XHRcdCRpdGVtLmRhdGEoICd0aW1lcicsIHNldFRpbWVvdXQoIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdCRpdGVtLnJlbW92ZURhdGEoICd0aW1lcicgKTtcblxuXHRcdFx0XHRcdGNvbnN0ICRyYW5nZU51bWJlciAgPSAkaXRlbS5jbG9zZXN0KCAnLndjYXBmLXJhbmdlLW51bWJlcicgKTtcblx0XHRcdFx0XHRjb25zdCBmaWx0ZXJLZXkgICAgID0gJHJhbmdlTnVtYmVyLmF0dHIoICdkYXRhLWZpbHRlci1rZXknICk7XG5cdFx0XHRcdFx0Y29uc3QgcmFuZ2VNaW5WYWx1ZSA9ICRyYW5nZU51bWJlci5hdHRyKCAnZGF0YS1yYW5nZS1taW4tdmFsdWUnICk7XG5cdFx0XHRcdFx0Y29uc3QgcmFuZ2VNYXhWYWx1ZSA9ICRyYW5nZU51bWJlci5hdHRyKCAnZGF0YS1yYW5nZS1tYXgtdmFsdWUnICk7XG5cdFx0XHRcdFx0bGV0IG1pblZhbHVlICAgICAgICA9ICRyYW5nZU51bWJlci5maW5kKCAnLm1pbi12YWx1ZScgKS52YWwoKTtcblx0XHRcdFx0XHRsZXQgbWF4VmFsdWUgICAgICAgID0gJHJhbmdlTnVtYmVyLmZpbmQoICcubWF4LXZhbHVlJyApLnZhbCgpO1xuXG5cdFx0XHRcdFx0aWYgKCAhIG1pblZhbHVlLmxlbmd0aCApIHtcblx0XHRcdFx0XHRcdG1pblZhbHVlID0gcmFuZ2VNaW5WYWx1ZTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRpZiAoICEgbWF4VmFsdWUubGVuZ3RoICkge1xuXHRcdFx0XHRcdFx0bWF4VmFsdWUgPSByYW5nZU1heFZhbHVlO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdGlmICggcGFyc2VGbG9hdCggbWluVmFsdWUgKSA+IHBhcnNlRmxvYXQoIG1heFZhbHVlICkgKSB7XG5cdFx0XHRcdFx0XHRtYXhWYWx1ZSA9IG1pblZhbHVlO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdGlmICggbWluVmFsdWUgPT09IHJhbmdlTWluVmFsdWUgJiYgbWF4VmFsdWUgPT09IHJhbmdlTWF4VmFsdWUgKSB7XG5cdFx0XHRcdFx0XHRjb25zdCBxdWVyeSA9IHdjYXBmUmVtb3ZlUXVlcnlTdHJpbmdQYXJhbWV0ZXIoIGZpbHRlcktleSApO1xuXHRcdFx0XHRcdFx0aGlzdG9yeS5wdXNoU3RhdGUoIHt9LCAnJywgcXVlcnkgKTtcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0Y29uc3QgZmlsdGVyVmFsU3RyaW5nID0gbWluVmFsdWUgKyAnKycgKyBtYXhWYWx1ZTtcblx0XHRcdFx0XHRcdHdjYXBmVXBkYXRlUXVlcnlTdHJpbmdQYXJhbWV0ZXIoIGZpbHRlcktleSwgZmlsdGVyVmFsU3RyaW5nICk7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0Ly8gZmlsdGVyIHByb2R1Y3RzXG5cdFx0XHRcdFx0d2NhcGZGaWx0ZXJQcm9kdWN0cygpO1xuXHRcdFx0XHR9LCBkZWxheSApICk7XG5cdFx0XHR9XG5cdFx0KTtcblxuXHRcdC8vIGhpc3RvcnkgYmFjayBhbmQgZm9yd2FyZCByZXF1ZXN0IGhhbmRsaW5nXG5cdFx0JCggd2luZG93ICkuYmluZCggJ3BvcHN0YXRlJywgZnVuY3Rpb24oKSB7XG5cdFx0XHQvLyBmaWx0ZXIgcHJvZHVjdHNcblx0XHRcdHdjYXBmRmlsdGVyUHJvZHVjdHMoKTtcblx0XHR9ICk7XG5cblx0fVxuKTtcbiJdfQ==
