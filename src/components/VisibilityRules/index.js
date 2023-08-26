import { __ } from '@wordpress/i18n';
import { isEmpty } from 'lodash';
import { useForm } from '../Form/FormContext';
import useFormFilterData from '../Form/useFormFilterData';
import Rules from './Rules';
import { placeholderRule } from './utils';

const VisibilityRules = ({ index }) => {
	const { state, dispatch } = useForm();

	const { handleVisibilityRulesChange } = useFormFilterData(state, dispatch);

	const { formFilters } = state;

	const filter = formFilters[index];

	const { visibility_rules: rules, type, taxonomy, meta_key } = filter;

	const filterData = { type, taxonomy, meta_key };

	const handleRuleChange = (column, andIndex, orIndex, value) => {
		if (value && ('term' === column || 'page' === column)) {
			const oldValue = rules[andIndex][orIndex][column];

			if (oldValue && oldValue.value === value.value) {
				return;
			}
		} else {
			const oldValue = rules[andIndex][orIndex][column];

			if (oldValue === value) {
				return;
			}
		}

		const newRules = rules.map((andData, _andIndex) =>
			andData.map((orData, _orIndex) => {
				if (_andIndex === andIndex && _orIndex === orIndex) {
					// Reset the 'term' value when 'archive' is changed.
					if ('archive' === column) {
						return {
							...orData,
							[column]: value,
							term: '',
						};
					} else {
						return { ...orData, [column]: value };
					}
				}

				return orData;
			})
		);

		handleVisibilityRulesChange(newRules, 'visibility_rules', index);
	};

	const handleRemoveRule = (andIndex, orIndex) => {
		const _orClauses = rules[andIndex];

		const orClauses = _orClauses.filter(
			(_array, index) => index !== orIndex
		);

		let newRules;

		if (isEmpty(orClauses)) {
			newRules = rules.filter((_array, index) => index !== andIndex);
		} else {
			newRules = rules.map((array, _orIndex) => {
				if (_orIndex === andIndex) {
					return orClauses;
				}

				return array;
			});
		}

		handleVisibilityRulesChange(newRules, 'visibility_rules', index);
	};

	const handleAddingAndClause = () => {
		const newRules = [...rules, [placeholderRule]];

		handleVisibilityRulesChange(newRules, 'visibility_rules', index);
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

		handleVisibilityRulesChange(newRules, 'visibility_rules', index);
	};

	const handleRemoveAllRules = () => {
		handleVisibilityRulesChange([], 'visibility_rules', index);
	};

	return (
		<Rules
			filterData={filterData}
			rules={rules}
			handleChange={handleRuleChange}
			handleRemove={handleRemoveRule}
			handleAddingAndClause={handleAddingAndClause}
			handleAddingOrClause={handleAddingOrClause}
			handleRemoveAllRules={handleRemoveAllRules}
		/>
	);
};

export default VisibilityRules;
