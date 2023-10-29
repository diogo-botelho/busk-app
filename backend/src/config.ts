export const PORT = +process.env.PORT || 3001;

export function getDatabaseUri() {
  const dbUser = process.env.DATABASE_USER || "postgres";
  const dbPass = process.env.DATABASE_PASS
    ? encodeURI(process.env.DATABASE_PASS)
    : "password";
  const dbHost = process.env.DATABASE_HOST || "localhost";
  const dbPort = process.env.DATABASE_PORT || 5432;
  const dbTestName = process.env.DATABASE_TEST_NAME || "busk_app_test";
  const dbProdName = process.env.DATABASE_NAME || "busk_app";
  const dbName = process.env.NODE_ENV === "test" ? dbTestName : dbProdName;

  return (
    process.env.DATABASE_URL ||
    `postgresql://${dbUser}:${dbPass}@${dbHost}:${dbPort}/${dbName}`
  );

}

export const SECRET_KEY = process.env.SECRET_KEY || "secret key";

export const BCRYPT_WORK_FACTOR = process.env.NODE_ENV === "test" ? 1 : 12;
