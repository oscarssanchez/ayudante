/**
 * Internal dependencies
 */
import { registerBlockType } from '@wordpress/blocks';
import edit from './edit';
import name from './block.json';

/**
 * Register block
 */
registerBlockType(name, {
	edit,
});
