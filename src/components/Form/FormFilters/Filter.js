import { __ } from '@wordpress/i18n';
import { useRef, useState, forwardRef } from '@wordpress/element';
import { Button, Dropdown, Notice } from '@wordpress/components';
import { Icon, dragHandle, chevronDown, chevronUp } from '@wordpress/icons';
import classnames from 'classnames';
import { omit } from 'lodash';
import { useForm } from '../FormContext';
import General from '../FilterSettings/General';
import Appearance from '../FilterSettings/Appearance';
import {
	componentsWithTypeOnly,
	getDisplayTypeData,
	getFilterKey,
	getFilterTabs,
	getFilterTitle,
	getFilterTypeData,
	getGlobalFilterKey,
	multipleFilterInstanceFound,
} from '../utils';
import Options from '../FilterSettings/Options';
import Advanced from '../FilterSettings/Advanced';
import useFormData from '../useFormData';
import axios from 'axios';
import {
	filterDeletedErrorNotice,
	removeFilterDeletedNotices,
} from '../../notices';
import { wpVersion } from '../../utils';
import CustomTabPanel from '../../CustomTabPanel';

const onlyWithType = componentsWithTypeOnly();

const Filter = forwardRef(({ index, onExpand }, ref) => {
	const { state, dispatch } = useForm();

	const { setDirty } = useFormData(state, dispatch);

	const [deleteBtnBusy, setDeleteBtnBusy] = useState(false);

	const { filterKeys, filterStates, formFilters } = state;

	const filter = formFilters[index];

	const { id, uniqueIndex, type, meta_key, component } = filter;

	let filterId;

	if (filter.isNew) {
		filterId = uniqueIndex;
	} else {
		filterId = id;
	}

	const filterState = filterStates[filterId] || {};
	const isExpanded = filterState?.accordionStatus || false;
	const currentTab = filterState?.currentTab || 'general';

	const dragHandleRef = useRef('');
	const toggleIconRef = useRef('');

	const updateFilterStates = (key, value) => {
		const newStates = {
			...filterStates,
			[filterId]: { ...filterStates[filterId], [key]: value },
		};

		dispatch({ type: 'SET_FILTER_STATES', payload: newStates });
	};

	const toggleExpand = (e) => {
		removeFilterDeletedNotices();

		if (dragHandleRef.current.contains(e.target)) {
			return;
		}

		const accordionStatus = !isExpanded;

		// Scroll the expanded filter into view.
		if (accordionStatus) {
			onExpand(filterId);
		}

		updateFilterStates('accordionStatus', accordionStatus);
	};

	const closeFilter = (e) => {
		toggleExpand(e);

		toggleIconRef.current.focus();
	};

	const handleFilterTabChange = (newTab) => {
		updateFilterStates('currentTab', newTab);
	};

	const dispatchDeleteFilter = () => {
		const _formFilters = [...formFilters];
		_formFilters.splice(index, 1);

		dispatch({
			type: 'SET_FORM_FILTERS',
			payload: _formFilters,
		});

		const newStates = omit(filterStates, filterId);

		dispatch({ type: 'SET_FILTER_STATES', payload: newStates });

		if (id) {
			const _filterKeys = filterKeys.filter((data) => data.id !== id);

			dispatch({ type: 'SET_FILTER_KEYS', payload: _filterKeys });
		}

		setDirty();
	};

	const handleDeleteFilter = (callback) => {
		if (id) {
			callback();

			setDeleteBtnBusy(true);

			const data = {
				action: 'wcapf_delete_filter',
				post_id: id,
			};

			axios
				.get(wcapf_admin_params.ajaxurl, {
					params: data,
				})
				.then((res) => {
					setDeleteBtnBusy(false);

					const {
						data: { data, success },
					} = res;

					if (success) {
						dispatchDeleteFilter();
					} else {
						filterDeletedErrorNotice(data);
					}
				})
				.catch((err) => {
					setDeleteBtnBusy(false);

					filterDeletedErrorNotice(err.message);
				});
		} else {
			dispatchDeleteFilter();
		}
	};

	const multipleFilterInstance = multipleFilterInstanceFound(
		formFilters,
		index
	);

	const multipleFilterInstanceMessage = __(
		'There are multiple filters found in the form for the same entity. Please remove the other ones then save the form.',
		'wc-ajax-product-filter'
	);

	const toggleIcon = isExpanded ? chevronUp : chevronDown;
	const topClass = classnames(
		'__top',
		{ open: isExpanded },
		{ multiple_filter_instance_found: multipleFilterInstance }
	);

	const filterType = getFilterTypeData(filter);
	const filterTitle = getFilterTitle(filter, filterType);

	const globalFilterKey = getGlobalFilterKey(filterKeys, filter);
	const filterKey = globalFilterKey
		? globalFilterKey
		: getFilterKey(filter, filterType);

	const displayType = getDisplayTypeData(filter);

	const onlyType = 'component' === type && onlyWithType.includes(component);
	const activeFilters = 'active-filters' === component;

	const filterTabs = getFilterTabs(filter);

	const filterInner = (name) => {
		if ('general' === name) {
			return <General index={index} />;
		} else if ('appearance' === name) {
			return <Appearance index={index} />;
		} else if ('options' === name) {
			return <Options index={index} />;
		} else if ('advanced' === name) {
			return <Advanced index={index} />;
		}
	};

	let dropdownProps;

	if (6.2 <= wpVersion()) {
		dropdownProps = {
			popoverProps: { noArrow: false, position: 'top center' },
		};
	} else {
		dropdownProps = {
			popoverProps: { noArrow: false },
			position: 'top center',
		};
	}

	return (
		<div className='__item' ref={ref}>
			<div className={topClass} onClick={toggleExpand}>
				<div className='__drag_handle_wrapper' ref={dragHandleRef}>
					<Icon className='__drag_handler' icon={dragHandle} />
				</div>

				<div className='_filter_header'>
					<div className='__title'>
						<div className='__truncated'>
							{onlyType ? <span>&#8212;</span> : filterTitle}
						</div>
					</div>
					<div className='__type'>
						<div className='__wrapper'>
							{filterType && (
								<div className='__filter_type'>
									{filterType.label}
								</div>
							)}
							{'post-meta' === type && (
								<div className='__truncated __meta_key'>
									{meta_key}
								</div>
							)}
						</div>
					</div>
					<div className='__key'>
						<div className='__truncated'>
							{onlyType || activeFilters ? (
								<span>&#8212;</span>
							) : (
								filterKey
							)}
						</div>
					</div>
					<div className='__display'>
						<div className='__truncated'>
							{onlyType || activeFilters ? (
								<span>&#8212;</span>
							) : (
								displayType?.label
							)}
						</div>
					</div>
				</div>

				<div className='__accordion_toggle_button'>
					<Button isSmall icon={toggleIcon} ref={toggleIconRef} />
				</div>
			</div>
			{isExpanded && (
				<div className='__accordion_body'>
					<CustomTabPanel
						className='__tab_panel'
						activeClass='active-tab'
						tabs={filterTabs}
						currentTab={currentTab}
						onChangeTab={handleFilterTabChange}
					>
						{({ name }) => (
							<>
								{multipleFilterInstance && (
									<Notice
										status='error'
										isDismissible={false}
										className='multiple_filter_instance_notice'
									>
										{multipleFilterInstanceMessage}
									</Notice>
								)}
								{filterInner(name)}
							</>
						)}
					</CustomTabPanel>

					<div className='__action_buttons'>
						<Button variant='link' onClick={closeFilter}>
							{__('Close', 'wc-ajax-product-filter')}
						</Button>
						{` | `}
						<Dropdown
							{...dropdownProps}
							contentClassName='__remove_popover'
							focusOnMount={true}
							renderToggle={({ isOpen, onToggle }) => (
								<Button
									variant='link'
									isDestructive
									isBusy={deleteBtnBusy}
									disabled={deleteBtnBusy}
									onClick={onToggle}
									aria-expanded={isOpen}
								>
									{__('Delete', 'wc-ajax-product-filter')}
								</Button>
							)}
							renderContent={({ onToggle }) => (
								<>
									{__(
										'Are you sure?',
										'wc-ajax-product-filter'
									)}
									{` `}
									<Button
										variant='link'
										isDestructive
										onClick={() =>
											handleDeleteFilter(onToggle)
										}
									>
										{__('Delete', 'wc-ajax-product-filter')}
									</Button>
									{` `}
									<Button variant='link' onClick={onToggle}>
										{__('Cancel', 'wc-ajax-product-filter')}
									</Button>
								</>
							)}
						/>
					</div>
				</div>
			)}
		</div>
	);
});

export default Filter;
