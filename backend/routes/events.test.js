// // npm packages2
// const request = require("supertest");

// // app imports
// const app = require("../app");
// const db = require("../db");

// const { NotFoundError } = require("../expressError");

// let testEvent;

// beforeEach(async function () {
//     await db.query("DELETE FROM events");
//     let result = await db.query(`
//     INSERT INTO events (busker_id, title, type)
//     VALUES ('1', 'testEvent','concert')
//     RETURNING id, busker_id, title, type`);
//     testEvent = result.rows[0];
// }); ``

// /** GET /events - returns `{events: [event, ...]}` */

// describe("GET /events", function () {
//     test("Gets a list of 1 event", async function () {
//         const resp = await request(app).get(`/events`);
//         expect(resp.body).toEqual({
//             events: [testEvent],
//         });
//     });
// });

// /** GET /events/[id] - return data about one event: `{event: event}` */

// describe("GET /events/:id", function () {
//     test("Gets single event", async function () {
//         const resp = await request(app).get(`/events/${testEvent.id}`);
//         expect(resp.body).toEqual({ event: testEvent });
//     });

//     // test("Respond with 404 if not found", async function () {
//     //     const resp = await request(app).get(`/events/0`);
//     //     expect(resp.statusCode).toEqual(404);
//     // });
// });

// /** POST /events - create event from data; return `{event: event}` */

// describe("POST /events", function () {
//     test("Create new event", async function () {
//         const resp = await request(app)
//             .post(`/events`)
//             .send({ busker_id: "2", title: "testEvent2", type: "concert" });
//         expect(resp.statusCode).toEqual(201);
//         expect(resp.body).toEqual({
//             event: { id: expect.any(Number), title: "Ezra", type: "event" },
//         });
//     });
// });

// /** PATCH /events/[id] - update event; return `{event: event}` */

// describe("PATCH /events/:id", function () {
//     test("Update a single event", async function () {
//         const resp = await request(app)
//             .patch(`/events/${testEvent.id}`)
//             .send({ title: "patchedEventTest", type: "spoken word" });
//         expect(resp.statusCode).toEqual(200);
//         expect(resp.body).toEqual({
//             event: {
//                 id: testEvent.id,
//                 busker_id: testEvent.busker_id,
//                 title: "patchedEventTest",
//                 type: "spoken word"
//             },
//         });
//     });

//     // test("Respond with 404 if nout found", async function () {
//     //     const resp = await request(app).patch(`/events/0`);
//     //     expect(resp.statusCode).toEqual(404);
//     // });
// });

// /** DELETE /events/[id] - delete event,
// *  return `{message: "event deleted"}` */

// describe("DELETE /events/:id", function () {
//     test("Delete single a event", async function () {
//         const resp = await request(app)
//             .delete(`/events/${testEvent.id}`);
//         expect(resp.statusCode).toEqual(200);
//         expect(resp.body).toEqual({ message: "event deleted" });
//     });
// });

// afterAll(async function () {
//     // close db connection --- if you forget this, Jest will hang
//     await db.end();
//   });