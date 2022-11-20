<?php
/**
 * API class.
 *
 * @package AyudanteAI
 */

namespace AyudanteAI;

/**
 * Ayudante AI API class.
 */
class Api {
	/**
	 * Capability required to use the API.
	 */
	const CAPABILITY = 'manage_options';

	/**
	 * OpenAI API URL
	 */
	const OPENAI_API_URL = 'https://api.openai.com/v1';

	/**
	 * Init method.
	 */
	public function init() {
		add_action( 'rest_api_init', [ $this, 'register_routes' ] );
		add_action( 'admin_notices', [ $this, 'admin_notices' ] );
	}

	/**
	 * Register REST API routes.
	 */
	public function register_routes() {
		// Generate images endpoint.
		register_rest_route(
			AYUDANTEAI_REST_NAMESPACE,
			'/generate/images',
			[
				'methods'             => 'POST',
				'callback'            => [ $this, 'generate_images' ],
				'show_in_index'       => false,
				'permission_callback' => function() {
					return current_user_can( self::CAPABILITY );
				},
				'args'                => [
					'prompt'       => [
						'description' => __( 'Text prompt to generate images.', 'ayudanteai-plugin' ),
						'type'        => 'string',
						'format'      => 'string',
						'required'    => true,
						'sanitize_callback' => 'sanitize_text_field',
					],
					'image_size'   => [
						'description' => __( 'Requested image sizes.', 'ayudanteai-plugin' ),
						'type'        => 'string',
						'required'    => true,
						'sanitize_callback' => 'sanitize_text_field'
					],
					'image_number' => [
						'description' => __( 'Requested number of images.', 'ayudanteai-plugin' ),
						'type'        => 'integer',
						'required'    => true,
						'sanitize_callback' => 'absint',
					],
				],
			]
		);

		register_rest_route(
			AYUDANTEAI_REST_NAMESPACE,
			'/create-attachment/images',
			[
				'methods'             => 'POST',
				'callback'            => [ $this, 'create_image_attachment' ],
				'permission_callback' => function() {
					return current_user_can( self::CAPABILITY );
				},
				'show_in_index'       => false,
				'args'                => [
					'post_title'     => [
						'description' => __( 'Post title for the attachment.', 'ayudanteai-plugin' ),
						'type'        => 'string',
						'required'    => true,
						'sanitize_callback' => 'sanitize_text_field',
					],
					'attachment_url' => [
						'description' => __( 'Attachment URL.', 'ayudanteai-plugin' ),
						'type'        => 'string',
						'required'    => true,
						'sanitize_callback' => 'esc_url_raw',
					],
				],
			]
		);
	}

	/**
	 * Create image attachment from a URL
	 *
	 * @param \WP_REST_Request $request Request object.
	 */
	public function create_image_attachment( \WP_REST_Request $request ) {
		require_once ABSPATH . 'wp-admin/includes/media.php';
		require_once ABSPATH . 'wp-admin/includes/file.php';
		require_once ABSPATH . 'wp-admin/includes/image.php';

		$post_title     = $request->get_param( 'post_title' );
		$attachment_url = $request->get_param( 'attachment_url' );

		try {
			$image_id = media_sideload_image( $attachment_url, null, $post_title, 'id' );

			$response = [
				'id'  => $image_id,
				'url' => wp_get_attachment_url( $image_id ),
			];

			return rest_ensure_response( $response );
		} catch ( \Exception $e ) {
			return new \WP_Error( 'ayudanteai_error', $e->getMessage(), [ 'status' => 500 ] );
		}
	}

	/**
	 * Callback for the generate images endpoint.
	 *
	 * @param \WP_REST_Request $request Request object.
	 * @return \WP_Error|\WP_HTTP_Response|\WP_REST_Response
	 */
	public function generate_images( \WP_REST_Request $request ) {
		$prompt       = $request->get_param( 'prompt' );
		$image_size   = $request->get_param( 'image_size' );
		$image_number = $request->get_param( 'image_number' );

		$body = [
			'prompt' => $prompt,
			'size'   => $image_size,
			'n'      => $image_number,
		];

		try {
			$response = $this->remote_request(
				'images/generations',
				'POST',
				wp_json_encode( $body )
			);

			$response_code = wp_remote_retrieve_response_code( $response );
			$response_body = json_decode( wp_remote_retrieve_body( $response ) );

			if ( $response_code !== 200 ) {
				$error = sprintf( __( 'Error %d: %s', 'ayudanteai-plugin' ), $response_code, $response_body->error->message, );
				throw new \Exception( $error );
			}

			return rest_ensure_response( $response_body );
		} catch ( \Exception $error ) {
			return rest_ensure_response( $error->getMessage() );
		}
	}

	/**
	 * Remote request method.
	 *
	 * @param string      $endpoint Endpoint to request.
	 * @param string      $method HTTP method.
	 * @param string|null $body The request body.
	 * @return array|\WP_Error
	 */
	public function remote_request( $endpoint, $method = 'GET', $body = null ) {
		$args = [
			'headers' => [
				'Authorization' => 'Bearer ' . get_option( 'openai_token' ),
				'Content-Type'  => 'application/json',
			],
			'timeout' => 30,
			'method'  => $method,
			'body'    => $body,
		];

		$url = self::OPENAI_API_URL . '/' . $endpoint;

		return wp_remote_request( $url, $args );
	}

	/**
	 * Display various admin notices.
	 */
	public function admin_notices() {
		$token = get_option( 'openai_token' );
		if ( ! $token ) {
			?>
			<div class="notice notice-error">
				<p><?php esc_html_e( 'You need to set an OpenAI API token to use this plugin. Please go to the Ayudante AI settings page.', 'ayudanteai-plugin' ); ?></p>
			</div>
			<?php
		}
	}
}
