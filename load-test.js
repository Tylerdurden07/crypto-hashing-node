import http from 'k6/http';
import { check, sleep } from 'k6';

// Function to generate a large random string
function generateLargeString(size) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < size; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

const mainUrl = 'http://localhost:3000/hash/main';
const workerUrl = 'http://localhost:3000/hash/worker';

export let options = {
    vus: 5,
    duration: '4m',
};

export default function () {
    // Generate a 1MB string for testing
    const largeData = { data: generateLargeString(1024 * 1024) }; // 1MB string

    // Test main thread hashing
    // const mainRes = http.post(mainUrl, JSON.stringify(largeData), {
    //     headers: { 'Content-Type': 'application/json' },
    // });
    // check(mainRes, { 'main thread status was 200': (r) => r.status === 200 });

    // Test worker thread hashing
    const workerRes = http.post(workerUrl, JSON.stringify(largeData), {
        headers: { 'Content-Type': 'application/json' },
    });
    check(workerRes, { 'worker thread status was 200': (r) => r.status === 200 });

    // sleep(1); // Sleep for a second between iterations
}
