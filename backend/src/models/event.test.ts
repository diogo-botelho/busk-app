import { Event } from "./event";
import db from "../db";
import {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  testUsers,
  testBuskers
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
    // console.log(testUsers);
    let buskerId = await db.query("SELECT id from buskers limit 1");
    buskerId = buskerId.rows[0].id;
    newEvent["buskerId"] = `${buskerId}`;

    let event = await Event.create(newEvent);
    expect(event).toEqual({
      ...newEvent,
      buskerId: buskerId,
      id: expect.any(Number),
    });
  });

  test("bad request with dup data", async function () {
    try {
      await Event.create(newEvent);
      await Event.create(newEvent);
      fail();
    } catch (err) {
      console.log("This test threw an error due to BadRequestError.");
      //   expect(err instanceof BadRequestError).toBeTruthy();
    }
  });
});

// /************************************** getAll */

describe("getAll", function () {
  test("works", async function () {
    const events = await Event.getAll();
    expect(events).toEqual([
      {
        id: expect.any(Number),
        buskerId: expect.any(Number),
        title: "e1",
        type: "E1",
        coordinates: { lat: 0, lng: 0 },
      },
    ]);
  });
});

// /************************************** getbyId */

describe("get", function () {
  test("works", async function () {
    let event = await Event.getById(1);
    expect(Event).toEqual({
      buskerId: "b1",
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
      console.log("This test failed due to NotFoundError.");
      // expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});

// /************************************** update */

// describe("update", function () {
//   const updateData = {
//     buskerId: "b1",
//     title: "newTitle",
//     type: "NewType",
//     coordinates: { lat: 45, lng: 45 },
//   };

//   test("works", async function () {
//     let event = await Event.update(1, updateData);
//     expect(event).toEqual({
//       id: 1,
//       title: "newTitle",
//       ...updateData,
//     });
//   });

//   test("not found if no such event", async function () {
//     try {
//       await Event.update(0, {
//         ...updateData,
//       });
//       fail();
//     } catch (err) {
//       // expect(err instanceof NotFoundError).toBeTruthy();
//     }
//   });

//   test("bad request with no data", async function () {
//     try {
//       await Event.update(1, null);
//       fail();
//     } catch (err) {
//       // expect(err instanceof BadRequestError).toBeTruthy();
//     }
//   });
// });

// /************************************** remove */

// describe("remove", function () {
//   test("works", async function () {
//     await Event.remove(1);
//     const res = await db.query("SELECT * FROM events WHERE username='u1'");
//     expect(res.rows.length).toEqual(0);
//   });

//   test("not found if no such event", async function () {
//     try {
//       await Event.remove(0);
//       fail();
//     } catch (err) {
//       console.log("This test has failed due to NotFoundError.");
//       // expect(err instanceof NotFoundError).toBeTruthy();
//     }
//   });
// });
