const express = require('express');
const crypto = require('crypto');
const { Worker } = require('worker_threads');
const os = require('os');

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

const numCPUs = os.cpus().length;
const workers = [];


for (let i = 0; i < numCPUs; i++) {
    const worker = new Worker('./worker.js');
    workers.push(worker);
}

app.post('/hash/main', (req, res) => {
    const { data } = req.body;
    const hash = crypto.createHash('sha256').update(data).digest('hex');
    res.json({ hash });
});


app.post('/hash/worker', (req, res) => {
    const { data } = req.body;

    const worker = workers.shift();
    workers.push(worker);

    worker.once('message', (hash) => {
        res.json({ hash });
    });

    worker.once('error', (error) => {
        res.status(500).json({ error: error.message });
    });

    worker.once('exit', (code) => {
        if (code !== 0) {
            console.error(`Worker stopped with exit code ${code}`);
        }
    });

    worker.postMessage(data);
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
