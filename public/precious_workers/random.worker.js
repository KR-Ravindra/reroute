self.onmessage = (event) => {
  const locations = event.data;
  const result = randomWalk(locations);
  self.postMessage(result);
};

function randomWalk(locations) {
  let remainingLocations = locations.slice();
  let route = [remainingLocations.splice(Math.floor(Math.random() * remainingLocations.length), 1)[0]]; // start at a random location

  while (remainingLocations.length > 0) {
    let nextLocationIndex = Math.floor(Math.random() * remainingLocations.length);
    route.push(remainingLocations.splice(nextLocationIndex, 1)[0]);
  }

  return route;
}
