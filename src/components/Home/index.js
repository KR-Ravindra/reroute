import React, { useEffect, useState } from 'react';
import MapComponent from './MapComponent';
import { animateData } from './replot';


function Home() {
  const [error, setError] = useState(null);
  const [data, setData] = useState([]);
  const [positions, setPositions] = useState([]);
  const [isSelecting, setIsSelecting] = useState(false);
  const handleSelectClick = () => {
    setIsSelecting(!isSelecting);
  };

  const handleMapClick = (event) => {
    if (isSelecting) {
      setPositions([...positions, event.latlng]);
    }
  };

  const handleSimulateClick = () => {
    animateData(setData);
  }

  return (
    <div>
      <button 
        style={{ 
          opacity: '1', 
          transition: 'opacity 0.2s ease-in-out', 
          ':active': { opacity: '0.5' },
          backgroundColor: 'green',
          color: 'white',
          border: 'none',
          padding: '10px',
          width: '100%',
        }} 
        onClick={handleSimulateClick}
      >
        Simulate
      </button>
      <button 
        style={{ 
          opacity: '1', 
          transition: 'opacity 0.2s ease-in-out', 
          ':active': { opacity: '0.5' },
          backgroundColor: isSelecting ? 'red' : 'green',
          color: 'white',
          border: 'none',
          padding: '10px',
          width: '100%',
        }} 
        onClick={handleSelectClick}
      >
        {isSelecting ? 'Stop Selecting' : 'Start Selecting'}
      </button>
      <MapComponent data={data}></MapComponent>
    </div>
  );
}

export default Home;