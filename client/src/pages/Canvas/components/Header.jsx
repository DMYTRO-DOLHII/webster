import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { LuBrainCircuit } from 'react-icons/lu';
import { AsciiToHexadecimal } from '@ilihub/ascii-to-hexadecimal';
import { editorStore } from '../../../store/editorStore';
import { api } from '../../../services/api';
import toast from 'react-hot-toast';

const menuStructure = {
	File: ['New', 'Open', '---', 'Save as McOkster', 'Save as Template', 'Export PNG'],
	Edit: ['Step forward', 'Step backward', '---', 'Copy', 'Paste', '---', 'Transform'],
	Image: [],
	Layer: [],
	Select: [],
	Filter: [],
	View: [],
	Help: [],
};

const Header = ({ onSave }) => {
	const [openMenu, setOpenMenu] = useState(null);
	const menuRef = useRef(null);
	const navigate = useNavigate();
	const { projectId } = useParams();

	useEffect(() => {
		const handleClickOutside = e => {
			if (menuRef.current && !menuRef.current.contains(e.target)) {
				setOpenMenu(null);
			}
		};
		document.addEventListener('mousedown', handleClickOutside);
		return () => document.removeEventListener('mousedown', handleClickOutside);
	}, []);

	const handleLogoClick = () => {
		navigate('/workspace');
	};

	const handleExportPNGClck = async () => {
		try {
			const dataURL = editorStore.stage.toDataURL({
				pixelRatio: 1,
			});

			const link = document.createElement('a');
			link.download = 'projectName.png';
			link.href = dataURL;
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
		} catch (err) {
			console.error('Failed to export png:', err);
		}
	};

	const handleOpenMcOksterClick = async () => {
		try {
			const [fileHandle] = await window.showOpenFilePicker({
				types: [
					{
						description: 'McOkster File',
						accept: { 'application/octet-stream': ['.mcokster'] },
					},
				],
				excludeAcceptAllOption: true,
				multiple: false,
			});

			const file = await fileHandle.getFile();
			const hexText = await file.text();

			const ascii = hexText
				.match(/.{1,2}/g)
				.map(byte => String.fromCharCode(parseInt(byte, 16)))
				.join('');

			const json = JSON.parse(ascii);

			localStorage.setItem('designData', JSON.stringify(json));
			editorStore.setProjectJSON(json);

			toast.success('Design file has been loaded successfully.', {
				style: {
					padding: '16px',
					color: '#9B34BA',
				},
				iconTheme: {
					primary: '#9B34BA',
					secondary: '#FFFAEE',
				},
			});
		} catch (err) {
			if (err.name === 'AbortError') return;
			console.error('Failed to open McOkster file:', err);
			alert('Failed to open file.');
		}
	};

	const handleSaveAsMcOksterClick = async () => {
		try {
			if (onSave) onSave();
			await new Promise(resolve => setTimeout(resolve, 100));

			const designJson = localStorage.getItem('designData');
			if (!designJson) {
				alert('No design data to save!');
				return;
			}

			const hex = AsciiToHexadecimal(designJson);

			const options = {
				suggestedName: 'design.mcokster',
				types: [
					{
						description: 'McOkster File',
						accept: { 'application/octet-stream': ['.mcokster'] },
					},
				],
			};

			const handle = await window.showSaveFilePicker(options);
			const writable = await handle.createWritable();
			await writable.write(hex);
			await writable.close();
		} catch (err) {
			if (err.name === 'AbortError') {
				return;
			}

			console.error('Save as McOkster failed:', err);
			alert('Failed to save file.');
		}
	};

	const handleMenuItemClick = (item, entry) => {
		console.log(`${item} → ${entry}`);
		setOpenMenu(null);

		if (item === 'File' && entry === 'Save as McOkster') {
			handleSaveAsMcOksterClick();
		}
		if (item === 'File' && entry === 'Open') {
			handleOpenMcOksterClick();
		}
		if (item === 'File' && entry === 'Export PNG') {
			handleExportPNGClck();
		}
		if (item === 'File' && entry === 'Save as Template') {
			handleSaveAsTemplateClick();
		}
	};

	const handleSaveAsTemplateClick = async () => {
		try {
			await api.patch(`/projects/${projectId}`, { isTemplate: true });

			toast.success('✅ Project saved as template successfully!', {
				icon: '🗂️',
				style: {
					background: '#333',
					color: '#fff',
				},
			});
		} catch (error) {
			console.error('Error saving project as template:', error);
			toast.error('❌ Failed to save project as template.', {
				icon: '⚠️',
				style: {
					background: '#333',
					color: '#fff',
				},
			});
		}
	};

	return (
		<header className='flex justify-between items-center px-4 h-12 bg-[#1c1c1c] text-white border-b border-[#2a2a2a] fixed w-full z-50'>
			<div className='relative flex items-center space-x-6' ref={menuRef}>
				<LuBrainCircuit className='text-[#9b34ba] text-xl cursor-pointer' onClick={handleLogoClick} />

				<nav className='flex space-x-5 text-sm'>
					{Object.entries(menuStructure).map(([item, entries]) => (
						<div key={item} className='relative'>
							<div onClick={() => setOpenMenu(openMenu === item ? null : item)} className='transition-opacity cursor-pointer select-none hover:opacity-100'>
								{item}
							</div>

							{openMenu === item && (
								<div className='absolute mt-1 min-w-[160px] z-999 bg-[#363636] backdrop-blur-md border border-[#444] text-sm rounded py-1 shadow-lg'>
									{entries.length === 0 ? (
										<div className='px-3 py-1 text-gray-400'>Coming Soon</div>
									) : (
										entries.map((entry, idx) =>
											entry === '---' ? (
												<div key={`sep-${idx}`} className='border-t border-[#444] my-1'></div>
											) : (
												<div key={entry} onClick={() => handleMenuItemClick(item, entry)} className='px-3 py-1 hover:bg-[#3a3a3a] cursor-pointer'>
													{entry}
												</div>
											)
										)
									)}
								</div>
							)}
						</div>
					))}
				</nav>
			</div>

			<div>
				<button className='px-3 py-1 text-sm text-white bg-purple-600 rounded hover:bg-purple-700'>Share</button>
			</div>
		</header>
	);
};

export default Header;
