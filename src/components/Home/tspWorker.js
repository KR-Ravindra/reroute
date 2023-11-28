// export default () => {
console.log('Worker script loaded');

self.addEventListener('message', (event) => {
    const { action, data, positions } = event.data;
    console.log('Worker received message:', action);

    if (action === 'simulateAndAnimate') {
        console.log('IF ACTION');
        // Call your simulation and animation function here
        // For example: simulateAndAnimate(data, positions);
    }
});
// }
