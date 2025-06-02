import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { LuBrainCircuit } from 'react-icons/lu';
import { AsciiToHexadecimal } from '@ilihub/ascii-to-hexadecimal';
import { editorStore } from '../../../store/editorStore';
import { api } from '../../../services/api';
import toast from 'react-hot-toast';
import { jsPDF } from 'jspdf';
import { userStore } from '../../../store/userStore';
window.jspdf = { jsPDF };
import {
    FacebookShareButton,
    TwitterShareButton,
    LinkedinShareButton,
    TelegramShareButton,
    WhatsappShareButton,
    RedditShareButton,
    EmailShareButton,
    FacebookIcon,
    TwitterIcon,
    LinkedinIcon,
    TelegramIcon,
    WhatsappIcon,
    RedditIcon,
    EmailIcon,
} from 'react-share';
import { FiLink } from 'react-icons/fi';
import { exportStageSVG } from 'react-konva-to-svg'

const TEMPLATE_LIMITS = {
    'basic': 1,
    'advanced': 10,
    'premium': Infinity
};

const menuStructure = {
    File: [
        'New',
        'Open',
        '---',
        'Save as McOkster',
        'Save as Template',
        {
            label: 'Export As',
            submenu: ['PNG', 'JPG', 'PDF', 'SVG'],
        },
    ],
    Edit: ['Step forward', 'Step backward', '---', 'Copy', 'Paste', '---', 'Resize Canvas'],
};

