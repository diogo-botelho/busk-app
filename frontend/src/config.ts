export const BACKEND_BASE_URL =
  process.env.NODE_ENV === "production"
    ? "https://busk-app.onrender.com"
    : "http://localhost:3001";
