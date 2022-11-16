import { Button, Placeholder, Modal } from '@wordpress/components';

import { useState, useEffect } from '@wordpress/element';
import { createBlock } from '@wordpress/blocks';
import { dispatch } from '@wordpress/data';

const edit = ({ clientId }) => {
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
			n: 4,
			size: '256x256',
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
								return <img className="imageResults" id="imageResult" src={image.url} />;
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
