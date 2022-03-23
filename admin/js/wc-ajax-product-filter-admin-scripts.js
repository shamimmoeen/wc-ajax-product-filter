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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImN1c3RvbS1hcHBlYXJhbmNlLWZpZWxkcy5qcyIsImRpc3BsYXktdHlwZS1maWVsZHMuanMiLCJtYW51YWwtb3B0aW9ucy10YWJsZS5qcyIsIm51bWJlci11aS1vcHRpb25zLmpzIiwicHJvZHVjdC1zdGF0dXMtdGFibGUuanMiLCJzZWFyY2gtZm9ybS5qcyIsInRvZ2dsZVZpc2liaWxpdHkuanMiXSwibmFtZXMiOlsialF1ZXJ5IiwiZG9jdW1lbnQiLCJyZWFkeSIsIiQiLCIkc2VhcmNoRm9ybSIsIm9uIiwiZSIsImhhbmRsZXIiLCJ2YWx1ZSIsIiRmaWVsZCIsIiRxdWVyeVR5cGUiLCJmaW5kIiwidmFsaWREaXNwbGF5VHlwZXMiLCJpbmNsdWRlcyIsIiRtdWx0aXBsZUZpbHRlciIsImlzIiwic2hvdyIsImhpZGUiLCIkZGlzcGxheVR5cGUiLCJkaXNwbGF5VHlwZSIsInZhbCIsIiRub1Jlc3VsdHMiLCIkYWxsSXRlbXNMYWJlbCIsInVzZUNob3NlbiIsImluaXRNYW51YWxPcHRpb25zVGFibGUiLCJ0YWJsZUlkZW50aWZpZXIiLCJ2YWx1ZUlkZW50aWZpZXIiLCJyb3dUZW1wbGF0ZUlkIiwicm93RGVmYXVsdE9wdGlvbnMiLCJmaWVsZElkZW50aWZpZXIiLCJyb3dzSWRlbnRpZmllciIsInJvd0lkZW50aWZpZXIiLCJpbml0U29ydGFibGVUYWJsZSIsIiRzZWxlY3RvciIsInNvcnRhYmxlIiwib3BhY2l0eSIsInJldmVydCIsImN1cnNvciIsImF4aXMiLCJoYW5kbGUiLCJwbGFjZWhvbGRlciIsInVwZGF0ZSIsInRhcmdldCIsImNsb3Nlc3QiLCJ0cmlnZ2VyT3B0aW9uc0NoYW5nZSIsImRpc2FibGVTZWxlY3Rpb24iLCJ0YWJsZVJvd3NJZGVudGlmaWVyIiwidWkiLCJpdGVtIiwiJHZhbHVlSG9sZGVyIiwiJHJvd3MiLCJfcm93cyIsImVhY2giLCJpIiwiX2l0ZW0iLCIkaXRlbSIsIm9iaiIsImZpZWxkSW5kZXgiLCJmaWVsZCIsIm5hbWUiLCJhdHRyIiwicHVzaCIsInJhd1ZhbHVlcyIsImVuY29kZVVSSUNvbXBvbmVudCIsIkpTT04iLCJzdHJpbmdpZnkiLCJ0cmlnZ2VyUmVtb3ZlT3B0aW9uIiwiJG9wdGlvbnNUYWJsZSIsInRhYmxlUm93cyIsImNoaWxkcmVuIiwibGVuZ3RoIiwicmVtb3ZlQ2xhc3MiLCJyZW1vdmVCdG5JZGVudGlmaWVyIiwicmVtb3ZlIiwiY2xlYXJPcHRpb25zQnRuSWRlbnRpZmllciIsImVtcHR5IiwiYWRkT3B0aW9uQnRuSWRlbnRpZmllciIsInRlbXBsYXRlIiwid3AiLCJyZW5kZXJlZCIsIiR0YWJsZSIsImFwcGVuZCIsInRyaWdnZXIiLCJoYXNDbGFzcyIsImFkZENsYXNzIiwidGV4dEZpZWxkc0lkZW50aWZpZXIiLCJzZWxlY3RGaWVsZHNJZGVudGlmaWVyIiwidGFibGVJZCIsInRvZ2dsZU51bWJlck1pblZhbHVlRmllbGQiLCIkZWxtIiwiJHRleHRGaWVsZCIsInJlbW92ZUF0dHIiLCIkdGhpcyIsInRvZ2dsZU51bWJlck1heFZhbHVlRmllbGQiLCJ0b3RhbEZpZWxkSW5zdGFuY2VzIiwic2VhcmNoRm9ybSIsInJlbW92ZVBsYWNlaG9sZGVyIiwidW5pcXVlSWQiLCJlbGVtZW50cyIsImVsZW1lbnQiLCJvbGRWYWx1ZSIsIm5ld1ZhbHVlIiwicmVwbGFjZSIsImluc2VydEZpZWxkU3ViRmllbGRzIiwidHlwZSIsInBhcnNlSW50IiwiZmllbGRUeXBlIiwid3JhcHBlciIsInByZXBlbmQiLCJ1cGRhdGVGaWVsZHNQb3NpdGlvbiIsImlucHV0cyIsIm5iRWxlbXMiLCJpZHgiLCJtYWtlRmllbGRSZWFkeSIsInRvZ2dsZUJ0biIsImlkZW50aWZpZXIiLCJjb250YWluZXIiLCJjYW5jZWwiLCJpdGVtcyIsImNvbm5lY3RXaXRoIiwic3RvcCIsInN0YXJ0IiwiYXBwZW5kVG8iLCJwYXJlbnQiLCJvbkRyYWdTdGFydCIsIm9uRHJhZ1N0b3AiLCJkcmFnZ2FibGUiLCJjb25uZWN0VG9Tb3J0YWJsZSIsImhlbHBlciIsInRvZ2dsZUZpZWxkIiwid2lkZ2V0IiwiaW5zaWRlIiwiaXNFeHBhbmQiLCJ0b2dnbGVFeHBhbmQiLCJzbGlkZVRvZ2dsZSIsInRvZ2dsZUNsYXNzIiwiZm9jdXNGaWVsZCIsImNsYXNzTGlzdCIsImNvbnRhaW5zIiwiYWN0aW9uIiwiZm9jdXMiLCJyZW1vdmVGaWVsZCIsInNsaWRlVXAiLCJpbml0aWFsRm9ybVN0YXRlIiwic2VyaWFsaXplQXJyYXkiLCJzaG93TWVzc2FnZSIsIm1lc3NhZ2UiLCJodG1sIiwic2xpZGVEb3duIiwic2V0VGltZW91dCIsInNhdmVGb3JtIiwiYnV0dG9uIiwiZm9ybURhdGEiLCJva0NhbGxiYWNrIiwiZXJyQ2FsbGJhY2siLCJhamF4IiwicG9zdCIsImRvbmUiLCJmYWlsIiwiJGZpZWxkcyIsImRlcGVuZGFudERhdGEiLCJfaGFuZGxlVG9nZ2xlUmVxdWVzdCIsImRhdGEiLCJjdXJyZW50U2VsZWN0b3IiLCJoYW5kbGVyVHlwZSIsImRlcGVuZGFudCIsIl92YWx1ZSIsImlkIiwiZCIsInZhbGlkVmFsdWVzIiwiaGFuZGxlVG9nZ2xlUmVxdWVzdCIsIiRoYW5kbGVyIiwiX3RoaXMiLCJzZXR1cFNlYXJjaEZvcm0iLCJpbml0YWwiLCJldmVudCJdLCJtYXBwaW5ncyI6Ijs7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUFBLE1BQU0sQ0FBRUMsUUFBRixDQUFOLENBQW1CQyxLQUFuQixDQUEwQixVQUFVQyxDQUFWLEVBQWM7QUFFdkMsTUFBTUMsV0FBVyxHQUFHRCxDQUFDLENBQUUsY0FBRixDQUFyQjtBQUVBQyxFQUFBQSxXQUFXLENBQUNDLEVBQVosQ0FBZ0Isc0JBQWhCLEVBQXdDLFVBQVVDLENBQVYsRUFBYUMsT0FBYixFQUFzQkMsS0FBdEIsRUFBNkJDLE1BQTdCLEVBQXNDO0FBQzdFLFFBQUssZ0RBQWdERixPQUFyRCxFQUErRDtBQUM5RCxVQUFNRyxVQUFVLEdBQVVELE1BQU0sQ0FBQ0UsSUFBUCxDQUFhLGtDQUFiLENBQTFCO0FBQ0Es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QVcsQ0FBQ0MsRUFBWixDQUFnQixhQUFoQixFQUErQixZQUFXO0FBQ3pDO0FBQ0F3SyxJQUFBQSxlQUFlO0FBQ2YsR0FIRDtBQUtBLENBaFhEIiwiZmlsZSI6IndjLWFqYXgtcHJvZHVjdC1maWx0ZXItYWRtaW4tc2NyaXB0cy5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogRGlzcGxheSB0eXBlIGZpZWxkcy5cbiAqXG4gKiBAc2luY2UgICAgICAzLjAuMFxuICogQHBhY2thZ2UgICAgd2MtYWpheC1wcm9kdWN0LWZpbHRlclxuICogQHN1YnBhY2thZ2Ugd2MtYWpheC1wcm9kdWN0LWZpbHRlci9hZG1pbi9zcmMvanNcbiAqIEBhdXRob3IgICAgIE1haW51bCBIYXNzYW4gTWFpblxuICovXG5cbmpRdWVyeSggZG9jdW1lbnQgKS5yZWFkeSggZnVuY3Rpb24oICQgKSB7XG5cblx0Y29uc3QgJHNlYXJjaEZvcm0gPSAkKCAnI3NlYXJjaC1mb3JtJyApO1xuXG5cdCRzZWFyY2hGb3JtLm9uKCAnYWZ0ZXJfdG9nZ2xlX3JlcXVlc3QnLCBmdW5jdGlvbiggZSwgaGFuZGxlciwgdmFsdWUsICRmaWVsZCApIHtcblx0XHRpZiAoICcud2NhcGYtZm9ybS1zdWItZmllbGQtZGlzcGxheV90eXBlIHNlbGVjdCcgPT09IGhhbmRsZXIgKSB7XG5cdFx0XHRjb25zdCAkcXVlcnlUeXBlICAgICAgICA9ICRmaWVsZC5maW5kKCAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLXF1ZXJ5X3R5cGUnICk7XG5cdFx0XHRjb25zdCB2YWxpZERpc3BsYXlUeXBlcyA9IFsgJ2xhYmVsJywgJ2NvbG9yJywgJ2ltYWdlJyBdO1xuXG5cdFx0XHRpZiAoIHZhbGlkRGlzcGxheVR5cGVzLmluY2x1ZGVzKCB2YWx1ZSApICkge1xuXHRcdFx0XHRjb25zdCAkbXVsdGlwbGVGaWx0ZXIgPSAkZmllbGQuZmluZCggJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1lbmFibGVfbXVsdGlwbGVfZmlsdGVyIGlucHV0JyApO1xuXG5cdFx0XHRcdGlmICggJG11bHRpcGxlRmlsdGVyLmlzKCAnOmNoZWNrZWQnICkgKSB7XG5cdFx0XHRcdFx0JHF1ZXJ5VHlwZS5zaG93KCk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0JHF1ZXJ5VHlwZS5oaWRlKCk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cdH0gKTtcblxuXHQkc2VhcmNoRm9ybS5vbiggJ2FmdGVyX3RvZ2dsZV9yZXF1ZXN0JywgZnVuY3Rpb24oIGUsIGhhbmRsZXIsIHZhbHVlLCAkZmllbGQgKSB7XG5cdFx0aWYgKCAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLWVuYWJsZV9tdWx0aXBsZV9maWx0ZXIgaW5wdXQnID09PSBoYW5kbGVyICkge1xuXHRcdFx0Y29uc3QgJHF1ZXJ5VHlwZSAgICAgICAgPSAkZmllbGQuZmluZCggJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1xdWVyeV90eXBlJyApO1xuXHRcdFx0Y29uc3QgJGRpc3BsYXlUeXBlICAgICAgPSAkZmllbGQuZmluZCggJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1kaXNwbGF5X3R5cGUgc2VsZWN0JyApO1xuXHRcdFx0Y29uc3QgZGlzcGxheVR5cGUgICAgICAgPSAkZGlzcGxheVR5cGUudmFsKCk7XG5cdFx0XHRjb25zdCB2YWxpZERpc3BsYXlUeXBlcyA9IFsgJ2xhYmVsJywgJ2NvbG9yJywgJ2ltYWdlJyBdO1xuXG5cdFx0XHRpZiAoIHZhbGlkRGlzcGxheVR5cGVzLmluY2x1ZGVzKCBkaXNwbGF5VHlwZSApICkge1xuXHRcdFx0XHRpZiAoICcxJyA9PT0gdmFsdWUgKSB7XG5cdFx0XHRcdFx0JHF1ZXJ5VHlwZS5zaG93KCk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0JHF1ZXJ5VHlwZS5oaWRlKCk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cdH0gKTtcblxufSApO1xuIiwiLyoqXG4gKiBEaXNwbGF5IHR5cGUgZmllbGRzLlxuICpcbiAqIEBzaW5jZSAgICAgIDMuMC4wXG4gKiBAcGFja2FnZSAgICB3Yy1hamF4LXByb2R1Y3QtZmlsdGVyXG4gKiBAc3VicGFja2FnZSB3Yy1hamF4LXByb2R1Y3QtZmlsdGVyL2FkbWluL3NyYy9qc1xuICogQGF1dGhvciAgICAgTWFpbnVsIEhhc3NhbiBNYWluXG4gKi9cblxualF1ZXJ5KCBkb2N1bWVudCApLnJlYWR5KCBmdW5jdGlvbiggJCApIHtcblxuXHRjb25zdCAkc2VhcmNoRm9ybSA9ICQoICcjc2VhcmNoLWZvcm0nICk7XG5cblx0Ly8gT3ZlcnJpZGUgbm8tcmVzdWx0cy1tZXNzYWdlLCBhbGwtaXRlbXMtbGFiZWwgZmllbGQncyB0b2dnbGUgdmlzaWJpbGl0eSB3aGVuIHRleHQgZGlzcGxheSB0eXBlIGlzIGNoYW5nZWQuXG5cdCRzZWFyY2hGb3JtLm9uKCAnYWZ0ZXJfdG9nZ2xlX3JlcXVlc3QnLCBmdW5jdGlvbiggZSwgaGFuZGxlciwgdmFsdWUsICRmaWVsZCApIHtcblx0XHRpZiAoICcud2NhcGYtZm9ybS1zdWItZmllbGQtZGlzcGxheV90eXBlIHNlbGVjdCcgPT09IGhhbmRsZXIgKSB7XG5cdFx0XHRjb25zdCAkbm9SZXN1bHRzICAgICA9ICRmaWVsZC5maW5kKCAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLWNob3Nlbl9ub19yZXN1bHRzX21lc3NhZ2UnICk7XG5cdFx0XHRjb25zdCAkYWxsSXRlbXNMYWJlbCA9ICRmaWVsZC5maW5kKCAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLWFsbF9pdGVtc19sYWJlbCcgKTtcblx0XHRcdGNvbnN0IHVzZUNob3NlbiAgICAgID0gJGZpZWxkLmZpbmQoICcud2NhcGYtZm9ybS1zdWItZmllbGQtdXNlX2Nob3NlbiBpbnB1dCcgKS5pcyggJzpjaGVja2VkJyApO1xuXG5cdFx0XHRpZiAoIHVzZUNob3NlbiAmJiAoICdzZWxlY3QnID09PSB2YWx1ZSB8fCAnbXVsdGktc2VsZWN0JyA9PT0gdmFsdWUgKSApIHtcblx0XHRcdFx0JG5vUmVzdWx0cy5zaG93KCk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHQkbm9SZXN1bHRzLmhpZGUoKTtcblx0XHRcdH1cblxuXHRcdFx0aWYgKCAoICdyYWRpbycgPT09IHZhbHVlIHx8ICdzZWxlY3QnID09PSB2YWx1ZSApIHx8ICggJ211bHRpLXNlbGVjdCcgPT09IHZhbHVlICYmIHVzZUNob3NlbiApICkge1xuXHRcdFx0XHQkYWxsSXRlbXNMYWJlbC5zaG93KCk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHQkYWxsSXRlbXNMYWJlbC5oaWRlKCk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9ICk7XG5cblx0Ly8gT3ZlcnJpZGUgbm8tcmVzdWx0cy1tZXNzYWdlLCBhbGwtaXRlbXMtbGFiZWwgZmllbGQncyB0b2dnbGUgdmlzaWJpbGl0eSB3aGVuIHRleHQgdXNlIGNob3NlbiBpcyBjaGFuZ2VkLlxuXHQkc2VhcmNoRm9ybS5vbiggJ2FmdGVyX3RvZ2dsZV9yZXF1ZXN0JywgZnVuY3Rpb24oIGUsIGhhbmRsZXIsIHZhbHVlLCAkZmllbGQgKSB7XG5cdFx0aWYgKCAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLXVzZV9jaG9zZW4gaW5wdXQnID09PSBoYW5kbGVyICkge1xuXHRcdFx0Y29uc3QgJG5vUmVzdWx0cyAgICAgPSAkZmllbGQuZmluZCggJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1jaG9zZW5fbm9fcmVzdWx0c19tZXNzYWdlJyApO1xuXHRcdFx0Y29uc3QgJGFsbEl0ZW1zTGFiZWwgPSAkZmllbGQuZmluZCggJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1hbGxfaXRlbXNfbGFiZWwnICk7XG5cdFx0XHRjb25zdCBkaXNwbGF5VHlwZSAgICA9ICRmaWVsZC5maW5kKCAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLWRpc3BsYXlfdHlwZSBzZWxlY3QnICkudmFsKCk7XG5cblx0XHRcdGlmICggJzEnID09PSB2YWx1ZSAmJiAoICdzZWxlY3QnID09PSBkaXNwbGF5VHlwZSB8fCAnbXVsdGktc2VsZWN0JyA9PT0gZGlzcGxheVR5cGUgKSApIHtcblx0XHRcdFx0JG5vUmVzdWx0cy5zaG93KCk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHQkbm9SZXN1bHRzLmhpZGUoKTtcblx0XHRcdH1cblxuXHRcdFx0aWYgKFxuXHRcdFx0XHQoICcxJyA9PT0gdmFsdWUgJiYgJ211bHRpLXNlbGVjdCcgPT09IGRpc3BsYXlUeXBlIClcblx0XHRcdFx0fHwgKCAncmFkaW8nID09PSBkaXNwbGF5VHlwZSB8fCAnc2VsZWN0JyA9PT0gZGlzcGxheVR5cGUgKVxuXHRcdFx0KSB7XG5cdFx0XHRcdCRhbGxJdGVtc0xhYmVsLnNob3coKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdCRhbGxJdGVtc0xhYmVsLmhpZGUoKTtcblx0XHRcdH1cblx0XHR9XG5cdH0gKTtcblxufSApO1xuIiwiLyoqXG4gKiBNYW51YWwgT3B0aW9ucycgdGFibGUgZnVuY3Rpb24uXG4gKlxuICogQHNpbmNlICAgICAgMy4wLjBcbiAqIEBwYWNrYWdlICAgIHdjLWFqYXgtcHJvZHVjdC1maWx0ZXJcbiAqIEBzdWJwYWNrYWdlIHdjLWFqYXgtcHJvZHVjdC1maWx0ZXIvYWRtaW4vc3JjL2pzXG4gKiBAYXV0aG9yICAgICBNYWludWwgSGFzc2FuIE1haW5cbiAqL1xuXG4vKipcbiAqIEBwYXJhbSB0YWJsZUlkZW50aWZpZXJcbiAqIEBwYXJhbSB2YWx1ZUlkZW50aWZpZXJcbiAqIEBwYXJhbSByb3dUZW1wbGF0ZUlkXG4gKiBAcGFyYW0gcm93RGVmYXVsdE9wdGlvbnNcbiAqL1xuZnVuY3Rpb24gaW5pdE1hbnVhbE9wdGlvbnNUYWJsZSggdGFibGVJZGVudGlmaWVyLCB2YWx1ZUlkZW50aWZpZXIsIHJvd1RlbXBsYXRlSWQsIHJvd0RlZmF1bHRPcHRpb25zID0ge30gKSB7XG5cdGNvbnN0ICQgPSBqUXVlcnk7XG5cblx0Y29uc3QgJHNlYXJjaEZvcm0gPSAkKCAnI3NlYXJjaC1mb3JtJyApO1xuXG5cdGNvbnN0IGZpZWxkSWRlbnRpZmllciA9ICcud2NhcGYtZm9ybS1maWVsZCc7XG5cdGNvbnN0IHJvd3NJZGVudGlmaWVyICA9ICcuZmllbGQtdGFibGUtYm9keS1yb3dzJztcblx0Y29uc3Qgcm93SWRlbnRpZmllciAgID0gJy5yb3ctaXRlbSc7XG5cblx0ZnVuY3Rpb24gaW5pdFNvcnRhYmxlVGFibGUoICRzZWxlY3RvciApIHtcblx0XHQkc2VsZWN0b3Iuc29ydGFibGUoIHtcblx0XHRcdG9wYWNpdHk6IDAuOCxcblx0XHRcdHJldmVydDogZmFsc2UsXG5cdFx0XHRjdXJzb3I6ICdtb3ZlJyxcblx0XHRcdGF4aXM6ICd5Jyxcblx0XHRcdGhhbmRsZTogJy5tb3ZlLW9wdGlvbnMtaGFuZGxlcicsXG5cdFx0XHRwbGFjZWhvbGRlcjogJ3dpZGdldC1wbGFjZWhvbGRlcicsXG5cdFx0XHR1cGRhdGU6IGZ1bmN0aW9uKCBlICkge1xuXHRcdFx0XHRjb25zdCAkZmllbGQgPSAkKCBlLnRhcmdldCApLmNsb3Nlc3QoICcud2NhcGYtZm9ybS1maWVsZCcgKTtcblxuXHRcdFx0XHR0cmlnZ2VyT3B0aW9uc0NoYW5nZSggJGZpZWxkICk7XG5cdFx0XHR9XG5cdFx0fSApLmRpc2FibGVTZWxlY3Rpb24oKTtcblx0fVxuXG5cdGNvbnN0IHRhYmxlUm93c0lkZW50aWZpZXIgPSB0YWJsZUlkZW50aWZpZXIgKyAnICcgKyByb3dzSWRlbnRpZmllcjtcblxuXHQvLyBJbml0IHRoZSBzb3J0YWJsZSB0YWJsZSBhZnRlciBwYWdlIGxvYWRzLlxuXHRpbml0U29ydGFibGVUYWJsZSggJHNlYXJjaEZvcm0uZmluZCggdGFibGVSb3dzSWRlbnRpZmllciApICk7XG5cblx0Ly8gSW5pdCB0aGUgc29ydGFibGUgdGFibGUgYWZ0ZXIgdGhlIGZpZWxkIGlzIGFkZGVkLlxuXHQkc2VhcmNoRm9ybS5vbiggJ2ZpZWxkX2FkZGVkJywgZnVuY3Rpb24oIGUsIHVpICkge1xuXHRcdGluaXRTb3J0YWJsZVRhYmxlKCAkKCB1aS5pdGVtLmZpbmQoIHRhYmxlUm93c0lkZW50aWZpZXIgKSApICk7XG5cdH0gKTtcblxuXHRmdW5jdGlvbiB0cmlnZ2VyT3B0aW9uc0NoYW5nZSggJGZpZWxkICkge1xuXHRcdGNvbnN0ICR2YWx1ZUhvbGRlciA9ICRmaWVsZC5maW5kKCB2YWx1ZUlkZW50aWZpZXIgKTtcblx0XHRjb25zdCAkcm93cyAgICAgICAgPSAkZmllbGQuZmluZCggdGFibGVSb3dzSWRlbnRpZmllciApO1xuXHRcdGNvbnN0IF9yb3dzICAgICAgICA9IFtdO1xuXG5cdFx0JHJvd3MuZmluZCggJy5yb3ctaXRlbScgKS5lYWNoKCBmdW5jdGlvbiggaSwgX2l0ZW0gKSB7XG5cdFx0XHRjb25zdCAkaXRlbSA9ICQoIF9pdGVtICk7XG5cdFx0XHRjb25zdCBvYmogICA9IHt9O1xuXG5cdFx0XHQkaXRlbS5maW5kKCAnW2RhdGEtbmFtZV0nICkuZWFjaCggZnVuY3Rpb24oIGZpZWxkSW5kZXgsIGZpZWxkICkge1xuXHRcdFx0XHRjb25zdCAkZmllbGQgPSAkKCBmaWVsZCApO1xuXHRcdFx0XHRjb25zdCBuYW1lICAgPSAkZmllbGQuYXR0ciggJ2RhdGEtbmFtZScgKTtcblxuXHRcdFx0XHRvYmpbIG5hbWUgXSA9ICRmaWVsZC52YWwoKTtcblx0XHRcdH0gKTtcblxuXHRcdFx0X3Jvd3MucHVzaCggb2JqICk7XG5cdFx0fSApO1xuXG5cdFx0Y29uc3QgcmF3VmFsdWVzID0gZW5jb2RlVVJJQ29tcG9uZW50KCBKU09OLnN0cmluZ2lmeSggX3Jvd3MgKSApO1xuXHRcdCR2YWx1ZUhvbGRlci52YWwoIHJhd1ZhbHVlcyApO1xuXHR9XG5cblx0ZnVuY3Rpb24gdHJpZ2dlclJlbW92ZU9wdGlvbiggJGZpZWxkICkge1xuXHRcdGNvbnN0ICRvcHRpb25zVGFibGUgPSAkZmllbGQuZmluZCggdGFibGVJZGVudGlmaWVyICk7XG5cdFx0Y29uc3QgdGFibGVSb3dzICAgICA9ICRmaWVsZC5maW5kKCB0YWJsZVJvd3NJZGVudGlmaWVyICkuY2hpbGRyZW4oKTtcblxuXHRcdGlmICggMiA+IHRhYmxlUm93cy5sZW5ndGggKSB7XG5cdFx0XHQkb3B0aW9uc1RhYmxlLnJlbW92ZUNsYXNzKCAnaGFzLW9wdGlvbnMnICk7XG5cdFx0fVxuXHR9XG5cblx0Ly8gUmVtb3ZlIE9wdGlvblxuXHRjb25zdCByZW1vdmVCdG5JZGVudGlmaWVyID0gdGFibGVJZGVudGlmaWVyICsgJyAucmVtb3ZlLW9wdGlvbic7XG5cblx0JHNlYXJjaEZvcm0ub24oICdjbGljaycsIHJlbW92ZUJ0bklkZW50aWZpZXIsIGZ1bmN0aW9uKCkge1xuXHRcdGNvbnN0ICRpdGVtICA9ICQoIHRoaXMgKS5jbG9zZXN0KCByb3dJZGVudGlmaWVyICk7XG5cdFx0Y29uc3QgJGZpZWxkID0gJGl0ZW0uY2xvc2VzdCggZmllbGRJZGVudGlmaWVyICk7XG5cblx0XHR0cmlnZ2VyUmVtb3ZlT3B0aW9uKCAkZmllbGQgKTtcblxuXHRcdCRpdGVtLnJlbW92ZSgpO1xuXG5cdFx0dHJpZ2dlck9wdGlvbnNDaGFuZ2UoICRmaWVsZCApO1xuXHR9ICk7XG5cblx0Ly8gQ2xlYXIgQWxsIE9wdGlvbnNcblx0Y29uc3QgY2xlYXJPcHRpb25zQnRuSWRlbnRpZmllciA9IHRhYmxlSWRlbnRpZmllciArICcgLmNsZWFyLW9wdGlvbnMnO1xuXG5cdCRzZWFyY2hGb3JtLm9uKCAnY2xpY2snLCBjbGVhck9wdGlvbnNCdG5JZGVudGlmaWVyLCBmdW5jdGlvbigpIHtcblx0XHRjb25zdCAkZmllbGQgPSAkKCB0aGlzICkuY2xvc2VzdCggZmllbGRJZGVudGlmaWVyICk7XG5cblx0XHQkZmllbGQuZmluZCggdGFibGVSb3dzSWRlbnRpZmllciApLmVtcHR5KCk7XG5cblx0XHR0cmlnZ2VyUmVtb3ZlT3B0aW9uKCAkZmllbGQgKTtcblx0XHR0cmlnZ2VyT3B0aW9uc0NoYW5nZSggJGZpZWxkICk7XG5cdH0gKTtcblxuXHQvLyBBZGQgTmV3IE9wdGlvblxuXHRjb25zdCBhZGRPcHRpb25CdG5JZGVudGlmaWVyID0gdGFibGVJZGVudGlmaWVyICsgJyAuYWRkLW9wdGlvbic7XG5cblx0JHNlYXJjaEZvcm0ub24oICdjbGljaycsIGFkZE9wdGlvbkJ0bklkZW50aWZpZXIsIGZ1bmN0aW9uKCkge1xuXHRcdC8vIEJhaWwgb3V0IGlmIG5vIHRtcGwgZm91bmQgZm9yIHRoZSB0eXBlLlxuXHRcdGlmICggISBqUXVlcnkoICcjdG1wbC0nICsgcm93VGVtcGxhdGVJZCApLmxlbmd0aCApIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHRjb25zdCAkZmllbGQgPSAkKCB0aGlzICkuY2xvc2VzdCggZmllbGRJZGVudGlmaWVyICk7XG5cblx0XHRjb25zdCB0ZW1wbGF0ZSA9IHdwLnRlbXBsYXRlKCByb3dUZW1wbGF0ZUlkICk7XG5cdFx0Y29uc3QgcmVuZGVyZWQgPSB0ZW1wbGF0ZSggcm93RGVmYXVsdE9wdGlvbnMgKTtcblx0XHRjb25zdCAkdGFibGUgICA9ICRmaWVsZC5maW5kKCB0YWJsZUlkZW50aWZpZXIgKTtcblx0XHRjb25zdCAkcm93cyAgICA9ICRmaWVsZC5maW5kKCB0YWJsZVJvd3NJZGVudGlmaWVyICk7XG5cblx0XHQkcm93cy5hcHBlbmQoIHJlbmRlcmVkICk7XG5cblx0XHR0cmlnZ2VyT3B0aW9uc0NoYW5nZSggJGZpZWxkICk7XG5cblx0XHQkc2VhcmNoRm9ybS50cmlnZ2VyKCAnbmV3X29wdGlvbl9hZGRlZCcsIFsgJGZpZWxkIF0gKTtcblxuXHRcdGlmICggISAkdGFibGUuaGFzQ2xhc3MoICdoYXMtb3B0aW9ucycgKSApIHtcblx0XHRcdCR0YWJsZS5hZGRDbGFzcyggJ2hhcy1vcHRpb25zJyApO1xuXHRcdH1cblx0fSApO1xuXG5cdC8vIFRyaWdnZXIgb3B0aW9ucyBjaGFuZ2Ugd2hlbiB0aGUgdGV4dCBmaWVsZHMgZ2V0IGNoYW5nZWQuXG5cdGNvbnN0IHRleHRGaWVsZHNJZGVudGlmaWVyID0gdGFibGVSb3dzSWRlbnRpZmllciArICcgaW5wdXRbdHlwZT1cInRleHRcIl0nO1xuXG5cdCRzZWFyY2hGb3JtLm9uKCAnaW5wdXQnLCB0ZXh0RmllbGRzSWRlbnRpZmllciwgZnVuY3Rpb24oKSB7XG5cdFx0Y29uc3QgJGZpZWxkID0gJCggdGhpcyApLmNsb3Nlc3QoIGZpZWxkSWRlbnRpZmllciApO1xuXG5cdFx0dHJpZ2dlck9wdGlvbnNDaGFuZ2UoICRmaWVsZCApO1xuXHR9ICk7XG5cblx0Ly8gVHJpZ2dlciBvcHRpb25zIGNoYW5nZSB3aGVuIHRoZSBzZWxlY3QgZmllbGRzIGdldCBjaGFuZ2VkLlxuXHRsZXQgc2VsZWN0RmllbGRzSWRlbnRpZmllciA9IHRhYmxlUm93c0lkZW50aWZpZXIgKyAnIHNlbGVjdCc7XG5cblx0JHNlYXJjaEZvcm0ub24oICdjaGFuZ2UnLCBzZWxlY3RGaWVsZHNJZGVudGlmaWVyLCBmdW5jdGlvbigpIHtcblx0XHRjb25zdCAkZmllbGQgPSAkKCB0aGlzICkuY2xvc2VzdCggZmllbGRJZGVudGlmaWVyICk7XG5cblx0XHR0cmlnZ2VyT3B0aW9uc0NoYW5nZSggJGZpZWxkICk7XG5cdH0gKTtcblxuXHQvLyBUcmlnZ2VyIG9wdGlvbnMgY2hhbmdlIHdoZW4gdmFsdWUgaXMgYWRkZWQgZnJvbSBtb2RhbC5cblx0JHNlYXJjaEZvcm0ub24oICd0cmlnZ2VyX29wdGlvbnNfdGFibGUnLCBmdW5jdGlvbiggZSwgdGFibGVJZCwgJGZpZWxkICkge1xuXHRcdGlmICggdGFibGVJZCA9PT0gdGFibGVJZGVudGlmaWVyICkge1xuXHRcdFx0dHJpZ2dlck9wdGlvbnNDaGFuZ2UoICRmaWVsZCApO1xuXHRcdH1cblx0fSApO1xuXG59XG4iLCIvKipcbiAqIFRoZSBudW1iZXIgdWkgb3B0aW9ucy5cbiAqXG4gKiBAc2luY2UgICAgICAzLjAuMFxuICogQHBhY2thZ2UgICAgd2MtYWpheC1wcm9kdWN0LWZpbHRlclxuICogQHN1YnBhY2thZ2Ugd2MtYWpheC1wcm9kdWN0LWZpbHRlci9hZG1pbi9zcmMvanNcbiAqIEBhdXRob3IgICAgIE1haW51bCBIYXNzYW4gTWFpblxuICovXG5cbmpRdWVyeSggZG9jdW1lbnQgKS5yZWFkeSggZnVuY3Rpb24oICQgKSB7XG5cblx0Y29uc3QgJHNlYXJjaEZvcm0gPSAkKCAnI3NlYXJjaC1mb3JtJyApO1xuXG5cdC8qKlxuXHQgKiBUb2dnbGUgZGlzYWJsZWQgYXR0cmlidXRlIG9mIG1pbi12YWx1ZSBmaWVsZCBmb3IgbnVtYmVyIHR5cGUuXG5cdCAqL1xuXHRmdW5jdGlvbiB0b2dnbGVOdW1iZXJNaW5WYWx1ZUZpZWxkKCAkZWxtICkge1xuXHRcdGNvbnN0ICRmaWVsZCAgICAgPSAkZWxtLmNsb3Nlc3QoICcud2NhcGYtZm9ybS1maWVsZCcgKTtcblx0XHRjb25zdCAkdGV4dEZpZWxkID0gJGZpZWxkLmZpbmQoICcud2NhcGYtZm9ybS1zdWItZmllbGQtbWluX3ZhbHVlIGlucHV0W3R5cGU9XCJ0ZXh0XCJdJyApO1xuXG5cdFx0aWYgKCAkZWxtLmlzKCAnOmNoZWNrZWQnICkgKSB7XG5cdFx0XHQkdGV4dEZpZWxkLmF0dHIoICdkaXNhYmxlZCcsICdkaXNhYmxlZCcgKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0JHRleHRGaWVsZC5yZW1vdmVBdHRyKCAnZGlzYWJsZWQnICk7XG5cdFx0fVxuXHR9XG5cblx0JHNlYXJjaEZvcm0uZmluZCggJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1taW5fdmFsdWVfYXV0b19kZXRlY3QgaW5wdXRbdHlwZT1cImNoZWNrYm94XCJdJyApLmVhY2goIGZ1bmN0aW9uKCkge1xuXHRcdGNvbnN0ICR0aGlzID0gJCggdGhpcyApO1xuXG5cdFx0dG9nZ2xlTnVtYmVyTWluVmFsdWVGaWVsZCggJHRoaXMgKTtcblx0fSApO1xuXG5cdCRzZWFyY2hGb3JtLm9uKFxuXHRcdCdjbGljaycsXG5cdFx0Jy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1taW5fdmFsdWVfYXV0b19kZXRlY3QgaW5wdXRbdHlwZT1cImNoZWNrYm94XCJdJyxcblx0XHRmdW5jdGlvbigpIHtcblx0XHRcdGNvbnN0ICR0aGlzID0gJCggdGhpcyApO1xuXG5cdFx0XHR0b2dnbGVOdW1iZXJNaW5WYWx1ZUZpZWxkKCAkdGhpcyApO1xuXHRcdH1cblx0KTtcblxuXHQvKipcblx0ICogVG9nZ2xlIGRpc2FibGVkIGF0dHJpYnV0ZSBvZiBtYXgtdmFsdWUgZmllbGQgZm9yIG51bWJlciB0eXBlLlxuXHQgKi9cblx0ZnVuY3Rpb24gdG9nZ2xlTnVtYmVyTWF4VmFsdWVGaWVsZCggJGVsbSApIHtcblx0XHRjb25zdCAkZmllbGQgICAgID0gJGVsbS5jbG9zZXN0KCAnLndjYXBmLWZvcm0tZmllbGQnICk7XG5cdFx0Y29uc3QgJHRleHRGaWVsZCA9ICRmaWVsZC5maW5kKCAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLW1heF92YWx1ZSBpbnB1dFt0eXBlPVwidGV4dFwiXScgKTtcblxuXHRcdGlmICggJGVsbS5pcyggJzpjaGVja2VkJyApICkge1xuXHRcdFx0JHRleHRGaWVsZC5hdHRyKCAnZGlzYWJsZWQnLCAnZGlzYWJsZWQnICk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdCR0ZXh0RmllbGQucmVtb3ZlQXR0ciggJ2Rpc2FibGVkJyApO1xuXHRcdH1cblx0fVxuXG5cdCRzZWFyY2hGb3JtLmZpbmQoICcud2NhcGYtZm9ybS1zdWItZmllbGQtbWF4X3ZhbHVlX2F1dG9fZGV0ZWN0IGlucHV0W3R5cGU9XCJjaGVja2JveFwiXScgKS5lYWNoKCBmdW5jdGlvbigpIHtcblx0XHRjb25zdCAkdGhpcyA9ICQoIHRoaXMgKTtcblxuXHRcdHRvZ2dsZU51bWJlck1heFZhbHVlRmllbGQoICR0aGlzICk7XG5cdH0gKTtcblxuXHQkc2VhcmNoRm9ybS5vbihcblx0XHQnY2xpY2snLFxuXHRcdCcud2NhcGYtZm9ybS1zdWItZmllbGQtbWF4X3ZhbHVlX2F1dG9fZGV0ZWN0IGlucHV0W3R5cGU9XCJjaGVja2JveFwiXScsXG5cdFx0ZnVuY3Rpb24oKSB7XG5cdFx0XHRjb25zdCAkdGhpcyA9ICQoIHRoaXMgKTtcblxuXHRcdFx0dG9nZ2xlTnVtYmVyTWF4VmFsdWVGaWVsZCggJHRoaXMgKTtcblx0XHR9XG5cdCk7XG5cbn0gKTtcbiIsIi8qKlxuICogVGhlIHByb2R1Y3Qgc3RhdHVzIGZpZWxkLlxuICpcbiAqIEBzaW5jZSAgICAgIDMuMC4wXG4gKiBAcGFja2FnZSAgICB3Yy1hamF4LXByb2R1Y3QtZmlsdGVyXG4gKiBAc3VicGFja2FnZSB3Yy1hamF4LXByb2R1Y3QtZmlsdGVyL2FkbWluL3NyYy9qc1xuICogQGF1dGhvciAgICAgTWFpbnVsIEhhc3NhbiBNYWluXG4gKi9cblxualF1ZXJ5KCBkb2N1bWVudCApLnJlYWR5KCBmdW5jdGlvbigpIHtcblxuXHRjb25zdCB0YWJsZUlkZW50aWZpZXIgPSAnLnByb2R1Y3Qtc3RhdHVzLW9wdGlvbnMtdGFibGUnO1xuXHRjb25zdCB2YWx1ZUlkZW50aWZpZXIgPSAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLXByb2R1Y3Rfc3RhdHVzX29wdGlvbnMgaW5wdXQnO1xuXHRjb25zdCByb3dUZW1wbGF0ZUlkICAgPSAnd2NhcGYtcHJvZHVjdC1zdGF0dXMtb3B0aW9uJztcblxuXHRpbml0TWFudWFsT3B0aW9uc1RhYmxlKCB0YWJsZUlkZW50aWZpZXIsIHZhbHVlSWRlbnRpZmllciwgcm93VGVtcGxhdGVJZCApO1xuXG59ICk7XG4iLCIvKipcbiAqIFRoZSBzZWFyY2ggZm9ybS5cbiAqXG4gKiBAc2luY2UgICAgICAzLjAuMFxuICogQHBhY2thZ2UgICAgd2MtYWpheC1wcm9kdWN0LWZpbHRlclxuICogQHN1YnBhY2thZ2Ugd2MtYWpheC1wcm9kdWN0LWZpbHRlci9hZG1pbi9zcmMvanNcbiAqIEBhdXRob3IgICAgIE1haW51bCBIYXNzYW4gTWFpblxuICovXG5cbmNvbnN0IHRvdGFsRmllbGRJbnN0YW5jZXMgPSBqUXVlcnkoICcjdG90YWxfZmllbGRfaW5zdGFuY2VzJyApO1xuXG5jb25zdCBzZWFyY2hGb3JtID0galF1ZXJ5KCAnI3NlYXJjaC1mb3JtJyApO1xuXG4vKipcbiAqIEFzc2lnbiBhIHVuaXF1ZSBpZCBieSByZXBsYWNpbmcgdGhlIHBsYWNlaG9sZGVyIGlkLlxuICovXG5mdW5jdGlvbiByZW1vdmVQbGFjZWhvbGRlciggdW5pcXVlSWQsIGVsZW1lbnRzLCBhdHRyICkge1xuXHRlbGVtZW50cy5lYWNoKFxuXHRcdGZ1bmN0aW9uKCkge1xuXHRcdFx0Y29uc3QgZWxlbWVudCA9IGpRdWVyeSggdGhpcyApO1xuXG5cdFx0XHRjb25zdCBvbGRWYWx1ZSA9IGVsZW1lbnQuYXR0ciggYXR0ciApO1xuXHRcdFx0Y29uc3QgbmV3VmFsdWUgPSBvbGRWYWx1ZS5yZXBsYWNlKCAnJSUnLCB1bmlxdWVJZCApO1xuXG5cdFx0XHRlbGVtZW50LmF0dHIoIGF0dHIsIG5ld1ZhbHVlICk7XG5cdFx0fVxuXHQpO1xufVxuXG4vKipcbiAqIEluc2VydCB0aGUgZmllbGQncyBzdWJmaWVsZHMuXG4gKi9cbmZ1bmN0aW9uIGluc2VydEZpZWxkU3ViRmllbGRzKCB1aSApIHtcblx0Ly8gSW5zZXJ0IHRoZSBmaWVsZCdzIHN1YmZpZWxkcyBpZiBub3QgYWxyZWFkeSBpbnNlcnRlZC5cblx0aWYgKCAhIHVpLml0ZW0uaGFzQ2xhc3MoICdzdWItZmllbGRzLXJlYWR5JyApICkge1xuXHRcdGNvbnN0IHR5cGUgICAgICA9IHVpLml0ZW0uYXR0ciggJ2RhdGEtZmllbGQtdHlwZScgKTtcblx0XHRjb25zdCB1bmlxdWVJZCAgPSBwYXJzZUludCggdG90YWxGaWVsZEluc3RhbmNlcy52YWwoKSApO1xuXHRcdGNvbnN0IGZpZWxkVHlwZSA9ICd3Y2FwZi1mb3JtLWZpZWxkLScgKyB0eXBlO1xuXG5cdFx0Ly8gQmFpbCBvdXQgaWYgbm8gdG1wbCBmb3VuZCBmb3IgdGhlIHR5cGUuXG5cdFx0aWYgKCAhIGpRdWVyeSggJyN0bXBsLScgKyBmaWVsZFR5cGUgKS5sZW5ndGggKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0Ly8gSW5jcmVtZW50IHRoZSB2YWx1ZSBvZiB0b3RhbCBmaWVsZCBpbnN0YW5jZXMuXG5cdFx0dG90YWxGaWVsZEluc3RhbmNlcy52YWwoIHVuaXF1ZUlkICsgMSApO1xuXG5cdFx0Y29uc3QgdGVtcGxhdGUgPSB3cC50ZW1wbGF0ZSggZmllbGRUeXBlICk7XG5cdFx0Y29uc3QgcmVuZGVyZWQgPSB0ZW1wbGF0ZSgpO1xuXHRcdGNvbnN0IHdyYXBwZXIgID0gdWkuaXRlbS5maW5kKCAnLndpZGdldC1jb250ZW50JyApO1xuXG5cdFx0d3JhcHBlci5wcmVwZW5kKCByZW5kZXJlZCApO1xuXG5cdFx0Ly8gVXBkYXRlIHRoZSBmb3IgYXR0cmlidXRlcyBvZiB0aGUgbGFiZWxzLlxuXHRcdHJlbW92ZVBsYWNlaG9sZGVyKCB1bmlxdWVJZCwgdWkuaXRlbS5maW5kKCAnbGFiZWxbZm9yXj1cIndjYXBmLWlucHV0LVwiXScgKSwgJ2ZvcicgKTtcblxuXHRcdC8vIFVwZGF0ZSB0aGUgaWRzIG9mIHRoZSBpbnB1dCBlbGVtZW50cy5cblx0XHRyZW1vdmVQbGFjZWhvbGRlciggdW5pcXVlSWQsIHVpLml0ZW0uZmluZCggJypbaWRePVwid2NhcGYtaW5wdXQtXCJdJyApLCAnaWQnICk7XG5cblx0XHQvLyBVcGRhdGUgdGhlIG5hbWVzIG9mIHRoZSBpbnB1dCBlbGVtZW50cy5cblx0XHRyZW1vdmVQbGFjZWhvbGRlciggdW5pcXVlSWQsIHVpLml0ZW0uZmluZCggJypbaWRePVwid2NhcGYtaW5wdXQtXCJdJyApLCAnbmFtZScgKTtcblxuXHRcdC8vIFVwZGF0ZSB0aGUgcG9zaXRpb24gdmFsdWUuXG5cdFx0cmVtb3ZlUGxhY2Vob2xkZXIoIHVuaXF1ZUlkLCB1aS5pdGVtLmZpbmQoICcqW2lkXj1cIndjYXBmLWlucHV0LXBvc2l0aW9uLVwiXScgKSwgJ3ZhbHVlJyApO1xuXG5cdFx0dWkuaXRlbS5hZGRDbGFzcyggJ3N1Yi1maWVsZHMtcmVhZHknICk7XG5cblx0XHRzZWFyY2hGb3JtLnRyaWdnZXIoICdmaWVsZF9hZGRlZCcsIFsgdWkgXSApO1xuXHR9XG59XG5cbi8qKlxuICogVXBkYXRlIHRoZSBmb3JtIGZpZWxkJ3MgcG9zaXRpb24gYWZ0ZXIgc29ydC5cbiAqXG4gKiBAc291cmNlIGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vYS8xNDczNjc3NVxuICovXG5mdW5jdGlvbiB1cGRhdGVGaWVsZHNQb3NpdGlvbigpIHtcblx0Y29uc3QgaW5wdXRzICA9IHNlYXJjaEZvcm0uZmluZCggJypbaWRePVwid2NhcGYtaW5wdXQtcG9zaXRpb24tXCJdJyApO1xuXHRjb25zdCBuYkVsZW1zID0gaW5wdXRzLmxlbmd0aDtcblxuXHRpbnB1dHMuZWFjaChcblx0XHRmdW5jdGlvbiggaWR4ICkge1xuXHRcdFx0alF1ZXJ5KCB0aGlzICkudmFsKCBuYkVsZW1zIC0gKCBuYkVsZW1zIC0gaWR4ICkgKTtcblx0XHR9XG5cdCk7XG59XG5cbi8qKlxuICogTWFrZSB0aGUgZmllbGQgcmVhZHksIHJlbW92ZSBzdHlsZXMgY29tZXMgZnJvbSBqcXVlcnktdWktc29ydGFibGUgcGx1Z2luLCBpbnNlcnQgdGhlIGZpZWxkJ3Mgc3ViZmllbGRzIGV0Yy5cbiAqL1xuZnVuY3Rpb24gbWFrZUZpZWxkUmVhZHkoIGUsIHVpICkge1xuXHQvLyBSZW1vdmUgc3R5bGVzIGNvbWVzIGZyb20ganF1ZXJ5LXVpLXNvcnRhYmxlIHBsdWdpbi5cblx0dWkuaXRlbS5yZW1vdmVBdHRyKCAnc3R5bGUnICk7XG5cblx0aW5zZXJ0RmllbGRTdWJGaWVsZHMoIHVpICk7XG5cblx0dXBkYXRlRmllbGRzUG9zaXRpb24oKTtcblxuXHRjb25zdCB0b2dnbGVCdG4gPSB1aS5pdGVtLmZpbmQoICcud2lkZ2V0LWFjdGlvbicgKTtcblxuXHQvLyBFeHBhbmQgdGhlIGZvcm0gZmllbGQgYWZ0ZXIgc29ydC5cblx0aWYgKCAnZmFsc2UnID09PSB0b2dnbGVCdG4uYXR0ciggJ2FyaWEtZXhwYW5kZWQnICkgKSB7XG5cdFx0dG9nZ2xlQnRuLnRyaWdnZXIoICdjbGljaycgKTtcblx0fVxufVxuXG4vKipcbiAqIEluc3RhbnRpYXRlIHNvcnRhYmxlIGZvciB0aGUgZm9ybSBmaWVsZHMuXG4gKi9cbmZ1bmN0aW9uIHNvcnRhYmxlKCBpZGVudGlmaWVyICkge1xuXHRjb25zdCBjb250YWluZXIgPSBqUXVlcnkoIGlkZW50aWZpZXIgKTtcblxuXHRjb250YWluZXIuc29ydGFibGUoXG5cdFx0e1xuXHRcdFx0b3BhY2l0eTogMC44LFxuXHRcdFx0cmV2ZXJ0OiBmYWxzZSxcblx0XHRcdGN1cnNvcjogJ21vdmUnLFxuXHRcdFx0YXhpczogJ3knLFxuXHRcdFx0aGFuZGxlOiAnLndpZGdldC10b3AnLFxuXHRcdFx0Y2FuY2VsOiAnLndpZGdldC10aXRsZS1hY3Rpb24nLFxuXHRcdFx0aXRlbXM6ICcud2lkZ2V0Jyxcblx0XHRcdHBsYWNlaG9sZGVyOiAnd2lkZ2V0LXBsYWNlaG9sZGVyJyxcblx0XHRcdGNvbm5lY3RXaXRoOiAnI3NlYXJjaC1mb3JtLXdyYXBwZXInLFxuXHRcdFx0c3RvcDogbWFrZUZpZWxkUmVhZHksXG5cdFx0XHRzdGFydDogZnVuY3Rpb24oIGUsIHVpICkge1xuXHRcdFx0XHQvLyBJZiBpdCBpcyBnZXR0aW5nIGFwcGVuZGVkIHRvIHRoZSB3cm9uZyBwbGFjZSwgdGhlbiBmb3JjZSBpdCBpbnRvIHRoZSByaWdodCBjb250YWluZXIuXG5cdFx0XHRcdHVpLnBsYWNlaG9sZGVyLmFwcGVuZFRvKCB1aS5wbGFjZWhvbGRlci5wYXJlbnQoKS5maW5kKCAnLmluc2lkZSAjc2VhcmNoLWZvcm0td3JhcHBlcicgKSApO1xuXHRcdFx0fVxuXHRcdH1cblx0KTtcbn1cblxuc29ydGFibGUoICcjc2VhcmNoLWZvcm0nICk7XG5cbi8qKlxuICogUnVuIGZ1bmN0aW9uIHdoZW4gZHJhZyBzdGFydHMuXG4gKi9cbmZ1bmN0aW9uIG9uRHJhZ1N0YXJ0KCkge1xuXHRzZWFyY2hGb3JtLmFkZENsYXNzKCAndWktZHJvcC1hY3RpdmUnICk7XG59XG5cbi8qKlxuICogUnVuIGZ1bmN0aW9uIGF0IGRyYWcgc3RvcC5cbiAqL1xuZnVuY3Rpb24gb25EcmFnU3RvcCgpIHtcblx0c2VhcmNoRm9ybS5yZW1vdmVDbGFzcyggJ3VpLWRyb3AtYWN0aXZlJyApO1xufVxuXG4vKipcbiAqIEluaXRpYWxpemUgZHJhZ2dhYmxlIGZvciB0aGUgZm9ybSBmaWVsZHMuXG4gKi9cbmpRdWVyeSggJyNhdmFpbGFibGUtZmllbGRzIC53aWRnZXQnICkuZHJhZ2dhYmxlKFxuXHR7XG5cdFx0Y29ubmVjdFRvU29ydGFibGU6ICcjc2VhcmNoLWZvcm0nLFxuXHRcdGhlbHBlcjogJ2Nsb25lJyxcblx0XHRzdGFydDogb25EcmFnU3RhcnQsXG5cdFx0c3RvcDogb25EcmFnU3RvcCxcblx0fVxuKTtcblxuLyoqXG4gKiBUb2dnbGUgdGhlIGZvcm0gZmllbGQuXG4gKi9cbmZ1bmN0aW9uIHRvZ2dsZUZpZWxkKCBlICkge1xuXHRjb25zdCB0YXJnZXQgICAgICAgPSBlLnRhcmdldDtcblx0Y29uc3Qgd2lkZ2V0ICAgICAgID0galF1ZXJ5KCB0aGlzICkuY2xvc2VzdCggJy53aWRnZXQnICk7XG5cdGNvbnN0IHRvZ2dsZUJ0biAgICA9IHdpZGdldC5maW5kKCAnLndpZGdldC1hY3Rpb24nICk7XG5cdGNvbnN0IGluc2lkZSAgICAgICA9IHdpZGdldC5jaGlsZHJlbiggJy53aWRnZXQtaW5zaWRlJyApO1xuXHRjb25zdCBpc0V4cGFuZCAgICAgPSB0b2dnbGVCdG4uYXR0ciggJ2FyaWEtZXhwYW5kZWQnICk7XG5cdGNvbnN0IHRvZ2dsZUV4cGFuZCA9ICd0cnVlJyA9PT0gaXNFeHBhbmQgPyAnZmFsc2UnIDogJ3RydWUnO1xuXG5cdHRvZ2dsZUJ0bi5hdHRyKCAnYXJpYS1leHBhbmRlZCcsIHRvZ2dsZUV4cGFuZCApO1xuXHRqUXVlcnkoIGluc2lkZSApLnNsaWRlVG9nZ2xlKFxuXHRcdCdmYXN0Jyxcblx0XHRmdW5jdGlvbigpIHtcblx0XHRcdHdpZGdldC50b2dnbGVDbGFzcyggJ29wZW4nICk7XG5cdFx0XHRzZWFyY2hGb3JtLnRyaWdnZXIoICd3aWRnZXQtY2xvc2VkJywgWyB0YXJnZXQgXSApO1xuXHRcdH1cblx0KTtcbn1cblxuc2VhcmNoRm9ybS5vbiggJ2NsaWNrJywgJy53aWRnZXQtdG9wJywgdG9nZ2xlRmllbGQgKTtcbnNlYXJjaEZvcm0ub24oICdjbGljaycsICcud2lkZ2V0LWNvbnRyb2wtY2xvc2UnLCB0b2dnbGVGaWVsZCApO1xuXG4vKipcbiAqIEZvY3VzIHRoZSBmb3JtIGZpZWxkJ3MgZXhwYW5kIGJ1dHRvbi5cbiAqL1xuZnVuY3Rpb24gZm9jdXNGaWVsZCggZSwgdGFyZ2V0ICkge1xuXHRpZiAoIHRhcmdldC5jbGFzc0xpc3QuY29udGFpbnMoICd3aWRnZXQtY29udHJvbC1jbG9zZScgKSApIHtcblx0XHRjb25zdCB3aWRnZXQgPSBqUXVlcnkoIHRhcmdldCApLmNsb3Nlc3QoICcud2lkZ2V0JyApO1xuXHRcdGNvbnN0IGFjdGlvbiA9IHdpZGdldC5maW5kKCAnLndpZGdldC1hY3Rpb24nICk7XG5cblx0XHRhY3Rpb24uYXR0ciggJ2FyaWEtZXhwYW5kZWQnLCAnZmFsc2UnICkuZm9jdXMoKTtcblx0fVxufVxuXG5zZWFyY2hGb3JtLm9uKCAnd2lkZ2V0LWNsb3NlZCcsIGZvY3VzRmllbGQgKTtcblxuLyoqXG4gKiBSZW1vdmUgdGhlIGZpZWxkLlxuICovXG5mdW5jdGlvbiByZW1vdmVGaWVsZCgpIHtcblx0Y29uc3Qgd2lkZ2V0ID0galF1ZXJ5KCB0aGlzICkuY2xvc2VzdCggJy53aWRnZXQnICk7XG5cblx0alF1ZXJ5KCB3aWRnZXQgKS5zbGlkZVVwKFxuXHRcdCdmYXN0Jyxcblx0XHRmdW5jdGlvbigpIHtcblx0XHRcdHdpZGdldC5yZW1vdmUoKTtcblx0XHRcdHVwZGF0ZUZpZWxkc1Bvc2l0aW9uKCk7XG5cdFx0fVxuXHQpO1xufVxuXG5zZWFyY2hGb3JtLm9uKCAnY2xpY2snLCAnLndpZGdldC1jb250cm9sLXJlbW92ZScsIHJlbW92ZUZpZWxkICk7XG5cbi8qKlxuICogU3RvcmUgdGhlIGluaXRpYWwgZm9ybSBkYXRhIGludG8gYSB2YXJpYWJsZSBzbyB0aGF0IHdlIGNhbiBjb21wYXJlIGl0IHdoZW4gbGVhdmluZyB0aGUgcGFnZS5cbiAqL1xubGV0IGluaXRpYWxGb3JtU3RhdGUgPSBzZWFyY2hGb3JtLnNlcmlhbGl6ZUFycmF5KCk7XG5cbi8qKlxuICogU2hvdyBtZXNzYWdlIGFmdGVyIGZvcm0gc3VibWlzc2lvbi5cbiAqL1xuZnVuY3Rpb24gc2hvd01lc3NhZ2UoIG1lc3NhZ2UsIHR5cGUgPSAnc3VjY2VzcycgKSB7XG5cdGNvbnN0IGVsZW1lbnQgPSBqUXVlcnkoICc8cCBjbGFzcz1cIicgKyB0eXBlICsgJ1wiPicgKyBtZXNzYWdlICsgJzwvcD4nICk7XG5cdGNvbnN0IHdyYXBwZXIgPSBqUXVlcnkoICcud2NhcGYtbWVzc2FnZS13cmFwcGVyJyApO1xuXG5cdGlmICggISB3cmFwcGVyLmlzKCAnOmVtcHR5JyApICkge1xuXHRcdHJldHVybjtcblx0fVxuXG5cdGpRdWVyeSggd3JhcHBlciApLmh0bWwoIGVsZW1lbnQgKS5zbGlkZURvd24oICdmYXN0JyApO1xuXG5cdHNldFRpbWVvdXQoXG5cdFx0ZnVuY3Rpb24oKSB7XG5cdFx0XHRqUXVlcnkoIHdyYXBwZXIgKS5zbGlkZVVwKCAnZmFzdCcgKTtcblx0XHRcdHdyYXBwZXIuaHRtbCggJycgKTtcblx0XHR9LFxuXHRcdDMwMDBcblx0KTtcbn1cblxuLyoqXG4gKiBTYXZlIHRoZSBzZWFyY2ggZm9ybS5cbiAqL1xuZnVuY3Rpb24gc2F2ZUZvcm0oKSB7XG5cdGNvbnN0IGJ1dHRvbiAgID0galF1ZXJ5KCB0aGlzICk7XG5cdGNvbnN0IGZvcm1EYXRhID0gc2VhcmNoRm9ybS5zZXJpYWxpemVBcnJheSgpO1xuXG5cdGJ1dHRvbi5hdHRyKCAnZGlzYWJsZWQnLCAnZGlzYWJsZWQnICk7XG5cblx0ZnVuY3Rpb24gb2tDYWxsYmFjayggbWVzc2FnZSApIHtcblx0XHRidXR0b24ucmVtb3ZlQXR0ciggJ2Rpc2FibGVkJyApO1xuXG5cdFx0Ly8gVXBkYXRlIHRoZSBpbml0aWFsIGZvcm0gZGF0YSBhZnRlciBzdWNjZXNzZnVsbHkgc2F2aW5nIHRoZSBmb3JtLlxuXHRcdGluaXRpYWxGb3JtU3RhdGUgPSBmb3JtRGF0YTtcblxuXHRcdHNob3dNZXNzYWdlKCBtZXNzYWdlICk7XG5cdH1cblxuXHRmdW5jdGlvbiBlcnJDYWxsYmFjayggbWVzc2FnZSApIHtcblx0XHRidXR0b24ucmVtb3ZlQXR0ciggJ2Rpc2FibGVkJyApO1xuXHRcdHNob3dNZXNzYWdlKCBtZXNzYWdlLCAnZXJyb3InICk7XG5cdH1cblxuXHQvLyBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL2EvNTkxODEyNTJcblx0d3AuYWpheC5wb3N0KCBmb3JtRGF0YSApLmRvbmUoIG9rQ2FsbGJhY2sgKS5mYWlsKCBlcnJDYWxsYmFjayApO1xufVxuXG5qUXVlcnkoICcjcG9zdGJveC1jb250YWluZXItMScgKS5vbiggJ2NsaWNrJywgJ2J1dHRvbicsIHNhdmVGb3JtICk7XG5cbnNlYXJjaEZvcm0ub24oICdjbGljaycsICcuZXhwYW5kLWFsbC1maWVsZHMtYnRuJywgZnVuY3Rpb24oKSB7XG5cdGNvbnN0ICRmaWVsZHMgPSBzZWFyY2hGb3JtLmZpbmQoICdbZGF0YS1maWVsZC10eXBlXScgKTtcblxuXHQkZmllbGRzLmVhY2goIGZ1bmN0aW9uKCkge1xuXHRcdGNvbnN0ICRpdGVtID0galF1ZXJ5KCB0aGlzICk7XG5cblx0XHRpZiAoICEgJGl0ZW0uaGFzQ2xhc3MoICdvcGVuJyApICkge1xuXHRcdFx0JGl0ZW0uZmluZCggJy53aWRnZXQtdG9wJyApLnRyaWdnZXIoICdjbGljaycgKTtcblx0XHR9XG5cdH0gKTtcbn0gKTtcblxuc2VhcmNoRm9ybS5vbiggJ2NsaWNrJywgJy5jb2xsYXBzZS1hbGwtZmllbGRzLWJ0bicsIGZ1bmN0aW9uKCkge1xuXHRjb25zdCAkZmllbGRzID0gc2VhcmNoRm9ybS5maW5kKCAnW2RhdGEtZmllbGQtdHlwZV0nICk7XG5cblx0JGZpZWxkcy5lYWNoKCBmdW5jdGlvbigpIHtcblx0XHRjb25zdCAkaXRlbSA9IGpRdWVyeSggdGhpcyApO1xuXG5cdFx0aWYgKCAkaXRlbS5oYXNDbGFzcyggJ29wZW4nICkgKSB7XG5cdFx0XHQkaXRlbS5maW5kKCAnLndpZGdldC10b3AnICkudHJpZ2dlciggJ2NsaWNrJyApO1xuXHRcdH1cblx0fSApO1xufSApO1xuXG4vKipcbiAqIFNob3cgYWxlcnQgb24gbGVhdmUgaWYgdGhlIGZvcm0gaXMgZGlydHkuXG4gKlxuICogVE9ETzogVW5jb21tZW50IHRoaXMuXG4gKi9cbi8vIHdpbmRvdy5vbmJlZm9yZXVubG9hZCA9IGZ1bmN0aW9uKCkge1xuLy8gXHRjb25zdCBuZXdGb3JtU3RhdGUgPSBzZWFyY2hGb3JtLnNlcmlhbGl6ZUFycmF5KCk7XG4vL1xuLy8gXHRjb25zdCBpc0Zvcm1EaXJ0eSA9ICEgXy5pc0VxdWFsKCBuZXdGb3JtU3RhdGUsIGluaXRpYWxGb3JtU3RhdGUgKTtcbi8vXG4vLyBcdGlmICggaXNGb3JtRGlydHkgKSB7XG4vLyBcdFx0cmV0dXJuICcnO1xuLy8gXHR9XG4vLyB9O1xuIiwiLyoqXG4gKiBUaGUgdG9nZ2xlIHZpc2liaWxpdHkgc2NyaXB0cy5cbiAqXG4gKiBOT1RFOiBUaGVzZSBzY3JpcHRzIG11c3QgYmUgbG9jYXRlZCBhdCB0aGUgdmVyeSBib3R0b20gb2YgdGhlIGNvbWJpbmVkIHNjcmlwdHMuXG4gKlxuICogQHNpbmNlICAgICAgMy4wLjBcbiAqIEBwYWNrYWdlICAgIHdjLWFqYXgtcHJvZHVjdC1maWx0ZXJcbiAqIEBzdWJwYWNrYWdlIHdjLWFqYXgtcHJvZHVjdC1maWx0ZXIvYWRtaW4vc3JjL2pzXG4gKiBAYXV0aG9yICAgICBNYWludWwgSGFzc2FuIE1haW5cbiAqL1xuXG5qUXVlcnkoIGRvY3VtZW50ICkucmVhZHkoIGZ1bmN0aW9uKCAkICkge1xuXG5cdGNvbnN0ICRzZWFyY2hGb3JtID0gJCggJyNzZWFyY2gtZm9ybScgKTtcblxuXHRjb25zdCBkZXBlbmRhbnREYXRhID0gW1xuXHRcdHtcblx0XHRcdCdoYW5kbGVyJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC12YWx1ZV90eXBlIHNlbGVjdCcsXG5cdFx0XHQnaGFuZGxlclR5cGUnOiAnc2VsZWN0Jyxcblx0XHRcdCdldmVudCc6ICdjaGFuZ2UnLFxuXHRcdFx0J2RlcGVuZGFudCc6IFtcblx0XHRcdFx0e1xuXHRcdFx0XHRcdCdzZWxlY3Rvcic6ICcuaW5wdXQtdHlwZS10ZXh0LWZpZWxkcycsXG5cdFx0XHRcdFx0J3ZhbHVlJzogWyAndGV4dCcgXSxcblx0XHRcdFx0fSxcblx0XHRcdFx0e1xuXHRcdFx0XHRcdCdzZWxlY3Rvcic6ICcuaW5wdXQtdHlwZS1udW1iZXItZmllbGRzJyxcblx0XHRcdFx0XHQndmFsdWUnOiBbICdudW1iZXInIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLmlucHV0LXR5cGUtZGF0ZS1maWVsZHMnLFxuXHRcdFx0XHRcdCd2YWx1ZSc6IFsgJ2RhdGUnIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRdLFxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0J2hhbmRsZXInOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLWRpc3BsYXlfdHlwZSBzZWxlY3QnLFxuXHRcdFx0J2hhbmRsZXJUeXBlJzogJ3NlbGVjdCcsXG5cdFx0XHQnZXZlbnQnOiAnY2hhbmdlJyxcblx0XHRcdCdkZXBlbmRhbnQnOiBbXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLXF1ZXJ5X3R5cGUnLFxuXHRcdFx0XHRcdCd2YWx1ZSc6IFsgJ2NoZWNrYm94JywgJ211bHRpLXNlbGVjdCcgXSxcblx0XHRcdFx0fSxcblx0XHRcdFx0e1xuXHRcdFx0XHRcdCdzZWxlY3Rvcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtYWxsX2l0ZW1zX2xhYmVsJyxcblx0XHRcdFx0XHQndmFsdWUnOiBbICdyYWRpbycsICdzZWxlY3QnIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLXVzZV9jaG9zZW4nLFxuXHRcdFx0XHRcdCd2YWx1ZSc6IFsgJ3NlbGVjdCcsICdtdWx0aS1zZWxlY3QnIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLmhpZXJhcmNoaWNhbC1maWVsZHMnLFxuXHRcdFx0XHRcdCd2YWx1ZSc6IFsgJ2NoZWNrYm94JywgJ3JhZGlvJywgJ3NlbGVjdCcsICdtdWx0aS1zZWxlY3QnIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLXVzZV9jYXRlZ29yeV9pbWFnZXMnLFxuXHRcdFx0XHRcdCd2YWx1ZSc6IFsgJ2ltYWdlJyBdLFxuXHRcdFx0XHR9LFxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0J3NlbGVjdG9yJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1lbmFibGVfbXVsdGlwbGVfZmlsdGVyJyxcblx0XHRcdFx0XHQndmFsdWUnOiBbICdsYWJlbCcsICdjb2xvcicsICdpbWFnZScgXSxcblx0XHRcdFx0fSxcblx0XHRcdFx0e1xuXHRcdFx0XHRcdCdzZWxlY3Rvcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtaW5saW5lX2Rpc3BsYXknLFxuXHRcdFx0XHRcdCd2YWx1ZSc6IFsgJ2xhYmVsJywgJ2NvbG9yJywgJ2ltYWdlJyBdLFxuXHRcdFx0XHR9LFxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0J3NlbGVjdG9yJzogJy5jb2x1bW4tZ3JvdXAtY3VzdG9tX2FwcGVhcmFuY2UnLFxuXHRcdFx0XHRcdCd2YWx1ZSc6IFsgJ2NvbG9yJywgJ2ltYWdlJyBdLFxuXHRcdFx0XHR9LFxuXHRcdFx0XSxcblx0XHR9LFxuXHRcdHtcblx0XHRcdCdoYW5kbGVyJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC11c2VfY2hvc2VuIGlucHV0Jyxcblx0XHRcdCdoYW5kbGVyVHlwZSc6ICdjaGVja2JveCcsXG5cdFx0XHQnZXZlbnQnOiAnY2hhbmdlJyxcblx0XHRcdCdkZXBlbmRhbnQnOiBbXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLWNob3Nlbl9ub19yZXN1bHRzX21lc3NhZ2UnLFxuXHRcdFx0XHRcdCd2YWx1ZSc6IFsgJzEnIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRdLFxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0J2hhbmRsZXInOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLWhpZXJhcmNoaWNhbCBpbnB1dCcsXG5cdFx0XHQnaGFuZGxlclR5cGUnOiAnY2hlY2tib3gnLFxuXHRcdFx0J2V2ZW50JzogJ2NoYW5nZScsXG5cdFx0XHQnZGVwZW5kYW50JzogW1xuXHRcdFx0XHR7XG5cdFx0XHRcdFx0J3NlbGVjdG9yJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1lbmFibGVfaGllcmFyY2h5X2FjY29yZGlvbicsXG5cdFx0XHRcdFx0J3ZhbHVlJzogWyAnMScgXSxcblx0XHRcdFx0fSxcblx0XHRcdF0sXG5cdFx0fSxcblx0XHR7XG5cdFx0XHQnaGFuZGxlcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtZ2V0X29wdGlvbnMgaW5wdXQnLFxuXHRcdFx0J2hhbmRsZXJUeXBlJzogJ3JhZGlvJyxcblx0XHRcdCdldmVudCc6ICdjaGFuZ2UnLFxuXHRcdFx0J2RlcGVuZGFudCc6IFtcblx0XHRcdFx0e1xuXHRcdFx0XHRcdCdzZWxlY3Rvcic6ICcuY29sdW1uLWdyb3VwLW1ldGFfa2V5X21hbnVhbF9vcHRpb25zJyxcblx0XHRcdFx0XHQndmFsdWUnOiBbICdtYW51YWxfZW50cnknIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRdLFxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0J2hhbmRsZXInOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLW51bWJlcl9kaXNwbGF5X3R5cGUgc2VsZWN0Jyxcblx0XHRcdCdoYW5kbGVyVHlwZSc6ICdzZWxlY3QnLFxuXHRcdFx0J2V2ZW50JzogJ2NoYW5nZScsXG5cdFx0XHQnZGVwZW5kYW50JzogW1xuXHRcdFx0XHR7XG5cdFx0XHRcdFx0J3NlbGVjdG9yJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1udW1iZXJfcmFuZ2Vfc2xpZGVyX2Rpc3BsYXlfdmFsdWVzX2FzJyxcblx0XHRcdFx0XHQndmFsdWUnOiBbICdyYW5nZV9zbGlkZXInIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLW51bWJlcl9yYW5nZV9xdWVyeV90eXBlJyxcblx0XHRcdFx0XHQndmFsdWUnOiBbICdyYW5nZV9jaGVja2JveCcsICdyYW5nZV9tdWx0aXNlbGVjdCcgXSxcblx0XHRcdFx0fSxcblx0XHRcdFx0e1xuXHRcdFx0XHRcdCdzZWxlY3Rvcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtbnVtYmVyX3JhbmdlX3NlbGVjdF9hbGxfaXRlbXNfbGFiZWwnLFxuXHRcdFx0XHRcdCd2YWx1ZSc6IFsgJ3JhbmdlX3JhZGlvJywgJ3JhbmdlX3NlbGVjdCcgXSxcblx0XHRcdFx0fSxcblx0XHRcdFx0e1xuXHRcdFx0XHRcdCdzZWxlY3Rvcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtbnVtYmVyX3JhbmdlX3VzZV9jaG9zZW4nLFxuXHRcdFx0XHRcdCd2YWx1ZSc6IFsgJ3JhbmdlX3NlbGVjdCcsICdyYW5nZV9tdWx0aXNlbGVjdCcgXSxcblx0XHRcdFx0fSxcblx0XHRcdFx0e1xuXHRcdFx0XHRcdCdzZWxlY3Rvcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtbnVtYmVyX3JhbmdlX2VuYWJsZV9tdWx0aXBsZV9maWx0ZXInLFxuXHRcdFx0XHRcdCd2YWx1ZSc6IFsgJ3JhbmdlX2xhYmVsJyBdLFxuXHRcdFx0XHR9LFxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0J3NlbGVjdG9yJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1udW1iZXJfcmFuZ2VfaW5saW5lX2Rpc3BsYXknLFxuXHRcdFx0XHRcdCd2YWx1ZSc6IFsgJ3JhbmdlX2xhYmVsJyBdLFxuXHRcdFx0XHR9LFxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0J3NlbGVjdG9yJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1udW1iZXJfcmFuZ2Vfc2hvd19jb3VudCcsXG5cdFx0XHRcdFx0J3ZhbHVlJzogWyAncmFuZ2VfY2hlY2tib3gnLCAncmFuZ2VfcmFkaW8nLCAncmFuZ2Vfc2VsZWN0JywgJ3JhbmdlX211bHRpc2VsZWN0JywgJ3JhbmdlX2xhYmVsJyBdLFxuXHRcdFx0XHR9LFxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0J3NlbGVjdG9yJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1udW1iZXJfcmFuZ2VfaGlkZV9lbXB0eScsXG5cdFx0XHRcdFx0J3ZhbHVlJzogWyAncmFuZ2VfY2hlY2tib3gnLCAncmFuZ2VfcmFkaW8nLCAncmFuZ2Vfc2VsZWN0JywgJ3JhbmdlX211bHRpc2VsZWN0JywgJ3JhbmdlX2xhYmVsJyBdLFxuXHRcdFx0XHR9LFxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0J3NlbGVjdG9yJzogJy5udW1iZXItZGVjaW1hbC1maWVsZHMnLFxuXHRcdFx0XHRcdCd2YWx1ZSc6IFsgJ3JhbmdlX3NsaWRlcicsICdyYW5nZV9jaGVja2JveCcsICdyYW5nZV9yYWRpbycsICdyYW5nZV9zZWxlY3QnLCAncmFuZ2VfbXVsdGlzZWxlY3QnLCAncmFuZ2VfbGFiZWwnIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRdLFxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0J2hhbmRsZXInOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLW51bWJlcl9yYW5nZV91c2VfY2hvc2VuIGlucHV0Jyxcblx0XHRcdCdoYW5kbGVyVHlwZSc6ICdjaGVja2JveCcsXG5cdFx0XHQnZXZlbnQnOiAnY2hhbmdlJyxcblx0XHRcdCdkZXBlbmRhbnQnOiBbXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLW51bWJlcl9yYW5nZV9jaG9zZW5fbm9fcmVzdWx0c19tZXNzYWdlJyxcblx0XHRcdFx0XHQndmFsdWUnOiBbICcxJyBdLFxuXHRcdFx0XHR9LFxuXHRcdFx0XSxcblx0XHR9LFxuXHRcdHtcblx0XHRcdCdoYW5kbGVyJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1udW1iZXJfZ2V0X29wdGlvbnMgaW5wdXQnLFxuXHRcdFx0J2hhbmRsZXJUeXBlJzogJ3JhZGlvJyxcblx0XHRcdCdldmVudCc6ICdjaGFuZ2UnLFxuXHRcdFx0J2RlcGVuZGFudCc6IFtcblx0XHRcdFx0e1xuXHRcdFx0XHRcdCdzZWxlY3Rvcic6ICcubnVtYmVyLWF1dG9tYXRpYy1vcHRpb25zJyxcblx0XHRcdFx0XHQndmFsdWUnOiBbICdhdXRvbWF0aWNhbGx5JyBdLFxuXHRcdFx0XHR9LFxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0J3NlbGVjdG9yJzogJy5udW1iZXItbWFudWFsLW9wdGlvbnMtdGFibGUnLFxuXHRcdFx0XHRcdCd2YWx1ZSc6IFsgJ21hbnVhbF9lbnRyeScgXSxcblx0XHRcdFx0fSxcblx0XHRcdF0sXG5cdFx0fSxcblx0XHR7XG5cdFx0XHQnaGFuZGxlcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtZGF0ZV9kaXNwbGF5X3R5cGUgc2VsZWN0Jyxcblx0XHRcdCdoYW5kbGVyVHlwZSc6ICdzZWxlY3QnLFxuXHRcdFx0J2V2ZW50JzogJ2NoYW5nZScsXG5cdFx0XHQnZGVwZW5kYW50JzogW1xuXHRcdFx0XHR7XG5cdFx0XHRcdFx0J3NlbGVjdG9yJzogJy5kYXRlLXRvLXVpLW9wdGlvbnMnLFxuXHRcdFx0XHRcdCd2YWx1ZSc6IFsgJ2lucHV0X2RhdGVfcmFuZ2UnIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLWRhdGVfZm9ybWF0Jyxcblx0XHRcdFx0XHQndmFsdWUnOiBbICdpbnB1dF9kYXRlJywgJ2lucHV0X2RhdGVfcmFuZ2UnIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLXRpbWVfcGVyaW9kX3F1ZXJ5X3R5cGUnLFxuXHRcdFx0XHRcdCd2YWx1ZSc6IFsgJ3RpbWVfcGVyaW9kX2NoZWNrYm94JywgJ3RpbWVfcGVyaW9kX211bHRpc2VsZWN0JyBdLFxuXHRcdFx0XHR9LFxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0J3NlbGVjdG9yJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC10aW1lX3BlcmlvZF9zZWxlY3RfYWxsX2l0ZW1zX2xhYmVsJyxcblx0XHRcdFx0XHQndmFsdWUnOiBbICd0aW1lX3BlcmlvZF9yYWRpbycsICd0aW1lX3BlcmlvZF9zZWxlY3QnIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLXRpbWVfcGVyaW9kX3VzZV9jaG9zZW4nLFxuXHRcdFx0XHRcdCd2YWx1ZSc6IFsgJ3RpbWVfcGVyaW9kX3NlbGVjdCcsICd0aW1lX3BlcmlvZF9tdWx0aXNlbGVjdCcgXSxcblx0XHRcdFx0fSxcblx0XHRcdFx0e1xuXHRcdFx0XHRcdCdzZWxlY3Rvcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtdGltZV9wZXJpb2RfZW5hYmxlX211bHRpcGxlX2ZpbHRlcicsXG5cdFx0XHRcdFx0J3ZhbHVlJzogWyAndGltZV9wZXJpb2RfbGFiZWwnIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLXRpbWVfcGVyaW9kX2lubGluZV9kaXNwbGF5Jyxcblx0XHRcdFx0XHQndmFsdWUnOiBbICd0aW1lX3BlcmlvZF9sYWJlbCcgXSxcblx0XHRcdFx0fSxcblx0XHRcdFx0e1xuXHRcdFx0XHRcdCdzZWxlY3Rvcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtdGltZV9wZXJpb2Rfc2hvd19jb3VudCcsXG5cdFx0XHRcdFx0J3ZhbHVlJzogWyAndGltZV9wZXJpb2RfY2hlY2tib3gnLCAndGltZV9wZXJpb2RfcmFkaW8nLCAndGltZV9wZXJpb2Rfc2VsZWN0JywgJ3RpbWVfcGVyaW9kX211bHRpc2VsZWN0JywgJ3RpbWVfcGVyaW9kX2xhYmVsJyBdLFxuXHRcdFx0XHR9LFxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0J3NlbGVjdG9yJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC10aW1lX3BlcmlvZF9oaWRlX2VtcHR5Jyxcblx0XHRcdFx0XHQndmFsdWUnOiBbICd0aW1lX3BlcmlvZF9jaGVja2JveCcsICd0aW1lX3BlcmlvZF9yYWRpbycsICd0aW1lX3BlcmlvZF9zZWxlY3QnLCAndGltZV9wZXJpb2RfbXVsdGlzZWxlY3QnLCAndGltZV9wZXJpb2RfbGFiZWwnIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRdLFxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0J2hhbmRsZXInOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLXRpbWVfcGVyaW9kX3VzZV9jaG9zZW4gaW5wdXQnLFxuXHRcdFx0J2hhbmRsZXJUeXBlJzogJ2NoZWNrYm94Jyxcblx0XHRcdCdldmVudCc6ICdjaGFuZ2UnLFxuXHRcdFx0J2RlcGVuZGFudCc6IFtcblx0XHRcdFx0e1xuXHRcdFx0XHRcdCdzZWxlY3Rvcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtdGltZV9wZXJpb2RfY2hvc2VuX25vX3Jlc3VsdHNfbWVzc2FnZScsXG5cdFx0XHRcdFx0J3ZhbHVlJzogWyAnMScgXSxcblx0XHRcdFx0fSxcblx0XHRcdF0sXG5cdFx0fSxcblx0XHR7XG5cdFx0XHQnaGFuZGxlcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtbGltaXRfdGVybXMgc2VsZWN0Jyxcblx0XHRcdCdoYW5kbGVyVHlwZSc6ICdzZWxlY3QnLFxuXHRcdFx0J2V2ZW50JzogJ2NoYW5nZScsXG5cdFx0XHQnZGVwZW5kYW50JzogW1xuXHRcdFx0XHR7XG5cdFx0XHRcdFx0J3NlbGVjdG9yJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1wYXJlbnRfdGVybScsXG5cdFx0XHRcdFx0J3ZhbHVlJzogWyAnY2hpbGQnIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLWxpbWl0X3Rlcm1zX2J5X2lkJyxcblx0XHRcdFx0XHQndmFsdWUnOiBbICdpbmNsdWRlJywgJ2V4Y2x1ZGUnIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRdLFxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0J2hhbmRsZXInOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLWVuYWJsZV9zb2Z0X2xpbWl0IGlucHV0Jyxcblx0XHRcdCdoYW5kbGVyVHlwZSc6ICdyYWRpbycsXG5cdFx0XHQnZXZlbnQnOiAnY2hhbmdlJyxcblx0XHRcdCdkZXBlbmRhbnQnOiBbXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLXNvZnRfbGltaXQnLFxuXHRcdFx0XHRcdCd2YWx1ZSc6IFsgJ2VuYWJsZScgXSxcblx0XHRcdFx0fSxcblx0XHRcdF0sXG5cdFx0fSxcblx0XHR7XG5cdFx0XHQnaGFuZGxlcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtY3VzdG9tLXRheG9ub215IHNlbGVjdCcsXG5cdFx0XHQnaGFuZGxlclR5cGUnOiAnc2VsZWN0Jyxcblx0XHRcdCdldmVudCc6ICdjaGFuZ2UnLFxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0J2hhbmRsZXInOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLXBvc3RfcHJvcGVydHkgc2VsZWN0Jyxcblx0XHRcdCdoYW5kbGVyVHlwZSc6ICdzZWxlY3QnLFxuXHRcdFx0J2V2ZW50JzogJ2NoYW5nZScsXG5cdFx0fSxcblx0XHR7XG5cdFx0XHQnaGFuZGxlcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtbGltaXRfb3B0aW9ucyBzZWxlY3QnLFxuXHRcdFx0J2hhbmRsZXJUeXBlJzogJ3NlbGVjdCcsXG5cdFx0XHQnZXZlbnQnOiAnY2hhbmdlJyxcblx0XHRcdCdkZXBlbmRhbnQnOiBbXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLWxpbWl0X3ZhbHVlc19ieV9pZCcsXG5cdFx0XHRcdFx0J3ZhbHVlJzogWyAnaW5jbHVkZScsICdleGNsdWRlJyBdLFxuXHRcdFx0XHR9LFxuXHRcdFx0XSxcblx0XHR9LFxuXHRcdHtcblx0XHRcdCdoYW5kbGVyJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1lbmFibGVfYWNjb3JkaW9uIGlucHV0Jyxcblx0XHRcdCdoYW5kbGVyVHlwZSc6ICdyYWRpbycsXG5cdFx0XHQnZXZlbnQnOiAnY2hhbmdlJyxcblx0XHRcdCdkZXBlbmRhbnQnOiBbXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLWFjY29yZGlvbl9kZWZhdWx0X3N0YXRlJyxcblx0XHRcdFx0XHQndmFsdWUnOiBbICd5ZXMnIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRdLFxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0J2hhbmRsZXInOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLWVuYWJsZV9tdWx0aXBsZV9maWx0ZXIgaW5wdXQnLFxuXHRcdFx0J2hhbmRsZXJUeXBlJzogJ2NoZWNrYm94Jyxcblx0XHRcdCdldmVudCc6ICdjaGFuZ2UnLFxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0J2hhbmRsZXInOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLXVzZV9jYXRlZ29yeV9pbWFnZXMgaW5wdXQnLFxuXHRcdFx0J2hhbmRsZXJUeXBlJzogJ2NoZWNrYm94Jyxcblx0XHRcdCdldmVudCc6ICdjaGFuZ2UnLFxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0J2hhbmRsZXInOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLW51bWJlcl9yYW5nZV9lbmFibGVfbXVsdGlwbGVfZmlsdGVyIGlucHV0Jyxcblx0XHRcdCdoYW5kbGVyVHlwZSc6ICdjaGVja2JveCcsXG5cdFx0XHQnZXZlbnQnOiAnY2hhbmdlJyxcblx0XHR9LFxuXHRcdHtcblx0XHRcdCdoYW5kbGVyJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC10aW1lX3BlcmlvZF9lbmFibGVfbXVsdGlwbGVfZmlsdGVyIGlucHV0Jyxcblx0XHRcdCdoYW5kbGVyVHlwZSc6ICdjaGVja2JveCcsXG5cdFx0XHQnZXZlbnQnOiAnY2hhbmdlJyxcblx0XHR9LFxuXHRdO1xuXG5cdGZ1bmN0aW9uIF9oYW5kbGVUb2dnbGVSZXF1ZXN0KCBkYXRhLCBjdXJyZW50U2VsZWN0b3IsIHZhbHVlICkge1xuXHRcdGNvbnN0ICRmaWVsZCAgICAgID0gY3VycmVudFNlbGVjdG9yLmNsb3Nlc3QoICcud2NhcGYtZm9ybS1maWVsZCcgKTtcblx0XHRjb25zdCBoYW5kbGVyICAgICA9IGRhdGFbICdoYW5kbGVyJyBdO1xuXHRcdGNvbnN0IGhhbmRsZXJUeXBlID0gZGF0YVsgJ2hhbmRsZXJUeXBlJyBdO1xuXHRcdGNvbnN0IGRlcGVuZGFudCAgID0gZGF0YVsgJ2RlcGVuZGFudCcgXTtcblxuXHRcdGxldCBfdmFsdWUgPSB2YWx1ZTtcblxuXHRcdGlmICggJ2NoZWNrYm94JyA9PT0gaGFuZGxlclR5cGUgKSB7XG5cdFx0XHRfdmFsdWUgPSBjdXJyZW50U2VsZWN0b3IuaXMoICc6Y2hlY2tlZCcgKSA/ICcxJyA6ICcwJztcblx0XHR9XG5cblx0XHRpZiAoICdyYWRpbycgPT09IGhhbmRsZXJUeXBlICkge1xuXHRcdFx0X3ZhbHVlID0gJGZpZWxkLmZpbmQoIGhhbmRsZXIgKyAnOmNoZWNrZWQnICkudmFsKCk7XG5cdFx0fVxuXG5cdFx0JC5lYWNoKCBkZXBlbmRhbnQsIGZ1bmN0aW9uKCBpZCwgZCApIHtcblx0XHRcdGNvbnN0ICRzZWxlY3RvciAgID0gJGZpZWxkLmZpbmQoIGRbICdzZWxlY3RvcicgXSApO1xuXHRcdFx0Y29uc3QgdmFsaWRWYWx1ZXMgPSBkWyAndmFsdWUnIF07XG5cblx0XHRcdGlmICggdmFsaWRWYWx1ZXMuaW5jbHVkZXMoIF92YWx1ZSApICkge1xuXHRcdFx0XHQkc2VsZWN0b3Iuc2hvdygpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0JHNlbGVjdG9yLmhpZGUoKTtcblx0XHRcdH1cblx0XHR9ICk7XG5cblx0XHQkc2VhcmNoRm9ybS50cmlnZ2VyKCAnYWZ0ZXJfdG9nZ2xlX3JlcXVlc3QnLCBbIGhhbmRsZXIsIF92YWx1ZSwgJGZpZWxkIF0gKTtcblx0fVxuXG5cdGZ1bmN0aW9uIGhhbmRsZVRvZ2dsZVJlcXVlc3QoIGRhdGEsIGN1cnJlbnRTZWxlY3RvciwgdmFsdWUgKSB7XG5cdFx0aWYgKCBudWxsID09PSBjdXJyZW50U2VsZWN0b3IgKSB7XG5cdFx0XHRjb25zdCBoYW5kbGVyICA9IGRhdGFbICdoYW5kbGVyJyBdO1xuXHRcdFx0Y29uc3QgJGhhbmRsZXIgPSAkKCBoYW5kbGVyICk7XG5cblx0XHRcdCQuZWFjaCggJGhhbmRsZXIsIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRjb25zdCBfdGhpcyAgPSAkKCB0aGlzICk7XG5cdFx0XHRcdGNvbnN0IF92YWx1ZSA9IF90aGlzLnZhbCgpO1xuXHRcdFx0XHRfaGFuZGxlVG9nZ2xlUmVxdWVzdCggZGF0YSwgX3RoaXMsIF92YWx1ZSApO1xuXHRcdFx0fSApO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRfaGFuZGxlVG9nZ2xlUmVxdWVzdCggZGF0YSwgY3VycmVudFNlbGVjdG9yLCB2YWx1ZSApO1xuXHRcdH1cblx0fVxuXG5cdGZ1bmN0aW9uIHNldHVwU2VhcmNoRm9ybSggaW5pdGFsID0gZmFsc2UgKSB7XG5cdFx0JC5lYWNoKCBkZXBlbmRhbnREYXRhLCBmdW5jdGlvbiggaSwgZGF0YSApIHtcblx0XHRcdGNvbnN0IGhhbmRsZXIgPSBkYXRhWyAnaGFuZGxlcicgXTtcblx0XHRcdGNvbnN0IGV2ZW50ICAgPSBkYXRhWyAnZXZlbnQnIF07XG5cblx0XHRcdGhhbmRsZVRvZ2dsZVJlcXVlc3QoIGRhdGEsIG51bGwsIG51bGwgKTtcblxuXHRcdFx0aWYgKCBpbml0YWwgKSB7XG5cdFx0XHRcdCRzZWFyY2hGb3JtLm9uKCBldmVudCwgaGFuZGxlciwgZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0Y29uc3QgX3RoaXMgID0gJCggdGhpcyApO1xuXHRcdFx0XHRcdGNvbnN0IF92YWx1ZSA9ICQoIHRoaXMgKS52YWwoKTtcblx0XHRcdFx0XHRoYW5kbGVUb2dnbGVSZXF1ZXN0KCBkYXRhLCBfdGhpcywgX3ZhbHVlICk7XG5cdFx0XHRcdH0gKTtcblx0XHRcdH1cblx0XHR9ICk7XG5cdH1cblxuXHRzZXR1cFNlYXJjaEZvcm0oIHRydWUgKTtcblxuXHQkc2VhcmNoRm9ybS5vbiggJ2ZpZWxkX2FkZGVkJywgZnVuY3Rpb24oKSB7XG5cdFx0Ly8gVG9nZ2xlIHRoZSB2aXNpYmlsaXR5IG9mIHN1YmZpZWxkcy5cblx0XHRzZXR1cFNlYXJjaEZvcm0oKTtcblx0fSApO1xuXG59ICk7XG4iXX0=
