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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImRpc3BsYXktdHlwZS1maWVsZHMuanMiLCJtYW51YWwtb3B0aW9ucy10YWJsZS5qcyIsIm51bWJlci11aS1vcHRpb25zLmpzIiwicHJvZHVjdC1zdGF0dXMtdGFibGUuanMiLCJzZWFyY2gtZm9ybS5qcyIsInRvZ2dsZVZpc2liaWxpdHkuanMiXSwibmFtZXMiOlsialF1ZXJ5IiwiZG9jdW1lbnQiLCJyZWFkeSIsIiQiLCIkc2VhcmNoRm9ybSIsIm9uIiwiZSIsImhhbmRsZXIiLCJ2YWx1ZSIsIiRmaWVsZCIsIiRub1Jlc3VsdHMiLCJmaW5kIiwiJGFsbEl0ZW1zTGFiZWwiLCJ1c2VDaG9zZW4iLCJpcyIsInNob3ciLCJoaWRlIiwiZGlzcGxheVR5cGUiLCJ2YWwiLCJpbml0TWFudWFsT3B0aW9uc1RhYmxlIiwidGFibGVJZGVudGlmaWVyIiwidmFsdWVJZGVudGlmaWVyIiwicm93VGVtcGxhdGVJZCIsInJvd0RlZmF1bHRPcHRpb25zIiwiZmllbGRJZGVudGlmaWVyIiwicm93c0lkZW50aWZpZXIiLCJyb3dJZGVudGlmaWVyIiwiaW5pdFNvcnRhYmxlVGFibGUiLCIkc2VsZWN0b3IiLCJjb25zb2xlIiwibG9nIiwic29ydGFibGUiLCJvcGFjaXR5IiwicmV2ZXJ0IiwiY3Vyc29yIiwiYXhpcyIsImhhbmRsZSIsInBsYWNlaG9sZGVyIiwidXBkYXRlIiwidGFyZ2V0IiwiY2xvc2VzdCIsInRyaWdnZXJPcHRpb25zQ2hhbmdlIiwiZGlzYWJsZVNlbGVjdGlvbiIsInRhYmxlUm93c0lkZW50aWZpZXIiLCJ1aSIsIml0ZW0iLCIkdmFsdWVIb2xkZXIiLCIkcm93cyIsIl9yb3dzIiwiZWFjaCIsImkiLCJfaXRlbSIsIiRpdGVtIiwicm93IiwiZmllbGRJbmRleCIsImZpZWxkIiwicHVzaCIsInJhd1ZhbHVlcyIsImVuY29kZVVSSUNvbXBvbmVudCIsIkpTT04iLCJzdHJpbmdpZnkiLCJ0cmlnZ2VyUmVtb3ZlT3B0aW9uIiwiJG9wdGlvbnNUYWJsZSIsInRhYmxlUm93cyIsImNoaWxkcmVuIiwibGVuZ3RoIiwicmVtb3ZlQ2xhc3MiLCJyZW1vdmVCdG5JZGVudGlmaWVyIiwicmVtb3ZlIiwiY2xlYXJPcHRpb25zQnRuSWRlbnRpZmllciIsImVtcHR5IiwiYWRkT3B0aW9uQnRuSWRlbnRpZmllciIsInRlbXBsYXRlIiwid3AiLCJyZW5kZXJlZCIsIiR0YWJsZSIsImFwcGVuZCIsImhhc0NsYXNzIiwiYWRkQ2xhc3MiLCJ0ZXh0RmllbGRzSWRlbnRpZmllciIsInNlbGVjdEZpZWxkc0lkZW50aWZpZXIiLCJ0YWJsZUlkIiwidG9nZ2xlTnVtYmVyTWluVmFsdWVGaWVsZCIsIiRlbG0iLCIkdGV4dEZpZWxkIiwiYXR0ciIsInJlbW92ZUF0dHIiLCIkdGhpcyIsInRvZ2dsZU51bWJlck1heFZhbHVlRmllbGQiLCJsYWJlbCIsInRvdGFsRmllbGRJbnN0YW5jZXMiLCJzZWFyY2hGb3JtIiwicmVtb3ZlUGxhY2Vob2xkZXIiLCJ1bmlxdWVJZCIsImVsZW1lbnRzIiwiZWxlbWVudCIsIm9sZFZhbHVlIiwibmV3VmFsdWUiLCJyZXBsYWNlIiwiaW5zZXJ0RmllbGRTdWJGaWVsZHMiLCJ0eXBlIiwicGFyc2VJbnQiLCJmaWVsZFR5cGUiLCJ3cmFwcGVyIiwicHJlcGVuZCIsInRyaWdnZXIiLCJ1cGRhdGVGaWVsZHNQb3NpdGlvbiIsImlucHV0cyIsIm5iRWxlbXMiLCJpZHgiLCJtYWtlRmllbGRSZWFkeSIsInRvZ2dsZUJ0biIsImlkZW50aWZpZXIiLCJjb250YWluZXIiLCJjYW5jZWwiLCJpdGVtcyIsImNvbm5lY3RXaXRoIiwic3RvcCIsInN0YXJ0IiwiYXBwZW5kVG8iLCJwYXJlbnQiLCJvbkRyYWdTdGFydCIsIm9uRHJhZ1N0b3AiLCJkcmFnZ2FibGUiLCJjb25uZWN0VG9Tb3J0YWJsZSIsImhlbHBlciIsInRvZ2dsZUZpZWxkIiwid2lkZ2V0IiwiaW5zaWRlIiwiaXNFeHBhbmQiLCJ0b2dnbGVFeHBhbmQiLCJzbGlkZVRvZ2dsZSIsInRvZ2dsZUNsYXNzIiwiZm9jdXNGaWVsZCIsImNsYXNzTGlzdCIsImNvbnRhaW5zIiwiYWN0aW9uIiwiZm9jdXMiLCJyZW1vdmVGaWVsZCIsInNsaWRlVXAiLCJpbml0aWFsRm9ybVN0YXRlIiwic2VyaWFsaXplQXJyYXkiLCJzaG93TWVzc2FnZSIsIm1lc3NhZ2UiLCJodG1sIiwic2xpZGVEb3duIiwic2V0VGltZW91dCIsInNhdmVGb3JtIiwiYnV0dG9uIiwiZm9ybURhdGEiLCJva0NhbGxiYWNrIiwiZXJyQ2FsbGJhY2siLCJhamF4IiwicG9zdCIsImRvbmUiLCJmYWlsIiwiZGVwZW5kYW50RGF0YSIsIl9oYW5kbGVUb2dnbGVSZXF1ZXN0IiwiZGF0YSIsImN1cnJlbnRTZWxlY3RvciIsImhhbmRsZXJUeXBlIiwiZGVwZW5kYW50IiwiX3ZhbHVlIiwiaWQiLCJkIiwidmFsaWRWYWx1ZXMiLCJpbmNsdWRlcyIsImhhbmRsZVRvZ2dsZVJlcXVlc3QiLCIkaGFuZGxlciIsIl90aGlzIiwic2V0dXBTZWFyY2hGb3JtIiwiaW5pdGFsIiwiZXZlbnQiXSwibWFwcGluZ3MiOiI7O0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBQSxNQUFNLENBQUVDLFFBQUYsQ0FBTixDQUFtQkMsS0FBbkIsQ0FBMEIsVUFBVUMsQ0FBVixFQUFjO0FBRXZDLE1BQU1DLFdBQVcsR0FBR0QsQ0FBQyxDQUFFLGNBQUYsQ0FBckIsQ0FGdUMsQ0FJdkM7O0FBQ0FDLEVBQUFBLFdBQVcsQ0FBQ0MsRUFBWixDQUFnQixzQkFBaEIsRUFBd0MsVUFBVUMsQ0FBVixFQUFhQyxPQUFiLEVBQXNCQyxLQUF0QixFQUE2QkMsTUFBN0IsRUFBc0M7QUFDN0UsUUFBSyxnREFBZ0RGLE9BQXJELEVBQStEO0FBQzlELFVBQU1HLFVBQVUsR0FBT0QsTUFBTSxDQUFDRSxJQUFQLENBQWEsaURBQWIsQ0FBdkI7QUFDQSxVQUFNQyxjQUFjLEdBQUdILE1BQU0sQ0FBQ0UsSUFBUCxDQUFhLHVDQUFiLENBQXZCO0FBQ0EsVUFBTUUsU0FBUyxHQUFRSixNQUFN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QjtBQUNBLFNBSkQ7QUFLQTtBQUNELEtBYkQ7QUFjQTs7QUFFRFEsRUFBQUEsZUFBZSxDQUFFLElBQUYsQ0FBZjtBQUVBdEssRUFBQUEsV0FBVyxDQUFDQyxFQUFaLENBQWdCLGFBQWhCLEVBQStCLFlBQVc7QUFDekM7QUFDQXFLLElBQUFBLGVBQWU7QUFDZixHQUhEO0FBS0EsQ0E5UUQiLCJmaWxlIjoid2MtYWpheC1wcm9kdWN0LWZpbHRlci1hZG1pbi1zY3JpcHRzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBEaXNwbGF5IHR5cGUgZmllbGRzLlxuICpcbiAqIEBzaW5jZSAgICAgIDMuMC4wXG4gKiBAcGFja2FnZSAgICB3Yy1hamF4LXByb2R1Y3QtZmlsdGVyXG4gKiBAc3VicGFja2FnZSB3Yy1hamF4LXByb2R1Y3QtZmlsdGVyL2FkbWluL3NyYy9qc1xuICogQGF1dGhvciAgICAgTWFpbnVsIEhhc3NhbiBNYWluXG4gKi9cblxualF1ZXJ5KCBkb2N1bWVudCApLnJlYWR5KCBmdW5jdGlvbiggJCApIHtcblxuXHRjb25zdCAkc2VhcmNoRm9ybSA9ICQoICcjc2VhcmNoLWZvcm0nICk7XG5cblx0Ly8gT3ZlcnJpZGUgbm8tcmVzdWx0cy1tZXNzYWdlLCBhbGwtaXRlbXMtbGFiZWwgZmllbGQncyB0b2dnbGUgdmlzaWJpbGl0eSB3aGVuIHRleHQgZGlzcGxheSB0eXBlIGlzIGNoYW5nZWQuXG5cdCRzZWFyY2hGb3JtLm9uKCAnYWZ0ZXJfdG9nZ2xlX3JlcXVlc3QnLCBmdW5jdGlvbiggZSwgaGFuZGxlciwgdmFsdWUsICRmaWVsZCApIHtcblx0XHRpZiAoICcud2NhcGYtZm9ybS1zdWItZmllbGQtZGlzcGxheV90eXBlIHNlbGVjdCcgPT09IGhhbmRsZXIgKSB7XG5cdFx0XHRjb25zdCAkbm9SZXN1bHRzICAgICA9ICRmaWVsZC5maW5kKCAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLWNob3Nlbl9ub19yZXN1bHRzX21lc3NhZ2UnICk7XG5cdFx0XHRjb25zdCAkYWxsSXRlbXNMYWJlbCA9ICRmaWVsZC5maW5kKCAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLWFsbF9pdGVtc19sYWJlbCcgKTtcblx0XHRcdGNvbnN0IHVzZUNob3NlbiAgICAgID0gJGZpZWxkLmZpbmQoICcud2NhcGYtZm9ybS1zdWItZmllbGQtdXNlX2Nob3NlbiBpbnB1dCcgKS5pcyggJzpjaGVja2VkJyApO1xuXG5cdFx0XHRpZiAoIHVzZUNob3NlbiAmJiAoICdzZWxlY3QnID09PSB2YWx1ZSB8fCAnbXVsdGktc2VsZWN0JyA9PT0gdmFsdWUgKSApIHtcblx0XHRcdFx0JG5vUmVzdWx0cy5zaG93KCk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHQkbm9SZXN1bHRzLmhpZGUoKTtcblx0XHRcdH1cblxuXHRcdFx0aWYgKCAoICdyYWRpbycgPT09IHZhbHVlIHx8ICdzZWxlY3QnID09PSB2YWx1ZSApIHx8ICggJ211bHRpLXNlbGVjdCcgPT09IHZhbHVlICYmIHVzZUNob3NlbiApICkge1xuXHRcdFx0XHQkYWxsSXRlbXNMYWJlbC5zaG93KCk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHQkYWxsSXRlbXNMYWJlbC5oaWRlKCk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9ICk7XG5cblx0Ly8gT3ZlcnJpZGUgbm8tcmVzdWx0cy1tZXNzYWdlLCBhbGwtaXRlbXMtbGFiZWwgZmllbGQncyB0b2dnbGUgdmlzaWJpbGl0eSB3aGVuIHRleHQgdXNlIGNob3NlbiBpcyBjaGFuZ2VkLlxuXHQkc2VhcmNoRm9ybS5vbiggJ2FmdGVyX3RvZ2dsZV9yZXF1ZXN0JywgZnVuY3Rpb24oIGUsIGhhbmRsZXIsIHZhbHVlLCAkZmllbGQgKSB7XG5cdFx0aWYgKCAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLXVzZV9jaG9zZW4gaW5wdXQnID09PSBoYW5kbGVyICkge1xuXHRcdFx0Y29uc3QgJG5vUmVzdWx0cyAgICAgPSAkZmllbGQuZmluZCggJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1jaG9zZW5fbm9fcmVzdWx0c19tZXNzYWdlJyApO1xuXHRcdFx0Y29uc3QgJGFsbEl0ZW1zTGFiZWwgPSAkZmllbGQuZmluZCggJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1hbGxfaXRlbXNfbGFiZWwnICk7XG5cdFx0XHRjb25zdCBkaXNwbGF5VHlwZSAgICA9ICRmaWVsZC5maW5kKCAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLWRpc3BsYXlfdHlwZSBzZWxlY3QnICkudmFsKCk7XG5cblx0XHRcdGlmICggJzEnID09PSB2YWx1ZSAmJiAoICdzZWxlY3QnID09PSBkaXNwbGF5VHlwZSB8fCAnbXVsdGktc2VsZWN0JyA9PT0gZGlzcGxheVR5cGUgKSApIHtcblx0XHRcdFx0JG5vUmVzdWx0cy5zaG93KCk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHQkbm9SZXN1bHRzLmhpZGUoKTtcblx0XHRcdH1cblxuXHRcdFx0aWYgKFxuXHRcdFx0XHQoICcxJyA9PT0gdmFsdWUgJiYgJ211bHRpLXNlbGVjdCcgPT09IGRpc3BsYXlUeXBlIClcblx0XHRcdFx0fHwgKCAncmFkaW8nID09PSBkaXNwbGF5VHlwZSB8fCAnc2VsZWN0JyA9PT0gZGlzcGxheVR5cGUgKVxuXHRcdFx0KSB7XG5cdFx0XHRcdCRhbGxJdGVtc0xhYmVsLnNob3coKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdCRhbGxJdGVtc0xhYmVsLmhpZGUoKTtcblx0XHRcdH1cblx0XHR9XG5cdH0gKTtcblxufSApO1xuIiwiLyoqXG4gKiBNYW51YWwgT3B0aW9ucycgdGFibGUgZnVuY3Rpb24uXG4gKlxuICogQHNpbmNlICAgICAgMy4wLjBcbiAqIEBwYWNrYWdlICAgIHdjLWFqYXgtcHJvZHVjdC1maWx0ZXJcbiAqIEBzdWJwYWNrYWdlIHdjLWFqYXgtcHJvZHVjdC1maWx0ZXIvYWRtaW4vc3JjL2pzXG4gKiBAYXV0aG9yICAgICBNYWludWwgSGFzc2FuIE1haW5cbiAqL1xuXG4vKipcbiAqIEBwYXJhbSB0YWJsZUlkZW50aWZpZXJcbiAqIEBwYXJhbSB2YWx1ZUlkZW50aWZpZXJcbiAqIEBwYXJhbSByb3dUZW1wbGF0ZUlkXG4gKiBAcGFyYW0gcm93RGVmYXVsdE9wdGlvbnNcbiAqL1xuZnVuY3Rpb24gaW5pdE1hbnVhbE9wdGlvbnNUYWJsZSggdGFibGVJZGVudGlmaWVyLCB2YWx1ZUlkZW50aWZpZXIsIHJvd1RlbXBsYXRlSWQsIHJvd0RlZmF1bHRPcHRpb25zICkge1xuXHRjb25zdCAkID0galF1ZXJ5O1xuXG5cdGNvbnN0ICRzZWFyY2hGb3JtID0gJCggJyNzZWFyY2gtZm9ybScgKTtcblxuXHRjb25zdCBmaWVsZElkZW50aWZpZXIgPSAnLndjYXBmLWZvcm0tZmllbGQnO1xuXHRjb25zdCByb3dzSWRlbnRpZmllciAgPSAnLmZpZWxkLXRhYmxlLWJvZHktcm93cyc7XG5cdGNvbnN0IHJvd0lkZW50aWZpZXIgICA9ICcucm93LWl0ZW0nO1xuXG5cdGZ1bmN0aW9uIGluaXRTb3J0YWJsZVRhYmxlKCAkc2VsZWN0b3IgKSB7XG5cdFx0Y29uc29sZS5sb2coICd1cGRhdGUgY2FsbGVkIGZvcicsICRzZWxlY3RvciApO1xuXG5cdFx0JHNlbGVjdG9yLnNvcnRhYmxlKCB7XG5cdFx0XHRvcGFjaXR5OiAwLjgsXG5cdFx0XHRyZXZlcnQ6IGZhbHNlLFxuXHRcdFx0Y3Vyc29yOiAnbW92ZScsXG5cdFx0XHRheGlzOiAneScsXG5cdFx0XHRoYW5kbGU6ICcubW92ZS1vcHRpb25zLWhhbmRsZXInLFxuXHRcdFx0cGxhY2Vob2xkZXI6ICd3aWRnZXQtcGxhY2Vob2xkZXInLFxuXHRcdFx0dXBkYXRlOiBmdW5jdGlvbiggZSApIHtcblx0XHRcdFx0Y29uc3QgJGZpZWxkID0gJCggZS50YXJnZXQgKS5jbG9zZXN0KCAnLndjYXBmLWZvcm0tZmllbGQnICk7XG5cblx0XHRcdFx0dHJpZ2dlck9wdGlvbnNDaGFuZ2UoICRmaWVsZCApO1xuXHRcdFx0fVxuXHRcdH0gKS5kaXNhYmxlU2VsZWN0aW9uKCk7XG5cdH1cblxuXHRjb25zdCB0YWJsZVJvd3NJZGVudGlmaWVyID0gdGFibGVJZGVudGlmaWVyICsgJyAnICsgcm93c0lkZW50aWZpZXI7XG5cblx0Ly8gSW5pdCB0aGUgc29ydGFibGUgdGFibGUgYWZ0ZXIgcGFnZSBsb2Fkcy5cblx0aW5pdFNvcnRhYmxlVGFibGUoICRzZWFyY2hGb3JtLmZpbmQoIHRhYmxlUm93c0lkZW50aWZpZXIgKSApO1xuXG5cdC8vIEluaXQgdGhlIHNvcnRhYmxlIHRhYmxlIGFmdGVyIHRoZSBmaWVsZCBpcyBhZGRlZC5cblx0JHNlYXJjaEZvcm0ub24oICdmaWVsZF9hZGRlZCcsIGZ1bmN0aW9uKCBlLCB1aSApIHtcblx0XHRpbml0U29ydGFibGVUYWJsZSggJCggdWkuaXRlbS5maW5kKCB0YWJsZVJvd3NJZGVudGlmaWVyICkgKSApO1xuXHR9ICk7XG5cblx0ZnVuY3Rpb24gdHJpZ2dlck9wdGlvbnNDaGFuZ2UoICRmaWVsZCApIHtcblx0XHRjb25zdCAkdmFsdWVIb2xkZXIgPSAkZmllbGQuZmluZCggdmFsdWVJZGVudGlmaWVyICk7XG5cdFx0Y29uc3QgJHJvd3MgICAgICAgID0gJGZpZWxkLmZpbmQoIHRhYmxlUm93c0lkZW50aWZpZXIgKTtcblx0XHRjb25zdCBfcm93cyAgICAgICAgPSBbXTtcblxuXHRcdCRyb3dzLmZpbmQoICcucm93LWl0ZW0nICkuZWFjaCggZnVuY3Rpb24oIGksIF9pdGVtICkge1xuXHRcdFx0Y29uc3QgJGl0ZW0gPSAkKCBfaXRlbSApO1xuXHRcdFx0Y29uc3Qgcm93ICAgPSBbXTtcblxuXHRcdFx0JGl0ZW0uZmluZCggJ1tkYXRhLW5hbWVdJyApLmVhY2goIGZ1bmN0aW9uKCBmaWVsZEluZGV4LCBmaWVsZCApIHtcblx0XHRcdFx0Y29uc3QgJGZpZWxkID0gJCggZmllbGQgKTtcblxuXHRcdFx0XHRyb3cucHVzaCggJGZpZWxkLnZhbCgpICk7XG5cdFx0XHR9ICk7XG5cblx0XHRcdF9yb3dzLnB1c2goIHJvdyApO1xuXHRcdH0gKTtcblxuXHRcdGNvbnN0IHJhd1ZhbHVlcyA9IGVuY29kZVVSSUNvbXBvbmVudCggSlNPTi5zdHJpbmdpZnkoIF9yb3dzICkgKTtcblx0XHQkdmFsdWVIb2xkZXIudmFsKCByYXdWYWx1ZXMgKTtcblx0fVxuXG5cdGZ1bmN0aW9uIHRyaWdnZXJSZW1vdmVPcHRpb24oICRmaWVsZCApIHtcblx0XHRjb25zdCAkb3B0aW9uc1RhYmxlID0gJGZpZWxkLmZpbmQoIHRhYmxlSWRlbnRpZmllciApO1xuXHRcdGNvbnN0IHRhYmxlUm93cyAgICAgPSAkZmllbGQuZmluZCggdGFibGVSb3dzSWRlbnRpZmllciApLmNoaWxkcmVuKCk7XG5cblx0XHRpZiAoIDIgPiB0YWJsZVJvd3MubGVuZ3RoICkge1xuXHRcdFx0JG9wdGlvbnNUYWJsZS5yZW1vdmVDbGFzcyggJ2hhcy1vcHRpb25zJyApO1xuXHRcdH1cblx0fVxuXG5cdC8vIFJlbW92ZSBPcHRpb25cblx0Y29uc3QgcmVtb3ZlQnRuSWRlbnRpZmllciA9IHRhYmxlSWRlbnRpZmllciArICcgLnJlbW92ZS1vcHRpb24nO1xuXG5cdCRzZWFyY2hGb3JtLm9uKCAnY2xpY2snLCByZW1vdmVCdG5JZGVudGlmaWVyLCBmdW5jdGlvbigpIHtcblx0XHRjb25zdCAkaXRlbSAgPSAkKCB0aGlzICkuY2xvc2VzdCggcm93SWRlbnRpZmllciApO1xuXHRcdGNvbnN0ICRmaWVsZCA9ICRpdGVtLmNsb3Nlc3QoIGZpZWxkSWRlbnRpZmllciApO1xuXG5cdFx0dHJpZ2dlclJlbW92ZU9wdGlvbiggJGZpZWxkICk7XG5cblx0XHQkaXRlbS5yZW1vdmUoKTtcblxuXHRcdHRyaWdnZXJPcHRpb25zQ2hhbmdlKCAkZmllbGQgKTtcblx0fSApO1xuXG5cdC8vIENsZWFyIEFsbCBPcHRpb25zXG5cdGNvbnN0IGNsZWFyT3B0aW9uc0J0bklkZW50aWZpZXIgPSB0YWJsZUlkZW50aWZpZXIgKyAnIC5jbGVhci1vcHRpb25zJztcblxuXHQkc2VhcmNoRm9ybS5vbiggJ2NsaWNrJywgY2xlYXJPcHRpb25zQnRuSWRlbnRpZmllciwgZnVuY3Rpb24oKSB7XG5cdFx0Y29uc3QgJGZpZWxkID0gJCggdGhpcyApLmNsb3Nlc3QoIGZpZWxkSWRlbnRpZmllciApO1xuXG5cdFx0JGZpZWxkLmZpbmQoIHRhYmxlUm93c0lkZW50aWZpZXIgKS5lbXB0eSgpO1xuXG5cdFx0dHJpZ2dlclJlbW92ZU9wdGlvbiggJGZpZWxkICk7XG5cdFx0dHJpZ2dlck9wdGlvbnNDaGFuZ2UoICRmaWVsZCApO1xuXHR9ICk7XG5cblx0Ly8gQWRkIE5ldyBPcHRpb25cblx0Y29uc3QgYWRkT3B0aW9uQnRuSWRlbnRpZmllciA9IHRhYmxlSWRlbnRpZmllciArICcgLmFkZC1vcHRpb24nO1xuXG5cdCRzZWFyY2hGb3JtLm9uKCAnY2xpY2snLCBhZGRPcHRpb25CdG5JZGVudGlmaWVyLCBmdW5jdGlvbigpIHtcblx0XHQvLyBCYWlsIG91dCBpZiBubyB0bXBsIGZvdW5kIGZvciB0aGUgdHlwZS5cblx0XHRpZiAoICEgalF1ZXJ5KCAnI3RtcGwtJyArIHJvd1RlbXBsYXRlSWQgKS5sZW5ndGggKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0Y29uc3QgJGZpZWxkID0gJCggdGhpcyApLmNsb3Nlc3QoIGZpZWxkSWRlbnRpZmllciApO1xuXG5cdFx0Y29uc3QgdGVtcGxhdGUgPSB3cC50ZW1wbGF0ZSggcm93VGVtcGxhdGVJZCApO1xuXHRcdGNvbnN0IHJlbmRlcmVkID0gdGVtcGxhdGUoIHJvd0RlZmF1bHRPcHRpb25zICk7XG5cdFx0Y29uc3QgJHRhYmxlICAgPSAkZmllbGQuZmluZCggdGFibGVJZGVudGlmaWVyICk7XG5cdFx0Y29uc3QgJHJvd3MgICAgPSAkZmllbGQuZmluZCggdGFibGVSb3dzSWRlbnRpZmllciApO1xuXG5cdFx0JHJvd3MuYXBwZW5kKCByZW5kZXJlZCApO1xuXG5cdFx0dHJpZ2dlck9wdGlvbnNDaGFuZ2UoICRmaWVsZCApO1xuXG5cdFx0aWYgKCAhICR0YWJsZS5oYXNDbGFzcyggJ2hhcy1vcHRpb25zJyApICkge1xuXHRcdFx0JHRhYmxlLmFkZENsYXNzKCAnaGFzLW9wdGlvbnMnICk7XG5cdFx0fVxuXHR9ICk7XG5cblx0Ly8gVHJpZ2dlciBvcHRpb25zIGNoYW5nZSB3aGVuIHRoZSB0ZXh0IGZpZWxkcyBnZXQgY2hhbmdlZC5cblx0Y29uc3QgdGV4dEZpZWxkc0lkZW50aWZpZXIgPSB0YWJsZVJvd3NJZGVudGlmaWVyICsgJyBpbnB1dFt0eXBlPVwidGV4dFwiXSc7XG5cblx0JHNlYXJjaEZvcm0ub24oICdpbnB1dCcsIHRleHRGaWVsZHNJZGVudGlmaWVyLCBmdW5jdGlvbigpIHtcblx0XHRjb25zdCAkZmllbGQgPSAkKCB0aGlzICkuY2xvc2VzdCggZmllbGRJZGVudGlmaWVyICk7XG5cblx0XHR0cmlnZ2VyT3B0aW9uc0NoYW5nZSggJGZpZWxkICk7XG5cdH0gKTtcblxuXHQvLyBUcmlnZ2VyIG9wdGlvbnMgY2hhbmdlIHdoZW4gdGhlIHNlbGVjdCBmaWVsZHMgZ2V0IGNoYW5nZWQuXG5cdGxldCBzZWxlY3RGaWVsZHNJZGVudGlmaWVyID0gdGFibGVSb3dzSWRlbnRpZmllciArICcgc2VsZWN0JztcblxuXHQkc2VhcmNoRm9ybS5vbiggJ2NoYW5nZScsIHNlbGVjdEZpZWxkc0lkZW50aWZpZXIsIGZ1bmN0aW9uKCkge1xuXHRcdGNvbnN0ICRmaWVsZCA9ICQoIHRoaXMgKS5jbG9zZXN0KCBmaWVsZElkZW50aWZpZXIgKTtcblxuXHRcdHRyaWdnZXJPcHRpb25zQ2hhbmdlKCAkZmllbGQgKTtcblx0fSApO1xuXG5cdC8vIFRyaWdnZXIgb3B0aW9ucyBjaGFuZ2Ugd2hlbiB2YWx1ZSBpcyBhZGRlZCBmcm9tIG1vZGFsLlxuXHQkc2VhcmNoRm9ybS5vbiggJ3RyaWdnZXJfb3B0aW9uc190YWJsZScsIGZ1bmN0aW9uKCBlLCB0YWJsZUlkLCAkZmllbGQgKSB7XG5cdFx0aWYgKCB0YWJsZUlkID09PSB0YWJsZUlkZW50aWZpZXIgKSB7XG5cdFx0XHR0cmlnZ2VyT3B0aW9uc0NoYW5nZSggJGZpZWxkICk7XG5cdFx0fVxuXHR9ICk7XG5cbn1cbiIsIi8qKlxuICogVGhlIG51bWJlciB1aSBvcHRpb25zLlxuICpcbiAqIEBzaW5jZSAgICAgIDMuMC4wXG4gKiBAcGFja2FnZSAgICB3Yy1hamF4LXByb2R1Y3QtZmlsdGVyXG4gKiBAc3VicGFja2FnZSB3Yy1hamF4LXByb2R1Y3QtZmlsdGVyL2FkbWluL3NyYy9qc1xuICogQGF1dGhvciAgICAgTWFpbnVsIEhhc3NhbiBNYWluXG4gKi9cblxualF1ZXJ5KCBkb2N1bWVudCApLnJlYWR5KCBmdW5jdGlvbiggJCApIHtcblxuXHRjb25zdCAkc2VhcmNoRm9ybSA9ICQoICcjc2VhcmNoLWZvcm0nICk7XG5cblx0LyoqXG5cdCAqIFRvZ2dsZSBkaXNhYmxlZCBhdHRyaWJ1dGUgb2YgbWluLXZhbHVlIGZpZWxkIGZvciBudW1iZXIgdHlwZS5cblx0ICovXG5cdGZ1bmN0aW9uIHRvZ2dsZU51bWJlck1pblZhbHVlRmllbGQoICRlbG0gKSB7XG5cdFx0Y29uc3QgJGZpZWxkICAgICA9ICRlbG0uY2xvc2VzdCggJy53Y2FwZi1mb3JtLWZpZWxkJyApO1xuXHRcdGNvbnN0ICR0ZXh0RmllbGQgPSAkZmllbGQuZmluZCggJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1taW5fdmFsdWUgaW5wdXRbdHlwZT1cInRleHRcIl0nICk7XG5cblx0XHRpZiAoICRlbG0uaXMoICc6Y2hlY2tlZCcgKSApIHtcblx0XHRcdCR0ZXh0RmllbGQuYXR0ciggJ2Rpc2FibGVkJywgJ2Rpc2FibGVkJyApO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHQkdGV4dEZpZWxkLnJlbW92ZUF0dHIoICdkaXNhYmxlZCcgKTtcblx0XHR9XG5cdH1cblxuXHQkc2VhcmNoRm9ybS5maW5kKCAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLW1pbl92YWx1ZV9hdXRvX2RldGVjdCBpbnB1dFt0eXBlPVwiY2hlY2tib3hcIl0nICkuZWFjaCggZnVuY3Rpb24oKSB7XG5cdFx0Y29uc3QgJHRoaXMgPSAkKCB0aGlzICk7XG5cblx0XHR0b2dnbGVOdW1iZXJNaW5WYWx1ZUZpZWxkKCAkdGhpcyApO1xuXHR9ICk7XG5cblx0JHNlYXJjaEZvcm0ub24oXG5cdFx0J2NsaWNrJyxcblx0XHQnLndjYXBmLWZvcm0tc3ViLWZpZWxkLW1pbl92YWx1ZV9hdXRvX2RldGVjdCBpbnB1dFt0eXBlPVwiY2hlY2tib3hcIl0nLFxuXHRcdGZ1bmN0aW9uKCkge1xuXHRcdFx0Y29uc3QgJHRoaXMgPSAkKCB0aGlzICk7XG5cblx0XHRcdHRvZ2dsZU51bWJlck1pblZhbHVlRmllbGQoICR0aGlzICk7XG5cdFx0fVxuXHQpO1xuXG5cdC8qKlxuXHQgKiBUb2dnbGUgZGlzYWJsZWQgYXR0cmlidXRlIG9mIG1heC12YWx1ZSBmaWVsZCBmb3IgbnVtYmVyIHR5cGUuXG5cdCAqL1xuXHRmdW5jdGlvbiB0b2dnbGVOdW1iZXJNYXhWYWx1ZUZpZWxkKCAkZWxtICkge1xuXHRcdGNvbnN0ICRmaWVsZCAgICAgPSAkZWxtLmNsb3Nlc3QoICcud2NhcGYtZm9ybS1maWVsZCcgKTtcblx0XHRjb25zdCAkdGV4dEZpZWxkID0gJGZpZWxkLmZpbmQoICcud2NhcGYtZm9ybS1zdWItZmllbGQtbWF4X3ZhbHVlIGlucHV0W3R5cGU9XCJ0ZXh0XCJdJyApO1xuXG5cdFx0aWYgKCAkZWxtLmlzKCAnOmNoZWNrZWQnICkgKSB7XG5cdFx0XHQkdGV4dEZpZWxkLmF0dHIoICdkaXNhYmxlZCcsICdkaXNhYmxlZCcgKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0JHRleHRGaWVsZC5yZW1vdmVBdHRyKCAnZGlzYWJsZWQnICk7XG5cdFx0fVxuXHR9XG5cblx0JHNlYXJjaEZvcm0uZmluZCggJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1tYXhfdmFsdWVfYXV0b19kZXRlY3QgaW5wdXRbdHlwZT1cImNoZWNrYm94XCJdJyApLmVhY2goIGZ1bmN0aW9uKCkge1xuXHRcdGNvbnN0ICR0aGlzID0gJCggdGhpcyApO1xuXG5cdFx0dG9nZ2xlTnVtYmVyTWF4VmFsdWVGaWVsZCggJHRoaXMgKTtcblx0fSApO1xuXG5cdCRzZWFyY2hGb3JtLm9uKFxuXHRcdCdjbGljaycsXG5cdFx0Jy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1tYXhfdmFsdWVfYXV0b19kZXRlY3QgaW5wdXRbdHlwZT1cImNoZWNrYm94XCJdJyxcblx0XHRmdW5jdGlvbigpIHtcblx0XHRcdGNvbnN0ICR0aGlzID0gJCggdGhpcyApO1xuXG5cdFx0XHR0b2dnbGVOdW1iZXJNYXhWYWx1ZUZpZWxkKCAkdGhpcyApO1xuXHRcdH1cblx0KTtcblxufSApO1xuIiwiLyoqXG4gKiBUaGUgcHJvZHVjdCBzdGF0dXMgZmllbGQuXG4gKlxuICogQHNpbmNlICAgICAgMy4wLjBcbiAqIEBwYWNrYWdlICAgIHdjLWFqYXgtcHJvZHVjdC1maWx0ZXJcbiAqIEBzdWJwYWNrYWdlIHdjLWFqYXgtcHJvZHVjdC1maWx0ZXIvYWRtaW4vc3JjL2pzXG4gKiBAYXV0aG9yICAgICBNYWludWwgSGFzc2FuIE1haW5cbiAqL1xuXG5qUXVlcnkoIGRvY3VtZW50ICkucmVhZHkoIGZ1bmN0aW9uKCkge1xuXG5cdGNvbnN0IHRhYmxlSWRlbnRpZmllciA9ICcucHJvZHVjdC1zdGF0dXMtb3B0aW9ucy10YWJsZSc7XG5cdGNvbnN0IHZhbHVlSWRlbnRpZmllciA9ICcud2NhcGYtZm9ybS1zdWItZmllbGQtcHJvZHVjdF9zdGF0dXNfb3B0aW9ucyBpbnB1dCc7XG5cdGNvbnN0IHJvd1RlbXBsYXRlSWQgICA9ICd3Y2FwZi1wcm9kdWN0LXN0YXR1cy1vcHRpb24nO1xuXG5cdGNvbnN0IHJvd0RlZmF1bHRPcHRpb25zID0ge1xuXHRcdHZhbHVlOiAnJyxcblx0XHRsYWJlbDogJycsXG5cdH07XG5cblx0aW5pdE1hbnVhbE9wdGlvbnNUYWJsZSggdGFibGVJZGVudGlmaWVyLCB2YWx1ZUlkZW50aWZpZXIsIHJvd1RlbXBsYXRlSWQsIHJvd0RlZmF1bHRPcHRpb25zICk7XG5cbn0gKTtcbiIsIi8qKlxuICogVGhlIHNlYXJjaCBmb3JtLlxuICpcbiAqIEBzaW5jZSAgICAgIDMuMC4wXG4gKiBAcGFja2FnZSAgICB3Yy1hamF4LXByb2R1Y3QtZmlsdGVyXG4gKiBAc3VicGFja2FnZSB3Yy1hamF4LXByb2R1Y3QtZmlsdGVyL2FkbWluL3NyYy9qc1xuICogQGF1dGhvciAgICAgTWFpbnVsIEhhc3NhbiBNYWluXG4gKi9cblxuY29uc3QgdG90YWxGaWVsZEluc3RhbmNlcyA9IGpRdWVyeSggJyN0b3RhbF9maWVsZF9pbnN0YW5jZXMnICk7XG5cbmNvbnN0IHNlYXJjaEZvcm0gPSBqUXVlcnkoICcjc2VhcmNoLWZvcm0nICk7XG5cbi8qKlxuICogQXNzaWduIGEgdW5pcXVlIGlkIGJ5IHJlcGxhY2luZyB0aGUgcGxhY2Vob2xkZXIgaWQuXG4gKi9cbmZ1bmN0aW9uIHJlbW92ZVBsYWNlaG9sZGVyKCB1bmlxdWVJZCwgZWxlbWVudHMsIGF0dHIgKSB7XG5cdGVsZW1lbnRzLmVhY2goXG5cdFx0ZnVuY3Rpb24oKSB7XG5cdFx0XHRjb25zdCBlbGVtZW50ID0galF1ZXJ5KCB0aGlzICk7XG5cblx0XHRcdGNvbnN0IG9sZFZhbHVlID0gZWxlbWVudC5hdHRyKCBhdHRyICk7XG5cdFx0XHRjb25zdCBuZXdWYWx1ZSA9IG9sZFZhbHVlLnJlcGxhY2UoICclJScsIHVuaXF1ZUlkICk7XG5cblx0XHRcdGVsZW1lbnQuYXR0ciggYXR0ciwgbmV3VmFsdWUgKTtcblx0XHR9XG5cdCk7XG59XG5cbi8qKlxuICogSW5zZXJ0IHRoZSBmaWVsZCdzIHN1YmZpZWxkcy5cbiAqL1xuZnVuY3Rpb24gaW5zZXJ0RmllbGRTdWJGaWVsZHMoIHVpICkge1xuXHQvLyBJbnNlcnQgdGhlIGZpZWxkJ3Mgc3ViZmllbGRzIGlmIG5vdCBhbHJlYWR5IGluc2VydGVkLlxuXHRpZiAoICEgdWkuaXRlbS5oYXNDbGFzcyggJ3N1Yi1maWVsZHMtcmVhZHknICkgKSB7XG5cdFx0Y29uc3QgdHlwZSAgICAgID0gdWkuaXRlbS5hdHRyKCAnZGF0YS1maWVsZC10eXBlJyApO1xuXHRcdGNvbnN0IHVuaXF1ZUlkICA9IHBhcnNlSW50KCB0b3RhbEZpZWxkSW5zdGFuY2VzLnZhbCgpICk7XG5cdFx0Y29uc3QgZmllbGRUeXBlID0gJ3djYXBmLWZvcm0tZmllbGQtJyArIHR5cGU7XG5cblx0XHQvLyBCYWlsIG91dCBpZiBubyB0bXBsIGZvdW5kIGZvciB0aGUgdHlwZS5cblx0XHRpZiAoICEgalF1ZXJ5KCAnI3RtcGwtJyArIGZpZWxkVHlwZSApLmxlbmd0aCApIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHQvLyBJbmNyZW1lbnQgdGhlIHZhbHVlIG9mIHRvdGFsIGZpZWxkIGluc3RhbmNlcy5cblx0XHR0b3RhbEZpZWxkSW5zdGFuY2VzLnZhbCggdW5pcXVlSWQgKyAxICk7XG5cblx0XHRjb25zdCB0ZW1wbGF0ZSA9IHdwLnRlbXBsYXRlKCBmaWVsZFR5cGUgKTtcblx0XHRjb25zdCByZW5kZXJlZCA9IHRlbXBsYXRlKCk7XG5cdFx0Y29uc3Qgd3JhcHBlciAgPSB1aS5pdGVtLmZpbmQoICcud2lkZ2V0LWNvbnRlbnQnICk7XG5cblx0XHR3cmFwcGVyLnByZXBlbmQoIHJlbmRlcmVkICk7XG5cblx0XHQvLyBVcGRhdGUgdGhlIGZvciBhdHRyaWJ1dGVzIG9mIHRoZSBsYWJlbHMuXG5cdFx0cmVtb3ZlUGxhY2Vob2xkZXIoIHVuaXF1ZUlkLCB1aS5pdGVtLmZpbmQoICdsYWJlbFtmb3JePVwid2NhcGYtaW5wdXQtXCJdJyApLCAnZm9yJyApO1xuXG5cdFx0Ly8gVXBkYXRlIHRoZSBpZHMgb2YgdGhlIGlucHV0IGVsZW1lbnRzLlxuXHRcdHJlbW92ZVBsYWNlaG9sZGVyKCB1bmlxdWVJZCwgdWkuaXRlbS5maW5kKCAnKltpZF49XCJ3Y2FwZi1pbnB1dC1cIl0nICksICdpZCcgKTtcblxuXHRcdC8vIFVwZGF0ZSB0aGUgbmFtZXMgb2YgdGhlIGlucHV0IGVsZW1lbnRzLlxuXHRcdHJlbW92ZVBsYWNlaG9sZGVyKCB1bmlxdWVJZCwgdWkuaXRlbS5maW5kKCAnKltpZF49XCJ3Y2FwZi1pbnB1dC1cIl0nICksICduYW1lJyApO1xuXG5cdFx0Ly8gVXBkYXRlIHRoZSBwb3NpdGlvbiB2YWx1ZS5cblx0XHRyZW1vdmVQbGFjZWhvbGRlciggdW5pcXVlSWQsIHVpLml0ZW0uZmluZCggJypbaWRePVwid2NhcGYtaW5wdXQtcG9zaXRpb24tXCJdJyApLCAndmFsdWUnICk7XG5cblx0XHR1aS5pdGVtLmFkZENsYXNzKCAnc3ViLWZpZWxkcy1yZWFkeScgKTtcblxuXHRcdHNlYXJjaEZvcm0udHJpZ2dlciggJ2ZpZWxkX2FkZGVkJywgWyB1aSBdICk7XG5cdH1cbn1cblxuLyoqXG4gKiBVcGRhdGUgdGhlIGZvcm0gZmllbGQncyBwb3NpdGlvbiBhZnRlciBzb3J0LlxuICpcbiAqIEBzb3VyY2UgaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9hLzE0NzM2Nzc1XG4gKi9cbmZ1bmN0aW9uIHVwZGF0ZUZpZWxkc1Bvc2l0aW9uKCkge1xuXHRjb25zdCBpbnB1dHMgID0gc2VhcmNoRm9ybS5maW5kKCAnKltpZF49XCJ3Y2FwZi1pbnB1dC1wb3NpdGlvbi1cIl0nICk7XG5cdGNvbnN0IG5iRWxlbXMgPSBpbnB1dHMubGVuZ3RoO1xuXG5cdGlucHV0cy5lYWNoKFxuXHRcdGZ1bmN0aW9uKCBpZHggKSB7XG5cdFx0XHRqUXVlcnkoIHRoaXMgKS52YWwoIG5iRWxlbXMgLSAoIG5iRWxlbXMgLSBpZHggKSApO1xuXHRcdH1cblx0KTtcbn1cblxuLyoqXG4gKiBNYWtlIHRoZSBmaWVsZCByZWFkeSwgcmVtb3ZlIHN0eWxlcyBjb21lcyBmcm9tIGpxdWVyeS11aS1zb3J0YWJsZSBwbHVnaW4sIGluc2VydCB0aGUgZmllbGQncyBzdWJmaWVsZHMgZXRjLlxuICovXG5mdW5jdGlvbiBtYWtlRmllbGRSZWFkeSggZSwgdWkgKSB7XG5cdC8vIFJlbW92ZSBzdHlsZXMgY29tZXMgZnJvbSBqcXVlcnktdWktc29ydGFibGUgcGx1Z2luLlxuXHR1aS5pdGVtLnJlbW92ZUF0dHIoICdzdHlsZScgKTtcblxuXHRpbnNlcnRGaWVsZFN1YkZpZWxkcyggdWkgKTtcblxuXHR1cGRhdGVGaWVsZHNQb3NpdGlvbigpO1xuXG5cdGNvbnN0IHRvZ2dsZUJ0biA9IHVpLml0ZW0uZmluZCggJy53aWRnZXQtYWN0aW9uJyApO1xuXG5cdC8vIEV4cGFuZCB0aGUgZm9ybSBmaWVsZCBhZnRlciBzb3J0LlxuXHRpZiAoICdmYWxzZScgPT09IHRvZ2dsZUJ0bi5hdHRyKCAnYXJpYS1leHBhbmRlZCcgKSApIHtcblx0XHR0b2dnbGVCdG4udHJpZ2dlciggJ2NsaWNrJyApO1xuXHR9XG59XG5cbi8qKlxuICogSW5zdGFudGlhdGUgc29ydGFibGUgZm9yIHRoZSBmb3JtIGZpZWxkcy5cbiAqL1xuZnVuY3Rpb24gc29ydGFibGUoIGlkZW50aWZpZXIgKSB7XG5cdGNvbnN0IGNvbnRhaW5lciA9IGpRdWVyeSggaWRlbnRpZmllciApO1xuXG5cdGNvbnRhaW5lci5zb3J0YWJsZShcblx0XHR7XG5cdFx0XHRvcGFjaXR5OiAwLjgsXG5cdFx0XHRyZXZlcnQ6IGZhbHNlLFxuXHRcdFx0Y3Vyc29yOiAnbW92ZScsXG5cdFx0XHRheGlzOiAneScsXG5cdFx0XHRoYW5kbGU6ICcud2lkZ2V0LXRvcCcsXG5cdFx0XHRjYW5jZWw6ICcud2lkZ2V0LXRpdGxlLWFjdGlvbicsXG5cdFx0XHRpdGVtczogJy53aWRnZXQnLFxuXHRcdFx0cGxhY2Vob2xkZXI6ICd3aWRnZXQtcGxhY2Vob2xkZXInLFxuXHRcdFx0Y29ubmVjdFdpdGg6ICcjc2VhcmNoLWZvcm0td3JhcHBlcicsXG5cdFx0XHRzdG9wOiBtYWtlRmllbGRSZWFkeSxcblx0XHRcdHN0YXJ0OiBmdW5jdGlvbiggZSwgdWkgKSB7XG5cdFx0XHRcdC8vIElmIGl0IGlzIGdldHRpbmcgYXBwZW5kZWQgdG8gdGhlIHdyb25nIHBsYWNlLCB0aGVuIGZvcmNlIGl0IGludG8gdGhlIHJpZ2h0IGNvbnRhaW5lci5cblx0XHRcdFx0dWkucGxhY2Vob2xkZXIuYXBwZW5kVG8oIHVpLnBsYWNlaG9sZGVyLnBhcmVudCgpLmZpbmQoICcuaW5zaWRlICNzZWFyY2gtZm9ybS13cmFwcGVyJyApICk7XG5cdFx0XHR9XG5cdFx0fVxuXHQpO1xufVxuXG5zb3J0YWJsZSggJyNzZWFyY2gtZm9ybScgKTtcblxuLyoqXG4gKiBSdW4gZnVuY3Rpb24gd2hlbiBkcmFnIHN0YXJ0cy5cbiAqL1xuZnVuY3Rpb24gb25EcmFnU3RhcnQoKSB7XG5cdHNlYXJjaEZvcm0uYWRkQ2xhc3MoICd1aS1kcm9wLWFjdGl2ZScgKTtcbn1cblxuLyoqXG4gKiBSdW4gZnVuY3Rpb24gYXQgZHJhZyBzdG9wLlxuICovXG5mdW5jdGlvbiBvbkRyYWdTdG9wKCkge1xuXHRzZWFyY2hGb3JtLnJlbW92ZUNsYXNzKCAndWktZHJvcC1hY3RpdmUnICk7XG59XG5cbi8qKlxuICogSW5pdGlhbGl6ZSBkcmFnZ2FibGUgZm9yIHRoZSBmb3JtIGZpZWxkcy5cbiAqL1xualF1ZXJ5KCAnI2F2YWlsYWJsZS1maWVsZHMgLndpZGdldCcgKS5kcmFnZ2FibGUoXG5cdHtcblx0XHRjb25uZWN0VG9Tb3J0YWJsZTogJyNzZWFyY2gtZm9ybScsXG5cdFx0aGVscGVyOiAnY2xvbmUnLFxuXHRcdHN0YXJ0OiBvbkRyYWdTdGFydCxcblx0XHRzdG9wOiBvbkRyYWdTdG9wLFxuXHR9XG4pO1xuXG4vKipcbiAqIFRvZ2dsZSB0aGUgZm9ybSBmaWVsZC5cbiAqL1xuZnVuY3Rpb24gdG9nZ2xlRmllbGQoIGUgKSB7XG5cdGNvbnN0IHRhcmdldCAgICAgICA9IGUudGFyZ2V0O1xuXHRjb25zdCB3aWRnZXQgICAgICAgPSBqUXVlcnkoIHRoaXMgKS5jbG9zZXN0KCAnLndpZGdldCcgKTtcblx0Y29uc3QgdG9nZ2xlQnRuICAgID0gd2lkZ2V0LmZpbmQoICcud2lkZ2V0LWFjdGlvbicgKTtcblx0Y29uc3QgaW5zaWRlICAgICAgID0gd2lkZ2V0LmNoaWxkcmVuKCAnLndpZGdldC1pbnNpZGUnICk7XG5cdGNvbnN0IGlzRXhwYW5kICAgICA9IHRvZ2dsZUJ0bi5hdHRyKCAnYXJpYS1leHBhbmRlZCcgKTtcblx0Y29uc3QgdG9nZ2xlRXhwYW5kID0gJ3RydWUnID09PSBpc0V4cGFuZCA/ICdmYWxzZScgOiAndHJ1ZSc7XG5cblx0dG9nZ2xlQnRuLmF0dHIoICdhcmlhLWV4cGFuZGVkJywgdG9nZ2xlRXhwYW5kICk7XG5cdGpRdWVyeSggaW5zaWRlICkuc2xpZGVUb2dnbGUoXG5cdFx0J2Zhc3QnLFxuXHRcdGZ1bmN0aW9uKCkge1xuXHRcdFx0d2lkZ2V0LnRvZ2dsZUNsYXNzKCAnb3BlbicgKTtcblx0XHRcdHNlYXJjaEZvcm0udHJpZ2dlciggJ3dpZGdldC1jbG9zZWQnLCBbIHRhcmdldCBdICk7XG5cdFx0fVxuXHQpO1xufVxuXG5zZWFyY2hGb3JtLm9uKCAnY2xpY2snLCAnLndpZGdldC10b3AnLCB0b2dnbGVGaWVsZCApO1xuc2VhcmNoRm9ybS5vbiggJ2NsaWNrJywgJy53aWRnZXQtY29udHJvbC1jbG9zZScsIHRvZ2dsZUZpZWxkICk7XG5cbi8qKlxuICogRm9jdXMgdGhlIGZvcm0gZmllbGQncyBleHBhbmQgYnV0dG9uLlxuICovXG5mdW5jdGlvbiBmb2N1c0ZpZWxkKCBlLCB0YXJnZXQgKSB7XG5cdGlmICggdGFyZ2V0LmNsYXNzTGlzdC5jb250YWlucyggJ3dpZGdldC1jb250cm9sLWNsb3NlJyApICkge1xuXHRcdGNvbnN0IHdpZGdldCA9IGpRdWVyeSggdGFyZ2V0ICkuY2xvc2VzdCggJy53aWRnZXQnICk7XG5cdFx0Y29uc3QgYWN0aW9uID0gd2lkZ2V0LmZpbmQoICcud2lkZ2V0LWFjdGlvbicgKTtcblxuXHRcdGFjdGlvbi5hdHRyKCAnYXJpYS1leHBhbmRlZCcsICdmYWxzZScgKS5mb2N1cygpO1xuXHR9XG59XG5cbnNlYXJjaEZvcm0ub24oICd3aWRnZXQtY2xvc2VkJywgZm9jdXNGaWVsZCApO1xuXG4vKipcbiAqIFJlbW92ZSB0aGUgZmllbGQuXG4gKi9cbmZ1bmN0aW9uIHJlbW92ZUZpZWxkKCkge1xuXHRjb25zdCB3aWRnZXQgPSBqUXVlcnkoIHRoaXMgKS5jbG9zZXN0KCAnLndpZGdldCcgKTtcblxuXHRqUXVlcnkoIHdpZGdldCApLnNsaWRlVXAoXG5cdFx0J2Zhc3QnLFxuXHRcdGZ1bmN0aW9uKCkge1xuXHRcdFx0d2lkZ2V0LnJlbW92ZSgpO1xuXHRcdFx0dXBkYXRlRmllbGRzUG9zaXRpb24oKTtcblx0XHR9XG5cdCk7XG59XG5cbnNlYXJjaEZvcm0ub24oICdjbGljaycsICcud2lkZ2V0LWNvbnRyb2wtcmVtb3ZlJywgcmVtb3ZlRmllbGQgKTtcblxuLyoqXG4gKiBTdG9yZSB0aGUgaW5pdGlhbCBmb3JtIGRhdGEgaW50byBhIHZhcmlhYmxlIHNvIHRoYXQgd2UgY2FuIGNvbXBhcmUgaXQgd2hlbiBsZWF2aW5nIHRoZSBwYWdlLlxuICovXG5sZXQgaW5pdGlhbEZvcm1TdGF0ZSA9IHNlYXJjaEZvcm0uc2VyaWFsaXplQXJyYXkoKTtcblxuLyoqXG4gKiBTaG93IG1lc3NhZ2UgYWZ0ZXIgZm9ybSBzdWJtaXNzaW9uLlxuICovXG5mdW5jdGlvbiBzaG93TWVzc2FnZSggbWVzc2FnZSwgdHlwZSA9ICdzdWNjZXNzJyApIHtcblx0Y29uc3QgZWxlbWVudCA9IGpRdWVyeSggJzxwIGNsYXNzPVwiJyArIHR5cGUgKyAnXCI+JyArIG1lc3NhZ2UgKyAnPC9wPicgKTtcblx0Y29uc3Qgd3JhcHBlciA9IGpRdWVyeSggJy53Y2FwZi1tZXNzYWdlLXdyYXBwZXInICk7XG5cblx0aWYgKCAhIHdyYXBwZXIuaXMoICc6ZW1wdHknICkgKSB7XG5cdFx0cmV0dXJuO1xuXHR9XG5cblx0alF1ZXJ5KCB3cmFwcGVyICkuaHRtbCggZWxlbWVudCApLnNsaWRlRG93biggJ2Zhc3QnICk7XG5cblx0c2V0VGltZW91dChcblx0XHRmdW5jdGlvbigpIHtcblx0XHRcdGpRdWVyeSggd3JhcHBlciApLnNsaWRlVXAoICdmYXN0JyApO1xuXHRcdFx0d3JhcHBlci5odG1sKCAnJyApO1xuXHRcdH0sXG5cdFx0MzAwMFxuXHQpO1xufVxuXG4vKipcbiAqIFNhdmUgdGhlIHNlYXJjaCBmb3JtLlxuICovXG5mdW5jdGlvbiBzYXZlRm9ybSgpIHtcblx0Y29uc3QgYnV0dG9uICAgPSBqUXVlcnkoIHRoaXMgKTtcblx0Y29uc3QgZm9ybURhdGEgPSBzZWFyY2hGb3JtLnNlcmlhbGl6ZUFycmF5KCk7XG5cblx0YnV0dG9uLmF0dHIoICdkaXNhYmxlZCcsICdkaXNhYmxlZCcgKTtcblxuXHRmdW5jdGlvbiBva0NhbGxiYWNrKCBtZXNzYWdlICkge1xuXHRcdGJ1dHRvbi5yZW1vdmVBdHRyKCAnZGlzYWJsZWQnICk7XG5cblx0XHQvLyBVcGRhdGUgdGhlIGluaXRpYWwgZm9ybSBkYXRhIGFmdGVyIHN1Y2Nlc3NmdWxseSBzYXZpbmcgdGhlIGZvcm0uXG5cdFx0aW5pdGlhbEZvcm1TdGF0ZSA9IGZvcm1EYXRhO1xuXG5cdFx0c2hvd01lc3NhZ2UoIG1lc3NhZ2UgKTtcblx0fVxuXG5cdGZ1bmN0aW9uIGVyckNhbGxiYWNrKCBtZXNzYWdlICkge1xuXHRcdGJ1dHRvbi5yZW1vdmVBdHRyKCAnZGlzYWJsZWQnICk7XG5cdFx0c2hvd01lc3NhZ2UoIG1lc3NhZ2UsICdlcnJvcicgKTtcblx0fVxuXG5cdC8vIGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vYS81OTE4MTI1MlxuXHR3cC5hamF4LnBvc3QoIGZvcm1EYXRhICkuZG9uZSggb2tDYWxsYmFjayApLmZhaWwoIGVyckNhbGxiYWNrICk7XG59XG5cbmpRdWVyeSggJyNwb3N0Ym94LWNvbnRhaW5lci0xJyApLm9uKCAnY2xpY2snLCAnYnV0dG9uJywgc2F2ZUZvcm0gKTtcblxuLyoqXG4gKiBTaG93IGFsZXJ0IG9uIGxlYXZlIGlmIHRoZSBmb3JtIGlzIGRpcnR5LlxuICpcbiAqIFRPRE86IFVuY29tbWVudCB0aGlzLlxuICovXG4vLyB3aW5kb3cub25iZWZvcmV1bmxvYWQgPSBmdW5jdGlvbigpIHtcbi8vIFx0Y29uc3QgbmV3Rm9ybVN0YXRlID0gc2VhcmNoRm9ybS5zZXJpYWxpemVBcnJheSgpO1xuLy9cbi8vIFx0Y29uc3QgaXNGb3JtRGlydHkgPSAhIF8uaXNFcXVhbCggbmV3Rm9ybVN0YXRlLCBpbml0aWFsRm9ybVN0YXRlICk7XG4vL1xuLy8gXHRpZiAoIGlzRm9ybURpcnR5ICkge1xuLy8gXHRcdHJldHVybiAnJztcbi8vIFx0fVxuLy8gfTtcbiIsIi8qKlxuICogVGhlIHRvZ2dsZSB2aXNpYmlsaXR5IHNjcmlwdHMuXG4gKlxuICogTk9URTogVGhlc2Ugc2NyaXB0cyBtdXN0IGJlIGxvY2F0ZWQgYXQgdGhlIHZlcnkgYm90dG9tIG9mIHRoZSBjb21iaW5lZCBzY3JpcHRzLlxuICpcbiAqIEBzaW5jZSAgICAgIDMuMC4wXG4gKiBAcGFja2FnZSAgICB3Yy1hamF4LXByb2R1Y3QtZmlsdGVyXG4gKiBAc3VicGFja2FnZSB3Yy1hamF4LXByb2R1Y3QtZmlsdGVyL2FkbWluL3NyYy9qc1xuICogQGF1dGhvciAgICAgTWFpbnVsIEhhc3NhbiBNYWluXG4gKi9cblxualF1ZXJ5KCBkb2N1bWVudCApLnJlYWR5KCBmdW5jdGlvbiggJCApIHtcblxuXHRjb25zdCAkc2VhcmNoRm9ybSA9ICQoICcjc2VhcmNoLWZvcm0nICk7XG5cblx0Y29uc3QgZGVwZW5kYW50RGF0YSA9IFtcblx0XHR7XG5cdFx0XHQnaGFuZGxlcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtdmFsdWVfdHlwZSBzZWxlY3QnLFxuXHRcdFx0J2hhbmRsZXJUeXBlJzogJ3NlbGVjdCcsXG5cdFx0XHQnZXZlbnQnOiAnY2hhbmdlJyxcblx0XHRcdCdkZXBlbmRhbnQnOiBbXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLmlucHV0LXR5cGUtdGV4dC1maWVsZHMnLFxuXHRcdFx0XHRcdCd2YWx1ZSc6IFsgJ3RleHQnIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLmlucHV0LXR5cGUtbnVtYmVyLWZpZWxkcycsXG5cdFx0XHRcdFx0J3ZhbHVlJzogWyAnbnVtYmVyJyBdLFxuXHRcdFx0XHR9LFxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0J3NlbGVjdG9yJzogJy5pbnB1dC10eXBlLWRhdGUtZmllbGRzJyxcblx0XHRcdFx0XHQndmFsdWUnOiBbICdkYXRlJyBdLFxuXHRcdFx0XHR9LFxuXHRcdFx0XSxcblx0XHR9LFxuXHRcdHtcblx0XHRcdCdoYW5kbGVyJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1kaXNwbGF5X3R5cGUgc2VsZWN0Jyxcblx0XHRcdCdoYW5kbGVyVHlwZSc6ICdzZWxlY3QnLFxuXHRcdFx0J2V2ZW50JzogJ2NoYW5nZScsXG5cdFx0XHQnZGVwZW5kYW50JzogW1xuXHRcdFx0XHR7XG5cdFx0XHRcdFx0J3NlbGVjdG9yJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1xdWVyeV90eXBlJyxcblx0XHRcdFx0XHQndmFsdWUnOiBbICdjaGVja2JveCcsICdtdWx0aS1zZWxlY3QnIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLWFsbF9pdGVtc19sYWJlbCcsXG5cdFx0XHRcdFx0J3ZhbHVlJzogWyAncmFkaW8nLCAnc2VsZWN0JyBdLFxuXHRcdFx0XHR9LFxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0J3NlbGVjdG9yJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC11c2VfY2hvc2VuJyxcblx0XHRcdFx0XHQndmFsdWUnOiBbICdzZWxlY3QnLCAnbXVsdGktc2VsZWN0JyBdLFxuXHRcdFx0XHR9LFxuXHRcdFx0XSxcblx0XHR9LFxuXHRcdHtcblx0XHRcdCdoYW5kbGVyJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC11c2VfY2hvc2VuIGlucHV0Jyxcblx0XHRcdCdoYW5kbGVyVHlwZSc6ICdjaGVja2JveCcsXG5cdFx0XHQnZXZlbnQnOiAnY2hhbmdlJyxcblx0XHRcdCdkZXBlbmRhbnQnOiBbXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLWNob3Nlbl9ub19yZXN1bHRzX21lc3NhZ2UnLFxuXHRcdFx0XHRcdCd2YWx1ZSc6IFsgJzEnIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRdLFxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0J2hhbmRsZXInOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLWdldF9vcHRpb25zIGlucHV0Jyxcblx0XHRcdCdoYW5kbGVyVHlwZSc6ICdyYWRpbycsXG5cdFx0XHQnZXZlbnQnOiAnY2hhbmdlJyxcblx0XHRcdCdkZXBlbmRhbnQnOiBbXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLmNvbHVtbi1ncm91cC1tZXRhX2tleV9tYW51YWxfb3B0aW9ucycsXG5cdFx0XHRcdFx0J3ZhbHVlJzogWyAnbWFudWFsX2VudHJ5JyBdLFxuXHRcdFx0XHR9LFxuXHRcdFx0XSxcblx0XHR9LFxuXHRcdHtcblx0XHRcdCdoYW5kbGVyJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1udW1iZXJfZGlzcGxheV90eXBlIHNlbGVjdCcsXG5cdFx0XHQnaGFuZGxlclR5cGUnOiAnc2VsZWN0Jyxcblx0XHRcdCdldmVudCc6ICdjaGFuZ2UnLFxuXHRcdFx0J2RlcGVuZGFudCc6IFtcblx0XHRcdFx0e1xuXHRcdFx0XHRcdCdzZWxlY3Rvcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtbnVtYmVyX3JhbmdlX3NsaWRlcl9kaXNwbGF5X3ZhbHVlc19hcycsXG5cdFx0XHRcdFx0J3ZhbHVlJzogWyAncmFuZ2Vfc2xpZGVyJyBdLFxuXHRcdFx0XHR9LFxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0J3NlbGVjdG9yJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1udW1iZXJfcmFuZ2VfcXVlcnlfdHlwZScsXG5cdFx0XHRcdFx0J3ZhbHVlJzogWyAncmFuZ2VfY2hlY2tib3gnLCAncmFuZ2VfbXVsdGlzZWxlY3QnIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLW51bWJlcl9yYW5nZV9zZWxlY3RfYWxsX2l0ZW1zX2xhYmVsJyxcblx0XHRcdFx0XHQndmFsdWUnOiBbICdyYW5nZV9yYWRpbycsICdyYW5nZV9zZWxlY3QnIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLW51bWJlcl9yYW5nZV91c2VfY2hvc2VuJyxcblx0XHRcdFx0XHQndmFsdWUnOiBbICdyYW5nZV9zZWxlY3QnLCAncmFuZ2VfbXVsdGlzZWxlY3QnIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLW51bWJlcl9yYW5nZV9zaG93X2NvdW50Jyxcblx0XHRcdFx0XHQndmFsdWUnOiBbICdyYW5nZV9jaGVja2JveCcsICdyYW5nZV9yYWRpbycsICdyYW5nZV9zZWxlY3QnLCAncmFuZ2VfbXVsdGlzZWxlY3QnIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLW51bWJlcl9yYW5nZV9oaWRlX2VtcHR5Jyxcblx0XHRcdFx0XHQndmFsdWUnOiBbICdyYW5nZV9jaGVja2JveCcsICdyYW5nZV9yYWRpbycsICdyYW5nZV9zZWxlY3QnLCAncmFuZ2VfbXVsdGlzZWxlY3QnIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLm51bWJlci1kZWNpbWFsLWZpZWxkcycsXG5cdFx0XHRcdFx0J3ZhbHVlJzogWyAncmFuZ2Vfc2xpZGVyJywgJ3JhbmdlX2NoZWNrYm94JywgJ3JhbmdlX3JhZGlvJywgJ3JhbmdlX3NlbGVjdCcsICdyYW5nZV9tdWx0aXNlbGVjdCcgXSxcblx0XHRcdFx0fSxcblx0XHRcdF0sXG5cdFx0fSxcblx0XHR7XG5cdFx0XHQnaGFuZGxlcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtbnVtYmVyX3JhbmdlX3VzZV9jaG9zZW4gaW5wdXQnLFxuXHRcdFx0J2hhbmRsZXJUeXBlJzogJ2NoZWNrYm94Jyxcblx0XHRcdCdldmVudCc6ICdjaGFuZ2UnLFxuXHRcdFx0J2RlcGVuZGFudCc6IFtcblx0XHRcdFx0e1xuXHRcdFx0XHRcdCdzZWxlY3Rvcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtbnVtYmVyX3JhbmdlX2Nob3Nlbl9ub19yZXN1bHRzX21lc3NhZ2UnLFxuXHRcdFx0XHRcdCd2YWx1ZSc6IFsgJzEnIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRdLFxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0J2hhbmRsZXInOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLW51bWJlcl9nZXRfb3B0aW9ucyBpbnB1dCcsXG5cdFx0XHQnaGFuZGxlclR5cGUnOiAncmFkaW8nLFxuXHRcdFx0J2V2ZW50JzogJ2NoYW5nZScsXG5cdFx0XHQnZGVwZW5kYW50JzogW1xuXHRcdFx0XHR7XG5cdFx0XHRcdFx0J3NlbGVjdG9yJzogJy5udW1iZXItYXV0b21hdGljLW9wdGlvbnMnLFxuXHRcdFx0XHRcdCd2YWx1ZSc6IFsgJ2F1dG9tYXRpY2FsbHknIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLm51bWJlci1tYW51YWwtb3B0aW9ucy10YWJsZScsXG5cdFx0XHRcdFx0J3ZhbHVlJzogWyAnbWFudWFsX2VudHJ5JyBdLFxuXHRcdFx0XHR9LFxuXHRcdFx0XSxcblx0XHR9LFxuXHRcdHtcblx0XHRcdCdoYW5kbGVyJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1kYXRlX2Rpc3BsYXlfdHlwZSBzZWxlY3QnLFxuXHRcdFx0J2hhbmRsZXJUeXBlJzogJ3NlbGVjdCcsXG5cdFx0XHQnZXZlbnQnOiAnY2hhbmdlJyxcblx0XHRcdCdkZXBlbmRhbnQnOiBbXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLmRhdGUtdG8tdWktb3B0aW9ucycsXG5cdFx0XHRcdFx0J3ZhbHVlJzogWyAnaW5wdXRfZGF0ZV9yYW5nZScgXSxcblx0XHRcdFx0fSxcblx0XHRcdFx0e1xuXHRcdFx0XHRcdCdzZWxlY3Rvcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtZGF0ZV9mb3JtYXQnLFxuXHRcdFx0XHRcdCd2YWx1ZSc6IFsgJ2lucHV0X2RhdGUnLCAnaW5wdXRfZGF0ZV9yYW5nZScgXSxcblx0XHRcdFx0fSxcblx0XHRcdF0sXG5cdFx0fSxcblx0XHR7XG5cdFx0XHQnaGFuZGxlcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtbGltaXRfdGVybXMgc2VsZWN0Jyxcblx0XHRcdCdoYW5kbGVyVHlwZSc6ICdzZWxlY3QnLFxuXHRcdFx0J2V2ZW50JzogJ2NoYW5nZScsXG5cdFx0XHQnZGVwZW5kYW50JzogW1xuXHRcdFx0XHR7XG5cdFx0XHRcdFx0J3NlbGVjdG9yJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1wYXJlbnRfdGVybScsXG5cdFx0XHRcdFx0J3ZhbHVlJzogWyAnY2hpbGQnIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLWxpbWl0X3Rlcm1zX2J5X2lkJyxcblx0XHRcdFx0XHQndmFsdWUnOiBbICdpbmNsdWRlJywgJ2V4Y2x1ZGUnIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRdLFxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0J2hhbmRsZXInOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLWVuYWJsZV9zb2Z0X2xpbWl0IGlucHV0Jyxcblx0XHRcdCdoYW5kbGVyVHlwZSc6ICdyYWRpbycsXG5cdFx0XHQnZXZlbnQnOiAnY2hhbmdlJyxcblx0XHRcdCdkZXBlbmRhbnQnOiBbXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLXNvZnRfbGltaXQnLFxuXHRcdFx0XHRcdCd2YWx1ZSc6IFsgJ2VuYWJsZScgXSxcblx0XHRcdFx0fSxcblx0XHRcdF0sXG5cdFx0fSxcblx0XHR7XG5cdFx0XHQnaGFuZGxlcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtY3VzdG9tLXRheG9ub215IHNlbGVjdCcsXG5cdFx0XHQnaGFuZGxlclR5cGUnOiAnc2VsZWN0Jyxcblx0XHRcdCdldmVudCc6ICdjaGFuZ2UnLFxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0J2hhbmRsZXInOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLXBvc3RfcHJvcGVydHkgc2VsZWN0Jyxcblx0XHRcdCdoYW5kbGVyVHlwZSc6ICdzZWxlY3QnLFxuXHRcdFx0J2V2ZW50JzogJ2NoYW5nZScsXG5cdFx0fSxcblx0XHR7XG5cdFx0XHQnaGFuZGxlcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtcmF0aW5nX2dldF9vcHRpb25zIGlucHV0Jyxcblx0XHRcdCdoYW5kbGVyVHlwZSc6ICdyYWRpbycsXG5cdFx0XHQnZXZlbnQnOiAnY2hhbmdlJyxcblx0XHRcdCdkZXBlbmRhbnQnOiBbXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLnJhdGluZy1tYW51YWwtb3B0aW9ucycsXG5cdFx0XHRcdFx0J3ZhbHVlJzogWyAnbWFudWFsX2VudHJ5JyBdLFxuXHRcdFx0XHR9LFxuXHRcdFx0XSxcblx0XHR9LFxuXHRcdHtcblx0XHRcdCdoYW5kbGVyJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1saW1pdF9vcHRpb25zIHNlbGVjdCcsXG5cdFx0XHQnaGFuZGxlclR5cGUnOiAnc2VsZWN0Jyxcblx0XHRcdCdldmVudCc6ICdjaGFuZ2UnLFxuXHRcdFx0J2RlcGVuZGFudCc6IFtcblx0XHRcdFx0e1xuXHRcdFx0XHRcdCdzZWxlY3Rvcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtbGltaXRfdmFsdWVzX2J5X2lkJyxcblx0XHRcdFx0XHQndmFsdWUnOiBbICdpbmNsdWRlJywgJ2V4Y2x1ZGUnIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRdLFxuXHRcdH0sXG5cdF07XG5cblx0ZnVuY3Rpb24gX2hhbmRsZVRvZ2dsZVJlcXVlc3QoIGRhdGEsIGN1cnJlbnRTZWxlY3RvciwgdmFsdWUgKSB7XG5cdFx0Y29uc3QgJGZpZWxkICAgICAgPSBjdXJyZW50U2VsZWN0b3IuY2xvc2VzdCggJy53Y2FwZi1mb3JtLWZpZWxkJyApO1xuXHRcdGNvbnN0IGhhbmRsZXIgICAgID0gZGF0YVsgJ2hhbmRsZXInIF07XG5cdFx0Y29uc3QgaGFuZGxlclR5cGUgPSBkYXRhWyAnaGFuZGxlclR5cGUnIF07XG5cdFx0Y29uc3QgZGVwZW5kYW50ICAgPSBkYXRhWyAnZGVwZW5kYW50JyBdO1xuXG5cdFx0bGV0IF92YWx1ZSA9IHZhbHVlO1xuXG5cdFx0aWYgKCAnY2hlY2tib3gnID09PSBoYW5kbGVyVHlwZSApIHtcblx0XHRcdF92YWx1ZSA9IGN1cnJlbnRTZWxlY3Rvci5pcyggJzpjaGVja2VkJyApID8gJzEnIDogJzAnO1xuXHRcdH1cblxuXHRcdGlmICggJ3JhZGlvJyA9PT0gaGFuZGxlclR5cGUgKSB7XG5cdFx0XHRfdmFsdWUgPSAkZmllbGQuZmluZCggaGFuZGxlciArICc6Y2hlY2tlZCcgKS52YWwoKTtcblx0XHR9XG5cblx0XHQkLmVhY2goIGRlcGVuZGFudCwgZnVuY3Rpb24oIGlkLCBkICkge1xuXHRcdFx0Y29uc3QgJHNlbGVjdG9yICAgPSAkZmllbGQuZmluZCggZFsgJ3NlbGVjdG9yJyBdICk7XG5cdFx0XHRjb25zdCB2YWxpZFZhbHVlcyA9IGRbICd2YWx1ZScgXTtcblxuXHRcdFx0aWYgKCB2YWxpZFZhbHVlcy5pbmNsdWRlcyggX3ZhbHVlICkgKSB7XG5cdFx0XHRcdCRzZWxlY3Rvci5zaG93KCk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHQkc2VsZWN0b3IuaGlkZSgpO1xuXHRcdFx0fVxuXHRcdH0gKTtcblxuXHRcdCRzZWFyY2hGb3JtLnRyaWdnZXIoICdhZnRlcl90b2dnbGVfcmVxdWVzdCcsIFsgaGFuZGxlciwgX3ZhbHVlLCAkZmllbGQgXSApO1xuXHR9XG5cblx0ZnVuY3Rpb24gaGFuZGxlVG9nZ2xlUmVxdWVzdCggZGF0YSwgY3VycmVudFNlbGVjdG9yLCB2YWx1ZSApIHtcblx0XHRpZiAoIG51bGwgPT09IGN1cnJlbnRTZWxlY3RvciApIHtcblx0XHRcdGNvbnN0IGhhbmRsZXIgID0gZGF0YVsgJ2hhbmRsZXInIF07XG5cdFx0XHRjb25zdCAkaGFuZGxlciA9ICQoIGhhbmRsZXIgKTtcblxuXHRcdFx0JC5lYWNoKCAkaGFuZGxlciwgZnVuY3Rpb24oKSB7XG5cdFx0XHRcdGNvbnN0IF90aGlzICA9ICQoIHRoaXMgKTtcblx0XHRcdFx0Y29uc3QgX3ZhbHVlID0gX3RoaXMudmFsKCk7XG5cdFx0XHRcdF9oYW5kbGVUb2dnbGVSZXF1ZXN0KCBkYXRhLCBfdGhpcywgX3ZhbHVlICk7XG5cdFx0XHR9ICk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdF9oYW5kbGVUb2dnbGVSZXF1ZXN0KCBkYXRhLCBjdXJyZW50U2VsZWN0b3IsIHZhbHVlICk7XG5cdFx0fVxuXHR9XG5cblx0ZnVuY3Rpb24gc2V0dXBTZWFyY2hGb3JtKCBpbml0YWwgPSBmYWxzZSApIHtcblx0XHQkLmVhY2goIGRlcGVuZGFudERhdGEsIGZ1bmN0aW9uKCBpLCBkYXRhICkge1xuXHRcdFx0Y29uc3QgaGFuZGxlciA9IGRhdGFbICdoYW5kbGVyJyBdO1xuXHRcdFx0Y29uc3QgZXZlbnQgICA9IGRhdGFbICdldmVudCcgXTtcblxuXHRcdFx0aGFuZGxlVG9nZ2xlUmVxdWVzdCggZGF0YSwgbnVsbCwgbnVsbCApO1xuXG5cdFx0XHRpZiAoIGluaXRhbCApIHtcblx0XHRcdFx0JHNlYXJjaEZvcm0ub24oIGV2ZW50LCBoYW5kbGVyLCBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHRjb25zdCBfdGhpcyAgPSAkKCB0aGlzICk7XG5cdFx0XHRcdFx0Y29uc3QgX3ZhbHVlID0gJCggdGhpcyApLnZhbCgpO1xuXHRcdFx0XHRcdGhhbmRsZVRvZ2dsZVJlcXVlc3QoIGRhdGEsIF90aGlzLCBfdmFsdWUgKTtcblx0XHRcdFx0fSApO1xuXHRcdFx0fVxuXHRcdH0gKTtcblx0fVxuXG5cdHNldHVwU2VhcmNoRm9ybSggdHJ1ZSApO1xuXG5cdCRzZWFyY2hGb3JtLm9uKCAnZmllbGRfYWRkZWQnLCBmdW5jdGlvbigpIHtcblx0XHQvLyBUb2dnbGUgdGhlIHZpc2liaWxpdHkgb2Ygc3ViZmllbGRzLlxuXHRcdHNldHVwU2VhcmNoRm9ybSgpO1xuXHR9ICk7XG5cbn0gKTtcbiJdfQ==
