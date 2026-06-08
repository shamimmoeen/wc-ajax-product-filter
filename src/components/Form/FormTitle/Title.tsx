import { __ } from '@wordpress/i18n';
import { Button, Icon } from '@wordpress/components';
import { BackIcon } from '../../SVGIcons';
import Text from '../../Field/Text';
import { getFormsPageLink } from '../../utils';
import { useSelect } from '@wordpress/data';
import store from '../../../store/form';

const Title = ( {
	loading,
	handleTitleChange,
	handleSubmit,
}: {
	loading: boolean;
	handleTitleChange: ( value: string ) => void;
	handleSubmit: () => void;
} ) => {
	const title = useSelect( ( select ) => select( store ).getTitle(), [] );
	const isDirty = useSelect( ( select ) => select( store ).isDirty(), [] );

	let btnTitle;
	let btnVariant: 'primary' | 'secondary';
	let btnDisabled = false;

	if ( isDirty ) {
		btnTitle = <span>{ __( 'Save', 'wc-ajax-product-filter' ) }</span>;
		btnVariant = 'primary';
	} else {
		btnTitle = (
			<span>
				<span className='__icon'>🔥</span>
				{ __( 'Publish', 'wc-ajax-product-filter' ) }
			</span>
		);
		btnVariant = 'secondary';
	}

	if ( loading ) {
		btnDisabled = true;
	}

	return (
		<div className='__title_wrapper'>
			<Button href={ getFormsPageLink() } className='__back_button'>
				<Icon icon={ BackIcon } />
			</Button>

			<Text
				value={ title }
				onChange={ handleTitleChange }
				renderAsFormField={ false }
			/>

			<Button
				variant={ btnVariant }
				className='__save_button'
				onClick={ handleSubmit }
				isBusy={ loading }
				disabled={ btnDisabled }
			>
				{ btnTitle }
			</Button>
		</div>
	);
};

export default Title;
