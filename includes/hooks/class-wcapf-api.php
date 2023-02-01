<?php
/**
 * The api class.
 *
 * @since      4.0.0
 * @package    wc-ajax-product-filter
 * @subpackage wc-ajax-product-filter/includes/hooks
 * @author     wptools.io
 */

/**
 * WCAPF_API class.
 *
 * @since 4.0.0
 */
class WCAPF_API {

	/**
	 * Constructor.
	 */
	private function __construct() {
	}

	/**
	 * Returns an instance of this class.
	 *
	 * @return WCAPF_API
	 */
	public static function instance() {
		// Store the instance locally to avoid private static replication
		static $instance = null;

		// Only run these methods if they haven't been run previously
		if ( null === $instance ) {
			$instance = new WCAPF_API();
			$instance->init_hooks();
		}

		return $instance;
	}

	/**
	 * Hook into actions and filters.
	 */
	private function init_hooks() {
		add_action( 'wp_ajax_wcapf_get_terms_for_modal', array( $this, 'get_terms_for_modal' ) );
		add_action( 'wp_ajax_wcapf_get_meta_values_for_modal', array( $this, 'get_meta_values_for_modal' ) );
		add_action( 'wp_ajax_wcapf_get_post_authors_for_modal', array( $this, 'get_post_authors_for_modal' ) );
		add_action( 'wp_ajax_wcapf_get_terms_for_dropdown', array( $this, 'get_terms_for_dropdown' ) );
		add_action( 'wp_ajax_wcapf_get_authors_for_dropdown', array( $this, 'get_authors_for_dropdown' ) );
		add_action( 'wp_ajax_wcapf_get_pages_for_dropdown', array( $this, 'get_pages_for_dropdown' ) );

		// For form.
		add_action( 'wp_ajax_wcapf_get_available_filters', array( $this, 'get_available_filters' ) );
		add_action( 'wp_ajax_wcapf_get_form_data', array( $this, 'get_form_data' ) );
		add_action( 'wp_ajax_wcapf_add_form', array( $this, 'add_form' ) );
		add_action( 'wp_ajax_wcapf_save_form', array( $this, 'save_form' ) );
		add_action( 'wp_ajax_wcapf_get_form_preview', array( $this, 'get_form_preview' ) );
		add_action( 'wp_ajax_wcapf_duplicate_form', array( $this, 'duplicate_form' ) );
		add_action( 'wp_ajax_wcapf_delete_form', array( $this, 'delete_form' ) );
		add_action( 'wp_ajax_wcapf_delete_filter', array( $this, 'delete_filter' ) );

		// Save settings.
		add_action( 'wp_ajax_wcapf_save_settings', array( $this, 'save_settings' ) );
	}

	public function add_form() {
		$form_title     = isset( $_POST['form_title'] ) ? sanitize_text_field( $_POST['form_title'] ) : '';
		$_form_settings = isset( $_POST['form_settings'] ) ? $_POST['form_settings'] : '';
		$form_settings  = stripslashes( $_form_settings );
		$form_settings  = json_decode( $form_settings, true );

		$post_arr = array(
			'post_title'   => $form_title,
			'post_type'    => 'wcapf-form',
			'post_status'  => 'publish',
			'post_content' => maybe_serialize( $form_settings ),
		);

		$new_form_id = wp_insert_post( $post_arr, true );

		if ( is_wp_error( $new_form_id ) ) {
			wp_send_json_error( $new_form_id->get_error_message() );
		}

		wp_send_json_success( WCAPF_API_Utils::get_form_data( $new_form_id ) );
	}

	/**
	 * Gets the form data via ajax for the edit form UI.
	 *
	 * @return void
	 */
	public function get_form_data() {
		$post_id = isset( $_GET['post_id'] ) ? absint( $_GET['post_id'] ) : '';
		$form    = get_post( $post_id );

		if ( 'wcapf-form' !== $form->post_type ) {
			wp_send_json_error( __( 'Invalid form id', 'wc-ajax-product-filter' ) );
		}

		$args = array(
			'post_type'   => 'wcapf-filter',
			'post_status' => 'publish',
			'nopaging'    => true,
			'post_parent' => $post_id,
			'order'       => 'ASC',
			'orderby'     => 'menu_order',
		);

		$filter_ids   = get_posts( $args );
		$form_filters = array();

		foreach ( $filter_ids as $filter_id ) {
			$post = get_post( $filter_id );

			if ( ! $post || 'wcapf-filter' !== $post->post_type ) {
				continue;
			}

			$filter = maybe_unserialize( $post->post_content );
			$filter = $this->parse_filter_data( $filter );

			$form_filters[] = $filter;
		}

		$form_settings = maybe_unserialize( $form->post_content );

		wp_send_json_success( array(
			'post_id'       => $post_id,
			'post_title'    => get_the_title( $post_id ),
			'filter_keys'   => WCAPF_API_Utils::get_filter_keys(),
			'form_filters'  => $form_filters,
			'form_settings' => $form_settings,
		) );
	}

