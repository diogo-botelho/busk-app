/** Database for Busk */
import { DB_URI } from "./config";
import { Client } from "pg";

const db = new Client({
  connectionString: DB_URI,
});

db.connect();

export default db;
