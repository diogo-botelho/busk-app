import { User } from "./user";
import db from "../db";
import {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  testUsers,
  testBuskers,
} from "./_testCommon";
import { NotFoundError, BadRequestError } from "../expressError";

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

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
    expect(user).toEqual({
      id: expect.any(Number),
      username: "new",
      firstName: "Test",
      lastName: "Tester",
      phone: "123456789",
      email: "test@test.com",
      isAdmin: false,
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
    await User.remove("u2");
    const res = await db.query("SELECT * FROM users WHERE username='u2'");
    expect(res.rows.length).toEqual(0);
  });

  test("not found if no such user", async function () {
    try {
      await User.remove("noSuchUser");
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });

  test("bad request if deleting user with buskerId", async function () {
    try {
      await User.remove("u1");
    } catch (err) {
      expect(err instanceof BadRequestError).toBeTruthy();
    }
  });
});
