import express from "express";
import cors from "cors";
import "dotenv/config";
import { connectDB } from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import resumeRoutes from "./routes/resumeRoutes.js";

import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(cors());

//connectDB
connectDB();

//Middleware
app.use(express.json());
app.use("/api/auth", userRoutes);
app.use("/api/resume", resumeRoutes);
app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"), {
    setHeaders: (res, _path) => {
      res.set("Acess-Control-Allow-Origin", "http://localhost:5173");
    },
  })
);

//routes
app.get("/", function (req, res) {
  res.send("API WORKING");
});

//lisening the server
app.listen(PORT, function () {
  console.log(`Server is running on port http://localhost:${PORT}`);
});
