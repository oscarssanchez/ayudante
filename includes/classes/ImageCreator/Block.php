<?php

namespace AyudanteAI\ImageCreator;

class Block {

	/**
	 * Init method.
	 */
	public function init() {
		$this->register_block();
	}

	/**
	 * Register block.
	 */
	public function register_block() {
		register_block_type(
			AYUDANTEAI_PLUGIN_PATH . '/assets/js/blocks/image-creator',
			[
				'render_callback' => [ $this, 'render_block_callback' ],
			]
		);
	}

}
