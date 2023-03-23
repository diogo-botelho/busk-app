// const bcrypt = require("bcrypt");

import db from "../db";
// const { BCRYPT_WORK_FACTOR } = require("../config");

export let testUsers: number[] = [];
export let testBuskers: number[] = [];
export let testEvents: number[] = [];

export async function commonBeforeAll() {
  await db.query("DELETE FROM events");

  await db.query("DELETE FROM buskers");

  await db.query("DELETE FROM users");

  const resultUsers = await db.query(`
  INSERT INTO users (username, password, first_name, last_name, phone, email)
  VALUES ('u1','password1','u1F', 'u1L', '111222333', 'u1@email.com'),
         ('u2','password2','u2F', 'u2L', '999888777', 'u2@email.com')
         returning id`);
  testUsers.splice(0, 0, ...resultUsers.rows.map((r) => r.id));

  const resultBuskers = await db.query(
    `INSERT INTO buskers (userId, type)
  VALUES ($1, 'musician')
  RETURNING id`,
    [testUsers[0]]
  );
  testBuskers.splice(0, 0, ...resultBuskers.rows.map((r) => r.id));

  const resultEvents = await db.query(
    `
    INSERT INTO events(busker_id, title, type, coordinates)
    VALUES ($1, 'e1', 'E1', '{"lat":0,"lng":0}')
    RETURNING id`,
    [testBuskers[0]]
  );
  testEvents.splice(0, 0, ...resultEvents.rows.map((r) => r.id));
}

export async function commonBeforeEach() {
  await db.query("BEGIN");
}

export async function commonAfterEach() {
  await db.query("ROLLBACK");
}

export async function commonAfterAll() {
  await db.end();
}
