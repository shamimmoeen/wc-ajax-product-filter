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
var fieldStates = {};
jQuery(document).ready(function ($) {
  var fieldWrapper = $('#chosen_field_wrapper');

  function storeFieldState() {
    var fieldType = fieldWrapper.find('#field_data').attr('data-field-type');

    if (!fieldType) {
      return;
    }

    var fieldValues = {};
    fieldWrapper.find('[name]:not(.manual_options)').each(function () {
      var $input = $(this);
      var type = $input.attr('type');
      var name = $input.attr('name');

      if ('checkbox' === type || 'radio' === type) {
        if ($input.is(':checked')) {
          fieldValues[name] = $input.val();
        }
      } else {
        fieldValues[name] = $input.val();
      }
    });

    if (fieldWrapper.find('.manual_options')) {
      var raw = fieldWrapper.find('.manual_options').val();

      if (raw) {
        fieldValues['manual_options'] = raw;
      }
    }

    fieldStates[fieldType] = fieldValues;
  } // Store the initial field state.


  storeFieldState();
  fieldWrapper.find('[name]').on('change', function () {
    storeFieldState();
  });

  function applyFieldState(fieldType) {
    var fieldState = fieldStates[fieldType];
    fieldWrapper.find('[name]').each(function () {
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
      var raw = fieldState['manual_options'];

      if (!raw) {
        return;
      }

      var $rawInput = fieldWrapper.find('.manual_options');
      $rawInput.val(raw);
      var manualOptions = JSON.parse(decodeURIComponent(raw));

      if (!manualOptions) {
        return;
      }

      var tableIdentifier = $rawInput.attr('data-table');
      var rowTemplateId = $rawInput.attr('data-tmpl'); // Bail out if no tmpl found for the type.

      if (!jQuery('#tmpl-' + rowTemplateId).length) {
        return;
      }

      var fieldIdentifier = '.wcapf-form-field';
      var rowsIdentifier = '.field-table-body-rows';
      var rowIdentifier = '.row-item';
      var $field = fieldWrapper.find(fieldIdentifier);
      var $table = $field.find(tableIdentifier);
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
      storeFieldState();
    });
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
  function generateProductPrices($form, data) {
    var $progressWrapper = $form.find('.progress-stat'),
        $progressbar = $progressWrapper.find('.progressbar > div'),
        $progressCount = $progressWrapper.find('.count'),
        $progressTotal = $progressWrapper.find('.total'),
        $submitBtn = $form.find('.button'),
        $successMessage = $form.find('.success-message'),
        $errorMessage = $form.find('.error-message');
    var wcapf_params = window['wcapf_admin_params'];
    var ajaxurl = wcapf_params['ajaxurl'];
    $.ajax({
      url: ajaxurl,
      type: 'POST',
      dataType: 'json',
      data: data,
      success: function success(response) {
        var message = response.message;
        var _data = response.data;
        var status = _data['status'];
        var page = _data['page'];
        var count = _data['count'];
        var percentage = _data['percentage'];
        var totalProducts = _data['total_products'];

        if (response.success === 'true') {
          $progressCount.html(count);
          $progressbar.css('width', percentage + '%');

          if (!$progressWrapper.hasClass('active')) {
            $progressWrapper.addClass('active');
          }

          if (status === 'incomplete') {
            $progressTotal.html(totalProducts);
            data['page'] = page;
            data['count'] = count;
            generateProductPrices($form, data);
          } else {
            setTimeout(function () {
              $progressWrapper.removeClass('active');
              $progressbar.css('width', '0');
              $submitBtn.removeAttr('disabled');
              $successMessage.html(message);
            }, 1500);
          }
        } else {
          $submitBtn.removeAttr('disabled');
          $errorMessage.html(message);
        }
      }
    }).fail(function (response) {
      $progressWrapper.removeClass('active');
      $progressbar.css('width', '0');
      $submitBtn.removeAttr('disabled');

      if (window.console && window.console.log) {
        console.log(response);
      }
    });
  }

  $('.wrap').on('submit', '#generate-product-prices', function (e) {
    e.preventDefault();
    var $form = $(this),
        $progressWrapper = $form.find('.progress-stat'),
        $progressbar = $progressWrapper.find('.progressbar > div'),
        $submitBtn = $form.find('.button'),
        $successMessage = $form.find('.success-message'),
        $errorMessage = $form.find('.error-message'),
        data = $form.serializeObject();
    $progressbar.css('width', '0');
    $successMessage.html('');
    $errorMessage.html('');
    $submitBtn.attr('disabled', 'disabled');
    generateProductPrices($form, data);
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
 * Taxonomy's default field key.
 *
 * @since      3.0.0
 * @package    wc-ajax-product-filter
 * @subpackage wc-ajax-product-filter/admin/src/js
 * @author     Mainul Hassan Main
 */
jQuery(document).ready(function ($) {
  var fieldWrapper = $('#chosen_field_wrapper');
  fieldWrapper.on('after_toggle_request', function (e, handler, value, $field) {
    if ('.wcapf-form-sub-field-taxonomy select' === handler) {
      var $fieldKey = $field.find('.wcapf-form-sub-field-field_key'); // Prepend dash to avoid conflicting with the registered taxonomies.

      if (value) {
        value = '_' + value;
      }

      $fieldKey.find('input[type="text"]').val(value);
    }
  });
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
    'handlerType': 'radio',
    'event': 'change',
    'dependant': [{
      'selector': '.wcapf-form-sub-field-accordion_default_state',
      'value': ['yes']
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImN1c3RvbS1hcHBlYXJhbmNlLWZpZWxkcy5qcyIsImRpc3BsYXktdHlwZS1maWVsZHMuanMiLCJmaWVsZC1tZXRhLWJveC5qcyIsImdlbmVyYXRlLXByb2R1Y3QtcHJpY2VzLmpzIiwibWFudWFsLW9wdGlvbnMtdGFibGUuanMiLCJudW1iZXItdWktb3B0aW9ucy5qcyIsInByb2R1Y3Qtc3RhdHVzLXRhYmxlLmpzIiwidGF4b25vbXktZGVmYXVsdC1maWVsZC1rZXkuanMiLCJ0b2dnbGVWaXNpYmlsaXR5LmpzIl0sIm5hbWVzIjpbImpRdWVyeSIsImRvY3VtZW50IiwicmVhZHkiLCIkIiwiZmllbGRXcmFwcGVyIiwib24iLCJlIiwiaGFuZGxlciIsInZhbHVlIiwiJGZpZWxkIiwiJHF1ZXJ5VHlwZSIsImZpbmQiLCJ2YWxpZERpc3BsYXlUeXBlcyIsImluY2x1ZGVzIiwiJG11bHRpcGxlRmlsdGVyIiwiaXMiLCJzaG93IiwiaGlkZSIsIiRkaXNwbGF5VHlwZSIsImRpc3BsYXlUeXBlIiwidmFsIiwiJG5vUmVzdWx0cyIsIiRhbGxJdGVtc0xhYmVsIiwidXNlQ2hvc2VuIiwiZmllbGRTdGF0ZXMiLCJzdG9yZUZpZWxkU3RhdGUiLCJmaWVsZFR5cGUiLCJhdHRyIiwiZmllbGRWYWx1ZXMiLCJlYWNoIiwiJGlucHV0IiwidHlwZSIsIm5hbWUiLCJyYXciLCJhcHBseUZpZWxkU3RhdGUiLCJmaWVsZFN0YXRlIiwicmVtb3ZlQXR0ciIsIiRyYXdJbnB1dCIsIm1hbnVhbE9wdGlvbnMiLCJKU09OIiwicGFyc2UiLCJkZWNvZGVVUklDb21wb25lbnQiLCJ0YWJsZUlkZW50aWZpZXIiLCJyb3dUZW1wbGF0ZUlkIiwibGVuZ3RoIiwiZmllbGRJZGVudGlmaWVyIiwicm93c0lkZW50aWZpZXIiLCJyb3dJZGVudGlmaWVyIiwiJHRhYmxlIiwiJHJvd3MiLCJpIiwib3B0aW9uIiwidGVtcGxhdGUiLCJ3cCIsInJvd0RlZmF1bHRPcHRpb25zIiwicmVuZGVyZWQiLCJhcHBlbmQiLCIkbGFzdFJvdyIsImxhc3QiLCIkdGhpcyIsImFkZENsYXNzIiwidHJpZ2dlciIsIl9maWVsZFR5cGUiLCJmaWVsZE5hbWUiLCJmaWVsZERhdGFXcmFwcGVyIiwiZmllbGROYW1lV3JhcHBlciIsImZpZWxkSW5zaWRlIiwicmVtb3ZlQ2xhc3MiLCJodG1sIiwiZ2VuZXJhdGVQcm9kdWN0UHJpY2VzIiwiJGZvcm0iLCJkYXRhIiwiJHByb2dyZXNzV3JhcHBlciIsIiRwcm9ncmVzc2JhciIsIiRwcm9ncmVzc0NvdW50IiwiJHByb2dyZXNzVG90YWwiLCIkc3VibWl0QnRuIiwiJHN1Y2Nlc3NNZXNzYWdlIiwiJGVycm9yTWVzc2FnZSIsIndjYXBmX3BhcmFtcyIsIndpbmRvdyIsImFqYXh1cmwiLCJhamF4IiwidXJsIiwiZGF0YVR5cGUiLCJzdWNjZXNzIiwicmVzcG9uc2UiLCJtZXNzYWdlIiwiX2RhdGEiLCJzdGF0dXMiLCJwYWdlIiwiY291bnQiLCJwZXJjZW50YWdlIiwidG90YWxQcm9kdWN0cyIsImNzcyIsImhhc0NsYXNzIiwic2V0VGltZW91dCIsImZhaWwiLCJjb25zb2xlIiwibG9nIiwicHJldmVudERlZmF1bHQiLCJzZXJpYWxpemVPYmplY3QiLCJpbml0TWFudWFsT3B0aW9uc1RhYmxlIiwidmFsdWVJZGVudGlmaWVyIiwiaW5pdFNvcnRhYmxlVGFibGUiLCIkc2VsZWN0b3IiLCJzb3J0YWJsZSIsIm9wYWNpdHkiLCJyZXZlcnQiLCJjdXJzb3IiLCJheGlzIiwiaGFuZGxlIiwicGxhY2Vob2xkZXIiLCJ1cGRhdGUiLCJ0YXJnZXQiLCJjbG9zZXN0IiwidHJpZ2dlck9wdGlvbnNDaGFuZ2UiLCJkaXNhYmxlU2VsZWN0aW9uIiwidGFibGVSb3dzSWRlbnRpZmllciIsIiR2YWx1ZUhvbGRlciIsIl9yb3dzIiwiX2l0ZW0iLCIkaXRlbSIsIm9iaiIsImZpZWxkSW5kZXgiLCJmaWVsZCIsInB1c2giLCJyYXdWYWx1ZXMiLCJlbmNvZGVVUklDb21wb25lbnQiLCJzdHJpbmdpZnkiLCJ0cmlnZ2VyUmVtb3ZlT3B0aW9uIiwiJG9wdGlvbnNUYWJsZSIsInRhYmxlUm93cyIsImNoaWxkcmVuIiwicmVtb3ZlQnRuSWRlbnRpZmllciIsInJlbW92ZSIsImNsZWFyT3B0aW9uc0J0bklkZW50aWZpZXIiLCJlbXB0eSIsImFkZE9wdGlvbkJ0bklkZW50aWZpZXIiLCJ0ZXh0RmllbGRzSWRlbnRpZmllciIsInNlbGVjdEZpZWxkc0lkZW50aWZpZXIiLCJ0YWJsZUlkIiwidG9nZ2xlTnVtYmVyTWluVmFsdWVGaWVsZCIsIiRlbG0iLCIkdGV4dEZpZWxkIiwidG9nZ2xlTnVtYmVyTWF4VmFsdWVGaWVsZCIsIiRmaWVsZEtleSIsImRlcGVuZGFudERhdGEiLCJfaGFuZGxlVG9nZ2xlUmVxdWVzdCIsImN1cnJlbnRTZWxlY3RvciIsImhhbmRsZXJUeXBlIiwiZGVwZW5kYW50IiwiX3ZhbHVlIiwiaWQiLCJkIiwidmFsaWRWYWx1ZXMiLCJoYW5kbGVUb2dnbGVSZXF1ZXN0IiwiJGhhbmRsZXIiLCJfdGhpcyIsInNldHVwRmllbGQiLCJpbml0YWwiLCJldmVudCJdLCJtYXBwaW5ncyI6Ijs7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUFBLE1BQU0sQ0FBRUMsUUFBRixDQUFOLENBQW1CQyxLQUFuQixDQUEwQixVQUFVQyxDQUFWLEVBQWM7QUFFdkMsTUFBTUMsWUFBWSxHQUFHRCxDQUFDLENBQUUsdUJBQUYsQ0FBdEI7QUFFQUMsRUFBQUEsWUFBWSxDQUFDQyxFQUFiLENBQWlCLHNCQUFqQixFQUF5QyxVQUFVQyxDQUFWLEVBQWFDLE9BQWIsRUFBc0JDLEtBQXRCLEVBQTZCQyxNQUE3QixFQUFzQztBQUM5RSxRQUFLLGdEQUFnREYsT0FBckQsRUFBK0Q7QUFDOUQsVUFBTUcsVUFBVSxHQUFVRCxNQUFNLENBQUNFLElBQVAsQ0FBYSxrQ0FBYixDQUExQjtBQUNBLFVBQU1DLGlCQUFpQixHQUFHLENBQUUsT0FBRixFQUFXLE9BQVgsRUFBb0IsT0FBcEIsQ0FBMUI7O0FBRUEsVUFB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QUMsQ0FBRUMsWUFBRixDQUFELENBQWtCMkYsUUFBbEIsQ0FBNEIsUUFBNUIsQ0FBUCxFQUFnRDtBQUMvQzVGLFVBQUFBLENBQUMsQ0FBRUMsWUFBRixDQUFELENBQWtCd0QsUUFBbEIsQ0FBNEIsUUFBNUI7QUFFQXhELFVBQUFBLFlBQVksQ0FBQ3lELE9BQWIsQ0FBc0IsYUFBdEI7QUFDQTtBQUNEO0FBQ0QsS0FuQkQ7QUFvQkE7O0FBRURrRyxFQUFBQSxVQUFVLENBQUUsSUFBRixDQUFWO0FBRUEzSixFQUFBQSxZQUFZLENBQUNDLEVBQWIsQ0FBaUIsYUFBakIsRUFBZ0MsWUFBVztBQUMxQztBQUNBMEosSUFBQUEsVUFBVTtBQUNWLEdBSEQ7QUFLQSxDQXZZRCIsImZpbGUiOiJ3Yy1hamF4LXByb2R1Y3QtZmlsdGVyLWFkbWluLXNjcmlwdHMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIERpc3BsYXkgdHlwZSBmaWVsZHMuXG4gKlxuICogQHNpbmNlICAgICAgMy4wLjBcbiAqIEBwYWNrYWdlICAgIHdjLWFqYXgtcHJvZHVjdC1maWx0ZXJcbiAqIEBzdWJwYWNrYWdlIHdjLWFqYXgtcHJvZHVjdC1maWx0ZXIvYWRtaW4vc3JjL2pzXG4gKiBAYXV0aG9yICAgICBNYWludWwgSGFzc2FuIE1haW5cbiAqL1xuXG5qUXVlcnkoIGRvY3VtZW50ICkucmVhZHkoIGZ1bmN0aW9uKCAkICkge1xuXG5cdGNvbnN0IGZpZWxkV3JhcHBlciA9ICQoICcjY2hvc2VuX2ZpZWxkX3dyYXBwZXInICk7XG5cblx0ZmllbGRXcmFwcGVyLm9uKCAnYWZ0ZXJfdG9nZ2xlX3JlcXVlc3QnLCBmdW5jdGlvbiggZSwgaGFuZGxlciwgdmFsdWUsICRmaWVsZCApIHtcblx0XHRpZiAoICcud2NhcGYtZm9ybS1zdWItZmllbGQtZGlzcGxheV90eXBlIHNlbGVjdCcgPT09IGhhbmRsZXIgKSB7XG5cdFx0XHRjb25zdCAkcXVlcnlUeXBlICAgICAgICA9ICRmaWVsZC5maW5kKCAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLXF1ZXJ5X3R5cGUnICk7XG5cdFx0XHRjb25zdCB2YWxpZERpc3BsYXlUeXBlcyA9IFsgJ2xhYmVsJywgJ2NvbG9yJywgJ2ltYWdlJyBdO1xuXG5cdFx0XHRpZiAoIHZhbGlkRGlzcGxheVR5cGVzLmluY2x1ZGVzKCB2YWx1ZSApICkge1xuXHRcdFx0XHRjb25zdCAkbXVsdGlwbGVGaWx0ZXIgPSAkZmllbGQuZmluZCggJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1lbmFibGVfbXVsdGlwbGVfZmlsdGVyIGlucHV0JyApO1xuXG5cdFx0XHRcdGlmICggJG11bHRpcGxlRmlsdGVyLmlzKCAnOmNoZWNrZWQnICkgKSB7XG5cdFx0XHRcdFx0JHF1ZXJ5VHlwZS5zaG93KCk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0JHF1ZXJ5VHlwZS5oaWRlKCk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cdH0gKTtcblxuXHRmaWVsZFdyYXBwZXIub24oICdhZnRlcl90b2dnbGVfcmVxdWVzdCcsIGZ1bmN0aW9uKCBlLCBoYW5kbGVyLCB2YWx1ZSwgJGZpZWxkICkge1xuXHRcdGlmICggJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1lbmFibGVfbXVsdGlwbGVfZmlsdGVyIGlucHV0JyA9PT0gaGFuZGxlciApIHtcblx0XHRcdGNvbnN0ICRxdWVyeVR5cGUgICAgICAgID0gJGZpZWxkLmZpbmQoICcud2NhcGYtZm9ybS1zdWItZmllbGQtcXVlcnlfdHlwZScgKTtcblx0XHRcdGNvbnN0ICRkaXNwbGF5VHlwZSAgICAgID0gJGZpZWxkLmZpbmQoICcud2NhcGYtZm9ybS1zdWItZmllbGQtZGlzcGxheV90eXBlIHNlbGVjdCcgKTtcblx0XHRcdGNvbnN0IGRpc3BsYXlUeXBlICAgICAgID0gJGRpc3BsYXlUeXBlLnZhbCgpO1xuXHRcdFx0Y29uc3QgdmFsaWREaXNwbGF5VHlwZXMgPSBbICdsYWJlbCcsICdjb2xvcicsICdpbWFnZScgXTtcblxuXHRcdFx0aWYgKCB2YWxpZERpc3BsYXlUeXBlcy5pbmNsdWRlcyggZGlzcGxheVR5cGUgKSApIHtcblx0XHRcdFx0aWYgKCAnMScgPT09IHZhbHVlICkge1xuXHRcdFx0XHRcdCRxdWVyeVR5cGUuc2hvdygpO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdCRxdWVyeVR5cGUuaGlkZSgpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXHR9ICk7XG5cbn0gKTtcbiIsIi8qKlxuICogRGlzcGxheSB0eXBlIGZpZWxkcy5cbiAqXG4gKiBAc2luY2UgICAgICAzLjAuMFxuICogQHBhY2thZ2UgICAgd2MtYWpheC1wcm9kdWN0LWZpbHRlclxuICogQHN1YnBhY2thZ2Ugd2MtYWpheC1wcm9kdWN0LWZpbHRlci9hZG1pbi9zcmMvanNcbiAqIEBhdXRob3IgICAgIE1haW51bCBIYXNzYW4gTWFpblxuICovXG5cbmpRdWVyeSggZG9jdW1lbnQgKS5yZWFkeSggZnVuY3Rpb24oICQgKSB7XG5cblx0Y29uc3QgZmllbGRXcmFwcGVyID0gJCggJyNjaG9zZW5fZmllbGRfd3JhcHBlcicgKTtcblxuXHQvLyBPdmVycmlkZSBuby1yZXN1bHRzLW1lc3NhZ2UsIGFsbC1pdGVtcy1sYWJlbCBmaWVsZCdzIHRvZ2dsZSB2aXNpYmlsaXR5IHdoZW4gdGV4dCBkaXNwbGF5IHR5cGUgaXMgY2hhbmdlZC5cblx0ZmllbGRXcmFwcGVyLm9uKCAnYWZ0ZXJfdG9nZ2xlX3JlcXVlc3QnLCBmdW5jdGlvbiggZSwgaGFuZGxlciwgdmFsdWUsICRmaWVsZCApIHtcblx0XHRpZiAoICcud2NhcGYtZm9ybS1zdWItZmllbGQtZGlzcGxheV90eXBlIHNlbGVjdCcgPT09IGhhbmRsZXIgKSB7XG5cdFx0XHRjb25zdCAkbm9SZXN1bHRzICAgICA9ICRmaWVsZC5maW5kKCAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLWNob3Nlbl9ub19yZXN1bHRzX21lc3NhZ2UnICk7XG5cdFx0XHRjb25zdCAkYWxsSXRlbXNMYWJlbCA9ICRmaWVsZC5maW5kKCAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLWFsbF9pdGVtc19sYWJlbCcgKTtcblx0XHRcdGNvbnN0IHVzZUNob3NlbiAgICAgID0gJGZpZWxkLmZpbmQoICcud2NhcGYtZm9ybS1zdWItZmllbGQtdXNlX2Nob3NlbiBpbnB1dCcgKS5pcyggJzpjaGVja2VkJyApO1xuXG5cdFx0XHRpZiAoIHVzZUNob3NlbiAmJiAoICdzZWxlY3QnID09PSB2YWx1ZSB8fCAnbXVsdGktc2VsZWN0JyA9PT0gdmFsdWUgKSApIHtcblx0XHRcdFx0JG5vUmVzdWx0cy5zaG93KCk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHQkbm9SZXN1bHRzLmhpZGUoKTtcblx0XHRcdH1cblxuXHRcdFx0aWYgKCAoICdyYWRpbycgPT09IHZhbHVlIHx8ICdzZWxlY3QnID09PSB2YWx1ZSApIHx8ICggJ211bHRpLXNlbGVjdCcgPT09IHZhbHVlICYmIHVzZUNob3NlbiApICkge1xuXHRcdFx0XHQkYWxsSXRlbXNMYWJlbC5zaG93KCk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHQkYWxsSXRlbXNMYWJlbC5oaWRlKCk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9ICk7XG5cblx0Ly8gT3ZlcnJpZGUgbm8tcmVzdWx0cy1tZXNzYWdlLCBhbGwtaXRlbXMtbGFiZWwgZmllbGQncyB0b2dnbGUgdmlzaWJpbGl0eSB3aGVuIHRleHQgdXNlIGNob3NlbiBpcyBjaGFuZ2VkLlxuXHRmaWVsZFdyYXBwZXIub24oICdhZnRlcl90b2dnbGVfcmVxdWVzdCcsIGZ1bmN0aW9uKCBlLCBoYW5kbGVyLCB2YWx1ZSwgJGZpZWxkICkge1xuXHRcdGlmICggJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC11c2VfY2hvc2VuIGlucHV0JyA9PT0gaGFuZGxlciApIHtcblx0XHRcdGNvbnN0ICRub1Jlc3VsdHMgICAgID0gJGZpZWxkLmZpbmQoICcud2NhcGYtZm9ybS1zdWItZmllbGQtY2hvc2VuX25vX3Jlc3VsdHNfbWVzc2FnZScgKTtcblx0XHRcdGNvbnN0ICRhbGxJdGVtc0xhYmVsID0gJGZpZWxkLmZpbmQoICcud2NhcGYtZm9ybS1zdWItZmllbGQtYWxsX2l0ZW1zX2xhYmVsJyApO1xuXHRcdFx0Y29uc3QgZGlzcGxheVR5cGUgICAgPSAkZmllbGQuZmluZCggJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1kaXNwbGF5X3R5cGUgc2VsZWN0JyApLnZhbCgpO1xuXG5cdFx0XHRpZiAoICcxJyA9PT0gdmFsdWUgJiYgKCAnc2VsZWN0JyA9PT0gZGlzcGxheVR5cGUgfHwgJ211bHRpLXNlbGVjdCcgPT09IGRpc3BsYXlUeXBlICkgKSB7XG5cdFx0XHRcdCRub1Jlc3VsdHMuc2hvdygpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0JG5vUmVzdWx0cy5oaWRlKCk7XG5cdFx0XHR9XG5cblx0XHRcdGlmIChcblx0XHRcdFx0KCAnMScgPT09IHZhbHVlICYmICdtdWx0aS1zZWxlY3QnID09PSBkaXNwbGF5VHlwZSApXG5cdFx0XHRcdHx8ICggJ3JhZGlvJyA9PT0gZGlzcGxheVR5cGUgfHwgJ3NlbGVjdCcgPT09IGRpc3BsYXlUeXBlIClcblx0XHRcdCkge1xuXHRcdFx0XHQkYWxsSXRlbXNMYWJlbC5zaG93KCk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHQkYWxsSXRlbXNMYWJlbC5oaWRlKCk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9ICk7XG5cbn0gKTtcbiIsIi8qKlxuICogRmllbGQgbWV0YSBib3guXG4gKlxuICogQHNpbmNlICAgICAgMy4wLjBcbiAqIEBwYWNrYWdlICAgIHdjLWFqYXgtcHJvZHVjdC1maWx0ZXJcbiAqIEBzdWJwYWNrYWdlIHdjLWFqYXgtcHJvZHVjdC1maWx0ZXIvYWRtaW4vc3JjL2pzXG4gKiBAYXV0aG9yICAgICBNYWludWwgSGFzc2FuIE1haW5cbiAqL1xuXG5jb25zdCBmaWVsZFN0YXRlcyA9IHt9O1xuXG5qUXVlcnkoIGRvY3VtZW50ICkucmVhZHkoIGZ1bmN0aW9uKCAkICkge1xuXG5cdGNvbnN0IGZpZWxkV3JhcHBlciA9ICQoICcjY2hvc2VuX2ZpZWxkX3dyYXBwZXInICk7XG5cblx0ZnVuY3Rpb24gc3RvcmVGaWVsZFN0YXRlKCkge1xuXHRcdGNvbnN0IGZpZWxkVHlwZSA9IGZpZWxkV3JhcHBlci5maW5kKCAnI2ZpZWxkX2RhdGEnICkuYXR0ciggJ2RhdGEtZmllbGQtdHlwZScgKTtcblxuXHRcdGlmICggISBmaWVsZFR5cGUgKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0Y29uc3QgZmllbGRWYWx1ZXMgPSB7fTtcblxuXHRcdGZpZWxkV3JhcHBlci5maW5kKCAnW25hbWVdOm5vdCgubWFudWFsX29wdGlvbnMpJyApLmVhY2goIGZ1bmN0aW9uKCkge1xuXHRcdFx0Y29uc3QgJGlucHV0ID0gJCggdGhpcyApO1xuXHRcdFx0Y29uc3QgdHlwZSAgID0gJGlucHV0LmF0dHIoICd0eXBlJyApO1xuXHRcdFx0Y29uc3QgbmFtZSAgID0gJGlucHV0LmF0dHIoICduYW1lJyApO1xuXG5cdFx0XHRpZiAoICdjaGVja2JveCcgPT09IHR5cGUgfHwgJ3JhZGlvJyA9PT0gdHlwZSApIHtcblx0XHRcdFx0aWYgKCAkaW5wdXQuaXMoICc6Y2hlY2tlZCcgKSApIHtcblx0XHRcdFx0XHRmaWVsZFZhbHVlc1sgbmFtZSBdID0gJGlucHV0LnZhbCgpO1xuXHRcdFx0XHR9XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRmaWVsZFZhbHVlc1sgbmFtZSBdID0gJGlucHV0LnZhbCgpO1xuXHRcdFx0fVxuXHRcdH0gKTtcblxuXHRcdGlmICggZmllbGRXcmFwcGVyLmZpbmQoICcubWFudWFsX29wdGlvbnMnICkgKSB7XG5cdFx0XHRjb25zdCByYXcgPSBmaWVsZFdyYXBwZXIuZmluZCggJy5tYW51YWxfb3B0aW9ucycgKS52YWwoKTtcblxuXHRcdFx0aWYgKCByYXcgKSB7XG5cdFx0XHRcdGZpZWxkVmFsdWVzWyAnbWFudWFsX29wdGlvbnMnIF0gPSByYXc7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0ZmllbGRTdGF0ZXNbIGZpZWxkVHlwZSBdID0gZmllbGRWYWx1ZXM7XG5cdH1cblxuXHQvLyBTdG9yZSB0aGUgaW5pdGlhbCBmaWVsZCBzdGF0ZS5cblx0c3RvcmVGaWVsZFN0YXRlKCk7XG5cblx0ZmllbGRXcmFwcGVyLmZpbmQoICdbbmFtZV0nICkub24oICdjaGFuZ2UnLCBmdW5jdGlvbigpIHtcblx0XHRzdG9yZUZpZWxkU3RhdGUoKTtcblx0fSApO1xuXG5cdGZ1bmN0aW9uIGFwcGx5RmllbGRTdGF0ZSggZmllbGRUeXBlICkge1xuXHRcdGNvbnN0IGZpZWxkU3RhdGUgPSBmaWVsZFN0YXRlc1sgZmllbGRUeXBlIF07XG5cblx0XHRmaWVsZFdyYXBwZXIuZmluZCggJ1tuYW1lXScgKS5lYWNoKCBmdW5jdGlvbigpIHtcblx0XHRcdGNvbnN0ICRpbnB1dCA9ICQoIHRoaXMgKTtcblx0XHRcdGNvbnN0IHR5cGUgICA9ICRpbnB1dC5hdHRyKCAndHlwZScgKTtcblx0XHRcdGNvbnN0IG5hbWUgICA9ICRpbnB1dC5hdHRyKCAnbmFtZScgKTtcblx0XHRcdGNvbnN0IHZhbHVlICA9IGZpZWxkU3RhdGVbIG5hbWUgXTtcblxuXHRcdFx0aWYgKCAnY2hlY2tib3gnID09PSB0eXBlIHx8ICdyYWRpbycgPT09IHR5cGUgKSB7XG5cdFx0XHRcdGlmICggbmFtZSBpbiBmaWVsZFN0YXRlICkge1xuXHRcdFx0XHRcdC8vIEFkZCAnY2hlY2tlZCcgYXR0cmlidXRlLlxuXHRcdFx0XHRcdGZpZWxkV3JhcHBlclxuXHRcdFx0XHRcdFx0LmZpbmQoICdbbmFtZT1cIicgKyBuYW1lICsgJ1wiXVt2YWx1ZT1cIicgKyB2YWx1ZSArICdcIl0nIClcblx0XHRcdFx0XHRcdC5hdHRyKCAnY2hlY2tlZCcsICdjaGVja2VkJyApO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdC8vIFJlbW92ZSAnY2hlY2tlZCcgYXR0cmlidXRlLlxuXHRcdFx0XHRcdGZpZWxkV3JhcHBlci5maW5kKCAnW25hbWU9XCInICsgbmFtZSArICdcIl0nICkucmVtb3ZlQXR0ciggJ2NoZWNrZWQnICk7XG5cdFx0XHRcdH1cblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdCRpbnB1dC52YWwoIHZhbHVlICk7XG5cdFx0XHR9XG5cdFx0fSApO1xuXG5cdFx0Ly8gUHJvY2VzcyB0aGUgbWFudWFsIG9wdGlvbnMuXG5cdFx0aWYgKCAnbWFudWFsX29wdGlvbnMnIGluIGZpZWxkU3RhdGUgKSB7XG5cdFx0XHRjb25zdCByYXcgPSBmaWVsZFN0YXRlWyAnbWFudWFsX29wdGlvbnMnIF07XG5cblx0XHRcdGlmICggISByYXcgKSB7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblxuXHRcdFx0Y29uc3QgJHJhd0lucHV0ID0gZmllbGRXcmFwcGVyLmZpbmQoICcubWFudWFsX29wdGlvbnMnICk7XG5cblx0XHRcdCRyYXdJbnB1dC52YWwoIHJhdyApO1xuXG5cdFx0XHRjb25zdCBtYW51YWxPcHRpb25zID0gSlNPTi5wYXJzZSggZGVjb2RlVVJJQ29tcG9uZW50KCByYXcgKSApO1xuXG5cdFx0XHRpZiAoICEgbWFudWFsT3B0aW9ucyApIHtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXG5cdFx0XHRjb25zdCB0YWJsZUlkZW50aWZpZXIgPSAkcmF3SW5wdXQuYXR0ciggJ2RhdGEtdGFibGUnICk7XG5cdFx0XHRjb25zdCByb3dUZW1wbGF0ZUlkICAgPSAkcmF3SW5wdXQuYXR0ciggJ2RhdGEtdG1wbCcgKTtcblxuXHRcdFx0Ly8gQmFpbCBvdXQgaWYgbm8gdG1wbCBmb3VuZCBmb3IgdGhlIHR5cGUuXG5cdFx0XHRpZiAoICEgalF1ZXJ5KCAnI3RtcGwtJyArIHJvd1RlbXBsYXRlSWQgKS5sZW5ndGggKSB7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblxuXHRcdFx0Y29uc3QgZmllbGRJZGVudGlmaWVyID0gJy53Y2FwZi1mb3JtLWZpZWxkJztcblx0XHRcdGNvbnN0IHJvd3NJZGVudGlmaWVyICA9ICcuZmllbGQtdGFibGUtYm9keS1yb3dzJztcblx0XHRcdGNvbnN0IHJvd0lkZW50aWZpZXIgICA9ICcucm93LWl0ZW0nO1xuXG5cdFx0XHRjb25zdCAkZmllbGQgPSBmaWVsZFdyYXBwZXIuZmluZCggZmllbGRJZGVudGlmaWVyICk7XG5cdFx0XHRjb25zdCAkdGFibGUgPSAkZmllbGQuZmluZCggdGFibGVJZGVudGlmaWVyICk7XG5cdFx0XHRjb25zdCAkcm93cyAgPSAkdGFibGUuZmluZCggcm93c0lkZW50aWZpZXIgKTtcblxuXHRcdFx0JC5lYWNoKCBtYW51YWxPcHRpb25zLCBmdW5jdGlvbiggaSwgb3B0aW9uICkge1xuXHRcdFx0XHRjb25zdCB0ZW1wbGF0ZSA9IHdwLnRlbXBsYXRlKCByb3dUZW1wbGF0ZUlkICk7XG5cblx0XHRcdFx0bGV0IHJvd0RlZmF1bHRPcHRpb25zID0ge307XG5cblx0XHRcdFx0aWYgKCAnLm1hbnVhbC1vcHRpb25zLXRhYmxlJyA9PT0gdGFibGVJZGVudGlmaWVyICkge1xuXHRcdFx0XHRcdHJvd0RlZmF1bHRPcHRpb25zID0ge1xuXHRcdFx0XHRcdFx0J3ZhbHVlJzogJycsXG5cdFx0XHRcdFx0XHQnbGFiZWwnOiAnJyxcblx0XHRcdFx0XHR9O1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0Y29uc3QgcmVuZGVyZWQgPSB0ZW1wbGF0ZSggcm93RGVmYXVsdE9wdGlvbnMgKTtcblxuXHRcdFx0XHQkcm93cy5hcHBlbmQoIHJlbmRlcmVkICk7XG5cblx0XHRcdFx0Y29uc3QgJGxhc3RSb3cgPSAkcm93cy5maW5kKCByb3dJZGVudGlmaWVyICkubGFzdCgpO1xuXG5cdFx0XHRcdCRsYXN0Um93LmZpbmQoICdbZGF0YS1uYW1lXScgKS5lYWNoKCBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHRjb25zdCAkdGhpcyA9ICQoIHRoaXMgKTtcblx0XHRcdFx0XHRjb25zdCBuYW1lICA9ICR0aGlzLmF0dHIoICdkYXRhLW5hbWUnICk7XG5cdFx0XHRcdFx0Y29uc3QgdmFsdWUgPSBvcHRpb25bIG5hbWUgXTtcblxuXHRcdFx0XHRcdCR0aGlzLnZhbCggdmFsdWUgKTtcblxuXHRcdFx0XHRcdGlmICggJ2ltYWdlX3VybCcgPT09IG5hbWUgJiYgdmFsdWUgKSB7XG5cdFx0XHRcdFx0XHQkbGFzdFJvdy5maW5kKCAnLndwLWltYWdlLXBpY2tlci1jb250YWluZXInICkuYWRkQ2xhc3MoICdhY3RpdmUnICk7XG5cdFx0XHRcdFx0XHQkbGFzdFJvdy5maW5kKCAnaW1nJyApLmF0dHIoICdzcmMnLCB2YWx1ZSApO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSApO1xuXHRcdFx0fSApO1xuXG5cdFx0XHQkdGFibGUuYWRkQ2xhc3MoICdoYXMtb3B0aW9ucycgKTtcblxuXHRcdFx0ZmllbGRXcmFwcGVyLnRyaWdnZXIoICduZXdfb3B0aW9uX2FkZGVkJywgWyAkZmllbGQgXSApO1xuXHRcdH1cblx0fVxuXG5cdCQoICcjYXZhaWxhYmxlX2ZpZWxkcycgKS5vbiggJ2NoYW5nZScsICdbbmFtZT1cIl9hY3RpdmVfZmllbGRcIl0nLCBmdW5jdGlvbigpIHtcblx0XHRjb25zdCAkdGhpcyAgICAgID0gJCggdGhpcyApO1xuXHRcdGNvbnN0IF9maWVsZFR5cGUgPSAkdGhpcy52YWwoKTtcblx0XHRjb25zdCBmaWVsZE5hbWUgID0gJHRoaXMuYXR0ciggJ2RhdGEtZmllbGQtbmFtZScgKTtcblxuXHRcdGlmICggISBfZmllbGRUeXBlICkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdGNvbnN0IGZpZWxkVHlwZSA9ICd3Y2FwZi1mb3JtLWZpZWxkLScgKyBfZmllbGRUeXBlO1xuXG5cdFx0Ly8gQmFpbCBvdXQgaWYgbm8gdG1wbCBmb3VuZCBmb3IgdGhlIHR5cGUuXG5cdFx0aWYgKCAhIGpRdWVyeSggJyN0bXBsLScgKyBmaWVsZFR5cGUgKS5sZW5ndGggKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0Y29uc3QgdGVtcGxhdGUgICAgICAgICA9IHdwLnRlbXBsYXRlKCBmaWVsZFR5cGUgKTtcblx0XHRjb25zdCByZW5kZXJlZCAgICAgICAgID0gdGVtcGxhdGUoKTtcblx0XHRjb25zdCBmaWVsZERhdGFXcmFwcGVyID0gZmllbGRXcmFwcGVyLmZpbmQoICcjZmllbGRfZGF0YScgKTtcblx0XHRjb25zdCBmaWVsZE5hbWVXcmFwcGVyID0gZmllbGRXcmFwcGVyLmZpbmQoICcucG9zdGJveC1oZWFkZXIgaDInICk7XG5cdFx0Y29uc3QgZmllbGRJbnNpZGUgICAgICA9IGZpZWxkV3JhcHBlci5maW5kKCAnLmluc2lkZScgKTtcblxuXHRcdGZpZWxkV3JhcHBlci5yZW1vdmVDbGFzcyggJ2hpZGRlbicgKTtcblxuXHRcdGZpZWxkRGF0YVdyYXBwZXIuYXR0ciggJ2RhdGEtZmllbGQtdHlwZScsIF9maWVsZFR5cGUgKTtcblx0XHRmaWVsZE5hbWVXcmFwcGVyLmh0bWwoIGZpZWxkTmFtZSApO1xuXHRcdGZpZWxkSW5zaWRlLmh0bWwoIHJlbmRlcmVkICk7XG5cblx0XHQvLyBJZiBhbHJlYWR5IGZvdW5kIHRoZSBmaWVsZCBzdGF0ZSB0aGVuIGFwcGx5IGl0LCBvdGhlcndpc2Ugc3RvcmUgaXQuXG5cdFx0aWYgKCBfZmllbGRUeXBlIGluIGZpZWxkU3RhdGVzICkge1xuXHRcdFx0YXBwbHlGaWVsZFN0YXRlKCBfZmllbGRUeXBlICk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHN0b3JlRmllbGRTdGF0ZSgpO1xuXHRcdH1cblxuXHRcdGZpZWxkV3JhcHBlci50cmlnZ2VyKCAnZmllbGRfYWRkZWQnICk7XG5cblx0XHRmaWVsZFdyYXBwZXIuZmluZCggJ1tuYW1lXScgKS5vbiggJ2NoYW5nZScsIGZ1bmN0aW9uKCkge1xuXHRcdFx0c3RvcmVGaWVsZFN0YXRlKCk7XG5cdFx0fSApO1xuXHR9ICk7XG5cbn0gKTtcbiIsIi8qKlxuICogRmllbGQgbWV0YSBib3guXG4gKlxuICogQHNpbmNlICAgICAgMy4wLjBcbiAqIEBwYWNrYWdlICAgIHdjLWFqYXgtcHJvZHVjdC1maWx0ZXJcbiAqIEBzdWJwYWNrYWdlIHdjLWFqYXgtcHJvZHVjdC1maWx0ZXIvYWRtaW4vc3JjL2pzXG4gKiBAYXV0aG9yICAgICBNYWludWwgSGFzc2FuIE1haW5cbiAqL1xuXG5qUXVlcnkoIGRvY3VtZW50ICkucmVhZHkoIGZ1bmN0aW9uKCAkICkge1xuXG5cdGZ1bmN0aW9uIGdlbmVyYXRlUHJvZHVjdFByaWNlcyggJGZvcm0sIGRhdGEgKSB7XG5cdFx0Y29uc3QgJHByb2dyZXNzV3JhcHBlciA9ICRmb3JtLmZpbmQoICcucHJvZ3Jlc3Mtc3RhdCcgKSxcblx0XHRcdCAgJHByb2dyZXNzYmFyICAgICA9ICRwcm9ncmVzc1dyYXBwZXIuZmluZCggJy5wcm9ncmVzc2JhciA+IGRpdicgKSxcblx0XHRcdCAgJHByb2dyZXNzQ291bnQgICA9ICRwcm9ncmVzc1dyYXBwZXIuZmluZCggJy5jb3VudCcgKSxcblx0XHRcdCAgJHByb2dyZXNzVG90YWwgICA9ICRwcm9ncmVzc1dyYXBwZXIuZmluZCggJy50b3RhbCcgKSxcblx0XHRcdCAgJHN1Ym1pdEJ0biAgICAgICA9ICRmb3JtLmZpbmQoICcuYnV0dG9uJyApLFxuXHRcdFx0ICAkc3VjY2Vzc01lc3NhZ2UgID0gJGZvcm0uZmluZCggJy5zdWNjZXNzLW1lc3NhZ2UnICksXG5cdFx0XHQgICRlcnJvck1lc3NhZ2UgICAgPSAkZm9ybS5maW5kKCAnLmVycm9yLW1lc3NhZ2UnICk7XG5cblx0XHRjb25zdCB3Y2FwZl9wYXJhbXMgPSB3aW5kb3dbICd3Y2FwZl9hZG1pbl9wYXJhbXMnIF07XG5cdFx0Y29uc3QgYWpheHVybCAgICAgID0gd2NhcGZfcGFyYW1zWyAnYWpheHVybCcgXTtcblxuXHRcdCQuYWpheCgge1xuXHRcdFx0dXJsOiBhamF4dXJsLFxuXHRcdFx0dHlwZTogJ1BPU1QnLFxuXHRcdFx0ZGF0YVR5cGU6ICdqc29uJyxcblx0XHRcdGRhdGE6IGRhdGEsXG5cdFx0XHRzdWNjZXNzOiBmdW5jdGlvbiggcmVzcG9uc2UgKSB7XG5cdFx0XHRcdGNvbnN0IG1lc3NhZ2UgICAgICAgPSByZXNwb25zZS5tZXNzYWdlO1xuXHRcdFx0XHRjb25zdCBfZGF0YSAgICAgICAgID0gcmVzcG9uc2UuZGF0YTtcblx0XHRcdFx0Y29uc3Qgc3RhdHVzICAgICAgICA9IF9kYXRhWyAnc3RhdHVzJyBdO1xuXHRcdFx0XHRjb25zdCBwYWdlICAgICAgICAgID0gX2RhdGFbICdwYWdlJyBdO1xuXHRcdFx0XHRjb25zdCBjb3VudCAgICAgICAgID0gX2RhdGFbICdjb3VudCcgXTtcblx0XHRcdFx0Y29uc3QgcGVyY2VudGFnZSAgICA9IF9kYXRhWyAncGVyY2VudGFnZScgXTtcblx0XHRcdFx0Y29uc3QgdG90YWxQcm9kdWN0cyA9IF9kYXRhWyAndG90YWxfcHJvZHVjdHMnIF07XG5cblx0XHRcdFx0aWYgKCByZXNwb25zZS5zdWNjZXNzID09PSAndHJ1ZScgKSB7XG5cdFx0XHRcdFx0JHByb2dyZXNzQ291bnQuaHRtbCggY291bnQgKTtcblx0XHRcdFx0XHQkcHJvZ3Jlc3NiYXIuY3NzKCAnd2lkdGgnLCBwZXJjZW50YWdlICsgJyUnICk7XG5cblx0XHRcdFx0XHRpZiAoICEgJHByb2dyZXNzV3JhcHBlci5oYXNDbGFzcyggJ2FjdGl2ZScgKSApIHtcblx0XHRcdFx0XHRcdCRwcm9ncmVzc1dyYXBwZXIuYWRkQ2xhc3MoICdhY3RpdmUnICk7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0aWYgKCBzdGF0dXMgPT09ICdpbmNvbXBsZXRlJyApIHtcblx0XHRcdFx0XHRcdCRwcm9ncmVzc1RvdGFsLmh0bWwoIHRvdGFsUHJvZHVjdHMgKTtcblxuXHRcdFx0XHRcdFx0ZGF0YVsgJ3BhZ2UnIF0gID0gcGFnZTtcblx0XHRcdFx0XHRcdGRhdGFbICdjb3VudCcgXSA9IGNvdW50O1xuXG5cdFx0XHRcdFx0XHRnZW5lcmF0ZVByb2R1Y3RQcmljZXMoICRmb3JtLCBkYXRhICk7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdHNldFRpbWVvdXQoIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdFx0XHQkcHJvZ3Jlc3NXcmFwcGVyLnJlbW92ZUNsYXNzKCAnYWN0aXZlJyApO1xuXHRcdFx0XHRcdFx0XHQkcHJvZ3Jlc3NiYXIuY3NzKCAnd2lkdGgnLCAnMCcgKTtcblx0XHRcdFx0XHRcdFx0JHN1Ym1pdEJ0bi5yZW1vdmVBdHRyKCAnZGlzYWJsZWQnICk7XG5cdFx0XHRcdFx0XHRcdCRzdWNjZXNzTWVzc2FnZS5odG1sKCBtZXNzYWdlICk7XG5cdFx0XHRcdFx0XHR9LCAxNTAwICk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdCRzdWJtaXRCdG4ucmVtb3ZlQXR0ciggJ2Rpc2FibGVkJyApO1xuXHRcdFx0XHRcdCRlcnJvck1lc3NhZ2UuaHRtbCggbWVzc2FnZSApO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fSApLmZhaWwoIGZ1bmN0aW9uKCByZXNwb25zZSApIHtcblx0XHRcdCRwcm9ncmVzc1dyYXBwZXIucmVtb3ZlQ2xhc3MoICdhY3RpdmUnICk7XG5cdFx0XHQkcHJvZ3Jlc3NiYXIuY3NzKCAnd2lkdGgnLCAnMCcgKTtcblx0XHRcdCRzdWJtaXRCdG4ucmVtb3ZlQXR0ciggJ2Rpc2FibGVkJyApO1xuXG5cdFx0XHRpZiAoIHdpbmRvdy5jb25zb2xlICYmIHdpbmRvdy5jb25zb2xlLmxvZyApIHtcblx0XHRcdFx0Y29uc29sZS5sb2coIHJlc3BvbnNlICk7XG5cdFx0XHR9XG5cdFx0fSApO1xuXHR9XG5cblx0JCggJy53cmFwJyApLm9uKCAnc3VibWl0JywgJyNnZW5lcmF0ZS1wcm9kdWN0LXByaWNlcycsIGZ1bmN0aW9uKCBlICkge1xuXHRcdGUucHJldmVudERlZmF1bHQoKTtcblxuXHRcdGNvbnN0ICRmb3JtICAgICAgICAgICAgPSAkKCB0aGlzICksXG5cdFx0XHQgICRwcm9ncmVzc1dyYXBwZXIgPSAkZm9ybS5maW5kKCAnLnByb2dyZXNzLXN0YXQnICksXG5cdFx0XHQgICRwcm9ncmVzc2JhciAgICAgPSAkcHJvZ3Jlc3NXcmFwcGVyLmZpbmQoICcucHJvZ3Jlc3NiYXIgPiBkaXYnICksXG5cdFx0XHQgICRzdWJtaXRCdG4gICAgICAgPSAkZm9ybS5maW5kKCAnLmJ1dHRvbicgKSxcblx0XHRcdCAgJHN1Y2Nlc3NNZXNzYWdlICA9ICRmb3JtLmZpbmQoICcuc3VjY2Vzcy1tZXNzYWdlJyApLFxuXHRcdFx0ICAkZXJyb3JNZXNzYWdlICAgID0gJGZvcm0uZmluZCggJy5lcnJvci1tZXNzYWdlJyApLFxuXHRcdFx0ICBkYXRhICAgICAgICAgICAgID0gJGZvcm0uc2VyaWFsaXplT2JqZWN0KCk7XG5cblx0XHQkcHJvZ3Jlc3NiYXIuY3NzKCAnd2lkdGgnLCAnMCcgKTtcblx0XHQkc3VjY2Vzc01lc3NhZ2UuaHRtbCggJycgKTtcblx0XHQkZXJyb3JNZXNzYWdlLmh0bWwoICcnICk7XG5cdFx0JHN1Ym1pdEJ0bi5hdHRyKCAnZGlzYWJsZWQnLCAnZGlzYWJsZWQnICk7XG5cblx0XHRnZW5lcmF0ZVByb2R1Y3RQcmljZXMoICRmb3JtLCBkYXRhICk7XG5cdH0gKTtcblxufSApO1xuIiwiLyoqXG4gKiBNYW51YWwgT3B0aW9ucycgdGFibGUgZnVuY3Rpb24uXG4gKlxuICogQHNpbmNlICAgICAgMy4wLjBcbiAqIEBwYWNrYWdlICAgIHdjLWFqYXgtcHJvZHVjdC1maWx0ZXJcbiAqIEBzdWJwYWNrYWdlIHdjLWFqYXgtcHJvZHVjdC1maWx0ZXIvYWRtaW4vc3JjL2pzXG4gKiBAYXV0aG9yICAgICBNYWludWwgSGFzc2FuIE1haW5cbiAqL1xuXG4vKipcbiAqIEBwYXJhbSB0YWJsZUlkZW50aWZpZXJcbiAqIEBwYXJhbSB2YWx1ZUlkZW50aWZpZXJcbiAqIEBwYXJhbSByb3dUZW1wbGF0ZUlkXG4gKiBAcGFyYW0gcm93RGVmYXVsdE9wdGlvbnNcbiAqL1xuZnVuY3Rpb24gaW5pdE1hbnVhbE9wdGlvbnNUYWJsZSggdGFibGVJZGVudGlmaWVyLCB2YWx1ZUlkZW50aWZpZXIsIHJvd1RlbXBsYXRlSWQsIHJvd0RlZmF1bHRPcHRpb25zID0ge30gKSB7XG5cdGNvbnN0ICQgPSBqUXVlcnk7XG5cblx0Y29uc3QgZmllbGRXcmFwcGVyID0gJCggJyNjaG9zZW5fZmllbGRfd3JhcHBlcicgKTtcblxuXHRjb25zdCBmaWVsZElkZW50aWZpZXIgPSAnLndjYXBmLWZvcm0tZmllbGQnO1xuXHRjb25zdCByb3dzSWRlbnRpZmllciAgPSAnLmZpZWxkLXRhYmxlLWJvZHktcm93cyc7XG5cdGNvbnN0IHJvd0lkZW50aWZpZXIgICA9ICcucm93LWl0ZW0nO1xuXG5cdGZ1bmN0aW9uIGluaXRTb3J0YWJsZVRhYmxlKCAkc2VsZWN0b3IgKSB7XG5cdFx0JHNlbGVjdG9yLnNvcnRhYmxlKCB7XG5cdFx0XHRvcGFjaXR5OiAwLjgsXG5cdFx0XHRyZXZlcnQ6IGZhbHNlLFxuXHRcdFx0Y3Vyc29yOiAnbW92ZScsXG5cdFx0XHRheGlzOiAneScsXG5cdFx0XHRoYW5kbGU6ICcubW92ZS1vcHRpb25zLWhhbmRsZXInLFxuXHRcdFx0cGxhY2Vob2xkZXI6ICd3aWRnZXQtcGxhY2Vob2xkZXInLFxuXHRcdFx0dXBkYXRlOiBmdW5jdGlvbiggZSApIHtcblx0XHRcdFx0Y29uc3QgJGZpZWxkID0gJCggZS50YXJnZXQgKS5jbG9zZXN0KCAnLndjYXBmLWZvcm0tZmllbGQnICk7XG5cblx0XHRcdFx0dHJpZ2dlck9wdGlvbnNDaGFuZ2UoICRmaWVsZCApO1xuXHRcdFx0fVxuXHRcdH0gKS5kaXNhYmxlU2VsZWN0aW9uKCk7XG5cdH1cblxuXHRjb25zdCB0YWJsZVJvd3NJZGVudGlmaWVyID0gdGFibGVJZGVudGlmaWVyICsgJyAnICsgcm93c0lkZW50aWZpZXI7XG5cblx0Ly8gSW5pdCB0aGUgc29ydGFibGUgdGFibGUgYWZ0ZXIgcGFnZSBsb2Fkcy5cblx0aW5pdFNvcnRhYmxlVGFibGUoIGZpZWxkV3JhcHBlci5maW5kKCB0YWJsZVJvd3NJZGVudGlmaWVyICkgKTtcblxuXHQvLyBJbml0IHRoZSBzb3J0YWJsZSB0YWJsZSBhZnRlciB0aGUgZmllbGQgaXMgYWRkZWQuXG5cdGZpZWxkV3JhcHBlci5vbiggJ2ZpZWxkX2FkZGVkJywgZnVuY3Rpb24oKSB7XG5cdFx0aW5pdFNvcnRhYmxlVGFibGUoICQoIGZpZWxkV3JhcHBlci5maW5kKCB0YWJsZVJvd3NJZGVudGlmaWVyICkgKSApO1xuXHR9ICk7XG5cblx0ZnVuY3Rpb24gdHJpZ2dlck9wdGlvbnNDaGFuZ2UoICRmaWVsZCApIHtcblx0XHRjb25zdCAkdmFsdWVIb2xkZXIgPSAkZmllbGQuZmluZCggdmFsdWVJZGVudGlmaWVyICk7XG5cdFx0Y29uc3QgJHJvd3MgICAgICAgID0gJGZpZWxkLmZpbmQoIHRhYmxlUm93c0lkZW50aWZpZXIgKTtcblx0XHRjb25zdCBfcm93cyAgICAgICAgPSBbXTtcblxuXHRcdCRyb3dzLmZpbmQoICcucm93LWl0ZW0nICkuZWFjaCggZnVuY3Rpb24oIGksIF9pdGVtICkge1xuXHRcdFx0Y29uc3QgJGl0ZW0gPSAkKCBfaXRlbSApO1xuXHRcdFx0Y29uc3Qgb2JqICAgPSB7fTtcblxuXHRcdFx0JGl0ZW0uZmluZCggJ1tkYXRhLW5hbWVdJyApLmVhY2goIGZ1bmN0aW9uKCBmaWVsZEluZGV4LCBmaWVsZCApIHtcblx0XHRcdFx0Y29uc3QgJGZpZWxkID0gJCggZmllbGQgKTtcblx0XHRcdFx0Y29uc3QgbmFtZSAgID0gJGZpZWxkLmF0dHIoICdkYXRhLW5hbWUnICk7XG5cblx0XHRcdFx0b2JqWyBuYW1lIF0gPSAkZmllbGQudmFsKCk7XG5cdFx0XHR9ICk7XG5cblx0XHRcdF9yb3dzLnB1c2goIG9iaiApO1xuXHRcdH0gKTtcblxuXHRcdGNvbnN0IHJhd1ZhbHVlcyA9IGVuY29kZVVSSUNvbXBvbmVudCggSlNPTi5zdHJpbmdpZnkoIF9yb3dzICkgKTtcblx0XHQkdmFsdWVIb2xkZXIudmFsKCByYXdWYWx1ZXMgKS50cmlnZ2VyKCAnY2hhbmdlJyApO1xuXHR9XG5cblx0ZnVuY3Rpb24gdHJpZ2dlclJlbW92ZU9wdGlvbiggJGZpZWxkICkge1xuXHRcdGNvbnN0ICRvcHRpb25zVGFibGUgPSAkZmllbGQuZmluZCggdGFibGVJZGVudGlmaWVyICk7XG5cdFx0Y29uc3QgdGFibGVSb3dzICAgICA9ICRmaWVsZC5maW5kKCB0YWJsZVJvd3NJZGVudGlmaWVyICkuY2hpbGRyZW4oKTtcblxuXHRcdGlmICggMiA+IHRhYmxlUm93cy5sZW5ndGggKSB7XG5cdFx0XHQkb3B0aW9uc1RhYmxlLnJlbW92ZUNsYXNzKCAnaGFzLW9wdGlvbnMnICk7XG5cdFx0fVxuXHR9XG5cblx0Ly8gUmVtb3ZlIE9wdGlvblxuXHRjb25zdCByZW1vdmVCdG5JZGVudGlmaWVyID0gdGFibGVJZGVudGlmaWVyICsgJyAucmVtb3ZlLW9wdGlvbic7XG5cblx0ZmllbGRXcmFwcGVyLm9uKCAnY2xpY2snLCByZW1vdmVCdG5JZGVudGlmaWVyLCBmdW5jdGlvbigpIHtcblx0XHRjb25zdCAkaXRlbSAgPSAkKCB0aGlzICkuY2xvc2VzdCggcm93SWRlbnRpZmllciApO1xuXHRcdGNvbnN0ICRmaWVsZCA9ICRpdGVtLmNsb3Nlc3QoIGZpZWxkSWRlbnRpZmllciApO1xuXG5cdFx0dHJpZ2dlclJlbW92ZU9wdGlvbiggJGZpZWxkICk7XG5cblx0XHQkaXRlbS5yZW1vdmUoKTtcblxuXHRcdHRyaWdnZXJPcHRpb25zQ2hhbmdlKCAkZmllbGQgKTtcblx0fSApO1xuXG5cdC8vIENsZWFyIEFsbCBPcHRpb25zXG5cdGNvbnN0IGNsZWFyT3B0aW9uc0J0bklkZW50aWZpZXIgPSB0YWJsZUlkZW50aWZpZXIgKyAnIC5jbGVhci1vcHRpb25zJztcblxuXHRmaWVsZFdyYXBwZXIub24oICdjbGljaycsIGNsZWFyT3B0aW9uc0J0bklkZW50aWZpZXIsIGZ1bmN0aW9uKCkge1xuXHRcdGNvbnN0ICRmaWVsZCA9ICQoIHRoaXMgKS5jbG9zZXN0KCBmaWVsZElkZW50aWZpZXIgKTtcblxuXHRcdCRmaWVsZC5maW5kKCB0YWJsZVJvd3NJZGVudGlmaWVyICkuZW1wdHkoKTtcblxuXHRcdHRyaWdnZXJSZW1vdmVPcHRpb24oICRmaWVsZCApO1xuXHRcdHRyaWdnZXJPcHRpb25zQ2hhbmdlKCAkZmllbGQgKTtcblx0fSApO1xuXG5cdC8vIEFkZCBOZXcgT3B0aW9uXG5cdGNvbnN0IGFkZE9wdGlvbkJ0bklkZW50aWZpZXIgPSB0YWJsZUlkZW50aWZpZXIgKyAnIC5hZGQtb3B0aW9uJztcblxuXHRmaWVsZFdyYXBwZXIub24oICdjbGljaycsIGFkZE9wdGlvbkJ0bklkZW50aWZpZXIsIGZ1bmN0aW9uKCkge1xuXHRcdC8vIEJhaWwgb3V0IGlmIG5vIHRtcGwgZm91bmQgZm9yIHRoZSB0eXBlLlxuXHRcdGlmICggISBqUXVlcnkoICcjdG1wbC0nICsgcm93VGVtcGxhdGVJZCApLmxlbmd0aCApIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHRjb25zdCAkZmllbGQgPSAkKCB0aGlzICkuY2xvc2VzdCggZmllbGRJZGVudGlmaWVyICk7XG5cblx0XHRjb25zdCB0ZW1wbGF0ZSA9IHdwLnRlbXBsYXRlKCByb3dUZW1wbGF0ZUlkICk7XG5cdFx0Y29uc3QgcmVuZGVyZWQgPSB0ZW1wbGF0ZSggcm93RGVmYXVsdE9wdGlvbnMgKTtcblx0XHRjb25zdCAkdGFibGUgICA9ICRmaWVsZC5maW5kKCB0YWJsZUlkZW50aWZpZXIgKTtcblx0XHRjb25zdCAkcm93cyAgICA9ICRmaWVsZC5maW5kKCB0YWJsZVJvd3NJZGVudGlmaWVyICk7XG5cblx0XHQkcm93cy5hcHBlbmQoIHJlbmRlcmVkICk7XG5cblx0XHR0cmlnZ2VyT3B0aW9uc0NoYW5nZSggJGZpZWxkICk7XG5cblx0XHRmaWVsZFdyYXBwZXIudHJpZ2dlciggJ25ld19vcHRpb25fYWRkZWQnLCBbICRmaWVsZCBdICk7XG5cblx0XHRpZiAoICEgJHRhYmxlLmhhc0NsYXNzKCAnaGFzLW9wdGlvbnMnICkgKSB7XG5cdFx0XHQkdGFibGUuYWRkQ2xhc3MoICdoYXMtb3B0aW9ucycgKTtcblx0XHR9XG5cdH0gKTtcblxuXHQvLyBUcmlnZ2VyIG9wdGlvbnMgY2hhbmdlIHdoZW4gdGhlIHRleHQgZmllbGRzIGdldCBjaGFuZ2VkLlxuXHRjb25zdCB0ZXh0RmllbGRzSWRlbnRpZmllciA9IHRhYmxlUm93c0lkZW50aWZpZXIgKyAnIGlucHV0W3R5cGU9XCJ0ZXh0XCJdJztcblxuXHRmaWVsZFdyYXBwZXIub24oICdpbnB1dCcsIHRleHRGaWVsZHNJZGVudGlmaWVyLCBmdW5jdGlvbigpIHtcblx0XHRjb25zdCAkZmllbGQgPSAkKCB0aGlzICkuY2xvc2VzdCggZmllbGRJZGVudGlmaWVyICk7XG5cblx0XHR0cmlnZ2VyT3B0aW9uc0NoYW5nZSggJGZpZWxkICk7XG5cdH0gKTtcblxuXHQvLyBUcmlnZ2VyIG9wdGlvbnMgY2hhbmdlIHdoZW4gdGhlIHNlbGVjdCBmaWVsZHMgZ2V0IGNoYW5nZWQuXG5cdGxldCBzZWxlY3RGaWVsZHNJZGVudGlmaWVyID0gdGFibGVSb3dzSWRlbnRpZmllciArICcgc2VsZWN0JztcblxuXHRmaWVsZFdyYXBwZXIub24oICdjaGFuZ2UnLCBzZWxlY3RGaWVsZHNJZGVudGlmaWVyLCBmdW5jdGlvbigpIHtcblx0XHRjb25zdCAkZmllbGQgPSAkKCB0aGlzICkuY2xvc2VzdCggZmllbGRJZGVudGlmaWVyICk7XG5cblx0XHR0cmlnZ2VyT3B0aW9uc0NoYW5nZSggJGZpZWxkICk7XG5cdH0gKTtcblxuXHQvLyBUcmlnZ2VyIG9wdGlvbnMgY2hhbmdlIHdoZW4gdmFsdWUgaXMgYWRkZWQgZnJvbSBtb2RhbC5cblx0ZmllbGRXcmFwcGVyLm9uKCAndHJpZ2dlcl9vcHRpb25zX3RhYmxlJywgZnVuY3Rpb24oIGUsIHRhYmxlSWQsICRmaWVsZCApIHtcblx0XHRpZiAoIHRhYmxlSWQgPT09IHRhYmxlSWRlbnRpZmllciApIHtcblx0XHRcdHRyaWdnZXJPcHRpb25zQ2hhbmdlKCAkZmllbGQgKTtcblx0XHR9XG5cdH0gKTtcblxufVxuIiwiLyoqXG4gKiBUaGUgbnVtYmVyIHVpIG9wdGlvbnMuXG4gKlxuICogQHNpbmNlICAgICAgMy4wLjBcbiAqIEBwYWNrYWdlICAgIHdjLWFqYXgtcHJvZHVjdC1maWx0ZXJcbiAqIEBzdWJwYWNrYWdlIHdjLWFqYXgtcHJvZHVjdC1maWx0ZXIvYWRtaW4vc3JjL2pzXG4gKiBAYXV0aG9yICAgICBNYWludWwgSGFzc2FuIE1haW5cbiAqL1xuXG5qUXVlcnkoIGRvY3VtZW50ICkucmVhZHkoIGZ1bmN0aW9uKCAkICkge1xuXG5cdGNvbnN0IGZpZWxkV3JhcHBlciA9ICQoICcjY2hvc2VuX2ZpZWxkX3dyYXBwZXInICk7XG5cblx0LyoqXG5cdCAqIFRvZ2dsZSBkaXNhYmxlZCBhdHRyaWJ1dGUgb2YgbWluLXZhbHVlIGZpZWxkIGZvciBudW1iZXIgdHlwZS5cblx0ICovXG5cdGZ1bmN0aW9uIHRvZ2dsZU51bWJlck1pblZhbHVlRmllbGQoICRlbG0gKSB7XG5cdFx0Y29uc3QgJGZpZWxkICAgICA9ICRlbG0uY2xvc2VzdCggJy53Y2FwZi1mb3JtLWZpZWxkJyApO1xuXHRcdGNvbnN0ICR0ZXh0RmllbGQgPSAkZmllbGQuZmluZCggJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1taW5fdmFsdWUgaW5wdXRbdHlwZT1cInRleHRcIl0nICk7XG5cblx0XHRpZiAoICRlbG0uaXMoICc6Y2hlY2tlZCcgKSApIHtcblx0XHRcdCR0ZXh0RmllbGQuYXR0ciggJ2Rpc2FibGVkJywgJ2Rpc2FibGVkJyApO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHQkdGV4dEZpZWxkLnJlbW92ZUF0dHIoICdkaXNhYmxlZCcgKTtcblx0XHR9XG5cdH1cblxuXHRmaWVsZFdyYXBwZXIub24oICdmaWVsZF9hZGRlZCcsIGZ1bmN0aW9uKCkge1xuXHRcdGZpZWxkV3JhcHBlci5maW5kKCAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLW1pbl92YWx1ZV9hdXRvX2RldGVjdCBpbnB1dFt0eXBlPVwiY2hlY2tib3hcIl0nICkuZWFjaCggZnVuY3Rpb24oKSB7XG5cdFx0XHRjb25zdCAkdGhpcyA9ICQoIHRoaXMgKTtcblxuXHRcdFx0dG9nZ2xlTnVtYmVyTWluVmFsdWVGaWVsZCggJHRoaXMgKTtcblx0XHR9ICk7XG5cdH0gKTtcblxuXHRmaWVsZFdyYXBwZXIub24oXG5cdFx0J2NsaWNrJyxcblx0XHQnLndjYXBmLWZvcm0tc3ViLWZpZWxkLW1pbl92YWx1ZV9hdXRvX2RldGVjdCBpbnB1dFt0eXBlPVwiY2hlY2tib3hcIl0nLFxuXHRcdGZ1bmN0aW9uKCkge1xuXHRcdFx0Y29uc3QgJHRoaXMgPSAkKCB0aGlzICk7XG5cblx0XHRcdHRvZ2dsZU51bWJlck1pblZhbHVlRmllbGQoICR0aGlzICk7XG5cdFx0fVxuXHQpO1xuXG5cdC8qKlxuXHQgKiBUb2dnbGUgZGlzYWJsZWQgYXR0cmlidXRlIG9mIG1heC12YWx1ZSBmaWVsZCBmb3IgbnVtYmVyIHR5cGUuXG5cdCAqL1xuXHRmdW5jdGlvbiB0b2dnbGVOdW1iZXJNYXhWYWx1ZUZpZWxkKCAkZWxtICkge1xuXHRcdGNvbnN0ICRmaWVsZCAgICAgPSAkZWxtLmNsb3Nlc3QoICcud2NhcGYtZm9ybS1maWVsZCcgKTtcblx0XHRjb25zdCAkdGV4dEZpZWxkID0gJGZpZWxkLmZpbmQoICcud2NhcGYtZm9ybS1zdWItZmllbGQtbWF4X3ZhbHVlIGlucHV0W3R5cGU9XCJ0ZXh0XCJdJyApO1xuXG5cdFx0aWYgKCAkZWxtLmlzKCAnOmNoZWNrZWQnICkgKSB7XG5cdFx0XHQkdGV4dEZpZWxkLmF0dHIoICdkaXNhYmxlZCcsICdkaXNhYmxlZCcgKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0JHRleHRGaWVsZC5yZW1vdmVBdHRyKCAnZGlzYWJsZWQnICk7XG5cdFx0fVxuXHR9XG5cblx0ZmllbGRXcmFwcGVyLm9uKCAnZmllbGRfYWRkZWQnLCBmdW5jdGlvbigpIHtcblx0XHRmaWVsZFdyYXBwZXIuZmluZCggJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1tYXhfdmFsdWVfYXV0b19kZXRlY3QgaW5wdXRbdHlwZT1cImNoZWNrYm94XCJdJyApLmVhY2goIGZ1bmN0aW9uKCkge1xuXHRcdFx0Y29uc3QgJHRoaXMgPSAkKCB0aGlzICk7XG5cblx0XHRcdHRvZ2dsZU51bWJlck1heFZhbHVlRmllbGQoICR0aGlzICk7XG5cdFx0fSApO1xuXHR9ICk7XG5cblx0ZmllbGRXcmFwcGVyLm9uKFxuXHRcdCdjbGljaycsXG5cdFx0Jy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1tYXhfdmFsdWVfYXV0b19kZXRlY3QgaW5wdXRbdHlwZT1cImNoZWNrYm94XCJdJyxcblx0XHRmdW5jdGlvbigpIHtcblx0XHRcdGNvbnN0ICR0aGlzID0gJCggdGhpcyApO1xuXG5cdFx0XHR0b2dnbGVOdW1iZXJNYXhWYWx1ZUZpZWxkKCAkdGhpcyApO1xuXHRcdH1cblx0KTtcblxufSApO1xuIiwiLyoqXG4gKiBUaGUgcHJvZHVjdCBzdGF0dXMgZmllbGQuXG4gKlxuICogQHNpbmNlICAgICAgMy4wLjBcbiAqIEBwYWNrYWdlICAgIHdjLWFqYXgtcHJvZHVjdC1maWx0ZXJcbiAqIEBzdWJwYWNrYWdlIHdjLWFqYXgtcHJvZHVjdC1maWx0ZXIvYWRtaW4vc3JjL2pzXG4gKiBAYXV0aG9yICAgICBNYWludWwgSGFzc2FuIE1haW5cbiAqL1xuXG5qUXVlcnkoIGRvY3VtZW50ICkucmVhZHkoIGZ1bmN0aW9uKCkge1xuXG5cdGNvbnN0IHRhYmxlSWRlbnRpZmllciA9ICcucHJvZHVjdC1zdGF0dXMtb3B0aW9ucy10YWJsZSc7XG5cdGNvbnN0IHZhbHVlSWRlbnRpZmllciA9ICcud2NhcGYtZm9ybS1zdWItZmllbGQtcHJvZHVjdF9zdGF0dXNfb3B0aW9ucyBpbnB1dCc7XG5cdGNvbnN0IHJvd1RlbXBsYXRlSWQgICA9ICd3Y2FwZi1wcm9kdWN0LXN0YXR1cy1vcHRpb24nO1xuXG5cdGluaXRNYW51YWxPcHRpb25zVGFibGUoIHRhYmxlSWRlbnRpZmllciwgdmFsdWVJZGVudGlmaWVyLCByb3dUZW1wbGF0ZUlkICk7XG5cbn0gKTtcbiIsIi8qKlxuICogVGF4b25vbXkncyBkZWZhdWx0IGZpZWxkIGtleS5cbiAqXG4gKiBAc2luY2UgICAgICAzLjAuMFxuICogQHBhY2thZ2UgICAgd2MtYWpheC1wcm9kdWN0LWZpbHRlclxuICogQHN1YnBhY2thZ2Ugd2MtYWpheC1wcm9kdWN0LWZpbHRlci9hZG1pbi9zcmMvanNcbiAqIEBhdXRob3IgICAgIE1haW51bCBIYXNzYW4gTWFpblxuICovXG5cbmpRdWVyeSggZG9jdW1lbnQgKS5yZWFkeSggZnVuY3Rpb24oICQgKSB7XG5cblx0Y29uc3QgZmllbGRXcmFwcGVyID0gJCggJyNjaG9zZW5fZmllbGRfd3JhcHBlcicgKTtcblxuXHRmaWVsZFdyYXBwZXIub24oICdhZnRlcl90b2dnbGVfcmVxdWVzdCcsIGZ1bmN0aW9uKCBlLCBoYW5kbGVyLCB2YWx1ZSwgJGZpZWxkICkge1xuXHRcdGlmICggJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC10YXhvbm9teSBzZWxlY3QnID09PSBoYW5kbGVyICkge1xuXHRcdFx0Y29uc3QgJGZpZWxkS2V5ID0gJGZpZWxkLmZpbmQoICcud2NhcGYtZm9ybS1zdWItZmllbGQtZmllbGRfa2V5JyApO1xuXG5cdFx0XHQvLyBQcmVwZW5kIGRhc2ggdG8gYXZvaWQgY29uZmxpY3Rpbmcgd2l0aCB0aGUgcmVnaXN0ZXJlZCB0YXhvbm9taWVzLlxuXHRcdFx0aWYgKCB2YWx1ZSApIHtcblx0XHRcdFx0dmFsdWUgPSAnXycgKyB2YWx1ZTtcblx0XHRcdH1cblxuXHRcdFx0JGZpZWxkS2V5LmZpbmQoICdpbnB1dFt0eXBlPVwidGV4dFwiXScgKS52YWwoIHZhbHVlICk7XG5cdFx0fVxuXHR9ICk7XG5cbn0gKTtcbiIsIi8qKlxuICogVGhlIHRvZ2dsZSB2aXNpYmlsaXR5IHNjcmlwdHMuXG4gKlxuICogTk9URTogVGhlc2Ugc2NyaXB0cyBtdXN0IGJlIGxvY2F0ZWQgYXQgdGhlIHZlcnkgYm90dG9tIG9mIHRoZSBjb21iaW5lZCBzY3JpcHRzLlxuICpcbiAqIEBzaW5jZSAgICAgIDMuMC4wXG4gKiBAcGFja2FnZSAgICB3Yy1hamF4LXByb2R1Y3QtZmlsdGVyXG4gKiBAc3VicGFja2FnZSB3Yy1hamF4LXByb2R1Y3QtZmlsdGVyL2FkbWluL3NyYy9qc1xuICogQGF1dGhvciAgICAgTWFpbnVsIEhhc3NhbiBNYWluXG4gKi9cblxualF1ZXJ5KCBkb2N1bWVudCApLnJlYWR5KCBmdW5jdGlvbiggJCApIHtcblxuXHRjb25zdCBmaWVsZFdyYXBwZXIgPSAkKCAnI2Nob3Nlbl9maWVsZF93cmFwcGVyJyApO1xuXG5cdGNvbnN0IGRlcGVuZGFudERhdGEgPSBbXG5cdFx0e1xuXHRcdFx0J2hhbmRsZXInOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLXZhbHVlX3R5cGUgc2VsZWN0Jyxcblx0XHRcdCdoYW5kbGVyVHlwZSc6ICdzZWxlY3QnLFxuXHRcdFx0J2V2ZW50JzogJ2NoYW5nZScsXG5cdFx0XHQnZGVwZW5kYW50JzogW1xuXHRcdFx0XHR7XG5cdFx0XHRcdFx0J3NlbGVjdG9yJzogJy5pbnB1dC10eXBlLXRleHQtZmllbGRzJyxcblx0XHRcdFx0XHQndmFsdWUnOiBbICd0ZXh0JyBdLFxuXHRcdFx0XHR9LFxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0J3NlbGVjdG9yJzogJy5pbnB1dC10eXBlLW51bWJlci1maWVsZHMnLFxuXHRcdFx0XHRcdCd2YWx1ZSc6IFsgJ251bWJlcicgXSxcblx0XHRcdFx0fSxcblx0XHRcdFx0e1xuXHRcdFx0XHRcdCdzZWxlY3Rvcic6ICcuaW5wdXQtdHlwZS1kYXRlLWZpZWxkcycsXG5cdFx0XHRcdFx0J3ZhbHVlJzogWyAnZGF0ZScgXSxcblx0XHRcdFx0fSxcblx0XHRcdFx0e1xuXHRcdFx0XHRcdCdzZWxlY3Rvcic6ICcudmFsdWUtZGVjaW1hbC1maWVsZHMnLFxuXHRcdFx0XHRcdCd2YWx1ZSc6IFsgJ251bWJlcicgXSxcblx0XHRcdFx0fSxcblx0XHRcdF0sXG5cdFx0fSxcblx0XHR7XG5cdFx0XHQnaGFuZGxlcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtZGlzcGxheV90eXBlIHNlbGVjdCcsXG5cdFx0XHQnaGFuZGxlclR5cGUnOiAnc2VsZWN0Jyxcblx0XHRcdCdldmVudCc6ICdjaGFuZ2UnLFxuXHRcdFx0J2RlcGVuZGFudCc6IFtcblx0XHRcdFx0e1xuXHRcdFx0XHRcdCdzZWxlY3Rvcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtcXVlcnlfdHlwZScsXG5cdFx0XHRcdFx0J3ZhbHVlJzogWyAnY2hlY2tib3gnLCAnbXVsdGktc2VsZWN0JyBdLFxuXHRcdFx0XHR9LFxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0J3NlbGVjdG9yJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1hbGxfaXRlbXNfbGFiZWwnLFxuXHRcdFx0XHRcdCd2YWx1ZSc6IFsgJ3JhZGlvJywgJ3NlbGVjdCcgXSxcblx0XHRcdFx0fSxcblx0XHRcdFx0e1xuXHRcdFx0XHRcdCdzZWxlY3Rvcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtdXNlX2Nob3NlbicsXG5cdFx0XHRcdFx0J3ZhbHVlJzogWyAnc2VsZWN0JywgJ211bHRpLXNlbGVjdCcgXSxcblx0XHRcdFx0fSxcblx0XHRcdFx0e1xuXHRcdFx0XHRcdCdzZWxlY3Rvcic6ICcuaGllcmFyY2hpY2FsLWZpZWxkcycsXG5cdFx0XHRcdFx0J3ZhbHVlJzogWyAnY2hlY2tib3gnLCAncmFkaW8nLCAnc2VsZWN0JywgJ211bHRpLXNlbGVjdCcgXSxcblx0XHRcdFx0fSxcblx0XHRcdFx0e1xuXHRcdFx0XHRcdCdzZWxlY3Rvcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtdXNlX2NhdGVnb3J5X2ltYWdlcycsXG5cdFx0XHRcdFx0J3ZhbHVlJzogWyAnaW1hZ2UnIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLWVuYWJsZV9tdWx0aXBsZV9maWx0ZXInLFxuXHRcdFx0XHRcdCd2YWx1ZSc6IFsgJ2xhYmVsJywgJ2NvbG9yJywgJ2ltYWdlJyBdLFxuXHRcdFx0XHR9LFxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0J3NlbGVjdG9yJzogJy5jb2x1bW4tZ3JvdXAtY3VzdG9tX2FwcGVhcmFuY2UnLFxuXHRcdFx0XHRcdCd2YWx1ZSc6IFsgJ2NvbG9yJywgJ2ltYWdlJyBdLFxuXHRcdFx0XHR9LFxuXHRcdFx0XSxcblx0XHR9LFxuXHRcdHtcblx0XHRcdCdoYW5kbGVyJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC11c2VfY2hvc2VuIGlucHV0Jyxcblx0XHRcdCdoYW5kbGVyVHlwZSc6ICdjaGVja2JveCcsXG5cdFx0XHQnZXZlbnQnOiAnY2hhbmdlJyxcblx0XHRcdCdkZXBlbmRhbnQnOiBbXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLWNob3Nlbl9ub19yZXN1bHRzX21lc3NhZ2UnLFxuXHRcdFx0XHRcdCd2YWx1ZSc6IFsgJzEnIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRdLFxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0J2hhbmRsZXInOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLWhpZXJhcmNoaWNhbCBpbnB1dCcsXG5cdFx0XHQnaGFuZGxlclR5cGUnOiAnY2hlY2tib3gnLFxuXHRcdFx0J2V2ZW50JzogJ2NoYW5nZScsXG5cdFx0XHQnZGVwZW5kYW50JzogW1xuXHRcdFx0XHR7XG5cdFx0XHRcdFx0J3NlbGVjdG9yJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1lbmFibGVfaGllcmFyY2h5X2FjY29yZGlvbicsXG5cdFx0XHRcdFx0J3ZhbHVlJzogWyAnMScgXSxcblx0XHRcdFx0fSxcblx0XHRcdF0sXG5cdFx0fSxcblx0XHR7XG5cdFx0XHQnaGFuZGxlcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtdmFsdWVfZGVjaW1hbCBpbnB1dCcsXG5cdFx0XHQnaGFuZGxlclR5cGUnOiAnY2hlY2tib3gnLFxuXHRcdFx0J2V2ZW50JzogJ2NoYW5nZScsXG5cdFx0XHQnZGVwZW5kYW50JzogW1xuXHRcdFx0XHR7XG5cdFx0XHRcdFx0J3NlbGVjdG9yJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC12YWx1ZV9kZWNpbWFsX3BsYWNlcycsXG5cdFx0XHRcdFx0J3ZhbHVlJzogWyAnMScgXSxcblx0XHRcdFx0fSxcblx0XHRcdF0sXG5cdFx0fSxcblx0XHR7XG5cdFx0XHQnaGFuZGxlcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtZ2V0X29wdGlvbnMgaW5wdXQnLFxuXHRcdFx0J2hhbmRsZXJUeXBlJzogJ3JhZGlvJyxcblx0XHRcdCdldmVudCc6ICdjaGFuZ2UnLFxuXHRcdFx0J2RlcGVuZGFudCc6IFtcblx0XHRcdFx0e1xuXHRcdFx0XHRcdCdzZWxlY3Rvcic6ICcuY29sdW1uLWdyb3VwLW1ldGFfa2V5X21hbnVhbF9vcHRpb25zJyxcblx0XHRcdFx0XHQndmFsdWUnOiBbICdtYW51YWxfZW50cnknIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRdLFxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0J2hhbmRsZXInOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLW51bWJlcl9kaXNwbGF5X3R5cGUgc2VsZWN0Jyxcblx0XHRcdCdoYW5kbGVyVHlwZSc6ICdzZWxlY3QnLFxuXHRcdFx0J2V2ZW50JzogJ2NoYW5nZScsXG5cdFx0XHQnZGVwZW5kYW50JzogW1xuXHRcdFx0XHR7XG5cdFx0XHRcdFx0J3NlbGVjdG9yJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1udW1iZXJfcmFuZ2Vfc2xpZGVyX2Rpc3BsYXlfdmFsdWVzX2FzJyxcblx0XHRcdFx0XHQndmFsdWUnOiBbICdyYW5nZV9zbGlkZXInIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLWFsaWduX3ZhbHVlc19hdF90aGVfZW5kJyxcblx0XHRcdFx0XHQndmFsdWUnOiBbICdyYW5nZV9zbGlkZXInIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLW51bWJlcl9yYW5nZV9xdWVyeV90eXBlJyxcblx0XHRcdFx0XHQndmFsdWUnOiBbICdyYW5nZV9jaGVja2JveCcsICdyYW5nZV9tdWx0aXNlbGVjdCcgXSxcblx0XHRcdFx0fSxcblx0XHRcdFx0e1xuXHRcdFx0XHRcdCdzZWxlY3Rvcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtbnVtYmVyX3JhbmdlX3NlbGVjdF9hbGxfaXRlbXNfbGFiZWwnLFxuXHRcdFx0XHRcdCd2YWx1ZSc6IFsgJ3JhbmdlX3JhZGlvJywgJ3JhbmdlX3NlbGVjdCcgXSxcblx0XHRcdFx0fSxcblx0XHRcdFx0e1xuXHRcdFx0XHRcdCdzZWxlY3Rvcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtbnVtYmVyX3JhbmdlX3VzZV9jaG9zZW4nLFxuXHRcdFx0XHRcdCd2YWx1ZSc6IFsgJ3JhbmdlX3NlbGVjdCcsICdyYW5nZV9tdWx0aXNlbGVjdCcgXSxcblx0XHRcdFx0fSxcblx0XHRcdFx0e1xuXHRcdFx0XHRcdCdzZWxlY3Rvcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtbnVtYmVyX3JhbmdlX2VuYWJsZV9tdWx0aXBsZV9maWx0ZXInLFxuXHRcdFx0XHRcdCd2YWx1ZSc6IFsgJ3JhbmdlX2xhYmVsJyBdLFxuXHRcdFx0XHR9LFxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0J3NlbGVjdG9yJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1udW1iZXJfcmFuZ2Vfc2hvd19jb3VudCcsXG5cdFx0XHRcdFx0J3ZhbHVlJzogWyAncmFuZ2VfY2hlY2tib3gnLCAncmFuZ2VfcmFkaW8nLCAncmFuZ2Vfc2VsZWN0JywgJ3JhbmdlX211bHRpc2VsZWN0JywgJ3JhbmdlX2xhYmVsJyBdLFxuXHRcdFx0XHR9LFxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0J3NlbGVjdG9yJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1udW1iZXJfcmFuZ2VfaGlkZV9lbXB0eScsXG5cdFx0XHRcdFx0J3ZhbHVlJzogWyAncmFuZ2VfY2hlY2tib3gnLCAncmFuZ2VfcmFkaW8nLCAncmFuZ2Vfc2VsZWN0JywgJ3JhbmdlX211bHRpc2VsZWN0JywgJ3JhbmdlX2xhYmVsJyBdLFxuXHRcdFx0XHR9LFxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0J3NlbGVjdG9yJzogJy5udW1iZXItZGVjaW1hbC1maWVsZHMnLFxuXHRcdFx0XHRcdCd2YWx1ZSc6IFsgJ3JhbmdlX3NsaWRlcicsICdyYW5nZV9jaGVja2JveCcsICdyYW5nZV9yYWRpbycsICdyYW5nZV9zZWxlY3QnLCAncmFuZ2VfbXVsdGlzZWxlY3QnLCAncmFuZ2VfbGFiZWwnIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRdLFxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0J2hhbmRsZXInOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLW51bWJlcl9yYW5nZV91c2VfY2hvc2VuIGlucHV0Jyxcblx0XHRcdCdoYW5kbGVyVHlwZSc6ICdjaGVja2JveCcsXG5cdFx0XHQnZXZlbnQnOiAnY2hhbmdlJyxcblx0XHRcdCdkZXBlbmRhbnQnOiBbXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLW51bWJlcl9yYW5nZV9jaG9zZW5fbm9fcmVzdWx0c19tZXNzYWdlJyxcblx0XHRcdFx0XHQndmFsdWUnOiBbICcxJyBdLFxuXHRcdFx0XHR9LFxuXHRcdFx0XSxcblx0XHR9LFxuXHRcdHtcblx0XHRcdCdoYW5kbGVyJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1udW1iZXJfZ2V0X29wdGlvbnMgaW5wdXQnLFxuXHRcdFx0J2hhbmRsZXJUeXBlJzogJ3JhZGlvJyxcblx0XHRcdCdldmVudCc6ICdjaGFuZ2UnLFxuXHRcdFx0J2RlcGVuZGFudCc6IFtcblx0XHRcdFx0e1xuXHRcdFx0XHRcdCdzZWxlY3Rvcic6ICcubnVtYmVyLWF1dG9tYXRpYy1vcHRpb25zJyxcblx0XHRcdFx0XHQndmFsdWUnOiBbICdhdXRvbWF0aWNhbGx5JyBdLFxuXHRcdFx0XHR9LFxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0J3NlbGVjdG9yJzogJy5udW1iZXItbWFudWFsLW9wdGlvbnMtdGFibGUnLFxuXHRcdFx0XHRcdCd2YWx1ZSc6IFsgJ21hbnVhbF9lbnRyeScgXSxcblx0XHRcdFx0fSxcblx0XHRcdF0sXG5cdFx0fSxcblx0XHR7XG5cdFx0XHQnaGFuZGxlcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtZGF0ZV9kaXNwbGF5X3R5cGUgc2VsZWN0Jyxcblx0XHRcdCdoYW5kbGVyVHlwZSc6ICdzZWxlY3QnLFxuXHRcdFx0J2V2ZW50JzogJ2NoYW5nZScsXG5cdFx0XHQnZGVwZW5kYW50JzogW1xuXHRcdFx0XHR7XG5cdFx0XHRcdFx0J3NlbGVjdG9yJzogJy5kYXRlLXRvLXVpLW9wdGlvbnMnLFxuXHRcdFx0XHRcdCd2YWx1ZSc6IFsgJ2lucHV0X2RhdGVfcmFuZ2UnIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLWRhdGVfZm9ybWF0Jyxcblx0XHRcdFx0XHQndmFsdWUnOiBbICdpbnB1dF9kYXRlJywgJ2lucHV0X2RhdGVfcmFuZ2UnIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLXRpbWVfcGVyaW9kX3F1ZXJ5X3R5cGUnLFxuXHRcdFx0XHRcdCd2YWx1ZSc6IFsgJ3RpbWVfcGVyaW9kX2NoZWNrYm94JywgJ3RpbWVfcGVyaW9kX211bHRpc2VsZWN0JyBdLFxuXHRcdFx0XHR9LFxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0J3NlbGVjdG9yJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC10aW1lX3BlcmlvZF9zZWxlY3RfYWxsX2l0ZW1zX2xhYmVsJyxcblx0XHRcdFx0XHQndmFsdWUnOiBbICd0aW1lX3BlcmlvZF9yYWRpbycsICd0aW1lX3BlcmlvZF9zZWxlY3QnIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLXRpbWVfcGVyaW9kX3VzZV9jaG9zZW4nLFxuXHRcdFx0XHRcdCd2YWx1ZSc6IFsgJ3RpbWVfcGVyaW9kX3NlbGVjdCcsICd0aW1lX3BlcmlvZF9tdWx0aXNlbGVjdCcgXSxcblx0XHRcdFx0fSxcblx0XHRcdFx0e1xuXHRcdFx0XHRcdCdzZWxlY3Rvcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtdGltZV9wZXJpb2RfZW5hYmxlX211bHRpcGxlX2ZpbHRlcicsXG5cdFx0XHRcdFx0J3ZhbHVlJzogWyAndGltZV9wZXJpb2RfbGFiZWwnIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLXRpbWVfcGVyaW9kX3Nob3dfY291bnQnLFxuXHRcdFx0XHRcdCd2YWx1ZSc6IFsgJ3RpbWVfcGVyaW9kX2NoZWNrYm94JywgJ3RpbWVfcGVyaW9kX3JhZGlvJywgJ3RpbWVfcGVyaW9kX3NlbGVjdCcsICd0aW1lX3BlcmlvZF9tdWx0aXNlbGVjdCcsICd0aW1lX3BlcmlvZF9sYWJlbCcgXSxcblx0XHRcdFx0fSxcblx0XHRcdFx0e1xuXHRcdFx0XHRcdCdzZWxlY3Rvcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtdGltZV9wZXJpb2RfaGlkZV9lbXB0eScsXG5cdFx0XHRcdFx0J3ZhbHVlJzogWyAndGltZV9wZXJpb2RfY2hlY2tib3gnLCAndGltZV9wZXJpb2RfcmFkaW8nLCAndGltZV9wZXJpb2Rfc2VsZWN0JywgJ3RpbWVfcGVyaW9kX211bHRpc2VsZWN0JywgJ3RpbWVfcGVyaW9kX2xhYmVsJyBdLFxuXHRcdFx0XHR9LFxuXHRcdFx0XSxcblx0XHR9LFxuXHRcdHtcblx0XHRcdCdoYW5kbGVyJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC10aW1lX3BlcmlvZF91c2VfY2hvc2VuIGlucHV0Jyxcblx0XHRcdCdoYW5kbGVyVHlwZSc6ICdjaGVja2JveCcsXG5cdFx0XHQnZXZlbnQnOiAnY2hhbmdlJyxcblx0XHRcdCdkZXBlbmRhbnQnOiBbXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLXRpbWVfcGVyaW9kX2Nob3Nlbl9ub19yZXN1bHRzX21lc3NhZ2UnLFxuXHRcdFx0XHRcdCd2YWx1ZSc6IFsgJzEnIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRdLFxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0J2hhbmRsZXInOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLWVuYWJsZV9zb2Z0X2xpbWl0IGlucHV0Jyxcblx0XHRcdCdoYW5kbGVyVHlwZSc6ICdyYWRpbycsXG5cdFx0XHQnZXZlbnQnOiAnY2hhbmdlJyxcblx0XHRcdCdkZXBlbmRhbnQnOiBbXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLXNvZnRfbGltaXQnLFxuXHRcdFx0XHRcdCd2YWx1ZSc6IFsgJ2VuYWJsZScgXSxcblx0XHRcdFx0fSxcblx0XHRcdF0sXG5cdFx0fSxcblx0XHR7XG5cdFx0XHQnaGFuZGxlcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtdGF4b25vbXkgc2VsZWN0Jyxcblx0XHRcdCdoYW5kbGVyVHlwZSc6ICdzZWxlY3QnLFxuXHRcdFx0J2V2ZW50JzogJ2NoYW5nZScsXG5cdFx0fSxcblx0XHR7XG5cdFx0XHQnaGFuZGxlcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtY3VzdG9tLXRheG9ub215IHNlbGVjdCcsXG5cdFx0XHQnaGFuZGxlclR5cGUnOiAnc2VsZWN0Jyxcblx0XHRcdCdldmVudCc6ICdjaGFuZ2UnLFxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0J2hhbmRsZXInOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLW1ldGFfa2V5IHNlbGVjdCcsXG5cdFx0XHQnaGFuZGxlclR5cGUnOiAnc2VsZWN0Jyxcblx0XHRcdCdldmVudCc6ICdjaGFuZ2UnLFxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0J2hhbmRsZXInOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLXBvc3RfcHJvcGVydHkgc2VsZWN0Jyxcblx0XHRcdCdoYW5kbGVyVHlwZSc6ICdzZWxlY3QnLFxuXHRcdFx0J2V2ZW50JzogJ2NoYW5nZScsXG5cdFx0fSxcblx0XHR7XG5cdFx0XHQnaGFuZGxlcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtbGltaXRfb3B0aW9ucyBzZWxlY3QnLFxuXHRcdFx0J2hhbmRsZXJUeXBlJzogJ3NlbGVjdCcsXG5cdFx0XHQnZXZlbnQnOiAnY2hhbmdlJyxcblx0XHRcdCdkZXBlbmRhbnQnOiBbXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLXBhcmVudF90ZXJtJyxcblx0XHRcdFx0XHQndmFsdWUnOiBbICdjaGlsZCcgXSxcblx0XHRcdFx0fSxcblx0XHRcdFx0e1xuXHRcdFx0XHRcdCdzZWxlY3Rvcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtbGltaXRfdmFsdWVzX2J5X2lkJyxcblx0XHRcdFx0XHQndmFsdWUnOiBbICdpbmNsdWRlJywgJ2V4Y2x1ZGUnIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRdLFxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0J2hhbmRsZXInOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLWVuYWJsZV9hY2NvcmRpb24gaW5wdXQnLFxuXHRcdFx0J2hhbmRsZXJUeXBlJzogJ3JhZGlvJyxcblx0XHRcdCdldmVudCc6ICdjaGFuZ2UnLFxuXHRcdFx0J2RlcGVuZGFudCc6IFtcblx0XHRcdFx0e1xuXHRcdFx0XHRcdCdzZWxlY3Rvcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtYWNjb3JkaW9uX2RlZmF1bHRfc3RhdGUnLFxuXHRcdFx0XHRcdCd2YWx1ZSc6IFsgJ3llcycgXSxcblx0XHRcdFx0fSxcblx0XHRcdF0sXG5cdFx0fSxcblx0XHR7XG5cdFx0XHQnaGFuZGxlcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtZW5hYmxlX211bHRpcGxlX2ZpbHRlciBpbnB1dCcsXG5cdFx0XHQnaGFuZGxlclR5cGUnOiAnY2hlY2tib3gnLFxuXHRcdFx0J2V2ZW50JzogJ2NoYW5nZScsXG5cdFx0fSxcblx0XHR7XG5cdFx0XHQnaGFuZGxlcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtdXNlX2NhdGVnb3J5X2ltYWdlcyBpbnB1dCcsXG5cdFx0XHQnaGFuZGxlclR5cGUnOiAnY2hlY2tib3gnLFxuXHRcdFx0J2V2ZW50JzogJ2NoYW5nZScsXG5cdFx0fSxcblx0XHR7XG5cdFx0XHQnaGFuZGxlcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtbnVtYmVyX3JhbmdlX2VuYWJsZV9tdWx0aXBsZV9maWx0ZXIgaW5wdXQnLFxuXHRcdFx0J2hhbmRsZXJUeXBlJzogJ2NoZWNrYm94Jyxcblx0XHRcdCdldmVudCc6ICdjaGFuZ2UnLFxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0J2hhbmRsZXInOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLXRpbWVfcGVyaW9kX2VuYWJsZV9tdWx0aXBsZV9maWx0ZXIgaW5wdXQnLFxuXHRcdFx0J2hhbmRsZXJUeXBlJzogJ2NoZWNrYm94Jyxcblx0XHRcdCdldmVudCc6ICdjaGFuZ2UnLFxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0J2hhbmRsZXInOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLXNob3dfaWZfZW1wdHkgaW5wdXQnLFxuXHRcdFx0J2hhbmRsZXJUeXBlJzogJ2NoZWNrYm94Jyxcblx0XHRcdCdldmVudCc6ICdjaGFuZ2UnLFxuXHRcdFx0J2RlcGVuZGFudCc6IFtcblx0XHRcdFx0e1xuXHRcdFx0XHRcdCdzZWxlY3Rvcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtZW1wdHlfZmlsdGVyX21lc3NhZ2UnLFxuXHRcdFx0XHRcdCd2YWx1ZSc6IFsgJzEnIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRdLFxuXHRcdH0sXG5cdF07XG5cblx0ZnVuY3Rpb24gX2hhbmRsZVRvZ2dsZVJlcXVlc3QoIGRhdGEsIGN1cnJlbnRTZWxlY3RvciwgdmFsdWUgKSB7XG5cdFx0Y29uc3QgJGZpZWxkICAgICAgPSBjdXJyZW50U2VsZWN0b3IuY2xvc2VzdCggJy53Y2FwZi1mb3JtLWZpZWxkJyApO1xuXHRcdGNvbnN0IGhhbmRsZXIgICAgID0gZGF0YVsgJ2hhbmRsZXInIF07XG5cdFx0Y29uc3QgaGFuZGxlclR5cGUgPSBkYXRhWyAnaGFuZGxlclR5cGUnIF07XG5cdFx0Y29uc3QgZGVwZW5kYW50ICAgPSBkYXRhWyAnZGVwZW5kYW50JyBdO1xuXG5cdFx0bGV0IF92YWx1ZSA9IHZhbHVlO1xuXG5cdFx0aWYgKCAnY2hlY2tib3gnID09PSBoYW5kbGVyVHlwZSApIHtcblx0XHRcdF92YWx1ZSA9IGN1cnJlbnRTZWxlY3Rvci5pcyggJzpjaGVja2VkJyApID8gJzEnIDogJzAnO1xuXHRcdH1cblxuXHRcdGlmICggJ3JhZGlvJyA9PT0gaGFuZGxlclR5cGUgKSB7XG5cdFx0XHRfdmFsdWUgPSAkZmllbGQuZmluZCggaGFuZGxlciArICc6Y2hlY2tlZCcgKS52YWwoKTtcblx0XHR9XG5cblx0XHQkLmVhY2goIGRlcGVuZGFudCwgZnVuY3Rpb24oIGlkLCBkICkge1xuXHRcdFx0Y29uc3QgJHNlbGVjdG9yICAgPSAkZmllbGQuZmluZCggZFsgJ3NlbGVjdG9yJyBdICk7XG5cdFx0XHRjb25zdCB2YWxpZFZhbHVlcyA9IGRbICd2YWx1ZScgXTtcblxuXHRcdFx0aWYgKCB2YWxpZFZhbHVlcy5pbmNsdWRlcyggX3ZhbHVlICkgKSB7XG5cdFx0XHRcdCRzZWxlY3Rvci5zaG93KCk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHQkc2VsZWN0b3IuaGlkZSgpO1xuXHRcdFx0fVxuXHRcdH0gKTtcblxuXHRcdGZpZWxkV3JhcHBlci50cmlnZ2VyKCAnYWZ0ZXJfdG9nZ2xlX3JlcXVlc3QnLCBbIGhhbmRsZXIsIF92YWx1ZSwgJGZpZWxkIF0gKTtcblx0fVxuXG5cdGZ1bmN0aW9uIGhhbmRsZVRvZ2dsZVJlcXVlc3QoIGRhdGEsIGN1cnJlbnRTZWxlY3RvciwgdmFsdWUgKSB7XG5cdFx0aWYgKCBudWxsID09PSBjdXJyZW50U2VsZWN0b3IgKSB7XG5cdFx0XHRjb25zdCBoYW5kbGVyICA9IGRhdGFbICdoYW5kbGVyJyBdO1xuXHRcdFx0Y29uc3QgJGhhbmRsZXIgPSAkKCBoYW5kbGVyICk7XG5cblx0XHRcdCQuZWFjaCggJGhhbmRsZXIsIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRjb25zdCBfdGhpcyAgPSAkKCB0aGlzICk7XG5cdFx0XHRcdGNvbnN0IF92YWx1ZSA9IF90aGlzLnZhbCgpO1xuXHRcdFx0XHRfaGFuZGxlVG9nZ2xlUmVxdWVzdCggZGF0YSwgX3RoaXMsIF92YWx1ZSApO1xuXHRcdFx0fSApO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRfaGFuZGxlVG9nZ2xlUmVxdWVzdCggZGF0YSwgY3VycmVudFNlbGVjdG9yLCB2YWx1ZSApO1xuXHRcdH1cblx0fVxuXG5cdGZ1bmN0aW9uIHNldHVwRmllbGQoIGluaXRhbCA9IGZhbHNlICkge1xuXHRcdCQuZWFjaCggZGVwZW5kYW50RGF0YSwgZnVuY3Rpb24oIGksIGRhdGEgKSB7XG5cdFx0XHRjb25zdCBoYW5kbGVyID0gZGF0YVsgJ2hhbmRsZXInIF07XG5cdFx0XHRjb25zdCBldmVudCAgID0gZGF0YVsgJ2V2ZW50JyBdO1xuXG5cdFx0XHRoYW5kbGVUb2dnbGVSZXF1ZXN0KCBkYXRhLCBudWxsLCBudWxsICk7XG5cblx0XHRcdGlmICggaW5pdGFsICkge1xuXHRcdFx0XHRmaWVsZFdyYXBwZXIub24oIGV2ZW50LCBoYW5kbGVyLCBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHRjb25zdCBfdGhpcyAgPSAkKCB0aGlzICk7XG5cdFx0XHRcdFx0Y29uc3QgX3ZhbHVlID0gJCggdGhpcyApLnZhbCgpO1xuXHRcdFx0XHRcdGhhbmRsZVRvZ2dsZVJlcXVlc3QoIGRhdGEsIF90aGlzLCBfdmFsdWUgKTtcblx0XHRcdFx0fSApO1xuXG5cdFx0XHRcdGlmICggISAkKCBmaWVsZFdyYXBwZXIgKS5oYXNDbGFzcyggJ2xvYWRlZCcgKSApIHtcblx0XHRcdFx0XHQkKCBmaWVsZFdyYXBwZXIgKS5hZGRDbGFzcyggJ2xvYWRlZCcgKTtcblxuXHRcdFx0XHRcdGZpZWxkV3JhcHBlci50cmlnZ2VyKCAnZmllbGRfYWRkZWQnICk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9ICk7XG5cdH1cblxuXHRzZXR1cEZpZWxkKCB0cnVlICk7XG5cblx0ZmllbGRXcmFwcGVyLm9uKCAnZmllbGRfYWRkZWQnLCBmdW5jdGlvbigpIHtcblx0XHQvLyBUb2dnbGUgdGhlIHZpc2liaWxpdHkgb2Ygc3ViZmllbGRzLlxuXHRcdHNldHVwRmllbGQoKTtcblx0fSApO1xuXG59ICk7XG4iXX0=
