## Description

Test task INFIJOY

## Overview

API for creating users connect them with creating relations and making friends

## Installation

````bash
# Step 1: Clone the repository
git clone https://github.com/temirlanamangaliyev/infijoy-test-task

# Step 2: Install dependencies
cd infijoy-test-task
npm install

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
````

## Test

```bash
# unit tests
$ npm run test

# test coverage
$ npm run test:cov
```

$ API Documentation

In order to check the documentation you need to run API, and go by http://localhost:3000/api, it will open Swagger on local

$ Folder structure

$ Database schema

+--------------+ +-------------+ +-----------------+
| Users | | Friends | | Relationships |
+--------------+ +-------------+ +-----------------+
| id | | id | | id |
| name | | user_id | | follower_id |
| dob | | friend_id | | following_id |
| address | | createdAt | | createdAt |
| description | | deletedAt | | deletedAt |
| createdAt | +-------------+ +-----------------+
+--------------+
|
| 1:n
|
v
+----------------+
| Users |
+----------------+
| id |
| name |
| dob |
| address |
| description |
| createdAt |
+----------------+
|
| 1:n
|
v
+-----------------+
| Friends |
+-----------------+
| id |
| user_id |
| friend_id |
| createdAt |
| deletedAt |
+-----------------+
|
| n:1
|
v
+-----------------+
| Relationships |
+-----------------+
| id |
| follower_id |
| following_id |
| createdAt |
| deletedAt |
+-----------------+

- `Users` and `Friends` have a one-to-many relationship, where a user can have multiple friends.
- `Users` and `Relationships` also have a one-to-many relationship, where a user can have multiple relationships.

$ Env variables
