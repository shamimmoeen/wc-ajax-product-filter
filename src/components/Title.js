import { __ } from '@wordpress/i18n';
import { Button, Icon } from '@wordpress/components';
import { BackIcon } from './SVGIcons';
import Text from './Field/Text';

const Title = ({
	value,
	handleChange,
	isDirty,
	btnBusy,
	btnDisabled,
	handleSubmit,
}) => {
	const goBackLink = wcapf_admin_params.filters_page_link;

	let btnTitle;
	let btnVariant;

	if (isDirty) {
		btnTitle = <span>{__('Save', 'wc-ajax-product-filter')}</span>;
		btnVariant = 'primary';
	} else {
		btnTitle = (
			<span>
				<span className='__icon'>🔥</span>
				{__('Publish', 'wc-ajax-product-filter')}
			</span>
		);
		btnVariant = 'secondary';
	}

	return (
		<div className='__title_wrapper'>
			<Button href={goBackLink} className='__back_button'>
				<Icon icon={BackIcon} />
			</Button>

			<Text
				value={value}
				onChange={handleChange}
				renderAsFormField={false}
			/>

			<Button
				variant={btnVariant}
				className='__save_button'
				onClick={handleSubmit}
				isBusy={btnBusy}
				disabled={btnDisabled}
			>
				{btnTitle}
			</Button>
		</div>
	);
};

export default Title;
