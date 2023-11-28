// Home.js
import React, { useEffect, useState, useRef } from "react";
import MapComponent from "./MapComponent";
import worker_script from "./tspWorker";

const Home = () => {
  const [positions, setPositions] = useState([]);
  const [isSelecting, setIsSelecting] = useState(false);
  const [locationNames, setLocationNames] = useState([]);
  const [data, setData] = useState([]);

  const workerRef = useRef(null);

  const handleSelectClick = () => {
    setIsSelecting(!isSelecting);
  };

  const handleMapClick = async (event) => {
    if (isSelecting) {
      setPositions((prevPositions) => [...prevPositions, event.coordinate]);

      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${event.coordinate[1]}&lon=${event.coordinate[0]}`
        );
        const data = await response.json();
        const locationName = data.display_name;
        setLocationNames((prevLocationNames) => [
          ...prevLocationNames,
          locationName,
        ]);
      } catch (error) {
        console.error("Error:", error);
      }
    } else {
      alert("Choosing locations? Consider 'Start Selecting' button.");
    }
  };

  const handleSimulateClick = () => {
    console.log("Simulate button clicked");
    workerRef.current.postMessage({
      action: "simulateAndAnimate",
      data: positions,
    });
  };

  useEffect(() => {
    workerRef.current = new Worker(worker_script);

    workerRef.current.onmessage = (event) => {
      console.log("Message from worker:", event.data);
      const { action, result } = event.data;

      if (action === "tspResult") {
        console.log("TSP Result:", result);
        setData(result);
      }
    };

    workerRef.current.onerror = (error) => {
      console.error("Worker error:", error);
    };

    return () => {
      workerRef.current.terminate();
    };
  }, [positions]); // Include positions in the dependency array

  return (
    <div>
      <button
        style={{
          opacity: "1",
          transition: "opacity 0.2s ease-in-out",
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
          backgroundColor: "green",
          color: "white",
          border: "2px solid white",
          padding: "10px",
          width: "50%",
        }}
        defaultValue="Selected Locations"
      >
        <option value="Selected Locations" disabled>
          Selected Locations
        </option>
        {locationNames.map((locationName, index) => (
          <option key={index} value={locationName}>
            {locationName}
          </option>
        ))}
      </select>

      <MapComponent onClick={handleMapClick} data={data} />
    </div>
  );
};

export default Home;
