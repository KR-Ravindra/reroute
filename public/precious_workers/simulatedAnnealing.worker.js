self.onmessage = (event) => {
  const locations = event.data;
  const result = simulatedAnnealing(locations);
  self.postMessage(result);
};

function simulatedAnnealing(locations) {
  console.log("Worker is running simulated annealing on ", locations)
  let temperature = 10000;
  const coolingRate = 0.003;

  let currentSolution = locations.slice();
  let bestSolution = currentSolution.slice();

  while (temperature > 1) {
    let newSolution = currentSolution.slice();
    let index1 = Math.floor(Math.random() * newSolution.length);
    let index2 = Math.floor(Math.random() * newSolution.length);
    while (index1 === index2) { 
      index2 = Math.floor(Math.random() * newSolution.length);
    }
    [newSolution[index1], newSolution[index2]] = [newSolution[index2], newSolution[index1]];

    const currentEnergy = calculateTotalDistance(currentSolution);
    const newEnergy = calculateTotalDistance(newSolution);

    if (acceptanceProbability(currentEnergy, newEnergy, temperature) > Math.random()) {
      currentSolution = newSolution.slice();
    }

    if (calculateTotalDistance(currentSolution) < calculateTotalDistance(bestSolution)) {
      bestSolution = currentSolution.slice();
    }

    temperature *= 1 - coolingRate;
  }

  return bestSolution;
}

function calculateTotalDistance(locations) {
  let totalDistance = 0;
  for (let i = 0; i < locations.length - 1; i++) {
    totalDistance += Math.sqrt(Math.pow(locations[i + 1].position[0] - locations[i].position[0], 2) + Math.pow(locations[i + 1].position[1] - locations[i].position[1], 2));
  }
  return totalDistance;
}

function acceptanceProbability(currentEnergy, newEnergy, temperature) {
  if (newEnergy < currentEnergy) {
    return 1.0;
  } else {
    return Math.exp((currentEnergy - newEnergy) / temperature);
  }
}