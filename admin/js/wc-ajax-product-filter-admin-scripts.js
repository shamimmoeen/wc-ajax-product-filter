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


  initSortableForManualOptions($searchForm.find('.manual-options-table-body-rows'));
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
    $field.find('.manual-options-table-body-rows').empty();
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
    var $rows = $postMetaField.find('.manual-options-table-body-rows');
    var $valueHolder = $postMetaField.find('.wcapf-form-sub-field-manual_options input');
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
      var $rows = $postMetaField.find('.manual-options-table-body-rows');

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
  $searchForm.on('input', '.manual-options-table-body-rows input[type="text"]', function () {
    var $field = $(this).closest('.wcapf-form-field');
    triggerManualOptionsChange($field);
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
  }];

  function _triggerDisplayTypeChange(value, $field) {
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

  function _triggerUseSelectChange(value, $field) {
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
      _triggerDisplayTypeChange(_value, $field);
    }

    if ('.wcapf-form-sub-field-use_chosen input' === handler) {
      _triggerUseSelectChange(_value, $field);
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInBvc3QtbWV0YS1vcHRpb25zLmpzIiwic2VhcmNoLWZvcm0tZmllbGQuanMiLCJzZWFyY2gtZm9ybS5qcyJdLCJuYW1lcyI6WyJqUXVlcnkiLCJkb2N1bWVudCIsInJlYWR5IiwiJCIsIiRzZWFyY2hGb3JtIiwiaW5pdFNvcnRhYmxlRm9yTWFudWFsT3B0aW9ucyIsIiRzZWxlY3RvciIsInNvcnRhYmxlIiwib3BhY2l0eSIsInJldmVydCIsImN1cnNvciIsImF4aXMiLCJoYW5kbGUiLCJwbGFjZWhvbGRlciIsInVwZGF0ZSIsImUiLCIkZmllbGQiLCJ0YXJnZXQiLCJjbG9zZXN0IiwidHJpZ2dlck1hbnVhbE9wdGlvbnNDaGFuZ2UiLCJkaXNhYmxlU2VsZWN0aW9uIiwiZmluZCIsIm9uIiwidWkiLCJpdGVtIiwidHJpZ2dlclJlbW92ZU9wdGlvbiIsIiRvcHRpb25zVGFibGUiLCJ0YWJsZVJvd3MiLCJjaGlsZHJlbiIsImxlbmd0aCIsInJlbW92ZUNsYXNzIiwiJGl0ZW0iLCJyZW1vdmUiLCJlbXB0eSIsImZpZWxkVHlwZSIsInRlbXBsYXRlIiwid3AiLCJyZW5kZXJlZCIsInZhbHVlIiwibGFiZWwiLCIkd3JhcHBlciIsIiRyb3dzIiwiYXBwZW5kIiwiaGFzQ2xhc3MiLCJhZGRDbGFzcyIsIiRwb3N0TWV0YU9wdGlvbnNNb2RhbCIsIiRub0tleUZvdW5kTWVzc2FnZSIsIiRwb3N0TWV0YU1vZGFsTG9hZGVyIiwiJHBvc3RNZXRhT3B0aW9ucyIsIiRwb3N0TWV0YU1vZGFsRm9vdGVyIiwicG9zdE1ldGFPcHRpb25zTW9kYWxJbnN0YW5jZSIsInJlbW9kYWwiLCJoYXNoVHJhY2tpbmciLCIkcG9zdE1ldGFGaWVsZCIsInJlc2V0UG9zdE1ldGFNb2RhbCIsImh0bWwiLCJwcm9wIiwiJGlucHV0TWV0YUtleSIsIm1ldGFLZXkiLCJ2YWwiLCJvcGVuIiwib2tDYWxsYmFjayIsInJlc3BvbnNlIiwiZXJyQ2FsbGJhY2siLCJtZXNzYWdlIiwiY29uc29sZSIsImxvZyIsImZvcm1EYXRhIiwia2V5IiwiYWN0aW9uIiwiYWpheCIsInBvc3QiLCJkb25lIiwiZmFpbCIsIiR2YWx1ZUhvbGRlciIsIl9yb3dzIiwiZWFjaCIsImkiLCJfaXRlbSIsInB1c2giLCJyYXdWYWx1ZXMiLCJlbmNvZGVVUklDb21wb25lbnQiLCJKU09OIiwic3RyaW5naWZ5IiwiJG9wdGlvbnMiLCJpc1JlcGxhY2UiLCJyb3dzIiwiaXMiLCJpbnB1dCIsIiRpbnB1dCIsImNsb3NlIiwiaGFuZGxlciIsIiRzZWxlY3RFbG0iLCJvcmRlckJ5IiwiZGVwZW5kYW50T3B0aW9ucyIsImF0dHIiLCJjaGFuZ2UiLCJyZW1vdmVBdHRyIiwiZGVwZW5kYW50RGF0YSIsIl90cmlnZ2VyRGlzcGxheVR5cGVDaGFuZ2UiLCIkbm9SZXN1bHRzIiwiJGFsbEl0ZW1zTGFiZWwiLCJ1c2VDaG9zZW4iLCJzaG93IiwiaGlkZSIsIl90cmlnZ2VyVXNlU2VsZWN0Q2hhbmdlIiwiZGlzcGxheVR5cGUiLCJfaGFuZGxlVG9nZ2xlUmVxdWVzdCIsImRhdGEiLCJjdXJyZW50U2VsZWN0b3IiLCJoYW5kbGVyVHlwZSIsImRlcGVuZGFudCIsIl92YWx1ZSIsImlkIiwiZCIsInZhbGlkVmFsdWVzIiwiaW5jbHVkZXMiLCJ0cmlnZ2VyIiwiaGFuZGxlVG9nZ2xlUmVxdWVzdCIsIiRoYW5kbGVyIiwiX3RoaXMiLCJzZXR1cFNlYXJjaEZvcm0iLCJpbml0YWwiLCJldmVudCIsInRvdGFsRmllbGRJbnN0YW5jZXMiLCJzZWFyY2hGb3JtIiwicmVtb3ZlUGxhY2Vob2xkZXIiLCJ1bmlxdWVJZCIsImVsZW1lbnRzIiwiZWxlbWVudCIsIm9sZFZhbHVlIiwibmV3VmFsdWUiLCJyZXBsYWNlIiwiaW5zZXJ0RmllbGRTdWJGaWVsZHMiLCJ0eXBlIiwicGFyc2VJbnQiLCJ3cmFwcGVyIiwicHJlcGVuZCIsInVwZGF0ZUZpZWxkc1Bvc2l0aW9uIiwiaW5wdXRzIiwibmJFbGVtcyIsImlkeCIsIm1ha2VGaWVsZFJlYWR5IiwidG9nZ2xlQnRuIiwiaWRlbnRpZmllciIsImNvbnRhaW5lciIsImNhbmNlbCIsIml0ZW1zIiwiY29ubmVjdFdpdGgiLCJzdG9wIiwic3RhcnQiLCJhcHBlbmRUbyIsInBhcmVudCIsIm9uRHJhZ1N0YXJ0Iiwib25EcmFnU3RvcCIsImRyYWdnYWJsZSIsImNvbm5lY3RUb1NvcnRhYmxlIiwiaGVscGVyIiwidG9nZ2xlRmllbGQiLCJ3aWRnZXQiLCJpbnNpZGUiLCJpc0V4cGFuZCIsInRvZ2dsZUV4cGFuZCIsInNsaWRlVG9nZ2xlIiwidG9nZ2xlQ2xhc3MiLCJmb2N1c0ZpZWxkIiwiY2xhc3NMaXN0IiwiY29udGFpbnMiLCJmb2N1cyIsInJlbW92ZUZpZWxkIiwic2xpZGVVcCIsImluaXRpYWxGb3JtU3RhdGUiLCJzZXJpYWxpemVBcnJheSIsInNob3dNZXNzYWdlIiwic2xpZGVEb3duIiwic2V0VGltZW91dCIsInNhdmVGb3JtIiwiYnV0dG9uIl0sIm1hcHBpbmdzIjoiOztBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQUEsTUFBTSxDQUFFQyxRQUFGLENBQU4sQ0FBbUJDLEtBQW5CLENBQTBCLFVBQVVDLENBQVYsRUFBYztBQUV2QyxNQUFNQyxXQUFXLEdBQUdELENBQUMsQ0FBRSxjQUFGLENBQXJCOztBQUVBLFdBQVNFLDRCQUFULENBQXVDQyxTQUF2QyxFQUFtRDtBQUNsREEsSUFBQUEsU0FBUyxDQUFDQyxRQUFWLENBQW9CO0FBQ25CQyxNQUFBQSxPQUFPLEVBQUUsR0FEVTtBQUVuQkMsTUFBQUEsTUFBTSxFQUFFLEtBRlc7QUFHbkJDLE1BQUFBLE1BQU0sRUFBRSxNQUhXO0FBSW5CQyxNQUFBQSxJQUFJLEVBQUUsR0FKYTtBQUtuQkMsTUFBQUEsTUFBTSxFQUFFLHVCQUxXO0FBTW5CQyxNQUFBQSxXQUFXLEVBQUUsb0JBTk07QUFPbkJDLE1BQUFBLE1BQU0sRUFBRSxnQkFBVUMsQ0FBVixFQUFjO0FBQ3JCLFlBQU1DLE1BQU0sR0FBR2IsQ0FBQyxDQUFFWSxDQUFDLENBQUNFLE1BQUos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QUFDQSxHQWxCa0IsQ0FvQm5COzs7QUFDQTVCLEVBQUFBLEVBQUUsQ0FBQ2tDLElBQUgsQ0FBUUMsSUFBUixDQUFjSixRQUFkLEVBQXlCSyxJQUF6QixDQUErQlgsVUFBL0IsRUFBNENZLElBQTVDLENBQWtEVixXQUFsRDtBQUNBOztBQUVEL0QsTUFBTSxDQUFFLHNCQUFGLENBQU4sQ0FBaUNzQixFQUFqQyxDQUFxQyxPQUFyQyxFQUE4QyxRQUE5QyxFQUF3RDBKLFFBQXhEO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJ3Yy1hamF4LXByb2R1Y3QtZmlsdGVyLWFkbWluLXNjcmlwdHMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIFRoZSBwb3N0IG1ldGEgZmllbGQuXG4gKlxuICogQHNpbmNlICAgICAgMS4wLjBcbiAqIEBwYWNrYWdlICAgIHdjLWFqYXgtcHJvZHVjdC1maWx0ZXItcHJvXG4gKiBAc3VicGFja2FnZSB3Yy1hamF4LXByb2R1Y3QtZmlsdGVyLXByby9hZG1pbi9zcmMvanNcbiAqIEBhdXRob3IgICAgIE1haW51bCBIYXNzYW4gTWFpblxuICovXG5cbmpRdWVyeSggZG9jdW1lbnQgKS5yZWFkeSggZnVuY3Rpb24oICQgKSB7XG5cblx0Y29uc3QgJHNlYXJjaEZvcm0gPSAkKCAnI3NlYXJjaC1mb3JtJyApO1xuXG5cdGZ1bmN0aW9uIGluaXRTb3J0YWJsZUZvck1hbnVhbE9wdGlvbnMoICRzZWxlY3RvciApIHtcblx0XHQkc2VsZWN0b3Iuc29ydGFibGUoIHtcblx0XHRcdG9wYWNpdHk6IDAuOCxcblx0XHRcdHJldmVydDogZmFsc2UsXG5cdFx0XHRjdXJzb3I6ICdtb3ZlJyxcblx0XHRcdGF4aXM6ICd5Jyxcblx0XHRcdGhhbmRsZTogJy5tb3ZlLW9wdGlvbnMtaGFuZGxlcicsXG5cdFx0XHRwbGFjZWhvbGRlcjogJ3dpZGdldC1wbGFjZWhvbGRlcicsXG5cdFx0XHR1cGRhdGU6IGZ1bmN0aW9uKCBlICkge1xuXHRcdFx0XHRjb25zdCAkZmllbGQgPSAkKCBlLnRhcmdldCApLmNsb3Nlc3QoICcud2NhcGYtZm9ybS1maWVsZCcgKTtcblxuXHRcdFx0XHR0cmlnZ2VyTWFudWFsT3B0aW9uc0NoYW5nZSggJGZpZWxkICk7XG5cdFx0XHR9XG5cdFx0fSApLmRpc2FibGVTZWxlY3Rpb24oKTtcblx0fVxuXG5cdC8vIFNvcnQgTWFudWFsIE9wdGlvbnNcblx0aW5pdFNvcnRhYmxlRm9yTWFudWFsT3B0aW9ucyggJHNlYXJjaEZvcm0uZmluZCggJy5tYW51YWwtb3B0aW9ucy10YWJsZS1ib2R5LXJvd3MnICkgKTtcblxuXHQkc2VhcmNoRm9ybS5vbiggJ2ZpZWxkX2FkZGVkJywgZnVuY3Rpb24oIGUsIHVpICkge1xuXHRcdC8vIEluaXQgU29ydGFibGUgZm9yIHRoZSBtYW51YWwgb3B0aW9ucy5cblx0XHRpbml0U29ydGFibGVGb3JNYW51YWxPcHRpb25zKCAkKCB1aS5pdGVtLmZpbmQoICcubWFudWFsLW9wdGlvbnMtdGFibGUtYm9keS1yb3dzJyApICkgKTtcblx0fSApO1xuXG5cdGZ1bmN0aW9uIHRyaWdnZXJSZW1vdmVPcHRpb24oICRmaWVsZCApIHtcblx0XHRjb25zdCAkb3B0aW9uc1RhYmxlID0gJGZpZWxkLmZpbmQoICcubWFudWFsLW9wdGlvbnMtdGFibGUnICk7XG5cdFx0Y29uc3QgdGFibGVSb3dzICAgICA9ICRvcHRpb25zVGFibGUuZmluZCggJy5tYW51YWwtb3B0aW9ucy10YWJsZS1ib2R5LXJvd3MnICkuY2hpbGRyZW4oKTtcblxuXHRcdGlmICggMiA+IHRhYmxlUm93cy5sZW5ndGggKSB7XG5cdFx0XHQkb3B0aW9uc1RhYmxlLnJlbW92ZUNsYXNzKCAnaGFzLW9wdGlvbnMnICk7XG5cdFx0fVxuXHR9XG5cblx0Ly8gUmVtb3ZlIFNpbmdsZSBPcHRpb25cblx0JHNlYXJjaEZvcm0ub24oICdjbGljaycsICcucmVtb3ZlLW9wdGlvbicsIGZ1bmN0aW9uKCkge1xuXHRcdGNvbnN0ICRpdGVtICA9ICQoIHRoaXMgKS5jbG9zZXN0KCAnLml0ZW0nICk7XG5cdFx0Y29uc3QgJGZpZWxkID0gJGl0ZW0uY2xvc2VzdCggJy53Y2FwZi1mb3JtLWZpZWxkJyApO1xuXG5cdFx0dHJpZ2dlclJlbW92ZU9wdGlvbiggJGZpZWxkICk7XG5cblx0XHQkaXRlbS5yZW1vdmUoKTtcblxuXHRcdHRyaWdnZXJNYW51YWxPcHRpb25zQ2hhbmdlKCAkZmllbGQgKTtcblx0fSApO1xuXG5cdC8vIENsZWFyIEFsbCBPcHRpb25zXG5cdCRzZWFyY2hGb3JtLm9uKCAnY2xpY2snLCAnLmNsZWFyLWFsbC1vcHRpb25zJywgZnVuY3Rpb24oKSB7XG5cdFx0Y29uc3QgJGZpZWxkID0gJCggdGhpcyApLmNsb3Nlc3QoICcud2NhcGYtZm9ybS1maWVsZCcgKTtcblxuXHRcdCRmaWVsZC5maW5kKCAnLm1hbnVhbC1vcHRpb25zLXRhYmxlLWJvZHktcm93cycgKS5lbXB0eSgpO1xuXG5cdFx0dHJpZ2dlclJlbW92ZU9wdGlvbiggJGZpZWxkICk7XG5cblx0XHR0cmlnZ2VyTWFudWFsT3B0aW9uc0NoYW5nZSggJGZpZWxkICk7XG5cdH0gKTtcblxuXHQvLyBBZGQgTmV3IE9wdGlvblxuXHQkc2VhcmNoRm9ybS5vbiggJ2NsaWNrJywgJy5hZGQtb3B0aW9uJywgZnVuY3Rpb24oKSB7XG5cdFx0Y29uc3QgZmllbGRUeXBlID0gJ3djYXBmLXBvc3QtbWV0YS1vcHRpb24nO1xuXG5cdFx0Ly8gQmFpbCBvdXQgaWYgbm8gdG1wbCBmb3VuZCBmb3IgdGhlIHR5cGUuXG5cdFx0aWYgKCAhIGpRdWVyeSggJyN0bXBsLScgKyBmaWVsZFR5cGUgKS5sZW5ndGggKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0Y29uc3QgJGZpZWxkID0gJCggdGhpcyApLmNsb3Nlc3QoICcud2NhcGYtZm9ybS1maWVsZCcgKTtcblxuXHRcdGNvbnN0IHRlbXBsYXRlID0gd3AudGVtcGxhdGUoIGZpZWxkVHlwZSApO1xuXHRcdGNvbnN0IHJlbmRlcmVkID0gdGVtcGxhdGUoIHsgdmFsdWU6ICcnLCBsYWJlbDogJycgfSApO1xuXHRcdGNvbnN0ICR3cmFwcGVyID0gJGZpZWxkLmZpbmQoICcubWFudWFsLW9wdGlvbnMtdGFibGUnICk7XG5cdFx0Y29uc3QgJHJvd3MgICAgPSAkd3JhcHBlci5maW5kKCAnLm1hbnVhbC1vcHRpb25zLXRhYmxlLWJvZHktcm93cycgKTtcblxuXHRcdCRyb3dzLmFwcGVuZCggcmVuZGVyZWQgKTtcblxuXHRcdGlmICggISAkd3JhcHBlci5oYXNDbGFzcyggJ2hhcy1vcHRpb25zJyApICkge1xuXHRcdFx0JHdyYXBwZXIuYWRkQ2xhc3MoICdoYXMtb3B0aW9ucycgKTtcblx0XHR9XG5cdH0gKTtcblxuXHRjb25zdCAkcG9zdE1ldGFPcHRpb25zTW9kYWwgPSAkKCAnLnBvc3QtbWV0YS1vcHRpb25zLW1vZGFsJyApO1xuXHRjb25zdCAkbm9LZXlGb3VuZE1lc3NhZ2UgICAgPSAkcG9zdE1ldGFPcHRpb25zTW9kYWwuZmluZCggJy5uby1rZXktZm91bmQtbWVzc2FnZScgKTtcblx0Y29uc3QgJHBvc3RNZXRhTW9kYWxMb2FkZXIgID0gJHBvc3RNZXRhT3B0aW9uc01vZGFsLmZpbmQoICcucG9zdC1tZXRhLW9wdGlvbnMtbG9hZGVyJyApO1xuXHRjb25zdCAkcG9zdE1ldGFPcHRpb25zICAgICAgPSAkcG9zdE1ldGFPcHRpb25zTW9kYWwuZmluZCggJy5wb3N0LW1ldGEtb3B0aW9ucycgKTtcblx0Y29uc3QgJHBvc3RNZXRhTW9kYWxGb290ZXIgID0gJHBvc3RNZXRhT3B0aW9uc01vZGFsLmZpbmQoICcud2NhcGYtbW9kYWwtZm9vdGVyJyApO1xuXG5cdGNvbnN0IHBvc3RNZXRhT3B0aW9uc01vZGFsSW5zdGFuY2UgPSAkcG9zdE1ldGFPcHRpb25zTW9kYWwucmVtb2RhbCgge1xuXHRcdGhhc2hUcmFja2luZzogZmFsc2UsXG5cdH0gKTtcblxuXHRsZXQgJHBvc3RNZXRhRmllbGQgPSBudWxsO1xuXG5cdGZ1bmN0aW9uIHJlc2V0UG9zdE1ldGFNb2RhbCgpIHtcblx0XHQkcG9zdE1ldGFPcHRpb25zLmh0bWwoICcnICk7XG5cdFx0JHBvc3RNZXRhTW9kYWxMb2FkZXIucmVtb3ZlQ2xhc3MoICdhY3RpdmUnICk7XG5cdFx0JG5vS2V5Rm91bmRNZXNzYWdlLnJlbW92ZUNsYXNzKCAnYWN0aXZlJyApO1xuXHRcdCRwb3N0TWV0YU1vZGFsRm9vdGVyLnJlbW92ZUNsYXNzKCAnYWN0aXZlJyApO1xuXHRcdCRwb3N0TWV0YU9wdGlvbnNNb2RhbC5maW5kKCAnLnJlcGxhY2UtY3VycmVudC1vcHRpb25zJyApLnByb3AoICdjaGVja2VkJywgZmFsc2UgKTtcblx0fVxuXG5cdC8vIEJyb3dzZSBWYWx1ZXNcblx0JHNlYXJjaEZvcm0ub24oICdjbGljaycsICcuYnJvd3NlLXZhbHVlcycsIGZ1bmN0aW9uKCkge1xuXHRcdHJlc2V0UG9zdE1ldGFNb2RhbCgpO1xuXG5cdFx0Y29uc3QgJGZpZWxkICAgICAgICA9ICQoIHRoaXMgKS5jbG9zZXN0KCAnLndjYXBmLWZvcm0tZmllbGQnICk7XG5cdFx0Y29uc3QgJGlucHV0TWV0YUtleSA9ICRmaWVsZC5maW5kKCAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLW1ldGFfa2V5IHNlbGVjdCcgKTtcblx0XHRjb25zdCBtZXRhS2V5ICAgICAgID0gJGlucHV0TWV0YUtleS52YWwoKTtcblxuXHRcdGlmICggISBtZXRhS2V5ICkge1xuXHRcdFx0JG5vS2V5Rm91bmRNZXNzYWdlLmFkZENsYXNzKCAnYWN0aXZlJyApO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHQkbm9LZXlGb3VuZE1lc3NhZ2UucmVtb3ZlQ2xhc3MoICdhY3RpdmUnICk7XG5cdFx0fVxuXG5cdFx0cG9zdE1ldGFPcHRpb25zTW9kYWxJbnN0YW5jZS5vcGVuKCk7XG5cdFx0JHBvc3RNZXRhRmllbGQgPSAkZmllbGQ7XG5cblx0XHRpZiAoICEgbWV0YUtleSApIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHQvLyBTaG93IHRoZSBsb2FkaW5nIGFuaW1hdGlvbi5cblx0XHQkcG9zdE1ldGFNb2RhbExvYWRlci5hZGRDbGFzcyggJ2FjdGl2ZScgKTtcblxuXHRcdC8qKlxuXHRcdCAqIEFqYXgncyBzdWNjZXNzIGZ1bmN0aW9uLlxuXHRcdCAqXG5cdFx0ICogQHBhcmFtIHJlc3BvbnNlXG5cdFx0ICovXG5cdFx0ZnVuY3Rpb24gb2tDYWxsYmFjayggcmVzcG9uc2UgKSB7XG5cdFx0XHQvLyBIaWRlIHRoZSBsb2FkaW5nIGFuaW1hdGlvbi5cblx0XHRcdCRwb3N0TWV0YU1vZGFsTG9hZGVyLnJlbW92ZUNsYXNzKCAnYWN0aXZlJyApO1xuXHRcdFx0JHBvc3RNZXRhTW9kYWxGb290ZXIuYWRkQ2xhc3MoICdhY3RpdmUnICk7XG5cblx0XHRcdCRwb3N0TWV0YU9wdGlvbnMuaHRtbCggcmVzcG9uc2UgKTtcblx0XHR9XG5cblx0XHQvKipcblx0XHQgKiBBamF4J3MgZXJyb3IgZnVuY3Rpb24uXG5cdFx0ICpcblx0XHQgKiBAcGFyYW0gbWVzc2FnZVxuXHRcdCAqL1xuXHRcdGZ1bmN0aW9uIGVyckNhbGxiYWNrKCBtZXNzYWdlICkge1xuXHRcdFx0Y29uc29sZS5sb2coICdlcnJvcicsIG1lc3NhZ2UgKTtcblxuXHRcdFx0Ly8gSGlkZSB0aGUgbG9hZGluZyBhbmltYXRpb24uXG5cdFx0XHQkcG9zdE1ldGFNb2RhbExvYWRlci5yZW1vdmVDbGFzcyggJ2FjdGl2ZScgKTtcblx0XHR9XG5cblx0XHRjb25zdCBmb3JtRGF0YSA9IHtcblx0XHRcdGtleTogbWV0YUtleSxcblx0XHRcdGFjdGlvbjogJ3djYXBmX2dldF9tZXRhX29wdGlvbnMnLFxuXHRcdH1cblxuXHRcdC8vIGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vYS81OTE4MTI1MlxuXHRcdHdwLmFqYXgucG9zdCggZm9ybURhdGEgKS5kb25lKCBva0NhbGxiYWNrICkuZmFpbCggZXJyQ2FsbGJhY2sgKTtcblx0fSApO1xuXG5cdC8qKlxuXHQgKiBSZXNldCB0aGUgcG9zdCBtZXRhIG9wdGlvbidzIG1vZGFsIHdoZW4gbW9kYWwgZ2V0cyBjbG9zZWQuXG5cdCAqL1xuXHQkKCBkb2N1bWVudCApLm9uKCAnY2xvc2VkJywgJHBvc3RNZXRhT3B0aW9uc01vZGFsLCBmdW5jdGlvbigpIHtcblx0XHRyZXNldFBvc3RNZXRhTW9kYWwoKTtcblx0XHQkcG9zdE1ldGFGaWVsZCA9IG51bGw7XG5cdH0gKTtcblxuXHQvLyBVbnNlbGVjdCBhbGwgdmFsdWVzLlxuXHQkcG9zdE1ldGFPcHRpb25zTW9kYWwub24oICdjbGljaycsICcuc2VsZWN0LW5vbmUnLCBmdW5jdGlvbigpIHtcblx0XHQkcG9zdE1ldGFPcHRpb25zLmZpbmQoICdbdHlwZT1cImNoZWNrYm94XCJdJyApLnByb3AoICdjaGVja2VkJywgZmFsc2UgKTtcblx0fSApO1xuXG5cdC8vIFNlbGVjdCBhbGwgdmFsdWVzLlxuXHQkcG9zdE1ldGFPcHRpb25zTW9kYWwub24oICdjbGljaycsICcuc2VsZWN0LWFsbCcsIGZ1bmN0aW9uKCkge1xuXHRcdCRwb3N0TWV0YU9wdGlvbnMuZmluZCggJ1t0eXBlPVwiY2hlY2tib3hcIl0nICkucHJvcCggJ2NoZWNrZWQnLCB0cnVlICk7XG5cdH0gKTtcblxuXHRmdW5jdGlvbiB0cmlnZ2VyTWFudWFsT3B0aW9uc0NoYW5nZSggJHBvc3RNZXRhRmllbGQgKSB7XG5cdFx0Y29uc3QgJHJvd3MgICAgICAgID0gJHBvc3RNZXRhRmllbGQuZmluZCggJy5tYW51YWwtb3B0aW9ucy10YWJsZS1ib2R5LXJvd3MnICk7XG5cdFx0Y29uc3QgJHZhbHVlSG9sZGVyID0gJHBvc3RNZXRhRmllbGQuZmluZCggJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1tYW51YWxfb3B0aW9ucyBpbnB1dCcgKTtcblx0XHRjb25zdCBfcm93cyAgICAgICAgPSBbXTtcblxuXHRcdCRyb3dzLmZpbmQoICcuaXRlbScgKS5lYWNoKCBmdW5jdGlvbiggaSwgX2l0ZW0gKSB7XG5cdFx0XHRjb25zdCAkaXRlbSA9ICQoIF9pdGVtICk7XG5cdFx0XHRjb25zdCB2YWx1ZSA9ICRpdGVtLmZpbmQoICcub3B0aW9uX3ZhbHVlJyApLnZhbCgpO1xuXHRcdFx0Y29uc3QgbGFiZWwgPSAkaXRlbS5maW5kKCAnLm9wdGlvbl9sYWJlbCcgKS52YWwoKTtcblxuXHRcdFx0aWYgKCB2YWx1ZSAmJiBsYWJlbCApIHtcblx0XHRcdFx0X3Jvd3MucHVzaCggWyB2YWx1ZSwgbGFiZWwgXSApO1xuXHRcdFx0fVxuXHRcdH0gKTtcblxuXHRcdGNvbnN0IHJhd1ZhbHVlcyA9IGVuY29kZVVSSUNvbXBvbmVudCggSlNPTi5zdHJpbmdpZnkoIF9yb3dzICkgKTtcblx0XHQkdmFsdWVIb2xkZXIudmFsKCByYXdWYWx1ZXMgKTtcblx0fVxuXG5cdC8vIEFkZCBzZWxlY3RlZCBvcHRpb25zLlxuXHQkcG9zdE1ldGFPcHRpb25zTW9kYWwub24oICdjbGljaycsICcuYWRkLW9wdGlvbnMnLCBmdW5jdGlvbigpIHtcblx0XHRjb25zdCAkb3B0aW9ucyA9ICRwb3N0TWV0YU9wdGlvbnMuZmluZCggJ1t0eXBlPVwiY2hlY2tib3hcIl0nICk7XG5cdFx0bGV0IGlzUmVwbGFjZSAgPSBmYWxzZTtcblx0XHRsZXQgcm93cyAgICAgICA9ICcnO1xuXG5cdFx0aWYgKCAkcG9zdE1ldGFNb2RhbEZvb3Rlci5maW5kKCAnLnJlcGxhY2UtY3VycmVudC1vcHRpb25zJyApLmlzKCAnOmNoZWNrZWQnICkgKSB7XG5cdFx0XHRpc1JlcGxhY2UgPSB0cnVlO1xuXHRcdH1cblxuXHRcdGlmICggJG9wdGlvbnMgKSB7XG5cdFx0XHRjb25zdCBmaWVsZFR5cGUgPSAnd2NhcGYtcG9zdC1tZXRhLW9wdGlvbic7XG5cblx0XHRcdCQuZWFjaCggJG9wdGlvbnMsIGZ1bmN0aW9uKCBpLCBpbnB1dCApIHtcblx0XHRcdFx0Y29uc3QgJGlucHV0ID0gJCggaW5wdXQgKTtcblx0XHRcdFx0Y29uc3QgdmFsdWUgID0gJGlucHV0LnZhbCgpO1xuXG5cdFx0XHRcdGlmICggJGlucHV0LmlzKCAnOmNoZWNrZWQnICkgKSB7XG5cdFx0XHRcdFx0Y29uc3QgdGVtcGxhdGUgPSB3cC50ZW1wbGF0ZSggZmllbGRUeXBlICk7XG5cdFx0XHRcdFx0Y29uc3QgcmVuZGVyZWQgPSB0ZW1wbGF0ZSggeyB2YWx1ZSwgbGFiZWw6IHZhbHVlIH0gKTtcblxuXHRcdFx0XHRcdHJvd3MgKz0gcmVuZGVyZWQ7XG5cdFx0XHRcdH1cblx0XHRcdH0gKTtcblx0XHR9XG5cblx0XHRpZiAoIHJvd3MgKSB7XG5cdFx0XHRjb25zdCAkd3JhcHBlciA9ICRwb3N0TWV0YUZpZWxkLmZpbmQoICcubWFudWFsLW9wdGlvbnMtdGFibGUnICk7XG5cdFx0XHRjb25zdCAkcm93cyAgICA9ICRwb3N0TWV0YUZpZWxkLmZpbmQoICcubWFudWFsLW9wdGlvbnMtdGFibGUtYm9keS1yb3dzJyApO1xuXG5cdFx0XHRpZiAoIGlzUmVwbGFjZSApIHtcblx0XHRcdFx0JHJvd3MuaHRtbCggcm93cyApO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0JHJvd3MuYXBwZW5kKCByb3dzICk7XG5cdFx0XHR9XG5cblx0XHRcdGlmICggISAkd3JhcHBlci5oYXNDbGFzcyggJ2hhcy1vcHRpb25zJyApICkge1xuXHRcdFx0XHQkd3JhcHBlci5hZGRDbGFzcyggJ2hhcy1vcHRpb25zJyApO1xuXHRcdFx0fVxuXG5cdFx0XHR0cmlnZ2VyTWFudWFsT3B0aW9uc0NoYW5nZSggJHBvc3RNZXRhRmllbGQgKTtcblx0XHR9XG5cblx0XHRwb3N0TWV0YU9wdGlvbnNNb2RhbEluc3RhbmNlLmNsb3NlKCk7XG5cdH0gKTtcblxuXHQkc2VhcmNoRm9ybS5vbiggJ2FmdGVyX3RvZ2dsZV9yZXF1ZXN0JywgZnVuY3Rpb24oIGUsIGhhbmRsZXIsIHZhbHVlLCAkZmllbGQgKSB7XG5cdFx0aWYgKCAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLWdldF9vcHRpb25zIGlucHV0JyA9PT0gaGFuZGxlciApIHtcblx0XHRcdGNvbnN0ICRzZWxlY3RFbG0gICAgICAgPSAkZmllbGQuZmluZCggJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1vcHRpb25zX29yZGVyX2J5IHNlbGVjdCcgKTtcblx0XHRcdGNvbnN0IG9yZGVyQnkgICAgICAgICAgPSAkc2VsZWN0RWxtLnZhbCgpO1xuXHRcdFx0Y29uc3QgZGVwZW5kYW50T3B0aW9ucyA9ICdvcHRpb25bdmFsdWU9XCJsYWJlbFwiXSc7XG5cblx0XHRcdGlmICggJ2F1dG9tYXRpY2FsbHknID09PSB2YWx1ZSApIHtcblx0XHRcdFx0JHNlbGVjdEVsbS5jaGlsZHJlbiggZGVwZW5kYW50T3B0aW9ucyApLmF0dHIoICdkaXNhYmxlZCcsICdkaXNhYmxlZCcgKTtcblxuXHRcdFx0XHRpZiAoICdsYWJlbCcgPT09IG9yZGVyQnkgKSB7XG5cdFx0XHRcdFx0JHNlbGVjdEVsbS5wcm9wKCAnc2VsZWN0ZWRJbmRleCcsIDEgKS5jaGFuZ2UoKTtcblx0XHRcdFx0fVxuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0JHNlbGVjdEVsbS5jaGlsZHJlbiggZGVwZW5kYW50T3B0aW9ucyApLnJlbW92ZUF0dHIoICdkaXNhYmxlZCcgKTtcblx0XHRcdH1cblx0XHR9XG5cdH0gKTtcblxuXHQkc2VhcmNoRm9ybS5vbiggJ2lucHV0JywgJy5tYW51YWwtb3B0aW9ucy10YWJsZS1ib2R5LXJvd3MgaW5wdXRbdHlwZT1cInRleHRcIl0nLCBmdW5jdGlvbigpIHtcblx0XHRjb25zdCAkZmllbGQgPSAkKCB0aGlzICkuY2xvc2VzdCggJy53Y2FwZi1mb3JtLWZpZWxkJyApO1xuXG5cdFx0dHJpZ2dlck1hbnVhbE9wdGlvbnNDaGFuZ2UoICRmaWVsZCApO1xuXHR9ICk7XG5cbn0gKTtcbiIsIi8qKlxuICogVGhlIHNlYXJjaCBmb3JtIGZpZWxkLlxuICpcbiAqIEBzaW5jZSAgICAgIDMuMC4wXG4gKiBAcGFja2FnZSAgICB3Yy1hamF4LXByb2R1Y3QtZmlsdGVyXG4gKiBAc3VicGFja2FnZSB3Yy1hamF4LXByb2R1Y3QtZmlsdGVyL2FkbWluL3NyYy9qc1xuICogQGF1dGhvciAgICAgTWFpbnVsIEhhc3NhbiBNYWluXG4gKi9cblxualF1ZXJ5KCBkb2N1bWVudCApLnJlYWR5KCBmdW5jdGlvbiggJCApIHtcblxuXHRjb25zdCAkc2VhcmNoRm9ybSA9ICQoICcjc2VhcmNoLWZvcm0nICk7XG5cblx0Y29uc3QgZGVwZW5kYW50RGF0YSA9IFtcblx0XHR7XG5cdFx0XHQnaGFuZGxlcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtZGlzcGxheV90eXBlIHNlbGVjdCcsXG5cdFx0XHQnaGFuZGxlclR5cGUnOiAnc2VsZWN0Jyxcblx0XHRcdCdldmVudCc6ICdjaGFuZ2UnLFxuXHRcdFx0J2RlcGVuZGFudCc6IFtcblx0XHRcdFx0e1xuXHRcdFx0XHRcdCdzZWxlY3Rvcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtcXVlcnlfdHlwZScsXG5cdFx0XHRcdFx0J3ZhbHVlJzogWyAnY2hlY2tib3gnLCAnbXVsdGktc2VsZWN0JyBdLFxuXHRcdFx0XHR9LFxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0J3NlbGVjdG9yJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1hbGxfaXRlbXNfbGFiZWwnLFxuXHRcdFx0XHRcdCd2YWx1ZSc6IFsgJ3JhZGlvJywgJ3NlbGVjdCcgXSxcblx0XHRcdFx0fSxcblx0XHRcdFx0e1xuXHRcdFx0XHRcdCdzZWxlY3Rvcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtdXNlX2Nob3NlbicsXG5cdFx0XHRcdFx0J3ZhbHVlJzogWyAnc2VsZWN0JywgJ211bHRpLXNlbGVjdCcgXSxcblx0XHRcdFx0fSxcblx0XHRcdF0sXG5cdFx0fSxcblx0XHR7XG5cdFx0XHQnaGFuZGxlcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtdXNlX2Nob3NlbiBpbnB1dCcsXG5cdFx0XHQnaGFuZGxlclR5cGUnOiAnY2hlY2tib3gnLFxuXHRcdFx0J2V2ZW50JzogJ2NoYW5nZScsXG5cdFx0XHQnZGVwZW5kYW50JzogW1xuXHRcdFx0XHR7XG5cdFx0XHRcdFx0J3NlbGVjdG9yJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1jaG9zZW5fbm9fcmVzdWx0c19tZXNzYWdlJyxcblx0XHRcdFx0XHQndmFsdWUnOiBbICcxJyBdLFxuXHRcdFx0XHR9LFxuXHRcdFx0XSxcblx0XHR9LFxuXHRcdHtcblx0XHRcdCdoYW5kbGVyJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1nZXRfb3B0aW9ucyBpbnB1dCcsXG5cdFx0XHQnaGFuZGxlclR5cGUnOiAncmFkaW8nLFxuXHRcdFx0J2V2ZW50JzogJ2NoYW5nZScsXG5cdFx0XHQnZGVwZW5kYW50JzogW1xuXHRcdFx0XHR7XG5cdFx0XHRcdFx0J3NlbGVjdG9yJzogJy5tYW51YWwtb3B0aW9ucy10YWJsZScsXG5cdFx0XHRcdFx0J3ZhbHVlJzogWyAnbWFudWFsX2VudHJ5JyBdLFxuXHRcdFx0XHR9LFxuXHRcdFx0XSxcblx0XHR9LFxuXHRdO1xuXG5cdGZ1bmN0aW9uIF90cmlnZ2VyRGlzcGxheVR5cGVDaGFuZ2UoIHZhbHVlLCAkZmllbGQgKSB7XG5cdFx0Y29uc3QgJG5vUmVzdWx0cyAgICAgPSAkZmllbGQuZmluZCggJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1jaG9zZW5fbm9fcmVzdWx0c19tZXNzYWdlJyApO1xuXHRcdGNvbnN0ICRhbGxJdGVtc0xhYmVsID0gJGZpZWxkLmZpbmQoICcud2NhcGYtZm9ybS1zdWItZmllbGQtYWxsX2l0ZW1zX2xhYmVsJyApO1xuXHRcdGNvbnN0IHVzZUNob3NlbiAgICAgID0gJGZpZWxkLmZpbmQoICcud2NhcGYtZm9ybS1zdWItZmllbGQtdXNlX2Nob3NlbiBpbnB1dCcgKS5pcyggJzpjaGVja2VkJyApO1xuXG5cdFx0aWYgKCB1c2VDaG9zZW4gJiYgKCAnc2VsZWN0JyA9PT0gdmFsdWUgfHwgJ211bHRpLXNlbGVjdCcgPT09IHZhbHVlICkgKSB7XG5cdFx0XHQkbm9SZXN1bHRzLnNob3coKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0JG5vUmVzdWx0cy5oaWRlKCk7XG5cdFx0fVxuXG5cdFx0aWYgKCAoICdyYWRpbycgPT09IHZhbHVlIHx8ICdzZWxlY3QnID09PSB2YWx1ZSApIHx8ICggJ211bHRpLXNlbGVjdCcgPT09IHZhbHVlICYmIHVzZUNob3NlbiApICkge1xuXHRcdFx0JGFsbEl0ZW1zTGFiZWwuc2hvdygpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHQkYWxsSXRlbXNMYWJlbC5oaWRlKCk7XG5cdFx0fVxuXHR9XG5cblx0ZnVuY3Rpb24gX3RyaWdnZXJVc2VTZWxlY3RDaGFuZ2UoIHZhbHVlLCAkZmllbGQgKSB7XG5cdFx0Y29uc3QgJG5vUmVzdWx0cyAgICAgPSAkZmllbGQuZmluZCggJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1jaG9zZW5fbm9fcmVzdWx0c19tZXNzYWdlJyApO1xuXHRcdGNvbnN0ICRhbGxJdGVtc0xhYmVsID0gJGZpZWxkLmZpbmQoICcud2NhcGYtZm9ybS1zdWItZmllbGQtYWxsX2l0ZW1zX2xhYmVsJyApO1xuXHRcdGNvbnN0IGRpc3BsYXlUeXBlICAgID0gJGZpZWxkLmZpbmQoICcud2NhcGYtZm9ybS1zdWItZmllbGQtZGlzcGxheV90eXBlIHNlbGVjdCcgKS52YWwoKTtcblxuXHRcdGlmICggJzEnID09PSB2YWx1ZSAmJiAoICdzZWxlY3QnID09PSBkaXNwbGF5VHlwZSB8fCAnbXVsdGktc2VsZWN0JyA9PT0gZGlzcGxheVR5cGUgKSApIHtcblx0XHRcdCRub1Jlc3VsdHMuc2hvdygpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHQkbm9SZXN1bHRzLmhpZGUoKTtcblx0XHR9XG5cblx0XHRpZiAoICggJzEnID09PSB2YWx1ZSAmJiAnbXVsdGktc2VsZWN0JyA9PT0gZGlzcGxheVR5cGUgKSB8fCAoICdyYWRpbycgPT09IGRpc3BsYXlUeXBlIHx8ICdzZWxlY3QnID09PSBkaXNwbGF5VHlwZSApICkge1xuXHRcdFx0JGFsbEl0ZW1zTGFiZWwuc2hvdygpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHQkYWxsSXRlbXNMYWJlbC5oaWRlKCk7XG5cdFx0fVxuXHR9XG5cblx0ZnVuY3Rpb24gX2hhbmRsZVRvZ2dsZVJlcXVlc3QoIGRhdGEsIGN1cnJlbnRTZWxlY3RvciwgdmFsdWUgKSB7XG5cdFx0Y29uc3QgJGZpZWxkICAgICAgPSBjdXJyZW50U2VsZWN0b3IuY2xvc2VzdCggJy53Y2FwZi1mb3JtLWZpZWxkJyApO1xuXHRcdGNvbnN0IGhhbmRsZXIgICAgID0gZGF0YVsgJ2hhbmRsZXInIF07XG5cdFx0Y29uc3QgaGFuZGxlclR5cGUgPSBkYXRhWyAnaGFuZGxlclR5cGUnIF07XG5cdFx0Y29uc3QgZGVwZW5kYW50ICAgPSBkYXRhWyAnZGVwZW5kYW50JyBdO1xuXG5cdFx0bGV0IF92YWx1ZSA9IHZhbHVlO1xuXG5cdFx0aWYgKCAnY2hlY2tib3gnID09PSBoYW5kbGVyVHlwZSApIHtcblx0XHRcdF92YWx1ZSA9IGN1cnJlbnRTZWxlY3Rvci5pcyggJzpjaGVja2VkJyApID8gJzEnIDogJzAnO1xuXHRcdH1cblxuXHRcdGlmICggJ3JhZGlvJyA9PT0gaGFuZGxlclR5cGUgKSB7XG5cdFx0XHRfdmFsdWUgPSAkZmllbGQuZmluZCggaGFuZGxlciArICc6Y2hlY2tlZCcgKS52YWwoKTtcblx0XHR9XG5cblx0XHQkLmVhY2goIGRlcGVuZGFudCwgZnVuY3Rpb24oIGlkLCBkICkge1xuXHRcdFx0Y29uc3QgJHNlbGVjdG9yICAgPSAkZmllbGQuZmluZCggZFsgJ3NlbGVjdG9yJyBdICk7XG5cdFx0XHRjb25zdCB2YWxpZFZhbHVlcyA9IGRbICd2YWx1ZScgXTtcblxuXHRcdFx0aWYgKCB2YWxpZFZhbHVlcy5pbmNsdWRlcyggX3ZhbHVlICkgKSB7XG5cdFx0XHRcdCRzZWxlY3Rvci5zaG93KCk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHQkc2VsZWN0b3IuaGlkZSgpO1xuXHRcdFx0fVxuXHRcdH0gKTtcblxuXHRcdGlmICggJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1kaXNwbGF5X3R5cGUgc2VsZWN0JyA9PT0gaGFuZGxlciApIHtcblx0XHRcdF90cmlnZ2VyRGlzcGxheVR5cGVDaGFuZ2UoIF92YWx1ZSwgJGZpZWxkICk7XG5cdFx0fVxuXG5cdFx0aWYgKCAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLXVzZV9jaG9zZW4gaW5wdXQnID09PSBoYW5kbGVyICkge1xuXHRcdFx0X3RyaWdnZXJVc2VTZWxlY3RDaGFuZ2UoIF92YWx1ZSwgJGZpZWxkICk7XG5cdFx0fVxuXG5cdFx0JHNlYXJjaEZvcm0udHJpZ2dlciggJ2FmdGVyX3RvZ2dsZV9yZXF1ZXN0JywgWyBoYW5kbGVyLCBfdmFsdWUsICRmaWVsZCBdICk7XG5cdH1cblxuXHRmdW5jdGlvbiBoYW5kbGVUb2dnbGVSZXF1ZXN0KCBkYXRhLCBjdXJyZW50U2VsZWN0b3IsIHZhbHVlICkge1xuXHRcdGlmICggbnVsbCA9PT0gY3VycmVudFNlbGVjdG9yICkge1xuXHRcdFx0Y29uc3QgaGFuZGxlciAgPSBkYXRhWyAnaGFuZGxlcicgXTtcblx0XHRcdGNvbnN0ICRoYW5kbGVyID0gJCggaGFuZGxlciApO1xuXG5cdFx0XHQkLmVhY2goICRoYW5kbGVyLCBmdW5jdGlvbigpIHtcblx0XHRcdFx0Y29uc3QgX3RoaXMgID0gJCggdGhpcyApO1xuXHRcdFx0XHRjb25zdCBfdmFsdWUgPSBfdGhpcy52YWwoKTtcblx0XHRcdFx0X2hhbmRsZVRvZ2dsZVJlcXVlc3QoIGRhdGEsIF90aGlzLCBfdmFsdWUgKTtcblx0XHRcdH0gKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0X2hhbmRsZVRvZ2dsZVJlcXVlc3QoIGRhdGEsIGN1cnJlbnRTZWxlY3RvciwgdmFsdWUgKTtcblx0XHR9XG5cdH1cblxuXHRmdW5jdGlvbiBzZXR1cFNlYXJjaEZvcm0oIGluaXRhbCA9IGZhbHNlICkge1xuXHRcdCQuZWFjaCggZGVwZW5kYW50RGF0YSwgZnVuY3Rpb24oIGksIGRhdGEgKSB7XG5cdFx0XHRjb25zdCBoYW5kbGVyID0gZGF0YVsgJ2hhbmRsZXInIF07XG5cdFx0XHRjb25zdCBldmVudCAgID0gZGF0YVsgJ2V2ZW50JyBdO1xuXG5cdFx0XHRoYW5kbGVUb2dnbGVSZXF1ZXN0KCBkYXRhLCBudWxsLCBudWxsICk7XG5cblx0XHRcdGlmICggaW5pdGFsICkge1xuXHRcdFx0XHQkc2VhcmNoRm9ybS5vbiggZXZlbnQsIGhhbmRsZXIsIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdGNvbnN0IF90aGlzICA9ICQoIHRoaXMgKTtcblx0XHRcdFx0XHRjb25zdCBfdmFsdWUgPSAkKCB0aGlzICkudmFsKCk7XG5cdFx0XHRcdFx0aGFuZGxlVG9nZ2xlUmVxdWVzdCggZGF0YSwgX3RoaXMsIF92YWx1ZSApO1xuXHRcdFx0XHR9ICk7XG5cdFx0XHR9XG5cdFx0fSApO1xuXHR9XG5cblx0c2V0dXBTZWFyY2hGb3JtKCB0cnVlICk7XG5cblx0JHNlYXJjaEZvcm0ub24oICdmaWVsZF9hZGRlZCcsIGZ1bmN0aW9uKCkge1xuXHRcdC8vIFRvZ2dsZSB0aGUgdmlzaWJpbGl0eSBvZiBzdWJmaWVsZHMuXG5cdFx0c2V0dXBTZWFyY2hGb3JtKCk7XG5cdH0gKTtcblxufSApO1xuIiwiLyoqXG4gKiBUaGUgc2VhcmNoIGZvcm0uXG4gKlxuICogQHNpbmNlICAgICAgMy4wLjBcbiAqIEBwYWNrYWdlICAgIHdjLWFqYXgtcHJvZHVjdC1maWx0ZXJcbiAqIEBzdWJwYWNrYWdlIHdjLWFqYXgtcHJvZHVjdC1maWx0ZXIvYWRtaW4vc3JjL2pzXG4gKiBAYXV0aG9yICAgICBNYWludWwgSGFzc2FuIE1haW5cbiAqL1xuXG5jb25zdCB0b3RhbEZpZWxkSW5zdGFuY2VzID0galF1ZXJ5KCAnI3RvdGFsX2ZpZWxkX2luc3RhbmNlcycgKTtcblxuY29uc3Qgc2VhcmNoRm9ybSA9IGpRdWVyeSggJyNzZWFyY2gtZm9ybScgKTtcblxuLyoqXG4gKiBBc3NpZ24gYSB1bmlxdWUgaWQgYnkgcmVwbGFjaW5nIHRoZSBwbGFjZWhvbGRlciBpZC5cbiAqL1xuZnVuY3Rpb24gcmVtb3ZlUGxhY2Vob2xkZXIoIHVuaXF1ZUlkLCBlbGVtZW50cywgYXR0ciApIHtcblx0ZWxlbWVudHMuZWFjaChcblx0XHRmdW5jdGlvbigpIHtcblx0XHRcdGNvbnN0IGVsZW1lbnQgPSBqUXVlcnkoIHRoaXMgKTtcblxuXHRcdFx0Y29uc3Qgb2xkVmFsdWUgPSBlbGVtZW50LmF0dHIoIGF0dHIgKTtcblx0XHRcdGNvbnN0IG5ld1ZhbHVlID0gb2xkVmFsdWUucmVwbGFjZSggJyUlJywgdW5pcXVlSWQgKTtcblxuXHRcdFx0ZWxlbWVudC5hdHRyKCBhdHRyLCBuZXdWYWx1ZSApO1xuXHRcdH1cblx0KTtcbn1cblxuLyoqXG4gKiBJbnNlcnQgdGhlIGZpZWxkJ3Mgc3ViZmllbGRzLlxuICovXG5mdW5jdGlvbiBpbnNlcnRGaWVsZFN1YkZpZWxkcyggdWkgKSB7XG5cdC8vIEluc2VydCB0aGUgZmllbGQncyBzdWJmaWVsZHMgaWYgbm90IGFscmVhZHkgaW5zZXJ0ZWQuXG5cdGlmICggISB1aS5pdGVtLmhhc0NsYXNzKCAnc3ViLWZpZWxkcy1yZWFkeScgKSApIHtcblx0XHRjb25zdCB0eXBlICAgICAgPSB1aS5pdGVtLmF0dHIoICdkYXRhLWZpZWxkLXR5cGUnICk7XG5cdFx0Y29uc3QgdW5pcXVlSWQgID0gcGFyc2VJbnQoIHRvdGFsRmllbGRJbnN0YW5jZXMudmFsKCkgKTtcblx0XHRjb25zdCBmaWVsZFR5cGUgPSAnd2NhcGYtZm9ybS1maWVsZC0nICsgdHlwZTtcblxuXHRcdC8vIEJhaWwgb3V0IGlmIG5vIHRtcGwgZm91bmQgZm9yIHRoZSB0eXBlLlxuXHRcdGlmICggISBqUXVlcnkoICcjdG1wbC0nICsgZmllbGRUeXBlICkubGVuZ3RoICkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdC8vIEluY3JlbWVudCB0aGUgdmFsdWUgb2YgdG90YWwgZmllbGQgaW5zdGFuY2VzLlxuXHRcdHRvdGFsRmllbGRJbnN0YW5jZXMudmFsKCB1bmlxdWVJZCArIDEgKTtcblxuXHRcdGNvbnN0IHRlbXBsYXRlID0gd3AudGVtcGxhdGUoIGZpZWxkVHlwZSApO1xuXHRcdGNvbnN0IHJlbmRlcmVkID0gdGVtcGxhdGUoKTtcblx0XHRjb25zdCB3cmFwcGVyICA9IHVpLml0ZW0uZmluZCggJy53aWRnZXQtY29udGVudCcgKTtcblxuXHRcdHdyYXBwZXIucHJlcGVuZCggcmVuZGVyZWQgKTtcblxuXHRcdC8vIFVwZGF0ZSB0aGUgZm9yIGF0dHJpYnV0ZXMgb2YgdGhlIGxhYmVscy5cblx0XHRyZW1vdmVQbGFjZWhvbGRlciggdW5pcXVlSWQsIHVpLml0ZW0uZmluZCggJ2xhYmVsW2Zvcl49XCJ3Y2FwZi1pbnB1dC1cIl0nICksICdmb3InICk7XG5cblx0XHQvLyBVcGRhdGUgdGhlIGlkcyBvZiB0aGUgaW5wdXQgZWxlbWVudHMuXG5cdFx0cmVtb3ZlUGxhY2Vob2xkZXIoIHVuaXF1ZUlkLCB1aS5pdGVtLmZpbmQoICcqW2lkXj1cIndjYXBmLWlucHV0LVwiXScgKSwgJ2lkJyApO1xuXG5cdFx0Ly8gVXBkYXRlIHRoZSBuYW1lcyBvZiB0aGUgaW5wdXQgZWxlbWVudHMuXG5cdFx0cmVtb3ZlUGxhY2Vob2xkZXIoIHVuaXF1ZUlkLCB1aS5pdGVtLmZpbmQoICcqW2lkXj1cIndjYXBmLWlucHV0LVwiXScgKSwgJ25hbWUnICk7XG5cblx0XHQvLyBVcGRhdGUgdGhlIHBvc2l0aW9uIHZhbHVlLlxuXHRcdHJlbW92ZVBsYWNlaG9sZGVyKCB1bmlxdWVJZCwgdWkuaXRlbS5maW5kKCAnKltpZF49XCJ3Y2FwZi1pbnB1dC1wb3NpdGlvbi1cIl0nICksICd2YWx1ZScgKTtcblxuXHRcdHVpLml0ZW0uYWRkQ2xhc3MoICdzdWItZmllbGRzLXJlYWR5JyApO1xuXG5cdFx0c2VhcmNoRm9ybS50cmlnZ2VyKCAnZmllbGRfYWRkZWQnLCBbIHVpIF0gKTtcblx0fVxufVxuXG4vKipcbiAqIFVwZGF0ZSB0aGUgZm9ybSBmaWVsZCdzIHBvc2l0aW9uIGFmdGVyIHNvcnQuXG4gKlxuICogQHNvdXJjZSBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL2EvMTQ3MzY3NzVcbiAqL1xuZnVuY3Rpb24gdXBkYXRlRmllbGRzUG9zaXRpb24oKSB7XG5cdGNvbnN0IGlucHV0cyAgPSBzZWFyY2hGb3JtLmZpbmQoICcqW2lkXj1cIndjYXBmLWlucHV0LXBvc2l0aW9uLVwiXScgKTtcblx0Y29uc3QgbmJFbGVtcyA9IGlucHV0cy5sZW5ndGg7XG5cblx0aW5wdXRzLmVhY2goXG5cdFx0ZnVuY3Rpb24oIGlkeCApIHtcblx0XHRcdGpRdWVyeSggdGhpcyApLnZhbCggbmJFbGVtcyAtICggbmJFbGVtcyAtIGlkeCApICk7XG5cdFx0fVxuXHQpO1xufVxuXG4vKipcbiAqIE1ha2UgdGhlIGZpZWxkIHJlYWR5LCByZW1vdmUgc3R5bGVzIGNvbWVzIGZyb20ganF1ZXJ5LXVpLXNvcnRhYmxlIHBsdWdpbiwgaW5zZXJ0IHRoZSBmaWVsZCdzIHN1YmZpZWxkcyBldGMuXG4gKi9cbmZ1bmN0aW9uIG1ha2VGaWVsZFJlYWR5KCBlLCB1aSApIHtcblx0Ly8gUmVtb3ZlIHN0eWxlcyBjb21lcyBmcm9tIGpxdWVyeS11aS1zb3J0YWJsZSBwbHVnaW4uXG5cdHVpLml0ZW0ucmVtb3ZlQXR0ciggJ3N0eWxlJyApO1xuXG5cdGluc2VydEZpZWxkU3ViRmllbGRzKCB1aSApO1xuXG5cdHVwZGF0ZUZpZWxkc1Bvc2l0aW9uKCk7XG5cblx0Y29uc3QgdG9nZ2xlQnRuID0gdWkuaXRlbS5maW5kKCAnLndpZGdldC1hY3Rpb24nICk7XG5cblx0Ly8gRXhwYW5kIHRoZSBmb3JtIGZpZWxkIGFmdGVyIHNvcnQuXG5cdGlmICggJ2ZhbHNlJyA9PT0gdG9nZ2xlQnRuLmF0dHIoICdhcmlhLWV4cGFuZGVkJyApICkge1xuXHRcdHRvZ2dsZUJ0bi50cmlnZ2VyKCAnY2xpY2snICk7XG5cdH1cbn1cblxuLyoqXG4gKiBJbnN0YW50aWF0ZSBzb3J0YWJsZSBmb3IgdGhlIGZvcm0gZmllbGRzLlxuICovXG5mdW5jdGlvbiBzb3J0YWJsZSggaWRlbnRpZmllciApIHtcblx0Y29uc3QgY29udGFpbmVyID0galF1ZXJ5KCBpZGVudGlmaWVyICk7XG5cblx0Y29udGFpbmVyLnNvcnRhYmxlKFxuXHRcdHtcblx0XHRcdG9wYWNpdHk6IDAuOCxcblx0XHRcdHJldmVydDogZmFsc2UsXG5cdFx0XHRjdXJzb3I6ICdtb3ZlJyxcblx0XHRcdGF4aXM6ICd5Jyxcblx0XHRcdGhhbmRsZTogJy53aWRnZXQtdG9wJyxcblx0XHRcdGNhbmNlbDogJy53aWRnZXQtdGl0bGUtYWN0aW9uJyxcblx0XHRcdGl0ZW1zOiAnLndpZGdldCcsXG5cdFx0XHRwbGFjZWhvbGRlcjogJ3dpZGdldC1wbGFjZWhvbGRlcicsXG5cdFx0XHRjb25uZWN0V2l0aDogJyNzZWFyY2gtZm9ybS13cmFwcGVyJyxcblx0XHRcdHN0b3A6IG1ha2VGaWVsZFJlYWR5LFxuXHRcdFx0c3RhcnQ6IGZ1bmN0aW9uKCBlLCB1aSApIHtcblx0XHRcdFx0Ly8gSWYgaXQgaXMgZ2V0dGluZyBhcHBlbmRlZCB0byB0aGUgd3JvbmcgcGxhY2UsIHRoZW4gZm9yY2UgaXQgaW50byB0aGUgcmlnaHQgY29udGFpbmVyLlxuXHRcdFx0XHR1aS5wbGFjZWhvbGRlci5hcHBlbmRUbyggdWkucGxhY2Vob2xkZXIucGFyZW50KCkuZmluZCggJy5pbnNpZGUgI3NlYXJjaC1mb3JtLXdyYXBwZXInICkgKTtcblx0XHRcdH1cblx0XHR9XG5cdCk7XG59XG5cbnNvcnRhYmxlKCAnI3NlYXJjaC1mb3JtJyApO1xuXG4vKipcbiAqIFJ1biBmdW5jdGlvbiB3aGVuIGRyYWcgc3RhcnRzLlxuICovXG5mdW5jdGlvbiBvbkRyYWdTdGFydCgpIHtcblx0c2VhcmNoRm9ybS5hZGRDbGFzcyggJ3VpLWRyb3AtYWN0aXZlJyApO1xufVxuXG4vKipcbiAqIFJ1biBmdW5jdGlvbiBhdCBkcmFnIHN0b3AuXG4gKi9cbmZ1bmN0aW9uIG9uRHJhZ1N0b3AoKSB7XG5cdHNlYXJjaEZvcm0ucmVtb3ZlQ2xhc3MoICd1aS1kcm9wLWFjdGl2ZScgKTtcbn1cblxuLyoqXG4gKiBJbml0aWFsaXplIGRyYWdnYWJsZSBmb3IgdGhlIGZvcm0gZmllbGRzLlxuICovXG5qUXVlcnkoICcjYXZhaWxhYmxlLWZpZWxkcyAud2lkZ2V0JyApLmRyYWdnYWJsZShcblx0e1xuXHRcdGNvbm5lY3RUb1NvcnRhYmxlOiAnI3NlYXJjaC1mb3JtJyxcblx0XHRoZWxwZXI6ICdjbG9uZScsXG5cdFx0c3RhcnQ6IG9uRHJhZ1N0YXJ0LFxuXHRcdHN0b3A6IG9uRHJhZ1N0b3AsXG5cdH1cbik7XG5cbi8qKlxuICogVG9nZ2xlIHRoZSBmb3JtIGZpZWxkLlxuICovXG5mdW5jdGlvbiB0b2dnbGVGaWVsZCggZSApIHtcblx0Y29uc3QgdGFyZ2V0ICAgICAgID0gZS50YXJnZXQ7XG5cdGNvbnN0IHdpZGdldCAgICAgICA9IGpRdWVyeSggdGhpcyApLmNsb3Nlc3QoICcud2lkZ2V0JyApO1xuXHRjb25zdCB0b2dnbGVCdG4gICAgPSB3aWRnZXQuZmluZCggJy53aWRnZXQtYWN0aW9uJyApO1xuXHRjb25zdCBpbnNpZGUgICAgICAgPSB3aWRnZXQuY2hpbGRyZW4oICcud2lkZ2V0LWluc2lkZScgKTtcblx0Y29uc3QgaXNFeHBhbmQgICAgID0gdG9nZ2xlQnRuLmF0dHIoICdhcmlhLWV4cGFuZGVkJyApO1xuXHRjb25zdCB0b2dnbGVFeHBhbmQgPSAndHJ1ZScgPT09IGlzRXhwYW5kID8gJ2ZhbHNlJyA6ICd0cnVlJztcblxuXHR0b2dnbGVCdG4uYXR0ciggJ2FyaWEtZXhwYW5kZWQnLCB0b2dnbGVFeHBhbmQgKTtcblx0alF1ZXJ5KCBpbnNpZGUgKS5zbGlkZVRvZ2dsZShcblx0XHQnZmFzdCcsXG5cdFx0ZnVuY3Rpb24oKSB7XG5cdFx0XHR3aWRnZXQudG9nZ2xlQ2xhc3MoICdvcGVuJyApO1xuXHRcdFx0c2VhcmNoRm9ybS50cmlnZ2VyKCAnd2lkZ2V0LWNsb3NlZCcsIFsgdGFyZ2V0IF0gKTtcblx0XHR9XG5cdCk7XG59XG5cbnNlYXJjaEZvcm0ub24oICdjbGljaycsICcud2lkZ2V0LXRvcCcsIHRvZ2dsZUZpZWxkICk7XG5zZWFyY2hGb3JtLm9uKCAnY2xpY2snLCAnLndpZGdldC1jb250cm9sLWNsb3NlJywgdG9nZ2xlRmllbGQgKTtcblxuLyoqXG4gKiBGb2N1cyB0aGUgZm9ybSBmaWVsZCdzIGV4cGFuZCBidXR0b24uXG4gKi9cbmZ1bmN0aW9uIGZvY3VzRmllbGQoIGUsIHRhcmdldCApIHtcblx0aWYgKCB0YXJnZXQuY2xhc3NMaXN0LmNvbnRhaW5zKCAnd2lkZ2V0LWNvbnRyb2wtY2xvc2UnICkgKSB7XG5cdFx0Y29uc3Qgd2lkZ2V0ID0galF1ZXJ5KCB0YXJnZXQgKS5jbG9zZXN0KCAnLndpZGdldCcgKTtcblx0XHRjb25zdCBhY3Rpb24gPSB3aWRnZXQuZmluZCggJy53aWRnZXQtYWN0aW9uJyApO1xuXG5cdFx0YWN0aW9uLmF0dHIoICdhcmlhLWV4cGFuZGVkJywgJ2ZhbHNlJyApLmZvY3VzKCk7XG5cdH1cbn1cblxuc2VhcmNoRm9ybS5vbiggJ3dpZGdldC1jbG9zZWQnLCBmb2N1c0ZpZWxkICk7XG5cbi8qKlxuICogUmVtb3ZlIHRoZSBmaWVsZC5cbiAqL1xuZnVuY3Rpb24gcmVtb3ZlRmllbGQoKSB7XG5cdGNvbnN0IHdpZGdldCA9IGpRdWVyeSggdGhpcyApLmNsb3Nlc3QoICcud2lkZ2V0JyApO1xuXG5cdGpRdWVyeSggd2lkZ2V0ICkuc2xpZGVVcChcblx0XHQnZmFzdCcsXG5cdFx0ZnVuY3Rpb24oKSB7XG5cdFx0XHR3aWRnZXQucmVtb3ZlKCk7XG5cdFx0XHR1cGRhdGVGaWVsZHNQb3NpdGlvbigpO1xuXHRcdH1cblx0KTtcbn1cblxuc2VhcmNoRm9ybS5vbiggJ2NsaWNrJywgJy53aWRnZXQtY29udHJvbC1yZW1vdmUnLCByZW1vdmVGaWVsZCApO1xuXG4vKipcbiAqIFN0b3JlIHRoZSBpbml0aWFsIGZvcm0gZGF0YSBpbnRvIGEgdmFyaWFibGUgc28gdGhhdCB3ZSBjYW4gY29tcGFyZSBpdCB3aGVuIGxlYXZpbmcgdGhlIHBhZ2UuXG4gKi9cbmxldCBpbml0aWFsRm9ybVN0YXRlID0gc2VhcmNoRm9ybS5zZXJpYWxpemVBcnJheSgpO1xuXG4vKipcbiAqIFNob3cgbWVzc2FnZSBhZnRlciBmb3JtIHN1Ym1pc3Npb24uXG4gKi9cbmZ1bmN0aW9uIHNob3dNZXNzYWdlKCBtZXNzYWdlLCB0eXBlID0gJ3N1Y2Nlc3MnICkge1xuXHRjb25zdCBlbGVtZW50ID0galF1ZXJ5KCAnPHAgY2xhc3M9XCInICsgdHlwZSArICdcIj4nICsgbWVzc2FnZSArICc8L3A+JyApO1xuXHRjb25zdCB3cmFwcGVyID0galF1ZXJ5KCAnLndjYXBmLW1lc3NhZ2Utd3JhcHBlcicgKTtcblxuXHRpZiAoICEgd3JhcHBlci5pcyggJzplbXB0eScgKSApIHtcblx0XHRyZXR1cm47XG5cdH1cblxuXHRqUXVlcnkoIHdyYXBwZXIgKS5odG1sKCBlbGVtZW50ICkuc2xpZGVEb3duKCAnZmFzdCcgKTtcblxuXHRzZXRUaW1lb3V0KFxuXHRcdGZ1bmN0aW9uKCkge1xuXHRcdFx0alF1ZXJ5KCB3cmFwcGVyICkuc2xpZGVVcCggJ2Zhc3QnICk7XG5cdFx0XHR3cmFwcGVyLmh0bWwoICcnICk7XG5cdFx0fSxcblx0XHQzMDAwXG5cdCk7XG59XG5cbi8qKlxuICogU2F2ZSB0aGUgc2VhcmNoIGZvcm0uXG4gKi9cbmZ1bmN0aW9uIHNhdmVGb3JtKCkge1xuXHRjb25zdCBidXR0b24gICA9IGpRdWVyeSggdGhpcyApO1xuXHRjb25zdCBmb3JtRGF0YSA9IHNlYXJjaEZvcm0uc2VyaWFsaXplQXJyYXkoKTtcblxuXHRidXR0b24uYXR0ciggJ2Rpc2FibGVkJywgJ2Rpc2FibGVkJyApO1xuXG5cdGZ1bmN0aW9uIG9rQ2FsbGJhY2soIG1lc3NhZ2UgKSB7XG5cdFx0YnV0dG9uLnJlbW92ZUF0dHIoICdkaXNhYmxlZCcgKTtcblxuXHRcdC8vIFVwZGF0ZSB0aGUgaW5pdGlhbCBmb3JtIGRhdGEgYWZ0ZXIgc3VjY2Vzc2Z1bGx5IHNhdmluZyB0aGUgZm9ybS5cblx0XHRpbml0aWFsRm9ybVN0YXRlID0gZm9ybURhdGE7XG5cblx0XHRzaG93TWVzc2FnZSggbWVzc2FnZSApO1xuXHR9XG5cblx0ZnVuY3Rpb24gZXJyQ2FsbGJhY2soIG1lc3NhZ2UgKSB7XG5cdFx0YnV0dG9uLnJlbW92ZUF0dHIoICdkaXNhYmxlZCcgKTtcblx0XHRzaG93TWVzc2FnZSggbWVzc2FnZSwgJ2Vycm9yJyApO1xuXHR9XG5cblx0Ly8gaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9hLzU5MTgxMjUyXG5cdHdwLmFqYXgucG9zdCggZm9ybURhdGEgKS5kb25lKCBva0NhbGxiYWNrICkuZmFpbCggZXJyQ2FsbGJhY2sgKTtcbn1cblxualF1ZXJ5KCAnI3Bvc3Rib3gtY29udGFpbmVyLTEnICkub24oICdjbGljaycsICdidXR0b24nLCBzYXZlRm9ybSApO1xuXG4vKipcbiAqIFNob3cgYWxlcnQgb24gbGVhdmUgaWYgdGhlIGZvcm0gaXMgZGlydHkuXG4gKlxuICogVE9ETzogVW5jb21tZW50IHRoaXMuXG4gKi9cbi8vIHdpbmRvdy5vbmJlZm9yZXVubG9hZCA9IGZ1bmN0aW9uKCkge1xuLy8gXHRjb25zdCBuZXdGb3JtU3RhdGUgPSBzZWFyY2hGb3JtLnNlcmlhbGl6ZUFycmF5KCk7XG4vL1xuLy8gXHRjb25zdCBpc0Zvcm1EaXJ0eSA9ICEgXy5pc0VxdWFsKCBuZXdGb3JtU3RhdGUsIGluaXRpYWxGb3JtU3RhdGUgKTtcbi8vXG4vLyBcdGlmICggaXNGb3JtRGlydHkgKSB7XG4vLyBcdFx0cmV0dXJuICcnO1xuLy8gXHR9XG4vLyB9O1xuIl19