	/**
	 * Parse the filter data for react ui.
	 *
	 * @param array $filter The filter data.
	 *
	 * @return array
	 */
	private function parse_filter_data( $filter ) {
		$value_may_have_spaces = array(
			'value_prefix',
			'value_postfix',
			'values_separator',
			'text_before_min_value',
			'text_before_max_value',
		);

		foreach ( $value_may_have_spaces as $key ) {
			$value = isset( $filter[ $key ] ) ? $filter[ $key ] : '';

			$filter[ $key ] = str_replace( '&nbsp;', ' ', $value );
		}

		// Prepare the term data.
		$parent_term   = isset( $filter['parent_term'] ) ? $filter['parent_term'] : '';
		$include_terms = isset( $filter['include_terms'] ) ? $filter['include_terms'] : array();
		$exclude_terms = isset( $filter['exclude_terms'] ) ? $filter['exclude_terms'] : array();

		if ( $parent_term ) {
			$term = get_term( $parent_term );

			$filter['parent_term'] = array(
				'value' => $term->term_id,
				'label' => $term->name,
			);
		}

		$array = array(
			'include_terms' => $include_terms,
			'exclude_terms' => $exclude_terms,
		);

		foreach ( $array as $key => $values ) {
			if ( $values ) {
				$parsed = array();

				foreach ( $values as $id ) {
					$term = get_term( $id );

					if ( $term && ! is_wp_error( $term ) ) {
						$parsed[] = array(
							'value' => $term->term_id,
							'label' => $term->name,
						);
					}
				}

				$filter[ $key ] = $parsed;
			}
		}

		// Prepare the user data.
		$include_authors = isset( $filter['include_authors'] ) ? $filter['include_authors'] : array();
		$exclude_authors = isset( $filter['exclude_authors'] ) ? $filter['exclude_authors'] : array();

		$array = array(
			'include_authors' => $include_authors,
			'exclude_authors' => $exclude_authors,
		);

		foreach ( $array as $key => $values ) {
			if ( $values ) {
				$parsed = array();

				foreach ( $values as $id ) {
					$user = get_userdata( $id );

					if ( $user && ! is_wp_error( $user ) ) {
						$parsed[] = array(
							'value' => $user->ID,
							'label' => $user->display_name,
						);
					}
				}

				$filter[ $key ] = $parsed;
			}
		}

		// Prepare user roles.
		$include_user_roles = isset( $filter['include_user_roles'] ) ? $filter['include_user_roles'] : array();

		if ( $include_user_roles ) {
			$roles  = WCAPF_Product_Filter_Utils::get_user_roles();
			$parsed = array();

			foreach ( $include_user_roles as $role ) {
				$parsed[] = array(
					'value' => $role,
					'label' => $roles[ $role ],
				);
			}

			$filter['include_user_roles'] = $parsed;
		}

		return $filter;
	}

