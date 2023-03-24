export const PORT = +process.env.PORT || 3001;

export const DB_URI =
  process.env.NODE_ENV === "test"
    ? "postgresql://diogobotelho:password@localhost/busk_app_test"
    : process.env.DATABASE_URL ||
      "postgresql://diogobotelho:password@localhost/busk_app";
//   "busk_app_test"
// : "busk_app";

export const SECRET_KEY = "secret key";

export const BCRYPT_WORK_FACTOR = process.env.NODE_ENV === "test" ? 1 : 12;
