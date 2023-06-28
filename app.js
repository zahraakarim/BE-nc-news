const express = require('express')
const app = express();
const { getAllTopics, getAllEndpoints, getArticleId, getAllArticles } = require('./news.controllers')

app.use(express.json());

app.get('/api/topics', getAllTopics)

app.get('/api', getAllEndpoints)

app.get('/api/articles/:article_id', getArticleId)

app.get('/api/articles', getAllArticles)

app.all("*", (_, res) => {
    res.status(404).send({ msg: "Path not found" });
  });

app.use((err, req, res, next) => {
  if(err.code) {
    res.status(400).send({msg: 'Bad Request'})
  } else next(err);
})

app.use((err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  } else next(err);
});

app.use((err, req, res, next) => {
    res.status(500).send({msg: 'Internal server error!'})
})

module.exports = app;