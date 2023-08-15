/** Database for Busk */
import { getDatabaseUri } from "./config";
import { Pool } from "postgres-pool";

const db = new Pool({
  connectionString: getDatabaseUri(),
});

db.on("error", (e) => {
  console.error("DB Error", e);
});

export default db;
