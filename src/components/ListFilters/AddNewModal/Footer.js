import { __ } from '@wordpress/i18n';
import { Flex, FlexItem, Button } from '@wordpress/components';
import { useListFilters } from '../ListFiltersContext';
import classnames from 'classnames';
import { disableFilterHandling } from '../../utils';

const Footer = ({
	step,
	setStep,
	totalSteps,
	closeModal,
	handleFilterSubmit,
}) => {
	const {
		state: { isFilterKeyChecking, title, filterType, activeFilterData },
	} = useListFilters();

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

		if (1 === step || (3 === totalSteps && 2 === step)) {
			let disabled = false;

			if (1 === step && !title) {
				disabled = true;
			} else if (3 === totalSteps && 2 === step && !filterType) {
				disabled = true;
			}

			content = (
				<Button
					variant='primary'
					onClick={() => setStep(step + 1)}
					disabled={disabled}
				>
					{__('Next', 'wc-ajax-product-filter')}
				</Button>
			);
		} else {
			let disabled = false;

			if (2 === step) {
				if (!filterType) {
					disabled = true;
				}
			} else if (3 === step) {
				if (isFilterKeyChecking) {
					disabled = true;
				} else {
					disabled = disableFilterHandling(activeFilterData);
				}
			}

			content = (
				<Button
					variant='primary'
					onClick={handleFilterSubmit}
					disabled={disabled}
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
				{3 === totalSteps && (
					<span
						className={classnames({
							active: 3 === step,
						})}
					/>
				)}
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
