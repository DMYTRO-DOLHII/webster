import React from 'react';

const FilterControl = ({ name, min, max, step, value, onChange }) => {
	const capitalizedName = name.charAt(0).toUpperCase() + name.slice(1);

	return (
		<div className='pb-2 border-b border-gray-600'>
			<div className='flex items-center justify-between'>
				<label className='text-xs font-medium text-gray-300'>{capitalizedName}</label>
				<span className='text-xs'>{name === 'brightness' ? value.toFixed(1) : value}</span>
			</div>
			<input type='range' min={min} max={max} step={step} value={value} onChange={e => onChange(parseFloat(e.target.value))} className='w-full' />
		</div>
	);
};

export default FilterControl;
