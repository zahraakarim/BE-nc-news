const request = require("supertest");
const app = require("../app");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data");
const endpoints = require("../endpoints.json");

beforeEach(() => {
  return seed(data);
});

afterAll(() => {
  return db.end();
});

describe("GET /api/topics", () => {
  test("200: GET - responds with an array of topic objects, each of which should have a property of slug and description", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        const { topics } = body;
        expect(Array.isArray(topics)).toBe(true);
        expect(topics).toHaveLength(3);
        topics.forEach((topic) => {
          expect(topic).toHaveProperty("slug", expect.any(String));
          expect(topic).toHaveProperty("description", expect.any(String));
        });
      });
  });
  test("404: ERROR - responds with an error when an invalid endpoint has been inputted", () => {
    return request(app)
      .get("/api/nonesense")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Path not found");
      });
  });
});

describe("GET /api", () => {
  test("200: GET: responds with an object describing all the available endpoints on my API", () => {
    request(app)
      .get("/api")
      .expect(200)
      .then(({ body }) => {
        expect(body.endpoints).toEqual(endpoints);
      });
  });
});

describe("GET /api/articles/:article_id", () => {
  test("200: GET: responds with an article object with properties of author, title, article_id, body, topic, created_at, votes, article_img_url", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body }) => {
        const { article } = body;
        expect(article).toHaveProperty("author", expect.any(String));
        expect(article).toHaveProperty("title", expect.any(String));
        expect(article).toHaveProperty("article_id", expect.any(Number));
        expect(article).toHaveProperty("body", expect.any(String));
        expect(article).toHaveProperty("topic", expect.any(String));
        expect(article).toHaveProperty("created_at", expect.any(String));
        expect(article).toHaveProperty("votes", expect.any(Number));
        expect(article).toHaveProperty("article_img_url", expect.any(String));
      });
  });
});
test("404: ERROR: responds with an error when article_id is valid, but does not exist", () => {
  return request(app)
    .get("/api/articles/999999")
    .expect(404)
    .then(({ body }) => {
      expect(body.msg).toBe("Path not found");
    });
});
test("400: ERROR: responds with an error when article id is an invalid type", () => {
  return request(app)
    .get("/api/articles/nonesense")
    .expect(400)
    .then(({ body }) => {
      expect(body.msg).toBe("Bad Request");
    });
});

describe("GET /api/articles", () => {
  test("200: GET: responds with an articles array of article objects, each of which should have the properties author, title, article_id, topic, created_at, votes, article_img_url, comment_count", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles).toHaveLength(13);
        articles.forEach((article) => {
          expect(article).toHaveProperty("author", expect.any(String));
          expect(article).toHaveProperty("title", expect.any(String));
          expect(article).toHaveProperty("article_id", expect.any(Number));
          expect(article).toHaveProperty("topic", expect.any(String));
          expect(article).toHaveProperty("created_at", expect.any(String));
          expect(article).toHaveProperty("votes", expect.any(Number));
          expect(article).toHaveProperty("article_img_url", expect.any(String));
          expect(article).toHaveProperty("comment_count", expect.any(Number));
          expect(article).not.toHaveProperty("body", expect.any(String));
        });
      });
  });
  test("200: GET: responds with array of article objects sorted in descending order by date", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles).toBeSortedBy("created_at", { descending: true });
      });
  });
  test("200: GET: responds with array of article objects filtered by specified topic", () => {
    return request(app)
      .get("/api/articles?topic=cats")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        articles.forEach((article) => {
          expect(article.topic).toBe("cats");
        });
      });
  });
  test("200: GET: responds with an empty array when topic provided doesn't exist", () => {
    return request(app)
      .get("/api/articles?topic=beans")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles).toEqual([]);
      });
  });
  test("200: GET: responds with array of article objects sorted by order ASC", () => {
    return request(app)
      .get("/api/articles?order=asc")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles).toBeSortedBy("created_at", { ascending: true });
      });
  });
  test("200: GET: responds with array of article objects sorted by votes in ascending order", () => {
    return request(app)
      .get("/api/articles?sort_by=votes&order=asc")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles).toBeSortedBy("votes", { ascending: true });
      });
  });
});
test("400: ERROR: responds with an error when given an invalid order query", () => {
  return request(app)
    .get("/api/articles?order=123")
    .expect(400)
    .then(({ body }) => {
      expect(body.msg).toBe("Bad Request");
    });
});
test("400: ERROR: responds with an error when given an invalid sort_by query", () => {
  return request(app)
    .get("/api/articles?sort_by=bobbybrown")
    .expect(400)
    .then(({ body }) => {
      expect(body.msg).toBe("Bad Request");
    });
});
test("404: ERROR: responds with an error when path is valid but does not exist", () => {
  return request(app)
    .get("/api/nonesense")
    .expect(404)
    .then(({ body }) => {
      expect(body.msg).toBe("Path not found");
    });
});

describe("GET /api/articles/:article_id/comments", () => {
  test("200: GET: an array of comments for the given article_id of which each comment has the properties comment_id, votes, created_at, author, body, article_id", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body }) => {
        const { comments } = body;
        expect(comments).toHaveLength(11);
        expect(comments).toBeSortedBy("created_at", { descending: true });
        comments.forEach((comment) => {
          expect(comment).toEqual(
            expect.objectContaining({
              comment_id: expect.any(Number),
              votes: expect.any(Number),
              created_at: expect.any(String),
              author: expect.any(String),
              body: expect.any(String),
              article_id: expect.any(Number),
            })
          );
        });
      });
  });
  test("200: GET: responds with an empty array if the article exists but there are no comments ", () => {
    return request(app)
      .get("/api/articles/2/comments")
      .expect(200)
      .then(({ body }) => {
        expect(body.comments).toHaveLength(0);
      });
  });
  test("400: ERROR: responds with an error when article_id type is invalid", () => {
    return request(app)
      .get("/api/articles/nonesense/comments")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
  test("404: ERROR: responds with an error when article_id type is valid but doesn't exist", () => {
    return request(app)
      .get("/api/articles/9999/comments")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Path not found");
      });
  });
});

