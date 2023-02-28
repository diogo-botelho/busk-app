export const BACKEND_BASE_URL =
  process.env.NODE_ENV === "production"
    ? "https://busk-app.fly.dev"
    : "http://localhost:3001";