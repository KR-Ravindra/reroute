import React, { useEffect, useState } from 'react';
import DeckGL from '@deck.gl/react';
import { LineLayer } from '@deck.gl/layers';
import { Map } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { MapView, FirstPersonView } from '@deck.gl/core';

const MAPBOX_ACCESS_TOKEN = 'pk.eyJ1IjoicGFsbGF2aWtoZWRsZSIsImEiOiJjbHBkZGR6ajMwdTJoMnFuNzYxZHRrZGprIn0.JMx-nFt9QpuKjZ4KHXcNXg';
const INITIAL_VIEW_STATE = {
  longitude: -122.41669,
  latitude: 37.7853,
  zoom: 15,
  pitch: 0,
  bearing: 0
};

const data = [
  { sourcePosition: [-122.41669, 37.7853], targetPosition: [-122.41669, 37.781] }
];

function HomePage() {
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!MAPBOX_ACCESS_TOKEN || MAPBOX_ACCESS_TOKEN === 'YOUR_MAPBOX_ACCESS_TOKEN') {
      setError('Mapbox access token is missing or invalid. Please provide a valid token.');
    }
  }, []);

  const layers = [
    new LineLayer({
      id: 'line-layer',
      data,
      getColor: [255, 0, 0],
      getWidth: 5
    })
  ];

  const containerStyle = {
    position: 'relative',
    background: 'black',
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
      >
      <MapView id="map" controller={true}>
        <Map mapboxAccessToken={MAPBOX_ACCESS_TOKEN} mapStyle="mapbox://styles/mapbox/streets-v11" />
      </MapView>
    </DeckGL>
    </div>
  );
}

export default HomePage;