	/**
	 * Saves the form via ajax.
	 *
	 * @return void
	 */
	public function save_form() {
		$form_id    = isset( $_POST['form_id'] ) ? absint( $_POST['form_id'] ) : 0;
		$form_title = isset( $_POST['form_title'] ) ? sanitize_text_field( $_POST['form_title'] ) : '';

		$_form_filters = isset( $_POST['form_filters'] ) ? $_POST['form_filters'] : '';
		$form_filters  = stripslashes( $_form_filters );
		$form_filters  = json_decode( $form_filters, true );

		$_form_settings = isset( $_POST['form_settings'] ) ? $_POST['form_settings'] : '';
		$form_settings  = stripslashes( $_form_settings );
		$form_settings  = json_decode( $form_settings, true );

		if ( ! $form_id || 'wcapf-form' !== get_post_type( $form_id ) ) {
			wp_send_json_error( __( 'Invalid form id', 'wc-ajax-product-filter' ) );
		}

		// Sanitize form data.
		// $form_settings = array_map( 'sanitize_text_field', (array) $form_settings );
		// TODO: Sanitize form settings.

		$post_arr = array(
			'ID'           => $form_id,
			'post_title'   => $form_title,
			'post_content' => maybe_serialize( $form_settings ),
		);

		$new_form_id = wp_update_post( $post_arr, true );

		if ( is_wp_error( $new_form_id ) ) {
			wp_send_json_error( $new_form_id->get_error_message() );
		}

		$found_pro = WCAPF_Helper::found_pro_version();

		$possible_types = WCAPF_API_Utils::get_filter_types();
		$valid_types    = wp_list_pluck( $possible_types, 'value' );
		$filter_types   = array();
		$filters        = array();
		$errors         = array();

		if ( $form_filters ) {
			foreach ( $form_filters as $filter_order => $filter ) {
				$filter_title = isset( $filter['title'] ) ? sanitize_text_field( $filter['title'] ) : '';
				$filter_id    = isset( $filter['id'] ) ? absint( $filter['id'] ) : 0;
				$post_name    = isset( $filter['field_key'] ) ? sanitize_title( $filter['field_key'] ) : '';
				$type         = isset( $filter['type'] ) ? sanitize_text_field( $filter['type'] ) : '';
				$taxonomy     = isset( $filter['taxonomy'] ) ? sanitize_text_field( $filter['taxonomy'] ) : '';
				$meta_key     = isset( $filter['meta_key'] ) ? sanitize_text_field( $filter['meta_key'] ) : '';

				if ( ! in_array( $type, $valid_types ) ) {
					continue;
				}

				if ( 'taxonomy' === $type && ! $taxonomy ) {
					continue;
				} elseif ( 'post-meta' === $type && ! $meta_key ) {
					continue;
				}

				if ( 'taxonomy' === $type ) {
					$taxonomy_index    = array_search( 'taxonomy', array_column( $possible_types, 'value' ) );
					$taxonomy_options  = $possible_types[ $taxonomy_index ];
					$taxonomy_types    = $taxonomy_options['options'];
					$filter_type_index = array_search( $taxonomy, array_column( $taxonomy_types, 'value' ) );
					$filter_type_data  = $taxonomy_types[ $filter_type_index ];
				} else {
					$filter_type_index = array_search( $type, array_column( $possible_types, 'value' ) );
					$filter_type_data  = $possible_types[ $filter_type_index ];
				}

				$global_filter_key = WCAPF_API_Utils::get_global_filter_key( $filter );

				// Try to grab the global filter key when possible.
				if ( $global_filter_key ) {
					$post_name = $global_filter_key;
				}

				// Set default filter key.
				if ( ! $post_name ) {
					if ( 'post-meta' === $type ) {
						$post_name = $meta_key;
					} else {
						$post_name = $filter_type_data['key'];
					}
				}

				$error_data = array();

				if ( ! $found_pro ) {
					if ( post_type_exists( $post_name ) ) {
						$error_data = array(
							'key'       => 'field_key_error_',
							'message'   => __( 'In the FREE version of the plugin direct post type name can\'t be used as a filter key, it\'ll create conflict. Please make it unique by adding an underscore.', 'wc-ajax-product-filter' ),
							'order'     => $filter_order,
							'field_key' => $post_name,
						);
					} elseif ( ! WCAPF_Helper::found_pro_version() && taxonomy_exists( $post_name ) ) {
						$error_data = array(
							'key'       => 'field_key_error_',
							'message'   => __( 'In the FREE version of the plugin direct taxonomy name can\'t be used as a filter key, it\'ll create conflict. Please make it unique by adding an underscore.', 'wc-ajax-product-filter' ),
							'order'     => $filter_order,
							'field_key' => $post_name,
						);
					}
				}

				if ( $error_data ) {
					$errors[] = $error_data;

					continue;
				}

				// Don't proceed if error found from previous filters.
				if ( $errors ) {
					continue;
				}

				if ( 'taxonomy' === $type ) {
					$taxonomy = isset( $filter['taxonomy'] ) ? sanitize_text_field( $filter['taxonomy'] ) : '';

					if ( ! $taxonomy ) {
						continue;
					}

					$filter_type = $type . '>' . $taxonomy;
				} elseif ( 'post-meta' === $type ) {
					$meta_key = isset( $filter['meta_key'] ) ? sanitize_text_field( $filter['meta_key'] ) : '';

					if ( ! $meta_key ) {
						continue;
					}

					$filter_type = $type . '>' . $meta_key;
				} else {
					$filter_type = $type;
				}

				// Don't add same filter type in a form multiple times.
				if ( in_array( $filter_type, $filter_types ) ) {
					continue;
				}

				$filter_types[] = $filter_type;

				if ( ! $filter_title ) {
					if ( 'post-meta' === $type ) {
						$filter_title = $filter_type_data['label'] . '[' . $meta_key . ']';
					} else {
						$filter_title = $filter_type_data['label'];
					}
				}

				$post_arr = array( 'post_title' => $filter_title );

				if ( $filter_id && 'wcapf-filter' === get_post_type( $filter_id ) ) {
					$post_arr['ID'] = $filter_id;

					$new_filter_id = wp_update_post( $post_arr, true );
				} else {
					$post_arr['post_type']    = 'wcapf-filter';
					$post_arr['post_status']  = 'publish';
					$post_arr['post_parent']  = $new_form_id;
					$post_arr['post_excerpt'] = $filter_type;

					$new_filter_id = wp_insert_post( $post_arr, true );
				}

				if ( is_wp_error( $new_filter_id ) ) {
					continue;
				}

				$filter['id']        = $new_filter_id;
				$filter['title']     = $filter_title;
				$filter['field_key'] = $post_name;

				/**
				 * The hooks for altering the filter data.
				 */
				$sanitized = apply_filters(
					'wcapf_sanitize_filter_data',
					$this->sanitize_filter_data( $filter ),
					$filter
				);

				$post_arr = array(
					'ID'           => $new_filter_id,
					'post_content' => maybe_serialize( $sanitized ),
					'post_name'    => $post_name,
					'menu_order'   => $filter_order,
				);

				add_filter( 'pre_wp_unique_post_slug', function () use ( $post_name ) {
					return $post_name;
				} );

				$new_filter_id = wp_update_post( $post_arr, true );

				if ( ! is_wp_error( $new_filter_id ) ) {
					$filters[] = $sanitized;
				}
			}
		}

		if ( $errors ) {
			wp_send_json_error( array( 'errors' => $errors ) );
		}

		$filters_for_ui = array();

		foreach ( $filters as $filter ) {
			$filters_for_ui[] = $this->parse_filter_data( $filter );
		}

		$response = array(
			'filter_keys'   => WCAPF_API_Utils::get_filter_keys(),
			'form_filters'  => $filters_for_ui,
			'form_settings' => $form_settings,
		);

		wp_send_json_success( $response );
	}

