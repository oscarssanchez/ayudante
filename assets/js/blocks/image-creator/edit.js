import { Button, Placeholder, Modal } from '@wordpress/components';
import { useState } from '@wordpress/element';

const edit = () => {
	const [isCreateImageModalOpen, setIsCreateImageModalOpen] = useState(false);

	const openImageCreationModal = () => setIsCreateImageModalOpen(true);
	const closeImageCreationModal = () => setIsCreateImageModalOpen(false);

	return (
		<>
			<Placeholder label="Image Creator" instructions="Choose an Action to get started.">
				<Button variant="secondary" onClick={openImageCreationModal}>
					Create Image
				</Button>
			</Placeholder>
			{isCreateImageModalOpen && (
				<Modal title="Hello Modal" onRequestClose={closeImageCreationModal}>
					<Button variant="secondary" onClick={closeImageCreationModal}>
						Hello Modal
					</Button>
				</Modal>
			)}
		</>
	);
};

export default edit;
