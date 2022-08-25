import { __experimentalScrollable as Scrollable } from '@wordpress/components';
import { useEffect, useState } from '@wordpress/element';
import classnames from 'classnames';
import { useListFilters } from '../ListFilters/ListFiltersContext';
import { prepareMetaKeys } from '../utils';

const Listbox = () => {
	const {
		state: {
			additionalData: { meta_keys },
		},
	} = useListFilters();

	const [options, setOptions] = useState([]);

	const id = 'meta_key';
	const label = 'Meta Key';
	const description = '';

	useEffect(() => {
		if (!meta_keys) {
			return;
		}

		setOptions(prepareMetaKeys(meta_keys));
	}, [meta_keys]);

	const handleSetFocus = ({ value }) => {
		const _options = options.map((_option) => {
			if (value === _option.value) {
				_option.active = true;
			} else {
				_option.active = false;
			}

			return _option;
		});

		setOptions(_options);
	};

	return (
		<div className='__form_control __form_control_listbox'>
			<div className='__inner'>
				<div className='__label'>
					<label htmlFor={id}>{label}</label>
				</div>
				<div className='__wrapper'>
					<div className='__input_wrapper'>
						<div className='__form_input_listbox'>
							<Scrollable style={{ maxHeight: 90 }}>
								<div>
									{options.map((option, index) => (
										<div
											key={`listbox-${option.value}-${index}`}
											className={classnames('__item', {
												active: option.active,
											})}
											tabIndex={0}
											onClick={() =>
												handleSetFocus(option)
											}
										>
											{option.label}
										</div>
									))}
								</div>
							</Scrollable>
						</div>
					</div>
				</div>
			</div>
			{description ? <p className='description'>{description}</p> : ''}
		</div>
	);
};

export default Listbox;
