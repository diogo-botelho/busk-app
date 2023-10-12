import db from "../db";

import { User } from "../models/user";
import { Event } from "../models/event";
import { createToken } from "../helpers/tokens";

export let testUserIds: number[] = [];
export let testBuskerNames: string[] = [];
export let testBuskerIds: number[] = [];
export let testEventIds: number[] = [];

export let u1Token: string = "";
export let u2Token: string = "";
export let adminToken = createToken(-1, true);

export async function commonBeforeAll() {
  await db.query("DELETE FROM events");
  await db.query("DELETE FROM buskers");
  await db.query("DELETE FROM users");

  testUserIds[0] = (
    await User.signup({
      email: "u1@email.com",
      password: "password1",
      firstName: "u1F",
      lastName: "u1L",
      phone: "111222333",
      isAdmin: false,
    })
  ).id;
  testUserIds[1] = (
    await User.signup({
      email: "u2@email.com",
      password: "password2",
      firstName: "u2F",
      lastName: "u2L",
      phone: "999888777",
      isAdmin: false,
    })
  ).id;

  u1Token = createToken(testUserIds[0], false);
  u2Token = createToken(testUserIds[1], false);

  await db.query(
    `INSERT INTO buskers (user_id, busker_name, category, description)
  VALUES ($1, 'u1BuskerName1', 'musician', 'A fun performer')
  RETURNING id`,
    [testUserIds[0]],
  );
  await db.query(
    `INSERT INTO buskers (user_id, busker_name, category, description)
  VALUES ($1, 'u1BuskerName2', 'juggler', 'A great performer')
  RETURNING id`,
    [testUserIds[0]],
  );

  const resultBuskers = await db.query(
    `SELECT id, busker_name AS "buskerName"
      FROM buskers`,
  );
  testBuskerIds.splice(0, 0, ...resultBuskers.rows.map((r) => r.id));
  testBuskerNames.splice(0, 0, ...resultBuskers.rows.map((r) => r.buskerName));

  testEventIds[0] = (
    await Event.create({
      buskerId: testBuskerIds[0],
      title: "test event",
      type: "test type",
      date: "Tue, Oct 10, 2023",
      startTime: "13:00",
      endTime: "14:00",
      coordinates: { lat: 0, lng: 0 },
    })
  ).id;
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
