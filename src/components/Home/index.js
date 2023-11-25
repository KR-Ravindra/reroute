import React, { useEffect, useState } from 'react';
import MapComponent from './MapComponent';
import { animateData } from './replot';


function Home() {
  const [error, setError] = useState(null);
  const [data, setData] = useState([]);

  const handleSimulateClick = () => {
    animateData(setData);
  };
  
  return (
    <div>
      <button 
          style={{ 
            opacity: '1', 
            transition: 'opacity 0.2s ease-in-out', 
            ':active': { opacity: '0.5' },
            backgroundColor: 'green', // add this line
            color: 'white', // this will make the text color white
            border: 'none', // this will remove the default button border
            padding: '10px', // add some padding to the button
            width: '100%', // set a fixed width for the button
          }} 
        onClick={handleSimulateClick}
      >Simulate</button>
      <MapComponent data={data} ></MapComponent>
    </div>
  );
}

export default Home;