import React, { useState } from 'react';
import './ToggleButton.css';

const ToggleEngine = ({ value, onChange }) => {
  // Use internal state if not controlled by parent.
  const [selected, setSelected] = useState(value || 'Low-poly');

  const handleChange = (e) => {
    setSelected(e.target.value);
    if (onChange) {
      onChange(e.target.value);
    }
  };

  return (
    <div className="radio-inputs">
      <label>
        <input
          className="radio-input"
          type="radio"
          name="engine"
          value="low"
          checked={selected === 'low'}
          onChange={handleChange}
        />
        <span className="radio-tile">
          <span className="radio-icon">
            <svg
              stroke="currentColor"
              xmlSpace="preserve"
              viewBox="0 0 493.407 493.407"
              xmlnsXlink="http://www.w3.org/1999/xlink"
              xmlns="http://www.w3.org/2000/svg"
              id="Capa_1"
              version="1.1"
              width="200px"
              height="200px"
              fill="none"
            >
              {/* replace svg here */}
            </svg>
          </span>
          <span className="radio-label">Low-poly</span>
        </span>
      </label>
      <label>
        <input
          className="radio-input"
          type="radio"
          name="engine"
          value="spike"
          checked={selected === 'spike'}
          onChange={handleChange}
        />
        <span className="radio-tile">
          <span className="radio-icon">
            <svg
              stroke="currentColor"
              xmlSpace="preserve"
              viewBox="0 0 467.168 467.168"
              xmlnsXlink="http://www.w3.org/1999/xlink"
              xmlns="http://www.w3.org/2000/svg"
              id="Capa_1"
              version="1.1"
              fill="none"
            >
              {/* replace svg here */}
            </svg>
          </span>
          <span className="radio-label">Spike</span>
        </span>
      </label>
      <label>
        <input
          className="radio-input"
          type="radio"
          name="engine"
          value="solid"
          checked={selected === 'solid'}
          onChange={handleChange}
        />
        <span className="radio-tile">
          <span className="radio-icon">
            <svg
              stroke="currentColor"
              xmlSpace="preserve"
              viewBox="0 0 324.018 324.017"
              xmlnsXlink="http://www.w3.org/1999/xlink"
              xmlns="http://www.w3.org/2000/svg"
              id="Capa_1"
              version="1.1"
              fill="none"
            >
              {/* replace svg here */}
            </svg>
          </span>
          <span className="radio-label">Solid</span>
        </span>
      </label>
    </div>
  );
};

export default ToggleEngine;
