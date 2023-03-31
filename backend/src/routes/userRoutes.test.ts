import request from "supertest";

import db from "../db";
import app from "../app";

import {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  testUserIds,
  testBuskerNames,
  u1Token,
  u2Token,
  adminToken,
} from "./_testCommon";

import { User } from "../models/user";

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/************************************** POST /users */

describe("POST /users", function () {
  test("works for admins: create non-admin", async function () {
    const resp = await request(app)
      .post("/users")
      .send({
        email: "new@email.com",
        password: "password-new",
        firstName: "First-new",
        lastName: "Last-newL",
        phone: "1111111111",
        isAdmin: false
      })
      .set("authorization", `Bearer ${adminToken}`);
    expect(resp.statusCode).toEqual(201);
    expect(resp.body).toEqual({
      user: {
        id: expect.any(Number),
        email: "new@email.com",
        firstName: "First-new",
        lastName: "Last-newL",
        phone: "1111111111",
        isAdmin: false
      },
      token: expect.any(String),
    });
  });

  test("works for admins: create admin", async function () {
    const resp = await request(app)
      .post("/users")
      .send({
        email: "new@email.com",
        password: "password-new",
        firstName: "First-new",
        lastName: "Last-newL",
        phone: "1111111111",
        isAdmin: true
      })
      .set("authorization", `Bearer ${adminToken}`);
    expect(resp.statusCode).toEqual(201);
    expect(resp.body).toEqual({
      user: {
        id: expect.any(Number),
        email: "new@email.com",
        firstName: "First-new",
        lastName: "Last-newL",
        phone: "1111111111",
        isAdmin: true
      },
      token: expect.any(String),
    });
  });

  test("unauth for users", async function () {
    const resp = await request(app)
      .post("/users")
      .send({
        email: "new@email.com",
        password: "password-new",
        firstName: "First-new",
        lastName: "Last-newL",
        phone: "111111111",
      })
      .set("authorization", `Bearer ${u1Token}`);
    expect(resp.statusCode).toEqual(401);
  });

  test("unauth for anon", async function () {
    const resp = await request(app).post("/users").send({
      email: "new@email.com",
      password: "password-new",
      firstName: "First-new",
      lastName: "Last-newL",
      phone: "111111111",
      isAdmin: false
    });
    expect(resp.statusCode).toEqual(401);
  });

  test("bad request if missing data", async function () {
    const resp = await request(app)
      .post("/users")
      .send({
        email: "u-new@email.com",
      })
      .set("authorization", `Bearer ${adminToken}`);
    expect(resp.statusCode).toEqual(400);
  });

  test("bad request if invalid data", async function () {
    const resp = await request(app)
      .post("/users")
      .send({
        email: "not-an-email",
        firstName: "First-new",
        lastName: "Last-newL",
        password: "password-new",
      })
      .set("authorization", `Bearer ${adminToken}`);
    expect(resp.statusCode).toEqual(400);
  });
});

/************************************** GET /users */

describe("GET /users", function () {
  test("works for admins", async function () {
    const resp = await request(app)
      .get("/users")
      .set("authorization", `Bearer ${adminToken}`);
    expect(resp.body).toEqual([
      {
        email: "u1@email.com",
        firstName: "u1F",
        lastName: "u1L",
        phone: "111222333",
      },
      {
        email: "u2@email.com",
        firstName: "u2F",
        lastName: "u2L",
        phone: "999888777",
      },
    ]);
  });

  test("unauth for non-admin users", async function () {
    const resp = await request(app)
      .get("/users")
      .set("authorization", `Bearer ${u1Token}`);
    expect(resp.statusCode).toEqual(401);
  });

  test("unauth for anon", async function () {
    const resp = await request(app).get("/users");
    expect(resp.statusCode).toEqual(401);
  });

  test("fails: test next() handler", async function () {
    // there's no normal failure event which will cause this route to fail ---
    // thus making it hard to test that the error-handler works with it. This
    // should cause an error, all right :)
    await db.query("DROP TABLE users CASCADE");
    const resp = await request(app)
      .get("/users")
      .set("authorization", `Bearer ${adminToken}`);
    expect(resp.statusCode).toEqual(500);
  });
});

/************************************** GET /users/:id */

