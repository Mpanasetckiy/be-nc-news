# Northcoders News API

It is the API for the purpose of accessing application data programmatically. The intention here is to mimic the building of a real world backend service (such as Reddit) which should provide this information to the front end architecture

## Table of Contents

1. [Installation](#installation)
2. [Testing](#testing)
3. [Usage](#usage)

## Installation

To set up the local environment, follow these steps:

1. Clone the repository from GitHub:

   ```
   git clone https://github.com/Mpanasetckiy/be-nc-news.git
   ```

2. You will need to create two `.env` files for your project: `.env.test` and `.env.development`. Into each, add `PGDATABASE=`, with the correct database name for that environment (see `/db/setup.sql` for the database names). Double check that these `.env` files are `.gitignored`.

3. You'll need to run npm install at this point.

   ```
   npm install
   ```

4. You'll need to create dev database and test database running the following command:

   ```
   npm run setup-dbs
   ```

5. After installing dependencies and creating the databases, you'll need to seed db with the following command:

   ```
   npm run seed
   ```

## Testing

### Prerequisites

- Familiarise yourself with the available endpoints and their parameters.
- Make sure you have installed all dependencies.
- Make sure you have PSQL database active and running OR remote database URL is provided.

### Manual Testing

- Manual testing is available using tools like Postman or Insomnia via sending HTTP requests to the API endpoints.
- Integrations tests are provided with predefined inputs and verify the expected outputs.

Available via the following command:

```
npm run test
```

## Requirements

Ensure that your system meets the following requirements to use the API:

- **Node.js**: Version 20.x or higher installed on your machine.
- **Database**: Version 16.x or higher installed on your machine.

## Usage

### Base URL

This URL is for accessing the NEWS API:

https://be-nc-news-0820.onrender.com/api

### Endpoints

For detailed information on available endpoints and their outcome, refer to the [Endpoints Description](https://be-nc-news-0820.onrender.com/api).

### Available Endpoints

#### General

`GET /api`

- responds with a list of available endpoints

`GET /api/topics`

- responds with a list of topics

`POST /api/topics`

- serves with a newly created topic

#### Articles

`GET /api/articles`

- responds with a list of articles

`GET /api/articles (queries)`

- allows articles to be filtered and sorted

`GET /api/articles/:article_id`

- responds with a single article by article_id

`GET /api/articles/:article_id (comment count)`

- adds a comment count to the response when retrieving a single article

`POST /api/articles`

- creates an article and serves with a newly created article

`PATCH /api/articles/:article_id`

- updates an article by article_id

`DELETE /api/articles/:article_id`

- deletes an article by article_id

#### Comments

`GET /api/articles/:article_id/comments`

- responds with a list of comments by article_id

`POST /api/articles/:article_id/comments`

- add a comment by article_id

`PATCH /api/comments/:comment_id`

- updates a comment by comment_id

`DELETE /api/comments/:comment_id`

- deletes a comment by comment_id

#### Users

`GET /api/users`

- responds with a list of users

`GET /api/users/:username`

- responds with a user by username
