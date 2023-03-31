import db from "../db";

import { Busker } from "./busker";

import {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  testBuskers,
  testUsers,
} from "./_testCommon";

import {
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
} from "../expressError";
import { testUserIds, testBuskerIds } from "./_testCommon";

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/************************************** register */

describe("register", function () {
  const newBusker = {
    userId: testUserIds[0],
    buskerName: "newBusker",
    category: "musician",
    description: "Cool new musician",
  };

  const { userId, buskerName, category, description } = newBusker;

  test("works", async function () {
    let busker = await Busker.register(newBusker);
    const newBuskerCopy = { ...newBusker };

    expect(busker).toEqual({
      id: expect.any(Number),
      ...newBuskerCopy,
    });

    const found = await db.query(
      `SELECT * FROM busker WHERE id = ${busker.id}`
    );
    expect(found.rows.length).toEqual(1);
    expect(found.rows[0].is_admin).toEqual(false);
    expect(found.rows[0].password.startsWith("$2b$")).toEqual(true);
  });

  test("bad request with dup data", async function () {
    try {
      await Busker.register(newBusker);
      await Busker.register(newBusker);
      fail();
    } catch (err) {
      expect(err instanceof BadRequestError).toBeTruthy();
    }
  });
});

/************************************** getAll */

describe("getAll", function () {
  test("works", async function () {
    const buskers = await Busker.getAll();
    expect(buskers).toEqual([
      {
        buskerId: testBuskerIds[0],
        buskerName: "b1",
        category: "musician",
        description: "good musician",
      },
    ]);
  });
});

/************************************** get */

describe("get", function () {
  test("works", async function () {
    let busker = await Busker.get("u1");
    expect(busker).toEqual({});
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
        buskerId: testUserIds[0],
        buskerName: "anotherBusker",
        category: "painter",
        description: "different description"
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
  const res = await db.query(`SELECT * FROM buskers WHERE buskerName=${testBuskerNames[0]}`);
  expect(res.rows.length).toEqual(0);
  expect(removeMessage).toEqual(`Busker ${testBuskernames[0]} was successfully deleted.`;);
  });

  test("not found if no such busker", async function () {
  });
  test("works", async function () {
      });

  test("not found if no such user", async function () {
    try {
      await Busker.remove("noSuchUser");
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
})
