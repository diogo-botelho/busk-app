import db from "../db";

import { Event } from "./event";

import { BadRequestError, NotFoundError } from "../expressError";

import {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  testBuskerIds,
  testEventIds,
  testBuskerNames,
} from "./_testCommon";

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/************************************** create */
describe("create", function () {
  const newEvent = {
    buskerId: 0,
    title: "Test title",
    type: "Test type",
    date: "Tue, Oct 10, 2023",
    startTime: "01:16",
    endTime: "02:16",
    coordinates: { lat: 1, lng: 1 },
  };

  test("works", async function () {
    newEvent["buskerId"] = testBuskerIds[0];

    let event = await Event.create(newEvent);
    expect(event).toEqual({
      ...newEvent,
      buskerId: testBuskerIds[0],
      id: testEventIds[0] + 1,
    });
  });

  test("bad request with missing buskerId", async function () {
    try {
      delete newEvent.buskerId;
      await Event.create(newEvent);
      fail();
    } catch (err) {
      expect(err instanceof BadRequestError).toBeTruthy();
    }
  });

  test("bad request with missing title", async function () {
    newEvent["buskerId"] = testBuskerIds[0];
    try {
      delete newEvent.title;
      await Event.create(newEvent);
      fail();
    } catch (err) {
      expect(err instanceof BadRequestError).toBeTruthy();
    }
  });

  test("bad request with empty title", async function () {
    newEvent.title = "";
    try {
      await Event.create(newEvent);
      fail();
    } catch (err) {
      expect(err instanceof BadRequestError).toBeTruthy();
    }
  });
  test("bad request with empty date", async function () {
    newEvent.title = "Test title";
    newEvent.date = "";
    try {
      await Event.create(newEvent);
      fail();
    } catch (err) {
      expect(err instanceof BadRequestError).toBeTruthy();
    }
  });
  test("bad request with empty startTime", async function () {
    newEvent.date = "2023-10-12";
    newEvent.startTime = "";
    try {
      await Event.create(newEvent);
      fail();
    } catch (err) {
      expect(err instanceof BadRequestError).toBeTruthy();
    }
  });
  test("bad request with empty endTime", async function () {
    newEvent.startTime = "01:16";
    newEvent.endTime = "";
    try {
      await Event.create(newEvent);
      fail();
    } catch (err) {
      expect(err instanceof BadRequestError).toBeTruthy();
    }
  });
});

// /************************************** getAll */

describe("getAll", function () {
  const newEvent = {
    buskerId: 0,
    title: "Test title",
    type: "Test type",
    date: "Tue, Oct 10, 2023",
    startTime: "02:16",
    endTime: "03:16",
    coordinates: { lat: 1, lng: 1 },
  };

  test("works", async function () {
    newEvent["buskerId"] = testBuskerIds[0];

    const events1 = await Event.getAll();
    expect(events1.length).toEqual(1);

    await Event.create(newEvent);
    const events2 = await Event.getAll();
    expect(events2.length).toEqual(2);
  });
});

// /************************************** getbyId */

describe("get", function () {
  test("works", async function () {
    let event = await Event.getById(testEventIds[0]);
    expect(event).toEqual({
      id: testEventIds[0],
      buskerId: testBuskerIds[0],
      buskerName: testBuskerNames[0],
      title: "e1",
      type: "E1",
      date: "Tue, Oct 10, 2023",
      endTime: "14:00",
      startTime: "13:00",
      coordinates: { lat: 0, lng: 0 },
    });
  });

  test("not found if no such Event", async function () {
    try {
      await Event.getById(0);
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});

/************************************** update */

describe("update", function () {
  const updateData = {
    buskerId: 0,
    title: "newTitle",
    type: "NewType",
    date: "Wed, Oct 11, 2023",
    startTime: "00:00",
    endTime: "10:00",
    coordinates: { lat: 45, lng: 45 },
  };

  const updateData2 = {
    buskerId: 0,
    title: "newTitle2",
  };

  test("works", async function () {
    updateData["buskerId"] = testBuskerIds[0];
    const oldEvent = await Event.getById(testEventIds[0]);
    let event = await Event.update(testEventIds[0], updateData);
    expect(oldEvent).not.toEqual(event);
    expect(event).toEqual({
      ...updateData,
      id: testEventIds[0],
      buskerId: testBuskerIds[0],
      buskerName: testBuskerNames[0],
    });
  });

  test("works with partial data", async function () {
    updateData2["buskerId"] = testBuskerIds[0];
    const oldEvent = await Event.getById(testEventIds[0]);
    let event = await Event.update(testEventIds[0], updateData2);
    expect(oldEvent).not.toEqual(event);
    expect(event).toEqual({
      ...oldEvent,
      id: testEventIds[0],
      buskerId: testBuskerIds[0],
      title: updateData2.title,
    });
  });

  test("bad request with empty title", async function () {
    updateData2.title = "";
    try {
      await Event.update(testEventIds[0], updateData2);
      fail();
    } catch (err) {
      console.log(err);
      expect(err instanceof BadRequestError).toBeTruthy();
    }
  });

  test("not found if no such event", async function () {
    try {
      await Event.update(0, {
        ...updateData,
      });
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });

  test("bad request with no data", async function () {
    try {
      await Event.update(1, null);
    } catch (err) {
      expect(err instanceof BadRequestError).toBeTruthy();
    }
  });
});

/************************************** remove */

describe("remove", function () {
  test("works", async function () {
    await Event.remove(testEventIds[0]);
    const res = await db.query(
      `SELECT * FROM events WHERE busker_id=${testBuskerIds[0]}`,
    );
    expect(res.rows.length).toEqual(0);
  });

  test("not found if no such event", async function () {
    try {
      await Event.remove(0);
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});
