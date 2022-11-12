<?php
/**
 * Plugin Name: Wopen-AI
 * Plugin URI: https://github.com/oscarssanchez/wopen-ai
 * Description: Enhance your WordPress site with artificial intelligence.
 * Author: Oscar Sanchez
 * Author URI: http://oscarssanchez.com/
 * Version: 0.0.1
 * Stable tag: 0.0.1
 * Requires at least: 6.1
 * Tested up to: 6.1
 * License: GPL v3 or later - http://www.gnu.org/licenses/gpl-3.0.html
 * Text Domain: wopenai-plugin
 * Domain Path: /lang
 */
// Useful global constants.
define( 'WOPENAI_PLUGIN_VERSION', '0.1.0' );
define( 'WOPENAI_PLUGIN_URL', plugin_dir_url( __FILE__ ) );
define( 'WOPENAI_PLUGIN_PATH', plugin_dir_path( __FILE__ ) );
define( 'WOPENAI_PLUGIN_INC', WOPENAI_PLUGIN_PATH . 'includes/' );

// Require Composer autoloader if it exists.
if ( file_exists( WOPENAI_PLUGIN_PATH . 'vendor/autoload.php' ) ) {
	require_once WOPENAI_PLUGIN_PATH . 'vendor/autoload.php';
}

// Include files.
require_once WOPENAI_PLUGIN_INC . '/utility.php';
require_once WOPENAI_PLUGIN_INC . '/core.php';

// Activation/Deactivation.
register_activation_hook( __FILE__, '\Wopenai\Core\activate' );
register_deactivation_hook( __FILE__, '\Wopenai\Core\deactivate' );

// Bootstrap.
Wopenai\Core\setup();
