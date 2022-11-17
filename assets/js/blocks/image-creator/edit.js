import {Button, Placeholder, Modal, TextControl, PanelBody, RadioControl} from '@wordpress/components';
import { InspectorControls } from '@wordpress/block-editor';
import { useState, useEffect } from '@wordpress/element';
import { createBlock } from '@wordpress/blocks';
import { dispatch } from '@wordpress/data';
import { __experimentalNumberControl as NumberControl } from '@wordpress/components';

const edit = ({ attributes, setAttributes, clientId }) => {
	const { imageSize = '1024x1024', imageNumber = 4 } = attributes;

	const [isCreateImageModalOpen, setIsCreateImageModalOpen] = useState(false);
	const [imageData, setImageData] = useState(null);
	const [images, setImages] = useState(null);

	const openImageCreationModal = () => setIsCreateImageModalOpen(true);
	const closeImageCreationModal = () => setIsCreateImageModalOpen(false);

	const getImageSrc = (imageSrc) => setImages(imageSrc);

	useEffect(() => {
		const imagesFetched = document.getElementsByClassName('imageResults');
		if (imagesFetched) {
			for (let i = 0; i < imagesFetched.length; i++) {
				imagesFetched[i].addEventListener(
					'click',
					() => {
						getImageSrc(imagesFetched[i].src);
					},
					false,
				);
			}
		}
	});

	const convertToImageBlock = () => {
		const input = document.getElementById('create-image-input');
		const insertedBlock = createBlock('core/image', {
			url: images,
			alt: input.value,
		});

		dispatch('core/editor').replaceBlock(clientId, insertedBlock);
	};

	const createImages = () => {
		const input = document.getElementById('create-image-input');
		const body = {
			prompt: input.value,
			n: imageNumber,
			size: imageSize,
		};

		fetch('https://api.openai.com/v1/images/generations', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': 'Bearer '
			},
			body: JSON.stringify(body),
		}).then((response) => {
			response.json().then((data) => {
				setImageData(data);
			});
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
				<Modal title="Let's Create an Image" onRequestClose={closeImageCreationModal}>
					<input
						id="create-image-input"
						type="text"
						placeholder="Type in some Ideas..."
					/>
					<Button variant="primary" onClick={createImages}>
						Create Images
					</Button>
					{imageData && (
						<div>
							{imageData.data.map((image) => {
								return <img className="imageResults" src={image.url} />;
							})}
							<Button variant="primary" onClick={convertToImageBlock}>Use selected Image</Button>
						</div>
					)}
				</Modal>
			)}
		</>
	);
};

export default edit;
