const User = require("./user");
const db = require("../db");

beforeEach(async function () {
    await db.query("DELETE FROM users");
    await db.query("SELECT setval('users_id_seq', 1, false)");
    await db.query(`
        INSERT INTO users (username, first_name, last_name)
        VALUES  ('TestUser1', 'TestFirstName1', 'TestLastName1'),
                ('TestUser2', 'TestFirstName2', 'TestLastName2')`);
});

test("getAll", async function () {
    const users = await User.getAll();
    expect(users).toEqual([
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

test("getById", async function () {
    const user = await User.getById(1);
    expect(user).toEqual({
        id: 1,
        username: "TestUser1",
        first_name: "TestFirstName1",
        last_name: "TestLastName1"
    });
});

test("create", async function () {
    const user = await User.create(
        "TestUser3",
        "TestUserFirstName3",
        "TestUserLastName3"
    );
    expect(user).toEqual({
        id: 3,
        username: "TestUser3",
        first_name: "TestUserFirstName3",
        last_name: "TestUserLastName3"
    });

    const results = await db.query("SELECT COUNT(*) FROM users");
    expect(results.rows[0].count).toEqual("3");
})

test("remove", async function () {
    await User.remove(1);
    const results = await db.query("SELECT COUNT(*) FROM users");
    expect(results.rows[0].count).toEqual("1");
});
