// components/Footer.jsx
import React from 'react';

const Footer = ({ zoom, setZoom }) => {
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
      <span>{Math.round(zoom * 100)}%</span>
    </div>
  );
};

export default Footer;
