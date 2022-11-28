<?php
/**
 * Plugin Name: Ayudante AI
 * Plugin URI: https://github.com/oscarssanchez/ayudante-b
 * Description: Enhance your WordPress site with artificial intelligence.
 * Author: Oscar Sanchez
 * Author URI: http://oscarssanchez.com/
 * Version: 1.0.0
 * Stable tag: 1.0.0
 * Requires at least: 6.1
 * Tested up to: 6.1
 * License: GPL v3 or later - http://www.gnu.org/licenses/gpl-3.0.html
 * Text Domain: ayudanteai-plugin
 * Domain Path: /lang
 *
 * @package AyudanteAI
 */

// Useful global constants.
define( 'AYUDANTEAI_PLUGIN_VERSION', '1,0.0' );
define( 'AYUDANTEAI_PLUGIN_URL', plugin_dir_url( __FILE__ ) );
define( 'AYUDANTEAI_PLUGIN_PATH', plugin_dir_path( __FILE__ ) );
define( 'AYUDANTEAI_PLUGIN_INC', AYUDANTEAI_PLUGIN_PATH . 'includes/' );
define( 'AYUDANTEAI_REST_NAMESPACE', 'ayudanteai/v1' );

// Require Composer autoloader if it exists.
if ( file_exists( AYUDANTEAI_PLUGIN_PATH . 'vendor/autoload.php' ) ) {
	require_once AYUDANTEAI_PLUGIN_PATH . 'vendor/autoload.php';
}

// Include files.
require_once AYUDANTEAI_PLUGIN_INC . '/utility.php';
require_once AYUDANTEAI_PLUGIN_INC . '/core.php';

// Activation/Deactivation.
register_activation_hook( __FILE__, '\AyudanteAI\Core\activate' );

// Bootstrap.
AyudanteAI\Core\setup();
