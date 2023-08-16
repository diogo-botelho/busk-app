export const BACKEND_BASE_URL =
  process.env.NODE_ENV === "production"
    ? "https://busk-app-live.fly.dev/"
    : "http://localhost:3001";
