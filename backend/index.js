import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import Routes from "./routes/route.js";
import "dotenv/config";
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

app.use("/api/v1/", Routes);

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
