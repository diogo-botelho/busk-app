import db from "../db";

import { User } from "./user";

import {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  testUserIds,
  testBuskerIds,
} from "./_testCommon";

import {
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
} from "../expressError";

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/************************************** authenticate */

describe("authenticate", function () {
  test("works", async function () {
    const user = await User.authenticate("u1@email.com", "password1");
    expect(user).toEqual({
      id: expect.any(Number),
      email: "u1@email.com",
      firstName: "u1F",
      lastName: "u1L",
      phone: "111222333",
      isAdmin: false,
    });
  });

  test("unauth if no such user", async function () {
    try {
      await User.authenticate("nope", "password");
      fail();
    } catch (err) {
      expect(err instanceof UnauthorizedError).toBeTruthy();
    }
  });

  test("unauth if wrong password", async function () {
    try {
      await User.authenticate("u1", "wrong");
      fail();
    } catch (err) {
      expect(err instanceof UnauthorizedError).toBeTruthy();
    }
  });
});

/************************************** signup */

describe("signup", function () {
  const newUser = {
    email: "test@test.com",
    password: "password",
    firstName: "Test",
    lastName: "Tester",
    phone: "123456789",
    isAdmin: false,
  };

  // const { email, password, firstName, lastName, phone  } = newUser;

  test("works", async function () {
    let user = await User.signup(newUser);
    const newUserCopy = { ...newUser };
    delete newUserCopy.password;

    expect(user).toEqual({
      id: expect.any(Number),
      ...newUserCopy,
    });

    const found = await db.query(
      "SELECT * FROM users WHERE email = 'test@test.com'"
    );
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
      expect(err instanceof BadRequestError).toBeTruthy();
    }
  });
});

/************************************** getAll */

describe("getAll", function () {
  test("works", async function () {
    const users = await User.getAll();
    expect(users).toEqual([
      {
        email: "u1@email.com",
        firstName: "u1F",
        lastName: "u1L",
        phone: "111222333",
      },
      {
        email: "u2@email.com",
        firstName: "u2F",
        lastName: "u2L",
        phone: "999888777",
      },
    ]);
  });
});

/************************************** get */

describe("get", function () {
  test("works", async function () {
    let user = await User.get(testUserIds[0]);
    expect(user).toEqual({
      id: testUserIds[0],
      email: "u1@email.com",
      firstName: "u1F",
      lastName: "u1L",
      phone: "111222333",
      buskerNames: ["u1BuskerName1", "u1BuskerName2"],
      buskerId: testBuskerIds[0],
    });
  });

  test("user with buskerName(s) shows buskerName(s)", async function () {
    let user1 = await User.get(testUserIds[0]);
    let user2 = await User.get(testUserIds[1]);

    expect(user1.buskerNames.length).toEqual(2);
    expect(user2.buskerNames.length).toEqual(0);
  });

  test("not found if no such user", async function () {
    try {
      await User.get(0);
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});

/************************************** update */

describe("update", function () {
  const updateData = {
    email: "new@email.com",
    password: "newPassword",
    firstName: "NewF",
    lastName: "NewL",
    phone: "000000000",
  };

  test("works", async function () {
    let user = await User.update(testUserIds[0], updateData);
    expect(user).toEqual({
      email: "new@email.com",
      firstName: "NewF",
      lastName: "NewL",
      phone: "000000000",
    });
  });

  test("works: set password", async function () {
    let user = await User.update(testUserIds[0], { password: "new" });
    expect(user).toEqual({
      email: "u1@email.com",
      firstName: "u1F",
      lastName: "u1L",
      phone: "111222333",
    });
    const found = await db.query(
      "SELECT * FROM users WHERE email = 'u1@email.com'"
    );
    expect(found.rows.length).toEqual(1);
    expect(found.rows[0].password.startsWith("$2b$")).toEqual(true);
  });

  test("works: set password", async function () {
    let user = await User.update(testUserIds[0], { password: "new" });
    expect(user).toEqual({
      email: "u1@email.com",
      firstName: "u1F",
      lastName: "u1L",
      phone: "111222333",
    });
    const found = await db.query(
      `SELECT * FROM users WHERE id = ${testUserIds[0]}`
    );
    expect(found.rows.length).toEqual(1);
    expect(found.rows[0].password.startsWith("$2b$")).toEqual(true);
  });

  test("not found if no such user", async function () {
    try {
      await User.update(0, {
        firstName: "test",
      });
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });

  test("bad request if no data", async function () {
    expect.assertions(1);
    try {
      await User.update(testUserIds[0], null);
    } catch (err) {
      expect(err instanceof BadRequestError).toBeTruthy();
    }
  });
});

/************************************** remove */

describe("remove", function () {
  test("works", async function () {
    const removeMessage = await User.remove(testUserIds[1]);
    const res = await db.query(
      "SELECT * FROM users WHERE email='u2@email.com'"
    );
    expect(res.rows.length).toEqual(0);
    expect(removeMessage).toEqual("This user was successfully deleted.");
  });

  test("not found if no such user", async function () {
    try {
      await User.remove(0);
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});
