<?php

class WCAPF_Endpoints {
  public function register_endpoints() {
    register_rest_route(
      'wcapf/v1',
      '/settings',
      array(
        'methods'  => 'GET',
        'callback' => array( $this, 'get_settings' ),
      )
    );

    register_rest_route(
      'wcapf/v1',
      '/forms',
      array(
        'methods'  => 'GET',
        'callback' => array( $this, 'get_forms' ),
      )
    );
  }

  public function get_settings() {
    // Retrieve and return the initial settings
    $settings = array(
      // Your settings data here
    );
    return $settings;
  }

  public function get_forms() {
    // Retrieve and return the forms
    $forms = array(
      // Your forms data here
    );
    return $forms;
  }
}

$wcapf_endpoints = new WCAPF_Endpoints();
add_action( 'rest_api_init', array( $wcapf_endpoints, 'register_endpoints' ) );
