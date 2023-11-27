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
        // 1. do sleep 30 seconds and make website hand 
        // 2. port this sleep loop to 30 seconds to a wroker
        // 3. try to exchange data between worker and main thread
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
