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
  var $searchForm = $('#search-form');
  $searchForm.on('after_toggle_request', function (e, handler, value, $field) {
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
  $searchForm.on('after_toggle_request', function (e, handler, value, $field) {
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
  var $searchForm = $('#search-form'); // Override no-results-message, all-items-label field's toggle visibility when text display type is changed.

  $searchForm.on('after_toggle_request', function (e, handler, value, $field) {
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

  $searchForm.on('after_toggle_request', function (e, handler, value, $field) {
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
  var $searchForm = $('#search-form');
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

  initSortableTable($searchForm.find(tableRowsIdentifier)); // Init the sortable table after the field is added.

  $searchForm.on('field_added', function (e, ui) {
    initSortableTable($(ui.item.find(tableRowsIdentifier)));
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
    $valueHolder.val(rawValues);
  }

  function triggerRemoveOption($field) {
    var $optionsTable = $field.find(tableIdentifier);
    var tableRows = $field.find(tableRowsIdentifier).children();

    if (2 > tableRows.length) {
      $optionsTable.removeClass('has-options');
    }
  } // Remove Option


  var removeBtnIdentifier = tableIdentifier + ' .remove-option';
  $searchForm.on('click', removeBtnIdentifier, function () {
    var $item = $(this).closest(rowIdentifier);
    var $field = $item.closest(fieldIdentifier);
    triggerRemoveOption($field);
    $item.remove();
    triggerOptionsChange($field);
  }); // Clear All Options

  var clearOptionsBtnIdentifier = tableIdentifier + ' .clear-options';
  $searchForm.on('click', clearOptionsBtnIdentifier, function () {
    var $field = $(this).closest(fieldIdentifier);
    $field.find(tableRowsIdentifier).empty();
    triggerRemoveOption($field);
    triggerOptionsChange($field);
  }); // Add New Option

  var addOptionBtnIdentifier = tableIdentifier + ' .add-option';
  $searchForm.on('click', addOptionBtnIdentifier, function () {
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
    $searchForm.trigger('new_option_added', [$field]);

    if (!$table.hasClass('has-options')) {
      $table.addClass('has-options');
    }
  }); // Trigger options change when the text fields get changed.

  var textFieldsIdentifier = tableRowsIdentifier + ' input[type="text"]';
  $searchForm.on('input', textFieldsIdentifier, function () {
    var $field = $(this).closest(fieldIdentifier);
    triggerOptionsChange($field);
  }); // Trigger options change when the select fields get changed.

  var selectFieldsIdentifier = tableRowsIdentifier + ' select';
  $searchForm.on('change', selectFieldsIdentifier, function () {
    var $field = $(this).closest(fieldIdentifier);
    triggerOptionsChange($field);
  }); // Trigger options change when value is added from modal.

  $searchForm.on('trigger_options_table', function (e, tableId, $field) {
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
  var $searchForm = $('#search-form');
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

  $searchForm.find('.wcapf-form-sub-field-min_value_auto_detect input[type="checkbox"]').each(function () {
    var $this = $(this);
    toggleNumberMinValueField($this);
  });
  $searchForm.on('click', '.wcapf-form-sub-field-min_value_auto_detect input[type="checkbox"]', function () {
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
searchForm.on('click', '.expand-all-fields-btn', function () {
  var $fields = searchForm.find('[data-field-type]');
  $fields.each(function () {
    var $item = jQuery(this);

    if (!$item.hasClass('open')) {
      $item.find('.widget-top').trigger('click');
    }
  });
});
searchForm.on('click', '.collapse-all-fields-btn', function () {
  var $fields = searchForm.find('[data-field-type]');
  $fields.each(function () {
    var $item = jQuery(this);

    if ($item.hasClass('open')) {
      $item.find('.widget-top').trigger('click');
    }
  });
});
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
      'selector': '.wcapf-form-sub-field-inline_display',
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
      'selector': '.wcapf-form-sub-field-number_range_enable_multiple_filter',
      'value': ['range_label']
    }, {
      'selector': '.wcapf-form-sub-field-number_range_inline_display',
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
      'selector': '.wcapf-form-sub-field-time_period_inline_display',
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
    'handler': '.wcapf-form-sub-field-custom-taxonomy select',
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImN1c3RvbS1hcHBlYXJhbmNlLWZpZWxkcy5qcyIsImRpc3BsYXktdHlwZS1maWVsZHMuanMiLCJtYW51YWwtb3B0aW9ucy10YWJsZS5qcyIsIm51bWJlci11aS1vcHRpb25zLmpzIiwicHJvZHVjdC1zdGF0dXMtdGFibGUuanMiLCJzZWFyY2gtZm9ybS5qcyIsInRvZ2dsZVZpc2liaWxpdHkuanMiXSwibmFtZXMiOlsialF1ZXJ5IiwiZG9jdW1lbnQiLCJyZWFkeSIsIiQiLCIkc2VhcmNoRm9ybSIsIm9uIiwiZSIsImhhbmRsZXIiLCJ2YWx1ZSIsIiRmaWVsZCIsIiRxdWVyeVR5cGUiLCJmaW5kIiwidmFsaWREaXNwbGF5VHlwZXMiLCJpbmNsdWRlcyIsIiRtdWx0aXBsZUZpbHRlciIsImlzIiwic2hvdyIsImhpZGUiLCIkZGlzcGxheVR5cGUiLCJkaXNwbGF5VHlwZSIsInZhbCIsIiRub1Jlc3VsdHMiLCIkYWxsSXRlbXNMYWJlbCIsInVzZUNob3NlbiIsImluaXRNYW51YWxPcHRpb25zVGFibGUiLCJ0YWJsZUlkZW50aWZpZXIiLCJ2YWx1ZUlkZW50aWZpZXIiLCJyb3dUZW1wbGF0ZUlkIiwicm93RGVmYXVsdE9wdGlvbnMiLCJmaWVsZElkZW50aWZpZXIiLCJyb3dzSWRlbnRpZmllciIsInJvd0lkZW50aWZpZXIiLCJpbml0U29ydGFibGVUYWJsZSIsIiRzZWxlY3RvciIsInNvcnRhYmxlIiwib3BhY2l0eSIsInJldmVydCIsImN1cnNvciIsImF4aXMiLCJoYW5kbGUiLCJwbGFjZWhvbGRlciIsInVwZGF0ZSIsInRhcmdldCIsImNsb3Nlc3QiLCJ0cmlnZ2VyT3B0aW9uc0NoYW5nZSIsImRpc2FibGVTZWxlY3Rpb24iLCJ0YWJsZVJvd3NJZGVudGlmaWVyIiwidWkiLCJpdGVtIiwiJHZhbHVlSG9sZGVyIiwiJHJvd3MiLCJfcm93cyIsImVhY2giLCJpIiwiX2l0ZW0iLCIkaXRlbSIsIm9iaiIsImZpZWxkSW5kZXgiLCJmaWVsZCIsIm5hbWUiLCJhdHRyIiwicHVzaCIsInJhd1ZhbHVlcyIsImVuY29kZVVSSUNvbXBvbmVudCIsIkpTT04iLCJzdHJpbmdpZnkiLCJ0cmlnZ2VyUmVtb3ZlT3B0aW9uIiwiJG9wdGlvbnNUYWJsZSIsInRhYmxlUm93cyIsImNoaWxkcmVuIiwibGVuZ3RoIiwicmVtb3ZlQ2xhc3MiLCJyZW1vdmVCdG5JZGVudGlmaWVyIiwicmVtb3ZlIiwiY2xlYXJPcHRpb25zQnRuSWRlbnRpZmllciIsImVtcHR5IiwiYWRkT3B0aW9uQnRuSWRlbnRpZmllciIsInRlbXBsYXRlIiwid3AiLCJyZW5kZXJlZCIsIiR0YWJsZSIsImFwcGVuZCIsInRyaWdnZXIiLCJoYXNDbGFzcyIsImFkZENsYXNzIiwidGV4dEZpZWxkc0lkZW50aWZpZXIiLCJzZWxlY3RGaWVsZHNJZGVudGlmaWVyIiwidGFibGVJZCIsInRvZ2dsZU51bWJlck1pblZhbHVlRmllbGQiLCIkZWxtIiwiJHRleHRGaWVsZCIsInJlbW92ZUF0dHIiLCIkdGhpcyIsInRvZ2dsZU51bWJlck1heFZhbHVlRmllbGQiLCJ0b3RhbEZpZWxkSW5zdGFuY2VzIiwic2VhcmNoRm9ybSIsInJlbW92ZVBsYWNlaG9sZGVyIiwidW5pcXVlSWQiLCJlbGVtZW50cyIsImVsZW1lbnQiLCJvbGRWYWx1ZSIsIm5ld1ZhbHVlIiwicmVwbGFjZSIsImluc2VydEZpZWxkU3ViRmllbGRzIiwidHlwZSIsInBhcnNlSW50IiwiZmllbGRUeXBlIiwid3JhcHBlciIsInByZXBlbmQiLCJ1cGRhdGVGaWVsZHNQb3NpdGlvbiIsImlucHV0cyIsIm5iRWxlbXMiLCJpZHgiLCJtYWtlRmllbGRSZWFkeSIsInRvZ2dsZUJ0biIsImlkZW50aWZpZXIiLCJjb250YWluZXIiLCJjYW5jZWwiLCJpdGVtcyIsImNvbm5lY3RXaXRoIiwic3RvcCIsInN0YXJ0IiwiYXBwZW5kVG8iLCJwYXJlbnQiLCJvbkRyYWdTdGFydCIsIm9uRHJhZ1N0b3AiLCJkcmFnZ2FibGUiLCJjb25uZWN0VG9Tb3J0YWJsZSIsImhlbHBlciIsInRvZ2dsZUZpZWxkIiwid2lkZ2V0IiwiaW5zaWRlIiwiaXNFeHBhbmQiLCJ0b2dnbGVFeHBhbmQiLCJzbGlkZVRvZ2dsZSIsInRvZ2dsZUNsYXNzIiwiZm9jdXNGaWVsZCIsImNsYXNzTGlzdCIsImNvbnRhaW5zIiwiYWN0aW9uIiwiZm9jdXMiLCJyZW1vdmVGaWVsZCIsInNsaWRlVXAiLCJpbml0aWFsRm9ybVN0YXRlIiwic2VyaWFsaXplQXJyYXkiLCJzaG93TWVzc2FnZSIsIm1lc3NhZ2UiLCJodG1sIiwic2xpZGVEb3duIiwic2V0VGltZW91dCIsInNhdmVGb3JtIiwiYnV0dG9uIiwiZm9ybURhdGEiLCJva0NhbGxiYWNrIiwiZXJyQ2FsbGJhY2siLCJhamF4IiwicG9zdCIsImRvbmUiLCJmYWlsIiwiJGZpZWxkcyIsImRlcGVuZGFudERhdGEiLCJfaGFuZGxlVG9nZ2xlUmVxdWVzdCIsImRhdGEiLCJjdXJyZW50U2VsZWN0b3IiLCJoYW5kbGVyVHlwZSIsImRlcGVuZGFudCIsIl92YWx1ZSIsImlkIiwiZCIsInZhbGlkVmFsdWVzIiwiaGFuZGxlVG9nZ2xlUmVxdWVzdCIsIiRoYW5kbGVyIiwiX3RoaXMiLCJzZXR1cFNlYXJjaEZvcm0iLCJpbml0YWwiLCJldmVudCJdLCJtYXBwaW5ncyI6Ijs7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUFBLE1BQU0sQ0FBRUMsUUFBRixDQUFOLENBQW1CQyxLQUFuQixDQUEwQixVQUFVQyxDQUFWLEVBQWM7QUFFdkMsTUFBTUMsV0FBVyxHQUFHRCxDQUFDLENBQUUsY0FBRixDQUFyQjtBQUVBQyxFQUFBQSxXQUFXLENBQUNDLEVBQVosQ0FBZ0Isc0JBQWhCLEVBQXdDLFVBQVVDLENBQVYsRUFBYUMsT0FBYixFQUFzQkMsS0FBdEIsRUFBNkJDLE1BQTdCLEVBQXNDO0FBQzdFLFFBQUssZ0RBQWdERixPQUFyRCxFQUErRDtBQUM5RCxVQUFNRyxVQUFVLEdBQVVELE1BQU0sQ0FBQ0UsSUFBUCxDQUFhLGtDQUFiLENBQTFCO0FBQ0Es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Q29udGVudCI6WyIvKipcbiAqIERpc3BsYXkgdHlwZSBmaWVsZHMuXG4gKlxuICogQHNpbmNlICAgICAgMy4wLjBcbiAqIEBwYWNrYWdlICAgIHdjLWFqYXgtcHJvZHVjdC1maWx0ZXJcbiAqIEBzdWJwYWNrYWdlIHdjLWFqYXgtcHJvZHVjdC1maWx0ZXIvYWRtaW4vc3JjL2pzXG4gKiBAYXV0aG9yICAgICBNYWludWwgSGFzc2FuIE1haW5cbiAqL1xuXG5qUXVlcnkoIGRvY3VtZW50ICkucmVhZHkoIGZ1bmN0aW9uKCAkICkge1xuXG5cdGNvbnN0ICRzZWFyY2hGb3JtID0gJCggJyNzZWFyY2gtZm9ybScgKTtcblxuXHQkc2VhcmNoRm9ybS5vbiggJ2FmdGVyX3RvZ2dsZV9yZXF1ZXN0JywgZnVuY3Rpb24oIGUsIGhhbmRsZXIsIHZhbHVlLCAkZmllbGQgKSB7XG5cdFx0aWYgKCAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLWRpc3BsYXlfdHlwZSBzZWxlY3QnID09PSBoYW5kbGVyICkge1xuXHRcdFx0Y29uc3QgJHF1ZXJ5VHlwZSAgICAgICAgPSAkZmllbGQuZmluZCggJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1xdWVyeV90eXBlJyApO1xuXHRcdFx0Y29uc3QgdmFsaWREaXNwbGF5VHlwZXMgPSBbICdsYWJlbCcsICdjb2xvcicsICdpbWFnZScgXTtcblxuXHRcdFx0aWYgKCB2YWxpZERpc3BsYXlUeXBlcy5pbmNsdWRlcyggdmFsdWUgKSApIHtcblx0XHRcdFx0Y29uc3QgJG11bHRpcGxlRmlsdGVyID0gJGZpZWxkLmZpbmQoICcud2NhcGYtZm9ybS1zdWItZmllbGQtZW5hYmxlX211bHRpcGxlX2ZpbHRlciBpbnB1dCcgKTtcblxuXHRcdFx0XHRpZiAoICRtdWx0aXBsZUZpbHRlci5pcyggJzpjaGVja2VkJyApICkge1xuXHRcdFx0XHRcdCRxdWVyeVR5cGUuc2hvdygpO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdCRxdWVyeVR5cGUuaGlkZSgpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXHR9ICk7XG5cblx0JHNlYXJjaEZvcm0ub24oICdhZnRlcl90b2dnbGVfcmVxdWVzdCcsIGZ1bmN0aW9uKCBlLCBoYW5kbGVyLCB2YWx1ZSwgJGZpZWxkICkge1xuXHRcdGlmICggJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1lbmFibGVfbXVsdGlwbGVfZmlsdGVyIGlucHV0JyA9PT0gaGFuZGxlciApIHtcblx0XHRcdGNvbnN0ICRxdWVyeVR5cGUgICAgICAgID0gJGZpZWxkLmZpbmQoICcud2NhcGYtZm9ybS1zdWItZmllbGQtcXVlcnlfdHlwZScgKTtcblx0XHRcdGNvbnN0ICRkaXNwbGF5VHlwZSAgICAgID0gJGZpZWxkLmZpbmQoICcud2NhcGYtZm9ybS1zdWItZmllbGQtZGlzcGxheV90eXBlIHNlbGVjdCcgKTtcblx0XHRcdGNvbnN0IGRpc3BsYXlUeXBlICAgICAgID0gJGRpc3BsYXlUeXBlLnZhbCgpO1xuXHRcdFx0Y29uc3QgdmFsaWREaXNwbGF5VHlwZXMgPSBbICdsYWJlbCcsICdjb2xvcicsICdpbWFnZScgXTtcblxuXHRcdFx0aWYgKCB2YWxpZERpc3BsYXlUeXBlcy5pbmNsdWRlcyggZGlzcGxheVR5cGUgKSApIHtcblx0XHRcdFx0aWYgKCAnMScgPT09IHZhbHVlICkge1xuXHRcdFx0XHRcdCRxdWVyeVR5cGUuc2hvdygpO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdCRxdWVyeVR5cGUuaGlkZSgpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXHR9ICk7XG5cbn0gKTtcbiIsIi8qKlxuICogRGlzcGxheSB0eXBlIGZpZWxkcy5cbiAqXG4gKiBAc2luY2UgICAgICAzLjAuMFxuICogQHBhY2thZ2UgICAgd2MtYWpheC1wcm9kdWN0LWZpbHRlclxuICogQHN1YnBhY2thZ2Ugd2MtYWpheC1wcm9kdWN0LWZpbHRlci9hZG1pbi9zcmMvanNcbiAqIEBhdXRob3IgICAgIE1haW51bCBIYXNzYW4gTWFpblxuICovXG5cbmpRdWVyeSggZG9jdW1lbnQgKS5yZWFkeSggZnVuY3Rpb24oICQgKSB7XG5cblx0Y29uc3QgJHNlYXJjaEZvcm0gPSAkKCAnI3NlYXJjaC1mb3JtJyApO1xuXG5cdC8vIE92ZXJyaWRlIG5vLXJlc3VsdHMtbWVzc2FnZSwgYWxsLWl0ZW1zLWxhYmVsIGZpZWxkJ3MgdG9nZ2xlIHZpc2liaWxpdHkgd2hlbiB0ZXh0IGRpc3BsYXkgdHlwZSBpcyBjaGFuZ2VkLlxuXHQkc2VhcmNoRm9ybS5vbiggJ2FmdGVyX3RvZ2dsZV9yZXF1ZXN0JywgZnVuY3Rpb24oIGUsIGhhbmRsZXIsIHZhbHVlLCAkZmllbGQgKSB7XG5cdFx0aWYgKCAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLWRpc3BsYXlfdHlwZSBzZWxlY3QnID09PSBoYW5kbGVyICkge1xuXHRcdFx0Y29uc3QgJG5vUmVzdWx0cyAgICAgPSAkZmllbGQuZmluZCggJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1jaG9zZW5fbm9fcmVzdWx0c19tZXNzYWdlJyApO1xuXHRcdFx0Y29uc3QgJGFsbEl0ZW1zTGFiZWwgPSAkZmllbGQuZmluZCggJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1hbGxfaXRlbXNfbGFiZWwnICk7XG5cdFx0XHRjb25zdCB1c2VDaG9zZW4gICAgICA9ICRmaWVsZC5maW5kKCAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLXVzZV9jaG9zZW4gaW5wdXQnICkuaXMoICc6Y2hlY2tlZCcgKTtcblxuXHRcdFx0aWYgKCB1c2VDaG9zZW4gJiYgKCAnc2VsZWN0JyA9PT0gdmFsdWUgfHwgJ211bHRpLXNlbGVjdCcgPT09IHZhbHVlICkgKSB7XG5cdFx0XHRcdCRub1Jlc3VsdHMuc2hvdygpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0JG5vUmVzdWx0cy5oaWRlKCk7XG5cdFx0XHR9XG5cblx0XHRcdGlmICggKCAncmFkaW8nID09PSB2YWx1ZSB8fCAnc2VsZWN0JyA9PT0gdmFsdWUgKSB8fCAoICdtdWx0aS1zZWxlY3QnID09PSB2YWx1ZSAmJiB1c2VDaG9zZW4gKSApIHtcblx0XHRcdFx0JGFsbEl0ZW1zTGFiZWwuc2hvdygpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0JGFsbEl0ZW1zTGFiZWwuaGlkZSgpO1xuXHRcdFx0fVxuXHRcdH1cblx0fSApO1xuXG5cdC8vIE92ZXJyaWRlIG5vLXJlc3VsdHMtbWVzc2FnZSwgYWxsLWl0ZW1zLWxhYmVsIGZpZWxkJ3MgdG9nZ2xlIHZpc2liaWxpdHkgd2hlbiB0ZXh0IHVzZSBjaG9zZW4gaXMgY2hhbmdlZC5cblx0JHNlYXJjaEZvcm0ub24oICdhZnRlcl90b2dnbGVfcmVxdWVzdCcsIGZ1bmN0aW9uKCBlLCBoYW5kbGVyLCB2YWx1ZSwgJGZpZWxkICkge1xuXHRcdGlmICggJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC11c2VfY2hvc2VuIGlucHV0JyA9PT0gaGFuZGxlciApIHtcblx0XHRcdGNvbnN0ICRub1Jlc3VsdHMgICAgID0gJGZpZWxkLmZpbmQoICcud2NhcGYtZm9ybS1zdWItZmllbGQtY2hvc2VuX25vX3Jlc3VsdHNfbWVzc2FnZScgKTtcblx0XHRcdGNvbnN0ICRhbGxJdGVtc0xhYmVsID0gJGZpZWxkLmZpbmQoICcud2NhcGYtZm9ybS1zdWItZmllbGQtYWxsX2l0ZW1zX2xhYmVsJyApO1xuXHRcdFx0Y29uc3QgZGlzcGxheVR5cGUgICAgPSAkZmllbGQuZmluZCggJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1kaXNwbGF5X3R5cGUgc2VsZWN0JyApLnZhbCgpO1xuXG5cdFx0XHRpZiAoICcxJyA9PT0gdmFsdWUgJiYgKCAnc2VsZWN0JyA9PT0gZGlzcGxheVR5cGUgfHwgJ211bHRpLXNlbGVjdCcgPT09IGRpc3BsYXlUeXBlICkgKSB7XG5cdFx0XHRcdCRub1Jlc3VsdHMuc2hvdygpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0JG5vUmVzdWx0cy5oaWRlKCk7XG5cdFx0XHR9XG5cblx0XHRcdGlmIChcblx0XHRcdFx0KCAnMScgPT09IHZhbHVlICYmICdtdWx0aS1zZWxlY3QnID09PSBkaXNwbGF5VHlwZSApXG5cdFx0XHRcdHx8ICggJ3JhZGlvJyA9PT0gZGlzcGxheVR5cGUgfHwgJ3NlbGVjdCcgPT09IGRpc3BsYXlUeXBlIClcblx0XHRcdCkge1xuXHRcdFx0XHQkYWxsSXRlbXNMYWJlbC5zaG93KCk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHQkYWxsSXRlbXNMYWJlbC5oaWRlKCk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9ICk7XG5cbn0gKTtcbiIsIi8qKlxuICogTWFudWFsIE9wdGlvbnMnIHRhYmxlIGZ1bmN0aW9uLlxuICpcbiAqIEBzaW5jZSAgICAgIDMuMC4wXG4gKiBAcGFja2FnZSAgICB3Yy1hamF4LXByb2R1Y3QtZmlsdGVyXG4gKiBAc3VicGFja2FnZSB3Yy1hamF4LXByb2R1Y3QtZmlsdGVyL2FkbWluL3NyYy9qc1xuICogQGF1dGhvciAgICAgTWFpbnVsIEhhc3NhbiBNYWluXG4gKi9cblxuLyoqXG4gKiBAcGFyYW0gdGFibGVJZGVudGlmaWVyXG4gKiBAcGFyYW0gdmFsdWVJZGVudGlmaWVyXG4gKiBAcGFyYW0gcm93VGVtcGxhdGVJZFxuICogQHBhcmFtIHJvd0RlZmF1bHRPcHRpb25zXG4gKi9cbmZ1bmN0aW9uIGluaXRNYW51YWxPcHRpb25zVGFibGUoIHRhYmxlSWRlbnRpZmllciwgdmFsdWVJZGVudGlmaWVyLCByb3dUZW1wbGF0ZUlkLCByb3dEZWZhdWx0T3B0aW9ucyA9IHt9ICkge1xuXHRjb25zdCAkID0galF1ZXJ5O1xuXG5cdGNvbnN0ICRzZWFyY2hGb3JtID0gJCggJyNzZWFyY2gtZm9ybScgKTtcblxuXHRjb25zdCBmaWVsZElkZW50aWZpZXIgPSAnLndjYXBmLWZvcm0tZmllbGQnO1xuXHRjb25zdCByb3dzSWRlbnRpZmllciAgPSAnLmZpZWxkLXRhYmxlLWJvZHktcm93cyc7XG5cdGNvbnN0IHJvd0lkZW50aWZpZXIgICA9ICcucm93LWl0ZW0nO1xuXG5cdGZ1bmN0aW9uIGluaXRTb3J0YWJsZVRhYmxlKCAkc2VsZWN0b3IgKSB7XG5cdFx0JHNlbGVjdG9yLnNvcnRhYmxlKCB7XG5cdFx0XHRvcGFjaXR5OiAwLjgsXG5cdFx0XHRyZXZlcnQ6IGZhbHNlLFxuXHRcdFx0Y3Vyc29yOiAnbW92ZScsXG5cdFx0XHRheGlzOiAneScsXG5cdFx0XHRoYW5kbGU6ICcubW92ZS1vcHRpb25zLWhhbmRsZXInLFxuXHRcdFx0cGxhY2Vob2xkZXI6ICd3aWRnZXQtcGxhY2Vob2xkZXInLFxuXHRcdFx0dXBkYXRlOiBmdW5jdGlvbiggZSApIHtcblx0XHRcdFx0Y29uc3QgJGZpZWxkID0gJCggZS50YXJnZXQgKS5jbG9zZXN0KCAnLndjYXBmLWZvcm0tZmllbGQnICk7XG5cblx0XHRcdFx0dHJpZ2dlck9wdGlvbnNDaGFuZ2UoICRmaWVsZCApO1xuXHRcdFx0fVxuXHRcdH0gKS5kaXNhYmxlU2VsZWN0aW9uKCk7XG5cdH1cblxuXHRjb25zdCB0YWJsZVJvd3NJZGVudGlmaWVyID0gdGFibGVJZGVudGlmaWVyICsgJyAnICsgcm93c0lkZW50aWZpZXI7XG5cblx0Ly8gSW5pdCB0aGUgc29ydGFibGUgdGFibGUgYWZ0ZXIgcGFnZSBsb2Fkcy5cblx0aW5pdFNvcnRhYmxlVGFibGUoICRzZWFyY2hGb3JtLmZpbmQoIHRhYmxlUm93c0lkZW50aWZpZXIgKSApO1xuXG5cdC8vIEluaXQgdGhlIHNvcnRhYmxlIHRhYmxlIGFmdGVyIHRoZSBmaWVsZCBpcyBhZGRlZC5cblx0JHNlYXJjaEZvcm0ub24oICdmaWVsZF9hZGRlZCcsIGZ1bmN0aW9uKCBlLCB1aSApIHtcblx0XHRpbml0U29ydGFibGVUYWJsZSggJCggdWkuaXRlbS5maW5kKCB0YWJsZVJvd3NJZGVudGlmaWVyICkgKSApO1xuXHR9ICk7XG5cblx0ZnVuY3Rpb24gdHJpZ2dlck9wdGlvbnNDaGFuZ2UoICRmaWVsZCApIHtcblx0XHRjb25zdCAkdmFsdWVIb2xkZXIgPSAkZmllbGQuZmluZCggdmFsdWVJZGVudGlmaWVyICk7XG5cdFx0Y29uc3QgJHJvd3MgICAgICAgID0gJGZpZWxkLmZpbmQoIHRhYmxlUm93c0lkZW50aWZpZXIgKTtcblx0XHRjb25zdCBfcm93cyAgICAgICAgPSBbXTtcblxuXHRcdCRyb3dzLmZpbmQoICcucm93LWl0ZW0nICkuZWFjaCggZnVuY3Rpb24oIGksIF9pdGVtICkge1xuXHRcdFx0Y29uc3QgJGl0ZW0gPSAkKCBfaXRlbSApO1xuXHRcdFx0Y29uc3Qgb2JqICAgPSB7fTtcblxuXHRcdFx0JGl0ZW0uZmluZCggJ1tkYXRhLW5hbWVdJyApLmVhY2goIGZ1bmN0aW9uKCBmaWVsZEluZGV4LCBmaWVsZCApIHtcblx0XHRcdFx0Y29uc3QgJGZpZWxkID0gJCggZmllbGQgKTtcblx0XHRcdFx0Y29uc3QgbmFtZSAgID0gJGZpZWxkLmF0dHIoICdkYXRhLW5hbWUnICk7XG5cblx0XHRcdFx0b2JqWyBuYW1lIF0gPSAkZmllbGQudmFsKCk7XG5cdFx0XHR9ICk7XG5cblx0XHRcdF9yb3dzLnB1c2goIG9iaiApO1xuXHRcdH0gKTtcblxuXHRcdGNvbnN0IHJhd1ZhbHVlcyA9IGVuY29kZVVSSUNvbXBvbmVudCggSlNPTi5zdHJpbmdpZnkoIF9yb3dzICkgKTtcblx0XHQkdmFsdWVIb2xkZXIudmFsKCByYXdWYWx1ZXMgKTtcblx0fVxuXG5cdGZ1bmN0aW9uIHRyaWdnZXJSZW1vdmVPcHRpb24oICRmaWVsZCApIHtcblx0XHRjb25zdCAkb3B0aW9uc1RhYmxlID0gJGZpZWxkLmZpbmQoIHRhYmxlSWRlbnRpZmllciApO1xuXHRcdGNvbnN0IHRhYmxlUm93cyAgICAgPSAkZmllbGQuZmluZCggdGFibGVSb3dzSWRlbnRpZmllciApLmNoaWxkcmVuKCk7XG5cblx0XHRpZiAoIDIgPiB0YWJsZVJvd3MubGVuZ3RoICkge1xuXHRcdFx0JG9wdGlvbnNUYWJsZS5yZW1vdmVDbGFzcyggJ2hhcy1vcHRpb25zJyApO1xuXHRcdH1cblx0fVxuXG5cdC8vIFJlbW92ZSBPcHRpb25cblx0Y29uc3QgcmVtb3ZlQnRuSWRlbnRpZmllciA9IHRhYmxlSWRlbnRpZmllciArICcgLnJlbW92ZS1vcHRpb24nO1xuXG5cdCRzZWFyY2hGb3JtLm9uKCAnY2xpY2snLCByZW1vdmVCdG5JZGVudGlmaWVyLCBmdW5jdGlvbigpIHtcblx0XHRjb25zdCAkaXRlbSAgPSAkKCB0aGlzICkuY2xvc2VzdCggcm93SWRlbnRpZmllciApO1xuXHRcdGNvbnN0ICRmaWVsZCA9ICRpdGVtLmNsb3Nlc3QoIGZpZWxkSWRlbnRpZmllciApO1xuXG5cdFx0dHJpZ2dlclJlbW92ZU9wdGlvbiggJGZpZWxkICk7XG5cblx0XHQkaXRlbS5yZW1vdmUoKTtcblxuXHRcdHRyaWdnZXJPcHRpb25zQ2hhbmdlKCAkZmllbGQgKTtcblx0fSApO1xuXG5cdC8vIENsZWFyIEFsbCBPcHRpb25zXG5cdGNvbnN0IGNsZWFyT3B0aW9uc0J0bklkZW50aWZpZXIgPSB0YWJsZUlkZW50aWZpZXIgKyAnIC5jbGVhci1vcHRpb25zJztcblxuXHQkc2VhcmNoRm9ybS5vbiggJ2NsaWNrJywgY2xlYXJPcHRpb25zQnRuSWRlbnRpZmllciwgZnVuY3Rpb24oKSB7XG5cdFx0Y29uc3QgJGZpZWxkID0gJCggdGhpcyApLmNsb3Nlc3QoIGZpZWxkSWRlbnRpZmllciApO1xuXG5cdFx0JGZpZWxkLmZpbmQoIHRhYmxlUm93c0lkZW50aWZpZXIgKS5lbXB0eSgpO1xuXG5cdFx0dHJpZ2dlclJlbW92ZU9wdGlvbiggJGZpZWxkICk7XG5cdFx0dHJpZ2dlck9wdGlvbnNDaGFuZ2UoICRmaWVsZCApO1xuXHR9ICk7XG5cblx0Ly8gQWRkIE5ldyBPcHRpb25cblx0Y29uc3QgYWRkT3B0aW9uQnRuSWRlbnRpZmllciA9IHRhYmxlSWRlbnRpZmllciArICcgLmFkZC1vcHRpb24nO1xuXG5cdCRzZWFyY2hGb3JtLm9uKCAnY2xpY2snLCBhZGRPcHRpb25CdG5JZGVudGlmaWVyLCBmdW5jdGlvbigpIHtcblx0XHQvLyBCYWlsIG91dCBpZiBubyB0bXBsIGZvdW5kIGZvciB0aGUgdHlwZS5cblx0XHRpZiAoICEgalF1ZXJ5KCAnI3RtcGwtJyArIHJvd1RlbXBsYXRlSWQgKS5sZW5ndGggKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0Y29uc3QgJGZpZWxkID0gJCggdGhpcyApLmNsb3Nlc3QoIGZpZWxkSWRlbnRpZmllciApO1xuXG5cdFx0Y29uc3QgdGVtcGxhdGUgPSB3cC50ZW1wbGF0ZSggcm93VGVtcGxhdGVJZCApO1xuXHRcdGNvbnN0IHJlbmRlcmVkID0gdGVtcGxhdGUoIHJvd0RlZmF1bHRPcHRpb25zICk7XG5cdFx0Y29uc3QgJHRhYmxlICAgPSAkZmllbGQuZmluZCggdGFibGVJZGVudGlmaWVyICk7XG5cdFx0Y29uc3QgJHJvd3MgICAgPSAkZmllbGQuZmluZCggdGFibGVSb3dzSWRlbnRpZmllciApO1xuXG5cdFx0JHJvd3MuYXBwZW5kKCByZW5kZXJlZCApO1xuXG5cdFx0dHJpZ2dlck9wdGlvbnNDaGFuZ2UoICRmaWVsZCApO1xuXG5cdFx0JHNlYXJjaEZvcm0udHJpZ2dlciggJ25ld19vcHRpb25fYWRkZWQnLCBbICRmaWVsZCBdICk7XG5cblx0XHRpZiAoICEgJHRhYmxlLmhhc0NsYXNzKCAnaGFzLW9wdGlvbnMnICkgKSB7XG5cdFx0XHQkdGFibGUuYWRkQ2xhc3MoICdoYXMtb3B0aW9ucycgKTtcblx0XHR9XG5cdH0gKTtcblxuXHQvLyBUcmlnZ2VyIG9wdGlvbnMgY2hhbmdlIHdoZW4gdGhlIHRleHQgZmllbGRzIGdldCBjaGFuZ2VkLlxuXHRjb25zdCB0ZXh0RmllbGRzSWRlbnRpZmllciA9IHRhYmxlUm93c0lkZW50aWZpZXIgKyAnIGlucHV0W3R5cGU9XCJ0ZXh0XCJdJztcblxuXHQkc2VhcmNoRm9ybS5vbiggJ2lucHV0JywgdGV4dEZpZWxkc0lkZW50aWZpZXIsIGZ1bmN0aW9uKCkge1xuXHRcdGNvbnN0ICRmaWVsZCA9ICQoIHRoaXMgKS5jbG9zZXN0KCBmaWVsZElkZW50aWZpZXIgKTtcblxuXHRcdHRyaWdnZXJPcHRpb25zQ2hhbmdlKCAkZmllbGQgKTtcblx0fSApO1xuXG5cdC8vIFRyaWdnZXIgb3B0aW9ucyBjaGFuZ2Ugd2hlbiB0aGUgc2VsZWN0IGZpZWxkcyBnZXQgY2hhbmdlZC5cblx0bGV0IHNlbGVjdEZpZWxkc0lkZW50aWZpZXIgPSB0YWJsZVJvd3NJZGVudGlmaWVyICsgJyBzZWxlY3QnO1xuXG5cdCRzZWFyY2hGb3JtLm9uKCAnY2hhbmdlJywgc2VsZWN0RmllbGRzSWRlbnRpZmllciwgZnVuY3Rpb24oKSB7XG5cdFx0Y29uc3QgJGZpZWxkID0gJCggdGhpcyApLmNsb3Nlc3QoIGZpZWxkSWRlbnRpZmllciApO1xuXG5cdFx0dHJpZ2dlck9wdGlvbnNDaGFuZ2UoICRmaWVsZCApO1xuXHR9ICk7XG5cblx0Ly8gVHJpZ2dlciBvcHRpb25zIGNoYW5nZSB3aGVuIHZhbHVlIGlzIGFkZGVkIGZyb20gbW9kYWwuXG5cdCRzZWFyY2hGb3JtLm9uKCAndHJpZ2dlcl9vcHRpb25zX3RhYmxlJywgZnVuY3Rpb24oIGUsIHRhYmxlSWQsICRmaWVsZCApIHtcblx0XHRpZiAoIHRhYmxlSWQgPT09IHRhYmxlSWRlbnRpZmllciApIHtcblx0XHRcdHRyaWdnZXJPcHRpb25zQ2hhbmdlKCAkZmllbGQgKTtcblx0XHR9XG5cdH0gKTtcblxufVxuIiwiLyoqXG4gKiBUaGUgbnVtYmVyIHVpIG9wdGlvbnMuXG4gKlxuICogQHNpbmNlICAgICAgMy4wLjBcbiAqIEBwYWNrYWdlICAgIHdjLWFqYXgtcHJvZHVjdC1maWx0ZXJcbiAqIEBzdWJwYWNrYWdlIHdjLWFqYXgtcHJvZHVjdC1maWx0ZXIvYWRtaW4vc3JjL2pzXG4gKiBAYXV0aG9yICAgICBNYWludWwgSGFzc2FuIE1haW5cbiAqL1xuXG5qUXVlcnkoIGRvY3VtZW50ICkucmVhZHkoIGZ1bmN0aW9uKCAkICkge1xuXG5cdGNvbnN0ICRzZWFyY2hGb3JtID0gJCggJyNzZWFyY2gtZm9ybScgKTtcblxuXHQvKipcblx0ICogVG9nZ2xlIGRpc2FibGVkIGF0dHJpYnV0ZSBvZiBtaW4tdmFsdWUgZmllbGQgZm9yIG51bWJlciB0eXBlLlxuXHQgKi9cblx0ZnVuY3Rpb24gdG9nZ2xlTnVtYmVyTWluVmFsdWVGaWVsZCggJGVsbSApIHtcblx0XHRjb25zdCAkZmllbGQgICAgID0gJGVsbS5jbG9zZXN0KCAnLndjYXBmLWZvcm0tZmllbGQnICk7XG5cdFx0Y29uc3QgJHRleHRGaWVsZCA9ICRmaWVsZC5maW5kKCAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLW1pbl92YWx1ZSBpbnB1dFt0eXBlPVwidGV4dFwiXScgKTtcblxuXHRcdGlmICggJGVsbS5pcyggJzpjaGVja2VkJyApICkge1xuXHRcdFx0JHRleHRGaWVsZC5hdHRyKCAnZGlzYWJsZWQnLCAnZGlzYWJsZWQnICk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdCR0ZXh0RmllbGQucmVtb3ZlQXR0ciggJ2Rpc2FibGVkJyApO1xuXHRcdH1cblx0fVxuXG5cdCRzZWFyY2hGb3JtLmZpbmQoICcud2NhcGYtZm9ybS1zdWItZmllbGQtbWluX3ZhbHVlX2F1dG9fZGV0ZWN0IGlucHV0W3R5cGU9XCJjaGVja2JveFwiXScgKS5lYWNoKCBmdW5jdGlvbigpIHtcblx0XHRjb25zdCAkdGhpcyA9ICQoIHRoaXMgKTtcblxuXHRcdHRvZ2dsZU51bWJlck1pblZhbHVlRmllbGQoICR0aGlzICk7XG5cdH0gKTtcblxuXHQkc2VhcmNoRm9ybS5vbihcblx0XHQnY2xpY2snLFxuXHRcdCcud2NhcGYtZm9ybS1zdWItZmllbGQtbWluX3ZhbHVlX2F1dG9fZGV0ZWN0IGlucHV0W3R5cGU9XCJjaGVja2JveFwiXScsXG5cdFx0ZnVuY3Rpb24oKSB7XG5cdFx0XHRjb25zdCAkdGhpcyA9ICQoIHRoaXMgKTtcblxuXHRcdFx0dG9nZ2xlTnVtYmVyTWluVmFsdWVGaWVsZCggJHRoaXMgKTtcblx0XHR9XG5cdCk7XG5cblx0LyoqXG5cdCAqIFRvZ2dsZSBkaXNhYmxlZCBhdHRyaWJ1dGUgb2YgbWF4LXZhbHVlIGZpZWxkIGZvciBudW1iZXIgdHlwZS5cblx0ICovXG5cdGZ1bmN0aW9uIHRvZ2dsZU51bWJlck1heFZhbHVlRmllbGQoICRlbG0gKSB7XG5cdFx0Y29uc3QgJGZpZWxkICAgICA9ICRlbG0uY2xvc2VzdCggJy53Y2FwZi1mb3JtLWZpZWxkJyApO1xuXHRcdGNvbnN0ICR0ZXh0RmllbGQgPSAkZmllbGQuZmluZCggJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1tYXhfdmFsdWUgaW5wdXRbdHlwZT1cInRleHRcIl0nICk7XG5cblx0XHRpZiAoICRlbG0uaXMoICc6Y2hlY2tlZCcgKSApIHtcblx0XHRcdCR0ZXh0RmllbGQuYXR0ciggJ2Rpc2FibGVkJywgJ2Rpc2FibGVkJyApO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHQkdGV4dEZpZWxkLnJlbW92ZUF0dHIoICdkaXNhYmxlZCcgKTtcblx0XHR9XG5cdH1cblxuXHQkc2VhcmNoRm9ybS5maW5kKCAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLW1heF92YWx1ZV9hdXRvX2RldGVjdCBpbnB1dFt0eXBlPVwiY2hlY2tib3hcIl0nICkuZWFjaCggZnVuY3Rpb24oKSB7XG5cdFx0Y29uc3QgJHRoaXMgPSAkKCB0aGlzICk7XG5cblx0XHR0b2dnbGVOdW1iZXJNYXhWYWx1ZUZpZWxkKCAkdGhpcyApO1xuXHR9ICk7XG5cblx0JHNlYXJjaEZvcm0ub24oXG5cdFx0J2NsaWNrJyxcblx0XHQnLndjYXBmLWZvcm0tc3ViLWZpZWxkLW1heF92YWx1ZV9hdXRvX2RldGVjdCBpbnB1dFt0eXBlPVwiY2hlY2tib3hcIl0nLFxuXHRcdGZ1bmN0aW9uKCkge1xuXHRcdFx0Y29uc3QgJHRoaXMgPSAkKCB0aGlzICk7XG5cblx0XHRcdHRvZ2dsZU51bWJlck1heFZhbHVlRmllbGQoICR0aGlzICk7XG5cdFx0fVxuXHQpO1xuXG59ICk7XG4iLCIvKipcbiAqIFRoZSBwcm9kdWN0IHN0YXR1cyBmaWVsZC5cbiAqXG4gKiBAc2luY2UgICAgICAzLjAuMFxuICogQHBhY2thZ2UgICAgd2MtYWpheC1wcm9kdWN0LWZpbHRlclxuICogQHN1YnBhY2thZ2Ugd2MtYWpheC1wcm9kdWN0LWZpbHRlci9hZG1pbi9zcmMvanNcbiAqIEBhdXRob3IgICAgIE1haW51bCBIYXNzYW4gTWFpblxuICovXG5cbmpRdWVyeSggZG9jdW1lbnQgKS5yZWFkeSggZnVuY3Rpb24oKSB7XG5cblx0Y29uc3QgdGFibGVJZGVudGlmaWVyID0gJy5wcm9kdWN0LXN0YXR1cy1vcHRpb25zLXRhYmxlJztcblx0Y29uc3QgdmFsdWVJZGVudGlmaWVyID0gJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1wcm9kdWN0X3N0YXR1c19vcHRpb25zIGlucHV0Jztcblx0Y29uc3Qgcm93VGVtcGxhdGVJZCAgID0gJ3djYXBmLXByb2R1Y3Qtc3RhdHVzLW9wdGlvbic7XG5cblx0aW5pdE1hbnVhbE9wdGlvbnNUYWJsZSggdGFibGVJZGVudGlmaWVyLCB2YWx1ZUlkZW50aWZpZXIsIHJvd1RlbXBsYXRlSWQgKTtcblxufSApO1xuIiwiLyoqXG4gKiBUaGUgc2VhcmNoIGZvcm0uXG4gKlxuICogQHNpbmNlICAgICAgMy4wLjBcbiAqIEBwYWNrYWdlICAgIHdjLWFqYXgtcHJvZHVjdC1maWx0ZXJcbiAqIEBzdWJwYWNrYWdlIHdjLWFqYXgtcHJvZHVjdC1maWx0ZXIvYWRtaW4vc3JjL2pzXG4gKiBAYXV0aG9yICAgICBNYWludWwgSGFzc2FuIE1haW5cbiAqL1xuXG5jb25zdCB0b3RhbEZpZWxkSW5zdGFuY2VzID0galF1ZXJ5KCAnI3RvdGFsX2ZpZWxkX2luc3RhbmNlcycgKTtcblxuY29uc3Qgc2VhcmNoRm9ybSA9IGpRdWVyeSggJyNzZWFyY2gtZm9ybScgKTtcblxuLyoqXG4gKiBBc3NpZ24gYSB1bmlxdWUgaWQgYnkgcmVwbGFjaW5nIHRoZSBwbGFjZWhvbGRlciBpZC5cbiAqL1xuZnVuY3Rpb24gcmVtb3ZlUGxhY2Vob2xkZXIoIHVuaXF1ZUlkLCBlbGVtZW50cywgYXR0ciApIHtcblx0ZWxlbWVudHMuZWFjaChcblx0XHRmdW5jdGlvbigpIHtcblx0XHRcdGNvbnN0IGVsZW1lbnQgPSBqUXVlcnkoIHRoaXMgKTtcblxuXHRcdFx0Y29uc3Qgb2xkVmFsdWUgPSBlbGVtZW50LmF0dHIoIGF0dHIgKTtcblx0XHRcdGNvbnN0IG5ld1ZhbHVlID0gb2xkVmFsdWUucmVwbGFjZSggJyUlJywgdW5pcXVlSWQgKTtcblxuXHRcdFx0ZWxlbWVudC5hdHRyKCBhdHRyLCBuZXdWYWx1ZSApO1xuXHRcdH1cblx0KTtcbn1cblxuLyoqXG4gKiBJbnNlcnQgdGhlIGZpZWxkJ3Mgc3ViZmllbGRzLlxuICovXG5mdW5jdGlvbiBpbnNlcnRGaWVsZFN1YkZpZWxkcyggdWkgKSB7XG5cdC8vIEluc2VydCB0aGUgZmllbGQncyBzdWJmaWVsZHMgaWYgbm90IGFscmVhZHkgaW5zZXJ0ZWQuXG5cdGlmICggISB1aS5pdGVtLmhhc0NsYXNzKCAnc3ViLWZpZWxkcy1yZWFkeScgKSApIHtcblx0XHRjb25zdCB0eXBlICAgICAgPSB1aS5pdGVtLmF0dHIoICdkYXRhLWZpZWxkLXR5cGUnICk7XG5cdFx0Y29uc3QgdW5pcXVlSWQgID0gcGFyc2VJbnQoIHRvdGFsRmllbGRJbnN0YW5jZXMudmFsKCkgKTtcblx0XHRjb25zdCBmaWVsZFR5cGUgPSAnd2NhcGYtZm9ybS1maWVsZC0nICsgdHlwZTtcblxuXHRcdC8vIEJhaWwgb3V0IGlmIG5vIHRtcGwgZm91bmQgZm9yIHRoZSB0eXBlLlxuXHRcdGlmICggISBqUXVlcnkoICcjdG1wbC0nICsgZmllbGRUeXBlICkubGVuZ3RoICkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdC8vIEluY3JlbWVudCB0aGUgdmFsdWUgb2YgdG90YWwgZmllbGQgaW5zdGFuY2VzLlxuXHRcdHRvdGFsRmllbGRJbnN0YW5jZXMudmFsKCB1bmlxdWVJZCArIDEgKTtcblxuXHRcdGNvbnN0IHRlbXBsYXRlID0gd3AudGVtcGxhdGUoIGZpZWxkVHlwZSApO1xuXHRcdGNvbnN0IHJlbmRlcmVkID0gdGVtcGxhdGUoKTtcblx0XHRjb25zdCB3cmFwcGVyICA9IHVpLml0ZW0uZmluZCggJy53aWRnZXQtY29udGVudCcgKTtcblxuXHRcdHdyYXBwZXIucHJlcGVuZCggcmVuZGVyZWQgKTtcblxuXHRcdC8vIFVwZGF0ZSB0aGUgZm9yIGF0dHJpYnV0ZXMgb2YgdGhlIGxhYmVscy5cblx0XHRyZW1vdmVQbGFjZWhvbGRlciggdW5pcXVlSWQsIHVpLml0ZW0uZmluZCggJ2xhYmVsW2Zvcl49XCJ3Y2FwZi1pbnB1dC1cIl0nICksICdmb3InICk7XG5cblx0XHQvLyBVcGRhdGUgdGhlIGlkcyBvZiB0aGUgaW5wdXQgZWxlbWVudHMuXG5cdFx0cmVtb3ZlUGxhY2Vob2xkZXIoIHVuaXF1ZUlkLCB1aS5pdGVtLmZpbmQoICcqW2lkXj1cIndjYXBmLWlucHV0LVwiXScgKSwgJ2lkJyApO1xuXG5cdFx0Ly8gVXBkYXRlIHRoZSBuYW1lcyBvZiB0aGUgaW5wdXQgZWxlbWVudHMuXG5cdFx0cmVtb3ZlUGxhY2Vob2xkZXIoIHVuaXF1ZUlkLCB1aS5pdGVtLmZpbmQoICcqW2lkXj1cIndjYXBmLWlucHV0LVwiXScgKSwgJ25hbWUnICk7XG5cblx0XHQvLyBVcGRhdGUgdGhlIHBvc2l0aW9uIHZhbHVlLlxuXHRcdHJlbW92ZVBsYWNlaG9sZGVyKCB1bmlxdWVJZCwgdWkuaXRlbS5maW5kKCAnKltpZF49XCJ3Y2FwZi1pbnB1dC1wb3NpdGlvbi1cIl0nICksICd2YWx1ZScgKTtcblxuXHRcdHVpLml0ZW0uYWRkQ2xhc3MoICdzdWItZmllbGRzLXJlYWR5JyApO1xuXG5cdFx0c2VhcmNoRm9ybS50cmlnZ2VyKCAnZmllbGRfYWRkZWQnLCBbIHVpIF0gKTtcblx0fVxufVxuXG4vKipcbiAqIFVwZGF0ZSB0aGUgZm9ybSBmaWVsZCdzIHBvc2l0aW9uIGFmdGVyIHNvcnQuXG4gKlxuICogQHNvdXJjZSBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL2EvMTQ3MzY3NzVcbiAqL1xuZnVuY3Rpb24gdXBkYXRlRmllbGRzUG9zaXRpb24oKSB7XG5cdGNvbnN0IGlucHV0cyAgPSBzZWFyY2hGb3JtLmZpbmQoICcqW2lkXj1cIndjYXBmLWlucHV0LXBvc2l0aW9uLVwiXScgKTtcblx0Y29uc3QgbmJFbGVtcyA9IGlucHV0cy5sZW5ndGg7XG5cblx0aW5wdXRzLmVhY2goXG5cdFx0ZnVuY3Rpb24oIGlkeCApIHtcblx0XHRcdGpRdWVyeSggdGhpcyApLnZhbCggbmJFbGVtcyAtICggbmJFbGVtcyAtIGlkeCApICk7XG5cdFx0fVxuXHQpO1xufVxuXG4vKipcbiAqIE1ha2UgdGhlIGZpZWxkIHJlYWR5LCByZW1vdmUgc3R5bGVzIGNvbWVzIGZyb20ganF1ZXJ5LXVpLXNvcnRhYmxlIHBsdWdpbiwgaW5zZXJ0IHRoZSBmaWVsZCdzIHN1YmZpZWxkcyBldGMuXG4gKi9cbmZ1bmN0aW9uIG1ha2VGaWVsZFJlYWR5KCBlLCB1aSApIHtcblx0Ly8gUmVtb3ZlIHN0eWxlcyBjb21lcyBmcm9tIGpxdWVyeS11aS1zb3J0YWJsZSBwbHVnaW4uXG5cdHVpLml0ZW0ucmVtb3ZlQXR0ciggJ3N0eWxlJyApO1xuXG5cdGluc2VydEZpZWxkU3ViRmllbGRzKCB1aSApO1xuXG5cdHVwZGF0ZUZpZWxkc1Bvc2l0aW9uKCk7XG5cblx0Y29uc3QgdG9nZ2xlQnRuID0gdWkuaXRlbS5maW5kKCAnLndpZGdldC1hY3Rpb24nICk7XG5cblx0Ly8gRXhwYW5kIHRoZSBmb3JtIGZpZWxkIGFmdGVyIHNvcnQuXG5cdGlmICggJ2ZhbHNlJyA9PT0gdG9nZ2xlQnRuLmF0dHIoICdhcmlhLWV4cGFuZGVkJyApICkge1xuXHRcdHRvZ2dsZUJ0bi50cmlnZ2VyKCAnY2xpY2snICk7XG5cdH1cbn1cblxuLyoqXG4gKiBJbnN0YW50aWF0ZSBzb3J0YWJsZSBmb3IgdGhlIGZvcm0gZmllbGRzLlxuICovXG5mdW5jdGlvbiBzb3J0YWJsZSggaWRlbnRpZmllciApIHtcblx0Y29uc3QgY29udGFpbmVyID0galF1ZXJ5KCBpZGVudGlmaWVyICk7XG5cblx0Y29udGFpbmVyLnNvcnRhYmxlKFxuXHRcdHtcblx0XHRcdG9wYWNpdHk6IDAuOCxcblx0XHRcdHJldmVydDogZmFsc2UsXG5cdFx0XHRjdXJzb3I6ICdtb3ZlJyxcblx0XHRcdGF4aXM6ICd5Jyxcblx0XHRcdGhhbmRsZTogJy53aWRnZXQtdG9wJyxcblx0XHRcdGNhbmNlbDogJy53aWRnZXQtdGl0bGUtYWN0aW9uJyxcblx0XHRcdGl0ZW1zOiAnLndpZGdldCcsXG5cdFx0XHRwbGFjZWhvbGRlcjogJ3dpZGdldC1wbGFjZWhvbGRlcicsXG5cdFx0XHRjb25uZWN0V2l0aDogJyNzZWFyY2gtZm9ybS13cmFwcGVyJyxcblx0XHRcdHN0b3A6IG1ha2VGaWVsZFJlYWR5LFxuXHRcdFx0c3RhcnQ6IGZ1bmN0aW9uKCBlLCB1aSApIHtcblx0XHRcdFx0Ly8gSWYgaXQgaXMgZ2V0dGluZyBhcHBlbmRlZCB0byB0aGUgd3JvbmcgcGxhY2UsIHRoZW4gZm9yY2UgaXQgaW50byB0aGUgcmlnaHQgY29udGFpbmVyLlxuXHRcdFx0XHR1aS5wbGFjZWhvbGRlci5hcHBlbmRUbyggdWkucGxhY2Vob2xkZXIucGFyZW50KCkuZmluZCggJy5pbnNpZGUgI3NlYXJjaC1mb3JtLXdyYXBwZXInICkgKTtcblx0XHRcdH1cblx0XHR9XG5cdCk7XG59XG5cbnNvcnRhYmxlKCAnI3NlYXJjaC1mb3JtJyApO1xuXG4vKipcbiAqIFJ1biBmdW5jdGlvbiB3aGVuIGRyYWcgc3RhcnRzLlxuICovXG5mdW5jdGlvbiBvbkRyYWdTdGFydCgpIHtcblx0c2VhcmNoRm9ybS5hZGRDbGFzcyggJ3VpLWRyb3AtYWN0aXZlJyApO1xufVxuXG4vKipcbiAqIFJ1biBmdW5jdGlvbiBhdCBkcmFnIHN0b3AuXG4gKi9cbmZ1bmN0aW9uIG9uRHJhZ1N0b3AoKSB7XG5cdHNlYXJjaEZvcm0ucmVtb3ZlQ2xhc3MoICd1aS1kcm9wLWFjdGl2ZScgKTtcbn1cblxuLyoqXG4gKiBJbml0aWFsaXplIGRyYWdnYWJsZSBmb3IgdGhlIGZvcm0gZmllbGRzLlxuICovXG5qUXVlcnkoICcjYXZhaWxhYmxlLWZpZWxkcyAud2lkZ2V0JyApLmRyYWdnYWJsZShcblx0e1xuXHRcdGNvbm5lY3RUb1NvcnRhYmxlOiAnI3NlYXJjaC1mb3JtJyxcblx0XHRoZWxwZXI6ICdjbG9uZScsXG5cdFx0c3RhcnQ6IG9uRHJhZ1N0YXJ0LFxuXHRcdHN0b3A6IG9uRHJhZ1N0b3AsXG5cdH1cbik7XG5cbi8qKlxuICogVG9nZ2xlIHRoZSBmb3JtIGZpZWxkLlxuICovXG5mdW5jdGlvbiB0b2dnbGVGaWVsZCggZSApIHtcblx0Y29uc3QgdGFyZ2V0ICAgICAgID0gZS50YXJnZXQ7XG5cdGNvbnN0IHdpZGdldCAgICAgICA9IGpRdWVyeSggdGhpcyApLmNsb3Nlc3QoICcud2lkZ2V0JyApO1xuXHRjb25zdCB0b2dnbGVCdG4gICAgPSB3aWRnZXQuZmluZCggJy53aWRnZXQtYWN0aW9uJyApO1xuXHRjb25zdCBpbnNpZGUgICAgICAgPSB3aWRnZXQuY2hpbGRyZW4oICcud2lkZ2V0LWluc2lkZScgKTtcblx0Y29uc3QgaXNFeHBhbmQgICAgID0gdG9nZ2xlQnRuLmF0dHIoICdhcmlhLWV4cGFuZGVkJyApO1xuXHRjb25zdCB0b2dnbGVFeHBhbmQgPSAndHJ1ZScgPT09IGlzRXhwYW5kID8gJ2ZhbHNlJyA6ICd0cnVlJztcblxuXHR0b2dnbGVCdG4uYXR0ciggJ2FyaWEtZXhwYW5kZWQnLCB0b2dnbGVFeHBhbmQgKTtcblx0alF1ZXJ5KCBpbnNpZGUgKS5zbGlkZVRvZ2dsZShcblx0XHQnZmFzdCcsXG5cdFx0ZnVuY3Rpb24oKSB7XG5cdFx0XHR3aWRnZXQudG9nZ2xlQ2xhc3MoICdvcGVuJyApO1xuXHRcdFx0c2VhcmNoRm9ybS50cmlnZ2VyKCAnd2lkZ2V0LWNsb3NlZCcsIFsgdGFyZ2V0IF0gKTtcblx0XHR9XG5cdCk7XG59XG5cbnNlYXJjaEZvcm0ub24oICdjbGljaycsICcud2lkZ2V0LXRvcCcsIHRvZ2dsZUZpZWxkICk7XG5zZWFyY2hGb3JtLm9uKCAnY2xpY2snLCAnLndpZGdldC1jb250cm9sLWNsb3NlJywgdG9nZ2xlRmllbGQgKTtcblxuLyoqXG4gKiBGb2N1cyB0aGUgZm9ybSBmaWVsZCdzIGV4cGFuZCBidXR0b24uXG4gKi9cbmZ1bmN0aW9uIGZvY3VzRmllbGQoIGUsIHRhcmdldCApIHtcblx0aWYgKCB0YXJnZXQuY2xhc3NMaXN0LmNvbnRhaW5zKCAnd2lkZ2V0LWNvbnRyb2wtY2xvc2UnICkgKSB7XG5cdFx0Y29uc3Qgd2lkZ2V0ID0galF1ZXJ5KCB0YXJnZXQgKS5jbG9zZXN0KCAnLndpZGdldCcgKTtcblx0XHRjb25zdCBhY3Rpb24gPSB3aWRnZXQuZmluZCggJy53aWRnZXQtYWN0aW9uJyApO1xuXG5cdFx0YWN0aW9uLmF0dHIoICdhcmlhLWV4cGFuZGVkJywgJ2ZhbHNlJyApLmZvY3VzKCk7XG5cdH1cbn1cblxuc2VhcmNoRm9ybS5vbiggJ3dpZGdldC1jbG9zZWQnLCBmb2N1c0ZpZWxkICk7XG5cbi8qKlxuICogUmVtb3ZlIHRoZSBmaWVsZC5cbiAqL1xuZnVuY3Rpb24gcmVtb3ZlRmllbGQoKSB7XG5cdGNvbnN0IHdpZGdldCA9IGpRdWVyeSggdGhpcyApLmNsb3Nlc3QoICcud2lkZ2V0JyApO1xuXG5cdGpRdWVyeSggd2lkZ2V0ICkuc2xpZGVVcChcblx0XHQnZmFzdCcsXG5cdFx0ZnVuY3Rpb24oKSB7XG5cdFx0XHR3aWRnZXQucmVtb3ZlKCk7XG5cdFx0XHR1cGRhdGVGaWVsZHNQb3NpdGlvbigpO1xuXHRcdH1cblx0KTtcbn1cblxuc2VhcmNoRm9ybS5vbiggJ2NsaWNrJywgJy53aWRnZXQtY29udHJvbC1yZW1vdmUnLCByZW1vdmVGaWVsZCApO1xuXG4vKipcbiAqIFN0b3JlIHRoZSBpbml0aWFsIGZvcm0gZGF0YSBpbnRvIGEgdmFyaWFibGUgc28gdGhhdCB3ZSBjYW4gY29tcGFyZSBpdCB3aGVuIGxlYXZpbmcgdGhlIHBhZ2UuXG4gKi9cbmxldCBpbml0aWFsRm9ybVN0YXRlID0gc2VhcmNoRm9ybS5zZXJpYWxpemVBcnJheSgpO1xuXG4vKipcbiAqIFNob3cgbWVzc2FnZSBhZnRlciBmb3JtIHN1Ym1pc3Npb24uXG4gKi9cbmZ1bmN0aW9uIHNob3dNZXNzYWdlKCBtZXNzYWdlLCB0eXBlID0gJ3N1Y2Nlc3MnICkge1xuXHRjb25zdCBlbGVtZW50ID0galF1ZXJ5KCAnPHAgY2xhc3M9XCInICsgdHlwZSArICdcIj4nICsgbWVzc2FnZSArICc8L3A+JyApO1xuXHRjb25zdCB3cmFwcGVyID0galF1ZXJ5KCAnLndjYXBmLW1lc3NhZ2Utd3JhcHBlcicgKTtcblxuXHRpZiAoICEgd3JhcHBlci5pcyggJzplbXB0eScgKSApIHtcblx0XHRyZXR1cm47XG5cdH1cblxuXHRqUXVlcnkoIHdyYXBwZXIgKS5odG1sKCBlbGVtZW50ICkuc2xpZGVEb3duKCAnZmFzdCcgKTtcblxuXHRzZXRUaW1lb3V0KFxuXHRcdGZ1bmN0aW9uKCkge1xuXHRcdFx0alF1ZXJ5KCB3cmFwcGVyICkuc2xpZGVVcCggJ2Zhc3QnICk7XG5cdFx0XHR3cmFwcGVyLmh0bWwoICcnICk7XG5cdFx0fSxcblx0XHQzMDAwXG5cdCk7XG59XG5cbi8qKlxuICogU2F2ZSB0aGUgc2VhcmNoIGZvcm0uXG4gKi9cbmZ1bmN0aW9uIHNhdmVGb3JtKCkge1xuXHRjb25zdCBidXR0b24gICA9IGpRdWVyeSggdGhpcyApO1xuXHRjb25zdCBmb3JtRGF0YSA9IHNlYXJjaEZvcm0uc2VyaWFsaXplQXJyYXkoKTtcblxuXHRidXR0b24uYXR0ciggJ2Rpc2FibGVkJywgJ2Rpc2FibGVkJyApO1xuXG5cdGZ1bmN0aW9uIG9rQ2FsbGJhY2soIG1lc3NhZ2UgKSB7XG5cdFx0YnV0dG9uLnJlbW92ZUF0dHIoICdkaXNhYmxlZCcgKTtcblxuXHRcdC8vIFVwZGF0ZSB0aGUgaW5pdGlhbCBmb3JtIGRhdGEgYWZ0ZXIgc3VjY2Vzc2Z1bGx5IHNhdmluZyB0aGUgZm9ybS5cblx0XHRpbml0aWFsRm9ybVN0YXRlID0gZm9ybURhdGE7XG5cblx0XHRzaG93TWVzc2FnZSggbWVzc2FnZSApO1xuXHR9XG5cblx0ZnVuY3Rpb24gZXJyQ2FsbGJhY2soIG1lc3NhZ2UgKSB7XG5cdFx0YnV0dG9uLnJlbW92ZUF0dHIoICdkaXNhYmxlZCcgKTtcblx0XHRzaG93TWVzc2FnZSggbWVzc2FnZSwgJ2Vycm9yJyApO1xuXHR9XG5cblx0Ly8gaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9hLzU5MTgxMjUyXG5cdHdwLmFqYXgucG9zdCggZm9ybURhdGEgKS5kb25lKCBva0NhbGxiYWNrICkuZmFpbCggZXJyQ2FsbGJhY2sgKTtcbn1cblxualF1ZXJ5KCAnI3Bvc3Rib3gtY29udGFpbmVyLTEnICkub24oICdjbGljaycsICdidXR0b24nLCBzYXZlRm9ybSApO1xuXG5zZWFyY2hGb3JtLm9uKCAnY2xpY2snLCAnLmV4cGFuZC1hbGwtZmllbGRzLWJ0bicsIGZ1bmN0aW9uKCkge1xuXHRjb25zdCAkZmllbGRzID0gc2VhcmNoRm9ybS5maW5kKCAnW2RhdGEtZmllbGQtdHlwZV0nICk7XG5cblx0JGZpZWxkcy5lYWNoKCBmdW5jdGlvbigpIHtcblx0XHRjb25zdCAkaXRlbSA9IGpRdWVyeSggdGhpcyApO1xuXG5cdFx0aWYgKCAhICRpdGVtLmhhc0NsYXNzKCAnb3BlbicgKSApIHtcblx0XHRcdCRpdGVtLmZpbmQoICcud2lkZ2V0LXRvcCcgKS50cmlnZ2VyKCAnY2xpY2snICk7XG5cdFx0fVxuXHR9ICk7XG59ICk7XG5cbnNlYXJjaEZvcm0ub24oICdjbGljaycsICcuY29sbGFwc2UtYWxsLWZpZWxkcy1idG4nLCBmdW5jdGlvbigpIHtcblx0Y29uc3QgJGZpZWxkcyA9IHNlYXJjaEZvcm0uZmluZCggJ1tkYXRhLWZpZWxkLXR5cGVdJyApO1xuXG5cdCRmaWVsZHMuZWFjaCggZnVuY3Rpb24oKSB7XG5cdFx0Y29uc3QgJGl0ZW0gPSBqUXVlcnkoIHRoaXMgKTtcblxuXHRcdGlmICggJGl0ZW0uaGFzQ2xhc3MoICdvcGVuJyApICkge1xuXHRcdFx0JGl0ZW0uZmluZCggJy53aWRnZXQtdG9wJyApLnRyaWdnZXIoICdjbGljaycgKTtcblx0XHR9XG5cdH0gKTtcbn0gKTtcblxuLyoqXG4gKiBTaG93IGFsZXJ0IG9uIGxlYXZlIGlmIHRoZSBmb3JtIGlzIGRpcnR5LlxuICpcbiAqIFRPRE86IFVuY29tbWVudCB0aGlzLlxuICovXG4vLyB3aW5kb3cub25iZWZvcmV1bmxvYWQgPSBmdW5jdGlvbigpIHtcbi8vIFx0Y29uc3QgbmV3Rm9ybVN0YXRlID0gc2VhcmNoRm9ybS5zZXJpYWxpemVBcnJheSgpO1xuLy9cbi8vIFx0Y29uc3QgaXNGb3JtRGlydHkgPSAhIF8uaXNFcXVhbCggbmV3Rm9ybVN0YXRlLCBpbml0aWFsRm9ybVN0YXRlICk7XG4vL1xuLy8gXHRpZiAoIGlzRm9ybURpcnR5ICkge1xuLy8gXHRcdHJldHVybiAnJztcbi8vIFx0fVxuLy8gfTtcbiIsIi8qKlxuICogVGhlIHRvZ2dsZSB2aXNpYmlsaXR5IHNjcmlwdHMuXG4gKlxuICogTk9URTogVGhlc2Ugc2NyaXB0cyBtdXN0IGJlIGxvY2F0ZWQgYXQgdGhlIHZlcnkgYm90dG9tIG9mIHRoZSBjb21iaW5lZCBzY3JpcHRzLlxuICpcbiAqIEBzaW5jZSAgICAgIDMuMC4wXG4gKiBAcGFja2FnZSAgICB3Yy1hamF4LXByb2R1Y3QtZmlsdGVyXG4gKiBAc3VicGFja2FnZSB3Yy1hamF4LXByb2R1Y3QtZmlsdGVyL2FkbWluL3NyYy9qc1xuICogQGF1dGhvciAgICAgTWFpbnVsIEhhc3NhbiBNYWluXG4gKi9cblxualF1ZXJ5KCBkb2N1bWVudCApLnJlYWR5KCBmdW5jdGlvbiggJCApIHtcblxuXHRjb25zdCAkc2VhcmNoRm9ybSA9ICQoICcjc2VhcmNoLWZvcm0nICk7XG5cblx0Y29uc3QgZGVwZW5kYW50RGF0YSA9IFtcblx0XHR7XG5cdFx0XHQnaGFuZGxlcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtdmFsdWVfdHlwZSBzZWxlY3QnLFxuXHRcdFx0J2hhbmRsZXJUeXBlJzogJ3NlbGVjdCcsXG5cdFx0XHQnZXZlbnQnOiAnY2hhbmdlJyxcblx0XHRcdCdkZXBlbmRhbnQnOiBbXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLmlucHV0LXR5cGUtdGV4dC1maWVsZHMnLFxuXHRcdFx0XHRcdCd2YWx1ZSc6IFsgJ3RleHQnIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLmlucHV0LXR5cGUtbnVtYmVyLWZpZWxkcycsXG5cdFx0XHRcdFx0J3ZhbHVlJzogWyAnbnVtYmVyJyBdLFxuXHRcdFx0XHR9LFxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0J3NlbGVjdG9yJzogJy5pbnB1dC10eXBlLWRhdGUtZmllbGRzJyxcblx0XHRcdFx0XHQndmFsdWUnOiBbICdkYXRlJyBdLFxuXHRcdFx0XHR9LFxuXHRcdFx0XSxcblx0XHR9LFxuXHRcdHtcblx0XHRcdCdoYW5kbGVyJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1kaXNwbGF5X3R5cGUgc2VsZWN0Jyxcblx0XHRcdCdoYW5kbGVyVHlwZSc6ICdzZWxlY3QnLFxuXHRcdFx0J2V2ZW50JzogJ2NoYW5nZScsXG5cdFx0XHQnZGVwZW5kYW50JzogW1xuXHRcdFx0XHR7XG5cdFx0XHRcdFx0J3NlbGVjdG9yJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1xdWVyeV90eXBlJyxcblx0XHRcdFx0XHQndmFsdWUnOiBbICdjaGVja2JveCcsICdtdWx0aS1zZWxlY3QnIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLWFsbF9pdGVtc19sYWJlbCcsXG5cdFx0XHRcdFx0J3ZhbHVlJzogWyAncmFkaW8nLCAnc2VsZWN0JyBdLFxuXHRcdFx0XHR9LFxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0J3NlbGVjdG9yJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC11c2VfY2hvc2VuJyxcblx0XHRcdFx0XHQndmFsdWUnOiBbICdzZWxlY3QnLCAnbXVsdGktc2VsZWN0JyBdLFxuXHRcdFx0XHR9LFxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0J3NlbGVjdG9yJzogJy5oaWVyYXJjaGljYWwtZmllbGRzJyxcblx0XHRcdFx0XHQndmFsdWUnOiBbICdjaGVja2JveCcsICdyYWRpbycsICdzZWxlY3QnLCAnbXVsdGktc2VsZWN0JyBdLFxuXHRcdFx0XHR9LFxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0J3NlbGVjdG9yJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC11c2VfY2F0ZWdvcnlfaW1hZ2VzJyxcblx0XHRcdFx0XHQndmFsdWUnOiBbICdpbWFnZScgXSxcblx0XHRcdFx0fSxcblx0XHRcdFx0e1xuXHRcdFx0XHRcdCdzZWxlY3Rvcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtZW5hYmxlX211bHRpcGxlX2ZpbHRlcicsXG5cdFx0XHRcdFx0J3ZhbHVlJzogWyAnbGFiZWwnLCAnY29sb3InLCAnaW1hZ2UnIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLWlubGluZV9kaXNwbGF5Jyxcblx0XHRcdFx0XHQndmFsdWUnOiBbICdsYWJlbCcsICdjb2xvcicsICdpbWFnZScgXSxcblx0XHRcdFx0fSxcblx0XHRcdFx0e1xuXHRcdFx0XHRcdCdzZWxlY3Rvcic6ICcuY29sdW1uLWdyb3VwLWN1c3RvbV9hcHBlYXJhbmNlJyxcblx0XHRcdFx0XHQndmFsdWUnOiBbICdjb2xvcicsICdpbWFnZScgXSxcblx0XHRcdFx0fSxcblx0XHRcdF0sXG5cdFx0fSxcblx0XHR7XG5cdFx0XHQnaGFuZGxlcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtdXNlX2Nob3NlbiBpbnB1dCcsXG5cdFx0XHQnaGFuZGxlclR5cGUnOiAnY2hlY2tib3gnLFxuXHRcdFx0J2V2ZW50JzogJ2NoYW5nZScsXG5cdFx0XHQnZGVwZW5kYW50JzogW1xuXHRcdFx0XHR7XG5cdFx0XHRcdFx0J3NlbGVjdG9yJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1jaG9zZW5fbm9fcmVzdWx0c19tZXNzYWdlJyxcblx0XHRcdFx0XHQndmFsdWUnOiBbICcxJyBdLFxuXHRcdFx0XHR9LFxuXHRcdFx0XSxcblx0XHR9LFxuXHRcdHtcblx0XHRcdCdoYW5kbGVyJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1oaWVyYXJjaGljYWwgaW5wdXQnLFxuXHRcdFx0J2hhbmRsZXJUeXBlJzogJ2NoZWNrYm94Jyxcblx0XHRcdCdldmVudCc6ICdjaGFuZ2UnLFxuXHRcdFx0J2RlcGVuZGFudCc6IFtcblx0XHRcdFx0e1xuXHRcdFx0XHRcdCdzZWxlY3Rvcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtZW5hYmxlX2hpZXJhcmNoeV9hY2NvcmRpb24nLFxuXHRcdFx0XHRcdCd2YWx1ZSc6IFsgJzEnIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRdLFxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0J2hhbmRsZXInOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLWdldF9vcHRpb25zIGlucHV0Jyxcblx0XHRcdCdoYW5kbGVyVHlwZSc6ICdyYWRpbycsXG5cdFx0XHQnZXZlbnQnOiAnY2hhbmdlJyxcblx0XHRcdCdkZXBlbmRhbnQnOiBbXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLmNvbHVtbi1ncm91cC1tZXRhX2tleV9tYW51YWxfb3B0aW9ucycsXG5cdFx0XHRcdFx0J3ZhbHVlJzogWyAnbWFudWFsX2VudHJ5JyBdLFxuXHRcdFx0XHR9LFxuXHRcdFx0XSxcblx0XHR9LFxuXHRcdHtcblx0XHRcdCdoYW5kbGVyJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1udW1iZXJfZGlzcGxheV90eXBlIHNlbGVjdCcsXG5cdFx0XHQnaGFuZGxlclR5cGUnOiAnc2VsZWN0Jyxcblx0XHRcdCdldmVudCc6ICdjaGFuZ2UnLFxuXHRcdFx0J2RlcGVuZGFudCc6IFtcblx0XHRcdFx0e1xuXHRcdFx0XHRcdCdzZWxlY3Rvcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtbnVtYmVyX3JhbmdlX3NsaWRlcl9kaXNwbGF5X3ZhbHVlc19hcycsXG5cdFx0XHRcdFx0J3ZhbHVlJzogWyAncmFuZ2Vfc2xpZGVyJyBdLFxuXHRcdFx0XHR9LFxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0J3NlbGVjdG9yJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1udW1iZXJfcmFuZ2VfcXVlcnlfdHlwZScsXG5cdFx0XHRcdFx0J3ZhbHVlJzogWyAncmFuZ2VfY2hlY2tib3gnLCAncmFuZ2VfbXVsdGlzZWxlY3QnIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLW51bWJlcl9yYW5nZV9zZWxlY3RfYWxsX2l0ZW1zX2xhYmVsJyxcblx0XHRcdFx0XHQndmFsdWUnOiBbICdyYW5nZV9yYWRpbycsICdyYW5nZV9zZWxlY3QnIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLW51bWJlcl9yYW5nZV91c2VfY2hvc2VuJyxcblx0XHRcdFx0XHQndmFsdWUnOiBbICdyYW5nZV9zZWxlY3QnLCAncmFuZ2VfbXVsdGlzZWxlY3QnIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLW51bWJlcl9yYW5nZV9lbmFibGVfbXVsdGlwbGVfZmlsdGVyJyxcblx0XHRcdFx0XHQndmFsdWUnOiBbICdyYW5nZV9sYWJlbCcgXSxcblx0XHRcdFx0fSxcblx0XHRcdFx0e1xuXHRcdFx0XHRcdCdzZWxlY3Rvcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtbnVtYmVyX3JhbmdlX2lubGluZV9kaXNwbGF5Jyxcblx0XHRcdFx0XHQndmFsdWUnOiBbICdyYW5nZV9sYWJlbCcgXSxcblx0XHRcdFx0fSxcblx0XHRcdFx0e1xuXHRcdFx0XHRcdCdzZWxlY3Rvcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtbnVtYmVyX3JhbmdlX3Nob3dfY291bnQnLFxuXHRcdFx0XHRcdCd2YWx1ZSc6IFsgJ3JhbmdlX2NoZWNrYm94JywgJ3JhbmdlX3JhZGlvJywgJ3JhbmdlX3NlbGVjdCcsICdyYW5nZV9tdWx0aXNlbGVjdCcsICdyYW5nZV9sYWJlbCcgXSxcblx0XHRcdFx0fSxcblx0XHRcdFx0e1xuXHRcdFx0XHRcdCdzZWxlY3Rvcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtbnVtYmVyX3JhbmdlX2hpZGVfZW1wdHknLFxuXHRcdFx0XHRcdCd2YWx1ZSc6IFsgJ3JhbmdlX2NoZWNrYm94JywgJ3JhbmdlX3JhZGlvJywgJ3JhbmdlX3NlbGVjdCcsICdyYW5nZV9tdWx0aXNlbGVjdCcsICdyYW5nZV9sYWJlbCcgXSxcblx0XHRcdFx0fSxcblx0XHRcdFx0e1xuXHRcdFx0XHRcdCdzZWxlY3Rvcic6ICcubnVtYmVyLWRlY2ltYWwtZmllbGRzJyxcblx0XHRcdFx0XHQndmFsdWUnOiBbICdyYW5nZV9zbGlkZXInLCAncmFuZ2VfY2hlY2tib3gnLCAncmFuZ2VfcmFkaW8nLCAncmFuZ2Vfc2VsZWN0JywgJ3JhbmdlX211bHRpc2VsZWN0JywgJ3JhbmdlX2xhYmVsJyBdLFxuXHRcdFx0XHR9LFxuXHRcdFx0XSxcblx0XHR9LFxuXHRcdHtcblx0XHRcdCdoYW5kbGVyJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1udW1iZXJfcmFuZ2VfdXNlX2Nob3NlbiBpbnB1dCcsXG5cdFx0XHQnaGFuZGxlclR5cGUnOiAnY2hlY2tib3gnLFxuXHRcdFx0J2V2ZW50JzogJ2NoYW5nZScsXG5cdFx0XHQnZGVwZW5kYW50JzogW1xuXHRcdFx0XHR7XG5cdFx0XHRcdFx0J3NlbGVjdG9yJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1udW1iZXJfcmFuZ2VfY2hvc2VuX25vX3Jlc3VsdHNfbWVzc2FnZScsXG5cdFx0XHRcdFx0J3ZhbHVlJzogWyAnMScgXSxcblx0XHRcdFx0fSxcblx0XHRcdF0sXG5cdFx0fSxcblx0XHR7XG5cdFx0XHQnaGFuZGxlcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtbnVtYmVyX2dldF9vcHRpb25zIGlucHV0Jyxcblx0XHRcdCdoYW5kbGVyVHlwZSc6ICdyYWRpbycsXG5cdFx0XHQnZXZlbnQnOiAnY2hhbmdlJyxcblx0XHRcdCdkZXBlbmRhbnQnOiBbXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLm51bWJlci1hdXRvbWF0aWMtb3B0aW9ucycsXG5cdFx0XHRcdFx0J3ZhbHVlJzogWyAnYXV0b21hdGljYWxseScgXSxcblx0XHRcdFx0fSxcblx0XHRcdFx0e1xuXHRcdFx0XHRcdCdzZWxlY3Rvcic6ICcubnVtYmVyLW1hbnVhbC1vcHRpb25zLXRhYmxlJyxcblx0XHRcdFx0XHQndmFsdWUnOiBbICdtYW51YWxfZW50cnknIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRdLFxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0J2hhbmRsZXInOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLWRhdGVfZGlzcGxheV90eXBlIHNlbGVjdCcsXG5cdFx0XHQnaGFuZGxlclR5cGUnOiAnc2VsZWN0Jyxcblx0XHRcdCdldmVudCc6ICdjaGFuZ2UnLFxuXHRcdFx0J2RlcGVuZGFudCc6IFtcblx0XHRcdFx0e1xuXHRcdFx0XHRcdCdzZWxlY3Rvcic6ICcuZGF0ZS10by11aS1vcHRpb25zJyxcblx0XHRcdFx0XHQndmFsdWUnOiBbICdpbnB1dF9kYXRlX3JhbmdlJyBdLFxuXHRcdFx0XHR9LFxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0J3NlbGVjdG9yJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1kYXRlX2Zvcm1hdCcsXG5cdFx0XHRcdFx0J3ZhbHVlJzogWyAnaW5wdXRfZGF0ZScsICdpbnB1dF9kYXRlX3JhbmdlJyBdLFxuXHRcdFx0XHR9LFxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0J3NlbGVjdG9yJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC10aW1lX3BlcmlvZF9xdWVyeV90eXBlJyxcblx0XHRcdFx0XHQndmFsdWUnOiBbICd0aW1lX3BlcmlvZF9jaGVja2JveCcsICd0aW1lX3BlcmlvZF9tdWx0aXNlbGVjdCcgXSxcblx0XHRcdFx0fSxcblx0XHRcdFx0e1xuXHRcdFx0XHRcdCdzZWxlY3Rvcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtdGltZV9wZXJpb2Rfc2VsZWN0X2FsbF9pdGVtc19sYWJlbCcsXG5cdFx0XHRcdFx0J3ZhbHVlJzogWyAndGltZV9wZXJpb2RfcmFkaW8nLCAndGltZV9wZXJpb2Rfc2VsZWN0JyBdLFxuXHRcdFx0XHR9LFxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0J3NlbGVjdG9yJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC10aW1lX3BlcmlvZF91c2VfY2hvc2VuJyxcblx0XHRcdFx0XHQndmFsdWUnOiBbICd0aW1lX3BlcmlvZF9zZWxlY3QnLCAndGltZV9wZXJpb2RfbXVsdGlzZWxlY3QnIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLXRpbWVfcGVyaW9kX2VuYWJsZV9tdWx0aXBsZV9maWx0ZXInLFxuXHRcdFx0XHRcdCd2YWx1ZSc6IFsgJ3RpbWVfcGVyaW9kX2xhYmVsJyBdLFxuXHRcdFx0XHR9LFxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0J3NlbGVjdG9yJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC10aW1lX3BlcmlvZF9pbmxpbmVfZGlzcGxheScsXG5cdFx0XHRcdFx0J3ZhbHVlJzogWyAndGltZV9wZXJpb2RfbGFiZWwnIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLXRpbWVfcGVyaW9kX3Nob3dfY291bnQnLFxuXHRcdFx0XHRcdCd2YWx1ZSc6IFsgJ3RpbWVfcGVyaW9kX2NoZWNrYm94JywgJ3RpbWVfcGVyaW9kX3JhZGlvJywgJ3RpbWVfcGVyaW9kX3NlbGVjdCcsICd0aW1lX3BlcmlvZF9tdWx0aXNlbGVjdCcsICd0aW1lX3BlcmlvZF9sYWJlbCcgXSxcblx0XHRcdFx0fSxcblx0XHRcdFx0e1xuXHRcdFx0XHRcdCdzZWxlY3Rvcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtdGltZV9wZXJpb2RfaGlkZV9lbXB0eScsXG5cdFx0XHRcdFx0J3ZhbHVlJzogWyAndGltZV9wZXJpb2RfY2hlY2tib3gnLCAndGltZV9wZXJpb2RfcmFkaW8nLCAndGltZV9wZXJpb2Rfc2VsZWN0JywgJ3RpbWVfcGVyaW9kX211bHRpc2VsZWN0JywgJ3RpbWVfcGVyaW9kX2xhYmVsJyBdLFxuXHRcdFx0XHR9LFxuXHRcdFx0XSxcblx0XHR9LFxuXHRcdHtcblx0XHRcdCdoYW5kbGVyJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC10aW1lX3BlcmlvZF91c2VfY2hvc2VuIGlucHV0Jyxcblx0XHRcdCdoYW5kbGVyVHlwZSc6ICdjaGVja2JveCcsXG5cdFx0XHQnZXZlbnQnOiAnY2hhbmdlJyxcblx0XHRcdCdkZXBlbmRhbnQnOiBbXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLXRpbWVfcGVyaW9kX2Nob3Nlbl9ub19yZXN1bHRzX21lc3NhZ2UnLFxuXHRcdFx0XHRcdCd2YWx1ZSc6IFsgJzEnIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRdLFxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0J2hhbmRsZXInOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLWVuYWJsZV9zb2Z0X2xpbWl0IGlucHV0Jyxcblx0XHRcdCdoYW5kbGVyVHlwZSc6ICdyYWRpbycsXG5cdFx0XHQnZXZlbnQnOiAnY2hhbmdlJyxcblx0XHRcdCdkZXBlbmRhbnQnOiBbXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLXNvZnRfbGltaXQnLFxuXHRcdFx0XHRcdCd2YWx1ZSc6IFsgJ2VuYWJsZScgXSxcblx0XHRcdFx0fSxcblx0XHRcdF0sXG5cdFx0fSxcblx0XHR7XG5cdFx0XHQnaGFuZGxlcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtY3VzdG9tLXRheG9ub215IHNlbGVjdCcsXG5cdFx0XHQnaGFuZGxlclR5cGUnOiAnc2VsZWN0Jyxcblx0XHRcdCdldmVudCc6ICdjaGFuZ2UnLFxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0J2hhbmRsZXInOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLXBvc3RfcHJvcGVydHkgc2VsZWN0Jyxcblx0XHRcdCdoYW5kbGVyVHlwZSc6ICdzZWxlY3QnLFxuXHRcdFx0J2V2ZW50JzogJ2NoYW5nZScsXG5cdFx0fSxcblx0XHR7XG5cdFx0XHQnaGFuZGxlcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtbGltaXRfb3B0aW9ucyBzZWxlY3QnLFxuXHRcdFx0J2hhbmRsZXJUeXBlJzogJ3NlbGVjdCcsXG5cdFx0XHQnZXZlbnQnOiAnY2hhbmdlJyxcblx0XHRcdCdkZXBlbmRhbnQnOiBbXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLXBhcmVudF90ZXJtJyxcblx0XHRcdFx0XHQndmFsdWUnOiBbICdjaGlsZCcgXSxcblx0XHRcdFx0fSxcblx0XHRcdFx0e1xuXHRcdFx0XHRcdCdzZWxlY3Rvcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtbGltaXRfdmFsdWVzX2J5X2lkJyxcblx0XHRcdFx0XHQndmFsdWUnOiBbICdpbmNsdWRlJywgJ2V4Y2x1ZGUnIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRdLFxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0J2hhbmRsZXInOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLWVuYWJsZV9hY2NvcmRpb24gaW5wdXQnLFxuXHRcdFx0J2hhbmRsZXJUeXBlJzogJ3JhZGlvJyxcblx0XHRcdCdldmVudCc6ICdjaGFuZ2UnLFxuXHRcdFx0J2RlcGVuZGFudCc6IFtcblx0XHRcdFx0e1xuXHRcdFx0XHRcdCdzZWxlY3Rvcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtYWNjb3JkaW9uX2RlZmF1bHRfc3RhdGUnLFxuXHRcdFx0XHRcdCd2YWx1ZSc6IFsgJ3llcycgXSxcblx0XHRcdFx0fSxcblx0XHRcdF0sXG5cdFx0fSxcblx0XHR7XG5cdFx0XHQnaGFuZGxlcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtZW5hYmxlX211bHRpcGxlX2ZpbHRlciBpbnB1dCcsXG5cdFx0XHQnaGFuZGxlclR5cGUnOiAnY2hlY2tib3gnLFxuXHRcdFx0J2V2ZW50JzogJ2NoYW5nZScsXG5cdFx0fSxcblx0XHR7XG5cdFx0XHQnaGFuZGxlcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtdXNlX2NhdGVnb3J5X2ltYWdlcyBpbnB1dCcsXG5cdFx0XHQnaGFuZGxlclR5cGUnOiAnY2hlY2tib3gnLFxuXHRcdFx0J2V2ZW50JzogJ2NoYW5nZScsXG5cdFx0fSxcblx0XHR7XG5cdFx0XHQnaGFuZGxlcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtbnVtYmVyX3JhbmdlX2VuYWJsZV9tdWx0aXBsZV9maWx0ZXIgaW5wdXQnLFxuXHRcdFx0J2hhbmRsZXJUeXBlJzogJ2NoZWNrYm94Jyxcblx0XHRcdCdldmVudCc6ICdjaGFuZ2UnLFxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0J2hhbmRsZXInOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLXRpbWVfcGVyaW9kX2VuYWJsZV9tdWx0aXBsZV9maWx0ZXIgaW5wdXQnLFxuXHRcdFx0J2hhbmRsZXJUeXBlJzogJ2NoZWNrYm94Jyxcblx0XHRcdCdldmVudCc6ICdjaGFuZ2UnLFxuXHRcdH0sXG5cdF07XG5cblx0ZnVuY3Rpb24gX2hhbmRsZVRvZ2dsZVJlcXVlc3QoIGRhdGEsIGN1cnJlbnRTZWxlY3RvciwgdmFsdWUgKSB7XG5cdFx0Y29uc3QgJGZpZWxkICAgICAgPSBjdXJyZW50U2VsZWN0b3IuY2xvc2VzdCggJy53Y2FwZi1mb3JtLWZpZWxkJyApO1xuXHRcdGNvbnN0IGhhbmRsZXIgICAgID0gZGF0YVsgJ2hhbmRsZXInIF07XG5cdFx0Y29uc3QgaGFuZGxlclR5cGUgPSBkYXRhWyAnaGFuZGxlclR5cGUnIF07XG5cdFx0Y29uc3QgZGVwZW5kYW50ICAgPSBkYXRhWyAnZGVwZW5kYW50JyBdO1xuXG5cdFx0bGV0IF92YWx1ZSA9IHZhbHVlO1xuXG5cdFx0aWYgKCAnY2hlY2tib3gnID09PSBoYW5kbGVyVHlwZSApIHtcblx0XHRcdF92YWx1ZSA9IGN1cnJlbnRTZWxlY3Rvci5pcyggJzpjaGVja2VkJyApID8gJzEnIDogJzAnO1xuXHRcdH1cblxuXHRcdGlmICggJ3JhZGlvJyA9PT0gaGFuZGxlclR5cGUgKSB7XG5cdFx0XHRfdmFsdWUgPSAkZmllbGQuZmluZCggaGFuZGxlciArICc6Y2hlY2tlZCcgKS52YWwoKTtcblx0XHR9XG5cblx0XHQkLmVhY2goIGRlcGVuZGFudCwgZnVuY3Rpb24oIGlkLCBkICkge1xuXHRcdFx0Y29uc3QgJHNlbGVjdG9yICAgPSAkZmllbGQuZmluZCggZFsgJ3NlbGVjdG9yJyBdICk7XG5cdFx0XHRjb25zdCB2YWxpZFZhbHVlcyA9IGRbICd2YWx1ZScgXTtcblxuXHRcdFx0aWYgKCB2YWxpZFZhbHVlcy5pbmNsdWRlcyggX3ZhbHVlICkgKSB7XG5cdFx0XHRcdCRzZWxlY3Rvci5zaG93KCk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHQkc2VsZWN0b3IuaGlkZSgpO1xuXHRcdFx0fVxuXHRcdH0gKTtcblxuXHRcdCRzZWFyY2hGb3JtLnRyaWdnZXIoICdhZnRlcl90b2dnbGVfcmVxdWVzdCcsIFsgaGFuZGxlciwgX3ZhbHVlLCAkZmllbGQgXSApO1xuXHR9XG5cblx0ZnVuY3Rpb24gaGFuZGxlVG9nZ2xlUmVxdWVzdCggZGF0YSwgY3VycmVudFNlbGVjdG9yLCB2YWx1ZSApIHtcblx0XHRpZiAoIG51bGwgPT09IGN1cnJlbnRTZWxlY3RvciApIHtcblx0XHRcdGNvbnN0IGhhbmRsZXIgID0gZGF0YVsgJ2hhbmRsZXInIF07XG5cdFx0XHRjb25zdCAkaGFuZGxlciA9ICQoIGhhbmRsZXIgKTtcblxuXHRcdFx0JC5lYWNoKCAkaGFuZGxlciwgZnVuY3Rpb24oKSB7XG5cdFx0XHRcdGNvbnN0IF90aGlzICA9ICQoIHRoaXMgKTtcblx0XHRcdFx0Y29uc3QgX3ZhbHVlID0gX3RoaXMudmFsKCk7XG5cdFx0XHRcdF9oYW5kbGVUb2dnbGVSZXF1ZXN0KCBkYXRhLCBfdGhpcywgX3ZhbHVlICk7XG5cdFx0XHR9ICk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdF9oYW5kbGVUb2dnbGVSZXF1ZXN0KCBkYXRhLCBjdXJyZW50U2VsZWN0b3IsIHZhbHVlICk7XG5cdFx0fVxuXHR9XG5cblx0ZnVuY3Rpb24gc2V0dXBTZWFyY2hGb3JtKCBpbml0YWwgPSBmYWxzZSApIHtcblx0XHQkLmVhY2goIGRlcGVuZGFudERhdGEsIGZ1bmN0aW9uKCBpLCBkYXRhICkge1xuXHRcdFx0Y29uc3QgaGFuZGxlciA9IGRhdGFbICdoYW5kbGVyJyBdO1xuXHRcdFx0Y29uc3QgZXZlbnQgICA9IGRhdGFbICdldmVudCcgXTtcblxuXHRcdFx0aGFuZGxlVG9nZ2xlUmVxdWVzdCggZGF0YSwgbnVsbCwgbnVsbCApO1xuXG5cdFx0XHRpZiAoIGluaXRhbCApIHtcblx0XHRcdFx0JHNlYXJjaEZvcm0ub24oIGV2ZW50LCBoYW5kbGVyLCBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHRjb25zdCBfdGhpcyAgPSAkKCB0aGlzICk7XG5cdFx0XHRcdFx0Y29uc3QgX3ZhbHVlID0gJCggdGhpcyApLnZhbCgpO1xuXHRcdFx0XHRcdGhhbmRsZVRvZ2dsZVJlcXVlc3QoIGRhdGEsIF90aGlzLCBfdmFsdWUgKTtcblx0XHRcdFx0fSApO1xuXHRcdFx0fVxuXHRcdH0gKTtcblx0fVxuXG5cdHNldHVwU2VhcmNoRm9ybSggdHJ1ZSApO1xuXG5cdCRzZWFyY2hGb3JtLm9uKCAnZmllbGRfYWRkZWQnLCBmdW5jdGlvbigpIHtcblx0XHQvLyBUb2dnbGUgdGhlIHZpc2liaWxpdHkgb2Ygc3ViZmllbGRzLlxuXHRcdHNldHVwU2VhcmNoRm9ybSgpO1xuXHR9ICk7XG5cbn0gKTtcbiJdfQ==