	/**
	 * Sanitize the filter data before saving into the database.
	 *
	 * @param array $filter The filter data.
	 *
	 * @return array
	 */
	private function sanitize_filter_data( $filter ) {
		$float_fields  = array( 'min_value', 'max_value', 'step' );
		$absint_fields = array( 'decimal_places', 'soft_limit', 'max_height' );

		$limit_fields = array(
			'include_terms',
			'exclude_terms',
			'include_authors',
			'exclude_authors',
			'include_user_roles',
		);

		$single_array_fields = array( 'parent_term' );

		$value_may_have_spaces = array(
			'value_prefix',
			'value_postfix',
			'values_separator',
			'text_before_min_value',
			'text_before_max_value',
		);

		$markup_fields = array( 'help_text' );

		$sanitized_filter = array();

		foreach ( $filter as $key => $value ) {
			if ( in_array( $key, $float_fields ) ) {
				$value = floatval( $value );

				if ( 'min_value' === $key && ! $value ) {
					$value = 0;
				}

				if ( 'max_value' === $key && ! $value ) {
					$value = 100;
				}

				if ( 'step' === $key && ! $value ) {
					$value = 1;
				}
			} elseif ( in_array( $key, $absint_fields ) ) {
				$value = absint( $value );
			} elseif ( in_array( $key, $limit_fields ) ) {
				// Pick the ids only.
				$value = wp_list_pluck( $value, 'value' );
				$value = array_map( 'sanitize_text_field', $value );
			} elseif ( in_array( $key, $single_array_fields ) ) {
				$value = isset( $value['value'] ) ? $value['value'] : '';
			} elseif ( in_array( $key, $value_may_have_spaces ) ) {
				$with_markup = array( 'values_separator', 'text_before_min_value', 'text_before_max_value' );

				if ( in_array( $key, $with_markup ) ) {
					$value = wp_kses_data( $value );
				} else {
					$value = sanitize_text_field( $value );
				}

				$value = str_replace( ' ', '&nbsp;', $value );
			} elseif ( in_array( $key, $markup_fields ) ) {
				$value = wp_kses_data( $value );
			} else {
				$value = sanitize_text_field( $value );
			}

			$sanitized_filter[ $key ] = $value;
		}

		return $sanitized_filter;
	}

