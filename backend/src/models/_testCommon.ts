import bcrypt from "bcrypt";
import db from "../db";

import { BCRYPT_WORK_FACTOR } from "../config";

export let testUsers: number[] = [];
export let testBuskers: number[] = [];
export let testEvents: number[] = [];

export async function commonBeforeAll() {
  await db.query("DELETE FROM events");

  await db.query("DELETE FROM buskers");

  await db.query("DELETE FROM users");

  const resultUsers = await db.query(
    `
  INSERT INTO users (email, password, first_name, last_name, phone)
  VALUES ('u1@email.com',$1,'u1F', 'u1L', '111222333'),
         ('u2@email.com',$2,'u2F', 'u2L', '999888777')
         returning id`,
    [
      await bcrypt.hash("password1", BCRYPT_WORK_FACTOR),
      await bcrypt.hash("password2", BCRYPT_WORK_FACTOR),
    ]
  );
  testUsers.splice(0, 0, ...resultUsers.rows.map((r) => r.id));

  await db.query(
    `INSERT INTO buskers (user_id, busker_name, category, description)
  VALUES ($1, 'u1BuskerName1', 'musician', 'A fun performer')
  RETURNING id`,
    [testUsers[0]]
  );
  await db.query(
    `INSERT INTO buskers (user_id, busker_name, category, description)
  VALUES ($1, 'u1BuskerName2', 'juggler', 'A great performer')
  RETURNING id`,
    [testUsers[0]]
  );

  const resultBuskers = await db.query(
    `SELECT * 
      FROM buskers`
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
