/** User model.
 *
 * User model
 *
 **/

import db from "../db"
import { NotFoundError } from "../expressError"

// const db = require("../db");
// const { NotFoundError } = require("../expressError");

export class User {
    /** get all users: returns [{id, username, first_name, last_name }, ...] */

    static async getAll() {
        const result = await db.query(
            `SELECT id, username, first_name, last_name
             FROM users
             ORDER BY id`);
        return result.rows;
    }

    /** get user by id: returns {username, first_name, last_name} */

    static async getById(id: number) {
        const result = await db.query(
            `SELECT id, username, first_name, last_name
            FROM users
            WHERE id = $1`, [id]);
        const user = result.rows[0];

        if (!user) throw new NotFoundError(`No such user: ${id}`);
        return result.rows[0];
    }

    /** create a user: returns { username, first_name, last_name } */

    static async create(username: string, firstName: string, lastName: string) {
        const result = await db.query(
            `INSERT INTO users (username, first_name, last_name)
            VALUES ($1, $2, $3)
            RETURNING id, username, first_name, last_name`,
            [username, firstName, lastName]);

        const user = result.rows[0];

        return user;
    }

    /** delete user given id */

    static async remove(id: number) {
        const result = await db.query(
            `DELETE
            FROM users
            WHERE id = $1
            RETURNING id`, [id]);

        const user = result.rows[0];

        if (!user) throw new NotFoundError(`No such cat: ${1}`);
    }
}