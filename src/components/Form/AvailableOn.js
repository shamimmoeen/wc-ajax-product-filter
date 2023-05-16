import { __ } from '@wordpress/i18n';
import { useLayoutEffect, useRef } from '@wordpress/element';
import { Animate, Button, CheckboxControl } from '@wordpress/components';
import { closeSmall } from '@wordpress/icons';
import classnames from 'classnames';
import Select from '../Field/Select';
import SelectMulti from '../Field/SelectMulti';
import { useForm } from './FormContext';
import useFormSettings from './useFormSettings';
import { foundProVersion, proTag } from '../utils';
import { PlusIcon } from '../SVGIcons';
import TippyTooltip from '../TippyTooltip';
import ProductQuery from './ProductQuery';
import { isEqual } from 'lodash';
import { defaultLocation } from '../utilsForForm';

const WCAPF_PRO = foundProVersion();

const locations = wcapf_admin_params.form_places;

const multipleFormLocations = wcapf_admin_params.multiple_form_locations;

const Location = ({
	location: locationData,
	index,
	handleFormLocation,
	showRemove,
	handleRemoveLocation,
}) => {
	const {
		location: _location,
		sub_location,
		results_method,
		product_query,
	} = locationData;

	const firstRender = useRef(true);

	useLayoutEffect(() => {
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

	const handleResultsMethodChange = (value) => {
		const resultsMethod = value ? 'wcapf-form' : '';

		updateLocation('results_method', resultsMethod);
	};

	const handleQueryChange = (key, value) => {
		const newQuery = { ...product_query, [key]: value };

		updateLocation('product_query', newQuery);
	};

	const updateLocation = (key, value) => {
		if (isEqual(value, locationData[key])) {
			return;
		}

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
						inputKey={_location}
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

				{'page' === _location && sub_location && (
					<>
						<div className='__column __results_method_checkbox'>
							<CheckboxControl
								label={__(
									'Already have a product query?',
									'wc-ajax-product-filter'
								)}
								help={__(
									'Enable this if there is already a product query on the selected page. If multiple queries are found on a page, the query with the highest priority will work only.',
									'wc-ajax-product-filter'
								)}
								checked={'wcapf-form' === results_method}
								onChange={handleResultsMethodChange}
							/>
						</div>

						{'wcapf-form' !== results_method && (
							<ProductQuery
								index={index}
								query={product_query}
								handleQueryChange={handleQueryChange}
							/>
						)}
					</>
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

const AvailableOn = () => {
	const { state, dispatch } = useForm();
	const { handleFormLocations } = useFormSettings(state, dispatch);

	const {
		formSettings: { form_locations },
	} = state;

	let formLocations = [];

	if (formLocations) {
		if (!multipleFormLocations) {
			formLocations = form_locations.slice(0, 1);
		} else {
			formLocations = [...form_locations];
		}
	}

	const handleAddLocation = () => {
		const _formLocations = [...formLocations, defaultLocation()];

		handleFormLocations(_formLocations);
	};

	const handleFormLocation = (index, formLocation) => {
		const _formLocations = formLocations.map((location, _index) => {
			if (_index === index) {
				return formLocation;
			}

			return location;
		});

		handleFormLocations(_formLocations);
	};

	const handleRemoveLocation = (index) => {
		const _formLocations = formLocations.filter(
			(_location, _index) => index !== _index
		);

		handleFormLocations(_formLocations);
	};

	const showRemove = multipleFormLocations && formLocations.length > 1;

	return (
		<div className='__form_control __available_on'>
			<div className='__inner'>
				<div className='__label'>
					<label htmlFor='scroll_window'>
						{__('Available on', 'wc-ajax-product-filter')}
						{proTag(true)}
						{WCAPF_PRO && (
							<TippyTooltip
								content={__(
									'If you want to reuse a form in multiple locations enable it from "Settings > Others" tab.',
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
									{formLocations.map((location, index) => (
										<Location
											location={location}
											key={index}
											index={index}
											handleFormLocation={
												handleFormLocation
											}
											showRemove={showRemove}
											handleRemoveLocation={() =>
												handleRemoveLocation(index)
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
										'Upgrade to Pro to select taxonomies and pages.',
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

export default AvailableOn;
