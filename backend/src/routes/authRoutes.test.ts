import request from "supertest";

import db from "../db";
import app from "../app";

import { User } from "../models/user";
import {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  testUserIds,
  testBuskerIds,
  testEventIds,
  u1Token,
  u2Token,
  adminToken,
} from "./_testCommon";

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/************************************** POST /auth/login */

describe("POST /auth/login", function () {
  test("works", async function () {
    const resp = await request(app).post("/auth/login").send({
      username: "u1",
      password: "password1",
    });
    expect(resp.body).toEqual({
      token: expect.any(String),
    });
  });

  test("unauth with non-existent user", async function () {
    const resp = await request(app).post("/auth/login").send({
      username: "no-such-user",
      password: "password1",
    });
    expect(resp.statusCode).toEqual(401);
  });

  test("unauth with wrong password", async function () {
    const resp = await request(app).post("/auth/login").send({
      username: "u1",
      password: "nope",
    });
    expect(resp.statusCode).toEqual(401);
  });

  test("bad request with missing data", async function () {
    const resp = await request(app).post("/auth/login").send({
      username: "u1",
    });
    expect(resp.statusCode).toEqual(400);
  });

  test("bad request with invalid data", async function () {
    const resp = await request(app).post("/auth/login").send({
      username: 42,
      password: "above-is-a-number",
    });
    expect(resp.statusCode).toEqual(400);
  });
});

/************************************** POST /auth/signup */

describe("POST /auth/signup", function () {
  test("works for anon", async function () {
    const resp = await request(app).post("/auth/signup").send({
      username: "new",
      firstName: "first",
      lastName: "last",
      password: "password",
      phone: "1234567890",
      email: "new@email.com",
    });
    expect(resp.statusCode).toEqual(201);
    expect(resp.body).toEqual({
      token: expect.any(String),
    });
  });

  test("bad request with missing fields", async function () {
    const resp = await request(app).post("/auth/signup").send({
      username: "new",
    });
    expect(resp.statusCode).toEqual(400);
  });

  test("bad request with invalid data", async function () {
    const resp = await request(app).post("/auth/signup").send({
      username: "new",
      firstName: "first",
      lastName: "last",
      password: "password",
      phone: "123456789",
      email: "not-an-email",
    });
    expect(resp.statusCode).toEqual(400);
  });
});
