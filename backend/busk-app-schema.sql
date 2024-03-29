/* USERS TABLE */
CREATE TABLE users(
  id SERIAL PRIMARY KEY,
  email TEXT NOT NULL UNIQUE
    CHECK (position('@' IN email) > 1),
  password TEXT NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  phone TEXT NOT NULL UNIQUE,
  is_admin BOOLEAN NOT NULL DEFAULT FALSE
);

/* BUSKERS TABLE */
CREATE TABLE buskers(
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users ON DELETE CASCADE,
  busker_name TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL,
  description TEXT
);

/* EVENTS TABLE */
CREATE TABLE events(
  id SERIAL PRIMARY KEY,
  busker_id INTEGER NOT NULL REFERENCES buskers ON DELETE CASCADE,
  title TEXT NOT NULL,
  type TEXT NOT NULL,
  date TEXT NOT NULL,
  start_time TEXT NOT NULL,
  end_time TEXT NOT NULL,
  coordinates JSON NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
