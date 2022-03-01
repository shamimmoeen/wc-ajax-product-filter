"use strict";

/**
 * The post meta field.
 *
 * @since      1.0.0
 * @package    wc-ajax-product-filter-pro
 * @subpackage wc-ajax-product-filter-pro/admin/src/js
 * @author     Mainul Hassan Main
 */
jQuery(document).ready(function ($) {
  var $searchForm = $('#search-form');
  $searchForm.on('after_toggle_request', function (e, handler, value, $field) {
    if ('.wcapf-form-sub-field-custom-taxonomy select' === handler) {
      var params = window['wcapf_admin_params'];
      var hierarchicalData = params['taxonomy_hierarchical_data'];

      if (!hierarchicalData) {
        return;
      }

      var isHierarchical = hierarchicalData[value];
      var $dependantFields = $field.find('.wcapf-form-sub-field-hierarchical, .wcapf-form-sub-field-show_children_only');

      if (isHierarchical) {
        $dependantFields.show();
      } else {
        $dependantFields.hide();
      }
    }
  });

  function initSortableForManualOptions($selector) {
    $selector.sortable({
      opacity: 0.8,
      revert: false,
      cursor: 'move',
      axis: 'y',
      handle: '.move-options-handler',
      placeholder: 'widget-placeholder',
      update: function update(e) {
        var $field = $(e.target).closest('.wcapf-form-field');
        triggerManualOptionsChange($field);
      }
    }).disableSelection();
  } // Sort Manual Options


  initSortableForManualOptions($searchForm.find('.manual-options-table .manual-options-table-body-rows'));
  $searchForm.on('field_added', function (e, ui) {
    // Init Sortable for the manual options.
    initSortableForManualOptions($(ui.item.find('.manual-options-table-body-rows')));
  });

  function triggerRemoveOption($field) {
    var $optionsTable = $field.find('.manual-options-table');
    var tableRows = $optionsTable.find('.manual-options-table-body-rows').children();

    if (2 > tableRows.length) {
      $optionsTable.removeClass('has-options');
    }
  } // Remove Single Option


  $searchForm.on('click', '.remove-option', function () {
    var $item = $(this).closest('.item');
    var $field = $item.closest('.wcapf-form-field');
    triggerRemoveOption($field);
    $item.remove();
    triggerManualOptionsChange($field);
  }); // Clear All Options

  $searchForm.on('click', '.clear-all-options', function () {
    var $field = $(this).closest('.wcapf-form-field');
    var $optionsTable = $field.find('.manual-options-table');
    $optionsTable.find('.manual-options-table-body-rows').empty();
    triggerRemoveOption($field);
    triggerManualOptionsChange($field);
  }); // Add New Option

  $searchForm.on('click', '.add-option', function () {
    var fieldType = 'wcapf-post-meta-option'; // Bail out if no tmpl found for the type.

    if (!jQuery('#tmpl-' + fieldType).length) {
      return;
    }

    var $field = $(this).closest('.wcapf-form-field');
    var template = wp.template(fieldType);
    var rendered = template({
      value: '',
      label: ''
    });
    var $wrapper = $field.find('.manual-options-table');
    var $rows = $wrapper.find('.manual-options-table-body-rows');
    $rows.append(rendered);

    if (!$wrapper.hasClass('has-options')) {
      $wrapper.addClass('has-options');
    }
  });
  var $postMetaOptionsModal = $('.post-meta-options-modal');
  var $noKeyFoundMessage = $postMetaOptionsModal.find('.no-key-found-message');
  var $postMetaModalLoader = $postMetaOptionsModal.find('.post-meta-options-loader');
  var $postMetaOptions = $postMetaOptionsModal.find('.post-meta-options');
  var $postMetaModalFooter = $postMetaOptionsModal.find('.wcapf-modal-footer');
  var postMetaOptionsModalInstance = $postMetaOptionsModal.remodal({
    hashTracking: false
  });
  var $postMetaField = null;

  function resetPostMetaModal() {
    $postMetaOptions.html('');
    $postMetaModalLoader.removeClass('active');
    $noKeyFoundMessage.removeClass('active');
    $postMetaModalFooter.removeClass('active');
    $postMetaOptionsModal.find('.replace-current-options').prop('checked', false);
  } // Browse Values


  $searchForm.on('click', '.browse-values', function () {
    resetPostMetaModal();
    var $field = $(this).closest('.wcapf-form-field');
    var $inputMetaKey = $field.find('.wcapf-form-sub-field-meta_key select');
    var metaKey = $inputMetaKey.val();

    if (!metaKey) {
      $noKeyFoundMessage.addClass('active');
    } else {
      $noKeyFoundMessage.removeClass('active');
    }

    postMetaOptionsModalInstance.open();
    $postMetaField = $field;

    if (!metaKey) {
      return;
    } // Show the loading animation.


    $postMetaModalLoader.addClass('active');
    /**
     * Ajax's success function.
     *
     * @param response
     */

    function okCallback(response) {
      // Hide the loading animation.
      $postMetaModalLoader.removeClass('active');
      $postMetaModalFooter.addClass('active');
      $postMetaOptions.html(response);
    }
    /**
     * Ajax's error function.
     *
     * @param message
     */


    function errCallback(message) {
      console.log('error', message); // Hide the loading animation.

      $postMetaModalLoader.removeClass('active');
    }

    var formData = {
      key: metaKey,
      action: 'wcapf_get_meta_options'
    }; // https://stackoverflow.com/a/59181252

    wp.ajax.post(formData).done(okCallback).fail(errCallback);
  });
  /**
   * Reset the post meta option's modal when modal gets closed.
   */

  $(document).on('closed', $postMetaOptionsModal, function () {
    resetPostMetaModal();
    $postMetaField = null;
  }); // Unselect all values.

  $postMetaOptionsModal.on('click', '.select-none', function () {
    $postMetaOptions.find('[type="checkbox"]').prop('checked', false);
  }); // Select all values.

  $postMetaOptionsModal.on('click', '.select-all', function () {
    $postMetaOptions.find('[type="checkbox"]').prop('checked', true);
  });

  function triggerManualOptionsChange($postMetaField) {
    var $valueHolder = $postMetaField.find('.wcapf-form-sub-field-manual_options input');
    var $optionsTable = $postMetaField.find('.manual-options-table');
    var $rows = $optionsTable.find('.manual-options-table-body-rows');
    var _rows = [];
    $rows.find('.item').each(function (i, _item) {
      var $item = $(_item);
      var value = $item.find('.option_value').val();
      var label = $item.find('.option_label').val();

      if (value && label) {
        _rows.push([value, label]);
      }
    });
    var rawValues = encodeURIComponent(JSON.stringify(_rows));
    $valueHolder.val(rawValues);
  } // Add selected options.


  $postMetaOptionsModal.on('click', '.add-options', function () {
    var $options = $postMetaOptions.find('[type="checkbox"]');
    var isReplace = false;
    var rows = '';

    if ($postMetaModalFooter.find('.replace-current-options').is(':checked')) {
      isReplace = true;
    }

    if ($options) {
      var fieldType = 'wcapf-post-meta-option';
      $.each($options, function (i, input) {
        var $input = $(input);
        var value = $input.val();

        if ($input.is(':checked')) {
          var template = wp.template(fieldType);
          var rendered = template({
            value: value,
            label: value
          });
          rows += rendered;
        }
      });
    }

    if (rows) {
      var $wrapper = $postMetaField.find('.manual-options-table');
      var $rows = $wrapper.find('.manual-options-table-body-rows');

      if (isReplace) {
        $rows.html(rows);
      } else {
        $rows.append(rows);
      }

      if (!$wrapper.hasClass('has-options')) {
        $wrapper.addClass('has-options');
      }

      triggerManualOptionsChange($postMetaField);
    }

    postMetaOptionsModalInstance.close();
  });
  $searchForm.on('after_toggle_request', function (e, handler, value, $field) {
    if ('.wcapf-form-sub-field-get_options input' === handler) {
      var $selectElm = $field.find('.wcapf-form-sub-field-options_order_by select');
      var orderBy = $selectElm.val();
      var dependantOptions = 'option[value="label"]';

      if ('automatically' === value) {
        $selectElm.children(dependantOptions).attr('disabled', 'disabled');

        if ('label' === orderBy) {
          $selectElm.prop('selectedIndex', 1).change();
        }
      } else {
        $selectElm.children(dependantOptions).removeAttr('disabled');
      }
    }
  });

  function disableOrderByOptions($elm) {
    var value = $elm.val();
    var $wrapper = $elm.closest('.wcapf-post-meta-order-options-field');
    var $orderDirectionField = $wrapper.find('.wcapf-form-sub-field-options_order_dir select');
    var $orderTypeField = $wrapper.find('.wcapf-form-sub-field-options_order_type select');

    if ('none' === value) {
      $orderDirectionField.attr('disabled', 'disabled');
      $orderTypeField.attr('disabled', 'disabled');
    } else {
      $orderDirectionField.removeAttr('disabled');
      $orderTypeField.removeAttr('disabled');
    }
  }

  $searchForm.find('.wcapf-form-sub-field-options_order_by select').each(function () {
    var $this = $(this);
    disableOrderByOptions($this);
  });
  $searchForm.on('change', '.wcapf-form-sub-field-options_order_by select', function () {
    var $this = $(this);
    disableOrderByOptions($this);
  });
  $searchForm.on('input', '.manual-options-table input[type="text"]', function () {
    var $field = $(this).closest('.wcapf-form-field');
    triggerManualOptionsChange($field);
  });
  /**
   * Value type 'Number'
   */

  function initSortableForNumberManualOptions($selector) {
    $selector.sortable({
      opacity: 0.8,
      revert: false,
      cursor: 'move',
      axis: 'y',
      handle: '.move-options-handler',
      placeholder: 'widget-placeholder',
      update: function update(e) {
        var $field = $(e.target).closest('.wcapf-form-field');
        triggerNumberManualOptionsChange($field);
      }
    }).disableSelection();
  } // Sort Number Manual Options


  initSortableForNumberManualOptions($searchForm.find('.number-manual-options-table .manual-options-table-body-rows'));
  $searchForm.on('field_added', function (e, ui) {
    // Init Sortable for the number manual options.
    initSortableForNumberManualOptions($(ui.item.find('.manual-options-table-body-rows')));
  });

  function triggerRemoveNumberOption($field) {
    var $optionsTable = $field.find('.number-manual-options-table');
    var tableRows = $optionsTable.find('.manual-options-table-body-rows').children();

    if (2 > tableRows.length) {
      $optionsTable.removeClass('has-options');
    }
  }

  function triggerNumberManualOptionsChange($postMetaField) {
    var $valueHolder = $postMetaField.find('.wcapf-form-sub-field-number_manual_options input');
    var $optionsTable = $postMetaField.find('.number-manual-options-table');
    var $rows = $optionsTable.find('.manual-options-table-body-rows');
    var _rows = [];
    $rows.find('.item').each(function (i, _item) {
      var $item = $(_item);
      var min_value = $item.find('.option_min_value').val();
      var max_value = $item.find('.option_max_value').val();
      var label = $item.find('.option_label').val();

      if (min_value && max_value && label) {
        _rows.push([min_value, max_value, label]);
      }
    });
    var rawValues = encodeURIComponent(JSON.stringify(_rows));
    $valueHolder.val(rawValues);
  } // Remove Single Number Option


  $searchForm.on('click', '.remove-number-option', function () {
    var $item = $(this).closest('.item');
    var $field = $item.closest('.wcapf-form-field');
    triggerRemoveNumberOption($field);
    $item.remove();
    triggerNumberManualOptionsChange($field);
  }); // Clear All Options

  $searchForm.on('click', '.clear-all-number-options', function () {
    var $field = $(this).closest('.wcapf-form-field');
    var $optionsTable = $field.find('.number-manual-options-table');
    $optionsTable.find('.manual-options-table-body-rows').empty();
    triggerRemoveNumberOption($field);
    triggerNumberManualOptionsChange($field);
  }); // Add New Option

  $searchForm.on('click', '.add-number-option', function () {
    var fieldType = 'wcapf-post-meta-type-number-option'; // Bail out if no tmpl found for the type.

    if (!jQuery('#tmpl-' + fieldType).length) {
      return;
    }

    var $field = $(this).closest('.wcapf-form-field');
    var template = wp.template(fieldType);
    var rendered = template({
      value: '',
      label: ''
    });
    var $wrapper = $field.find('.number-manual-options-table');
    var $rows = $wrapper.find('.manual-options-table-body-rows');
    $rows.append(rendered);

    if (!$wrapper.hasClass('has-options')) {
      $wrapper.addClass('has-options');
    }
  });
  $searchForm.on('input', '.number-manual-options-table input[type="text"]', function () {
    var $field = $(this).closest('.wcapf-form-field');
    triggerNumberManualOptionsChange($field);
  });
  $searchForm.on('after_toggle_request', function (e, handler, value, $field) {
    if ('.wcapf-form-sub-field-number_display_type select' === handler) {
      var $getOptions = $field.find('.number-get-options');
      var $autoOptions = $field.find('.number-automatic-options');
      var $manualOptionsTable = $field.find('.number-manual-options-table');
      var $elm = $field.find(handler);
      var displayType = $elm.val();

      if ('range_slider' === displayType || 'range_number' === displayType) {
        $getOptions.hide();
        $manualOptionsTable.addClass('force-hide');
        $autoOptions.addClass('force-show');
      } else {
        $getOptions.show();
        $manualOptionsTable.removeClass('force-hide');
        $autoOptions.removeClass('force-show');
      }
    }
  });

  function toggleNumberMinValueField($elm) {
    var $field = $elm.closest('.wcapf-form-field');
    var $textField = $field.find('.wcapf-form-sub-field-min_value input[type="text"]');

    if ($elm.is(':checked')) {
      $textField.attr('disabled', 'disabled');
    } else {
      $textField.removeAttr('disabled');
    }
  }

  $searchForm.find('.wcapf-form-sub-field-min_value_auto_detect input[type="checkbox"]').each(function () {
    var $this = $(this);
    toggleNumberMinValueField($this);
  });
  $searchForm.on('click', '.wcapf-form-sub-field-min_value_auto_detect input[type="checkbox"]', function () {
    var $this = $(this);
    toggleNumberMinValueField($this);
  });

  function toggleNumberMaxValueField($elm) {
    var $field = $elm.closest('.wcapf-form-field');
    var $textField = $field.find('.wcapf-form-sub-field-max_value input[type="text"]');

    if ($elm.is(':checked')) {
      $textField.attr('disabled', 'disabled');
    } else {
      $textField.removeAttr('disabled');
    }
  }

  $searchForm.find('.wcapf-form-sub-field-max_value_auto_detect input[type="checkbox"]').each(function () {
    var $this = $(this);
    toggleNumberMaxValueField($this);
  });
  $searchForm.on('click', '.wcapf-form-sub-field-max_value_auto_detect input[type="checkbox"]', function () {
    var $this = $(this);
    toggleNumberMaxValueField($this);
  });
});
"use strict";

/**
 * The search form field.
 *
 * @since      3.0.0
 * @package    wc-ajax-product-filter
 * @subpackage wc-ajax-product-filter/admin/src/js
 * @author     Mainul Hassan Main
 */
