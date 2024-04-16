const request = require("supertest");
const app = require("../app");

const seed = require("../db/seeds/seed.js");
const db = require("../db/connection.js");

const testData = require("../db/data/test-data");
const endpointsFile = require("../endpoints.json");

beforeEach(() => {
  return seed(testData);
});

afterAll(() => {
  return db.end();
});

describe("App routes", () => {
  describe("Endpoints description", () => {
    test("200 - GET /api", () => {
      return request(app)
        .get("/api")
        .expect(200)
        .then(({ body: { endpoints } }) => {
          expect(endpoints).toEqual(endpointsFile);
        });
    });
  });
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
  describe("ARTICLES routes", () => {
    describe("getArticleById", () => {
      test("200 - GET /api/articles/1", () => {
        return request(app)
          .get("/api/articles/1")
          .expect(200)
          .then(({ body: { article } }) => {
            expect(article).toMatchObject({
              title: "Living in the shadow of a great man",
              topic: "mitch",
              author: "butter_bridge",
              body: "I find this existence challenging",
              created_at: "2020-07-09T20:11:00.000Z",
              votes: 100,
              article_img_url:
                "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
            });
          });
      });

      test("400 - GET /api/articles/my_article", () => {
        return request(app)
          .get("/api/articles/my_article")
          .expect(400)
          .then({ body: "Bad request" });
      });

      test("404 - GET /api/articles/777", () => {
        return request(app)
          .get("/api/articles/777")
          .expect(404)
          .then({ body: "No data found" });
      });
    });

    describe("getArticles", () => {
      test("200 - GET /api/articles", () => {
        return request(app)
          .get("/api/articles")
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles).toHaveLength(13);
            expect(articles).toBeSorted({
              key: "created_at",
              descending: true,
            });
            articles.forEach((article) => {
              expect(article).toHaveProperty("author");
              expect(article).toHaveProperty("title");
              expect(article).toHaveProperty("article_id");
              expect(article).toHaveProperty("topic");
              expect(article).toHaveProperty("created_at");
              expect(article).toHaveProperty("votes");
              expect(article).toHaveProperty("article_img_url");
              expect(article).toHaveProperty("comment_count");
            });
          });
      });

      test("400 - GET /api/articles", () => {
        return request(app)
          .get("/api/articles?sort_by=blahblah&order=asc")
          .expect(400)
          .then(({ body: { message } }) => {
            expect(message).toBe("Bad query value!");
          });
      });
    });

    describe("getCommentsByArticleId", () => {
      test("200 - GET /api/articles/:article_id/comments", () => {
        return request(app)
          .get("/api/articles/5/comments")
          .expect(200)
          .then(({ body: { comments } }) => {
            expect(comments).toHaveLength(2);
            expect(comments).toBeSorted({
              key: "created_at",
              descending: true,
            });
            comments.forEach((comment) => {
              expect(comment).toHaveProperty("comment_id");
              expect(comment).toHaveProperty("body");
              expect(comment).toHaveProperty("article_id");
              expect(comment).toHaveProperty("author");
              expect(comment).toHaveProperty("votes");
              expect(comment).toHaveProperty("created_at");
            });
          });
      });

      test("400 - GET /api/articles/my_article/comments", () => {
        return request(app)
          .get("/api/articles/my_article/comments")
          .expect(400)
          .then({ body: "Bad request" });
      });

      test("404 - GET /api/articles/999/comments", () => {
        return request(app)
          .get("/api/articles/999/comments")
          .expect(404)
          .then({ body: "No data found" });
      });
    });
  });
});
