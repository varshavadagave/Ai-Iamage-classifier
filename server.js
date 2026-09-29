import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = 3000;

// Serve the frontend folder
app.use(express.static(path.join(__dirname, "..", "frontend")));

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