jQuery(document).ready(function ($) {
  var $searchForm = $('#search-form');
  var dependantData = [{
    'handler': '.wcapf-form-sub-field-value_type select',
    'handlerType': 'select',
    'event': 'change',
    'dependant': [{
      'selector': '.input-type-text-fields',
      'value': ['text']
    }, {
      'selector': '.input-type-number-fields',
      'value': ['number']
    }, {
      'selector': '.input-type-date-fields',
      'value': ['date']
    }]
  }, {
    'handler': '.wcapf-form-sub-field-display_type select',
    'handlerType': 'select',
    'event': 'change',
    'dependant': [{
      'selector': '.wcapf-form-sub-field-query_type',
      'value': ['checkbox', 'multi-select']
    }, {
      'selector': '.wcapf-form-sub-field-all_items_label',
      'value': ['radio', 'select']
    }, {
      'selector': '.wcapf-form-sub-field-use_chosen',
      'value': ['select', 'multi-select']
    }]
  }, {
    'handler': '.wcapf-form-sub-field-use_chosen input',
    'handlerType': 'checkbox',
    'event': 'change',
    'dependant': [{
      'selector': '.wcapf-form-sub-field-chosen_no_results_message',
      'value': ['1']
    }]
  }, {
    'handler': '.wcapf-form-sub-field-get_options input',
    'handlerType': 'radio',
    'event': 'change',
    'dependant': [{
      'selector': '.column-group-meta_key_manual_options',
      'value': ['manual_entry']
    }]
  }, {
    'handler': '.wcapf-form-sub-field-number_display_type select',
    'handlerType': 'select',
    'event': 'change',
    'dependant': [{
      'selector': '.wcapf-form-sub-field-number_range_slider_display_values_as',
      'value': ['range_slider']
    }, {
      'selector': '.wcapf-form-sub-field-number_range_query_type',
      'value': ['range_checkbox', 'range_multiselect']
    }, {
      'selector': '.wcapf-form-sub-field-number_range_select_all_items_label',
      'value': ['range_radio', 'range_select']
    }, {
      'selector': '.wcapf-form-sub-field-number_range_use_chosen',
      'value': ['range_select', 'range_multiselect']
    }, {
      'selector': '.wcapf-form-sub-field-number_range_show_count',
      'value': ['range_checkbox', 'range_radio', 'range_select', 'range_multiselect']
    }, {
      'selector': '.wcapf-form-sub-field-number_range_hide_empty',
      'value': ['range_checkbox', 'range_radio', 'range_select', 'range_multiselect']
    }, {
      'selector': '.number-decimal-fields',
      'value': ['range_slider', 'range_checkbox', 'range_radio', 'range_select', 'range_multiselect']
    }]
  }, {
    'handler': '.wcapf-form-sub-field-number_range_use_chosen input',
    'handlerType': 'checkbox',
    'event': 'change',
    'dependant': [{
      'selector': '.wcapf-form-sub-field-number_range_chosen_no_results_message',
      'value': ['1']
    }]
  }, {
    'handler': '.wcapf-form-sub-field-number_get_options input',
    'handlerType': 'radio',
    'event': 'change',
    'dependant': [{
      'selector': '.number-automatic-options',
      'value': ['automatically']
    }, {
      'selector': '.number-manual-options-table',
      'value': ['manual_entry']
    }]
  }, {
    'handler': '.wcapf-form-sub-field-date_input_type select',
    'handlerType': 'select',
    'event': 'change',
    'dependant': [{
      'selector': '.date-to-ui-options',
      'value': ['range_date']
    }]
  }, {
    'handler': '.wcapf-form-sub-field-limit_terms select',
    'handlerType': 'select',
    'event': 'change',
    'dependant': [{
      'selector': '.wcapf-form-sub-field-parent_term',
      'value': ['child']
    }, {
      'selector': '.wcapf-form-sub-field-limit_terms_by_id',
      'value': ['include', 'exclude']
    }]
  }, {
    'handler': '.wcapf-form-sub-field-enable_soft_limit select',
    'handlerType': 'select',
    'event': 'change',
    'dependant': [{
      'selector': '.wcapf-form-sub-field-soft_limit',
      'value': ['yes']
    }]
  }, {
    'handler': '.wcapf-form-sub-field-custom-taxonomy select',
    'handlerType': 'select',
    'event': 'change'
  }];

  function _triggerInputTypeTextDisplayTypeChange(value, $field) {
    var $noResults = $field.find('.wcapf-form-sub-field-chosen_no_results_message');
    var $allItemsLabel = $field.find('.wcapf-form-sub-field-all_items_label');
    var useChosen = $field.find('.wcapf-form-sub-field-use_chosen input').is(':checked');

    if (useChosen && ('select' === value || 'multi-select' === value)) {
      $noResults.show();
    } else {
      $noResults.hide();
    }

    if ('radio' === value || 'select' === value || 'multi-select' === value && useChosen) {
      $allItemsLabel.show();
    } else {
      $allItemsLabel.hide();
    }
  }

  function _triggerInputTypeNumberDisplayTypeChange(value, $field) {
    var $noResults = $field.find('.wcapf-form-sub-field-number_range_chosen_no_results_message');
    var $allItemsLabel = $field.find('.wcapf-form-sub-field-number_range_select_all_items_label');
    var useChosen = $field.find('.wcapf-form-sub-field-number_range_use_chosen input').is(':checked');

    if (useChosen && ('range_select' === value || 'range_multiselect' === value)) {
      $noResults.show();
    } else {
      $noResults.hide();
    }

    if ('range_radio' === value || 'range_select' === value || 'range_multiselect' === value && useChosen) {
      $allItemsLabel.show();
    } else {
      $allItemsLabel.hide();
    }
  }

  function _triggerInputTypeTextUseSelectChange(value, $field) {
    var $noResults = $field.find('.wcapf-form-sub-field-chosen_no_results_message');
    var $allItemsLabel = $field.find('.wcapf-form-sub-field-all_items_label');
    var displayType = $field.find('.wcapf-form-sub-field-display_type select').val();

    if ('1' === value && ('select' === displayType || 'multi-select' === displayType)) {
      $noResults.show();
    } else {
      $noResults.hide();
    }

    if ('1' === value && 'multi-select' === displayType || 'radio' === displayType || 'select' === displayType) {
      $allItemsLabel.show();
    } else {
      $allItemsLabel.hide();
    }
  }

  function _triggerInputTypeNumberUseSelectChange(value, $field) {
    var $noResults = $field.find('.wcapf-form-sub-field-number_range_chosen_no_results_message');
    var $allItemsLabel = $field.find('.wcapf-form-sub-field-number_range_select_all_items_label');
    var displayType = $field.find('.wcapf-form-sub-field-number_display_type select').val();

    if ('1' === value && ('range_select' === displayType || 'range_multiselect' === displayType)) {
      $noResults.show();
    } else {
      $noResults.hide();
    }

    if ('1' === value && 'range_multiselect' === displayType || 'range_radio' === displayType || 'range_select' === displayType) {
      $allItemsLabel.show();
    } else {
      $allItemsLabel.hide();
    }
  }

  function _handleToggleRequest(data, currentSelector, value) {
    var $field = currentSelector.closest('.wcapf-form-field');
    var handler = data['handler'];
    var handlerType = data['handlerType'];
    var dependant = data['dependant'];
    var _value = value;

    if ('checkbox' === handlerType) {
      _value = currentSelector.is(':checked') ? '1' : '0';
    }

    if ('radio' === handlerType) {
      _value = $field.find(handler + ':checked').val();
    }

    $.each(dependant, function (id, d) {
      var $selector = $field.find(d['selector']);
      var validValues = d['value'];

      if (validValues.includes(_value)) {
        $selector.show();
      } else {
        $selector.hide();
      }
    });

    if ('.wcapf-form-sub-field-display_type select' === handler) {
      _triggerInputTypeTextDisplayTypeChange(_value, $field);
    }

    if ('.wcapf-form-sub-field-use_chosen input' === handler) {
      _triggerInputTypeTextUseSelectChange(_value, $field);
    }

    if ('.wcapf-form-sub-field-number_display_type select' === handler) {
      _triggerInputTypeNumberDisplayTypeChange(_value, $field);
    }

    if ('.wcapf-form-sub-field-number_range_use_chosen input' === handler) {
      _triggerInputTypeNumberUseSelectChange(_value, $field);
    }

    $searchForm.trigger('after_toggle_request', [handler, _value, $field]);
  }

  function handleToggleRequest(data, currentSelector, value) {
    if (null === currentSelector) {
      var handler = data['handler'];
      var $handler = $(handler);
      $.each($handler, function () {
        var _this = $(this);

        var _value = _this.val();

        _handleToggleRequest(data, _this, _value);
      });
    } else {
      _handleToggleRequest(data, currentSelector, value);
    }
  }

  function setupSearchForm() {
    var inital = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
    $.each(dependantData, function (i, data) {
      var handler = data['handler'];
      var event = data['event'];
      handleToggleRequest(data, null, null);

      if (inital) {
        $searchForm.on(event, handler, function () {
          var _this = $(this);

          var _value = $(this).val();

          handleToggleRequest(data, _this, _value);
        });
      }
    });
  }

  setupSearchForm(true);
  $searchForm.on('field_added', function () {
    // Toggle the visibility of subfields.
    setupSearchForm();
  });
});
"use strict";

/**
 * The search form.
 *
 * @since      3.0.0
 * @package    wc-ajax-product-filter
 * @subpackage wc-ajax-product-filter/admin/src/js
 * @author     Mainul Hassan Main
 */
var totalFieldInstances = jQuery('#total_field_instances');
var searchForm = jQuery('#search-form');
/**
 * Assign a unique id by replacing the placeholder id.
 */

function removePlaceholder(uniqueId, elements, attr) {
  elements.each(function () {
    var element = jQuery(this);
    var oldValue = element.attr(attr);
    var newValue = oldValue.replace('%%', uniqueId);
    element.attr(attr, newValue);
  });
}
/**
 * Insert the field's subfields.
 */


function insertFieldSubFields(ui) {
  // Insert the field's subfields if not already inserted.
  if (!ui.item.hasClass('sub-fields-ready')) {
    var type = ui.item.attr('data-field-type');
    var uniqueId = parseInt(totalFieldInstances.val());
    var fieldType = 'wcapf-form-field-' + type; // Bail out if no tmpl found for the type.

    if (!jQuery('#tmpl-' + fieldType).length) {
      return;
    } // Increment the value of total field instances.


    totalFieldInstances.val(uniqueId + 1);
    var template = wp.template(fieldType);
    var rendered = template();
    var wrapper = ui.item.find('.widget-content');
    wrapper.prepend(rendered); // Update the for attributes of the labels.

    removePlaceholder(uniqueId, ui.item.find('label[for^="wcapf-input-"]'), 'for'); // Update the ids of the input elements.

    removePlaceholder(uniqueId, ui.item.find('*[id^="wcapf-input-"]'), 'id'); // Update the names of the input elements.

    removePlaceholder(uniqueId, ui.item.find('*[id^="wcapf-input-"]'), 'name'); // Update the position value.

    removePlaceholder(uniqueId, ui.item.find('*[id^="wcapf-input-position-"]'), 'value');
    ui.item.addClass('sub-fields-ready');
    searchForm.trigger('field_added', [ui]);
  }
}
/**
 * Update the form field's position after sort.
 *
 * @source https://stackoverflow.com/a/14736775
 */


function updateFieldsPosition() {
  var inputs = searchForm.find('*[id^="wcapf-input-position-"]');
  var nbElems = inputs.length;
  inputs.each(function (idx) {
    jQuery(this).val(nbElems - (nbElems - idx));
  });
}
/**
 * Make the field ready, remove styles comes from jquery-ui-sortable plugin, insert the field's subfields etc.
 */


function makeFieldReady(e, ui) {
  // Remove styles comes from jquery-ui-sortable plugin.
  ui.item.removeAttr('style');
  insertFieldSubFields(ui);
  updateFieldsPosition();
  var toggleBtn = ui.item.find('.widget-action'); // Expand the form field after sort.

  if ('false' === toggleBtn.attr('aria-expanded')) {
    toggleBtn.trigger('click');
  }
}
/**
 * Instantiate sortable for the form fields.
 */


function sortable(identifier) {
  var container = jQuery(identifier);
  container.sortable({
    opacity: 0.8,
    revert: false,
    cursor: 'move',
    axis: 'y',
    handle: '.widget-top',
    cancel: '.widget-title-action',
    items: '.widget',
    placeholder: 'widget-placeholder',
    connectWith: '#search-form-wrapper',
    stop: makeFieldReady,
    start: function start(e, ui) {
      // If it is getting appended to the wrong place, then force it into the right container.
      ui.placeholder.appendTo(ui.placeholder.parent().find('.inside #search-form-wrapper'));
    }
  });
}

sortable('#search-form');
/**
 * Run function when drag starts.
 */

function onDragStart() {
  searchForm.addClass('ui-drop-active');
}
/**
 * Run function at drag stop.
 */


function onDragStop() {
  searchForm.removeClass('ui-drop-active');
}
/**
 * Initialize draggable for the form fields.
 */


jQuery('#available-fields .widget').draggable({
  connectToSortable: '#search-form',
  helper: 'clone',
  start: onDragStart,
  stop: onDragStop
});
/**
 * Toggle the form field.
 */

function toggleField(e) {
  var target = e.target;
  var widget = jQuery(this).closest('.widget');
  var toggleBtn = widget.find('.widget-action');
  var inside = widget.children('.widget-inside');
  var isExpand = toggleBtn.attr('aria-expanded');
  var toggleExpand = 'true' === isExpand ? 'false' : 'true';
  toggleBtn.attr('aria-expanded', toggleExpand);
  jQuery(inside).slideToggle('fast', function () {
    widget.toggleClass('open');
    searchForm.trigger('widget-closed', [target]);
  });
}

searchForm.on('click', '.widget-top', toggleField);
searchForm.on('click', '.widget-control-close', toggleField);
/**
 * Focus the form field's expand button.
 */

function focusField(e, target) {
  if (target.classList.contains('widget-control-close')) {
    var widget = jQuery(target).closest('.widget');
    var action = widget.find('.widget-action');
    action.attr('aria-expanded', 'false').focus();
  }
}

searchForm.on('widget-closed', focusField);
/**
 * Remove the field.
 */

function removeField() {
  var widget = jQuery(this).closest('.widget');
  jQuery(widget).slideUp('fast', function () {
    widget.remove();
    updateFieldsPosition();
  });
}

searchForm.on('click', '.widget-control-remove', removeField);
/**
 * Store the initial form data into a variable so that we can compare it when leaving the page.
 */

var initialFormState = searchForm.serializeArray();
/**
 * Show message after form submission.
 */

function showMessage(message) {
  var type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'success';
  var element = jQuery('<p class="' + type + '">' + message + '</p>');
  var wrapper = jQuery('.wcapf-message-wrapper');

  if (!wrapper.is(':empty')) {
    return;
  }

  jQuery(wrapper).html(element).slideDown('fast');
  setTimeout(function () {
    jQuery(wrapper).slideUp('fast');
    wrapper.html('');
  }, 3000);
}
/**
 * Save the search form.
 */


function saveForm() {
  var button = jQuery(this);
  var formData = searchForm.serializeArray();
  button.attr('disabled', 'disabled');

  function okCallback(message) {
    button.removeAttr('disabled'); // Update the initial form data after successfully saving the form.

    initialFormState = formData;
    showMessage(message);
  }

  function errCallback(message) {
    button.removeAttr('disabled');
    showMessage(message, 'error');
  } // https://stackoverflow.com/a/59181252


  wp.ajax.post(formData).done(okCallback).fail(errCallback);
}

jQuery('#postbox-container-1').on('click', 'button', saveForm);
/**
 * Show alert on leave if the form is dirty.
 *
 * TODO: Uncomment this.
 */
