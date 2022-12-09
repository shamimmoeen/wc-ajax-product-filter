import { __ } from '@wordpress/i18n';
import { useRef, useState } from '@wordpress/element';
import { Button, Dropdown, TabPanel } from '@wordpress/components';
import { Icon, dragHandle, chevronDown, chevronUp } from '@wordpress/icons';
import { useForm } from '../FormContext';
import General from '../FilterSettings/General';
import Appearance from '../FilterSettings/Appearance';
import {
	allTextDisplayTypes,
	dateDisplayTypes,
	getGlobalFilterKey,
	numberDisplayTypes,
} from '../utils';
import Options from '../FilterSettings/Options';
import Advanced from '../FilterSettings/Advanced';
import useFormData from '../useFormData';
import axios from 'axios';
import {
	filterDeletedErrorNotice,
	removeFilterDeletedNotices,
} from '../../notices';

const filterTypes = wcapf_admin_params.filter_types;

const Filter = ({ index }) => {
	const { state, dispatch } = useForm();

	const { setDirty } = useFormData(state, dispatch);

	const [deleteBtnBusy, setDeleteBtnBusy] = useState(false);

	const { filterKeys, accordionStates, formFilters } = state;

	const filter = formFilters[index];

	const {
		id,
		title,
		type,
		taxonomy,
		meta_key,
		value_type,
		field_key,
		display_type,
		number_display_type,
		date_display_type,
	} = filter;

	const isExpanded = accordionStates[index];

	const dragHandleRef = useRef('');
	const toggleIconRef = useRef('');

	const toggleExpand = (e) => {
		removeFilterDeletedNotices();

		if (dragHandleRef.current.contains(e.target)) {
			return;
		}

		const newStates = accordionStates.map((state, _index) => {
			if (_index === index) {
				return !isExpanded;
			}

			return state;
		});

		dispatch({ type: 'SET_ACCORDION_STATES', payload: newStates });
	};

	const closeFilter = (e) => {
		toggleExpand(e);

		toggleIconRef.current.focus();
	};

	const dispatchDeleteFilter = () => {
		const _formFilters = [...formFilters];
		_formFilters.splice(index, 1);

		dispatch({
			type: 'SET_FORM_FILTERS',
			payload: _formFilters,
		});

		const _newAccordionStates = [...accordionStates];
		_newAccordionStates.splice(index, 1);

		dispatch({
			type: 'SET_ACCORDION_STATES',
			payload: _newAccordionStates,
		});

		if (id) {
			const _filterKeys = filterKeys.filter((data) => data.id !== id);

			dispatch({
				type: 'SET_FILTER_KEYS',
				payload: _filterKeys,
			});
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

	const toggleIcon = isExpanded ? chevronUp : chevronDown;
	const topClass = isExpanded ? '__top open' : '__top';

	let filterTitle = title;
	let filterType;
	let filterKey = field_key;

	if ('taxonomy' === type) {
		const taxonomyOption = filterTypes.find(
			(option) => option.value === type
		);
		const taxonomies = taxonomyOption.options;

		filterType = taxonomies.find((option) => option.value === taxonomy);
	} else {
		filterType = filterTypes.find((option) => option.value === type);
	}

	// Default filter title.
	if (!filterTitle) {
		filterTitle = filterType.label;

		if ('post-meta' === type && meta_key) {
			filterTitle += `[${meta_key}]`;
		}
	}

	// Default filter key.
	if (!filterKey) {
		if ('post-meta' === type) {
			if (meta_key) {
				filterKey = meta_key;
			}
		} else {
			filterKey = filterType.key;
		}
	}

	let displayTypes;
	let _displayType;

	if ('number' === value_type || 'price' === type) {
		displayTypes = numberDisplayTypes();
		_displayType = number_display_type;
	} else if ('date' === value_type) {
		displayTypes = dateDisplayTypes();
		_displayType = date_display_type;
	} else {
		displayTypes = allTextDisplayTypes();
		_displayType = display_type;
	}

	const displayType = displayTypes.find(
		(option) => option.value === _displayType
	);

	const globalFilterKey = getGlobalFilterKey(filterKeys, filter);

	return (
		<div className='__item'>
			<div className={topClass} onClick={toggleExpand}>
				<div className='__drag_handle_wrapper' ref={dragHandleRef}>
					<Icon className='__drag_handler' icon={dragHandle} />
				</div>

				<div className='_filter_header'>
					<div className='__title'>{filterTitle}</div>
					<div className='__type'>
						{filterType && (
							<span className='__filter_type'>
								{filterType.label}
							</span>
						)}
						{'post-meta' === type && (
							<span className='__meta_key'>{meta_key}</span>
						)}
					</div>
					<div className='__key'>
						{globalFilterKey ? globalFilterKey : filterKey}
					</div>
					<div className='__display'>{displayType.label}</div>
				</div>

				<div className='__accordion_toggle_button'>
					<Button isSmall icon={toggleIcon} ref={toggleIconRef} />
				</div>
			</div>
			{isExpanded && (
				<div className='__accordion_body'>
					<TabPanel
						className='__tab_panel'
						activeClass='active-tab'
						initialTabName='appearance'
						tabs={[
							{
								name: 'general',
								title: __('General', 'wc-ajax-product-filter'),
							},
							{
								name: 'appearance',
								title: __(
									'Appearance',
									'wc-ajax-product-filter'
								),
							},
							{
								name: 'options',
								title: __('Options', 'wc-ajax-product-filter'),
							},
							{
								name: 'advanced',
								title: __('Advanced', 'wc-ajax-product-filter'),
							},
						]}
					>
						{({ name }) => {
							if ('general' === name) {
								return <General index={index} />;
							} else if ('appearance' === name) {
								return <Appearance index={index} />;
							} else if ('options' === name) {
								return <Options index={index} />;
							} else if ('advanced' === name) {
								return <Advanced index={index} />;
							}
						}}
					</TabPanel>

					<div className='__action_buttons'>
						<Button variant='link' onClick={closeFilter}>
							{__('Close', 'wc-ajax-product-filter')}
						</Button>
						{` | `}
						<Dropdown
							popoverProps={{ noArrow: false }}
							contentClassName='__remove_popover'
							position='top center'
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
};

export default Filter;
