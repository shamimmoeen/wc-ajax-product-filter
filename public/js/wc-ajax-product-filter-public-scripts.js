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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNob3Nlbi5qcyIsImZpbHRlci1mb3JtLmpzIl0sIm5hbWVzIjpbImpRdWVyeSIsImRvY3VtZW50IiwicmVhZHkiLCIkIiwid2NhcGZfcGFyYW1zIiwiZGVsYXkiLCJmaWVsZHMiLCIkd2NhcGZUZXJtRmlsdGVyIiwiZWFjaCIsIiRmaWVsZCIsImlkIiwiYXR0ciIsIiR3cmFwcGVyIiwiY2hpbGRyZW4iLCJmaWx0ZXJLZXkiLCJtdWx0aXBsZUZpbHRlciIsInBhcnNlSW50IiwiaW5pdENob3NlbiIsImNob3NlbiIsImZpbmQiLCIkdGhpcyIsIm9wdGlvbnMiLCJub1Jlc3VsdHNNZXNzYWdlIiwiaW5pdEhpZXJhcmNoeUFjY29yZGlvbiIsIm9uIiwidG9nZ2xlQ2xhc3MiLCJudW1iZXJfZm9ybWF0IiwibnVtYmVyIiwiZGVjaW1hbHMiLCJkZWNfcG9pbnQiLCJ0aG91c2FuZHNfc2VwIiwicmVwbGFjZSIsIm4iLCJpc0Zpbml0ZSIsInByZWMiLCJNYXRoIiwiYWJzIiwic2VwIiwiZGVjIiwicyIsInRvRml4ZWRGaXgiLCJrIiwicG93Iiwicm91bmQiLCJzcGxpdCIsImxlbmd0aCIsIkFycmF5Iiwiam9pbiIsImluaXROb1VJU2xpZGVyIiwiJGl0ZW0iLCIkc2xpZGVyIiwic2xpZGVySWQiLCJkaXNwbGF5VmFsdWVzQXMiLCJyYW5nZU1pblZhbHVlIiwicGFyc2VGbG9hdCIsInJhbmdlTWF4VmFsdWUiLCJzdGVwIiwiZGVjaW1hbFBsYWNlcyIsInRob3VzYW5kU2VwYXJhdG9yIiwiZGVjaW1hbFNlcGFyYXRvciIsIm1pblZhbHVlIiwibWF4VmFsdWUiLCIkbWluVmFsdWUiLCIkbWF4VmFsdWUiLCJub1VpU2xpZGVyIiwic2xpZGVyIiwiZ2V0RWxlbWVudEJ5SWQiLCJjcmVhdGUiLCJzdGFydCIsImNvbm5lY3QiLCJyYW5nZSIsInZhbHVlcyIsImh0bWwiLCJ2YWwiLCJmaWx0ZXJQcm9kdWN0c0FjY29yZGluZ1RvU2xpZGVyIiwicXVlcnkiLCJ3Y2FwZlJlbW92ZVF1ZXJ5U3RyaW5nUGFyYW1ldGVyIiwiaGlzdG9yeSIsInB1c2hTdGF0ZSIsImZpbHRlclZhbFN0cmluZyIsIndjYXBmVXBkYXRlUXVlcnlTdHJpbmdQYXJhbWV0ZXIiLCJ3Y2FwZkZpbHRlclByb2R1Y3RzIiwiY2xlYXJUaW1lb3V0IiwiZGF0YSIsInNldFRpbWVvdXQiLCJyZW1vdmVEYXRhIiwiZXZlbnQiLCJwcmV2ZW50RGVmYXVsdCIsIiRpbnB1dCIsInNldCIsImdldCIsIndjYXBmQmVmb3JlVXBkYXRlIiwid2NhcGZBZnRlclVwZGF0ZSIsIndpbmRvdyIsImxvY2F0aW9uIiwiaHJlZiIsIiRkYXRhIiwiJHNob3BMb29wQ29udGFpbmVyIiwic2hvcF9sb29wX2NvbnRhaW5lciIsIiRub3RGb3VuZENvbnRhaW5lciIsIm5vdF9mb3VuZF9jb250YWluZXIiLCJmaWVsZElEIiwiX2ZpZWxkIiwiZmllbGRDbGFzcyIsImN1c3RvbV9zY3JpcHRzIiwiZXZhbCIsIndjYXBmR2V0VXJsVmFycyIsInVybCIsInZhcnMiLCJoYXNoIiwiaGFzaGVzIiwic2xpY2UiLCJpbmRleE9mIiwiaExlbmd0aCIsImkiLCJ3Y2FwZkZpeFBhZ2luYXRpb24iLCJwYXJhbXMiLCJjdXJyZW50UGFnZUluVXJsIiwiY3VycmVudFBhZ2VJblBhcmFtcyIsImtleSIsInZhbHVlIiwicHVzaEhpc3RvcnkiLCJyZSIsIlJlZ0V4cCIsInNlcGFyYXRvciIsInVybFdpdGhRdWVyeSIsIm1hdGNoIiwib2xkUGFyYW1zIiwib2xkUGFyYW1zTGVuZ3RoIiwiT2JqZWN0Iiwia2V5cyIsInN0YXJ0UG9zaXRpb24iLCJmaWx0ZXJLZXlQb3NpdGlvbiIsImNsZWFuVXJsIiwiY2xlYW5RdWVyeSIsIm5ld1BhcmFtcyIsIndjYXBmTWFrZVBhcmFtZXRlcnMiLCJmaWx0ZXJWYWx1ZSIsIm5leHRWYWx1ZXMiLCJlbXB0eVZhbHVlIiwicHJldlZhbHVlcyIsInByZXZWYWx1ZXNBcnJheSIsImZvdW5kIiwiaW5BcnJheSIsInNwbGljZSIsInB1c2giLCJ3Y2FwZlNpbmdsZUZpbHRlciIsImhhbmRsZUZpbHRlclJlcXVlc3QiLCJjbG9zZXN0IiwiZmllbGREYXRhIiwidG9TdHJpbmciLCIkcmFuZ2VOdW1iZXIiLCJiaW5kIl0sIm1hcHBpbmdzIjoiOztBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQUEsTUFBTSxDQUFFQyxRQUFGLENBQU4sQ0FBbUJDLEtBQW5CLENBQTBCLFVBQVVDLENBQVYsRUFBYyxDQUl2QyxDQUpEOzs7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUEsSUFBTUMsWUFBWSxHQUFHQSxZQUFZLElBQUk7QUFDcEMseUJBQXVCLEVBRGE7QUFFcEMseUJBQXVCLEVBRmE7QUFHcEMsMEJBQXdCLEVBSFk7QUFJcEMsc0JBQW9CLEVBSmdCO0FBS3BDLHFCQUFtQixFQUxpQjtBQU1wQyxtQkFBaUIsRUFObUI7QUFPcEMsMEJBQXdCLEVBUFk7QUFRcEMsb0JBQWtCO0FBUmtCLENBQXJDO0FBV0FKLE1BQU0sQ0FBRUMsUUFBRixDQUFOLENBQW1CQyxLQUFuQixDQUNDLFVBQVVDLENBQVYsRUFBYztBQUViO0FBQ0EsTUFBSyxPQUFPQyxZQUFQLEtBQXdCLFdBQTdCLEVBQTJDO0FBQzFDLFdBQU8sS0FBUDtBQUNBOztBQUVELE1BQU1DLEtBQUssR0FBRyxHQUFkLENBUGEsQ0FTYjs7QUFDQSxNQUFNQyxNQUFNLEdBQUcsRUFBZjtBQUVBLE1BQU1DLGdCQUFnQixHQUFHSixDQUFDLENBQUUseUJBQUYsQ0FBMUI7QUFFQUksRUFBQUEsZ0JBQWdCLENBQUNDLElBQWpCLENBQ0MsWUFBVztBQUNWLFFBQU1DLE1BQU0sR0FBV04sQ0FBQyxDQUFFLElBQUYsQ0FBeEI7QUFDQSxRQUFNTyxFQUFFLEdBQWVELE1BQU0sQ0FBQ0UsSUFBUCxDQUFhLElBQWIsQ0FBdkI7QUFDQSxRQUFNQyxRQUFRLEdBQVNILE1BQU0sQ0FBQ0ksUUFBUCxDQUFpQixLQUFqQixDQUF2QjtBQUNBLFFBQU1DLFNBQVMs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Q04sWUFBTUksZUFBZSxHQUFHbkIsUUFBUSxHQUFHLEdBQVgsR0FBaUJDLFFBQXpDO0FBQ0FtQixRQUFBQSwrQkFBK0IsQ0FBRWxFLFNBQUYsRUFBYWlFLGVBQWIsQ0FBL0I7QUFDQSxPQTVCMEMsQ0E4QjNDOzs7QUFDQUUsTUFBQUEsbUJBQW1CO0FBQ25CLEtBaEM4QixFQWdDNUI1RSxLQWhDNEIsQ0FBL0I7QUFpQ0EsR0E1Q0YsRUFuaUJhLENBa2xCYjs7QUFDQUYsRUFBQUEsQ0FBQyxDQUFFMEYsTUFBRixDQUFELENBQVkyRCxJQUFaLENBQWtCLFVBQWxCLEVBQThCLFlBQVc7QUFDeEM7QUFDQXZFLElBQUFBLG1CQUFtQjtBQUNuQixHQUhEO0FBS0EsQ0F6bEJGIiwiZmlsZSI6IndjLWFqYXgtcHJvZHVjdC1maWx0ZXItcHVibGljLXNjcmlwdHMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIERpc3BsYXkgdHlwZSBmaWVsZHMuXG4gKlxuICogQHNpbmNlICAgICAgMy4wLjBcbiAqIEBwYWNrYWdlICAgIHdjLWFqYXgtcHJvZHVjdC1maWx0ZXJcbiAqIEBzdWJwYWNrYWdlIHdjLWFqYXgtcHJvZHVjdC1maWx0ZXIvYWRtaW4vc3JjL2pzXG4gKiBAYXV0aG9yICAgICBNYWludWwgSGFzc2FuIE1haW5cbiAqL1xuXG5qUXVlcnkoIGRvY3VtZW50ICkucmVhZHkoIGZ1bmN0aW9uKCAkICkge1xuXG5cblxufSApO1xuIiwiLyoqXG4gKiBUaGUgZnJvbnRlbmQgZmlsdGVyIGZvcm0uXG4gKlxuICogQHNpbmNlICAgICAgMy4wLjBcbiAqIEBwYWNrYWdlICAgIHdjLWFqYXgtcHJvZHVjdC1maWx0ZXJcbiAqIEBzdWJwYWNrYWdlIHdjLWFqYXgtcHJvZHVjdC1maWx0ZXIvcHVibGljL3NyYy9qc1xuICogQGF1dGhvciAgICAgTWFpbnVsIEhhc3NhbiBNYWluXG4gKi9cblxuY29uc3Qgd2NhcGZfcGFyYW1zID0gd2NhcGZfcGFyYW1zIHx8IHtcblx0J3Nob3BfbG9vcF9jb250YWluZXInOiAnJyxcblx0J25vdF9mb3VuZF9jb250YWluZXInOiAnJyxcblx0J3BhZ2luYXRpb25fY29udGFpbmVyJzogJycsXG5cdCdvdmVybGF5X2JnX2NvbG9yJzogJycsXG5cdCdzb3J0aW5nX2NvbnRyb2wnOiAnJyxcblx0J3Njcm9sbF90b190b3AnOiAnJyxcblx0J3Njcm9sbF90b190b3Bfb2Zmc2V0JzogJycsXG5cdCdjdXN0b21fc2NyaXB0cyc6ICcnXG59O1xuXG5qUXVlcnkoIGRvY3VtZW50ICkucmVhZHkoXG5cdGZ1bmN0aW9uKCAkICkge1xuXG5cdFx0Ly8gcmV0dXJuIGZhbHNlIGlmIHdjYXBmX3BhcmFtcyB2YXJpYWJsZSBpcyBub3QgZm91bmRcblx0XHRpZiAoIHR5cGVvZiB3Y2FwZl9wYXJhbXMgPT09ICd1bmRlZmluZWQnICkge1xuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH1cblxuXHRcdGNvbnN0IGRlbGF5ID0gODAwO1xuXG5cdFx0Ly8gc3RvcmUgZmllbGRzJyBpZCBhbmQgZmlsdGVyIGluZm9ybWF0aW9uXG5cdFx0Y29uc3QgZmllbGRzID0ge307XG5cblx0XHRjb25zdCAkd2NhcGZUZXJtRmlsdGVyID0gJCggJy53Y2FwZi1hamF4LXRlcm0tZmlsdGVyJyApO1xuXG5cdFx0JHdjYXBmVGVybUZpbHRlci5lYWNoKFxuXHRcdFx0ZnVuY3Rpb24oKSB7XG5cdFx0XHRcdGNvbnN0ICRmaWVsZCAgICAgICAgID0gJCggdGhpcyApO1xuXHRcdFx0XHRjb25zdCBpZCAgICAgICAgICAgICA9ICRmaWVsZC5hdHRyKCAnaWQnICk7XG5cdFx0XHRcdGNvbnN0ICR3cmFwcGVyICAgICAgID0gJGZpZWxkLmNoaWxkcmVuKCAnZGl2JyApO1xuXHRcdFx0XHRjb25zdCBmaWx0ZXJLZXkgICAgICA9ICR3cmFwcGVyLmF0dHIoICdkYXRhLWZpbHRlci1rZXknICk7XG5cdFx0XHRcdGNvbnN0IG11bHRpcGxlRmlsdGVyID0gcGFyc2VJbnQoICR3cmFwcGVyLmF0dHIoICdkYXRhLW11bHRpcGxlLWZpbHRlcicgKSApO1xuXG5cdFx0XHRcdGZpZWxkc1sgaWQgXSA9IHtcblx0XHRcdFx0XHRmaWx0ZXJLZXk6IGZpbHRlcktleSxcblx0XHRcdFx0XHRtdWx0aXBsZUZpbHRlcjogbXVsdGlwbGVGaWx0ZXJcblx0XHRcdFx0fTtcblx0XHRcdH1cblx0XHQpO1xuXG5cdFx0Ly8gSW5pdGlhbGl6ZSBqUXVlcnkgY2hvc2VuIGxpYnJhcnlcblx0XHRmdW5jdGlvbiBpbml0Q2hvc2VuKCkge1xuXHRcdFx0aWYgKCAhIGpRdWVyeSgpLmNob3NlbiApIHtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXG5cdFx0XHQkd2NhcGZUZXJtRmlsdGVyLmZpbmQoICcud2NhcGYtY2hvc2VuLXNlbGVjdCcgKS5lYWNoKCBmdW5jdGlvbigpIHtcblx0XHRcdFx0Y29uc3QgJHRoaXMgICA9ICQoIHRoaXMgKTtcblx0XHRcdFx0Y29uc3Qgb3B0aW9ucyA9IHt9O1xuXG5cdFx0XHRcdGNvbnN0IG5vUmVzdWx0c01lc3NhZ2UgPSAkdGhpcy5hdHRyKCAnZGF0YS1uby1yZXN1bHRzLW1lc3NhZ2UnICk7XG5cblx0XHRcdFx0aWYgKCBub1Jlc3VsdHNNZXNzYWdlICkge1xuXHRcdFx0XHRcdG9wdGlvbnNbICdub19yZXN1bHRzX3RleHQnIF0gPSBub1Jlc3VsdHNNZXNzYWdlO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0JHRoaXMuY2hvc2VuKCBvcHRpb25zICk7XG5cdFx0XHR9ICk7XG5cdFx0fVxuXG5cdFx0aW5pdENob3NlbigpO1xuXG5cdFx0Ly8gSW5pdGlhbGl6ZSBoaWVyYXJjaHkgYWNjb3JkaW9uXG5cdFx0ZnVuY3Rpb24gaW5pdEhpZXJhcmNoeUFjY29yZGlvbigpIHtcblx0XHRcdCR3Y2FwZlRlcm1GaWx0ZXIuZmluZCggJy5oaWVyYXJjaHktYWNjb3JkaW9uLXRvZ2dsZScgKS5vbiggJ2NsaWNrJywgZnVuY3Rpb24oKSB7XG5cdFx0XHRcdCQoIHRoaXMgKS50b2dnbGVDbGFzcyggJ2FjdGl2ZScgKTtcblx0XHRcdH0gKTtcblx0XHR9XG5cblx0XHRpbml0SGllcmFyY2h5QWNjb3JkaW9uKCk7XG5cblx0XHQvKipcblx0XHQgKiBAc291cmNlIGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vYS8zNDE0MTgxM1xuXHRcdCAqXG5cdFx0ICogQHBhcmFtIG51bWJlclxuXHRcdCAqIEBwYXJhbSBkZWNpbWFsc1xuXHRcdCAqIEBwYXJhbSBkZWNfcG9pbnRcblx0XHQgKiBAcGFyYW0gdGhvdXNhbmRzX3NlcFxuXHRcdCAqXG5cdFx0ICogQHJldHVybnMge3N0cmluZ31cblx0XHQgKi9cblx0XHRmdW5jdGlvbiBudW1iZXJfZm9ybWF0KCBudW1iZXIsIGRlY2ltYWxzLCBkZWNfcG9pbnQsIHRob3VzYW5kc19zZXAgKSB7XG5cdFx0XHQvLyBTdHJpcCBhbGwgY2hhcmFjdGVycyBidXQgbnVtZXJpY2FsIG9uZXMuXG5cdFx0XHRudW1iZXIgPSAoIG51bWJlciArICcnICkucmVwbGFjZSggL1teMC05K1xcLUVlLl0vZywgJycgKTtcblxuXHRcdFx0Y29uc3QgbiAgICA9ICEgaXNGaW5pdGUoICtudW1iZXIgKSA/IDAgOiArbnVtYmVyO1xuXHRcdFx0Y29uc3QgcHJlYyA9ICEgaXNGaW5pdGUoICtkZWNpbWFscyApID8gMCA6IE1hdGguYWJzKCBkZWNpbWFscyApO1xuXHRcdFx0Y29uc3Qgc2VwICA9ICggdHlwZW9mIHRob3VzYW5kc19zZXAgPT09ICd1bmRlZmluZWQnICkgPyAnLCcgOiB0aG91c2FuZHNfc2VwO1xuXHRcdFx0Y29uc3QgZGVjICA9ICggdHlwZW9mIGRlY19wb2ludCA9PT0gJ3VuZGVmaW5lZCcgKSA/ICcuJyA6IGRlY19wb2ludDtcblxuXHRcdFx0bGV0IHM7XG5cblx0XHRcdGNvbnN0IHRvRml4ZWRGaXggPSBmdW5jdGlvbiggbiwgcHJlYyApIHtcblx0XHRcdFx0Y29uc3QgayA9IE1hdGgucG93KCAxMCwgcHJlYyApO1xuXHRcdFx0XHRyZXR1cm4gJycgKyBNYXRoLnJvdW5kKCBuICogayApIC8gaztcblx0XHRcdH07XG5cblx0XHRcdC8vIEZpeCBmb3IgSUUgcGFyc2VGbG9hdCgwLjU1KS50b0ZpeGVkKDApID0gMDtcblx0XHRcdHMgPSAoIHByZWMgPyB0b0ZpeGVkRml4KCBuLCBwcmVjICkgOiAnJyArIE1hdGgucm91bmQoIG4gKSApLnNwbGl0KCAnLicgKTtcblxuXHRcdFx0aWYgKCBzWyAwIF0ubGVuZ3RoID4gMyApIHtcblx0XHRcdFx0c1sgMCBdID0gc1sgMCBdLnJlcGxhY2UoIC9cXEIoPz0oPzpcXGR7M30pKyg/IVxcZCkpL2csIHNlcCApO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAoICggc1sgMSBdIHx8ICcnICkubGVuZ3RoIDwgcHJlYyApIHtcblx0XHRcdFx0c1sgMSBdID0gc1sgMSBdIHx8ICcnO1xuXHRcdFx0XHRzWyAxIF0gKz0gbmV3IEFycmF5KCBwcmVjIC0gc1sgMSBdLmxlbmd0aCArIDEgKS5qb2luKCAnMCcgKTtcblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuIHMuam9pbiggZGVjICk7XG5cdFx0fVxuXG5cdFx0Ly8gSW5pdGlhbGl6ZSBub1VJU2xpZGVyXG5cdFx0ZnVuY3Rpb24gaW5pdE5vVUlTbGlkZXIoKSB7XG5cdFx0XHQkd2NhcGZUZXJtRmlsdGVyLmZpbmQoICcud2NhcGYtcmFuZ2Utc2xpZGVyJyApLmVhY2goIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRjb25zdCAkaXRlbSA9ICQoIHRoaXMgKTtcblxuXHRcdFx0XHRjb25zdCBmaWx0ZXJLZXkgICAgICAgICA9ICRpdGVtLmF0dHIoICdkYXRhLWZpbHRlci1rZXknICk7XG5cdFx0XHRcdGNvbnN0ICRzbGlkZXIgICAgICAgICAgID0gJGl0ZW0uZmluZCggJy53Y2FwZi1ub3VpLXNsaWRlcicgKTtcblx0XHRcdFx0Y29uc3Qgc2xpZGVySWQgICAgICAgICAgPSAkc2xpZGVyLmF0dHIoICdpZCcgKTtcblx0XHRcdFx0Y29uc3QgZGlzcGxheVZhbHVlc0FzICAgPSAkaXRlbS5hdHRyKCAnZGF0YS1kaXNwbGF5LXZhbHVlcy1hcycgKTtcblx0XHRcdFx0Y29uc3QgcmFuZ2VNaW5WYWx1ZSAgICAgPSBwYXJzZUZsb2F0KCAkaXRlbS5hdHRyKCAnZGF0YS1yYW5nZS1taW4tdmFsdWUnICkgKTtcblx0XHRcdFx0Y29uc3QgcmFuZ2VNYXhWYWx1ZSAgICAgPSBwYXJzZUZsb2F0KCAkaXRlbS5hdHRyKCAnZGF0YS1yYW5nZS1tYXgtdmFsdWUnICkgKTtcblx0XHRcdFx0Y29uc3Qgc3RlcCAgICAgICAgICAgICAgPSBwYXJzZUZsb2F0KCAkaXRlbS5hdHRyKCAnZGF0YS1zdGVwJyApICk7XG5cdFx0XHRcdGNvbnN0IGRlY2ltYWxQbGFjZXMgICAgID0gJGl0ZW0uYXR0ciggJ2RhdGEtZGVjaW1hbC1wbGFjZXMnICk7XG5cdFx0XHRcdGNvbnN0IHRob3VzYW5kU2VwYXJhdG9yID0gJGl0ZW0uYXR0ciggJ2RhdGEtdGhvdXNhbmQtc2VwYXJhdG9yJyApO1xuXHRcdFx0XHRjb25zdCBkZWNpbWFsU2VwYXJhdG9yICA9ICRpdGVtLmF0dHIoICdkYXRhLWRlY2ltYWwtc2VwYXJhdG9yJyApO1xuXHRcdFx0XHRjb25zdCBtaW5WYWx1ZSAgICAgICAgICA9IHBhcnNlRmxvYXQoICRpdGVtLmF0dHIoICdkYXRhLW1pbi12YWx1ZScgKSApO1xuXHRcdFx0XHRjb25zdCBtYXhWYWx1ZSAgICAgICAgICA9IHBhcnNlRmxvYXQoICRpdGVtLmF0dHIoICdkYXRhLW1heC12YWx1ZScgKSApO1xuXHRcdFx0XHRjb25zdCAkbWluVmFsdWUgICAgICAgICA9ICRpdGVtLmZpbmQoICcubWluLXZhbHVlJyApO1xuXHRcdFx0XHRjb25zdCAkbWF4VmFsdWUgICAgICAgICA9ICRpdGVtLmZpbmQoICcubWF4LXZhbHVlJyApO1xuXG5cdFx0XHRcdGlmICggJ3VuZGVmaW5lZCcgPT09IHR5cGVvZiBub1VpU2xpZGVyICkge1xuXHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGNvbnN0IHNsaWRlciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCBzbGlkZXJJZCApO1xuXG5cdFx0XHRcdG5vVWlTbGlkZXIuY3JlYXRlKCBzbGlkZXIsIHtcblx0XHRcdFx0XHRzdGFydDogWyBtaW5WYWx1ZSwgbWF4VmFsdWUgXSxcblx0XHRcdFx0XHRzdGVwLFxuXHRcdFx0XHRcdGNvbm5lY3Q6IHRydWUsXG5cdFx0XHRcdFx0cmFuZ2U6IHtcblx0XHRcdFx0XHRcdCdtaW4nOiByYW5nZU1pblZhbHVlLFxuXHRcdFx0XHRcdFx0J21heCc6IHJhbmdlTWF4VmFsdWUsXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9ICk7XG5cblx0XHRcdFx0c2xpZGVyLm5vVWlTbGlkZXIub24oICd1cGRhdGUnLCBmdW5jdGlvbiggdmFsdWVzICkge1xuXHRcdFx0XHRcdGNvbnN0IG1pblZhbHVlID0gbnVtYmVyX2Zvcm1hdCggdmFsdWVzWyAwIF0sIGRlY2ltYWxQbGFjZXMsIGRlY2ltYWxTZXBhcmF0b3IsIHRob3VzYW5kU2VwYXJhdG9yICk7XG5cdFx0XHRcdFx0Y29uc3QgbWF4VmFsdWUgPSBudW1iZXJfZm9ybWF0KCB2YWx1ZXNbIDEgXSwgZGVjaW1hbFBsYWNlcywgZGVjaW1hbFNlcGFyYXRvciwgdGhvdXNhbmRTZXBhcmF0b3IgKTtcblxuXHRcdFx0XHRcdGlmICggJ3BsYWluX3RleHQnID09PSBkaXNwbGF5VmFsdWVzQXMgKSB7XG5cdFx0XHRcdFx0XHQkbWluVmFsdWUuaHRtbCggbWluVmFsdWUgKTtcblx0XHRcdFx0XHRcdCRtYXhWYWx1ZS5odG1sKCBtYXhWYWx1ZSApO1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHQkbWluVmFsdWUudmFsKCBtaW5WYWx1ZSApO1xuXHRcdFx0XHRcdFx0JG1heFZhbHVlLnZhbCggbWF4VmFsdWUgKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0gKTtcblxuXHRcdFx0XHRmdW5jdGlvbiBmaWx0ZXJQcm9kdWN0c0FjY29yZGluZ1RvU2xpZGVyKCB2YWx1ZXMgKSB7XG5cdFx0XHRcdFx0Y29uc3QgbWluVmFsdWUgPSBwYXJzZUZsb2F0KCB2YWx1ZXNbIDAgXSApO1xuXHRcdFx0XHRcdGNvbnN0IG1heFZhbHVlID0gcGFyc2VGbG9hdCggdmFsdWVzWyAxIF0gKTtcblxuXHRcdFx0XHRcdGlmICggbWluVmFsdWUgPT09IHJhbmdlTWluVmFsdWUgJiYgbWF4VmFsdWUgPT09IHJhbmdlTWF4VmFsdWUgKSB7XG5cdFx0XHRcdFx0XHRjb25zdCBxdWVyeSA9IHdjYXBmUmVtb3ZlUXVlcnlTdHJpbmdQYXJhbWV0ZXIoIGZpbHRlcktleSApO1xuXHRcdFx0XHRcdFx0aGlzdG9yeS5wdXNoU3RhdGUoIHt9LCAnJywgcXVlcnkgKTtcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0Y29uc3QgZmlsdGVyVmFsU3RyaW5nID0gbWluVmFsdWUgKyAnKycgKyBtYXhWYWx1ZTtcblx0XHRcdFx0XHRcdHdjYXBmVXBkYXRlUXVlcnlTdHJpbmdQYXJhbWV0ZXIoIGZpbHRlcktleSwgZmlsdGVyVmFsU3RyaW5nICk7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0Ly8gZmlsdGVyIHByb2R1Y3RzXG5cdFx0XHRcdFx0d2NhcGZGaWx0ZXJQcm9kdWN0cygpO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0c2xpZGVyLm5vVWlTbGlkZXIub24oICdlbmQnLCBmdW5jdGlvbiggdmFsdWVzICkge1xuXHRcdFx0XHRcdC8vIENsZWFyIGFueSBwcmV2aW91c2x5IHNldCB0aW1lciBiZWZvcmUgc2V0dGluZyBhIGZyZXNoIG9uZVxuXHRcdFx0XHRcdGNsZWFyVGltZW91dCggJGl0ZW0uZGF0YSggJ3RpbWVyJyApICk7XG5cblx0XHRcdFx0XHQkaXRlbS5kYXRhKCAndGltZXInLCBzZXRUaW1lb3V0KCBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHRcdCRpdGVtLnJlbW92ZURhdGEoICd0aW1lcicgKTtcblxuXHRcdFx0XHRcdFx0ZmlsdGVyUHJvZHVjdHNBY2NvcmRpbmdUb1NsaWRlciggdmFsdWVzICk7XG5cdFx0XHRcdFx0fSwgZGVsYXkgKSApO1xuXHRcdFx0XHR9ICk7XG5cblx0XHRcdFx0JG1pblZhbHVlLm9uKCAnaW5wdXQnLCBmdW5jdGlvbiggZXZlbnQgKSB7XG5cdFx0XHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcblxuXHRcdFx0XHRcdGNvbnN0ICRpbnB1dCA9ICQoIHRoaXMgKTtcblxuXHRcdFx0XHRcdC8vIENsZWFyIGFueSBwcmV2aW91c2x5IHNldCB0aW1lciBiZWZvcmUgc2V0dGluZyBhIGZyZXNoIG9uZVxuXHRcdFx0XHRcdGNsZWFyVGltZW91dCggJGlucHV0LmRhdGEoICd0aW1lcicgKSApO1xuXG5cdFx0XHRcdFx0JGlucHV0LmRhdGEoICd0aW1lcicsIHNldFRpbWVvdXQoIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdFx0JGlucHV0LnJlbW92ZURhdGEoICd0aW1lcicgKTtcblxuXHRcdFx0XHRcdFx0Y29uc3QgbWluVmFsdWUgPSAkaW5wdXQudmFsKCk7XG5cblx0XHRcdFx0XHRcdHNsaWRlci5ub1VpU2xpZGVyLnNldCggWyBtaW5WYWx1ZSwgbnVsbCBdICk7XG5cblx0XHRcdFx0XHRcdGZpbHRlclByb2R1Y3RzQWNjb3JkaW5nVG9TbGlkZXIoIHNsaWRlci5ub1VpU2xpZGVyLmdldCgpICk7XG5cdFx0XHRcdFx0fSwgZGVsYXkgKSApO1xuXHRcdFx0XHR9ICk7XG5cblx0XHRcdFx0JG1heFZhbHVlLm9uKCAnaW5wdXQnLCBmdW5jdGlvbiggZXZlbnQgKSB7XG5cdFx0XHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcblxuXHRcdFx0XHRcdGNvbnN0ICRpbnB1dCA9ICQoIHRoaXMgKTtcblxuXHRcdFx0XHRcdC8vIENsZWFyIGFueSBwcmV2aW91c2x5IHNldCB0aW1lciBiZWZvcmUgc2V0dGluZyBhIGZyZXNoIG9uZVxuXHRcdFx0XHRcdGNsZWFyVGltZW91dCggJGlucHV0LmRhdGEoICd0aW1lcicgKSApO1xuXG5cdFx0XHRcdFx0JGlucHV0LmRhdGEoICd0aW1lcicsIHNldFRpbWVvdXQoIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdFx0JGlucHV0LnJlbW92ZURhdGEoICd0aW1lcicgKTtcblxuXHRcdFx0XHRcdFx0Y29uc3QgbWF4VmFsdWUgPSAkaW5wdXQudmFsKCk7XG5cblx0XHRcdFx0XHRcdHNsaWRlci5ub1VpU2xpZGVyLnNldCggWyBudWxsLCBtYXhWYWx1ZSBdICk7XG5cblx0XHRcdFx0XHRcdGZpbHRlclByb2R1Y3RzQWNjb3JkaW5nVG9TbGlkZXIoIHNsaWRlci5ub1VpU2xpZGVyLmdldCgpICk7XG5cdFx0XHRcdFx0fSwgZGVsYXkgKSApO1xuXHRcdFx0XHR9ICk7XG5cdFx0XHR9ICk7XG5cdFx0fVxuXG5cdFx0aW5pdE5vVUlTbGlkZXIoKTtcblxuXHRcdC8vIHNob3cgYSBsb2FkaW5nIGluZGljYXRvclxuXHRcdGZ1bmN0aW9uIHdjYXBmQmVmb3JlVXBkYXRlKCkge1xuXHRcdH1cblxuXHRcdC8vIHNjcm9sbCB0byB0b3Bcblx0XHRmdW5jdGlvbiB3Y2FwZkFmdGVyVXBkYXRlKCkge1xuXHRcdFx0aW5pdENob3NlbigpO1xuXHRcdFx0aW5pdEhpZXJhcmNoeUFjY29yZGlvbigpO1xuXHRcdFx0aW5pdE5vVUlTbGlkZXIoKTtcblx0XHR9XG5cblx0XHQvLyBmaWx0ZXIgdGhlIHByb2R1Y3RzXG5cdFx0ZnVuY3Rpb24gd2NhcGZGaWx0ZXJQcm9kdWN0cygpIHtcblx0XHRcdHdjYXBmQmVmb3JlVXBkYXRlKCk7XG5cblx0XHRcdCQuZ2V0KFxuXHRcdFx0XHR3aW5kb3cubG9jYXRpb24uaHJlZixcblx0XHRcdFx0ZnVuY3Rpb24oIGRhdGEgKSB7XG5cdFx0XHRcdFx0Y29uc3QgJGRhdGEgPSAkKCBkYXRhICk7XG5cblx0XHRcdFx0XHRjb25zdCAkc2hvcExvb3BDb250YWluZXIgPSAkZGF0YS5maW5kKCB3Y2FwZl9wYXJhbXMuc2hvcF9sb29wX2NvbnRhaW5lciApO1xuXHRcdFx0XHRcdGNvbnN0ICRub3RGb3VuZENvbnRhaW5lciA9ICRkYXRhLmZpbmQoIHdjYXBmX3BhcmFtcy5ub3RfZm91bmRfY29udGFpbmVyICk7XG5cblx0XHRcdFx0XHQvLyByZXBsYWNlIGZpZWxkcycgZGF0YSB3aXRoIG5ldyBkYXRhXG5cdFx0XHRcdFx0JC5lYWNoKFxuXHRcdFx0XHRcdFx0ZmllbGRzLFxuXHRcdFx0XHRcdFx0ZnVuY3Rpb24oIGlkICkge1xuXHRcdFx0XHRcdFx0XHRjb25zdCBmaWVsZElEICAgID0gJyMnICsgaWQ7XG5cdFx0XHRcdFx0XHRcdGNvbnN0ICRmaWVsZCAgICAgPSAkKCBmaWVsZElEICk7XG5cdFx0XHRcdFx0XHRcdGNvbnN0IF9maWVsZCAgICAgPSAkZGF0YS5maW5kKCBmaWVsZElEICk7XG5cdFx0XHRcdFx0XHRcdGNvbnN0IGZpZWxkQ2xhc3MgPSAkKCBfZmllbGQgKS5hdHRyKCAnY2xhc3MnICk7XG5cblx0XHRcdFx0XHRcdFx0Ly8gdXBkYXRlIGNsYXNzXG5cdFx0XHRcdFx0XHRcdCRmaWVsZC5hdHRyKCAnY2xhc3MnLCBmaWVsZENsYXNzICk7XG5cblx0XHRcdFx0XHRcdFx0Ly8gdXBkYXRlIGZpZWxkXG5cdFx0XHRcdFx0XHRcdCRmaWVsZC5odG1sKCBfZmllbGQuaHRtbCgpICk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0KTtcblxuXHRcdFx0XHRcdC8vIHJlcGxhY2Ugb2xkIHNob3AgbG9vcCB3aXRoIG5ldyBvbmVcblx0XHRcdFx0XHRpZiAoIHdjYXBmX3BhcmFtcy5zaG9wX2xvb3BfY29udGFpbmVyID09PSB3Y2FwZl9wYXJhbXMubm90X2ZvdW5kX2NvbnRhaW5lciApIHtcblx0XHRcdFx0XHRcdCQoIHdjYXBmX3BhcmFtcy5zaG9wX2xvb3BfY29udGFpbmVyICkuaHRtbCggJHNob3BMb29wQ29udGFpbmVyLmh0bWwoKSApO1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRpZiAoICQoIHdjYXBmX3BhcmFtcy5ub3RfZm91bmRfY29udGFpbmVyICkubGVuZ3RoICkge1xuXHRcdFx0XHRcdFx0XHRpZiAoICRzaG9wTG9vcENvbnRhaW5lci5sZW5ndGggKSB7XG5cdFx0XHRcdFx0XHRcdFx0JCggd2NhcGZfcGFyYW1zLm5vdF9mb3VuZF9jb250YWluZXIgKS5odG1sKCAkc2hvcExvb3BDb250YWluZXIuaHRtbCgpICk7XG5cdFx0XHRcdFx0XHRcdH0gZWxzZSBpZiAoICRub3RGb3VuZENvbnRhaW5lci5sZW5ndGggKSB7XG5cdFx0XHRcdFx0XHRcdFx0JCggd2NhcGZfcGFyYW1zLm5vdF9mb3VuZF9jb250YWluZXIgKS5odG1sKCAkbm90Rm91bmRDb250YWluZXIuaHRtbCgpICk7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH0gZWxzZSBpZiAoICQoIHdjYXBmX3BhcmFtcy5zaG9wX2xvb3BfY29udGFpbmVyICkubGVuZ3RoICkge1xuXHRcdFx0XHRcdFx0XHRpZiAoICRzaG9wTG9vcENvbnRhaW5lci5sZW5ndGggKSB7XG5cdFx0XHRcdFx0XHRcdFx0JCggd2NhcGZfcGFyYW1zLnNob3BfbG9vcF9jb250YWluZXIgKS5odG1sKCAkc2hvcExvb3BDb250YWluZXIuaHRtbCgpICk7XG5cdFx0XHRcdFx0XHRcdH0gZWxzZSBpZiAoICRub3RGb3VuZENvbnRhaW5lci5sZW5ndGggKSB7XG5cdFx0XHRcdFx0XHRcdFx0JCggd2NhcGZfcGFyYW1zLnNob3BfbG9vcF9jb250YWluZXIgKS5odG1sKCAkbm90Rm91bmRDb250YWluZXIuaHRtbCgpICk7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHR3Y2FwZkFmdGVyVXBkYXRlKCk7XG5cblx0XHRcdFx0XHQvLyByZWluaXRpYWxpemUgb3JkZXJpbmdcblx0XHRcdFx0XHQvLyB3Y2FwZkluaXRPcmRlcigpO1xuXG5cdFx0XHRcdFx0Ly8gcmVpbml0aWFsaXplIGRyb3Bkb3duIGZpbHRlclxuXHRcdFx0XHRcdC8vIHdjYXBmRHJvcERvd25GaWx0ZXIoKTtcblxuXHRcdFx0XHRcdC8vIHJ1biBzY3JpcHRzIGFmdGVyIHNob3AgbG9vcCB1bmRhdGVkXG5cdFx0XHRcdFx0aWYgKCB0eXBlb2Ygd2NhcGZfcGFyYW1zLmN1c3RvbV9zY3JpcHRzICE9PSAndW5kZWZpbmVkJyAmJiB3Y2FwZl9wYXJhbXMuY3VzdG9tX3NjcmlwdHMubGVuZ3RoID4gMCApIHtcblx0XHRcdFx0XHRcdGV2YWwoIHdjYXBmX3BhcmFtcy5jdXN0b21fc2NyaXB0cyApO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0KTtcblx0XHR9XG5cblx0XHQvLyBVUkwgUGFyc2VyXG5cdFx0ZnVuY3Rpb24gd2NhcGZHZXRVcmxWYXJzKCB1cmwgKSB7XG5cdFx0XHRsZXQgdmFycyA9IHt9LCBoYXNoO1xuXG5cdFx0XHRpZiAoIHR5cGVvZiB1cmwgPT09ICd1bmRlZmluZWQnICkge1xuXHRcdFx0XHR1cmwgPSB3aW5kb3cubG9jYXRpb24uaHJlZjtcblx0XHRcdH1cblxuXHRcdFx0Y29uc3QgaGFzaGVzICA9IHVybC5zbGljZSggdXJsLmluZGV4T2YoICc/JyApICsgMSApLnNwbGl0KCAnJicgKTtcblx0XHRcdGNvbnN0IGhMZW5ndGggPSBoYXNoZXMubGVuZ3RoO1xuXG5cdFx0XHRmb3IgKCBsZXQgaSA9IDA7IGkgPCBoTGVuZ3RoOyBpKysgKSB7XG5cdFx0XHRcdGhhc2ggPSBoYXNoZXNbIGkgXS5zcGxpdCggJz0nICk7XG5cblx0XHRcdFx0dmFyc1sgaGFzaFsgMCBdIF0gPSBoYXNoWyAxIF07XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiB2YXJzO1xuXHRcdH1cblxuXHRcdC8vIGV2ZXJ5dGltZSB3ZSBhcHBseSB0aGUgZmlsdGVyIHdlIHNldCB0aGUgY3VycmVudCBwYWdlIHRvIDFcblx0XHRmdW5jdGlvbiB3Y2FwZkZpeFBhZ2luYXRpb24oKSB7XG5cdFx0XHRsZXQgdXJsICAgICAgICAgICAgICAgID0gd2luZG93LmxvY2F0aW9uLmhyZWY7XG5cdFx0XHRjb25zdCBwYXJhbXMgICAgICAgICAgID0gd2NhcGZHZXRVcmxWYXJzKCB1cmwgKTtcblx0XHRcdGNvbnN0IGN1cnJlbnRQYWdlSW5VcmwgPSBwYXJzZUludCggdXJsLnJlcGxhY2UoIC8uK1xcL3BhZ2VcXC8oWzAtOV0rKSsvLCAnJDEnICkgKTtcblxuXHRcdFx0aWYgKCBjdXJyZW50UGFnZUluVXJsICkge1xuXHRcdFx0XHRpZiAoIGN1cnJlbnRQYWdlSW5VcmwgPiAxICkge1xuXHRcdFx0XHRcdHVybCA9IHVybC5yZXBsYWNlKCAvcGFnZVxcLyhbMC05XSspLywgJ3BhZ2UvMScgKTtcblx0XHRcdFx0fVxuXHRcdFx0fSBlbHNlIGlmICggdHlwZW9mIHBhcmFtc1sgJ3BhZ2VkJyBdICE9PSAndW5kZWZpbmVkJyApIHtcblx0XHRcdFx0Y29uc3QgY3VycmVudFBhZ2VJblBhcmFtcyA9IHBhcnNlSW50KCBwYXJhbXNbICdwYWdlZCcgXSApO1xuXG5cdFx0XHRcdGlmICggY3VycmVudFBhZ2VJblBhcmFtcyA+IDEgKSB7XG5cdFx0XHRcdFx0dXJsID0gdXJsLnJlcGxhY2UoICdwYWdlZD0nICsgY3VycmVudFBhZ2VJblBhcmFtcywgJ3BhZ2VkPTEnICk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuIHVybDtcblx0XHR9XG5cblx0XHQvLyB1cGRhdGUgcXVlcnkgc3RyaW5nIGZvciBjYXRlZ29yaWVzLCBtZXRhIGV0Yy4uXG5cdFx0ZnVuY3Rpb24gd2NhcGZVcGRhdGVRdWVyeVN0cmluZ1BhcmFtZXRlcigga2V5LCB2YWx1ZSwgcHVzaEhpc3RvcnksIHVybCApIHtcblx0XHRcdGlmICggdHlwZW9mIHB1c2hIaXN0b3J5ID09PSAndW5kZWZpbmVkJyApIHtcblx0XHRcdFx0cHVzaEhpc3RvcnkgPSB0cnVlO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAoIHR5cGVvZiB1cmwgPT09ICd1bmRlZmluZWQnICkge1xuXHRcdFx0XHR1cmwgPSB3Y2FwZkZpeFBhZ2luYXRpb24oKTtcblx0XHRcdH1cblxuXHRcdFx0Y29uc3QgcmUgICAgICAgID0gbmV3IFJlZ0V4cCggJyhbPyZdKScgKyBrZXkgKyAnPS4qPygmfCQpJywgJ2knICk7XG5cdFx0XHRjb25zdCBzZXBhcmF0b3IgPSB1cmwuaW5kZXhPZiggJz8nICkgIT09IC0xID8gJyYnIDogJz8nO1xuXHRcdFx0bGV0IHVybFdpdGhRdWVyeTtcblxuXHRcdFx0aWYgKCB1cmwubWF0Y2goIHJlICkgKSB7XG5cdFx0XHRcdHVybFdpdGhRdWVyeSA9IHVybC5yZXBsYWNlKCByZSwgJyQxJyArIGtleSArICc9JyArIHZhbHVlICsgJyQyJyApO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0dXJsV2l0aFF1ZXJ5ID0gdXJsICsgc2VwYXJhdG9yICsga2V5ICsgJz0nICsgdmFsdWU7XG5cdFx0XHR9XG5cblx0XHRcdGlmICggcHVzaEhpc3RvcnkgPT09IHRydWUgKSB7XG5cdFx0XHRcdHJldHVybiBoaXN0b3J5LnB1c2hTdGF0ZSgge30sICcnLCB1cmxXaXRoUXVlcnkgKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHJldHVybiB1cmxXaXRoUXVlcnk7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0Ly8gcmVtb3ZlIHBhcmFtZXRlciBmcm9tIHVybFxuXHRcdGZ1bmN0aW9uIHdjYXBmUmVtb3ZlUXVlcnlTdHJpbmdQYXJhbWV0ZXIoIGZpbHRlcktleSwgdXJsICkge1xuXHRcdFx0aWYgKCB0eXBlb2YgdXJsID09PSAndW5kZWZpbmVkJyApIHtcblx0XHRcdFx0dXJsID0gd2NhcGZGaXhQYWdpbmF0aW9uKCk7XG5cdFx0XHR9XG5cblx0XHRcdGNvbnN0IG9sZFBhcmFtcyAgICAgICAgID0gd2NhcGZHZXRVcmxWYXJzKCB1cmwgKTtcblx0XHRcdGNvbnN0IG9sZFBhcmFtc0xlbmd0aCAgID0gT2JqZWN0LmtleXMoIG9sZFBhcmFtcyApLmxlbmd0aDtcblx0XHRcdGNvbnN0IHN0YXJ0UG9zaXRpb24gICAgID0gdXJsLmluZGV4T2YoICc/JyApO1xuXHRcdFx0Y29uc3QgZmlsdGVyS2V5UG9zaXRpb24gPSB1cmwuaW5kZXhPZiggZmlsdGVyS2V5ICk7XG5cdFx0XHRsZXQgY2xlYW5VcmwsIGNsZWFuUXVlcnk7XG5cblx0XHRcdGlmICggb2xkUGFyYW1zTGVuZ3RoID4gMSApIHtcblx0XHRcdFx0aWYgKCAoIGZpbHRlcktleVBvc2l0aW9uIC0gc3RhcnRQb3NpdGlvbiApID4gMSApIHtcblx0XHRcdFx0XHRjbGVhblVybCA9IHVybC5yZXBsYWNlKCAnJicgKyBmaWx0ZXJLZXkgKyAnPScgKyBvbGRQYXJhbXNbIGZpbHRlcktleSBdLCAnJyApO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdGNsZWFuVXJsID0gdXJsLnJlcGxhY2UoIGZpbHRlcktleSArICc9JyArIG9sZFBhcmFtc1sgZmlsdGVyS2V5IF0gKyAnJicsICcnICk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRjb25zdCBuZXdQYXJhbXMgPSBjbGVhblVybC5zcGxpdCggJz8nICk7XG5cdFx0XHRcdGNsZWFuUXVlcnkgICAgICA9ICc/JyArIG5ld1BhcmFtc1sgMSBdO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0Y2xlYW5RdWVyeSA9IHVybC5yZXBsYWNlKCAnPycgKyBmaWx0ZXJLZXkgKyAnPScgKyBvbGRQYXJhbXNbIGZpbHRlcktleSBdLCAnJyApO1xuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gY2xlYW5RdWVyeTtcblx0XHR9XG5cblx0XHQvLyB0YWtlIHRoZSBrZXkgYW5kIHZhbHVlIGFuZCBtYWtlIHF1ZXJ5XG5cdFx0ZnVuY3Rpb24gd2NhcGZNYWtlUGFyYW1ldGVycyggZmlsdGVyS2V5LCBmaWx0ZXJWYWx1ZSwgdXJsICkge1xuXHRcdFx0bGV0IHBhcmFtcywgbmV4dFZhbHVlcywgZW1wdHlWYWx1ZSA9IGZhbHNlO1xuXG5cdFx0XHRpZiAoIHR5cGVvZiB1cmwgIT09ICd1bmRlZmluZWQnICkge1xuXHRcdFx0XHRwYXJhbXMgPSB3Y2FwZkdldFVybFZhcnMoIHVybCApO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0cGFyYW1zID0gd2NhcGZHZXRVcmxWYXJzKCk7XG5cdFx0XHR9XG5cblx0XHRcdGlmICggdHlwZW9mIHBhcmFtc1sgZmlsdGVyS2V5IF0gIT0gJ3VuZGVmaW5lZCcgKSB7XG5cdFx0XHRcdGNvbnN0IHByZXZWYWx1ZXMgICAgICA9IHBhcmFtc1sgZmlsdGVyS2V5IF07XG5cdFx0XHRcdGNvbnN0IHByZXZWYWx1ZXNBcnJheSA9IHByZXZWYWx1ZXMuc3BsaXQoICcsJyApO1xuXG5cdFx0XHRcdGlmICggcHJldlZhbHVlcy5sZW5ndGggPiAwICkge1xuXHRcdFx0XHRcdGNvbnN0IGZvdW5kID0gJC5pbkFycmF5KCBmaWx0ZXJWYWx1ZSwgcHJldlZhbHVlc0FycmF5ICk7XG5cblx0XHRcdFx0XHRpZiAoIGZvdW5kID49IDAgKSB7XG5cdFx0XHRcdFx0XHQvLyBFbGVtZW50IHdhcyBmb3VuZCwgcmVtb3ZlIGl0LlxuXHRcdFx0XHRcdFx0cHJldlZhbHVlc0FycmF5LnNwbGljZSggZm91bmQsIDEgKTtcblxuXHRcdFx0XHRcdFx0aWYgKCBwcmV2VmFsdWVzQXJyYXkubGVuZ3RoID09PSAwICkge1xuXHRcdFx0XHRcdFx0XHRlbXB0eVZhbHVlID0gdHJ1ZTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0Ly8gRWxlbWVudCB3YXMgbm90IGZvdW5kLCBhZGQgaXQuXG5cdFx0XHRcdFx0XHRwcmV2VmFsdWVzQXJyYXkucHVzaCggZmlsdGVyVmFsdWUgKTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRpZiAoIHByZXZWYWx1ZXNBcnJheS5sZW5ndGggPiAxICkge1xuXHRcdFx0XHRcdFx0bmV4dFZhbHVlcyA9IHByZXZWYWx1ZXNBcnJheS5qb2luKCAnLCcgKTtcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0bmV4dFZhbHVlcyA9IHByZXZWYWx1ZXNBcnJheTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0bmV4dFZhbHVlcyA9IGZpbHRlclZhbHVlO1xuXHRcdFx0XHR9XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRuZXh0VmFsdWVzID0gZmlsdGVyVmFsdWU7XG5cdFx0XHR9XG5cblx0XHRcdC8vIHVwZGF0ZSB1cmwgYW5kIHF1ZXJ5IHN0cmluZ1xuXHRcdFx0aWYgKCAhIGVtcHR5VmFsdWUgKSB7XG5cdFx0XHRcdHdjYXBmVXBkYXRlUXVlcnlTdHJpbmdQYXJhbWV0ZXIoIGZpbHRlcktleSwgbmV4dFZhbHVlcyApO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0Y29uc3QgcXVlcnkgPSB3Y2FwZlJlbW92ZVF1ZXJ5U3RyaW5nUGFyYW1ldGVyKCBmaWx0ZXJLZXkgKTtcblx0XHRcdFx0aGlzdG9yeS5wdXNoU3RhdGUoIHt9LCAnJywgcXVlcnkgKTtcblx0XHRcdH1cblxuXHRcdFx0Ly8gZmlsdGVyIHByb2R1Y3RzXG5cdFx0XHR3Y2FwZkZpbHRlclByb2R1Y3RzKCk7XG5cdFx0fVxuXG5cdFx0ZnVuY3Rpb24gd2NhcGZTaW5nbGVGaWx0ZXIoIGZpbHRlcktleSwgZmlsdGVyVmFsdWUgKSB7XG5cdFx0XHRjb25zdCBwYXJhbXMgPSB3Y2FwZkdldFVybFZhcnMoKTtcblx0XHRcdGxldCBxdWVyeTtcblxuXHRcdFx0aWYgKCB0eXBlb2YgcGFyYW1zWyBmaWx0ZXJLZXkgXSAhPT0gJ3VuZGVmaW5lZCcgJiYgcGFyYW1zWyBmaWx0ZXJLZXkgXSA9PT0gZmlsdGVyVmFsdWUgKSB7XG5cdFx0XHRcdHF1ZXJ5ID0gd2NhcGZSZW1vdmVRdWVyeVN0cmluZ1BhcmFtZXRlciggZmlsdGVyS2V5ICk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRxdWVyeSA9IHdjYXBmVXBkYXRlUXVlcnlTdHJpbmdQYXJhbWV0ZXIoIGZpbHRlcktleSwgZmlsdGVyVmFsdWUsIGZhbHNlICk7XG5cdFx0XHR9XG5cblx0XHRcdC8vIHVwZGF0ZSB1cmxcblx0XHRcdGhpc3RvcnkucHVzaFN0YXRlKCB7fSwgJycsIHF1ZXJ5ICk7XG5cblx0XHRcdC8vIGZpbHRlciBwcm9kdWN0c1xuXHRcdFx0d2NhcGZGaWx0ZXJQcm9kdWN0cygpO1xuXHRcdH1cblxuXHRcdC8vIFRoZSBtYWluIGZ1bmN0aW9uIHRvIGhhbmRsZSB0aGUgZmlsdGVyIHJlcXVlc3Rcblx0XHRmdW5jdGlvbiBoYW5kbGVGaWx0ZXJSZXF1ZXN0KCAkaXRlbSwgZmlsdGVyVmFsdWUgKSB7XG5cdFx0XHRjb25zdCAkZmllbGQgICAgICAgICA9ICRpdGVtLmNsb3Nlc3QoICcud2NhcGYtZmllbGQtZmlsdGVyLWZvcm0nICk7XG5cdFx0XHRjb25zdCBmaWVsZElEICAgICAgICA9ICRmaWVsZC5hdHRyKCAnaWQnICk7XG5cdFx0XHRjb25zdCBmaWVsZERhdGEgICAgICA9IGZpZWxkc1sgZmllbGRJRCBdO1xuXHRcdFx0Y29uc3QgZmlsdGVyS2V5ICAgICAgPSBmaWVsZERhdGEuZmlsdGVyS2V5O1xuXHRcdFx0Y29uc3QgbXVsdGlwbGVGaWx0ZXIgPSBmaWVsZERhdGEubXVsdGlwbGVGaWx0ZXI7XG5cblx0XHRcdGlmICggISBmaWx0ZXJLZXkgKSB7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblxuXHRcdFx0aWYgKCAhIGZpbHRlclZhbHVlLmxlbmd0aCApIHtcblx0XHRcdFx0Y29uc3QgcXVlcnkgPSB3Y2FwZlJlbW92ZVF1ZXJ5U3RyaW5nUGFyYW1ldGVyKCBmaWx0ZXJLZXkgKTtcblx0XHRcdFx0aGlzdG9yeS5wdXNoU3RhdGUoIHt9LCAnJywgcXVlcnkgKTtcblxuXHRcdFx0XHQvLyBmaWx0ZXIgcHJvZHVjdHNcblx0XHRcdFx0d2NhcGZGaWx0ZXJQcm9kdWN0cygpO1xuXG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblxuXHRcdFx0aWYgKCBtdWx0aXBsZUZpbHRlciApIHtcblx0XHRcdFx0d2NhcGZNYWtlUGFyYW1ldGVycyggZmlsdGVyS2V5LCBmaWx0ZXJWYWx1ZSApO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0d2NhcGZTaW5nbGVGaWx0ZXIoIGZpbHRlcktleSwgZmlsdGVyVmFsdWUgKTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHQvLyBoYW5kbGUgdGhlIGZpbHRlciByZXF1ZXN0IGZvciBsaXN0IGZpZWxkc1xuXHRcdCR3Y2FwZlRlcm1GaWx0ZXIub24oXG5cdFx0XHQnY2hhbmdlJyxcblx0XHRcdCcud2NhcGYtbGF5ZXJlZC1uYXYgW3R5cGU9XCJjaGVja2JveFwiXSwgLndjYXBmLWxheWVyZWQtbmF2IFt0eXBlPVwicmFkaW9cIl0nLFxuXHRcdFx0ZnVuY3Rpb24oIGV2ZW50ICkge1xuXHRcdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXG5cdFx0XHRcdGNvbnN0ICRpdGVtICAgICAgID0gJCggdGhpcyApO1xuXHRcdFx0XHRjb25zdCBmaWx0ZXJWYWx1ZSA9ICRpdGVtLnZhbCgpO1xuXG5cdFx0XHRcdGhhbmRsZUZpbHRlclJlcXVlc3QoICRpdGVtLCBmaWx0ZXJWYWx1ZSApO1xuXHRcdFx0fVxuXHRcdCk7XG5cblx0XHQvLyBUT0RPOiBVc2UgYSBjb21iaW5hdGlvbiBvZiBsYWJlbCwgY2hlY2tib3ggYW5kIHJhZGlvXG5cdFx0Ly8gaGFuZGxlIHRoZSBmaWx0ZXIgcmVxdWVzdCBmb3IgbGFiZWxlZCBpdGVtXG5cdFx0JHdjYXBmVGVybUZpbHRlci5vbihcblx0XHRcdCdjbGljaycsXG5cdFx0XHQnLndjYXBmLWxhYmVsZWQtbmF2IC5pdGVtJyxcblx0XHRcdGZ1bmN0aW9uKCBldmVudCApIHtcblx0XHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcblxuXHRcdFx0XHRjb25zdCAkaXRlbSAgICAgICA9ICQoIHRoaXMgKTtcblx0XHRcdFx0Y29uc3QgZmlsdGVyVmFsdWUgPSAkaXRlbS5hdHRyKCAnZGF0YS12YWx1ZScgKTtcblxuXHRcdFx0XHRoYW5kbGVGaWx0ZXJSZXF1ZXN0KCAkaXRlbSwgZmlsdGVyVmFsdWUgKTtcblx0XHRcdH1cblx0XHQpO1xuXG5cdFx0Ly8gaGFuZGxlIHRoZSBmaWx0ZXIgcmVxdWVzdCBmb3IgZGlzcGxheSB0eXBlIHNlbGVjdCBmaWVsZHNcblx0XHQkd2NhcGZUZXJtRmlsdGVyLm9uKFxuXHRcdFx0J2NoYW5nZScsXG5cdFx0XHQnc2VsZWN0Jyxcblx0XHRcdGZ1bmN0aW9uKCBldmVudCApIHtcblx0XHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcblxuXHRcdFx0XHRjb25zdCAkaXRlbSAgICAgICA9ICQoIHRoaXMgKTtcblx0XHRcdFx0Y29uc3QgZmlsdGVyVmFsdWUgPSAkaXRlbS52YWwoKTtcblxuXHRcdFx0XHRjb25zdCAkZmllbGQgICAgPSAkaXRlbS5jbG9zZXN0KCAnLndjYXBmLWZpZWxkLWZpbHRlci1mb3JtJyApO1xuXHRcdFx0XHRjb25zdCBmaWVsZElEICAgPSAkZmllbGQuYXR0ciggJ2lkJyApO1xuXHRcdFx0XHRjb25zdCBmaWVsZERhdGEgPSBmaWVsZHNbIGZpZWxkSUQgXTtcblx0XHRcdFx0Y29uc3QgZmlsdGVyS2V5ID0gZmllbGREYXRhLmZpbHRlcktleTtcblxuXHRcdFx0XHRpZiAoICEgZmlsdGVyVmFsdWUubGVuZ3RoICkge1xuXHRcdFx0XHRcdGNvbnN0IHF1ZXJ5ID0gd2NhcGZSZW1vdmVRdWVyeVN0cmluZ1BhcmFtZXRlciggZmlsdGVyS2V5ICk7XG5cdFx0XHRcdFx0aGlzdG9yeS5wdXNoU3RhdGUoIHt9LCAnJywgcXVlcnkgKTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRjb25zdCBmaWx0ZXJWYWxTdHJpbmcgPSBmaWx0ZXJWYWx1ZS50b1N0cmluZygpO1xuXHRcdFx0XHRcdHdjYXBmVXBkYXRlUXVlcnlTdHJpbmdQYXJhbWV0ZXIoIGZpbHRlcktleSwgZmlsdGVyVmFsU3RyaW5nICk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHQvLyBmaWx0ZXIgcHJvZHVjdHNcblx0XHRcdFx0d2NhcGZGaWx0ZXJQcm9kdWN0cygpO1xuXHRcdFx0fVxuXHRcdCk7XG5cblx0XHQvLyBoYW5kbGUgdGhlIGZpbHRlciByZXF1ZXN0IGZvciByYW5nZSBudW1iZXJcblx0XHQkd2NhcGZUZXJtRmlsdGVyLm9uKFxuXHRcdFx0J2lucHV0Jyxcblx0XHRcdCcud2NhcGYtcmFuZ2UtbnVtYmVyIC5taW4tdmFsdWUsIC53Y2FwZi1yYW5nZS1udW1iZXIgLm1heC12YWx1ZScsXG5cdFx0XHRmdW5jdGlvbiggZXZlbnQgKSB7XG5cdFx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cblx0XHRcdFx0Y29uc3QgJGl0ZW0gPSAkKCB0aGlzICk7XG5cblx0XHRcdFx0Ly8gQ2xlYXIgYW55IHByZXZpb3VzbHkgc2V0IHRpbWVyIGJlZm9yZSBzZXR0aW5nIGEgZnJlc2ggb25lXG5cdFx0XHRcdGNsZWFyVGltZW91dCggJGl0ZW0uZGF0YSggJ3RpbWVyJyApICk7XG5cblx0XHRcdFx0JGl0ZW0uZGF0YSggJ3RpbWVyJywgc2V0VGltZW91dCggZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0JGl0ZW0ucmVtb3ZlRGF0YSggJ3RpbWVyJyApO1xuXG5cdFx0XHRcdFx0Y29uc3QgJHJhbmdlTnVtYmVyICA9ICRpdGVtLmNsb3Nlc3QoICcud2NhcGYtcmFuZ2UtbnVtYmVyJyApO1xuXHRcdFx0XHRcdGNvbnN0IGZpbHRlcktleSAgICAgPSAkcmFuZ2VOdW1iZXIuYXR0ciggJ2RhdGEtZmlsdGVyLWtleScgKTtcblx0XHRcdFx0XHRjb25zdCByYW5nZU1pblZhbHVlID0gJHJhbmdlTnVtYmVyLmF0dHIoICdkYXRhLXJhbmdlLW1pbi12YWx1ZScgKTtcblx0XHRcdFx0XHRjb25zdCByYW5nZU1heFZhbHVlID0gJHJhbmdlTnVtYmVyLmF0dHIoICdkYXRhLXJhbmdlLW1heC12YWx1ZScgKTtcblx0XHRcdFx0XHRsZXQgbWluVmFsdWUgICAgICAgID0gJHJhbmdlTnVtYmVyLmZpbmQoICcubWluLXZhbHVlJyApLnZhbCgpO1xuXHRcdFx0XHRcdGxldCBtYXhWYWx1ZSAgICAgICAgPSAkcmFuZ2VOdW1iZXIuZmluZCggJy5tYXgtdmFsdWUnICkudmFsKCk7XG5cblx0XHRcdFx0XHRpZiAoICEgbWluVmFsdWUubGVuZ3RoICkge1xuXHRcdFx0XHRcdFx0bWluVmFsdWUgPSByYW5nZU1pblZhbHVlO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdGlmICggISBtYXhWYWx1ZS5sZW5ndGggKSB7XG5cdFx0XHRcdFx0XHRtYXhWYWx1ZSA9IHJhbmdlTWF4VmFsdWU7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0aWYgKCBwYXJzZUZsb2F0KCBtaW5WYWx1ZSApID4gcGFyc2VGbG9hdCggbWF4VmFsdWUgKSApIHtcblx0XHRcdFx0XHRcdG1heFZhbHVlID0gbWluVmFsdWU7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0aWYgKCBtaW5WYWx1ZSA9PT0gcmFuZ2VNaW5WYWx1ZSAmJiBtYXhWYWx1ZSA9PT0gcmFuZ2VNYXhWYWx1ZSApIHtcblx0XHRcdFx0XHRcdGNvbnN0IHF1ZXJ5ID0gd2NhcGZSZW1vdmVRdWVyeVN0cmluZ1BhcmFtZXRlciggZmlsdGVyS2V5ICk7XG5cdFx0XHRcdFx0XHRoaXN0b3J5LnB1c2hTdGF0ZSgge30sICcnLCBxdWVyeSApO1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRjb25zdCBmaWx0ZXJWYWxTdHJpbmcgPSBtaW5WYWx1ZSArICcrJyArIG1heFZhbHVlO1xuXHRcdFx0XHRcdFx0d2NhcGZVcGRhdGVRdWVyeVN0cmluZ1BhcmFtZXRlciggZmlsdGVyS2V5LCBmaWx0ZXJWYWxTdHJpbmcgKTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHQvLyBmaWx0ZXIgcHJvZHVjdHNcblx0XHRcdFx0XHR3Y2FwZkZpbHRlclByb2R1Y3RzKCk7XG5cdFx0XHRcdH0sIGRlbGF5ICkgKTtcblx0XHRcdH1cblx0XHQpO1xuXG5cdFx0Ly8gaGlzdG9yeSBiYWNrIGFuZCBmb3J3YXJkIHJlcXVlc3QgaGFuZGxpbmdcblx0XHQkKCB3aW5kb3cgKS5iaW5kKCAncG9wc3RhdGUnLCBmdW5jdGlvbigpIHtcblx0XHRcdC8vIGZpbHRlciBwcm9kdWN0c1xuXHRcdFx0d2NhcGZGaWx0ZXJQcm9kdWN0cygpO1xuXHRcdH0gKTtcblxuXHR9XG4pO1xuIl19
