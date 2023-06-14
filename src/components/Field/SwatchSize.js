import { __ } from '@wordpress/i18n';
import TippyTooltip from '../TippyTooltip';

const SwatchSize = ({
	label,
	description,
	tooltip,
	width,
	onWidthChange,
	height,
	onHeightChange,
}) => {
	return (
		<div className='__form_control __swatch_size'>
			<div className='__inner'>
				<div className='__label'>
					<label>
						{label}
						{tooltip && <TippyTooltip content={tooltip} />}
					</label>
				</div>
				<div className='__wrapper'>
					<div className='__input_wrapper'>
						<input
							className='components-text-control__input'
							type='number'
							placeholder={__('Width', 'wc-ajax-product-filter')}
							value={width}
							onChange={(e) => onWidthChange(e.target.value)}
						/>
						<input
							className='components-text-control__input'
							type='number'
							placeholder={__('Height', 'wc-ajax-product-filter')}
							value={height}
							onChange={(e) => onHeightChange(e.target.value)}
						/>
					</div>
				</div>
			</div>
			{description && (
				<p
					className='description'
					dangerouslySetInnerHTML={{ __html: description }}
				/>
			)}
		</div>
	);
};

export default SwatchSize;
