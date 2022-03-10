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
function initManualOptionsTable(tableIdentifier, valueIdentifier, rowTemplateId, rowDefaultOptions) {
  var $ = jQuery;
  var $searchForm = $('#search-form');
  var fieldIdentifier = '.wcapf-form-field';
  var rowsIdentifier = '.field-table-body-rows';
  var rowIdentifier = '.row-item';

  function initSortableTable($selector) {
    console.log('update called for', $selector);
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
      var row = [];
      $item.find('[data-name]').each(function (fieldIndex, field) {
        var $field = $(field);
        row.push($field.val());
      });

      _rows.push(row);
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
  var rowDefaultOptions = {
    value: '',
    label: ''
  };
  initManualOptionsTable(tableIdentifier, valueIdentifier, rowTemplateId, rowDefaultOptions);
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
    'handler': '.wcapf-form-sub-field-date_display_type select',
    'handlerType': 'select',
    'event': 'change',
    'dependant': [{
      'selector': '.date-to-ui-options',
      'value': ['input_date_range']
    }, {
      'selector': '.wcapf-form-sub-field-date_format',
      'value': ['input_date', 'input_date_range']
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
    'handler': '.wcapf-form-sub-field-rating_get_options input',
    'handlerType': 'radio',
    'event': 'change',
    'dependant': [{
      'selector': '.rating-manual-options',
      'value': ['manual_entry']
    }]
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImRpc3BsYXktdHlwZS1maWVsZHMuanMiLCJtYW51YWwtb3B0aW9ucy10YWJsZS5qcyIsIm51bWJlci11aS1vcHRpb25zLmpzIiwicHJvZHVjdC1zdGF0dXMtdGFibGUuanMiLCJzZWFyY2gtZm9ybS5qcyIsInRvZ2dsZVZpc2liaWxpdHkuanMiXSwibmFtZXMiOlsialF1ZXJ5IiwiZG9jdW1lbnQiLCJyZWFkeSIsIiQiLCIkc2VhcmNoRm9ybSIsIm9uIiwiZSIsImhhbmRsZXIiLCJ2YWx1ZSIsIiRmaWVsZCIsIiRub1Jlc3VsdHMiLCJmaW5kIiwiJGFsbEl0ZW1zTGFiZWwiLCJ1c2VDaG9zZW4iLCJpcyIsInNob3ciLCJoaWRlIiwiZGlzcGxheVR5cGUiLCJ2YWwiLCJpbml0TWFudWFsT3B0aW9uc1RhYmxlIiwidGFibGVJZGVudGlmaWVyIiwidmFsdWVJZGVudGlmaWVyIiwicm93VGVtcGxhdGVJZCIsInJvd0RlZmF1bHRPcHRpb25zIiwiZmllbGRJZGVudGlmaWVyIiwicm93c0lkZW50aWZpZXIiLCJyb3dJZGVudGlmaWVyIiwiaW5pdFNvcnRhYmxlVGFibGUiLCIkc2VsZWN0b3IiLCJjb25zb2xlIiwibG9nIiwic29ydGFibGUiLCJvcGFjaXR5IiwicmV2ZXJ0IiwiY3Vyc29yIiwiYXhpcyIsImhhbmRsZSIsInBsYWNlaG9sZGVyIiwidXBkYXRlIiwidGFyZ2V0IiwiY2xvc2VzdCIsInRyaWdnZXJPcHRpb25zQ2hhbmdlIiwiZGlzYWJsZVNlbGVjdGlvbiIsInRhYmxlUm93c0lkZW50aWZpZXIiLCJ1aSIsIml0ZW0iLCIkdmFsdWVIb2xkZXIiLCIkcm93cyIsIl9yb3dzIiwiZWFjaCIsImkiLCJfaXRlbSIsIiRpdGVtIiwicm93IiwiZmllbGRJbmRleCIsImZpZWxkIiwicHVzaCIsInJhd1ZhbHVlcyIsImVuY29kZVVSSUNvbXBvbmVudCIsIkpTT04iLCJzdHJpbmdpZnkiLCJ0cmlnZ2VyUmVtb3ZlT3B0aW9uIiwiJG9wdGlvbnNUYWJsZSIsInRhYmxlUm93cyIsImNoaWxkcmVuIiwibGVuZ3RoIiwicmVtb3ZlQ2xhc3MiLCJyZW1vdmVCdG5JZGVudGlmaWVyIiwicmVtb3ZlIiwiY2xlYXJPcHRpb25zQnRuSWRlbnRpZmllciIsImVtcHR5IiwiYWRkT3B0aW9uQnRuSWRlbnRpZmllciIsInRlbXBsYXRlIiwid3AiLCJyZW5kZXJlZCIsIiR0YWJsZSIsImFwcGVuZCIsImhhc0NsYXNzIiwiYWRkQ2xhc3MiLCJ0ZXh0RmllbGRzSWRlbnRpZmllciIsInNlbGVjdEZpZWxkc0lkZW50aWZpZXIiLCJ0YWJsZUlkIiwidG9nZ2xlTnVtYmVyTWluVmFsdWVGaWVsZCIsIiRlbG0iLCIkdGV4dEZpZWxkIiwiYXR0ciIsInJlbW92ZUF0dHIiLCIkdGhpcyIsInRvZ2dsZU51bWJlck1heFZhbHVlRmllbGQiLCJsYWJlbCIsInRvdGFsRmllbGRJbnN0YW5jZXMiLCJzZWFyY2hGb3JtIiwicmVtb3ZlUGxhY2Vob2xkZXIiLCJ1bmlxdWVJZCIsImVsZW1lbnRzIiwiZWxlbWVudCIsIm9sZFZhbHVlIiwibmV3VmFsdWUiLCJyZXBsYWNlIiwiaW5zZXJ0RmllbGRTdWJGaWVsZHMiLCJ0eXBlIiwicGFyc2VJbnQiLCJmaWVsZFR5cGUiLCJ3cmFwcGVyIiwicHJlcGVuZCIsInRyaWdnZXIiLCJ1cGRhdGVGaWVsZHNQb3NpdGlvbiIsImlucHV0cyIsIm5iRWxlbXMiLCJpZHgiLCJtYWtlRmllbGRSZWFkeSIsInRvZ2dsZUJ0biIsImlkZW50aWZpZXIiLCJjb250YWluZXIiLCJjYW5jZWwiLCJpdGVtcyIsImNvbm5lY3RXaXRoIiwic3RvcCIsInN0YXJ0IiwiYXBwZW5kVG8iLCJwYXJlbnQiLCJvbkRyYWdTdGFydCIsIm9uRHJhZ1N0b3AiLCJkcmFnZ2FibGUiLCJjb25uZWN0VG9Tb3J0YWJsZSIsImhlbHBlciIsInRvZ2dsZUZpZWxkIiwid2lkZ2V0IiwiaW5zaWRlIiwiaXNFeHBhbmQiLCJ0b2dnbGVFeHBhbmQiLCJzbGlkZVRvZ2dsZSIsInRvZ2dsZUNsYXNzIiwiZm9jdXNGaWVsZCIsImNsYXNzTGlzdCIsImNvbnRhaW5zIiwiYWN0aW9uIiwiZm9jdXMiLCJyZW1vdmVGaWVsZCIsInNsaWRlVXAiLCJpbml0aWFsRm9ybVN0YXRlIiwic2VyaWFsaXplQXJyYXkiLCJzaG93TWVzc2FnZSIsIm1lc3NhZ2UiLCJodG1sIiwic2xpZGVEb3duIiwic2V0VGltZW91dCIsInNhdmVGb3JtIiwiYnV0dG9uIiwiZm9ybURhdGEiLCJva0NhbGxiYWNrIiwiZXJyQ2FsbGJhY2siLCJhamF4IiwicG9zdCIsImRvbmUiLCJmYWlsIiwiZGVwZW5kYW50RGF0YSIsIl9oYW5kbGVUb2dnbGVSZXF1ZXN0IiwiZGF0YSIsImN1cnJlbnRTZWxlY3RvciIsImhhbmRsZXJUeXBlIiwiZGVwZW5kYW50IiwiX3ZhbHVlIiwiaWQiLCJkIiwidmFsaWRWYWx1ZXMiLCJpbmNsdWRlcyIsImhhbmRsZVRvZ2dsZVJlcXVlc3QiLCIkaGFuZGxlciIsIl90aGlzIiwic2V0dXBTZWFyY2hGb3JtIiwiaW5pdGFsIiwiZXZlbnQiXSwibWFwcGluZ3MiOiI7O0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBQSxNQUFNLENBQUVDLFFBQUYsQ0FBTixDQUFtQkMsS0FBbkIsQ0FBMEIsVUFBVUMsQ0FBVixFQUFjO0FBRXZDLE1BQU1DLFdBQVcsR0FBR0QsQ0FBQyxDQUFFLGNBQUYsQ0FBckIsQ0FGdUMsQ0FJdkM7O0FBQ0FDLEVBQUFBLFdBQVcsQ0FBQ0MsRUFBWixDQUFnQixzQkFBaEIsRUFBd0MsVUFBVUMsQ0FBVixFQUFhQyxPQUFiLEVBQXNCQyxLQUF0QixFQUE2QkMsTUFBN0IsRUFBc0M7QUFDN0UsUUFBSyxnREFBZ0RGLE9BQXJELEVBQStEO0FBQzlELFVBQU1HLFVBQVUsR0FBT0QsTUFBTSxDQUFDRSxJQUFQLENBQWEsaURBQWIsQ0FBdkI7QUFDQSxVQUFNQyxjQUFjLEdBQUdILE1BQU0sQ0FBQ0UsSUFBUCxDQUFhLHVDQUFiLENBQXZCO0FBQ0EsVUFBTUUsU0FBUyxHQUFRSixNQUFN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QUFuQjs7QUFFQSxVQUFLYSxNQUFMLEVBQWM7QUFDYnZLLFFBQUFBLFdBQVcsQ0FBQ0MsRUFBWixDQUFnQnVLLEtBQWhCLEVBQXVCckssT0FBdkIsRUFBZ0MsWUFBVztBQUMxQyxjQUFNa0ssS0FBSyxHQUFJdEssQ0FBQyxDQUFFLElBQUYsQ0FBaEI7O0FBQ0EsY0FBTStKLE1BQU0sR0FBRy9KLENBQUMsQ0FBRSxJQUFGLENBQUQsQ0FBVWUsR0FBVixFQUFmOztBQUNBcUosVUFBQUEsbUJBQW1CLENBQUVULElBQUYsRUFBUVcsS0FBUixFQUFlUCxNQUFmLENBQW5CO0FBQ0EsU0FKRDtBQUtBO0FBQ0QsS0FiRDtBQWNBOztBQUVEUSxFQUFBQSxlQUFlLENBQUUsSUFBRixDQUFmO0FBRUF0SyxFQUFBQSxXQUFXLENBQUNDLEVBQVosQ0FBZ0IsYUFBaEIsRUFBK0IsWUFBVztBQUN6QztBQUNBcUssSUFBQUEsZUFBZTtBQUNmLEdBSEQ7QUFLQSxDQXBTRCIsImZpbGUiOiJ3Yy1hamF4LXByb2R1Y3QtZmlsdGVyLWFkbWluLXNjcmlwdHMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIERpc3BsYXkgdHlwZSBmaWVsZHMuXG4gKlxuICogQHNpbmNlICAgICAgMy4wLjBcbiAqIEBwYWNrYWdlICAgIHdjLWFqYXgtcHJvZHVjdC1maWx0ZXJcbiAqIEBzdWJwYWNrYWdlIHdjLWFqYXgtcHJvZHVjdC1maWx0ZXIvYWRtaW4vc3JjL2pzXG4gKiBAYXV0aG9yICAgICBNYWludWwgSGFzc2FuIE1haW5cbiAqL1xuXG5qUXVlcnkoIGRvY3VtZW50ICkucmVhZHkoIGZ1bmN0aW9uKCAkICkge1xuXG5cdGNvbnN0ICRzZWFyY2hGb3JtID0gJCggJyNzZWFyY2gtZm9ybScgKTtcblxuXHQvLyBPdmVycmlkZSBuby1yZXN1bHRzLW1lc3NhZ2UsIGFsbC1pdGVtcy1sYWJlbCBmaWVsZCdzIHRvZ2dsZSB2aXNpYmlsaXR5IHdoZW4gdGV4dCBkaXNwbGF5IHR5cGUgaXMgY2hhbmdlZC5cblx0JHNlYXJjaEZvcm0ub24oICdhZnRlcl90b2dnbGVfcmVxdWVzdCcsIGZ1bmN0aW9uKCBlLCBoYW5kbGVyLCB2YWx1ZSwgJGZpZWxkICkge1xuXHRcdGlmICggJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1kaXNwbGF5X3R5cGUgc2VsZWN0JyA9PT0gaGFuZGxlciApIHtcblx0XHRcdGNvbnN0ICRub1Jlc3VsdHMgICAgID0gJGZpZWxkLmZpbmQoICcud2NhcGYtZm9ybS1zdWItZmllbGQtY2hvc2VuX25vX3Jlc3VsdHNfbWVzc2FnZScgKTtcblx0XHRcdGNvbnN0ICRhbGxJdGVtc0xhYmVsID0gJGZpZWxkLmZpbmQoICcud2NhcGYtZm9ybS1zdWItZmllbGQtYWxsX2l0ZW1zX2xhYmVsJyApO1xuXHRcdFx0Y29uc3QgdXNlQ2hvc2VuICAgICAgPSAkZmllbGQuZmluZCggJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC11c2VfY2hvc2VuIGlucHV0JyApLmlzKCAnOmNoZWNrZWQnICk7XG5cblx0XHRcdGlmICggdXNlQ2hvc2VuICYmICggJ3NlbGVjdCcgPT09IHZhbHVlIHx8ICdtdWx0aS1zZWxlY3QnID09PSB2YWx1ZSApICkge1xuXHRcdFx0XHQkbm9SZXN1bHRzLnNob3coKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdCRub1Jlc3VsdHMuaGlkZSgpO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAoICggJ3JhZGlvJyA9PT0gdmFsdWUgfHwgJ3NlbGVjdCcgPT09IHZhbHVlICkgfHwgKCAnbXVsdGktc2VsZWN0JyA9PT0gdmFsdWUgJiYgdXNlQ2hvc2VuICkgKSB7XG5cdFx0XHRcdCRhbGxJdGVtc0xhYmVsLnNob3coKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdCRhbGxJdGVtc0xhYmVsLmhpZGUoKTtcblx0XHRcdH1cblx0XHR9XG5cdH0gKTtcblxuXHQvLyBPdmVycmlkZSBuby1yZXN1bHRzLW1lc3NhZ2UsIGFsbC1pdGVtcy1sYWJlbCBmaWVsZCdzIHRvZ2dsZSB2aXNpYmlsaXR5IHdoZW4gdGV4dCB1c2UgY2hvc2VuIGlzIGNoYW5nZWQuXG5cdCRzZWFyY2hGb3JtLm9uKCAnYWZ0ZXJfdG9nZ2xlX3JlcXVlc3QnLCBmdW5jdGlvbiggZSwgaGFuZGxlciwgdmFsdWUsICRmaWVsZCApIHtcblx0XHRpZiAoICcud2NhcGYtZm9ybS1zdWItZmllbGQtdXNlX2Nob3NlbiBpbnB1dCcgPT09IGhhbmRsZXIgKSB7XG5cdFx0XHRjb25zdCAkbm9SZXN1bHRzICAgICA9ICRmaWVsZC5maW5kKCAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLWNob3Nlbl9ub19yZXN1bHRzX21lc3NhZ2UnICk7XG5cdFx0XHRjb25zdCAkYWxsSXRlbXNMYWJlbCA9ICRmaWVsZC5maW5kKCAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLWFsbF9pdGVtc19sYWJlbCcgKTtcblx0XHRcdGNvbnN0IGRpc3BsYXlUeXBlICAgID0gJGZpZWxkLmZpbmQoICcud2NhcGYtZm9ybS1zdWItZmllbGQtZGlzcGxheV90eXBlIHNlbGVjdCcgKS52YWwoKTtcblxuXHRcdFx0aWYgKCAnMScgPT09IHZhbHVlICYmICggJ3NlbGVjdCcgPT09IGRpc3BsYXlUeXBlIHx8ICdtdWx0aS1zZWxlY3QnID09PSBkaXNwbGF5VHlwZSApICkge1xuXHRcdFx0XHQkbm9SZXN1bHRzLnNob3coKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdCRub1Jlc3VsdHMuaGlkZSgpO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAoXG5cdFx0XHRcdCggJzEnID09PSB2YWx1ZSAmJiAnbXVsdGktc2VsZWN0JyA9PT0gZGlzcGxheVR5cGUgKVxuXHRcdFx0XHR8fCAoICdyYWRpbycgPT09IGRpc3BsYXlUeXBlIHx8ICdzZWxlY3QnID09PSBkaXNwbGF5VHlwZSApXG5cdFx0XHQpIHtcblx0XHRcdFx0JGFsbEl0ZW1zTGFiZWwuc2hvdygpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0JGFsbEl0ZW1zTGFiZWwuaGlkZSgpO1xuXHRcdFx0fVxuXHRcdH1cblx0fSApO1xuXG59ICk7XG4iLCIvKipcbiAqIE1hbnVhbCBPcHRpb25zJyB0YWJsZSBmdW5jdGlvbi5cbiAqXG4gKiBAc2luY2UgICAgICAzLjAuMFxuICogQHBhY2thZ2UgICAgd2MtYWpheC1wcm9kdWN0LWZpbHRlclxuICogQHN1YnBhY2thZ2Ugd2MtYWpheC1wcm9kdWN0LWZpbHRlci9hZG1pbi9zcmMvanNcbiAqIEBhdXRob3IgICAgIE1haW51bCBIYXNzYW4gTWFpblxuICovXG5cbi8qKlxuICogQHBhcmFtIHRhYmxlSWRlbnRpZmllclxuICogQHBhcmFtIHZhbHVlSWRlbnRpZmllclxuICogQHBhcmFtIHJvd1RlbXBsYXRlSWRcbiAqIEBwYXJhbSByb3dEZWZhdWx0T3B0aW9uc1xuICovXG5mdW5jdGlvbiBpbml0TWFudWFsT3B0aW9uc1RhYmxlKCB0YWJsZUlkZW50aWZpZXIsIHZhbHVlSWRlbnRpZmllciwgcm93VGVtcGxhdGVJZCwgcm93RGVmYXVsdE9wdGlvbnMgKSB7XG5cdGNvbnN0ICQgPSBqUXVlcnk7XG5cblx0Y29uc3QgJHNlYXJjaEZvcm0gPSAkKCAnI3NlYXJjaC1mb3JtJyApO1xuXG5cdGNvbnN0IGZpZWxkSWRlbnRpZmllciA9ICcud2NhcGYtZm9ybS1maWVsZCc7XG5cdGNvbnN0IHJvd3NJZGVudGlmaWVyICA9ICcuZmllbGQtdGFibGUtYm9keS1yb3dzJztcblx0Y29uc3Qgcm93SWRlbnRpZmllciAgID0gJy5yb3ctaXRlbSc7XG5cblx0ZnVuY3Rpb24gaW5pdFNvcnRhYmxlVGFibGUoICRzZWxlY3RvciApIHtcblx0XHRjb25zb2xlLmxvZyggJ3VwZGF0ZSBjYWxsZWQgZm9yJywgJHNlbGVjdG9yICk7XG5cblx0XHQkc2VsZWN0b3Iuc29ydGFibGUoIHtcblx0XHRcdG9wYWNpdHk6IDAuOCxcblx0XHRcdHJldmVydDogZmFsc2UsXG5cdFx0XHRjdXJzb3I6ICdtb3ZlJyxcblx0XHRcdGF4aXM6ICd5Jyxcblx0XHRcdGhhbmRsZTogJy5tb3ZlLW9wdGlvbnMtaGFuZGxlcicsXG5cdFx0XHRwbGFjZWhvbGRlcjogJ3dpZGdldC1wbGFjZWhvbGRlcicsXG5cdFx0XHR1cGRhdGU6IGZ1bmN0aW9uKCBlICkge1xuXHRcdFx0XHRjb25zdCAkZmllbGQgPSAkKCBlLnRhcmdldCApLmNsb3Nlc3QoICcud2NhcGYtZm9ybS1maWVsZCcgKTtcblxuXHRcdFx0XHR0cmlnZ2VyT3B0aW9uc0NoYW5nZSggJGZpZWxkICk7XG5cdFx0XHR9XG5cdFx0fSApLmRpc2FibGVTZWxlY3Rpb24oKTtcblx0fVxuXG5cdGNvbnN0IHRhYmxlUm93c0lkZW50aWZpZXIgPSB0YWJsZUlkZW50aWZpZXIgKyAnICcgKyByb3dzSWRlbnRpZmllcjtcblxuXHQvLyBJbml0IHRoZSBzb3J0YWJsZSB0YWJsZSBhZnRlciBwYWdlIGxvYWRzLlxuXHRpbml0U29ydGFibGVUYWJsZSggJHNlYXJjaEZvcm0uZmluZCggdGFibGVSb3dzSWRlbnRpZmllciApICk7XG5cblx0Ly8gSW5pdCB0aGUgc29ydGFibGUgdGFibGUgYWZ0ZXIgdGhlIGZpZWxkIGlzIGFkZGVkLlxuXHQkc2VhcmNoRm9ybS5vbiggJ2ZpZWxkX2FkZGVkJywgZnVuY3Rpb24oIGUsIHVpICkge1xuXHRcdGluaXRTb3J0YWJsZVRhYmxlKCAkKCB1aS5pdGVtLmZpbmQoIHRhYmxlUm93c0lkZW50aWZpZXIgKSApICk7XG5cdH0gKTtcblxuXHRmdW5jdGlvbiB0cmlnZ2VyT3B0aW9uc0NoYW5nZSggJGZpZWxkICkge1xuXHRcdGNvbnN0ICR2YWx1ZUhvbGRlciA9ICRmaWVsZC5maW5kKCB2YWx1ZUlkZW50aWZpZXIgKTtcblx0XHRjb25zdCAkcm93cyAgICAgICAgPSAkZmllbGQuZmluZCggdGFibGVSb3dzSWRlbnRpZmllciApO1xuXHRcdGNvbnN0IF9yb3dzICAgICAgICA9IFtdO1xuXG5cdFx0JHJvd3MuZmluZCggJy5yb3ctaXRlbScgKS5lYWNoKCBmdW5jdGlvbiggaSwgX2l0ZW0gKSB7XG5cdFx0XHRjb25zdCAkaXRlbSA9ICQoIF9pdGVtICk7XG5cdFx0XHRjb25zdCByb3cgICA9IFtdO1xuXG5cdFx0XHQkaXRlbS5maW5kKCAnW2RhdGEtbmFtZV0nICkuZWFjaCggZnVuY3Rpb24oIGZpZWxkSW5kZXgsIGZpZWxkICkge1xuXHRcdFx0XHRjb25zdCAkZmllbGQgPSAkKCBmaWVsZCApO1xuXG5cdFx0XHRcdHJvdy5wdXNoKCAkZmllbGQudmFsKCkgKTtcblx0XHRcdH0gKTtcblxuXHRcdFx0X3Jvd3MucHVzaCggcm93ICk7XG5cdFx0fSApO1xuXG5cdFx0Y29uc3QgcmF3VmFsdWVzID0gZW5jb2RlVVJJQ29tcG9uZW50KCBKU09OLnN0cmluZ2lmeSggX3Jvd3MgKSApO1xuXHRcdCR2YWx1ZUhvbGRlci52YWwoIHJhd1ZhbHVlcyApO1xuXHR9XG5cblx0ZnVuY3Rpb24gdHJpZ2dlclJlbW92ZU9wdGlvbiggJGZpZWxkICkge1xuXHRcdGNvbnN0ICRvcHRpb25zVGFibGUgPSAkZmllbGQuZmluZCggdGFibGVJZGVudGlmaWVyICk7XG5cdFx0Y29uc3QgdGFibGVSb3dzICAgICA9ICRmaWVsZC5maW5kKCB0YWJsZVJvd3NJZGVudGlmaWVyICkuY2hpbGRyZW4oKTtcblxuXHRcdGlmICggMiA+IHRhYmxlUm93cy5sZW5ndGggKSB7XG5cdFx0XHQkb3B0aW9uc1RhYmxlLnJlbW92ZUNsYXNzKCAnaGFzLW9wdGlvbnMnICk7XG5cdFx0fVxuXHR9XG5cblx0Ly8gUmVtb3ZlIE9wdGlvblxuXHRjb25zdCByZW1vdmVCdG5JZGVudGlmaWVyID0gdGFibGVJZGVudGlmaWVyICsgJyAucmVtb3ZlLW9wdGlvbic7XG5cblx0JHNlYXJjaEZvcm0ub24oICdjbGljaycsIHJlbW92ZUJ0bklkZW50aWZpZXIsIGZ1bmN0aW9uKCkge1xuXHRcdGNvbnN0ICRpdGVtICA9ICQoIHRoaXMgKS5jbG9zZXN0KCByb3dJZGVudGlmaWVyICk7XG5cdFx0Y29uc3QgJGZpZWxkID0gJGl0ZW0uY2xvc2VzdCggZmllbGRJZGVudGlmaWVyICk7XG5cblx0XHR0cmlnZ2VyUmVtb3ZlT3B0aW9uKCAkZmllbGQgKTtcblxuXHRcdCRpdGVtLnJlbW92ZSgpO1xuXG5cdFx0dHJpZ2dlck9wdGlvbnNDaGFuZ2UoICRmaWVsZCApO1xuXHR9ICk7XG5cblx0Ly8gQ2xlYXIgQWxsIE9wdGlvbnNcblx0Y29uc3QgY2xlYXJPcHRpb25zQnRuSWRlbnRpZmllciA9IHRhYmxlSWRlbnRpZmllciArICcgLmNsZWFyLW9wdGlvbnMnO1xuXG5cdCRzZWFyY2hGb3JtLm9uKCAnY2xpY2snLCBjbGVhck9wdGlvbnNCdG5JZGVudGlmaWVyLCBmdW5jdGlvbigpIHtcblx0XHRjb25zdCAkZmllbGQgPSAkKCB0aGlzICkuY2xvc2VzdCggZmllbGRJZGVudGlmaWVyICk7XG5cblx0XHQkZmllbGQuZmluZCggdGFibGVSb3dzSWRlbnRpZmllciApLmVtcHR5KCk7XG5cblx0XHR0cmlnZ2VyUmVtb3ZlT3B0aW9uKCAkZmllbGQgKTtcblx0XHR0cmlnZ2VyT3B0aW9uc0NoYW5nZSggJGZpZWxkICk7XG5cdH0gKTtcblxuXHQvLyBBZGQgTmV3IE9wdGlvblxuXHRjb25zdCBhZGRPcHRpb25CdG5JZGVudGlmaWVyID0gdGFibGVJZGVudGlmaWVyICsgJyAuYWRkLW9wdGlvbic7XG5cblx0JHNlYXJjaEZvcm0ub24oICdjbGljaycsIGFkZE9wdGlvbkJ0bklkZW50aWZpZXIsIGZ1bmN0aW9uKCkge1xuXHRcdC8vIEJhaWwgb3V0IGlmIG5vIHRtcGwgZm91bmQgZm9yIHRoZSB0eXBlLlxuXHRcdGlmICggISBqUXVlcnkoICcjdG1wbC0nICsgcm93VGVtcGxhdGVJZCApLmxlbmd0aCApIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHRjb25zdCAkZmllbGQgPSAkKCB0aGlzICkuY2xvc2VzdCggZmllbGRJZGVudGlmaWVyICk7XG5cblx0XHRjb25zdCB0ZW1wbGF0ZSA9IHdwLnRlbXBsYXRlKCByb3dUZW1wbGF0ZUlkICk7XG5cdFx0Y29uc3QgcmVuZGVyZWQgPSB0ZW1wbGF0ZSggcm93RGVmYXVsdE9wdGlvbnMgKTtcblx0XHRjb25zdCAkdGFibGUgICA9ICRmaWVsZC5maW5kKCB0YWJsZUlkZW50aWZpZXIgKTtcblx0XHRjb25zdCAkcm93cyAgICA9ICRmaWVsZC5maW5kKCB0YWJsZVJvd3NJZGVudGlmaWVyICk7XG5cblx0XHQkcm93cy5hcHBlbmQoIHJlbmRlcmVkICk7XG5cblx0XHR0cmlnZ2VyT3B0aW9uc0NoYW5nZSggJGZpZWxkICk7XG5cblx0XHRpZiAoICEgJHRhYmxlLmhhc0NsYXNzKCAnaGFzLW9wdGlvbnMnICkgKSB7XG5cdFx0XHQkdGFibGUuYWRkQ2xhc3MoICdoYXMtb3B0aW9ucycgKTtcblx0XHR9XG5cdH0gKTtcblxuXHQvLyBUcmlnZ2VyIG9wdGlvbnMgY2hhbmdlIHdoZW4gdGhlIHRleHQgZmllbGRzIGdldCBjaGFuZ2VkLlxuXHRjb25zdCB0ZXh0RmllbGRzSWRlbnRpZmllciA9IHRhYmxlUm93c0lkZW50aWZpZXIgKyAnIGlucHV0W3R5cGU9XCJ0ZXh0XCJdJztcblxuXHQkc2VhcmNoRm9ybS5vbiggJ2lucHV0JywgdGV4dEZpZWxkc0lkZW50aWZpZXIsIGZ1bmN0aW9uKCkge1xuXHRcdGNvbnN0ICRmaWVsZCA9ICQoIHRoaXMgKS5jbG9zZXN0KCBmaWVsZElkZW50aWZpZXIgKTtcblxuXHRcdHRyaWdnZXJPcHRpb25zQ2hhbmdlKCAkZmllbGQgKTtcblx0fSApO1xuXG5cdC8vIFRyaWdnZXIgb3B0aW9ucyBjaGFuZ2Ugd2hlbiB0aGUgc2VsZWN0IGZpZWxkcyBnZXQgY2hhbmdlZC5cblx0bGV0IHNlbGVjdEZpZWxkc0lkZW50aWZpZXIgPSB0YWJsZVJvd3NJZGVudGlmaWVyICsgJyBzZWxlY3QnO1xuXG5cdCRzZWFyY2hGb3JtLm9uKCAnY2hhbmdlJywgc2VsZWN0RmllbGRzSWRlbnRpZmllciwgZnVuY3Rpb24oKSB7XG5cdFx0Y29uc3QgJGZpZWxkID0gJCggdGhpcyApLmNsb3Nlc3QoIGZpZWxkSWRlbnRpZmllciApO1xuXG5cdFx0dHJpZ2dlck9wdGlvbnNDaGFuZ2UoICRmaWVsZCApO1xuXHR9ICk7XG5cblx0Ly8gVHJpZ2dlciBvcHRpb25zIGNoYW5nZSB3aGVuIHZhbHVlIGlzIGFkZGVkIGZyb20gbW9kYWwuXG5cdCRzZWFyY2hGb3JtLm9uKCAndHJpZ2dlcl9vcHRpb25zX3RhYmxlJywgZnVuY3Rpb24oIGUsIHRhYmxlSWQsICRmaWVsZCApIHtcblx0XHRpZiAoIHRhYmxlSWQgPT09IHRhYmxlSWRlbnRpZmllciApIHtcblx0XHRcdHRyaWdnZXJPcHRpb25zQ2hhbmdlKCAkZmllbGQgKTtcblx0XHR9XG5cdH0gKTtcblxufVxuIiwiLyoqXG4gKiBUaGUgbnVtYmVyIHVpIG9wdGlvbnMuXG4gKlxuICogQHNpbmNlICAgICAgMy4wLjBcbiAqIEBwYWNrYWdlICAgIHdjLWFqYXgtcHJvZHVjdC1maWx0ZXJcbiAqIEBzdWJwYWNrYWdlIHdjLWFqYXgtcHJvZHVjdC1maWx0ZXIvYWRtaW4vc3JjL2pzXG4gKiBAYXV0aG9yICAgICBNYWludWwgSGFzc2FuIE1haW5cbiAqL1xuXG5qUXVlcnkoIGRvY3VtZW50ICkucmVhZHkoIGZ1bmN0aW9uKCAkICkge1xuXG5cdGNvbnN0ICRzZWFyY2hGb3JtID0gJCggJyNzZWFyY2gtZm9ybScgKTtcblxuXHQvKipcblx0ICogVG9nZ2xlIGRpc2FibGVkIGF0dHJpYnV0ZSBvZiBtaW4tdmFsdWUgZmllbGQgZm9yIG51bWJlciB0eXBlLlxuXHQgKi9cblx0ZnVuY3Rpb24gdG9nZ2xlTnVtYmVyTWluVmFsdWVGaWVsZCggJGVsbSApIHtcblx0XHRjb25zdCAkZmllbGQgICAgID0gJGVsbS5jbG9zZXN0KCAnLndjYXBmLWZvcm0tZmllbGQnICk7XG5cdFx0Y29uc3QgJHRleHRGaWVsZCA9ICRmaWVsZC5maW5kKCAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLW1pbl92YWx1ZSBpbnB1dFt0eXBlPVwidGV4dFwiXScgKTtcblxuXHRcdGlmICggJGVsbS5pcyggJzpjaGVja2VkJyApICkge1xuXHRcdFx0JHRleHRGaWVsZC5hdHRyKCAnZGlzYWJsZWQnLCAnZGlzYWJsZWQnICk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdCR0ZXh0RmllbGQucmVtb3ZlQXR0ciggJ2Rpc2FibGVkJyApO1xuXHRcdH1cblx0fVxuXG5cdCRzZWFyY2hGb3JtLmZpbmQoICcud2NhcGYtZm9ybS1zdWItZmllbGQtbWluX3ZhbHVlX2F1dG9fZGV0ZWN0IGlucHV0W3R5cGU9XCJjaGVja2JveFwiXScgKS5lYWNoKCBmdW5jdGlvbigpIHtcblx0XHRjb25zdCAkdGhpcyA9ICQoIHRoaXMgKTtcblxuXHRcdHRvZ2dsZU51bWJlck1pblZhbHVlRmllbGQoICR0aGlzICk7XG5cdH0gKTtcblxuXHQkc2VhcmNoRm9ybS5vbihcblx0XHQnY2xpY2snLFxuXHRcdCcud2NhcGYtZm9ybS1zdWItZmllbGQtbWluX3ZhbHVlX2F1dG9fZGV0ZWN0IGlucHV0W3R5cGU9XCJjaGVja2JveFwiXScsXG5cdFx0ZnVuY3Rpb24oKSB7XG5cdFx0XHRjb25zdCAkdGhpcyA9ICQoIHRoaXMgKTtcblxuXHRcdFx0dG9nZ2xlTnVtYmVyTWluVmFsdWVGaWVsZCggJHRoaXMgKTtcblx0XHR9XG5cdCk7XG5cblx0LyoqXG5cdCAqIFRvZ2dsZSBkaXNhYmxlZCBhdHRyaWJ1dGUgb2YgbWF4LXZhbHVlIGZpZWxkIGZvciBudW1iZXIgdHlwZS5cblx0ICovXG5cdGZ1bmN0aW9uIHRvZ2dsZU51bWJlck1heFZhbHVlRmllbGQoICRlbG0gKSB7XG5cdFx0Y29uc3QgJGZpZWxkICAgICA9ICRlbG0uY2xvc2VzdCggJy53Y2FwZi1mb3JtLWZpZWxkJyApO1xuXHRcdGNvbnN0ICR0ZXh0RmllbGQgPSAkZmllbGQuZmluZCggJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1tYXhfdmFsdWUgaW5wdXRbdHlwZT1cInRleHRcIl0nICk7XG5cblx0XHRpZiAoICRlbG0uaXMoICc6Y2hlY2tlZCcgKSApIHtcblx0XHRcdCR0ZXh0RmllbGQuYXR0ciggJ2Rpc2FibGVkJywgJ2Rpc2FibGVkJyApO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHQkdGV4dEZpZWxkLnJlbW92ZUF0dHIoICdkaXNhYmxlZCcgKTtcblx0XHR9XG5cdH1cblxuXHQkc2VhcmNoRm9ybS5maW5kKCAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLW1heF92YWx1ZV9hdXRvX2RldGVjdCBpbnB1dFt0eXBlPVwiY2hlY2tib3hcIl0nICkuZWFjaCggZnVuY3Rpb24oKSB7XG5cdFx0Y29uc3QgJHRoaXMgPSAkKCB0aGlzICk7XG5cblx0XHR0b2dnbGVOdW1iZXJNYXhWYWx1ZUZpZWxkKCAkdGhpcyApO1xuXHR9ICk7XG5cblx0JHNlYXJjaEZvcm0ub24oXG5cdFx0J2NsaWNrJyxcblx0XHQnLndjYXBmLWZvcm0tc3ViLWZpZWxkLW1heF92YWx1ZV9hdXRvX2RldGVjdCBpbnB1dFt0eXBlPVwiY2hlY2tib3hcIl0nLFxuXHRcdGZ1bmN0aW9uKCkge1xuXHRcdFx0Y29uc3QgJHRoaXMgPSAkKCB0aGlzICk7XG5cblx0XHRcdHRvZ2dsZU51bWJlck1heFZhbHVlRmllbGQoICR0aGlzICk7XG5cdFx0fVxuXHQpO1xuXG59ICk7XG4iLCIvKipcbiAqIFRoZSBwcm9kdWN0IHN0YXR1cyBmaWVsZC5cbiAqXG4gKiBAc2luY2UgICAgICAzLjAuMFxuICogQHBhY2thZ2UgICAgd2MtYWpheC1wcm9kdWN0LWZpbHRlclxuICogQHN1YnBhY2thZ2Ugd2MtYWpheC1wcm9kdWN0LWZpbHRlci9hZG1pbi9zcmMvanNcbiAqIEBhdXRob3IgICAgIE1haW51bCBIYXNzYW4gTWFpblxuICovXG5cbmpRdWVyeSggZG9jdW1lbnQgKS5yZWFkeSggZnVuY3Rpb24oKSB7XG5cblx0Y29uc3QgdGFibGVJZGVudGlmaWVyID0gJy5wcm9kdWN0LXN0YXR1cy1vcHRpb25zLXRhYmxlJztcblx0Y29uc3QgdmFsdWVJZGVudGlmaWVyID0gJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1wcm9kdWN0X3N0YXR1c19vcHRpb25zIGlucHV0Jztcblx0Y29uc3Qgcm93VGVtcGxhdGVJZCAgID0gJ3djYXBmLXByb2R1Y3Qtc3RhdHVzLW9wdGlvbic7XG5cblx0Y29uc3Qgcm93RGVmYXVsdE9wdGlvbnMgPSB7XG5cdFx0dmFsdWU6ICcnLFxuXHRcdGxhYmVsOiAnJyxcblx0fTtcblxuXHRpbml0TWFudWFsT3B0aW9uc1RhYmxlKCB0YWJsZUlkZW50aWZpZXIsIHZhbHVlSWRlbnRpZmllciwgcm93VGVtcGxhdGVJZCwgcm93RGVmYXVsdE9wdGlvbnMgKTtcblxufSApO1xuIiwiLyoqXG4gKiBUaGUgc2VhcmNoIGZvcm0uXG4gKlxuICogQHNpbmNlICAgICAgMy4wLjBcbiAqIEBwYWNrYWdlICAgIHdjLWFqYXgtcHJvZHVjdC1maWx0ZXJcbiAqIEBzdWJwYWNrYWdlIHdjLWFqYXgtcHJvZHVjdC1maWx0ZXIvYWRtaW4vc3JjL2pzXG4gKiBAYXV0aG9yICAgICBNYWludWwgSGFzc2FuIE1haW5cbiAqL1xuXG5jb25zdCB0b3RhbEZpZWxkSW5zdGFuY2VzID0galF1ZXJ5KCAnI3RvdGFsX2ZpZWxkX2luc3RhbmNlcycgKTtcblxuY29uc3Qgc2VhcmNoRm9ybSA9IGpRdWVyeSggJyNzZWFyY2gtZm9ybScgKTtcblxuLyoqXG4gKiBBc3NpZ24gYSB1bmlxdWUgaWQgYnkgcmVwbGFjaW5nIHRoZSBwbGFjZWhvbGRlciBpZC5cbiAqL1xuZnVuY3Rpb24gcmVtb3ZlUGxhY2Vob2xkZXIoIHVuaXF1ZUlkLCBlbGVtZW50cywgYXR0ciApIHtcblx0ZWxlbWVudHMuZWFjaChcblx0XHRmdW5jdGlvbigpIHtcblx0XHRcdGNvbnN0IGVsZW1lbnQgPSBqUXVlcnkoIHRoaXMgKTtcblxuXHRcdFx0Y29uc3Qgb2xkVmFsdWUgPSBlbGVtZW50LmF0dHIoIGF0dHIgKTtcblx0XHRcdGNvbnN0IG5ld1ZhbHVlID0gb2xkVmFsdWUucmVwbGFjZSggJyUlJywgdW5pcXVlSWQgKTtcblxuXHRcdFx0ZWxlbWVudC5hdHRyKCBhdHRyLCBuZXdWYWx1ZSApO1xuXHRcdH1cblx0KTtcbn1cblxuLyoqXG4gKiBJbnNlcnQgdGhlIGZpZWxkJ3Mgc3ViZmllbGRzLlxuICovXG5mdW5jdGlvbiBpbnNlcnRGaWVsZFN1YkZpZWxkcyggdWkgKSB7XG5cdC8vIEluc2VydCB0aGUgZmllbGQncyBzdWJmaWVsZHMgaWYgbm90IGFscmVhZHkgaW5zZXJ0ZWQuXG5cdGlmICggISB1aS5pdGVtLmhhc0NsYXNzKCAnc3ViLWZpZWxkcy1yZWFkeScgKSApIHtcblx0XHRjb25zdCB0eXBlICAgICAgPSB1aS5pdGVtLmF0dHIoICdkYXRhLWZpZWxkLXR5cGUnICk7XG5cdFx0Y29uc3QgdW5pcXVlSWQgID0gcGFyc2VJbnQoIHRvdGFsRmllbGRJbnN0YW5jZXMudmFsKCkgKTtcblx0XHRjb25zdCBmaWVsZFR5cGUgPSAnd2NhcGYtZm9ybS1maWVsZC0nICsgdHlwZTtcblxuXHRcdC8vIEJhaWwgb3V0IGlmIG5vIHRtcGwgZm91bmQgZm9yIHRoZSB0eXBlLlxuXHRcdGlmICggISBqUXVlcnkoICcjdG1wbC0nICsgZmllbGRUeXBlICkubGVuZ3RoICkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdC8vIEluY3JlbWVudCB0aGUgdmFsdWUgb2YgdG90YWwgZmllbGQgaW5zdGFuY2VzLlxuXHRcdHRvdGFsRmllbGRJbnN0YW5jZXMudmFsKCB1bmlxdWVJZCArIDEgKTtcblxuXHRcdGNvbnN0IHRlbXBsYXRlID0gd3AudGVtcGxhdGUoIGZpZWxkVHlwZSApO1xuXHRcdGNvbnN0IHJlbmRlcmVkID0gdGVtcGxhdGUoKTtcblx0XHRjb25zdCB3cmFwcGVyICA9IHVpLml0ZW0uZmluZCggJy53aWRnZXQtY29udGVudCcgKTtcblxuXHRcdHdyYXBwZXIucHJlcGVuZCggcmVuZGVyZWQgKTtcblxuXHRcdC8vIFVwZGF0ZSB0aGUgZm9yIGF0dHJpYnV0ZXMgb2YgdGhlIGxhYmVscy5cblx0XHRyZW1vdmVQbGFjZWhvbGRlciggdW5pcXVlSWQsIHVpLml0ZW0uZmluZCggJ2xhYmVsW2Zvcl49XCJ3Y2FwZi1pbnB1dC1cIl0nICksICdmb3InICk7XG5cblx0XHQvLyBVcGRhdGUgdGhlIGlkcyBvZiB0aGUgaW5wdXQgZWxlbWVudHMuXG5cdFx0cmVtb3ZlUGxhY2Vob2xkZXIoIHVuaXF1ZUlkLCB1aS5pdGVtLmZpbmQoICcqW2lkXj1cIndjYXBmLWlucHV0LVwiXScgKSwgJ2lkJyApO1xuXG5cdFx0Ly8gVXBkYXRlIHRoZSBuYW1lcyBvZiB0aGUgaW5wdXQgZWxlbWVudHMuXG5cdFx0cmVtb3ZlUGxhY2Vob2xkZXIoIHVuaXF1ZUlkLCB1aS5pdGVtLmZpbmQoICcqW2lkXj1cIndjYXBmLWlucHV0LVwiXScgKSwgJ25hbWUnICk7XG5cblx0XHQvLyBVcGRhdGUgdGhlIHBvc2l0aW9uIHZhbHVlLlxuXHRcdHJlbW92ZVBsYWNlaG9sZGVyKCB1bmlxdWVJZCwgdWkuaXRlbS5maW5kKCAnKltpZF49XCJ3Y2FwZi1pbnB1dC1wb3NpdGlvbi1cIl0nICksICd2YWx1ZScgKTtcblxuXHRcdHVpLml0ZW0uYWRkQ2xhc3MoICdzdWItZmllbGRzLXJlYWR5JyApO1xuXG5cdFx0c2VhcmNoRm9ybS50cmlnZ2VyKCAnZmllbGRfYWRkZWQnLCBbIHVpIF0gKTtcblx0fVxufVxuXG4vKipcbiAqIFVwZGF0ZSB0aGUgZm9ybSBmaWVsZCdzIHBvc2l0aW9uIGFmdGVyIHNvcnQuXG4gKlxuICogQHNvdXJjZSBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL2EvMTQ3MzY3NzVcbiAqL1xuZnVuY3Rpb24gdXBkYXRlRmllbGRzUG9zaXRpb24oKSB7XG5cdGNvbnN0IGlucHV0cyAgPSBzZWFyY2hGb3JtLmZpbmQoICcqW2lkXj1cIndjYXBmLWlucHV0LXBvc2l0aW9uLVwiXScgKTtcblx0Y29uc3QgbmJFbGVtcyA9IGlucHV0cy5sZW5ndGg7XG5cblx0aW5wdXRzLmVhY2goXG5cdFx0ZnVuY3Rpb24oIGlkeCApIHtcblx0XHRcdGpRdWVyeSggdGhpcyApLnZhbCggbmJFbGVtcyAtICggbmJFbGVtcyAtIGlkeCApICk7XG5cdFx0fVxuXHQpO1xufVxuXG4vKipcbiAqIE1ha2UgdGhlIGZpZWxkIHJlYWR5LCByZW1vdmUgc3R5bGVzIGNvbWVzIGZyb20ganF1ZXJ5LXVpLXNvcnRhYmxlIHBsdWdpbiwgaW5zZXJ0IHRoZSBmaWVsZCdzIHN1YmZpZWxkcyBldGMuXG4gKi9cbmZ1bmN0aW9uIG1ha2VGaWVsZFJlYWR5KCBlLCB1aSApIHtcblx0Ly8gUmVtb3ZlIHN0eWxlcyBjb21lcyBmcm9tIGpxdWVyeS11aS1zb3J0YWJsZSBwbHVnaW4uXG5cdHVpLml0ZW0ucmVtb3ZlQXR0ciggJ3N0eWxlJyApO1xuXG5cdGluc2VydEZpZWxkU3ViRmllbGRzKCB1aSApO1xuXG5cdHVwZGF0ZUZpZWxkc1Bvc2l0aW9uKCk7XG5cblx0Y29uc3QgdG9nZ2xlQnRuID0gdWkuaXRlbS5maW5kKCAnLndpZGdldC1hY3Rpb24nICk7XG5cblx0Ly8gRXhwYW5kIHRoZSBmb3JtIGZpZWxkIGFmdGVyIHNvcnQuXG5cdGlmICggJ2ZhbHNlJyA9PT0gdG9nZ2xlQnRuLmF0dHIoICdhcmlhLWV4cGFuZGVkJyApICkge1xuXHRcdHRvZ2dsZUJ0bi50cmlnZ2VyKCAnY2xpY2snICk7XG5cdH1cbn1cblxuLyoqXG4gKiBJbnN0YW50aWF0ZSBzb3J0YWJsZSBmb3IgdGhlIGZvcm0gZmllbGRzLlxuICovXG5mdW5jdGlvbiBzb3J0YWJsZSggaWRlbnRpZmllciApIHtcblx0Y29uc3QgY29udGFpbmVyID0galF1ZXJ5KCBpZGVudGlmaWVyICk7XG5cblx0Y29udGFpbmVyLnNvcnRhYmxlKFxuXHRcdHtcblx0XHRcdG9wYWNpdHk6IDAuOCxcblx0XHRcdHJldmVydDogZmFsc2UsXG5cdFx0XHRjdXJzb3I6ICdtb3ZlJyxcblx0XHRcdGF4aXM6ICd5Jyxcblx0XHRcdGhhbmRsZTogJy53aWRnZXQtdG9wJyxcblx0XHRcdGNhbmNlbDogJy53aWRnZXQtdGl0bGUtYWN0aW9uJyxcblx0XHRcdGl0ZW1zOiAnLndpZGdldCcsXG5cdFx0XHRwbGFjZWhvbGRlcjogJ3dpZGdldC1wbGFjZWhvbGRlcicsXG5cdFx0XHRjb25uZWN0V2l0aDogJyNzZWFyY2gtZm9ybS13cmFwcGVyJyxcblx0XHRcdHN0b3A6IG1ha2VGaWVsZFJlYWR5LFxuXHRcdFx0c3RhcnQ6IGZ1bmN0aW9uKCBlLCB1aSApIHtcblx0XHRcdFx0Ly8gSWYgaXQgaXMgZ2V0dGluZyBhcHBlbmRlZCB0byB0aGUgd3JvbmcgcGxhY2UsIHRoZW4gZm9yY2UgaXQgaW50byB0aGUgcmlnaHQgY29udGFpbmVyLlxuXHRcdFx0XHR1aS5wbGFjZWhvbGRlci5hcHBlbmRUbyggdWkucGxhY2Vob2xkZXIucGFyZW50KCkuZmluZCggJy5pbnNpZGUgI3NlYXJjaC1mb3JtLXdyYXBwZXInICkgKTtcblx0XHRcdH1cblx0XHR9XG5cdCk7XG59XG5cbnNvcnRhYmxlKCAnI3NlYXJjaC1mb3JtJyApO1xuXG4vKipcbiAqIFJ1biBmdW5jdGlvbiB3aGVuIGRyYWcgc3RhcnRzLlxuICovXG5mdW5jdGlvbiBvbkRyYWdTdGFydCgpIHtcblx0c2VhcmNoRm9ybS5hZGRDbGFzcyggJ3VpLWRyb3AtYWN0aXZlJyApO1xufVxuXG4vKipcbiAqIFJ1biBmdW5jdGlvbiBhdCBkcmFnIHN0b3AuXG4gKi9cbmZ1bmN0aW9uIG9uRHJhZ1N0b3AoKSB7XG5cdHNlYXJjaEZvcm0ucmVtb3ZlQ2xhc3MoICd1aS1kcm9wLWFjdGl2ZScgKTtcbn1cblxuLyoqXG4gKiBJbml0aWFsaXplIGRyYWdnYWJsZSBmb3IgdGhlIGZvcm0gZmllbGRzLlxuICovXG5qUXVlcnkoICcjYXZhaWxhYmxlLWZpZWxkcyAud2lkZ2V0JyApLmRyYWdnYWJsZShcblx0e1xuXHRcdGNvbm5lY3RUb1NvcnRhYmxlOiAnI3NlYXJjaC1mb3JtJyxcblx0XHRoZWxwZXI6ICdjbG9uZScsXG5cdFx0c3RhcnQ6IG9uRHJhZ1N0YXJ0LFxuXHRcdHN0b3A6IG9uRHJhZ1N0b3AsXG5cdH1cbik7XG5cbi8qKlxuICogVG9nZ2xlIHRoZSBmb3JtIGZpZWxkLlxuICovXG5mdW5jdGlvbiB0b2dnbGVGaWVsZCggZSApIHtcblx0Y29uc3QgdGFyZ2V0ICAgICAgID0gZS50YXJnZXQ7XG5cdGNvbnN0IHdpZGdldCAgICAgICA9IGpRdWVyeSggdGhpcyApLmNsb3Nlc3QoICcud2lkZ2V0JyApO1xuXHRjb25zdCB0b2dnbGVCdG4gICAgPSB3aWRnZXQuZmluZCggJy53aWRnZXQtYWN0aW9uJyApO1xuXHRjb25zdCBpbnNpZGUgICAgICAgPSB3aWRnZXQuY2hpbGRyZW4oICcud2lkZ2V0LWluc2lkZScgKTtcblx0Y29uc3QgaXNFeHBhbmQgICAgID0gdG9nZ2xlQnRuLmF0dHIoICdhcmlhLWV4cGFuZGVkJyApO1xuXHRjb25zdCB0b2dnbGVFeHBhbmQgPSAndHJ1ZScgPT09IGlzRXhwYW5kID8gJ2ZhbHNlJyA6ICd0cnVlJztcblxuXHR0b2dnbGVCdG4uYXR0ciggJ2FyaWEtZXhwYW5kZWQnLCB0b2dnbGVFeHBhbmQgKTtcblx0alF1ZXJ5KCBpbnNpZGUgKS5zbGlkZVRvZ2dsZShcblx0XHQnZmFzdCcsXG5cdFx0ZnVuY3Rpb24oKSB7XG5cdFx0XHR3aWRnZXQudG9nZ2xlQ2xhc3MoICdvcGVuJyApO1xuXHRcdFx0c2VhcmNoRm9ybS50cmlnZ2VyKCAnd2lkZ2V0LWNsb3NlZCcsIFsgdGFyZ2V0IF0gKTtcblx0XHR9XG5cdCk7XG59XG5cbnNlYXJjaEZvcm0ub24oICdjbGljaycsICcud2lkZ2V0LXRvcCcsIHRvZ2dsZUZpZWxkICk7XG5zZWFyY2hGb3JtLm9uKCAnY2xpY2snLCAnLndpZGdldC1jb250cm9sLWNsb3NlJywgdG9nZ2xlRmllbGQgKTtcblxuLyoqXG4gKiBGb2N1cyB0aGUgZm9ybSBmaWVsZCdzIGV4cGFuZCBidXR0b24uXG4gKi9cbmZ1bmN0aW9uIGZvY3VzRmllbGQoIGUsIHRhcmdldCApIHtcblx0aWYgKCB0YXJnZXQuY2xhc3NMaXN0LmNvbnRhaW5zKCAnd2lkZ2V0LWNvbnRyb2wtY2xvc2UnICkgKSB7XG5cdFx0Y29uc3Qgd2lkZ2V0ID0galF1ZXJ5KCB0YXJnZXQgKS5jbG9zZXN0KCAnLndpZGdldCcgKTtcblx0XHRjb25zdCBhY3Rpb24gPSB3aWRnZXQuZmluZCggJy53aWRnZXQtYWN0aW9uJyApO1xuXG5cdFx0YWN0aW9uLmF0dHIoICdhcmlhLWV4cGFuZGVkJywgJ2ZhbHNlJyApLmZvY3VzKCk7XG5cdH1cbn1cblxuc2VhcmNoRm9ybS5vbiggJ3dpZGdldC1jbG9zZWQnLCBmb2N1c0ZpZWxkICk7XG5cbi8qKlxuICogUmVtb3ZlIHRoZSBmaWVsZC5cbiAqL1xuZnVuY3Rpb24gcmVtb3ZlRmllbGQoKSB7XG5cdGNvbnN0IHdpZGdldCA9IGpRdWVyeSggdGhpcyApLmNsb3Nlc3QoICcud2lkZ2V0JyApO1xuXG5cdGpRdWVyeSggd2lkZ2V0ICkuc2xpZGVVcChcblx0XHQnZmFzdCcsXG5cdFx0ZnVuY3Rpb24oKSB7XG5cdFx0XHR3aWRnZXQucmVtb3ZlKCk7XG5cdFx0XHR1cGRhdGVGaWVsZHNQb3NpdGlvbigpO1xuXHRcdH1cblx0KTtcbn1cblxuc2VhcmNoRm9ybS5vbiggJ2NsaWNrJywgJy53aWRnZXQtY29udHJvbC1yZW1vdmUnLCByZW1vdmVGaWVsZCApO1xuXG4vKipcbiAqIFN0b3JlIHRoZSBpbml0aWFsIGZvcm0gZGF0YSBpbnRvIGEgdmFyaWFibGUgc28gdGhhdCB3ZSBjYW4gY29tcGFyZSBpdCB3aGVuIGxlYXZpbmcgdGhlIHBhZ2UuXG4gKi9cbmxldCBpbml0aWFsRm9ybVN0YXRlID0gc2VhcmNoRm9ybS5zZXJpYWxpemVBcnJheSgpO1xuXG4vKipcbiAqIFNob3cgbWVzc2FnZSBhZnRlciBmb3JtIHN1Ym1pc3Npb24uXG4gKi9cbmZ1bmN0aW9uIHNob3dNZXNzYWdlKCBtZXNzYWdlLCB0eXBlID0gJ3N1Y2Nlc3MnICkge1xuXHRjb25zdCBlbGVtZW50ID0galF1ZXJ5KCAnPHAgY2xhc3M9XCInICsgdHlwZSArICdcIj4nICsgbWVzc2FnZSArICc8L3A+JyApO1xuXHRjb25zdCB3cmFwcGVyID0galF1ZXJ5KCAnLndjYXBmLW1lc3NhZ2Utd3JhcHBlcicgKTtcblxuXHRpZiAoICEgd3JhcHBlci5pcyggJzplbXB0eScgKSApIHtcblx0XHRyZXR1cm47XG5cdH1cblxuXHRqUXVlcnkoIHdyYXBwZXIgKS5odG1sKCBlbGVtZW50ICkuc2xpZGVEb3duKCAnZmFzdCcgKTtcblxuXHRzZXRUaW1lb3V0KFxuXHRcdGZ1bmN0aW9uKCkge1xuXHRcdFx0alF1ZXJ5KCB3cmFwcGVyICkuc2xpZGVVcCggJ2Zhc3QnICk7XG5cdFx0XHR3cmFwcGVyLmh0bWwoICcnICk7XG5cdFx0fSxcblx0XHQzMDAwXG5cdCk7XG59XG5cbi8qKlxuICogU2F2ZSB0aGUgc2VhcmNoIGZvcm0uXG4gKi9cbmZ1bmN0aW9uIHNhdmVGb3JtKCkge1xuXHRjb25zdCBidXR0b24gICA9IGpRdWVyeSggdGhpcyApO1xuXHRjb25zdCBmb3JtRGF0YSA9IHNlYXJjaEZvcm0uc2VyaWFsaXplQXJyYXkoKTtcblxuXHRidXR0b24uYXR0ciggJ2Rpc2FibGVkJywgJ2Rpc2FibGVkJyApO1xuXG5cdGZ1bmN0aW9uIG9rQ2FsbGJhY2soIG1lc3NhZ2UgKSB7XG5cdFx0YnV0dG9uLnJlbW92ZUF0dHIoICdkaXNhYmxlZCcgKTtcblxuXHRcdC8vIFVwZGF0ZSB0aGUgaW5pdGlhbCBmb3JtIGRhdGEgYWZ0ZXIgc3VjY2Vzc2Z1bGx5IHNhdmluZyB0aGUgZm9ybS5cblx0XHRpbml0aWFsRm9ybVN0YXRlID0gZm9ybURhdGE7XG5cblx0XHRzaG93TWVzc2FnZSggbWVzc2FnZSApO1xuXHR9XG5cblx0ZnVuY3Rpb24gZXJyQ2FsbGJhY2soIG1lc3NhZ2UgKSB7XG5cdFx0YnV0dG9uLnJlbW92ZUF0dHIoICdkaXNhYmxlZCcgKTtcblx0XHRzaG93TWVzc2FnZSggbWVzc2FnZSwgJ2Vycm9yJyApO1xuXHR9XG5cblx0Ly8gaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9hLzU5MTgxMjUyXG5cdHdwLmFqYXgucG9zdCggZm9ybURhdGEgKS5kb25lKCBva0NhbGxiYWNrICkuZmFpbCggZXJyQ2FsbGJhY2sgKTtcbn1cblxualF1ZXJ5KCAnI3Bvc3Rib3gtY29udGFpbmVyLTEnICkub24oICdjbGljaycsICdidXR0b24nLCBzYXZlRm9ybSApO1xuXG4vKipcbiAqIFNob3cgYWxlcnQgb24gbGVhdmUgaWYgdGhlIGZvcm0gaXMgZGlydHkuXG4gKlxuICogVE9ETzogVW5jb21tZW50IHRoaXMuXG4gKi9cbi8vIHdpbmRvdy5vbmJlZm9yZXVubG9hZCA9IGZ1bmN0aW9uKCkge1xuLy8gXHRjb25zdCBuZXdGb3JtU3RhdGUgPSBzZWFyY2hGb3JtLnNlcmlhbGl6ZUFycmF5KCk7XG4vL1xuLy8gXHRjb25zdCBpc0Zvcm1EaXJ0eSA9ICEgXy5pc0VxdWFsKCBuZXdGb3JtU3RhdGUsIGluaXRpYWxGb3JtU3RhdGUgKTtcbi8vXG4vLyBcdGlmICggaXNGb3JtRGlydHkgKSB7XG4vLyBcdFx0cmV0dXJuICcnO1xuLy8gXHR9XG4vLyB9O1xuIiwiLyoqXG4gKiBUaGUgdG9nZ2xlIHZpc2liaWxpdHkgc2NyaXB0cy5cbiAqXG4gKiBOT1RFOiBUaGVzZSBzY3JpcHRzIG11c3QgYmUgbG9jYXRlZCBhdCB0aGUgdmVyeSBib3R0b20gb2YgdGhlIGNvbWJpbmVkIHNjcmlwdHMuXG4gKlxuICogQHNpbmNlICAgICAgMy4wLjBcbiAqIEBwYWNrYWdlICAgIHdjLWFqYXgtcHJvZHVjdC1maWx0ZXJcbiAqIEBzdWJwYWNrYWdlIHdjLWFqYXgtcHJvZHVjdC1maWx0ZXIvYWRtaW4vc3JjL2pzXG4gKiBAYXV0aG9yICAgICBNYWludWwgSGFzc2FuIE1haW5cbiAqL1xuXG5qUXVlcnkoIGRvY3VtZW50ICkucmVhZHkoIGZ1bmN0aW9uKCAkICkge1xuXG5cdGNvbnN0ICRzZWFyY2hGb3JtID0gJCggJyNzZWFyY2gtZm9ybScgKTtcblxuXHRjb25zdCBkZXBlbmRhbnREYXRhID0gW1xuXHRcdHtcblx0XHRcdCdoYW5kbGVyJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC12YWx1ZV90eXBlIHNlbGVjdCcsXG5cdFx0XHQnaGFuZGxlclR5cGUnOiAnc2VsZWN0Jyxcblx0XHRcdCdldmVudCc6ICdjaGFuZ2UnLFxuXHRcdFx0J2RlcGVuZGFudCc6IFtcblx0XHRcdFx0e1xuXHRcdFx0XHRcdCdzZWxlY3Rvcic6ICcuaW5wdXQtdHlwZS10ZXh0LWZpZWxkcycsXG5cdFx0XHRcdFx0J3ZhbHVlJzogWyAndGV4dCcgXSxcblx0XHRcdFx0fSxcblx0XHRcdFx0e1xuXHRcdFx0XHRcdCdzZWxlY3Rvcic6ICcuaW5wdXQtdHlwZS1udW1iZXItZmllbGRzJyxcblx0XHRcdFx0XHQndmFsdWUnOiBbICdudW1iZXInIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLmlucHV0LXR5cGUtZGF0ZS1maWVsZHMnLFxuXHRcdFx0XHRcdCd2YWx1ZSc6IFsgJ2RhdGUnIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRdLFxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0J2hhbmRsZXInOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLWRpc3BsYXlfdHlwZSBzZWxlY3QnLFxuXHRcdFx0J2hhbmRsZXJUeXBlJzogJ3NlbGVjdCcsXG5cdFx0XHQnZXZlbnQnOiAnY2hhbmdlJyxcblx0XHRcdCdkZXBlbmRhbnQnOiBbXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLXF1ZXJ5X3R5cGUnLFxuXHRcdFx0XHRcdCd2YWx1ZSc6IFsgJ2NoZWNrYm94JywgJ211bHRpLXNlbGVjdCcgXSxcblx0XHRcdFx0fSxcblx0XHRcdFx0e1xuXHRcdFx0XHRcdCdzZWxlY3Rvcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtYWxsX2l0ZW1zX2xhYmVsJyxcblx0XHRcdFx0XHQndmFsdWUnOiBbICdyYWRpbycsICdzZWxlY3QnIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLXVzZV9jaG9zZW4nLFxuXHRcdFx0XHRcdCd2YWx1ZSc6IFsgJ3NlbGVjdCcsICdtdWx0aS1zZWxlY3QnIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRdLFxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0J2hhbmRsZXInOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLXVzZV9jaG9zZW4gaW5wdXQnLFxuXHRcdFx0J2hhbmRsZXJUeXBlJzogJ2NoZWNrYm94Jyxcblx0XHRcdCdldmVudCc6ICdjaGFuZ2UnLFxuXHRcdFx0J2RlcGVuZGFudCc6IFtcblx0XHRcdFx0e1xuXHRcdFx0XHRcdCdzZWxlY3Rvcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtY2hvc2VuX25vX3Jlc3VsdHNfbWVzc2FnZScsXG5cdFx0XHRcdFx0J3ZhbHVlJzogWyAnMScgXSxcblx0XHRcdFx0fSxcblx0XHRcdF0sXG5cdFx0fSxcblx0XHR7XG5cdFx0XHQnaGFuZGxlcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtaGllcmFyY2hpY2FsIGlucHV0Jyxcblx0XHRcdCdoYW5kbGVyVHlwZSc6ICdjaGVja2JveCcsXG5cdFx0XHQnZXZlbnQnOiAnY2hhbmdlJyxcblx0XHRcdCdkZXBlbmRhbnQnOiBbXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLWVuYWJsZV9oaWVyYXJjaHlfYWNjb3JkaW9uJyxcblx0XHRcdFx0XHQndmFsdWUnOiBbICcxJyBdLFxuXHRcdFx0XHR9LFxuXHRcdFx0XSxcblx0XHR9LFxuXHRcdHtcblx0XHRcdCdoYW5kbGVyJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1nZXRfb3B0aW9ucyBpbnB1dCcsXG5cdFx0XHQnaGFuZGxlclR5cGUnOiAncmFkaW8nLFxuXHRcdFx0J2V2ZW50JzogJ2NoYW5nZScsXG5cdFx0XHQnZGVwZW5kYW50JzogW1xuXHRcdFx0XHR7XG5cdFx0XHRcdFx0J3NlbGVjdG9yJzogJy5jb2x1bW4tZ3JvdXAtbWV0YV9rZXlfbWFudWFsX29wdGlvbnMnLFxuXHRcdFx0XHRcdCd2YWx1ZSc6IFsgJ21hbnVhbF9lbnRyeScgXSxcblx0XHRcdFx0fSxcblx0XHRcdF0sXG5cdFx0fSxcblx0XHR7XG5cdFx0XHQnaGFuZGxlcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtbnVtYmVyX2Rpc3BsYXlfdHlwZSBzZWxlY3QnLFxuXHRcdFx0J2hhbmRsZXJUeXBlJzogJ3NlbGVjdCcsXG5cdFx0XHQnZXZlbnQnOiAnY2hhbmdlJyxcblx0XHRcdCdkZXBlbmRhbnQnOiBbXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLW51bWJlcl9yYW5nZV9zbGlkZXJfZGlzcGxheV92YWx1ZXNfYXMnLFxuXHRcdFx0XHRcdCd2YWx1ZSc6IFsgJ3JhbmdlX3NsaWRlcicgXSxcblx0XHRcdFx0fSxcblx0XHRcdFx0e1xuXHRcdFx0XHRcdCdzZWxlY3Rvcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtbnVtYmVyX3JhbmdlX3F1ZXJ5X3R5cGUnLFxuXHRcdFx0XHRcdCd2YWx1ZSc6IFsgJ3JhbmdlX2NoZWNrYm94JywgJ3JhbmdlX211bHRpc2VsZWN0JyBdLFxuXHRcdFx0XHR9LFxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0J3NlbGVjdG9yJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1udW1iZXJfcmFuZ2Vfc2VsZWN0X2FsbF9pdGVtc19sYWJlbCcsXG5cdFx0XHRcdFx0J3ZhbHVlJzogWyAncmFuZ2VfcmFkaW8nLCAncmFuZ2Vfc2VsZWN0JyBdLFxuXHRcdFx0XHR9LFxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0J3NlbGVjdG9yJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1udW1iZXJfcmFuZ2VfdXNlX2Nob3NlbicsXG5cdFx0XHRcdFx0J3ZhbHVlJzogWyAncmFuZ2Vfc2VsZWN0JywgJ3JhbmdlX211bHRpc2VsZWN0JyBdLFxuXHRcdFx0XHR9LFxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0J3NlbGVjdG9yJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1udW1iZXJfcmFuZ2Vfc2hvd19jb3VudCcsXG5cdFx0XHRcdFx0J3ZhbHVlJzogWyAncmFuZ2VfY2hlY2tib3gnLCAncmFuZ2VfcmFkaW8nLCAncmFuZ2Vfc2VsZWN0JywgJ3JhbmdlX211bHRpc2VsZWN0JyBdLFxuXHRcdFx0XHR9LFxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0J3NlbGVjdG9yJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1udW1iZXJfcmFuZ2VfaGlkZV9lbXB0eScsXG5cdFx0XHRcdFx0J3ZhbHVlJzogWyAncmFuZ2VfY2hlY2tib3gnLCAncmFuZ2VfcmFkaW8nLCAncmFuZ2Vfc2VsZWN0JywgJ3JhbmdlX211bHRpc2VsZWN0JyBdLFxuXHRcdFx0XHR9LFxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0J3NlbGVjdG9yJzogJy5udW1iZXItZGVjaW1hbC1maWVsZHMnLFxuXHRcdFx0XHRcdCd2YWx1ZSc6IFsgJ3JhbmdlX3NsaWRlcicsICdyYW5nZV9jaGVja2JveCcsICdyYW5nZV9yYWRpbycsICdyYW5nZV9zZWxlY3QnLCAncmFuZ2VfbXVsdGlzZWxlY3QnIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRdLFxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0J2hhbmRsZXInOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLW51bWJlcl9yYW5nZV91c2VfY2hvc2VuIGlucHV0Jyxcblx0XHRcdCdoYW5kbGVyVHlwZSc6ICdjaGVja2JveCcsXG5cdFx0XHQnZXZlbnQnOiAnY2hhbmdlJyxcblx0XHRcdCdkZXBlbmRhbnQnOiBbXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLW51bWJlcl9yYW5nZV9jaG9zZW5fbm9fcmVzdWx0c19tZXNzYWdlJyxcblx0XHRcdFx0XHQndmFsdWUnOiBbICcxJyBdLFxuXHRcdFx0XHR9LFxuXHRcdFx0XSxcblx0XHR9LFxuXHRcdHtcblx0XHRcdCdoYW5kbGVyJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1udW1iZXJfZ2V0X29wdGlvbnMgaW5wdXQnLFxuXHRcdFx0J2hhbmRsZXJUeXBlJzogJ3JhZGlvJyxcblx0XHRcdCdldmVudCc6ICdjaGFuZ2UnLFxuXHRcdFx0J2RlcGVuZGFudCc6IFtcblx0XHRcdFx0e1xuXHRcdFx0XHRcdCdzZWxlY3Rvcic6ICcubnVtYmVyLWF1dG9tYXRpYy1vcHRpb25zJyxcblx0XHRcdFx0XHQndmFsdWUnOiBbICdhdXRvbWF0aWNhbGx5JyBdLFxuXHRcdFx0XHR9LFxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0J3NlbGVjdG9yJzogJy5udW1iZXItbWFudWFsLW9wdGlvbnMtdGFibGUnLFxuXHRcdFx0XHRcdCd2YWx1ZSc6IFsgJ21hbnVhbF9lbnRyeScgXSxcblx0XHRcdFx0fSxcblx0XHRcdF0sXG5cdFx0fSxcblx0XHR7XG5cdFx0XHQnaGFuZGxlcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtZGF0ZV9kaXNwbGF5X3R5cGUgc2VsZWN0Jyxcblx0XHRcdCdoYW5kbGVyVHlwZSc6ICdzZWxlY3QnLFxuXHRcdFx0J2V2ZW50JzogJ2NoYW5nZScsXG5cdFx0XHQnZGVwZW5kYW50JzogW1xuXHRcdFx0XHR7XG5cdFx0XHRcdFx0J3NlbGVjdG9yJzogJy5kYXRlLXRvLXVpLW9wdGlvbnMnLFxuXHRcdFx0XHRcdCd2YWx1ZSc6IFsgJ2lucHV0X2RhdGVfcmFuZ2UnIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLWRhdGVfZm9ybWF0Jyxcblx0XHRcdFx0XHQndmFsdWUnOiBbICdpbnB1dF9kYXRlJywgJ2lucHV0X2RhdGVfcmFuZ2UnIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRdLFxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0J2hhbmRsZXInOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLWxpbWl0X3Rlcm1zIHNlbGVjdCcsXG5cdFx0XHQnaGFuZGxlclR5cGUnOiAnc2VsZWN0Jyxcblx0XHRcdCdldmVudCc6ICdjaGFuZ2UnLFxuXHRcdFx0J2RlcGVuZGFudCc6IFtcblx0XHRcdFx0e1xuXHRcdFx0XHRcdCdzZWxlY3Rvcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtcGFyZW50X3Rlcm0nLFxuXHRcdFx0XHRcdCd2YWx1ZSc6IFsgJ2NoaWxkJyBdLFxuXHRcdFx0XHR9LFxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0J3NlbGVjdG9yJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1saW1pdF90ZXJtc19ieV9pZCcsXG5cdFx0XHRcdFx0J3ZhbHVlJzogWyAnaW5jbHVkZScsICdleGNsdWRlJyBdLFxuXHRcdFx0XHR9LFxuXHRcdFx0XSxcblx0XHR9LFxuXHRcdHtcblx0XHRcdCdoYW5kbGVyJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1lbmFibGVfc29mdF9saW1pdCBpbnB1dCcsXG5cdFx0XHQnaGFuZGxlclR5cGUnOiAncmFkaW8nLFxuXHRcdFx0J2V2ZW50JzogJ2NoYW5nZScsXG5cdFx0XHQnZGVwZW5kYW50JzogW1xuXHRcdFx0XHR7XG5cdFx0XHRcdFx0J3NlbGVjdG9yJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1zb2Z0X2xpbWl0Jyxcblx0XHRcdFx0XHQndmFsdWUnOiBbICdlbmFibGUnIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRdLFxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0J2hhbmRsZXInOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLWN1c3RvbS10YXhvbm9teSBzZWxlY3QnLFxuXHRcdFx0J2hhbmRsZXJUeXBlJzogJ3NlbGVjdCcsXG5cdFx0XHQnZXZlbnQnOiAnY2hhbmdlJyxcblx0XHR9LFxuXHRcdHtcblx0XHRcdCdoYW5kbGVyJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1wb3N0X3Byb3BlcnR5IHNlbGVjdCcsXG5cdFx0XHQnaGFuZGxlclR5cGUnOiAnc2VsZWN0Jyxcblx0XHRcdCdldmVudCc6ICdjaGFuZ2UnLFxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0J2hhbmRsZXInOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLXJhdGluZ19nZXRfb3B0aW9ucyBpbnB1dCcsXG5cdFx0XHQnaGFuZGxlclR5cGUnOiAncmFkaW8nLFxuXHRcdFx0J2V2ZW50JzogJ2NoYW5nZScsXG5cdFx0XHQnZGVwZW5kYW50JzogW1xuXHRcdFx0XHR7XG5cdFx0XHRcdFx0J3NlbGVjdG9yJzogJy5yYXRpbmctbWFudWFsLW9wdGlvbnMnLFxuXHRcdFx0XHRcdCd2YWx1ZSc6IFsgJ21hbnVhbF9lbnRyeScgXSxcblx0XHRcdFx0fSxcblx0XHRcdF0sXG5cdFx0fSxcblx0XHR7XG5cdFx0XHQnaGFuZGxlcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtbGltaXRfb3B0aW9ucyBzZWxlY3QnLFxuXHRcdFx0J2hhbmRsZXJUeXBlJzogJ3NlbGVjdCcsXG5cdFx0XHQnZXZlbnQnOiAnY2hhbmdlJyxcblx0XHRcdCdkZXBlbmRhbnQnOiBbXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLWxpbWl0X3ZhbHVlc19ieV9pZCcsXG5cdFx0XHRcdFx0J3ZhbHVlJzogWyAnaW5jbHVkZScsICdleGNsdWRlJyBdLFxuXHRcdFx0XHR9LFxuXHRcdFx0XSxcblx0XHR9LFxuXHRcdHtcblx0XHRcdCdoYW5kbGVyJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1lbmFibGVfYWNjb3JkaW9uIGlucHV0Jyxcblx0XHRcdCdoYW5kbGVyVHlwZSc6ICdyYWRpbycsXG5cdFx0XHQnZXZlbnQnOiAnY2hhbmdlJyxcblx0XHRcdCdkZXBlbmRhbnQnOiBbXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLWFjY29yZGlvbl9kZWZhdWx0X3N0YXRlJyxcblx0XHRcdFx0XHQndmFsdWUnOiBbICd5ZXMnIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRdLFxuXHRcdH0sXG5cdF07XG5cblx0ZnVuY3Rpb24gX2hhbmRsZVRvZ2dsZVJlcXVlc3QoIGRhdGEsIGN1cnJlbnRTZWxlY3RvciwgdmFsdWUgKSB7XG5cdFx0Y29uc3QgJGZpZWxkICAgICAgPSBjdXJyZW50U2VsZWN0b3IuY2xvc2VzdCggJy53Y2FwZi1mb3JtLWZpZWxkJyApO1xuXHRcdGNvbnN0IGhhbmRsZXIgICAgID0gZGF0YVsgJ2hhbmRsZXInIF07XG5cdFx0Y29uc3QgaGFuZGxlclR5cGUgPSBkYXRhWyAnaGFuZGxlclR5cGUnIF07XG5cdFx0Y29uc3QgZGVwZW5kYW50ICAgPSBkYXRhWyAnZGVwZW5kYW50JyBdO1xuXG5cdFx0bGV0IF92YWx1ZSA9IHZhbHVlO1xuXG5cdFx0aWYgKCAnY2hlY2tib3gnID09PSBoYW5kbGVyVHlwZSApIHtcblx0XHRcdF92YWx1ZSA9IGN1cnJlbnRTZWxlY3Rvci5pcyggJzpjaGVja2VkJyApID8gJzEnIDogJzAnO1xuXHRcdH1cblxuXHRcdGlmICggJ3JhZGlvJyA9PT0gaGFuZGxlclR5cGUgKSB7XG5cdFx0XHRfdmFsdWUgPSAkZmllbGQuZmluZCggaGFuZGxlciArICc6Y2hlY2tlZCcgKS52YWwoKTtcblx0XHR9XG5cblx0XHQkLmVhY2goIGRlcGVuZGFudCwgZnVuY3Rpb24oIGlkLCBkICkge1xuXHRcdFx0Y29uc3QgJHNlbGVjdG9yICAgPSAkZmllbGQuZmluZCggZFsgJ3NlbGVjdG9yJyBdICk7XG5cdFx0XHRjb25zdCB2YWxpZFZhbHVlcyA9IGRbICd2YWx1ZScgXTtcblxuXHRcdFx0aWYgKCB2YWxpZFZhbHVlcy5pbmNsdWRlcyggX3ZhbHVlICkgKSB7XG5cdFx0XHRcdCRzZWxlY3Rvci5zaG93KCk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHQkc2VsZWN0b3IuaGlkZSgpO1xuXHRcdFx0fVxuXHRcdH0gKTtcblxuXHRcdCRzZWFyY2hGb3JtLnRyaWdnZXIoICdhZnRlcl90b2dnbGVfcmVxdWVzdCcsIFsgaGFuZGxlciwgX3ZhbHVlLCAkZmllbGQgXSApO1xuXHR9XG5cblx0ZnVuY3Rpb24gaGFuZGxlVG9nZ2xlUmVxdWVzdCggZGF0YSwgY3VycmVudFNlbGVjdG9yLCB2YWx1ZSApIHtcblx0XHRpZiAoIG51bGwgPT09IGN1cnJlbnRTZWxlY3RvciApIHtcblx0XHRcdGNvbnN0IGhhbmRsZXIgID0gZGF0YVsgJ2hhbmRsZXInIF07XG5cdFx0XHRjb25zdCAkaGFuZGxlciA9ICQoIGhhbmRsZXIgKTtcblxuXHRcdFx0JC5lYWNoKCAkaGFuZGxlciwgZnVuY3Rpb24oKSB7XG5cdFx0XHRcdGNvbnN0IF90aGlzICA9ICQoIHRoaXMgKTtcblx0XHRcdFx0Y29uc3QgX3ZhbHVlID0gX3RoaXMudmFsKCk7XG5cdFx0XHRcdF9oYW5kbGVUb2dnbGVSZXF1ZXN0KCBkYXRhLCBfdGhpcywgX3ZhbHVlICk7XG5cdFx0XHR9ICk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdF9oYW5kbGVUb2dnbGVSZXF1ZXN0KCBkYXRhLCBjdXJyZW50U2VsZWN0b3IsIHZhbHVlICk7XG5cdFx0fVxuXHR9XG5cblx0ZnVuY3Rpb24gc2V0dXBTZWFyY2hGb3JtKCBpbml0YWwgPSBmYWxzZSApIHtcblx0XHQkLmVhY2goIGRlcGVuZGFudERhdGEsIGZ1bmN0aW9uKCBpLCBkYXRhICkge1xuXHRcdFx0Y29uc3QgaGFuZGxlciA9IGRhdGFbICdoYW5kbGVyJyBdO1xuXHRcdFx0Y29uc3QgZXZlbnQgICA9IGRhdGFbICdldmVudCcgXTtcblxuXHRcdFx0aGFuZGxlVG9nZ2xlUmVxdWVzdCggZGF0YSwgbnVsbCwgbnVsbCApO1xuXG5cdFx0XHRpZiAoIGluaXRhbCApIHtcblx0XHRcdFx0JHNlYXJjaEZvcm0ub24oIGV2ZW50LCBoYW5kbGVyLCBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHRjb25zdCBfdGhpcyAgPSAkKCB0aGlzICk7XG5cdFx0XHRcdFx0Y29uc3QgX3ZhbHVlID0gJCggdGhpcyApLnZhbCgpO1xuXHRcdFx0XHRcdGhhbmRsZVRvZ2dsZVJlcXVlc3QoIGRhdGEsIF90aGlzLCBfdmFsdWUgKTtcblx0XHRcdFx0fSApO1xuXHRcdFx0fVxuXHRcdH0gKTtcblx0fVxuXG5cdHNldHVwU2VhcmNoRm9ybSggdHJ1ZSApO1xuXG5cdCRzZWFyY2hGb3JtLm9uKCAnZmllbGRfYWRkZWQnLCBmdW5jdGlvbigpIHtcblx0XHQvLyBUb2dnbGUgdGhlIHZpc2liaWxpdHkgb2Ygc3ViZmllbGRzLlxuXHRcdHNldHVwU2VhcmNoRm9ybSgpO1xuXHR9ICk7XG5cbn0gKTtcbiJdfQ==