	public function get_form_preview() {
		$post_id = isset( $_GET['post_id'] ) ? absint( $_GET['post_id'] ) : '';

		ob_start();

		echo do_shortcode( '[wcapf_filter_form id=' . $post_id . ']' );

		$preview = ob_get_clean();

		wp_send_json_success( $preview );
	}

	/**
	 * Gets the taxonomy terms for the manual options modal via ajax.
	 *
	 * @return void
	 */
	public function get_terms_for_modal() {
		$taxonomy = isset( $_GET['taxonomy'] ) ? sanitize_text_field( $_GET['taxonomy'] ) : '';
		$number   = apply_filters( 'wcapf_max_number_of_terms_for_browse_options_modal', 99 );

		$args = array(
			'taxonomy'   => $taxonomy,
			'hide_empty' => false,
			'fields'     => 'id=>name',
			'number'     => absint( $number ),
		);

		$terms    = get_terms( $args );
		$response = array();

		if ( $terms && ! is_wp_error( $terms ) ) {
			foreach ( $terms as $term_id => $term_name ) {
				$response[] = array(
					'value' => $term_id,
					'label' => $term_name,
				);
			}
		}

		wp_send_json_success( $response );
	}

	/**
	 * Gets the taxonomy terms via ajax.
	 *
	 * @return void
	 */
	public function get_terms_for_dropdown() {
		$taxonomy    = isset( $_GET['taxonomy'] ) ? sanitize_text_field( $_GET['taxonomy'] ) : '';
		$only_parent = isset( $_GET['only_parent'] ) ? sanitize_text_field( $_GET['only_parent'] ) : '';
		$keyword     = isset( $_GET['keyword'] ) ? sanitize_text_field( $_GET['keyword'] ) : '';
		$page        = isset( $_GET['page'] ) ? absint( $_GET['page'] ) : 1;

		$per_page = 20;
		$offset   = ( $page - 1 ) * $per_page;

		$args = array(
			'taxonomy'   => $taxonomy,
			'hide_empty' => false,
			'search'     => $keyword,
			'number'     => $per_page,
			'offset'     => $offset,
			'fields'     => 'id=>name',
		);

		if ( 'true' === $only_parent ) {
			$includes = array();

			$all_terms = get_terms(
				array(
					'taxonomy'   => $taxonomy,
					'hide_empty' => false,
					'fields'     => 'ids',
				)
			);

			if ( $all_terms && ! is_wp_error( $all_terms ) ) {
				foreach ( $all_terms as $term_id ) {
					if ( get_term_children( $term_id, $taxonomy ) ) {
						$includes[] = $term_id;
					}
				}
			}

			$args['include'] = $includes;
		}

		$terms = get_terms( $args );

		$response = array();

		if ( $terms && ! is_wp_error( $terms ) ) {
			foreach ( $terms as $term_id => $term_name ) {
				$response[] = array(
					'label' => $term_name,
					'value' => absint( $term_id ),
				);
			}
		}

		wp_send_json_success( $response );
	}

	/**
	 * Gets the post authors via ajax.
	 *
	 * @return void
	 */
	public function get_authors_for_dropdown() {
		$keyword = isset( $_GET['keyword'] ) ? sanitize_text_field( $_GET['keyword'] ) : '';
		$page    = isset( $_GET['page'] ) ? absint( $_GET['page'] ) : 1;

		$per_page = 20;
		$offset   = ( $page - 1 ) * $per_page;

		$args = array(
			'search' => $keyword,
			'number' => $per_page,
			'offset' => $offset,
			'fields' => array( 'ID', 'display_name' ),
		);

		$users    = get_users( $args );
		$response = array();

		if ( $users ) {
			foreach ( $users as $user ) {
				$response[] = array(
					'label' => $user->display_name,
					'value' => absint( $user->ID ),
				);
			}
		}

		wp_send_json_success( $response );
	}

