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
  $searchForm.on('after_toggle_request', function (e, handler, value, $field) {
    if ('.wcapf-form-sub-field-custom-taxonomy select' === handler) {
      var params = window['wcapf_admin_params'];
      var hierarchicalData = params['taxonomy_hierarchical_data'];

      if (!hierarchicalData) {
        return;
      }

      var isHierarchical = hierarchicalData[value];
      var $dependantFields = $field.find('.wcapf-form-sub-field-hierarchical, .wcapf-form-sub-field-show_children_only');

      if (isHierarchical) {
        $dependantFields.show();
      } else {
        $dependantFields.hide();
      }
    }
  });

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


  initSortableForManualOptions($searchForm.find('.manual-options-table .manual-options-table-body-rows'));
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
    var $optionsTable = $field.find('.manual-options-table');
    $optionsTable.find('.manual-options-table-body-rows').empty();
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
    var $valueHolder = $postMetaField.find('.wcapf-form-sub-field-manual_options input');
    var $optionsTable = $postMetaField.find('.manual-options-table');
    var $rows = $optionsTable.find('.manual-options-table-body-rows');
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
      var $rows = $wrapper.find('.manual-options-table-body-rows');

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

  function disableOrderByOptions($elm) {
    var value = $elm.val();
    var $wrapper = $elm.closest('.wcapf-post-meta-order-options-field');
    var $orderDirectionField = $wrapper.find('.wcapf-form-sub-field-options_order_dir select');
    var $orderTypeField = $wrapper.find('.wcapf-form-sub-field-options_order_type select');

    if ('none' === value) {
      $orderDirectionField.attr('disabled', 'disabled');
      $orderTypeField.attr('disabled', 'disabled');
    } else {
      $orderDirectionField.removeAttr('disabled');
      $orderTypeField.removeAttr('disabled');
    }
  }

  $searchForm.find('.wcapf-form-sub-field-options_order_by select').each(function () {
    var $this = $(this);
    disableOrderByOptions($this);
  });
  $searchForm.on('change', '.wcapf-form-sub-field-options_order_by select', function () {
    var $this = $(this);
    disableOrderByOptions($this);
  });
  $searchForm.on('input', '.manual-options-table input[type="text"]', function () {
    var $field = $(this).closest('.wcapf-form-field');
    triggerManualOptionsChange($field);
  });
  /**
   * Value type 'Number'
   */

  function initSortableForNumberManualOptions($selector) {
    $selector.sortable({
      opacity: 0.8,
      revert: false,
      cursor: 'move',
      axis: 'y',
      handle: '.move-options-handler',
      placeholder: 'widget-placeholder',
      update: function update(e) {
        var $field = $(e.target).closest('.wcapf-form-field');
        triggerNumberManualOptionsChange($field);
      }
    }).disableSelection();
  } // Sort Number Manual Options


  initSortableForNumberManualOptions($searchForm.find('.number-manual-options-table .manual-options-table-body-rows'));
  $searchForm.on('field_added', function (e, ui) {
    // Init Sortable for the number manual options.
    initSortableForNumberManualOptions($(ui.item.find('.manual-options-table-body-rows')));
  });

  function triggerRemoveNumberOption($field) {
    var $optionsTable = $field.find('.number-manual-options-table');
    var tableRows = $optionsTable.find('.manual-options-table-body-rows').children();

    if (2 > tableRows.length) {
      $optionsTable.removeClass('has-options');
    }
  }

  function triggerNumberManualOptionsChange($postMetaField) {
    var $valueHolder = $postMetaField.find('.wcapf-form-sub-field-number_manual_options input');
    var $optionsTable = $postMetaField.find('.number-manual-options-table');
    var $rows = $optionsTable.find('.manual-options-table-body-rows');
    var _rows = [];
    $rows.find('.item').each(function (i, _item) {
      var $item = $(_item);
      var min_value = $item.find('.option_min_value').val();
      var max_value = $item.find('.option_max_value').val();
      var label = $item.find('.option_label').val();

      if (min_value && max_value && label) {
        _rows.push([min_value, max_value, label]);
      }
    });
    var rawValues = encodeURIComponent(JSON.stringify(_rows));
    $valueHolder.val(rawValues);
  } // Remove Single Number Option


  $searchForm.on('click', '.remove-number-option', function () {
    var $item = $(this).closest('.item');
    var $field = $item.closest('.wcapf-form-field');
    triggerRemoveNumberOption($field);
    $item.remove();
    triggerNumberManualOptionsChange($field);
  }); // Clear All Options

  $searchForm.on('click', '.clear-all-number-options', function () {
    var $field = $(this).closest('.wcapf-form-field');
    var $optionsTable = $field.find('.number-manual-options-table');
    $optionsTable.find('.manual-options-table-body-rows').empty();
    triggerRemoveNumberOption($field);
    triggerNumberManualOptionsChange($field);
  }); // Add New Option

  $searchForm.on('click', '.add-number-option', function () {
    var fieldType = 'wcapf-post-meta-type-number-option'; // Bail out if no tmpl found for the type.

    if (!jQuery('#tmpl-' + fieldType).length) {
      return;
    }

    var $field = $(this).closest('.wcapf-form-field');
    var template = wp.template(fieldType);
    var rendered = template({
      value: '',
      label: ''
    });
    var $wrapper = $field.find('.number-manual-options-table');
    var $rows = $wrapper.find('.manual-options-table-body-rows');
    $rows.append(rendered);

    if (!$wrapper.hasClass('has-options')) {
      $wrapper.addClass('has-options');
    }
  });
  $searchForm.on('input', '.number-manual-options-table input[type="text"]', function () {
    var $field = $(this).closest('.wcapf-form-field');
    triggerNumberManualOptionsChange($field);
  });
  $searchForm.on('after_toggle_request', function (e, handler, value, $field) {
    if ('.wcapf-form-sub-field-number_display_type select' === handler) {
      var $getOptions = $field.find('.number-get-options');
      var $autoOptions = $field.find('.number-automatic-options');
      var $manualOptionsTable = $field.find('.number-manual-options-table');
      var $elm = $field.find(handler);
      var displayType = $elm.val();

      if ('range_slider' === displayType || 'range_number' === displayType) {
        $getOptions.hide();
        $manualOptionsTable.addClass('force-hide');
        $autoOptions.addClass('force-show');
      } else {
        $getOptions.show();
        $manualOptionsTable.removeClass('force-hide');
        $autoOptions.removeClass('force-show');
      }
    }
  });

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
  }); // Toggle soft limit fields when display type is changed.

  $searchForm.on('after_toggle_request', function (e, handler, value, $field) {
    if ('.wcapf-form-sub-field-display_type select' === handler) {
      var $softLimitFields = $field.find('.soft-limit-fields');
      var $valueTypeField = $field.find('.wcapf-form-sub-field-value_type select');
      var valueType = $valueTypeField.val();
      var displayTypes = ['checkbox', 'radio'];

      if ($valueTypeField.length) {
        if ('text' === valueType) {
          if (displayTypes.includes(value)) {
            $softLimitFields.show();
          } else {
            $softLimitFields.hide();
          }
        }
      } else {
        if (displayTypes.includes(value)) {
          $softLimitFields.show();
        } else {
          $softLimitFields.hide();
        }
      }
    }
  }); // Toggle soft limit fields when number display type is changed.

  $searchForm.on('after_toggle_request', function (e, handler, value, $field) {
    if ('.wcapf-form-sub-field-number_display_type select' === handler) {
      var $softLimitFields = $field.find('.soft-limit-fields');
      var $valueTypeField = $field.find('.wcapf-form-sub-field-value_type select');
      var valueType = $valueTypeField.val();
      var displayTypes = ['range_checkbox', 'range_radio'];

      if ($valueTypeField.length) {
        if ('number' === valueType) {
          if (displayTypes.includes(value)) {
            $softLimitFields.show();
          } else {
            $softLimitFields.hide();
          }
        }
      } else {
        if (displayTypes.includes(value)) {
          $softLimitFields.show();
        } else {
          $softLimitFields.hide();
        }
      }
    }
  }); // Toggle soft limit fields when value type is changed.

  $searchForm.on('after_toggle_request', function (e, handler, value, $field) {
    if ('.wcapf-form-sub-field-value_type select' === handler) {
      var $softLimitFields = $field.find('.soft-limit-fields');
      var $numberDisplayTypeField = $field.find('.wcapf-form-sub-field-number_display_type select');
      var numberDisplayType = $numberDisplayTypeField.val();
      var numberDisplayTypes = ['range_checkbox', 'range_radio'];
      var $textDisplayTypeField = $field.find('.wcapf-form-sub-field-display_type select');
      var textDisplayType = $textDisplayTypeField.val();
      var textDisplayTypes = ['checkbox', 'radio'];

      if ('number' === value) {
        if (numberDisplayTypes.includes(numberDisplayType)) {
          $softLimitFields.show();
        } else {
          $softLimitFields.hide();
        }
      } else if ('text' === value) {
        if (textDisplayTypes.includes(textDisplayType)) {
          $softLimitFields.show();
        } else {
          $softLimitFields.hide();
        }
      } else if ('date' === value) {
        $softLimitFields.hide();
      } else {
        $softLimitFields.hide();
      }
    }
  }); // Set the value type when post property changed.

  $searchForm.on('after_toggle_request', function (e, handler, value, $field) {
    if ('.wcapf-form-sub-field-post_property select' === handler) {
      var $valueType = $field.find('.wcapf-form-sub-field-value_type select');
      var params = window['wcapf_admin_params'];
      var postPropertyData = params['post_property_data'];

      if (!postPropertyData) {
        return;
      }

      var valueType = postPropertyData[value];

      if (!valueType) {
        valueType = '';
      }

      $valueType.val(valueType).change();
    }
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
jQuery(document).ready(function ($) {
  var $searchForm = $('#search-form');

  function triggerProductStatusOptionsChange($field) {
    var $valueHolder = $field.find('.wcapf-form-sub-field-product_status_options input');
    var $optionsTable = $field.find('.product-status-options-table');
    var $rows = $optionsTable.find('.manual-options-table-body-rows');
    var _rows = [];
    $rows.find('.item').each(function (i, _item) {
      var $item = $(_item);
      var value = $item.find('.option_value').val();
      var label = $item.find('.option_label').val();
      console.log('value', value);
      console.log('label', label);

      if (value) {
        _rows.push([value, label]);
      }
    });
    var rawValues = encodeURIComponent(JSON.stringify(_rows));
    $valueHolder.val(rawValues);
  }

  function initSortableForProductStatusOptions($selector) {
    $selector.sortable({
      opacity: 0.8,
      revert: false,
      cursor: 'move',
      axis: 'y',
      handle: '.move-options-handler',
      placeholder: 'widget-placeholder',
      update: function update(e) {
        var $field = $(e.target).closest('.wcapf-form-field');
        triggerProductStatusOptionsChange($field);
      }
    }).disableSelection();
  } // Sort Manual Options


  initSortableForProductStatusOptions($searchForm.find('.product-status-options-table .manual-options-table-body-rows'));
  $searchForm.on('field_added', function (e, ui) {
    // Init Sortable for the manual options.
    initSortableForProductStatusOptions($(ui.item.find('.manual-options-table-body-rows')));
  });

  function triggerRemoveProductStatusOption($field) {
    var $optionsTable = $field.find('.product-status-options-table');
    var tableRows = $optionsTable.find('.manual-options-table-body-rows').children();

    if (2 > tableRows.length) {
      $optionsTable.removeClass('has-options');
    }
  } // Remove Single Number Option


  $searchForm.on('click', '.remove-product-status-option', function () {
    var $item = $(this).closest('.item');
    var $field = $item.closest('.wcapf-form-field');
    triggerRemoveProductStatusOption($field);
    $item.remove();
    triggerProductStatusOptionsChange($field);
  }); // Clear All Options

  $searchForm.on('click', '.clear-all-product-status-options', function () {
    var $field = $(this).closest('.wcapf-form-field');
    var $optionsTable = $field.find('.product-status-options-table');
    $optionsTable.find('.manual-options-table-body-rows').empty();
    triggerRemoveProductStatusOption($field);
    triggerProductStatusOptionsChange($field);
  }); // Add New Option

  $searchForm.on('click', '.add-product-status-option', function () {
    var fieldType = 'wcapf-product-status-option'; // Bail out if no tmpl found for the type.

    if (!jQuery('#tmpl-' + fieldType).length) {
      return;
    }

    var $field = $(this).closest('.wcapf-form-field');
    var template = wp.template(fieldType);
    var rendered = template({
      value: '',
      label: ''
    });
    var $wrapper = $field.find('.product-status-options-table');
    var $rows = $wrapper.find('.manual-options-table-body-rows');
    $rows.append(rendered);
    triggerProductStatusOptionsChange($field);

    if (!$wrapper.hasClass('has-options')) {
      $wrapper.addClass('has-options');
    }
  });
  $searchForm.on('input', '.product-status-options-table input[type="text"]', function () {
    var $field = $(this).closest('.wcapf-form-field');
    triggerProductStatusOptionsChange($field);
  });
  $searchForm.on('change', '.product-status-options-table .option_value', function () {
    var $field = $(this).closest('.wcapf-form-field');
    triggerProductStatusOptionsChange($field);
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
    'handler': '.wcapf-form-sub-field-date_input_type select',
    'handlerType': 'select',
    'event': 'change',
    'dependant': [{
      'selector': '.date-to-ui-options',
      'value': ['range_date']
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
  }];

  function _triggerInputTypeTextDisplayTypeChange(value, $field) {
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

  function _triggerInputTypeNumberDisplayTypeChange(value, $field) {
    var $noResults = $field.find('.wcapf-form-sub-field-number_range_chosen_no_results_message');
    var $allItemsLabel = $field.find('.wcapf-form-sub-field-number_range_select_all_items_label');
    var useChosen = $field.find('.wcapf-form-sub-field-number_range_use_chosen input').is(':checked');

    if (useChosen && ('range_select' === value || 'range_multiselect' === value)) {
      $noResults.show();
    } else {
      $noResults.hide();
    }

    if ('range_radio' === value || 'range_select' === value || 'range_multiselect' === value && useChosen) {
      $allItemsLabel.show();
    } else {
      $allItemsLabel.hide();
    }
  }

  function _triggerInputTypeTextUseSelectChange(value, $field) {
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

  function _triggerInputTypeNumberUseSelectChange(value, $field) {
    var $noResults = $field.find('.wcapf-form-sub-field-number_range_chosen_no_results_message');
    var $allItemsLabel = $field.find('.wcapf-form-sub-field-number_range_select_all_items_label');
    var displayType = $field.find('.wcapf-form-sub-field-number_display_type select').val();

    if ('1' === value && ('range_select' === displayType || 'range_multiselect' === displayType)) {
      $noResults.show();
    } else {
      $noResults.hide();
    }

    if ('1' === value && 'range_multiselect' === displayType || 'range_radio' === displayType || 'range_select' === displayType) {
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
      _triggerInputTypeTextDisplayTypeChange(_value, $field);
    }

    if ('.wcapf-form-sub-field-use_chosen input' === handler) {
      _triggerInputTypeTextUseSelectChange(_value, $field);
    }

    if ('.wcapf-form-sub-field-number_display_type select' === handler) {
      _triggerInputTypeNumberDisplayTypeChange(_value, $field);
    }

    if ('.wcapf-form-sub-field-number_range_use_chosen input' === handler) {
      _triggerInputTypeNumberUseSelectChange(_value, $field);
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInBvc3QtbWV0YS1vcHRpb25zLmpzIiwicHJvZHVjdC1zdGF0dXMtb3B0aW9ucy5qcyIsInNlYXJjaC1mb3JtLWZpZWxkLmpzIiwic2VhcmNoLWZvcm0uanMiXSwibmFtZXMiOlsialF1ZXJ5IiwiZG9jdW1lbnQiLCJyZWFkeSIsIiQiLCIkc2VhcmNoRm9ybSIsIm9uIiwiZSIsImhhbmRsZXIiLCJ2YWx1ZSIsIiRmaWVsZCIsInBhcmFtcyIsIndpbmRvdyIsImhpZXJhcmNoaWNhbERhdGEiLCJpc0hpZXJhcmNoaWNhbCIsIiRkZXBlbmRhbnRGaWVsZHMiLCJmaW5kIiwic2hvdyIsImhpZGUiLCJpbml0U29ydGFibGVGb3JNYW51YWxPcHRpb25zIiwiJHNlbGVjdG9yIiwic29ydGFibGUiLCJvcGFjaXR5IiwicmV2ZXJ0IiwiY3Vyc29yIiwiYXhpcyIsImhhbmRsZSIsInBsYWNlaG9sZGVyIiwidXBkYXRlIiwidGFyZ2V0IiwiY2xvc2VzdCIsInRyaWdnZXJNYW51YWxPcHRpb25zQ2hhbmdlIiwiZGlzYWJsZVNlbGVjdGlvbiIsInVpIiwiaXRlbSIsInRyaWdnZXJSZW1vdmVPcHRpb24iLCIkb3B0aW9uc1RhYmxlIiwidGFibGVSb3dzIiwiY2hpbGRyZW4iLCJsZW5ndGgiLCJyZW1vdmVDbGFzcyIsIiRpdGVtIiwicmVtb3ZlIiwiZW1wdHkiLCJmaWVsZFR5cGUiLCJ0ZW1wbGF0ZSIsIndwIiwicmVuZGVyZWQiLCJsYWJlbCIsIiR3cmFwcGVyIiwiJHJvd3MiLCJhcHBlbmQiLCJoYXNDbGFzcyIsImFkZENsYXNzIiwiJHBvc3RNZXRhT3B0aW9uc01vZGFsIiwiJG5vS2V5Rm91bmRNZXNzYWdlIiwiJHBvc3RNZXRhTW9kYWxMb2FkZXIiLCIkcG9zdE1ldGFPcHRpb25zIiwiJHBvc3RNZXRhTW9kYWxGb290ZXIiLCJwb3N0TWV0YU9wdGlvbnNNb2RhbEluc3RhbmNlIiwicmVtb2RhbCIsImhhc2hUcmFja2luZyIsIiRwb3N0TWV0YUZpZWxkIiwicmVzZXRQb3N0TWV0YU1vZGFsIiwiaHRtbCIsInByb3AiLCIkaW5wdXRNZXRhS2V5IiwibWV0YUtleSIsInZhbCIsIm9wZW4iLCJva0NhbGxiYWNrIiwicmVzcG9uc2UiLCJlcnJDYWxsYmFjayIsIm1lc3NhZ2UiLCJjb25zb2xlIiwibG9nIiwiZm9ybURhdGEiLCJrZXkiLCJhY3Rpb24iLCJhamF4IiwicG9zdCIsImRvbmUiLCJmYWlsIiwiJHZhbHVlSG9sZGVyIiwiX3Jvd3MiLCJlYWNoIiwiaSIsIl9pdGVtIiwicHVzaCIsInJhd1ZhbHVlcyIsImVuY29kZVVSSUNvbXBvbmVudCIsIkpTT04iLCJzdHJpbmdpZnkiLCIkb3B0aW9ucyIsImlzUmVwbGFjZSIsInJvd3MiLCJpcyIsImlucHV0IiwiJGlucHV0IiwiY2xvc2UiLCIkc2VsZWN0RWxtIiwib3JkZXJCeSIsImRlcGVuZGFudE9wdGlvbnMiLCJhdHRyIiwiY2hhbmdlIiwicmVtb3ZlQXR0ciIsImRpc2FibGVPcmRlckJ5T3B0aW9ucyIsIiRlbG0iLCIkb3JkZXJEaXJlY3Rpb25GaWVsZCIsIiRvcmRlclR5cGVGaWVsZCIsIiR0aGlzIiwiaW5pdFNvcnRhYmxlRm9yTnVtYmVyTWFudWFsT3B0aW9ucyIsInRyaWdnZXJOdW1iZXJNYW51YWxPcHRpb25zQ2hhbmdlIiwidHJpZ2dlclJlbW92ZU51bWJlck9wdGlvbiIsIm1pbl92YWx1ZSIsIm1heF92YWx1ZSIsIiRnZXRPcHRpb25zIiwiJGF1dG9PcHRpb25zIiwiJG1hbnVhbE9wdGlvbnNUYWJsZSIsImRpc3BsYXlUeXBlIiwidG9nZ2xlTnVtYmVyTWluVmFsdWVGaWVsZCIsIiR0ZXh0RmllbGQiLCJ0b2dnbGVOdW1iZXJNYXhWYWx1ZUZpZWxkIiwiJHNvZnRMaW1pdEZpZWxkcyIsIiR2YWx1ZVR5cGVGaWVsZCIsInZhbHVlVHlwZSIsImRpc3BsYXlUeXBlcyIsImluY2x1ZGVzIiwiJG51bWJlckRpc3BsYXlUeXBlRmllbGQiLCJudW1iZXJEaXNwbGF5VHlwZSIsIm51bWJlckRpc3BsYXlUeXBlcyIsIiR0ZXh0RGlzcGxheVR5cGVGaWVsZCIsInRleHREaXNwbGF5VHlwZSIsInRleHREaXNwbGF5VHlwZXMiLCIkdmFsdWVUeXBlIiwicG9zdFByb3BlcnR5RGF0YSIsInRyaWdnZXJQcm9kdWN0U3RhdHVzT3B0aW9uc0NoYW5nZSIsImluaXRTb3J0YWJsZUZvclByb2R1Y3RTdGF0dXNPcHRpb25zIiwidHJpZ2dlclJlbW92ZVByb2R1Y3RTdGF0dXNPcHRpb24iLCJkZXBlbmRhbnREYXRhIiwiX3RyaWdnZXJJbnB1dFR5cGVUZXh0RGlzcGxheVR5cGVDaGFuZ2UiLCIkbm9SZXN1bHRzIiwiJGFsbEl0ZW1zTGFiZWwiLCJ1c2VDaG9zZW4iLCJfdHJpZ2dlcklucHV0VHlwZU51bWJlckRpc3BsYXlUeXBlQ2hhbmdlIiwiX3RyaWdnZXJJbnB1dFR5cGVUZXh0VXNlU2VsZWN0Q2hhbmdlIiwiX3RyaWdnZXJJbnB1dFR5cGVOdW1iZXJVc2VTZWxlY3RDaGFuZ2UiLCJfaGFuZGxlVG9nZ2xlUmVxdWVzdCIsImRhdGEiLCJjdXJyZW50U2VsZWN0b3IiLCJoYW5kbGVyVHlwZSIsImRlcGVuZGFudCIsIl92YWx1ZSIsImlkIiwiZCIsInZhbGlkVmFsdWVzIiwidHJpZ2dlciIsImhhbmRsZVRvZ2dsZVJlcXVlc3QiLCIkaGFuZGxlciIsIl90aGlzIiwic2V0dXBTZWFyY2hGb3JtIiwiaW5pdGFsIiwiZXZlbnQiLCJ0b3RhbEZpZWxkSW5zdGFuY2VzIiwic2VhcmNoRm9ybSIsInJlbW92ZVBsYWNlaG9sZGVyIiwidW5pcXVlSWQiLCJlbGVtZW50cyIsImVsZW1lbnQiLCJvbGRWYWx1ZSIsIm5ld1ZhbHVlIiwicmVwbGFjZSIsImluc2VydEZpZWxkU3ViRmllbGRzIiwidHlwZSIsInBhcnNlSW50Iiwid3JhcHBlciIsInByZXBlbmQiLCJ1cGRhdGVGaWVsZHNQb3NpdGlvbiIsImlucHV0cyIsIm5iRWxlbXMiLCJpZHgiLCJtYWtlRmllbGRSZWFkeSIsInRvZ2dsZUJ0biIsImlkZW50aWZpZXIiLCJjb250YWluZXIiLCJjYW5jZWwiLCJpdGVtcyIsImNvbm5lY3RXaXRoIiwic3RvcCIsInN0YXJ0IiwiYXBwZW5kVG8iLCJwYXJlbnQiLCJvbkRyYWdTdGFydCIsIm9uRHJhZ1N0b3AiLCJkcmFnZ2FibGUiLCJjb25uZWN0VG9Tb3J0YWJsZSIsImhlbHBlciIsInRvZ2dsZUZpZWxkIiwid2lkZ2V0IiwiaW5zaWRlIiwiaXNFeHBhbmQiLCJ0b2dnbGVFeHBhbmQiLCJzbGlkZVRvZ2dsZSIsInRvZ2dsZUNsYXNzIiwiZm9jdXNGaWVsZCIsImNsYXNzTGlzdCIsImNvbnRhaW5zIiwiZm9jdXMiLCJyZW1vdmVGaWVsZCIsInNsaWRlVXAiLCJpbml0aWFsRm9ybVN0YXRlIiwic2VyaWFsaXplQXJyYXkiLCJzaG93TWVzc2FnZSIsInNsaWRlRG93biIsInNldFRpbWVvdXQiLCJzYXZlRm9ybSIsImJ1dHRvbiJdLCJtYXBwaW5ncyI6Ijs7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUFBLE1BQU0sQ0FBRUMsUUFBRixDQUFOLENBQW1CQyxLQUFuQixDQUEwQixVQUFVQyxDQUFWLEVBQWM7QUFFdkMsTUFBTUMsV0FBVyxHQUFHRCxDQUFDLENBQUUsY0FBRixDQUFyQjtBQUVBQyxFQUFBQSxXQUFXLENBQUNDLEVBQVosQ0FBZ0Isc0JBQWhCLEVBQXdDLFVBQVVDLENBQVYsRUFBYUMsT0FBYixFQUFzQkMsS0FBdEIsRUFBNkJDLE1BQTdCLEVBQXNDO0FBQzdFLFFBQUssbURBQW1ERixPQUF4RCxFQUFrRTtBQUNqRSxVQUFNRyxNQUFNLEdBQWFDLE1BQU0sQ0FBRSxvQkFBRixDQUEvQjtBQUNBLFVBQU1DLGdCQUFnQixHQUFHRixNQUFNLENBQUUsNEJBQUYsQ0FBL0I7O0FBRUEsVUFBSyxDQUFFRSxnQkFBUCxFQUEwQjtBQUN6QjtBQUNBOztBQUVELFVBQU1DLGNBQWMsR0FBS0QsZ0JBQWdCLENBQUVKLEtBQUYsQ0FBekM7QUFDQSxVQUFNTSxnQkFBZ0IsR0FBR0wsTUFBTSxDQUFDTSxJQUFQLENBQ3hCLDhFQUR3QixD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Q0FBYyxFQUFkO0FBQ0EsR0FKUSxFQUtULElBTFMsQ0FBVjtBQU9BO0FBRUQ7QUFDQTtBQUNBOzs7QUFDQSxTQUFTdUosUUFBVCxHQUFvQjtBQUNuQixNQUFNQyxNQUFNLEdBQUt2TixNQUFNLENBQUUsSUFBRixDQUF2QjtBQUNBLE1BQU0yRSxRQUFRLEdBQUd3RixVQUFVLENBQUMrQyxjQUFYLEVBQWpCO0FBRUFLLEVBQUFBLE1BQU0sQ0FBQ2pILElBQVAsQ0FBYSxVQUFiLEVBQXlCLFVBQXpCOztBQUVBLFdBQVNqQyxVQUFULENBQXFCRyxPQUFyQixFQUErQjtBQUM5QitJLElBQUFBLE1BQU0sQ0FBQy9HLFVBQVAsQ0FBbUIsVUFBbkIsRUFEOEIsQ0FHOUI7O0FBQ0F5RyxJQUFBQSxnQkFBZ0IsR0FBR3RJLFFBQW5CO0FBRUF3SSxJQUFBQSxXQUFXLENBQUUzSSxPQUFGLENBQVg7QUFDQTs7QUFFRCxXQUFTRCxXQUFULENBQXNCQyxPQUF0QixFQUFnQztBQUMvQitJLElBQUFBLE1BQU0sQ0FBQy9HLFVBQVAsQ0FBbUIsVUFBbkI7QUFDQTJHLElBQUFBLFdBQVcsQ0FBRTNJLE9BQUYsRUFBVyxPQUFYLENBQVg7QUFDQSxHQWxCa0IsQ0FvQm5COzs7QUFDQTNCLEVBQUFBLEVBQUUsQ0FBQ2lDLElBQUgsQ0FBUUMsSUFBUixDQUFjSixRQUFkLEVBQXlCSyxJQUF6QixDQUErQlgsVUFBL0IsRUFBNENZLElBQTVDLENBQWtEVixXQUFsRDtBQUNBOztBQUVEdkUsTUFBTSxDQUFFLHNCQUFGLENBQU4sQ0FBaUNLLEVBQWpDLENBQXFDLE9BQXJDLEVBQThDLFFBQTlDLEVBQXdEaU4sUUFBeEQ7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6IndjLWFqYXgtcHJvZHVjdC1maWx0ZXItYWRtaW4tc2NyaXB0cy5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogVGhlIHBvc3QgbWV0YSBmaWVsZC5cbiAqXG4gKiBAc2luY2UgICAgICAxLjAuMFxuICogQHBhY2thZ2UgICAgd2MtYWpheC1wcm9kdWN0LWZpbHRlci1wcm9cbiAqIEBzdWJwYWNrYWdlIHdjLWFqYXgtcHJvZHVjdC1maWx0ZXItcHJvL2FkbWluL3NyYy9qc1xuICogQGF1dGhvciAgICAgTWFpbnVsIEhhc3NhbiBNYWluXG4gKi9cblxualF1ZXJ5KCBkb2N1bWVudCApLnJlYWR5KCBmdW5jdGlvbiggJCApIHtcblxuXHRjb25zdCAkc2VhcmNoRm9ybSA9ICQoICcjc2VhcmNoLWZvcm0nICk7XG5cblx0JHNlYXJjaEZvcm0ub24oICdhZnRlcl90b2dnbGVfcmVxdWVzdCcsIGZ1bmN0aW9uKCBlLCBoYW5kbGVyLCB2YWx1ZSwgJGZpZWxkICkge1xuXHRcdGlmICggJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1jdXN0b20tdGF4b25vbXkgc2VsZWN0JyA9PT0gaGFuZGxlciApIHtcblx0XHRcdGNvbnN0IHBhcmFtcyAgICAgICAgICAgPSB3aW5kb3dbICd3Y2FwZl9hZG1pbl9wYXJhbXMnIF07XG5cdFx0XHRjb25zdCBoaWVyYXJjaGljYWxEYXRhID0gcGFyYW1zWyAndGF4b25vbXlfaGllcmFyY2hpY2FsX2RhdGEnIF07XG5cblx0XHRcdGlmICggISBoaWVyYXJjaGljYWxEYXRhICkge1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdGNvbnN0IGlzSGllcmFyY2hpY2FsICAgPSBoaWVyYXJjaGljYWxEYXRhWyB2YWx1ZSBdO1xuXHRcdFx0Y29uc3QgJGRlcGVuZGFudEZpZWxkcyA9ICRmaWVsZC5maW5kKFxuXHRcdFx0XHQnLndjYXBmLWZvcm0tc3ViLWZpZWxkLWhpZXJhcmNoaWNhbCwgLndjYXBmLWZvcm0tc3ViLWZpZWxkLXNob3dfY2hpbGRyZW5fb25seSdcblx0XHRcdCk7XG5cblx0XHRcdGlmICggaXNIaWVyYXJjaGljYWwgKSB7XG5cdFx0XHRcdCRkZXBlbmRhbnRGaWVsZHMuc2hvdygpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0JGRlcGVuZGFudEZpZWxkcy5oaWRlKCk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9ICk7XG5cblx0ZnVuY3Rpb24gaW5pdFNvcnRhYmxlRm9yTWFudWFsT3B0aW9ucyggJHNlbGVjdG9yICkge1xuXHRcdCRzZWxlY3Rvci5zb3J0YWJsZSgge1xuXHRcdFx0b3BhY2l0eTogMC44LFxuXHRcdFx0cmV2ZXJ0OiBmYWxzZSxcblx0XHRcdGN1cnNvcjogJ21vdmUnLFxuXHRcdFx0YXhpczogJ3knLFxuXHRcdFx0aGFuZGxlOiAnLm1vdmUtb3B0aW9ucy1oYW5kbGVyJyxcblx0XHRcdHBsYWNlaG9sZGVyOiAnd2lkZ2V0LXBsYWNlaG9sZGVyJyxcblx0XHRcdHVwZGF0ZTogZnVuY3Rpb24oIGUgKSB7XG5cdFx0XHRcdGNvbnN0ICRmaWVsZCA9ICQoIGUudGFyZ2V0ICkuY2xvc2VzdCggJy53Y2FwZi1mb3JtLWZpZWxkJyApO1xuXG5cdFx0XHRcdHRyaWdnZXJNYW51YWxPcHRpb25zQ2hhbmdlKCAkZmllbGQgKTtcblx0XHRcdH1cblx0XHR9ICkuZGlzYWJsZVNlbGVjdGlvbigpO1xuXHR9XG5cblx0Ly8gU29ydCBNYW51YWwgT3B0aW9uc1xuXHRpbml0U29ydGFibGVGb3JNYW51YWxPcHRpb25zKCAkc2VhcmNoRm9ybS5maW5kKCAnLm1hbnVhbC1vcHRpb25zLXRhYmxlIC5tYW51YWwtb3B0aW9ucy10YWJsZS1ib2R5LXJvd3MnICkgKTtcblxuXHQkc2VhcmNoRm9ybS5vbiggJ2ZpZWxkX2FkZGVkJywgZnVuY3Rpb24oIGUsIHVpICkge1xuXHRcdC8vIEluaXQgU29ydGFibGUgZm9yIHRoZSBtYW51YWwgb3B0aW9ucy5cblx0XHRpbml0U29ydGFibGVGb3JNYW51YWxPcHRpb25zKCAkKCB1aS5pdGVtLmZpbmQoICcubWFudWFsLW9wdGlvbnMtdGFibGUtYm9keS1yb3dzJyApICkgKTtcblx0fSApO1xuXG5cdGZ1bmN0aW9uIHRyaWdnZXJSZW1vdmVPcHRpb24oICRmaWVsZCApIHtcblx0XHRjb25zdCAkb3B0aW9uc1RhYmxlID0gJGZpZWxkLmZpbmQoICcubWFudWFsLW9wdGlvbnMtdGFibGUnICk7XG5cdFx0Y29uc3QgdGFibGVSb3dzICAgICA9ICRvcHRpb25zVGFibGUuZmluZCggJy5tYW51YWwtb3B0aW9ucy10YWJsZS1ib2R5LXJvd3MnICkuY2hpbGRyZW4oKTtcblxuXHRcdGlmICggMiA+IHRhYmxlUm93cy5sZW5ndGggKSB7XG5cdFx0XHQkb3B0aW9uc1RhYmxlLnJlbW92ZUNsYXNzKCAnaGFzLW9wdGlvbnMnICk7XG5cdFx0fVxuXHR9XG5cblx0Ly8gUmVtb3ZlIFNpbmdsZSBPcHRpb25cblx0JHNlYXJjaEZvcm0ub24oICdjbGljaycsICcucmVtb3ZlLW9wdGlvbicsIGZ1bmN0aW9uKCkge1xuXHRcdGNvbnN0ICRpdGVtICA9ICQoIHRoaXMgKS5jbG9zZXN0KCAnLml0ZW0nICk7XG5cdFx0Y29uc3QgJGZpZWxkID0gJGl0ZW0uY2xvc2VzdCggJy53Y2FwZi1mb3JtLWZpZWxkJyApO1xuXG5cdFx0dHJpZ2dlclJlbW92ZU9wdGlvbiggJGZpZWxkICk7XG5cblx0XHQkaXRlbS5yZW1vdmUoKTtcblxuXHRcdHRyaWdnZXJNYW51YWxPcHRpb25zQ2hhbmdlKCAkZmllbGQgKTtcblx0fSApO1xuXG5cdC8vIENsZWFyIEFsbCBPcHRpb25zXG5cdCRzZWFyY2hGb3JtLm9uKCAnY2xpY2snLCAnLmNsZWFyLWFsbC1vcHRpb25zJywgZnVuY3Rpb24oKSB7XG5cdFx0Y29uc3QgJGZpZWxkICAgICAgICA9ICQoIHRoaXMgKS5jbG9zZXN0KCAnLndjYXBmLWZvcm0tZmllbGQnICk7XG5cdFx0Y29uc3QgJG9wdGlvbnNUYWJsZSA9ICRmaWVsZC5maW5kKCAnLm1hbnVhbC1vcHRpb25zLXRhYmxlJyApO1xuXG5cdFx0JG9wdGlvbnNUYWJsZS5maW5kKCAnLm1hbnVhbC1vcHRpb25zLXRhYmxlLWJvZHktcm93cycgKS5lbXB0eSgpO1xuXG5cdFx0dHJpZ2dlclJlbW92ZU9wdGlvbiggJGZpZWxkICk7XG5cblx0XHR0cmlnZ2VyTWFudWFsT3B0aW9uc0NoYW5nZSggJGZpZWxkICk7XG5cdH0gKTtcblxuXHQvLyBBZGQgTmV3IE9wdGlvblxuXHQkc2VhcmNoRm9ybS5vbiggJ2NsaWNrJywgJy5hZGQtb3B0aW9uJywgZnVuY3Rpb24oKSB7XG5cdFx0Y29uc3QgZmllbGRUeXBlID0gJ3djYXBmLXBvc3QtbWV0YS1vcHRpb24nO1xuXG5cdFx0Ly8gQmFpbCBvdXQgaWYgbm8gdG1wbCBmb3VuZCBmb3IgdGhlIHR5cGUuXG5cdFx0aWYgKCAhIGpRdWVyeSggJyN0bXBsLScgKyBmaWVsZFR5cGUgKS5sZW5ndGggKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0Y29uc3QgJGZpZWxkID0gJCggdGhpcyApLmNsb3Nlc3QoICcud2NhcGYtZm9ybS1maWVsZCcgKTtcblxuXHRcdGNvbnN0IHRlbXBsYXRlID0gd3AudGVtcGxhdGUoIGZpZWxkVHlwZSApO1xuXHRcdGNvbnN0IHJlbmRlcmVkID0gdGVtcGxhdGUoIHsgdmFsdWU6ICcnLCBsYWJlbDogJycgfSApO1xuXHRcdGNvbnN0ICR3cmFwcGVyID0gJGZpZWxkLmZpbmQoICcubWFudWFsLW9wdGlvbnMtdGFibGUnICk7XG5cdFx0Y29uc3QgJHJvd3MgICAgPSAkd3JhcHBlci5maW5kKCAnLm1hbnVhbC1vcHRpb25zLXRhYmxlLWJvZHktcm93cycgKTtcblxuXHRcdCRyb3dzLmFwcGVuZCggcmVuZGVyZWQgKTtcblxuXHRcdGlmICggISAkd3JhcHBlci5oYXNDbGFzcyggJ2hhcy1vcHRpb25zJyApICkge1xuXHRcdFx0JHdyYXBwZXIuYWRkQ2xhc3MoICdoYXMtb3B0aW9ucycgKTtcblx0XHR9XG5cdH0gKTtcblxuXHRjb25zdCAkcG9zdE1ldGFPcHRpb25zTW9kYWwgPSAkKCAnLnBvc3QtbWV0YS1vcHRpb25zLW1vZGFsJyApO1xuXHRjb25zdCAkbm9LZXlGb3VuZE1lc3NhZ2UgICAgPSAkcG9zdE1ldGFPcHRpb25zTW9kYWwuZmluZCggJy5uby1rZXktZm91bmQtbWVzc2FnZScgKTtcblx0Y29uc3QgJHBvc3RNZXRhTW9kYWxMb2FkZXIgID0gJHBvc3RNZXRhT3B0aW9uc01vZGFsLmZpbmQoICcucG9zdC1tZXRhLW9wdGlvbnMtbG9hZGVyJyApO1xuXHRjb25zdCAkcG9zdE1ldGFPcHRpb25zICAgICAgPSAkcG9zdE1ldGFPcHRpb25zTW9kYWwuZmluZCggJy5wb3N0LW1ldGEtb3B0aW9ucycgKTtcblx0Y29uc3QgJHBvc3RNZXRhTW9kYWxGb290ZXIgID0gJHBvc3RNZXRhT3B0aW9uc01vZGFsLmZpbmQoICcud2NhcGYtbW9kYWwtZm9vdGVyJyApO1xuXG5cdGNvbnN0IHBvc3RNZXRhT3B0aW9uc01vZGFsSW5zdGFuY2UgPSAkcG9zdE1ldGFPcHRpb25zTW9kYWwucmVtb2RhbCgge1xuXHRcdGhhc2hUcmFja2luZzogZmFsc2UsXG5cdH0gKTtcblxuXHRsZXQgJHBvc3RNZXRhRmllbGQgPSBudWxsO1xuXG5cdGZ1bmN0aW9uIHJlc2V0UG9zdE1ldGFNb2RhbCgpIHtcblx0XHQkcG9zdE1ldGFPcHRpb25zLmh0bWwoICcnICk7XG5cdFx0JHBvc3RNZXRhTW9kYWxMb2FkZXIucmVtb3ZlQ2xhc3MoICdhY3RpdmUnICk7XG5cdFx0JG5vS2V5Rm91bmRNZXNzYWdlLnJlbW92ZUNsYXNzKCAnYWN0aXZlJyApO1xuXHRcdCRwb3N0TWV0YU1vZGFsRm9vdGVyLnJlbW92ZUNsYXNzKCAnYWN0aXZlJyApO1xuXHRcdCRwb3N0TWV0YU9wdGlvbnNNb2RhbC5maW5kKCAnLnJlcGxhY2UtY3VycmVudC1vcHRpb25zJyApLnByb3AoICdjaGVja2VkJywgZmFsc2UgKTtcblx0fVxuXG5cdC8vIEJyb3dzZSBWYWx1ZXNcblx0JHNlYXJjaEZvcm0ub24oICdjbGljaycsICcuYnJvd3NlLXZhbHVlcycsIGZ1bmN0aW9uKCkge1xuXHRcdHJlc2V0UG9zdE1ldGFNb2RhbCgpO1xuXG5cdFx0Y29uc3QgJGZpZWxkICAgICAgICA9ICQoIHRoaXMgKS5jbG9zZXN0KCAnLndjYXBmLWZvcm0tZmllbGQnICk7XG5cdFx0Y29uc3QgJGlucHV0TWV0YUtleSA9ICRmaWVsZC5maW5kKCAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLW1ldGFfa2V5IHNlbGVjdCcgKTtcblx0XHRjb25zdCBtZXRhS2V5ICAgICAgID0gJGlucHV0TWV0YUtleS52YWwoKTtcblxuXHRcdGlmICggISBtZXRhS2V5ICkge1xuXHRcdFx0JG5vS2V5Rm91bmRNZXNzYWdlLmFkZENsYXNzKCAnYWN0aXZlJyApO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHQkbm9LZXlGb3VuZE1lc3NhZ2UucmVtb3ZlQ2xhc3MoICdhY3RpdmUnICk7XG5cdFx0fVxuXG5cdFx0cG9zdE1ldGFPcHRpb25zTW9kYWxJbnN0YW5jZS5vcGVuKCk7XG5cdFx0JHBvc3RNZXRhRmllbGQgPSAkZmllbGQ7XG5cblx0XHRpZiAoICEgbWV0YUtleSApIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHQvLyBTaG93IHRoZSBsb2FkaW5nIGFuaW1hdGlvbi5cblx0XHQkcG9zdE1ldGFNb2RhbExvYWRlci5hZGRDbGFzcyggJ2FjdGl2ZScgKTtcblxuXHRcdC8qKlxuXHRcdCAqIEFqYXgncyBzdWNjZXNzIGZ1bmN0aW9uLlxuXHRcdCAqXG5cdFx0ICogQHBhcmFtIHJlc3BvbnNlXG5cdFx0ICovXG5cdFx0ZnVuY3Rpb24gb2tDYWxsYmFjayggcmVzcG9uc2UgKSB7XG5cdFx0XHQvLyBIaWRlIHRoZSBsb2FkaW5nIGFuaW1hdGlvbi5cblx0XHRcdCRwb3N0TWV0YU1vZGFsTG9hZGVyLnJlbW92ZUNsYXNzKCAnYWN0aXZlJyApO1xuXHRcdFx0JHBvc3RNZXRhTW9kYWxGb290ZXIuYWRkQ2xhc3MoICdhY3RpdmUnICk7XG5cblx0XHRcdCRwb3N0TWV0YU9wdGlvbnMuaHRtbCggcmVzcG9uc2UgKTtcblx0XHR9XG5cblx0XHQvKipcblx0XHQgKiBBamF4J3MgZXJyb3IgZnVuY3Rpb24uXG5cdFx0ICpcblx0XHQgKiBAcGFyYW0gbWVzc2FnZVxuXHRcdCAqL1xuXHRcdGZ1bmN0aW9uIGVyckNhbGxiYWNrKCBtZXNzYWdlICkge1xuXHRcdFx0Y29uc29sZS5sb2coICdlcnJvcicsIG1lc3NhZ2UgKTtcblxuXHRcdFx0Ly8gSGlkZSB0aGUgbG9hZGluZyBhbmltYXRpb24uXG5cdFx0XHQkcG9zdE1ldGFNb2RhbExvYWRlci5yZW1vdmVDbGFzcyggJ2FjdGl2ZScgKTtcblx0XHR9XG5cblx0XHRjb25zdCBmb3JtRGF0YSA9IHtcblx0XHRcdGtleTogbWV0YUtleSxcblx0XHRcdGFjdGlvbjogJ3djYXBmX2dldF9tZXRhX29wdGlvbnMnLFxuXHRcdH1cblxuXHRcdC8vIGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vYS81OTE4MTI1MlxuXHRcdHdwLmFqYXgucG9zdCggZm9ybURhdGEgKS5kb25lKCBva0NhbGxiYWNrICkuZmFpbCggZXJyQ2FsbGJhY2sgKTtcblx0fSApO1xuXG5cdC8qKlxuXHQgKiBSZXNldCB0aGUgcG9zdCBtZXRhIG9wdGlvbidzIG1vZGFsIHdoZW4gbW9kYWwgZ2V0cyBjbG9zZWQuXG5cdCAqL1xuXHQkKCBkb2N1bWVudCApLm9uKCAnY2xvc2VkJywgJHBvc3RNZXRhT3B0aW9uc01vZGFsLCBmdW5jdGlvbigpIHtcblx0XHRyZXNldFBvc3RNZXRhTW9kYWwoKTtcblx0XHQkcG9zdE1ldGFGaWVsZCA9IG51bGw7XG5cdH0gKTtcblxuXHQvLyBVbnNlbGVjdCBhbGwgdmFsdWVzLlxuXHQkcG9zdE1ldGFPcHRpb25zTW9kYWwub24oICdjbGljaycsICcuc2VsZWN0LW5vbmUnLCBmdW5jdGlvbigpIHtcblx0XHQkcG9zdE1ldGFPcHRpb25zLmZpbmQoICdbdHlwZT1cImNoZWNrYm94XCJdJyApLnByb3AoICdjaGVja2VkJywgZmFsc2UgKTtcblx0fSApO1xuXG5cdC8vIFNlbGVjdCBhbGwgdmFsdWVzLlxuXHQkcG9zdE1ldGFPcHRpb25zTW9kYWwub24oICdjbGljaycsICcuc2VsZWN0LWFsbCcsIGZ1bmN0aW9uKCkge1xuXHRcdCRwb3N0TWV0YU9wdGlvbnMuZmluZCggJ1t0eXBlPVwiY2hlY2tib3hcIl0nICkucHJvcCggJ2NoZWNrZWQnLCB0cnVlICk7XG5cdH0gKTtcblxuXHRmdW5jdGlvbiB0cmlnZ2VyTWFudWFsT3B0aW9uc0NoYW5nZSggJHBvc3RNZXRhRmllbGQgKSB7XG5cdFx0Y29uc3QgJHZhbHVlSG9sZGVyICA9ICRwb3N0TWV0YUZpZWxkLmZpbmQoICcud2NhcGYtZm9ybS1zdWItZmllbGQtbWFudWFsX29wdGlvbnMgaW5wdXQnICk7XG5cdFx0Y29uc3QgJG9wdGlvbnNUYWJsZSA9ICRwb3N0TWV0YUZpZWxkLmZpbmQoICcubWFudWFsLW9wdGlvbnMtdGFibGUnICk7XG5cdFx0Y29uc3QgJHJvd3MgICAgICAgICA9ICRvcHRpb25zVGFibGUuZmluZCggJy5tYW51YWwtb3B0aW9ucy10YWJsZS1ib2R5LXJvd3MnICk7XG5cdFx0Y29uc3QgX3Jvd3MgICAgICAgICA9IFtdO1xuXG5cdFx0JHJvd3MuZmluZCggJy5pdGVtJyApLmVhY2goIGZ1bmN0aW9uKCBpLCBfaXRlbSApIHtcblx0XHRcdGNvbnN0ICRpdGVtID0gJCggX2l0ZW0gKTtcblx0XHRcdGNvbnN0IHZhbHVlID0gJGl0ZW0uZmluZCggJy5vcHRpb25fdmFsdWUnICkudmFsKCk7XG5cdFx0XHRjb25zdCBsYWJlbCA9ICRpdGVtLmZpbmQoICcub3B0aW9uX2xhYmVsJyApLnZhbCgpO1xuXG5cdFx0XHRpZiAoIHZhbHVlICYmIGxhYmVsICkge1xuXHRcdFx0XHRfcm93cy5wdXNoKCBbIHZhbHVlLCBsYWJlbCBdICk7XG5cdFx0XHR9XG5cdFx0fSApO1xuXG5cdFx0Y29uc3QgcmF3VmFsdWVzID0gZW5jb2RlVVJJQ29tcG9uZW50KCBKU09OLnN0cmluZ2lmeSggX3Jvd3MgKSApO1xuXHRcdCR2YWx1ZUhvbGRlci52YWwoIHJhd1ZhbHVlcyApO1xuXHR9XG5cblx0Ly8gQWRkIHNlbGVjdGVkIG9wdGlvbnMuXG5cdCRwb3N0TWV0YU9wdGlvbnNNb2RhbC5vbiggJ2NsaWNrJywgJy5hZGQtb3B0aW9ucycsIGZ1bmN0aW9uKCkge1xuXHRcdGNvbnN0ICRvcHRpb25zID0gJHBvc3RNZXRhT3B0aW9ucy5maW5kKCAnW3R5cGU9XCJjaGVja2JveFwiXScgKTtcblx0XHRsZXQgaXNSZXBsYWNlICA9IGZhbHNlO1xuXHRcdGxldCByb3dzICAgICAgID0gJyc7XG5cblx0XHRpZiAoICRwb3N0TWV0YU1vZGFsRm9vdGVyLmZpbmQoICcucmVwbGFjZS1jdXJyZW50LW9wdGlvbnMnICkuaXMoICc6Y2hlY2tlZCcgKSApIHtcblx0XHRcdGlzUmVwbGFjZSA9IHRydWU7XG5cdFx0fVxuXG5cdFx0aWYgKCAkb3B0aW9ucyApIHtcblx0XHRcdGNvbnN0IGZpZWxkVHlwZSA9ICd3Y2FwZi1wb3N0LW1ldGEtb3B0aW9uJztcblxuXHRcdFx0JC5lYWNoKCAkb3B0aW9ucywgZnVuY3Rpb24oIGksIGlucHV0ICkge1xuXHRcdFx0XHRjb25zdCAkaW5wdXQgPSAkKCBpbnB1dCApO1xuXHRcdFx0XHRjb25zdCB2YWx1ZSAgPSAkaW5wdXQudmFsKCk7XG5cblx0XHRcdFx0aWYgKCAkaW5wdXQuaXMoICc6Y2hlY2tlZCcgKSApIHtcblx0XHRcdFx0XHRjb25zdCB0ZW1wbGF0ZSA9IHdwLnRlbXBsYXRlKCBmaWVsZFR5cGUgKTtcblx0XHRcdFx0XHRjb25zdCByZW5kZXJlZCA9IHRlbXBsYXRlKCB7IHZhbHVlLCBsYWJlbDogdmFsdWUgfSApO1xuXG5cdFx0XHRcdFx0cm93cyArPSByZW5kZXJlZDtcblx0XHRcdFx0fVxuXHRcdFx0fSApO1xuXHRcdH1cblxuXHRcdGlmICggcm93cyApIHtcblx0XHRcdGNvbnN0ICR3cmFwcGVyID0gJHBvc3RNZXRhRmllbGQuZmluZCggJy5tYW51YWwtb3B0aW9ucy10YWJsZScgKTtcblx0XHRcdGNvbnN0ICRyb3dzICAgID0gJHdyYXBwZXIuZmluZCggJy5tYW51YWwtb3B0aW9ucy10YWJsZS1ib2R5LXJvd3MnICk7XG5cblx0XHRcdGlmICggaXNSZXBsYWNlICkge1xuXHRcdFx0XHQkcm93cy5odG1sKCByb3dzICk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHQkcm93cy5hcHBlbmQoIHJvd3MgKTtcblx0XHRcdH1cblxuXHRcdFx0aWYgKCAhICR3cmFwcGVyLmhhc0NsYXNzKCAnaGFzLW9wdGlvbnMnICkgKSB7XG5cdFx0XHRcdCR3cmFwcGVyLmFkZENsYXNzKCAnaGFzLW9wdGlvbnMnICk7XG5cdFx0XHR9XG5cblx0XHRcdHRyaWdnZXJNYW51YWxPcHRpb25zQ2hhbmdlKCAkcG9zdE1ldGFGaWVsZCApO1xuXHRcdH1cblxuXHRcdHBvc3RNZXRhT3B0aW9uc01vZGFsSW5zdGFuY2UuY2xvc2UoKTtcblx0fSApO1xuXG5cdCRzZWFyY2hGb3JtLm9uKCAnYWZ0ZXJfdG9nZ2xlX3JlcXVlc3QnLCBmdW5jdGlvbiggZSwgaGFuZGxlciwgdmFsdWUsICRmaWVsZCApIHtcblx0XHRpZiAoICcud2NhcGYtZm9ybS1zdWItZmllbGQtZ2V0X29wdGlvbnMgaW5wdXQnID09PSBoYW5kbGVyICkge1xuXHRcdFx0Y29uc3QgJHNlbGVjdEVsbSAgICAgICA9ICRmaWVsZC5maW5kKCAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLW9wdGlvbnNfb3JkZXJfYnkgc2VsZWN0JyApO1xuXHRcdFx0Y29uc3Qgb3JkZXJCeSAgICAgICAgICA9ICRzZWxlY3RFbG0udmFsKCk7XG5cdFx0XHRjb25zdCBkZXBlbmRhbnRPcHRpb25zID0gJ29wdGlvblt2YWx1ZT1cImxhYmVsXCJdJztcblxuXHRcdFx0aWYgKCAnYXV0b21hdGljYWxseScgPT09IHZhbHVlICkge1xuXHRcdFx0XHQkc2VsZWN0RWxtLmNoaWxkcmVuKCBkZXBlbmRhbnRPcHRpb25zICkuYXR0ciggJ2Rpc2FibGVkJywgJ2Rpc2FibGVkJyApO1xuXG5cdFx0XHRcdGlmICggJ2xhYmVsJyA9PT0gb3JkZXJCeSApIHtcblx0XHRcdFx0XHQkc2VsZWN0RWxtLnByb3AoICdzZWxlY3RlZEluZGV4JywgMSApLmNoYW5nZSgpO1xuXHRcdFx0XHR9XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHQkc2VsZWN0RWxtLmNoaWxkcmVuKCBkZXBlbmRhbnRPcHRpb25zICkucmVtb3ZlQXR0ciggJ2Rpc2FibGVkJyApO1xuXHRcdFx0fVxuXHRcdH1cblx0fSApO1xuXG5cdGZ1bmN0aW9uIGRpc2FibGVPcmRlckJ5T3B0aW9ucyggJGVsbSApIHtcblx0XHRjb25zdCB2YWx1ZSAgICAgICAgICAgICAgICA9ICRlbG0udmFsKCk7XG5cdFx0Y29uc3QgJHdyYXBwZXIgICAgICAgICAgICAgPSAkZWxtLmNsb3Nlc3QoICcud2NhcGYtcG9zdC1tZXRhLW9yZGVyLW9wdGlvbnMtZmllbGQnICk7XG5cdFx0Y29uc3QgJG9yZGVyRGlyZWN0aW9uRmllbGQgPSAkd3JhcHBlci5maW5kKCAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLW9wdGlvbnNfb3JkZXJfZGlyIHNlbGVjdCcgKTtcblx0XHRjb25zdCAkb3JkZXJUeXBlRmllbGQgICAgICA9ICR3cmFwcGVyLmZpbmQoICcud2NhcGYtZm9ybS1zdWItZmllbGQtb3B0aW9uc19vcmRlcl90eXBlIHNlbGVjdCcgKTtcblxuXHRcdGlmICggJ25vbmUnID09PSB2YWx1ZSApIHtcblx0XHRcdCRvcmRlckRpcmVjdGlvbkZpZWxkLmF0dHIoICdkaXNhYmxlZCcsICdkaXNhYmxlZCcgKTtcblx0XHRcdCRvcmRlclR5cGVGaWVsZC5hdHRyKCAnZGlzYWJsZWQnLCAnZGlzYWJsZWQnICk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdCRvcmRlckRpcmVjdGlvbkZpZWxkLnJlbW92ZUF0dHIoICdkaXNhYmxlZCcgKTtcblx0XHRcdCRvcmRlclR5cGVGaWVsZC5yZW1vdmVBdHRyKCAnZGlzYWJsZWQnICk7XG5cdFx0fVxuXHR9XG5cblx0JHNlYXJjaEZvcm0uZmluZCggJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1vcHRpb25zX29yZGVyX2J5IHNlbGVjdCcgKS5lYWNoKCBmdW5jdGlvbigpIHtcblx0XHRjb25zdCAkdGhpcyA9ICQoIHRoaXMgKTtcblxuXHRcdGRpc2FibGVPcmRlckJ5T3B0aW9ucyggJHRoaXMgKTtcblx0fSApO1xuXG5cdCRzZWFyY2hGb3JtLm9uKCAnY2hhbmdlJywgJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1vcHRpb25zX29yZGVyX2J5IHNlbGVjdCcsIGZ1bmN0aW9uKCkge1xuXHRcdGNvbnN0ICR0aGlzID0gJCggdGhpcyApO1xuXG5cdFx0ZGlzYWJsZU9yZGVyQnlPcHRpb25zKCAkdGhpcyApO1xuXHR9ICk7XG5cblx0JHNlYXJjaEZvcm0ub24oICdpbnB1dCcsICcubWFudWFsLW9wdGlvbnMtdGFibGUgaW5wdXRbdHlwZT1cInRleHRcIl0nLCBmdW5jdGlvbigpIHtcblx0XHRjb25zdCAkZmllbGQgPSAkKCB0aGlzICkuY2xvc2VzdCggJy53Y2FwZi1mb3JtLWZpZWxkJyApO1xuXG5cdFx0dHJpZ2dlck1hbnVhbE9wdGlvbnNDaGFuZ2UoICRmaWVsZCApO1xuXHR9ICk7XG5cblx0LyoqXG5cdCAqIFZhbHVlIHR5cGUgJ051bWJlcidcblx0ICovXG5cblx0ZnVuY3Rpb24gaW5pdFNvcnRhYmxlRm9yTnVtYmVyTWFudWFsT3B0aW9ucyggJHNlbGVjdG9yICkge1xuXHRcdCRzZWxlY3Rvci5zb3J0YWJsZSgge1xuXHRcdFx0b3BhY2l0eTogMC44LFxuXHRcdFx0cmV2ZXJ0OiBmYWxzZSxcblx0XHRcdGN1cnNvcjogJ21vdmUnLFxuXHRcdFx0YXhpczogJ3knLFxuXHRcdFx0aGFuZGxlOiAnLm1vdmUtb3B0aW9ucy1oYW5kbGVyJyxcblx0XHRcdHBsYWNlaG9sZGVyOiAnd2lkZ2V0LXBsYWNlaG9sZGVyJyxcblx0XHRcdHVwZGF0ZTogZnVuY3Rpb24oIGUgKSB7XG5cdFx0XHRcdGNvbnN0ICRmaWVsZCA9ICQoIGUudGFyZ2V0ICkuY2xvc2VzdCggJy53Y2FwZi1mb3JtLWZpZWxkJyApO1xuXG5cdFx0XHRcdHRyaWdnZXJOdW1iZXJNYW51YWxPcHRpb25zQ2hhbmdlKCAkZmllbGQgKTtcblx0XHRcdH1cblx0XHR9ICkuZGlzYWJsZVNlbGVjdGlvbigpO1xuXHR9XG5cblx0Ly8gU29ydCBOdW1iZXIgTWFudWFsIE9wdGlvbnNcblx0aW5pdFNvcnRhYmxlRm9yTnVtYmVyTWFudWFsT3B0aW9ucyggJHNlYXJjaEZvcm0uZmluZCggJy5udW1iZXItbWFudWFsLW9wdGlvbnMtdGFibGUgLm1hbnVhbC1vcHRpb25zLXRhYmxlLWJvZHktcm93cycgKSApO1xuXG5cdCRzZWFyY2hGb3JtLm9uKCAnZmllbGRfYWRkZWQnLCBmdW5jdGlvbiggZSwgdWkgKSB7XG5cdFx0Ly8gSW5pdCBTb3J0YWJsZSBmb3IgdGhlIG51bWJlciBtYW51YWwgb3B0aW9ucy5cblx0XHRpbml0U29ydGFibGVGb3JOdW1iZXJNYW51YWxPcHRpb25zKCAkKCB1aS5pdGVtLmZpbmQoICcubWFudWFsLW9wdGlvbnMtdGFibGUtYm9keS1yb3dzJyApICkgKTtcblx0fSApO1xuXG5cdGZ1bmN0aW9uIHRyaWdnZXJSZW1vdmVOdW1iZXJPcHRpb24oICRmaWVsZCApIHtcblx0XHRjb25zdCAkb3B0aW9uc1RhYmxlID0gJGZpZWxkLmZpbmQoICcubnVtYmVyLW1hbnVhbC1vcHRpb25zLXRhYmxlJyApO1xuXHRcdGNvbnN0IHRhYmxlUm93cyAgICAgPSAkb3B0aW9uc1RhYmxlLmZpbmQoICcubWFudWFsLW9wdGlvbnMtdGFibGUtYm9keS1yb3dzJyApLmNoaWxkcmVuKCk7XG5cblx0XHRpZiAoIDIgPiB0YWJsZVJvd3MubGVuZ3RoICkge1xuXHRcdFx0JG9wdGlvbnNUYWJsZS5yZW1vdmVDbGFzcyggJ2hhcy1vcHRpb25zJyApO1xuXHRcdH1cblx0fVxuXG5cdGZ1bmN0aW9uIHRyaWdnZXJOdW1iZXJNYW51YWxPcHRpb25zQ2hhbmdlKCAkcG9zdE1ldGFGaWVsZCApIHtcblx0XHRjb25zdCAkdmFsdWVIb2xkZXIgID0gJHBvc3RNZXRhRmllbGQuZmluZCggJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1udW1iZXJfbWFudWFsX29wdGlvbnMgaW5wdXQnICk7XG5cdFx0Y29uc3QgJG9wdGlvbnNUYWJsZSA9ICRwb3N0TWV0YUZpZWxkLmZpbmQoICcubnVtYmVyLW1hbnVhbC1vcHRpb25zLXRhYmxlJyApO1xuXHRcdGNvbnN0ICRyb3dzICAgICAgICAgPSAkb3B0aW9uc1RhYmxlLmZpbmQoICcubWFudWFsLW9wdGlvbnMtdGFibGUtYm9keS1yb3dzJyApO1xuXHRcdGNvbnN0IF9yb3dzICAgICAgICAgPSBbXTtcblxuXHRcdCRyb3dzLmZpbmQoICcuaXRlbScgKS5lYWNoKCBmdW5jdGlvbiggaSwgX2l0ZW0gKSB7XG5cdFx0XHRjb25zdCAkaXRlbSAgICAgPSAkKCBfaXRlbSApO1xuXHRcdFx0Y29uc3QgbWluX3ZhbHVlID0gJGl0ZW0uZmluZCggJy5vcHRpb25fbWluX3ZhbHVlJyApLnZhbCgpO1xuXHRcdFx0Y29uc3QgbWF4X3ZhbHVlID0gJGl0ZW0uZmluZCggJy5vcHRpb25fbWF4X3ZhbHVlJyApLnZhbCgpO1xuXHRcdFx0Y29uc3QgbGFiZWwgICAgID0gJGl0ZW0uZmluZCggJy5vcHRpb25fbGFiZWwnICkudmFsKCk7XG5cblx0XHRcdGlmICggbWluX3ZhbHVlICYmIG1heF92YWx1ZSAmJiBsYWJlbCApIHtcblx0XHRcdFx0X3Jvd3MucHVzaCggWyBtaW5fdmFsdWUsIG1heF92YWx1ZSwgbGFiZWwgXSApO1xuXHRcdFx0fVxuXHRcdH0gKTtcblxuXHRcdGNvbnN0IHJhd1ZhbHVlcyA9IGVuY29kZVVSSUNvbXBvbmVudCggSlNPTi5zdHJpbmdpZnkoIF9yb3dzICkgKTtcblx0XHQkdmFsdWVIb2xkZXIudmFsKCByYXdWYWx1ZXMgKTtcblx0fVxuXG5cdC8vIFJlbW92ZSBTaW5nbGUgTnVtYmVyIE9wdGlvblxuXHQkc2VhcmNoRm9ybS5vbiggJ2NsaWNrJywgJy5yZW1vdmUtbnVtYmVyLW9wdGlvbicsIGZ1bmN0aW9uKCkge1xuXHRcdGNvbnN0ICRpdGVtICA9ICQoIHRoaXMgKS5jbG9zZXN0KCAnLml0ZW0nICk7XG5cdFx0Y29uc3QgJGZpZWxkID0gJGl0ZW0uY2xvc2VzdCggJy53Y2FwZi1mb3JtLWZpZWxkJyApO1xuXG5cdFx0dHJpZ2dlclJlbW92ZU51bWJlck9wdGlvbiggJGZpZWxkICk7XG5cblx0XHQkaXRlbS5yZW1vdmUoKTtcblxuXHRcdHRyaWdnZXJOdW1iZXJNYW51YWxPcHRpb25zQ2hhbmdlKCAkZmllbGQgKTtcblx0fSApO1xuXG5cdC8vIENsZWFyIEFsbCBPcHRpb25zXG5cdCRzZWFyY2hGb3JtLm9uKCAnY2xpY2snLCAnLmNsZWFyLWFsbC1udW1iZXItb3B0aW9ucycsIGZ1bmN0aW9uKCkge1xuXHRcdGNvbnN0ICRmaWVsZCAgICAgICAgPSAkKCB0aGlzICkuY2xvc2VzdCggJy53Y2FwZi1mb3JtLWZpZWxkJyApO1xuXHRcdGNvbnN0ICRvcHRpb25zVGFibGUgPSAkZmllbGQuZmluZCggJy5udW1iZXItbWFudWFsLW9wdGlvbnMtdGFibGUnICk7XG5cblx0XHQkb3B0aW9uc1RhYmxlLmZpbmQoICcubWFudWFsLW9wdGlvbnMtdGFibGUtYm9keS1yb3dzJyApLmVtcHR5KCk7XG5cblx0XHR0cmlnZ2VyUmVtb3ZlTnVtYmVyT3B0aW9uKCAkZmllbGQgKTtcblxuXHRcdHRyaWdnZXJOdW1iZXJNYW51YWxPcHRpb25zQ2hhbmdlKCAkZmllbGQgKTtcblx0fSApO1xuXG5cdC8vIEFkZCBOZXcgT3B0aW9uXG5cdCRzZWFyY2hGb3JtLm9uKCAnY2xpY2snLCAnLmFkZC1udW1iZXItb3B0aW9uJywgZnVuY3Rpb24oKSB7XG5cdFx0Y29uc3QgZmllbGRUeXBlID0gJ3djYXBmLXBvc3QtbWV0YS10eXBlLW51bWJlci1vcHRpb24nO1xuXG5cdFx0Ly8gQmFpbCBvdXQgaWYgbm8gdG1wbCBmb3VuZCBmb3IgdGhlIHR5cGUuXG5cdFx0aWYgKCAhIGpRdWVyeSggJyN0bXBsLScgKyBmaWVsZFR5cGUgKS5sZW5ndGggKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0Y29uc3QgJGZpZWxkID0gJCggdGhpcyApLmNsb3Nlc3QoICcud2NhcGYtZm9ybS1maWVsZCcgKTtcblxuXHRcdGNvbnN0IHRlbXBsYXRlID0gd3AudGVtcGxhdGUoIGZpZWxkVHlwZSApO1xuXHRcdGNvbnN0IHJlbmRlcmVkID0gdGVtcGxhdGUoIHsgdmFsdWU6ICcnLCBsYWJlbDogJycgfSApO1xuXHRcdGNvbnN0ICR3cmFwcGVyID0gJGZpZWxkLmZpbmQoICcubnVtYmVyLW1hbnVhbC1vcHRpb25zLXRhYmxlJyApO1xuXHRcdGNvbnN0ICRyb3dzICAgID0gJHdyYXBwZXIuZmluZCggJy5tYW51YWwtb3B0aW9ucy10YWJsZS1ib2R5LXJvd3MnICk7XG5cblx0XHQkcm93cy5hcHBlbmQoIHJlbmRlcmVkICk7XG5cblx0XHRpZiAoICEgJHdyYXBwZXIuaGFzQ2xhc3MoICdoYXMtb3B0aW9ucycgKSApIHtcblx0XHRcdCR3cmFwcGVyLmFkZENsYXNzKCAnaGFzLW9wdGlvbnMnICk7XG5cdFx0fVxuXHR9ICk7XG5cblx0JHNlYXJjaEZvcm0ub24oICdpbnB1dCcsICcubnVtYmVyLW1hbnVhbC1vcHRpb25zLXRhYmxlIGlucHV0W3R5cGU9XCJ0ZXh0XCJdJywgZnVuY3Rpb24oKSB7XG5cdFx0Y29uc3QgJGZpZWxkID0gJCggdGhpcyApLmNsb3Nlc3QoICcud2NhcGYtZm9ybS1maWVsZCcgKTtcblxuXHRcdHRyaWdnZXJOdW1iZXJNYW51YWxPcHRpb25zQ2hhbmdlKCAkZmllbGQgKTtcblx0fSApO1xuXG5cdCRzZWFyY2hGb3JtLm9uKCAnYWZ0ZXJfdG9nZ2xlX3JlcXVlc3QnLCBmdW5jdGlvbiggZSwgaGFuZGxlciwgdmFsdWUsICRmaWVsZCApIHtcblx0XHRpZiAoICcud2NhcGYtZm9ybS1zdWItZmllbGQtbnVtYmVyX2Rpc3BsYXlfdHlwZSBzZWxlY3QnID09PSBoYW5kbGVyICkge1xuXHRcdFx0Y29uc3QgJGdldE9wdGlvbnMgICAgICAgICA9ICRmaWVsZC5maW5kKCAnLm51bWJlci1nZXQtb3B0aW9ucycgKTtcblx0XHRcdGNvbnN0ICRhdXRvT3B0aW9ucyAgICAgICAgPSAkZmllbGQuZmluZCggJy5udW1iZXItYXV0b21hdGljLW9wdGlvbnMnICk7XG5cdFx0XHRjb25zdCAkbWFudWFsT3B0aW9uc1RhYmxlID0gJGZpZWxkLmZpbmQoICcubnVtYmVyLW1hbnVhbC1vcHRpb25zLXRhYmxlJyApO1xuXHRcdFx0Y29uc3QgJGVsbSAgICAgICAgICAgICAgICA9ICRmaWVsZC5maW5kKCBoYW5kbGVyICk7XG5cdFx0XHRjb25zdCBkaXNwbGF5VHlwZSAgICAgICAgID0gJGVsbS52YWwoKTtcblxuXHRcdFx0aWYgKCAncmFuZ2Vfc2xpZGVyJyA9PT0gZGlzcGxheVR5cGUgfHwgJ3JhbmdlX251bWJlcicgPT09IGRpc3BsYXlUeXBlICkge1xuXHRcdFx0XHQkZ2V0T3B0aW9ucy5oaWRlKCk7XG5cdFx0XHRcdCRtYW51YWxPcHRpb25zVGFibGUuYWRkQ2xhc3MoICdmb3JjZS1oaWRlJyApO1xuXHRcdFx0XHQkYXV0b09wdGlvbnMuYWRkQ2xhc3MoICdmb3JjZS1zaG93JyApO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0JGdldE9wdGlvbnMuc2hvdygpO1xuXHRcdFx0XHQkbWFudWFsT3B0aW9uc1RhYmxlLnJlbW92ZUNsYXNzKCAnZm9yY2UtaGlkZScgKTtcblx0XHRcdFx0JGF1dG9PcHRpb25zLnJlbW92ZUNsYXNzKCAnZm9yY2Utc2hvdycgKTtcblx0XHRcdH1cblx0XHR9XG5cdH0gKTtcblxuXHRmdW5jdGlvbiB0b2dnbGVOdW1iZXJNaW5WYWx1ZUZpZWxkKCAkZWxtICkge1xuXHRcdGNvbnN0ICRmaWVsZCAgICAgPSAkZWxtLmNsb3Nlc3QoICcud2NhcGYtZm9ybS1maWVsZCcgKTtcblx0XHRjb25zdCAkdGV4dEZpZWxkID0gJGZpZWxkLmZpbmQoICcud2NhcGYtZm9ybS1zdWItZmllbGQtbWluX3ZhbHVlIGlucHV0W3R5cGU9XCJ0ZXh0XCJdJyApO1xuXG5cdFx0aWYgKCAkZWxtLmlzKCAnOmNoZWNrZWQnICkgKSB7XG5cdFx0XHQkdGV4dEZpZWxkLmF0dHIoICdkaXNhYmxlZCcsICdkaXNhYmxlZCcgKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0JHRleHRGaWVsZC5yZW1vdmVBdHRyKCAnZGlzYWJsZWQnICk7XG5cdFx0fVxuXHR9XG5cblx0JHNlYXJjaEZvcm0uZmluZCggJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1taW5fdmFsdWVfYXV0b19kZXRlY3QgaW5wdXRbdHlwZT1cImNoZWNrYm94XCJdJyApLmVhY2goIGZ1bmN0aW9uKCkge1xuXHRcdGNvbnN0ICR0aGlzID0gJCggdGhpcyApO1xuXG5cdFx0dG9nZ2xlTnVtYmVyTWluVmFsdWVGaWVsZCggJHRoaXMgKTtcblx0fSApO1xuXG5cdCRzZWFyY2hGb3JtLm9uKCAnY2xpY2snLCAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLW1pbl92YWx1ZV9hdXRvX2RldGVjdCBpbnB1dFt0eXBlPVwiY2hlY2tib3hcIl0nLCBmdW5jdGlvbigpIHtcblx0XHRjb25zdCAkdGhpcyA9ICQoIHRoaXMgKTtcblxuXHRcdHRvZ2dsZU51bWJlck1pblZhbHVlRmllbGQoICR0aGlzICk7XG5cdH0gKTtcblxuXHRmdW5jdGlvbiB0b2dnbGVOdW1iZXJNYXhWYWx1ZUZpZWxkKCAkZWxtICkge1xuXHRcdGNvbnN0ICRmaWVsZCAgICAgPSAkZWxtLmNsb3Nlc3QoICcud2NhcGYtZm9ybS1maWVsZCcgKTtcblx0XHRjb25zdCAkdGV4dEZpZWxkID0gJGZpZWxkLmZpbmQoICcud2NhcGYtZm9ybS1zdWItZmllbGQtbWF4X3ZhbHVlIGlucHV0W3R5cGU9XCJ0ZXh0XCJdJyApO1xuXG5cdFx0aWYgKCAkZWxtLmlzKCAnOmNoZWNrZWQnICkgKSB7XG5cdFx0XHQkdGV4dEZpZWxkLmF0dHIoICdkaXNhYmxlZCcsICdkaXNhYmxlZCcgKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0JHRleHRGaWVsZC5yZW1vdmVBdHRyKCAnZGlzYWJsZWQnICk7XG5cdFx0fVxuXHR9XG5cblx0JHNlYXJjaEZvcm0uZmluZCggJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1tYXhfdmFsdWVfYXV0b19kZXRlY3QgaW5wdXRbdHlwZT1cImNoZWNrYm94XCJdJyApLmVhY2goIGZ1bmN0aW9uKCkge1xuXHRcdGNvbnN0ICR0aGlzID0gJCggdGhpcyApO1xuXG5cdFx0dG9nZ2xlTnVtYmVyTWF4VmFsdWVGaWVsZCggJHRoaXMgKTtcblx0fSApO1xuXG5cdCRzZWFyY2hGb3JtLm9uKCAnY2xpY2snLCAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLW1heF92YWx1ZV9hdXRvX2RldGVjdCBpbnB1dFt0eXBlPVwiY2hlY2tib3hcIl0nLCBmdW5jdGlvbigpIHtcblx0XHRjb25zdCAkdGhpcyA9ICQoIHRoaXMgKTtcblxuXHRcdHRvZ2dsZU51bWJlck1heFZhbHVlRmllbGQoICR0aGlzICk7XG5cdH0gKTtcblxuXHQvLyBUb2dnbGUgc29mdCBsaW1pdCBmaWVsZHMgd2hlbiBkaXNwbGF5IHR5cGUgaXMgY2hhbmdlZC5cblx0JHNlYXJjaEZvcm0ub24oICdhZnRlcl90b2dnbGVfcmVxdWVzdCcsIGZ1bmN0aW9uKCBlLCBoYW5kbGVyLCB2YWx1ZSwgJGZpZWxkICkge1xuXHRcdGlmICggJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1kaXNwbGF5X3R5cGUgc2VsZWN0JyA9PT0gaGFuZGxlciApIHtcblx0XHRcdGNvbnN0ICRzb2Z0TGltaXRGaWVsZHMgPSAkZmllbGQuZmluZCggJy5zb2Z0LWxpbWl0LWZpZWxkcycgKTtcblx0XHRcdGNvbnN0ICR2YWx1ZVR5cGVGaWVsZCAgPSAkZmllbGQuZmluZCggJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC12YWx1ZV90eXBlIHNlbGVjdCcgKTtcblx0XHRcdGNvbnN0IHZhbHVlVHlwZSAgICAgICAgPSAkdmFsdWVUeXBlRmllbGQudmFsKCk7XG5cdFx0XHRjb25zdCBkaXNwbGF5VHlwZXMgICAgID0gWyAnY2hlY2tib3gnLCAncmFkaW8nIF07XG5cblx0XHRcdGlmICggJHZhbHVlVHlwZUZpZWxkLmxlbmd0aCApIHtcblx0XHRcdFx0aWYgKCAndGV4dCcgPT09IHZhbHVlVHlwZSApIHtcblx0XHRcdFx0XHRpZiAoIGRpc3BsYXlUeXBlcy5pbmNsdWRlcyggdmFsdWUgKSApIHtcblx0XHRcdFx0XHRcdCRzb2Z0TGltaXRGaWVsZHMuc2hvdygpO1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHQkc29mdExpbWl0RmllbGRzLmhpZGUoKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGlmICggZGlzcGxheVR5cGVzLmluY2x1ZGVzKCB2YWx1ZSApICkge1xuXHRcdFx0XHRcdCRzb2Z0TGltaXRGaWVsZHMuc2hvdygpO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdCRzb2Z0TGltaXRGaWVsZHMuaGlkZSgpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXHR9ICk7XG5cblx0Ly8gVG9nZ2xlIHNvZnQgbGltaXQgZmllbGRzIHdoZW4gbnVtYmVyIGRpc3BsYXkgdHlwZSBpcyBjaGFuZ2VkLlxuXHQkc2VhcmNoRm9ybS5vbiggJ2FmdGVyX3RvZ2dsZV9yZXF1ZXN0JywgZnVuY3Rpb24oIGUsIGhhbmRsZXIsIHZhbHVlLCAkZmllbGQgKSB7XG5cdFx0aWYgKCAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLW51bWJlcl9kaXNwbGF5X3R5cGUgc2VsZWN0JyA9PT0gaGFuZGxlciApIHtcblx0XHRcdGNvbnN0ICRzb2Z0TGltaXRGaWVsZHMgPSAkZmllbGQuZmluZCggJy5zb2Z0LWxpbWl0LWZpZWxkcycgKTtcblx0XHRcdGNvbnN0ICR2YWx1ZVR5cGVGaWVsZCAgPSAkZmllbGQuZmluZCggJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC12YWx1ZV90eXBlIHNlbGVjdCcgKTtcblx0XHRcdGNvbnN0IHZhbHVlVHlwZSAgICAgICAgPSAkdmFsdWVUeXBlRmllbGQudmFsKCk7XG5cdFx0XHRjb25zdCBkaXNwbGF5VHlwZXMgICAgID0gWyAncmFuZ2VfY2hlY2tib3gnLCAncmFuZ2VfcmFkaW8nIF07XG5cblx0XHRcdGlmICggJHZhbHVlVHlwZUZpZWxkLmxlbmd0aCApIHtcblx0XHRcdFx0aWYgKCAnbnVtYmVyJyA9PT0gdmFsdWVUeXBlICkge1xuXHRcdFx0XHRcdGlmICggZGlzcGxheVR5cGVzLmluY2x1ZGVzKCB2YWx1ZSApICkge1xuXHRcdFx0XHRcdFx0JHNvZnRMaW1pdEZpZWxkcy5zaG93KCk7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdCRzb2Z0TGltaXRGaWVsZHMuaGlkZSgpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0aWYgKCBkaXNwbGF5VHlwZXMuaW5jbHVkZXMoIHZhbHVlICkgKSB7XG5cdFx0XHRcdFx0JHNvZnRMaW1pdEZpZWxkcy5zaG93KCk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0JHNvZnRMaW1pdEZpZWxkcy5oaWRlKCk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cdH0gKTtcblxuXHQvLyBUb2dnbGUgc29mdCBsaW1pdCBmaWVsZHMgd2hlbiB2YWx1ZSB0eXBlIGlzIGNoYW5nZWQuXG5cdCRzZWFyY2hGb3JtLm9uKCAnYWZ0ZXJfdG9nZ2xlX3JlcXVlc3QnLCBmdW5jdGlvbiggZSwgaGFuZGxlciwgdmFsdWUsICRmaWVsZCApIHtcblx0XHRpZiAoICcud2NhcGYtZm9ybS1zdWItZmllbGQtdmFsdWVfdHlwZSBzZWxlY3QnID09PSBoYW5kbGVyICkge1xuXHRcdFx0Y29uc3QgJHNvZnRMaW1pdEZpZWxkcyA9ICRmaWVsZC5maW5kKCAnLnNvZnQtbGltaXQtZmllbGRzJyApO1xuXG5cdFx0XHRjb25zdCAkbnVtYmVyRGlzcGxheVR5cGVGaWVsZCA9ICRmaWVsZC5maW5kKCAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLW51bWJlcl9kaXNwbGF5X3R5cGUgc2VsZWN0JyApO1xuXHRcdFx0Y29uc3QgbnVtYmVyRGlzcGxheVR5cGUgICAgICAgPSAkbnVtYmVyRGlzcGxheVR5cGVGaWVsZC52YWwoKTtcblx0XHRcdGNvbnN0IG51bWJlckRpc3BsYXlUeXBlcyAgICAgID0gWyAncmFuZ2VfY2hlY2tib3gnLCAncmFuZ2VfcmFkaW8nIF07XG5cblx0XHRcdGNvbnN0ICR0ZXh0RGlzcGxheVR5cGVGaWVsZCA9ICRmaWVsZC5maW5kKCAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLWRpc3BsYXlfdHlwZSBzZWxlY3QnICk7XG5cdFx0XHRjb25zdCB0ZXh0RGlzcGxheVR5cGUgICAgICAgPSAkdGV4dERpc3BsYXlUeXBlRmllbGQudmFsKCk7XG5cdFx0XHRjb25zdCB0ZXh0RGlzcGxheVR5cGVzICAgICAgPSBbICdjaGVja2JveCcsICdyYWRpbycgXTtcblxuXHRcdFx0aWYgKCAnbnVtYmVyJyA9PT0gdmFsdWUgKSB7XG5cdFx0XHRcdGlmICggbnVtYmVyRGlzcGxheVR5cGVzLmluY2x1ZGVzKCBudW1iZXJEaXNwbGF5VHlwZSApICkge1xuXHRcdFx0XHRcdCRzb2Z0TGltaXRGaWVsZHMuc2hvdygpO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdCRzb2Z0TGltaXRGaWVsZHMuaGlkZSgpO1xuXHRcdFx0XHR9XG5cdFx0XHR9IGVsc2UgaWYgKCAndGV4dCcgPT09IHZhbHVlICkge1xuXHRcdFx0XHRpZiAoIHRleHREaXNwbGF5VHlwZXMuaW5jbHVkZXMoIHRleHREaXNwbGF5VHlwZSApICkge1xuXHRcdFx0XHRcdCRzb2Z0TGltaXRGaWVsZHMuc2hvdygpO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdCRzb2Z0TGltaXRGaWVsZHMuaGlkZSgpO1xuXHRcdFx0XHR9XG5cdFx0XHR9IGVsc2UgaWYgKCAnZGF0ZScgPT09IHZhbHVlICkge1xuXHRcdFx0XHQkc29mdExpbWl0RmllbGRzLmhpZGUoKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdCRzb2Z0TGltaXRGaWVsZHMuaGlkZSgpO1xuXHRcdFx0fVxuXHRcdH1cblx0fSApO1xuXG5cdC8vIFNldCB0aGUgdmFsdWUgdHlwZSB3aGVuIHBvc3QgcHJvcGVydHkgY2hhbmdlZC5cblx0JHNlYXJjaEZvcm0ub24oICdhZnRlcl90b2dnbGVfcmVxdWVzdCcsIGZ1bmN0aW9uKCBlLCBoYW5kbGVyLCB2YWx1ZSwgJGZpZWxkICkge1xuXHRcdGlmICggJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1wb3N0X3Byb3BlcnR5IHNlbGVjdCcgPT09IGhhbmRsZXIgKSB7XG5cdFx0XHRjb25zdCAkdmFsdWVUeXBlICAgICAgID0gJGZpZWxkLmZpbmQoICcud2NhcGYtZm9ybS1zdWItZmllbGQtdmFsdWVfdHlwZSBzZWxlY3QnICk7XG5cdFx0XHRjb25zdCBwYXJhbXMgICAgICAgICAgID0gd2luZG93WyAnd2NhcGZfYWRtaW5fcGFyYW1zJyBdO1xuXHRcdFx0Y29uc3QgcG9zdFByb3BlcnR5RGF0YSA9IHBhcmFtc1sgJ3Bvc3RfcHJvcGVydHlfZGF0YScgXTtcblxuXHRcdFx0aWYgKCAhIHBvc3RQcm9wZXJ0eURhdGEgKSB7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblxuXHRcdFx0bGV0IHZhbHVlVHlwZSA9IHBvc3RQcm9wZXJ0eURhdGFbIHZhbHVlIF07XG5cblx0XHRcdGlmICggISB2YWx1ZVR5cGUgKSB7XG5cdFx0XHRcdHZhbHVlVHlwZSA9ICcnO1xuXHRcdFx0fVxuXG5cdFx0XHQkdmFsdWVUeXBlLnZhbCggdmFsdWVUeXBlICkuY2hhbmdlKCk7XG5cdFx0fVxuXHR9ICk7XG5cbn0gKTtcbiIsIi8qKlxuICogVGhlIHByb2R1Y3Qgc3RhdHVzIGZpZWxkLlxuICpcbiAqIEBzaW5jZSAgICAgIDMuMC4wXG4gKiBAcGFja2FnZSAgICB3Yy1hamF4LXByb2R1Y3QtZmlsdGVyXG4gKiBAc3VicGFja2FnZSB3Yy1hamF4LXByb2R1Y3QtZmlsdGVyL2FkbWluL3NyYy9qc1xuICogQGF1dGhvciAgICAgTWFpbnVsIEhhc3NhbiBNYWluXG4gKi9cblxualF1ZXJ5KCBkb2N1bWVudCApLnJlYWR5KCBmdW5jdGlvbiggJCApIHtcblxuXHRjb25zdCAkc2VhcmNoRm9ybSA9ICQoICcjc2VhcmNoLWZvcm0nICk7XG5cblx0ZnVuY3Rpb24gdHJpZ2dlclByb2R1Y3RTdGF0dXNPcHRpb25zQ2hhbmdlKCAkZmllbGQgKSB7XG5cdFx0Y29uc3QgJHZhbHVlSG9sZGVyICA9ICRmaWVsZC5maW5kKCAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLXByb2R1Y3Rfc3RhdHVzX29wdGlvbnMgaW5wdXQnICk7XG5cdFx0Y29uc3QgJG9wdGlvbnNUYWJsZSA9ICRmaWVsZC5maW5kKCAnLnByb2R1Y3Qtc3RhdHVzLW9wdGlvbnMtdGFibGUnICk7XG5cdFx0Y29uc3QgJHJvd3MgICAgICAgICA9ICRvcHRpb25zVGFibGUuZmluZCggJy5tYW51YWwtb3B0aW9ucy10YWJsZS1ib2R5LXJvd3MnICk7XG5cdFx0Y29uc3QgX3Jvd3MgICAgICAgICA9IFtdO1xuXG5cdFx0JHJvd3MuZmluZCggJy5pdGVtJyApLmVhY2goIGZ1bmN0aW9uKCBpLCBfaXRlbSApIHtcblx0XHRcdGNvbnN0ICRpdGVtID0gJCggX2l0ZW0gKTtcblx0XHRcdGNvbnN0IHZhbHVlID0gJGl0ZW0uZmluZCggJy5vcHRpb25fdmFsdWUnICkudmFsKCk7XG5cdFx0XHRjb25zdCBsYWJlbCA9ICRpdGVtLmZpbmQoICcub3B0aW9uX2xhYmVsJyApLnZhbCgpO1xuXG5cdFx0XHRjb25zb2xlLmxvZyggJ3ZhbHVlJywgdmFsdWUgKTtcblx0XHRcdGNvbnNvbGUubG9nKCAnbGFiZWwnLCBsYWJlbCApO1xuXG5cdFx0XHRpZiAoIHZhbHVlICkge1xuXHRcdFx0XHRfcm93cy5wdXNoKCBbIHZhbHVlLCBsYWJlbCBdICk7XG5cdFx0XHR9XG5cdFx0fSApO1xuXG5cdFx0Y29uc3QgcmF3VmFsdWVzID0gZW5jb2RlVVJJQ29tcG9uZW50KCBKU09OLnN0cmluZ2lmeSggX3Jvd3MgKSApO1xuXHRcdCR2YWx1ZUhvbGRlci52YWwoIHJhd1ZhbHVlcyApO1xuXHR9XG5cblx0ZnVuY3Rpb24gaW5pdFNvcnRhYmxlRm9yUHJvZHVjdFN0YXR1c09wdGlvbnMoICRzZWxlY3RvciApIHtcblx0XHQkc2VsZWN0b3Iuc29ydGFibGUoIHtcblx0XHRcdG9wYWNpdHk6IDAuOCxcblx0XHRcdHJldmVydDogZmFsc2UsXG5cdFx0XHRjdXJzb3I6ICdtb3ZlJyxcblx0XHRcdGF4aXM6ICd5Jyxcblx0XHRcdGhhbmRsZTogJy5tb3ZlLW9wdGlvbnMtaGFuZGxlcicsXG5cdFx0XHRwbGFjZWhvbGRlcjogJ3dpZGdldC1wbGFjZWhvbGRlcicsXG5cdFx0XHR1cGRhdGU6IGZ1bmN0aW9uKCBlICkge1xuXHRcdFx0XHRjb25zdCAkZmllbGQgPSAkKCBlLnRhcmdldCApLmNsb3Nlc3QoICcud2NhcGYtZm9ybS1maWVsZCcgKTtcblxuXHRcdFx0XHR0cmlnZ2VyUHJvZHVjdFN0YXR1c09wdGlvbnNDaGFuZ2UoICRmaWVsZCApO1xuXHRcdFx0fVxuXHRcdH0gKS5kaXNhYmxlU2VsZWN0aW9uKCk7XG5cdH1cblxuXHQvLyBTb3J0IE1hbnVhbCBPcHRpb25zXG5cdGluaXRTb3J0YWJsZUZvclByb2R1Y3RTdGF0dXNPcHRpb25zKCAkc2VhcmNoRm9ybS5maW5kKCAnLnByb2R1Y3Qtc3RhdHVzLW9wdGlvbnMtdGFibGUgLm1hbnVhbC1vcHRpb25zLXRhYmxlLWJvZHktcm93cycgKSApO1xuXG5cdCRzZWFyY2hGb3JtLm9uKCAnZmllbGRfYWRkZWQnLCBmdW5jdGlvbiggZSwgdWkgKSB7XG5cdFx0Ly8gSW5pdCBTb3J0YWJsZSBmb3IgdGhlIG1hbnVhbCBvcHRpb25zLlxuXHRcdGluaXRTb3J0YWJsZUZvclByb2R1Y3RTdGF0dXNPcHRpb25zKCAkKCB1aS5pdGVtLmZpbmQoICcubWFudWFsLW9wdGlvbnMtdGFibGUtYm9keS1yb3dzJyApICkgKTtcblx0fSApO1xuXG5cdGZ1bmN0aW9uIHRyaWdnZXJSZW1vdmVQcm9kdWN0U3RhdHVzT3B0aW9uKCAkZmllbGQgKSB7XG5cdFx0Y29uc3QgJG9wdGlvbnNUYWJsZSA9ICRmaWVsZC5maW5kKCAnLnByb2R1Y3Qtc3RhdHVzLW9wdGlvbnMtdGFibGUnICk7XG5cdFx0Y29uc3QgdGFibGVSb3dzICAgICA9ICRvcHRpb25zVGFibGUuZmluZCggJy5tYW51YWwtb3B0aW9ucy10YWJsZS1ib2R5LXJvd3MnICkuY2hpbGRyZW4oKTtcblxuXHRcdGlmICggMiA+IHRhYmxlUm93cy5sZW5ndGggKSB7XG5cdFx0XHQkb3B0aW9uc1RhYmxlLnJlbW92ZUNsYXNzKCAnaGFzLW9wdGlvbnMnICk7XG5cdFx0fVxuXHR9XG5cblx0Ly8gUmVtb3ZlIFNpbmdsZSBOdW1iZXIgT3B0aW9uXG5cdCRzZWFyY2hGb3JtLm9uKCAnY2xpY2snLCAnLnJlbW92ZS1wcm9kdWN0LXN0YXR1cy1vcHRpb24nLCBmdW5jdGlvbigpIHtcblx0XHRjb25zdCAkaXRlbSAgPSAkKCB0aGlzICkuY2xvc2VzdCggJy5pdGVtJyApO1xuXHRcdGNvbnN0ICRmaWVsZCA9ICRpdGVtLmNsb3Nlc3QoICcud2NhcGYtZm9ybS1maWVsZCcgKTtcblxuXHRcdHRyaWdnZXJSZW1vdmVQcm9kdWN0U3RhdHVzT3B0aW9uKCAkZmllbGQgKTtcblxuXHRcdCRpdGVtLnJlbW92ZSgpO1xuXG5cdFx0dHJpZ2dlclByb2R1Y3RTdGF0dXNPcHRpb25zQ2hhbmdlKCAkZmllbGQgKTtcblx0fSApO1xuXG5cdC8vIENsZWFyIEFsbCBPcHRpb25zXG5cdCRzZWFyY2hGb3JtLm9uKCAnY2xpY2snLCAnLmNsZWFyLWFsbC1wcm9kdWN0LXN0YXR1cy1vcHRpb25zJywgZnVuY3Rpb24oKSB7XG5cdFx0Y29uc3QgJGZpZWxkICAgICAgICA9ICQoIHRoaXMgKS5jbG9zZXN0KCAnLndjYXBmLWZvcm0tZmllbGQnICk7XG5cdFx0Y29uc3QgJG9wdGlvbnNUYWJsZSA9ICRmaWVsZC5maW5kKCAnLnByb2R1Y3Qtc3RhdHVzLW9wdGlvbnMtdGFibGUnICk7XG5cblx0XHQkb3B0aW9uc1RhYmxlLmZpbmQoICcubWFudWFsLW9wdGlvbnMtdGFibGUtYm9keS1yb3dzJyApLmVtcHR5KCk7XG5cblx0XHR0cmlnZ2VyUmVtb3ZlUHJvZHVjdFN0YXR1c09wdGlvbiggJGZpZWxkICk7XG5cblx0XHR0cmlnZ2VyUHJvZHVjdFN0YXR1c09wdGlvbnNDaGFuZ2UoICRmaWVsZCApO1xuXHR9ICk7XG5cblx0Ly8gQWRkIE5ldyBPcHRpb25cblx0JHNlYXJjaEZvcm0ub24oICdjbGljaycsICcuYWRkLXByb2R1Y3Qtc3RhdHVzLW9wdGlvbicsIGZ1bmN0aW9uKCkge1xuXHRcdGNvbnN0IGZpZWxkVHlwZSA9ICd3Y2FwZi1wcm9kdWN0LXN0YXR1cy1vcHRpb24nO1xuXG5cdFx0Ly8gQmFpbCBvdXQgaWYgbm8gdG1wbCBmb3VuZCBmb3IgdGhlIHR5cGUuXG5cdFx0aWYgKCAhIGpRdWVyeSggJyN0bXBsLScgKyBmaWVsZFR5cGUgKS5sZW5ndGggKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0Y29uc3QgJGZpZWxkID0gJCggdGhpcyApLmNsb3Nlc3QoICcud2NhcGYtZm9ybS1maWVsZCcgKTtcblxuXHRcdGNvbnN0IHRlbXBsYXRlID0gd3AudGVtcGxhdGUoIGZpZWxkVHlwZSApO1xuXHRcdGNvbnN0IHJlbmRlcmVkID0gdGVtcGxhdGUoIHsgdmFsdWU6ICcnLCBsYWJlbDogJycgfSApO1xuXHRcdGNvbnN0ICR3cmFwcGVyID0gJGZpZWxkLmZpbmQoICcucHJvZHVjdC1zdGF0dXMtb3B0aW9ucy10YWJsZScgKTtcblx0XHRjb25zdCAkcm93cyAgICA9ICR3cmFwcGVyLmZpbmQoICcubWFudWFsLW9wdGlvbnMtdGFibGUtYm9keS1yb3dzJyApO1xuXG5cdFx0JHJvd3MuYXBwZW5kKCByZW5kZXJlZCApO1xuXG5cdFx0dHJpZ2dlclByb2R1Y3RTdGF0dXNPcHRpb25zQ2hhbmdlKCAkZmllbGQgKTtcblxuXHRcdGlmICggISAkd3JhcHBlci5oYXNDbGFzcyggJ2hhcy1vcHRpb25zJyApICkge1xuXHRcdFx0JHdyYXBwZXIuYWRkQ2xhc3MoICdoYXMtb3B0aW9ucycgKTtcblx0XHR9XG5cdH0gKTtcblxuXHQkc2VhcmNoRm9ybS5vbiggJ2lucHV0JywgJy5wcm9kdWN0LXN0YXR1cy1vcHRpb25zLXRhYmxlIGlucHV0W3R5cGU9XCJ0ZXh0XCJdJywgZnVuY3Rpb24oKSB7XG5cdFx0Y29uc3QgJGZpZWxkID0gJCggdGhpcyApLmNsb3Nlc3QoICcud2NhcGYtZm9ybS1maWVsZCcgKTtcblxuXHRcdHRyaWdnZXJQcm9kdWN0U3RhdHVzT3B0aW9uc0NoYW5nZSggJGZpZWxkICk7XG5cdH0gKTtcblxuXHQkc2VhcmNoRm9ybS5vbiggJ2NoYW5nZScsICcucHJvZHVjdC1zdGF0dXMtb3B0aW9ucy10YWJsZSAub3B0aW9uX3ZhbHVlJywgZnVuY3Rpb24oKSB7XG5cdFx0Y29uc3QgJGZpZWxkID0gJCggdGhpcyApLmNsb3Nlc3QoICcud2NhcGYtZm9ybS1maWVsZCcgKTtcblxuXHRcdHRyaWdnZXJQcm9kdWN0U3RhdHVzT3B0aW9uc0NoYW5nZSggJGZpZWxkICk7XG5cdH0gKTtcblxufSApO1xuIiwiLyoqXG4gKiBUaGUgc2VhcmNoIGZvcm0gZmllbGQuXG4gKlxuICogQHNpbmNlICAgICAgMy4wLjBcbiAqIEBwYWNrYWdlICAgIHdjLWFqYXgtcHJvZHVjdC1maWx0ZXJcbiAqIEBzdWJwYWNrYWdlIHdjLWFqYXgtcHJvZHVjdC1maWx0ZXIvYWRtaW4vc3JjL2pzXG4gKiBAYXV0aG9yICAgICBNYWludWwgSGFzc2FuIE1haW5cbiAqL1xuXG5qUXVlcnkoIGRvY3VtZW50ICkucmVhZHkoIGZ1bmN0aW9uKCAkICkge1xuXG5cdGNvbnN0ICRzZWFyY2hGb3JtID0gJCggJyNzZWFyY2gtZm9ybScgKTtcblxuXHRjb25zdCBkZXBlbmRhbnREYXRhID0gW1xuXHRcdHtcblx0XHRcdCdoYW5kbGVyJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC12YWx1ZV90eXBlIHNlbGVjdCcsXG5cdFx0XHQnaGFuZGxlclR5cGUnOiAnc2VsZWN0Jyxcblx0XHRcdCdldmVudCc6ICdjaGFuZ2UnLFxuXHRcdFx0J2RlcGVuZGFudCc6IFtcblx0XHRcdFx0e1xuXHRcdFx0XHRcdCdzZWxlY3Rvcic6ICcuaW5wdXQtdHlwZS10ZXh0LWZpZWxkcycsXG5cdFx0XHRcdFx0J3ZhbHVlJzogWyAndGV4dCcgXSxcblx0XHRcdFx0fSxcblx0XHRcdFx0e1xuXHRcdFx0XHRcdCdzZWxlY3Rvcic6ICcuaW5wdXQtdHlwZS1udW1iZXItZmllbGRzJyxcblx0XHRcdFx0XHQndmFsdWUnOiBbICdudW1iZXInIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLmlucHV0LXR5cGUtZGF0ZS1maWVsZHMnLFxuXHRcdFx0XHRcdCd2YWx1ZSc6IFsgJ2RhdGUnIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRdLFxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0J2hhbmRsZXInOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLWRpc3BsYXlfdHlwZSBzZWxlY3QnLFxuXHRcdFx0J2hhbmRsZXJUeXBlJzogJ3NlbGVjdCcsXG5cdFx0XHQnZXZlbnQnOiAnY2hhbmdlJyxcblx0XHRcdCdkZXBlbmRhbnQnOiBbXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLXF1ZXJ5X3R5cGUnLFxuXHRcdFx0XHRcdCd2YWx1ZSc6IFsgJ2NoZWNrYm94JywgJ211bHRpLXNlbGVjdCcgXSxcblx0XHRcdFx0fSxcblx0XHRcdFx0e1xuXHRcdFx0XHRcdCdzZWxlY3Rvcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtYWxsX2l0ZW1zX2xhYmVsJyxcblx0XHRcdFx0XHQndmFsdWUnOiBbICdyYWRpbycsICdzZWxlY3QnIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLXVzZV9jaG9zZW4nLFxuXHRcdFx0XHRcdCd2YWx1ZSc6IFsgJ3NlbGVjdCcsICdtdWx0aS1zZWxlY3QnIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRdLFxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0J2hhbmRsZXInOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLXVzZV9jaG9zZW4gaW5wdXQnLFxuXHRcdFx0J2hhbmRsZXJUeXBlJzogJ2NoZWNrYm94Jyxcblx0XHRcdCdldmVudCc6ICdjaGFuZ2UnLFxuXHRcdFx0J2RlcGVuZGFudCc6IFtcblx0XHRcdFx0e1xuXHRcdFx0XHRcdCdzZWxlY3Rvcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtY2hvc2VuX25vX3Jlc3VsdHNfbWVzc2FnZScsXG5cdFx0XHRcdFx0J3ZhbHVlJzogWyAnMScgXSxcblx0XHRcdFx0fSxcblx0XHRcdF0sXG5cdFx0fSxcblx0XHR7XG5cdFx0XHQnaGFuZGxlcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtZ2V0X29wdGlvbnMgaW5wdXQnLFxuXHRcdFx0J2hhbmRsZXJUeXBlJzogJ3JhZGlvJyxcblx0XHRcdCdldmVudCc6ICdjaGFuZ2UnLFxuXHRcdFx0J2RlcGVuZGFudCc6IFtcblx0XHRcdFx0e1xuXHRcdFx0XHRcdCdzZWxlY3Rvcic6ICcuY29sdW1uLWdyb3VwLW1ldGFfa2V5X21hbnVhbF9vcHRpb25zJyxcblx0XHRcdFx0XHQndmFsdWUnOiBbICdtYW51YWxfZW50cnknIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRdLFxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0J2hhbmRsZXInOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLW51bWJlcl9kaXNwbGF5X3R5cGUgc2VsZWN0Jyxcblx0XHRcdCdoYW5kbGVyVHlwZSc6ICdzZWxlY3QnLFxuXHRcdFx0J2V2ZW50JzogJ2NoYW5nZScsXG5cdFx0XHQnZGVwZW5kYW50JzogW1xuXHRcdFx0XHR7XG5cdFx0XHRcdFx0J3NlbGVjdG9yJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1udW1iZXJfcmFuZ2Vfc2xpZGVyX2Rpc3BsYXlfdmFsdWVzX2FzJyxcblx0XHRcdFx0XHQndmFsdWUnOiBbICdyYW5nZV9zbGlkZXInIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLW51bWJlcl9yYW5nZV9xdWVyeV90eXBlJyxcblx0XHRcdFx0XHQndmFsdWUnOiBbICdyYW5nZV9jaGVja2JveCcsICdyYW5nZV9tdWx0aXNlbGVjdCcgXSxcblx0XHRcdFx0fSxcblx0XHRcdFx0e1xuXHRcdFx0XHRcdCdzZWxlY3Rvcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtbnVtYmVyX3JhbmdlX3NlbGVjdF9hbGxfaXRlbXNfbGFiZWwnLFxuXHRcdFx0XHRcdCd2YWx1ZSc6IFsgJ3JhbmdlX3JhZGlvJywgJ3JhbmdlX3NlbGVjdCcgXSxcblx0XHRcdFx0fSxcblx0XHRcdFx0e1xuXHRcdFx0XHRcdCdzZWxlY3Rvcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtbnVtYmVyX3JhbmdlX3VzZV9jaG9zZW4nLFxuXHRcdFx0XHRcdCd2YWx1ZSc6IFsgJ3JhbmdlX3NlbGVjdCcsICdyYW5nZV9tdWx0aXNlbGVjdCcgXSxcblx0XHRcdFx0fSxcblx0XHRcdFx0e1xuXHRcdFx0XHRcdCdzZWxlY3Rvcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtbnVtYmVyX3JhbmdlX3Nob3dfY291bnQnLFxuXHRcdFx0XHRcdCd2YWx1ZSc6IFsgJ3JhbmdlX2NoZWNrYm94JywgJ3JhbmdlX3JhZGlvJywgJ3JhbmdlX3NlbGVjdCcsICdyYW5nZV9tdWx0aXNlbGVjdCcgXSxcblx0XHRcdFx0fSxcblx0XHRcdFx0e1xuXHRcdFx0XHRcdCdzZWxlY3Rvcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtbnVtYmVyX3JhbmdlX2hpZGVfZW1wdHknLFxuXHRcdFx0XHRcdCd2YWx1ZSc6IFsgJ3JhbmdlX2NoZWNrYm94JywgJ3JhbmdlX3JhZGlvJywgJ3JhbmdlX3NlbGVjdCcsICdyYW5nZV9tdWx0aXNlbGVjdCcgXSxcblx0XHRcdFx0fSxcblx0XHRcdFx0e1xuXHRcdFx0XHRcdCdzZWxlY3Rvcic6ICcubnVtYmVyLWRlY2ltYWwtZmllbGRzJyxcblx0XHRcdFx0XHQndmFsdWUnOiBbICdyYW5nZV9zbGlkZXInLCAncmFuZ2VfY2hlY2tib3gnLCAncmFuZ2VfcmFkaW8nLCAncmFuZ2Vfc2VsZWN0JywgJ3JhbmdlX211bHRpc2VsZWN0JyBdLFxuXHRcdFx0XHR9LFxuXHRcdFx0XSxcblx0XHR9LFxuXHRcdHtcblx0XHRcdCdoYW5kbGVyJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1udW1iZXJfcmFuZ2VfdXNlX2Nob3NlbiBpbnB1dCcsXG5cdFx0XHQnaGFuZGxlclR5cGUnOiAnY2hlY2tib3gnLFxuXHRcdFx0J2V2ZW50JzogJ2NoYW5nZScsXG5cdFx0XHQnZGVwZW5kYW50JzogW1xuXHRcdFx0XHR7XG5cdFx0XHRcdFx0J3NlbGVjdG9yJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1udW1iZXJfcmFuZ2VfY2hvc2VuX25vX3Jlc3VsdHNfbWVzc2FnZScsXG5cdFx0XHRcdFx0J3ZhbHVlJzogWyAnMScgXSxcblx0XHRcdFx0fSxcblx0XHRcdF0sXG5cdFx0fSxcblx0XHR7XG5cdFx0XHQnaGFuZGxlcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtbnVtYmVyX2dldF9vcHRpb25zIGlucHV0Jyxcblx0XHRcdCdoYW5kbGVyVHlwZSc6ICdyYWRpbycsXG5cdFx0XHQnZXZlbnQnOiAnY2hhbmdlJyxcblx0XHRcdCdkZXBlbmRhbnQnOiBbXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLm51bWJlci1hdXRvbWF0aWMtb3B0aW9ucycsXG5cdFx0XHRcdFx0J3ZhbHVlJzogWyAnYXV0b21hdGljYWxseScgXSxcblx0XHRcdFx0fSxcblx0XHRcdFx0e1xuXHRcdFx0XHRcdCdzZWxlY3Rvcic6ICcubnVtYmVyLW1hbnVhbC1vcHRpb25zLXRhYmxlJyxcblx0XHRcdFx0XHQndmFsdWUnOiBbICdtYW51YWxfZW50cnknIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRdLFxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0J2hhbmRsZXInOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLWRhdGVfaW5wdXRfdHlwZSBzZWxlY3QnLFxuXHRcdFx0J2hhbmRsZXJUeXBlJzogJ3NlbGVjdCcsXG5cdFx0XHQnZXZlbnQnOiAnY2hhbmdlJyxcblx0XHRcdCdkZXBlbmRhbnQnOiBbXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLmRhdGUtdG8tdWktb3B0aW9ucycsXG5cdFx0XHRcdFx0J3ZhbHVlJzogWyAncmFuZ2VfZGF0ZScgXSxcblx0XHRcdFx0fSxcblx0XHRcdF0sXG5cdFx0fSxcblx0XHR7XG5cdFx0XHQnaGFuZGxlcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtbGltaXRfdGVybXMgc2VsZWN0Jyxcblx0XHRcdCdoYW5kbGVyVHlwZSc6ICdzZWxlY3QnLFxuXHRcdFx0J2V2ZW50JzogJ2NoYW5nZScsXG5cdFx0XHQnZGVwZW5kYW50JzogW1xuXHRcdFx0XHR7XG5cdFx0XHRcdFx0J3NlbGVjdG9yJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1wYXJlbnRfdGVybScsXG5cdFx0XHRcdFx0J3ZhbHVlJzogWyAnY2hpbGQnIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLWxpbWl0X3Rlcm1zX2J5X2lkJyxcblx0XHRcdFx0XHQndmFsdWUnOiBbICdpbmNsdWRlJywgJ2V4Y2x1ZGUnIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRdLFxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0J2hhbmRsZXInOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLWVuYWJsZV9zb2Z0X2xpbWl0IGlucHV0Jyxcblx0XHRcdCdoYW5kbGVyVHlwZSc6ICdyYWRpbycsXG5cdFx0XHQnZXZlbnQnOiAnY2hhbmdlJyxcblx0XHRcdCdkZXBlbmRhbnQnOiBbXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLXNvZnRfbGltaXQnLFxuXHRcdFx0XHRcdCd2YWx1ZSc6IFsgJ2VuYWJsZScgXSxcblx0XHRcdFx0fSxcblx0XHRcdF0sXG5cdFx0fSxcblx0XHR7XG5cdFx0XHQnaGFuZGxlcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtY3VzdG9tLXRheG9ub215IHNlbGVjdCcsXG5cdFx0XHQnaGFuZGxlclR5cGUnOiAnc2VsZWN0Jyxcblx0XHRcdCdldmVudCc6ICdjaGFuZ2UnLFxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0J2hhbmRsZXInOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLXBvc3RfcHJvcGVydHkgc2VsZWN0Jyxcblx0XHRcdCdoYW5kbGVyVHlwZSc6ICdzZWxlY3QnLFxuXHRcdFx0J2V2ZW50JzogJ2NoYW5nZScsXG5cdFx0fSxcblx0XTtcblxuXHRmdW5jdGlvbiBfdHJpZ2dlcklucHV0VHlwZVRleHREaXNwbGF5VHlwZUNoYW5nZSggdmFsdWUsICRmaWVsZCApIHtcblx0XHRjb25zdCAkbm9SZXN1bHRzICAgICA9ICRmaWVsZC5maW5kKCAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLWNob3Nlbl9ub19yZXN1bHRzX21lc3NhZ2UnICk7XG5cdFx0Y29uc3QgJGFsbEl0ZW1zTGFiZWwgPSAkZmllbGQuZmluZCggJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1hbGxfaXRlbXNfbGFiZWwnICk7XG5cdFx0Y29uc3QgdXNlQ2hvc2VuICAgICAgPSAkZmllbGQuZmluZCggJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC11c2VfY2hvc2VuIGlucHV0JyApLmlzKCAnOmNoZWNrZWQnICk7XG5cblx0XHRpZiAoIHVzZUNob3NlbiAmJiAoICdzZWxlY3QnID09PSB2YWx1ZSB8fCAnbXVsdGktc2VsZWN0JyA9PT0gdmFsdWUgKSApIHtcblx0XHRcdCRub1Jlc3VsdHMuc2hvdygpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHQkbm9SZXN1bHRzLmhpZGUoKTtcblx0XHR9XG5cblx0XHRpZiAoICggJ3JhZGlvJyA9PT0gdmFsdWUgfHwgJ3NlbGVjdCcgPT09IHZhbHVlICkgfHwgKCAnbXVsdGktc2VsZWN0JyA9PT0gdmFsdWUgJiYgdXNlQ2hvc2VuICkgKSB7XG5cdFx0XHQkYWxsSXRlbXNMYWJlbC5zaG93KCk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdCRhbGxJdGVtc0xhYmVsLmhpZGUoKTtcblx0XHR9XG5cdH1cblxuXHRmdW5jdGlvbiBfdHJpZ2dlcklucHV0VHlwZU51bWJlckRpc3BsYXlUeXBlQ2hhbmdlKCB2YWx1ZSwgJGZpZWxkICkge1xuXHRcdGNvbnN0ICRub1Jlc3VsdHMgICAgID0gJGZpZWxkLmZpbmQoICcud2NhcGYtZm9ybS1zdWItZmllbGQtbnVtYmVyX3JhbmdlX2Nob3Nlbl9ub19yZXN1bHRzX21lc3NhZ2UnICk7XG5cdFx0Y29uc3QgJGFsbEl0ZW1zTGFiZWwgPSAkZmllbGQuZmluZCggJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1udW1iZXJfcmFuZ2Vfc2VsZWN0X2FsbF9pdGVtc19sYWJlbCcgKTtcblx0XHRjb25zdCB1c2VDaG9zZW4gICAgICA9ICRmaWVsZC5maW5kKCAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLW51bWJlcl9yYW5nZV91c2VfY2hvc2VuIGlucHV0JyApLmlzKCAnOmNoZWNrZWQnICk7XG5cblx0XHRpZiAoIHVzZUNob3NlbiAmJiAoICdyYW5nZV9zZWxlY3QnID09PSB2YWx1ZSB8fCAncmFuZ2VfbXVsdGlzZWxlY3QnID09PSB2YWx1ZSApICkge1xuXHRcdFx0JG5vUmVzdWx0cy5zaG93KCk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdCRub1Jlc3VsdHMuaGlkZSgpO1xuXHRcdH1cblxuXHRcdGlmICggKCAncmFuZ2VfcmFkaW8nID09PSB2YWx1ZSB8fCAncmFuZ2Vfc2VsZWN0JyA9PT0gdmFsdWUgKSB8fCAoICdyYW5nZV9tdWx0aXNlbGVjdCcgPT09IHZhbHVlICYmIHVzZUNob3NlbiApICkge1xuXHRcdFx0JGFsbEl0ZW1zTGFiZWwuc2hvdygpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHQkYWxsSXRlbXNMYWJlbC5oaWRlKCk7XG5cdFx0fVxuXHR9XG5cblx0ZnVuY3Rpb24gX3RyaWdnZXJJbnB1dFR5cGVUZXh0VXNlU2VsZWN0Q2hhbmdlKCB2YWx1ZSwgJGZpZWxkICkge1xuXHRcdGNvbnN0ICRub1Jlc3VsdHMgICAgID0gJGZpZWxkLmZpbmQoICcud2NhcGYtZm9ybS1zdWItZmllbGQtY2hvc2VuX25vX3Jlc3VsdHNfbWVzc2FnZScgKTtcblx0XHRjb25zdCAkYWxsSXRlbXNMYWJlbCA9ICRmaWVsZC5maW5kKCAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLWFsbF9pdGVtc19sYWJlbCcgKTtcblx0XHRjb25zdCBkaXNwbGF5VHlwZSAgICA9ICRmaWVsZC5maW5kKCAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLWRpc3BsYXlfdHlwZSBzZWxlY3QnICkudmFsKCk7XG5cblx0XHRpZiAoICcxJyA9PT0gdmFsdWUgJiYgKCAnc2VsZWN0JyA9PT0gZGlzcGxheVR5cGUgfHwgJ211bHRpLXNlbGVjdCcgPT09IGRpc3BsYXlUeXBlICkgKSB7XG5cdFx0XHQkbm9SZXN1bHRzLnNob3coKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0JG5vUmVzdWx0cy5oaWRlKCk7XG5cdFx0fVxuXG5cdFx0aWYgKFxuXHRcdFx0KCAnMScgPT09IHZhbHVlICYmICdtdWx0aS1zZWxlY3QnID09PSBkaXNwbGF5VHlwZSApXG5cdFx0XHR8fCAoICdyYWRpbycgPT09IGRpc3BsYXlUeXBlIHx8ICdzZWxlY3QnID09PSBkaXNwbGF5VHlwZSApXG5cdFx0KSB7XG5cdFx0XHQkYWxsSXRlbXNMYWJlbC5zaG93KCk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdCRhbGxJdGVtc0xhYmVsLmhpZGUoKTtcblx0XHR9XG5cdH1cblxuXHRmdW5jdGlvbiBfdHJpZ2dlcklucHV0VHlwZU51bWJlclVzZVNlbGVjdENoYW5nZSggdmFsdWUsICRmaWVsZCApIHtcblx0XHRjb25zdCAkbm9SZXN1bHRzICAgICA9ICRmaWVsZC5maW5kKCAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLW51bWJlcl9yYW5nZV9jaG9zZW5fbm9fcmVzdWx0c19tZXNzYWdlJyApO1xuXHRcdGNvbnN0ICRhbGxJdGVtc0xhYmVsID0gJGZpZWxkLmZpbmQoICcud2NhcGYtZm9ybS1zdWItZmllbGQtbnVtYmVyX3JhbmdlX3NlbGVjdF9hbGxfaXRlbXNfbGFiZWwnICk7XG5cdFx0Y29uc3QgZGlzcGxheVR5cGUgICAgPSAkZmllbGQuZmluZCggJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1udW1iZXJfZGlzcGxheV90eXBlIHNlbGVjdCcgKS52YWwoKTtcblxuXHRcdGlmICggJzEnID09PSB2YWx1ZSAmJiAoICdyYW5nZV9zZWxlY3QnID09PSBkaXNwbGF5VHlwZSB8fCAncmFuZ2VfbXVsdGlzZWxlY3QnID09PSBkaXNwbGF5VHlwZSApICkge1xuXHRcdFx0JG5vUmVzdWx0cy5zaG93KCk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdCRub1Jlc3VsdHMuaGlkZSgpO1xuXHRcdH1cblxuXHRcdGlmIChcblx0XHRcdCggJzEnID09PSB2YWx1ZSAmJiAncmFuZ2VfbXVsdGlzZWxlY3QnID09PSBkaXNwbGF5VHlwZSApXG5cdFx0XHR8fCAoICdyYW5nZV9yYWRpbycgPT09IGRpc3BsYXlUeXBlIHx8ICdyYW5nZV9zZWxlY3QnID09PSBkaXNwbGF5VHlwZSApXG5cdFx0KSB7XG5cdFx0XHQkYWxsSXRlbXNMYWJlbC5zaG93KCk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdCRhbGxJdGVtc0xhYmVsLmhpZGUoKTtcblx0XHR9XG5cdH1cblxuXHRmdW5jdGlvbiBfaGFuZGxlVG9nZ2xlUmVxdWVzdCggZGF0YSwgY3VycmVudFNlbGVjdG9yLCB2YWx1ZSApIHtcblx0XHRjb25zdCAkZmllbGQgICAgICA9IGN1cnJlbnRTZWxlY3Rvci5jbG9zZXN0KCAnLndjYXBmLWZvcm0tZmllbGQnICk7XG5cdFx0Y29uc3QgaGFuZGxlciAgICAgPSBkYXRhWyAnaGFuZGxlcicgXTtcblx0XHRjb25zdCBoYW5kbGVyVHlwZSA9IGRhdGFbICdoYW5kbGVyVHlwZScgXTtcblx0XHRjb25zdCBkZXBlbmRhbnQgICA9IGRhdGFbICdkZXBlbmRhbnQnIF07XG5cblx0XHRsZXQgX3ZhbHVlID0gdmFsdWU7XG5cblx0XHRpZiAoICdjaGVja2JveCcgPT09IGhhbmRsZXJUeXBlICkge1xuXHRcdFx0X3ZhbHVlID0gY3VycmVudFNlbGVjdG9yLmlzKCAnOmNoZWNrZWQnICkgPyAnMScgOiAnMCc7XG5cdFx0fVxuXG5cdFx0aWYgKCAncmFkaW8nID09PSBoYW5kbGVyVHlwZSApIHtcblx0XHRcdF92YWx1ZSA9ICRmaWVsZC5maW5kKCBoYW5kbGVyICsgJzpjaGVja2VkJyApLnZhbCgpO1xuXHRcdH1cblxuXHRcdCQuZWFjaCggZGVwZW5kYW50LCBmdW5jdGlvbiggaWQsIGQgKSB7XG5cdFx0XHRjb25zdCAkc2VsZWN0b3IgICA9ICRmaWVsZC5maW5kKCBkWyAnc2VsZWN0b3InIF0gKTtcblx0XHRcdGNvbnN0IHZhbGlkVmFsdWVzID0gZFsgJ3ZhbHVlJyBdO1xuXG5cdFx0XHRpZiAoIHZhbGlkVmFsdWVzLmluY2x1ZGVzKCBfdmFsdWUgKSApIHtcblx0XHRcdFx0JHNlbGVjdG9yLnNob3coKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdCRzZWxlY3Rvci5oaWRlKCk7XG5cdFx0XHR9XG5cdFx0fSApO1xuXG5cdFx0aWYgKCAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLWRpc3BsYXlfdHlwZSBzZWxlY3QnID09PSBoYW5kbGVyICkge1xuXHRcdFx0X3RyaWdnZXJJbnB1dFR5cGVUZXh0RGlzcGxheVR5cGVDaGFuZ2UoIF92YWx1ZSwgJGZpZWxkICk7XG5cdFx0fVxuXG5cdFx0aWYgKCAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLXVzZV9jaG9zZW4gaW5wdXQnID09PSBoYW5kbGVyICkge1xuXHRcdFx0X3RyaWdnZXJJbnB1dFR5cGVUZXh0VXNlU2VsZWN0Q2hhbmdlKCBfdmFsdWUsICRmaWVsZCApO1xuXHRcdH1cblxuXHRcdGlmICggJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1udW1iZXJfZGlzcGxheV90eXBlIHNlbGVjdCcgPT09IGhhbmRsZXIgKSB7XG5cdFx0XHRfdHJpZ2dlcklucHV0VHlwZU51bWJlckRpc3BsYXlUeXBlQ2hhbmdlKCBfdmFsdWUsICRmaWVsZCApO1xuXHRcdH1cblxuXHRcdGlmICggJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1udW1iZXJfcmFuZ2VfdXNlX2Nob3NlbiBpbnB1dCcgPT09IGhhbmRsZXIgKSB7XG5cdFx0XHRfdHJpZ2dlcklucHV0VHlwZU51bWJlclVzZVNlbGVjdENoYW5nZSggX3ZhbHVlLCAkZmllbGQgKTtcblx0XHR9XG5cblx0XHQkc2VhcmNoRm9ybS50cmlnZ2VyKCAnYWZ0ZXJfdG9nZ2xlX3JlcXVlc3QnLCBbIGhhbmRsZXIsIF92YWx1ZSwgJGZpZWxkIF0gKTtcblx0fVxuXG5cdGZ1bmN0aW9uIGhhbmRsZVRvZ2dsZVJlcXVlc3QoIGRhdGEsIGN1cnJlbnRTZWxlY3RvciwgdmFsdWUgKSB7XG5cdFx0aWYgKCBudWxsID09PSBjdXJyZW50U2VsZWN0b3IgKSB7XG5cdFx0XHRjb25zdCBoYW5kbGVyICA9IGRhdGFbICdoYW5kbGVyJyBdO1xuXHRcdFx0Y29uc3QgJGhhbmRsZXIgPSAkKCBoYW5kbGVyICk7XG5cblx0XHRcdCQuZWFjaCggJGhhbmRsZXIsIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRjb25zdCBfdGhpcyAgPSAkKCB0aGlzICk7XG5cdFx0XHRcdGNvbnN0IF92YWx1ZSA9IF90aGlzLnZhbCgpO1xuXHRcdFx0XHRfaGFuZGxlVG9nZ2xlUmVxdWVzdCggZGF0YSwgX3RoaXMsIF92YWx1ZSApO1xuXHRcdFx0fSApO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRfaGFuZGxlVG9nZ2xlUmVxdWVzdCggZGF0YSwgY3VycmVudFNlbGVjdG9yLCB2YWx1ZSApO1xuXHRcdH1cblx0fVxuXG5cdGZ1bmN0aW9uIHNldHVwU2VhcmNoRm9ybSggaW5pdGFsID0gZmFsc2UgKSB7XG5cdFx0JC5lYWNoKCBkZXBlbmRhbnREYXRhLCBmdW5jdGlvbiggaSwgZGF0YSApIHtcblx0XHRcdGNvbnN0IGhhbmRsZXIgPSBkYXRhWyAnaGFuZGxlcicgXTtcblx0XHRcdGNvbnN0IGV2ZW50ICAgPSBkYXRhWyAnZXZlbnQnIF07XG5cblx0XHRcdGhhbmRsZVRvZ2dsZVJlcXVlc3QoIGRhdGEsIG51bGwsIG51bGwgKTtcblxuXHRcdFx0aWYgKCBpbml0YWwgKSB7XG5cdFx0XHRcdCRzZWFyY2hGb3JtLm9uKCBldmVudCwgaGFuZGxlciwgZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0Y29uc3QgX3RoaXMgID0gJCggdGhpcyApO1xuXHRcdFx0XHRcdGNvbnN0IF92YWx1ZSA9ICQoIHRoaXMgKS52YWwoKTtcblx0XHRcdFx0XHRoYW5kbGVUb2dnbGVSZXF1ZXN0KCBkYXRhLCBfdGhpcywgX3ZhbHVlICk7XG5cdFx0XHRcdH0gKTtcblx0XHRcdH1cblx0XHR9ICk7XG5cdH1cblxuXHRzZXR1cFNlYXJjaEZvcm0oIHRydWUgKTtcblxuXHQkc2VhcmNoRm9ybS5vbiggJ2ZpZWxkX2FkZGVkJywgZnVuY3Rpb24oKSB7XG5cdFx0Ly8gVG9nZ2xlIHRoZSB2aXNpYmlsaXR5IG9mIHN1YmZpZWxkcy5cblx0XHRzZXR1cFNlYXJjaEZvcm0oKTtcblx0fSApO1xuXG59ICk7XG4iLCIvKipcbiAqIFRoZSBzZWFyY2ggZm9ybS5cbiAqXG4gKiBAc2luY2UgICAgICAzLjAuMFxuICogQHBhY2thZ2UgICAgd2MtYWpheC1wcm9kdWN0LWZpbHRlclxuICogQHN1YnBhY2thZ2Ugd2MtYWpheC1wcm9kdWN0LWZpbHRlci9hZG1pbi9zcmMvanNcbiAqIEBhdXRob3IgICAgIE1haW51bCBIYXNzYW4gTWFpblxuICovXG5cbmNvbnN0IHRvdGFsRmllbGRJbnN0YW5jZXMgPSBqUXVlcnkoICcjdG90YWxfZmllbGRfaW5zdGFuY2VzJyApO1xuXG5jb25zdCBzZWFyY2hGb3JtID0galF1ZXJ5KCAnI3NlYXJjaC1mb3JtJyApO1xuXG4vKipcbiAqIEFzc2lnbiBhIHVuaXF1ZSBpZCBieSByZXBsYWNpbmcgdGhlIHBsYWNlaG9sZGVyIGlkLlxuICovXG5mdW5jdGlvbiByZW1vdmVQbGFjZWhvbGRlciggdW5pcXVlSWQsIGVsZW1lbnRzLCBhdHRyICkge1xuXHRlbGVtZW50cy5lYWNoKFxuXHRcdGZ1bmN0aW9uKCkge1xuXHRcdFx0Y29uc3QgZWxlbWVudCA9IGpRdWVyeSggdGhpcyApO1xuXG5cdFx0XHRjb25zdCBvbGRWYWx1ZSA9IGVsZW1lbnQuYXR0ciggYXR0ciApO1xuXHRcdFx0Y29uc3QgbmV3VmFsdWUgPSBvbGRWYWx1ZS5yZXBsYWNlKCAnJSUnLCB1bmlxdWVJZCApO1xuXG5cdFx0XHRlbGVtZW50LmF0dHIoIGF0dHIsIG5ld1ZhbHVlICk7XG5cdFx0fVxuXHQpO1xufVxuXG4vKipcbiAqIEluc2VydCB0aGUgZmllbGQncyBzdWJmaWVsZHMuXG4gKi9cbmZ1bmN0aW9uIGluc2VydEZpZWxkU3ViRmllbGRzKCB1aSApIHtcblx0Ly8gSW5zZXJ0IHRoZSBmaWVsZCdzIHN1YmZpZWxkcyBpZiBub3QgYWxyZWFkeSBpbnNlcnRlZC5cblx0aWYgKCAhIHVpLml0ZW0uaGFzQ2xhc3MoICdzdWItZmllbGRzLXJlYWR5JyApICkge1xuXHRcdGNvbnN0IHR5cGUgICAgICA9IHVpLml0ZW0uYXR0ciggJ2RhdGEtZmllbGQtdHlwZScgKTtcblx0XHRjb25zdCB1bmlxdWVJZCAgPSBwYXJzZUludCggdG90YWxGaWVsZEluc3RhbmNlcy52YWwoKSApO1xuXHRcdGNvbnN0IGZpZWxkVHlwZSA9ICd3Y2FwZi1mb3JtLWZpZWxkLScgKyB0eXBlO1xuXG5cdFx0Ly8gQmFpbCBvdXQgaWYgbm8gdG1wbCBmb3VuZCBmb3IgdGhlIHR5cGUuXG5cdFx0aWYgKCAhIGpRdWVyeSggJyN0bXBsLScgKyBmaWVsZFR5cGUgKS5sZW5ndGggKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0Ly8gSW5jcmVtZW50IHRoZSB2YWx1ZSBvZiB0b3RhbCBmaWVsZCBpbnN0YW5jZXMuXG5cdFx0dG90YWxGaWVsZEluc3RhbmNlcy52YWwoIHVuaXF1ZUlkICsgMSApO1xuXG5cdFx0Y29uc3QgdGVtcGxhdGUgPSB3cC50ZW1wbGF0ZSggZmllbGRUeXBlICk7XG5cdFx0Y29uc3QgcmVuZGVyZWQgPSB0ZW1wbGF0ZSgpO1xuXHRcdGNvbnN0IHdyYXBwZXIgID0gdWkuaXRlbS5maW5kKCAnLndpZGdldC1jb250ZW50JyApO1xuXG5cdFx0d3JhcHBlci5wcmVwZW5kKCByZW5kZXJlZCApO1xuXG5cdFx0Ly8gVXBkYXRlIHRoZSBmb3IgYXR0cmlidXRlcyBvZiB0aGUgbGFiZWxzLlxuXHRcdHJlbW92ZVBsYWNlaG9sZGVyKCB1bmlxdWVJZCwgdWkuaXRlbS5maW5kKCAnbGFiZWxbZm9yXj1cIndjYXBmLWlucHV0LVwiXScgKSwgJ2ZvcicgKTtcblxuXHRcdC8vIFVwZGF0ZSB0aGUgaWRzIG9mIHRoZSBpbnB1dCBlbGVtZW50cy5cblx0XHRyZW1vdmVQbGFjZWhvbGRlciggdW5pcXVlSWQsIHVpLml0ZW0uZmluZCggJypbaWRePVwid2NhcGYtaW5wdXQtXCJdJyApLCAnaWQnICk7XG5cblx0XHQvLyBVcGRhdGUgdGhlIG5hbWVzIG9mIHRoZSBpbnB1dCBlbGVtZW50cy5cblx0XHRyZW1vdmVQbGFjZWhvbGRlciggdW5pcXVlSWQsIHVpLml0ZW0uZmluZCggJypbaWRePVwid2NhcGYtaW5wdXQtXCJdJyApLCAnbmFtZScgKTtcblxuXHRcdC8vIFVwZGF0ZSB0aGUgcG9zaXRpb24gdmFsdWUuXG5cdFx0cmVtb3ZlUGxhY2Vob2xkZXIoIHVuaXF1ZUlkLCB1aS5pdGVtLmZpbmQoICcqW2lkXj1cIndjYXBmLWlucHV0LXBvc2l0aW9uLVwiXScgKSwgJ3ZhbHVlJyApO1xuXG5cdFx0dWkuaXRlbS5hZGRDbGFzcyggJ3N1Yi1maWVsZHMtcmVhZHknICk7XG5cblx0XHRzZWFyY2hGb3JtLnRyaWdnZXIoICdmaWVsZF9hZGRlZCcsIFsgdWkgXSApO1xuXHR9XG59XG5cbi8qKlxuICogVXBkYXRlIHRoZSBmb3JtIGZpZWxkJ3MgcG9zaXRpb24gYWZ0ZXIgc29ydC5cbiAqXG4gKiBAc291cmNlIGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vYS8xNDczNjc3NVxuICovXG5mdW5jdGlvbiB1cGRhdGVGaWVsZHNQb3NpdGlvbigpIHtcblx0Y29uc3QgaW5wdXRzICA9IHNlYXJjaEZvcm0uZmluZCggJypbaWRePVwid2NhcGYtaW5wdXQtcG9zaXRpb24tXCJdJyApO1xuXHRjb25zdCBuYkVsZW1zID0gaW5wdXRzLmxlbmd0aDtcblxuXHRpbnB1dHMuZWFjaChcblx0XHRmdW5jdGlvbiggaWR4ICkge1xuXHRcdFx0alF1ZXJ5KCB0aGlzICkudmFsKCBuYkVsZW1zIC0gKCBuYkVsZW1zIC0gaWR4ICkgKTtcblx0XHR9XG5cdCk7XG59XG5cbi8qKlxuICogTWFrZSB0aGUgZmllbGQgcmVhZHksIHJlbW92ZSBzdHlsZXMgY29tZXMgZnJvbSBqcXVlcnktdWktc29ydGFibGUgcGx1Z2luLCBpbnNlcnQgdGhlIGZpZWxkJ3Mgc3ViZmllbGRzIGV0Yy5cbiAqL1xuZnVuY3Rpb24gbWFrZUZpZWxkUmVhZHkoIGUsIHVpICkge1xuXHQvLyBSZW1vdmUgc3R5bGVzIGNvbWVzIGZyb20ganF1ZXJ5LXVpLXNvcnRhYmxlIHBsdWdpbi5cblx0dWkuaXRlbS5yZW1vdmVBdHRyKCAnc3R5bGUnICk7XG5cblx0aW5zZXJ0RmllbGRTdWJGaWVsZHMoIHVpICk7XG5cblx0dXBkYXRlRmllbGRzUG9zaXRpb24oKTtcblxuXHRjb25zdCB0b2dnbGVCdG4gPSB1aS5pdGVtLmZpbmQoICcud2lkZ2V0LWFjdGlvbicgKTtcblxuXHQvLyBFeHBhbmQgdGhlIGZvcm0gZmllbGQgYWZ0ZXIgc29ydC5cblx0aWYgKCAnZmFsc2UnID09PSB0b2dnbGVCdG4uYXR0ciggJ2FyaWEtZXhwYW5kZWQnICkgKSB7XG5cdFx0dG9nZ2xlQnRuLnRyaWdnZXIoICdjbGljaycgKTtcblx0fVxufVxuXG4vKipcbiAqIEluc3RhbnRpYXRlIHNvcnRhYmxlIGZvciB0aGUgZm9ybSBmaWVsZHMuXG4gKi9cbmZ1bmN0aW9uIHNvcnRhYmxlKCBpZGVudGlmaWVyICkge1xuXHRjb25zdCBjb250YWluZXIgPSBqUXVlcnkoIGlkZW50aWZpZXIgKTtcblxuXHRjb250YWluZXIuc29ydGFibGUoXG5cdFx0e1xuXHRcdFx0b3BhY2l0eTogMC44LFxuXHRcdFx0cmV2ZXJ0OiBmYWxzZSxcblx0XHRcdGN1cnNvcjogJ21vdmUnLFxuXHRcdFx0YXhpczogJ3knLFxuXHRcdFx0aGFuZGxlOiAnLndpZGdldC10b3AnLFxuXHRcdFx0Y2FuY2VsOiAnLndpZGdldC10aXRsZS1hY3Rpb24nLFxuXHRcdFx0aXRlbXM6ICcud2lkZ2V0Jyxcblx0XHRcdHBsYWNlaG9sZGVyOiAnd2lkZ2V0LXBsYWNlaG9sZGVyJyxcblx0XHRcdGNvbm5lY3RXaXRoOiAnI3NlYXJjaC1mb3JtLXdyYXBwZXInLFxuXHRcdFx0c3RvcDogbWFrZUZpZWxkUmVhZHksXG5cdFx0XHRzdGFydDogZnVuY3Rpb24oIGUsIHVpICkge1xuXHRcdFx0XHQvLyBJZiBpdCBpcyBnZXR0aW5nIGFwcGVuZGVkIHRvIHRoZSB3cm9uZyBwbGFjZSwgdGhlbiBmb3JjZSBpdCBpbnRvIHRoZSByaWdodCBjb250YWluZXIuXG5cdFx0XHRcdHVpLnBsYWNlaG9sZGVyLmFwcGVuZFRvKCB1aS5wbGFjZWhvbGRlci5wYXJlbnQoKS5maW5kKCAnLmluc2lkZSAjc2VhcmNoLWZvcm0td3JhcHBlcicgKSApO1xuXHRcdFx0fVxuXHRcdH1cblx0KTtcbn1cblxuc29ydGFibGUoICcjc2VhcmNoLWZvcm0nICk7XG5cbi8qKlxuICogUnVuIGZ1bmN0aW9uIHdoZW4gZHJhZyBzdGFydHMuXG4gKi9cbmZ1bmN0aW9uIG9uRHJhZ1N0YXJ0KCkge1xuXHRzZWFyY2hGb3JtLmFkZENsYXNzKCAndWktZHJvcC1hY3RpdmUnICk7XG59XG5cbi8qKlxuICogUnVuIGZ1bmN0aW9uIGF0IGRyYWcgc3RvcC5cbiAqL1xuZnVuY3Rpb24gb25EcmFnU3RvcCgpIHtcblx0c2VhcmNoRm9ybS5yZW1vdmVDbGFzcyggJ3VpLWRyb3AtYWN0aXZlJyApO1xufVxuXG4vKipcbiAqIEluaXRpYWxpemUgZHJhZ2dhYmxlIGZvciB0aGUgZm9ybSBmaWVsZHMuXG4gKi9cbmpRdWVyeSggJyNhdmFpbGFibGUtZmllbGRzIC53aWRnZXQnICkuZHJhZ2dhYmxlKFxuXHR7XG5cdFx0Y29ubmVjdFRvU29ydGFibGU6ICcjc2VhcmNoLWZvcm0nLFxuXHRcdGhlbHBlcjogJ2Nsb25lJyxcblx0XHRzdGFydDogb25EcmFnU3RhcnQsXG5cdFx0c3RvcDogb25EcmFnU3RvcCxcblx0fVxuKTtcblxuLyoqXG4gKiBUb2dnbGUgdGhlIGZvcm0gZmllbGQuXG4gKi9cbmZ1bmN0aW9uIHRvZ2dsZUZpZWxkKCBlICkge1xuXHRjb25zdCB0YXJnZXQgICAgICAgPSBlLnRhcmdldDtcblx0Y29uc3Qgd2lkZ2V0ICAgICAgID0galF1ZXJ5KCB0aGlzICkuY2xvc2VzdCggJy53aWRnZXQnICk7XG5cdGNvbnN0IHRvZ2dsZUJ0biAgICA9IHdpZGdldC5maW5kKCAnLndpZGdldC1hY3Rpb24nICk7XG5cdGNvbnN0IGluc2lkZSAgICAgICA9IHdpZGdldC5jaGlsZHJlbiggJy53aWRnZXQtaW5zaWRlJyApO1xuXHRjb25zdCBpc0V4cGFuZCAgICAgPSB0b2dnbGVCdG4uYXR0ciggJ2FyaWEtZXhwYW5kZWQnICk7XG5cdGNvbnN0IHRvZ2dsZUV4cGFuZCA9ICd0cnVlJyA9PT0gaXNFeHBhbmQgPyAnZmFsc2UnIDogJ3RydWUnO1xuXG5cdHRvZ2dsZUJ0bi5hdHRyKCAnYXJpYS1leHBhbmRlZCcsIHRvZ2dsZUV4cGFuZCApO1xuXHRqUXVlcnkoIGluc2lkZSApLnNsaWRlVG9nZ2xlKFxuXHRcdCdmYXN0Jyxcblx0XHRmdW5jdGlvbigpIHtcblx0XHRcdHdpZGdldC50b2dnbGVDbGFzcyggJ29wZW4nICk7XG5cdFx0XHRzZWFyY2hGb3JtLnRyaWdnZXIoICd3aWRnZXQtY2xvc2VkJywgWyB0YXJnZXQgXSApO1xuXHRcdH1cblx0KTtcbn1cblxuc2VhcmNoRm9ybS5vbiggJ2NsaWNrJywgJy53aWRnZXQtdG9wJywgdG9nZ2xlRmllbGQgKTtcbnNlYXJjaEZvcm0ub24oICdjbGljaycsICcud2lkZ2V0LWNvbnRyb2wtY2xvc2UnLCB0b2dnbGVGaWVsZCApO1xuXG4vKipcbiAqIEZvY3VzIHRoZSBmb3JtIGZpZWxkJ3MgZXhwYW5kIGJ1dHRvbi5cbiAqL1xuZnVuY3Rpb24gZm9jdXNGaWVsZCggZSwgdGFyZ2V0ICkge1xuXHRpZiAoIHRhcmdldC5jbGFzc0xpc3QuY29udGFpbnMoICd3aWRnZXQtY29udHJvbC1jbG9zZScgKSApIHtcblx0XHRjb25zdCB3aWRnZXQgPSBqUXVlcnkoIHRhcmdldCApLmNsb3Nlc3QoICcud2lkZ2V0JyApO1xuXHRcdGNvbnN0IGFjdGlvbiA9IHdpZGdldC5maW5kKCAnLndpZGdldC1hY3Rpb24nICk7XG5cblx0XHRhY3Rpb24uYXR0ciggJ2FyaWEtZXhwYW5kZWQnLCAnZmFsc2UnICkuZm9jdXMoKTtcblx0fVxufVxuXG5zZWFyY2hGb3JtLm9uKCAnd2lkZ2V0LWNsb3NlZCcsIGZvY3VzRmllbGQgKTtcblxuLyoqXG4gKiBSZW1vdmUgdGhlIGZpZWxkLlxuICovXG5mdW5jdGlvbiByZW1vdmVGaWVsZCgpIHtcblx0Y29uc3Qgd2lkZ2V0ID0galF1ZXJ5KCB0aGlzICkuY2xvc2VzdCggJy53aWRnZXQnICk7XG5cblx0alF1ZXJ5KCB3aWRnZXQgKS5zbGlkZVVwKFxuXHRcdCdmYXN0Jyxcblx0XHRmdW5jdGlvbigpIHtcblx0XHRcdHdpZGdldC5yZW1vdmUoKTtcblx0XHRcdHVwZGF0ZUZpZWxkc1Bvc2l0aW9uKCk7XG5cdFx0fVxuXHQpO1xufVxuXG5zZWFyY2hGb3JtLm9uKCAnY2xpY2snLCAnLndpZGdldC1jb250cm9sLXJlbW92ZScsIHJlbW92ZUZpZWxkICk7XG5cbi8qKlxuICogU3RvcmUgdGhlIGluaXRpYWwgZm9ybSBkYXRhIGludG8gYSB2YXJpYWJsZSBzbyB0aGF0IHdlIGNhbiBjb21wYXJlIGl0IHdoZW4gbGVhdmluZyB0aGUgcGFnZS5cbiAqL1xubGV0IGluaXRpYWxGb3JtU3RhdGUgPSBzZWFyY2hGb3JtLnNlcmlhbGl6ZUFycmF5KCk7XG5cbi8qKlxuICogU2hvdyBtZXNzYWdlIGFmdGVyIGZvcm0gc3VibWlzc2lvbi5cbiAqL1xuZnVuY3Rpb24gc2hvd01lc3NhZ2UoIG1lc3NhZ2UsIHR5cGUgPSAnc3VjY2VzcycgKSB7XG5cdGNvbnN0IGVsZW1lbnQgPSBqUXVlcnkoICc8cCBjbGFzcz1cIicgKyB0eXBlICsgJ1wiPicgKyBtZXNzYWdlICsgJzwvcD4nICk7XG5cdGNvbnN0IHdyYXBwZXIgPSBqUXVlcnkoICcud2NhcGYtbWVzc2FnZS13cmFwcGVyJyApO1xuXG5cdGlmICggISB3cmFwcGVyLmlzKCAnOmVtcHR5JyApICkge1xuXHRcdHJldHVybjtcblx0fVxuXG5cdGpRdWVyeSggd3JhcHBlciApLmh0bWwoIGVsZW1lbnQgKS5zbGlkZURvd24oICdmYXN0JyApO1xuXG5cdHNldFRpbWVvdXQoXG5cdFx0ZnVuY3Rpb24oKSB7XG5cdFx0XHRqUXVlcnkoIHdyYXBwZXIgKS5zbGlkZVVwKCAnZmFzdCcgKTtcblx0XHRcdHdyYXBwZXIuaHRtbCggJycgKTtcblx0XHR9LFxuXHRcdDMwMDBcblx0KTtcbn1cblxuLyoqXG4gKiBTYXZlIHRoZSBzZWFyY2ggZm9ybS5cbiAqL1xuZnVuY3Rpb24gc2F2ZUZvcm0oKSB7XG5cdGNvbnN0IGJ1dHRvbiAgID0galF1ZXJ5KCB0aGlzICk7XG5cdGNvbnN0IGZvcm1EYXRhID0gc2VhcmNoRm9ybS5zZXJpYWxpemVBcnJheSgpO1xuXG5cdGJ1dHRvbi5hdHRyKCAnZGlzYWJsZWQnLCAnZGlzYWJsZWQnICk7XG5cblx0ZnVuY3Rpb24gb2tDYWxsYmFjayggbWVzc2FnZSApIHtcblx0XHRidXR0b24ucmVtb3ZlQXR0ciggJ2Rpc2FibGVkJyApO1xuXG5cdFx0Ly8gVXBkYXRlIHRoZSBpbml0aWFsIGZvcm0gZGF0YSBhZnRlciBzdWNjZXNzZnVsbHkgc2F2aW5nIHRoZSBmb3JtLlxuXHRcdGluaXRpYWxGb3JtU3RhdGUgPSBmb3JtRGF0YTtcblxuXHRcdHNob3dNZXNzYWdlKCBtZXNzYWdlICk7XG5cdH1cblxuXHRmdW5jdGlvbiBlcnJDYWxsYmFjayggbWVzc2FnZSApIHtcblx0XHRidXR0b24ucmVtb3ZlQXR0ciggJ2Rpc2FibGVkJyApO1xuXHRcdHNob3dNZXNzYWdlKCBtZXNzYWdlLCAnZXJyb3InICk7XG5cdH1cblxuXHQvLyBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL2EvNTkxODEyNTJcblx0d3AuYWpheC5wb3N0KCBmb3JtRGF0YSApLmRvbmUoIG9rQ2FsbGJhY2sgKS5mYWlsKCBlcnJDYWxsYmFjayApO1xufVxuXG5qUXVlcnkoICcjcG9zdGJveC1jb250YWluZXItMScgKS5vbiggJ2NsaWNrJywgJ2J1dHRvbicsIHNhdmVGb3JtICk7XG5cbi8qKlxuICogU2hvdyBhbGVydCBvbiBsZWF2ZSBpZiB0aGUgZm9ybSBpcyBkaXJ0eS5cbiAqXG4gKiBUT0RPOiBVbmNvbW1lbnQgdGhpcy5cbiAqL1xuLy8gd2luZG93Lm9uYmVmb3JldW5sb2FkID0gZnVuY3Rpb24oKSB7XG4vLyBcdGNvbnN0IG5ld0Zvcm1TdGF0ZSA9IHNlYXJjaEZvcm0uc2VyaWFsaXplQXJyYXkoKTtcbi8vXG4vLyBcdGNvbnN0IGlzRm9ybURpcnR5ID0gISBfLmlzRXF1YWwoIG5ld0Zvcm1TdGF0ZSwgaW5pdGlhbEZvcm1TdGF0ZSApO1xuLy9cbi8vIFx0aWYgKCBpc0Zvcm1EaXJ0eSApIHtcbi8vIFx0XHRyZXR1cm4gJyc7XG4vLyBcdH1cbi8vIH07XG4iXX0=
