import request from "supertest";

import app from "../app";

import {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  testBuskerIds,
  testEventIds,
  adminToken,
  u1Token,
} from "./_testCommon";

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/************************************** GET /events */

describe("GET /events", function () {
  test("ok for anon", async function () {
    const resp = await request(app).get(`/events`);
    expect(resp.body).toEqual([
      {
        id: expect.any(Number),
        buskerId: testBuskerIds[0],
        title: "test event",
        type: "test type",
        coordinates: { lat: 0, lng: 0 },
      },
    ]);
  });
});

/************************************** GET /events/:id */

describe("GET /events/:id", function () {
  test("unauth for anon", async function () {
    const resp = await request(app).get(`/events/${testEventIds[0]}`);
    expect(resp.body).toEqual({
      event: {
        id: testEventIds[0],
        buskerId: testBuskerIds[0],
        title: "test event",
        type: "test type",
        coordinates: { lat: 0, lng: 0 },
      },
    });
  });

  test("not found if user not found", async function () {
    const resp = await request(app).get(`/events/0`);
    expect(resp.statusCode).toEqual(404);
  });
});

/************************************** POST /events */

describe("POST /events", function () {
  test("works for admins", async function () {
    const resp = await request(app)
      .post(`/events/create`)
      .send({
        buskerId: testBuskerIds[0],
        title: "test event title",
        type: "test event type",
        coordinates: { lat: 1, lng: 1 },
      })
      .set("authorization", `Bearer ${adminToken}`);
    expect(resp.statusCode).toEqual(201);
    expect(resp.body).toEqual({
      event: {
        id: expect.any(Number),
        buskerId: testBuskerIds[0],
        title: "test event title",
        type: "test event type",
        coordinates: { lat: 1, lng: 1 },
      },
    });
  });

  test("works for same user", async function () {
    const resp = await request(app)
      .post(`/events/create`)
      .send({
        buskerId: testBuskerIds[0],
        title: "test event title",
        type: "test event type",
        coordinates: { lat: 1, lng: 1 },
      })
      .set("authorization", `Bearer ${u1Token}`);
    expect(resp.statusCode).toEqual(201);
    expect(resp.body).toEqual({
      event: {
        id: expect.any(Number),
        buskerId: testBuskerIds[0],
        title: "test event title",
        type: "test event type",
        coordinates: { lat: 1, lng: 1 },
      },
    });
  });

  test("bad request with missing data", async function () {
    const resp = await request(app)
      .post(`/events/create`)
      .send({
        title: "test event title",
      })
      .set("authorization", `Bearer ${adminToken}`);
    expect(resp.statusCode).toEqual(400);
  });

  test("bad request with invalid data", async function () {
    const resp = await request(app)
      .post(`/events/create`)
      .send({
        buskerId: testBuskerIds[0],
        title: "test event title",
        type: "test event type",
        coordinates: "not coordinates",
      })
      .set("authorization", `Bearer ${adminToken}`);
    expect(resp.statusCode).toEqual(400);
  });
});

/************************************** PATCH /events/:id */

describe("PATCH /events/:id", () => {
  test("works for admins", async function () {
    const resp = await request(app)
      .patch(`/events/${testEventIds[0]}`)
      .send({
        title: "New title",
      })
      .set("authorization", `Bearer ${adminToken}`);
    expect(resp.body).toEqual({
      event: {
        id: testEventIds[0],
        buskerId: testBuskerIds[0],
        title: "New title",
        type: "test type",
        coordinates: { lat: 0, lng: 0 },
      },
    });
  });

  //CURRENTLY AUTHORIZING EVERYONE TO UPDATE EVENTS. THIS TEST IS NEEDED
  //WHEN WE INTRODUCE BUSKERS MODEL
  test("unauth for others", async function () {
    const resp = await request(app)
      .patch(`/events/${testEventIds[0]}`)
      .send({
        title: "New title",
      })
      .set("authorization", `Bearer ${u1Token}`);
    expect(resp.statusCode).toEqual(401);
  });

  test("not found on no such event", async function () {
    const resp = await request(app)
      .patch(`/events/0`)
      .send({
        title: "New title",
      })
      .set("authorization", `Bearer ${adminToken}`);
    expect(resp.statusCode).toEqual(404);
  });

  test("bad request with invalid data", async function () {
    const resp = await request(app)
      .patch(`/events/${testEventIds[0]}`)
      .send({
        coordinates: "not coordinates",
      })
      .set("authorization", `Bearer ${adminToken}`);
    expect(resp.statusCode).toEqual(400);
  });
});

/************************************** DELETE /events/:id */

describe("DELETE /events/:id", function () {
  test("works for admin", async function () {
    const resp = await request(app)
      .delete(`/events/${testEventIds[0]}`)
      .set("authorization", `Bearer ${adminToken}`);
    expect(resp.body).toEqual({ message: "event deleted" });
  });

  //TEST FAILS BECAUSE WE ARE CURRENTLY AUTHORIZING EVERYONE TO UPDATE EVENTS.
  // THIS TEST IS NEEDED WHEN WE INTRODUCE BUSKERS MODEL
  test("unauth for others", async function () {
    const resp = await request(app)
      .delete(`/events/${testEventIds[0]}`)
      .set("authorization", `Bearer ${u1Token}`);
    expect(resp.statusCode).toEqual(401);
  });

  //TEST FAILS BECAUSE WE ARE CURRENTLY AUTHORIZING EVERYONE TO UPDATE EVENTS.
  // THIS TEST IS NEEDED WHEN WE INTRODUCE BUSKERS MODEL
  test("unauth for anon", async function () {
    const resp = await request(app).delete(`/events/${testEventIds[0]}`);
    expect(resp.statusCode).toEqual(401);
  });

  test("not found for no such event", async function () {
    const resp = await request(app)
      .delete(`/events/0`)
      .set("authorization", `Bearer ${adminToken}`);
    expect(resp.statusCode).toEqual(404);
  });
});
