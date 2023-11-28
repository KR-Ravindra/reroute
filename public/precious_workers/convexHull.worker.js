self.onmessage = (event) => {
  const locations = event.data;
  let hull = calculateConvexHull(locations.slice()); // create a copy of locations
  let remainingLocations = locations.filter(location => !hull.includes(location));
  while (remainingLocations.length > 0) {
    let minDistance = Infinity;
    let minLocationIndex = -1;
    let minHullIndex = -1;
    for (let i = 0; i < remainingLocations.length; i++) {
      for (let j = 0; j < hull.length; j++) {
        let distance = calculateInsertionDistance(hull, j, remainingLocations[i]);
        if (distance < minDistance) {
          minDistance = distance;
          minLocationIndex = i;
          minHullIndex = j;
        }
      }
    }
    hull.splice(minHullIndex + 1, 0, remainingLocations[minLocationIndex]);
    remainingLocations.splice(minLocationIndex, 1);
  }
  self.postMessage(hull);
};

function calculateInsertionDistance(hull, index, location) {
  let point1 = hull[index];
  let point2 = hull[(index + 1) % hull.length];
  return distance(point1, location) + distance(location, point2) - distance(point1, point2);
}
function calculateConvexHull(locations) {
  if (locations.length < 3) return locations;

  let hull = [];

  let p0Index = 0;
  for (let i = 1; i < locations.length; i++) {
    if (locations[i].position[1] < locations[p0Index].position[1] || 
        (locations[i].position[1] === locations[p0Index].position[1] && locations[i].position[0] < locations[p0Index].position[0])) {
      p0Index = i;
    }
  }

  [locations[0], locations[p0Index]] = [locations[p0Index], locations[0]];

  locations.sort((a, b) => {
    const dx1 = a.position[0] - locations[0].position[0];
    const dy1 = a.position[1] - locations[0].position[1];
    const dx2 = b.position[0] - locations[0].position[0];
    const dy2 = b.position[1] - locations[0].position[1];

    if (Math.atan2(dy1, dx1) < Math.atan2(dy2, dx2)) {
      return -1;
    } else if (Math.atan2(dy1, dx1) > Math.atan2(dy2, dx2)) {
      return 1;
    } else {
      return (dx1 * dx1 + dy1 * dy1) - (dx2 * dx2 + dy2 * dy2);
    }
  });

  hull.push(locations[0], locations[1]);

  for (let i = 2; i < locations.length; i++) {
    while (hull.length >= 2 && crossProduct(hull[hull.length - 2], hull[hull.length - 1], locations[i]) <= 0) {
      hull.pop();
    }
    hull.push(locations[i]);
  }

  return hull;
}

function crossProduct(point1, point2, point3) {
  const x1 = point2.position[0] - point1.position[0];
  const y1 = point2.position[1] - point1.position[1];
  const x2 = point3.position[0] - point1.position[0];
  const y2 = point3.position[1] - point1.position[1];
  return x1 * y2 - x2 * y1;
}

function twoOpt(locations) {
  let improvement = true;
  while (improvement) {
    improvement = false;
    for (let i = 0; i < locations.length - 1; i++) {
      for (let j = i + 2; j < locations.length; j++) {
        if (j !== i && j !== i + 1) {
          if (distance(locations[i], locations[i + 1]) + distance(locations[j], locations[(j + 1) % locations.length]) >
              distance(locations[i], locations[j]) + distance(locations[i + 1], locations[(j + 1) % locations.length])) {
            locations = swapLocations(locations, i + 1, j);
            improvement = true;
          }
        }
      }
    }
  }
  return locations;
}

function distance(point1, point2) {
  return Math.sqrt(Math.pow(point2.position[0] - point1.position[0], 2) + Math.pow(point2.position[1] - point1.position[1], 2));
}

function swapLocations(locations, i, j) {
  const newLocations = locations.slice();
  while (i < j) {
    [newLocations[i], newLocations[j]] = [newLocations[j], newLocations[i]];
    i++;
    j--;
  }
  return newLocations;
}