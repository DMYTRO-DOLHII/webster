import { useState } from 'react';

const templates = [
	{ id: 1, name: 'temp', width: 1920, height: 1080, description: 'Standard web size' },
	{ id: 2, name: 'temp', width: 1080, height: 1080, description: 'Square social media' },
	{ id: 3, name: 'temp', width: 2480, height: 3508, description: 'Print document A4' },
	{ id: 4, name: 'temp', width: 3300, height: 5100, description: 'Large format poster' },
];

const colorModes = ['RGB', 'CMYK', 'Grayscale'];
const backgrounds = ['White', 'Transparent', 'Black'];

const NewProjectModal = ({ onClose, onCreate }) => {
	const [selectedTemplate, setSelectedTemplate] = useState(templates[0]);
	const [form, setForm] = useState({
		title: '',
		width: selectedTemplate.width,
		height: selectedTemplate.height,
		units: 'px',
		colorMode: 'RGB',
		background: 'White',
	});

	const handleChange = (field, value) => {
		setForm(prev => ({ ...prev, [field]: value }));
	};

	const handleTemplateSelect = template => {
		setSelectedTemplate(template);
		setForm(prev => ({
			...prev,
			width: template.width,
			height: template.height,
		}));
	};

	const handleCreate = () => {
		if (!form.title.trim()) setForm(prev => ({...prev, title: 'Untitled Project'}))
		onCreate(form);
		onClose();
	};

	return (
		<div className='fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm'>
			<div className='relative w-[880px] max-w-[95vw] h-[600px] rounded-xl bg-black/30 text-white shadow-xl border border-white/10 backdrop-blur-2xl p-6 pb-20 flex'>
				{/* Left side: Templates */}
				<div className='w-1/3 pr-4 overflow-y-auto border-r border-white/10'>
					<h3 className='mb-3 text-sm font-semibold text-gray-300'>Templates</h3>
					{templates.map(template => (
						<div
							key={template.id}
							onClick={() => handleTemplateSelect(template)}
							className={`mb-2 p-3 rounded-lg cursor-pointer border ${
								selectedTemplate.id === template.id ? 'border-pink-500 bg-white/10' : 'border-white/10 hover:bg-white/5'
							}`}
						>
							<p className='font-medium'>{template.name}</p>
							<p className='text-xs text-gray-400'>
								{template.width} × {template.height} px
							</p>
							<p className='text-xs text-gray-500'>{template.description}</p>
						</div>
					))}
				</div>

				{/* Right side: Settings */}
				<div className='w-2/3 pl-6 overflow-y-auto'>
					<h2 className='mb-4 text-xl font-semibold'>New Project</h2>

					{/* Title */}
					<div className='mb-5'>
						<label className='block mb-1 text-sm text-gray-300'>Project Name</label>
						<input
							type='text'
							value={form.title}
							onChange={e => handleChange('title', e.target.value)}
							className='w-full p-2 text-white border rounded-md border-white/20 bg-white/10 focus:outline-none'
							placeholder='Untitled Project'
						/>
					</div>

					{/* Canvas Size */}
					<div className='grid grid-cols-3 gap-4 mb-5'>
						<div>
							<label className='block mb-1 text-sm text-gray-300'>Width</label>
							<input
								type='number'
								min={1}
								value={form.width}
								onChange={e => handleChange('width', +e.target.value)}
								className='w-full p-2 text-white border rounded-md border-white/20 bg-white/10 focus:outline-none'
							/>
						</div>
						<div>
							<label className='block mb-1 text-sm text-gray-300'>Height</label>
							<input
								type='number'
								min={1}
								value={form.height}
								onChange={e => handleChange('height', +e.target.value)}
								className='w-full p-2 text-white border rounded-md border-white/20 bg-white/10 focus:outline-none'
							/>
						</div>
						<div>
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
					</div>

					{/* Color Mode & Background */}
					<div className='grid grid-cols-2 gap-4 mb-5'>
						<div>
							<label className='block mb-1 text-sm text-gray-300'>Color Mode</label>
							<select
								value={form.colorMode}
								onChange={e => handleChange('colorMode', e.target.value)}
								className='w-full p-2 text-white border rounded-md border-white/20 bg-white/10 focus:outline-none'
							>
								{colorModes.map(mode => (
									<option className='text-white bg-black' key={mode} value={mode}>
										{mode}
									</option>
								))}
							</select>
						</div>
						<div>
							<label className='block mb-1 text-sm text-gray-300'>Background</label>
							<select
								value={form.background}
								onChange={e => handleChange('background', e.target.value)}
								className='w-full p-2 text-white border rounded-md border-white/20 bg-white/10 focus:outline-none'
							>
								{backgrounds.map(bg => (
									<option className='text-white bg-black' key={bg} value={bg}>
										{bg}
									</option>
								))}
							</select>
						</div>
					</div>
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
