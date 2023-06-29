const { response } = require("./app");
const endpoints = require("./endpoints.json");
const {
  selectTopics,
  selectArticleById,
  selectAllArticles,
  selectAllArticleComments,
  addComment,
} = require("./news.model");
const { checkArticleExists } = require("./utils");

exports.getAllTopics = (req, res, next) => {
  selectTopics()
    .then((topics) => {
      res.status(200).send({ topics });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getAllEndpoints = (req, res, next) => {
  res
    .status(200)
    .send({ endpoints })
    .catch((err) => {
      next(err);
    });
};

exports.getArticleId = (req, res, next) => {
  const { article_id } = req.params;
  selectArticleById(article_id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getAllArticles = (req, res, next) => {
  selectAllArticles()
    .then((articles) => {
      res.status(200).send({ articles });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getAllArticleComments = (req, res, next) => {
  const { article_id } = req.params;
  Promise.all([
    selectAllArticleComments(article_id),
    checkArticleExists(article_id),
  ])
    .then(([comments]) => {
      res.status(200).send({ comments });
    })
    .catch((err) => {
      next(err);
    });
};

exports.postComment = (req, res, next) => {
  const { article_id } = req.params;
  const { username, body } = req.body;
  addComment(article_id, username, body)
    .then((comment) => {
      res.status(201).send({ comment });
    })
    .catch((err) => {
      next(err);
    });
};
