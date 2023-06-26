const request = require('supertest');
const app = require('../app');
const db = require('../db/connection')
const seed = require('../db/seeds/seed')
const data = require('../db/data/test-data')

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
})