import { Permutation } from 'js-combinatorics';
import haversine from 'haversine-distance';

export function animateData(setData) {
  setTimeout(() => {
    setData([]);
})
  const locations = [
    { position: [-82.9988, 39.9612] }, // Ohio
    { position: [-118.2437, 34.0522] }, // Los Angeles
    { position: [-122.41669, 37.7853] }, // San Francisco
    { position: [-74.0060, 40.7128] }, // New York
    { position: [-87.6298, 41.8781] } // Chicago
  ];

  const calculateDistance = (location1, location2) => {
    return haversine(location1.position, location2.position);
  };

  const permutations = new Permutation(locations.slice(1)).toArray();
  permutations.forEach(permutation => permutation.unshift(locations[0]));

  let shortestDistance = Infinity;
  let shortestRoute = null;

  permutations.forEach(permutation => {
    let totalDistance = 0;
    for (let i = 0; i < permutation.length - 1; i++) {
      totalDistance += calculateDistance(permutation[i], permutation[i + 1]);
    }
    if (totalDistance < shortestDistance) {
      shortestDistance = totalDistance;
      shortestRoute = permutation;
    }
  });

  shortestRoute.forEach((location, i) => {
    setTimeout(() => {
      setData(prevData => [
        ...prevData,
        { sourcePosition: location.position, targetPosition: shortestRoute[i + 1]?.position || location.position }
      ]);
    }, i * 1000);
  });
}