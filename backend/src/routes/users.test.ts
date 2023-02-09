// npm packages
const request = require("supertest");

// app imports
const app = require("../app");
const db = require("../db");

beforeEach(async function () {
    await db.query("DELETE FROM users");
    await db.query("SELECT setval('users_id_seq', 1, false)");
    await db.query(`
        INSERT INTO users (username, first_name, last_name)
        VALUES  ('TestUser1', 'TestFirstName1', 'TestLastName1'),
                ('TestUser2', 'TestFirstName2', 'TestLastName2')`);
});

/** GET /users - returns `{users: [user, ...]}` */

describe("GET /users", function () {
    test("Gets a list of 2 users", async function () {
        const resp = await request(app).get(`/users`);
        expect(resp.body).toEqual([
            {
                id: 1,
                username: "TestUser1",
                first_name: "TestFirstName1",
                last_name: "TestLastName1"
            },
            {
                id: 2,
                username: "TestUser2",
                first_name: "TestFirstName2",
                last_name: "TestLastName2"
            }
        ]);
    });
});

/** GET /users/[id] - return data about one user: `{user: user}` */

describe("GET /users/:id", function () {
    test("Gets single user", async function () {
        const resp = await request(app).get(`/users/1`);
        expect(resp.body).toEqual({
            id: 1,
            username: "TestUser1",
            first_name: "TestFirstName1",
            last_name: "TestLastName1"
        });
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
            .send({
                username: "TestUser3",
                firstName: "TestFirstName3",
                lastName: "TestLastName3"
            });
        expect(resp.statusCode).toEqual(201);
        expect(resp.body).toEqual({
            id: 3,
            username: "TestUser3",
            first_name: "TestFirstName3",
            last_name: "TestLastName3"
        });

        const results = await db.query("SELECT COUNT(*) FROM users");
        expect(results.rows[0].count).toEqual("3");
    });
});

/** PATCH /users/[id] - update user; return `{user: user}` */

describe("PATCH /users/:id", function () {
    test("Update a single user", async function () {
        const resp = await request(app)
            .patch(`/users/1`)
            .send({ firstName: "Troll" });
        expect(resp.statusCode).toEqual(200);
        expect(resp.body).toEqual({
            user: { id: 1, first_name: "Troll" },
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
            .delete(`/users/1`);
        // expect(resp.statusCode).toEqual(200);
        expect(resp.body).toEqual({ message: "User 1 deleted." });

        const results = await db.query("SELECT COUNT(*) FROM users");
        expect(results.rows[0].count).toEqual("1");
    });
});

afterAll(function () {
    // close db connection --- if you forget this, Jest will hang
    db.end();
});