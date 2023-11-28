// tspWorker.js
const self=this
const workercode = () => {
    self.onmessage = function (e) {
      console.log('Message received from main script',e);
      const { data, positions } = e.data;
      console.log('workerDATA',data, positions);

      animateData(data, positions);
    };
  
    function animateData( positions) {
      console.log("Positions are", positions);
      const locations = positions.map((position) => ({ position }));
      console.log(locations);
  
      // Convert locations to data format and post the data back to the main thread
      locations.forEach((location, index) => {
        setTimeout(() => {
          // If there is a next location, add a line connecting the current and next locations
          if (index < locations.length - 1) {
            const nextLocation = locations[index + 1];
            self.postMessage({
              type: 'lineData',
              data: {
                sourcePosition: location.position,
                targetPosition: nextLocation.position,
              },
            });
          }
          if (index === locations.length - 1) {
            self.postMessage({
              type: 'lineData',
              data: {
                sourcePosition: location.position,
                targetPosition: locations[0].position,
              },
            });
          }
        }, index * 1000);
      });
    }
  };
  
  // Convert the worker code function to a string
  let code = workercode.toString();
  
  // Extract the code inside the function
  code = code.substring(code.indexOf("{") + 1, code.lastIndexOf("}"));
  
  // Wrap the code inside a function to create a closure
  code = `
    (function() {
      ${code}
    })();
  `;
  
  // Create a Blob from the code
  const blob = new Blob([code], { type: "application/javascript" });
  
  // Create a blob URL for the worker script
  const worker_script = URL.createObjectURL(blob);
  
  export default worker_script;
  