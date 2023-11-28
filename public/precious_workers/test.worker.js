self.onmessage = (event) => {
      console.log("Sleeping from worker");
      self.postMessage(event.data+'_test')
  };