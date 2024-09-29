const { parentPort } = require('worker_threads');
const crypto = require('crypto');

parentPort.on('message', (data) => {
    const hash = crypto.createHash('sha256').update(data).digest('hex');
    parentPort.postMessage(hash);
});
