import request from "supertest";

import db from "../db";
import app from "../app";

import { User } from "../models/user";
import {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll
} from "./_testCommon";

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/************************************** POST /auth/login */

describe("POST /auth/login", function () {
  test("works", async function () {
    const resp = await request(app).post("/auth/login").send({
      email: "u1@email.com",
      password: "password1",
    });
    expect(resp.body).toEqual({
      token: expect.any(String),
    });
  });

  test("unauth with non-existent user", async function () {
    const resp = await request(app).post("/auth/login").send({
      email: "no-such-email@email.com",
      password: "password1",
    });
    expect(resp.statusCode).toEqual(401);
  });

  test("unauth with wrong password", async function () {
    const resp = await request(app).post("/auth/login").send({
      email: "u1@email.com",
      password: "nope",
    });
    expect(resp.statusCode).toEqual(401);
  });

  test("bad request with missing data", async function () {
    const resp = await request(app).post("/auth/login").send({
      email: "u1@email.com",
    });
    expect(resp.statusCode).toEqual(400);
  });

  test("bad request with invalid data", async function () {
    const resp = await request(app).post("/auth/login").send({
      email: 42,
      password: "above-is-a-number",
    });
    expect(resp.statusCode).toEqual(400);
  });
});

/************************************** POST /auth/signup */

describe("POST /auth/signup", function () {
  test("works for anon", async function () {
    const resp = await request(app).post("/auth/signup").send({
      email: "new@email.com",
      firstName: "first",
      lastName: "last",
      password: "password",
      phone: "1234567890",
    });
    expect(resp.statusCode).toEqual(201);
    expect(resp.body).toEqual({
      token: expect.any(String),
    });
  });

  test("bad request with missing fields", async function () {
    const resp = await request(app).post("/auth/signup").send({
      email: "new@email.com",
    });
    expect(resp.statusCode).toEqual(400);
  });

  test("bad request with invalid data", async function () {
    const resp = await request(app).post("/auth/signup").send({
      email: "not-an-email",
      firstName: "first",
      lastName: "last",
      password: "password",
      phone: "123456789",
    });
    expect(resp.statusCode).toEqual(400);
  });
});
