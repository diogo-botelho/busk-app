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
import { Busker } from "./busker";

export class User {
  /** authenticate user with email, password.
   *
   * Returns { email, first_name, last_name, is_admin }
   *
   * Throws UnauthorizedError is user not found or wrong password.
   **/

  static async authenticate(email: string, password: string) {
    // try to find the user first
    const result = await db.query(
      `SELECT id,
              email,
              password,
              first_name AS "firstName",
              last_name AS "lastName",
              phone,
              is_admin AS "isAdmin"
           FROM users
           WHERE email = $1`,
      [email]
    );

    const user = result.rows[0];

    if (user) {
      const isValid = await bcrypt.compare(password, user.password);
      if (isValid === true) {
        delete user.password;
        return user;
      }
    }
    throw new UnauthorizedError("Invalid email/password");
  }

  /** Signup user with data.
   *
   * Returns { email, firstName, lastName, phone, isAdmin }
   *
   * Throws BadRequestError on duplicates.
   **/

  static async signup(userData: UserData) {
    const { email, password, firstName, lastName, phone, isAdmin } = userData;
    const duplicateCheck = await db.query(
      `SELECT email
       FROM users
       WHERE email = $1`,
      [email]
    );

    if (duplicateCheck.rows[0]) {
      throw new BadRequestError(`Duplicate email: ${email}`);
    }
    const hashedPassword = await bcrypt.hash(password, BCRYPT_WORK_FACTOR);

    const result = await db.query(
      `INSERT INTO users (
        email,
        password, 
        first_name,
        last_name,
        phone,
        is_admin)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id, email, first_name AS "firstName", last_name AS "lastName", phone, is_admin as "isAdmin"`,
      [email, hashedPassword, firstName, lastName, phone, isAdmin]
    );
    const user = result.rows[0];

    return user;
  }

  /** Get all users.
   *
   *  Returns [{email, first_name, last_name }, ...]
   * */

  static async getAll() {
    const result = await db.query(
      `SELECT email, 
              first_name as "firstName", 
              last_name as "lastName", 
              phone
             FROM users
             ORDER BY id`
    );
    return result.rows;
  }

  /** Get user by id.
   *
   *  Returns {id, email, first_name, last_name, phone, isAdmin }
   *
   *  If user has busker accounts, returns
   *  {id, email, first_name, last_name, phone, isAdmin, [buskerName, buskerName]}
   * */

  static async get(id: number) {
    const result = await db.query(
      `SELECT id,
              email, 
              first_name as "firstName", 
              last_name as "lastName", 
              phone
            FROM users
            WHERE id = $1`,
      [id]
    );
    const user = result.rows[0];

    if (!user) throw new NotFoundError(`No such user: ${id}`);

    user.buskerNames = await Busker.getAllBuskerNamesByUserId(id);
    user.buskerId = await Busker.getBuskerIdByUserId(id);
    return user;
  }

  /** Update user data with `data`.
   *
   * This is a "partial update" --- it's fine if data doesn't contain
   * all the fields; this only changes provided ones.
   *
   * Data can include:
   *   { email, firstName, lastName, password, phone }
   *
   * Returns { email, first_name, last_name, phone, phone }
   *
   * Throws NotFoundError if not found.
   *
   * WARNING: this function can set a new password or make a user an admin.
   * Callers of this function must be certain they have validated inputs to this
   * or a serious security risks are opened.
   * */

  static async update(id: number, data: UserData): Promise<UserData> {
    if (!data) throw new BadRequestError("Invalid Data.");

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
            RETURNING email, 
                      first_name as "firstName",
                      last_name AS "lastName", 
                      phone`;

    const result = await db.query(querySql, [...values, id]);
    const user = result.rows[0];
    if (!user) throw new NotFoundError(`No user: ${id}`);

    delete user.password;
    return user;
  }

  /** Delete user from database given id; returns undefined.
   */
  static async remove(id: number) {
    const result = await db.query(
      `DELETE
            FROM users
            WHERE id = $1
            RETURNING id`,
      [id]
    );
    const deletedUser = result.rows[0];

    if (!deletedUser) throw new NotFoundError(`No such user.`);

    return "This user was successfully deleted.";
  }
}
