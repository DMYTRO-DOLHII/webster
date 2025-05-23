import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { LuBrainCircuit } from 'react-icons/lu';
import { AsciiToHexadecimal } from '@ilihub/ascii-to-hexadecimal';
import { editorStore } from '../../../store/editorStore';
import { api } from '../../../services/api';
import toast from 'react-hot-toast';
import { jsPDF } from 'jspdf';
window.jspdf = { jsPDF };
import { exportStageSVG } from 'react-konva-to-svg'

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
    Edit: ['Step forward', 'Step backward', '---', 'Copy', 'Paste', '---', 'Transform'],

};

const Header = ({ onSave }) => {
    const [openMenu, setOpenMenu] = useState(null);
    const [openSubMenu, setOpenSubMenu] = useState(null);
    const menuRef = useRef(null);
    const navigate = useNavigate();
    const { projectId } = useParams();

    const projectName = editorStore.project.title;

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setOpenMenu(null);
                setOpenSubMenu(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogoClick = () => navigate('/workspace');

    const handleMenuToggle = (menuName) => {
        setOpenSubMenu(null);
        setOpenMenu((prev) => (prev === menuName ? null : menuName));
    };

    const handleMenuItemClick = async (menu, item) => {
        setOpenMenu(null);
        setOpenSubMenu(null);

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

    const handleOpenMcOksterClick = async () => {
        try {
            const [fileHandle] = await window.showOpenFilePicker({
                types: [{
                    description: 'McOkster File',
                    accept: { 'application/octet-stream': ['.mcokster'] },
                }],
                excludeAcceptAllOption: true,
                multiple: false,
            });

            const file = await fileHandle.getFile();
            const hexText = await file.text();
            const ascii = hexText.match(/.{1,2}/g).map(b => String.fromCharCode(parseInt(b, 16))).join('');
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
            const hex = AsciiToHexadecimal(designJson);

            const handle = await window.showSaveFilePicker({
                suggestedName: 'design.mcokster',
                types: [{
                    description: 'McOkster File',
                    accept: { 'application/octet-stream': ['.mcokster'] },
                }],
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

    const handleExportAsSVG = async() => {
        try {
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
            await api.patch(`/projects/${projectId}`, { isTemplate: true });
            toast.success('Project saved as template!', {
                icon: '🗂️',
                style: { background: '#333', color: '#fff' },
            });
        } catch (error) {
            console.error('Error saving template:', error);
            toast.error('Failed to save template.', {
                icon: '⚠️',
                style: { background: '#333', color: '#fff' },
            });
        }
    };

    return (
        <header className='flex justify-between items-center px-4 h-12 bg-[#1c1c1c] text-white border-b border-[#2a2a2a] fixed w-full z-50'>
            <div className='relative flex items-center space-x-6' ref={menuRef}>
                <LuBrainCircuit className='text-[#9b34ba] text-xl cursor-pointer' onClick={handleLogoClick} />

                <nav className='flex space-x-5 text-sm'>
                    {Object.entries(menuStructure).map(([menuName, items]) => (
                        <div key={menuName} className='relative'>
                            <div
                                className='px-3 py-1 hover:bg-[#3a3a3a] cursor-pointer rounded'
                                onClick={() => handleMenuToggle(menuName)}
                            >
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
                                                <div
                                                    key={item}
                                                    onClick={() => handleMenuItemClick(menuName, item)}
                                                    className='px-4 py-2 hover:bg-[#3a3a3a] cursor-pointer'
                                                >
                                                    {item}
                                                </div>
                                            );
                                        }

                                        if (typeof item === 'object' && item.submenu) {
                                            return (
                                                <div key={item.label} className='relative'>
                                                    <div
                                                        className='px-4 py-2 hover:bg-[#3a3a3a] cursor-pointer flex justify-between items-center'
                                                        onClick={() =>
                                                            setOpenSubMenu(prev => (prev === item.label ? null : item.label))
                                                        }
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

            <div>
                <button className='px-3 py-1 text-sm text-white bg-purple-600 rounded hover:bg-purple-700'>
                    Share
                </button>
            </div>
        </header>
    );
};

export default Header;
