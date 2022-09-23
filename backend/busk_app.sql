\echo 'Delete and recreate busk_app db?'
\prompt 'Return for yes or control-C to cancel > ' foo

DROP DATABASE IF EXISTS busk_app;
CREATE DATABASE busk_app;
\connect busk_app;

CREATE TABLE users(
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  -- https://www.youtube.com/watch?v=hpgNx89B8Y4
  type TEXT NOT NULL DEFAULT 'user'
);

INSERT INTO users (name,type)
VALUES ('Diogo Botelho','busker');

INSERT INTO users (name)
VALUES ('Mirjam van Esch');


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