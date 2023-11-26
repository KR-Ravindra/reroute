import { Permutation } from "js-combinatorics";
import haversine from "haversine-distance";

export function animateData(setData, positions) {
  setTimeout(() => {
    setData([]);
  });

    // positions = [
    //   [40.7128, -74.006], // New York
    //   [34.0522, -118.2437], // Los Angeles
    //   [41.8781, -87.6298], // Chicago
    //   [29.7604, -95.3698], // Houston
    //   [33.4484, -112.074], // Phoenix
    //   [29.4241, -98.4936], // San Antonio
    //   [32.7157, -117.1611], // San Diego
    //   [32.7767, -96.797], // Dallas
    //   [37.7749, -122.4194], // San Francisco
    //   [30.3322, -81.6557], // Jacksonville
    //   [39.9526, -75.1652], // Philadelphia
      //  [39.7684, -86.1581] , // Indianapolis
      //  [37.5407, -77.4360] , // Richmond
      //  [39.7392, -104.9903] , // Denver
      //  [42.3601, -71.0589] , // Boston
      //  [35.2271, -80.8431] , // Charlotte
      //  [47.6062, -122.3321] , // Seattle
      //  [38.9072, -77.0369] , // Washington D.C.
      //  [35.1495, -90.0490] , // Memphis
      //  [36.1627, -86.7816] , // Nashville
      //  [45.5051, -122.6750] , // Portland
      //  [39.1031, -84.5120] , // Cincinnati
      //  [39.2904, -76.6122] , // Baltimore
      //  [43.0389, -87.9065] , // Milwaukee
      //  [35.4676, -97.5164] , // Oklahoma City
      //  [44.9778, -93.2650] , // Minneapolis
      //  [33.7490, -84.3880] , // Atlanta
      //  [38.2527, -85.7585] , // Louisville
      //  [36.1699, -115.1398] , // Las Vegas
      //  [39.9612, -82.9988] , // Columbus
      //  [30.2672, -97.7431] , // Austin
      //  [41.2565, -95.9345] , // Omaha
      //  [35.0844, -106.6504] , // Albuquerque
      //  [42.3314, -83.0458] , // Detroit
      //  [36.7372, -119.7871] , // Fresno
      //  [35.7796, -78.6382] , // Raleigh
      //  [38.5816, -121.4944] , // Sacramento
      //  [39.0997, -94.5786] , // Kansas City
      //  [27.9506, -82.4572] , // Tampa
      //  [36.8529, -75.9780] , // Virginia Beach
      //  [33.5207, -86.8025] , // Birmingham
      //  [43.6150, -116.2023] , // Boise
      //  [32.2226, -110.9747] , // Tucson
      //  [35.9940, -78.8986] , // Durham
      //  [41.8780, -93.0977] , // Des Moines
      //  [33.4735, -82.0105] , // Augusta
      //  [32.7765, -79.9311] , // Charleston
      //  [44.0805, -103.2310] , // Rapid City
      //  [39.5296, -119.8138] , // Reno
      //  [32.0809, -81.0912] , // Savannah
      //  [43.5495, -96.7003] , // Sioux Falls
      //  [44.9537, -93.0900] , // St. Paul
      //  [42.7325, -84.5555] , // Lansing
      //  [41.5067, -90.5151] , // Davenport
      //  [41.7606, -88.3201] , // Aurora
// ]

console.log("Positions are", positions)

  const locations = positions.map((position) => ({ position }));
  console.log(locations);

  // Convert locations to data format and set data
  locations.forEach((location, index) => {

      const newData = {
        sourcePosition: location.position,
        targetPosition: location.position,
      };
      setData((prevData) => [...prevData, newData]);

  });

  const calculateDistance = (location1, location2) => {
    return haversine(location1.position, location2.position);
  };

  const permutations = new Permutation(locations.slice(1)).toArray();
  permutations.forEach((permutation) => permutation.unshift(locations[0]));

  let shortestDistance = Infinity;
  let shortestRoute = null;

  permutations.forEach((permutation) => {
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
      setData((prevData) => [
        ...prevData,
        {
          sourcePosition: location.position,
          targetPosition: shortestRoute[i + 1]?.position || location.position,
        },
      ]);
    }, i * 1000);
  });
}
