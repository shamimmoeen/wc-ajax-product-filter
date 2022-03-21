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
 */
function initManualOptionsTable(tableIdentifier, valueIdentifier, rowTemplateId) {
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
    var rendered = template();
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImN1c3RvbS1hcHBlYXJhbmNlLWZpZWxkcy5qcyIsImRpc3BsYXktdHlwZS1maWVsZHMuanMiLCJtYW51YWwtb3B0aW9ucy10YWJsZS5qcyIsIm51bWJlci11aS1vcHRpb25zLmpzIiwicHJvZHVjdC1zdGF0dXMtdGFibGUuanMiLCJzZWFyY2gtZm9ybS5qcyIsInRvZ2dsZVZpc2liaWxpdHkuanMiXSwibmFtZXMiOlsialF1ZXJ5IiwiZG9jdW1lbnQiLCJyZWFkeSIsIiQiLCIkc2VhcmNoRm9ybSIsIm9uIiwiZSIsImhhbmRsZXIiLCJ2YWx1ZSIsIiRmaWVsZCIsIiRxdWVyeVR5cGUiLCJmaW5kIiwidmFsaWREaXNwbGF5VHlwZXMiLCJpbmNsdWRlcyIsIiRtdWx0aXBsZUZpbHRlciIsImlzIiwic2hvdyIsImhpZGUiLCIkZGlzcGxheVR5cGUiLCJkaXNwbGF5VHlwZSIsInZhbCIsIiRub1Jlc3VsdHMiLCIkYWxsSXRlbXNMYWJlbCIsInVzZUNob3NlbiIsImluaXRNYW51YWxPcHRpb25zVGFibGUiLCJ0YWJsZUlkZW50aWZpZXIiLCJ2YWx1ZUlkZW50aWZpZXIiLCJyb3dUZW1wbGF0ZUlkIiwiZmllbGRJZGVudGlmaWVyIiwicm93c0lkZW50aWZpZXIiLCJyb3dJZGVudGlmaWVyIiwiaW5pdFNvcnRhYmxlVGFibGUiLCIkc2VsZWN0b3IiLCJzb3J0YWJsZSIsIm9wYWNpdHkiLCJyZXZlcnQiLCJjdXJzb3IiLCJheGlzIiwiaGFuZGxlIiwicGxhY2Vob2xkZXIiLCJ1cGRhdGUiLCJ0YXJnZXQiLCJjbG9zZXN0IiwidHJpZ2dlck9wdGlvbnNDaGFuZ2UiLCJkaXNhYmxlU2VsZWN0aW9uIiwidGFibGVSb3dzSWRlbnRpZmllciIsInVpIiwiaXRlbSIsIiR2YWx1ZUhvbGRlciIsIiRyb3dzIiwiX3Jvd3MiLCJlYWNoIiwiaSIsIl9pdGVtIiwiJGl0ZW0iLCJvYmoiLCJmaWVsZEluZGV4IiwiZmllbGQiLCJuYW1lIiwiYXR0ciIsInB1c2giLCJyYXdWYWx1ZXMiLCJlbmNvZGVVUklDb21wb25lbnQiLCJKU09OIiwic3RyaW5naWZ5IiwidHJpZ2dlclJlbW92ZU9wdGlvbiIsIiRvcHRpb25zVGFibGUiLCJ0YWJsZVJvd3MiLCJjaGlsZHJlbiIsImxlbmd0aCIsInJlbW92ZUNsYXNzIiwicmVtb3ZlQnRuSWRlbnRpZmllciIsInJlbW92ZSIsImNsZWFyT3B0aW9uc0J0bklkZW50aWZpZXIiLCJlbXB0eSIsImFkZE9wdGlvbkJ0bklkZW50aWZpZXIiLCJ0ZW1wbGF0ZSIsIndwIiwicmVuZGVyZWQiLCIkdGFibGUiLCJhcHBlbmQiLCJ0cmlnZ2VyIiwiaGFzQ2xhc3MiLCJhZGRDbGFzcyIsInRleHRGaWVsZHNJZGVudGlmaWVyIiwic2VsZWN0RmllbGRzSWRlbnRpZmllciIsInRhYmxlSWQiLCJ0b2dnbGVOdW1iZXJNaW5WYWx1ZUZpZWxkIiwiJGVsbSIsIiR0ZXh0RmllbGQiLCJyZW1vdmVBdHRyIiwiJHRoaXMiLCJ0b2dnbGVOdW1iZXJNYXhWYWx1ZUZpZWxkIiwidG90YWxGaWVsZEluc3RhbmNlcyIsInNlYXJjaEZvcm0iLCJyZW1vdmVQbGFjZWhvbGRlciIsInVuaXF1ZUlkIiwiZWxlbWVudHMiLCJlbGVtZW50Iiwib2xkVmFsdWUiLCJuZXdWYWx1ZSIsInJlcGxhY2UiLCJpbnNlcnRGaWVsZFN1YkZpZWxkcyIsInR5cGUiLCJwYXJzZUludCIsImZpZWxkVHlwZSIsIndyYXBwZXIiLCJwcmVwZW5kIiwidXBkYXRlRmllbGRzUG9zaXRpb24iLCJpbnB1dHMiLCJuYkVsZW1zIiwiaWR4IiwibWFrZUZpZWxkUmVhZHkiLCJ0b2dnbGVCdG4iLCJpZGVudGlmaWVyIiwiY29udGFpbmVyIiwiY2FuY2VsIiwiaXRlbXMiLCJjb25uZWN0V2l0aCIsInN0b3AiLCJzdGFydCIsImFwcGVuZFRvIiwicGFyZW50Iiwib25EcmFnU3RhcnQiLCJvbkRyYWdTdG9wIiwiZHJhZ2dhYmxlIiwiY29ubmVjdFRvU29ydGFibGUiLCJoZWxwZXIiLCJ0b2dnbGVGaWVsZCIsIndpZGdldCIsImluc2lkZSIsImlzRXhwYW5kIiwidG9nZ2xlRXhwYW5kIiwic2xpZGVUb2dnbGUiLCJ0b2dnbGVDbGFzcyIsImZvY3VzRmllbGQiLCJjbGFzc0xpc3QiLCJjb250YWlucyIsImFjdGlvbiIsImZvY3VzIiwicmVtb3ZlRmllbGQiLCJzbGlkZVVwIiwiaW5pdGlhbEZvcm1TdGF0ZSIsInNlcmlhbGl6ZUFycmF5Iiwic2hvd01lc3NhZ2UiLCJtZXNzYWdlIiwiaHRtbCIsInNsaWRlRG93biIsInNldFRpbWVvdXQiLCJzYXZlRm9ybSIsImJ1dHRvbiIsImZvcm1EYXRhIiwib2tDYWxsYmFjayIsImVyckNhbGxiYWNrIiwiYWpheCIsInBvc3QiLCJkb25lIiwiZmFpbCIsIiRmaWVsZHMiLCJkZXBlbmRhbnREYXRhIiwiX2hhbmRsZVRvZ2dsZVJlcXVlc3QiLCJkYXRhIiwiY3VycmVudFNlbGVjdG9yIiwiaGFuZGxlclR5cGUiLCJkZXBlbmRhbnQiLCJfdmFsdWUiLCJpZCIsImQiLCJ2YWxpZFZhbHVlcyIsImhhbmRsZVRvZ2dsZVJlcXVlc3QiLCIkaGFuZGxlciIsIl90aGlzIiwic2V0dXBTZWFyY2hGb3JtIiwiaW5pdGFsIiwiZXZlbnQiXSwibWFwcGluZ3MiOiI7O0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBQSxNQUFNLENBQUVDLFFBQUYsQ0FBTixDQUFtQkMsS0FBbkIsQ0FBMEIsVUFBVUMsQ0FBVixFQUFjO0FBRXZDLE1BQU1DLFdBQVcsR0FBR0QsQ0FBQyxDQUFFLGNBQUYsQ0FBckI7QUFFQUMsRUFBQUEsV0FBVyxDQUFDQyxFQUFaLENBQWdCLHNCQUFoQixFQUF3QyxVQUFVQyxDQUFWLEVBQWFDLE9BQWIsRUFBc0JDLEtBQXRCLEVBQTZCQyxNQUE3QixFQUFzQztBQUM3RSxRQUFLLGdEQUFnREYsT0FBckQsRUFBK0Q7QUFDOUQsVUFBTUcsVUFBVSxHQUFVRCxNQUFNLENBQUNFLElBQVAsQ0FBYSxrQ0FBYixDQUExQjtBQUNBLFVBQU1DLGlCQUFpQixHQUFHLENB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O0FBS0EsQ0FoWEQiLCJmaWxlIjoid2MtYWpheC1wcm9kdWN0LWZpbHRlci1hZG1pbi1zY3JpcHRzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBEaXNwbGF5IHR5cGUgZmllbGRzLlxuICpcbiAqIEBzaW5jZSAgICAgIDMuMC4wXG4gKiBAcGFja2FnZSAgICB3Yy1hamF4LXByb2R1Y3QtZmlsdGVyXG4gKiBAc3VicGFja2FnZSB3Yy1hamF4LXByb2R1Y3QtZmlsdGVyL2FkbWluL3NyYy9qc1xuICogQGF1dGhvciAgICAgTWFpbnVsIEhhc3NhbiBNYWluXG4gKi9cblxualF1ZXJ5KCBkb2N1bWVudCApLnJlYWR5KCBmdW5jdGlvbiggJCApIHtcblxuXHRjb25zdCAkc2VhcmNoRm9ybSA9ICQoICcjc2VhcmNoLWZvcm0nICk7XG5cblx0JHNlYXJjaEZvcm0ub24oICdhZnRlcl90b2dnbGVfcmVxdWVzdCcsIGZ1bmN0aW9uKCBlLCBoYW5kbGVyLCB2YWx1ZSwgJGZpZWxkICkge1xuXHRcdGlmICggJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1kaXNwbGF5X3R5cGUgc2VsZWN0JyA9PT0gaGFuZGxlciApIHtcblx0XHRcdGNvbnN0ICRxdWVyeVR5cGUgICAgICAgID0gJGZpZWxkLmZpbmQoICcud2NhcGYtZm9ybS1zdWItZmllbGQtcXVlcnlfdHlwZScgKTtcblx0XHRcdGNvbnN0IHZhbGlkRGlzcGxheVR5cGVzID0gWyAnbGFiZWwnLCAnY29sb3InLCAnaW1hZ2UnIF07XG5cblx0XHRcdGlmICggdmFsaWREaXNwbGF5VHlwZXMuaW5jbHVkZXMoIHZhbHVlICkgKSB7XG5cdFx0XHRcdGNvbnN0ICRtdWx0aXBsZUZpbHRlciA9ICRmaWVsZC5maW5kKCAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLWVuYWJsZV9tdWx0aXBsZV9maWx0ZXIgaW5wdXQnICk7XG5cblx0XHRcdFx0aWYgKCAkbXVsdGlwbGVGaWx0ZXIuaXMoICc6Y2hlY2tlZCcgKSApIHtcblx0XHRcdFx0XHQkcXVlcnlUeXBlLnNob3coKTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHQkcXVlcnlUeXBlLmhpZGUoKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0fSApO1xuXG5cdCRzZWFyY2hGb3JtLm9uKCAnYWZ0ZXJfdG9nZ2xlX3JlcXVlc3QnLCBmdW5jdGlvbiggZSwgaGFuZGxlciwgdmFsdWUsICRmaWVsZCApIHtcblx0XHRpZiAoICcud2NhcGYtZm9ybS1zdWItZmllbGQtZW5hYmxlX211bHRpcGxlX2ZpbHRlciBpbnB1dCcgPT09IGhhbmRsZXIgKSB7XG5cdFx0XHRjb25zdCAkcXVlcnlUeXBlICAgICAgICA9ICRmaWVsZC5maW5kKCAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLXF1ZXJ5X3R5cGUnICk7XG5cdFx0XHRjb25zdCAkZGlzcGxheVR5cGUgICAgICA9ICRmaWVsZC5maW5kKCAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLWRpc3BsYXlfdHlwZSBzZWxlY3QnICk7XG5cdFx0XHRjb25zdCBkaXNwbGF5VHlwZSAgICAgICA9ICRkaXNwbGF5VHlwZS52YWwoKTtcblx0XHRcdGNvbnN0IHZhbGlkRGlzcGxheVR5cGVzID0gWyAnbGFiZWwnLCAnY29sb3InLCAnaW1hZ2UnIF07XG5cblx0XHRcdGlmICggdmFsaWREaXNwbGF5VHlwZXMuaW5jbHVkZXMoIGRpc3BsYXlUeXBlICkgKSB7XG5cdFx0XHRcdGlmICggJzEnID09PSB2YWx1ZSApIHtcblx0XHRcdFx0XHQkcXVlcnlUeXBlLnNob3coKTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHQkcXVlcnlUeXBlLmhpZGUoKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0fSApO1xuXG59ICk7XG4iLCIvKipcbiAqIERpc3BsYXkgdHlwZSBmaWVsZHMuXG4gKlxuICogQHNpbmNlICAgICAgMy4wLjBcbiAqIEBwYWNrYWdlICAgIHdjLWFqYXgtcHJvZHVjdC1maWx0ZXJcbiAqIEBzdWJwYWNrYWdlIHdjLWFqYXgtcHJvZHVjdC1maWx0ZXIvYWRtaW4vc3JjL2pzXG4gKiBAYXV0aG9yICAgICBNYWludWwgSGFzc2FuIE1haW5cbiAqL1xuXG5qUXVlcnkoIGRvY3VtZW50ICkucmVhZHkoIGZ1bmN0aW9uKCAkICkge1xuXG5cdGNvbnN0ICRzZWFyY2hGb3JtID0gJCggJyNzZWFyY2gtZm9ybScgKTtcblxuXHQvLyBPdmVycmlkZSBuby1yZXN1bHRzLW1lc3NhZ2UsIGFsbC1pdGVtcy1sYWJlbCBmaWVsZCdzIHRvZ2dsZSB2aXNpYmlsaXR5IHdoZW4gdGV4dCBkaXNwbGF5IHR5cGUgaXMgY2hhbmdlZC5cblx0JHNlYXJjaEZvcm0ub24oICdhZnRlcl90b2dnbGVfcmVxdWVzdCcsIGZ1bmN0aW9uKCBlLCBoYW5kbGVyLCB2YWx1ZSwgJGZpZWxkICkge1xuXHRcdGlmICggJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1kaXNwbGF5X3R5cGUgc2VsZWN0JyA9PT0gaGFuZGxlciApIHtcblx0XHRcdGNvbnN0ICRub1Jlc3VsdHMgICAgID0gJGZpZWxkLmZpbmQoICcud2NhcGYtZm9ybS1zdWItZmllbGQtY2hvc2VuX25vX3Jlc3VsdHNfbWVzc2FnZScgKTtcblx0XHRcdGNvbnN0ICRhbGxJdGVtc0xhYmVsID0gJGZpZWxkLmZpbmQoICcud2NhcGYtZm9ybS1zdWItZmllbGQtYWxsX2l0ZW1zX2xhYmVsJyApO1xuXHRcdFx0Y29uc3QgdXNlQ2hvc2VuICAgICAgPSAkZmllbGQuZmluZCggJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC11c2VfY2hvc2VuIGlucHV0JyApLmlzKCAnOmNoZWNrZWQnICk7XG5cblx0XHRcdGlmICggdXNlQ2hvc2VuICYmICggJ3NlbGVjdCcgPT09IHZhbHVlIHx8ICdtdWx0aS1zZWxlY3QnID09PSB2YWx1ZSApICkge1xuXHRcdFx0XHQkbm9SZXN1bHRzLnNob3coKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdCRub1Jlc3VsdHMuaGlkZSgpO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAoICggJ3JhZGlvJyA9PT0gdmFsdWUgfHwgJ3NlbGVjdCcgPT09IHZhbHVlICkgfHwgKCAnbXVsdGktc2VsZWN0JyA9PT0gdmFsdWUgJiYgdXNlQ2hvc2VuICkgKSB7XG5cdFx0XHRcdCRhbGxJdGVtc0xhYmVsLnNob3coKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdCRhbGxJdGVtc0xhYmVsLmhpZGUoKTtcblx0XHRcdH1cblx0XHR9XG5cdH0gKTtcblxuXHQvLyBPdmVycmlkZSBuby1yZXN1bHRzLW1lc3NhZ2UsIGFsbC1pdGVtcy1sYWJlbCBmaWVsZCdzIHRvZ2dsZSB2aXNpYmlsaXR5IHdoZW4gdGV4dCB1c2UgY2hvc2VuIGlzIGNoYW5nZWQuXG5cdCRzZWFyY2hGb3JtLm9uKCAnYWZ0ZXJfdG9nZ2xlX3JlcXVlc3QnLCBmdW5jdGlvbiggZSwgaGFuZGxlciwgdmFsdWUsICRmaWVsZCApIHtcblx0XHRpZiAoICcud2NhcGYtZm9ybS1zdWItZmllbGQtdXNlX2Nob3NlbiBpbnB1dCcgPT09IGhhbmRsZXIgKSB7XG5cdFx0XHRjb25zdCAkbm9SZXN1bHRzICAgICA9ICRmaWVsZC5maW5kKCAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLWNob3Nlbl9ub19yZXN1bHRzX21lc3NhZ2UnICk7XG5cdFx0XHRjb25zdCAkYWxsSXRlbXNMYWJlbCA9ICRmaWVsZC5maW5kKCAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLWFsbF9pdGVtc19sYWJlbCcgKTtcblx0XHRcdGNvbnN0IGRpc3BsYXlUeXBlICAgID0gJGZpZWxkLmZpbmQoICcud2NhcGYtZm9ybS1zdWItZmllbGQtZGlzcGxheV90eXBlIHNlbGVjdCcgKS52YWwoKTtcblxuXHRcdFx0aWYgKCAnMScgPT09IHZhbHVlICYmICggJ3NlbGVjdCcgPT09IGRpc3BsYXlUeXBlIHx8ICdtdWx0aS1zZWxlY3QnID09PSBkaXNwbGF5VHlwZSApICkge1xuXHRcdFx0XHQkbm9SZXN1bHRzLnNob3coKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdCRub1Jlc3VsdHMuaGlkZSgpO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAoXG5cdFx0XHRcdCggJzEnID09PSB2YWx1ZSAmJiAnbXVsdGktc2VsZWN0JyA9PT0gZGlzcGxheVR5cGUgKVxuXHRcdFx0XHR8fCAoICdyYWRpbycgPT09IGRpc3BsYXlUeXBlIHx8ICdzZWxlY3QnID09PSBkaXNwbGF5VHlwZSApXG5cdFx0XHQpIHtcblx0XHRcdFx0JGFsbEl0ZW1zTGFiZWwuc2hvdygpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0JGFsbEl0ZW1zTGFiZWwuaGlkZSgpO1xuXHRcdFx0fVxuXHRcdH1cblx0fSApO1xuXG59ICk7XG4iLCIvKipcbiAqIE1hbnVhbCBPcHRpb25zJyB0YWJsZSBmdW5jdGlvbi5cbiAqXG4gKiBAc2luY2UgICAgICAzLjAuMFxuICogQHBhY2thZ2UgICAgd2MtYWpheC1wcm9kdWN0LWZpbHRlclxuICogQHN1YnBhY2thZ2Ugd2MtYWpheC1wcm9kdWN0LWZpbHRlci9hZG1pbi9zcmMvanNcbiAqIEBhdXRob3IgICAgIE1haW51bCBIYXNzYW4gTWFpblxuICovXG5cbi8qKlxuICogQHBhcmFtIHRhYmxlSWRlbnRpZmllclxuICogQHBhcmFtIHZhbHVlSWRlbnRpZmllclxuICogQHBhcmFtIHJvd1RlbXBsYXRlSWRcbiAqL1xuZnVuY3Rpb24gaW5pdE1hbnVhbE9wdGlvbnNUYWJsZSggdGFibGVJZGVudGlmaWVyLCB2YWx1ZUlkZW50aWZpZXIsIHJvd1RlbXBsYXRlSWQgKSB7XG5cdGNvbnN0ICQgPSBqUXVlcnk7XG5cblx0Y29uc3QgJHNlYXJjaEZvcm0gPSAkKCAnI3NlYXJjaC1mb3JtJyApO1xuXG5cdGNvbnN0IGZpZWxkSWRlbnRpZmllciA9ICcud2NhcGYtZm9ybS1maWVsZCc7XG5cdGNvbnN0IHJvd3NJZGVudGlmaWVyICA9ICcuZmllbGQtdGFibGUtYm9keS1yb3dzJztcblx0Y29uc3Qgcm93SWRlbnRpZmllciAgID0gJy5yb3ctaXRlbSc7XG5cblx0ZnVuY3Rpb24gaW5pdFNvcnRhYmxlVGFibGUoICRzZWxlY3RvciApIHtcblx0XHQkc2VsZWN0b3Iuc29ydGFibGUoIHtcblx0XHRcdG9wYWNpdHk6IDAuOCxcblx0XHRcdHJldmVydDogZmFsc2UsXG5cdFx0XHRjdXJzb3I6ICdtb3ZlJyxcblx0XHRcdGF4aXM6ICd5Jyxcblx0XHRcdGhhbmRsZTogJy5tb3ZlLW9wdGlvbnMtaGFuZGxlcicsXG5cdFx0XHRwbGFjZWhvbGRlcjogJ3dpZGdldC1wbGFjZWhvbGRlcicsXG5cdFx0XHR1cGRhdGU6IGZ1bmN0aW9uKCBlICkge1xuXHRcdFx0XHRjb25zdCAkZmllbGQgPSAkKCBlLnRhcmdldCApLmNsb3Nlc3QoICcud2NhcGYtZm9ybS1maWVsZCcgKTtcblxuXHRcdFx0XHR0cmlnZ2VyT3B0aW9uc0NoYW5nZSggJGZpZWxkICk7XG5cdFx0XHR9XG5cdFx0fSApLmRpc2FibGVTZWxlY3Rpb24oKTtcblx0fVxuXG5cdGNvbnN0IHRhYmxlUm93c0lkZW50aWZpZXIgPSB0YWJsZUlkZW50aWZpZXIgKyAnICcgKyByb3dzSWRlbnRpZmllcjtcblxuXHQvLyBJbml0IHRoZSBzb3J0YWJsZSB0YWJsZSBhZnRlciBwYWdlIGxvYWRzLlxuXHRpbml0U29ydGFibGVUYWJsZSggJHNlYXJjaEZvcm0uZmluZCggdGFibGVSb3dzSWRlbnRpZmllciApICk7XG5cblx0Ly8gSW5pdCB0aGUgc29ydGFibGUgdGFibGUgYWZ0ZXIgdGhlIGZpZWxkIGlzIGFkZGVkLlxuXHQkc2VhcmNoRm9ybS5vbiggJ2ZpZWxkX2FkZGVkJywgZnVuY3Rpb24oIGUsIHVpICkge1xuXHRcdGluaXRTb3J0YWJsZVRhYmxlKCAkKCB1aS5pdGVtLmZpbmQoIHRhYmxlUm93c0lkZW50aWZpZXIgKSApICk7XG5cdH0gKTtcblxuXHRmdW5jdGlvbiB0cmlnZ2VyT3B0aW9uc0NoYW5nZSggJGZpZWxkICkge1xuXHRcdGNvbnN0ICR2YWx1ZUhvbGRlciA9ICRmaWVsZC5maW5kKCB2YWx1ZUlkZW50aWZpZXIgKTtcblx0XHRjb25zdCAkcm93cyAgICAgICAgPSAkZmllbGQuZmluZCggdGFibGVSb3dzSWRlbnRpZmllciApO1xuXHRcdGNvbnN0IF9yb3dzICAgICAgICA9IFtdO1xuXG5cdFx0JHJvd3MuZmluZCggJy5yb3ctaXRlbScgKS5lYWNoKCBmdW5jdGlvbiggaSwgX2l0ZW0gKSB7XG5cdFx0XHRjb25zdCAkaXRlbSA9ICQoIF9pdGVtICk7XG5cdFx0XHRjb25zdCBvYmogICA9IHt9O1xuXG5cdFx0XHQkaXRlbS5maW5kKCAnW2RhdGEtbmFtZV0nICkuZWFjaCggZnVuY3Rpb24oIGZpZWxkSW5kZXgsIGZpZWxkICkge1xuXHRcdFx0XHRjb25zdCAkZmllbGQgPSAkKCBmaWVsZCApO1xuXHRcdFx0XHRjb25zdCBuYW1lICAgPSAkZmllbGQuYXR0ciggJ2RhdGEtbmFtZScgKTtcblxuXHRcdFx0XHRvYmpbIG5hbWUgXSA9ICRmaWVsZC52YWwoKTtcblx0XHRcdH0gKTtcblxuXHRcdFx0X3Jvd3MucHVzaCggb2JqICk7XG5cdFx0fSApO1xuXG5cdFx0Y29uc3QgcmF3VmFsdWVzID0gZW5jb2RlVVJJQ29tcG9uZW50KCBKU09OLnN0cmluZ2lmeSggX3Jvd3MgKSApO1xuXHRcdCR2YWx1ZUhvbGRlci52YWwoIHJhd1ZhbHVlcyApO1xuXHR9XG5cblx0ZnVuY3Rpb24gdHJpZ2dlclJlbW92ZU9wdGlvbiggJGZpZWxkICkge1xuXHRcdGNvbnN0ICRvcHRpb25zVGFibGUgPSAkZmllbGQuZmluZCggdGFibGVJZGVudGlmaWVyICk7XG5cdFx0Y29uc3QgdGFibGVSb3dzICAgICA9ICRmaWVsZC5maW5kKCB0YWJsZVJvd3NJZGVudGlmaWVyICkuY2hpbGRyZW4oKTtcblxuXHRcdGlmICggMiA+IHRhYmxlUm93cy5sZW5ndGggKSB7XG5cdFx0XHQkb3B0aW9uc1RhYmxlLnJlbW92ZUNsYXNzKCAnaGFzLW9wdGlvbnMnICk7XG5cdFx0fVxuXHR9XG5cblx0Ly8gUmVtb3ZlIE9wdGlvblxuXHRjb25zdCByZW1vdmVCdG5JZGVudGlmaWVyID0gdGFibGVJZGVudGlmaWVyICsgJyAucmVtb3ZlLW9wdGlvbic7XG5cblx0JHNlYXJjaEZvcm0ub24oICdjbGljaycsIHJlbW92ZUJ0bklkZW50aWZpZXIsIGZ1bmN0aW9uKCkge1xuXHRcdGNvbnN0ICRpdGVtICA9ICQoIHRoaXMgKS5jbG9zZXN0KCByb3dJZGVudGlmaWVyICk7XG5cdFx0Y29uc3QgJGZpZWxkID0gJGl0ZW0uY2xvc2VzdCggZmllbGRJZGVudGlmaWVyICk7XG5cblx0XHR0cmlnZ2VyUmVtb3ZlT3B0aW9uKCAkZmllbGQgKTtcblxuXHRcdCRpdGVtLnJlbW92ZSgpO1xuXG5cdFx0dHJpZ2dlck9wdGlvbnNDaGFuZ2UoICRmaWVsZCApO1xuXHR9ICk7XG5cblx0Ly8gQ2xlYXIgQWxsIE9wdGlvbnNcblx0Y29uc3QgY2xlYXJPcHRpb25zQnRuSWRlbnRpZmllciA9IHRhYmxlSWRlbnRpZmllciArICcgLmNsZWFyLW9wdGlvbnMnO1xuXG5cdCRzZWFyY2hGb3JtLm9uKCAnY2xpY2snLCBjbGVhck9wdGlvbnNCdG5JZGVudGlmaWVyLCBmdW5jdGlvbigpIHtcblx0XHRjb25zdCAkZmllbGQgPSAkKCB0aGlzICkuY2xvc2VzdCggZmllbGRJZGVudGlmaWVyICk7XG5cblx0XHQkZmllbGQuZmluZCggdGFibGVSb3dzSWRlbnRpZmllciApLmVtcHR5KCk7XG5cblx0XHR0cmlnZ2VyUmVtb3ZlT3B0aW9uKCAkZmllbGQgKTtcblx0XHR0cmlnZ2VyT3B0aW9uc0NoYW5nZSggJGZpZWxkICk7XG5cdH0gKTtcblxuXHQvLyBBZGQgTmV3IE9wdGlvblxuXHRjb25zdCBhZGRPcHRpb25CdG5JZGVudGlmaWVyID0gdGFibGVJZGVudGlmaWVyICsgJyAuYWRkLW9wdGlvbic7XG5cblx0JHNlYXJjaEZvcm0ub24oICdjbGljaycsIGFkZE9wdGlvbkJ0bklkZW50aWZpZXIsIGZ1bmN0aW9uKCkge1xuXHRcdC8vIEJhaWwgb3V0IGlmIG5vIHRtcGwgZm91bmQgZm9yIHRoZSB0eXBlLlxuXHRcdGlmICggISBqUXVlcnkoICcjdG1wbC0nICsgcm93VGVtcGxhdGVJZCApLmxlbmd0aCApIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHRjb25zdCAkZmllbGQgPSAkKCB0aGlzICkuY2xvc2VzdCggZmllbGRJZGVudGlmaWVyICk7XG5cblx0XHRjb25zdCB0ZW1wbGF0ZSA9IHdwLnRlbXBsYXRlKCByb3dUZW1wbGF0ZUlkICk7XG5cdFx0Y29uc3QgcmVuZGVyZWQgPSB0ZW1wbGF0ZSgpO1xuXHRcdGNvbnN0ICR0YWJsZSAgID0gJGZpZWxkLmZpbmQoIHRhYmxlSWRlbnRpZmllciApO1xuXHRcdGNvbnN0ICRyb3dzICAgID0gJGZpZWxkLmZpbmQoIHRhYmxlUm93c0lkZW50aWZpZXIgKTtcblxuXHRcdCRyb3dzLmFwcGVuZCggcmVuZGVyZWQgKTtcblxuXHRcdHRyaWdnZXJPcHRpb25zQ2hhbmdlKCAkZmllbGQgKTtcblxuXHRcdCRzZWFyY2hGb3JtLnRyaWdnZXIoICduZXdfb3B0aW9uX2FkZGVkJywgWyAkZmllbGQgXSApO1xuXG5cdFx0aWYgKCAhICR0YWJsZS5oYXNDbGFzcyggJ2hhcy1vcHRpb25zJyApICkge1xuXHRcdFx0JHRhYmxlLmFkZENsYXNzKCAnaGFzLW9wdGlvbnMnICk7XG5cdFx0fVxuXHR9ICk7XG5cblx0Ly8gVHJpZ2dlciBvcHRpb25zIGNoYW5nZSB3aGVuIHRoZSB0ZXh0IGZpZWxkcyBnZXQgY2hhbmdlZC5cblx0Y29uc3QgdGV4dEZpZWxkc0lkZW50aWZpZXIgPSB0YWJsZVJvd3NJZGVudGlmaWVyICsgJyBpbnB1dFt0eXBlPVwidGV4dFwiXSc7XG5cblx0JHNlYXJjaEZvcm0ub24oICdpbnB1dCcsIHRleHRGaWVsZHNJZGVudGlmaWVyLCBmdW5jdGlvbigpIHtcblx0XHRjb25zdCAkZmllbGQgPSAkKCB0aGlzICkuY2xvc2VzdCggZmllbGRJZGVudGlmaWVyICk7XG5cblx0XHR0cmlnZ2VyT3B0aW9uc0NoYW5nZSggJGZpZWxkICk7XG5cdH0gKTtcblxuXHQvLyBUcmlnZ2VyIG9wdGlvbnMgY2hhbmdlIHdoZW4gdGhlIHNlbGVjdCBmaWVsZHMgZ2V0IGNoYW5nZWQuXG5cdGxldCBzZWxlY3RGaWVsZHNJZGVudGlmaWVyID0gdGFibGVSb3dzSWRlbnRpZmllciArICcgc2VsZWN0JztcblxuXHQkc2VhcmNoRm9ybS5vbiggJ2NoYW5nZScsIHNlbGVjdEZpZWxkc0lkZW50aWZpZXIsIGZ1bmN0aW9uKCkge1xuXHRcdGNvbnN0ICRmaWVsZCA9ICQoIHRoaXMgKS5jbG9zZXN0KCBmaWVsZElkZW50aWZpZXIgKTtcblxuXHRcdHRyaWdnZXJPcHRpb25zQ2hhbmdlKCAkZmllbGQgKTtcblx0fSApO1xuXG5cdC8vIFRyaWdnZXIgb3B0aW9ucyBjaGFuZ2Ugd2hlbiB2YWx1ZSBpcyBhZGRlZCBmcm9tIG1vZGFsLlxuXHQkc2VhcmNoRm9ybS5vbiggJ3RyaWdnZXJfb3B0aW9uc190YWJsZScsIGZ1bmN0aW9uKCBlLCB0YWJsZUlkLCAkZmllbGQgKSB7XG5cdFx0aWYgKCB0YWJsZUlkID09PSB0YWJsZUlkZW50aWZpZXIgKSB7XG5cdFx0XHR0cmlnZ2VyT3B0aW9uc0NoYW5nZSggJGZpZWxkICk7XG5cdFx0fVxuXHR9ICk7XG5cbn1cbiIsIi8qKlxuICogVGhlIG51bWJlciB1aSBvcHRpb25zLlxuICpcbiAqIEBzaW5jZSAgICAgIDMuMC4wXG4gKiBAcGFja2FnZSAgICB3Yy1hamF4LXByb2R1Y3QtZmlsdGVyXG4gKiBAc3VicGFja2FnZSB3Yy1hamF4LXByb2R1Y3QtZmlsdGVyL2FkbWluL3NyYy9qc1xuICogQGF1dGhvciAgICAgTWFpbnVsIEhhc3NhbiBNYWluXG4gKi9cblxualF1ZXJ5KCBkb2N1bWVudCApLnJlYWR5KCBmdW5jdGlvbiggJCApIHtcblxuXHRjb25zdCAkc2VhcmNoRm9ybSA9ICQoICcjc2VhcmNoLWZvcm0nICk7XG5cblx0LyoqXG5cdCAqIFRvZ2dsZSBkaXNhYmxlZCBhdHRyaWJ1dGUgb2YgbWluLXZhbHVlIGZpZWxkIGZvciBudW1iZXIgdHlwZS5cblx0ICovXG5cdGZ1bmN0aW9uIHRvZ2dsZU51bWJlck1pblZhbHVlRmllbGQoICRlbG0gKSB7XG5cdFx0Y29uc3QgJGZpZWxkICAgICA9ICRlbG0uY2xvc2VzdCggJy53Y2FwZi1mb3JtLWZpZWxkJyApO1xuXHRcdGNvbnN0ICR0ZXh0RmllbGQgPSAkZmllbGQuZmluZCggJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1taW5fdmFsdWUgaW5wdXRbdHlwZT1cInRleHRcIl0nICk7XG5cblx0XHRpZiAoICRlbG0uaXMoICc6Y2hlY2tlZCcgKSApIHtcblx0XHRcdCR0ZXh0RmllbGQuYXR0ciggJ2Rpc2FibGVkJywgJ2Rpc2FibGVkJyApO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHQkdGV4dEZpZWxkLnJlbW92ZUF0dHIoICdkaXNhYmxlZCcgKTtcblx0XHR9XG5cdH1cblxuXHQkc2VhcmNoRm9ybS5maW5kKCAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLW1pbl92YWx1ZV9hdXRvX2RldGVjdCBpbnB1dFt0eXBlPVwiY2hlY2tib3hcIl0nICkuZWFjaCggZnVuY3Rpb24oKSB7XG5cdFx0Y29uc3QgJHRoaXMgPSAkKCB0aGlzICk7XG5cblx0XHR0b2dnbGVOdW1iZXJNaW5WYWx1ZUZpZWxkKCAkdGhpcyApO1xuXHR9ICk7XG5cblx0JHNlYXJjaEZvcm0ub24oXG5cdFx0J2NsaWNrJyxcblx0XHQnLndjYXBmLWZvcm0tc3ViLWZpZWxkLW1pbl92YWx1ZV9hdXRvX2RldGVjdCBpbnB1dFt0eXBlPVwiY2hlY2tib3hcIl0nLFxuXHRcdGZ1bmN0aW9uKCkge1xuXHRcdFx0Y29uc3QgJHRoaXMgPSAkKCB0aGlzICk7XG5cblx0XHRcdHRvZ2dsZU51bWJlck1pblZhbHVlRmllbGQoICR0aGlzICk7XG5cdFx0fVxuXHQpO1xuXG5cdC8qKlxuXHQgKiBUb2dnbGUgZGlzYWJsZWQgYXR0cmlidXRlIG9mIG1heC12YWx1ZSBmaWVsZCBmb3IgbnVtYmVyIHR5cGUuXG5cdCAqL1xuXHRmdW5jdGlvbiB0b2dnbGVOdW1iZXJNYXhWYWx1ZUZpZWxkKCAkZWxtICkge1xuXHRcdGNvbnN0ICRmaWVsZCAgICAgPSAkZWxtLmNsb3Nlc3QoICcud2NhcGYtZm9ybS1maWVsZCcgKTtcblx0XHRjb25zdCAkdGV4dEZpZWxkID0gJGZpZWxkLmZpbmQoICcud2NhcGYtZm9ybS1zdWItZmllbGQtbWF4X3ZhbHVlIGlucHV0W3R5cGU9XCJ0ZXh0XCJdJyApO1xuXG5cdFx0aWYgKCAkZWxtLmlzKCAnOmNoZWNrZWQnICkgKSB7XG5cdFx0XHQkdGV4dEZpZWxkLmF0dHIoICdkaXNhYmxlZCcsICdkaXNhYmxlZCcgKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0JHRleHRGaWVsZC5yZW1vdmVBdHRyKCAnZGlzYWJsZWQnICk7XG5cdFx0fVxuXHR9XG5cblx0JHNlYXJjaEZvcm0uZmluZCggJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1tYXhfdmFsdWVfYXV0b19kZXRlY3QgaW5wdXRbdHlwZT1cImNoZWNrYm94XCJdJyApLmVhY2goIGZ1bmN0aW9uKCkge1xuXHRcdGNvbnN0ICR0aGlzID0gJCggdGhpcyApO1xuXG5cdFx0dG9nZ2xlTnVtYmVyTWF4VmFsdWVGaWVsZCggJHRoaXMgKTtcblx0fSApO1xuXG5cdCRzZWFyY2hGb3JtLm9uKFxuXHRcdCdjbGljaycsXG5cdFx0Jy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1tYXhfdmFsdWVfYXV0b19kZXRlY3QgaW5wdXRbdHlwZT1cImNoZWNrYm94XCJdJyxcblx0XHRmdW5jdGlvbigpIHtcblx0XHRcdGNvbnN0ICR0aGlzID0gJCggdGhpcyApO1xuXG5cdFx0XHR0b2dnbGVOdW1iZXJNYXhWYWx1ZUZpZWxkKCAkdGhpcyApO1xuXHRcdH1cblx0KTtcblxufSApO1xuIiwiLyoqXG4gKiBUaGUgcHJvZHVjdCBzdGF0dXMgZmllbGQuXG4gKlxuICogQHNpbmNlICAgICAgMy4wLjBcbiAqIEBwYWNrYWdlICAgIHdjLWFqYXgtcHJvZHVjdC1maWx0ZXJcbiAqIEBzdWJwYWNrYWdlIHdjLWFqYXgtcHJvZHVjdC1maWx0ZXIvYWRtaW4vc3JjL2pzXG4gKiBAYXV0aG9yICAgICBNYWludWwgSGFzc2FuIE1haW5cbiAqL1xuXG5qUXVlcnkoIGRvY3VtZW50ICkucmVhZHkoIGZ1bmN0aW9uKCkge1xuXG5cdGNvbnN0IHRhYmxlSWRlbnRpZmllciA9ICcucHJvZHVjdC1zdGF0dXMtb3B0aW9ucy10YWJsZSc7XG5cdGNvbnN0IHZhbHVlSWRlbnRpZmllciA9ICcud2NhcGYtZm9ybS1zdWItZmllbGQtcHJvZHVjdF9zdGF0dXNfb3B0aW9ucyBpbnB1dCc7XG5cdGNvbnN0IHJvd1RlbXBsYXRlSWQgICA9ICd3Y2FwZi1wcm9kdWN0LXN0YXR1cy1vcHRpb24nO1xuXG5cdGluaXRNYW51YWxPcHRpb25zVGFibGUoIHRhYmxlSWRlbnRpZmllciwgdmFsdWVJZGVudGlmaWVyLCByb3dUZW1wbGF0ZUlkICk7XG5cbn0gKTtcbiIsIi8qKlxuICogVGhlIHNlYXJjaCBmb3JtLlxuICpcbiAqIEBzaW5jZSAgICAgIDMuMC4wXG4gKiBAcGFja2FnZSAgICB3Yy1hamF4LXByb2R1Y3QtZmlsdGVyXG4gKiBAc3VicGFja2FnZSB3Yy1hamF4LXByb2R1Y3QtZmlsdGVyL2FkbWluL3NyYy9qc1xuICogQGF1dGhvciAgICAgTWFpbnVsIEhhc3NhbiBNYWluXG4gKi9cblxuY29uc3QgdG90YWxGaWVsZEluc3RhbmNlcyA9IGpRdWVyeSggJyN0b3RhbF9maWVsZF9pbnN0YW5jZXMnICk7XG5cbmNvbnN0IHNlYXJjaEZvcm0gPSBqUXVlcnkoICcjc2VhcmNoLWZvcm0nICk7XG5cbi8qKlxuICogQXNzaWduIGEgdW5pcXVlIGlkIGJ5IHJlcGxhY2luZyB0aGUgcGxhY2Vob2xkZXIgaWQuXG4gKi9cbmZ1bmN0aW9uIHJlbW92ZVBsYWNlaG9sZGVyKCB1bmlxdWVJZCwgZWxlbWVudHMsIGF0dHIgKSB7XG5cdGVsZW1lbnRzLmVhY2goXG5cdFx0ZnVuY3Rpb24oKSB7XG5cdFx0XHRjb25zdCBlbGVtZW50ID0galF1ZXJ5KCB0aGlzICk7XG5cblx0XHRcdGNvbnN0IG9sZFZhbHVlID0gZWxlbWVudC5hdHRyKCBhdHRyICk7XG5cdFx0XHRjb25zdCBuZXdWYWx1ZSA9IG9sZFZhbHVlLnJlcGxhY2UoICclJScsIHVuaXF1ZUlkICk7XG5cblx0XHRcdGVsZW1lbnQuYXR0ciggYXR0ciwgbmV3VmFsdWUgKTtcblx0XHR9XG5cdCk7XG59XG5cbi8qKlxuICogSW5zZXJ0IHRoZSBmaWVsZCdzIHN1YmZpZWxkcy5cbiAqL1xuZnVuY3Rpb24gaW5zZXJ0RmllbGRTdWJGaWVsZHMoIHVpICkge1xuXHQvLyBJbnNlcnQgdGhlIGZpZWxkJ3Mgc3ViZmllbGRzIGlmIG5vdCBhbHJlYWR5IGluc2VydGVkLlxuXHRpZiAoICEgdWkuaXRlbS5oYXNDbGFzcyggJ3N1Yi1maWVsZHMtcmVhZHknICkgKSB7XG5cdFx0Y29uc3QgdHlwZSAgICAgID0gdWkuaXRlbS5hdHRyKCAnZGF0YS1maWVsZC10eXBlJyApO1xuXHRcdGNvbnN0IHVuaXF1ZUlkICA9IHBhcnNlSW50KCB0b3RhbEZpZWxkSW5zdGFuY2VzLnZhbCgpICk7XG5cdFx0Y29uc3QgZmllbGRUeXBlID0gJ3djYXBmLWZvcm0tZmllbGQtJyArIHR5cGU7XG5cblx0XHQvLyBCYWlsIG91dCBpZiBubyB0bXBsIGZvdW5kIGZvciB0aGUgdHlwZS5cblx0XHRpZiAoICEgalF1ZXJ5KCAnI3RtcGwtJyArIGZpZWxkVHlwZSApLmxlbmd0aCApIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHQvLyBJbmNyZW1lbnQgdGhlIHZhbHVlIG9mIHRvdGFsIGZpZWxkIGluc3RhbmNlcy5cblx0XHR0b3RhbEZpZWxkSW5zdGFuY2VzLnZhbCggdW5pcXVlSWQgKyAxICk7XG5cblx0XHRjb25zdCB0ZW1wbGF0ZSA9IHdwLnRlbXBsYXRlKCBmaWVsZFR5cGUgKTtcblx0XHRjb25zdCByZW5kZXJlZCA9IHRlbXBsYXRlKCk7XG5cdFx0Y29uc3Qgd3JhcHBlciAgPSB1aS5pdGVtLmZpbmQoICcud2lkZ2V0LWNvbnRlbnQnICk7XG5cblx0XHR3cmFwcGVyLnByZXBlbmQoIHJlbmRlcmVkICk7XG5cblx0XHQvLyBVcGRhdGUgdGhlIGZvciBhdHRyaWJ1dGVzIG9mIHRoZSBsYWJlbHMuXG5cdFx0cmVtb3ZlUGxhY2Vob2xkZXIoIHVuaXF1ZUlkLCB1aS5pdGVtLmZpbmQoICdsYWJlbFtmb3JePVwid2NhcGYtaW5wdXQtXCJdJyApLCAnZm9yJyApO1xuXG5cdFx0Ly8gVXBkYXRlIHRoZSBpZHMgb2YgdGhlIGlucHV0IGVsZW1lbnRzLlxuXHRcdHJlbW92ZVBsYWNlaG9sZGVyKCB1bmlxdWVJZCwgdWkuaXRlbS5maW5kKCAnKltpZF49XCJ3Y2FwZi1pbnB1dC1cIl0nICksICdpZCcgKTtcblxuXHRcdC8vIFVwZGF0ZSB0aGUgbmFtZXMgb2YgdGhlIGlucHV0IGVsZW1lbnRzLlxuXHRcdHJlbW92ZVBsYWNlaG9sZGVyKCB1bmlxdWVJZCwgdWkuaXRlbS5maW5kKCAnKltpZF49XCJ3Y2FwZi1pbnB1dC1cIl0nICksICduYW1lJyApO1xuXG5cdFx0Ly8gVXBkYXRlIHRoZSBwb3NpdGlvbiB2YWx1ZS5cblx0XHRyZW1vdmVQbGFjZWhvbGRlciggdW5pcXVlSWQsIHVpLml0ZW0uZmluZCggJypbaWRePVwid2NhcGYtaW5wdXQtcG9zaXRpb24tXCJdJyApLCAndmFsdWUnICk7XG5cblx0XHR1aS5pdGVtLmFkZENsYXNzKCAnc3ViLWZpZWxkcy1yZWFkeScgKTtcblxuXHRcdHNlYXJjaEZvcm0udHJpZ2dlciggJ2ZpZWxkX2FkZGVkJywgWyB1aSBdICk7XG5cdH1cbn1cblxuLyoqXG4gKiBVcGRhdGUgdGhlIGZvcm0gZmllbGQncyBwb3NpdGlvbiBhZnRlciBzb3J0LlxuICpcbiAqIEBzb3VyY2UgaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9hLzE0NzM2Nzc1XG4gKi9cbmZ1bmN0aW9uIHVwZGF0ZUZpZWxkc1Bvc2l0aW9uKCkge1xuXHRjb25zdCBpbnB1dHMgID0gc2VhcmNoRm9ybS5maW5kKCAnKltpZF49XCJ3Y2FwZi1pbnB1dC1wb3NpdGlvbi1cIl0nICk7XG5cdGNvbnN0IG5iRWxlbXMgPSBpbnB1dHMubGVuZ3RoO1xuXG5cdGlucHV0cy5lYWNoKFxuXHRcdGZ1bmN0aW9uKCBpZHggKSB7XG5cdFx0XHRqUXVlcnkoIHRoaXMgKS52YWwoIG5iRWxlbXMgLSAoIG5iRWxlbXMgLSBpZHggKSApO1xuXHRcdH1cblx0KTtcbn1cblxuLyoqXG4gKiBNYWtlIHRoZSBmaWVsZCByZWFkeSwgcmVtb3ZlIHN0eWxlcyBjb21lcyBmcm9tIGpxdWVyeS11aS1zb3J0YWJsZSBwbHVnaW4sIGluc2VydCB0aGUgZmllbGQncyBzdWJmaWVsZHMgZXRjLlxuICovXG5mdW5jdGlvbiBtYWtlRmllbGRSZWFkeSggZSwgdWkgKSB7XG5cdC8vIFJlbW92ZSBzdHlsZXMgY29tZXMgZnJvbSBqcXVlcnktdWktc29ydGFibGUgcGx1Z2luLlxuXHR1aS5pdGVtLnJlbW92ZUF0dHIoICdzdHlsZScgKTtcblxuXHRpbnNlcnRGaWVsZFN1YkZpZWxkcyggdWkgKTtcblxuXHR1cGRhdGVGaWVsZHNQb3NpdGlvbigpO1xuXG5cdGNvbnN0IHRvZ2dsZUJ0biA9IHVpLml0ZW0uZmluZCggJy53aWRnZXQtYWN0aW9uJyApO1xuXG5cdC8vIEV4cGFuZCB0aGUgZm9ybSBmaWVsZCBhZnRlciBzb3J0LlxuXHRpZiAoICdmYWxzZScgPT09IHRvZ2dsZUJ0bi5hdHRyKCAnYXJpYS1leHBhbmRlZCcgKSApIHtcblx0XHR0b2dnbGVCdG4udHJpZ2dlciggJ2NsaWNrJyApO1xuXHR9XG59XG5cbi8qKlxuICogSW5zdGFudGlhdGUgc29ydGFibGUgZm9yIHRoZSBmb3JtIGZpZWxkcy5cbiAqL1xuZnVuY3Rpb24gc29ydGFibGUoIGlkZW50aWZpZXIgKSB7XG5cdGNvbnN0IGNvbnRhaW5lciA9IGpRdWVyeSggaWRlbnRpZmllciApO1xuXG5cdGNvbnRhaW5lci5zb3J0YWJsZShcblx0XHR7XG5cdFx0XHRvcGFjaXR5OiAwLjgsXG5cdFx0XHRyZXZlcnQ6IGZhbHNlLFxuXHRcdFx0Y3Vyc29yOiAnbW92ZScsXG5cdFx0XHRheGlzOiAneScsXG5cdFx0XHRoYW5kbGU6ICcud2lkZ2V0LXRvcCcsXG5cdFx0XHRjYW5jZWw6ICcud2lkZ2V0LXRpdGxlLWFjdGlvbicsXG5cdFx0XHRpdGVtczogJy53aWRnZXQnLFxuXHRcdFx0cGxhY2Vob2xkZXI6ICd3aWRnZXQtcGxhY2Vob2xkZXInLFxuXHRcdFx0Y29ubmVjdFdpdGg6ICcjc2VhcmNoLWZvcm0td3JhcHBlcicsXG5cdFx0XHRzdG9wOiBtYWtlRmllbGRSZWFkeSxcblx0XHRcdHN0YXJ0OiBmdW5jdGlvbiggZSwgdWkgKSB7XG5cdFx0XHRcdC8vIElmIGl0IGlzIGdldHRpbmcgYXBwZW5kZWQgdG8gdGhlIHdyb25nIHBsYWNlLCB0aGVuIGZvcmNlIGl0IGludG8gdGhlIHJpZ2h0IGNvbnRhaW5lci5cblx0XHRcdFx0dWkucGxhY2Vob2xkZXIuYXBwZW5kVG8oIHVpLnBsYWNlaG9sZGVyLnBhcmVudCgpLmZpbmQoICcuaW5zaWRlICNzZWFyY2gtZm9ybS13cmFwcGVyJyApICk7XG5cdFx0XHR9XG5cdFx0fVxuXHQpO1xufVxuXG5zb3J0YWJsZSggJyNzZWFyY2gtZm9ybScgKTtcblxuLyoqXG4gKiBSdW4gZnVuY3Rpb24gd2hlbiBkcmFnIHN0YXJ0cy5cbiAqL1xuZnVuY3Rpb24gb25EcmFnU3RhcnQoKSB7XG5cdHNlYXJjaEZvcm0uYWRkQ2xhc3MoICd1aS1kcm9wLWFjdGl2ZScgKTtcbn1cblxuLyoqXG4gKiBSdW4gZnVuY3Rpb24gYXQgZHJhZyBzdG9wLlxuICovXG5mdW5jdGlvbiBvbkRyYWdTdG9wKCkge1xuXHRzZWFyY2hGb3JtLnJlbW92ZUNsYXNzKCAndWktZHJvcC1hY3RpdmUnICk7XG59XG5cbi8qKlxuICogSW5pdGlhbGl6ZSBkcmFnZ2FibGUgZm9yIHRoZSBmb3JtIGZpZWxkcy5cbiAqL1xualF1ZXJ5KCAnI2F2YWlsYWJsZS1maWVsZHMgLndpZGdldCcgKS5kcmFnZ2FibGUoXG5cdHtcblx0XHRjb25uZWN0VG9Tb3J0YWJsZTogJyNzZWFyY2gtZm9ybScsXG5cdFx0aGVscGVyOiAnY2xvbmUnLFxuXHRcdHN0YXJ0OiBvbkRyYWdTdGFydCxcblx0XHRzdG9wOiBvbkRyYWdTdG9wLFxuXHR9XG4pO1xuXG4vKipcbiAqIFRvZ2dsZSB0aGUgZm9ybSBmaWVsZC5cbiAqL1xuZnVuY3Rpb24gdG9nZ2xlRmllbGQoIGUgKSB7XG5cdGNvbnN0IHRhcmdldCAgICAgICA9IGUudGFyZ2V0O1xuXHRjb25zdCB3aWRnZXQgICAgICAgPSBqUXVlcnkoIHRoaXMgKS5jbG9zZXN0KCAnLndpZGdldCcgKTtcblx0Y29uc3QgdG9nZ2xlQnRuICAgID0gd2lkZ2V0LmZpbmQoICcud2lkZ2V0LWFjdGlvbicgKTtcblx0Y29uc3QgaW5zaWRlICAgICAgID0gd2lkZ2V0LmNoaWxkcmVuKCAnLndpZGdldC1pbnNpZGUnICk7XG5cdGNvbnN0IGlzRXhwYW5kICAgICA9IHRvZ2dsZUJ0bi5hdHRyKCAnYXJpYS1leHBhbmRlZCcgKTtcblx0Y29uc3QgdG9nZ2xlRXhwYW5kID0gJ3RydWUnID09PSBpc0V4cGFuZCA/ICdmYWxzZScgOiAndHJ1ZSc7XG5cblx0dG9nZ2xlQnRuLmF0dHIoICdhcmlhLWV4cGFuZGVkJywgdG9nZ2xlRXhwYW5kICk7XG5cdGpRdWVyeSggaW5zaWRlICkuc2xpZGVUb2dnbGUoXG5cdFx0J2Zhc3QnLFxuXHRcdGZ1bmN0aW9uKCkge1xuXHRcdFx0d2lkZ2V0LnRvZ2dsZUNsYXNzKCAnb3BlbicgKTtcblx0XHRcdHNlYXJjaEZvcm0udHJpZ2dlciggJ3dpZGdldC1jbG9zZWQnLCBbIHRhcmdldCBdICk7XG5cdFx0fVxuXHQpO1xufVxuXG5zZWFyY2hGb3JtLm9uKCAnY2xpY2snLCAnLndpZGdldC10b3AnLCB0b2dnbGVGaWVsZCApO1xuc2VhcmNoRm9ybS5vbiggJ2NsaWNrJywgJy53aWRnZXQtY29udHJvbC1jbG9zZScsIHRvZ2dsZUZpZWxkICk7XG5cbi8qKlxuICogRm9jdXMgdGhlIGZvcm0gZmllbGQncyBleHBhbmQgYnV0dG9uLlxuICovXG5mdW5jdGlvbiBmb2N1c0ZpZWxkKCBlLCB0YXJnZXQgKSB7XG5cdGlmICggdGFyZ2V0LmNsYXNzTGlzdC5jb250YWlucyggJ3dpZGdldC1jb250cm9sLWNsb3NlJyApICkge1xuXHRcdGNvbnN0IHdpZGdldCA9IGpRdWVyeSggdGFyZ2V0ICkuY2xvc2VzdCggJy53aWRnZXQnICk7XG5cdFx0Y29uc3QgYWN0aW9uID0gd2lkZ2V0LmZpbmQoICcud2lkZ2V0LWFjdGlvbicgKTtcblxuXHRcdGFjdGlvbi5hdHRyKCAnYXJpYS1leHBhbmRlZCcsICdmYWxzZScgKS5mb2N1cygpO1xuXHR9XG59XG5cbnNlYXJjaEZvcm0ub24oICd3aWRnZXQtY2xvc2VkJywgZm9jdXNGaWVsZCApO1xuXG4vKipcbiAqIFJlbW92ZSB0aGUgZmllbGQuXG4gKi9cbmZ1bmN0aW9uIHJlbW92ZUZpZWxkKCkge1xuXHRjb25zdCB3aWRnZXQgPSBqUXVlcnkoIHRoaXMgKS5jbG9zZXN0KCAnLndpZGdldCcgKTtcblxuXHRqUXVlcnkoIHdpZGdldCApLnNsaWRlVXAoXG5cdFx0J2Zhc3QnLFxuXHRcdGZ1bmN0aW9uKCkge1xuXHRcdFx0d2lkZ2V0LnJlbW92ZSgpO1xuXHRcdFx0dXBkYXRlRmllbGRzUG9zaXRpb24oKTtcblx0XHR9XG5cdCk7XG59XG5cbnNlYXJjaEZvcm0ub24oICdjbGljaycsICcud2lkZ2V0LWNvbnRyb2wtcmVtb3ZlJywgcmVtb3ZlRmllbGQgKTtcblxuLyoqXG4gKiBTdG9yZSB0aGUgaW5pdGlhbCBmb3JtIGRhdGEgaW50byBhIHZhcmlhYmxlIHNvIHRoYXQgd2UgY2FuIGNvbXBhcmUgaXQgd2hlbiBsZWF2aW5nIHRoZSBwYWdlLlxuICovXG5sZXQgaW5pdGlhbEZvcm1TdGF0ZSA9IHNlYXJjaEZvcm0uc2VyaWFsaXplQXJyYXkoKTtcblxuLyoqXG4gKiBTaG93IG1lc3NhZ2UgYWZ0ZXIgZm9ybSBzdWJtaXNzaW9uLlxuICovXG5mdW5jdGlvbiBzaG93TWVzc2FnZSggbWVzc2FnZSwgdHlwZSA9ICdzdWNjZXNzJyApIHtcblx0Y29uc3QgZWxlbWVudCA9IGpRdWVyeSggJzxwIGNsYXNzPVwiJyArIHR5cGUgKyAnXCI+JyArIG1lc3NhZ2UgKyAnPC9wPicgKTtcblx0Y29uc3Qgd3JhcHBlciA9IGpRdWVyeSggJy53Y2FwZi1tZXNzYWdlLXdyYXBwZXInICk7XG5cblx0aWYgKCAhIHdyYXBwZXIuaXMoICc6ZW1wdHknICkgKSB7XG5cdFx0cmV0dXJuO1xuXHR9XG5cblx0alF1ZXJ5KCB3cmFwcGVyICkuaHRtbCggZWxlbWVudCApLnNsaWRlRG93biggJ2Zhc3QnICk7XG5cblx0c2V0VGltZW91dChcblx0XHRmdW5jdGlvbigpIHtcblx0XHRcdGpRdWVyeSggd3JhcHBlciApLnNsaWRlVXAoICdmYXN0JyApO1xuXHRcdFx0d3JhcHBlci5odG1sKCAnJyApO1xuXHRcdH0sXG5cdFx0MzAwMFxuXHQpO1xufVxuXG4vKipcbiAqIFNhdmUgdGhlIHNlYXJjaCBmb3JtLlxuICovXG5mdW5jdGlvbiBzYXZlRm9ybSgpIHtcblx0Y29uc3QgYnV0dG9uICAgPSBqUXVlcnkoIHRoaXMgKTtcblx0Y29uc3QgZm9ybURhdGEgPSBzZWFyY2hGb3JtLnNlcmlhbGl6ZUFycmF5KCk7XG5cblx0YnV0dG9uLmF0dHIoICdkaXNhYmxlZCcsICdkaXNhYmxlZCcgKTtcblxuXHRmdW5jdGlvbiBva0NhbGxiYWNrKCBtZXNzYWdlICkge1xuXHRcdGJ1dHRvbi5yZW1vdmVBdHRyKCAnZGlzYWJsZWQnICk7XG5cblx0XHQvLyBVcGRhdGUgdGhlIGluaXRpYWwgZm9ybSBkYXRhIGFmdGVyIHN1Y2Nlc3NmdWxseSBzYXZpbmcgdGhlIGZvcm0uXG5cdFx0aW5pdGlhbEZvcm1TdGF0ZSA9IGZvcm1EYXRhO1xuXG5cdFx0c2hvd01lc3NhZ2UoIG1lc3NhZ2UgKTtcblx0fVxuXG5cdGZ1bmN0aW9uIGVyckNhbGxiYWNrKCBtZXNzYWdlICkge1xuXHRcdGJ1dHRvbi5yZW1vdmVBdHRyKCAnZGlzYWJsZWQnICk7XG5cdFx0c2hvd01lc3NhZ2UoIG1lc3NhZ2UsICdlcnJvcicgKTtcblx0fVxuXG5cdC8vIGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vYS81OTE4MTI1MlxuXHR3cC5hamF4LnBvc3QoIGZvcm1EYXRhICkuZG9uZSggb2tDYWxsYmFjayApLmZhaWwoIGVyckNhbGxiYWNrICk7XG59XG5cbmpRdWVyeSggJyNwb3N0Ym94LWNvbnRhaW5lci0xJyApLm9uKCAnY2xpY2snLCAnYnV0dG9uJywgc2F2ZUZvcm0gKTtcblxuc2VhcmNoRm9ybS5vbiggJ2NsaWNrJywgJy5leHBhbmQtYWxsLWZpZWxkcy1idG4nLCBmdW5jdGlvbigpIHtcblx0Y29uc3QgJGZpZWxkcyA9IHNlYXJjaEZvcm0uZmluZCggJ1tkYXRhLWZpZWxkLXR5cGVdJyApO1xuXG5cdCRmaWVsZHMuZWFjaCggZnVuY3Rpb24oKSB7XG5cdFx0Y29uc3QgJGl0ZW0gPSBqUXVlcnkoIHRoaXMgKTtcblxuXHRcdGlmICggISAkaXRlbS5oYXNDbGFzcyggJ29wZW4nICkgKSB7XG5cdFx0XHQkaXRlbS5maW5kKCAnLndpZGdldC10b3AnICkudHJpZ2dlciggJ2NsaWNrJyApO1xuXHRcdH1cblx0fSApO1xufSApO1xuXG5zZWFyY2hGb3JtLm9uKCAnY2xpY2snLCAnLmNvbGxhcHNlLWFsbC1maWVsZHMtYnRuJywgZnVuY3Rpb24oKSB7XG5cdGNvbnN0ICRmaWVsZHMgPSBzZWFyY2hGb3JtLmZpbmQoICdbZGF0YS1maWVsZC10eXBlXScgKTtcblxuXHQkZmllbGRzLmVhY2goIGZ1bmN0aW9uKCkge1xuXHRcdGNvbnN0ICRpdGVtID0galF1ZXJ5KCB0aGlzICk7XG5cblx0XHRpZiAoICRpdGVtLmhhc0NsYXNzKCAnb3BlbicgKSApIHtcblx0XHRcdCRpdGVtLmZpbmQoICcud2lkZ2V0LXRvcCcgKS50cmlnZ2VyKCAnY2xpY2snICk7XG5cdFx0fVxuXHR9ICk7XG59ICk7XG5cbi8qKlxuICogU2hvdyBhbGVydCBvbiBsZWF2ZSBpZiB0aGUgZm9ybSBpcyBkaXJ0eS5cbiAqXG4gKiBUT0RPOiBVbmNvbW1lbnQgdGhpcy5cbiAqL1xuLy8gd2luZG93Lm9uYmVmb3JldW5sb2FkID0gZnVuY3Rpb24oKSB7XG4vLyBcdGNvbnN0IG5ld0Zvcm1TdGF0ZSA9IHNlYXJjaEZvcm0uc2VyaWFsaXplQXJyYXkoKTtcbi8vXG4vLyBcdGNvbnN0IGlzRm9ybURpcnR5ID0gISBfLmlzRXF1YWwoIG5ld0Zvcm1TdGF0ZSwgaW5pdGlhbEZvcm1TdGF0ZSApO1xuLy9cbi8vIFx0aWYgKCBpc0Zvcm1EaXJ0eSApIHtcbi8vIFx0XHRyZXR1cm4gJyc7XG4vLyBcdH1cbi8vIH07XG4iLCIvKipcbiAqIFRoZSB0b2dnbGUgdmlzaWJpbGl0eSBzY3JpcHRzLlxuICpcbiAqIE5PVEU6IFRoZXNlIHNjcmlwdHMgbXVzdCBiZSBsb2NhdGVkIGF0IHRoZSB2ZXJ5IGJvdHRvbSBvZiB0aGUgY29tYmluZWQgc2NyaXB0cy5cbiAqXG4gKiBAc2luY2UgICAgICAzLjAuMFxuICogQHBhY2thZ2UgICAgd2MtYWpheC1wcm9kdWN0LWZpbHRlclxuICogQHN1YnBhY2thZ2Ugd2MtYWpheC1wcm9kdWN0LWZpbHRlci9hZG1pbi9zcmMvanNcbiAqIEBhdXRob3IgICAgIE1haW51bCBIYXNzYW4gTWFpblxuICovXG5cbmpRdWVyeSggZG9jdW1lbnQgKS5yZWFkeSggZnVuY3Rpb24oICQgKSB7XG5cblx0Y29uc3QgJHNlYXJjaEZvcm0gPSAkKCAnI3NlYXJjaC1mb3JtJyApO1xuXG5cdGNvbnN0IGRlcGVuZGFudERhdGEgPSBbXG5cdFx0e1xuXHRcdFx0J2hhbmRsZXInOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLXZhbHVlX3R5cGUgc2VsZWN0Jyxcblx0XHRcdCdoYW5kbGVyVHlwZSc6ICdzZWxlY3QnLFxuXHRcdFx0J2V2ZW50JzogJ2NoYW5nZScsXG5cdFx0XHQnZGVwZW5kYW50JzogW1xuXHRcdFx0XHR7XG5cdFx0XHRcdFx0J3NlbGVjdG9yJzogJy5pbnB1dC10eXBlLXRleHQtZmllbGRzJyxcblx0XHRcdFx0XHQndmFsdWUnOiBbICd0ZXh0JyBdLFxuXHRcdFx0XHR9LFxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0J3NlbGVjdG9yJzogJy5pbnB1dC10eXBlLW51bWJlci1maWVsZHMnLFxuXHRcdFx0XHRcdCd2YWx1ZSc6IFsgJ251bWJlcicgXSxcblx0XHRcdFx0fSxcblx0XHRcdFx0e1xuXHRcdFx0XHRcdCdzZWxlY3Rvcic6ICcuaW5wdXQtdHlwZS1kYXRlLWZpZWxkcycsXG5cdFx0XHRcdFx0J3ZhbHVlJzogWyAnZGF0ZScgXSxcblx0XHRcdFx0fSxcblx0XHRcdF0sXG5cdFx0fSxcblx0XHR7XG5cdFx0XHQnaGFuZGxlcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtZGlzcGxheV90eXBlIHNlbGVjdCcsXG5cdFx0XHQnaGFuZGxlclR5cGUnOiAnc2VsZWN0Jyxcblx0XHRcdCdldmVudCc6ICdjaGFuZ2UnLFxuXHRcdFx0J2RlcGVuZGFudCc6IFtcblx0XHRcdFx0e1xuXHRcdFx0XHRcdCdzZWxlY3Rvcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtcXVlcnlfdHlwZScsXG5cdFx0XHRcdFx0J3ZhbHVlJzogWyAnY2hlY2tib3gnLCAnbXVsdGktc2VsZWN0JyBdLFxuXHRcdFx0XHR9LFxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0J3NlbGVjdG9yJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1hbGxfaXRlbXNfbGFiZWwnLFxuXHRcdFx0XHRcdCd2YWx1ZSc6IFsgJ3JhZGlvJywgJ3NlbGVjdCcgXSxcblx0XHRcdFx0fSxcblx0XHRcdFx0e1xuXHRcdFx0XHRcdCdzZWxlY3Rvcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtdXNlX2Nob3NlbicsXG5cdFx0XHRcdFx0J3ZhbHVlJzogWyAnc2VsZWN0JywgJ211bHRpLXNlbGVjdCcgXSxcblx0XHRcdFx0fSxcblx0XHRcdFx0e1xuXHRcdFx0XHRcdCdzZWxlY3Rvcic6ICcuaGllcmFyY2hpY2FsLWZpZWxkcycsXG5cdFx0XHRcdFx0J3ZhbHVlJzogWyAnY2hlY2tib3gnLCAncmFkaW8nLCAnc2VsZWN0JywgJ211bHRpLXNlbGVjdCcgXSxcblx0XHRcdFx0fSxcblx0XHRcdFx0e1xuXHRcdFx0XHRcdCdzZWxlY3Rvcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtdXNlX2NhdGVnb3J5X2ltYWdlcycsXG5cdFx0XHRcdFx0J3ZhbHVlJzogWyAnaW1hZ2UnIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLWVuYWJsZV9tdWx0aXBsZV9maWx0ZXInLFxuXHRcdFx0XHRcdCd2YWx1ZSc6IFsgJ2xhYmVsJywgJ2NvbG9yJywgJ2ltYWdlJyBdLFxuXHRcdFx0XHR9LFxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0J3NlbGVjdG9yJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1pbmxpbmVfZGlzcGxheScsXG5cdFx0XHRcdFx0J3ZhbHVlJzogWyAnbGFiZWwnLCAnY29sb3InLCAnaW1hZ2UnIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLmNvbHVtbi1ncm91cC1jdXN0b21fYXBwZWFyYW5jZScsXG5cdFx0XHRcdFx0J3ZhbHVlJzogWyAnY29sb3InLCAnaW1hZ2UnIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRdLFxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0J2hhbmRsZXInOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLXVzZV9jaG9zZW4gaW5wdXQnLFxuXHRcdFx0J2hhbmRsZXJUeXBlJzogJ2NoZWNrYm94Jyxcblx0XHRcdCdldmVudCc6ICdjaGFuZ2UnLFxuXHRcdFx0J2RlcGVuZGFudCc6IFtcblx0XHRcdFx0e1xuXHRcdFx0XHRcdCdzZWxlY3Rvcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtY2hvc2VuX25vX3Jlc3VsdHNfbWVzc2FnZScsXG5cdFx0XHRcdFx0J3ZhbHVlJzogWyAnMScgXSxcblx0XHRcdFx0fSxcblx0XHRcdF0sXG5cdFx0fSxcblx0XHR7XG5cdFx0XHQnaGFuZGxlcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtaGllcmFyY2hpY2FsIGlucHV0Jyxcblx0XHRcdCdoYW5kbGVyVHlwZSc6ICdjaGVja2JveCcsXG5cdFx0XHQnZXZlbnQnOiAnY2hhbmdlJyxcblx0XHRcdCdkZXBlbmRhbnQnOiBbXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLWVuYWJsZV9oaWVyYXJjaHlfYWNjb3JkaW9uJyxcblx0XHRcdFx0XHQndmFsdWUnOiBbICcxJyBdLFxuXHRcdFx0XHR9LFxuXHRcdFx0XSxcblx0XHR9LFxuXHRcdHtcblx0XHRcdCdoYW5kbGVyJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1nZXRfb3B0aW9ucyBpbnB1dCcsXG5cdFx0XHQnaGFuZGxlclR5cGUnOiAncmFkaW8nLFxuXHRcdFx0J2V2ZW50JzogJ2NoYW5nZScsXG5cdFx0XHQnZGVwZW5kYW50JzogW1xuXHRcdFx0XHR7XG5cdFx0XHRcdFx0J3NlbGVjdG9yJzogJy5jb2x1bW4tZ3JvdXAtbWV0YV9rZXlfbWFudWFsX29wdGlvbnMnLFxuXHRcdFx0XHRcdCd2YWx1ZSc6IFsgJ21hbnVhbF9lbnRyeScgXSxcblx0XHRcdFx0fSxcblx0XHRcdF0sXG5cdFx0fSxcblx0XHR7XG5cdFx0XHQnaGFuZGxlcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtbnVtYmVyX2Rpc3BsYXlfdHlwZSBzZWxlY3QnLFxuXHRcdFx0J2hhbmRsZXJUeXBlJzogJ3NlbGVjdCcsXG5cdFx0XHQnZXZlbnQnOiAnY2hhbmdlJyxcblx0XHRcdCdkZXBlbmRhbnQnOiBbXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLW51bWJlcl9yYW5nZV9zbGlkZXJfZGlzcGxheV92YWx1ZXNfYXMnLFxuXHRcdFx0XHRcdCd2YWx1ZSc6IFsgJ3JhbmdlX3NsaWRlcicgXSxcblx0XHRcdFx0fSxcblx0XHRcdFx0e1xuXHRcdFx0XHRcdCdzZWxlY3Rvcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtbnVtYmVyX3JhbmdlX3F1ZXJ5X3R5cGUnLFxuXHRcdFx0XHRcdCd2YWx1ZSc6IFsgJ3JhbmdlX2NoZWNrYm94JywgJ3JhbmdlX211bHRpc2VsZWN0JyBdLFxuXHRcdFx0XHR9LFxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0J3NlbGVjdG9yJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1udW1iZXJfcmFuZ2Vfc2VsZWN0X2FsbF9pdGVtc19sYWJlbCcsXG5cdFx0XHRcdFx0J3ZhbHVlJzogWyAncmFuZ2VfcmFkaW8nLCAncmFuZ2Vfc2VsZWN0JyBdLFxuXHRcdFx0XHR9LFxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0J3NlbGVjdG9yJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1udW1iZXJfcmFuZ2VfdXNlX2Nob3NlbicsXG5cdFx0XHRcdFx0J3ZhbHVlJzogWyAncmFuZ2Vfc2VsZWN0JywgJ3JhbmdlX211bHRpc2VsZWN0JyBdLFxuXHRcdFx0XHR9LFxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0J3NlbGVjdG9yJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1udW1iZXJfcmFuZ2VfZW5hYmxlX211bHRpcGxlX2ZpbHRlcicsXG5cdFx0XHRcdFx0J3ZhbHVlJzogWyAncmFuZ2VfbGFiZWwnIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLW51bWJlcl9yYW5nZV9pbmxpbmVfZGlzcGxheScsXG5cdFx0XHRcdFx0J3ZhbHVlJzogWyAncmFuZ2VfbGFiZWwnIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLW51bWJlcl9yYW5nZV9zaG93X2NvdW50Jyxcblx0XHRcdFx0XHQndmFsdWUnOiBbICdyYW5nZV9jaGVja2JveCcsICdyYW5nZV9yYWRpbycsICdyYW5nZV9zZWxlY3QnLCAncmFuZ2VfbXVsdGlzZWxlY3QnLCAncmFuZ2VfbGFiZWwnIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLW51bWJlcl9yYW5nZV9oaWRlX2VtcHR5Jyxcblx0XHRcdFx0XHQndmFsdWUnOiBbICdyYW5nZV9jaGVja2JveCcsICdyYW5nZV9yYWRpbycsICdyYW5nZV9zZWxlY3QnLCAncmFuZ2VfbXVsdGlzZWxlY3QnLCAncmFuZ2VfbGFiZWwnIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLm51bWJlci1kZWNpbWFsLWZpZWxkcycsXG5cdFx0XHRcdFx0J3ZhbHVlJzogWyAncmFuZ2Vfc2xpZGVyJywgJ3JhbmdlX2NoZWNrYm94JywgJ3JhbmdlX3JhZGlvJywgJ3JhbmdlX3NlbGVjdCcsICdyYW5nZV9tdWx0aXNlbGVjdCcsICdyYW5nZV9sYWJlbCcgXSxcblx0XHRcdFx0fSxcblx0XHRcdF0sXG5cdFx0fSxcblx0XHR7XG5cdFx0XHQnaGFuZGxlcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtbnVtYmVyX3JhbmdlX3VzZV9jaG9zZW4gaW5wdXQnLFxuXHRcdFx0J2hhbmRsZXJUeXBlJzogJ2NoZWNrYm94Jyxcblx0XHRcdCdldmVudCc6ICdjaGFuZ2UnLFxuXHRcdFx0J2RlcGVuZGFudCc6IFtcblx0XHRcdFx0e1xuXHRcdFx0XHRcdCdzZWxlY3Rvcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtbnVtYmVyX3JhbmdlX2Nob3Nlbl9ub19yZXN1bHRzX21lc3NhZ2UnLFxuXHRcdFx0XHRcdCd2YWx1ZSc6IFsgJzEnIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRdLFxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0J2hhbmRsZXInOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLW51bWJlcl9nZXRfb3B0aW9ucyBpbnB1dCcsXG5cdFx0XHQnaGFuZGxlclR5cGUnOiAncmFkaW8nLFxuXHRcdFx0J2V2ZW50JzogJ2NoYW5nZScsXG5cdFx0XHQnZGVwZW5kYW50JzogW1xuXHRcdFx0XHR7XG5cdFx0XHRcdFx0J3NlbGVjdG9yJzogJy5udW1iZXItYXV0b21hdGljLW9wdGlvbnMnLFxuXHRcdFx0XHRcdCd2YWx1ZSc6IFsgJ2F1dG9tYXRpY2FsbHknIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLm51bWJlci1tYW51YWwtb3B0aW9ucy10YWJsZScsXG5cdFx0XHRcdFx0J3ZhbHVlJzogWyAnbWFudWFsX2VudHJ5JyBdLFxuXHRcdFx0XHR9LFxuXHRcdFx0XSxcblx0XHR9LFxuXHRcdHtcblx0XHRcdCdoYW5kbGVyJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1kYXRlX2Rpc3BsYXlfdHlwZSBzZWxlY3QnLFxuXHRcdFx0J2hhbmRsZXJUeXBlJzogJ3NlbGVjdCcsXG5cdFx0XHQnZXZlbnQnOiAnY2hhbmdlJyxcblx0XHRcdCdkZXBlbmRhbnQnOiBbXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLmRhdGUtdG8tdWktb3B0aW9ucycsXG5cdFx0XHRcdFx0J3ZhbHVlJzogWyAnaW5wdXRfZGF0ZV9yYW5nZScgXSxcblx0XHRcdFx0fSxcblx0XHRcdFx0e1xuXHRcdFx0XHRcdCdzZWxlY3Rvcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtZGF0ZV9mb3JtYXQnLFxuXHRcdFx0XHRcdCd2YWx1ZSc6IFsgJ2lucHV0X2RhdGUnLCAnaW5wdXRfZGF0ZV9yYW5nZScgXSxcblx0XHRcdFx0fSxcblx0XHRcdFx0e1xuXHRcdFx0XHRcdCdzZWxlY3Rvcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtdGltZV9wZXJpb2RfcXVlcnlfdHlwZScsXG5cdFx0XHRcdFx0J3ZhbHVlJzogWyAndGltZV9wZXJpb2RfY2hlY2tib3gnLCAndGltZV9wZXJpb2RfbXVsdGlzZWxlY3QnIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLXRpbWVfcGVyaW9kX3NlbGVjdF9hbGxfaXRlbXNfbGFiZWwnLFxuXHRcdFx0XHRcdCd2YWx1ZSc6IFsgJ3RpbWVfcGVyaW9kX3JhZGlvJywgJ3RpbWVfcGVyaW9kX3NlbGVjdCcgXSxcblx0XHRcdFx0fSxcblx0XHRcdFx0e1xuXHRcdFx0XHRcdCdzZWxlY3Rvcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtdGltZV9wZXJpb2RfdXNlX2Nob3NlbicsXG5cdFx0XHRcdFx0J3ZhbHVlJzogWyAndGltZV9wZXJpb2Rfc2VsZWN0JywgJ3RpbWVfcGVyaW9kX211bHRpc2VsZWN0JyBdLFxuXHRcdFx0XHR9LFxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0J3NlbGVjdG9yJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC10aW1lX3BlcmlvZF9lbmFibGVfbXVsdGlwbGVfZmlsdGVyJyxcblx0XHRcdFx0XHQndmFsdWUnOiBbICd0aW1lX3BlcmlvZF9sYWJlbCcgXSxcblx0XHRcdFx0fSxcblx0XHRcdFx0e1xuXHRcdFx0XHRcdCdzZWxlY3Rvcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtdGltZV9wZXJpb2RfaW5saW5lX2Rpc3BsYXknLFxuXHRcdFx0XHRcdCd2YWx1ZSc6IFsgJ3RpbWVfcGVyaW9kX2xhYmVsJyBdLFxuXHRcdFx0XHR9LFxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0J3NlbGVjdG9yJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC10aW1lX3BlcmlvZF9zaG93X2NvdW50Jyxcblx0XHRcdFx0XHQndmFsdWUnOiBbICd0aW1lX3BlcmlvZF9jaGVja2JveCcsICd0aW1lX3BlcmlvZF9yYWRpbycsICd0aW1lX3BlcmlvZF9zZWxlY3QnLCAndGltZV9wZXJpb2RfbXVsdGlzZWxlY3QnLCAndGltZV9wZXJpb2RfbGFiZWwnIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLXRpbWVfcGVyaW9kX2hpZGVfZW1wdHknLFxuXHRcdFx0XHRcdCd2YWx1ZSc6IFsgJ3RpbWVfcGVyaW9kX2NoZWNrYm94JywgJ3RpbWVfcGVyaW9kX3JhZGlvJywgJ3RpbWVfcGVyaW9kX3NlbGVjdCcsICd0aW1lX3BlcmlvZF9tdWx0aXNlbGVjdCcsICd0aW1lX3BlcmlvZF9sYWJlbCcgXSxcblx0XHRcdFx0fSxcblx0XHRcdF0sXG5cdFx0fSxcblx0XHR7XG5cdFx0XHQnaGFuZGxlcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtdGltZV9wZXJpb2RfdXNlX2Nob3NlbiBpbnB1dCcsXG5cdFx0XHQnaGFuZGxlclR5cGUnOiAnY2hlY2tib3gnLFxuXHRcdFx0J2V2ZW50JzogJ2NoYW5nZScsXG5cdFx0XHQnZGVwZW5kYW50JzogW1xuXHRcdFx0XHR7XG5cdFx0XHRcdFx0J3NlbGVjdG9yJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC10aW1lX3BlcmlvZF9jaG9zZW5fbm9fcmVzdWx0c19tZXNzYWdlJyxcblx0XHRcdFx0XHQndmFsdWUnOiBbICcxJyBdLFxuXHRcdFx0XHR9LFxuXHRcdFx0XSxcblx0XHR9LFxuXHRcdHtcblx0XHRcdCdoYW5kbGVyJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1saW1pdF90ZXJtcyBzZWxlY3QnLFxuXHRcdFx0J2hhbmRsZXJUeXBlJzogJ3NlbGVjdCcsXG5cdFx0XHQnZXZlbnQnOiAnY2hhbmdlJyxcblx0XHRcdCdkZXBlbmRhbnQnOiBbXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLXBhcmVudF90ZXJtJyxcblx0XHRcdFx0XHQndmFsdWUnOiBbICdjaGlsZCcgXSxcblx0XHRcdFx0fSxcblx0XHRcdFx0e1xuXHRcdFx0XHRcdCdzZWxlY3Rvcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtbGltaXRfdGVybXNfYnlfaWQnLFxuXHRcdFx0XHRcdCd2YWx1ZSc6IFsgJ2luY2x1ZGUnLCAnZXhjbHVkZScgXSxcblx0XHRcdFx0fSxcblx0XHRcdF0sXG5cdFx0fSxcblx0XHR7XG5cdFx0XHQnaGFuZGxlcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtZW5hYmxlX3NvZnRfbGltaXQgaW5wdXQnLFxuXHRcdFx0J2hhbmRsZXJUeXBlJzogJ3JhZGlvJyxcblx0XHRcdCdldmVudCc6ICdjaGFuZ2UnLFxuXHRcdFx0J2RlcGVuZGFudCc6IFtcblx0XHRcdFx0e1xuXHRcdFx0XHRcdCdzZWxlY3Rvcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtc29mdF9saW1pdCcsXG5cdFx0XHRcdFx0J3ZhbHVlJzogWyAnZW5hYmxlJyBdLFxuXHRcdFx0XHR9LFxuXHRcdFx0XSxcblx0XHR9LFxuXHRcdHtcblx0XHRcdCdoYW5kbGVyJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1jdXN0b20tdGF4b25vbXkgc2VsZWN0Jyxcblx0XHRcdCdoYW5kbGVyVHlwZSc6ICdzZWxlY3QnLFxuXHRcdFx0J2V2ZW50JzogJ2NoYW5nZScsXG5cdFx0fSxcblx0XHR7XG5cdFx0XHQnaGFuZGxlcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtcG9zdF9wcm9wZXJ0eSBzZWxlY3QnLFxuXHRcdFx0J2hhbmRsZXJUeXBlJzogJ3NlbGVjdCcsXG5cdFx0XHQnZXZlbnQnOiAnY2hhbmdlJyxcblx0XHR9LFxuXHRcdHtcblx0XHRcdCdoYW5kbGVyJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1saW1pdF9vcHRpb25zIHNlbGVjdCcsXG5cdFx0XHQnaGFuZGxlclR5cGUnOiAnc2VsZWN0Jyxcblx0XHRcdCdldmVudCc6ICdjaGFuZ2UnLFxuXHRcdFx0J2RlcGVuZGFudCc6IFtcblx0XHRcdFx0e1xuXHRcdFx0XHRcdCdzZWxlY3Rvcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtbGltaXRfdmFsdWVzX2J5X2lkJyxcblx0XHRcdFx0XHQndmFsdWUnOiBbICdpbmNsdWRlJywgJ2V4Y2x1ZGUnIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRdLFxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0J2hhbmRsZXInOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLWVuYWJsZV9hY2NvcmRpb24gaW5wdXQnLFxuXHRcdFx0J2hhbmRsZXJUeXBlJzogJ3JhZGlvJyxcblx0XHRcdCdldmVudCc6ICdjaGFuZ2UnLFxuXHRcdFx0J2RlcGVuZGFudCc6IFtcblx0XHRcdFx0e1xuXHRcdFx0XHRcdCdzZWxlY3Rvcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtYWNjb3JkaW9uX2RlZmF1bHRfc3RhdGUnLFxuXHRcdFx0XHRcdCd2YWx1ZSc6IFsgJ3llcycgXSxcblx0XHRcdFx0fSxcblx0XHRcdF0sXG5cdFx0fSxcblx0XHR7XG5cdFx0XHQnaGFuZGxlcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtZW5hYmxlX211bHRpcGxlX2ZpbHRlciBpbnB1dCcsXG5cdFx0XHQnaGFuZGxlclR5cGUnOiAnY2hlY2tib3gnLFxuXHRcdFx0J2V2ZW50JzogJ2NoYW5nZScsXG5cdFx0fSxcblx0XHR7XG5cdFx0XHQnaGFuZGxlcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtdXNlX2NhdGVnb3J5X2ltYWdlcyBpbnB1dCcsXG5cdFx0XHQnaGFuZGxlclR5cGUnOiAnY2hlY2tib3gnLFxuXHRcdFx0J2V2ZW50JzogJ2NoYW5nZScsXG5cdFx0fSxcblx0XHR7XG5cdFx0XHQnaGFuZGxlcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtbnVtYmVyX3JhbmdlX2VuYWJsZV9tdWx0aXBsZV9maWx0ZXIgaW5wdXQnLFxuXHRcdFx0J2hhbmRsZXJUeXBlJzogJ2NoZWNrYm94Jyxcblx0XHRcdCdldmVudCc6ICdjaGFuZ2UnLFxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0J2hhbmRsZXInOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLXRpbWVfcGVyaW9kX2VuYWJsZV9tdWx0aXBsZV9maWx0ZXIgaW5wdXQnLFxuXHRcdFx0J2hhbmRsZXJUeXBlJzogJ2NoZWNrYm94Jyxcblx0XHRcdCdldmVudCc6ICdjaGFuZ2UnLFxuXHRcdH0sXG5cdF07XG5cblx0ZnVuY3Rpb24gX2hhbmRsZVRvZ2dsZVJlcXVlc3QoIGRhdGEsIGN1cnJlbnRTZWxlY3RvciwgdmFsdWUgKSB7XG5cdFx0Y29uc3QgJGZpZWxkICAgICAgPSBjdXJyZW50U2VsZWN0b3IuY2xvc2VzdCggJy53Y2FwZi1mb3JtLWZpZWxkJyApO1xuXHRcdGNvbnN0IGhhbmRsZXIgICAgID0gZGF0YVsgJ2hhbmRsZXInIF07XG5cdFx0Y29uc3QgaGFuZGxlclR5cGUgPSBkYXRhWyAnaGFuZGxlclR5cGUnIF07XG5cdFx0Y29uc3QgZGVwZW5kYW50ICAgPSBkYXRhWyAnZGVwZW5kYW50JyBdO1xuXG5cdFx0bGV0IF92YWx1ZSA9IHZhbHVlO1xuXG5cdFx0aWYgKCAnY2hlY2tib3gnID09PSBoYW5kbGVyVHlwZSApIHtcblx0XHRcdF92YWx1ZSA9IGN1cnJlbnRTZWxlY3Rvci5pcyggJzpjaGVja2VkJyApID8gJzEnIDogJzAnO1xuXHRcdH1cblxuXHRcdGlmICggJ3JhZGlvJyA9PT0gaGFuZGxlclR5cGUgKSB7XG5cdFx0XHRfdmFsdWUgPSAkZmllbGQuZmluZCggaGFuZGxlciArICc6Y2hlY2tlZCcgKS52YWwoKTtcblx0XHR9XG5cblx0XHQkLmVhY2goIGRlcGVuZGFudCwgZnVuY3Rpb24oIGlkLCBkICkge1xuXHRcdFx0Y29uc3QgJHNlbGVjdG9yICAgPSAkZmllbGQuZmluZCggZFsgJ3NlbGVjdG9yJyBdICk7XG5cdFx0XHRjb25zdCB2YWxpZFZhbHVlcyA9IGRbICd2YWx1ZScgXTtcblxuXHRcdFx0aWYgKCB2YWxpZFZhbHVlcy5pbmNsdWRlcyggX3ZhbHVlICkgKSB7XG5cdFx0XHRcdCRzZWxlY3Rvci5zaG93KCk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHQkc2VsZWN0b3IuaGlkZSgpO1xuXHRcdFx0fVxuXHRcdH0gKTtcblxuXHRcdCRzZWFyY2hGb3JtLnRyaWdnZXIoICdhZnRlcl90b2dnbGVfcmVxdWVzdCcsIFsgaGFuZGxlciwgX3ZhbHVlLCAkZmllbGQgXSApO1xuXHR9XG5cblx0ZnVuY3Rpb24gaGFuZGxlVG9nZ2xlUmVxdWVzdCggZGF0YSwgY3VycmVudFNlbGVjdG9yLCB2YWx1ZSApIHtcblx0XHRpZiAoIG51bGwgPT09IGN1cnJlbnRTZWxlY3RvciApIHtcblx0XHRcdGNvbnN0IGhhbmRsZXIgID0gZGF0YVsgJ2hhbmRsZXInIF07XG5cdFx0XHRjb25zdCAkaGFuZGxlciA9ICQoIGhhbmRsZXIgKTtcblxuXHRcdFx0JC5lYWNoKCAkaGFuZGxlciwgZnVuY3Rpb24oKSB7XG5cdFx0XHRcdGNvbnN0IF90aGlzICA9ICQoIHRoaXMgKTtcblx0XHRcdFx0Y29uc3QgX3ZhbHVlID0gX3RoaXMudmFsKCk7XG5cdFx0XHRcdF9oYW5kbGVUb2dnbGVSZXF1ZXN0KCBkYXRhLCBfdGhpcywgX3ZhbHVlICk7XG5cdFx0XHR9ICk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdF9oYW5kbGVUb2dnbGVSZXF1ZXN0KCBkYXRhLCBjdXJyZW50U2VsZWN0b3IsIHZhbHVlICk7XG5cdFx0fVxuXHR9XG5cblx0ZnVuY3Rpb24gc2V0dXBTZWFyY2hGb3JtKCBpbml0YWwgPSBmYWxzZSApIHtcblx0XHQkLmVhY2goIGRlcGVuZGFudERhdGEsIGZ1bmN0aW9uKCBpLCBkYXRhICkge1xuXHRcdFx0Y29uc3QgaGFuZGxlciA9IGRhdGFbICdoYW5kbGVyJyBdO1xuXHRcdFx0Y29uc3QgZXZlbnQgICA9IGRhdGFbICdldmVudCcgXTtcblxuXHRcdFx0aGFuZGxlVG9nZ2xlUmVxdWVzdCggZGF0YSwgbnVsbCwgbnVsbCApO1xuXG5cdFx0XHRpZiAoIGluaXRhbCApIHtcblx0XHRcdFx0JHNlYXJjaEZvcm0ub24oIGV2ZW50LCBoYW5kbGVyLCBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHRjb25zdCBfdGhpcyAgPSAkKCB0aGlzICk7XG5cdFx0XHRcdFx0Y29uc3QgX3ZhbHVlID0gJCggdGhpcyApLnZhbCgpO1xuXHRcdFx0XHRcdGhhbmRsZVRvZ2dsZVJlcXVlc3QoIGRhdGEsIF90aGlzLCBfdmFsdWUgKTtcblx0XHRcdFx0fSApO1xuXHRcdFx0fVxuXHRcdH0gKTtcblx0fVxuXG5cdHNldHVwU2VhcmNoRm9ybSggdHJ1ZSApO1xuXG5cdCRzZWFyY2hGb3JtLm9uKCAnZmllbGRfYWRkZWQnLCBmdW5jdGlvbigpIHtcblx0XHQvLyBUb2dnbGUgdGhlIHZpc2liaWxpdHkgb2Ygc3ViZmllbGRzLlxuXHRcdHNldHVwU2VhcmNoRm9ybSgpO1xuXHR9ICk7XG5cbn0gKTtcbiJdfQ==
