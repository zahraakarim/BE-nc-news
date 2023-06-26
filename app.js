const express = require('express')
const app = express();
const { getAllTopics } = require('./news.controllers')

app.use(express.json());

app.get('/api/topics', getAllTopics)

app.all("*", (_, res) => {
    res.status(404).send({ msg: "Path not found" });
  });

app.use((err, req, res, next) => {
    res.status(500).send({msg: 'Internal server error!'})
})

module.exports = app;