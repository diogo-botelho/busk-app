/** Event model.
 *
 **/

import db from "../db";
import { NotFoundError } from "../expressError";
import { sqlForPartialUpdate } from "../helpers/sql";

interface Coordinates {
  lat: number;
  lng: number;
}

interface EventData {
  buskerId: string;
  title: string;
  type: string;
  coordinates: Coordinates;
}

export class Event {
  /** Get all events
   *
   * Returns [{id, busker_id, title, type}...]
   */
  static async getAll() {
    const result = await db.query(
      `SELECT id, busker_id, title, type, location
          FROM events`
    );

    return result.rows;
  }

  /** get event by id:
   * returns {id, busker_id, title, type } */
  static async getById(id: number) {
    const result = await db.query(
      `SELECT id, busker_id, title, type
        FROM events
        WHERE id = $1`,
      [id]
    );

    const event = result.rows[0];

    if (!event) throw new NotFoundError(`No such event: ${id}`);
    return event;
  }

  /** create an event: returns { id, bukserId, title, type } */
  static async create(eventData:EventData) {
    
    const { buskerId, title, type } = eventData;
    const coordinates = JSON.stringify(eventData.coordinates);

    const result = await db.query(
      `INSERT INTO events (busker_id, title, type, coordinates)
        VALUES ($1, $2, $3, $4)
        RETURNING id, busker_id as "buskerId", title, type, coordinates`,
      [buskerId, title, type, coordinates]
    );

    const event = result.rows[0];
    return event;
  }

  /** Update an event: returns { id, buskerId, title, type } */
  static async update(id: number, data: EventData) {
    const { setCols, values } = sqlForPartialUpdate(data, {
      buskerId: "busker_id",
    });

    const eventVarIdx = "$" + (values.length + 1);

    const querySql = `UPDATE events
            SET ${setCols} 
            WHERE id = ${eventVarIdx} 
            RETURNING id, busker_id as "buskerId", title, type`;

    const result = await db.query(querySql, [...values, id]);
    const event = result.rows[0];

    if (!event) throw new NotFoundError(`No event: ${id}`);

    return event;
  }

  /** delete event for a given id */
  static async remove(id: number) {
    const result = await db.query(
      `DELETE
            FROM events
            WHERE id = $1
            RETURNING id`,
      [id]
    );

    const event = result.rows[0];

    if (!event) throw new NotFoundError(`No such event: ${1}`);
  }
}