// window.onbeforeunload = function() {
// 	const newFormState = searchForm.serializeArray();
//
// 	const isFormDirty = ! _.isEqual( newFormState, initialFormState );
//
// 	if ( isFormDirty ) {
// 		return '';
// 	}
// };
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInBvc3QtbWV0YS1vcHRpb25zLmpzIiwic2VhcmNoLWZvcm0tZmllbGQuanMiLCJzZWFyY2gtZm9ybS5qcyJdLCJuYW1lcyI6WyJqUXVlcnkiLCJkb2N1bWVudCIsInJlYWR5IiwiJCIsIiRzZWFyY2hGb3JtIiwib24iLCJlIiwiaGFuZGxlciIsInZhbHVlIiwiJGZpZWxkIiwicGFyYW1zIiwid2luZG93IiwiaGllcmFyY2hpY2FsRGF0YSIsImlzSGllcmFyY2hpY2FsIiwiJGRlcGVuZGFudEZpZWxkcyIsImZpbmQiLCJzaG93IiwiaGlkZSIsImluaXRTb3J0YWJsZUZvck1hbnVhbE9wdGlvbnMiLCIkc2VsZWN0b3IiLCJzb3J0YWJsZSIsIm9wYWNpdHkiLCJyZXZlcnQiLCJjdXJzb3IiLCJheGlzIiwiaGFuZGxlIiwicGxhY2Vob2xkZXIiLCJ1cGRhdGUiLCJ0YXJnZXQiLCJjbG9zZXN0IiwidHJpZ2dlck1hbnVhbE9wdGlvbnNDaGFuZ2UiLCJkaXNhYmxlU2VsZWN0aW9uIiwidWkiLCJpdGVtIiwidHJpZ2dlclJlbW92ZU9wdGlvbiIsIiRvcHRpb25zVGFibGUiLCJ0YWJsZVJvd3MiLCJjaGlsZHJlbiIsImxlbmd0aCIsInJlbW92ZUNsYXNzIiwiJGl0ZW0iLCJyZW1vdmUiLCJlbXB0eSIsImZpZWxkVHlwZSIsInRlbXBsYXRlIiwid3AiLCJyZW5kZXJlZCIsImxhYmVsIiwiJHdyYXBwZXIiLCIkcm93cyIsImFwcGVuZCIsImhhc0NsYXNzIiwiYWRkQ2xhc3MiLCIkcG9zdE1ldGFPcHRpb25zTW9kYWwiLCIkbm9LZXlGb3VuZE1lc3NhZ2UiLCIkcG9zdE1ldGFNb2RhbExvYWRlciIsIiRwb3N0TWV0YU9wdGlvbnMiLCIkcG9zdE1ldGFNb2RhbEZvb3RlciIsInBvc3RNZXRhT3B0aW9uc01vZGFsSW5zdGFuY2UiLCJyZW1vZGFsIiwiaGFzaFRyYWNraW5nIiwiJHBvc3RNZXRhRmllbGQiLCJyZXNldFBvc3RNZXRhTW9kYWwiLCJodG1sIiwicHJvcCIsIiRpbnB1dE1ldGFLZXkiLCJtZXRhS2V5IiwidmFsIiwib3BlbiIsIm9rQ2FsbGJhY2siLCJyZXNwb25zZSIsImVyckNhbGxiYWNrIiwibWVzc2FnZSIsImNvbnNvbGUiLCJsb2ciLCJmb3JtRGF0YSIsImtleSIsImFjdGlvbiIsImFqYXgiLCJwb3N0IiwiZG9uZSIsImZhaWwiLCIkdmFsdWVIb2xkZXIiLCJfcm93cyIsImVhY2giLCJpIiwiX2l0ZW0iLCJwdXNoIiwicmF3VmFsdWVzIiwiZW5jb2RlVVJJQ29tcG9uZW50IiwiSlNPTiIsInN0cmluZ2lmeSIsIiRvcHRpb25zIiwiaXNSZXBsYWNlIiwicm93cyIsImlzIiwiaW5wdXQiLCIkaW5wdXQiLCJjbG9zZSIsIiRzZWxlY3RFbG0iLCJvcmRlckJ5IiwiZGVwZW5kYW50T3B0aW9ucyIsImF0dHIiLCJjaGFuZ2UiLCJyZW1vdmVBdHRyIiwiZGlzYWJsZU9yZGVyQnlPcHRpb25zIiwiJGVsbSIsIiRvcmRlckRpcmVjdGlvbkZpZWxkIiwiJG9yZGVyVHlwZUZpZWxkIiwiJHRoaXMiLCJpbml0U29ydGFibGVGb3JOdW1iZXJNYW51YWxPcHRpb25zIiwidHJpZ2dlck51bWJlck1hbnVhbE9wdGlvbnNDaGFuZ2UiLCJ0cmlnZ2VyUmVtb3ZlTnVtYmVyT3B0aW9uIiwibWluX3ZhbHVlIiwibWF4X3ZhbHVlIiwiJGdldE9wdGlvbnMiLCIkYXV0b09wdGlvbnMiLCIkbWFudWFsT3B0aW9uc1RhYmxlIiwiZGlzcGxheVR5cGUiLCJ0b2dnbGVOdW1iZXJNaW5WYWx1ZUZpZWxkIiwiJHRleHRGaWVsZCIsInRvZ2dsZU51bWJlck1heFZhbHVlRmllbGQiLCJkZXBlbmRhbnREYXRhIiwiX3RyaWdnZXJJbnB1dFR5cGVUZXh0RGlzcGxheVR5cGVDaGFuZ2UiLCIkbm9SZXN1bHRzIiwiJGFsbEl0ZW1zTGFiZWwiLCJ1c2VDaG9zZW4iLCJfdHJpZ2dlcklucHV0VHlwZU51bWJlckRpc3BsYXlUeXBlQ2hhbmdlIiwiX3RyaWdnZXJJbnB1dFR5cGVUZXh0VXNlU2VsZWN0Q2hhbmdlIiwiX3RyaWdnZXJJbnB1dFR5cGVOdW1iZXJVc2VTZWxlY3RDaGFuZ2UiLCJfaGFuZGxlVG9nZ2xlUmVxdWVzdCIsImRhdGEiLCJjdXJyZW50U2VsZWN0b3IiLCJoYW5kbGVyVHlwZSIsImRlcGVuZGFudCIsIl92YWx1ZSIsImlkIiwiZCIsInZhbGlkVmFsdWVzIiwiaW5jbHVkZXMiLCJ0cmlnZ2VyIiwiaGFuZGxlVG9nZ2xlUmVxdWVzdCIsIiRoYW5kbGVyIiwiX3RoaXMiLCJzZXR1cFNlYXJjaEZvcm0iLCJpbml0YWwiLCJldmVudCIsInRvdGFsRmllbGRJbnN0YW5jZXMiLCJzZWFyY2hGb3JtIiwicmVtb3ZlUGxhY2Vob2xkZXIiLCJ1bmlxdWVJZCIsImVsZW1lbnRzIiwiZWxlbWVudCIsIm9sZFZhbHVlIiwibmV3VmFsdWUiLCJyZXBsYWNlIiwiaW5zZXJ0RmllbGRTdWJGaWVsZHMiLCJ0eXBlIiwicGFyc2VJbnQiLCJ3cmFwcGVyIiwicHJlcGVuZCIsInVwZGF0ZUZpZWxkc1Bvc2l0aW9uIiwiaW5wdXRzIiwibmJFbGVtcyIsImlkeCIsIm1ha2VGaWVsZFJlYWR5IiwidG9nZ2xlQnRuIiwiaWRlbnRpZmllciIsImNvbnRhaW5lciIsImNhbmNlbCIsIml0ZW1zIiwiY29ubmVjdFdpdGgiLCJzdG9wIiwic3RhcnQiLCJhcHBlbmRUbyIsInBhcmVudCIsIm9uRHJhZ1N0YXJ0Iiwib25EcmFnU3RvcCIsImRyYWdnYWJsZSIsImNvbm5lY3RUb1NvcnRhYmxlIiwiaGVscGVyIiwidG9nZ2xlRmllbGQiLCJ3aWRnZXQiLCJpbnNpZGUiLCJpc0V4cGFuZCIsInRvZ2dsZUV4cGFuZCIsInNsaWRlVG9nZ2xlIiwidG9nZ2xlQ2xhc3MiLCJmb2N1c0ZpZWxkIiwiY2xhc3NMaXN0IiwiY29udGFpbnMiLCJmb2N1cyIsInJlbW92ZUZpZWxkIiwic2xpZGVVcCIsImluaXRpYWxGb3JtU3RhdGUiLCJzZXJpYWxpemVBcnJheSIsInNob3dNZXNzYWdlIiwic2xpZGVEb3duIiwic2V0VGltZW91dCIsInNhdmVG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Q0FBVjtBQU9BO0FBRUQ7QUFDQTtBQUNBOzs7QUFDQSxTQUFTd0ksUUFBVCxHQUFvQjtBQUNuQixNQUFNQyxNQUFNLEdBQUt4TSxNQUFNLENBQUUsSUFBRixDQUF2QjtBQUNBLE1BQU0yRSxRQUFRLEdBQUd5RSxVQUFVLENBQUMrQyxjQUFYLEVBQWpCO0FBRUFLLEVBQUFBLE1BQU0sQ0FBQ2xHLElBQVAsQ0FBYSxVQUFiLEVBQXlCLFVBQXpCOztBQUVBLFdBQVNqQyxVQUFULENBQXFCRyxPQUFyQixFQUErQjtBQUM5QmdJLElBQUFBLE1BQU0sQ0FBQ2hHLFVBQVAsQ0FBbUIsVUFBbkIsRUFEOEIsQ0FHOUI7O0FBQ0EwRixJQUFBQSxnQkFBZ0IsR0FBR3ZILFFBQW5CO0FBRUF5SCxJQUFBQSxXQUFXLENBQUU1SCxPQUFGLENBQVg7QUFDQTs7QUFFRCxXQUFTRCxXQUFULENBQXNCQyxPQUF0QixFQUFnQztBQUMvQmdJLElBQUFBLE1BQU0sQ0FBQ2hHLFVBQVAsQ0FBbUIsVUFBbkI7QUFDQTRGLElBQUFBLFdBQVcsQ0FBRTVILE9BQUYsRUFBVyxPQUFYLENBQVg7QUFDQSxHQWxCa0IsQ0FvQm5COzs7QUFDQTNCLEVBQUFBLEVBQUUsQ0FBQ2lDLElBQUgsQ0FBUUMsSUFBUixDQUFjSixRQUFkLEVBQXlCSyxJQUF6QixDQUErQlgsVUFBL0IsRUFBNENZLElBQTVDLENBQWtEVixXQUFsRDtBQUNBOztBQUVEdkUsTUFBTSxDQUFFLHNCQUFGLENBQU4sQ0FBaUNLLEVBQWpDLENBQXFDLE9BQXJDLEVBQThDLFFBQTlDLEVBQXdEa00sUUFBeEQ7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6IndjLWFqYXgtcHJvZHVjdC1maWx0ZXItYWRtaW4tc2NyaXB0cy5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogVGhlIHBvc3QgbWV0YSBmaWVsZC5cbiAqXG4gKiBAc2luY2UgICAgICAxLjAuMFxuICogQHBhY2thZ2UgICAgd2MtYWpheC1wcm9kdWN0LWZpbHRlci1wcm9cbiAqIEBzdWJwYWNrYWdlIHdjLWFqYXgtcHJvZHVjdC1maWx0ZXItcHJvL2FkbWluL3NyYy9qc1xuICogQGF1dGhvciAgICAgTWFpbnVsIEhhc3NhbiBNYWluXG4gKi9cblxualF1ZXJ5KCBkb2N1bWVudCApLnJlYWR5KCBmdW5jdGlvbiggJCApIHtcblxuXHRjb25zdCAkc2VhcmNoRm9ybSA9ICQoICcjc2VhcmNoLWZvcm0nICk7XG5cblx0JHNlYXJjaEZvcm0ub24oICdhZnRlcl90b2dnbGVfcmVxdWVzdCcsIGZ1bmN0aW9uKCBlLCBoYW5kbGVyLCB2YWx1ZSwgJGZpZWxkICkge1xuXHRcdGlmICggJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1jdXN0b20tdGF4b25vbXkgc2VsZWN0JyA9PT0gaGFuZGxlciApIHtcblx0XHRcdGNvbnN0IHBhcmFtcyAgICAgICAgICAgPSB3aW5kb3dbICd3Y2FwZl9hZG1pbl9wYXJhbXMnIF07XG5cdFx0XHRjb25zdCBoaWVyYXJjaGljYWxEYXRhID0gcGFyYW1zWyAndGF4b25vbXlfaGllcmFyY2hpY2FsX2RhdGEnIF07XG5cblx0XHRcdGlmICggISBoaWVyYXJjaGljYWxEYXRhICkge1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdGNvbnN0IGlzSGllcmFyY2hpY2FsICAgPSBoaWVyYXJjaGljYWxEYXRhWyB2YWx1ZSBdO1xuXHRcdFx0Y29uc3QgJGRlcGVuZGFudEZpZWxkcyA9ICRmaWVsZC5maW5kKFxuXHRcdFx0XHQnLndjYXBmLWZvcm0tc3ViLWZpZWxkLWhpZXJhcmNoaWNhbCwgLndjYXBmLWZvcm0tc3ViLWZpZWxkLXNob3dfY2hpbGRyZW5fb25seSdcblx0XHRcdCk7XG5cblx0XHRcdGlmICggaXNIaWVyYXJjaGljYWwgKSB7XG5cdFx0XHRcdCRkZXBlbmRhbnRGaWVsZHMuc2hvdygpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0JGRlcGVuZGFudEZpZWxkcy5oaWRlKCk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9ICk7XG5cblx0ZnVuY3Rpb24gaW5pdFNvcnRhYmxlRm9yTWFudWFsT3B0aW9ucyggJHNlbGVjdG9yICkge1xuXHRcdCRzZWxlY3Rvci5zb3J0YWJsZSgge1xuXHRcdFx0b3BhY2l0eTogMC44LFxuXHRcdFx0cmV2ZXJ0OiBmYWxzZSxcblx0XHRcdGN1cnNvcjogJ21vdmUnLFxuXHRcdFx0YXhpczogJ3knLFxuXHRcdFx0aGFuZGxlOiAnLm1vdmUtb3B0aW9ucy1oYW5kbGVyJyxcblx0XHRcdHBsYWNlaG9sZGVyOiAnd2lkZ2V0LXBsYWNlaG9sZGVyJyxcblx0XHRcdHVwZGF0ZTogZnVuY3Rpb24oIGUgKSB7XG5cdFx0XHRcdGNvbnN0ICRmaWVsZCA9ICQoIGUudGFyZ2V0ICkuY2xvc2VzdCggJy53Y2FwZi1mb3JtLWZpZWxkJyApO1xuXG5cdFx0XHRcdHRyaWdnZXJNYW51YWxPcHRpb25zQ2hhbmdlKCAkZmllbGQgKTtcblx0XHRcdH1cblx0XHR9ICkuZGlzYWJsZVNlbGVjdGlvbigpO1xuXHR9XG5cblx0Ly8gU29ydCBNYW51YWwgT3B0aW9uc1xuXHRpbml0U29ydGFibGVGb3JNYW51YWxPcHRpb25zKCAkc2VhcmNoRm9ybS5maW5kKCAnLm1hbnVhbC1vcHRpb25zLXRhYmxlIC5tYW51YWwtb3B0aW9ucy10YWJsZS1ib2R5LXJvd3MnICkgKTtcblxuXHQkc2VhcmNoRm9ybS5vbiggJ2ZpZWxkX2FkZGVkJywgZnVuY3Rpb24oIGUsIHVpICkge1xuXHRcdC8vIEluaXQgU29ydGFibGUgZm9yIHRoZSBtYW51YWwgb3B0aW9ucy5cblx0XHRpbml0U29ydGFibGVGb3JNYW51YWxPcHRpb25zKCAkKCB1aS5pdGVtLmZpbmQoICcubWFudWFsLW9wdGlvbnMtdGFibGUtYm9keS1yb3dzJyApICkgKTtcblx0fSApO1xuXG5cdGZ1bmN0aW9uIHRyaWdnZXJSZW1vdmVPcHRpb24oICRmaWVsZCApIHtcblx0XHRjb25zdCAkb3B0aW9uc1RhYmxlID0gJGZpZWxkLmZpbmQoICcubWFudWFsLW9wdGlvbnMtdGFibGUnICk7XG5cdFx0Y29uc3QgdGFibGVSb3dzICAgICA9ICRvcHRpb25zVGFibGUuZmluZCggJy5tYW51YWwtb3B0aW9ucy10YWJsZS1ib2R5LXJvd3MnICkuY2hpbGRyZW4oKTtcblxuXHRcdGlmICggMiA+IHRhYmxlUm93cy5sZW5ndGggKSB7XG5cdFx0XHQkb3B0aW9uc1RhYmxlLnJlbW92ZUNsYXNzKCAnaGFzLW9wdGlvbnMnICk7XG5cdFx0fVxuXHR9XG5cblx0Ly8gUmVtb3ZlIFNpbmdsZSBPcHRpb25cblx0JHNlYXJjaEZvcm0ub24oICdjbGljaycsICcucmVtb3ZlLW9wdGlvbicsIGZ1bmN0aW9uKCkge1xuXHRcdGNvbnN0ICRpdGVtICA9ICQoIHRoaXMgKS5jbG9zZXN0KCAnLml0ZW0nICk7XG5cdFx0Y29uc3QgJGZpZWxkID0gJGl0ZW0uY2xvc2VzdCggJy53Y2FwZi1mb3JtLWZpZWxkJyApO1xuXG5cdFx0dHJpZ2dlclJlbW92ZU9wdGlvbiggJGZpZWxkICk7XG5cblx0XHQkaXRlbS5yZW1vdmUoKTtcblxuXHRcdHRyaWdnZXJNYW51YWxPcHRpb25zQ2hhbmdlKCAkZmllbGQgKTtcblx0fSApO1xuXG5cdC8vIENsZWFyIEFsbCBPcHRpb25zXG5cdCRzZWFyY2hGb3JtLm9uKCAnY2xpY2snLCAnLmNsZWFyLWFsbC1vcHRpb25zJywgZnVuY3Rpb24oKSB7XG5cdFx0Y29uc3QgJGZpZWxkICAgICAgICA9ICQoIHRoaXMgKS5jbG9zZXN0KCAnLndjYXBmLWZvcm0tZmllbGQnICk7XG5cdFx0Y29uc3QgJG9wdGlvbnNUYWJsZSA9ICRmaWVsZC5maW5kKCAnLm1hbnVhbC1vcHRpb25zLXRhYmxlJyApO1xuXG5cdFx0JG9wdGlvbnNUYWJsZS5maW5kKCAnLm1hbnVhbC1vcHRpb25zLXRhYmxlLWJvZHktcm93cycgKS5lbXB0eSgpO1xuXG5cdFx0dHJpZ2dlclJlbW92ZU9wdGlvbiggJGZpZWxkICk7XG5cblx0XHR0cmlnZ2VyTWFudWFsT3B0aW9uc0NoYW5nZSggJGZpZWxkICk7XG5cdH0gKTtcblxuXHQvLyBBZGQgTmV3IE9wdGlvblxuXHQkc2VhcmNoRm9ybS5vbiggJ2NsaWNrJywgJy5hZGQtb3B0aW9uJywgZnVuY3Rpb24oKSB7XG5cdFx0Y29uc3QgZmllbGRUeXBlID0gJ3djYXBmLXBvc3QtbWV0YS1vcHRpb24nO1xuXG5cdFx0Ly8gQmFpbCBvdXQgaWYgbm8gdG1wbCBmb3VuZCBmb3IgdGhlIHR5cGUuXG5cdFx0aWYgKCAhIGpRdWVyeSggJyN0bXBsLScgKyBmaWVsZFR5cGUgKS5sZW5ndGggKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0Y29uc3QgJGZpZWxkID0gJCggdGhpcyApLmNsb3Nlc3QoICcud2NhcGYtZm9ybS1maWVsZCcgKTtcblxuXHRcdGNvbnN0IHRlbXBsYXRlID0gd3AudGVtcGxhdGUoIGZpZWxkVHlwZSApO1xuXHRcdGNvbnN0IHJlbmRlcmVkID0gdGVtcGxhdGUoIHsgdmFsdWU6ICcnLCBsYWJlbDogJycgfSApO1xuXHRcdGNvbnN0ICR3cmFwcGVyID0gJGZpZWxkLmZpbmQoICcubWFudWFsLW9wdGlvbnMtdGFibGUnICk7XG5cdFx0Y29uc3QgJHJvd3MgICAgPSAkd3JhcHBlci5maW5kKCAnLm1hbnVhbC1vcHRpb25zLXRhYmxlLWJvZHktcm93cycgKTtcblxuXHRcdCRyb3dzLmFwcGVuZCggcmVuZGVyZWQgKTtcblxuXHRcdGlmICggISAkd3JhcHBlci5oYXNDbGFzcyggJ2hhcy1vcHRpb25zJyApICkge1xuXHRcdFx0JHdyYXBwZXIuYWRkQ2xhc3MoICdoYXMtb3B0aW9ucycgKTtcblx0XHR9XG5cdH0gKTtcblxuXHRjb25zdCAkcG9zdE1ldGFPcHRpb25zTW9kYWwgPSAkKCAnLnBvc3QtbWV0YS1vcHRpb25zLW1vZGFsJyApO1xuXHRjb25zdCAkbm9LZXlGb3VuZE1lc3NhZ2UgICAgPSAkcG9zdE1ldGFPcHRpb25zTW9kYWwuZmluZCggJy5uby1rZXktZm91bmQtbWVzc2FnZScgKTtcblx0Y29uc3QgJHBvc3RNZXRhTW9kYWxMb2FkZXIgID0gJHBvc3RNZXRhT3B0aW9uc01vZGFsLmZpbmQoICcucG9zdC1tZXRhLW9wdGlvbnMtbG9hZGVyJyApO1xuXHRjb25zdCAkcG9zdE1ldGFPcHRpb25zICAgICAgPSAkcG9zdE1ldGFPcHRpb25zTW9kYWwuZmluZCggJy5wb3N0LW1ldGEtb3B0aW9ucycgKTtcblx0Y29uc3QgJHBvc3RNZXRhTW9kYWxGb290ZXIgID0gJHBvc3RNZXRhT3B0aW9uc01vZGFsLmZpbmQoICcud2NhcGYtbW9kYWwtZm9vdGVyJyApO1xuXG5cdGNvbnN0IHBvc3RNZXRhT3B0aW9uc01vZGFsSW5zdGFuY2UgPSAkcG9zdE1ldGFPcHRpb25zTW9kYWwucmVtb2RhbCgge1xuXHRcdGhhc2hUcmFja2luZzogZmFsc2UsXG5cdH0gKTtcblxuXHRsZXQgJHBvc3RNZXRhRmllbGQgPSBudWxsO1xuXG5cdGZ1bmN0aW9uIHJlc2V0UG9zdE1ldGFNb2RhbCgpIHtcblx0XHQkcG9zdE1ldGFPcHRpb25zLmh0bWwoICcnICk7XG5cdFx0JHBvc3RNZXRhTW9kYWxMb2FkZXIucmVtb3ZlQ2xhc3MoICdhY3RpdmUnICk7XG5cdFx0JG5vS2V5Rm91bmRNZXNzYWdlLnJlbW92ZUNsYXNzKCAnYWN0aXZlJyApO1xuXHRcdCRwb3N0TWV0YU1vZGFsRm9vdGVyLnJlbW92ZUNsYXNzKCAnYWN0aXZlJyApO1xuXHRcdCRwb3N0TWV0YU9wdGlvbnNNb2RhbC5maW5kKCAnLnJlcGxhY2UtY3VycmVudC1vcHRpb25zJyApLnByb3AoICdjaGVja2VkJywgZmFsc2UgKTtcblx0fVxuXG5cdC8vIEJyb3dzZSBWYWx1ZXNcblx0JHNlYXJjaEZvcm0ub24oICdjbGljaycsICcuYnJvd3NlLXZhbHVlcycsIGZ1bmN0aW9uKCkge1xuXHRcdHJlc2V0UG9zdE1ldGFNb2RhbCgpO1xuXG5cdFx0Y29uc3QgJGZpZWxkICAgICAgICA9ICQoIHRoaXMgKS5jbG9zZXN0KCAnLndjYXBmLWZvcm0tZmllbGQnICk7XG5cdFx0Y29uc3QgJGlucHV0TWV0YUtleSA9ICRmaWVsZC5maW5kKCAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLW1ldGFfa2V5IHNlbGVjdCcgKTtcblx0XHRjb25zdCBtZXRhS2V5ICAgICAgID0gJGlucHV0TWV0YUtleS52YWwoKTtcblxuXHRcdGlmICggISBtZXRhS2V5ICkge1xuXHRcdFx0JG5vS2V5Rm91bmRNZXNzYWdlLmFkZENsYXNzKCAnYWN0aXZlJyApO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHQkbm9LZXlGb3VuZE1lc3NhZ2UucmVtb3ZlQ2xhc3MoICdhY3RpdmUnICk7XG5cdFx0fVxuXG5cdFx0cG9zdE1ldGFPcHRpb25zTW9kYWxJbnN0YW5jZS5vcGVuKCk7XG5cdFx0JHBvc3RNZXRhRmllbGQgPSAkZmllbGQ7XG5cblx0XHRpZiAoICEgbWV0YUtleSApIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHQvLyBTaG93IHRoZSBsb2FkaW5nIGFuaW1hdGlvbi5cblx0XHQkcG9zdE1ldGFNb2RhbExvYWRlci5hZGRDbGFzcyggJ2FjdGl2ZScgKTtcblxuXHRcdC8qKlxuXHRcdCAqIEFqYXgncyBzdWNjZXNzIGZ1bmN0aW9uLlxuXHRcdCAqXG5cdFx0ICogQHBhcmFtIHJlc3BvbnNlXG5cdFx0ICovXG5cdFx0ZnVuY3Rpb24gb2tDYWxsYmFjayggcmVzcG9uc2UgKSB7XG5cdFx0XHQvLyBIaWRlIHRoZSBsb2FkaW5nIGFuaW1hdGlvbi5cblx0XHRcdCRwb3N0TWV0YU1vZGFsTG9hZGVyLnJlbW92ZUNsYXNzKCAnYWN0aXZlJyApO1xuXHRcdFx0JHBvc3RNZXRhTW9kYWxGb290ZXIuYWRkQ2xhc3MoICdhY3RpdmUnICk7XG5cblx0XHRcdCRwb3N0TWV0YU9wdGlvbnMuaHRtbCggcmVzcG9uc2UgKTtcblx0XHR9XG5cblx0XHQvKipcblx0XHQgKiBBamF4J3MgZXJyb3IgZnVuY3Rpb24uXG5cdFx0ICpcblx0XHQgKiBAcGFyYW0gbWVzc2FnZVxuXHRcdCAqL1xuXHRcdGZ1bmN0aW9uIGVyckNhbGxiYWNrKCBtZXNzYWdlICkge1xuXHRcdFx0Y29uc29sZS5sb2coICdlcnJvcicsIG1lc3NhZ2UgKTtcblxuXHRcdFx0Ly8gSGlkZSB0aGUgbG9hZGluZyBhbmltYXRpb24uXG5cdFx0XHQkcG9zdE1ldGFNb2RhbExvYWRlci5yZW1vdmVDbGFzcyggJ2FjdGl2ZScgKTtcblx0XHR9XG5cblx0XHRjb25zdCBmb3JtRGF0YSA9IHtcblx0XHRcdGtleTogbWV0YUtleSxcblx0XHRcdGFjdGlvbjogJ3djYXBmX2dldF9tZXRhX29wdGlvbnMnLFxuXHRcdH1cblxuXHRcdC8vIGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vYS81OTE4MTI1MlxuXHRcdHdwLmFqYXgucG9zdCggZm9ybURhdGEgKS5kb25lKCBva0NhbGxiYWNrICkuZmFpbCggZXJyQ2FsbGJhY2sgKTtcblx0fSApO1xuXG5cdC8qKlxuXHQgKiBSZXNldCB0aGUgcG9zdCBtZXRhIG9wdGlvbidzIG1vZGFsIHdoZW4gbW9kYWwgZ2V0cyBjbG9zZWQuXG5cdCAqL1xuXHQkKCBkb2N1bWVudCApLm9uKCAnY2xvc2VkJywgJHBvc3RNZXRhT3B0aW9uc01vZGFsLCBmdW5jdGlvbigpIHtcblx0XHRyZXNldFBvc3RNZXRhTW9kYWwoKTtcblx0XHQkcG9zdE1ldGFGaWVsZCA9IG51bGw7XG5cdH0gKTtcblxuXHQvLyBVbnNlbGVjdCBhbGwgdmFsdWVzLlxuXHQkcG9zdE1ldGFPcHRpb25zTW9kYWwub24oICdjbGljaycsICcuc2VsZWN0LW5vbmUnLCBmdW5jdGlvbigpIHtcblx0XHQkcG9zdE1ldGFPcHRpb25zLmZpbmQoICdbdHlwZT1cImNoZWNrYm94XCJdJyApLnByb3AoICdjaGVja2VkJywgZmFsc2UgKTtcblx0fSApO1xuXG5cdC8vIFNlbGVjdCBhbGwgdmFsdWVzLlxuXHQkcG9zdE1ldGFPcHRpb25zTW9kYWwub24oICdjbGljaycsICcuc2VsZWN0LWFsbCcsIGZ1bmN0aW9uKCkge1xuXHRcdCRwb3N0TWV0YU9wdGlvbnMuZmluZCggJ1t0eXBlPVwiY2hlY2tib3hcIl0nICkucHJvcCggJ2NoZWNrZWQnLCB0cnVlICk7XG5cdH0gKTtcblxuXHRmdW5jdGlvbiB0cmlnZ2VyTWFudWFsT3B0aW9uc0NoYW5nZSggJHBvc3RNZXRhRmllbGQgKSB7XG5cdFx0Y29uc3QgJHZhbHVlSG9sZGVyICA9ICRwb3N0TWV0YUZpZWxkLmZpbmQoICcud2NhcGYtZm9ybS1zdWItZmllbGQtbWFudWFsX29wdGlvbnMgaW5wdXQnICk7XG5cdFx0Y29uc3QgJG9wdGlvbnNUYWJsZSA9ICRwb3N0TWV0YUZpZWxkLmZpbmQoICcubWFudWFsLW9wdGlvbnMtdGFibGUnICk7XG5cdFx0Y29uc3QgJHJvd3MgICAgICAgICA9ICRvcHRpb25zVGFibGUuZmluZCggJy5tYW51YWwtb3B0aW9ucy10YWJsZS1ib2R5LXJvd3MnICk7XG5cdFx0Y29uc3QgX3Jvd3MgICAgICAgICA9IFtdO1xuXG5cdFx0JHJvd3MuZmluZCggJy5pdGVtJyApLmVhY2goIGZ1bmN0aW9uKCBpLCBfaXRlbSApIHtcblx0XHRcdGNvbnN0ICRpdGVtID0gJCggX2l0ZW0gKTtcblx0XHRcdGNvbnN0IHZhbHVlID0gJGl0ZW0uZmluZCggJy5vcHRpb25fdmFsdWUnICkudmFsKCk7XG5cdFx0XHRjb25zdCBsYWJlbCA9ICRpdGVtLmZpbmQoICcub3B0aW9uX2xhYmVsJyApLnZhbCgpO1xuXG5cdFx0XHRpZiAoIHZhbHVlICYmIGxhYmVsICkge1xuXHRcdFx0XHRfcm93cy5wdXNoKCBbIHZhbHVlLCBsYWJlbCBdICk7XG5cdFx0XHR9XG5cdFx0fSApO1xuXG5cdFx0Y29uc3QgcmF3VmFsdWVzID0gZW5jb2RlVVJJQ29tcG9uZW50KCBKU09OLnN0cmluZ2lmeSggX3Jvd3MgKSApO1xuXHRcdCR2YWx1ZUhvbGRlci52YWwoIHJhd1ZhbHVlcyApO1xuXHR9XG5cblx0Ly8gQWRkIHNlbGVjdGVkIG9wdGlvbnMuXG5cdCRwb3N0TWV0YU9wdGlvbnNNb2RhbC5vbiggJ2NsaWNrJywgJy5hZGQtb3B0aW9ucycsIGZ1bmN0aW9uKCkge1xuXHRcdGNvbnN0ICRvcHRpb25zID0gJHBvc3RNZXRhT3B0aW9ucy5maW5kKCAnW3R5cGU9XCJjaGVja2JveFwiXScgKTtcblx0XHRsZXQgaXNSZXBsYWNlICA9IGZhbHNlO1xuXHRcdGxldCByb3dzICAgICAgID0gJyc7XG5cblx0XHRpZiAoICRwb3N0TWV0YU1vZGFsRm9vdGVyLmZpbmQoICcucmVwbGFjZS1jdXJyZW50LW9wdGlvbnMnICkuaXMoICc6Y2hlY2tlZCcgKSApIHtcblx0XHRcdGlzUmVwbGFjZSA9IHRydWU7XG5cdFx0fVxuXG5cdFx0aWYgKCAkb3B0aW9ucyApIHtcblx0XHRcdGNvbnN0IGZpZWxkVHlwZSA9ICd3Y2FwZi1wb3N0LW1ldGEtb3B0aW9uJztcblxuXHRcdFx0JC5lYWNoKCAkb3B0aW9ucywgZnVuY3Rpb24oIGksIGlucHV0ICkge1xuXHRcdFx0XHRjb25zdCAkaW5wdXQgPSAkKCBpbnB1dCApO1xuXHRcdFx0XHRjb25zdCB2YWx1ZSAgPSAkaW5wdXQudmFsKCk7XG5cblx0XHRcdFx0aWYgKCAkaW5wdXQuaXMoICc6Y2hlY2tlZCcgKSApIHtcblx0XHRcdFx0XHRjb25zdCB0ZW1wbGF0ZSA9IHdwLnRlbXBsYXRlKCBmaWVsZFR5cGUgKTtcblx0XHRcdFx0XHRjb25zdCByZW5kZXJlZCA9IHRlbXBsYXRlKCB7IHZhbHVlLCBsYWJlbDogdmFsdWUgfSApO1xuXG5cdFx0XHRcdFx0cm93cyArPSByZW5kZXJlZDtcblx0XHRcdFx0fVxuXHRcdFx0fSApO1xuXHRcdH1cblxuXHRcdGlmICggcm93cyApIHtcblx0XHRcdGNvbnN0ICR3cmFwcGVyID0gJHBvc3RNZXRhRmllbGQuZmluZCggJy5tYW51YWwtb3B0aW9ucy10YWJsZScgKTtcblx0XHRcdGNvbnN0ICRyb3dzICAgID0gJHdyYXBwZXIuZmluZCggJy5tYW51YWwtb3B0aW9ucy10YWJsZS1ib2R5LXJvd3MnICk7XG5cblx0XHRcdGlmICggaXNSZXBsYWNlICkge1xuXHRcdFx0XHQkcm93cy5odG1sKCByb3dzICk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHQkcm93cy5hcHBlbmQoIHJvd3MgKTtcblx0XHRcdH1cblxuXHRcdFx0aWYgKCAhICR3cmFwcGVyLmhhc0NsYXNzKCAnaGFzLW9wdGlvbnMnICkgKSB7XG5cdFx0XHRcdCR3cmFwcGVyLmFkZENsYXNzKCAnaGFzLW9wdGlvbnMnICk7XG5cdFx0XHR9XG5cblx0XHRcdHRyaWdnZXJNYW51YWxPcHRpb25zQ2hhbmdlKCAkcG9zdE1ldGFGaWVsZCApO1xuXHRcdH1cblxuXHRcdHBvc3RNZXRhT3B0aW9uc01vZGFsSW5zdGFuY2UuY2xvc2UoKTtcblx0fSApO1xuXG5cdCRzZWFyY2hGb3JtLm9uKCAnYWZ0ZXJfdG9nZ2xlX3JlcXVlc3QnLCBmdW5jdGlvbiggZSwgaGFuZGxlciwgdmFsdWUsICRmaWVsZCApIHtcblx0XHRpZiAoICcud2NhcGYtZm9ybS1zdWItZmllbGQtZ2V0X29wdGlvbnMgaW5wdXQnID09PSBoYW5kbGVyICkge1xuXHRcdFx0Y29uc3QgJHNlbGVjdEVsbSAgICAgICA9ICRmaWVsZC5maW5kKCAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLW9wdGlvbnNfb3JkZXJfYnkgc2VsZWN0JyApO1xuXHRcdFx0Y29uc3Qgb3JkZXJCeSAgICAgICAgICA9ICRzZWxlY3RFbG0udmFsKCk7XG5cdFx0XHRjb25zdCBkZXBlbmRhbnRPcHRpb25zID0gJ29wdGlvblt2YWx1ZT1cImxhYmVsXCJdJztcblxuXHRcdFx0aWYgKCAnYXV0b21hdGljYWxseScgPT09IHZhbHVlICkge1xuXHRcdFx0XHQkc2VsZWN0RWxtLmNoaWxkcmVuKCBkZXBlbmRhbnRPcHRpb25zICkuYXR0ciggJ2Rpc2FibGVkJywgJ2Rpc2FibGVkJyApO1xuXG5cdFx0XHRcdGlmICggJ2xhYmVsJyA9PT0gb3JkZXJCeSApIHtcblx0XHRcdFx0XHQkc2VsZWN0RWxtLnByb3AoICdzZWxlY3RlZEluZGV4JywgMSApLmNoYW5nZSgpO1xuXHRcdFx0XHR9XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHQkc2VsZWN0RWxtLmNoaWxkcmVuKCBkZXBlbmRhbnRPcHRpb25zICkucmVtb3ZlQXR0ciggJ2Rpc2FibGVkJyApO1xuXHRcdFx0fVxuXHRcdH1cblx0fSApO1xuXG5cdGZ1bmN0aW9uIGRpc2FibGVPcmRlckJ5T3B0aW9ucyggJGVsbSApIHtcblx0XHRjb25zdCB2YWx1ZSAgICAgICAgICAgICAgICA9ICRlbG0udmFsKCk7XG5cdFx0Y29uc3QgJHdyYXBwZXIgICAgICAgICAgICAgPSAkZWxtLmNsb3Nlc3QoICcud2NhcGYtcG9zdC1tZXRhLW9yZGVyLW9wdGlvbnMtZmllbGQnICk7XG5cdFx0Y29uc3QgJG9yZGVyRGlyZWN0aW9uRmllbGQgPSAkd3JhcHBlci5maW5kKCAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLW9wdGlvbnNfb3JkZXJfZGlyIHNlbGVjdCcgKTtcblx0XHRjb25zdCAkb3JkZXJUeXBlRmllbGQgICAgICA9ICR3cmFwcGVyLmZpbmQoICcud2NhcGYtZm9ybS1zdWItZmllbGQtb3B0aW9uc19vcmRlcl90eXBlIHNlbGVjdCcgKTtcblxuXHRcdGlmICggJ25vbmUnID09PSB2YWx1ZSApIHtcblx0XHRcdCRvcmRlckRpcmVjdGlvbkZpZWxkLmF0dHIoICdkaXNhYmxlZCcsICdkaXNhYmxlZCcgKTtcblx0XHRcdCRvcmRlclR5cGVGaWVsZC5hdHRyKCAnZGlzYWJsZWQnLCAnZGlzYWJsZWQnICk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdCRvcmRlckRpcmVjdGlvbkZpZWxkLnJlbW92ZUF0dHIoICdkaXNhYmxlZCcgKTtcblx0XHRcdCRvcmRlclR5cGVGaWVsZC5yZW1vdmVBdHRyKCAnZGlzYWJsZWQnICk7XG5cdFx0fVxuXHR9XG5cblx0JHNlYXJjaEZvcm0uZmluZCggJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1vcHRpb25zX29yZGVyX2J5IHNlbGVjdCcgKS5lYWNoKCBmdW5jdGlvbigpIHtcblx0XHRjb25zdCAkdGhpcyA9ICQoIHRoaXMgKTtcblxuXHRcdGRpc2FibGVPcmRlckJ5T3B0aW9ucyggJHRoaXMgKTtcblx0fSApO1xuXG5cdCRzZWFyY2hGb3JtLm9uKCAnY2hhbmdlJywgJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1vcHRpb25zX29yZGVyX2J5IHNlbGVjdCcsIGZ1bmN0aW9uKCkge1xuXHRcdGNvbnN0ICR0aGlzID0gJCggdGhpcyApO1xuXG5cdFx0ZGlzYWJsZU9yZGVyQnlPcHRpb25zKCAkdGhpcyApO1xuXHR9ICk7XG5cblx0JHNlYXJjaEZvcm0ub24oICdpbnB1dCcsICcubWFudWFsLW9wdGlvbnMtdGFibGUgaW5wdXRbdHlwZT1cInRleHRcIl0nLCBmdW5jdGlvbigpIHtcblx0XHRjb25zdCAkZmllbGQgPSAkKCB0aGlzICkuY2xvc2VzdCggJy53Y2FwZi1mb3JtLWZpZWxkJyApO1xuXG5cdFx0dHJpZ2dlck1hbnVhbE9wdGlvbnNDaGFuZ2UoICRmaWVsZCApO1xuXHR9ICk7XG5cblx0LyoqXG5cdCAqIFZhbHVlIHR5cGUgJ051bWJlcidcblx0ICovXG5cblx0ZnVuY3Rpb24gaW5pdFNvcnRhYmxlRm9yTnVtYmVyTWFudWFsT3B0aW9ucyggJHNlbGVjdG9yICkge1xuXHRcdCRzZWxlY3Rvci5zb3J0YWJsZSgge1xuXHRcdFx0b3BhY2l0eTogMC44LFxuXHRcdFx0cmV2ZXJ0OiBmYWxzZSxcblx0XHRcdGN1cnNvcjogJ21vdmUnLFxuXHRcdFx0YXhpczogJ3knLFxuXHRcdFx0aGFuZGxlOiAnLm1vdmUtb3B0aW9ucy1oYW5kbGVyJyxcblx0XHRcdHBsYWNlaG9sZGVyOiAnd2lkZ2V0LXBsYWNlaG9sZGVyJyxcblx0XHRcdHVwZGF0ZTogZnVuY3Rpb24oIGUgKSB7XG5cdFx0XHRcdGNvbnN0ICRmaWVsZCA9ICQoIGUudGFyZ2V0ICkuY2xvc2VzdCggJy53Y2FwZi1mb3JtLWZpZWxkJyApO1xuXG5cdFx0XHRcdHRyaWdnZXJOdW1iZXJNYW51YWxPcHRpb25zQ2hhbmdlKCAkZmllbGQgKTtcblx0XHRcdH1cblx0XHR9ICkuZGlzYWJsZVNlbGVjdGlvbigpO1xuXHR9XG5cblx0Ly8gU29ydCBOdW1iZXIgTWFudWFsIE9wdGlvbnNcblx0aW5pdFNvcnRhYmxlRm9yTnVtYmVyTWFudWFsT3B0aW9ucyggJHNlYXJjaEZvcm0uZmluZCggJy5udW1iZXItbWFudWFsLW9wdGlvbnMtdGFibGUgLm1hbnVhbC1vcHRpb25zLXRhYmxlLWJvZHktcm93cycgKSApO1xuXG5cdCRzZWFyY2hGb3JtLm9uKCAnZmllbGRfYWRkZWQnLCBmdW5jdGlvbiggZSwgdWkgKSB7XG5cdFx0Ly8gSW5pdCBTb3J0YWJsZSBmb3IgdGhlIG51bWJlciBtYW51YWwgb3B0aW9ucy5cblx0XHRpbml0U29ydGFibGVGb3JOdW1iZXJNYW51YWxPcHRpb25zKCAkKCB1aS5pdGVtLmZpbmQoICcubWFudWFsLW9wdGlvbnMtdGFibGUtYm9keS1yb3dzJyApICkgKTtcblx0fSApO1xuXG5cdGZ1bmN0aW9uIHRyaWdnZXJSZW1vdmVOdW1iZXJPcHRpb24oICRmaWVsZCApIHtcblx0XHRjb25zdCAkb3B0aW9uc1RhYmxlID0gJGZpZWxkLmZpbmQoICcubnVtYmVyLW1hbnVhbC1vcHRpb25zLXRhYmxlJyApO1xuXHRcdGNvbnN0IHRhYmxlUm93cyAgICAgPSAkb3B0aW9uc1RhYmxlLmZpbmQoICcubWFudWFsLW9wdGlvbnMtdGFibGUtYm9keS1yb3dzJyApLmNoaWxkcmVuKCk7XG5cblx0XHRpZiAoIDIgPiB0YWJsZVJvd3MubGVuZ3RoICkge1xuXHRcdFx0JG9wdGlvbnNUYWJsZS5yZW1vdmVDbGFzcyggJ2hhcy1vcHRpb25zJyApO1xuXHRcdH1cblx0fVxuXG5cdGZ1bmN0aW9uIHRyaWdnZXJOdW1iZXJNYW51YWxPcHRpb25zQ2hhbmdlKCAkcG9zdE1ldGFGaWVsZCApIHtcblx0XHRjb25zdCAkdmFsdWVIb2xkZXIgID0gJHBvc3RNZXRhRmllbGQuZmluZCggJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1udW1iZXJfbWFudWFsX29wdGlvbnMgaW5wdXQnICk7XG5cdFx0Y29uc3QgJG9wdGlvbnNUYWJsZSA9ICRwb3N0TWV0YUZpZWxkLmZpbmQoICcubnVtYmVyLW1hbnVhbC1vcHRpb25zLXRhYmxlJyApO1xuXHRcdGNvbnN0ICRyb3dzICAgICAgICAgPSAkb3B0aW9uc1RhYmxlLmZpbmQoICcubWFudWFsLW9wdGlvbnMtdGFibGUtYm9keS1yb3dzJyApO1xuXHRcdGNvbnN0IF9yb3dzICAgICAgICAgPSBbXTtcblxuXHRcdCRyb3dzLmZpbmQoICcuaXRlbScgKS5lYWNoKCBmdW5jdGlvbiggaSwgX2l0ZW0gKSB7XG5cdFx0XHRjb25zdCAkaXRlbSAgICAgPSAkKCBfaXRlbSApO1xuXHRcdFx0Y29uc3QgbWluX3ZhbHVlID0gJGl0ZW0uZmluZCggJy5vcHRpb25fbWluX3ZhbHVlJyApLnZhbCgpO1xuXHRcdFx0Y29uc3QgbWF4X3ZhbHVlID0gJGl0ZW0uZmluZCggJy5vcHRpb25fbWF4X3ZhbHVlJyApLnZhbCgpO1xuXHRcdFx0Y29uc3QgbGFiZWwgICAgID0gJGl0ZW0uZmluZCggJy5vcHRpb25fbGFiZWwnICkudmFsKCk7XG5cblx0XHRcdGlmICggbWluX3ZhbHVlICYmIG1heF92YWx1ZSAmJiBsYWJlbCApIHtcblx0XHRcdFx0X3Jvd3MucHVzaCggWyBtaW5fdmFsdWUsIG1heF92YWx1ZSwgbGFiZWwgXSApO1xuXHRcdFx0fVxuXHRcdH0gKTtcblxuXHRcdGNvbnN0IHJhd1ZhbHVlcyA9IGVuY29kZVVSSUNvbXBvbmVudCggSlNPTi5zdHJpbmdpZnkoIF9yb3dzICkgKTtcblx0XHQkdmFsdWVIb2xkZXIudmFsKCByYXdWYWx1ZXMgKTtcblx0fVxuXG5cdC8vIFJlbW92ZSBTaW5nbGUgTnVtYmVyIE9wdGlvblxuXHQkc2VhcmNoRm9ybS5vbiggJ2NsaWNrJywgJy5yZW1vdmUtbnVtYmVyLW9wdGlvbicsIGZ1bmN0aW9uKCkge1xuXHRcdGNvbnN0ICRpdGVtICA9ICQoIHRoaXMgKS5jbG9zZXN0KCAnLml0ZW0nICk7XG5cdFx0Y29uc3QgJGZpZWxkID0gJGl0ZW0uY2xvc2VzdCggJy53Y2FwZi1mb3JtLWZpZWxkJyApO1xuXG5cdFx0dHJpZ2dlclJlbW92ZU51bWJlck9wdGlvbiggJGZpZWxkICk7XG5cblx0XHQkaXRlbS5yZW1vdmUoKTtcblxuXHRcdHRyaWdnZXJOdW1iZXJNYW51YWxPcHRpb25zQ2hhbmdlKCAkZmllbGQgKTtcblx0fSApO1xuXG5cdC8vIENsZWFyIEFsbCBPcHRpb25zXG5cdCRzZWFyY2hGb3JtLm9uKCAnY2xpY2snLCAnLmNsZWFyLWFsbC1udW1iZXItb3B0aW9ucycsIGZ1bmN0aW9uKCkge1xuXHRcdGNvbnN0ICRmaWVsZCAgICAgICAgPSAkKCB0aGlzICkuY2xvc2VzdCggJy53Y2FwZi1mb3JtLWZpZWxkJyApO1xuXHRcdGNvbnN0ICRvcHRpb25zVGFibGUgPSAkZmllbGQuZmluZCggJy5udW1iZXItbWFudWFsLW9wdGlvbnMtdGFibGUnICk7XG5cblx0XHQkb3B0aW9uc1RhYmxlLmZpbmQoICcubWFudWFsLW9wdGlvbnMtdGFibGUtYm9keS1yb3dzJyApLmVtcHR5KCk7XG5cblx0XHR0cmlnZ2VyUmVtb3ZlTnVtYmVyT3B0aW9uKCAkZmllbGQgKTtcblxuXHRcdHRyaWdnZXJOdW1iZXJNYW51YWxPcHRpb25zQ2hhbmdlKCAkZmllbGQgKTtcblx0fSApO1xuXG5cdC8vIEFkZCBOZXcgT3B0aW9uXG5cdCRzZWFyY2hGb3JtLm9uKCAnY2xpY2snLCAnLmFkZC1udW1iZXItb3B0aW9uJywgZnVuY3Rpb24oKSB7XG5cdFx0Y29uc3QgZmllbGRUeXBlID0gJ3djYXBmLXBvc3QtbWV0YS10eXBlLW51bWJlci1vcHRpb24nO1xuXG5cdFx0Ly8gQmFpbCBvdXQgaWYgbm8gdG1wbCBmb3VuZCBmb3IgdGhlIHR5cGUuXG5cdFx0aWYgKCAhIGpRdWVyeSggJyN0bXBsLScgKyBmaWVsZFR5cGUgKS5sZW5ndGggKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0Y29uc3QgJGZpZWxkID0gJCggdGhpcyApLmNsb3Nlc3QoICcud2NhcGYtZm9ybS1maWVsZCcgKTtcblxuXHRcdGNvbnN0IHRlbXBsYXRlID0gd3AudGVtcGxhdGUoIGZpZWxkVHlwZSApO1xuXHRcdGNvbnN0IHJlbmRlcmVkID0gdGVtcGxhdGUoIHsgdmFsdWU6ICcnLCBsYWJlbDogJycgfSApO1xuXHRcdGNvbnN0ICR3cmFwcGVyID0gJGZpZWxkLmZpbmQoICcubnVtYmVyLW1hbnVhbC1vcHRpb25zLXRhYmxlJyApO1xuXHRcdGNvbnN0ICRyb3dzICAgID0gJHdyYXBwZXIuZmluZCggJy5tYW51YWwtb3B0aW9ucy10YWJsZS1ib2R5LXJvd3MnICk7XG5cblx0XHQkcm93cy5hcHBlbmQoIHJlbmRlcmVkICk7XG5cblx0XHRpZiAoICEgJHdyYXBwZXIuaGFzQ2xhc3MoICdoYXMtb3B0aW9ucycgKSApIHtcblx0XHRcdCR3cmFwcGVyLmFkZENsYXNzKCAnaGFzLW9wdGlvbnMnICk7XG5cdFx0fVxuXHR9ICk7XG5cblx0JHNlYXJjaEZvcm0ub24oICdpbnB1dCcsICcubnVtYmVyLW1hbnVhbC1vcHRpb25zLXRhYmxlIGlucHV0W3R5cGU9XCJ0ZXh0XCJdJywgZnVuY3Rpb24oKSB7XG5cdFx0Y29uc3QgJGZpZWxkID0gJCggdGhpcyApLmNsb3Nlc3QoICcud2NhcGYtZm9ybS1maWVsZCcgKTtcblxuXHRcdHRyaWdnZXJOdW1iZXJNYW51YWxPcHRpb25zQ2hhbmdlKCAkZmllbGQgKTtcblx0fSApO1xuXG5cdCRzZWFyY2hGb3JtLm9uKCAnYWZ0ZXJfdG9nZ2xlX3JlcXVlc3QnLCBmdW5jdGlvbiggZSwgaGFuZGxlciwgdmFsdWUsICRmaWVsZCApIHtcblx0XHRpZiAoICcud2NhcGYtZm9ybS1zdWItZmllbGQtbnVtYmVyX2Rpc3BsYXlfdHlwZSBzZWxlY3QnID09PSBoYW5kbGVyICkge1xuXHRcdFx0Y29uc3QgJGdldE9wdGlvbnMgICAgICAgICA9ICRmaWVsZC5maW5kKCAnLm51bWJlci1nZXQtb3B0aW9ucycgKTtcblx0XHRcdGNvbnN0ICRhdXRvT3B0aW9ucyAgICAgICAgPSAkZmllbGQuZmluZCggJy5udW1iZXItYXV0b21hdGljLW9wdGlvbnMnICk7XG5cdFx0XHRjb25zdCAkbWFudWFsT3B0aW9uc1RhYmxlID0gJGZpZWxkLmZpbmQoICcubnVtYmVyLW1hbnVhbC1vcHRpb25zLXRhYmxlJyApO1xuXHRcdFx0Y29uc3QgJGVsbSAgICAgICAgICAgICAgICA9ICRmaWVsZC5maW5kKCBoYW5kbGVyICk7XG5cdFx0XHRjb25zdCBkaXNwbGF5VHlwZSAgICAgICAgID0gJGVsbS52YWwoKTtcblxuXHRcdFx0aWYgKCAncmFuZ2Vfc2xpZGVyJyA9PT0gZGlzcGxheVR5cGUgfHwgJ3JhbmdlX251bWJlcicgPT09IGRpc3BsYXlUeXBlICkge1xuXHRcdFx0XHQkZ2V0T3B0aW9ucy5oaWRlKCk7XG5cdFx0XHRcdCRtYW51YWxPcHRpb25zVGFibGUuYWRkQ2xhc3MoICdmb3JjZS1oaWRlJyApO1xuXHRcdFx0XHQkYXV0b09wdGlvbnMuYWRkQ2xhc3MoICdmb3JjZS1zaG93JyApO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0JGdldE9wdGlvbnMuc2hvdygpO1xuXHRcdFx0XHQkbWFudWFsT3B0aW9uc1RhYmxlLnJlbW92ZUNsYXNzKCAnZm9yY2UtaGlkZScgKTtcblx0XHRcdFx0JGF1dG9PcHRpb25zLnJlbW92ZUNsYXNzKCAnZm9yY2Utc2hvdycgKTtcblx0XHRcdH1cblx0XHR9XG5cdH0gKTtcblxuXHRmdW5jdGlvbiB0b2dnbGVOdW1iZXJNaW5WYWx1ZUZpZWxkKCAkZWxtICkge1xuXHRcdGNvbnN0ICRmaWVsZCAgICAgPSAkZWxtLmNsb3Nlc3QoICcud2NhcGYtZm9ybS1maWVsZCcgKTtcblx0XHRjb25zdCAkdGV4dEZpZWxkID0gJGZpZWxkLmZpbmQoICcud2NhcGYtZm9ybS1zdWItZmllbGQtbWluX3ZhbHVlIGlucHV0W3R5cGU9XCJ0ZXh0XCJdJyApO1xuXG5cdFx0aWYgKCAkZWxtLmlzKCAnOmNoZWNrZWQnICkgKSB7XG5cdFx0XHQkdGV4dEZpZWxkLmF0dHIoICdkaXNhYmxlZCcsICdkaXNhYmxlZCcgKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0JHRleHRGaWVsZC5yZW1vdmVBdHRyKCAnZGlzYWJsZWQnICk7XG5cdFx0fVxuXHR9XG5cblx0JHNlYXJjaEZvcm0uZmluZCggJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1taW5fdmFsdWVfYXV0b19kZXRlY3QgaW5wdXRbdHlwZT1cImNoZWNrYm94XCJdJyApLmVhY2goIGZ1bmN0aW9uKCkge1xuXHRcdGNvbnN0ICR0aGlzID0gJCggdGhpcyApO1xuXG5cdFx0dG9nZ2xlTnVtYmVyTWluVmFsdWVGaWVsZCggJHRoaXMgKTtcblx0fSApO1xuXG5cdCRzZWFyY2hGb3JtLm9uKCAnY2xpY2snLCAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLW1pbl92YWx1ZV9hdXRvX2RldGVjdCBpbnB1dFt0eXBlPVwiY2hlY2tib3hcIl0nLCBmdW5jdGlvbigpIHtcblx0XHRjb25zdCAkdGhpcyA9ICQoIHRoaXMgKTtcblxuXHRcdHRvZ2dsZU51bWJlck1pblZhbHVlRmllbGQoICR0aGlzICk7XG5cdH0gKTtcblxuXHRmdW5jdGlvbiB0b2dnbGVOdW1iZXJNYXhWYWx1ZUZpZWxkKCAkZWxtICkge1xuXHRcdGNvbnN0ICRmaWVsZCAgICAgPSAkZWxtLmNsb3Nlc3QoICcud2NhcGYtZm9ybS1maWVsZCcgKTtcblx0XHRjb25zdCAkdGV4dEZpZWxkID0gJGZpZWxkLmZpbmQoICcud2NhcGYtZm9ybS1zdWItZmllbGQtbWF4X3ZhbHVlIGlucHV0W3R5cGU9XCJ0ZXh0XCJdJyApO1xuXG5cdFx0aWYgKCAkZWxtLmlzKCAnOmNoZWNrZWQnICkgKSB7XG5cdFx0XHQkdGV4dEZpZWxkLmF0dHIoICdkaXNhYmxlZCcsICdkaXNhYmxlZCcgKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0JHRleHRGaWVsZC5yZW1vdmVBdHRyKCAnZGlzYWJsZWQnICk7XG5cdFx0fVxuXHR9XG5cblx0JHNlYXJjaEZvcm0uZmluZCggJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1tYXhfdmFsdWVfYXV0b19kZXRlY3QgaW5wdXRbdHlwZT1cImNoZWNrYm94XCJdJyApLmVhY2goIGZ1bmN0aW9uKCkge1xuXHRcdGNvbnN0ICR0aGlzID0gJCggdGhpcyApO1xuXG5cdFx0dG9nZ2xlTnVtYmVyTWF4VmFsdWVGaWVsZCggJHRoaXMgKTtcblx0fSApO1xuXG5cdCRzZWFyY2hGb3JtLm9uKCAnY2xpY2snLCAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLW1heF92YWx1ZV9hdXRvX2RldGVjdCBpbnB1dFt0eXBlPVwiY2hlY2tib3hcIl0nLCBmdW5jdGlvbigpIHtcblx0XHRjb25zdCAkdGhpcyA9ICQoIHRoaXMgKTtcblxuXHRcdHRvZ2dsZU51bWJlck1heFZhbHVlRmllbGQoICR0aGlzICk7XG5cdH0gKTtcblxufSApO1xuIiwiLyoqXG4gKiBUaGUgc2VhcmNoIGZvcm0gZmllbGQuXG4gKlxuICogQHNpbmNlICAgICAgMy4wLjBcbiAqIEBwYWNrYWdlICAgIHdjLWFqYXgtcHJvZHVjdC1maWx0ZXJcbiAqIEBzdWJwYWNrYWdlIHdjLWFqYXgtcHJvZHVjdC1maWx0ZXIvYWRtaW4vc3JjL2pzXG4gKiBAYXV0aG9yICAgICBNYWludWwgSGFzc2FuIE1haW5cbiAqL1xuXG5qUXVlcnkoIGRvY3VtZW50ICkucmVhZHkoIGZ1bmN0aW9uKCAkICkge1xuXG5cdGNvbnN0ICRzZWFyY2hGb3JtID0gJCggJyNzZWFyY2gtZm9ybScgKTtcblxuXHRjb25zdCBkZXBlbmRhbnREYXRhID0gW1xuXHRcdHtcblx0XHRcdCdoYW5kbGVyJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC12YWx1ZV90eXBlIHNlbGVjdCcsXG5cdFx0XHQnaGFuZGxlclR5cGUnOiAnc2VsZWN0Jyxcblx0XHRcdCdldmVudCc6ICdjaGFuZ2UnLFxuXHRcdFx0J2RlcGVuZGFudCc6IFtcblx0XHRcdFx0e1xuXHRcdFx0XHRcdCdzZWxlY3Rvcic6ICcuaW5wdXQtdHlwZS10ZXh0LWZpZWxkcycsXG5cdFx0XHRcdFx0J3ZhbHVlJzogWyAndGV4dCcgXSxcblx0XHRcdFx0fSxcblx0XHRcdFx0e1xuXHRcdFx0XHRcdCdzZWxlY3Rvcic6ICcuaW5wdXQtdHlwZS1udW1iZXItZmllbGRzJyxcblx0XHRcdFx0XHQndmFsdWUnOiBbICdudW1iZXInIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLmlucHV0LXR5cGUtZGF0ZS1maWVsZHMnLFxuXHRcdFx0XHRcdCd2YWx1ZSc6IFsgJ2RhdGUnIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRdLFxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0J2hhbmRsZXInOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLWRpc3BsYXlfdHlwZSBzZWxlY3QnLFxuXHRcdFx0J2hhbmRsZXJUeXBlJzogJ3NlbGVjdCcsXG5cdFx0XHQnZXZlbnQnOiAnY2hhbmdlJyxcblx0XHRcdCdkZXBlbmRhbnQnOiBbXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLXF1ZXJ5X3R5cGUnLFxuXHRcdFx0XHRcdCd2YWx1ZSc6IFsgJ2NoZWNrYm94JywgJ211bHRpLXNlbGVjdCcgXSxcblx0XHRcdFx0fSxcblx0XHRcdFx0e1xuXHRcdFx0XHRcdCdzZWxlY3Rvcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtYWxsX2l0ZW1zX2xhYmVsJyxcblx0XHRcdFx0XHQndmFsdWUnOiBbICdyYWRpbycsICdzZWxlY3QnIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLXVzZV9jaG9zZW4nLFxuXHRcdFx0XHRcdCd2YWx1ZSc6IFsgJ3NlbGVjdCcsICdtdWx0aS1zZWxlY3QnIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRdLFxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0J2hhbmRsZXInOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLXVzZV9jaG9zZW4gaW5wdXQnLFxuXHRcdFx0J2hhbmRsZXJUeXBlJzogJ2NoZWNrYm94Jyxcblx0XHRcdCdldmVudCc6ICdjaGFuZ2UnLFxuXHRcdFx0J2RlcGVuZGFudCc6IFtcblx0XHRcdFx0e1xuXHRcdFx0XHRcdCdzZWxlY3Rvcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtY2hvc2VuX25vX3Jlc3VsdHNfbWVzc2FnZScsXG5cdFx0XHRcdFx0J3ZhbHVlJzogWyAnMScgXSxcblx0XHRcdFx0fSxcblx0XHRcdF0sXG5cdFx0fSxcblx0XHR7XG5cdFx0XHQnaGFuZGxlcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtZ2V0X29wdGlvbnMgaW5wdXQnLFxuXHRcdFx0J2hhbmRsZXJUeXBlJzogJ3JhZGlvJyxcblx0XHRcdCdldmVudCc6ICdjaGFuZ2UnLFxuXHRcdFx0J2RlcGVuZGFudCc6IFtcblx0XHRcdFx0e1xuXHRcdFx0XHRcdCdzZWxlY3Rvcic6ICcuY29sdW1uLWdyb3VwLW1ldGFfa2V5X21hbnVhbF9vcHRpb25zJyxcblx0XHRcdFx0XHQndmFsdWUnOiBbICdtYW51YWxfZW50cnknIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRdLFxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0J2hhbmRsZXInOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLW51bWJlcl9kaXNwbGF5X3R5cGUgc2VsZWN0Jyxcblx0XHRcdCdoYW5kbGVyVHlwZSc6ICdzZWxlY3QnLFxuXHRcdFx0J2V2ZW50JzogJ2NoYW5nZScsXG5cdFx0XHQnZGVwZW5kYW50JzogW1xuXHRcdFx0XHR7XG5cdFx0XHRcdFx0J3NlbGVjdG9yJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1udW1iZXJfcmFuZ2Vfc2xpZGVyX2Rpc3BsYXlfdmFsdWVzX2FzJyxcblx0XHRcdFx0XHQndmFsdWUnOiBbICdyYW5nZV9zbGlkZXInIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLW51bWJlcl9yYW5nZV9xdWVyeV90eXBlJyxcblx0XHRcdFx0XHQndmFsdWUnOiBbICdyYW5nZV9jaGVja2JveCcsICdyYW5nZV9tdWx0aXNlbGVjdCcgXSxcblx0XHRcdFx0fSxcblx0XHRcdFx0e1xuXHRcdFx0XHRcdCdzZWxlY3Rvcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtbnVtYmVyX3JhbmdlX3NlbGVjdF9hbGxfaXRlbXNfbGFiZWwnLFxuXHRcdFx0XHRcdCd2YWx1ZSc6IFsgJ3JhbmdlX3JhZGlvJywgJ3JhbmdlX3NlbGVjdCcgXSxcblx0XHRcdFx0fSxcblx0XHRcdFx0e1xuXHRcdFx0XHRcdCdzZWxlY3Rvcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtbnVtYmVyX3JhbmdlX3VzZV9jaG9zZW4nLFxuXHRcdFx0XHRcdCd2YWx1ZSc6IFsgJ3JhbmdlX3NlbGVjdCcsICdyYW5nZV9tdWx0aXNlbGVjdCcgXSxcblx0XHRcdFx0fSxcblx0XHRcdFx0e1xuXHRcdFx0XHRcdCdzZWxlY3Rvcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtbnVtYmVyX3JhbmdlX3Nob3dfY291bnQnLFxuXHRcdFx0XHRcdCd2YWx1ZSc6IFsgJ3JhbmdlX2NoZWNrYm94JywgJ3JhbmdlX3JhZGlvJywgJ3JhbmdlX3NlbGVjdCcsICdyYW5nZV9tdWx0aXNlbGVjdCcgXSxcblx0XHRcdFx0fSxcblx0XHRcdFx0e1xuXHRcdFx0XHRcdCdzZWxlY3Rvcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtbnVtYmVyX3JhbmdlX2hpZGVfZW1wdHknLFxuXHRcdFx0XHRcdCd2YWx1ZSc6IFsgJ3JhbmdlX2NoZWNrYm94JywgJ3JhbmdlX3JhZGlvJywgJ3JhbmdlX3NlbGVjdCcsICdyYW5nZV9tdWx0aXNlbGVjdCcgXSxcblx0XHRcdFx0fSxcblx0XHRcdFx0e1xuXHRcdFx0XHRcdCdzZWxlY3Rvcic6ICcubnVtYmVyLWRlY2ltYWwtZmllbGRzJyxcblx0XHRcdFx0XHQndmFsdWUnOiBbICdyYW5nZV9zbGlkZXInLCAncmFuZ2VfY2hlY2tib3gnLCAncmFuZ2VfcmFkaW8nLCAncmFuZ2Vfc2VsZWN0JywgJ3JhbmdlX211bHRpc2VsZWN0JyBdLFxuXHRcdFx0XHR9LFxuXHRcdFx0XSxcblx0XHR9LFxuXHRcdHtcblx0XHRcdCdoYW5kbGVyJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1udW1iZXJfcmFuZ2VfdXNlX2Nob3NlbiBpbnB1dCcsXG5cdFx0XHQnaGFuZGxlclR5cGUnOiAnY2hlY2tib3gnLFxuXHRcdFx0J2V2ZW50JzogJ2NoYW5nZScsXG5cdFx0XHQnZGVwZW5kYW50JzogW1xuXHRcdFx0XHR7XG5cdFx0XHRcdFx0J3NlbGVjdG9yJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1udW1iZXJfcmFuZ2VfY2hvc2VuX25vX3Jlc3VsdHNfbWVzc2FnZScsXG5cdFx0XHRcdFx0J3ZhbHVlJzogWyAnMScgXSxcblx0XHRcdFx0fSxcblx0XHRcdF0sXG5cdFx0fSxcblx0XHR7XG5cdFx0XHQnaGFuZGxlcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtbnVtYmVyX2dldF9vcHRpb25zIGlucHV0Jyxcblx0XHRcdCdoYW5kbGVyVHlwZSc6ICdyYWRpbycsXG5cdFx0XHQnZXZlbnQnOiAnY2hhbmdlJyxcblx0XHRcdCdkZXBlbmRhbnQnOiBbXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLm51bWJlci1hdXRvbWF0aWMtb3B0aW9ucycsXG5cdFx0XHRcdFx0J3ZhbHVlJzogWyAnYXV0b21hdGljYWxseScgXSxcblx0XHRcdFx0fSxcblx0XHRcdFx0e1xuXHRcdFx0XHRcdCdzZWxlY3Rvcic6ICcubnVtYmVyLW1hbnVhbC1vcHRpb25zLXRhYmxlJyxcblx0XHRcdFx0XHQndmFsdWUnOiBbICdtYW51YWxfZW50cnknIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRdLFxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0J2hhbmRsZXInOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLWRhdGVfaW5wdXRfdHlwZSBzZWxlY3QnLFxuXHRcdFx0J2hhbmRsZXJUeXBlJzogJ3NlbGVjdCcsXG5cdFx0XHQnZXZlbnQnOiAnY2hhbmdlJyxcblx0XHRcdCdkZXBlbmRhbnQnOiBbXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLmRhdGUtdG8tdWktb3B0aW9ucycsXG5cdFx0XHRcdFx0J3ZhbHVlJzogWyAncmFuZ2VfZGF0ZScgXSxcblx0XHRcdFx0fSxcblx0XHRcdF0sXG5cdFx0fSxcblx0XHR7XG5cdFx0XHQnaGFuZGxlcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtbGltaXRfdGVybXMgc2VsZWN0Jyxcblx0XHRcdCdoYW5kbGVyVHlwZSc6ICdzZWxlY3QnLFxuXHRcdFx0J2V2ZW50JzogJ2NoYW5nZScsXG5cdFx0XHQnZGVwZW5kYW50JzogW1xuXHRcdFx0XHR7XG5cdFx0XHRcdFx0J3NlbGVjdG9yJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1wYXJlbnRfdGVybScsXG5cdFx0XHRcdFx0J3ZhbHVlJzogWyAnY2hpbGQnIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLWxpbWl0X3Rlcm1zX2J5X2lkJyxcblx0XHRcdFx0XHQndmFsdWUnOiBbICdpbmNsdWRlJywgJ2V4Y2x1ZGUnIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRdLFxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0J2hhbmRsZXInOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLWVuYWJsZV9zb2Z0X2xpbWl0IHNlbGVjdCcsXG5cdFx0XHQnaGFuZGxlclR5cGUnOiAnc2VsZWN0Jyxcblx0XHRcdCdldmVudCc6ICdjaGFuZ2UnLFxuXHRcdFx0J2RlcGVuZGFudCc6IFtcblx0XHRcdFx0e1xuXHRcdFx0XHRcdCdzZWxlY3Rvcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtc29mdF9saW1pdCcsXG5cdFx0XHRcdFx0J3ZhbHVlJzogWyAneWVzJyBdLFxuXHRcdFx0XHR9LFxuXHRcdFx0XSxcblx0XHR9LFxuXHRcdHtcblx0XHRcdCdoYW5kbGVyJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1jdXN0b20tdGF4b25vbXkgc2VsZWN0Jyxcblx0XHRcdCdoYW5kbGVyVHlwZSc6ICdzZWxlY3QnLFxuXHRcdFx0J2V2ZW50JzogJ2NoYW5nZScsXG5cdFx0fSxcblx0XTtcblxuXHRmdW5jdGlvbiBfdHJpZ2dlcklucHV0VHlwZVRleHREaXNwbGF5VHlwZUNoYW5nZSggdmFsdWUsICRmaWVsZCApIHtcblx0XHRjb25zdCAkbm9SZXN1bHRzICAgICA9ICRmaWVsZC5maW5kKCAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLWNob3Nlbl9ub19yZXN1bHRzX21lc3NhZ2UnICk7XG5cdFx0Y29uc3QgJGFsbEl0ZW1zTGFiZWwgPSAkZmllbGQuZmluZCggJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1hbGxfaXRlbXNfbGFiZWwnICk7XG5cdFx0Y29uc3QgdXNlQ2hvc2VuICAgICAgPSAkZmllbGQuZmluZCggJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC11c2VfY2hvc2VuIGlucHV0JyApLmlzKCAnOmNoZWNrZWQnICk7XG5cblx0XHRpZiAoIHVzZUNob3NlbiAmJiAoICdzZWxlY3QnID09PSB2YWx1ZSB8fCAnbXVsdGktc2VsZWN0JyA9PT0gdmFsdWUgKSApIHtcblx0XHRcdCRub1Jlc3VsdHMuc2hvdygpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHQkbm9SZXN1bHRzLmhpZGUoKTtcblx0XHR9XG5cblx0XHRpZiAoICggJ3JhZGlvJyA9PT0gdmFsdWUgfHwgJ3NlbGVjdCcgPT09IHZhbHVlICkgfHwgKCAnbXVsdGktc2VsZWN0JyA9PT0gdmFsdWUgJiYgdXNlQ2hvc2VuICkgKSB7XG5cdFx0XHQkYWxsSXRlbXNMYWJlbC5zaG93KCk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdCRhbGxJdGVtc0xhYmVsLmhpZGUoKTtcblx0XHR9XG5cdH1cblxuXHRmdW5jdGlvbiBfdHJpZ2dlcklucHV0VHlwZU51bWJlckRpc3BsYXlUeXBlQ2hhbmdlKCB2YWx1ZSwgJGZpZWxkICkge1xuXHRcdGNvbnN0ICRub1Jlc3VsdHMgICAgID0gJGZpZWxkLmZpbmQoICcud2NhcGYtZm9ybS1zdWItZmllbGQtbnVtYmVyX3JhbmdlX2Nob3Nlbl9ub19yZXN1bHRzX21lc3NhZ2UnICk7XG5cdFx0Y29uc3QgJGFsbEl0ZW1zTGFiZWwgPSAkZmllbGQuZmluZCggJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1udW1iZXJfcmFuZ2Vfc2VsZWN0X2FsbF9pdGVtc19sYWJlbCcgKTtcblx0XHRjb25zdCB1c2VDaG9zZW4gICAgICA9ICRmaWVsZC5maW5kKCAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLW51bWJlcl9yYW5nZV91c2VfY2hvc2VuIGlucHV0JyApLmlzKCAnOmNoZWNrZWQnICk7XG5cblx0XHRpZiAoIHVzZUNob3NlbiAmJiAoICdyYW5nZV9zZWxlY3QnID09PSB2YWx1ZSB8fCAncmFuZ2VfbXVsdGlzZWxlY3QnID09PSB2YWx1ZSApICkge1xuXHRcdFx0JG5vUmVzdWx0cy5zaG93KCk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdCRub1Jlc3VsdHMuaGlkZSgpO1xuXHRcdH1cblxuXHRcdGlmICggKCAncmFuZ2VfcmFkaW8nID09PSB2YWx1ZSB8fCAncmFuZ2Vfc2VsZWN0JyA9PT0gdmFsdWUgKSB8fCAoICdyYW5nZV9tdWx0aXNlbGVjdCcgPT09IHZhbHVlICYmIHVzZUNob3NlbiApICkge1xuXHRcdFx0JGFsbEl0ZW1zTGFiZWwuc2hvdygpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHQkYWxsSXRlbXNMYWJlbC5oaWRlKCk7XG5cdFx0fVxuXHR9XG5cblx0ZnVuY3Rpb24gX3RyaWdnZXJJbnB1dFR5cGVUZXh0VXNlU2VsZWN0Q2hhbmdlKCB2YWx1ZSwgJGZpZWxkICkge1xuXHRcdGNvbnN0ICRub1Jlc3VsdHMgICAgID0gJGZpZWxkLmZpbmQoICcud2NhcGYtZm9ybS1zdWItZmllbGQtY2hvc2VuX25vX3Jlc3VsdHNfbWVzc2FnZScgKTtcblx0XHRjb25zdCAkYWxsSXRlbXNMYWJlbCA9ICRmaWVsZC5maW5kKCAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLWFsbF9pdGVtc19sYWJlbCcgKTtcblx0XHRjb25zdCBkaXNwbGF5VHlwZSAgICA9ICRmaWVsZC5maW5kKCAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLWRpc3BsYXlfdHlwZSBzZWxlY3QnICkudmFsKCk7XG5cblx0XHRpZiAoICcxJyA9PT0gdmFsdWUgJiYgKCAnc2VsZWN0JyA9PT0gZGlzcGxheVR5cGUgfHwgJ211bHRpLXNlbGVjdCcgPT09IGRpc3BsYXlUeXBlICkgKSB7XG5cdFx0XHQkbm9SZXN1bHRzLnNob3coKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0JG5vUmVzdWx0cy5oaWRlKCk7XG5cdFx0fVxuXG5cdFx0aWYgKFxuXHRcdFx0KCAnMScgPT09IHZhbHVlICYmICdtdWx0aS1zZWxlY3QnID09PSBkaXNwbGF5VHlwZSApXG5cdFx0XHR8fCAoICdyYWRpbycgPT09IGRpc3BsYXlUeXBlIHx8ICdzZWxlY3QnID09PSBkaXNwbGF5VHlwZSApXG5cdFx0KSB7XG5cdFx0XHQkYWxsSXRlbXNMYWJlbC5zaG93KCk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdCRhbGxJdGVtc0xhYmVsLmhpZGUoKTtcblx0XHR9XG5cdH1cblxuXHRmdW5jdGlvbiBfdHJpZ2dlcklucHV0VHlwZU51bWJlclVzZVNlbGVjdENoYW5nZSggdmFsdWUsICRmaWVsZCApIHtcblx0XHRjb25zdCAkbm9SZXN1bHRzICAgICA9ICRmaWVsZC5maW5kKCAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLW51bWJlcl9yYW5nZV9jaG9zZW5fbm9fcmVzdWx0c19tZXNzYWdlJyApO1xuXHRcdGNvbnN0ICRhbGxJdGVtc0xhYmVsID0gJGZpZWxkLmZpbmQoICcud2NhcGYtZm9ybS1zdWItZmllbGQtbnVtYmVyX3JhbmdlX3NlbGVjdF9hbGxfaXRlbXNfbGFiZWwnICk7XG5cdFx0Y29uc3QgZGlzcGxheVR5cGUgICAgPSAkZmllbGQuZmluZCggJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1udW1iZXJfZGlzcGxheV90eXBlIHNlbGVjdCcgKS52YWwoKTtcblxuXHRcdGlmICggJzEnID09PSB2YWx1ZSAmJiAoICdyYW5nZV9zZWxlY3QnID09PSBkaXNwbGF5VHlwZSB8fCAncmFuZ2VfbXVsdGlzZWxlY3QnID09PSBkaXNwbGF5VHlwZSApICkge1xuXHRcdFx0JG5vUmVzdWx0cy5zaG93KCk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdCRub1Jlc3VsdHMuaGlkZSgpO1xuXHRcdH1cblxuXHRcdGlmIChcblx0XHRcdCggJzEnID09PSB2YWx1ZSAmJiAncmFuZ2VfbXVsdGlzZWxlY3QnID09PSBkaXNwbGF5VHlwZSApXG5cdFx0XHR8fCAoICdyYW5nZV9yYWRpbycgPT09IGRpc3BsYXlUeXBlIHx8ICdyYW5nZV9zZWxlY3QnID09PSBkaXNwbGF5VHlwZSApXG5cdFx0KSB7XG5cdFx0XHQkYWxsSXRlbXNMYWJlbC5zaG93KCk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdCRhbGxJdGVtc0xhYmVsLmhpZGUoKTtcblx0XHR9XG5cdH1cblxuXHRmdW5jdGlvbiBfaGFuZGxlVG9nZ2xlUmVxdWVzdCggZGF0YSwgY3VycmVudFNlbGVjdG9yLCB2YWx1ZSApIHtcblx0XHRjb25zdCAkZmllbGQgICAgICA9IGN1cnJlbnRTZWxlY3Rvci5jbG9zZXN0KCAnLndjYXBmLWZvcm0tZmllbGQnICk7XG5cdFx0Y29uc3QgaGFuZGxlciAgICAgPSBkYXRhWyAnaGFuZGxlcicgXTtcblx0XHRjb25zdCBoYW5kbGVyVHlwZSA9IGRhdGFbICdoYW5kbGVyVHlwZScgXTtcblx0XHRjb25zdCBkZXBlbmRhbnQgICA9IGRhdGFbICdkZXBlbmRhbnQnIF07XG5cblx0XHRsZXQgX3ZhbHVlID0gdmFsdWU7XG5cblx0XHRpZiAoICdjaGVja2JveCcgPT09IGhhbmRsZXJUeXBlICkge1xuXHRcdFx0X3ZhbHVlID0gY3VycmVudFNlbGVjdG9yLmlzKCAnOmNoZWNrZWQnICkgPyAnMScgOiAnMCc7XG5cdFx0fVxuXG5cdFx0aWYgKCAncmFkaW8nID09PSBoYW5kbGVyVHlwZSApIHtcblx0XHRcdF92YWx1ZSA9ICRmaWVsZC5maW5kKCBoYW5kbGVyICsgJzpjaGVja2VkJyApLnZhbCgpO1xuXHRcdH1cblxuXHRcdCQuZWFjaCggZGVwZW5kYW50LCBmdW5jdGlvbiggaWQsIGQgKSB7XG5cdFx0XHRjb25zdCAkc2VsZWN0b3IgICA9ICRmaWVsZC5maW5kKCBkWyAnc2VsZWN0b3InIF0gKTtcblx0XHRcdGNvbnN0IHZhbGlkVmFsdWVzID0gZFsgJ3ZhbHVlJyBdO1xuXG5cdFx0XHRpZiAoIHZhbGlkVmFsdWVzLmluY2x1ZGVzKCBfdmFsdWUgKSApIHtcblx0XHRcdFx0JHNlbGVjdG9yLnNob3coKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdCRzZWxlY3Rvci5oaWRlKCk7XG5cdFx0XHR9XG5cdFx0fSApO1xuXG5cdFx0aWYgKCAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLWRpc3BsYXlfdHlwZSBzZWxlY3QnID09PSBoYW5kbGVyICkge1xuXHRcdFx0X3RyaWdnZXJJbnB1dFR5cGVUZXh0RGlzcGxheVR5cGVDaGFuZ2UoIF92YWx1ZSwgJGZpZWxkICk7XG5cdFx0fVxuXG5cdFx0aWYgKCAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLXVzZV9jaG9zZW4gaW5wdXQnID09PSBoYW5kbGVyICkge1xuXHRcdFx0X3RyaWdnZXJJbnB1dFR5cGVUZXh0VXNlU2VsZWN0Q2hhbmdlKCBfdmFsdWUsICRmaWVsZCApO1xuXHRcdH1cblxuXHRcdGlmICggJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1udW1iZXJfZGlzcGxheV90eXBlIHNlbGVjdCcgPT09IGhhbmRsZXIgKSB7XG5cdFx0XHRfdHJpZ2dlcklucHV0VHlwZU51bWJlckRpc3BsYXlUeXBlQ2hhbmdlKCBfdmFsdWUsICRmaWVsZCApO1xuXHRcdH1cblxuXHRcdGlmICggJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1udW1iZXJfcmFuZ2VfdXNlX2Nob3NlbiBpbnB1dCcgPT09IGhhbmRsZXIgKSB7XG5cdFx0XHRfdHJpZ2dlcklucHV0VHlwZU51bWJlclVzZVNlbGVjdENoYW5nZSggX3ZhbHVlLCAkZmllbGQgKTtcblx0XHR9XG5cblx0XHQkc2VhcmNoRm9ybS50cmlnZ2VyKCAnYWZ0ZXJfdG9nZ2xlX3JlcXVlc3QnLCBbIGhhbmRsZXIsIF92YWx1ZSwgJGZpZWxkIF0gKTtcblx0fVxuXG5cdGZ1bmN0aW9uIGhhbmRsZVRvZ2dsZVJlcXVlc3QoIGRhdGEsIGN1cnJlbnRTZWxlY3RvciwgdmFsdWUgKSB7XG5cdFx0aWYgKCBudWxsID09PSBjdXJyZW50U2VsZWN0b3IgKSB7XG5cdFx0XHRjb25zdCBoYW5kbGVyICA9IGRhdGFbICdoYW5kbGVyJyBdO1xuXHRcdFx0Y29uc3QgJGhhbmRsZXIgPSAkKCBoYW5kbGVyICk7XG5cblx0XHRcdCQuZWFjaCggJGhhbmRsZXIsIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRjb25zdCBfdGhpcyAgPSAkKCB0aGlzICk7XG5cdFx0XHRcdGNvbnN0IF92YWx1ZSA9IF90aGlzLnZhbCgpO1xuXHRcdFx0XHRfaGFuZGxlVG9nZ2xlUmVxdWVzdCggZGF0YSwgX3RoaXMsIF92YWx1ZSApO1xuXHRcdFx0fSApO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRfaGFuZGxlVG9nZ2xlUmVxdWVzdCggZGF0YSwgY3VycmVudFNlbGVjdG9yLCB2YWx1ZSApO1xuXHRcdH1cblx0fVxuXG5cdGZ1bmN0aW9uIHNldHVwU2VhcmNoRm9ybSggaW5pdGFsID0gZmFsc2UgKSB7XG5cdFx0JC5lYWNoKCBkZXBlbmRhbnREYXRhLCBmdW5jdGlvbiggaSwgZGF0YSApIHtcblx0XHRcdGNvbnN0IGhhbmRsZXIgPSBkYXRhWyAnaGFuZGxlcicgXTtcblx0XHRcdGNvbnN0IGV2ZW50ICAgPSBkYXRhWyAnZXZlbnQnIF07XG5cblx0XHRcdGhhbmRsZVRvZ2dsZVJlcXVlc3QoIGRhdGEsIG51bGwsIG51bGwgKTtcblxuXHRcdFx0aWYgKCBpbml0YWwgKSB7XG5cdFx0XHRcdCRzZWFyY2hGb3JtLm9uKCBldmVudCwgaGFuZGxlciwgZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0Y29uc3QgX3RoaXMgID0gJCggdGhpcyApO1xuXHRcdFx0XHRcdGNvbnN0IF92YWx1ZSA9ICQoIHRoaXMgKS52YWwoKTtcblx0XHRcdFx0XHRoYW5kbGVUb2dnbGVSZXF1ZXN0KCBkYXRhLCBfdGhpcywgX3ZhbHVlICk7XG5cdFx0XHRcdH0gKTtcblx0XHRcdH1cblx0XHR9ICk7XG5cdH1cblxuXHRzZXR1cFNlYXJjaEZvcm0oIHRydWUgKTtcblxuXHQkc2VhcmNoRm9ybS5vbiggJ2ZpZWxkX2FkZGVkJywgZnVuY3Rpb24oKSB7XG5cdFx0Ly8gVG9nZ2xlIHRoZSB2aXNpYmlsaXR5IG9mIHN1YmZpZWxkcy5cblx0XHRzZXR1cFNlYXJjaEZvcm0oKTtcblx0fSApO1xuXG59ICk7XG4iLCIvKipcbiAqIFRoZSBzZWFyY2ggZm9ybS5cbiAqXG4gKiBAc2luY2UgICAgICAzLjAuMFxuICogQHBhY2thZ2UgICAgd2MtYWpheC1wcm9kdWN0LWZpbHRlclxuICogQHN1YnBhY2thZ2Ugd2MtYWpheC1wcm9kdWN0LWZpbHRlci9hZG1pbi9zcmMvanNcbiAqIEBhdXRob3IgICAgIE1haW51bCBIYXNzYW4gTWFpblxuICovXG5cbmNvbnN0IHRvdGFsRmllbGRJbnN0YW5jZXMgPSBqUXVlcnkoICcjdG90YWxfZmllbGRfaW5zdGFuY2VzJyApO1xuXG5jb25zdCBzZWFyY2hGb3JtID0galF1ZXJ5KCAnI3NlYXJjaC1mb3JtJyApO1xuXG4vKipcbiAqIEFzc2lnbiBhIHVuaXF1ZSBpZCBieSByZXBsYWNpbmcgdGhlIHBsYWNlaG9sZGVyIGlkLlxuICovXG5mdW5jdGlvbiByZW1vdmVQbGFjZWhvbGRlciggdW5pcXVlSWQsIGVsZW1lbnRzLCBhdHRyICkge1xuXHRlbGVtZW50cy5lYWNoKFxuXHRcdGZ1bmN0aW9uKCkge1xuXHRcdFx0Y29uc3QgZWxlbWVudCA9IGpRdWVyeSggdGhpcyApO1xuXG5cdFx0XHRjb25zdCBvbGRWYWx1ZSA9IGVsZW1lbnQuYXR0ciggYXR0ciApO1xuXHRcdFx0Y29uc3QgbmV3VmFsdWUgPSBvbGRWYWx1ZS5yZXBsYWNlKCAnJSUnLCB1bmlxdWVJZCApO1xuXG5cdFx0XHRlbGVtZW50LmF0dHIoIGF0dHIsIG5ld1ZhbHVlICk7XG5cdFx0fVxuXHQpO1xufVxuXG4vKipcbiAqIEluc2VydCB0aGUgZmllbGQncyBzdWJmaWVsZHMuXG4gKi9cbmZ1bmN0aW9uIGluc2VydEZpZWxkU3ViRmllbGRzKCB1aSApIHtcblx0Ly8gSW5zZXJ0IHRoZSBmaWVsZCdzIHN1YmZpZWxkcyBpZiBub3QgYWxyZWFkeSBpbnNlcnRlZC5cblx0aWYgKCAhIHVpLml0ZW0uaGFzQ2xhc3MoICdzdWItZmllbGRzLXJlYWR5JyApICkge1xuXHRcdGNvbnN0IHR5cGUgICAgICA9IHVpLml0ZW0uYXR0ciggJ2RhdGEtZmllbGQtdHlwZScgKTtcblx0XHRjb25zdCB1bmlxdWVJZCAgPSBwYXJzZUludCggdG90YWxGaWVsZEluc3RhbmNlcy52YWwoKSApO1xuXHRcdGNvbnN0IGZpZWxkVHlwZSA9ICd3Y2FwZi1mb3JtLWZpZWxkLScgKyB0eXBlO1xuXG5cdFx0Ly8gQmFpbCBvdXQgaWYgbm8gdG1wbCBmb3VuZCBmb3IgdGhlIHR5cGUuXG5cdFx0aWYgKCAhIGpRdWVyeSggJyN0bXBsLScgKyBmaWVsZFR5cGUgKS5sZW5ndGggKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0Ly8gSW5jcmVtZW50IHRoZSB2YWx1ZSBvZiB0b3RhbCBmaWVsZCBpbnN0YW5jZXMuXG5cdFx0dG90YWxGaWVsZEluc3RhbmNlcy52YWwoIHVuaXF1ZUlkICsgMSApO1xuXG5cdFx0Y29uc3QgdGVtcGxhdGUgPSB3cC50ZW1wbGF0ZSggZmllbGRUeXBlICk7XG5cdFx0Y29uc3QgcmVuZGVyZWQgPSB0ZW1wbGF0ZSgpO1xuXHRcdGNvbnN0IHdyYXBwZXIgID0gdWkuaXRlbS5maW5kKCAnLndpZGdldC1jb250ZW50JyApO1xuXG5cdFx0d3JhcHBlci5wcmVwZW5kKCByZW5kZXJlZCApO1xuXG5cdFx0Ly8gVXBkYXRlIHRoZSBmb3IgYXR0cmlidXRlcyBvZiB0aGUgbGFiZWxzLlxuXHRcdHJlbW92ZVBsYWNlaG9sZGVyKCB1bmlxdWVJZCwgdWkuaXRlbS5maW5kKCAnbGFiZWxbZm9yXj1cIndjYXBmLWlucHV0LVwiXScgKSwgJ2ZvcicgKTtcblxuXHRcdC8vIFVwZGF0ZSB0aGUgaWRzIG9mIHRoZSBpbnB1dCBlbGVtZW50cy5cblx0XHRyZW1vdmVQbGFjZWhvbGRlciggdW5pcXVlSWQsIHVpLml0ZW0uZmluZCggJypbaWRePVwid2NhcGYtaW5wdXQtXCJdJyApLCAnaWQnICk7XG5cblx0XHQvLyBVcGRhdGUgdGhlIG5hbWVzIG9mIHRoZSBpbnB1dCBlbGVtZW50cy5cblx0XHRyZW1vdmVQbGFjZWhvbGRlciggdW5pcXVlSWQsIHVpLml0ZW0uZmluZCggJypbaWRePVwid2NhcGYtaW5wdXQtXCJdJyApLCAnbmFtZScgKTtcblxuXHRcdC8vIFVwZGF0ZSB0aGUgcG9zaXRpb24gdmFsdWUuXG5cdFx0cmVtb3ZlUGxhY2Vob2xkZXIoIHVuaXF1ZUlkLCB1aS5pdGVtLmZpbmQoICcqW2lkXj1cIndjYXBmLWlucHV0LXBvc2l0aW9uLVwiXScgKSwgJ3ZhbHVlJyApO1xuXG5cdFx0dWkuaXRlbS5hZGRDbGFzcyggJ3N1Yi1maWVsZHMtcmVhZHknICk7XG5cblx0XHRzZWFyY2hGb3JtLnRyaWdnZXIoICdmaWVsZF9hZGRlZCcsIFsgdWkgXSApO1xuXHR9XG59XG5cbi8qKlxuICogVXBkYXRlIHRoZSBmb3JtIGZpZWxkJ3MgcG9zaXRpb24gYWZ0ZXIgc29ydC5cbiAqXG4gKiBAc291cmNlIGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vYS8xNDczNjc3NVxuICovXG5mdW5jdGlvbiB1cGRhdGVGaWVsZHNQb3NpdGlvbigpIHtcblx0Y29uc3QgaW5wdXRzICA9IHNlYXJjaEZvcm0uZmluZCggJypbaWRePVwid2NhcGYtaW5wdXQtcG9zaXRpb24tXCJdJyApO1xuXHRjb25zdCBuYkVsZW1zID0gaW5wdXRzLmxlbmd0aDtcblxuXHRpbnB1dHMuZWFjaChcblx0XHRmdW5jdGlvbiggaWR4ICkge1xuXHRcdFx0alF1ZXJ5KCB0aGlzICkudmFsKCBuYkVsZW1zIC0gKCBuYkVsZW1zIC0gaWR4ICkgKTtcblx0XHR9XG5cdCk7XG59XG5cbi8qKlxuICogTWFrZSB0aGUgZmllbGQgcmVhZHksIHJlbW92ZSBzdHlsZXMgY29tZXMgZnJvbSBqcXVlcnktdWktc29ydGFibGUgcGx1Z2luLCBpbnNlcnQgdGhlIGZpZWxkJ3Mgc3ViZmllbGRzIGV0Yy5cbiAqL1xuZnVuY3Rpb24gbWFrZUZpZWxkUmVhZHkoIGUsIHVpICkge1xuXHQvLyBSZW1vdmUgc3R5bGVzIGNvbWVzIGZyb20ganF1ZXJ5LXVpLXNvcnRhYmxlIHBsdWdpbi5cblx0dWkuaXRlbS5yZW1vdmVBdHRyKCAnc3R5bGUnICk7XG5cblx0aW5zZXJ0RmllbGRTdWJGaWVsZHMoIHVpICk7XG5cblx0dXBkYXRlRmllbGRzUG9zaXRpb24oKTtcblxuXHRjb25zdCB0b2dnbGVCdG4gPSB1aS5pdGVtLmZpbmQoICcud2lkZ2V0LWFjdGlvbicgKTtcblxuXHQvLyBFeHBhbmQgdGhlIGZvcm0gZmllbGQgYWZ0ZXIgc29ydC5cblx0aWYgKCAnZmFsc2UnID09PSB0b2dnbGVCdG4uYXR0ciggJ2FyaWEtZXhwYW5kZWQnICkgKSB7XG5cdFx0dG9nZ2xlQnRuLnRyaWdnZXIoICdjbGljaycgKTtcblx0fVxufVxuXG4vKipcbiAqIEluc3RhbnRpYXRlIHNvcnRhYmxlIGZvciB0aGUgZm9ybSBmaWVsZHMuXG4gKi9cbmZ1bmN0aW9uIHNvcnRhYmxlKCBpZGVudGlmaWVyICkge1xuXHRjb25zdCBjb250YWluZXIgPSBqUXVlcnkoIGlkZW50aWZpZXIgKTtcblxuXHRjb250YWluZXIuc29ydGFibGUoXG5cdFx0e1xuXHRcdFx0b3BhY2l0eTogMC44LFxuXHRcdFx0cmV2ZXJ0OiBmYWxzZSxcblx0XHRcdGN1cnNvcjogJ21vdmUnLFxuXHRcdFx0YXhpczogJ3knLFxuXHRcdFx0aGFuZGxlOiAnLndpZGdldC10b3AnLFxuXHRcdFx0Y2FuY2VsOiAnLndpZGdldC10aXRsZS1hY3Rpb24nLFxuXHRcdFx0aXRlbXM6ICcud2lkZ2V0Jyxcblx0XHRcdHBsYWNlaG9sZGVyOiAnd2lkZ2V0LXBsYWNlaG9sZGVyJyxcblx0XHRcdGNvbm5lY3RXaXRoOiAnI3NlYXJjaC1mb3JtLXdyYXBwZXInLFxuXHRcdFx0c3RvcDogbWFrZUZpZWxkUmVhZHksXG5cdFx0XHRzdGFydDogZnVuY3Rpb24oIGUsIHVpICkge1xuXHRcdFx0XHQvLyBJZiBpdCBpcyBnZXR0aW5nIGFwcGVuZGVkIHRvIHRoZSB3cm9uZyBwbGFjZSwgdGhlbiBmb3JjZSBpdCBpbnRvIHRoZSByaWdodCBjb250YWluZXIuXG5cdFx0XHRcdHVpLnBsYWNlaG9sZGVyLmFwcGVuZFRvKCB1aS5wbGFjZWhvbGRlci5wYXJlbnQoKS5maW5kKCAnLmluc2lkZSAjc2VhcmNoLWZvcm0td3JhcHBlcicgKSApO1xuXHRcdFx0fVxuXHRcdH1cblx0KTtcbn1cblxuc29ydGFibGUoICcjc2VhcmNoLWZvcm0nICk7XG5cbi8qKlxuICogUnVuIGZ1bmN0aW9uIHdoZW4gZHJhZyBzdGFydHMuXG4gKi9cbmZ1bmN0aW9uIG9uRHJhZ1N0YXJ0KCkge1xuXHRzZWFyY2hGb3JtLmFkZENsYXNzKCAndWktZHJvcC1hY3RpdmUnICk7XG59XG5cbi8qKlxuICogUnVuIGZ1bmN0aW9uIGF0IGRyYWcgc3RvcC5cbiAqL1xuZnVuY3Rpb24gb25EcmFnU3RvcCgpIHtcblx0c2VhcmNoRm9ybS5yZW1vdmVDbGFzcyggJ3VpLWRyb3AtYWN0aXZlJyApO1xufVxuXG4vKipcbiAqIEluaXRpYWxpemUgZHJhZ2dhYmxlIGZvciB0aGUgZm9ybSBmaWVsZHMuXG4gKi9cbmpRdWVyeSggJyNhdmFpbGFibGUtZmllbGRzIC53aWRnZXQnICkuZHJhZ2dhYmxlKFxuXHR7XG5cdFx0Y29ubmVjdFRvU29ydGFibGU6ICcjc2VhcmNoLWZvcm0nLFxuXHRcdGhlbHBlcjogJ2Nsb25lJyxcblx0XHRzdGFydDogb25EcmFnU3RhcnQsXG5cdFx0c3RvcDogb25EcmFnU3RvcCxcblx0fVxuKTtcblxuLyoqXG4gKiBUb2dnbGUgdGhlIGZvcm0gZmllbGQuXG4gKi9cbmZ1bmN0aW9uIHRvZ2dsZUZpZWxkKCBlICkge1xuXHRjb25zdCB0YXJnZXQgICAgICAgPSBlLnRhcmdldDtcblx0Y29uc3Qgd2lkZ2V0ICAgICAgID0galF1ZXJ5KCB0aGlzICkuY2xvc2VzdCggJy53aWRnZXQnICk7XG5cdGNvbnN0IHRvZ2dsZUJ0biAgICA9IHdpZGdldC5maW5kKCAnLndpZGdldC1hY3Rpb24nICk7XG5cdGNvbnN0IGluc2lkZSAgICAgICA9IHdpZGdldC5jaGlsZHJlbiggJy53aWRnZXQtaW5zaWRlJyApO1xuXHRjb25zdCBpc0V4cGFuZCAgICAgPSB0b2dnbGVCdG4uYXR0ciggJ2FyaWEtZXhwYW5kZWQnICk7XG5cdGNvbnN0IHRvZ2dsZUV4cGFuZCA9ICd0cnVlJyA9PT0gaXNFeHBhbmQgPyAnZmFsc2UnIDogJ3RydWUnO1xuXG5cdHRvZ2dsZUJ0bi5hdHRyKCAnYXJpYS1leHBhbmRlZCcsIHRvZ2dsZUV4cGFuZCApO1xuXHRqUXVlcnkoIGluc2lkZSApLnNsaWRlVG9nZ2xlKFxuXHRcdCdmYXN0Jyxcblx0XHRmdW5jdGlvbigpIHtcblx0XHRcdHdpZGdldC50b2dnbGVDbGFzcyggJ29wZW4nICk7XG5cdFx0XHRzZWFyY2hGb3JtLnRyaWdnZXIoICd3aWRnZXQtY2xvc2VkJywgWyB0YXJnZXQgXSApO1xuXHRcdH1cblx0KTtcbn1cblxuc2VhcmNoRm9ybS5vbiggJ2NsaWNrJywgJy53aWRnZXQtdG9wJywgdG9nZ2xlRmllbGQgKTtcbnNlYXJjaEZvcm0ub24oICdjbGljaycsICcud2lkZ2V0LWNvbnRyb2wtY2xvc2UnLCB0b2dnbGVGaWVsZCApO1xuXG4vKipcbiAqIEZvY3VzIHRoZSBmb3JtIGZpZWxkJ3MgZXhwYW5kIGJ1dHRvbi5cbiAqL1xuZnVuY3Rpb24gZm9jdXNGaWVsZCggZSwgdGFyZ2V0ICkge1xuXHRpZiAoIHRhcmdldC5jbGFzc0xpc3QuY29udGFpbnMoICd3aWRnZXQtY29udHJvbC1jbG9zZScgKSApIHtcblx0XHRjb25zdCB3aWRnZXQgPSBqUXVlcnkoIHRhcmdldCApLmNsb3Nlc3QoICcud2lkZ2V0JyApO1xuXHRcdGNvbnN0IGFjdGlvbiA9IHdpZGdldC5maW5kKCAnLndpZGdldC1hY3Rpb24nICk7XG5cblx0XHRhY3Rpb24uYXR0ciggJ2FyaWEtZXhwYW5kZWQnLCAnZmFsc2UnICkuZm9jdXMoKTtcblx0fVxufVxuXG5zZWFyY2hGb3JtLm9uKCAnd2lkZ2V0LWNsb3NlZCcsIGZvY3VzRmllbGQgKTtcblxuLyoqXG4gKiBSZW1vdmUgdGhlIGZpZWxkLlxuICovXG5mdW5jdGlvbiByZW1vdmVGaWVsZCgpIHtcblx0Y29uc3Qgd2lkZ2V0ID0galF1ZXJ5KCB0aGlzICkuY2xvc2VzdCggJy53aWRnZXQnICk7XG5cblx0alF1ZXJ5KCB3aWRnZXQgKS5zbGlkZVVwKFxuXHRcdCdmYXN0Jyxcblx0XHRmdW5jdGlvbigpIHtcblx0XHRcdHdpZGdldC5yZW1vdmUoKTtcblx0XHRcdHVwZGF0ZUZpZWxkc1Bvc2l0aW9uKCk7XG5cdFx0fVxuXHQpO1xufVxuXG5zZWFyY2hGb3JtLm9uKCAnY2xpY2snLCAnLndpZGdldC1jb250cm9sLXJlbW92ZScsIHJlbW92ZUZpZWxkICk7XG5cbi8qKlxuICogU3RvcmUgdGhlIGluaXRpYWwgZm9ybSBkYXRhIGludG8gYSB2YXJpYWJsZSBzbyB0aGF0IHdlIGNhbiBjb21wYXJlIGl0IHdoZW4gbGVhdmluZyB0aGUgcGFnZS5cbiAqL1xubGV0IGluaXRpYWxGb3JtU3RhdGUgPSBzZWFyY2hGb3JtLnNlcmlhbGl6ZUFycmF5KCk7XG5cbi8qKlxuICogU2hvdyBtZXNzYWdlIGFmdGVyIGZvcm0gc3VibWlzc2lvbi5cbiAqL1xuZnVuY3Rpb24gc2hvd01lc3NhZ2UoIG1lc3NhZ2UsIHR5cGUgPSAnc3VjY2VzcycgKSB7XG5cdGNvbnN0IGVsZW1lbnQgPSBqUXVlcnkoICc8cCBjbGFzcz1cIicgKyB0eXBlICsgJ1wiPicgKyBtZXNzYWdlICsgJzwvcD4nICk7XG5cdGNvbnN0IHdyYXBwZXIgPSBqUXVlcnkoICcud2NhcGYtbWVzc2FnZS13cmFwcGVyJyApO1xuXG5cdGlmICggISB3cmFwcGVyLmlzKCAnOmVtcHR5JyApICkge1xuXHRcdHJldHVybjtcblx0fVxuXG5cdGpRdWVyeSggd3JhcHBlciApLmh0bWwoIGVsZW1lbnQgKS5zbGlkZURvd24oICdmYXN0JyApO1xuXG5cdHNldFRpbWVvdXQoXG5cdFx0ZnVuY3Rpb24oKSB7XG5cdFx0XHRqUXVlcnkoIHdyYXBwZXIgKS5zbGlkZVVwKCAnZmFzdCcgKTtcblx0XHRcdHdyYXBwZXIuaHRtbCggJycgKTtcblx0XHR9LFxuXHRcdDMwMDBcblx0KTtcbn1cblxuLyoqXG4gKiBTYXZlIHRoZSBzZWFyY2ggZm9ybS5cbiAqL1xuZnVuY3Rpb24gc2F2ZUZvcm0oKSB7XG5cdGNvbnN0IGJ1dHRvbiAgID0galF1ZXJ5KCB0aGlzICk7XG5cdGNvbnN0IGZvcm1EYXRhID0gc2VhcmNoRm9ybS5zZXJpYWxpemVBcnJheSgpO1xuXG5cdGJ1dHRvbi5hdHRyKCAnZGlzYWJsZWQnLCAnZGlzYWJsZWQnICk7XG5cblx0ZnVuY3Rpb24gb2tDYWxsYmFjayggbWVzc2FnZSApIHtcblx0XHRidXR0b24ucmVtb3ZlQXR0ciggJ2Rpc2FibGVkJyApO1xuXG5cdFx0Ly8gVXBkYXRlIHRoZSBpbml0aWFsIGZvcm0gZGF0YSBhZnRlciBzdWNjZXNzZnVsbHkgc2F2aW5nIHRoZSBmb3JtLlxuXHRcdGluaXRpYWxGb3JtU3RhdGUgPSBmb3JtRGF0YTtcblxuXHRcdHNob3dNZXNzYWdlKCBtZXNzYWdlICk7XG5cdH1cblxuXHRmdW5jdGlvbiBlcnJDYWxsYmFjayggbWVzc2FnZSApIHtcblx0XHRidXR0b24ucmVtb3ZlQXR0ciggJ2Rpc2FibGVkJyApO1xuXHRcdHNob3dNZXNzYWdlKCBtZXNzYWdlLCAnZXJyb3InICk7XG5cdH1cblxuXHQvLyBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL2EvNTkxODEyNTJcblx0d3AuYWpheC5wb3N0KCBmb3JtRGF0YSApLmRvbmUoIG9rQ2FsbGJhY2sgKS5mYWlsKCBlcnJDYWxsYmFjayApO1xufVxuXG5qUXVlcnkoICcjcG9zdGJveC1jb250YWluZXItMScgKS5vbiggJ2NsaWNrJywgJ2J1dHRvbicsIHNhdmVGb3JtICk7XG5cbi8qKlxuICogU2hvdyBhbGVydCBvbiBsZWF2ZSBpZiB0aGUgZm9ybSBpcyBkaXJ0eS5cbiAqXG4gKiBUT0RPOiBVbmNvbW1lbnQgdGhpcy5cbiAqL1xuLy8gd2luZG93Lm9uYmVmb3JldW5sb2FkID0gZnVuY3Rpb24oKSB7XG4vLyBcdGNvbnN0IG5ld0Zvcm1TdGF0ZSA9IHNlYXJjaEZvcm0uc2VyaWFsaXplQXJyYXkoKTtcbi8vXG4vLyBcdGNvbnN0IGlzRm9ybURpcnR5ID0gISBfLmlzRXF1YWwoIG5ld0Zvcm1TdGF0ZSwgaW5pdGlhbEZvcm1TdGF0ZSApO1xuLy9cbi8vIFx0aWYgKCBpc0Zvcm1EaXJ0eSApIHtcbi8vIFx0XHRyZXR1cm4gJyc7XG4vLyBcdH1cbi8vIH07XG4iXX0=
