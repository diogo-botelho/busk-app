/** Database for Busk */
import { getDatabaseUri, PGPASSWORD } from "./config";
import { Client } from "pg";

const db = new Client({
  connectionString: getDatabaseUri(),
  password: PGPASSWORD,
});

db.connect();

export default db;
