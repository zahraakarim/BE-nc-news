const request = require('supertest');
const app = require('../app');
const db = require('../db/connection')
const seed = require('../db/seeds/seed')
const data = require('../db/data/test-data')
const endpoints = require('../endpoints.json')

beforeEach(() => {
    return seed(data);
  });
  
  afterAll(() => {
    return db.end();
  });

describe('GET /api/topics', () => {
    test("200: GET - responds with an array of topic objects, each of which should have a property of slug and description", () => {
        return request(app)
        .get('/api/topics')
        .expect(200)
        .then(({body}) => {
            const {topics} = body
            expect(Array.isArray(topics)).toBe(true);
            expect(topics).toHaveLength(3);
            topics.forEach((topic) => {
                expect(topic).toHaveProperty("slug", expect.any(String));
                expect(topic).toHaveProperty("description", expect.any(String));
            })
        })
    })
    test("404: ERROR - responds with an error when an invalid endpoint has been inputted", () => {
        return request(app)
        .get('/api/nonesense')
        .expect(404)
        .then(({body}) => {
            expect(body.msg).toBe('Path not found')
        })
    })
})

describe('GET /api', () => {
    test("200: GET: responds with an object describing all the available endpoints on my API", () => {
        request(app)
        .get('/api')
        .expect(200)
        .then(({body}) => {
            expect(body.endpoints).toEqual(endpoints)
        })
    })
})

describe('GET /api/articles/:article_id', () => {
    test("200: GET: responds with an article object with properties of author, title, article_id, body, topic, created_at, votes, article_img_url", () => {
        return request(app)
        .get('/api/articles/1')
        .expect(200)
        .then(({body}) => {
            const { article } = body;
            expect(article).toHaveProperty('author', expect.any(String));
            expect(article).toHaveProperty('title', expect.any(String));
            expect(article).toHaveProperty('article_id', expect.any(Number));
            expect(article).toHaveProperty('body', expect.any(String));
            expect(article).toHaveProperty('topic', expect.any(String));
            expect(article).toHaveProperty('created_at', expect.any(String));
            expect(article).toHaveProperty('votes', expect.any(Number));
            expect(article).toHaveProperty('article_img_url', expect.any(String));
            })
        })
    })
    test("404: ERROR: responds with an error when article_id is valid, but does not exist", () => {
        return request(app)
        .get('/api/articles/999999')
        .expect(404)
        .then(({body}) => {
            expect(body.msg).toBe('Path not found')
        })
    })
    test("400: ERROR: responds with an error when article id is an invalid type", () => {
        return request(app)
        .get('/api/articles/nonesense')
        .expect(400)
        .then(({body}) => {
            expect(body.msg).toBe('Bad Request')
        })
    })

// 