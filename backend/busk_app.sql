\echo 'Delete and recreate busk_app db?'
\prompt 'Return for yes or control-C to cancel > ' foo

/* BUSK_APP
*/

DROP DATABASE IF EXISTS busk_app;
CREATE DATABASE busk_app;
\connect busk_app;

/* USERS TABLE */
CREATE TABLE users(
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE
  -- https://www.youtube.com/watch?v=hpgNx89B8Y4
  -- type TEXT NOT NULL DEFAULT 'user'
);

INSERT INTO users (name)
VALUES ('Diogo Botelho');

INSERT INTO users (name)
VALUES ('Mirjam van Esch');


/* BUSKERS TABLE */

CREATE TABLE buskers (
  id SERIAL PRIMARY KEY,
  userId INTEGER NOT NULL REFERENCES users,
  type TEXT NOT NULL
);

INSERT INTO buskers (userId, type)
VALUES (1, 'musician');

/* EVENTS TABLE */

CREATE TABLE events(
  id SERIAL PRIMARY KEY,
  buskerId INTEGER NOT NULL REFERENCES buskers,
  title TEXT NOT NULL,
  type TEXT NOT NULL UNIQUE
);

INSERT INTO events (buskerId, title, type)
VALUES (1, 'Diogo rocks in Central Park', 'concert');

/* BUSK_APP_TEST
*/

\echo 'Delete and recreate users_test db?'
\prompt 'Return for yes or control-C to cancel > ' foo

DROP DATABASE IF EXISTS busk_app_test;
CREATE DATABASE busk_app_test;
\connect busk_app_test;

CREATE TABLE users(
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  type TEXT NOT NULL DEFAULT 'user'
);

CREATE TABLE buskers (
  id SERIAL PRIMARY KEY,
  userId INTEGER NOT NULL REFERENCES users,
  type TEXT NOT NULL UNIQUE
);

  CREATE TABLE events(
  id SERIAL PRIMARY KEY,
  buskerId INTEGER NOT NULL REFERENCES buskers,
  title TEXT NOT NULL,
  type TEXT NOT NULL UNIQUE
);