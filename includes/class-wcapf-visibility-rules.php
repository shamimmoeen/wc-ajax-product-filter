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
	 * Constructor.
	 */
	private function __construct() {
	}

	/**
	 * Checks if the visibility rules are met.
	 *
	 * @param array $rules The array of rules.
	 *
	 * @return bool
	 */
	public static function meet_rules( $rules ) {
		if ( ! $rules ) {
			return true;
		}

		$or_clauses = array();

		// start
		$conditions             = '';
		$single_line_rule_index = 0;
		// end

		foreach ( $rules as $single_line_rule ) {
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

				$and_clauses[] = self::meet_rule( $rule, $operator, $value );

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

	/**
	 * Check if the visibility rule is met.
	 *
	 * @param string $rule     The rule to check.
	 * @param string $operator The operator, equal or not-equal.
	 * @param string $value    The value to compare.
	 *
	 * @return bool
	 */
	public static function meet_rule( $rule, $operator, $value ) {
		if ( 'page' === $rule ) {
			$match = is_shop();
		} else {
			$match = is_tax( $rule, $value );
		}

		if ( 'not-equal' === $operator ) {
			$match = ! $match;
		}

		return apply_filters( 'wcapf_meet_visibility_rule', $match, $rule, $operator, $value );
	}

}
