const db = require("./db/connection");
const { sort } = require("./db/data/test-data/articles");

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

exports.selectAllArticles = (topic, sort_by = "created_at", order = "DESC") => {
  const validSortBy = [
    "title",
    "votes",
    "created_at",
    "author",
    "comment_count",
  ];
  const validTopics = [
    "cats",
    "mitch",
    "paper",
    "coding",
    "football",
    "cooking",
  ];
  const validOrder = ["ASC", "DESC"];
  const capitalOrder = order.toUpperCase();

  if (!validOrder.includes(capitalOrder) || !validSortBy.includes(sort_by)) {
    return Promise.reject({ status: 400, msg: "Bad Request" });
  }

  if (topic && !validTopics.includes(topic)) {
    return Promise.reject({ status: 400, msg: "Bad Request" });
  }

  let queryString = `SELECT articles.author, articles.article_id, articles.title, articles.topic, articles.created_at, articles.votes, articles.article_img_url, COUNT(comment_id)::INT AS comment_count FROM articles LEFT JOIN comments ON comments.article_id = articles.article_id`;

  const topicQuery = [];
  if (topic) {
    queryString += ` WHERE topic = $1`;
    topicQuery.push(topic);
  }

  queryString += ` GROUP BY articles.article_id ORDER BY ${sort_by} ${order};`;

  return db.query(queryString, topicQuery).then((response) => {
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

exports.updateArticleById = (article_id, votes) => {
  return db
    .query(
      "UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING*;",
      [votes, article_id]
    )
    .then(({ rows }) => {
      if (!rows[0]) {
        return Promise.reject({
          status: 404,
          msg: "Path not found",
        });
      }
      return rows[0];
    });
};

exports.removeCommentById = (comment_id) => {
  return db
    .query("DELETE FROM comments WHERE comment_id = $1 RETURNING*;", [
      comment_id,
    ])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Comment not found" });
      }
      return rows;
    });
};

exports.selectUsers = () => {
  return db.query("SELECT * FROM users;").then((response) => {
    return response.rows;
  });
};
