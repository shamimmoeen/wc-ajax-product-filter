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

  function triggerSortByOptionsChange($field) {
    var $valueHolder = $field.find('.wcapf-form-sub-field-sort_by_options input');
    var $optionsTable = $field.find('.sort-by-options-table');
    var $rows = $optionsTable.find('.manual-options-table-body-rows');
    var _rows = [];
    $rows.find('.sort-option-item').each(function (i, _item) {
      var $item = $(_item);
      var value = $item.find('.option_value').val();
      var direction = $item.find('.option_direction').val();
      var label = $item.find('.option_label').val();
      var meta_key = $item.find('.option_meta_key').val();
      var meta_sort_type = $item.find('.option_meta_sort_type').val();

      if (value) {
        _rows.push([value, direction, label, meta_key, meta_sort_type]);
      }
    });
    var rawValues = encodeURIComponent(JSON.stringify(_rows));
    $valueHolder.val(rawValues);
  }

  function initSortableForSortByOptions($selector) {
    $selector.sortable({
      opacity: 0.8,
      revert: false,
      cursor: 'move',
      axis: 'y',
      handle: '.move-options-handler',
      placeholder: 'widget-placeholder',
      update: function update(e) {
        var $field = $(e.target).closest('.wcapf-form-field');
        triggerSortByOptionsChange($field);
      }
    }).disableSelection();
  } // Sort Manual Options


  initSortableForSortByOptions($searchForm.find('.sort-by-options-table .manual-options-table-body-rows'));
  $searchForm.on('field_added', function (e, ui) {
    // Init Sortable for the manual options.
    initSortableForSortByOptions($(ui.item.find('.manual-options-table-body-rows')));
  });

  function triggerRemoveSortByOption($field) {
    var $optionsTable = $field.find('.sort-by-options-table');
    var tableRows = $optionsTable.find('.manual-options-table-body-rows').children();

    if (2 > tableRows.length) {
      $optionsTable.removeClass('has-options');
    }
  } // Remove Single Number Option


  $searchForm.on('click', '.remove-sort-by-option', function () {
    var $item = $(this).closest('.sort-option-item');
    var $field = $item.closest('.wcapf-form-field');
    triggerRemoveSortByOption($field);
    $item.remove();
    triggerSortByOptionsChange($field);
  }); // Clear All Options

  $searchForm.on('click', '.clear-all-sort-by-options', function () {
    var $field = $(this).closest('.wcapf-form-field');
    var $optionsTable = $field.find('.sort-by-options-table');
    $optionsTable.find('.manual-options-table-body-rows').empty();
    triggerRemoveSortByOption($field);
    triggerSortByOptionsChange($field);
  }); // Add New Option

  $searchForm.on('click', '.add-sort-by-option', function () {
    var fieldType = 'wcapf-sort-by-option'; // Bail out if no tmpl found for the type.

    if (!jQuery('#tmpl-' + fieldType).length) {
      return;
    }

    var $field = $(this).closest('.wcapf-form-field');
    var template = wp.template(fieldType);
    var rendered = template({
      value: '',
      direction: '',
      label: ''
    });
    var $wrapper = $field.find('.sort-by-options-table');
    var $rows = $wrapper.find('.manual-options-table-body-rows');
    $rows.append(rendered);
    triggerSortByOptionsChange($field);

    if (!$wrapper.hasClass('has-options')) {
      $wrapper.addClass('has-options');
    }
  });
  var rowInputs = '.sort-by-options-table input[type="text"],' + ' .sort-by-options-table .option_value,' + ' .sort-by-options-table .option_direction,' + ' .sort-by-options-table .option_meta_key,' + ' .sort-by-options-table .option_meta_sort_type';
  $searchForm.on('input', rowInputs, function () {
    var $field = $(this).closest('.wcapf-form-field');
    triggerSortByOptionsChange($field);
  });
  $searchForm.on('change', '.sort-option-item .option_value', function () {
    var $sortOption = $(this);
    var sortOption = $sortOption.val();
    var $sortOptionItem = $sortOption.closest('.sort-option-item');
    var $metaData = $sortOptionItem.find('.meta-data');

    if ('meta_value' === sortOption) {
      $metaData.slideDown();
    } else {
      $metaData.slideUp();
    }
  });
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInBvc3QtbWV0YS1vcHRpb25zLmpzIiwicHJvZHVjdC1zdGF0dXMtb3B0aW9ucy5qcyIsInNlYXJjaC1mb3JtLWZpZWxkLmpzIiwic2VhcmNoLWZvcm0uanMiLCJzb3J0LWJ5LW9wdGlvbnMuanMiXSwibmFtZXMiOlsialF1ZXJ5IiwiZG9jdW1lbnQiLCJyZWFkeSIsIiQiLCIkc2VhcmNoRm9ybSIsIm9uIiwiZSIsImhhbmRsZXIiLCJ2YWx1ZSIsIiRmaWVsZCIsInBhcmFtcyIsIndpbmRvdyIsImhpZXJhcmNoaWNhbERhdGEiLCJpc0hpZXJhcmNoaWNhbCIsIiRkZXBlbmRhbnRGaWVsZHMiLCJmaW5kIiwic2hvdyIsImhpZGUiLCJpbml0U29ydGFibGVGb3JNYW51YWxPcHRpb25zIiwiJHNlbGVjdG9yIiwic29ydGFibGUiLCJvcGFjaXR5IiwicmV2ZXJ0IiwiY3Vyc29yIiwiYXhpcyIsImhhbmRsZSIsInBsYWNlaG9sZGVyIiwidXBkYXRlIiwidGFyZ2V0IiwiY2xvc2VzdCIsInRyaWdnZXJNYW51YWxPcHRpb25zQ2hhbmdlIiwiZGlzYWJsZVNlbGVjdGlvbiIsInVpIiwiaXRlbSIsInRyaWdnZXJSZW1vdmVPcHRpb24iLCIkb3B0aW9uc1RhYmxlIiwidGFibGVSb3dzIiwiY2hpbGRyZW4iLCJsZW5ndGgiLCJyZW1vdmVDbGFzcyIsIiRpdGVtIiwicmVtb3ZlIiwiZW1wdHkiLCJmaWVsZFR5cGUiLCJ0ZW1wbGF0ZSIsIndwIiwicmVuZGVyZWQiLCJsYWJlbCIsIiR3cmFwcGVyIiwiJHJvd3MiLCJhcHBlbmQiLCJoYXNDbGFzcyIsImFkZENsYXNzIiwiJHBvc3RNZXRhT3B0aW9uc01vZGFsIiwiJG5vS2V5Rm91bmRNZXNzYWdlIiwiJHBvc3RNZXRhTW9kYWxMb2FkZXIiLCIkcG9zdE1ldGFPcHRpb25zIiwiJHBvc3RNZXRhTW9kYWxGb290ZXIiLCJwb3N0TWV0YU9wdGlvbnNNb2RhbEluc3RhbmNlIiwicmVtb2RhbCIsImhhc2hUcmFja2luZyIsIiRwb3N0TWV0YUZpZWxkIiwicmVzZXRQb3N0TWV0YU1vZGFsIiwiaHRtbCIsInByb3AiLCIkaW5wdXRNZXRhS2V5IiwibWV0YUtleSIsInZhbCIsIm9wZW4iLCJva0NhbGxiYWNrIiwicmVzcG9uc2UiLCJlcnJDYWxsYmFjayIsIm1lc3NhZ2UiLCJjb25zb2xlIiwibG9nIiwiZm9ybURhdGEiLCJrZXkiLCJhY3Rpb24iLCJhamF4IiwicG9zdCIsImRvbmUiLCJmYWlsIiwiJHZhbHVlSG9sZGVyIiwiX3Jvd3MiLCJlYWNoIiwiaSIsIl9pdGVtIiwicHVzaCIsInJhd1ZhbHVlcyIsImVuY29kZVVSSUNvbXBvbmVudCIsIkpTT04iLCJzdHJpbmdpZnkiLCIkb3B0aW9ucyIsImlzUmVwbGFjZSIsInJvd3MiLCJpcyIsImlucHV0IiwiJGlucHV0IiwiY2xvc2UiLCIkc2VsZWN0RWxtIiwib3JkZXJCeSIsImRlcGVuZGFudE9wdGlvbnMiLCJhdHRyIiwiY2hhbmdlIiwicmVtb3ZlQXR0ciIsImRpc2FibGVPcmRlckJ5T3B0aW9ucyIsIiRlbG0iLCIkb3JkZXJEaXJlY3Rpb25GaWVsZCIsIiRvcmRlclR5cGVGaWVsZCIsIiR0aGlzIiwiaW5pdFNvcnRhYmxlRm9yTnVtYmVyTWFudWFsT3B0aW9ucyIsInRyaWdnZXJOdW1iZXJNYW51YWxPcHRpb25zQ2hhbmdlIiwidHJpZ2dlclJlbW92ZU51bWJlck9wdGlvbiIsIm1pbl92YWx1ZSIsIm1heF92YWx1ZSIsIiRnZXRPcHRpb25zIiwiJGF1dG9PcHRpb25zIiwiJG1hbnVhbE9wdGlvbnNUYWJsZSIsImRpc3BsYXlUeXBlIiwidG9nZ2xlTnVtYmVyTWluVmFsdWVGaWVsZCIsIiR0ZXh0RmllbGQiLCJ0b2dnbGVOdW1iZXJNYXhWYWx1ZUZpZWxkIiwiJHNvZnRMaW1pdEZpZWxkcyIsIiR2YWx1ZVR5cGVGaWVsZCIsInZhbHVlVHlwZSIsImRpc3BsYXlUeXBlcyIsImluY2x1ZGVzIiwiJG51bWJlckRpc3BsYXlUeXBlRmllbGQiLCJudW1iZXJEaXNwbGF5VHlwZSIsIm51bWJlckRpc3BsYXlUeXBlcyIsIiR0ZXh0RGlzcGxheVR5cGVGaWVsZCIsInRleHREaXNwbGF5VHlwZSIsInRleHREaXNwbGF5VHlwZXMiLCIkdmFsdWVUeXBlIiwicG9zdFByb3BlcnR5RGF0YSIsInRyaWdnZXJQcm9kdWN0U3RhdHVzT3B0aW9uc0NoYW5nZSIsImluaXRTb3J0YWJsZUZvclByb2R1Y3RTdGF0dXNPcHRpb25zIiwidHJpZ2dlclJlbW92ZVByb2R1Y3RTdGF0dXNPcHRpb24iLCJkZXBlbmRhbnREYXRhIiwiX3RyaWdnZXJJbnB1dFR5cGVUZXh0RGlzcGxheVR5cGVDaGFuZ2UiLCIkbm9SZXN1bHRzIiwiJGFsbEl0ZW1zTGFiZWwiLCJ1c2VDaG9zZW4iLCJfdHJpZ2dlcklucHV0VHlwZU51bWJlckRpc3BsYXlUeXBlQ2hhbmdlIiwiX3RyaWdnZXJJbnB1dFR5cGVUZXh0VXNlU2VsZWN0Q2hhbmdlIiwiX3RyaWdnZXJJbnB1dFR5cGVOdW1iZXJVc2VTZWxlY3RDaGFuZ2UiLCJfaGFuZGxlVG9nZ2xlUmVxdWVzdCIsImRhdGEiLCJjdXJyZW50U2VsZWN0b3IiLCJoYW5kbGVyVHlwZSIsImRlcGVuZGFudCIsIl92YWx1ZSIsImlkIiwiZCIsInZhbGlkVmFsdWVzIiwidHJpZ2dlciIsImhhbmRsZVRvZ2dsZVJlcXVlc3QiLCIkaGFuZGxlciIsIl90aGlzIiwic2V0dXBTZWFyY2hGb3JtIiwiaW5pdGFsIiwiZXZlbnQiLCJ0b3RhbEZpZWxkSW5zdGFuY2VzIiwic2VhcmNoRm9ybSIsInJlbW92ZVBsYWNlaG9sZGVyIiwidW5pcXVlSWQiLCJlbGVtZW50cyIsImVsZW1lbnQiLCJvbGRWYWx1ZSIsIm5ld1ZhbHVlIiwicmVwbGFjZSIsImluc2VydEZpZWxkU3ViRmllbGRzIiwidHlwZSIsInBhcnNlSW50Iiwid3JhcHBlciIsInByZXBlbmQiLCJ1cGRhdGVGaWVsZHNQb3NpdGlvbiIsImlucHV0cyIsIm5iRWxlbXMiLCJpZHgiLCJtYWtlRmllbGRSZWFkeSIsInRvZ2dsZUJ0biIsImlkZW50aWZpZXIiLCJjb250YWluZXIiLCJjYW5jZWwiLCJpdGVtcyIsImNvbm5lY3RXaXRoIiwic3RvcCIsInN0YXJ0IiwiYXBwZW5kVG8iLCJwYXJlbnQiLCJvbkRyYWdTdGFydCIsIm9uRHJhZ1N0b3AiLCJkcmFnZ2FibGUiLCJjb25uZWN0VG9Tb3J0YWJsZSIsImhlbHBlciIsInRvZ2dsZUZpZWxkIiwid2lkZ2V0IiwiaW5zaWRlIiwiaXNFeHBhbmQiLCJ0b2dnbGVFeHBhbmQiLCJzbGlkZVRvZ2dsZSIsInRvZ2dsZUNsYXNzIiwiZm9jdXNGaWVsZCIsImNsYXNzTGlzdCIsImNvbnRhaW5zIiwiZm9jdXMiLCJyZW1vdmVGaWVsZCIsInNsaWRlVXAiLCJpbml0aWFsRm9ybVN0YXRlIiwic2VyaWFsaXplQXJyYXkiLCJzaG93TWVzc2FnZSIsInNsaWRlRG93biIsInNldFRpbWVvdXQiLCJzYXZlRm9ybSIsImJ1dHRvbiIsInRyaWdnZXJTb3J0QnlPcHRpb25zQ2hhbmdlIiwiZGlyZWN0aW9uIiwibWV0YV9rZXkiLCJtZXRhX3NvcnRfdHlwZSIsImluaXRTb3J0YWJsZUZvclNvcnRCeU9wdGlvbnMiLCJ0cmlnZ2VyUmVtb3ZlU29ydEJ5T3B0aW9uIiwicm93SW5wdXRzIiwiJHNvcnRPcHRpb24iLCJzb3J0T3B0aW9uIiwiJHNvcnRPcHRpb25JdGVtIiwiJG1ldGFEYXRhIl0sIm1hcHBpbmdzIjoiOztBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQUEsTUFBTSxDQUFFQyxRQUFGLENBQU4sQ0FBbUJDLEtBQW5CLENBQTBCLFVBQVVDLENBQVYsRUFBYztBQUV2QyxNQUFNQyxXQUFXLEdBQUdELENBQUMsQ0FBRSxjQUFGLENBQXJCO0FBRUFDLEVBQUFBLFdBQVcsQ0FBQ0MsRUFBWixDQUFnQixzQkFBaEIsRUFBd0MsVUFBVUMsQ0FBVixFQUFhQyxPQUFiLEVBQXNCQyxLQUF0QixFQUE2QkMsTUFBN0IsRUFBc0M7QUFDN0UsUUFBSyxtREFBbURGLE9BQXhELEVBQWtFO0FBQ2pFLFVBQU1HLE1B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RGlCLEdBRWpCLDRDQUZpQixHQUdqQiwyQ0FIaUIsR0FJakIsZ0RBSkQ7QUFNQTFOLEVBQUFBLFdBQVcsQ0FBQ0MsRUFBWixDQUFnQixPQUFoQixFQUF5QnlOLFNBQXpCLEVBQW9DLFlBQVc7QUFDOUMsUUFBTXJOLE1BQU0sR0FBR04sQ0FBQyxDQUFFLElBQUYsQ0FBRCxDQUFVMEIsT0FBVixDQUFtQixtQkFBbkIsQ0FBZjtBQUVBMkwsSUFBQUEsMEJBQTBCLENBQUUvTSxNQUFGLENBQTFCO0FBQ0EsR0FKRDtBQU1BTCxFQUFBQSxXQUFXLENBQUNDLEVBQVosQ0FBZ0IsUUFBaEIsRUFBMEIsaUNBQTFCLEVBQTZELFlBQVc7QUFDdkUsUUFBTTBOLFdBQVcsR0FBTzVOLENBQUMsQ0FBRSxJQUFGLENBQXpCO0FBQ0EsUUFBTTZOLFVBQVUsR0FBUUQsV0FBVyxDQUFDNUosR0FBWixFQUF4QjtBQUNBLFFBQU04SixlQUFlLEdBQUdGLFdBQVcsQ0FBQ2xNLE9BQVosQ0FBcUIsbUJBQXJCLENBQXhCO0FBQ0EsUUFBTXFNLFNBQVMsR0FBU0QsZUFBZSxDQUFDbE4sSUFBaEIsQ0FBc0IsWUFBdEIsQ0FBeEI7O0FBRUEsUUFBSyxpQkFBaUJpTixVQUF0QixFQUFtQztBQUNsQ0UsTUFBQUEsU0FBUyxDQUFDZCxTQUFWO0FBQ0EsS0FGRCxNQUVPO0FBQ05jLE1BQUFBLFNBQVMsQ0FBQ2xCLE9BQVY7QUFDQTtBQUNELEdBWEQ7QUFhQSxDQXRJRCIsImZpbGUiOiJ3Yy1hamF4LXByb2R1Y3QtZmlsdGVyLWFkbWluLXNjcmlwdHMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIFRoZSBwb3N0IG1ldGEgZmllbGQuXG4gKlxuICogQHNpbmNlICAgICAgMS4wLjBcbiAqIEBwYWNrYWdlICAgIHdjLWFqYXgtcHJvZHVjdC1maWx0ZXItcHJvXG4gKiBAc3VicGFja2FnZSB3Yy1hamF4LXByb2R1Y3QtZmlsdGVyLXByby9hZG1pbi9zcmMvanNcbiAqIEBhdXRob3IgICAgIE1haW51bCBIYXNzYW4gTWFpblxuICovXG5cbmpRdWVyeSggZG9jdW1lbnQgKS5yZWFkeSggZnVuY3Rpb24oICQgKSB7XG5cblx0Y29uc3QgJHNlYXJjaEZvcm0gPSAkKCAnI3NlYXJjaC1mb3JtJyApO1xuXG5cdCRzZWFyY2hGb3JtLm9uKCAnYWZ0ZXJfdG9nZ2xlX3JlcXVlc3QnLCBmdW5jdGlvbiggZSwgaGFuZGxlciwgdmFsdWUsICRmaWVsZCApIHtcblx0XHRpZiAoICcud2NhcGYtZm9ybS1zdWItZmllbGQtY3VzdG9tLXRheG9ub215IHNlbGVjdCcgPT09IGhhbmRsZXIgKSB7XG5cdFx0XHRjb25zdCBwYXJhbXMgICAgICAgICAgID0gd2luZG93WyAnd2NhcGZfYWRtaW5fcGFyYW1zJyBdO1xuXHRcdFx0Y29uc3QgaGllcmFyY2hpY2FsRGF0YSA9IHBhcmFtc1sgJ3RheG9ub215X2hpZXJhcmNoaWNhbF9kYXRhJyBdO1xuXG5cdFx0XHRpZiAoICEgaGllcmFyY2hpY2FsRGF0YSApIHtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXG5cdFx0XHRjb25zdCBpc0hpZXJhcmNoaWNhbCAgID0gaGllcmFyY2hpY2FsRGF0YVsgdmFsdWUgXTtcblx0XHRcdGNvbnN0ICRkZXBlbmRhbnRGaWVsZHMgPSAkZmllbGQuZmluZChcblx0XHRcdFx0Jy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1oaWVyYXJjaGljYWwsIC53Y2FwZi1mb3JtLXN1Yi1maWVsZC1zaG93X2NoaWxkcmVuX29ubHknXG5cdFx0XHQpO1xuXG5cdFx0XHRpZiAoIGlzSGllcmFyY2hpY2FsICkge1xuXHRcdFx0XHQkZGVwZW5kYW50RmllbGRzLnNob3coKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdCRkZXBlbmRhbnRGaWVsZHMuaGlkZSgpO1xuXHRcdFx0fVxuXHRcdH1cblx0fSApO1xuXG5cdGZ1bmN0aW9uIGluaXRTb3J0YWJsZUZvck1hbnVhbE9wdGlvbnMoICRzZWxlY3RvciApIHtcblx0XHQkc2VsZWN0b3Iuc29ydGFibGUoIHtcblx0XHRcdG9wYWNpdHk6IDAuOCxcblx0XHRcdHJldmVydDogZmFsc2UsXG5cdFx0XHRjdXJzb3I6ICdtb3ZlJyxcblx0XHRcdGF4aXM6ICd5Jyxcblx0XHRcdGhhbmRsZTogJy5tb3ZlLW9wdGlvbnMtaGFuZGxlcicsXG5cdFx0XHRwbGFjZWhvbGRlcjogJ3dpZGdldC1wbGFjZWhvbGRlcicsXG5cdFx0XHR1cGRhdGU6IGZ1bmN0aW9uKCBlICkge1xuXHRcdFx0XHRjb25zdCAkZmllbGQgPSAkKCBlLnRhcmdldCApLmNsb3Nlc3QoICcud2NhcGYtZm9ybS1maWVsZCcgKTtcblxuXHRcdFx0XHR0cmlnZ2VyTWFudWFsT3B0aW9uc0NoYW5nZSggJGZpZWxkICk7XG5cdFx0XHR9XG5cdFx0fSApLmRpc2FibGVTZWxlY3Rpb24oKTtcblx0fVxuXG5cdC8vIFNvcnQgTWFudWFsIE9wdGlvbnNcblx0aW5pdFNvcnRhYmxlRm9yTWFudWFsT3B0aW9ucyggJHNlYXJjaEZvcm0uZmluZCggJy5tYW51YWwtb3B0aW9ucy10YWJsZSAubWFudWFsLW9wdGlvbnMtdGFibGUtYm9keS1yb3dzJyApICk7XG5cblx0JHNlYXJjaEZvcm0ub24oICdmaWVsZF9hZGRlZCcsIGZ1bmN0aW9uKCBlLCB1aSApIHtcblx0XHQvLyBJbml0IFNvcnRhYmxlIGZvciB0aGUgbWFudWFsIG9wdGlvbnMuXG5cdFx0aW5pdFNvcnRhYmxlRm9yTWFudWFsT3B0aW9ucyggJCggdWkuaXRlbS5maW5kKCAnLm1hbnVhbC1vcHRpb25zLXRhYmxlLWJvZHktcm93cycgKSApICk7XG5cdH0gKTtcblxuXHRmdW5jdGlvbiB0cmlnZ2VyUmVtb3ZlT3B0aW9uKCAkZmllbGQgKSB7XG5cdFx0Y29uc3QgJG9wdGlvbnNUYWJsZSA9ICRmaWVsZC5maW5kKCAnLm1hbnVhbC1vcHRpb25zLXRhYmxlJyApO1xuXHRcdGNvbnN0IHRhYmxlUm93cyAgICAgPSAkb3B0aW9uc1RhYmxlLmZpbmQoICcubWFudWFsLW9wdGlvbnMtdGFibGUtYm9keS1yb3dzJyApLmNoaWxkcmVuKCk7XG5cblx0XHRpZiAoIDIgPiB0YWJsZVJvd3MubGVuZ3RoICkge1xuXHRcdFx0JG9wdGlvbnNUYWJsZS5yZW1vdmVDbGFzcyggJ2hhcy1vcHRpb25zJyApO1xuXHRcdH1cblx0fVxuXG5cdC8vIFJlbW92ZSBTaW5nbGUgT3B0aW9uXG5cdCRzZWFyY2hGb3JtLm9uKCAnY2xpY2snLCAnLnJlbW92ZS1vcHRpb24nLCBmdW5jdGlvbigpIHtcblx0XHRjb25zdCAkaXRlbSAgPSAkKCB0aGlzICkuY2xvc2VzdCggJy5pdGVtJyApO1xuXHRcdGNvbnN0ICRmaWVsZCA9ICRpdGVtLmNsb3Nlc3QoICcud2NhcGYtZm9ybS1maWVsZCcgKTtcblxuXHRcdHRyaWdnZXJSZW1vdmVPcHRpb24oICRmaWVsZCApO1xuXG5cdFx0JGl0ZW0ucmVtb3ZlKCk7XG5cblx0XHR0cmlnZ2VyTWFudWFsT3B0aW9uc0NoYW5nZSggJGZpZWxkICk7XG5cdH0gKTtcblxuXHQvLyBDbGVhciBBbGwgT3B0aW9uc1xuXHQkc2VhcmNoRm9ybS5vbiggJ2NsaWNrJywgJy5jbGVhci1hbGwtb3B0aW9ucycsIGZ1bmN0aW9uKCkge1xuXHRcdGNvbnN0ICRmaWVsZCAgICAgICAgPSAkKCB0aGlzICkuY2xvc2VzdCggJy53Y2FwZi1mb3JtLWZpZWxkJyApO1xuXHRcdGNvbnN0ICRvcHRpb25zVGFibGUgPSAkZmllbGQuZmluZCggJy5tYW51YWwtb3B0aW9ucy10YWJsZScgKTtcblxuXHRcdCRvcHRpb25zVGFibGUuZmluZCggJy5tYW51YWwtb3B0aW9ucy10YWJsZS1ib2R5LXJvd3MnICkuZW1wdHkoKTtcblxuXHRcdHRyaWdnZXJSZW1vdmVPcHRpb24oICRmaWVsZCApO1xuXG5cdFx0dHJpZ2dlck1hbnVhbE9wdGlvbnNDaGFuZ2UoICRmaWVsZCApO1xuXHR9ICk7XG5cblx0Ly8gQWRkIE5ldyBPcHRpb25cblx0JHNlYXJjaEZvcm0ub24oICdjbGljaycsICcuYWRkLW9wdGlvbicsIGZ1bmN0aW9uKCkge1xuXHRcdGNvbnN0IGZpZWxkVHlwZSA9ICd3Y2FwZi1wb3N0LW1ldGEtb3B0aW9uJztcblxuXHRcdC8vIEJhaWwgb3V0IGlmIG5vIHRtcGwgZm91bmQgZm9yIHRoZSB0eXBlLlxuXHRcdGlmICggISBqUXVlcnkoICcjdG1wbC0nICsgZmllbGRUeXBlICkubGVuZ3RoICkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdGNvbnN0ICRmaWVsZCA9ICQoIHRoaXMgKS5jbG9zZXN0KCAnLndjYXBmLWZvcm0tZmllbGQnICk7XG5cblx0XHRjb25zdCB0ZW1wbGF0ZSA9IHdwLnRlbXBsYXRlKCBmaWVsZFR5cGUgKTtcblx0XHRjb25zdCByZW5kZXJlZCA9IHRlbXBsYXRlKCB7IHZhbHVlOiAnJywgbGFiZWw6ICcnIH0gKTtcblx0XHRjb25zdCAkd3JhcHBlciA9ICRmaWVsZC5maW5kKCAnLm1hbnVhbC1vcHRpb25zLXRhYmxlJyApO1xuXHRcdGNvbnN0ICRyb3dzICAgID0gJHdyYXBwZXIuZmluZCggJy5tYW51YWwtb3B0aW9ucy10YWJsZS1ib2R5LXJvd3MnICk7XG5cblx0XHQkcm93cy5hcHBlbmQoIHJlbmRlcmVkICk7XG5cblx0XHRpZiAoICEgJHdyYXBwZXIuaGFzQ2xhc3MoICdoYXMtb3B0aW9ucycgKSApIHtcblx0XHRcdCR3cmFwcGVyLmFkZENsYXNzKCAnaGFzLW9wdGlvbnMnICk7XG5cdFx0fVxuXHR9ICk7XG5cblx0Y29uc3QgJHBvc3RNZXRhT3B0aW9uc01vZGFsID0gJCggJy5wb3N0LW1ldGEtb3B0aW9ucy1tb2RhbCcgKTtcblx0Y29uc3QgJG5vS2V5Rm91bmRNZXNzYWdlICAgID0gJHBvc3RNZXRhT3B0aW9uc01vZGFsLmZpbmQoICcubm8ta2V5LWZvdW5kLW1lc3NhZ2UnICk7XG5cdGNvbnN0ICRwb3N0TWV0YU1vZGFsTG9hZGVyICA9ICRwb3N0TWV0YU9wdGlvbnNNb2RhbC5maW5kKCAnLnBvc3QtbWV0YS1vcHRpb25zLWxvYWRlcicgKTtcblx0Y29uc3QgJHBvc3RNZXRhT3B0aW9ucyAgICAgID0gJHBvc3RNZXRhT3B0aW9uc01vZGFsLmZpbmQoICcucG9zdC1tZXRhLW9wdGlvbnMnICk7XG5cdGNvbnN0ICRwb3N0TWV0YU1vZGFsRm9vdGVyICA9ICRwb3N0TWV0YU9wdGlvbnNNb2RhbC5maW5kKCAnLndjYXBmLW1vZGFsLWZvb3RlcicgKTtcblxuXHRjb25zdCBwb3N0TWV0YU9wdGlvbnNNb2RhbEluc3RhbmNlID0gJHBvc3RNZXRhT3B0aW9uc01vZGFsLnJlbW9kYWwoIHtcblx0XHRoYXNoVHJhY2tpbmc6IGZhbHNlLFxuXHR9ICk7XG5cblx0bGV0ICRwb3N0TWV0YUZpZWxkID0gbnVsbDtcblxuXHRmdW5jdGlvbiByZXNldFBvc3RNZXRhTW9kYWwoKSB7XG5cdFx0JHBvc3RNZXRhT3B0aW9ucy5odG1sKCAnJyApO1xuXHRcdCRwb3N0TWV0YU1vZGFsTG9hZGVyLnJlbW92ZUNsYXNzKCAnYWN0aXZlJyApO1xuXHRcdCRub0tleUZvdW5kTWVzc2FnZS5yZW1vdmVDbGFzcyggJ2FjdGl2ZScgKTtcblx0XHQkcG9zdE1ldGFNb2RhbEZvb3Rlci5yZW1vdmVDbGFzcyggJ2FjdGl2ZScgKTtcblx0XHQkcG9zdE1ldGFPcHRpb25zTW9kYWwuZmluZCggJy5yZXBsYWNlLWN1cnJlbnQtb3B0aW9ucycgKS5wcm9wKCAnY2hlY2tlZCcsIGZhbHNlICk7XG5cdH1cblxuXHQvLyBCcm93c2UgVmFsdWVzXG5cdCRzZWFyY2hGb3JtLm9uKCAnY2xpY2snLCAnLmJyb3dzZS12YWx1ZXMnLCBmdW5jdGlvbigpIHtcblx0XHRyZXNldFBvc3RNZXRhTW9kYWwoKTtcblxuXHRcdGNvbnN0ICRmaWVsZCAgICAgICAgPSAkKCB0aGlzICkuY2xvc2VzdCggJy53Y2FwZi1mb3JtLWZpZWxkJyApO1xuXHRcdGNvbnN0ICRpbnB1dE1ldGFLZXkgPSAkZmllbGQuZmluZCggJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1tZXRhX2tleSBzZWxlY3QnICk7XG5cdFx0Y29uc3QgbWV0YUtleSAgICAgICA9ICRpbnB1dE1ldGFLZXkudmFsKCk7XG5cblx0XHRpZiAoICEgbWV0YUtleSApIHtcblx0XHRcdCRub0tleUZvdW5kTWVzc2FnZS5hZGRDbGFzcyggJ2FjdGl2ZScgKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0JG5vS2V5Rm91bmRNZXNzYWdlLnJlbW92ZUNsYXNzKCAnYWN0aXZlJyApO1xuXHRcdH1cblxuXHRcdHBvc3RNZXRhT3B0aW9uc01vZGFsSW5zdGFuY2Uub3BlbigpO1xuXHRcdCRwb3N0TWV0YUZpZWxkID0gJGZpZWxkO1xuXG5cdFx0aWYgKCAhIG1ldGFLZXkgKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0Ly8gU2hvdyB0aGUgbG9hZGluZyBhbmltYXRpb24uXG5cdFx0JHBvc3RNZXRhTW9kYWxMb2FkZXIuYWRkQ2xhc3MoICdhY3RpdmUnICk7XG5cblx0XHQvKipcblx0XHQgKiBBamF4J3Mgc3VjY2VzcyBmdW5jdGlvbi5cblx0XHQgKlxuXHRcdCAqIEBwYXJhbSByZXNwb25zZVxuXHRcdCAqL1xuXHRcdGZ1bmN0aW9uIG9rQ2FsbGJhY2soIHJlc3BvbnNlICkge1xuXHRcdFx0Ly8gSGlkZSB0aGUgbG9hZGluZyBhbmltYXRpb24uXG5cdFx0XHQkcG9zdE1ldGFNb2RhbExvYWRlci5yZW1vdmVDbGFzcyggJ2FjdGl2ZScgKTtcblx0XHRcdCRwb3N0TWV0YU1vZGFsRm9vdGVyLmFkZENsYXNzKCAnYWN0aXZlJyApO1xuXG5cdFx0XHQkcG9zdE1ldGFPcHRpb25zLmh0bWwoIHJlc3BvbnNlICk7XG5cdFx0fVxuXG5cdFx0LyoqXG5cdFx0ICogQWpheCdzIGVycm9yIGZ1bmN0aW9uLlxuXHRcdCAqXG5cdFx0ICogQHBhcmFtIG1lc3NhZ2Vcblx0XHQgKi9cblx0XHRmdW5jdGlvbiBlcnJDYWxsYmFjayggbWVzc2FnZSApIHtcblx0XHRcdGNvbnNvbGUubG9nKCAnZXJyb3InLCBtZXNzYWdlICk7XG5cblx0XHRcdC8vIEhpZGUgdGhlIGxvYWRpbmcgYW5pbWF0aW9uLlxuXHRcdFx0JHBvc3RNZXRhTW9kYWxMb2FkZXIucmVtb3ZlQ2xhc3MoICdhY3RpdmUnICk7XG5cdFx0fVxuXG5cdFx0Y29uc3QgZm9ybURhdGEgPSB7XG5cdFx0XHRrZXk6IG1ldGFLZXksXG5cdFx0XHRhY3Rpb246ICd3Y2FwZl9nZXRfbWV0YV9vcHRpb25zJyxcblx0XHR9XG5cblx0XHQvLyBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL2EvNTkxODEyNTJcblx0XHR3cC5hamF4LnBvc3QoIGZvcm1EYXRhICkuZG9uZSggb2tDYWxsYmFjayApLmZhaWwoIGVyckNhbGxiYWNrICk7XG5cdH0gKTtcblxuXHQvKipcblx0ICogUmVzZXQgdGhlIHBvc3QgbWV0YSBvcHRpb24ncyBtb2RhbCB3aGVuIG1vZGFsIGdldHMgY2xvc2VkLlxuXHQgKi9cblx0JCggZG9jdW1lbnQgKS5vbiggJ2Nsb3NlZCcsICRwb3N0TWV0YU9wdGlvbnNNb2RhbCwgZnVuY3Rpb24oKSB7XG5cdFx0cmVzZXRQb3N0TWV0YU1vZGFsKCk7XG5cdFx0JHBvc3RNZXRhRmllbGQgPSBudWxsO1xuXHR9ICk7XG5cblx0Ly8gVW5zZWxlY3QgYWxsIHZhbHVlcy5cblx0JHBvc3RNZXRhT3B0aW9uc01vZGFsLm9uKCAnY2xpY2snLCAnLnNlbGVjdC1ub25lJywgZnVuY3Rpb24oKSB7XG5cdFx0JHBvc3RNZXRhT3B0aW9ucy5maW5kKCAnW3R5cGU9XCJjaGVja2JveFwiXScgKS5wcm9wKCAnY2hlY2tlZCcsIGZhbHNlICk7XG5cdH0gKTtcblxuXHQvLyBTZWxlY3QgYWxsIHZhbHVlcy5cblx0JHBvc3RNZXRhT3B0aW9uc01vZGFsLm9uKCAnY2xpY2snLCAnLnNlbGVjdC1hbGwnLCBmdW5jdGlvbigpIHtcblx0XHQkcG9zdE1ldGFPcHRpb25zLmZpbmQoICdbdHlwZT1cImNoZWNrYm94XCJdJyApLnByb3AoICdjaGVja2VkJywgdHJ1ZSApO1xuXHR9ICk7XG5cblx0ZnVuY3Rpb24gdHJpZ2dlck1hbnVhbE9wdGlvbnNDaGFuZ2UoICRwb3N0TWV0YUZpZWxkICkge1xuXHRcdGNvbnN0ICR2YWx1ZUhvbGRlciAgPSAkcG9zdE1ldGFGaWVsZC5maW5kKCAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLW1hbnVhbF9vcHRpb25zIGlucHV0JyApO1xuXHRcdGNvbnN0ICRvcHRpb25zVGFibGUgPSAkcG9zdE1ldGFGaWVsZC5maW5kKCAnLm1hbnVhbC1vcHRpb25zLXRhYmxlJyApO1xuXHRcdGNvbnN0ICRyb3dzICAgICAgICAgPSAkb3B0aW9uc1RhYmxlLmZpbmQoICcubWFudWFsLW9wdGlvbnMtdGFibGUtYm9keS1yb3dzJyApO1xuXHRcdGNvbnN0IF9yb3dzICAgICAgICAgPSBbXTtcblxuXHRcdCRyb3dzLmZpbmQoICcuaXRlbScgKS5lYWNoKCBmdW5jdGlvbiggaSwgX2l0ZW0gKSB7XG5cdFx0XHRjb25zdCAkaXRlbSA9ICQoIF9pdGVtICk7XG5cdFx0XHRjb25zdCB2YWx1ZSA9ICRpdGVtLmZpbmQoICcub3B0aW9uX3ZhbHVlJyApLnZhbCgpO1xuXHRcdFx0Y29uc3QgbGFiZWwgPSAkaXRlbS5maW5kKCAnLm9wdGlvbl9sYWJlbCcgKS52YWwoKTtcblxuXHRcdFx0aWYgKCB2YWx1ZSAmJiBsYWJlbCApIHtcblx0XHRcdFx0X3Jvd3MucHVzaCggWyB2YWx1ZSwgbGFiZWwgXSApO1xuXHRcdFx0fVxuXHRcdH0gKTtcblxuXHRcdGNvbnN0IHJhd1ZhbHVlcyA9IGVuY29kZVVSSUNvbXBvbmVudCggSlNPTi5zdHJpbmdpZnkoIF9yb3dzICkgKTtcblx0XHQkdmFsdWVIb2xkZXIudmFsKCByYXdWYWx1ZXMgKTtcblx0fVxuXG5cdC8vIEFkZCBzZWxlY3RlZCBvcHRpb25zLlxuXHQkcG9zdE1ldGFPcHRpb25zTW9kYWwub24oICdjbGljaycsICcuYWRkLW9wdGlvbnMnLCBmdW5jdGlvbigpIHtcblx0XHRjb25zdCAkb3B0aW9ucyA9ICRwb3N0TWV0YU9wdGlvbnMuZmluZCggJ1t0eXBlPVwiY2hlY2tib3hcIl0nICk7XG5cdFx0bGV0IGlzUmVwbGFjZSAgPSBmYWxzZTtcblx0XHRsZXQgcm93cyAgICAgICA9ICcnO1xuXG5cdFx0aWYgKCAkcG9zdE1ldGFNb2RhbEZvb3Rlci5maW5kKCAnLnJlcGxhY2UtY3VycmVudC1vcHRpb25zJyApLmlzKCAnOmNoZWNrZWQnICkgKSB7XG5cdFx0XHRpc1JlcGxhY2UgPSB0cnVlO1xuXHRcdH1cblxuXHRcdGlmICggJG9wdGlvbnMgKSB7XG5cdFx0XHRjb25zdCBmaWVsZFR5cGUgPSAnd2NhcGYtcG9zdC1tZXRhLW9wdGlvbic7XG5cblx0XHRcdCQuZWFjaCggJG9wdGlvbnMsIGZ1bmN0aW9uKCBpLCBpbnB1dCApIHtcblx0XHRcdFx0Y29uc3QgJGlucHV0ID0gJCggaW5wdXQgKTtcblx0XHRcdFx0Y29uc3QgdmFsdWUgID0gJGlucHV0LnZhbCgpO1xuXG5cdFx0XHRcdGlmICggJGlucHV0LmlzKCAnOmNoZWNrZWQnICkgKSB7XG5cdFx0XHRcdFx0Y29uc3QgdGVtcGxhdGUgPSB3cC50ZW1wbGF0ZSggZmllbGRUeXBlICk7XG5cdFx0XHRcdFx0Y29uc3QgcmVuZGVyZWQgPSB0ZW1wbGF0ZSggeyB2YWx1ZSwgbGFiZWw6IHZhbHVlIH0gKTtcblxuXHRcdFx0XHRcdHJvd3MgKz0gcmVuZGVyZWQ7XG5cdFx0XHRcdH1cblx0XHRcdH0gKTtcblx0XHR9XG5cblx0XHRpZiAoIHJvd3MgKSB7XG5cdFx0XHRjb25zdCAkd3JhcHBlciA9ICRwb3N0TWV0YUZpZWxkLmZpbmQoICcubWFudWFsLW9wdGlvbnMtdGFibGUnICk7XG5cdFx0XHRjb25zdCAkcm93cyAgICA9ICR3cmFwcGVyLmZpbmQoICcubWFudWFsLW9wdGlvbnMtdGFibGUtYm9keS1yb3dzJyApO1xuXG5cdFx0XHRpZiAoIGlzUmVwbGFjZSApIHtcblx0XHRcdFx0JHJvd3MuaHRtbCggcm93cyApO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0JHJvd3MuYXBwZW5kKCByb3dzICk7XG5cdFx0XHR9XG5cblx0XHRcdGlmICggISAkd3JhcHBlci5oYXNDbGFzcyggJ2hhcy1vcHRpb25zJyApICkge1xuXHRcdFx0XHQkd3JhcHBlci5hZGRDbGFzcyggJ2hhcy1vcHRpb25zJyApO1xuXHRcdFx0fVxuXG5cdFx0XHR0cmlnZ2VyTWFudWFsT3B0aW9uc0NoYW5nZSggJHBvc3RNZXRhRmllbGQgKTtcblx0XHR9XG5cblx0XHRwb3N0TWV0YU9wdGlvbnNNb2RhbEluc3RhbmNlLmNsb3NlKCk7XG5cdH0gKTtcblxuXHQkc2VhcmNoRm9ybS5vbiggJ2FmdGVyX3RvZ2dsZV9yZXF1ZXN0JywgZnVuY3Rpb24oIGUsIGhhbmRsZXIsIHZhbHVlLCAkZmllbGQgKSB7XG5cdFx0aWYgKCAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLWdldF9vcHRpb25zIGlucHV0JyA9PT0gaGFuZGxlciApIHtcblx0XHRcdGNvbnN0ICRzZWxlY3RFbG0gICAgICAgPSAkZmllbGQuZmluZCggJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1vcHRpb25zX29yZGVyX2J5IHNlbGVjdCcgKTtcblx0XHRcdGNvbnN0IG9yZGVyQnkgICAgICAgICAgPSAkc2VsZWN0RWxtLnZhbCgpO1xuXHRcdFx0Y29uc3QgZGVwZW5kYW50T3B0aW9ucyA9ICdvcHRpb25bdmFsdWU9XCJsYWJlbFwiXSc7XG5cblx0XHRcdGlmICggJ2F1dG9tYXRpY2FsbHknID09PSB2YWx1ZSApIHtcblx0XHRcdFx0JHNlbGVjdEVsbS5jaGlsZHJlbiggZGVwZW5kYW50T3B0aW9ucyApLmF0dHIoICdkaXNhYmxlZCcsICdkaXNhYmxlZCcgKTtcblxuXHRcdFx0XHRpZiAoICdsYWJlbCcgPT09IG9yZGVyQnkgKSB7XG5cdFx0XHRcdFx0JHNlbGVjdEVsbS5wcm9wKCAnc2VsZWN0ZWRJbmRleCcsIDEgKS5jaGFuZ2UoKTtcblx0XHRcdFx0fVxuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0JHNlbGVjdEVsbS5jaGlsZHJlbiggZGVwZW5kYW50T3B0aW9ucyApLnJlbW92ZUF0dHIoICdkaXNhYmxlZCcgKTtcblx0XHRcdH1cblx0XHR9XG5cdH0gKTtcblxuXHRmdW5jdGlvbiBkaXNhYmxlT3JkZXJCeU9wdGlvbnMoICRlbG0gKSB7XG5cdFx0Y29uc3QgdmFsdWUgICAgICAgICAgICAgICAgPSAkZWxtLnZhbCgpO1xuXHRcdGNvbnN0ICR3cmFwcGVyICAgICAgICAgICAgID0gJGVsbS5jbG9zZXN0KCAnLndjYXBmLXBvc3QtbWV0YS1vcmRlci1vcHRpb25zLWZpZWxkJyApO1xuXHRcdGNvbnN0ICRvcmRlckRpcmVjdGlvbkZpZWxkID0gJHdyYXBwZXIuZmluZCggJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1vcHRpb25zX29yZGVyX2RpciBzZWxlY3QnICk7XG5cdFx0Y29uc3QgJG9yZGVyVHlwZUZpZWxkICAgICAgPSAkd3JhcHBlci5maW5kKCAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLW9wdGlvbnNfb3JkZXJfdHlwZSBzZWxlY3QnICk7XG5cblx0XHRpZiAoICdub25lJyA9PT0gdmFsdWUgKSB7XG5cdFx0XHQkb3JkZXJEaXJlY3Rpb25GaWVsZC5hdHRyKCAnZGlzYWJsZWQnLCAnZGlzYWJsZWQnICk7XG5cdFx0XHQkb3JkZXJUeXBlRmllbGQuYXR0ciggJ2Rpc2FibGVkJywgJ2Rpc2FibGVkJyApO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHQkb3JkZXJEaXJlY3Rpb25GaWVsZC5yZW1vdmVBdHRyKCAnZGlzYWJsZWQnICk7XG5cdFx0XHQkb3JkZXJUeXBlRmllbGQucmVtb3ZlQXR0ciggJ2Rpc2FibGVkJyApO1xuXHRcdH1cblx0fVxuXG5cdCRzZWFyY2hGb3JtLmZpbmQoICcud2NhcGYtZm9ybS1zdWItZmllbGQtb3B0aW9uc19vcmRlcl9ieSBzZWxlY3QnICkuZWFjaCggZnVuY3Rpb24oKSB7XG5cdFx0Y29uc3QgJHRoaXMgPSAkKCB0aGlzICk7XG5cblx0XHRkaXNhYmxlT3JkZXJCeU9wdGlvbnMoICR0aGlzICk7XG5cdH0gKTtcblxuXHQkc2VhcmNoRm9ybS5vbiggJ2NoYW5nZScsICcud2NhcGYtZm9ybS1zdWItZmllbGQtb3B0aW9uc19vcmRlcl9ieSBzZWxlY3QnLCBmdW5jdGlvbigpIHtcblx0XHRjb25zdCAkdGhpcyA9ICQoIHRoaXMgKTtcblxuXHRcdGRpc2FibGVPcmRlckJ5T3B0aW9ucyggJHRoaXMgKTtcblx0fSApO1xuXG5cdCRzZWFyY2hGb3JtLm9uKCAnaW5wdXQnLCAnLm1hbnVhbC1vcHRpb25zLXRhYmxlIGlucHV0W3R5cGU9XCJ0ZXh0XCJdJywgZnVuY3Rpb24oKSB7XG5cdFx0Y29uc3QgJGZpZWxkID0gJCggdGhpcyApLmNsb3Nlc3QoICcud2NhcGYtZm9ybS1maWVsZCcgKTtcblxuXHRcdHRyaWdnZXJNYW51YWxPcHRpb25zQ2hhbmdlKCAkZmllbGQgKTtcblx0fSApO1xuXG5cdC8qKlxuXHQgKiBWYWx1ZSB0eXBlICdOdW1iZXInXG5cdCAqL1xuXG5cdGZ1bmN0aW9uIGluaXRTb3J0YWJsZUZvck51bWJlck1hbnVhbE9wdGlvbnMoICRzZWxlY3RvciApIHtcblx0XHQkc2VsZWN0b3Iuc29ydGFibGUoIHtcblx0XHRcdG9wYWNpdHk6IDAuOCxcblx0XHRcdHJldmVydDogZmFsc2UsXG5cdFx0XHRjdXJzb3I6ICdtb3ZlJyxcblx0XHRcdGF4aXM6ICd5Jyxcblx0XHRcdGhhbmRsZTogJy5tb3ZlLW9wdGlvbnMtaGFuZGxlcicsXG5cdFx0XHRwbGFjZWhvbGRlcjogJ3dpZGdldC1wbGFjZWhvbGRlcicsXG5cdFx0XHR1cGRhdGU6IGZ1bmN0aW9uKCBlICkge1xuXHRcdFx0XHRjb25zdCAkZmllbGQgPSAkKCBlLnRhcmdldCApLmNsb3Nlc3QoICcud2NhcGYtZm9ybS1maWVsZCcgKTtcblxuXHRcdFx0XHR0cmlnZ2VyTnVtYmVyTWFudWFsT3B0aW9uc0NoYW5nZSggJGZpZWxkICk7XG5cdFx0XHR9XG5cdFx0fSApLmRpc2FibGVTZWxlY3Rpb24oKTtcblx0fVxuXG5cdC8vIFNvcnQgTnVtYmVyIE1hbnVhbCBPcHRpb25zXG5cdGluaXRTb3J0YWJsZUZvck51bWJlck1hbnVhbE9wdGlvbnMoICRzZWFyY2hGb3JtLmZpbmQoICcubnVtYmVyLW1hbnVhbC1vcHRpb25zLXRhYmxlIC5tYW51YWwtb3B0aW9ucy10YWJsZS1ib2R5LXJvd3MnICkgKTtcblxuXHQkc2VhcmNoRm9ybS5vbiggJ2ZpZWxkX2FkZGVkJywgZnVuY3Rpb24oIGUsIHVpICkge1xuXHRcdC8vIEluaXQgU29ydGFibGUgZm9yIHRoZSBudW1iZXIgbWFudWFsIG9wdGlvbnMuXG5cdFx0aW5pdFNvcnRhYmxlRm9yTnVtYmVyTWFudWFsT3B0aW9ucyggJCggdWkuaXRlbS5maW5kKCAnLm1hbnVhbC1vcHRpb25zLXRhYmxlLWJvZHktcm93cycgKSApICk7XG5cdH0gKTtcblxuXHRmdW5jdGlvbiB0cmlnZ2VyUmVtb3ZlTnVtYmVyT3B0aW9uKCAkZmllbGQgKSB7XG5cdFx0Y29uc3QgJG9wdGlvbnNUYWJsZSA9ICRmaWVsZC5maW5kKCAnLm51bWJlci1tYW51YWwtb3B0aW9ucy10YWJsZScgKTtcblx0XHRjb25zdCB0YWJsZVJvd3MgICAgID0gJG9wdGlvbnNUYWJsZS5maW5kKCAnLm1hbnVhbC1vcHRpb25zLXRhYmxlLWJvZHktcm93cycgKS5jaGlsZHJlbigpO1xuXG5cdFx0aWYgKCAyID4gdGFibGVSb3dzLmxlbmd0aCApIHtcblx0XHRcdCRvcHRpb25zVGFibGUucmVtb3ZlQ2xhc3MoICdoYXMtb3B0aW9ucycgKTtcblx0XHR9XG5cdH1cblxuXHRmdW5jdGlvbiB0cmlnZ2VyTnVtYmVyTWFudWFsT3B0aW9uc0NoYW5nZSggJHBvc3RNZXRhRmllbGQgKSB7XG5cdFx0Y29uc3QgJHZhbHVlSG9sZGVyICA9ICRwb3N0TWV0YUZpZWxkLmZpbmQoICcud2NhcGYtZm9ybS1zdWItZmllbGQtbnVtYmVyX21hbnVhbF9vcHRpb25zIGlucHV0JyApO1xuXHRcdGNvbnN0ICRvcHRpb25zVGFibGUgPSAkcG9zdE1ldGFGaWVsZC5maW5kKCAnLm51bWJlci1tYW51YWwtb3B0aW9ucy10YWJsZScgKTtcblx0XHRjb25zdCAkcm93cyAgICAgICAgID0gJG9wdGlvbnNUYWJsZS5maW5kKCAnLm1hbnVhbC1vcHRpb25zLXRhYmxlLWJvZHktcm93cycgKTtcblx0XHRjb25zdCBfcm93cyAgICAgICAgID0gW107XG5cblx0XHQkcm93cy5maW5kKCAnLml0ZW0nICkuZWFjaCggZnVuY3Rpb24oIGksIF9pdGVtICkge1xuXHRcdFx0Y29uc3QgJGl0ZW0gICAgID0gJCggX2l0ZW0gKTtcblx0XHRcdGNvbnN0IG1pbl92YWx1ZSA9ICRpdGVtLmZpbmQoICcub3B0aW9uX21pbl92YWx1ZScgKS52YWwoKTtcblx0XHRcdGNvbnN0IG1heF92YWx1ZSA9ICRpdGVtLmZpbmQoICcub3B0aW9uX21heF92YWx1ZScgKS52YWwoKTtcblx0XHRcdGNvbnN0IGxhYmVsICAgICA9ICRpdGVtLmZpbmQoICcub3B0aW9uX2xhYmVsJyApLnZhbCgpO1xuXG5cdFx0XHRpZiAoIG1pbl92YWx1ZSAmJiBtYXhfdmFsdWUgJiYgbGFiZWwgKSB7XG5cdFx0XHRcdF9yb3dzLnB1c2goIFsgbWluX3ZhbHVlLCBtYXhfdmFsdWUsIGxhYmVsIF0gKTtcblx0XHRcdH1cblx0XHR9ICk7XG5cblx0XHRjb25zdCByYXdWYWx1ZXMgPSBlbmNvZGVVUklDb21wb25lbnQoIEpTT04uc3RyaW5naWZ5KCBfcm93cyApICk7XG5cdFx0JHZhbHVlSG9sZGVyLnZhbCggcmF3VmFsdWVzICk7XG5cdH1cblxuXHQvLyBSZW1vdmUgU2luZ2xlIE51bWJlciBPcHRpb25cblx0JHNlYXJjaEZvcm0ub24oICdjbGljaycsICcucmVtb3ZlLW51bWJlci1vcHRpb24nLCBmdW5jdGlvbigpIHtcblx0XHRjb25zdCAkaXRlbSAgPSAkKCB0aGlzICkuY2xvc2VzdCggJy5pdGVtJyApO1xuXHRcdGNvbnN0ICRmaWVsZCA9ICRpdGVtLmNsb3Nlc3QoICcud2NhcGYtZm9ybS1maWVsZCcgKTtcblxuXHRcdHRyaWdnZXJSZW1vdmVOdW1iZXJPcHRpb24oICRmaWVsZCApO1xuXG5cdFx0JGl0ZW0ucmVtb3ZlKCk7XG5cblx0XHR0cmlnZ2VyTnVtYmVyTWFudWFsT3B0aW9uc0NoYW5nZSggJGZpZWxkICk7XG5cdH0gKTtcblxuXHQvLyBDbGVhciBBbGwgT3B0aW9uc1xuXHQkc2VhcmNoRm9ybS5vbiggJ2NsaWNrJywgJy5jbGVhci1hbGwtbnVtYmVyLW9wdGlvbnMnLCBmdW5jdGlvbigpIHtcblx0XHRjb25zdCAkZmllbGQgICAgICAgID0gJCggdGhpcyApLmNsb3Nlc3QoICcud2NhcGYtZm9ybS1maWVsZCcgKTtcblx0XHRjb25zdCAkb3B0aW9uc1RhYmxlID0gJGZpZWxkLmZpbmQoICcubnVtYmVyLW1hbnVhbC1vcHRpb25zLXRhYmxlJyApO1xuXG5cdFx0JG9wdGlvbnNUYWJsZS5maW5kKCAnLm1hbnVhbC1vcHRpb25zLXRhYmxlLWJvZHktcm93cycgKS5lbXB0eSgpO1xuXG5cdFx0dHJpZ2dlclJlbW92ZU51bWJlck9wdGlvbiggJGZpZWxkICk7XG5cblx0XHR0cmlnZ2VyTnVtYmVyTWFudWFsT3B0aW9uc0NoYW5nZSggJGZpZWxkICk7XG5cdH0gKTtcblxuXHQvLyBBZGQgTmV3IE9wdGlvblxuXHQkc2VhcmNoRm9ybS5vbiggJ2NsaWNrJywgJy5hZGQtbnVtYmVyLW9wdGlvbicsIGZ1bmN0aW9uKCkge1xuXHRcdGNvbnN0IGZpZWxkVHlwZSA9ICd3Y2FwZi1wb3N0LW1ldGEtdHlwZS1udW1iZXItb3B0aW9uJztcblxuXHRcdC8vIEJhaWwgb3V0IGlmIG5vIHRtcGwgZm91bmQgZm9yIHRoZSB0eXBlLlxuXHRcdGlmICggISBqUXVlcnkoICcjdG1wbC0nICsgZmllbGRUeXBlICkubGVuZ3RoICkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdGNvbnN0ICRmaWVsZCA9ICQoIHRoaXMgKS5jbG9zZXN0KCAnLndjYXBmLWZvcm0tZmllbGQnICk7XG5cblx0XHRjb25zdCB0ZW1wbGF0ZSA9IHdwLnRlbXBsYXRlKCBmaWVsZFR5cGUgKTtcblx0XHRjb25zdCByZW5kZXJlZCA9IHRlbXBsYXRlKCB7IHZhbHVlOiAnJywgbGFiZWw6ICcnIH0gKTtcblx0XHRjb25zdCAkd3JhcHBlciA9ICRmaWVsZC5maW5kKCAnLm51bWJlci1tYW51YWwtb3B0aW9ucy10YWJsZScgKTtcblx0XHRjb25zdCAkcm93cyAgICA9ICR3cmFwcGVyLmZpbmQoICcubWFudWFsLW9wdGlvbnMtdGFibGUtYm9keS1yb3dzJyApO1xuXG5cdFx0JHJvd3MuYXBwZW5kKCByZW5kZXJlZCApO1xuXG5cdFx0aWYgKCAhICR3cmFwcGVyLmhhc0NsYXNzKCAnaGFzLW9wdGlvbnMnICkgKSB7XG5cdFx0XHQkd3JhcHBlci5hZGRDbGFzcyggJ2hhcy1vcHRpb25zJyApO1xuXHRcdH1cblx0fSApO1xuXG5cdCRzZWFyY2hGb3JtLm9uKCAnaW5wdXQnLCAnLm51bWJlci1tYW51YWwtb3B0aW9ucy10YWJsZSBpbnB1dFt0eXBlPVwidGV4dFwiXScsIGZ1bmN0aW9uKCkge1xuXHRcdGNvbnN0ICRmaWVsZCA9ICQoIHRoaXMgKS5jbG9zZXN0KCAnLndjYXBmLWZvcm0tZmllbGQnICk7XG5cblx0XHR0cmlnZ2VyTnVtYmVyTWFudWFsT3B0aW9uc0NoYW5nZSggJGZpZWxkICk7XG5cdH0gKTtcblxuXHQkc2VhcmNoRm9ybS5vbiggJ2FmdGVyX3RvZ2dsZV9yZXF1ZXN0JywgZnVuY3Rpb24oIGUsIGhhbmRsZXIsIHZhbHVlLCAkZmllbGQgKSB7XG5cdFx0aWYgKCAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLW51bWJlcl9kaXNwbGF5X3R5cGUgc2VsZWN0JyA9PT0gaGFuZGxlciApIHtcblx0XHRcdGNvbnN0ICRnZXRPcHRpb25zICAgICAgICAgPSAkZmllbGQuZmluZCggJy5udW1iZXItZ2V0LW9wdGlvbnMnICk7XG5cdFx0XHRjb25zdCAkYXV0b09wdGlvbnMgICAgICAgID0gJGZpZWxkLmZpbmQoICcubnVtYmVyLWF1dG9tYXRpYy1vcHRpb25zJyApO1xuXHRcdFx0Y29uc3QgJG1hbnVhbE9wdGlvbnNUYWJsZSA9ICRmaWVsZC5maW5kKCAnLm51bWJlci1tYW51YWwtb3B0aW9ucy10YWJsZScgKTtcblx0XHRcdGNvbnN0ICRlbG0gICAgICAgICAgICAgICAgPSAkZmllbGQuZmluZCggaGFuZGxlciApO1xuXHRcdFx0Y29uc3QgZGlzcGxheVR5cGUgICAgICAgICA9ICRlbG0udmFsKCk7XG5cblx0XHRcdGlmICggJ3JhbmdlX3NsaWRlcicgPT09IGRpc3BsYXlUeXBlIHx8ICdyYW5nZV9udW1iZXInID09PSBkaXNwbGF5VHlwZSApIHtcblx0XHRcdFx0JGdldE9wdGlvbnMuaGlkZSgpO1xuXHRcdFx0XHQkbWFudWFsT3B0aW9uc1RhYmxlLmFkZENsYXNzKCAnZm9yY2UtaGlkZScgKTtcblx0XHRcdFx0JGF1dG9PcHRpb25zLmFkZENsYXNzKCAnZm9yY2Utc2hvdycgKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdCRnZXRPcHRpb25zLnNob3coKTtcblx0XHRcdFx0JG1hbnVhbE9wdGlvbnNUYWJsZS5yZW1vdmVDbGFzcyggJ2ZvcmNlLWhpZGUnICk7XG5cdFx0XHRcdCRhdXRvT3B0aW9ucy5yZW1vdmVDbGFzcyggJ2ZvcmNlLXNob3cnICk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9ICk7XG5cblx0ZnVuY3Rpb24gdG9nZ2xlTnVtYmVyTWluVmFsdWVGaWVsZCggJGVsbSApIHtcblx0XHRjb25zdCAkZmllbGQgICAgID0gJGVsbS5jbG9zZXN0KCAnLndjYXBmLWZvcm0tZmllbGQnICk7XG5cdFx0Y29uc3QgJHRleHRGaWVsZCA9ICRmaWVsZC5maW5kKCAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLW1pbl92YWx1ZSBpbnB1dFt0eXBlPVwidGV4dFwiXScgKTtcblxuXHRcdGlmICggJGVsbS5pcyggJzpjaGVja2VkJyApICkge1xuXHRcdFx0JHRleHRGaWVsZC5hdHRyKCAnZGlzYWJsZWQnLCAnZGlzYWJsZWQnICk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdCR0ZXh0RmllbGQucmVtb3ZlQXR0ciggJ2Rpc2FibGVkJyApO1xuXHRcdH1cblx0fVxuXG5cdCRzZWFyY2hGb3JtLmZpbmQoICcud2NhcGYtZm9ybS1zdWItZmllbGQtbWluX3ZhbHVlX2F1dG9fZGV0ZWN0IGlucHV0W3R5cGU9XCJjaGVja2JveFwiXScgKS5lYWNoKCBmdW5jdGlvbigpIHtcblx0XHRjb25zdCAkdGhpcyA9ICQoIHRoaXMgKTtcblxuXHRcdHRvZ2dsZU51bWJlck1pblZhbHVlRmllbGQoICR0aGlzICk7XG5cdH0gKTtcblxuXHQkc2VhcmNoRm9ybS5vbiggJ2NsaWNrJywgJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1taW5fdmFsdWVfYXV0b19kZXRlY3QgaW5wdXRbdHlwZT1cImNoZWNrYm94XCJdJywgZnVuY3Rpb24oKSB7XG5cdFx0Y29uc3QgJHRoaXMgPSAkKCB0aGlzICk7XG5cblx0XHR0b2dnbGVOdW1iZXJNaW5WYWx1ZUZpZWxkKCAkdGhpcyApO1xuXHR9ICk7XG5cblx0ZnVuY3Rpb24gdG9nZ2xlTnVtYmVyTWF4VmFsdWVGaWVsZCggJGVsbSApIHtcblx0XHRjb25zdCAkZmllbGQgICAgID0gJGVsbS5jbG9zZXN0KCAnLndjYXBmLWZvcm0tZmllbGQnICk7XG5cdFx0Y29uc3QgJHRleHRGaWVsZCA9ICRmaWVsZC5maW5kKCAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLW1heF92YWx1ZSBpbnB1dFt0eXBlPVwidGV4dFwiXScgKTtcblxuXHRcdGlmICggJGVsbS5pcyggJzpjaGVja2VkJyApICkge1xuXHRcdFx0JHRleHRGaWVsZC5hdHRyKCAnZGlzYWJsZWQnLCAnZGlzYWJsZWQnICk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdCR0ZXh0RmllbGQucmVtb3ZlQXR0ciggJ2Rpc2FibGVkJyApO1xuXHRcdH1cblx0fVxuXG5cdCRzZWFyY2hGb3JtLmZpbmQoICcud2NhcGYtZm9ybS1zdWItZmllbGQtbWF4X3ZhbHVlX2F1dG9fZGV0ZWN0IGlucHV0W3R5cGU9XCJjaGVja2JveFwiXScgKS5lYWNoKCBmdW5jdGlvbigpIHtcblx0XHRjb25zdCAkdGhpcyA9ICQoIHRoaXMgKTtcblxuXHRcdHRvZ2dsZU51bWJlck1heFZhbHVlRmllbGQoICR0aGlzICk7XG5cdH0gKTtcblxuXHQkc2VhcmNoRm9ybS5vbiggJ2NsaWNrJywgJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1tYXhfdmFsdWVfYXV0b19kZXRlY3QgaW5wdXRbdHlwZT1cImNoZWNrYm94XCJdJywgZnVuY3Rpb24oKSB7XG5cdFx0Y29uc3QgJHRoaXMgPSAkKCB0aGlzICk7XG5cblx0XHR0b2dnbGVOdW1iZXJNYXhWYWx1ZUZpZWxkKCAkdGhpcyApO1xuXHR9ICk7XG5cblx0Ly8gVG9nZ2xlIHNvZnQgbGltaXQgZmllbGRzIHdoZW4gZGlzcGxheSB0eXBlIGlzIGNoYW5nZWQuXG5cdCRzZWFyY2hGb3JtLm9uKCAnYWZ0ZXJfdG9nZ2xlX3JlcXVlc3QnLCBmdW5jdGlvbiggZSwgaGFuZGxlciwgdmFsdWUsICRmaWVsZCApIHtcblx0XHRpZiAoICcud2NhcGYtZm9ybS1zdWItZmllbGQtZGlzcGxheV90eXBlIHNlbGVjdCcgPT09IGhhbmRsZXIgKSB7XG5cdFx0XHRjb25zdCAkc29mdExpbWl0RmllbGRzID0gJGZpZWxkLmZpbmQoICcuc29mdC1saW1pdC1maWVsZHMnICk7XG5cdFx0XHRjb25zdCAkdmFsdWVUeXBlRmllbGQgID0gJGZpZWxkLmZpbmQoICcud2NhcGYtZm9ybS1zdWItZmllbGQtdmFsdWVfdHlwZSBzZWxlY3QnICk7XG5cdFx0XHRjb25zdCB2YWx1ZVR5cGUgICAgICAgID0gJHZhbHVlVHlwZUZpZWxkLnZhbCgpO1xuXHRcdFx0Y29uc3QgZGlzcGxheVR5cGVzICAgICA9IFsgJ2NoZWNrYm94JywgJ3JhZGlvJyBdO1xuXG5cdFx0XHRpZiAoICR2YWx1ZVR5cGVGaWVsZC5sZW5ndGggKSB7XG5cdFx0XHRcdGlmICggJ3RleHQnID09PSB2YWx1ZVR5cGUgKSB7XG5cdFx0XHRcdFx0aWYgKCBkaXNwbGF5VHlwZXMuaW5jbHVkZXMoIHZhbHVlICkgKSB7XG5cdFx0XHRcdFx0XHQkc29mdExpbWl0RmllbGRzLnNob3coKTtcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0JHNvZnRMaW1pdEZpZWxkcy5oaWRlKCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRpZiAoIGRpc3BsYXlUeXBlcy5pbmNsdWRlcyggdmFsdWUgKSApIHtcblx0XHRcdFx0XHQkc29mdExpbWl0RmllbGRzLnNob3coKTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHQkc29mdExpbWl0RmllbGRzLmhpZGUoKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0fSApO1xuXG5cdC8vIFRvZ2dsZSBzb2Z0IGxpbWl0IGZpZWxkcyB3aGVuIG51bWJlciBkaXNwbGF5IHR5cGUgaXMgY2hhbmdlZC5cblx0JHNlYXJjaEZvcm0ub24oICdhZnRlcl90b2dnbGVfcmVxdWVzdCcsIGZ1bmN0aW9uKCBlLCBoYW5kbGVyLCB2YWx1ZSwgJGZpZWxkICkge1xuXHRcdGlmICggJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1udW1iZXJfZGlzcGxheV90eXBlIHNlbGVjdCcgPT09IGhhbmRsZXIgKSB7XG5cdFx0XHRjb25zdCAkc29mdExpbWl0RmllbGRzID0gJGZpZWxkLmZpbmQoICcuc29mdC1saW1pdC1maWVsZHMnICk7XG5cdFx0XHRjb25zdCAkdmFsdWVUeXBlRmllbGQgID0gJGZpZWxkLmZpbmQoICcud2NhcGYtZm9ybS1zdWItZmllbGQtdmFsdWVfdHlwZSBzZWxlY3QnICk7XG5cdFx0XHRjb25zdCB2YWx1ZVR5cGUgICAgICAgID0gJHZhbHVlVHlwZUZpZWxkLnZhbCgpO1xuXHRcdFx0Y29uc3QgZGlzcGxheVR5cGVzICAgICA9IFsgJ3JhbmdlX2NoZWNrYm94JywgJ3JhbmdlX3JhZGlvJyBdO1xuXG5cdFx0XHRpZiAoICR2YWx1ZVR5cGVGaWVsZC5sZW5ndGggKSB7XG5cdFx0XHRcdGlmICggJ251bWJlcicgPT09IHZhbHVlVHlwZSApIHtcblx0XHRcdFx0XHRpZiAoIGRpc3BsYXlUeXBlcy5pbmNsdWRlcyggdmFsdWUgKSApIHtcblx0XHRcdFx0XHRcdCRzb2Z0TGltaXRGaWVsZHMuc2hvdygpO1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHQkc29mdExpbWl0RmllbGRzLmhpZGUoKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGlmICggZGlzcGxheVR5cGVzLmluY2x1ZGVzKCB2YWx1ZSApICkge1xuXHRcdFx0XHRcdCRzb2Z0TGltaXRGaWVsZHMuc2hvdygpO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdCRzb2Z0TGltaXRGaWVsZHMuaGlkZSgpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXHR9ICk7XG5cblx0Ly8gVG9nZ2xlIHNvZnQgbGltaXQgZmllbGRzIHdoZW4gdmFsdWUgdHlwZSBpcyBjaGFuZ2VkLlxuXHQkc2VhcmNoRm9ybS5vbiggJ2FmdGVyX3RvZ2dsZV9yZXF1ZXN0JywgZnVuY3Rpb24oIGUsIGhhbmRsZXIsIHZhbHVlLCAkZmllbGQgKSB7XG5cdFx0aWYgKCAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLXZhbHVlX3R5cGUgc2VsZWN0JyA9PT0gaGFuZGxlciApIHtcblx0XHRcdGNvbnN0ICRzb2Z0TGltaXRGaWVsZHMgPSAkZmllbGQuZmluZCggJy5zb2Z0LWxpbWl0LWZpZWxkcycgKTtcblxuXHRcdFx0Y29uc3QgJG51bWJlckRpc3BsYXlUeXBlRmllbGQgPSAkZmllbGQuZmluZCggJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1udW1iZXJfZGlzcGxheV90eXBlIHNlbGVjdCcgKTtcblx0XHRcdGNvbnN0IG51bWJlckRpc3BsYXlUeXBlICAgICAgID0gJG51bWJlckRpc3BsYXlUeXBlRmllbGQudmFsKCk7XG5cdFx0XHRjb25zdCBudW1iZXJEaXNwbGF5VHlwZXMgICAgICA9IFsgJ3JhbmdlX2NoZWNrYm94JywgJ3JhbmdlX3JhZGlvJyBdO1xuXG5cdFx0XHRjb25zdCAkdGV4dERpc3BsYXlUeXBlRmllbGQgPSAkZmllbGQuZmluZCggJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1kaXNwbGF5X3R5cGUgc2VsZWN0JyApO1xuXHRcdFx0Y29uc3QgdGV4dERpc3BsYXlUeXBlICAgICAgID0gJHRleHREaXNwbGF5VHlwZUZpZWxkLnZhbCgpO1xuXHRcdFx0Y29uc3QgdGV4dERpc3BsYXlUeXBlcyAgICAgID0gWyAnY2hlY2tib3gnLCAncmFkaW8nIF07XG5cblx0XHRcdGlmICggJ251bWJlcicgPT09IHZhbHVlICkge1xuXHRcdFx0XHRpZiAoIG51bWJlckRpc3BsYXlUeXBlcy5pbmNsdWRlcyggbnVtYmVyRGlzcGxheVR5cGUgKSApIHtcblx0XHRcdFx0XHQkc29mdExpbWl0RmllbGRzLnNob3coKTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHQkc29mdExpbWl0RmllbGRzLmhpZGUoKTtcblx0XHRcdFx0fVxuXHRcdFx0fSBlbHNlIGlmICggJ3RleHQnID09PSB2YWx1ZSApIHtcblx0XHRcdFx0aWYgKCB0ZXh0RGlzcGxheVR5cGVzLmluY2x1ZGVzKCB0ZXh0RGlzcGxheVR5cGUgKSApIHtcblx0XHRcdFx0XHQkc29mdExpbWl0RmllbGRzLnNob3coKTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHQkc29mdExpbWl0RmllbGRzLmhpZGUoKTtcblx0XHRcdFx0fVxuXHRcdFx0fSBlbHNlIGlmICggJ2RhdGUnID09PSB2YWx1ZSApIHtcblx0XHRcdFx0JHNvZnRMaW1pdEZpZWxkcy5oaWRlKCk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHQkc29mdExpbWl0RmllbGRzLmhpZGUoKTtcblx0XHRcdH1cblx0XHR9XG5cdH0gKTtcblxuXHQvLyBTZXQgdGhlIHZhbHVlIHR5cGUgd2hlbiBwb3N0IHByb3BlcnR5IGNoYW5nZWQuXG5cdCRzZWFyY2hGb3JtLm9uKCAnYWZ0ZXJfdG9nZ2xlX3JlcXVlc3QnLCBmdW5jdGlvbiggZSwgaGFuZGxlciwgdmFsdWUsICRmaWVsZCApIHtcblx0XHRpZiAoICcud2NhcGYtZm9ybS1zdWItZmllbGQtcG9zdF9wcm9wZXJ0eSBzZWxlY3QnID09PSBoYW5kbGVyICkge1xuXHRcdFx0Y29uc3QgJHZhbHVlVHlwZSAgICAgICA9ICRmaWVsZC5maW5kKCAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLXZhbHVlX3R5cGUgc2VsZWN0JyApO1xuXHRcdFx0Y29uc3QgcGFyYW1zICAgICAgICAgICA9IHdpbmRvd1sgJ3djYXBmX2FkbWluX3BhcmFtcycgXTtcblx0XHRcdGNvbnN0IHBvc3RQcm9wZXJ0eURhdGEgPSBwYXJhbXNbICdwb3N0X3Byb3BlcnR5X2RhdGEnIF07XG5cblx0XHRcdGlmICggISBwb3N0UHJvcGVydHlEYXRhICkge1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdGxldCB2YWx1ZVR5cGUgPSBwb3N0UHJvcGVydHlEYXRhWyB2YWx1ZSBdO1xuXG5cdFx0XHRpZiAoICEgdmFsdWVUeXBlICkge1xuXHRcdFx0XHR2YWx1ZVR5cGUgPSAnJztcblx0XHRcdH1cblxuXHRcdFx0JHZhbHVlVHlwZS52YWwoIHZhbHVlVHlwZSApLmNoYW5nZSgpO1xuXHRcdH1cblx0fSApO1xuXG59ICk7XG4iLCIvKipcbiAqIFRoZSBwcm9kdWN0IHN0YXR1cyBmaWVsZC5cbiAqXG4gKiBAc2luY2UgICAgICAzLjAuMFxuICogQHBhY2thZ2UgICAgd2MtYWpheC1wcm9kdWN0LWZpbHRlclxuICogQHN1YnBhY2thZ2Ugd2MtYWpheC1wcm9kdWN0LWZpbHRlci9hZG1pbi9zcmMvanNcbiAqIEBhdXRob3IgICAgIE1haW51bCBIYXNzYW4gTWFpblxuICovXG5cbmpRdWVyeSggZG9jdW1lbnQgKS5yZWFkeSggZnVuY3Rpb24oICQgKSB7XG5cblx0Y29uc3QgJHNlYXJjaEZvcm0gPSAkKCAnI3NlYXJjaC1mb3JtJyApO1xuXG5cdGZ1bmN0aW9uIHRyaWdnZXJQcm9kdWN0U3RhdHVzT3B0aW9uc0NoYW5nZSggJGZpZWxkICkge1xuXHRcdGNvbnN0ICR2YWx1ZUhvbGRlciAgPSAkZmllbGQuZmluZCggJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1wcm9kdWN0X3N0YXR1c19vcHRpb25zIGlucHV0JyApO1xuXHRcdGNvbnN0ICRvcHRpb25zVGFibGUgPSAkZmllbGQuZmluZCggJy5wcm9kdWN0LXN0YXR1cy1vcHRpb25zLXRhYmxlJyApO1xuXHRcdGNvbnN0ICRyb3dzICAgICAgICAgPSAkb3B0aW9uc1RhYmxlLmZpbmQoICcubWFudWFsLW9wdGlvbnMtdGFibGUtYm9keS1yb3dzJyApO1xuXHRcdGNvbnN0IF9yb3dzICAgICAgICAgPSBbXTtcblxuXHRcdCRyb3dzLmZpbmQoICcuaXRlbScgKS5lYWNoKCBmdW5jdGlvbiggaSwgX2l0ZW0gKSB7XG5cdFx0XHRjb25zdCAkaXRlbSA9ICQoIF9pdGVtICk7XG5cdFx0XHRjb25zdCB2YWx1ZSA9ICRpdGVtLmZpbmQoICcub3B0aW9uX3ZhbHVlJyApLnZhbCgpO1xuXHRcdFx0Y29uc3QgbGFiZWwgPSAkaXRlbS5maW5kKCAnLm9wdGlvbl9sYWJlbCcgKS52YWwoKTtcblxuXHRcdFx0aWYgKCB2YWx1ZSApIHtcblx0XHRcdFx0X3Jvd3MucHVzaCggWyB2YWx1ZSwgbGFiZWwgXSApO1xuXHRcdFx0fVxuXHRcdH0gKTtcblxuXHRcdGNvbnN0IHJhd1ZhbHVlcyA9IGVuY29kZVVSSUNvbXBvbmVudCggSlNPTi5zdHJpbmdpZnkoIF9yb3dzICkgKTtcblx0XHQkdmFsdWVIb2xkZXIudmFsKCByYXdWYWx1ZXMgKTtcblx0fVxuXG5cdGZ1bmN0aW9uIGluaXRTb3J0YWJsZUZvclByb2R1Y3RTdGF0dXNPcHRpb25zKCAkc2VsZWN0b3IgKSB7XG5cdFx0JHNlbGVjdG9yLnNvcnRhYmxlKCB7XG5cdFx0XHRvcGFjaXR5OiAwLjgsXG5cdFx0XHRyZXZlcnQ6IGZhbHNlLFxuXHRcdFx0Y3Vyc29yOiAnbW92ZScsXG5cdFx0XHRheGlzOiAneScsXG5cdFx0XHRoYW5kbGU6ICcubW92ZS1vcHRpb25zLWhhbmRsZXInLFxuXHRcdFx0cGxhY2Vob2xkZXI6ICd3aWRnZXQtcGxhY2Vob2xkZXInLFxuXHRcdFx0dXBkYXRlOiBmdW5jdGlvbiggZSApIHtcblx0XHRcdFx0Y29uc3QgJGZpZWxkID0gJCggZS50YXJnZXQgKS5jbG9zZXN0KCAnLndjYXBmLWZvcm0tZmllbGQnICk7XG5cblx0XHRcdFx0dHJpZ2dlclByb2R1Y3RTdGF0dXNPcHRpb25zQ2hhbmdlKCAkZmllbGQgKTtcblx0XHRcdH1cblx0XHR9ICkuZGlzYWJsZVNlbGVjdGlvbigpO1xuXHR9XG5cblx0Ly8gU29ydCBNYW51YWwgT3B0aW9uc1xuXHRpbml0U29ydGFibGVGb3JQcm9kdWN0U3RhdHVzT3B0aW9ucyggJHNlYXJjaEZvcm0uZmluZCggJy5wcm9kdWN0LXN0YXR1cy1vcHRpb25zLXRhYmxlIC5tYW51YWwtb3B0aW9ucy10YWJsZS1ib2R5LXJvd3MnICkgKTtcblxuXHQkc2VhcmNoRm9ybS5vbiggJ2ZpZWxkX2FkZGVkJywgZnVuY3Rpb24oIGUsIHVpICkge1xuXHRcdC8vIEluaXQgU29ydGFibGUgZm9yIHRoZSBtYW51YWwgb3B0aW9ucy5cblx0XHRpbml0U29ydGFibGVGb3JQcm9kdWN0U3RhdHVzT3B0aW9ucyggJCggdWkuaXRlbS5maW5kKCAnLm1hbnVhbC1vcHRpb25zLXRhYmxlLWJvZHktcm93cycgKSApICk7XG5cdH0gKTtcblxuXHRmdW5jdGlvbiB0cmlnZ2VyUmVtb3ZlUHJvZHVjdFN0YXR1c09wdGlvbiggJGZpZWxkICkge1xuXHRcdGNvbnN0ICRvcHRpb25zVGFibGUgPSAkZmllbGQuZmluZCggJy5wcm9kdWN0LXN0YXR1cy1vcHRpb25zLXRhYmxlJyApO1xuXHRcdGNvbnN0IHRhYmxlUm93cyAgICAgPSAkb3B0aW9uc1RhYmxlLmZpbmQoICcubWFudWFsLW9wdGlvbnMtdGFibGUtYm9keS1yb3dzJyApLmNoaWxkcmVuKCk7XG5cblx0XHRpZiAoIDIgPiB0YWJsZVJvd3MubGVuZ3RoICkge1xuXHRcdFx0JG9wdGlvbnNUYWJsZS5yZW1vdmVDbGFzcyggJ2hhcy1vcHRpb25zJyApO1xuXHRcdH1cblx0fVxuXG5cdC8vIFJlbW92ZSBTaW5nbGUgTnVtYmVyIE9wdGlvblxuXHQkc2VhcmNoRm9ybS5vbiggJ2NsaWNrJywgJy5yZW1vdmUtcHJvZHVjdC1zdGF0dXMtb3B0aW9uJywgZnVuY3Rpb24oKSB7XG5cdFx0Y29uc3QgJGl0ZW0gID0gJCggdGhpcyApLmNsb3Nlc3QoICcuaXRlbScgKTtcblx0XHRjb25zdCAkZmllbGQgPSAkaXRlbS5jbG9zZXN0KCAnLndjYXBmLWZvcm0tZmllbGQnICk7XG5cblx0XHR0cmlnZ2VyUmVtb3ZlUHJvZHVjdFN0YXR1c09wdGlvbiggJGZpZWxkICk7XG5cblx0XHQkaXRlbS5yZW1vdmUoKTtcblxuXHRcdHRyaWdnZXJQcm9kdWN0U3RhdHVzT3B0aW9uc0NoYW5nZSggJGZpZWxkICk7XG5cdH0gKTtcblxuXHQvLyBDbGVhciBBbGwgT3B0aW9uc1xuXHQkc2VhcmNoRm9ybS5vbiggJ2NsaWNrJywgJy5jbGVhci1hbGwtcHJvZHVjdC1zdGF0dXMtb3B0aW9ucycsIGZ1bmN0aW9uKCkge1xuXHRcdGNvbnN0ICRmaWVsZCAgICAgICAgPSAkKCB0aGlzICkuY2xvc2VzdCggJy53Y2FwZi1mb3JtLWZpZWxkJyApO1xuXHRcdGNvbnN0ICRvcHRpb25zVGFibGUgPSAkZmllbGQuZmluZCggJy5wcm9kdWN0LXN0YXR1cy1vcHRpb25zLXRhYmxlJyApO1xuXG5cdFx0JG9wdGlvbnNUYWJsZS5maW5kKCAnLm1hbnVhbC1vcHRpb25zLXRhYmxlLWJvZHktcm93cycgKS5lbXB0eSgpO1xuXG5cdFx0dHJpZ2dlclJlbW92ZVByb2R1Y3RTdGF0dXNPcHRpb24oICRmaWVsZCApO1xuXG5cdFx0dHJpZ2dlclByb2R1Y3RTdGF0dXNPcHRpb25zQ2hhbmdlKCAkZmllbGQgKTtcblx0fSApO1xuXG5cdC8vIEFkZCBOZXcgT3B0aW9uXG5cdCRzZWFyY2hGb3JtLm9uKCAnY2xpY2snLCAnLmFkZC1wcm9kdWN0LXN0YXR1cy1vcHRpb24nLCBmdW5jdGlvbigpIHtcblx0XHRjb25zdCBmaWVsZFR5cGUgPSAnd2NhcGYtcHJvZHVjdC1zdGF0dXMtb3B0aW9uJztcblxuXHRcdC8vIEJhaWwgb3V0IGlmIG5vIHRtcGwgZm91bmQgZm9yIHRoZSB0eXBlLlxuXHRcdGlmICggISBqUXVlcnkoICcjdG1wbC0nICsgZmllbGRUeXBlICkubGVuZ3RoICkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdGNvbnN0ICRmaWVsZCA9ICQoIHRoaXMgKS5jbG9zZXN0KCAnLndjYXBmLWZvcm0tZmllbGQnICk7XG5cblx0XHRjb25zdCB0ZW1wbGF0ZSA9IHdwLnRlbXBsYXRlKCBmaWVsZFR5cGUgKTtcblx0XHRjb25zdCByZW5kZXJlZCA9IHRlbXBsYXRlKCB7IHZhbHVlOiAnJywgbGFiZWw6ICcnIH0gKTtcblx0XHRjb25zdCAkd3JhcHBlciA9ICRmaWVsZC5maW5kKCAnLnByb2R1Y3Qtc3RhdHVzLW9wdGlvbnMtdGFibGUnICk7XG5cdFx0Y29uc3QgJHJvd3MgICAgPSAkd3JhcHBlci5maW5kKCAnLm1hbnVhbC1vcHRpb25zLXRhYmxlLWJvZHktcm93cycgKTtcblxuXHRcdCRyb3dzLmFwcGVuZCggcmVuZGVyZWQgKTtcblxuXHRcdHRyaWdnZXJQcm9kdWN0U3RhdHVzT3B0aW9uc0NoYW5nZSggJGZpZWxkICk7XG5cblx0XHRpZiAoICEgJHdyYXBwZXIuaGFzQ2xhc3MoICdoYXMtb3B0aW9ucycgKSApIHtcblx0XHRcdCR3cmFwcGVyLmFkZENsYXNzKCAnaGFzLW9wdGlvbnMnICk7XG5cdFx0fVxuXHR9ICk7XG5cblx0JHNlYXJjaEZvcm0ub24oICdpbnB1dCcsICcucHJvZHVjdC1zdGF0dXMtb3B0aW9ucy10YWJsZSBpbnB1dFt0eXBlPVwidGV4dFwiXScsIGZ1bmN0aW9uKCkge1xuXHRcdGNvbnN0ICRmaWVsZCA9ICQoIHRoaXMgKS5jbG9zZXN0KCAnLndjYXBmLWZvcm0tZmllbGQnICk7XG5cblx0XHR0cmlnZ2VyUHJvZHVjdFN0YXR1c09wdGlvbnNDaGFuZ2UoICRmaWVsZCApO1xuXHR9ICk7XG5cblx0JHNlYXJjaEZvcm0ub24oICdjaGFuZ2UnLCAnLnByb2R1Y3Qtc3RhdHVzLW9wdGlvbnMtdGFibGUgLm9wdGlvbl92YWx1ZScsIGZ1bmN0aW9uKCkge1xuXHRcdGNvbnN0ICRmaWVsZCA9ICQoIHRoaXMgKS5jbG9zZXN0KCAnLndjYXBmLWZvcm0tZmllbGQnICk7XG5cblx0XHR0cmlnZ2VyUHJvZHVjdFN0YXR1c09wdGlvbnNDaGFuZ2UoICRmaWVsZCApO1xuXHR9ICk7XG5cbn0gKTtcbiIsIi8qKlxuICogVGhlIHNlYXJjaCBmb3JtIGZpZWxkLlxuICpcbiAqIEBzaW5jZSAgICAgIDMuMC4wXG4gKiBAcGFja2FnZSAgICB3Yy1hamF4LXByb2R1Y3QtZmlsdGVyXG4gKiBAc3VicGFja2FnZSB3Yy1hamF4LXByb2R1Y3QtZmlsdGVyL2FkbWluL3NyYy9qc1xuICogQGF1dGhvciAgICAgTWFpbnVsIEhhc3NhbiBNYWluXG4gKi9cblxualF1ZXJ5KCBkb2N1bWVudCApLnJlYWR5KCBmdW5jdGlvbiggJCApIHtcblxuXHRjb25zdCAkc2VhcmNoRm9ybSA9ICQoICcjc2VhcmNoLWZvcm0nICk7XG5cblx0Y29uc3QgZGVwZW5kYW50RGF0YSA9IFtcblx0XHR7XG5cdFx0XHQnaGFuZGxlcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtdmFsdWVfdHlwZSBzZWxlY3QnLFxuXHRcdFx0J2hhbmRsZXJUeXBlJzogJ3NlbGVjdCcsXG5cdFx0XHQnZXZlbnQnOiAnY2hhbmdlJyxcblx0XHRcdCdkZXBlbmRhbnQnOiBbXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLmlucHV0LXR5cGUtdGV4dC1maWVsZHMnLFxuXHRcdFx0XHRcdCd2YWx1ZSc6IFsgJ3RleHQnIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLmlucHV0LXR5cGUtbnVtYmVyLWZpZWxkcycsXG5cdFx0XHRcdFx0J3ZhbHVlJzogWyAnbnVtYmVyJyBdLFxuXHRcdFx0XHR9LFxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0J3NlbGVjdG9yJzogJy5pbnB1dC10eXBlLWRhdGUtZmllbGRzJyxcblx0XHRcdFx0XHQndmFsdWUnOiBbICdkYXRlJyBdLFxuXHRcdFx0XHR9LFxuXHRcdFx0XSxcblx0XHR9LFxuXHRcdHtcblx0XHRcdCdoYW5kbGVyJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1kaXNwbGF5X3R5cGUgc2VsZWN0Jyxcblx0XHRcdCdoYW5kbGVyVHlwZSc6ICdzZWxlY3QnLFxuXHRcdFx0J2V2ZW50JzogJ2NoYW5nZScsXG5cdFx0XHQnZGVwZW5kYW50JzogW1xuXHRcdFx0XHR7XG5cdFx0XHRcdFx0J3NlbGVjdG9yJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1xdWVyeV90eXBlJyxcblx0XHRcdFx0XHQndmFsdWUnOiBbICdjaGVja2JveCcsICdtdWx0aS1zZWxlY3QnIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLWFsbF9pdGVtc19sYWJlbCcsXG5cdFx0XHRcdFx0J3ZhbHVlJzogWyAncmFkaW8nLCAnc2VsZWN0JyBdLFxuXHRcdFx0XHR9LFxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0J3NlbGVjdG9yJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC11c2VfY2hvc2VuJyxcblx0XHRcdFx0XHQndmFsdWUnOiBbICdzZWxlY3QnLCAnbXVsdGktc2VsZWN0JyBdLFxuXHRcdFx0XHR9LFxuXHRcdFx0XSxcblx0XHR9LFxuXHRcdHtcblx0XHRcdCdoYW5kbGVyJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC11c2VfY2hvc2VuIGlucHV0Jyxcblx0XHRcdCdoYW5kbGVyVHlwZSc6ICdjaGVja2JveCcsXG5cdFx0XHQnZXZlbnQnOiAnY2hhbmdlJyxcblx0XHRcdCdkZXBlbmRhbnQnOiBbXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLWNob3Nlbl9ub19yZXN1bHRzX21lc3NhZ2UnLFxuXHRcdFx0XHRcdCd2YWx1ZSc6IFsgJzEnIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRdLFxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0J2hhbmRsZXInOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLWdldF9vcHRpb25zIGlucHV0Jyxcblx0XHRcdCdoYW5kbGVyVHlwZSc6ICdyYWRpbycsXG5cdFx0XHQnZXZlbnQnOiAnY2hhbmdlJyxcblx0XHRcdCdkZXBlbmRhbnQnOiBbXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLmNvbHVtbi1ncm91cC1tZXRhX2tleV9tYW51YWxfb3B0aW9ucycsXG5cdFx0XHRcdFx0J3ZhbHVlJzogWyAnbWFudWFsX2VudHJ5JyBdLFxuXHRcdFx0XHR9LFxuXHRcdFx0XSxcblx0XHR9LFxuXHRcdHtcblx0XHRcdCdoYW5kbGVyJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1udW1iZXJfZGlzcGxheV90eXBlIHNlbGVjdCcsXG5cdFx0XHQnaGFuZGxlclR5cGUnOiAnc2VsZWN0Jyxcblx0XHRcdCdldmVudCc6ICdjaGFuZ2UnLFxuXHRcdFx0J2RlcGVuZGFudCc6IFtcblx0XHRcdFx0e1xuXHRcdFx0XHRcdCdzZWxlY3Rvcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtbnVtYmVyX3JhbmdlX3NsaWRlcl9kaXNwbGF5X3ZhbHVlc19hcycsXG5cdFx0XHRcdFx0J3ZhbHVlJzogWyAncmFuZ2Vfc2xpZGVyJyBdLFxuXHRcdFx0XHR9LFxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0J3NlbGVjdG9yJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1udW1iZXJfcmFuZ2VfcXVlcnlfdHlwZScsXG5cdFx0XHRcdFx0J3ZhbHVlJzogWyAncmFuZ2VfY2hlY2tib3gnLCAncmFuZ2VfbXVsdGlzZWxlY3QnIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLW51bWJlcl9yYW5nZV9zZWxlY3RfYWxsX2l0ZW1zX2xhYmVsJyxcblx0XHRcdFx0XHQndmFsdWUnOiBbICdyYW5nZV9yYWRpbycsICdyYW5nZV9zZWxlY3QnIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLW51bWJlcl9yYW5nZV91c2VfY2hvc2VuJyxcblx0XHRcdFx0XHQndmFsdWUnOiBbICdyYW5nZV9zZWxlY3QnLCAncmFuZ2VfbXVsdGlzZWxlY3QnIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLW51bWJlcl9yYW5nZV9zaG93X2NvdW50Jyxcblx0XHRcdFx0XHQndmFsdWUnOiBbICdyYW5nZV9jaGVja2JveCcsICdyYW5nZV9yYWRpbycsICdyYW5nZV9zZWxlY3QnLCAncmFuZ2VfbXVsdGlzZWxlY3QnIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLW51bWJlcl9yYW5nZV9oaWRlX2VtcHR5Jyxcblx0XHRcdFx0XHQndmFsdWUnOiBbICdyYW5nZV9jaGVja2JveCcsICdyYW5nZV9yYWRpbycsICdyYW5nZV9zZWxlY3QnLCAncmFuZ2VfbXVsdGlzZWxlY3QnIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLm51bWJlci1kZWNpbWFsLWZpZWxkcycsXG5cdFx0XHRcdFx0J3ZhbHVlJzogWyAncmFuZ2Vfc2xpZGVyJywgJ3JhbmdlX2NoZWNrYm94JywgJ3JhbmdlX3JhZGlvJywgJ3JhbmdlX3NlbGVjdCcsICdyYW5nZV9tdWx0aXNlbGVjdCcgXSxcblx0XHRcdFx0fSxcblx0XHRcdF0sXG5cdFx0fSxcblx0XHR7XG5cdFx0XHQnaGFuZGxlcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtbnVtYmVyX3JhbmdlX3VzZV9jaG9zZW4gaW5wdXQnLFxuXHRcdFx0J2hhbmRsZXJUeXBlJzogJ2NoZWNrYm94Jyxcblx0XHRcdCdldmVudCc6ICdjaGFuZ2UnLFxuXHRcdFx0J2RlcGVuZGFudCc6IFtcblx0XHRcdFx0e1xuXHRcdFx0XHRcdCdzZWxlY3Rvcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtbnVtYmVyX3JhbmdlX2Nob3Nlbl9ub19yZXN1bHRzX21lc3NhZ2UnLFxuXHRcdFx0XHRcdCd2YWx1ZSc6IFsgJzEnIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRdLFxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0J2hhbmRsZXInOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLW51bWJlcl9nZXRfb3B0aW9ucyBpbnB1dCcsXG5cdFx0XHQnaGFuZGxlclR5cGUnOiAncmFkaW8nLFxuXHRcdFx0J2V2ZW50JzogJ2NoYW5nZScsXG5cdFx0XHQnZGVwZW5kYW50JzogW1xuXHRcdFx0XHR7XG5cdFx0XHRcdFx0J3NlbGVjdG9yJzogJy5udW1iZXItYXV0b21hdGljLW9wdGlvbnMnLFxuXHRcdFx0XHRcdCd2YWx1ZSc6IFsgJ2F1dG9tYXRpY2FsbHknIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLm51bWJlci1tYW51YWwtb3B0aW9ucy10YWJsZScsXG5cdFx0XHRcdFx0J3ZhbHVlJzogWyAnbWFudWFsX2VudHJ5JyBdLFxuXHRcdFx0XHR9LFxuXHRcdFx0XSxcblx0XHR9LFxuXHRcdHtcblx0XHRcdCdoYW5kbGVyJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1kYXRlX2lucHV0X3R5cGUgc2VsZWN0Jyxcblx0XHRcdCdoYW5kbGVyVHlwZSc6ICdzZWxlY3QnLFxuXHRcdFx0J2V2ZW50JzogJ2NoYW5nZScsXG5cdFx0XHQnZGVwZW5kYW50JzogW1xuXHRcdFx0XHR7XG5cdFx0XHRcdFx0J3NlbGVjdG9yJzogJy5kYXRlLXRvLXVpLW9wdGlvbnMnLFxuXHRcdFx0XHRcdCd2YWx1ZSc6IFsgJ3JhbmdlX2RhdGUnIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRdLFxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0J2hhbmRsZXInOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLWxpbWl0X3Rlcm1zIHNlbGVjdCcsXG5cdFx0XHQnaGFuZGxlclR5cGUnOiAnc2VsZWN0Jyxcblx0XHRcdCdldmVudCc6ICdjaGFuZ2UnLFxuXHRcdFx0J2RlcGVuZGFudCc6IFtcblx0XHRcdFx0e1xuXHRcdFx0XHRcdCdzZWxlY3Rvcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtcGFyZW50X3Rlcm0nLFxuXHRcdFx0XHRcdCd2YWx1ZSc6IFsgJ2NoaWxkJyBdLFxuXHRcdFx0XHR9LFxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0J3NlbGVjdG9yJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1saW1pdF90ZXJtc19ieV9pZCcsXG5cdFx0XHRcdFx0J3ZhbHVlJzogWyAnaW5jbHVkZScsICdleGNsdWRlJyBdLFxuXHRcdFx0XHR9LFxuXHRcdFx0XSxcblx0XHR9LFxuXHRcdHtcblx0XHRcdCdoYW5kbGVyJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1lbmFibGVfc29mdF9saW1pdCBpbnB1dCcsXG5cdFx0XHQnaGFuZGxlclR5cGUnOiAncmFkaW8nLFxuXHRcdFx0J2V2ZW50JzogJ2NoYW5nZScsXG5cdFx0XHQnZGVwZW5kYW50JzogW1xuXHRcdFx0XHR7XG5cdFx0XHRcdFx0J3NlbGVjdG9yJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1zb2Z0X2xpbWl0Jyxcblx0XHRcdFx0XHQndmFsdWUnOiBbICdlbmFibGUnIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRdLFxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0J2hhbmRsZXInOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLWN1c3RvbS10YXhvbm9teSBzZWxlY3QnLFxuXHRcdFx0J2hhbmRsZXJUeXBlJzogJ3NlbGVjdCcsXG5cdFx0XHQnZXZlbnQnOiAnY2hhbmdlJyxcblx0XHR9LFxuXHRcdHtcblx0XHRcdCdoYW5kbGVyJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1wb3N0X3Byb3BlcnR5IHNlbGVjdCcsXG5cdFx0XHQnaGFuZGxlclR5cGUnOiAnc2VsZWN0Jyxcblx0XHRcdCdldmVudCc6ICdjaGFuZ2UnLFxuXHRcdH0sXG5cdF07XG5cblx0ZnVuY3Rpb24gX3RyaWdnZXJJbnB1dFR5cGVUZXh0RGlzcGxheVR5cGVDaGFuZ2UoIHZhbHVlLCAkZmllbGQgKSB7XG5cdFx0Y29uc3QgJG5vUmVzdWx0cyAgICAgPSAkZmllbGQuZmluZCggJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1jaG9zZW5fbm9fcmVzdWx0c19tZXNzYWdlJyApO1xuXHRcdGNvbnN0ICRhbGxJdGVtc0xhYmVsID0gJGZpZWxkLmZpbmQoICcud2NhcGYtZm9ybS1zdWItZmllbGQtYWxsX2l0ZW1zX2xhYmVsJyApO1xuXHRcdGNvbnN0IHVzZUNob3NlbiAgICAgID0gJGZpZWxkLmZpbmQoICcud2NhcGYtZm9ybS1zdWItZmllbGQtdXNlX2Nob3NlbiBpbnB1dCcgKS5pcyggJzpjaGVja2VkJyApO1xuXG5cdFx0aWYgKCB1c2VDaG9zZW4gJiYgKCAnc2VsZWN0JyA9PT0gdmFsdWUgfHwgJ211bHRpLXNlbGVjdCcgPT09IHZhbHVlICkgKSB7XG5cdFx0XHQkbm9SZXN1bHRzLnNob3coKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0JG5vUmVzdWx0cy5oaWRlKCk7XG5cdFx0fVxuXG5cdFx0aWYgKCAoICdyYWRpbycgPT09IHZhbHVlIHx8ICdzZWxlY3QnID09PSB2YWx1ZSApIHx8ICggJ211bHRpLXNlbGVjdCcgPT09IHZhbHVlICYmIHVzZUNob3NlbiApICkge1xuXHRcdFx0JGFsbEl0ZW1zTGFiZWwuc2hvdygpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHQkYWxsSXRlbXNMYWJlbC5oaWRlKCk7XG5cdFx0fVxuXHR9XG5cblx0ZnVuY3Rpb24gX3RyaWdnZXJJbnB1dFR5cGVOdW1iZXJEaXNwbGF5VHlwZUNoYW5nZSggdmFsdWUsICRmaWVsZCApIHtcblx0XHRjb25zdCAkbm9SZXN1bHRzICAgICA9ICRmaWVsZC5maW5kKCAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLW51bWJlcl9yYW5nZV9jaG9zZW5fbm9fcmVzdWx0c19tZXNzYWdlJyApO1xuXHRcdGNvbnN0ICRhbGxJdGVtc0xhYmVsID0gJGZpZWxkLmZpbmQoICcud2NhcGYtZm9ybS1zdWItZmllbGQtbnVtYmVyX3JhbmdlX3NlbGVjdF9hbGxfaXRlbXNfbGFiZWwnICk7XG5cdFx0Y29uc3QgdXNlQ2hvc2VuICAgICAgPSAkZmllbGQuZmluZCggJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1udW1iZXJfcmFuZ2VfdXNlX2Nob3NlbiBpbnB1dCcgKS5pcyggJzpjaGVja2VkJyApO1xuXG5cdFx0aWYgKCB1c2VDaG9zZW4gJiYgKCAncmFuZ2Vfc2VsZWN0JyA9PT0gdmFsdWUgfHwgJ3JhbmdlX211bHRpc2VsZWN0JyA9PT0gdmFsdWUgKSApIHtcblx0XHRcdCRub1Jlc3VsdHMuc2hvdygpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHQkbm9SZXN1bHRzLmhpZGUoKTtcblx0XHR9XG5cblx0XHRpZiAoICggJ3JhbmdlX3JhZGlvJyA9PT0gdmFsdWUgfHwgJ3JhbmdlX3NlbGVjdCcgPT09IHZhbHVlICkgfHwgKCAncmFuZ2VfbXVsdGlzZWxlY3QnID09PSB2YWx1ZSAmJiB1c2VDaG9zZW4gKSApIHtcblx0XHRcdCRhbGxJdGVtc0xhYmVsLnNob3coKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0JGFsbEl0ZW1zTGFiZWwuaGlkZSgpO1xuXHRcdH1cblx0fVxuXG5cdGZ1bmN0aW9uIF90cmlnZ2VySW5wdXRUeXBlVGV4dFVzZVNlbGVjdENoYW5nZSggdmFsdWUsICRmaWVsZCApIHtcblx0XHRjb25zdCAkbm9SZXN1bHRzICAgICA9ICRmaWVsZC5maW5kKCAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLWNob3Nlbl9ub19yZXN1bHRzX21lc3NhZ2UnICk7XG5cdFx0Y29uc3QgJGFsbEl0ZW1zTGFiZWwgPSAkZmllbGQuZmluZCggJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1hbGxfaXRlbXNfbGFiZWwnICk7XG5cdFx0Y29uc3QgZGlzcGxheVR5cGUgICAgPSAkZmllbGQuZmluZCggJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1kaXNwbGF5X3R5cGUgc2VsZWN0JyApLnZhbCgpO1xuXG5cdFx0aWYgKCAnMScgPT09IHZhbHVlICYmICggJ3NlbGVjdCcgPT09IGRpc3BsYXlUeXBlIHx8ICdtdWx0aS1zZWxlY3QnID09PSBkaXNwbGF5VHlwZSApICkge1xuXHRcdFx0JG5vUmVzdWx0cy5zaG93KCk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdCRub1Jlc3VsdHMuaGlkZSgpO1xuXHRcdH1cblxuXHRcdGlmIChcblx0XHRcdCggJzEnID09PSB2YWx1ZSAmJiAnbXVsdGktc2VsZWN0JyA9PT0gZGlzcGxheVR5cGUgKVxuXHRcdFx0fHwgKCAncmFkaW8nID09PSBkaXNwbGF5VHlwZSB8fCAnc2VsZWN0JyA9PT0gZGlzcGxheVR5cGUgKVxuXHRcdCkge1xuXHRcdFx0JGFsbEl0ZW1zTGFiZWwuc2hvdygpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHQkYWxsSXRlbXNMYWJlbC5oaWRlKCk7XG5cdFx0fVxuXHR9XG5cblx0ZnVuY3Rpb24gX3RyaWdnZXJJbnB1dFR5cGVOdW1iZXJVc2VTZWxlY3RDaGFuZ2UoIHZhbHVlLCAkZmllbGQgKSB7XG5cdFx0Y29uc3QgJG5vUmVzdWx0cyAgICAgPSAkZmllbGQuZmluZCggJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1udW1iZXJfcmFuZ2VfY2hvc2VuX25vX3Jlc3VsdHNfbWVzc2FnZScgKTtcblx0XHRjb25zdCAkYWxsSXRlbXNMYWJlbCA9ICRmaWVsZC5maW5kKCAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLW51bWJlcl9yYW5nZV9zZWxlY3RfYWxsX2l0ZW1zX2xhYmVsJyApO1xuXHRcdGNvbnN0IGRpc3BsYXlUeXBlICAgID0gJGZpZWxkLmZpbmQoICcud2NhcGYtZm9ybS1zdWItZmllbGQtbnVtYmVyX2Rpc3BsYXlfdHlwZSBzZWxlY3QnICkudmFsKCk7XG5cblx0XHRpZiAoICcxJyA9PT0gdmFsdWUgJiYgKCAncmFuZ2Vfc2VsZWN0JyA9PT0gZGlzcGxheVR5cGUgfHwgJ3JhbmdlX211bHRpc2VsZWN0JyA9PT0gZGlzcGxheVR5cGUgKSApIHtcblx0XHRcdCRub1Jlc3VsdHMuc2hvdygpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHQkbm9SZXN1bHRzLmhpZGUoKTtcblx0XHR9XG5cblx0XHRpZiAoXG5cdFx0XHQoICcxJyA9PT0gdmFsdWUgJiYgJ3JhbmdlX211bHRpc2VsZWN0JyA9PT0gZGlzcGxheVR5cGUgKVxuXHRcdFx0fHwgKCAncmFuZ2VfcmFkaW8nID09PSBkaXNwbGF5VHlwZSB8fCAncmFuZ2Vfc2VsZWN0JyA9PT0gZGlzcGxheVR5cGUgKVxuXHRcdCkge1xuXHRcdFx0JGFsbEl0ZW1zTGFiZWwuc2hvdygpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHQkYWxsSXRlbXNMYWJlbC5oaWRlKCk7XG5cdFx0fVxuXHR9XG5cblx0ZnVuY3Rpb24gX2hhbmRsZVRvZ2dsZVJlcXVlc3QoIGRhdGEsIGN1cnJlbnRTZWxlY3RvciwgdmFsdWUgKSB7XG5cdFx0Y29uc3QgJGZpZWxkICAgICAgPSBjdXJyZW50U2VsZWN0b3IuY2xvc2VzdCggJy53Y2FwZi1mb3JtLWZpZWxkJyApO1xuXHRcdGNvbnN0IGhhbmRsZXIgICAgID0gZGF0YVsgJ2hhbmRsZXInIF07XG5cdFx0Y29uc3QgaGFuZGxlclR5cGUgPSBkYXRhWyAnaGFuZGxlclR5cGUnIF07XG5cdFx0Y29uc3QgZGVwZW5kYW50ICAgPSBkYXRhWyAnZGVwZW5kYW50JyBdO1xuXG5cdFx0bGV0IF92YWx1ZSA9IHZhbHVlO1xuXG5cdFx0aWYgKCAnY2hlY2tib3gnID09PSBoYW5kbGVyVHlwZSApIHtcblx0XHRcdF92YWx1ZSA9IGN1cnJlbnRTZWxlY3Rvci5pcyggJzpjaGVja2VkJyApID8gJzEnIDogJzAnO1xuXHRcdH1cblxuXHRcdGlmICggJ3JhZGlvJyA9PT0gaGFuZGxlclR5cGUgKSB7XG5cdFx0XHRfdmFsdWUgPSAkZmllbGQuZmluZCggaGFuZGxlciArICc6Y2hlY2tlZCcgKS52YWwoKTtcblx0XHR9XG5cblx0XHQkLmVhY2goIGRlcGVuZGFudCwgZnVuY3Rpb24oIGlkLCBkICkge1xuXHRcdFx0Y29uc3QgJHNlbGVjdG9yICAgPSAkZmllbGQuZmluZCggZFsgJ3NlbGVjdG9yJyBdICk7XG5cdFx0XHRjb25zdCB2YWxpZFZhbHVlcyA9IGRbICd2YWx1ZScgXTtcblxuXHRcdFx0aWYgKCB2YWxpZFZhbHVlcy5pbmNsdWRlcyggX3ZhbHVlICkgKSB7XG5cdFx0XHRcdCRzZWxlY3Rvci5zaG93KCk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHQkc2VsZWN0b3IuaGlkZSgpO1xuXHRcdFx0fVxuXHRcdH0gKTtcblxuXHRcdGlmICggJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1kaXNwbGF5X3R5cGUgc2VsZWN0JyA9PT0gaGFuZGxlciApIHtcblx0XHRcdF90cmlnZ2VySW5wdXRUeXBlVGV4dERpc3BsYXlUeXBlQ2hhbmdlKCBfdmFsdWUsICRmaWVsZCApO1xuXHRcdH1cblxuXHRcdGlmICggJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC11c2VfY2hvc2VuIGlucHV0JyA9PT0gaGFuZGxlciApIHtcblx0XHRcdF90cmlnZ2VySW5wdXRUeXBlVGV4dFVzZVNlbGVjdENoYW5nZSggX3ZhbHVlLCAkZmllbGQgKTtcblx0XHR9XG5cblx0XHRpZiAoICcud2NhcGYtZm9ybS1zdWItZmllbGQtbnVtYmVyX2Rpc3BsYXlfdHlwZSBzZWxlY3QnID09PSBoYW5kbGVyICkge1xuXHRcdFx0X3RyaWdnZXJJbnB1dFR5cGVOdW1iZXJEaXNwbGF5VHlwZUNoYW5nZSggX3ZhbHVlLCAkZmllbGQgKTtcblx0XHR9XG5cblx0XHRpZiAoICcud2NhcGYtZm9ybS1zdWItZmllbGQtbnVtYmVyX3JhbmdlX3VzZV9jaG9zZW4gaW5wdXQnID09PSBoYW5kbGVyICkge1xuXHRcdFx0X3RyaWdnZXJJbnB1dFR5cGVOdW1iZXJVc2VTZWxlY3RDaGFuZ2UoIF92YWx1ZSwgJGZpZWxkICk7XG5cdFx0fVxuXG5cdFx0JHNlYXJjaEZvcm0udHJpZ2dlciggJ2FmdGVyX3RvZ2dsZV9yZXF1ZXN0JywgWyBoYW5kbGVyLCBfdmFsdWUsICRmaWVsZCBdICk7XG5cdH1cblxuXHRmdW5jdGlvbiBoYW5kbGVUb2dnbGVSZXF1ZXN0KCBkYXRhLCBjdXJyZW50U2VsZWN0b3IsIHZhbHVlICkge1xuXHRcdGlmICggbnVsbCA9PT0gY3VycmVudFNlbGVjdG9yICkge1xuXHRcdFx0Y29uc3QgaGFuZGxlciAgPSBkYXRhWyAnaGFuZGxlcicgXTtcblx0XHRcdGNvbnN0ICRoYW5kbGVyID0gJCggaGFuZGxlciApO1xuXG5cdFx0XHQkLmVhY2goICRoYW5kbGVyLCBmdW5jdGlvbigpIHtcblx0XHRcdFx0Y29uc3QgX3RoaXMgID0gJCggdGhpcyApO1xuXHRcdFx0XHRjb25zdCBfdmFsdWUgPSBfdGhpcy52YWwoKTtcblx0XHRcdFx0X2hhbmRsZVRvZ2dsZVJlcXVlc3QoIGRhdGEsIF90aGlzLCBfdmFsdWUgKTtcblx0XHRcdH0gKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0X2hhbmRsZVRvZ2dsZVJlcXVlc3QoIGRhdGEsIGN1cnJlbnRTZWxlY3RvciwgdmFsdWUgKTtcblx0XHR9XG5cdH1cblxuXHRmdW5jdGlvbiBzZXR1cFNlYXJjaEZvcm0oIGluaXRhbCA9IGZhbHNlICkge1xuXHRcdCQuZWFjaCggZGVwZW5kYW50RGF0YSwgZnVuY3Rpb24oIGksIGRhdGEgKSB7XG5cdFx0XHRjb25zdCBoYW5kbGVyID0gZGF0YVsgJ2hhbmRsZXInIF07XG5cdFx0XHRjb25zdCBldmVudCAgID0gZGF0YVsgJ2V2ZW50JyBdO1xuXG5cdFx0XHRoYW5kbGVUb2dnbGVSZXF1ZXN0KCBkYXRhLCBudWxsLCBudWxsICk7XG5cblx0XHRcdGlmICggaW5pdGFsICkge1xuXHRcdFx0XHQkc2VhcmNoRm9ybS5vbiggZXZlbnQsIGhhbmRsZXIsIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdGNvbnN0IF90aGlzICA9ICQoIHRoaXMgKTtcblx0XHRcdFx0XHRjb25zdCBfdmFsdWUgPSAkKCB0aGlzICkudmFsKCk7XG5cdFx0XHRcdFx0aGFuZGxlVG9nZ2xlUmVxdWVzdCggZGF0YSwgX3RoaXMsIF92YWx1ZSApO1xuXHRcdFx0XHR9ICk7XG5cdFx0XHR9XG5cdFx0fSApO1xuXHR9XG5cblx0c2V0dXBTZWFyY2hGb3JtKCB0cnVlICk7XG5cblx0JHNlYXJjaEZvcm0ub24oICdmaWVsZF9hZGRlZCcsIGZ1bmN0aW9uKCkge1xuXHRcdC8vIFRvZ2dsZSB0aGUgdmlzaWJpbGl0eSBvZiBzdWJmaWVsZHMuXG5cdFx0c2V0dXBTZWFyY2hGb3JtKCk7XG5cdH0gKTtcblxufSApO1xuIiwiLyoqXG4gKiBUaGUgc2VhcmNoIGZvcm0uXG4gKlxuICogQHNpbmNlICAgICAgMy4wLjBcbiAqIEBwYWNrYWdlICAgIHdjLWFqYXgtcHJvZHVjdC1maWx0ZXJcbiAqIEBzdWJwYWNrYWdlIHdjLWFqYXgtcHJvZHVjdC1maWx0ZXIvYWRtaW4vc3JjL2pzXG4gKiBAYXV0aG9yICAgICBNYWludWwgSGFzc2FuIE1haW5cbiAqL1xuXG5jb25zdCB0b3RhbEZpZWxkSW5zdGFuY2VzID0galF1ZXJ5KCAnI3RvdGFsX2ZpZWxkX2luc3RhbmNlcycgKTtcblxuY29uc3Qgc2VhcmNoRm9ybSA9IGpRdWVyeSggJyNzZWFyY2gtZm9ybScgKTtcblxuLyoqXG4gKiBBc3NpZ24gYSB1bmlxdWUgaWQgYnkgcmVwbGFjaW5nIHRoZSBwbGFjZWhvbGRlciBpZC5cbiAqL1xuZnVuY3Rpb24gcmVtb3ZlUGxhY2Vob2xkZXIoIHVuaXF1ZUlkLCBlbGVtZW50cywgYXR0ciApIHtcblx0ZWxlbWVudHMuZWFjaChcblx0XHRmdW5jdGlvbigpIHtcblx0XHRcdGNvbnN0IGVsZW1lbnQgPSBqUXVlcnkoIHRoaXMgKTtcblxuXHRcdFx0Y29uc3Qgb2xkVmFsdWUgPSBlbGVtZW50LmF0dHIoIGF0dHIgKTtcblx0XHRcdGNvbnN0IG5ld1ZhbHVlID0gb2xkVmFsdWUucmVwbGFjZSggJyUlJywgdW5pcXVlSWQgKTtcblxuXHRcdFx0ZWxlbWVudC5hdHRyKCBhdHRyLCBuZXdWYWx1ZSApO1xuXHRcdH1cblx0KTtcbn1cblxuLyoqXG4gKiBJbnNlcnQgdGhlIGZpZWxkJ3Mgc3ViZmllbGRzLlxuICovXG5mdW5jdGlvbiBpbnNlcnRGaWVsZFN1YkZpZWxkcyggdWkgKSB7XG5cdC8vIEluc2VydCB0aGUgZmllbGQncyBzdWJmaWVsZHMgaWYgbm90IGFscmVhZHkgaW5zZXJ0ZWQuXG5cdGlmICggISB1aS5pdGVtLmhhc0NsYXNzKCAnc3ViLWZpZWxkcy1yZWFkeScgKSApIHtcblx0XHRjb25zdCB0eXBlICAgICAgPSB1aS5pdGVtLmF0dHIoICdkYXRhLWZpZWxkLXR5cGUnICk7XG5cdFx0Y29uc3QgdW5pcXVlSWQgID0gcGFyc2VJbnQoIHRvdGFsRmllbGRJbnN0YW5jZXMudmFsKCkgKTtcblx0XHRjb25zdCBmaWVsZFR5cGUgPSAnd2NhcGYtZm9ybS1maWVsZC0nICsgdHlwZTtcblxuXHRcdC8vIEJhaWwgb3V0IGlmIG5vIHRtcGwgZm91bmQgZm9yIHRoZSB0eXBlLlxuXHRcdGlmICggISBqUXVlcnkoICcjdG1wbC0nICsgZmllbGRUeXBlICkubGVuZ3RoICkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdC8vIEluY3JlbWVudCB0aGUgdmFsdWUgb2YgdG90YWwgZmllbGQgaW5zdGFuY2VzLlxuXHRcdHRvdGFsRmllbGRJbnN0YW5jZXMudmFsKCB1bmlxdWVJZCArIDEgKTtcblxuXHRcdGNvbnN0IHRlbXBsYXRlID0gd3AudGVtcGxhdGUoIGZpZWxkVHlwZSApO1xuXHRcdGNvbnN0IHJlbmRlcmVkID0gdGVtcGxhdGUoKTtcblx0XHRjb25zdCB3cmFwcGVyICA9IHVpLml0ZW0uZmluZCggJy53aWRnZXQtY29udGVudCcgKTtcblxuXHRcdHdyYXBwZXIucHJlcGVuZCggcmVuZGVyZWQgKTtcblxuXHRcdC8vIFVwZGF0ZSB0aGUgZm9yIGF0dHJpYnV0ZXMgb2YgdGhlIGxhYmVscy5cblx0XHRyZW1vdmVQbGFjZWhvbGRlciggdW5pcXVlSWQsIHVpLml0ZW0uZmluZCggJ2xhYmVsW2Zvcl49XCJ3Y2FwZi1pbnB1dC1cIl0nICksICdmb3InICk7XG5cblx0XHQvLyBVcGRhdGUgdGhlIGlkcyBvZiB0aGUgaW5wdXQgZWxlbWVudHMuXG5cdFx0cmVtb3ZlUGxhY2Vob2xkZXIoIHVuaXF1ZUlkLCB1aS5pdGVtLmZpbmQoICcqW2lkXj1cIndjYXBmLWlucHV0LVwiXScgKSwgJ2lkJyApO1xuXG5cdFx0Ly8gVXBkYXRlIHRoZSBuYW1lcyBvZiB0aGUgaW5wdXQgZWxlbWVudHMuXG5cdFx0cmVtb3ZlUGxhY2Vob2xkZXIoIHVuaXF1ZUlkLCB1aS5pdGVtLmZpbmQoICcqW2lkXj1cIndjYXBmLWlucHV0LVwiXScgKSwgJ25hbWUnICk7XG5cblx0XHQvLyBVcGRhdGUgdGhlIHBvc2l0aW9uIHZhbHVlLlxuXHRcdHJlbW92ZVBsYWNlaG9sZGVyKCB1bmlxdWVJZCwgdWkuaXRlbS5maW5kKCAnKltpZF49XCJ3Y2FwZi1pbnB1dC1wb3NpdGlvbi1cIl0nICksICd2YWx1ZScgKTtcblxuXHRcdHVpLml0ZW0uYWRkQ2xhc3MoICdzdWItZmllbGRzLXJlYWR5JyApO1xuXG5cdFx0c2VhcmNoRm9ybS50cmlnZ2VyKCAnZmllbGRfYWRkZWQnLCBbIHVpIF0gKTtcblx0fVxufVxuXG4vKipcbiAqIFVwZGF0ZSB0aGUgZm9ybSBmaWVsZCdzIHBvc2l0aW9uIGFmdGVyIHNvcnQuXG4gKlxuICogQHNvdXJjZSBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL2EvMTQ3MzY3NzVcbiAqL1xuZnVuY3Rpb24gdXBkYXRlRmllbGRzUG9zaXRpb24oKSB7XG5cdGNvbnN0IGlucHV0cyAgPSBzZWFyY2hGb3JtLmZpbmQoICcqW2lkXj1cIndjYXBmLWlucHV0LXBvc2l0aW9uLVwiXScgKTtcblx0Y29uc3QgbmJFbGVtcyA9IGlucHV0cy5sZW5ndGg7XG5cblx0aW5wdXRzLmVhY2goXG5cdFx0ZnVuY3Rpb24oIGlkeCApIHtcblx0XHRcdGpRdWVyeSggdGhpcyApLnZhbCggbmJFbGVtcyAtICggbmJFbGVtcyAtIGlkeCApICk7XG5cdFx0fVxuXHQpO1xufVxuXG4vKipcbiAqIE1ha2UgdGhlIGZpZWxkIHJlYWR5LCByZW1vdmUgc3R5bGVzIGNvbWVzIGZyb20ganF1ZXJ5LXVpLXNvcnRhYmxlIHBsdWdpbiwgaW5zZXJ0IHRoZSBmaWVsZCdzIHN1YmZpZWxkcyBldGMuXG4gKi9cbmZ1bmN0aW9uIG1ha2VGaWVsZFJlYWR5KCBlLCB1aSApIHtcblx0Ly8gUmVtb3ZlIHN0eWxlcyBjb21lcyBmcm9tIGpxdWVyeS11aS1zb3J0YWJsZSBwbHVnaW4uXG5cdHVpLml0ZW0ucmVtb3ZlQXR0ciggJ3N0eWxlJyApO1xuXG5cdGluc2VydEZpZWxkU3ViRmllbGRzKCB1aSApO1xuXG5cdHVwZGF0ZUZpZWxkc1Bvc2l0aW9uKCk7XG5cblx0Y29uc3QgdG9nZ2xlQnRuID0gdWkuaXRlbS5maW5kKCAnLndpZGdldC1hY3Rpb24nICk7XG5cblx0Ly8gRXhwYW5kIHRoZSBmb3JtIGZpZWxkIGFmdGVyIHNvcnQuXG5cdGlmICggJ2ZhbHNlJyA9PT0gdG9nZ2xlQnRuLmF0dHIoICdhcmlhLWV4cGFuZGVkJyApICkge1xuXHRcdHRvZ2dsZUJ0bi50cmlnZ2VyKCAnY2xpY2snICk7XG5cdH1cbn1cblxuLyoqXG4gKiBJbnN0YW50aWF0ZSBzb3J0YWJsZSBmb3IgdGhlIGZvcm0gZmllbGRzLlxuICovXG5mdW5jdGlvbiBzb3J0YWJsZSggaWRlbnRpZmllciApIHtcblx0Y29uc3QgY29udGFpbmVyID0galF1ZXJ5KCBpZGVudGlmaWVyICk7XG5cblx0Y29udGFpbmVyLnNvcnRhYmxlKFxuXHRcdHtcblx0XHRcdG9wYWNpdHk6IDAuOCxcblx0XHRcdHJldmVydDogZmFsc2UsXG5cdFx0XHRjdXJzb3I6ICdtb3ZlJyxcblx0XHRcdGF4aXM6ICd5Jyxcblx0XHRcdGhhbmRsZTogJy53aWRnZXQtdG9wJyxcblx0XHRcdGNhbmNlbDogJy53aWRnZXQtdGl0bGUtYWN0aW9uJyxcblx0XHRcdGl0ZW1zOiAnLndpZGdldCcsXG5cdFx0XHRwbGFjZWhvbGRlcjogJ3dpZGdldC1wbGFjZWhvbGRlcicsXG5cdFx0XHRjb25uZWN0V2l0aDogJyNzZWFyY2gtZm9ybS13cmFwcGVyJyxcblx0XHRcdHN0b3A6IG1ha2VGaWVsZFJlYWR5LFxuXHRcdFx0c3RhcnQ6IGZ1bmN0aW9uKCBlLCB1aSApIHtcblx0XHRcdFx0Ly8gSWYgaXQgaXMgZ2V0dGluZyBhcHBlbmRlZCB0byB0aGUgd3JvbmcgcGxhY2UsIHRoZW4gZm9yY2UgaXQgaW50byB0aGUgcmlnaHQgY29udGFpbmVyLlxuXHRcdFx0XHR1aS5wbGFjZWhvbGRlci5hcHBlbmRUbyggdWkucGxhY2Vob2xkZXIucGFyZW50KCkuZmluZCggJy5pbnNpZGUgI3NlYXJjaC1mb3JtLXdyYXBwZXInICkgKTtcblx0XHRcdH1cblx0XHR9XG5cdCk7XG59XG5cbnNvcnRhYmxlKCAnI3NlYXJjaC1mb3JtJyApO1xuXG4vKipcbiAqIFJ1biBmdW5jdGlvbiB3aGVuIGRyYWcgc3RhcnRzLlxuICovXG5mdW5jdGlvbiBvbkRyYWdTdGFydCgpIHtcblx0c2VhcmNoRm9ybS5hZGRDbGFzcyggJ3VpLWRyb3AtYWN0aXZlJyApO1xufVxuXG4vKipcbiAqIFJ1biBmdW5jdGlvbiBhdCBkcmFnIHN0b3AuXG4gKi9cbmZ1bmN0aW9uIG9uRHJhZ1N0b3AoKSB7XG5cdHNlYXJjaEZvcm0ucmVtb3ZlQ2xhc3MoICd1aS1kcm9wLWFjdGl2ZScgKTtcbn1cblxuLyoqXG4gKiBJbml0aWFsaXplIGRyYWdnYWJsZSBmb3IgdGhlIGZvcm0gZmllbGRzLlxuICovXG5qUXVlcnkoICcjYXZhaWxhYmxlLWZpZWxkcyAud2lkZ2V0JyApLmRyYWdnYWJsZShcblx0e1xuXHRcdGNvbm5lY3RUb1NvcnRhYmxlOiAnI3NlYXJjaC1mb3JtJyxcblx0XHRoZWxwZXI6ICdjbG9uZScsXG5cdFx0c3RhcnQ6IG9uRHJhZ1N0YXJ0LFxuXHRcdHN0b3A6IG9uRHJhZ1N0b3AsXG5cdH1cbik7XG5cbi8qKlxuICogVG9nZ2xlIHRoZSBmb3JtIGZpZWxkLlxuICovXG5mdW5jdGlvbiB0b2dnbGVGaWVsZCggZSApIHtcblx0Y29uc3QgdGFyZ2V0ICAgICAgID0gZS50YXJnZXQ7XG5cdGNvbnN0IHdpZGdldCAgICAgICA9IGpRdWVyeSggdGhpcyApLmNsb3Nlc3QoICcud2lkZ2V0JyApO1xuXHRjb25zdCB0b2dnbGVCdG4gICAgPSB3aWRnZXQuZmluZCggJy53aWRnZXQtYWN0aW9uJyApO1xuXHRjb25zdCBpbnNpZGUgICAgICAgPSB3aWRnZXQuY2hpbGRyZW4oICcud2lkZ2V0LWluc2lkZScgKTtcblx0Y29uc3QgaXNFeHBhbmQgICAgID0gdG9nZ2xlQnRuLmF0dHIoICdhcmlhLWV4cGFuZGVkJyApO1xuXHRjb25zdCB0b2dnbGVFeHBhbmQgPSAndHJ1ZScgPT09IGlzRXhwYW5kID8gJ2ZhbHNlJyA6ICd0cnVlJztcblxuXHR0b2dnbGVCdG4uYXR0ciggJ2FyaWEtZXhwYW5kZWQnLCB0b2dnbGVFeHBhbmQgKTtcblx0alF1ZXJ5KCBpbnNpZGUgKS5zbGlkZVRvZ2dsZShcblx0XHQnZmFzdCcsXG5cdFx0ZnVuY3Rpb24oKSB7XG5cdFx0XHR3aWRnZXQudG9nZ2xlQ2xhc3MoICdvcGVuJyApO1xuXHRcdFx0c2VhcmNoRm9ybS50cmlnZ2VyKCAnd2lkZ2V0LWNsb3NlZCcsIFsgdGFyZ2V0IF0gKTtcblx0XHR9XG5cdCk7XG59XG5cbnNlYXJjaEZvcm0ub24oICdjbGljaycsICcud2lkZ2V0LXRvcCcsIHRvZ2dsZUZpZWxkICk7XG5zZWFyY2hGb3JtLm9uKCAnY2xpY2snLCAnLndpZGdldC1jb250cm9sLWNsb3NlJywgdG9nZ2xlRmllbGQgKTtcblxuLyoqXG4gKiBGb2N1cyB0aGUgZm9ybSBmaWVsZCdzIGV4cGFuZCBidXR0b24uXG4gKi9cbmZ1bmN0aW9uIGZvY3VzRmllbGQoIGUsIHRhcmdldCApIHtcblx0aWYgKCB0YXJnZXQuY2xhc3NMaXN0LmNvbnRhaW5zKCAnd2lkZ2V0LWNvbnRyb2wtY2xvc2UnICkgKSB7XG5cdFx0Y29uc3Qgd2lkZ2V0ID0galF1ZXJ5KCB0YXJnZXQgKS5jbG9zZXN0KCAnLndpZGdldCcgKTtcblx0XHRjb25zdCBhY3Rpb24gPSB3aWRnZXQuZmluZCggJy53aWRnZXQtYWN0aW9uJyApO1xuXG5cdFx0YWN0aW9uLmF0dHIoICdhcmlhLWV4cGFuZGVkJywgJ2ZhbHNlJyApLmZvY3VzKCk7XG5cdH1cbn1cblxuc2VhcmNoRm9ybS5vbiggJ3dpZGdldC1jbG9zZWQnLCBmb2N1c0ZpZWxkICk7XG5cbi8qKlxuICogUmVtb3ZlIHRoZSBmaWVsZC5cbiAqL1xuZnVuY3Rpb24gcmVtb3ZlRmllbGQoKSB7XG5cdGNvbnN0IHdpZGdldCA9IGpRdWVyeSggdGhpcyApLmNsb3Nlc3QoICcud2lkZ2V0JyApO1xuXG5cdGpRdWVyeSggd2lkZ2V0ICkuc2xpZGVVcChcblx0XHQnZmFzdCcsXG5cdFx0ZnVuY3Rpb24oKSB7XG5cdFx0XHR3aWRnZXQucmVtb3ZlKCk7XG5cdFx0XHR1cGRhdGVGaWVsZHNQb3NpdGlvbigpO1xuXHRcdH1cblx0KTtcbn1cblxuc2VhcmNoRm9ybS5vbiggJ2NsaWNrJywgJy53aWRnZXQtY29udHJvbC1yZW1vdmUnLCByZW1vdmVGaWVsZCApO1xuXG4vKipcbiAqIFN0b3JlIHRoZSBpbml0aWFsIGZvcm0gZGF0YSBpbnRvIGEgdmFyaWFibGUgc28gdGhhdCB3ZSBjYW4gY29tcGFyZSBpdCB3aGVuIGxlYXZpbmcgdGhlIHBhZ2UuXG4gKi9cbmxldCBpbml0aWFsRm9ybVN0YXRlID0gc2VhcmNoRm9ybS5zZXJpYWxpemVBcnJheSgpO1xuXG4vKipcbiAqIFNob3cgbWVzc2FnZSBhZnRlciBmb3JtIHN1Ym1pc3Npb24uXG4gKi9cbmZ1bmN0aW9uIHNob3dNZXNzYWdlKCBtZXNzYWdlLCB0eXBlID0gJ3N1Y2Nlc3MnICkge1xuXHRjb25zdCBlbGVtZW50ID0galF1ZXJ5KCAnPHAgY2xhc3M9XCInICsgdHlwZSArICdcIj4nICsgbWVzc2FnZSArICc8L3A+JyApO1xuXHRjb25zdCB3cmFwcGVyID0galF1ZXJ5KCAnLndjYXBmLW1lc3NhZ2Utd3JhcHBlcicgKTtcblxuXHRpZiAoICEgd3JhcHBlci5pcyggJzplbXB0eScgKSApIHtcblx0XHRyZXR1cm47XG5cdH1cblxuXHRqUXVlcnkoIHdyYXBwZXIgKS5odG1sKCBlbGVtZW50ICkuc2xpZGVEb3duKCAnZmFzdCcgKTtcblxuXHRzZXRUaW1lb3V0KFxuXHRcdGZ1bmN0aW9uKCkge1xuXHRcdFx0alF1ZXJ5KCB3cmFwcGVyICkuc2xpZGVVcCggJ2Zhc3QnICk7XG5cdFx0XHR3cmFwcGVyLmh0bWwoICcnICk7XG5cdFx0fSxcblx0XHQzMDAwXG5cdCk7XG59XG5cbi8qKlxuICogU2F2ZSB0aGUgc2VhcmNoIGZvcm0uXG4gKi9cbmZ1bmN0aW9uIHNhdmVGb3JtKCkge1xuXHRjb25zdCBidXR0b24gICA9IGpRdWVyeSggdGhpcyApO1xuXHRjb25zdCBmb3JtRGF0YSA9IHNlYXJjaEZvcm0uc2VyaWFsaXplQXJyYXkoKTtcblxuXHRidXR0b24uYXR0ciggJ2Rpc2FibGVkJywgJ2Rpc2FibGVkJyApO1xuXG5cdGZ1bmN0aW9uIG9rQ2FsbGJhY2soIG1lc3NhZ2UgKSB7XG5cdFx0YnV0dG9uLnJlbW92ZUF0dHIoICdkaXNhYmxlZCcgKTtcblxuXHRcdC8vIFVwZGF0ZSB0aGUgaW5pdGlhbCBmb3JtIGRhdGEgYWZ0ZXIgc3VjY2Vzc2Z1bGx5IHNhdmluZyB0aGUgZm9ybS5cblx0XHRpbml0aWFsRm9ybVN0YXRlID0gZm9ybURhdGE7XG5cblx0XHRzaG93TWVzc2FnZSggbWVzc2FnZSApO1xuXHR9XG5cblx0ZnVuY3Rpb24gZXJyQ2FsbGJhY2soIG1lc3NhZ2UgKSB7XG5cdFx0YnV0dG9uLnJlbW92ZUF0dHIoICdkaXNhYmxlZCcgKTtcblx0XHRzaG93TWVzc2FnZSggbWVzc2FnZSwgJ2Vycm9yJyApO1xuXHR9XG5cblx0Ly8gaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9hLzU5MTgxMjUyXG5cdHdwLmFqYXgucG9zdCggZm9ybURhdGEgKS5kb25lKCBva0NhbGxiYWNrICkuZmFpbCggZXJyQ2FsbGJhY2sgKTtcbn1cblxualF1ZXJ5KCAnI3Bvc3Rib3gtY29udGFpbmVyLTEnICkub24oICdjbGljaycsICdidXR0b24nLCBzYXZlRm9ybSApO1xuXG4vKipcbiAqIFNob3cgYWxlcnQgb24gbGVhdmUgaWYgdGhlIGZvcm0gaXMgZGlydHkuXG4gKlxuICogVE9ETzogVW5jb21tZW50IHRoaXMuXG4gKi9cbi8vIHdpbmRvdy5vbmJlZm9yZXVubG9hZCA9IGZ1bmN0aW9uKCkge1xuLy8gXHRjb25zdCBuZXdGb3JtU3RhdGUgPSBzZWFyY2hGb3JtLnNlcmlhbGl6ZUFycmF5KCk7XG4vL1xuLy8gXHRjb25zdCBpc0Zvcm1EaXJ0eSA9ICEgXy5pc0VxdWFsKCBuZXdGb3JtU3RhdGUsIGluaXRpYWxGb3JtU3RhdGUgKTtcbi8vXG4vLyBcdGlmICggaXNGb3JtRGlydHkgKSB7XG4vLyBcdFx0cmV0dXJuICcnO1xuLy8gXHR9XG4vLyB9O1xuIiwiLyoqXG4gKiBUaGUgcHJvZHVjdCBzdGF0dXMgZmllbGQuXG4gKlxuICogQHNpbmNlICAgICAgMy4wLjBcbiAqIEBwYWNrYWdlICAgIHdjLWFqYXgtcHJvZHVjdC1maWx0ZXJcbiAqIEBzdWJwYWNrYWdlIHdjLWFqYXgtcHJvZHVjdC1maWx0ZXIvYWRtaW4vc3JjL2pzXG4gKiBAYXV0aG9yICAgICBNYWludWwgSGFzc2FuIE1haW5cbiAqL1xuXG5qUXVlcnkoIGRvY3VtZW50ICkucmVhZHkoIGZ1bmN0aW9uKCAkICkge1xuXG5cdGNvbnN0ICRzZWFyY2hGb3JtID0gJCggJyNzZWFyY2gtZm9ybScgKTtcblxuXHRmdW5jdGlvbiB0cmlnZ2VyU29ydEJ5T3B0aW9uc0NoYW5nZSggJGZpZWxkICkge1xuXHRcdGNvbnN0ICR2YWx1ZUhvbGRlciAgPSAkZmllbGQuZmluZCggJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1zb3J0X2J5X29wdGlvbnMgaW5wdXQnICk7XG5cdFx0Y29uc3QgJG9wdGlvbnNUYWJsZSA9ICRmaWVsZC5maW5kKCAnLnNvcnQtYnktb3B0aW9ucy10YWJsZScgKTtcblx0XHRjb25zdCAkcm93cyAgICAgICAgID0gJG9wdGlvbnNUYWJsZS5maW5kKCAnLm1hbnVhbC1vcHRpb25zLXRhYmxlLWJvZHktcm93cycgKTtcblx0XHRjb25zdCBfcm93cyAgICAgICAgID0gW107XG5cblx0XHQkcm93cy5maW5kKCAnLnNvcnQtb3B0aW9uLWl0ZW0nICkuZWFjaCggZnVuY3Rpb24oIGksIF9pdGVtICkge1xuXHRcdFx0Y29uc3QgJGl0ZW0gICAgICAgICAgPSAkKCBfaXRlbSApO1xuXHRcdFx0Y29uc3QgdmFsdWUgICAgICAgICAgPSAkaXRlbS5maW5kKCAnLm9wdGlvbl92YWx1ZScgKS52YWwoKTtcblx0XHRcdGNvbnN0IGRpcmVjdGlvbiAgICAgID0gJGl0ZW0uZmluZCggJy5vcHRpb25fZGlyZWN0aW9uJyApLnZhbCgpO1xuXHRcdFx0Y29uc3QgbGFiZWwgICAgICAgICAgPSAkaXRlbS5maW5kKCAnLm9wdGlvbl9sYWJlbCcgKS52YWwoKTtcblx0XHRcdGNvbnN0IG1ldGFfa2V5ICAgICAgID0gJGl0ZW0uZmluZCggJy5vcHRpb25fbWV0YV9rZXknICkudmFsKCk7XG5cdFx0XHRjb25zdCBtZXRhX3NvcnRfdHlwZSA9ICRpdGVtLmZpbmQoICcub3B0aW9uX21ldGFfc29ydF90eXBlJyApLnZhbCgpO1xuXG5cdFx0XHRpZiAoIHZhbHVlICkge1xuXHRcdFx0XHRfcm93cy5wdXNoKCBbIHZhbHVlLCBkaXJlY3Rpb24sIGxhYmVsLCBtZXRhX2tleSwgbWV0YV9zb3J0X3R5cGUgXSApO1xuXHRcdFx0fVxuXHRcdH0gKTtcblxuXHRcdGNvbnN0IHJhd1ZhbHVlcyA9IGVuY29kZVVSSUNvbXBvbmVudCggSlNPTi5zdHJpbmdpZnkoIF9yb3dzICkgKTtcblx0XHQkdmFsdWVIb2xkZXIudmFsKCByYXdWYWx1ZXMgKTtcblx0fVxuXG5cdGZ1bmN0aW9uIGluaXRTb3J0YWJsZUZvclNvcnRCeU9wdGlvbnMoICRzZWxlY3RvciApIHtcblx0XHQkc2VsZWN0b3Iuc29ydGFibGUoIHtcblx0XHRcdG9wYWNpdHk6IDAuOCxcblx0XHRcdHJldmVydDogZmFsc2UsXG5cdFx0XHRjdXJzb3I6ICdtb3ZlJyxcblx0XHRcdGF4aXM6ICd5Jyxcblx0XHRcdGhhbmRsZTogJy5tb3ZlLW9wdGlvbnMtaGFuZGxlcicsXG5cdFx0XHRwbGFjZWhvbGRlcjogJ3dpZGdldC1wbGFjZWhvbGRlcicsXG5cdFx0XHR1cGRhdGU6IGZ1bmN0aW9uKCBlICkge1xuXHRcdFx0XHRjb25zdCAkZmllbGQgPSAkKCBlLnRhcmdldCApLmNsb3Nlc3QoICcud2NhcGYtZm9ybS1maWVsZCcgKTtcblxuXHRcdFx0XHR0cmlnZ2VyU29ydEJ5T3B0aW9uc0NoYW5nZSggJGZpZWxkICk7XG5cdFx0XHR9XG5cdFx0fSApLmRpc2FibGVTZWxlY3Rpb24oKTtcblx0fVxuXG5cdC8vIFNvcnQgTWFudWFsIE9wdGlvbnNcblx0aW5pdFNvcnRhYmxlRm9yU29ydEJ5T3B0aW9ucyggJHNlYXJjaEZvcm0uZmluZCggJy5zb3J0LWJ5LW9wdGlvbnMtdGFibGUgLm1hbnVhbC1vcHRpb25zLXRhYmxlLWJvZHktcm93cycgKSApO1xuXG5cdCRzZWFyY2hGb3JtLm9uKCAnZmllbGRfYWRkZWQnLCBmdW5jdGlvbiggZSwgdWkgKSB7XG5cdFx0Ly8gSW5pdCBTb3J0YWJsZSBmb3IgdGhlIG1hbnVhbCBvcHRpb25zLlxuXHRcdGluaXRTb3J0YWJsZUZvclNvcnRCeU9wdGlvbnMoICQoIHVpLml0ZW0uZmluZCggJy5tYW51YWwtb3B0aW9ucy10YWJsZS1ib2R5LXJvd3MnICkgKSApO1xuXHR9ICk7XG5cblx0ZnVuY3Rpb24gdHJpZ2dlclJlbW92ZVNvcnRCeU9wdGlvbiggJGZpZWxkICkge1xuXHRcdGNvbnN0ICRvcHRpb25zVGFibGUgPSAkZmllbGQuZmluZCggJy5zb3J0LWJ5LW9wdGlvbnMtdGFibGUnICk7XG5cdFx0Y29uc3QgdGFibGVSb3dzICAgICA9ICRvcHRpb25zVGFibGUuZmluZCggJy5tYW51YWwtb3B0aW9ucy10YWJsZS1ib2R5LXJvd3MnICkuY2hpbGRyZW4oKTtcblxuXHRcdGlmICggMiA+IHRhYmxlUm93cy5sZW5ndGggKSB7XG5cdFx0XHQkb3B0aW9uc1RhYmxlLnJlbW92ZUNsYXNzKCAnaGFzLW9wdGlvbnMnICk7XG5cdFx0fVxuXHR9XG5cblx0Ly8gUmVtb3ZlIFNpbmdsZSBOdW1iZXIgT3B0aW9uXG5cdCRzZWFyY2hGb3JtLm9uKCAnY2xpY2snLCAnLnJlbW92ZS1zb3J0LWJ5LW9wdGlvbicsIGZ1bmN0aW9uKCkge1xuXHRcdGNvbnN0ICRpdGVtICA9ICQoIHRoaXMgKS5jbG9zZXN0KCAnLnNvcnQtb3B0aW9uLWl0ZW0nICk7XG5cdFx0Y29uc3QgJGZpZWxkID0gJGl0ZW0uY2xvc2VzdCggJy53Y2FwZi1mb3JtLWZpZWxkJyApO1xuXG5cdFx0dHJpZ2dlclJlbW92ZVNvcnRCeU9wdGlvbiggJGZpZWxkICk7XG5cblx0XHQkaXRlbS5yZW1vdmUoKTtcblxuXHRcdHRyaWdnZXJTb3J0QnlPcHRpb25zQ2hhbmdlKCAkZmllbGQgKTtcblx0fSApO1xuXG5cdC8vIENsZWFyIEFsbCBPcHRpb25zXG5cdCRzZWFyY2hGb3JtLm9uKCAnY2xpY2snLCAnLmNsZWFyLWFsbC1zb3J0LWJ5LW9wdGlvbnMnLCBmdW5jdGlvbigpIHtcblx0XHRjb25zdCAkZmllbGQgICAgICAgID0gJCggdGhpcyApLmNsb3Nlc3QoICcud2NhcGYtZm9ybS1maWVsZCcgKTtcblx0XHRjb25zdCAkb3B0aW9uc1RhYmxlID0gJGZpZWxkLmZpbmQoICcuc29ydC1ieS1vcHRpb25zLXRhYmxlJyApO1xuXG5cdFx0JG9wdGlvbnNUYWJsZS5maW5kKCAnLm1hbnVhbC1vcHRpb25zLXRhYmxlLWJvZHktcm93cycgKS5lbXB0eSgpO1xuXG5cdFx0dHJpZ2dlclJlbW92ZVNvcnRCeU9wdGlvbiggJGZpZWxkICk7XG5cblx0XHR0cmlnZ2VyU29ydEJ5T3B0aW9uc0NoYW5nZSggJGZpZWxkICk7XG5cdH0gKTtcblxuXHQvLyBBZGQgTmV3IE9wdGlvblxuXHQkc2VhcmNoRm9ybS5vbiggJ2NsaWNrJywgJy5hZGQtc29ydC1ieS1vcHRpb24nLCBmdW5jdGlvbigpIHtcblx0XHRjb25zdCBmaWVsZFR5cGUgPSAnd2NhcGYtc29ydC1ieS1vcHRpb24nO1xuXG5cdFx0Ly8gQmFpbCBvdXQgaWYgbm8gdG1wbCBmb3VuZCBmb3IgdGhlIHR5cGUuXG5cdFx0aWYgKCAhIGpRdWVyeSggJyN0bXBsLScgKyBmaWVsZFR5cGUgKS5sZW5ndGggKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0Y29uc3QgJGZpZWxkID0gJCggdGhpcyApLmNsb3Nlc3QoICcud2NhcGYtZm9ybS1maWVsZCcgKTtcblxuXHRcdGNvbnN0IHRlbXBsYXRlID0gd3AudGVtcGxhdGUoIGZpZWxkVHlwZSApO1xuXHRcdGNvbnN0IHJlbmRlcmVkID0gdGVtcGxhdGUoIHsgdmFsdWU6ICcnLCBkaXJlY3Rpb246ICcnLCBsYWJlbDogJycgfSApO1xuXHRcdGNvbnN0ICR3cmFwcGVyID0gJGZpZWxkLmZpbmQoICcuc29ydC1ieS1vcHRpb25zLXRhYmxlJyApO1xuXHRcdGNvbnN0ICRyb3dzICAgID0gJHdyYXBwZXIuZmluZCggJy5tYW51YWwtb3B0aW9ucy10YWJsZS1ib2R5LXJvd3MnICk7XG5cblx0XHQkcm93cy5hcHBlbmQoIHJlbmRlcmVkICk7XG5cblx0XHR0cmlnZ2VyU29ydEJ5T3B0aW9uc0NoYW5nZSggJGZpZWxkICk7XG5cblx0XHRpZiAoICEgJHdyYXBwZXIuaGFzQ2xhc3MoICdoYXMtb3B0aW9ucycgKSApIHtcblx0XHRcdCR3cmFwcGVyLmFkZENsYXNzKCAnaGFzLW9wdGlvbnMnICk7XG5cdFx0fVxuXHR9ICk7XG5cblx0Y29uc3Qgcm93SW5wdXRzID0gJy5zb3J0LWJ5LW9wdGlvbnMtdGFibGUgaW5wdXRbdHlwZT1cInRleHRcIl0sJyArXG5cdFx0JyAuc29ydC1ieS1vcHRpb25zLXRhYmxlIC5vcHRpb25fdmFsdWUsJyArXG5cdFx0JyAuc29ydC1ieS1vcHRpb25zLXRhYmxlIC5vcHRpb25fZGlyZWN0aW9uLCcgK1xuXHRcdCcgLnNvcnQtYnktb3B0aW9ucy10YWJsZSAub3B0aW9uX21ldGFfa2V5LCcgK1xuXHRcdCcgLnNvcnQtYnktb3B0aW9ucy10YWJsZSAub3B0aW9uX21ldGFfc29ydF90eXBlJztcblxuXHQkc2VhcmNoRm9ybS5vbiggJ2lucHV0Jywgcm93SW5wdXRzLCBmdW5jdGlvbigpIHtcblx0XHRjb25zdCAkZmllbGQgPSAkKCB0aGlzICkuY2xvc2VzdCggJy53Y2FwZi1mb3JtLWZpZWxkJyApO1xuXG5cdFx0dHJpZ2dlclNvcnRCeU9wdGlvbnNDaGFuZ2UoICRmaWVsZCApO1xuXHR9ICk7XG5cblx0JHNlYXJjaEZvcm0ub24oICdjaGFuZ2UnLCAnLnNvcnQtb3B0aW9uLWl0ZW0gLm9wdGlvbl92YWx1ZScsIGZ1bmN0aW9uKCkge1xuXHRcdGNvbnN0ICRzb3J0T3B0aW9uICAgICA9ICQoIHRoaXMgKTtcblx0XHRjb25zdCBzb3J0T3B0aW9uICAgICAgPSAkc29ydE9wdGlvbi52YWwoKTtcblx0XHRjb25zdCAkc29ydE9wdGlvbkl0ZW0gPSAkc29ydE9wdGlvbi5jbG9zZXN0KCAnLnNvcnQtb3B0aW9uLWl0ZW0nICk7XG5cdFx0Y29uc3QgJG1ldGFEYXRhICAgICAgID0gJHNvcnRPcHRpb25JdGVtLmZpbmQoICcubWV0YS1kYXRhJyApO1xuXG5cdFx0aWYgKCAnbWV0YV92YWx1ZScgPT09IHNvcnRPcHRpb24gKSB7XG5cdFx0XHQkbWV0YURhdGEuc2xpZGVEb3duKCk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdCRtZXRhRGF0YS5zbGlkZVVwKCk7XG5cdFx0fVxuXHR9ICk7XG5cbn0gKTtcbiJdfQ==
