/**
 * Internal dependencies
 */
import edit from './edit';
import { registerBlockType } from '@wordpress/blocks';
import { name, settings } from './block.json';

/**
 * Register block
 */
registerBlockType(name, {
	...settings,
	edit,
});
