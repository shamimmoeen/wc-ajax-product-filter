import { __ } from '@wordpress/i18n';
import Checkbox from '../Field/Checkbox';
import { useFilter } from '../Filter/FilterContext';
import useFilterData from '../Filter/useFilterData';
import Rules from './Rules';
import MediaScreenRules from './MediaScreenRules';
import { isEmpty } from 'lodash';
import { placeholderRule } from './utils';

const VisibilityRules = () => {
	const { state, dispatch } = useFilter();
	const { setDirty } = useFilterData(state, dispatch);

	const { filterType, visibilityRules } = state;
	const { media_screens, enable_rules, rules } = visibilityRules;

	const updateVisibilityRules = (value) => {
		dispatch({ type: 'SET_VISIBILITY_RULES', payload: value });

		setDirty();
	};

	const handleMediaScreenChange = (value) => {
		let values = [...media_screens];

		if (values.includes(value)) {
			values = values.filter((_value) => _value !== value);
		} else {
			values.push(value);
		}

		const _visibilityRules = { ...visibilityRules, media_screens: values };

		updateVisibilityRules(_visibilityRules);
	};

	const handleEnableRules = (value) => {
		const _visibilityRules = {
			...visibilityRules,
			enable_rules: value ? '1' : '',
		};

		updateVisibilityRules(_visibilityRules);
	};

	const handleRuleChange = (column, andIndex, orIndex, value) => {
		if ('rule' === column || 'operator' === column) {
			const oldValue = rules[andIndex][orIndex][column];

			if (oldValue === value.value) {
				return;
			}
		} else if ('compare' === column) {
			const oldValue = rules[andIndex][orIndex][column];

			if (oldValue.value === value.value) {
				return;
			}
		}

		const newRules = rules.map((andData, _andIndex) =>
			andData.map((orData, _orIndex) => {
				if (_andIndex === andIndex && _orIndex === orIndex) {
					if ('rule' === column) {
						const { group, value: newValue } = value;

						return {
							...orData,
							group,
							rule: newValue,
							compare: '',
							include_children: '',
						};
					} else if ('operator' === column) {
						const { value: operator } = value;

						return { ...orData, operator };
					} else if ('compare' === column) {
						return { ...orData, compare: value };
					} else if ('include_children' === column) {
						const checked = value ? '1' : '';
						return { ...orData, include_children: checked };
					}
				}

				return orData;
			})
		);

		const _visibilityRules = { ...visibilityRules, rules: newRules };

		updateVisibilityRules(_visibilityRules);
	};

	const handleRemoveRule = (andIndex, orIndex) => {
		const _orClauses = rules[andIndex];

		const orClauses = _orClauses.filter(
			(array, index) => index !== orIndex
		);

		let newRules;

		if (isEmpty(orClauses)) {
			newRules = rules.filter((array, index) => index !== andIndex);
		} else {
			newRules = rules.map((array, _orIndex) => {
				if (_orIndex === andIndex) {
					return orClauses;
				}

				return array;
			});
		}

		const _visibilityRules = { ...visibilityRules, rules: newRules };

		updateVisibilityRules(_visibilityRules);
	};

	const handleAddingAndClause = () => {
		const newRules = [...rules, [placeholderRule]];

		const _visibilityRules = { ...visibilityRules, rules: newRules };

		updateVisibilityRules(_visibilityRules);
	};

	const handleAddingOrClause = (andIndex) => {
		const _orClauses = rules[andIndex];
		const orClauses = [..._orClauses, placeholderRule];

		const newRules = rules.map((array, index) => {
			if (index === andIndex) {
				return orClauses;
			}

			return array;
		});

		const _visibilityRules = { ...visibilityRules, rules: newRules };

		updateVisibilityRules(_visibilityRules);
	};

	const handleRemoveAllRules = () => {
		const _visibilityRules = { ...visibilityRules, rules: [] };

		updateVisibilityRules(_visibilityRules);
	};

	return (
		<>
			<MediaScreenRules
				label={__('Hide filter on', 'wc-ajax-product-filter')}
				description={__(
					'Select screen sizes where you want to hide the filter.',
					'wc-ajax-product-filter'
				)}
				rules={media_screens}
				onChange={handleMediaScreenChange}
			/>

			{'active-filters' !== filterType && 'reset-button' !== filterType && (
				<>
					<Checkbox
						id={'enable_rules'}
						label={__(
							'Enable visibility rules',
							'wc-ajax-product-filter'
						)}
						description={__(
							'Create a set of rules to determine when the filter will be displayed.',
							'wc-ajax-product-filter'
						)}
						isChecked={enable_rules}
						onChange={handleEnableRules}
						isPro={true}
					/>

					{enable_rules && (
						<Rules
							label={__(
								'Show the filter if',
								'wc-ajax-product-filter'
							)}
							rules={rules}
							handleChange={handleRuleChange}
							handleRemove={handleRemoveRule}
							handleAddingAndClause={handleAddingAndClause}
							handleAddingOrClause={handleAddingOrClause}
							handleRemoveAllRules={handleRemoveAllRules}
						/>
					)}
				</>
			)}
		</>
	);
};

export default VisibilityRules;
