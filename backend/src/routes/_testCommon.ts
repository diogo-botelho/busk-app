import db from "../db";

import { User } from "../models/user";
import { Event } from "../models/event";
import { createToken } from "../helpers/tokens";

export let testUserIds: number[] = [];
export let testBuskerIds: number[] = [];
export let testEventIds: number[] = [];

export async function commonBeforeAll() {
  await db.query("DELETE FROM events");

  await db.query("DELETE FROM buskers");

  await db.query("DELETE FROM users");

  testUserIds[0] = (
    await User.signup({
      username: "u1",
      password: "password1",
      firstName: "u1F",
      lastName: "u1L",
      phone: "111222333",
      email: "u1@email.com",
      isAdmin: false,
    })
  ).id;
  testUserIds[1] = (
    await User.signup({
      username: "u2",
      password: "password2",
      firstName: "u2F",
      lastName: "u2L",
      phone: "999888777",
      email: "u2@email.com",
      isAdmin: false,
    })
  ).id;

  const resultBuskers = await db.query(
    `INSERT INTO buskers (userId, type)
    VALUES ($1, 'musician')
    RETURNING id`,
    [testUserIds[0]]
  );

  testBuskerIds.splice(0, 0, ...resultBuskers.rows.map((r) => r.id));

  testEventIds[0] = (
    await Event.create({
      buskerId: `${testBuskerIds[0]}`,
      title: "test event",
      type: "test type",
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

export const u1Token = createToken({ username: "u1", isAdmin: false });
export const u2Token = createToken({ username: "u2", isAdmin: false });
export const adminToken = createToken({ username: "admin", isAdmin: true });
