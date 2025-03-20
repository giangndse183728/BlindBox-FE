import React, { useState, useEffect } from 'react';
import './ToggleButton.css';
import { fetchBeads } from '../../services/accessoryApi'; // Update import path if needed

const ToggleEngine = ({ value, onChange, onPriceChange }) => {
  // Use internal state if not controlled by parent.
  const [selected, setSelected] = useState(value || 'low');
  const [beadData, setBeadData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Map type strings to type names
  const typeNameMap = {
    "0": "low",
    "1": "spike",
    "2": "solid"
  };

  // Get price for a specific bead type
  const getPriceForType = (type) => {
    // Convert type to number if it's a string
    const typeNum = typeof type === 'string' ? parseInt(type, 10) : type;
    const bead = beadData.find(b => b.type === typeNum);
    return bead ? bead.price : 0;
  };

  useEffect(() => {
    const getBeadData = async () => {
      try {
        const data = await fetchBeads();
        setBeadData(data);
        
        // If onPriceChange callback exists, pass initial price
        if (onPriceChange) {
          const initialType = selected === 'low' ? 0 : selected === 'spike' ? 1 : 2;
          const initialPrice = data.find(b => b.type === initialType)?.price || 0;
          onPriceChange(initialPrice);
        }
      } catch (error) {
        console.error('Error loading bead data:', error);
      } finally {
        setLoading(false);
      }
    };

    getBeadData();
  }, []);

  const handleChange = (e) => {
    const newValue = e.target.value;
    setSelected(newValue);
    
    if (onChange) {
      onChange(newValue);
    }
    
    // Pass price to parent if callback exists
    if (onPriceChange && beadData.length > 0) {
      const beadType = newValue === 'low' ? 0 : newValue === 'spike' ? 1 : 2;
      const price = getPriceForType(beadType);
      onPriceChange(price);
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
               <path d="m365.5,191.5v-106.7c0-7.2-3.8-13.8-9.9-17.5l-89-53.4c-6.5-3.9-14.5-3.9-21,0l-89.1,53.4c-6.2,3.7-9.9,10.3-9.9,17.5v106.7c0,7.2 3.8,13.8 9.9,17.5l89.1,53.4c9.4,5.4 17.2,2.5 21,0l89-53.4c6.1-3.7 9.9-10.3 9.9-17.5z"></path> <path d="m220,303l-89-53.4c-6.5-3.9-14.5-3.9-21,0l-89.1,53.4c-6.2,3.7-9.9,10.3-9.9,17.5v106.7c0,7.2 3.8,13.8 9.9,17.5l89.1,53.4c9.4,5.4 17.2,2.5 21,0l89-53.4c6.2-3.7 9.9-10.3 9.9-17.5v-106.7c0-7.2-3.7-13.8-9.9-17.5z"></path> <path d="m491.1,302.9l-89-53.4c-6.5-3.9-14.5-3.9-21,0l-89.1,53.4c-6.2,3.7-9.9,10.3-9.9,17.5v106.7c0,7.2 3.8,13.8 9.9,17.5l89,53.4c9.4,5.4 17.2,2.5 21,0l89-53.4c6.2-3.7 9.9-10.3 9.9-17.5v-106.7c0.1-7.2-3.7-13.8-9.8-17.5z"></path> 
            </svg>
          </span>
          <span className="radio-label">
            Low-poly
            {!loading && (<span className="price-tag">${getPriceForType(0)}</span>)}
          </span>
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
              <path xmlns="http://www.w3.org/2000/svg" d="M256 16c-7.5 67.5-37.5 150-37.5 180 0 15 15 30 37.5 30s37.5-15 37.5-30c0-30-30-112.5-37.5-180zM143.5 61.156c27.255 62.207 24.5 72.447 32 85.438 7.5 12.99 15.01 25.97 28 18.47s5.5-20.48-2-33.47c-7.5-12.99-17.755-15.73-58-70.438zm225 0c-40.245 54.707-50.5 57.447-58 70.438-7.5 12.99-14.99 25.97-2 33.47s20.5-5.48 28-18.47c7.5-12.99 4.745-23.23 32-85.438zM61.156 143.5c54.707 40.245 57.447 50.5 70.438 58 12.99 7.5 25.97 14.99 33.47 2s-5.48-20.5-18.47-28c-12.99-7.5-23.23-4.745-85.438-32zm389.688 0c-62.207 27.255-72.447 24.5-85.438 32-12.99 7.5-25.97 15.01-18.47 28 7.502 12.99 20.48 5.5 33.47-2 12.99-7.5 15.73-17.755 70.438-58zM196 218.5c-30 0-112.5 30-180 37.5 67.5 7.5 150 37.5 180 37.5 15 0 30-15 30-37.5s-15-37.5-30-37.5zm120 0c-15 0-30 15-30 37.5s15 37.5 30 37.5c30 0 112.5-30 180-37.5-67.5-7.5-150-37.5-180-37.5zM256 286c-22.5 0-37.5 15-37.5 30 0 30 30 112.5 37.5 180 7.5-67.5 37.5-150 37.5-180 0-15-15-30-37.5-30zm-102.438 15.438c-6.563.164-14.255 4.61-21.968 9.062-12.99 7.5-15.73 17.755-70.438 58 62.207-27.255 72.447-24.5 85.438-32 12.99-7.5 25.97-15.01 18.47-28-3.048-5.277-7.01-7.175-11.5-7.063zm203.844 0c-4.067.19-7.656 2.19-10.47 7.062-7.498 12.99 5.48 20.5 18.47 28 12.99 7.5 23.23 4.745 85.438 32-54.707-40.245-57.447-50.5-70.438-58-8.12-4.688-16.22-9.378-23-9.063zM195.72 344.75c-8.48.378-14.36 10.508-20.22 20.656-7.5 12.99-4.745 23.23-32 85.438 40.245-54.707 50.5-57.447 58-70.438 7.5-12.99 14.99-25.97 2-33.47-2.842-1.64-5.408-2.292-7.78-2.186zm119.53 0c-2.086.1-4.314.78-6.75 2.188-12.99 7.5-5.5 20.478 2 33.468 7.5 12.99 17.755 15.73 58 70.438-27.255-62.207-24.5-72.447-32-85.438-6.094-10.554-12.21-21.092-21.25-20.656z" />
            </svg>
          </span>
          <span className="radio-label">
            Spike
            {!loading && (<span className="price-tag">${getPriceForType(1)}</span>)}
          </span>
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
              viewBox="0 0 493.407 493.407"
              xmlnsXlink="http://www.w3.org/1999/xlink"
              xmlns="http://www.w3.org/2000/svg"
              id="Capa_1"
              version="1.1"
              width="200px"
              height="200px"
              fill="none"
            >
              <path xmlns="http://www.w3.org/2000/svg"  d="M256 23C127.4 23 23 127.4 23 256s104.4 233 233 233 233-104.4 233-233S384.6 23 256 23zm0 18c118.8 0 215 96.2 215 215s-96.2 215-215 215S41 374.8 41 256 137.2 41 256 41zm-26.2 30.98c-31.1 8.77-64.1 25.12-91 48.92 7.6 4.3 15.1 9.1 22.4 14.4 25.1-23.5 57.6-42.36 98.3-51.26-11.1-6.71-22-10.88-29.7-12.06zm49.3 26.85c-44.2 6.27-78.1 24.37-103.7 47.87 10.3 9.1 19.8 19.4 28.1 30.8 21.2-18 52.5-31.9 99-39.5-3.1-15.4-12.3-28.7-23.4-39.17zM125.3 134.1c-20.8 22.4-36.08 50.3-41.05 83.4 2.11 12.3 5.86 22.7 10.71 31.6 6.74-26.9 19.74-57.2 40.54-85 4-5.4 8.3-10.6 12.9-15.7-7.5-5.5-15.3-10.2-23.1-14.3zm37.3 25.5c-4.6 4.9-8.8 10-12.7 15.3-23.1 30.9-35.9 65.9-40.6 93.5 14.7 14.7 33 22 48.5 24.8 2.5-37.7 8.2-74.2 32.8-102.9-8.1-11.4-17.6-21.7-28-30.7zM444 273.5c-32.6 72.6-111.1 153.4-219 156 8.1 9.1 49.8 18.1 76.5 9 93.4-31.8 129.1-119.3 142.5-165z" />
            </svg>
          </span>
          <span className="radio-label">
            Solid
            {!loading && (<span className="price-tag">${getPriceForType(2)}</span>)}
          </span>
        </span>
      </label>
    </div>
  );
};

// Add some CSS for the price tag
const style = document.createElement('style');
style.textContent = `
  .price-tag {
    display: block;
    font-size: 0.85em;
    color: #FFD700;
    margin-top: 4px;
  }
  
  .radio-tile:hover .price-tag {
    color: inherit;
  }
`;
document.head.appendChild(style);

export default ToggleEngine;
