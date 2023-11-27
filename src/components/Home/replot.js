export function animateData(data, setData, positions) {
  console.log("Positions are", positions)
  const locations = positions.map((position) => ({ position }));
  console.log(locations);


  // Convert locations to data format and set data
  locations.forEach((location, index) => {
    setTimeout(() => {
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
      if (index === locations.length - 1) {
        setData((prevData) => [
          ...prevData,
          {
            sourcePosition: location.position,
            targetPosition: locations[0].position,
          },
        ]);
      }
    }, index * 1000);
  });
}
