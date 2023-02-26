const express = require("express");
const path = require("path");
const responseModel = require("./helpers/responseModel");
const createWorker = require("./helpers/createWorker");

const app = express();
const port = process.env.PORT || 3000;
const THREAD_COUNT = 12;
const operationsAmmount = 20_000_000_000;

app.use(express.static(path.join(__dirname, "public")));

app.get("/", function (req, res) {
    res.sendFile("index.html");
});

app.get("/non-blocking/", (req, res) => {
    res.status(200).send(responseModel({ message: "non blocking page" }));
});

// 4 seg aprox with 12 thread
app.get("/blocking", async (req, res) => {
    const workerPromises = [];
    for (let i = 0; i < THREAD_COUNT; i++) {
        workerPromises.push(createWorker({ THREAD_COUNT, operationsAmmount }));
    }
    const threadResutls = await Promise.all(workerPromises);
    const total =
        threadResutls[0] +
        threadResutls[1] +
        threadResutls[2] +
        threadResutls[3];

    res.status(200).send(
        responseModel({
            message: `result is ${total}, threadResutls is ${JSON.stringify(
                threadResutls
            )}`,
        })
    );
});

// 22 seg aprox
app.get("/blocking-main-thread", async (req, res) => {
    let counter = 0;
    for (let i = 0; i < operationsAmmount; i++) {
        counter++;
    }
    res.status(200).send(responseModel({ message: `result is ${counter}` }));
});

app.listen(port, () => {
    console.log(`App listening on http://localhost:${port}`);
});
