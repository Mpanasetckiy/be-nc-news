# Northcoders News API

It is the API for the purpose of accessing application data programmatically. The intention here is to mimic the building of a real world backend service (such as Reddit) which should provide this information to the front end architecture

## Table of Contents

1. [Installation](#installation)

## Installation

You will need to create two `.env` files for your project: `.env.test` and `.env.development`. Into each, add `PGDATABASE=`, with the correct database name for that environment (see `/db/setup.sql` for the database names). Double check that these `.env` files are `.gitignored`.

You'll need to run npm install at this point.

```
npm install
```
