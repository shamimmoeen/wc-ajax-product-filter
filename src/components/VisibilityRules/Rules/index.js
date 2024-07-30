import { __ } from '@wordpress/i18n';
import { Button } from '@wordpress/components';
import { isEmpty } from 'lodash';
import AndClause from './AndClause';

const Rules = ({
	filterData,
	rules,
	handleChange,
	handleRemove,
	handleAddingAndClause,
	handleAddingOrClause,
	handleRemoveAllRules,
}) => {
	return (
		<div className='__visibility_rules'>
			{!isEmpty(rules) && (
				<>
					<div className='__form_control'>
						<div className='__inner'>
							<div className='__label'>
								<label className='__rules_heading'>
									{__(
										'Show the filter if',
										'wc-ajax-product-filter'
									)}
								</label>
							</div>
							<div className='__wrapper'></div>
						</div>
					</div>

					<div className='and-clauses'>
						{rules.map((clause, index) => (
							<AndClause
								filterData={filterData}
								clause={clause}
								andIndex={index}
								handleChange={handleChange}
								handleRemove={handleRemove}
								handleAddingOrClause={handleAddingOrClause}
								key={index}
							/>
						))}
					</div>
				</>
			)}

			<div className='__action_buttons'>
				<Button onClick={handleAddingAndClause} variant='secondary'>
					{__('Add Rule Group', 'wc-ajax-product-filter')}
				</Button>
				{!isEmpty(rules) && (
					<Button
						onClick={handleRemoveAllRules}
						variant='tertiary'
						isDestructive
					>
						{__('Remove All', 'wc-ajax-product-filter')}
					</Button>
				)}
			</div>
		</div>
	);
};

export default Rules;
