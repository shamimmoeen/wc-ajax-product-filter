import { __ } from '@wordpress/i18n';
import { Button, Icon } from '@wordpress/components';
import { useForm } from '../FormContext';
import { BackIcon } from '../../SVGIcons';
import Text from '../../Field/Text';
import { getFormsPageLink } from '../../utils';

const Title = ({ loading, handleTitleChange, handleSubmit }) => {
	const {
		state: { title, filterStatus, isDirty },
	} = useForm();

	let btnTitle;
	let btnVariant;
	let btnDisabled = false;

	if (filterStatus) {
		btnTitle = <span>{__('Save', 'wc-ajax-product-filter')}</span>;
		btnVariant = 'primary';
		btnDisabled = true;
	} else if (isDirty) {
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

	if (loading) {
		btnDisabled = true;
	}

	return (
		<div className='__title_wrapper'>
			<Button href={getFormsPageLink()} className='__back_button'>
				<Icon icon={BackIcon} />
			</Button>

			<Text
				value={title}
				onChange={handleTitleChange}
				renderAsFormField={false}
			/>

			<Button
				variant={btnVariant}
				className='__save_button'
				onClick={handleSubmit}
				isBusy={loading}
				disabled={btnDisabled}
			>
				{btnTitle}
			</Button>
		</div>
	);
};

export default Title;
