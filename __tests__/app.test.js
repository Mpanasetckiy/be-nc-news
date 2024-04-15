const request = require("supertest");
const app = require("../app");

const seed = require("../db/seeds/seed.js");
const db = require("../db/connection.js");

const testData = require("../db/data/test-data");

beforeEach(() => {
  return seed(testData);
});

afterAll(() => {
  return db.end();
});

describe("app routes", () => {
  describe("TOPICS routes ", () => {
    test("200 - GET /api/topics", () => {
      return request(app)
        .get("/api/topics")
        .expect(200)
        .then(({ body: { topics } }) => {
          expect(topics).toHaveLength(3);
          topics.forEach((topic) => {
            expect(topic).toHaveProperty("slug");
            expect(topic).toHaveProperty("description");
          });
        });
    });
  });
});