const Header = ({ onSave }) => {
    const [openMenu, setOpenMenu] = useState(null);
    const [openSubMenu, setOpenSubMenu] = useState(null);
    const [showShare, setShowShare] = useState(false);
    const menuRef = useRef(null);
    const shareRef = useRef(null);
    const navigate = useNavigate();
    const { projectId } = useParams();

    const [projectName, setProjectName] = useState('');
    const [isResizeModalOpen, setIsResizeModalOpen] = useState(false);
    const shareUrl = window.location.href;

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(shareUrl);
            toast.success('Link copied to clipboard!', {
                style: { background: '#333', color: '#fff' },
            });
        } catch (err) {
            toast.error('Failed to copy link', {
                style: { background: '#333', color: '#fff' },
            });
        }
    };


    useEffect(() => {
        const handleClickOutside = e => {
            if (menuRef.current && !menuRef.current.contains(e.target) && shareRef.current && !shareRef.current.contains(e.target)) {
                setOpenMenu(null);
                setOpenSubMenu(null);
                setShowShare(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        const storedProject = editorStore.project;
        if (storedProject?.title) {
            setProjectName(storedProject.title);
        } else {
            try {
                const savedData = localStorage.getItem('designData');
                if (savedData) {
                    const parsed = JSON.parse(savedData);
                    if (parsed.title) {
                        setProjectName(parsed.title);
                    }
                }
            } catch (err) {
                console.error('Failed to load project title from localStorage:', err);
            }
        }
    }, []);

    const handleLogoClick = () => navigate('/workspace');

    const handleMenuToggle = menuName => {
        setOpenSubMenu(null);
        setOpenMenu(prev => (prev === menuName ? null : menuName));
    };

    const handleMenuItemClick = async (menu, item) => {
        setOpenMenu(null);
        setOpenSubMenu(null);
        if (menu === 'Edit') {
			switch (item) {
				case 'Resize Canvas':
					await handleResize();
					break;
				default:
					console.log(`${menu} → ${item}`);
			}
		}

        if (menu === 'File') {
            switch (item) {
                case 'Save as McOkster':
                    await handleSaveAsMcOksterClick();
                    break;
                case 'Open':
                    await handleOpenMcOksterClick();
                    break;
                case 'Save as Template':
                    await handleSaveAsTemplateClick();
                    break;
                case 'Export As → PNG':
                    handleExportAs('image/png', 'png');
                    break;
                case 'Export As → JPG':
                    handleExportAs('image/jpeg', 'jpg');
                    break;
                case 'Export As → PDF':
                    handleExportAsPDF();
                    break;
                case 'Export As → SVG':
                    handleExportAsSVG();
                    break;
                default:
                    console.log(`${menu} → ${item}`);
            }
        }
    };

    const handleResize = async () => {
		setIsResizeModalOpen(true);
	};      

    const changeSize = async (width, height) => {
        const savedData = localStorage.getItem('designData');
        if (savedData) {
			const parsed = JSON.parse(savedData);
            if (parsed.attrs) {
				parsed.attrs.width = width;
				parsed.attrs.height = height;
                const json = JSON.stringify(parsed);
				localStorage.setItem('designData', json);
                await api.patch(`/projects/${projectId}`, {
					info: JSON.parse(json),
				});
                window.location.reload();
			}
		}
    }

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
                .map(b => String.fromCharCode(parseInt(b, 16)))
                .join('');
            const json = JSON.parse(ascii);

            localStorage.setItem('designData', JSON.stringify(json));
            editorStore.setProjectJSON(json);

            toast.success('Design file loaded successfully.', {
                style: { padding: '16px', color: '#9B34BA' },
                iconTheme: { primary: '#9B34BA', secondary: '#FFFAEE' },
            });
        } catch (err) {
            if (err.name !== 'AbortError') {
                console.error('Failed to open McOkster file:', err);
                alert('Failed to open file.');
            }
        }
    };

    const handleSaveAsMcOksterClick = async () => {
        try {
            if (onSave) onSave();
            await new Promise(res => setTimeout(res, 100));
            const designJson = localStorage.getItem('designData');
            if (!designJson) return alert('No design data to save!');
            const parsed = JSON.parse(designJson);

            parsed.attrs.width = editorStore.width;
            parsed.attrs.height = editorStore.height;

            const anotherDesignJSON = JSON.stringify(parsed);
            const hex = AsciiToHexadecimal(anotherDesignJSON);

            const handle = await window.showSaveFilePicker({
                suggestedName: 'design.mcokster',
                types: [
                    {
                        description: 'McOkster File',
                        accept: { 'application/octet-stream': ['.mcokster'] },
                    },
                ],
            });

            const writable = await handle.createWritable();
            await writable.write(hex);
            await writable.close();
        } catch (err) {
            if (err.name !== 'AbortError') {
                console.error('Save as McOkster failed:', err);
                alert('Failed to save file.');
            }
        }
    };

    const handleExportAs = (mimeType, extension) => {
        try {
            const dataURL = editorStore.stage.toDataURL({ mimeType });
            const link = document.createElement('a');
            link.download = `${projectName}.${extension}`;
            link.href = dataURL;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (err) {
            console.error(`Failed to export as ${extension}:`, err);
        }
    };

    const handleExportAsPDF = () => {
        try {
            const canvas = editorStore.stage.toCanvas();
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF();
            pdf.addImage(imgData, 'PNG', 10, 10);
            pdf.save(projectName + '.pdf');
        } catch (err) {
            console.error('Failed to export as PDF:', err);
        }
    };

    const handleExportAsSVG = async () => {
        try {
            console.log(editorStore.stage);
            return;
            const url = await exportStageSVG(editorStore.stage, false);

            const link = document.createElement('a');
            link.download = `${projectName}.svg`;
            link.href = url;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            URL.revokeObjectURL(url);
        } catch (err) {
            console.error('Failed to export as SVG:', err);
            alert('Export to SVG failed.');
        }
    };

    const handleSaveAsTemplateClick = async () => {
        try {
            const userSubscription = userStore?.user?.subscription || 'basic';

            // Get user's templates count
            const response = await api.get(`/projects/user-templates/${userStore?.user?.id}`);
            
            console.log(response.data);

            const limit = TEMPLATE_LIMITS[userSubscription];
            const templatesCount = response.data.length;

            if (templatesCount >= limit) {
                toast.error(
                    (t) => (
                        <div className="flex flex-col gap-1">
                            <span>Template limit reached for {userSubscription} plan</span>
                            <button
                                className="bg-[#9B34BA] text-white px-2 py-1 rounded text-sm"
                                onClick={() => {
                                    toast.dismiss(t.id);
                                    navigate('/pricing');
                                }}
                            >
                                Upgrade Plan
                            </button>
                        </div>
                    ),
                    {
                        duration: 5000,
                        style: {
                            background: '#333',
                            color: '#fff',
                            padding: '16px',
                        },
                    }
                );
                return;
            }

            await api.patch(`/projects/${projectId}`, { isTemplate: true });
            toast.success('Project saved as template!', {
                icon: '🗂️',
                style: {
                    background: '#333',
                    color: '#fff',
                    padding: '16px'
                },
            });
        } catch (error) {
            console.error('Error saving template:', error);
            toast.error('Failed to save template.', {
                icon: '⚠️',
                style: {
                    background: '#333',
                    color: '#fff',
                    padding: '16px'
                },
            });
        }
    };

    return (
		<header className='py-3  flex justify-between items-center px-4 h-12 bg-[#1c1c1c] text-white border-b border-[#2a2a2a] w-full z-50'>
			<div className='relative flex items-center space-x-6' ref={menuRef}>
				<LuBrainCircuit className='text-[#9b34ba] text-xl cursor-pointer' onClick={handleLogoClick} />

				<nav className='flex space-x-5 text-sm'>
					{Object.entries(menuStructure).map(([menuName, items]) => (
						<div key={menuName} className='relative'>
							<div className='px-3 py-1 hover:bg-[#3a3a3a] cursor-pointer rounded' onClick={() => handleMenuToggle(menuName)}>
								{menuName}
							</div>
							{openMenu === menuName && (
								<div className='absolute left-0 top-full mt-1 bg-[#2a2a2a] border border-[#444] rounded shadow-md z-50 min-w-[160px]'>
									{items.map((item, idx) => {
										if (item === '---') {
											return <div key={idx} className='border-t border-[#444] my-1' />;
										}

										if (typeof item === 'string') {
											return (
												<div key={item} onClick={() => handleMenuItemClick(menuName, item)} className='px-4 py-2 hover:bg-[#3a3a3a] cursor-pointer'>
													{item}
												</div>
											);
										}

										if (typeof item === 'object' && item.submenu) {
											return (
												<div key={item.label} className='relative'>
													<div
														className='px-4 py-2 hover:bg-[#3a3a3a] cursor-pointer flex justify-between items-center'
														onClick={() => setOpenSubMenu(prev => (prev === item.label ? null : item.label))}
													>
														{item.label}
														<span className='ml-2'>&#9654;</span>
													</div>
													{openSubMenu === item.label && (
														<div className='absolute left-full top-0 ml-1 min-w-[120px] bg-[#363636] border border-[#444] rounded shadow-lg z-50'>
															{item.submenu.map(subItem => (
																<div
																	key={subItem}
																	onClick={() => handleMenuItemClick(menuName, `${item.label} → ${subItem}`)}
																	className='px-3 py-1 hover:bg-[#3a3a3a] cursor-pointer'
																>
																	{subItem}
																</div>
															))}
														</div>
													)}
												</div>
											);
										}

										return null;
									})}
								</div>
							)}
						</div>
					))}
				</nav>
			</div>

			{isResizeModalOpen && (
				<div className='fixed inset-0 z-50 flex items-center justify-center bg-black'>
					<div className='p-6 bg-[#2a2a2a] rounded-lg w-80 border border-[#444] text-white shadow-xl'>
						<h2 className='mb-4 text-lg font-semibold'>Change the size</h2>
						<form
							onSubmit={e => {
								e.preventDefault();
								const width = Number(e.target.width.value);
								const height = Number(e.target.height.value);
								changeSize(width, height);
								setIsResizeModalOpen(false);
							}}
						>
							<div className='mb-4'>
								<label className='block text-sm font-medium text-gray-300'>Width</label>
								<input
									name='width'
									type='number'
									className='w-full px-3 py-2 bg-[#1c1c1c] border border-[#444] rounded text-white focus:outline-none focus:ring-2 focus:ring-purple-600'
								/>
							</div>
							<div className='mb-4'>
								<label className='block text-sm font-medium text-gray-300'>Height</label>
								<input
									name='height'
									type='number'
									className='w-full px-3 py-2 bg-[#1c1c1c] border border-[#444] rounded text-white focus:outline-none focus:ring-2 focus:ring-purple-600'
								/>
							</div>
							<div className='flex justify-end space-x-2'>
								<button type='button' onClick={() => setIsResizeModalOpen(false)} className='px-4 py-2 bg-[#3a3a3a] text-white rounded hover:bg-[#4a4a4a]'>
									Cancel
								</button>
								<button type='submit' className='px-4 py-2 text-white bg-purple-600 rounded hover:bg-purple-700'>
									Apply
								</button>
							</div>
						</form>
					</div>
				</div>
			)}

			<div className='relative' ref={shareRef}>
				<button onClick={() => setShowShare(prev => !prev)} className='px-3 py-1 text-sm text-white bg-purple-600 rounded hover:bg-purple-700'>
					Share
				</button>

				{showShare && (
					<div className='absolute right-0 mt-2 bg-[#2a2a2a] border border-[#444] rounded p-3 flex flex-wrap gap-3 max-w-xs z-999999'>
						<FacebookShareButton url={shareUrl} quote={projectName}>
							<FacebookIcon size={32} round />
						</FacebookShareButton>

						<TwitterShareButton url={shareUrl} title={projectName}>
							<TwitterIcon size={32} round />
						</TwitterShareButton>

						<LinkedinShareButton url={shareUrl} title={projectName}>
							<LinkedinIcon size={32} round />
						</LinkedinShareButton>

						<TelegramShareButton url={shareUrl} title={projectName}>
							<TelegramIcon size={32} round />
						</TelegramShareButton>

						<WhatsappShareButton url={shareUrl} title={projectName}>
							<WhatsappIcon size={32} round />
						</WhatsappShareButton>

						<RedditShareButton url={shareUrl} title={projectName}>
							<RedditIcon size={32} round />
						</RedditShareButton>

						<EmailShareButton url={shareUrl} subject={projectName} body={`Check this out: ${shareUrl}`}>
							<EmailIcon size={32} round />
						</EmailShareButton>

						<button
							onClick={handleCopy}
							className='flex items-center justify-center w-8 h-8 text-black transition bg-white rounded-full hover:opacity-80'
							title='Copy link'
						>
							<FiLink size={18} />
						</button>
					</div>
				)}
			</div>
		</header>
	);
};

export default Header;
