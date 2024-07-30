import { __ } from '@wordpress/i18n';
import { Icon } from '@wordpress/components';
import { cancelCircleFilled } from '@wordpress/icons';
import { isEmpty } from 'lodash';
import Select from '../../Field/Select';
import Text from '../../Field/Text';
import SelectVisibilityRule from './SelectVisibilityRule';
import {
	getVRRules,
	getVRUserOptions,
	getVRTaxonomies,
	getVRGlobalFilterKeys,
	getVROperators,
	getVRFilterOperators,
} from '../utils';

const rules = getVRRules();
const operators = getVROperators();
const filterOperators = getVRFilterOperators();
const userOptions = getVRUserOptions();
const archiveOptions = getVRTaxonomies();

const OrClause = ({
	filterData,
	clause,
	orIndex,
	andIndex,
	handleChange,
	handleRemove,
}) => {
	const { type, taxonomy, meta_key } = filterData;

	const {
		rule: rule_,
		operator: operator_,
		page,
		user: user_,
		archive: archive_,
		term,
		filter: filter_,
		filter_operator,
		filter_contains,
	} = clause;

	const operator = operators.find((option) => option.value === operator_);

	const filterOperator = filterOperators.find(
		(option) => option.value === filter_operator
	);

	const filterOptions = getVRGlobalFilterKeys(type, taxonomy, meta_key);

	const rule = rules.find((option) => option.value === rule_);

	const renderOperatorField = () => {
		if ('filter' === rule_) {
			return (
				<div className='operator'>
					<Select
						options={filterOperators}
						value={filterOperator}
						onChange={(selected) =>
							handleChange(
								'filter_operator',
								andIndex,
								orIndex,
								selected.value
							)
						}
					/>
				</div>
			);
		} else {
			return (
				<div className='operator'>
					<Select
						options={operators}
						value={operator}
						onChange={(selected) =>
							handleChange(
								'operator',
								andIndex,
								orIndex,
								selected.value
							)
						}
					/>
				</div>
			);
		}
	};

	const renderCondition2Field = () => {
		if ('page' === rule_) {
			return (
				<div className='condition_2 page_options_dropdown'>
					<SelectVisibilityRule
						uniqueId='vr_pages'
						type='page'
						value={page}
						onChange={(selected) =>
							handleChange('page', andIndex, orIndex, selected)
						}
					/>
				</div>
			);
		} else if ('user' === rule_) {
			const user = userOptions.find((option) => option.value === user_);

			return (
				<div className='condition_2 user_options_dropdown'>
					<Select
						placeholder={__(
							'Select user role',
							'wc-ajax-product-filter'
						)}
						inputKey={'user'}
						options={userOptions}
						value={user}
						onChange={(selected) =>
							handleChange(
								'user',
								andIndex,
								orIndex,
								selected.value
							)
						}
					/>
				</div>
			);
		} else if ('archive' === rule_) {
			const archive = archiveOptions.find(
				(option) => option.value === archive_
			);

			return (
				<div className='condition_2 archive_options_dropdown'>
					<Select
						placeholder={__(
							'Select taxonomy',
							'wc-ajax-product-filter'
						)}
						inputKey={'archive'}
						options={archiveOptions}
						value={archive}
						onChange={(selected) =>
							handleChange(
								'archive',
								andIndex,
								orIndex,
								selected.value
							)
						}
					/>
				</div>
			);
		} else if ('filter' === rule_) {
			const filterActive = filterOptions.find(
				(option) => option.value === filter_
			);

			return (
				<div className='condition_2 filter_options_dropdown'>
					<Select
						placeholder={__(
							'Select filter',
							'wc-ajax-product-filter'
						)}
						inputKey={'filter'}
						options={filterOptions}
						value={filterActive}
						onChange={(selected) =>
							handleChange(
								'filter',
								andIndex,
								orIndex,
								selected.value
							)
						}
					/>
				</div>
			);
		} else {
			return '';
		}
	};

	const renderCondition3Field = () => {
		if ('archive' === rule_ && !isEmpty(archive_)) {
			const uniqueId = `vr_terms_${archive_}`;

			return (
				<div className='condition_3 term_options_dropdown'>
					<SelectVisibilityRule
						uniqueId={uniqueId}
						taxonomy={archive_}
						value={term}
						onChange={(selected) =>
							handleChange('term', andIndex, orIndex, selected)
						}
					/>
				</div>
			);
		} else if ('filter' === rule_ && !isEmpty(filter_)) {
			return (
				<div className='__form_control condition_3 filter_value_input'>
					<Text
						renderAsFormField={false}
						placeholder={__(
							'Leave empty to match any',
							'wc-ajax-product-filter'
						)}
						onChange={(value) =>
							handleChange(
								'filter_contains',
								andIndex,
								orIndex,
								value
							)
						}
						value={filter_contains}
					/>
				</div>
			);
		} else {
			return '';
		}
	};

	return (
		<div className='or-clause'>
			<div className='cols'>
				<div className='rule'>
					<Select
						options={rules}
						value={rule}
						onChange={(selected) =>
							handleChange(
								'rule',
								andIndex,
								orIndex,
								selected.value
							)
						}
					/>
				</div>

				{renderOperatorField()}

				{renderCondition2Field()}

				{renderCondition3Field()}
			</div>

			<button
				onClick={() => handleRemove(andIndex, orIndex)}
				className='button-link button-link-delete remove-clause-btn'
			>
				<Icon icon={cancelCircleFilled} size={20} />
			</button>
		</div>
	);
};

export default OrClause;
