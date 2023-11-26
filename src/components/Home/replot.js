import { Permutation } from "js-combinatorics";
import haversine from "haversine-distance";
export function animateData(setData, positions) {
  setTimeout(() => {
    setData([]);
  });
  console.log("Positions are", positions)
  const locations = positions.map((position) => ({ position }));
  console.log(locations);

  // Convert locations to data format and set data
  locations.forEach((location, index) => {
    setTimeout(() => {
      // Add the current location to data
      setData((prevData) => [
        ...prevData,
        {
          sourcePosition: location.position,
          targetPosition: location.position,
        },
      ]);

      // If there is a next location, add a line connecting the current and next locations
      if (index < locations.length - 1) {
        const nextLocation = locations[index + 1];
        setData((prevData) => [
          ...prevData,
          {
            sourcePosition: location.position,
            targetPosition: nextLocation.position,
          },
        ]);
      }
    }, index * 1000);
  });
}
