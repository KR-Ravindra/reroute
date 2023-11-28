self.onmessage = (event) => {
  const locations = event.data;
  const result = twoOpt(locations);
  self.postMessage(result);
};

function twoOpt(locations) {
  let improvement = true;
  while (improvement) {
    improvement = false;
    for (let i = 0; i < locations.length - 1; i++) {
      for (let j = i + 2; j < locations.length; j++) {
        if (j - i === 1) continue;
        if (distance(locations[i], locations[i + 1]) + distance(locations[j - 1], locations[j]) > distance(locations[i], locations[j]) + distance(locations[i + 1], locations[j - 1])) {
          locations = twoOptSwap(locations, i + 1, j);
          improvement = true;
        }
      }
    }
  }
  return locations;
}

function twoOptSwap(locations, i, j) {
  let newLocations = locations.slice(0, i);
  let middle = locations.slice(i, j).reverse();
  let end = locations.slice(j);
  return newLocations.concat(middle, end);
}

function distance(a, b) {
  return Math.sqrt(Math.pow(a[0] - b[0], 2) + Math.pow(a[1] - b[1], 2));
}