import { useRef, useEffect } from 'react';

const PhotoEditor = () => {
	const iframeRef = useRef(null);

	useEffect(() => {
		const handleMessage = event => {
			if (event.data.type === 'photokitsdk') {
				if (event.data.name === 'editorLoaded') {
					console.log('PhotoKit loaded');
				}
				if (event.data.name === 'saveimage') {
					const imageBase64 = event.data.imagedata;
					const imageName = event.data.imagename;
					console.log('Saved image:', imageName, imageBase64);
				}
			}
		};

		window.addEventListener('message', handleMessage);

		return () => window.removeEventListener('message', handleMessage);
	}, []);

	const openImage = base64 => {
		iframeRef.current?.contentWindow.postMessage(
			{
				type: 'photokitsdk',
				name: 'openimage',
				data: base64,
				opentype: 0,
			},
			'*'
		);
	};

	const saveImage = () => {
		iframeRef.current?.contentWindow.postMessage({ type: 'photokitsdk', name: 'saveimagetype', savetype: 'postMessage' }, '*');
		iframeRef.current?.contentWindow.postMessage({ type: 'photokitsdk', name: 'saveimage' }, '*');
	};

	return (
		<div className='flex flex-col items-center justify-center w-full h-screen mt-4'>
			<iframe
				id='photokit'
				ref={iframeRef}
				src='https://photokit.com/editor/?lang=ru'
				style={{ width: '100%', height: '80vh', border: 'none' }}
				title='PhotoKit Editor'
			></iframe>

			<div className='flex gap-4 mt-4'>
				<button
					className='px-4 py-2 text-white bg-blue-500 rounded'
					onClick={() => {
						const sampleBase64 = 'data:image/jpeg;base64,...';
						openImage(sampleBase64);
					}}
				>
					Download the image
				</button>
				<button className='px-4 py-2 text-white bg-green-500 rounded' onClick={saveImage}>
					Save the image
				</button>
			</div>
		</div>
	);
};

export default PhotoEditor;
