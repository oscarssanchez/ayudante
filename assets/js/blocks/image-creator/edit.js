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
import apiFetch from '@wordpress/api-fetch';

const edit = ({ attributes, setAttributes, clientId }) => {
	const currentUser = wp.data.select('core').getCurrentUser();
	const { imageSize = '1024x1024', imageNumber = 4 } = attributes;

	const [isCreateImageModalOpen, setIsCreateImageModalOpen] = useState(false);
	const [imageData, setImageData] = useState(null);
	const [images, setImages] = useState(null);
	const [isImageDataLoading, setIsImageDataLoading] = useState(false);
	const [imageInput, setImageInput] = useState(false);

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

	const convertToImageBlock = () => {
		const input = document.getElementById('create-image-input');

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
			dispatch('core/editor').replaceBlock(clientId, insertedBlock);
		});
	};

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
				image_size: imageSize,
			},
		}).then((response) => {
			setImageData(response);
			setIsImageDataLoading(false);
		});
	};

	return (
		<>
			<InspectorControls>
				<PanelBody title="Request Settings" initialOpen>
					<RadioControl
						label="Images Size"
						selected={imageSize}
						options={[
							{ label: '256x256 px', value: '256x256' },
							{ label: '512x512 px', value: '512x512' },
							{ label: '1024x1024 px', value: '1024x1024' },
						]}
						onChange={(size) => {
							setAttributes({ imageSize: size });
						}}
					/>
					<NumberControl
						max="4"
						min="1"
						label="Images Requested per prompt"
						value={imageNumber}
						onChange={(number) => {
							setAttributes({ imageNumber: number });
						}}
					/>
				</PanelBody>
			</InspectorControls>
			<Placeholder label="Image Creator" instructions="Choose an Action to get started.">
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
					<p>Generate an Image using a description</p>
					<input
						id="create-image-input"
						type="text"
						placeholder="Type in some Ideas..."
					/>
					<Button variant="primary" onClick={createImages}>
						Create Images
					</Button>
					{isImageDataLoading && (
						<div className="ayudante-ai-image-results-container ayudante-ai-image-loading">
							<p className="text-images-loading ayudante-ai-help">Creating your images...</p>
							<Spinner />
							<p className="ayudante-ai-help ayudante-tip">
								Tip: You can do some things in order to get better images like this
								and this
							</p>
						</div>
					)}
					{imageData && (
						<div>
							<p className="text-images-loading center-ai">Showing images of: {imageInput}</p>
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
									Not getting a good result? Get some inspiration from{' '}
									<a href="https://www.reddit.com/r/dalle2">Reddit</a>
								</p>
								<Button variant="primary" onClick={convertToImageBlock}>Use selected Image</Button>
							</div>
						</div>
					)}
				</Modal>
			)}
		</>
	);
};

export default edit;
