// components/Footer.jsx
import React, { useState } from 'react';

const Footer = ({ zoom, setZoom }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState(Math.round(zoom * 100));

  const handleDoubleClick = () => {
    setIsEditing(true);
    setInputValue(Math.round(zoom * 100));
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const commitChange = () => {
    const value = parseFloat(inputValue);
    if (!isNaN(value) && value >= 50 && value <= 200) {
      setZoom(value / 100);
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      commitChange();
    } else if (e.key === 'Escape') {
      setIsEditing(false);
    }
  };

  return (
    <div className="bg-[#1e1e1e] text-white p-2 flex items-center justify-center space-x-4">
      <label htmlFor="zoomSlider">Zoom:</label>
      <input
        id="zoomSlider"
        type="range"
        min="0.5"
        max="2"
        step="0.01"
        value={zoom}
        onChange={(e) => setZoom(parseFloat(e.target.value))}
        className="w-48"
      />
      {isEditing ? (
        <input
          type="number"
          min="50"
          max="200"
          step="1"
          autoFocus
          value={inputValue}
          onChange={handleInputChange}
          onBlur={commitChange}
          onKeyDown={handleKeyDown}
          className="w-16 text-white rounded px-1"
        />
      ) : (
        <span onDoubleClick={handleDoubleClick} className="cursor-pointer select-none">
          {Math.round(zoom * 100)}%
        </span>
      )}
    </div>
  );
};

export default Footer;
