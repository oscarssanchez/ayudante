/**
 * Internal dependencies
 */
import { registerBlockType } from '@wordpress/blocks';
import ImageCreatorPostsEdit from './Edit';
import name from './block.json';

/**
 * Register block
 */
registerBlockType(name, {
	edit: ImageCreatorPostsEdit,
});
