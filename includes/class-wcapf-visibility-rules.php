<?php
/**
 * The visibility rules class.
 *
 * @since      3.1.0
 * @package    wc-ajax-product-filter
 * @subpackage wc-ajax-product-filter/includes
 * @author     wptools.io
 */

/**
 * WCAPF_Visibility_Rules class.
 *
 * @since 3.1.0
 */
class WCAPF_Visibility_Rules {

	/**
	 * @var bool
	 */
	private $apply_rules;

	/**
	 * @var array
	 */
	private $rules;

	/**
	 * Constructor.
	 *
	 * @param bool  $enable_visibility_rules Determines if we apply the visibility rules or not.
	 * @param array $visibility_rules        The array of rules.
	 */
	public function __construct( $enable_visibility_rules, $visibility_rules ) {
		$this->apply_rules = $enable_visibility_rules;

		$this->rules = is_array( $visibility_rules ) ? $visibility_rules : array();
	}

	/**
	 * Checks if the visibility rules are met.
	 *
	 * @return bool
	 */
	public function meet_rules() {
		if ( ! $this->apply_rules ) {
			return true;
		}

		$or_clauses = array();

		// start
		$conditions             = '';
		$single_line_rule_index = 0;
		// end

		foreach ( $this->rules as $single_line_rule ) {
			$and_clauses = array();

			// start
			if ( 0 < $single_line_rule_index ) {
				$conditions .= ' OR ';
			}

			$conditions .= '( ';

			$and_clause_index = 0;
			// end

			foreach ( $single_line_rule as $and_clause ) {
				$rule     = $and_clause[0];
				$operator = $and_clause[1];
				$value    = $and_clause[2];

				$and_clauses[] = $this->meet_rule( $rule, $operator, $value );

				// start
				if ( 0 < $and_clause_index ) {
					$conditions .= ' AND ';
				}

				$conditions .= '( ';
				$conditions .= $rule;
				$conditions .= ' ' . $operator;
				$conditions .= ' ' . $value;

				$conditions .= ' )';

				$and_clause_index ++;
				// end
			}

			// start
			$conditions .= ' )';
			// end

			$single_line_rule_index ++;

			// all should be true
			$and_clauses_matches = true;

			foreach ( $and_clauses as $_and_clause ) {
				if ( ! $_and_clause ) {
					$and_clauses_matches = false;
					break;
				}
			}

			$or_clauses[] = $and_clauses_matches;
		}

		$or_clauses_matches = false;

		foreach ( $or_clauses as $_or_clause ) {
			if ( $_or_clause ) {
				$or_clauses_matches = true;
				break;
			}
		}

		return $or_clauses_matches;
	}

	private function meet_rule( $rule, $operator, $value ) {
		if ( 'page' === $rule ) {
			$match = is_shop();
		} else {
			$match = is_tax( $rule, $value );
		}

		if ( 'not-equal' === $operator ) {
			$match = ! $match;
		}

		return apply_filters( 'header_footer_scripts_meet_rule', $match, $rule, $operator, $value );
	}

}
