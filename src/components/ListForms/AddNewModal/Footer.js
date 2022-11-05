import { __ } from '@wordpress/i18n';
import { Flex, FlexItem, Button } from '@wordpress/components';
import classnames from 'classnames';
import { useListForms } from '../ListFormsContext';

const Footer = ({ step, setStep, closeModal, handleSubmit }) => {
	const {
		state: { title, isDirty },
	} = useListForms();

	const backButton = () => {
		let content;

		if (1 === step) {
			content = (
				<Button variant='secondary' onClick={closeModal}>
					{__('Cancel', 'wc-ajax-product-filter')}
				</Button>
			);
		} else {
			content = (
				<Button variant='secondary' onClick={() => setStep(step - 1)}>
					{__('Back', 'wc-ajax-product-filter')}
				</Button>
			);
		}

		return content;
	};

	const nextButton = () => {
		let content;

		if (1 === step) {
			content = (
				<Button
					variant='primary'
					onClick={() => setStep(step + 1)}
					disabled={!title}
				>
					{__('Next', 'wc-ajax-product-filter')}
				</Button>
			);
		} else {
			content = (
				<Button
					variant='primary'
					onClick={handleSubmit}
					disabled={!isDirty}
				>
					{__('Finish', 'wc-ajax-product-filter')}
				</Button>
			);
		}

		return content;
	};

	const dots = () => {
		return (
			<div className='_dots'>
				<span
					className={classnames({
						active: 1 === step,
					})}
				/>
				<span
					className={classnames({
						active: 2 === step,
					})}
				/>
			</div>
		);
	};

	return (
		<Flex>
			<FlexItem className='__left'>{backButton()}</FlexItem>
			<FlexItem className='__stepper'>{dots()}</FlexItem>
			<FlexItem className='__right'>{nextButton()}</FlexItem>
		</Flex>
	);
};

export default Footer;
