import jwt from "jsonwebtoken";
import { UnauthorizedError, ExpressError } from "../expressError";
import {
  authenticateJWT,
  ensureLoggedIn,
  ensureAdmin,
  ensureCorrectUserOrAdmin,
} from "./auth";
import { Request, Response, NextFunction } from "express";

import { SECRET_KEY } from "../config";

const testJwt = jwt.sign({ id: 1, isAdmin: false }, SECRET_KEY);
const badJwt = jwt.sign({ id: 1, isAdmin: false }, "wrong");

describe("authenticateJWT", function () {
  test("works: via header", function () {
    expect.assertions(2);
    const req = {
      headers: { authorization: `Bearer ${testJwt}` },
    };
    const res = { locals: {} };
    const next = function (err: ExpressError) {
      expect(err).toBeFalsy();
    };
    authenticateJWT(req as Request, res as Response, next as NextFunction);
    expect(res.locals).toEqual({
      user: {
        iat: expect.any(Number),
        id: 1,
        isAdmin: false,
      },
    });
  });

  test("works: no header", function () {
    expect.assertions(2);
    const req = {};
    const res = { locals: {} };
    const next = function (err: ExpressError) {
      expect(err).toBeFalsy();
    };
    authenticateJWT(req as Request, res as Response, next as NextFunction);
    expect(res.locals).toEqual({});
  });

  test("works: invalid token", function () {
    expect.assertions(2);
    const req = { headers: { authorization: `Bearer ${badJwt}` } };
    const res = { locals: {} };
    const next = function (err: ExpressError) {
      expect(err).toBeFalsy();
    };
    authenticateJWT(req as Request, res as Response, next as NextFunction);
    expect(res.locals).toEqual({});
  });
});

describe("ensureLoggedIn", function () {
  test("works", function () {
    expect.assertions(1);
    const req = {};
    const res: unknown = { locals: { user: { id: 1 } } };
    const next = function (err: ExpressError) {
      expect(err).toBeFalsy();
    };
    ensureLoggedIn(req as Request, res as Response, next as NextFunction);
  });

  test("unauth if no login", function () {
    expect.assertions(1);
    const req = {};
    const res = { locals: {} };
    const next = function (err: ExpressError) {
      expect(err instanceof UnauthorizedError).toBeTruthy();
    };
    ensureLoggedIn(req as Request, res as Response, next as NextFunction);
  });
});

describe("ensureAdmin", function () {
  test("works", function () {
    expect.assertions(1);
    const req = {};
    const res: unknown = {
      locals: { user: { id: 1, isAdmin: true } },
    };
    const next = function (err: ExpressError) {
      expect(err).toBeFalsy();
    };
    ensureAdmin(req as Request, res as Response, next as NextFunction);
  });

  test("unauth if not admin", function () {
    expect.assertions(1);
    const req = {};
    const res: unknown = {
      locals: { user: { id: 1, isAdmin: false } },
    };
    const next = function (err: ExpressError) {
      expect(err instanceof UnauthorizedError).toBeTruthy();
    };
    ensureAdmin(req as Request, res as Response, next as NextFunction);
  });

  test("unauth if anon", function () {
    expect.assertions(1);
    const req = {};
    const res = { locals: {} };
    const next = function (err: ExpressError) {
      expect(err instanceof UnauthorizedError).toBeTruthy();
    };
    ensureAdmin(req as Request, res as Response, next as NextFunction);
  });
});

describe("ensureCorrectUserOrAdmin", function () {
  test("works: admin", function () {
    expect.assertions(1);
    const req: unknown = { params: { id: 1 } };
    const res: unknown = {
      locals: { user: { id: 1, isAdmin: true } },
    };
    const next = function (err: ExpressError) {
      expect(err).toBeFalsy();
    };
    ensureCorrectUserOrAdmin(
      req as Request,
      res as Response,
      next as NextFunction
    );
  });

  test("works: same user", function () {
    expect.assertions(1);
    const req: unknown = { params: { id: 1 } };
    const res: unknown = {
      locals: { user: { id: 1, isAdmin: false } },
    };
    const next = function (err: ExpressError) {
      expect(err).toBeFalsy();
    };
    ensureCorrectUserOrAdmin(
      req as Request,
      res as Response,
      next as NextFunction
    );
  });

  test("unauth: mismatch", function () {
    expect.assertions(1);
    const req: unknown = { params: { id: 0 } };
    const res: unknown = {
      locals: { user: { id: 1, isAdmin: false } },
    };
    const next = function (err: ExpressError) {
      expect(err instanceof UnauthorizedError).toBeTruthy();
    };
    ensureCorrectUserOrAdmin(
      req as Request,
      res as Response,
      next as NextFunction
    );
  });

  test("unauth: if anon", function () {
    expect.assertions(1);
    const req: unknown = { params: { id: 1 } };
    const res = { locals: {} };
    const next = function (err: ExpressError) {
      expect(err instanceof UnauthorizedError).toBeTruthy();
    };
    ensureCorrectUserOrAdmin(
      req as Request,
      res as Response,
      next as NextFunction
    );
  });
});
