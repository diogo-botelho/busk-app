import request from "supertest";

import db from "../db";
import app from "../app";

import {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  testUserIds,
  testBuskerIds,
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

  test("works for correct user: create busker", async function () {
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

  test("unauth for wrong user", async function () {
    const resp = await request(app)
      .post("/buskers")
      .send({
        buskerName: "newBuskerName",
        category: "musician",
        description: "A new performer",
        userId: testUserIds[0],
      })
      .set("authorization", `Bearer ${u2Token}`);
    expect(resp.statusCode).toEqual(401);
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
        userId: testUserIds[0],
        updateData: {
          buskerName: "New",
        },
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
        userId: testUserIds[0],
        updateData: {
          buskerName: "New",
        },
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

  test("unauth if not same busker", async function () {
    console.log("patch, unauth if not same busker");
    const resp = await request(app)
      .patch(`/buskers/${testBuskerNames[0]}`)
      .send({
        userId: testUserIds[0],
        updateData: {
          buskerName: "New",
        },
      })
      .set("authorization", `Bearer ${u2Token}`);
    expect(resp.statusCode).toEqual(401);
  });

  test("unauth for anon", async function () {
    console.log("patch, unauth for anon");
    const resp = await request(app)
      .patch(`/buskers/${testBuskerNames[0]}`)
      .send({
        userId: testUserIds[0],
        updateData: {
          buskerName: "New",
        },
      });
    expect(resp.statusCode).toEqual(401);
  });

  test("fails if no such busker", async function () {
    console.log("patch, not found if no such busker");
    const resp = await request(app)
      .patch(`/buskers/0`)
      .send({
        userId: testUserIds[0],
        updateData: {
          buskerName: "Nope",
        },
      })
      .set("authorization", `Bearer ${adminToken}`);
    expect(resp.statusCode).toEqual(401);
  });

  test("bad request if invalid data", async function () {
    console.log("patch, bad request if invalid data");
    const resp = await request(app)
      .patch(`/buskers/${testBuskerNames[0]}`)
      .send({
        userId: testUserIds[0],
        updateData: {
          buskerName: 42,
        },
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
      .send({ userId: testUserIds[0] })
      .set("authorization", `Bearer ${adminToken}`);
    expect(resp.body).toEqual(
      `Busker ${testBuskerNames[0]} was successfully deleted.`
    );
  });

  test("works for same busker", async function () {
    const resp = await request(app)
      .delete(`/buskers/${testBuskerNames[0]}`)
      .send({ userId: testUserIds[0] })
      .set("authorization", `Bearer ${u1Token}`);
    expect(resp.body).toEqual(
      `Busker ${testBuskerNames[0]} was successfully deleted.`
    );
  });

  test("unauth if not same busker", async function () {
    const resp = await request(app)
      .delete(`/buskers/${testBuskerNames[0]}`)
      .send({ userId: testUserIds[0] })
      .set("authorization", `Bearer ${u2Token}`);
    expect(resp.statusCode).toEqual(401);
  });

  test("unauth for anon", async function () {
    const resp = await request(app)
      .delete(`/buskers/${testBuskerNames[0]}`)
      .send({ userId: testUserIds[0] });
    expect(resp.statusCode).toEqual(401);
  });

  test("fails if busker doesn't exist", async function () {
    const resp = await request(app)
      .delete(`/buskers/0`)
      .send({ userId: testUserIds[0] })
      .set("authorization", `Bearer ${adminToken}`);
    expect(resp.statusCode).toEqual(401);
  });
});
