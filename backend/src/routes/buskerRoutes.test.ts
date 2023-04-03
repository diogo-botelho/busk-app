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

import { Busker } from "../models/busker";

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/************************************** GET /buskers */

describe("GET /buskers/", function () {
  test("works for admin", async function () {
    const resp = await request(app)
      .get(`/buskers`)
      .set("authorization", `Bearer ${adminToken}`);
    expect(resp.body).toEqual([
      {
        buskerName: "u1BuskerName1",
        category: "musician",
        description: "A fun performer",
        id: expect.any(Number),
        userId: testUserIds[0],
      },
      {
        buskerName: "u1BuskerName2",
        category: "juggler",
        description: "A great performer",
        id: expect.any(Number),
        userId: testUserIds[0],
      },
    ]);
  });

  test("works for no busker", async function () {
    const resp = await request(app).get(`/buskers`);
    expect(resp.body).toEqual([
      {
        buskerName: "u1BuskerName1",
        category: "musician",
        description: "A fun performer",
        id: expect.any(Number),
        userId: testUserIds[0],
      },
      {
        buskerName: "u1BuskerName2",
        category: "juggler",
        description: "A great performer",
        id: expect.any(Number),
        userId: testUserIds[0],
      },
    ]);
  });

  test("fails: test next() handler", async function () {
    // there's no normal failure event which will cause this route to fail ---
    // thus making it hard to test that the error-handler works with it. This
    // should cause an error, all right :)
    await db.query("DROP TABLE buskers CASCADE");
    const resp = await request(app)
      .get("/buskers")
      .set("authorization", `Bearer ${adminToken}`);
    expect(resp.statusCode).toEqual(500);
  });
});

/************************************** GET /buskers/:buskerName */

describe("GET /buskers/:id", function () {
  test("works for admin", async function () {
    const resp = await request(app)
      .get(`/buskers/${testBuskerNames[0]}`)
      .set("authorization", `Bearer ${adminToken}`);
    expect(resp.body).toEqual({
      buskerName: testBuskerNames[0],
      category: "musician",
      description: "A fun performer",
      id: expect.any(Number),
      userId: testUserIds[0],
    });
  });

  test("works for same busker", async function () {
    const resp = await request(app)
      .get(`/buskers/${testBuskerNames[0]}`)
      .set("authorization", `Bearer ${u1Token}`);
    expect(resp.body).toEqual({
      buskerName: testBuskerNames[0],
      category: "musician",
      description: "A fun performer",
      id: expect.any(Number),
      userId: testUserIds[0],
    });
  });

  test("works for no busker", async function () {
    const resp = await request(app).get(`/buskers/${testBuskerNames[0]}`);
    expect(resp.body).toEqual({
      buskerName: testBuskerNames[0],
      category: "musician",
      description: "A fun performer",
      id: expect.any(Number),
      userId: testUserIds[0],
    });
  });

  test("not found if busker not found", async function () {
    const resp = await request(app)
      .get(`/buskers/0`)
      .set("authorization", `Bearer ${adminToken}`);
    expect(resp.statusCode).toEqual(404);
  });
});

/************************************** POST /buskers */

describe("POST /buskers", function () {
  test("works for admins: create busker", async function () {
    const resp = await request(app)
      .post("/buskers")
      .send({
        buskerName: "newBuskerName",
        category: "musician",
        description: "A new performer",
        userId: testUserIds[0],
      })
      .set("authorization", `Bearer ${adminToken}`);
    expect(resp.statusCode).toEqual(201);
    expect(resp.body).toEqual({
      buskerName: "newBuskerName",
      category: "musician",
      description: "A new performer",
      id: expect.any(Number),
      userId: testUserIds[0],
    });
  });

  test("works for existing user: create busker", async function () {
    const resp = await request(app)
      .post("/buskers")
      .send({
        buskerName: "newBuskerName",
        category: "musician",
        description: "A new performer",
        userId: testUserIds[0],
      })
      .set("authorization", `Bearer ${u1Token}`);
    expect(resp.statusCode).toEqual(201);
    expect(resp.body).toEqual({
      buskerName: "newBuskerName",
      category: "musician",
      description: "A new performer",
      id: expect.any(Number),
      userId: testUserIds[0],
    });
  });

  test("unauth for anon", async function () {
    const resp = await request(app).post("/buskers").send({
      buskerName: "newBuskerName",
      category: "musician",
      description: "A new performer",
      userId: testUserIds[0],
    });
    expect(resp.statusCode).toEqual(401);
  });

  test("bad request if missing data", async function () {
    const resp = await request(app)
      .post("/buskers")
      .send({
        buskerName: "newBuskerName",
      })
      .set("authorization", `Bearer ${adminToken}`);
    expect(resp.statusCode).toEqual(400);
  });

  test("bad request if invalid data", async function () {
    const resp = await request(app)
      .post("/buskers")
      .send({
        buskerName: "newBuskerName",
        category: "non-exisitent-category",
        description: "A new performer",
        userId: testUserIds[0],
      })
      .set("authorization", `Bearer ${adminToken}`);
    expect(resp.statusCode).toEqual(400);
  });
});

