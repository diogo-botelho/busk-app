import { BadRequestError } from "../expressError";

import { UserData } from "../interfaces/UserData";
import { BuskerData } from "../interfaces/BuskerData";

/**
 * Helper for making selective update queries.
 *
 * The calling function can use it to make the SET clause of an SQL UPDATE
 * statement.
 *
 * @param dataToUpdate {Object} {field1: newVal, field2: newVal, ...}
 * @param jsToSql {Object} maps js-style data fields to database column names,
 *   like { firstName: "first_name", age: "age" }
 *
 * @returns {Object} {sqlSetCols, dataToUpdate}
 *
 * @example {firstName: 'Aliya', age: 32} =>
 *   { setCols: '"first_name"=$1, "age"=$2',
 *     values: ['Aliya', 32] }
 */

interface EventData {
  buskerId?: string;
  title?: string;
  type?: string;
}

// interface UserData {
//   firstName?: string;
//   lastName?: string;
//   phone?: string;
//   email?: string;
// }

interface JsToSql {
  [key: string]: string;
  // firstName: string;
  // lastName: string;
}

export function sqlForPartialUpdate(
  dataToUpdate: UserData | EventData | BuskerData,
  jsToSql: JsToSql
) {
  const keys = Object.keys(dataToUpdate);
  if (keys.length === 0) throw new BadRequestError("No data");

  // {firstName: 'Aliya', age: 32} => ['"first_name"=$1', '"age"=$2']
  const cols = keys.map(
    (colName, idx) => `"${jsToSql[colName] || colName}"=$${idx + 1}`
  );

  return {
    setCols: cols.join(", "),
    values: Object.values(dataToUpdate),
  };
}
