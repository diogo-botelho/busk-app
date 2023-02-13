\echo 'Delete and recreate busk_app db?'
\prompt 'Return for yes or control-C to cancel > ' foo

/* 
** BUSK_APP
*/

DROP DATABASE IF EXISTS busk_app;
CREATE DATABASE busk_app;
\connect busk_app;

/* USERS TABLE */
CREATE TABLE users(
  id SERIAL PRIMARY KEY,
  username TEXT NOT NULL UNIQUE,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  phone TEXT NOT NULL UNIQUE,
  email TEXT NOT NULL UNIQUE
  -- https://www.youtube.com/watch?v=hpgNx89B8Y4
  -- type TEXT NOT NULL DEFAULT 'user'
);

INSERT INTO users (username, first_name, last_name, phone, email)
VALUES ('diogobotelho','Diogo', 'Botelho', '1234567890', 'test@email.com' );

INSERT INTO users (username, first_name, last_name, phone, email)
VALUES ('samau', 'Sammy', 'Au', '11111111', 'test2@email.com');


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
  busker_id INTEGER NOT NULL REFERENCES buskers,
  title TEXT NOT NULL,
  type TEXT NOT NULL UNIQUE
);

INSERT INTO events (busker_id, title, type)
VALUES (1, 'Diogo rocks in Central Park', 'concert');

/* 
** BUSK_APP_TEST
*/

\echo 'Delete and recreate users_test db?'
\prompt 'Return for yes or control-C to cancel > ' foo

DROP DATABASE IF EXISTS busk_app_test;
CREATE DATABASE busk_app_test;
\connect busk_app_test;

CREATE TABLE users(
  id SERIAL PRIMARY KEY,
  username TEXT NOT NULL UNIQUE,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL
);

CREATE TABLE buskers (
  id SERIAL PRIMARY KEY,
  userId INTEGER NOT NULL REFERENCES users,
  type TEXT NOT NULL UNIQUE
);

  CREATE TABLE events(
  id SERIAL PRIMARY KEY,
  busker_id INTEGER NOT NULL REFERENCES buskers,
  title TEXT NOT NULL,
  type TEXT NOT NULL UNIQUE
);