describe("POST /api/articles/:article_id/comments", () => {
  test("201: POST: respond with a 201 to show a successful post of a new comment", () => {
    return request(app)
      .post("/api/articles/2/comments")
      .send({
        username: "butter_bridge",
        body: "I'm adding a new comment, let's goooo!",
      })
      .expect(201)
      .then(({ body }) => {
        expect(body.comment).toEqual({
          body: "I'm adding a new comment, let's goooo!",
          votes: 0,
          author: "butter_bridge",
          article_id: 2,
          comment_id: expect.any(Number),
          created_at: expect.any(String),
        });
      });
  });
  test("201: POST: responds with a 201 and when given additional properties, ignores them and only looks at username and body key", () => {
    return request(app)
      .post("/api/articles/2/comments")
      .send({
        username: "butter_bridge",
        body: "I'm adding a new comment, let's goooo!",
        dad_joke: "What do you call a fish wearing a bowtie? Sofishticated.",
        pronoun: "she/they",
      })
      .expect(201)
      .then(({ body }) => {
        expect(body.comment).toEqual({
          body: "I'm adding a new comment, let's goooo!",
          votes: 0,
          author: "butter_bridge",
          article_id: 2,
          comment_id: expect.any(Number),
          created_at: expect.any(String),
        });
      });
  });
  test("400: ERROR: responds with an error when article_id type is invalid", () => {
    return request(app)
      .post("/api/articles/nonesense/comments")
      .send({
        username: "butter_bridge",
        body: "I'm adding a new comment, let's goooo!",
      })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
  test("400: ERROR: responds with an error when username is blank", () => {
    return request(app)
      .post("/api/articles/2/comments")
      .send({
        body: "I'm adding a new comment, let's goooo!",
      })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
  test("400: ERROR: responds with an error when body is blank", () => {
    return request(app)
      .post("/api/articles/2/comments")
      .send({
        username: "butter_bridge",
      })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
  test("404: ERROR: responds with an error when article_id type is valid but doesn't exist", () => {
    return request(app)
      .post("/api/articles/12345/comments")
      .send({
        username: "butter_bridge",
        body: "I'm adding a new comment, let's goooo!",
      })
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Path not found");
      });
  });
  test("404: ERROR: responds with an error when the username given does not exist", () => {
    return request(app)
      .post("/api/articles/2/comments")
      .send({
        username: "zahraa",
        body: "I'm adding a new comment, let's goooo!",
      })
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Path not found");
      });
  });
});

describe("PATCH /api/articles/:article_id", () => {
  test("200: PATCH: responds with the updated article and the votes property should be updated by the given amount", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({ inc_votes: 20 })
      .expect(200)
      .then(({ body }) => {
        expect(body.article.votes).toEqual(120);
        expect(body.article).toEqual(
          expect.objectContaining({
            article_id: 1,
            title: "Living in the shadow of a great man",
            topic: "mitch",
            author: "butter_bridge",
            body: "I find this existence challenging",
            created_at: "2020-07-09T20:11:00.000Z",
            votes: 120,
            article_img_url:
              "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
          })
        );
      });
  });
  test("200: PATCH: responds with an updated article with votes incremented accordingly and ignores any other keys added into the request", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({ inc_votes: 40, likes: 300 })
      .expect(200)
      .then(({ body }) => {
        expect(body.article.votes).toEqual(140);
      });
  });
  test("200: PATCH: responds with an updated article with votes number unchanged if 0 is inputted", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({ inc_votes: 0 })
      .expect(200)
      .then(({ body }) => {
        expect(body.article.votes).toEqual(100);
      });
  });
  test("400: ERROR: responds with an error when article_id type is invalid", () => {
    return request(app)
      .patch("/api/articles/nonesense")
      .send({ inc_votes: 40 })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
  test("400: ERROR: responds with an error when inc_votes type is invalid", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({ inc_votes: "nonesense" })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
  test("400: ERROR: responds with an error when inc_votes is blank", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({})
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
  test("404: ERROR: responds with an error when article_id type is valid but doesn't exist", () => {
    return request(app)
      .patch("/api/articles/9999")
      .send({ inc_votes: 27 })
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Path not found");
      });
  });
});

describe("DELETE /api/comments/:comment_id", () => {
  test("204: DELETE: should delete a comment when a valid comment_id is given", () => {
    return request(app).delete("/api/comments/1").expect(204);
  });
  test("400: ERROR: responds with an error when an invalid comment_id type is given", () => {
    return request(app)
      .delete("/api/comments/nonesense")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
  test("404: ERROR: responds with an error when a valid comment_id is given but does not exist", () => {
    return request(app)
      .delete("/api/comments/99999")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Comment not found");
      });
  });
});

describe("GET /api/users", () => {
  test("200: GET: responds with an array of objects, with each object having a property of username, name, and avatar_url", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body }) => {
        const { users } = body;
        expect(Array.isArray(users)).toBe(true);
        expect(users).toHaveLength(4);
        users.forEach((user) => {
          expect(user).toEqual(
            expect.objectContaining({
              username: expect.any(String),
              name: expect.any(String),
              avatar_url: expect.any(String),
            })
          );
        });
      });
  });
});
