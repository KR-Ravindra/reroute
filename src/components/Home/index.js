import React, { useEffect, useState } from "react";
import MapComponent from "./MapComponent";
import { animateData } from "./replot";
import axios from "axios";

const MAPBOX_ACCESS_TOKEN =
  "pk.eyJ1IjoicGFsbGF2aWtoZWRsZSIsImEiOiJjbHBkZGR6ajMwdTJoMnFuNzYxZHRrZGprIn0.JMx-nFt9QpuKjZ4KHXcNXg";
function Home() {
  const [error, setError] = useState(null);
  const [data, setData] = useState([]);
  const [positions, setPositions] = useState([]);
  const [isSelecting, setIsSelecting] = useState(false);
  const [locationNames, setLocationNames] = useState([]);
  const handleSelectClick = () => {
    setIsSelecting(!isSelecting);
  };

  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const handleMapClick = async (event) => {
    if (isSelecting) {
      setPositions((prevPositions) => {
        const newPositions = [...prevPositions, event.coordinate];
        console.log('New Positions:', newPositions);
        return newPositions;
      });
    }
  
    // Process batch geocoding only if there are coordinates and not already processing
    if (positions.length > 0 && !isSelecting) {
      const throttleDelay = 500;
  
      for (let index = 0; index < positions.length; index++) {
        const position = positions[index];
        try {
          const response = await axios.get(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${position[1]}&lon=${position[0]}`
          );
          const locationName = response.data.display_name;
  
          setLocationNames((prevLocationNames) => [...prevLocationNames, locationName]);
        } catch (error) {
          console.error('Error during batch geocoding:', error);
        }
  
        // Throttle the requests
        await delay(throttleDelay);
      }
    }
  };
  
  
  

  const handleSimulateClick = () => {
    console.log("Simulation Clicked");
    animateData(setData, positions);
  };

  return (
    <div>
      <button
        style={{
          opacity: "1",
          transition: "opacity 0.2s ease-in-out",
          ":active": { opacity: "0.5" },
          backgroundColor: "green",
          color: "white",
          border: "none",
          padding: "10px",
          width: "100%",
        }}
        onClick={handleSimulateClick}
      >
        Simulate
      </button>
      <button
        style={{
          opacity: "1",
          transition: "opacity 0.2s ease-in-out",
          ":active": { opacity: "0.5" },
          backgroundColor: isSelecting ? "red" : "green",
          color: "white",
          border: "none",
          padding: "10px",
          width: "50%",
        }}
        onClick={handleSelectClick}
      >
        {isSelecting ? "Stop Selecting" : "Start Selecting"}
      </button>

      <select
        style={{
          opacity: "1",
          transition: "opacity 0.2s ease-in-out",
          ":active": { opacity: "0.5" },
          backgroundColor: "green",
          color: "white",
          border: "2px solid white",
          padding: "10px",
          width: "50%",
        }}
      >
        <option value="Selected Locations" disabled selected>
          Selected Locations
        </option>
        {locationNames.map((locationName, index) => (
          <option key={index} value={locationName}>
            {locationName}
          </option>
        ))}
      </select>

      <MapComponent onClick={handleMapClick} data={data}></MapComponent>
    </div>
  );
}

export default Home;
