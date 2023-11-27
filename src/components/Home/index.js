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
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [flash, setFlash] = useState(false);


  useEffect(() => {
    fetchSuggestions();
  }, [searchTerm]);
  useEffect(() => {
    if (flash) {
      const timer = setTimeout(() => {
        setFlash(false); 
      }, 500);
      return () => clearTimeout(timer); 
    }
  }, [flash]);

  const fetchSuggestions = async () => {
    if (searchTerm.length < 3) {
      setSuggestions([]);
      return;
    }

    const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${searchTerm}`);
    const data = await response.json();
  
    setSuggestions(data);
  };

  const handleSelectClick = () => {
    setIsSelecting(!isSelecting);
  };

  const handleClearClick = () => {
    setIsSelecting(false);
    setPositions([]);
    setLocationNames([]);
    setData([]);
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
        setData((prevData) => [
          ...prevData,
          {
            sourcePosition: event.coordinate,
            targetPosition: event.coordinate,
          }
        ]);
      })
      .catch(error => console.error('Error:', error));
    } else {
      alert("Choosing locations? Consider 'Start Selecting' button.");
    }
  };

  const handleListItemClick = (suggestion) => {
    setPositions((prevPositions) => [...prevPositions, [parseFloat(suggestion.lon), parseFloat(suggestion.lat)]]);
    setData((prevData) => [
      ...prevData,
      {
        sourcePosition: [parseFloat(suggestion.lon), parseFloat(suggestion.lat)],
        targetPosition: [parseFloat(suggestion.lon), parseFloat(suggestion.lat)],
      }
    ]);
    console.log("Updated data is ", data)
    fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${suggestion.lat}&lon=${suggestion.lon}`)
      .then(response => response.json())
      .then(data => {
        const locationName = data.display_name;
        setLocationNames((locationNames) => {
          if (locationNames.includes(locationName)) {
            return locationNames;
          } else {
            setFlash(true);
            return [...locationNames, locationName];
          }
        });
        setSuggestions([]);
        setSearchTerm('');
      })
      .catch(error => console.error('Error:', error));
  };


  const handleSimulateClick = () => {
    console.log("Simulation Clicked");
    setIsSelecting(false);
    animateData(data, setData, positions);
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
          width: "25%",
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
          backgroundColor: flash ? 'red' : 'green',
          color: "white",
          border: "2px solid white",
          padding: "10px",
          width: "50%",
        }}
      >
        <option value="Selected Locations" disabled selected>
          {locationNames.length} Locations Selected
        </option>
        {locationNames.map((locationName, index) => (
          <option key={index} value={locationName}>
            {locationName}
          </option>
        ))}
      </select>
      <button
        style={{
          opacity: "1",
          transition: "opacity 0.2s ease-in-out",
          ":active": { opacity: "0.5" },
          backgroundColor: "red",
          color: "white",
          border: "2px solid white",
          padding: "10px",
          width: "25%",
        }}
        onClick={handleClearClick}
      >
        Clear Selection
      </button>
      <input
        type="text"
        style={{
          opacity: "1",
          transition: "opacity 0.2s ease-in-out",
          ":active": { opacity: "0.5" },
          backgroundColor: "white",
          color: "green",
          border: "none",
          padding: "10px",
          width: "99%",
        }}
        placeholder="Search locations..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <ul style={{
          opacity: "1",
          transition: "opacity 0.2s ease-in-out",
          ":active": { opacity: "0.5" },
          backgroundColor: "green",
          color: "white",
          border: "1px solid green",
          width: "99%",
          textAlign: "left",
          margin: "0"
       }} > 
      {suggestions.map((suggestion) => (
        <li key={suggestion.id} style={{ listStyleType: 'none', cursor: 'pointer' }} onClick={() => handleListItemClick(suggestion)}>{suggestion.display_name}</li>
      ))}
      </ul>
      <div style={{  overflow: 'hidden' }}>
      <MapComponent onClick={handleMapClick} data={data}></MapComponent>
    </div>
    </div>
  );
}

export default Home;
