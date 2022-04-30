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
  // todo
  'sorting_control': '',
  // todo
  'scroll_to_top': '',
  // todo
  'scroll_to_top_offset': '',
  // todo
  'custom_scripts': '',
  'filter_relationships': ''
};
jQuery(document).ready(function ($) {
  // return false if wcapf_params variable is not found
  if (typeof wcapf_params === 'undefined') {
    return false;
  }

  var delay = 800; // todo: option to change
  // store fields' id and filter information

  var fields = {};
  var $wcapfSingleFilters = $('.wcapf-single-filter');
  var $wcapfTermFilters = $('.wcapf-ajax-term-filter');
  $wcapfTermFilters.each(function () {
    var $field = $(this);
    var id = $field.attr('data-id');
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

    $wcapfTermFilters.find('.wcapf-chosen-select').each(function () {
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
    $wcapfTermFilters.find('.hierarchy-accordion-toggle').on('click', function () {
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
    $wcapfSingleFilters.find('.wcapf-range-slider').each(function () {
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

  function wcapfBeforeUpdate() {
    $('body').trigger('wcapf_before_update');
  } // scroll to top


  function wcapfAfterUpdate() {
    initChosen();
    initHierarchyAccordion();
    $('body').trigger('wcapf_after_update');
  } // filter the products


  function wcapfFilterProducts() {
    wcapfBeforeUpdate();
    $.get(window.location.href, function (data) {
      var $data = $(data);
      var $shopLoopContainer = $data.find(wcapf_params.shop_loop_container);
      var $notFoundContainer = $data.find(wcapf_params.not_found_container); // replace fields' data with new data

      $.each(fields, function (id) {
        var fieldID = '[data-id="' + id + '"]';
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


  $wcapfTermFilters.on('change', '.wcapf-layered-nav [type="checkbox"], .wcapf-layered-nav [type="radio"]', function (event) {
    event.preventDefault();
    var $item = $(this);
    var filterValue = $item.val();
    handleFilterRequest($item, filterValue);
  }); // TODO: Use a combination of label, checkbox and radio
  // handle the filter request for labeled item

  $wcapfTermFilters.on('click', '.wcapf-labeled-nav .item', function (event) {
    event.preventDefault();
    var $item = $(this);
    var filterValue = $item.attr('data-value');
    handleFilterRequest($item, filterValue);
  }); // handle the filter request for display type select fields

  $wcapfTermFilters.on('change', 'select', function (event) {
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

  $wcapfSingleFilters.on('input', '.wcapf-range-number .min-value, .wcapf-range-number .max-value', function (event) {
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
        $rangeNumber.find('.max-value').val(maxValue);
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNob3Nlbi5qcyIsImZpbHRlci1mb3JtLmpzIl0sIm5hbWVzIjpbImpRdWVyeSIsImRvY3VtZW50IiwicmVhZHkiLCIkIiwid2NhcGZfcGFyYW1zIiwiZGVsYXkiLCJmaWVsZHMiLCIkd2NhcGZTaW5nbGVGaWx0ZXJzIiwiJHdjYXBmVGVybUZpbHRlcnMiLCJlYWNoIiwiJGZpZWxkIiwiaWQiLCJhdHRyIiwiJHdyYXBwZXIiLCJjaGlsZHJlbiIsImZpbHRlcktleSIsIm11bHRpcGxlRmlsdGVyIiwicGFyc2VJbnQiLCJpbml0Q2hvc2VuIiwiY2hvc2VuIiwiZmluZCIsIiR0aGlzIiwib3B0aW9ucyIsIm5vUmVzdWx0c01lc3NhZ2UiLCJpbml0SGllcmFyY2h5QWNjb3JkaW9uIiwib24iLCJ0b2dnbGVDbGFzcyIsIm51bWJlcl9mb3JtYXQiLCJudW1iZXIiLCJkZWNpbWFscyIsImRlY19wb2ludCIsInRob3VzYW5kc19zZXAiLCJyZXBsYWNlIiwibiIsImlzRmluaXRlIiwicHJlYyIsIk1hdGgiLCJhYnMiLCJzZXAiLCJkZWMiLCJzIiwidG9GaXhlZEZpeCIsImsiLCJwb3ciLCJyb3VuZCIsInNwbGl0IiwibGVuZ3RoIiwiQXJyYXkiLCJqb2luIiwiaW5pdE5vVUlTbGlkZXIiLCIkaXRlbSIsIiRzbGlkZXIiLCJzbGlkZXJJZCIsImRpc3BsYXlWYWx1ZXNBcyIsInJhbmdlTWluVmFsdWUiLCJwYXJzZUZsb2F0IiwicmFuZ2VNYXhWYWx1ZSIsInN0ZXAiLCJkZWNpbWFsUGxhY2VzIiwidGhvdXNhbmRTZXBhcmF0b3IiLCJkZWNpbWFsU2VwYXJhdG9yIiwibWluVmFsdWUiLCJtYXhWYWx1ZSIsIiRtaW5WYWx1ZSIsIiRtYXhWYWx1ZSIsIm5vVWlTbGlkZXIiLCJzbGlkZXIiLCJnZXRFbGVtZW50QnlJZCIsImNyZWF0ZSIsInN0YXJ0IiwiY29ubmVjdCIsInJhbmdlIiwidmFsdWVzIiwiaHRtbCIsInZhbCIsImZpbHRlclByb2R1Y3RzQWNjb3JkaW5nVG9TbGlkZXIiLCJxdWVyeSIsIndjYXBmUmVtb3ZlUXVlcnlTdHJpbmdQYXJhbWV0ZXIiLCJoaXN0b3J5IiwicHVzaFN0YXRlIiwiZmlsdGVyVmFsU3RyaW5nIiwid2NhcGZVcGRhdGVRdWVyeVN0cmluZ1BhcmFtZXRlciIsIndjYXBmRmlsdGVyUHJvZHVjdHMiLCJjbGVhclRpbWVvdXQiLCJkYXRhIiwic2V0VGltZW91dCIsInJlbW92ZURhdGEiLCJldmVudCIsInByZXZlbnREZWZhdWx0IiwiJGlucHV0Iiwic2V0IiwiZ2V0Iiwid2NhcGZCZWZvcmVVcGRhdGUiLCJ0cmlnZ2VyIiwid2NhcGZBZnRlclVwZGF0ZSIsIndpbmRvdyIsImxvY2F0aW9uIiwiaHJlZiIsIiRkYXRhIiwiJHNob3BMb29wQ29udGFpbmVyIiwic2hvcF9sb29wX2NvbnRhaW5lciIsIiRub3RGb3VuZENvbnRhaW5lciIsIm5vdF9mb3VuZF9jb250YWluZXIiLCJmaWVsZElEIiwiX2ZpZWxkIiwiZmllbGRDbGFzcyIsImN1c3RvbV9zY3JpcHRzIiwiZXZhbCIsIndjYXBmR2V0VXJsVmFycyIsInVybCIsInZhcnMiLCJoYXNoIiwiaGFzaGVzIiwic2xpY2UiLCJpbmRleE9mIiwiaExlbmd0aCIsImkiLCJ3Y2FwZkZpeFBhZ2luYXRpb24iLCJwYXJhbXMiLCJjdXJyZW50UGFnZUluVXJsIiwiY3VycmVudFBhZ2VJblBhcmFtcyIsImtleSIsInZhbHVlIiwicHVzaEhpc3RvcnkiLCJyZSIsIlJlZ0V4cCIsInNlcGFyYXRvciIsInVybFdpdGhRdWVyeSIsIm1hdGNoIiwib2xkUGFyYW1zIiwib2xkUGFyYW1zTGVuZ3RoIiwiT2JqZWN0Iiwia2V5cyIsInN0YXJ0UG9zaXRpb24iLCJmaWx0ZXJLZXlQb3NpdGlvbiIsImNsZWFuVXJsIiwiY2xlYW5RdWVyeSIsIm5ld1BhcmFtcyIsIndjYXBmTWFrZVBhcmFtZXRlcnMiLCJmaWx0ZXJWYWx1ZSIsIm5leHRWYWx1ZXMiLCJlbXB0eVZhbHVlIiwicHJldlZhbHVlcyIsInByZXZWYWx1ZXNBcnJheSIsImZvdW5kIiwiaW5BcnJheSIsInNwbGljZSIsInB1c2giLCJ3Y2FwZlNpbmdsZUZpbHRlciIsImhhbmRsZUZpbHRlclJlcXVlc3QiLCJjbG9zZXN0IiwiZmllbGREYXRhIiwidG9TdHJpbmciLCIkcmFuZ2VOdW1iZXIiLCJiaW5kIl0sIm1hcHBpbmdzIjoiOztBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQUEsTUFBTSxDQUFFQyxRQUFGLENBQU4sQ0FBbUJDLEtBQW5CLENBQTBCLFVBQVVDLENBQVYsRUFBYyxDQUl2QyxDQUpEOzs7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUEsSUFBTUMsWUFBWSxHQUFHQSxZQUFZLElBQUk7QUFDcEMseUJBQXVCLEVBRGE7QUFFcEMseUJBQXVCLEVBRmE7QUFHcEMsMEJBQXdCLEVBSFk7QUFHUjtBQUM1QixxQkFBbUIsRUFKaUI7QUFJYjtBQUN2QixtQkFBaUIsRUFMbUI7QUFLZjtBQUNyQiwwQkFBd0IsRUFOWTtBQU1SO0FBQzVCLG9CQUFrQixFQVBrQjtBQVFwQywwQkFBd0I7QUFSWSxDQUFyQztBQVdBSixNQUFNLENBQUVDLFFBQUYsQ0FBTixDQUFtQkMsS0FBbkIsQ0FDQyxVQUFVQyxDQUFWLEVBQWM7QUFFYjtBQUNBLE1BQUssT0FBT0MsWUFBUCxLQUF3QixXQUE3QixFQUEyQztBQUMxQyxXQUFPLEtBQVA7QUFDQTs7QUFFRCxNQUFNQyxLQUFLLEdBQUcsR0FBZCxDQVBhLENBT007QUFFbkI7O0FBQ0EsTUFBTUMsTUFBTSxHQUFHLEVBQWY7QUFFQSxNQUFNQyxtQkFBbUIsR0FBR0osQ0FBQyxDQUFFLHNCQUFGLENBQTdCO0FBQ0EsTUFBTUssaUJBQWlCLEdBQUtMLENBQUMsQ0FBRSx5QkFBRixDQUE3QjtBQUVBSyxFQUFBQSxpQkFBaUIsQ0FBQ0MsSUFBbEIsQ0FDQyxZQUFXO0FBQ1YsUUFBTUMsTUFBTSxHQUFXUCxDQUFDLENBQUUsSUFBRixDQUF4QjtBQUNBLFFBQU1RLEVBQUUsR0FBZUQs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QUN0REEsUUFBQUEsUUFBUSxHQUFHRCxRQUFYO0FBRUE0RixRQUFBQSxZQUFZLENBQUNySSxJQUFiLENBQW1CLFlBQW5CLEVBQWtDc0QsR0FBbEMsQ0FBdUNaLFFBQXZDO0FBQ0E7O0FBRUQsVUFBS0QsUUFBUSxLQUFLUCxhQUFiLElBQThCUSxRQUFRLEtBQUtOLGFBQWhELEVBQWdFO0FBQy9ELFlBQU1vQixLQUFLLEdBQUdDLCtCQUErQixDQUFFOUQsU0FBRixDQUE3QztBQUNBK0QsUUFBQUEsT0FBTyxDQUFDQyxTQUFSLENBQW1CLEVBQW5CLEVBQXVCLEVBQXZCLEVBQTJCSCxLQUEzQjtBQUNBLE9BSEQsTUFHTztBQUNOLFlBQU1JLGVBQWUsR0FBR25CLFFBQVEsR0FBRyxHQUFYLEdBQWlCQyxRQUF6QztBQUNBbUIsUUFBQUEsK0JBQStCLENBQUVsRSxTQUFGLEVBQWFpRSxlQUFiLENBQS9CO0FBQ0EsT0E5QjBDLENBZ0MzQzs7O0FBQ0FFLE1BQUFBLG1CQUFtQjtBQUNuQixLQWxDOEIsRUFrQzVCN0UsS0FsQzRCLENBQS9CO0FBbUNBLEdBOUNGLEVBeGlCYSxDQXlsQmI7O0FBQ0FGLEVBQUFBLENBQUMsQ0FBRTRGLE1BQUYsQ0FBRCxDQUFZMkQsSUFBWixDQUFrQixVQUFsQixFQUE4QixZQUFXO0FBQ3hDO0FBQ0F4RSxJQUFBQSxtQkFBbUI7QUFDbkIsR0FIRDtBQUtBLENBaG1CRiIsImZpbGUiOiJ3Yy1hamF4LXByb2R1Y3QtZmlsdGVyLXB1YmxpYy1zY3JpcHRzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBEaXNwbGF5IHR5cGUgZmllbGRzLlxuICpcbiAqIEBzaW5jZSAgICAgIDMuMC4wXG4gKiBAcGFja2FnZSAgICB3Yy1hamF4LXByb2R1Y3QtZmlsdGVyXG4gKiBAc3VicGFja2FnZSB3Yy1hamF4LXByb2R1Y3QtZmlsdGVyL2FkbWluL3NyYy9qc1xuICogQGF1dGhvciAgICAgTWFpbnVsIEhhc3NhbiBNYWluXG4gKi9cblxualF1ZXJ5KCBkb2N1bWVudCApLnJlYWR5KCBmdW5jdGlvbiggJCApIHtcblxuXG5cbn0gKTtcbiIsIi8qKlxuICogVGhlIGZyb250ZW5kIGZpbHRlciBmb3JtLlxuICpcbiAqIEBzaW5jZSAgICAgIDMuMC4wXG4gKiBAcGFja2FnZSAgICB3Yy1hamF4LXByb2R1Y3QtZmlsdGVyXG4gKiBAc3VicGFja2FnZSB3Yy1hamF4LXByb2R1Y3QtZmlsdGVyL3B1YmxpYy9zcmMvanNcbiAqIEBhdXRob3IgICAgIE1haW51bCBIYXNzYW4gTWFpblxuICovXG5cbmNvbnN0IHdjYXBmX3BhcmFtcyA9IHdjYXBmX3BhcmFtcyB8fCB7XG5cdCdzaG9wX2xvb3BfY29udGFpbmVyJzogJycsXG5cdCdub3RfZm91bmRfY29udGFpbmVyJzogJycsXG5cdCdwYWdpbmF0aW9uX2NvbnRhaW5lcic6ICcnLCAvLyB0b2RvXG5cdCdzb3J0aW5nX2NvbnRyb2wnOiAnJywgLy8gdG9kb1xuXHQnc2Nyb2xsX3RvX3RvcCc6ICcnLCAvLyB0b2RvXG5cdCdzY3JvbGxfdG9fdG9wX29mZnNldCc6ICcnLCAvLyB0b2RvXG5cdCdjdXN0b21fc2NyaXB0cyc6ICcnLFxuXHQnZmlsdGVyX3JlbGF0aW9uc2hpcHMnOiAnJyxcbn07XG5cbmpRdWVyeSggZG9jdW1lbnQgKS5yZWFkeShcblx0ZnVuY3Rpb24oICQgKSB7XG5cblx0XHQvLyByZXR1cm4gZmFsc2UgaWYgd2NhcGZfcGFyYW1zIHZhcmlhYmxlIGlzIG5vdCBmb3VuZFxuXHRcdGlmICggdHlwZW9mIHdjYXBmX3BhcmFtcyA9PT0gJ3VuZGVmaW5lZCcgKSB7XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fVxuXG5cdFx0Y29uc3QgZGVsYXkgPSA4MDA7IC8vIHRvZG86IG9wdGlvbiB0byBjaGFuZ2VcblxuXHRcdC8vIHN0b3JlIGZpZWxkcycgaWQgYW5kIGZpbHRlciBpbmZvcm1hdGlvblxuXHRcdGNvbnN0IGZpZWxkcyA9IHt9O1xuXG5cdFx0Y29uc3QgJHdjYXBmU2luZ2xlRmlsdGVycyA9ICQoICcud2NhcGYtc2luZ2xlLWZpbHRlcicgKTtcblx0XHRjb25zdCAkd2NhcGZUZXJtRmlsdGVycyAgID0gJCggJy53Y2FwZi1hamF4LXRlcm0tZmlsdGVyJyApO1xuXG5cdFx0JHdjYXBmVGVybUZpbHRlcnMuZWFjaChcblx0XHRcdGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRjb25zdCAkZmllbGQgICAgICAgICA9ICQoIHRoaXMgKTtcblx0XHRcdFx0Y29uc3QgaWQgICAgICAgICAgICAgPSAkZmllbGQuYXR0ciggJ2RhdGEtaWQnICk7XG5cdFx0XHRcdGNvbnN0ICR3cmFwcGVyICAgICAgID0gJGZpZWxkLmNoaWxkcmVuKCAnZGl2JyApO1xuXHRcdFx0XHRjb25zdCBmaWx0ZXJLZXkgICAgICA9ICR3cmFwcGVyLmF0dHIoICdkYXRhLWZpbHRlci1rZXknICk7XG5cdFx0XHRcdGNvbnN0IG11bHRpcGxlRmlsdGVyID0gcGFyc2VJbnQoICR3cmFwcGVyLmF0dHIoICdkYXRhLW11bHRpcGxlLWZpbHRlcicgKSApO1xuXG5cdFx0XHRcdGZpZWxkc1sgaWQgXSA9IHtcblx0XHRcdFx0XHRmaWx0ZXJLZXk6IGZpbHRlcktleSxcblx0XHRcdFx0XHRtdWx0aXBsZUZpbHRlcjogbXVsdGlwbGVGaWx0ZXJcblx0XHRcdFx0fTtcblx0XHRcdH1cblx0XHQpO1xuXG5cdFx0Ly8gSW5pdGlhbGl6ZSBqUXVlcnkgY2hvc2VuIGxpYnJhcnlcblx0XHRmdW5jdGlvbiBpbml0Q2hvc2VuKCkge1xuXHRcdFx0aWYgKCAhIGpRdWVyeSgpLmNob3NlbiApIHtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXG5cdFx0XHQkd2NhcGZUZXJtRmlsdGVycy5maW5kKCAnLndjYXBmLWNob3Nlbi1zZWxlY3QnICkuZWFjaCggZnVuY3Rpb24oKSB7XG5cdFx0XHRcdGNvbnN0ICR0aGlzICAgPSAkKCB0aGlzICk7XG5cdFx0XHRcdGNvbnN0IG9wdGlvbnMgPSB7fTtcblxuXHRcdFx0XHRjb25zdCBub1Jlc3VsdHNNZXNzYWdlID0gJHRoaXMuYXR0ciggJ2RhdGEtbm8tcmVzdWx0cy1tZXNzYWdlJyApO1xuXG5cdFx0XHRcdGlmICggbm9SZXN1bHRzTWVzc2FnZSApIHtcblx0XHRcdFx0XHRvcHRpb25zWyAnbm9fcmVzdWx0c190ZXh0JyBdID0gbm9SZXN1bHRzTWVzc2FnZTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdCR0aGlzLmNob3Nlbiggb3B0aW9ucyApO1xuXHRcdFx0fSApO1xuXHRcdH1cblxuXHRcdGluaXRDaG9zZW4oKTtcblxuXHRcdC8vIEluaXRpYWxpemUgaGllcmFyY2h5IGFjY29yZGlvblxuXHRcdGZ1bmN0aW9uIGluaXRIaWVyYXJjaHlBY2NvcmRpb24oKSB7XG5cdFx0XHQkd2NhcGZUZXJtRmlsdGVycy5maW5kKCAnLmhpZXJhcmNoeS1hY2NvcmRpb24tdG9nZ2xlJyApLm9uKCAnY2xpY2snLCBmdW5jdGlvbigpIHtcblx0XHRcdFx0JCggdGhpcyApLnRvZ2dsZUNsYXNzKCAnYWN0aXZlJyApO1xuXHRcdFx0fSApO1xuXHRcdH1cblxuXHRcdGluaXRIaWVyYXJjaHlBY2NvcmRpb24oKTtcblxuXHRcdC8qKlxuXHRcdCAqIEBzb3VyY2UgaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9hLzM0MTQxODEzXG5cdFx0ICpcblx0XHQgKiBAcGFyYW0gbnVtYmVyXG5cdFx0ICogQHBhcmFtIGRlY2ltYWxzXG5cdFx0ICogQHBhcmFtIGRlY19wb2ludFxuXHRcdCAqIEBwYXJhbSB0aG91c2FuZHNfc2VwXG5cdFx0ICpcblx0XHQgKiBAcmV0dXJucyB7c3RyaW5nfVxuXHRcdCAqL1xuXHRcdGZ1bmN0aW9uIG51bWJlcl9mb3JtYXQoIG51bWJlciwgZGVjaW1hbHMsIGRlY19wb2ludCwgdGhvdXNhbmRzX3NlcCApIHtcblx0XHRcdC8vIFN0cmlwIGFsbCBjaGFyYWN0ZXJzIGJ1dCBudW1lcmljYWwgb25lcy5cblx0XHRcdG51bWJlciA9ICggbnVtYmVyICsgJycgKS5yZXBsYWNlKCAvW14wLTkrXFwtRWUuXS9nLCAnJyApO1xuXG5cdFx0XHRjb25zdCBuICAgID0gISBpc0Zpbml0ZSggK251bWJlciApID8gMCA6ICtudW1iZXI7XG5cdFx0XHRjb25zdCBwcmVjID0gISBpc0Zpbml0ZSggK2RlY2ltYWxzICkgPyAwIDogTWF0aC5hYnMoIGRlY2ltYWxzICk7XG5cdFx0XHRjb25zdCBzZXAgID0gKCB0eXBlb2YgdGhvdXNhbmRzX3NlcCA9PT0gJ3VuZGVmaW5lZCcgKSA/ICcsJyA6IHRob3VzYW5kc19zZXA7XG5cdFx0XHRjb25zdCBkZWMgID0gKCB0eXBlb2YgZGVjX3BvaW50ID09PSAndW5kZWZpbmVkJyApID8gJy4nIDogZGVjX3BvaW50O1xuXG5cdFx0XHRsZXQgcztcblxuXHRcdFx0Y29uc3QgdG9GaXhlZEZpeCA9IGZ1bmN0aW9uKCBuLCBwcmVjICkge1xuXHRcdFx0XHRjb25zdCBrID0gTWF0aC5wb3coIDEwLCBwcmVjICk7XG5cdFx0XHRcdHJldHVybiAnJyArIE1hdGgucm91bmQoIG4gKiBrICkgLyBrO1xuXHRcdFx0fTtcblxuXHRcdFx0Ly8gRml4IGZvciBJRSBwYXJzZUZsb2F0KDAuNTUpLnRvRml4ZWQoMCkgPSAwO1xuXHRcdFx0cyA9ICggcHJlYyA/IHRvRml4ZWRGaXgoIG4sIHByZWMgKSA6ICcnICsgTWF0aC5yb3VuZCggbiApICkuc3BsaXQoICcuJyApO1xuXG5cdFx0XHRpZiAoIHNbIDAgXS5sZW5ndGggPiAzICkge1xuXHRcdFx0XHRzWyAwIF0gPSBzWyAwIF0ucmVwbGFjZSggL1xcQig/PSg/OlxcZHszfSkrKD8hXFxkKSkvZywgc2VwICk7XG5cdFx0XHR9XG5cblx0XHRcdGlmICggKCBzWyAxIF0gfHwgJycgKS5sZW5ndGggPCBwcmVjICkge1xuXHRcdFx0XHRzWyAxIF0gPSBzWyAxIF0gfHwgJyc7XG5cdFx0XHRcdHNbIDEgXSArPSBuZXcgQXJyYXkoIHByZWMgLSBzWyAxIF0ubGVuZ3RoICsgMSApLmpvaW4oICcwJyApO1xuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gcy5qb2luKCBkZWMgKTtcblx0XHR9XG5cblx0XHQvLyBJbml0aWFsaXplIG5vVUlTbGlkZXJcblx0XHRmdW5jdGlvbiBpbml0Tm9VSVNsaWRlcigpIHtcblx0XHRcdCR3Y2FwZlNpbmdsZUZpbHRlcnMuZmluZCggJy53Y2FwZi1yYW5nZS1zbGlkZXInICkuZWFjaCggZnVuY3Rpb24oKSB7XG5cdFx0XHRcdGNvbnN0ICRpdGVtID0gJCggdGhpcyApO1xuXG5cdFx0XHRcdGNvbnN0IGZpbHRlcktleSAgICAgICAgID0gJGl0ZW0uYXR0ciggJ2RhdGEtZmlsdGVyLWtleScgKTtcblx0XHRcdFx0Y29uc3QgJHNsaWRlciAgICAgICAgICAgPSAkaXRlbS5maW5kKCAnLndjYXBmLW5vdWktc2xpZGVyJyApO1xuXHRcdFx0XHRjb25zdCBzbGlkZXJJZCAgICAgICAgICA9ICRzbGlkZXIuYXR0ciggJ2lkJyApO1xuXHRcdFx0XHRjb25zdCBkaXNwbGF5VmFsdWVzQXMgICA9ICRpdGVtLmF0dHIoICdkYXRhLWRpc3BsYXktdmFsdWVzLWFzJyApO1xuXHRcdFx0XHRjb25zdCByYW5nZU1pblZhbHVlICAgICA9IHBhcnNlRmxvYXQoICRpdGVtLmF0dHIoICdkYXRhLXJhbmdlLW1pbi12YWx1ZScgKSApO1xuXHRcdFx0XHRjb25zdCByYW5nZU1heFZhbHVlICAgICA9IHBhcnNlRmxvYXQoICRpdGVtLmF0dHIoICdkYXRhLXJhbmdlLW1heC12YWx1ZScgKSApO1xuXHRcdFx0XHRjb25zdCBzdGVwICAgICAgICAgICAgICA9IHBhcnNlRmxvYXQoICRpdGVtLmF0dHIoICdkYXRhLXN0ZXAnICkgKTtcblx0XHRcdFx0Y29uc3QgZGVjaW1hbFBsYWNlcyAgICAgPSAkaXRlbS5hdHRyKCAnZGF0YS1kZWNpbWFsLXBsYWNlcycgKTtcblx0XHRcdFx0Y29uc3QgdGhvdXNhbmRTZXBhcmF0b3IgPSAkaXRlbS5hdHRyKCAnZGF0YS10aG91c2FuZC1zZXBhcmF0b3InICk7XG5cdFx0XHRcdGNvbnN0IGRlY2ltYWxTZXBhcmF0b3IgID0gJGl0ZW0uYXR0ciggJ2RhdGEtZGVjaW1hbC1zZXBhcmF0b3InICk7XG5cdFx0XHRcdGNvbnN0IG1pblZhbHVlICAgICAgICAgID0gcGFyc2VGbG9hdCggJGl0ZW0uYXR0ciggJ2RhdGEtbWluLXZhbHVlJyApICk7XG5cdFx0XHRcdGNvbnN0IG1heFZhbHVlICAgICAgICAgID0gcGFyc2VGbG9hdCggJGl0ZW0uYXR0ciggJ2RhdGEtbWF4LXZhbHVlJyApICk7XG5cdFx0XHRcdGNvbnN0ICRtaW5WYWx1ZSAgICAgICAgID0gJGl0ZW0uZmluZCggJy5taW4tdmFsdWUnICk7XG5cdFx0XHRcdGNvbnN0ICRtYXhWYWx1ZSAgICAgICAgID0gJGl0ZW0uZmluZCggJy5tYXgtdmFsdWUnICk7XG5cblx0XHRcdFx0aWYgKCAndW5kZWZpbmVkJyA9PT0gdHlwZW9mIG5vVWlTbGlkZXIgKSB7XG5cdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0Y29uc3Qgc2xpZGVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoIHNsaWRlcklkICk7XG5cblx0XHRcdFx0bm9VaVNsaWRlci5jcmVhdGUoIHNsaWRlciwge1xuXHRcdFx0XHRcdHN0YXJ0OiBbIG1pblZhbHVlLCBtYXhWYWx1ZSBdLFxuXHRcdFx0XHRcdHN0ZXAsXG5cdFx0XHRcdFx0Y29ubmVjdDogdHJ1ZSxcblx0XHRcdFx0XHRyYW5nZToge1xuXHRcdFx0XHRcdFx0J21pbic6IHJhbmdlTWluVmFsdWUsXG5cdFx0XHRcdFx0XHQnbWF4JzogcmFuZ2VNYXhWYWx1ZSxcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0gKTtcblxuXHRcdFx0XHRzbGlkZXIubm9VaVNsaWRlci5vbiggJ3VwZGF0ZScsIGZ1bmN0aW9uKCB2YWx1ZXMgKSB7XG5cdFx0XHRcdFx0Y29uc3QgbWluVmFsdWUgPSBudW1iZXJfZm9ybWF0KCB2YWx1ZXNbIDAgXSwgZGVjaW1hbFBsYWNlcywgZGVjaW1hbFNlcGFyYXRvciwgdGhvdXNhbmRTZXBhcmF0b3IgKTtcblx0XHRcdFx0XHRjb25zdCBtYXhWYWx1ZSA9IG51bWJlcl9mb3JtYXQoIHZhbHVlc1sgMSBdLCBkZWNpbWFsUGxhY2VzLCBkZWNpbWFsU2VwYXJhdG9yLCB0aG91c2FuZFNlcGFyYXRvciApO1xuXG5cdFx0XHRcdFx0aWYgKCAncGxhaW5fdGV4dCcgPT09IGRpc3BsYXlWYWx1ZXNBcyApIHtcblx0XHRcdFx0XHRcdCRtaW5WYWx1ZS5odG1sKCBtaW5WYWx1ZSApO1xuXHRcdFx0XHRcdFx0JG1heFZhbHVlLmh0bWwoIG1heFZhbHVlICk7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdCRtaW5WYWx1ZS52YWwoIG1pblZhbHVlICk7XG5cdFx0XHRcdFx0XHQkbWF4VmFsdWUudmFsKCBtYXhWYWx1ZSApO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSApO1xuXG5cdFx0XHRcdGZ1bmN0aW9uIGZpbHRlclByb2R1Y3RzQWNjb3JkaW5nVG9TbGlkZXIoIHZhbHVlcyApIHtcblx0XHRcdFx0XHRjb25zdCBtaW5WYWx1ZSA9IHBhcnNlRmxvYXQoIHZhbHVlc1sgMCBdICk7XG5cdFx0XHRcdFx0Y29uc3QgbWF4VmFsdWUgPSBwYXJzZUZsb2F0KCB2YWx1ZXNbIDEgXSApO1xuXG5cdFx0XHRcdFx0aWYgKCBtaW5WYWx1ZSA9PT0gcmFuZ2VNaW5WYWx1ZSAmJiBtYXhWYWx1ZSA9PT0gcmFuZ2VNYXhWYWx1ZSApIHtcblx0XHRcdFx0XHRcdGNvbnN0IHF1ZXJ5ID0gd2NhcGZSZW1vdmVRdWVyeVN0cmluZ1BhcmFtZXRlciggZmlsdGVyS2V5ICk7XG5cdFx0XHRcdFx0XHRoaXN0b3J5LnB1c2hTdGF0ZSgge30sICcnLCBxdWVyeSApO1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRjb25zdCBmaWx0ZXJWYWxTdHJpbmcgPSBtaW5WYWx1ZSArICcrJyArIG1heFZhbHVlO1xuXHRcdFx0XHRcdFx0d2NhcGZVcGRhdGVRdWVyeVN0cmluZ1BhcmFtZXRlciggZmlsdGVyS2V5LCBmaWx0ZXJWYWxTdHJpbmcgKTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHQvLyBmaWx0ZXIgcHJvZHVjdHNcblx0XHRcdFx0XHR3Y2FwZkZpbHRlclByb2R1Y3RzKCk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRzbGlkZXIubm9VaVNsaWRlci5vbiggJ2VuZCcsIGZ1bmN0aW9uKCB2YWx1ZXMgKSB7XG5cdFx0XHRcdFx0Ly8gQ2xlYXIgYW55IHByZXZpb3VzbHkgc2V0IHRpbWVyIGJlZm9yZSBzZXR0aW5nIGEgZnJlc2ggb25lXG5cdFx0XHRcdFx0Y2xlYXJUaW1lb3V0KCAkaXRlbS5kYXRhKCAndGltZXInICkgKTtcblxuXHRcdFx0XHRcdCRpdGVtLmRhdGEoICd0aW1lcicsIHNldFRpbWVvdXQoIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdFx0JGl0ZW0ucmVtb3ZlRGF0YSggJ3RpbWVyJyApO1xuXG5cdFx0XHRcdFx0XHRmaWx0ZXJQcm9kdWN0c0FjY29yZGluZ1RvU2xpZGVyKCB2YWx1ZXMgKTtcblx0XHRcdFx0XHR9LCBkZWxheSApICk7XG5cdFx0XHRcdH0gKTtcblxuXHRcdFx0XHQkbWluVmFsdWUub24oICdpbnB1dCcsIGZ1bmN0aW9uKCBldmVudCApIHtcblx0XHRcdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXG5cdFx0XHRcdFx0Y29uc3QgJGlucHV0ID0gJCggdGhpcyApO1xuXG5cdFx0XHRcdFx0Ly8gQ2xlYXIgYW55IHByZXZpb3VzbHkgc2V0IHRpbWVyIGJlZm9yZSBzZXR0aW5nIGEgZnJlc2ggb25lXG5cdFx0XHRcdFx0Y2xlYXJUaW1lb3V0KCAkaW5wdXQuZGF0YSggJ3RpbWVyJyApICk7XG5cblx0XHRcdFx0XHQkaW5wdXQuZGF0YSggJ3RpbWVyJywgc2V0VGltZW91dCggZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0XHQkaW5wdXQucmVtb3ZlRGF0YSggJ3RpbWVyJyApO1xuXG5cdFx0XHRcdFx0XHRjb25zdCBtaW5WYWx1ZSA9ICRpbnB1dC52YWwoKTtcblxuXHRcdFx0XHRcdFx0c2xpZGVyLm5vVWlTbGlkZXIuc2V0KCBbIG1pblZhbHVlLCBudWxsIF0gKTtcblxuXHRcdFx0XHRcdFx0ZmlsdGVyUHJvZHVjdHNBY2NvcmRpbmdUb1NsaWRlciggc2xpZGVyLm5vVWlTbGlkZXIuZ2V0KCkgKTtcblx0XHRcdFx0XHR9LCBkZWxheSApICk7XG5cdFx0XHRcdH0gKTtcblxuXHRcdFx0XHQkbWF4VmFsdWUub24oICdpbnB1dCcsIGZ1bmN0aW9uKCBldmVudCApIHtcblx0XHRcdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXG5cdFx0XHRcdFx0Y29uc3QgJGlucHV0ID0gJCggdGhpcyApO1xuXG5cdFx0XHRcdFx0Ly8gQ2xlYXIgYW55IHByZXZpb3VzbHkgc2V0IHRpbWVyIGJlZm9yZSBzZXR0aW5nIGEgZnJlc2ggb25lXG5cdFx0XHRcdFx0Y2xlYXJUaW1lb3V0KCAkaW5wdXQuZGF0YSggJ3RpbWVyJyApICk7XG5cblx0XHRcdFx0XHQkaW5wdXQuZGF0YSggJ3RpbWVyJywgc2V0VGltZW91dCggZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0XHQkaW5wdXQucmVtb3ZlRGF0YSggJ3RpbWVyJyApO1xuXG5cdFx0XHRcdFx0XHRjb25zdCBtYXhWYWx1ZSA9ICRpbnB1dC52YWwoKTtcblxuXHRcdFx0XHRcdFx0c2xpZGVyLm5vVWlTbGlkZXIuc2V0KCBbIG51bGwsIG1heFZhbHVlIF0gKTtcblxuXHRcdFx0XHRcdFx0ZmlsdGVyUHJvZHVjdHNBY2NvcmRpbmdUb1NsaWRlciggc2xpZGVyLm5vVWlTbGlkZXIuZ2V0KCkgKTtcblx0XHRcdFx0XHR9LCBkZWxheSApICk7XG5cdFx0XHRcdH0gKTtcblx0XHRcdH0gKTtcblx0XHR9XG5cblx0XHRpbml0Tm9VSVNsaWRlcigpO1xuXG5cdFx0Ly8gc2hvdyBhIGxvYWRpbmcgaW5kaWNhdG9yXG5cdFx0ZnVuY3Rpb24gd2NhcGZCZWZvcmVVcGRhdGUoKSB7XG5cdFx0XHQkKCAnYm9keScgKS50cmlnZ2VyKCAnd2NhcGZfYmVmb3JlX3VwZGF0ZScgKTtcblx0XHR9XG5cblx0XHQvLyBzY3JvbGwgdG8gdG9wXG5cdFx0ZnVuY3Rpb24gd2NhcGZBZnRlclVwZGF0ZSgpIHtcblx0XHRcdGluaXRDaG9zZW4oKTtcblx0XHRcdGluaXRIaWVyYXJjaHlBY2NvcmRpb24oKTtcblxuXHRcdFx0JCggJ2JvZHknICkudHJpZ2dlciggJ3djYXBmX2FmdGVyX3VwZGF0ZScgKTtcblx0XHR9XG5cblx0XHQvLyBmaWx0ZXIgdGhlIHByb2R1Y3RzXG5cdFx0ZnVuY3Rpb24gd2NhcGZGaWx0ZXJQcm9kdWN0cygpIHtcblx0XHRcdHdjYXBmQmVmb3JlVXBkYXRlKCk7XG5cblx0XHRcdCQuZ2V0KFxuXHRcdFx0XHR3aW5kb3cubG9jYXRpb24uaHJlZixcblx0XHRcdFx0ZnVuY3Rpb24oIGRhdGEgKSB7XG5cdFx0XHRcdFx0Y29uc3QgJGRhdGEgPSAkKCBkYXRhICk7XG5cblx0XHRcdFx0XHRjb25zdCAkc2hvcExvb3BDb250YWluZXIgPSAkZGF0YS5maW5kKCB3Y2FwZl9wYXJhbXMuc2hvcF9sb29wX2NvbnRhaW5lciApO1xuXHRcdFx0XHRcdGNvbnN0ICRub3RGb3VuZENvbnRhaW5lciA9ICRkYXRhLmZpbmQoIHdjYXBmX3BhcmFtcy5ub3RfZm91bmRfY29udGFpbmVyICk7XG5cblx0XHRcdFx0XHQvLyByZXBsYWNlIGZpZWxkcycgZGF0YSB3aXRoIG5ldyBkYXRhXG5cdFx0XHRcdFx0JC5lYWNoKFxuXHRcdFx0XHRcdFx0ZmllbGRzLFxuXHRcdFx0XHRcdFx0ZnVuY3Rpb24oIGlkICkge1xuXHRcdFx0XHRcdFx0XHRjb25zdCBmaWVsZElEICAgID0gJ1tkYXRhLWlkPVwiJyArIGlkICsgJ1wiXSc7XG5cdFx0XHRcdFx0XHRcdGNvbnN0ICRmaWVsZCAgICAgPSAkKCBmaWVsZElEICk7XG5cdFx0XHRcdFx0XHRcdGNvbnN0IF9maWVsZCAgICAgPSAkZGF0YS5maW5kKCBmaWVsZElEICk7XG5cdFx0XHRcdFx0XHRcdGNvbnN0IGZpZWxkQ2xhc3MgPSAkKCBfZmllbGQgKS5hdHRyKCAnY2xhc3MnICk7XG5cblx0XHRcdFx0XHRcdFx0Ly8gdXBkYXRlIGNsYXNzXG5cdFx0XHRcdFx0XHRcdCRmaWVsZC5hdHRyKCAnY2xhc3MnLCBmaWVsZENsYXNzICk7XG5cblx0XHRcdFx0XHRcdFx0Ly8gdXBkYXRlIGZpZWxkXG5cdFx0XHRcdFx0XHRcdCRmaWVsZC5odG1sKCBfZmllbGQuaHRtbCgpICk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0KTtcblxuXHRcdFx0XHRcdC8vIHJlcGxhY2Ugb2xkIHNob3AgbG9vcCB3aXRoIG5ldyBvbmVcblx0XHRcdFx0XHRpZiAoIHdjYXBmX3BhcmFtcy5zaG9wX2xvb3BfY29udGFpbmVyID09PSB3Y2FwZl9wYXJhbXMubm90X2ZvdW5kX2NvbnRhaW5lciApIHtcblx0XHRcdFx0XHRcdCQoIHdjYXBmX3BhcmFtcy5zaG9wX2xvb3BfY29udGFpbmVyICkuaHRtbCggJHNob3BMb29wQ29udGFpbmVyLmh0bWwoKSApO1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRpZiAoICQoIHdjYXBmX3BhcmFtcy5ub3RfZm91bmRfY29udGFpbmVyICkubGVuZ3RoICkge1xuXHRcdFx0XHRcdFx0XHRpZiAoICRzaG9wTG9vcENvbnRhaW5lci5sZW5ndGggKSB7XG5cdFx0XHRcdFx0XHRcdFx0JCggd2NhcGZfcGFyYW1zLm5vdF9mb3VuZF9jb250YWluZXIgKS5odG1sKCAkc2hvcExvb3BDb250YWluZXIuaHRtbCgpICk7XG5cdFx0XHRcdFx0XHRcdH0gZWxzZSBpZiAoICRub3RGb3VuZENvbnRhaW5lci5sZW5ndGggKSB7XG5cdFx0XHRcdFx0XHRcdFx0JCggd2NhcGZfcGFyYW1zLm5vdF9mb3VuZF9jb250YWluZXIgKS5odG1sKCAkbm90Rm91bmRDb250YWluZXIuaHRtbCgpICk7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH0gZWxzZSBpZiAoICQoIHdjYXBmX3BhcmFtcy5zaG9wX2xvb3BfY29udGFpbmVyICkubGVuZ3RoICkge1xuXHRcdFx0XHRcdFx0XHRpZiAoICRzaG9wTG9vcENvbnRhaW5lci5sZW5ndGggKSB7XG5cdFx0XHRcdFx0XHRcdFx0JCggd2NhcGZfcGFyYW1zLnNob3BfbG9vcF9jb250YWluZXIgKS5odG1sKCAkc2hvcExvb3BDb250YWluZXIuaHRtbCgpICk7XG5cdFx0XHRcdFx0XHRcdH0gZWxzZSBpZiAoICRub3RGb3VuZENvbnRhaW5lci5sZW5ndGggKSB7XG5cdFx0XHRcdFx0XHRcdFx0JCggd2NhcGZfcGFyYW1zLnNob3BfbG9vcF9jb250YWluZXIgKS5odG1sKCAkbm90Rm91bmRDb250YWluZXIuaHRtbCgpICk7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHR3Y2FwZkFmdGVyVXBkYXRlKCk7XG5cblx0XHRcdFx0XHQvLyB0b2RvXG5cdFx0XHRcdFx0Ly8gcmVpbml0aWFsaXplIG9yZGVyaW5nXG5cdFx0XHRcdFx0Ly8gd2NhcGZJbml0T3JkZXIoKTtcblxuXHRcdFx0XHRcdC8vIHRvZG9cblx0XHRcdFx0XHQvLyByZWluaXRpYWxpemUgZHJvcGRvd24gZmlsdGVyXG5cdFx0XHRcdFx0Ly8gd2NhcGZEcm9wRG93bkZpbHRlcigpO1xuXG5cdFx0XHRcdFx0Ly8gcnVuIHNjcmlwdHMgYWZ0ZXIgc2hvcCBsb29wIHVuZGF0ZWRcblx0XHRcdFx0XHRpZiAoIHR5cGVvZiB3Y2FwZl9wYXJhbXMuY3VzdG9tX3NjcmlwdHMgIT09ICd1bmRlZmluZWQnICYmIHdjYXBmX3BhcmFtcy5jdXN0b21fc2NyaXB0cy5sZW5ndGggPiAwICkge1xuXHRcdFx0XHRcdFx0ZXZhbCggd2NhcGZfcGFyYW1zLmN1c3RvbV9zY3JpcHRzICk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHQpO1xuXHRcdH1cblxuXHRcdC8vIFVSTCBQYXJzZXJcblx0XHRmdW5jdGlvbiB3Y2FwZkdldFVybFZhcnMoIHVybCApIHtcblx0XHRcdGxldCB2YXJzID0ge30sIGhhc2g7XG5cblx0XHRcdGlmICggdHlwZW9mIHVybCA9PT0gJ3VuZGVmaW5lZCcgKSB7XG5cdFx0XHRcdHVybCA9IHdpbmRvdy5sb2NhdGlvbi5ocmVmO1xuXHRcdFx0fVxuXG5cdFx0XHRjb25zdCBoYXNoZXMgID0gdXJsLnNsaWNlKCB1cmwuaW5kZXhPZiggJz8nICkgKyAxICkuc3BsaXQoICcmJyApO1xuXHRcdFx0Y29uc3QgaExlbmd0aCA9IGhhc2hlcy5sZW5ndGg7XG5cblx0XHRcdGZvciAoIGxldCBpID0gMDsgaSA8IGhMZW5ndGg7IGkrKyApIHtcblx0XHRcdFx0aGFzaCA9IGhhc2hlc1sgaSBdLnNwbGl0KCAnPScgKTtcblxuXHRcdFx0XHR2YXJzWyBoYXNoWyAwIF0gXSA9IGhhc2hbIDEgXTtcblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuIHZhcnM7XG5cdFx0fVxuXG5cdFx0Ly8gZXZlcnl0aW1lIHdlIGFwcGx5IHRoZSBmaWx0ZXIgd2Ugc2V0IHRoZSBjdXJyZW50IHBhZ2UgdG8gMVxuXHRcdGZ1bmN0aW9uIHdjYXBmRml4UGFnaW5hdGlvbigpIHtcblx0XHRcdGxldCB1cmwgICAgICAgICAgICAgICAgPSB3aW5kb3cubG9jYXRpb24uaHJlZjtcblx0XHRcdGNvbnN0IHBhcmFtcyAgICAgICAgICAgPSB3Y2FwZkdldFVybFZhcnMoIHVybCApO1xuXHRcdFx0Y29uc3QgY3VycmVudFBhZ2VJblVybCA9IHBhcnNlSW50KCB1cmwucmVwbGFjZSggLy4rXFwvcGFnZVxcLyhcXGQrKSsvLCAnJDEnICkgKTtcblxuXHRcdFx0aWYgKCBjdXJyZW50UGFnZUluVXJsICkge1xuXHRcdFx0XHRpZiAoIGN1cnJlbnRQYWdlSW5VcmwgPiAxICkge1xuXHRcdFx0XHRcdHVybCA9IHVybC5yZXBsYWNlKCAvcGFnZVxcLyhcXGQrKS8sICdwYWdlLzEnICk7XG5cdFx0XHRcdH1cblx0XHRcdH0gZWxzZSBpZiAoIHR5cGVvZiBwYXJhbXNbICdwYWdlZCcgXSAhPT0gJ3VuZGVmaW5lZCcgKSB7XG5cdFx0XHRcdGNvbnN0IGN1cnJlbnRQYWdlSW5QYXJhbXMgPSBwYXJzZUludCggcGFyYW1zWyAncGFnZWQnIF0gKTtcblxuXHRcdFx0XHRpZiAoIGN1cnJlbnRQYWdlSW5QYXJhbXMgPiAxICkge1xuXHRcdFx0XHRcdHVybCA9IHVybC5yZXBsYWNlKCAncGFnZWQ9JyArIGN1cnJlbnRQYWdlSW5QYXJhbXMsICdwYWdlZD0xJyApO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiB1cmw7XG5cdFx0fVxuXG5cdFx0Ly8gdXBkYXRlIHF1ZXJ5IHN0cmluZyBmb3IgY2F0ZWdvcmllcywgbWV0YSBldGMuLlxuXHRcdGZ1bmN0aW9uIHdjYXBmVXBkYXRlUXVlcnlTdHJpbmdQYXJhbWV0ZXIoIGtleSwgdmFsdWUsIHB1c2hIaXN0b3J5LCB1cmwgKSB7XG5cdFx0XHRpZiAoIHR5cGVvZiBwdXNoSGlzdG9yeSA9PT0gJ3VuZGVmaW5lZCcgKSB7XG5cdFx0XHRcdHB1c2hIaXN0b3J5ID0gdHJ1ZTtcblx0XHRcdH1cblxuXHRcdFx0aWYgKCB0eXBlb2YgdXJsID09PSAndW5kZWZpbmVkJyApIHtcblx0XHRcdFx0dXJsID0gd2NhcGZGaXhQYWdpbmF0aW9uKCk7XG5cdFx0XHR9XG5cblx0XHRcdGNvbnN0IHJlICAgICAgICA9IG5ldyBSZWdFeHAoICcoWz8mXSknICsga2V5ICsgJz0uKj8oJnwkKScsICdpJyApO1xuXHRcdFx0Y29uc3Qgc2VwYXJhdG9yID0gdXJsLmluZGV4T2YoICc/JyApICE9PSAtMSA/ICcmJyA6ICc/Jztcblx0XHRcdGxldCB1cmxXaXRoUXVlcnk7XG5cblx0XHRcdGlmICggdXJsLm1hdGNoKCByZSApICkge1xuXHRcdFx0XHR1cmxXaXRoUXVlcnkgPSB1cmwucmVwbGFjZSggcmUsICckMScgKyBrZXkgKyAnPScgKyB2YWx1ZSArICckMicgKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHVybFdpdGhRdWVyeSA9IHVybCArIHNlcGFyYXRvciArIGtleSArICc9JyArIHZhbHVlO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAoIHB1c2hIaXN0b3J5ID09PSB0cnVlICkge1xuXHRcdFx0XHRyZXR1cm4gaGlzdG9yeS5wdXNoU3RhdGUoIHt9LCAnJywgdXJsV2l0aFF1ZXJ5ICk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRyZXR1cm4gdXJsV2l0aFF1ZXJ5O1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdC8vIHJlbW92ZSBwYXJhbWV0ZXIgZnJvbSB1cmxcblx0XHRmdW5jdGlvbiB3Y2FwZlJlbW92ZVF1ZXJ5U3RyaW5nUGFyYW1ldGVyKCBmaWx0ZXJLZXksIHVybCApIHtcblx0XHRcdGlmICggdHlwZW9mIHVybCA9PT0gJ3VuZGVmaW5lZCcgKSB7XG5cdFx0XHRcdHVybCA9IHdjYXBmRml4UGFnaW5hdGlvbigpO1xuXHRcdFx0fVxuXG5cdFx0XHRjb25zdCBvbGRQYXJhbXMgICAgICAgICA9IHdjYXBmR2V0VXJsVmFycyggdXJsICk7XG5cdFx0XHRjb25zdCBvbGRQYXJhbXNMZW5ndGggICA9IE9iamVjdC5rZXlzKCBvbGRQYXJhbXMgKS5sZW5ndGg7XG5cdFx0XHRjb25zdCBzdGFydFBvc2l0aW9uICAgICA9IHVybC5pbmRleE9mKCAnPycgKTtcblx0XHRcdGNvbnN0IGZpbHRlcktleVBvc2l0aW9uID0gdXJsLmluZGV4T2YoIGZpbHRlcktleSApO1xuXHRcdFx0bGV0IGNsZWFuVXJsLCBjbGVhblF1ZXJ5O1xuXG5cdFx0XHRpZiAoIG9sZFBhcmFtc0xlbmd0aCA+IDEgKSB7XG5cdFx0XHRcdGlmICggKCBmaWx0ZXJLZXlQb3NpdGlvbiAtIHN0YXJ0UG9zaXRpb24gKSA+IDEgKSB7XG5cdFx0XHRcdFx0Y2xlYW5VcmwgPSB1cmwucmVwbGFjZSggJyYnICsgZmlsdGVyS2V5ICsgJz0nICsgb2xkUGFyYW1zWyBmaWx0ZXJLZXkgXSwgJycgKTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRjbGVhblVybCA9IHVybC5yZXBsYWNlKCBmaWx0ZXJLZXkgKyAnPScgKyBvbGRQYXJhbXNbIGZpbHRlcktleSBdICsgJyYnLCAnJyApO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0Y29uc3QgbmV3UGFyYW1zID0gY2xlYW5Vcmwuc3BsaXQoICc/JyApO1xuXHRcdFx0XHRjbGVhblF1ZXJ5ICAgICAgPSAnPycgKyBuZXdQYXJhbXNbIDEgXTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGNsZWFuUXVlcnkgPSB1cmwucmVwbGFjZSggJz8nICsgZmlsdGVyS2V5ICsgJz0nICsgb2xkUGFyYW1zWyBmaWx0ZXJLZXkgXSwgJycgKTtcblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuIGNsZWFuUXVlcnk7XG5cdFx0fVxuXG5cdFx0Ly8gdGFrZSB0aGUga2V5IGFuZCB2YWx1ZSBhbmQgbWFrZSBxdWVyeVxuXHRcdGZ1bmN0aW9uIHdjYXBmTWFrZVBhcmFtZXRlcnMoIGZpbHRlcktleSwgZmlsdGVyVmFsdWUsIHVybCApIHtcblx0XHRcdGxldCBwYXJhbXMsIG5leHRWYWx1ZXMsIGVtcHR5VmFsdWUgPSBmYWxzZTtcblxuXHRcdFx0aWYgKCB0eXBlb2YgdXJsICE9PSAndW5kZWZpbmVkJyApIHtcblx0XHRcdFx0cGFyYW1zID0gd2NhcGZHZXRVcmxWYXJzKCB1cmwgKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHBhcmFtcyA9IHdjYXBmR2V0VXJsVmFycygpO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAoIHR5cGVvZiBwYXJhbXNbIGZpbHRlcktleSBdICE9ICd1bmRlZmluZWQnICkge1xuXHRcdFx0XHRjb25zdCBwcmV2VmFsdWVzICAgICAgPSBwYXJhbXNbIGZpbHRlcktleSBdO1xuXHRcdFx0XHRjb25zdCBwcmV2VmFsdWVzQXJyYXkgPSBwcmV2VmFsdWVzLnNwbGl0KCAnLCcgKTtcblxuXHRcdFx0XHRpZiAoIHByZXZWYWx1ZXMubGVuZ3RoID4gMCApIHtcblx0XHRcdFx0XHRjb25zdCBmb3VuZCA9ICQuaW5BcnJheSggZmlsdGVyVmFsdWUsIHByZXZWYWx1ZXNBcnJheSApO1xuXG5cdFx0XHRcdFx0aWYgKCBmb3VuZCA+PSAwICkge1xuXHRcdFx0XHRcdFx0Ly8gRWxlbWVudCB3YXMgZm91bmQsIHJlbW92ZSBpdC5cblx0XHRcdFx0XHRcdHByZXZWYWx1ZXNBcnJheS5zcGxpY2UoIGZvdW5kLCAxICk7XG5cblx0XHRcdFx0XHRcdGlmICggcHJldlZhbHVlc0FycmF5Lmxlbmd0aCA9PT0gMCApIHtcblx0XHRcdFx0XHRcdFx0ZW1wdHlWYWx1ZSA9IHRydWU7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdC8vIEVsZW1lbnQgd2FzIG5vdCBmb3VuZCwgYWRkIGl0LlxuXHRcdFx0XHRcdFx0cHJldlZhbHVlc0FycmF5LnB1c2goIGZpbHRlclZhbHVlICk7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0aWYgKCBwcmV2VmFsdWVzQXJyYXkubGVuZ3RoID4gMSApIHtcblx0XHRcdFx0XHRcdG5leHRWYWx1ZXMgPSBwcmV2VmFsdWVzQXJyYXkuam9pbiggJywnICk7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdG5leHRWYWx1ZXMgPSBwcmV2VmFsdWVzQXJyYXk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdG5leHRWYWx1ZXMgPSBmaWx0ZXJWYWx1ZTtcblx0XHRcdFx0fVxuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0bmV4dFZhbHVlcyA9IGZpbHRlclZhbHVlO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyB1cGRhdGUgdXJsIGFuZCBxdWVyeSBzdHJpbmdcblx0XHRcdGlmICggISBlbXB0eVZhbHVlICkge1xuXHRcdFx0XHR3Y2FwZlVwZGF0ZVF1ZXJ5U3RyaW5nUGFyYW1ldGVyKCBmaWx0ZXJLZXksIG5leHRWYWx1ZXMgKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGNvbnN0IHF1ZXJ5ID0gd2NhcGZSZW1vdmVRdWVyeVN0cmluZ1BhcmFtZXRlciggZmlsdGVyS2V5ICk7XG5cdFx0XHRcdGhpc3RvcnkucHVzaFN0YXRlKCB7fSwgJycsIHF1ZXJ5ICk7XG5cdFx0XHR9XG5cblx0XHRcdC8vIGZpbHRlciBwcm9kdWN0c1xuXHRcdFx0d2NhcGZGaWx0ZXJQcm9kdWN0cygpO1xuXHRcdH1cblxuXHRcdGZ1bmN0aW9uIHdjYXBmU2luZ2xlRmlsdGVyKCBmaWx0ZXJLZXksIGZpbHRlclZhbHVlICkge1xuXHRcdFx0Y29uc3QgcGFyYW1zID0gd2NhcGZHZXRVcmxWYXJzKCk7XG5cdFx0XHRsZXQgcXVlcnk7XG5cblx0XHRcdGlmICggdHlwZW9mIHBhcmFtc1sgZmlsdGVyS2V5IF0gIT09ICd1bmRlZmluZWQnICYmIHBhcmFtc1sgZmlsdGVyS2V5IF0gPT09IGZpbHRlclZhbHVlICkge1xuXHRcdFx0XHRxdWVyeSA9IHdjYXBmUmVtb3ZlUXVlcnlTdHJpbmdQYXJhbWV0ZXIoIGZpbHRlcktleSApO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0cXVlcnkgPSB3Y2FwZlVwZGF0ZVF1ZXJ5U3RyaW5nUGFyYW1ldGVyKCBmaWx0ZXJLZXksIGZpbHRlclZhbHVlLCBmYWxzZSApO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyB1cGRhdGUgdXJsXG5cdFx0XHRoaXN0b3J5LnB1c2hTdGF0ZSgge30sICcnLCBxdWVyeSApO1xuXG5cdFx0XHQvLyBmaWx0ZXIgcHJvZHVjdHNcblx0XHRcdHdjYXBmRmlsdGVyUHJvZHVjdHMoKTtcblx0XHR9XG5cblx0XHQvLyBUaGUgbWFpbiBmdW5jdGlvbiB0byBoYW5kbGUgdGhlIGZpbHRlciByZXF1ZXN0XG5cdFx0ZnVuY3Rpb24gaGFuZGxlRmlsdGVyUmVxdWVzdCggJGl0ZW0sIGZpbHRlclZhbHVlICkge1xuXHRcdFx0Y29uc3QgJGZpZWxkICAgICAgICAgPSAkaXRlbS5jbG9zZXN0KCAnLndjYXBmLXNpbmdsZS1maWx0ZXInICk7XG5cdFx0XHRjb25zdCBmaWVsZElEICAgICAgICA9ICRmaWVsZC5hdHRyKCAnZGF0YS1pZCcgKTtcblx0XHRcdGNvbnN0IGZpZWxkRGF0YSAgICAgID0gZmllbGRzWyBmaWVsZElEIF07XG5cdFx0XHRjb25zdCBmaWx0ZXJLZXkgICAgICA9IGZpZWxkRGF0YS5maWx0ZXJLZXk7XG5cdFx0XHRjb25zdCBtdWx0aXBsZUZpbHRlciA9IGZpZWxkRGF0YS5tdWx0aXBsZUZpbHRlcjtcblxuXHRcdFx0aWYgKCAhIGZpbHRlcktleSApIHtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAoICEgZmlsdGVyVmFsdWUubGVuZ3RoICkge1xuXHRcdFx0XHRjb25zdCBxdWVyeSA9IHdjYXBmUmVtb3ZlUXVlcnlTdHJpbmdQYXJhbWV0ZXIoIGZpbHRlcktleSApO1xuXHRcdFx0XHRoaXN0b3J5LnB1c2hTdGF0ZSgge30sICcnLCBxdWVyeSApO1xuXG5cdFx0XHRcdC8vIGZpbHRlciBwcm9kdWN0c1xuXHRcdFx0XHR3Y2FwZkZpbHRlclByb2R1Y3RzKCk7XG5cblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAoIG11bHRpcGxlRmlsdGVyICkge1xuXHRcdFx0XHR3Y2FwZk1ha2VQYXJhbWV0ZXJzKCBmaWx0ZXJLZXksIGZpbHRlclZhbHVlICk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHR3Y2FwZlNpbmdsZUZpbHRlciggZmlsdGVyS2V5LCBmaWx0ZXJWYWx1ZSApO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdC8vIGhhbmRsZSB0aGUgZmlsdGVyIHJlcXVlc3QgZm9yIGxpc3QgZmllbGRzXG5cdFx0JHdjYXBmVGVybUZpbHRlcnMub24oXG5cdFx0XHQnY2hhbmdlJyxcblx0XHRcdCcud2NhcGYtbGF5ZXJlZC1uYXYgW3R5cGU9XCJjaGVja2JveFwiXSwgLndjYXBmLWxheWVyZWQtbmF2IFt0eXBlPVwicmFkaW9cIl0nLFxuXHRcdFx0ZnVuY3Rpb24oIGV2ZW50ICkge1xuXHRcdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXG5cdFx0XHRcdGNvbnN0ICRpdGVtICAgICAgID0gJCggdGhpcyApO1xuXHRcdFx0XHRjb25zdCBmaWx0ZXJWYWx1ZSA9ICRpdGVtLnZhbCgpO1xuXG5cdFx0XHRcdGhhbmRsZUZpbHRlclJlcXVlc3QoICRpdGVtLCBmaWx0ZXJWYWx1ZSApO1xuXHRcdFx0fVxuXHRcdCk7XG5cblx0XHQvLyBUT0RPOiBVc2UgYSBjb21iaW5hdGlvbiBvZiBsYWJlbCwgY2hlY2tib3ggYW5kIHJhZGlvXG5cdFx0Ly8gaGFuZGxlIHRoZSBmaWx0ZXIgcmVxdWVzdCBmb3IgbGFiZWxlZCBpdGVtXG5cdFx0JHdjYXBmVGVybUZpbHRlcnMub24oXG5cdFx0XHQnY2xpY2snLFxuXHRcdFx0Jy53Y2FwZi1sYWJlbGVkLW5hdiAuaXRlbScsXG5cdFx0XHRmdW5jdGlvbiggZXZlbnQgKSB7XG5cdFx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cblx0XHRcdFx0Y29uc3QgJGl0ZW0gICAgICAgPSAkKCB0aGlzICk7XG5cdFx0XHRcdGNvbnN0IGZpbHRlclZhbHVlID0gJGl0ZW0uYXR0ciggJ2RhdGEtdmFsdWUnICk7XG5cblx0XHRcdFx0aGFuZGxlRmlsdGVyUmVxdWVzdCggJGl0ZW0sIGZpbHRlclZhbHVlICk7XG5cdFx0XHR9XG5cdFx0KTtcblxuXHRcdC8vIGhhbmRsZSB0aGUgZmlsdGVyIHJlcXVlc3QgZm9yIGRpc3BsYXkgdHlwZSBzZWxlY3QgZmllbGRzXG5cdFx0JHdjYXBmVGVybUZpbHRlcnMub24oXG5cdFx0XHQnY2hhbmdlJyxcblx0XHRcdCdzZWxlY3QnLFxuXHRcdFx0ZnVuY3Rpb24oIGV2ZW50ICkge1xuXHRcdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXG5cdFx0XHRcdGNvbnN0ICRpdGVtICAgICAgID0gJCggdGhpcyApO1xuXHRcdFx0XHRjb25zdCBmaWx0ZXJWYWx1ZSA9ICRpdGVtLnZhbCgpO1xuXG5cdFx0XHRcdGNvbnN0ICRmaWVsZCAgICA9ICRpdGVtLmNsb3Nlc3QoICcud2NhcGYtc2luZ2xlLWZpbHRlcicgKTtcblx0XHRcdFx0Y29uc3QgZmllbGRJRCAgID0gJGZpZWxkLmF0dHIoICdkYXRhLWlkJyApO1xuXHRcdFx0XHRjb25zdCBmaWVsZERhdGEgPSBmaWVsZHNbIGZpZWxkSUQgXTtcblx0XHRcdFx0Y29uc3QgZmlsdGVyS2V5ID0gZmllbGREYXRhLmZpbHRlcktleTtcblxuXHRcdFx0XHRpZiAoICEgZmlsdGVyVmFsdWUubGVuZ3RoICkge1xuXHRcdFx0XHRcdGNvbnN0IHF1ZXJ5ID0gd2NhcGZSZW1vdmVRdWVyeVN0cmluZ1BhcmFtZXRlciggZmlsdGVyS2V5ICk7XG5cdFx0XHRcdFx0aGlzdG9yeS5wdXNoU3RhdGUoIHt9LCAnJywgcXVlcnkgKTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRjb25zdCBmaWx0ZXJWYWxTdHJpbmcgPSBmaWx0ZXJWYWx1ZS50b1N0cmluZygpO1xuXHRcdFx0XHRcdHdjYXBmVXBkYXRlUXVlcnlTdHJpbmdQYXJhbWV0ZXIoIGZpbHRlcktleSwgZmlsdGVyVmFsU3RyaW5nICk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHQvLyBmaWx0ZXIgcHJvZHVjdHNcblx0XHRcdFx0d2NhcGZGaWx0ZXJQcm9kdWN0cygpO1xuXHRcdFx0fVxuXHRcdCk7XG5cblx0XHQvLyBoYW5kbGUgdGhlIGZpbHRlciByZXF1ZXN0IGZvciByYW5nZSBudW1iZXJcblx0XHQkd2NhcGZTaW5nbGVGaWx0ZXJzLm9uKFxuXHRcdFx0J2lucHV0Jyxcblx0XHRcdCcud2NhcGYtcmFuZ2UtbnVtYmVyIC5taW4tdmFsdWUsIC53Y2FwZi1yYW5nZS1udW1iZXIgLm1heC12YWx1ZScsXG5cdFx0XHRmdW5jdGlvbiggZXZlbnQgKSB7XG5cdFx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cblx0XHRcdFx0Y29uc3QgJGl0ZW0gPSAkKCB0aGlzICk7XG5cblx0XHRcdFx0Ly8gQ2xlYXIgYW55IHByZXZpb3VzbHkgc2V0IHRpbWVyIGJlZm9yZSBzZXR0aW5nIGEgZnJlc2ggb25lXG5cdFx0XHRcdGNsZWFyVGltZW91dCggJGl0ZW0uZGF0YSggJ3RpbWVyJyApICk7XG5cblx0XHRcdFx0JGl0ZW0uZGF0YSggJ3RpbWVyJywgc2V0VGltZW91dCggZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0JGl0ZW0ucmVtb3ZlRGF0YSggJ3RpbWVyJyApO1xuXG5cdFx0XHRcdFx0Y29uc3QgJHJhbmdlTnVtYmVyICA9ICRpdGVtLmNsb3Nlc3QoICcud2NhcGYtcmFuZ2UtbnVtYmVyJyApO1xuXHRcdFx0XHRcdGNvbnN0IGZpbHRlcktleSAgICAgPSAkcmFuZ2VOdW1iZXIuYXR0ciggJ2RhdGEtZmlsdGVyLWtleScgKTtcblx0XHRcdFx0XHRjb25zdCByYW5nZU1pblZhbHVlID0gJHJhbmdlTnVtYmVyLmF0dHIoICdkYXRhLXJhbmdlLW1pbi12YWx1ZScgKTtcblx0XHRcdFx0XHRjb25zdCByYW5nZU1heFZhbHVlID0gJHJhbmdlTnVtYmVyLmF0dHIoICdkYXRhLXJhbmdlLW1heC12YWx1ZScgKTtcblx0XHRcdFx0XHRsZXQgbWluVmFsdWUgICAgICAgID0gJHJhbmdlTnVtYmVyLmZpbmQoICcubWluLXZhbHVlJyApLnZhbCgpO1xuXHRcdFx0XHRcdGxldCBtYXhWYWx1ZSAgICAgICAgPSAkcmFuZ2VOdW1iZXIuZmluZCggJy5tYXgtdmFsdWUnICkudmFsKCk7XG5cblx0XHRcdFx0XHRpZiAoICEgbWluVmFsdWUubGVuZ3RoICkge1xuXHRcdFx0XHRcdFx0bWluVmFsdWUgPSByYW5nZU1pblZhbHVlO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdGlmICggISBtYXhWYWx1ZS5sZW5ndGggKSB7XG5cdFx0XHRcdFx0XHRtYXhWYWx1ZSA9IHJhbmdlTWF4VmFsdWU7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0aWYgKCBwYXJzZUZsb2F0KCBtaW5WYWx1ZSApID4gcGFyc2VGbG9hdCggbWF4VmFsdWUgKSApIHtcblx0XHRcdFx0XHRcdG1heFZhbHVlID0gbWluVmFsdWU7XG5cblx0XHRcdFx0XHRcdCRyYW5nZU51bWJlci5maW5kKCAnLm1heC12YWx1ZScgKS52YWwoIG1heFZhbHVlICk7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0aWYgKCBtaW5WYWx1ZSA9PT0gcmFuZ2VNaW5WYWx1ZSAmJiBtYXhWYWx1ZSA9PT0gcmFuZ2VNYXhWYWx1ZSApIHtcblx0XHRcdFx0XHRcdGNvbnN0IHF1ZXJ5ID0gd2NhcGZSZW1vdmVRdWVyeVN0cmluZ1BhcmFtZXRlciggZmlsdGVyS2V5ICk7XG5cdFx0XHRcdFx0XHRoaXN0b3J5LnB1c2hTdGF0ZSgge30sICcnLCBxdWVyeSApO1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRjb25zdCBmaWx0ZXJWYWxTdHJpbmcgPSBtaW5WYWx1ZSArICcrJyArIG1heFZhbHVlO1xuXHRcdFx0XHRcdFx0d2NhcGZVcGRhdGVRdWVyeVN0cmluZ1BhcmFtZXRlciggZmlsdGVyS2V5LCBmaWx0ZXJWYWxTdHJpbmcgKTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHQvLyBmaWx0ZXIgcHJvZHVjdHNcblx0XHRcdFx0XHR3Y2FwZkZpbHRlclByb2R1Y3RzKCk7XG5cdFx0XHRcdH0sIGRlbGF5ICkgKTtcblx0XHRcdH1cblx0XHQpO1xuXG5cdFx0Ly8gaGlzdG9yeSBiYWNrIGFuZCBmb3J3YXJkIHJlcXVlc3QgaGFuZGxpbmdcblx0XHQkKCB3aW5kb3cgKS5iaW5kKCAncG9wc3RhdGUnLCBmdW5jdGlvbigpIHtcblx0XHRcdC8vIGZpbHRlciBwcm9kdWN0c1xuXHRcdFx0d2NhcGZGaWx0ZXJQcm9kdWN0cygpO1xuXHRcdH0gKTtcblxuXHR9XG4pO1xuIl19
