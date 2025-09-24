import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import express from "express";

import router from "./routes/authRoutes";

dotenv.config();
const app = express();
const port = 3001;

app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/api/auth", router);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
