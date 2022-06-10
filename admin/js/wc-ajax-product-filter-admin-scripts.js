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
  var fieldWrapper = $('#chosen_field_wrapper'); // Override no-results-message, all-items-label field's toggle visibility when text display type is changed.

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
  var fieldInput = '[name]:not(.manual_options):not(.field_key)';
  var fieldStates = {};
  var typesHavingSeparateFieldKeys = {
    'attribute': '.wcapf-form-sub-field-taxonomy select',
    'custom-taxonomy': '.wcapf-form-sub-field-taxonomy select',
    'post-meta': '.wcapf-form-sub-field-meta_key select',
    'post-property': '.wcapf-form-sub-field-post_property select'
  };

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
    }); // Handle filter keys.

    if (fieldWrapper.find('.field_key').length) {
      if (fieldType in typesHavingSeparateFieldKeys) {
        var $fieldKeyInput = fieldWrapper.find(typesHavingSeparateFieldKeys[fieldType]);
        var fieldKeyFor = $fieldKeyInput.val();
        var fieldKeys = {};

        if (fieldKeyFor) {
          fieldKeys[fieldKeyFor] = fieldKeyFor;
        } else {
          fieldKeys['default'] = fieldWrapper.find('.field_key').val();
        }

        fieldValues['field_key'] = fieldKeys;
      } else {
        fieldValues['field_key'] = fieldWrapper.find('.field_key').val();
      }
    } // Handle manual options.


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

    if ($elm.hasClass('field_key')) {
      if (fieldType in typesHavingSeparateFieldKeys) {
        var $fieldKeyInput = fieldWrapper.find(typesHavingSeparateFieldKeys[fieldType]);
        var fieldKeyFor = $fieldKeyInput.val();

        if (fieldKeyFor) {
          fieldState['field_key'][fieldKeyFor] = value;
        } else {
          fieldState['field_key']['default'] = value;
        }
      } else {
        fieldState['field_key'] = fieldWrapper.find('.field_key').val();
      }
    } else if ($elm.hasClass('manual_options')) {
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
    }); // Process filter keys.

    var $filterKey = fieldWrapper.find('.field_key');

    if ($filterKey.length) {
      if (fieldType in typesHavingSeparateFieldKeys) {
        var $fieldKeyInput = fieldWrapper.find(typesHavingSeparateFieldKeys[fieldType]);
        var fieldKeyFor = $fieldKeyInput.val();

        if (fieldKeyFor) {
          $filterKey.val(fieldState['field_key'][fieldKeyFor]);
        } else {
          $filterKey.val(fieldState['field_key']['default']);
        }
      } else {
        $filterKey.val(fieldState['field_key']);
      }
    } // Process the manual options.


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
  }); // Update the filter key.

  fieldWrapper.on('after_toggle_request', function (e, handler, fieldKeyFor, $field) {
    if (Object.values(typesHavingSeparateFieldKeys).includes(handler)) {
      var fieldType = $field.closest('[data-field-type]').attr('data-field-type');
      var fieldState = fieldStates[fieldType];
      var fieldKeys = fieldState['field_key'];
      var $fieldKey = $field.find('.wcapf-form-sub-field-field_key input[type="text"]');
      var defaultKey = $fieldKey.attr('data-default-field-key');

      var _fieldKey;

      if (!fieldKeyFor) {
        fieldKeyFor = 'default';
        _fieldKey = defaultKey;
      } else {
        // Prepend dash to avoid conflicting with the registered taxonomies and post types.
        _fieldKey = '_' + fieldKeyFor;
      }

      var fieldKey;

      if (fieldKeyFor in fieldKeys) {
        fieldKey = fieldKeys[fieldKeyFor];
      } else {
        fieldKey = _fieldKey;
      }

      $fieldKey.val(fieldKey).trigger('change');
    }
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
      'selector': '.hierarchical-fields',
      'value': ['checkbox', 'radio', 'select', 'multi-select']
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
    'event': 'change',
    'dependant': [{
      'selector': '.wcapf-form-sub-field-enable_hierarchy_accordion',
      'value': ['1']
    }]
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
      'value': ['include', 'exclude']
    }]
  }, {
    'handler': '.wcapf-form-sub-field-enable_accordion input',
    'handlerType': 'checkbox',
    'event': 'change',
    'dependant': [{
      'selector': '.wcapf-form-sub-field-accordion_default_state',
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImN1c3RvbS1hcHBlYXJhbmNlLWZpZWxkcy5qcyIsImRpc3BsYXktdHlwZS1maWVsZHMuanMiLCJmaWVsZC1tZXRhLWJveC5qcyIsIm1hbnVhbC1vcHRpb25zLXRhYmxlLmpzIiwibnVtYmVyLXVpLW9wdGlvbnMuanMiLCJwcm9kdWN0LXN0YXR1cy10YWJsZS5qcyIsInRvZ2dsZVZpc2liaWxpdHkuanMiXSwibmFtZXMiOlsialF1ZXJ5IiwiZG9jdW1lbnQiLCJyZWFkeSIsIiQiLCJmaWVsZFdyYXBwZXIiLCJvbiIsImUiLCJoYW5kbGVyIiwidmFsdWUiLCIkZmllbGQiLCIkcXVlcnlUeXBlIiwiZmluZCIsInZhbGlkRGlzcGxheVR5cGVzIiwiaW5jbHVkZXMiLCIkbXVsdGlwbGVGaWx0ZXIiLCJpcyIsInNob3ciLCJoaWRlIiwiJGRpc3BsYXlUeXBlIiwiZGlzcGxheVR5cGUiLCJ2YWwiLCIkbm9SZXN1bHRzIiwiJGFsbEl0ZW1zTGFiZWwiLCJ1c2VDaG9zZW4iLCJmaWVsZElucHV0IiwiZmllbGRTdGF0ZXMiLCJ0eXBlc0hhdmluZ1NlcGFyYXRlRmllbGRLZXlzIiwic3RvcmVGaWVsZFN0YXRlIiwiZmllbGRUeXBlIiwiYXR0ciIsImZpZWxkVmFsdWVzIiwiZWFjaCIsIiRpbnB1dCIsInR5cGUiLCJuYW1lIiwibGVuZ3RoIiwiJGZpZWxkS2V5SW5wdXQiLCJmaWVsZEtleUZvciIsImZpZWxkS2V5cyIsIm1hbnVhbE9wdGlvbnMiLCJ1cGRhdGVGaWVsZFN0YXRlIiwiJGVsbSIsImZpZWxkU3RhdGUiLCJoYXNDbGFzcyIsIm1hbnVhbF9vcHRpb25zIiwiJHRoaXMiLCJhcHBseUZpZWxkU3RhdGUiLCJyZW1vdmVBdHRyIiwiJGZpbHRlcktleSIsInJhd09wdGlvbnMiLCJpbnB1dE5hbWUiLCJyYXciLCIkcmF3SW5wdXQiLCJKU09OIiwicGFyc2UiLCJkZWNvZGVVUklDb21wb25lbnQiLCJ0YWJsZUlkZW50aWZpZXIiLCJyb3dUZW1wbGF0ZUlkIiwicm93c0lkZW50aWZpZXIiLCJyb3dJZGVudGlmaWVyIiwiJHRhYmxlIiwiJHJvd3MiLCJpIiwib3B0aW9uIiwidGVtcGxhdGUiLCJ3cCIsInJvd0RlZmF1bHRPcHRpb25zIiwicmVuZGVyZWQiLCJhcHBlbmQiLCIkbGFzdFJvdyIsImxhc3QiLCJhZGRDbGFzcyIsInRyaWdnZXIiLCJfZmllbGRUeXBlIiwiZmllbGROYW1lIiwiZmllbGREYXRhV3JhcHBlciIsImZpZWxkTmFtZVdyYXBwZXIiLCJmaWVsZEluc2lkZSIsInJlbW92ZUNsYXNzIiwiaHRtbCIsIk9iamVjdCIsInZhbHVlcyIsImNsb3Nlc3QiLCIkZmllbGRLZXkiLCJkZWZhdWx0S2V5IiwiX2ZpZWxkS2V5IiwiZmllbGRLZXkiLCJpbml0TWFudWFsT3B0aW9uc1RhYmxlIiwidmFsdWVJZGVudGlmaWVyIiwiZmllbGRJZGVudGlmaWVyIiwiaW5pdFNvcnRhYmxlVGFibGUiLCIkc2VsZWN0b3IiLCJzb3J0YWJsZSIsIm9wYWNpdHkiLCJyZXZlcnQiLCJjdXJzb3IiLCJheGlzIiwiaGFuZGxlIiwicGxhY2Vob2xkZXIiLCJ1cGRhdGUiLCJ0YXJnZXQiLCJ0cmlnZ2VyT3B0aW9uc0NoYW5nZSIsImRpc2FibGVTZWxlY3Rpb24iLCJ0YWJsZVJvd3NJZGVudGlmaWVyIiwiJHZhbHVlSG9sZGVyIiwiX3Jvd3MiLCJfaXRlbSIsIiRpdGVtIiwib2JqIiwiZmllbGRJbmRleCIsImZpZWxkIiwicHVzaCIsInJhd1ZhbHVlcyIsImVuY29kZVVSSUNvbXBvbmVudCIsInN0cmluZ2lmeSIsInRyaWdnZXJSZW1vdmVPcHRpb24iLCIkb3B0aW9uc1RhYmxlIiwidGFibGVSb3dzIiwiY2hpbGRyZW4iLCJyZW1vdmVCdG5JZGVudGlmaWVyIiwicmVtb3ZlIiwiY2xlYXJPcHRpb25zQnRuSWRlbnRpZmllciIsImVtcHR5IiwiYWRkT3B0aW9uQnRuSWRlbnRpZmllciIsInRleHRGaWVsZHNJZGVudGlmaWVyIiwic2VsZWN0RmllbGRzSWRlbnRpZmllciIsInRhYmxlSWQiLCJ0b2dnbGVOdW1iZXJNaW5WYWx1ZUZpZWxkIiwiJHRleHRGaWVsZCIsInRvZ2dsZU51bWJlck1heFZhbHVlRmllbGQiLCJkZXBlbmRhbnREYXRhIiwiX2hhbmRsZVRvZ2dsZVJlcXVlc3QiLCJkYXRhIiwiY3VycmVudFNlbGVjdG9yIiwiaGFuZGxlclR5cGUiLCJkZXBlbmRhbnQiLCJfdmFsdWUiLCJpZCIsImQiLCJ2YWxpZFZhbHVlcyIsImhhbmRsZVRvZ2dsZVJlcXVlc3QiLCIkaGFuZGxlciIsIl90aGlzIiwic2V0dXBGaWVsZCIsImluaXRhbCIsImV2ZW50Il0sIm1hcHBpbmdzIjoiOztBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQUEsTUFBTSxDQUFFQyxRQUFGLENBQU4sQ0FBbUJDLEtBQW5CLENBQTBCLFVBQVVDLENBQVYsRUFBYztBQUV2QyxNQUFNQyxZQUFZLEdBQUdELENBQUMsQ0FBRSx1QkFBRixDQUF0QjtBQUVBQyxFQUFBQSxZQUFZLENBQUNDLEVBQWIsQ0FBaUIsc0JBQWpCLEVBQXlDLFVBQVVDLENBQVYsRUFBYUMsT0FBYixFQUFzQkMsS0FBdEIsRUFBNkJDLE1BQTdCLEVBQXNDO0FBQzlFLFFBQUssZ0RBQWdERixPQUFyRCxFQUErRDtBQUM5RCxVQUFNRyxVQUFVLEdBQVVELE1BQU0sQ0FBQ0UsSUFBUCxDQUFhLGtDQUFiLENBQTFCO0FBQ0EsVUFBTUMsaUJBQWlCLEdBQUcsQ0FBRSxPQUFGLEVBQVcsT0FBWCxFQUFvQixPQUFwQixDQUExQjs7QUFFQSxVQUFLQSxpQkFBaUIsQ0FBQ0MsUUFBbEIsQ0FBNEJMLEtBQTVCLENBQUwsRUFBMkM7QUFDMUMsWUFBTU0sZUFBZSxHQUFHTCxNQUFNLENBQUNFLElBQVAsQ0FBYSxvREFBYixDQUF4Qjs7QUFFQSxZQUFLRyxlQUFlLENBQUNDLEVBQWhCLENBQW9CLFVBQXBCLENBQUwsRUFBd0M7QUFDdkNMLFVBQUFBLFVBQVUsQ0FBQ00sSUFBWDtBQUNBLFNBRkQsTUFFTztBQUNOTixVQUFBQSxVQUFVLENBQUNP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LEdBQVYsRUFBZjs7QUFDQXdILFVBQUFBLG1CQUFtQixDQUFFUixJQUFGLEVBQVFVLEtBQVIsRUFBZU4sTUFBZixDQUFuQjtBQUNBLFNBSkQ7O0FBTUEsWUFBSyxDQUFFckksQ0FBQyxDQUFFQyxZQUFGLENBQUQsQ0FBa0J1QyxRQUFsQixDQUE0QixRQUE1QixDQUFQLEVBQWdEO0FBQy9DeEMsVUFBQUEsQ0FBQyxDQUFFQyxZQUFGLENBQUQsQ0FBa0JtRSxRQUFsQixDQUE0QixRQUE1QjtBQUVBbkUsVUFBQUEsWUFBWSxDQUFDb0UsT0FBYixDQUFzQixhQUF0QjtBQUNBO0FBQ0Q7QUFDRCxLQW5CRDtBQW9CQTs7QUFFRHVFLEVBQUFBLFVBQVUsQ0FBRSxJQUFGLENBQVY7QUFFQTNJLEVBQUFBLFlBQVksQ0FBQ0MsRUFBYixDQUFpQixhQUFqQixFQUFnQyxZQUFXO0FBQzFDO0FBQ0EwSSxJQUFBQSxVQUFVO0FBQ1YsR0FIRDtBQUtBLENBNVlEIiwiZmlsZSI6IndjLWFqYXgtcHJvZHVjdC1maWx0ZXItYWRtaW4tc2NyaXB0cy5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogRGlzcGxheSB0eXBlIGZpZWxkcy5cbiAqXG4gKiBAc2luY2UgICAgICAzLjAuMFxuICogQHBhY2thZ2UgICAgd2MtYWpheC1wcm9kdWN0LWZpbHRlclxuICogQHN1YnBhY2thZ2Ugd2MtYWpheC1wcm9kdWN0LWZpbHRlci9hZG1pbi9zcmMvanNcbiAqIEBhdXRob3IgICAgIE1haW51bCBIYXNzYW4gTWFpblxuICovXG5cbmpRdWVyeSggZG9jdW1lbnQgKS5yZWFkeSggZnVuY3Rpb24oICQgKSB7XG5cblx0Y29uc3QgZmllbGRXcmFwcGVyID0gJCggJyNjaG9zZW5fZmllbGRfd3JhcHBlcicgKTtcblxuXHRmaWVsZFdyYXBwZXIub24oICdhZnRlcl90b2dnbGVfcmVxdWVzdCcsIGZ1bmN0aW9uKCBlLCBoYW5kbGVyLCB2YWx1ZSwgJGZpZWxkICkge1xuXHRcdGlmICggJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1kaXNwbGF5X3R5cGUgc2VsZWN0JyA9PT0gaGFuZGxlciApIHtcblx0XHRcdGNvbnN0ICRxdWVyeVR5cGUgICAgICAgID0gJGZpZWxkLmZpbmQoICcud2NhcGYtZm9ybS1zdWItZmllbGQtcXVlcnlfdHlwZScgKTtcblx0XHRcdGNvbnN0IHZhbGlkRGlzcGxheVR5cGVzID0gWyAnbGFiZWwnLCAnY29sb3InLCAnaW1hZ2UnIF07XG5cblx0XHRcdGlmICggdmFsaWREaXNwbGF5VHlwZXMuaW5jbHVkZXMoIHZhbHVlICkgKSB7XG5cdFx0XHRcdGNvbnN0ICRtdWx0aXBsZUZpbHRlciA9ICRmaWVsZC5maW5kKCAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLWVuYWJsZV9tdWx0aXBsZV9maWx0ZXIgaW5wdXQnICk7XG5cblx0XHRcdFx0aWYgKCAkbXVsdGlwbGVGaWx0ZXIuaXMoICc6Y2hlY2tlZCcgKSApIHtcblx0XHRcdFx0XHQkcXVlcnlUeXBlLnNob3coKTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHQkcXVlcnlUeXBlLmhpZGUoKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0fSApO1xuXG5cdGZpZWxkV3JhcHBlci5vbiggJ2FmdGVyX3RvZ2dsZV9yZXF1ZXN0JywgZnVuY3Rpb24oIGUsIGhhbmRsZXIsIHZhbHVlLCAkZmllbGQgKSB7XG5cdFx0aWYgKCAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLWVuYWJsZV9tdWx0aXBsZV9maWx0ZXIgaW5wdXQnID09PSBoYW5kbGVyICkge1xuXHRcdFx0Y29uc3QgJHF1ZXJ5VHlwZSAgICAgICAgPSAkZmllbGQuZmluZCggJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1xdWVyeV90eXBlJyApO1xuXHRcdFx0Y29uc3QgJGRpc3BsYXlUeXBlICAgICAgPSAkZmllbGQuZmluZCggJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1kaXNwbGF5X3R5cGUgc2VsZWN0JyApO1xuXHRcdFx0Y29uc3QgZGlzcGxheVR5cGUgICAgICAgPSAkZGlzcGxheVR5cGUudmFsKCk7XG5cdFx0XHRjb25zdCB2YWxpZERpc3BsYXlUeXBlcyA9IFsgJ2xhYmVsJywgJ2NvbG9yJywgJ2ltYWdlJyBdO1xuXG5cdFx0XHRpZiAoIHZhbGlkRGlzcGxheVR5cGVzLmluY2x1ZGVzKCBkaXNwbGF5VHlwZSApICkge1xuXHRcdFx0XHRpZiAoICcxJyA9PT0gdmFsdWUgKSB7XG5cdFx0XHRcdFx0JHF1ZXJ5VHlwZS5zaG93KCk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0JHF1ZXJ5VHlwZS5oaWRlKCk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cdH0gKTtcblxufSApO1xuIiwiLyoqXG4gKiBEaXNwbGF5IHR5cGUgZmllbGRzLlxuICpcbiAqIEBzaW5jZSAgICAgIDMuMC4wXG4gKiBAcGFja2FnZSAgICB3Yy1hamF4LXByb2R1Y3QtZmlsdGVyXG4gKiBAc3VicGFja2FnZSB3Yy1hamF4LXByb2R1Y3QtZmlsdGVyL2FkbWluL3NyYy9qc1xuICogQGF1dGhvciAgICAgTWFpbnVsIEhhc3NhbiBNYWluXG4gKi9cblxualF1ZXJ5KCBkb2N1bWVudCApLnJlYWR5KCBmdW5jdGlvbiggJCApIHtcblxuXHRjb25zdCBmaWVsZFdyYXBwZXIgPSAkKCAnI2Nob3Nlbl9maWVsZF93cmFwcGVyJyApO1xuXG5cdC8vIE92ZXJyaWRlIG5vLXJlc3VsdHMtbWVzc2FnZSwgYWxsLWl0ZW1zLWxhYmVsIGZpZWxkJ3MgdG9nZ2xlIHZpc2liaWxpdHkgd2hlbiB0ZXh0IGRpc3BsYXkgdHlwZSBpcyBjaGFuZ2VkLlxuXHRmaWVsZFdyYXBwZXIub24oICdhZnRlcl90b2dnbGVfcmVxdWVzdCcsIGZ1bmN0aW9uKCBlLCBoYW5kbGVyLCB2YWx1ZSwgJGZpZWxkICkge1xuXHRcdGlmICggJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1kaXNwbGF5X3R5cGUgc2VsZWN0JyA9PT0gaGFuZGxlciApIHtcblx0XHRcdGNvbnN0ICRub1Jlc3VsdHMgICAgID0gJGZpZWxkLmZpbmQoICcud2NhcGYtZm9ybS1zdWItZmllbGQtY2hvc2VuX25vX3Jlc3VsdHNfbWVzc2FnZScgKTtcblx0XHRcdGNvbnN0ICRhbGxJdGVtc0xhYmVsID0gJGZpZWxkLmZpbmQoICcud2NhcGYtZm9ybS1zdWItZmllbGQtYWxsX2l0ZW1zX2xhYmVsJyApO1xuXHRcdFx0Y29uc3QgdXNlQ2hvc2VuICAgICAgPSAkZmllbGQuZmluZCggJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC11c2VfY2hvc2VuIGlucHV0JyApLmlzKCAnOmNoZWNrZWQnICk7XG5cblx0XHRcdGlmICggdXNlQ2hvc2VuICYmICggJ3NlbGVjdCcgPT09IHZhbHVlIHx8ICdtdWx0aS1zZWxlY3QnID09PSB2YWx1ZSApICkge1xuXHRcdFx0XHQkbm9SZXN1bHRzLnNob3coKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdCRub1Jlc3VsdHMuaGlkZSgpO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAoICggJ3JhZGlvJyA9PT0gdmFsdWUgfHwgJ3NlbGVjdCcgPT09IHZhbHVlICkgfHwgKCAnbXVsdGktc2VsZWN0JyA9PT0gdmFsdWUgJiYgdXNlQ2hvc2VuICkgKSB7XG5cdFx0XHRcdCRhbGxJdGVtc0xhYmVsLnNob3coKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdCRhbGxJdGVtc0xhYmVsLmhpZGUoKTtcblx0XHRcdH1cblx0XHR9XG5cdH0gKTtcblxuXHQvLyBPdmVycmlkZSBuby1yZXN1bHRzLW1lc3NhZ2UsIGFsbC1pdGVtcy1sYWJlbCBmaWVsZCdzIHRvZ2dsZSB2aXNpYmlsaXR5IHdoZW4gdGV4dCB1c2UgY2hvc2VuIGlzIGNoYW5nZWQuXG5cdGZpZWxkV3JhcHBlci5vbiggJ2FmdGVyX3RvZ2dsZV9yZXF1ZXN0JywgZnVuY3Rpb24oIGUsIGhhbmRsZXIsIHZhbHVlLCAkZmllbGQgKSB7XG5cdFx0aWYgKCAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLXVzZV9jaG9zZW4gaW5wdXQnID09PSBoYW5kbGVyICkge1xuXHRcdFx0Y29uc3QgJG5vUmVzdWx0cyAgICAgPSAkZmllbGQuZmluZCggJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1jaG9zZW5fbm9fcmVzdWx0c19tZXNzYWdlJyApO1xuXHRcdFx0Y29uc3QgJGFsbEl0ZW1zTGFiZWwgPSAkZmllbGQuZmluZCggJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1hbGxfaXRlbXNfbGFiZWwnICk7XG5cdFx0XHRjb25zdCBkaXNwbGF5VHlwZSAgICA9ICRmaWVsZC5maW5kKCAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLWRpc3BsYXlfdHlwZSBzZWxlY3QnICkudmFsKCk7XG5cblx0XHRcdGlmICggJzEnID09PSB2YWx1ZSAmJiAoICdzZWxlY3QnID09PSBkaXNwbGF5VHlwZSB8fCAnbXVsdGktc2VsZWN0JyA9PT0gZGlzcGxheVR5cGUgKSApIHtcblx0XHRcdFx0JG5vUmVzdWx0cy5zaG93KCk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHQkbm9SZXN1bHRzLmhpZGUoKTtcblx0XHRcdH1cblxuXHRcdFx0aWYgKFxuXHRcdFx0XHQoICcxJyA9PT0gdmFsdWUgJiYgJ211bHRpLXNlbGVjdCcgPT09IGRpc3BsYXlUeXBlIClcblx0XHRcdFx0fHwgKCAncmFkaW8nID09PSBkaXNwbGF5VHlwZSB8fCAnc2VsZWN0JyA9PT0gZGlzcGxheVR5cGUgKVxuXHRcdFx0KSB7XG5cdFx0XHRcdCRhbGxJdGVtc0xhYmVsLnNob3coKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdCRhbGxJdGVtc0xhYmVsLmhpZGUoKTtcblx0XHRcdH1cblx0XHR9XG5cdH0gKTtcblxufSApO1xuIiwiLyoqXG4gKiBGaWVsZCBtZXRhIGJveC5cbiAqXG4gKiBAc2luY2UgICAgICAzLjAuMFxuICogQHBhY2thZ2UgICAgd2MtYWpheC1wcm9kdWN0LWZpbHRlclxuICogQHN1YnBhY2thZ2Ugd2MtYWpheC1wcm9kdWN0LWZpbHRlci9hZG1pbi9zcmMvanNcbiAqIEBhdXRob3IgICAgIE1haW51bCBIYXNzYW4gTWFpblxuICovXG5cbmpRdWVyeSggZG9jdW1lbnQgKS5yZWFkeSggZnVuY3Rpb24oICQgKSB7XG5cblx0Y29uc3QgZmllbGRXcmFwcGVyID0gJCggJyNjaG9zZW5fZmllbGRfd3JhcHBlcicgKTtcblx0Y29uc3QgZmllbGRJbnB1dCAgID0gJ1tuYW1lXTpub3QoLm1hbnVhbF9vcHRpb25zKTpub3QoLmZpZWxkX2tleSknO1xuXHRjb25zdCBmaWVsZFN0YXRlcyAgPSB7fTtcblxuXHRjb25zdCB0eXBlc0hhdmluZ1NlcGFyYXRlRmllbGRLZXlzID0ge1xuXHRcdCdhdHRyaWJ1dGUnOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLXRheG9ub215IHNlbGVjdCcsXG5cdFx0J2N1c3RvbS10YXhvbm9teSc6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtdGF4b25vbXkgc2VsZWN0Jyxcblx0XHQncG9zdC1tZXRhJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1tZXRhX2tleSBzZWxlY3QnLFxuXHRcdCdwb3N0LXByb3BlcnR5JzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1wb3N0X3Byb3BlcnR5IHNlbGVjdCcsXG5cdH07XG5cblx0ZnVuY3Rpb24gc3RvcmVGaWVsZFN0YXRlKCkge1xuXHRcdGNvbnN0IGZpZWxkVHlwZSA9IGZpZWxkV3JhcHBlci5maW5kKCAnI2ZpZWxkX2RhdGEnICkuYXR0ciggJ2RhdGEtZmllbGQtdHlwZScgKTtcblxuXHRcdGlmICggISBmaWVsZFR5cGUgKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0Y29uc3QgZmllbGRWYWx1ZXMgPSB7fTtcblxuXHRcdGZpZWxkV3JhcHBlci5maW5kKCBmaWVsZElucHV0ICkuZWFjaCggZnVuY3Rpb24oKSB7XG5cdFx0XHRjb25zdCAkaW5wdXQgPSAkKCB0aGlzICk7XG5cdFx0XHRjb25zdCB0eXBlICAgPSAkaW5wdXQuYXR0ciggJ3R5cGUnICk7XG5cdFx0XHRjb25zdCBuYW1lICAgPSAkaW5wdXQuYXR0ciggJ25hbWUnICk7XG5cdFx0XHRjb25zdCB2YWx1ZSAgPSAkaW5wdXQudmFsKCk7XG5cblx0XHRcdGlmICggJ2NoZWNrYm94JyA9PT0gdHlwZSB8fCAncmFkaW8nID09PSB0eXBlICkge1xuXHRcdFx0XHRpZiAoICRpbnB1dC5pcyggJzpjaGVja2VkJyApICkge1xuXHRcdFx0XHRcdGZpZWxkVmFsdWVzWyBuYW1lIF0gPSB2YWx1ZTtcblx0XHRcdFx0fVxuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0ZmllbGRWYWx1ZXNbIG5hbWUgXSA9IHZhbHVlO1xuXHRcdFx0fVxuXHRcdH0gKTtcblxuXHRcdC8vIEhhbmRsZSBmaWx0ZXIga2V5cy5cblx0XHRpZiAoIGZpZWxkV3JhcHBlci5maW5kKCAnLmZpZWxkX2tleScgKS5sZW5ndGggKSB7XG5cdFx0XHRpZiAoIGZpZWxkVHlwZSBpbiB0eXBlc0hhdmluZ1NlcGFyYXRlRmllbGRLZXlzICkge1xuXHRcdFx0XHRjb25zdCAkZmllbGRLZXlJbnB1dCA9IGZpZWxkV3JhcHBlci5maW5kKCB0eXBlc0hhdmluZ1NlcGFyYXRlRmllbGRLZXlzWyBmaWVsZFR5cGUgXSApO1xuXHRcdFx0XHRjb25zdCBmaWVsZEtleUZvciAgICA9ICRmaWVsZEtleUlucHV0LnZhbCgpO1xuXG5cdFx0XHRcdGNvbnN0IGZpZWxkS2V5cyA9IHt9O1xuXG5cdFx0XHRcdGlmICggZmllbGRLZXlGb3IgKSB7XG5cdFx0XHRcdFx0ZmllbGRLZXlzWyBmaWVsZEtleUZvciBdID0gZmllbGRLZXlGb3I7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0ZmllbGRLZXlzWyAnZGVmYXVsdCcgXSA9IGZpZWxkV3JhcHBlci5maW5kKCAnLmZpZWxkX2tleScgKS52YWwoKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGZpZWxkVmFsdWVzWyAnZmllbGRfa2V5JyBdID0gZmllbGRLZXlzO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0ZmllbGRWYWx1ZXNbICdmaWVsZF9rZXknIF0gPSBmaWVsZFdyYXBwZXIuZmluZCggJy5maWVsZF9rZXknICkudmFsKCk7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0Ly8gSGFuZGxlIG1hbnVhbCBvcHRpb25zLlxuXHRcdGNvbnN0IG1hbnVhbE9wdGlvbnMgPSB7fTtcblxuXHRcdGZpZWxkV3JhcHBlci5maW5kKCAnLm1hbnVhbF9vcHRpb25zJyApLmVhY2goIGZ1bmN0aW9uKCkge1xuXHRcdFx0Y29uc3QgJGlucHV0ID0gJCggdGhpcyApO1xuXHRcdFx0Y29uc3QgbmFtZSAgID0gJGlucHV0LmF0dHIoICduYW1lJyApO1xuXG5cdFx0XHRtYW51YWxPcHRpb25zWyBuYW1lIF0gPSAkaW5wdXQudmFsKCk7XG5cdFx0fSApO1xuXG5cdFx0ZmllbGRWYWx1ZXNbICdtYW51YWxfb3B0aW9ucycgXSA9IG1hbnVhbE9wdGlvbnM7XG5cblx0XHRmaWVsZFN0YXRlc1sgZmllbGRUeXBlIF0gPSBmaWVsZFZhbHVlcztcblx0fVxuXG5cdGZ1bmN0aW9uIHVwZGF0ZUZpZWxkU3RhdGUoICRlbG0gKSB7XG5cdFx0Y29uc3QgZmllbGRUeXBlICA9IGZpZWxkV3JhcHBlci5maW5kKCAnI2ZpZWxkX2RhdGEnICkuYXR0ciggJ2RhdGEtZmllbGQtdHlwZScgKTtcblx0XHRjb25zdCBmaWVsZFN0YXRlID0gZmllbGRTdGF0ZXNbIGZpZWxkVHlwZSBdO1xuXG5cdFx0Y29uc3QgbmFtZSAgPSAkZWxtLmF0dHIoICduYW1lJyApO1xuXHRcdGNvbnN0IHR5cGUgID0gJGVsbS5hdHRyKCAndHlwZScgKTtcblx0XHRjb25zdCB2YWx1ZSA9ICRlbG0udmFsKCk7XG5cblx0XHRpZiAoICRlbG0uaGFzQ2xhc3MoICdmaWVsZF9rZXknICkgKSB7XG5cdFx0XHRpZiAoIGZpZWxkVHlwZSBpbiB0eXBlc0hhdmluZ1NlcGFyYXRlRmllbGRLZXlzICkge1xuXHRcdFx0XHRjb25zdCAkZmllbGRLZXlJbnB1dCA9IGZpZWxkV3JhcHBlci5maW5kKCB0eXBlc0hhdmluZ1NlcGFyYXRlRmllbGRLZXlzWyBmaWVsZFR5cGUgXSApO1xuXHRcdFx0XHRjb25zdCBmaWVsZEtleUZvciAgICA9ICRmaWVsZEtleUlucHV0LnZhbCgpO1xuXG5cdFx0XHRcdGlmICggZmllbGRLZXlGb3IgKSB7XG5cdFx0XHRcdFx0ZmllbGRTdGF0ZVsgJ2ZpZWxkX2tleScgXVsgZmllbGRLZXlGb3IgXSA9IHZhbHVlO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdGZpZWxkU3RhdGVbICdmaWVsZF9rZXknIF1bICdkZWZhdWx0JyBdID0gdmFsdWU7XG5cdFx0XHRcdH1cblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGZpZWxkU3RhdGVbICdmaWVsZF9rZXknIF0gPSBmaWVsZFdyYXBwZXIuZmluZCggJy5maWVsZF9rZXknICkudmFsKCk7XG5cdFx0XHR9XG5cdFx0fSBlbHNlIGlmICggJGVsbS5oYXNDbGFzcyggJ21hbnVhbF9vcHRpb25zJyApICkge1xuXHRcdFx0Y29uc3QgbWFudWFsX29wdGlvbnMgPSBmaWVsZFN0YXRlWyAnbWFudWFsX29wdGlvbnMnIF0gfHwge307XG5cblx0XHRcdG1hbnVhbF9vcHRpb25zWyBuYW1lIF0gPSB2YWx1ZTtcblxuXHRcdFx0ZmllbGRTdGF0ZVsgJ21hbnVhbF9vcHRpb25zJyBdID0gbWFudWFsX29wdGlvbnM7XG5cdFx0fSBlbHNlIHtcblx0XHRcdGlmICggJ2NoZWNrYm94JyA9PT0gdHlwZSB8fCAncmFkaW8nID09PSB0eXBlICkge1xuXHRcdFx0XHRjb25zdCAkaW5wdXQgPSBmaWVsZFdyYXBwZXIuZmluZCggJ1tuYW1lPVwiJyArIG5hbWUgKyAnXCJdJyApO1xuXG5cdFx0XHRcdGlmICggJGlucHV0LmlzKCAnOmNoZWNrZWQnICkgKSB7XG5cdFx0XHRcdFx0ZmllbGRTdGF0ZVsgbmFtZSBdID0gdmFsdWU7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0ZGVsZXRlIGZpZWxkU3RhdGVbIG5hbWUgXTtcblx0XHRcdFx0fVxuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0ZmllbGRTdGF0ZVsgbmFtZSBdID0gdmFsdWU7XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cblx0Ly8gU3RvcmUgdGhlIGluaXRpYWwgZmllbGQgc3RhdGUuXG5cdHN0b3JlRmllbGRTdGF0ZSgpO1xuXG5cdGZpZWxkV3JhcHBlci5maW5kKCAnW25hbWVdJyApLm9uKCAnY2hhbmdlJywgZnVuY3Rpb24oKSB7XG5cdFx0Y29uc3QgJHRoaXMgPSAkKCB0aGlzICk7XG5cblx0XHR1cGRhdGVGaWVsZFN0YXRlKCAkdGhpcyApO1xuXHR9ICk7XG5cblx0ZnVuY3Rpb24gYXBwbHlGaWVsZFN0YXRlKCBmaWVsZFR5cGUgKSB7XG5cdFx0Y29uc3QgZmllbGRTdGF0ZSA9IGZpZWxkU3RhdGVzWyBmaWVsZFR5cGUgXTtcblxuXHRcdGZpZWxkV3JhcHBlci5maW5kKCBmaWVsZElucHV0ICkuZWFjaCggZnVuY3Rpb24oKSB7XG5cdFx0XHRjb25zdCAkaW5wdXQgPSAkKCB0aGlzICk7XG5cdFx0XHRjb25zdCB0eXBlICAgPSAkaW5wdXQuYXR0ciggJ3R5cGUnICk7XG5cdFx0XHRjb25zdCBuYW1lICAgPSAkaW5wdXQuYXR0ciggJ25hbWUnICk7XG5cdFx0XHRjb25zdCB2YWx1ZSAgPSBmaWVsZFN0YXRlWyBuYW1lIF07XG5cblx0XHRcdGlmICggJ2NoZWNrYm94JyA9PT0gdHlwZSB8fCAncmFkaW8nID09PSB0eXBlICkge1xuXHRcdFx0XHRpZiAoIG5hbWUgaW4gZmllbGRTdGF0ZSApIHtcblx0XHRcdFx0XHQvLyBBZGQgJ2NoZWNrZWQnIGF0dHJpYnV0ZS5cblx0XHRcdFx0XHRmaWVsZFdyYXBwZXJcblx0XHRcdFx0XHRcdC5maW5kKCAnW25hbWU9XCInICsgbmFtZSArICdcIl1bdmFsdWU9XCInICsgdmFsdWUgKyAnXCJdJyApXG5cdFx0XHRcdFx0XHQuYXR0ciggJ2NoZWNrZWQnLCAnY2hlY2tlZCcgKTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHQvLyBSZW1vdmUgJ2NoZWNrZWQnIGF0dHJpYnV0ZS5cblx0XHRcdFx0XHRmaWVsZFdyYXBwZXIuZmluZCggJ1tuYW1lPVwiJyArIG5hbWUgKyAnXCJdJyApLnJlbW92ZUF0dHIoICdjaGVja2VkJyApO1xuXHRcdFx0XHR9XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHQkaW5wdXQudmFsKCB2YWx1ZSApO1xuXHRcdFx0fVxuXHRcdH0gKTtcblxuXHRcdC8vIFByb2Nlc3MgZmlsdGVyIGtleXMuXG5cdFx0Y29uc3QgJGZpbHRlcktleSA9IGZpZWxkV3JhcHBlci5maW5kKCAnLmZpZWxkX2tleScgKTtcblxuXHRcdGlmICggJGZpbHRlcktleS5sZW5ndGggKSB7XG5cdFx0XHRpZiAoIGZpZWxkVHlwZSBpbiB0eXBlc0hhdmluZ1NlcGFyYXRlRmllbGRLZXlzICkge1xuXHRcdFx0XHRjb25zdCAkZmllbGRLZXlJbnB1dCA9IGZpZWxkV3JhcHBlci5maW5kKCB0eXBlc0hhdmluZ1NlcGFyYXRlRmllbGRLZXlzWyBmaWVsZFR5cGUgXSApO1xuXHRcdFx0XHRjb25zdCBmaWVsZEtleUZvciAgICA9ICRmaWVsZEtleUlucHV0LnZhbCgpO1xuXG5cdFx0XHRcdGlmICggZmllbGRLZXlGb3IgKSB7XG5cdFx0XHRcdFx0JGZpbHRlcktleS52YWwoIGZpZWxkU3RhdGVbICdmaWVsZF9rZXknIF1bIGZpZWxkS2V5Rm9yIF0gKTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHQkZmlsdGVyS2V5LnZhbCggZmllbGRTdGF0ZVsgJ2ZpZWxkX2tleScgXVsgJ2RlZmF1bHQnIF0gKTtcblx0XHRcdFx0fVxuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0JGZpbHRlcktleS52YWwoIGZpZWxkU3RhdGVbICdmaWVsZF9rZXknIF0gKTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHQvLyBQcm9jZXNzIHRoZSBtYW51YWwgb3B0aW9ucy5cblx0XHRpZiAoICdtYW51YWxfb3B0aW9ucycgaW4gZmllbGRTdGF0ZSApIHtcblx0XHRcdGNvbnN0IHJhd09wdGlvbnMgPSBmaWVsZFN0YXRlWyAnbWFudWFsX29wdGlvbnMnIF07XG5cblx0XHRcdCQuZWFjaCggcmF3T3B0aW9ucywgZnVuY3Rpb24oIGlucHV0TmFtZSwgcmF3ICkge1xuXHRcdFx0XHRjb25zdCAkcmF3SW5wdXQgPSBmaWVsZFdyYXBwZXIuZmluZCggJ1tuYW1lPVwiJyArIGlucHV0TmFtZSArICdcIl0nICk7XG5cblx0XHRcdFx0JHJhd0lucHV0LnZhbCggcmF3ICk7XG5cblx0XHRcdFx0Y29uc3QgbWFudWFsT3B0aW9ucyA9IEpTT04ucGFyc2UoIGRlY29kZVVSSUNvbXBvbmVudCggcmF3ICkgKTtcblxuXHRcdFx0XHRpZiAoICEgbWFudWFsT3B0aW9ucy5sZW5ndGggKSB7XG5cdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0Y29uc3QgdGFibGVJZGVudGlmaWVyID0gJHJhd0lucHV0LmF0dHIoICdkYXRhLXRhYmxlJyApO1xuXHRcdFx0XHRjb25zdCByb3dUZW1wbGF0ZUlkICAgPSAkcmF3SW5wdXQuYXR0ciggJ2RhdGEtdG1wbCcgKTtcblxuXHRcdFx0XHQvLyBCYWlsIG91dCBpZiBubyB0bXBsIGZvdW5kIGZvciB0aGUgdHlwZS5cblx0XHRcdFx0aWYgKCAhIGpRdWVyeSggJyN0bXBsLScgKyByb3dUZW1wbGF0ZUlkICkubGVuZ3RoICkge1xuXHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGNvbnN0IHJvd3NJZGVudGlmaWVyID0gJy5maWVsZC10YWJsZS1ib2R5LXJvd3MnO1xuXHRcdFx0XHRjb25zdCByb3dJZGVudGlmaWVyICA9ICcucm93LWl0ZW0nO1xuXG5cdFx0XHRcdGNvbnN0ICR0YWJsZSA9IGZpZWxkV3JhcHBlci5maW5kKCB0YWJsZUlkZW50aWZpZXIgKTtcblx0XHRcdFx0Y29uc3QgJHJvd3MgID0gJHRhYmxlLmZpbmQoIHJvd3NJZGVudGlmaWVyICk7XG5cblx0XHRcdFx0JC5lYWNoKCBtYW51YWxPcHRpb25zLCBmdW5jdGlvbiggaSwgb3B0aW9uICkge1xuXHRcdFx0XHRcdGNvbnN0IHRlbXBsYXRlID0gd3AudGVtcGxhdGUoIHJvd1RlbXBsYXRlSWQgKTtcblxuXHRcdFx0XHRcdGxldCByb3dEZWZhdWx0T3B0aW9ucyA9IHt9O1xuXG5cdFx0XHRcdFx0aWYgKCAnLm1hbnVhbC1vcHRpb25zLXRhYmxlJyA9PT0gdGFibGVJZGVudGlmaWVyICkge1xuXHRcdFx0XHRcdFx0cm93RGVmYXVsdE9wdGlvbnMgPSB7XG5cdFx0XHRcdFx0XHRcdCd2YWx1ZSc6ICcnLFxuXHRcdFx0XHRcdFx0XHQnbGFiZWwnOiAnJyxcblx0XHRcdFx0XHRcdH07XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0Y29uc3QgcmVuZGVyZWQgPSB0ZW1wbGF0ZSggcm93RGVmYXVsdE9wdGlvbnMgKTtcblxuXHRcdFx0XHRcdCRyb3dzLmFwcGVuZCggcmVuZGVyZWQgKTtcblxuXHRcdFx0XHRcdGNvbnN0ICRsYXN0Um93ID0gJHJvd3MuZmluZCggcm93SWRlbnRpZmllciApLmxhc3QoKTtcblxuXHRcdFx0XHRcdCRsYXN0Um93LmZpbmQoICdbZGF0YS1uYW1lXScgKS5lYWNoKCBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHRcdGNvbnN0ICR0aGlzID0gJCggdGhpcyApO1xuXHRcdFx0XHRcdFx0Y29uc3QgbmFtZSAgPSAkdGhpcy5hdHRyKCAnZGF0YS1uYW1lJyApO1xuXHRcdFx0XHRcdFx0Y29uc3QgdmFsdWUgPSBvcHRpb25bIG5hbWUgXTtcblxuXHRcdFx0XHRcdFx0JHRoaXMudmFsKCB2YWx1ZSApO1xuXG5cdFx0XHRcdFx0XHRpZiAoICdpbWFnZV91cmwnID09PSBuYW1lICYmIHZhbHVlICkge1xuXHRcdFx0XHRcdFx0XHQkbGFzdFJvdy5maW5kKCAnLndwLWltYWdlLXBpY2tlci1jb250YWluZXInICkuYWRkQ2xhc3MoICdhY3RpdmUnICk7XG5cdFx0XHRcdFx0XHRcdCRsYXN0Um93LmZpbmQoICdpbWcnICkuYXR0ciggJ3NyYycsIHZhbHVlICk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fSApO1xuXHRcdFx0XHR9ICk7XG5cblx0XHRcdFx0JHRhYmxlLmFkZENsYXNzKCAnaGFzLW9wdGlvbnMnICk7XG5cdFx0XHR9ICk7XG5cblx0XHRcdGNvbnN0ICRmaWVsZCA9IGZpZWxkV3JhcHBlci5maW5kKCAnLndjYXBmLWZvcm0tZmllbGQnICk7XG5cblx0XHRcdGZpZWxkV3JhcHBlci50cmlnZ2VyKCAnbmV3X29wdGlvbl9hZGRlZCcsIFsgJGZpZWxkIF0gKTtcblx0XHR9XG5cdH1cblxuXHQkKCAnI2F2YWlsYWJsZV9maWVsZHMnICkub24oICdjaGFuZ2UnLCAnW25hbWU9XCJfYWN0aXZlX2ZpZWxkXCJdJywgZnVuY3Rpb24oKSB7XG5cdFx0Y29uc3QgJHRoaXMgICAgICA9ICQoIHRoaXMgKTtcblx0XHRjb25zdCBfZmllbGRUeXBlID0gJHRoaXMudmFsKCk7XG5cdFx0Y29uc3QgZmllbGROYW1lICA9ICR0aGlzLmF0dHIoICdkYXRhLWZpZWxkLW5hbWUnICk7XG5cblx0XHRpZiAoICEgX2ZpZWxkVHlwZSApIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHRjb25zdCBmaWVsZFR5cGUgPSAnd2NhcGYtZm9ybS1maWVsZC0nICsgX2ZpZWxkVHlwZTtcblxuXHRcdC8vIEJhaWwgb3V0IGlmIG5vIHRtcGwgZm91bmQgZm9yIHRoZSB0eXBlLlxuXHRcdGlmICggISBqUXVlcnkoICcjdG1wbC0nICsgZmllbGRUeXBlICkubGVuZ3RoICkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdGNvbnN0IHRlbXBsYXRlICAgICAgICAgPSB3cC50ZW1wbGF0ZSggZmllbGRUeXBlICk7XG5cdFx0Y29uc3QgcmVuZGVyZWQgICAgICAgICA9IHRlbXBsYXRlKCk7XG5cdFx0Y29uc3QgZmllbGREYXRhV3JhcHBlciA9IGZpZWxkV3JhcHBlci5maW5kKCAnI2ZpZWxkX2RhdGEnICk7XG5cdFx0Y29uc3QgZmllbGROYW1lV3JhcHBlciA9IGZpZWxkV3JhcHBlci5maW5kKCAnLnBvc3Rib3gtaGVhZGVyIGgyJyApO1xuXHRcdGNvbnN0IGZpZWxkSW5zaWRlICAgICAgPSBmaWVsZFdyYXBwZXIuZmluZCggJy5pbnNpZGUnICk7XG5cblx0XHRmaWVsZFdyYXBwZXIucmVtb3ZlQ2xhc3MoICdoaWRkZW4nICk7XG5cblx0XHRmaWVsZERhdGFXcmFwcGVyLmF0dHIoICdkYXRhLWZpZWxkLXR5cGUnLCBfZmllbGRUeXBlICk7XG5cdFx0ZmllbGROYW1lV3JhcHBlci5odG1sKCBmaWVsZE5hbWUgKTtcblx0XHRmaWVsZEluc2lkZS5odG1sKCByZW5kZXJlZCApO1xuXG5cdFx0Ly8gSWYgYWxyZWFkeSBmb3VuZCB0aGUgZmllbGQgc3RhdGUgdGhlbiBhcHBseSBpdCwgb3RoZXJ3aXNlIHN0b3JlIGl0LlxuXHRcdGlmICggX2ZpZWxkVHlwZSBpbiBmaWVsZFN0YXRlcyApIHtcblx0XHRcdGFwcGx5RmllbGRTdGF0ZSggX2ZpZWxkVHlwZSApO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRzdG9yZUZpZWxkU3RhdGUoKTtcblx0XHR9XG5cblx0XHRmaWVsZFdyYXBwZXIudHJpZ2dlciggJ2ZpZWxkX2FkZGVkJyApO1xuXG5cdFx0ZmllbGRXcmFwcGVyLmZpbmQoICdbbmFtZV0nICkub24oICdjaGFuZ2UnLCBmdW5jdGlvbigpIHtcblx0XHRcdGNvbnN0ICR0aGlzID0gJCggdGhpcyApO1xuXG5cdFx0XHR1cGRhdGVGaWVsZFN0YXRlKCAkdGhpcyApO1xuXHRcdH0gKTtcblx0fSApO1xuXG5cdC8vIFVwZGF0ZSB0aGUgZmlsdGVyIGtleS5cblx0ZmllbGRXcmFwcGVyLm9uKCAnYWZ0ZXJfdG9nZ2xlX3JlcXVlc3QnLCBmdW5jdGlvbiggZSwgaGFuZGxlciwgZmllbGRLZXlGb3IsICRmaWVsZCApIHtcblx0XHRpZiAoIE9iamVjdC52YWx1ZXMoIHR5cGVzSGF2aW5nU2VwYXJhdGVGaWVsZEtleXMgKS5pbmNsdWRlcyggaGFuZGxlciApICkge1xuXHRcdFx0Y29uc3QgZmllbGRUeXBlICA9ICRmaWVsZC5jbG9zZXN0KCAnW2RhdGEtZmllbGQtdHlwZV0nICkuYXR0ciggJ2RhdGEtZmllbGQtdHlwZScgKTtcblx0XHRcdGNvbnN0IGZpZWxkU3RhdGUgPSBmaWVsZFN0YXRlc1sgZmllbGRUeXBlIF07XG5cdFx0XHRjb25zdCBmaWVsZEtleXMgID0gZmllbGRTdGF0ZVsgJ2ZpZWxkX2tleScgXTtcblxuXHRcdFx0Y29uc3QgJGZpZWxkS2V5ICA9ICRmaWVsZC5maW5kKCAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLWZpZWxkX2tleSBpbnB1dFt0eXBlPVwidGV4dFwiXScgKTtcblx0XHRcdGNvbnN0IGRlZmF1bHRLZXkgPSAkZmllbGRLZXkuYXR0ciggJ2RhdGEtZGVmYXVsdC1maWVsZC1rZXknICk7XG5cdFx0XHRsZXQgX2ZpZWxkS2V5O1xuXG5cdFx0XHRpZiAoICEgZmllbGRLZXlGb3IgKSB7XG5cdFx0XHRcdGZpZWxkS2V5Rm9yID0gJ2RlZmF1bHQnO1xuXHRcdFx0XHRfZmllbGRLZXkgICA9IGRlZmF1bHRLZXk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHQvLyBQcmVwZW5kIGRhc2ggdG8gYXZvaWQgY29uZmxpY3Rpbmcgd2l0aCB0aGUgcmVnaXN0ZXJlZCB0YXhvbm9taWVzIGFuZCBwb3N0IHR5cGVzLlxuXHRcdFx0XHRfZmllbGRLZXkgPSAnXycgKyBmaWVsZEtleUZvcjtcblx0XHRcdH1cblxuXHRcdFx0bGV0IGZpZWxkS2V5O1xuXG5cdFx0XHRpZiAoIGZpZWxkS2V5Rm9yIGluIGZpZWxkS2V5cyApIHtcblx0XHRcdFx0ZmllbGRLZXkgPSBmaWVsZEtleXNbIGZpZWxkS2V5Rm9yIF07XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRmaWVsZEtleSA9IF9maWVsZEtleTtcblx0XHRcdH1cblxuXHRcdFx0JGZpZWxkS2V5LnZhbCggZmllbGRLZXkgKS50cmlnZ2VyKCAnY2hhbmdlJyApO1xuXHRcdH1cblx0fSApO1xuXG59ICk7XG4iLCIvKipcbiAqIE1hbnVhbCBPcHRpb25zJyB0YWJsZSBmdW5jdGlvbi5cbiAqXG4gKiBAc2luY2UgICAgICAzLjAuMFxuICogQHBhY2thZ2UgICAgd2MtYWpheC1wcm9kdWN0LWZpbHRlclxuICogQHN1YnBhY2thZ2Ugd2MtYWpheC1wcm9kdWN0LWZpbHRlci9hZG1pbi9zcmMvanNcbiAqIEBhdXRob3IgICAgIE1haW51bCBIYXNzYW4gTWFpblxuICovXG5cbi8qKlxuICogQHBhcmFtIHRhYmxlSWRlbnRpZmllclxuICogQHBhcmFtIHZhbHVlSWRlbnRpZmllclxuICogQHBhcmFtIHJvd1RlbXBsYXRlSWRcbiAqIEBwYXJhbSByb3dEZWZhdWx0T3B0aW9uc1xuICovXG5mdW5jdGlvbiBpbml0TWFudWFsT3B0aW9uc1RhYmxlKCB0YWJsZUlkZW50aWZpZXIsIHZhbHVlSWRlbnRpZmllciwgcm93VGVtcGxhdGVJZCwgcm93RGVmYXVsdE9wdGlvbnMgPSB7fSApIHtcblx0Y29uc3QgJCA9IGpRdWVyeTtcblxuXHRjb25zdCBmaWVsZFdyYXBwZXIgPSAkKCAnI2Nob3Nlbl9maWVsZF93cmFwcGVyJyApO1xuXG5cdGNvbnN0IGZpZWxkSWRlbnRpZmllciA9ICcud2NhcGYtZm9ybS1maWVsZCc7XG5cdGNvbnN0IHJvd3NJZGVudGlmaWVyICA9ICcuZmllbGQtdGFibGUtYm9keS1yb3dzJztcblx0Y29uc3Qgcm93SWRlbnRpZmllciAgID0gJy5yb3ctaXRlbSc7XG5cblx0ZnVuY3Rpb24gaW5pdFNvcnRhYmxlVGFibGUoICRzZWxlY3RvciApIHtcblx0XHQkc2VsZWN0b3Iuc29ydGFibGUoIHtcblx0XHRcdG9wYWNpdHk6IDAuOCxcblx0XHRcdHJldmVydDogZmFsc2UsXG5cdFx0XHRjdXJzb3I6ICdtb3ZlJyxcblx0XHRcdGF4aXM6ICd5Jyxcblx0XHRcdGhhbmRsZTogJy5tb3ZlLW9wdGlvbnMtaGFuZGxlcicsXG5cdFx0XHRwbGFjZWhvbGRlcjogJ3dpZGdldC1wbGFjZWhvbGRlcicsXG5cdFx0XHR1cGRhdGU6IGZ1bmN0aW9uKCBlICkge1xuXHRcdFx0XHRjb25zdCAkZmllbGQgPSAkKCBlLnRhcmdldCApLmNsb3Nlc3QoICcud2NhcGYtZm9ybS1maWVsZCcgKTtcblxuXHRcdFx0XHR0cmlnZ2VyT3B0aW9uc0NoYW5nZSggJGZpZWxkICk7XG5cdFx0XHR9XG5cdFx0fSApLmRpc2FibGVTZWxlY3Rpb24oKTtcblx0fVxuXG5cdGNvbnN0IHRhYmxlUm93c0lkZW50aWZpZXIgPSB0YWJsZUlkZW50aWZpZXIgKyAnICcgKyByb3dzSWRlbnRpZmllcjtcblxuXHQvLyBJbml0IHRoZSBzb3J0YWJsZSB0YWJsZSBhZnRlciBwYWdlIGxvYWRzLlxuXHRpbml0U29ydGFibGVUYWJsZSggZmllbGRXcmFwcGVyLmZpbmQoIHRhYmxlUm93c0lkZW50aWZpZXIgKSApO1xuXG5cdC8vIEluaXQgdGhlIHNvcnRhYmxlIHRhYmxlIGFmdGVyIHRoZSBmaWVsZCBpcyBhZGRlZC5cblx0ZmllbGRXcmFwcGVyLm9uKCAnZmllbGRfYWRkZWQnLCBmdW5jdGlvbigpIHtcblx0XHRpbml0U29ydGFibGVUYWJsZSggJCggZmllbGRXcmFwcGVyLmZpbmQoIHRhYmxlUm93c0lkZW50aWZpZXIgKSApICk7XG5cdH0gKTtcblxuXHRmdW5jdGlvbiB0cmlnZ2VyT3B0aW9uc0NoYW5nZSggJGZpZWxkICkge1xuXHRcdGNvbnN0ICR2YWx1ZUhvbGRlciA9ICRmaWVsZC5maW5kKCB2YWx1ZUlkZW50aWZpZXIgKTtcblx0XHRjb25zdCAkcm93cyAgICAgICAgPSAkZmllbGQuZmluZCggdGFibGVSb3dzSWRlbnRpZmllciApO1xuXHRcdGNvbnN0IF9yb3dzICAgICAgICA9IFtdO1xuXG5cdFx0JHJvd3MuZmluZCggJy5yb3ctaXRlbScgKS5lYWNoKCBmdW5jdGlvbiggaSwgX2l0ZW0gKSB7XG5cdFx0XHRjb25zdCAkaXRlbSA9ICQoIF9pdGVtICk7XG5cdFx0XHRjb25zdCBvYmogICA9IHt9O1xuXG5cdFx0XHQkaXRlbS5maW5kKCAnW2RhdGEtbmFtZV0nICkuZWFjaCggZnVuY3Rpb24oIGZpZWxkSW5kZXgsIGZpZWxkICkge1xuXHRcdFx0XHRjb25zdCAkZmllbGQgPSAkKCBmaWVsZCApO1xuXHRcdFx0XHRjb25zdCBuYW1lICAgPSAkZmllbGQuYXR0ciggJ2RhdGEtbmFtZScgKTtcblxuXHRcdFx0XHRvYmpbIG5hbWUgXSA9ICRmaWVsZC52YWwoKTtcblx0XHRcdH0gKTtcblxuXHRcdFx0X3Jvd3MucHVzaCggb2JqICk7XG5cdFx0fSApO1xuXG5cdFx0Y29uc3QgcmF3VmFsdWVzID0gZW5jb2RlVVJJQ29tcG9uZW50KCBKU09OLnN0cmluZ2lmeSggX3Jvd3MgKSApO1xuXHRcdCR2YWx1ZUhvbGRlci52YWwoIHJhd1ZhbHVlcyApLnRyaWdnZXIoICdjaGFuZ2UnICk7XG5cdH1cblxuXHRmdW5jdGlvbiB0cmlnZ2VyUmVtb3ZlT3B0aW9uKCAkZmllbGQgKSB7XG5cdFx0Y29uc3QgJG9wdGlvbnNUYWJsZSA9ICRmaWVsZC5maW5kKCB0YWJsZUlkZW50aWZpZXIgKTtcblx0XHRjb25zdCB0YWJsZVJvd3MgICAgID0gJGZpZWxkLmZpbmQoIHRhYmxlUm93c0lkZW50aWZpZXIgKS5jaGlsZHJlbigpO1xuXG5cdFx0aWYgKCAyID4gdGFibGVSb3dzLmxlbmd0aCApIHtcblx0XHRcdCRvcHRpb25zVGFibGUucmVtb3ZlQ2xhc3MoICdoYXMtb3B0aW9ucycgKTtcblx0XHR9XG5cdH1cblxuXHQvLyBSZW1vdmUgT3B0aW9uXG5cdGNvbnN0IHJlbW92ZUJ0bklkZW50aWZpZXIgPSB0YWJsZUlkZW50aWZpZXIgKyAnIC5yZW1vdmUtb3B0aW9uJztcblxuXHRmaWVsZFdyYXBwZXIub24oICdjbGljaycsIHJlbW92ZUJ0bklkZW50aWZpZXIsIGZ1bmN0aW9uKCkge1xuXHRcdGNvbnN0ICRpdGVtICA9ICQoIHRoaXMgKS5jbG9zZXN0KCByb3dJZGVudGlmaWVyICk7XG5cdFx0Y29uc3QgJGZpZWxkID0gJGl0ZW0uY2xvc2VzdCggZmllbGRJZGVudGlmaWVyICk7XG5cblx0XHR0cmlnZ2VyUmVtb3ZlT3B0aW9uKCAkZmllbGQgKTtcblxuXHRcdCRpdGVtLnJlbW92ZSgpO1xuXG5cdFx0dHJpZ2dlck9wdGlvbnNDaGFuZ2UoICRmaWVsZCApO1xuXHR9ICk7XG5cblx0Ly8gQ2xlYXIgQWxsIE9wdGlvbnNcblx0Y29uc3QgY2xlYXJPcHRpb25zQnRuSWRlbnRpZmllciA9IHRhYmxlSWRlbnRpZmllciArICcgLmNsZWFyLW9wdGlvbnMnO1xuXG5cdGZpZWxkV3JhcHBlci5vbiggJ2NsaWNrJywgY2xlYXJPcHRpb25zQnRuSWRlbnRpZmllciwgZnVuY3Rpb24oKSB7XG5cdFx0Y29uc3QgJGZpZWxkID0gJCggdGhpcyApLmNsb3Nlc3QoIGZpZWxkSWRlbnRpZmllciApO1xuXG5cdFx0JGZpZWxkLmZpbmQoIHRhYmxlUm93c0lkZW50aWZpZXIgKS5lbXB0eSgpO1xuXG5cdFx0dHJpZ2dlclJlbW92ZU9wdGlvbiggJGZpZWxkICk7XG5cdFx0dHJpZ2dlck9wdGlvbnNDaGFuZ2UoICRmaWVsZCApO1xuXHR9ICk7XG5cblx0Ly8gQWRkIE5ldyBPcHRpb25cblx0Y29uc3QgYWRkT3B0aW9uQnRuSWRlbnRpZmllciA9IHRhYmxlSWRlbnRpZmllciArICcgLmFkZC1vcHRpb24nO1xuXG5cdGZpZWxkV3JhcHBlci5vbiggJ2NsaWNrJywgYWRkT3B0aW9uQnRuSWRlbnRpZmllciwgZnVuY3Rpb24oKSB7XG5cdFx0Ly8gQmFpbCBvdXQgaWYgbm8gdG1wbCBmb3VuZCBmb3IgdGhlIHR5cGUuXG5cdFx0aWYgKCAhIGpRdWVyeSggJyN0bXBsLScgKyByb3dUZW1wbGF0ZUlkICkubGVuZ3RoICkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdGNvbnN0ICRmaWVsZCA9ICQoIHRoaXMgKS5jbG9zZXN0KCBmaWVsZElkZW50aWZpZXIgKTtcblxuXHRcdGNvbnN0IHRlbXBsYXRlID0gd3AudGVtcGxhdGUoIHJvd1RlbXBsYXRlSWQgKTtcblx0XHRjb25zdCByZW5kZXJlZCA9IHRlbXBsYXRlKCByb3dEZWZhdWx0T3B0aW9ucyApO1xuXHRcdGNvbnN0ICR0YWJsZSAgID0gJGZpZWxkLmZpbmQoIHRhYmxlSWRlbnRpZmllciApO1xuXHRcdGNvbnN0ICRyb3dzICAgID0gJGZpZWxkLmZpbmQoIHRhYmxlUm93c0lkZW50aWZpZXIgKTtcblxuXHRcdCRyb3dzLmFwcGVuZCggcmVuZGVyZWQgKTtcblxuXHRcdHRyaWdnZXJPcHRpb25zQ2hhbmdlKCAkZmllbGQgKTtcblxuXHRcdGZpZWxkV3JhcHBlci50cmlnZ2VyKCAnbmV3X29wdGlvbl9hZGRlZCcsIFsgJGZpZWxkIF0gKTtcblxuXHRcdGlmICggISAkdGFibGUuaGFzQ2xhc3MoICdoYXMtb3B0aW9ucycgKSApIHtcblx0XHRcdCR0YWJsZS5hZGRDbGFzcyggJ2hhcy1vcHRpb25zJyApO1xuXHRcdH1cblx0fSApO1xuXG5cdC8vIFRyaWdnZXIgb3B0aW9ucyBjaGFuZ2Ugd2hlbiB0aGUgdGV4dCBmaWVsZHMgZ2V0IGNoYW5nZWQuXG5cdGNvbnN0IHRleHRGaWVsZHNJZGVudGlmaWVyID0gdGFibGVSb3dzSWRlbnRpZmllciArICcgaW5wdXRbdHlwZT1cInRleHRcIl0nO1xuXG5cdGZpZWxkV3JhcHBlci5vbiggJ2lucHV0JywgdGV4dEZpZWxkc0lkZW50aWZpZXIsIGZ1bmN0aW9uKCkge1xuXHRcdGNvbnN0ICRmaWVsZCA9ICQoIHRoaXMgKS5jbG9zZXN0KCBmaWVsZElkZW50aWZpZXIgKTtcblxuXHRcdHRyaWdnZXJPcHRpb25zQ2hhbmdlKCAkZmllbGQgKTtcblx0fSApO1xuXG5cdC8vIFRyaWdnZXIgb3B0aW9ucyBjaGFuZ2Ugd2hlbiB0aGUgc2VsZWN0IGZpZWxkcyBnZXQgY2hhbmdlZC5cblx0bGV0IHNlbGVjdEZpZWxkc0lkZW50aWZpZXIgPSB0YWJsZVJvd3NJZGVudGlmaWVyICsgJyBzZWxlY3QnO1xuXG5cdGZpZWxkV3JhcHBlci5vbiggJ2NoYW5nZScsIHNlbGVjdEZpZWxkc0lkZW50aWZpZXIsIGZ1bmN0aW9uKCkge1xuXHRcdGNvbnN0ICRmaWVsZCA9ICQoIHRoaXMgKS5jbG9zZXN0KCBmaWVsZElkZW50aWZpZXIgKTtcblxuXHRcdHRyaWdnZXJPcHRpb25zQ2hhbmdlKCAkZmllbGQgKTtcblx0fSApO1xuXG5cdC8vIFRyaWdnZXIgb3B0aW9ucyBjaGFuZ2Ugd2hlbiB2YWx1ZSBpcyBhZGRlZCBmcm9tIG1vZGFsLlxuXHRmaWVsZFdyYXBwZXIub24oICd0cmlnZ2VyX29wdGlvbnNfdGFibGUnLCBmdW5jdGlvbiggZSwgdGFibGVJZCwgJGZpZWxkICkge1xuXHRcdGlmICggdGFibGVJZCA9PT0gdGFibGVJZGVudGlmaWVyICkge1xuXHRcdFx0dHJpZ2dlck9wdGlvbnNDaGFuZ2UoICRmaWVsZCApO1xuXHRcdH1cblx0fSApO1xuXG59XG4iLCIvKipcbiAqIFRoZSBudW1iZXIgdWkgb3B0aW9ucy5cbiAqXG4gKiBAc2luY2UgICAgICAzLjAuMFxuICogQHBhY2thZ2UgICAgd2MtYWpheC1wcm9kdWN0LWZpbHRlclxuICogQHN1YnBhY2thZ2Ugd2MtYWpheC1wcm9kdWN0LWZpbHRlci9hZG1pbi9zcmMvanNcbiAqIEBhdXRob3IgICAgIE1haW51bCBIYXNzYW4gTWFpblxuICovXG5cbmpRdWVyeSggZG9jdW1lbnQgKS5yZWFkeSggZnVuY3Rpb24oICQgKSB7XG5cblx0Y29uc3QgZmllbGRXcmFwcGVyID0gJCggJyNjaG9zZW5fZmllbGRfd3JhcHBlcicgKTtcblxuXHQvKipcblx0ICogVG9nZ2xlIGRpc2FibGVkIGF0dHJpYnV0ZSBvZiBtaW4tdmFsdWUgZmllbGQgZm9yIG51bWJlciB0eXBlLlxuXHQgKi9cblx0ZnVuY3Rpb24gdG9nZ2xlTnVtYmVyTWluVmFsdWVGaWVsZCggJGVsbSApIHtcblx0XHRjb25zdCAkZmllbGQgICAgID0gJGVsbS5jbG9zZXN0KCAnLndjYXBmLWZvcm0tZmllbGQnICk7XG5cdFx0Y29uc3QgJHRleHRGaWVsZCA9ICRmaWVsZC5maW5kKCAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLW1pbl92YWx1ZSBpbnB1dFt0eXBlPVwidGV4dFwiXScgKTtcblxuXHRcdGlmICggJGVsbS5pcyggJzpjaGVja2VkJyApICkge1xuXHRcdFx0JHRleHRGaWVsZC5hdHRyKCAnZGlzYWJsZWQnLCAnZGlzYWJsZWQnICk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdCR0ZXh0RmllbGQucmVtb3ZlQXR0ciggJ2Rpc2FibGVkJyApO1xuXHRcdH1cblx0fVxuXG5cdGZpZWxkV3JhcHBlci5vbiggJ2ZpZWxkX2FkZGVkJywgZnVuY3Rpb24oKSB7XG5cdFx0ZmllbGRXcmFwcGVyLmZpbmQoICcud2NhcGYtZm9ybS1zdWItZmllbGQtbWluX3ZhbHVlX2F1dG9fZGV0ZWN0IGlucHV0W3R5cGU9XCJjaGVja2JveFwiXScgKS5lYWNoKCBmdW5jdGlvbigpIHtcblx0XHRcdGNvbnN0ICR0aGlzID0gJCggdGhpcyApO1xuXG5cdFx0XHR0b2dnbGVOdW1iZXJNaW5WYWx1ZUZpZWxkKCAkdGhpcyApO1xuXHRcdH0gKTtcblx0fSApO1xuXG5cdGZpZWxkV3JhcHBlci5vbihcblx0XHQnY2xpY2snLFxuXHRcdCcud2NhcGYtZm9ybS1zdWItZmllbGQtbWluX3ZhbHVlX2F1dG9fZGV0ZWN0IGlucHV0W3R5cGU9XCJjaGVja2JveFwiXScsXG5cdFx0ZnVuY3Rpb24oKSB7XG5cdFx0XHRjb25zdCAkdGhpcyA9ICQoIHRoaXMgKTtcblxuXHRcdFx0dG9nZ2xlTnVtYmVyTWluVmFsdWVGaWVsZCggJHRoaXMgKTtcblx0XHR9XG5cdCk7XG5cblx0LyoqXG5cdCAqIFRvZ2dsZSBkaXNhYmxlZCBhdHRyaWJ1dGUgb2YgbWF4LXZhbHVlIGZpZWxkIGZvciBudW1iZXIgdHlwZS5cblx0ICovXG5cdGZ1bmN0aW9uIHRvZ2dsZU51bWJlck1heFZhbHVlRmllbGQoICRlbG0gKSB7XG5cdFx0Y29uc3QgJGZpZWxkICAgICA9ICRlbG0uY2xvc2VzdCggJy53Y2FwZi1mb3JtLWZpZWxkJyApO1xuXHRcdGNvbnN0ICR0ZXh0RmllbGQgPSAkZmllbGQuZmluZCggJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1tYXhfdmFsdWUgaW5wdXRbdHlwZT1cInRleHRcIl0nICk7XG5cblx0XHRpZiAoICRlbG0uaXMoICc6Y2hlY2tlZCcgKSApIHtcblx0XHRcdCR0ZXh0RmllbGQuYXR0ciggJ2Rpc2FibGVkJywgJ2Rpc2FibGVkJyApO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHQkdGV4dEZpZWxkLnJlbW92ZUF0dHIoICdkaXNhYmxlZCcgKTtcblx0XHR9XG5cdH1cblxuXHRmaWVsZFdyYXBwZXIub24oICdmaWVsZF9hZGRlZCcsIGZ1bmN0aW9uKCkge1xuXHRcdGZpZWxkV3JhcHBlci5maW5kKCAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLW1heF92YWx1ZV9hdXRvX2RldGVjdCBpbnB1dFt0eXBlPVwiY2hlY2tib3hcIl0nICkuZWFjaCggZnVuY3Rpb24oKSB7XG5cdFx0XHRjb25zdCAkdGhpcyA9ICQoIHRoaXMgKTtcblxuXHRcdFx0dG9nZ2xlTnVtYmVyTWF4VmFsdWVGaWVsZCggJHRoaXMgKTtcblx0XHR9ICk7XG5cdH0gKTtcblxuXHRmaWVsZFdyYXBwZXIub24oXG5cdFx0J2NsaWNrJyxcblx0XHQnLndjYXBmLWZvcm0tc3ViLWZpZWxkLW1heF92YWx1ZV9hdXRvX2RldGVjdCBpbnB1dFt0eXBlPVwiY2hlY2tib3hcIl0nLFxuXHRcdGZ1bmN0aW9uKCkge1xuXHRcdFx0Y29uc3QgJHRoaXMgPSAkKCB0aGlzICk7XG5cblx0XHRcdHRvZ2dsZU51bWJlck1heFZhbHVlRmllbGQoICR0aGlzICk7XG5cdFx0fVxuXHQpO1xuXG59ICk7XG4iLCIvKipcbiAqIFRoZSBwcm9kdWN0IHN0YXR1cyBmaWVsZC5cbiAqXG4gKiBAc2luY2UgICAgICAzLjAuMFxuICogQHBhY2thZ2UgICAgd2MtYWpheC1wcm9kdWN0LWZpbHRlclxuICogQHN1YnBhY2thZ2Ugd2MtYWpheC1wcm9kdWN0LWZpbHRlci9hZG1pbi9zcmMvanNcbiAqIEBhdXRob3IgICAgIE1haW51bCBIYXNzYW4gTWFpblxuICovXG5cbmpRdWVyeSggZG9jdW1lbnQgKS5yZWFkeSggZnVuY3Rpb24oKSB7XG5cblx0Y29uc3QgdGFibGVJZGVudGlmaWVyID0gJy5wcm9kdWN0LXN0YXR1cy1vcHRpb25zLXRhYmxlJztcblx0Y29uc3QgdmFsdWVJZGVudGlmaWVyID0gJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1wcm9kdWN0X3N0YXR1c19vcHRpb25zIGlucHV0Jztcblx0Y29uc3Qgcm93VGVtcGxhdGVJZCAgID0gJ3djYXBmLXByb2R1Y3Qtc3RhdHVzLW9wdGlvbic7XG5cblx0aW5pdE1hbnVhbE9wdGlvbnNUYWJsZSggdGFibGVJZGVudGlmaWVyLCB2YWx1ZUlkZW50aWZpZXIsIHJvd1RlbXBsYXRlSWQgKTtcblxufSApO1xuIiwiLyoqXG4gKiBUaGUgdG9nZ2xlIHZpc2liaWxpdHkgc2NyaXB0cy5cbiAqXG4gKiBOT1RFOiBUaGVzZSBzY3JpcHRzIG11c3QgYmUgbG9jYXRlZCBhdCB0aGUgdmVyeSBib3R0b20gb2YgdGhlIGNvbWJpbmVkIHNjcmlwdHMuXG4gKlxuICogQHNpbmNlICAgICAgMy4wLjBcbiAqIEBwYWNrYWdlICAgIHdjLWFqYXgtcHJvZHVjdC1maWx0ZXJcbiAqIEBzdWJwYWNrYWdlIHdjLWFqYXgtcHJvZHVjdC1maWx0ZXIvYWRtaW4vc3JjL2pzXG4gKiBAYXV0aG9yICAgICBNYWludWwgSGFzc2FuIE1haW5cbiAqL1xuXG5qUXVlcnkoIGRvY3VtZW50ICkucmVhZHkoIGZ1bmN0aW9uKCAkICkge1xuXG5cdGNvbnN0IGZpZWxkV3JhcHBlciA9ICQoICcjY2hvc2VuX2ZpZWxkX3dyYXBwZXInICk7XG5cblx0Y29uc3QgZGVwZW5kYW50RGF0YSA9IFtcblx0XHR7XG5cdFx0XHQnaGFuZGxlcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtdmFsdWVfdHlwZSBzZWxlY3QnLFxuXHRcdFx0J2hhbmRsZXJUeXBlJzogJ3NlbGVjdCcsXG5cdFx0XHQnZXZlbnQnOiAnY2hhbmdlJyxcblx0XHRcdCdkZXBlbmRhbnQnOiBbXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLmlucHV0LXR5cGUtdGV4dC1maWVsZHMnLFxuXHRcdFx0XHRcdCd2YWx1ZSc6IFsgJ3RleHQnIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLmlucHV0LXR5cGUtbnVtYmVyLWZpZWxkcycsXG5cdFx0XHRcdFx0J3ZhbHVlJzogWyAnbnVtYmVyJyBdLFxuXHRcdFx0XHR9LFxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0J3NlbGVjdG9yJzogJy5pbnB1dC10eXBlLWRhdGUtZmllbGRzJyxcblx0XHRcdFx0XHQndmFsdWUnOiBbICdkYXRlJyBdLFxuXHRcdFx0XHR9LFxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0J3NlbGVjdG9yJzogJy52YWx1ZS1kZWNpbWFsLWZpZWxkcycsXG5cdFx0XHRcdFx0J3ZhbHVlJzogWyAnbnVtYmVyJyBdLFxuXHRcdFx0XHR9LFxuXHRcdFx0XSxcblx0XHR9LFxuXHRcdHtcblx0XHRcdCdoYW5kbGVyJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1kaXNwbGF5X3R5cGUgc2VsZWN0Jyxcblx0XHRcdCdoYW5kbGVyVHlwZSc6ICdzZWxlY3QnLFxuXHRcdFx0J2V2ZW50JzogJ2NoYW5nZScsXG5cdFx0XHQnZGVwZW5kYW50JzogW1xuXHRcdFx0XHR7XG5cdFx0XHRcdFx0J3NlbGVjdG9yJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1xdWVyeV90eXBlJyxcblx0XHRcdFx0XHQndmFsdWUnOiBbICdjaGVja2JveCcsICdtdWx0aS1zZWxlY3QnIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLWFsbF9pdGVtc19sYWJlbCcsXG5cdFx0XHRcdFx0J3ZhbHVlJzogWyAncmFkaW8nLCAnc2VsZWN0JyBdLFxuXHRcdFx0XHR9LFxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0J3NlbGVjdG9yJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC11c2VfY2hvc2VuJyxcblx0XHRcdFx0XHQndmFsdWUnOiBbICdzZWxlY3QnLCAnbXVsdGktc2VsZWN0JyBdLFxuXHRcdFx0XHR9LFxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0J3NlbGVjdG9yJzogJy5oaWVyYXJjaGljYWwtZmllbGRzJyxcblx0XHRcdFx0XHQndmFsdWUnOiBbICdjaGVja2JveCcsICdyYWRpbycsICdzZWxlY3QnLCAnbXVsdGktc2VsZWN0JyBdLFxuXHRcdFx0XHR9LFxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0J3NlbGVjdG9yJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC11c2VfY2F0ZWdvcnlfaW1hZ2VzJyxcblx0XHRcdFx0XHQndmFsdWUnOiBbICdpbWFnZScgXSxcblx0XHRcdFx0fSxcblx0XHRcdFx0e1xuXHRcdFx0XHRcdCdzZWxlY3Rvcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtZW5hYmxlX211bHRpcGxlX2ZpbHRlcicsXG5cdFx0XHRcdFx0J3ZhbHVlJzogWyAnbGFiZWwnLCAnY29sb3InLCAnaW1hZ2UnIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLmNvbHVtbi1ncm91cC1jdXN0b21fYXBwZWFyYW5jZScsXG5cdFx0XHRcdFx0J3ZhbHVlJzogWyAnY29sb3InLCAnaW1hZ2UnIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRdLFxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0J2hhbmRsZXInOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLXVzZV9jaG9zZW4gaW5wdXQnLFxuXHRcdFx0J2hhbmRsZXJUeXBlJzogJ2NoZWNrYm94Jyxcblx0XHRcdCdldmVudCc6ICdjaGFuZ2UnLFxuXHRcdFx0J2RlcGVuZGFudCc6IFtcblx0XHRcdFx0e1xuXHRcdFx0XHRcdCdzZWxlY3Rvcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtY2hvc2VuX25vX3Jlc3VsdHNfbWVzc2FnZScsXG5cdFx0XHRcdFx0J3ZhbHVlJzogWyAnMScgXSxcblx0XHRcdFx0fSxcblx0XHRcdF0sXG5cdFx0fSxcblx0XHR7XG5cdFx0XHQnaGFuZGxlcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtaGllcmFyY2hpY2FsIGlucHV0Jyxcblx0XHRcdCdoYW5kbGVyVHlwZSc6ICdjaGVja2JveCcsXG5cdFx0XHQnZXZlbnQnOiAnY2hhbmdlJyxcblx0XHRcdCdkZXBlbmRhbnQnOiBbXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLWVuYWJsZV9oaWVyYXJjaHlfYWNjb3JkaW9uJyxcblx0XHRcdFx0XHQndmFsdWUnOiBbICcxJyBdLFxuXHRcdFx0XHR9LFxuXHRcdFx0XSxcblx0XHR9LFxuXHRcdHtcblx0XHRcdCdoYW5kbGVyJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC12YWx1ZV9kZWNpbWFsIGlucHV0Jyxcblx0XHRcdCdoYW5kbGVyVHlwZSc6ICdjaGVja2JveCcsXG5cdFx0XHQnZXZlbnQnOiAnY2hhbmdlJyxcblx0XHRcdCdkZXBlbmRhbnQnOiBbXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLXZhbHVlX2RlY2ltYWxfcGxhY2VzJyxcblx0XHRcdFx0XHQndmFsdWUnOiBbICcxJyBdLFxuXHRcdFx0XHR9LFxuXHRcdFx0XSxcblx0XHR9LFxuXHRcdHtcblx0XHRcdCdoYW5kbGVyJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1nZXRfb3B0aW9ucyBpbnB1dCcsXG5cdFx0XHQnaGFuZGxlclR5cGUnOiAncmFkaW8nLFxuXHRcdFx0J2V2ZW50JzogJ2NoYW5nZScsXG5cdFx0XHQnZGVwZW5kYW50JzogW1xuXHRcdFx0XHR7XG5cdFx0XHRcdFx0J3NlbGVjdG9yJzogJy5jb2x1bW4tZ3JvdXAtbWV0YV9rZXlfbWFudWFsX29wdGlvbnMnLFxuXHRcdFx0XHRcdCd2YWx1ZSc6IFsgJ21hbnVhbF9lbnRyeScgXSxcblx0XHRcdFx0fSxcblx0XHRcdF0sXG5cdFx0fSxcblx0XHR7XG5cdFx0XHQnaGFuZGxlcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtbnVtYmVyX2Rpc3BsYXlfdHlwZSBzZWxlY3QnLFxuXHRcdFx0J2hhbmRsZXJUeXBlJzogJ3NlbGVjdCcsXG5cdFx0XHQnZXZlbnQnOiAnY2hhbmdlJyxcblx0XHRcdCdkZXBlbmRhbnQnOiBbXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLW51bWJlcl9yYW5nZV9zbGlkZXJfZGlzcGxheV92YWx1ZXNfYXMnLFxuXHRcdFx0XHRcdCd2YWx1ZSc6IFsgJ3JhbmdlX3NsaWRlcicgXSxcblx0XHRcdFx0fSxcblx0XHRcdFx0e1xuXHRcdFx0XHRcdCdzZWxlY3Rvcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtYWxpZ25fdmFsdWVzX2F0X3RoZV9lbmQnLFxuXHRcdFx0XHRcdCd2YWx1ZSc6IFsgJ3JhbmdlX3NsaWRlcicgXSxcblx0XHRcdFx0fSxcblx0XHRcdFx0e1xuXHRcdFx0XHRcdCdzZWxlY3Rvcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtbnVtYmVyX3JhbmdlX3F1ZXJ5X3R5cGUnLFxuXHRcdFx0XHRcdCd2YWx1ZSc6IFsgJ3JhbmdlX2NoZWNrYm94JywgJ3JhbmdlX211bHRpc2VsZWN0JyBdLFxuXHRcdFx0XHR9LFxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0J3NlbGVjdG9yJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1udW1iZXJfcmFuZ2Vfc2VsZWN0X2FsbF9pdGVtc19sYWJlbCcsXG5cdFx0XHRcdFx0J3ZhbHVlJzogWyAncmFuZ2VfcmFkaW8nLCAncmFuZ2Vfc2VsZWN0JyBdLFxuXHRcdFx0XHR9LFxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0J3NlbGVjdG9yJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1udW1iZXJfcmFuZ2VfdXNlX2Nob3NlbicsXG5cdFx0XHRcdFx0J3ZhbHVlJzogWyAncmFuZ2Vfc2VsZWN0JywgJ3JhbmdlX211bHRpc2VsZWN0JyBdLFxuXHRcdFx0XHR9LFxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0J3NlbGVjdG9yJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1udW1iZXJfcmFuZ2VfZW5hYmxlX211bHRpcGxlX2ZpbHRlcicsXG5cdFx0XHRcdFx0J3ZhbHVlJzogWyAncmFuZ2VfbGFiZWwnIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLW51bWJlcl9yYW5nZV9zaG93X2NvdW50Jyxcblx0XHRcdFx0XHQndmFsdWUnOiBbICdyYW5nZV9jaGVja2JveCcsICdyYW5nZV9yYWRpbycsICdyYW5nZV9zZWxlY3QnLCAncmFuZ2VfbXVsdGlzZWxlY3QnLCAncmFuZ2VfbGFiZWwnIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLW51bWJlcl9yYW5nZV9oaWRlX2VtcHR5Jyxcblx0XHRcdFx0XHQndmFsdWUnOiBbICdyYW5nZV9jaGVja2JveCcsICdyYW5nZV9yYWRpbycsICdyYW5nZV9zZWxlY3QnLCAncmFuZ2VfbXVsdGlzZWxlY3QnLCAncmFuZ2VfbGFiZWwnIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLm51bWJlci1kZWNpbWFsLWZpZWxkcycsXG5cdFx0XHRcdFx0J3ZhbHVlJzogWyAncmFuZ2Vfc2xpZGVyJywgJ3JhbmdlX2NoZWNrYm94JywgJ3JhbmdlX3JhZGlvJywgJ3JhbmdlX3NlbGVjdCcsICdyYW5nZV9tdWx0aXNlbGVjdCcsICdyYW5nZV9sYWJlbCcgXSxcblx0XHRcdFx0fSxcblx0XHRcdF0sXG5cdFx0fSxcblx0XHR7XG5cdFx0XHQnaGFuZGxlcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtbnVtYmVyX3JhbmdlX3VzZV9jaG9zZW4gaW5wdXQnLFxuXHRcdFx0J2hhbmRsZXJUeXBlJzogJ2NoZWNrYm94Jyxcblx0XHRcdCdldmVudCc6ICdjaGFuZ2UnLFxuXHRcdFx0J2RlcGVuZGFudCc6IFtcblx0XHRcdFx0e1xuXHRcdFx0XHRcdCdzZWxlY3Rvcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtbnVtYmVyX3JhbmdlX2Nob3Nlbl9ub19yZXN1bHRzX21lc3NhZ2UnLFxuXHRcdFx0XHRcdCd2YWx1ZSc6IFsgJzEnIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRdLFxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0J2hhbmRsZXInOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLW51bWJlcl9nZXRfb3B0aW9ucyBpbnB1dCcsXG5cdFx0XHQnaGFuZGxlclR5cGUnOiAncmFkaW8nLFxuXHRcdFx0J2V2ZW50JzogJ2NoYW5nZScsXG5cdFx0XHQnZGVwZW5kYW50JzogW1xuXHRcdFx0XHR7XG5cdFx0XHRcdFx0J3NlbGVjdG9yJzogJy5udW1iZXItYXV0b21hdGljLW9wdGlvbnMnLFxuXHRcdFx0XHRcdCd2YWx1ZSc6IFsgJ2F1dG9tYXRpY2FsbHknIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLm51bWJlci1tYW51YWwtb3B0aW9ucy10YWJsZScsXG5cdFx0XHRcdFx0J3ZhbHVlJzogWyAnbWFudWFsX2VudHJ5JyBdLFxuXHRcdFx0XHR9LFxuXHRcdFx0XSxcblx0XHR9LFxuXHRcdHtcblx0XHRcdCdoYW5kbGVyJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1kYXRlX2Rpc3BsYXlfdHlwZSBzZWxlY3QnLFxuXHRcdFx0J2hhbmRsZXJUeXBlJzogJ3NlbGVjdCcsXG5cdFx0XHQnZXZlbnQnOiAnY2hhbmdlJyxcblx0XHRcdCdkZXBlbmRhbnQnOiBbXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLmRhdGUtdG8tdWktb3B0aW9ucycsXG5cdFx0XHRcdFx0J3ZhbHVlJzogWyAnaW5wdXRfZGF0ZV9yYW5nZScgXSxcblx0XHRcdFx0fSxcblx0XHRcdFx0e1xuXHRcdFx0XHRcdCdzZWxlY3Rvcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtZGF0ZV9mb3JtYXQnLFxuXHRcdFx0XHRcdCd2YWx1ZSc6IFsgJ2lucHV0X2RhdGUnLCAnaW5wdXRfZGF0ZV9yYW5nZScgXSxcblx0XHRcdFx0fSxcblx0XHRcdFx0e1xuXHRcdFx0XHRcdCdzZWxlY3Rvcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtdGltZV9wZXJpb2RfcXVlcnlfdHlwZScsXG5cdFx0XHRcdFx0J3ZhbHVlJzogWyAndGltZV9wZXJpb2RfY2hlY2tib3gnLCAndGltZV9wZXJpb2RfbXVsdGlzZWxlY3QnIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLXRpbWVfcGVyaW9kX3NlbGVjdF9hbGxfaXRlbXNfbGFiZWwnLFxuXHRcdFx0XHRcdCd2YWx1ZSc6IFsgJ3RpbWVfcGVyaW9kX3JhZGlvJywgJ3RpbWVfcGVyaW9kX3NlbGVjdCcgXSxcblx0XHRcdFx0fSxcblx0XHRcdFx0e1xuXHRcdFx0XHRcdCdzZWxlY3Rvcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtdGltZV9wZXJpb2RfdXNlX2Nob3NlbicsXG5cdFx0XHRcdFx0J3ZhbHVlJzogWyAndGltZV9wZXJpb2Rfc2VsZWN0JywgJ3RpbWVfcGVyaW9kX211bHRpc2VsZWN0JyBdLFxuXHRcdFx0XHR9LFxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0J3NlbGVjdG9yJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC10aW1lX3BlcmlvZF9lbmFibGVfbXVsdGlwbGVfZmlsdGVyJyxcblx0XHRcdFx0XHQndmFsdWUnOiBbICd0aW1lX3BlcmlvZF9sYWJlbCcgXSxcblx0XHRcdFx0fSxcblx0XHRcdFx0e1xuXHRcdFx0XHRcdCdzZWxlY3Rvcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtdGltZV9wZXJpb2Rfc2hvd19jb3VudCcsXG5cdFx0XHRcdFx0J3ZhbHVlJzogWyAndGltZV9wZXJpb2RfY2hlY2tib3gnLCAndGltZV9wZXJpb2RfcmFkaW8nLCAndGltZV9wZXJpb2Rfc2VsZWN0JywgJ3RpbWVfcGVyaW9kX211bHRpc2VsZWN0JywgJ3RpbWVfcGVyaW9kX2xhYmVsJyBdLFxuXHRcdFx0XHR9LFxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0J3NlbGVjdG9yJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC10aW1lX3BlcmlvZF9oaWRlX2VtcHR5Jyxcblx0XHRcdFx0XHQndmFsdWUnOiBbICd0aW1lX3BlcmlvZF9jaGVja2JveCcsICd0aW1lX3BlcmlvZF9yYWRpbycsICd0aW1lX3BlcmlvZF9zZWxlY3QnLCAndGltZV9wZXJpb2RfbXVsdGlzZWxlY3QnLCAndGltZV9wZXJpb2RfbGFiZWwnIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRdLFxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0J2hhbmRsZXInOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLXRpbWVfcGVyaW9kX3VzZV9jaG9zZW4gaW5wdXQnLFxuXHRcdFx0J2hhbmRsZXJUeXBlJzogJ2NoZWNrYm94Jyxcblx0XHRcdCdldmVudCc6ICdjaGFuZ2UnLFxuXHRcdFx0J2RlcGVuZGFudCc6IFtcblx0XHRcdFx0e1xuXHRcdFx0XHRcdCdzZWxlY3Rvcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtdGltZV9wZXJpb2RfY2hvc2VuX25vX3Jlc3VsdHNfbWVzc2FnZScsXG5cdFx0XHRcdFx0J3ZhbHVlJzogWyAnMScgXSxcblx0XHRcdFx0fSxcblx0XHRcdF0sXG5cdFx0fSxcblx0XHR7XG5cdFx0XHQnaGFuZGxlcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtZW5hYmxlX3NvZnRfbGltaXQgaW5wdXQnLFxuXHRcdFx0J2hhbmRsZXJUeXBlJzogJ3JhZGlvJyxcblx0XHRcdCdldmVudCc6ICdjaGFuZ2UnLFxuXHRcdFx0J2RlcGVuZGFudCc6IFtcblx0XHRcdFx0e1xuXHRcdFx0XHRcdCdzZWxlY3Rvcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtc29mdF9saW1pdCcsXG5cdFx0XHRcdFx0J3ZhbHVlJzogWyAnZW5hYmxlJyBdLFxuXHRcdFx0XHR9LFxuXHRcdFx0XSxcblx0XHR9LFxuXHRcdHtcblx0XHRcdCdoYW5kbGVyJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC10YXhvbm9teSBzZWxlY3QnLFxuXHRcdFx0J2hhbmRsZXJUeXBlJzogJ3NlbGVjdCcsXG5cdFx0XHQnZXZlbnQnOiAnY2hhbmdlJyxcblx0XHR9LFxuXHRcdHtcblx0XHRcdCdoYW5kbGVyJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1jdXN0b20tdGF4b25vbXkgc2VsZWN0Jyxcblx0XHRcdCdoYW5kbGVyVHlwZSc6ICdzZWxlY3QnLFxuXHRcdFx0J2V2ZW50JzogJ2NoYW5nZScsXG5cdFx0fSxcblx0XHR7XG5cdFx0XHQnaGFuZGxlcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtbWV0YV9rZXkgc2VsZWN0Jyxcblx0XHRcdCdoYW5kbGVyVHlwZSc6ICdzZWxlY3QnLFxuXHRcdFx0J2V2ZW50JzogJ2NoYW5nZScsXG5cdFx0fSxcblx0XHR7XG5cdFx0XHQnaGFuZGxlcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtcG9zdF9wcm9wZXJ0eSBzZWxlY3QnLFxuXHRcdFx0J2hhbmRsZXJUeXBlJzogJ3NlbGVjdCcsXG5cdFx0XHQnZXZlbnQnOiAnY2hhbmdlJyxcblx0XHR9LFxuXHRcdHtcblx0XHRcdCdoYW5kbGVyJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1saW1pdF9vcHRpb25zIHNlbGVjdCcsXG5cdFx0XHQnaGFuZGxlclR5cGUnOiAnc2VsZWN0Jyxcblx0XHRcdCdldmVudCc6ICdjaGFuZ2UnLFxuXHRcdFx0J2RlcGVuZGFudCc6IFtcblx0XHRcdFx0e1xuXHRcdFx0XHRcdCdzZWxlY3Rvcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtcGFyZW50X3Rlcm0nLFxuXHRcdFx0XHRcdCd2YWx1ZSc6IFsgJ2NoaWxkJyBdLFxuXHRcdFx0XHR9LFxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0J3NlbGVjdG9yJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1saW1pdF92YWx1ZXNfYnlfaWQnLFxuXHRcdFx0XHRcdCd2YWx1ZSc6IFsgJ2luY2x1ZGUnLCAnZXhjbHVkZScgXSxcblx0XHRcdFx0fSxcblx0XHRcdF0sXG5cdFx0fSxcblx0XHR7XG5cdFx0XHQnaGFuZGxlcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtZW5hYmxlX2FjY29yZGlvbiBpbnB1dCcsXG5cdFx0XHQnaGFuZGxlclR5cGUnOiAnY2hlY2tib3gnLFxuXHRcdFx0J2V2ZW50JzogJ2NoYW5nZScsXG5cdFx0XHQnZGVwZW5kYW50JzogW1xuXHRcdFx0XHR7XG5cdFx0XHRcdFx0J3NlbGVjdG9yJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1hY2NvcmRpb25fZGVmYXVsdF9zdGF0ZScsXG5cdFx0XHRcdFx0J3ZhbHVlJzogWyAnMScgXSxcblx0XHRcdFx0fSxcblx0XHRcdF0sXG5cdFx0fSxcblx0XHR7XG5cdFx0XHQnaGFuZGxlcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtZW5hYmxlX211bHRpcGxlX2ZpbHRlciBpbnB1dCcsXG5cdFx0XHQnaGFuZGxlclR5cGUnOiAnY2hlY2tib3gnLFxuXHRcdFx0J2V2ZW50JzogJ2NoYW5nZScsXG5cdFx0fSxcblx0XHR7XG5cdFx0XHQnaGFuZGxlcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtdXNlX2NhdGVnb3J5X2ltYWdlcyBpbnB1dCcsXG5cdFx0XHQnaGFuZGxlclR5cGUnOiAnY2hlY2tib3gnLFxuXHRcdFx0J2V2ZW50JzogJ2NoYW5nZScsXG5cdFx0fSxcblx0XHR7XG5cdFx0XHQnaGFuZGxlcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtbnVtYmVyX3JhbmdlX2VuYWJsZV9tdWx0aXBsZV9maWx0ZXIgaW5wdXQnLFxuXHRcdFx0J2hhbmRsZXJUeXBlJzogJ2NoZWNrYm94Jyxcblx0XHRcdCdldmVudCc6ICdjaGFuZ2UnLFxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0J2hhbmRsZXInOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLXRpbWVfcGVyaW9kX2VuYWJsZV9tdWx0aXBsZV9maWx0ZXIgaW5wdXQnLFxuXHRcdFx0J2hhbmRsZXJUeXBlJzogJ2NoZWNrYm94Jyxcblx0XHRcdCdldmVudCc6ICdjaGFuZ2UnLFxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0J2hhbmRsZXInOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLXNob3dfaWZfZW1wdHkgaW5wdXQnLFxuXHRcdFx0J2hhbmRsZXJUeXBlJzogJ2NoZWNrYm94Jyxcblx0XHRcdCdldmVudCc6ICdjaGFuZ2UnLFxuXHRcdFx0J2RlcGVuZGFudCc6IFtcblx0XHRcdFx0e1xuXHRcdFx0XHRcdCdzZWxlY3Rvcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtZW1wdHlfZmlsdGVyX21lc3NhZ2UnLFxuXHRcdFx0XHRcdCd2YWx1ZSc6IFsgJzEnIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRdLFxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0J2hhbmRsZXInOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLXNob3dfdGl0bGUgaW5wdXQnLFxuXHRcdFx0J2hhbmRsZXJUeXBlJzogJ2NoZWNrYm94Jyxcblx0XHRcdCdldmVudCc6ICdjaGFuZ2UnLFxuXHRcdH0sXG5cdF07XG5cblx0ZnVuY3Rpb24gX2hhbmRsZVRvZ2dsZVJlcXVlc3QoIGRhdGEsIGN1cnJlbnRTZWxlY3RvciwgdmFsdWUgKSB7XG5cdFx0Y29uc3QgJGZpZWxkICAgICAgPSBjdXJyZW50U2VsZWN0b3IuY2xvc2VzdCggJy53Y2FwZi1mb3JtLWZpZWxkJyApO1xuXHRcdGNvbnN0IGhhbmRsZXIgICAgID0gZGF0YVsgJ2hhbmRsZXInIF07XG5cdFx0Y29uc3QgaGFuZGxlclR5cGUgPSBkYXRhWyAnaGFuZGxlclR5cGUnIF07XG5cdFx0Y29uc3QgZGVwZW5kYW50ICAgPSBkYXRhWyAnZGVwZW5kYW50JyBdO1xuXG5cdFx0bGV0IF92YWx1ZSA9IHZhbHVlO1xuXG5cdFx0aWYgKCAnY2hlY2tib3gnID09PSBoYW5kbGVyVHlwZSApIHtcblx0XHRcdF92YWx1ZSA9IGN1cnJlbnRTZWxlY3Rvci5pcyggJzpjaGVja2VkJyApID8gJzEnIDogJzAnO1xuXHRcdH1cblxuXHRcdGlmICggJ3JhZGlvJyA9PT0gaGFuZGxlclR5cGUgKSB7XG5cdFx0XHRfdmFsdWUgPSAkZmllbGQuZmluZCggaGFuZGxlciArICc6Y2hlY2tlZCcgKS52YWwoKTtcblx0XHR9XG5cblx0XHQkLmVhY2goIGRlcGVuZGFudCwgZnVuY3Rpb24oIGlkLCBkICkge1xuXHRcdFx0Y29uc3QgJHNlbGVjdG9yICAgPSAkZmllbGQuZmluZCggZFsgJ3NlbGVjdG9yJyBdICk7XG5cdFx0XHRjb25zdCB2YWxpZFZhbHVlcyA9IGRbICd2YWx1ZScgXTtcblxuXHRcdFx0aWYgKCB2YWxpZFZhbHVlcy5pbmNsdWRlcyggX3ZhbHVlICkgKSB7XG5cdFx0XHRcdCRzZWxlY3Rvci5zaG93KCk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHQkc2VsZWN0b3IuaGlkZSgpO1xuXHRcdFx0fVxuXHRcdH0gKTtcblxuXHRcdGZpZWxkV3JhcHBlci50cmlnZ2VyKCAnYWZ0ZXJfdG9nZ2xlX3JlcXVlc3QnLCBbIGhhbmRsZXIsIF92YWx1ZSwgJGZpZWxkIF0gKTtcblx0fVxuXG5cdGZ1bmN0aW9uIGhhbmRsZVRvZ2dsZVJlcXVlc3QoIGRhdGEsIGN1cnJlbnRTZWxlY3RvciwgdmFsdWUgKSB7XG5cdFx0aWYgKCBudWxsID09PSBjdXJyZW50U2VsZWN0b3IgKSB7XG5cdFx0XHRjb25zdCBoYW5kbGVyICA9IGRhdGFbICdoYW5kbGVyJyBdO1xuXHRcdFx0Y29uc3QgJGhhbmRsZXIgPSAkKCBoYW5kbGVyICk7XG5cblx0XHRcdCQuZWFjaCggJGhhbmRsZXIsIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRjb25zdCBfdGhpcyAgPSAkKCB0aGlzICk7XG5cdFx0XHRcdGNvbnN0IF92YWx1ZSA9IF90aGlzLnZhbCgpO1xuXHRcdFx0XHRfaGFuZGxlVG9nZ2xlUmVxdWVzdCggZGF0YSwgX3RoaXMsIF92YWx1ZSApO1xuXHRcdFx0fSApO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRfaGFuZGxlVG9nZ2xlUmVxdWVzdCggZGF0YSwgY3VycmVudFNlbGVjdG9yLCB2YWx1ZSApO1xuXHRcdH1cblx0fVxuXG5cdGZ1bmN0aW9uIHNldHVwRmllbGQoIGluaXRhbCA9IGZhbHNlICkge1xuXHRcdCQuZWFjaCggZGVwZW5kYW50RGF0YSwgZnVuY3Rpb24oIGksIGRhdGEgKSB7XG5cdFx0XHRjb25zdCBoYW5kbGVyID0gZGF0YVsgJ2hhbmRsZXInIF07XG5cdFx0XHRjb25zdCBldmVudCAgID0gZGF0YVsgJ2V2ZW50JyBdO1xuXG5cdFx0XHRoYW5kbGVUb2dnbGVSZXF1ZXN0KCBkYXRhLCBudWxsLCBudWxsICk7XG5cblx0XHRcdGlmICggaW5pdGFsICkge1xuXHRcdFx0XHRmaWVsZFdyYXBwZXIub24oIGV2ZW50LCBoYW5kbGVyLCBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHRjb25zdCBfdGhpcyAgPSAkKCB0aGlzICk7XG5cdFx0XHRcdFx0Y29uc3QgX3ZhbHVlID0gJCggdGhpcyApLnZhbCgpO1xuXHRcdFx0XHRcdGhhbmRsZVRvZ2dsZVJlcXVlc3QoIGRhdGEsIF90aGlzLCBfdmFsdWUgKTtcblx0XHRcdFx0fSApO1xuXG5cdFx0XHRcdGlmICggISAkKCBmaWVsZFdyYXBwZXIgKS5oYXNDbGFzcyggJ2xvYWRlZCcgKSApIHtcblx0XHRcdFx0XHQkKCBmaWVsZFdyYXBwZXIgKS5hZGRDbGFzcyggJ2xvYWRlZCcgKTtcblxuXHRcdFx0XHRcdGZpZWxkV3JhcHBlci50cmlnZ2VyKCAnZmllbGRfYWRkZWQnICk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9ICk7XG5cdH1cblxuXHRzZXR1cEZpZWxkKCB0cnVlICk7XG5cblx0ZmllbGRXcmFwcGVyLm9uKCAnZmllbGRfYWRkZWQnLCBmdW5jdGlvbigpIHtcblx0XHQvLyBUb2dnbGUgdGhlIHZpc2liaWxpdHkgb2Ygc3ViZmllbGRzLlxuXHRcdHNldHVwRmllbGQoKTtcblx0fSApO1xuXG59ICk7XG4iXX0=
