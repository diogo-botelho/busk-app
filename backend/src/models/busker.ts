/** Busker model.
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
import { BuskerData } from "../interfaces/BuskerData";

export class Busker {
  /** Signup busker with data.
   *
   * Takes BuskerData { userId, buskerName, category, description }
   *
   * Returns { id, buskerName, category, description }
   *
   * Throws BadRequestError on duplicates.
   **/

  static async signup(buskerData: BuskerData) {
    const { userId, buskerName, category, description } = buskerData;

    const result = await db.query(
      `INSERT INTO buskers (
        user_id,
        busker_name, 
        category,
        description)
      VALUES ($1, $2, $3, $4)
      RETURNING id AS "buskerId", busker_name AS "buskerName", category, description`,
      [userId, buskerName, category, description]
    );

    const busker = result.rows[0];

    return busker;
  }

  /** Get all buskers.
   *
   *  Returns [{id, buskerName, category, description }, ...]
   * */

  static async getAll() {
    const result = await db.query(
      `SELECT id AS "buskerId",
              busker_name AS "buskerName", 
              category,
              description
            FROM buskers
             ORDER BY id`
    );
    return result.rows;
  }

  /** Get busker by id.
   *
   *  Returns {id, buskerName, category, description }
   * */

  static async get(buskerId: number) {
    const result = await db.query(
      `SELECT id AS "buskerId",
              busker_name AS "buskerName", 
              category,
              description
              FROM buskers
            WHERE id = $1`,
      [buskerId]
    );
    const busker = result.rows[0];

    if (!busker) throw new NotFoundError(`No such busker: ${buskerId}`);

    delete busker.buskerId;

    return busker;
  }

  /** Update busker data with `data`.
   *
   * This is a "partial update" --- it's fine if data doesn't contain
   * all the fields; this only changes provided ones.
   *
   * Data can include:
   *   { buskerName, category, description }
   *
   * Returns { id, buskerName, category, description }
   *
   * Throws NotFoundError if not found.
   *
   * WARNING: this function can set a new password or make a user an admin.
   * Callers of this function must be certain they have validated inputs to this
   * or a serious security risks are opened.
   * */

  static async update(buskerId: number, data: BuskerData): Promise<BuskerData> {
    const { setCols, values } = sqlForPartialUpdate(data, {
      buskerName: "busker_name",
    });
    const idVarIdx = "$" + (values.length + 1);

    const querySql = `UPDATE buskers
            SET ${setCols} 
            WHERE id = ${idVarIdx} 
            RETURNING id AS "buskerId", 
                      busker_name as "buskerName",
                      category,
                      description"`;

    const result = await db.query(querySql, [...values, buskerId]);
    const busker = result.rows[0];

    if (!busker) throw new NotFoundError(`No busker: ${buskerId}`);

    return busker;
  }

  /** Delete busker from database given id; returns undefined.
   */

  static async remove(buskerId: number) {
    const result = await db.query(
      `DELETE
            FROM buskers
            WHERE id = $1
            RETURNING id AS "buskerId"`,
      [buskerId]
    );

    const busker = result.rows[0];

    if (!busker) throw new NotFoundError(`No such busker: ${1}`);
  }
};