const express = require('express')
const app = express();
const { getAllTopics } = require('./news.controllers')

app.get('/api/topics', getAllTopics)

module.exports = app;