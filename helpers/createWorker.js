const { Worker } = require("worker_threads");

const createWorker = function createWorker({
    THREAD_COUNT = 1,
    operationsAmmount = 20_000_000,
}) {
    return new Promise(function (resolve, reject) {
        const worker = new Worker("./workers.js", {
            workerData: { threadCount: THREAD_COUNT, operationsAmmount },
        });
        worker.on("message", data => {
            resolve(data);
        });
        worker.on("error", msg => {
            reject(`An error ocurred: ${msg}`);
        });
    });
};

module.exports = createWorker;
