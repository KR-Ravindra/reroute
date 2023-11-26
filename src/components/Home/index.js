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

  const handleMapClick = async (event) => {
    if (isSelecting) {
      setPositions((prevPositions) => {
        const newPositions = [...prevPositions, event.coordinate];
        console.log(newPositions);
        return newPositions;
      });

      fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${event.coordinate[1]}&lon=${event.coordinate[0]}`)
      .then(response => response.json())
      .then(data => {
        const locationName = data.display_name;
        setLocationNames((prevLocationNames) => [
          ...prevLocationNames,
          locationName,
        ]);
      })
      .catch(error => console.error('Error:', error));
    } else {
      alert("Choosing locations? Consider 'Start Selecting' button.");
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
