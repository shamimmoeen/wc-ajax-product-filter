<?php
/**
 * WCAPF_Walker_Taxonomy class.
 *
 * @since      3.0.0
 * @package    wc-ajax-product-filter
 * @subpackage wc-ajax-product-filter/includes
 * @author     Mainul Hassan Main
 */

/**
 * WCAPF_Walker_Taxonomy class.
 *
 * @since 3.0.0
 */
class WCAPF_Walker_Taxonomy extends WCAPF_Walker {

	/**
	 * The taxonomy.
	 *
	 * @var string
	 */
	public $taxonomy;

	/**
	 * Hierarchical
	 *
	 * @var bool
	 */
	public $hierarchical;

	/**
	 * Show children only
	 *
	 * @var bool
	 */
	public $show_children_only;

}
