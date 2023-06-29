const { use } = require("./app");
const db = require("./db/connection");

exports.selectTopics = () => {
  return db.query("SELECT * FROM topics;").then((response) => {
    return response.rows;
  });
};

exports.selectArticleById = (article_id) => {
  return db
    .query("SELECT * FROM articles WHERE article_id = $1;", [article_id])
    .then((response) => {
      if (!response.rows.length) {
        return Promise.reject({ status: 404, msg: "Path not found" });
      }
      return response.rows[0];
    });
};

exports.selectAllArticles = () => {
  return db
    .query(
      "SELECT articles.author, articles.article_id, articles.title, articles.topic, articles.created_at, articles.votes, articles.article_img_url, COUNT(comment_id)::INT AS comment_count FROM articles LEFT JOIN comments ON comments.article_id = articles.article_id GROUP BY articles.article_id ORDER BY created_at DESC;"
    )
    .then((response) => {
      return response.rows;
    });
};

exports.selectAllArticleComments = (article_id) => {
  return db
    .query(
      "SELECT * FROM comments WHERE article_id = $1 ORDER BY created_at DESC;",
      [article_id]
    )
    .then((response) => {
      return response.rows;
    });
};

exports.addComment = (article_id, username, body) => {
  return db
    .query(
      "INSERT INTO comments (article_id, author, body) VALUES ($1 , $2, $3) RETURNING *;",
      [article_id, username, body]
    )
    .then((response) => {
      return response.rows[0];
    });
};
