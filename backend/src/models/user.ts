/** User model.
 *
 * User model
 *
 **/

import db from "../db";
import bcrypt from "bcrypt";

import { sqlForPartialUpdate } from "../helpers/sql";
import {
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
} from "../expressError";
import { BCRYPT_WORK_FACTOR } from "../config";
import { UserData } from "../interfaces/UserData";

export class User {
  /** authenticate user with username, password.
   *
   * Returns { username, first_name, last_name, email, is_admin }
   *
   * Throws UnauthorizedError is user not found or wrong password.
   **/

  static async authenticate(username: string, password: string) {
    // try to find the user first
    const result = await db.query(
      `SELECT username,
              password,
              first_name AS "firstName",
              last_name AS "lastName",
              email,
              phone,
              is_admin AS "isAdmin"
           FROM users
           WHERE username = $1`,
      [username]
    );

    const user = result.rows[0];
    if (user) {
      const isValid = await bcrypt.compare(password, user.password);
      if (isValid === true) {
        delete user.password;
        return user;
      }
    }

    throw new UnauthorizedError("Invalid username/password");
  }

  /** Register user with data.
   *
   * Returns { username, firstName, lastName, email, phone, isAdmin }
   *
   * Throws BadRequestError on duplicates.
   **/

  static async register(userData: UserData) {
    const { username, password, firstName, lastName, email, phone, isAdmin } =
      userData;
    const duplicateCheck = await db.query(
      `SELECT username
       FROM users
       WHERE username = $1`,
      [username]
    );

    if (duplicateCheck.rows[0]) {
      throw new BadRequestError(`Duplicate username: ${username}`);
    }

    const hashedPassword = await bcrypt.hash(password, BCRYPT_WORK_FACTOR);
    const result = await db.query(
      `INSERT INTO users (
        username,
        password, 
        first_name,
        last_name,
        phone,
        email,
        is_admin)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING id, username, first_name AS "firstName", last_name AS "lastName", phone, email, is_admin as "isAdmin"`,
      [username, hashedPassword, firstName, lastName, phone, email, isAdmin]
    );

    const user = result.rows[0];

    return user;
  }

  /** Get all users.
   *
   *  Returns [{username, first_name, last_name }, ...]
   * */

  static async getAll() {
    const result = await db.query(
      `SELECT username, 
              first_name as "firstName", 
              last_name as "lastName", 
              phone, 
              email,
              is_admin as "isAdmin"
             FROM users
             ORDER BY id`
    );
    return result.rows;
  }

  /** Get user by username.
   *
   *  Returns {username, first_name, last_name, phone, email, isAdmin }
   * */

  static async get(username: string) {
    const result = await db.query(
      `SELECT username, 
              first_name as "firstName", 
              last_name as "lastName", 
              phone, 
              email,
              is_admin as "isAdmin"
            FROM users
            WHERE username = $1`,
      [username]
    );

    const user = result.rows[0];

    if (!user) throw new NotFoundError(`No such user: ${username}`);

    return user;
  }

  /** Update user data with `data`.
   *
   * This is a "partial update" --- it's fine if data doesn't contain
   * all the fields; this only changes provided ones.
   *
   * Data can include:
   *   { username, firstName, lastName, password, email, phone }
   *
   * Returns { username, first_name, last_name, phone, email, phone }
   *
   * Throws NotFoundError if not found.
   *
   * WARNING: this function can set a new password or make a user an admin.
   * Callers of this function must be certain they have validated inputs to this
   * or a serious security risks are opened.
   * */

  static async update(username: string, data: UserData): Promise<UserData> {
    if (data.password) {
      data.password = await bcrypt.hash(data.password, BCRYPT_WORK_FACTOR);
    }

    const { setCols, values } = sqlForPartialUpdate(data, {
      firstName: "first_name",
      lastName: "last_name",
      isAdmin: "is_admin",
    });
    const idVarIdx = "$" + (values.length + 1);

    const querySql = `UPDATE users
            SET ${setCols} 
            WHERE id = ${idVarIdx} 
            RETURNING username, 
                      first_name as "firstName",
                      last_name AS "lastName", 
                      phone, 
                      email,
                      is_admin AS "isAdmin"`;

    const result = await db.query(querySql, [...values, username]);
    const user = result.rows[0];

    if (!user) throw new NotFoundError(`No user: ${username}`);

    delete user.password;
    return user;
  }

  /** Delete user from database given id; returns undefined.
   */

  static async remove(username: string) {
    const result = await db.query(
      `DELETE
            FROM users
            WHERE username = $1
            RETURNING username`,
      [username]
    );

    const user = result.rows[0];

    if (!user) throw new NotFoundError(`No such user: ${1}`);
  }
}
