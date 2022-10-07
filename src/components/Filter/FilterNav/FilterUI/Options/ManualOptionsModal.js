import {
	Button,
	CheckboxControl,
	Flex,
	FlexItem,
	Modal,
	Spinner,
} from '@wordpress/components';
import { sprintf, __ } from '@wordpress/i18n';
import { useFilter } from '../../../FilterContext';
import { find, isEmpty } from 'lodash';
import { useEffect, useState } from '@wordpress/element';
import axios from 'axios';
import { getOptionsTableModalData } from '../../../utils';

const ManualOptionsModal = ({ isOpen, closeModal }) => {
	const {
		state: { filterType, activeFilterData },
		dispatch,
	} = useFilter();

	const [loading, setLoading] = useState(true);
	const [options, setOptions] = useState([]);
	const [fetched, setFetched] = useState(false);
	const [message, setMessage] = useState('');

	const { keyword, optionsKey, ajaxParams } = getOptionsTableModalData(
		filterType,
		activeFilterData
	);

	useEffect(() => {
		if (!isOpen) {
			return;
		}

		if (fetched) {
			return;
		}

		// Fetch the options.
		axios
			.get(wcapf_admin_params.ajaxurl, {
				params: ajaxParams,
			})
			.then((res) => {
				const data = res.data.data;
				const synced = syncOptions(data);

				setLoading(false);
				setFetched(true);
				setOptions(synced);
			})
			.catch((err) => {
				setLoading(false);
				setFetched(true);
				setMessage(
					__(
						'There was an error fetching the items.',
						'wc-ajax-product-filter'
					)
				);

				console.log(err);
			});
	}, [isOpen]);

	useEffect(() => {
		if (!isOpen) {
			return;
		}

		if (!fetched) {
			return;
		}

		const unsynced = [...options];
		const synced = syncOptions(unsynced);

		setOptions(synced);
	}, [isOpen]);

	const syncOptions = (unsynced) => {
		const addedOptions = activeFilterData[optionsKey];

		const synced = unsynced.map((option) => {
			const found = find(addedOptions, { value: option.value });

			if (found) {
				option['status'] = 'added';
			} else {
				option['status'] = '';
			}

			return option;
		});

		return synced;
	};

	const handleSelectAll = () => {
		const _options = options.map((option) => {
			option['status'] = 'added';

			return option;
		});

		setOptions(_options);
	};

	const handleClearSelection = () => {
		const _options = options.map((option) => {
			option['status'] = '';

			return option;
		});

		setOptions(_options);
	};

	const handleOptionChange = (value, index) => {
		const _options = [...options];
		_options[index]['status'] = value ? 'added' : '';

		setOptions(_options);
	};

	const handleUpdateFilterOptions = () => {
		let addedOptions = [...activeFilterData[optionsKey]];
		const removeIds = [];

		options.forEach((option) => {
			if ('added' === option.status) {
				if (!find(addedOptions, { value: option.value })) {
					addedOptions.push(option);
				}
			} else {
				if (find(addedOptions, { value: option.value })) {
					removeIds.push(option.value);
				}
			}
		});

		if (removeIds.length) {
			addedOptions = addedOptions.filter(
				(option) => !removeIds.includes(option.value)
			);
		}

		const _activeFilterData = {
			...activeFilterData,
			[optionsKey]: addedOptions,
		};

		dispatch({
			type: 'SET_ACTIVE_FILTER_DATA',
			payload: _activeFilterData,
		});

		closeModal();
	};

	const modalOptions = () => {
		return (
			<div className='__options'>
				{options.map((option, index) => {
					return (
						<CheckboxControl
							key={`modal-option-${index}`}
							label={option.label}
							checked={'added' === option.status}
							onChange={(value) =>
								handleOptionChange(value, index)
							}
						/>
					);
				})}
			</div>
		);
	};

	const modalLoader = () => {
		if (loading) {
			return (
				<div className='__loader'>
					<Spinner />
				</div>
			);
		}
	};

	const modalInfo = () => {
		let description = '';

		if (loading) {
			return;
		}

		if (fetched) {
			if (message) {
				description = message;
			} else {
				if (!isEmpty(options)) {
					description = sprintf(
						__(
							'Found the following items for <strong>%s</strong>.',
							'wc-ajax-product-filter'
						),
						keyword
					);
				} else {
					description = sprintf(
						__(
							'No items found for <strong>%s</strong>.',
							'wc-ajax-product-filter'
						),
						keyword
					);
				}
			}
		}

		if (description) {
			return (
				<p
					className='description'
					dangerouslySetInnerHTML={{ __html: description }}
				/>
			);
		}
	};

	return (
		<>
			{isOpen && (
				<Modal
					title={__('Add Options', 'wc-ajax-product-filter')}
					onRequestClose={closeModal}
					className='__options_table_modal'
				>
					{modalLoader()}
					{modalInfo()}
					{modalOptions()}
					{!loading && !isEmpty(options) && (
						<Flex>
							<FlexItem>
								<Flex>
									<Button
										variant='secondary'
										onClick={handleSelectAll}
									>
										{__(
											'Select All',
											'wc-ajax-product-filter'
										)}
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
					)}
				</Modal>
			)}
		</>
	);
};

export default ManualOptionsModal;
