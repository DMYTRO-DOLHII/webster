import { useState } from 'react';

const NewProjectModal = ({ onClose, onCreate }) => {
	const [form, setForm] = useState({
		title: '',
		width: 1920,
		height: 1080,
		units: 'px',
	});

	const handleChange = (field, value) => {
		setForm(prev => ({ ...prev, [field]: value }));
	};

	const handleCreate = () => {
		if (!form.title.trim()) return;
		onCreate(form);
		onClose();
	};

	return (
		<div className='fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm'>
			<div className='relative w-[640px] max-w-[95vw] rounded-xl p-6 bg-black/30 text-white shadow-xl border border-white/10 backdrop-blur-2xl pb-20'>
				{/* Header */}
				<div className='flex items-center justify-between mb-4'>
					<h2 className='text-xl font-semibold'>New Project</h2>
					<button className='text-xl text-white hover:text-gray-300' onClick={onClose}>
						✕
					</button>
				</div>

				<hr className='mb-6 border-gray-600' />

				{/* Title */}
				<div className='mb-6'>
					<label className='block mb-1 text-sm text-gray-300'>Project name</label>
					<input
						type='text'
						value={form.title}
						onChange={e => handleChange('title', e.target.value)}
						className='w-full p-2 text-white border rounded-md border-white/20 bg-white/10 focus:outline-none'
						placeholder='Untitled Project'
					/>
				</div>

				{/* Canvas Size */}
				<div className='mb-6'>
					<label className='block mb-2 text-sm text-gray-300'>Canvas Size</label>
					<div className='flex gap-3'>
						<input
							type='number'
							min={1}
							value={form.width}
							onChange={e => handleChange('width', +e.target.value)}
							className='w-1/2 p-2 text-white border rounded-md border-white/20 bg-white/10 focus:outline-none'
							placeholder='Width'
						/>
						<input
							type='number'
							min={1}
							value={form.height}
							onChange={e => handleChange('height', +e.target.value)}
							className='w-1/2 p-2 text-white border rounded-md border-white/20 bg-white/10 focus:outline-none'
							placeholder='Height'
						/>
					</div>
				</div>

				{/* Units */}
				<div className='mb-6'>
					<label className='block mb-1 text-sm text-gray-300'>Units</label>
					<select
						value={form.units}
						onChange={e => handleChange('units', e.target.value)}
						className='w-full p-2 text-white border rounded-md border-white/20 bg-white/10 focus:outline-none'
					>
						<option className='text-white bg-black' value='px'>
							Pixels (px)
						</option>
						<option className='text-white bg-black' value='cm'>
							Centimeters (cm)
						</option>
						<option className='text-white bg-black' value='in'>
							Inches (in)
						</option>
					</select>
				</div>

				{/* Buttons */}
				<div className='absolute flex gap-3 bottom-4 right-6'>
					<button onClick={onClose} className='px-4 py-2 text-sm transition border rounded-md border-white/20 hover:bg-white/10'>
						Cancel
					</button>
					<button onClick={handleCreate} className='px-4 py-2 text-sm transition bg-pink-600 rounded-md hover:bg-pink-500'>
						Create
					</button>
				</div>
			</div>
		</div>
	);
};

export default NewProjectModal;
