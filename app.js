const express = require('express')
const app = express();
const { getAllTopics, getAllEndpoints } = require('./news.controllers')

app.use(express.json());

app.get('/api/topics', getAllTopics)

app.get('/api', getAllEndpoints)

app.all("*", (_, res) => {
    res.status(404).send({ msg: "Path not found" });
  });

app.use((err, req, res, next) => {
    res.status(500).send({msg: 'Internal server error!'})
})

module.exports = app;