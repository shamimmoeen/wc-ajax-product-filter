import { Button } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import AndClause from './AndClause';
import { isEmpty } from 'lodash';

const Rules = ({
	label,
	rules,
	handleChange,
	handleRemove,
	handleAddingAndClause,
	handleAddingOrClause,
	handleRemoveAllRules,
}) => {
	return (
		<div className='__visibility_rules'>
			<div className='__form_control'>
				<div className='__inner'>
					<div className='__label'>
						<label>{label}</label>
					</div>
					<div className='__wrapper'></div>
				</div>
			</div>

			{!isEmpty(rules) && (
				<div className='and-clauses'>
					{rules.map((clause, index) => (
						<AndClause
							clause={clause}
							andIndex={index}
							handleChange={handleChange}
							handleRemove={handleRemove}
							handleAddingOrClause={handleAddingOrClause}
							key={index}
						/>
					))}
				</div>
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
