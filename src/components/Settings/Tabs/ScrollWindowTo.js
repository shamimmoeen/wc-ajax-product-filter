import { __ } from '@wordpress/i18n';
import Select from '../../Field/Select';
import { useSettings } from '../SettingsContext';
import useSettingsData from '../useSettingsData';

const scrollWindowOptions = [
	{
		label: __('Results container', 'wc-ajax-product-filter'),
		value: 'results',
	},
	{
		label: __('Custom element', 'wc-ajax-product-filter'),
		value: 'custom',
	},
	{
		label: __('None', 'wc-ajax-product-filter'),
		value: 'none',
	},
];

const scrollWindowForOptions = [
	{
		label: __('Desktop only', 'wc-ajax-product-filter'),
		value: 'desktop',
	},
	{
		label: __('Mobile only', 'wc-ajax-product-filter'),
		value: 'mobile',
	},
	{
		label: __('Desktop and mobile', 'wc-ajax-product-filter'),
		value: 'both',
	},
];

const scrollWindowWhenOptions = [
	{
		label: __('After updating the results', 'wc-ajax-product-filter'),
		value: 'after',
	},
	{
		label: __('Immediately', 'wc-ajax-product-filter'),
		value: 'immediately',
	},
];

const ScrollWindowTo = () => {
	const { state, dispatch } = useSettings();
	const { handleSelectChange } = useSettingsData(state, dispatch);

	const {
		settings: { scroll_window, scroll_window_for, scroll_window_when },
	} = state;

	const scrollWindow = scrollWindowOptions.find(
		(option) => option.value === scroll_window
	);

	const scrollWindowFor = scrollWindowForOptions.find(
		(option) => option.value === scroll_window_for
	);

	const scrollWindowWhen = scrollWindowWhenOptions.find(
		(option) => option.value === scroll_window_when
	);

	return (
		<div className='__form_control __scroll_window_to'>
			<div className='__inner'>
				<div className='__label'>
					<label htmlFor='scroll_window'>
						{__('Scroll window to', 'wc-ajax-product-filter')}
					</label>
				</div>

				<div className='__wrapper'>
					<div className='__input_wrapper'>
						<Select
							id={'scroll_window'}
							value={scrollWindow}
							options={scrollWindowOptions}
							onChange={(selected) =>
								handleSelectChange(selected, 'scroll_window')
							}
						/>

						{'none' !== scroll_window && (
							<>
								<Select
									id={'scroll_window_for'}
									value={scrollWindowFor}
									options={scrollWindowForOptions}
									onChange={(selected) =>
										handleSelectChange(
											selected,
											'scroll_window_for'
										)
									}
								/>

								<Select
									id={'scroll_window_when'}
									value={scrollWindowWhen}
									options={scrollWindowWhenOptions}
									onChange={(selected) =>
										handleSelectChange(
											selected,
											'scroll_window_when'
										)
									}
								/>
							</>
						)}
					</div>
				</div>
			</div>

			<p className='description'>
				{__(
					'Determines the scroll behavior.',
					'wc-ajax-product-filter'
				)}
			</p>
		</div>
	);
};

export default ScrollWindowTo;
