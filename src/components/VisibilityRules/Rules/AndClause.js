import { __ } from '@wordpress/i18n';
import { Button } from '@wordpress/components';
import OrClause from './OrClause';

const AndClause = ({
	clause,
	andIndex,
	handleChange,
	handleRemove,
	handleAddingOrClause,
}) => {
	return (
		<div className='and-clause'>
			<div className='or-clauses'>
				{clause.map((andClause, index) => (
					<OrClause
						clause={andClause}
						orIndex={index}
						andIndex={andIndex}
						handleChange={handleChange}
						handleRemove={handleRemove}
						key={index}
					/>
				))}
				<Button
					onClick={() => handleAddingOrClause(andIndex)}
					variant='secondary'
					isSmall
				>
					{__('or', 'wc-ajax-product-filter')}
				</Button>
			</div>
			<p>{__('and', 'wc-ajax-product-filter')}</p>
		</div>
	);
};

export default AndClause;
