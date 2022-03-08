"use strict";

/**
 * The time since options of date field.
 *
 * @since      3.0.0
 * @package    wc-ajax-product-filter
 * @subpackage wc-ajax-product-filter/admin/src/js
 * @author     Mainul Hassan Main
 */
jQuery(document).ready(function ($) {
  var $searchForm = $('#search-form');
  $searchForm.on('after_toggle_request', function (e, handler, value, $field) {
    if ('.wcapf-form-sub-field-date_display_type select' === handler) {
      var $dateUIGroup = $field.find('.date-ui-group');
      var $timePeriodGroup = $field.find('.time-period-group');

      if ('input_date' === value || 'input_date_range' === value) {
        $dateUIGroup.show();
        $timePeriodGroup.hide();
      } else {
        $dateUIGroup.hide();
        $timePeriodGroup.show();
      }
    }
  });

  function triggerTimePeriodOptionsChange($field) {
    var $valueHolder = $field.find('.wcapf-form-sub-field-time_period_options input');
    var $optionsTable = $field.find('.time-period-options-table');
    var $rows = $optionsTable.find('.manual-options-table-body-rows');
    var _rows = [];
    $rows.find('.time-period-item').each(function (i, _item) {
      var $item = $(_item);
      var value = $item.find('.option_value').val();
      var label = $item.find('.option_label').val();
      var difference_type = $item.find('.difference_type').val();
      var difference_amount = $item.find('.difference_amount').val();
      var difference_unit = $item.find('.difference_unit').val();

      if (value) {
        _rows.push([value, label, difference_type, difference_amount, difference_unit]);
      }
    });
    var rawValues = encodeURIComponent(JSON.stringify(_rows));
    $valueHolder.val(rawValues);
  }

  function initSortableForTimePeriodOptions($selector) {
    $selector.sortable({
      opacity: 0.8,
      revert: false,
      cursor: 'move',
      axis: 'y',
      handle: '.move-options-handler',
      placeholder: 'widget-placeholder',
      update: function update(e) {
        var $field = $(e.target).closest('.wcapf-form-field');
        triggerTimePeriodOptionsChange($field);
      }
    }).disableSelection();
  } // Sort Manual Options


  initSortableForTimePeriodOptions($searchForm.find('.time-period-options-table .manual-options-table-body-rows'));
  $searchForm.on('field_added', function (e, ui) {
    // Init Sortable for the manual options.
    initSortableForTimePeriodOptions($(ui.item.find('.manual-options-table-body-rows')));
  });

  function triggerRemoveTimePeriodOption($field) {
    var $optionsTable = $field.find('.time-period-options-table');
    var tableRows = $optionsTable.find('.manual-options-table-body-rows').children();

    if (2 > tableRows.length) {
      $optionsTable.removeClass('has-options');
    }
  } // Remove Single Number Option


  $searchForm.on('click', '.remove-time-period-option', function () {
    var $item = $(this).closest('.time-period-item');
    var $field = $item.closest('.wcapf-form-field');
    triggerRemoveTimePeriodOption($field);
    $item.remove();
    triggerTimePeriodOptionsChange($field);
  }); // Clear All Options

  $searchForm.on('click', '.clear-all-time-period-options', function () {
    var $field = $(this).closest('.wcapf-form-field');
    var $optionsTable = $field.find('.time-period-options-table');
    $optionsTable.find('.manual-options-table-body-rows').empty();
    triggerRemoveTimePeriodOption($field);
    triggerTimePeriodOptionsChange($field);
  }); // Add New Option

  $searchForm.on('click', '.add-time-period-option', function () {
    var fieldType = 'wcapf-time-period-option'; // Bail out if no tmpl found for the type.

    if (!jQuery('#tmpl-' + fieldType).length) {
      return;
    }

    var $field = $(this).closest('.wcapf-form-field');
    var options = {
      value: '',
      label: '',
      difference_type: '',
      difference_amount: '1',
      difference_unit: ''
    };
    var template = wp.template(fieldType);
    var rendered = template(options);
    var $wrapper = $field.find('.time-period-options-table');
    var $rows = $wrapper.find('.manual-options-table-body-rows');
    $rows.append(rendered);
    triggerTimePeriodOptionsChange($field);

    if (!$wrapper.hasClass('has-options')) {
      $wrapper.addClass('has-options');
    }
  });
  var rowInputs = '.time-period-options-table input[type="text"],' + ' .time-period-options-table .option_value,' + ' .time-period-options-table .difference_type,' + ' .time-period-options-table .difference_unit';
  $searchForm.on('input', rowInputs, function () {
    var $field = $(this).closest('.wcapf-form-field');
    triggerTimePeriodOptionsChange($field);
  });
  $searchForm.on('change', '.time-period-item .option_value', function () {
    var $periodOption = $(this);
    var periodOption = $periodOption.val();
    var $periodOptionItem = $periodOption.closest('.time-period-item');
    var $customPeriod = $periodOptionItem.find('.custom-time-period');

    if ('custom' === periodOption) {
      $customPeriod.slideDown();
    } else {
      $customPeriod.slideUp();
    }
  });
});
"use strict";

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
  });
}
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
  return;
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
  }); // function toggleNumberMinValueField( $elm ) {
  // 	const $field     = $elm.closest( '.wcapf-form-field' );
  // 	const $textField = $field.find( '.wcapf-form-sub-field-min_value input[type="text"]' );
  //
  // 	if ( $elm.is( ':checked' ) ) {
  // 		$textField.attr( 'disabled', 'disabled' );
  // 	} else {
  // 		$textField.removeAttr( 'disabled' );
  // 	}
  // }
  //
  // $searchForm.find( '.wcapf-form-sub-field-min_value_auto_detect input[type="checkbox"]' ).each( function() {
  // 	const $this = $( this );
  //
  // 	toggleNumberMinValueField( $this );
  // } );
  //
  // $searchForm.on( 'click', '.wcapf-form-sub-field-min_value_auto_detect input[type="checkbox"]', function() {
  // 	const $this = $( this );
  //
  // 	toggleNumberMinValueField( $this );
  // } );
  //
  // function toggleNumberMaxValueField( $elm ) {
  // 	const $field     = $elm.closest( '.wcapf-form-field' );
  // 	const $textField = $field.find( '.wcapf-form-sub-field-max_value input[type="text"]' );
  //
  // 	if ( $elm.is( ':checked' ) ) {
  // 		$textField.attr( 'disabled', 'disabled' );
  // 	} else {
  // 		$textField.removeAttr( 'disabled' );
  // 	}
  // }
  //
  // $searchForm.find( '.wcapf-form-sub-field-max_value_auto_detect input[type="checkbox"]' ).each( function() {
  // 	const $this = $( this );
  //
  // 	toggleNumberMaxValueField( $this );
  // } );
  //
  // $searchForm.on( 'click', '.wcapf-form-sub-field-max_value_auto_detect input[type="checkbox"]', function() {
  // 	const $this = $( this );
  //
  // 	toggleNumberMaxValueField( $this );
  // } );
  // Toggle soft limit fields when display type is changed.

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
 * The search form field.
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
"use strict";

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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImRhdGUtdGltZS1wZXJpb2Qtb3B0aW9ucy5qcyIsIm1hbnVhbC1vcHRpb25zLXRhYmxlLmpzIiwicG9zdC1tZXRhLW9wdGlvbnMuanMiLCJwcm9kdWN0LXN0YXR1cy1vcHRpb25zLmpzIiwic2VhcmNoLWZvcm0tZmllbGQuanMiLCJzZWFyY2gtZm9ybS5qcyIsInNvcnQtYnktb3B0aW9ucy5qcyIsInRvZ2dsZVZpc2liaWxpdHkuanMiXSwibmFtZXMiOlsialF1ZXJ5IiwiZG9jdW1lbnQiLCJyZWFkeSIsIiQiLCIkc2VhcmNoRm9ybSIsIm9uIiwiZSIsImhhbmRsZXIiLCJ2YWx1ZSIsIiRmaWVsZCIsIiRkYXRlVUlHcm91cCIsImZpbmQiLCIkdGltZVBlcmlvZEdyb3VwIiwic2hvdyIsImhpZGUiLCJ0cmlnZ2VyVGltZVBlcmlvZE9wdGlvbnNDaGFuZ2UiLCIkdmFsdWVIb2xkZXIiLCIkb3B0aW9uc1RhYmxlIiwiJHJvd3MiLCJfcm93cyIsImVhY2giLCJpIiwiX2l0ZW0iLCIkaXRlbSIsInZhbCIsImxhYmVsIiwiZGlmZmVyZW5jZV90eXBlIiwiZGlmZmVyZW5jZV9hbW91bnQiLCJkaWZmZXJlbmNlX3VuaXQiLCJwdXNoIiwicmF3VmFsdWVzIiwiZW5jb2RlVVJJQ29tcG9uZW50IiwiSlNPTiIsInN0cmluZ2lmeSIsImluaXRTb3J0YWJsZUZvclRpbWVQZXJpb2RPcHRpb25zIiwiJHNlbGVjdG9yIiwic29ydGFibGUiLCJvcGFjaXR5IiwicmV2ZXJ0IiwiY3Vyc29yIiwiYXhpcyIsImhhbmRsZSIsInBsYWNlaG9sZGVyIiwidXBkYXRlIiwidGFyZ2V0IiwiY2xvc2VzdCIsImRpc2FibGVTZWxlY3Rpb24iLCJ1aSIsIml0ZW0iLCJ0cmlnZ2VyUmVtb3ZlVGltZVBlcmlvZE9wdGlvbiIsInRhYmxlUm93cyIsImNoaWxkcmVuIiwibGVuZ3RoIiwicmVtb3ZlQ2xhc3MiLCJyZW1vdmUiLCJlbXB0eSIsImZpZWxkVHlwZSIsIm9wdGlvbnMiLCJ0ZW1wbGF0ZSIsIndwIiwicmVuZGVyZWQiLCIkd3JhcHBlciIsImFwcGVuZCIsImhhc0NsYXNzIiwiYWRkQ2xhc3MiLCJyb3dJbnB1dHMiLCIkcGVyaW9kT3B0aW9uIiwicGVyaW9kT3B0aW9uIiwiJHBlcmlvZE9wdGlvbkl0ZW0iLCIkY3VzdG9tUGVyaW9kIiwic2xpZGVEb3duIiwic2xpZGVVcCIsImluaXRNYW51YWxPcHRpb25zVGFibGUiLCJ0YWJsZUlkZW50aWZpZXIiLCJ2YWx1ZUlkZW50aWZpZXIiLCJyb3dUZW1wbGF0ZUlkIiwicm93RGVmYXVsdE9wdGlvbnMiLCJmaWVsZElkZW50aWZpZXIiLCJyb3dzSWRlbnRpZmllciIsInJvd0lkZW50aWZpZXIiLCJpbml0U29ydGFibGVUYWJsZSIsImNvbnNvbGUiLCJsb2ciLCJ0cmlnZ2VyT3B0aW9uc0NoYW5nZSIsInRhYmxlUm93c0lkZW50aWZpZXIiLCJyb3ciLCJmaWVsZEluZGV4IiwiZmllbGQiLCJ0cmlnZ2VyUmVtb3ZlT3B0aW9uIiwicmVtb3ZlQnRuSWRlbnRpZmllciIsImNsZWFyT3B0aW9uc0J0bklkZW50aWZpZXIiLCJhZGRPcHRpb25CdG5JZGVudGlmaWVyIiwiJHRhYmxlIiwidGV4dEZpZWxkc0lkZW50aWZpZXIiLCJzZWxlY3RGaWVsZHNJZGVudGlmaWVyIiwicGFyYW1zIiwid2luZG93IiwiaGllcmFyY2hpY2FsRGF0YSIsImlzSGllcmFyY2hpY2FsIiwiJGRlcGVuZGFudEZpZWxkcyIsImluaXRTb3J0YWJsZUZvck1hbnVhbE9wdGlvbnMiLCJ0cmlnZ2VyTWFudWFsT3B0aW9uc0NoYW5nZSIsIiRwb3N0TWV0YU9wdGlvbnNNb2RhbCIsIiRub0tleUZvdW5kTWVzc2FnZSIsIiRwb3N0TWV0YU1vZGFsTG9hZGVyIiwiJHBvc3RNZXRhT3B0aW9ucyIsIiRwb3N0TWV0YU1vZGFsRm9vdGVyIiwicG9zdE1ldGFPcHRpb25zTW9kYWxJbnN0YW5jZSIsInJlbW9kYWwiLCJoYXNoVHJhY2tpbmciLCIkcG9zdE1ldGFGaWVsZCIsInJlc2V0UG9zdE1ldGFNb2RhbCIsImh0bWwiLCJwcm9wIiwiJGlucHV0TWV0YUtleSIsIm1ldGFLZXkiLCJvcGVuIiwib2tDYWxsYmFjayIsInJlc3BvbnNlIiwiZXJyQ2FsbGJhY2siLCJtZXNzYWdlIiwiZm9ybURhdGEiLCJrZXkiLCJhY3Rpb24iLCJhamF4IiwicG9zdCIsImRvbmUiLCJmYWlsIiwiJG9wdGlvbnMiLCJpc1JlcGxhY2UiLCJyb3dzIiwiaXMiLCJpbnB1dCIsIiRpbnB1dCIsImNsb3NlIiwiJHNlbGVjdEVsbSIsIm9yZGVyQnkiLCJkZXBlbmRhbnRPcHRpb25zIiwiYXR0ciIsImNoYW5nZSIsInJlbW92ZUF0dHIiLCJkaXNhYmxlT3JkZXJCeU9wdGlvbnMiLCIkZWxtIiwiJG9yZGVyRGlyZWN0aW9uRmllbGQiLCIkb3JkZXJUeXBlRmllbGQiLCIkdGhpcyIsImluaXRTb3J0YWJsZUZvck51bWJlck1hbnVhbE9wdGlvbnMiLCJ0cmlnZ2VyTnVtYmVyTWFudWFsT3B0aW9uc0NoYW5nZSIsInRyaWdnZXJSZW1vdmVOdW1iZXJPcHRpb24iLCJtaW5fdmFsdWUiLCJtYXhfdmFsdWUiLCIkZ2V0T3B0aW9ucyIsIiRhdXRvT3B0aW9ucyIsIiRtYW51YWxPcHRpb25zVGFibGUiLCJkaXNwbGF5VHlwZSIsIiRzb2Z0TGltaXRGaWVsZHMiLCIkdmFsdWVUeXBlRmllbGQiLCJ2YWx1ZVR5cGUiLCJkaXNwbGF5VHlwZXMiLCJpbmNsdWRlcyIsIiRudW1iZXJEaXNwbGF5VHlwZUZpZWxkIiwibnVtYmVyRGlzcGxheVR5cGUiLCJudW1iZXJEaXNwbGF5VHlwZXMiLCIkdGV4dERpc3BsYXlUeXBlRmllbGQiLCJ0ZXh0RGlzcGxheVR5cGUiLCJ0ZXh0RGlzcGxheVR5cGVzIiwiJHZhbHVlVHlwZSIsInBvc3RQcm9wZXJ0eURhdGEiLCIkbm9SZXN1bHRzIiwiJGFsbEl0ZW1zTGFiZWwiLCJ1c2VDaG9zZW4iLCJ0b2dnbGVOdW1iZXJNaW5WYWx1ZUZpZWxkIiwiJHRleHRGaWVsZCIsInRvZ2dsZU51bWJlck1heFZhbHVlRmllbGQiLCJ0b3RhbEZpZWxkSW5zdGFuY2VzIiwic2VhcmNoRm9ybSIsInJlbW92ZVBsYWNlaG9sZGVyIiwidW5pcXVlSWQiLCJlbGVtZW50cyIsImVsZW1lbnQiLCJvbGRWYWx1ZSIsIm5ld1ZhbHVlIiwicmVwbGFjZSIsImluc2VydEZpZWxkU3ViRmllbGRzIiwidHlwZSIsInBhcnNlSW50Iiwid3JhcHBlciIsInByZXBlbmQiLCJ0cmlnZ2VyIiwidXBkYXRlRmllbGRzUG9zaXRpb24iLCJpbnB1dHMiLCJuYkVsZW1zIiwiaWR4IiwibWFrZUZpZWxkUmVhZHkiLCJ0b2dnbGVCdG4iLCJpZGVudGlmaWVyIiwiY29udGFpbmVyIiwiY2FuY2VsIiwiaXRlbXMiLCJjb25uZWN0V2l0aCIsInN0b3AiLCJzdGFydCIsImFwcGVuZFRvIiwicGFyZW50Iiwib25EcmFnU3RhcnQiLCJvbkRyYWdTdG9wIiwiZHJhZ2dhYmxlIiwiY29ubmVjdFRvU29ydGFibGUiLCJoZWxwZXIiLCJ0b2dnbGVGaWVsZCIsIndpZGdldCIsImluc2lkZSIsImlzRXhwYW5kIiwidG9nZ2xlRXhwYW5kIiwic2xpZGVUb2dnbGUiLCJ0b2dnbGVDbGFzcyIsImZvY3VzRmllbGQiLCJjbGFzc0xpc3QiLCJjb250YWlucyIsImZvY3VzIiwicmVtb3ZlRmllbGQiLCJpbml0aWFsRm9ybVN0YXRlIiwic2VyaWFsaXplQXJyYXkiLCJzaG93TWVzc2FnZSIsInNldFRpbWVvdXQiLCJzYXZlRm9ybSIsImJ1dHRvbiIsInRyaWdnZXJTb3J0QnlPcHRpb25zQ2hhbmdlIiwiZGlyZWN0aW9uIiwibWV0YV9rZXkiLCJtZXRhX3NvcnRfdHlwZSIsImluaXRTb3J0YWJsZUZvclNvcnRCeU9wdGlvbnMiLCJ0cmlnZ2VyUmVtb3ZlU29ydEJ5T3B0aW9uIiwiJHNvcnRPcHRpb24iLCJzb3J0T3B0aW9uIiwiJHNvcnRPcHRpb25JdGVtIiwiJG1ldGFEYXRhIiwiZGVwZW5kYW50RGF0YSIsIl9oYW5kbGVUb2dnbGVSZXF1ZXN0IiwiZGF0YSIsImN1cnJlbnRTZWxlY3RvciIsImhhbmRsZXJUeXBlIiwiZGVwZW5kYW50IiwiX3ZhbHVlIiwiaWQiLCJkIiwidmFsaWRWYWx1ZXMiLCJoYW5kbGVUb2dnbGVSZXF1ZXN0IiwiJGhhbmRsZXIiLCJfdGhpcyIsInNldHVwU2VhcmNoRm9ybSIsImluaXRhbCIsImV2ZW50Il0sIm1hcHBpbmdzIjoiOztBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQUEsTUFBTSxDQUFFQyxRQUFGLENBQU4sQ0FBbUJDLEtBQW5CLENBQTBCLFVBQVVDLENBQVYsRUFBYztBQUV2QyxNQUFNQyxXQUFXLEdBQUdELENBQUMsQ0FBRSxjQUFGLENBQXJCO0FBRUFDLEVBQUFBLFdBQVcsQ0FBQ0MsRUFBWixDQUFnQixzQkFBaEIsRUFBd0MsVUFBVUMsQ0FBVixFQUFhQyxPQUFiLEVBQXNCQyxLQUF0QixFQUE2QkMsTUFBN0IsRUFBc0M7QUFDN0UsUUFBSyxxREFBcURGLE9BQTFELEVBQW9FO0FBQ25FLFVBQU1HLFlBQVksR0FBT0QsTUFBTSxDQUFDRSxJQUFQLENBQWEsZ0JBQWIsQ0FBekI7QUFDQSxVQUFNQyxnQkFBZ0IsR0FBR0gsTUFBTSxDQUFDRSxJQUFQLENBQWEsb0JBQWIsQ0FBekI7O0FBRUEsVUFBSyxpQkFBaUJILEtBQWpCLElBQTBCLHVCQUF1QkEsS0FBdEQsRUFBOEQ7QUFDN0RFLFFBQUFBLFlBQVksQ0FBQ0csSUFBYjtBQUNBRCxRQUFBQSxnQkFBZ0IsQ0FBQ0UsSUFBakI7QUFDQSxPQUhELE1BR087QUFDTkosUUFBQUEsWUFBWSxDQUFDSSxJQUFiO0FBQ0FGLFFBQUFBLGdCQUFnQixDQUFDQyxJQUFqQjtBQUNBO0FBQ0Q7QUFDRCxHQWJEOztBQWVBLFdBQVNFLDhCQUFULENBQXlDTixNQUF6QyxFQUFrRDtBQUNqRCxRQUFNTyxZQUFZLEdBQUlQLE1BQU0sQ0FBQ0UsSUFBUCxDQUFhLGlEQUFiLENBQXRCO0FBQ0EsUUFBTU0sYUFBYSxHQUFHUixNQUFNLENBQUNFLElBQVAsQ0FBYSw0QkFBYixDQUF0QjtBQUNB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UixFQUFlTixNQUFmLENBQW5CO0FBQ0EsU0FKRDtBQUtBO0FBQ0QsS0FiRDtBQWNBOztBQUVETyxFQUFBQSxlQUFlLENBQUUsSUFBRixDQUFmO0FBRUF0UCxFQUFBQSxXQUFXLENBQUNDLEVBQVosQ0FBZ0IsYUFBaEIsRUFBK0IsWUFBVztBQUN6QztBQUNBcVAsSUFBQUEsZUFBZTtBQUNmLEdBSEQ7QUFLQSxDQXhQRCIsImZpbGUiOiJ3Yy1hamF4LXByb2R1Y3QtZmlsdGVyLWFkbWluLXNjcmlwdHMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIFRoZSB0aW1lIHNpbmNlIG9wdGlvbnMgb2YgZGF0ZSBmaWVsZC5cbiAqXG4gKiBAc2luY2UgICAgICAzLjAuMFxuICogQHBhY2thZ2UgICAgd2MtYWpheC1wcm9kdWN0LWZpbHRlclxuICogQHN1YnBhY2thZ2Ugd2MtYWpheC1wcm9kdWN0LWZpbHRlci9hZG1pbi9zcmMvanNcbiAqIEBhdXRob3IgICAgIE1haW51bCBIYXNzYW4gTWFpblxuICovXG5cbmpRdWVyeSggZG9jdW1lbnQgKS5yZWFkeSggZnVuY3Rpb24oICQgKSB7XG5cblx0Y29uc3QgJHNlYXJjaEZvcm0gPSAkKCAnI3NlYXJjaC1mb3JtJyApO1xuXG5cdCRzZWFyY2hGb3JtLm9uKCAnYWZ0ZXJfdG9nZ2xlX3JlcXVlc3QnLCBmdW5jdGlvbiggZSwgaGFuZGxlciwgdmFsdWUsICRmaWVsZCApIHtcblx0XHRpZiAoICcud2NhcGYtZm9ybS1zdWItZmllbGQtZGF0ZV9kaXNwbGF5X3R5cGUgc2VsZWN0JyA9PT0gaGFuZGxlciApIHtcblx0XHRcdGNvbnN0ICRkYXRlVUlHcm91cCAgICAgPSAkZmllbGQuZmluZCggJy5kYXRlLXVpLWdyb3VwJyApO1xuXHRcdFx0Y29uc3QgJHRpbWVQZXJpb2RHcm91cCA9ICRmaWVsZC5maW5kKCAnLnRpbWUtcGVyaW9kLWdyb3VwJyApO1xuXG5cdFx0XHRpZiAoICdpbnB1dF9kYXRlJyA9PT0gdmFsdWUgfHwgJ2lucHV0X2RhdGVfcmFuZ2UnID09PSB2YWx1ZSApIHtcblx0XHRcdFx0JGRhdGVVSUdyb3VwLnNob3coKTtcblx0XHRcdFx0JHRpbWVQZXJpb2RHcm91cC5oaWRlKCk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHQkZGF0ZVVJR3JvdXAuaGlkZSgpO1xuXHRcdFx0XHQkdGltZVBlcmlvZEdyb3VwLnNob3coKTtcblx0XHRcdH1cblx0XHR9XG5cdH0gKTtcblxuXHRmdW5jdGlvbiB0cmlnZ2VyVGltZVBlcmlvZE9wdGlvbnNDaGFuZ2UoICRmaWVsZCApIHtcblx0XHRjb25zdCAkdmFsdWVIb2xkZXIgID0gJGZpZWxkLmZpbmQoICcud2NhcGYtZm9ybS1zdWItZmllbGQtdGltZV9wZXJpb2Rfb3B0aW9ucyBpbnB1dCcgKTtcblx0XHRjb25zdCAkb3B0aW9uc1RhYmxlID0gJGZpZWxkLmZpbmQoICcudGltZS1wZXJpb2Qtb3B0aW9ucy10YWJsZScgKTtcblx0XHRjb25zdCAkcm93cyAgICAgICAgID0gJG9wdGlvbnNUYWJsZS5maW5kKCAnLm1hbnVhbC1vcHRpb25zLXRhYmxlLWJvZHktcm93cycgKTtcblx0XHRjb25zdCBfcm93cyAgICAgICAgID0gW107XG5cblx0XHQkcm93cy5maW5kKCAnLnRpbWUtcGVyaW9kLWl0ZW0nICkuZWFjaCggZnVuY3Rpb24oIGksIF9pdGVtICkge1xuXHRcdFx0Y29uc3QgJGl0ZW0gICAgICAgICAgICAgPSAkKCBfaXRlbSApO1xuXHRcdFx0Y29uc3QgdmFsdWUgICAgICAgICAgICAgPSAkaXRlbS5maW5kKCAnLm9wdGlvbl92YWx1ZScgKS52YWwoKTtcblx0XHRcdGNvbnN0IGxhYmVsICAgICAgICAgICAgID0gJGl0ZW0uZmluZCggJy5vcHRpb25fbGFiZWwnICkudmFsKCk7XG5cdFx0XHRjb25zdCBkaWZmZXJlbmNlX3R5cGUgICA9ICRpdGVtLmZpbmQoICcuZGlmZmVyZW5jZV90eXBlJyApLnZhbCgpO1xuXHRcdFx0Y29uc3QgZGlmZmVyZW5jZV9hbW91bnQgPSAkaXRlbS5maW5kKCAnLmRpZmZlcmVuY2VfYW1vdW50JyApLnZhbCgpO1xuXHRcdFx0Y29uc3QgZGlmZmVyZW5jZV91bml0ICAgPSAkaXRlbS5maW5kKCAnLmRpZmZlcmVuY2VfdW5pdCcgKS52YWwoKTtcblxuXHRcdFx0aWYgKCB2YWx1ZSApIHtcblx0XHRcdFx0X3Jvd3MucHVzaCggWyB2YWx1ZSwgbGFiZWwsIGRpZmZlcmVuY2VfdHlwZSwgZGlmZmVyZW5jZV9hbW91bnQsIGRpZmZlcmVuY2VfdW5pdCBdICk7XG5cdFx0XHR9XG5cdFx0fSApO1xuXG5cdFx0Y29uc3QgcmF3VmFsdWVzID0gZW5jb2RlVVJJQ29tcG9uZW50KCBKU09OLnN0cmluZ2lmeSggX3Jvd3MgKSApO1xuXHRcdCR2YWx1ZUhvbGRlci52YWwoIHJhd1ZhbHVlcyApO1xuXHR9XG5cblx0ZnVuY3Rpb24gaW5pdFNvcnRhYmxlRm9yVGltZVBlcmlvZE9wdGlvbnMoICRzZWxlY3RvciApIHtcblx0XHQkc2VsZWN0b3Iuc29ydGFibGUoIHtcblx0XHRcdG9wYWNpdHk6IDAuOCxcblx0XHRcdHJldmVydDogZmFsc2UsXG5cdFx0XHRjdXJzb3I6ICdtb3ZlJyxcblx0XHRcdGF4aXM6ICd5Jyxcblx0XHRcdGhhbmRsZTogJy5tb3ZlLW9wdGlvbnMtaGFuZGxlcicsXG5cdFx0XHRwbGFjZWhvbGRlcjogJ3dpZGdldC1wbGFjZWhvbGRlcicsXG5cdFx0XHR1cGRhdGU6IGZ1bmN0aW9uKCBlICkge1xuXHRcdFx0XHRjb25zdCAkZmllbGQgPSAkKCBlLnRhcmdldCApLmNsb3Nlc3QoICcud2NhcGYtZm9ybS1maWVsZCcgKTtcblxuXHRcdFx0XHR0cmlnZ2VyVGltZVBlcmlvZE9wdGlvbnNDaGFuZ2UoICRmaWVsZCApO1xuXHRcdFx0fVxuXHRcdH0gKS5kaXNhYmxlU2VsZWN0aW9uKCk7XG5cdH1cblxuXHQvLyBTb3J0IE1hbnVhbCBPcHRpb25zXG5cdGluaXRTb3J0YWJsZUZvclRpbWVQZXJpb2RPcHRpb25zKCAkc2VhcmNoRm9ybS5maW5kKCAnLnRpbWUtcGVyaW9kLW9wdGlvbnMtdGFibGUgLm1hbnVhbC1vcHRpb25zLXRhYmxlLWJvZHktcm93cycgKSApO1xuXG5cdCRzZWFyY2hGb3JtLm9uKCAnZmllbGRfYWRkZWQnLCBmdW5jdGlvbiggZSwgdWkgKSB7XG5cdFx0Ly8gSW5pdCBTb3J0YWJsZSBmb3IgdGhlIG1hbnVhbCBvcHRpb25zLlxuXHRcdGluaXRTb3J0YWJsZUZvclRpbWVQZXJpb2RPcHRpb25zKCAkKCB1aS5pdGVtLmZpbmQoICcubWFudWFsLW9wdGlvbnMtdGFibGUtYm9keS1yb3dzJyApICkgKTtcblx0fSApO1xuXG5cdGZ1bmN0aW9uIHRyaWdnZXJSZW1vdmVUaW1lUGVyaW9kT3B0aW9uKCAkZmllbGQgKSB7XG5cdFx0Y29uc3QgJG9wdGlvbnNUYWJsZSA9ICRmaWVsZC5maW5kKCAnLnRpbWUtcGVyaW9kLW9wdGlvbnMtdGFibGUnICk7XG5cdFx0Y29uc3QgdGFibGVSb3dzICAgICA9ICRvcHRpb25zVGFibGUuZmluZCggJy5tYW51YWwtb3B0aW9ucy10YWJsZS1ib2R5LXJvd3MnICkuY2hpbGRyZW4oKTtcblxuXHRcdGlmICggMiA+IHRhYmxlUm93cy5sZW5ndGggKSB7XG5cdFx0XHQkb3B0aW9uc1RhYmxlLnJlbW92ZUNsYXNzKCAnaGFzLW9wdGlvbnMnICk7XG5cdFx0fVxuXHR9XG5cblx0Ly8gUmVtb3ZlIFNpbmdsZSBOdW1iZXIgT3B0aW9uXG5cdCRzZWFyY2hGb3JtLm9uKCAnY2xpY2snLCAnLnJlbW92ZS10aW1lLXBlcmlvZC1vcHRpb24nLCBmdW5jdGlvbigpIHtcblx0XHRjb25zdCAkaXRlbSAgPSAkKCB0aGlzICkuY2xvc2VzdCggJy50aW1lLXBlcmlvZC1pdGVtJyApO1xuXHRcdGNvbnN0ICRmaWVsZCA9ICRpdGVtLmNsb3Nlc3QoICcud2NhcGYtZm9ybS1maWVsZCcgKTtcblxuXHRcdHRyaWdnZXJSZW1vdmVUaW1lUGVyaW9kT3B0aW9uKCAkZmllbGQgKTtcblxuXHRcdCRpdGVtLnJlbW92ZSgpO1xuXG5cdFx0dHJpZ2dlclRpbWVQZXJpb2RPcHRpb25zQ2hhbmdlKCAkZmllbGQgKTtcblx0fSApO1xuXG5cdC8vIENsZWFyIEFsbCBPcHRpb25zXG5cdCRzZWFyY2hGb3JtLm9uKCAnY2xpY2snLCAnLmNsZWFyLWFsbC10aW1lLXBlcmlvZC1vcHRpb25zJywgZnVuY3Rpb24oKSB7XG5cdFx0Y29uc3QgJGZpZWxkICAgICAgICA9ICQoIHRoaXMgKS5jbG9zZXN0KCAnLndjYXBmLWZvcm0tZmllbGQnICk7XG5cdFx0Y29uc3QgJG9wdGlvbnNUYWJsZSA9ICRmaWVsZC5maW5kKCAnLnRpbWUtcGVyaW9kLW9wdGlvbnMtdGFibGUnICk7XG5cblx0XHQkb3B0aW9uc1RhYmxlLmZpbmQoICcubWFudWFsLW9wdGlvbnMtdGFibGUtYm9keS1yb3dzJyApLmVtcHR5KCk7XG5cblx0XHR0cmlnZ2VyUmVtb3ZlVGltZVBlcmlvZE9wdGlvbiggJGZpZWxkICk7XG5cblx0XHR0cmlnZ2VyVGltZVBlcmlvZE9wdGlvbnNDaGFuZ2UoICRmaWVsZCApO1xuXHR9ICk7XG5cblx0Ly8gQWRkIE5ldyBPcHRpb25cblx0JHNlYXJjaEZvcm0ub24oICdjbGljaycsICcuYWRkLXRpbWUtcGVyaW9kLW9wdGlvbicsIGZ1bmN0aW9uKCkge1xuXHRcdGNvbnN0IGZpZWxkVHlwZSA9ICd3Y2FwZi10aW1lLXBlcmlvZC1vcHRpb24nO1xuXG5cdFx0Ly8gQmFpbCBvdXQgaWYgbm8gdG1wbCBmb3VuZCBmb3IgdGhlIHR5cGUuXG5cdFx0aWYgKCAhIGpRdWVyeSggJyN0bXBsLScgKyBmaWVsZFR5cGUgKS5sZW5ndGggKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0Y29uc3QgJGZpZWxkID0gJCggdGhpcyApLmNsb3Nlc3QoICcud2NhcGYtZm9ybS1maWVsZCcgKTtcblxuXHRcdGNvbnN0IG9wdGlvbnMgPSB7XG5cdFx0XHR2YWx1ZTogJycsXG5cdFx0XHRsYWJlbDogJycsXG5cdFx0XHRkaWZmZXJlbmNlX3R5cGU6ICcnLFxuXHRcdFx0ZGlmZmVyZW5jZV9hbW91bnQ6ICcxJyxcblx0XHRcdGRpZmZlcmVuY2VfdW5pdDogJycsXG5cdFx0fTtcblxuXHRcdGNvbnN0IHRlbXBsYXRlID0gd3AudGVtcGxhdGUoIGZpZWxkVHlwZSApO1xuXHRcdGNvbnN0IHJlbmRlcmVkID0gdGVtcGxhdGUoIG9wdGlvbnMgKTtcblx0XHRjb25zdCAkd3JhcHBlciA9ICRmaWVsZC5maW5kKCAnLnRpbWUtcGVyaW9kLW9wdGlvbnMtdGFibGUnICk7XG5cdFx0Y29uc3QgJHJvd3MgICAgPSAkd3JhcHBlci5maW5kKCAnLm1hbnVhbC1vcHRpb25zLXRhYmxlLWJvZHktcm93cycgKTtcblxuXHRcdCRyb3dzLmFwcGVuZCggcmVuZGVyZWQgKTtcblxuXHRcdHRyaWdnZXJUaW1lUGVyaW9kT3B0aW9uc0NoYW5nZSggJGZpZWxkICk7XG5cblx0XHRpZiAoICEgJHdyYXBwZXIuaGFzQ2xhc3MoICdoYXMtb3B0aW9ucycgKSApIHtcblx0XHRcdCR3cmFwcGVyLmFkZENsYXNzKCAnaGFzLW9wdGlvbnMnICk7XG5cdFx0fVxuXHR9ICk7XG5cblx0Y29uc3Qgcm93SW5wdXRzID0gJy50aW1lLXBlcmlvZC1vcHRpb25zLXRhYmxlIGlucHV0W3R5cGU9XCJ0ZXh0XCJdLCcgK1xuXHRcdCcgLnRpbWUtcGVyaW9kLW9wdGlvbnMtdGFibGUgLm9wdGlvbl92YWx1ZSwnICtcblx0XHQnIC50aW1lLXBlcmlvZC1vcHRpb25zLXRhYmxlIC5kaWZmZXJlbmNlX3R5cGUsJyArXG5cdFx0JyAudGltZS1wZXJpb2Qtb3B0aW9ucy10YWJsZSAuZGlmZmVyZW5jZV91bml0JztcblxuXHQkc2VhcmNoRm9ybS5vbiggJ2lucHV0Jywgcm93SW5wdXRzLCBmdW5jdGlvbigpIHtcblx0XHRjb25zdCAkZmllbGQgPSAkKCB0aGlzICkuY2xvc2VzdCggJy53Y2FwZi1mb3JtLWZpZWxkJyApO1xuXG5cdFx0dHJpZ2dlclRpbWVQZXJpb2RPcHRpb25zQ2hhbmdlKCAkZmllbGQgKTtcblx0fSApO1xuXG5cdCRzZWFyY2hGb3JtLm9uKCAnY2hhbmdlJywgJy50aW1lLXBlcmlvZC1pdGVtIC5vcHRpb25fdmFsdWUnLCBmdW5jdGlvbigpIHtcblx0XHRjb25zdCAkcGVyaW9kT3B0aW9uICAgICA9ICQoIHRoaXMgKTtcblx0XHRjb25zdCBwZXJpb2RPcHRpb24gICAgICA9ICRwZXJpb2RPcHRpb24udmFsKCk7XG5cdFx0Y29uc3QgJHBlcmlvZE9wdGlvbkl0ZW0gPSAkcGVyaW9kT3B0aW9uLmNsb3Nlc3QoICcudGltZS1wZXJpb2QtaXRlbScgKTtcblx0XHRjb25zdCAkY3VzdG9tUGVyaW9kICAgICA9ICRwZXJpb2RPcHRpb25JdGVtLmZpbmQoICcuY3VzdG9tLXRpbWUtcGVyaW9kJyApO1xuXG5cdFx0aWYgKCAnY3VzdG9tJyA9PT0gcGVyaW9kT3B0aW9uICkge1xuXHRcdFx0JGN1c3RvbVBlcmlvZC5zbGlkZURvd24oKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0JGN1c3RvbVBlcmlvZC5zbGlkZVVwKCk7XG5cdFx0fVxuXHR9ICk7XG5cbn0gKTtcbiIsImZ1bmN0aW9uIGluaXRNYW51YWxPcHRpb25zVGFibGUoIHRhYmxlSWRlbnRpZmllciwgdmFsdWVJZGVudGlmaWVyLCByb3dUZW1wbGF0ZUlkLCByb3dEZWZhdWx0T3B0aW9ucyApIHtcblx0Y29uc3QgJCA9IGpRdWVyeTtcblxuXHRjb25zdCAkc2VhcmNoRm9ybSA9ICQoICcjc2VhcmNoLWZvcm0nICk7XG5cblx0Y29uc3QgZmllbGRJZGVudGlmaWVyID0gJy53Y2FwZi1mb3JtLWZpZWxkJztcblx0Y29uc3Qgcm93c0lkZW50aWZpZXIgID0gJy5maWVsZC10YWJsZS1ib2R5LXJvd3MnO1xuXHRjb25zdCByb3dJZGVudGlmaWVyICAgPSAnLnJvdy1pdGVtJztcblxuXHRmdW5jdGlvbiBpbml0U29ydGFibGVUYWJsZSggJHNlbGVjdG9yICkge1xuXHRcdGNvbnNvbGUubG9nKCAndXBkYXRlIGNhbGxlZCBmb3InLCAkc2VsZWN0b3IgKTtcblxuXHRcdCRzZWxlY3Rvci5zb3J0YWJsZSgge1xuXHRcdFx0b3BhY2l0eTogMC44LFxuXHRcdFx0cmV2ZXJ0OiBmYWxzZSxcblx0XHRcdGN1cnNvcjogJ21vdmUnLFxuXHRcdFx0YXhpczogJ3knLFxuXHRcdFx0aGFuZGxlOiAnLm1vdmUtb3B0aW9ucy1oYW5kbGVyJyxcblx0XHRcdHBsYWNlaG9sZGVyOiAnd2lkZ2V0LXBsYWNlaG9sZGVyJyxcblx0XHRcdHVwZGF0ZTogZnVuY3Rpb24oIGUgKSB7XG5cdFx0XHRcdGNvbnN0ICRmaWVsZCA9ICQoIGUudGFyZ2V0ICkuY2xvc2VzdCggJy53Y2FwZi1mb3JtLWZpZWxkJyApO1xuXG5cdFx0XHRcdHRyaWdnZXJPcHRpb25zQ2hhbmdlKCAkZmllbGQgKTtcblx0XHRcdH1cblx0XHR9ICkuZGlzYWJsZVNlbGVjdGlvbigpO1xuXHR9XG5cblx0Y29uc3QgdGFibGVSb3dzSWRlbnRpZmllciA9IHRhYmxlSWRlbnRpZmllciArICcgJyArIHJvd3NJZGVudGlmaWVyO1xuXG5cdC8vIEluaXQgdGhlIHNvcnRhYmxlIHRhYmxlIGFmdGVyIHBhZ2UgbG9hZHMuXG5cdGluaXRTb3J0YWJsZVRhYmxlKCAkc2VhcmNoRm9ybS5maW5kKCB0YWJsZVJvd3NJZGVudGlmaWVyICkgKTtcblxuXHQvLyBJbml0IHRoZSBzb3J0YWJsZSB0YWJsZSBhZnRlciB0aGUgZmllbGQgaXMgYWRkZWQuXG5cdCRzZWFyY2hGb3JtLm9uKCAnZmllbGRfYWRkZWQnLCBmdW5jdGlvbiggZSwgdWkgKSB7XG5cdFx0aW5pdFNvcnRhYmxlVGFibGUoICQoIHVpLml0ZW0uZmluZCggdGFibGVSb3dzSWRlbnRpZmllciApICkgKTtcblx0fSApO1xuXG5cdGZ1bmN0aW9uIHRyaWdnZXJPcHRpb25zQ2hhbmdlKCAkZmllbGQgKSB7XG5cdFx0Y29uc3QgJHZhbHVlSG9sZGVyID0gJGZpZWxkLmZpbmQoIHZhbHVlSWRlbnRpZmllciApO1xuXHRcdGNvbnN0ICRyb3dzICAgICAgICA9ICRmaWVsZC5maW5kKCB0YWJsZVJvd3NJZGVudGlmaWVyICk7XG5cdFx0Y29uc3QgX3Jvd3MgICAgICAgID0gW107XG5cblx0XHQkcm93cy5maW5kKCAnLnJvdy1pdGVtJyApLmVhY2goIGZ1bmN0aW9uKCBpLCBfaXRlbSApIHtcblx0XHRcdGNvbnN0ICRpdGVtID0gJCggX2l0ZW0gKTtcblx0XHRcdGNvbnN0IHJvdyAgID0gW107XG5cblx0XHRcdCRpdGVtLmZpbmQoICdbZGF0YS1uYW1lXScgKS5lYWNoKCBmdW5jdGlvbiggZmllbGRJbmRleCwgZmllbGQgKSB7XG5cdFx0XHRcdGNvbnN0ICRmaWVsZCA9ICQoIGZpZWxkICk7XG5cblx0XHRcdFx0cm93LnB1c2goICRmaWVsZC52YWwoKSApO1xuXHRcdFx0fSApO1xuXG5cdFx0XHRfcm93cy5wdXNoKCByb3cgKTtcblx0XHR9ICk7XG5cblx0XHRjb25zdCByYXdWYWx1ZXMgPSBlbmNvZGVVUklDb21wb25lbnQoIEpTT04uc3RyaW5naWZ5KCBfcm93cyApICk7XG5cdFx0JHZhbHVlSG9sZGVyLnZhbCggcmF3VmFsdWVzICk7XG5cdH1cblxuXHRmdW5jdGlvbiB0cmlnZ2VyUmVtb3ZlT3B0aW9uKCAkZmllbGQgKSB7XG5cdFx0Y29uc3QgJG9wdGlvbnNUYWJsZSA9ICRmaWVsZC5maW5kKCB0YWJsZUlkZW50aWZpZXIgKTtcblx0XHRjb25zdCB0YWJsZVJvd3MgICAgID0gJGZpZWxkLmZpbmQoIHRhYmxlUm93c0lkZW50aWZpZXIgKS5jaGlsZHJlbigpO1xuXG5cdFx0aWYgKCAyID4gdGFibGVSb3dzLmxlbmd0aCApIHtcblx0XHRcdCRvcHRpb25zVGFibGUucmVtb3ZlQ2xhc3MoICdoYXMtb3B0aW9ucycgKTtcblx0XHR9XG5cdH1cblxuXHQvLyBSZW1vdmUgT3B0aW9uXG5cdGNvbnN0IHJlbW92ZUJ0bklkZW50aWZpZXIgPSB0YWJsZUlkZW50aWZpZXIgKyAnIC5yZW1vdmUtb3B0aW9uJztcblxuXHQkc2VhcmNoRm9ybS5vbiggJ2NsaWNrJywgcmVtb3ZlQnRuSWRlbnRpZmllciwgZnVuY3Rpb24oKSB7XG5cdFx0Y29uc3QgJGl0ZW0gID0gJCggdGhpcyApLmNsb3Nlc3QoIHJvd0lkZW50aWZpZXIgKTtcblx0XHRjb25zdCAkZmllbGQgPSAkaXRlbS5jbG9zZXN0KCBmaWVsZElkZW50aWZpZXIgKTtcblxuXHRcdHRyaWdnZXJSZW1vdmVPcHRpb24oICRmaWVsZCApO1xuXG5cdFx0JGl0ZW0ucmVtb3ZlKCk7XG5cblx0XHR0cmlnZ2VyT3B0aW9uc0NoYW5nZSggJGZpZWxkICk7XG5cdH0gKTtcblxuXHQvLyBDbGVhciBBbGwgT3B0aW9uc1xuXHRjb25zdCBjbGVhck9wdGlvbnNCdG5JZGVudGlmaWVyID0gdGFibGVJZGVudGlmaWVyICsgJyAuY2xlYXItb3B0aW9ucyc7XG5cblx0JHNlYXJjaEZvcm0ub24oICdjbGljaycsIGNsZWFyT3B0aW9uc0J0bklkZW50aWZpZXIsIGZ1bmN0aW9uKCkge1xuXHRcdGNvbnN0ICRmaWVsZCA9ICQoIHRoaXMgKS5jbG9zZXN0KCBmaWVsZElkZW50aWZpZXIgKTtcblxuXHRcdCRmaWVsZC5maW5kKCB0YWJsZVJvd3NJZGVudGlmaWVyICkuZW1wdHkoKTtcblxuXHRcdHRyaWdnZXJSZW1vdmVPcHRpb24oICRmaWVsZCApO1xuXHRcdHRyaWdnZXJPcHRpb25zQ2hhbmdlKCAkZmllbGQgKTtcblx0fSApO1xuXG5cdC8vIEFkZCBOZXcgT3B0aW9uXG5cdGNvbnN0IGFkZE9wdGlvbkJ0bklkZW50aWZpZXIgPSB0YWJsZUlkZW50aWZpZXIgKyAnIC5hZGQtb3B0aW9uJztcblxuXHQkc2VhcmNoRm9ybS5vbiggJ2NsaWNrJywgYWRkT3B0aW9uQnRuSWRlbnRpZmllciwgZnVuY3Rpb24oKSB7XG5cdFx0Ly8gQmFpbCBvdXQgaWYgbm8gdG1wbCBmb3VuZCBmb3IgdGhlIHR5cGUuXG5cdFx0aWYgKCAhIGpRdWVyeSggJyN0bXBsLScgKyByb3dUZW1wbGF0ZUlkICkubGVuZ3RoICkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdGNvbnN0ICRmaWVsZCA9ICQoIHRoaXMgKS5jbG9zZXN0KCBmaWVsZElkZW50aWZpZXIgKTtcblxuXHRcdGNvbnN0IHRlbXBsYXRlID0gd3AudGVtcGxhdGUoIHJvd1RlbXBsYXRlSWQgKTtcblx0XHRjb25zdCByZW5kZXJlZCA9IHRlbXBsYXRlKCByb3dEZWZhdWx0T3B0aW9ucyApO1xuXHRcdGNvbnN0ICR0YWJsZSAgID0gJGZpZWxkLmZpbmQoIHRhYmxlSWRlbnRpZmllciApO1xuXHRcdGNvbnN0ICRyb3dzICAgID0gJGZpZWxkLmZpbmQoIHRhYmxlUm93c0lkZW50aWZpZXIgKTtcblxuXHRcdCRyb3dzLmFwcGVuZCggcmVuZGVyZWQgKTtcblxuXHRcdHRyaWdnZXJPcHRpb25zQ2hhbmdlKCAkZmllbGQgKTtcblxuXHRcdGlmICggISAkdGFibGUuaGFzQ2xhc3MoICdoYXMtb3B0aW9ucycgKSApIHtcblx0XHRcdCR0YWJsZS5hZGRDbGFzcyggJ2hhcy1vcHRpb25zJyApO1xuXHRcdH1cblx0fSApO1xuXG5cdC8vIFRyaWdnZXIgb3B0aW9ucyBjaGFuZ2Ugd2hlbiB0aGUgdGV4dCBmaWVsZHMgZ2V0IGNoYW5nZWQuXG5cdGNvbnN0IHRleHRGaWVsZHNJZGVudGlmaWVyID0gdGFibGVSb3dzSWRlbnRpZmllciArICcgaW5wdXRbdHlwZT1cInRleHRcIl0nO1xuXG5cdCRzZWFyY2hGb3JtLm9uKCAnaW5wdXQnLCB0ZXh0RmllbGRzSWRlbnRpZmllciwgZnVuY3Rpb24oKSB7XG5cdFx0Y29uc3QgJGZpZWxkID0gJCggdGhpcyApLmNsb3Nlc3QoIGZpZWxkSWRlbnRpZmllciApO1xuXG5cdFx0dHJpZ2dlck9wdGlvbnNDaGFuZ2UoICRmaWVsZCApO1xuXHR9ICk7XG5cblx0Ly8gVHJpZ2dlciBvcHRpb25zIGNoYW5nZSB3aGVuIHRoZSBzZWxlY3QgZmllbGRzIGdldCBjaGFuZ2VkLlxuXHRsZXQgc2VsZWN0RmllbGRzSWRlbnRpZmllciA9IHRhYmxlUm93c0lkZW50aWZpZXIgKyAnIHNlbGVjdCc7XG5cblx0JHNlYXJjaEZvcm0ub24oICdjaGFuZ2UnLCBzZWxlY3RGaWVsZHNJZGVudGlmaWVyLCBmdW5jdGlvbigpIHtcblx0XHRjb25zdCAkZmllbGQgPSAkKCB0aGlzICkuY2xvc2VzdCggZmllbGRJZGVudGlmaWVyICk7XG5cblx0XHR0cmlnZ2VyT3B0aW9uc0NoYW5nZSggJGZpZWxkICk7XG5cdH0gKTtcblxufVxuIiwiLyoqXG4gKiBUaGUgcG9zdCBtZXRhIGZpZWxkLlxuICpcbiAqIEBzaW5jZSAgICAgIDEuMC4wXG4gKiBAcGFja2FnZSAgICB3Yy1hamF4LXByb2R1Y3QtZmlsdGVyLXByb1xuICogQHN1YnBhY2thZ2Ugd2MtYWpheC1wcm9kdWN0LWZpbHRlci1wcm8vYWRtaW4vc3JjL2pzXG4gKiBAYXV0aG9yICAgICBNYWludWwgSGFzc2FuIE1haW5cbiAqL1xuXG5qUXVlcnkoIGRvY3VtZW50ICkucmVhZHkoIGZ1bmN0aW9uKCAkICkge1xuXG5cdGNvbnN0ICRzZWFyY2hGb3JtID0gJCggJyNzZWFyY2gtZm9ybScgKTtcblxuXHRyZXR1cm47XG5cblx0JHNlYXJjaEZvcm0ub24oICdhZnRlcl90b2dnbGVfcmVxdWVzdCcsIGZ1bmN0aW9uKCBlLCBoYW5kbGVyLCB2YWx1ZSwgJGZpZWxkICkge1xuXHRcdGlmICggJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1jdXN0b20tdGF4b25vbXkgc2VsZWN0JyA9PT0gaGFuZGxlciApIHtcblx0XHRcdGNvbnN0IHBhcmFtcyAgICAgICAgICAgPSB3aW5kb3dbICd3Y2FwZl9hZG1pbl9wYXJhbXMnIF07XG5cdFx0XHRjb25zdCBoaWVyYXJjaGljYWxEYXRhID0gcGFyYW1zWyAndGF4b25vbXlfaGllcmFyY2hpY2FsX2RhdGEnIF07XG5cblx0XHRcdGlmICggISBoaWVyYXJjaGljYWxEYXRhICkge1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdGNvbnN0IGlzSGllcmFyY2hpY2FsICAgPSBoaWVyYXJjaGljYWxEYXRhWyB2YWx1ZSBdO1xuXHRcdFx0Y29uc3QgJGRlcGVuZGFudEZpZWxkcyA9ICRmaWVsZC5maW5kKFxuXHRcdFx0XHQnLndjYXBmLWZvcm0tc3ViLWZpZWxkLWhpZXJhcmNoaWNhbCwgLndjYXBmLWZvcm0tc3ViLWZpZWxkLXNob3dfY2hpbGRyZW5fb25seSdcblx0XHRcdCk7XG5cblx0XHRcdGlmICggaXNIaWVyYXJjaGljYWwgKSB7XG5cdFx0XHRcdCRkZXBlbmRhbnRGaWVsZHMuc2hvdygpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0JGRlcGVuZGFudEZpZWxkcy5oaWRlKCk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9ICk7XG5cblx0ZnVuY3Rpb24gaW5pdFNvcnRhYmxlRm9yTWFudWFsT3B0aW9ucyggJHNlbGVjdG9yICkge1xuXHRcdCRzZWxlY3Rvci5zb3J0YWJsZSgge1xuXHRcdFx0b3BhY2l0eTogMC44LFxuXHRcdFx0cmV2ZXJ0OiBmYWxzZSxcblx0XHRcdGN1cnNvcjogJ21vdmUnLFxuXHRcdFx0YXhpczogJ3knLFxuXHRcdFx0aGFuZGxlOiAnLm1vdmUtb3B0aW9ucy1oYW5kbGVyJyxcblx0XHRcdHBsYWNlaG9sZGVyOiAnd2lkZ2V0LXBsYWNlaG9sZGVyJyxcblx0XHRcdHVwZGF0ZTogZnVuY3Rpb24oIGUgKSB7XG5cdFx0XHRcdGNvbnN0ICRmaWVsZCA9ICQoIGUudGFyZ2V0ICkuY2xvc2VzdCggJy53Y2FwZi1mb3JtLWZpZWxkJyApO1xuXG5cdFx0XHRcdHRyaWdnZXJNYW51YWxPcHRpb25zQ2hhbmdlKCAkZmllbGQgKTtcblx0XHRcdH1cblx0XHR9ICkuZGlzYWJsZVNlbGVjdGlvbigpO1xuXHR9XG5cblx0Ly8gU29ydCBNYW51YWwgT3B0aW9uc1xuXHRpbml0U29ydGFibGVGb3JNYW51YWxPcHRpb25zKCAkc2VhcmNoRm9ybS5maW5kKCAnLm1hbnVhbC1vcHRpb25zLXRhYmxlIC5tYW51YWwtb3B0aW9ucy10YWJsZS1ib2R5LXJvd3MnICkgKTtcblxuXHQkc2VhcmNoRm9ybS5vbiggJ2ZpZWxkX2FkZGVkJywgZnVuY3Rpb24oIGUsIHVpICkge1xuXHRcdC8vIEluaXQgU29ydGFibGUgZm9yIHRoZSBtYW51YWwgb3B0aW9ucy5cblx0XHRpbml0U29ydGFibGVGb3JNYW51YWxPcHRpb25zKCAkKCB1aS5pdGVtLmZpbmQoICcubWFudWFsLW9wdGlvbnMtdGFibGUtYm9keS1yb3dzJyApICkgKTtcblx0fSApO1xuXG5cdGZ1bmN0aW9uIHRyaWdnZXJSZW1vdmVPcHRpb24oICRmaWVsZCApIHtcblx0XHRjb25zdCAkb3B0aW9uc1RhYmxlID0gJGZpZWxkLmZpbmQoICcubWFudWFsLW9wdGlvbnMtdGFibGUnICk7XG5cdFx0Y29uc3QgdGFibGVSb3dzICAgICA9ICRvcHRpb25zVGFibGUuZmluZCggJy5tYW51YWwtb3B0aW9ucy10YWJsZS1ib2R5LXJvd3MnICkuY2hpbGRyZW4oKTtcblxuXHRcdGlmICggMiA+IHRhYmxlUm93cy5sZW5ndGggKSB7XG5cdFx0XHQkb3B0aW9uc1RhYmxlLnJlbW92ZUNsYXNzKCAnaGFzLW9wdGlvbnMnICk7XG5cdFx0fVxuXHR9XG5cblx0Ly8gUmVtb3ZlIFNpbmdsZSBPcHRpb25cblx0JHNlYXJjaEZvcm0ub24oICdjbGljaycsICcucmVtb3ZlLW9wdGlvbicsIGZ1bmN0aW9uKCkge1xuXHRcdGNvbnN0ICRpdGVtICA9ICQoIHRoaXMgKS5jbG9zZXN0KCAnLml0ZW0nICk7XG5cdFx0Y29uc3QgJGZpZWxkID0gJGl0ZW0uY2xvc2VzdCggJy53Y2FwZi1mb3JtLWZpZWxkJyApO1xuXG5cdFx0dHJpZ2dlclJlbW92ZU9wdGlvbiggJGZpZWxkICk7XG5cblx0XHQkaXRlbS5yZW1vdmUoKTtcblxuXHRcdHRyaWdnZXJNYW51YWxPcHRpb25zQ2hhbmdlKCAkZmllbGQgKTtcblx0fSApO1xuXG5cdC8vIENsZWFyIEFsbCBPcHRpb25zXG5cdCRzZWFyY2hGb3JtLm9uKCAnY2xpY2snLCAnLmNsZWFyLWFsbC1vcHRpb25zJywgZnVuY3Rpb24oKSB7XG5cdFx0Y29uc3QgJGZpZWxkICAgICAgICA9ICQoIHRoaXMgKS5jbG9zZXN0KCAnLndjYXBmLWZvcm0tZmllbGQnICk7XG5cdFx0Y29uc3QgJG9wdGlvbnNUYWJsZSA9ICRmaWVsZC5maW5kKCAnLm1hbnVhbC1vcHRpb25zLXRhYmxlJyApO1xuXG5cdFx0JG9wdGlvbnNUYWJsZS5maW5kKCAnLm1hbnVhbC1vcHRpb25zLXRhYmxlLWJvZHktcm93cycgKS5lbXB0eSgpO1xuXG5cdFx0dHJpZ2dlclJlbW92ZU9wdGlvbiggJGZpZWxkICk7XG5cblx0XHR0cmlnZ2VyTWFudWFsT3B0aW9uc0NoYW5nZSggJGZpZWxkICk7XG5cdH0gKTtcblxuXHQvLyBBZGQgTmV3IE9wdGlvblxuXHQkc2VhcmNoRm9ybS5vbiggJ2NsaWNrJywgJy5hZGQtb3B0aW9uJywgZnVuY3Rpb24oKSB7XG5cdFx0Y29uc3QgZmllbGRUeXBlID0gJ3djYXBmLXBvc3QtbWV0YS1vcHRpb24nO1xuXG5cdFx0Ly8gQmFpbCBvdXQgaWYgbm8gdG1wbCBmb3VuZCBmb3IgdGhlIHR5cGUuXG5cdFx0aWYgKCAhIGpRdWVyeSggJyN0bXBsLScgKyBmaWVsZFR5cGUgKS5sZW5ndGggKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0Y29uc3QgJGZpZWxkID0gJCggdGhpcyApLmNsb3Nlc3QoICcud2NhcGYtZm9ybS1maWVsZCcgKTtcblxuXHRcdGNvbnN0IHRlbXBsYXRlID0gd3AudGVtcGxhdGUoIGZpZWxkVHlwZSApO1xuXHRcdGNvbnN0IHJlbmRlcmVkID0gdGVtcGxhdGUoIHsgdmFsdWU6ICcnLCBsYWJlbDogJycgfSApO1xuXHRcdGNvbnN0ICR3cmFwcGVyID0gJGZpZWxkLmZpbmQoICcubWFudWFsLW9wdGlvbnMtdGFibGUnICk7XG5cdFx0Y29uc3QgJHJvd3MgICAgPSAkd3JhcHBlci5maW5kKCAnLm1hbnVhbC1vcHRpb25zLXRhYmxlLWJvZHktcm93cycgKTtcblxuXHRcdCRyb3dzLmFwcGVuZCggcmVuZGVyZWQgKTtcblxuXHRcdGlmICggISAkd3JhcHBlci5oYXNDbGFzcyggJ2hhcy1vcHRpb25zJyApICkge1xuXHRcdFx0JHdyYXBwZXIuYWRkQ2xhc3MoICdoYXMtb3B0aW9ucycgKTtcblx0XHR9XG5cdH0gKTtcblxuXHRjb25zdCAkcG9zdE1ldGFPcHRpb25zTW9kYWwgPSAkKCAnLnBvc3QtbWV0YS1vcHRpb25zLW1vZGFsJyApO1xuXHRjb25zdCAkbm9LZXlGb3VuZE1lc3NhZ2UgICAgPSAkcG9zdE1ldGFPcHRpb25zTW9kYWwuZmluZCggJy5uby1rZXktZm91bmQtbWVzc2FnZScgKTtcblx0Y29uc3QgJHBvc3RNZXRhTW9kYWxMb2FkZXIgID0gJHBvc3RNZXRhT3B0aW9uc01vZGFsLmZpbmQoICcucG9zdC1tZXRhLW9wdGlvbnMtbG9hZGVyJyApO1xuXHRjb25zdCAkcG9zdE1ldGFPcHRpb25zICAgICAgPSAkcG9zdE1ldGFPcHRpb25zTW9kYWwuZmluZCggJy5wb3N0LW1ldGEtb3B0aW9ucycgKTtcblx0Y29uc3QgJHBvc3RNZXRhTW9kYWxGb290ZXIgID0gJHBvc3RNZXRhT3B0aW9uc01vZGFsLmZpbmQoICcud2NhcGYtbW9kYWwtZm9vdGVyJyApO1xuXG5cdGNvbnN0IHBvc3RNZXRhT3B0aW9uc01vZGFsSW5zdGFuY2UgPSAkcG9zdE1ldGFPcHRpb25zTW9kYWwucmVtb2RhbCgge1xuXHRcdGhhc2hUcmFja2luZzogZmFsc2UsXG5cdH0gKTtcblxuXHRsZXQgJHBvc3RNZXRhRmllbGQgPSBudWxsO1xuXG5cdGZ1bmN0aW9uIHJlc2V0UG9zdE1ldGFNb2RhbCgpIHtcblx0XHQkcG9zdE1ldGFPcHRpb25zLmh0bWwoICcnICk7XG5cdFx0JHBvc3RNZXRhTW9kYWxMb2FkZXIucmVtb3ZlQ2xhc3MoICdhY3RpdmUnICk7XG5cdFx0JG5vS2V5Rm91bmRNZXNzYWdlLnJlbW92ZUNsYXNzKCAnYWN0aXZlJyApO1xuXHRcdCRwb3N0TWV0YU1vZGFsRm9vdGVyLnJlbW92ZUNsYXNzKCAnYWN0aXZlJyApO1xuXHRcdCRwb3N0TWV0YU9wdGlvbnNNb2RhbC5maW5kKCAnLnJlcGxhY2UtY3VycmVudC1vcHRpb25zJyApLnByb3AoICdjaGVja2VkJywgZmFsc2UgKTtcblx0fVxuXG5cdC8vIEJyb3dzZSBWYWx1ZXNcblx0JHNlYXJjaEZvcm0ub24oICdjbGljaycsICcuYnJvd3NlLXZhbHVlcycsIGZ1bmN0aW9uKCkge1xuXHRcdHJlc2V0UG9zdE1ldGFNb2RhbCgpO1xuXG5cdFx0Y29uc3QgJGZpZWxkICAgICAgICA9ICQoIHRoaXMgKS5jbG9zZXN0KCAnLndjYXBmLWZvcm0tZmllbGQnICk7XG5cdFx0Y29uc3QgJGlucHV0TWV0YUtleSA9ICRmaWVsZC5maW5kKCAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLW1ldGFfa2V5IHNlbGVjdCcgKTtcblx0XHRjb25zdCBtZXRhS2V5ICAgICAgID0gJGlucHV0TWV0YUtleS52YWwoKTtcblxuXHRcdGlmICggISBtZXRhS2V5ICkge1xuXHRcdFx0JG5vS2V5Rm91bmRNZXNzYWdlLmFkZENsYXNzKCAnYWN0aXZlJyApO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHQkbm9LZXlGb3VuZE1lc3NhZ2UucmVtb3ZlQ2xhc3MoICdhY3RpdmUnICk7XG5cdFx0fVxuXG5cdFx0cG9zdE1ldGFPcHRpb25zTW9kYWxJbnN0YW5jZS5vcGVuKCk7XG5cdFx0JHBvc3RNZXRhRmllbGQgPSAkZmllbGQ7XG5cblx0XHRpZiAoICEgbWV0YUtleSApIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHQvLyBTaG93IHRoZSBsb2FkaW5nIGFuaW1hdGlvbi5cblx0XHQkcG9zdE1ldGFNb2RhbExvYWRlci5hZGRDbGFzcyggJ2FjdGl2ZScgKTtcblxuXHRcdC8qKlxuXHRcdCAqIEFqYXgncyBzdWNjZXNzIGZ1bmN0aW9uLlxuXHRcdCAqXG5cdFx0ICogQHBhcmFtIHJlc3BvbnNlXG5cdFx0ICovXG5cdFx0ZnVuY3Rpb24gb2tDYWxsYmFjayggcmVzcG9uc2UgKSB7XG5cdFx0XHQvLyBIaWRlIHRoZSBsb2FkaW5nIGFuaW1hdGlvbi5cblx0XHRcdCRwb3N0TWV0YU1vZGFsTG9hZGVyLnJlbW92ZUNsYXNzKCAnYWN0aXZlJyApO1xuXHRcdFx0JHBvc3RNZXRhTW9kYWxGb290ZXIuYWRkQ2xhc3MoICdhY3RpdmUnICk7XG5cblx0XHRcdCRwb3N0TWV0YU9wdGlvbnMuaHRtbCggcmVzcG9uc2UgKTtcblx0XHR9XG5cblx0XHQvKipcblx0XHQgKiBBamF4J3MgZXJyb3IgZnVuY3Rpb24uXG5cdFx0ICpcblx0XHQgKiBAcGFyYW0gbWVzc2FnZVxuXHRcdCAqL1xuXHRcdGZ1bmN0aW9uIGVyckNhbGxiYWNrKCBtZXNzYWdlICkge1xuXHRcdFx0Y29uc29sZS5sb2coICdlcnJvcicsIG1lc3NhZ2UgKTtcblxuXHRcdFx0Ly8gSGlkZSB0aGUgbG9hZGluZyBhbmltYXRpb24uXG5cdFx0XHQkcG9zdE1ldGFNb2RhbExvYWRlci5yZW1vdmVDbGFzcyggJ2FjdGl2ZScgKTtcblx0XHR9XG5cblx0XHRjb25zdCBmb3JtRGF0YSA9IHtcblx0XHRcdGtleTogbWV0YUtleSxcblx0XHRcdGFjdGlvbjogJ3djYXBmX2dldF9tZXRhX29wdGlvbnMnLFxuXHRcdH1cblxuXHRcdC8vIGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vYS81OTE4MTI1MlxuXHRcdHdwLmFqYXgucG9zdCggZm9ybURhdGEgKS5kb25lKCBva0NhbGxiYWNrICkuZmFpbCggZXJyQ2FsbGJhY2sgKTtcblx0fSApO1xuXG5cdC8qKlxuXHQgKiBSZXNldCB0aGUgcG9zdCBtZXRhIG9wdGlvbidzIG1vZGFsIHdoZW4gbW9kYWwgZ2V0cyBjbG9zZWQuXG5cdCAqL1xuXHQkKCBkb2N1bWVudCApLm9uKCAnY2xvc2VkJywgJHBvc3RNZXRhT3B0aW9uc01vZGFsLCBmdW5jdGlvbigpIHtcblx0XHRyZXNldFBvc3RNZXRhTW9kYWwoKTtcblx0XHQkcG9zdE1ldGFGaWVsZCA9IG51bGw7XG5cdH0gKTtcblxuXHQvLyBVbnNlbGVjdCBhbGwgdmFsdWVzLlxuXHQkcG9zdE1ldGFPcHRpb25zTW9kYWwub24oICdjbGljaycsICcuc2VsZWN0LW5vbmUnLCBmdW5jdGlvbigpIHtcblx0XHQkcG9zdE1ldGFPcHRpb25zLmZpbmQoICdbdHlwZT1cImNoZWNrYm94XCJdJyApLnByb3AoICdjaGVja2VkJywgZmFsc2UgKTtcblx0fSApO1xuXG5cdC8vIFNlbGVjdCBhbGwgdmFsdWVzLlxuXHQkcG9zdE1ldGFPcHRpb25zTW9kYWwub24oICdjbGljaycsICcuc2VsZWN0LWFsbCcsIGZ1bmN0aW9uKCkge1xuXHRcdCRwb3N0TWV0YU9wdGlvbnMuZmluZCggJ1t0eXBlPVwiY2hlY2tib3hcIl0nICkucHJvcCggJ2NoZWNrZWQnLCB0cnVlICk7XG5cdH0gKTtcblxuXHRmdW5jdGlvbiB0cmlnZ2VyTWFudWFsT3B0aW9uc0NoYW5nZSggJHBvc3RNZXRhRmllbGQgKSB7XG5cdFx0Y29uc3QgJHZhbHVlSG9sZGVyICA9ICRwb3N0TWV0YUZpZWxkLmZpbmQoICcud2NhcGYtZm9ybS1zdWItZmllbGQtbWFudWFsX29wdGlvbnMgaW5wdXQnICk7XG5cdFx0Y29uc3QgJG9wdGlvbnNUYWJsZSA9ICRwb3N0TWV0YUZpZWxkLmZpbmQoICcubWFudWFsLW9wdGlvbnMtdGFibGUnICk7XG5cdFx0Y29uc3QgJHJvd3MgICAgICAgICA9ICRvcHRpb25zVGFibGUuZmluZCggJy5tYW51YWwtb3B0aW9ucy10YWJsZS1ib2R5LXJvd3MnICk7XG5cdFx0Y29uc3QgX3Jvd3MgICAgICAgICA9IFtdO1xuXG5cdFx0JHJvd3MuZmluZCggJy5pdGVtJyApLmVhY2goIGZ1bmN0aW9uKCBpLCBfaXRlbSApIHtcblx0XHRcdGNvbnN0ICRpdGVtID0gJCggX2l0ZW0gKTtcblx0XHRcdGNvbnN0IHZhbHVlID0gJGl0ZW0uZmluZCggJy5vcHRpb25fdmFsdWUnICkudmFsKCk7XG5cdFx0XHRjb25zdCBsYWJlbCA9ICRpdGVtLmZpbmQoICcub3B0aW9uX2xhYmVsJyApLnZhbCgpO1xuXG5cdFx0XHRpZiAoIHZhbHVlICYmIGxhYmVsICkge1xuXHRcdFx0XHRfcm93cy5wdXNoKCBbIHZhbHVlLCBsYWJlbCBdICk7XG5cdFx0XHR9XG5cdFx0fSApO1xuXG5cdFx0Y29uc3QgcmF3VmFsdWVzID0gZW5jb2RlVVJJQ29tcG9uZW50KCBKU09OLnN0cmluZ2lmeSggX3Jvd3MgKSApO1xuXHRcdCR2YWx1ZUhvbGRlci52YWwoIHJhd1ZhbHVlcyApO1xuXHR9XG5cblx0Ly8gQWRkIHNlbGVjdGVkIG9wdGlvbnMuXG5cdCRwb3N0TWV0YU9wdGlvbnNNb2RhbC5vbiggJ2NsaWNrJywgJy5hZGQtb3B0aW9ucycsIGZ1bmN0aW9uKCkge1xuXHRcdGNvbnN0ICRvcHRpb25zID0gJHBvc3RNZXRhT3B0aW9ucy5maW5kKCAnW3R5cGU9XCJjaGVja2JveFwiXScgKTtcblx0XHRsZXQgaXNSZXBsYWNlICA9IGZhbHNlO1xuXHRcdGxldCByb3dzICAgICAgID0gJyc7XG5cblx0XHRpZiAoICRwb3N0TWV0YU1vZGFsRm9vdGVyLmZpbmQoICcucmVwbGFjZS1jdXJyZW50LW9wdGlvbnMnICkuaXMoICc6Y2hlY2tlZCcgKSApIHtcblx0XHRcdGlzUmVwbGFjZSA9IHRydWU7XG5cdFx0fVxuXG5cdFx0aWYgKCAkb3B0aW9ucyApIHtcblx0XHRcdGNvbnN0IGZpZWxkVHlwZSA9ICd3Y2FwZi1wb3N0LW1ldGEtb3B0aW9uJztcblxuXHRcdFx0JC5lYWNoKCAkb3B0aW9ucywgZnVuY3Rpb24oIGksIGlucHV0ICkge1xuXHRcdFx0XHRjb25zdCAkaW5wdXQgPSAkKCBpbnB1dCApO1xuXHRcdFx0XHRjb25zdCB2YWx1ZSAgPSAkaW5wdXQudmFsKCk7XG5cblx0XHRcdFx0aWYgKCAkaW5wdXQuaXMoICc6Y2hlY2tlZCcgKSApIHtcblx0XHRcdFx0XHRjb25zdCB0ZW1wbGF0ZSA9IHdwLnRlbXBsYXRlKCBmaWVsZFR5cGUgKTtcblx0XHRcdFx0XHRjb25zdCByZW5kZXJlZCA9IHRlbXBsYXRlKCB7IHZhbHVlLCBsYWJlbDogdmFsdWUgfSApO1xuXG5cdFx0XHRcdFx0cm93cyArPSByZW5kZXJlZDtcblx0XHRcdFx0fVxuXHRcdFx0fSApO1xuXHRcdH1cblxuXHRcdGlmICggcm93cyApIHtcblx0XHRcdGNvbnN0ICR3cmFwcGVyID0gJHBvc3RNZXRhRmllbGQuZmluZCggJy5tYW51YWwtb3B0aW9ucy10YWJsZScgKTtcblx0XHRcdGNvbnN0ICRyb3dzICAgID0gJHdyYXBwZXIuZmluZCggJy5tYW51YWwtb3B0aW9ucy10YWJsZS1ib2R5LXJvd3MnICk7XG5cblx0XHRcdGlmICggaXNSZXBsYWNlICkge1xuXHRcdFx0XHQkcm93cy5odG1sKCByb3dzICk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHQkcm93cy5hcHBlbmQoIHJvd3MgKTtcblx0XHRcdH1cblxuXHRcdFx0aWYgKCAhICR3cmFwcGVyLmhhc0NsYXNzKCAnaGFzLW9wdGlvbnMnICkgKSB7XG5cdFx0XHRcdCR3cmFwcGVyLmFkZENsYXNzKCAnaGFzLW9wdGlvbnMnICk7XG5cdFx0XHR9XG5cblx0XHRcdHRyaWdnZXJNYW51YWxPcHRpb25zQ2hhbmdlKCAkcG9zdE1ldGFGaWVsZCApO1xuXHRcdH1cblxuXHRcdHBvc3RNZXRhT3B0aW9uc01vZGFsSW5zdGFuY2UuY2xvc2UoKTtcblx0fSApO1xuXG5cdCRzZWFyY2hGb3JtLm9uKCAnYWZ0ZXJfdG9nZ2xlX3JlcXVlc3QnLCBmdW5jdGlvbiggZSwgaGFuZGxlciwgdmFsdWUsICRmaWVsZCApIHtcblx0XHRpZiAoICcud2NhcGYtZm9ybS1zdWItZmllbGQtZ2V0X29wdGlvbnMgaW5wdXQnID09PSBoYW5kbGVyICkge1xuXHRcdFx0Y29uc3QgJHNlbGVjdEVsbSAgICAgICA9ICRmaWVsZC5maW5kKCAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLW9wdGlvbnNfb3JkZXJfYnkgc2VsZWN0JyApO1xuXHRcdFx0Y29uc3Qgb3JkZXJCeSAgICAgICAgICA9ICRzZWxlY3RFbG0udmFsKCk7XG5cdFx0XHRjb25zdCBkZXBlbmRhbnRPcHRpb25zID0gJ29wdGlvblt2YWx1ZT1cImxhYmVsXCJdJztcblxuXHRcdFx0aWYgKCAnYXV0b21hdGljYWxseScgPT09IHZhbHVlICkge1xuXHRcdFx0XHQkc2VsZWN0RWxtLmNoaWxkcmVuKCBkZXBlbmRhbnRPcHRpb25zICkuYXR0ciggJ2Rpc2FibGVkJywgJ2Rpc2FibGVkJyApO1xuXG5cdFx0XHRcdGlmICggJ2xhYmVsJyA9PT0gb3JkZXJCeSApIHtcblx0XHRcdFx0XHQkc2VsZWN0RWxtLnByb3AoICdzZWxlY3RlZEluZGV4JywgMSApLmNoYW5nZSgpO1xuXHRcdFx0XHR9XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHQkc2VsZWN0RWxtLmNoaWxkcmVuKCBkZXBlbmRhbnRPcHRpb25zICkucmVtb3ZlQXR0ciggJ2Rpc2FibGVkJyApO1xuXHRcdFx0fVxuXHRcdH1cblx0fSApO1xuXG5cdGZ1bmN0aW9uIGRpc2FibGVPcmRlckJ5T3B0aW9ucyggJGVsbSApIHtcblx0XHRjb25zdCB2YWx1ZSAgICAgICAgICAgICAgICA9ICRlbG0udmFsKCk7XG5cdFx0Y29uc3QgJHdyYXBwZXIgICAgICAgICAgICAgPSAkZWxtLmNsb3Nlc3QoICcud2NhcGYtcG9zdC1tZXRhLW9yZGVyLW9wdGlvbnMtZmllbGQnICk7XG5cdFx0Y29uc3QgJG9yZGVyRGlyZWN0aW9uRmllbGQgPSAkd3JhcHBlci5maW5kKCAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLW9wdGlvbnNfb3JkZXJfZGlyIHNlbGVjdCcgKTtcblx0XHRjb25zdCAkb3JkZXJUeXBlRmllbGQgICAgICA9ICR3cmFwcGVyLmZpbmQoICcud2NhcGYtZm9ybS1zdWItZmllbGQtb3B0aW9uc19vcmRlcl90eXBlIHNlbGVjdCcgKTtcblxuXHRcdGlmICggJ25vbmUnID09PSB2YWx1ZSApIHtcblx0XHRcdCRvcmRlckRpcmVjdGlvbkZpZWxkLmF0dHIoICdkaXNhYmxlZCcsICdkaXNhYmxlZCcgKTtcblx0XHRcdCRvcmRlclR5cGVGaWVsZC5hdHRyKCAnZGlzYWJsZWQnLCAnZGlzYWJsZWQnICk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdCRvcmRlckRpcmVjdGlvbkZpZWxkLnJlbW92ZUF0dHIoICdkaXNhYmxlZCcgKTtcblx0XHRcdCRvcmRlclR5cGVGaWVsZC5yZW1vdmVBdHRyKCAnZGlzYWJsZWQnICk7XG5cdFx0fVxuXHR9XG5cblx0JHNlYXJjaEZvcm0uZmluZCggJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1vcHRpb25zX29yZGVyX2J5IHNlbGVjdCcgKS5lYWNoKCBmdW5jdGlvbigpIHtcblx0XHRjb25zdCAkdGhpcyA9ICQoIHRoaXMgKTtcblxuXHRcdGRpc2FibGVPcmRlckJ5T3B0aW9ucyggJHRoaXMgKTtcblx0fSApO1xuXG5cdCRzZWFyY2hGb3JtLm9uKCAnY2hhbmdlJywgJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1vcHRpb25zX29yZGVyX2J5IHNlbGVjdCcsIGZ1bmN0aW9uKCkge1xuXHRcdGNvbnN0ICR0aGlzID0gJCggdGhpcyApO1xuXG5cdFx0ZGlzYWJsZU9yZGVyQnlPcHRpb25zKCAkdGhpcyApO1xuXHR9ICk7XG5cblx0JHNlYXJjaEZvcm0ub24oICdpbnB1dCcsICcubWFudWFsLW9wdGlvbnMtdGFibGUgaW5wdXRbdHlwZT1cInRleHRcIl0nLCBmdW5jdGlvbigpIHtcblx0XHRjb25zdCAkZmllbGQgPSAkKCB0aGlzICkuY2xvc2VzdCggJy53Y2FwZi1mb3JtLWZpZWxkJyApO1xuXG5cdFx0dHJpZ2dlck1hbnVhbE9wdGlvbnNDaGFuZ2UoICRmaWVsZCApO1xuXHR9ICk7XG5cblx0LyoqXG5cdCAqIFZhbHVlIHR5cGUgJ051bWJlcidcblx0ICovXG5cblx0ZnVuY3Rpb24gaW5pdFNvcnRhYmxlRm9yTnVtYmVyTWFudWFsT3B0aW9ucyggJHNlbGVjdG9yICkge1xuXHRcdCRzZWxlY3Rvci5zb3J0YWJsZSgge1xuXHRcdFx0b3BhY2l0eTogMC44LFxuXHRcdFx0cmV2ZXJ0OiBmYWxzZSxcblx0XHRcdGN1cnNvcjogJ21vdmUnLFxuXHRcdFx0YXhpczogJ3knLFxuXHRcdFx0aGFuZGxlOiAnLm1vdmUtb3B0aW9ucy1oYW5kbGVyJyxcblx0XHRcdHBsYWNlaG9sZGVyOiAnd2lkZ2V0LXBsYWNlaG9sZGVyJyxcblx0XHRcdHVwZGF0ZTogZnVuY3Rpb24oIGUgKSB7XG5cdFx0XHRcdGNvbnN0ICRmaWVsZCA9ICQoIGUudGFyZ2V0ICkuY2xvc2VzdCggJy53Y2FwZi1mb3JtLWZpZWxkJyApO1xuXG5cdFx0XHRcdHRyaWdnZXJOdW1iZXJNYW51YWxPcHRpb25zQ2hhbmdlKCAkZmllbGQgKTtcblx0XHRcdH1cblx0XHR9ICkuZGlzYWJsZVNlbGVjdGlvbigpO1xuXHR9XG5cblx0Ly8gU29ydCBOdW1iZXIgTWFudWFsIE9wdGlvbnNcblx0aW5pdFNvcnRhYmxlRm9yTnVtYmVyTWFudWFsT3B0aW9ucyggJHNlYXJjaEZvcm0uZmluZCggJy5udW1iZXItbWFudWFsLW9wdGlvbnMtdGFibGUgLm1hbnVhbC1vcHRpb25zLXRhYmxlLWJvZHktcm93cycgKSApO1xuXG5cdCRzZWFyY2hGb3JtLm9uKCAnZmllbGRfYWRkZWQnLCBmdW5jdGlvbiggZSwgdWkgKSB7XG5cdFx0Ly8gSW5pdCBTb3J0YWJsZSBmb3IgdGhlIG51bWJlciBtYW51YWwgb3B0aW9ucy5cblx0XHRpbml0U29ydGFibGVGb3JOdW1iZXJNYW51YWxPcHRpb25zKCAkKCB1aS5pdGVtLmZpbmQoICcubWFudWFsLW9wdGlvbnMtdGFibGUtYm9keS1yb3dzJyApICkgKTtcblx0fSApO1xuXG5cdGZ1bmN0aW9uIHRyaWdnZXJSZW1vdmVOdW1iZXJPcHRpb24oICRmaWVsZCApIHtcblx0XHRjb25zdCAkb3B0aW9uc1RhYmxlID0gJGZpZWxkLmZpbmQoICcubnVtYmVyLW1hbnVhbC1vcHRpb25zLXRhYmxlJyApO1xuXHRcdGNvbnN0IHRhYmxlUm93cyAgICAgPSAkb3B0aW9uc1RhYmxlLmZpbmQoICcubWFudWFsLW9wdGlvbnMtdGFibGUtYm9keS1yb3dzJyApLmNoaWxkcmVuKCk7XG5cblx0XHRpZiAoIDIgPiB0YWJsZVJvd3MubGVuZ3RoICkge1xuXHRcdFx0JG9wdGlvbnNUYWJsZS5yZW1vdmVDbGFzcyggJ2hhcy1vcHRpb25zJyApO1xuXHRcdH1cblx0fVxuXG5cdGZ1bmN0aW9uIHRyaWdnZXJOdW1iZXJNYW51YWxPcHRpb25zQ2hhbmdlKCAkcG9zdE1ldGFGaWVsZCApIHtcblx0XHRjb25zdCAkdmFsdWVIb2xkZXIgID0gJHBvc3RNZXRhRmllbGQuZmluZCggJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1udW1iZXJfbWFudWFsX29wdGlvbnMgaW5wdXQnICk7XG5cdFx0Y29uc3QgJG9wdGlvbnNUYWJsZSA9ICRwb3N0TWV0YUZpZWxkLmZpbmQoICcubnVtYmVyLW1hbnVhbC1vcHRpb25zLXRhYmxlJyApO1xuXHRcdGNvbnN0ICRyb3dzICAgICAgICAgPSAkb3B0aW9uc1RhYmxlLmZpbmQoICcubWFudWFsLW9wdGlvbnMtdGFibGUtYm9keS1yb3dzJyApO1xuXHRcdGNvbnN0IF9yb3dzICAgICAgICAgPSBbXTtcblxuXHRcdCRyb3dzLmZpbmQoICcuaXRlbScgKS5lYWNoKCBmdW5jdGlvbiggaSwgX2l0ZW0gKSB7XG5cdFx0XHRjb25zdCAkaXRlbSAgICAgPSAkKCBfaXRlbSApO1xuXHRcdFx0Y29uc3QgbWluX3ZhbHVlID0gJGl0ZW0uZmluZCggJy5vcHRpb25fbWluX3ZhbHVlJyApLnZhbCgpO1xuXHRcdFx0Y29uc3QgbWF4X3ZhbHVlID0gJGl0ZW0uZmluZCggJy5vcHRpb25fbWF4X3ZhbHVlJyApLnZhbCgpO1xuXHRcdFx0Y29uc3QgbGFiZWwgICAgID0gJGl0ZW0uZmluZCggJy5vcHRpb25fbGFiZWwnICkudmFsKCk7XG5cblx0XHRcdGlmICggbWluX3ZhbHVlICYmIG1heF92YWx1ZSAmJiBsYWJlbCApIHtcblx0XHRcdFx0X3Jvd3MucHVzaCggWyBtaW5fdmFsdWUsIG1heF92YWx1ZSwgbGFiZWwgXSApO1xuXHRcdFx0fVxuXHRcdH0gKTtcblxuXHRcdGNvbnN0IHJhd1ZhbHVlcyA9IGVuY29kZVVSSUNvbXBvbmVudCggSlNPTi5zdHJpbmdpZnkoIF9yb3dzICkgKTtcblx0XHQkdmFsdWVIb2xkZXIudmFsKCByYXdWYWx1ZXMgKTtcblx0fVxuXG5cdC8vIFJlbW92ZSBTaW5nbGUgTnVtYmVyIE9wdGlvblxuXHQkc2VhcmNoRm9ybS5vbiggJ2NsaWNrJywgJy5yZW1vdmUtbnVtYmVyLW9wdGlvbicsIGZ1bmN0aW9uKCkge1xuXHRcdGNvbnN0ICRpdGVtICA9ICQoIHRoaXMgKS5jbG9zZXN0KCAnLml0ZW0nICk7XG5cdFx0Y29uc3QgJGZpZWxkID0gJGl0ZW0uY2xvc2VzdCggJy53Y2FwZi1mb3JtLWZpZWxkJyApO1xuXG5cdFx0dHJpZ2dlclJlbW92ZU51bWJlck9wdGlvbiggJGZpZWxkICk7XG5cblx0XHQkaXRlbS5yZW1vdmUoKTtcblxuXHRcdHRyaWdnZXJOdW1iZXJNYW51YWxPcHRpb25zQ2hhbmdlKCAkZmllbGQgKTtcblx0fSApO1xuXG5cdC8vIENsZWFyIEFsbCBPcHRpb25zXG5cdCRzZWFyY2hGb3JtLm9uKCAnY2xpY2snLCAnLmNsZWFyLWFsbC1udW1iZXItb3B0aW9ucycsIGZ1bmN0aW9uKCkge1xuXHRcdGNvbnN0ICRmaWVsZCAgICAgICAgPSAkKCB0aGlzICkuY2xvc2VzdCggJy53Y2FwZi1mb3JtLWZpZWxkJyApO1xuXHRcdGNvbnN0ICRvcHRpb25zVGFibGUgPSAkZmllbGQuZmluZCggJy5udW1iZXItbWFudWFsLW9wdGlvbnMtdGFibGUnICk7XG5cblx0XHQkb3B0aW9uc1RhYmxlLmZpbmQoICcubWFudWFsLW9wdGlvbnMtdGFibGUtYm9keS1yb3dzJyApLmVtcHR5KCk7XG5cblx0XHR0cmlnZ2VyUmVtb3ZlTnVtYmVyT3B0aW9uKCAkZmllbGQgKTtcblxuXHRcdHRyaWdnZXJOdW1iZXJNYW51YWxPcHRpb25zQ2hhbmdlKCAkZmllbGQgKTtcblx0fSApO1xuXG5cdC8vIEFkZCBOZXcgT3B0aW9uXG5cdCRzZWFyY2hGb3JtLm9uKCAnY2xpY2snLCAnLmFkZC1udW1iZXItb3B0aW9uJywgZnVuY3Rpb24oKSB7XG5cdFx0Y29uc3QgZmllbGRUeXBlID0gJ3djYXBmLXBvc3QtbWV0YS10eXBlLW51bWJlci1vcHRpb24nO1xuXG5cdFx0Ly8gQmFpbCBvdXQgaWYgbm8gdG1wbCBmb3VuZCBmb3IgdGhlIHR5cGUuXG5cdFx0aWYgKCAhIGpRdWVyeSggJyN0bXBsLScgKyBmaWVsZFR5cGUgKS5sZW5ndGggKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0Y29uc3QgJGZpZWxkID0gJCggdGhpcyApLmNsb3Nlc3QoICcud2NhcGYtZm9ybS1maWVsZCcgKTtcblxuXHRcdGNvbnN0IHRlbXBsYXRlID0gd3AudGVtcGxhdGUoIGZpZWxkVHlwZSApO1xuXHRcdGNvbnN0IHJlbmRlcmVkID0gdGVtcGxhdGUoIHsgdmFsdWU6ICcnLCBsYWJlbDogJycgfSApO1xuXHRcdGNvbnN0ICR3cmFwcGVyID0gJGZpZWxkLmZpbmQoICcubnVtYmVyLW1hbnVhbC1vcHRpb25zLXRhYmxlJyApO1xuXHRcdGNvbnN0ICRyb3dzICAgID0gJHdyYXBwZXIuZmluZCggJy5tYW51YWwtb3B0aW9ucy10YWJsZS1ib2R5LXJvd3MnICk7XG5cblx0XHQkcm93cy5hcHBlbmQoIHJlbmRlcmVkICk7XG5cblx0XHRpZiAoICEgJHdyYXBwZXIuaGFzQ2xhc3MoICdoYXMtb3B0aW9ucycgKSApIHtcblx0XHRcdCR3cmFwcGVyLmFkZENsYXNzKCAnaGFzLW9wdGlvbnMnICk7XG5cdFx0fVxuXHR9ICk7XG5cblx0JHNlYXJjaEZvcm0ub24oICdpbnB1dCcsICcubnVtYmVyLW1hbnVhbC1vcHRpb25zLXRhYmxlIGlucHV0W3R5cGU9XCJ0ZXh0XCJdJywgZnVuY3Rpb24oKSB7XG5cdFx0Y29uc3QgJGZpZWxkID0gJCggdGhpcyApLmNsb3Nlc3QoICcud2NhcGYtZm9ybS1maWVsZCcgKTtcblxuXHRcdHRyaWdnZXJOdW1iZXJNYW51YWxPcHRpb25zQ2hhbmdlKCAkZmllbGQgKTtcblx0fSApO1xuXG5cdCRzZWFyY2hGb3JtLm9uKCAnYWZ0ZXJfdG9nZ2xlX3JlcXVlc3QnLCBmdW5jdGlvbiggZSwgaGFuZGxlciwgdmFsdWUsICRmaWVsZCApIHtcblx0XHRpZiAoICcud2NhcGYtZm9ybS1zdWItZmllbGQtbnVtYmVyX2Rpc3BsYXlfdHlwZSBzZWxlY3QnID09PSBoYW5kbGVyICkge1xuXHRcdFx0Y29uc3QgJGdldE9wdGlvbnMgICAgICAgICA9ICRmaWVsZC5maW5kKCAnLm51bWJlci1nZXQtb3B0aW9ucycgKTtcblx0XHRcdGNvbnN0ICRhdXRvT3B0aW9ucyAgICAgICAgPSAkZmllbGQuZmluZCggJy5udW1iZXItYXV0b21hdGljLW9wdGlvbnMnICk7XG5cdFx0XHRjb25zdCAkbWFudWFsT3B0aW9uc1RhYmxlID0gJGZpZWxkLmZpbmQoICcubnVtYmVyLW1hbnVhbC1vcHRpb25zLXRhYmxlJyApO1xuXHRcdFx0Y29uc3QgJGVsbSAgICAgICAgICAgICAgICA9ICRmaWVsZC5maW5kKCBoYW5kbGVyICk7XG5cdFx0XHRjb25zdCBkaXNwbGF5VHlwZSAgICAgICAgID0gJGVsbS52YWwoKTtcblxuXHRcdFx0aWYgKCAncmFuZ2Vfc2xpZGVyJyA9PT0gZGlzcGxheVR5cGUgfHwgJ3JhbmdlX251bWJlcicgPT09IGRpc3BsYXlUeXBlICkge1xuXHRcdFx0XHQkZ2V0T3B0aW9ucy5oaWRlKCk7XG5cdFx0XHRcdCRtYW51YWxPcHRpb25zVGFibGUuYWRkQ2xhc3MoICdmb3JjZS1oaWRlJyApO1xuXHRcdFx0XHQkYXV0b09wdGlvbnMuYWRkQ2xhc3MoICdmb3JjZS1zaG93JyApO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0JGdldE9wdGlvbnMuc2hvdygpO1xuXHRcdFx0XHQkbWFudWFsT3B0aW9uc1RhYmxlLnJlbW92ZUNsYXNzKCAnZm9yY2UtaGlkZScgKTtcblx0XHRcdFx0JGF1dG9PcHRpb25zLnJlbW92ZUNsYXNzKCAnZm9yY2Utc2hvdycgKTtcblx0XHRcdH1cblx0XHR9XG5cdH0gKTtcblxuXHQvLyBmdW5jdGlvbiB0b2dnbGVOdW1iZXJNaW5WYWx1ZUZpZWxkKCAkZWxtICkge1xuXHQvLyBcdGNvbnN0ICRmaWVsZCAgICAgPSAkZWxtLmNsb3Nlc3QoICcud2NhcGYtZm9ybS1maWVsZCcgKTtcblx0Ly8gXHRjb25zdCAkdGV4dEZpZWxkID0gJGZpZWxkLmZpbmQoICcud2NhcGYtZm9ybS1zdWItZmllbGQtbWluX3ZhbHVlIGlucHV0W3R5cGU9XCJ0ZXh0XCJdJyApO1xuXHQvL1xuXHQvLyBcdGlmICggJGVsbS5pcyggJzpjaGVja2VkJyApICkge1xuXHQvLyBcdFx0JHRleHRGaWVsZC5hdHRyKCAnZGlzYWJsZWQnLCAnZGlzYWJsZWQnICk7XG5cdC8vIFx0fSBlbHNlIHtcblx0Ly8gXHRcdCR0ZXh0RmllbGQucmVtb3ZlQXR0ciggJ2Rpc2FibGVkJyApO1xuXHQvLyBcdH1cblx0Ly8gfVxuXHQvL1xuXHQvLyAkc2VhcmNoRm9ybS5maW5kKCAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLW1pbl92YWx1ZV9hdXRvX2RldGVjdCBpbnB1dFt0eXBlPVwiY2hlY2tib3hcIl0nICkuZWFjaCggZnVuY3Rpb24oKSB7XG5cdC8vIFx0Y29uc3QgJHRoaXMgPSAkKCB0aGlzICk7XG5cdC8vXG5cdC8vIFx0dG9nZ2xlTnVtYmVyTWluVmFsdWVGaWVsZCggJHRoaXMgKTtcblx0Ly8gfSApO1xuXHQvL1xuXHQvLyAkc2VhcmNoRm9ybS5vbiggJ2NsaWNrJywgJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1taW5fdmFsdWVfYXV0b19kZXRlY3QgaW5wdXRbdHlwZT1cImNoZWNrYm94XCJdJywgZnVuY3Rpb24oKSB7XG5cdC8vIFx0Y29uc3QgJHRoaXMgPSAkKCB0aGlzICk7XG5cdC8vXG5cdC8vIFx0dG9nZ2xlTnVtYmVyTWluVmFsdWVGaWVsZCggJHRoaXMgKTtcblx0Ly8gfSApO1xuXHQvL1xuXHQvLyBmdW5jdGlvbiB0b2dnbGVOdW1iZXJNYXhWYWx1ZUZpZWxkKCAkZWxtICkge1xuXHQvLyBcdGNvbnN0ICRmaWVsZCAgICAgPSAkZWxtLmNsb3Nlc3QoICcud2NhcGYtZm9ybS1maWVsZCcgKTtcblx0Ly8gXHRjb25zdCAkdGV4dEZpZWxkID0gJGZpZWxkLmZpbmQoICcud2NhcGYtZm9ybS1zdWItZmllbGQtbWF4X3ZhbHVlIGlucHV0W3R5cGU9XCJ0ZXh0XCJdJyApO1xuXHQvL1xuXHQvLyBcdGlmICggJGVsbS5pcyggJzpjaGVja2VkJyApICkge1xuXHQvLyBcdFx0JHRleHRGaWVsZC5hdHRyKCAnZGlzYWJsZWQnLCAnZGlzYWJsZWQnICk7XG5cdC8vIFx0fSBlbHNlIHtcblx0Ly8gXHRcdCR0ZXh0RmllbGQucmVtb3ZlQXR0ciggJ2Rpc2FibGVkJyApO1xuXHQvLyBcdH1cblx0Ly8gfVxuXHQvL1xuXHQvLyAkc2VhcmNoRm9ybS5maW5kKCAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLW1heF92YWx1ZV9hdXRvX2RldGVjdCBpbnB1dFt0eXBlPVwiY2hlY2tib3hcIl0nICkuZWFjaCggZnVuY3Rpb24oKSB7XG5cdC8vIFx0Y29uc3QgJHRoaXMgPSAkKCB0aGlzICk7XG5cdC8vXG5cdC8vIFx0dG9nZ2xlTnVtYmVyTWF4VmFsdWVGaWVsZCggJHRoaXMgKTtcblx0Ly8gfSApO1xuXHQvL1xuXHQvLyAkc2VhcmNoRm9ybS5vbiggJ2NsaWNrJywgJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1tYXhfdmFsdWVfYXV0b19kZXRlY3QgaW5wdXRbdHlwZT1cImNoZWNrYm94XCJdJywgZnVuY3Rpb24oKSB7XG5cdC8vIFx0Y29uc3QgJHRoaXMgPSAkKCB0aGlzICk7XG5cdC8vXG5cdC8vIFx0dG9nZ2xlTnVtYmVyTWF4VmFsdWVGaWVsZCggJHRoaXMgKTtcblx0Ly8gfSApO1xuXG5cdC8vIFRvZ2dsZSBzb2Z0IGxpbWl0IGZpZWxkcyB3aGVuIGRpc3BsYXkgdHlwZSBpcyBjaGFuZ2VkLlxuXHQkc2VhcmNoRm9ybS5vbiggJ2FmdGVyX3RvZ2dsZV9yZXF1ZXN0JywgZnVuY3Rpb24oIGUsIGhhbmRsZXIsIHZhbHVlLCAkZmllbGQgKSB7XG5cdFx0aWYgKCAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLWRpc3BsYXlfdHlwZSBzZWxlY3QnID09PSBoYW5kbGVyICkge1xuXHRcdFx0Y29uc3QgJHNvZnRMaW1pdEZpZWxkcyA9ICRmaWVsZC5maW5kKCAnLnNvZnQtbGltaXQtZmllbGRzJyApO1xuXHRcdFx0Y29uc3QgJHZhbHVlVHlwZUZpZWxkICA9ICRmaWVsZC5maW5kKCAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLXZhbHVlX3R5cGUgc2VsZWN0JyApO1xuXHRcdFx0Y29uc3QgdmFsdWVUeXBlICAgICAgICA9ICR2YWx1ZVR5cGVGaWVsZC52YWwoKTtcblx0XHRcdGNvbnN0IGRpc3BsYXlUeXBlcyAgICAgPSBbICdjaGVja2JveCcsICdyYWRpbycgXTtcblxuXHRcdFx0aWYgKCAkdmFsdWVUeXBlRmllbGQubGVuZ3RoICkge1xuXHRcdFx0XHRpZiAoICd0ZXh0JyA9PT0gdmFsdWVUeXBlICkge1xuXHRcdFx0XHRcdGlmICggZGlzcGxheVR5cGVzLmluY2x1ZGVzKCB2YWx1ZSApICkge1xuXHRcdFx0XHRcdFx0JHNvZnRMaW1pdEZpZWxkcy5zaG93KCk7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdCRzb2Z0TGltaXRGaWVsZHMuaGlkZSgpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0aWYgKCBkaXNwbGF5VHlwZXMuaW5jbHVkZXMoIHZhbHVlICkgKSB7XG5cdFx0XHRcdFx0JHNvZnRMaW1pdEZpZWxkcy5zaG93KCk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0JHNvZnRMaW1pdEZpZWxkcy5oaWRlKCk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cdH0gKTtcblxuXHQvLyBUb2dnbGUgc29mdCBsaW1pdCBmaWVsZHMgd2hlbiBudW1iZXIgZGlzcGxheSB0eXBlIGlzIGNoYW5nZWQuXG5cdCRzZWFyY2hGb3JtLm9uKCAnYWZ0ZXJfdG9nZ2xlX3JlcXVlc3QnLCBmdW5jdGlvbiggZSwgaGFuZGxlciwgdmFsdWUsICRmaWVsZCApIHtcblx0XHRpZiAoICcud2NhcGYtZm9ybS1zdWItZmllbGQtbnVtYmVyX2Rpc3BsYXlfdHlwZSBzZWxlY3QnID09PSBoYW5kbGVyICkge1xuXHRcdFx0Y29uc3QgJHNvZnRMaW1pdEZpZWxkcyA9ICRmaWVsZC5maW5kKCAnLnNvZnQtbGltaXQtZmllbGRzJyApO1xuXHRcdFx0Y29uc3QgJHZhbHVlVHlwZUZpZWxkICA9ICRmaWVsZC5maW5kKCAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLXZhbHVlX3R5cGUgc2VsZWN0JyApO1xuXHRcdFx0Y29uc3QgdmFsdWVUeXBlICAgICAgICA9ICR2YWx1ZVR5cGVGaWVsZC52YWwoKTtcblx0XHRcdGNvbnN0IGRpc3BsYXlUeXBlcyAgICAgPSBbICdyYW5nZV9jaGVja2JveCcsICdyYW5nZV9yYWRpbycgXTtcblxuXHRcdFx0aWYgKCAkdmFsdWVUeXBlRmllbGQubGVuZ3RoICkge1xuXHRcdFx0XHRpZiAoICdudW1iZXInID09PSB2YWx1ZVR5cGUgKSB7XG5cdFx0XHRcdFx0aWYgKCBkaXNwbGF5VHlwZXMuaW5jbHVkZXMoIHZhbHVlICkgKSB7XG5cdFx0XHRcdFx0XHQkc29mdExpbWl0RmllbGRzLnNob3coKTtcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0JHNvZnRMaW1pdEZpZWxkcy5oaWRlKCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRpZiAoIGRpc3BsYXlUeXBlcy5pbmNsdWRlcyggdmFsdWUgKSApIHtcblx0XHRcdFx0XHQkc29mdExpbWl0RmllbGRzLnNob3coKTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHQkc29mdExpbWl0RmllbGRzLmhpZGUoKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0fSApO1xuXG5cdC8vIFRvZ2dsZSBzb2Z0IGxpbWl0IGZpZWxkcyB3aGVuIHZhbHVlIHR5cGUgaXMgY2hhbmdlZC5cblx0JHNlYXJjaEZvcm0ub24oICdhZnRlcl90b2dnbGVfcmVxdWVzdCcsIGZ1bmN0aW9uKCBlLCBoYW5kbGVyLCB2YWx1ZSwgJGZpZWxkICkge1xuXHRcdGlmICggJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC12YWx1ZV90eXBlIHNlbGVjdCcgPT09IGhhbmRsZXIgKSB7XG5cdFx0XHRjb25zdCAkc29mdExpbWl0RmllbGRzID0gJGZpZWxkLmZpbmQoICcuc29mdC1saW1pdC1maWVsZHMnICk7XG5cblx0XHRcdGNvbnN0ICRudW1iZXJEaXNwbGF5VHlwZUZpZWxkID0gJGZpZWxkLmZpbmQoICcud2NhcGYtZm9ybS1zdWItZmllbGQtbnVtYmVyX2Rpc3BsYXlfdHlwZSBzZWxlY3QnICk7XG5cdFx0XHRjb25zdCBudW1iZXJEaXNwbGF5VHlwZSAgICAgICA9ICRudW1iZXJEaXNwbGF5VHlwZUZpZWxkLnZhbCgpO1xuXHRcdFx0Y29uc3QgbnVtYmVyRGlzcGxheVR5cGVzICAgICAgPSBbICdyYW5nZV9jaGVja2JveCcsICdyYW5nZV9yYWRpbycgXTtcblxuXHRcdFx0Y29uc3QgJHRleHREaXNwbGF5VHlwZUZpZWxkID0gJGZpZWxkLmZpbmQoICcud2NhcGYtZm9ybS1zdWItZmllbGQtZGlzcGxheV90eXBlIHNlbGVjdCcgKTtcblx0XHRcdGNvbnN0IHRleHREaXNwbGF5VHlwZSAgICAgICA9ICR0ZXh0RGlzcGxheVR5cGVGaWVsZC52YWwoKTtcblx0XHRcdGNvbnN0IHRleHREaXNwbGF5VHlwZXMgICAgICA9IFsgJ2NoZWNrYm94JywgJ3JhZGlvJyBdO1xuXG5cdFx0XHRpZiAoICdudW1iZXInID09PSB2YWx1ZSApIHtcblx0XHRcdFx0aWYgKCBudW1iZXJEaXNwbGF5VHlwZXMuaW5jbHVkZXMoIG51bWJlckRpc3BsYXlUeXBlICkgKSB7XG5cdFx0XHRcdFx0JHNvZnRMaW1pdEZpZWxkcy5zaG93KCk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0JHNvZnRMaW1pdEZpZWxkcy5oaWRlKCk7XG5cdFx0XHRcdH1cblx0XHRcdH0gZWxzZSBpZiAoICd0ZXh0JyA9PT0gdmFsdWUgKSB7XG5cdFx0XHRcdGlmICggdGV4dERpc3BsYXlUeXBlcy5pbmNsdWRlcyggdGV4dERpc3BsYXlUeXBlICkgKSB7XG5cdFx0XHRcdFx0JHNvZnRMaW1pdEZpZWxkcy5zaG93KCk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0JHNvZnRMaW1pdEZpZWxkcy5oaWRlKCk7XG5cdFx0XHRcdH1cblx0XHRcdH0gZWxzZSBpZiAoICdkYXRlJyA9PT0gdmFsdWUgKSB7XG5cdFx0XHRcdCRzb2Z0TGltaXRGaWVsZHMuaGlkZSgpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0JHNvZnRMaW1pdEZpZWxkcy5oaWRlKCk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9ICk7XG5cblx0Ly8gU2V0IHRoZSB2YWx1ZSB0eXBlIHdoZW4gcG9zdCBwcm9wZXJ0eSBjaGFuZ2VkLlxuXHQkc2VhcmNoRm9ybS5vbiggJ2FmdGVyX3RvZ2dsZV9yZXF1ZXN0JywgZnVuY3Rpb24oIGUsIGhhbmRsZXIsIHZhbHVlLCAkZmllbGQgKSB7XG5cdFx0aWYgKCAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLXBvc3RfcHJvcGVydHkgc2VsZWN0JyA9PT0gaGFuZGxlciApIHtcblx0XHRcdGNvbnN0ICR2YWx1ZVR5cGUgICAgICAgPSAkZmllbGQuZmluZCggJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC12YWx1ZV90eXBlIHNlbGVjdCcgKTtcblx0XHRcdGNvbnN0IHBhcmFtcyAgICAgICAgICAgPSB3aW5kb3dbICd3Y2FwZl9hZG1pbl9wYXJhbXMnIF07XG5cdFx0XHRjb25zdCBwb3N0UHJvcGVydHlEYXRhID0gcGFyYW1zWyAncG9zdF9wcm9wZXJ0eV9kYXRhJyBdO1xuXG5cdFx0XHRpZiAoICEgcG9zdFByb3BlcnR5RGF0YSApIHtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXG5cdFx0XHRsZXQgdmFsdWVUeXBlID0gcG9zdFByb3BlcnR5RGF0YVsgdmFsdWUgXTtcblxuXHRcdFx0aWYgKCAhIHZhbHVlVHlwZSApIHtcblx0XHRcdFx0dmFsdWVUeXBlID0gJyc7XG5cdFx0XHR9XG5cblx0XHRcdCR2YWx1ZVR5cGUudmFsKCB2YWx1ZVR5cGUgKS5jaGFuZ2UoKTtcblx0XHR9XG5cdH0gKTtcblxufSApO1xuIiwiLyoqXG4gKiBUaGUgcHJvZHVjdCBzdGF0dXMgZmllbGQuXG4gKlxuICogQHNpbmNlICAgICAgMy4wLjBcbiAqIEBwYWNrYWdlICAgIHdjLWFqYXgtcHJvZHVjdC1maWx0ZXJcbiAqIEBzdWJwYWNrYWdlIHdjLWFqYXgtcHJvZHVjdC1maWx0ZXIvYWRtaW4vc3JjL2pzXG4gKiBAYXV0aG9yICAgICBNYWludWwgSGFzc2FuIE1haW5cbiAqL1xuXG5qUXVlcnkoIGRvY3VtZW50ICkucmVhZHkoIGZ1bmN0aW9uKCkge1xuXG5cdGNvbnN0IHRhYmxlSWRlbnRpZmllciA9ICcucHJvZHVjdC1zdGF0dXMtb3B0aW9ucy10YWJsZSc7XG5cdGNvbnN0IHZhbHVlSWRlbnRpZmllciA9ICcud2NhcGYtZm9ybS1zdWItZmllbGQtcHJvZHVjdF9zdGF0dXNfb3B0aW9ucyBpbnB1dCc7XG5cdGNvbnN0IHJvd1RlbXBsYXRlSWQgICA9ICd3Y2FwZi1wcm9kdWN0LXN0YXR1cy1vcHRpb24nO1xuXG5cdGNvbnN0IHJvd0RlZmF1bHRPcHRpb25zID0ge1xuXHRcdHZhbHVlOiAnJyxcblx0XHRsYWJlbDogJycsXG5cdH07XG5cblx0aW5pdE1hbnVhbE9wdGlvbnNUYWJsZSggdGFibGVJZGVudGlmaWVyLCB2YWx1ZUlkZW50aWZpZXIsIHJvd1RlbXBsYXRlSWQsIHJvd0RlZmF1bHRPcHRpb25zICk7XG5cbn0gKTtcbiIsIi8qKlxuICogVGhlIHNlYXJjaCBmb3JtIGZpZWxkLlxuICpcbiAqIEBzaW5jZSAgICAgIDMuMC4wXG4gKiBAcGFja2FnZSAgICB3Yy1hamF4LXByb2R1Y3QtZmlsdGVyXG4gKiBAc3VicGFja2FnZSB3Yy1hamF4LXByb2R1Y3QtZmlsdGVyL2FkbWluL3NyYy9qc1xuICogQGF1dGhvciAgICAgTWFpbnVsIEhhc3NhbiBNYWluXG4gKi9cblxualF1ZXJ5KCBkb2N1bWVudCApLnJlYWR5KCBmdW5jdGlvbiggJCApIHtcblxuXHRjb25zdCAkc2VhcmNoRm9ybSA9ICQoICcjc2VhcmNoLWZvcm0nICk7XG5cblx0Ly8gT3ZlcnJpZGUgbm8tcmVzdWx0cy1tZXNzYWdlLCBhbGwtaXRlbXMtbGFiZWwgZmllbGQncyB0b2dnbGUgdmlzaWJpbGl0eSB3aGVuIHRleHQgZGlzcGxheSB0eXBlIGlzIGNoYW5nZWQuXG5cdCRzZWFyY2hGb3JtLm9uKCAnYWZ0ZXJfdG9nZ2xlX3JlcXVlc3QnLCBmdW5jdGlvbiggZSwgaGFuZGxlciwgdmFsdWUsICRmaWVsZCApIHtcblx0XHRpZiAoICcud2NhcGYtZm9ybS1zdWItZmllbGQtZGlzcGxheV90eXBlIHNlbGVjdCcgPT09IGhhbmRsZXIgKSB7XG5cdFx0XHRjb25zdCAkbm9SZXN1bHRzICAgICA9ICRmaWVsZC5maW5kKCAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLWNob3Nlbl9ub19yZXN1bHRzX21lc3NhZ2UnICk7XG5cdFx0XHRjb25zdCAkYWxsSXRlbXNMYWJlbCA9ICRmaWVsZC5maW5kKCAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLWFsbF9pdGVtc19sYWJlbCcgKTtcblx0XHRcdGNvbnN0IHVzZUNob3NlbiAgICAgID0gJGZpZWxkLmZpbmQoICcud2NhcGYtZm9ybS1zdWItZmllbGQtdXNlX2Nob3NlbiBpbnB1dCcgKS5pcyggJzpjaGVja2VkJyApO1xuXG5cdFx0XHRpZiAoIHVzZUNob3NlbiAmJiAoICdzZWxlY3QnID09PSB2YWx1ZSB8fCAnbXVsdGktc2VsZWN0JyA9PT0gdmFsdWUgKSApIHtcblx0XHRcdFx0JG5vUmVzdWx0cy5zaG93KCk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHQkbm9SZXN1bHRzLmhpZGUoKTtcblx0XHRcdH1cblxuXHRcdFx0aWYgKCAoICdyYWRpbycgPT09IHZhbHVlIHx8ICdzZWxlY3QnID09PSB2YWx1ZSApIHx8ICggJ211bHRpLXNlbGVjdCcgPT09IHZhbHVlICYmIHVzZUNob3NlbiApICkge1xuXHRcdFx0XHQkYWxsSXRlbXNMYWJlbC5zaG93KCk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHQkYWxsSXRlbXNMYWJlbC5oaWRlKCk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9ICk7XG5cblx0Ly8gT3ZlcnJpZGUgbm8tcmVzdWx0cy1tZXNzYWdlLCBhbGwtaXRlbXMtbGFiZWwgZmllbGQncyB0b2dnbGUgdmlzaWJpbGl0eSB3aGVuIHRleHQgdXNlIGNob3NlbiBpcyBjaGFuZ2VkLlxuXHQkc2VhcmNoRm9ybS5vbiggJ2FmdGVyX3RvZ2dsZV9yZXF1ZXN0JywgZnVuY3Rpb24oIGUsIGhhbmRsZXIsIHZhbHVlLCAkZmllbGQgKSB7XG5cdFx0aWYgKCAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLXVzZV9jaG9zZW4gaW5wdXQnID09PSBoYW5kbGVyICkge1xuXHRcdFx0Y29uc3QgJG5vUmVzdWx0cyAgICAgPSAkZmllbGQuZmluZCggJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1jaG9zZW5fbm9fcmVzdWx0c19tZXNzYWdlJyApO1xuXHRcdFx0Y29uc3QgJGFsbEl0ZW1zTGFiZWwgPSAkZmllbGQuZmluZCggJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1hbGxfaXRlbXNfbGFiZWwnICk7XG5cdFx0XHRjb25zdCBkaXNwbGF5VHlwZSAgICA9ICRmaWVsZC5maW5kKCAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLWRpc3BsYXlfdHlwZSBzZWxlY3QnICkudmFsKCk7XG5cblx0XHRcdGlmICggJzEnID09PSB2YWx1ZSAmJiAoICdzZWxlY3QnID09PSBkaXNwbGF5VHlwZSB8fCAnbXVsdGktc2VsZWN0JyA9PT0gZGlzcGxheVR5cGUgKSApIHtcblx0XHRcdFx0JG5vUmVzdWx0cy5zaG93KCk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHQkbm9SZXN1bHRzLmhpZGUoKTtcblx0XHRcdH1cblxuXHRcdFx0aWYgKFxuXHRcdFx0XHQoICcxJyA9PT0gdmFsdWUgJiYgJ211bHRpLXNlbGVjdCcgPT09IGRpc3BsYXlUeXBlIClcblx0XHRcdFx0fHwgKCAncmFkaW8nID09PSBkaXNwbGF5VHlwZSB8fCAnc2VsZWN0JyA9PT0gZGlzcGxheVR5cGUgKVxuXHRcdFx0KSB7XG5cdFx0XHRcdCRhbGxJdGVtc0xhYmVsLnNob3coKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdCRhbGxJdGVtc0xhYmVsLmhpZGUoKTtcblx0XHRcdH1cblx0XHR9XG5cdH0gKTtcblxuXHQvKipcblx0ICogVG9nZ2xlIGRpc2FibGVkIGF0dHJpYnV0ZSBvZiBtaW4tdmFsdWUgZmllbGQgZm9yIG51bWJlciB0eXBlLlxuXHQgKi9cblx0ZnVuY3Rpb24gdG9nZ2xlTnVtYmVyTWluVmFsdWVGaWVsZCggJGVsbSApIHtcblx0XHRjb25zdCAkZmllbGQgICAgID0gJGVsbS5jbG9zZXN0KCAnLndjYXBmLWZvcm0tZmllbGQnICk7XG5cdFx0Y29uc3QgJHRleHRGaWVsZCA9ICRmaWVsZC5maW5kKCAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLW1pbl92YWx1ZSBpbnB1dFt0eXBlPVwidGV4dFwiXScgKTtcblxuXHRcdGlmICggJGVsbS5pcyggJzpjaGVja2VkJyApICkge1xuXHRcdFx0JHRleHRGaWVsZC5hdHRyKCAnZGlzYWJsZWQnLCAnZGlzYWJsZWQnICk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdCR0ZXh0RmllbGQucmVtb3ZlQXR0ciggJ2Rpc2FibGVkJyApO1xuXHRcdH1cblx0fVxuXG5cdCRzZWFyY2hGb3JtLmZpbmQoICcud2NhcGYtZm9ybS1zdWItZmllbGQtbWluX3ZhbHVlX2F1dG9fZGV0ZWN0IGlucHV0W3R5cGU9XCJjaGVja2JveFwiXScgKS5lYWNoKCBmdW5jdGlvbigpIHtcblx0XHRjb25zdCAkdGhpcyA9ICQoIHRoaXMgKTtcblxuXHRcdHRvZ2dsZU51bWJlck1pblZhbHVlRmllbGQoICR0aGlzICk7XG5cdH0gKTtcblxuXHQkc2VhcmNoRm9ybS5vbihcblx0XHQnY2xpY2snLFxuXHRcdCcud2NhcGYtZm9ybS1zdWItZmllbGQtbWluX3ZhbHVlX2F1dG9fZGV0ZWN0IGlucHV0W3R5cGU9XCJjaGVja2JveFwiXScsXG5cdFx0ZnVuY3Rpb24oKSB7XG5cdFx0XHRjb25zdCAkdGhpcyA9ICQoIHRoaXMgKTtcblxuXHRcdFx0dG9nZ2xlTnVtYmVyTWluVmFsdWVGaWVsZCggJHRoaXMgKTtcblx0XHR9XG5cdCk7XG5cblx0LyoqXG5cdCAqIFRvZ2dsZSBkaXNhYmxlZCBhdHRyaWJ1dGUgb2YgbWF4LXZhbHVlIGZpZWxkIGZvciBudW1iZXIgdHlwZS5cblx0ICovXG5cdGZ1bmN0aW9uIHRvZ2dsZU51bWJlck1heFZhbHVlRmllbGQoICRlbG0gKSB7XG5cdFx0Y29uc3QgJGZpZWxkICAgICA9ICRlbG0uY2xvc2VzdCggJy53Y2FwZi1mb3JtLWZpZWxkJyApO1xuXHRcdGNvbnN0ICR0ZXh0RmllbGQgPSAkZmllbGQuZmluZCggJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1tYXhfdmFsdWUgaW5wdXRbdHlwZT1cInRleHRcIl0nICk7XG5cblx0XHRpZiAoICRlbG0uaXMoICc6Y2hlY2tlZCcgKSApIHtcblx0XHRcdCR0ZXh0RmllbGQuYXR0ciggJ2Rpc2FibGVkJywgJ2Rpc2FibGVkJyApO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHQkdGV4dEZpZWxkLnJlbW92ZUF0dHIoICdkaXNhYmxlZCcgKTtcblx0XHR9XG5cdH1cblxuXHQkc2VhcmNoRm9ybS5maW5kKCAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLW1heF92YWx1ZV9hdXRvX2RldGVjdCBpbnB1dFt0eXBlPVwiY2hlY2tib3hcIl0nICkuZWFjaCggZnVuY3Rpb24oKSB7XG5cdFx0Y29uc3QgJHRoaXMgPSAkKCB0aGlzICk7XG5cblx0XHR0b2dnbGVOdW1iZXJNYXhWYWx1ZUZpZWxkKCAkdGhpcyApO1xuXHR9ICk7XG5cblx0JHNlYXJjaEZvcm0ub24oXG5cdFx0J2NsaWNrJyxcblx0XHQnLndjYXBmLWZvcm0tc3ViLWZpZWxkLW1heF92YWx1ZV9hdXRvX2RldGVjdCBpbnB1dFt0eXBlPVwiY2hlY2tib3hcIl0nLFxuXHRcdGZ1bmN0aW9uKCkge1xuXHRcdFx0Y29uc3QgJHRoaXMgPSAkKCB0aGlzICk7XG5cblx0XHRcdHRvZ2dsZU51bWJlck1heFZhbHVlRmllbGQoICR0aGlzICk7XG5cdFx0fVxuXHQpO1xuXG59ICk7XG4iLCIvKipcbiAqIFRoZSBzZWFyY2ggZm9ybS5cbiAqXG4gKiBAc2luY2UgICAgICAzLjAuMFxuICogQHBhY2thZ2UgICAgd2MtYWpheC1wcm9kdWN0LWZpbHRlclxuICogQHN1YnBhY2thZ2Ugd2MtYWpheC1wcm9kdWN0LWZpbHRlci9hZG1pbi9zcmMvanNcbiAqIEBhdXRob3IgICAgIE1haW51bCBIYXNzYW4gTWFpblxuICovXG5cbmNvbnN0IHRvdGFsRmllbGRJbnN0YW5jZXMgPSBqUXVlcnkoICcjdG90YWxfZmllbGRfaW5zdGFuY2VzJyApO1xuXG5jb25zdCBzZWFyY2hGb3JtID0galF1ZXJ5KCAnI3NlYXJjaC1mb3JtJyApO1xuXG4vKipcbiAqIEFzc2lnbiBhIHVuaXF1ZSBpZCBieSByZXBsYWNpbmcgdGhlIHBsYWNlaG9sZGVyIGlkLlxuICovXG5mdW5jdGlvbiByZW1vdmVQbGFjZWhvbGRlciggdW5pcXVlSWQsIGVsZW1lbnRzLCBhdHRyICkge1xuXHRlbGVtZW50cy5lYWNoKFxuXHRcdGZ1bmN0aW9uKCkge1xuXHRcdFx0Y29uc3QgZWxlbWVudCA9IGpRdWVyeSggdGhpcyApO1xuXG5cdFx0XHRjb25zdCBvbGRWYWx1ZSA9IGVsZW1lbnQuYXR0ciggYXR0ciApO1xuXHRcdFx0Y29uc3QgbmV3VmFsdWUgPSBvbGRWYWx1ZS5yZXBsYWNlKCAnJSUnLCB1bmlxdWVJZCApO1xuXG5cdFx0XHRlbGVtZW50LmF0dHIoIGF0dHIsIG5ld1ZhbHVlICk7XG5cdFx0fVxuXHQpO1xufVxuXG4vKipcbiAqIEluc2VydCB0aGUgZmllbGQncyBzdWJmaWVsZHMuXG4gKi9cbmZ1bmN0aW9uIGluc2VydEZpZWxkU3ViRmllbGRzKCB1aSApIHtcblx0Ly8gSW5zZXJ0IHRoZSBmaWVsZCdzIHN1YmZpZWxkcyBpZiBub3QgYWxyZWFkeSBpbnNlcnRlZC5cblx0aWYgKCAhIHVpLml0ZW0uaGFzQ2xhc3MoICdzdWItZmllbGRzLXJlYWR5JyApICkge1xuXHRcdGNvbnN0IHR5cGUgICAgICA9IHVpLml0ZW0uYXR0ciggJ2RhdGEtZmllbGQtdHlwZScgKTtcblx0XHRjb25zdCB1bmlxdWVJZCAgPSBwYXJzZUludCggdG90YWxGaWVsZEluc3RhbmNlcy52YWwoKSApO1xuXHRcdGNvbnN0IGZpZWxkVHlwZSA9ICd3Y2FwZi1mb3JtLWZpZWxkLScgKyB0eXBlO1xuXG5cdFx0Ly8gQmFpbCBvdXQgaWYgbm8gdG1wbCBmb3VuZCBmb3IgdGhlIHR5cGUuXG5cdFx0aWYgKCAhIGpRdWVyeSggJyN0bXBsLScgKyBmaWVsZFR5cGUgKS5sZW5ndGggKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0Ly8gSW5jcmVtZW50IHRoZSB2YWx1ZSBvZiB0b3RhbCBmaWVsZCBpbnN0YW5jZXMuXG5cdFx0dG90YWxGaWVsZEluc3RhbmNlcy52YWwoIHVuaXF1ZUlkICsgMSApO1xuXG5cdFx0Y29uc3QgdGVtcGxhdGUgPSB3cC50ZW1wbGF0ZSggZmllbGRUeXBlICk7XG5cdFx0Y29uc3QgcmVuZGVyZWQgPSB0ZW1wbGF0ZSgpO1xuXHRcdGNvbnN0IHdyYXBwZXIgID0gdWkuaXRlbS5maW5kKCAnLndpZGdldC1jb250ZW50JyApO1xuXG5cdFx0d3JhcHBlci5wcmVwZW5kKCByZW5kZXJlZCApO1xuXG5cdFx0Ly8gVXBkYXRlIHRoZSBmb3IgYXR0cmlidXRlcyBvZiB0aGUgbGFiZWxzLlxuXHRcdHJlbW92ZVBsYWNlaG9sZGVyKCB1bmlxdWVJZCwgdWkuaXRlbS5maW5kKCAnbGFiZWxbZm9yXj1cIndjYXBmLWlucHV0LVwiXScgKSwgJ2ZvcicgKTtcblxuXHRcdC8vIFVwZGF0ZSB0aGUgaWRzIG9mIHRoZSBpbnB1dCBlbGVtZW50cy5cblx0XHRyZW1vdmVQbGFjZWhvbGRlciggdW5pcXVlSWQsIHVpLml0ZW0uZmluZCggJypbaWRePVwid2NhcGYtaW5wdXQtXCJdJyApLCAnaWQnICk7XG5cblx0XHQvLyBVcGRhdGUgdGhlIG5hbWVzIG9mIHRoZSBpbnB1dCBlbGVtZW50cy5cblx0XHRyZW1vdmVQbGFjZWhvbGRlciggdW5pcXVlSWQsIHVpLml0ZW0uZmluZCggJypbaWRePVwid2NhcGYtaW5wdXQtXCJdJyApLCAnbmFtZScgKTtcblxuXHRcdC8vIFVwZGF0ZSB0aGUgcG9zaXRpb24gdmFsdWUuXG5cdFx0cmVtb3ZlUGxhY2Vob2xkZXIoIHVuaXF1ZUlkLCB1aS5pdGVtLmZpbmQoICcqW2lkXj1cIndjYXBmLWlucHV0LXBvc2l0aW9uLVwiXScgKSwgJ3ZhbHVlJyApO1xuXG5cdFx0dWkuaXRlbS5hZGRDbGFzcyggJ3N1Yi1maWVsZHMtcmVhZHknICk7XG5cblx0XHRzZWFyY2hGb3JtLnRyaWdnZXIoICdmaWVsZF9hZGRlZCcsIFsgdWkgXSApO1xuXHR9XG59XG5cbi8qKlxuICogVXBkYXRlIHRoZSBmb3JtIGZpZWxkJ3MgcG9zaXRpb24gYWZ0ZXIgc29ydC5cbiAqXG4gKiBAc291cmNlIGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vYS8xNDczNjc3NVxuICovXG5mdW5jdGlvbiB1cGRhdGVGaWVsZHNQb3NpdGlvbigpIHtcblx0Y29uc3QgaW5wdXRzICA9IHNlYXJjaEZvcm0uZmluZCggJypbaWRePVwid2NhcGYtaW5wdXQtcG9zaXRpb24tXCJdJyApO1xuXHRjb25zdCBuYkVsZW1zID0gaW5wdXRzLmxlbmd0aDtcblxuXHRpbnB1dHMuZWFjaChcblx0XHRmdW5jdGlvbiggaWR4ICkge1xuXHRcdFx0alF1ZXJ5KCB0aGlzICkudmFsKCBuYkVsZW1zIC0gKCBuYkVsZW1zIC0gaWR4ICkgKTtcblx0XHR9XG5cdCk7XG59XG5cbi8qKlxuICogTWFrZSB0aGUgZmllbGQgcmVhZHksIHJlbW92ZSBzdHlsZXMgY29tZXMgZnJvbSBqcXVlcnktdWktc29ydGFibGUgcGx1Z2luLCBpbnNlcnQgdGhlIGZpZWxkJ3Mgc3ViZmllbGRzIGV0Yy5cbiAqL1xuZnVuY3Rpb24gbWFrZUZpZWxkUmVhZHkoIGUsIHVpICkge1xuXHQvLyBSZW1vdmUgc3R5bGVzIGNvbWVzIGZyb20ganF1ZXJ5LXVpLXNvcnRhYmxlIHBsdWdpbi5cblx0dWkuaXRlbS5yZW1vdmVBdHRyKCAnc3R5bGUnICk7XG5cblx0aW5zZXJ0RmllbGRTdWJGaWVsZHMoIHVpICk7XG5cblx0dXBkYXRlRmllbGRzUG9zaXRpb24oKTtcblxuXHRjb25zdCB0b2dnbGVCdG4gPSB1aS5pdGVtLmZpbmQoICcud2lkZ2V0LWFjdGlvbicgKTtcblxuXHQvLyBFeHBhbmQgdGhlIGZvcm0gZmllbGQgYWZ0ZXIgc29ydC5cblx0aWYgKCAnZmFsc2UnID09PSB0b2dnbGVCdG4uYXR0ciggJ2FyaWEtZXhwYW5kZWQnICkgKSB7XG5cdFx0dG9nZ2xlQnRuLnRyaWdnZXIoICdjbGljaycgKTtcblx0fVxufVxuXG4vKipcbiAqIEluc3RhbnRpYXRlIHNvcnRhYmxlIGZvciB0aGUgZm9ybSBmaWVsZHMuXG4gKi9cbmZ1bmN0aW9uIHNvcnRhYmxlKCBpZGVudGlmaWVyICkge1xuXHRjb25zdCBjb250YWluZXIgPSBqUXVlcnkoIGlkZW50aWZpZXIgKTtcblxuXHRjb250YWluZXIuc29ydGFibGUoXG5cdFx0e1xuXHRcdFx0b3BhY2l0eTogMC44LFxuXHRcdFx0cmV2ZXJ0OiBmYWxzZSxcblx0XHRcdGN1cnNvcjogJ21vdmUnLFxuXHRcdFx0YXhpczogJ3knLFxuXHRcdFx0aGFuZGxlOiAnLndpZGdldC10b3AnLFxuXHRcdFx0Y2FuY2VsOiAnLndpZGdldC10aXRsZS1hY3Rpb24nLFxuXHRcdFx0aXRlbXM6ICcud2lkZ2V0Jyxcblx0XHRcdHBsYWNlaG9sZGVyOiAnd2lkZ2V0LXBsYWNlaG9sZGVyJyxcblx0XHRcdGNvbm5lY3RXaXRoOiAnI3NlYXJjaC1mb3JtLXdyYXBwZXInLFxuXHRcdFx0c3RvcDogbWFrZUZpZWxkUmVhZHksXG5cdFx0XHRzdGFydDogZnVuY3Rpb24oIGUsIHVpICkge1xuXHRcdFx0XHQvLyBJZiBpdCBpcyBnZXR0aW5nIGFwcGVuZGVkIHRvIHRoZSB3cm9uZyBwbGFjZSwgdGhlbiBmb3JjZSBpdCBpbnRvIHRoZSByaWdodCBjb250YWluZXIuXG5cdFx0XHRcdHVpLnBsYWNlaG9sZGVyLmFwcGVuZFRvKCB1aS5wbGFjZWhvbGRlci5wYXJlbnQoKS5maW5kKCAnLmluc2lkZSAjc2VhcmNoLWZvcm0td3JhcHBlcicgKSApO1xuXHRcdFx0fVxuXHRcdH1cblx0KTtcbn1cblxuc29ydGFibGUoICcjc2VhcmNoLWZvcm0nICk7XG5cbi8qKlxuICogUnVuIGZ1bmN0aW9uIHdoZW4gZHJhZyBzdGFydHMuXG4gKi9cbmZ1bmN0aW9uIG9uRHJhZ1N0YXJ0KCkge1xuXHRzZWFyY2hGb3JtLmFkZENsYXNzKCAndWktZHJvcC1hY3RpdmUnICk7XG59XG5cbi8qKlxuICogUnVuIGZ1bmN0aW9uIGF0IGRyYWcgc3RvcC5cbiAqL1xuZnVuY3Rpb24gb25EcmFnU3RvcCgpIHtcblx0c2VhcmNoRm9ybS5yZW1vdmVDbGFzcyggJ3VpLWRyb3AtYWN0aXZlJyApO1xufVxuXG4vKipcbiAqIEluaXRpYWxpemUgZHJhZ2dhYmxlIGZvciB0aGUgZm9ybSBmaWVsZHMuXG4gKi9cbmpRdWVyeSggJyNhdmFpbGFibGUtZmllbGRzIC53aWRnZXQnICkuZHJhZ2dhYmxlKFxuXHR7XG5cdFx0Y29ubmVjdFRvU29ydGFibGU6ICcjc2VhcmNoLWZvcm0nLFxuXHRcdGhlbHBlcjogJ2Nsb25lJyxcblx0XHRzdGFydDogb25EcmFnU3RhcnQsXG5cdFx0c3RvcDogb25EcmFnU3RvcCxcblx0fVxuKTtcblxuLyoqXG4gKiBUb2dnbGUgdGhlIGZvcm0gZmllbGQuXG4gKi9cbmZ1bmN0aW9uIHRvZ2dsZUZpZWxkKCBlICkge1xuXHRjb25zdCB0YXJnZXQgICAgICAgPSBlLnRhcmdldDtcblx0Y29uc3Qgd2lkZ2V0ICAgICAgID0galF1ZXJ5KCB0aGlzICkuY2xvc2VzdCggJy53aWRnZXQnICk7XG5cdGNvbnN0IHRvZ2dsZUJ0biAgICA9IHdpZGdldC5maW5kKCAnLndpZGdldC1hY3Rpb24nICk7XG5cdGNvbnN0IGluc2lkZSAgICAgICA9IHdpZGdldC5jaGlsZHJlbiggJy53aWRnZXQtaW5zaWRlJyApO1xuXHRjb25zdCBpc0V4cGFuZCAgICAgPSB0b2dnbGVCdG4uYXR0ciggJ2FyaWEtZXhwYW5kZWQnICk7XG5cdGNvbnN0IHRvZ2dsZUV4cGFuZCA9ICd0cnVlJyA9PT0gaXNFeHBhbmQgPyAnZmFsc2UnIDogJ3RydWUnO1xuXG5cdHRvZ2dsZUJ0bi5hdHRyKCAnYXJpYS1leHBhbmRlZCcsIHRvZ2dsZUV4cGFuZCApO1xuXHRqUXVlcnkoIGluc2lkZSApLnNsaWRlVG9nZ2xlKFxuXHRcdCdmYXN0Jyxcblx0XHRmdW5jdGlvbigpIHtcblx0XHRcdHdpZGdldC50b2dnbGVDbGFzcyggJ29wZW4nICk7XG5cdFx0XHRzZWFyY2hGb3JtLnRyaWdnZXIoICd3aWRnZXQtY2xvc2VkJywgWyB0YXJnZXQgXSApO1xuXHRcdH1cblx0KTtcbn1cblxuc2VhcmNoRm9ybS5vbiggJ2NsaWNrJywgJy53aWRnZXQtdG9wJywgdG9nZ2xlRmllbGQgKTtcbnNlYXJjaEZvcm0ub24oICdjbGljaycsICcud2lkZ2V0LWNvbnRyb2wtY2xvc2UnLCB0b2dnbGVGaWVsZCApO1xuXG4vKipcbiAqIEZvY3VzIHRoZSBmb3JtIGZpZWxkJ3MgZXhwYW5kIGJ1dHRvbi5cbiAqL1xuZnVuY3Rpb24gZm9jdXNGaWVsZCggZSwgdGFyZ2V0ICkge1xuXHRpZiAoIHRhcmdldC5jbGFzc0xpc3QuY29udGFpbnMoICd3aWRnZXQtY29udHJvbC1jbG9zZScgKSApIHtcblx0XHRjb25zdCB3aWRnZXQgPSBqUXVlcnkoIHRhcmdldCApLmNsb3Nlc3QoICcud2lkZ2V0JyApO1xuXHRcdGNvbnN0IGFjdGlvbiA9IHdpZGdldC5maW5kKCAnLndpZGdldC1hY3Rpb24nICk7XG5cblx0XHRhY3Rpb24uYXR0ciggJ2FyaWEtZXhwYW5kZWQnLCAnZmFsc2UnICkuZm9jdXMoKTtcblx0fVxufVxuXG5zZWFyY2hGb3JtLm9uKCAnd2lkZ2V0LWNsb3NlZCcsIGZvY3VzRmllbGQgKTtcblxuLyoqXG4gKiBSZW1vdmUgdGhlIGZpZWxkLlxuICovXG5mdW5jdGlvbiByZW1vdmVGaWVsZCgpIHtcblx0Y29uc3Qgd2lkZ2V0ID0galF1ZXJ5KCB0aGlzICkuY2xvc2VzdCggJy53aWRnZXQnICk7XG5cblx0alF1ZXJ5KCB3aWRnZXQgKS5zbGlkZVVwKFxuXHRcdCdmYXN0Jyxcblx0XHRmdW5jdGlvbigpIHtcblx0XHRcdHdpZGdldC5yZW1vdmUoKTtcblx0XHRcdHVwZGF0ZUZpZWxkc1Bvc2l0aW9uKCk7XG5cdFx0fVxuXHQpO1xufVxuXG5zZWFyY2hGb3JtLm9uKCAnY2xpY2snLCAnLndpZGdldC1jb250cm9sLXJlbW92ZScsIHJlbW92ZUZpZWxkICk7XG5cbi8qKlxuICogU3RvcmUgdGhlIGluaXRpYWwgZm9ybSBkYXRhIGludG8gYSB2YXJpYWJsZSBzbyB0aGF0IHdlIGNhbiBjb21wYXJlIGl0IHdoZW4gbGVhdmluZyB0aGUgcGFnZS5cbiAqL1xubGV0IGluaXRpYWxGb3JtU3RhdGUgPSBzZWFyY2hGb3JtLnNlcmlhbGl6ZUFycmF5KCk7XG5cbi8qKlxuICogU2hvdyBtZXNzYWdlIGFmdGVyIGZvcm0gc3VibWlzc2lvbi5cbiAqL1xuZnVuY3Rpb24gc2hvd01lc3NhZ2UoIG1lc3NhZ2UsIHR5cGUgPSAnc3VjY2VzcycgKSB7XG5cdGNvbnN0IGVsZW1lbnQgPSBqUXVlcnkoICc8cCBjbGFzcz1cIicgKyB0eXBlICsgJ1wiPicgKyBtZXNzYWdlICsgJzwvcD4nICk7XG5cdGNvbnN0IHdyYXBwZXIgPSBqUXVlcnkoICcud2NhcGYtbWVzc2FnZS13cmFwcGVyJyApO1xuXG5cdGlmICggISB3cmFwcGVyLmlzKCAnOmVtcHR5JyApICkge1xuXHRcdHJldHVybjtcblx0fVxuXG5cdGpRdWVyeSggd3JhcHBlciApLmh0bWwoIGVsZW1lbnQgKS5zbGlkZURvd24oICdmYXN0JyApO1xuXG5cdHNldFRpbWVvdXQoXG5cdFx0ZnVuY3Rpb24oKSB7XG5cdFx0XHRqUXVlcnkoIHdyYXBwZXIgKS5zbGlkZVVwKCAnZmFzdCcgKTtcblx0XHRcdHdyYXBwZXIuaHRtbCggJycgKTtcblx0XHR9LFxuXHRcdDMwMDBcblx0KTtcbn1cblxuLyoqXG4gKiBTYXZlIHRoZSBzZWFyY2ggZm9ybS5cbiAqL1xuZnVuY3Rpb24gc2F2ZUZvcm0oKSB7XG5cdGNvbnN0IGJ1dHRvbiAgID0galF1ZXJ5KCB0aGlzICk7XG5cdGNvbnN0IGZvcm1EYXRhID0gc2VhcmNoRm9ybS5zZXJpYWxpemVBcnJheSgpO1xuXG5cdGJ1dHRvbi5hdHRyKCAnZGlzYWJsZWQnLCAnZGlzYWJsZWQnICk7XG5cblx0ZnVuY3Rpb24gb2tDYWxsYmFjayggbWVzc2FnZSApIHtcblx0XHRidXR0b24ucmVtb3ZlQXR0ciggJ2Rpc2FibGVkJyApO1xuXG5cdFx0Ly8gVXBkYXRlIHRoZSBpbml0aWFsIGZvcm0gZGF0YSBhZnRlciBzdWNjZXNzZnVsbHkgc2F2aW5nIHRoZSBmb3JtLlxuXHRcdGluaXRpYWxGb3JtU3RhdGUgPSBmb3JtRGF0YTtcblxuXHRcdHNob3dNZXNzYWdlKCBtZXNzYWdlICk7XG5cdH1cblxuXHRmdW5jdGlvbiBlcnJDYWxsYmFjayggbWVzc2FnZSApIHtcblx0XHRidXR0b24ucmVtb3ZlQXR0ciggJ2Rpc2FibGVkJyApO1xuXHRcdHNob3dNZXNzYWdlKCBtZXNzYWdlLCAnZXJyb3InICk7XG5cdH1cblxuXHQvLyBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL2EvNTkxODEyNTJcblx0d3AuYWpheC5wb3N0KCBmb3JtRGF0YSApLmRvbmUoIG9rQ2FsbGJhY2sgKS5mYWlsKCBlcnJDYWxsYmFjayApO1xufVxuXG5qUXVlcnkoICcjcG9zdGJveC1jb250YWluZXItMScgKS5vbiggJ2NsaWNrJywgJ2J1dHRvbicsIHNhdmVGb3JtICk7XG5cbi8qKlxuICogU2hvdyBhbGVydCBvbiBsZWF2ZSBpZiB0aGUgZm9ybSBpcyBkaXJ0eS5cbiAqXG4gKiBUT0RPOiBVbmNvbW1lbnQgdGhpcy5cbiAqL1xuLy8gd2luZG93Lm9uYmVmb3JldW5sb2FkID0gZnVuY3Rpb24oKSB7XG4vLyBcdGNvbnN0IG5ld0Zvcm1TdGF0ZSA9IHNlYXJjaEZvcm0uc2VyaWFsaXplQXJyYXkoKTtcbi8vXG4vLyBcdGNvbnN0IGlzRm9ybURpcnR5ID0gISBfLmlzRXF1YWwoIG5ld0Zvcm1TdGF0ZSwgaW5pdGlhbEZvcm1TdGF0ZSApO1xuLy9cbi8vIFx0aWYgKCBpc0Zvcm1EaXJ0eSApIHtcbi8vIFx0XHRyZXR1cm4gJyc7XG4vLyBcdH1cbi8vIH07XG4iLCIvKipcbiAqIFRoZSBwcm9kdWN0IHN0YXR1cyBmaWVsZC5cbiAqXG4gKiBAc2luY2UgICAgICAzLjAuMFxuICogQHBhY2thZ2UgICAgd2MtYWpheC1wcm9kdWN0LWZpbHRlclxuICogQHN1YnBhY2thZ2Ugd2MtYWpheC1wcm9kdWN0LWZpbHRlci9hZG1pbi9zcmMvanNcbiAqIEBhdXRob3IgICAgIE1haW51bCBIYXNzYW4gTWFpblxuICovXG5cbmpRdWVyeSggZG9jdW1lbnQgKS5yZWFkeSggZnVuY3Rpb24oICQgKSB7XG5cblx0Y29uc3QgJHNlYXJjaEZvcm0gPSAkKCAnI3NlYXJjaC1mb3JtJyApO1xuXG5cdGZ1bmN0aW9uIHRyaWdnZXJTb3J0QnlPcHRpb25zQ2hhbmdlKCAkZmllbGQgKSB7XG5cdFx0Y29uc3QgJHZhbHVlSG9sZGVyICA9ICRmaWVsZC5maW5kKCAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLXNvcnRfYnlfb3B0aW9ucyBpbnB1dCcgKTtcblx0XHRjb25zdCAkb3B0aW9uc1RhYmxlID0gJGZpZWxkLmZpbmQoICcuc29ydC1ieS1vcHRpb25zLXRhYmxlJyApO1xuXHRcdGNvbnN0ICRyb3dzICAgICAgICAgPSAkb3B0aW9uc1RhYmxlLmZpbmQoICcubWFudWFsLW9wdGlvbnMtdGFibGUtYm9keS1yb3dzJyApO1xuXHRcdGNvbnN0IF9yb3dzICAgICAgICAgPSBbXTtcblxuXHRcdCRyb3dzLmZpbmQoICcuc29ydC1vcHRpb24taXRlbScgKS5lYWNoKCBmdW5jdGlvbiggaSwgX2l0ZW0gKSB7XG5cdFx0XHRjb25zdCAkaXRlbSAgICAgICAgICA9ICQoIF9pdGVtICk7XG5cdFx0XHRjb25zdCB2YWx1ZSAgICAgICAgICA9ICRpdGVtLmZpbmQoICcub3B0aW9uX3ZhbHVlJyApLnZhbCgpO1xuXHRcdFx0Y29uc3QgZGlyZWN0aW9uICAgICAgPSAkaXRlbS5maW5kKCAnLm9wdGlvbl9kaXJlY3Rpb24nICkudmFsKCk7XG5cdFx0XHRjb25zdCBsYWJlbCAgICAgICAgICA9ICRpdGVtLmZpbmQoICcub3B0aW9uX2xhYmVsJyApLnZhbCgpO1xuXHRcdFx0Y29uc3QgbWV0YV9rZXkgICAgICAgPSAkaXRlbS5maW5kKCAnLm9wdGlvbl9tZXRhX2tleScgKS52YWwoKTtcblx0XHRcdGNvbnN0IG1ldGFfc29ydF90eXBlID0gJGl0ZW0uZmluZCggJy5vcHRpb25fbWV0YV9zb3J0X3R5cGUnICkudmFsKCk7XG5cblx0XHRcdGlmICggdmFsdWUgKSB7XG5cdFx0XHRcdF9yb3dzLnB1c2goIFsgdmFsdWUsIGRpcmVjdGlvbiwgbGFiZWwsIG1ldGFfa2V5LCBtZXRhX3NvcnRfdHlwZSBdICk7XG5cdFx0XHR9XG5cdFx0fSApO1xuXG5cdFx0Y29uc3QgcmF3VmFsdWVzID0gZW5jb2RlVVJJQ29tcG9uZW50KCBKU09OLnN0cmluZ2lmeSggX3Jvd3MgKSApO1xuXHRcdCR2YWx1ZUhvbGRlci52YWwoIHJhd1ZhbHVlcyApO1xuXHR9XG5cblx0ZnVuY3Rpb24gaW5pdFNvcnRhYmxlRm9yU29ydEJ5T3B0aW9ucyggJHNlbGVjdG9yICkge1xuXHRcdCRzZWxlY3Rvci5zb3J0YWJsZSgge1xuXHRcdFx0b3BhY2l0eTogMC44LFxuXHRcdFx0cmV2ZXJ0OiBmYWxzZSxcblx0XHRcdGN1cnNvcjogJ21vdmUnLFxuXHRcdFx0YXhpczogJ3knLFxuXHRcdFx0aGFuZGxlOiAnLm1vdmUtb3B0aW9ucy1oYW5kbGVyJyxcblx0XHRcdHBsYWNlaG9sZGVyOiAnd2lkZ2V0LXBsYWNlaG9sZGVyJyxcblx0XHRcdHVwZGF0ZTogZnVuY3Rpb24oIGUgKSB7XG5cdFx0XHRcdGNvbnN0ICRmaWVsZCA9ICQoIGUudGFyZ2V0ICkuY2xvc2VzdCggJy53Y2FwZi1mb3JtLWZpZWxkJyApO1xuXG5cdFx0XHRcdHRyaWdnZXJTb3J0QnlPcHRpb25zQ2hhbmdlKCAkZmllbGQgKTtcblx0XHRcdH1cblx0XHR9ICkuZGlzYWJsZVNlbGVjdGlvbigpO1xuXHR9XG5cblx0Ly8gU29ydCBNYW51YWwgT3B0aW9uc1xuXHRpbml0U29ydGFibGVGb3JTb3J0QnlPcHRpb25zKCAkc2VhcmNoRm9ybS5maW5kKCAnLnNvcnQtYnktb3B0aW9ucy10YWJsZSAubWFudWFsLW9wdGlvbnMtdGFibGUtYm9keS1yb3dzJyApICk7XG5cblx0JHNlYXJjaEZvcm0ub24oICdmaWVsZF9hZGRlZCcsIGZ1bmN0aW9uKCBlLCB1aSApIHtcblx0XHQvLyBJbml0IFNvcnRhYmxlIGZvciB0aGUgbWFudWFsIG9wdGlvbnMuXG5cdFx0aW5pdFNvcnRhYmxlRm9yU29ydEJ5T3B0aW9ucyggJCggdWkuaXRlbS5maW5kKCAnLm1hbnVhbC1vcHRpb25zLXRhYmxlLWJvZHktcm93cycgKSApICk7XG5cdH0gKTtcblxuXHRmdW5jdGlvbiB0cmlnZ2VyUmVtb3ZlU29ydEJ5T3B0aW9uKCAkZmllbGQgKSB7XG5cdFx0Y29uc3QgJG9wdGlvbnNUYWJsZSA9ICRmaWVsZC5maW5kKCAnLnNvcnQtYnktb3B0aW9ucy10YWJsZScgKTtcblx0XHRjb25zdCB0YWJsZVJvd3MgICAgID0gJG9wdGlvbnNUYWJsZS5maW5kKCAnLm1hbnVhbC1vcHRpb25zLXRhYmxlLWJvZHktcm93cycgKS5jaGlsZHJlbigpO1xuXG5cdFx0aWYgKCAyID4gdGFibGVSb3dzLmxlbmd0aCApIHtcblx0XHRcdCRvcHRpb25zVGFibGUucmVtb3ZlQ2xhc3MoICdoYXMtb3B0aW9ucycgKTtcblx0XHR9XG5cdH1cblxuXHQvLyBSZW1vdmUgU2luZ2xlIE51bWJlciBPcHRpb25cblx0JHNlYXJjaEZvcm0ub24oICdjbGljaycsICcucmVtb3ZlLXNvcnQtYnktb3B0aW9uJywgZnVuY3Rpb24oKSB7XG5cdFx0Y29uc3QgJGl0ZW0gID0gJCggdGhpcyApLmNsb3Nlc3QoICcuc29ydC1vcHRpb24taXRlbScgKTtcblx0XHRjb25zdCAkZmllbGQgPSAkaXRlbS5jbG9zZXN0KCAnLndjYXBmLWZvcm0tZmllbGQnICk7XG5cblx0XHR0cmlnZ2VyUmVtb3ZlU29ydEJ5T3B0aW9uKCAkZmllbGQgKTtcblxuXHRcdCRpdGVtLnJlbW92ZSgpO1xuXG5cdFx0dHJpZ2dlclNvcnRCeU9wdGlvbnNDaGFuZ2UoICRmaWVsZCApO1xuXHR9ICk7XG5cblx0Ly8gQ2xlYXIgQWxsIE9wdGlvbnNcblx0JHNlYXJjaEZvcm0ub24oICdjbGljaycsICcuY2xlYXItYWxsLXNvcnQtYnktb3B0aW9ucycsIGZ1bmN0aW9uKCkge1xuXHRcdGNvbnN0ICRmaWVsZCAgICAgICAgPSAkKCB0aGlzICkuY2xvc2VzdCggJy53Y2FwZi1mb3JtLWZpZWxkJyApO1xuXHRcdGNvbnN0ICRvcHRpb25zVGFibGUgPSAkZmllbGQuZmluZCggJy5zb3J0LWJ5LW9wdGlvbnMtdGFibGUnICk7XG5cblx0XHQkb3B0aW9uc1RhYmxlLmZpbmQoICcubWFudWFsLW9wdGlvbnMtdGFibGUtYm9keS1yb3dzJyApLmVtcHR5KCk7XG5cblx0XHR0cmlnZ2VyUmVtb3ZlU29ydEJ5T3B0aW9uKCAkZmllbGQgKTtcblxuXHRcdHRyaWdnZXJTb3J0QnlPcHRpb25zQ2hhbmdlKCAkZmllbGQgKTtcblx0fSApO1xuXG5cdC8vIEFkZCBOZXcgT3B0aW9uXG5cdCRzZWFyY2hGb3JtLm9uKCAnY2xpY2snLCAnLmFkZC1zb3J0LWJ5LW9wdGlvbicsIGZ1bmN0aW9uKCkge1xuXHRcdGNvbnN0IGZpZWxkVHlwZSA9ICd3Y2FwZi1zb3J0LWJ5LW9wdGlvbic7XG5cblx0XHQvLyBCYWlsIG91dCBpZiBubyB0bXBsIGZvdW5kIGZvciB0aGUgdHlwZS5cblx0XHRpZiAoICEgalF1ZXJ5KCAnI3RtcGwtJyArIGZpZWxkVHlwZSApLmxlbmd0aCApIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHRjb25zdCAkZmllbGQgPSAkKCB0aGlzICkuY2xvc2VzdCggJy53Y2FwZi1mb3JtLWZpZWxkJyApO1xuXG5cdFx0Y29uc3QgdGVtcGxhdGUgPSB3cC50ZW1wbGF0ZSggZmllbGRUeXBlICk7XG5cdFx0Y29uc3QgcmVuZGVyZWQgPSB0ZW1wbGF0ZSggeyB2YWx1ZTogJycsIGRpcmVjdGlvbjogJycsIGxhYmVsOiAnJyB9ICk7XG5cdFx0Y29uc3QgJHdyYXBwZXIgPSAkZmllbGQuZmluZCggJy5zb3J0LWJ5LW9wdGlvbnMtdGFibGUnICk7XG5cdFx0Y29uc3QgJHJvd3MgICAgPSAkd3JhcHBlci5maW5kKCAnLm1hbnVhbC1vcHRpb25zLXRhYmxlLWJvZHktcm93cycgKTtcblxuXHRcdCRyb3dzLmFwcGVuZCggcmVuZGVyZWQgKTtcblxuXHRcdHRyaWdnZXJTb3J0QnlPcHRpb25zQ2hhbmdlKCAkZmllbGQgKTtcblxuXHRcdGlmICggISAkd3JhcHBlci5oYXNDbGFzcyggJ2hhcy1vcHRpb25zJyApICkge1xuXHRcdFx0JHdyYXBwZXIuYWRkQ2xhc3MoICdoYXMtb3B0aW9ucycgKTtcblx0XHR9XG5cdH0gKTtcblxuXHRjb25zdCByb3dJbnB1dHMgPSAnLnNvcnQtYnktb3B0aW9ucy10YWJsZSBpbnB1dFt0eXBlPVwidGV4dFwiXSwnICtcblx0XHQnIC5zb3J0LWJ5LW9wdGlvbnMtdGFibGUgLm9wdGlvbl92YWx1ZSwnICtcblx0XHQnIC5zb3J0LWJ5LW9wdGlvbnMtdGFibGUgLm9wdGlvbl9kaXJlY3Rpb24sJyArXG5cdFx0JyAuc29ydC1ieS1vcHRpb25zLXRhYmxlIC5vcHRpb25fbWV0YV9rZXksJyArXG5cdFx0JyAuc29ydC1ieS1vcHRpb25zLXRhYmxlIC5vcHRpb25fbWV0YV9zb3J0X3R5cGUnO1xuXG5cdCRzZWFyY2hGb3JtLm9uKCAnaW5wdXQnLCByb3dJbnB1dHMsIGZ1bmN0aW9uKCkge1xuXHRcdGNvbnN0ICRmaWVsZCA9ICQoIHRoaXMgKS5jbG9zZXN0KCAnLndjYXBmLWZvcm0tZmllbGQnICk7XG5cblx0XHR0cmlnZ2VyU29ydEJ5T3B0aW9uc0NoYW5nZSggJGZpZWxkICk7XG5cdH0gKTtcblxuXHQkc2VhcmNoRm9ybS5vbiggJ2NoYW5nZScsICcuc29ydC1vcHRpb24taXRlbSAub3B0aW9uX3ZhbHVlJywgZnVuY3Rpb24oKSB7XG5cdFx0Y29uc3QgJHNvcnRPcHRpb24gICAgID0gJCggdGhpcyApO1xuXHRcdGNvbnN0IHNvcnRPcHRpb24gICAgICA9ICRzb3J0T3B0aW9uLnZhbCgpO1xuXHRcdGNvbnN0ICRzb3J0T3B0aW9uSXRlbSA9ICRzb3J0T3B0aW9uLmNsb3Nlc3QoICcuc29ydC1vcHRpb24taXRlbScgKTtcblx0XHRjb25zdCAkbWV0YURhdGEgICAgICAgPSAkc29ydE9wdGlvbkl0ZW0uZmluZCggJy5tZXRhLWRhdGEnICk7XG5cblx0XHRpZiAoICdtZXRhX3ZhbHVlJyA9PT0gc29ydE9wdGlvbiApIHtcblx0XHRcdCRtZXRhRGF0YS5zbGlkZURvd24oKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0JG1ldGFEYXRhLnNsaWRlVXAoKTtcblx0XHR9XG5cdH0gKTtcblxufSApO1xuIiwialF1ZXJ5KCBkb2N1bWVudCApLnJlYWR5KCBmdW5jdGlvbiggJCApIHtcblxuXHRjb25zdCAkc2VhcmNoRm9ybSA9ICQoICcjc2VhcmNoLWZvcm0nICk7XG5cblx0Y29uc3QgZGVwZW5kYW50RGF0YSA9IFtcblx0XHR7XG5cdFx0XHQnaGFuZGxlcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtdmFsdWVfdHlwZSBzZWxlY3QnLFxuXHRcdFx0J2hhbmRsZXJUeXBlJzogJ3NlbGVjdCcsXG5cdFx0XHQnZXZlbnQnOiAnY2hhbmdlJyxcblx0XHRcdCdkZXBlbmRhbnQnOiBbXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLmlucHV0LXR5cGUtdGV4dC1maWVsZHMnLFxuXHRcdFx0XHRcdCd2YWx1ZSc6IFsgJ3RleHQnIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLmlucHV0LXR5cGUtbnVtYmVyLWZpZWxkcycsXG5cdFx0XHRcdFx0J3ZhbHVlJzogWyAnbnVtYmVyJyBdLFxuXHRcdFx0XHR9LFxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0J3NlbGVjdG9yJzogJy5pbnB1dC10eXBlLWRhdGUtZmllbGRzJyxcblx0XHRcdFx0XHQndmFsdWUnOiBbICdkYXRlJyBdLFxuXHRcdFx0XHR9LFxuXHRcdFx0XSxcblx0XHR9LFxuXHRcdHtcblx0XHRcdCdoYW5kbGVyJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1kaXNwbGF5X3R5cGUgc2VsZWN0Jyxcblx0XHRcdCdoYW5kbGVyVHlwZSc6ICdzZWxlY3QnLFxuXHRcdFx0J2V2ZW50JzogJ2NoYW5nZScsXG5cdFx0XHQnZGVwZW5kYW50JzogW1xuXHRcdFx0XHR7XG5cdFx0XHRcdFx0J3NlbGVjdG9yJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1xdWVyeV90eXBlJyxcblx0XHRcdFx0XHQndmFsdWUnOiBbICdjaGVja2JveCcsICdtdWx0aS1zZWxlY3QnIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLWFsbF9pdGVtc19sYWJlbCcsXG5cdFx0XHRcdFx0J3ZhbHVlJzogWyAncmFkaW8nLCAnc2VsZWN0JyBdLFxuXHRcdFx0XHR9LFxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0J3NlbGVjdG9yJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC11c2VfY2hvc2VuJyxcblx0XHRcdFx0XHQndmFsdWUnOiBbICdzZWxlY3QnLCAnbXVsdGktc2VsZWN0JyBdLFxuXHRcdFx0XHR9LFxuXHRcdFx0XSxcblx0XHR9LFxuXHRcdHtcblx0XHRcdCdoYW5kbGVyJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC11c2VfY2hvc2VuIGlucHV0Jyxcblx0XHRcdCdoYW5kbGVyVHlwZSc6ICdjaGVja2JveCcsXG5cdFx0XHQnZXZlbnQnOiAnY2hhbmdlJyxcblx0XHRcdCdkZXBlbmRhbnQnOiBbXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLWNob3Nlbl9ub19yZXN1bHRzX21lc3NhZ2UnLFxuXHRcdFx0XHRcdCd2YWx1ZSc6IFsgJzEnIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRdLFxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0J2hhbmRsZXInOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLWdldF9vcHRpb25zIGlucHV0Jyxcblx0XHRcdCdoYW5kbGVyVHlwZSc6ICdyYWRpbycsXG5cdFx0XHQnZXZlbnQnOiAnY2hhbmdlJyxcblx0XHRcdCdkZXBlbmRhbnQnOiBbXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLmNvbHVtbi1ncm91cC1tZXRhX2tleV9tYW51YWxfb3B0aW9ucycsXG5cdFx0XHRcdFx0J3ZhbHVlJzogWyAnbWFudWFsX2VudHJ5JyBdLFxuXHRcdFx0XHR9LFxuXHRcdFx0XSxcblx0XHR9LFxuXHRcdHtcblx0XHRcdCdoYW5kbGVyJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1udW1iZXJfZGlzcGxheV90eXBlIHNlbGVjdCcsXG5cdFx0XHQnaGFuZGxlclR5cGUnOiAnc2VsZWN0Jyxcblx0XHRcdCdldmVudCc6ICdjaGFuZ2UnLFxuXHRcdFx0J2RlcGVuZGFudCc6IFtcblx0XHRcdFx0e1xuXHRcdFx0XHRcdCdzZWxlY3Rvcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtbnVtYmVyX3JhbmdlX3NsaWRlcl9kaXNwbGF5X3ZhbHVlc19hcycsXG5cdFx0XHRcdFx0J3ZhbHVlJzogWyAncmFuZ2Vfc2xpZGVyJyBdLFxuXHRcdFx0XHR9LFxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0J3NlbGVjdG9yJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1udW1iZXJfcmFuZ2VfcXVlcnlfdHlwZScsXG5cdFx0XHRcdFx0J3ZhbHVlJzogWyAncmFuZ2VfY2hlY2tib3gnLCAncmFuZ2VfbXVsdGlzZWxlY3QnIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLW51bWJlcl9yYW5nZV9zZWxlY3RfYWxsX2l0ZW1zX2xhYmVsJyxcblx0XHRcdFx0XHQndmFsdWUnOiBbICdyYW5nZV9yYWRpbycsICdyYW5nZV9zZWxlY3QnIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLW51bWJlcl9yYW5nZV91c2VfY2hvc2VuJyxcblx0XHRcdFx0XHQndmFsdWUnOiBbICdyYW5nZV9zZWxlY3QnLCAncmFuZ2VfbXVsdGlzZWxlY3QnIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLW51bWJlcl9yYW5nZV9zaG93X2NvdW50Jyxcblx0XHRcdFx0XHQndmFsdWUnOiBbICdyYW5nZV9jaGVja2JveCcsICdyYW5nZV9yYWRpbycsICdyYW5nZV9zZWxlY3QnLCAncmFuZ2VfbXVsdGlzZWxlY3QnIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLW51bWJlcl9yYW5nZV9oaWRlX2VtcHR5Jyxcblx0XHRcdFx0XHQndmFsdWUnOiBbICdyYW5nZV9jaGVja2JveCcsICdyYW5nZV9yYWRpbycsICdyYW5nZV9zZWxlY3QnLCAncmFuZ2VfbXVsdGlzZWxlY3QnIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLm51bWJlci1kZWNpbWFsLWZpZWxkcycsXG5cdFx0XHRcdFx0J3ZhbHVlJzogWyAncmFuZ2Vfc2xpZGVyJywgJ3JhbmdlX2NoZWNrYm94JywgJ3JhbmdlX3JhZGlvJywgJ3JhbmdlX3NlbGVjdCcsICdyYW5nZV9tdWx0aXNlbGVjdCcgXSxcblx0XHRcdFx0fSxcblx0XHRcdF0sXG5cdFx0fSxcblx0XHR7XG5cdFx0XHQnaGFuZGxlcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtbnVtYmVyX3JhbmdlX3VzZV9jaG9zZW4gaW5wdXQnLFxuXHRcdFx0J2hhbmRsZXJUeXBlJzogJ2NoZWNrYm94Jyxcblx0XHRcdCdldmVudCc6ICdjaGFuZ2UnLFxuXHRcdFx0J2RlcGVuZGFudCc6IFtcblx0XHRcdFx0e1xuXHRcdFx0XHRcdCdzZWxlY3Rvcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtbnVtYmVyX3JhbmdlX2Nob3Nlbl9ub19yZXN1bHRzX21lc3NhZ2UnLFxuXHRcdFx0XHRcdCd2YWx1ZSc6IFsgJzEnIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRdLFxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0J2hhbmRsZXInOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLW51bWJlcl9nZXRfb3B0aW9ucyBpbnB1dCcsXG5cdFx0XHQnaGFuZGxlclR5cGUnOiAncmFkaW8nLFxuXHRcdFx0J2V2ZW50JzogJ2NoYW5nZScsXG5cdFx0XHQnZGVwZW5kYW50JzogW1xuXHRcdFx0XHR7XG5cdFx0XHRcdFx0J3NlbGVjdG9yJzogJy5udW1iZXItYXV0b21hdGljLW9wdGlvbnMnLFxuXHRcdFx0XHRcdCd2YWx1ZSc6IFsgJ2F1dG9tYXRpY2FsbHknIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLm51bWJlci1tYW51YWwtb3B0aW9ucy10YWJsZScsXG5cdFx0XHRcdFx0J3ZhbHVlJzogWyAnbWFudWFsX2VudHJ5JyBdLFxuXHRcdFx0XHR9LFxuXHRcdFx0XSxcblx0XHR9LFxuXHRcdHtcblx0XHRcdCdoYW5kbGVyJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1kYXRlX2Rpc3BsYXlfdHlwZSBzZWxlY3QnLFxuXHRcdFx0J2hhbmRsZXJUeXBlJzogJ3NlbGVjdCcsXG5cdFx0XHQnZXZlbnQnOiAnY2hhbmdlJyxcblx0XHRcdCdkZXBlbmRhbnQnOiBbXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLmRhdGUtdG8tdWktb3B0aW9ucycsXG5cdFx0XHRcdFx0J3ZhbHVlJzogWyAnaW5wdXRfZGF0ZV9yYW5nZScgXSxcblx0XHRcdFx0fSxcblx0XHRcdFx0e1xuXHRcdFx0XHRcdCdzZWxlY3Rvcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtZGF0ZV9mb3JtYXQnLFxuXHRcdFx0XHRcdCd2YWx1ZSc6IFsgJ2lucHV0X2RhdGUnLCAnaW5wdXRfZGF0ZV9yYW5nZScgXSxcblx0XHRcdFx0fSxcblx0XHRcdF0sXG5cdFx0fSxcblx0XHR7XG5cdFx0XHQnaGFuZGxlcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtbGltaXRfdGVybXMgc2VsZWN0Jyxcblx0XHRcdCdoYW5kbGVyVHlwZSc6ICdzZWxlY3QnLFxuXHRcdFx0J2V2ZW50JzogJ2NoYW5nZScsXG5cdFx0XHQnZGVwZW5kYW50JzogW1xuXHRcdFx0XHR7XG5cdFx0XHRcdFx0J3NlbGVjdG9yJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1wYXJlbnRfdGVybScsXG5cdFx0XHRcdFx0J3ZhbHVlJzogWyAnY2hpbGQnIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLWxpbWl0X3Rlcm1zX2J5X2lkJyxcblx0XHRcdFx0XHQndmFsdWUnOiBbICdpbmNsdWRlJywgJ2V4Y2x1ZGUnIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRdLFxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0J2hhbmRsZXInOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLWVuYWJsZV9zb2Z0X2xpbWl0IGlucHV0Jyxcblx0XHRcdCdoYW5kbGVyVHlwZSc6ICdyYWRpbycsXG5cdFx0XHQnZXZlbnQnOiAnY2hhbmdlJyxcblx0XHRcdCdkZXBlbmRhbnQnOiBbXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLXNvZnRfbGltaXQnLFxuXHRcdFx0XHRcdCd2YWx1ZSc6IFsgJ2VuYWJsZScgXSxcblx0XHRcdFx0fSxcblx0XHRcdF0sXG5cdFx0fSxcblx0XHR7XG5cdFx0XHQnaGFuZGxlcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtY3VzdG9tLXRheG9ub215IHNlbGVjdCcsXG5cdFx0XHQnaGFuZGxlclR5cGUnOiAnc2VsZWN0Jyxcblx0XHRcdCdldmVudCc6ICdjaGFuZ2UnLFxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0J2hhbmRsZXInOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLXBvc3RfcHJvcGVydHkgc2VsZWN0Jyxcblx0XHRcdCdoYW5kbGVyVHlwZSc6ICdzZWxlY3QnLFxuXHRcdFx0J2V2ZW50JzogJ2NoYW5nZScsXG5cdFx0fSxcblx0XTtcblxuXHRmdW5jdGlvbiBfaGFuZGxlVG9nZ2xlUmVxdWVzdCggZGF0YSwgY3VycmVudFNlbGVjdG9yLCB2YWx1ZSApIHtcblx0XHRjb25zdCAkZmllbGQgICAgICA9IGN1cnJlbnRTZWxlY3Rvci5jbG9zZXN0KCAnLndjYXBmLWZvcm0tZmllbGQnICk7XG5cdFx0Y29uc3QgaGFuZGxlciAgICAgPSBkYXRhWyAnaGFuZGxlcicgXTtcblx0XHRjb25zdCBoYW5kbGVyVHlwZSA9IGRhdGFbICdoYW5kbGVyVHlwZScgXTtcblx0XHRjb25zdCBkZXBlbmRhbnQgICA9IGRhdGFbICdkZXBlbmRhbnQnIF07XG5cblx0XHRsZXQgX3ZhbHVlID0gdmFsdWU7XG5cblx0XHRpZiAoICdjaGVja2JveCcgPT09IGhhbmRsZXJUeXBlICkge1xuXHRcdFx0X3ZhbHVlID0gY3VycmVudFNlbGVjdG9yLmlzKCAnOmNoZWNrZWQnICkgPyAnMScgOiAnMCc7XG5cdFx0fVxuXG5cdFx0aWYgKCAncmFkaW8nID09PSBoYW5kbGVyVHlwZSApIHtcblx0XHRcdF92YWx1ZSA9ICRmaWVsZC5maW5kKCBoYW5kbGVyICsgJzpjaGVja2VkJyApLnZhbCgpO1xuXHRcdH1cblxuXHRcdCQuZWFjaCggZGVwZW5kYW50LCBmdW5jdGlvbiggaWQsIGQgKSB7XG5cdFx0XHRjb25zdCAkc2VsZWN0b3IgICA9ICRmaWVsZC5maW5kKCBkWyAnc2VsZWN0b3InIF0gKTtcblx0XHRcdGNvbnN0IHZhbGlkVmFsdWVzID0gZFsgJ3ZhbHVlJyBdO1xuXG5cdFx0XHRpZiAoIHZhbGlkVmFsdWVzLmluY2x1ZGVzKCBfdmFsdWUgKSApIHtcblx0XHRcdFx0JHNlbGVjdG9yLnNob3coKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdCRzZWxlY3Rvci5oaWRlKCk7XG5cdFx0XHR9XG5cdFx0fSApO1xuXG5cdFx0JHNlYXJjaEZvcm0udHJpZ2dlciggJ2FmdGVyX3RvZ2dsZV9yZXF1ZXN0JywgWyBoYW5kbGVyLCBfdmFsdWUsICRmaWVsZCBdICk7XG5cdH1cblxuXHRmdW5jdGlvbiBoYW5kbGVUb2dnbGVSZXF1ZXN0KCBkYXRhLCBjdXJyZW50U2VsZWN0b3IsIHZhbHVlICkge1xuXHRcdGlmICggbnVsbCA9PT0gY3VycmVudFNlbGVjdG9yICkge1xuXHRcdFx0Y29uc3QgaGFuZGxlciAgPSBkYXRhWyAnaGFuZGxlcicgXTtcblx0XHRcdGNvbnN0ICRoYW5kbGVyID0gJCggaGFuZGxlciApO1xuXG5cdFx0XHQkLmVhY2goICRoYW5kbGVyLCBmdW5jdGlvbigpIHtcblx0XHRcdFx0Y29uc3QgX3RoaXMgID0gJCggdGhpcyApO1xuXHRcdFx0XHRjb25zdCBfdmFsdWUgPSBfdGhpcy52YWwoKTtcblx0XHRcdFx0X2hhbmRsZVRvZ2dsZVJlcXVlc3QoIGRhdGEsIF90aGlzLCBfdmFsdWUgKTtcblx0XHRcdH0gKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0X2hhbmRsZVRvZ2dsZVJlcXVlc3QoIGRhdGEsIGN1cnJlbnRTZWxlY3RvciwgdmFsdWUgKTtcblx0XHR9XG5cdH1cblxuXHRmdW5jdGlvbiBzZXR1cFNlYXJjaEZvcm0oIGluaXRhbCA9IGZhbHNlICkge1xuXHRcdCQuZWFjaCggZGVwZW5kYW50RGF0YSwgZnVuY3Rpb24oIGksIGRhdGEgKSB7XG5cdFx0XHRjb25zdCBoYW5kbGVyID0gZGF0YVsgJ2hhbmRsZXInIF07XG5cdFx0XHRjb25zdCBldmVudCAgID0gZGF0YVsgJ2V2ZW50JyBdO1xuXG5cdFx0XHRoYW5kbGVUb2dnbGVSZXF1ZXN0KCBkYXRhLCBudWxsLCBudWxsICk7XG5cblx0XHRcdGlmICggaW5pdGFsICkge1xuXHRcdFx0XHQkc2VhcmNoRm9ybS5vbiggZXZlbnQsIGhhbmRsZXIsIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdGNvbnN0IF90aGlzICA9ICQoIHRoaXMgKTtcblx0XHRcdFx0XHRjb25zdCBfdmFsdWUgPSAkKCB0aGlzICkudmFsKCk7XG5cdFx0XHRcdFx0aGFuZGxlVG9nZ2xlUmVxdWVzdCggZGF0YSwgX3RoaXMsIF92YWx1ZSApO1xuXHRcdFx0XHR9ICk7XG5cdFx0XHR9XG5cdFx0fSApO1xuXHR9XG5cblx0c2V0dXBTZWFyY2hGb3JtKCB0cnVlICk7XG5cblx0JHNlYXJjaEZvcm0ub24oICdmaWVsZF9hZGRlZCcsIGZ1bmN0aW9uKCkge1xuXHRcdC8vIFRvZ2dsZSB0aGUgdmlzaWJpbGl0eSBvZiBzdWJmaWVsZHMuXG5cdFx0c2V0dXBTZWFyY2hGb3JtKCk7XG5cdH0gKTtcblxufSApO1xuIl19
