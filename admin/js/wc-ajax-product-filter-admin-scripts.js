"use strict";

/**
 * Display type fields.
 *
 * @since      3.0.0
 * @package    wc-ajax-product-filter
 * @subpackage wc-ajax-product-filter/admin/src/js
 * @author     Mainul Hassan Main
 */
jQuery(document).ready(function ($) {
  var fieldWrapper = $('#chosen_field_wrapper');
  fieldWrapper.on('after_toggle_request', function (e, handler, value, $field) {
    if ('.wcapf-form-sub-field-display_type select' === handler) {
      var $queryType = $field.find('.wcapf-form-sub-field-query_type');
      var validDisplayTypes = ['label', 'color', 'image'];

      if (validDisplayTypes.includes(value)) {
        var $multipleFilter = $field.find('.wcapf-form-sub-field-enable_multiple_filter input');

        if ($multipleFilter.is(':checked')) {
          $queryType.show();
        } else {
          $queryType.hide();
        }
      }
    }
  });
  fieldWrapper.on('after_toggle_request', function (e, handler, value, $field) {
    if ('.wcapf-form-sub-field-enable_multiple_filter input' === handler) {
      var $queryType = $field.find('.wcapf-form-sub-field-query_type');
      var $displayType = $field.find('.wcapf-form-sub-field-display_type select');
      var displayType = $displayType.val();
      var validDisplayTypes = ['label', 'color', 'image'];

      if (validDisplayTypes.includes(displayType)) {
        if ('1' === value) {
          $queryType.show();
        } else {
          $queryType.hide();
        }
      }
    }
  });
});
"use strict";

/**
 * Display type fields.
 *
 * @since      3.0.0
 * @package    wc-ajax-product-filter
 * @subpackage wc-ajax-product-filter/admin/src/js
 * @author     Mainul Hassan Main
 */
