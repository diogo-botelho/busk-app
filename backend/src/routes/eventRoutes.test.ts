import request from "supertest";

import app from "../app";
import { BadRequestError } from "../expressError";

import {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  testUserIds,
  testBuskerIds,
  testBuskerNames,
  testEventIds,
  adminToken,
  u1Token,
  u2Token,
} from "./_testCommon";

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/************************************** GET /events */

describe("GET /events", function () {
  test("works for anon", async function () {
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
        userId: testUserIds[0],
        buskerName: testBuskerNames[0],
        eventData: {
          buskerId: testBuskerIds[0],
          title: "test event title",
          type: "test event type",
          coordinates: { lat: 1, lng: 1 },
        },
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

  test("works for correct busker", async function () {
    const resp = await request(app)
      .post(`/events/create`)
      .send({
        userId: testUserIds[0],
        buskerName: testBuskerNames[0],
        eventData: {
          buskerId: testBuskerIds[0],
          title: "test event title",
          type: "test event type",
          coordinates: { lat: 1, lng: 1 },
        },
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

  test("unauth for others", async function () {
    const resp = await request(app)
      .post(`/events/create`)
      .send({
        userId: testUserIds[0],
        buskerName: testBuskerNames[0],
        eventData: {
          buskerId: testBuskerIds[0],
          title: "test event title",
          type: "test event type",
          coordinates: { lat: 1, lng: 1 },
        },
      })
      .set("authorization", `Bearer ${u2Token}`);
    expect(resp.statusCode).toEqual(401);
  });

  test("unauth for anon", async function () {
    const resp = await request(app)
      .post(`/events/create`)
      .send({
        userId: testUserIds[0],
        buskerName: testBuskerNames[0],
        eventData: {
          buskerId: testBuskerIds[0],
          title: "test event title",
          type: "test event type",
          coordinates: { lat: 1, lng: 1 },
        },
      });
    expect(resp.statusCode).toEqual(401);
  });

  test("unauth if missing userId", async function () {
    const resp = await request(app)
      .post(`/events/create`)
      .send({
        buskerName: testBuskerNames[0],
        eventData: {
          buskerId: testBuskerIds[0],
          title: "test event title",
          type: "test event type",
          coordinates: { lat: 1, lng: 1 },
        },
      })
      .set("authorization", `Bearer ${adminToken}`);
    expect(resp.statusCode).toEqual(401);
  });

  test("unauth if missing buskerName", async function () {
    const resp = await request(app)
      .post(`/events/create`)
      .send({
        userId: testUserIds[0],
        eventData: {
          buskerId: testBuskerIds[0],
          title: "test event title",
          type: "test event type",
          coordinates: { lat: 1, lng: 1 },
        },
      })
      .set("authorization", `Bearer ${adminToken}`);
    expect(resp.statusCode).toEqual(401);
  });

  test("jest bad request if missing eventData", async function () {
    const resp = await request(app)
      .post(`/events/create`)
      .send({
        userId: testUserIds[0],
        buskerName: testBuskerNames[0]
      })
      .set("authorization", `Bearer ${adminToken}`);
    expect(resp.statusCode).toEqual(400);
  });

  test("bad request with invalid data", async function () {
    const resp = await request(app)
      .post(`/events/create`)
      .send({
        userId: testUserIds[0],
        buskerName: testBuskerNames[0],
        eventData: {
          buskerId: testBuskerIds[0],
          title: "test event title",
          type: "test event type",
          coordinates: "not coordinates",
        },
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
        userId: testUserIds[0],
        buskerName: testBuskerNames[0],
        updateData: {
          title: "New title",
        },
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

  test("works for correct busker", async function () {
    const resp = await request(app)
      .patch(`/events/${testEventIds[0]}`)
      .send({
        userId: testUserIds[0],
        buskerName: testBuskerNames[0],
        updateData: {
          title: "New title",
        },
      })
      .set("authorization", `Bearer ${u1Token}`);
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

  test("unauth for others", async function () {
    const resp = await request(app)
      .patch(`/events/${testEventIds[0]}`)
      .send({
        userId: testUserIds[0],
        buskerName: testBuskerNames[0],
        updateData: {
          title: "New title",
        },
      })
      .set("authorization", `Bearer ${u2Token}`);
    expect(resp.statusCode).toEqual(401);
  });

  test("unauth for anon", async function () {
    const resp = await request(app)
      .patch(`/events/${testEventIds[0]}`)
      .send({
        userId: testUserIds[0],
        buskerName: testBuskerNames[0],
        updateData: {
          title: "New title",
        },
      });
    expect(resp.statusCode).toEqual(401);
  });

  test("unauth if missing userId", async function () {
    const resp = await request(app)
      .patch(`/events/${testEventIds[0]}`)
      .send({
        buskerName: testBuskerNames[0],
        updateData: {
          title: "New title",
        },
      })
      .set("authorization", `Bearer ${u1Token}`);
    expect(resp.statusCode).toEqual(401);
  });

  test("unauth if missing buskerName", async function () {
    const resp = await request(app)
      .patch(`/events/${testEventIds[0]}`)
      .send({
        buskerName: testBuskerNames[0],
        updateData: {
          title: "New title",
        },
      })
      .set("authorization", `Bearer ${u1Token}`);
    expect(resp.statusCode).toEqual(401);
  });

  //Doesn't throw 404 because we don't want to give too much information if
  // a user doesn't own an event. If we change our mind in the future, getting
  // this to throw an 404 would require refactoring our middleware because right
  // now it fails auth middleware even before checking if event exists.
  test("unauth on no such event", async function () {
    const resp = await request(app)
      .patch(`/events/0`)
      .send({
        userId: testUserIds[0],
        buskerName: testBuskerNames[0],
        updateData: {
          title: "New title",
        },
      })
      .set("authorization", `Bearer ${adminToken}`);
    expect(resp.statusCode).toEqual(401);
  });

  test("bad request if missing updateData", async function () {
    const resp = await request(app)
      .patch(`/events/${testEventIds[0]}`)
      .send({
        userId: testUserIds[0],
        buskerName: testBuskerNames[0],
      })
      .set("authorization", `Bearer ${u1Token}`);
    expect(resp.statusCode).toEqual(400);
  });

  test("bad request with invalid data", async function () {
    const resp = await request(app)
      .patch(`/events/${testEventIds[0]}`)
      .send({
        userId: testUserIds[0],
        buskerName: testBuskerNames[0],
        updateData: {
          coordinates: "not coordinates",
        },
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
      .send({
        userId: testUserIds[0],
        buskerName: testBuskerNames[0],
      })
      .set("authorization", `Bearer ${adminToken}`);
    expect(resp.body).toEqual({ message: "event deleted" });
  });

  test("works for correct busker", async function () {
    const resp = await request(app)
      .delete(`/events/${testEventIds[0]}`)
      .send({
        userId: testUserIds[0],
        buskerName: testBuskerNames[0],
      })
      .set("authorization", `Bearer ${u1Token}`);
    expect(resp.body).toEqual({ message: "event deleted" });
  });

  test("unauth for others", async function () {
    const resp = await request(app)
      .delete(`/events/${testEventIds[0]}`)
      .send({
        userId: testUserIds[0],
        buskerName: testBuskerNames[0],
      })
      .set("authorization", `Bearer ${u2Token}`);
    expect(resp.statusCode).toEqual(401);
  });

  test("unauth for anon", async function () {
    const resp = await request(app).delete(`/events/${testEventIds[0]}`).send({
      userId: testUserIds[0],
      buskerName: testBuskerNames[0],
    });
    expect(resp.statusCode).toEqual(401);
  });

  test("unauth if missing userId", async function () {
    const resp = await request(app)
      .delete(`/events/${testEventIds[0]}`)
      .send({
        buskerName: testBuskerNames[0],
      })
      .set("authorization", `Bearer ${u1Token}`);
    expect(resp.statusCode).toEqual(401);
  });

  test("unauth if missing buskerId", async function () {
    const resp = await request(app)
      .delete(`/events/${testEventIds[0]}`)
      .send({
        userId: testUserIds[0],
      })
      .set("authorization", `Bearer ${u1Token}`);
    expect(resp.statusCode).toEqual(401);
  });

  //Doesn't throw 404 because we don't want to give too much information if
  // a user doesn't own an event. If we change our mind in the future, getting
  // this to throw an 404 would require refactoring our middleware because right
  // now it fails auth middleware even before checking if event exists.
  test("unauth on no such event", async function () {
    const resp = await request(app)
      .delete(`/events/0`)
      .send({
        userId: testUserIds[0],
        buskerName: testBuskerNames[0],
      })
      .set("authorization", `Bearer ${adminToken}`);
    expect(resp.statusCode).toEqual(401);
  });
});