	/**
	 * Gets the pages via ajax.
	 *
	 * @return void
	 */
	public function get_pages_for_dropdown() {
		$keyword = isset( $_GET['keyword'] ) ? sanitize_text_field( $_GET['keyword'] ) : '';
		$page    = isset( $_GET['page'] ) ? absint( $_GET['page'] ) : 1;

		$per_page = 20;
		$offset   = ( $page - 1 ) * $per_page;

		$args = array(
			'post_type'      => 'page',
			's'              => $keyword,
			'posts_per_page' => $per_page,
			'offset'         => $offset,
		);

		$pages    = get_posts( $args );
		$response = array();

		if ( $pages ) {
			foreach ( $pages as $page ) {
				$response[] = array(
					'label' => $page->post_title,
					'value' => absint( $page->ID ),
				);
			}
		}

		wp_send_json_success( $response );
	}

	/**
	 * Gets the meta values via ajax.
	 *
	 * @return void
	 */
	public function get_meta_values_for_modal() {
		$meta_key = isset( $_GET['meta_key'] ) ? sanitize_text_field( $_GET['meta_key'] ) : '';

		$values   = WCAPF_Helper::get_available_meta_values( $meta_key );
		$response = array();

		if ( $values ) {
			foreach ( $values as $value ) {
				$response[] = array(
					'value' => $value,
					'label' => $value,
				);
			}
		}

		wp_send_json_success( $response );
	}

	/**
	 * Gets the post authors via ajax.
	 *
	 * @return void
	 */
	public function get_post_authors_for_modal() {
		$roles = isset( $_GET['roles'] ) ? $_GET['roles'] : array();

		$args = array(
			'role__in' => $roles,
			'fields'   => array( 'ID', 'display_name' ),
		);

		$users    = get_users( $args );
		$response = array();

		if ( $users ) {
			foreach ( $users as $user ) {
				$response[] = array(
					'label' => $user->display_name,
					'value' => $user->ID,
				);
			}
		}

		wp_send_json_success( $response );
	}

	/**
	 * Duplicates the form via ajax.
	 *
	 * @return void
	 */
	public function duplicate_form() {
		$post_id = isset( $_POST['post_id'] ) ? absint( $_POST['post_id'] ) : '';

		if ( $post_id && 'wcapf-form' === get_post_type( $post_id ) ) {
			$new_post_id = WCAPF_API_Utils::duplicate_form( $post_id );

			if ( is_wp_error( $new_post_id ) ) {
				wp_send_json_error( $new_post_id->get_error_message() );
			} else {
				wp_send_json_success( array(
					'message'  => __( 'Form duplicated successfully', 'wc-ajax-product-filter' ),
					'new_post' => WCAPF_API_Utils::get_form_data( $new_post_id ),
				) );
			}
		} else {
			wp_send_json_error( __( 'Invalid form id', 'wc-ajax-product-filter' ) );
		}
	}

	/**
	 * Gets the available filters for the form via ajax.
	 *
	 * @return void
	 */
	public function get_available_filters() {
		$filter_ids = WCAPF_API_Utils::get_filter_ids( 'publish' );
		$columns    = WCAPF_API_Utils::get_filter_overridden_columns();
		$filters    = array();

		foreach ( $filter_ids as $filter_id ) {
			$filter_data = WCAPF_API_Utils::get_field_data( $filter_id );
			$filter_type = isset( $filter_data['type'] ) ? $filter_data['type'] : '';

			$data = array(
				'id'    => $filter_id,
				'title' => get_the_title( $filter_id ),
				'type'  => $filter_type,
			);

			foreach ( $columns as $column => $default_value ) {
				if ( isset( $filter_data[ $column ] ) ) {
					$data[ $column ] = $filter_data[ $column ];
				} else {
					$data[ $column ] = $default_value;
				}
			}

			$filters[] = $data;
		}

		wp_send_json_success( $filters );
	}

