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

describe("App endpoints", () => {
  describe("Endpoints description", () => {
    test("200 - GET: Responds with a JSON object describing current functionality", () => {
      return request(app)
        .get("/api")
        .expect(200)
        .then(({ body: { endpoints } }) => {
          expect(endpoints).toEqual(endpointsFile);
        });
    });
  });
  describe("TOPICS endpoints", () => {
    test("200 - GET: Responds with an array of 3 topics", () => {
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
  describe("ARTICLES endpoints", () => {
    describe("getArticleById", () => {
      test("200 - GET: Responds with an article with corresponding id", () => {
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

      test("200 - GET: Responds with an article with added comment_count prop", () => {
        return request(app)
          .get("/api/articles/1")
          .expect(200)
          .then(({ body: { article } }) => {
            expect(article).toMatchObject({
              title: "Living in the shadow of a great man",
              topic: "mitch",
              author: "butter_bridge",
              body: "I find this existence challenging",
              comment_count: 11,
              created_at: "2020-07-09T20:11:00.000Z",
              votes: 100,
              article_img_url:
                "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
            });
          });
      });

      test("400 - GET: Responds with appropriate error code and body message", () => {
        return request(app)
          .get("/api/articles/my_article")
          .expect(400)
          .then({ body: "Bad request" });
      });

      test("404 - GET: Responds with appropriate error code and body message", () => {
        return request(app)
          .get("/api/articles/777")
          .expect(404)
          .then({ body: "No data found" });
      });
    });

    describe("getArticles", () => {
      test("200 - GET: Responds with an array of articles sorted and ordered", () => {
        return request(app)
          .get("/api/articles")
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles).toHaveLength(10);
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

      test("200 - GET: Responds with an array of sorted articles sorted by 'author' and ordered by default", () => {
        return request(app)
          .get("/api/articles?sort_by=author")
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles).toBeSorted({
              key: "author",
              descending: true,
            });
          });
      });

      test("200 - GET: Responds with an array of sorted articles sorted by 'title' and ordered by ASC", () => {
        return request(app)
          .get("/api/articles?sort_by=title&order=asc")
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles).toBeSorted({
              key: "title",
              ascending: true,
            });
          });
      });

      test("200 - GET: Responds with an array of sorted articles sorted by 'topic' and ordered by DESC", () => {
        return request(app)
          .get("/api/articles?sort_by=title&order=desc")
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles).toBeSorted({
              key: "title",
              descending: true,
            });
          });
      });

      test("200 - GET: Responds with an array of sorted articles sorted by 'votes' and ordered by default", () => {
        return request(app)
          .get("/api/articles?sort_by=votes")
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles).toBeSorted({
              key: "votes",
              descending: true,
            });
          });
      });

      test("200 - GET: Responds with an array of sorted articles sorted by 'comment_count' and ordered by default", () => {
        return request(app)
          .get("/api/articles?sort_by=comment_count")
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles).toBeSorted({
              key: "comment_count",
              descending: true,
            });
          });
      });

      test("400 - GET: Responds with appropriate error code and body message when invalid order query passed", () => {
        return request(app)
          .get("/api/articles?sort_by=topic&order=blah")
          .expect(400)
          .then(({ body: { message } }) => {
            expect(message).toBe("Bad query value!");
          });
      });

      test("400 - GET: Responds with appropriate error code and body message", () => {
        return request(app)
          .get("/api/articles?sort_by=blahblah")
          .expect(400)
          .then(({ body: { message } }) => {
            expect(message).toBe("Bad query value!");
          });
      });

      test("200 - GET: Responds with an array of articles filtered by topic", () => {
        return request(app)
          .get("/api/articles?topic=mitch")
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles).toHaveLength(10);
            articles.forEach(({ topic }) => {
              expect(topic).toBe("mitch");
            });
          });
      });

      test("200 - GET: Responds with an array of articles when topic query omitted", () => {
        return request(app)
          .get("/api/articles?topic=")
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles).toHaveLength(10);
          });
      });

      test("200 - GET: Responds with an empty array when no corresponding articles found", () => {
        return request(app)
          .get("/api/articles?topic=blahblahtopic")
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles).toHaveLength(0);
          });
      });

      test("200 - GET: Responds with an array of 10 articles by default", () => {
        return request(app)
          .get("/api/articles")
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles).toHaveLength(10);
          });
      });

      test("200 - GET: Responds with an array of 3 articles on the 2 page", () => {
        return request(app)
          .get("/api/articles?p=2")
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles).toHaveLength(3);
          });
      });

      test("200 - GET: Responds with an empty array when out of the limit", () => {
        return request(app)
          .get("/api/articles?p=5")
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles).toHaveLength(0);
          });
      });

      test("400 - GET: Responds with an appropriate error when invalid page passed", () => {
        return request(app)
          .get("/api/articles?p=blahpage")
          .expect(400)
          .then(({ body: { message } }) => {
            expect(message).toBe("Bad query value!");
          });
      });

      test("400 - GET: Responds with an appropriate error when invalid limit passed", () => {
        return request(app)
          .get("/api/articles?p=1&limit=blahlimit")
          .expect(400)
          .then(({ body: { message } }) => {
            expect(message).toBe("Bad query value!");
          });
      });
    });

    describe("getCommentsByArticleId", () => {
      test("200 - GET: Responds with an array of 2 comments", () => {
        return request(app)
          .get("/api/articles/5/comments")
          .expect(200)
          .then(({ body: { comments } }) => {
            expect(comments).toHaveLength(2);
            comments.forEach((comment) => {
              expect(comment.article_id).toBe(5);
              expect(comment).toHaveProperty("comment_id");
              expect(comment).toHaveProperty("body");
              expect(comment).toHaveProperty("article_id");
              expect(comment).toHaveProperty("author");
              expect(comment).toHaveProperty("votes");
              expect(comment).toHaveProperty("created_at");
            });
          });
      });

      test("200 - GET: Responds with an array of 2 comments sorted and ordered", () => {
        return request(app)
          .get("/api/articles/5/comments")
          .expect(200)
          .then(({ body: { comments } }) => {
            expect(comments).toHaveLength(2);
            expect(comments).toBeSorted({
              key: "created_at",
              descending: true,
            });
          });
      });

      test("400 - GET: Responds with appropriate error code and body message", () => {
        return request(app)
          .get("/api/articles/my_article/comments")
          .expect(400)
          .then(({ body: { message } }) => {
            expect(message).toBe("Bad request");
          });
      });

      test("404 - GET: Responds with appropriate error code and body message", () => {
        return request(app)
          .get("/api/articles/999/comments")
          .expect(404)
          .then(({ body: { message } }) => {
            expect(message).toBe("No data found");
          });
      });

      test("200 - GET: Responds with appropriate status code and body message", () => {
        return request(app)
          .get("/api/articles/2/comments")
          .expect(200)
          .then(({ body: { comments } }) => {
            expect(comments).toEqual([]);
          });
      });
    });

    describe("addComment", () => {
      test("201 - POST: Responds with a newly created comment object", () => {
        const comment = {
          username: "lurker",
          body: "This is a test comment.",
        };
        return request(app)
          .post("/api/articles/2/comments")
          .send(comment)
          .expect(201)
          .then(({ body: { newComment } }) => {
            expect(newComment).toMatchObject({
              comment_id: 19,
              body: "This is a test comment.",
              votes: 0,
              author: "lurker",
              article_id: 2,
              created_at: expect.any(String),
            });
          });
      });

      test("400 - POST: Responds with appropriate error when invalid article_id provided", () => {
        const comment = {
          username: "lurker",
          body: "This is a test comment.",
        };
        return request(app)
          .post("/api/articles/my_article/comments")
          .send(comment)
          .expect(400)
          .then(({ body: { message } }) => {
            expect(message).toBe("Bad request");
          });
      });

      test("400 - POST: Responds with appropriate error when missing fields on body provided", () => {
        const comment = {
          username: "lurker",
        };
        return request(app)
          .post("/api/articles/2/comments")
          .send(comment)
          .expect(400)
          .then(({ body: { message } }) => {
            expect(message).toBe("Bad request");
          });
      });

      test("400 - POST: Responds with appropriate error when the provided body is not a string", () => {
        const comment = {
          username: "lurker",
          body: 1234,
        };
        return request(app)
          .post("/api/articles/2/comments")
          .send(comment)
          .expect(400)
          .then(({ body: { message } }) => {
            expect(message).toBe("Bad request");
          });
      });

      test("404 - POST: Responds with appropriate error when nonexistent article_id provided", () => {
        const comment = {
          username: "malina",
          body: "This is a test comment.",
        };
        return request(app)
          .post("/api/articles/999/comments")
          .send(comment)
          .expect(404)
          .then(({ body: { message } }) => {
            expect(message).toBe("No key found");
          });
      });

      test("404 - POST: Responds with appropriate error when nonexistent username passed", () => {
        const comment = {
          username: "malina",
          body: "This is a test comment.",
        };
        return request(app)
          .post("/api/articles/2/comments")
          .send(comment)
          .expect(404)
          .then(({ body: { message } }) => {
            expect(message).toBe("No key found");
          });
      });
    });

    describe("patchArticle", () => {
      test("200 - PATCH: Responds with an updated article with corresponding id", () => {
        const body = {
          inc_vote: 5,
        };
        return request(app)
          .patch("/api/articles/3")
          .send(body)
          .expect(200)
          .then(({ body: { article } }) => {
            expect(article).toMatchObject({
              article_id: 3,
              title: "Eight pug gifs that remind me of mitch",
              topic: "mitch",
              author: "icellusedkars",
              body: "some gifs",
              created_at: expect.any(String),
              votes: 5,
              article_img_url:
                "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
            });
          });
      });

      test("400 - PATCH: Responds with an appropriate error when invalid article_id provided", () => {
        const body = {
          inc_vote: 5,
        };
        return request(app)
          .patch("/api/articles/blahblah")
          .send(body)
          .expect(400)
          .then(({ body: { message } }) => {
            expect(message).toBe("Bad request");
          });
      });

      test("400 - PATCH: Responds with an appropriate error when invalid inc_vote provided", () => {
        const body = {
          inc_vote: "sdfsdf",
        };
        return request(app)
          .patch("/api/articles/3")
          .send(body)
          .expect(400)
          .then(({ body: { message } }) => {
            expect(message).toBe("Bad request");
          });
      });

      test("404 - PATCH: Responds with an appropriate error when nonexistent article_id provided", () => {
        const body = {
          inc_vote: 5,
        };
        return request(app)
          .patch("/api/articles/555")
          .send(body)
          .expect(404)
          .then(({ body: { message } }) => {
            expect(message).toBe("No data found");
          });
      });
    });

    describe("createArticles", () => {
      test("201 - POST: Responds with a newly created article", () => {
        const body = {
          title: "Protect amur tigers",
          topic: "cats",
          author: "lurker",
          body: "Siberian tigers are the most rare subspecies of tiger and the largest tiger subspecies in the world. It is important to save the Siberian tiger because they are beautiful and strong creatures.",
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
        };
        return request(app)
          .post("/api/articles")
          .send(body)
          .expect(201)
          .then(({ body: { newArticle } }) => {
            console.log(newArticle);
            expect(newArticle).toMatchObject({
              article_id: 14,
              title: "Protect amur tigers",
              topic: "cats",
              author: "lurker",
              body: "Siberian tigers are the most rare subspecies of tiger and the largest tiger subspecies in the world. It is important to save the Siberian tiger because they are beautiful and strong creatures.",
              comment_count: 0,
              created_at: expect.any(String),
              votes: 0,
              article_img_url:
                "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
            });
          });
      });

      test("201 - POST: Responds with a newly created article, when no article url provided", () => {
        const body = {
          title: "Protect amur tigers",
          topic: "cats",
          author: "lurker",
          body: "Siberian tigers are the most rare subspecies of tiger and the largest tiger subspecies in the world. It is important to save the Siberian tiger because they are beautiful and strong creatures.",
        };
        return request(app)
          .post("/api/articles")
          .send(body)
          .expect(201)
          .then(({ body: { newArticle } }) => {
            console.log(newArticle);
            expect(newArticle).toMatchObject({
              article_id: 14,
              title: "Protect amur tigers",
              topic: "cats",
              author: "lurker",
              body: "Siberian tigers are the most rare subspecies of tiger and the largest tiger subspecies in the world. It is important to save the Siberian tiger because they are beautiful and strong creatures.",
              comment_count: 0,
              created_at: expect.any(String),
              votes: 0,
              article_img_url:
                "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
            });
          });
      });

      test("400 - POST: Responds with appropriate error when no title on body provided", () => {
        const body = {
          topic: "cats",
          author: "lurker",
          body: "Siberian tigers are the most rare subspecies of tiger and the largest tiger subspecies in the world. It is important to save the Siberian tiger because they are beautiful and strong creatures.",
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
        };
        return request(app)
          .post("/api/articles")
          .send(body)
          .expect(400)
          .then(({ body: { message } }) => {
            expect(message).toBe("Bad request");
          });
      });

      test("400 - POST: Responds with appropriate error when no article's body provided", () => {
        const body = {
          title: "Protect amur tigers",
          topic: "cats",
          author: "lurker",
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
        };
        return request(app)
          .post("/api/articles")
          .send(body)
          .expect(400)
          .then(({ body: { message } }) => {
            expect(message).toBe("Bad request");
          });
      });

      test("404 - POST: Responds with appropriate error when nonexistent author passed", () => {
        const body = {
          title: "Protect amur tigers",
          topic: "cats",
          author: "malina",
          body: "Siberian tigers are the most rare subspecies of tiger and the largest tiger subspecies in the world. It is important to save the Siberian tiger because they are beautiful and strong creatures.",
        };
        return request(app)
          .post("/api/articles")
          .send(body)
          .expect(404)
          .then(({ body: { message } }) => {
            expect(message).toBe("No key found");
          });
      });

      test("404 - POST: Responds with appropriate error when nonexistent topic passed", () => {
        const body = {
          title: "Protect amur tigers",
          topic: "tigers",
          author: "lurker",
          body: "Siberian tigers are the most rare subspecies of tiger and the largest tiger subspecies in the world. It is important to save the Siberian tiger because they are beautiful and strong creatures.",
        };
        return request(app)
          .post("/api/articles")
          .send(body)
          .expect(404)
          .then(({ body: { message } }) => {
            expect(message).toBe("No key found");
          });
      });
    });
  });

  describe("COMMENTS endpoints", () => {
    describe("deleteComment", () => {
      test("204 - DELETE: Responds with an appropriate status code", () => {
        return request(app).delete("/api/comments/1").expect(204);
      });

      test("400 - DELETE: Responds with an appropriate error when invalid comment_id provided", () => {
        return request(app)
          .delete("/api/comments/blahcomment")
          .expect(400)
          .then(({ body: { message } }) => {
            expect(message).toBe("Bad request");
          });
      });

      test("404 - DELETE: Responds with an appropriate error when nonexistent comment_id provided", () => {
        return request(app)
          .delete("/api/comments/757")
          .expect(404)
          .then(({ body: { message } }) => {
            expect(message).toBe("No data found");
          });
      });
    });

    describe("patchComment", () => {
      test("200 - PATCH: Responds with an updated comment", () => {
        const body = { inc_votes: -1 };
        return request(app)
          .patch("/api/comments/1")
          .send(body)
          .expect(200)
          .then(({ body: { updatedComment } }) => {
            expect(updatedComment).toMatchObject({
              comment_id: 1,
              body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
              votes: 15,
              author: "butter_bridge",
              article_id: 9,
              created_at: expect.any(String),
            });
          });
      });

      test("400 - PATCH: Responds with an appropriate error when invalid comment_id provided", () => {
        const body = {
          inc_vote: 5,
        };
        return request(app)
          .patch("/api/comments/blahblah")
          .send(body)
          .expect(400)
          .then(({ body: { message } }) => {
            expect(message).toBe("Bad request");
          });
      });

      test("400 - PATCH: Responds with an appropriate error when invalid inc_vote provided", () => {
        const body = {
          inc_vote: "sdfsdf",
        };
        return request(app)
          .patch("/api/comments/3")
          .send(body)
          .expect(400)
          .then(({ body: { message } }) => {
            expect(message).toBe("Bad request");
          });
      });

      test("404 - PATCH: Responds with an appropriate error when nonexistent comment_id provided", () => {
        const body = {
          inc_vote: 5,
        };
        return request(app)
          .patch("/api/comments/555")
          .send(body)
          .expect(404)
          .then(({ body: { message } }) => {
            expect(message).toBe("No data found");
          });
      });
    });
  });

  describe("USERS endpoints", () => {
    describe("getUsers", () => {
      test("GET 200: Responds with an array of 4 users", () => {
        return request(app)
          .get("/api/users")
          .expect(200)
          .then(({ body: { users } }) => {
            expect(users).toHaveLength(4);
            users.forEach((user) => {
              expect(user).toMatchObject({
                username: expect.any(String),
                name: expect.any(String),
                avatar_url: expect.any(String),
              });
            });
          });
      });
    });

    describe("getUserByUserName", () => {
      test("GET - 200: Responds with a user by provided username", () => {
        return request(app)
          .get("/api/users/lurker")
          .expect(200)
          .then(({ body: { user } }) => {
            expect(user).toMatchObject({
              username: "lurker",
              name: "do_nothing",
              avatar_url:
                "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png",
            });
          });
      });

      test("GET - 404: Responds with an appropriate error when nonexistent username passed", () => {
        return request(app)
          .get("/api/users/malina")
          .expect(404)
          .then(({ body: { message } }) => {
            expect(message).toBe("No data found");
          });
      });
    });
  });
});
