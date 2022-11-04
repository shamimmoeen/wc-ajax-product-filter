import { sprintf, __ } from '@wordpress/i18n';
import { useRef, useState } from '@wordpress/element';
import { Button, ExternalLink } from '@wordpress/components';
import { Icon, dragHandle, chevronDown, chevronUp } from '@wordpress/icons';
import { useForm } from '../../FormContext';
import useFormData from '../../useFormData';
import { getEditFilterLink } from '../../../utils';
import Checkbox from '../../../Field/Checkbox';
import Radio from '../../../Field/Radio';
import { accordionStates } from '../../../Filter/utils';

const FormFilter = ({ item }) => {
	const { state, dispatch } = useForm();
	const { handleRemoveFilter, handleCheckboxChange, handleRadioChange } =
		useFormData(state, dispatch);

	const [expanded, setExpanded] = useState(false);
	const dragHandleRef = useRef('');

	const {
		id,
		type,
		show_title,
		enable_accordion,
		accordion_default_state,
		show_clear_button,
	} = item;

	const toggleExpand = (e) => {
		if (dragHandleRef.current.contains(e.target)) {
			return;
		}

		const _expanded = !expanded;
		setExpanded(_expanded);
	};

	const toggleIcon = expanded ? chevronUp : chevronDown;

	return (
		<div className='__item'>
			<div className='__top' onClick={toggleExpand}>
				<div className='__tt'>
					<div className='__drag_handle_wrapper' ref={dragHandleRef}>
						<Icon className='__drag_handler' icon={dragHandle} />
					</div>
					<div className='__accordion_title'>
						<span className='__post_title'>{item.title}</span>
						<span className='__post_id'>
							{sprintf(
								__('ID: %d', 'wc-ajax-product-filter'),
								item.id
							)}
						</span>
					</div>
				</div>
				<div className='__accordion_toggle_button'>
					<Button isSmall>
						<Icon icon={toggleIcon} />
					</Button>
				</div>
			</div>
			{expanded && (
				<div className='__accordion_body'>
					<p className='description __override_info'>
						{__(
							'These settings will override the filter settings.',
							'wc-ajax-product-filter'
						)}
					</p>

					<div className='__filter_settings'>
						<Checkbox
							id={'show_title'}
							label={__('Show Title', 'wc-ajax-product-filter')}
							isChecked={show_title}
							onChange={(value) =>
								handleCheckboxChange(id, 'show_title', value)
							}
						/>

						{'1' === show_title && (
							<>
								<Checkbox
									id={'enable_accordion'}
									label={__(
										'Enable Accordion',
										'wc-ajax-product-filter'
									)}
									isChecked={enable_accordion}
									onChange={(value) =>
										handleCheckboxChange(
											id,
											'enable_accordion',
											value
										)
									}
								/>

								{'1' === enable_accordion && (
									<Radio
										id={'accordion_default_state'}
										label={__(
											'Accordion default state',
											'wc-ajax-product-filter'
										)}
										options={accordionStates()}
										value={accordion_default_state}
										onChange={(value) =>
											handleRadioChange(
												id,
												'accordion_default_state',
												value
											)
										}
									/>
								)}

								{'active-filters' !== type &&
									'reset-button' !== type && (
										<Checkbox
											id={'show_clear_button'}
											label={__(
												'Enable clear filter',
												'wc-ajax-product-filter'
											)}
											isChecked={show_clear_button}
											onChange={(value) =>
												handleCheckboxChange(
													id,
													'show_clear_button',
													value
												)
											}
										/>
									)}
							</>
						)}
					</div>

					<div className='__action_buttons'>
						<button
							className='button-link button-link-delete'
							onClick={() => handleRemoveFilter(item)}
						>
							{__('Remove', 'wc-ajax-product-filter')}
						</button>
						{` | `}
						<ExternalLink href={getEditFilterLink(item.id)}>
							{__('Edit', 'wc-ajax-product-filter')}
						</ExternalLink>
					</div>
				</div>
			)}
		</div>
	);
};

export default FormFilter;
