/** Busker model.
 *
 **/

import db from "../db";
import bcrypt from "bcrypt";

import { sqlForPartialUpdate } from "../helpers/sql";
import { NotFoundError, BadRequestError } from "../expressError";
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

    const duplicateCheck = await db.query(
      `SELECT busker_name, category
       FROM buskers
       WHERE user_id = $1
       AND busker_name = $2
       AND category=$3
       `,
      [userId, buskerName, category]
    );

    if (duplicateCheck.rows[0]) {
      throw new BadRequestError(
        `Please select a different buskerName or category.`
      );
    }

    const result = await db.query(
      `INSERT INTO buskers (
        user_id,
        busker_name, 
        category,
        description)
      VALUES ($1, $2, $3, $4)
      RETURNING id, user_id AS "userId", busker_name AS "buskerName", category, description`,
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
      `SELECT id,
              user_id AS "userId",
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
      `SELECT id,
              user_id AS "userId",
              busker_name AS "buskerName", 
              category,
              description
            FROM buskers
            WHERE busker_name = $1`,
      [buskerName]
    );
    const busker = result.rows[0];

    if (!busker) throw new NotFoundError(`No such busker: ${buskerName}`);

    return busker;
  }

  static async getAllBuskerNamesByUserId(userId: number) {
    const result = await db.query(
      `SELECT busker_name AS "buskerName"
            FROM buskers
            WHERE user_id = $1`,
      [userId]
    );

    let buskerNames = [];
    for (const busker of result.rows) {
      buskerNames.push(busker.buskerName);
    }

    return buskerNames;
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
   * */

  static async update(
    buskerName: string,
    data: BuskerData
  ): Promise<BuskerData> {
    if (!data) throw new BadRequestError("Invalid Data.");

    const { setCols, values } = sqlForPartialUpdate(data, {
      buskerName: "busker_name",
    });
    const buskerNameVarIdx = "$" + (values.length + 1);

    const querySql = `UPDATE buskers
            SET ${setCols} 
            WHERE busker_name = ${buskerNameVarIdx} 
            RETURNING id, 
                      user_id AS "userId",
                      busker_name as "buskerName",
                      category,
                      description`;

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
            WHERE busker_name = $1
            RETURNING id`,
      [buskerName]
    );

    const busker = result.rows[0];

    if (!busker) throw new NotFoundError(`No such busker: ${buskerName}`);

    return `Busker ${buskerName} was successfully deleted.`;
  }
}
