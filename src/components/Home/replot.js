export function animateData(speed, data, setData, positions, algorithm, setFinalRoute, fetchedLocationNames) {
  const locations = positions.map((position, index) => ({ id: index, position }));
  let worker;

  switch (algorithm) {
    case 'arbitary_insertion':
      worker = new Worker('precious_workers/arbitaryInsertion.worker.js');
      break;
    case 'nearest_neighbour':
      worker = new Worker('precious_workers/nearestNeighbour.worker.js');
      break;
    case 'furthest_insertion':
      worker = new Worker('precious_workers/furthestInsertion.worker.js');
      break;
    case 'convex_hull':
      worker = new Worker('precious_workers/convexHull.worker.js');
      break;
    case 'simulated_annealing':
      worker = new Worker('precious_workers/simulatedAnnealing.worker.js');
      break;
    case 'two_opt_inversion':
      worker = new Worker('precious_workers/twoOptInversion.worker.js');
      break;
    case 'depth_first_search':
      worker = new Worker('precious_workers/depthFirstSearch.worker.js');
      break;
    case 'random':
      worker = new Worker('precious_workers/random.worker.js');
      break;
    default:
      throw new Error(`Unknown algorithm: ${algorithm}`);
  }

  worker.onmessage = (event) => {
    const route = event.data;
    console.log("Route from ", {algorithm}, " is ", route)
    const routeString = route.map(location => fetchedLocationNames[location.id].split(',').slice(0, 2).join(',') + " ( "+location.id+ " )").join(' -> ');
    setFinalRoute(routeString);
    route.forEach((location, index) => {
      setTimeout(() => {
        setData(prevData => [...prevData, { sourcePosition: location.position, targetPosition: route[(index + 1) % route.length].position }]);
      }, index * speed * 1000);
    });
  };

  worker.postMessage(locations);
}