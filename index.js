const express = require("express");
const { Worker } = require("worker_threads");

const app = express();
const port = process.env.PORT || 3001;
const THREAD_COUNT = 12;

app.get("/non-blocking/", (req, res) => {
    res.status(200).send("This page is non-blocking");
});

function createWorker() {
    return new Promise(function (resolve, reject) {
        const worker = new Worker("./four_workers.js", {
            workerData: { thread_count: THREAD_COUNT },
        });
        worker.on("message", data => {
            resolve(data);
        });
        worker.on("error", msg => {
            reject(`An error ocurred: ${msg}`);
        });
    });
}

// 4 seg aprox with 12 thread
app.get("/blocking", async (req, res) => {
    const workerPromises = [];
    for (let i = 0; i < THREAD_COUNT; i++) {
        workerPromises.push(createWorker());
    }
    const thread_results = await Promise.all(workerPromises);
    const total =
        thread_results[0] +
        thread_results[1] +
        thread_results[2] +
        thread_results[3];
    res.status(200).send(`result is ${total}`);
});

// 22 seg aprox
app.get("/blocking-main-thread", async (req, res) => {
    let counter = 0;
    for (let i = 0; i < 20_000_000_000; i++) {
        counter++;
    }
    res.status(200).send(`result is ${counter}`);
});

app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});
