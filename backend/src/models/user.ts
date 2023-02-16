/** User model.
 *
 * User model
 *
 **/

import db from "../db";
import { NotFoundError } from "../expressError";
import { sqlForPartialUpdate } from "../helpers/sql";

// const db = require("../db");
// const { NotFoundError } = require("../expressError");

interface UserData {
  firstName?: string;
  lastName?: string;
  phone?: string;
  email?: string;
}

export class User {
  static async authenticate(username: string) {
    // try to find the user first
    const result = await db.query(
      `SELECT username,
                  first_name AS "firstName",
                  last_name AS "lastName",
                  email,
                  phone
           FROM users
           WHERE username = $1`,
      [username]
    );

    const user = result.rows[0];
    // if (user) {
    //   // compare hashed password to a new hash from password
    //   const isValid = await bcrypt.compare(password, user.password);
    //   if (isValid === true) {
    //     delete user.password;
    //     return user;
    //   }
    // }

    return user;
    // throw new UnauthorizedError("Invalid username/password");
  }

  /** get all users: returns [{id, username, first_name, last_name }, ...] */

  static async getAll() {
    const result = await db.query(
      `SELECT id, username, first_name, last_name, phone, email
             FROM users
             ORDER BY id`
    );
    return result.rows;
  }

  /** get user by id: returns {username, first_name, last_name, phone, email } */

  static async getById(id: number) {
    const result = await db.query(
      `SELECT id, username, first_name, last_name, phone, email
            FROM users
            WHERE id = $1`,
      [id]
    );
    const user = result.rows[0];

    if (!user) throw new NotFoundError(`No such user: ${id}`);
    return user;
  }

  /** create a user: returns { username, first_name, last_name } */

  static async register(
    username: string,
    firstName: string,
    lastName: string,
    phone: string,
    email: string
  ) {
    const result = await db.query(
      `INSERT INTO users (username, first_name, last_name, phone, email)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING id, username, first_name AS "firstName", last_name AS "lastName", phone, email`,
      [username, firstName, lastName, phone, email]
    );

    const user = result.rows[0];

    return user;
  }

  /** Update a user: returns { username, first_name, last_name, phone, email } */

  static async update(username: string, data: UserData): Promise<UserData> {
    const { setCols, values } = sqlForPartialUpdate(data, {
      firstName: "first_name",
      lastName: "last_name",
    });
    const usernameVarIdx = "$" + (values.length + 1);

    const querySql = `UPDATE users
            SET ${setCols} 
            WHERE username = ${usernameVarIdx} 
            RETURNING id, username, first_name as "firstName", last_name AS "lastName", phone, email`;

    const result = await db.query(querySql, [...values, username]);
    const user = result.rows[0];

    if (!user) throw new NotFoundError(`No user: ${username}`);

    return user;
  }

  /** delete user given id */

  static async remove(id: number) {
    const result = await db.query(
      `DELETE
            FROM users
            WHERE id = $1
            RETURNING id`,
      [id]
    );

    const user = result.rows[0];

    if (!user) throw new NotFoundError(`No such user: ${1}`);
  }
}
