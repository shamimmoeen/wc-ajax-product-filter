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
      var $getOptions = $field.find('.get-options');
      var $autoOptions = $field.find('.number-automatic-options');
      var $manualOptions = $field.find('.number-manual-options-table');
      var $elm = $field.find(handler);
      var displayType = $elm.val();

      if ('range_slider' === displayType || 'range_number' === displayType) {
        $getOptions.hide();
        $manualOptions.addClass('force-hide');
        $autoOptions.addClass('force-show');
      } else {
        $getOptions.show();
        $manualOptions.removeClass('force-hide');
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
      'selector': '.manual-options-table',
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
      'selector': '.wcapf-form-sub-field-number_range_checkbox_query_type',
      'value': ['range_checkbox', 'range_multiselect']
    }, {
      'selector': '.wcapf-form-sub-field-number_range_select_all_items_label',
      'value': ['range_radio', 'range_select']
    }, {
      'selector': '.wcapf-form-sub-field-number_range_use_chosen',
      'value': ['range_select', 'range_multiselect']
    }, {
      'selector': '.number_range_col2_sub_fields',
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInBvc3QtbWV0YS1vcHRpb25zLmpzIiwic2VhcmNoLWZvcm0tZmllbGQuanMiLCJzZWFyY2gtZm9ybS5qcyJdLCJuYW1lcyI6WyJqUXVlcnkiLCJkb2N1bWVudCIsInJlYWR5IiwiJCIsIiRzZWFyY2hGb3JtIiwiaW5pdFNvcnRhYmxlRm9yTWFudWFsT3B0aW9ucyIsIiRzZWxlY3RvciIsInNvcnRhYmxlIiwib3BhY2l0eSIsInJldmVydCIsImN1cnNvciIsImF4aXMiLCJoYW5kbGUiLCJwbGFjZWhvbGRlciIsInVwZGF0ZSIsImUiLCIkZmllbGQiLCJ0YXJnZXQiLCJjbG9zZXN0IiwidHJpZ2dlck1hbnVhbE9wdGlvbnNDaGFuZ2UiLCJkaXNhYmxlU2VsZWN0aW9uIiwiZmluZCIsIm9uIiwidWkiLCJpdGVtIiwidHJpZ2dlclJlbW92ZU9wdGlvbiIsIiRvcHRpb25zVGFibGUiLCJ0YWJsZVJvd3MiLCJjaGlsZHJlbiIsImxlbmd0aCIsInJlbW92ZUNsYXNzIiwiJGl0ZW0iLCJyZW1vdmUiLCJlbXB0eSIsImZpZWxkVHlwZSIsInRlbXBsYXRlIiwid3AiLCJyZW5kZXJlZCIsInZhbHVlIiwibGFiZWwiLCIkd3JhcHBlciIsIiRyb3dzIiwiYXBwZW5kIiwiaGFzQ2xhc3MiLCJhZGRDbGFzcyIsIiRwb3N0TWV0YU9wdGlvbnNNb2RhbCIsIiRub0tleUZvdW5kTWVzc2FnZSIsIiRwb3N0TWV0YU1vZGFsTG9hZGVyIiwiJHBvc3RNZXRhT3B0aW9ucyIsIiRwb3N0TWV0YU1vZGFsRm9vdGVyIiwicG9zdE1ldGFPcHRpb25zTW9kYWxJbnN0YW5jZSIsInJlbW9kYWwiLCJoYXNoVHJhY2tpbmciLCIkcG9zdE1ldGFGaWVsZCIsInJlc2V0UG9zdE1ldGFNb2RhbCIsImh0bWwiLCJwcm9wIiwiJGlucHV0TWV0YUtleSIsIm1ldGFLZXkiLCJ2YWwiLCJvcGVuIiwib2tDYWxsYmFjayIsInJlc3BvbnNlIiwiZXJyQ2FsbGJhY2siLCJtZXNzYWdlIiwiY29uc29sZSIsImxvZyIsImZvcm1EYXRhIiwia2V5IiwiYWN0aW9uIiwiYWpheCIsInBvc3QiLCJkb25lIiwiZmFpbCIsIiR2YWx1ZUhvbGRlciIsIl9yb3dzIiwiZWFjaCIsImkiLCJfaXRlbSIsInB1c2giLCJyYXdWYWx1ZXMiLCJlbmNvZGVVUklDb21wb25lbnQiLCJKU09OIiwic3RyaW5naWZ5IiwiJG9wdGlvbnMiLCJpc1JlcGxhY2UiLCJyb3dzIiwiaXMiLCJpbnB1dCIsIiRpbnB1dCIsImNsb3NlIiwiaGFuZGxlciIsIiRzZWxlY3RFbG0iLCJvcmRlckJ5IiwiZGVwZW5kYW50T3B0aW9ucyIsImF0dHIiLCJjaGFuZ2UiLCJyZW1vdmVBdHRyIiwiZGlzYWJsZU9yZGVyQnlPcHRpb25zIiwiJGVsbSIsIiRvcmRlckRpcmVjdGlvbkZpZWxkIiwiJG9yZGVyVHlwZUZpZWxkIiwiJHRoaXMiLCJpbml0U29ydGFibGVGb3JOdW1iZXJNYW51YWxPcHRpb25zIiwidHJpZ2dlck51bWJlck1hbnVhbE9wdGlvbnNDaGFuZ2UiLCJ0cmlnZ2VyUmVtb3ZlTnVtYmVyT3B0aW9uIiwibWluX3ZhbHVlIiwibWF4X3ZhbHVlIiwiJGdldE9wdGlvbnMiLCIkYXV0b09wdGlvbnMiLCIkbWFudWFsT3B0aW9ucyIsImRpc3BsYXlUeXBlIiwiaGlkZSIsInNob3ciLCJ0b2dnbGVOdW1iZXJNaW5WYWx1ZUZpZWxkIiwiJHRleHRGaWVsZCIsInRvZ2dsZU51bWJlck1heFZhbHVlRmllbGQiLCJkZXBlbmRhbnREYXRhIiwiX3RyaWdnZXJJbnB1dFR5cGVUZXh0RGlzcGxheVR5cGVDaGFuZ2UiLCIkbm9SZXN1bHRzIiwiJGFsbEl0ZW1zTGFiZWwiLCJ1c2VDaG9zZW4iLCJfdHJpZ2dlcklucHV0VHlwZU51bWJlckRpc3BsYXlUeXBlQ2hhbmdlIiwiX3RyaWdnZXJJbnB1dFR5cGVUZXh0VXNlU2VsZWN0Q2hhbmdlIiwiX3RyaWdnZXJJbnB1dFR5cGVOdW1iZXJVc2VTZWxlY3RDaGFuZ2UiLCJfaGFuZGxlVG9nZ2xlUmVxdWVzdCIsImRhdGEiLCJjdXJyZW50U2VsZWN0b3IiLCJoYW5kbGVyVHlwZSIsImRlcGVuZGFudCIsIl92YWx1ZSIsImlkIiwiZCIsInZhbGlkVmFsdWVzIiwiaW5jbHVkZXMiLCJ0cmlnZ2VyIiwiaGFuZGxlVG9nZ2xlUmVxdWVzdCIsIiRoYW5kbGVyIiwiX3RoaXMiLCJzZXR1cFNlYXJjaEZvcm0iLCJpbml0YWwiLCJldmVudCIsInRvdGFsRmllbGRJbnN0YW5jZXMiLCJzZWFyY2hGb3JtIiwicmVtb3ZlUGxhY2Vob2xkZXIiLCJ1bmlxdWVJZCIsImVsZW1lbnRzIiwiZWxlbWVudCIsIm9sZFZhbHVlIiwibmV3VmFsdWUiLCJyZXBsYWNlIiwiaW5zZXJ0RmllbGRTdWJGaWVsZHMiLCJ0eXBlIiwicGFyc2VJbnQiLCJ3cmFwcGVyIiwicHJlcGVuZCIsInVwZGF0ZUZpZWxkc1Bvc2l0aW9uIiwiaW5wdXRzIiwibmJFbGVtcyIsImlkeCIsIm1ha2VGaWVsZFJlYWR5IiwidG9nZ2xlQnRuIiwiaWRlbnRpZmllciIsImNvbnRhaW5lciIsImNhbmNlbCIsIml0ZW1zIiwiY29ubmVjdFdpdGgiLCJzdG9wIiwic3RhcnQiLCJhcHBlbmRUbyIsInBhcmVudCIsIm9uRHJhZ1N0YXJ0Iiwib25EcmFnU3RvcCIsImRyYWdnYWJsZSIsImNvbm5lY3RUb1NvcnRhYmxlIiwiaGVscGVyIiwidG9nZ2xlRmllbGQiLCJ3aWRnZXQiLCJpbnNpZGUiLCJpc0V4cGFuZCIsInRvZ2dsZUV4cGFuZCIsInNsaWRlVG9nZ2xlIiwidG9nZ2xlQ2xhc3MiLCJmb2N1c0ZpZWxkIiwiY2xhc3NMaXN0IiwiY29udGFpbnMiLCJmb2N1cyIsInJlbW92ZUZpZWxkIiwic2xpZGVVcCIsImluaXRpYWxGb3JtU3RhdGUiLCJzZXJpYWxpemVBcnJheSIsInNob3dNZXNzYWdlIiwic2xpZGVEb3duIiwic2V0VGltZW91dCIsInNhdmVGb3JtIiwiYnV0dG9uIl0sIm1hcHBpbmdzIjoiOztBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQUEsTUFB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LE9BQXJCLEVBQStCO0FBQzlCbUksSUFBQUEsTUFBTSxDQUFDbEcsVUFBUCxDQUFtQixVQUFuQixFQUQ4QixDQUc5Qjs7QUFDQTRGLElBQUFBLGdCQUFnQixHQUFHMUgsUUFBbkI7QUFFQTRILElBQUFBLFdBQVcsQ0FBRS9ILE9BQUYsQ0FBWDtBQUNBOztBQUVELFdBQVNELFdBQVQsQ0FBc0JDLE9BQXRCLEVBQWdDO0FBQy9CbUksSUFBQUEsTUFBTSxDQUFDbEcsVUFBUCxDQUFtQixVQUFuQjtBQUNBOEYsSUFBQUEsV0FBVyxDQUFFL0gsT0FBRixFQUFXLE9BQVgsQ0FBWDtBQUNBLEdBbEJrQixDQW9CbkI7OztBQUNBNUIsRUFBQUEsRUFBRSxDQUFDa0MsSUFBSCxDQUFRQyxJQUFSLENBQWNKLFFBQWQsRUFBeUJLLElBQXpCLENBQStCWCxVQUEvQixFQUE0Q1ksSUFBNUMsQ0FBa0RWLFdBQWxEO0FBQ0E7O0FBRUQvRCxNQUFNLENBQUUsc0JBQUYsQ0FBTixDQUFpQ3NCLEVBQWpDLENBQXFDLE9BQXJDLEVBQThDLFFBQTlDLEVBQXdENEssUUFBeEQ7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6IndjLWFqYXgtcHJvZHVjdC1maWx0ZXItYWRtaW4tc2NyaXB0cy5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogVGhlIHBvc3QgbWV0YSBmaWVsZC5cbiAqXG4gKiBAc2luY2UgICAgICAxLjAuMFxuICogQHBhY2thZ2UgICAgd2MtYWpheC1wcm9kdWN0LWZpbHRlci1wcm9cbiAqIEBzdWJwYWNrYWdlIHdjLWFqYXgtcHJvZHVjdC1maWx0ZXItcHJvL2FkbWluL3NyYy9qc1xuICogQGF1dGhvciAgICAgTWFpbnVsIEhhc3NhbiBNYWluXG4gKi9cblxualF1ZXJ5KCBkb2N1bWVudCApLnJlYWR5KCBmdW5jdGlvbiggJCApIHtcblxuXHRjb25zdCAkc2VhcmNoRm9ybSA9ICQoICcjc2VhcmNoLWZvcm0nICk7XG5cblx0ZnVuY3Rpb24gaW5pdFNvcnRhYmxlRm9yTWFudWFsT3B0aW9ucyggJHNlbGVjdG9yICkge1xuXHRcdCRzZWxlY3Rvci5zb3J0YWJsZSgge1xuXHRcdFx0b3BhY2l0eTogMC44LFxuXHRcdFx0cmV2ZXJ0OiBmYWxzZSxcblx0XHRcdGN1cnNvcjogJ21vdmUnLFxuXHRcdFx0YXhpczogJ3knLFxuXHRcdFx0aGFuZGxlOiAnLm1vdmUtb3B0aW9ucy1oYW5kbGVyJyxcblx0XHRcdHBsYWNlaG9sZGVyOiAnd2lkZ2V0LXBsYWNlaG9sZGVyJyxcblx0XHRcdHVwZGF0ZTogZnVuY3Rpb24oIGUgKSB7XG5cdFx0XHRcdGNvbnN0ICRmaWVsZCA9ICQoIGUudGFyZ2V0ICkuY2xvc2VzdCggJy53Y2FwZi1mb3JtLWZpZWxkJyApO1xuXG5cdFx0XHRcdHRyaWdnZXJNYW51YWxPcHRpb25zQ2hhbmdlKCAkZmllbGQgKTtcblx0XHRcdH1cblx0XHR9ICkuZGlzYWJsZVNlbGVjdGlvbigpO1xuXHR9XG5cblx0Ly8gU29ydCBNYW51YWwgT3B0aW9uc1xuXHRpbml0U29ydGFibGVGb3JNYW51YWxPcHRpb25zKCAkc2VhcmNoRm9ybS5maW5kKCAnLm1hbnVhbC1vcHRpb25zLXRhYmxlIC5tYW51YWwtb3B0aW9ucy10YWJsZS1ib2R5LXJvd3MnICkgKTtcblxuXHQkc2VhcmNoRm9ybS5vbiggJ2ZpZWxkX2FkZGVkJywgZnVuY3Rpb24oIGUsIHVpICkge1xuXHRcdC8vIEluaXQgU29ydGFibGUgZm9yIHRoZSBtYW51YWwgb3B0aW9ucy5cblx0XHRpbml0U29ydGFibGVGb3JNYW51YWxPcHRpb25zKCAkKCB1aS5pdGVtLmZpbmQoICcubWFudWFsLW9wdGlvbnMtdGFibGUtYm9keS1yb3dzJyApICkgKTtcblx0fSApO1xuXG5cdGZ1bmN0aW9uIHRyaWdnZXJSZW1vdmVPcHRpb24oICRmaWVsZCApIHtcblx0XHRjb25zdCAkb3B0aW9uc1RhYmxlID0gJGZpZWxkLmZpbmQoICcubWFudWFsLW9wdGlvbnMtdGFibGUnICk7XG5cdFx0Y29uc3QgdGFibGVSb3dzICAgICA9ICRvcHRpb25zVGFibGUuZmluZCggJy5tYW51YWwtb3B0aW9ucy10YWJsZS1ib2R5LXJvd3MnICkuY2hpbGRyZW4oKTtcblxuXHRcdGlmICggMiA+IHRhYmxlUm93cy5sZW5ndGggKSB7XG5cdFx0XHQkb3B0aW9uc1RhYmxlLnJlbW92ZUNsYXNzKCAnaGFzLW9wdGlvbnMnICk7XG5cdFx0fVxuXHR9XG5cblx0Ly8gUmVtb3ZlIFNpbmdsZSBPcHRpb25cblx0JHNlYXJjaEZvcm0ub24oICdjbGljaycsICcucmVtb3ZlLW9wdGlvbicsIGZ1bmN0aW9uKCkge1xuXHRcdGNvbnN0ICRpdGVtICA9ICQoIHRoaXMgKS5jbG9zZXN0KCAnLml0ZW0nICk7XG5cdFx0Y29uc3QgJGZpZWxkID0gJGl0ZW0uY2xvc2VzdCggJy53Y2FwZi1mb3JtLWZpZWxkJyApO1xuXG5cdFx0dHJpZ2dlclJlbW92ZU9wdGlvbiggJGZpZWxkICk7XG5cblx0XHQkaXRlbS5yZW1vdmUoKTtcblxuXHRcdHRyaWdnZXJNYW51YWxPcHRpb25zQ2hhbmdlKCAkZmllbGQgKTtcblx0fSApO1xuXG5cdC8vIENsZWFyIEFsbCBPcHRpb25zXG5cdCRzZWFyY2hGb3JtLm9uKCAnY2xpY2snLCAnLmNsZWFyLWFsbC1vcHRpb25zJywgZnVuY3Rpb24oKSB7XG5cdFx0Y29uc3QgJGZpZWxkICAgICAgICA9ICQoIHRoaXMgKS5jbG9zZXN0KCAnLndjYXBmLWZvcm0tZmllbGQnICk7XG5cdFx0Y29uc3QgJG9wdGlvbnNUYWJsZSA9ICRmaWVsZC5maW5kKCAnLm1hbnVhbC1vcHRpb25zLXRhYmxlJyApO1xuXG5cdFx0JG9wdGlvbnNUYWJsZS5maW5kKCAnLm1hbnVhbC1vcHRpb25zLXRhYmxlLWJvZHktcm93cycgKS5lbXB0eSgpO1xuXG5cdFx0dHJpZ2dlclJlbW92ZU9wdGlvbiggJGZpZWxkICk7XG5cblx0XHR0cmlnZ2VyTWFudWFsT3B0aW9uc0NoYW5nZSggJGZpZWxkICk7XG5cdH0gKTtcblxuXHQvLyBBZGQgTmV3IE9wdGlvblxuXHQkc2VhcmNoRm9ybS5vbiggJ2NsaWNrJywgJy5hZGQtb3B0aW9uJywgZnVuY3Rpb24oKSB7XG5cdFx0Y29uc3QgZmllbGRUeXBlID0gJ3djYXBmLXBvc3QtbWV0YS1vcHRpb24nO1xuXG5cdFx0Ly8gQmFpbCBvdXQgaWYgbm8gdG1wbCBmb3VuZCBmb3IgdGhlIHR5cGUuXG5cdFx0aWYgKCAhIGpRdWVyeSggJyN0bXBsLScgKyBmaWVsZFR5cGUgKS5sZW5ndGggKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0Y29uc3QgJGZpZWxkID0gJCggdGhpcyApLmNsb3Nlc3QoICcud2NhcGYtZm9ybS1maWVsZCcgKTtcblxuXHRcdGNvbnN0IHRlbXBsYXRlID0gd3AudGVtcGxhdGUoIGZpZWxkVHlwZSApO1xuXHRcdGNvbnN0IHJlbmRlcmVkID0gdGVtcGxhdGUoIHsgdmFsdWU6ICcnLCBsYWJlbDogJycgfSApO1xuXHRcdGNvbnN0ICR3cmFwcGVyID0gJGZpZWxkLmZpbmQoICcubWFudWFsLW9wdGlvbnMtdGFibGUnICk7XG5cdFx0Y29uc3QgJHJvd3MgICAgPSAkd3JhcHBlci5maW5kKCAnLm1hbnVhbC1vcHRpb25zLXRhYmxlLWJvZHktcm93cycgKTtcblxuXHRcdCRyb3dzLmFwcGVuZCggcmVuZGVyZWQgKTtcblxuXHRcdGlmICggISAkd3JhcHBlci5oYXNDbGFzcyggJ2hhcy1vcHRpb25zJyApICkge1xuXHRcdFx0JHdyYXBwZXIuYWRkQ2xhc3MoICdoYXMtb3B0aW9ucycgKTtcblx0XHR9XG5cdH0gKTtcblxuXHRjb25zdCAkcG9zdE1ldGFPcHRpb25zTW9kYWwgPSAkKCAnLnBvc3QtbWV0YS1vcHRpb25zLW1vZGFsJyApO1xuXHRjb25zdCAkbm9LZXlGb3VuZE1lc3NhZ2UgICAgPSAkcG9zdE1ldGFPcHRpb25zTW9kYWwuZmluZCggJy5uby1rZXktZm91bmQtbWVzc2FnZScgKTtcblx0Y29uc3QgJHBvc3RNZXRhTW9kYWxMb2FkZXIgID0gJHBvc3RNZXRhT3B0aW9uc01vZGFsLmZpbmQoICcucG9zdC1tZXRhLW9wdGlvbnMtbG9hZGVyJyApO1xuXHRjb25zdCAkcG9zdE1ldGFPcHRpb25zICAgICAgPSAkcG9zdE1ldGFPcHRpb25zTW9kYWwuZmluZCggJy5wb3N0LW1ldGEtb3B0aW9ucycgKTtcblx0Y29uc3QgJHBvc3RNZXRhTW9kYWxGb290ZXIgID0gJHBvc3RNZXRhT3B0aW9uc01vZGFsLmZpbmQoICcud2NhcGYtbW9kYWwtZm9vdGVyJyApO1xuXG5cdGNvbnN0IHBvc3RNZXRhT3B0aW9uc01vZGFsSW5zdGFuY2UgPSAkcG9zdE1ldGFPcHRpb25zTW9kYWwucmVtb2RhbCgge1xuXHRcdGhhc2hUcmFja2luZzogZmFsc2UsXG5cdH0gKTtcblxuXHRsZXQgJHBvc3RNZXRhRmllbGQgPSBudWxsO1xuXG5cdGZ1bmN0aW9uIHJlc2V0UG9zdE1ldGFNb2RhbCgpIHtcblx0XHQkcG9zdE1ldGFPcHRpb25zLmh0bWwoICcnICk7XG5cdFx0JHBvc3RNZXRhTW9kYWxMb2FkZXIucmVtb3ZlQ2xhc3MoICdhY3RpdmUnICk7XG5cdFx0JG5vS2V5Rm91bmRNZXNzYWdlLnJlbW92ZUNsYXNzKCAnYWN0aXZlJyApO1xuXHRcdCRwb3N0TWV0YU1vZGFsRm9vdGVyLnJlbW92ZUNsYXNzKCAnYWN0aXZlJyApO1xuXHRcdCRwb3N0TWV0YU9wdGlvbnNNb2RhbC5maW5kKCAnLnJlcGxhY2UtY3VycmVudC1vcHRpb25zJyApLnByb3AoICdjaGVja2VkJywgZmFsc2UgKTtcblx0fVxuXG5cdC8vIEJyb3dzZSBWYWx1ZXNcblx0JHNlYXJjaEZvcm0ub24oICdjbGljaycsICcuYnJvd3NlLXZhbHVlcycsIGZ1bmN0aW9uKCkge1xuXHRcdHJlc2V0UG9zdE1ldGFNb2RhbCgpO1xuXG5cdFx0Y29uc3QgJGZpZWxkICAgICAgICA9ICQoIHRoaXMgKS5jbG9zZXN0KCAnLndjYXBmLWZvcm0tZmllbGQnICk7XG5cdFx0Y29uc3QgJGlucHV0TWV0YUtleSA9ICRmaWVsZC5maW5kKCAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLW1ldGFfa2V5IHNlbGVjdCcgKTtcblx0XHRjb25zdCBtZXRhS2V5ICAgICAgID0gJGlucHV0TWV0YUtleS52YWwoKTtcblxuXHRcdGlmICggISBtZXRhS2V5ICkge1xuXHRcdFx0JG5vS2V5Rm91bmRNZXNzYWdlLmFkZENsYXNzKCAnYWN0aXZlJyApO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHQkbm9LZXlGb3VuZE1lc3NhZ2UucmVtb3ZlQ2xhc3MoICdhY3RpdmUnICk7XG5cdFx0fVxuXG5cdFx0cG9zdE1ldGFPcHRpb25zTW9kYWxJbnN0YW5jZS5vcGVuKCk7XG5cdFx0JHBvc3RNZXRhRmllbGQgPSAkZmllbGQ7XG5cblx0XHRpZiAoICEgbWV0YUtleSApIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHQvLyBTaG93IHRoZSBsb2FkaW5nIGFuaW1hdGlvbi5cblx0XHQkcG9zdE1ldGFNb2RhbExvYWRlci5hZGRDbGFzcyggJ2FjdGl2ZScgKTtcblxuXHRcdC8qKlxuXHRcdCAqIEFqYXgncyBzdWNjZXNzIGZ1bmN0aW9uLlxuXHRcdCAqXG5cdFx0ICogQHBhcmFtIHJlc3BvbnNlXG5cdFx0ICovXG5cdFx0ZnVuY3Rpb24gb2tDYWxsYmFjayggcmVzcG9uc2UgKSB7XG5cdFx0XHQvLyBIaWRlIHRoZSBsb2FkaW5nIGFuaW1hdGlvbi5cblx0XHRcdCRwb3N0TWV0YU1vZGFsTG9hZGVyLnJlbW92ZUNsYXNzKCAnYWN0aXZlJyApO1xuXHRcdFx0JHBvc3RNZXRhTW9kYWxGb290ZXIuYWRkQ2xhc3MoICdhY3RpdmUnICk7XG5cblx0XHRcdCRwb3N0TWV0YU9wdGlvbnMuaHRtbCggcmVzcG9uc2UgKTtcblx0XHR9XG5cblx0XHQvKipcblx0XHQgKiBBamF4J3MgZXJyb3IgZnVuY3Rpb24uXG5cdFx0ICpcblx0XHQgKiBAcGFyYW0gbWVzc2FnZVxuXHRcdCAqL1xuXHRcdGZ1bmN0aW9uIGVyckNhbGxiYWNrKCBtZXNzYWdlICkge1xuXHRcdFx0Y29uc29sZS5sb2coICdlcnJvcicsIG1lc3NhZ2UgKTtcblxuXHRcdFx0Ly8gSGlkZSB0aGUgbG9hZGluZyBhbmltYXRpb24uXG5cdFx0XHQkcG9zdE1ldGFNb2RhbExvYWRlci5yZW1vdmVDbGFzcyggJ2FjdGl2ZScgKTtcblx0XHR9XG5cblx0XHRjb25zdCBmb3JtRGF0YSA9IHtcblx0XHRcdGtleTogbWV0YUtleSxcblx0XHRcdGFjdGlvbjogJ3djYXBmX2dldF9tZXRhX29wdGlvbnMnLFxuXHRcdH1cblxuXHRcdC8vIGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vYS81OTE4MTI1MlxuXHRcdHdwLmFqYXgucG9zdCggZm9ybURhdGEgKS5kb25lKCBva0NhbGxiYWNrICkuZmFpbCggZXJyQ2FsbGJhY2sgKTtcblx0fSApO1xuXG5cdC8qKlxuXHQgKiBSZXNldCB0aGUgcG9zdCBtZXRhIG9wdGlvbidzIG1vZGFsIHdoZW4gbW9kYWwgZ2V0cyBjbG9zZWQuXG5cdCAqL1xuXHQkKCBkb2N1bWVudCApLm9uKCAnY2xvc2VkJywgJHBvc3RNZXRhT3B0aW9uc01vZGFsLCBmdW5jdGlvbigpIHtcblx0XHRyZXNldFBvc3RNZXRhTW9kYWwoKTtcblx0XHQkcG9zdE1ldGFGaWVsZCA9IG51bGw7XG5cdH0gKTtcblxuXHQvLyBVbnNlbGVjdCBhbGwgdmFsdWVzLlxuXHQkcG9zdE1ldGFPcHRpb25zTW9kYWwub24oICdjbGljaycsICcuc2VsZWN0LW5vbmUnLCBmdW5jdGlvbigpIHtcblx0XHQkcG9zdE1ldGFPcHRpb25zLmZpbmQoICdbdHlwZT1cImNoZWNrYm94XCJdJyApLnByb3AoICdjaGVja2VkJywgZmFsc2UgKTtcblx0fSApO1xuXG5cdC8vIFNlbGVjdCBhbGwgdmFsdWVzLlxuXHQkcG9zdE1ldGFPcHRpb25zTW9kYWwub24oICdjbGljaycsICcuc2VsZWN0LWFsbCcsIGZ1bmN0aW9uKCkge1xuXHRcdCRwb3N0TWV0YU9wdGlvbnMuZmluZCggJ1t0eXBlPVwiY2hlY2tib3hcIl0nICkucHJvcCggJ2NoZWNrZWQnLCB0cnVlICk7XG5cdH0gKTtcblxuXHRmdW5jdGlvbiB0cmlnZ2VyTWFudWFsT3B0aW9uc0NoYW5nZSggJHBvc3RNZXRhRmllbGQgKSB7XG5cdFx0Y29uc3QgJHZhbHVlSG9sZGVyICA9ICRwb3N0TWV0YUZpZWxkLmZpbmQoICcud2NhcGYtZm9ybS1zdWItZmllbGQtbWFudWFsX29wdGlvbnMgaW5wdXQnICk7XG5cdFx0Y29uc3QgJG9wdGlvbnNUYWJsZSA9ICRwb3N0TWV0YUZpZWxkLmZpbmQoICcubWFudWFsLW9wdGlvbnMtdGFibGUnICk7XG5cdFx0Y29uc3QgJHJvd3MgICAgICAgICA9ICRvcHRpb25zVGFibGUuZmluZCggJy5tYW51YWwtb3B0aW9ucy10YWJsZS1ib2R5LXJvd3MnICk7XG5cdFx0Y29uc3QgX3Jvd3MgICAgICAgICA9IFtdO1xuXG5cdFx0JHJvd3MuZmluZCggJy5pdGVtJyApLmVhY2goIGZ1bmN0aW9uKCBpLCBfaXRlbSApIHtcblx0XHRcdGNvbnN0ICRpdGVtID0gJCggX2l0ZW0gKTtcblx0XHRcdGNvbnN0IHZhbHVlID0gJGl0ZW0uZmluZCggJy5vcHRpb25fdmFsdWUnICkudmFsKCk7XG5cdFx0XHRjb25zdCBsYWJlbCA9ICRpdGVtLmZpbmQoICcub3B0aW9uX2xhYmVsJyApLnZhbCgpO1xuXG5cdFx0XHRpZiAoIHZhbHVlICYmIGxhYmVsICkge1xuXHRcdFx0XHRfcm93cy5wdXNoKCBbIHZhbHVlLCBsYWJlbCBdICk7XG5cdFx0XHR9XG5cdFx0fSApO1xuXG5cdFx0Y29uc3QgcmF3VmFsdWVzID0gZW5jb2RlVVJJQ29tcG9uZW50KCBKU09OLnN0cmluZ2lmeSggX3Jvd3MgKSApO1xuXHRcdCR2YWx1ZUhvbGRlci52YWwoIHJhd1ZhbHVlcyApO1xuXHR9XG5cblx0Ly8gQWRkIHNlbGVjdGVkIG9wdGlvbnMuXG5cdCRwb3N0TWV0YU9wdGlvbnNNb2RhbC5vbiggJ2NsaWNrJywgJy5hZGQtb3B0aW9ucycsIGZ1bmN0aW9uKCkge1xuXHRcdGNvbnN0ICRvcHRpb25zID0gJHBvc3RNZXRhT3B0aW9ucy5maW5kKCAnW3R5cGU9XCJjaGVja2JveFwiXScgKTtcblx0XHRsZXQgaXNSZXBsYWNlICA9IGZhbHNlO1xuXHRcdGxldCByb3dzICAgICAgID0gJyc7XG5cblx0XHRpZiAoICRwb3N0TWV0YU1vZGFsRm9vdGVyLmZpbmQoICcucmVwbGFjZS1jdXJyZW50LW9wdGlvbnMnICkuaXMoICc6Y2hlY2tlZCcgKSApIHtcblx0XHRcdGlzUmVwbGFjZSA9IHRydWU7XG5cdFx0fVxuXG5cdFx0aWYgKCAkb3B0aW9ucyApIHtcblx0XHRcdGNvbnN0IGZpZWxkVHlwZSA9ICd3Y2FwZi1wb3N0LW1ldGEtb3B0aW9uJztcblxuXHRcdFx0JC5lYWNoKCAkb3B0aW9ucywgZnVuY3Rpb24oIGksIGlucHV0ICkge1xuXHRcdFx0XHRjb25zdCAkaW5wdXQgPSAkKCBpbnB1dCApO1xuXHRcdFx0XHRjb25zdCB2YWx1ZSAgPSAkaW5wdXQudmFsKCk7XG5cblx0XHRcdFx0aWYgKCAkaW5wdXQuaXMoICc6Y2hlY2tlZCcgKSApIHtcblx0XHRcdFx0XHRjb25zdCB0ZW1wbGF0ZSA9IHdwLnRlbXBsYXRlKCBmaWVsZFR5cGUgKTtcblx0XHRcdFx0XHRjb25zdCByZW5kZXJlZCA9IHRlbXBsYXRlKCB7IHZhbHVlLCBsYWJlbDogdmFsdWUgfSApO1xuXG5cdFx0XHRcdFx0cm93cyArPSByZW5kZXJlZDtcblx0XHRcdFx0fVxuXHRcdFx0fSApO1xuXHRcdH1cblxuXHRcdGlmICggcm93cyApIHtcblx0XHRcdGNvbnN0ICR3cmFwcGVyID0gJHBvc3RNZXRhRmllbGQuZmluZCggJy5tYW51YWwtb3B0aW9ucy10YWJsZScgKTtcblx0XHRcdGNvbnN0ICRyb3dzICAgID0gJHdyYXBwZXIuZmluZCggJy5tYW51YWwtb3B0aW9ucy10YWJsZS1ib2R5LXJvd3MnICk7XG5cblx0XHRcdGlmICggaXNSZXBsYWNlICkge1xuXHRcdFx0XHQkcm93cy5odG1sKCByb3dzICk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHQkcm93cy5hcHBlbmQoIHJvd3MgKTtcblx0XHRcdH1cblxuXHRcdFx0aWYgKCAhICR3cmFwcGVyLmhhc0NsYXNzKCAnaGFzLW9wdGlvbnMnICkgKSB7XG5cdFx0XHRcdCR3cmFwcGVyLmFkZENsYXNzKCAnaGFzLW9wdGlvbnMnICk7XG5cdFx0XHR9XG5cblx0XHRcdHRyaWdnZXJNYW51YWxPcHRpb25zQ2hhbmdlKCAkcG9zdE1ldGFGaWVsZCApO1xuXHRcdH1cblxuXHRcdHBvc3RNZXRhT3B0aW9uc01vZGFsSW5zdGFuY2UuY2xvc2UoKTtcblx0fSApO1xuXG5cdCRzZWFyY2hGb3JtLm9uKCAnYWZ0ZXJfdG9nZ2xlX3JlcXVlc3QnLCBmdW5jdGlvbiggZSwgaGFuZGxlciwgdmFsdWUsICRmaWVsZCApIHtcblx0XHRpZiAoICcud2NhcGYtZm9ybS1zdWItZmllbGQtZ2V0X29wdGlvbnMgaW5wdXQnID09PSBoYW5kbGVyICkge1xuXHRcdFx0Y29uc3QgJHNlbGVjdEVsbSAgICAgICA9ICRmaWVsZC5maW5kKCAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLW9wdGlvbnNfb3JkZXJfYnkgc2VsZWN0JyApO1xuXHRcdFx0Y29uc3Qgb3JkZXJCeSAgICAgICAgICA9ICRzZWxlY3RFbG0udmFsKCk7XG5cdFx0XHRjb25zdCBkZXBlbmRhbnRPcHRpb25zID0gJ29wdGlvblt2YWx1ZT1cImxhYmVsXCJdJztcblxuXHRcdFx0aWYgKCAnYXV0b21hdGljYWxseScgPT09IHZhbHVlICkge1xuXHRcdFx0XHQkc2VsZWN0RWxtLmNoaWxkcmVuKCBkZXBlbmRhbnRPcHRpb25zICkuYXR0ciggJ2Rpc2FibGVkJywgJ2Rpc2FibGVkJyApO1xuXG5cdFx0XHRcdGlmICggJ2xhYmVsJyA9PT0gb3JkZXJCeSApIHtcblx0XHRcdFx0XHQkc2VsZWN0RWxtLnByb3AoICdzZWxlY3RlZEluZGV4JywgMSApLmNoYW5nZSgpO1xuXHRcdFx0XHR9XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHQkc2VsZWN0RWxtLmNoaWxkcmVuKCBkZXBlbmRhbnRPcHRpb25zICkucmVtb3ZlQXR0ciggJ2Rpc2FibGVkJyApO1xuXHRcdFx0fVxuXHRcdH1cblx0fSApO1xuXG5cdGZ1bmN0aW9uIGRpc2FibGVPcmRlckJ5T3B0aW9ucyggJGVsbSApIHtcblx0XHRjb25zdCB2YWx1ZSAgICAgICAgICAgICAgICA9ICRlbG0udmFsKCk7XG5cdFx0Y29uc3QgJHdyYXBwZXIgICAgICAgICAgICAgPSAkZWxtLmNsb3Nlc3QoICcud2NhcGYtcG9zdC1tZXRhLW9yZGVyLW9wdGlvbnMtZmllbGQnICk7XG5cdFx0Y29uc3QgJG9yZGVyRGlyZWN0aW9uRmllbGQgPSAkd3JhcHBlci5maW5kKCAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLW9wdGlvbnNfb3JkZXJfZGlyIHNlbGVjdCcgKTtcblx0XHRjb25zdCAkb3JkZXJUeXBlRmllbGQgICAgICA9ICR3cmFwcGVyLmZpbmQoICcud2NhcGYtZm9ybS1zdWItZmllbGQtb3B0aW9uc19vcmRlcl90eXBlIHNlbGVjdCcgKTtcblxuXHRcdGlmICggJ25vbmUnID09PSB2YWx1ZSApIHtcblx0XHRcdCRvcmRlckRpcmVjdGlvbkZpZWxkLmF0dHIoICdkaXNhYmxlZCcsICdkaXNhYmxlZCcgKTtcblx0XHRcdCRvcmRlclR5cGVGaWVsZC5hdHRyKCAnZGlzYWJsZWQnLCAnZGlzYWJsZWQnICk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdCRvcmRlckRpcmVjdGlvbkZpZWxkLnJlbW92ZUF0dHIoICdkaXNhYmxlZCcgKTtcblx0XHRcdCRvcmRlclR5cGVGaWVsZC5yZW1vdmVBdHRyKCAnZGlzYWJsZWQnICk7XG5cdFx0fVxuXHR9XG5cblx0JHNlYXJjaEZvcm0uZmluZCggJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1vcHRpb25zX29yZGVyX2J5IHNlbGVjdCcgKS5lYWNoKCBmdW5jdGlvbigpIHtcblx0XHRjb25zdCAkdGhpcyA9ICQoIHRoaXMgKTtcblxuXHRcdGRpc2FibGVPcmRlckJ5T3B0aW9ucyggJHRoaXMgKTtcblx0fSApO1xuXG5cdCRzZWFyY2hGb3JtLm9uKCAnY2hhbmdlJywgJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1vcHRpb25zX29yZGVyX2J5IHNlbGVjdCcsIGZ1bmN0aW9uKCkge1xuXHRcdGNvbnN0ICR0aGlzID0gJCggdGhpcyApO1xuXG5cdFx0ZGlzYWJsZU9yZGVyQnlPcHRpb25zKCAkdGhpcyApO1xuXHR9ICk7XG5cblx0JHNlYXJjaEZvcm0ub24oICdpbnB1dCcsICcubWFudWFsLW9wdGlvbnMtdGFibGUgaW5wdXRbdHlwZT1cInRleHRcIl0nLCBmdW5jdGlvbigpIHtcblx0XHRjb25zdCAkZmllbGQgPSAkKCB0aGlzICkuY2xvc2VzdCggJy53Y2FwZi1mb3JtLWZpZWxkJyApO1xuXG5cdFx0dHJpZ2dlck1hbnVhbE9wdGlvbnNDaGFuZ2UoICRmaWVsZCApO1xuXHR9ICk7XG5cblx0LyoqXG5cdCAqIFZhbHVlIHR5cGUgJ051bWJlcidcblx0ICovXG5cblx0ZnVuY3Rpb24gaW5pdFNvcnRhYmxlRm9yTnVtYmVyTWFudWFsT3B0aW9ucyggJHNlbGVjdG9yICkge1xuXHRcdCRzZWxlY3Rvci5zb3J0YWJsZSgge1xuXHRcdFx0b3BhY2l0eTogMC44LFxuXHRcdFx0cmV2ZXJ0OiBmYWxzZSxcblx0XHRcdGN1cnNvcjogJ21vdmUnLFxuXHRcdFx0YXhpczogJ3knLFxuXHRcdFx0aGFuZGxlOiAnLm1vdmUtb3B0aW9ucy1oYW5kbGVyJyxcblx0XHRcdHBsYWNlaG9sZGVyOiAnd2lkZ2V0LXBsYWNlaG9sZGVyJyxcblx0XHRcdHVwZGF0ZTogZnVuY3Rpb24oIGUgKSB7XG5cdFx0XHRcdGNvbnN0ICRmaWVsZCA9ICQoIGUudGFyZ2V0ICkuY2xvc2VzdCggJy53Y2FwZi1mb3JtLWZpZWxkJyApO1xuXG5cdFx0XHRcdHRyaWdnZXJOdW1iZXJNYW51YWxPcHRpb25zQ2hhbmdlKCAkZmllbGQgKTtcblx0XHRcdH1cblx0XHR9ICkuZGlzYWJsZVNlbGVjdGlvbigpO1xuXHR9XG5cblx0Ly8gU29ydCBOdW1iZXIgTWFudWFsIE9wdGlvbnNcblx0aW5pdFNvcnRhYmxlRm9yTnVtYmVyTWFudWFsT3B0aW9ucyggJHNlYXJjaEZvcm0uZmluZCggJy5udW1iZXItbWFudWFsLW9wdGlvbnMtdGFibGUgLm1hbnVhbC1vcHRpb25zLXRhYmxlLWJvZHktcm93cycgKSApO1xuXG5cdCRzZWFyY2hGb3JtLm9uKCAnZmllbGRfYWRkZWQnLCBmdW5jdGlvbiggZSwgdWkgKSB7XG5cdFx0Ly8gSW5pdCBTb3J0YWJsZSBmb3IgdGhlIG51bWJlciBtYW51YWwgb3B0aW9ucy5cblx0XHRpbml0U29ydGFibGVGb3JOdW1iZXJNYW51YWxPcHRpb25zKCAkKCB1aS5pdGVtLmZpbmQoICcubWFudWFsLW9wdGlvbnMtdGFibGUtYm9keS1yb3dzJyApICkgKTtcblx0fSApO1xuXG5cdGZ1bmN0aW9uIHRyaWdnZXJSZW1vdmVOdW1iZXJPcHRpb24oICRmaWVsZCApIHtcblx0XHRjb25zdCAkb3B0aW9uc1RhYmxlID0gJGZpZWxkLmZpbmQoICcubnVtYmVyLW1hbnVhbC1vcHRpb25zLXRhYmxlJyApO1xuXHRcdGNvbnN0IHRhYmxlUm93cyAgICAgPSAkb3B0aW9uc1RhYmxlLmZpbmQoICcubWFudWFsLW9wdGlvbnMtdGFibGUtYm9keS1yb3dzJyApLmNoaWxkcmVuKCk7XG5cblx0XHRpZiAoIDIgPiB0YWJsZVJvd3MubGVuZ3RoICkge1xuXHRcdFx0JG9wdGlvbnNUYWJsZS5yZW1vdmVDbGFzcyggJ2hhcy1vcHRpb25zJyApO1xuXHRcdH1cblx0fVxuXG5cdGZ1bmN0aW9uIHRyaWdnZXJOdW1iZXJNYW51YWxPcHRpb25zQ2hhbmdlKCAkcG9zdE1ldGFGaWVsZCApIHtcblx0XHRjb25zdCAkdmFsdWVIb2xkZXIgID0gJHBvc3RNZXRhRmllbGQuZmluZCggJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1udW1iZXJfbWFudWFsX29wdGlvbnMgaW5wdXQnICk7XG5cdFx0Y29uc3QgJG9wdGlvbnNUYWJsZSA9ICRwb3N0TWV0YUZpZWxkLmZpbmQoICcubnVtYmVyLW1hbnVhbC1vcHRpb25zLXRhYmxlJyApO1xuXHRcdGNvbnN0ICRyb3dzICAgICAgICAgPSAkb3B0aW9uc1RhYmxlLmZpbmQoICcubWFudWFsLW9wdGlvbnMtdGFibGUtYm9keS1yb3dzJyApO1xuXHRcdGNvbnN0IF9yb3dzICAgICAgICAgPSBbXTtcblxuXHRcdCRyb3dzLmZpbmQoICcuaXRlbScgKS5lYWNoKCBmdW5jdGlvbiggaSwgX2l0ZW0gKSB7XG5cdFx0XHRjb25zdCAkaXRlbSAgICAgPSAkKCBfaXRlbSApO1xuXHRcdFx0Y29uc3QgbWluX3ZhbHVlID0gJGl0ZW0uZmluZCggJy5vcHRpb25fbWluX3ZhbHVlJyApLnZhbCgpO1xuXHRcdFx0Y29uc3QgbWF4X3ZhbHVlID0gJGl0ZW0uZmluZCggJy5vcHRpb25fbWF4X3ZhbHVlJyApLnZhbCgpO1xuXHRcdFx0Y29uc3QgbGFiZWwgICAgID0gJGl0ZW0uZmluZCggJy5vcHRpb25fbGFiZWwnICkudmFsKCk7XG5cblx0XHRcdGlmICggbWluX3ZhbHVlICYmIG1heF92YWx1ZSAmJiBsYWJlbCApIHtcblx0XHRcdFx0X3Jvd3MucHVzaCggWyBtaW5fdmFsdWUsIG1heF92YWx1ZSwgbGFiZWwgXSApO1xuXHRcdFx0fVxuXHRcdH0gKTtcblxuXHRcdGNvbnN0IHJhd1ZhbHVlcyA9IGVuY29kZVVSSUNvbXBvbmVudCggSlNPTi5zdHJpbmdpZnkoIF9yb3dzICkgKTtcblx0XHQkdmFsdWVIb2xkZXIudmFsKCByYXdWYWx1ZXMgKTtcblx0fVxuXG5cdC8vIFJlbW92ZSBTaW5nbGUgTnVtYmVyIE9wdGlvblxuXHQkc2VhcmNoRm9ybS5vbiggJ2NsaWNrJywgJy5yZW1vdmUtbnVtYmVyLW9wdGlvbicsIGZ1bmN0aW9uKCkge1xuXHRcdGNvbnN0ICRpdGVtICA9ICQoIHRoaXMgKS5jbG9zZXN0KCAnLml0ZW0nICk7XG5cdFx0Y29uc3QgJGZpZWxkID0gJGl0ZW0uY2xvc2VzdCggJy53Y2FwZi1mb3JtLWZpZWxkJyApO1xuXG5cdFx0dHJpZ2dlclJlbW92ZU51bWJlck9wdGlvbiggJGZpZWxkICk7XG5cblx0XHQkaXRlbS5yZW1vdmUoKTtcblxuXHRcdHRyaWdnZXJOdW1iZXJNYW51YWxPcHRpb25zQ2hhbmdlKCAkZmllbGQgKTtcblx0fSApO1xuXG5cdC8vIENsZWFyIEFsbCBPcHRpb25zXG5cdCRzZWFyY2hGb3JtLm9uKCAnY2xpY2snLCAnLmNsZWFyLWFsbC1udW1iZXItb3B0aW9ucycsIGZ1bmN0aW9uKCkge1xuXHRcdGNvbnN0ICRmaWVsZCAgICAgICAgPSAkKCB0aGlzICkuY2xvc2VzdCggJy53Y2FwZi1mb3JtLWZpZWxkJyApO1xuXHRcdGNvbnN0ICRvcHRpb25zVGFibGUgPSAkZmllbGQuZmluZCggJy5udW1iZXItbWFudWFsLW9wdGlvbnMtdGFibGUnICk7XG5cblx0XHQkb3B0aW9uc1RhYmxlLmZpbmQoICcubWFudWFsLW9wdGlvbnMtdGFibGUtYm9keS1yb3dzJyApLmVtcHR5KCk7XG5cblx0XHR0cmlnZ2VyUmVtb3ZlTnVtYmVyT3B0aW9uKCAkZmllbGQgKTtcblxuXHRcdHRyaWdnZXJOdW1iZXJNYW51YWxPcHRpb25zQ2hhbmdlKCAkZmllbGQgKTtcblx0fSApO1xuXG5cdC8vIEFkZCBOZXcgT3B0aW9uXG5cdCRzZWFyY2hGb3JtLm9uKCAnY2xpY2snLCAnLmFkZC1udW1iZXItb3B0aW9uJywgZnVuY3Rpb24oKSB7XG5cdFx0Y29uc3QgZmllbGRUeXBlID0gJ3djYXBmLXBvc3QtbWV0YS10eXBlLW51bWJlci1vcHRpb24nO1xuXG5cdFx0Ly8gQmFpbCBvdXQgaWYgbm8gdG1wbCBmb3VuZCBmb3IgdGhlIHR5cGUuXG5cdFx0aWYgKCAhIGpRdWVyeSggJyN0bXBsLScgKyBmaWVsZFR5cGUgKS5sZW5ndGggKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0Y29uc3QgJGZpZWxkID0gJCggdGhpcyApLmNsb3Nlc3QoICcud2NhcGYtZm9ybS1maWVsZCcgKTtcblxuXHRcdGNvbnN0IHRlbXBsYXRlID0gd3AudGVtcGxhdGUoIGZpZWxkVHlwZSApO1xuXHRcdGNvbnN0IHJlbmRlcmVkID0gdGVtcGxhdGUoIHsgdmFsdWU6ICcnLCBsYWJlbDogJycgfSApO1xuXHRcdGNvbnN0ICR3cmFwcGVyID0gJGZpZWxkLmZpbmQoICcubnVtYmVyLW1hbnVhbC1vcHRpb25zLXRhYmxlJyApO1xuXHRcdGNvbnN0ICRyb3dzICAgID0gJHdyYXBwZXIuZmluZCggJy5tYW51YWwtb3B0aW9ucy10YWJsZS1ib2R5LXJvd3MnICk7XG5cblx0XHQkcm93cy5hcHBlbmQoIHJlbmRlcmVkICk7XG5cblx0XHRpZiAoICEgJHdyYXBwZXIuaGFzQ2xhc3MoICdoYXMtb3B0aW9ucycgKSApIHtcblx0XHRcdCR3cmFwcGVyLmFkZENsYXNzKCAnaGFzLW9wdGlvbnMnICk7XG5cdFx0fVxuXHR9ICk7XG5cblx0JHNlYXJjaEZvcm0ub24oICdpbnB1dCcsICcubnVtYmVyLW1hbnVhbC1vcHRpb25zLXRhYmxlIGlucHV0W3R5cGU9XCJ0ZXh0XCJdJywgZnVuY3Rpb24oKSB7XG5cdFx0Y29uc3QgJGZpZWxkID0gJCggdGhpcyApLmNsb3Nlc3QoICcud2NhcGYtZm9ybS1maWVsZCcgKTtcblxuXHRcdHRyaWdnZXJOdW1iZXJNYW51YWxPcHRpb25zQ2hhbmdlKCAkZmllbGQgKTtcblx0fSApO1xuXG5cdCRzZWFyY2hGb3JtLm9uKCAnYWZ0ZXJfdG9nZ2xlX3JlcXVlc3QnLCBmdW5jdGlvbiggZSwgaGFuZGxlciwgdmFsdWUsICRmaWVsZCApIHtcblx0XHRpZiAoICcud2NhcGYtZm9ybS1zdWItZmllbGQtbnVtYmVyX2Rpc3BsYXlfdHlwZSBzZWxlY3QnID09PSBoYW5kbGVyICkge1xuXHRcdFx0Y29uc3QgJGdldE9wdGlvbnMgICAgPSAkZmllbGQuZmluZCggJy5nZXQtb3B0aW9ucycgKTtcblx0XHRcdGNvbnN0ICRhdXRvT3B0aW9ucyAgID0gJGZpZWxkLmZpbmQoICcubnVtYmVyLWF1dG9tYXRpYy1vcHRpb25zJyApO1xuXHRcdFx0Y29uc3QgJG1hbnVhbE9wdGlvbnMgPSAkZmllbGQuZmluZCggJy5udW1iZXItbWFudWFsLW9wdGlvbnMtdGFibGUnICk7XG5cdFx0XHRjb25zdCAkZWxtICAgICAgICAgICA9ICRmaWVsZC5maW5kKCBoYW5kbGVyICk7XG5cdFx0XHRjb25zdCBkaXNwbGF5VHlwZSAgICA9ICRlbG0udmFsKCk7XG5cblx0XHRcdGlmICggJ3JhbmdlX3NsaWRlcicgPT09IGRpc3BsYXlUeXBlIHx8ICdyYW5nZV9udW1iZXInID09PSBkaXNwbGF5VHlwZSApIHtcblx0XHRcdFx0JGdldE9wdGlvbnMuaGlkZSgpO1xuXHRcdFx0XHQkbWFudWFsT3B0aW9ucy5hZGRDbGFzcyggJ2ZvcmNlLWhpZGUnICk7XG5cdFx0XHRcdCRhdXRvT3B0aW9ucy5hZGRDbGFzcyggJ2ZvcmNlLXNob3cnICk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHQkZ2V0T3B0aW9ucy5zaG93KCk7XG5cdFx0XHRcdCRtYW51YWxPcHRpb25zLnJlbW92ZUNsYXNzKCAnZm9yY2UtaGlkZScgKTtcblx0XHRcdFx0JGF1dG9PcHRpb25zLnJlbW92ZUNsYXNzKCAnZm9yY2Utc2hvdycgKTtcblx0XHRcdH1cblx0XHR9XG5cdH0gKTtcblxuXHRmdW5jdGlvbiB0b2dnbGVOdW1iZXJNaW5WYWx1ZUZpZWxkKCAkZWxtICkge1xuXHRcdGNvbnN0ICRmaWVsZCAgICAgPSAkZWxtLmNsb3Nlc3QoICcud2NhcGYtZm9ybS1maWVsZCcgKTtcblx0XHRjb25zdCAkdGV4dEZpZWxkID0gJGZpZWxkLmZpbmQoICcud2NhcGYtZm9ybS1zdWItZmllbGQtbWluX3ZhbHVlIGlucHV0W3R5cGU9XCJ0ZXh0XCJdJyApO1xuXG5cdFx0aWYgKCAkZWxtLmlzKCAnOmNoZWNrZWQnICkgKSB7XG5cdFx0XHQkdGV4dEZpZWxkLmF0dHIoICdkaXNhYmxlZCcsICdkaXNhYmxlZCcgKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0JHRleHRGaWVsZC5yZW1vdmVBdHRyKCAnZGlzYWJsZWQnICk7XG5cdFx0fVxuXHR9XG5cblx0JHNlYXJjaEZvcm0uZmluZCggJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1taW5fdmFsdWVfYXV0b19kZXRlY3QgaW5wdXRbdHlwZT1cImNoZWNrYm94XCJdJyApLmVhY2goIGZ1bmN0aW9uKCkge1xuXHRcdGNvbnN0ICR0aGlzID0gJCggdGhpcyApO1xuXG5cdFx0dG9nZ2xlTnVtYmVyTWluVmFsdWVGaWVsZCggJHRoaXMgKTtcblx0fSApO1xuXG5cdCRzZWFyY2hGb3JtLm9uKCAnY2xpY2snLCAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLW1pbl92YWx1ZV9hdXRvX2RldGVjdCBpbnB1dFt0eXBlPVwiY2hlY2tib3hcIl0nLCBmdW5jdGlvbigpIHtcblx0XHRjb25zdCAkdGhpcyA9ICQoIHRoaXMgKTtcblxuXHRcdHRvZ2dsZU51bWJlck1pblZhbHVlRmllbGQoICR0aGlzICk7XG5cdH0gKTtcblxuXHRmdW5jdGlvbiB0b2dnbGVOdW1iZXJNYXhWYWx1ZUZpZWxkKCAkZWxtICkge1xuXHRcdGNvbnN0ICRmaWVsZCAgICAgPSAkZWxtLmNsb3Nlc3QoICcud2NhcGYtZm9ybS1maWVsZCcgKTtcblx0XHRjb25zdCAkdGV4dEZpZWxkID0gJGZpZWxkLmZpbmQoICcud2NhcGYtZm9ybS1zdWItZmllbGQtbWF4X3ZhbHVlIGlucHV0W3R5cGU9XCJ0ZXh0XCJdJyApO1xuXG5cdFx0aWYgKCAkZWxtLmlzKCAnOmNoZWNrZWQnICkgKSB7XG5cdFx0XHQkdGV4dEZpZWxkLmF0dHIoICdkaXNhYmxlZCcsICdkaXNhYmxlZCcgKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0JHRleHRGaWVsZC5yZW1vdmVBdHRyKCAnZGlzYWJsZWQnICk7XG5cdFx0fVxuXHR9XG5cblx0JHNlYXJjaEZvcm0uZmluZCggJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1tYXhfdmFsdWVfYXV0b19kZXRlY3QgaW5wdXRbdHlwZT1cImNoZWNrYm94XCJdJyApLmVhY2goIGZ1bmN0aW9uKCkge1xuXHRcdGNvbnN0ICR0aGlzID0gJCggdGhpcyApO1xuXG5cdFx0dG9nZ2xlTnVtYmVyTWF4VmFsdWVGaWVsZCggJHRoaXMgKTtcblx0fSApO1xuXG5cdCRzZWFyY2hGb3JtLm9uKCAnY2xpY2snLCAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLW1heF92YWx1ZV9hdXRvX2RldGVjdCBpbnB1dFt0eXBlPVwiY2hlY2tib3hcIl0nLCBmdW5jdGlvbigpIHtcblx0XHRjb25zdCAkdGhpcyA9ICQoIHRoaXMgKTtcblxuXHRcdHRvZ2dsZU51bWJlck1heFZhbHVlRmllbGQoICR0aGlzICk7XG5cdH0gKTtcblxufSApO1xuIiwiLyoqXG4gKiBUaGUgc2VhcmNoIGZvcm0gZmllbGQuXG4gKlxuICogQHNpbmNlICAgICAgMy4wLjBcbiAqIEBwYWNrYWdlICAgIHdjLWFqYXgtcHJvZHVjdC1maWx0ZXJcbiAqIEBzdWJwYWNrYWdlIHdjLWFqYXgtcHJvZHVjdC1maWx0ZXIvYWRtaW4vc3JjL2pzXG4gKiBAYXV0aG9yICAgICBNYWludWwgSGFzc2FuIE1haW5cbiAqL1xuXG5qUXVlcnkoIGRvY3VtZW50ICkucmVhZHkoIGZ1bmN0aW9uKCAkICkge1xuXG5cdGNvbnN0ICRzZWFyY2hGb3JtID0gJCggJyNzZWFyY2gtZm9ybScgKTtcblxuXHRjb25zdCBkZXBlbmRhbnREYXRhID0gW1xuXHRcdHtcblx0XHRcdCdoYW5kbGVyJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC12YWx1ZV90eXBlIHNlbGVjdCcsXG5cdFx0XHQnaGFuZGxlclR5cGUnOiAnc2VsZWN0Jyxcblx0XHRcdCdldmVudCc6ICdjaGFuZ2UnLFxuXHRcdFx0J2RlcGVuZGFudCc6IFtcblx0XHRcdFx0e1xuXHRcdFx0XHRcdCdzZWxlY3Rvcic6ICcuaW5wdXQtdHlwZS10ZXh0LWZpZWxkcycsXG5cdFx0XHRcdFx0J3ZhbHVlJzogWyAndGV4dCcgXSxcblx0XHRcdFx0fSxcblx0XHRcdFx0e1xuXHRcdFx0XHRcdCdzZWxlY3Rvcic6ICcuaW5wdXQtdHlwZS1udW1iZXItZmllbGRzJyxcblx0XHRcdFx0XHQndmFsdWUnOiBbICdudW1iZXInIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLmlucHV0LXR5cGUtZGF0ZS1maWVsZHMnLFxuXHRcdFx0XHRcdCd2YWx1ZSc6IFsgJ2RhdGUnIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRdLFxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0J2hhbmRsZXInOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLWRpc3BsYXlfdHlwZSBzZWxlY3QnLFxuXHRcdFx0J2hhbmRsZXJUeXBlJzogJ3NlbGVjdCcsXG5cdFx0XHQnZXZlbnQnOiAnY2hhbmdlJyxcblx0XHRcdCdkZXBlbmRhbnQnOiBbXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLXF1ZXJ5X3R5cGUnLFxuXHRcdFx0XHRcdCd2YWx1ZSc6IFsgJ2NoZWNrYm94JywgJ211bHRpLXNlbGVjdCcgXSxcblx0XHRcdFx0fSxcblx0XHRcdFx0e1xuXHRcdFx0XHRcdCdzZWxlY3Rvcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtYWxsX2l0ZW1zX2xhYmVsJyxcblx0XHRcdFx0XHQndmFsdWUnOiBbICdyYWRpbycsICdzZWxlY3QnIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLXVzZV9jaG9zZW4nLFxuXHRcdFx0XHRcdCd2YWx1ZSc6IFsgJ3NlbGVjdCcsICdtdWx0aS1zZWxlY3QnIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRdLFxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0J2hhbmRsZXInOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLXVzZV9jaG9zZW4gaW5wdXQnLFxuXHRcdFx0J2hhbmRsZXJUeXBlJzogJ2NoZWNrYm94Jyxcblx0XHRcdCdldmVudCc6ICdjaGFuZ2UnLFxuXHRcdFx0J2RlcGVuZGFudCc6IFtcblx0XHRcdFx0e1xuXHRcdFx0XHRcdCdzZWxlY3Rvcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtY2hvc2VuX25vX3Jlc3VsdHNfbWVzc2FnZScsXG5cdFx0XHRcdFx0J3ZhbHVlJzogWyAnMScgXSxcblx0XHRcdFx0fSxcblx0XHRcdF0sXG5cdFx0fSxcblx0XHR7XG5cdFx0XHQnaGFuZGxlcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtZ2V0X29wdGlvbnMgaW5wdXQnLFxuXHRcdFx0J2hhbmRsZXJUeXBlJzogJ3JhZGlvJyxcblx0XHRcdCdldmVudCc6ICdjaGFuZ2UnLFxuXHRcdFx0J2RlcGVuZGFudCc6IFtcblx0XHRcdFx0e1xuXHRcdFx0XHRcdCdzZWxlY3Rvcic6ICcubWFudWFsLW9wdGlvbnMtdGFibGUnLFxuXHRcdFx0XHRcdCd2YWx1ZSc6IFsgJ21hbnVhbF9lbnRyeScgXSxcblx0XHRcdFx0fSxcblx0XHRcdF0sXG5cdFx0fSxcblx0XHR7XG5cdFx0XHQnaGFuZGxlcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtbnVtYmVyX2Rpc3BsYXlfdHlwZSBzZWxlY3QnLFxuXHRcdFx0J2hhbmRsZXJUeXBlJzogJ3NlbGVjdCcsXG5cdFx0XHQnZXZlbnQnOiAnY2hhbmdlJyxcblx0XHRcdCdkZXBlbmRhbnQnOiBbXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLW51bWJlcl9yYW5nZV9zbGlkZXJfZGlzcGxheV92YWx1ZXNfYXMnLFxuXHRcdFx0XHRcdCd2YWx1ZSc6IFsgJ3JhbmdlX3NsaWRlcicgXSxcblx0XHRcdFx0fSxcblx0XHRcdFx0e1xuXHRcdFx0XHRcdCdzZWxlY3Rvcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtbnVtYmVyX3JhbmdlX2NoZWNrYm94X3F1ZXJ5X3R5cGUnLFxuXHRcdFx0XHRcdCd2YWx1ZSc6IFsgJ3JhbmdlX2NoZWNrYm94JywgJ3JhbmdlX211bHRpc2VsZWN0JyBdLFxuXHRcdFx0XHR9LFxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0J3NlbGVjdG9yJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1udW1iZXJfcmFuZ2Vfc2VsZWN0X2FsbF9pdGVtc19sYWJlbCcsXG5cdFx0XHRcdFx0J3ZhbHVlJzogWyAncmFuZ2VfcmFkaW8nLCAncmFuZ2Vfc2VsZWN0JyBdLFxuXHRcdFx0XHR9LFxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0J3NlbGVjdG9yJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1udW1iZXJfcmFuZ2VfdXNlX2Nob3NlbicsXG5cdFx0XHRcdFx0J3ZhbHVlJzogWyAncmFuZ2Vfc2VsZWN0JywgJ3JhbmdlX211bHRpc2VsZWN0JyBdLFxuXHRcdFx0XHR9LFxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0J3NlbGVjdG9yJzogJy5udW1iZXJfcmFuZ2VfY29sMl9zdWJfZmllbGRzJyxcblx0XHRcdFx0XHQndmFsdWUnOiBbICdyYW5nZV9jaGVja2JveCcsICdyYW5nZV9yYWRpbycsICdyYW5nZV9zZWxlY3QnLCAncmFuZ2VfbXVsdGlzZWxlY3QnIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLm51bWJlci1kZWNpbWFsLWZpZWxkcycsXG5cdFx0XHRcdFx0J3ZhbHVlJzogWyAncmFuZ2Vfc2xpZGVyJywgJ3JhbmdlX2NoZWNrYm94JywgJ3JhbmdlX3JhZGlvJywgJ3JhbmdlX3NlbGVjdCcsICdyYW5nZV9tdWx0aXNlbGVjdCcgXSxcblx0XHRcdFx0fSxcblx0XHRcdF0sXG5cdFx0fSxcblx0XHR7XG5cdFx0XHQnaGFuZGxlcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtbnVtYmVyX3JhbmdlX3VzZV9jaG9zZW4gaW5wdXQnLFxuXHRcdFx0J2hhbmRsZXJUeXBlJzogJ2NoZWNrYm94Jyxcblx0XHRcdCdldmVudCc6ICdjaGFuZ2UnLFxuXHRcdFx0J2RlcGVuZGFudCc6IFtcblx0XHRcdFx0e1xuXHRcdFx0XHRcdCdzZWxlY3Rvcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtbnVtYmVyX3JhbmdlX2Nob3Nlbl9ub19yZXN1bHRzX21lc3NhZ2UnLFxuXHRcdFx0XHRcdCd2YWx1ZSc6IFsgJzEnIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRdLFxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0J2hhbmRsZXInOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLW51bWJlcl9nZXRfb3B0aW9ucyBpbnB1dCcsXG5cdFx0XHQnaGFuZGxlclR5cGUnOiAncmFkaW8nLFxuXHRcdFx0J2V2ZW50JzogJ2NoYW5nZScsXG5cdFx0XHQnZGVwZW5kYW50JzogW1xuXHRcdFx0XHR7XG5cdFx0XHRcdFx0J3NlbGVjdG9yJzogJy5udW1iZXItYXV0b21hdGljLW9wdGlvbnMnLFxuXHRcdFx0XHRcdCd2YWx1ZSc6IFsgJ2F1dG9tYXRpY2FsbHknIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLm51bWJlci1tYW51YWwtb3B0aW9ucy10YWJsZScsXG5cdFx0XHRcdFx0J3ZhbHVlJzogWyAnbWFudWFsX2VudHJ5JyBdLFxuXHRcdFx0XHR9LFxuXHRcdFx0XSxcblx0XHR9LFxuXHRcdHtcblx0XHRcdCdoYW5kbGVyJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1kYXRlX2lucHV0X3R5cGUgc2VsZWN0Jyxcblx0XHRcdCdoYW5kbGVyVHlwZSc6ICdzZWxlY3QnLFxuXHRcdFx0J2V2ZW50JzogJ2NoYW5nZScsXG5cdFx0XHQnZGVwZW5kYW50JzogW1xuXHRcdFx0XHR7XG5cdFx0XHRcdFx0J3NlbGVjdG9yJzogJy5kYXRlLXRvLXVpLW9wdGlvbnMnLFxuXHRcdFx0XHRcdCd2YWx1ZSc6IFsgJ3JhbmdlX2RhdGUnIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRdLFxuXHRcdH0sXG5cdF07XG5cblx0ZnVuY3Rpb24gX3RyaWdnZXJJbnB1dFR5cGVUZXh0RGlzcGxheVR5cGVDaGFuZ2UoIHZhbHVlLCAkZmllbGQgKSB7XG5cdFx0Y29uc3QgJG5vUmVzdWx0cyAgICAgPSAkZmllbGQuZmluZCggJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1jaG9zZW5fbm9fcmVzdWx0c19tZXNzYWdlJyApO1xuXHRcdGNvbnN0ICRhbGxJdGVtc0xhYmVsID0gJGZpZWxkLmZpbmQoICcud2NhcGYtZm9ybS1zdWItZmllbGQtYWxsX2l0ZW1zX2xhYmVsJyApO1xuXHRcdGNvbnN0IHVzZUNob3NlbiAgICAgID0gJGZpZWxkLmZpbmQoICcud2NhcGYtZm9ybS1zdWItZmllbGQtdXNlX2Nob3NlbiBpbnB1dCcgKS5pcyggJzpjaGVja2VkJyApO1xuXG5cdFx0aWYgKCB1c2VDaG9zZW4gJiYgKCAnc2VsZWN0JyA9PT0gdmFsdWUgfHwgJ211bHRpLXNlbGVjdCcgPT09IHZhbHVlICkgKSB7XG5cdFx0XHQkbm9SZXN1bHRzLnNob3coKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0JG5vUmVzdWx0cy5oaWRlKCk7XG5cdFx0fVxuXG5cdFx0aWYgKCAoICdyYWRpbycgPT09IHZhbHVlIHx8ICdzZWxlY3QnID09PSB2YWx1ZSApIHx8ICggJ211bHRpLXNlbGVjdCcgPT09IHZhbHVlICYmIHVzZUNob3NlbiApICkge1xuXHRcdFx0JGFsbEl0ZW1zTGFiZWwuc2hvdygpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHQkYWxsSXRlbXNMYWJlbC5oaWRlKCk7XG5cdFx0fVxuXHR9XG5cblx0ZnVuY3Rpb24gX3RyaWdnZXJJbnB1dFR5cGVOdW1iZXJEaXNwbGF5VHlwZUNoYW5nZSggdmFsdWUsICRmaWVsZCApIHtcblx0XHRjb25zdCAkbm9SZXN1bHRzICAgICA9ICRmaWVsZC5maW5kKCAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLW51bWJlcl9yYW5nZV9jaG9zZW5fbm9fcmVzdWx0c19tZXNzYWdlJyApO1xuXHRcdGNvbnN0ICRhbGxJdGVtc0xhYmVsID0gJGZpZWxkLmZpbmQoICcud2NhcGYtZm9ybS1zdWItZmllbGQtbnVtYmVyX3JhbmdlX3NlbGVjdF9hbGxfaXRlbXNfbGFiZWwnICk7XG5cdFx0Y29uc3QgdXNlQ2hvc2VuICAgICAgPSAkZmllbGQuZmluZCggJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1udW1iZXJfcmFuZ2VfdXNlX2Nob3NlbiBpbnB1dCcgKS5pcyggJzpjaGVja2VkJyApO1xuXG5cdFx0aWYgKCB1c2VDaG9zZW4gJiYgKCAncmFuZ2Vfc2VsZWN0JyA9PT0gdmFsdWUgfHwgJ3JhbmdlX211bHRpc2VsZWN0JyA9PT0gdmFsdWUgKSApIHtcblx0XHRcdCRub1Jlc3VsdHMuc2hvdygpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHQkbm9SZXN1bHRzLmhpZGUoKTtcblx0XHR9XG5cblx0XHRpZiAoICggJ3JhbmdlX3JhZGlvJyA9PT0gdmFsdWUgfHwgJ3JhbmdlX3NlbGVjdCcgPT09IHZhbHVlICkgfHwgKCAncmFuZ2VfbXVsdGlzZWxlY3QnID09PSB2YWx1ZSAmJiB1c2VDaG9zZW4gKSApIHtcblx0XHRcdCRhbGxJdGVtc0xhYmVsLnNob3coKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0JGFsbEl0ZW1zTGFiZWwuaGlkZSgpO1xuXHRcdH1cblx0fVxuXG5cdGZ1bmN0aW9uIF90cmlnZ2VySW5wdXRUeXBlVGV4dFVzZVNlbGVjdENoYW5nZSggdmFsdWUsICRmaWVsZCApIHtcblx0XHRjb25zdCAkbm9SZXN1bHRzICAgICA9ICRmaWVsZC5maW5kKCAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLWNob3Nlbl9ub19yZXN1bHRzX21lc3NhZ2UnICk7XG5cdFx0Y29uc3QgJGFsbEl0ZW1zTGFiZWwgPSAkZmllbGQuZmluZCggJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1hbGxfaXRlbXNfbGFiZWwnICk7XG5cdFx0Y29uc3QgZGlzcGxheVR5cGUgICAgPSAkZmllbGQuZmluZCggJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1kaXNwbGF5X3R5cGUgc2VsZWN0JyApLnZhbCgpO1xuXG5cdFx0aWYgKCAnMScgPT09IHZhbHVlICYmICggJ3NlbGVjdCcgPT09IGRpc3BsYXlUeXBlIHx8ICdtdWx0aS1zZWxlY3QnID09PSBkaXNwbGF5VHlwZSApICkge1xuXHRcdFx0JG5vUmVzdWx0cy5zaG93KCk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdCRub1Jlc3VsdHMuaGlkZSgpO1xuXHRcdH1cblxuXHRcdGlmIChcblx0XHRcdCggJzEnID09PSB2YWx1ZSAmJiAnbXVsdGktc2VsZWN0JyA9PT0gZGlzcGxheVR5cGUgKVxuXHRcdFx0fHwgKCAncmFkaW8nID09PSBkaXNwbGF5VHlwZSB8fCAnc2VsZWN0JyA9PT0gZGlzcGxheVR5cGUgKVxuXHRcdCkge1xuXHRcdFx0JGFsbEl0ZW1zTGFiZWwuc2hvdygpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHQkYWxsSXRlbXNMYWJlbC5oaWRlKCk7XG5cdFx0fVxuXHR9XG5cblx0ZnVuY3Rpb24gX3RyaWdnZXJJbnB1dFR5cGVOdW1iZXJVc2VTZWxlY3RDaGFuZ2UoIHZhbHVlLCAkZmllbGQgKSB7XG5cdFx0Y29uc3QgJG5vUmVzdWx0cyAgICAgPSAkZmllbGQuZmluZCggJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1udW1iZXJfcmFuZ2VfY2hvc2VuX25vX3Jlc3VsdHNfbWVzc2FnZScgKTtcblx0XHRjb25zdCAkYWxsSXRlbXNMYWJlbCA9ICRmaWVsZC5maW5kKCAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLW51bWJlcl9yYW5nZV9zZWxlY3RfYWxsX2l0ZW1zX2xhYmVsJyApO1xuXHRcdGNvbnN0IGRpc3BsYXlUeXBlICAgID0gJGZpZWxkLmZpbmQoICcud2NhcGYtZm9ybS1zdWItZmllbGQtbnVtYmVyX2Rpc3BsYXlfdHlwZSBzZWxlY3QnICkudmFsKCk7XG5cblx0XHRpZiAoICcxJyA9PT0gdmFsdWUgJiYgKCAncmFuZ2Vfc2VsZWN0JyA9PT0gZGlzcGxheVR5cGUgfHwgJ3JhbmdlX211bHRpc2VsZWN0JyA9PT0gZGlzcGxheVR5cGUgKSApIHtcblx0XHRcdCRub1Jlc3VsdHMuc2hvdygpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHQkbm9SZXN1bHRzLmhpZGUoKTtcblx0XHR9XG5cblx0XHRpZiAoXG5cdFx0XHQoICcxJyA9PT0gdmFsdWUgJiYgJ3JhbmdlX211bHRpc2VsZWN0JyA9PT0gZGlzcGxheVR5cGUgKVxuXHRcdFx0fHwgKCAncmFuZ2VfcmFkaW8nID09PSBkaXNwbGF5VHlwZSB8fCAncmFuZ2Vfc2VsZWN0JyA9PT0gZGlzcGxheVR5cGUgKVxuXHRcdCkge1xuXHRcdFx0JGFsbEl0ZW1zTGFiZWwuc2hvdygpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHQkYWxsSXRlbXNMYWJlbC5oaWRlKCk7XG5cdFx0fVxuXHR9XG5cblx0ZnVuY3Rpb24gX2hhbmRsZVRvZ2dsZVJlcXVlc3QoIGRhdGEsIGN1cnJlbnRTZWxlY3RvciwgdmFsdWUgKSB7XG5cdFx0Y29uc3QgJGZpZWxkICAgICAgPSBjdXJyZW50U2VsZWN0b3IuY2xvc2VzdCggJy53Y2FwZi1mb3JtLWZpZWxkJyApO1xuXHRcdGNvbnN0IGhhbmRsZXIgICAgID0gZGF0YVsgJ2hhbmRsZXInIF07XG5cdFx0Y29uc3QgaGFuZGxlclR5cGUgPSBkYXRhWyAnaGFuZGxlclR5cGUnIF07XG5cdFx0Y29uc3QgZGVwZW5kYW50ICAgPSBkYXRhWyAnZGVwZW5kYW50JyBdO1xuXG5cdFx0bGV0IF92YWx1ZSA9IHZhbHVlO1xuXG5cdFx0aWYgKCAnY2hlY2tib3gnID09PSBoYW5kbGVyVHlwZSApIHtcblx0XHRcdF92YWx1ZSA9IGN1cnJlbnRTZWxlY3Rvci5pcyggJzpjaGVja2VkJyApID8gJzEnIDogJzAnO1xuXHRcdH1cblxuXHRcdGlmICggJ3JhZGlvJyA9PT0gaGFuZGxlclR5cGUgKSB7XG5cdFx0XHRfdmFsdWUgPSAkZmllbGQuZmluZCggaGFuZGxlciArICc6Y2hlY2tlZCcgKS52YWwoKTtcblx0XHR9XG5cblx0XHQkLmVhY2goIGRlcGVuZGFudCwgZnVuY3Rpb24oIGlkLCBkICkge1xuXHRcdFx0Y29uc3QgJHNlbGVjdG9yICAgPSAkZmllbGQuZmluZCggZFsgJ3NlbGVjdG9yJyBdICk7XG5cdFx0XHRjb25zdCB2YWxpZFZhbHVlcyA9IGRbICd2YWx1ZScgXTtcblxuXHRcdFx0aWYgKCB2YWxpZFZhbHVlcy5pbmNsdWRlcyggX3ZhbHVlICkgKSB7XG5cdFx0XHRcdCRzZWxlY3Rvci5zaG93KCk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHQkc2VsZWN0b3IuaGlkZSgpO1xuXHRcdFx0fVxuXHRcdH0gKTtcblxuXHRcdGlmICggJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1kaXNwbGF5X3R5cGUgc2VsZWN0JyA9PT0gaGFuZGxlciApIHtcblx0XHRcdF90cmlnZ2VySW5wdXRUeXBlVGV4dERpc3BsYXlUeXBlQ2hhbmdlKCBfdmFsdWUsICRmaWVsZCApO1xuXHRcdH1cblxuXHRcdGlmICggJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC11c2VfY2hvc2VuIGlucHV0JyA9PT0gaGFuZGxlciApIHtcblx0XHRcdF90cmlnZ2VySW5wdXRUeXBlVGV4dFVzZVNlbGVjdENoYW5nZSggX3ZhbHVlLCAkZmllbGQgKTtcblx0XHR9XG5cblx0XHRpZiAoICcud2NhcGYtZm9ybS1zdWItZmllbGQtbnVtYmVyX2Rpc3BsYXlfdHlwZSBzZWxlY3QnID09PSBoYW5kbGVyICkge1xuXHRcdFx0X3RyaWdnZXJJbnB1dFR5cGVOdW1iZXJEaXNwbGF5VHlwZUNoYW5nZSggX3ZhbHVlLCAkZmllbGQgKTtcblx0XHR9XG5cblx0XHRpZiAoICcud2NhcGYtZm9ybS1zdWItZmllbGQtbnVtYmVyX3JhbmdlX3VzZV9jaG9zZW4gaW5wdXQnID09PSBoYW5kbGVyICkge1xuXHRcdFx0X3RyaWdnZXJJbnB1dFR5cGVOdW1iZXJVc2VTZWxlY3RDaGFuZ2UoIF92YWx1ZSwgJGZpZWxkICk7XG5cdFx0fVxuXG5cdFx0JHNlYXJjaEZvcm0udHJpZ2dlciggJ2FmdGVyX3RvZ2dsZV9yZXF1ZXN0JywgWyBoYW5kbGVyLCBfdmFsdWUsICRmaWVsZCBdICk7XG5cdH1cblxuXHRmdW5jdGlvbiBoYW5kbGVUb2dnbGVSZXF1ZXN0KCBkYXRhLCBjdXJyZW50U2VsZWN0b3IsIHZhbHVlICkge1xuXHRcdGlmICggbnVsbCA9PT0gY3VycmVudFNlbGVjdG9yICkge1xuXHRcdFx0Y29uc3QgaGFuZGxlciAgPSBkYXRhWyAnaGFuZGxlcicgXTtcblx0XHRcdGNvbnN0ICRoYW5kbGVyID0gJCggaGFuZGxlciApO1xuXG5cdFx0XHQkLmVhY2goICRoYW5kbGVyLCBmdW5jdGlvbigpIHtcblx0XHRcdFx0Y29uc3QgX3RoaXMgID0gJCggdGhpcyApO1xuXHRcdFx0XHRjb25zdCBfdmFsdWUgPSBfdGhpcy52YWwoKTtcblx0XHRcdFx0X2hhbmRsZVRvZ2dsZVJlcXVlc3QoIGRhdGEsIF90aGlzLCBfdmFsdWUgKTtcblx0XHRcdH0gKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0X2hhbmRsZVRvZ2dsZVJlcXVlc3QoIGRhdGEsIGN1cnJlbnRTZWxlY3RvciwgdmFsdWUgKTtcblx0XHR9XG5cdH1cblxuXHRmdW5jdGlvbiBzZXR1cFNlYXJjaEZvcm0oIGluaXRhbCA9IGZhbHNlICkge1xuXHRcdCQuZWFjaCggZGVwZW5kYW50RGF0YSwgZnVuY3Rpb24oIGksIGRhdGEgKSB7XG5cdFx0XHRjb25zdCBoYW5kbGVyID0gZGF0YVsgJ2hhbmRsZXInIF07XG5cdFx0XHRjb25zdCBldmVudCAgID0gZGF0YVsgJ2V2ZW50JyBdO1xuXG5cdFx0XHRoYW5kbGVUb2dnbGVSZXF1ZXN0KCBkYXRhLCBudWxsLCBudWxsICk7XG5cblx0XHRcdGlmICggaW5pdGFsICkge1xuXHRcdFx0XHQkc2VhcmNoRm9ybS5vbiggZXZlbnQsIGhhbmRsZXIsIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdGNvbnN0IF90aGlzICA9ICQoIHRoaXMgKTtcblx0XHRcdFx0XHRjb25zdCBfdmFsdWUgPSAkKCB0aGlzICkudmFsKCk7XG5cdFx0XHRcdFx0aGFuZGxlVG9nZ2xlUmVxdWVzdCggZGF0YSwgX3RoaXMsIF92YWx1ZSApO1xuXHRcdFx0XHR9ICk7XG5cdFx0XHR9XG5cdFx0fSApO1xuXHR9XG5cblx0c2V0dXBTZWFyY2hGb3JtKCB0cnVlICk7XG5cblx0JHNlYXJjaEZvcm0ub24oICdmaWVsZF9hZGRlZCcsIGZ1bmN0aW9uKCkge1xuXHRcdC8vIFRvZ2dsZSB0aGUgdmlzaWJpbGl0eSBvZiBzdWJmaWVsZHMuXG5cdFx0c2V0dXBTZWFyY2hGb3JtKCk7XG5cdH0gKTtcblxufSApO1xuIiwiLyoqXG4gKiBUaGUgc2VhcmNoIGZvcm0uXG4gKlxuICogQHNpbmNlICAgICAgMy4wLjBcbiAqIEBwYWNrYWdlICAgIHdjLWFqYXgtcHJvZHVjdC1maWx0ZXJcbiAqIEBzdWJwYWNrYWdlIHdjLWFqYXgtcHJvZHVjdC1maWx0ZXIvYWRtaW4vc3JjL2pzXG4gKiBAYXV0aG9yICAgICBNYWludWwgSGFzc2FuIE1haW5cbiAqL1xuXG5jb25zdCB0b3RhbEZpZWxkSW5zdGFuY2VzID0galF1ZXJ5KCAnI3RvdGFsX2ZpZWxkX2luc3RhbmNlcycgKTtcblxuY29uc3Qgc2VhcmNoRm9ybSA9IGpRdWVyeSggJyNzZWFyY2gtZm9ybScgKTtcblxuLyoqXG4gKiBBc3NpZ24gYSB1bmlxdWUgaWQgYnkgcmVwbGFjaW5nIHRoZSBwbGFjZWhvbGRlciBpZC5cbiAqL1xuZnVuY3Rpb24gcmVtb3ZlUGxhY2Vob2xkZXIoIHVuaXF1ZUlkLCBlbGVtZW50cywgYXR0ciApIHtcblx0ZWxlbWVudHMuZWFjaChcblx0XHRmdW5jdGlvbigpIHtcblx0XHRcdGNvbnN0IGVsZW1lbnQgPSBqUXVlcnkoIHRoaXMgKTtcblxuXHRcdFx0Y29uc3Qgb2xkVmFsdWUgPSBlbGVtZW50LmF0dHIoIGF0dHIgKTtcblx0XHRcdGNvbnN0IG5ld1ZhbHVlID0gb2xkVmFsdWUucmVwbGFjZSggJyUlJywgdW5pcXVlSWQgKTtcblxuXHRcdFx0ZWxlbWVudC5hdHRyKCBhdHRyLCBuZXdWYWx1ZSApO1xuXHRcdH1cblx0KTtcbn1cblxuLyoqXG4gKiBJbnNlcnQgdGhlIGZpZWxkJ3Mgc3ViZmllbGRzLlxuICovXG5mdW5jdGlvbiBpbnNlcnRGaWVsZFN1YkZpZWxkcyggdWkgKSB7XG5cdC8vIEluc2VydCB0aGUgZmllbGQncyBzdWJmaWVsZHMgaWYgbm90IGFscmVhZHkgaW5zZXJ0ZWQuXG5cdGlmICggISB1aS5pdGVtLmhhc0NsYXNzKCAnc3ViLWZpZWxkcy1yZWFkeScgKSApIHtcblx0XHRjb25zdCB0eXBlICAgICAgPSB1aS5pdGVtLmF0dHIoICdkYXRhLWZpZWxkLXR5cGUnICk7XG5cdFx0Y29uc3QgdW5pcXVlSWQgID0gcGFyc2VJbnQoIHRvdGFsRmllbGRJbnN0YW5jZXMudmFsKCkgKTtcblx0XHRjb25zdCBmaWVsZFR5cGUgPSAnd2NhcGYtZm9ybS1maWVsZC0nICsgdHlwZTtcblxuXHRcdC8vIEJhaWwgb3V0IGlmIG5vIHRtcGwgZm91bmQgZm9yIHRoZSB0eXBlLlxuXHRcdGlmICggISBqUXVlcnkoICcjdG1wbC0nICsgZmllbGRUeXBlICkubGVuZ3RoICkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdC8vIEluY3JlbWVudCB0aGUgdmFsdWUgb2YgdG90YWwgZmllbGQgaW5zdGFuY2VzLlxuXHRcdHRvdGFsRmllbGRJbnN0YW5jZXMudmFsKCB1bmlxdWVJZCArIDEgKTtcblxuXHRcdGNvbnN0IHRlbXBsYXRlID0gd3AudGVtcGxhdGUoIGZpZWxkVHlwZSApO1xuXHRcdGNvbnN0IHJlbmRlcmVkID0gdGVtcGxhdGUoKTtcblx0XHRjb25zdCB3cmFwcGVyICA9IHVpLml0ZW0uZmluZCggJy53aWRnZXQtY29udGVudCcgKTtcblxuXHRcdHdyYXBwZXIucHJlcGVuZCggcmVuZGVyZWQgKTtcblxuXHRcdC8vIFVwZGF0ZSB0aGUgZm9yIGF0dHJpYnV0ZXMgb2YgdGhlIGxhYmVscy5cblx0XHRyZW1vdmVQbGFjZWhvbGRlciggdW5pcXVlSWQsIHVpLml0ZW0uZmluZCggJ2xhYmVsW2Zvcl49XCJ3Y2FwZi1pbnB1dC1cIl0nICksICdmb3InICk7XG5cblx0XHQvLyBVcGRhdGUgdGhlIGlkcyBvZiB0aGUgaW5wdXQgZWxlbWVudHMuXG5cdFx0cmVtb3ZlUGxhY2Vob2xkZXIoIHVuaXF1ZUlkLCB1aS5pdGVtLmZpbmQoICcqW2lkXj1cIndjYXBmLWlucHV0LVwiXScgKSwgJ2lkJyApO1xuXG5cdFx0Ly8gVXBkYXRlIHRoZSBuYW1lcyBvZiB0aGUgaW5wdXQgZWxlbWVudHMuXG5cdFx0cmVtb3ZlUGxhY2Vob2xkZXIoIHVuaXF1ZUlkLCB1aS5pdGVtLmZpbmQoICcqW2lkXj1cIndjYXBmLWlucHV0LVwiXScgKSwgJ25hbWUnICk7XG5cblx0XHQvLyBVcGRhdGUgdGhlIHBvc2l0aW9uIHZhbHVlLlxuXHRcdHJlbW92ZVBsYWNlaG9sZGVyKCB1bmlxdWVJZCwgdWkuaXRlbS5maW5kKCAnKltpZF49XCJ3Y2FwZi1pbnB1dC1wb3NpdGlvbi1cIl0nICksICd2YWx1ZScgKTtcblxuXHRcdHVpLml0ZW0uYWRkQ2xhc3MoICdzdWItZmllbGRzLXJlYWR5JyApO1xuXG5cdFx0c2VhcmNoRm9ybS50cmlnZ2VyKCAnZmllbGRfYWRkZWQnLCBbIHVpIF0gKTtcblx0fVxufVxuXG4vKipcbiAqIFVwZGF0ZSB0aGUgZm9ybSBmaWVsZCdzIHBvc2l0aW9uIGFmdGVyIHNvcnQuXG4gKlxuICogQHNvdXJjZSBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL2EvMTQ3MzY3NzVcbiAqL1xuZnVuY3Rpb24gdXBkYXRlRmllbGRzUG9zaXRpb24oKSB7XG5cdGNvbnN0IGlucHV0cyAgPSBzZWFyY2hGb3JtLmZpbmQoICcqW2lkXj1cIndjYXBmLWlucHV0LXBvc2l0aW9uLVwiXScgKTtcblx0Y29uc3QgbmJFbGVtcyA9IGlucHV0cy5sZW5ndGg7XG5cblx0aW5wdXRzLmVhY2goXG5cdFx0ZnVuY3Rpb24oIGlkeCApIHtcblx0XHRcdGpRdWVyeSggdGhpcyApLnZhbCggbmJFbGVtcyAtICggbmJFbGVtcyAtIGlkeCApICk7XG5cdFx0fVxuXHQpO1xufVxuXG4vKipcbiAqIE1ha2UgdGhlIGZpZWxkIHJlYWR5LCByZW1vdmUgc3R5bGVzIGNvbWVzIGZyb20ganF1ZXJ5LXVpLXNvcnRhYmxlIHBsdWdpbiwgaW5zZXJ0IHRoZSBmaWVsZCdzIHN1YmZpZWxkcyBldGMuXG4gKi9cbmZ1bmN0aW9uIG1ha2VGaWVsZFJlYWR5KCBlLCB1aSApIHtcblx0Ly8gUmVtb3ZlIHN0eWxlcyBjb21lcyBmcm9tIGpxdWVyeS11aS1zb3J0YWJsZSBwbHVnaW4uXG5cdHVpLml0ZW0ucmVtb3ZlQXR0ciggJ3N0eWxlJyApO1xuXG5cdGluc2VydEZpZWxkU3ViRmllbGRzKCB1aSApO1xuXG5cdHVwZGF0ZUZpZWxkc1Bvc2l0aW9uKCk7XG5cblx0Y29uc3QgdG9nZ2xlQnRuID0gdWkuaXRlbS5maW5kKCAnLndpZGdldC1hY3Rpb24nICk7XG5cblx0Ly8gRXhwYW5kIHRoZSBmb3JtIGZpZWxkIGFmdGVyIHNvcnQuXG5cdGlmICggJ2ZhbHNlJyA9PT0gdG9nZ2xlQnRuLmF0dHIoICdhcmlhLWV4cGFuZGVkJyApICkge1xuXHRcdHRvZ2dsZUJ0bi50cmlnZ2VyKCAnY2xpY2snICk7XG5cdH1cbn1cblxuLyoqXG4gKiBJbnN0YW50aWF0ZSBzb3J0YWJsZSBmb3IgdGhlIGZvcm0gZmllbGRzLlxuICovXG5mdW5jdGlvbiBzb3J0YWJsZSggaWRlbnRpZmllciApIHtcblx0Y29uc3QgY29udGFpbmVyID0galF1ZXJ5KCBpZGVudGlmaWVyICk7XG5cblx0Y29udGFpbmVyLnNvcnRhYmxlKFxuXHRcdHtcblx0XHRcdG9wYWNpdHk6IDAuOCxcblx0XHRcdHJldmVydDogZmFsc2UsXG5cdFx0XHRjdXJzb3I6ICdtb3ZlJyxcblx0XHRcdGF4aXM6ICd5Jyxcblx0XHRcdGhhbmRsZTogJy53aWRnZXQtdG9wJyxcblx0XHRcdGNhbmNlbDogJy53aWRnZXQtdGl0bGUtYWN0aW9uJyxcblx0XHRcdGl0ZW1zOiAnLndpZGdldCcsXG5cdFx0XHRwbGFjZWhvbGRlcjogJ3dpZGdldC1wbGFjZWhvbGRlcicsXG5cdFx0XHRjb25uZWN0V2l0aDogJyNzZWFyY2gtZm9ybS13cmFwcGVyJyxcblx0XHRcdHN0b3A6IG1ha2VGaWVsZFJlYWR5LFxuXHRcdFx0c3RhcnQ6IGZ1bmN0aW9uKCBlLCB1aSApIHtcblx0XHRcdFx0Ly8gSWYgaXQgaXMgZ2V0dGluZyBhcHBlbmRlZCB0byB0aGUgd3JvbmcgcGxhY2UsIHRoZW4gZm9yY2UgaXQgaW50byB0aGUgcmlnaHQgY29udGFpbmVyLlxuXHRcdFx0XHR1aS5wbGFjZWhvbGRlci5hcHBlbmRUbyggdWkucGxhY2Vob2xkZXIucGFyZW50KCkuZmluZCggJy5pbnNpZGUgI3NlYXJjaC1mb3JtLXdyYXBwZXInICkgKTtcblx0XHRcdH1cblx0XHR9XG5cdCk7XG59XG5cbnNvcnRhYmxlKCAnI3NlYXJjaC1mb3JtJyApO1xuXG4vKipcbiAqIFJ1biBmdW5jdGlvbiB3aGVuIGRyYWcgc3RhcnRzLlxuICovXG5mdW5jdGlvbiBvbkRyYWdTdGFydCgpIHtcblx0c2VhcmNoRm9ybS5hZGRDbGFzcyggJ3VpLWRyb3AtYWN0aXZlJyApO1xufVxuXG4vKipcbiAqIFJ1biBmdW5jdGlvbiBhdCBkcmFnIHN0b3AuXG4gKi9cbmZ1bmN0aW9uIG9uRHJhZ1N0b3AoKSB7XG5cdHNlYXJjaEZvcm0ucmVtb3ZlQ2xhc3MoICd1aS1kcm9wLWFjdGl2ZScgKTtcbn1cblxuLyoqXG4gKiBJbml0aWFsaXplIGRyYWdnYWJsZSBmb3IgdGhlIGZvcm0gZmllbGRzLlxuICovXG5qUXVlcnkoICcjYXZhaWxhYmxlLWZpZWxkcyAud2lkZ2V0JyApLmRyYWdnYWJsZShcblx0e1xuXHRcdGNvbm5lY3RUb1NvcnRhYmxlOiAnI3NlYXJjaC1mb3JtJyxcblx0XHRoZWxwZXI6ICdjbG9uZScsXG5cdFx0c3RhcnQ6IG9uRHJhZ1N0YXJ0LFxuXHRcdHN0b3A6IG9uRHJhZ1N0b3AsXG5cdH1cbik7XG5cbi8qKlxuICogVG9nZ2xlIHRoZSBmb3JtIGZpZWxkLlxuICovXG5mdW5jdGlvbiB0b2dnbGVGaWVsZCggZSApIHtcblx0Y29uc3QgdGFyZ2V0ICAgICAgID0gZS50YXJnZXQ7XG5cdGNvbnN0IHdpZGdldCAgICAgICA9IGpRdWVyeSggdGhpcyApLmNsb3Nlc3QoICcud2lkZ2V0JyApO1xuXHRjb25zdCB0b2dnbGVCdG4gICAgPSB3aWRnZXQuZmluZCggJy53aWRnZXQtYWN0aW9uJyApO1xuXHRjb25zdCBpbnNpZGUgICAgICAgPSB3aWRnZXQuY2hpbGRyZW4oICcud2lkZ2V0LWluc2lkZScgKTtcblx0Y29uc3QgaXNFeHBhbmQgICAgID0gdG9nZ2xlQnRuLmF0dHIoICdhcmlhLWV4cGFuZGVkJyApO1xuXHRjb25zdCB0b2dnbGVFeHBhbmQgPSAndHJ1ZScgPT09IGlzRXhwYW5kID8gJ2ZhbHNlJyA6ICd0cnVlJztcblxuXHR0b2dnbGVCdG4uYXR0ciggJ2FyaWEtZXhwYW5kZWQnLCB0b2dnbGVFeHBhbmQgKTtcblx0alF1ZXJ5KCBpbnNpZGUgKS5zbGlkZVRvZ2dsZShcblx0XHQnZmFzdCcsXG5cdFx0ZnVuY3Rpb24oKSB7XG5cdFx0XHR3aWRnZXQudG9nZ2xlQ2xhc3MoICdvcGVuJyApO1xuXHRcdFx0c2VhcmNoRm9ybS50cmlnZ2VyKCAnd2lkZ2V0LWNsb3NlZCcsIFsgdGFyZ2V0IF0gKTtcblx0XHR9XG5cdCk7XG59XG5cbnNlYXJjaEZvcm0ub24oICdjbGljaycsICcud2lkZ2V0LXRvcCcsIHRvZ2dsZUZpZWxkICk7XG5zZWFyY2hGb3JtLm9uKCAnY2xpY2snLCAnLndpZGdldC1jb250cm9sLWNsb3NlJywgdG9nZ2xlRmllbGQgKTtcblxuLyoqXG4gKiBGb2N1cyB0aGUgZm9ybSBmaWVsZCdzIGV4cGFuZCBidXR0b24uXG4gKi9cbmZ1bmN0aW9uIGZvY3VzRmllbGQoIGUsIHRhcmdldCApIHtcblx0aWYgKCB0YXJnZXQuY2xhc3NMaXN0LmNvbnRhaW5zKCAnd2lkZ2V0LWNvbnRyb2wtY2xvc2UnICkgKSB7XG5cdFx0Y29uc3Qgd2lkZ2V0ID0galF1ZXJ5KCB0YXJnZXQgKS5jbG9zZXN0KCAnLndpZGdldCcgKTtcblx0XHRjb25zdCBhY3Rpb24gPSB3aWRnZXQuZmluZCggJy53aWRnZXQtYWN0aW9uJyApO1xuXG5cdFx0YWN0aW9uLmF0dHIoICdhcmlhLWV4cGFuZGVkJywgJ2ZhbHNlJyApLmZvY3VzKCk7XG5cdH1cbn1cblxuc2VhcmNoRm9ybS5vbiggJ3dpZGdldC1jbG9zZWQnLCBmb2N1c0ZpZWxkICk7XG5cbi8qKlxuICogUmVtb3ZlIHRoZSBmaWVsZC5cbiAqL1xuZnVuY3Rpb24gcmVtb3ZlRmllbGQoKSB7XG5cdGNvbnN0IHdpZGdldCA9IGpRdWVyeSggdGhpcyApLmNsb3Nlc3QoICcud2lkZ2V0JyApO1xuXG5cdGpRdWVyeSggd2lkZ2V0ICkuc2xpZGVVcChcblx0XHQnZmFzdCcsXG5cdFx0ZnVuY3Rpb24oKSB7XG5cdFx0XHR3aWRnZXQucmVtb3ZlKCk7XG5cdFx0XHR1cGRhdGVGaWVsZHNQb3NpdGlvbigpO1xuXHRcdH1cblx0KTtcbn1cblxuc2VhcmNoRm9ybS5vbiggJ2NsaWNrJywgJy53aWRnZXQtY29udHJvbC1yZW1vdmUnLCByZW1vdmVGaWVsZCApO1xuXG4vKipcbiAqIFN0b3JlIHRoZSBpbml0aWFsIGZvcm0gZGF0YSBpbnRvIGEgdmFyaWFibGUgc28gdGhhdCB3ZSBjYW4gY29tcGFyZSBpdCB3aGVuIGxlYXZpbmcgdGhlIHBhZ2UuXG4gKi9cbmxldCBpbml0aWFsRm9ybVN0YXRlID0gc2VhcmNoRm9ybS5zZXJpYWxpemVBcnJheSgpO1xuXG4vKipcbiAqIFNob3cgbWVzc2FnZSBhZnRlciBmb3JtIHN1Ym1pc3Npb24uXG4gKi9cbmZ1bmN0aW9uIHNob3dNZXNzYWdlKCBtZXNzYWdlLCB0eXBlID0gJ3N1Y2Nlc3MnICkge1xuXHRjb25zdCBlbGVtZW50ID0galF1ZXJ5KCAnPHAgY2xhc3M9XCInICsgdHlwZSArICdcIj4nICsgbWVzc2FnZSArICc8L3A+JyApO1xuXHRjb25zdCB3cmFwcGVyID0galF1ZXJ5KCAnLndjYXBmLW1lc3NhZ2Utd3JhcHBlcicgKTtcblxuXHRpZiAoICEgd3JhcHBlci5pcyggJzplbXB0eScgKSApIHtcblx0XHRyZXR1cm47XG5cdH1cblxuXHRqUXVlcnkoIHdyYXBwZXIgKS5odG1sKCBlbGVtZW50ICkuc2xpZGVEb3duKCAnZmFzdCcgKTtcblxuXHRzZXRUaW1lb3V0KFxuXHRcdGZ1bmN0aW9uKCkge1xuXHRcdFx0alF1ZXJ5KCB3cmFwcGVyICkuc2xpZGVVcCggJ2Zhc3QnICk7XG5cdFx0XHR3cmFwcGVyLmh0bWwoICcnICk7XG5cdFx0fSxcblx0XHQzMDAwXG5cdCk7XG59XG5cbi8qKlxuICogU2F2ZSB0aGUgc2VhcmNoIGZvcm0uXG4gKi9cbmZ1bmN0aW9uIHNhdmVGb3JtKCkge1xuXHRjb25zdCBidXR0b24gICA9IGpRdWVyeSggdGhpcyApO1xuXHRjb25zdCBmb3JtRGF0YSA9IHNlYXJjaEZvcm0uc2VyaWFsaXplQXJyYXkoKTtcblxuXHRidXR0b24uYXR0ciggJ2Rpc2FibGVkJywgJ2Rpc2FibGVkJyApO1xuXG5cdGZ1bmN0aW9uIG9rQ2FsbGJhY2soIG1lc3NhZ2UgKSB7XG5cdFx0YnV0dG9uLnJlbW92ZUF0dHIoICdkaXNhYmxlZCcgKTtcblxuXHRcdC8vIFVwZGF0ZSB0aGUgaW5pdGlhbCBmb3JtIGRhdGEgYWZ0ZXIgc3VjY2Vzc2Z1bGx5IHNhdmluZyB0aGUgZm9ybS5cblx0XHRpbml0aWFsRm9ybVN0YXRlID0gZm9ybURhdGE7XG5cblx0XHRzaG93TWVzc2FnZSggbWVzc2FnZSApO1xuXHR9XG5cblx0ZnVuY3Rpb24gZXJyQ2FsbGJhY2soIG1lc3NhZ2UgKSB7XG5cdFx0YnV0dG9uLnJlbW92ZUF0dHIoICdkaXNhYmxlZCcgKTtcblx0XHRzaG93TWVzc2FnZSggbWVzc2FnZSwgJ2Vycm9yJyApO1xuXHR9XG5cblx0Ly8gaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9hLzU5MTgxMjUyXG5cdHdwLmFqYXgucG9zdCggZm9ybURhdGEgKS5kb25lKCBva0NhbGxiYWNrICkuZmFpbCggZXJyQ2FsbGJhY2sgKTtcbn1cblxualF1ZXJ5KCAnI3Bvc3Rib3gtY29udGFpbmVyLTEnICkub24oICdjbGljaycsICdidXR0b24nLCBzYXZlRm9ybSApO1xuXG4vKipcbiAqIFNob3cgYWxlcnQgb24gbGVhdmUgaWYgdGhlIGZvcm0gaXMgZGlydHkuXG4gKlxuICogVE9ETzogVW5jb21tZW50IHRoaXMuXG4gKi9cbi8vIHdpbmRvdy5vbmJlZm9yZXVubG9hZCA9IGZ1bmN0aW9uKCkge1xuLy8gXHRjb25zdCBuZXdGb3JtU3RhdGUgPSBzZWFyY2hGb3JtLnNlcmlhbGl6ZUFycmF5KCk7XG4vL1xuLy8gXHRjb25zdCBpc0Zvcm1EaXJ0eSA9ICEgXy5pc0VxdWFsKCBuZXdGb3JtU3RhdGUsIGluaXRpYWxGb3JtU3RhdGUgKTtcbi8vXG4vLyBcdGlmICggaXNGb3JtRGlydHkgKSB7XG4vLyBcdFx0cmV0dXJuICcnO1xuLy8gXHR9XG4vLyB9O1xuIl19
