import { Modal } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';
import Footer from './Footer';
import Body from './Body';

const AddNewModal = ({ isOpen, closeModal }) => {
	const [step, setStep] = useState(1);
	const [totalStep, setTotalSteps] = useState(2);

	return (
		isOpen && (
			<Modal
				className='__add_filter_modal'
				onRequestClose={closeModal}
				__experimentalHideHeader
			>
				<div className='__add_post_modal'>
					<h3 className='__heading'>
						{__('Add Filter', 'wc-ajax-product-filter')}
					</h3>

					<Body step={step} setTotalSteps={setTotalSteps} />

					<Footer
						step={step}
						setStep={setStep}
						totalStep={totalStep}
						closeModal={closeModal}
					/>
				</div>
			</Modal>
		)
	);
};

export default AddNewModal;
