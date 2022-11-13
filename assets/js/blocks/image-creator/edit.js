import { Button, Placeholder, Modal } from '@wordpress/components';

import { useState } from '@wordpress/element';

const edit = () => {
	const [isCreateImageModalOpen, setIsCreateImageModalOpen] = useState(false);
	const [imageData, setImageData] = useState(null);

	const openImageCreationModal = () => setIsCreateImageModalOpen(true);
	const closeImageCreationModal = () => setIsCreateImageModalOpen(false);

	const createImages = () => {
		const input = document.getElementById('create-image-input');
		const body = {
			prompt: input.value,
			n: 1,
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
					{imageData &&
						imageData.data.map((image) => {
							return <img src={image.url} />;
						})}
				</Modal>
			)}
		</>
	);
};

export default edit;
