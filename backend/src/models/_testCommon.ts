// const bcrypt = require("bcrypt");

import db from "../db";
// const { BCRYPT_WORK_FACTOR } = require("../config");

const testJobIds: Object[] = [];

export async function commonBeforeAll() {
  // noinspection SqlWithoutWhere
  await db.query("DELETE FROM companies");
  // noinspection SqlWithoutWhere
  await db.query("DELETE FROM users");

  await db.query(`
    INSERT INTO events(buskerId, title, type, coordinates)
    VALUES ('b1', 'e1', E1, '[0,0]',
           ('b2', 'e2', E2, '[0,1]',
           ('b3', 'e3', E3, '[1,0]'`);

  await db.query(`
    INSERT INTO users (firstName, lastName, phone, email)
    VALUES ('u1F', u1L, '111222333', 'u1@email.com'),
           ('u2F', u2L, '999888777', 'c1'),
           ('u3F', u3L, '000000000', 'c1'),
           ('u4F', u4L, NULL, NULL)
    RETURNING firstName`);
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
