// npm packages
const request = require("supertest");

// app imports
const app = require("../app");
const db = require("../db");

const { NotFoundError } = require("../expressError");

let testUser;

beforeEach(async function () {
    await db.query("DELETE FROM users");
    let result = await db.query(`
    INSERT INTO users (name)
    VALUES ('testUser')
    RETURNING id, name`);
    testUser = result.rows[0];
}); ``

/** GET /users - returns `{users: [user, ...]}` */

describe("GET /users", function () {
    test("Gets a list of 1 user", async function () {
        const resp = await request(app).get(`/users`);
        expect(resp.body).toEqual({
            users: [testUser],
        });
    });
});

/** GET /users/[id] - return data about one user: `{user: user}` */

describe("GET /users/:id", function () {
    test("Gets single user", async function () {
        const resp = await request(app).get(`/users/${testUser.id}`);
        expect(resp.body).toEqual({ user: testUser });
    });

    // test("Respond with 404 if not found", async function () {
    //     const resp = await request(app).get(`/users/0`);
    //     expect(resp.statusCode).toEqual(404);
    // });
});

/** POST /users - create user from data; return `{user: user}` */

describe("POST /users", function () {
    test("Create new user", async function () {
        const resp = await request(app)
            .post(`/users`)
            .send({ name: "Ezra" });
        expect(resp.statusCode).toEqual(201);
        expect(resp.body).toEqual({
            user: { id: expect.any(Number), name: "Ezra" },
        });
    });
});

/** PATCH /users/[id] - update user; return `{user: user}` */

describe("PATCH /users/:id", function () {
    test("Update a single user", async function () {
        const resp = await request(app)
            .patch(`/users/${testUser.id}`)
            .send({ name: "Troll" });
        expect(resp.statusCode).toEqual(200);
        expect(resp.body).toEqual({
            user: { id: testUser.id, name: "Troll" },
        });
    });

    // test("Respond with 404 if nout found", async function () {
    //     const resp = await request(app).patch(`/users/0`);
    //     expect(resp.statusCode).toEqual(404);
    // });
});

/** DELETE /users/[id] - delete user,
*  return `{message: "user deleted"}` */

describe("DELETE /users/:id", function () {
    test("Delete single a user", async function () {
        const resp = await request(app)
            .delete(`/users/${testUser.id}`);
        expect(resp.statusCode).toEqual(200);
        expect(resp.body).toEqual({ message: "user deleted" });
    });
});

afterAll(async function () {
    // close db connection --- if you forget this, Jest will hang
    await db.end();
  });