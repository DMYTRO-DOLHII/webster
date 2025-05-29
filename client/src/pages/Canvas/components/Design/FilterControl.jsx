import React from 'react';

const FilterControl = ({ name, min, max, step, filters, setFilters }) => {
	const capitalizedName = name.charAt(0).toUpperCase() + name.slice(1);

	return (
		<div className='pb-2 border-b border-gray-600'>
			<div className='flex items-center justify-between'>
				<div className='flex items-center'>
					<input
						type='checkbox'
						id={name}
						checked={filters[name].active}
						onChange={e => {
							setFilters({
								...filters,
								[name]: { ...filters[name], active: e.target.checked },
							});
						}}
						className='mr-2'
					/>
					<label htmlFor={name} className='text-xs font-medium text-gray-300'>
						{capitalizedName}
					</label>
				</div>
				<span className='text-xs'>{name === 'brightness' ? filters[name].value.toFixed(1) : filters[name].value}</span>
			</div>
			<input
				type='range'
				min={min}
				max={max}
				step={step}
				value={filters[name].value}
				disabled={!filters[name].active}
				onChange={e => {
					setFilters({
						...filters,
						[name]: { ...filters[name], value: parseFloat(e.target.value) },
					});
				}}
				className='w-full'
			/>
		</div>
	);
};

export default FilterControl;