describe("GET /users/:id", function () {
  test("works for admin", async function () {
    const resp = await request(app)
      .get(`/users/${testUserIds[0]}`)
      .set("authorization", `Bearer ${adminToken}`);
    expect(resp.body).toEqual({
      id: testUserIds[0],
      email: "u1@email.com",
      firstName: "u1F",
      lastName: "u1L",
      phone: "111222333",
      buskerNames: testBuskerNames,
    });
  });

  test("works for same user", async function () {
    const resp = await request(app)
      .get(`/users/${testUserIds[0]}`)
      .set("authorization", `Bearer ${u1Token}`);
    expect(resp.body).toEqual({
      id: testUserIds[0],
      email: "u1@email.com",
      firstName: "u1F",
      lastName: "u1L",
      phone: "111222333",
      buskerNames: testBuskerNames,
    });
  });

  test("unauth for other users", async function () {
    const resp = await request(app)
      .get(`/users/${testUserIds[0]}`)
      .set("authorization", `Bearer ${u2Token}`);
    expect(resp.statusCode).toEqual(401);
  });

  test("unauth for anon", async function () {
    const resp = await request(app).get(`/users/${testUserIds[0]}`);
    expect(resp.statusCode).toEqual(401);
  });

  test("not found if user not found", async function () {
    const resp = await request(app)
      .get(`/users/0`)
      .set("authorization", `Bearer ${adminToken}`);
    expect(resp.statusCode).toEqual(404);
  });

  test("bad request if bad param", async function () {
    const resp = await request(app)
      .get(`/users/nope`)
      .set("authorization", `Bearer ${adminToken}`);
    expect(resp.statusCode).toEqual(400);
  });
});

/************************************** PATCH /users/:id */

describe("PATCH /users/:id", () => {
  test("works for admins", async function () {
    const resp = await request(app)
      .patch(`/users/${testUserIds[0]}`)
      .send({
        firstName: "New",
      })
      .set("authorization", `Bearer ${adminToken}`);
    expect(resp.body).toEqual({
      user: {
        firstName: "New",
        lastName: "u1L",
        phone: "111222333",
        email: "u1@email.com",
      },
    });
  });

  test("works for same user", async function () {
    const resp = await request(app)
      .patch(`/users/${testUserIds[0]}`)
      .send({
        firstName: "New",
      })
      .set("authorization", `Bearer ${u1Token}`);
    expect(resp.body).toEqual({
      user: {
        email: "u1@email.com",
        firstName: "New",
        lastName: "u1L",
        phone: "111222333",
      },
    });
  });

  test("unauth if not same user", async function () {
    const resp = await request(app)
      .patch(`/users/u1`)
      .send({
        firstName: "New",
      })
      .set("authorization", `Bearer ${u2Token}`);
    expect(resp.statusCode).toEqual(401);
  });

  test("unauth for anon", async function () {
    const resp = await request(app).patch(`/users/u1`).send({
      firstName: "New",
    });
    expect(resp.statusCode).toEqual(401);
  });

  test("not found if no such user", async function () {
    const resp = await request(app)
      .patch(`/users/0`)
      .send({
        firstName: "Nope",
      })
      .set("authorization", `Bearer ${adminToken}`);
    expect(resp.statusCode).toEqual(404);
  });

  //NEEDS JSON SCHEMA
  test("bad request if invalid data", async function () {
    const resp = await request(app)
      .patch(`/users/u1`)
      .send({
        firstName: 42,
      })
      .set("authorization", `Bearer ${adminToken}`);
    expect(resp.statusCode).toEqual(400);
  });

  test("works: can set new password", async function () {
    const resp = await request(app)
      .patch(`/users/${testUserIds[0]}`)
      .send({
        password: "new-password",
      })
      .set("authorization", `Bearer ${u1Token}`);
    expect(resp.body).toEqual({
      user: {
        email: "u1@email.com",
        firstName: "u1F",
        lastName: "u1L",
        phone: "111222333",
      },
    });
    const isSuccessful = await User.authenticate("u1@email.com", "new-password");
    expect(isSuccessful).toBeTruthy();
  });
});

/************************************** DELETE /users/:id */

describe("DELETE /users/:id", function () {
  test("works for admin", async function () {
    const resp = await request(app)
      .delete(`/users/${testUserIds[0]}`)
      .set("authorization", `Bearer ${adminToken}`);
    expect(resp.body).toEqual({ deleted: testUserIds[0] });
  });

  test("works for same user", async function () {
    const resp = await request(app)
      .delete(`/users/${testUserIds[0]}`)
      .set("authorization", `Bearer ${u1Token}`);
    expect(resp.body).toEqual({ deleted: testUserIds[0] });
  });

  test("unauth if not same user", async function () {
    const resp = await request(app)
      .delete(`/users/${testUserIds[0]}`)
      .set("authorization", `Bearer ${u2Token}`);
    expect(resp.statusCode).toEqual(401);
  });

  test("unauth for anon", async function () {
    const resp = await request(app).delete(`/users/${testUserIds[0]}`);
    expect(resp.statusCode).toEqual(401);
  });

  test("not found if user missing", async function () {
    const resp = await request(app)
      .delete(`/users/0`)
      .set("authorization", `Bearer ${adminToken}`);
    expect(resp.statusCode).toEqual(404);
  });
});
