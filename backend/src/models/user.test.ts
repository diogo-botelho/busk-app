import db from "../db";

import { User } from "./user";

import {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  testBuskers,
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
    const user = await User.authenticate("u1", "password1");
    expect(user).toEqual({
      username: "u1",
      firstName: "u1F",
      lastName: "u1L",
      email: "u1@email.com",
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
    username: "new",
    password: "password",
    firstName: "Test",
    lastName: "Tester",
    phone: "123456789",
    email: "test@test.com",
    isAdmin: false,
  };

  const { username, password, firstName, lastName, phone, email } = newUser;

  test("works", async function () {
    let user = await User.signup(newUser);
    const newUserCopy = { ...newUser };
    delete newUserCopy.password;

    expect(user).toEqual({
      id: expect.any(Number),
      ...newUserCopy,
    });

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
        username: "u1",
        firstName: "u1F",
        lastName: "u1L",
        phone: "111222333",
        email: "u1@email.com",
        isAdmin: false,
      },
      {
        username: "u2",
        firstName: "u2F",
        lastName: "u2L",
        phone: "999888777",
        email: "u2@email.com",
        isAdmin: false,
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
      firstName: "u1F",
      lastName: "u1L",
      phone: "111222333",
      email: "u1@email.com",
      isAdmin: false,
      buskerId: testBuskers[0],
    });
  });

  test("user with buskerId shows buskerId", async function () {
    let user1 = await User.get("u1");
    let user2 = await User.get("u2");

    expect(user1.buskerId).toBeTruthy();
    expect(user2.buskerId).toBeFalsy();
  });

  test("not found if no such user", async function () {
    try {
      await User.get("noSuchUser");
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});

/************************************** update */

describe("update", function () {
  const updateData = {
    username: "newUsername",
    password: "newPassword",
    firstName: "NewF",
    lastName: "NewL",
    phone: "000000000",
    email: "new@email.com",
  };

  test("works", async function () {
    let user = await User.update("u1", updateData);
    expect(user).toEqual({
      username: "newUsername",
      firstName: "NewF",
      lastName: "NewL",
      phone: "000000000",
      email: "new@email.com",
      isAdmin: false,
    });
  });

  test("works: set password", async function () {
    let user = await User.update("u1", { password: "new" });
    expect(user).toEqual({
      username: "u1",
      firstName: "u1F",
      lastName: "u1L",
      phone: "111222333",
      email: "u1@email.com",
      isAdmin: false,
    });
    const found = await db.query("SELECT * FROM users WHERE username = 'u1'");
    expect(found.rows.length).toEqual(1);
    expect(found.rows[0].password.startsWith("$2b$")).toEqual(true);
  });

  test("works: set password", async function () {
    let user = await User.update("u1", { password: "new" });
    expect(user).toEqual({
      username: "u1",
      firstName: "u1F",
      lastName: "u1L",
      phone: "111222333",
      email: "u1@email.com",
      isAdmin: false,
    });
    const found = await db.query("SELECT * FROM users WHERE username = 'u1'");
    expect(found.rows.length).toEqual(1);
    expect(found.rows[0].password.startsWith("$2b$")).toEqual(true);
  });

  test("not found if no such user", async function () {
    try {
      await User.update("nope", {
        firstName: "test",
      });
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });

  test("bad request if no data", async function () {
    expect.assertions(1);
    try {
      await User.update("u1", null);
    } catch (err) {
      expect(err instanceof BadRequestError).toBeTruthy();
    }
  });
});

/************************************** remove */

describe("remove", function () {
  test("works", async function () {
    const removeMessage = await User.remove("u2");
    const res = await db.query("SELECT * FROM users WHERE username='u2'");
    expect(res.rows.length).toEqual(0);
    expect(removeMessage).toEqual("This user was successfully deleted.");
  });

  test("not found if no such user", async function () {
    try {
      await User.remove("noSuchUser");
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});
