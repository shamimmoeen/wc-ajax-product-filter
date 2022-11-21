import { __ } from '@wordpress/i18n';
import { useRef, useState } from '@wordpress/element';
import { Button, Dropdown, TabPanel } from '@wordpress/components';
import { Icon, dragHandle, chevronDown, chevronUp } from '@wordpress/icons';
import { useForm } from '../FormContext';
import General from '../FilterSettings/General';
import Appearance from '../FilterSettings/Appearance';
import {
	dateDisplayTypes,
	numberDisplayTypes,
	textDisplayTypes,
} from '../utils';
import Options from '../FilterSettings/Options';
import Advanced from '../FilterSettings/Advanced';

const filterTypes = wcapf_admin_params.filter_types;

const Filter = ({ index, handleRemoveFilter, initialExpand = false }) => {
	const {
		state: { formFilters },
	} = useForm();

	const [expanded, setExpanded] = useState(initialExpand);
	const dragHandleRef = useRef('');
	const toggleIconRef = useRef('');

	const toggleExpand = (e) => {
		if (dragHandleRef.current.contains(e.target)) {
			return;
		}

		const _expanded = !expanded;
		setExpanded(_expanded);
	};

	const closeFilter = (e) => {
		toggleExpand(e);

		toggleIconRef.current.focus();
	};

	const toggleIcon = expanded ? chevronUp : chevronDown;
	const topClass = expanded ? '__top open' : '__top';

	const filter = formFilters[index];

	const {
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

	let filterType;

	if ('taxonomy' === type) {
		const taxonomyOption = filterTypes.find(
			(option) => option.value === type
		);
		const taxonomies = taxonomyOption.options;

		filterType = taxonomies.find((option) => option.value === taxonomy);
	} else {
		filterType = filterTypes.find((option) => option.value === type);
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
		displayTypes = textDisplayTypes();
		_displayType = display_type;
	}

	const displayType = displayTypes.find(
		(option) => option.value === _displayType
	);

	return (
		<div className='__item'>
			<div className={topClass} onClick={toggleExpand}>
				<div className='__drag_handle_wrapper' ref={dragHandleRef}>
					<Icon className='__drag_handler' icon={dragHandle} />
				</div>

				<div className='_filter_header'>
					<div className='__title'>{title}</div>
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
					<div className='__key'>{field_key}</div>
					<div className='__display'>{displayType.label}</div>
				</div>

				<div className='__accordion_toggle_button'>
					<Button isSmall icon={toggleIcon} ref={toggleIconRef} />
				</div>
			</div>
			{expanded && (
				<div className='__accordion_body'>
					<TabPanel
						className='__tab_panel'
						activeClass='active-tab'
						initialTabName='options'
						tabs={[
							{
								name: 'general',
								title: __('General', 'wc-ajax-product-filter'),
								className: 'general',
							},
							{
								name: 'appearance',
								title: __(
									'Appearance',
									'wc-ajax-product-filter'
								),
								className: 'appearance',
							},
							{
								name: 'options',
								title: __('Options', 'wc-ajax-product-filter'),
								className: 'options',
							},
							{
								name: 'advanced',
								title: __('Advanced', 'wc-ajax-product-filter'),
								className: 'advanced',
							},
						]}
					>
						{(tab) => {
							const { name } = tab;

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
						<button className='button-link' onClick={closeFilter}>
							{__('Close', 'wc-ajax-product-filter')}
						</button>
						{` | `}
						<Dropdown
							popoverProps={{ noArrow: false }}
							contentClassName='__remove_popover'
							position='top center'
							focusOnMount={true}
							renderToggle={({ isOpen, onToggle }) => (
								<button
									className='button-link button-link-delete'
									onClick={onToggle}
									aria-expanded={isOpen}
								>
									{__('Remove', 'wc-ajax-product-filter')}
								</button>
							)}
							renderContent={({ onToggle }) => (
								<>
									{__(
										'Are you sure?',
										'wc-ajax-product-filter'
									)}
									{` `}
									<button
										className='button-link button-link-delete'
										onClick={() =>
											handleRemoveFilter(index)
										}
									>
										{__('Remove', 'wc-ajax-product-filter')}
									</button>
									{` `}
									<button
										className='button-link'
										onClick={onToggle}
									>
										{__('Cancel', 'wc-ajax-product-filter')}
									</button>
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