	/**
	 * Deletes the form via ajax.
	 *
	 * @return void
	 */
	public function delete_form() {
		$post_id = isset( $_POST['post_id'] ) ? absint( $_POST['post_id'] ) : '';

		if ( $post_id && 'wcapf-form' === get_post_type( $post_id ) ) {
			$filters = get_posts(
				array(
					'post_type'   => 'wcapf-filter',
					'post_parent' => $post_id,
					'fields'      => 'ids',
				)
			);

			$delete = wp_delete_post( $post_id, true );

			if ( $delete ) {
				foreach ( $filters as $filter_id ) {
					wp_delete_post( $filter_id, true );
				}

				wp_send_json_success( __( 'Form deleted successfully', 'wc-ajax-product-filter' ) );
			} else {
				wp_send_json_error(
					__( 'There was a problem deleting the form, please try again.', 'wc-ajax-product-filter' )
				);
			}
		} else {
			wp_send_json_error( __( 'Invalid form id', 'wc-ajax-product-filter' ) );
		}
	}

	/**
	 * Deletes the filter via ajax.
	 *
	 * @return void
	 */
	public function delete_filter() {
		$post_id = isset( $_GET['post_id'] ) ? absint( $_GET['post_id'] ) : '';

		if ( $post_id && 'wcapf-filter' === get_post_type( $post_id ) ) {
			$delete = wp_delete_post( $post_id, true );

			if ( $delete ) {
				wp_send_json_success( __( 'Filter deleted successfully', 'wc-ajax-product-filter' ) );
			} else {
				wp_send_json_error(
					__( 'There was a problem deleting the filter, please try again.', 'wc-ajax-product-filter' )
				);
			}
		} else {
			wp_send_json_error( __( 'Invalid filter id', 'wc-ajax-product-filter' ) );
		}
	}

	/**
	 * Saves the plugin settings via ajax.
	 *
	 * @return void
	 */
	public function save_settings() {
		$_settings = isset( $_POST['settings'] ) ? $_POST['settings'] : array();

		$settings = stripslashes( $_settings );
		$settings = json_decode( $settings, true );

		$settings = $this->sanitize_settings_data( $settings );

		update_option( WCAPF_Helper::settings_option_key(), $settings );

		wp_send_json_success( __( 'Settings saved successfully', 'wc-ajax-product-filter' ) );
	}

	private function sanitize_settings_data( $settings ) {
		if ( isset( $settings['loading_image_src'] ) ) {
			unset( $settings['loading_image_src'] );
		}

		if ( $settings['author_roles'] ) {
			$without_labels = array();

			foreach ( $settings['author_roles'] as $role ) {
				$without_labels[] = $role['value'];
			}

			$settings['author_roles'] = $without_labels;
		}

		return $settings;
	}

	private function get_filter_data_from_post_request() {
		$filter_title = isset( $_POST['filter_title'] ) ? sanitize_text_field( $_POST['filter_title'] ) : '';
		$filter_id    = isset( $_POST['filter_id'] ) ? absint( $_POST['filter_id'] ) : '';
		$_filter_data = isset( $_POST['filter_data'] ) ? $_POST['filter_data'] : array();

		$filter_data = stripslashes( $_filter_data );
		$filter_data = json_decode( $filter_data, true );

		return array( $filter_data, $filter_id, $filter_title );
	}

	/**
	 * Parse the filter data comes from the new UI.
	 *
	 * @param array $filter_data The filter data.
	 *
	 * @return array
	 */
	private function parse_new_ui_filter_data( $filter_data ) {
		$parent_term        = $filter_data['parent_term'];
		$limit_values_by_id = $filter_data['limit_values_by_id'];
		$exclude_values_id  = $filter_data['exclude_values_id'];
		$appearance_options = $filter_data['custom_appearance_options'];
		$include_user_roles = $filter_data['include_user_roles'];

		if ( $parent_term ) {
			$filter_data['parent_term'] = $parent_term['value'];
		}

		if ( $limit_values_by_id ) {
			$values = wp_list_pluck( $limit_values_by_id, 'value' );

			$filter_data['limit_values_by_id'] = implode( ',', $values );
		}

		if ( $exclude_values_id ) {
			$values = wp_list_pluck( $exclude_values_id, 'value' );

			$filter_data['exclude_values_id'] = implode( ',', $values );
		}

		if ( $appearance_options ) {
			$parsed = array();

			foreach ( $appearance_options as $option ) {
				$term_id = $option['id'];

				$parsed[ $term_id ] = $option;
			}

			$filter_data['custom_appearance_options'] = $parsed;
		}

		if ( $include_user_roles ) {
			$filter_data['include_user_roles'] = wp_list_pluck( $include_user_roles, 'value' );
		}

		return $filter_data;
	}

