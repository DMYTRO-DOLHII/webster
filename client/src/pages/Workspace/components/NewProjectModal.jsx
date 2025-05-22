import { useEffect, useState } from 'react';
import { api } from '../../../services/api';
import { userStore } from '../../../store/userStore';
import placeholder from '../../../assets/placeholder-image.png';

const defaultTemplates = [
	{ id: 'default-1', name: 'Web', width: 1920, height: 1080, description: 'Standard web size', preview: placeholder },
	{ id: 'default-2', name: 'Social', width: 1080, height: 1080, description: 'Square for social media', preview: placeholder },
	{ id: 'default-3', name: 'A4', width: 2480, height: 3508, description: 'Print document A4', preview: placeholder },
	{ id: 'default-4', name: 'Poster', width: 3300, height: 5100, description: 'Large format poster', preview: placeholder },
];

const colorModes = ['RGB', 'CMYK', 'Grayscale'];
const backgrounds = ['White', 'Transparent', 'Black'];

const NewProjectModal = ({ onClose, onCreate }) => {
	const userId = userStore.user.id;
	const [userTemplates, setUserTemplates] = useState([]);
	const [selectedTemplate, setSelectedTemplate] = useState(defaultTemplates[0]);

	const [form, setForm] = useState({
		title: '',
		width: defaultTemplates[0].width,
		height: defaultTemplates[0].height,
		units: 'px',
		colorMode: 'RGB',
		background: 'White',
		info: '',
	});

	useEffect(() => {
		const loadUserTemplates = async () => {
			if (!userId) return;

			try {
				const { data } = await api.get(`/users/${userId}/templates`);
				const templates = data.map(template => ({
					id: template.id,
					name: template.title,
					width: template.info?.attrs.width || 1920,
					height: template.info?.attrs.height || 1080,
					description: template.info?.description || '',
					preview: template.previewImage ? `${template.previewImage}` : placeholder,
					info: template.info || {},
				}));
				setUserTemplates(templates);
			} catch (err) {
				console.error('Failed to load user templates:', err);
			}
		};

		loadUserTemplates();
	}, [userId]);

	const handleChange = (field, value) => {
		setForm(prev => ({ ...prev, [field]: value }));
	};

	const handleTemplateSelect = template => {
		setSelectedTemplate(template);
		setForm(prev => ({
			...prev,
			width: template.width,
			height: template.height,
			info: template.id.startsWith('default-') ? '' : template.info || '',
		}));
	};

	const handleCreate = () => {
		onCreate(form);
		onClose();
	};

	const allTemplates = [...defaultTemplates, ...userTemplates];

	return (
		<div className='fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm'>
			<div className='relative w-[880px] max-w-[95vw] h-[600px] rounded-xl bg-black/30 text-white shadow-xl border border-white/10 backdrop-blur-2xl p-6 pb-20 flex'>
				<div className='w-1/3 pr-4 border-r border-white/10 overflow-y-auto max-h-[540px] scrollbar-thin scrollbar-thumb-white/20 scrollbar-thumb-rounded-md hover:scrollbar-thumb-white/40'>
					<h3 className='mb-3 text-sm font-semibold text-gray-300'>Templates</h3>
					{allTemplates.map(template => (
						<div
							key={template.id}
							onClick={() => handleTemplateSelect(template)}
							className={`mb-3 p-2 rounded-lg cursor-pointer flex items-center gap-3 border ${
								selectedTemplate.id === template.id ? 'border-pink-500 bg-white/10' : 'border-white/10 hover:bg-white/5'
							}`}
						>
							<img src={template.preview} alt='preview' width={48} height={48} className='object-cover rounded-sm bg-white/10' />
							<div>
								<p className='font-medium'>{template.name}</p>
								<p className='text-xs text-gray-400'>
									{template.width} × {template.height} px
								</p>
								<p className='text-xs text-gray-500'>{template.description}</p>
							</div>
						</div>
					))}
				</div>

				<div className='w-2/3 pl-6 overflow-y-auto'>
					<h2 className='mb-4 text-xl font-semibold'>New Project</h2>

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
								<option value='px'>Pixels (px)</option>
								<option value='cm'>Centimeters (cm)</option>
								<option value='in'>Inches (in)</option>
							</select>
						</div>
					</div>

					<div className='grid grid-cols-2 gap-4 mb-5'>
						<div>
							<label className='block mb-1 text-sm text-gray-300'>Color Mode</label>
							<select
								value={form.colorMode}
								onChange={e => handleChange('colorMode', e.target.value)}
								className='w-full p-2 text-white border rounded-md border-white/20 bg-white/10 focus:outline-none'
							>
								{colorModes.map(mode => (
									<option key={mode} value={mode}>
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
									<option key={bg} value={bg}>
										{bg}
									</option>
								))}
							</select>
						</div>
					</div>
				</div>

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
