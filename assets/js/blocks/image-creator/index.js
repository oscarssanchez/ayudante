/**
 * Internal dependencies
 */
import { registerBlockType } from '@wordpress/blocks';
import edit from './edit';
import { name, settings } from './block.json';

/**
 * Register block
 */
registerBlockType(name, {
	...settings,
	edit,
});