/************************************** PATCH /buskers/:id */

describe("PATCH /buskers/:buskerName", () => {
  test("works for admins", async function () {
    const resp = await request(app)
      .patch(`/buskers/${testBuskerNames[0]}`)
      .send({
        buskerName: "New",
      })
      .set("authorization", `Bearer ${adminToken}`);
    expect(resp.body).toEqual({
      busker: {
        buskerName: "New",
        category: "musician",
        description: "A fun performer",
        id: expect.any(Number),
        userId: testUserIds[0],
      },
    });
  });

  test("works for same busker", async function () {
    const resp = await request(app)
      .patch(`/buskers/${testBuskerNames[0]}`)
      .send({
        buskerName: "New",
      })
      .set("authorization", `Bearer ${u1Token}`);
    expect(resp.body).toEqual({
      busker: {
        buskerName: "New",
        category: "musician",
        description: "A fun performer",
        id: expect.any(Number),
        userId: testUserIds[0],
      },
    });
  });

  // ROUTE NEEDS PROPER AUTHORIZATION FOR TEST TO PASS
  test("unauth if not same busker", async function () {
    const resp = await request(app)
      .patch(`/buskers/${testBuskerNames[0]}`)
      .send({
        buskerName: "New",
      })
      .set("authorization", `Bearer ${u2Token}`);
    expect(resp.statusCode).toEqual(401);
  });

  // ROUTE NEEDS PROPER AUTHORIZATION FOR TEST TO PASS
  test("unauth for anon", async function () {
    const resp = await request(app)
      .patch(`/buskers/${testBuskerNames[0]}`)
      .send({
        buskerName: "New",
      });
    expect(resp.statusCode).toEqual(401);
  });

  test("not found if no such busker", async function () {
    const resp = await request(app)
      .patch(`/buskers/0`)
      .send({
        buskerName: "Nope",
      })
      .set("authorization", `Bearer ${adminToken}`);
    expect(resp.statusCode).toEqual(404);
  });

  //NEEDS JSON SCHEMA
  test("bad request if invalid data", async function () {
    const resp = await request(app)
      .patch(`/buskers/${testBuskerNames[0]}`)
      .send({
        buskerName: 42,
      })
      .set("authorization", `Bearer ${adminToken}`);
    expect(resp.statusCode).toEqual(400);
  });
});

/************************************** DELETE /buskers/:buskerName */

describe("DELETE /buskers/:buskerName", function () {
  test("works for admin", async function () {
    const resp = await request(app)
      .delete(`/buskers/${testBuskerNames[0]}`)
      .set("authorization", `Bearer ${adminToken}`);
    expect(resp.body.message).toEqual(`User ${testBuskerNames[0]} deleted.`);
  });

  // NEEDS PROPER AUTH TO WORK
  test("works for same busker", async function () {
    const resp = await request(app)
      .delete(`/buskers/${testBuskerNames[0]}`)
      .set("authorization", `Bearer ${u1Token}`);
    expect(resp.body).toEqual(`User ${testBuskerNames[0]} deleted.`);
  });

  test("unauth if not same busker", async function () {
    const resp = await request(app)
      .delete(`/buskers/${testBuskerNames[0]}`)
      .set("authorization", `Bearer ${u2Token}`);
    expect(resp.statusCode).toEqual(401);
  });

  test("unauth for anon", async function () {
    const resp = await request(app).delete(`/buskers/${testBuskerNames[0]}`);
    expect(resp.statusCode).toEqual(401);
  });

  test("not found if busker doesn't exist", async function () {
    const resp = await request(app)
      .delete(`/buskers/0`)
      .set("authorization", `Bearer ${adminToken}`);
    expect(resp.statusCode).toEqual(404);
  });
});
