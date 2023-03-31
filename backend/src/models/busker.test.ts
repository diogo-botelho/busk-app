import db from "../db";
import { Busker } from "./busker";
import { User } from "./user";

import {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  testBuskerIds,
  testBuskerNames,
  testUserIds,
} from "./_testCommon";

import { NotFoundError, BadRequestError } from "../expressError";

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/************************************** register */

describe("register", function () {
  const newBusker = {
    userId: 0,
    buskerName: "newBusker",
    category: "musician",
    description: "test description",
  };

  test("works", async function () {
    const newBuskerCopy = { ...newBusker, userId: testUserIds[0] };

    let busker = await Busker.register(newBuskerCopy);

    expect(busker).toEqual({
      id: expect.any(Number),
      ...newBuskerCopy,
    });
  });

  test("bad request with dup buskerName and category", async function () {
    try {
      const newBuskerCopy = { ...newBusker, userId: testUserIds[0] };
      await Busker.register(newBuskerCopy);
      await Busker.register(newBuskerCopy);
      fail();
    } catch (err) {
      expect(err instanceof BadRequestError).toBeTruthy();
    }
  });

  test("works dup buskerName and different category", async function () {
    const newBuskerCopy = { ...newBusker, userId: testUserIds[1] };

    const busker1 = await Busker.register(newBuskerCopy);

    newBuskerCopy["category"] = "painter";
    const busker2 = await Busker.register(newBuskerCopy);

    expect(busker2).toEqual({
      id: expect.any(Number),
      userId: testUserIds[1],
      buskerName: "newBusker",
      category: "painter",
      description: "test description",
    });

    const result = await db.query(
      `SELECT * FROM buskers WHERE user_id = ${testUserIds[1]}`
    );
    expect(result.rows.length).toEqual(2);
  });

  test("works with dup category and different buskerName", async function () {
    const newBuskerCopy = { ...newBusker, userId: testUserIds[1] };

    const busker3 = await Busker.register(newBuskerCopy);

    newBuskerCopy["buskerName"] = "differentBusker";
    const busker4 = await Busker.register(newBuskerCopy);

    expect(busker4).toEqual({
      id: expect.any(Number),
      userId: testUserIds[1],
      buskerName: "differentBusker",
      category: "musician",
      description: "test description",
    });

    const result = await db.query(
      `SELECT * FROM buskers WHERE user_id = ${testUserIds[1]}`
    );
    expect(result.rows.length).toEqual(2);
  });
});

/************************************** getAll */

describe("getAll", function () {
  test("works", async function () {
    const buskers = await Busker.getAll();
    expect(buskers).toEqual([
      {
        id: expect.any(Number),
        userId: testUserIds[0],
        buskerName: "u1BuskerName1",
        category: "musician",
        description: "A fun performer",
      },
      {
        id: expect.any(Number),
        userId: testUserIds[0],
        buskerName: "u1BuskerName2",
        category: "juggler",
        description: "A great performer",
      },
    ]);
  });
});

/************************************** get */

describe("get", function () {
  test("works", async function () {
    let busker = await Busker.get("u1BuskerName1");
    expect(busker).toEqual({
      id: testBuskerIds[0],
      userId: testUserIds[0],
      buskerName: "u1BuskerName1",
      category: "musician",
      description: "A fun performer",
    });
  });

  test("not found if no such busker", async function () {
    try {
      await Busker.get("noSuchBusker");
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});

/************************************** update */

describe("update", function () {
  const updateData = {
    buskerName: "anotherBusker",
    category: "painter",
    description: "different description",
  };

  test("works", async function () {
    let busker = await Busker.update(testBuskerNames[0], updateData);
    expect(busker).toEqual({
      id: testBuskerIds[0],
      userId: testUserIds[0],
      buskerName: "anotherBusker",
      category: "painter",
      description: "different description",
    });
  });

  test("not found if no such busker", async function () {
    try {
      await Busker.update("nope", {
        buskerName: "anotherBusker",
      });
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });

  test("bad request if no data", async function () {
    expect.assertions(1);
    try {
      await Busker.update(testBuskerNames[0], null);
    } catch (err) {
      expect(err instanceof BadRequestError).toBeTruthy();
    }
  });
});

/************************************** remove */

describe("remove", function () {
  test("works", async function () {
    const removeMessage = await Busker.remove(testBuskerNames[0]);
    expect(removeMessage).toEqual(
      `Busker ${testBuskerNames[0]} was successfully deleted.`
    );

    const res = await db.query(
      `SELECT * FROM buskers WHERE busker_name='${testBuskerNames[0]}'`
    );
    expect(res.rows.length).toEqual(0);
  });

  test("not found if no such user", async function () {
    try {
      await Busker.remove("noSuchUser");
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});
