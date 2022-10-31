import { __ } from '@wordpress/i18n';
import { CheckboxControl, Icon } from '@wordpress/components';
import { cancelCircleFilled } from '@wordpress/icons';
import Select from '../../Field/Select';
import SelectArchive from './SelectArchive';
import SelectRule from './SelectRule';
import { getRules, operators, isTaxonomyHierarchical } from '../utils';

const OrClause = ({
	clause,
	orIndex,
	andIndex,
	handleChange,
	handleRemove,
}) => {
	const { rule, operator, compare, include_children } = clause;
	const { group, value } = rule;

	const rules = getRules();

	const renderCompareField = () => {
		if ('page' === group) {
			return __('Shop', 'wc-ajax-product-filter');
		} else if ('filter' === group) {
			return __('Active', 'wc-ajax-product-filter');
		} else if ('archive' === group) {
			const taxonomy = value;

			return (
				<div className='compare'>
					<SelectArchive
						taxonomy={taxonomy}
						value={compare}
						onChange={(selected) =>
							handleChange('compare', andIndex, orIndex, selected)
						}
					/>
				</div>
			);
		}
	};

	const renderIncludeChildrent = () => {
		if ('archive' === group) {
			const taxonomy = value;

			if (
				'product_cat' === taxonomy ||
				isTaxonomyHierarchical(taxonomy)
			) {
				return (
					<div className='include-children-checkbox'>
						<CheckboxControl
							label={__(
								'Include children',
								'wc-ajax-product-filter'
							)}
							checked={include_children}
							onChange={(value) =>
								handleChange(
									'include_children',
									andIndex,
									orIndex,
									value
								)
							}
						/>
					</div>
				);
			}
		}
	};

	return (
		<div className='or-clause'>
			<div className='cols'>
				<div className='rule'>
					<SelectRule
						options={rules}
						value={rule}
						onChange={(selected) =>
							handleChange('rule', andIndex, orIndex, selected)
						}
					/>
				</div>

				<div className='operator'>
					<Select
						options={operators}
						value={operator}
						onChange={(selected) =>
							handleChange(
								'operator',
								andIndex,
								orIndex,
								selected
							)
						}
					/>
				</div>

				{renderCompareField()}

				{renderIncludeChildrent()}
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
