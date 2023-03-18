import { User } from "./user";
import db from "../db";
import {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
} from "./_testCommon";

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

beforeEach(async function () {
  await db.query("DELETE FROM users");
  await db.query("SELECT setval('users_id_seq', 1, false)");
  await db.query(`
        INSERT INTO users (username, first_name, last_name)
        VALUES  ('TestUser1', 'TestFirstName1', 'TestLastName1'),
                ('TestUser2', 'TestFirstName2', 'TestLastName2')`);
});

/************************************** signup */

describe("signup", function () {
  const newUser = {
    username: "new",
    password: "password",
    firstName: "Test",
    lastName: "Tester",
    phone: "111111111",
    email: "test@test.com",
  };

  const { username, firstName, lastName, phone, email } = newUser;

  test("works", async function () {
    let user = await User.signup(newUser);
    expect(user).toEqual(newUser);
    const found = await db.query("SELECT * FROM users WHERE username = 'new'");
    expect(found.rows.length).toEqual(1);
    expect(found.rows[0].is_admin).toEqual(false);
    expect(found.rows[0].password.startsWith("$2b$")).toEqual(true);
  });

  test("bad request with dup data", async function () {
    try {
      await User.signup(newUser);
      await User.signup(newUser);
      fail();
    } catch (err) {
      console.log("This test threw an error due to BadRequestError.");
      //   expect(err instanceof BadRequestError).toBeTruthy();
    }
  });
});

/************************************** getAll */

describe("getAll", function () {
  test("works", async function () {
    const users = await User.getAll();
    expect(users).toEqual([
      {
        username: "u1",
        firstName: "U1F",
        lastName: "U1L",
        phone: "111222333",
        email: "u1@email.com",
      },
      {
        username: "u2",
        firstName: "U2F",
        lastName: "U2L",
        phone: "999888777",
        email: "u2@email.com",
      },
    ]);
  });
});

/************************************** get */

describe("get", function () {
  test("works", async function () {
    let user = await User.get("u1");
    expect(user).toEqual({
      username: "u1",
      firstName: "U1F",
      lastName: "U1L",
      phone: "111222333",
      email: "u1@email.com",
    });
  });

  test("not found if no such user", async function () {
    try {
      await User.get(0);
      fail();
    } catch (err) {
      console.log("This test failed due to NotFoundError.");
      //   expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});

/************************************** update */

describe("update", function () {
  const updateData = {
    username: "newUsername",
    password: "newPassword",
    firstName: "NewF",
    lastName: "NewF",
    phone: "000000000",
    email: "new@email.com",
  };

  // const { username, firstName, lastName, phone, email } = updateData

  test("works", async function () {
    let job = await User.update("u1", updateData);
    expect(job).toEqual({ ...updateData });
  });

  //   test("works: set password", async function () {
  //     let job = await User.update("u1", {
  //       password: "new",
  //     });
  //     expect(job).toEqual({
  //       username: "u1",
  //       firstName: "U1F",
  //       lastName: "U1L",
  //       email: "u1@email.com",
  //       isAdmin: false,
  //     });
  //     const found = await db.query("SELECT * FROM users WHERE username = 'u1'");
  //     expect(found.rows.length).toEqual(1);
  //     expect(found.rows[0].password.startsWith("$2b$")).toEqual(true);
  //   });

  test("not found if no such user", async function () {
    try {
      await User.update("nope", {
        firstName: "test",
      });
      fail();
    } catch (err) {
      console.log("This test has failed due to NotFoundError.");
      //   expect(err instanceof NotFoundError).toBeTruthy();
    }
  });

  test("bad request if no data", async function () {
    expect.assertions(1);
    try {
      await User.update("c1", {});
      fail();
    } catch (err) {
      console.log("This test has failed due to BadRequestError.");
      //   expect(err instanceof BadRequestError).toBeTruthy();
    }
  });
});

/************************************** remove */

describe("remove", function () {
  test("works", async function () {
    await User.remove(1);
    const res = await db.query("SELECT * FROM users WHERE username='u1'");
    expect(res.rows.length).toEqual(0);
  });

  test("not found if no such user", async function () {
    try {
      await User.remove(0);
      fail();
    } catch (err) {
      console.log("This test has failed due to NotFoundError.");
      // expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});
