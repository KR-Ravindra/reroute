self.onmessage = (event) => {
    const locations = event.data;
    const route = calculateRoute(locations);
    self.postMessage(route);
  };
  
  function calculateRoute(locations) {
    const remainingLocations = [...locations];
    const route = [remainingLocations.shift()];
  
    while (remainingLocations.length > 0) {
      let closestLocationIndex;
      let closestLocationDistance = Infinity;
  
      for (let i = 0; i < remainingLocations.length; i++) {
        const distance = calculateDistance(route[route.length - 1], remainingLocations[i]);
        if (distance < closestLocationDistance) {
          closestLocationIndex = i;
          closestLocationDistance = distance;
        }
      }
  
      route.push(remainingLocations.splice(closestLocationIndex, 1)[0]);
    }
  
    return route;
  }
  
  function calculateDistance(location1, location2) {
    const [lon1, lat1] = location1.position;
    const [lon2, lat2] = location2.position;
    const R = 6371e3; // Radius of the Earth in metres
    const φ1 = lat1 * Math.PI/180; // φ, λ in radians
    const φ2 = lat2 * Math.PI/180;
    const Δφ = (lat2-lat1) * Math.PI/180;
    const Δλ = (lon2-lon1) * Math.PI/180;
  
    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  
    const d = R * c; // in metres
    return d;
  }