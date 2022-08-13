import {
	Button,
	CheckboxControl,
	Flex,
	FlexItem,
	Modal,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { useFilter } from '../../FilterContext';
import { find, each } from 'lodash';
import { useEffect } from '@wordpress/element';

const OptionsTableModal = ({ isOpen, closeModal }) => {
	const {
		state: { filterOptions, filterModalOptions },
		dispatch,
	} = useFilter();

	useEffect(() => {
		if (!isOpen) {
			return;
		}

		const _filterModalOptions = filterModalOptions.map((option) => {
			const found = find(filterOptions, { term_id: option.term_id });

			if (found) {
				option['status'] = 'added';
			} else {
				option['status'] = '';
			}

			return option;
		});

		dispatch({
			type: 'SET_FILTERS_MODAL_OPTIONS',
			payload: _filterModalOptions,
		});
	}, [isOpen]);

	const handleSelectAll = () => {
		const _filterModalOptions = filterModalOptions.map((option) => {
			option['status'] = 'added';

			return option;
		});

		dispatch({
			type: 'SET_FILTERS_MODAL_OPTIONS',
			payload: _filterModalOptions,
		});
	};

	const handleClearSelection = () => {
		const _filterModalOptions = filterModalOptions.map((option) => {
			option['status'] = '';

			return option;
		});

		dispatch({
			type: 'SET_FILTERS_MODAL_OPTIONS',
			payload: _filterModalOptions,
		});
	};

	const handleUpdateFilterOptions = () => {
		let _filterOptions = [...filterOptions];

		const removeIds = [];

		each(filterModalOptions, (option) => {
			if ('added' === option.status) {
				if (!find(_filterOptions, { term_id: option.term_id })) {
					_filterOptions.push(option);
				}
			} else {
				if (find(_filterOptions, { term_id: option.term_id })) {
					removeIds.push(option.term_id);
				}
			}
		});

		if (removeIds.length) {
			_filterOptions = _filterOptions.filter(
				(option) => !removeIds.includes(option.term_id)
			);
		}

		dispatch({ type: 'SET_FILTERS_OPTIONS', payload: _filterOptions });

		closeModal();
	};

	const handleOptionChange = (value, option) => {
		const _filterModalOptions = filterModalOptions.map((_option) => {
			if (option.term_id === _option.term_id) {
				_option['status'] = value ? 'added' : '';
			}

			return _option;
		});

		dispatch({
			type: 'SET_FILTERS_MODAL_OPTIONS',
			payload: _filterModalOptions,
		});
	};

	const modalOptions = () => {
		return (
			<div className='__options'>
				{filterModalOptions.map((option, index) => {
					return (
						<CheckboxControl
							key={`modal-option-${index}`}
							label={option.name}
							checked={'added' === option.status}
							onChange={(value) =>
								handleOptionChange(value, option)
							}
						/>
					);
				})}
			</div>
		);
	};

	return (
		<>
			{isOpen && (
				<Modal
					title={__('Add Filter Options', 'wc-ajax-product-filter')}
					onRequestClose={closeModal}
					className='__options_table_modal'
				>
					<p className='description'>
						{__(
							'Found the following options for',
							'wc-ajax-product-filter'
						)}
						{` `}
						<b>product category</b>.
					</p>
					{modalOptions()}
					<Flex>
						<FlexItem>
							<Flex>
								<Button
									variant='secondary'
									onClick={handleSelectAll}
								>
									{__('Select All', 'wc-ajax-product-filter')}
								</Button>
								<Button
									variant='secondary'
									onClick={handleClearSelection}
								>
									{__(
										'Clear Selection',
										'wc-ajax-product-filter'
									)}
								</Button>
							</Flex>
						</FlexItem>
						<FlexItem>
							<Flex>
								<Button
									variant='primary'
									onClick={handleUpdateFilterOptions}
								>
									{__('Update', 'wc-ajax-product-filter')}
								</Button>
							</Flex>
						</FlexItem>
					</Flex>
				</Modal>
			)}
		</>
	);
};

export default OptionsTableModal;
