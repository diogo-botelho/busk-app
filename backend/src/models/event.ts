/** Event model.
 *
 **/

import db from "../db";
import { BadRequestError, NotFoundError } from "../expressError";
import { sqlForPartialUpdate } from "../helpers/sql";
import { EventData } from "../interfaces/EventData";

const requiredFields: (keyof EventData)[] = [
  "title",
  "date",
  "startTime",
  "endTime",
];

export class Event {
  /** Get all events
   *
   * Returns [{id, busker_id, title, type}...]
   */
  static async getAll() {
    const result = await db.query(
      `SELECT events.id, 
              busker_id AS "buskerId",
              buskers.busker_name as "buskerName",
              title,
              type,
              date,
              start_time AS "startTime",
              end_time AS "endTime",
              coordinates
        FROM events
        JOIN buskers on buskers.id = events.busker_id`,
    );

    return result.rows;
  }

  /** get event by id:
   * returns {id, busker_id, title, type } */
  static async getById(id: number) {
    const result = await db.query(
      `SELECT events.id, 
              busker_id AS "buskerId",
              buskers.busker_name as "buskerName",
              title,
              type,
              date,
              start_time AS "startTime",
              end_time AS "endTime",
              coordinates
        FROM events
        JOIN buskers on buskers.id = events.busker_id
        WHERE events.id = $1`,
      [id],
    );
    const event = result.rows[0];

    if (!event) throw new NotFoundError(`No such event: ${id}`);
    return event;
  }

  /** get all event ids for a particular busker id:
   * returns [eventId, eventId,...]
   * */
  static async getAllEventIdsByBuskerId(buskerId: number) {
    const result = await db.query(
      `SELECT id
            FROM events
            WHERE busker_id = $1`,
      [buskerId],
    );

    let eventIds = [];
    for (const event of result.rows) {
      eventIds.push(event.id);
    }

    return eventIds;
  }

  /** create an event: returns { id, bukserId, title, type } */
  static async create(eventData: EventData) {
    if (Object.keys(eventData).length < 7) {
      throw new BadRequestError("Invalid Data.");
    }

    const { buskerId, title, type, date, startTime, endTime } = eventData;

    for (const field of requiredFields) {
      const value = eventData[field];
      if (typeof value === "string" && value.length === 0) {
        throw new BadRequestError(`Empty ${field}.`);
      }
    }

    const coordinates = JSON.stringify(eventData.coordinates);

    const result = await db.query(
      `INSERT INTO events (busker_id, title, type, date, start_time, end_time, coordinates)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING id, busker_id AS "buskerId", title, type, date, start_time AS "startTime", end_time AS "endTime", coordinates`,
      [buskerId, title, type, date, startTime, endTime, coordinates],
    );

    const event = result.rows[0];
    return event;
  }

  /** Update an event: returns { id, buskerId, title, type } */
  static async update(id: number, data: EventData) {
    if (!data) throw new BadRequestError("Invalid Data.");

    const { setCols, values } = sqlForPartialUpdate(data, {
      buskerId: "busker_id",
      startTime: "start_time",
      endTime: "end_time",
    });

    for (const field of requiredFields) {
      const value = data[field];
      if (typeof value === "string" && value.length === 0) {
        throw new BadRequestError(`Empty ${field}.`);
      }
    }

    const eventVarIdx = "$" + (values.length + 1);

    const querySql = `WITH updated_event as (
              UPDATE events
              SET ${setCols} 
              WHERE id = ${eventVarIdx} 
              RETURNING id, 
                        busker_id, 
                        title, 
                        type, 
                        date,
                        start_time,
                        end_time,
                        coordinates)
            SELECT  updated_event.id, 
                    busker_id AS "buskerId", 
                    busker_name AS "buskerName",
                    title, 
                    type, 
                    date,
                    start_time AS "startTime",
                    end_time AS "endTime",
                    coordinates
            FROM updated_event
            JOIN buskers ON buskers.id = updated_event.busker_id`;

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
      [id],
    );

    const event = result.rows[0];

    if (!event) throw new NotFoundError(`No such event.`);
  }
}
