import React, { useEffect, useState } from 'react';
import DeckGL from '@deck.gl/react';
import { LineLayer, ScatterplotLayer } from '@deck.gl/layers';
import { InteractiveMap, Map } from 'react-map-gl';
import { MapView } from '@deck.gl/core';

const MAPBOX_ACCESS_TOKEN = 'pk.eyJ1IjoicGFsbGF2aWtoZWRsZSIsImEiOiJjbHBkZGR6ajMwdTJoMnFuNzYxZHRrZGprIn0.JMx-nFt9QpuKjZ4KHXcNXg';



function MapComponent({onClick, data}) {
  const [error, setError] = useState(null);
  const INITIAL_VIEW_STATE = {
    longitude: -96.5795,
    latitude: 39.8283,
    zoom: 4,
    pitch: 0,
    bearing: 0
  };


  useEffect(() => {
    if (!MAPBOX_ACCESS_TOKEN || MAPBOX_ACCESS_TOKEN === 'YOUR_MAPBOX_ACCESS_TOKEN') {
      setError('Mapbox access token is missing or invalid. Please provide a valid token.');
    }
  }, []);

  const layers = [
    new ScatterplotLayer({
      id: 'scatterplot-layer',
      data,
      getRadius: 19000, // adjust size of circles
      getPosition: d => d.sourcePosition, // use sourcePosition for circle location
      getFillColor: [255, 0, 0], // white fill color
    }),
    new ScatterplotLayer({
      id: 'scatterplot-layer-2',
      data,
      getRadius: 19000, // adjust size of circles
      getPosition: d => d.targetPosition, // use targetPosition for circle location
      getFillColor: [255, 0, 0], // white fill color
    }),
    new LineLayer({
      id: 'line-layer',
      data,
      getColor: [255, 165, 0],
      getWidth: 5
    })
  ];

  const containerStyle = {
    position: 'relative',
    width: '100vw',
    height: '100vh'
  };

  if (error) {
    return <div style={containerStyle}>Error: {error}</div>;
  }

  return (
    <div style={containerStyle}>
      <DeckGL
        initialViewState={INITIAL_VIEW_STATE}
        controller={true}
        layers={layers}
        style={{ width: '100%', height: '100vh' }}
        onClick={onClick}
      >
      <MapView id="map" controller={true}>
        <Map mapboxAccessToken={MAPBOX_ACCESS_TOKEN} mapStyle="mapbox://styles/mapbox/navigation-night-v1" />
      </MapView>
    </DeckGL>
    </div>
  );
}

export default MapComponent;