jQuery(document).ready(function ($) {
  var fieldWrapper = $('#chosen_field_wrapper'); // Hierarchical field's toggle visibility when text display type is changed.

  fieldWrapper.on('after_toggle_request', function (e, handler, value, $field) {
    if ('.wcapf-form-sub-field-display_type select' === handler) {
      var $hrFields = $field.find('.hierarchical-fields');
      var $hierarchical = $field.find('.wcapf-form-sub-field-hierarchical');
      var useHierarchical = $hierarchical.find('input').is(':checked');
      var $hrAccordion = $field.find('.wcapf-form-sub-field-enable_hierarchy_accordion');

      if ('checkbox' === value || 'radio' === value) {
        $hrFields.show();

        if (useHierarchical) {
          $hrAccordion.show();
        } else {
          $hrAccordion.hide();
        }
      } else if ('select' === value || 'multi-select' === value) {
        $hrFields.show();
        $hrAccordion.hide();
      } else {
        $hrFields.hide();
      }
    }
  }); // Hierarchical accordion field toggle visibility when show hierarchy is changed.

  fieldWrapper.on('after_toggle_request', function (e, handler, value, $field) {
    if ('.wcapf-form-sub-field-hierarchical input' === handler) {
      var displayType = $field.find('.wcapf-form-sub-field-display_type select').val();
      var $hrAccordion = $field.find('.wcapf-form-sub-field-enable_hierarchy_accordion');

      if ('1' === value) {
        if ('checkbox' === displayType || 'radio' === displayType) {
          $hrAccordion.show();
        } else {
          $hrAccordion.hide();
        }
      } else {
        $hrAccordion.hide();
      }
    }
  }); // Override no-results-message, all-items-label field's toggle visibility when text display type is changed.

  fieldWrapper.on('after_toggle_request', function (e, handler, value, $field) {
    if ('.wcapf-form-sub-field-display_type select' === handler) {
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
  }); // Override no-results-message, all-items-label field's toggle visibility when text use chosen is changed.

  fieldWrapper.on('after_toggle_request', function (e, handler, value, $field) {
    if ('.wcapf-form-sub-field-use_chosen input' === handler) {
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
  });
});
"use strict";

/**
 * Field meta box.
 *
 * @since      3.0.0
 * @package    wc-ajax-product-filter
 * @subpackage wc-ajax-product-filter/admin/src/js
 * @author     Mainul Hassan Main
 */
jQuery(document).ready(function ($) {
  var fieldWrapper = $('#chosen_field_wrapper');
  var fieldInput = '[name]:not(.manual_options)';
  var fieldStates = {};

  function storeFieldState() {
    var fieldType = fieldWrapper.find('#field_data').attr('data-field-type');

    if (!fieldType) {
      return;
    }

    var fieldValues = {};
    fieldWrapper.find(fieldInput).each(function () {
      var $input = $(this);
      var type = $input.attr('type');
      var name = $input.attr('name');
      var value = $input.val();

      if ('checkbox' === type || 'radio' === type) {
        if ($input.is(':checked')) {
          fieldValues[name] = value;
        }
      } else {
        fieldValues[name] = value;
      }
    }); // Handle manual options.

    var manualOptions = {};
    fieldWrapper.find('.manual_options').each(function () {
      var $input = $(this);
      var name = $input.attr('name');
      manualOptions[name] = $input.val();
    });
    fieldValues['manual_options'] = manualOptions;
    fieldStates[fieldType] = fieldValues;
  }

  function updateFieldState($elm) {
    var fieldType = fieldWrapper.find('#field_data').attr('data-field-type');
    var fieldState = fieldStates[fieldType];
    var name = $elm.attr('name');
    var type = $elm.attr('type');
    var value = $elm.val();

    if ($elm.hasClass('manual_options')) {
      var manual_options = fieldState['manual_options'] || {};
      manual_options[name] = value;
      fieldState['manual_options'] = manual_options;
    } else {
      if ('checkbox' === type || 'radio' === type) {
        var $input = fieldWrapper.find('[name="' + name + '"]');

        if ($input.is(':checked')) {
          fieldState[name] = value;
        } else {
          delete fieldState[name];
        }
      } else {
        fieldState[name] = value;
      }
    }
  } // Store the initial field state.


  storeFieldState();
  fieldWrapper.find('[name]').on('change', function () {
    var $this = $(this);
    updateFieldState($this);
  });

  function applyFieldState(fieldType) {
    var fieldState = fieldStates[fieldType];
    fieldWrapper.find(fieldInput).each(function () {
      var $input = $(this);
      var type = $input.attr('type');
      var name = $input.attr('name');
      var value = fieldState[name];

      if ('checkbox' === type || 'radio' === type) {
        if (name in fieldState) {
          // Add 'checked' attribute.
          fieldWrapper.find('[name="' + name + '"][value="' + value + '"]').attr('checked', 'checked');
        } else {
          // Remove 'checked' attribute.
          fieldWrapper.find('[name="' + name + '"]').removeAttr('checked');
        }
      } else {
        $input.val(value);
      }
    }); // Process the manual options.

    if ('manual_options' in fieldState) {
      var rawOptions = fieldState['manual_options'];
      $.each(rawOptions, function (inputName, raw) {
        var $rawInput = fieldWrapper.find('[name="' + inputName + '"]');
        $rawInput.val(raw);
        var manualOptions = JSON.parse(decodeURIComponent(raw));

        if (!manualOptions.length) {
          return;
        }

        var tableIdentifier = $rawInput.attr('data-table');
        var rowTemplateId = $rawInput.attr('data-tmpl'); // Bail out if no tmpl found for the type.

        if (!jQuery('#tmpl-' + rowTemplateId).length) {
          return;
        }

        var rowsIdentifier = '.field-table-body-rows';
        var rowIdentifier = '.row-item';
        var $table = fieldWrapper.find(tableIdentifier);
        var $rows = $table.find(rowsIdentifier);
        $.each(manualOptions, function (i, option) {
          var template = wp.template(rowTemplateId);
          var rowDefaultOptions = {};

          if ('.manual-options-table' === tableIdentifier) {
            rowDefaultOptions = {
              'value': '',
              'label': ''
            };
          }

          var rendered = template(rowDefaultOptions);
          $rows.append(rendered);
          var $lastRow = $rows.find(rowIdentifier).last();
          $lastRow.find('[data-name]').each(function () {
            var $this = $(this);
            var name = $this.attr('data-name');
            var value = option[name];
            $this.val(value);

            if ('image_url' === name && value) {
              $lastRow.find('.wp-image-picker-container').addClass('active');
              $lastRow.find('img').attr('src', value);
            }
          });
        });
        $table.addClass('has-options');
      });
      var $field = fieldWrapper.find('.wcapf-form-field');
      fieldWrapper.trigger('new_option_added', [$field]);
    }
  }

  $('#available_fields').on('change', '[name="_active_field"]', function () {
    var $this = $(this);

    var _fieldType = $this.val();

    var fieldName = $this.attr('data-field-name');

    if (!_fieldType) {
      return;
    }

    var fieldType = 'wcapf-form-field-' + _fieldType; // Bail out if no tmpl found for the type.

    if (!jQuery('#tmpl-' + fieldType).length) {
      return;
    }

    var template = wp.template(fieldType);
    var rendered = template();
    var fieldDataWrapper = fieldWrapper.find('#field_data');
    var fieldNameWrapper = fieldWrapper.find('.postbox-header h2');
    var fieldInside = fieldWrapper.find('.inside');
    fieldWrapper.removeClass('hidden');
    fieldDataWrapper.attr('data-field-type', _fieldType);
    fieldNameWrapper.html(fieldName);
    fieldInside.html(rendered); // If already found the field state then apply it, otherwise store it.

    if (_fieldType in fieldStates) {
      applyFieldState(_fieldType);
    } else {
      storeFieldState();
    }

    fieldWrapper.trigger('field_added');
    fieldWrapper.find('[name]').on('change', function () {
      var $this = $(this);
      updateFieldState($this);
    });
  });
});
"use strict";

/**
 * Manual Options' table function.
 *
 * @since      3.0.0
 * @package    wc-ajax-product-filter
 * @subpackage wc-ajax-product-filter/admin/src/js
 * @author     Mainul Hassan Main
 */

/**
 * @param tableIdentifier
 * @param valueIdentifier
 * @param rowTemplateId
 * @param rowDefaultOptions
 */
function initManualOptionsTable(tableIdentifier, valueIdentifier, rowTemplateId) {
  var rowDefaultOptions = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
  var $ = jQuery;
  var fieldWrapper = $('#chosen_field_wrapper');
  var fieldIdentifier = '.wcapf-form-field';
  var rowsIdentifier = '.field-table-body-rows';
  var rowIdentifier = '.row-item';

  function initSortableTable($selector) {
    $selector.sortable({
      opacity: 0.8,
      revert: false,
      cursor: 'move',
      axis: 'y',
      handle: '.move-options-handler',
      placeholder: 'widget-placeholder',
      update: function update(e) {
        var $field = $(e.target).closest('.wcapf-form-field');
        triggerOptionsChange($field);
      }
    }).disableSelection();
  }

  var tableRowsIdentifier = tableIdentifier + ' ' + rowsIdentifier; // Init the sortable table after page loads.

  initSortableTable(fieldWrapper.find(tableRowsIdentifier)); // Init the sortable table after the field is added.

  fieldWrapper.on('field_added', function () {
    initSortableTable($(fieldWrapper.find(tableRowsIdentifier)));
  });

  function triggerOptionsChange($field) {
    var $valueHolder = $field.find(valueIdentifier);
    var $rows = $field.find(tableRowsIdentifier);
    var _rows = [];
    $rows.find('.row-item').each(function (i, _item) {
      var $item = $(_item);
      var obj = {};
      $item.find('[data-name]').each(function (fieldIndex, field) {
        var $field = $(field);
        var name = $field.attr('data-name');
        obj[name] = $field.val();
      });

      _rows.push(obj);
    });
    var rawValues = encodeURIComponent(JSON.stringify(_rows));
    $valueHolder.val(rawValues).trigger('change');
  }

  function triggerRemoveOption($field) {
    var $optionsTable = $field.find(tableIdentifier);
    var tableRows = $field.find(tableRowsIdentifier).children();

    if (2 > tableRows.length) {
      $optionsTable.removeClass('has-options');
    }
  } // Remove Option


  var removeBtnIdentifier = tableIdentifier + ' .remove-option';
  fieldWrapper.on('click', removeBtnIdentifier, function () {
    var $item = $(this).closest(rowIdentifier);
    var $field = $item.closest(fieldIdentifier);
    triggerRemoveOption($field);
    $item.remove();
    triggerOptionsChange($field);
  }); // Clear All Options

  var clearOptionsBtnIdentifier = tableIdentifier + ' .clear-options';
  fieldWrapper.on('click', clearOptionsBtnIdentifier, function () {
    var $field = $(this).closest(fieldIdentifier);
    $field.find(tableRowsIdentifier).empty();
    triggerRemoveOption($field);
    triggerOptionsChange($field);
  }); // Add New Option

  var addOptionBtnIdentifier = tableIdentifier + ' .add-option';
  fieldWrapper.on('click', addOptionBtnIdentifier, function () {
    // Bail out if no tmpl found for the type.
    if (!jQuery('#tmpl-' + rowTemplateId).length) {
      return;
    }

    var $field = $(this).closest(fieldIdentifier);
    var template = wp.template(rowTemplateId);
    var rendered = template(rowDefaultOptions);
    var $table = $field.find(tableIdentifier);
    var $rows = $field.find(tableRowsIdentifier);
    $rows.append(rendered);
    triggerOptionsChange($field);
    fieldWrapper.trigger('new_option_added', [$field]);

    if (!$table.hasClass('has-options')) {
      $table.addClass('has-options');
    }
  }); // Trigger options change when the text fields get changed.

  var textFieldsIdentifier = tableRowsIdentifier + ' input[type="text"]';
  fieldWrapper.on('input', textFieldsIdentifier, function () {
    var $field = $(this).closest(fieldIdentifier);
    triggerOptionsChange($field);
  }); // Trigger options change when the select fields get changed.

  var selectFieldsIdentifier = tableRowsIdentifier + ' select';
  fieldWrapper.on('change', selectFieldsIdentifier, function () {
    var $field = $(this).closest(fieldIdentifier);
    triggerOptionsChange($field);
  }); // Trigger options change when value is added from modal.

  fieldWrapper.on('trigger_options_table', function (e, tableId, $field) {
    if (tableId === tableIdentifier) {
      triggerOptionsChange($field);
    }
  });
}
"use strict";

/**
 * The number ui options.
 *
 * @since      3.0.0
 * @package    wc-ajax-product-filter
 * @subpackage wc-ajax-product-filter/admin/src/js
 * @author     Mainul Hassan Main
 */
jQuery(document).ready(function ($) {
  var fieldWrapper = $('#chosen_field_wrapper');
  /**
   * Toggle disabled attribute of min-value field for number type.
   */

  function toggleNumberMinValueField($elm) {
    var $field = $elm.closest('.wcapf-form-field');
    var $textField = $field.find('.wcapf-form-sub-field-min_value input[type="text"]');

    if ($elm.is(':checked')) {
      $textField.attr('disabled', 'disabled');
    } else {
      $textField.removeAttr('disabled');
    }
  }

  fieldWrapper.on('field_added', function () {
    fieldWrapper.find('.wcapf-form-sub-field-min_value_auto_detect input[type="checkbox"]').each(function () {
      var $this = $(this);
      toggleNumberMinValueField($this);
    });
  });
  fieldWrapper.on('click', '.wcapf-form-sub-field-min_value_auto_detect input[type="checkbox"]', function () {
    var $this = $(this);
    toggleNumberMinValueField($this);
  });
  /**
   * Toggle disabled attribute of max-value field for number type.
   */

  function toggleNumberMaxValueField($elm) {
    var $field = $elm.closest('.wcapf-form-field');
    var $textField = $field.find('.wcapf-form-sub-field-max_value input[type="text"]');

    if ($elm.is(':checked')) {
      $textField.attr('disabled', 'disabled');
    } else {
      $textField.removeAttr('disabled');
    }
  }

  fieldWrapper.on('field_added', function () {
    fieldWrapper.find('.wcapf-form-sub-field-max_value_auto_detect input[type="checkbox"]').each(function () {
      var $this = $(this);
      toggleNumberMaxValueField($this);
    });
  });
  fieldWrapper.on('click', '.wcapf-form-sub-field-max_value_auto_detect input[type="checkbox"]', function () {
    var $this = $(this);
    toggleNumberMaxValueField($this);
  });
});
"use strict";

/**
 * The product status field.
 *
 * @since      3.0.0
 * @package    wc-ajax-product-filter
 * @subpackage wc-ajax-product-filter/admin/src/js
 * @author     Mainul Hassan Main
 */
jQuery(document).ready(function () {
  var tableIdentifier = '.product-status-options-table';
  var valueIdentifier = '.wcapf-form-sub-field-product_status_options input';
  var rowTemplateId = 'wcapf-product-status-option';
  initManualOptionsTable(tableIdentifier, valueIdentifier, rowTemplateId);
});
"use strict";

/**
 * The toggle visibility scripts.
 *
 * NOTE: These scripts must be located at the very bottom of the combined scripts.
 *
 * @since      3.0.0
 * @package    wc-ajax-product-filter
 * @subpackage wc-ajax-product-filter/admin/src/js
 * @author     Mainul Hassan Main
 */
jQuery(document).ready(function ($) {
  var fieldWrapper = $('#chosen_field_wrapper');
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
    }, {
      'selector': '.value-decimal-fields',
      'value': ['number']
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
    }, {
      'selector': '.wcapf-form-sub-field-use_category_images',
      'value': ['image']
    }, {
      'selector': '.wcapf-form-sub-field-enable_multiple_filter',
      'value': ['label', 'color', 'image']
    }, {
      'selector': '.column-group-custom_appearance',
      'value': ['color', 'image']
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
    'handler': '.wcapf-form-sub-field-hierarchical input',
    'handlerType': 'checkbox',
    'event': 'change'
  }, {
    'handler': '.wcapf-form-sub-field-value_decimal input',
    'handlerType': 'checkbox',
    'event': 'change',
    'dependant': [{
      'selector': '.wcapf-form-sub-field-value_decimal_places',
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
      'selector': '.wcapf-form-sub-field-align_values_at_the_end',
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
      'selector': '.wcapf-form-sub-field-number_range_enable_multiple_filter',
      'value': ['range_label']
    }, {
      'selector': '.wcapf-form-sub-field-number_range_show_count',
      'value': ['range_checkbox', 'range_radio', 'range_select', 'range_multiselect', 'range_label']
    }, {
      'selector': '.wcapf-form-sub-field-number_range_hide_empty',
      'value': ['range_checkbox', 'range_radio', 'range_select', 'range_multiselect', 'range_label']
    }, {
      'selector': '.number-decimal-fields',
      'value': ['range_slider', 'range_checkbox', 'range_radio', 'range_select', 'range_multiselect', 'range_label']
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
    'handler': '.wcapf-form-sub-field-date_display_type select',
    'handlerType': 'select',
    'event': 'change',
    'dependant': [{
      'selector': '.date-to-ui-options',
      'value': ['input_date_range']
    }, {
      'selector': '.wcapf-form-sub-field-date_format',
      'value': ['input_date', 'input_date_range']
    }, {
      'selector': '.wcapf-form-sub-field-show_date_inputs_inline',
      'value': ['input_date_range']
    }, {
      'selector': '.date-picker-fields',
      'value': ['input_date', 'input_date_range']
    }, {
      'selector': '.wcapf-form-sub-field-time_period_query_type',
      'value': ['time_period_checkbox', 'time_period_multiselect']
    }, {
      'selector': '.wcapf-form-sub-field-time_period_select_all_items_label',
      'value': ['time_period_radio', 'time_period_select']
    }, {
      'selector': '.wcapf-form-sub-field-time_period_use_chosen',
      'value': ['time_period_select', 'time_period_multiselect']
    }, {
      'selector': '.wcapf-form-sub-field-time_period_enable_multiple_filter',
      'value': ['time_period_label']
    }, {
      'selector': '.wcapf-form-sub-field-time_period_show_count',
      'value': ['time_period_checkbox', 'time_period_radio', 'time_period_select', 'time_period_multiselect', 'time_period_label']
    }, {
      'selector': '.wcapf-form-sub-field-time_period_hide_empty',
      'value': ['time_period_checkbox', 'time_period_radio', 'time_period_select', 'time_period_multiselect', 'time_period_label']
    }]
  }, {
    'handler': '.wcapf-form-sub-field-time_period_use_chosen input',
    'handlerType': 'checkbox',
    'event': 'change',
    'dependant': [{
      'selector': '.wcapf-form-sub-field-time_period_chosen_no_results_message',
      'value': ['1']
    }]
  }, {
    'handler': '.wcapf-form-sub-field-enable_soft_limit input',
    'handlerType': 'radio',
    'event': 'change',
    'dependant': [{
      'selector': '.wcapf-form-sub-field-soft_limit',
      'value': ['enable']
    }]
  }, {
    'handler': '.wcapf-form-sub-field-taxonomy select',
    'handlerType': 'select',
    'event': 'change'
  }, {
    'handler': '.wcapf-form-sub-field-custom-taxonomy select',
    'handlerType': 'select',
    'event': 'change'
  }, {
    'handler': '.wcapf-form-sub-field-meta_key select',
    'handlerType': 'select',
    'event': 'change'
  }, {
    'handler': '.wcapf-form-sub-field-post_property select',
    'handlerType': 'select',
    'event': 'change'
  }, {
    'handler': '.wcapf-form-sub-field-limit_options select',
    'handlerType': 'select',
    'event': 'change',
    'dependant': [{
      'selector': '.wcapf-form-sub-field-parent_term',
      'value': ['child']
    }, {
      'selector': '.wcapf-form-sub-field-limit_values_by_id',
      'value': ['include']
    }, {
      'selector': '.wcapf-form-sub-field-exclude_values_id',
      'value': ['exclude']
    }]
  }, {
    'handler': '.wcapf-form-sub-field-enable_accordion input',
    'handlerType': 'checkbox',
    'event': 'change',
    'dependant': [{
      'selector': '.wcapf-form-sub-field-accordion_default_state',
      'value': ['1']
    }, {
      'selector': '.wcapf-form-sub-field-move_clear_filters_button_in_accordion_heading',
      'value': ['1']
    }]
  }, {
    'handler': '.wcapf-form-sub-field-enable_multiple_filter input',
    'handlerType': 'checkbox',
    'event': 'change'
  }, {
    'handler': '.wcapf-form-sub-field-use_category_images input',
    'handlerType': 'checkbox',
    'event': 'change'
  }, {
    'handler': '.wcapf-form-sub-field-number_range_enable_multiple_filter input',
    'handlerType': 'checkbox',
    'event': 'change'
  }, {
    'handler': '.wcapf-form-sub-field-time_period_enable_multiple_filter input',
    'handlerType': 'checkbox',
    'event': 'change'
  }, {
    'handler': '.wcapf-form-sub-field-show_if_empty input',
    'handlerType': 'checkbox',
    'event': 'change',
    'dependant': [{
      'selector': '.wcapf-form-sub-field-empty_filter_message',
      'value': ['1']
    }]
  }, {
    'handler': '.wcapf-form-sub-field-show_title input',
    'handlerType': 'checkbox',
    'event': 'change'
  }, {
    'handler': '.wcapf-form-sub-field-order_terms_by select',
    'handlerType': 'select',
    'event': 'change'
  }, {
    'handler': '.wcapf-form-sub-field-enable_active_filters_soft_limit input',
    'handlerType': 'radio',
    'event': 'change',
    'dependant': [{
      'selector': '.active-filters-soft-limit-fields',
      'value': ['enable']
    }]
  }, {
    'handler': '.wcapf-form-sub-field-active_filters_layout input',
    'handlerType': 'radio',
    'event': 'change',
    'dependant': [{
      'selector': '.wcapf-form-sub-field-soft_limit',
      'value': ['simple']
    }, {
      'selector': '.wcapf-form-sub-field-soft_limit_filter_groups',
      'value': ['extended']
    }]
  }];

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
    fieldWrapper.trigger('after_toggle_request', [handler, _value, $field]);
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

  function setupField() {
    var inital = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
    $.each(dependantData, function (i, data) {
      var handler = data['handler'];
      var event = data['event'];
      handleToggleRequest(data, null, null);

      if (inital) {
        fieldWrapper.on(event, handler, function () {
          var _this = $(this);

          var _value = $(this).val();

          handleToggleRequest(data, _this, _value);
        });

        if (!$(fieldWrapper).hasClass('loaded')) {
          $(fieldWrapper).addClass('loaded');
          fieldWrapper.trigger('field_added');
        }
      }
    });
  }

  setupField(true);
  fieldWrapper.on('field_added', function () {
    // Toggle the visibility of subfields.
    setupField();
  });
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImN1c3RvbS1hcHBlYXJhbmNlLWZpZWxkcy5qcyIsImRpc3BsYXktdHlwZS1maWVsZHMuanMiLCJmaWVsZC1tZXRhLWJveC5qcyIsIm1hbnVhbC1vcHRpb25zLXRhYmxlLmpzIiwibnVtYmVyLXVpLW9wdGlvbnMuanMiLCJwcm9kdWN0LXN0YXR1cy10YWJsZS5qcyIsInRvZ2dsZVZpc2liaWxpdHkuanMiXSwibmFtZXMiOlsialF1ZXJ5IiwiZG9jdW1lbnQiLCJyZWFkeSIsIiQiLCJmaWVsZFdyYXBwZXIiLCJvbiIsImUiLCJoYW5kbGVyIiwidmFsdWUiLCIkZmllbGQiLCIkcXVlcnlUeXBlIiwiZmluZCIsInZhbGlkRGlzcGxheVR5cGVzIiwiaW5jbHVkZXMiLCIkbXVsdGlwbGVGaWx0ZXIiLCJpcyIsInNob3ciLCJoaWRlIiwiJGRpc3BsYXlUeXBlIiwiZGlzcGxheVR5cGUiLCJ2YWwiLCIkaHJGaWVsZHMiLCIkaGllcmFyY2hpY2FsIiwidXNlSGllcmFyY2hpY2FsIiwiJGhyQWNjb3JkaW9uIiwiJG5vUmVzdWx0cyIsIiRhbGxJdGVtc0xhYmVsIiwidXNlQ2hvc2VuIiwiZmllbGRJbnB1dCIsImZpZWxkU3RhdGVzIiwic3RvcmVGaWVsZFN0YXRlIiwiZmllbGRUeXBlIiwiYXR0ciIsImZpZWxkVmFsdWVzIiwiZWFjaCIsIiRpbnB1dCIsInR5cGUiLCJuYW1lIiwibWFudWFsT3B0aW9ucyIsInVwZGF0ZUZpZWxkU3RhdGUiLCIkZWxtIiwiZmllbGRTdGF0ZSIsImhhc0NsYXNzIiwibWFudWFsX29wdGlvbnMiLCIkdGhpcyIsImFwcGx5RmllbGRTdGF0ZSIsInJlbW92ZUF0dHIiLCJyYXdPcHRpb25zIiwiaW5wdXROYW1lIiwicmF3IiwiJHJhd0lucHV0IiwiSlNPTiIsInBhcnNlIiwiZGVjb2RlVVJJQ29tcG9uZW50IiwibGVuZ3RoIiwidGFibGVJZGVudGlmaWVyIiwicm93VGVtcGxhdGVJZCIsInJvd3NJZGVudGlmaWVyIiwicm93SWRlbnRpZmllciIsIiR0YWJsZSIsIiRyb3dzIiwiaSIsIm9wdGlvbiIsInRlbXBsYXRlIiwid3AiLCJyb3dEZWZhdWx0T3B0aW9ucyIsInJlbmRlcmVkIiwiYXBwZW5kIiwiJGxhc3RSb3ciLCJsYXN0IiwiYWRkQ2xhc3MiLCJ0cmlnZ2VyIiwiX2ZpZWxkVHlwZSIsImZpZWxkTmFtZSIsImZpZWxkRGF0YVdyYXBwZXIiLCJmaWVsZE5hbWVXcmFwcGVyIiwiZmllbGRJbnNpZGUiLCJyZW1vdmVDbGFzcyIsImh0bWwiLCJpbml0TWFudWFsT3B0aW9uc1RhYmxlIiwidmFsdWVJZGVudGlmaWVyIiwiZmllbGRJZGVudGlmaWVyIiwiaW5pdFNvcnRhYmxlVGFibGUiLCIkc2VsZWN0b3IiLCJzb3J0YWJsZSIsIm9wYWNpdHkiLCJyZXZlcnQiLCJjdXJzb3IiLCJheGlzIiwiaGFuZGxlIiwicGxhY2Vob2xkZXIiLCJ1cGRhdGUiLCJ0YXJnZXQiLCJjbG9zZXN0IiwidHJpZ2dlck9wdGlvbnNDaGFuZ2UiLCJkaXNhYmxlU2VsZWN0aW9uIiwidGFibGVSb3dzSWRlbnRpZmllciIsIiR2YWx1ZUhvbGRlciIsIl9yb3dzIiwiX2l0ZW0iLCIkaXRlbSIsIm9iaiIsImZpZWxkSW5kZXgiLCJmaWVsZCIsInB1c2giLCJyYXdWYWx1ZXMiLCJlbmNvZGVVUklDb21wb25lbnQiLCJzdHJpbmdpZnkiLCJ0cmlnZ2VyUmVtb3ZlT3B0aW9uIiwiJG9wdGlvbnNUYWJsZSIsInRhYmxlUm93cyIsImNoaWxkcmVuIiwicmVtb3ZlQnRuSWRlbnRpZmllciIsInJlbW92ZSIsImNsZWFyT3B0aW9uc0J0bklkZW50aWZpZXIiLCJlbXB0eSIsImFkZE9wdGlvbkJ0bklkZW50aWZpZXIiLCJ0ZXh0RmllbGRzSWRlbnRpZmllciIsInNlbGVjdEZpZWxkc0lkZW50aWZpZXIiLCJ0YWJsZUlkIiwidG9nZ2xlTnVtYmVyTWluVmFsdWVGaWVsZCIsIiR0ZXh0RmllbGQiLCJ0b2dnbGVOdW1iZXJNYXhWYWx1ZUZpZWxkIiwiZGVwZW5kYW50RGF0YSIsIl9oYW5kbGVUb2dnbGVSZXF1ZXN0IiwiZGF0YSIsImN1cnJlbnRTZWxlY3RvciIsImhhbmRsZXJUeXBlIiwiZGVwZW5kYW50IiwiX3ZhbHVlIiwiaWQiLCJkIiwidmFsaWRWYWx1ZXMiLCJoYW5kbGVUb2dnbGVSZXF1ZXN0IiwiJGhhbmRsZXIiLCJfdGhpcyIsInNldHVwRmllbGQiLCJpbml0YWwiLCJldmVudCJdLCJtYXBwaW5ncyI6Ijs7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUFBLE1BQU0sQ0FBRUMsUUFBRixDQUFOLENBQW1CQyxLQUFuQixDQUEwQixVQUFVQyxDQUFWLEVBQWM7QUFFdkMsTUFBTUMsWUFBWSxHQUFHRCxDQUFDLENBQUUsdUJBQUYsQ0FBdEI7QUFFQUMsRUFBQUEsWUFBWSxDQUFDQyxFQUFiLENBQWlCLHNCQUFqQixFQUF5QyxVQUFVQyxDQUFWLEVBQWFDLE9BQWIsRUFBc0JDLEtBQXRCLEVBQTZCQyxNQUE3QixFQUFzQztBQUM5RSxRQUFLLGdEQUFnREYsT0FBckQsRUFBK0Q7QUFDOUQsVUFBTUcsVUFBVSxHQUFVRCxNQUFNLENBQUNFLElBQVAsQ0FBYSxrQ0FBYixDQUExQjtBQUNBLFVBQU1DLGlCQUFpQixHQUFHLENBQUUsT0FBRixFQUFXLE9BQVgsRUFBb0IsT0FBcEIsQ0FBMUI7O0FBRUEsVUFBS0EsaUJBQWlCLENBQUNDLFFBQWxCLENBQTRCTCxLQUE1QixDQUFMLEVBQTJDO0FBQzFDLFlBQU1NLGVBQWUsR0FBR0wsTUFBTSxDQUFDRSxJQUFQLENBQWEsb0RBQWIsQ0FBeEI7O0FBRUEsWUFBS0csZUFBZSxDQUFDQyxFQUFoQixDQUFvQixVQUFwQixDQUFMLEVBQXdDO0FBQ3ZDTCxVQUFBQSxVQUFVLENBQUNNLElBQVg7QUFDQSxTQUZELE1BRU87QUFDTk4sVUFBQUEsVUFBVSxDQUFDTyxJQUFYO0FBQ0E7QUFDRDtBQUNEO0FBQ0QsR0FmRDtBQWlCQWIsRUFBQUEsWUFBWSxDQUFDQyxFQUFiLENBQWlCLHNCQUFqQixFQUF5QyxVQUFVQyxDQUFWLEVB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Q0FBUCxFQUFnRDtBQUMvQ3ZDLFVBQUFBLENBQUMsQ0FBRUMsWUFBRixDQUFELENBQWtCa0UsUUFBbEIsQ0FBNEIsUUFBNUI7QUFFQWxFLFVBQUFBLFlBQVksQ0FBQ21FLE9BQWIsQ0FBc0IsYUFBdEI7QUFDQTtBQUNEO0FBQ0QsS0FuQkQ7QUFvQkE7O0FBRURpRSxFQUFBQSxVQUFVLENBQUUsSUFBRixDQUFWO0FBRUFwSSxFQUFBQSxZQUFZLENBQUNDLEVBQWIsQ0FBaUIsYUFBakIsRUFBZ0MsWUFBVztBQUMxQztBQUNBbUksSUFBQUEsVUFBVTtBQUNWLEdBSEQ7QUFLQSxDQWpiRCIsImZpbGUiOiJ3Yy1hamF4LXByb2R1Y3QtZmlsdGVyLWFkbWluLXNjcmlwdHMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIERpc3BsYXkgdHlwZSBmaWVsZHMuXG4gKlxuICogQHNpbmNlICAgICAgMy4wLjBcbiAqIEBwYWNrYWdlICAgIHdjLWFqYXgtcHJvZHVjdC1maWx0ZXJcbiAqIEBzdWJwYWNrYWdlIHdjLWFqYXgtcHJvZHVjdC1maWx0ZXIvYWRtaW4vc3JjL2pzXG4gKiBAYXV0aG9yICAgICBNYWludWwgSGFzc2FuIE1haW5cbiAqL1xuXG5qUXVlcnkoIGRvY3VtZW50ICkucmVhZHkoIGZ1bmN0aW9uKCAkICkge1xuXG5cdGNvbnN0IGZpZWxkV3JhcHBlciA9ICQoICcjY2hvc2VuX2ZpZWxkX3dyYXBwZXInICk7XG5cblx0ZmllbGRXcmFwcGVyLm9uKCAnYWZ0ZXJfdG9nZ2xlX3JlcXVlc3QnLCBmdW5jdGlvbiggZSwgaGFuZGxlciwgdmFsdWUsICRmaWVsZCApIHtcblx0XHRpZiAoICcud2NhcGYtZm9ybS1zdWItZmllbGQtZGlzcGxheV90eXBlIHNlbGVjdCcgPT09IGhhbmRsZXIgKSB7XG5cdFx0XHRjb25zdCAkcXVlcnlUeXBlICAgICAgICA9ICRmaWVsZC5maW5kKCAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLXF1ZXJ5X3R5cGUnICk7XG5cdFx0XHRjb25zdCB2YWxpZERpc3BsYXlUeXBlcyA9IFsgJ2xhYmVsJywgJ2NvbG9yJywgJ2ltYWdlJyBdO1xuXG5cdFx0XHRpZiAoIHZhbGlkRGlzcGxheVR5cGVzLmluY2x1ZGVzKCB2YWx1ZSApICkge1xuXHRcdFx0XHRjb25zdCAkbXVsdGlwbGVGaWx0ZXIgPSAkZmllbGQuZmluZCggJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1lbmFibGVfbXVsdGlwbGVfZmlsdGVyIGlucHV0JyApO1xuXG5cdFx0XHRcdGlmICggJG11bHRpcGxlRmlsdGVyLmlzKCAnOmNoZWNrZWQnICkgKSB7XG5cdFx0XHRcdFx0JHF1ZXJ5VHlwZS5zaG93KCk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0JHF1ZXJ5VHlwZS5oaWRlKCk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cdH0gKTtcblxuXHRmaWVsZFdyYXBwZXIub24oICdhZnRlcl90b2dnbGVfcmVxdWVzdCcsIGZ1bmN0aW9uKCBlLCBoYW5kbGVyLCB2YWx1ZSwgJGZpZWxkICkge1xuXHRcdGlmICggJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1lbmFibGVfbXVsdGlwbGVfZmlsdGVyIGlucHV0JyA9PT0gaGFuZGxlciApIHtcblx0XHRcdGNvbnN0ICRxdWVyeVR5cGUgICAgICAgID0gJGZpZWxkLmZpbmQoICcud2NhcGYtZm9ybS1zdWItZmllbGQtcXVlcnlfdHlwZScgKTtcblx0XHRcdGNvbnN0ICRkaXNwbGF5VHlwZSAgICAgID0gJGZpZWxkLmZpbmQoICcud2NhcGYtZm9ybS1zdWItZmllbGQtZGlzcGxheV90eXBlIHNlbGVjdCcgKTtcblx0XHRcdGNvbnN0IGRpc3BsYXlUeXBlICAgICAgID0gJGRpc3BsYXlUeXBlLnZhbCgpO1xuXHRcdFx0Y29uc3QgdmFsaWREaXNwbGF5VHlwZXMgPSBbICdsYWJlbCcsICdjb2xvcicsICdpbWFnZScgXTtcblxuXHRcdFx0aWYgKCB2YWxpZERpc3BsYXlUeXBlcy5pbmNsdWRlcyggZGlzcGxheVR5cGUgKSApIHtcblx0XHRcdFx0aWYgKCAnMScgPT09IHZhbHVlICkge1xuXHRcdFx0XHRcdCRxdWVyeVR5cGUuc2hvdygpO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdCRxdWVyeVR5cGUuaGlkZSgpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXHR9ICk7XG5cbn0gKTtcbiIsIi8qKlxuICogRGlzcGxheSB0eXBlIGZpZWxkcy5cbiAqXG4gKiBAc2luY2UgICAgICAzLjAuMFxuICogQHBhY2thZ2UgICAgd2MtYWpheC1wcm9kdWN0LWZpbHRlclxuICogQHN1YnBhY2thZ2Ugd2MtYWpheC1wcm9kdWN0LWZpbHRlci9hZG1pbi9zcmMvanNcbiAqIEBhdXRob3IgICAgIE1haW51bCBIYXNzYW4gTWFpblxuICovXG5cbmpRdWVyeSggZG9jdW1lbnQgKS5yZWFkeSggZnVuY3Rpb24oICQgKSB7XG5cblx0Y29uc3QgZmllbGRXcmFwcGVyID0gJCggJyNjaG9zZW5fZmllbGRfd3JhcHBlcicgKTtcblxuXHQvLyBIaWVyYXJjaGljYWwgZmllbGQncyB0b2dnbGUgdmlzaWJpbGl0eSB3aGVuIHRleHQgZGlzcGxheSB0eXBlIGlzIGNoYW5nZWQuXG5cdGZpZWxkV3JhcHBlci5vbiggJ2FmdGVyX3RvZ2dsZV9yZXF1ZXN0JywgZnVuY3Rpb24oIGUsIGhhbmRsZXIsIHZhbHVlLCAkZmllbGQgKSB7XG5cdFx0aWYgKCAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLWRpc3BsYXlfdHlwZSBzZWxlY3QnID09PSBoYW5kbGVyICkge1xuXHRcdFx0Y29uc3QgJGhyRmllbGRzICAgICAgID0gJGZpZWxkLmZpbmQoICcuaGllcmFyY2hpY2FsLWZpZWxkcycgKTtcblx0XHRcdGNvbnN0ICRoaWVyYXJjaGljYWwgICA9ICRmaWVsZC5maW5kKCAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLWhpZXJhcmNoaWNhbCcgKTtcblx0XHRcdGNvbnN0IHVzZUhpZXJhcmNoaWNhbCA9ICRoaWVyYXJjaGljYWwuZmluZCggJ2lucHV0JyApLmlzKCAnOmNoZWNrZWQnICk7XG5cdFx0XHRjb25zdCAkaHJBY2NvcmRpb24gICAgPSAkZmllbGQuZmluZCggJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1lbmFibGVfaGllcmFyY2h5X2FjY29yZGlvbicgKTtcblxuXHRcdFx0aWYgKCAnY2hlY2tib3gnID09PSB2YWx1ZSB8fCAncmFkaW8nID09PSB2YWx1ZSApIHtcblx0XHRcdFx0JGhyRmllbGRzLnNob3coKTtcblxuXHRcdFx0XHRpZiAoIHVzZUhpZXJhcmNoaWNhbCApIHtcblx0XHRcdFx0XHQkaHJBY2NvcmRpb24uc2hvdygpO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdCRockFjY29yZGlvbi5oaWRlKCk7XG5cdFx0XHRcdH1cblx0XHRcdH0gZWxzZSBpZiAoICdzZWxlY3QnID09PSB2YWx1ZSB8fCAnbXVsdGktc2VsZWN0JyA9PT0gdmFsdWUgKSB7XG5cdFx0XHRcdCRockZpZWxkcy5zaG93KCk7XG5cdFx0XHRcdCRockFjY29yZGlvbi5oaWRlKCk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHQkaHJGaWVsZHMuaGlkZSgpO1xuXHRcdFx0fVxuXHRcdH1cblx0fSApO1xuXG5cdC8vIEhpZXJhcmNoaWNhbCBhY2NvcmRpb24gZmllbGQgdG9nZ2xlIHZpc2liaWxpdHkgd2hlbiBzaG93IGhpZXJhcmNoeSBpcyBjaGFuZ2VkLlxuXHRmaWVsZFdyYXBwZXIub24oICdhZnRlcl90b2dnbGVfcmVxdWVzdCcsIGZ1bmN0aW9uKCBlLCBoYW5kbGVyLCB2YWx1ZSwgJGZpZWxkICkge1xuXHRcdGlmICggJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1oaWVyYXJjaGljYWwgaW5wdXQnID09PSBoYW5kbGVyICkge1xuXHRcdFx0Y29uc3QgZGlzcGxheVR5cGUgID0gJGZpZWxkLmZpbmQoICcud2NhcGYtZm9ybS1zdWItZmllbGQtZGlzcGxheV90eXBlIHNlbGVjdCcgKS52YWwoKTtcblx0XHRcdGNvbnN0ICRockFjY29yZGlvbiA9ICRmaWVsZC5maW5kKCAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLWVuYWJsZV9oaWVyYXJjaHlfYWNjb3JkaW9uJyApO1xuXG5cdFx0XHRpZiAoICcxJyA9PT0gdmFsdWUgKSB7XG5cdFx0XHRcdGlmICggJ2NoZWNrYm94JyA9PT0gZGlzcGxheVR5cGUgfHwgJ3JhZGlvJyA9PT0gZGlzcGxheVR5cGUgKSB7XG5cdFx0XHRcdFx0JGhyQWNjb3JkaW9uLnNob3coKTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHQkaHJBY2NvcmRpb24uaGlkZSgpO1xuXHRcdFx0XHR9XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHQkaHJBY2NvcmRpb24uaGlkZSgpO1xuXHRcdFx0fVxuXHRcdH1cblx0fSApO1xuXG5cdC8vIE92ZXJyaWRlIG5vLXJlc3VsdHMtbWVzc2FnZSwgYWxsLWl0ZW1zLWxhYmVsIGZpZWxkJ3MgdG9nZ2xlIHZpc2liaWxpdHkgd2hlbiB0ZXh0IGRpc3BsYXkgdHlwZSBpcyBjaGFuZ2VkLlxuXHRmaWVsZFdyYXBwZXIub24oICdhZnRlcl90b2dnbGVfcmVxdWVzdCcsIGZ1bmN0aW9uKCBlLCBoYW5kbGVyLCB2YWx1ZSwgJGZpZWxkICkge1xuXHRcdGlmICggJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1kaXNwbGF5X3R5cGUgc2VsZWN0JyA9PT0gaGFuZGxlciApIHtcblx0XHRcdGNvbnN0ICRub1Jlc3VsdHMgICAgID0gJGZpZWxkLmZpbmQoICcud2NhcGYtZm9ybS1zdWItZmllbGQtY2hvc2VuX25vX3Jlc3VsdHNfbWVzc2FnZScgKTtcblx0XHRcdGNvbnN0ICRhbGxJdGVtc0xhYmVsID0gJGZpZWxkLmZpbmQoICcud2NhcGYtZm9ybS1zdWItZmllbGQtYWxsX2l0ZW1zX2xhYmVsJyApO1xuXHRcdFx0Y29uc3QgdXNlQ2hvc2VuICAgICAgPSAkZmllbGQuZmluZCggJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC11c2VfY2hvc2VuIGlucHV0JyApLmlzKCAnOmNoZWNrZWQnICk7XG5cblx0XHRcdGlmICggdXNlQ2hvc2VuICYmICggJ3NlbGVjdCcgPT09IHZhbHVlIHx8ICdtdWx0aS1zZWxlY3QnID09PSB2YWx1ZSApICkge1xuXHRcdFx0XHQkbm9SZXN1bHRzLnNob3coKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdCRub1Jlc3VsdHMuaGlkZSgpO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAoICggJ3JhZGlvJyA9PT0gdmFsdWUgfHwgJ3NlbGVjdCcgPT09IHZhbHVlICkgfHwgKCAnbXVsdGktc2VsZWN0JyA9PT0gdmFsdWUgJiYgdXNlQ2hvc2VuICkgKSB7XG5cdFx0XHRcdCRhbGxJdGVtc0xhYmVsLnNob3coKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdCRhbGxJdGVtc0xhYmVsLmhpZGUoKTtcblx0XHRcdH1cblx0XHR9XG5cdH0gKTtcblxuXHQvLyBPdmVycmlkZSBuby1yZXN1bHRzLW1lc3NhZ2UsIGFsbC1pdGVtcy1sYWJlbCBmaWVsZCdzIHRvZ2dsZSB2aXNpYmlsaXR5IHdoZW4gdGV4dCB1c2UgY2hvc2VuIGlzIGNoYW5nZWQuXG5cdGZpZWxkV3JhcHBlci5vbiggJ2FmdGVyX3RvZ2dsZV9yZXF1ZXN0JywgZnVuY3Rpb24oIGUsIGhhbmRsZXIsIHZhbHVlLCAkZmllbGQgKSB7XG5cdFx0aWYgKCAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLXVzZV9jaG9zZW4gaW5wdXQnID09PSBoYW5kbGVyICkge1xuXHRcdFx0Y29uc3QgJG5vUmVzdWx0cyAgICAgPSAkZmllbGQuZmluZCggJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1jaG9zZW5fbm9fcmVzdWx0c19tZXNzYWdlJyApO1xuXHRcdFx0Y29uc3QgJGFsbEl0ZW1zTGFiZWwgPSAkZmllbGQuZmluZCggJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1hbGxfaXRlbXNfbGFiZWwnICk7XG5cdFx0XHRjb25zdCBkaXNwbGF5VHlwZSAgICA9ICRmaWVsZC5maW5kKCAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLWRpc3BsYXlfdHlwZSBzZWxlY3QnICkudmFsKCk7XG5cblx0XHRcdGlmICggJzEnID09PSB2YWx1ZSAmJiAoICdzZWxlY3QnID09PSBkaXNwbGF5VHlwZSB8fCAnbXVsdGktc2VsZWN0JyA9PT0gZGlzcGxheVR5cGUgKSApIHtcblx0XHRcdFx0JG5vUmVzdWx0cy5zaG93KCk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHQkbm9SZXN1bHRzLmhpZGUoKTtcblx0XHRcdH1cblxuXHRcdFx0aWYgKFxuXHRcdFx0XHQoICcxJyA9PT0gdmFsdWUgJiYgJ211bHRpLXNlbGVjdCcgPT09IGRpc3BsYXlUeXBlIClcblx0XHRcdFx0fHwgKCAncmFkaW8nID09PSBkaXNwbGF5VHlwZSB8fCAnc2VsZWN0JyA9PT0gZGlzcGxheVR5cGUgKVxuXHRcdFx0KSB7XG5cdFx0XHRcdCRhbGxJdGVtc0xhYmVsLnNob3coKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdCRhbGxJdGVtc0xhYmVsLmhpZGUoKTtcblx0XHRcdH1cblx0XHR9XG5cdH0gKTtcblxufSApO1xuIiwiLyoqXG4gKiBGaWVsZCBtZXRhIGJveC5cbiAqXG4gKiBAc2luY2UgICAgICAzLjAuMFxuICogQHBhY2thZ2UgICAgd2MtYWpheC1wcm9kdWN0LWZpbHRlclxuICogQHN1YnBhY2thZ2Ugd2MtYWpheC1wcm9kdWN0LWZpbHRlci9hZG1pbi9zcmMvanNcbiAqIEBhdXRob3IgICAgIE1haW51bCBIYXNzYW4gTWFpblxuICovXG5cbmpRdWVyeSggZG9jdW1lbnQgKS5yZWFkeSggZnVuY3Rpb24oICQgKSB7XG5cblx0Y29uc3QgZmllbGRXcmFwcGVyID0gJCggJyNjaG9zZW5fZmllbGRfd3JhcHBlcicgKTtcblx0Y29uc3QgZmllbGRJbnB1dCAgID0gJ1tuYW1lXTpub3QoLm1hbnVhbF9vcHRpb25zKSc7XG5cdGNvbnN0IGZpZWxkU3RhdGVzICA9IHt9O1xuXG5cdGZ1bmN0aW9uIHN0b3JlRmllbGRTdGF0ZSgpIHtcblx0XHRjb25zdCBmaWVsZFR5cGUgPSBmaWVsZFdyYXBwZXIuZmluZCggJyNmaWVsZF9kYXRhJyApLmF0dHIoICdkYXRhLWZpZWxkLXR5cGUnICk7XG5cblx0XHRpZiAoICEgZmllbGRUeXBlICkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdGNvbnN0IGZpZWxkVmFsdWVzID0ge307XG5cblx0XHRmaWVsZFdyYXBwZXIuZmluZCggZmllbGRJbnB1dCApLmVhY2goIGZ1bmN0aW9uKCkge1xuXHRcdFx0Y29uc3QgJGlucHV0ID0gJCggdGhpcyApO1xuXHRcdFx0Y29uc3QgdHlwZSAgID0gJGlucHV0LmF0dHIoICd0eXBlJyApO1xuXHRcdFx0Y29uc3QgbmFtZSAgID0gJGlucHV0LmF0dHIoICduYW1lJyApO1xuXHRcdFx0Y29uc3QgdmFsdWUgID0gJGlucHV0LnZhbCgpO1xuXG5cdFx0XHRpZiAoICdjaGVja2JveCcgPT09IHR5cGUgfHwgJ3JhZGlvJyA9PT0gdHlwZSApIHtcblx0XHRcdFx0aWYgKCAkaW5wdXQuaXMoICc6Y2hlY2tlZCcgKSApIHtcblx0XHRcdFx0XHRmaWVsZFZhbHVlc1sgbmFtZSBdID0gdmFsdWU7XG5cdFx0XHRcdH1cblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGZpZWxkVmFsdWVzWyBuYW1lIF0gPSB2YWx1ZTtcblx0XHRcdH1cblx0XHR9ICk7XG5cblx0XHQvLyBIYW5kbGUgbWFudWFsIG9wdGlvbnMuXG5cdFx0Y29uc3QgbWFudWFsT3B0aW9ucyA9IHt9O1xuXG5cdFx0ZmllbGRXcmFwcGVyLmZpbmQoICcubWFudWFsX29wdGlvbnMnICkuZWFjaCggZnVuY3Rpb24oKSB7XG5cdFx0XHRjb25zdCAkaW5wdXQgPSAkKCB0aGlzICk7XG5cdFx0XHRjb25zdCBuYW1lICAgPSAkaW5wdXQuYXR0ciggJ25hbWUnICk7XG5cblx0XHRcdG1hbnVhbE9wdGlvbnNbIG5hbWUgXSA9ICRpbnB1dC52YWwoKTtcblx0XHR9ICk7XG5cblx0XHRmaWVsZFZhbHVlc1sgJ21hbnVhbF9vcHRpb25zJyBdID0gbWFudWFsT3B0aW9ucztcblxuXHRcdGZpZWxkU3RhdGVzWyBmaWVsZFR5cGUgXSA9IGZpZWxkVmFsdWVzO1xuXHR9XG5cblx0ZnVuY3Rpb24gdXBkYXRlRmllbGRTdGF0ZSggJGVsbSApIHtcblx0XHRjb25zdCBmaWVsZFR5cGUgID0gZmllbGRXcmFwcGVyLmZpbmQoICcjZmllbGRfZGF0YScgKS5hdHRyKCAnZGF0YS1maWVsZC10eXBlJyApO1xuXHRcdGNvbnN0IGZpZWxkU3RhdGUgPSBmaWVsZFN0YXRlc1sgZmllbGRUeXBlIF07XG5cblx0XHRjb25zdCBuYW1lICA9ICRlbG0uYXR0ciggJ25hbWUnICk7XG5cdFx0Y29uc3QgdHlwZSAgPSAkZWxtLmF0dHIoICd0eXBlJyApO1xuXHRcdGNvbnN0IHZhbHVlID0gJGVsbS52YWwoKTtcblxuXHRcdGlmICggJGVsbS5oYXNDbGFzcyggJ21hbnVhbF9vcHRpb25zJyApICkge1xuXHRcdFx0Y29uc3QgbWFudWFsX29wdGlvbnMgPSBmaWVsZFN0YXRlWyAnbWFudWFsX29wdGlvbnMnIF0gfHwge307XG5cblx0XHRcdG1hbnVhbF9vcHRpb25zWyBuYW1lIF0gPSB2YWx1ZTtcblxuXHRcdFx0ZmllbGRTdGF0ZVsgJ21hbnVhbF9vcHRpb25zJyBdID0gbWFudWFsX29wdGlvbnM7XG5cdFx0fSBlbHNlIHtcblx0XHRcdGlmICggJ2NoZWNrYm94JyA9PT0gdHlwZSB8fCAncmFkaW8nID09PSB0eXBlICkge1xuXHRcdFx0XHRjb25zdCAkaW5wdXQgPSBmaWVsZFdyYXBwZXIuZmluZCggJ1tuYW1lPVwiJyArIG5hbWUgKyAnXCJdJyApO1xuXG5cdFx0XHRcdGlmICggJGlucHV0LmlzKCAnOmNoZWNrZWQnICkgKSB7XG5cdFx0XHRcdFx0ZmllbGRTdGF0ZVsgbmFtZSBdID0gdmFsdWU7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0ZGVsZXRlIGZpZWxkU3RhdGVbIG5hbWUgXTtcblx0XHRcdFx0fVxuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0ZmllbGRTdGF0ZVsgbmFtZSBdID0gdmFsdWU7XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cblx0Ly8gU3RvcmUgdGhlIGluaXRpYWwgZmllbGQgc3RhdGUuXG5cdHN0b3JlRmllbGRTdGF0ZSgpO1xuXG5cdGZpZWxkV3JhcHBlci5maW5kKCAnW25hbWVdJyApLm9uKCAnY2hhbmdlJywgZnVuY3Rpb24oKSB7XG5cdFx0Y29uc3QgJHRoaXMgPSAkKCB0aGlzICk7XG5cblx0XHR1cGRhdGVGaWVsZFN0YXRlKCAkdGhpcyApO1xuXHR9ICk7XG5cblx0ZnVuY3Rpb24gYXBwbHlGaWVsZFN0YXRlKCBmaWVsZFR5cGUgKSB7XG5cdFx0Y29uc3QgZmllbGRTdGF0ZSA9IGZpZWxkU3RhdGVzWyBmaWVsZFR5cGUgXTtcblxuXHRcdGZpZWxkV3JhcHBlci5maW5kKCBmaWVsZElucHV0ICkuZWFjaCggZnVuY3Rpb24oKSB7XG5cdFx0XHRjb25zdCAkaW5wdXQgPSAkKCB0aGlzICk7XG5cdFx0XHRjb25zdCB0eXBlICAgPSAkaW5wdXQuYXR0ciggJ3R5cGUnICk7XG5cdFx0XHRjb25zdCBuYW1lICAgPSAkaW5wdXQuYXR0ciggJ25hbWUnICk7XG5cdFx0XHRjb25zdCB2YWx1ZSAgPSBmaWVsZFN0YXRlWyBuYW1lIF07XG5cblx0XHRcdGlmICggJ2NoZWNrYm94JyA9PT0gdHlwZSB8fCAncmFkaW8nID09PSB0eXBlICkge1xuXHRcdFx0XHRpZiAoIG5hbWUgaW4gZmllbGRTdGF0ZSApIHtcblx0XHRcdFx0XHQvLyBBZGQgJ2NoZWNrZWQnIGF0dHJpYnV0ZS5cblx0XHRcdFx0XHRmaWVsZFdyYXBwZXJcblx0XHRcdFx0XHRcdC5maW5kKCAnW25hbWU9XCInICsgbmFtZSArICdcIl1bdmFsdWU9XCInICsgdmFsdWUgKyAnXCJdJyApXG5cdFx0XHRcdFx0XHQuYXR0ciggJ2NoZWNrZWQnLCAnY2hlY2tlZCcgKTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHQvLyBSZW1vdmUgJ2NoZWNrZWQnIGF0dHJpYnV0ZS5cblx0XHRcdFx0XHRmaWVsZFdyYXBwZXIuZmluZCggJ1tuYW1lPVwiJyArIG5hbWUgKyAnXCJdJyApLnJlbW92ZUF0dHIoICdjaGVja2VkJyApO1xuXHRcdFx0XHR9XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHQkaW5wdXQudmFsKCB2YWx1ZSApO1xuXHRcdFx0fVxuXHRcdH0gKTtcblxuXHRcdC8vIFByb2Nlc3MgdGhlIG1hbnVhbCBvcHRpb25zLlxuXHRcdGlmICggJ21hbnVhbF9vcHRpb25zJyBpbiBmaWVsZFN0YXRlICkge1xuXHRcdFx0Y29uc3QgcmF3T3B0aW9ucyA9IGZpZWxkU3RhdGVbICdtYW51YWxfb3B0aW9ucycgXTtcblxuXHRcdFx0JC5lYWNoKCByYXdPcHRpb25zLCBmdW5jdGlvbiggaW5wdXROYW1lLCByYXcgKSB7XG5cdFx0XHRcdGNvbnN0ICRyYXdJbnB1dCA9IGZpZWxkV3JhcHBlci5maW5kKCAnW25hbWU9XCInICsgaW5wdXROYW1lICsgJ1wiXScgKTtcblxuXHRcdFx0XHQkcmF3SW5wdXQudmFsKCByYXcgKTtcblxuXHRcdFx0XHRjb25zdCBtYW51YWxPcHRpb25zID0gSlNPTi5wYXJzZSggZGVjb2RlVVJJQ29tcG9uZW50KCByYXcgKSApO1xuXG5cdFx0XHRcdGlmICggISBtYW51YWxPcHRpb25zLmxlbmd0aCApIHtcblx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRjb25zdCB0YWJsZUlkZW50aWZpZXIgPSAkcmF3SW5wdXQuYXR0ciggJ2RhdGEtdGFibGUnICk7XG5cdFx0XHRcdGNvbnN0IHJvd1RlbXBsYXRlSWQgICA9ICRyYXdJbnB1dC5hdHRyKCAnZGF0YS10bXBsJyApO1xuXG5cdFx0XHRcdC8vIEJhaWwgb3V0IGlmIG5vIHRtcGwgZm91bmQgZm9yIHRoZSB0eXBlLlxuXHRcdFx0XHRpZiAoICEgalF1ZXJ5KCAnI3RtcGwtJyArIHJvd1RlbXBsYXRlSWQgKS5sZW5ndGggKSB7XG5cdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0Y29uc3Qgcm93c0lkZW50aWZpZXIgPSAnLmZpZWxkLXRhYmxlLWJvZHktcm93cyc7XG5cdFx0XHRcdGNvbnN0IHJvd0lkZW50aWZpZXIgID0gJy5yb3ctaXRlbSc7XG5cblx0XHRcdFx0Y29uc3QgJHRhYmxlID0gZmllbGRXcmFwcGVyLmZpbmQoIHRhYmxlSWRlbnRpZmllciApO1xuXHRcdFx0XHRjb25zdCAkcm93cyAgPSAkdGFibGUuZmluZCggcm93c0lkZW50aWZpZXIgKTtcblxuXHRcdFx0XHQkLmVhY2goIG1hbnVhbE9wdGlvbnMsIGZ1bmN0aW9uKCBpLCBvcHRpb24gKSB7XG5cdFx0XHRcdFx0Y29uc3QgdGVtcGxhdGUgPSB3cC50ZW1wbGF0ZSggcm93VGVtcGxhdGVJZCApO1xuXG5cdFx0XHRcdFx0bGV0IHJvd0RlZmF1bHRPcHRpb25zID0ge307XG5cblx0XHRcdFx0XHRpZiAoICcubWFudWFsLW9wdGlvbnMtdGFibGUnID09PSB0YWJsZUlkZW50aWZpZXIgKSB7XG5cdFx0XHRcdFx0XHRyb3dEZWZhdWx0T3B0aW9ucyA9IHtcblx0XHRcdFx0XHRcdFx0J3ZhbHVlJzogJycsXG5cdFx0XHRcdFx0XHRcdCdsYWJlbCc6ICcnLFxuXHRcdFx0XHRcdFx0fTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRjb25zdCByZW5kZXJlZCA9IHRlbXBsYXRlKCByb3dEZWZhdWx0T3B0aW9ucyApO1xuXG5cdFx0XHRcdFx0JHJvd3MuYXBwZW5kKCByZW5kZXJlZCApO1xuXG5cdFx0XHRcdFx0Y29uc3QgJGxhc3RSb3cgPSAkcm93cy5maW5kKCByb3dJZGVudGlmaWVyICkubGFzdCgpO1xuXG5cdFx0XHRcdFx0JGxhc3RSb3cuZmluZCggJ1tkYXRhLW5hbWVdJyApLmVhY2goIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdFx0Y29uc3QgJHRoaXMgPSAkKCB0aGlzICk7XG5cdFx0XHRcdFx0XHRjb25zdCBuYW1lICA9ICR0aGlzLmF0dHIoICdkYXRhLW5hbWUnICk7XG5cdFx0XHRcdFx0XHRjb25zdCB2YWx1ZSA9IG9wdGlvblsgbmFtZSBdO1xuXG5cdFx0XHRcdFx0XHQkdGhpcy52YWwoIHZhbHVlICk7XG5cblx0XHRcdFx0XHRcdGlmICggJ2ltYWdlX3VybCcgPT09IG5hbWUgJiYgdmFsdWUgKSB7XG5cdFx0XHRcdFx0XHRcdCRsYXN0Um93LmZpbmQoICcud3AtaW1hZ2UtcGlja2VyLWNvbnRhaW5lcicgKS5hZGRDbGFzcyggJ2FjdGl2ZScgKTtcblx0XHRcdFx0XHRcdFx0JGxhc3RSb3cuZmluZCggJ2ltZycgKS5hdHRyKCAnc3JjJywgdmFsdWUgKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9ICk7XG5cdFx0XHRcdH0gKTtcblxuXHRcdFx0XHQkdGFibGUuYWRkQ2xhc3MoICdoYXMtb3B0aW9ucycgKTtcblx0XHRcdH0gKTtcblxuXHRcdFx0Y29uc3QgJGZpZWxkID0gZmllbGRXcmFwcGVyLmZpbmQoICcud2NhcGYtZm9ybS1maWVsZCcgKTtcblxuXHRcdFx0ZmllbGRXcmFwcGVyLnRyaWdnZXIoICduZXdfb3B0aW9uX2FkZGVkJywgWyAkZmllbGQgXSApO1xuXHRcdH1cblx0fVxuXG5cdCQoICcjYXZhaWxhYmxlX2ZpZWxkcycgKS5vbiggJ2NoYW5nZScsICdbbmFtZT1cIl9hY3RpdmVfZmllbGRcIl0nLCBmdW5jdGlvbigpIHtcblx0XHRjb25zdCAkdGhpcyAgICAgID0gJCggdGhpcyApO1xuXHRcdGNvbnN0IF9maWVsZFR5cGUgPSAkdGhpcy52YWwoKTtcblx0XHRjb25zdCBmaWVsZE5hbWUgID0gJHRoaXMuYXR0ciggJ2RhdGEtZmllbGQtbmFtZScgKTtcblxuXHRcdGlmICggISBfZmllbGRUeXBlICkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdGNvbnN0IGZpZWxkVHlwZSA9ICd3Y2FwZi1mb3JtLWZpZWxkLScgKyBfZmllbGRUeXBlO1xuXG5cdFx0Ly8gQmFpbCBvdXQgaWYgbm8gdG1wbCBmb3VuZCBmb3IgdGhlIHR5cGUuXG5cdFx0aWYgKCAhIGpRdWVyeSggJyN0bXBsLScgKyBmaWVsZFR5cGUgKS5sZW5ndGggKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0Y29uc3QgdGVtcGxhdGUgICAgICAgICA9IHdwLnRlbXBsYXRlKCBmaWVsZFR5cGUgKTtcblx0XHRjb25zdCByZW5kZXJlZCAgICAgICAgID0gdGVtcGxhdGUoKTtcblx0XHRjb25zdCBmaWVsZERhdGFXcmFwcGVyID0gZmllbGRXcmFwcGVyLmZpbmQoICcjZmllbGRfZGF0YScgKTtcblx0XHRjb25zdCBmaWVsZE5hbWVXcmFwcGVyID0gZmllbGRXcmFwcGVyLmZpbmQoICcucG9zdGJveC1oZWFkZXIgaDInICk7XG5cdFx0Y29uc3QgZmllbGRJbnNpZGUgICAgICA9IGZpZWxkV3JhcHBlci5maW5kKCAnLmluc2lkZScgKTtcblxuXHRcdGZpZWxkV3JhcHBlci5yZW1vdmVDbGFzcyggJ2hpZGRlbicgKTtcblxuXHRcdGZpZWxkRGF0YVdyYXBwZXIuYXR0ciggJ2RhdGEtZmllbGQtdHlwZScsIF9maWVsZFR5cGUgKTtcblx0XHRmaWVsZE5hbWVXcmFwcGVyLmh0bWwoIGZpZWxkTmFtZSApO1xuXHRcdGZpZWxkSW5zaWRlLmh0bWwoIHJlbmRlcmVkICk7XG5cblx0XHQvLyBJZiBhbHJlYWR5IGZvdW5kIHRoZSBmaWVsZCBzdGF0ZSB0aGVuIGFwcGx5IGl0LCBvdGhlcndpc2Ugc3RvcmUgaXQuXG5cdFx0aWYgKCBfZmllbGRUeXBlIGluIGZpZWxkU3RhdGVzICkge1xuXHRcdFx0YXBwbHlGaWVsZFN0YXRlKCBfZmllbGRUeXBlICk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHN0b3JlRmllbGRTdGF0ZSgpO1xuXHRcdH1cblxuXHRcdGZpZWxkV3JhcHBlci50cmlnZ2VyKCAnZmllbGRfYWRkZWQnICk7XG5cblx0XHRmaWVsZFdyYXBwZXIuZmluZCggJ1tuYW1lXScgKS5vbiggJ2NoYW5nZScsIGZ1bmN0aW9uKCkge1xuXHRcdFx0Y29uc3QgJHRoaXMgPSAkKCB0aGlzICk7XG5cblx0XHRcdHVwZGF0ZUZpZWxkU3RhdGUoICR0aGlzICk7XG5cdFx0fSApO1xuXHR9ICk7XG5cbn0gKTtcbiIsIi8qKlxuICogTWFudWFsIE9wdGlvbnMnIHRhYmxlIGZ1bmN0aW9uLlxuICpcbiAqIEBzaW5jZSAgICAgIDMuMC4wXG4gKiBAcGFja2FnZSAgICB3Yy1hamF4LXByb2R1Y3QtZmlsdGVyXG4gKiBAc3VicGFja2FnZSB3Yy1hamF4LXByb2R1Y3QtZmlsdGVyL2FkbWluL3NyYy9qc1xuICogQGF1dGhvciAgICAgTWFpbnVsIEhhc3NhbiBNYWluXG4gKi9cblxuLyoqXG4gKiBAcGFyYW0gdGFibGVJZGVudGlmaWVyXG4gKiBAcGFyYW0gdmFsdWVJZGVudGlmaWVyXG4gKiBAcGFyYW0gcm93VGVtcGxhdGVJZFxuICogQHBhcmFtIHJvd0RlZmF1bHRPcHRpb25zXG4gKi9cbmZ1bmN0aW9uIGluaXRNYW51YWxPcHRpb25zVGFibGUoIHRhYmxlSWRlbnRpZmllciwgdmFsdWVJZGVudGlmaWVyLCByb3dUZW1wbGF0ZUlkLCByb3dEZWZhdWx0T3B0aW9ucyA9IHt9ICkge1xuXHRjb25zdCAkID0galF1ZXJ5O1xuXG5cdGNvbnN0IGZpZWxkV3JhcHBlciA9ICQoICcjY2hvc2VuX2ZpZWxkX3dyYXBwZXInICk7XG5cblx0Y29uc3QgZmllbGRJZGVudGlmaWVyID0gJy53Y2FwZi1mb3JtLWZpZWxkJztcblx0Y29uc3Qgcm93c0lkZW50aWZpZXIgID0gJy5maWVsZC10YWJsZS1ib2R5LXJvd3MnO1xuXHRjb25zdCByb3dJZGVudGlmaWVyICAgPSAnLnJvdy1pdGVtJztcblxuXHRmdW5jdGlvbiBpbml0U29ydGFibGVUYWJsZSggJHNlbGVjdG9yICkge1xuXHRcdCRzZWxlY3Rvci5zb3J0YWJsZSgge1xuXHRcdFx0b3BhY2l0eTogMC44LFxuXHRcdFx0cmV2ZXJ0OiBmYWxzZSxcblx0XHRcdGN1cnNvcjogJ21vdmUnLFxuXHRcdFx0YXhpczogJ3knLFxuXHRcdFx0aGFuZGxlOiAnLm1vdmUtb3B0aW9ucy1oYW5kbGVyJyxcblx0XHRcdHBsYWNlaG9sZGVyOiAnd2lkZ2V0LXBsYWNlaG9sZGVyJyxcblx0XHRcdHVwZGF0ZTogZnVuY3Rpb24oIGUgKSB7XG5cdFx0XHRcdGNvbnN0ICRmaWVsZCA9ICQoIGUudGFyZ2V0ICkuY2xvc2VzdCggJy53Y2FwZi1mb3JtLWZpZWxkJyApO1xuXG5cdFx0XHRcdHRyaWdnZXJPcHRpb25zQ2hhbmdlKCAkZmllbGQgKTtcblx0XHRcdH1cblx0XHR9ICkuZGlzYWJsZVNlbGVjdGlvbigpO1xuXHR9XG5cblx0Y29uc3QgdGFibGVSb3dzSWRlbnRpZmllciA9IHRhYmxlSWRlbnRpZmllciArICcgJyArIHJvd3NJZGVudGlmaWVyO1xuXG5cdC8vIEluaXQgdGhlIHNvcnRhYmxlIHRhYmxlIGFmdGVyIHBhZ2UgbG9hZHMuXG5cdGluaXRTb3J0YWJsZVRhYmxlKCBmaWVsZFdyYXBwZXIuZmluZCggdGFibGVSb3dzSWRlbnRpZmllciApICk7XG5cblx0Ly8gSW5pdCB0aGUgc29ydGFibGUgdGFibGUgYWZ0ZXIgdGhlIGZpZWxkIGlzIGFkZGVkLlxuXHRmaWVsZFdyYXBwZXIub24oICdmaWVsZF9hZGRlZCcsIGZ1bmN0aW9uKCkge1xuXHRcdGluaXRTb3J0YWJsZVRhYmxlKCAkKCBmaWVsZFdyYXBwZXIuZmluZCggdGFibGVSb3dzSWRlbnRpZmllciApICkgKTtcblx0fSApO1xuXG5cdGZ1bmN0aW9uIHRyaWdnZXJPcHRpb25zQ2hhbmdlKCAkZmllbGQgKSB7XG5cdFx0Y29uc3QgJHZhbHVlSG9sZGVyID0gJGZpZWxkLmZpbmQoIHZhbHVlSWRlbnRpZmllciApO1xuXHRcdGNvbnN0ICRyb3dzICAgICAgICA9ICRmaWVsZC5maW5kKCB0YWJsZVJvd3NJZGVudGlmaWVyICk7XG5cdFx0Y29uc3QgX3Jvd3MgICAgICAgID0gW107XG5cblx0XHQkcm93cy5maW5kKCAnLnJvdy1pdGVtJyApLmVhY2goIGZ1bmN0aW9uKCBpLCBfaXRlbSApIHtcblx0XHRcdGNvbnN0ICRpdGVtID0gJCggX2l0ZW0gKTtcblx0XHRcdGNvbnN0IG9iaiAgID0ge307XG5cblx0XHRcdCRpdGVtLmZpbmQoICdbZGF0YS1uYW1lXScgKS5lYWNoKCBmdW5jdGlvbiggZmllbGRJbmRleCwgZmllbGQgKSB7XG5cdFx0XHRcdGNvbnN0ICRmaWVsZCA9ICQoIGZpZWxkICk7XG5cdFx0XHRcdGNvbnN0IG5hbWUgICA9ICRmaWVsZC5hdHRyKCAnZGF0YS1uYW1lJyApO1xuXG5cdFx0XHRcdG9ialsgbmFtZSBdID0gJGZpZWxkLnZhbCgpO1xuXHRcdFx0fSApO1xuXG5cdFx0XHRfcm93cy5wdXNoKCBvYmogKTtcblx0XHR9ICk7XG5cblx0XHRjb25zdCByYXdWYWx1ZXMgPSBlbmNvZGVVUklDb21wb25lbnQoIEpTT04uc3RyaW5naWZ5KCBfcm93cyApICk7XG5cdFx0JHZhbHVlSG9sZGVyLnZhbCggcmF3VmFsdWVzICkudHJpZ2dlciggJ2NoYW5nZScgKTtcblx0fVxuXG5cdGZ1bmN0aW9uIHRyaWdnZXJSZW1vdmVPcHRpb24oICRmaWVsZCApIHtcblx0XHRjb25zdCAkb3B0aW9uc1RhYmxlID0gJGZpZWxkLmZpbmQoIHRhYmxlSWRlbnRpZmllciApO1xuXHRcdGNvbnN0IHRhYmxlUm93cyAgICAgPSAkZmllbGQuZmluZCggdGFibGVSb3dzSWRlbnRpZmllciApLmNoaWxkcmVuKCk7XG5cblx0XHRpZiAoIDIgPiB0YWJsZVJvd3MubGVuZ3RoICkge1xuXHRcdFx0JG9wdGlvbnNUYWJsZS5yZW1vdmVDbGFzcyggJ2hhcy1vcHRpb25zJyApO1xuXHRcdH1cblx0fVxuXG5cdC8vIFJlbW92ZSBPcHRpb25cblx0Y29uc3QgcmVtb3ZlQnRuSWRlbnRpZmllciA9IHRhYmxlSWRlbnRpZmllciArICcgLnJlbW92ZS1vcHRpb24nO1xuXG5cdGZpZWxkV3JhcHBlci5vbiggJ2NsaWNrJywgcmVtb3ZlQnRuSWRlbnRpZmllciwgZnVuY3Rpb24oKSB7XG5cdFx0Y29uc3QgJGl0ZW0gID0gJCggdGhpcyApLmNsb3Nlc3QoIHJvd0lkZW50aWZpZXIgKTtcblx0XHRjb25zdCAkZmllbGQgPSAkaXRlbS5jbG9zZXN0KCBmaWVsZElkZW50aWZpZXIgKTtcblxuXHRcdHRyaWdnZXJSZW1vdmVPcHRpb24oICRmaWVsZCApO1xuXG5cdFx0JGl0ZW0ucmVtb3ZlKCk7XG5cblx0XHR0cmlnZ2VyT3B0aW9uc0NoYW5nZSggJGZpZWxkICk7XG5cdH0gKTtcblxuXHQvLyBDbGVhciBBbGwgT3B0aW9uc1xuXHRjb25zdCBjbGVhck9wdGlvbnNCdG5JZGVudGlmaWVyID0gdGFibGVJZGVudGlmaWVyICsgJyAuY2xlYXItb3B0aW9ucyc7XG5cblx0ZmllbGRXcmFwcGVyLm9uKCAnY2xpY2snLCBjbGVhck9wdGlvbnNCdG5JZGVudGlmaWVyLCBmdW5jdGlvbigpIHtcblx0XHRjb25zdCAkZmllbGQgPSAkKCB0aGlzICkuY2xvc2VzdCggZmllbGRJZGVudGlmaWVyICk7XG5cblx0XHQkZmllbGQuZmluZCggdGFibGVSb3dzSWRlbnRpZmllciApLmVtcHR5KCk7XG5cblx0XHR0cmlnZ2VyUmVtb3ZlT3B0aW9uKCAkZmllbGQgKTtcblx0XHR0cmlnZ2VyT3B0aW9uc0NoYW5nZSggJGZpZWxkICk7XG5cdH0gKTtcblxuXHQvLyBBZGQgTmV3IE9wdGlvblxuXHRjb25zdCBhZGRPcHRpb25CdG5JZGVudGlmaWVyID0gdGFibGVJZGVudGlmaWVyICsgJyAuYWRkLW9wdGlvbic7XG5cblx0ZmllbGRXcmFwcGVyLm9uKCAnY2xpY2snLCBhZGRPcHRpb25CdG5JZGVudGlmaWVyLCBmdW5jdGlvbigpIHtcblx0XHQvLyBCYWlsIG91dCBpZiBubyB0bXBsIGZvdW5kIGZvciB0aGUgdHlwZS5cblx0XHRpZiAoICEgalF1ZXJ5KCAnI3RtcGwtJyArIHJvd1RlbXBsYXRlSWQgKS5sZW5ndGggKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0Y29uc3QgJGZpZWxkID0gJCggdGhpcyApLmNsb3Nlc3QoIGZpZWxkSWRlbnRpZmllciApO1xuXG5cdFx0Y29uc3QgdGVtcGxhdGUgPSB3cC50ZW1wbGF0ZSggcm93VGVtcGxhdGVJZCApO1xuXHRcdGNvbnN0IHJlbmRlcmVkID0gdGVtcGxhdGUoIHJvd0RlZmF1bHRPcHRpb25zICk7XG5cdFx0Y29uc3QgJHRhYmxlICAgPSAkZmllbGQuZmluZCggdGFibGVJZGVudGlmaWVyICk7XG5cdFx0Y29uc3QgJHJvd3MgICAgPSAkZmllbGQuZmluZCggdGFibGVSb3dzSWRlbnRpZmllciApO1xuXG5cdFx0JHJvd3MuYXBwZW5kKCByZW5kZXJlZCApO1xuXG5cdFx0dHJpZ2dlck9wdGlvbnNDaGFuZ2UoICRmaWVsZCApO1xuXG5cdFx0ZmllbGRXcmFwcGVyLnRyaWdnZXIoICduZXdfb3B0aW9uX2FkZGVkJywgWyAkZmllbGQgXSApO1xuXG5cdFx0aWYgKCAhICR0YWJsZS5oYXNDbGFzcyggJ2hhcy1vcHRpb25zJyApICkge1xuXHRcdFx0JHRhYmxlLmFkZENsYXNzKCAnaGFzLW9wdGlvbnMnICk7XG5cdFx0fVxuXHR9ICk7XG5cblx0Ly8gVHJpZ2dlciBvcHRpb25zIGNoYW5nZSB3aGVuIHRoZSB0ZXh0IGZpZWxkcyBnZXQgY2hhbmdlZC5cblx0Y29uc3QgdGV4dEZpZWxkc0lkZW50aWZpZXIgPSB0YWJsZVJvd3NJZGVudGlmaWVyICsgJyBpbnB1dFt0eXBlPVwidGV4dFwiXSc7XG5cblx0ZmllbGRXcmFwcGVyLm9uKCAnaW5wdXQnLCB0ZXh0RmllbGRzSWRlbnRpZmllciwgZnVuY3Rpb24oKSB7XG5cdFx0Y29uc3QgJGZpZWxkID0gJCggdGhpcyApLmNsb3Nlc3QoIGZpZWxkSWRlbnRpZmllciApO1xuXG5cdFx0dHJpZ2dlck9wdGlvbnNDaGFuZ2UoICRmaWVsZCApO1xuXHR9ICk7XG5cblx0Ly8gVHJpZ2dlciBvcHRpb25zIGNoYW5nZSB3aGVuIHRoZSBzZWxlY3QgZmllbGRzIGdldCBjaGFuZ2VkLlxuXHRsZXQgc2VsZWN0RmllbGRzSWRlbnRpZmllciA9IHRhYmxlUm93c0lkZW50aWZpZXIgKyAnIHNlbGVjdCc7XG5cblx0ZmllbGRXcmFwcGVyLm9uKCAnY2hhbmdlJywgc2VsZWN0RmllbGRzSWRlbnRpZmllciwgZnVuY3Rpb24oKSB7XG5cdFx0Y29uc3QgJGZpZWxkID0gJCggdGhpcyApLmNsb3Nlc3QoIGZpZWxkSWRlbnRpZmllciApO1xuXG5cdFx0dHJpZ2dlck9wdGlvbnNDaGFuZ2UoICRmaWVsZCApO1xuXHR9ICk7XG5cblx0Ly8gVHJpZ2dlciBvcHRpb25zIGNoYW5nZSB3aGVuIHZhbHVlIGlzIGFkZGVkIGZyb20gbW9kYWwuXG5cdGZpZWxkV3JhcHBlci5vbiggJ3RyaWdnZXJfb3B0aW9uc190YWJsZScsIGZ1bmN0aW9uKCBlLCB0YWJsZUlkLCAkZmllbGQgKSB7XG5cdFx0aWYgKCB0YWJsZUlkID09PSB0YWJsZUlkZW50aWZpZXIgKSB7XG5cdFx0XHR0cmlnZ2VyT3B0aW9uc0NoYW5nZSggJGZpZWxkICk7XG5cdFx0fVxuXHR9ICk7XG5cbn1cbiIsIi8qKlxuICogVGhlIG51bWJlciB1aSBvcHRpb25zLlxuICpcbiAqIEBzaW5jZSAgICAgIDMuMC4wXG4gKiBAcGFja2FnZSAgICB3Yy1hamF4LXByb2R1Y3QtZmlsdGVyXG4gKiBAc3VicGFja2FnZSB3Yy1hamF4LXByb2R1Y3QtZmlsdGVyL2FkbWluL3NyYy9qc1xuICogQGF1dGhvciAgICAgTWFpbnVsIEhhc3NhbiBNYWluXG4gKi9cblxualF1ZXJ5KCBkb2N1bWVudCApLnJlYWR5KCBmdW5jdGlvbiggJCApIHtcblxuXHRjb25zdCBmaWVsZFdyYXBwZXIgPSAkKCAnI2Nob3Nlbl9maWVsZF93cmFwcGVyJyApO1xuXG5cdC8qKlxuXHQgKiBUb2dnbGUgZGlzYWJsZWQgYXR0cmlidXRlIG9mIG1pbi12YWx1ZSBmaWVsZCBmb3IgbnVtYmVyIHR5cGUuXG5cdCAqL1xuXHRmdW5jdGlvbiB0b2dnbGVOdW1iZXJNaW5WYWx1ZUZpZWxkKCAkZWxtICkge1xuXHRcdGNvbnN0ICRmaWVsZCAgICAgPSAkZWxtLmNsb3Nlc3QoICcud2NhcGYtZm9ybS1maWVsZCcgKTtcblx0XHRjb25zdCAkdGV4dEZpZWxkID0gJGZpZWxkLmZpbmQoICcud2NhcGYtZm9ybS1zdWItZmllbGQtbWluX3ZhbHVlIGlucHV0W3R5cGU9XCJ0ZXh0XCJdJyApO1xuXG5cdFx0aWYgKCAkZWxtLmlzKCAnOmNoZWNrZWQnICkgKSB7XG5cdFx0XHQkdGV4dEZpZWxkLmF0dHIoICdkaXNhYmxlZCcsICdkaXNhYmxlZCcgKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0JHRleHRGaWVsZC5yZW1vdmVBdHRyKCAnZGlzYWJsZWQnICk7XG5cdFx0fVxuXHR9XG5cblx0ZmllbGRXcmFwcGVyLm9uKCAnZmllbGRfYWRkZWQnLCBmdW5jdGlvbigpIHtcblx0XHRmaWVsZFdyYXBwZXIuZmluZCggJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1taW5fdmFsdWVfYXV0b19kZXRlY3QgaW5wdXRbdHlwZT1cImNoZWNrYm94XCJdJyApLmVhY2goIGZ1bmN0aW9uKCkge1xuXHRcdFx0Y29uc3QgJHRoaXMgPSAkKCB0aGlzICk7XG5cblx0XHRcdHRvZ2dsZU51bWJlck1pblZhbHVlRmllbGQoICR0aGlzICk7XG5cdFx0fSApO1xuXHR9ICk7XG5cblx0ZmllbGRXcmFwcGVyLm9uKFxuXHRcdCdjbGljaycsXG5cdFx0Jy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1taW5fdmFsdWVfYXV0b19kZXRlY3QgaW5wdXRbdHlwZT1cImNoZWNrYm94XCJdJyxcblx0XHRmdW5jdGlvbigpIHtcblx0XHRcdGNvbnN0ICR0aGlzID0gJCggdGhpcyApO1xuXG5cdFx0XHR0b2dnbGVOdW1iZXJNaW5WYWx1ZUZpZWxkKCAkdGhpcyApO1xuXHRcdH1cblx0KTtcblxuXHQvKipcblx0ICogVG9nZ2xlIGRpc2FibGVkIGF0dHJpYnV0ZSBvZiBtYXgtdmFsdWUgZmllbGQgZm9yIG51bWJlciB0eXBlLlxuXHQgKi9cblx0ZnVuY3Rpb24gdG9nZ2xlTnVtYmVyTWF4VmFsdWVGaWVsZCggJGVsbSApIHtcblx0XHRjb25zdCAkZmllbGQgICAgID0gJGVsbS5jbG9zZXN0KCAnLndjYXBmLWZvcm0tZmllbGQnICk7XG5cdFx0Y29uc3QgJHRleHRGaWVsZCA9ICRmaWVsZC5maW5kKCAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLW1heF92YWx1ZSBpbnB1dFt0eXBlPVwidGV4dFwiXScgKTtcblxuXHRcdGlmICggJGVsbS5pcyggJzpjaGVja2VkJyApICkge1xuXHRcdFx0JHRleHRGaWVsZC5hdHRyKCAnZGlzYWJsZWQnLCAnZGlzYWJsZWQnICk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdCR0ZXh0RmllbGQucmVtb3ZlQXR0ciggJ2Rpc2FibGVkJyApO1xuXHRcdH1cblx0fVxuXG5cdGZpZWxkV3JhcHBlci5vbiggJ2ZpZWxkX2FkZGVkJywgZnVuY3Rpb24oKSB7XG5cdFx0ZmllbGRXcmFwcGVyLmZpbmQoICcud2NhcGYtZm9ybS1zdWItZmllbGQtbWF4X3ZhbHVlX2F1dG9fZGV0ZWN0IGlucHV0W3R5cGU9XCJjaGVja2JveFwiXScgKS5lYWNoKCBmdW5jdGlvbigpIHtcblx0XHRcdGNvbnN0ICR0aGlzID0gJCggdGhpcyApO1xuXG5cdFx0XHR0b2dnbGVOdW1iZXJNYXhWYWx1ZUZpZWxkKCAkdGhpcyApO1xuXHRcdH0gKTtcblx0fSApO1xuXG5cdGZpZWxkV3JhcHBlci5vbihcblx0XHQnY2xpY2snLFxuXHRcdCcud2NhcGYtZm9ybS1zdWItZmllbGQtbWF4X3ZhbHVlX2F1dG9fZGV0ZWN0IGlucHV0W3R5cGU9XCJjaGVja2JveFwiXScsXG5cdFx0ZnVuY3Rpb24oKSB7XG5cdFx0XHRjb25zdCAkdGhpcyA9ICQoIHRoaXMgKTtcblxuXHRcdFx0dG9nZ2xlTnVtYmVyTWF4VmFsdWVGaWVsZCggJHRoaXMgKTtcblx0XHR9XG5cdCk7XG5cbn0gKTtcbiIsIi8qKlxuICogVGhlIHByb2R1Y3Qgc3RhdHVzIGZpZWxkLlxuICpcbiAqIEBzaW5jZSAgICAgIDMuMC4wXG4gKiBAcGFja2FnZSAgICB3Yy1hamF4LXByb2R1Y3QtZmlsdGVyXG4gKiBAc3VicGFja2FnZSB3Yy1hamF4LXByb2R1Y3QtZmlsdGVyL2FkbWluL3NyYy9qc1xuICogQGF1dGhvciAgICAgTWFpbnVsIEhhc3NhbiBNYWluXG4gKi9cblxualF1ZXJ5KCBkb2N1bWVudCApLnJlYWR5KCBmdW5jdGlvbigpIHtcblxuXHRjb25zdCB0YWJsZUlkZW50aWZpZXIgPSAnLnByb2R1Y3Qtc3RhdHVzLW9wdGlvbnMtdGFibGUnO1xuXHRjb25zdCB2YWx1ZUlkZW50aWZpZXIgPSAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLXByb2R1Y3Rfc3RhdHVzX29wdGlvbnMgaW5wdXQnO1xuXHRjb25zdCByb3dUZW1wbGF0ZUlkICAgPSAnd2NhcGYtcHJvZHVjdC1zdGF0dXMtb3B0aW9uJztcblxuXHRpbml0TWFudWFsT3B0aW9uc1RhYmxlKCB0YWJsZUlkZW50aWZpZXIsIHZhbHVlSWRlbnRpZmllciwgcm93VGVtcGxhdGVJZCApO1xuXG59ICk7XG4iLCIvKipcbiAqIFRoZSB0b2dnbGUgdmlzaWJpbGl0eSBzY3JpcHRzLlxuICpcbiAqIE5PVEU6IFRoZXNlIHNjcmlwdHMgbXVzdCBiZSBsb2NhdGVkIGF0IHRoZSB2ZXJ5IGJvdHRvbSBvZiB0aGUgY29tYmluZWQgc2NyaXB0cy5cbiAqXG4gKiBAc2luY2UgICAgICAzLjAuMFxuICogQHBhY2thZ2UgICAgd2MtYWpheC1wcm9kdWN0LWZpbHRlclxuICogQHN1YnBhY2thZ2Ugd2MtYWpheC1wcm9kdWN0LWZpbHRlci9hZG1pbi9zcmMvanNcbiAqIEBhdXRob3IgICAgIE1haW51bCBIYXNzYW4gTWFpblxuICovXG5cbmpRdWVyeSggZG9jdW1lbnQgKS5yZWFkeSggZnVuY3Rpb24oICQgKSB7XG5cblx0Y29uc3QgZmllbGRXcmFwcGVyID0gJCggJyNjaG9zZW5fZmllbGRfd3JhcHBlcicgKTtcblxuXHRjb25zdCBkZXBlbmRhbnREYXRhID0gW1xuXHRcdHtcblx0XHRcdCdoYW5kbGVyJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC12YWx1ZV90eXBlIHNlbGVjdCcsXG5cdFx0XHQnaGFuZGxlclR5cGUnOiAnc2VsZWN0Jyxcblx0XHRcdCdldmVudCc6ICdjaGFuZ2UnLFxuXHRcdFx0J2RlcGVuZGFudCc6IFtcblx0XHRcdFx0e1xuXHRcdFx0XHRcdCdzZWxlY3Rvcic6ICcuaW5wdXQtdHlwZS10ZXh0LWZpZWxkcycsXG5cdFx0XHRcdFx0J3ZhbHVlJzogWyAndGV4dCcgXSxcblx0XHRcdFx0fSxcblx0XHRcdFx0e1xuXHRcdFx0XHRcdCdzZWxlY3Rvcic6ICcuaW5wdXQtdHlwZS1udW1iZXItZmllbGRzJyxcblx0XHRcdFx0XHQndmFsdWUnOiBbICdudW1iZXInIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLmlucHV0LXR5cGUtZGF0ZS1maWVsZHMnLFxuXHRcdFx0XHRcdCd2YWx1ZSc6IFsgJ2RhdGUnIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLnZhbHVlLWRlY2ltYWwtZmllbGRzJyxcblx0XHRcdFx0XHQndmFsdWUnOiBbICdudW1iZXInIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRdLFxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0J2hhbmRsZXInOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLWRpc3BsYXlfdHlwZSBzZWxlY3QnLFxuXHRcdFx0J2hhbmRsZXJUeXBlJzogJ3NlbGVjdCcsXG5cdFx0XHQnZXZlbnQnOiAnY2hhbmdlJyxcblx0XHRcdCdkZXBlbmRhbnQnOiBbXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLXF1ZXJ5X3R5cGUnLFxuXHRcdFx0XHRcdCd2YWx1ZSc6IFsgJ2NoZWNrYm94JywgJ211bHRpLXNlbGVjdCcgXSxcblx0XHRcdFx0fSxcblx0XHRcdFx0e1xuXHRcdFx0XHRcdCdzZWxlY3Rvcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtYWxsX2l0ZW1zX2xhYmVsJyxcblx0XHRcdFx0XHQndmFsdWUnOiBbICdyYWRpbycsICdzZWxlY3QnIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLXVzZV9jaG9zZW4nLFxuXHRcdFx0XHRcdCd2YWx1ZSc6IFsgJ3NlbGVjdCcsICdtdWx0aS1zZWxlY3QnIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLXVzZV9jYXRlZ29yeV9pbWFnZXMnLFxuXHRcdFx0XHRcdCd2YWx1ZSc6IFsgJ2ltYWdlJyBdLFxuXHRcdFx0XHR9LFxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0J3NlbGVjdG9yJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1lbmFibGVfbXVsdGlwbGVfZmlsdGVyJyxcblx0XHRcdFx0XHQndmFsdWUnOiBbICdsYWJlbCcsICdjb2xvcicsICdpbWFnZScgXSxcblx0XHRcdFx0fSxcblx0XHRcdFx0e1xuXHRcdFx0XHRcdCdzZWxlY3Rvcic6ICcuY29sdW1uLWdyb3VwLWN1c3RvbV9hcHBlYXJhbmNlJyxcblx0XHRcdFx0XHQndmFsdWUnOiBbICdjb2xvcicsICdpbWFnZScgXSxcblx0XHRcdFx0fSxcblx0XHRcdF0sXG5cdFx0fSxcblx0XHR7XG5cdFx0XHQnaGFuZGxlcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtdXNlX2Nob3NlbiBpbnB1dCcsXG5cdFx0XHQnaGFuZGxlclR5cGUnOiAnY2hlY2tib3gnLFxuXHRcdFx0J2V2ZW50JzogJ2NoYW5nZScsXG5cdFx0XHQnZGVwZW5kYW50JzogW1xuXHRcdFx0XHR7XG5cdFx0XHRcdFx0J3NlbGVjdG9yJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1jaG9zZW5fbm9fcmVzdWx0c19tZXNzYWdlJyxcblx0XHRcdFx0XHQndmFsdWUnOiBbICcxJyBdLFxuXHRcdFx0XHR9LFxuXHRcdFx0XSxcblx0XHR9LFxuXHRcdHtcblx0XHRcdCdoYW5kbGVyJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1oaWVyYXJjaGljYWwgaW5wdXQnLFxuXHRcdFx0J2hhbmRsZXJUeXBlJzogJ2NoZWNrYm94Jyxcblx0XHRcdCdldmVudCc6ICdjaGFuZ2UnLFxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0J2hhbmRsZXInOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLXZhbHVlX2RlY2ltYWwgaW5wdXQnLFxuXHRcdFx0J2hhbmRsZXJUeXBlJzogJ2NoZWNrYm94Jyxcblx0XHRcdCdldmVudCc6ICdjaGFuZ2UnLFxuXHRcdFx0J2RlcGVuZGFudCc6IFtcblx0XHRcdFx0e1xuXHRcdFx0XHRcdCdzZWxlY3Rvcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtdmFsdWVfZGVjaW1hbF9wbGFjZXMnLFxuXHRcdFx0XHRcdCd2YWx1ZSc6IFsgJzEnIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRdLFxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0J2hhbmRsZXInOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLWdldF9vcHRpb25zIGlucHV0Jyxcblx0XHRcdCdoYW5kbGVyVHlwZSc6ICdyYWRpbycsXG5cdFx0XHQnZXZlbnQnOiAnY2hhbmdlJyxcblx0XHRcdCdkZXBlbmRhbnQnOiBbXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLmNvbHVtbi1ncm91cC1tZXRhX2tleV9tYW51YWxfb3B0aW9ucycsXG5cdFx0XHRcdFx0J3ZhbHVlJzogWyAnbWFudWFsX2VudHJ5JyBdLFxuXHRcdFx0XHR9LFxuXHRcdFx0XSxcblx0XHR9LFxuXHRcdHtcblx0XHRcdCdoYW5kbGVyJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1udW1iZXJfZGlzcGxheV90eXBlIHNlbGVjdCcsXG5cdFx0XHQnaGFuZGxlclR5cGUnOiAnc2VsZWN0Jyxcblx0XHRcdCdldmVudCc6ICdjaGFuZ2UnLFxuXHRcdFx0J2RlcGVuZGFudCc6IFtcblx0XHRcdFx0e1xuXHRcdFx0XHRcdCdzZWxlY3Rvcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtbnVtYmVyX3JhbmdlX3NsaWRlcl9kaXNwbGF5X3ZhbHVlc19hcycsXG5cdFx0XHRcdFx0J3ZhbHVlJzogWyAncmFuZ2Vfc2xpZGVyJyBdLFxuXHRcdFx0XHR9LFxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0J3NlbGVjdG9yJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1hbGlnbl92YWx1ZXNfYXRfdGhlX2VuZCcsXG5cdFx0XHRcdFx0J3ZhbHVlJzogWyAncmFuZ2Vfc2xpZGVyJyBdLFxuXHRcdFx0XHR9LFxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0J3NlbGVjdG9yJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1udW1iZXJfcmFuZ2VfcXVlcnlfdHlwZScsXG5cdFx0XHRcdFx0J3ZhbHVlJzogWyAncmFuZ2VfY2hlY2tib3gnLCAncmFuZ2VfbXVsdGlzZWxlY3QnIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLW51bWJlcl9yYW5nZV9zZWxlY3RfYWxsX2l0ZW1zX2xhYmVsJyxcblx0XHRcdFx0XHQndmFsdWUnOiBbICdyYW5nZV9yYWRpbycsICdyYW5nZV9zZWxlY3QnIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLW51bWJlcl9yYW5nZV91c2VfY2hvc2VuJyxcblx0XHRcdFx0XHQndmFsdWUnOiBbICdyYW5nZV9zZWxlY3QnLCAncmFuZ2VfbXVsdGlzZWxlY3QnIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLW51bWJlcl9yYW5nZV9lbmFibGVfbXVsdGlwbGVfZmlsdGVyJyxcblx0XHRcdFx0XHQndmFsdWUnOiBbICdyYW5nZV9sYWJlbCcgXSxcblx0XHRcdFx0fSxcblx0XHRcdFx0e1xuXHRcdFx0XHRcdCdzZWxlY3Rvcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtbnVtYmVyX3JhbmdlX3Nob3dfY291bnQnLFxuXHRcdFx0XHRcdCd2YWx1ZSc6IFsgJ3JhbmdlX2NoZWNrYm94JywgJ3JhbmdlX3JhZGlvJywgJ3JhbmdlX3NlbGVjdCcsICdyYW5nZV9tdWx0aXNlbGVjdCcsICdyYW5nZV9sYWJlbCcgXSxcblx0XHRcdFx0fSxcblx0XHRcdFx0e1xuXHRcdFx0XHRcdCdzZWxlY3Rvcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtbnVtYmVyX3JhbmdlX2hpZGVfZW1wdHknLFxuXHRcdFx0XHRcdCd2YWx1ZSc6IFsgJ3JhbmdlX2NoZWNrYm94JywgJ3JhbmdlX3JhZGlvJywgJ3JhbmdlX3NlbGVjdCcsICdyYW5nZV9tdWx0aXNlbGVjdCcsICdyYW5nZV9sYWJlbCcgXSxcblx0XHRcdFx0fSxcblx0XHRcdFx0e1xuXHRcdFx0XHRcdCdzZWxlY3Rvcic6ICcubnVtYmVyLWRlY2ltYWwtZmllbGRzJyxcblx0XHRcdFx0XHQndmFsdWUnOiBbICdyYW5nZV9zbGlkZXInLCAncmFuZ2VfY2hlY2tib3gnLCAncmFuZ2VfcmFkaW8nLCAncmFuZ2Vfc2VsZWN0JywgJ3JhbmdlX211bHRpc2VsZWN0JywgJ3JhbmdlX2xhYmVsJyBdLFxuXHRcdFx0XHR9LFxuXHRcdFx0XSxcblx0XHR9LFxuXHRcdHtcblx0XHRcdCdoYW5kbGVyJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1udW1iZXJfcmFuZ2VfdXNlX2Nob3NlbiBpbnB1dCcsXG5cdFx0XHQnaGFuZGxlclR5cGUnOiAnY2hlY2tib3gnLFxuXHRcdFx0J2V2ZW50JzogJ2NoYW5nZScsXG5cdFx0XHQnZGVwZW5kYW50JzogW1xuXHRcdFx0XHR7XG5cdFx0XHRcdFx0J3NlbGVjdG9yJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1udW1iZXJfcmFuZ2VfY2hvc2VuX25vX3Jlc3VsdHNfbWVzc2FnZScsXG5cdFx0XHRcdFx0J3ZhbHVlJzogWyAnMScgXSxcblx0XHRcdFx0fSxcblx0XHRcdF0sXG5cdFx0fSxcblx0XHR7XG5cdFx0XHQnaGFuZGxlcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtbnVtYmVyX2dldF9vcHRpb25zIGlucHV0Jyxcblx0XHRcdCdoYW5kbGVyVHlwZSc6ICdyYWRpbycsXG5cdFx0XHQnZXZlbnQnOiAnY2hhbmdlJyxcblx0XHRcdCdkZXBlbmRhbnQnOiBbXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLm51bWJlci1hdXRvbWF0aWMtb3B0aW9ucycsXG5cdFx0XHRcdFx0J3ZhbHVlJzogWyAnYXV0b21hdGljYWxseScgXSxcblx0XHRcdFx0fSxcblx0XHRcdFx0e1xuXHRcdFx0XHRcdCdzZWxlY3Rvcic6ICcubnVtYmVyLW1hbnVhbC1vcHRpb25zLXRhYmxlJyxcblx0XHRcdFx0XHQndmFsdWUnOiBbICdtYW51YWxfZW50cnknIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRdLFxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0J2hhbmRsZXInOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLWRhdGVfZGlzcGxheV90eXBlIHNlbGVjdCcsXG5cdFx0XHQnaGFuZGxlclR5cGUnOiAnc2VsZWN0Jyxcblx0XHRcdCdldmVudCc6ICdjaGFuZ2UnLFxuXHRcdFx0J2RlcGVuZGFudCc6IFtcblx0XHRcdFx0e1xuXHRcdFx0XHRcdCdzZWxlY3Rvcic6ICcuZGF0ZS10by11aS1vcHRpb25zJyxcblx0XHRcdFx0XHQndmFsdWUnOiBbICdpbnB1dF9kYXRlX3JhbmdlJyBdLFxuXHRcdFx0XHR9LFxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0J3NlbGVjdG9yJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1kYXRlX2Zvcm1hdCcsXG5cdFx0XHRcdFx0J3ZhbHVlJzogWyAnaW5wdXRfZGF0ZScsICdpbnB1dF9kYXRlX3JhbmdlJyBdLFxuXHRcdFx0XHR9LFxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0J3NlbGVjdG9yJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1zaG93X2RhdGVfaW5wdXRzX2lubGluZScsXG5cdFx0XHRcdFx0J3ZhbHVlJzogWyAnaW5wdXRfZGF0ZV9yYW5nZScgXSxcblx0XHRcdFx0fSxcblx0XHRcdFx0e1xuXHRcdFx0XHRcdCdzZWxlY3Rvcic6ICcuZGF0ZS1waWNrZXItZmllbGRzJyxcblx0XHRcdFx0XHQndmFsdWUnOiBbICdpbnB1dF9kYXRlJywgJ2lucHV0X2RhdGVfcmFuZ2UnIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLXRpbWVfcGVyaW9kX3F1ZXJ5X3R5cGUnLFxuXHRcdFx0XHRcdCd2YWx1ZSc6IFsgJ3RpbWVfcGVyaW9kX2NoZWNrYm94JywgJ3RpbWVfcGVyaW9kX211bHRpc2VsZWN0JyBdLFxuXHRcdFx0XHR9LFxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0J3NlbGVjdG9yJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC10aW1lX3BlcmlvZF9zZWxlY3RfYWxsX2l0ZW1zX2xhYmVsJyxcblx0XHRcdFx0XHQndmFsdWUnOiBbICd0aW1lX3BlcmlvZF9yYWRpbycsICd0aW1lX3BlcmlvZF9zZWxlY3QnIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLXRpbWVfcGVyaW9kX3VzZV9jaG9zZW4nLFxuXHRcdFx0XHRcdCd2YWx1ZSc6IFsgJ3RpbWVfcGVyaW9kX3NlbGVjdCcsICd0aW1lX3BlcmlvZF9tdWx0aXNlbGVjdCcgXSxcblx0XHRcdFx0fSxcblx0XHRcdFx0e1xuXHRcdFx0XHRcdCdzZWxlY3Rvcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtdGltZV9wZXJpb2RfZW5hYmxlX211bHRpcGxlX2ZpbHRlcicsXG5cdFx0XHRcdFx0J3ZhbHVlJzogWyAndGltZV9wZXJpb2RfbGFiZWwnIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLXRpbWVfcGVyaW9kX3Nob3dfY291bnQnLFxuXHRcdFx0XHRcdCd2YWx1ZSc6IFsgJ3RpbWVfcGVyaW9kX2NoZWNrYm94JywgJ3RpbWVfcGVyaW9kX3JhZGlvJywgJ3RpbWVfcGVyaW9kX3NlbGVjdCcsICd0aW1lX3BlcmlvZF9tdWx0aXNlbGVjdCcsICd0aW1lX3BlcmlvZF9sYWJlbCcgXSxcblx0XHRcdFx0fSxcblx0XHRcdFx0e1xuXHRcdFx0XHRcdCdzZWxlY3Rvcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtdGltZV9wZXJpb2RfaGlkZV9lbXB0eScsXG5cdFx0XHRcdFx0J3ZhbHVlJzogWyAndGltZV9wZXJpb2RfY2hlY2tib3gnLCAndGltZV9wZXJpb2RfcmFkaW8nLCAndGltZV9wZXJpb2Rfc2VsZWN0JywgJ3RpbWVfcGVyaW9kX211bHRpc2VsZWN0JywgJ3RpbWVfcGVyaW9kX2xhYmVsJyBdLFxuXHRcdFx0XHR9LFxuXHRcdFx0XSxcblx0XHR9LFxuXHRcdHtcblx0XHRcdCdoYW5kbGVyJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC10aW1lX3BlcmlvZF91c2VfY2hvc2VuIGlucHV0Jyxcblx0XHRcdCdoYW5kbGVyVHlwZSc6ICdjaGVja2JveCcsXG5cdFx0XHQnZXZlbnQnOiAnY2hhbmdlJyxcblx0XHRcdCdkZXBlbmRhbnQnOiBbXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLXRpbWVfcGVyaW9kX2Nob3Nlbl9ub19yZXN1bHRzX21lc3NhZ2UnLFxuXHRcdFx0XHRcdCd2YWx1ZSc6IFsgJzEnIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRdLFxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0J2hhbmRsZXInOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLWVuYWJsZV9zb2Z0X2xpbWl0IGlucHV0Jyxcblx0XHRcdCdoYW5kbGVyVHlwZSc6ICdyYWRpbycsXG5cdFx0XHQnZXZlbnQnOiAnY2hhbmdlJyxcblx0XHRcdCdkZXBlbmRhbnQnOiBbXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLXNvZnRfbGltaXQnLFxuXHRcdFx0XHRcdCd2YWx1ZSc6IFsgJ2VuYWJsZScgXSxcblx0XHRcdFx0fSxcblx0XHRcdF0sXG5cdFx0fSxcblx0XHR7XG5cdFx0XHQnaGFuZGxlcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtdGF4b25vbXkgc2VsZWN0Jyxcblx0XHRcdCdoYW5kbGVyVHlwZSc6ICdzZWxlY3QnLFxuXHRcdFx0J2V2ZW50JzogJ2NoYW5nZScsXG5cdFx0fSxcblx0XHR7XG5cdFx0XHQnaGFuZGxlcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtY3VzdG9tLXRheG9ub215IHNlbGVjdCcsXG5cdFx0XHQnaGFuZGxlclR5cGUnOiAnc2VsZWN0Jyxcblx0XHRcdCdldmVudCc6ICdjaGFuZ2UnLFxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0J2hhbmRsZXInOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLW1ldGFfa2V5IHNlbGVjdCcsXG5cdFx0XHQnaGFuZGxlclR5cGUnOiAnc2VsZWN0Jyxcblx0XHRcdCdldmVudCc6ICdjaGFuZ2UnLFxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0J2hhbmRsZXInOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLXBvc3RfcHJvcGVydHkgc2VsZWN0Jyxcblx0XHRcdCdoYW5kbGVyVHlwZSc6ICdzZWxlY3QnLFxuXHRcdFx0J2V2ZW50JzogJ2NoYW5nZScsXG5cdFx0fSxcblx0XHR7XG5cdFx0XHQnaGFuZGxlcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtbGltaXRfb3B0aW9ucyBzZWxlY3QnLFxuXHRcdFx0J2hhbmRsZXJUeXBlJzogJ3NlbGVjdCcsXG5cdFx0XHQnZXZlbnQnOiAnY2hhbmdlJyxcblx0XHRcdCdkZXBlbmRhbnQnOiBbXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLXBhcmVudF90ZXJtJyxcblx0XHRcdFx0XHQndmFsdWUnOiBbICdjaGlsZCcgXSxcblx0XHRcdFx0fSxcblx0XHRcdFx0e1xuXHRcdFx0XHRcdCdzZWxlY3Rvcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtbGltaXRfdmFsdWVzX2J5X2lkJyxcblx0XHRcdFx0XHQndmFsdWUnOiBbICdpbmNsdWRlJyBdLFxuXHRcdFx0XHR9LFxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0J3NlbGVjdG9yJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1leGNsdWRlX3ZhbHVlc19pZCcsXG5cdFx0XHRcdFx0J3ZhbHVlJzogWyAnZXhjbHVkZScgXSxcblx0XHRcdFx0fSxcblx0XHRcdF0sXG5cdFx0fSxcblx0XHR7XG5cdFx0XHQnaGFuZGxlcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtZW5hYmxlX2FjY29yZGlvbiBpbnB1dCcsXG5cdFx0XHQnaGFuZGxlclR5cGUnOiAnY2hlY2tib3gnLFxuXHRcdFx0J2V2ZW50JzogJ2NoYW5nZScsXG5cdFx0XHQnZGVwZW5kYW50JzogW1xuXHRcdFx0XHR7XG5cdFx0XHRcdFx0J3NlbGVjdG9yJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1hY2NvcmRpb25fZGVmYXVsdF9zdGF0ZScsXG5cdFx0XHRcdFx0J3ZhbHVlJzogWyAnMScgXSxcblx0XHRcdFx0fSxcblx0XHRcdFx0e1xuXHRcdFx0XHRcdCdzZWxlY3Rvcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtbW92ZV9jbGVhcl9maWx0ZXJzX2J1dHRvbl9pbl9hY2NvcmRpb25faGVhZGluZycsXG5cdFx0XHRcdFx0J3ZhbHVlJzogWyAnMScgXSxcblx0XHRcdFx0fSxcblx0XHRcdF0sXG5cdFx0fSxcblx0XHR7XG5cdFx0XHQnaGFuZGxlcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtZW5hYmxlX211bHRpcGxlX2ZpbHRlciBpbnB1dCcsXG5cdFx0XHQnaGFuZGxlclR5cGUnOiAnY2hlY2tib3gnLFxuXHRcdFx0J2V2ZW50JzogJ2NoYW5nZScsXG5cdFx0fSxcblx0XHR7XG5cdFx0XHQnaGFuZGxlcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtdXNlX2NhdGVnb3J5X2ltYWdlcyBpbnB1dCcsXG5cdFx0XHQnaGFuZGxlclR5cGUnOiAnY2hlY2tib3gnLFxuXHRcdFx0J2V2ZW50JzogJ2NoYW5nZScsXG5cdFx0fSxcblx0XHR7XG5cdFx0XHQnaGFuZGxlcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtbnVtYmVyX3JhbmdlX2VuYWJsZV9tdWx0aXBsZV9maWx0ZXIgaW5wdXQnLFxuXHRcdFx0J2hhbmRsZXJUeXBlJzogJ2NoZWNrYm94Jyxcblx0XHRcdCdldmVudCc6ICdjaGFuZ2UnLFxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0J2hhbmRsZXInOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLXRpbWVfcGVyaW9kX2VuYWJsZV9tdWx0aXBsZV9maWx0ZXIgaW5wdXQnLFxuXHRcdFx0J2hhbmRsZXJUeXBlJzogJ2NoZWNrYm94Jyxcblx0XHRcdCdldmVudCc6ICdjaGFuZ2UnLFxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0J2hhbmRsZXInOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLXNob3dfaWZfZW1wdHkgaW5wdXQnLFxuXHRcdFx0J2hhbmRsZXJUeXBlJzogJ2NoZWNrYm94Jyxcblx0XHRcdCdldmVudCc6ICdjaGFuZ2UnLFxuXHRcdFx0J2RlcGVuZGFudCc6IFtcblx0XHRcdFx0e1xuXHRcdFx0XHRcdCdzZWxlY3Rvcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtZW1wdHlfZmlsdGVyX21lc3NhZ2UnLFxuXHRcdFx0XHRcdCd2YWx1ZSc6IFsgJzEnIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRdLFxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0J2hhbmRsZXInOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLXNob3dfdGl0bGUgaW5wdXQnLFxuXHRcdFx0J2hhbmRsZXJUeXBlJzogJ2NoZWNrYm94Jyxcblx0XHRcdCdldmVudCc6ICdjaGFuZ2UnLFxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0J2hhbmRsZXInOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLW9yZGVyX3Rlcm1zX2J5IHNlbGVjdCcsXG5cdFx0XHQnaGFuZGxlclR5cGUnOiAnc2VsZWN0Jyxcblx0XHRcdCdldmVudCc6ICdjaGFuZ2UnLFxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0J2hhbmRsZXInOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLWVuYWJsZV9hY3RpdmVfZmlsdGVyc19zb2Z0X2xpbWl0IGlucHV0Jyxcblx0XHRcdCdoYW5kbGVyVHlwZSc6ICdyYWRpbycsXG5cdFx0XHQnZXZlbnQnOiAnY2hhbmdlJyxcblx0XHRcdCdkZXBlbmRhbnQnOiBbXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLmFjdGl2ZS1maWx0ZXJzLXNvZnQtbGltaXQtZmllbGRzJyxcblx0XHRcdFx0XHQndmFsdWUnOiBbICdlbmFibGUnIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRdLFxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0J2hhbmRsZXInOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLWFjdGl2ZV9maWx0ZXJzX2xheW91dCBpbnB1dCcsXG5cdFx0XHQnaGFuZGxlclR5cGUnOiAncmFkaW8nLFxuXHRcdFx0J2V2ZW50JzogJ2NoYW5nZScsXG5cdFx0XHQnZGVwZW5kYW50JzogW1xuXHRcdFx0XHR7XG5cdFx0XHRcdFx0J3NlbGVjdG9yJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1zb2Z0X2xpbWl0Jyxcblx0XHRcdFx0XHQndmFsdWUnOiBbICdzaW1wbGUnIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLXNvZnRfbGltaXRfZmlsdGVyX2dyb3VwcycsXG5cdFx0XHRcdFx0J3ZhbHVlJzogWyAnZXh0ZW5kZWQnIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRdLFxuXHRcdH0sXG5cdF07XG5cblx0ZnVuY3Rpb24gX2hhbmRsZVRvZ2dsZVJlcXVlc3QoIGRhdGEsIGN1cnJlbnRTZWxlY3RvciwgdmFsdWUgKSB7XG5cdFx0Y29uc3QgJGZpZWxkICAgICAgPSBjdXJyZW50U2VsZWN0b3IuY2xvc2VzdCggJy53Y2FwZi1mb3JtLWZpZWxkJyApO1xuXHRcdGNvbnN0IGhhbmRsZXIgICAgID0gZGF0YVsgJ2hhbmRsZXInIF07XG5cdFx0Y29uc3QgaGFuZGxlclR5cGUgPSBkYXRhWyAnaGFuZGxlclR5cGUnIF07XG5cdFx0Y29uc3QgZGVwZW5kYW50ICAgPSBkYXRhWyAnZGVwZW5kYW50JyBdO1xuXG5cdFx0bGV0IF92YWx1ZSA9IHZhbHVlO1xuXG5cdFx0aWYgKCAnY2hlY2tib3gnID09PSBoYW5kbGVyVHlwZSApIHtcblx0XHRcdF92YWx1ZSA9IGN1cnJlbnRTZWxlY3Rvci5pcyggJzpjaGVja2VkJyApID8gJzEnIDogJzAnO1xuXHRcdH1cblxuXHRcdGlmICggJ3JhZGlvJyA9PT0gaGFuZGxlclR5cGUgKSB7XG5cdFx0XHRfdmFsdWUgPSAkZmllbGQuZmluZCggaGFuZGxlciArICc6Y2hlY2tlZCcgKS52YWwoKTtcblx0XHR9XG5cblx0XHQkLmVhY2goIGRlcGVuZGFudCwgZnVuY3Rpb24oIGlkLCBkICkge1xuXHRcdFx0Y29uc3QgJHNlbGVjdG9yICAgPSAkZmllbGQuZmluZCggZFsgJ3NlbGVjdG9yJyBdICk7XG5cdFx0XHRjb25zdCB2YWxpZFZhbHVlcyA9IGRbICd2YWx1ZScgXTtcblxuXHRcdFx0aWYgKCB2YWxpZFZhbHVlcy5pbmNsdWRlcyggX3ZhbHVlICkgKSB7XG5cdFx0XHRcdCRzZWxlY3Rvci5zaG93KCk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHQkc2VsZWN0b3IuaGlkZSgpO1xuXHRcdFx0fVxuXHRcdH0gKTtcblxuXHRcdGZpZWxkV3JhcHBlci50cmlnZ2VyKCAnYWZ0ZXJfdG9nZ2xlX3JlcXVlc3QnLCBbIGhhbmRsZXIsIF92YWx1ZSwgJGZpZWxkIF0gKTtcblx0fVxuXG5cdGZ1bmN0aW9uIGhhbmRsZVRvZ2dsZVJlcXVlc3QoIGRhdGEsIGN1cnJlbnRTZWxlY3RvciwgdmFsdWUgKSB7XG5cdFx0aWYgKCBudWxsID09PSBjdXJyZW50U2VsZWN0b3IgKSB7XG5cdFx0XHRjb25zdCBoYW5kbGVyICA9IGRhdGFbICdoYW5kbGVyJyBdO1xuXHRcdFx0Y29uc3QgJGhhbmRsZXIgPSAkKCBoYW5kbGVyICk7XG5cblx0XHRcdCQuZWFjaCggJGhhbmRsZXIsIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRjb25zdCBfdGhpcyAgPSAkKCB0aGlzICk7XG5cdFx0XHRcdGNvbnN0IF92YWx1ZSA9IF90aGlzLnZhbCgpO1xuXHRcdFx0XHRfaGFuZGxlVG9nZ2xlUmVxdWVzdCggZGF0YSwgX3RoaXMsIF92YWx1ZSApO1xuXHRcdFx0fSApO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRfaGFuZGxlVG9nZ2xlUmVxdWVzdCggZGF0YSwgY3VycmVudFNlbGVjdG9yLCB2YWx1ZSApO1xuXHRcdH1cblx0fVxuXG5cdGZ1bmN0aW9uIHNldHVwRmllbGQoIGluaXRhbCA9IGZhbHNlICkge1xuXHRcdCQuZWFjaCggZGVwZW5kYW50RGF0YSwgZnVuY3Rpb24oIGksIGRhdGEgKSB7XG5cdFx0XHRjb25zdCBoYW5kbGVyID0gZGF0YVsgJ2hhbmRsZXInIF07XG5cdFx0XHRjb25zdCBldmVudCAgID0gZGF0YVsgJ2V2ZW50JyBdO1xuXG5cdFx0XHRoYW5kbGVUb2dnbGVSZXF1ZXN0KCBkYXRhLCBudWxsLCBudWxsICk7XG5cblx0XHRcdGlmICggaW5pdGFsICkge1xuXHRcdFx0XHRmaWVsZFdyYXBwZXIub24oIGV2ZW50LCBoYW5kbGVyLCBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHRjb25zdCBfdGhpcyAgPSAkKCB0aGlzICk7XG5cdFx0XHRcdFx0Y29uc3QgX3ZhbHVlID0gJCggdGhpcyApLnZhbCgpO1xuXHRcdFx0XHRcdGhhbmRsZVRvZ2dsZVJlcXVlc3QoIGRhdGEsIF90aGlzLCBfdmFsdWUgKTtcblx0XHRcdFx0fSApO1xuXG5cdFx0XHRcdGlmICggISAkKCBmaWVsZFdyYXBwZXIgKS5oYXNDbGFzcyggJ2xvYWRlZCcgKSApIHtcblx0XHRcdFx0XHQkKCBmaWVsZFdyYXBwZXIgKS5hZGRDbGFzcyggJ2xvYWRlZCcgKTtcblxuXHRcdFx0XHRcdGZpZWxkV3JhcHBlci50cmlnZ2VyKCAnZmllbGRfYWRkZWQnICk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9ICk7XG5cdH1cblxuXHRzZXR1cEZpZWxkKCB0cnVlICk7XG5cblx0ZmllbGRXcmFwcGVyLm9uKCAnZmllbGRfYWRkZWQnLCBmdW5jdGlvbigpIHtcblx0XHQvLyBUb2dnbGUgdGhlIHZpc2liaWxpdHkgb2Ygc3ViZmllbGRzLlxuXHRcdHNldHVwRmllbGQoKTtcblx0fSApO1xuXG59ICk7XG4iXX0=
