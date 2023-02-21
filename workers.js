const { workerData, parentPort } = require("worker_threads");

let counter = 0;
for (
    let i = 0;
    i < workerData.operationsAmmount / workerData.threadCount;
    i++
) {
    counter++;
}

parentPort.postMessage(counter);
