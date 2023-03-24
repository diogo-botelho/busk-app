import { Event } from "./event";
import { BadRequestError, NotFoundError } from "../expressError";
import db from "../db";
import {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  testBuskers,
  testEvents,
} from "./_testCommon";

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/************************************** create */
describe("create", function () {
  const newEvent = {
    buskerId: "",
    title: "Test title",
    type: "Test type",
    coordinates: { lat: 1, lng: 1 },
  };

  test("works", async function () {
    newEvent["buskerId"] = `${testBuskers[0]}`;

    let event = await Event.create(newEvent);
    expect(event).toEqual({
      ...newEvent,
      buskerId: testBuskers[0],
      id: testEvents[0] + 1,
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
    newEvent["buskerId"] = `${testBuskers[0]}`;
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
});

// /************************************** getAll */

describe("getAll", function () {
  const newEvent = {
    buskerId: "",
    title: "Test title",
    type: "Test type",
    coordinates: { lat: 1, lng: 1 },
  };

  test("works", async function () {
    newEvent["buskerId"] = `${testBuskers[0]}`;

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
    let event = await Event.getById(testEvents[0]);
    expect(event).toEqual({
      id: testEvents[0],
      buskerId: testBuskers[0],
      title: "e1",
      type: "E1",
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
    buskerId: "",
    title: "newTitle",
    type: "NewType",
    coordinates: { lat: 45, lng: 45 },
  };

  test("works", async function () {
    updateData["buskerId"] = `${testBuskers[0]}`;
    const oldEvent = await Event.getById(testEvents[0]);
    let event = await Event.update(testEvents[0], updateData);
    expect(oldEvent).not.toEqual(event);
    expect(event).toEqual({
      ...updateData,
      id: testEvents[0],
      buskerId: testBuskers[0],
      title: "newTitle",
    });
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
    await Event.remove(testEvents[0]);
    const res = await db.query(
      `SELECT * FROM events WHERE busker_id=${testBuskers[0]}`
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
