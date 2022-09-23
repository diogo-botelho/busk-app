"use strict";

const request = require("supertest");

const app = require("../app");
let db = require("../db");

let diogo = { artist: "Diogo" };

beforeEach(function() {
  db.Busker.add(diogo);
});

afterEach(function() {
  db.Busker.deleteAll();
});

describe("GET /buskers", function() {
  it("Gets a list of buskers", async function() {
    const resp = await request(app).get(`/buskers`);

    expect(resp.body).toEqual({ buskers: [diogo] });
  });
});