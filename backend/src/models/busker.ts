/** Busker model.
 *
 **/

import db from "../db";
import bcrypt from "bcrypt";

import { sqlForPartialUpdate } from "../helpers/sql";
import { NotFoundError } from "../expressError";
import { BuskerData } from "../interfaces/BuskerData";

export class Busker {
  /** Register busker with data.
   *
   * Takes BuskerData { userId, buskerName, category, description }
   *
   * Returns { id, buskerName, category, description }
   *
   * Throws BadRequestError on duplicates.
   **/

  static async register(buskerData: BuskerData) {
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
   *  Returns [{buskerId, buskerName, category, description }, ...]
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

  /** Get busker by buskerName.
   *
   *  Returns {buskerId, buskerName, category, description }
   * */

  static async get(buskerName: string) {
    const result = await db.query(
      `SELECT id AS "buskerId",
              busker_name AS "buskerName", 
              category,
              description
              FROM buskers
            WHERE buskerName = $1`,
      [buskerName]
    );
    const busker = result.rows[0];

    if (!busker) throw new NotFoundError(`No such busker: ${buskerName}`);

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
   * Returns { buskerId, buskerName, category, description }
   *
   * Throws NotFoundError if not found.
   *
   * WARNING: this function can set a new password or make a user an admin.
   * Callers of this function must be certain they have validated inputs to this
   * or a serious security risks are opened.
   * */

  static async update(
    buskerName: string,
    data: BuskerData
  ): Promise<BuskerData> {
    const { setCols, values } = sqlForPartialUpdate(data, {
      buskerName: "busker_name",
    });
    const buskerNameVarIdx = "$" + (values.length + 1);

    const querySql = `UPDATE buskers
            SET ${setCols} 
            WHERE buskerName = ${buskerNameVarIdx} 
            RETURNING id AS "buskerId", 
                      busker_name as "buskerName",
                      category,
                      description"`;

    const result = await db.query(querySql, [...values, buskerName]);
    const busker = result.rows[0];

    if (!busker) throw new NotFoundError(`No busker: ${buskerName}`);

    return busker;
  }

  /** Delete busker from database given id; returns undefined.
   */

  static async remove(buskerName: string) {
    const result = await db.query(
      `DELETE
            FROM buskers
            WHERE buskerName = $1
            RETURNING id AS "buskerId"`,
      [buskerName]
    );

    const busker = result.rows[0];

    if (!busker) throw new NotFoundError(`No such busker: ${buskerName}`);
  }
}
