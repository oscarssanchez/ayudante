import {
	__experimentalNumberControl as NumberControl,
	Button,
	Placeholder,
	Modal,
	PanelBody,
	RadioControl,
	Spinner,
} from '@wordpress/components';
import { InspectorControls } from '@wordpress/block-editor';
import { useState, useEffect } from '@wordpress/element';
import { createBlock } from '@wordpress/blocks';
import { dispatch } from '@wordpress/data';
import { __ } from '@wordpress/i18n';
import apiFetch from '@wordpress/api-fetch';

/**
 * Edit component.
 *
 * @param attributes
 * @param setAttributes
 * @param clientId
 * @returns {JSX.Element}
 */
const edit = ({ attributes, setAttributes, clientId }) => {
	const currentUser = wp.data.select('core').getCurrentUser();
	const { imageSizes = '1024x1024', imageNumber = 4 } = attributes;

	const [isCreateImageModalOpen, setIsCreateImageModalOpen] = useState(false);
	const [imageData, setImageData] = useState(null);
	const [images, setImages] = useState(null);
	const [isImageDataLoading, setIsImageDataLoading] = useState(false);
	const [isImageUploading, setIsImageUploading] = useState(false);
	const [imageInput, setImageInput] = useState(false);
	const [imageSelected, setImageSelected] = useState(false);

	const openImageCreationModal = () => setIsCreateImageModalOpen(true);
	const closeImageCreationModal = () => setIsCreateImageModalOpen(false);
	const getImageSrc = (imageSrc) => setImages(imageSrc);

	useEffect(() => {
		const imagesFetched = document.getElementsByClassName('ayudante-ai-image-result');
		const imagePrompt = document.getElementById('create-image-input');

		if (imagesFetched.length > 0) {
			for (let i = 0; i < imagesFetched.length; i++) {
				imagesFetched[i].classList.remove('ayudante-ai-image-result-selected');
				imagesFetched[i].addEventListener(
					'click',
					() => {
						setImageSelected(true);
						imagesFetched[i].classList.add('ayudante-ai-image-result-selected');
						getImageSrc(imagesFetched[i].src);
					},
					false,
				);
			}
		}

		if (imagesFetched.length > 0 && imagePrompt.value.length > 0 && !isImageDataLoading) {
			setImageInput(imagePrompt.value);
		}
	});

	/**
	 * Converts a selected image into an Image block.
	 */
	const convertToImageBlock = () => {
		const input = document.getElementById('create-image-input');
		setIsImageUploading(true);
		apiFetch({
			path: '/ayudanteai/v1/create-attachment/images',
			method: 'POST',
			data: {
				post_title: input.value,
				attachment_url: images,
			},
		}).then((response) => {
			const insertedBlock = createBlock('core/image', {
				url: response.url,
				alt: input.value,
				id: response.id,
			});
			setIsImageUploading(false);
			dispatch('core/editor').replaceBlock(clientId, insertedBlock);
		});
	};

	/**
	 * Issues a request to the Ayudante AI API to generate an image.
	 */
	const createImages = () => {
		const input = document.getElementById('create-image-input');
		setImageData(null);
		setIsImageDataLoading(true);
		apiFetch({
			path: '/ayudanteai/v1/generate/images',
			method: 'POST',
			data: {
				prompt: input.value,
				image_number: imageNumber,
				image_size: imageSizes,
			},
		}).then((response) => {
			setImageData(response);
			setIsImageDataLoading(false);
		});
	};

	return (
		<>
			<InspectorControls>
				<PanelBody title={__('Settings', 'ayudanteai-plugin')} initialOpen>
					<RadioControl
						label={__('Images Size', 'ayudanteai-plugin')}
						selected={imageSizes}
						options={[
							{ label: '256x256 px', value: '256x256' },
							{ label: '512x512 px', value: '512x512' },
							{ label: '1024x1024 px', value: '1024x1024' },
						]}
						onChange={(size) => {
							setAttributes({ imageSizes: size });
						}}
					/>
					<NumberControl
						max="4"
						min="1"
						label={__('Images Requested per prompt', 'ayudanteai-plugin')}
						value={imageNumber}
						onChange={(number) => {
							setAttributes({ imageNumber: number });
						}}
					/>
				</PanelBody>
			</InspectorControls>
			<Placeholder
				label="Image Creator"
				instructions={__('Choose an Action to get started.', 'ayudanteai-plugin')}
			>
				<Button variant="secondary" onClick={openImageCreationModal}>
					Create Image
				</Button>
			</Placeholder>
			{isCreateImageModalOpen && (
				<Modal
					className="ayudante-modal"
					title={`Hey ${currentUser.name}, let's create an image together!`}
					onRequestClose={closeImageCreationModal}
				>
					<p>{__('Generate an Image using a description', 'ayudanteai-plugin')}</p>
					<input
						id="create-image-input"
						type="text"
						placeholder="Type in some Ideas..."
					/>
					<Button variant="primary" onClick={createImages}>
						{__('Create Images', 'ayudanteai-plugin')}
					</Button>
					{isImageDataLoading && (
						<div className="ayudante-ai-image-results-container ayudante-ai-image-loading">
							<p className="text-images-loading ayudante-ai-help">
								{__('Creating your images...', 'ayudanteai-plugin')}
							</p>
							<Spinner />
							<p className="ayudante-ai-help ayudante-tip">
								{__(
									'Tip: Large descriptive prompts tend to generate better images.',
									'ayudanteai-plugin',
								)}
							</p>
						</div>
					)}
					{isImageUploading && (
						<div className="ayudante-ai-image-results-container ayudante-ai-image-loading">
							<p className="text-images-loading ayudante-ai-help">
								{__('Uploading your image...', 'ayudanteai-plugin')}
							</p>
							<Spinner />
						</div>
					)}
					{imageData && (
						<div>
							<p className="text-images-loading center-ai">
								{__('Showing images of: ', 'ayudanteai-plugin')}
								{imageInput}
							</p>
							<div className="ayudante-ai-image-results-container">
								{imageData.data.map((image) => {
									return <img
											className="ayudante-ai-image-result"
											src={image.url}
											width="256"
											height="256"
									/>;
								})}
								<p className="ayudante-ai-help ayudante-tip">
									{__(
										'Not getting a good result? Get some inspiration from ',
										'ayudanteai-plugin',
									)}
									<a href="https://www.reddit.com/r/dalle2">
										{__('Users', 'ayudanteai-plugin')}
									</a>
								</p>
								<Button
									variant="primary"
									disabled={!imageSelected}
									onClick={convertToImageBlock}>
									{__('Use selected Image', 'ayudanteai-plugin')}
								</Button>
							</div>
						</div>
					)}
				</Modal>
			)}
		</>
	);
};

export default edit;
