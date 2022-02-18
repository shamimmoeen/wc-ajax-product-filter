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
      placeholder: 'widget-placeholder',
      handle: '.move-options-handler'
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
  }); // Clear All Options

  $searchForm.on('click', '.clear-all-options', function () {
    var $field = $(this).closest('.wcapf-form-field');
    $field.find('.manual-options-table-body-rows').empty();
    triggerRemoveOption($field);
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
  }
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
  }); // Add selected options.

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
    }

    postMetaOptionsModalInstance.close();
  });
  $searchForm.on('after_toggle_request', function (e, handler, value, $field) {
    if ('.wcapf-form-sub-field-get_options input' === handler) {
      var $selectElm = $field.find('.wcapf-form-sub-field-options_order_by select');
      var dependantOptions = 'option[value="label"]';

      if ('automatically' === value) {
        $selectElm.children(dependantOptions).attr('disabled', 'disabled');
        $selectElm.prop('selectedIndex', 1).change();
      } else {
        $selectElm.children(dependantOptions).removeAttr('disabled');
        $selectElm.prop('selectedIndex', 0).change();
      }
    }
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInBvc3QtbWV0YS1vcHRpb25zLmpzIiwic2VhcmNoLWZvcm0tZmllbGQuanMiLCJzZWFyY2gtZm9ybS5qcyJdLCJuYW1lcyI6WyJqUXVlcnkiLCJkb2N1bWVudCIsInJlYWR5IiwiJCIsIiRzZWFyY2hGb3JtIiwiaW5pdFNvcnRhYmxlRm9yTWFudWFsT3B0aW9ucyIsIiRzZWxlY3RvciIsInNvcnRhYmxlIiwicGxhY2Vob2xkZXIiLCJoYW5kbGUiLCJkaXNhYmxlU2VsZWN0aW9uIiwiZmluZCIsIm9uIiwiZSIsInVpIiwiaXRlbSIsInRyaWdnZXJSZW1vdmVPcHRpb24iLCIkZmllbGQiLCIkb3B0aW9uc1RhYmxlIiwidGFibGVSb3dzIiwiY2hpbGRyZW4iLCJsZW5ndGgiLCJyZW1vdmVDbGFzcyIsIiRpdGVtIiwiY2xvc2VzdCIsInJlbW92ZSIsImVtcHR5IiwiZmllbGRUeXBlIiwidGVtcGxhdGUiLCJ3cCIsInJlbmRlcmVkIiwidmFsdWUiLCJsYWJlbCIsIiR3cmFwcGVyIiwiJHJvd3MiLCJhcHBlbmQiLCJoYXNDbGFzcyIsImFkZENsYXNzIiwiJHBvc3RNZXRhT3B0aW9uc01vZGFsIiwiJG5vS2V5Rm91bmRNZXNzYWdlIiwiJHBvc3RNZXRhTW9kYWxMb2FkZXIiLCIkcG9zdE1ldGFPcHRpb25zIiwiJHBvc3RNZXRhTW9kYWxGb290ZXIiLCJwb3N0TWV0YU9wdGlvbnNNb2RhbEluc3RhbmNlIiwicmVtb2RhbCIsImhhc2hUcmFja2luZyIsIiRwb3N0TWV0YUZpZWxkIiwicmVzZXRQb3N0TWV0YU1vZGFsIiwiaHRtbCIsInByb3AiLCJva0NhbGxiYWNrIiwicmVzcG9uc2UiLCJlcnJDYWxsYmFjayIsIm1lc3NhZ2UiLCJjb25zb2xlIiwibG9nIiwiJGlucHV0TWV0YUtleSIsIm1ldGFLZXkiLCJ2YWwiLCJvcGVuIiwiZm9ybURhdGEiLCJrZXkiLCJhY3Rpb24iLCJhamF4IiwicG9zdCIsImRvbmUiLCJmYWlsIiwiJG9wdGlvbnMiLCJpc1JlcGxhY2UiLCJyb3dzIiwiaXMiLCJlYWNoIiwiaSIsImlucHV0IiwiJGlucHV0IiwiY2xvc2UiLCJoYW5kbGVyIiwiJHNlbGVjdEVsbSIsImRlcGVuZGFudE9wdGlvbnMiLCJhdHRyIiwiY2hhbmdlIiwicmVtb3ZlQXR0ciIsImRlcGVuZGFudERhdGEiLCJfdHJpZ2dlckRpc3BsYXlUeXBlQ2hhbmdlIiwiJG5vUmVzdWx0cyIsIiRhbGxJdGVtc0xhYmVsIiwidXNlQ2hvc2VuIiwic2hvdyIsImhpZGUiLCJfdHJpZ2dlclVzZVNlbGVjdENoYW5nZSIsImRpc3BsYXlUeXBlIiwiX2hhbmRsZVRvZ2dsZVJlcXVlc3QiLCJkYXRhIiwiY3VycmVudFNlbGVjdG9yIiwiaGFuZGxlclR5cGUiLCJkZXBlbmRhbnQiLCJfdmFsdWUiLCJpZCIsImQiLCJ2YWxpZFZhbHVlcyIsImluY2x1ZGVzIiwidHJpZ2dlciIsImhhbmRsZVRvZ2dsZVJlcXVlc3QiLCIkaGFuZGxlciIsIl90aGlzIiwic2V0dXBTZWFyY2hGb3JtIiwiaW5pdGFsIiwiZXZlbnQiLCJ0b3RhbEZpZWxkSW5zdGFuY2VzIiwic2VhcmNoRm9ybSIsInJlbW92ZVBsYWNlaG9sZGVyIiwidW5pcXVlSWQiLCJlbGVtZW50cyIsImVsZW1lbnQiLCJvbGRWYWx1ZSIsIm5ld1ZhbHVlIiwicmVwbGFjZSIsImluc2VydEZpZWxkU3ViRmllbGRzIiwidHlwZSIsInBhcnNlSW50Iiwid3JhcHBlciIsInByZXBlbmQiLCJ1cGRhdGVGaWVsZHNQb3NpdGlvbiIsImlucHV0cyIsIm5iRWxlbXMiLCJpZHgiLCJtYWtlRmllbGRSZWFkeSIsInRvZ2dsZUJ0biIsImlkZW50aWZpZXIiLCJjb250YWluZXIiLCJvcGFjaXR5IiwicmV2ZXJ0IiwiY3Vyc29yIiwiYXhpcyIsImNhbmNlbCIsIml0ZW1zIiwiY29ubmVjdFdpdGgiLCJzdG9wIiwic3RhcnQiLCJhcHBlbmRUbyIsInBhcmVudCIsIm9uRHJhZ1N0YXJ0Iiwib25EcmFnU3RvcCIsImRyYWdnYWJsZSIsImNvbm5lY3RUb1NvcnRhYmxlIiwiaGVscGVyIiwidG9nZ2xlRmllbGQiLCJ0YXJnZXQiLCJ3aWRnZXQiLCJpbnNpZGUiLCJpc0V4cGFuZCIsInRvZ2dsZUV4cGFuZCIsInNsaWRlVG9nZ2xlIiwidG9nZ2xlQ2xhc3MiLCJmb2N1c0ZpZWxkIiwiY2xhc3NMaXN0IiwiY29udGFpbnMiLCJmb2N1cyIsInJlbW92ZUZpZWxkIiwic2xpZGVVcCIsImluaXRpYWxGb3JtU3RhdGUiLCJzZXJpYWxpemVBcnJheSIsInNob3dNZXNzYWdlIiwic2xpZGVEb3duIiwic2V0VGltZW91dCIsInNhdmVGb3JtIiwiYnV0dG9uIl0sIm1hcHBpbmdzIjoiOztBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQUEsTUFBTSxDQUFFQyxRQUFGLENBQU4sQ0FBbUJDLEtBQW5CLENBQTBCLFVBQVVDLENBQVYsRUFBYztBQUV2QyxNQUFNQyxXQUFXLEdBQUdELENBQUMsQ0FBRSxjQUFGLENBQXJCOztBQUVBLFdBQVNFLDRCQUFULENBQXVDQyxTQUF2QyxFQUFtRDtBQUNsREEsSUFBQUEsU0FBUyxDQUFDQyxRQUFWLENBQW9CO0FBQ25CQyxNQUFBQSxXQUFXLEVBQUUsb0JBRE07QUFFbkJDLE1BQUFBLE1BQU0sRUFBRTtBQUZXLEtBQXBCLEVBR0lDLGdCQUhKO0FBSUEsR0FUc0MsQ0FXdkM7OztBQUNBTCxFQUFBQSw0QkFBNEIsQ0FBRUQsV0FBVyxDQUFDTyxJQUFaLENBQWtCLGlDQUFsQixDQUFGLENBQTVCO0FBRUFQLEVBQUFBLFdBQVcsQ0FBQ1EsRUFBWixDQUFnQixhQUFoQixFQUErQixVQUFVQyxDQUFWLEVBQWFDLEVBQWIsRUFBa0I7QUFDaEQ7QUFDQVQsSUFBQUEsNEJBQTRCLENBQUVGLENBQUMsQ0FBRVcsRUFBRSxDQUFDQyxJQUFILENBQVFKLElBQVIsQ0FBYyxpQ0FBZCxDQUFGLENBQUgsQ0FBNUI7QUFDQSxHQUhEOztBQUtBLFdBQVNLLG1CQUFULENBQThCQyxNQUE5QixFQUF1QztBQUN0QyxRQUFNQyxhQUFhLEdBQUdE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VUFBVSxDQUFDb0QsY0FBWCxFQUFqQjtBQUVBSyxFQUFBQSxNQUFNLENBQUN2RixJQUFQLENBQWEsVUFBYixFQUF5QixVQUF6Qjs7QUFFQSxXQUFTN0IsVUFBVCxDQUFxQkcsT0FBckIsRUFBK0I7QUFDOUJpSCxJQUFBQSxNQUFNLENBQUNyRixVQUFQLENBQW1CLFVBQW5CLEVBRDhCLENBRzlCOztBQUNBK0UsSUFBQUEsZ0JBQWdCLEdBQUdwRyxRQUFuQjtBQUVBc0csSUFBQUEsV0FBVyxDQUFFN0csT0FBRixDQUFYO0FBQ0E7O0FBRUQsV0FBU0QsV0FBVCxDQUFzQkMsT0FBdEIsRUFBZ0M7QUFDL0JpSCxJQUFBQSxNQUFNLENBQUNyRixVQUFQLENBQW1CLFVBQW5CO0FBQ0FpRixJQUFBQSxXQUFXLENBQUU3RyxPQUFGLEVBQVcsT0FBWCxDQUFYO0FBQ0EsR0FsQmtCLENBb0JuQjs7O0FBQ0F4QixFQUFBQSxFQUFFLENBQUNrQyxJQUFILENBQVFDLElBQVIsQ0FBY0osUUFBZCxFQUF5QkssSUFBekIsQ0FBK0JmLFVBQS9CLEVBQTRDZ0IsSUFBNUMsQ0FBa0RkLFdBQWxEO0FBQ0E7O0FBRURwRCxNQUFNLENBQUUsc0JBQUYsQ0FBTixDQUFpQ1ksRUFBakMsQ0FBcUMsT0FBckMsRUFBOEMsUUFBOUMsRUFBd0R5SixRQUF4RDtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoid2MtYWpheC1wcm9kdWN0LWZpbHRlci1hZG1pbi1zY3JpcHRzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBUaGUgcG9zdCBtZXRhIGZpZWxkLlxuICpcbiAqIEBzaW5jZSAgICAgIDEuMC4wXG4gKiBAcGFja2FnZSAgICB3Yy1hamF4LXByb2R1Y3QtZmlsdGVyLXByb1xuICogQHN1YnBhY2thZ2Ugd2MtYWpheC1wcm9kdWN0LWZpbHRlci1wcm8vYWRtaW4vc3JjL2pzXG4gKiBAYXV0aG9yICAgICBNYWludWwgSGFzc2FuIE1haW5cbiAqL1xuXG5qUXVlcnkoIGRvY3VtZW50ICkucmVhZHkoIGZ1bmN0aW9uKCAkICkge1xuXG5cdGNvbnN0ICRzZWFyY2hGb3JtID0gJCggJyNzZWFyY2gtZm9ybScgKTtcblxuXHRmdW5jdGlvbiBpbml0U29ydGFibGVGb3JNYW51YWxPcHRpb25zKCAkc2VsZWN0b3IgKSB7XG5cdFx0JHNlbGVjdG9yLnNvcnRhYmxlKCB7XG5cdFx0XHRwbGFjZWhvbGRlcjogJ3dpZGdldC1wbGFjZWhvbGRlcicsXG5cdFx0XHRoYW5kbGU6ICcubW92ZS1vcHRpb25zLWhhbmRsZXInLFxuXHRcdH0gKS5kaXNhYmxlU2VsZWN0aW9uKCk7XG5cdH1cblxuXHQvLyBTb3J0IE1hbnVhbCBPcHRpb25zXG5cdGluaXRTb3J0YWJsZUZvck1hbnVhbE9wdGlvbnMoICRzZWFyY2hGb3JtLmZpbmQoICcubWFudWFsLW9wdGlvbnMtdGFibGUtYm9keS1yb3dzJyApICk7XG5cblx0JHNlYXJjaEZvcm0ub24oICdmaWVsZF9hZGRlZCcsIGZ1bmN0aW9uKCBlLCB1aSApIHtcblx0XHQvLyBJbml0IFNvcnRhYmxlIGZvciB0aGUgbWFudWFsIG9wdGlvbnMuXG5cdFx0aW5pdFNvcnRhYmxlRm9yTWFudWFsT3B0aW9ucyggJCggdWkuaXRlbS5maW5kKCAnLm1hbnVhbC1vcHRpb25zLXRhYmxlLWJvZHktcm93cycgKSApICk7XG5cdH0gKTtcblxuXHRmdW5jdGlvbiB0cmlnZ2VyUmVtb3ZlT3B0aW9uKCAkZmllbGQgKSB7XG5cdFx0Y29uc3QgJG9wdGlvbnNUYWJsZSA9ICRmaWVsZC5maW5kKCAnLm1hbnVhbC1vcHRpb25zLXRhYmxlJyApO1xuXHRcdGNvbnN0IHRhYmxlUm93cyAgICAgPSAkb3B0aW9uc1RhYmxlLmZpbmQoICcubWFudWFsLW9wdGlvbnMtdGFibGUtYm9keS1yb3dzJyApLmNoaWxkcmVuKCk7XG5cblx0XHRpZiAoIDIgPiB0YWJsZVJvd3MubGVuZ3RoICkge1xuXHRcdFx0JG9wdGlvbnNUYWJsZS5yZW1vdmVDbGFzcyggJ2hhcy1vcHRpb25zJyApO1xuXHRcdH1cblx0fVxuXG5cdC8vIFJlbW92ZSBTaW5nbGUgT3B0aW9uXG5cdCRzZWFyY2hGb3JtLm9uKCAnY2xpY2snLCAnLnJlbW92ZS1vcHRpb24nLCBmdW5jdGlvbigpIHtcblx0XHRjb25zdCAkaXRlbSAgPSAkKCB0aGlzICkuY2xvc2VzdCggJy5pdGVtJyApO1xuXHRcdGNvbnN0ICRmaWVsZCA9ICRpdGVtLmNsb3Nlc3QoICcud2NhcGYtZm9ybS1maWVsZCcgKTtcblxuXHRcdHRyaWdnZXJSZW1vdmVPcHRpb24oICRmaWVsZCApO1xuXG5cdFx0JGl0ZW0ucmVtb3ZlKCk7XG5cdH0gKTtcblxuXHQvLyBDbGVhciBBbGwgT3B0aW9uc1xuXHQkc2VhcmNoRm9ybS5vbiggJ2NsaWNrJywgJy5jbGVhci1hbGwtb3B0aW9ucycsIGZ1bmN0aW9uKCkge1xuXHRcdGNvbnN0ICRmaWVsZCA9ICQoIHRoaXMgKS5jbG9zZXN0KCAnLndjYXBmLWZvcm0tZmllbGQnICk7XG5cblx0XHQkZmllbGQuZmluZCggJy5tYW51YWwtb3B0aW9ucy10YWJsZS1ib2R5LXJvd3MnICkuZW1wdHkoKTtcblxuXHRcdHRyaWdnZXJSZW1vdmVPcHRpb24oICRmaWVsZCApO1xuXHR9ICk7XG5cblx0Ly8gQWRkIE5ldyBPcHRpb25cblx0JHNlYXJjaEZvcm0ub24oICdjbGljaycsICcuYWRkLW9wdGlvbicsIGZ1bmN0aW9uKCkge1xuXHRcdGNvbnN0IGZpZWxkVHlwZSA9ICd3Y2FwZi1wb3N0LW1ldGEtb3B0aW9uJztcblxuXHRcdC8vIEJhaWwgb3V0IGlmIG5vIHRtcGwgZm91bmQgZm9yIHRoZSB0eXBlLlxuXHRcdGlmICggISBqUXVlcnkoICcjdG1wbC0nICsgZmllbGRUeXBlICkubGVuZ3RoICkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdGNvbnN0ICRmaWVsZCA9ICQoIHRoaXMgKS5jbG9zZXN0KCAnLndjYXBmLWZvcm0tZmllbGQnICk7XG5cblx0XHRjb25zdCB0ZW1wbGF0ZSA9IHdwLnRlbXBsYXRlKCBmaWVsZFR5cGUgKTtcblx0XHRjb25zdCByZW5kZXJlZCA9IHRlbXBsYXRlKCB7IHZhbHVlOiAnJywgbGFiZWw6ICcnIH0gKTtcblx0XHRjb25zdCAkd3JhcHBlciA9ICRmaWVsZC5maW5kKCAnLm1hbnVhbC1vcHRpb25zLXRhYmxlJyApO1xuXHRcdGNvbnN0ICRyb3dzICAgID0gJHdyYXBwZXIuZmluZCggJy5tYW51YWwtb3B0aW9ucy10YWJsZS1ib2R5LXJvd3MnICk7XG5cblx0XHQkcm93cy5hcHBlbmQoIHJlbmRlcmVkICk7XG5cblx0XHRpZiAoICEgJHdyYXBwZXIuaGFzQ2xhc3MoICdoYXMtb3B0aW9ucycgKSApIHtcblx0XHRcdCR3cmFwcGVyLmFkZENsYXNzKCAnaGFzLW9wdGlvbnMnICk7XG5cdFx0fVxuXHR9ICk7XG5cblx0Y29uc3QgJHBvc3RNZXRhT3B0aW9uc01vZGFsID0gJCggJy5wb3N0LW1ldGEtb3B0aW9ucy1tb2RhbCcgKTtcblx0Y29uc3QgJG5vS2V5Rm91bmRNZXNzYWdlICAgID0gJHBvc3RNZXRhT3B0aW9uc01vZGFsLmZpbmQoICcubm8ta2V5LWZvdW5kLW1lc3NhZ2UnICk7XG5cdGNvbnN0ICRwb3N0TWV0YU1vZGFsTG9hZGVyICA9ICRwb3N0TWV0YU9wdGlvbnNNb2RhbC5maW5kKCAnLnBvc3QtbWV0YS1vcHRpb25zLWxvYWRlcicgKTtcblx0Y29uc3QgJHBvc3RNZXRhT3B0aW9ucyAgICAgID0gJHBvc3RNZXRhT3B0aW9uc01vZGFsLmZpbmQoICcucG9zdC1tZXRhLW9wdGlvbnMnICk7XG5cdGNvbnN0ICRwb3N0TWV0YU1vZGFsRm9vdGVyICA9ICRwb3N0TWV0YU9wdGlvbnNNb2RhbC5maW5kKCAnLndjYXBmLW1vZGFsLWZvb3RlcicgKTtcblxuXHRjb25zdCBwb3N0TWV0YU9wdGlvbnNNb2RhbEluc3RhbmNlID0gJHBvc3RNZXRhT3B0aW9uc01vZGFsLnJlbW9kYWwoIHtcblx0XHRoYXNoVHJhY2tpbmc6IGZhbHNlLFxuXHR9ICk7XG5cblx0bGV0ICRwb3N0TWV0YUZpZWxkID0gbnVsbDtcblxuXHRmdW5jdGlvbiByZXNldFBvc3RNZXRhTW9kYWwoKSB7XG5cdFx0JHBvc3RNZXRhT3B0aW9ucy5odG1sKCAnJyApO1xuXHRcdCRwb3N0TWV0YU1vZGFsTG9hZGVyLnJlbW92ZUNsYXNzKCAnYWN0aXZlJyApO1xuXHRcdCRub0tleUZvdW5kTWVzc2FnZS5yZW1vdmVDbGFzcyggJ2FjdGl2ZScgKTtcblx0XHQkcG9zdE1ldGFNb2RhbEZvb3Rlci5yZW1vdmVDbGFzcyggJ2FjdGl2ZScgKTtcblx0XHQkcG9zdE1ldGFPcHRpb25zTW9kYWwuZmluZCggJy5yZXBsYWNlLWN1cnJlbnQtb3B0aW9ucycgKS5wcm9wKCAnY2hlY2tlZCcsIGZhbHNlICk7XG5cdH1cblxuXHQvKipcblx0ICogQWpheCdzIHN1Y2Nlc3MgZnVuY3Rpb24uXG5cdCAqXG5cdCAqIEBwYXJhbSByZXNwb25zZVxuXHQgKi9cblx0ZnVuY3Rpb24gb2tDYWxsYmFjayggcmVzcG9uc2UgKSB7XG5cdFx0Ly8gSGlkZSB0aGUgbG9hZGluZyBhbmltYXRpb24uXG5cdFx0JHBvc3RNZXRhTW9kYWxMb2FkZXIucmVtb3ZlQ2xhc3MoICdhY3RpdmUnICk7XG5cdFx0JHBvc3RNZXRhTW9kYWxGb290ZXIuYWRkQ2xhc3MoICdhY3RpdmUnICk7XG5cblx0XHQkcG9zdE1ldGFPcHRpb25zLmh0bWwoIHJlc3BvbnNlICk7XG5cdH1cblxuXHQvKipcblx0ICogQWpheCdzIGVycm9yIGZ1bmN0aW9uLlxuXHQgKlxuXHQgKiBAcGFyYW0gbWVzc2FnZVxuXHQgKi9cblx0ZnVuY3Rpb24gZXJyQ2FsbGJhY2soIG1lc3NhZ2UgKSB7XG5cdFx0Y29uc29sZS5sb2coICdlcnJvcicsIG1lc3NhZ2UgKTtcblxuXHRcdC8vIEhpZGUgdGhlIGxvYWRpbmcgYW5pbWF0aW9uLlxuXHRcdCRwb3N0TWV0YU1vZGFsTG9hZGVyLnJlbW92ZUNsYXNzKCAnYWN0aXZlJyApO1xuXHR9XG5cblx0Ly8gQnJvd3NlIFZhbHVlc1xuXHQkc2VhcmNoRm9ybS5vbiggJ2NsaWNrJywgJy5icm93c2UtdmFsdWVzJywgZnVuY3Rpb24oKSB7XG5cdFx0cmVzZXRQb3N0TWV0YU1vZGFsKCk7XG5cblx0XHRjb25zdCAkZmllbGQgICAgICAgID0gJCggdGhpcyApLmNsb3Nlc3QoICcud2NhcGYtZm9ybS1maWVsZCcgKTtcblx0XHRjb25zdCAkaW5wdXRNZXRhS2V5ID0gJGZpZWxkLmZpbmQoICcud2NhcGYtZm9ybS1zdWItZmllbGQtbWV0YV9rZXkgc2VsZWN0JyApO1xuXHRcdGNvbnN0IG1ldGFLZXkgICAgICAgPSAkaW5wdXRNZXRhS2V5LnZhbCgpO1xuXG5cdFx0aWYgKCAhIG1ldGFLZXkgKSB7XG5cdFx0XHQkbm9LZXlGb3VuZE1lc3NhZ2UuYWRkQ2xhc3MoICdhY3RpdmUnICk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdCRub0tleUZvdW5kTWVzc2FnZS5yZW1vdmVDbGFzcyggJ2FjdGl2ZScgKTtcblx0XHR9XG5cblx0XHRwb3N0TWV0YU9wdGlvbnNNb2RhbEluc3RhbmNlLm9wZW4oKTtcblx0XHQkcG9zdE1ldGFGaWVsZCA9ICRmaWVsZDtcblxuXHRcdGlmICggISBtZXRhS2V5ICkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdC8vIFNob3cgdGhlIGxvYWRpbmcgYW5pbWF0aW9uLlxuXHRcdCRwb3N0TWV0YU1vZGFsTG9hZGVyLmFkZENsYXNzKCAnYWN0aXZlJyApO1xuXG5cdFx0Y29uc3QgZm9ybURhdGEgPSB7XG5cdFx0XHRrZXk6IG1ldGFLZXksXG5cdFx0XHRhY3Rpb246ICd3Y2FwZl9nZXRfbWV0YV9vcHRpb25zJyxcblx0XHR9XG5cblx0XHQvLyBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL2EvNTkxODEyNTJcblx0XHR3cC5hamF4LnBvc3QoIGZvcm1EYXRhICkuZG9uZSggb2tDYWxsYmFjayApLmZhaWwoIGVyckNhbGxiYWNrICk7XG5cdH0gKTtcblxuXHQvKipcblx0ICogUmVzZXQgdGhlIHBvc3QgbWV0YSBvcHRpb24ncyBtb2RhbCB3aGVuIG1vZGFsIGdldHMgY2xvc2VkLlxuXHQgKi9cblx0JCggZG9jdW1lbnQgKS5vbiggJ2Nsb3NlZCcsICRwb3N0TWV0YU9wdGlvbnNNb2RhbCwgZnVuY3Rpb24oKSB7XG5cdFx0cmVzZXRQb3N0TWV0YU1vZGFsKCk7XG5cdFx0JHBvc3RNZXRhRmllbGQgPSBudWxsO1xuXHR9ICk7XG5cblx0Ly8gVW5zZWxlY3QgYWxsIHZhbHVlcy5cblx0JHBvc3RNZXRhT3B0aW9uc01vZGFsLm9uKCAnY2xpY2snLCAnLnNlbGVjdC1ub25lJywgZnVuY3Rpb24oKSB7XG5cdFx0JHBvc3RNZXRhT3B0aW9ucy5maW5kKCAnW3R5cGU9XCJjaGVja2JveFwiXScgKS5wcm9wKCAnY2hlY2tlZCcsIGZhbHNlICk7XG5cdH0gKTtcblxuXHQvLyBTZWxlY3QgYWxsIHZhbHVlcy5cblx0JHBvc3RNZXRhT3B0aW9uc01vZGFsLm9uKCAnY2xpY2snLCAnLnNlbGVjdC1hbGwnLCBmdW5jdGlvbigpIHtcblx0XHQkcG9zdE1ldGFPcHRpb25zLmZpbmQoICdbdHlwZT1cImNoZWNrYm94XCJdJyApLnByb3AoICdjaGVja2VkJywgdHJ1ZSApO1xuXHR9ICk7XG5cblx0Ly8gQWRkIHNlbGVjdGVkIG9wdGlvbnMuXG5cdCRwb3N0TWV0YU9wdGlvbnNNb2RhbC5vbiggJ2NsaWNrJywgJy5hZGQtb3B0aW9ucycsIGZ1bmN0aW9uKCkge1xuXHRcdGNvbnN0ICRvcHRpb25zID0gJHBvc3RNZXRhT3B0aW9ucy5maW5kKCAnW3R5cGU9XCJjaGVja2JveFwiXScgKTtcblx0XHRsZXQgaXNSZXBsYWNlICA9IGZhbHNlO1xuXHRcdGxldCByb3dzICAgICAgID0gJyc7XG5cblx0XHRpZiAoICRwb3N0TWV0YU1vZGFsRm9vdGVyLmZpbmQoICcucmVwbGFjZS1jdXJyZW50LW9wdGlvbnMnICkuaXMoICc6Y2hlY2tlZCcgKSApIHtcblx0XHRcdGlzUmVwbGFjZSA9IHRydWU7XG5cdFx0fVxuXG5cdFx0aWYgKCAkb3B0aW9ucyApIHtcblx0XHRcdGNvbnN0IGZpZWxkVHlwZSA9ICd3Y2FwZi1wb3N0LW1ldGEtb3B0aW9uJztcblxuXHRcdFx0JC5lYWNoKCAkb3B0aW9ucywgZnVuY3Rpb24oIGksIGlucHV0ICkge1xuXHRcdFx0XHRjb25zdCAkaW5wdXQgPSAkKCBpbnB1dCApO1xuXHRcdFx0XHRjb25zdCB2YWx1ZSAgPSAkaW5wdXQudmFsKCk7XG5cblx0XHRcdFx0aWYgKCAkaW5wdXQuaXMoICc6Y2hlY2tlZCcgKSApIHtcblx0XHRcdFx0XHRjb25zdCB0ZW1wbGF0ZSA9IHdwLnRlbXBsYXRlKCBmaWVsZFR5cGUgKTtcblx0XHRcdFx0XHRjb25zdCByZW5kZXJlZCA9IHRlbXBsYXRlKCB7IHZhbHVlLCBsYWJlbDogdmFsdWUgfSApO1xuXG5cdFx0XHRcdFx0cm93cyArPSByZW5kZXJlZDtcblx0XHRcdFx0fVxuXHRcdFx0fSApO1xuXHRcdH1cblxuXHRcdGlmICggcm93cyApIHtcblx0XHRcdGNvbnN0ICR3cmFwcGVyID0gJHBvc3RNZXRhRmllbGQuZmluZCggJy5tYW51YWwtb3B0aW9ucy10YWJsZScgKTtcblx0XHRcdGNvbnN0ICRyb3dzICAgID0gJHBvc3RNZXRhRmllbGQuZmluZCggJy5tYW51YWwtb3B0aW9ucy10YWJsZS1ib2R5LXJvd3MnICk7XG5cblx0XHRcdGlmICggaXNSZXBsYWNlICkge1xuXHRcdFx0XHQkcm93cy5odG1sKCByb3dzICk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHQkcm93cy5hcHBlbmQoIHJvd3MgKTtcblx0XHRcdH1cblxuXHRcdFx0aWYgKCAhICR3cmFwcGVyLmhhc0NsYXNzKCAnaGFzLW9wdGlvbnMnICkgKSB7XG5cdFx0XHRcdCR3cmFwcGVyLmFkZENsYXNzKCAnaGFzLW9wdGlvbnMnICk7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0cG9zdE1ldGFPcHRpb25zTW9kYWxJbnN0YW5jZS5jbG9zZSgpO1xuXHR9ICk7XG5cblx0JHNlYXJjaEZvcm0ub24oICdhZnRlcl90b2dnbGVfcmVxdWVzdCcsIGZ1bmN0aW9uKCBlLCBoYW5kbGVyLCB2YWx1ZSwgJGZpZWxkICkge1xuXHRcdGlmICggJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1nZXRfb3B0aW9ucyBpbnB1dCcgPT09IGhhbmRsZXIgKSB7XG5cdFx0XHRjb25zdCAkc2VsZWN0RWxtICAgICAgID0gJGZpZWxkLmZpbmQoICcud2NhcGYtZm9ybS1zdWItZmllbGQtb3B0aW9uc19vcmRlcl9ieSBzZWxlY3QnICk7XG5cdFx0XHRjb25zdCBkZXBlbmRhbnRPcHRpb25zID0gJ29wdGlvblt2YWx1ZT1cImxhYmVsXCJdJztcblxuXHRcdFx0aWYgKCAnYXV0b21hdGljYWxseScgPT09IHZhbHVlICkge1xuXHRcdFx0XHQkc2VsZWN0RWxtLmNoaWxkcmVuKCBkZXBlbmRhbnRPcHRpb25zICkuYXR0ciggJ2Rpc2FibGVkJywgJ2Rpc2FibGVkJyApO1xuXHRcdFx0XHQkc2VsZWN0RWxtLnByb3AoICdzZWxlY3RlZEluZGV4JywgMSApLmNoYW5nZSgpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0JHNlbGVjdEVsbS5jaGlsZHJlbiggZGVwZW5kYW50T3B0aW9ucyApLnJlbW92ZUF0dHIoICdkaXNhYmxlZCcgKTtcblx0XHRcdFx0JHNlbGVjdEVsbS5wcm9wKCAnc2VsZWN0ZWRJbmRleCcsIDAgKS5jaGFuZ2UoKTtcblx0XHRcdH1cblx0XHR9XG5cdH0gKTtcblxufSApO1xuIiwiLyoqXG4gKiBUaGUgc2VhcmNoIGZvcm0gZmllbGQuXG4gKlxuICogQHNpbmNlICAgICAgMy4wLjBcbiAqIEBwYWNrYWdlICAgIHdjLWFqYXgtcHJvZHVjdC1maWx0ZXJcbiAqIEBzdWJwYWNrYWdlIHdjLWFqYXgtcHJvZHVjdC1maWx0ZXIvYWRtaW4vc3JjL2pzXG4gKiBAYXV0aG9yICAgICBNYWludWwgSGFzc2FuIE1haW5cbiAqL1xuXG5qUXVlcnkoIGRvY3VtZW50ICkucmVhZHkoIGZ1bmN0aW9uKCAkICkge1xuXG5cdGNvbnN0ICRzZWFyY2hGb3JtID0gJCggJyNzZWFyY2gtZm9ybScgKTtcblxuXHRjb25zdCBkZXBlbmRhbnREYXRhID0gW1xuXHRcdHtcblx0XHRcdCdoYW5kbGVyJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1kaXNwbGF5X3R5cGUgc2VsZWN0Jyxcblx0XHRcdCdoYW5kbGVyVHlwZSc6ICdzZWxlY3QnLFxuXHRcdFx0J2V2ZW50JzogJ2NoYW5nZScsXG5cdFx0XHQnZGVwZW5kYW50JzogW1xuXHRcdFx0XHR7XG5cdFx0XHRcdFx0J3NlbGVjdG9yJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1xdWVyeV90eXBlJyxcblx0XHRcdFx0XHQndmFsdWUnOiBbICdjaGVja2JveCcsICdtdWx0aS1zZWxlY3QnIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLWFsbF9pdGVtc19sYWJlbCcsXG5cdFx0XHRcdFx0J3ZhbHVlJzogWyAncmFkaW8nLCAnc2VsZWN0JyBdLFxuXHRcdFx0XHR9LFxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0J3NlbGVjdG9yJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC11c2VfY2hvc2VuJyxcblx0XHRcdFx0XHQndmFsdWUnOiBbICdzZWxlY3QnLCAnbXVsdGktc2VsZWN0JyBdLFxuXHRcdFx0XHR9LFxuXHRcdFx0XSxcblx0XHR9LFxuXHRcdHtcblx0XHRcdCdoYW5kbGVyJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC11c2VfY2hvc2VuIGlucHV0Jyxcblx0XHRcdCdoYW5kbGVyVHlwZSc6ICdjaGVja2JveCcsXG5cdFx0XHQnZXZlbnQnOiAnY2hhbmdlJyxcblx0XHRcdCdkZXBlbmRhbnQnOiBbXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLWNob3Nlbl9ub19yZXN1bHRzX21lc3NhZ2UnLFxuXHRcdFx0XHRcdCd2YWx1ZSc6IFsgJzEnIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRdLFxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0J2hhbmRsZXInOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLWdldF9vcHRpb25zIGlucHV0Jyxcblx0XHRcdCdoYW5kbGVyVHlwZSc6ICdyYWRpbycsXG5cdFx0XHQnZXZlbnQnOiAnY2hhbmdlJyxcblx0XHRcdCdkZXBlbmRhbnQnOiBbXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLm1hbnVhbC1vcHRpb25zLXRhYmxlJyxcblx0XHRcdFx0XHQndmFsdWUnOiBbICdtYW51YWxfZW50cnknIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRdLFxuXHRcdH0sXG5cdF07XG5cblx0ZnVuY3Rpb24gX3RyaWdnZXJEaXNwbGF5VHlwZUNoYW5nZSggdmFsdWUsICRmaWVsZCApIHtcblx0XHRjb25zdCAkbm9SZXN1bHRzICAgICA9ICRmaWVsZC5maW5kKCAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLWNob3Nlbl9ub19yZXN1bHRzX21lc3NhZ2UnICk7XG5cdFx0Y29uc3QgJGFsbEl0ZW1zTGFiZWwgPSAkZmllbGQuZmluZCggJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1hbGxfaXRlbXNfbGFiZWwnICk7XG5cdFx0Y29uc3QgdXNlQ2hvc2VuICAgICAgPSAkZmllbGQuZmluZCggJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC11c2VfY2hvc2VuIGlucHV0JyApLmlzKCAnOmNoZWNrZWQnICk7XG5cblx0XHRpZiAoIHVzZUNob3NlbiAmJiAoICdzZWxlY3QnID09PSB2YWx1ZSB8fCAnbXVsdGktc2VsZWN0JyA9PT0gdmFsdWUgKSApIHtcblx0XHRcdCRub1Jlc3VsdHMuc2hvdygpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHQkbm9SZXN1bHRzLmhpZGUoKTtcblx0XHR9XG5cblx0XHRpZiAoICggJ3JhZGlvJyA9PT0gdmFsdWUgfHwgJ3NlbGVjdCcgPT09IHZhbHVlICkgfHwgKCAnbXVsdGktc2VsZWN0JyA9PT0gdmFsdWUgJiYgdXNlQ2hvc2VuICkgKSB7XG5cdFx0XHQkYWxsSXRlbXNMYWJlbC5zaG93KCk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdCRhbGxJdGVtc0xhYmVsLmhpZGUoKTtcblx0XHR9XG5cdH1cblxuXHRmdW5jdGlvbiBfdHJpZ2dlclVzZVNlbGVjdENoYW5nZSggdmFsdWUsICRmaWVsZCApIHtcblx0XHRjb25zdCAkbm9SZXN1bHRzICAgICA9ICRmaWVsZC5maW5kKCAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLWNob3Nlbl9ub19yZXN1bHRzX21lc3NhZ2UnICk7XG5cdFx0Y29uc3QgJGFsbEl0ZW1zTGFiZWwgPSAkZmllbGQuZmluZCggJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1hbGxfaXRlbXNfbGFiZWwnICk7XG5cdFx0Y29uc3QgZGlzcGxheVR5cGUgICAgPSAkZmllbGQuZmluZCggJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1kaXNwbGF5X3R5cGUgc2VsZWN0JyApLnZhbCgpO1xuXG5cdFx0aWYgKCAnMScgPT09IHZhbHVlICYmICggJ3NlbGVjdCcgPT09IGRpc3BsYXlUeXBlIHx8ICdtdWx0aS1zZWxlY3QnID09PSBkaXNwbGF5VHlwZSApICkge1xuXHRcdFx0JG5vUmVzdWx0cy5zaG93KCk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdCRub1Jlc3VsdHMuaGlkZSgpO1xuXHRcdH1cblxuXHRcdGlmICggKCAnMScgPT09IHZhbHVlICYmICdtdWx0aS1zZWxlY3QnID09PSBkaXNwbGF5VHlwZSApIHx8ICggJ3JhZGlvJyA9PT0gZGlzcGxheVR5cGUgfHwgJ3NlbGVjdCcgPT09IGRpc3BsYXlUeXBlICkgKSB7XG5cdFx0XHQkYWxsSXRlbXNMYWJlbC5zaG93KCk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdCRhbGxJdGVtc0xhYmVsLmhpZGUoKTtcblx0XHR9XG5cdH1cblxuXHRmdW5jdGlvbiBfaGFuZGxlVG9nZ2xlUmVxdWVzdCggZGF0YSwgY3VycmVudFNlbGVjdG9yLCB2YWx1ZSApIHtcblx0XHRjb25zdCAkZmllbGQgICAgICA9IGN1cnJlbnRTZWxlY3Rvci5jbG9zZXN0KCAnLndjYXBmLWZvcm0tZmllbGQnICk7XG5cdFx0Y29uc3QgaGFuZGxlciAgICAgPSBkYXRhWyAnaGFuZGxlcicgXTtcblx0XHRjb25zdCBoYW5kbGVyVHlwZSA9IGRhdGFbICdoYW5kbGVyVHlwZScgXTtcblx0XHRjb25zdCBkZXBlbmRhbnQgICA9IGRhdGFbICdkZXBlbmRhbnQnIF07XG5cblx0XHRsZXQgX3ZhbHVlID0gdmFsdWU7XG5cblx0XHRpZiAoICdjaGVja2JveCcgPT09IGhhbmRsZXJUeXBlICkge1xuXHRcdFx0X3ZhbHVlID0gY3VycmVudFNlbGVjdG9yLmlzKCAnOmNoZWNrZWQnICkgPyAnMScgOiAnMCc7XG5cdFx0fVxuXG5cdFx0aWYgKCAncmFkaW8nID09PSBoYW5kbGVyVHlwZSApIHtcblx0XHRcdF92YWx1ZSA9ICRmaWVsZC5maW5kKCBoYW5kbGVyICsgJzpjaGVja2VkJyApLnZhbCgpO1xuXHRcdH1cblxuXHRcdCQuZWFjaCggZGVwZW5kYW50LCBmdW5jdGlvbiggaWQsIGQgKSB7XG5cdFx0XHRjb25zdCAkc2VsZWN0b3IgICA9ICRmaWVsZC5maW5kKCBkWyAnc2VsZWN0b3InIF0gKTtcblx0XHRcdGNvbnN0IHZhbGlkVmFsdWVzID0gZFsgJ3ZhbHVlJyBdO1xuXG5cdFx0XHRpZiAoIHZhbGlkVmFsdWVzLmluY2x1ZGVzKCBfdmFsdWUgKSApIHtcblx0XHRcdFx0JHNlbGVjdG9yLnNob3coKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdCRzZWxlY3Rvci5oaWRlKCk7XG5cdFx0XHR9XG5cdFx0fSApO1xuXG5cdFx0aWYgKCAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLWRpc3BsYXlfdHlwZSBzZWxlY3QnID09PSBoYW5kbGVyICkge1xuXHRcdFx0X3RyaWdnZXJEaXNwbGF5VHlwZUNoYW5nZSggX3ZhbHVlLCAkZmllbGQgKTtcblx0XHR9XG5cblx0XHRpZiAoICcud2NhcGYtZm9ybS1zdWItZmllbGQtdXNlX2Nob3NlbiBpbnB1dCcgPT09IGhhbmRsZXIgKSB7XG5cdFx0XHRfdHJpZ2dlclVzZVNlbGVjdENoYW5nZSggX3ZhbHVlLCAkZmllbGQgKTtcblx0XHR9XG5cblx0XHQkc2VhcmNoRm9ybS50cmlnZ2VyKCAnYWZ0ZXJfdG9nZ2xlX3JlcXVlc3QnLCBbIGhhbmRsZXIsIF92YWx1ZSwgJGZpZWxkIF0gKTtcblx0fVxuXG5cdGZ1bmN0aW9uIGhhbmRsZVRvZ2dsZVJlcXVlc3QoIGRhdGEsIGN1cnJlbnRTZWxlY3RvciwgdmFsdWUgKSB7XG5cdFx0aWYgKCBudWxsID09PSBjdXJyZW50U2VsZWN0b3IgKSB7XG5cdFx0XHRjb25zdCBoYW5kbGVyICA9IGRhdGFbICdoYW5kbGVyJyBdO1xuXHRcdFx0Y29uc3QgJGhhbmRsZXIgPSAkKCBoYW5kbGVyICk7XG5cblx0XHRcdCQuZWFjaCggJGhhbmRsZXIsIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRjb25zdCBfdGhpcyAgPSAkKCB0aGlzICk7XG5cdFx0XHRcdGNvbnN0IF92YWx1ZSA9IF90aGlzLnZhbCgpO1xuXHRcdFx0XHRfaGFuZGxlVG9nZ2xlUmVxdWVzdCggZGF0YSwgX3RoaXMsIF92YWx1ZSApO1xuXHRcdFx0fSApO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRfaGFuZGxlVG9nZ2xlUmVxdWVzdCggZGF0YSwgY3VycmVudFNlbGVjdG9yLCB2YWx1ZSApO1xuXHRcdH1cblx0fVxuXG5cdGZ1bmN0aW9uIHNldHVwU2VhcmNoRm9ybSggaW5pdGFsID0gZmFsc2UgKSB7XG5cdFx0JC5lYWNoKCBkZXBlbmRhbnREYXRhLCBmdW5jdGlvbiggaSwgZGF0YSApIHtcblx0XHRcdGNvbnN0IGhhbmRsZXIgPSBkYXRhWyAnaGFuZGxlcicgXTtcblx0XHRcdGNvbnN0IGV2ZW50ICAgPSBkYXRhWyAnZXZlbnQnIF07XG5cblx0XHRcdGhhbmRsZVRvZ2dsZVJlcXVlc3QoIGRhdGEsIG51bGwsIG51bGwgKTtcblxuXHRcdFx0aWYgKCBpbml0YWwgKSB7XG5cdFx0XHRcdCRzZWFyY2hGb3JtLm9uKCBldmVudCwgaGFuZGxlciwgZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0Y29uc3QgX3RoaXMgID0gJCggdGhpcyApO1xuXHRcdFx0XHRcdGNvbnN0IF92YWx1ZSA9ICQoIHRoaXMgKS52YWwoKTtcblx0XHRcdFx0XHRoYW5kbGVUb2dnbGVSZXF1ZXN0KCBkYXRhLCBfdGhpcywgX3ZhbHVlICk7XG5cdFx0XHRcdH0gKTtcblx0XHRcdH1cblx0XHR9ICk7XG5cdH1cblxuXHRzZXR1cFNlYXJjaEZvcm0oIHRydWUgKTtcblxuXHQkc2VhcmNoRm9ybS5vbiggJ2ZpZWxkX2FkZGVkJywgZnVuY3Rpb24oKSB7XG5cdFx0Ly8gVG9nZ2xlIHRoZSB2aXNpYmlsaXR5IG9mIHN1YmZpZWxkcy5cblx0XHRzZXR1cFNlYXJjaEZvcm0oKTtcblx0fSApO1xuXG59ICk7XG4iLCIvKipcbiAqIFRoZSBzZWFyY2ggZm9ybS5cbiAqXG4gKiBAc2luY2UgICAgICAzLjAuMFxuICogQHBhY2thZ2UgICAgd2MtYWpheC1wcm9kdWN0LWZpbHRlclxuICogQHN1YnBhY2thZ2Ugd2MtYWpheC1wcm9kdWN0LWZpbHRlci9hZG1pbi9zcmMvanNcbiAqIEBhdXRob3IgICAgIE1haW51bCBIYXNzYW4gTWFpblxuICovXG5cbmNvbnN0IHRvdGFsRmllbGRJbnN0YW5jZXMgPSBqUXVlcnkoICcjdG90YWxfZmllbGRfaW5zdGFuY2VzJyApO1xuXG5jb25zdCBzZWFyY2hGb3JtID0galF1ZXJ5KCAnI3NlYXJjaC1mb3JtJyApO1xuXG4vKipcbiAqIEFzc2lnbiBhIHVuaXF1ZSBpZCBieSByZXBsYWNpbmcgdGhlIHBsYWNlaG9sZGVyIGlkLlxuICovXG5mdW5jdGlvbiByZW1vdmVQbGFjZWhvbGRlciggdW5pcXVlSWQsIGVsZW1lbnRzLCBhdHRyICkge1xuXHRlbGVtZW50cy5lYWNoKFxuXHRcdGZ1bmN0aW9uKCkge1xuXHRcdFx0Y29uc3QgZWxlbWVudCA9IGpRdWVyeSggdGhpcyApO1xuXG5cdFx0XHRjb25zdCBvbGRWYWx1ZSA9IGVsZW1lbnQuYXR0ciggYXR0ciApO1xuXHRcdFx0Y29uc3QgbmV3VmFsdWUgPSBvbGRWYWx1ZS5yZXBsYWNlKCAnJSUnLCB1bmlxdWVJZCApO1xuXG5cdFx0XHRlbGVtZW50LmF0dHIoIGF0dHIsIG5ld1ZhbHVlICk7XG5cdFx0fVxuXHQpO1xufVxuXG4vKipcbiAqIEluc2VydCB0aGUgZmllbGQncyBzdWJmaWVsZHMuXG4gKi9cbmZ1bmN0aW9uIGluc2VydEZpZWxkU3ViRmllbGRzKCB1aSApIHtcblx0Ly8gSW5zZXJ0IHRoZSBmaWVsZCdzIHN1YmZpZWxkcyBpZiBub3QgYWxyZWFkeSBpbnNlcnRlZC5cblx0aWYgKCAhIHVpLml0ZW0uaGFzQ2xhc3MoICdzdWItZmllbGRzLXJlYWR5JyApICkge1xuXHRcdGNvbnN0IHR5cGUgICAgICA9IHVpLml0ZW0uYXR0ciggJ2RhdGEtZmllbGQtdHlwZScgKTtcblx0XHRjb25zdCB1bmlxdWVJZCAgPSBwYXJzZUludCggdG90YWxGaWVsZEluc3RhbmNlcy52YWwoKSApO1xuXHRcdGNvbnN0IGZpZWxkVHlwZSA9ICd3Y2FwZi1mb3JtLWZpZWxkLScgKyB0eXBlO1xuXG5cdFx0Ly8gQmFpbCBvdXQgaWYgbm8gdG1wbCBmb3VuZCBmb3IgdGhlIHR5cGUuXG5cdFx0aWYgKCAhIGpRdWVyeSggJyN0bXBsLScgKyBmaWVsZFR5cGUgKS5sZW5ndGggKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0Ly8gSW5jcmVtZW50IHRoZSB2YWx1ZSBvZiB0b3RhbCBmaWVsZCBpbnN0YW5jZXMuXG5cdFx0dG90YWxGaWVsZEluc3RhbmNlcy52YWwoIHVuaXF1ZUlkICsgMSApO1xuXG5cdFx0Y29uc3QgdGVtcGxhdGUgPSB3cC50ZW1wbGF0ZSggZmllbGRUeXBlICk7XG5cdFx0Y29uc3QgcmVuZGVyZWQgPSB0ZW1wbGF0ZSgpO1xuXHRcdGNvbnN0IHdyYXBwZXIgID0gdWkuaXRlbS5maW5kKCAnLndpZGdldC1jb250ZW50JyApO1xuXG5cdFx0d3JhcHBlci5wcmVwZW5kKCByZW5kZXJlZCApO1xuXG5cdFx0Ly8gVXBkYXRlIHRoZSBmb3IgYXR0cmlidXRlcyBvZiB0aGUgbGFiZWxzLlxuXHRcdHJlbW92ZVBsYWNlaG9sZGVyKCB1bmlxdWVJZCwgdWkuaXRlbS5maW5kKCAnbGFiZWxbZm9yXj1cIndjYXBmLWlucHV0LVwiXScgKSwgJ2ZvcicgKTtcblxuXHRcdC8vIFVwZGF0ZSB0aGUgaWRzIG9mIHRoZSBpbnB1dCBlbGVtZW50cy5cblx0XHRyZW1vdmVQbGFjZWhvbGRlciggdW5pcXVlSWQsIHVpLml0ZW0uZmluZCggJypbaWRePVwid2NhcGYtaW5wdXQtXCJdJyApLCAnaWQnICk7XG5cblx0XHQvLyBVcGRhdGUgdGhlIG5hbWVzIG9mIHRoZSBpbnB1dCBlbGVtZW50cy5cblx0XHRyZW1vdmVQbGFjZWhvbGRlciggdW5pcXVlSWQsIHVpLml0ZW0uZmluZCggJypbaWRePVwid2NhcGYtaW5wdXQtXCJdJyApLCAnbmFtZScgKTtcblxuXHRcdC8vIFVwZGF0ZSB0aGUgcG9zaXRpb24gdmFsdWUuXG5cdFx0cmVtb3ZlUGxhY2Vob2xkZXIoIHVuaXF1ZUlkLCB1aS5pdGVtLmZpbmQoICcqW2lkXj1cIndjYXBmLWlucHV0LXBvc2l0aW9uLVwiXScgKSwgJ3ZhbHVlJyApO1xuXG5cdFx0dWkuaXRlbS5hZGRDbGFzcyggJ3N1Yi1maWVsZHMtcmVhZHknICk7XG5cblx0XHRzZWFyY2hGb3JtLnRyaWdnZXIoICdmaWVsZF9hZGRlZCcsIFsgdWkgXSApO1xuXHR9XG59XG5cbi8qKlxuICogVXBkYXRlIHRoZSBmb3JtIGZpZWxkJ3MgcG9zaXRpb24gYWZ0ZXIgc29ydC5cbiAqXG4gKiBAc291cmNlIGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vYS8xNDczNjc3NVxuICovXG5mdW5jdGlvbiB1cGRhdGVGaWVsZHNQb3NpdGlvbigpIHtcblx0Y29uc3QgaW5wdXRzICA9IHNlYXJjaEZvcm0uZmluZCggJypbaWRePVwid2NhcGYtaW5wdXQtcG9zaXRpb24tXCJdJyApO1xuXHRjb25zdCBuYkVsZW1zID0gaW5wdXRzLmxlbmd0aDtcblxuXHRpbnB1dHMuZWFjaChcblx0XHRmdW5jdGlvbiggaWR4ICkge1xuXHRcdFx0alF1ZXJ5KCB0aGlzICkudmFsKCBuYkVsZW1zIC0gKCBuYkVsZW1zIC0gaWR4ICkgKTtcblx0XHR9XG5cdCk7XG59XG5cbi8qKlxuICogTWFrZSB0aGUgZmllbGQgcmVhZHksIHJlbW92ZSBzdHlsZXMgY29tZXMgZnJvbSBqcXVlcnktdWktc29ydGFibGUgcGx1Z2luLCBpbnNlcnQgdGhlIGZpZWxkJ3Mgc3ViZmllbGRzIGV0Yy5cbiAqL1xuZnVuY3Rpb24gbWFrZUZpZWxkUmVhZHkoIGUsIHVpICkge1xuXHQvLyBSZW1vdmUgc3R5bGVzIGNvbWVzIGZyb20ganF1ZXJ5LXVpLXNvcnRhYmxlIHBsdWdpbi5cblx0dWkuaXRlbS5yZW1vdmVBdHRyKCAnc3R5bGUnICk7XG5cblx0aW5zZXJ0RmllbGRTdWJGaWVsZHMoIHVpICk7XG5cblx0dXBkYXRlRmllbGRzUG9zaXRpb24oKTtcblxuXHRjb25zdCB0b2dnbGVCdG4gPSB1aS5pdGVtLmZpbmQoICcud2lkZ2V0LWFjdGlvbicgKTtcblxuXHQvLyBFeHBhbmQgdGhlIGZvcm0gZmllbGQgYWZ0ZXIgc29ydC5cblx0aWYgKCAnZmFsc2UnID09PSB0b2dnbGVCdG4uYXR0ciggJ2FyaWEtZXhwYW5kZWQnICkgKSB7XG5cdFx0dG9nZ2xlQnRuLnRyaWdnZXIoICdjbGljaycgKTtcblx0fVxufVxuXG4vKipcbiAqIEluc3RhbnRpYXRlIHNvcnRhYmxlIGZvciB0aGUgZm9ybSBmaWVsZHMuXG4gKi9cbmZ1bmN0aW9uIHNvcnRhYmxlKCBpZGVudGlmaWVyICkge1xuXHRjb25zdCBjb250YWluZXIgPSBqUXVlcnkoIGlkZW50aWZpZXIgKTtcblxuXHRjb250YWluZXIuc29ydGFibGUoXG5cdFx0e1xuXHRcdFx0b3BhY2l0eTogMC44LFxuXHRcdFx0cmV2ZXJ0OiBmYWxzZSxcblx0XHRcdGN1cnNvcjogJ21vdmUnLFxuXHRcdFx0YXhpczogJ3knLFxuXHRcdFx0aGFuZGxlOiAnLndpZGdldC10b3AnLFxuXHRcdFx0Y2FuY2VsOiAnLndpZGdldC10aXRsZS1hY3Rpb24nLFxuXHRcdFx0aXRlbXM6ICcud2lkZ2V0Jyxcblx0XHRcdHBsYWNlaG9sZGVyOiAnd2lkZ2V0LXBsYWNlaG9sZGVyJyxcblx0XHRcdGNvbm5lY3RXaXRoOiAnI3NlYXJjaC1mb3JtLXdyYXBwZXInLFxuXHRcdFx0c3RvcDogbWFrZUZpZWxkUmVhZHksXG5cdFx0XHRzdGFydDogZnVuY3Rpb24oIGUsIHVpICkge1xuXHRcdFx0XHQvLyBJZiBpdCBpcyBnZXR0aW5nIGFwcGVuZGVkIHRvIHRoZSB3cm9uZyBwbGFjZSwgdGhlbiBmb3JjZSBpdCBpbnRvIHRoZSByaWdodCBjb250YWluZXIuXG5cdFx0XHRcdHVpLnBsYWNlaG9sZGVyLmFwcGVuZFRvKCB1aS5wbGFjZWhvbGRlci5wYXJlbnQoKS5maW5kKCAnLmluc2lkZSAjc2VhcmNoLWZvcm0td3JhcHBlcicgKSApO1xuXHRcdFx0fVxuXHRcdH1cblx0KTtcbn1cblxuc29ydGFibGUoICcjc2VhcmNoLWZvcm0nICk7XG5cbi8qKlxuICogUnVuIGZ1bmN0aW9uIHdoZW4gZHJhZyBzdGFydHMuXG4gKi9cbmZ1bmN0aW9uIG9uRHJhZ1N0YXJ0KCkge1xuXHRzZWFyY2hGb3JtLmFkZENsYXNzKCAndWktZHJvcC1hY3RpdmUnICk7XG59XG5cbi8qKlxuICogUnVuIGZ1bmN0aW9uIGF0IGRyYWcgc3RvcC5cbiAqL1xuZnVuY3Rpb24gb25EcmFnU3RvcCgpIHtcblx0c2VhcmNoRm9ybS5yZW1vdmVDbGFzcyggJ3VpLWRyb3AtYWN0aXZlJyApO1xufVxuXG4vKipcbiAqIEluaXRpYWxpemUgZHJhZ2dhYmxlIGZvciB0aGUgZm9ybSBmaWVsZHMuXG4gKi9cbmpRdWVyeSggJyNhdmFpbGFibGUtZmllbGRzIC53aWRnZXQnICkuZHJhZ2dhYmxlKFxuXHR7XG5cdFx0Y29ubmVjdFRvU29ydGFibGU6ICcjc2VhcmNoLWZvcm0nLFxuXHRcdGhlbHBlcjogJ2Nsb25lJyxcblx0XHRzdGFydDogb25EcmFnU3RhcnQsXG5cdFx0c3RvcDogb25EcmFnU3RvcCxcblx0fVxuKTtcblxuLyoqXG4gKiBUb2dnbGUgdGhlIGZvcm0gZmllbGQuXG4gKi9cbmZ1bmN0aW9uIHRvZ2dsZUZpZWxkKCBlICkge1xuXHRjb25zdCB0YXJnZXQgICAgICAgPSBlLnRhcmdldDtcblx0Y29uc3Qgd2lkZ2V0ICAgICAgID0galF1ZXJ5KCB0aGlzICkuY2xvc2VzdCggJy53aWRnZXQnICk7XG5cdGNvbnN0IHRvZ2dsZUJ0biAgICA9IHdpZGdldC5maW5kKCAnLndpZGdldC1hY3Rpb24nICk7XG5cdGNvbnN0IGluc2lkZSAgICAgICA9IHdpZGdldC5jaGlsZHJlbiggJy53aWRnZXQtaW5zaWRlJyApO1xuXHRjb25zdCBpc0V4cGFuZCAgICAgPSB0b2dnbGVCdG4uYXR0ciggJ2FyaWEtZXhwYW5kZWQnICk7XG5cdGNvbnN0IHRvZ2dsZUV4cGFuZCA9ICd0cnVlJyA9PT0gaXNFeHBhbmQgPyAnZmFsc2UnIDogJ3RydWUnO1xuXG5cdHRvZ2dsZUJ0bi5hdHRyKCAnYXJpYS1leHBhbmRlZCcsIHRvZ2dsZUV4cGFuZCApO1xuXHRqUXVlcnkoIGluc2lkZSApLnNsaWRlVG9nZ2xlKFxuXHRcdCdmYXN0Jyxcblx0XHRmdW5jdGlvbigpIHtcblx0XHRcdHdpZGdldC50b2dnbGVDbGFzcyggJ29wZW4nICk7XG5cdFx0XHRzZWFyY2hGb3JtLnRyaWdnZXIoICd3aWRnZXQtY2xvc2VkJywgWyB0YXJnZXQgXSApO1xuXHRcdH1cblx0KTtcbn1cblxuc2VhcmNoRm9ybS5vbiggJ2NsaWNrJywgJy53aWRnZXQtdG9wJywgdG9nZ2xlRmllbGQgKTtcbnNlYXJjaEZvcm0ub24oICdjbGljaycsICcud2lkZ2V0LWNvbnRyb2wtY2xvc2UnLCB0b2dnbGVGaWVsZCApO1xuXG4vKipcbiAqIEZvY3VzIHRoZSBmb3JtIGZpZWxkJ3MgZXhwYW5kIGJ1dHRvbi5cbiAqL1xuZnVuY3Rpb24gZm9jdXNGaWVsZCggZSwgdGFyZ2V0ICkge1xuXHRpZiAoIHRhcmdldC5jbGFzc0xpc3QuY29udGFpbnMoICd3aWRnZXQtY29udHJvbC1jbG9zZScgKSApIHtcblx0XHRjb25zdCB3aWRnZXQgPSBqUXVlcnkoIHRhcmdldCApLmNsb3Nlc3QoICcud2lkZ2V0JyApO1xuXHRcdGNvbnN0IGFjdGlvbiA9IHdpZGdldC5maW5kKCAnLndpZGdldC1hY3Rpb24nICk7XG5cblx0XHRhY3Rpb24uYXR0ciggJ2FyaWEtZXhwYW5kZWQnLCAnZmFsc2UnICkuZm9jdXMoKTtcblx0fVxufVxuXG5zZWFyY2hGb3JtLm9uKCAnd2lkZ2V0LWNsb3NlZCcsIGZvY3VzRmllbGQgKTtcblxuLyoqXG4gKiBSZW1vdmUgdGhlIGZpZWxkLlxuICovXG5mdW5jdGlvbiByZW1vdmVGaWVsZCgpIHtcblx0Y29uc3Qgd2lkZ2V0ID0galF1ZXJ5KCB0aGlzICkuY2xvc2VzdCggJy53aWRnZXQnICk7XG5cblx0alF1ZXJ5KCB3aWRnZXQgKS5zbGlkZVVwKFxuXHRcdCdmYXN0Jyxcblx0XHRmdW5jdGlvbigpIHtcblx0XHRcdHdpZGdldC5yZW1vdmUoKTtcblx0XHRcdHVwZGF0ZUZpZWxkc1Bvc2l0aW9uKCk7XG5cdFx0fVxuXHQpO1xufVxuXG5zZWFyY2hGb3JtLm9uKCAnY2xpY2snLCAnLndpZGdldC1jb250cm9sLXJlbW92ZScsIHJlbW92ZUZpZWxkICk7XG5cbi8qKlxuICogU3RvcmUgdGhlIGluaXRpYWwgZm9ybSBkYXRhIGludG8gYSB2YXJpYWJsZSBzbyB0aGF0IHdlIGNhbiBjb21wYXJlIGl0IHdoZW4gbGVhdmluZyB0aGUgcGFnZS5cbiAqL1xubGV0IGluaXRpYWxGb3JtU3RhdGUgPSBzZWFyY2hGb3JtLnNlcmlhbGl6ZUFycmF5KCk7XG5cbi8qKlxuICogU2hvdyBtZXNzYWdlIGFmdGVyIGZvcm0gc3VibWlzc2lvbi5cbiAqL1xuZnVuY3Rpb24gc2hvd01lc3NhZ2UoIG1lc3NhZ2UsIHR5cGUgPSAnc3VjY2VzcycgKSB7XG5cdGNvbnN0IGVsZW1lbnQgPSBqUXVlcnkoICc8cCBjbGFzcz1cIicgKyB0eXBlICsgJ1wiPicgKyBtZXNzYWdlICsgJzwvcD4nICk7XG5cdGNvbnN0IHdyYXBwZXIgPSBqUXVlcnkoICcud2NhcGYtbWVzc2FnZS13cmFwcGVyJyApO1xuXG5cdGlmICggISB3cmFwcGVyLmlzKCAnOmVtcHR5JyApICkge1xuXHRcdHJldHVybjtcblx0fVxuXG5cdGpRdWVyeSggd3JhcHBlciApLmh0bWwoIGVsZW1lbnQgKS5zbGlkZURvd24oICdmYXN0JyApO1xuXG5cdHNldFRpbWVvdXQoXG5cdFx0ZnVuY3Rpb24oKSB7XG5cdFx0XHRqUXVlcnkoIHdyYXBwZXIgKS5zbGlkZVVwKCAnZmFzdCcgKTtcblx0XHRcdHdyYXBwZXIuaHRtbCggJycgKTtcblx0XHR9LFxuXHRcdDMwMDBcblx0KTtcbn1cblxuLyoqXG4gKiBTYXZlIHRoZSBzZWFyY2ggZm9ybS5cbiAqL1xuZnVuY3Rpb24gc2F2ZUZvcm0oKSB7XG5cdGNvbnN0IGJ1dHRvbiAgID0galF1ZXJ5KCB0aGlzICk7XG5cdGNvbnN0IGZvcm1EYXRhID0gc2VhcmNoRm9ybS5zZXJpYWxpemVBcnJheSgpO1xuXG5cdGJ1dHRvbi5hdHRyKCAnZGlzYWJsZWQnLCAnZGlzYWJsZWQnICk7XG5cblx0ZnVuY3Rpb24gb2tDYWxsYmFjayggbWVzc2FnZSApIHtcblx0XHRidXR0b24ucmVtb3ZlQXR0ciggJ2Rpc2FibGVkJyApO1xuXG5cdFx0Ly8gVXBkYXRlIHRoZSBpbml0aWFsIGZvcm0gZGF0YSBhZnRlciBzdWNjZXNzZnVsbHkgc2F2aW5nIHRoZSBmb3JtLlxuXHRcdGluaXRpYWxGb3JtU3RhdGUgPSBmb3JtRGF0YTtcblxuXHRcdHNob3dNZXNzYWdlKCBtZXNzYWdlICk7XG5cdH1cblxuXHRmdW5jdGlvbiBlcnJDYWxsYmFjayggbWVzc2FnZSApIHtcblx0XHRidXR0b24ucmVtb3ZlQXR0ciggJ2Rpc2FibGVkJyApO1xuXHRcdHNob3dNZXNzYWdlKCBtZXNzYWdlLCAnZXJyb3InICk7XG5cdH1cblxuXHQvLyBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL2EvNTkxODEyNTJcblx0d3AuYWpheC5wb3N0KCBmb3JtRGF0YSApLmRvbmUoIG9rQ2FsbGJhY2sgKS5mYWlsKCBlcnJDYWxsYmFjayApO1xufVxuXG5qUXVlcnkoICcjcG9zdGJveC1jb250YWluZXItMScgKS5vbiggJ2NsaWNrJywgJ2J1dHRvbicsIHNhdmVGb3JtICk7XG5cbi8qKlxuICogU2hvdyBhbGVydCBvbiBsZWF2ZSBpZiB0aGUgZm9ybSBpcyBkaXJ0eS5cbiAqXG4gKiBUT0RPOiBVbmNvbW1lbnQgdGhpcy5cbiAqL1xuLy8gd2luZG93Lm9uYmVmb3JldW5sb2FkID0gZnVuY3Rpb24oKSB7XG4vLyBcdGNvbnN0IG5ld0Zvcm1TdGF0ZSA9IHNlYXJjaEZvcm0uc2VyaWFsaXplQXJyYXkoKTtcbi8vXG4vLyBcdGNvbnN0IGlzRm9ybURpcnR5ID0gISBfLmlzRXF1YWwoIG5ld0Zvcm1TdGF0ZSwgaW5pdGlhbEZvcm1TdGF0ZSApO1xuLy9cbi8vIFx0aWYgKCBpc0Zvcm1EaXJ0eSApIHtcbi8vIFx0XHRyZXR1cm4gJyc7XG4vLyBcdH1cbi8vIH07XG4iXX0=