	/**
	 * Gets the data for the edit filter view.
	 *
	 * @param int $post_id The post id.
	 *
	 * @return array
	 */
	private function get_filter( $post_id ) {
		$filter_data      = WCAPF_API_Utils::get_field_data( $post_id );
		$filter_data      = $this->prepare_filter_data_for_new_ui( $filter_data );
		$visibility_rules = WCAPF_API_Utils::prepare_filter_visibility_rules( $post_id );

		return array(
			'post_title'       => get_the_title( $post_id ),
			'filter_data'      => $filter_data,
			'visibility_rules' => $visibility_rules,
		);
	}

	/**
	 * Prepare the filter data for new UI.
	 *
	 * TODO: Might be deprecated in the future.
	 *
	 * @param array $filter_data The filter data array.
	 *
	 * @return array
	 */
	private function prepare_filter_data_for_new_ui( $filter_data ) {
		// Fill the term_ids with value and label.
		$taxonomy_types = array( 'category', 'tag', 'attribute', 'custom-taxonomy' );
		$filter_type    = isset( $filter_data['type'] ) ? $filter_data['type'] : '';

		if ( in_array( $filter_type, $taxonomy_types ) ) {
			$parent_term        = $filter_data['parent_term'];
			$limit_values_by_id = $filter_data['limit_values_by_id'];
			$exclude_values_id  = $filter_data['exclude_values_id'];

			if ( $parent_term ) {
				$term = get_term( $parent_term );

				$filter_data['parent_term'] = array(
					'value' => $term->term_id,
					'label' => $term->name,
				);
			}

			$array = array(
				'limit_values_by_id' => $limit_values_by_id,
				'exclude_values_id'  => $exclude_values_id,
			);

			foreach ( $array as $key => $value ) {
				if ( $value ) {
					$values = explode( ',', $value );
					$parsed = array();

					foreach ( $values as $id ) {
						$term = get_term( $id );

						if ( $term && ! is_wp_error( $term ) ) {
							$parsed[] = array(
								'value' => $term->term_id,
								'label' => $term->name,
							);
						}
					}

					$filter_data[ $key ] = $parsed;
				}
			}
		}

		// Set the default values for the order settings.
		$order_terms_dir    = isset( $filter_data['order_terms_dir'] ) ? $filter_data['order_terms_dir'] : '';
		$options_order_dir  = isset( $filter_data['options_order_dir'] ) ? $filter_data['options_order_dir'] : '';
		$options_order_type = isset( $filter_data['options_order_type'] ) ? $filter_data['options_order_type'] : '';

		if ( ! $order_terms_dir ) {
			$filter_data['order_terms_dir'] = 'asc';
		}

		if ( ! $options_order_dir ) {
			$filter_data['options_order_dir'] = 'asc';
		}

		if ( ! $options_order_type ) {
			$filter_data['options_order_type'] = 'alphabetical';
		}

		// Parse custom appearance options.
		$custom_appearance_options = isset( $filter_data['custom_appearance_options'] )
			? $filter_data['custom_appearance_options']
			: array();

		if ( $custom_appearance_options ) {
			$parsed = array();

			foreach ( $custom_appearance_options as $id => $option ) {
				$option['id'] = $id;

				$parsed[] = $option;
			}

			$filter_data['custom_appearance_options'] = $parsed;
		}

		// Parse user roles.
		$include_user_roles = isset( $filter_data['include_user_roles'] )
			? $filter_data['include_user_roles']
			: array();

		if ( $include_user_roles ) {
			$user_roles = WCAPF_Product_Filter_Utils::get_user_roles();
			$parsed     = array();

			foreach ( $include_user_roles as $role ) {
				$parsed[] = array(
					'value' => $role,
					'label' => $user_roles[ $role ],
				);
			}

			$filter_data['include_user_roles'] = $parsed;
		}

		return $filter_data;
	}

}

WCAPF_API::instance();
