import { __experimentalScrollable as Scrollable } from '@wordpress/components';
import { useLayoutEffect, useRef } from '@wordpress/element';
import classnames from 'classnames';

const Listbox = ({ id, label, description, options, value, onChange }) => {
	const wrapperRef = useRef(null);

	useLayoutEffect(() => {
		if (!wrapperRef || !wrapperRef.current) {
			return;
		}

		const target = wrapperRef.current.querySelector('.active');

		if (null === target) {
			return;
		}

		/**
		 * @source https://stackoverflow.com/a/11041376
		 */
		target.parentNode.parentNode.scrollTop =
			target.offsetTop - target.parentNode.parentNode.offsetTop;
	}, []);

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
								<div ref={wrapperRef}>
									{options.map((option, index) => (
										<div
											key={`listbox-${option.value}-${index}`}
											className={classnames('__item', {
												active: option.value === value,
											})}
											tabIndex={0}
											onClick={() =>
												onChange(option.value)
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
