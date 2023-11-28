import React, { useEffect, useState } from "react";
import MapComponent from "./MapComponent";
// import tspWorker from './tspWorker';


const tspWorker = new Worker('./tspWorker.js');


function Home() {
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
    
    if (typeof(Worker) !== "undefined") {
      if (typeof(tspWorker) === "undefined") {
        tspWorker = new Worker("tspWorker.js");
      }
  
      console.log("Before postMessage",tspWorker);
  
      tspWorker.onmessage = function(event) {
        let response = event.data;
        if(response.redirectURL) {
          window.location.href = response.redirectURL;
        } else {
          // Process response
          console.log('Process response');
        }
      };
  
      tspWorker.postMessage({ action: 'simulateAndAnimate', data: positions });
  
      console.log("After postMessage",tspWorker);
    } else {
      console.log('Web Workers are not supported in this browser');
    }
  };

  useEffect(() => {
    const messageHandler = (event) => {
        const { action, result } = event.data;
        console.log('Handler Action:', action);
        if (action === 'tspResult') {
            console.log('TSP Result:', result);
            setData(result);
        }
    };

    tspWorker.addEventListener('message', messageHandler);

    return () => {
        tspWorker.removeEventListener('message', messageHandler);
        tspWorker.terminate();
    };
}, [positions, data]);

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
        onClick={() => handleSimulateClick()}
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
