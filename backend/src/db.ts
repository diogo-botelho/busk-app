/** Database for Busk */
import { getDatabaseUri } from "./config";
import { Client } from "pg";

const db = new Client({
  connectionString: getDatabaseUri(),
});

db.connect();

export default db;
