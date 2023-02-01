import { __ } from '@wordpress/i18n';
import { useEffect, useRef } from '@wordpress/element';
import { Animate, Button } from '@wordpress/components';
import { closeSmall } from '@wordpress/icons';
import classnames from 'classnames';
import Select from '../Field/Select';
import SelectMulti from '../Field/SelectMulti';
import { useForm } from './FormContext';
import useFormSettings from './useFormSettings';
import { foundProVersion, proTag } from '../utils';
import { PlusIcon } from '../SVGIcons';
import TippyTooltip from '../TippyTooltip';

const WCAPF_PRO = foundProVersion();

const locations = wcapf_admin_params.form_places;

const multipleSubLocations = wcapf_admin_params.multiple_sub_location;
const multipleFormLocations = wcapf_admin_params.multiple_visible_on;

const Location = ({
	location: locationData,
	index,
	handleFormLocation,
	showRemove,
	handleRemoveLocation,
}) => {
	const { location: _location, sub_location } = locationData;

	const firstRender = useRef(true);

	useEffect(() => {
		if (firstRender.current) {
			firstRender.current = false;

			return;
		}

		updateLocation('sub_location', '');
	}, [_location]);

	let location;

	if ('product_archive_pages' === _location || 'page' === _location) {
		location = locations.find((option) => _location === option.value);
	} else {
		const taxonomyOptions = locations.find(
			(option) => 'taxonomy' === option.value
		);
		const taxonomies = taxonomyOptions.options;

		location = taxonomies.find((option) => _location === option.value);
	}

	const handleLocationChange = (selected) => {
		updateLocation('location', selected.value);
	};

	const handleSubLocationChange = (selected) => {
		updateLocation('sub_location', selected);
	};

	const updateLocation = (key, value) => {
		const newLocation = { ...locationData, [key]: value };

		handleFormLocation(index, newLocation);
	};

	let type;
	let placeholder;
	let noOptionsMessage;

	if (
		_location &&
		'product_archive_pages' !== _location &&
		'page' !== _location
	) {
		type = 'taxonomy';
		placeholder = __(
			'Leave empty to match any term',
			'wc-ajax-product-filter'
		);
		noOptionsMessage = __('No terms found', 'wc-ajax-product-filter');
	} else if ('page' === _location) {
		type = 'page';
		placeholder = __(
			'Start typing to find the page',
			'wc-ajax-product-filter'
		);
		noOptionsMessage = __('No pages found', 'wc-ajax-product-filter');
	}

	return (
		<div className='__location'>
			<div className='__columns'>
				<div className='__column'>
					<Select
						id={'location'}
						index={index}
						options={locations}
						value={location}
						onChange={(selected) => handleLocationChange(selected)}
					/>
				</div>

				{_location && 'product_archive_pages' !== _location && (
					<div className='__column'>
						<SelectMulti
							id={'sub_location'}
							index={index}
							isMultiple={multipleSubLocations}
							inputKey={_location}
							taxonomy={_location}
							type={type}
							inputPlaceholder={placeholder}
							inputNoOptionsMessage={noOptionsMessage}
							value={sub_location}
							onChange={handleSubLocationChange}
							renderAsFormField={false}
						/>
					</div>
				)}
			</div>

			{showRemove && (
				<div className='__remove_wrapper'>
					<Animate type='slide-in' options={{ origin: 'left' }}>
						{() => (
							<Button
								className='__remove_location'
								icon={closeSmall}
								variant='tertiary'
								isDestructive
								onClick={() =>
									handleRemoveLocation(locationData)
								}
							/>
						)}
					</Animate>
				</div>
			)}
		</div>
	);
};

const FilterOn = () => {
	const { state, dispatch } = useForm();
	const { handleFormLocations } = useFormSettings(state, dispatch);

	const {
		formSettings: { form_locations },
	} = state;

	const handleAddLocation = () => {
		const formLocations = [...form_locations, {}];

		handleFormLocations(formLocations);
	};

	const handleFormLocation = (index, formLocation) => {
		const formLocations = form_locations.map((location, _index) => {
			if (_index === index) {
				return formLocation;
			}

			return location;
		});

		handleFormLocations(formLocations);
	};

	const handleRemoveLocation = (location) => {
		const formLocations = form_locations.filter(
			(_location) => location !== _location
		);

		handleFormLocations(formLocations);
	};

	const showRemove = multipleFormLocations && form_locations.length > 1;

	return (
		<div className='__form_control __filter_on'>
			<div className='__inner'>
				<div className='__label'>
					<label htmlFor='scroll_window'>
						{__('Visible on', 'wc-ajax-product-filter')}
						{proTag(true)}
						{WCAPF_PRO && (
							<TippyTooltip
								content={__(
									'If you want to show a form on multiple pages enable multiple visible on conditions from "Settings > Others" tab.',
									'wc-ajax-product-filter'
								)}
							/>
						)}
					</label>
				</div>

				<div className='__wrapper'>
					<div className='__input_wrapper'>
						{WCAPF_PRO ? (
							<>
								<div
									className={classnames('__locations', {
										'support-many': multipleFormLocations,
									})}
								>
									{form_locations.map((location, index) => (
										<Location
											location={location}
											key={index}
											index={index}
											handleFormLocation={
												handleFormLocation
											}
											showRemove={showRemove}
											handleRemoveLocation={
												handleRemoveLocation
											}
										/>
									))}
								</div>

								{multipleFormLocations && (
									<Button
										className='__add_location'
										variant='secondary'
										icon={PlusIcon}
										iconSize={12}
										onClick={handleAddLocation}
									/>
								)}
							</>
						) : (
							<>
								<input
									type={'text'}
									className={'components-text-control__input'}
									disabled
									value={__(
										'Product archive pages',
										'wc-ajax-product-filter'
									)}
								/>

								<TippyTooltip
									content={__(
										'Upgrade to PRO to select taxonomies and pages.',
										'wc-ajax-product-filter'
									)}
								/>
							</>
						)}
					</div>
				</div>
			</div>

			<p className='description'>
				{__(
					'Determines where you want to show the form to filter the products.',
					'wc-ajax-product-filter'
				)}
			</p>
		</div>
	);
};

export default FilterOn;
