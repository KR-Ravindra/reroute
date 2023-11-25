export function animateData(setData) {
    // Set initial data (Ohio to Los Angeles)
    setData([
      { sourcePosition: [-82.9988, 39.9612], targetPosition: [-118.2437, 34.0522] }
    ]);
  
    // After one second, change destination to San Francisco
    setTimeout(() => {
      setData([
        { sourcePosition: [-82.9988, 39.9612], targetPosition: [-122.41669, 37.7853] }
      ]);
    }, 1000);
  }