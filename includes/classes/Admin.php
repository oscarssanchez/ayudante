<?php
/**
 * The Admin class.
 *
 * @package AyudanteAI
 */

namespace AyudanteAI;

/**
 * The Admin class.
 */
class Admin {
	/**
	 * Init method.
	 */
	public function init() {
		$this->register_hooks();
	}

	/**
	 * Register hooks.
	 */
	public function register_hooks() {
		add_action( 'admin_init', [ $this, 'register_settings' ] );
		add_action( 'admin_menu', [ $this, 'register_menu' ] );
	}

	/**
	 * Register menu.
	 */
	public function register_menu() {
		add_menu_page(
			'Ayudante',
			'Ayudante',
			'manage_options',
			'ayudante',
			[ $this, 'render_menu' ],
			'dashicons-businessman',
		);
	}

	/**
	 * Register settings with settings API.
	 */
	public function register_settings() {
		register_setting( 'ayudanteai-settings', 'openai_token' );

		add_settings_section(
			'ayudanteai-settings',
			__( 'Settings', 'ayudanteai-plugin' ),
			'',
			'ayudanteai-settings',
		);

		add_settings_field(
			'openai_token',
				__( 'OpenAI Token', 'ayudanteai-plugin' ),
			[ $this, 'render_openai_token_field' ],
			'ayudanteai-settings',
			'ayudanteai-settings',
		);
	}

	/**
	 * Render add settings field callback.
	 */
	public function render_openai_token_field() {
		$token = get_option( 'openai_token' );
		printf( '<input type="text" name="openai_token" value="%s" />', ! empty( $token ) ? $token : '' );
	}

	/**
	 * Render menu.
	 */
	public function render_menu() {
		?>
		<div class="wrap">
			<h1><?php esc_html_e( 'Ayudante AI', 'ayudanteai-plugin' ); ?></h1>
			<form method="post" action="options.php">
				<?php settings_fields( 'ayudanteai-settings' ); ?>
				<?php settings_errors(); ?>
				<?php do_settings_sections( 'ayudanteai-settings' ); ?>
				<?php submit_button(); ?>
			</form>
		</div>
		<?php
	}
}
