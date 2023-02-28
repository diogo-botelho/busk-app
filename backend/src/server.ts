import app from "./app";
import { PORT } from "./config";

app.listen(PORT, function () {
  console.log(`Started http://localhost:${PORT}/`);
});