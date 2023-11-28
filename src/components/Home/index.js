import React, { useEffect, useState } from "react";
import MapComponent from "./MapComponent";
import { animateData } from "./replot";
import axios from "axios";

const MAPBOX_ACCESS_TOKEN =
  "pk.eyJ1IjoicGFsbGF2aWtoZWRsZSIsImEiOiJjbHBkZGR6ajMwdTJoMnFuNzYxZHRrZGprIn0.JMx-nFt9QpuKjZ4KHXcNXg";
function Home() {
  const [error, setError] = useState(null);
  const [data, setData] = useState([]);
  const [positions, setPositions] = useState([
    [-118.2437, 34.0522], // Los Angeles, CA
    [-74.006, 40.7128], // New York, NY
    [-87.6298, 41.8781], // Chicago, IL
    [-95.3698, 29.7604], // Houston, TX
    [-112.074, 33.4484], // Phoenix, AZ
    [-75.1652, 39.9526], // Philadelphia, PA
    [-98.4936, 29.4241], // San Antonio, TX
    [-117.1611, 32.7157], // San Diego, CA
    [-96.797, 32.7767], // Dallas, TX
    [-122.4194, 37.7749], // San Francisco, CA
    [-122.675, 45.5051], // Portland, OR
    [-84.388, 33.749], // Atlanta, GA
    [-80.1918, 25.7617], // Miami, FL
    [-93.265, 44.9778], // Minneapolis, MN
    [-118.7606, 34.1816], // Thousand Oaks, CA
    [-82.9988, 39.9612], // Columbus, OH
    [-76.6122, 39.2904], // Baltimore, MD
    [-80.8431, 35.2271], // Charlotte, NC
    [-111.891, 40.7608], // Salt Lake City, UT
    [-79.9959, 40.4406], // Pittsburgh, PA
    [-83.0007, 39.9612], // Columbus, OH
    [-84.512, 39.1031], // Cincinnati, OH
    [-94.5786, 39.0997], // Kansas City, MO
    [-76.2859, 36.8508], // Norfolk, VA
    [-81.3792, 28.5383], // Orlando, FL
    [-80.1918, 25.7617], // Miami, FL
    [-97.7431, 30.2672], // Austin, TX
    [-73.5673, 45.5017], // Montreal, QC, Canada
    [-79.3832, 43.6532], // Toronto, ON, Canada
    [-123.1216, 49.2827], // Vancouver, BC, Canada
    [-75.6972, 45.4215], // Ottawa, ON, Canada
    [-66.6486, 45.9636], // Fredericton, NB, Canada
    [-63.5724, 44.6511], // Halifax, NS, Canada
    [-130.3201, 54.315], // Prince Rupert, BC, Canada
    [-135.0568, 60.7212], // Whitehorse, YT, Canada
    [-114.0719, 51.0447], // Calgary, AB, Canada
    [-113.4909, 53.5444], // Edmonton, AB, Canada
    [-106.67, 52.1318], // Saskatoon, SK, Canada
    [-100.346, 48.8137], // Minot, ND
    [-90.1994, 38.627], // St. Louis, MO
    [-85.7585, 38.2527], // Louisville, KY
    [-94.3822, 35.4676], // Fort Smith, AR
    [-92.2896, 34.7465], // Little Rock, AR
    [-71.4128, 41.824], // Providence, RI
    [-106.6504, 35.0844], // Albuquerque, NM
    [-115.1398, 36.1699], // Las Vegas, NV
    [-90.1994, 38.627], // St. Louis, MO
    [-97.7431, 30.2672], // Austin, TX
    [-110.9265, 32.2226], // Tucson, AZ
    [-81.6557, 30.3322], // Jacksonville, FL
    [-86.1581, 39.7684], // Indianapolis, IN
    [-77.436, 37.5407], // Richmond, VA
    [-80.8431, 35.2271], // Charlotte, NC
    [-122.3321, 47.6062], // Seattle, WA
    [-104.9903, 39.7392], // Denver, CO
    [-71.0589, 42.3601], // Boston, MA
    [-86.7816, 36.1627], // Nashville, TN
    [-83.0458, 42.3314], // Detroit, MI
  ]);
  const [isSelecting, setIsSelecting] = useState(false);
  const [locationNames, setLocationNames] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [flash, setFlash] = useState(false);
  const [selectedAlgorithm, setSelectedAlgorithm] =
    useState("furthest_insertion");
  const availableAlgorithms = [
    "arbitary_insertion",
    "convex_hull",
    "furthest_insertion",
    "nearest_neighbour",
    "simulated_annealing",
    "two_opt_inversion",
    "random",
  ];
  const [speed, setSpeed] = useState(0.5);
  const availableSpeeds = [0.1, 0.25, 0.5, 0.7, 1, 2, 2.5, 3, 4];
  const [route, setFinalRoute] = useState("");
  const [fileUrl, setFileUrl] = useState(null);


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
  useEffect(() => {
    if (route) {
      const fileContent = 'Best Route: ' + route + '\n\n' + locationNames.map((locationName, index) => `locationID: ${index}, locationName: ${locationName}`).join('\n');
      const blob = new Blob([fileContent], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
  
      const link = document.createElement('a');
      link.href = url;
      link.download = 'locations.txt';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }, [route]);
  const fetchSuggestions = async () => {
    if (searchTerm.length < 3) {
      setSuggestions([]);
      return;
    }

    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${searchTerm}`
    );
    const data = await response.json();

    setSuggestions(data);
  };

  const handleSelectClick = () => {
    setPositions([]);
    setIsSelecting(!isSelecting);
  };

  const handleClearPlotClick = () => {
    setIsSelecting(false);
    setFinalRoute("");
    setData([]);
    const newData = positions.map((position) => ({
      ...position,
      sourceDestination: position,
      target: position,
    }));
    setData([newData]);
  };

  const handleClearClick = () => {
    setIsSelecting(false);
    setFinalRoute("");
    setPositions([
      [-118.2437, 34.0522], // Los Angeles, CA
      [-74.006, 40.7128], // New York, NY
      [-87.6298, 41.8781], // Chicago, IL
      [-95.3698, 29.7604], // Houston, TX
      [-112.074, 33.4484], // Phoenix, AZ
      [-75.1652, 39.9526], // Philadelphia, PA
      [-98.4936, 29.4241], // San Antonio, TX
      [-117.1611, 32.7157], // San Diego, CA
      [-96.797, 32.7767], // Dallas, TX
      [-122.4194, 37.7749], // San Francisco, CA
      [-122.675, 45.5051], // Portland, OR
      [-84.388, 33.749], // Atlanta, GA
      [-80.1918, 25.7617], // Miami, FL
      [-93.265, 44.9778], // Minneapolis, MN
      [-118.7606, 34.1816], // Thousand Oaks, CA
      [-82.9988, 39.9612], // Columbus, OH
      [-76.6122, 39.2904], // Baltimore, MD
      [-80.8431, 35.2271], // Charlotte, NC
      [-111.891, 40.7608], // Salt Lake City, UT
      [-79.9959, 40.4406], // Pittsburgh, PA
      [-83.0007, 39.9612], // Columbus, OH
      [-84.512, 39.1031], // Cincinnati, OH
      [-94.5786, 39.0997], // Kansas City, MO
      [-76.2859, 36.8508], // Norfolk, VA
      [-81.3792, 28.5383], // Orlando, FL
      [-80.1918, 25.7617], // Miami, FL
      [-97.7431, 30.2672], // Austin, TX
      [-73.5673, 45.5017], // Montreal, QC, Canada
      [-79.3832, 43.6532], // Toronto, ON, Canada
      [-123.1216, 49.2827], // Vancouver, BC, Canada
      [-75.6972, 45.4215], // Ottawa, ON, Canada
      [-66.6486, 45.9636], // Fredericton, NB, Canada
      [-63.5724, 44.6511], // Halifax, NS, Canada
      [-130.3201, 54.315], // Prince Rupert, BC, Canada
      [-135.0568, 60.7212], // Whitehorse, YT, Canada
      [-114.0719, 51.0447], // Calgary, AB, Canada
      [-113.4909, 53.5444], // Edmonton, AB, Canada
      [-106.67, 52.1318], // Saskatoon, SK, Canada
      [-100.346, 48.8137], // Minot, ND
      [-90.1994, 38.627], // St. Louis, MO
      [-85.7585, 38.2527], // Louisville, KY
      [-94.3822, 35.4676], // Fort Smith, AR
      [-92.2896, 34.7465], // Little Rock, AR
      [-71.4128, 41.824], // Providence, RI
      [-106.6504, 35.0844], // Albuquerque, NM
      [-115.1398, 36.1699], // Las Vegas, NV
      [-90.1994, 38.627], // St. Louis, MO
      [-97.7431, 30.2672], // Austin, TX
      [-110.9265, 32.2226], // Tucson, AZ
      [-81.6557, 30.3322], // Jacksonville, FL
      [-86.1581, 39.7684], // Indianapolis, IN
      [-77.436, 37.5407], // Richmond, VA
      [-80.8431, 35.2271], // Charlotte, NC
      [-122.3321, 47.6062], // Seattle, WA
      [-104.9903, 39.7392], // Denver, CO
      [-71.0589, 42.3601], // Boston, MA
      [-86.7816, 36.1627], // Nashville, TN
      [-83.0458, 42.3314], // Detroit, MI
    ]);
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

      fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${event.coordinate[1]}&lon=${event.coordinate[0]}`
      )
        .then((response) => response.json())
        .then((data) => {
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
            },
          ]);
        })
        .catch((error) => console.error("Error:", error));
    } else {
      alert("Choosing locations? Consider 'Start Selecting' button.");
    }
  };

  const handleListItemClick = (suggestion) => {
    setPositions((prevPositions) => [
      ...prevPositions,
      [parseFloat(suggestion.lon), parseFloat(suggestion.lat)],
    ]);
    setData((prevData) => [
      ...prevData,
      {
        sourcePosition: [
          parseFloat(suggestion.lon),
          parseFloat(suggestion.lat),
        ],
        targetPosition: [
          parseFloat(suggestion.lon),
          parseFloat(suggestion.lat),
        ],
      },
    ]);
    console.log("Updated data is ", data);
    fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${suggestion.lat}&lon=${suggestion.lon}`
    )
      .then((response) => response.json())
      .then((data) => {
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
        setSearchTerm("");
      })
      .catch((error) => console.error("Error:", error));
  };

  const handleDemoClick = () => {
    console.log("Demo Clicked");
    setIsSelecting(false);
    setData([]);
    console.log("Positions of evaluation are", positions);
    positions.forEach((position, index) => {
      setData((prevData) => [
        ...prevData,
        {
          sourcePosition: position,
          targetPosition: position,
          id: index,
        },
      ]);
    });
    animateData(speed, data, setData, positions, selectedAlgorithm, setFinalRoute);
  };

  const handleSimulateClick = () => {
    console.log("Simulation Clicked");
    setIsSelecting(false);
    animateData(speed, data, setData, positions, selectedAlgorithm, setFinalRoute);
  };

  return (
<div style={{ overflow: 'hidden', overflowy: 'hidden' }}>
      <button
        style={{
          opacity: "1",
          transition: "opacity 0.2s ease-in-out",
          ":active": { opacity: "0.5" },
          backgroundColor: "green",
          color: "white",
          border: "none",
          padding: "10px",
          width: "43%",
        }}
        onClick={handleSimulateClick}
      >
        Simulate
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
          width: "25%",
        }}
        onChange={(event) => setSelectedAlgorithm(event.target.value)}
      >
        <option value="Algorithm Choice" disabled selected>
          Algorithm Choice
        </option>
        {availableAlgorithms.map((algorithmName, index) => (
          <option key={index} value={algorithmName}>
            {algorithmName}
          </option>
        ))}
      </select>
      <select
        style={{
          opacity: "1",
          transition: "opacity 0.2s ease-in-out",
          ":active": { opacity: "0.5" },
          backgroundColor: flash ? "red" : "green",
          color: "white",
          border: "2px solid white",
          padding: "10px",
          width: "7%",
        }}
        onChange={(event) => setSpeed(event.target.value)}
      >
        <option value="Speed" disabled selected>
          1x
        </option>
        {availableSpeeds.map((speed, index) => (
          <option key={index} value={speed}>
            {speed}
          </option>
        ))}
      </select>
      <button
        style={{
          opacity: "1",
          transition: "opacity 0.2s ease-in-out",
          ":active": { opacity: "0.5" },
          backgroundColor: "green",
          color: "white",
          border: "2px solid white",
          padding: "10px",
          width: "25%",
        }}
        onClick={handleDemoClick}
      >
        Demo Input Simulation
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
          backgroundColor: flash ? "red" : "green",
          color: "white",
          border: "2px solid white",
          padding: "10px",
          width: "50%",
        }}
      >
        <option value="Selected Locations" disabled selected>
          {locationNames.length === 0 ? positions.length : locationNames.length}{" "}
          Locations Selected
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
          width: "12.5%",
        }}
        onClick={handleClearPlotClick}
      >
        Clear Plot
      </button>
      <button
        style={{
          opacity: "1",
          transition: "opacity 0.2s ease-in-out",
          ":active": { opacity: "0.5" },
          backgroundColor: "red",
          color: "white",
          border: "2px solid white",
          padding: "10px",
          width: "12.5%",
        }}
        onClick={handleClearClick}
      >
        Clear All
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

      <ul
        style={{
          opacity: "1",
          transition: "opacity 0.2s ease-in-out",
          ":active": { opacity: "0.5" },
          backgroundColor: "green",
          color: "white",
          border: "1px solid green",
          width: "99%",
          textAlign: "left",
          margin: "0",
        }}
      >
        {suggestions.map((suggestion) => (
          <li
            key={suggestion.id}
            style={{ listStyleType: "none", cursor: "pointer" }}
            onClick={() => handleListItemClick(suggestion)}
          >
            {suggestion.display_name}
          </li>
        ))}
      </ul>
      {route && (
        <div style={{ display: "flex", alignItems: "center" }}>
          <p style={{ color: "white", background: "green", margin: "0" }}>
            Final Route:{" "}
          </p>
          <div
            style={{ overflow: "hidden", whiteSpace: "nowrap", width: "100%" }}
          >
            <marquee style={{ color: "black" }}>{route}</marquee>
          </div>
        </div>
      )}
      <div style={{ overflow: "hidden" }}>
        <MapComponent onClick={handleMapClick} data={data}></MapComponent>
      </div>

    </div>
  );
}

export default Home;
