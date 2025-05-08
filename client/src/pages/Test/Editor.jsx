import React, { useRef } from 'react';
import { ImageEditorComponent } from '@syncfusion/ej2-react-image-editor';
import '@syncfusion/ej2-base/styles/material.css';
import '@syncfusion/ej2-react-image-editor/styles/material.css';

const Editor = () => {
	const editorRef = useRef(null);

	const handleOpen = () => {
		if (editorRef.current) {
			// Замените URL на свой или используйте base64
			editorRef.current.open('https://cdn.syncfusion.com/content/images/React/React_logo.png');
		}
	};

	const handleSave = () => {
		if (editorRef.current) {
			editorRef.current.export();
		}
	};

	return (
		<div className='w-full max-w-4xl mx-auto mt-10'>
			<h2 className='mb-4 text-2xl font-semibold text-center'>Syncfusion Image Editor</h2>
			<div className='flex justify-center gap-4 mb-4'>
				<button onClick={handleOpen} className='px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600'>
					Open Image
				</button>
				<button onClick={handleSave} className='px-4 py-2 text-white bg-green-500 rounded-md hover:bg-green-600'>
					Save Image
				</button>
			</div>
			<ImageEditorComponent ref={editorRef} height='500px' width='100%' />
		</div>
	);
};

export default Editor;
